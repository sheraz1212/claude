import React from 'react';
import {C} from './theme';
import type {Accessory} from './Hero';

/*
 Side (profile) view of the hero / any character, tall build, for walking and running.
 Local coords: feet on (0,0). Facing right when dir = 1, left when dir = -1.
 phase: walk/run cycle in radians (advance it with time). run: 0 walk … 1 sprint.
*/
type Props = {
  id: string;
  x: number;
  y: number;
  scale?: number;
  dir?: 1 | -1;
  phase?: number; // undefined = standing still
  run?: number;
  color?: string;
  accessory?: Accessory;
  accessoryColor?: string;
  brow?: number; // + worried, - determined
  lid?: number;
  mouth?: number;
  lean?: number; // extra forward lean (deg)
  headTilt?: number;
  ink?: string;
  armUp?: number; // 0..1 raises the front arm forward (reach / wave)
  children?: React.ReactNode; // drawn on the chest (bib, etc.)
  jacket?: string;
  shoes?: string;
  glowFilter?: string; // svg filter id (demon)
};

const O = 3.5;
const HIP: [number, number] = [0, -185];
const SHO: [number, number] = [6, -400];

/** mode 'both' = outline pass then colour pass for this limb alone (limb + foot/hand = one smooth piece);
    'line' / 'fill' = only that pass (so the near leg melts into the body). */
const Limb: React.FC<{from: [number, number]; len: number; w: number; ang: number; color: string; foot?: boolean; mitten?: boolean; end?: string; mode?: 'both' | 'line' | 'fill'}> = ({from, len, w, ang, color, foot, mitten, end, mode = 'both'}) => {
  const shape = (line: boolean) => {
    const st = (c: string) => (line ? {fill: C.outline, stroke: C.outline, strokeWidth: O * 2} : {fill: c});
    return (
      <>
        <rect x={-w / 2} y={-w / 2} width={w} height={len} rx={w / 2} {...st(color)} />
        {foot && <ellipse cx={14} cy={len - 18} rx={32} ry={15} {...st(end ?? color)} />}
        {mitten && <ellipse cx={2} cy={len - 2} rx={20} ry={22} {...st(end ?? color)} />}
      </>
    );
  };
  return (
    <g transform={`translate(${from[0]} ${from[1]}) rotate(${ang})`}>
      {mode !== 'fill' && shape(true)}
      {mode !== 'line' && shape(false)}
    </g>
  );
};

export const HeroSide: React.FC<Props> = ({
  id,
  x,
  y,
  scale = 1,
  dir = 1,
  phase,
  run = 0,
  color = C.cream,
  accessory = 'none',
  accessoryColor = '#8a3b3b',
  brow = 0,
  lid = 0,
  mouth = 0.2,
  lean = 0,
  headTilt = 0,
  ink = C.outline,
  armUp = 0,
  children,
  jacket,
  shoes,
  glowFilter,
}) => {
  const moving = phase !== undefined;
  const p = phase ?? 0;
  const legAmp = moving ? 22 + run * 22 : 0;
  const armAmp = moving ? 20 + run * 35 : 0;
  const s = Math.sin(p);
  const bob = moving ? -Math.abs(Math.cos(p)) * (6 + run * 14) : 0;
  const tilt = lean + run * 10;
  const back = mix(color, '#000', 0.22);
  const sleeve = jacket ?? color;
  const sleeveBack = mix(sleeve, '#000', 0.22);
  const shoe = shoes ?? color;
  const shoeBack = mix(shoe, '#000', 0.22);
  const frontArmAng = armUp > 0 ? -armUp * 100 + (1 - armUp) * (s * armAmp) : s * armAmp;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * scale} ${scale})`} filter={glowFilter ? `url(#${glowFilter})` : undefined}>
      <defs>
        <radialGradient id={`${id}-sfade`}>
          <stop offset="0.4" stopColor="#000" />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <mask id={`${id}-shoulder`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={-400} y={-700} width={800} height={900}>
          <rect x={-400} y={-700} width={800} height={900} fill="#fff" />
          <circle cx={SHO[0]} cy={SHO[1]} r={56} fill={`url(#${id}-sfade)`} />
        </mask>
      </defs>
      <g transform={`translate(0 ${bob})`}>
        {/* far leg + far arm (darker, behind the body) */}
        <Limb from={HIP} len={177} w={44} ang={s * legAmp} color={back} foot end={shoeBack} />
        <g transform={`rotate(${tilt} 0 -185)`}>
          <Limb from={SHO} len={140} w={36} ang={-s * armAmp - run * 20} color={sleeveBack} mitten end={back} />
        </g>
        {/* near leg + body + head: ONE outline around them all, then the colour - no seams, one smooth shape */}
        <Limb from={HIP} len={177} w={44} ang={-s * legAmp} color={color} foot end={shoe} mode="line" />
        <g transform={`rotate(${tilt} 0 -185)`}>
          <rect x={-60} y={-435} width={118} height={270} rx={52} fill={C.outline} stroke={C.outline} strokeWidth={O * 2} />
          <g transform={`translate(0 -90) rotate(${headTilt} 0 -330)`}>
            <circle cx={14} cy={-412} r={86} fill={C.outline} stroke={C.outline} strokeWidth={O * 2} />
          </g>
          <Limb from={SHO} len={140} w={36} ang={frontArmAng} color={sleeve} mitten end={color} />
        </g>
        <Limb from={HIP} len={177} w={44} ang={-s * legAmp} color={color} foot end={shoe} mode="fill" />
        <g transform={`rotate(${tilt} 0 -185)`}>
          {/* body */}
          <rect x={-60} y={-435} width={118} height={270} rx={52} fill={sleeve} />
          <g transform="translate(0 -70)">{children}</g>
          {accessory === 'scarf' && <path transform="translate(0 -100)" d="M -56 -330 Q 0 -306 56 -330 L 54 -312 Q 0 -288 -54 -312 Z M -40 -318 l -26 56 l 18 6 l 22 -54 z" fill={accessoryColor} stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />}
          {/* head */}
          <g transform={`translate(0 -90) rotate(${headTilt} 0 -330)`}>
            <circle cx={14} cy={-412} r={86} fill={color} />
            {/* eye, brow, mouth on the front side */}
            {lid < 0.95 ? <circle cx={58} cy={-418} r={7} fill={ink} /> : null}
            {lid > 0.05 && <line x1={49} y1={-426 + lid * 14} x2={67} y2={-426 + lid * 14} stroke={ink} strokeWidth={2.8} strokeLinecap="round" />}
            <path d={`M 44 ${-440 - brow * 2} Q 58 ${-446 - brow * 6} 72 ${-440 + brow * 6}`} stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M 66 -378 Q ${76} ${-378 + mouth * 8} 84 ${-382 - mouth * 2}`} stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            {accessory === 'cap' && (
              <g>
                <path d="M -72 -440 C -72 -520 100 -520 100 -440 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} />
                <path d="M 80 -444 Q 130 -446 150 -434 Q 128 -424 80 -428 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
              </g>
            )}
            {accessory === 'headband' && <path d="M -70 -452 Q 14 -476 99 -452 L 98 -434 Q 14 -458 -69 -434 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={3} />}
            {accessory === 'glasses' && <circle cx={58} cy={-418} r={16} fill="none" stroke={C.outline} strokeWidth={3} />}
          </g>
          {/* near arm */}
          <g mask={`url(#${id}-shoulder)`}>
            <Limb from={SHO} len={140} w={36} ang={frontArmAng} color={sleeve} mitten end={color} />
          </g>
        </g>
      </g>
    </g>
  );
};

function mix(a: string, b: string, k: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh: number) => Math.round(((pa >> sh) & 255) * (1 - k) + ((pb >> sh) & 255) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}
