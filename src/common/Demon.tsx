import React from 'react';
import {Hero, Expression} from './Hero';

/*
 THE DEMON — the hero's own inner soul, made visible. Always red + black, in every video.
 Same body as the hero (head, body, legs, mittens, oval feet) but ~1.35x bigger, charcoal black,
 red glowing eyes/brows/mouth, a RED wristband (the mirror of his teal one), red aura,
 embers drifting up from its feet. When it gets weaker it cracks, then breaks apart.
*/
export const DEMON_RED = '#ff3b3b';
export const DEMON_BODY = '#1c1618';

type Props = {
  id: string;
  x: number;
  y: number;
  t: number;
  scale?: number; // hero scale it stands next to (it is drawn 1.5x this)
  size?: number; // extra growth multiplier (habit wins -> bigger)
  crack?: number; // 0 whole … 1 shattered
  glow?: number;
  opacity?: number;
  expr?: Expression;
  lHand?: [number, number];
  rHand?: [number, number];
  headTilt?: number;
  lean?: number;
  walk?: number;
  back?: boolean;
  classic?: boolean;
  sit?: boolean;
};

export const Demon: React.FC<Props> = ({id, x, y, t, scale = 1, size = 1, crack = 0, glow = 1, opacity = 1, expr, lHand, rHand, headTilt = 0, lean = 0, walk, back, classic, sit}) => {
  const s = scale * 1.35 * size;
  const flick = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.3);
  const e: Expression = {brow: -0.6, lid: 0.35, mouth: 0.35, ...expr};
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`${id}-aura`} cx={x} cy={y - 260 * s} r={380 * s} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={DEMON_RED} stopOpacity={0.45 * glow * flick} />
          <stop offset="0.5" stopColor={DEMON_RED} stopOpacity={0.14 * glow} />
          <stop offset="1" stopColor={DEMON_RED} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-rim`} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={3} result="d" />
          <feGaussianBlur in="d" stdDeviation={6 * s} result="b" />
          <feFlood floodColor={DEMON_RED} floodOpacity={0.9 * glow} />
          <feComposite in2="b" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx={x} cy={y - 260 * s} rx={380 * s} ry={420 * s} fill={`url(#${id}-aura)`} />
      <ellipse cx={x} cy={y + 4} rx={110 * s} ry={14 * s} fill="#000" opacity={0.5} />
      <g filter={`url(#${id}-rim)`}>
        <Hero id={id} x={x} y={y} scale={s} pose="arms-down" color={DEMON_BODY} ink={DEMON_RED} bandColor={DEMON_RED} expr={e} lHand={lHand} rHand={rHand} headTilt={headTilt} lean={lean} walk={walk} back={back} classic={classic} sit={sit} />
      </g>
      {/* red cracks when it weakens */}
      {crack > 0 && (
        <g stroke={DEMON_RED} strokeWidth={4 * s} fill="none" strokeLinecap="round" opacity={Math.min(1, crack * 2)}>
          <path d={`M ${x - 20 * s} ${y - 420 * s} l ${15 * s} ${40 * s} l ${-20 * s} ${30 * s} l ${25 * s} ${45 * s}`} />
          <path d={`M ${x + 40 * s} ${y - 200 * s} l ${-18 * s} ${30 * s} l ${20 * s} ${28 * s}`} />
          {crack > 0.5 && <path d={`M ${x - 60 * s} ${y - 160 * s} l ${25 * s} ${20 * s} l ${-10 * s} ${35 * s}`} />}
        </g>
      )}
      {/* embers rising from its feet */}
      {Array.from({length: 10}, (_, i) => {
        const life = ((t * 0.4 + i / 10) % 1 + 1) % 1;
        return (
          <circle key={i} cx={x + Math.sin(i * 7.3 + t) * 70 * s} cy={y - life * 300 * s} r={(3 + (i % 3)) * s} fill={DEMON_RED} opacity={(1 - life) * 0.8 * glow} />
        );
      })}
    </g>
  );
};

/** The demon's words: red, brush handwriting, beside its head, no capsule. */
export const DemonWords: React.FC<{text: string; x: number; y: number; size?: number; o?: number}> = ({text, x, y, size = 64, o = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(0, -50%)',
      fontFamily: 'Caveat Brush',
      fontSize: size,
      color: DEMON_RED,
      opacity: o,
      whiteSpace: 'nowrap',
      letterSpacing: 1,
      textShadow: `0 0 14px rgba(255,59,59,0.55), 0 2px 6px rgba(0,0,0,0.9)`,
    }}
  >
    {text}
  </div>
);

import {HeroSide} from './HeroSide';
/** Side view of the demon (walking / reaching), same red-black look. */
export const DemonSide: React.FC<{id: string; x: number; y: number; t: number; scale?: number; size?: number; dir?: 1 | -1; phase?: number; armUp?: number; lean?: number; headTilt?: number; glow?: number; opacity?: number; crack?: number}> = ({id, x, y, t, scale = 1, size = 1, dir = 1, phase, armUp = 0, lean = 0, headTilt = 0, glow = 1, opacity = 1, crack = 0}) => {
  const s = scale * 1.35 * size;
  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`${id}-rim`} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={3} result="d" />
          <feGaussianBlur in="d" stdDeviation={6 * s} result="b" />
          <feFlood floodColor={DEMON_RED} floodOpacity={0.9 * glow} />
          <feComposite in2="b" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`${id}-aura`} cx={x} cy={y - 260 * s} r={380 * s} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={DEMON_RED} stopOpacity={0.35 * glow} />
          <stop offset="1" stopColor={DEMON_RED} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y - 260 * s} rx={360 * s} ry={400 * s} fill={`url(#${id}-aura)`} />
      <HeroSide id={id} x={x} y={y} scale={s} dir={dir} phase={phase} color={DEMON_BODY} ink={DEMON_RED} brow={-0.6} lid={0.3} mouth={0.5} armUp={armUp} lean={lean} headTilt={headTilt} glowFilter={`${id}-rim`} />
      {crack > 0 && <path d={`M ${x} ${y - 470 * s} l ${12 * s} ${40 * s} l ${-16 * s} ${30 * s} l ${20 * s} ${44 * s}`} stroke={DEMON_RED} strokeWidth={4 * s} fill="none" opacity={crack} />}
      {Array.from({length: 8}, (_, i) => {
        const life = ((t * 0.4 + i / 8) % 1 + 1) % 1;
        return <circle key={i} cx={x + Math.sin(i * 7.3 + t) * 60 * s} cy={y - life * 280 * s} r={(3 + (i % 3)) * s} fill={DEMON_RED} opacity={(1 - life) * 0.7 * glow} />;
      })}
    </g>
  );
};
