import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Across, MyRoom, TwoBuildings} from './sets';
import {WindowShot} from './shots';

/*
 THE WINDOW ACROSS — Clip 6 (33 s): the mirrored ending + lesson.
  0–7    WIDE the same shot as the opening: he paints by the lamp; across, a calm light
  7–14   POV across: the neighbour waves from his window
  14–21  WINDOW SHOT (reversed): he waves back
  21–29  WIDE outside: two buildings, two lit windows facing each other
  29–33  BLACK lesson
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const stroke = Math.sin(t * 3) * 18;
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 7], [1, 1.04], cl)} cx={900} cy={600}>
          <MyRoom t={t} lamp={1} scene="calm" painting="new" noodles={false} />
          <ellipse cx={500} cy={G + 4} rx={80} ry={12} fill="#000" opacity={0.35} />
          <Hero id="h" x={500} y={G} scale={HS} pose="arms-down" rHand={[150, -300 + stroke]} expr={{brow: -0.2, lid: 0.2, mouth: 0.6, eyeX: 14, eyeY: -4}} blink={blinkAt(t, [4.2])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 14)
    return (
      <Stage>
        <Cam s={interpolate(t, [7, 14], [1.0, 1.08], cl)} cx={960} cy={490}>
          <Across t={t} scene="wave" />
        </Cam>
      </Stage>
    );
  if (t < 21) return <WindowShot t={t} scene="wave" lamp={1} wave push={(t - 14) / 7} painting="new" />;
  if (t < 29)
    return (
      <Stage>
        <Cam s={interpolate(t, [21, 29], [1.08, 1.0], cl)} cx={960} cy={540}>
          <TwoBuildings t={t} />
        </Cam>
      </Stage>
    );
  return null;
};

export const WinClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      {t < 29 && <FilmLook />}
      <Sequence from={sec(1.0)} durationInFrames={sec(5.4)}>
        <Caption text="He painted every night. **Again**." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(8.0)} durationInFrames={sec(5.4)}>
        <Caption text="Across the street, a **friend**." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(15.0)} durationInFrames={sec(5.4)}>
        <Caption text="Two windows. Both **real**." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(22.0)} durationInFrames={sec(6.4)}>
        <Caption text="He kept his light **on**." dur={sec(6.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(29)} durationInFrames={sec(4)}>
        <BlackCard text="You only see their **window**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.2} src="sfx/brush-strokes.wav" vol={0.4} dur={6.6} />
      <Sfx at={21} src="sfx/wind.wav" vol={0.15} dur={8} fadeIn={1} fadeOut={1} />
      <Sfx at={29.3} src="sfx/pen-write.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
