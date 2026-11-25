"""SHORT FUSE - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: C minor, the calm and the finale in E-flat major.
ONE IDEA: "the fuse" - a pizzicato ostinato that SPEEDS UP while the anger burns and stops dead at every
blast; its 4-note shape (G-C-Eb-D) becomes the slow, warm piano melody when he learns to breathe.
  0:00 hook            string tremolo + low drone rising, cut at the blast
  0:03 kitchen         warm piano melody in E-flat, pad low
  0:09 the spill       pizzicato fuse starts, accelerates; timpani heartbeat; stops at the blast
  0:21 after           pad alone
  0:32 the repeats     pizzicato + tense drums on the court; C minor pedal chords; each door scene darker
  1:04 the twist       violin (pain) in C minor
  1:15 biggest blast   ostinato at full speed, strings swell, cut
  1:36 low point       drone + atmosphere + fast pizzicato sparks, cut to silence at the breath
  1:50 wisdom          New Age pad, soft high pedal chords in E-flat
  1:59 decision        the fuse motif, slow, on piano
  2:08 the fight       piano + light drums; relapse: pizzicato returns briefly
  2:40 FINALE          fast piano + violin together in E-flat, pads far back
  3:03 lesson          last chord, fade
Run: python3 audio/short_fuse_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "short-fuse-the-burning-line.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190
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



PIZ = 12
ev.append((0, mido.Message("program_change", channel=PIZ, program=45))); cc(PIZ, 0, 91, 70); cc(PIZ, 0, 7, 100)
R = {"C": 36, "Eb": 39, "F": 41, "G": 31, "Ab": 32, "Bb": 34, "D": 38}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "Cm", 0), (3, "Eb", 56), (5.5, "Ab", 56), (7.5, "Bb", 54), (9, "Cm", 50), (11, "Ab", 48), (13, "G", 48), (15, "Cm", 0), (21, "Ab", 42), (24, "Fm", 42), (26.5, "Cm", 44), (29, "G", 44),
        (32, "Cm", 52), (34, "Ab", 52), (35.9, "G", 0), (37.5, "Cm", 48), (40.4, "Fm", 0), (43, "Cm", 48), (45, "Ab", 48), (46.6, "G", 0), (48.5, "Cm", 46), (50.9, "Fm", 0), (54, "Ab", 44), (56.5, "G", 44), (59, "Cm", 40), (61.5, "Ab", 40),
        (64, "Fm", 48), (66.5, "Cm", 46), (69.5, "Ab", 50), (72, "G", 50), (75, "Cm", 52), (77, "Ab", 54), (78.6, "Cm", 0), (80.5, "Fm", 44), (83, "Cm", 44), (86, "Ab", 46), (88.2, "G", 50), (91.5, "Cm", 42),
        (96, "Cm", 40), (101.5, "Ab", 0), (106.5, "Cm", 0),
        (110, "Eb", 48), (112.2, "Bb", 48), (114.5, "Cm", 48), (116.8, "Ab", 50), (119, "Eb", 52), (121.5, "Bb", 52), (123.5, "Ab", 54), (126, "Bb", 56),
        (128, "Eb", 58), (130.5, "Cm", 56), (133.5, "Ab", 60), (136, "Bb", 62), (139, "Cm", 54), (141.5, "Ab", 58), (144.5, "Cm", 46), (146.6, "G", 0), (148, "Ab", 46), (150, "Eb", 58), (152.5, "Bb", 58), (155.5, "Ab", 64), (158, "Bb", 68),
        (160, "Eb", 68), (162, "Bb", 66), (164, "Cm", 66), (166, "Ab", 66), (168, "Eb", 70), (170, "Bb", 68), (172, "Cm", 68), (174, "Ab", 70), (176, "Eb", 72), (178, "Bb", 70), (180, "Ab", 66), (181.5, "Bb", 64), (183, "Eb", 56)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return (3 <= t < 9) or t >= 110

# 1. PADS
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 20), (2.3, 40), (2.45, 0), (3.1, 30), (8.8, 26), (9.2, 40), (18.3, 50), (18.5, 0), (21, 50), (22, 84), (31.5, 70), (32, 40), (63.5, 70), (64, 50), (78.4, 60), (78.65, 0), (80.6, 70), (95.5, 84),
            (106.4, 96), (106.55, 0), (108.5, 0), (110, 64), (119, 50), (128, 34), (144.5, 64), (149.8, 50), (150, 30), (160, 14), (182.5, 16), (183.2, 58), (188, 44), (190, 0)])
for n in (63, 70, 75): note(NEW, 107.8, 11.2, n, 56)
curve(NEW, [(107.6, 0), (110, 70), (118, 64), (119.5, 0)])
for n in (48, 55, 60, 63): note(ATM, 96, 10.5, n, 80); note(ATM, 21, 11, n, 60)
curve(ATM, [(20.9, 0), (22.5, 70), (31.6, 60), (32, 0), (95.9, 0), (98, 90), (106.3, 112), (106.55, 0)])

# 2. PEDAL PIANO CHORDS
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if bright(t) else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3. THE FUSE: a pizzicato ostinato that speeds up and stops dead at each blast
FIG = (67, 72, 75, 74)   # G C Eb D
def burn(t0, t1, gap0, gap1, v0, v1, shift=0):
    t = t0; i = 0
    while t < t1 - 0.02:
        k = (t - t0) / (t1 - t0); r, th = at(t); n = FIG[i % 4] - 12 + shift
        note(PIZ, t, 0.2, n, v0 + (v1 - v0) * k); t += gap0 + (gap1 - gap0) * k; i += 1
burn(10.6, 18.35, 0.5, 0.12, 50, 90); burn(34.0, 35.85, 0.3, 0.12, 60, 88); burn(38.0, 40.35, 0.35, 0.15, 50, 80); burn(44.6, 46.55, 0.3, 0.1, 60, 92)
burn(49.0, 50.85, 0.3, 0.12, 56, 90); burn(54, 59, 0.6, 0.4, 40, 50); burn(66.3, 67.55, 0.25, 0.12, 50, 70, 12); burn(77.0, 78.55, 0.2, 0.08, 70, 100)
burn(101.6, 106.45, 0.3, 0.06, 50, 104); burn(140.0, 142.4, 0.35, 0.8, 60, 30); burn(144.7, 146.55, 0.25, 0.1, 60, 88); burn(150.6, 152.7, 0.4, 0.9, 50, 24, 12); burn(162.0, 163.5, 0.4, 1.0, 50, 24)

# 4. MELODIES
SONG = [(0, 0.5, 67), (0.5, 0.5, 72), (1.0, 1.0, 75), (2.0, 1.5, 74), (3.5, 0.5, 72), (4.0, 0.5, 70), (4.5, 1.5, 72)]   # the fuse shape, slow and warm
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
def song(t0, k=1.0, shift=0, cut=None): return [(t0 + t * k, d * k, n + shift) for t, d, n in SONG[:cut]]
line(LEAD, [(3.4, 0.5, 70), (3.9, 0.5, 75), (4.4, 1.0, 79), (5.5, 0.5, 77), (6.0, 1.0, 75), (7.5, 0.5, 74), (8.0, 1.0, 70)], 58)
line(VLN, song(64.3, 1.4, -3) + song(72.4, 1.1, -3, 5) + song(80.8, 1.5, -3) + song(89.6, 1.0, -3, 4), 76)
curve(VLN, [(64, 30), (65.5, 82), (77.8, 76), (78.55, 0), (80.6, 40), (82, 80), (95, 60), (96, 0), (159.6, 0), (160, 86), (176, 106), (182, 96), (184.5, 0)])
line(LEAD, song(119.4, 1.2, 3, 6) + song(129, 1.0, 15) + song(134.5, 1.0, 15, 5), 52)
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(139, 144.4, 0.5, 46, 58); fast(153.5, 160, 0.25, 54, 76); fast(160, 182.6, 0.25, 64, 86)
line(VLN, song(160.2, 1.0, 3) + song(166.4, 1.0, 15) + song(172.4, 1.0, 3) + [(178.2, 1.0, 82), (179.2, 1.0, 84), (180.2, 1.2, 82), (181.4, 1.6, 79)], 84)
note(LEAD, 183.0, 5, 75, 58); note(LEAD, 183.1, 5, 79, 52); note(LEAD, 185.6, 4, 82, 44)

# 5. COLOURS: hook tremolo + drone, timpani heartbeat, court drums, strings swells
for n in (48, 55, 60): note(STR, 0, 2.45, n, 80)
note(BASS, 0, 2.45, 24, 80); note(BASS, 15, 3.4, 24, 80); note(BASS, 96, 10.5, 24, 90); note(BASS, 75, 3.6, 24, 70)
curve(BASS, [(0, 40), (2.3, 100), (2.45, 0), (14.9, 0), (18.3, 100), (18.45, 0), (74.9, 0), (78.5, 100), (78.6, 0), (95.9, 0), (100, 90), (106.4, 116), (106.5, 0)])
t, d = 15.2, 0.8
while t < 18.3: note(TIMP, t, 0.4, 36, 50 + (t - 15) * 10); t += d; d = max(0.25, d * 0.82)
t, d = 102.0, 0.7
while t < 106.4: note(TIMP, t, 0.4, 36, 50 + (t - 102) * 10); t += d; d = max(0.2, d * 0.86)
def drums(t0, t1, v0, v1):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        note(DR, t, 0.1, 36, v); note(DR, t + 0.5, 0.1, 38, v * 0.8)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
drums(32, 35.8, 50, 76); drums(139, 144.4, 36, 56); drums(155.5, 160, 50, 74); drums(168, 182.6, 46, 66)
for p in PROG:
    if (75 <= p[0] < 78.6) or (150 <= p[0] < 183):
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(0, 20), (2.3, 100), (2.45, 0), (74.9, 0), (78.4, 110), (78.6, 0), (149.9, 0), (152, 40), (158, 100), (160, 60), (176, 72), (182.5, 70), (184, 0)])

ev.sort(key=lambda e: e[0])
mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
for t, m in ev:
    tk = int(round(max(0, t) * 480)); m.time = tk - last; last = tk; tr.append(m)
tmp_mid, tmp_wav = OUT[:-4] + ".mid", OUT[:-4] + "_raw.wav"
os.makedirs(os.path.dirname(OUT), exist_ok=True); mid.save(tmp_mid)
subprocess.run(["fluidsynth", "-ni", "-F", tmp_wav, "-r", "44100", "-g", "0.7", "-o", "synth.reverb.room-size=0.92", "-o", "synth.reverb.damp=0.25", "-o", "synth.reverb.width=1", "-o", "synth.reverb.level=0.95",
                "-o", "synth.polyphony=512", SF2, tmp_mid], check=True, capture_output=True)
chain = "acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1"
r = subprocess.run(["ffmpeg", "-i", tmp_wav, "-t", str(DUR), "-af", chain + ",volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
mean = float(r.split("mean_volume:")[1].split("dB")[0]); peak = float(r.split("max_volume:")[1].split("dB")[0])
gain = min(-18 - mean, -1.2 - peak)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=188.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
