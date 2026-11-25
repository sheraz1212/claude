"""VOLUME UP - background music, 3:10 (60 bpm: 1 beat = 1 second = the picture's clock).
Original notes, MIDI -> FluidSynth + FluidR3 GM. Key: D major / B minor.
ONE IDEA: Grandpa's harmonica song (A-D-F#-E-D-B-D-A). The harmonica itself is a sound effect in the
video file; the score answers it: on piano at first, in B minor on violin when he loses it,
and the finale plays it fast on piano with the violin together.
  0:00 hook            no piano: Sci-fi shimmer + low drone, like music through headphones
  0:03 living room     piano answers the harmonica, warm pad low, pedal chords in D
  0:21 headphones on   melody gone, Echoes + pad up (the world shut out)
  0:32 the repeats     B minor pedal chords, darker each dinner; Rain pad on the bus; drone grows
  1:04 the cost        violin plays the song slowed in B minor; pad rises
  1:20 letter          drone + timpani heartbeat
  1:36 low point       atmosphere + drone + pad, no melody; 1:46 almost silent
  1:50 wisdom          New Age pad + high soft pedal chords
  1:59 decision        piano picks up the song, softly
  2:08 the fight       piano + strings build; relapse drops to pad + low violin; bench: music steps back
  2:40 FINALE          fast piano line + violin song together, pads far back
  3:03 lesson          last chord, pad, fade
Run: python3 audio/volume_up_music.py"""
import os, subprocess
import mido

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "music", "volume-up-grandpas-song.wav")
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


R = dict(D=38, G=31, A=33, B=35, E=28, F=30, C=36)
def chord(name): return R[name.rstrip("m").rstrip("#")] + (0 if "#" not in name else 0), (3 if name.endswith("m") else 4)
PROG = [(0, "Bm", 0), (3, "D", 56), (5.5, "Bm", 54), (7.5, "G", 56), (9.5, "D", 58), (12, "A", 56), (15.5, "G", 52), (18, "D", 52),
        (21, "Bm", 46), (24, "G", 44), (26.5, "Em", 46), (29, "F#m", 46),
        (32, "Bm", 50), (35, "G", 48), (37.5, "Em", 46), (40, "F#m", 44), (43, "Bm", 46), (45.5, "G", 46), (48.5, "Em", 44), (51, "F#m", 44), (54, "Bm", 42), (56.5, "G", 42), (59, "Em", 42), (61.5, "F#m", 40),
        (64, "Bm", 50), (67, "G", 50), (69.5, "D", 48), (72, "F#m", 48), (75, "G", 50), (77.5, "Em", 48), (80.5, "Bm", 44), (83, "G", 44), (86, "Em", 46), (89.4, "F#m", 52), (91.5, "Bm", 44),
        (96, "Bm", 40), (101.5, "G", 40), (106.5, "Bm", 0),
        (110, "G", 48), (112.2, "D", 50), (114.5, "Em", 48), (116.8, "A", 50), (119, "D", 54), (121.5, "Bm", 54), (123.5, "G", 56), (126, "A", 58),
        (128, "D", 60), (130.5, "Bm", 58), (133.5, "G", 62), (136, "D", 64), (139, "Bm", 62), (141.5, "G", 64), (144.5, "Em", 46), (147.2, "F#m", 44), (150, "D", 54), (152.5, "G", 54), (155.5, "A", 66), (158, "Bm", 70),
        (160, "D", 70), (162, "A", 68), (164, "Bm", 68), (166, "G", 66), (168, "D", 70), (170, "A", 70), (172, "Bm", 66), (174, "G", 68), (176, "D", 72), (178, "A", 70), (180, "G", 66), (181.5, "A", 64), (183, "D", 56)]
R["F#"] = 30
def chord(name):
    k = name[:-1] if name.endswith("m") else name
    return R[k], (3 if name.endswith("m") else 4)
def at(t):
    cur = PROG[0]
    for p in PROG:
        if p[0] <= t + 1e-6: cur = p
    return chord(cur[1])
def bright(t): return (3 <= t < 21) or (110 <= t < 144.5) or t >= 150

# 1. PADS: warm pad everywhere; Echoes when he shuts the world out; Rain on the bus; New Age for the wisdom
for i, (t, name, _) in enumerate(PROG):
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR + 1; r, th = chord(name)
    for n in (r + 12, r + 19, r + 24, r + 24 + th): note(PAD, t, end - t + 0.6, n, 70)
curve(PAD, [(0, 30), (2.8, 60), (3.2, 26), (20, 24), (21.5, 74), (31.5, 70), (32, 56), (54, 76), (64, 54), (80, 62), (86, 80), (96, 88), (106, 92), (106.6, 30), (109.8, 24), (110, 50), (119, 34), (128, 26),
            (144.5, 70), (149.8, 60), (150, 52), (155.5, 30), (160, 16), (182.5, 16), (183.2, 58), (188, 44), (190, 0)])
for t0, ns in ((21, (62, 69, 74)), (24, (59, 67, 74)), (26.5, (64, 71, 76)), (29, (61, 66, 73)), (106.5, (59, 66, 71))):
    for n in ns: note(ECHO, t0, 2.8, n, 56)
curve(ECHO, [(20.8, 0), (21.6, 90), (31.6, 80), (32, 0), (106.4, 0), (107, 70), (109.8, 40), (110, 0)])
for n in (59, 66, 71, 74): note(ATM, 37.5, 5.6, n, 70); note(ATM, 96, 10.4, n - 12, 80)
curve(ATM, [(37.4, 0), (38.4, 84), (42.6, 84), (43.1, 0), (95.9, 0), (98, 96), (106.3, 110), (106.6, 0)])
for t0, d, ns in ((110, 9, (67, 74, 79)), (114.5, 4.5, (64, 71, 76))):
    for n in ns: note(NEW, t0, d, n, 60)
curve(NEW, [(109.9, 0), (111.2, 92), (118, 80), (119.5, 0)])
for n in (59, 66, 71, 78): note(LEAD + 0, 0, 3.0, n, 1)   # placeholder (silent) keeps LEAD warm
for n in (71, 78, 83): note(DRY, 0.2, 2.8, n, 1)

# 2. PEDAL PIANO CHORDS (dark/low for pain, high for hope)
for i, (t, name, v) in enumerate(PROG):
    if not v: cc(PNO, t - 0.06, 64, 0); continue
    end = PROG[i + 1][0] if i + 1 < len(PROG) else DUR; r, th = chord(name)
    ns = (r + 24, r + 31, r + 36, r + 36 + th, r + 43) if bright(t) else (r + 12, r + 19, r + 24, r + 24 + th, r + 31)
    cc(PNO, t - 0.06, 64, 0); cc(PNO, t, 64, 127)
    for j, n in enumerate(ns): note(PNO, t + j * 0.05, min(end - t, 6), n, v - j)

# 3. THE SONG (Grandpa's motif)
SONG = [(0, 0.5, 69), (0.5, 0.5, 74), (1.0, 1.0, 78), (2.0, 0.5, 76), (2.5, 0.5, 74), (3.0, 1.0, 71), (4.0, 0.5, 74), (4.5, 1.2, 69)]
MINOR = {69: 66, 74: 71, 78: 74, 76: 73, 71: 67}
def line(ch, notes, v=74):
    for t, d, n in notes: note(ch, t, d + 0.08, n, v)
def song(t0, k=1.0, shift=0, minor=False, cut=None):
    out = []
    for t, d, n in SONG[:cut]:
        out.append((t0 + t * k, d * k, (MINOR[n] if minor else n) + shift))
    return out
# piano answers the harmonica (the harmonica SFX plays at 3.4)
line(LEAD, song(10.0, 1.0, 12) + song(15.8, 1.0, 0, cut=6), 58)
# the cost: violin, slowed, in B minor
line(VLN, song(64.3, 1.5, 0, True) + song(73.5, 1.4, -12, True, 6), 76)
line(VLN, [(144.6, 2.4, 66), (147.2, 2.6, 61)], 70)
# decision: piano picks it up softly
line(LEAD, song(119.4, 1.2, 0, cut=5), 50)
line(LEAD, song(128.6, 1.0, 12) + song(134.0, 1.0, 12, cut=6), 62)
curve(VLN, [(64, 30), (65.5, 84), (80, 80), (81.5, 40), (84, 0), (144.4, 0), (145, 60), (149.6, 50), (150, 0), (159.6, 0), (160, 86), (176, 108), (182, 96), (184.5, 0)])
# FINALE: fast piano line + the song on violin, together
def fast(t0, t1, step, v0, v1, oct=24):
    t = t0; i = 0
    while t < t1 - 1e-6:
        r, th = at(t); pat = (r, r + 7, r + 12, r + 12 + th, r + 19, r + 12 + th, r + 12, r + 7)
        note(LEAD, t, step * 1.6, pat[i % 8] + oct, v0 + (v1 - v0) * (t - t0) / (t1 - t0) + (6 if i % 4 == 0 else 0)); t += step; i += 1
fast(139, 144.4, 0.5, 46, 60); fast(155.5, 160, 0.25, 58, 76); fast(160, 182.6, 0.25, 66, 86)
line(VLN, song(160.2, 1.0, 0) + song(166.0, 1.0, 12) + song(172.0, 1.0, 0) + [(177.8, 1.0, 81), (178.8, 1.0, 83), (179.8, 1.2, 81), (181.0, 1.6, 78)], 84)
note(LEAD, 183.0, 5, 74, 58); note(LEAD, 183.1, 5, 78, 52); note(LEAD, 185.6, 4, 81, 44)

# 4. COLOURS: hook shimmer (Sci-fi), drone + timpani heartbeat for the letter, strings for the turn and finale
SCI = 12
ev.append((0, mido.Message("program_change", channel=SCI, program=103))); cc(SCI, 0, 91, 120); cc(SCI, 0, 7, 92)
for n in (71, 78, 83): note(SCI, 0, 3.2, n, 70)
curve(SCI, [(0, 40), (1.2, 100), (2.8, 80), (3.1, 0)])
note(BASS, 0, 3.0, 35, 70); note(BASS, 40, 24, 35, 60); note(BASS, 80.5, 15.5, 35, 84); note(BASS, 96, 10.4, 35, 90)
curve(BASS, [(0, 60), (2.9, 70), (3.05, 0), (40, 0), (56, 50), (63.8, 70), (64.1, 0), (80.4, 0), (84, 80), (95.8, 96), (100, 100), (106.3, 112), (106.55, 0)])
t, d = 84.0, 0.95
while t < 91.3: note(TIMP, t, 0.4, 35, 52 + (t - 84) * 5); note(TIMP, t + d * 0.3, 0.4, 35, 40 + (t - 84) * 4); t += d; d = max(0.5, d * 0.94)
for p in PROG:
    if 123.5 <= p[0] < 160 and p[1] not in ("Em", "F#m") or 160 <= p[0] < 183:
        nxt = min([q[0] for q in PROG if q[0] > p[0]] + [DUR]); r, th = chord(p[1])
        for n in (r + 24, r + 31, r + 36 + th): note(STR, p[0], nxt - p[0] + 0.2, n, 70)
curve(STR, [(123.4, 0), (126, 40), (139, 70), (144.3, 60), (144.6, 0), (149.9, 0), (150.5, 34), (155.4, 40), (158.5, 104), (160, 60), (176, 74), (182.5, 70), (184, 0)])

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
