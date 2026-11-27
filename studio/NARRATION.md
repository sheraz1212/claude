# Narration (ElevenLabsOfficial TTS)

Narrator voice lines are generated server-side by a Python script; nothing runs in a browser.

- Client: `studio/audio/elevenlabsofficial.py` (one place for auth header, timeouts, error shape,
  retries). Spec: https://elevenlabsofficial.com/v1/openapi.json - pinned copy in
  `studio/audio/tests/fixtures/elevenlabsofficial-openapi.json`.
- Per story: `studio/audio/<story>_narration.py` (copy `after_her_narration.py`): LINES = caption
  times + text, VOICE (keep the id exactly as given, e.g. `EL:EkK5I93UQWFDigLMpZcX`), ENGINE, SPEED.
  Each line is cached in `out/narration/<story>/` - re-runs never bill twice. A line whose request
  was sent but not finished is reconciled from `/v1/history`, never re-submitted blindly.
- Deliverable: `<story>-NARRATION.m4a` (same length as the video incl. outro), mixed by the owner.

## Configuration (private - never in git, chat, logs or screenshots)
| Variable | Where |
|---|---|
| `ELEVENLABSOFFICIAL_BASE_URL` | optional, default `https://elevenlabsofficial.com` |
| `ELEVENLABSOFFICIAL_API_KEY` | **Claude cloud:** claude.ai -> Code -> environment settings -> Network secrets, host `elevenlabsofficial.com`, header `Authorization: Bearer`. Then run scripts with `ELEVENLABSOFFICIAL_API_KEY=proxy-injected`. **Own computer:** export it in your shell profile or an untracked `.env`. |

The environment network must also allow the audio host returned by the API
(currently `pub-68fe697698b848b18e85765e592e2d0c.r2.dev`).

## Run
```
cd studio
ELEVENLABSOFFICIAL_API_KEY=proxy-injected python3 audio/after_her_narration.py --dry-run   # free: plan, credits, cost
ELEVENLABSOFFICIAL_API_KEY=proxy-injected python3 audio/after_her_narration.py             # generates (paid)
python3 -m unittest discover -s audio/tests                                                # offline tests
ELO_LIVE=1 ELEVENLABSOFFICIAL_API_KEY=proxy-injected python3 -m unittest audio.tests.test_elevenlabsofficial.Live  # free live GETs
```

## Rotating the key
Create a new key on the provider dashboard -> replace the network secret (or env var) -> run the
live smoke test -> revoke the old key. Credits shown are the provider account's balance; they are
never calculated locally. History is kept for `history_kept` generations only - download audio you need.
