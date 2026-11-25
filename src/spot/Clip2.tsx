import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob, DemonGrip, DemonSay} from './demonShim';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {Attic, PURPLE, PURPLE_L, Street} from './sets';

/*
 SPOTLIGHT — Clip 2 (33 s): the habit repeats. Same street shot, the Blob grows, counter jumps.
  0–6    WIDE street night 5: he reaches for the door, Blob "not tonight.", he turns away
  6–11   WIDE attic night: he scrolls on the bed edge, purple glow; guitar in the corner
  11–17  WIDE street night 17: Blob his size leans in, "they'll laugh."; he doesn't even reach
  17–24  MEDIUM the guitar in the corner, days dissolve, dust gathers
  24–33  WIDE street night 50, rain: the Blob rides his shoulders; he walks past without looking
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const inK = interpolate(t, [0, 2], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const reach = interpolate(t, [2.3, 3.2, 4.0, 4.5], [0, 1, 1, 0], {...cl, easing: io});
    const out = interpolate(t, [4.7, 6], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
    const x = 700 + inK * 560 - out * 500;
    return (
      <Stage>
        <Street t={t} dusk={0.5} />
        <Blob id="b" x={1120} y={862} t={t} size={0.45} accent={PURPLE} lean={0.8} eyeX={10} smile={0.9} />
        <ellipse cx={x} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
        <Hero id="h" x={x} y={900} scale={0.85} walk={t < 2 || t > 4.7 ? t * 9 : undefined} pose="arms-down"
          rHand={reach > 0 ? [92 + reach * 30, -100 - reach * 51] : undefined}
          expr={{brow: 0.2 + 0.4 * (t > 3.4 ? 1 : 0), lid: 0.15, mouth: t > 3.4 ? -0.3 : 0.2, eyeX: t > 3.4 ? -14 : 14}} />
      </Stage>
    );
  }
  if (t < 11) {
    const thumb = (Math.sin(t * 7) + 1) / 2;
    return (
      <Stage>
        <Attic t={t} golden={0} guitarInCorner phoneGlow={0.7} />
        <ellipse cx={330} cy={872} rx={90} ry={12} fill="#000" opacity={0.3} />
        <Hero id="h" x={330} y={772} scale={0.9} sit pose="phone" glow={0.9} glowColor={PURPLE} thumb={thumb} expr={{brow: 0.1, lid: 0.5, mouth: 0, eyeY: 12, bags: true}} blink={blinkAt(t, [8.6])} />
      </Stage>
    );
  }
  if (t < 17) {
    const x = interpolate(t, [11, 12.4], [1060, 1270], {...cl, easing: Easing.out(Easing.quad)});
    const shrink = interpolate(t, [13.2, 14], [0, 1], cl);
    return (
      <Stage>
        <Street t={t} dusk={0.2} />
        <Blob id="b" x={1110} y={862} t={t} size={0.9} accent={PURPLE} lean={1} eyeX={14} smile={1} glow={0.9} />
        <ellipse cx={x} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
        <Hero id="h" x={x} y={900} scale={0.85} walk={t < 12.4 ? t * 8 : undefined} pose="arms-down" lean={4 * shrink} headTilt={-5 * shrink}
          expr={{brow: 0.2 + 0.5 * shrink, lid: 0.2, mouth: -0.4 * shrink, eyeX: -12, eyeY: 8 * shrink}} />
      </Stage>
    );
  }
  if (t < 24) {
    const dust = interpolate(t, [17, 24], [0, 1], cl);
    const ph = (t - 17) / 7 * 3; // three days
    const dark = Math.pow(Math.sin(Math.PI * (ph % 1)), 0.0) * 0 + Math.max(0, 1 - Math.abs((ph % 1) - 0.5) * 6) * 0.85;
    return (
      <Stage>
        <Cam s={1.8} cx={1420} cy={640}>
          <Attic t={t} golden={Math.floor(ph) % 2 === 0 ? 1 : 0} guitarInCorner dust={dust} />
        </Cam>
        <rect width={1920} height={1080} fill="#000" opacity={dark} />
      </Stage>
    );
  }
  const x = interpolate(t, [24.3, 32.8], [250, 1600], cl);
  return (
    <Stage>
      <Street t={t} dusk={0} rain={1} />
      <ellipse cx={x} cy={902} rx={110} ry={14} fill="#000" opacity={0.35} />
      <Blob id="b" x={x} y={902} t={t} size={0.95} accent={PURPLE} lid={0.6} smile={1} glow={1} reach={[[-55, -220], [55, -220]]} />
      <Hero id="h" x={x} y={900} scale={0.85} walk={t * 5} pose="arms-down" lean={6} headTilt={-8} expr={{brow: 0.5, lid: 0.55, mouth: -0.4, eyeY: 12, bags: true}} />
    </Stage>
  );
};

export const SpotClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="SHOWS SKIPPED" showFrom={0} changes={[[0, '5'], [sec(11), '17'], [sec(24), '50']]} />
      <Sequence from={sec(3.0)} durationInFrames={sec(2.2)}>
        <DemonSay text="not tonight." x={760} y={450} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(4.6)} durationInFrames={sec(1.4)}>
        <Caption text="Not tonight." dur={sec(1.4)} />
      </Sequence>
      <Sequence from={sec(6.5)} durationInFrames={sec(4.0)}>
        <Caption text="Maybe next **week**." dur={sec(4.0)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(12.6)} durationInFrames={sec(2.2)}>
        <DemonSay text="they'll laugh." x={430} y={290} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(13.8)} durationInFrames={sec(3.0)}>
        <Caption text="The voice got **bigger**." dur={sec(3.0)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(18.0)} durationInFrames={sec(5.5)}>
        <Caption text="The guitar got **quiet**." dur={sec(5.5)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(26.0)} durationInFrames={sec(5.0)}>
        <Caption text="He stopped **looking**." dur={sec(5.0)} highlight={PURPLE_L} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/dark-keys.wav" from={8.2} vol={0.65} dur={25.5} fadeOut={1.8} />
      <Sfx at={23.5} src="music/sad-cello.wav" vol={0.75} fadeIn={1.5} />
      {/* SFX */}
      <Sfx at={0} src="sfx/street-amb.wav" vol={0.3} dur={6} fadeOut={0.5} />
      <Sfx at={0} src="sfx/steps-street.wav" vol={0.35} dur={2} />
      <Sfx at={3.0} src="sfx/voice/inner-not-tonight.wav" vol={0.7} />
      <Sfx at={3.2} src="sfx/door-bell-almost.wav" vol={0.3} />
      <Sfx at={4.7} src="sfx/steps-street.wav" vol={0.3} dur={1.3} />
      <Sfx at={7.0} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={8.3} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={9.7} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={11} src="sfx/street-amb.wav" vol={0.3} dur={6} fadeOut={0.5} />
      <Sfx at={11} src="sfx/steps-street.wav" vol={0.3} dur={1.4} />
      <Sfx at={12.6} src="sfx/goo.wav" vol={0.4} />
      <Sfx at={17.2} src="sfx/clock-tick.wav" vol={0.3} dur={6.5} />
      <Sfx at={24} src="sfx/rain.wav" vol={0.45} dur={9} fadeIn={0.4} />
      <Sfx at={24.3} src="sfx/heavy-steps.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
