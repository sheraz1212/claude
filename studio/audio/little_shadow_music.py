"""LITTLE SHADOW - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: A minor, finale in C major.
The idea of this score: Eli's theme is a COPY - a short playful piano phrase, answered a moment
later by the same phrase an octave higher and softer. When he is alone, only the copy plays.
The cloud has its own sound (FX Echoes), which grows with it.

  0:00 hook            pad only (the pen is in the SFX track)
  0:04 driveway        the phrase and its copy, pedal chords, pad far back
  0:11 skate park      melody stops, pad up, low chords
  0:16 first puff      FX Echoes enters (the cloud)
  0:32 the repeats     the same rising three notes every time, lower and softer; echoes + drone grow
  0:50 Eli alone       only the copy plays, with nobody to copy
  1:04 the twist       violin; one naive bright chord under "like you!"
  1:20 it lands        violin over the pad, then atmosphere + drone + timpani heartbeat
  1:31 card            almost silent
  1:36 the decision    low pedal chords turning warm
  1:47 wisdom / truth  bright pedal chords, piano melody
  2:08 teaching Eli    the phrase and its copy again, light drums
  2:13 relapse         echoes and drone come back, violin
  2:28 stairs          fast piano + drums + strings
  2:33 the breath      atmosphere rises, then a big C major chord when he blows
  2:40 FINALE          gentle at dinner, then fast piano + violin + the copy phrase together
  3:03 lesson          last pedal chord, pad, fade
Run: python3 audio/little_shadow_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "little-shadow-copy-theme.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190
PAD, PNO, VLN, ATM, LEAD, STR, TIMP, BASS, ECHO, DR, COPY = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
ev = []
def cc(ch, t, c, v): ev.append((t, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def note(ch, t, d, n, v):
    ev.append((t, mido.Message("note_on", channel=ch, note=n, velocity=int(max(1, min(127, v)))))); ev.append((t + d - 0.01, mido.Message("note_off", channel=ch, note=n)))
def curve(ch, pts, step=0.12):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        k = max(1, int((t1 - t0) / step))
        for i in range(k): cc(ch, t0 + (t1 - t0) * i / k, 11, v0 + (v1 - v0) * i / k)
    cc(ch, pts[-1][0], 11, pts[-1][1])
for ch, prog, rev, vol in ((PAD, 89, 100, 100), (PNO, 0, 127, 104), (VLN, 40, 112, 96), (ATM, 99, 110, 90), (LEAD, 0, 110, 100), (STR, 48, 110, 88), (TIMP, 47, 100, 100), (BASS, 43, 80, 96), (ECHO, 102, 120, 88), (COPY, 0, 127, 96)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
cc(DR, 0, 91, 60); cc(DR, 0, 7, 80)

R = dict(A=33, F=29, C=36, G=31, D=38, E=28)
def chord(name): return R[name.rstrip("m")], (3 if name.endswith("m") else 4)
PROG = [(0, "Am", 0), (4.5, "C", 58), (6.5, "G", 56), (8.5, "Am", 56), (10, "F", 58), (11, "Am", 48), (13.5, "F", 46), (15, "E", 46), (16.5, "Dm", 44), (19.2, "F", 48), (22, "Am", 46), (24.5, "E", 44), (27, "F", 50), (29.5, "G", 50),
        (32, "Am", 50), (34.25, "F", 48), (36.5, "C", 52), (38.5, "E", 48), (41, "Am", 48), (43.5, "F", 46), (46, "Dm", 48), (48.2, "E", 48), (50.5, "C", 50), (52.4, "Am", 46), (55, "F", 46), (57.5, "G", 46), (59.5, "Am", 44), (62, "Am", 40),
        (64, "Dm", 46), (67, "E", 46), (69.5, "Am", 44), (72.2, "F", 42), (75, "Dm", 44), (77.4, "C", 46), (79, "E", 44), (80.5, "Am", 0), (83.5, "F", 0), (86.5, "Am", 0), (91.5, "Am", 0),
        (96, "F", 46), (99.4, "Am", 44), (101.5, "Dm", 48), (104.4, "F", 52), (107, "C", 56), (109.5, "G", 58), (112, "Am", 54), (114.5, "F", 58), (117, "Dm", 48), (120, "E", 48), (122.5, "Am", 54), (125, "G", 56),
        (128, "C", 66), (130, "G", 66), (132, "Am", 64), (133.5, "Dm", 48), (136.6, "E", 44), (138.5, "Am", 46), (141, "F", 50), (143.5, "C", 56), (146, "G", 60), (148.5, "Am", 68), (150, "F", 70), (151.5, "G", 72),
        (153, "Am", 0), (155.6, "F", 80), (157, "C", 88), (158.5, "G", 78), (160, "C", 64), (163, "F", 64), (166, "Am", 60), (169, "G", 62), (172, "C", 70), (174, "G", 70), (176, "Am", 70), (177, "F", 72), (178, "C", 72), (180, "G", 72), (181.5, "F", 70), (182.5, "C", 66), (183.6, "C", 54)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
CLOUD = [(16.5, 27), (32, 36.5), (41, 46), (59.5, 64), (69.5, 75), (117, 122.5), (133.5, 138.5)]
def bright(t): return (4.5 <= t < 11) or (107 <= t < 117) or (122.5 <= t < 133.5) or (143.5 <= t < 153) or t >= 155.6

# 1. PADS (warm pad always; FX Echoes = the cloud)
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r, r + 7, r + 12, r + 12 + th): note(PAD, t, end - t + 0.6, n, 70)
    if any(a <= t < b for a, b in CLOUD):
        for n in (r + 24, r + 31, r + 36 + th): note(ECHO, t, end - t + 0.4, n, 58)
curve(PAD, [(0, 0), (2.5, 70), (4.5, 30), (10.5, 28), (11.5, 70), (16.5, 60), (27, 64), (32, 56), (36.5, 44), (41, 60), (46, 64), (50.5, 50), (59.5, 88), (64, 62), (75, 70), (80.5, 96), (86.5, 60), (91.4, 70), (91.7, 18), (93.4, 12),
            (96, 72), (107, 56), (117, 62), (122.5, 44), (128, 26), (133.2, 26), (133.8, 84), (143.5, 54), (148.5, 26), (153, 54), (155.6, 22), (160, 30), (172, 20), (183, 20), (184.2, 52), (188, 42), (190, 0)])
npts = [(0, 0)]
for k, (a, b) in enumerate(CLOUD): npts += [(a - 0.05, 0), (a + 1.2, 56 + 9 * min(k, 4)), (b - 1.0, 56 + 9 * min(k, 4)), (b, 0)]
curve(ECHO, npts)

# 2. PEDAL PIANO CHORDS
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 12, r + 19, r + 24, r + 24 + th, r + 31) if bright(t) else (r, r + 7, r + 12, r + 12 + th, r + 19)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3. ELI'S THEME: a phrase, then its copy an octave up
PH = ((0, 0.3, 76), (0.5, 0.3, 79), (1.0, 0.6, 81), (1.75, 0.3, 79), (2.25, 0.7, 76))
def phrase(t0, lead=True, copy=True, v=72, tr=0):
    for dt, d, n in PH:
        if lead: note(LEAD, t0 + dt, d, n + tr, v)
        if copy: note(COPY, t0 + dt + 1.5, d, n + tr + 12, v - 26)
for t0 in (4.8, 7.8): phrase(t0)
phrase(50.6, lead=False, v=84)                       # Eli alone: only the copy
for t0 in (128.3, 131.0): phrase(t0, v=76)
for t0 in (172.2, 175.2, 178.2): phrase(t0, v=78, tr=(0 if t0 < 178 else -4))

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(VLN, [(64, 2, 76), (66, 1, 74), (67, 2.4, 71), (75, 1.2, 77), (76.2, 1.2, 74), (77.4, 1.6, 76), (79, 1.5, 68), (80.5, 1.5, 69), (82, 1.5, 72), (83.5, 1.5, 81), (85, 1.5, 77),
           (138.8, 1.5, 64), (140.3, 1.2, 69), (141.5, 2, 72), (155.6, 1.4, 81), (157, 1.5, 79), (158.5, 1.5, 74),
           (172, 1, 76), (173, 1, 79), (174, 1, 74), (175, 1, 71), (176, 1, 72), (177, 1, 81), (178, 1.5, 79), (179.5, 0.5, 76), (180, 1.5, 74), (181.5, 1, 77), (182.5, 3.3, 76)])
curve(VLN, [(63.9, 20), (65, 60), (69, 50), (69.6, 0), (74.9, 30), (76, 84), (80.5, 96), (84, 100), (86.4, 60), (86.8, 0), (138.7, 20), (139.6, 66), (143, 56), (143.6, 0),
            (155.5, 70), (156.2, 106), (159.5, 86), (160.2, 0), (171.9, 40), (173, 86), (177, 106), (181, 100), (183.5, 84), (185.8, 0)])
line(LEAD, [(36.5, 1, 76), (37.5, 1, 79), (107, 1, 79), (108, 1, 76), (109.5, 1, 74), (110.5, 1.5, 71), (112, 1, 72), (113, 1, 76), (114.5, 1, 81), (115.5, 1.5, 77),
            (122.5, 1, 69), (123.5, 1, 72), (124.5, 0.5, 76), (125, 1.5, 74), (126.5, 1.5, 71), (143.5, 1, 76), (144.5, 1, 79), (146, 1, 74), (147, 1.5, 79),
            (160, 1, 79), (161, 1, 76), (162, 1, 72), (163, 1, 77), (164, 1, 81), (165, 1, 84), (166, 1.5, 76), (167.5, 1.5, 72), (169, 1.5, 74), (170.5, 1.5, 71)], 66)
# the repeated alley figure: three rising notes, again and again, lower and softer
for a, b in ((22, 27), (32, 36.5), (41, 46), (59.5, 64)):
    t = a
    while t < b - 0.01:
        r, th = at(t); dark = (t - 22) / 42; fig = (r + 12, r + 12 + th, r + 19, r + 19)
        note(LEAD, t, 0.5, fig[int(round((t - a) * 2)) % 4] + (12 if t < 41 else 0), 58 - 24 * dark); t += 0.5
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12 + th, r + 12, r + 19, r + 12, r + 12 + th, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(148.5, 153, 0.25, 64, 86); fast(155.6, 160, 0.25, 86, 70); fast(160, 172, 0.5, 44, 52, 12); fast(172, 182.5, 0.25, 58, 80, 12); fast(182.5, 183.4, 0.5, 58, 46, 12)
note(LEAD, 183.6, 5, 76, 58); note(LEAD, 183.7, 5, 79, 52); note(COPY, 185.1, 4, 88, 40); note(COPY, 185.2, 4, 91, 36)

# 4. COLOURS
for t0, t1 in ((148.5, 153), (155.6, 160), (172, 183.5)):
    for p in PROG:
        if t0 <= p[0] < t1:
            nxt = min([q[0] for q in PROG if q[0] > p[0]] + [t1]); r, th = chord(p[1])
            for n in (r + 12, r + 24, r + 24 + th, r + 31): note(STR, p[0], min(nxt, t1) - p[0] + 0.2, n, 70)
curve(STR, [(148.5, 30), (152.6, 104), (153.2, 0), (155.5, 0), (156.4, 112), (159.5, 80), (160, 0), (172, 30), (177, 66), (181, 60), (184, 0)])
for n in (45, 46, 52, 57): note(ATM, 86.5, 5.1, n, 84); note(ATM, 153, 2.8, n, 62)
curve(ATM, [(86.5, 30), (88, 100), (91, 118), (91.5, 0), (153, 14), (155.4, 96), (155.65, 0)])
note(BASS, 41, 23.2, 33, 70); note(BASS, 86.5, 4.9, 33, 96); note(BASS, 86.5, 4.9, 34, 80); note(BASS, 153, 2.5, 33, 84)
curve(BASS, [(41, 8), (55, 46), (59.5, 92), (64.2, 0), (86.5, 60), (91, 120), (91.5, 0), (153, 30), (155.4, 110), (155.65, 0)])
t = 59.5
while t < 64: note(TIMP, t, 0.5, 45, 44); note(TIMP, t + 0.28, 0.5, 45, 32); t += 1.0
t, d = 86.9, 0.9
while t < 91.2: note(TIMP, t, 0.4, 45, 60 + (t - 86.5) * 8); note(TIMP, t + d * 0.3, 0.4, 45, 44 + (t - 86.5) * 6); t += d; d = max(0.34, d * 0.9)
def drums(t0, t1, v0, v1, light=False):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        if not light: note(DR, t, 0.1, 36, v); note(DR, t + 0.75, 0.1, 36, v * 0.6)
        note(DR, t + 0.5, 0.1, 37 if light else 38, v * 0.8)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
drums(128, 133.5, 44, 52, True); drums(148.5, 153, 60, 86); drums(157, 160, 78, 58)

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
