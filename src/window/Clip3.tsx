import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Across, GOLD, GOLD_L, MyRoom, PhoneChat} from './sets';

/*
 THE WINDOW ACROSS — Clip 3 (32 s): the cost + the low point.
  0–7    POV phone: "art club sunday?" "we miss your paintings" → he types "busy."
  7–14   WIDE he puts the phone face down; the lamp off; the covered painting
  14–24  IMAGERY the gold window swells to fill the whole world; he is tiny; the demon towers
  24–32  CLOSE his face lit only by the gold from across, a tear
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7)
    return (
      <Stage>
        <PhoneChat t={t} name="Sam" msgs={[[0.5, 'art club sunday? 🎨'], [1.6, 'we miss your paintings']]} reply={[3.2, 'busy.']} />
      </Stage>
    );
  if (t < 14)
    return (
      <Stage>
        <MyRoom t={t} lamp={interpolate(t, [10, 10.4], [0.12, 0], cl)} scene="party" painting="covered" />
        <Hero id="h" x={1060} y={G} scale={HS} pose="arms-down" rHand={t < 9 ? [110, -230] : undefined} headTilt={-10} expr={{brow: 0.65, lid: 0.5, mouth: -0.45, eyeY: 12, bags: true}} />
      </Stage>
    );
  if (t < 24) {
    const k = interpolate(t, [14, 24], [0, 1], cl);
    const s = 1 + k * 0.9;
    return (
      <Stage bg="#08070c">
        <Cam s={s} cx={960} cy={490}>
          <Across t={t} scene="party" />
        </Cam>
        <rect y={760} width={1920} height={320} fill="#08070c" />
        <Light id="gfl" x={960} y={760} r={900} color={GOLD} o={0.35} />
        <Demon id="d" x={1200} y={990} t={t} scale={0.4} size={1.4 + k * 0.5} headTilt={-10} expr={{mouth: 0.6}} />
        <Hero id="h" x={900} y={990} scale={0.4} back pose="arms-down" />
      </Stage>
    );
  }
  return (
    <Stage>
      <Cam s={2.3} cx={1000} cy={560} dy={40}>
        <MyRoom t={t} lamp={0} scene="party" painting="covered" />
        <Light id="side" x={1500} y={500} r={600} color={GOLD} o={0.7} />
        <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" glow={0.6} glowColor={GOLD} expr={{brow: 0.8, lid: 0.2, mouth: -0.4, eyeX: 16, eyeY: -2, tear: interpolate(t, [26, 29], [0, 1], cl), bags: true}} blink={blinkAt(t, [30.5])} />
      </Cam>
    </Stage>
  );
};

export const WinClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(8.0)} durationInFrames={sec(5.4)}>
        <Caption text="He said no. To **everything**." dur={sec(5.4)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(15.0)} durationInFrames={sec(4)}>
        <Caption text="Their light made his **darker**." dur={sec(4)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(19.4)} durationInFrames={sec(3.2)}>
        <DemonSay text="you'll never be him." x={1260} y={420} dur={sec(3.2)} />
      </Sequence>
      <Sequence from={sec(25.6)} durationInFrames={sec(5.6)}>
        <Caption text="He forgot his own **light**." dur={sec(5.6)} highlight={GOLD_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.5} src="sfx/msg-pop-1.wav" vol={0.45} />
      <Sfx at={1.6} src="sfx/msg-pop-2.wav" vol={0.45} />
      <Sfx at={3.2} src="sfx/typing.wav" vol={0.4} dur={1.2} />
      <Sfx at={4.6} src="sfx/msg-sent.wav" vol={0.5} />
      <Sfx at={8.6} src="sfx/phone-tap.wav" vol={0.5} />
      <Sfx at={10.0} src="sfx/lamp-click.wav" vol={0.6} />
      <Sfx at={14.2} src="sfx/party-through-glass.wav" vol={0.35} dur={9.6} fadeIn={1} fadeOut={1} />
      <Sfx at={14.2} src="sfx/low-hum.wav" vol={0.4} dur={9.6} />
      <Sfx at={19.4} src="sfx/voice/inner-youll-never-be-him.wav" vol={0.75} />
    </AbsoluteFill>
  );
};
