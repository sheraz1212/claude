import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Bib, Flat, JACKET, SchoolTrack} from './sets';

/*
 THE KID WHO FELL — Clip 6 (33 s): the mirrored ending + lesson.  MUSIC: piano + violin + strings
  0–8    MEDIUM dawn, the same drawer: he takes out the old bib 7
  8–15   MEDIUM he pins it on his jacket, next to the gold sticker
  15–22  WIDE the same door: this time HE puts on the running shoes - no demon
  22–29  WIDE the same school track as the opening: he jogs a lap, alone, steady
  29–33  BLACK lesson
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;
const GOLD = '#f2c94c';
const SHOE = '#d94c4c';

const Sticker: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={16} fill={GOLD} stroke={C.outline} strokeWidth={2.5} />
    <path d="M -6 -2 l 4 6 l 8 -10" stroke={C.outline} strokeWidth={2.5} fill="none" />
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 15) {
    const open = interpolate(t, [0.6, 1.3], [0, 1], cl);
    const lift = interpolate(t, [2.4, 4.2], [0, 1], cl);
    const pin = interpolate(t, [9, 11], [0, 1], cl);
    const onChest = t > 11;
    return (
      <Stage>
        <Cam s={t < 8 ? 1.5 : 1.9} cx={t < 8 ? 720 : 600} cy={t < 8 ? 620 : 540}>
          <Flat t={t} dawn={1} lamp={0.5} drawer={open} />
          <ellipse cx={560} cy={G + 4} rx={80} ry={12} fill="#000" opacity={0.35} />
          <Hero id="h" x={560} y={G} scale={HS} pose="arms-down" jacket={JACKET} rHand={t < 8 ? [130 + 60 * (1 - lift), -150 - lift * 160] : [60 - pin * 50, -260 + pin * 70]}
            expr={{brow: t < 8 ? 0.2 - lift * 0.3 : -0.1, lid: 0.15, mouth: onChest ? 0.6 : 0.1 + lift * 0.2, eyeX: t < 8 ? 14 : 0, eyeY: onChest ? 14 : 6}} blink={blinkAt(t, [6.1, 13.2])} />
          <Sticker x={560 + 34} y={G - 250} s={0.9} />
          {onChest ? (
            <Bib x={560 - 30} y={G - 10} scale={0.8 * 0.9} classic={false} />
          ) : (
            lift > 0 && (
              <g transform={`translate(${560 + (t < 8 ? 130 + 60 * (1 - lift) : 60 - pin * 50) * HS} ${G + (t < 8 ? -150 - lift * 160 : -260 + pin * 70) * HS - 40})`}>
                <rect x={-30} y={-25} width={60} height={50} rx={5} fill="#f4efe4" stroke={C.outline} strokeWidth={3} />
                <text x={0} y={14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#c8304f">7</text>
              </g>
            )
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 22) {
    const wear = t > 17.4;
    const x = t < 19 ? 1500 : interpolate(t, [19, 21.5], [1500, 1760], cl);
    return (
      <Stage>
        <Flat t={t} dawn={1} lamp={0} shoes={!wear} />
        <ellipse cx={x} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        <HeroSide id="h" x={x} y={G} scale={HS} dir={1} jacket={JACKET} shoes={wear ? SHOE : undefined} phase={t > 19 ? t * 8 : undefined} lean={t > 16 && t < 17.4 ? 20 : 0} headTilt={t < 17.4 ? 14 : 0} brow={-0.2} mouth={0.4} lid={0.1}>
          <Sticker x={30} y={-250} s={1.1} />
        </HeroSide>
        <rect width={1920} height={1080} fill="#000" opacity={interpolate(t, [21.3, 22], [0, 1], cl)} />
      </Stage>
    );
  }
  if (t < 29) {
    const x = interpolate(t, [22, 29], [200, 1500], cl);
    return (
      <Stage>
        <Cam s={1.05} cx={760} cy={800}>
          <SchoolTrack t={t} crowd={0.1} />
          <ellipse cx={x} cy={938} rx={70} ry={10} fill="#000" opacity={0.35} />
          <HeroSide id="h" x={x} y={935} scale={0.72} dir={1} jacket={JACKET} shoes={SHOE} phase={t * 10} run={0.45} brow={-0.2} mouth={0.5}>
            <Bib x={6} y={60} scale={1} />
            <Sticker x={-20} y={-260} s={1.1} />
          </HeroSide>
        </Cam>
        <rect width={1920} height={1080} fill="#000" opacity={interpolate(t, [22, 22.6], [1, 0], cl)} />
      </Stage>
    );
  }
  return null;
};

export const KidClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      {t < 29 && <FilmLook />}
      <Sequence from={sec(1)} durationInFrames={sec(5.5)}>
        <Caption text="He opened the **drawer**." dur={sec(5.5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(11.2)} durationInFrames={sec(3.6)}>
        <Caption text="He found his **number**." dur={sec(3.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(17.6)} durationInFrames={sec(3.8)}>
        <Caption text="This time, he laced **up**." dur={sec(3.8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(23.4)} durationInFrames={sec(5.2)}>
        <Caption text="Slowly. But **running**." dur={sec(5.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(29)} durationInFrames={sec(4)}>
        <BlackCard text="Falling isn't the end of the **race**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/hope-violin.wav" from={13.5} vol={0.75} dur={16.5} fadeOut={1.2} />
      <Sfx at={15} src="music/piano-violin-rise.wav" vol={0.7} dur={14} fadeIn={1.5} fadeOut={1} />
      <Sfx at={28.6} src="music/soft-piano-end.wav" vol={0.65} dur={4.4} fadeOut={1.2} />
      {/* SFX */}
      <Sfx at={0.6} src="sfx/drawer-open.wav" vol={0.5} />
      <Sfx at={2.6} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={10.6} src="sfx/pin-tap.wav" vol={0.5} />
      <Sfx at={17.4} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={19} src="sfx/footsteps.wav" vol={0.35} dur={2.5} />
      <Sfx at={21} src="sfx/door-close.wav" vol={0.4} />
      <Sfx at={22.4} src="sfx/run-steps.wav" vol={0.3} dur={6.4} />
      <Sfx at={29.3} src="sfx/pen-write.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
