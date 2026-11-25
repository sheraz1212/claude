import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob} from '../common/Blob';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {FlyingPhoto, Photo, PINK, PINK_L, Room, SPOTS} from './sets';

/*
 THE WALL — Clip 2 (33 s): the habit repeats (same bed shot, counter jumping).
  0–7    WIDE night: scroll, PING x9, photos fly; the Blob pins one himself: "you're behind."
  7–13   INSERT the plant: the wall's shadow creeps over it
  13–20  WIDE day 30: the wall is full, frames creep onto the window
  20–27  MEDIUM he holds up his own drawing next to a huge trophy photo … crumples it
  27–33  WIDE the frames cover the window; the room goes dark pink
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** photos pinned by time t, flying ones handled separately: schedule = [[time, index], ...] */
const sched = (t: number, list: number[], from: number, step: number) => {
  let n = 0;
  list.forEach((_, i) => {
    if (t >= from + i * step + 0.7) n = i + 1;
  });
  return n;
};

const Bed: React.FC<{t: number; day: number; photos: number; fly: [number, number][]; blob: number; grow?: number; wilt?: number; drawing?: boolean; brow?: number}> = ({t, day, photos, fly, blob, grow = 0.18, wilt = 0, drawing = true, brow = 0.2}) => (
  <>
    <Room t={t} day={day} grow={grow} wilt={wilt} photos={photos} phone={0.8} drawing={drawing} />
    <Blob id="b" x={900} y={694} t={t} size={blob} accent={PINK} lean={-0.8} eyeX={-10} smile={1} glow={0.9} />
    <Hero id="h" x={650} y={742} scale={0.9} sit pose="phone" glow={0.8} glowColor={PINK} thumb={Math.sin(t * 6) > 0.6 ? 1 : 0}
      expr={{brow, lid: 0.35, mouth: -0.1, eyeY: 12, bags: day < 0.5}} blink={blinkAt(t, [3.1, 16.4, 30.2])} />
    {fly.map(([idx, k]) => <FlyingPhoto key={idx} idx={idx} k={k} fx={650} fy={580} />)}
  </>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const extra = sched(t, [3, 4, 5, 6, 7, 8, 9, 10], 0.6, 0.55);
    const fly: [number, number][] = [3, 4, 5, 6, 7, 8, 9, 10].map((idx, i) => [idx, interpolate(t, [0.6 + i * 0.55, 1.3 + i * 0.55], [0, 1], cl)]);
    const blobPin = interpolate(t, [5.2, 6.0], [0, 1], cl);
    return (
      <Stage>
        <Bed t={t} day={0} photos={3 + extra + (t > 6 ? 1 : 0)} fly={fly} blob={0.5} />
        {blobPin > 0 && blobPin < 1 && <Photo x={900 + (SPOTS[11].x - 900) * blobPin} y={560 + (SPOTS[11].y - 560) * blobPin} w={SPOTS[11].w} icon={SPOTS[11].icon} glow={1} />}
      </Stage>
    );
  }
  if (t < 13) {
    const shade = interpolate(t, [7, 13], [0, 1], cl);
    return (
      <Stage>
        <Cam s={2.4} cx={1520} cy={520}>
          <Room t={t} day={1} grow={0.18} photos={12} />
          <path d={`M ${1200 + shade * 120} 0 L ${1250 + shade * 330} 0 L ${1250 + shade * 330} 1080 L ${1200 + shade * 120} 1080 Z`} fill="#2a0f22" opacity={0.45} />
          <rect x={1100} y={0} width={100 + shade * 120} height={1080} fill="#2a0f22" opacity={0.45} />
        </Cam>
      </Stage>
    );
  }
  if (t < 20) {
    const list = [24, 25, 26, 27];
    const n = sched(t, list, 14.5, 1.1);
    const fly: [number, number][] = list.map((idx, i) => [idx, interpolate(t, [14.5 + i * 1.1, 15.2 + i * 1.1], [0, 1], cl)]);
    return (
      <Stage>
        <Bed t={t} day={1} photos={24 + n} fly={fly} blob={0.75} grow={0.18} wilt={0.1} brow={0.35} />
      </Stage>
    );
  }
  if (t < 27) {
    const crumple = interpolate(t, [24.2, 25.0], [0, 1], cl);
    const big = SPOTS[3];
    return (
      <Stage>
        <Cam s={1.55} cx={620} cy={430}>
          <Room t={t} day={1} grow={0.18} wilt={0.15} photos={28} drawing={false} />
          <Photo x={big.x} y={big.y} w={big.w * 1.6} r={big.r} icon={3} glow={1} />
          <Blob id="b" x={900} y={694} t={t} size={0.8} accent={PINK} lean={-0.8} eyeX={-10} smile={1} glow={0.9} />
          <Hero id="h" x={650} y={742} scale={0.9} sit pose="arms-down" rHand={[110 - crumple * 60, -300 + crumple * 140]}
            expr={{brow: 0.3 + crumple * 0.4, lid: 0.2, mouth: -0.3 * crumple, eyeX: t < 23 ? -6 : 14, eyeY: -14}} />
          {crumple < 1 ? (
            <g transform={`translate(${650 + 99 - crumple * 54} ${742 - 270 + crumple * 126}) scale(${1 - crumple * 0.75})`}>
              <rect x={-55} y={-130} width={110} height={130} fill="#f7f1e3" stroke={C.outline} strokeWidth={3} />
              <path d="M 0 -20 q -4 -40 0 -70 M 0 -60 q -20 -10 -30 -2 M 0 -75 q 18 -12 28 -4" stroke="#5e9e5a" strokeWidth={5} fill="none" />
            </g>
          ) : (
            <circle cx={650 + 45} cy={742 - 144} r={18} fill="#e9e1cc" stroke={C.outline} strokeWidth={3} />
          )}
        </Cam>
      </Stage>
    );
  }
  const list = [28, 29, 30, 31, 32, 33, 34, 35, 36];
  const n = sched(t, list, 27.2, 0.45);
  const fly: [number, number][] = list.map((idx, i) => [idx, interpolate(t, [27.2 + i * 0.45, 27.9 + i * 0.45], [0, 1], cl)]);
  return (
    <Stage>
      <Bed t={t} day={1} photos={28 + n} fly={fly} blob={0.95} wilt={interpolate(t, [29, 33], [0.15, 0.4], cl)} drawing={false} brow={0.6} />
    </Stage>
  );
};

export const WallClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c1 = (k: number) => String(k);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="PHOTOS ON THE WALL" showFrom={0} changes={[[0, '3'], [sec(3), '8'], [sec(6), c1(12)], [sec(15.2), '24'], [sec(18.5), '28'], [sec(29), '33'], [sec(31), '37']]} />
      <Sequence from={sec(4.4)} durationInFrames={sec(2.4)}>
        <HeadPill text="you're behind." x={900} y={430} dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(7.6)} durationInFrames={sec(4.8)}>
        <Caption text="The wall got **taller**." dur={sec(4.8)} highlight={PINK_L} />
      </Sequence>
      <Sequence from={sec(14.0)} durationInFrames={sec(5.4)}>
        <Caption text="Their best days. **Every** day." dur={sec(5.4)} highlight={PINK_L} />
      </Sequence>
      <Sequence from={sec(20.6)} durationInFrames={sec(3.4)}>
        <Caption text="His own wins looked **small**." dur={sec(3.4)} highlight={PINK_L} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(4.2)}>
        <Caption text="Then the light was **gone**." dur={sec(4.2)} highlight={PINK_L} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/sneaky-bassoon.wav" vol={0.7} dur={33} fadeIn={0.6} fadeOut={1.5} />
      {/* SFX */}
      {[0.6, 1.15, 1.7, 2.25, 2.8, 3.35, 3.9, 4.45].map((a, i) => (
        <Sfx key={i} at={a} src="sfx/ping-photo.wav" vol={0.3} />
      ))}
      {[1.3, 1.85, 2.4, 2.95, 3.5, 4.05, 4.6, 5.15].map((a, i) => (
        <Sfx key={`p${i}`} at={a} src="sfx/pin-in.wav" vol={0.35} />
      ))}
      <Sfx at={4.4} src="sfx/voice/inner-youre-behind.wav" vol={0.75} />
      <Sfx at={6.0} src="sfx/pin-in.wav" vol={0.5} />
      {[15.2, 16.3, 17.4, 18.5].map((a, i) => (
        <Sfx key={`q${i}`} at={a} src="sfx/pin-in.wav" vol={0.4} />
      ))}
      <Sfx at={24.2} src="sfx/crumple.wav" vol={0.6} />
      <Sfx at={27.2} src="sfx/frames-rattle.wav" vol={0.5} />
      <Sfx at={30.6} src="sfx/low-hum.wav" vol={0.3} dur={2.4} />
    </AbsoluteFill>
  );
};
