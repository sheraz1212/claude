import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, SCARF, Stage, TAN} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {HEADBAND, JACKET, MindTrack, PARK_Y, ParkRace, Ribbon} from './sets';

/*
 THE KID WHO FELL — Clip 5 (33 s): the run.  MUSIC: driving orchestra
  0–8    WIDE side tracking: he and the kid run together, the parents cheer
  8–14   IMAGERY the dark track cracks open with light; the demon shrinks and cracks: "weaker..."
  14–20  MEDIUM the finish: the kid's mum hugs him, everyone claps
  20–27  MEDIUM the kid sticks a gold sticker on his jacket: "you won too."
  27–33  WIDE he walks home lighter; the demon is a small cracked shadow left on the bench
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = PARK_Y;
const HS = 0.78;
const GOLD = '#f2c94c';

const Sticker: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={16} fill={GOLD} stroke={C.outline} strokeWidth={2.5} />
    <path d="M -6 -2 l 4 6 l 8 -10" stroke={C.outline} strokeWidth={2.5} fill="none" />
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const scroll = t * 380;
    return (
      <Stage>
        <Cam s={1.15} cx={960} cy={G} dy={-60}>
          <ParkRace t={t} cheer={1} scrollX={scroll} />
          <HeroSide id="h" x={860} y={G} scale={HS} dir={1} jacket={JACKET} phase={t * 11} run={0.55} brow={0.2} mouth={0.4} lid={0.1} />
          <HeroSide id="kid" x={1060} y={G + 20} scale={0.34} color={TAN} accessory="headband" accessoryColor={HEADBAND} phase={t * 14} run={1} mouth={0.9} />
        </Cam>
      </Stage>
    );
  }
  if (t < 14) {
    const k = interpolate(t, [8, 14], [0, 1], cl);
    return (
      <Stage>
        <MindTrack t={t} cracks={k} light={k * 0.6} />
        <Demon id="d" x={960} y={520} t={t} scale={0.42} size={1.5 - k * 0.8} crack={k} glow={1 - k * 0.6} opacity={1 - k * 0.3} expr={{brow: 0.5, mouth: -0.4, lid: 0.4}} />
        <Hero id="h" x={960} y={1060 - k * 80} scale={0.9 - k * 0.15} back pose="arms-down" jacket={JACKET} walk={t * 10} />
      </Stage>
    );
  }
  if (t < 20) {
    const run = t < 15.8;
    const hx = interpolate(t, [14, 15.8], [900, 1300], cl);
    return (
      <Stage>
        <Cam s={1.3} cx={1250} cy={G} dy={-110}>
          <ParkRace t={t} cheer={1} />
          <Ribbon x={1350} broken={t > 15 ? 1 : 0} />
          {run ? (
            <>
              <HeroSide id="h" x={hx} y={G} scale={HS} dir={1} jacket={JACKET} phase={t * 11} run={0.5} mouth={0.6} />
              <HeroSide id="kid" x={hx + 180} y={G + 20} scale={0.34} color={TAN} accessory="headband" accessoryColor={HEADBAND} phase={t * 14} run={1} mouth={0.9} />
            </>
          ) : (
            <>
              <Hero id="h" x={1180} y={G} scale={HS} pose="arms-down" jacket={JACKET} expr={{brow: -0.1, lid: 0.3, mouth: 0.7, eyeX: 14}} blink={blinkAt(t, [18.4])} />
              <Hero id="mum" x={1460} y={G} scale={HS} color={TAN} accessory="scarf" accessoryColor={SCARF} pose="arms-down" lHand={[-80, -190]} rHand={[40, -190]} expr={{brow: 0.2, lid: 0.6, mouth: 0.8}} />
              <Hero id="kid" x={1400} y={G} scale={0.42} classic color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" expr={{brow: -0.1, lid: 0.5, mouth: 0.9}} />
            </>
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 27) {
    const reach = interpolate(t, [20.6, 21.8], [0, 1], cl);
    const stuck = t > 21.8;
    return (
      <Stage>
        <Cam s={1.7} cx={1040} cy={G} dy={-200}>
          <ParkRace t={t} cheer={0.4} />
          <Hero id="h" x={960} y={G} scale={HS} pose="arms-down" jacket={JACKET} lean={-3} expr={{brow: stuck ? 0.3 : -0.1, lid: 0.1, mouth: stuck ? 0.8 : 0.4, eyeX: 14, eyeY: 12}} blink={blinkAt(t, [25.2])} />
          {stuck && <Sticker x={960 - 30} y={G - 230} />}
          <Hero id="kid" x={1140} y={G} scale={0.42} classic color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-100 - reach * 120, -180 - reach * 160]} expr={{brow: -0.2, lid: 0.1, mouth: 0.9, eyeX: -14, eyeY: -12}} />
          {!stuck && reach > 0.2 && <Sticker x={1140 + 0.42 * (-100 - reach * 120)} y={G + 0.42 * (-180 - reach * 160) - 30} s={0.8} />}
        </Cam>
      </Stage>
    );
  }
  const x = interpolate(t, [27, 33], [500, 1300], cl);
  return (
    <Stage>
      <ParkRace t={t} cheer={0} />
      <Demon id="d" x={1520} y={G} t={t} scale={HS} size={0.45} crack={1} glow={0.3} opacity={0.6} expr={{brow: 0.6, mouth: -0.5, lid: 0.6}} />
      <ellipse cx={x} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
      <HeroSide id="h" x={x} y={G} scale={HS} dir={1} jacket={JACKET} phase={t * 6} brow={-0.1} lid={0.1} mouth={0.5}>
        <Sticker x={40} y={-260} s={1.2} />
      </HeroSide>
    </Stage>
  );
};

export const KidClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(1)} durationInFrames={sec(5.5)}>
        <Caption text="They ran. **Together**." dur={sec(5.5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(10.4)} durationInFrames={sec(3.2)}>
        <DemonSay text="weaker..." x={1060} y={260} dur={sec(3.2)} size={56} />
      </Sequence>
      <Sequence from={sec(16.4)} durationInFrames={sec(3.4)}>
        <Caption text="Nobody **laughed**." dur={sec(3.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(22.4)} durationInFrames={sec(2.8)}>
        <HeadPill text="you won too." x={1210} y={430} dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(28)} durationInFrames={sec(4.6)}>
        <Caption text="He walked home **lighter**." dur={sec(4.6)} highlight={C.amberLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/orch-drive.wav" vol={0.75} dur={20.5} fadeIn={0.3} fadeOut={1.5} />
      <Sfx at={19.5} src="music/hope-violin.wav" vol={0.75} dur={13.5} fadeIn={1.2} fadeOut={1} />
      {/* SFX */}
      <Sfx at={0} src="sfx/run-park.wav" vol={0.35} dur={7.8} />
      <Sfx at={0.5} src="sfx/far-cheer.wav" vol={0.35} dur={7} fadeOut={1} />
      <Sfx at={8.6} src="sfx/glass-crack.wav" vol={0.4} />
      <Sfx at={10.4} src="sfx/voice/inner-weaker.wav" vol={0.7} />
      <Sfx at={11.6} src="sfx/glass-crack.wav" vol={0.35} />
      <Sfx at={15.0} src="sfx/applause.wav" vol={0.5} dur={5} fadeOut={1} />
      <Sfx at={21.8} src="sfx/sticker.wav" vol={0.55} />
      <Sfx at={27} src="sfx/footsteps.wav" vol={0.3} dur={6} />
    </AbsoluteFill>
  );
};
