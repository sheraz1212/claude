"""ONE CARD AT A TIME - the YouTube Short's audio. The Short re-edits the film's shots, so its sound is the
film's own: every SFX still sounding inside a segment (trimmed at the cut), and the film's score cut at
the same source times, joined with short crossfades; the end card gets the score's quiet lesson chord.
Writes out/parts/nsshort_sfx.wav and out/parts/nsshort_music.wav.
Run after audio/next_step_music.py:  python3 audio/next_step_short_audio.py"""
import json, os, re, subprocess, wave
import numpy as np
SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX, OUT = os.path.join(ROOT, "public", "sfx"), os.path.join(ROOT, "out", "parts")
MUSIC = os.path.join(ROOT, "public", "music", "one-card-at-a-time-what-if.wav")
rng = np.random.default_rng(23)
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
def load(n):
    with wave.open(os.path.join(SFX, n + ".wav")) as w: return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32767
def decode(p): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout, "<f4").astype(float)
def write(p, x):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())

ev = json.loads(subprocess.run(["node", "render.js", "next-step-shorts/short1", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
src = open(os.path.join(ROOT, "src", "next-step-shorts", "short1.js")).read()
SEGS = [x[:3] for x in json.loads(re.search(r"const SEGS = (\[\[.*?\]\]);", src, re.S).group(1))]
CARD = float(re.search(r"CARD = ([\d.]+)", src).group(1))
DUR = sum(b - a for a, b, _ in SEGS) + CARD

# ---- SFX: trim each sound's start if it began before the cut, stop it (40 ms fade) at the segment's end
mix = np.zeros(int(SR * DUR)); rt = load("room-tone"); mix += np.tile(rt, int(DUR / (len(rt) / SR)) + 1)[: len(mix)]
for at, name, gain, cut in ev:
    x = load(name) * 10 ** (rng.uniform(-0.6, 0.6) / 20) * gain
    if at < 0: x = x[int(-at * SR):]; at = 0
    i, j = int(at * SR), min(int(cut * SR), len(mix))
    n = min(len(x), j - i)
    if n <= 0: continue
    y = x[:n].copy(); f = min(n, int(0.04 * SR)); y[-f:] *= np.linspace(1, 0, f)
    mix[i:i + n] += y
mix *= min(1, 0.89 / (np.abs(mix).max() + 1e-9))
write(os.path.join(OUT, "nsshort_sfx.wav"), mix)

# ---- MUSIC: the film's score at the same source times, 0.2 s crossfades, then the lesson chord for the card
score = decode(MUSIC); xf = int(0.2 * SR); out = np.zeros(0)
for a, b, _ in SEGS:
    piece = score[int(a * SR): int(b * SR) + xf].copy()
    if len(out) >= xf: piece[:xf] *= np.linspace(0, 1, xf); out[-xf:] *= np.linspace(1, 0, xf); out[-xf:] += piece[:xf]; out = np.concatenate([out, piece[xf:]])
    else: out = piece
out = out[: int(SR * (DUR - CARD))]
card = score[int(200.0 * SR): int((200.0 + CARD) * SR)].copy(); card[:xf] *= np.linspace(0, 1, xf)
out[-xf:] *= np.linspace(1, 0.3, xf); out = np.concatenate([out, card])[: int(SR * DUR)]
f = int(1.5 * SR); out[-f:] *= np.linspace(1, 0, f)
write(os.path.join(OUT, "nsshort_music.wav"), out)
print(len(ev), "events, duration", round(DUR, 2), "s, sfx peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
