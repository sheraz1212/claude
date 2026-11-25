"""ALL IN - the two YouTube Shorts: SFX track (from the shorts' own sfx() calls, same sound library)
and a music track cut from the film's score (all-in-the-win-jingle.wav) to fit each short's scenes.
Run after audio/all_in_sfx.py and audio/all_in_music.py:  python3 audio/all_in_shorts_audio.py"""
import json, os, subprocess, wave
import numpy as np
SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SFX, OUT = os.path.join(ROOT, "public", "sfx"), os.path.join(ROOT, "out", "parts")
MUSIC = os.path.join(ROOT, "public", "music", "all-in-the-win-jingle.wav")
rng = np.random.default_rng(91)
NP = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
def load(n):
    with wave.open(os.path.join(SFX, n + ".wav")) as w: return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32767
def place(out, x, at, g):
    i = int(at * SR); n = min(len(x), len(out) - i)
    if n > 0: out[i:i + n] += x[:n] * g
# (short, length, music pieces: (from, to) seconds of the film score, laid end to end)
SHORTS = [("short1", 37, [(0, 3.5), (32, 47.5), (80.5, 86), (100.5, 105), (108, 116)]),
          ("short2", 38, [(0, 3.5), (3.5, 9), (15, 20), (48.5, 53.5), (84, 95.5), (160, 167.5)])]
for name, dur, pieces in SHORTS:
    ev = json.loads(subprocess.run(["node", "render.js", f"all-in-shorts/{name}", "--events"], cwd=ROOT, capture_output=True, text=True, check=True, env={**os.environ, "NODE_PATH": NP}).stdout)
    mix = np.zeros(int(SR * dur)); rt = load("room-tone"); mix += np.tile(rt, int(dur / (len(rt) / SR)) + 1)[: len(mix)]
    for at, n, g in ev: place(mix, load(n) * 10 ** (rng.uniform(-0.8, 0.8) / 20), at + rng.uniform(0, 0.012), g)
    pk = np.abs(mix).max(); mix *= min(1, 0.89 / pk)
    with wave.open(os.path.join(OUT, name + "_sfx.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
    # music: each piece with 0.25 s fades, joined with 0.25 s crossfades, then a 1.5 s fade at the end
    parts = [f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[p{i}]" for i, (a, b) in enumerate(pieces)]
    chain, last = "", "p0"
    for i in range(1, len(pieces)): chain += f";[{last}][p{i}]acrossfade=d=0.25:c1=tri:c2=tri[x{i}]"; last = f"x{i}"
    fc = ";".join(parts) + chain + f";[{last}]apad=whole_dur={dur},atrim=0:{dur},afade=t=out:st={dur - 1.5}:d=1.5[m]"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", MUSIC, "-filter_complex", fc, "-map", "[m]", "-c:a", "aac", "-b:a", "256k", os.path.join(OUT, name + "_music.m4a")], check=True)
    print(name, len(ev), "events, sfx peak", round(20 * np.log10(np.abs(mix).max()), 1), "dB")
