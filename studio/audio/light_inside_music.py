"""THE LIGHT INSIDE - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: E minor, finale in G major.
A different recipe from the last film: dry piano chords for the hook, a New Age pad for the
night scenes, FX Echoes for the mirror, and a finale that dips quiet in the middle.

  0:00 hook            two dry piano chords, pad barely there
  0:04 library         light piano melody, pedal chords, pad far back
  0:16 first night     New Age pad up, melody gone, dark pedal chords
  0:27 mirror          FX Echoes notes over the pad
  0:32 the repeats     the same falling piano figure every night, each time lower and softer; drone grows
  1:04 the cost        violin leads (library, cafe in the rain)
  1:26 low point       atmosphere pad + drone + timpani heartbeat, no melody
  1:31 stat card       almost silent
  1:36 the steps       violin, then warm piano when Dev says "me too"
  1:53 wisdom/decision bright pedal chords, piano melody
  2:08 the run         fast piano + drums + strings
  2:17 relapse         drops to pad + low violin
  2:22 again           piano builds; atmosphere rises in the void; big chord when he takes the light
  2:40 FINALE          fast piano + violin together, a quiet dip for the night shot, then full
  3:03 lesson          last pedal chord, pad, fade
Run: python3 audio/light_inside_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "light-inside-night-to-morning.wav")
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

R = dict(E=28, C=36, G=31, D=38, A=33, B=35)
def chord(name): return R[name.rstrip("m")], (3 if name.endswith("m") else 4)
PROG = [(0, "Em", 0), (4.5, "G", 58), (7, "D", 56), (9, "Em", 56), (11, "C", 58), (13, "G", 58), (15, "D", 56),
        (16.5, "Em", 46), (19.2, "C", 44), (22, "Am", 44), (25, "B", 46), (27.5, "Em", 48), (30, "C", 48),
        (32, "Em", 50), (34.25, "C", 48), (36.5, "G", 50), (38.5, "D", 48), (40.5, "Em", 48), (42.75, "C", 46), (45, "Am", 48), (47, "B", 48), (49, "C", 48), (52, "D", 46), (54.5, "Em", 44), (57, "B", 44), (59, "Em", 44), (61.5, "Em", 40),
        (64, "Am", 50), (67, "Em", 50), (70, "C", 46), (73, "B", 46), (75.5, "Em", 48), (78.5, "C", 48), (81, "Am", 46), (83.5, "B", 46), (86, "Em", 0), (91.5, "Em", 0),
        (96, "C", 44), (99, "G", 46), (102, "Am", 48), (105, "C", 54), (107.5, "G", 56), (110.5, "D", 60), (113, "Em", 56), (115.5, "C", 60), (118, "G", 60), (120.5, "D", 60), (123, "C", 56), (125.5, "G", 56),
        (128, "G", 68), (129.5, "D", 68), (131, "Em", 68), (132.2, "C", 70), (133, "G", 60), (135.5, "C", 62), (137.5, "Em", 46), (140, "B", 44), (142, "C", 52), (144.5, "D", 58), (147, "G", 60), (149.5, "Em", 58),
        (151.5, "Em", 0), (155.9, "C", 80), (156.6, "G", 88), (158.5, "D", 78),
        (160, "G", 64), (162.5, "D", 64), (165.5, "C", 54), (168, "G", 56), (171, "Em", 66), (173, "C", 68), (175, "G", 70), (176.5, "D", 70), (178, "Em", 70), (179.5, "C", 72), (181, "D", 72), (182.2, "G", 68), (183.6, "G", 54)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
NIGHT = [(16.5, 27.5), (32, 36.5), (40.5, 45), (59, 64), (123, 128), (137.5, 142), (165.5, 171)]
def bright(t): return (4.5 <= t < 16.5) or (105 <= t < 137.5) or (142 <= t < 151.5) or t >= 155.9

# 1. PADS
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r, r + 7, r + 12, r + 12 + th): note(PAD, t, end - t + 0.6, n, 70)
    if any(a <= t < b for a, b in NIGHT):
        for n in (r + 12, r + 19, r + 24 + th): note(NEW, t, end - t + 0.4, n, 62)
curve(PAD, [(0, 0), (3, 56), (4.5, 30), (16, 28), (16.5, 66), (19.2, 86), (27.5, 70), (32, 58), (45, 64), (59, 88), (64, 58), (70, 78), (75.5, 54), (86, 58), (91.4, 70), (91.7, 18), (93.4, 12), (96, 70), (105, 50), (113, 60),
            (118, 40), (123, 68), (128, 24), (137.2, 24), (137.7, 84), (142, 58), (147, 40), (151.5, 54), (155.9, 22), (165.5, 30), (171, 20), (183, 20), (184.2, 52), (188, 42), (190, 0)])
npts = [(0, 0)]
for a, b in NIGHT: npts += [(a - 0.05, 0), (a + 1.2, 92), (b - 1.0, 92), (b, 0)]
curve(NEW, npts)

# 2. PEDAL PIANO CHORDS (and the two dry chords of the hook)
for t0, ns in ((0.6, (52, 55, 59)), (2.3, (48, 55, 60, 64))):
    for j, n in enumerate(ns): note(DRY, t0, 0.55, n, 62 - j * 2)
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 12, r + 19, r + 24, r + 24 + th, r + 31) if bright(t) else (r, r + 7, r + 12, r + 12 + th, r + 19)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3a. VIOLIN - pain, and the finale
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(VLN, [(64, 1.5, 69), (65.5, 1.5, 72), (67, 1.5, 71), (68.5, 1.5, 67), (70, 2, 76), (72, 1, 74), (73, 1.2, 71), (74.2, 1.3, 75), (75.5, 1.5, 76), (77, 1.5, 79), (78.5, 1.2, 76), (79.7, 1.3, 72), (81, 1.5, 69), (82.5, 1, 72), (83.5, 2.3, 71),
           (96, 2, 64), (98, 1.5, 67), (99.5, 1.5, 74), (101, 1, 71), (102, 1.5, 72), (103.5, 1.5, 69),
           (137.8, 1.5, 64), (139.3, 1.2, 67), (140.5, 1.5, 66),
           (155.9, 0.7, 76), (156.6, 1.9, 79), (158.5, 1.5, 81),
           (160, 1, 74), (161, 1.5, 79), (162.5, 1, 81), (163.5, 1, 78), (164.5, 1, 74), (165.5, 2.5, 76), (168, 3, 74),
           (171, 1, 71), (172, 1, 76), (173, 1, 79), (174, 1, 76), (175, 1.5, 83), (176.5, 1.5, 81), (178, 1, 79), (179, 0.5, 76), (179.5, 1.5, 79), (181, 1.2, 81), (182.2, 3.4, 79)])
curve(VLN, [(63.9, 30), (65, 82), (70, 92), (75.5, 86), (81, 80), (84, 60), (86, 0), (95.9, 25), (97, 74), (102, 80), (104, 50), (105, 0), (137.7, 20), (138.6, 64), (141, 56), (142, 0),
            (155.8, 70), (156.6, 108), (159, 92), (160, 84), (165, 90), (165.6, 48), (170.5, 44), (171, 78), (175, 106), (181, 100), (183, 84), (185.6, 0)])

# 3b. PIANO MELODY - normal life and hope
line(LEAD, [(4.5, 0.5, 74), (5, 0.5, 79), (5.5, 1, 83), (6.5, 0.5, 81), (7, 1, 78), (8, 0.5, 74), (8.5, 0.5, 78), (9, 1, 79), (10, 1, 76), (11, 0.5, 76), (11.5, 0.5, 79), (12, 1, 84), (13, 0.5, 83), (13.5, 0.5, 79), (14, 1, 74), (15, 0.5, 78), (15.5, 1, 81),
            (105, 1, 76), (106, 1.5, 79), (107.5, 1, 83), (108.5, 1, 79), (109.5, 1, 74), (110.5, 1.5, 78), (112, 1, 81),
            (118, 1, 71), (119, 1, 74), (120, 0.5, 79), (120.5, 1.5, 78), (122, 1, 74), (123, 2, 76), (125.5, 2, 74),
            (147, 1, 71), (148, 1, 74), (149, 0.5, 79), (149.5, 1.5, 76), (151, 0.5, 71)], 68)
# the repeated night figure: the same falling shape, lower and softer each night
t = 32.0
while t < 64:
    r, th = at(t); dark = (t - 32) / 32; shift = 12 if t < 49 else 0; fig = (r + 24 + th, r + 24, r + 19, r + 12)
    if not (36.5 <= t < 40.5 or 54.5 <= t < 59): note(LEAD, t, 0.5, fig[int(round((t - 32) * 2)) % 4] + shift, 60 - 22 * dark)
    t += 0.5
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 12, r + 7, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(128, 133, 0.25, 64, 84); fast(133, 137.4, 0.5, 52, 56, 12); fast(142, 147, 0.5, 46, 74); fast(155.9, 160, 0.25, 86, 72)
fast(160, 165.5, 0.25, 62, 74); fast(165.5, 171, 0.5, 44, 48, 12); fast(171, 182.2, 0.25, 62, 84); fast(182.2, 183.4, 0.5, 60, 46)
note(LEAD, 183.6, 5, 79, 58); note(LEAD, 183.7, 5, 83, 52); note(LEAD, 186.2, 3.5, 86, 46)

# 4. COLOURS
for t0, t1 in ((128, 133), (155.9, 160), (171, 183.5)):
    for p in PROG:
        if t0 <= p[0] < t1:
            nxt = min([q[0] for q in PROG if q[0] > p[0]] + [t1]); r, th = chord(p[1])
            for n in (r + 12, r + 24, r + 24 + th, r + 31): note(STR, p[0], min(nxt, t1) - p[0] + 0.2, n, 70)
curve(STR, [(128, 30), (132.6, 108), (133.2, 0), (155.8, 0), (156.6, 112), (159.5, 80), (160, 0), (171, 30), (176, 66), (181, 60), (184, 0)])
for n in (40, 41, 47, 52): note(ATM, 86, 5.6, n, 84); note(ATM, 151.5, 4.6, n, 62)
curve(ATM, [(86, 30), (87.5, 100), (91, 118), (91.5, 0), (151.5, 14), (155.7, 96), (155.95, 0)])
for t0, ns in ((27.9, (71, 76)), (30, (72, 79)), (36.8, (71, 74)), (38.6, (69, 74)), (54.8, (64, 71)), (57, (63, 71))):
    for n in ns: note(ECHO, t0, 2.2, n, 54)
note(BASS, 40.5, 23.8, 28, 70); note(BASS, 86, 5.4, 28, 96); note(BASS, 86, 5.4, 29, 80); note(BASS, 151.5, 4.3, 28, 84)
curve(BASS, [(40.5, 8), (54, 50), (59, 92), (64.2, 0), (86, 60), (91, 120), (91.5, 0), (151.5, 30), (155.7, 110), (155.95, 0)])
t = 59.0
while t < 64: note(TIMP, t, 0.5, 40, 44); note(TIMP, t + 0.28, 0.5, 40, 32); t += 1.0
t, d = 86.4, 0.9
while t < 91.2: note(TIMP, t, 0.4, 40, 60 + (t - 86) * 8); note(TIMP, t + d * 0.3, 0.4, 40, 44 + (t - 86) * 6); t += d; d = max(0.34, d * 0.9)
def drums(t0, t1, v0, v1):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        note(DR, t, 0.1, 36, v); note(DR, t + 0.5, 0.1, 38, v * 0.8); note(DR, t + 0.75, 0.1, 36, v * 0.6)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
drums(128, 133, 60, 84); drums(144.5, 147, 38, 60); drums(156.6, 160, 78, 58)

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
