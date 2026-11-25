import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, DiningSet, Dog, FLOOR, GREY, Light, Person, SCARF, Stage, TAN, Tree} from '../common/sets';
import {C, FPS, H, W, sec} from '../common/theme';

// Part 6 — Warm ending + end card (3:05–3:40). MUSIC: hopeful-guitar (continues from Part 5, file offset 7 s).

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

/* 6.1 — dinner with Mom, phone face-down (0–8) */
const Dinner: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [0, 8], [1.02, 1.07], cl);
  const talk = t > 4.0 && t < 7.6;
  const g = talk ? Math.sin(t * 5) : 0;
  const momTalk = t > 0.6 && t < 3.2 ? Math.abs(Math.sin(t * 9)) * 0.3 : 0;
  const laugh = interpolate(t, [6.0, 6.4, 7.4], [0, 1, 0.6], cl);
  return (
    <Stage>
      <Cam s={s} cx={960} cy={560}>
        <DiningSet
          t={t}
          warm={1}
          onTable={
            <g>
              <rect x={1262} y={684} width={92} height={16} rx={6} fill="#2a2f37" stroke="#7a8393" strokeWidth={3} />
              <circle cx={1274} cy={692} r={3} fill="#7a8393" />
            </g>
          }
        >
          <Person
            id="mom61"
            x={720}
            y={820}
            color={TAN}
            accessory="glasses"
            lHand={[-60, -128]}
            rHand={[64, -128]}
            headTilt={5 + laugh * 4}
            expr={{mouth: 0.7 + momTalk + laugh * 0.3, eyeX: 10, lid: laugh * 0.5}}
            blink={blinkAt(t, [2.4, 5.2])}
          />
          <Hero
            id="h61"
            x={1200}
            y={820}
            lHand={talk ? [-70 + g * 10, -200 - Math.abs(g) * 30] : [-60, -128]}
            rHand={talk ? [80 - g * 8, -190 - Math.abs(g) * 20] : [64, -128]}
            headTilt={-5 + laugh * -3}
            expr={{brow: -0.1, mouth: 0.6 + laugh * 0.3, eyeX: -12, lid: laugh * 0.5}}
            blink={blinkAt(t, [1.6, 7.2])}
          />
        </DiningSet>
      </Cam>
    </Stage>
  );
};

/* 6.2 — park: throwing the ball for the dog (8–16) */
const Park: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [8, 16], [1.05, 1.1], cl);
  const wind = interpolate(t, [9.2, 9.6], [0, 1], {...cl, easing: io});
  const thr = interpolate(t, [9.6, 10.0], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const ballT = interpolate(t, [10.0, 11.4], [0, 1], cl);
  const ballX = 760 + ballT * 1300;
  const ballY = 480 - Math.sin(ballT * Math.PI) * 300 + ballT * 300;
  const dogRun = interpolate(t, [10.2, 12.8], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const dogX = t < 10.2 ? 1000 + Math.sin(t * 3) * 6 : 1000 + dogRun * 1300;
  const hand: [number, number] = thr > 0 ? [interpolate(thr, [0, 1], [130, 120]), interpolate(thr, [0, 1], [-420, -260])] : [interpolate(wind, [0, 1], [80, 130]), interpolate(wind, [0, 1], [-150, -420])];
  return (
    <Stage>
      <Cam s={s} cx={900} cy={600}>
        <Light id="p62w" x={1100} y={420} r={1100} color={C.amber} o={1} />
        <Tree x={240} s={1.15} warm={1} />
        <Tree x={1700} s={1.25} warm={1} />
        <Person
          id="friend62"
          x={1300}
          y={FLOOR}
          showLegs
          color={GREY}
          accessory="scarf"
          accessoryColor={SCARF}
          lHand={[-80, -150 + Math.sin(t * 6) * 6]}
          rHand={[96, -120]}
          headTilt={Math.sin(t * 5) * 3}
          expr={{mouth: 0.9, eyeX: t < 10 ? -12 : 12, eyeY: t > 10 && t < 12 ? -6 : 0}}
          blink={blinkAt(t, [9.0, 13.6])}
        />
        <Dog x={dogX} t={t} run={t > 10.2 ? 1 : 0} facing={1} />
        <Hero
          id="h62"
          x={640}
          y={FLOOR}
          showLegs
          lHand={[-90, -120]}
          rHand={hand}
          rHold={ballT <= 0 ? 'ball' : 'none'}
          lean={wind * -3 + thr * 6}
          expr={{brow: -0.1, mouth: 0.8, eyeX: 10, eyeY: t > 10 ? -12 : 0}}
          headTilt={t > 10 ? -6 : 0}
          blink={blinkAt(t, [8.6, 14.2])}
        />
        {ballT > 0 && ballT < 1 && <circle cx={ballX} cy={ballY} r={20} fill={C.amber} stroke={C.outline} strokeWidth={3.5} />}
        <line x1={-400} y1={FLOOR} x2={2300} y2={FLOOR} stroke={C.line} strokeWidth={3} />
      </Cam>
    </Stage>
  );
};

/* 6.3 + 6.4 — the beach at sunset, no phone, no glass (16–29) */
const HORIZON = 600;
const Beach: React.FC<{t: number}> = ({t}) => {
  const s = t < 23 ? interpolate(t, [16, 23], [1.28, 1.24], cl) : interpolate(t, [23, 29], [1.24, 0.98], {...cl, easing: io});
  const hx = 760;
  const hy = 905;
  return (
    <Stage>
      <defs>
        <linearGradient id="bsky6" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3550" />
          <stop offset="1" stopColor="#f2b765" />
        </linearGradient>
        <clipPath id="abovesea6">
          <rect x={-400} y={0} width={W + 800} height={HORIZON} />
        </clipPath>
      </defs>
      <Cam s={s} cx={hx} cy={hy - 330}>
        <rect x={-400} y={0} width={W + 800} height={HORIZON} fill="url(#bsky6)" />
        <g clipPath="url(#abovesea6)">
          <circle cx={1080} cy={600 + (t - 16) * 2} r={100} fill="#ffd69a" />
        </g>
        <rect x={-400} y={HORIZON} width={W + 800} height={190} fill="#3a2f45" />
        {Array.from({length: 7}, (_, i) => (
          <rect key={i} x={1080 - 80 + i * 3 + Math.sin(t * 2 + i) * 14} y={HORIZON + 14 + i * 22} width={160 - i * 16} height={5} rx={2} fill={C.amberLight} opacity={0.6 - i * 0.06} />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M -400 ${700 + i * 26 + Math.sin(t * 1.2 + i) * 5} q 200 -12 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0`} stroke="#8a7a96" strokeWidth={2.5} fill="none" opacity={0.5} />
        ))}
        <rect x={-400} y={790} width={W + 800} height={400} fill="#211b16" />
        <line x1={-400} y1={790} x2={W + 400} y2={790} stroke={C.line} strokeWidth={3} />
        <Light id="b6w" x={1080} y={HORIZON} r={1300} color={C.amber} o={1} />
        {/* kid with kite, far away */}
        <Person id="kid6" x={1500} y={FLOOR - 20} scale={0.55} showLegs color={TAN} accessory="bow" accessoryColor="#e07b8a" lHand={[-60, -150]} rHand={[90, -330]} expr={{mouth: 0.9, eyeX: 10, eyeY: -8}} />
        <line x1={1500 + 50} y1={FLOOR - 20 - 180} x2={1640 + Math.sin(t * 1.4) * 30} y2={240 + Math.cos(t * 1.1) * 20} stroke="#d9c9a8" strokeWidth={2} />
        <g transform={`translate(${1640 + Math.sin(t * 1.4) * 30} ${240 + Math.cos(t * 1.1) * 20}) rotate(${Math.sin(t * 1.7) * 12})`}>
          <path d="M 0 -44 L 30 0 L 0 44 L -30 0 Z" fill={C.amber} stroke={C.outline} strokeWidth={3} />
          <path d="M 0 44 q 10 20 -6 40 q -14 20 6 40" stroke="#e07b8a" strokeWidth={3} fill="none" />
        </g>
        {/* the hero, seen from behind, simply watching */}
        <Hero id="h63" x={hx} y={hy} back lHand={[-84, -110]} rHand={[90, -110]} headTilt={Math.sin(t * 0.6) * 2} />
        <path d={`M -400 ${FLOOR + 10} Q 300 ${FLOOR - 30} 700 ${FLOOR + 2} T 1600 ${FLOOR + 12} T 2400 ${FLOOR} L 2400 1400 L -400 1400 Z`} fill="#17120f" stroke={C.line} strokeWidth={3} />
      </Cam>
    </Stage>
  );
};

export const GlassRoomPart6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 8 && <Dinner t={t} />}
      {t >= 8 && t < 16 && <Park t={t} />}
      {t >= 16 && t < 29 && <Beach t={t} />}
      <FilmLook />
      <Counter label="SCREEN TIME" showFrom={0} changes={[[0, ''], [sec(17), '1h'], [sec(28.4), '']]} />

      <Sequence from={sec(0.6)} durationInFrames={sec(2.9)}>
        <HeadPill text="How was your week?" x={725} y={372} dur={sec(2.9)} />
      </Sequence>
      <Sequence from={sec(3.9)} durationInFrames={sec(3.6)}>
        <HeadPill text="Let me tell you." x={1205} y={372} dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(4.6)}>
        <Caption text="He looked **up**." dur={sec(4.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(18.0)} durationInFrames={sec(4.8)}>
        <Caption text="This time, he **stayed**." dur={sec(4.8)} highlight={C.amberLight} />
      </Sequence>
      {/* 6.5 end card */}
      <Sequence from={sec(29)} durationInFrames={sec(6)}>
        <BlackCard text="Look up." dur={sec(6)} />
      </Sequence>

      {/* MUSIC: hopeful-guitar (continues from Part 5) */}
      <Sfx at={0} src="music/hopeful-guitar.wav" vol={0.75} from={7.0} />
      {/* SFX */}
      <Sfx at={0.3} src="sfx/plates.wav" vol={0.5} />
      <Sfx at={6.0} src="sfx/soft-laugh.wav" vol={0.6} />
      <Sfx at={8} src="sfx/birds.wav" vol={0.45} />
      <Sfx at={10.4} src="sfx/dog-bark.wav" vol={0.6} />
      <Sfx at={11.6} src="sfx/dog-bark.wav" vol={0.4} />
      <Sfx at={10.3} src="sfx/footsteps.wav" vol={0.35} />
      <Sfx at={16} src="sfx/waves.wav" vol={0.6} dur={7.5} />
      <Sfx at={22.5} src="sfx/waves.wav" vol={0.5} dur={6.5} />
    </AbsoluteFill>
  );
};
