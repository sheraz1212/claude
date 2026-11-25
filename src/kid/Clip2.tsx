import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon, DemonSide} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Flat, JACKET, stairY, Stairs} from './sets';

/*
 THE KID WHO FELL — Clip 2 (33 s): the years.  MUSIC: dark keys
  0–6    MEDIUM night: he hides the bib in the drawer                       → he buries it
  6–13   WIDE the same bed, 3 dissolves: years pass, the demon grows        → time + the voice wins
  13–20  WIDE dawn: running shoes by the door; the demon stands over them: "you'll fall."
  20–27  MEDIUM the lift is out of order; he climbs the stairs, out of breath, the demon behind him
  27–33  WIDE night, bed, phone glow; the demon sits beside him
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#ff7a7a';
const G = 920;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const open = interpolate(t, [0.4, 1.1, 3.9, 4.5], [0, 1, 1, 0], cl);
    const put = interpolate(t, [1.4, 3.2], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
    const bx = 660 + put * 140;
    const by = 560 + put * 120;
    return (
      <Stage>
        <Cam s={1.5} cx={720} cy={620}>
          <Flat t={t} drawer={open} />
          <ellipse cx={560} cy={G + 4} rx={80} ry={12} fill="#000" opacity={0.35} />
          <Hero id="h" x={560} y={G} scale={HS} pose="arms-down" rHand={[130 + put * 60, -270 + put * 120]} headTilt={-6} expr={{brow: 0.6, lid: 0.35, mouth: -0.4, eyeX: 14, eyeY: 10}} blink={blinkAt(t, [4.8])} />
          {put < 1 && (
            <g transform={`translate(${bx} ${by}) rotate(${-10 + put * 20}) scale(${1 - put * 0.3})`}>
              <rect x={-30} y={-25} width={60} height={50} rx={5} fill="#f4efe4" stroke={C.outline} strokeWidth={3} />
              <text x={0} y={14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#c8304f">7</text>
            </g>
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 13) {
    const st = t < 8.3 ? 0 : t < 10.6 ? 1 : 2;
    const local = t - [6, 8.3, 10.6][st];
    const fade = Math.max(0, 1 - local * 3, (local - 2.0) * 3.3) * (st === 2 && local > 2 ? 0 : 1);
    return (
      <Stage>
        <Flat t={t} lamp={0.6} phone={0.8} />
        <Demon id="d" x={760} y={G} t={t} scale={HS} size={[0.6, 0.85, 1.1][st]} glow={0.6 + st * 0.2} headTilt={-8} lean={-4} />
        <Hero id="h" x={380} y={746} scale={HS} sit pose="phone" jacket={st > 0 ? JACKET : undefined} glow={0.8} glowColor="#8fb8f0" expr={{brow: 0.2 + st * 0.15, lid: 0.35 + st * 0.1, mouth: -0.1, eyeY: 12, bags: st === 2}} thumb={Math.sin(t * 6) > 0.6 ? 1 : 0} />
        <rect width={1920} height={1080} fill="#000" opacity={Math.min(1, fade)} />
      </Stage>
    );
  }
  if (t < 20) {
    const walk = interpolate(t, [13.2, 15], [1050, 1430], cl);
    const back = interpolate(t, [18, 20], [0, 1], cl);
    const x = t < 18 ? walk : 1430 + back * 300;
    const look = t > 15 && t < 18;
    return (
      <Stage>
        <Flat t={t} dawn={1} lamp={0} />
        <DemonSide id="ds" x={1660} y={G - 40} t={t} scale={HS} size={0.95} dir={-1} lean={10} headTilt={14} glow={0.9} opacity={interpolate(t, [14.6, 15.4], [0, 1], cl)} />
        <ellipse cx={x} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        <HeroSide id="h" x={x} y={G} scale={HS} dir={1} jacket={JACKET} phase={(t > 13.2 && t < 15) || t > 18 ? t * 8 : undefined} brow={look ? 0.5 : 0.1} lid={0.3} mouth={-0.2} headTilt={look ? 16 : 0} />
        <rect width={1920} height={1080} fill="#000" opacity={interpolate(t, [19.3, 20], [0, 1], cl)} />
      </Stage>
    );
  }
  if (t < 27) {
    const x = interpolate(t, [20.2, 27], [420, 980], cl);
    return (
      <Stage>
        <Cam s={1.25} cx={x + 60} cy={stairY(x) - 220}>
          <Stairs t={t} />
          <g>
            <rect x={140} y={600} width={150} height={240} fill="#3a3a46" stroke={C.outline} strokeWidth={4} />
            <rect x={150} y={640} width={130} height={46} fill="#e9c23a" />
            <text x={215} y={660} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={17} fill={C.outline}>OUT OF</text>
            <text x={215} y={680} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={17} fill={C.outline}>ORDER</text>
          </g>
          <DemonSide id="ds" x={x - 190} y={stairY(x - 190)} t={t} scale={HS} size={1.05} dir={1} phase={t * 5} armUp={0.4} lean={12} />
          <HeroSide id="h" x={x} y={stairY(x)} scale={HS} dir={1} jacket={JACKET} phase={t * 5} lean={14} brow={0.7} lid={0.4} mouth={-0.5} armUp={0}>
            <rect x={70} y={-210} width={56} height={70} rx={6} fill="#b08a5a" stroke={C.outline} strokeWidth={3} />
          </HeroSide>
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <Flat t={t} lamp={0} phone={1} />
      <rect width={1920} height={1080} fill="#0a0a14" opacity={0.35} />
      <Demon id="d" x={590} y={762} t={t} scale={HS} size={1.1} sit headTilt={-12} lean={-4} glow={1} />
      <Hero id="h" x={360} y={746} scale={HS} sit pose="phone" jacket={JACKET} glow={1} glowColor="#8fb8f0" expr={{brow: 0.5, lid: 0.5, mouth: -0.3, eyeY: 12, bags: true}} thumb={Math.sin(t * 6) > 0.6 ? 1 : 0} blink={blinkAt(t, [30.4])} />
    </Stage>
  );
};

export const KidClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(1.2)} durationInFrames={sec(3.8)}>
        <Caption text="He hid it **away**." dur={sec(3.8)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(6.6)} durationInFrames={sec(6)}>
        <Caption text="Years passed. He **stayed** still." dur={sec(6)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(15.6)} durationInFrames={sec(2.6)}>
        <DemonSay text="you'll fall." x={1300} y={330} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(18.2)} durationInFrames={sec(1.8)}>
        <Caption text="He took the **easy** way." dur={sec(1.8)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(21.2)} durationInFrames={sec(5.2)}>
        <Caption text="Even stairs felt **long**." dur={sec(5.2)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(28.2)} durationInFrames={sec(4.4)}>
        <Caption text="Safe. **Stuck**." dur={sec(4.4)} highlight={RED} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/dark-keys.wav" vol={0.85} dur={33} fadeIn={0.8} fadeOut={1.5} />
      {/* SFX */}
      <Sfx at={0.4} src="sfx/drawer-open.wav" vol={0.5} />
      <Sfx at={2.6} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={4.0} src="sfx/drawer-close.wav" vol={0.55} />
      <Sfx at={6.2} src="sfx/clock-tick.wav" vol={0.25} dur={6.6} />
      <Sfx at={13.2} src="sfx/footsteps.wav" vol={0.35} dur={1.8} />
      <Sfx at={15.6} src="sfx/voice/inner-youll-fall.wav" vol={0.7} />
      <Sfx at={18.2} src="sfx/door-close.wav" vol={0.45} />
      <Sfx at={20.2} src="sfx/steps-hard.wav" vol={0.35} dur={6.6} />
      <Sfx at={21.0} src="sfx/heavy-breath.wav" vol={0.45} />
      <Sfx at={27.2} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={29.0} src="sfx/scroll-tick.wav" vol={0.3} />
    </AbsoluteFill>
  );
};
