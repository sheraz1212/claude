import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Light, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Flat} from '../kid/sets';
import {Desk, LivingRoom, SCREEN, SCREEN_L} from './sets';
import {AtDesk, OnSofa} from './parts';

/*
 HE COULDN'T REST — Clip 2 (33 s): the same pull, again and again (the demon grows each time).
  0–8    WIDE tea at the window: the demon points at the clock: "you're behind."   → back to the desk
  8–11   WIDE at the desk
  11–19  WIDE a movie on the sofa: the demon drops his unfinished papers in front of him: "not done."
  19–27  WIDE bed: eyes closing; the demon brings the laptop light: "not yet."
  27–33  WIDE desk again: eyes wide open, nothing moves
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 900;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const point = t > 2.0;
    const walking = t > 5.2;
    const x = interpolate(t, [5.2, 7.6], [1420, 1000], cl);
    return (
      <Stage>
        <LivingRoom t={t} sky="night" time="21:30" lamp={0.5} />
        <Demon id="d" x={1150} y={G} t={t} scale={HS} size={0.9} rHand={point ? [10, -420] : undefined} headTilt={-8} expr={{eyeX: 14}} />
        <Desk t={t} laptop="open" />
        {!walking ? (
          <Hero id="h" x={1420} y={G} scale={HS} pose="arms-down" rHand={[50, -200]} rHold="cup" expr={{brow: t > 3 ? 0.5 : -0.1, lid: t > 3 ? 0.2 : 0.5, mouth: t > 3 ? -0.2 : 0.4, eyeX: t > 3 ? -16 : 10}} />
        ) : (
          <HeroSide id="hw" x={x} y={G} scale={HS} dir={-1} phase={t * 7} brow={0.5} mouth={-0.2} />
        )}
      </Stage>
    );
  }
  if (t < 11)
    return (
      <Stage>
        <LivingRoom t={t} sky="night" time="21:45" lamp={0.4} />
        <Demon id="d" x={1220} y={G} t={t} scale={HS} size={0.95} headTilt={-10} expr={{eyeX: -14}} />
        <AtDesk t={t} expr={{brow: 0.4, lid: 0.35, mouth: -0.2, eyeY: 10}} />
        <Desk t={t} laptop="open" cups={1} />
      </Stage>
    );
  if (t < 19) {
    const fly = interpolate(t, [12.4, 13.8], [0, 1], cl);
    return (
      <Stage>
        <LivingRoom t={t} sky="night" time="22:30" lamp={0.2} tv={1} />
        <Demon id="d" x={760} y={G} t={t} scale={HS} size={1.0} rHand={t > 12 && t < 14 ? [-120, -300] : undefined} headTilt={8} expr={{eyeX: -14}} />
        <Desk t={t} laptop="open" cups={1} />
        <OnSofa glow={0.6} glowColor="#9ab8e8" expr={{brow: t > 14 ? 0.5 : 0, lid: t > 14 ? 0.1 : 0.4, mouth: t > 14 ? -0.3 : 0.2, eyeX: -6}} />
        {fly > 0 && [0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={760 - fly * (300 + i * 50)} y={500 + i * 30 + Math.sin(fly * 3 + i) * 30} width={70} height={90} fill="#efe6d6" stroke="#23262c" strokeWidth={3}
            transform={`rotate(${(i - 2) * 12 * fly} ${760 - fly * (300 + i * 50)} ${520 + i * 30})`} />
        ))}
      </Stage>
    );
  }
  if (t < 27) {
    const shine = interpolate(t, [20.6, 21.4], [0, 1], cl);
    return (
      <Stage>
        <Flat t={t} lamp={0} />
        <rect width={1920} height={1080} fill="#06060c" opacity={0.3} />
        <Light id="lap" x={560} y={560} r={500} color={SCREEN} o={0.8 * shine} />
        <Demon id="d" x={760} y={G} t={t} scale={HS} size={1.1} rHand={[-60, -220]} headTilt={10} expr={{eyeX: -14}} />
        {shine > 0 && <rect x={640} y={520} width={90} height={60} rx={6} fill={SCREEN} opacity={shine} stroke="#23262c" strokeWidth={3} />}
        <Hero id="h" x={380} y={746} scale={HS} sit pose="arms-down" glow={shine * 0.8} glowColor={SCREEN} expr={{brow: shine > 0.5 ? 0.6 : 0.2, lid: t < 22.6 ? 0.8 : 0.1, mouth: -0.2, eyeX: shine > 0.5 ? 14 : 0}} />
      </Stage>
    );
  }
  return (
    <Stage>
      <LivingRoom t={t} sky="night" time="02:10" lamp={0} />
      <Demon id="d" x={1220} y={G} t={t} scale={HS} size={1.2} headTilt={-12} lean={-5} expr={{eyeX: -16, mouth: 0.6}} />
      <AtDesk t={t} typing={false} expr={{brow: 0.6, lid: 0, mouth: -0.3, eyeY: 6, bags: true}} />
      <Desk t={t} laptop="open" cups={2} />
    </Stage>
  );
};

export const RestClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(0.4)} durationInFrames={sec(2.4)}>
        <Caption text="He tried a cup of tea." dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(2.6)} durationInFrames={sec(2.6)}>
        <DemonSay text="you're behind." x={1250} y={260} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(11.4)} durationInFrames={sec(2.6)}>
        <Caption text="He tried a movie." dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(14.0)} durationInFrames={sec(2.6)}>
        <DemonSay text="not done." x={860} y={250} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(19.4)} durationInFrames={sec(2.2)}>
        <Caption text="He tried to sleep." dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(21.8)} durationInFrames={sec(2.6)}>
        <DemonSay text="not yet." x={860} y={250} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(27.6)} durationInFrames={sec(5)}>
        <Caption text="Eyes open. Nothing **done**." dur={sec(5)} highlight={SCREEN_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.3} src="sfx/cup-tap.wav" vol={0.4} />
      <Sfx at={2.0} src="sfx/demon-horn.wav" vol={0.5} />
      <Sfx at={2.6} src="sfx/voice/inner-youre-behind.wav" vol={0.7} />
      <Sfx at={2.6} src="sfx/clock-tick.wav" vol={0.3} dur={2.6} />
      <Sfx at={5.2} src="sfx/footsteps.wav" vol={0.3} dur={2.4} />
      <Sfx at={8.2} src="sfx/typing.wav" vol={0.3} dur={2.6} />
      <Sfx at={12.4} src="sfx/page-flip.wav" vol={0.5} />
      <Sfx at={12.8} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={14.0} src="sfx/voice/inner-not-done.wav" vol={0.7} />
      <Sfx at={20.6} src="sfx/demon-tuba.wav" vol={0.45} />
      <Sfx at={21.8} src="sfx/voice/inner-not-yet.wav" vol={0.7} />
      <Sfx at={27.2} src="sfx/clock-tick.wav" vol={0.35} dur={5.6} />
    </AbsoluteFill>
  );
};
