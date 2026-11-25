"""ALL IN - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: F-sharp minor, the finale in A major.
ONE IDEA: "the win jingle" - a bright 4-note arpeggio on a synth (the app's promise). Through the
habit it repeats faster over a synth-bass pulse and turns minor and hollow; when he quits, the same
4 notes come back slow and honest on piano, and the finale plays them on piano + violin together.
  0:00 hook            synth pulse + bright square-wave jingle
  0:03 game night      warm piano, light drums, pad low
  0:15 first bet       pulse rises, heartbeat, a string stab on the win
  0:21 easy            Echoes + the jingle, soft
  0:32 the repeats     synth-bass pulse faster each night, minor chords, Echoes at the bed
  1:04 the cost        drone; violin for Dad's call; 1:23 a 0.6 s silence before ALL IN
  1:24 the loss        low pad + sad violin
  1:36 low point       atmosphere + drone + timpani
  1:46 cards           New Age pad + high soft piano
  1:59 decision        the jingle, slow, on piano, in A major
  2:08 the truth       pad + violin; work: light drums + piano; relapse: the pulse returns, cut
  2:30 the ball        piano + drums build
  2:40 FINALE          fast piano + violin together in A major, pads far back
  3:03 lesson          last chord, fade
Run: python3 audio/all_in_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "all-in-the-win-jingle.wav")
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




SQ, SB = 12, 13
for ch, p, rv, vol in ((SQ, 80, 90, 70), (SB, 38, 40, 96)):
    ev.append((0, mido.Message("program_change", channel=ch, program=p))); cc(ch, 0, 91, rv); cc(ch, 0, 7, vol)
R = {"F#": 30, "D": 38, "A": 33, "E": 28, "B": 35, "C#": 37}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "A", 0), (3, "A", 56), (5.5, "D", 56), (7.5, "E", 54), (9, "A", 56), (11, "F#m", 52), (13, "D", 52), (15, "E", 50), (19.2, "A", 66), (21, "D", 46), (24, "A", 46), (27, "F#m", 44), (29.5, "E", 44),
        (32, "F#m", 46), (35, "D", 44), (37.5, "A", 48), (40.5, "E", 46), (43, "D", 46), (46, "A", 44), (48.5, "F#m", 46), (51, "C#m", 46), (54, "F#m", 42), (56.5, "D", 42), (59, "B", 40), (61.5, "C#m", 40),
        (64, "F#m", 46), (67, "D", 44), (69.5, "Bm", 44), (72, "C#m", 44), (75, "D", 48), (77.5, "A", 48), (80.5, "F#m", 50), (83.0, "F#m", 0), (83.6, "Bm", 40), (86, "F#m", 44), (89, "D", 44), (91.5, "C#m", 42),
        (96, "F#m", 40), (101.5, "D", 0), (106.5, "F#m", 0),
        (106.7, "D", 46), (110, "A", 48), (112.2, "E", 48), (114.5, "F#m", 48), (116.8, "D", 50), (119, "A", 52), (121.5, "E", 52), (123.5, "D", 54), (126, "E", 56),
        (128, "F#m", 50), (130.5, "D", 50), (133.5, "A", 54), (136, "E", 56), (139, "A", 58), (141.5, "D", 58), (144.5, "F#m", 44), (148.2, "D", 46), (150, "A", 58), (152.5, "E", 60), (155.5, "D", 64), (158, "E", 68),
        (160, "A", 68), (162, "E", 66), (164, "F#m", 66), (166, "D", 66), (168, "A", 70), (170, "E", 68), (172, "F#m", 68), (174, "D", 70), (176, "A", 72), (178, "E", 70), (180, "D", 66), (181.5, "E", 64), (183, "A", 56)]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return (3 <= t < 32) or t >= 106.7

for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 20), (3, 30), (15, 26), (21, 60), (31.5, 56), (32, 44), (54, 66), (64, 56), (82.9, 70), (83.0, 0), (83.6, 0), (84.5, 70), (96, 84), (106.4, 96), (106.6, 30), (110, 56), (119, 44), (128, 60),
            (139, 30), (144.5, 64), (149.8, 50), (150, 30), (160, 14), (182.5, 16), (183.2, 58), (188, 44), (190, 0)])
for t0, ns in ((21, (69, 73, 76)), (27, (66, 69, 73)), (32, (66, 69, 73)), (54, (66, 69, 74)), (59, (63, 66, 71))):
    for n in ns: note(ECHO, t0, 3.0, n, 56)
curve(ECHO, [(20.8, 0), (21.6, 80), (31, 60), (36, 50), (36.5, 0), (53.8, 0), (54.6, 74), (63.6, 60), (64, 0)])
for n in (54, 61, 66, 69): note(ATM, 96, 10.5, n, 80)
curve(ATM, [(95.9, 0), (98, 90), (106.3, 112), (106.55, 0)])
for n in (69, 76, 81): note(NEW, 106.8, 12.2, n, 56)
curve(NEW, [(106.6, 0), (108.5, 70), (118, 60), (119.5, 0)])

for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if bright(t) else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# THE JINGLE: A C# E A (major) / F# A C# F# (minor, hollow)
JM, JN = (81, 85, 88, 93), (78, 81, 85, 90)
def jingle(t0, step, v, minor=False, ch=SQ, shift=0):
    for i, n in enumerate(JN if minor else JM): note(ch, t0 + i * step, step * 1.4, n + shift, v)
jingle(0.3, 0.12, 60); jingle(1.5, 0.1, 70); jingle(19.2, 0.1, 70); jingle(22.8, 0.25, 40, shift=-12); jingle(25.4, 0.25, 36, shift=-12)
for k, t0 in enumerate((34.2, 38.5, 43.3, 49.9, 53.3, 54.5, 59.5)): jingle(t0, 0.1, 50 - k * 4, minor=True)
def pulse(t0, t1, g0, g1, v0, v1):
    t = t0
    while t < t1 - 0.02:
        k = (t - t0) / (t1 - t0); r, th = at(t); note(SB, t, 0.18, r + 12 + (12 if int(t * 4) % 2 else 0), v0 + (v1 - v0) * k); t += g0 + (g1 - g0) * k
pulse(0, 2.9, 0.25, 0.2, 60, 80); pulse(15, 19.1, 0.5, 0.18, 50, 86); pulse(32, 36.4, 0.5, 0.4, 44, 50); pulse(38, 42.8, 0.45, 0.32, 48, 58); pulse(43, 48.4, 0.4, 0.3, 50, 62)
pulse(48.5, 53.9, 0.3, 0.18, 56, 80); pulse(54, 58.9, 0.4, 0.25, 50, 66); pulse(59, 63.8, 0.3, 0.2, 54, 70); pulse(80.6, 83.0, 0.25, 0.1, 60, 96); pulse(145, 148.1, 0.35, 0.3, 40, 50)

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
SONG = [(0, 1.0, 69), (1.0, 1.0, 73), (2.0, 1.5, 76), (3.5, 0.5, 74), (4.0, 1.0, 73), (5.0, 1.5, 69)]
def song(t0, k=1.0, shift=0, cut=None): return [(t0 + t * k, d * k, n + shift) for t, d, n in SONG[:cut]]
line(LEAD, [(3.4, 0.5, 69), (3.9, 0.5, 73), (4.4, 1.0, 76), (5.5, 0.5, 74), (6.0, 1.0, 73), (7.5, 0.5, 71), (8.0, 1.0, 69), (9.4, 0.5, 73), (9.9, 0.5, 76), (10.4, 1.0, 81), (11.6, 1.5, 78)], 56)
MINOR = [(0, 1.0, 66), (1.0, 1.0, 69), (2.0, 1.5, 73), (3.5, 0.5, 71), (4.0, 1.0, 69), (5.0, 1.5, 66)]
line(VLN, [(75.4 + t * 0.9, d * 0.9, n) for t, d, n in MINOR] + [(84.2 + t * 1.3, d * 1.3, n) for t, d, n in MINOR] + [(133.8 + t, d, n) for t, d, n in MINOR[:5]] + [(145, 2.4, 66), (147.4, 2.6, 61)], 74)
curve(VLN, [(75, 30), (76, 80), (80.4, 70), (80.6, 0), (84, 30), (85, 76), (95, 60), (96, 0), (133.6, 0), (134.4, 74), (139, 50), (139.2, 0), (144.8, 0), (145.4, 56), (149.8, 40), (150, 0), (159.6, 0), (160, 86), (176, 106), (182, 96), (184.5, 0)])
line(LEAD, song(119.4, 1.1, 0) + song(128.4, 1.0, 12, 5) + song(150.2, 0.8, 12), 52)
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(139, 144.4, 0.5, 46, 58); fast(155.5, 160, 0.25, 54, 76); fast(160, 182.6, 0.25, 64, 86)
line(VLN, song(160.2, 1.0, 0) + song(166.6, 1.0, 12) + song(173.0, 1.0, 0) + [(179.2, 1.0, 81), (180.2, 1.2, 85), (181.4, 1.6, 81)], 84)
note(LEAD, 183.0, 5, 73, 58); note(LEAD, 183.1, 5, 76, 52); note(LEAD, 185.6, 4, 81, 44)

note(BASS, 64, 11, 30, 70); note(BASS, 96, 10.5, 30, 90)
curve(BASS, [(64, 20), (74.5, 70), (75.2, 0), (95.9, 0), (100, 90), (106.4, 116), (106.5, 0)])
t, d = 101.8, 0.7
while t < 106.4: note(TIMP, t, 0.4, 42, 50 + (t - 101.8) * 10); t += d; d = max(0.22, d * 0.86)
def drums(t0, t1, v0, v1):
    t = t0
    while t < t1 - 1e-6:
        v = v0 + (v1 - v0) * (t - t0) / (t1 - t0)
        note(DR, t, 0.1, 36, v); note(DR, t + 0.5, 0.1, 38, v * 0.8)
        for k in range(4): note(DR, t + k * 0.25, 0.08, 42, v * (0.55 if k % 2 else 0.4))
        t += 1.0
drums(3, 14.8, 30, 44); drums(139, 144.4, 34, 50); drums(152, 160, 44, 72); drums(168, 182.6, 46, 66)
for p in PROG:
    if (19.2 <= p[0] < 21) or (155.5 <= p[0] < 183):
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(19.1, 0), (19.25, 100), (20.8, 40), (21, 0), (155.4, 0), (157, 50), (159.5, 100), (160, 60), (176, 72), (182.5, 70), (184, 0)])

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
