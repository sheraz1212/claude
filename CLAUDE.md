# Channel rules

These rules apply to every video made in this project.

## Music

- Music works in CUES, like a film score: a cue starts when a scene needs feeling and stops
  after it (a few seconds to ~30 s), with breathing room between cues. Long silent stretches
  feel dead, so emotional beats always get something: a single dark low note (piano, cello,
  any instrument) for a hurtful moment, a bass/low-piano impact hit for a shock (a door
  shutting, bad news), a soft BGM under work or montage scenes.
- Background music does NOT play through the whole video. Use it only where the
  story needs it: energy, motivation, emotion, or a big moment. Everywhere else,
  use only sound effects or silence.
- Match the music to the mood:
  - Energetic / motivated moments (training, running, starting work): fast retro
    8-bit chiptune.
  - Emotional / sad moments: dark, low-key piano and cello.
  - Big turning points: orchestral swell, bass drop, impact hits.
  - Soft, hopeful moments: acoustic guitar, light piano.
- Generate all music and sound effects with Python. Save music in `public/music/`
  and sound effects in `public/sfx/`, with clear mood names (for example
  `energy-8bit.wav`, `sad-piano.wav`), so any file can be replaced later.
- Never copy melodies from real games, films or songs (for example Super Mario).
  Write only original music in a similar style, to avoid copyright claims.
- Every story outline must state the music for each part, for example
  `MUSIC: energy-8bit` or `MUSIC: none`. Follow it exactly. Never add music that
  the outline does not ask for.

## Text on screen

- No voiceover and no spoken words, ever. Characters never speak out loud.
  Exception for sound design only: dark, low, ghost-like whispers or echoes may be used for
  scary/inner-voice moments, as long as no words can be understood (generated, not a real voice).
- **Bottom caption = the narrator.**
  - Always third person ("He...").
  - Short: 2-7 words.
  - Describes what is happening, or his situation.
  - Used often, but not in every shot.
  - Bottom centre, Patrick Hand font, warm cream, no background box.
    One key word may be highlighted.
- **Head text = words said or thought by or to a character.**
  - His own thoughts ("I'm tired."), what he tells himself, or what another
    character says to him.
  - Always the same style: a small rounded pill just above the speaker's head.
  - Short: 2-5 words.
  - If there is no room above the head (close-ups), place the pill beside the head.
- Bottom captions and head pills must always look clearly different from each other.

## Story opening and breaks

- Every story opens with a hook: a black screen with one short line centred in
  the middle, then the first scene.
- A black screen with one centred line may also be used mid-story as a chapter
  break, but only when it helps the story.
- Every video ENDS on a black screen with one short lesson for the viewer (max ~6 words),
  e.g. "Call while you can." It is the takeaway of the whole story, not a summary.
- Vary the story TYPE from video to video (mystery, comedy mockumentary, reverse story,
  fantasy, sci-fi, bottle story...). A counter is optional: use it only when it fits.

## Channel concept
- Silent 2D animated short films for a US audience, 2-3+ minutes, landscape.
- Topics: modern everyday struggles young adults relate to: phone/gaming/social media habits,
  procrastination, perfectionism, comparison, loneliness, people-pleasing, overthinking,
  health habits, self-doubt, quitting bad habits.
- Tone: emotional and motivational. Always ends with quiet hope, never dark or graphic.
  No preaching.

## How to give story ideas
When I ask for ideas, give 10 ORIGINAL ideas, each in this exact format:
**N. Title** (2-3 words)
One sentence: the struggle shown as ONE strong visual metaphor (e.g. notes filling a jar,
masks piling up, worries becoming balloons).
- Hook: the black-screen opening line, max 6 words, creates curiosity.
- Counter: the top-left HUD that changes through the story (e.g. "TOMORROWS: 1 -> 212").
- Music: where music appears and which mood (8-bit, dark piano/cello, orchestra, guitar).
- End: the final message, max 5 words.
Rules for ideas: every idea must be understandable without words; one main character;
6-8 different locations; a clear low point and one tiny honest decision that turns it around;
never copy stories, characters or signature visuals from other channels.

## How to write a story outline (after I pick an idea)
- About 3-4 minutes, built from 6-8 clips of 30-35 seconds each:
  1 Hook + establish, 2 Routine montage (the habit repeating, fast cuts),
  3 Contrast (others doing better), 4 Low point (darkest, slowest, near silence),
  5 Tiny decision (warmth returns), 6 Warm ending + end card.
- For each part list: shots with timings, bottom captions, head pills, counter values,
  sound effects, and "MUSIC: <mood>" or "MUSIC: none".
- Build and check ONE part at a time, then join all parts into one full composition.
- The outline must have about 40+ distinct shots (a new beat every 3-5 s), so scenes change
  on their own and nothing drags.
- Deliver ONLY the final joined video, once, in high quality. Do not send single parts.
- Framing: default to wide, full-body and medium (waist-up) shots like the first video.
  Always show his whole head with space above it; never cut off the top of the head.
  No shots of only legs, feet or hands. Close-ups only for big emotions, and still head + shoulders.
- Think like a film director. Before building a clip, write its shot list with the angle
  AND the reason for it: wide = show the place, close-up = show emotion, insert = show a
  detail, over-the-shoulder / POV = show what he sees. Never repeat the same framing twice
  in a row, never crop a character awkwardly, and move the camera only when it means something.
- Sound design: a sound plays only when something happens on screen (a tray rattles, a chair
  scrapes, a cup is crushed). Never loop an ambience or effect under a whole clip like music;
  room tone may only fade in briefly at the start of a new location. Build a varied sound
  library for each story; re-using a sound is fine, but not the same few sounds everywhere.
- Special sound effects (e.g. the dark whisper) are spices: use them at only 1-2 key moments
  per video. Everywhere else use quiet, natural sound or silence.
- Pacing: cut to a new scene or camera angle (wide / close-up / insert) every 3-5 seconds.
  Only the hook and the biggest emotional moments may hold longer (max ~8 s). Never drag
  a shot just to fill time.
- Every video uses NEW locations and sets. Never reuse a location from an earlier video
  (e.g. if one video had a metro, the next one must not). Give each story a surprise or
  twist, not just a straight sad-to-happy line.

## Visual style
- 1920x1080, 30fps, thin black letterbox bars, soft film grain, subtle vignette,
  slow subtle camera moves.
- Near-black background, thin floor line, props as thin line-art with a few warm details.
- Lighting rule: cold blue = isolation, stress, bad habits, phone glow.
  Warm amber = hope, clarity, good choices. The film moves from cold to warm.
- Hero (my own design, reference image references/hero.png): cream (#F3EBCF), big round
  head, short rounded body, chunky rounded arms and legs, mitten hands, oval feet, dark thin
  outline, ONE teal (#5E9E95) wristband. Dot eyes and simple eyebrows; emotion from eyebrows,
  eyelids, posture and movement speed. Keep him identical in every video.
- Supporting characters: same body shape in grey or tan, each with ONE simple accessory
  (e.g. an orange scarf). Never beanies.
- Counter (HUD): top-left, small clean font, changes at key story moments.

## YouTube titles and thumbnails
- Title: short, blunt and personal, ending with a period. Use one of two forms:
  - A statement aimed at the viewer: "Your Phone Is Stealing Your Life." /
    "Motivation Will Fail You." / "You're Not Lazy. You're Too Comfortable."
  - ONE strong word + "| An Animated Short Film": "LONELINESS | An Animated Short Film".
- Thumbnail (1280x720):
  - 1-3 huge words at the top in bold white text with a thick black outline, ending
    with "." or "?" (e.g. "STILL SCROLLING?", "WAKE UP.").
  - Below it: a big close-up of the hero with one strong, exaggerated emotion (wide eyes,
    sweat drop, eye bags, tears) - his face fills a big part of the frame.
  - Near-black background, ONE strong light source (phone glow, lamp, window), and
    ONE symbolic prop from the story (phone, book, alarm clock...).
  - Text and image must say the same idea; readable on a phone screen.
- Learn from other channels' title/thumbnail PATTERNS only. Never copy their stories,
  characters, fonts or signature visuals. Never use self-harm, drugs or graphic images.
