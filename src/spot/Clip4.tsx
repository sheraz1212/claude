import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Attic, BigWord, MindStage, PickNecklace, PURPLE_L, Stool} from './sets';

/*
 SPOTLIGHT — Clip 4 (34 s): low point, wisdom lines, the tiny decision.
  0–8    IMAGERY WIDE the Mind Stage: spotlight slams on; he is tiny; 48 Blob faces yawn and smirk; big words fly
  8–13   MEDIUM on the mind stage: he grips the guitar, a string SNAPS, then silence
  13–21  BLACK wisdom lines
  21–28  MEDIUM attic, desk lamp: he finds the yellow pick, fits ONE new string
  28–34  CLOSE he plucks one note, warm light grows, the pick goes round his neck   (token)
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const spot = t < 0.6 ? 0 : 1;
    const shake = Math.sin(t * 40) * 2;
    return (
      <Stage>
        <Cam s={interpolate(t, [0.6, 8], [1, 1.12], cl)} cx={960} cy={760}>
          <MindStage t={t} spot={spot} faces={spot} />
          <ellipse cx={960} cy={902} rx={60} ry={10} fill="#000" opacity={0.5} />
          <Hero id="h" x={960 + shake} y={900} scale={0.5} guitar lHand={[-20, -125]} rHand={[135, -190]} expr={{brow: 0.8, lid: 0, mouth: -0.4, eyeX: Math.sin(t * 2) * 14}} />
          {spot === 0 && <rect width={1920} height={1080} fill="#000" />}
        </Cam>
        <BigWord text="THEY'LL LAUGH." x={interpolate(t, [2, 8], [2300, -400], cl)} y={430} size={120} o={interpolate(t, [2, 2.6], [0, 0.95], cl)} rot={-4} />
        <BigWord text="NOT TONIGHT." x={interpolate(t, [3.5, 8], [-500, 1700], cl)} y={680} size={100} o={interpolate(t, [3.5, 4.1], [0, 0.9], cl)} rot={3} />
      </Stage>
    );
  }
  if (t < 13) {
    const snapped = t > 8.6;
    return (
      <Stage>
        <Cam s={2.0} cx={960} cy={720}>
          <MindStage t={t} laugh={snapped ? 0.2 : 1} />
          <Hero id="h" x={960} y={900} scale={0.5} guitar lHand={[-20, -125]} rHand={[135, -190]} expr={{brow: snapped ? 0.9 : 0.6, lid: snapped ? 0.4 : 0, mouth: snapped ? -0.6 : -0.3, eyeY: snapped ? 12 : 0, tear: snapped ? interpolate(t, [10, 12.5], [0, 1], cl) : 0}} />
          {snapped && <path d="M 930 845 q 30 -40 70 -10 q 30 25 50 -20" stroke="#f0e2c0" strokeWidth={1.6} fill="none" />}
        </Cam>
        {snapped && <rect width={1920} height={1080} fill="#000" opacity={interpolate(t, [8.6, 9.4], [0, 0.35], cl)} />}
      </Stage>
    );
  }
  if (t < 21) return null;
  if (t < 28) {
    const pickUp = interpolate(t, [21.5, 22.5], [0, 1], cl);
    const fit = t > 24;
    const peg = Math.sin(t * 6) * 6;
    return (
      <Stage>
        <Cam s={1.7} cx={1100} cy={560}>
          <Attic t={t} golden={0} lamp={1} />
          <Stool x={1100} y={760} />
          {!fit ? (
            <Hero id="h" x={1100} y={804} sit pose="arms-down" rHand={[60 + pickUp * 30, -100 - pickUp * 150]} expr={{brow: 0.3 - pickUp * 0.4, lid: 0.2, mouth: 0.1 * pickUp, eyeX: 16 * pickUp, eyeY: -10 * pickUp}} />
          ) : (
            <Hero id="h" x={1100} y={804} sit guitar lHand={[-20, -125]} rHand={[205, -232 + peg]} expr={{brow: -0.1, lid: 0.2, mouth: 0.1, eyeX: 18, eyeY: 6}} />
          )}
          {!fit && pickUp > 0 && (
            <path d={`M ${1100 + 90} ${804 - 250 - 30} l 26 0 q -2 22 -13 32 q -11 -10 -13 -32 z`} fill="#f2c94c" stroke={C.outline} strokeWidth={3} />
          )}
        </Cam>
      </Stage>
    );
  }
  const warm = interpolate(t, [29, 33], [0, 1], cl);
  const tie = interpolate(t, [31, 32.2], [0, 1], cl);
  return (
    <Stage>
      <Cam s={2.4} cx={1100} cy={520} dy={40}>
        <Attic t={t} golden={0} lamp={1} />
        <Light id="warm" x={1100} y={560} r={700} color={C.amber} o={warm} />
        <Stool x={1100} y={760} />
        <Hero id="h" x={1100} y={804} sit guitar lHand={[-20, t > 29 && t < 29.3 ? -110 : -125]} rHand={[135, -190]} glow={0.6 * warm} glowColor={C.amberLight} expr={{brow: 0.2 - warm * 0.4, lid: t > 29.5 ? 0.3 : 0.05, mouth: warm * 0.5, eyeY: 6}} />
        <PickNecklace x={1100} y={804} scale={1} o={tie} sit />
      </Cam>
    </Stage>
  );
};

export const SpotClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      {t < 13 && <Counter label="SHOWS SKIPPED" showFrom={0} changes={[[0, '50']]} />}
      <Sequence from={sec(9.4)} durationInFrames={sec(3.4)}>
        <Caption text="Even his song **broke**." dur={sec(3.4)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(13)} durationInFrames={sec(4)}>
        <BlackCard text="Fear always says they'll laugh." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(17)} durationInFrames={sec(4)}>
        <BlackCard text="It never says they'll **listen**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(22.6)} durationInFrames={sec(2.6)}>
        <Caption text="One string." dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(25.4)} durationInFrames={sec(2.4)}>
        <Caption text="That's all." dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(29.6)} durationInFrames={sec(4)}>
        <Caption text="He played **one** note." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0.6} src="music/stage-hum.wav" vol={0.8} dur={8.0} fadeOut={0.1} />
      <Sfx at={10.6} src="music/low-note.wav" vol={0.55} />
      <Sfx at={13.5} src="music/resolve-piano.wav" vol={0.6} fadeIn={1} dur={15.5} fadeOut={1.5} />
      <Sfx at={29.0} src="music/brave-swell.wav" vol={0.7} />
      {/* SFX */}
      <Sfx at={0.6} src="sfx/spot-clunk.wav" vol={0.8} />
      <Sfx at={0.6} src="sfx/timpani-hit.wav" vol={0.6} />
      <Sfx at={2.3} src="sfx/voice/inner-theyll-laugh.wav" vol={0.75} />
      <Sfx at={3.0} src="sfx/crowd-laugh-muffled.wav" vol={0.3} dur={5} fadeOut={1} />
      <Sfx at={8.6} src="sfx/string-snap.wav" vol={0.8} />
      <Sfx at={21.2} src="sfx/drawer-open.wav" vol={0.5} />
      <Sfx at={24.2} src="sfx/tuning-peg.wav" vol={0.5} />
      <Sfx at={25.8} src="sfx/tuning-peg.wav" vol={0.45} />
      <Sfx at={29.0} src="sfx/one-note.wav" vol={0.7} />
      <Sfx at={29.4} src="sfx/celesta-rise.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
