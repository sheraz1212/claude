"""REBUILDING - background music, 2:40 (60 bpm: 1 beat = 1 second). Original notes, FluidSynth + FluidR3 GM.
Key: A minor (the fall), C major from his mom's kitchen. ONE IDEA: "the mend" - a falling 3-note figure (E-C-A) that
breaks off with each crack; his mom's violin turns it upward (A-C-E-G); the montage plays it as an ORIGINAL 8-bit loop
(square lead + saw melody + synth bass, no drums); the finale is piano + violin. Run: python3 audio/rebuilding_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "rebuilding-gold.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 160
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





R = {"A": 45, "C": 48, "D": 50, "E": 40, "F": 41, "G": 43}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "C", 46), (6, "Am", 42), (11, "F", 40), (16, "Dm", 38), (21, "Am", 0), (27.5, "F", 0), (34, "Dm", 0), (46, "Am", 0), (52, "F", 36), (58, "E", 0), (64, "Am", 0),
        (70, "Am", 40), (76, "F", 42), (82, "C", 46), (88, "G", 48), (94, "C", 50), (100, "F", 44), (106, "C", 0), (126, "Am", 0), (137, "Am", 0), (140.4, "C", 70), (142.5, "G", 66),
        (145, "Am", 64), (148.5, "F", 66), (151, "C", 66), (154, "G", 56), (156.5, "C", 50)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
for i, (t, name, _) in enumerate(PROG):
    if 106 <= t < 126: continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 68)
curve(PAD, [(0, 56), (21, 62), (34, 58), (52, 60), (64, 64), (69.6, 60), (70, 54), (100, 52), (105.6, 30), (106, 0), (125.8, 0), (126.2, 70), (138.2, 76), (138.6, 20), (140.4, 24), (156, 50), (160, 0)])
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if t >= 70 else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
MEND = [(0, 0.8, 76), (0.8, 0.8, 72), (1.6, 1.6, 69)]
def ph(p, t0, k=1.0, sh=0): return [(t0 + a * k, d * k, n + sh) for a, d, n in p]
line(LEAD, ph(MEND, 1.2) + ph(MEND, 6.6, 1.0, -2), 50); line(LEAD, ph(MEND[:2], 12.4, 1.2, -5), 44)
for n in (45, 52, 57): note(ATM, 64, 6, n, 74)
curve(ATM, [(63.9, 0), (64.8, 74), (69.4, 70), (70, 0)]); note(BASS, 64, 6, 33, 84); curve(BASS, [(63.9, 0), (64.6, 80), (69.6, 74), (70, 0)])
UP = [(0, 0.8, 69), (0.8, 0.8, 72), (1.6, 0.8, 76), (2.4, 2.0, 79)]
line(VLN, [(70.6, 2.4, 69), (73.0, 1.6, 67), (74.6, 2.6, 64)] + ph(UP, 77.0) + ph(UP, 82.6, 1.0) + ph(UP, 88.4, 1.0, 5) + [(93.4, 3.0, 84), (96.4, 3.0, 79)], 70)
curve(VLN, [(70.2, 0), (71, 66), (99.6, 72), (100.4, 0), (140.4, 0), (141.4, 88), (154, 96), (156.5, 60), (157.5, 0)])
# THE MONTAGE: an original 8-bit loop - square arpeggio, saw melody, synth bass (no drums)
SQ, SAW, SB = 12, 13, 14
for ch, prog, rev, vol in ((SQ, 80, 30, 92), (SAW, 81, 40, 84), (SB, 38, 10, 100)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
CH = [("C", 48), ("G", 43), ("Am", 45), ("F", 41)]
MEL = [(0, 0.25, 81), (0.25, 0.25, 84), (0.5, 0.5, 88), (1.0, 0.25, 86), (1.25, 0.25, 84), (1.5, 0.5, 81), (2.0, 0.5, 79), (2.5, 0.25, 81), (2.75, 0.25, 84), (3.0, 0.5, 86), (3.5, 0.5, 84), (4.0, 1.0, 81)]
for rep in range(4):
    base = 106.0 + rep * 5.0
    for ci, (name, root) in enumerate(CH):
        r, th = chord(name); cs = base + ci * 1.25
        for k in range(10): note(SQ, cs + k * 0.125, 0.1, (r + 36, r + 43, r + 48, r + 48 + th)[[0, 1, 2, 3, 2, 1, 0, 1, 2, 3][k]] + 12, 66 + (8 if k % 4 == 0 else 0))
        for k in range(5): note(SB, cs + k * 0.25, 0.2, r + 12 + (12 if k % 2 else 0), 96)
    line(SAW, [(base + a, d, n + (0 if rep % 2 == 0 else 2)) for a, d, n in MEL], 74 + rep * 4)
curve(SQ, [(105.8, 0), (106.4, 88), (125.6, 98), (126.2, 0)]); curve(SAW, [(105.8, 0), (107, 78), (125.6, 94), (126.2, 0)]); curve(SB, [(105.8, 0), (106.4, 90), (125.6, 96), (126.2, 0)])
# the demon + the beam: low tremolo strings, a breath of near-silence, then the swell
for k in range(int(12.2 / 0.1)): note(STR, 126 + k * 0.1, 0.09, 45 if k % 2 else 48, 60)
for n in (60, 64, 67, 72): note(STR, 138.4, 2.0, n, 90)
for p in PROG:
    if 140.4 <= p[0] < 156.5:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(125.9, 0), (127, 62), (138.2, 74), (138.4, 30), (140.3, 118), (142, 72), (154, 84), (156.5, 0)])
def fast(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.8, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (5 if i % 4 == 0 else 0)); t += step; i += 1
fast(140.6, 154, 0.25, 56, 78)
line(VLN, ph(UP, 141.0, 1.0, 12) + ph(UP, 146.0, 1.0, 12) + [(151.0, 1.4, 88), (152.4, 2.6, 84)], 86)
note(LEAD, 154.4, 5, 72, 52); note(LEAD, 154.5, 5, 76, 46); note(LEAD, 156.8, 3, 79, 42)
ev.sort(key=lambda e: e[0])
mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
for t, m in ev:
    tk = int(round(max(0, t) * 480)); m.time = tk - last; last = tk; tr.append(m)
tmp_mid, tmp_wav = OUT[:-4] + ".mid", OUT[:-4] + "_raw.wav"
os.makedirs(os.path.dirname(OUT), exist_ok=True); mid.save(tmp_mid)
subprocess.run(["fluidsynth", "-ni", "-F", tmp_wav, "-r", "44100", "-g", "0.7", "-o", "synth.reverb.room-size=0.92", "-o", "synth.reverb.damp=0.25", "-o", "synth.reverb.width=1", "-o", "synth.reverb.level=0.95",
                "-o", "synth.polyphony=512", SF2, tmp_mid], check=True, capture_output=True)
chain = "acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1,alimiter=limit=0.2:attack=4:release=120:level=false"   # the limiter tames the kick peaks so the whole film sits at one level
r = subprocess.run(["ffmpeg", "-i", tmp_wav, "-t", str(DUR), "-af", chain + ",volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
mean = float(r.split("mean_volume:")[1].split("dB")[0]); peak = float(r.split("max_volume:")[1].split("dB")[0])
gain = min(-18 - mean, -1.2 - peak)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=158.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
