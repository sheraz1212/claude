import React from 'react';
import {Easing, interpolate, Sequence} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {Apartment, GradCap, GradHall} from './sets';
import {cl, Pal, YearClip} from './common';
import {C, sec} from '../common/theme';

/*
 Backwards — Clip 6 (35 s): 2026, graduation. The moment it all started. Then the film FREEZES.
  1 0–4      WIDE caps fly, confetti                         → the happiest day
  2 4–7.5    MEDIUM friend hugs him                          → their friendship at its best
  3 7.5–11   MEDIUM two-shot: "Coffee tomorrow?"             → the invite
  4 11–14.5  CLOSE he hesitates, looks away                  → the habit begins
  5 14.5–18  MEDIUM two-shot: "Maybe later." smile drops     → the first "no"
  6 18–21.5  WIDE friend walks away into the crowd           → the distance starts
  7 21.5–25  FREEZE: the world stops, colour drains          → "It started here."
  8 25–28.5  CLOSE only HE can move, he looks around         → he realises
  9 28.5–31.5 WIDE ghost of the empty 2031 room over the hall → the future he saw
  10 31.5–35 black chapter card: "But it's still 2026."     → hope
*/
const io = Easing.inOut(Easing.cubic);
const GRADS = [
  {x: 420, c: TAN, a: 'glasses' as const},
  {x: 1500, c: '#a6a9b0', a: 'headphones' as const},
];

const Hall: React.FC<{t: number; s: number; cx: number; cy?: number; hug?: number; heroExpr?: object; palExpr?: object; palX?: number; freeze?: number; caps?: number}> = ({t, s, cx, cy = 600, hug = 0, heroExpr = {}, palExpr = {}, palX = 1080, freeze = 0, caps = 0}) => {
  const tt = freeze > 0 ? 21.5 : t;
  const capY = caps > 0 ? -Math.sin(Math.min(1, caps) * Math.PI) * 300 : 0;
  return (
    <Stage>
      <Cam s={s} cx={cx} cy={cy}>
        <g style={{filter: freeze > 0 ? `grayscale(${freeze * 0.85}) brightness(${1 - freeze * 0.25})` : undefined}}>
          <GradHall t={tt} confetti={caps > 0 ? caps : 0}>
            {GRADS.map((g, i) => (
              <g key={g.x}>
                <Person id={`gr${i}`} x={g.x} y={FLOOR} showLegs color={g.c} accessory={g.a} accessoryColor="#e07b8a" lHand={[-90, caps > 0 && caps < 1 ? -380 : -120]} rHand={[90, caps > 0 && caps < 1 ? -380 : -120]} expr={{mouth: 1, eyeX: i ? -12 : 12, eyeY: caps > 0 ? -10 : 0}} />
                <GradCap x={g.x} y={FLOOR + capY} />
              </g>
            ))}
            <Pal x={palX - hug * 60} y={FLOOR} showLegs lHand={hug ? [-150, -230] : [-90, -120]} rHand={[90, -120]} headTilt={hug * -8} expr={{mouth: 1, eyeX: -12, ...palExpr}} blink={freeze ? 0 : blinkAt(tt, [9.2, 16.6])} />
            <GradCap x={palX - hug * 60} y={FLOOR + capY} tilt={hug * -8} />
          </GradHall>
        </g>
        <Hero id="hg" x={840} y={FLOOR} showLegs lHand={[-90, -120]} rHand={hug ? [150, -230] : [90, -120]} headTilt={hug * 8} expr={{mouth: 0.8, eyeX: 12, ...heroExpr}} blink={freeze ? 0 : blinkAt(t, [6.0, 12.6, 19.4])} />
        <GradCap x={840} y={FLOOR + capY} tilt={hug * 8} />
      </Cam>
    </Stage>
  );
};

const shots = (t: number): React.ReactNode => {
  if (t < 4) return <Hall t={t} s={1.0} cx={960} caps={interpolate(t, [0.4, 3.6], [0.01, 1.4], cl)} />;
  if (t < 7.5) return <Hall t={t} s={1.5} cx={960} hug={interpolate(t, [4.4, 5.2, 6.6, 7.3], [0, 1, 1, 0], {...cl, easing: io})} heroExpr={{lid: 0.4, mouth: 1}} palExpr={{lid: 0.4}} />;
  if (t < 11) return <Hall t={t} s={1.7} cx={960} palExpr={{mouth: 0.8, brow: -0.1}} />;
  if (t < 14.5) {
    const away = interpolate(t, [11.6, 12.4], [0, 1], cl);
    return (
      <Stage>
        <g opacity={0.45}>
          <GradHall t={t} />
        </g>
        <Hero id="hc" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: 0.3, mouth: 0.2 - away * 0.3, eyeX: -14 * away, eyeY: 6 * away}} blink={blinkAt(t, [13.6])} />
        <GradCap x={1000} y={1080} s={1.75} />
      </Stage>
    );
  }
  if (t < 18) {
    const drop = interpolate(t, [16.0, 16.8], [0, 1], cl);
    return <Hall t={t} s={1.7} cx={960} heroExpr={{mouth: 0.3, eyeX: -6, brow: 0.2}} palExpr={{mouth: 0.8 - drop * 0.9, brow: drop * 0.4}} />;
  }
  if (t < 21.5) return <Hall t={t} s={1.0} cx={960} palX={interpolate(t, [18.3, 21.5], [1080, 1750], cl)} heroExpr={{mouth: 0, eyeX: 14}} palExpr={{mouth: 0, eyeX: 12}} />;
  if (t < 25) return <Hall t={t} s={1.0} cx={960} palX={1750} freeze={interpolate(t, [21.5, 22.2], [0, 1], cl)} heroExpr={{mouth: 0, eyeX: 14}} palExpr={{mouth: 0, eyeX: 12}} />;
  if (t < 28.5) {
    const look = Math.sin((t - 25) * 1.8);
    return (
      <Stage>
        <g opacity={0.45} style={{filter: 'grayscale(0.85) brightness(0.75)'}}>
          <GradHall t={21.5} />
        </g>
        <Hero id="hf" x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={look * 6} expr={{brow: 0.6, lid: 0, mouth: -0.2, eyeX: look * 16}} blink={blinkAt(t, [27.2])} />
        <GradCap x={1000} y={1080} s={1.75} tilt={look * 6} />
      </Stage>
    );
  }
  const ghost = interpolate(t, [28.6, 30.5], [0, 0.5], cl);
  return (
    <Stage>
      <Hall t={t} s={1.0} cx={960} palX={1750} freeze={1} heroExpr={{mouth: -0.3, eyeX: 0, brow: 0.7}} palExpr={{mouth: 0, eyeX: 12}} />
      <g opacity={ghost} style={{mixBlendMode: 'screen'}}>
        <Apartment t={t} lamp={0.3} />
      </g>
    </Stage>
  );
};

export const BackClip6: React.FC = () => (
  <YearClip year="2026" prev="2026" shots={shots} noRewind>
    <Sequence from={sec(0.8)} durationInFrames={sec(3.0)}>
      <Caption text="Graduation day. Best **friends**." dur={sec(3.0)} />
    </Sequence>
    <Sequence from={sec(8.0)} durationInFrames={sec(2.8)}>
      <HeadPill text="Coffee tomorrow?" x={960 + (1080 - 960) * 1.7} y={600 + (FLOOR - 470 - 600) * 1.7 - 10} dur={sec(2.8)} />
    </Sequence>
    <Sequence from={sec(15.0)} durationInFrames={sec(2.8)}>
      <HeadPill text="Maybe later." x={960 + (840 - 960) * 1.7} y={600 + (FLOOR - 470 - 600) * 1.7 - 10} dur={sec(2.8)} />
    </Sequence>
    <Sequence from={sec(22.2)} durationInFrames={sec(2.7)}>
      <Caption text="It started **here**." dur={sec(2.7)} highlight={C.coldLight} />
    </Sequence>
    <Sequence from={sec(31.5)} durationInFrames={sec(3.5)}>
      <BlackCard text="But it's still 2026." dur={sec(3.5)} />
    </Sequence>
    {/* MUSIC */}
    <Sfx at={0} src="music/grad-fanfare.wav" vol={0.55} />
    <Sfx at={5.5} src="music/dream-piano.wav" vol={0.35} dur={9} />
    <Sfx at={15.2} src="music/low-note.wav" vol={0.55} />
    <Sfx at={21.5} src="music/freeze-pad.wav" vol={0.5} />
    <Sfx at={31.5} src="music/impact-low.wav" vol={0.7} />
    {/* SFX */}
    <Sfx at={0.5} src="sfx/confetti-pop.wav" vol={0.6} />
    <Sfx at={0.7} src="sfx/far-cheer.wav" vol={0.6} />
    <Sfx at={4.6} src="sfx/cloth.wav" vol={0.5} />
    <Sfx at={18.3} src="sfx/steps-hard.wav" vol={0.3} dur={3} />
    <Sfx at={21.5} src="sfx/glass-hum.wav" vol={0.3} dur={3} />
  </YearClip>
);
