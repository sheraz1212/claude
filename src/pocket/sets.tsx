import React from 'react';
import {Light} from '../common/sets';
import {C} from '../common/theme';

/* POCKET MONEY - sets, people and props. One dark night palette; brightness only from lamps. */
const OL = C.outline;
export const RED = '#f2615a'; // accent: the price tags
export const RED_L = '#ff8f84';
export const GREY = '#9a9da3';
export const TAN = C.tan;
export const CHEAP_SHOES = '#6e5c4c';
export const NEW_SHOES = '#eceae4';

export const MOM = {color: TAN, accessory: 'longhair' as const, accessoryColor: '#6b4630', jacket: '#6f727b'};
/** Mom at work: the diner uniform (teal dress + white apron + name tag) */
export const MOM_WORK = {...MOM, jacket: '#3f7d80', apron: '#f2efe8'};
export const UNIFORM = {jacket: '#3f7d80', apron: '#f2efe8'};
export const F1 = {color: GREY, accessory: 'cap' as const, accessoryColor: '#c0392b', jacket: '#2f3b56', shoes: NEW_SHOES}; // leader, red cap
export const F2 = {color: TAN, accessory: 'cap' as const, accessoryColor: '#2d6a6a', jacket: '#4a3a5a', shoes: NEW_SHOES};
export const F3 = {color: GREY, accessory: 'glasses' as const, jacket: '#5a4632', shoes: NEW_SHOES};

/** A glowing price tag on a string. (ax, ay) = where the string is tied; the tag hangs at (ax+dx, ay+dy). */
export const PriceTag: React.FC<{ax: number; ay: number; dx?: number; dy?: number; price: string; s?: number; o?: number; glow?: number; t?: number; small?: boolean; big?: boolean}> = ({
  ax, ay, dx = 30, dy = 40, price, s = 1, o = 1, glow = 1, t = 0, small = false, big = false,
}) => {
  if (big) s *= 1.6;
  const sw = Math.sin(t * 2.2 + ax * 0.01) * 4;
  const x = ax + (dx + sw) * s;
  const y = ay + dy * s;
  const w = (small ? 62 : 30 + price.length * 19) * s;
  const h = (small ? 34 : 46) * s;
  const col = small ? '#8a8f99' : RED;
  return (
    <g opacity={o}>
      <path d={`M ${ax} ${ay} Q ${(ax + x) / 2} ${(ay + y) / 2 + 10 * s} ${x} ${y}`} stroke="#d8d4cc" strokeWidth={2.2 * s} fill="none" />
      {!small && glow > 0 && <rect x={x - 12 * s} y={y - 12 * s} width={w + 24 * s} height={h + 24 * s} rx={14 * s} fill={RED} opacity={0.28 * glow} />}
      <path d={`M ${x} ${y + h / 2} L ${x + 14 * s} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + 14 * s} ${y + h} Z`} fill={col} stroke={OL} strokeWidth={2.5 * s} strokeLinejoin="round" />
      <circle cx={x + 12 * s} cy={y + h / 2} r={4 * s} fill="#1b1a20" />
      <text x={x + 20 * s + (w - 20 * s) / 2} y={y + h * 0.73} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={(small ? 22 : 30) * s} fill="#fff">{price}</text>
    </g>
  );
};

/** Tag positions on a standing front-view character (feet at x,y, scale s). */
export const tagAt = {
  shoes: (x: number, y: number, s: number): [number, number] => [x + 52 * s, y - 20 * s],
  cap: (x: number, y: number, s: number): [number, number] => [x + 60 * s, y - 590 * s],
  jacket: (x: number, y: number, s: number): [number, number] => [x + 112 * s, y - 330 * s],
};

const Skyline: React.FC<{x: number; y: number; w: number; h: number; seed?: number; lit?: number}> = ({x, y, w, h, seed = 1, lit = 0.7}) => {
  const b = Array.from({length: Math.ceil(w / 70)}, (_, i) => {
    const r = Math.abs(Math.sin(i * 12.9898 * seed + 78.233)) % 1;
    return {bx: x + i * 70, bh: h * (0.35 + r * 0.6), r};
  });
  return (
    <g>
      {b.map(({bx, bh, r}, i) => (
        <g key={i}>
          <rect x={bx} y={y + h - bh} width={66} height={bh} fill="#1c1a28" />
          {Array.from({length: Math.floor(bh / 34)}, (_, k) =>
            (Math.sin(i * 7.1 + k * 3.3 + seed) > 0.25 ? <rect key={k} x={bx + 10 + ((k * 13 + i * 5) % 36)} y={y + h - bh + 12 + k * 34} width={9} height={12} fill={C.amberLight} opacity={lit * (0.5 + r * 0.5)} /> : null),
          )}
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ (A) SCHOOL HALLWAY */
export const HALL_Y = 880;
export const Hallway: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#25232f" />
    {/* high windows: dusk sky + skyline */}
    <defs>
      <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c2747" />
        <stop offset="1" stopColor="#6d4558" />
      </linearGradient>
    </defs>
    {[120, 620, 1120, 1620].map((wx) => (
      <g key={wx}>
        <rect x={wx} y={130} width={300} height={190} fill="url(#hsky)" />
        <Skyline x={wx} y={200} w={300} h={120} seed={wx} />
        <rect x={wx} y={130} width={300} height={190} fill="none" stroke="#3b3442" strokeWidth={12} />
        <line x1={wx + 150} y1={130} x2={wx + 150} y2={320} stroke="#3b3442" strokeWidth={8} />
      </g>
    ))}
    {/* ceiling lights */}
    {[480, 1440].map((lx) => (
      <g key={lx}>
        <rect x={lx - 90} y={56} width={180} height={16} rx={6} fill="#efe6cf" />
        <Light id={`hl${lx}`} x={lx} y={420} r={620} color={C.amberLight} o={0.55} />
      </g>
    ))}
    {/* lockers */}
    <rect x={0} y={380} width={1920} height={500} fill="#2f3646" />
    {Array.from({length: 22}, (_, i) => (
      <g key={i}>
        <rect x={i * 88 + 4} y={390} width={82} height={480} rx={3} fill={i % 7 === 3 ? '#3c4559' : '#36405a'} stroke="#1e2330" strokeWidth={4} />
        {[0, 1, 2].map((k) => <line key={k} x1={i * 88 + 22} y1={420 + k * 12} x2={i * 88 + 66} y2={420 + k * 12} stroke="#1e2330" strokeWidth={3} />)}
        <rect x={i * 88 + 64} y={600} width={8} height={36} rx={3} fill="#5c6680" />
      </g>
    ))}
    {/* poster on the wall above */}
    <rect x={930} y={250} width={120} height={100} fill="#4a3a56" stroke={OL} strokeWidth={3} />
    <text x={990} y={312} textAnchor="middle" fontFamily="Patrick Hand" fontSize={30} fill="#d8cbe0">PROM</text>
    {/* floor */}
    <rect y={HALL_Y} width={1920} height={200} fill="#22202a" />
    {Array.from({length: 13}, (_, i) => <line key={i} x1={i * 160 - 40} y1={HALL_Y} x2={i * 200 - 260} y2={1080} stroke="#00000040" strokeWidth={3} />)}
    {[930, 990, 1050].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000030" strokeWidth={3} />)}
    {[480, 1440].map((lx) => <ellipse key={lx} cx={lx} cy={930} rx={360} ry={46} fill={C.amberLight} opacity={0.07} />)}
  </g>
);

/* ------------------------------------------------------------------ (B) HOME KITCHEN (night) */
export const Kitchen: React.FC<{t: number; lamp?: number}> = ({t, lamp = 1}) => (
  <g>
    <rect width={1920} height={1080} fill="#29242e" />
    <rect width={1920} height={60} fill="#00000030" />
    {/* window with the night city */}
    <rect x={150} y={200} width={360} height={330} fill="#171629" />
    <Skyline x={150} y={330} w={360} h={200} seed={3} lit={0.9} />
    <rect x={150} y={200} width={360} height={330} fill="none" stroke="#3c3038" strokeWidth={14} />
    <line x1={330} y1={200} x2={330} y2={530} stroke="#3c3038" strokeWidth={9} />
    <rect x={136} y={526} width={388} height={18} fill="#4a3a36" stroke={OL} strokeWidth={3} />
    {/* bills stuck on the fridge, calendar */}
    <rect x={1500} y={300} width={230} height={560} rx={16} fill="#b9b6ae" stroke={OL} strokeWidth={4} />
    <line x1={1500} y1={500} x2={1730} y2={500} stroke={OL} strokeWidth={4} />
    <rect x={1700} y={360} width={12} height={90} rx={5} fill="#8a877f" />
    <rect x={1700} y={540} width={12} height={110} rx={5} fill="#8a877f" />
    <rect x={1540} y={330} width={70} height={90} fill="#efe6d6" stroke={OL} strokeWidth={2} transform="rotate(-4 1575 375)" />
    <rect x={1560} y={540} width={60} height={70} fill="#f2d98a" stroke={OL} strokeWidth={2} transform="rotate(5 1590 575)" />
    {/* counter + cupboards */}
    <rect x={620} y={560} width={760} height={300} fill="#3a3040" stroke={OL} strokeWidth={4} />
    <rect x={610} y={540} width={780} height={24} fill="#5a4a50" stroke={OL} strokeWidth={4} />
    <rect x={620} y={240} width={760} height={150} fill="#3a3040" stroke={OL} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={620 + i * 190} y1={240} x2={620 + i * 190} y2={390} stroke={OL} strokeWidth={3} />)}
    {[0, 1, 2, 3].map((i) => <line key={i} x1={620 + i * 190} y1={560} x2={620 + i * 190} y2={860} stroke={OL} strokeWidth={3} />)}
    <rect x={1180} y={500} width={70} height={40} rx={6} fill="#c9c4bc" stroke={OL} strokeWidth={3} />
    {/* hanging lamp */}
    <line x1={960} y1={0} x2={960} y2={330} stroke="#1a1a1e" strokeWidth={4} />
    <path d="M 900 380 L 1020 380 L 990 330 L 930 330 Z" fill="#d9a66a" stroke={OL} strokeWidth={3} />
    {lamp > 0 && <Light id="klamp" x={960} y={480} r={700} color={C.amber} o={0.8 * lamp} />}
    {/* floor */}
    <rect y={860} width={1920} height={220} fill="#201d25" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => <line key={i} x1={i * 160} y1={860} x2={i * 160} y2={1080} stroke="#00000030" strokeWidth={3} />)}
    {lamp > 0 && <ellipse cx={960} cy={900} rx={480} ry={50} fill={C.amberLight} opacity={0.08 * lamp} />}
  </g>
);

/** A plain kitchen chair back (draw BEFORE the seated person). */
export const Chair: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 70} y={520} width={140} height={210} rx={16} fill="#4a3428" stroke={OL} strokeWidth={4} />
    <rect x={x - 54} y={540} width={108} height={60} rx={10} fill="#5a4030" />
    <rect x={x - 66} y={730} width={14} height={130} fill="#3a2a20" />
    <rect x={x + 52} y={730} width={14} height={130} fill="#3a2a20" />
  </g>
);

/** The kitchen table - drawn AFTER seated people so it hides their legs. */
export const KitchenTable: React.FC<{bills?: number; box?: 'none' | 'closed' | 'open'; lunch?: boolean}> = ({bills = 0, box = 'none', lunch = false}) => (
  <g>
    <rect x={640} y={680} width={640} height={26} rx={6} fill="#6a4a36" stroke={OL} strokeWidth={4} />
    <rect x={670} y={706} width={22} height={160} fill="#4a3428" />
    <rect x={1228} y={706} width={22} height={160} fill="#4a3428" />
    {Array.from({length: bills}, (_, i) => (
      <rect key={i} x={820 + i * 30} y={668 - (i % 2) * 3} width={70} height={14} rx={2} fill="#7fa77a" stroke={OL} strokeWidth={2} transform={`rotate(${(i % 3) * 5 - 5} ${855 + i * 30} 675)`} />
    ))}
    {box !== 'none' && (
      <g>
        <rect x={1080} y={644} width={110} height={38} rx={8} fill="#5b86b8" stroke={OL} strokeWidth={3} />
        {box === 'closed' && <rect x={1076} y={636} width={118} height={14} rx={6} fill="#4a72a2" stroke={OL} strokeWidth={3} />}
      </g>
    )}
    {lunch && (
      <g>
        <rect x={720} y={640} width={120} height={42} rx={8} fill="#c7d97a" stroke={OL} strokeWidth={3} />
        <rect x={716} y={632} width={128} height={14} rx={6} fill="#a8bb5e" stroke={OL} strokeWidth={3} />
      </g>
    )}
  </g>
);

/* ------------------------------------------------------------------ INSERT: the folded $20 */
/** fold 0 = flat bill, 1 = folded into a little triangle. reach moves the hand toward camera-left. */
export const BillInsert: React.FC<{t: number; fold: number; reach?: number; take?: number}> = ({t, fold, reach = 0, take = 0}) => {
  const f = Math.max(0, Math.min(1, fold));
  const hx = 1180 - reach * 260;
  const hy = 560;
  // flat bill -> triangle: interpolate a 4-point shape into a 3-point one
  const P = (a: [number, number], b: [number, number]) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const pts = [P([-170, -80], [-95, 70]), P([170, -80], [0, -95]), P([170, 80], [95, 70]), P([-170, 80], [-95, 70])].map(([x, y]) => `${hx - 130 + x},${hy - 60 + y}`).join(' ');
  return (
    <g>
      <rect width={1920} height={1080} fill="#2a1f1c" />
      {/* the wooden table, close */}
      <rect y={620} width={1920} height={460} fill="#5a3e2e" />
      {[690, 780, 900, 1030].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000030" strokeWidth={4} />)}
      <Light id="bil" x={900} y={400} r={900} color={C.amber} o={0.85} />
      {/* her sleeve (worn coat, frayed) + mitten hand */}
      <path d={`M 2000 ${hy + 200} L ${hx + 120} ${hy + 40}`} stroke={OL} strokeWidth={196} strokeLinecap="round" />
      <path d={`M 2000 ${hy + 200} L ${hx + 120} ${hy + 40}`} stroke={MOM.jacket} strokeWidth={186} strokeLinecap="round" />
      {[0, 1, 2].map((k) => <path key={k} d={`M ${hx + 60 + k * 30} ${hy - 30 + k * 40} l -18 26`} stroke={OL} strokeWidth={4} />)}
      <polygon points={pts} fill="#86ad7f" stroke={OL} strokeWidth={6} strokeLinejoin="round" opacity={1 - take} />
      {f < 0.6 && <text x={hx - 130} y={hy - 46} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#4c6e48" opacity={(1 - f / 0.6) * (1 - take)}>20</text>}
      <ellipse cx={hx + 40} cy={hy + 10} rx={110} ry={120} fill={MOM.color} stroke={OL} strokeWidth={6} />
      <ellipse cx={hx - 20} cy={hy - 70} rx={36} ry={52} fill={MOM.color} stroke={OL} strokeWidth={6} transform={`rotate(-30 ${hx - 20} ${hy - 70})`} />
    </g>
  );
};
