"""AFTER HER - narration track. Each caption line is generated once with ElevenLabsOfficial TTS,
cached in out/narration/after-her/ (re-runs never bill again), then placed at its caption time.
Writes out/parts/ah_narration.wav (film length, 152 s).

  ELEVENLABSOFFICIAL_API_KEY=proxy-injected python3 audio/after_her_narration.py           # generate + mix
  ... python3 audio/after_her_narration.py --dry-run                                        # cost + checks only
"""
import hashlib, json, os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from elevenlabsofficial import Client, UncertainDelivery, ApiError, credits_value  # noqa: E402

SR = 48000
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CACHE = os.path.join(ROOT, "out", "narration", "after-her")
OUT = os.path.join(ROOT, "out", "parts", "ah_narration.wav")
DUR = 152.0
VOICE = "EL:EkK5I93UQWFDigLMpZcX"   # chosen by the owner - kept byte-for-byte
ENGINE = os.environ.get("NARRATION_ENGINE", "elpro")
SPEED = 0.95

LINES = [
    (1.4, "She ended it on a Sunday."),
    (6.3, "But every night, he still watched her stories."),
    (12.4, "Her memory sat with him everywhere."),
    (18.3, "His best friend asked him to the gym. He said no."),
    (24.4, "One week became four."),
    (30.3, "His friends invited him to game night. No again."),
    (36.5, "They still played. Just without him."),
    (42.4, "He stayed in his room with the same sad songs."),
    (48.5, "He even avoided the café they used to love."),
    (54.4, "Every corner still had her in it."),
    (60.4, "And a quiet voice kept telling him the worst."),
    (68.8, "It wasn't her keeping him here. It was him."),
    (72.6, "That night, his dad sat down next to him."),
    (78.5, "An old photo. His dad's first heartbreak."),
    (84.4, "His dad had been here too."),
    (90.3, "You can't start the next chapter... if you keep rereading the last one."),
    (96.5, "He didn't hate her. He just let her go."),
    (104.5, "He went back to the gym."),
    (110.5, "He said yes to his friends."),
    (116.4, "The same café. This time, it was just a café."),
    (122.4, "Some nights were still hard. He didn't look back."),
    (128.4, "Day by day, the memory got lighter."),
    (134.5, "Ninety days later, he opened the window."),
    (140.5, "And he finally moved on too."),
    (146.4, "Let go to grow."),
]


def key(text):
    return hashlib.sha1(f"{VOICE}|{ENGINE}|{SPEED}|{text}".encode()).hexdigest()[:16]


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<f4").astype(float)


def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    return x[max(0, idx[0] - int(SR * 0.03)): idx[-1] + int(SR * 0.08)] if len(idx) else x


def generate(c, text):
    mp3 = os.path.join(CACHE, key(text) + ".mp3")
    meta = mp3[:-4] + ".json"
    if os.path.exists(mp3):
        return mp3
    if os.path.exists(meta):  # an earlier run started this line: reconcile, never resubmit blindly
        info = json.load(open(meta))
        row = c.find_history(task_id=info.get("task_id"), text=text, voice_id=VOICE)
        if row and row.get("audio_url"):
            return c.download(row["audio_url"], mp3)
        raise SystemExit(f"line {text!r} was submitted before but is not in history yet - check again later "
                         f"or delete {meta} to submit it deliberately again")
    json.dump({"text": text, "state": "submitting"}, open(meta, "w"))
    try:
        r = c.tts(text, VOICE, ENGINE, speed=SPEED)
    except UncertainDelivery:
        row = c.find_history(text=text, voice_id=VOICE)
        if row and row.get("audio_url"):
            json.dump({"text": text, "task_id": row.get("task_id")}, open(meta, "w"))
            return c.download(row["audio_url"], mp3)
        raise
    except ApiError:
        os.remove(meta)  # explicit failure: nothing was produced, safe to try again later
        raise
    json.dump({"text": text, "task_id": r["task_id"]}, open(meta, "w"))
    url = r.get("direct_url")
    if not url and r.get("task_id"):
        res = c.wait_tts(r["task_id"])
        if res["status"] != "completed":
            raise SystemExit(f"{text!r}: {res}")
        url = res["audio_url"]
    return c.download(url, mp3)


def main():
    dry = "--dry-run" in sys.argv
    os.makedirs(CACHE, exist_ok=True)
    c = Client()
    me = c.me(fresh=True)
    todo = [t for _, t in LINES if not os.path.exists(os.path.join(CACHE, key(t) + ".mp3"))]
    print(f"plan {me.get('plan')} | credits {credits_value(me.get('credits'))} | engines {c.unlocked_engines()}")
    print(f"{len(todo)} lines to generate, {sum(len(t) for t in todo)} characters (~1 credit each)")
    for t in todo:
        c.validate_tts(t, VOICE, ENGINE, speed=SPEED)
    if dry:
        return
    track = np.zeros(int(SR * DUR))
    report = []
    for i, (at, text) in enumerate(LINES):
        x = trim(decode(generate(c, text)))
        nxt = LINES[i + 1][0] if i + 1 < len(LINES) else DUR
        room = nxt - at - 0.15
        if len(x) / SR > room:  # never run into the next line: gently speed it up (max 12 %)
            f = min(len(x) / SR / room, 1.12)
            x = np.interp(np.arange(0, len(x), f), np.arange(len(x)), x)
        x = x / (np.abs(x).max() + 1e-9) * 10 ** (-3 / 20)
        a = int(SR * at)
        n = min(len(x), len(track) - a)
        track[a:a + n] += x[:n]
        report.append((at, round(len(x) / SR, 2), round(nxt - at, 2), text))
    for r in report:
        print(f"{r[0]:6.1f}s  len {r[1]:4.2f}s / slot {r[2]:4.2f}s  {'OVER' if r[1] > r[2] else 'ok'}  {r[3]}")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    pcm = (np.clip(track, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(OUT, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print("wrote", OUT, "| credits now", c.me(fresh=True).get("credits"))


if __name__ == "__main__":
    main()
