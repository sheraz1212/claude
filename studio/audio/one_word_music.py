"""ONE WORD - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: G minor, finale in B flat major.
The idea of this score: THE WORD IS ONE NOTE. One low, dry piano G lands when the coach says
it. Then he repeats it - the same single note, more and more often, until it hammers. At the
twist it counts up to 515 and stops dead. In the final it tries three more times and fades.
Hope moves in flowing triplets (three notes per beat), which no earlier film used.

  0:00 hook            pad only
  0:04 the pitch       light piano, pedal chords
  0:13 THE WORD        everything stops; one low dry note
  0:16 locker / night  pad up, dark chords, FX Sci-fi under the note
  0:32 the repeats     the one note: every second, then twice, then four times a second
  0:50 the stands      violin
  1:15 the twist       music thins out; then the note counts up fast and cuts to near silence
  1:26 low point       atmosphere + drone + timpani, the note hammering in octaves
  1:36 peel / wisdom   warm rising piano, bright pedal chords
  1:52 training        flowing triplets + drums; one dark bar when the first shot goes in
  2:08 the reversals   bright piano melody
  2:23 the final       strings and timpani build
  2:28 the word again  three quiet notes that fade away
  2:36 the catch       big B flat major chord
  2:51 FINALE          triplet piano + violin together, pad far back
  3:03 lesson          last pedal chord, pad, fade
Run: python3 audio/one_word_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "one-word-the-repeated-note.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 190
PAD, PNO, VLN, ATM, LEAD, STR, TIMP, BASS, SCI, DR, WORD = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
ev = []
def cc(ch, t, c, v): ev.append((t, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def note(ch, t, d, n, v):
    ev.append((t, mido.Message("note_on", channel=ch, note=n, velocity=int(max(1, min(127, v)))))); ev.append((t + d - 0.01, mido.Message("note_off", channel=ch, note=n)))
def curve(ch, pts, step=0.12):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        k = max(1, int((t1 - t0) / step))
        for i in range(k): cc(ch, t0 + (t1 - t0) * i / k, 11, v0 + (v1 - v0) * i / k)
    cc(ch, pts[-1][0], 11, pts[-1][1])
for ch, prog, rev, vol in ((PAD, 89, 100, 100), (PNO, 0, 127, 104), (VLN, 40, 112, 96), (ATM, 99, 110, 90), (LEAD, 0, 110, 100), (STR, 48, 110, 88), (TIMP, 47, 100, 100), (BASS, 43, 80, 96), (SCI, 103, 120, 84), (WORD, 0, 40, 110)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
cc(DR, 0, 91, 60); cc(DR, 0, 7, 80)

R = dict(G=31, Eb=27, Bb=34, F=29, C=36, D=38)
def chord(name): return R[name.rstrip("m")], (3 if name.endswith("m") else 4)
PROG = [(0, "Gm", 0), (4.5, "Bb", 58), (6.5, "F", 56), (8.5, "Gm", 56), (10, "Eb", 54), (11, "Cm", 48), (13.6, "Gm", 0), (15, "Gm", 40), (16.5, "Eb", 44), (19, "Cm", 44), (21.5, "Gm", 42), (24, "D", 44), (27, "Eb", 48), (29.5, "F", 48),
        (32, "Gm", 46), (34.25, "Eb", 44), (36.5, "Bb", 52), (38.6, "Cm", 46), (41, "Gm", 44), (43.25, "Eb", 42), (45.5, "Cm", 46), (47.6, "D", 44), (50, "Eb", 46), (52, "Cm", 46), (54.5, "Bb", 46), (57, "D", 44), (59.5, "Gm", 42), (62, "Gm", 38),
        (64, "Eb", 46), (67, "F", 46), (69.5, "Bb", 52), (72.5, "F", 52), (75, "Bb", 54), (77.4, "Gm", 48), (79.2, "Eb", 40), (80.5, "Gm", 0), (86, "Gm", 0), (91.5, "Gm", 0),
        (96, "Eb", 50), (98.5, "Bb", 54), (101.5, "Cm", 54), (104, "F", 58), (107, "Bb", 58), (109.5, "Eb", 58), (112, "Gm", 56), (114.3, "Cm", 46), (116, "D", 48), (117.5, "Bb", 62), (119.5, "F", 62), (121.5, "Eb", 62), (123, "Bb", 58), (125.5, "F", 58),
        (128, "Bb", 64), (130.5, "Eb", 64), (133, "F", 60), (135.5, "Bb", 62), (138, "Gm", 54), (140.6, "Eb", 58), (143, "Cm", 56), (145.5, "D", 60), (148.5, "Gm", 0), (153.5, "Gm", 0), (156.2, "Bb", 88), (158, "F", 78),
        (160, "Eb", 58), (163, "Bb", 60), (165.5, "Gm", 58), (168, "F", 60), (171, "Bb", 70), (172.5, "F", 70), (173.9, "Eb", 76), (175.5, "Bb", 74), (177.5, "Gm", 70), (179, "Eb", 72), (180.5, "F", 72), (182, "Bb", 68), (183.6, "Bb", 54)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
INNER = [(13.6, 27), (32, 36.5), (41, 45.5), (59.5, 64), (80.5, 84.5), (148.5, 153.5)]
def bright(t): return (4.5 <= t < 8.5) or (36.5 <= t < 38.6) or (69.5 <= t < 77.4) or (96 <= t < 112) or (117.5 <= t < 148.5) or t >= 156.2

# 1. PADS (warm pad; FX Sci-fi under the word)
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r, r + 7, r + 12, r + 12 + th): note(PAD, t, end - t + 0.6, n, 70)
    if any(a <= t < b for a, b in INNER):
        for n in (r + 24, r + 31): note(SCI, t, end - t + 0.4, n, 56)
curve(PAD, [(0, 0), (2.5, 66), (4.5, 30), (11, 34), (13.5, 40), (13.7, 70), (16.5, 86), (27, 70), (32, 56), (36.5, 40), (38.6, 60), (50, 62), (59.5, 88), (64, 60), (69.5, 36), (77.4, 50), (79.2, 30), (80.5, 40), (84.4, 46), (84.7, 10), (86, 14), (86.2, 60), (91.4, 70), (91.7, 18), (93.4, 12),
            (96, 66), (107, 50), (112, 30), (123, 34), (128, 30), (143, 40), (148.5, 60), (153.5, 56), (156.2, 22), (160, 34), (171, 20), (183, 20), (184.2, 52), (188, 42), (190, 0)])
npts = [(0, 0)]
for k, (a, b) in enumerate(INNER): npts += [(a - 0.05, 0), (a + 1.0, 54 + 9 * min(k, 4)), (b - 0.8, 54 + 9 * min(k, 4)), (b, 0)]
curve(SCI, npts)

# 2. PEDAL PIANO CHORDS
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 12, r + 19, r + 24, r + 24 + th, r + 31) if bright(t) else (r, r + 7, r + 12, r + 12 + th, r + 19)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3. THE WORD = one low dry note
def hit(t, v, octv=False): note(WORD, t, 0.5, 43, v); (note(WORD, t, 0.5, 31, v - 10) if octv else None)
hit(13.6, 110, True); hit(23.6, 70); hit(24.6, 58); hit(38.5, 52); hit(47.6, 56); hit(48.1, 48); hit(56.4, 56); hit(115, 60); hit(150.4, 50); hit(151.0, 40); hit(151.6, 28)
def hammer(a, b, step, v0, v1, octv=False):
    t = a
    while t < b - 1e-6: hit(t, v0 + (v1 - v0) * (t - a) / (b - a), octv); t += step
hammer(32.6, 36.5, 1.0, 46, 52); hammer(41.5, 45.5, 0.5, 50, 60); hammer(59.8, 64, 0.25, 50, 72); hammer(86.4, 91.4, 0.25, 60, 92, True)
t, d = 82.0, 0.45
while t < 84.5: hit(t, 50 + (t - 82) * 22); t += d; d = max(0.07, d * 0.86)

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
line(LEAD, [(4.5, 0.5, 74), (5, 0.5, 77), (5.5, 1, 82), (6.5, 0.5, 81), (7, 0.5, 77), (27.5, 1.5, 67), (29.5, 1, 70), (30.5, 1.5, 69), (36.6, 0.5, 77), (37.1, 0.5, 82), (37.6, 1, 86),
            (69.5, 1, 74), (70.5, 1, 77), (71.5, 1, 82), (72.5, 1, 81), (73.5, 1, 77), (75, 1, 82), (76, 1.2, 86), (96.5, 1, 67), (97.6, 1, 70), (98.6, 1, 74), (99.6, 1.5, 77), (101.9, 1.5, 75), (104, 1.5, 77), (105.6, 1.2, 81),
            (107.5, 1, 74), (108.5, 1, 77), (109.6, 1, 79), (110.6, 1.3, 82), (123.5, 1, 74), (124.5, 1, 77), (125.5, 1, 72), (126.5, 1.2, 77), (128.6, 0.4, 77), (129, 0.4, 82), (129.4, 1.5, 86), (131, 1, 87), (132, 1, 86),
            (133.6, 1, 72), (134.6, 1, 77), (135.6, 1.5, 82), (138.5, 1.5, 67), (140.6, 1, 70), (141.6, 1.2, 75), (160.5, 1.5, 70), (162, 1, 67), (163, 2, 74), (165.8, 1, 74), (166.8, 1, 79), (168, 1, 81), (169, 1.5, 77)], 66)
line(VLN, [(50, 2, 79), (52, 2, 75), (54.6, 2, 74), (57, 2, 78), (77.4, 1.6, 70), (79.2, 1.3, 67), (114.3, 1.5, 72), (116, 1.4, 69), (143, 2.5, 75), (145.5, 2.8, 74), (156.2, 1.8, 86), (158, 1.8, 84),
           (171, 1, 74), (172, 0.5, 77), (172.5, 1.4, 81), (173.9, 1.6, 82), (175.5, 1, 77), (176.5, 1, 74), (177.5, 1.5, 82), (179, 1.5, 79), (180.5, 1.5, 81), (182, 3.6, 82)])
curve(VLN, [(49.9, 20), (51, 76), (59, 70), (59.6, 0), (77.3, 30), (78, 70), (80.4, 40), (80.6, 0), (114.2, 30), (115, 72), (117.4, 40), (117.6, 0), (142.9, 30), (146, 96), (148.4, 80), (148.6, 0),
            (156.1, 70), (156.6, 108), (159.6, 86), (160.2, 0), (170.9, 40), (172, 88), (174, 108), (181, 100), (183.5, 84), (185.8, 0)])
# flowing triplets = hope
def trip(t0, t1, v0, v1, oct=24):
    t = t0; i = 0; step = 1 / 3
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12 + th, r + 12, r + 19, r + 12 + th)
        note(LEAD, t, step * 1.8, pat[i % 6] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (7 if i % 3 == 0 else 0)); t += step; i += 1
trip(112, 114.3, 54, 62, 12); trip(117.5, 123, 58, 78, 12); trip(143, 148.5, 50, 82, 12); trip(156.2, 160, 84, 68); trip(171, 182, 62, 84, 12); trip(182, 183.4, 58, 44, 12)
note(LEAD, 183.6, 5, 74, 58); note(LEAD, 183.7, 5, 77, 52); note(LEAD, 186.2, 3.5, 82, 46)

# 4. COLOURS
for t0, t1 in ((143, 148.5), (156.2, 160), (171, 183.5)):
    for p in PROG:
        if t0 <= p[0] < t1:
            nxt = min([q[0] for q in PROG if q[0] > p[0]] + [t1]); r, th = chord(p[1])
            for n in (r + 12, r + 24, r + 24 + th, r + 31): note(STR, p[0], min(nxt, t1) - p[0] + 0.2, n, 70)
curve(STR, [(143, 24), (148.2, 110), (148.6, 0), (156.1, 0), (156.6, 112), (159.5, 80), (160, 0), (171, 30), (174, 76), (181, 62), (184, 0)])
for n in (43, 44, 50, 55): note(ATM, 86, 5.6, n, 84); note(ATM, 153.5, 2.9, n, 60)
curve(ATM, [(86, 30), (87.5, 100), (91, 118), (91.5, 0), (153.5, 14), (156, 92), (156.25, 0)])
note(BASS, 41, 23.2, 31, 70); note(BASS, 86, 5.4, 31, 96); note(BASS, 86, 5.4, 32, 80); note(BASS, 148.5, 7.6, 31, 80)
curve(BASS, [(41, 8), (55, 44), (59.5, 90), (64.2, 0), (86, 60), (91, 120), (91.5, 0), (148.5, 20), (153.5, 60), (156, 100), (156.25, 0)])
t = 59.5
while t < 64: note(TIMP, t, 0.5, 43, 40); note(TIMP, t + 0.28, 0.5, 43, 30); t += 1.0
t, d = 86.4, 0.9
while t < 91.2: note(TIMP, t, 0.4, 43, 60 + (t - 86) * 8); note(TIMP, t + d * 0.3, 0.4, 43, 44 + (t - 86) * 6); t += d; d = max(0.34, d * 0.9)
t = 143.0
while t < 148.5: note(TIMP, t, 0.5, 43, 50 + (t - 143) * 8); t += 1.0 if t < 146 else 0.5
def drums(t0, t1, v0, v1, light=False):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        if not light: note(DR, t, 0.1, 36, v); note(DR, t + 2 / 3, 0.1, 36, v * 0.6)
        note(DR, t + 1 / 3, 0.1, 37 if light else 38, v * 0.8)
        for k in range(3): note(DR, t + k / 3, 0.08, 42, v * (0.6 if k == 0 else 0.4))
        t += 1.0
drums(117.5, 123, 52, 72); drums(145.5, 148.5, 50, 84); drums(156.2, 160, 78, 58); drums(171, 177.5, 46, 58, True)

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
