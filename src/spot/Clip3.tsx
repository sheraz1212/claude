import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob, DemonGrip, DemonSay} from './demonShim';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Attic, PURPLE, PURPLE_L, Rain, Street} from './sets';

/*
 SPOTLIGHT — Clip 3 (32 s): the cost.
  0–6    POV his phone: Mia "last open mic friday 🎸" / "u coming?" → he types "can't."
  6–13   WIDE street, rain: inside the window the crowd claps for someone else; he stands outside
  13–20  CLOSE head + shoulders in the rain, window glow on his face, a tear      → big emotion
  20–26  MEDIUM the Blob drapes over him like a wet blanket: "stay."
  26–32  WIDE attic in the dark; he sits on the bed, guitar left in the corner
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Bubble: React.FC<{x: number; y: number; text: string; me?: boolean; o: number}> = ({x, y, text, me, o}) => (
  <g opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
    <rect x={me ? x - text.length * 14.5 - 40 : x} y={y} width={text.length * 14.5 + 40} height={64} rx={30} fill={me ? PURPLE : '#e9e4f2'} />
    <text x={me ? x - 20 : x + 20} y={y + 43} textAnchor={me ? 'end' : 'start'} fontFamily="Nunito" fontWeight={700} fontSize={28} fill={me ? '#fff' : C.outline}>
      {text}
    </text>
  </g>
);

const Phone: React.FC<{t: number}> = ({t}) => {
  const typed = "can't.".slice(0, Math.max(0, Math.floor((t - 3.2) * 5)));
  const sent = t > 4.6;
  return (
    <Stage bg="#1d1a26">
      <Light id="pl" x={960} y={540} r={700} color={PURPLE} o={0.7} />
      <g transform={`translate(0 ${interpolate(t, [0, 6], [10, -10], cl)})`}>
        <rect x={700} y={80} width={520} height={920} rx={56} fill="#15141b" stroke={C.outline} strokeWidth={6} />
        <rect x={724} y={110} width={472} height={860} rx={40} fill="#f7f5fb" />
        <rect x={724} y={110} width={472} height={110} rx={40} fill="#ece6f7" />
        <circle cx={790} cy={165} r={30} fill="#c9ad86" stroke={C.outline} strokeWidth={3} />
        <path d="M 766 180 q 24 12 48 0 l -2 10 q -22 12 -44 0 z" fill="#e07b39" />
        <text x={835} y={176} fontFamily="Nunito" fontWeight={800} fontSize={32} fill={C.outline}>Mia</text>
        <Bubble x={750} y={260} text="last open mic friday 🎸" o={interpolate(t, [0.4, 0.8], [0, 1], cl)} />
        <Bubble x={750} y={345} text="u coming?" o={interpolate(t, [1.4, 1.8], [0, 1], cl)} />
        <Bubble x={750} y={430} text="i saved u a spot" o={interpolate(t, [2.2, 2.6], [0, 1], cl)} />
        {sent && <Bubble x={1170} y={540} text="can't." me o={interpolate(t, [4.6, 5.0], [0, 1], cl)} />}
        <rect x={744} y={880} width={432} height={66} rx={33} fill="#fff" stroke="#d6d0e2" strokeWidth={3} />
        <text x={772} y={923} fontFamily="Nunito" fontWeight={700} fontSize={30} fill={C.outline}>{sent ? '' : typed}</text>
        {!sent && t > 3 && Math.floor(t * 3) % 2 === 0 && <rect x={774 + typed.length * 15} y={898} width={3} height={32} fill={PURPLE} />}
        {t > 5.4 && <text x={1170} y={630} textAnchor="end" fontFamily="Nunito" fontSize={22} fill="#9a95a8">seen</text>}
      </g>
    </Stage>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) return <Phone t={t} />;
  if (t < 13)
    return (
      <Stage>
        <Cam s={interpolate(t, [6, 13], [1, 1.08], cl)} cx={1000} cy={700}>
          <Street t={t} dusk={0} rain={1} clap={t > 7.5 ? 1 : 0} />
          <ellipse cx={1000} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
          <Hero id="h" x={1000} y={900} scale={0.85} pose="arms-down" expr={{brow: 0.4, lid: 0.25, mouth: -0.1, eyeX: -14, eyeY: -4}} blink={blinkAt(t, [10.2])} />
        </Cam>
      </Stage>
    );
  if (t < 20) {
    const tear = interpolate(t, [15.5, 18.5], [0, 1], cl);
    return (
      <Stage>
        <Cam s={2.4} cx={1000} cy={600} dy={60}>
          <Street t={t} dusk={0} clap={1} />
          <Light id="wg" x={900} y={560} r={420} color={C.amberLight} o={0.5} />
          <Hero id="h" x={1000} y={900} scale={0.85} pose="arms-down" glow={0.5} glowColor={C.amberLight} expr={{brow: 0.75, lid: 0.3, mouth: -0.3, eyeX: -12, tear}} blink={blinkAt(t, [14.6, 18.9])} />
        </Cam>
        <Rain t={t} o={0.8} />
        <rect width={1920} height={1080} fill="#1a2040" opacity={0.22} />
      </Stage>
    );
  }
  if (t < 26) {
    const drape = interpolate(t, [20.3, 21.6], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const x = 1000;
    return (
      <Stage>
        <Cam s={1.15} cx={1000} cy={620}>
          <Street t={t} dusk={0} rain={1} clap={0.4} />
          <ellipse cx={x} cy={902} rx={110} ry={14} fill="#000" opacity={0.35} />
          <Blob id="b" x={x} y={902} t={t} size={0.3 + 0.9 * drape} opacity={Math.min(1, drape * 1.5)} accent={PURPLE} lid={0.6} smile={1} glow={1} />
          <Hero id="h" x={x} y={900 } scale={0.85} pose="arms-down" lean={7 * drape} headTilt={-8 * drape} expr={{brow: 0.6, lid: 0.5, mouth: -0.4, eyeY: 10, bags: true}} />
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <Attic t={t} golden={0} guitarInCorner dust={1} />
      <rect width={1920} height={1080} fill="#0c0a14" opacity={interpolate(t, [26, 32], [0.25, 0.55], cl)} />
      <ellipse cx={330} cy={872} rx={90} ry={12} fill="#000" opacity={0.3} />
      <Hero id="h" x={330} y={772} scale={0.9} sit pose="arms-down" lean={8} headTilt={-10} expr={{brow: 0.5, lid: 0.55, mouth: -0.3, eyeY: 14, bags: true}} />
      <Blob id="b" x={540} y={862} t={t} size={0.55} accent={PURPLE} lean={-0.8} lid={0.7} smile={1} glow={0.7} />
    </Stage>
  );
};

export const SpotClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="SHOWS SKIPPED" showFrom={0} changes={[[0, '50']]} />
      <Sequence from={sec(7.0)} durationInFrames={sec(5.5)}>
        <Caption text="Others stood in **his** light." dur={sec(5.5)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(14.2)} durationInFrames={sec(2.8)}>
        <Caption text="He clapped." dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(17.2)} durationInFrames={sec(2.6)}>
        <Caption text="From **outside**." dur={sec(2.6)} highlight={PURPLE_L} />
      </Sequence>
      <Sequence from={sec(22.2)} durationInFrames={sec(3.4)}>
        <DemonSay text="stay." x={1180} y={330} dur={sec(3.4)} size={70} />
      </Sequence>
      <Sequence from={sec(27.0)} durationInFrames={sec(4.8)}>
        <Caption text="Safe. And **silent**." dur={sec(4.8)} highlight={PURPLE_L} />
      </Sequence>
      {/* MUSIC: sad cello continues from clip 2 */}
      <Sfx at={0} src="music/sad-cello.wav" from={9.5} vol={0.8} dur={23.5} fadeOut={2.5} />
      {/* SFX */}
      <Sfx at={0.4} src="sfx/msg-pop-1.wav" vol={0.45} />
      <Sfx at={1.4} src="sfx/msg-pop-2.wav" vol={0.45} />
      <Sfx at={2.2} src="sfx/msg-pop-3.wav" vol={0.45} />
      <Sfx at={3.2} src="sfx/typing.wav" vol={0.4} dur={1.3} />
      <Sfx at={4.6} src="sfx/msg-sent.wav" vol={0.5} />
      <Sfx at={6} src="sfx/rain.wav" vol={0.45} dur={20} fadeIn={0.5} fadeOut={1} />
      <Sfx at={7.5} src="sfx/applause.wav" vol={0.35} dur={6} fadeOut={1.5} />
      <Sfx at={20.4} src="sfx/goo.wav" vol={0.5} />
      <Sfx at={22.2} src="sfx/voice/inner-stay.wav" vol={0.75} />
      <Sfx at={26} src="sfx/room-tone.wav" vol={0.3} dur={6} />
    </AbsoluteFill>
  );
};
