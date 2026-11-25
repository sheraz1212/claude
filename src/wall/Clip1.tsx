import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob} from '../common/Blob';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {FlyingPhoto, PINK, PINK_L, Room} from './sets';

/*
 THE WALL — Clip 1 (32 s): hook + normal life + the habit starts.
  0–4    BLACK hook
  4–10   WIDE room, morning: he waters a tiny sprout on the sunny sill          → his world
  10–16  MEDIUM he points at one new leaf, proud                                 → small joy
  16–22  WIDE he sits on the bed with the phone; PING, a pink photo flies to the bare wall
  22–27  MEDIUM a tiny Blob slides up beside him: "look at them."
  27–32  WIDE two more photos pin up; he glances at the sprout, then away
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const WateringCan: React.FC<{x: number; y: number; tilt: number}> = ({x, y, tilt}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    <rect x={-34} y={-26} width={60} height={46} rx={10} fill="#5e9e95" stroke={C.outline} strokeWidth={4} />
    <path d="M 26 -14 L 66 -36" stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
    <path d="M 26 -14 L 66 -36" stroke="#5e9e95" strokeWidth={6} strokeLinecap="round" />
    <path d="M -34 -16 q -22 4 -18 22 q 4 12 18 8" stroke={C.outline} strokeWidth={5} fill="none" />
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const tilt = interpolate(t, [5.2, 5.8, 8.2, 8.8], [0, 35, 35, 0], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1, 1.04], cl)} cx={1300} cy={560}>
          <Room t={t} day={1} grow={0.1} />
          <ellipse cx={1330} cy={902} rx={80} ry={12} fill="#000" opacity={0.25} />
          <Hero id="h" x={1330} y={900} scale={0.9} pose="arms-down" rHand={[150, -270]} expr={{brow: -0.1, lid: 0.15, mouth: 0.5, eyeX: 14, eyeY: -4}} blink={blinkAt(t, [7.1])} />
          <WateringCan x={1330 + 150 * 0.9 + 10} y={900 - 270 * 0.9} tilt={tilt} />
          {tilt > 20 && [0, 1, 2, 3].map((i) => <line key={i} x1={1545 + i * 4} y1={600 + ((t * 300 + i * 13) % 30)} x2={1545 + i * 4} y2={610 + ((t * 300 + i * 13) % 30)} stroke="#8fc7ec" strokeWidth={3} />)}
        </Cam>
      </Stage>
    );
  }
  if (t < 16) {
    const leaf = interpolate(t, [11, 12.5], [0.1, 0.18], cl);
    return (
      <Stage>
        <Cam s={1.8} cx={1480} cy={560}>
          <Room t={t} day={1} grow={leaf} />
          <Hero id="h" x={1400} y={900} scale={0.9} pose="arms-down" rHand={[150, -260]} expr={{brow: -0.2, lid: 0.1, mouth: 0.75, eyeX: 16, eyeY: -2}} blink={blinkAt(t, [14.3])} />
        </Cam>
      </Stage>
    );
  }
  const photos = t < 18.9 ? 0 : t < 28.3 ? 1 : t < 29.6 ? 2 : 3;
  const scroll = Math.sin(t * 6) > 0.6 ? 1 : 0;
  const hero = (look = 0) => (
    <Hero id="h" x={650} y={742} scale={0.9} sit pose="phone" glow={0.7} glowColor={PINK} thumb={scroll}
      expr={{brow: t > 30 ? 0.4 : 0.1, lid: 0.25, mouth: t > 30 ? -0.2 : 0.1, eyeY: look ? -10 : 12, eyeX: look}} blink={blinkAt(t, [20.8, 26.2])} />
  );
  const room = <Room t={t} day={1} grow={0.18} photos={photos} phone={0.6} />;
  const flies = (
    <>
      <FlyingPhoto idx={0} k={interpolate(t, [18.1, 18.9], [0, 1], cl)} fx={650} fy={580} />
      <FlyingPhoto idx={1} k={interpolate(t, [27.5, 28.3], [0, 1], cl)} fx={650} fy={580} />
      <FlyingPhoto idx={2} k={interpolate(t, [28.8, 29.6], [0, 1], cl)} fx={650} fy={580} />
    </>
  );
  if (t < 22 || t >= 27) {
    const look = t > 30.2 && t < 31.2 ? 18 : t > 29.8 ? -10 : 0;
    return (
      <Stage>
        {room}
        <Blob id="b" x={900} y={694} t={t} size={t >= 27 ? 0.32 : 0.001} accent={PINK} lean={-0.7} eyeX={-8} smile={0.9} opacity={t >= 27 ? 1 : 0} />
        {hero(look)}
        {flies}
      </Stage>
    );
  }
  const grow = interpolate(t, [22.4, 23.6], [0, 1], {...cl, easing: Easing.out(Easing.back(1.5))});
  return (
    <Stage>
      <Cam s={1.5} cx={720} cy={500}>
        {room}
        {grow > 0.01 && <Blob id="b" x={900} y={694} t={t} size={0.32 * grow} accent={PINK} lean={-0.7} eyeX={-8} smile={0.9} />}
        {hero()}
      </Cam>
    </Stage>
  );
};

export const WallClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Counter label="PHOTOS ON THE WALL" showFrom={sec(18.9)} changes={[[0, '1'], [sec(28.3), '2'], [sec(29.6), '3']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="Everyone was **ahead**." dur={sec(4)} highlight={PINK_L} />
      </Sequence>
      <Sequence from={sec(4.6)} durationInFrames={sec(3.6)}>
        <Caption text="He grew things." dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(8.4)} durationInFrames={sec(1.6)}>
        <Caption text="Slowly." dur={sec(1.6)} />
      </Sequence>
      <Sequence from={sec(11.6)} durationInFrames={sec(4)}>
        <Caption text="One **leaf** at a time." dur={sec(4)} highlight="#9fe08a" />
      </Sequence>
      <Sequence from={sec(19.2)} durationInFrames={sec(2.7)}>
        <Caption text="Then he **looked** up." dur={sec(2.7)} highlight={PINK_L} />
      </Sequence>
      <Sequence from={sec(24.0)} durationInFrames={sec(2.8)}>
        <HeadPill text="look at them." x={890} y={330} dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(29.8)} durationInFrames={sec(2.2)}>
        <Caption text="Everyone was **bigger**." dur={sec(2.2)} highlight={PINK_L} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={2.5} src="music/light-marimba.wav" vol={0.7} dur={19} fadeIn={1.5} fadeOut={1.2} />
      <Sfx at={20.6} src="music/sneaky-musicbox.wav" vol={0.6} fadeIn={0.8} />
      {/* SFX */}
      <Sfx at={4.2} src="sfx/birds.wav" vol={0.15} dur={6} fadeOut={1} />
      <Sfx at={5.5} src="sfx/watering.wav" vol={0.45} />
      <Sfx at={12.4} src="sfx/pat.wav" vol={0.3} />
      <Sfx at={16.3} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={18.0} src="sfx/ping-photo.wav" vol={0.45} />
      <Sfx at={18.1} src="sfx/photo-fly.wav" vol={0.4} />
      <Sfx at={18.9} src="sfx/pin-in.wav" vol={0.5} />
      <Sfx at={22.5} src="sfx/goo.wav" vol={0.45} />
      <Sfx at={27.4} src="sfx/ping-photo.wav" vol={0.4} />
      <Sfx at={28.3} src="sfx/pin-in.wav" vol={0.45} />
      <Sfx at={28.7} src="sfx/ping-photo.wav" vol={0.4} />
      <Sfx at={29.6} src="sfx/pin-in.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
