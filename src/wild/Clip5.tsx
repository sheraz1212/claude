import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Stage} from '../common/sets';
import {HomeRoom, Snow} from './sets';
import {CaveDen, PeekHead} from './Clip1';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 5 (35 s): winter — only inside his room. IMAGERY low point. MUSIC: winter-cello.
  1 0–4      WIDE frost creeps in from the corners          → "Then winter came. Only inside."
  2 4–7.5    MEDIUM snow begins to fall onto the den         → impossible weather
  3 7.5–11   IMAGERY cave: the phone-fire flickers, dying     → battery = warmth
  4 11–14.5  CLOSE he shivers, breath fog                     → cold loneliness
  5 14.5–18  WIDE the den sags under heavy snow               → his world collapsing
  6 18–22    MEDIUM fire out, darkness, only his eyes          → the bottom
  7 22–26    IMAGERY his frosted reflection in the black phone → who he became
  8 26–29    INSERT the wall clock frozen with icicles        → time stopped
  9 29–32    CLOSE a tear freezes on his cheek                → near silence
  10 32–35   KNOCK KNOCK — the falling snow stops in mid-air  → the turning point begins
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const shots = (t: number): React.ReactNode => {
  if (t < 7.5 || (t >= 14.5 && t < 18)) {
    const w = t < 4 ? interpolate(t, [0, 4], [0.15, 0.5], cl) : t < 7.5 ? interpolate(t, [4, 7.5], [0.5, 0.8], cl) : 1;
    const sag = t >= 14.5 ? interpolate(t, [14.5, 18], [0, 1], cl) : 0;
    return (
      <Stage>
        <Cam s={t < 4 ? 1.0 : t < 7.5 ? 1.4 : 1.0} cx={t >= 4 && t < 7.5 ? 860 : 960} cy={t >= 4 && t < 7.5 ? 640 : 560}>
          <HomeRoom t={t} curtains={1} day={0.2} winter={w} headOut={<PeekHead t={t} out={0} glow={0.4} />} denGlow={0.5 - sag * 0.3} />
          {t >= 14.5 && (
            <path d={`M 560 ${860 - sag * 10} Q 600 ${600 + sag * 120} 860 ${480 + sag * 160} Q 1120 ${600 + sag * 120} 1160 ${860 - sag * 10}`} fill="#eaf2ff" opacity={0.55 * sag} />
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 11) {
    const fire = Math.max(0, interpolate(t, [7.5, 10.8], [1, 0.15], cl) * (0.6 + 0.4 * Math.abs(Math.sin(t * 17))));
    return (
      <Stage>
        <Cam s={interpolate(t, [7.5, 11], [1.0, 1.05], cl)} cx={960} cy={700}>
          <CaveDen t={t} fire={fire}>
            <Hero id="cold1" x={960} y={1000} scale={0.95} lHand={[-60, -150]} rHand={[60, -150]} expr={{brow: 0.8, lid: 0.2, mouth: -0.4, eyeY: 12}} glow={fire} />
            <Snow t={t} o={0.6} n={60} />
          </CaveDen>
        </Cam>
      </Stage>
    );
  }
  if (t < 14.5) {
    const shiver = Math.sin(t * 40) * 3;
    return (
      <Stage>
        <CaveDen t={t} fire={0.15} />
        <Snow t={t} o={0.8} n={80} />
        <g transform={`translate(${shiver} 0)`}>
          <Hero id="shiv" x={1000} y={1080} scale={1.75} lHand={[-60, -200]} rHand={[60, -200]} expr={{brow: 1.0, lid: 0.15, mouth: -0.5, eyeY: 4}} glow={0.2} blink={blinkAt(t, [13.2])} />
        </g>
        {[0, 1].map((k) => {
          const p = ((t - 11) * 0.6 + k * 0.5) % 1;
          return <ellipse key={k} cx={1000 + p * 80} cy={570 - p * 160} rx={40 + p * 60} ry={24 + p * 30} fill="#eaf2ff" opacity={(1 - p) * 0.4} />;
        })}
      </Stage>
    );
  }
  if (t < 22)
    return (
      <Stage bg="#05060a">
        <Snow t={t} o={0.3} n={40} />
        <Light id="eyes" x={960} y={540} r={300} color="#5b7fb8" o={0.25} />
        <g opacity={0.25}>
          <Hero id="dark" x={960} y={1000} scale={0.95} pose="arms-down" expr={{brow: 0.9, lid: 0.2, mouth: -0.5, eyeY: 6}} />
        </g>
        <circle cx={960 - 34 * 0.95} cy={1000 - 322 * 0.95 + 6} r={7} fill="#eaf2ff" />
        <circle cx={960 + 34 * 0.95} cy={1000 - 322 * 0.95 + 6} r={7} fill="#eaf2ff" />
      </Stage>
    );
  if (t < 26) {
    const s = interpolate(t, [22, 26], [1.0, 1.08], cl);
    return (
      <Stage bg="#06080c">
        <Cam s={s} cx={960} cy={540}>
          <rect x={620} y={120} width={680} height={860} rx={60} fill="#0b0d12" stroke="#2a2f37" strokeWidth={10} />
          <clipPath id="refl">
            <rect x={650} y={150} width={620} height={800} rx={40} />
          </clipPath>
          <g clipPath="url(#refl)" opacity={0.45}>
            <Hero id="refl" x={960} y={1300} scale={2.0} pose="arms-down" expr={{brow: 1.0, lid: 0.3, mouth: -0.6, bags: true}} />
            <rect x={650} y={150} width={620} height={800} fill="#eaf2ff" opacity={0.15} />
          </g>
          <rect x={650} y={150} width={620} height={800} rx={40} fill="none" stroke="#eaf2ff" strokeWidth={40} opacity={0.18} style={{filter: 'blur(14px)'}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 29)
    return (
      <Stage bg="#1b1a20">
        <g transform="translate(960 520)">
          <circle r={260} fill="#16191e" stroke="#cfe0ff" strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-150} stroke="#cfe0ff" strokeWidth={14} strokeLinecap="round" transform="rotate(120)" />
          <line x1={0} y1={0} x2={0} y2={-210} stroke="#9fb4d6" strokeWidth={8} strokeLinecap="round" transform="rotate(200)" />
          {Array.from({length: 9}, (_, i) => (
            <path key={i} d={`M ${-200 + i * 50} ${240 - Math.abs(4 - i) * 22} l 10 ${50 + (i % 3) * 25} l 10 ${-(50 + (i % 3) * 25)} z`} fill="#eaf2ff" opacity={0.85} />
          ))}
        </g>
        <Snow t={t} o={0.6} n={50} />
      </Stage>
    );
  if (t < 32)
    return (
      <Stage>
        <CaveDen t={t} fire={0} />
        <Snow t={t} o={0.5} n={50} />
        <Hero id="tear" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: 1.0, lid: 0.35, mouth: -0.6, eyeY: 4, tear: interpolate(t, [29.3, 30.6], [0, 0.6], cl), bags: true}} glow={0.15} />
        {t > 30.6 && <circle cx={1000 - 36 * 1.75} cy={1080 - 306 * 1.75 + 0.6 * 30 * 1.75} r={9} fill="#eaf2ff" stroke="#9fb4d6" strokeWidth={2} />}
      </Stage>
    );
  // 10 — knock: the snow freezes mid-air
  return (
    <Stage>
      <HomeRoom t={32} curtains={1} day={0.2} winter={1} headOut={<PeekHead t={t} out={interpolate(t, [33.4, 34.4], [0, 0.9], cl)} sleepy={0} glow={0.2} />} denGlow={0.2} />
      <Light id="door" x={200} y={600} r={500} color={C.amber} o={interpolate(t, [32.2, 34], [0, 0.5], cl)} />
    </Stage>
  );
};

export const WildClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(t)}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '0']]} />
      <Sequence from={sec(0.4)} durationInFrames={sec(3.5)}>
        <Caption text="Then winter came. Only **inside**." dur={sec(3.5)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(7.8)} durationInFrames={sec(3.0)}>
        <Caption text="His fire was **dying**." dur={sec(3.0)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(22.4)} durationInFrames={sec(3.4)}>
        <Caption text="The creature was **lonely**." dur={sec(3.4)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/winter-cello.wav" vol={0.55} />
      <Sfx at={26.0} src="music/freeze-pad.wav" vol={0.3} dur={6} />
      <Sfx at={32.0} src="music/impact-low.wav" vol={0.5} dur={3} />
      {/* SFX */}
      <Sfx at={0.5} src="sfx/snow-wind.wav" vol={0.6} />
      <Sfx at={6.0} src="sfx/frost-creak.wav" vol={0.5} />
      <Sfx at={10.6} src="sfx/power-down.wav" vol={0.5} />
      <Sfx at={11.2} src="sfx/snow-wind.wav" vol={0.5} />
      <Sfx at={15.2} src="sfx/frost-creak.wav" vol={0.45} />
      <Sfx at={30.6} src="sfx/glass-hum.wav" vol={0.2} dur={1.4} />
      <Sfx at={32.0} src="sfx/knock.wav" vol={0.9} />
      <Sfx at={33.2} src="sfx/knock.wav" vol={0.9} />
    </AbsoluteFill>
  );
};
