import React from 'react';
import {Hero} from '../common/Hero';
import {C, H, W} from '../common/theme';
import {FLOOR, GREY, Light, Person, SCARF, TAN} from '../common/sets';

/* The four friends (one accessory each). F1 = the one with the cup. F4 (orange scarf) = library friend later. */
export const FRIENDS = [
  {id: 'f1', color: TAN, accessory: 'headphones' as const, accessoryColor: '#6f8fb0'},
  {id: 'f2', color: GREY, accessory: 'glasses' as const, accessoryColor: undefined},
  {id: 'f3', color: TAN, accessory: 'bow' as const, accessoryColor: '#e07b8a'},
  {id: 'f4', color: GREY, accessory: 'scarf' as const, accessoryColor: SCARF},
];

export const Backpack: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 L -54 -110 Q -54 -140 -20 -140 L 20 -140 Q 54 -140 54 -110 L 50 0 Z" fill="#8a4a4a" stroke={C.outline} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-34} y={-62} width={68} height={44} rx={10} fill="#a35a55" stroke={C.outline} strokeWidth={3.5} />
    <path d="M -22 -140 Q -22 -170 0 -170 Q 22 -170 22 -140" fill="none" stroke={C.outline} strokeWidth={6} />
  </g>
);

export const Chair: React.FC<{x: number; y?: number; s?: number; bag?: boolean}> = ({x, y = FLOOR, s = 1, bag}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={-50} y1={0} x2={-50} y2={-150} stroke={C.line} strokeWidth={5} />
    <line x1={50} y1={0} x2={50} y2={-150} stroke={C.line} strokeWidth={5} />
    <rect x={-60} y={-160} width={120} height={16} rx={5} fill="#1b1d21" stroke={C.line} strokeWidth={4} />
    <rect x={-54} y={-330} width={108} height={130} rx={14} fill="none" stroke={C.line} strokeWidth={5} />
    <line x1={-50} y1={-200} x2={-50} y2={-160} stroke={C.line} strokeWidth={5} />
    <line x1={50} y1={-200} x2={50} y2={-160} stroke={C.line} strokeWidth={5} />
    {bag && <Backpack x={0} y={-160} s={0.9} />}
  </g>
);

/** Food tray held in front of the hero (draw after the Hero, same transform). */
export const Tray: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-92} y={-162} width={184} height={22} rx={6} fill="#5a6273" stroke={C.outline} strokeWidth={3.5} />
    <ellipse cx={-36} cy={-166} rx={34} ry={9} fill="#e9e4d6" stroke={C.outline} strokeWidth={3} />
    <path d="M 20 -166 L 24 -196 L 60 -196 L 64 -166 Z" fill="#e9e4d6" stroke={C.outline} strokeWidth={3} />
    <ellipse cx={-70} cy={-150} rx={19} ry={21} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />
    <ellipse cx={70} cy={-150} rx={19} ry={21} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />
  </g>
);

/** Canteen: big windows, menu boards, counter on the right, long table with the friends. */
export const Canteen: React.FC<{t: number; children?: React.ReactNode; friends?: boolean; laugh?: number; f1Cup?: number; bagOff?: number; chairX?: number; f4Reach?: number}> = ({t, children, friends = true, laugh = 1, f1Cup = 0, bagOff = 0, chairX = 1250, f4Reach = 0}) => {
  const lf = (k: number) => Math.sin(t * 6 + k) * 4 * laugh;
  return (
    <g>
      <rect width={W} height={H} fill="#121417" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={140 + i * 300} y={150} width={240} height={300} fill="#1a2230" stroke={C.line} strokeWidth={4} />
      ))}
      <Light id="cwin" x={600} y={300} r={900} color="#9fb4d6" o={0.35} />
      {/* counter + menu */}
      <rect x={1440} y={180} width={380} height={130} rx={8} fill="#1d1b17" stroke={C.amber} strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1470} y={205 + i * 32} width={200 - i * 40} height={12} rx={6} fill={C.amberLight} opacity={0.5} />
      ))}
      <rect x={1420} y={560} width={460} height={300} fill="#17191d" stroke={C.line} strokeWidth={4} />
      <rect x={1420} y={540} width={460} height={24} fill="#1f2228" stroke={C.line} strokeWidth={3} />
      {[1480, 1560, 1640].map((x) => (
        <path key={x} d={`M ${x} 540 L ${x + 6} 500 L ${x + 34} 500 L ${x + 40} 540 Z`} fill="#e9e4d6" stroke={C.outline} strokeWidth={3} />
      ))}
      {/* empty chair with the backpack at the end of the table */}
      <Chair x={chairX} bag={bagOff <= 0} />
      {bagOff > 0 && <Backpack x={chairX - 60 - bagOff * 120} y={FLOOR - 160 * (1 - bagOff)} s={0.9} />}
      {friends &&
        [...FRIENDS.map((f, i) => ({f, i}))].reverse().map(({f, i}) => (
          <Person
            key={f.id}
            id={`cf${f.id}`}
            x={380 + i * 210}
            y={820}
            color={f.color}
            accessory={f.accessory}
            accessoryColor={f.accessoryColor}
            lHand={[-60, -130]}
            rHand={i === 3 && f4Reach ? [80 + f4Reach * 160, -130 - f4Reach * 60] : i === 3 && f1Cup ? [80, -130] : i === 0 && f1Cup ? [interpolateN(f1Cup, 70, 150), interpolateN(f1Cup, -130, -250)] : [70, -130]}
            rHold={i === 0 && f1Cup > 0 ? 'cup' : 'none'}
            headTilt={lf(i)}
            expr={{mouth: 0.9 * laugh + (1 - laugh) * 0.3, eyeX: i < 2 ? 10 : -10, lid: laugh > 0.5 && i % 2 ? 0.4 : 0}}
          />
        ))}
      {/* long table */}
      <rect x={240} y={700} width={1110} height={22} rx={6} fill="#1b1d22" stroke={C.line} strokeWidth={3} />
      {[340, 560, 780, 1000].map((x) => (
        <ellipse key={x} cx={x + 40} cy={696} rx={42} ry={9} fill="#e9e4d6" stroke={C.outline} strokeWidth={3} />
      ))}
      <line x1={280} y1={722} x2={280} y2={FLOOR} stroke={C.line} strokeWidth={5} />
      <line x1={1310} y1={722} x2={1310} y2={FLOOR} stroke={C.line} strokeWidth={5} />
      {children}
      <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    </g>
  );
};

const interpolateN = (p: number, a: number, b: number) => a + (b - a) * p;

export {Hero};
