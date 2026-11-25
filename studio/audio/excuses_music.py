"""EXCUSES - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: G minor, the recovery and finale in B-flat major.
ONE IDEA: "the clock" - a 4-note pizzicato tick (G-Bb-D-C). Every excuse it LOSES a note (4 -> 3 -> 2 -> 1),
until at 0% only a lonely single tick is left. When he gets up, the notes come back one by one, the
tick becomes the piano melody, and the finale plays it fast on piano with the violin.
  0:00 hook            pad + the full 4-note tick under the alarm
  0:06 the excuses     pedal chords G minor, the tick loses a note after each bar slip
  1:07 low point       pad up + bass drone + Atmosphere, one lonely tick; 1:19 cards: New Age pad
  1:28 decision        the motif slow on piano
  1:28 the turn        a real DRUM BEAT fades in (kick-snare groove, hats) and is full by 6:00
  1:36 recovery        the tick gets its notes back, piano melody - the drums on top, the piano stepped back
  2:08 the guitar      a tom fill + crash and the beat CHANGES: four-on-the-floor, claps, open hats, shaker;
                       the bad morning fades the drums out; a fill brings them back for the finale
  2:40 FINALE          fast piano + violin together in B-flat, pads far back
  3:03 lesson          last chord, fade
Run: python3 audio/excuses_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "excuses-the-ticking-clock.wav")
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
ev.append((0, mido.Message("program_change", channel=PIZ, program=45))); cc(PIZ, 0, 91, 80); cc(PIZ, 0, 7, 100)
R = {"G": 31, "Bb": 34, "C": 36, "D": 38, "Eb": 39, "F": 41}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "Gm", 46), (6, "Eb", 44), (11, "Cm", 0), (14, "Gm", 46), (20, "Eb", 44), (26, "D", 0), (29, "Gm", 44), (32, "Cm", 44), (38, "Eb", 42), (42, "D", 0), (45, "Gm", 42), (51, "Eb", 40), (55, "Cm", 0),
        (58, "Gm", 42), (64, "D", 0), (67, "Gm", 40), (73, "Eb", 0), (79, "Gm", 0), (79.2, "Eb", 46), (83, "Cm", 46), (87.5, "Bb", 50), (91, "F", 50), (93.8, "Gm", 52),
        (96, "Bb", 56), (99, "F", 56), (102, "Gm", 58), (105, "Eb", 60), (107, "F", 62), (110, "Bb", 58), (113, "Eb", 60), (116, "F", 62), (119, "Bb", 62), (122, "Gm", 60), (125, "F", 64),
        (128, "Eb", 62), (131, "Bb", 64), (134, "F", 66), (137, "Gm", 62), (140, "Eb", 64), (143, "Gm", 44), (146, "Cm", 44), (149, "Eb", 58), (152, "F", 62), (154, "Bb", 66), (157.6, "F", 72),
        (160, "Bb", 68), (162, "F", 66), (164, "Gm", 66), (166, "Eb", 66), (168, "Bb", 70), (170, "F", 68), (172, "Gm", 66), (174, "Eb", 68), (176, "Bb", 72), (178, "F", 70), (180, "Eb", 66), (181.5, "F", 64), (183, "Bb", 56)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return t >= 87.5

for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 40), (6, 46), (64, 60), (67, 84), (78.8, 96), (79.1, 40), (87.5, 50), (96, 30), (128, 24), (143, 64), (148.8, 50), (149, 30), (160, 14), (182.5, 16), (183.2, 58), (188, 44), (190, 0)])
for n in (55, 62, 67, 70): note(ATM, 67, 12, n, 80)
curve(ATM, [(66.9, 0), (69, 90), (78.6, 100), (79, 0)])
for n in (70, 74, 77): note(NEW, 79.2, 8.4, n, 56)
curve(NEW, [(79.1, 0), (80.4, 70), (87, 60), (87.6, 0)])

for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if bright(t) else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# THE CLOCK: the 4-note tick, losing notes with each excuse
TICK = (67, 70, 74, 72)   # G Bb D C
def tick(t0, t1, nn, v, step=0.5, shift=0):
    t = t0; i = 0
    while t < t1 - 0.02:
        k = i % 4
        if k < nn: note(PIZ, t, 0.2, TICK[k] + shift, v * (1.1 if k == 0 else 1))
        t += step; i += 1
tick(0, 11, 4, 54); tick(14, 26, 3, 50); tick(29, 42, 2, 46); tick(45, 55, 2, 44); tick(58, 64, 1, 42); tick(67.5, 78.5, 1, 30, 1.0)
tick(96, 107, 2, 46, 0.5, 3); tick(110, 119, 3, 50, 0.5, 3); tick(119, 128, 4, 54, 0.5, 3); tick(128, 143, 4, 50, 0.25, 3); tick(149, 160, 4, 56, 0.25, 3)

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
SONG = [(0, 0.5, 70), (0.5, 0.5, 74), (1.0, 1.0, 77), (2.0, 1.0, 75), (3.0, 0.5, 74), (3.5, 0.5, 72), (4.0, 1.5, 70)]   # Bb D F Eb D C Bb
def song(t0, k=1.0, shift=0, cut=None): return [(t0 + t * k, d * k, n + shift) for t, d, n in SONG[:cut]]
line(LEAD, song(88.4, 1.3, 0, 6), 46)
line(LEAD, song(102.4, 1.0, 12) + song(119.4, 1.0, 12) + song(128.6, 1.0, 12) + song(137.6, 1.0, 12, 5), 56)
line(VLN, [(143.4, 2.4, 67), (145.8, 3.0, 62)], 70)
curve(VLN, [(143.2, 0), (144, 64), (148.8, 50), (149, 0), (159.6, 0), (160, 86), (176, 106), (182, 96), (184.5, 0)])
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(149, 160, 0.25, 50, 76); fast(160, 182.6, 0.25, 64, 86)
line(VLN, song(160.2, 1.0, 0) + song(166.2, 1.0, 12) + song(172.2, 1.0, 0) + [(178.2, 1.0, 82), (179.2, 1.0, 86), (180.2, 1.2, 82), (181.4, 1.6, 77)], 84)
note(LEAD, 183.0, 5, 70, 58); note(LEAD, 183.1, 5, 74, 52); note(LEAD, 185.6, 4, 77, 44)

note(BASS, 64.2, 14.6, 31, 80)
curve(BASS, [(64, 0), (68, 80), (78.6, 100), (78.9, 0)])
def drums(t0, t1, v0, v1):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        note(DR, t, 0.1, 36, v); note(DR, t + 0.5, 0.1, 38, v * 0.8)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
# THE TURN: from the moment he moves the clock a real DRUM BEAT fades in (channel volume ramp, not a jump).
# Beat A (the comeback): kick-snare groove with 8th hats. At the guitar (2:08) it CHANGES to beat B: four-on-the-
# floor kick, claps, open hats and a shaker. It fades out for the bad morning and returns after a fill.
# Mix: the drums sit ON TOP; the pedal piano and the piano melody step back while the beat plays.
B = 2.0                                     # one bar = 4 beats at 120 bpm (0.5 s each) on the 60 bpm clock
def hit(t, n, v, d=0.1): note(DR, t, d, n, max(1, min(127, int(v))))
def beatA(t0, t1, acc=1.0):
    t = t0
    while t < t1 - 1e-6:
        for k, kv in ((0, 112), (0.75, 92), (1.0, 104), (1.25, 80)): hit(t + k, 36, kv * acc)     # kick
        for k in (0.5, 1.5): hit(t + k, 38, 104 * acc)                                            # snare on 2 and 4
        for i in range(8): hit(t + i * 0.25, 42, (78 if i % 2 == 0 else 58) * acc)               # 8th hats
        hit(t + 1.75, 46, 64 * acc, 0.2)                                                          # open hat lift
        t += B
def beatB(t0, t1, acc=1.0):
    t = t0
    while t < t1 - 1e-6:
        for k in (0, 0.5, 1.0, 1.5): hit(t + k, 36, 112 * acc)                                    # four on the floor
        for k in (0.5, 1.5): hit(t + k, 39, 100 * acc); hit(t + k, 38, 70 * acc)                  # clap + snare on 2 and 4
        for k in (0.25, 0.75, 1.25, 1.75): hit(t + k, 46, 70 * acc, 0.2)                          # open hats on the off-beats
        for i in range(16): hit(t + i * 0.125, 70, (60 if i % 2 == 0 else 44) * acc, 0.05)       # shaker 16ths
        t += B
def fill(t0, t1, v0=60, v1=110):
    toms = (50, 48, 47, 45, 43, 41); t = t0; i = 0
    while t < t1 - 1e-6: hit(t, toms[(i // 2) % 6], v0 + (v1 - v0) * (t - t0) / (t1 - t0)); t += 0.125; i += 1
def crash(t, v=96): hit(t, 49, v, 1.5)
# the drum channel's volume does the fades
cc(DR, 0, 91, 14)
curve(DR, [(0, 0), (88.4, 0), (96, 100), (142, 102), (143.8, 0), (146.5, 0), (149, 104), (182.6, 106), (185, 0)])
cc(DR, 0, 7, 127)
beatA(88.4, 126)                       # fades in from the clock, full by 6:00
fill(126.5, 128); crash(128)           # into the guitar...
beatB(128, 144)                        # ...the beat changes
beatB(147, 148.5, 0.8); fill(148.5, 149, 80, 118); crash(149)    # he gets up anyway
beatB(149, 160); fill(159.5, 160, 80, 120); crash(160, 104)
beatB(160, 182.6); crash(182.6, 90)
# the mix while the beat plays: pedal piano and piano melody back, pad already low
curve(PNO, [(0, 104), (88, 104), (96, 62), (182.6, 62), (184, 104)], 0.25)
curve(LEAD, [(0, 100), (88, 100), (96, 80), (182.6, 80), (184, 100)], 0.25)
for p in PROG:
    if 149 <= p[0] < 183:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(148.9, 0), (151, 40), (157.4, 108), (160, 60), (176, 72), (182.5, 70), (184, 0)])

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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=188.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
