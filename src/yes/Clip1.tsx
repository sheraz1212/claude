import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Stage, TAN} from '../common/sets';
import {Backpack, Canteen, Chair, Tray} from './canteen';
import {C, FPS, sec} from '../common/theme';

/*
 The One Who Always Said Yes — Clip 1 (35 s): the canteen. MUSIC: none (room sound only).
 Shot list (angle → why):
  1  0–4     black hook                          → curiosity
  2  4–8     WIDE canteen, friends laughing      → place + the group he wants to be part of
  3  8–11.5  MEDIUM, hero walks in with tray     → hope on his face
  4  11.5–14.5 LOW INSERT empty chair + bag      → the problem, from his eye-line
  5  14.5–18 CLOSE-UP hero                       → smile freezes
  6  18–21.5 OVER-THE-SHOULDER (his back)        → what he faces: friend holds out a cup
  7  21.5–25 INSERT cup between their hands      → the choice
  8  25–28.5 CLOSE-UP hero                       → looks at chair, forces a smile
  9  28.5–31.5 MEDIUM two-shot, he takes the cup → YES: 1
  10 31.5–35 WIDE from far, alone to the counter → isolation inside the group
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const HOPE = {brow: -0.1, mouth: 0.6, eyeX: 8};

const Shots: React.FC<{t: number}> = ({t}) => {
  // 2 — wide
  if (t < 8)
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 8], [1.0, 1.03], cl)} cx={900} cy={560}>
          <Canteen t={t} />
        </Cam>
      </Stage>
    );
  // 3 — medium: he walks in
  if (t < 11.5) {
    const x = interpolate(t, [8, 11.2], [2000, 1440], {...cl, easing: Easing.out(Easing.quad)});
    return (
      <Stage>
        <Cam s={1.4} cx={1250} cy={580}>
          <Canteen t={t}>
            <Hero id="h3" x={x} y={FLOOR + 40} showLegs walk={t < 11.2 ? t * 6.5 : undefined} lHand={[-70, -150]} rHand={[70, -150]} expr={{...HOPE, eyeX: -12}} blink={blinkAt(t, [10.2])} />
            <Tray x={x} y={FLOOR + 40} />
          </Canteen>
        </Cam>
      </Stage>
    );
  }
  // 4 — medium-wide: he stops right next to the chair with the bag
  if (t < 14.5) {
    return (
      <Stage>
        <Cam s={interpolate(t, [11.5, 14.5], [1.55, 1.6], cl)} cx={1300} cy={600}>
          <Canteen t={t} laugh={0.8}>
            <Hero id="h4" x={1440} y={FLOOR + 40} showLegs lHand={[-70, -150]} rHand={[70, -150]} headTilt={6} expr={{brow: 0.1, mouth: 0.3, eyeX: -14, eyeY: 10}} blink={blinkAt(t, [13.8])} />
            <Tray x={1440} y={FLOOR + 40} />
          </Canteen>
        </Cam>
      </Stage>
    );
  }
  // 5 & 8 — close-ups
  if (t < 18 || (t >= 25 && t < 28.5)) {
    const first = t < 18;
    const freeze = first ? interpolate(t, [15.0, 15.8], [0, 1], cl) : 1;
    const force = first ? 0 : interpolate(t, [26.6, 27.4], [0, 1], {...cl, easing: io});
    const look = first ? interpolate(t, [15.8, 16.6], [0, 1], cl) : interpolate(t, [25.2, 26.0, 26.6], [0, 1, 0], cl);
    return (
      <Stage>
        <Light id="cu" x={1000} y={380} r={800} color="#9fb4d6" o={0.4} />
        <Cam s={first ? interpolate(t, [14.5, 18], [1.0, 1.03], cl) : interpolate(t, [25, 28.5], [1.08, 1.1], cl)} cx={1000} cy={first ? 560 : 520}>
          <g opacity={0.45}>
            <Canteen t={t} friends={false} />
          </g>
          <Hero
            id="hcu"
            x={1000}
            y={1080}
            scale={1.75}
            headTilt={first ? 0 : -5}
            lHand={[-70, -150]}
            rHand={[70, -150]}
            expr={{brow: freeze * 0.5 - force * 0.3, mouth: 0.6 - freeze * 0.7 + force * 0.8, eyeX: 14 * look, eyeY: 6 * look, lid: force * 0.25}}
            blink={blinkAt(t, [17.2, 28.0])}
          />
          <Tray x={1000} y={1080} s={1.75} />
        </Cam>
      </Stage>
    );
  }
  // 6 — medium: the friend looks up and holds out the empty cup
  if (t < 21.5) {
    const hold = interpolate(t, [18.6, 19.4], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.6} cx={560} cy={600}>
          <Canteen t={t} laugh={0.3} f1Cup={hold} />
        </Cam>
      </Stage>
    );
  }
  // 7 — two-shot: the cup between them, his hand hesitates
  if (t < 25) {
    const hover = interpolate(t, [22.2, 23.6], [0, 1], {...cl, easing: io});
    const shake = Math.sin(t * 30) * 3 * hover;
    return (
      <Stage>
        <Cam s={1.5} cx={560} cy={580}>
          <Canteen t={t} laugh={0.3} f1Cup={1} />
          <Hero id="h7" x={760} y={FLOOR + 40} showLegs lHand={[-70, -150]} rHand={[interpolate(hover, [0, 1], [70, -40]) + shake, interpolate(hover, [0, 1], [-150, -230])]} headTilt={-4} expr={{brow: 0.4, mouth: 0, eyeX: -12, eyeY: 2}} blink={blinkAt(t, [24.2])} />
          <Tray x={760} y={FLOOR + 40} />
        </Cam>
      </Stage>
    );
  }
  // 9 — two-shot: he takes the cup
  if (t < 31.5) {
    const take = interpolate(t, [29.0, 29.8], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.7} cx={560} cy={540}>
          <Canteen t={t} laugh={0.5} f1Cup={1 - take} />
          <Hero id="h9" x={720} y={FLOOR + 40} showLegs lHand={[-70, -150]} rHand={take > 0.5 ? [70, -150] : [interpolate(take, [0, 1], [-60, 70]), interpolate(take, [0, 1], [-260, -150])]} rHold={take > 0.5 ? 'cup' : 'none'} expr={{brow: 0.2, mouth: 0.4, eyeX: -12}} blink={blinkAt(t, [30.6])} />
          <Tray x={720} y={FLOOR + 40} />
        </Cam>
      </Stage>
    );
  }
  // 10 — wide from far: he goes alone to the counter
  const x = interpolate(t, [31.5, 35], [860, 1440], cl);
  return (
    <Stage>
      <Cam s={0.92} cx={960} cy={560}>
        <Canteen t={t} />
        <Hero id="h10" x={x} y={FLOOR + 20} scale={0.85} showLegs walk={t * 6} lHand={[-70, -150]} rHand={[70, -150]} expr={{brow: 0.3, mouth: 0.2, eyeX: 12}} />
        <Tray x={x} y={FLOOR + 20} s={0.85} />
      </Cam>
    </Stage>
  );
};

export const YesClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Counter label="YES" showFrom={sec(4.4)} changes={[[0, '0'], [sec(29.6), '1']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He never said no." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(8.4)} durationInFrames={sec(3.0)}>
        <Caption text="He just wanted a **seat**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(19.2)} durationInFrames={sec(2.2)}>
        <HeadPill text="Grab me one?" x={560 + (380 - 560) * 1.6} y={600 + (390 - 600) * 1.6 - 10} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(31.8)} durationInFrames={sec(3.1)}>
        <Caption text="Being useful felt like **belonging**." dur={sec(3.1)} />
      </Sequence>
      {/* SFX (MUSIC: none) — only on visible events */}
      {/* distant canteen ambience: soft bed, quieter in the close-ups */}
      <Sequence from={sec(4)}>
        <Audio
          src={staticFile('sfx/canteen-ambience.wav')}
          volume={(f) => {
            const tt = 4 + f / FPS;
            const close = (tt > 14.5 && tt < 18) || (tt > 21.5 && tt < 28.5);
            return interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'}) * (close ? 0.35 : 0.8);
          }}
        />
      </Sequence>
      <Sfx at={4.7} src="sfx/group-laugh.wav" vol={0.55} />
      <Sfx at={6.3} src="sfx/cutlery.wav" vol={0.5} />
      <Sfx at={8.2} src="sfx/steps-hard.wav" vol={0.5} dur={3.0} />
      <Sfx at={11.15} src="sfx/tray-rattle.wav" vol={0.6} />
      <Sfx at={12.3} src="sfx/shoe-squeak.wav" vol={0.5} />
      <Sfx at={15.2} src="sfx/heart-thump.wav" vol={0.55} />
      <Sfx at={18.6} src="sfx/cloth.wav" vol={0.5} />
      <Sfx at={22.3} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={29.7} src="sfx/cup-crinkle.wav" vol={0.7} />
      <Sfx at={31.7} src="sfx/steps-hard.wav" vol={0.4} dur={3.2} />
      <Sfx at={32.4} src="sfx/group-laugh.wav" vol={0.3} />
      {/* BGM score */}
      <Sfx at={4.0} src="music/light-campus.wav" vol={0.45} />
      <Sfx at={14.6} src="music/small-sad.wav" vol={0.5} />
      <Sfx at={21.6} src="music/low-note.wav" vol={0.45} />
      <Sfx at={28.0} src="music/light-campus-minor.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
