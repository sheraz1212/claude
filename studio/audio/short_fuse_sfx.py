"""SHORT FUSE - adds this story's new sounds to public/sfx/ and builds the full SFX track.
New sounds are made here from scratch; shared ones (pen, pops, demon stings, thuds...) are
reused from the library. The whispers are pitched-down, echoing synthetic whispers.
Run: python3 audio/short_fuse_sfx.py"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190.0
rng = np.random.default_rng(41)

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
add("kitchen-amb", room(6.0, -31, fridge)); add("kitchen-night", room(6.0, -33, fridge)); add("room-quiet", room(5.5, -36)); add("hall-amb", room(5.5, -33))
add("gym-amb", room(5.5, -26, gym)); add("park-amb", room(5.5, -30, lambda x, d: x + filt(noise(d), "band", [2000, 6000]) * 0.02))
add("kids-play", norm(fade(kids(np.zeros(int(SR * 4)), 4), 0.4, 0.6), -28))
# ---- the fuse
def hiss(d=3.0):
    t = tt(d); x = filt(noise(d), "band", [2500, 9000]) * (0.75 + 0.25 * rng.standard_normal(len(t)).clip(-1, 1))
    imp = (rng.random(len(t)) < 0.003) * rng.uniform(0.3, 1, len(t)); x += filt(np.convolve(imp, np.exp(-np.arange(80) / 10), "same") * noise(d), "band", [3000, 9000]) * 3
    return norm(fade(x, 0.05, 0.3), -24)
add("fuse-hiss", hiss())
def light():
    d = 0.5; t = tt(d); x = filt(noise(d), "band", [1500, 8000]) * env(t, [(0, 0), (0.01, 1), (0.08, 0.5), (0.5, 0)]); c = tt(0.02); place(x, filt(noise(0.02), "band", [3000, 9000]) * 2, 0.0)
    return norm(fade(x, 0.001, 0.05), -20)
add("fuse-light", light())
def fizz(d=0.6, db=-23):
    t = tt(d); x = filt(noise(d), "band", [3000, 9000]) * np.exp(-t * 6); return norm(fade(x, 0.005, 0.1), db)
add("fizz-out", fizz()); add("smoke-fizz", fizz(1.2, -25))
def boom(d, f0, f1, db, bright=1.0):
    t = tt(d); body = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [f0, f1])) / SR) * np.exp(-t * 3.2)
    crack = filt(noise(d), "band", [300, 5000]) * np.exp(-t * 9) * bright; rumble = filt(brown(d), "band", [30, 160]) * np.exp(-t * 2) / 15
    x = body + crack * 0.8 + rumble; return norm(fade(reverb(x, 1.4, 0.35), 0.002, 0.4), db)
add("boom", boom(2.2, 110, 32, -9)); add("boom-small", boom(1.3, 150, 50, -13, 0.7)); add("boom-big", boom(3.2, 90, 26, -8, 1.3))
# ---- impacts and objects
def thud(d, f0, f1, db, click=0.3):
    t = tt(d); x = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [f0, f1])) / SR) * np.exp(-t * 18) + filt(noise(d), "band", [500, 3000]) * np.exp(-t * 60) * click
    return norm(fade(x, 0.002, 0.03), db)
add("door-slam", norm(fade(reverb(thud(0.5, 120, 45, 0, 0.8), 0.8, 0.3), 0.002, 0.1), -9))
add("door-close-soft", thud(0.3, 140, 70, -20, 0.2)); add("bump", thud(0.25, 160, 80, -15, 0.5)); add("stomp", thud(0.3, 110, 50, -14, 0.4)); add("thump-small", thud(0.25, 180, 90, -17, 0.3))
add("ball-slam", norm(fade(thud(0.4, 220, 90, 0, 0.6) + np.concatenate([np.zeros(int(SR * 0.2)), thud(0.2, 200, 100, -6, 0.4)])[: int(SR * 0.4)], 0.002, 0.05), -11))
def knock(soft=True):
    one = tt(0.12); k = np.sin(2 * np.pi * 170 * one) * np.exp(-one * 45) + filt(noise(0.12), "band", [500, 2200]) * np.exp(-one * 80) * 0.5
    x = np.zeros(int(SR * 0.6)); [place(x, k * rng.uniform(0.8, 1), a) for a in (0, 0.22, 0.42)]; return norm(x, -19 if soft else -14)
add("knock-soft", knock())
add("cup-knock", norm(fade(sum(np.sin(2 * np.pi * f * tt(0.3)) * np.exp(-tt(0.3) * dc) for f, dc in ((900, 30), (1800, 40), (2900, 60))) + thud(0.3, 200, 100, -6), 0.001, 0.05), -17))
def splash_small():
    d = 0.6; t = tt(d); x = filt(noise(d), "band", [500, 5000]) * env(t, [(0, 0), (0.02, 1), (0.25, 0.4), (0.6, 0)]); return norm(fade(x), -20)
add("splash-small", splash_small())
def crackle(d, band, db, dens=0.006):
    t = tt(d); imp = (rng.random(len(t)) < dens) * rng.uniform(0.2, 1, len(t)); x = filt(np.convolve(imp, np.exp(-np.arange(60) / 8), "same") * noise(d), "band", band)
    return norm(fade(x * env(t, [(0, 0), (0.05, 1), (d * 0.7, 0.8), (d, 0)])), db)
add("plastic-crack", norm(fade(crackle(0.3, [1500, 7000], 0, 0.02) + thud(0.3, 300, 140, -4), 0.001, 0.05), -14))
add("paper-crush", crackle(0.8, [1500, 7000], -18, 0.012)); add("ash-crumble", crackle(1.6, [800, 5000], -24, 0.005))
add("frame-rattle", crackle(0.6, [800, 4000], -20, 0.01))
add("chair-creak", norm(fade(np.sin(2 * np.pi * np.cumsum(260 + 60 * np.sin(2 * np.pi * 7 * tt(0.5))) / SR) * filt(noise(0.5), "band", [200, 900]) * env(tt(0.5), [(0, 0), (0.1, 1), (0.4, 0.8), (0.5, 0)])), -26))
add("sizzle-pan", norm(fade(filt(noise(4.0), "band", [2500, 8000]) * (0.8 + 0.2 * rng.standard_normal(int(SR * 4)).clip(-1, 1)), 0.4, 0.6), -29))
add("glue-squeeze", norm(fade(filt(noise(0.7), "band", [300, 1800]) * env(tt(0.7), [(0, 0), (0.1, 1), (0.6, 0.6), (0.7, 0)])), -25))
def steps(d, gap, db, f=85):
    x = np.zeros(int(SR * d)); one = tt(0.12)
    for i in range(int(d / gap)):
        s = (filt(noise(0.12), "band", [200, 1500]) * np.exp(-one * 38) + np.sin(2 * np.pi * f * one) * np.exp(-one * 30) * 0.6) * rng.uniform(0.6, 1); place(x, s, 0.1 + i * gap + rng.uniform(-0.02, 0.02))
    return norm(fade(x, 0.05, 0.3), db)
add("steps", steps(5.0, 0.5, -23)); add("steps-small", steps(4.0, 0.36, -27, 110))
def breath(inn=True):
    d = 1.2 if inn else 1.5; t = tt(d); x = filt(noise(d), "band", [500, 3500]) * (env(t, [(0, 0), (0.7, 1), (1.0, 0.6), (d, 0)]) if inn else env(t, [(0, 0), (0.15, 1), (0.9, 0.5), (d, 0)]))
    return norm(fade(x, 0.02, 0.1), -22)
add("breath-in", breath(True)); add("breath-out", breath(False))
add("sniffle", norm(fade(filt(noise(0.35), "band", [700, 3000]) * env(tt(0.35), [(0, 0), (0.12, 1), (0.25, 0.3), (0.35, 0)])), -25))
def pencil():
    d = 1.8; t = tt(d); x = np.zeros(len(t))
    for k in np.arange(0, d - 0.2, 0.16):
        n = int(SR * rng.uniform(0.07, 0.13)); place(x, filt(noise(n / SR), "band", [2000, 7000]) * np.hanning(n) * rng.uniform(0.5, 1), k)
    return norm(fade(x), -24)
add("pencil", pencil())
def launch():
    d = 2.6; t = tt(d); x = filt(noise(d), "band", [800, 6000]) * env(t, [(0, 0), (0.05, 1), (1.2, 0.6), (d, 0)]) + filt(brown(d), "band", [60, 300]) / 20 * np.exp(-t * 2)
    pop = thud(0.2, 300, 150, 0, 0.8); place(x, pop * 0.8, 0); return norm(fade(x, 0.002, 0.4), -15)
add("rocket-launch", launch())
L["kids-cheer"] = filt(load("crowd-cheer"), "band", [500, 4000]) * 0.7
# ---- 8-bit game sounds on his screen
def sq(f, d, v=0.4): t = tt(d); return np.sign(np.sin(2 * np.pi * f * t)) * v * np.exp(-t * 3)
def seq(notes):
    x = np.zeros(int(SR * sum(d for _, d in notes) + 0.2)); at = 0
    for f, d in notes: place(x, fade(sq(f, d), 0.002, 0.01), at); at += d
    return x
add("game-beeps", norm(filt(np.concatenate([seq([(660, 0.08), (0, 0.1), (880, 0.08), (0, 0.3)]) for _ in range(5)]), "low", 5000), -27))
add("game-lose", norm(filt(seq([(523, 0.18), (466, 0.18), (415, 0.18), (330, 0.5)]), "low", 5000), -19))

# ---- the inner voice
def whisper(text, speed=85):
    p = os.path.join(SFX, "_w.wav"); subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", str(speed), "-p", "5", "-w", p, text], check=True)
    x = decode(p); os.remove(p); x = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)
    x = filt(filt(x, "low", 3200), "high", 160); x = x / np.abs(x).max(); out = np.zeros(len(x) + int(SR * 2.4))
    for dl, g in ((0, 1), (0.36, 0.42), (0.72, 0.2), (1.08, 0.09)): place(out, x, dl, g)
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)


for k, txt in (("purpose", "he did it on purpose"), ("cheated", "they cheated"), ("alwaysright", "you're always right"), ("pushyou", "they push you"), ("whoyouare", "that's who you are"),
               ("forgive", "they'll never forgive you"), ("always", "you'll always be like this"), ("throwit", "just throw it"), ("justonce", "just once more")):
    add("whisper-" + k, whisper(txt))

for n in ("pen-write", "pop-8bit-1", "pop-8bit-2", "pop-8bit-3", "demon-8bit-1", "demon-8bit-2", "demon-8bit-3", "night-amb", "morning-amb", "paper-crinkle", "cloth-rustle", "door-open", "crowd-cheer", "crowd-groan",
          "whistle", "ball-bounce", "low-thud", "piano-low-hit", "piano-tear-note", "demon-brass", "celesta-sparkle", "timpani-boom", "heartbeat", "room-tone"): L[n] = load(n)

# ---- the full track on the picture's clock
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
ev = []
for i in range(1, 7): ev += json.loads(subprocess.run(["node", "render.js", f"short-fuse/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
missing = sorted({n for _, n, _ in ev} - set(L)); assert not missing, missing
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name] * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), gain)
pk = np.abs(mix).max()
if pk > 0.89: mix *= 0.89 / pk
with wave.open(os.path.join(ROOT, "out", "parts", "sf_sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
