"""YES MAN (Short) - adds this story's new sounds to public/sfx/ and builds the full SFX track.
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
DUR = 69.5
rng = np.random.default_rng(97)

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







# ---- this Short's own sounds
def stone_drop():
    d = 0.6; t = tt(d); x = np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, d], [95, 45])) / SR) * np.exp(-t * 9) + filt(noise(d), "band", [300, 1800]) * np.exp(-t * 40) * 0.5
    return norm(fade(x, 0.002, 0.08), -10)
add("stone-drop", stone_drop())
add("stone-out", norm(fade(sweep(0.5, 500, 2000, 0, 0.5) * 0.6 + filt(noise(0.5), "band", [600, 2500]) * env(tt(0.5), [(0, 0), (0.05, 1), (0.5, 0)]) * 0.3, 0.01, 0.1), -20))
add("whisper-hate", whisper("they'll hate you"))
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
ev = []
for i in range(1, 4): ev += json.loads(subprocess.run(["node", "render.js", f"yes-man-shorts/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
for n in sorted({n for _, n, _ in ev} - set(L)) + ["room-tone"]: L[n] = load(n)
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name] * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), gain)
mix *= min(1, 0.89 / np.abs(mix).max())
with wave.open(os.path.join(ROOT, "out", "parts", "ym_sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")

# ---- MUSIC (original). ONE IDEA: a light, bouncy pizzicato "yes" figure (C-E-G-E) that slows down and sinks lower with
# every stone; at the low point only the pad and a low drone; the wisdom card a single piano line; the recovery plays the
# figure light and quick again on piano + pizz, and the proof lifts it with strings. Key C major (low point A minor).
M = mido.Message; evm = []
PAD, PZ, PNO, STR, BASS = 0, 1, 2, 3, 4
def cc(ch, t, c, v): evm.append((t, M("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def nt(ch, t, d, n, v): evm.append((t, M("note_on", channel=ch, note=n, velocity=int(max(1, min(127, v)))))); evm.append((t + d - 0.01, M("note_off", channel=ch, note=n)))
def curve(ch, pts, step=0.12):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        k = max(1, int((t1 - t0) / step))
        for i in range(k): cc(ch, t0 + (t1 - t0) * i / k, 11, v0 + (v1 - v0) * i / k)
    cc(ch, pts[-1][0], 11, pts[-1][1])
for ch, prog, rev in ((PAD, 89, 100), (PZ, 45, 70), (PNO, 0, 120), (STR, 48, 110), (BASS, 43, 80)):
    evm.append((0, M("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, 100)
CH = {"C": (48, 4), "F": (53, 4), "G": (55, 4), "Am": (57, 3), "Em": (52, 3), "Dm": (50, 3)}
PROG = [(0, "C"), (5, "C"), (8, "F"), (11, "G"), (14, "Am"), (17, "F"), (20, "Em"), (23, "Am"), (27.5, "Dm"), (31.5, "Am"), (37, "F"), (39.5, "G"),
        (41.5, "C"), (44, "G"), (46, "Am"), (48.5, "F"), (50.5, "C"), (53, "G"), (55, "F"), (57.5, "G"), (59.5, "C"), (61.5, "F"), (62.5, "G"), (64.5, "C"), (69.5, "C")]
for (t0, c), (t1, _) in zip(PROG, PROG[1:]):
    r, th = CH[c]
    for n in (r, r + 7, r + 12, r + th + 12): nt(PAD, t0, t1 - t0 + 0.6, n, 64)
curve(PAD, [(0, 46), (23, 56), (31.5, 84), (37, 80), (41.5, 40), (59.5, 30), (64.5, 56), (69.5, 0)])
def figure(t0, t1, step, shift, v):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = CH[[c for s, c in PROG if s <= t + 1e-6][-1]]; nt(PZ, t, step * 0.8, (r + 12, r + 12 + th, r + 19, r + 12 + th)[i % 4] + 12 + shift, v + (8 if i % 4 == 0 else 0)); t += step; i += 1
figure(0, 9.0, 0.25, 0, 70); figure(9.0, 15.0, 0.3, 0, 64); figure(15.0, 21.0, 0.37, -5, 58); figure(21.0, 30.0, 0.46, -12, 52); figure(30.0, 31.4, 0.6, -12, 44)
figure(44.4, 59.4, 0.25, 0, 66)
for (t0, c), (t1, _) in zip(PROG, PROG[1:]):
    if 41.5 <= t0 < 69:
        r, th = CH[c]; cc(PNO, t0 - 0.05, 64, 0); cc(PNO, t0, 64, 127)
        for j, n in enumerate((r + 12, r + 19, r + 24, r + 24 + th)): nt(PNO, t0 + j * 0.05, min(t1 - t0, 4), n, 58 - j)
for t, d, n in ((37.4, 0.8, 72), (38.2, 0.8, 76), (39.0, 1.2, 79), (40.2, 1.4, 77)): nt(PNO, t, d, n, 50)
nt(BASS, 31.5, 5.6, 33, 84); curve(BASS, [(31.4, 0), (32, 80), (36.6, 70), (37.2, 0)])
for (t0, c), (t1, _) in zip(PROG, PROG[1:]):
    if 59.5 <= t0 < 69:
        r, th = CH[c]
        for n in (r + 12, r + 19, r + 24 + th): nt(STR, t0, t1 - t0 + 0.2, n, 70)
curve(STR, [(59.4, 0), (61, 70), (64, 96), (66, 70), (69.5, 0)])
for t, n in ((64.6, 72), (64.7, 76), (64.8, 79)): nt(PNO, t, 4.5, n, 54)
evm.sort(key=lambda e: e[0])
mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr); tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
for t, m in evm: tk = int(round(max(0, t) * 480)); m.time = tk - last; last = tk; tr.append(m)
MP = os.path.join(ROOT, "public", "music", "yes-man-heavy-bag.wav"); mid.save(MP[:-4] + ".mid")
subprocess.run(["fluidsynth", "-ni", "-F", MP[:-4] + "_raw.wav", "-r", "44100", "-g", "0.7", "-o", "synth.reverb.room-size=0.92", "-o", "synth.reverb.level=0.95", SF2, MP[:-4] + ".mid"], check=True, capture_output=True)
chain = "acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1"
r = subprocess.run(["ffmpeg", "-i", MP[:-4] + "_raw.wav", "-t", str(DUR), "-af", chain + ",volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
mean = float(r.split("mean_volume:")[1].split("dB")[0]); peak = float(r.split("max_volume:")[1].split("dB")[0]); gain = min(-18 - mean, -1.2 - peak)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", MP[:-4] + "_raw.wav", "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st={DUR - 1.5}:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", MP], check=True)
os.remove(MP[:-4] + ".mid"); os.remove(MP[:-4] + "_raw.wav")
print("music mean", mean, "gain", round(gain, 1))
