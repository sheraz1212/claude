"""TOMORROW WALL - background music, 3:10 (60 bpm, so 1 beat = 1 second = the picture's clock).
Original notes, written as MIDI and played with FluidSynth + FluidR3 GM.
Layers: warm pad (GM 89) / pedal piano chords / melody (piano = normal + hope, violin = pain).
Colours: FX atmosphere + bass drone + timpani heartbeat (the voice), drums + strings (the fight).

  0:00 hook            pad alone
  0:04 full wall       pad up, dark pedal chords, no melody
  0:10 phone / truck   violin leads (the loss), pad low
  0:26 the note        melody gone, pad up
  0:33 court (earlier) F major, light piano melody, pad far back
  0:48 the voice       pad swells, melody stops
  1:02 the repeats     the same piano figure again and again, each time darker; drone grows
  1:20 court, alone    short violin phrase
  1:34 Sam is moving   violin, pad up
  1:45 low point       atmosphere pad + drone + timpani heartbeat, no melody
  1:51 he missed it    violin alone over the pad, then 1.5 s of near silence
  2:01 wisdom lines    two pedal chords, turning hopeful
  2:11 the fight       fast piano + strings swell + drums
  2:22 relapse         drops to pad + low violin
  2:27 back up         piano builds; big chord when the word breaks
  2:38 FINALE          fast piano line + violin melody together, pad far back
  3:03 lesson          last pedal chord, pad, fade
Run: python3 audio/tomorrow_wall_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "tomorrow-wall-loss-to-today.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190
PAD, PNO, VLN, ATM, LEAD, STR, TIMP, BASS, ECHO, DR = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
ev = []
def cc(ch, t, c, v): ev.append((t, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def note(ch, t, d, n, v):
    ev.append((t, mido.Message("note_on", channel=ch, note=n, velocity=int(max(1, min(127, v)))))); ev.append((t + d - 0.01, mido.Message("note_off", channel=ch, note=n)))
def curve(ch, pts, step=0.12):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        k = max(1, int((t1 - t0) / step))
        for i in range(k): cc(ch, t0 + (t1 - t0) * i / k, 11, v0 + (v1 - v0) * i / k)
    cc(ch, pts[-1][0], 11, pts[-1][1])
for ch, prog, rev, vol in ((PAD, 89, 100, 100), (PNO, 0, 127, 104), (VLN, 40, 112, 96), (ATM, 99, 110, 90), (LEAD, 0, 115, 100), (STR, 48, 110, 88), (TIMP, 47, 100, 100), (BASS, 43, 80, 96), (ECHO, 102, 120, 80)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
cc(DR, 0, 91, 60); cc(DR, 0, 7, 84)

# roots (around octave 2) and chord colours
R = dict(D=38, Bb=34, G=31, A=33, F=29, C=36, E=28)
def chord(name):
    q = "m" if name.endswith("m") else "M"; r = R[name.rstrip("m")]; third = 3 if q == "m" else 4
    return r, third
# (start second, chord, piano velocity or 0 for "no pedal chord")
PROG = [(0, "Dm", 0), (4.7, "Dm", 56), (7.5, "Bb", 52), (10.5, "Gm", 54), (13.5, "A", 56), (16, "Dm", 52), (18.3, "Bb", 60), (21.5, "F", 54), (24, "C", 52), (26.6, "Dm", 44),
        (30, "Dm", 40), (32, "C", 44), (33.5, "F", 58), (36.5, "C", 56), (39.5, "Dm", 56), (42.5, "Bb", 58), (45.5, "F", 54), (48.5, "Dm", 50), (50.5, "Bb", 48), (52, "Gm", 50), (54.5, "C", 52), (57, "F", 58), (59.5, "Bb", 56), (61, "C", 54),
        (62, "Dm", 54), (64.25, "Bb", 52), (66.5, "Dm", 52), (68.75, "Bb", 50), (71, "Gm", 50), (73.5, "A", 52), (76, "Dm", 50), (78.25, "Bb", 48), (80.5, "Gm", 48), (83.25, "A", 50), (86, "Bb", 46), (88, "A", 48), (90, "Dm", 46), (92, "Dm", 42),
        (94, "Gm", 50), (97, "A", 52), (100, "Bb", 48), (102.5, "Gm", 46), (105, "Dm", 0), (111, "Dm", 44), (113.6, "Bb", 44), (116.2, "Gm", 42), (118, "A", 40), (119.5, "A", 0),
        (121.3, "Bb", 58), (123.7, "C", 62), (126, "F", 58), (128.5, "C", 60), (131, "Dm", 70), (132.5, "Bb", 72), (134, "F", 74), (135.5, "C", 76), (137, "F", 66), (139.5, "Bb", 64), (141, "C", 64),
        (142, "Dm", 46), (144.5, "Gm", 46), (147, "Bb", 56), (149.5, "C", 62), (152, "Dm", 0), (154.3, "F", 86), (156, "C", 78),
        (158, "Bb", 56), (160.5, "F", 58), (163, "C", 62), (165.5, "Dm", 64), (168, "Bb", 68), (170, "F", 70), (172, "C", 70), (173.5, "Bb", 70), (175, "F", 72), (177, "C", 68), (179, "Bb", 66), (181, "F", 64), (183.6, "F", 54)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])

# 1. WARM PAD - almost always there; its level moves with the scene
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r, r + 7, r + 12, r + 12 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 0), (3, 78), (4.5, 100), (10.5, 100), (12.5, 62), (26.3, 46), (27.3, 96), (30, 90), (33.5, 64), (35, 26), (47.5, 26), (48.6, 74), (52, 46), (57, 28), (62, 44), (66.5, 54), (71, 64), (76, 74), (80.5, 70),
            (86, 82), (90, 100), (94, 88), (100, 96), (104.4, 104), (105, 60), (111, 74), (116, 86), (119.5, 40), (120.6, 10), (121.3, 72), (126, 58), (131, 28), (141.8, 26), (142.5, 88), (147, 66), (152, 56), (154.3, 24),
            (158, 20), (183, 20), (184.2, 54), (187.5, 44), (190, 0)])

# 2. PEDAL PIANO CHORDS - slightly rolled, low and dark for pain, higher for hope
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    bright = (33.5 <= t < 48) or (57 <= t < 62) or t >= 121
    ns = (r + 12, r + 19, r + 24, r + 24 + th, r + 31) if bright else (r, r + 7, r + 12, r + 12 + th, r + 19)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.045, min(end - t, 6), n, v - j)

# 3a. VIOLIN - pain
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(VLN, [(12.0, 1.5, 74), (13.5, 2.0, 73), (15.5, 0.5, 76), (16.0, 1.2, 77), (17.2, 1.1, 76), (18.3, 1.7, 74), (20.0, 1.5, 69), (21.5, 1.5, 72), (23.0, 1.0, 69), (24.0, 1.5, 67), (25.5, 1.0, 64), (26.5, 1.8, 62),
           (80.5, 1.5, 74), (82, 1.25, 70), (83.25, 1.5, 69), (84.75, 1.25, 73),
           (94, 1.5, 74), (95.5, 1.5, 70), (97, 1.5, 69), (98.5, 1.5, 76), (100, 1.5, 77), (101.5, 1, 74), (102.5, 1, 70), (103.5, 1, 67),
           (111, 1.3, 69), (112.3, 1.3, 74), (113.6, 1.4, 77), (115, 1.2, 74), (116.2, 1.8, 70), (118, 1.5, 69),
           (142.3, 1.2, 62), (143.5, 1, 65), (144.5, 1.5, 67), (146, 1, 64),
           (154.3, 1.7, 81), (156, 2, 79),
           (163, 1, 72), (164, 1, 76), (165, 0.5, 79), (165.5, 1.5, 77), (167, 1, 76), (168, 1, 74), (169, 1, 77), (170, 1.5, 81), (171.5, 0.5, 79), (172, 1, 76), (173, 0.5, 79), (173.5, 1.5, 77),
           (175, 2, 81), (177, 1.5, 79), (178.5, 0.5, 76), (179, 1, 77), (180, 1, 74), (181, 1, 72), (182, 3.2, 77)])
curve(VLN, [(11.9, 30), (13, 78), (16, 88), (18.3, 104), (21.5, 96), (24, 86), (26.5, 70), (28.3, 0), (80.4, 20), (81.5, 70), (85, 60), (86, 0), (93.9, 30), (95, 80), (100, 92), (103, 70), (104.5, 0),
            (110.9, 30), (112, 90), (116, 96), (118, 70), (119.5, 0), (142.2, 20), (143, 66), (146, 58), (147, 0), (154.2, 60), (154.6, 104), (157, 90), (158, 0), (162.9, 40), (164, 86), (170, 104), (175, 108), (181, 96), (183, 80), (185.2, 0)])

# 3b. PIANO MELODY / FIGURES - normal life and hope
line(LEAD, [(33.5, 0.5, 72), (34, 0.5, 77), (34.5, 1, 81), (35.5, 0.5, 79), (36, 0.5, 77), (36.5, 1, 76), (37.5, 0.5, 72), (38, 0.5, 76), (38.5, 1, 79), (39.5, 0.5, 77), (40, 0.5, 74), (40.5, 1, 69), (41.5, 0.5, 74), (42, 0.5, 77),
            (42.5, 1, 74), (43.5, 0.5, 77), (44, 0.5, 81), (44.5, 1, 79), (45.5, 1, 81), (46.5, 1, 77), (47.5, 1, 72), (52, 1, 74), (53, 1.5, 70), (54.5, 1, 76), (55.5, 1.5, 79),
            (57, 0.5, 81), (57.5, 0.5, 84), (58, 1, 81), (59, 0.5, 77), (59.5, 0.5, 74), (60, 0.5, 77), (60.5, 0.5, 74), (61, 1, 76),
            (126, 1, 65), (127, 1, 69), (128, 0.5, 72), (128.5, 1, 76), (129.5, 0.5, 79), (130, 1, 84),
            (137, 0.5, 81), (137.5, 0.5, 84), (138, 1, 81), (139, 0.5, 77), (139.5, 1, 82), (140.5, 0.5, 77), (141, 1, 79)], 70)
# the repeated figure: same shape every time, softer and lower as the wall grows
t = 62.0
while t < 94:
    r, th = at(t); dark = (t - 62) / 32; shift = 12 if t < 86 else 0; fig = (r + 12, r + 19, r + 24, r + 24 + th)
    note(LEAD, t, 0.5, fig[int(round((t - 62) * 2)) % 4] + shift, 62 - 22 * dark); t += 0.5
for t in (94, 95.5, 97, 98.5, 100, 101.5, 103): r, th = at(t); note(LEAD, t, 1.4, r + 36, 40)
# fast figures: the fight, the build, the finale
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(131, 137, 0.25, 62, 84); fast(137, 142, 0.25, 54, 58, 12); fast(147, 152, 0.5, 50, 82); fast(154.3, 158, 0.25, 84, 70)
fast(158, 163, 0.5, 48, 58); fast(163, 181, 0.25, 58, 82); fast(181, 183, 0.5, 60, 46)
note(LEAD, 183.6, 5, 77, 58); note(LEAD, 183.7, 5, 81, 52); note(LEAD, 186.2, 3.5, 84, 46)

# 4. COLOURS
for t0, t1 in ((131, 137), (154.3, 158), (168, 183.5)):      # strings swell / bed
    for p in PROG:
        if t0 <= p[0] < t1:
            nxt = min([q[0] for q in PROG if q[0] > p[0]] + [t1]); r, th = chord(p[1])
            for n in (r + 12, r + 24, r + 24 + th, r + 31): note(STR, p[0], min(nxt, t1) - p[0] + 0.2, n, 70)
curve(STR, [(131, 20), (136.6, 112), (137.2, 0), (154.2, 0), (154.4, 110), (157.5, 80), (158, 0), (168, 30), (175, 62), (181, 56), (184, 0)])
for n in (38, 39, 45, 50): note(ATM, 105, 6.4, n, 84); note(ATM, 152, 2.5, n, 60)      # the voice fills the room
curve(ATM, [(105, 30), (106.5, 100), (110.5, 118), (111.2, 0), (152, 20), (154.2, 90), (154.35, 0)])
for n in (62, 69): note(ECHO, 116.2, 3.6, n, 56)                                          # the mirror
note(BASS, 76, 18.4, 26, 70); note(BASS, 105, 6.2, 26, 96); note(BASS, 105, 6.2, 27, 80); note(BASS, 152, 2.3, 26, 84)
curve(BASS, [(76, 10), (86, 60), (90, 96), (94.3, 0), (105, 60), (110.6, 120), (111.1, 0), (152, 40), (154.2, 110), (154.35, 0)])
t = 90.0
while t < 94: note(TIMP, t, 0.5, 38, 46); note(TIMP, t + 0.28, 0.5, 38, 34); t += 1.0     # heartbeat
t, d = 105.4, 0.9
while t < 110.8: note(TIMP, t, 0.4, 38, 60 + (t - 105) * 8); note(TIMP, t + d * 0.3, 0.4, 38, 44 + (t - 105) * 6); t += d; d = max(0.34, d * 0.9)
for t in (152.2, 152.9, 153.5, 153.9): note(TIMP, t, 0.4, 38, 70)
def drums(t0, t1, v0, v1):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        note(DR, t, 0.1, 36, v); note(DR, t + 0.5, 0.1, 38, v * 0.8); note(DR, t + 0.75, 0.1, 36, v * 0.6)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
drums(132.5, 137, 48, 86); drums(137, 142, 50, 50); drums(149.5, 152, 40, 70); drums(154.3, 158, 80, 60)

ev.sort(key=lambda e: e[0])
mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1000000, time=0)); last = 0
for t, m in ev:
    tk = int(round(max(0, t) * 480)); m.time = tk - last; last = tk; tr.append(m)
tmp_mid, tmp_wav = OUT[:-4] + ".mid", OUT[:-4] + "_raw.wav"
os.makedirs(os.path.dirname(OUT), exist_ok=True); mid.save(tmp_mid)
subprocess.run(["fluidsynth", "-ni", "-F", tmp_wav, "-r", "44100", "-g", "0.7", "-o", "synth.reverb.room-size=0.92", "-o", "synth.reverb.damp=0.25", "-o", "synth.reverb.width=1", "-o", "synth.reverb.level=0.95",
                "-o", "synth.polyphony=512", SF2, tmp_mid], check=True, capture_output=True)
# gentle levelling so quiet scenes stay audible, then mean -18 dB, exactly 190 s
chain = "acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1"
r = subprocess.run(["ffmpeg", "-i", tmp_wav, "-t", str(DUR), "-af", chain + ",volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
mean = float(r.split("mean_volume:")[1].split("dB")[0]); peak = float(r.split("max_volume:")[1].split("dB")[0])
gain = min(-18 - mean, -1.2 - peak)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=188.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
