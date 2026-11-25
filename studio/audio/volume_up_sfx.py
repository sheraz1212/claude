"""VOLUME UP - adds this story's new sounds to public/sfx/ and builds the full SFX track.
New sounds are made here from scratch; shared ones (pen, pops, demon stings, thuds...) are
reused from the library. The whispers are pitched-down, echoing synthetic whispers.
Run: python3 audio/volume_up_sfx.py"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190.0
rng = np.random.default_rng(23)

def filt(x, kind, f, o=2): return sosfilt(butter(o, f, kind, fs=SR, output="sos"), x)
def noise(d): return rng.standard_normal(int(SR * d))
def brown(d): x = np.cumsum(noise(d)); return x - np.linspace(x[0], x[-1], len(x))
def tt(d): return np.arange(int(SR * d)) / SR
def norm(x, db): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
def fade(x, a=0.01, r=0.03):
    x = x.copy(); na, nr = max(1, int(SR * a)), max(1, int(SR * r)); x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr); return x
def env(t, pts): return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])
def reverb(x, d=1.6, wet=0.5):
    ir = filt(noise(d) * np.exp(-tt(d) * 5 / d), "low", 3500); w = fftconvolve(x, ir)[: len(x) + int(SR * d)]; w = w / (np.abs(w).max() + 1e-9) * np.abs(x).max()
    out = np.zeros(len(w)); out[: len(x)] += x * (1 - wet * 0.5); return out + w * wet
def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<f4").astype(float)
def load(name):
    with wave.open(os.path.join(SFX, name + ".wav")) as w: return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32767
def place(out, x, at, g=1.0):
    i = int(at * SR); n = min(len(x), len(out) - i)
    if n > 0: out[i:i + n] += x[:n] * g
def fluid(events, dur):
    mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr); tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
    for s, m in sorted(events, key=lambda e: e[0]): tk = int(s * 480); m.time = tk - last; last = tk; tr.append(m)
    a, b = os.path.join(SFX, "_t.mid"), os.path.join(SFX, "_t.wav"); mid.save(a)
    subprocess.run(["fluidsynth", "-ni", "-F", b, "-r", str(SR), "-g", "1", "-o", "synth.reverb.room-size=0.9", "-o", "synth.reverb.level=0.9", SF2, a], check=True, capture_output=True)
    x = decode(b)[: int(SR * dur)]; os.remove(a); os.remove(b); return x
M = mido.Message
L = {}
def add(name, x):
    L[name] = x
    with wave.open(os.path.join(SFX, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


# ---- rooms
def room(d, db, extra=None):
    x = filt(brown(d), "band", [40, 240]); x = x / np.abs(x).max() * 0.5
    if extra: x = extra(x, d)
    return norm(fade(x, 0.4, 0.6), db)
def tick(): one = tt(0.03); return filt(noise(0.03), "band", [2500, 6000]) * np.exp(-one * 160) + np.sin(2 * np.pi * 1800 * one) * np.exp(-one * 200) * 0.5
def clock_extra(x, d):
    for k in np.arange(0.2, d - 0.1, 1.0): place(x, tick() * 0.06, k + rng.uniform(-0.005, 0.005))
    return x
def cutlery_extra(x, d):
    for _ in range(5):
        one = tt(0.18); f = rng.uniform(2600, 4200); s = np.sin(2 * np.pi * f * one) * np.exp(-one * 40) + np.sin(2 * np.pi * f * 1.6 * one) * np.exp(-one * 60) * 0.5; place(x, s * 0.05, rng.uniform(0.3, d - 0.4))
    return x
add("living-amb", room(6.0, -32, clock_extra)); add("dinner-amb", room(5.5, -30, cutlery_extra)); add("room-quiet", room(5.5, -36))
x = np.zeros(int(SR * 3.2))
for k in np.arange(0.1, 3.0, 1.0): place(x, tick(), k)
add("clock-tick", norm(x, -22))
def dishes():
    x = np.zeros(int(SR * 2.5))
    for _ in range(4):
        one = tt(0.3); f = rng.uniform(1800, 3200); s = sum(np.sin(2 * np.pi * f * m * one) * np.exp(-one * dc) for m, dc in ((1, 18), (2.4, 30), (3.9, 45)))
        place(x, s * rng.uniform(0.5, 1), rng.uniform(0, 2.1))
    x += filt(noise(2.5), "band", [900, 6000]) * 0.08 * env(tt(2.5), [(0, 0), (0.3, 1), (2.2, 1), (2.5, 0)])
    return norm(fade(x), -24)
add("dish-clink", dishes())
# ---- the headphones
def leak(d=5.0):     # tinny music leaking out of the cups: thin beat + hiss, band-passed
    t = tt(d); x = np.zeros(len(t)); one = tt(0.12)
    for k in np.arange(0, d, 0.25):
        if int(k * 4) % 2 == 0: place(x, np.sin(2 * np.pi * np.cumsum(np.interp(one, [0, 0.12], [900, 400])) / SR) * np.exp(-one * 30), k)
        place(x, filt(noise(0.05), "band", [5000, 9000]) * np.exp(-tt(0.05) * 90) * 0.5, k + 0.125)
    x += filt(noise(d), "band", [1200, 3500]) * 0.06 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * t))
    return norm(fade(filt(x, "band", [700, 7000]), 0.3, 0.6), -27)
add("phones-leak", leak())
add("vol-tick", norm(fade(tick(), 0.001, 0.005), -21))
def snap(rev=False):
    d = 0.35; t = tt(d); x = filt(noise(d), "band", [400, 3000]) * env(t, [(0, 0), (0.05, 1), (0.25, 0.3), (d, 0)]) * 0.6
    c = tt(0.04); place(x, (filt(noise(0.04), "band", [1500, 5000]) + np.sin(2 * np.pi * 900 * c)) * np.exp(-c * 120), 0.24 if not rev else 0.02)
    return norm(fade(x, 0.003, 0.03), -19)
add("phones-on", snap()); add("phones-off", snap(True))
add("tap", norm(fade((filt(noise(0.05), "band", [1500, 6000]) + np.sin(2 * np.pi * 500 * tt(0.05))) * np.exp(-tt(0.05) * 90), 0.001, 0.01), -20))
t = tt(2.6); ring = np.sin(2 * np.pi * 6800 * t) * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * t)) * env(t, [(0, 0), (0.08, 1), (1.4, 0.5), (2.6, 0)])
add("ear-ring", norm(fade(ring, 0.01, 0.2), -27))
t = tt(1.8); sq = np.sin(2 * np.pi * np.cumsum(3100 + 260 * np.sin(2 * np.pi * 5 * t)) / SR) * env(t, [(0, 0), (0.15, 1), (1.4, 0.8), (1.8, 0)])
add("aid-squeal", norm(fade(sq, 0.05, 0.2), -26))
# ---- objects
def drawer():
    d = 0.7; t = tt(d); x = filt(noise(d), "band", [150, 1400]) * env(t, [(0, 0), (0.06, 1), (0.5, 0.7), (0.62, 0)]) + filt(brown(d), "band", [60, 200]) / 30
    c = tt(0.1); place(x, np.sin(2 * np.pi * 140 * c) * np.exp(-c * 40) * 1.2, 0.58); return norm(fade(x, 0.005, 0.05), -18)
add("drawer", drawer())
def steps():
    d = 5.0; x = np.zeros(int(SR * d)); one = tt(0.12)
    for i in range(int(d / 0.52)):
        s = (filt(noise(0.12), "band", [200, 1500]) * np.exp(-one * 38) + np.sin(2 * np.pi * 85 * one) * np.exp(-one * 30) * 0.6) * rng.uniform(0.6, 1); place(x, s, 0.1 + i * 0.52 + rng.uniform(-0.02, 0.02))
    return norm(fade(x, 0.05, 0.3), -23)
add("steps", steps())
def pencil():
    d = 1.8; t = tt(d); x = np.zeros(len(t))
    for k in np.arange(0, d - 0.2, 0.16):
        n = int(SR * rng.uniform(0.07, 0.13)); seg_ = filt(noise(n / SR), "band", [2000, 7000]) * np.hanning(n); place(x, seg_ * rng.uniform(0.5, 1), k)
    return norm(fade(x), -24)
add("pencil", pencil())
def claps():
    x = np.zeros(int(SR * 2.4)); one = tt(0.08)
    for k in np.arange(0.05, 2.2, 0.36): place(x, filt(noise(0.08), "band", [600, 3200]) * np.exp(-one * 60) * rng.uniform(0.6, 1), k + rng.uniform(-0.02, 0.02))
    return norm(fade(x), -22)
add("clap-soft", claps())
# ---- instruments as effects (FluidSynth): harmonica = Grandpa's song (GM 22), phone chime (GM 10)
TUNE = [(0, 0.5, 69), (0.5, 0.5, 74), (1.0, 1.0, 78), (2.0, 0.5, 76), (2.5, 0.5, 74), (3.0, 1.0, 71), (4.0, 0.5, 74), (4.5, 1.2, 69)]
def harm(notes, dur, vel=86, prog=22, bend=None, db=-15, lp=None):
    ev = [(0, M("program_change", channel=0, program=prog)), (0, M("control_change", channel=0, control=91, value=110))]
    for t0, d, n in notes: ev += [(t0, M("note_on", channel=0, note=n, velocity=int(vel * rng.uniform(0.9, 1.05)))), (t0 + d - 0.02, M("note_off", channel=0, note=n))]
    if bend:
        for s, v in bend: ev.append((s, M("pitchwheel", channel=0, pitch=int(v))))
    x = fluid(ev, dur)
    if lp: x = filt(x, "low", lp)
    return norm(fade(x, 0.01, 0.6), db)
add("harm-tune-1", harm(TUNE, 6.4))
add("harm-tune-2", harm([(t0 * 0.9, d * 0.9, n) for t0, d, n in TUNE] + [(5.2, 0.4, 74), (5.6, 1.0, 78)], 7.2, 92))
add("harm-muffled", harm(TUNE, 6.4, 70, lp=700, db=-24))
add("harm-off", harm(TUNE[:4], 2.8, 84, bend=[(1.1, 0), (1.3, -1500), (1.6, -3000), (2.1, -4200), (2.6, 0)]))
add("harm-down", harm([(0, 1.2, 62), (0, 1.2, 66)], 2.2, 50, db=-24))
sq = [(0, 0.3, 69), (0.35, 0.25, 71), (0.65, 0.4, 70), (1.1, 0.2, 74), (1.35, 0.5, 77), (1.9, 0.6, 78)]
add("harm-squeak", harm(sq, 3.0, 100, bend=[(0.6, -1200), (0.9, 0), (1.3, 1800), (1.7, 0)], db=-16))
duet = TUNE + [(t0 + 6.0 * 0, d, n - 4 if n in (78, 74) else n - 3) for t0, d, n in TUNE]
add("harm-duet", harm(TUNE + [(t0, d, n - 5) for t0, d, n in TUNE], 6.6, 82))
ev = [(0, M("program_change", channel=0, program=10))]
for s, n in ((0, 88), (0.18, 84)): ev += [(s, M("note_on", channel=0, note=n, velocity=70)), (s + 0.5, M("note_off", channel=0, note=n))]
add("phone-warn", norm(fade(fluid(ev, 1.4), 0.002, 0.3), -20))

# ---- the inner voice
def whisper(text, speed=85):
    p = os.path.join(SFX, "_w.wav"); subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", str(speed), "-p", "5", "-w", p, text], check=True)
    x = decode(p); os.remove(p); x = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)
    x = filt(filt(x, "low", 3200), "high", 160); x = x / np.abs(x).max(); out = np.zeros(len(x) + int(SR * 2.4))
    for dl, g in ((0, 1), (0.36, 0.42), (0.72, 0.2), (1.08, 0.09)): place(out, x, dl, g)
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)

add("whisper-boring", whisper("he is boring")); add("whisper-turnitup", whisper("turn it up")); add("whisper-toolate", whisper("too late"))
add("whisper-backon", whisper("put them back on")); add("whisper-canthear", whisper("he can't hear you")); add("whisper-weaker", whisper("weaker", 70)); add("whisper-onesong", whisper("just one song"))

for n in ("pen-write", "pop-8bit-1", "pop-8bit-2", "pop-8bit-3", "demon-8bit-1", "demon-8bit-2", "demon-8bit-3", "night-amb", "bus-ride", "paper-crinkle", "cloth-rustle",
          "low-thud", "piano-low-hit", "demon-brass", "celesta-sparkle", "shatter", "timpani-boom", "heartbeat", "room-tone"): L[n] = load(n)

# ---- the full track on the picture's clock
ev = []
for i in range(1, 7): ev += json.loads(subprocess.run(["node", "render.js", f"volume-up/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()}).stdout)
missing = sorted({n for _, n, _ in ev} - set(L)); assert not missing, missing
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name] * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), gain)
pk = np.abs(mix).max()
if pk > 0.89: mix *= 0.89 / pk
os.makedirs(os.path.join(ROOT, "out", "parts"), exist_ok=True)
with wave.open(os.path.join(ROOT, "out", "parts", "vu_sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
