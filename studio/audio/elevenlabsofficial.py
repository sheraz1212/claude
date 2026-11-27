"""ElevenLabsOfficial API client (server-side only - this project is a single-owner CLI pipeline).

Source of truth: https://elevenlabsofficial.com/v1/openapi.json (pinned copy for tests:
studio/audio/tests/fixtures/elevenlabsofficial-openapi.json). Only documented /v1 paths are used.

Configuration (never hard-code, never commit, never print):
  ELEVENLABSOFFICIAL_BASE_URL   default https://elevenlabsofficial.com
  ELEVENLABSOFFICIAL_API_KEY    the Bearer key. In a Claude cloud session the key is stored as a
                                network secret and injected by the proxy, so set this variable to
                                the placeholder `proxy-injected` there.

Rules kept here (not in the scripts that use it):
  - the Bearer header is added in one place and redacted from every log/error;
  - connect/read timeouts on every call;
  - idempotent GETs retry on network errors / 429 / 502 / 503 (bounded attempts + total time,
    Retry-After honoured, exponential backoff with jitter);
  - POST/DELETE are never retried automatically - an uncertain POST raises UncertainDelivery so the
    caller reconciles through status / history before resubmitting;
  - upstream credits are only displayed, never computed locally.
"""
import os, random, time, logging
from urllib.parse import quote

import requests

log = logging.getLogger("elevenlabsofficial")

ENGINES = ("el", "elpro", "hailuo", "cartesia")
AUDIO_EXT = {".mp3", ".wav", ".m4a", ".ogg", ".opus", ".flac", ".aac"}
MAX_UPLOAD = 100 * 1024 * 1024
ADVANCED_FIELDS = ("stability", "similarity", "style", "model")
SENSITIVE = {"authorization", "cookie", "x-api-key", "proxy-authorization"}

# what each status means for the caller (documented in the spec + integration rules)
CODES = {400: "bad_request", 401: "auth", 402: "insufficient_credits", 403: "forbidden",
         404: "not_found", 409: "sample_missing", 413: "too_large", 429: "rate_limited",
         502: "upstream_failed", 503: "unavailable"}


class ApiError(Exception):
    """Safe, normalised failure. `status` keeps the upstream HTTP status internally."""
    def __init__(self, status, code, message, retryable=False, retry_after=None):
        super().__init__(f"[{status} {code}] {message}")
        self.status, self.code, self.message, self.retryable, self.retry_after = status, code, message, retryable, retry_after

    def as_dict(self):
        return {"status": self.status, "code": self.code, "message": self.message, "retryable": self.retryable}


class UncertainDelivery(ApiError):
    """A state-changing request timed out / lost its connection: it may or may not have run."""


class ValidationError(ApiError):
    def __init__(self, message):
        super().__init__(0, "validation", message)


def redact(headers):
    return {k: ("***" if k.lower() in SENSITIVE else v) for k, v in (headers or {}).items()}


def is_unlimited(v):
    return isinstance(v, str) and v.strip().lower() == "unlimited"


def credits_value(v):
    """int for numeric balances, 'unlimited' for unlimited, None otherwise. Never used for arithmetic
    unless it is an int."""
    if is_unlimited(v):
        return "unlimited"
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return int(v)
    if isinstance(v, str) and v.strip().lstrip("-").isdigit():
        return int(v.strip())
    return None


def is_latin(text):
    """Cartesia accepts Latin-script text only (letters must be Latin; digits/punctuation/emoji allowed)."""
    import unicodedata
    for ch in text:
        if ch.isalpha() and "LATIN" not in unicodedata.name(ch, ""):
            return False
    return True


class Client:
    def __init__(self, base_url=None, api_key=None, session=None, timeout=(10, 120),
                 get_attempts=4, max_elapsed=60.0, sleep=time.sleep, rand=random.random, me_ttl=60.0):
        self.base = (base_url or os.environ.get("ELEVENLABSOFFICIAL_BASE_URL") or "https://elevenlabsofficial.com").rstrip("/")
        key = api_key if api_key is not None else os.environ.get("ELEVENLABSOFFICIAL_API_KEY", "")
        if not key:
            raise ApiError(401, "auth", "ELEVENLABSOFFICIAL_API_KEY is not set (see studio/NARRATION.md).")
        self._key = key
        self.s = session or requests.Session()
        self.timeout, self.get_attempts, self.max_elapsed = timeout, get_attempts, max_elapsed
        self._sleep, self._rand, self.me_ttl = sleep, rand, me_ttl
        self._me, self._me_at = None, 0.0
        self.last_credits = None

    def __repr__(self):
        return f"<elevenlabsofficial.Client {self.base}>"  # never shows the key

    # ---------------- transport ----------------
    def _headers(self, json_body):
        h = {"Authorization": f"Bearer {self._key}", "Accept": "application/json"}
        if json_body:
            h["Content-Type"] = "application/json"
        return h

    def _error(self, r):
        try:
            msg = str(r.json().get("error") or "")
        except Exception:
            msg = ""
        msg = msg.replace(self._key, "***")[:300] if msg else f"HTTP {r.status_code}"
        ra = r.headers.get("Retry-After")
        try:
            ra = float(ra) if ra is not None else None
        except ValueError:
            ra = None
        code = CODES.get(r.status_code, "http_error")
        return ApiError(r.status_code, code, msg, retryable=r.status_code in (429, 502, 503), retry_after=ra)

    def _backoff(self, attempt, retry_after):
        if retry_after is not None:
            return min(retry_after, 30.0)
        return min(1.0 * 2 ** attempt, 16.0) * (0.5 + self._rand() / 2)  # exponential + jitter

    def request(self, method, path, *, params=None, json=None, files=None, timeout=None):
        if not path.startswith("/v1/"):
            raise ValueError("only documented /v1 paths are allowed")
        url = self.base + path
        idempotent = method == "GET"
        attempts = self.get_attempts if idempotent else 1
        t0 = time.monotonic()
        for i in range(attempts):
            log.debug("%s %s params=%s headers=%s", method, path, params, redact(self._headers(json is not None)))
            try:
                r = self.s.request(method, url, params=params, json=json, files=files,
                                   headers=self._headers(json is not None), timeout=timeout or self.timeout)
            except (requests.Timeout, requests.ConnectionError) as e:
                if not idempotent:
                    raise UncertainDelivery(0, "uncertain", f"{method} {path}: no answer ({type(e).__name__}); "
                                            "it may have run - reconcile before resubmitting") from None
                err = ApiError(0, "network", f"network error ({type(e).__name__})", retryable=True)
            else:
                if 200 <= r.status_code < 300:
                    try:
                        return r.json()
                    except ValueError:
                        raise ApiError(r.status_code, "bad_response", "upstream answered with non-JSON") from None
                err = self._error(r)
                if not idempotent or not err.retryable:
                    raise err
            last = i == attempts - 1
            wait = self._backoff(i, err.retry_after)
            if last or time.monotonic() - t0 + wait > self.max_elapsed:
                raise err
            self._sleep(wait)
        raise err  # pragma: no cover

    # ---------------- account ----------------
    def me(self, fresh=False):
        if fresh or self._me is None or time.monotonic() - self._me_at > self.me_ttl:
            self._me, self._me_at = self.request("GET", "/v1/me"), time.monotonic()
            self.last_credits = credits_value(self._me.get("credits"))
        return self._me

    def unlocked_engines(self):
        return [e["engine"] for e in self.me().get("engines", []) if e.get("unlocked") is True]

    # ---------------- voices ----------------
    def library(self, q=None, lang=None, gender=None, age=None, category=None, page=1, per=50):
        per = max(1, min(int(per), 100))
        params = {k: v for k, v in dict(q=q, lang=lang, gender=gender, age=age, category=category, page=page, per=per).items() if v is not None}
        return self.request("GET", "/v1/library", params=params)

    def my_voices(self):
        return self.request("GET", "/v1/voices", params={"type": "my_all"}).get("voices", [])

    # ---------------- TTS ----------------
    def validate_tts(self, text, voice_id, engine, speed=None, advanced=None):
        if not isinstance(text, str) or not text.strip():
            raise ValidationError("input text is empty")
        if not voice_id:
            raise ValidationError("voice_id is required")
        if engine not in ENGINES:
            raise ValidationError(f"unknown engine {engine!r}")
        me = self.me()
        if engine not in self.unlocked_engines():
            raise ValidationError(f"engine {engine!r} is locked on plan {me.get('plan')!r}")
        lim = me.get("chars_per_generation")
        if isinstance(lim, int) and len(text) > lim:
            raise ValidationError(f"text is {len(text)} characters; this plan allows {lim} per generation")
        if engine == "cartesia" and not is_latin(text):
            raise ValidationError("Cartesia accepts Latin-script text only")
        if speed is not None and not 0.5 <= float(speed) <= 2.0:
            raise ValidationError("speed must be between 0.5 and 2.0")
        if advanced:
            bad = set(advanced) - set(ADVANCED_FIELDS)
            if bad:
                raise ValidationError(f"unsupported advanced fields: {sorted(bad)}")
            if engine == "el":
                raise ValidationError("advanced settings are not supported on Eleven Lite (el)")
            if "model" in advanced and engine != "elpro":
                raise ValidationError("model is Eleven Pro (elpro) only")
            for k in ("stability", "similarity", "style"):
                if k in advanced and not 0 <= float(advanced[k]) <= 1:
                    raise ValidationError(f"{k} must be between 0 and 1")

    def _tts_body(self, text, voice_id, engine, speed, advanced, asynchronous):
        body = {"input": text, "voice_id": voice_id, "engine": engine}  # voice_id sent byte-for-byte
        if speed is not None:
            body["speed"] = float(speed)
        if advanced:
            body["advanced"] = 1
            body.update(advanced)
        if asynchronous:
            body["async"] = True
        return body

    def tts(self, text, voice_id, engine="el", speed=None, advanced=None):
        """Synchronous TTS. Returns {task_id, direct_url, credits_left}."""
        self.validate_tts(text, voice_id, engine, speed, advanced)
        r = self.request("POST", "/v1/tts", json=self._tts_body(text, voice_id, engine, speed, advanced, False),
                         timeout=(10, 300))
        self.last_credits = credits_value(r.get("credits_left"))
        return {"task_id": r.get("task_id"), "direct_url": r.get("direct_url"), "credits_left": r.get("credits_left")}

    def tts_async(self, text, voice_id, engine="el", speed=None, advanced=None):
        self.validate_tts(text, voice_id, engine, speed, advanced)
        r = self.request("POST", "/v1/tts", json=self._tts_body(text, voice_id, engine, speed, advanced, True))
        if not r.get("task_id"):
            raise ApiError(200, "bad_response", "async TTS answered without a task_id")
        return r["task_id"]

    def tts_result(self, task_id):
        return self.request("GET", f"/v1/tts/result/{quote(task_id, safe='')}")

    def wait_tts(self, task_id, interval=2.5, deadline=300.0):
        """Poll until completed/failed. On deadline returns status 'unknown' (never 'failed')."""
        t0 = time.monotonic()
        while True:
            r = self.tts_result(task_id)
            st = r.get("status")
            if st == "completed":
                self.last_credits = credits_value(r.get("credits_left"))
                return {"status": "completed", "audio_url": r.get("audio_url"), "credits_left": r.get("credits_left")}
            if st == "failed":
                return {"status": "failed", "error": r.get("error") or "generation failed"}
            if st != "processing":
                return {"status": "unknown", "detail": f"unexpected status {st!r}", "task_id": task_id}
            if time.monotonic() - t0 > deadline:
                return {"status": "unknown", "detail": "still processing after the local deadline - check again", "task_id": task_id}
            self._sleep(interval)

    # ---------------- history ----------------
    def history(self):
        return self.request("GET", "/v1/history").get("history", [])

    def find_history(self, task_id=None, text=None, voice_id=None):
        """Reconcile after completion / an uncertain POST. Matches task_id first, else exact text+voice."""
        for row in self.history():
            if task_id and row.get("task_id") == task_id:
                return row
            if not task_id and text is not None and row.get("text") == text and (voice_id is None or row.get("voice_id") == voice_id):
                return row
        return None

    # ---------------- cloning ----------------
    def upload(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext not in AUDIO_EXT:
            raise ValidationError(f"only audio files are accepted ({', '.join(sorted(AUDIO_EXT))})")
        size = os.path.getsize(path)
        if size > MAX_UPLOAD:
            raise ValidationError("file is over 100 MB")
        with open(path, "rb") as f:
            r = self.request("POST", "/v1/upload", files={"file": (os.path.basename(path), f)}, timeout=(10, 600))
        if not r.get("r2_url"):
            raise ApiError(200, "bad_response", "upload answered without r2_url")
        return r["r2_url"]

    def clone(self, r2_url, name, engine="el", gender=None, age=None, style=None, scenario=None):
        if engine not in ENGINES:
            raise ValidationError(f"unknown engine {engine!r}")
        body = {"source_voice_file": r2_url, "name": name, "engine": engine}
        body.update({k: v for k, v in dict(gender=gender, age=age, style=style, scenario=scenario).items() if v is not None})
        r = self.request("POST", "/v1/clone", json=body)
        if not r.get("task_id"):
            raise ApiError(200, "bad_response", "clone answered without a task_id")
        return r["task_id"]

    def clone_status(self, task_id):
        return self.request("GET", f"/v1/clone/status/{quote(task_id, safe='')}")

    def wait_clone(self, task_id, interval=2.5, deadline=600.0):
        t0 = time.monotonic()
        while True:
            r = self.clone_status(task_id)
            st = r.get("status")
            if st == "completed" and r.get("voice_id"):
                return {"status": "completed", "voice_id": r["voice_id"]}
            if st in ("failed", "cancelled"):
                return {"status": st, "error": r.get("error") or st}
            if st not in ("queued", "processing"):
                return {"status": "unknown", "detail": f"unexpected status {st!r}", "task_id": task_id}
            if time.monotonic() - t0 > deadline:
                return {"status": "unknown", "detail": "still cloning after the local deadline - check again", "task_id": task_id}
            self._sleep(interval)

    # ---------------- voice management ----------------
    def carry(self, voice_id, target):
        if target not in ENGINES:
            raise ValidationError(f"unknown engine {target!r}")
        return self.request("POST", "/v1/carry", json={"voice": voice_id, "target": target})

    def rename(self, voice_id, name, engine):
        if not name or len(name) > 60:
            raise ValidationError("name must be 1-60 characters")
        return self.request("POST", "/v1/voices/rename", json={"voice_id": voice_id, "name": name, "engine": engine})

    def delete_voice(self, voice_id, confirm=False):
        if confirm is not True:
            raise ValidationError("deleting a voice needs confirm=True")
        return self.request("DELETE", f"/v1/voices/{quote(voice_id, safe='')}")

    # ---------------- audio download ----------------
    def download(self, url, dest):
        """Fetch a returned audio_url/direct_url. The API key is NOT sent to other hosts."""
        same_host = url.startswith(self.base + "/")
        h = {"Authorization": f"Bearer {self._key}"} if same_host else {}
        last = None
        for i in range(3):
            try:
                r = self.s.get(url, headers=h, timeout=(10, 120))
                if r.status_code == 200 and r.content:
                    with open(dest, "wb") as f:
                        f.write(r.content)
                    return dest
                last = ApiError(r.status_code, CODES.get(r.status_code, "http_error"), "audio download failed")
            except (requests.Timeout, requests.ConnectionError) as e:
                last = ApiError(0, "network", f"audio download: {type(e).__name__}")
            self._sleep(self._backoff(i, None))
        raise last
