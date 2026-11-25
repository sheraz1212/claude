import React from 'react';
import {Hero} from './Hero';
import {C, H, W} from './theme';

export const FLOOR = 862;

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mixColor = (p: number, a: string, b: string) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp01(p))).join(',')})`;
};

export const blinkAt = (t: number, times: number[]) => {
  let b = 0;
  for (const bt of times) {
    const d = Math.abs(t - bt);
    if (d < 0.12) b = Math.max(b, 1 - d / 0.12);
  }
  return b;
};

/** Camera: slow scale around a point. */
export const Cam: React.FC<{s: number; cx: number; cy: number; dx?: number; dy?: number; children: React.ReactNode}> = ({
  s,
  cx,
  cy,
  dx = 0,
  dy = 0,
  children,
}) => <g transform={`translate(${cx + dx} ${cy + dy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>;

export const Stage: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = C.bg}) => (
  <svg width={W} height={H} style={{position: 'absolute'}}>
    <rect width={W} height={H} fill={bg} />
    {children}
  </svg>
);

/** Soft coloured light pool (screen blend). */
export const Light: React.FC<{id: string; x: number; y: number; r: number; color: string; o: number}> = ({id, x, y, r, color, o}) => (
  <>
    <defs>
      <radialGradient id={id} cx={x} cy={y} r={r} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} stopOpacity={0.45} />
        <stop offset="0.5" stopColor={color} stopOpacity={0.12} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} opacity={o} style={{mixBlendMode: 'screen'}} />
  </>
);

/* ------------------------------------------------------------------ GLASS BOX */

type GlassProps = {
  id: string;
  x: number; // centre
  floor?: number;
  w?: number;
  h?: number;
  panes: number; // 0..4 (right side, left side, back, front) – fractional = growing
  t: number;
  frost?: number;
  thick?: number; // 0..1 heavier, darker glass
  crack?: number; // 0..1
  dissolve?: number; // 0..1
  layer: 'back' | 'front';
};

const DX = 34;
const DY = -30;

export const GlassBox: React.FC<GlassProps> = ({id, x, floor = FLOOR, w = 300, h = 500, panes, t, frost = 0, thick = 0, crack = 0, dissolve = 0, layer}) => {
  const x1 = x - w / 2;
  const x2 = x + w / 2;
  const p = (i: number) => clamp01(panes - i);
  const op = 1 - dissolve;
  if (op <= 0.001) return null;
  const stroke = C.coldLight;
  const sw = 2.5 + thick * 2.5;
  const fillO = 0.12 + thick * 0.14;
  const quad = (pts: number[][], k: string, grow: number) => {
    if (grow <= 0) return null;
    // grow from the floor up
    const minY = Math.min(...pts.map((q) => q[1]));
    const maxY = Math.max(...pts.map((q) => q[1]));
    const cut = maxY - (maxY - minY) * grow;
    return (
      <g key={k}>
        <clipPath id={`${id}-${k}-c`}>
          <rect x={0} y={cut} width={W} height={H} />
        </clipPath>
        <g clipPath={`url(#${id}-${k}-c)`}>
          <polygon points={pts.map((q) => q.join(',')).join(' ')} fill={`url(#${id}-fill)`} opacity={1} />
          <polygon
            points={pts.map((q) => q.join(',')).join(' ')}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
            strokeOpacity={0.85}
            strokeLinejoin="round"
            style={{filter: `drop-shadow(0 0 8px ${C.cold})`}}
          />
        </g>
      </g>
    );
  };
  const shine = ((t * 0.3) % 1) * (w + 200) - 100;

  const defs = (
    <defs>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.coldLight} stopOpacity={fillO} />
        <stop offset="1" stopColor={C.cold} stopOpacity={fillO * 0.4} />
      </linearGradient>
    </defs>
  );

  if (layer === 'back') {
    return (
      <g opacity={op} transform={`translate(0 ${-dissolve * 40})`}>
        {defs}
        {quad([[x2, floor], [x2 + DX, floor + DY], [x2 + DX, floor + DY - h], [x2, floor - h]], 'r', p(0))}
        {quad([[x1, floor], [x1 + DX, floor + DY], [x1 + DX, floor + DY - h], [x1, floor - h]], 'l', p(1))}
        {quad([[x1 + DX, floor + DY], [x2 + DX, floor + DY], [x2 + DX, floor + DY - h], [x1 + DX, floor + DY - h]], 'b', p(2))}
      </g>
    );
  }
  // front layer: front pane + lid + frost + crack
  const f = p(3);
  const crackPts: [number, number][] = [
    [x - w * 0.1, floor - h * 0.55],
    [x - w * 0.3, floor - h * 0.75],
    [x - w * 0.48, floor - h * 0.82],
  ];
  const crackPts2: [number, number][] = [
    [x - w * 0.1, floor - h * 0.55],
    [x + w * 0.15, floor - h * 0.4],
    [x + w * 0.32, floor - h * 0.18],
    [x + w * 0.5, floor - h * 0.1],
  ];
  const crackPts3: [number, number][] = [
    [x - w * 0.1, floor - h * 0.55],
    [x + w * 0.05, floor - h * 0.85],
    [x + w * 0.2, floor - h],
  ];
  const poly = (pts: [number, number][]) => pts.map((q) => q.join(',')).join(' ');
  return (
    <g opacity={op} transform={`translate(0 ${-dissolve * 40})`}>
      {defs}
      {quad([[x1, floor], [x2, floor], [x2, floor - h], [x1, floor - h]], 'f', f)}
      {f >= 1 && (
        <polygon
          points={poly([[x1, floor - h], [x2, floor - h], [x2 + DX, floor + DY - h], [x1 + DX, floor + DY - h]])}
          fill={`url(#${id}-fill)`}
          stroke={stroke}
          strokeWidth={sw}
          strokeOpacity={0.8}
        />
      )}
      {f > 0 && (
        <g>
          <clipPath id={`${id}-fc`}>
            <rect x={x1} y={floor - h * f} width={w} height={h * f} />
          </clipPath>
          <g clipPath={`url(#${id}-fc)`}>
            <rect x={x1 + shine} y={floor - h - 40} width={30} height={h + 80} fill="#ffffff" opacity={0.06} transform={`skewX(-16)`} />
            <line x1={x1 + w * 0.12} y1={floor - h * 0.25} x2={x1 + w * 0.42} y2={floor - h * 0.6} stroke="#dbe8ff" strokeOpacity={0.25} strokeWidth={4} />
            <line x1={x1 + w * 0.2} y1={floor - h * 0.2} x2={x1 + w * 0.4} y2={floor - h * 0.45} stroke="#dbe8ff" strokeOpacity={0.15} strokeWidth={2} />
          </g>
        </g>
      )}
      {frost > 0 && (
        <rect
          x={x1 + 6}
          y={floor - h + 6}
          width={w - 12}
          height={h - 12}
          fill="none"
          stroke="#e6f0ff"
          strokeWidth={34}
          opacity={frost * 0.22}
          style={{filter: 'blur(10px)'}}
        />
      )}
      {crack > 0 && (
        <g fill="none" stroke="#f4f8ff" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${C.amberLight})`}}>
          {[crackPts, crackPts2, crackPts3].map((pts, i) => (
            <polyline key={i} points={poly(pts)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(crack * 1.3 - i * 0.15)} />
          ))}
        </g>
      )}
    </g>
  );
};

/** Warm particles rising when the glass dissolves. */
export const Particles: React.FC<{x: number; y: number; w: number; h: number; p: number; seed?: number}> = ({x, y, w, h, p, seed = 1}) => {
  if (p <= 0 || p >= 1) return null;
  const items = Array.from({length: 40}, (_, i) => {
    const r1 = Math.abs(Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
    const r2 = Math.abs(Math.sin(i * 78.233 + seed) * 12345.678) % 1;
    const px = x - w / 2 + r1 * w;
    const py = y - r2 * h - p * (120 + r1 * 200);
    const o = Math.sin(Math.PI * p) * (0.4 + r2 * 0.6);
    return <rect key={i} x={px} y={py} width={6 + r2 * 8} height={6 + r2 * 8} fill={i % 3 ? C.amberLight : C.coldLight} opacity={o} transform={`rotate(${r1 * 90 + p * 120} ${px} ${py})`} />;
  });
  return <g>{items}</g>;
};

/* ------------------------------------------------------------------ BEDROOM */

export type Sky = {top: string; bottom: string; stars: number; sunY?: number; sunO?: number};

export const BedroomSet: React.FC<{
  t: number;
  sky: Sky;
  mid?: React.ReactNode; // drawn between pillow and blanket (sitting hero)
  front?: React.ReactNode; // drawn after the bed (standing hero, front glass)
  nightstand?: React.ReactNode;
  warm?: number; // warm sunrise spill 0..1
  dark?: number; // extra darkness 0..1
}> = ({t, sky, mid, front, nightstand, warm = 0, dark = 0}) => (
  <g>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky.top} />
        <stop offset="1" stopColor={sky.bottom} />
      </linearGradient>
      <clipPath id="bwin">
        <rect x={232} y={252} width={296} height={306} />
      </clipPath>
    </defs>
    <g clipPath="url(#bwin)">
      <rect x={232} y={252} width={296} height={306} fill="url(#bsky)" />
      {[
        [270, 290],
        [350, 330],
        [480, 280],
        [420, 380],
        [300, 420],
      ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={1.8} fill="#cfd8ea" opacity={sky.stars * (0.5 + 0.5 * Math.sin(t * 2 + i))} />
      ))}
      {sky.sunY !== undefined && <circle cx={380} cy={sky.sunY} r={58} fill={C.amberLight} opacity={sky.sunO ?? 1} />}
    </g>
    <rect x={230} y={250} width={300} height={310} fill="none" stroke={C.line} strokeWidth={3} />
    <line x1={380} y1={250} x2={380} y2={560} stroke={C.line} strokeWidth={3} />
    <line x1={230} y1={405} x2={530} y2={405} stroke={C.line} strokeWidth={3} />
    <line x1={215} y1={566} x2={545} y2={566} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
    {warm > 0 && (
      <>
        <Light id="bwarm" x={380} y={420} r={760} color={C.amber} o={warm} />
        <polygon points={`300,${FLOOR} 470,${FLOOR} 620,${FLOOR + 90} 380,${FLOOR + 90}`} fill={C.amber} opacity={warm * 0.18} />
      </>
    )}
    <rect x={690} y={520} width={34} height={FLOOR - 520} rx={8} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <rect x={730} y={600} width={190} height={96} rx={40} fill="#191c22" stroke={C.line} strokeWidth={3} />
    {mid}
    <path
      d="M 735 712 C 800 690 880 700 960 706 C 1100 716 1300 700 1420 690 C 1470 670 1520 672 1548 700 L 1556 768 L 726 768 Z"
      fill="#1a1e25"
      stroke={C.line}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M 1000 724 q 120 16 260 2" stroke={C.lineSoft} strokeWidth={3} fill="none" strokeLinecap="round" />
    <rect x={700} y={768} width={880} height={26} rx={6} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <line x1={720} y1={794} x2={720} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    <line x1={1560} y1={794} x2={1560} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    <rect x={1550} y={640} width={30} height={FLOOR - 640} rx={8} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <rect x={540} y={730} width={130} height={FLOOR - 730} rx={6} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <line x1={555} y1={790} x2={655} y2={790} stroke={C.lineSoft} strokeWidth={3} />
    {nightstand ?? <AlarmClock t={t} x={605} y={694} />}
    <line x1={120} y1={FLOOR} x2={1800} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
    {front}
    {dark > 0 && <rect width={W} height={H} fill="#05070b" opacity={dark} />}
  </g>
);

export const AlarmClock: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={-20} cy={-28} r={9} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <circle cx={20} cy={-28} r={9} fill={C.bg} stroke={C.line} strokeWidth={3} />
    <circle cx={0} cy={0} r={30} fill="#16191e" stroke={C.line} strokeWidth={3} />
    <line x1={0} y1={0} x2={0} y2={-18} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
    <line x1={0} y1={0} x2={13} y2={4} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
    <line
      x1={0}
      y1={0}
      x2={22 * Math.sin((Math.floor(t) * Math.PI) / 30)}
      y2={-22 * Math.cos((Math.floor(t) * Math.PI) / 30)}
      stroke={C.amberLight}
      strokeWidth={1.5}
      opacity={0.8}
    />
    <line x1={-18} y1={28} x2={-24} y2={36} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
    <line x1={18} y1={28} x2={24} y2={36} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const NoodleBowl: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -38 -18 Q -34 18 0 20 Q 34 18 38 -18 Z" fill="#16191e" stroke={C.line} strokeWidth={3} strokeLinejoin="round" />
    <path d="M -30 -18 q 10 -8 20 0 q 10 8 20 0 q 10 -8 18 0" stroke="#b8a27a" strokeWidth={3} fill="none" opacity={0.7} />
    <line x1={8} y1={-16} x2={42} y2={-58} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
    <line x1={16} y1={-14} x2={52} y2={-52} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/* ------------------------------------------------------------------ DINING ROOM */

export const DiningSet: React.FC<{t: number; warm: number; children?: React.ReactNode; onTable?: React.ReactNode; steam?: number}> = ({
  t,
  warm,
  children,
  onTable,
  steam = 1,
}) => (
  <g>
    {/* wall details: picture frame + window */}
    <rect x={1460} y={260} width={220} height={160} fill="none" stroke={C.line} strokeWidth={3} />
    <path d="M 1480 400 l 50 -60 l 40 40 l 30 -25 l 60 45" stroke={C.amber} strokeWidth={3} fill="none" opacity={0.6} />
    <circle cx={1640} cy={300} r={12} fill="none" stroke={C.amber} strokeWidth={3} opacity={0.6} />
    <rect x={220} y={250} width={240} height={280} fill="#141821" stroke={C.line} strokeWidth={3} />
    <line x1={340} y1={250} x2={340} y2={530} stroke={C.line} strokeWidth={3} />
    {/* chair backs */}
    {[720, 1200].map((cx) => (
      <g key={cx}>
        <rect x={cx - 95} y={500} width={190} height={210} rx={14} fill="none" stroke={C.lineSoft} strokeWidth={3} />
        <line x1={cx - 95} y1={560} x2={cx + 95} y2={560} stroke={C.lineSoft} strokeWidth={3} />
      </g>
    ))}
    {/* hanging lamp */}
    <line x1={960} y1={0} x2={960} y2={250} stroke={C.line} strokeWidth={3} />
    <path d="M 905 300 L 930 250 L 990 250 L 1015 300 Z" fill="#1d1a15" stroke={C.amber} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={960} cy={302} rx={20} ry={8} fill={C.amberLight} opacity={0.9 * warm} />
    <defs>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.amberLight} stopOpacity={0.35} />
        <stop offset="1" stopColor={C.amber} stopOpacity={0.02} />
      </linearGradient>
    </defs>
    <polygon points="910,300 1010,300 1420,720 500,720" fill="url(#cone)" opacity={warm} style={{mixBlendMode: 'screen'}} />
    <Light id="dwarm" x={960} y={420} r={720} color={C.amber} o={warm * 0.9} />
    {children}
    {/* table */}
    <rect x={500} y={700} width={920} height={24} rx={6} fill="#17191d" stroke={C.line} strokeWidth={3} />
    <path d="M 520 724 L 520 820 L 1400 820 L 1400 724" fill="#121418" stroke={C.line} strokeWidth={3} />
    <path d="M 520 820 q 40 20 80 0 q 40 20 80 0 q 40 20 80 0" stroke={C.lineSoft} strokeWidth={3} fill="none" />
    <line x1={560} y1={820} x2={560} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    <line x1={1360} y1={820} x2={1360} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    {/* plates + pot */}
    <ellipse cx={760} cy={698} rx={70} ry={12} fill="#1b1d22" stroke={C.line} strokeWidth={3} />
    <ellipse cx={1160} cy={698} rx={70} ry={12} fill="#1b1d22" stroke={C.line} strokeWidth={3} />
    <path d="M 900 700 L 905 650 Q 960 636 1015 650 L 1020 700 Z" fill="#1f1c18" stroke={C.amber} strokeWidth={3} strokeLinejoin="round" />
    <line x1={930} y1={640} x2={990} y2={640} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M ${940 + i * 20} ${630 - ((t * 30 + i * 20) % 60)} q 10 -15 0 -30 q -10 -15 0 -30`}
        stroke={C.amberLight}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={steam * 0.5 * (1 - ((t * 30 + i * 20) % 60) / 60)}
      />
    ))}
    {onTable}
    <line x1={120} y1={FLOOR} x2={1800} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/* ------------------------------------------------------------------ METRO */

export const MetroSet: React.FC<{
  t: number;
  doorOpen: number; // 1 open .. 0 closed
  outside: 'platform' | 'tunnel';
  scroll: number; // px the outside has moved
  dir?: 1 | -1;
  children?: React.ReactNode;
}> = ({t, doorOpen, outside, scroll, dir = 1, children}) => {
  const winY1 = 290;
  const winY2 = 520;
  const outsideLayer = (
    <g>
      <rect x={0} y={winY1} width={W} height={winY2 - winY1} fill="#0b0f17" />
      {outside === 'platform' ? (
        <g transform={`translate(${-scroll * dir} 0)`}>
          <rect x={-2000} y={470} width={6000} height={60} fill="#151a22" />
          {Array.from({length: 14}, (_, i) => i * 360 - 600).map((px) => (
            <rect key={px} x={px} y={winY1} width={34} height={200} fill="#1a1f29" stroke={C.lineSoft} strokeWidth={2} />
          ))}
          {/* station sign */}
          <rect x={340} y={330} width={200} height={56} rx={8} fill="#1e2530" stroke={C.amber} strokeWidth={3} />
          <text x={440} y={368} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={26} fill={C.amberLight} letterSpacing={3}>
            ELM ST
          </text>
          {Array.from({length: 10}, (_, i) => i * 400 - 800).map((px) => (
            <circle key={px} cx={px + 180} cy={310} r={10} fill={C.amberLight} opacity={0.5} />
          ))}
        </g>
      ) : (
        <g>
          {Array.from({length: 16}, (_, i) => i).map((i) => {
            const px = ((((i * 173 - scroll * dir * 1.0) % 2400) + 2400) % 2400) - 240;
            return <rect key={i} x={px} y={330 + ((i * 37) % 150)} width={160 + (i % 3) * 60} height={4} rx={2} fill={i % 4 === 0 ? C.amberLight : '#5d6b85'} opacity={0.5} />;
          })}
        </g>
      )}
    </g>
  );
  const doorW = 120;
  const slide = doorOpen * 110;
  return (
    <g>
      <defs>
        <clipPath id="mwin">
          <rect x={100} y={winY1} width={680} height={winY2 - winY1} rx={24} />
          <rect x={1140} y={winY1} width={680} height={winY2 - winY1} rx={24} />
          <rect x={840} y={winY1 - 20} width={240} height={FLOOR - winY1 + 20} />
        </clipPath>
      </defs>
      <g clipPath="url(#mwin)">{outsideLayer}</g>
      {/* window frames */}
      <rect x={100} y={winY1} width={680} height={winY2 - winY1} rx={24} fill="none" stroke={C.line} strokeWidth={3} />
      <rect x={1140} y={winY1} width={680} height={winY2 - winY1} rx={24} fill="none" stroke={C.line} strokeWidth={3} />
      {/* ceiling rail + straps */}
      <line x1={60} y1={200} x2={1860} y2={200} stroke={C.line} strokeWidth={4} />
      {[200, 380, 560, 1300, 1480, 1660].map((sx) => (
        <g key={sx} transform={`rotate(${Math.sin(t * 2 + sx) * 3} ${sx} 200)`}>
          <line x1={sx} y1={200} x2={sx} y2={250} stroke={C.line} strokeWidth={3} />
          <circle cx={sx} cy={262} r={12} fill="none" stroke={C.amber} strokeWidth={3} opacity={0.7} />
        </g>
      ))}
      {/* doors */}
      <rect x={840} y={winY1 - 20} width={240} height={FLOOR - winY1 + 20} fill="none" stroke={C.line} strokeWidth={3} />
      {[0, 1].map((k) => {
        const dxp = k === 0 ? 840 - slide : 960 + slide;
        return (
          <g key={k}>
            <rect x={dxp} y={winY1 - 20} width={doorW} height={FLOOR - winY1 + 20} fill="#13161b" stroke={C.line} strokeWidth={3} />
            <rect x={dxp + 22} y={winY1 + 10} width={doorW - 44} height={190} rx={10} fill="#0b0f17" stroke={C.lineSoft} strokeWidth={2} />
          </g>
        );
      })}
      {/* poles */}
      {[700, 1240].map((px) => (
        <line key={px} x1={px} y1={200} x2={px} y2={FLOOR} stroke={C.line} strokeWidth={6} />
      ))}
      {/* bench */}
      <rect x={130} y={690} width={520} height={34} rx={10} fill="#16191e" stroke={C.line} strokeWidth={3} />
      <rect x={130} y={560} width={520} height={130} rx={14} fill="none" stroke={C.lineSoft} strokeWidth={3} />
      <line x1={160} y1={724} x2={160} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      <line x1={620} y1={724} x2={620} y2={FLOOR} stroke={C.line} strokeWidth={4} />
      {children}
      <line x1={60} y1={FLOOR} x2={1860} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ OUTDOORS */

export const Tree: React.FC<{x: number; s?: number; warm?: number}> = ({x, s = 1, warm = 0}) => (
  <g transform={`translate(${x} ${FLOOR}) scale(${s})`}>
    <path d="M -14 0 L -10 -180 L 10 -180 L 14 0" fill="#15171b" stroke={C.line} strokeWidth={3} />
    <circle cx={0} cy={-260} r={110} fill="#14181a" stroke={C.line} strokeWidth={3} />
    <circle cx={-70} cy={-210} r={70} fill="#14181a" stroke={C.line} strokeWidth={3} />
    <circle cx={75} cy={-205} r={68} fill="#14181a" stroke={C.line} strokeWidth={3} />
    {warm > 0 && <circle cx={20} cy={-300} r={60} fill={C.amber} opacity={0.08 * warm} />}
  </g>
);

export const Balloon: React.FC<{x: number; y: number; color: string; t: number; k: number; anchor: [number, number]}> = ({x, y, color, t, k, anchor}) => {
  const bx = x + Math.sin(t * 1.3 + k) * 8;
  const by = y + Math.sin(t * 1.1 + k * 2) * 6;
  return (
    <g>
      <path d={`M ${bx} ${by + 40} Q ${(bx + anchor[0]) / 2 + 10} ${(by + anchor[1]) / 2} ${anchor[0]} ${anchor[1]}`} stroke={C.line} strokeWidth={2} fill="none" />
      <ellipse cx={bx} cy={by} rx={30} ry={38} fill={color} stroke={C.outline} strokeWidth={3} />
      <path d={`M ${bx - 5} ${by + 38} l 5 8 l 5 -8 z`} fill={color} stroke={C.outline} strokeWidth={2} />
      <ellipse cx={bx - 10} cy={by - 14} rx={6} ry={10} fill="#fff" opacity={0.25} />
    </g>
  );
};

export const Dog: React.FC<{x: number; y?: number; t: number; run?: number; facing?: 1 | -1; s?: number}> = ({x, y = FLOOR, t, run = 0, facing = 1, s = 1}) => {
  const leg = (ph: number) => Math.sin(t * 14 + ph) * 14 * run;
  const bounce = run ? -Math.abs(Math.sin(t * 14)) * 8 : 0;
  const col = '#b89a74';
  return (
    <g transform={`translate(${x} ${y + bounce}) scale(${facing * s} ${s})`}>
      {[-34, -18, 22, 38].map((lx, i) => (
        <line key={i} x1={lx} y1={-38} x2={lx + leg(i * 1.6)} y2={-4} stroke={C.outline} strokeWidth={11} strokeLinecap="round" />
      ))}
      {[-34, -18, 22, 38].map((lx, i) => (
        <line key={`c${i}`} x1={lx} y1={-38} x2={lx + leg(i * 1.6)} y2={-4} stroke={col} strokeWidth={6} strokeLinecap="round" />
      ))}
      <path d={`M -50 -58 q -24 ${-20 + Math.sin(t * 16) * 10} -30 -34`} stroke={C.outline} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={`M -50 -58 q -24 ${-20 + Math.sin(t * 16) * 10} -30 -34`} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-52} rx={56} ry={26} fill={col} stroke={C.outline} strokeWidth={3.5} />
      <circle cx={58} cy={-80} r={26} fill={col} stroke={C.outline} strokeWidth={3.5} />
      <ellipse cx={80} cy={-74} rx={12} ry={9} fill={col} stroke={C.outline} strokeWidth={3} />
      <circle cx={90} cy={-77} r={4} fill={C.outline} />
      <path d="M 44 -100 q -12 10 -6 34" fill={col} stroke={C.outline} strokeWidth={3} />
      <circle cx={64} cy={-86} r={4} fill={C.outline} />
      <path d="M 34 -64 q 14 8 30 0" stroke={C.amber} strokeWidth={5} fill="none" />
    </g>
  );
};

/** A supporting character (same body shape, grey or tan, one accessory). */
export const Person: React.FC<React.ComponentProps<typeof Hero>> = (p) => <Hero band={false} {...p} />;

export const GREY = '#a6a9b0';
export const TAN = '#c9ad86';
export const SCARF = '#e07b39';
