"""THE RED STRING - background music, 2:30 (60 bpm: 1 beat = 1 second). Original notes, FluidSynth + FluidR3 GM.
Key: D minor; from the turn, F major. ONE IDEA: "the loop" - a 4-note figure (D-F-E-D) that repeats like a replayed thought,
played by short strings that get faster and tighter with every situation (a wire being wound); a sudden near-silence at the
low point; then the same 4 notes open up (D-F-A-C...) into airy piano arpeggios, and the finale is piano + violin together.
No drums. Run: python3 audio/red_string_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "red-string-the-loop.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 150
PAD, PNO, VLN, ATM, LEAD, STR, TIMP, BASS, ECHO, DR, DRY, NEW = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
ev = []
def cc(ch, t, c, v): ev.append((t, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def note(ch, t, d, n, v):
    ev.append((t, mido.Message("note_on", channel=ch, note=n, velocity=int(max(1, min(127, v)))))); ev.append((t + d - 0.01, mido.Message("note_off", channel=ch, note=n)))
def curve(ch, pts, step=0.12):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        k = max(1, int((t1 - t0) / step))
        for i in range(k): cc(ch, t0 + (t1 - t0) * i / k, 11, v0 + (v1 - v0) * i / k)
    cc(ch, pts[-1][0], 11, pts[-1][1])
for ch, prog, rev, vol in ((PAD, 89, 100, 100), (PNO, 0, 127, 104), (VLN, 40, 112, 96), (ATM, 99, 110, 90), (LEAD, 0, 115, 100), (STR, 48, 110, 88), (TIMP, 47, 100, 100), (BASS, 43, 80, 96), (ECHO, 102, 120, 84), (DRY, 0, 18, 100), (NEW, 88, 115, 92)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
cc(DR, 0, 91, 60); cc(DR, 0, 7, 82)





R = {"D": 38, "F": 41, "G": 43, "A": 45, "Bb": 46, "C": 48, "E": 40}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "Dm", 44), (6, "Bb", 42), (11, "Gm", 42), (17.5, "A", 0), (22, "Dm", 44), (28.5, "A", 0), (33, "Dm", 42), (39.5, "Bb", 0), (44, "Gm", 40), (50.5, "Dm", 38), (54.5, "Bb", 36),
        (58.5, "A", 34), (61.6, "Dm", 0), (64.5, "F", 46), (71, "C", 46), (76, "Dm", 44), (82, "Bb", 40), (88, "F", 44), (94, "C", 48), (99, "F", 52), (105.5, "C", 52), (112, "Dm", 46),
        (118.5, "F", 60), (121.5, "Bb", 58), (125, "C", 54), (131, "F", 62), (134, "C", 62), (137.5, "Dm", 60), (140.5, "Bb", 62), (144, "F", 52)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 68)
curve(PAD, [(0, 50), (33, 46), (50.5, 70), (58.5, 76), (61.4, 70), (61.7, 10), (64.0, 10), (64.6, 56), (82, 64), (94, 54), (99, 52), (112, 50), (118.5, 28), (131, 14), (144, 46), (150, 0)])
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if t >= 64.5 else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)
# THE LOOP: short string notes, faster and tighter with each situation, up to the snap at 61.6
LOOP = (62, 65, 64, 62)
def loop(t0, t1, s0, s1, v0, v1, sh=0):
    t = t0; i = 0
    while t < t1 - 1e-6:
        f = (t - t0) / (t1 - t0); st = s0 + (s1 - s0) * f
        note(STR, t, st * 0.7, LOOP[i % 4] + sh + (12 if i % 8 >= 4 and f > 0.5 else 0), v0 + (v1 - v0) * f); t += st; i += 1
loop(0.5, 17.5, 0.5, 0.36, 44, 56); loop(22, 28.5, 0.34, 0.26, 54, 64); loop(33, 39.5, 0.26, 0.2, 60, 70); loop(50.5, 61.6, 0.2, 0.09, 60, 82, -12)
curve(STR, [(0, 70), (17.4, 74), (17.6, 30), (22, 80), (28.4, 84), (28.6, 30), (33, 88), (39.4, 90), (39.6, 0), (50.4, 0), (50.6, 90), (61.4, 110), (61.6, 0), (150, 0)])
note(BASS, 50.5, 11.0, 26, 86); curve(BASS, [(50.4, 0), (51.5, 70), (61.4, 80), (61.6, 0)])
for n in (50, 57, 62): note(ATM, 17.5, 4.5, n, 70); note(ATM, 28.5, 4.5, n, 70); note(ATM, 39.5, 4.5, n, 70)
curve(ATM, [(17.4, 0), (18, 70), (22, 0), (28.4, 0), (29, 70), (33, 0), (39.4, 0), (40, 70), (44, 0)])
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(VLN, [(44.6, 1.6, 74), (46.2, 1.2, 72), (47.4, 2.8, 69), (50.2, 1.4, 65)], 60)
# the loop OPENS: airy piano arpeggios (D F A C E...) from the turn
def arp(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + th, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 7)
        note(LEAD, t, step * 2.2, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (5 if i % 8 == 0 else 0)); t += step; i += 1
arp(64.6, 82, 0.5, 40, 50); arp(88.4, 94, 0.5, 38, 44); arp(94, 131, 0.375, 56, 66); arp(131, 144, 0.25, 60, 80)
OPEN = [(0, 0.5, 62), (0.5, 0.5, 65), (1.0, 0.5, 69), (1.5, 1.5, 72), (3.0, 0.5, 70), (3.5, 0.5, 69), (4.0, 2.0, 65)]
def ph(t0, k=1.0, sh=0): return [(t0 + a * k, d * k, n + sh) for a, d, n in OPEN]
line(VLN, ph(118.8, 1.0, 12) + ph(125.2, 1.0, 0) + ph(131.2, 1.0, 12) + ph(137.6, 1.0, 12) + [(143.6, 1.6, 77), (145.2, 2.4, 74)], 84)
curve(VLN, [(44.4, 0), (45, 60), (51, 50), (52, 0), (118.6, 0), (119.4, 80), (131, 96), (142, 104), (146, 70), (148, 0)])
for p in PROG:
    if 118.5 <= p[0] < 144:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(118.4, 0), (119.3, 96), (121, 66), (131, 78), (143.6, 86), (144.4, 0)])
curve(LEAD, [(0, 100), (131, 96), (150, 100)], 1.0)
note(LEAD, 144.2, 5, 65, 54); note(LEAD, 144.3, 5, 69, 48); note(LEAD, 144.4, 5, 72, 44)
ev.sort(key=lambda e: e[0])
mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
for t, m in ev:
    tk = int(round(max(0, t) * 480)); m.time = tk - last; last = tk; tr.append(m)
tmp_mid, tmp_wav = OUT[:-4] + ".mid", OUT[:-4] + "_raw.wav"
os.makedirs(os.path.dirname(OUT), exist_ok=True); mid.save(tmp_mid)
subprocess.run(["fluidsynth", "-ni", "-F", tmp_wav, "-r", "44100", "-g", "0.7", "-o", "synth.reverb.room-size=0.92", "-o", "synth.reverb.damp=0.25", "-o", "synth.reverb.width=1", "-o", "synth.reverb.level=0.95",
                "-o", "synth.polyphony=512", SF2, tmp_mid], check=True, capture_output=True)
chain = "acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1"   # the limiter tames the kick peaks so the whole film sits at one level
r = subprocess.run(["ffmpeg", "-i", tmp_wav, "-t", str(DUR), "-af", chain + ",volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
mean = float(r.split("mean_volume:")[1].split("dB")[0]); peak = float(r.split("max_volume:")[1].split("dB")[0])
gain = min(-18 - mean, -1.2 - peak)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=148.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
