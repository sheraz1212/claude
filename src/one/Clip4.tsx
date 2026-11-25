import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Ball, FLOOR_Y, FRIEND, FRIEND2, FRIEND3, PhonePOV, Room, Street, STREET_Y, YEL, YEL_L} from './sets';

/*
 ONE MORE VIDEO - Clip 4 (33 s)   MUSIC: pad alone + sad VIOLIN; drone under the phone reflection
  0-5    WIDE street at night: his friends play ball under the lamp, laughing; one window glows dark-yellow
  5-10   WIDE inside: he sits grey and still like a dead man, only the phone glows       VIDEOS 212
  10-17  CLOSE-UP the phone screen goes black: in it his hollow face - and the demon HUGE behind him
  17-26  BLACK wisdom lines: "It promised you relief." / "It took your life."
  26-33  MEDIUM he puts the phone in the drawer, shuts it, walks to the door and opens it
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const DEAD = '#bdb8aa'; // his colour drained

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 5) {
    const bx = 760 + Math.sin(t * 1.6) * 420;
    const by = STREET_Y - 24 - Math.abs(Math.sin(t * 3.2)) * 90;
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={960} cy={640} dy={-40}>
          <Street t={t} />
          {/* his window, glowing dark yellow */}
          <rect x={1250} y={410} width={44} height={54} fill={YEL} opacity={0.9} />
          <Light id="hisWin" x={1272} y={437} r={160} color={YEL} o={0.7} />
          <Hero id="a" x={340} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND} walk={t * 6} expr={{mouth: 0.9, lid: 0.4, eyeX: 16}} />
          <Hero id="b" x={760} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND2} walk={t * 6 + 1} lHand={[-130, -330]} expr={{mouth: 0.9, lid: 0.3, eyeX: Math.cos(t * 1.6) * 16}} />
          <Hero id="c" x={1180} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND3} walk={t * 6 + 2} expr={{mouth: 0.8, eyeX: -16}} />
          <Ball x={bx} y={by} />
        </Cam>
      </Stage>
    );
  }
  if (t < 10)
    return (
      <Stage bg="#0d0c11">
        <Cam s={interpolate(t, [5, 10], [1.0, 1.08], cl)} cx={760} cy={620} dy={-40}>
          <Room t={t} time="21:10" />
          <Light id="pg" x={716} y={470} r={170} color={YEL} o={0.45} />
          <Hero id="hd" x={640} y={790} scale={0.8} sit pose="arms-down" color={DEAD} rHand={[95, -205]} rHold="phone" lHand={[-40, -110]} headTilt={10}
            expr={{brow: 0.3, lid: 0.65, mouth: -0.4, eyeY: 10, eyeX: 10, bags: true}} />
        </Cam>
      </Stage>
    );
  if (t < 17) {
    const grow = interpolate(t, [11.2, 15.5], [0.6, 1.25], {...cl, easing: Easing.inOut(Easing.quad)});
    const reflect = (
      <g>
        <Demon id="dr" x={960} y={1500} t={t} scale={1.1} size={grow} glow={0.8} opacity={0.75} expr={{eyeX: 0, eyeY: 14, mouth: 0.7}} />
        <g opacity={0.55}>
          <Hero id="hr" x={960} y={1430} scale={1.15} pose="arms-down" color={DEAD} expr={{brow: 0.7, lid: 0.3, mouth: -0.6, eyeY: 4, bags: true}} />
        </g>
      </g>
    );
    return <Stage><PhonePOV t={t} dark reflect={reflect} /></Stage>;
  }
  if (t < 26) return null;
  // 26-33: drawer, then the door
  const open = interpolate(t, [26.4, 27.0, 28.0, 28.6], [0, 1, 1, 0], cl);
  const placed = t > 27.6;
  const walk = t > 29.0;
  const x = interpolate(t, [29.0, 31.4], [700, 1560], {...cl, easing: Easing.inOut(Easing.quad)});
  const door = interpolate(t, [31.4, 32.4], [0, 1], cl);
  return (
    <Stage bg="#0d0c11">
      <Cam s={1.05} cx={1000} cy={620} dy={-40}>
        <Room t={t} time="21:40" drawerOpen={open} door={door} />
        {!walk ? (
          <Hero id="hs" x={860} y={FLOOR_Y} scale={0.8} pose="arms-down" color={DEAD} rHand={placed ? undefined : [180, -150]} rHold={placed ? 'none' : 'phone'}
            expr={{brow: -0.3, lid: 0.2, mouth: -0.2, eyeX: 16, eyeY: 10}} />
        ) : (
          <HeroSide id="hw" x={x} y={FLOOR_Y} scale={0.8} dir={1} phase={t * 6} color={DEAD} brow={-0.3} mouth={0} />
        )}
      </Cam>
    </Stage>
  );
};

export const OneClip4: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      {(t < 17 || t > 26) && <Counter label="VIDEOS" showFrom={0} changes={[[0, '212']]} />}
      <Sequence from={sec(1.0)} durationInFrames={sec(8.6)}>
        <Caption text="Life went on **without** him." dur={sec(8.6)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(17)} durationInFrames={sec(4.5)}>
        <BlackCard text="It promised you **relief**." dur={sec(4.5)} highlight={YEL} />
      </Sequence>
      <Sequence from={sec(21.5)} durationInFrames={sec(4.5)}>
        <BlackCard text="It took your **life**." dur={sec(4.5)} highlight={YEL} />
      </Sequence>
      <Sequence from={sec(29.2)} durationInFrames={sec(3.6)}>
        <Caption text="He put it **away**." dur={sec(3.6)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/street-amb.wav" vol={0.3} dur={5} fadeOut={0.5} />
      <Sfx at={0.4} src="sfx/group-laugh.wav" vol={0.35} />
      <Sfx at={1.2} src="sfx/ball-kick.wav" vol={0.4} />
      <Sfx at={3.1} src="sfx/ball-kick.wav" vol={0.4} />
      <Sfx at={5.0} src="sfx/room-tone.wav" vol={0.35} dur={12} />
      <Sfx at={5.2} src="sfx/far-cheer.wav" vol={0.15} dur={4} fadeOut={1} />
      <Sfx at={10.2} src="sfx/power-down.wav" vol={0.35} />
      <Sfx at={11.4} src="sfx/heartbeat.wav" vol={0.4} dur={5.4} fadeOut={0.8} />
      <Sfx at={17.4} src="sfx/pen-write.wav" vol={0.5} />
      <Sfx at={21.9} src="sfx/pen-write.wav" vol={0.5} />
      <Sfx at={26.0} src="sfx/room-tone.wav" vol={0.35} dur={7} />
      <Sfx at={26.4} src="sfx/drawer-open.wav" vol={0.45} />
      <Sfx at={28.0} src="sfx/drawer-close.wav" vol={0.5} />
      <Sfx at={29.0} src="sfx/footsteps.wav" vol={0.3} dur={2.4} />
      <Sfx at={31.4} src="sfx/door-close.wav" vol={0.3} />
    </AbsoluteFill>
  );
};
