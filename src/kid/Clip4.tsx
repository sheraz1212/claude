import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage, TAN} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {BigWord} from '../spot/sets';
import {HEADBAND, JACKET, MindTrack, PARK_Y, ParkRace, Ribbon} from './sets';

/*
 THE KID WHO FELL — Clip 4 (34 s): the choice.
  0–8    IMAGERY the endless dark track: he at the start, the demon towering at the finish, YOU'LL FALL. on the track
  8–16   BLACK wisdom lines
  16–24  WIDE park: he walks past the demon and kneels by the kid: "hey. me too."
  24–34  MEDIUM the kid takes his hand and stands up; they look at the finish line
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = PARK_Y;
const HS = 0.78;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 8], [1, 1.12], cl)} cx={960} cy={560}>
          <MindTrack t={t} />
          <Demon id="d" x={960} y={520} t={t} scale={0.42} size={1.5} glow={1.2} expr={{mouth: 0.6}} />
          <BigWord text="YOU'LL FALL." x={960} y={820} size={120} o={interpolate(t, [1.5, 2.3], [0, 0.95], cl)} />
          <Hero id="h" x={960} y={1060} scale={0.9} back pose="arms-down" jacket={JACKET} />
        </Cam>
      </Stage>
    );
  if (t < 16) return null;
  if (t < 24) {
    const walk = interpolate(t, [16.2, 19.4], [560, 960], cl);
    const crouch = interpolate(t, [19.4, 20.2], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return (
      <Stage>
        <Cam s={1.25} cx={960} cy={G} dy={-120}>
          <ParkRace t={t} cheer={0} />
          <Ribbon x={1700} />
          <Demon id="d" x={700} y={G} t={t} scale={HS} size={1.1} lHand={t > 17.6 ? [80, -230] : undefined} rHand={t > 17.6 ? [160, -250] : undefined} glow={interpolate(t, [18, 24], [1, 0.6], cl)} headTilt={10} expr={{brow: 0.2, mouth: -0.1}} />
          <ellipse cx={walk} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
          <HeroSide id="h" x={walk} y={G + crouch * 40} scale={HS} dir={1} jacket={JACKET} phase={t < 19.4 ? t * 6 : undefined} lean={crouch * 32} armUp={crouch * 0.55} brow={0.3 - crouch * 0.4} mouth={crouch * 0.3} headTilt={crouch * 14} />
          <Hero id="kid" x={1130} y={G + 30} scale={0.42} classic sit color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-40, -150]} rHand={[40, -150]} expr={{brow: 0.9 - crouch * 0.3, lid: 0.45, mouth: -0.7, tear: 1, eyeX: -12 * crouch}} blink={blinkAt(t, [22.6])} />
        </Cam>
      </Stage>
    );
  }
  const up = interpolate(t, [24.6, 26.0], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const look = t > 28;
  return (
    <Stage>
      <Cam s={1.5} cx={1000} cy={G} dy={-170}>
        <ParkRace t={t} cheer={0} />
        <Ribbon x={1640} />
        <ellipse cx={900} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        <Hero id="h" x={900} y={G} scale={HS} pose="arms-down" jacket={JACKET} rHand={[150, -150 + up * 10]} expr={{brow: -0.1, lid: 0.1, mouth: 0.5, eyeX: look ? 16 : 12, eyeY: look ? 0 : 10}} blink={blinkAt(t, [30.5])} />
        {up < 0.5 ? (
          <Hero id="kid" x={1060} y={G + 30} scale={0.42} classic sit color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-90, -230]} rHand={[40, -150]} expr={{brow: 0.4, lid: 0.3, mouth: -0.2, tear: 1, eyeX: -12, eyeY: -8}} />
        ) : (
          <Hero id="kid" x={1060} y={G} scale={0.42} classic color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-90, -200]} rHand={t > 26.4 && t < 27.6 ? [20, -300] : undefined} expr={{brow: 0.1, lid: 0.15, mouth: 0.3, tear: Math.max(0, 1 - (t - 26) * 0.6), eyeX: look ? 16 : -12, eyeY: look ? 0 : -8}} />
        )}
      </Cam>
    </Stage>
  );
};

export const KidClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(8)} durationInFrames={sec(4)}>
        <BlackCard text="Everyone falls." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(12)} durationInFrames={sec(4)}>
        <BlackCard text="Not everyone gets **up**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(20.6)} durationInFrames={sec(2.8)}>
        <HeadPill text="hey. me too." x={1030} y={330} dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(27.4)} durationInFrames={sec(5.4)}>
        <Caption text="He gave the hand he **never** got." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      {/* MUSIC (2 s of silence on purpose) */}
      <Sfx at={2.0} src="music/choir-cello.wav" vol={0.8} dur={14} fadeIn={1.5} fadeOut={1.5} />
      <Sfx at={17.5} src="music/piano-violin-rise.wav" vol={0.75} fadeIn={1} />
      {/* SFX */}
      <Sfx at={0} src="sfx/low-hum.wav" vol={0.35} dur={8} />
      <Sfx at={1.8} src="sfx/voice/inner-youll-fall.wav" vol={0.7} />
      <Sfx at={2.0} src="sfx/timpani-hit.wav" vol={0.5} />
      <Sfx at={8.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={12.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={16.2} src="sfx/footsteps.wav" vol={0.35} dur={3.2} />
      <Sfx at={19.6} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={24.8} src="sfx/cloth.wav" vol={0.3} />
    </AbsoluteFill>
  );
};
