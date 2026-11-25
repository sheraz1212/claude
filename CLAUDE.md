# Channel rules

These rules apply to every video made in this project.

## 0. READ THIS FIRST - EVERYTHING WE LEARNED (updated Nov 2026, overrides older lines below)
This section is the owner's latest decisions. If anything further down disagrees, THIS section wins.

### 0.1 How to work with the owner
- The owner writes in Roman Urdu (Urdu in Latin letters). Answer in short, clear Roman Urdu.
  All on-screen text (captions, hook, cards, titles, package) stays in English.
- Workflow for every video:
  1. Story: either the owner gives a story (often 4-10 lines, sometimes from Gemini) or asks for
     ideas. If he gives one, rate it honestly (x/10), say what is good, what breaks our rules,
     and propose concrete fixes. Do not build until he says "bna do / yes / bnao".
  2. Show a compact OUTLINE (clips, shots with timing, captions, head text, demon lines, symbol,
     music per section). Wait for his OK.
  3. Build clip by clip, check stills, render, join, deliver.
- Never silently change his idea. If something must change (rules, copying, clarity), explain
  why in 2-3 lines and offer the alternative; he decides.
- Give story ideas only in the format of "How to give story ideas" below - 10 ideas, each with
  fall situations, recovery, symbol, twist. He rejects ideas that feel used before - always
  give FRESH topics and say if an idea is close to an earlier video.

### 0.2 What makes a story work for HIM (most important lesson)
- He liked: THE LIFE HE POSTED and ONE CARD AT A TIME - stories HE wrote: literal, real
  everyday life (a guy, his room, his phone, his mom/sister/brother, a real problem).
- He disliked (called them "fazool"): THE RED STRING (threads from the head + split screens) and
  THE LAST WORD (brick walls between people). Concept-heavy metaphors felt fake.
- So: REAL LIFE FIRST. One clear human problem, real places, real family. Metaphor only as a
  small layer (cracks on the body, a demon whisper) - never the whole story.
- NEVER COPY another channel. He sometimes sends a reference video (e.g. Day One Films "You're
  Not Broken": math test F, girl says no, tryouts, a mug fixed with gold, "Broken isn't
  finished"). Learn the PATTERN only. If his draft repeats their situations, lines or signature
  visual, tell him and change them (other situations, other object, own wording, own ending).
- Never reuse our own earlier topics/twists either (fake life + likes, comparison, gambling,
  excuses/procrastination, anger, overthinking, exam stress, people pleasing, ego/arguments,
  cracks-and-gold self-worth are DONE).

### 0.3 Names, characters, demon
- The hero has NO NAME. Captions always say "he". Never Pakistani/Indian names (US audience).
  Others by role: "his mom", "his big sister", "his best friend", "his coworker". If a name is
  truly needed (a chat header), use a short American name (Danny, Mike, Leo).
- Women/girls: accessory 'longhair'. Available accessories in person(): cap, glasses, longhair,
  scarf ONLY (anything else draws nothing).
- DEMON = the inner voice, used SPARINGLY like a horror-film ghost: mostly a whisper + red text
  (Caveat Brush) at 1-3 key moments; the full demon appears at most 1-2 times (a big moment),
  and at the end it breaks (glass shatter / golden or red beam). Never a friend, never a role.
  When it speaks, ALSO show its words as red text (whisper + red text together).
- Each situation can have its own demon line ("you're not smart enough.", "she'd never pick
  you.", "you break everything.", "you can't do it.").

### 0.4 FRAMING - nothing important may leave the frame (he had to upload a video with the demon's head cut off)
- Every head (hero, demon, others), every head text, demon text and caption must be fully
  inside the visible frame (inside the 60 px letterbox bars), in EVERY shot, landscape and
  vertical. A huge demon must be scaled/placed so its whole head is visible.
- In the stills check, look specifically at: heads at the top edge, people at the left/right
  edge, long red text running off screen, head text overlapping signs. Fix before rendering.
- No split screens with stacked halves (heads got cut). Side-by-side split calls are OK only if
  both faces are fully visible.
- Put demon/whisper text in screen space so it always fits:
  `demonText(g, text, CAM.x + (W*0.5 - W/2)/CAM.z, CAM.y + (H*0.2 - H/2)/CAM.z, t, a, 80)`.

### 0.5 Length, pacing, ending
- Length is flexible 2:30-4:00 - only as long as the story needs, never stretched.
- Pacing per scene (NOT a fixed rule): normal shots ~5-6 s, inserts ~3-4 s, emotional shots
  longer. He found 3-4 s shots too fast. Montages are fast but short (~15-20 s total).
- Ending: proof image -> lesson card (black, pen write-on) -> the CHANNEL OUTRO (7 s, files
  `/home/user/claude/outro-VIDEO-SFX.mp4` and `outro-MUSIC.m4a`) appended to BOTH deliverables.
  (Sometimes he asks for the moral before the last scene instead - follow his outline.)

### 0.6 Music decisions
- Mean about -18 dB for the whole score; measure loudness per 10 s and fix loud/quiet spots.
  Use the finish chain `acompressor=threshold=-26dB:ratio=2.2:attack=60:release=900:makeup=1,
  alimiter=limit=0.2:attack=4:release=120:level=false`, then gain = min(-18-mean, -1.2-peak).
- After the turn a gentle beat MAY fade in gradually (never all at once), drums on top, piano
  lower - he liked that once (Excuses). He did NOT like drums under a montage.
- Montages (training / DAY 1->10 / progress): an ORIGINAL 8-bit retro loop (GM 80 square lead
  arpeggio + GM 81 saw melody + GM 38 synth bass), NO drums. "Like Super Mario" means that FEEL -
  never copy any game melody.
- No drums elsewhere unless he asks.

### 0.7 Deliverables and files
- Long video: (1) `<story>-VIDEO-SFX.mp4` (all SFX + whisper + outro audio), (2) `<story>-MUSIC.m4a`
  (same length incl. outro music), (3) `<story>-thumbnail.png` (1280x720).
- Short: ONE file `<story>-short-FINAL.mp4` (1080x1920, SFX + music mixed at -10 dB).
- The YouTube PACKAGE is given IN THE CHAT ONLY - never as a .md file. It contains:
  at least 5 title options (mark one recommended), thumbnail text idea, description in a code
  block, tags in a code block, chapters in a code block, pinned comment question, and for a long
  video a suggestion for the Short.
- Deliverables live in `/home/user/claude/` and must stay out of git: add their name pattern to
  `.git/info/exclude`. Only CLAUDE.md is ever committed/pushed. Delete intermediate clip mp4s.
- Thumbnails: Remotion components in `src/*Thumb.tsx` (import Defs, ShockedHero, Title, YEL from
  `./PocketThumb`), register in `src/Root.tsx`, render with
  `./node_modules/.bin/remotion still <Id> <file>.png`. Only the hero, one glowing prop, 1-3 huge
  words ending with "." or "?". He may ask for 2 versions (e.g. EXAM STRESS / EXAM PRESSURE).
  Different composition per video (e.g. hero with an open book, bloodshot eyes).

### 0.8 How a film is built (technical recipe that works)
- Start from the LATEST story folder as template: `cp studio/src/rebuilding/base.js` (it
  contains every place and prop made so far), strip its header comment, set the new
  accent on the `const ACC = ...` line (CHECK it really changed: `grep -n "^const ACC" base.js`).
  Add new places/props at the end of base.js.
- One `clipN.js` per ~30-35 s: `const T = [start, ...shot boundaries..., end]`, shot functions
  `(g, t, a, b)`, `sN.fin = 0.4` for a fade-in at a new place, `.fout` before a card,
  `defineClip(start, T, [s1, ...])`. Cards: `card(text)` / `card2(line1, line2)` (`*word*` = accent).
- Check stills (times are CLIP-LOCAL seconds):
  `cd studio && NODE_PATH=$(npm root -g) node render.js <story>/clip1 --stills <dir> 2,5.5,9`
  then make a contact sheet (PIL) and LOOK at it. Check framing (0.4), arms, overlaps.
- SFX: `studio/audio/<story>_sfx.py` - copy the latest one (e.g. `rebuilding_sfx.py`): it builds new
  sounds, whispers (`whisper(text)`), reads events with `node render.js <story>/clipN --events`,
  mixes `out/parts/<x>_sfx.wav`. Unknown names load from `public/sfx/<name>.wav`.
- Music: `studio/audio/<story>_music.py` - copy the latest (`rebuilding_music.py`): PROG list,
  pad CC11 curves, pedal piano, violin, one musical idea, writes `public/music/<name>.wav`.
- Render: 3 clips in parallel in the background, then the rest:
  `NODE_PATH=$(npm root -g) node render.js <story>/clipN out/parts/xN.mp4`.
- Join WITH the outro:
  `ffmpeg -f concat -safe 0 -i list.txt -i x_sfx.wav -i /home/user/claude/outro-VIDEO-SFX.mp4 -filter_complex
  "[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=DUR[fa];[0:v][fa][2:v][2:a]concat=n=2:v=1:a=1[v][a]"
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k <story>-VIDEO-SFX.mp4`
  and the music + `outro-MUSIC.m4a` the same way. Verify with `ffmpeg -v error -i f -f null -`.
- Shorts = re-edit of the film's shots: folder `studio/src/<story>-shorts/` with a copy of the
  film's base.js and `short1.js` (copy `rebuilding-shorts/short1.js`): SEGS =
  [filmStart, filmEnd, dxScreenPx, zoomFactor, dyScreenPx]; stop on a cliffhanger; end card
  "Visit the channel / for the full video." Audio: copy `audio/rebuilding_short_audio.py`, then
  mix music at -10 dB into ONE FINAL file. Re-check EVERY segment's stills in vertical - wide
  shots often cut people at the sides (use dx and a smaller zoom).
- Known pitfalls: `onBed()` redraws the whole room (draw extra props AFTER it); `kitchen()` shows
  'DIET' unless `note:` is given; `corridor()` always says EXAM HALL (cover it if not an exam);
  seated people behind a table use `hip: true, thigh: 20` + `pose('table', x, y, s, {hip:true,
  tableY})`; a camera split must also shift `toScreen`; use python for text replacements
  (sed breaks on special characters); never `rm` with variables in the path.
- Git: the CODE is on GitHub (owner's decision, Nov 2026): CLAUDE.md, RESTORE.txt, references/,
  studio/src, studio/audio, studio/render.js, studio/*.md|txt, studio/references, studio/public/fonts,
  studio/public/sfx, src/ (Remotion thumbnails), package files, public/fonts, public/outro and the
  channel outro (outro-VIDEO-SFX.mp4, outro-MUSIC.m4a). These paths are in .git/info/exclude, so add
  them with `git add -f <path>`. NEVER commit story videos, music .wav files, thumbnails or node_modules.
  After building a film, commit its new code (studio/src/<story>, studio/audio/<story>_*.py, new
  sfx wavs, src/*Thumb.tsx, Root.tsx) with `git -c user.email=<owner email> -c user.name=sheraz1212
  commit` and the session trailers, then `git push -q origin main`, and copy CLAUDE.md to
  `/home/user/CLAUDE.md`.
- New session / empty container: if `studio/` is missing, the code is in this GitHub repo (or the
  owner uploads the 3 backup zips `notyet-backup-1-code.zip`, `-2-sounds.zip`, `-3-sounds.zip`). Follow RESTORE.txt (tools: ffmpeg, fluidsynth +
  FluidR3_GM.sf2, espeak-ng, python mido numpy scipy pillow, Playwright; `npm install` for Remotion).
  Music .wav files are not stored - rebuild them with `python3 studio/audio/<story>_music.py`.

## Production pipeline (how videos are built)
- Build every video with the canvas pipeline in `studio/` (read `studio/HOW-IT-WORKS.md`):
  HTML canvas 2D + plain JavaScript, rendered by Playwright/Chromium (`studio/render.js`),
  joined with ffmpeg. One shared kit `studio/src/common/lib.js` (character rig `person()`,
  demon, captions, head text, camera, film look); one folder per story with `base.js`
  (places + props) and `clip1.js`...`clip6.js` (shots on one global clock).
- The hero rig is measured from `references/hero.png`: body melted into one smooth shape,
  head / hands / feet crisp on top, arms solved with IK (never fully straight), idle sway,
  soft side shadow and floor shadow.
- HUMAN ARMS: elbows hang down and outward by gravity (automatic in `person()`); hand targets
  come from `pose(name, x, y, s)` in lib.js (phone, phone2, ear, dribble, shoot/cheer, wave,
  table, hold, face) - never guessed numbers. Seated people talking: side view with bent legs
  reads better than front view. Walking (`walker()`) stays as it is.
- Sound effects are called inside the shots (`sfx(time, 'name', gain)`) so picture and
  sound share one clock; `audio/<story>_sfx.py` builds the library and mixes the track.
- Before any full render: 6-9 check stills per clip, LOOK at them, fix, check again.
- After joining: verify with `ffmpeg -v error -i file.mp4 -f null -` (must print nothing).
- Captions get a dark stroke so they stay readable over a cream body.
- START EVERY NEW STORY FROM THE LATEST STORY AS TEMPLATE (see 0.8): copy `studio/src/rebuilding/base.js`
  and the latest `studio/audio/*_sfx.py` / `*_music.py`, then change places, shots, sounds and notes.
  Keep Fable's look numbers.

### FABLE LOOK + MOTION (copy exactly - this is the channel's style now)
- Frame: 1920x1080, 30 fps, black letterbox bars 60 px top and bottom, vignette (radial,
  edges to 55% black), film grain overlay at ~8.5% (3 grain frames cycling).
- Backgrounds: near-black fills (#16161e, #0a0a0e, #0c0c13), thin grey line-art (#6a6a78),
  skylines of dark blocks with a few warm lit windows (#d9a657), lamp posts. Light is ADDED
  with `glow()` (radial gradient, 'lighter' blend) and `pool()` (the same squashed flat on
  the floor). Warm light rgb 255,190,110; cold light rgb 170,190,235; each story has one
  accent colour (e.g. purple #A66BFF) used for its symbol and key caption words.
- Characters: `actor()` draws a person on its own layer and shades one side from the
  scene's light (dir, amt ~0.25-0.35, small dim); `floorShadow()` under every standing
  character. Walking with `walker()` (side view, swinging legs and arms, small bob);
  supporting characters #A9A9B4 grey / #C9A77A tan with one accessory.
- Camera: EVERY shot has a slow push-in - zoom eases from ~1.0 to ~1.1 (wide) or 1.4 to 1.5
  (medium) with a small drift of the centre (`setCam(g,{x,y,z})` with `ease(seg(t,a,b))`).
  Shots last ~4.5-6.5 s. Shot order alternates WIDE (place) -> MEDIUM (the moment) ->
  REPEATED SHOT -> CLOSE (emotion) -> INSERT/POV, never the same framing twice in a row.
- Cuts: hard cuts inside a scene; a 0.5 s fade-in (`fin`) when a new place starts;
  fade-out (`fout`) before a black card. Black cards write on from left to right
  (Patrick Hand 96 px) with the pen sound.
- Impacts: a short camera shake (offset sin(t*80)*12 fading over 0.4 s) + a quick flash of
  the accent colour (40% fading over 0.3 s) + a low thud and a piano low hit.
- Text sizes: caption 58 px Patrick Hand with a 9 px dark stroke at y=978; head text 40 px
  Nunito regular; demon words Caveat Brush ~70-90 px red (#ff3a2c); HUD small top-left.
- The demon: same rig in charcoal, red face, red glow (canvas shadow ~28), embers, fades in
  over ~0.8 s; in close-ups it is huge (scale ~2.9) behind him.

## Music and sound

### BACKGROUND MUSIC (new system - replaces all old score rules)
- Written as MIDI in Python (`mido`), played with real recorded instruments (FluidSynth +
  FluidR3 GM soundfont). Original notes only - never copy games, films or songs.
- THREE LAYERS, mixed per scene like a film mixer:
  1. WARM PAD (GM 89, the soft "hmmm") - the base of the whole video. It plays almost all
     the time, overlapping sustained chords. Its volume moves with the scene:
     - when the MELODY must shine, the pad drops to ~10-20% (still there, not noticeable);
     - when a scene goes down / turns quiet, the pad comes up and can carry the scene
       almost alone (pad + soft pedal chords, piano low or gone).
  2. PIANO CHORDS WITH SUSTAIN PEDAL + big reverb, notes slightly rolled - they stay with
     the pad through most of the video and give the chord changes (dark/low chords for
     pain, higher/brighter chords for hope).
  3. MELODY - piano for normal and hopeful scenes, VIOLIN for sad / painful ones.
- THE FINALE (the motivational end): a fast piano line + violin melody playing TOGETHER,
  full and moving; the pads sit far back, very slow, so quiet they are barely noticed.
- In short: per scene, sometimes the melody goes up, sometimes the pads go up; the pedal
  chords stay along. Changes are gradual (fades over seconds), never jumpy.
- DRY piano chords (no pedal) are an option for the hook / opening - but NOT in every
  video.
- VARIETY IN EVERYTHING: never the same recipe twice. Change keys, tempos, which layer
  leads, the hook sound, the finale shape, and add colour instruments where a scene asks
  (bass drone or timpani heartbeat for dark / tense moments; drums or 8-bit for running /
  training; orchestra swell for a big turn).
- Extra pads / atmospheres the owner likes (use for dreamy, lonely, thinking, night
  scenes, under or instead of the warm pad): Pad 1 New Age (88), FX 1 Rain (96),
  FX 4 Atmosphere (99), FX 7 Echoes (102), FX 8 Sci-fi (103).
- Mix: overall mean around -18 dB, never dead silent (short 1-3 s silences only on purpose,
  right before a big moment). Every outline states the music per scene
  (e.g. `MUSIC: pad up, pedal chords, no melody`).
- Save music in `public/music/` with clear mood names.
- Music engine details (see `studio/SOUND-RECIPE.txt` part 2): 60 bpm, one PROG list of
  (second, chord, piano velocity); pad = root/5th/octave/3rd overlapping 0.6 s, moved only by
  CC 11 curves; pedal piano re-pedalled at each chord, 5 notes rolled 0.05 s apart, velocity
  40-88; violin with its own CC 11 swell; reverb CC 91 100-127, FluidSynth room 0.92;
  every film gets ONE musical idea tied to its story + a new key; finish with
  acompressor (threshold -26 dB, ratio 2.2) -> mean -18 dB, peak under -1.2 dB, 1.5 s fade.

### SOUND EFFECTS (unchanged)
- Full method with code: `studio/SOUND-RECIPE.txt` (follow it for every video). Key points:
  - Never raw white noise: band-pass per material (paper/pen 1500-7000 Hz, breath/whoosh
    500-3500, crowd 300-2200, thump/room 40-300, water/rain 900-9000).
  - Every sound has an envelope (impacts: 1-4 ms attack + exponential decay) and short
    fades so nothing clicks.
  - Impacts are layered: a sine with FALLING pitch (body) + a tiny noise click + sometimes a ring.
  - Paper / tearing = "crackle" (sparse impulses x noise, band-passed). Rooms = quiet brown noise.
  - Anything with a musical tone (piano hit, timpani, cymbal, celesta, brass) is a tiny
    MIDI played by FluidSynth with big reverb - never sine waves.
  - Nothing repeats exactly: random jitter of timing, loudness, pitch.
  - Each sound has its own real-life level: kick/thud -8 to -12 dB, knock/buzz -13 to -17,
    pen/cloth/breath -20 to -26, rain/crowd -24 to -27, room tone -30 to -40.
  - A very quiet room tone runs under the whole film. Final SFX peak under -1 dB.
- Sources (all safe for YouTube): SFX synthesized in Python (numpy + scipy): filtered noise
  for paper, cloth, rain, breath, crowd; falling sine waves for thuds, kicks, bounces;
  stacked sines for metal / glass. 8-bit sounds from square waves. Whisper from espeak-ng.
  Only real recordings: CC0 packs from Kenney (kenney.nl "RPG Audio", "Impact Sounds") -
  cloth rustle, door open, glass shatter. Music + instrument effects: original MIDI notes
  played by FluidSynth with the FluidR3 GM soundfont (MIT licence). Never use copyrighted
  music, game sounds or unlicensed samples.
- Sound effects play only when something happens on screen (a tray rattles, a door slams,
  a cup is crushed). Build a varied sound library for each story (`public/sfx/`).
- Special effects (e.g. a dark whisper) are spices: only 1-2 key moments per video.
- Use the generated SFX library AND instruments as sound effects where a scene needs it
  (a single piano hit, a timpani boom, a brass stab, a celesta sparkle, a cymbal).
- 8-BIT GAME SFX (original, never copied from any game): when the DEMON appears, play an
  8-bit villain sting (`public/sfx/demon-8bit-1/2/3.wav` - rotate them); when HEAD TEXT
  pops up above someone, play an 8-bit pickup "bling" (`public/sfx/pop-8bit-1/2/3.wav` -
  rotate them). A low-brass swell (trombone / tuba / horn) stays an option for very dark
  demon moments. Script: `audio/sfx_8bit.py`.
- Hook: the black screen may start with only the pen-writing SFX.
- All SFX (generated + instrument + 8-bit + whisper) go in the VIDEO file, never in the
  music file.

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
  - Clear white text, 40px, REGULAR weight (not bold), Nunito, just above the speaker's head (beside it in close-ups), on a black
    capsule at only ~10% opacity - just a soft shadow behind the words, never a solid pill.
  - Short: 2-5 words.
  - If the head is near the top of the frame, put the text BESIDE the head (left or right),
    never squeezed against the top edge - it only has to show clearly who said it.
- **Words as visuals:** the inner voice / temptation may appear as big words inside the
  scene that the hero can fight (punch them, walk through them, break them).
- Phones show realistic short messages ("ball tomorrow?", "can't.", "u good bro?").
- Bottom captions, head pills and big words must always look clearly different.

## Story opening and ending

- Every story opens with a hook: the FIRST SCENE starts at second 0 with one short hook
  line written over it (top of frame, ONE key word in the accent colour). Never a long black
  screen before the story (analytics: we lost ~60% of viewers in the first 15 s).
- Every black-screen line (hook, chapter break, wisdom lines, lesson) appears with a soft
  handwriting / pen-on-paper sound effect while the text writes on.
- A black screen with one centred line may be used mid-story as a chapter break.
- The last scene mirrors the first scene (same place, same shot) but changed.
- Every video ENDS on a black screen with one short lesson for the viewer (max ~6 words), followed by the 7 s channel outro (see 0.5),
  e.g. "Call while you can." It is the takeaway of the whole story.

## CLARITY FIRST (the biggest rule)
- SILENT TEST: someone who never saw the script must understand, from the video alone,
  WHAT the topic is (within the first 15-20 s), WHAT happens in each scene and WHY he feels
  what he feels. If a shot only makes sense when you know the script, redo it.
- Build a clear, LITERAL everyday story first (marks at school, a phone, a gym, a job);
  metaphors (demon, glowing windows, words as objects) only sit ON TOP of that story,
  never replace it.
- ONE obvious symbol anyone reads instantly (a number above every head, a battery, a
  meter, a follower count) - shown in the world, not explained.
- Cause -> effect on screen: every feeling has a visible reason in the same or the
  previous shot (he sees the other's 91 -> he looks at his 62 -> he drops his head).
- Real people with clear roles drive the story: a parent, a friend, a rival, a teacher.
  The twist comes THROUGH another person (the one he envies is hurting too / is missing
  what he has).
- A small object that comes back 3 times and changes meaning (a note in a lunchbox, a
  cup, a drawing): ignored -> missed -> treasured.
- Captions say plainly what the image cannot (who, when, what changed) - simple, not poetic.

## VARIETY (videos must never feel dull)
- A full, living world: most scenes have other people (3-8 classmates, passers-by,
  colleagues), each doing something small (talking, eating, walking past).
- 6-8 places per video: 3-4 core places that return + 3-4 one-off places that move the
  story (car with mom, canteen, bus stop, school gate, rain outside, his room).
- Shot variety in EVERY clip: wide (place, crowd), medium, close-up (big emotion),
  top-down insert (lunchbox, desk, test papers side by side), insert of an object held in
  his hand (test paper, phone, note), POV phone screen, reflection (mirror, puddle,
  window). Never two shots in a row with the same framing.
- A time counter can show passing time (WEEK 1 -> 11 bottom-right) next to the symbol.

## Channel concept
- Silent 2D animated short films for a US audience, 2:30-4:00 long (flexible, never stretched), landscape.
- Topics: modern everyday struggles young adults relate to: phone/gaming/social media habits,
  procrastination, perfectionism, comparison, loneliness, people-pleasing, overthinking,
  health habits, self-doubt, quitting bad habits (sensitive habits are fine if never shown
  directly - only hinted with a colour, a glow or a symbol).
- Tone: emotional and motivational. Always ends with quiet hope, never graphic.
- Vary the story TYPE from video to video (mystery, comedy mockumentary, reverse story,
  fantasy, sci-fi, bottle story...).
- Upload schedule: 3 videos a week on Notyet Films - Monday, Wednesday and Friday.

## STORY METHOD (how every story is built - the most important rule for retention)
Our old mistake: we picked ONE situation as the topic (headphones, one bet, one unanswered
text) and stretched it over 3 minutes - the same bed / dinner shot again and again. Viewers
guessed the rest after 20-30 s and left. Never do that again.
1. Pick a BIG LESSON, not a scene. The title is a broad theme that holds many situations
   ("SELF RESPECT", "BAD HABITS", "COMPARISON", "MONEY"). The lesson is the topic.
2. Show it through 4-5 DIFFERENT everyday situations, all with the same root, each a quick
   10-15 s beat in its own place with its own small wound. Example - self respect: he keeps
   texting someone who ignores him -> says yes when friends hand him their bags -> gets
   knocked down and HE says sorry -> laughs along when friends mock him -> runs when she
   only texts because she needs something. Example - bad habits: vaping -> wasting money
   with friends -> going to the wrong places -> bunking university -> another activity.
   Never stretch one situation into a whole video; one situation is never a video's topic.
3. ONE symbol scores every situation: after each beat a 2-4 s insert shows the symbol
   change (a price tag crossed out and rewritten, a meter, a number). Rhythm: situation ->
   score -> situation -> score, so the viewer gets a payoff every ~15 s.
4. Low point: he realises he did it to himself (the symbol's pen / control was in his hand).
5. The turn back MIRRORS the fall: the SAME 4-5 situations in the same places, now reversed
   (he says no, he doesn't carry the bag, the other person says sorry, he doesn't reply),
   and the symbol climbs back with each one. No new places are needed for the recovery.
6. The demon only acts small and physical (e.g. a hand that lowers the score) and says
   varied lines that fit each situation; at the end he takes the control back and it breaks.
7. Few words: one-line captions, 2-3 word head text. No 4 s black hook - the first scene
   starts at second 0 with the hook line over it.
8. End: one last image that proves the change is real, then the short lesson card.
9. Never reuse a twist or moral from an earlier video (e.g. "his little brother copies the
   habit" was already used) - each video needs its own pain point and turn.
- When giving ideas, each idea also lists its 4-5 situations (fall) and how each one is
  reversed (recovery), plus the symbol that scores them.

## WHAT THE CHANNEL ANALYTICS TAUGHT US (check every video against this)
Data (Notyet Films, first videos): COMPARISON 818 impressions / CTR 1.59% / 19 views / ~21 s
average view; LUST 415 / 1.69% / 14 views / 0:27 average (13%); SACRIFICE 120 / 3.33% / 7 views.
LUST retention: 100% -> ~40% in the first 15 s, ~15-20% by 40 s, then flat ~10% to the end.
1. The first 15 s decide the video. Frame 1 is already the story (no black intro, no slow
   establishing shot); the topic is clear by 5 s; the first situation lands by 10 s.
2. Viewers who pass ~40 s stay to the end - the story itself works. The drop comes from a
   slow start and from predictable repetition, so a new situation + symbol payoff every
   10-15 s (STORY METHOD) is what keeps them.
3. CTR ~1.6% is too low: title + thumbnail must ask ONE question the viewer feels
   ("STILL SCROLLING?", "ALL IN?"), the hero's face shows one huge emotion, ONE glowing
   prop, only the hero unless a second character is the point. Title and thumbnail say
   the same idea in different words.
4. Shorts work (they got response). Every film gets 1-2 Shorts (vertical 1080x1920, 35-45 s):
   either a re-edit of the film's own shots (`studio/src/<story>-shorts/`) that stops on the
   twist as a cliffhanger, or a compressed fall with the symbol. They end on a black card
   "Visit the channel for the full video." and link the film as the Short's Related video.
   Shorts music is mixed in at -10 dB (deliver one final file per Short).
5. Upload Monday / Wednesday / Friday; the Shorts go out 1-3 days after their film.

## Signature character: the inner voice (THE DEMON)
- The channel's recurring antagonist is the hero's own inner soul, made visible
  (code: `demon()` in `studio/src/common/lib.js`). It is ALWAYS red + black, in every video.
- Look: exactly the hero's shape (round head, body, legs, mitten hands, oval feet), about
  1.35x his size, charcoal-black body, soft red glow around it, red eyes / brows / mouth,
  red embers rising from its feet.
- Its words: red, brush handwriting font (Caveat Brush), beside its head, NO capsule -
  clearly different from captions and head pills. Paired with the low echoing whisper.
- It says the same short lines again and again ("one more.", "tomorrow.", "you deserve it."),
  and sometimes a few other short lines that fit the story - not only the same 2-3 every time;
  grows bigger while the habit wins (SMALL -> GROWING, leans in -> HEAVY, towers over him),
  gets weaker as he fights back ("weaker..."): it shrinks, red cracks appear, and it breaks.

## How to give story ideas
When I ask for ideas, give 10 ORIGINAL ideas, each in this exact format:
**N. Title** (2-3 words)
One sentence: the struggle shown as ONE central image that changes through the story.
- Hook: the opening line written over the first scene, max 6 words, one highlighted word.
- Counter: optional (DAY 1 -> 340, NIGHT 1 -> 30...), only if it fits. NEVER force a
  counter into a story where it doesn't belong - then write "Counter: none".
- Accent colour: the one colour that means the habit/struggle in this video.
- Music: how the score changes from scene to scene.
- End: the final lesson, max 6 words.
Rules for ideas: understandable without words; one main character plus real supporting
people (parent, friend, rival); 3-4 core locations that come back again and again plus
3-4 one-off places; passes the SILENT TEST (topic clear without any script); a clear low point and one tiny honest decision that turns
it around; vary the story type; never copy stories, characters or signature visuals.

## How to write a story outline (after I pick an idea)
- 2:30-4:00 (flexible), built from 5-6 clips of 30-35 seconds each.
- Structure (see STORY METHOD): hook scene from second 0 -> 4-5 different situations of the
  same lesson, each followed by the symbol dropping -> low point ("he did it to himself") ->
  wisdom lines + tiny decision -> the same situations mirrored, the symbol climbing back ->
  final proof image -> lesson card.
- REPETITION: what repeats is the SYMBOL insert (the score), not the same scene. A place may
  come back only as the mirrored version of its situation in the recovery.
- LOCATIONS: 3-4 core locations that return in different states (friends there -> gone ->
  back) + 3-4 one-off places (6-8 in total). New locations compared with earlier videos.
- Before building, check the outline against CLARITY FIRST and VARIETY.
- A TRANSFORMATION TOKEN shows the change without words (e.g. a headband he puts on).
- For each scene list: shots with timings, captions, head pills, counter, sound effects,
  and the music.
- Build and check ONE clip at a time, then join all clips into one full video.
- Deliver ONLY the final joined video, once, in high quality, unless I ask for clips.
- Deliver 2 files only: (1) the video with all sound effects (generated SFX + instrument
  SFX) and the whisper, no background music; (2) the background music alone, same length.
  NO full-mix file - I mix them myself in CapCut (saves resources).
  Any sound made WITH AN INSTRUMENT AS AN EFFECT (demon brass swell, clap, cymbal, piano hit,
  timpani boom, celesta sparkle) belongs in file (1) with the video - never in the music file.
- Save limits: no extra test files, previews or duplicate versions unless I ask.
- Think like a film director: write each shot's angle AND its reason (wide = place,
  close-up = emotion, insert = detail, POV = what he sees).
- Pacing: shots usually hold 5-8 s with simple framing; cut when the story beat changes.
  Soft dissolves are fine between time jumps.
- Framing: mostly wide, full-body and medium (waist-up). Always show his whole head with
  space above it. No shots of only legs or feet. Inserts of an object held in his hand
  (test paper, phone, note) and top-down object inserts are fine and wanted for variety.
  Close-ups only for big emotions, head + shoulders.
- Characters ALWAYS have legs and feet (standing, walking or seated with legs hanging),
  unless the legs are hidden behind furniture or out of frame.

## Imagery (visual metaphor)
- One CENTRAL image carries the whole story and changes with it (the inner voice growing
  and shrinking, a wall getting higher, stairs he climbs). Add 1-3 more imagery moments
  at the low point and the turning point (e.g. climbing floating stairs and dashing through
  the inner voice; punching its words on a punching bag).
- Before each shot ask: would an image say this deeper than showing it literally?
- NEVER REPEAT THE SAME DEVICE: the patterns below are a toolbox, not a checklist. Think
  fresh for every video - sometimes a counter, sometimes an event/date, sometimes neither.
  Don't put the same trick (a drawing on the fridge, "Saturday", a match) in every story;
  find a new alternative that fits THIS story.
- Patterns learned from the 3 reference videos (use the patterns, never their stories):
  - A hurtful word HITS: it sticks on him as red handwriting, with a deep dark impact SFX,
    and he sinks. Later the demon repeats it in his head; the whisper speeds up and layers
    until the word fills the room (the low point).
  - A small reveal twist: the person who hurt him has forgotten / talks casually - the
    hero sees he repeated it to himself a thousand times (twist counter: THEY 1 / HE 515).
  - A symbolic object he throws away or breaks at the turning point (the thing he used
    against himself).
  - A mirror can show the demon while he is weak and his own smile at the end.
  - A DATE / EVENT set up early (a drawing on the fridge: "SATURDAY - MY FIRST MATCH"), so
    the viewer waits "will he go?"; he misses it, then gets a second chance (a new drawing:
    "THE FINAL") and makes it.
  - Bitter irony: he sees the moment he missed on the very thing that made him miss it.
  - A shock stat card at the low point ("7 HOURS A DAY = 106 DAYS A YEAR").
  - The fight montage shows ONE relapse (the counter jumps back up) - real, not instant.
  - The last line answers the first one ("one sec." -> "i saw it.").
  - The counter can BE the topic (SCREEN TIME TODAY), with the weekday bottom-right.
  - The same dark visual theme in every scene; red only for the demon and its words.

## Visual style
- 1920x1080, 30fps, thin black letterbox bars, soft film grain, subtle vignette.
- DEFAULT BACKGROUND LOOK (preferred, like classic 2D animation): a near-black / very dark
  room or street, objects drawn with thin soft grey line-art and dark fills (bed, door,
  sofa, fence, lockers), one or two lamps / windows / phones giving soft light pools, the
  characters as the only bright shapes. Simple, clean, cinematic.
- Alternative look, when a story needs a richer world: backgrounds FILLED with flat colour:
  - three layers: far (sky, skyline with lit windows), middle (fence, wall, lockers,
    shelves), near (floor with markings, bench, props);
  - visible light sources (street lamp, desk lamp, window, phone, sunrise) with a pool of
    light on the floor and soft shadows under the characters;
  - ONE dark visual theme for the whole video, every scene: dusk/night palette (deep
    purple-brown skies, dark walls, muted floors). Even happy or daytime scenes stay dim -
    never a fully bright scene, never pastel or sunny-bright backgrounds.
  - Brightness comes ONLY from light sources and their pools (street lamp, lit windows,
    lamp, spotlight, phone, sunrise glow); everything else stays dark and muted.
  - Never flat black or dull either: filled shapes, lit windows, warm light pools.
- ONE accent colour per video means the habit/struggle (e.g. orange glow, red) and is
  used everywhere it appears (the screen, the inner voice, the highlighted words).
- Lighting: cold blue = isolation and bad habits; warm amber = hope and good choices.
- Light must be REALISTIC: a phone lights only a small soft pool on the face and hands near it -
  never tint the whole body. Never colour a character's body with a light's colour.
- Hero (my own design, reference image references/hero.png): cream (#F3EBCF), round
  head, a young man's build (taller body, long chunky legs - never a small child), chunky arms, mitten hands, oval feet, dark thin
  outline NO wristband (props are decided per video). He is ONE smooth shape (like references/hero.png):
  one outline around the whole silhouette, arms grow out of the shoulders, legs flow out of the body,
  no seam lines at shoulders, wrists, hips or neck - never pieces joined like a robot. Dot eyes and simple eyebrows; emotion from eyebrows,
  eyelids, posture and movement speed. Keep him identical in every video.
- Hero LEGS AND FEET: simple straight legs, same width all the way down, a clear gap
  between them (never thick, joined or animal-like), and small flat oval feet under each
  leg - copy the legs and feet of references/hero.png exactly.
- NO ROBOT ARMS: the arms of the hero, the demon and every other character are never held
  dead straight. A resting arm hangs with a soft elbow bend, the two arms are never
  identical, and they always keep a small slow sway.
- The hero may get ONE scene prop now and then when it truly fits the moment (e.g. a cap
  on stage at the open mic, a scarf on a winter night) - never in every video or every scene.
- Supporting characters: the SAME tall young build as the hero (never small or chibi), grey
  or tan, each with ONE simple accessory - often a cap, or glasses, headband, scarf.
  Never beanies. Only a real small child in the story is drawn small.
- Women and girls (mom, sister, friend) get LONG HAIR with a ponytail behind (accessory
  'longhair') so they read as female at once. People at work wear a clear WORK UNIFORM
  (e.g. waitress dress + apron + name tag), so the workplace and their job read instantly.
- The first time a supporting character appears, the caption names who they are
  ("His mom worked till midnight."), and captions spell out their sacrifice plainly.
- Counter (HUD): only when the story truly needs one (never forced); top-left, small clean
  font, changes at key story moments.

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
  - CLICK STYLE (what works on YouTube): HEAVY hand-lettered brush font (Knewave), HUGE
    words that fill the width, white with a very thick black outline + a dark drop shadow, ONE key word in yellow, a red brush underline, slight
    tilt. The face is drawn just for the thumbnail: big white eyes with tiny pupils, worried
    brows, eye bags, sweat, tears, open mouth, a hand on the head; soft shading + a coloured
    rim light, rough hand-drawn edges, red stress marks, grainy dark background with one warm
    light. The story's prop sits big in front (receipt, phone, test paper) glowing red.
    The second character (if any) sits small in the warm light behind.
- Learn from other channels' PATTERNS only. Never copy their stories, characters, fonts or
  signature visuals. Never use self-harm, drugs or graphic images.
