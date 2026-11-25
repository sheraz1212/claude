import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, GREY, Person, Stage, TAN} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Bib, SchoolTrack} from './sets';

/*
 THE KID WHO FELL — Clip 1 (32 s): the fall.
  0–4    BLACK hook (pen-writing SFX)
  4–10   WIDE school track at dusk, floodlights; kids at the start line, small hero with bib 7  → place + who he is
  10–15  MEDIUM side tracking: he leads, grinning, the crowd cheers                              → his joy
  15–19  WIDE he trips and slides; the others run past                                           → the shock
  19–25  CLOSE on the ground, the kids laugh above him: "lol he fell"                             → the wound
  25–32  MEDIUM he stands, head down; a small demon rises from his shadow: "stay down."           → it is born
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#ff7a7a';
const KIDS = [
  {color: GREY, accessory: 'cap' as const, accessoryColor: '#8a3b3b'},
  {color: TAN, accessory: 'headband' as const, accessoryColor: '#4f7fa8'},
  {color: GREY, accessory: 'cap' as const, accessoryColor: '#3f6a4e'},
];
const G = 930; // ground line for the runners
const S = 0.68; // teen runners (tall build)

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const ready = interpolate(t, [7.4, 8.2], [0, 1], cl);
    const go = t > 9.45;
    const dx = (k: number) => (go ? Math.pow(t - 9.45, 1.3) * (520 + k * 40) : 0);
    const lanes = [
      {y: 875, s: 0.6, k: 0},
      {y: 935, s: 0.66, k: 1},
      {y: 1000, s: 0.72, k: 2},
    ];
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1, 1.05], cl)} cx={760} cy={800}>
          <SchoolTrack t={t} crowd={0.3 + ready * 0.4} />
          <rect x={590} y={760} width={14} height={320} fill="#efe6d6" opacity={0.85} />
          {lanes.slice(0, 1).map(({y, s: sc, k}) => (
            <HeroSide key={k} id={`k${k}`} x={560 + dx(k)} y={y} scale={sc} color={KIDS[k].color} accessory={KIDS[k].accessory} accessoryColor={KIDS[k].accessoryColor} lean={14 * ready} phase={go ? t * 15 : undefined} run={1} brow={-0.4 * ready} />
          ))}
          <ellipse cx={640 + dx(3)} cy={938} rx={70} ry={10} fill="#000" opacity={0.35} />
          <HeroSide id="h" x={640 + dx(3)} y={935} scale={0.66} lean={14 * ready} phase={go ? t * 15 : undefined} run={1} brow={-0.5 * ready} mouth={0.5}>
            <Bib x={20} y={46} scale={1.1} />
          </HeroSide>
          {lanes.slice(2).map(({y, s: sc, k}) => (
            <HeroSide key={k} id={`k${k}`} x={740 + dx(k)} y={y} scale={sc} color={KIDS[k].color} accessory={KIDS[k].accessory} accessoryColor={KIDS[k].accessoryColor} lean={14 * ready} phase={go ? t * 15 + 1 : undefined} run={1} brow={-0.4 * ready} />
          ))}
        </Cam>
      </Stage>
    );
  }
  if (t < 15) {
    const scroll = (t - 10) * 1100;
    return (
      <Stage>
        <Cam s={1.3} cx={960} cy={760}>
          <SchoolTrack t={t} scrollX={scroll} crowd={1} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={760 - ((t * 900 + k * 130) % 260)} y={700 + k * 45} width={120} height={5} rx={3} fill="#efe6d6" opacity={0.3} />
          ))}
          <HeroSide id="r0" x={640 - (t - 10) * 25} y={880} scale={0.6} color={KIDS[0].color} accessory="cap" accessoryColor={KIDS[0].accessoryColor} phase={t * 15} run={1} brow={0.2} />
          <ellipse cx={960} cy={938} rx={70} ry={10} fill="#000" opacity={0.35} />
          <HeroSide id="h" x={960} y={935} scale={0.66} phase={t * 15.5} run={1} brow={-0.2} mouth={0.9}>
            <Bib x={20} y={46} scale={1.1} />
          </HeroSide>
          <HeroSide id="r2" x={560 - (t - 10) * 40} y={1000} scale={0.72} color={KIDS[2].color} accessory="cap" accessoryColor={KIDS[2].accessoryColor} phase={t * 15 + 1} run={1} brow={0.3} />
        </Cam>
      </Stage>
    );
  }
  if (t < 19) {
    const fall = interpolate(t, [15.9, 16.4], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
    const slideK = interpolate(t, [16.4, 17.0], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const x = interpolate(t, [15, 15.9], [520, 860], cl) + slideK * 160;
    return (
      <Stage>
        <SchoolTrack t={t} crowd={t > 16.3 ? 0 : 1} />
        <HeroSide id="p0" x={interpolate(t, [15, 19], [260, 1500], cl)} y={880} scale={0.6} color={KIDS[0].color} accessory="cap" accessoryColor={KIDS[0].accessoryColor} phase={t * 15} run={1} />
        <ellipse cx={x + fall * 170} cy={938} rx={70 + fall * 110} ry={10} fill="#000" opacity={0.35} />
        <g transform={`rotate(${fall * 84} ${x + fall * 30} 935)`}>
          <HeroSide id="h" x={x} y={935} scale={0.66} phase={t < 15.9 ? t * 15.5 : 15.9 * 15.5} run={1} brow={fall > 0.2 ? 0.9 : -0.2} mouth={fall > 0.2 ? -0.7 : 0.8} armUp={fall}>
            <Bib x={20} y={46} scale={1.1} />
          </HeroSide>
        </g>
        <HeroSide id="p2" x={interpolate(t, [15, 19], [120, 1640], cl)} y={1000} scale={0.72} color={KIDS[2].color} accessory="cap" accessoryColor={KIDS[2].accessoryColor} phase={t * 15 + 1} run={1} />
        <HeroSide id="p1" x={interpolate(t, [15.6, 19], [-100, 1300], cl)} y={1040} scale={0.76} color={KIDS[1].color} accessory="headband" accessoryColor={KIDS[1].accessoryColor} phase={t * 15 + 2} run={1} />
      </Stage>
    );
  }
  if (t < 25) {
    const laugh = Math.abs(Math.sin(t * 7));
    return (
      <Stage>
        <Cam s={1.6} cx={1100} cy={870}>
          <SchoolTrack t={t} crowd={0} />
          {[{x: 900, k: 0}, {x: 1300, k: 1}, {x: 1460, k: 2}].map(({x, k}) => (
            <Person key={k} id={`l${k}`} x={x} y={G - 20} scale={S} {...KIDS[k]} pose="arms-down" rHand={k === 1 ? [70, -230] : undefined} headTilt={Math.sin(t * 7 + k) * 5} expr={{brow: -0.2, lid: 0.6, mouth: 0.6 + laugh * 0.4, eyeX: k === 0 ? 12 : -12, eyeY: 10}} />
          ))}
          <ellipse cx={1150} cy={G + 4} rx={150} ry={14} fill="#000" opacity={0.4} />
          <g transform={`rotate(80 1020 ${G})`}>
            <Hero id="h" x={1020} y={G} scale={S} pose="arms-down" expr={{brow: 0.85, lid: 0.15, mouth: -0.5, eyeY: -8, tear: interpolate(t, [21.5, 24], [0, 1], cl)}} blink={blinkAt(t, [20.6, 23.4])} />
            <Bib x={1020} y={G} scale={S} />
          </g>
        </Cam>
      </Stage>
    );
  }
  const stand = interpolate(t, [25, 26], [0, 1], cl);
  const rise = interpolate(t, [26.2, 27.4], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return (
    <Stage>
      <Cam s={1.5} cx={980} cy={720}>
        <SchoolTrack t={t} crowd={0} lights={0.7} />
        <rect width={1920} height={1080} fill="#0c0a14" opacity={0.25} />
        <ellipse cx={900} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.45} />
        <g clipPath="url(#riseclip)">
          <defs>
            <clipPath id="riseclip">
              <rect x={0} y={0} width={1920} height={G + 6} />
            </clipPath>
          </defs>
          <Demon id="d" x={1060} y={G + (1 - rise) * 380} t={t} scale={S} size={0.85} glow={rise} headTilt={-12 * rise} lean={-6 * rise} expr={{brow: -0.6, lid: 0.35, mouth: 0.4, eyeX: -10}} />
        </g>
        <Hero id="h" x={900} y={G} scale={S} pose="arms-down" lean={4 * stand} headTilt={-8 * stand} expr={{brow: 0.7, lid: 0.45, mouth: -0.45, eyeY: 12, eyeX: rise > 0.8 ? 10 : 0}} blink={blinkAt(t, [28.8])} />
        <Bib x={900} y={G} scale={S} rot={4 * stand} />
      </Cam>
    </Stage>
  );
};

export const KidClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He was the **fastest**. Once." dur={sec(4)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(4.8)} durationInFrames={sec(3.6)}>
        <Caption text="He loved to **run**." dur={sec(3.6)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(3.6)}>
        <Caption text="Nobody could catch him." dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(17.4)} durationInFrames={sec(1.6)}>
        <Caption text="Then he **fell**." dur={sec(1.6)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(20.0)} durationInFrames={sec(2.6)}>
        <HeadPill text="lol he fell" x={1400} y={215} dur={sec(2.6)} side="right" />
      </Sequence>
      <Sequence from={sec(22.6)} durationInFrames={sec(2.2)}>
        <Caption text="Everyone **laughed**." dur={sec(2.2)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(27.6)} durationInFrames={sec(2.8)}>
        <DemonSay text="stay down." x={1120} y={300} dur={sec(2.8)} size={70} />
      </Sequence>
      <Sequence from={sec(29.2)} durationInFrames={sec(2.8)}>
        <Caption text="So he **never** ran again." dur={sec(2.8)} highlight={RED} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={4.2} src="music/race-piano.wav" vol={0.7} dur={11.8} fadeIn={0.6} fadeOut={0.1} />
      <Sfx at={16.3} src="music/orch-hit-dark.wav" vol={0.8} />
      <Sfx at={19.2} src="music/lone-musicbox.wav" vol={0.7} fadeIn={1} />
      {/* SFX */}
      <Sfx at={0.5} src="sfx/pen-write.wav" vol={0.6} />
      <Sfx at={4.2} src="sfx/murmur.wav" vol={0.3} dur={5.5} fadeOut={1} />
      <Sfx at={9.4} src="sfx/start-gun.wav" vol={0.6} />
      <Sfx at={9.6} src="sfx/run-steps.wav" vol={0.5} dur={6.4} />
      <Sfx at={10.0} src="sfx/far-cheer.wav" vol={0.45} dur={5.5} fadeOut={1} />
      <Sfx at={16.3} src="sfx/fall-thud.wav" vol={0.8} />
      <Sfx at={16.4} src="sfx/track-slide.wav" vol={0.5} />
      <Sfx at={16.6} src="sfx/crowd-gasp.wav" vol={0.5} />
      <Sfx at={19.6} src="sfx/group-laugh.wav" vol={0.55} dur={5} fadeOut={1} />
      <Sfx at={26.2} src="sfx/low-hum.wav" vol={0.3} dur={3} />
      <Sfx at={27.6} src="sfx/voice/inner-stay-down.wav" vol={0.75} />
    </AbsoluteFill>
  );
};
