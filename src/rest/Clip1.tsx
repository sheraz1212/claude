import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Desk, LivingRoom, SCREEN_L} from './sets';
import {AtDesk, OnSofa} from './parts';

/*
 HE COULDN'T REST — Clip 1 (32 s)
  0–4    BLACK hook
  4–10   WIDE at the desk: he closes the laptop and stretches          → Friday, finally
  10–16  WIDE he walks over and drops onto the sofa                    → rest
  16–23  WIDE the demon sits at HIS desk and opens the laptop: "one more task."
  23–32  MEDIUM he gets up and goes back to the desk; blue glow on his face
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 900;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const closed = t > 6.6;
    const up = interpolate(t, [7.0, 7.8, 8.8, 9.6], [0, 1, 1, 0], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1, 1.04], cl)} cx={960} cy={560}>
          <LivingRoom t={t} sky="evening" time="18:02" />
          {up > 0 ? (
            <Hero id="hd2" x={960} y={724} scale={HS} sit pose="arms-down" lHand={[-90 - up * 10, -130 - up * 260]} rHand={[90 + up * 10, -130 - up * 260]} expr={{brow: -0.1, lid: 0.7, mouth: 0.7}} />
          ) : (
            <AtDesk t={t} typing={!closed} glow={closed ? 0 : 0.8} expr={closed ? {brow: -0.1, lid: 0.3, mouth: 0.5, eyeY: 0} : {brow: 0.3, lid: 0.35, mouth: -0.1, eyeY: 10}} />
          )}
          <Desk t={t} laptop={closed ? 'closed' : 'open'} glow={closed ? 0 : 1} />
        </Cam>
      </Stage>
    );
  }
  if (t < 23) {
    const walkK = interpolate(t, [10.2, 12.4], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
    const seated = t > 12.4;
    const demonIn = interpolate(t, [16.4, 17.2], [0, 1], cl);
    const open = t > 17.4;
    const look = t > 17.6;
    return (
      <Stage>
        <LivingRoom t={t} sky="evening" time="18:10" />
        {demonIn > 0 && (
          <g opacity={demonIn}>
            <rect x={895} y={540} width={130} height={170} rx={20} fill="#2c2a34" stroke="#23262c" strokeWidth={4} />
            <Demon id="d" x={960} y={740} t={t} scale={HS} size={0.8} sit headTilt={12} expr={{eyeX: -16}} />
          </g>
        )}
        <Desk t={t} laptop={open ? 'open' : 'closed'} glow={open ? 1 : 0} />
        {!seated ? (
          <HeroSide id="hw" x={interpolate(walkK, [0, 1], [960, 380])} y={G} scale={HS} dir={-1} phase={t * 7} brow={-0.2} mouth={0.4} />
        ) : (
          <OnSofa expr={{brow: look ? 0.4 : -0.1, lid: look ? 0.1 : 0.55, mouth: look ? -0.3 : 0.6, eyeX: look ? 16 : 0}} />
        )}
      </Stage>
    );
  }
  const up = t > 23.4 && t < 26;
  const x = interpolate(t, [23.6, 25.8], [380, 960], cl);
  return (
    <Stage>
      <Cam s={interpolate(t, [23, 32], [1.0, 1.35], cl)} cx={960} cy={520}>
        <LivingRoom t={t} sky="evening" time="18:40" />
        <Demon id="d" x={1220} y={G} t={t} scale={HS} size={0.85} headTilt={-10} lean={-4} expr={{eyeX: -14}} />
        {t < 23.4 && <OnSofa expr={{brow: 0.5, lid: 0.4, mouth: -0.3, eyeX: 16}} />}
        {up && <HeroSide id="hw2" x={x} y={G} scale={HS} dir={1} phase={t * 6} brow={0.4} mouth={-0.2} />}
        {t >= 26 && <AtDesk t={t} expr={{brow: 0.35, lid: 0.25, mouth: -0.2, eyeY: 10}} />}
        <Desk t={t} laptop="open" />
      </Cam>
    </Stage>
  );
};

export const RestClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He stopped. His mind **didn't**." dur={sec(4)} highlight={SCREEN_L} />
      </Sequence>
      <Sequence from={sec(4.8)} durationInFrames={sec(4.6)}>
        <Caption text="Friday. **Finally**." dur={sec(4.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(12.8)} durationInFrames={sec(3.0)}>
        <Caption text="Time to **rest**." dur={sec(3.0)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(18.4)} durationInFrames={sec(3.0)}>
        <DemonSay text="one more task." x={1040} y={300} dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(27.0)} durationInFrames={sec(4.6)}>
        <Caption text="Just **one** more." dur={sec(4.6)} highlight={SCREEN_L} />
      </Sequence>
      {/* SFX (instrument SFX live here, not in the music) */}
      <Sfx at={0.5} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={4.2} src="sfx/typing.wav" vol={0.35} dur={2.3} />
      <Sfx at={6.6} src="sfx/laptop-close.wav" vol={0.6} />
      <Sfx at={10.2} src="sfx/footsteps.wav" vol={0.35} dur={2.2} />
      <Sfx at={12.4} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={16.3} src="sfx/demon-trombone.wav" vol={0.6} />
      <Sfx at={17.4} src="sfx/laptop-close.wav" vol={0.35} />
      <Sfx at={18.4} src="sfx/voice/inner-one-more-task.wav" vol={0.7} />
      <Sfx at={23.6} src="sfx/footsteps.wav" vol={0.3} dur={2.2} />
      <Sfx at={26.4} src="sfx/typing.wav" vol={0.3} dur={4} />
    </AbsoluteFill>
  );
};
