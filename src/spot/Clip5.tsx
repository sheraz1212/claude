import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob, DemonSay} from './demonShim';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, GREY, Person, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Attic, BigWord, Cafe, MIA, MindStage, Notes, PickNecklace, PURPLE, PURPLE_L, Stool} from './sets';

/*
 SPOTLIGHT — Clip 5 (33 s): the fight (montage). MUSIC: drive-drums.
  0–6    WIDE attic, days dissolve, PRACTICE DAY 1 → 21: he plays, badly, every day
  6–12   IMAGERY mind stage: his sound waves crack the big word THEY'LL LAUGH. — it shatters
  12–18  MEDIUM attic: a neighbour leans into the round window and nods along
  18–25  WIDE café by day: he writes his name on Mia's sign-up sheet, hand shaking
  25–33  IMAGERY mind stage: the Blob faces melt seat by seat; the Blob shrinks: "Weaker."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Waves: React.FC<{t: number; x: number; y: number; o?: number}> = ({t, x, y, o = 1}) => (
  <g opacity={o}>
    {[0, 1, 2, 3].map((i) => {
      const p = ((t * 0.9 + i / 4) % 1 + 1) % 1;
      return <path key={i} d={`M ${x + 60 + p * 700} ${y - 120 - p * 260} Q ${x + 160 + p * 820} ${y} ${x + 60 + p * 700} ${y + 120 + p * 260}`} stroke={C.amberLight} strokeWidth={10 - p * 6} fill="none" opacity={1 - p} strokeLinecap="round" />;
    })}
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const day = Math.floor(t / 2);
    const fade = Math.max(0, 1 - Math.abs((t % 2) - 2) * 4, 1 - (t % 2) * 4) * (t > 0.3 ? 0.8 : 0);
    const strum = Math.sin(t * (day === 0 ? 5 : 9)) * 13;
    return (
      <Stage>
        <Attic t={t} golden={day % 2 === 0 ? 1 : 0} lamp={day % 2 === 0 ? 0 : 1} />
        <Stool x={960} y={760} />
        <Hero id="h" x={960} y={804} sit guitar lHand={[-20, -125 + strum]} rHand={[135, -190]} expr={{brow: day === 0 ? 0.5 : 0, lid: day === 2 ? 0.8 : 0.1, mouth: day === 0 ? -0.3 : 0.4, eyeX: day === 0 ? 14 : 0, eyeY: day === 0 ? 12 : 0}} />
        <PickNecklace x={960} y={804} scale={1} sit />
        {day > 0 && <Notes t={t} x={1060} y={460} n={day * 2} o={0.8} />}
        <rect width={1920} height={1080} fill="#000" opacity={fade} />
      </Stage>
    );
  }
  if (t < 12) {
    const crack = interpolate(t, [8.3, 9.6], [0, 1], cl);
    const broken = t > 10;
    const k = interpolate(t, [10, 11.8], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    return (
      <Stage>
        <Cam s={1.25} cx={960} cy={800}>
          <MindStage t={t} laugh={0.5} />
          <Hero id="h" x={760} y={900} scale={0.55} guitar lHand={[-20, -125 + Math.sin(t * 10) * 12]} rHand={[135, -190]} expr={{brow: -0.4, lid: 0, mouth: 0.1, eyeX: 16}} />
          <PickNecklace x={760} y={900} scale={0.55} />
          <Waves t={t} x={760} y={830} />
        </Cam>
        {!broken ? (
          <BigWord text="THEY'LL LAUGH." x={1270 + Math.sin(t * 30) * 4 * crack} y={640} size={110} crack={crack} />
        ) : (
          ['THEY', "'LL", 'LAU', 'GH.'].map((p, i) => (
            <BigWord key={i} text={p} x={1050 + i * 150 + k * (i - 1.5) * 300} y={640 - k * (200 - i * 90) + k * k * 500} size={110} rot={k * (i - 1.5) * 40} o={1 - k} />
          ))
        )}
      </Stage>
    );
  }
  if (t < 18) {
    const peek = interpolate(t, [13, 14.2], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const nod = t > 14.5 ? Math.sin(t * 7) * 5 : 0;
    return (
      <Stage>
        <Cam s={1.45} cx={1150} cy={480}>
          <Attic t={t} golden={1} />
          <g clipPath="url(#win)">
            <Person id="nb" x={1330} y={330 + 330 * 0.7 + 260 - peek * 260} scale={0.7} color={GREY} accessory="glasses" pose="arms-down" headTilt={nod} expr={{brow: -0.1, lid: 0.2, mouth: 0.7}} />
          </g>
          <Stool x={960} y={760} />
          <Hero id="h" x={960} y={804} sit guitar lHand={[-20, -125 + Math.sin(t * 9) * 13]} rHand={[135, -190]} expr={{brow: t > 15 ? -0.2 : 0.3, lid: 0.1, mouth: t > 15 ? 0.7 : 0.2, eyeX: 16, eyeY: -12}} blink={blinkAt(t, [16.6])} />
          <PickNecklace x={960} y={804} scale={1} sit />
          <Notes t={t} x={1080} y={470} n={5} />
        </Cam>
      </Stage>
    );
  }
  if (t < 25) {
    const reach = interpolate(t, [18.6, 19.4], [0, 1], cl);
    const write = t > 19.4 && t < 22.5;
    const shake = write ? Math.sin(t * 45) * 3 : 0;
    return (
      <Stage>
        <Cam s={1.35} cx={1000} cy={640}>
          <Cafe t={t} crowd={0} spot={0.2} day />
          {/* sign-up board */}
          <rect x={1010} y={600} width={14} height={290} fill="#4a3024" transform="rotate(8 1017 745)" />
          <rect x={1150} y={600} width={14} height={290} fill="#4a3024" transform="rotate(-8 1157 745)" />
          <rect x={980} y={560} width={210} height={250} rx={6} fill="#f4ecd8" stroke={C.outline} strokeWidth={4} />
          <text x={1085} y={598} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={24} fill={PURPLE}>SIGN UP</text>
          {['Mia', 'Sam', 'Jo'].map((n, i) => (
            <text key={n} x={1000} y={640 + i * 38} fontFamily="Patrick Hand" fontSize={28} fill={C.outline}>{`${i + 1}. ${n}`}</text>
          ))}
          <text x={1000} y={754} fontFamily="Patrick Hand" fontSize={28} fill={C.outline}>4. </text>
          {t > 19.6 && <text x={1028} y={754} fontFamily="Patrick Hand" fontSize={28} fill="#2a5a8a">{'me'.slice(0, Math.min(2, Math.floor((t - 19.6) * 1.2) + 1))}</text>}
          <ellipse cx={850} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
          <Hero id="h" x={850} y={900} scale={0.85} pose="arms-down" rHand={[92 + reach * 115 + shake, -100 - reach * 10]} rHold={reach > 0.5 ? 'pencil' : 'none'} expr={{brow: 0.5, lid: 0, mouth: -0.2, eyeX: 16, eyeY: 6}} />
          <PickNecklace x={850} y={900} scale={0.85} />
          <ellipse cx={1340} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
          <Person id="mia" x={1340} y={900} scale={0.85} {...MIA} pose="arms-down" expr={{brow: 0.1, lid: 0, mouth: t > 23 ? 0.8 : 0.3, eyeX: -16}} />
        </Cam>
      </Stage>
    );
  }
  const melt = interpolate(t, [25.5, 31], [0, 1], cl);
  const x = interpolate(t, [25.3, 29.5], [520, 900], {...cl, easing: Easing.inOut(Easing.quad)});
  return (
    <Stage>
      <Cam s={1.25} cx={960} cy={800}>
        <MindStage t={t} melt={melt} laugh={0.3} spot={1} />
        <Blob id="b" hs={0.55} x={1230} y={905} t={t} size={0.5 - melt * 0.15} melt={melt * 0.8} accent={PURPLE} lid={0.75} smile={0.3 - melt} glow={0.7 - melt * 0.4} lean={-0.6} />
        <ellipse cx={x} cy={902} rx={60} ry={10} fill="#000" opacity={0.5} />
        <Hero id="h" x={x} y={900} scale={0.55} walk={t < 29.5 ? t * 7 : undefined} pose="arms-down" expr={{brow: -0.4, lid: 0, mouth: 0.2, eyeX: 14}} />
        <PickNecklace x={x} y={900} scale={0.55} />
      </Cam>
    </Stage>
  );
};

export const SpotClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="PRACTICE DAY" showFrom={0} changes={[[0, '1'], [sec(2), '7'], [sec(4), '21']]} />
      <Sequence from={sec(0.5)} durationInFrames={sec(2.5)}>
        <Caption text="Every day." dur={sec(2.5)} />
      </Sequence>
      <Sequence from={sec(3.2)} durationInFrames={sec(2.6)}>
        <Caption text="**Badly**. Then better." dur={sec(2.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(6.6)} durationInFrames={sec(3.2)}>
        <Caption text="He played **louder** than the voice." dur={sec(3.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(14.6)} durationInFrames={sec(3.2)}>
        <Caption text="Then for **someone**." dur={sec(3.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(20.2)} durationInFrames={sec(2.2)}>
        <HeadPill text="you sure?" x={1490} y={400} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(22.6)} durationInFrames={sec(2.3)}>
        <HeadPill text="no. but yes." x={830} y={400} dur={sec(2.3)} />
      </Sequence>
      <Sequence from={sec(26.0)} durationInFrames={sec(2.4)}>
        <DemonSay text="they'll... laugh." x={1360} y={640} dur={sec(2.4)} size={50} />
      </Sequence>
      <Sequence from={sec(29.0)} durationInFrames={sec(3.8)}>
        <Caption text="**Weaker.**" dur={sec(3.8)} highlight={PURPLE_L} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/drive-keys.wav" vol={0.75} dur={33} fadeIn={0.3} fadeOut={1.5} />
      {/* SFX */}
      <Sfx at={0.2} src="sfx/his-song.wav" vol={0.3} dur={5.6} fadeOut={0.6} />
      <Sfx at={8.3} src="sfx/glass-crack.wav" vol={0.5} />
      <Sfx at={10.0} src="sfx/shatter.wav" vol={0.6} />
      <Sfx at={10.0} src="sfx/piano-hit-low.wav" vol={0.5} />
      <Sfx at={13.0} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={19.5} src="sfx/pencil.wav" vol={0.5} />
      <Sfx at={25.6} src="sfx/goo.wav" vol={0.45} />
      <Sfx at={27.0} src="sfx/thaw.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
