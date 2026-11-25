import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Across, GOLD_L, MyRoom} from './sets';

/*
 THE WINDOW ACROSS — Clip 1 (32 s): normal life + the comparison starts.
  0–4    BLACK hook
  4–10   WIDE his room at night, he paints by the warm lamp                 → who he is
  10–16  POV the gold window across: a dinner, laughter, a toast           → what he sees
  16–22  MEDIUM cold noodles, a quiet phone, his unfinished painting      → his life feels small
  22–27  WIDE a small demon rises behind the easel: "look at him."
  27–32  MEDIUM he turns his lamp down one notch                           → the first step down
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const stroke = Math.sin(t * 3) * 18;
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1, 1.04], cl)} cx={900} cy={600}>
          <MyRoom t={t} lamp={1} scene="party" />
          <ellipse cx={500} cy={G + 4} rx={80} ry={12} fill="#000" opacity={0.35} />
          <Hero id="h" x={500} y={G} scale={HS} pose="arms-down" rHand={[150, -300 + stroke]} expr={{brow: -0.1, lid: 0.2, mouth: 0.4, eyeX: 14, eyeY: -4}} blink={blinkAt(t, [7.2])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 16) {
    const look = t < 11.4;
    if (look)
      return (
        <Stage>
          <Cam s={1.6} cx={700} cy={560} dy={-20}>
            <MyRoom t={t} lamp={1} scene="party" />
            <Hero id="h" x={500} y={G} scale={HS} pose="arms-down" headTilt={6} expr={{brow: 0.1, lid: 0.1, mouth: 0.1, eyeX: 18, eyeY: -6}} />
          </Cam>
        </Stage>
      );
    return (
      <Stage>
        <Cam s={interpolate(t, [11.4, 16], [1.0, 1.1], cl)} cx={960} cy={490}>
          <Across t={t} scene="party" />
        </Cam>
      </Stage>
    );
  }
  if (t < 22)
    return (
      <Stage>
        <Cam s={1.55} cx={1000} cy={700} dy={-80}>
          <MyRoom t={t} lamp={1} scene="party" />
          <Hero id="h" x={1260} y={G} scale={HS} pose="arms-down" lean={4} headTilt={-8} expr={{brow: 0.55, lid: 0.35, mouth: -0.3, eyeX: -16, eyeY: 12}} blink={blinkAt(t, [19.4])} />
        </Cam>
      </Stage>
    );
  if (t < 27) {
    const rise = interpolate(t, [22.4, 24.0], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return (
      <Stage>
        <MyRoom t={t} lamp={1} scene="party" />
        <g clipPath="url(#riseclip1)">
          <defs>
            <clipPath id="riseclip1">
              <rect x={0} y={0} width={1920} height={G + 6} />
            </clipPath>
          </defs>
          <Demon id="d" x={790} y={G + (1 - rise) * 420} t={t} scale={HS} size={0.75} glow={rise} headTilt={10} lean={4} expr={{eyeX: 12}} />
        </g>
        <ellipse cx={1260} cy={G + 4} rx={80} ry={12} fill="#000" opacity={0.35} />
        <Hero id="h" x={1260} y={G} scale={HS} pose="arms-down" expr={{brow: 0.4, lid: 0.3, mouth: -0.2, eyeX: 16, eyeY: -6}} />
      </Stage>
    );
  }
  const dim = interpolate(t, [28.6, 29.2], [1, 0.6], cl);
  return (
    <Stage>
      <Cam s={1.5} cx={1080} cy={680} dy={-60}>
        <MyRoom t={t} lamp={dim} scene="party" />
        <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" rHand={t > 27.8 && t < 29.6 ? [120, -270] : undefined} expr={{brow: 0.45, lid: 0.4, mouth: -0.3, eyeX: 14, eyeY: 4}} />
      </Cam>
    </Stage>
  );
};

export const WinClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="His window was always **darker**." dur={sec(4)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(4.8)} durationInFrames={sec(4.6)}>
        <Caption text="He painted every **night**." dur={sec(4.6)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(11.8)} durationInFrames={sec(3.8)}>
        <Caption text="Then he looked **across**." dur={sec(3.8)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(16.6)} durationInFrames={sec(4.8)}>
        <Caption text="His life looked **small**." dur={sec(4.8)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(24.2)} durationInFrames={sec(2.6)}>
        <DemonSay text="look at him." x={900} y={330} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(29.0)} durationInFrames={sec(2.8)}>
        <Caption text="So he started to **compare**." dur={sec(2.8)} highlight={GOLD_L} />
      </Sequence>
      {/* SFX only (music is delivered separately) */}
      <Sfx at={0.5} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={4.2} src="sfx/brush-strokes.wav" vol={0.45} dur={5.6} />
      <Sfx at={11.4} src="sfx/party-through-glass.wav" vol={0.5} dur={4.6} fadeIn={0.4} fadeOut={0.6} />
      <Sfx at={13.6} src="sfx/glass-clink.wav" vol={0.25} />
      <Sfx at={17.0} src="sfx/cutlery.wav" vol={0.25} />
      <Sfx at={22.4} src="sfx/low-hum.wav" vol={0.35} dur={2.4} />
      <Sfx at={24.2} src="sfx/voice/inner-look-at-him.wav" vol={0.7} />
      <Sfx at={28.6} src="sfx/lamp-click.wav" vol={0.6} />
    </AbsoluteFill>
  );
};
