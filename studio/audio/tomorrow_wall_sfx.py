"""TOMORROW WALL - builds the story's SFX library (public/sfx/) and the full SFX track.
Everything is made here from scratch (numpy), with instruments from FluidSynth as effects
and three CC0 recordings (cloth, door, glass). The whisper is a pitched-down, echoing
synthetic whisper. Sound times come from the clips themselves (sfx(...) calls).
Run: python3 audio/tomorrow_wall_sfx.py <folder with CC0 recordings>"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
REC = sys.argv[1]
DUR = 190.0
rng = np.random.default_rng(3)
os.makedirs(SFX, exist_ok=True)

def filt(x, kind, f, o=2): return sosfilt(butter(o, f, kind, fs=SR, output="sos"), x)
def noise(d): return rng.standard_normal(int(SR * d))
def brown(d): x = np.cumsum(noise(d)); return x - np.linspace(x[0], x[-1], len(x))
def tt(d): return np.arange(int(SR * d)) / SR
def norm(x, db): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
def fade(x, a=0.01, r=0.03):
    x = x.copy(); na, nr = max(1, int(SR * a)), max(1, int(SR * r))
    x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr); return x
def env(t, pts): return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])
def reverb(x, d=1.6, wet=0.5):
    ir = noise(d) * np.exp(-tt(d) * 5 / d); ir = filt(ir, "low", 3500)
    w = fftconvolve(x, ir)[: len(x) + int(SR * d)]; w = w / (np.abs(w).max() + 1e-9) * np.abs(x).max()
    out = np.zeros(len(w)); out[: len(x)] += x * (1 - wet * 0.5); return out + w * wet
def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<f4").astype(float)
def load(name):
    with wave.open(os.path.join(SFX, name + ".wav")) as w: return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32767
def fluid(events, dur, room=0.9):
    """events: (seconds, mido message). Returns a mono render."""
    mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
    tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
    for s, m in sorted(events, key=lambda e: e[0]):
        tk = int(s * 480); m.time = tk - last; last = tk; tr.append(m)
    a, b = os.path.join(SFX, "_t.mid"), os.path.join(SFX, "_t.wav"); mid.save(a)
    subprocess.run(["fluidsynth", "-ni", "-F", b, "-r", str(SR), "-g", "1", "-o", f"synth.reverb.room-size={room}", "-o", "synth.reverb.level=0.9", SF2, a], check=True, capture_output=True)
    x = decode(b)[: int(SR * dur)]; os.remove(a); os.remove(b); return x
M = mido.Message

L = {}
def add(name, x):
    L[name] = x
    with wave.open(os.path.join(SFX, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())

# ---------------------------------------------------------------- paper, pen, phone
def pen_write():
    out = np.zeros(int(SR * 2.3)); t = 0.0
    while t < 2.1:
        d = rng.uniform(0.07, 0.22)
        s = filt(noise(d), "band", [2200, 7500]) * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(18, 40) * tt(d)) ** 2)
        s = fade(s * np.hanning(len(s)) ** 0.5, 0.008, 0.02) * rng.uniform(0.5, 1)
        i = int(t * SR); out[i:i + len(s)] += s[: len(out) - i]; t += d + rng.uniform(0.02, 0.12)
    return norm(out, -15)
def phone_buzz(muffled=False):
    d = 0.24; t = tt(d)
    one = (np.sign(np.sin(2 * np.pi * 168 * t)) * 0.5 + np.sin(2 * np.pi * 336 * t) * 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 27 * t))
    one += filt(noise(d), "band", [900, 3200]) * 0.25 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 168 * t)))
    one = fade(one, 0.015, 0.04); x = np.concatenate([one, np.zeros(int(SR * 0.13)), one])
    return norm(filt(x, "low", 450 if muffled else 2600), -16 if muffled else -13)
def crackle(d, dens0, dens1, lo, hi, tail=25):
    t = tt(d); imp = (rng.random(len(t)) < np.interp(t, [0, d], [dens0, dens1])) * rng.uniform(0.3, 1, len(t))
    return filt(np.convolve(imp, np.exp(-np.arange(200) / tail), "same") * noise(d), "band", [lo, hi])
def paper_peel():
    d = 0.85; t = tt(d); x = crackle(d, 0.004, 0.03, 1500, 6500) * env(t, [(0, 0), (0.1, 0.7), (d * 0.92, 1), (d, 0)]) * 3
    x += filt(noise(d), "band", [2500, 6000]) * env(t, [(0, 0.05), (d * 0.9, 0.3), (d, 0)])
    snap = fade(filt(noise(0.05), "band", [1800, 8000]) * np.exp(-tt(0.05) * 70), 0.001, 0.01); x[-len(snap) - 400:-400] += snap * 4
    return norm(x, -13)
def paper_rip():
    d = 0.3; t = tt(d); x = crackle(d, 0.03, 0.06, 1500, 7000, 12) * 2 + filt(noise(d), "band", [2000, 7000]) * 0.5
    return norm(x * env(t, [(0, 0), (0.03, 1), (d * 0.8, 0.8), (d, 0)]), -17)
add("pen-write", pen_write()); add("phone-buzz", phone_buzz()); add("phone-buzz-muffled", phone_buzz(True))
t = tt(0.09); add("msg-tick", norm(np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 60) + 0.5 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t * 80), -22))
add("paper-peel", paper_peel()); add("paper-rip", paper_rip())
add("paper-crinkle", norm(crackle(0.45, 0.012, 0.012, 1200, 5000, 40) * np.hanning(int(SR * 0.45)), -20))
add("cloth-rustle", norm(filt(decode(os.path.join(REC, "cloth2.ogg")), "low", 3000), -22))
add("door-open", norm(decode(os.path.join(REC, "dooropen-1.ogg")), -17))
t = tt(0.07); add("note-slap", norm(fade(filt(noise(0.07), "band", [700, 3200]) * np.exp(-t * 55) + np.sin(2 * np.pi * 170 * t) * np.exp(-t * 40), 0.001, 0.02), -14))
t = tt(0.05); add("count-tick", norm(fade(np.sign(np.sin(2 * np.pi * 990 * t)) * np.exp(-t * 50), 0.001, 0.01), -25))
t = tt(0.32); add("call-connect", norm(np.concatenate([fade(np.sin(2 * np.pi * 440 * t[: int(SR * 0.14)])), np.zeros(int(SR * 0.04)), fade(np.sin(2 * np.pi * 587 * t[: int(SR * 0.14)]))]), -24))

# ---------------------------------------------------------------- ball, body, impacts
def bounce():
    t = tt(0.22); f = np.interp(t, [0, 0.22], [130, 70])
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26) + filt(noise(0.22), "band", [300, 2500]) * np.exp(-t * 90) * 0.5 + np.sin(2 * np.pi * 240 * t) * np.exp(-t * 35) * 0.25
    return norm(fade(x, 0.001, 0.03), -12)
add("ball-bounce", bounce())
t = tt(0.12); add("ball-catch", norm(fade(filt(noise(0.12), "low", 1600) * np.exp(-t * 60) + np.sin(2 * np.pi * 150 * t) * np.exp(-t * 45), 0.001, 0.03), -16))
t = tt(0.35); add("bed-flop", norm(fade(filt(noise(0.35), "low", 320) * np.exp(-t * 14) + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 16), 0.004, 0.05), -15))
t = tt(1.1); add("low-thud", norm(fade(np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, 1.1], [58, 36])) / SR) * np.exp(-t * 4) + filt(noise(1.1), "low", 130) * np.exp(-t * 7) * 0.6, 0.003, 0.2), -8))
def whoosh():
    d = 0.45; t = tt(d); x = sum(filt(noise(d), "band", [f, f * 2.2]) * np.exp(-((t - c) / 0.11) ** 2) for f, c in ((500, 0.16), (1000, 0.22), (2000, 0.28)))
    return norm(fade(x), -22)
add("whoosh-soft", whoosh())
t = tt(0.3); add("net-swish", norm(fade(filt(noise(0.3), "band", [2500, 8000]) * env(t, [(0, 0), (0.03, 1), (0.12, 0.5), (0.3, 0)])), -20))
def shatter():
    g = decode(os.path.join(REC, "impactglass-heavy-002.ogg")); d = 1.3; x = np.zeros(int(SR * d)); x[: min(len(g), len(x))] += g[: len(x)] / np.abs(g).max()
    t = tt(d)
    for _ in range(26):
        s0 = rng.uniform(0, 0.4); f = rng.uniform(2200, 7500); k = (t >= s0) * np.sin(2 * np.pi * f * (t - s0)) * np.exp(-np.maximum(t - s0, 0) * rng.uniform(6, 22)) * rng.uniform(0.05, 0.2); x += k
    x += np.concatenate([fade(filt(noise(0.1), "high", 2000) * np.exp(-tt(0.1) * 40), 0.001, 0.02), np.zeros(len(x) - int(SR * 0.1))]) * 0.8
    return norm(fade(x, 0.001, 0.3), -9)
add("shatter", shatter())

# ---------------------------------------------------------------- ambiences, machines, vehicles
def amb(d, birds=0, crickets=0.0, hum=1.0):
    t = tt(d); x = filt(brown(d), "band", [40, 240]); x = x / np.abs(x).max() * 0.5 * hum
    if crickets:
        c = np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 32 * t) > 0.2) * (np.sin(2 * np.pi * 0.9 * t + 1) > 0.1); x += c * 0.05 * crickets
    for _ in range(birds):
        s0 = rng.uniform(0.2, d - 0.6); n = rng.integers(2, 5); f0 = rng.uniform(2600, 4200)
        for k in range(n):
            tb = tt(0.09); ch = np.sin(2 * np.pi * np.cumsum(np.interp(tb, [0, 0.09], [f0, f0 * rng.uniform(1.15, 1.5)])) / SR) * np.hanning(len(tb)) * rng.uniform(0.04, 0.09)
            i = int((s0 + k * 0.13) * SR); x[i:i + len(ch)] += ch[: len(x) - i]
    return fade(x, 0.4, 0.6)
add("court-amb", norm(amb(6.5, crickets=1), -30)); add("night-amb", norm(amb(5, crickets=0.7), -31)); add("morning-amb", norm(amb(7, birds=7, hum=0.5), -27))
add("room-tone", norm(amb(8, hum=1), -40))
def engine(d, fpts, vpts, lp=1100):
    t = tt(d); ph = 2 * np.pi * np.cumsum(env(t, fpts)) / SR
    e = sum(np.sin(ph * k + k) / k for k in (1, 2, 3, 4, 6)) * (0.75 + 0.25 * np.sin(ph / 3)); r = filt(brown(d), "band", [35, 320]); r /= np.abs(r).max()
    return filt((e * 0.6 + r * 0.5 + filt(noise(d), "band", [300, 1400]) * 0.12) * env(t, vpts), "low", lp)
add("truck-leave", norm(engine(5, [(0, 41), (1, 41), (1.9, 68), (2.6, 58), (5, 74)], [(0, 0), (0.06, 0.55), (1, 0.55), (1.9, 1), (3.2, 0.5), (4.8, 0.08), (5, 0)]), -12))
def bus_arrive():
    x = engine(3.4, [(0, 80), (2.2, 52), (3.4, 40)], [(0, 0), (1.6, 1), (2.6, 0.7), (3.4, 0.25)], 1500); t = tt(0.7)
    h = filt(noise(0.7), "high", 2500) * env(t, [(0, 0), (0.05, 1), (0.7, 0)]); x = x / np.abs(x).max(); x[int(2.6 * SR): int(2.6 * SR) + len(h)] += h * 0.35
    return norm(fade(x, 0.02, 0.3), -14)
add("bus-arrive", bus_arrive())
add("bus-ride", norm(fade(engine(5, [(0, 55), (2.5, 58), (5, 54)], [(0, 1), (5, 1)], 500), 0.25, 0.4), -22))
t = tt(2.5); add("washer-hum", norm(fade((np.sin(2 * np.pi * 100 * t) * 0.4 + filt(noise(2.5), "low", 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 2.4 * t))), 0.15, 0.3), -23))

# ---------------------------------------------------------------- instruments used as effects
def hit(prog, notes, dur, db, ch=0, tail=1.0):
    ev = [(0, M("program_change", channel=ch, program=prog)), (0, M("control_change", channel=ch, control=91, value=127))]
    for n, v, s, d in notes: ev += [(s, M("note_on", channel=ch, note=n, velocity=v)), (s + d, M("note_off", channel=ch, note=n))]
    return norm(fade(fluid(ev, dur), 0.002, tail), db)
add("piano-low-hit", hit(0, [(38, 78, 0, 3), (45, 70, 0.02, 3), (50, 62, 0.04, 3)], 4, -11))
add("piano-tear-note", hit(0, [(69, 52, 0, 3)], 4, -17))
add("timpani-boom", hit(47, [(38, 120, 0, 2), (26, 110, 0, 2)], 3, -8))
add("celesta-sparkle", hit(8, [(89, 70, 0, 1), (93, 72, 0.07, 1), (96, 74, 0.14, 1), (101, 78, 0.21, 1.2)], 2.5, -18))
crash = hit(0, [(49, 105, 0, 2.5)], 3.2, -15, ch=9); add("cymbal-crash", crash)
add("cymbal-swell", norm(fade(crash[: int(SR * 2.2)][::-1].copy(), 0.6, 0.02), -18))
def brass():
    ev = [(0, M("program_change", channel=0, program=57)), (0, M("program_change", channel=1, program=58)), (0, M("control_change", channel=0, control=91, value=110)), (0, M("control_change", channel=1, control=91, value=110))]
    for i in range(40): ev += [(i * 0.07, M("control_change", channel=c, control=11, value=int(20 + 107 * min(1, i / 30) ** 1.5))) for c in (0, 1)]
    ev += [(0, M("note_on", channel=0, note=38, velocity=100)), (0, M("note_on", channel=0, note=39, velocity=90)), (0, M("note_on", channel=1, note=26, velocity=110)), (3.0, M("note_off", channel=0, note=38)), (3.0, M("note_off", channel=0, note=39)), (3.0, M("note_off", channel=1, note=26))]
    return norm(fade(fluid(ev, 4.5), 0.01, 1.2), -10)
add("demon-brass", brass())

# ---------------------------------------------------------------- the inner voice
def whisper():
    p = os.path.join(SFX, "_w.wav")
    subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", "85", "-p", "5", "-w", p, "tomorrow"], check=True)
    x = decode(p); os.remove(p)
    idx = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)           # slower and lower
    x = filt(filt(idx, "low", 3200), "high", 160)
    x = x / np.abs(x).max()
    out = np.zeros(len(x) + int(SR * 2.4))
    for k, (dl, g) in enumerate(((0, 1), (0.33, 0.45), (0.66, 0.22), (0.99, 0.1))): out[int(dl * SR): int(dl * SR) + len(x)] += x * g   # echo
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)
add("whisper-tomorrow", whisper())
for n in ("demon-8bit-1", "demon-8bit-2", "demon-8bit-3", "pop-8bit-1", "pop-8bit-2", "pop-8bit-3"): L[n] = load(n)

# ---------------------------------------------------------------- the full track, on the picture's clock
ev = []
for i in range(1, 7):
    ev += json.loads(subprocess.run(["node", "render.js", f"tomorrow-wall/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
mix = np.zeros(int(SR * DUR))
tone = L["room-tone"]; rt = np.tile(tone, int(DUR / 8) + 1)[: len(mix)]; mix += rt
for at, name, gain in ev:
    x = L[name]; i = int(at * SR); n = min(len(x), len(mix) - i)
    if n > 0: mix[i:i + n] += x[:n] * gain
pk = np.abs(mix).max();
if pk > 0.89: mix *= 0.89 / pk
out = os.path.join(ROOT, "out", "parts", "sfx.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
missing = sorted({n for _, n, _ in ev} - set(L)); print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB", missing)
