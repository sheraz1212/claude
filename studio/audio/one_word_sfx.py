"""ONE WORD - adds this story's new sounds to public/sfx/ and builds the full SFX track.
New sounds are made here from scratch; shared ones (pen, pops, demon stings, thuds...) are
reused from the library. The whispers are pitched-down, echoing synthetic whispers.
Run: python3 audio/light_inside_sfx.py"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import mido

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX = os.path.join(ROOT, "public", "sfx")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190.0
rng = np.random.default_rng(11)

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

# ---- quiet rooms
def room(d, db, extra=None):
    x = filt(brown(d), "band", [40, 240]); x = x / np.abs(x).max() * 0.5
    if extra: x = extra(x, d)
    return norm(fade(x, 0.4, 0.6), db)
def lib_extra(x, d):          # a far cough-less hush: soft paper ticks
    for _ in range(4):
        s = fade(filt(noise(0.05), "band", [1500, 5000]) * np.exp(-tt(0.05) * 60), 0.002, 0.01) * 0.05; place(x, s, rng.uniform(0.3, d - 0.4))
    return x
def lecture_extra(x, d):      # low murmur
    m = filt(noise(d), "band", [180, 600]) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * tt(d))) * 0.12; return x + m
add("lib-amb", room(5.5, -33, lib_extra)); add("lecture-amb", room(4, -30, lecture_extra))
def page():
    d = 0.32; t = tt(d); return norm(fade(filt(noise(d), "band", [1800, 7000]) * env(t, [(0, 0), (0.05, 0.5), (0.2, 1), (0.26, 0.3), (d, 0)])), -22)
add("page-turn", page())
t = tt(0.5); add("book-slide", norm(fade(filt(noise(0.5), "band", [300, 2200]) * env(t, [(0, 0), (0.08, 1), (0.4, 0.6), (0.5, 0)]), 0.01, 0.05), -24))
# the phone glow: a low uneasy hum with a slow beat
t = tt(3.6); hum = (np.sin(2 * np.pi * 62 * t) + 0.6 * np.sin(2 * np.pi * 93.5 * t) + 0.3 * np.sin(2 * np.pi * 186 * t)) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.5 * t))
add("glow-hum", norm(fade(hum, 0.8, 1.2), -22))
t = tt(0.8); add("light-flicker", norm(fade(np.sin(2 * np.pi * 120 * t) * (np.sin(2 * np.pi * 20 * t) > 0) * np.exp(-t * 3) + filt(noise(0.8), "high", 4000) * 0.15 * (np.sin(2 * np.pi * 20 * t) > 0)), -24))
def tap():
    d = 1.4; t = tt(d); x = filt(noise(d), "band", [1500, 9000]) * env(t, [(0, 0), (0.1, 1), (1.1, 0.9), (d, 0)]) + filt(noise(d), "band", [300, 900]) * 0.4 * env(t, [(0, 0), (0.2, 1), (d, 0)])
    return norm(fade(x), -25)
add("tap-water", tap())
def splash():
    d = 0.6; t = tt(d); x = filt(noise(d), "band", [600, 7000]) * np.exp(-t * 7); imp = (rng.random(len(t)) < 0.004) * 1.0
    x += filt(np.convolve(imp, np.exp(-np.arange(400) / 60), "same") * noise(d), "band", [2000, 9000]) * 3 * np.exp(-t * 4); return norm(fade(x, 0.002, 0.1), -17)
add("splash", splash())
def rain(d):
    t = tt(d); x = filt(noise(d), "band", [900, 9000]) * 0.6; imp = (rng.random(len(t)) < 0.01) * rng.uniform(0.2, 1, len(t))
    x += filt(np.convolve(imp, np.exp(-np.arange(120) / 14), "same"), "band", [1500, 6000]) * 4 + filt(brown(d), "band", [60, 300]) / 4000
    return norm(fade(x, 0.4, 0.6), -24)
add("rain-loop", rain(5.6))
t = tt(0.25); add("cup-clink", norm(fade(sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) for f, dcy in ((2350, 22), (3720, 30), (5100, 40))), 0.001, 0.05), -24))
def knock():
    one = tt(0.12); k = np.sin(2 * np.pi * 150 * one) * np.exp(-one * 40) + filt(noise(0.12), "band", [400, 2000]) * np.exp(-one * 70) * 0.6
    x = np.zeros(int(SR * 0.75)); [place(x, k, a) for a in (0, 0.2, 0.4)]; return norm(x, -14)
add("knock", knock())
def run_steps():
    d = 4.6; x = np.zeros(int(SR * d)); one = tt(0.1)
    for i in range(int(d / 0.29)):
        s = (filt(noise(0.1), "band", [200, 1800]) * np.exp(-one * 45) + np.sin(2 * np.pi * 95 * one) * np.exp(-one * 35)) * rng.uniform(0.7, 1); place(x, s, 0.1 + i * 0.29 + rng.uniform(-0.01, 0.01))
    return norm(fade(x, 0.05, 0.4), -19)
add("run-steps", run_steps())
def heartbeat():
    d = 3.6; x = np.zeros(int(SR * d)); one = tt(0.2); b = np.sin(2 * np.pi * np.cumsum(np.interp(one, [0, 0.2], [70, 40])) / SR) * np.exp(-one * 18); gap = 0.95; at = 0.05
    while at < d - 0.5: place(x, b, at); place(x, b * 0.7, at + 0.26); at += gap; gap = max(0.55, gap * 0.9)
    return norm(x, -13)
add("heartbeat", heartbeat())
def light_return():
    ev = [(0, M("program_change", channel=0, program=8)), (0, M("program_change", channel=1, program=89)), (0, M("control_change", channel=0, control=91, value=127)), (0, M("control_change", channel=1, control=91, value=127))]
    for i, n in enumerate((62, 67, 71, 74, 79, 83)): ev += [(i * 0.09, M("note_on", channel=0, note=n + 12, velocity=64 + i * 6)), (i * 0.09 + 1.6, M("note_off", channel=0, note=n + 12))]
    for n in (55, 62, 67, 71): ev += [(0, M("note_on", channel=1, note=n, velocity=70)), (2.2, M("note_off", channel=1, note=n))]
    return norm(fade(fluid(ev, 3.8), 0.02, 1.2), -15)
add("light-return", light_return())

# ---- the inner voice (slow, low, echoing)
def whisper(text, speed=85):
    p = os.path.join(SFX, "_w.wav"); subprocess.run(["espeak-ng", "-v", "en-us+whisper", "-s", str(speed), "-p", "5", "-w", p, text], check=True)
    x = decode(p); os.remove(p); x = np.interp(np.arange(0, len(x) - 1, 0.74), np.arange(len(x)), x)
    x = filt(filt(x, "low", 3200), "high", 160); x = x / np.abs(x).max(); out = np.zeros(len(x) + int(SR * 2.4))
    for dl, g in ((0, 1), (0.36, 0.42), (0.72, 0.2), (1.08, 0.09)): place(out, x, dl, g)
    return norm(fade(reverb(out, 2.0, 0.6), 0.02, 0.8), -15)
add("whisper-nobody", whisper("nobody will know")); add("whisper-once", whisper("just once")); add("whisper-onemore", whisper("one more")); add("whisper-deserve", whisper("you deserve it"))

# ---- One Word: the pitch, the locker room, the car
def crowd(d, db, swell=None):
    t = tt(d); x = filt(noise(d), "band", [300, 2200]) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.6 * t + 1)) + filt(noise(d), "band", [900, 3500]) * 0.4
    if swell: x = x * env(t, swell)
    return norm(fade(x, 0.4, 0.8), db)
add("crowd", crowd(5.5, -27)); add("crowd-groan", crowd(2.6, -22, [(0, 0.3), (0.3, 1), (1.4, 0.5), (2.6, 0)]))
t = tt(3.4); ch = filt(noise(3.4), "band", [500, 4200]) * env(t, [(0, 0), (0.25, 1), (2.2, 0.8), (3.4, 0)]) * (0.7 + 0.3 * np.sin(2 * np.pi * 5 * t)); add("crowd-cheer", norm(fade(ch, 0.02, 0.8), -16))
t = tt(0.25); add("kick", norm(fade(np.sin(2 * np.pi * np.cumsum(np.interp(t, [0, 0.25], [150, 60])) / SR) * np.exp(-t * 22) + filt(noise(0.25), "band", [500, 3000]) * np.exp(-t * 60) * 0.7, 0.001, 0.04), -11))
t = tt(0.5); add("net", norm(fade(filt(noise(0.5), "band", [1200, 6000]) * env(t, [(0, 0), (0.04, 1), (0.2, 0.4), (0.5, 0)]) + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 14) * 0.5, 0.002, 0.1), -17))
t = tt(0.7); wh = np.sin(2 * np.pi * 2900 * t + 2.2 * np.sin(2 * np.pi * 38 * t)) * env(t, [(0, 0), (0.03, 1), (0.6, 0.9), (0.7, 0)]) + filt(noise(0.7), "band", [2500, 5000]) * 0.2; add("whistle", norm(fade(wh, 0.005, 0.05), -20))
add("locker-amb", room(4.5, -34)); add("class-amb", room(4.5, -31, lecture_extra)); add("market-amb", room(5.5, -30, lecture_extra))
def clang():
    t = tt(0.7); x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) for f, dcy in ((210, 9), (530, 14), (1270, 22), (2140, 30))) + filt(noise(0.7), "band", [800, 5000]) * np.exp(-t * 40)
    return norm(fade(x, 0.001, 0.15), -15)
add("locker-clang", clang())
t = tt(5.0); hum = (np.sin(2 * np.pi * 52 * t) + 0.5 * np.sin(2 * np.pi * 104 * t)) * (0.85 + 0.15 * np.sin(2 * np.pi * 7 * t)) + filt(brown(5.0), "band", [40, 200]) / 2500; add("car-hum", norm(fade(hum, 0.4, 0.6), -27))
add("whisper-useless", whisper("useless", 80))

for n in ("pen-write", "pop-8bit-1", "pop-8bit-2", "pop-8bit-3", "demon-8bit-1", "demon-8bit-2", "demon-8bit-3", "night-amb", "morning-amb", "phone-buzz", "phone-buzz-muffled", "msg-tick",
          "count-tick", "low-thud", "piano-low-hit", "demon-brass", "door-open", "celesta-sparkle", "ball-catch", "cloth-rustle", "paper-peel", "paper-crinkle", "shatter", "timpani-boom", "cymbal-crash", "room-tone"): L[n] = load(n)

# ---- the full track on the picture's clock
ev = []
for i in range(1, 7): ev += json.loads(subprocess.run(["node", "render.js", f"one-word/clip{i}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
missing = sorted({n for _, n, _ in ev} - set(L)); assert not missing, missing
mix = np.zeros(int(SR * DUR)); mix += np.tile(L["room-tone"], int(DUR / 8) + 1)[: len(mix)]
for at, name, gain in ev: place(mix, L[name], at, gain)
pk = np.abs(mix).max()
if pk > 0.89: mix *= 0.89 / pk
os.makedirs(os.path.join(ROOT, "out", "parts"), exist_ok=True)
with wave.open(os.path.join(ROOT, "out", "parts", "sfx.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print(len(ev), "events, peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
