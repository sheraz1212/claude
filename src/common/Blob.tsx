import React from 'react';
import {C} from './theme';

/*
 THE BLOB — the channel's signature inner voice.
 A soft, heavy, purple-grey goo with the hero's own round face, sleepy half-shut eyes
 and a lazy smile. Eyes + inner glow use the video's accent colour.
 Local coords: (0,0) = centre of its base on the ground. size 1 ≈ hero height (~430).
   size  : 0.3 tiny … 1 hero-sized … 1.8 towering
   melt  : 0 solid … 1 a weak puddle (fights back => melts)
   lean  : -1..1 tilts the head toward a side (it leans in to whisper)
   reach : optional goo arm toward a point (local coords) — e.g. over his shoulder
*/
export const BLOB = {body: '#4a4357', light: '#5d556c', dark: '#332e3e', outline: '#1b1a22'};

type Props = {
  id: string;
  x: number;
  y: number;
  t: number;
  size?: number;
  melt?: number;
  lean?: number;
  accent?: string;
  lid?: number; // 0 open … 1 shut (default sleepy 0.55)
  smile?: number; // 0 flat … 1 lazy grin
  eyeX?: number;
  reach?: [number, number][];
  glow?: number;
  opacity?: number;
};

const O = 7;

export const Blob: React.FC<Props> = ({id, x, y, t, size = 1, melt = 0, lean = 0, accent = '#e0565b', lid = 0.55, smile = 0.7, eyeX = 0, reach = [], glow = 0.6, opacity = 1}) => {
  const wob = (k: number, a = 1) => Math.sin(t * 2.1 + k) * 6 * a;
  const squash = 1 - melt * 0.62;
  const spread = 1 + melt * 0.7;
  const H = 400 * squash;
  const Wb = 150 * spread;
  const headR = 108 * (1 - melt * 0.25);
  const hx = lean * 40 + wob(1, 0.6);
  const hy = -H + headR * 0.55 + wob(2, 0.5);
  const breath = 1 + Math.sin(t * 1.4) * 0.02;
  // body: a sagging drop shape
  const body = `M ${-Wb - 30 + wob(3)} 0
    C ${-Wb - 10} ${-H * 0.3} ${hx - headR * 1.05} ${hy + headR * 1.1} ${hx - headR * 0.98} ${hy + headR * 0.2}
    L ${hx + headR * 0.98} ${hy + headR * 0.2}
    C ${hx + headR * 1.05} ${hy + headR * 1.1} ${Wb + 10} ${-H * 0.3} ${Wb + 30 + wob(4)} 0 Z`;
  const puddle = {rx: Wb + 60 + wob(5) + melt * 80, ry: 26 + melt * 10};
  // drips hanging off the body edge
  const drips = [-0.75, -0.3, 0.35, 0.8].map((k, i) => {
    const len = 30 + 26 * Math.abs(Math.sin(t * 0.9 + i * 1.7)) + melt * 40;
    const dx = k * Wb;
    const dy = -H * (0.28 + 0.06 * i);
    return {dx: dx + hx * (1 - (dy / -H)), dy, len};
  });
  const arms = reach.map(([ax, ay], i) => {
    const sx = (ax < 0 ? -1 : 1) * Wb * 0.55;
    const sy = -H * 0.55;
    const mx = (sx + ax) / 2 + wob(6 + i) ;
    const my = Math.min(sy, ay) - 70;
    return `M ${sx} ${sy} Q ${mx} ${my} ${ax} ${ay}`;
  });
  const eyeY = hy + 4;
  const eyeDX = 40;
  const eyeR = 15;
  const lidH = eyeR * 2 * Math.min(1, lid);
  const shapes = (fill: string, stroke: string, sw: number) => (
    <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <ellipse cx={0} cy={-4} rx={puddle.rx} ry={puddle.ry} />
      <path d={body} />
      <circle cx={hx} cy={hy} r={headR} />
      {drips.map((d, i) => (
        <path key={i} d={`M ${d.dx - 16} ${d.dy} Q ${d.dx - 14} ${d.dy + d.len} ${d.dx} ${d.dy + d.len + 12} Q ${d.dx + 14} ${d.dy + d.len} ${d.dx + 16} ${d.dy} Z`} />
      ))}
      {arms.map((p, i) => (
        <path key={i} d={p} fill="none" strokeLinecap="round" strokeWidth={sw === 0 ? 0 : sw} />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${size * breath} ${size * (2 - breath)})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${id}-core`} cx={hx} cy={-H * 0.4} r={H * 0.8} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={accent} stopOpacity={0.35 * glow} />
          <stop offset="1" stopColor={accent} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-aura`} cx={hx} cy={-H * 0.5} r={H * 1.3} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={accent} stopOpacity={0.22 * glow} />
          <stop offset="1" stopColor={accent} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={hx} cy={-H * 0.5} rx={H * 1.3} ry={H * 1.1} fill={`url(#${id}-aura)`} />
      {/* outline pass then fill pass = one gooey silhouette */}
      {arms.map((p, i) => (
        <path key={`ao${i}`} d={p} fill="none" stroke={BLOB.outline} strokeWidth={58 + O * 2} strokeLinecap="round" />
      ))}
      {shapes(BLOB.outline, BLOB.outline, O * 2)}
      {arms.map((p, i) => (
        <path key={`af${i}`} d={p} fill="none" stroke={BLOB.body} strokeWidth={58} strokeLinecap="round" />
      ))}
      {shapes(BLOB.body, 'none', 0)}
      {/* inner glow + soft highlight */}
      <ellipse cx={hx - headR * 0.4} cy={hy - headR * 0.45} rx={headR * 0.32} ry={headR * 0.18} fill={BLOB.light} opacity={0.8} transform={`rotate(-25 ${hx - headR * 0.4} ${hy - headR * 0.45})`} />
      <ellipse cx={-Wb * 0.45} cy={-H * 0.3} rx={18} ry={46} fill={BLOB.light} opacity={0.5} />
      {/* eyes: glowing, half shut by heavy lids */}
      {[-1, 1].map((s) => {
        const cx = hx + s * eyeDX + eyeX;
        return (
          <g key={s}>
            <circle cx={cx} cy={eyeY} r={eyeR + 10} fill={accent} opacity={0.25 * (1 - melt * 0.6)} />
            <circle cx={cx} cy={eyeY} r={eyeR} fill={accent} opacity={1 - melt * 0.55} />
            <rect x={cx - eyeR - 3} y={eyeY - eyeR - 2} width={eyeR * 2 + 6} height={lidH + 2} fill={BLOB.body} />
            <path d={`M ${cx - eyeR - 4} ${eyeY - eyeR + lidH} Q ${cx} ${eyeY - eyeR + lidH + 5} ${cx + eyeR + 4} ${eyeY - eyeR + lidH}`} stroke={BLOB.outline} strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {/* lazy smile */}
      <path d={`M ${hx - 34} ${hy + 46} Q ${hx} ${hy + 46 + 26 * smile} ${hx + 34} ${hy + 46 - 6 * smile}`} stroke={BLOB.outline} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};
