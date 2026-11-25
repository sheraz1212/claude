import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {GOLD_L, MyRoom} from './sets';
import {WindowShot} from './shots';

/*
 THE WINDOW ACROSS — Clip 2 (33 s): it repeats. The SAME window shot, night after night.
  0–6    WINDOW SHOT night 1: a medal across; the demon beside him: "look at you."
  6–11   WIDE he covers his painting with a cloth                       → he gives up his own thing
  11–17  WINDOW SHOT night 2: friends + a guitar across; demon bigger: "you're behind."
  17–22  WIDE dim room, he eats alone, phone glow
  22–28  WINDOW SHOT night 3: a birthday across; the demon towers over him
  28–33  WIDE his room almost dark, the gold light across bright
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;
const fadeEdge = (t: number, a: number, b: number) => Math.max(0, 1 - Math.abs(t - (a + b) / 2) / ((b - a) / 2));

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) return <WindowShot t={t} scene="medal" lamp={0.6} demon={0.85} push={t / 6} />;
  if (t < 11) {
    const cover = t > 8.6;
    return (
      <Stage>
        <MyRoom t={t} lamp={0.5} scene="medal" painting={cover ? 'covered' : 'open'} />
        <Hero id="h" x={520} y={G} scale={HS} pose="arms-down" rHand={t > 7.4 && t < 8.8 ? [150, -330] : undefined} headTilt={-8} expr={{brow: 0.6, lid: 0.4, mouth: -0.4, eyeX: 14}} />
      </Stage>
    );
  }
  if (t < 17) return <WindowShot t={t} scene="guitar" lamp={0.45} demon={1.0} push={(t - 11) / 6} painting="covered" />;
  if (t < 22)
    return (
      <Stage>
        <MyRoom t={t} lamp={0.35} scene="guitar" painting="covered" />
        <Hero id="h" x={1060} y={G} scale={HS} pose="phone" glow={0.8} glowColor="#8fb8f0" expr={{brow: 0.5, lid: 0.5, mouth: -0.3, eyeY: 12, bags: true}} thumb={Math.sin(t * 6) > 0.6 ? 1 : 0} blink={blinkAt(t, [19.8])} />
      </Stage>
    );
  if (t < 28) return <WindowShot t={t} scene="cake" lamp={0.25} demon={1.2} push={(t - 22) / 6} painting="covered" />;
  return (
    <Stage>
      <MyRoom t={t} lamp={interpolate(t, [28, 31], [0.25, 0.08], cl)} scene="cake" painting="covered" />
      <Demon id="d" x={760} y={G} t={t} scale={HS} size={1.15} headTilt={8} />
      <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" lean={5} headTilt={-10} expr={{brow: 0.7, lid: 0.55, mouth: -0.4, eyeX: 16, eyeY: -4, bags: true}} />
    </Stage>
  );
};

export const WinClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const black = Math.max(fadeEdge(t, 5.8, 6.2), fadeEdge(t, 16.8, 17.2), fadeEdge(t, 27.8, 28.2));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <AbsoluteFill style={{background: '#000', opacity: Math.min(1, black)}} />
      <FilmLook />
      <Sequence from={sec(2.4)} durationInFrames={sec(2.6)}>
        <DemonSay text="look at you." x={1150} y={250} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(7.0)} durationInFrames={sec(3.8)}>
        <Caption text="He stopped **painting**." dur={sec(3.8)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(12.0)} durationInFrames={sec(2.6)}>
        <DemonSay text="you're behind." x={1150} y={230} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(14.6)} durationInFrames={sec(2.2)}>
        <Caption text="Every night, the same **window**." dur={sec(2.2)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(17.8)} durationInFrames={sec(4)}>
        <Caption text="His own nights felt **empty**." dur={sec(4)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(4.2)}>
        <Caption text="Their light grew. His went **out**." dur={sec(4.2)} highlight={GOLD_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.2} src="sfx/party-through-glass.wav" vol={0.3} dur={5.6} fadeOut={0.8} />
      <Sfx at={2.4} src="sfx/voice/inner-look-at-you.wav" vol={0.7} />
      <Sfx at={8.4} src="sfx/cloth.wav" vol={0.5} />
      <Sfx at={11.2} src="sfx/party-through-glass.wav" from={2} vol={0.3} dur={5.6} fadeOut={0.8} />
      <Sfx at={12.0} src="sfx/voice/inner-youre-behind.wav" vol={0.7} />
      <Sfx at={18.0} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={19.6} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={22.2} src="sfx/party-through-glass.wav" from={4} vol={0.3} dur={4} fadeOut={0.8} />
      <Sfx at={24.0} src="sfx/claps.wav" vol={0.2} />
      <Sfx at={29.0} src="sfx/lamp-click.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
