import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob, DemonSay} from './demonShim';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Person, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {Attic, Cafe, CafeFg, MIA, Notes, PURPLE, PURPLE_L, Stool, Street} from './sets';

/*
 SPOTLIGHT — Clip 1 (32 s): hook + normal life + the habit starts.
  0–4     BLACK hook
  4–10    WIDE café from the back: Mia on stage, he in the last seat mouthing the words   → place + who he is
  10–16   MEDIUM attic, golden hour: he plays to a plant, eyes closed                     → his joy
  16–22   WIDE street at dusk: he walks past the OPEN MIC poster and stops                → the chance
  22–27   MEDIUM at the door: a tiny Blob slides out of the shadow: "they'll laugh."     → it arrives
  27–32   WIDE he backs off and walks home under the lamp; counter 1                      → first retreat
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const strum = Math.sin(t * 9) * 12;
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1.0, 1.06], cl)} cx={1200} cy={240}>
          <Cafe t={t} crowd={7} />
          <Person id="mia" x={880} y={562} scale={0.55} showLegs {...MIA} guitar lHand={[-20, -125 + strum]} rHand={[135, -190]} expr={{brow: 0, lid: 0.35, mouth: 0.5}} headTilt={Math.sin(t * 1.6) * 4} />
          <Hero id="h" x={1560} y={1000} scale={1.1} pose="arms-down" expr={{brow: -0.05, lid: 0.15, mouth: 0.15 + 0.45 * Math.abs(Math.sin(t * 5.2)), eyeX: -14, eyeY: -4}} headTilt={Math.sin(t * 1.6) * 4} blink={blinkAt(t, [6.2, 8.9])} />
          <CafeFg />
        </Cam>
      </Stage>
    );
  }
  if (t < 16) {
    const strum = Math.sin(t * 8.5) * 13;
    return (
      <Stage>
        <Cam s={1.7} cx={960} cy={560} dx={interpolate(t, [10, 16], [0, -20], cl)}>
          <Attic t={t} golden={1} />
          <Stool x={960} y={760} />
          <Hero id="h" x={960} y={804} scale={1} sit guitar lHand={[-20, -125 + strum]} rHand={[135, -190]} expr={{brow: -0.1, lid: 1, mouth: 0.6}} headTilt={Math.sin(t * 1.5) * 6} />
          <Notes t={t} x={1130} y={470} n={5} />
        </Cam>
      </Stage>
    );
  }
  if (t < 22) {
    const k = interpolate(t, [16.3, 19.8], [0, 1], cl);
    const x = 150 + k * 1150;
    const walking = t > 16.3 && t < 19.8;
    return (
      <Stage>
        <Street t={t} dusk={1} />
        <ellipse cx={x} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
        <Hero id="h" x={x} y={900} scale={0.85} showLegs walk={walking ? t * 9 : 0} pose="arms-down" expr={{brow: 0, lid: 0.1, mouth: t > 20 ? 0.5 : 0.2, eyeX: t > 19.6 ? 14 : 0, eyeY: t > 19.6 ? -6 : 0}} blink={blinkAt(t, [20.7])} />
      </Stage>
    );
  }
  if (t < 27) {
    const grow = interpolate(t, [22.8, 24.2], [0, 1], {...cl, easing: Easing.out(Easing.back(1.4))});
    const scared = interpolate(t, [25.2, 25.8], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.6} cx={1250} cy={640}>
          <Street t={t} dusk={0.9} />
          {grow > 0.01 && <Blob id="b" x={1120} y={862} t={t} size={0.3 * grow} opacity={grow} accent={PURPLE} lean={0.7} eyeX={8} smile={0.8} glow={0.8} />}
          <ellipse cx={1300} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
          <Hero
            id="h"
            x={1300}
            y={900}
            scale={0.85}
            showLegs
            pose="arms-down"
            lean={-4 * scared}
            expr={{brow: -0.1 + 0.7 * scared, lid: 0.1, mouth: 0.5 - 0.9 * scared, eyeX: t > 24.3 ? -16 : 14, eyeY: t > 24.3 ? 10 : -6}}
            blink={blinkAt(t, [24.4])}
          />
        </Cam>
      </Stage>
    );
  }
  const k = interpolate(t, [27.8, 32], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const x = 1300 - k * 1000;
  return (
    <Stage>
      <Street t={t} dusk={0.8} />
      <Blob id="b" x={1120} y={862} t={t} size={0.3} accent={PURPLE} lean={-0.6} eyeX={-10} smile={1} glow={0.8} />
      <ellipse cx={x} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
      <Hero id="h" x={x} y={900} scale={0.85} showLegs walk={t > 27.8 ? t * 6.5 : 0} pose="arms-down" headTilt={-6} expr={{brow: 0.6, lid: 0.35, mouth: -0.4, eyeY: 10}} />
    </Stage>
  );
};

export const SpotClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Counter label="SHOWS SKIPPED" showFrom={sec(30)} changes={[[0, '1']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He had a **voice**. Once." dur={sec(4)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(4.6)} durationInFrames={sec(3.4)}>
        <Caption text="He knew every **song**." dur={sec(3.4)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(10.4)} durationInFrames={sec(2.6)}>
        <Caption text="He sang them every night." dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(13.2)} durationInFrames={sec(2.6)}>
        <Caption text="Only for the **walls**." dur={sec(2.6)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(17.0)} durationInFrames={sec(3.4)}>
        <Caption text="Then he saw **it**." dur={sec(3.4)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(24.5)} durationInFrames={sec(2.5)}>
        <DemonSay text="they'll laugh." x={760} y={400} dur={sec(2.5)} />
      </Sequence>
      <Sequence from={sec(28.2)} durationInFrames={sec(3.5)}>
        <Caption text="So he **didn't**." dur={sec(3.5)} highlight={PURPLE_L} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={1.5} src="music/warm-jazz.wav" vol={0.75} dur={8.8} fadeIn={2} fadeOut={1} />
      <Sfx at={10.0} src="sfx/his-song.wav" vol={0.55} dur={6.4} fadeOut={1} />
      <Sfx at={16.0} src="music/warm-jazz.wav" from={12} vol={0.632} dur={7.2} fadeIn={0.8} fadeOut={1.2} />
      <Sfx at={23.0} src="sfx/piano-hit-low.wav" vol={0.7} />
      <Sfx at={23.0} src="music/creep-sting.wav" vol={0.632} />
      <Sfx at={23.8} src="music/dark-keys.wav" vol={0.671} fadeIn={1.5} />
      {/* SFX */}
      <Sfx at={4.0} src="sfx/canteen-ambience.wav" vol={0.276} dur={6.2} fadeIn={0.5} fadeOut={0.8} />
      <Sfx at={8.2} src="sfx/cup-tap.wav" vol={0.276} />
      <Sfx at={10.5} src="sfx/chair-creak.wav" vol={0.237} />
      <Sfx at={16.0} src="sfx/street-amb.wav" vol={0.316} dur={16} />
      <Sfx at={16.3} src="sfx/steps-street.wav" vol={0.395} dur={3.6} />
      <Sfx at={23.2} src="sfx/goo.wav" vol={0.474} />
      <Sfx at={27.8} src="sfx/steps-street.wav" vol={0.276} dur={4.2} />
    </AbsoluteFill>
  );
};
