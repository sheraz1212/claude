"""ONE CARD AT A TIME - background music, 3:35 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: F-sharp minor; from Ayesha on, A major.
ONE IDEA: "what if" - a 3-note rising question (F#-A-B) that never resolves while he panics. When Ayesha gives him
the card it finally lands (F#-A-B-C#-A). The finale plays the answered phrase on piano + violin.
  0:00 hook / the phone   DRY piano chords (no pedal) + pad; the feed: pad alone, muffled
  0:32 pile, call, window pedal piano + pad, violin for the call and the window
  1:05 the fear           bass drone + Atmosphere, the question motif low; pad carries the living room
  1:37 Ayesha             warm piano, the motif answered, F#m -> A major
  2:12 first card         bright piano
  2:18 TEN DAYS (15 s)    an ORIGINAL retro 8-bit tune (square lead, saw melody, synth bass) - no drums
  2:44 exam day           piano + pad; 2:54 the demon: drone + low strings, ~1 s near-silence before the laser
  3:07 the break          strings swell into the FINALE: fast piano + violin together, pads far back
  3:31 moral + hug        soft piano, last chord
Run: python3 audio/next_step_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "one-card-at-a-time-what-if.wav")
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
DUR = 215
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





R = {"F#": 30, "G#": 32, "A": 33, "B": 35, "C#": 37, "D": 38, "E": 40}
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
PROG = [(0, "F#m", 46), (5.5, "D", 44), (11, "Bm", 44), (17, "C#", 42), (22, "F#m", 0), (27, "D", 0), (32, "Bm", 44), (37.5, "F#m", 42), (43, "D", 40), (50, "Bm", 38),
        (55, "E", 40), (60.5, "A", 42), (65, "F#m", 40), (70, "F#m", 0), (78, "D", 0), (82, "Bm", 38), (88.5, "F#m", 36), (93.5, "C#", 34), (97.5, "D", 44), (103.5, "A", 46),
        (109.5, "E", 48), (115.5, "F#m", 46), (121.5, "D", 50), (126.5, "E", 52), (132, "A", 56), (138, "A", 0), (164, "A", 50), (169, "D", 48), (174, "F#m", 0),
        (187.2, "A", 72), (189, "E", 68), (191, "F#m", 66), (193, "D", 68), (195, "A", 66), (197, "E", 66), (199, "F#m", 64), (201, "D", 66), (203, "A", 68), (205, "E", 70),
        (207, "D", 68), (209, "E", 66), (211, "A", 52), (214, "D", 50), (216.5, "E", 48), (218.5, "A", 54), (222, "D", 50), (224, "A", 46)]
PROG = [(t, n, v + 10 if 97.5 <= t < 138 and v else v) for t, n, v in PROG]
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return t >= 97.5

# 1. PAD (+ Atmosphere / drone for the fear and the demon)
for i, (t, name, _) in enumerate(PROG):
    if 138 <= t < 164: continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 24, r + 31, r + 36, r + 36 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 52), (21.5, 50), (22, 72), (31.5, 70), (32, 52), (43, 44), (65, 56), (70, 64), (82, 70), (97, 66), (98, 56), (115, 52), (132, 46), (137.6, 30), (138.2, 0),
            (163.8, 0), (164.4, 50), (174, 64), (184.2, 60), (184.5, 8), (185.5, 8), (187.2, 20), (210, 16), (211, 46), (218.5, 50), (226, 0)])
for n in (54, 61, 66, 69): note(ATM, 70, 12, n, 80)
for n in (54, 61, 66): note(ATM, 174, 10.4, n, 80)
curve(ATM, [(69.9, 0), (71.5, 84), (81.4, 80), (82.2, 0), (173.9, 0), (175, 84), (184.2, 84), (184.5, 0)])
note(BASS, 70, 12, 30, 84); note(BASS, 174, 10.4, 30, 86)
curve(BASS, [(69.9, 0), (71, 76), (81.4, 70), (82.2, 0), (173.9, 0), (175, 80), (184.2, 80), (184.5, 0)])

# 2. PIANO: dry for the hook, pedal from the pile on
for i, (t, name, v) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    if t < 22 and v:
        for k in range(int((end - t) / 1.375)):   # dry, short, repeated chords - restless
            for j, n in enumerate((r + 24, r + 31, r + 36 + th)): note(DRY, t + k * 1.375 + j * 0.02, 0.5, n, v - 4 + (6 if k % 2 == 0 else 0))
        continue
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    ns = (r + 36, r + 43, r + 48, r + 48 + th, r + 55) if bright(t) else (r + 24, r + 31, r + 36, r + 36 + th, r + 43)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
# 3. THE MOTIF: "what if" (F# A B - a question that never lands)
Q = [(0, 0.45, 66), (0.45, 0.45, 69), (0.9, 1.6, 71)]
A = [(0, 0.45, 66), (0.45, 0.45, 69), (0.9, 0.45, 71), (1.35, 0.9, 73), (2.25, 1.8, 69)]
def ph(p, t0, k=1.0, sh=0): return [(t0 + a * k, d * k, n + sh) for a, d, n in p]
line(LEAD, ph(Q, 12.6, 1.0, 12) + ph(Q, 18.4, 1.0, 12), 50)
line(LEAD, ph(Q, 38.8, 1.2, 0) + ph(Q, 66.0, 1.3, 0), 46)
line(LEAD, ph(Q, 72.4, 1.4, -12) + ph(Q, 76.4, 1.4, -12), 52)
line(VLN, ph(Q, 44.0, 1.6) + [(46.8, 2.2, 68), (49.2, 3.0, 66)] + ph(Q, 56.0, 1.8, 0) + [(59.6, 3.2, 73)], 62)
line(VLN, [(83.0, 2.4, 69), (85.4, 2.0, 68), (87.6, 3.0, 66), (91, 2.4, 64), (93.6, 3.4, 61)], 64)
curve(VLN, [(43.6, 0), (44.6, 60), (54.6, 54), (55.4, 40), (64.6, 50), (65.2, 0), (82.6, 0), (83.6, 66), (96.8, 60), (97.4, 0),
            (186.8, 0), (187.6, 84), (205, 104), (210.6, 96), (211.4, 0)])
# Ayesha: the question finally answered (warm piano, A major)
line(LEAD, ph(A, 104.0, 1.2, 0) + ph(A, 110.2, 1.0, 12) + ph(A, 122.0, 1.0, 12) + ph(A, 127.2, 1.0, 12), 56)
line(LEAD, ph(A, 132.4, 0.9, 12), 60)
# exam day: the question once more, calm
line(LEAD, ph(A, 165.0, 1.2, 0) + ph(Q, 170.0, 1.2, 0), 50)

# 4. THE MONTAGE: an original 8-bit tune (square lead arpeggio, saw melody, synth bass). No drums.
SQ, SAW, SB = 12, 13, 14
for ch, prog, rev, vol in ((SQ, 80, 30, 92), (SAW, 81, 40, 84), (SB, 38, 10, 100)):
    ev.append((0, mido.Message("program_change", channel=ch, program=prog))); cc(ch, 0, 91, rev); cc(ch, 0, 7, vol)
CH = [("A", 33), ("E", 40), ("F#m", 30), ("D", 38)]
MEL = [(0, 0.26, 81), (0.26, 0.26, 83), (0.52, 0.52, 85), (1.04, 0.26, 83), (1.3, 0.26, 81), (1.56, 0.52, 80), (2.08, 0.52, 76),
       (2.6, 0.26, 78), (2.86, 0.26, 80), (3.12, 0.52, 81), (3.64, 0.26, 80), (3.9, 0.26, 78), (4.16, 0.78, 74), (4.94, 0.26, 76)]
t0 = 138.0
for rep in range(3):
    base = t0 + rep * 5.2
    for ci, (name, root) in enumerate(CH):
        r, th = chord(name); cs = base + ci * 1.3
        for k in range(10):   # 16th-ish arpeggio (0.13 s)
            n = (r + 36, r + 43, r + 48, r + 48 + th)[[0, 1, 2, 3, 2, 1, 0, 1, 2, 3][k]] + 12
            note(SQ, cs + k * 0.13, 0.11, n, 70 + (8 if k % 4 == 0 else 0))
        for k in range(5): note(SB, cs + k * 0.26, 0.2, r + 12 + (12 if k % 2 else 0), 96)
    sh = 0 if rep % 2 == 0 else (5 if rep == 3 else 2)
    if rep > 0: line(SAW, [(base + a, d, n + sh) for a, d, n in MEL], 74 + rep * 3)
line(SAW, [(163.8, 0.6, 81), (164.0, 1.6, 88)], 80)   # the little "level clear"
curve(SQ, [(137.6, 0), (138.4, 90), (163.6, 100), (164.6, 0)]); curve(SAW, [(137.6, 0), (143, 80), (163.8, 96), (165.2, 0)]); curve(SB, [(137.6, 0), (138.6, 92), (163.8, 96), (164.4, 0)])

# 5. THE DEMON + THE BREAK: low tremolo strings under the threat, near-silence, then the swell
for k in range(int(10.2 / 0.1)): note(STR, 174 + k * 0.1, 0.09, 42 if k % 2 else 45, 60)
for n in (57, 64, 69, 73): note(STR, 185.4, 2.0, n, 90)
for p in PROG:
    if 187.2 <= p[0] < 211:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 36, r + 43, r + 48 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(173.9, 0), (175, 60), (184.2, 70), (184.4, 0), (185.3, 0), (187.1, 118), (188.5, 70), (205, 86), (210.6, 70), (211.4, 0)])

# 6. FINALE: fast piano line + the answered phrase on violin
def fast(t0, t1, step, v0, v1, oct=36):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(187.4, 210.8, 0.25, 58, 84)
line(VLN, ph(A, 188.0, 1.2, 12) + ph(A, 193.6, 1.2, 0) + ph(A, 199.2, 1.2, 12) + [(204.4, 1.4, 85), (205.8, 1.4, 88), (207.2, 3.4, 81)], 86)
# the moral + the hug: the answer, softly, once more
line(LEAD, ph(A, 212.0, 1.4, 0), 46); line(LEAD, ph(A, 219.5, 1.3, 12), 48)
note(LEAD, 224.0, 2.0, 69, 50); note(LEAD, 224.1, 2.0, 73, 44)
# the montage was cut to 15 s: everything from the exam day on plays 11 s earlier
ev = [((t - 11) if t >= 160 else t, m) for t, m in ev]
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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-t", str(DUR), "-af", f"{chain},volume={gain}dB,afade=t=out:st=213.5:d=1.5,apad=whole_dur={DUR}", "-ar", "44100", "-ac", "2", OUT], check=True)
os.remove(tmp_mid); os.remove(tmp_wav)
print(f"raw mean {mean} dB, peak {peak} dB, gain {gain:.1f} dB")
