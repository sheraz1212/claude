# How these videos are made

This file explains the whole pipeline so another AI (or person) can make the same kind of
video from this project. Everything is made from code. No AI image tool, no AI video tool,
no stock footage, no stock music.

Read `CLAUDE.md` first: it holds the channel's rules (story shape, text styles, look, sound).
This file only explains HOW the rules are turned into a video.

## 1. Tools

| Job | Tool |
|---|---|
| Drawing every frame | HTML canvas 2D, plain JavaScript (`src/`) |
| Running the canvas without a screen | Chromium, driven by Playwright from Node (`render.js`) |
| Turning frames into video, joining clips, adding sound | ffmpeg (H.264, CRF 15, 30 fps, 1920x1080) |
| Sound effects | Python: numpy + scipy (made from noise and sine waves) |
| Instruments used as effects, and all music | Python `mido` writes MIDI, FluidSynth plays it with the FluidR3 GM soundfont |
| The demon's whisper | `espeak-ng` whisper voice, slowed down, low-passed, echoed and reverbed in Python |
| Fonts | Patrick Hand (captions, black cards), Nunito (head text, phone, counters), Caveat Brush (demon words) |

Install on Ubuntu:

```bash
apt-get install -y fluidsynth fluid-soundfont-gm espeak-ng ffmpeg
```

```bash
pip install mido numpy scipy pillow
```

## 2. Folder map

| Path | What it is |
|---|---|
| `CLAUDE.md` | The channel rules |
| `references/hero.png` | The owner's hero design. The rig is measured from this image |
| `src/index.html` | Loads the fonts, the shared kit, the story's `base.js`, then one clip |
| `src/common/lib.js` | The shared kit: maths, camera, the character rig, captions, head text, the demon, counter, film look, clip runner |
| `src/<story>/base.js` | That story's world: its places, props and helpers |
| `src/<story>/clip1.js` ... `clip6.js` | The shots of each ~32 s clip, on one global clock |
| `src/check/` | Model sheets used to check the hero and demon |
| `render.js` | Renders a clip to mp4, or saves check stills, or prints a clip's sound events |
| `audio/<story>_sfx.py` | Builds that story's sound library and the full SFX track |
| `audio/<story>_music.py` | Composes and renders that story's score |
| `audio/sfx_8bit.py` | The 8-bit demon stings and head-text "bling" sounds |
| `public/sfx/`, `public/music/`, `public/fonts/` | Sound library, finished scores, fonts |

## 3. The steps for one video

1. **Idea.** Ten ideas in the format in `CLAUDE.md`; the owner picks one.
2. **Outline.** Six clips of about 32 s (190 s total). For every shot: framing and why,
   caption, head text, counter, sound, music. Check it against CLARITY FIRST and VARIETY.
3. **World.** Write `src/<story>/base.js`: one function per place (for example `alley(g, t, o)`),
   plus props. A place takes options so it can come back changed (lamp warm or cold, door
   open, notes on the wall). Write the story's REPEATED SHOT as one function with
   parameters (counter value, demon size, cloud size, caption).
4. **Clips.** Each clip file lists its cut times `T` and one function per shot. A shot is
   `(g, t, a, b)`: canvas context, global time in seconds, shot start, shot end. Every value
   on screen is a pure function of `t`, so any frame can be drawn in any order.
5. **Check stills.** Render 6-9 stills per clip and LOOK at them before any full render:

```bash
node render.js little-shadow/clip1 --stills /tmp/stills 7,9.5,15.8,20.5,25,30
```

   The times are seconds inside that clip. Fix what looks wrong, then check again.
6. **Sound events.** Clip files call `sfx(time, 'name', gain)` next to the action. The
   picture and the sound share one clock, so they cannot drift.
7. **Render.** Three clips at a time on a 4-core machine:

```bash
seq 1 6 | xargs -P 3 -I{} sh -c 'node render.js little-shadow/clip{} out/parts/clip{}.mp4'
```

8. **SFX track.** The script builds any missing sounds, asks each clip for its events, and
   mixes one 190 s WAV:

```bash
python3 audio/little_shadow_sfx.py
```

9. **Music.**

```bash
python3 audio/little_shadow_music.py
```

10. **Join.** Concatenate the six clips without re-encoding and add the SFX track. Then test
    that the file decodes with zero errors and look at a contact sheet of the joined file.
11. **Deliver two files:** video + SFX (no music), and the music alone at the same length.

## 4. How the character is drawn (`person()` in `src/common/lib.js`)

- **Skeleton.** Feet or hip position, scale, view (`front`, `back`, `side`), lean, head
  offset, and two angles per arm and per leg. A hand can also be given a target point, and
  the arm is solved with two-bone inverse kinematics (never fully straight).
- **Body parts are simple shapes:** thick lines with round ends (torso, arms, legs) and
  ellipses. All measurements come from `references/hero.png`.
- **One smooth outline.** The torso, arms and legs are filled in one colour on a hidden
  canvas, then blurred and hard-thresholded with an SVG filter (the `goo` filters in
  `src/index.html`). That melts them into one soft shape with no seams. The outline is the
  same shape drawn slightly fatter in the line colour underneath, so its thickness is even
  and gaps between limbs never fill in.
- **Head, hands and feet are drawn crisp on top** (not melted), then a small patch in body
  colour removes the outline where they join the body. That gives the clean crease under
  the head, the round hand with a small wrist pinch, and the flat oval feet.
- **Inner lines.** The arm's edge lines are drawn only where the arm lies over the rest of
  the body, using a mask of the other parts. They fade in below the shoulder.
- **Face.** Small dot eyes, brows, mouth. Emotion comes from `sad`, `smile`, `blink`,
  `look`, `wide`.
- **Idle life.** A resting arm has a soft bend and a slow sway driven by the film clock.
- **Other characters** are the same rig with a body colour and one accessory (`cap`,
  `glasses`, `scarf`, `longhair`). A child is the same rig at a smaller scale.
- **The demon** is the same rig in charcoal with a red face, a red glow (canvas shadow),
  rising embers and optional red cracks. Its words are `demonText()`.
- `actor()` draws a person on its own layer and adds a soft shadow side from the scene's
  light. `floorShadow()` puts a soft shadow under the feet.

## 5. How backgrounds are drawn

- Near-black fills, thin grey line-art (`#6a6a78`), a few light sources.
- Light is additive: `glow()` is a radial gradient drawn with the `lighter` blend mode,
  `pool()` is the same squashed flat for light on a floor.
- Outdoor scenes have three layers: sky gradient and skyline with lit windows, a middle
  layer (fence, wall, stands), and the ground with markings.
- Furniture that must hide legs (tables, desks, dashboards) is drawn AFTER the seated people.
- The camera is `setCam(g, {x, y, z})`. Most shots do a slow push-in by easing `z` and the
  centre over the shot.

## 6. Text

- `caption()` bottom narrator line; `*word*` marks the accent-colour word.
- `headText()` white Nunito above a head, with a pop-in.
- `blackLine()` / `card()` black-screen lines that write on from left to right.
- `hud()` the small top-left counter.
- `post()` adds vignette, film grain and the letterbox bars to every non-black shot.

## 7. Sound effects (`audio/*_sfx.py`)

- Each sound is a short numpy function: filtered noise for paper, cloth, rain, breath,
  crowd; decaying sine sweeps for thuds, kicks, bounces; several sines for metal and glass.
- Instrument effects (piano hit, timpani, cymbal, celesta, brass swell) are tiny MIDI
  files rendered by FluidSynth.
- The whisper is `espeak-ng -v en-us+whisper`, resampled slower and lower, band-limited,
  given four echoes and a reverb.
- Three recordings (cloth, door, glass) are CC0 files; everything else is synthesized.
- The mixer places each sound at its event time and keeps the peak under about -1 dB.

## 8. Music (`audio/*_music.py`)

- 60 bpm, so one beat is one second and chord changes can sit exactly on the cuts.
- A list `PROG` of `(second, chord, velocity)` drives the warm pad and the rolled pedal
  piano chords. Expression curves (MIDI CC 11) move each layer up and down per scene.
- Melodies are short hand-written note lists: piano for normal and hopeful scenes, violin
  for pain. Extra colours (atmosphere pad, bass drone, timpani heartbeat, strings, drums)
  are added only where a scene needs them.
- Each film has its own key and its own idea, so no score repeats:
  - Tomorrow Wall: D minor, violin first, piano later.
  - The Light Inside: E minor, dry piano hook, New Age pad for night scenes.
  - Little Shadow: A minor, a phrase answered by its own copy an octave higher.
  - One Word: G minor, the word is one low dry note that repeats more and more often.
- FluidSynth renders the MIDI with a large reverb; ffmpeg applies gentle compression and
  sets the mean level to about -18 dB.

## 9. What matters most for quality

1. **One clear symbol** the viewer reads without words (a wall of notes, a light in the
   chest, a cloud, a word on the chest), and it changes with the story.
2. **The same shot repeated** with small changes and a jumping counter, then once more
   reversed at the end.
3. **Cause before feeling:** every sad face has its reason in the same or the previous shot.
4. **The twist comes through another person**, and one small object returns three times.
5. **Never two shots in a row with the same framing:** wide, medium, close, insert, POV phone.
6. **Look at stills before rendering.** Most mistakes (a body covering a face, a caption on
   a cream body, a prop in the wrong place) are visible in one still.
7. **One clock for picture, sound and music.**

## 10. Mistakes that happened, so they are not repeated

- A ponytail drawn over the face looked like a lowered eye. Hair now hangs behind the head.
- Melting the whole body made the legs and feet look like an animal's. Head, hands and feet
  are now crisp shapes, measured from the reference image.
- A dark blob appeared between hand and hip when the outline was melted separately. The
  outline is now the melted body shape made fatter.
- Cream captions were unreadable over a cream body. Captions now have a dark stroke.
- Two join commands wrote the same output file at once and corrupted it. Join once, then
  verify with `ffmpeg -v error -i file.mp4 -f null -` (it must print nothing).
- A wait loop used `pgrep -f` with a pattern that matched its own command line and never
  ended. Wait on a marker file instead.
- The author cannot hear audio. Levels are measured, but a human must listen to every mix.

## Arms (human feel)

- Without a forced `bendL`/`bendR`, the IK elbow now hangs DOWN and OUTWARD (gravity), and the arm is never
  stretched past 90% of its length, so a soft elbow always shows.
- Use `pose(name, x, y, s, {hip, dir, tableY})` from `lib.js` for hand targets instead of guessing numbers:
  `rest, phone, phone2, ear, dribble, shoot/cheer, wave, table, hold, face`.
  Example: `person(g, { x, y, s, ...pose('phone2', x, y, s) })`.
- Walking (`walker()`) is unchanged.
