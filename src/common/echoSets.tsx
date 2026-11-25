import React from 'react';
import {C, H, W} from './theme';
import {clamp01, FLOOR, Light, mixColor} from './sets';

/* ---------------------------------------------------------------- the drawing */
/** His simple warm drawing: hills, a house, a tree and a sun. kid=true → crayon-style childhood drawing. */
export const Doodle: React.FC<{x: number; y: number; w: number; h: number; kid?: boolean; draw?: number; note?: boolean}> = ({x, y, w, h, kid, draw = 1, note = true}) => {
  const sw = kid ? 6 : 3.5;
  const p = (k: number) => clamp01(draw * 5 - k); // strokes appear one by one
  const sx = (v: number) => x + v * w;
  const sy = (v: number) => y + v * h;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={x} y={y} width={w} height={h} fill={kid ? '#f6efd9' : '#efe7d0'} stroke="#b9ad8f" strokeWidth={2} />
      <path d={`M ${sx(0.04)} ${sy(0.78)} Q ${sx(0.3)} ${sy(0.6)} ${sx(0.55)} ${sy(0.74)} T ${sx(0.96)} ${sy(0.7)}`} stroke={kid ? '#5aa05a' : '#7b8f5a'} strokeWidth={sw} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(0)} />
      <path d={`M ${sx(0.2)} ${sy(0.72)} L ${sx(0.2)} ${sy(0.5)} L ${sx(0.32)} ${sy(0.38)} L ${sx(0.44)} ${sy(0.5)} L ${sx(0.44)} ${sy(0.7)}`} stroke={kid ? '#d9534f' : '#a3623f'} strokeWidth={sw} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(1)} />
      <rect x={sx(0.29)} y={sy(0.58)} width={w * 0.06} height={h * 0.12} stroke={kid ? '#3b6fb0' : '#6b5a48'} strokeWidth={sw * 0.7} opacity={p(2)} />
      <path d={`M ${sx(0.72)} ${sy(0.72)} L ${sx(0.72)} ${sy(0.5)}`} stroke="#7a5a3a" strokeWidth={sw} opacity={p(2)} />
      <circle cx={sx(0.72)} cy={sy(0.42)} r={w * 0.09} stroke={kid ? '#5aa05a' : '#6f8a4e'} strokeWidth={sw} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(3)} />
      <circle cx={sx(0.82)} cy={sy(0.16)} r={w * 0.07} stroke={C.amber} strokeWidth={sw} fill={kid ? '#f7d46b' : 'none'} opacity={p(4)} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={sx(0.82) + Math.cos(a) * w * 0.1} y1={sy(0.16) + Math.sin(a) * w * 0.1} x2={sx(0.82) + Math.cos(a) * w * 0.14} y2={sy(0.16) + Math.sin(a) * w * 0.14} stroke={C.amber} strokeWidth={sw * 0.8} opacity={p(4)} />;
      })}
      {kid && note && (
        <text x={sx(0.06)} y={sy(0.94)} fontFamily="Patrick Hand" fontSize={h * 0.11} fill="#c0392b" stroke="none">
          Keep going! – Mom
        </text>
      )}
    </g>
  );
};

/* ---------------------------------------------------------------- the echo */
const rnd = (i: number, s: number) => Math.abs(Math.sin(i * 12.9898 + s * 78.233) * 43758.5453) % 1;

/** Floating cold letters "ugly." that multiply and grow. shatter 0..1 makes them crack and fall. */
export const EchoWords: React.FC<{
  t: number;
  n: number; // how many copies
  area: [number, number, number, number]; // x1,y1,x2,y2
  size?: [number, number];
  shatter?: number;
  dim?: number; // 0..1 fade
  seed?: number;
}> = ({t, n, area, size = [40, 140], shatter = 0, dim = 0, seed = 1}) => {
  const [x1, y1, x2, y2] = area;
  const items = [];
  const count = Math.floor(n);
  for (let i = 0; i < count; i++) {
    const r1 = rnd(i, seed);
    const r2 = rnd(i + 100, seed);
    const r3 = rnd(i + 200, seed);
    const fs = size[0] + (size[1] - size[0]) * r3;
    const bx = x1 + (x2 - x1) * r1 + Math.sin(t * 0.6 + i) * 14;
    const by = y1 + (y2 - y1) * r2 + Math.cos(t * 0.5 + i * 1.7) * 10;
    const born = i === count - 1 ? n - count : 1;
    const pulse = 0.85 + 0.15 * Math.sin(t * 2.2 + i);
    const fall = shatter > 0 ? Math.pow(clamp01(shatter * 1.4 - r1 * 0.4), 1.6) : 0;
    const o = (0.25 + 0.55 * r3) * pulse * (1 - dim) * Math.min(1, born + 0.2) * (1 - fall);
    if (o <= 0.01) continue;
    items.push(
      <text
        key={i}
        x={bx}
        y={by + fall * 700}
        fontFamily="Nunito"
        fontWeight={900}
        fontSize={fs}
        fill={C.cold}
        fillOpacity={0.18}
        stroke={C.coldLight}
        strokeWidth={Math.max(2, fs / 40)}
        opacity={o}
        textAnchor="middle"
        transform={`rotate(${(r2 - 0.5) * 16 + fall * (r1 - 0.5) * 160} ${bx} ${by + fall * 700})`}
        style={{filter: `drop-shadow(0 0 ${6 + fs / 12}px ${C.cold})`}}
      >
        ugly.
      </text>,
    );
  }
  return <g>{items}</g>;
};

/** Echo ripple rings expanding from a point. */
export const Ripples: React.FC<{x: number; y: number; t: number; o?: number; max?: number}> = ({x, y, t, o = 1, max = 260}) => (
  <g fill="none" stroke={C.coldLight}>
    {[0, 1, 2].map((k) => {
      const p = ((t * 0.6 + k / 3) % 1 + 1) % 1;
      return <circle key={k} cx={x} cy={y} r={20 + p * max} strokeWidth={3} opacity={o * (1 - p) * 0.6} />;
    })}
  </g>
);

/* ---------------------------------------------------------------- his room */
export const DeskRoom: React.FC<{
  t: number;
  lamp: number; // 1 warm .. 0 cold/off
  sky: {top: string; bottom: string; sun?: number};
  drawer?: number; // 0 closed .. 1 open
  drawerGlow?: number;
  mid?: React.ReactNode; // behind the desk (sitting hero)
  onDesk?: React.ReactNode;
  front?: React.ReactNode;
  warmFlood?: number;
}> = ({t, lamp, sky, drawer = 0, drawerGlow = 0, mid, onDesk, front, warmFlood = 0}) => {
  const lampCol = mixColor(lamp, C.coldLight, C.amberLight);
  const dOut = drawer * 60;
  return (
    <g>
      <defs>
        <linearGradient id="drsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <linearGradient id="lampcone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lampCol} stopOpacity={0.4} />
          <stop offset="1" stopColor={lampCol} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* window */}
      <rect x={230} y={250} width={300} height={310} fill="url(#drsky)" stroke={C.line} strokeWidth={3} />
      {sky.sun !== undefined && sky.sun > 0 && (
        <g>
          <clipPath id="drwin">
            <rect x={230} y={250} width={300} height={310} />
          </clipPath>
          <circle cx={380} cy={560 - sky.sun * 160} r={56} fill={C.amberLight} clipPath="url(#drwin)" opacity={sky.sun} />
        </g>
      )}
      <line x1={380} y1={250} x2={380} y2={560} stroke={C.line} strokeWidth={3} />
      <line x1={230} y1={405} x2={530} y2={405} stroke={C.line} strokeWidth={3} />
      <line x1={215} y1={566} x2={545} y2={566} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      {/* shelf with books */}
      <line x1={1320} y1={380} x2={1620} y2={380} stroke={C.line} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={1340 + i * 34} y={300 + (i % 2) * 12} width={26} height={80 - (i % 2) * 12} fill="#16191e" stroke={i === 2 ? C.amber : C.line} strokeWidth={3} />
      ))}
      {/* bed edge at the right */}
      <rect x={1600} y={690} width={400} height={80} rx={12} fill="#1a1e25" stroke={C.line} strokeWidth={3} />
      <line x1={1620} y1={770} x2={1620} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      {warmFlood > 0 && <Light id="drflood" x={380} y={420} r={1100} color={C.amber} o={warmFlood} />}
      {/* chair back */}
      <rect x={880} y={520} width={160} height={190} rx={14} fill="none" stroke={C.lineSoft} strokeWidth={3} />
      {mid}
      {/* lamp */}
      <g>
        <line x1={690} y1={698} x2={700} y2={560} stroke={C.line} strokeWidth={5} />
        <line x1={700} y1={560} x2={780} y2={520} stroke={C.line} strokeWidth={5} />
        <ellipse cx={690} cy={700} rx={34} ry={8} fill="#16191e" stroke={C.line} strokeWidth={3} />
        <path d="M 760 505 L 830 540 L 805 575 L 745 545 Z" fill="#1d1a15" stroke={lamp > 0.5 ? C.amber : C.line} strokeWidth={3} />
        {lamp >= 0 && <polygon points="790,560 820,556 1080,700 840,700" fill="url(#lampcone)" style={{mixBlendMode: 'screen'}} />}
      </g>
      <Light id="drlamp" x={900} y={660} r={520} color={lampCol} o={0.9} />
      {/* desk */}
      <rect x={620} y={700} width={680} height={22} rx={5} fill="#17191d" stroke={C.line} strokeWidth={3} />
      {onDesk}
      <path d="M 640 722 L 640 820 L 1280 820 L 1280 722" fill="#121418" stroke={C.line} strokeWidth={3} />
      {/* drawer */}
      {drawerGlow > 0 && <rect x={1112} y={728} width={146} height={6} fill={C.amberLight} opacity={drawerGlow} style={{filter: `drop-shadow(0 0 ${12 + drawerGlow * 20}px ${C.amber})`}} />}
      {drawer > 0 && <rect x={1105 - dOut * 0.2} y={725 + dOut} width={160 + dOut * 0.4} height={18} fill="#0d0f12" stroke={C.line} strokeWidth={2} />}
      <rect x={1105 - dOut * 0.2} y={734 + dOut} width={160 + dOut * 0.4} height={72} rx={6} fill="#14171b" stroke={C.line} strokeWidth={3} />
      <line x1={1165} y1={770 + dOut} x2={1205} y2={770 + dOut} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
      <line x1={660} y1={820} x2={660} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      <line x1={1260} y1={820} x2={1260} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      <line x1={120} y1={FLOOR} x2={1800} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      {front}
    </g>
  );
};

/* ---------------------------------------------------------------- art class */
export const ArtClass: React.FC<{t: number; emptySpot?: boolean; children?: React.ReactNode; warm?: number}> = ({t, emptySpot = true, children, warm = 0.6}) => (
  <g>
    <Light id="acw" x={960} y={380} r={900} color={C.amber} o={warm} />
    {/* pin board with classmates' drawings */}
    <rect x={260} y={190} width={1400} height={330} rx={10} fill="#1a1714" stroke={C.line} strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const x = 300 + i * 225;
      const empty = emptySpot && i === 3;
      return (
        <g key={i}>
          {!empty && <Doodle x={x} y={225 + (i % 2) * 18} w={180} h={130} />}
          {empty && <rect x={x} y={225 + (i % 2) * 18} width={180} height={130} fill="none" stroke={C.lineSoft} strokeWidth={3} strokeDasharray="10 8" />}
          <circle cx={x + 90} cy={222 + (i % 2) * 18} r={7} fill={i === 3 ? C.coldLight : '#e0565b'} stroke={C.outline} strokeWidth={2} />
        </g>
      );
    })}
    {children}
    <line x1={120} y1={FLOOR} x2={1800} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** A simple table with paper on it (class / desk). */
export const Table: React.FC<{x: number; w?: number; children?: React.ReactNode}> = ({x, w = 520, children}) => (
  <g>
    <rect x={x - w / 2} y={700} width={w} height={20} rx={5} fill="#17191d" stroke={C.line} strokeWidth={3} />
    {children}
    <line x1={x - w / 2 + 20} y1={720} x2={x - w / 2 + 20} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    <line x1={x + w / 2 - 20} y1={720} x2={x + w / 2 - 20} y2={FLOOR} stroke={C.line} strokeWidth={4} />
  </g>
);

/* ---------------------------------------------------------------- park */
export const Bench: React.FC<{x: number; w?: number; front?: boolean}> = ({x, w = 460, front}) =>
  front ? (
    <g>
      <rect x={x - w / 2} y={760} width={w} height={22} rx={6} fill="#1b1d20" stroke={C.line} strokeWidth={3} />
      <line x1={x - w / 2 + 30} y1={782} x2={x - w / 2 + 30} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      <line x1={x + w / 2 - 30} y1={782} x2={x + w / 2 - 30} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    </g>
  ) : (
    <g>
      <rect x={x - w / 2} y={620} width={w} height={20} rx={6} fill="none" stroke={C.line} strokeWidth={3} />
      <rect x={x - w / 2} y={670} width={w} height={20} rx={6} fill="none" stroke={C.line} strokeWidth={3} />
      <line x1={x - w / 2 + 30} y1={640} x2={x - w / 2 + 30} y2={760} stroke={C.line} strokeWidth={4} />
      <line x1={x + w / 2 - 30} y1={640} x2={x + w / 2 - 30} y2={760} stroke={C.line} strokeWidth={4} />
    </g>
  );

export const Board: React.FC<{x: number; pinned?: number; t: number}> = ({x, pinned = 0, t}) => (
  <g>
    <line x1={x - 120} y1={FLOOR} x2={x - 120} y2={420} stroke={C.line} strokeWidth={6} />
    <line x1={x + 120} y1={FLOOR} x2={x + 120} y2={420} stroke={C.line} strokeWidth={6} />
    <rect x={x - 150} y={360} width={300} height={240} rx={8} fill="#2a2018" stroke={C.amber} strokeWidth={3} />
    <rect x={x - 130} y={380} width={70} height={50} fill="#d9d2bf" opacity={0.6} />
    <rect x={x + 60} y={400} width={60} height={44} fill="#d9d2bf" opacity={0.5} />
    {pinned > 0 && (
      <g opacity={pinned}>
        <Doodle x={x - 70} y={440 - (1 - pinned) * 20} w={140} h={110} />
        <circle cx={x} cy={438} r={6} fill="#e0565b" stroke={C.outline} strokeWidth={2} />
      </g>
    )}
  </g>
);

/* ---------------------------------------------------------------- phone POV */
export const PhonePOV: React.FC<{px?: number; py?: number; children: React.ReactNode; thumb?: [number, number]}> = ({px = 960, py = 560, children, thumb}) => {
  const pw = 440;
  const ph = 800;
  const tx = thumb ? thumb[0] : px + pw / 2 - 20;
  const ty = thumb ? thumb[1] : py + 200;
  return (
    <g>
      <rect x={px - pw / 2} y={py - ph / 2} width={pw} height={ph} rx={46} fill="#14171c" stroke={C.outline} strokeWidth={6} />
      <clipPath id="povscr">
        <rect x={px - pw / 2 + 22} y={py - ph / 2 + 30} width={pw - 44} height={ph - 60} rx={26} />
      </clipPath>
      <g clipPath="url(#povscr)">
        <rect x={px - pw / 2 + 22} y={py - ph / 2 + 30} width={pw - 44} height={ph - 60} fill="#e9eef7" />
        {children}
      </g>
      <ellipse cx={px - pw / 2 - 6} cy={py + 230} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
      <path d={`M ${px - pw / 2 - 60} ${py + 330} L ${px - pw / 2 - 90} 1150 L ${px - pw / 2 + 30} 1150 L ${px - pw / 2 + 40} ${py + 300}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
      <ellipse cx={px + pw / 2 + 6} cy={py + 250} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
      <path d={`M ${px + pw / 2 + 60} ${py + 350} L ${px + pw / 2 + 90} 1150 L ${px + pw / 2 - 30} 1150 L ${px + pw / 2 - 40} ${py + 320}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
      <rect x={px + pw / 2 - 52} y={py + 385} width={150} height={44} rx={12} fill={C.teal} stroke={C.outline} strokeWidth={5} transform={`rotate(8 ${px + pw / 2 + 20} ${py + 405})`} />
      <ellipse cx={tx} cy={ty} rx={38} ry={54} fill={C.cream} stroke={C.outline} strokeWidth={5} transform={`rotate(-50 ${tx} ${ty})`} />
    </g>
  );
};

export {W, H};
