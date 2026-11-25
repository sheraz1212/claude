"""REBUILDING - adds this story's new sounds to public/sfx/ and builds the full SFX track.
New sounds are made here from scratch; shared ones (pen, pops, demon stings, thuds...) are
reused from the library. The whispers are pitched-down, echoing synthetic whispers.
Run: python3 audio/excuses_sfx.py"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 160.0
rng = np.random.default_rng(127)

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

def thud(d, f0, f1, db, click=0.3):
    t = tt(d); x = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [f0, f1])) / SR) * np.exp(-t * 18) + filt(noise(d), "band", [500, 3000]) * np.exp(-t * 60) * click
    return norm(fade(x, 0.002, 0.03), db)
def crackle(d, band, db, dens=0.006):
    t = tt(d); imp = (rng.random(len(t)) < dens) * rng.uniform(0.2, 1, len(t)); x = filt(np.convolve(imp, np.exp(-np.arange(60) / 8), "same") * noise(d), "band", band)
    return norm(fade(x * env(t, [(0, 0), (0.05, 1), (d * 0.7, 0.8), (d, 0)])), db)

def fl(notes, prog, dur, db, vel=80, rev=100):
    ev = [(0, M("program_change", channel=0, program=prog)), (0, M("control_change", channel=0, control=91, value=rev))]
    for s, d, n in notes: ev += [(s, M("note_on", channel=0, note=n, velocity=int(vel * rng.uniform(0.92, 1.05)))), (s + d, M("note_off", channel=0, note=n))]
    return norm(fade(fluid(ev, dur), 0.002, 0.3), db)

def sweep(d, f0, f1, db, bw=0.6):
    t = tt(d); x = noise(d); out = np.zeros(len(x)); n = 16; edges = np.linspace(0, len(x), n + 1).astype(int)
    for i in range(n):
        f = f0 + (f1 - f0) * i / (n - 1); lo, hi = f * (1 - bw / 2), f * (1 + bw / 2); seg_ = filt(x, "band", [max(40, lo), min(16000, hi)]); out[edges[i]:edges[i + 1]] = seg_[edges[i]:edges[i + 1]]
    return norm(fade(out * env(t, [(0, 0), (0.1, 1), (d * 0.8, 0.8), (d, 0)]), 0.01, 0.1), db)
def clicks(d, gap, db, band=(1500, 6000)):
    x = np.zeros(int(SR * d)); one = tt(0.03)
    for k in np.arange(0.05, d - 0.05, gap): place(x, filt(noise(0.03), "band", list(band)) * np.exp(-one * 150) * rng.uniform(0.5, 1), k + rng.uniform(-0.03, 0.03))
    return norm(fade(x), db)

# ---- the inner voice
def whisper(text, speed=85):
    p = os.path.join(SFX, "_w.wav"); subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", str(speed), "-p", "5", "-w", p, text], check=True)
    x = decode(p); os.remove(p); x = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)
    x = filt(filt(x, "low", 3200), "high", 160); x = x / np.abs(x).max(); out = np.zeros(len(x) + int(SR * 2.4))
    for dl, g in ((0, 1), (0.36, 0.42), (0.72, 0.2), (1.08, 0.09)): place(out, x, dl, g)
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)









# ---- this film's own sounds
def crack_body():
    d = 0.9; t = tt(d); x = crackle(0.35, [1200, 6000], 0, 0.08); y = np.zeros(int(SR * d)); place(y, x, 0)
    y += np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [120, 50])) / SR) * np.exp(-t * 8) * 0.7
    return norm(fade(reverb(y, 1.2, 0.35), 0.001, 0.2), -13)
add("crack-body", crack_body())
add("chip-fall", norm(fade(np.concatenate([np.zeros(int(SR * 0.35)), crackle(0.15, [2000, 7000], 0, 0.1)]), 0.001, 0.05), -20))
add("zipper", crackle(0.6, [1500, 6000], -24, 0.05))
add("mic-room", room(6.0, -30, lambda x, d: murmur(x, d) * 0.9))
add("string-snap", norm(fade(np.sin(2 * np.pi * np.cumsum(np.interp(tt(0.4), [0, 0.4], [900, 300])) / SR) * np.exp(-tt(0.4) * 14) + filt(noise(0.4), "band", [2000, 7000]) * np.exp(-tt(0.4) * 60) * 0.5, 0.001, 0.05), -14))
def laugh_crowd():
    d = 3.0; x = np.zeros(int(SR * d))
    for _ in range(10): place(x, filt(noise(1.2), "band", [400, 2400]) * np.clip(np.sin(2 * np.pi * rng.uniform(4, 6) * tt(1.2)), 0, 1) ** 2 * env(tt(1.2), [(0, 0), (0.1, 1), (1.2, 0)]), rng.uniform(0, 1.6), rng.uniform(0.4, 1))
    return norm(fade(x, 0.05, 0.4), -19)
add("laugh-crowd", laugh_crowd())
def party_amb():
    d = 6.0; t = tt(d); x = filt(brown(d), "band", [40, 160]) / 30 * (0.4 + 0.6 * (np.sin(2 * np.pi * 2.0 * t) > 0.6)) + filt(noise(d), "band", [300, 2000]) * 0.06
    return norm(fade(x, 0.3, 0.5), -27)
add("party-amb", party_amb())
add("slam-hand", thud(0.3, 200, 70, -10, 0.7))
def clay_shatter():
    d = 1.4; x = np.zeros(int(SR * d))
    for _ in range(9): one = tt(0.08); place(x, (filt(noise(0.08), "band", [1500, 6000]) * np.exp(-one * 50) + np.sin(2 * np.pi * rng.uniform(900, 1600) * one) * np.exp(-one * 40) * 0.3), rng.uniform(0, 0.9), rng.uniform(0.4, 1))
    x += thud(d, 160, 70, 0, 0.3) * 0.4
    return norm(fade(x, 0.001, 0.2), -12)
add("clay-shatter", clay_shatter())
def pen_gold():
    d = 1.2; x = crackle(d, [2000, 7000], 0, 0.03) * 0.6 + fl([(0.1, 0.8, 96), (0.4, 0.8, 100)], 8, d, 0, 50) * 0.5
    return norm(fade(x, 0.02, 0.2), -24)
add("pen-gold", pen_gold())
add("gold-fill", fl([(0, 0.6, 84), (0.12, 0.6, 88), (0.24, 0.6, 91), (0.36, 1.0, 96)], 8, 1.8, -17, 70))
def gold_beam():
    d = 2.0; t = tt(d); f = np.interp(t, [0, 0.2, d], [200, 900, 700]); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.3 + filt(noise(d), "band", [2000, 8000]) * 0.15
    return norm(fade(x * env(t, [(0, 0), (0.08, 1), (1.6, 0.8), (2.0, 0)]), 0.005, 0.2), -14)
add("gold-beam", gold_beam())
for k, txt in (("smart", "you're not smart enough"), ("everyone", "everyone's laughing at you"), ("pick", "she'd never pick you"), ("break", "you break everything"), ("cant", "you can't do it")): add("whisper-" + k, whisper(txt))
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
ev = []
for i in range(1, 6): ev += json.loads(subprocess.run(["node", "render.js", f"rebuilding/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
for n in sorted({n for _, n, _ in ev} - set(L)) + ["room-tone"]: L[n] = load(n)
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name] * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), gain)
mix *= min(1, 0.89 / np.abs(mix).max())
with wave.open(os.path.join(ROOT, "out", "parts", "rb_sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
