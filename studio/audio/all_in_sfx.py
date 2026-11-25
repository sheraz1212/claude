"""ALL IN - adds this story's new sounds to public/sfx/ and builds the full SFX track.
New sounds are made here from scratch; shared ones (pen, pops, demon stings, thuds...) are
reused from the library. The whispers are pitched-down, echoing synthetic whispers.
Run: python3 audio/all_in_sfx.py"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190.0
rng = np.random.default_rng(57)

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
def fridge(x, d): return x + np.sin(2 * np.pi * 58 * tt(d)) * 0.03 + filt(noise(d), "band", [100, 400]) * 0.03
def murmur(x, d): return x + filt(noise(d), "band", [250, 1800]) * 0.12 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * tt(d)))
def gym(x, d):
    x = murmur(x, d) * 1.3
    for _ in range(4):
        one = tt(0.15); s = np.sin(2 * np.pi * rng.uniform(2200, 3000) * one) * np.exp(-one * 40) * 0.04; place(x, s, rng.uniform(0.2, d - 0.3))   # sneaker squeaks
    return x
def kids(x, d): return x + filt(noise(d), "band", [600, 3000]) * 0.06 * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 0.9 * tt(d))))
def thud(d, f0, f1, db, click=0.3):
    t = tt(d); x = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [f0, f1])) / SR) * np.exp(-t * 18) + filt(noise(d), "band", [500, 3000]) * np.exp(-t * 60) * click
    return norm(fade(x, 0.002, 0.03), db)
def crackle(d, band, db, dens=0.006):
    t = tt(d); imp = (rng.random(len(t)) < dens) * rng.uniform(0.2, 1, len(t)); x = filt(np.convolve(imp, np.exp(-np.arange(60) / 8), "same") * noise(d), "band", band)
    return norm(fade(x * env(t, [(0, 0), (0.05, 1), (d * 0.7, 0.8), (d, 0)])), db)

add("apt-amb", room(6.0, -32, fridge)); add("wh-amb", room(5.5, -27, lambda x, d: murmur(x, d) + filt(noise(d), "band", [80, 300]) * 0.08)); add("street-amb", room(5.5, -30, lambda x, d: x + filt(brown(d), "band", [60, 400]) / 60 + filt(noise(d), "band", [300, 1500]) * 0.03))
def tvcrowd(d=5.0):   # a game on TV: crowd murmur through a small speaker
    t = tt(d); x = filt(noise(d), "band", [400, 2600]) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t) * np.sin(2 * np.pi * 0.11 * t)); return norm(fade(filt(x, "band", [500, 3500]), 0.4, 0.6), -30)
add("crowd-tv", tvcrowd())
L["tv-cheer"] = norm(filt(load("crowd-cheer"), "band", [500, 3500]), -24); L["kids-cheer"] = norm(filt(load("crowd-cheer"), "band", [600, 4000]), -25)
def fl(notes, prog, dur, db, vel=80, rev=100):
    ev = [(0, M("program_change", channel=0, program=prog)), (0, M("control_change", channel=0, control=91, value=rev))]
    for s, d, n in notes: ev += [(s, M("note_on", channel=0, note=n, velocity=int(vel * rng.uniform(0.92, 1.05)))), (s + d, M("note_off", channel=0, note=n))]
    return norm(fade(fluid(ev, dur), 0.002, 0.3), db)
add("win-chime", fl([(0, 0.15, 76), (0.08, 0.15, 79), (0.16, 0.15, 84), (0.24, 0.6, 88)], 8, 1.4, -16))           # celesta: a bright little win
add("lose-tone", fl([(0, 0.35, 64), (0.3, 0.7, 59)], 11, 1.4, -21, 70))                                            # vibraphone: falling
add("bet-placed", fl([(0, 0.12, 81), (0.1, 0.25, 86)], 10, 0.8, -22, 70))                                          # music box: two clicks up
add("phone-ring", fl([(i * 0.6 + k * 0.08, 0.07, n) for i in range(3) for k, n in enumerate((83, 88, 83, 88))], 10, 2.2, -22, 70))
add("alarm", fl([(i * 0.25, 0.12, 88) for i in range(8) if i % 4 != 3], 80, 2.2, -21, 70))
add("atm-beeps", fl([(i * 0.22, 0.09, 93) for i in range(4)], 80, 1.2, -24, 60))
add("atm-deny", fl([(0, 0.25, 58), (0.28, 0.45, 55)], 80, 1.0, -20, 70))
def coins_(n=10, d=1.4, db=-18):
    x = np.zeros(int(SR * d)); one = tt(0.25)
    for i in range(n):
        f = rng.uniform(3000, 5200); s = sum(np.sin(2 * np.pi * f * m * one) * np.exp(-one * dc) for m, dc in ((1, 26), (1.48, 34), (2.31, 45))) * rng.uniform(0.4, 1); place(x, s, rng.uniform(0, d - 0.3))
    return norm(fade(x, 0.002, 0.2), db)
add("coins", coins_()); add("coin-rain", coins_(60, 4.8, -20))
add("msg-send", norm(fade(filt(noise(0.25), "band", [800, 4000]) * env(tt(0.25), [(0, 0), (0.05, 1), (0.25, 0)])), -24))
add("phone-tap-soft", thud(0.05, 900, 600, -28, 0.4))
add("boom-loss", norm(fade(reverb(np.sin(2 * np.pi * np.cumsum(np.interp(tt(2.6), [0, 2.6], [70, 28])) / SR) * np.exp(-tt(2.6) * 1.8) + filt(brown(2.6), "band", [30, 140]) / 15 * np.exp(-tt(2.6)), 1.6, 0.4), 0.003, 0.5), -9))
add("box-thud", thud(0.3, 140, 70, -15, 0.6)); add("keys", coins_(5, 0.6, -22))
add("delete-poof", norm(fade(filt(noise(0.45), "band", [800, 5000]) * env(tt(0.45), [(0, 0), (0.03, 1), (0.45, 0)])), -22))
add("blow-dust", norm(fade(filt(noise(0.9), "band", [500, 3000]) * env(tt(0.9), [(0, 0), (0.15, 1), (0.6, 0.5), (0.9, 0)])), -22))

# ---- the inner voice
def whisper(text, speed=85):
    p = os.path.join(SFX, "_w.wav"); subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", str(speed), "-p", "5", "-w", p, text], check=True)
    x = decode(p); os.remove(p); x = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)
    x = filt(filt(x, "low", 3200), "high", 160); x = x / np.abs(x).max(); out = np.zeros(len(x) + int(SR * 2.4))
    for dl, g in ((0, 1), (0.36, 0.42), (0.72, 0.2), (1.08, 0.09)): place(out, x, dl, g)
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)



for k, txt in (("skill", "it's skill, not luck"), ("winback", "win it back"), ("due", "you're due"), ("double", "just double it"), ("onegame", "just one game")): add("whisper-" + k, whisper(txt))
for n in ("ball-bounce", "celesta-sparkle", "count-tick", "court-amb", "demon-8bit-1", "demon-8bit-2", "demon-8bit-3", "demon-brass", "hall-amb", "heartbeat", "low-thud", "morning-amb", "msg-tick", "net-swish", "night-amb",
          "paper-crush", "paper-rip", "pen-write", "piano-low-hit", "piano-tear-note", "pop-8bit-1", "pop-8bit-2", "pop-8bit-3", "room-quiet", "sniffle", "steps", "tap", "whisper-nobody", "room-tone"): L[n] = load(n)
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
ev = []
for i in range(1, 7): ev += json.loads(subprocess.run(["node", "render.js", f"all-in/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
missing = sorted({n for _, n, _ in ev} - set(L)); assert not missing, missing
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name] * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), gain)
pk = np.abs(mix).max()
if pk > 0.89: mix *= 0.89 / pk
with wave.open(os.path.join(ROOT, "out", "parts", "ai_sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
