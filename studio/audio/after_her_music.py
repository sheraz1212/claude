"""AFTER HER - background music, 2:32 (60 bpm: 1 beat = 1 second). Original notes, FluidSynth + FluidR3 GM.
Made to sit UNDER A NARRATOR: soft, open, few notes while lines are spoken. Key: C-sharp minor; from the dad scene E major.
ONE IDEA: "her song" - a small 4-note tune (G#-B-C#-E). In the fall it plays slow on a lonely piano and keeps breaking off;
rain and a soft drone carry the low point; his dad's scene turns it warm (violin); the recovery plays it whole and bright,
and the finale finishes it on piano + violin together. No drums. Run: python3 audio/after_her_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "after-her-her-song.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 152
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





R = {"C#": 37, "E": 40, "A": 45, "B": 47, "G#": 44, "F#": 42}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "C#m", 42), (6, "A", 40), (12, "E", 40), (18, "B", 38), (24, "C#m", 38), (30, "A", 38), (36, "E", 40), (42, "C#m", 36), (48, "A", 36), (54, "F#m", 34), (60, "C#m", 0),
        (66, "A", 32), (72, "A", 40), (78, "E", 44), (84, "B", 46), (90, "C#m", 40), (96, "A", 46), (100, "B", 48), (104, "E", 54), (107, "B", 54), (110, "C#m", 52), (113, "A", 54),
        (116, "E", 56), (119, "B", 56), (122, "C#m", 44), (125, "A", 46), (128, "E", 52), (131, "B", 54), (134, "E", 60), (137, "A", 60), (140, "E", 62), (143, "B", 60), (146, "E", 50)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 66)
curve(PAD, [(0, 56), (36, 52), (54, 62), (60, 72), (71, 70), (72, 56), (90, 50), (104, 40), (134, 34), (146, 52), (152, 0)])
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if t >= 72 else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.07, min(end - t, 6), n, v - j)
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
SONG = [(0, 0.8, 68), (0.8, 0.8, 71), (1.6, 0.8, 73), (2.4, 2.0, 76)]
def ph(p, t0, k=1.0, sh=0, cut=None): return [(t0 + a * k, d * k, n + sh) for a, d, n in p[:cut]]
line(LEAD, ph(SONG, 1.0, 1.2) + ph(SONG, 13.0, 1.3, 0, 3) + ph(SONG, 25.0, 1.4, 0, 2) + ph(SONG, 43.0, 1.5, -12, 3), 46)
note(ATM, 60, 12, 61, 70); note(ATM, 60, 12, 68, 66); curve(ATM, [(59.9, 0), (61, 70), (71, 66), (72, 0)])
WEATHER = 15; ev.append((0, mido.Message("program_change", channel=WEATHER, program=96))); cc(WEATHER, 0, 91, 110); cc(WEATHER, 0, 7, 90)
note(WEATHER, 60, 12, 72, 60); curve(WEATHER, [(59.9, 0), (61, 60), (71.5, 50), (72, 0)])
note(BASS, 54, 18, 37, 76); curve(BASS, [(53.9, 0), (56, 60), (70, 66), (72, 0)])
line(VLN, [(48.6, 2.4, 68), (51.0, 1.6, 66), (52.6, 3.0, 64)] + ph(SONG, 78.6, 1.4, 12) + ph(SONG, 85.0, 1.4, 12) + [(91.0, 2.0, 80), (93.0, 3.0, 76)], 68)
curve(VLN, [(48.2, 0), (49, 56), (56, 50), (57, 0), (78.2, 0), (79, 66), (95.8, 60), (96.4, 0), (134, 0), (134.8, 86), (145, 96), (147, 0)])
line(LEAD, ph(SONG, 104.6, 1.0, 12) + ph(SONG, 110.6, 1.0, 12) + ph(SONG, 116.6, 1.0, 12) + ph(SONG, 128.6, 1.0, 12), 54)
def fast(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.8, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (5 if i % 4 == 0 else 0)); t += step; i += 1
fast(134.2, 146, 0.25, 50, 72)
line(VLN, ph(SONG, 134.6, 1.2, 12) + ph(SONG, 140.0, 1.2, 12) + [(145.0, 1.6, 88)], 84)
for p in PROG:
    if 134 <= p[0] < 146:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 68)
curve(STR, [(133.9, 0), (136, 50), (144, 80), (146.4, 0)])
note(LEAD, 146.4, 5, 64, 52); note(LEAD, 146.5, 5, 68, 46); note(LEAD, 146.6, 5, 71, 42); note(LEAD, 148.4, 3, 76, 40)
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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=150.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
