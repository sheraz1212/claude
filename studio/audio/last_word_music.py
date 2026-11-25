"""THE LAST WORD - background music, 2:27.5 (60 bpm: 1 beat = 1 second). Original notes, FluidSynth + FluidR3 GM.
Key: G major, sliding into E minor at the low point; G major again from the porch. ONE IDEA: "I'm right" - a cocky
4-note bassoon + pizzicato strut (G-B-D-G') that loses a note and gets more hollow with every wall; on the porch the same
notes slow down into a warm violin line, and the finale plays them gently on piano + violin. No drums.
Run: python3 audio/last_word_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "last-word-the-wall.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 147.5
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





BSN = 12
ev.append((0, mido.Message("program_change", channel=BSN, program=70))); cc(BSN, 0, 91, 60); cc(BSN, 0, 7, 100)
PIZ = 13
ev.append((0, mido.Message("program_change", channel=PIZ, program=45))); cc(PIZ, 0, 91, 70); cc(PIZ, 0, 7, 100)
R = {"G": 43, "C": 48, "D": 50, "E": 40, "A": 45, "B": 47}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "G", 46), (6, "C", 44), (11, "D", 44), (17, "G", 46), (22.5, "Em", 42), (28, "C", 40), (34, "Am", 42), (40, "Em", 40), (45.5, "C", 38), (51.5, "Bm", 36), (57, "Em", 34), (63, "C", 0),
        (69, "C", 40), (75, "G", 42), (81, "Em", 44), (87, "C", 46), (93, "G", 50), (99, "G", 54), (102.6, "C", 56), (105, "D", 56), (108.6, "G", 58), (111, "Em", 56), (114.6, "C", 58),
        (117, "D", 58), (120.6, "G", 60), (123, "Em", 46), (126.8, "C", 50), (129, "G", 60), (131, "D", 60), (133, "Em", 58), (135.5, "C", 56), (138, "G", 56), (141.5, "G", 48)]
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 68)
curve(PAD, [(0, 40), (34, 50), (57, 62), (63, 58), (69, 58), (93, 46), (99, 34), (129, 26), (141.5, 52), (147.5, 0)])
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if t >= 69 else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)
# "I'm right": the cocky strut, one note lost after every wall
STRUT = (55, 59, 62, 67)
def strut(t0, t1, nn, v, step=0.4, sh=0):
    t = t0; i = 0
    while t < t1 - 1e-6:
        k = i % 4
        if k < nn: note(BSN, t, step * 0.6, STRUT[k] + sh, v + (8 if k == 0 else 0)); note(PIZ, t, step * 0.5, STRUT[k] + 12 + sh, v - 10)
        t += step; i += 1
strut(0.4, 11, 4, 70); strut(17, 28, 3, 64); strut(34, 40, 2, 58, 0.45, -3); strut(45.5, 51.5, 1, 52, 0.55, -3)
curve(BSN, [(0, 96), (11, 96), (11.4, 60), (17, 90), (28, 80), (34, 76), (51.5, 60), (52, 0)]); curve(PIZ, [(0, 90), (51.5, 60), (52, 0)])
for n in (52, 59, 64): note(ATM, 57, 6, n, 70)
curve(ATM, [(56.9, 0), (57.6, 66), (62.6, 60), (63.2, 0)])
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(LEAD, [(57.4, 1.2, 64), (58.8, 1.2, 67), (60.2, 2.4, 66)], 44)
# the porch: the strut slows into a warm violin line
SLOW = [(0, 1.0, 67), (1.0, 1.0, 71), (2.0, 1.5, 74), (3.5, 0.5, 72), (4.0, 2.0, 71)]
def ph(t0, k=1.0, sh=0): return [(t0 + a * k, d * k, n + sh) for a, d, n in SLOW]
line(VLN, ph(75.6, 1.0) + ph(81.6, 1.0, -5) + ph(87.4, 1.0) + ph(93.4, 1.0, 12), 72)
line(LEAD, ph(99.6, 0.8, 12) + ph(105.6, 0.8, 12) + ph(111.6, 0.8, 12) + ph(117.6, 0.8, 12), 54)
def fast(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = chord([c for s, c, _ in PROG if s <= t + 1e-6][-1]); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.8, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (5 if i % 4 == 0 else 0)); t += step; i += 1
fast(129, 141.2, 0.25, 52, 72)
line(VLN, ph(129.4, 1.0, 12) + ph(135.6, 1.0, 12), 84)
curve(VLN, [(75.2, 0), (76.2, 70), (98.6, 62), (99.2, 0), (129, 0), (129.8, 90), (140.6, 96), (141.6, 0)])
for p in PROG:
    if 99 <= p[0] < 141.5:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 68)
curve(STR, [(98.9, 0), (102.6, 70), (123, 50), (126.8, 72), (138, 86), (141.5, 0)])
note(LEAD, 141.8, 5, 67, 54); note(LEAD, 141.9, 5, 71, 48); note(LEAD, 142.0, 5, 74, 44)
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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=146.0:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
