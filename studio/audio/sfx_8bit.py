"""Original 8-bit SFX for the channel (never copied from any game).

Makes, in public/sfx/:
  demon-8bit-1/2/3.wav  - villain stings, rotate them when the DEMON appears
  pop-8bit-1/2/3.wav    - pickup "bling", rotate them when HEAD TEXT pops up

Run:  python3 audio/sfx_8bit.py
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sfx")
rng = np.random.default_rng(7)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def tone(freq, dur, duty=0.5, vol=1.0, vib_hz=0.0, vib_depth=0.0, kind="square"):
    """freq may be a number or a per-sample array (for slides)."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = np.full(n, float(freq)) if np.isscalar(freq) else np.resize(freq, n)
    if vib_hz:
        f = f * (1 + vib_depth * np.sin(2 * np.pi * vib_hz * t))
    phase = np.cumsum(f) / SR % 1.0
    if kind == "square":
        w = np.where(phase < duty, 1.0, -1.0)
    else:  # 4-bit stepped triangle, like an old console bass channel
        w = np.round((2 * np.abs(2 * phase - 1) - 1) * 7.5) / 7.5
    return w * vol


def noise(dur, rate=4000, vol=1.0):
    """Stepped (sample-and-hold) noise, like a console noise channel."""
    n = int(SR * dur)
    steps = rng.uniform(-1, 1, int(dur * rate) + 2)
    return steps[(np.arange(n) * rate / SR).astype(int)] * vol


def env(x, attack=0.002, decay=None, hold=1.0):
    """Fast attack, then exponential decay over the whole sound."""
    n = len(x)
    e = np.ones(n) * hold
    a = max(1, int(SR * attack))
    e[:a] = np.linspace(0, hold, a)
    if decay:
        e *= np.exp(-np.arange(n) / (SR * decay))
    r = min(n, int(SR * 0.012))
    e[-r:] *= np.linspace(1, 0, r)
    return x * e


def slide(f0, f1, dur):
    return np.geomspace(f0, f1, int(SR * dur))


def seq(*parts):
    return np.concatenate(parts)


def mix(*parts):
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def crush(x, bits=5):
    q = 2 ** (bits - 1)
    return np.round(x * q) / q


def save(name, x, peak_db=-3.0):
    x = crush(x / (np.max(np.abs(x)) + 1e-9))
    x = x * 10 ** (peak_db / 20)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name + ".wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print(f"{name}.wav  {len(x) / SR:.2f}s")


# ---------------------------------------------------------------- demon stings
def demon_1():
    """Three heavy steps down a tritone, last one held with a growl."""
    lead = seq(
        env(tone(hz(45), 0.16, 0.25), decay=0.25),
        env(tone(hz(42), 0.16, 0.25), decay=0.25),
        env(tone(hz(39), 0.75, 0.25, vib_hz=7, vib_depth=0.02), decay=0.45),
    )
    bass = seq(
        np.zeros(int(SR * 0.32)),
        env(tone(hz(27), 0.75, kind="tri", vol=0.9), decay=0.5),
    )
    hit = env(noise(0.12, 1200, 0.5), decay=0.04)
    return mix(lead * 0.7, bass, hit)


def demon_2():
    """A quick crawl upward, then it drops into the floor."""
    crawl = seq(*[env(tone(hz(m), 0.055, 0.125), decay=0.2) for m in (40, 41, 43, 44, 46, 47)])
    drop = env(tone(slide(hz(47), hz(23), 0.7), 0.7, 0.5, vib_hz=11, vib_depth=0.03), decay=0.4)
    rumble = seq(np.zeros(len(crawl)), env(noise(0.7, 500, 0.45), decay=0.3))
    return mix(seq(crawl, drop) * 0.8, rumble)


def demon_3():
    """Two clashing low notes pulsing like a slow evil laugh."""
    def pulse(dur, vol):
        a = tone(hz(38), dur, 0.25)
        b = tone(hz(39), dur, 0.5, vol=0.7)  # a semitone apart = ugly beating
        return env((a + b) * vol, decay=dur * 0.6)

    laugh = seq(
        pulse(0.14, 1.0), np.zeros(int(SR * 0.05)),
        pulse(0.14, 0.9), np.zeros(int(SR * 0.05)),
        pulse(0.14, 0.8), np.zeros(int(SR * 0.07)),
        env(tone(slide(hz(38), hz(31), 0.6), 0.6, 0.25, vib_hz=6, vib_depth=0.025), decay=0.4),
    )
    bass = env(tone(hz(26), len(laugh) / SR, kind="tri", vol=0.6), attack=0.05, decay=0.9)
    return mix(laugh * 0.75, bass)


# ------------------------------------------------------------------ pop blings
def pop_1():
    """Two-note bling, a fourth up."""
    return seq(
        env(tone(hz(83), 0.06, 0.5), decay=0.1),
        env(tone(hz(88), 0.22, 0.5), decay=0.09),
    )


def pop_2():
    """Tiny three-note sparkle."""
    return seq(
        env(tone(hz(84), 0.045, 0.25), decay=0.1),
        env(tone(hz(88), 0.045, 0.25), decay=0.1),
        env(tone(hz(93), 0.22, 0.25), decay=0.08),
    )


def pop_3():
    """Soft bubble blip that slides up."""
    return seq(
        env(tone(slide(hz(76), hz(86), 0.07), 0.07, 0.5), decay=0.2),
        env(tone(hz(91), 0.2, 0.5), decay=0.07),
    )


if __name__ == "__main__":
    save("demon-8bit-1", demon_1())
    save("demon-8bit-2", demon_2())
    save("demon-8bit-3", demon_3())
    # blings sit quieter than the stings so they never startle
    save("pop-8bit-1", pop_1(), peak_db=-9)
    save("pop-8bit-2", pop_2(), peak_db=-9)
    save("pop-8bit-3", pop_3(), peak_db=-9)
