import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {Dust, HomeRoom} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 1 (35 s): the habitat. Mockumentary; the narrator captions talk like a nature film.
  1 0–4      black hook
  2 4–8      WIDE the room, a blanket fort "den" glowing blue     → habitat
  3 8–11.5   MEDIUM the den entrance, a sleepy head peeks out      → the creature
  4 11.5–15  IMAGERY inside the den: a cave around a phone "campfire" → his world
  5 15–18.5  CLOSE his face in the blue glow                       → hypnotised
  6 18.5–22  INSERT wall clock spins 11 → 4                         → time disappears
  7 22–25.5  WIDE sunlight shafts slide across the floor, den unchanged → life passes by
  8 25.5–29  MEDIUM a hand reaches out and pulls the curtain shut   → he shuts the day out
  9 29–35    WIDE the room sinks into night; counter appears       → days pass
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

export const PeekHead: React.FC<{t: number; out: number; sleepy?: number; glow?: number}> = ({t, out, sleepy = 0.6, glow = 0.6}) => (
  <g>
    <clipPath id="denhole">
      <path d="M 760 860 Q 760 700 860 690 Q 960 700 960 860 Z" />
    </clipPath>
    <g clipPath="url(#denhole)">
      <Hero id="peek" x={860} y={1110 - out * 115} scale={0.75} pose="arms-down" expr={{brow: 0.2, lid: sleepy, mouth: 0, eyeX: Math.sin(t * 1.5) * 8}} glow={glow} />
    </g>
  </g>
);

/** IMAGERY: inside the den is a cave; the phone lies on the floor like a campfire. */
export const CaveDen: React.FC<{t: number; fire?: number; children?: React.ReactNode}> = ({t, fire = 1, children}) => (
  <g>
    <rect width={1920} height={1080} fill="#0a0c14" />
    <path d="M -100 1080 L -100 300 Q 960 -120 2020 300 L 2020 1080 Z" fill="#141a2a" />
    {Array.from({length: 14}, (_, i) => (
      <path key={i} d={`M ${i * 150} ${120 + Math.abs(7 - i) * 30} Q ${i * 150 + 40} ${600} ${i * 150 - 30} 1080`} stroke="#1c2438" strokeWidth={10} fill="none" />
    ))}
    {fire > 0 && (
      <g>
        <Light id="fireL" x={960} y={820} r={760} color={C.cold} o={0.9 * fire} />
        <rect x={900} y={840} width={120} height={22} rx={6} fill="#14171c" stroke={C.outline} strokeWidth={4} />
        <rect x={906} y={842} width={108} height={14} rx={4} fill={C.coldLight} opacity={fire} />
        {[0, 1, 2].map((k) => {
          const h = 90 + Math.sin(t * 9 + k * 2) * 25;
          return <path key={k} d={`M ${930 + k * 30} 840 q -26 ${-h * 0.5} 0 ${-h} q 26 ${h * 0.5} 0 ${h} z`} fill={k === 1 ? C.coldLight : C.cold} opacity={0.7 * fire} />;
        })}
        <Dust t={t} x={760} y={480} w={400} h={360} n={22} color={C.coldLight} o={0.8 * fire} />
      </g>
    )}
    {children}
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8)
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 8], [1.0, 1.04], cl)} cx={960} cy={560}>
          <HomeRoom t={t} curtains={0.4} day={0.8} headOut={<PeekHead t={t} out={0} />} />
        </Cam>
      </Stage>
    );
  if (t < 11.5) {
    const out = interpolate(t, [8.4, 9.4, 10.6, 11.4], [0, 1, 1, 0], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.9} cx={860} cy={700}>
          <HomeRoom t={t} curtains={0.4} day={0.8} headOut={<PeekHead t={t} out={out} sleepy={0.65} />} />
        </Cam>
      </Stage>
    );
  }
  if (t < 15)
    return (
      <Stage>
        <Cam s={interpolate(t, [11.5, 15], [1.0, 1.05], cl)} cx={960} cy={640}>
          <CaveDen t={t}>
            <Hero id="cave" x={960} y={1000} scale={0.95} lHand={[-60, -150]} rHand={[60, -150]} expr={{brow: -0.1, lid: 0.3, mouth: 0.3, eyeY: 12}} glow={1} blink={blinkAt(t, [13.4])} />
          </CaveDen>
        </Cam>
      </Stage>
    );
  if (t < 18.5)
    return (
      <Stage>
        <CaveDen t={t} />
        <Hero id="cu1" x={960} y={1080} scale={1.75} pose="arms-down" expr={{brow: 0, lid: 0.35, mouth: 0.25, eyeY: 10}} glow={1.1} shimmer={t * 60} shimmerAmount={0.5} blink={blinkAt(t, [17.6])} />
      </Stage>
    );
  if (t < 22) {
    const spin = interpolate(t, [18.6, 21.6], [0, 1], {...cl, easing: io});
    return (
      <Stage bg="#1b1a20">
        <Light id="clk" x={960} y={540} r={700} color={C.amber} o={0.3} />
        <g transform="translate(960 520)">
          <circle r={260} fill="#16191e" stroke={C.cream} strokeWidth={10} />
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1={Math.sin((i / 12) * Math.PI * 2) * 220} y1={-Math.cos((i / 12) * Math.PI * 2) * 220} x2={Math.sin((i / 12) * Math.PI * 2) * 240} y2={-Math.cos((i / 12) * Math.PI * 2) * 240} stroke={C.cream} strokeWidth={6} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-150} stroke={C.cream} strokeWidth={14} strokeLinecap="round" transform={`rotate(${330 + spin * 150})`} />
          <line x1={0} y1={0} x2={0} y2={-210} stroke={C.amberLight} strokeWidth={8} strokeLinecap="round" transform={`rotate(${spin * 360 * 5})`} />
        </g>
      </Stage>
    );
  }
  if (t < 25.5) {
    const sun = interpolate(t, [22, 25.5], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <HomeRoom t={t} curtains={0.2} day={1 - sun * 0.3} headOut={<PeekHead t={t} out={0} />} />
          <ellipse cx={300 + sun * 900} cy={980} rx={260} ry={40} fill={C.amberLight} opacity={0.18} />
        </Cam>
      </Stage>
    );
  }
  if (t < 29) {
    const pull = interpolate(t, [26.2, 27.6], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.35} cx={1200} cy={520}>
          <HomeRoom t={t} curtains={0.2 + pull * 0.8} day={0.7} headOut={<PeekHead t={t} out={0} />} />
          {/* a long arm from the den yanks the curtain cord */}
          <path d={`M 950 760 Q 1100 ${600 - pull * 30} ${1150 + pull * 30} ${470 - pull * 20}`} stroke={C.outline} strokeWidth={34} fill="none" strokeLinecap="round" />
          <path d={`M 950 760 Q 1100 ${600 - pull * 30} ${1150 + pull * 30} ${470 - pull * 20}`} stroke={C.cream} strokeWidth={27} fill="none" strokeLinecap="round" />
          <ellipse cx={1150 + pull * 30} cy={470 - pull * 20} rx={20} ry={22} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />
        </Cam>
      </Stage>
    );
  }
  const night = interpolate(t, [29, 32], [0.7, 0], cl);
  return (
    <Stage>
      <Cam s={interpolate(t, [29, 35], [1.0, 0.96], cl)} cx={960} cy={560}>
        <HomeRoom t={t} curtains={1} day={night} headOut={<PeekHead t={t} out={0} />} denGlow={1} />
      </Cam>
    </Stage>
  );
};

export const WildClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={sec(30)} changes={[[0, '0']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="A rare species. Rarely seen." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(4.5)} durationInFrames={sec(3.3)}>
        <Caption text="Morning. The young human **sleeps**." dur={sec(3.3)} />
      </Sequence>
      <Sequence from={sec(8.6)} durationInFrames={sec(2.8)}>
        <Caption text="His den is warm. And **dark**." dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(11.8)} durationInFrames={sec(3.0)}>
        <Caption text="He gathers around the **glow**." dur={sec(3.0)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(22.3)} durationInFrames={sec(3.0)}>
        <Caption text="The sun moves. He does **not**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(29.5)} durationInFrames={sec(5.2)}>
        <Caption text="Days pass. The den **remains**." dur={sec(5.2)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={4.0} src="music/doc-flute.wav" vol={0.5} />
      <Sfx at={20.0} src="music/doc-flute.wav" vol={0.35} dur={9} />
      <Sfx at={29.0} src="music/low-note.wav" vol={0.45} />
      {/* SFX */}
      <Sfx at={4.4} src="sfx/bird-single.wav" vol={0.4} />
      <Sfx at={8.5} src="sfx/cloth.wav" vol={0.45} />
      <Sfx at={11.0} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={12.0} src="sfx/scroll-tick.wav" vol={0.35} />
      <Sfx at={13.2} src="sfx/scroll-tick.wav" vol={0.35} />
      <Sfx at={18.6} src="sfx/clock-fast.wav" vol={0.5} dur={3.2} />
      <Sfx at={26.3} src="sfx/cloth.wav" vol={0.5} />
      <Sfx at={27.3} src="sfx/whoosh.wav" vol={0.35} />
    </AbsoluteFill>
  );
};
