# Channel rules

These rules apply to every video made in this project.

## Music and sound

- The score plays through the WHOLE video, like a film score, and changes with every scene
  (light theme for normal life, sneaky/comic for the habit, dark piano/cello for pain, impact
  hits for shocks, orchestral swell for turning points, warm guitar/piano for hope).
  Only short silences of 1-3 s, and only on purpose (right before a big moment).
- Mix it full but not too loud: overall mean volume around -18 dB (never quiet or "dead").
  On-screen instruments (his guitar) sit under the scene, never louder than the score.
- Match the music to the mood:
  - Energetic / motivated moments (training, running, starting work): fast retro
    8-bit chiptune or driving drums.
  - Emotional / sad moments: dark, low-key piano and cello.
  - Big turning points: orchestral swell, bass drop, impact hits.
  - Soft, hopeful moments: acoustic guitar, light piano.
- Sound effects play only when something happens on screen (a tray rattles, a door slams,
  a cup is crushed). Build a varied sound library for each story.
- Special effects (e.g. a dark whisper) are spices: only 1-2 key moments per video.
- Generate all music and sound effects with Python. Save music in `public/music/`
  and sound effects in `public/sfx/`, with clear mood names (for example
  `energy-8bit.wav`, `sad-piano.wav`), so any file can be replaced later.
- Never copy melodies from real games, films or songs. Write only original music.
- Every outline states the music for each scene, e.g. `MUSIC: sad-piano`.

## Text on screen

- No voiceover and no spoken words, ever. Characters never speak out loud.
  Only exception: the inner voice. It sounds like a thought, not a person: a very soft,
  dark, low-pitched, ghost-like whisper that echoes and rings, slowly saying its short
  lines ("one more.", "tomorrow."). Use it only when the inner voice appears.
- **Bottom caption = the narrator.** It carries the story like a short poem.
  - Always third person ("He...").
  - Short: 2-7 words, simple sentences ("He had friends." "Then he found it." "It felt good.").
  - Used in almost every shot.
  - Bottom centre, Patrick Hand font, warm cream, no background box.
    One or two key words in the video's accent colour (e.g. red); the rest warm cream.
- **Wisdom lines:** at the turning point, 2-3 short, quotable lines
  ("Lazy isn't who you are. It's what you repeat."), on a dark screen or a spotlight.
- **Head text = words said or thought by or to a character.**
  - His own thoughts, what he tells himself, or what another character says to him.
  - Big, clear white text (~60px) just above the speaker's head (beside it in close-ups), on a black
    capsule at only ~10% opacity - just a soft shadow behind the words, never a solid pill.
  - Short: 2-5 words.
- **Words as visuals:** the inner voice / temptation may appear as big words inside the
  scene that the hero can fight (punch them, walk through them, break them).
- Phones show realistic short messages ("ball tomorrow?", "can't.", "u good bro?").
- Bottom captions, head pills and big words must always look clearly different.

## Story opening and ending

- Every story opens with a hook: a black screen with one short line centred in the
  middle, with ONE key word highlighted in the accent colour, then the first scene.
- A black screen with one centred line may be used mid-story as a chapter break.
- The last scene mirrors the first scene (same place, same shot) but changed.
- Every video ENDS on a black screen with one short lesson for the viewer (max ~6 words),
  e.g. "Call while you can." It is the takeaway of the whole story.

## Channel concept
- Silent 2D animated short films for a US audience, 2:40-3:30 long, landscape.
- Topics: modern everyday struggles young adults relate to: phone/gaming/social media habits,
  procrastination, perfectionism, comparison, loneliness, people-pleasing, overthinking,
  health habits, self-doubt, quitting bad habits (sensitive habits are fine if never shown
  directly - only hinted with a colour, a glow or a symbol).
- Tone: emotional and motivational. Always ends with quiet hope, never graphic.
- Vary the story TYPE from video to video (mystery, comedy mockumentary, reverse story,
  fantasy, sci-fi, bottle story...).

## Signature character: the inner voice
- The channel's recurring antagonist is the hero's own inner voice, made visible (our own
  original design - never copy another channel's "shadow demon").
- Its name and look: **THE BLOB** (code: `src/common/Blob.tsx`). A soft, heavy, purple-grey
  goo with the hero's own round face, sleepy half-shut eyes and a lazy smile. Its eyes and
  inner glow are the video's accent colour. Four stages: SMALL (sits beside him) ->
  GROWING (leans in and whispers) -> HEAVY (drapes over his shoulders, he sinks) ->
  WEAKER (he stands tall, it melts into a puddle).
- It appears in every video, says the same short lines again and again ("one more.",
  "tomorrow.", "you deserve it."), grows stronger while the habit wins, gets weaker
  ("Weaker.") as he fights back, and is finally broken or left behind.

## How to give story ideas
When I ask for ideas, give 10 ORIGINAL ideas, each in this exact format:
**N. Title** (2-3 words)
One sentence: the struggle shown as ONE central image that changes through the story.
- Hook: the black-screen opening line, max 6 words, one highlighted word.
- Counter: optional (DAY 1 -> 340, NIGHT 1 -> 30...), only if it fits.
- Accent colour: the one colour that means the habit/struggle in this video.
- Music: how the score changes from scene to scene.
- End: the final lesson, max 6 words.
Rules for ideas: understandable without words; one main character; 3-4 core locations
that come back again and again; a clear low point and one tiny honest decision that turns
it around; vary the story type; never copy stories, characters or signature visuals.

## How to write a story outline (after I pick an idea)
- 2:40-3:30, built from 5-6 clips of 30-35 seconds each.
- Structure: hook + normal life -> the habit starts -> the habit repeats (same shot again
  and again, counter jumping) -> the cost -> low point -> wisdom lines + tiny decision ->
  the fight (montage) -> the mirrored ending -> lesson card.
- REPETITION: show the habit by repeating the SAME shot (same alarm, same bed, same
  phone) with small changes and a jumping counter; at the end repeat it once more, reversed.
- LOCATIONS: 3-4 core locations that return in different states (friends there -> gone ->
  back). New locations compared with earlier videos where possible.
- A TRANSFORMATION TOKEN shows the change without words (e.g. a headband he puts on).
- For each scene list: shots with timings, captions, head pills, counter, sound effects,
  and the music.
- Build and check ONE clip at a time, then join all clips into one full video.
- Deliver ONLY the final joined video, once, in high quality, unless I ask for clips.
- Think like a film director: write each shot's angle AND its reason (wide = place,
  close-up = emotion, insert = detail, POV = what he sees).
- Pacing: shots usually hold 5-8 s with simple framing; cut when the story beat changes.
  Soft dissolves are fine between time jumps.
- Framing: mostly wide, full-body and medium (waist-up). Always show his whole head with
  space above it. No shots of only legs, feet or hands (objects like an alarm clock are fine).
  Close-ups only for big emotions, head + shoulders.
- Characters ALWAYS have legs and feet (standing, walking or seated with legs hanging),
  unless the legs are hidden behind furniture or out of frame.

## Imagery (visual metaphor)
- One CENTRAL image carries the whole story and changes with it (the inner voice growing
  and shrinking, a wall getting higher, stairs he climbs). Add 1-3 more imagery moments
  at the low point and the turning point (e.g. climbing floating stairs and dashing through
  the inner voice; punching its words on a punching bag).
- Before each shot ask: would an image say this deeper than showing it literally?

## Visual style
- 1920x1080, 30fps, thin black letterbox bars, soft film grain, subtle vignette.
- Backgrounds are FILLED with flat colour, never just black with line-art:
  - three layers: far (sky, skyline with lit windows), middle (fence, wall, lockers,
    shelves), near (floor with markings, bench, props);
  - visible light sources (street lamp, desk lamp, window, phone, sunrise) with a pool of
    light on the floor and soft shadows under the characters;
  - warm mid-tone colours for normal life; dark scenes only for night / low point, and even
    then one lit focus (spotlight, lamp, glow).
- ONE accent colour per video means the habit/struggle (e.g. orange glow, red) and is
  used everywhere it appears (the screen, the inner voice, the highlighted words).
- Lighting: cold blue = isolation and bad habits; warm amber = hope and good choices.
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
  - Dark background, ONE strong light source (phone glow, lamp, window), and
    ONE symbolic prop from the story (phone, book, alarm clock...).
  - Text and image must say the same idea; readable on a phone screen.
- Learn from other channels' PATTERNS only. Never copy their stories, characters, fonts or
  signature visuals. Never use self-harm, drugs or graphic images.
