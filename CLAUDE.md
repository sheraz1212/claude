# Channel rules

These rules apply to every video made in this project.

## Music

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
