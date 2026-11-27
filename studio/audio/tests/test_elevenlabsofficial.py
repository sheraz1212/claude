"""Offline tests for audio/elevenlabsofficial.py (no network, no paid calls).
Run: cd studio && python3 -m unittest discover -s audio/tests -v
Live smoke tests (free GETs only) run only with ELO_LIVE=1 and a configured key."""
import json, os, sys, tempfile, unittest
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import elevenlabsofficial as elo  # noqa: E402

KEY = "test-key-SHOULD-NEVER-LEAK"
SPEC = json.load(open(os.path.join(HERE, "fixtures", "elevenlabsofficial-openapi.json")))

ME = {"plan": "Pro", "credits": 8000, "chars_per_generation": 50, "concurrent_jobs": 4, "rate_limit_per_min": 60,
      "history_kept": 20, "engines": [{"engine": "el", "unlocked": True}, {"engine": "elpro", "unlocked": True},
                                      {"engine": "hailuo", "unlocked": True}, {"engine": "cartesia", "unlocked": False}]}


class Resp:
    def __init__(self, status=200, body=None, headers=None, content=b"x"):
        self.status_code, self._body, self.headers, self.content = status, body, headers or {}, content

    def json(self):
        if self._body is None:
            raise ValueError("no json")
        return self._body


class FakeSession:
    """Returns queued responses (or raises queued exceptions) and records every call."""
    def __init__(self, routes):
        self.routes, self.calls = routes, []

    def _next(self, method, url):
        path = url.split("elevenlabsofficial.test", 1)[-1]
        q = self.routes.get((method, path)) or self.routes.get((method, "*"))
        if q is None:
            raise AssertionError(f"unexpected {method} {path}")
        item = q.pop(0) if len(q) > 1 else q[0]
        if isinstance(item, Exception):
            raise item
        return item

    def request(self, method, url, **kw):
        self.calls.append((method, url, kw))
        return self._next(method, url)

    def get(self, url, **kw):
        self.calls.append(("DL", url, kw))
        return self._next("DL", url)


def client(routes, **kw):
    s = FakeSession(routes)
    routes.setdefault(("GET", "/v1/me"), [Resp(200, ME)])
    c = elo.Client(base_url="https://elevenlabsofficial.test", api_key=KEY, session=s, sleep=lambda t: c.slept.append(t),
                   rand=lambda: 0.5, **kw)
    c.slept = []
    return c, s


class Headers(unittest.TestCase):
    def test_bearer_central_and_redacted(self):
        c, s = client({})
        c.me()
        h = s.calls[0][2]["headers"]
        self.assertEqual(h["Authorization"], f"Bearer {KEY}")
        self.assertEqual(elo.redact(h)["Authorization"], "***")
        self.assertNotIn(KEY, repr(c))

    def test_missing_key(self):
        old = os.environ.pop("ELEVENLABSOFFICIAL_API_KEY", None)
        try:
            with self.assertRaises(elo.ApiError) as e:
                elo.Client(base_url="https://x.test")
            self.assertEqual(e.exception.status, 401)
        finally:
            if old is not None:
                os.environ["ELEVENLABSOFFICIAL_API_KEY"] = old

    def test_key_scrubbed_from_error_message(self):
        c, _ = client({("GET", "/v1/history"): [Resp(400, {"error": f"bad key {KEY}"})]})
        with self.assertRaises(elo.ApiError) as e:
            c.history()
        self.assertNotIn(KEY, str(e.exception))

    def test_download_never_sends_key_to_other_hosts(self):
        c, s = client({("DL", "*"): [Resp(200, None, content=b"mp3")]})
        with tempfile.TemporaryDirectory() as d:
            c.download("https://cdn.other.test/a.mp3", os.path.join(d, "a.mp3"))
        self.assertNotIn("Authorization", s.calls[-1][2]["headers"])

    def test_only_v1_paths(self):
        c, _ = client({})
        with self.assertRaises(ValueError):
            c.request("GET", "/api/internal")


class Credits(unittest.TestCase):
    def test_values(self):
        self.assertEqual(elo.credits_value(120), 120)
        self.assertEqual(elo.credits_value("unlimited"), "unlimited")
        self.assertEqual(elo.credits_value("Unlimited"), "unlimited")
        self.assertIsNone(elo.credits_value(None))
        self.assertIsNone(elo.credits_value(True))

    def test_tts_credits_unlimited(self):
        for v in (55, "unlimited", "Unlimited"):
            c, _ = client({("POST", "/v1/tts"): [Resp(200, {"task_id": "t", "direct_url": "u", "credits_left": v})]})
            r = c.tts("hello", "EL:abc", "el")
            self.assertEqual(r["credits_left"], v)
            self.assertEqual(c.last_credits, elo.credits_value(v))


class Validation(unittest.TestCase):
    def test_locked_engine(self):
        c, s = client({})
        with self.assertRaises(elo.ValidationError):
            c.tts("hello", "EL:abc", "cartesia")
        self.assertFalse(any(m == "POST" for m, *_ in s.calls))

    def test_char_limit(self):
        c, _ = client({})
        with self.assertRaises(elo.ValidationError):
            c.tts("x" * 51, "EL:abc", "el")

    def test_speed_and_advanced(self):
        c, _ = client({})
        for kw in ({"speed": 2.5}, {"advanced": {"stability": 2}}, {"advanced": {"bogus": 1}}):
            with self.assertRaises(elo.ValidationError):
                c.validate_tts("hi", "EL:a", "elpro", **kw)
        with self.assertRaises(elo.ValidationError):
            c.validate_tts("hi", "EL:a", "el", advanced={"stability": 0.5})
        with self.assertRaises(elo.ValidationError):
            c.validate_tts("hi", "EL:a", "hailuo", advanced={"model": "m"})

    def test_cartesia_latin(self):
        self.assertTrue(elo.is_latin("Café, 90 days!"))
        self.assertFalse(elo.is_latin("ہیلو"))

    def test_me_cached(self):
        c, s = client({})
        c.me(); c.me(); c.unlocked_engines()
        self.assertEqual(sum(1 for m, u, _ in s.calls if u.endswith("/v1/me")), 1)
        self.assertEqual(c.unlocked_engines(), ["el", "elpro", "hailuo"])


class Voices(unittest.TestCase):
    ODD = "EL:EkK5/I9 3+UQ%WF?Digé"

    def test_library_pagination_and_id_preserved(self):
        body = {"page": 2, "pages": 5, "total": 410, "voices": [{"voice_id": self.ODD, "name": "N", "engine": "el"}]}
        c, s = client({("GET", "/v1/library"): [Resp(200, body)]})
        r = c.library(q="calm", page=2, per=500)
        self.assertEqual(s.calls[-1][2]["params"]["per"], 100)
        self.assertEqual(r["voices"][0]["voice_id"], self.ODD)

    def test_tts_sends_id_byte_for_byte(self):
        c, s = client({("POST", "/v1/tts"): [Resp(200, {"task_id": "t", "direct_url": "u", "credits_left": 1})]})
        c.tts("hi", self.ODD, "elpro", speed=0.95)
        body = s.calls[-1][2]["json"]
        self.assertEqual(body["voice_id"], self.ODD)
        self.assertEqual(body, {"input": "hi", "voice_id": self.ODD, "engine": "elpro", "speed": 0.95})

    def test_delete_path_encoded_needs_confirm(self):
        c, s = client({("DELETE", "*"): [Resp(200, {"success": True})]})
        with self.assertRaises(elo.ValidationError):
            c.delete_voice(self.ODD)
        self.assertFalse(any(m == "DELETE" for m, *_ in s.calls))
        c.delete_voice(self.ODD, confirm=True)
        url = s.calls[-1][1]
        self.assertNotIn(" ", url); self.assertIn("EL%3AEkK5%2FI9", url)

    def test_my_voices(self):
        c, s = client({("GET", "/v1/voices"): [Resp(200, {"voices": [{"voice_id": "v1", "engine": "elpro"}]})]})
        self.assertEqual(c.my_voices()[0]["engine"], "elpro")
        self.assertEqual(s.calls[-1][2]["params"], {"type": "my_all"})


class Async(unittest.TestCase):
    def poll(self, states, deadline=300):
        rs = [Resp(200, st) for st in states]
        c, s = client({("POST", "/v1/tts"): [Resp(200, {"task_id": "T1", "queued": True})], ("GET", "/v1/tts/result/T1"): rs})
        tid = c.tts_async("hello", "EL:a", "el")
        self.assertTrue(s.calls[-1][2]["json"]["async"])
        return c, c.wait_tts(tid, deadline=deadline)

    def test_completed(self):
        c, r = self.poll([{"status": "processing"}, {"status": "completed", "audio_url": "A", "credits_left": "Unlimited"}])
        self.assertEqual(r["status"], "completed"); self.assertEqual(c.last_credits, "unlimited")
        self.assertEqual(c.slept, [2.5])

    def test_failed(self):
        _, r = self.poll([{"status": "failed", "error": "nope"}])
        self.assertEqual(r["status"], "failed")

    def test_unknown_status_is_not_success(self):
        _, r = self.poll([{"status": "weird"}])
        self.assertEqual(r["status"], "unknown")

    def test_deadline_is_unknown_not_failed_and_resumable(self):
        _, r = self.poll([{"status": "processing"}], deadline=-1)
        self.assertEqual(r["status"], "unknown"); self.assertEqual(r["task_id"], "T1")
        c, _ = client({("GET", "/v1/tts/result/T1"): [Resp(200, {"status": "completed", "audio_url": "A"})]})
        self.assertEqual(c.wait_tts("T1")["status"], "completed")  # resume by task id


class Cloning(unittest.TestCase):
    def test_upload_rejects_type_and_size(self):
        c, s = client({})
        with tempfile.NamedTemporaryFile(suffix=".txt") as f:
            with self.assertRaises(elo.ValidationError):
                c.upload(f.name)
        with tempfile.NamedTemporaryFile(suffix=".mp3") as f:
            f.truncate(elo.MAX_UPLOAD + 1)
            with self.assertRaises(elo.ValidationError):
                c.upload(f.name)
        self.assertFalse(any(m == "POST" for m, *_ in s.calls))

    def test_upload_to_clone_flow(self):
        c, s = client({("POST", "/v1/upload"): [Resp(200, {"r2_url": "R2"})],
                       ("POST", "/v1/clone"): [Resp(202, {"task_id": "C1", "status": "queued"})],
                       ("GET", "/v1/clone/status/C1"): [Resp(200, {"status": "queued"}), Resp(200, {"status": "processing"}),
                                                       Resp(200, {"status": "completed", "voice_id": "EL:x/y"})]})
        with tempfile.NamedTemporaryFile(suffix=".wav") as f:
            f.write(b"RIFF"); f.flush()
            r2 = c.upload(f.name)
        self.assertIn("file", s.calls[-1][2]["files"])
        tid = c.clone(r2, "Me", "elpro")
        self.assertEqual(s.calls[-1][2]["json"], {"source_voice_file": "R2", "name": "Me", "engine": "elpro"})
        self.assertEqual(c.wait_clone(tid), {"status": "completed", "voice_id": "EL:x/y"})

    def test_clone_terminal_and_unknown(self):
        for st, want in (("failed", "failed"), ("cancelled", "cancelled"), ("mystery", "unknown")):
            c, _ = client({("GET", "/v1/clone/status/C"): [Resp(200, {"status": st})]})
            self.assertEqual(c.wait_clone("C")["status"], want)
        c, _ = client({("GET", "/v1/clone/status/C"): [Resp(200, {"status": "completed"})]})  # no voice_id
        self.assertEqual(c.wait_clone("C")["status"], "unknown")

    def test_clone_throttle_429_surfaced_not_retried(self):
        c, s = client({("POST", "/v1/clone"): [Resp(429, {"error": "one clone at a time"}, {"Retry-After": "20"})]})
        with self.assertRaises(elo.ApiError) as e:
            c.clone("R2", "Me")
        self.assertEqual((e.exception.status, e.exception.message, e.exception.retry_after), (429, "one clone at a time", 20.0))
        self.assertEqual(sum(1 for m, *_ in s.calls if m == "POST"), 1)


class Errors(unittest.TestCase):
    def test_status_codes(self):
        for st in (400, 401, 402, 403, 404, 409, 413, 429, 502, 503, 418):
            c, _ = client({("POST", "/v1/carry"): [Resp(st, {"error": f"e{st}"})]})
            with self.assertRaises(elo.ApiError) as e:
                c.carry("v", "elpro")
            self.assertEqual(e.exception.status, st)
            self.assertEqual(e.exception.code, elo.CODES.get(st, "http_error"))
            self.assertEqual(e.exception.retryable, st in (429, 502, 503))

    def test_get_retries_then_succeeds_with_retry_after_and_jitter(self):
        c, s = client({("GET", "/v1/history"): [Resp(429, {"error": "slow"}, {"Retry-After": "3"}), Resp(503, {"error": "x"}),
                                                 Resp(200, {"history": []})]})
        self.assertEqual(c.history(), [])
        self.assertEqual(c.slept, [3.0, 2.0 * 0.75])

    def test_get_retry_cap(self):
        c, s = client({("GET", "/v1/history"): [Resp(502, {"error": "x"})]})
        with self.assertRaises(elo.ApiError):
            c.history()
        self.assertEqual(len([1 for m, *_ in s.calls if m == "GET"]), c.get_attempts)

    def test_get_total_time_cap(self):
        c, s = client({("GET", "/v1/history"): [Resp(429, {"error": "x"}, {"Retry-After": "25"})]}, max_elapsed=10)
        with self.assertRaises(elo.ApiError):
            c.history()
        self.assertEqual(c.slept, [])

    def test_get_network_error_retried(self):
        c, _ = client({("GET", "/v1/history"): [requests.ConnectionError("x"), Resp(200, {"history": [1]})]})
        self.assertEqual(c.history(), [1])

    def test_no_retry_after_uncertain_post(self):
        c, s = client({("POST", "/v1/tts"): [requests.Timeout("t")]})
        with self.assertRaises(elo.UncertainDelivery):
            c.tts("hello", "EL:a", "el")
        self.assertEqual(sum(1 for m, *_ in s.calls if m == "POST"), 1)

    def test_402_not_retried(self):
        c, s = client({("POST", "/v1/tts"): [Resp(402, {"error": "Not enough credits"})]})
        with self.assertRaises(elo.ApiError) as e:
            c.tts("hello", "EL:a", "el")
        self.assertEqual(e.exception.code, "insufficient_credits")
        self.assertEqual(sum(1 for m, *_ in s.calls if m == "POST"), 1)


class History(unittest.TestCase):
    def test_reconcile_by_task_and_by_text(self):
        rows = [{"task_id": "B", "text": "two", "voice_id": "v"}, {"task_id": "A", "text": "one", "voice_id": "v"}]
        c, _ = client({("GET", "/v1/history"): [Resp(200, {"history": rows})]})
        self.assertEqual(c.find_history(task_id="A")["text"], "one")
        self.assertEqual(c.find_history(text="two", voice_id="v")["task_id"], "B")
        self.assertIsNone(c.find_history(task_id="Z"))
        self.assertIsNone(c.find_history(text="two", voice_id="other"))


class Contract(unittest.TestCase):
    """Every path/method the client uses must exist in the pinned OpenAPI fixture."""
    USED = {("GET", "/v1/me"), ("GET", "/v1/library"), ("GET", "/v1/voices"), ("POST", "/v1/tts"),
            ("GET", "/v1/tts/result/{task_id}"), ("GET", "/v1/history"), ("POST", "/v1/upload"), ("POST", "/v1/clone"),
            ("GET", "/v1/clone/status/{task_id}"), ("POST", "/v1/carry"), ("POST", "/v1/voices/rename"),
            ("DELETE", "/v1/voices/{voice_id}")}

    def test_paths_documented(self):
        for m, p in self.USED:
            self.assertIn(m.lower(), SPEC["paths"].get(p, {}), f"{m} {p} not in spec")

    def test_tts_fields_documented(self):
        props = SPEC["paths"]["/v1/tts"]["post"]["requestBody"]["content"]["application/json"]["schema"]["properties"]
        for f in ("input", "voice_id", "engine", "speed", "async", "advanced") + elo.ADVANCED_FIELDS:
            self.assertIn(f, props)
        self.assertEqual(set(props["engine"]["enum"]), set(elo.ENGINES))

    def test_client_source_uses_only_documented_paths(self):
        import re
        with open(elo.__file__) as f:
            src = f.read()
        for p in set(re.findall(r'"(/v1/[^"{]*)', src)) | set(re.findall(r"f\"(/v1/[^\"{]*)", src)):
            if p in ("/v1/",):
                continue
            self.assertTrue(any(k == p or k.startswith(p) for k in SPEC["paths"]), p)


@unittest.skipUnless(os.environ.get("ELO_LIVE") == "1" and os.environ.get("ELEVENLABSOFFICIAL_API_KEY"), "live smoke tests off")
class Live(unittest.TestCase):
    def test_live_spec_matches_pinned_paths(self):
        live = requests.get(os.environ.get("ELEVENLABSOFFICIAL_BASE_URL", "https://elevenlabsofficial.com") + "/v1/openapi.json", timeout=30).json()
        for m, p in Contract.USED:
            self.assertIn(m.lower(), live["paths"].get(p, {}))

    def test_live_me(self):
        me = elo.Client().me()
        self.assertIn("plan", me)  # nothing about the account is printed


if __name__ == "__main__":
    unittest.main()
