import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Person, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {MyRoom, NEIGHBOUR, Rooftop} from './sets';

/*
 THE WINDOW ACROSS — Clip 5 (33 s): the rooftop.
  0–7    WIDE rooftop: the neighbour already at the railing; he walks in
  7–13   MEDIUM two-shot: "i always watched your window." / "you looked so calm."
  13–19  MEDIUM "i watched yours." They both laugh; the demon cracks and fades
  19–26  WIDE his room: he pulls the cloth off the painting
  26–33  MEDIUM he paints again - two windows
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const RG = 930;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const x = interpolate(t, [0.6, 4.6], [200, 860], cl);
    return (
      <Stage>
        <Rooftop t={t} />
        <Person id="nb" x={1320} y={RG} scale={HS} {...NEIGHBOUR} pose="arms-down" headTilt={-6} expr={{brow: 0.4, lid: 0.4, mouth: -0.2, eyeX: t > 4.6 ? -16 : 0}} />
        <ellipse cx={x} cy={RG + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        {t < 4.6 ? <HeroSide id="hs" x={x} y={RG} scale={HS} dir={1} phase={t * 6} brow={0.2} /> : <Hero id="h" x={x} y={RG} scale={HS} pose="arms-down" expr={{brow: 0.3, lid: 0.1, mouth: 0, eyeX: 16}} />}
      </Stage>
    );
  }
  if (t < 19) {
    const laugh = t > 16.2;
    const crack = interpolate(t, [15.5, 18.5], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.5} cx={1080} cy={RG} dy={-170}>
          <Rooftop t={t} />
          <Demon id="d" x={640} y={RG} t={t} scale={HS} size={1.0 - crack * 0.4} crack={crack} glow={1 - crack * 0.7} opacity={1 - crack * 0.8} expr={{brow: 0.5, mouth: -0.4, lid: 0.5}} />
          <Hero id="h" x={900} y={RG} scale={HS} pose="arms-down" expr={{brow: laugh ? -0.1 : 0.4, lid: laugh ? 0.6 : 0.1, mouth: laugh ? 0.9 : 0, eyeX: 16}} blink={blinkAt(t, [11.3])} />
          <Person id="nb" x={1260} y={RG} scale={HS} {...NEIGHBOUR} pose="arms-down" expr={{brow: laugh ? -0.1 : 0.5, lid: laugh ? 0.6 : 0.2, mouth: laugh ? 0.9 : -0.1, eyeX: -16}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 26) {
    const off = t > 21.2;
    return (
      <Stage>
        <MyRoom t={t} lamp={1} scene="calm" painting={off ? 'open' : 'covered'} />
        <Hero id="h" x={520} y={G} scale={HS} pose="arms-down" rHand={t > 20.4 && t < 21.6 ? [160, -360] : undefined} expr={{brow: -0.2, lid: 0.1, mouth: 0.5, eyeX: 14}} />
      </Stage>
    );
  }
  const stroke = Math.sin(t * 3) * 18;
  return (
    <Stage>
      <Cam s={1.6} cx={700} cy={560} dy={-20}>
        <MyRoom t={t} lamp={1} scene="calm" painting={t > 28.5 ? 'new' : 'open'} />
        <Hero id="h" x={500} y={G} scale={HS} pose="arms-down" rHand={[150, -300 + stroke]} expr={{brow: -0.2, lid: 0.2, mouth: 0.7, eyeX: 14, eyeY: -4}} />
      </Cam>
    </Stage>
  );
};

export const WinClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(1.0)} durationInFrames={sec(5)}>
        <Caption text="On the roof, they finally **met**." dur={sec(5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(7.6)} durationInFrames={sec(2.8)}>
        <HeadPill text="i always watched your window." x={1350} y={150} dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(10.6)} durationInFrames={sec(2.4)}>
        <HeadPill text="you looked so calm." x={1350} y={150} dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(13.4)} durationInFrames={sec(2.6)}>
        <HeadPill text="i watched yours." x={810} y={150} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(16.4)} durationInFrames={sec(2.5)}>
        <Caption text="They both **laughed**." dur={sec(2.5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(20.0)} durationInFrames={sec(5.6)}>
        <Caption text="He picked up the brush **again**." dur={sec(5.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(27.0)} durationInFrames={sec(5.6)}>
        <Caption text="This time, he painted **both** windows." dur={sec(5.6)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0} src="sfx/wind.wav" vol={0.2} dur={19} fadeIn={1} fadeOut={1} />
      <Sfx at={0.6} src="sfx/footsteps.wav" vol={0.35} dur={4} />
      <Sfx at={16.2} src="sfx/soft-laugh.wav" vol={0.45} />
      <Sfx at={15.6} src="sfx/glass-crack.wav" vol={0.35} />
      <Sfx at={21.0} src="sfx/cloth.wav" vol={0.5} />
      <Sfx at={26.2} src="sfx/brush-strokes.wav" vol={0.45} dur={6.6} />
    </AbsoluteFill>
  );
};
