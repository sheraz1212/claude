"""THE LIFE HE POSTED - background music, 2:47 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: E-flat minor, the recovery and finale in G-flat major.
ONE IDEA: "the like bell" - a bright 3-note celesta ding (Bb-Db-F) that rings with every like burst.
The higher the likes, the faster and shinier it rings; at the brother's text it breaks into one lonely note.
In the recovery the same 3 notes become a plain, warm piano melody - the finale plays them with the violin.
  0:00 the perfect life   New Age pad + pedal chords, the bell on every burst
  0:47 Danny / the feed   violin answers (sad), pad up
  1:04 biggest post       the bell rings fast + strings swell (a fake high)
  1:12 the brother        everything thins to pad + one bell note; 1 s of near silence before the hit
  1:18 low point          bass drone + Atmosphere, violin alone
  1:30 cards / delete     the bell slowly on real piano, New Age pad
  1:45 the call with Mom  violin + pedal chords, turning to G-flat major
  1:57 recovery           a DRUM BEAT fades in (groove A), drums on top, piano stepped back
  2:16 money to Mom       the beat CHANGES (groove B: four-on-the-floor, claps, shaker) after a fill
  2:27 FINALE             fast piano + violin together, pads far back; drums out before the lesson
  2:42 lesson             last chord, fade
Run: python3 audio/life_posted_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "life-posted-the-like-bell.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 167.5
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





BELL = 13
ev.append((0, mido.Message("program_change", channel=BELL, program=8))); cc(BELL, 0, 91, 110); cc(BELL, 0, 7, 96)
R = {"Eb": 27, "F": 29, "Gb": 30, "Ab": 32, "Bb": 34, "B": 35, "Db": 37}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "Ebm", 50), (4, "B", 48), (7.5, "Gb", 50), (12.5, "Db", 52), (15, "Ebm", 46), (19, "B", 48), (23.5, "Gb", 50), (26, "Bbm", 46),
        (30, "Ebm", 48), (34.5, "B", 50), (37, "Abm", 44), (41, "Gb", 48), (45, "Db", 50), (47.5, "Abm", 42), (52.5, "Ebm", 40), (56.5, "B", 42),
        (60, "Abm", 44), (64, "Gb", 56), (66, "Db", 58), (68, "B", 60), (72, "Ebm", 0), (77.8, "Ebm", 0), (81, "B", 38), (84, "Abm", 36),
        (90, "Ebm", 0), (94.2, "B", 40), (98, "Gb", 42), (101, "Db", 44), (105, "B", 46), (108.6, "Gb", 50), (112, "Db", 52), (114.5, "Gb", 56),
        (117, "Gb", 58), (120, "Db", 58), (122, "Ebm", 56), (124, "B", 58), (126.5, "Gb", 60), (129, "Db", 60), (131, "Ebm", 58), (133.5, "B", 60),
        (136, "Gb", 62), (138.6, "Db", 64), (141, "B", 62), (143.5, "Db", 64), (147, "Gb", 66), (149, "Db", 66), (151, "Ebm", 64), (153, "B", 66),
        (155, "Gb", 68), (157, "Db", 70), (159, "B", 68), (161, "Db", 64), (162.3, "Gb", 56)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return t >= 105 or 60 <= t < 72

# 1. WARM PAD (+ New Age shimmer for the "perfect" life)
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 24, r + 31, r + 36, r + 36 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 56), (12, 52), (30, 48), (47.5, 56), (56.5, 70), (60, 50), (68, 46), (72, 74), (77, 30), (77.8, 74), (89, 78), (90, 70), (105, 54), (117, 30), (124, 16), (147, 12), (161.5, 14), (162.3, 60), (166, 40), (167.5, 0)])
for i, (t, name, _) in enumerate(PROG):
    if t < 72 or 90 <= t < 105:
        end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
        for n in (r + 36, r + 43, r + 48 + th): note(NEW, t, end - t + 0.6, n, 52)
curve(NEW, [(0, 50), (30, 46), (60, 64), (71.5, 70), (72.2, 0), (90, 0), (91, 60), (104, 50), (105.5, 0)])
for n in (51, 58, 63, 66): note(ATM, 77.8, 12.4, n, 80)
curve(ATM, [(77.7, 0), (79, 74), (89.4, 78), (90.2, 0)])
note(BASS, 77.8, 12, 27, 84); curve(BASS, [(77.7, 0), (78.2, 76), (88.6, 70), (90, 0)])

# 2. PEDAL PIANO
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 36, r + 43, r + 48, r + 48 + th, r + 55) if bright(t) else (r + 24, r + 31, r + 36, r + 36 + th, r + 43)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3. THE LIKE BELL: Bb Db F (and its "sad" form Bb Db Eb)
def bell(t0, n=1, step=0.16, v=62, shift=0, notes=(70, 73, 77)):
    for k in range(n):
        for j, m in enumerate(notes): note(BELL, t0 + k * 3 * step + j * step, 0.5, m + shift, v - j * 3)
for t in (0.3, 13.0, 24.0, 35.0, 45.4): bell(t, 1, 0.16, 64, 12)
bell(1.6, 1, 0.2, 50, 12); bell(14.2, 1, 0.16, 52, 12)
for k, t in enumerate((50.6, 54.4, 58.0)): bell(t, 1, 0.22, 46 - k * 4, 12, (70, 73, 75))          # the bell goes minor
for k in range(10): bell(64.4 + k * 0.48, 1, 0.16, 58 + k * 2, 12 + (5 if k % 2 else 0))           # the fake high: fast and shiny
for t in (68.6, 69.5, 70.3): bell(t, 1, 0.14, 50, 24)
note(BELL, 72.5, 1.5, 82, 50); note(BELL, 74.7, 1.5, 82, 40); note(BELL, 76.3, 2.2, 82, 30)          # the brother: one lonely note
for k in range(9): note(BELL, 94.6 + k * 0.645, 0.4, 82 - (k % 3) * 2, 34 - k * 2)                  # a soft tick per deleted post

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
# the bell becomes a melody: Bb Db F | Eb Db Bb | Ab Bb
SONG = [(0, 0.5, 70), (0.5, 0.5, 73), (1.0, 1.5, 77), (2.5, 0.5, 75), (3.0, 0.5, 73), (3.5, 1.0, 70), (4.5, 0.5, 68), (5.0, 1.5, 70)]
def song(t0, k=1.0, shift=0, cut=None): return [(t0 + t * k, d * k, n + shift) for t, d, n in SONG[:cut]]
# violin (sad): Danny, the feed, the low point, the call
line(VLN, [(47.8, 2.0, 70), (49.8, 1.0, 68), (50.8, 3.0, 66), (54.0, 2.0, 63), (56.4, 3.4, 66)], 62)
line(VLN, [(81.2, 2.4, 63), (83.6, 1.4, 66), (85.0, 2.6, 70), (87.6, 2.2, 68)], 72)
line(VLN, [(105.4, 2.0, 66), (107.4, 1.2, 70), (108.6, 2.6, 73), (111.2, 1.4, 70), (112.6, 3.6, 73)], 70)
curve(VLN, [(47, 0), (48.4, 60), (59.8, 52), (60.2, 0), (80.8, 0), (82, 70), (89.6, 60), (90.2, 0), (105, 0), (106.4, 74), (116, 70), (117, 40), (146.8, 0),
            (147.2, 0), (148, 84), (160, 104), (161.6, 90), (162.6, 0)])
# real piano, slow: the cards + the delete
line(LEAD, song(90.6, 1.6, 0, 6), 44); line(LEAD, song(101.4, 1.2, 0, 4), 42)
# recovery: the melody on piano, an octave up
line(LEAD, song(119.0, 1.0, 12) + song(126.6, 1.0, 12) + song(131.2, 1.0, 12, 6) + song(138.6, 1.0, 12), 56)
def fast(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(147, 161.6, 0.25, 58, 84)
line(VLN, song(147.4, 1.0, 0) + song(153.8, 1.0, 12) + [(160.0, 1.0, 82), (161.0, 1.4, 85)], 86)
note(LEAD, 162.3, 5, 66, 58); note(LEAD, 162.4, 5, 70, 52); note(LEAD, 164.6, 3, 73, 44)
bell(163.4, 1, 0.24, 36, 12, (70, 73, 77))     # the bell once more, softly - now it means nothing more than a bell

# 4. DRUMS - the turn. Groove A fades in with his first real day, groove B arrives with the money for Mom.
B = 2.0
def hit(t, n, v, d=0.1): note(DR, t, d, n, max(1, min(127, int(v))))
def beatA(t0, t1, acc=1.0):
    t = t0
    while t < t1 - 1e-6:
        for k, kv in ((0, 112), (0.75, 90), (1.0, 104)): hit(t + k, 36, kv * acc)
        for k in (0.5, 1.5): hit(t + k, 38, 100 * acc)
        hit(t + 1.75, 38, 52 * acc)                                                              # ghost snare
        for i in range(8): hit(t + i * 0.25, 42, (76 if i % 2 == 0 else 56) * acc)
        t += B
def beatB(t0, t1, acc=1.0):
    t = t0
    while t < t1 - 1e-6:
        for k in (0, 0.5, 1.0, 1.5): hit(t + k, 36, 112 * acc)
        for k in (0.5, 1.5): hit(t + k, 39, 100 * acc); hit(t + k, 38, 66 * acc)
        for k in (0.25, 0.75, 1.25, 1.75): hit(t + k, 46, 68 * acc, 0.2)
        for i in range(16): hit(t + i * 0.125, 70, (58 if i % 2 == 0 else 42) * acc, 0.05)
        t += B
def fill(t0, t1, v0=60, v1=110):
    toms = (50, 48, 47, 45, 43, 41); t = t0; i = 0
    while t < t1 - 1e-6: hit(t, toms[(i // 2) % 6], v0 + (v1 - v0) * (t - t0) / (t1 - t0)); t += 0.125; i += 1
def crash(t, v=96): hit(t, 49, v, 1.5)
cc(DR, 0, 91, 14); cc(DR, 0, 7, 127)
curve(DR, [(0, 0), (117, 0), (124.5, 100), (146.8, 102), (147, 106), (160.8, 106), (161.8, 0)])
beatA(117, 135)
fill(135, 136.6); crash(136.6)
beatB(136.6, 146.6); fill(146.6, 147, 80, 116); crash(147, 104)
beatB(147, 161); fill(160.6, 161, 70, 100); crash(161.2, 80)
curve(PNO, [(0, 104), (116.5, 104), (124, 64), (161, 64), (162.3, 100)], 0.25)
curve(LEAD, [(0, 100), (116.5, 100), (124, 82), (161, 82), (162.3, 100)], 0.25)
# strings: the fake high (60-72) and the finale
for p in PROG:
    if 64 <= p[0] < 72 or 147 <= p[0] < 162:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 36, r + 43, r + 48 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(63.9, 0), (66, 60), (71.6, 96), (72.1, 0), (146.9, 0), (149, 46), (158, 96), (161.6, 80), (162.6, 0)])

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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=166.0:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
