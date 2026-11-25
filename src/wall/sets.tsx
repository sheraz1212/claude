import React from 'react';
import {Light, Person, GREY, TAN} from '../common/sets';
import {C} from '../common/theme';

export const PINK = '#ff4fa0';
export const PINK_L = '#ff9ccb';
const OL = C.outline;
export const LEO = {color: GREY, accessory: 'glasses' as const};
export const AVA = {color: TAN, accessory: 'bow' as const, accessoryColor: '#e07b9a'};
export const SAM = {color: GREY, accessory: 'headphones' as const, accessoryColor: '#6d8fb3'};

/* ---------------- photo frames ---------------- */
type Spot = {x: number; y: number; w: number; r: number; icon: number};
const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};
/** 37 deterministic spots: first on the wall, later ones creep over the window. */
export const SPOTS: Spot[] = Array.from({length: 40}, (_, i) => {
  if (i < 3) return [{x: 470, y: 330, w: 150, r: -4, icon: 0}, {x: 700, y: 300, w: 150, r: 3, icon: 1}, {x: 900, y: 360, w: 150, r: -2, icon: 2}][i];
  if (i < 24) {
    const col = (i - 3) % 7;
    const row = Math.floor((i - 3) / 7);
    return {x: 260 + col * 140 + (rnd(i) - 0.5) * 50, y: 190 + row * 150 + (rnd(i + 9) - 0.5) * 40, w: 120 + rnd(i + 3) * 50, r: (rnd(i + 5) - 0.5) * 16, icon: i % 8};
  }
  const k = i - 24;
  return {x: 1270 + (k % 4) * 115 + (rnd(i) - 0.5) * 40, y: 250 + Math.floor(k / 4) * 120 + (rnd(i + 2) - 0.5) * 30, w: 140 + rnd(i + 1) * 40, r: (rnd(i + 4) - 0.5) * 18, icon: i % 8};
});

const Icon: React.FC<{k: number; s: number}> = ({k, s}) => {
  const u = s / 100;
  const g = {stroke: OL, strokeWidth: 3 / u, fill: 'none'} as const;
  return (
    <g transform={`scale(${u})`}>
      {k === 0 && (<g><rect x={-34} y={-6} width={68} height={22} rx={8} fill="#e05a5a" {...{stroke: OL, strokeWidth: 3}} /><path d="M -20 -6 l 10 -14 h 22 l 10 14" {...g} /><circle cx={-18} cy={18} r={7} fill={OL} /><circle cx={18} cy={18} r={7} fill={OL} /></g>)}
      {k === 1 && (<g><circle cx={-10} cy={4} r={14} {...g} strokeWidth={5} stroke="#e9b949" /><circle cx={10} cy={4} r={14} {...g} strokeWidth={5} stroke="#e9b949" /></g>)}
      {k === 2 && (<g><path d="M -34 -4 L 0 -20 L 34 -4 L 0 12 Z" fill="#2b2f3a" /><path d="M 26 0 v 18" stroke="#e9b949" strokeWidth={3} /></g>)}
      {k === 3 && (<g><path d="M -18 -22 h 36 v 10 q 0 22 -18 26 q -18 -4 -18 -26 Z" fill="#e9b949" stroke={OL} strokeWidth={3} /><rect x={-12} y={14} width={24} height={8} fill="#e9b949" stroke={OL} strokeWidth={3} /></g>)}
      {k === 4 && (<g><rect x={-40} y={4} width={80} height={20} fill="#e7cf98" /><rect x={-40} y={-24} width={80} height={28} fill="#7fc3e8" /><circle cx={18} cy={-12} r={9} fill="#ffd25a" /></g>)}
      {k === 5 && (<g><path d="M -26 0 L 0 -22 L 26 0 V 22 H -26 Z" fill="#c97a54" stroke={OL} strokeWidth={3} /><rect x={-6} y={6} width={12} height={16} fill="#5a3a28" /></g>)}
      {k === 6 && (<g><path d="M -34 6 L 28 -10 L 34 -4 L -26 14 Z" fill="#e9e6f0" stroke={OL} strokeWidth={3} /><path d="M 0 -2 l -10 -16 l 8 0 l 12 12" fill="#e9e6f0" stroke={OL} strokeWidth={3} /></g>)}
      {k === 7 && (<g><rect x={-30} y={-16} width={60} height={32} rx={4} fill="#7cc38a" stroke={OL} strokeWidth={3} /><circle r={9} fill="none" stroke={OL} strokeWidth={3} /></g>)}
      {/* little smiling person in every photo */}
      <circle cx={-26} cy={-26} r={10} fill="#d8c3a0" stroke={OL} strokeWidth={2.5} />
      <path d="M -31 -24 q 5 4 10 0" stroke={OL} strokeWidth={2} fill="none" />
    </g>
  );
};

export const Photo: React.FC<{x: number; y: number; w: number; r?: number; icon: number; glow?: number}> = ({x, y, w, r = 0, icon, glow = 0}) => {
  const h = w * 0.8;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      {glow > 0 && <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={10} fill={PINK} opacity={0.25 * glow} />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={PINK} stroke={OL} strokeWidth={3} />
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} fill="#fbeaf3" />
      <Icon k={icon} s={w} />
      <circle cx={0} cy={-h / 2 + 2} r={6} fill="#c8304f" stroke={OL} strokeWidth={2} />
    </g>
  );
};

/* ---------------- the plant (token) ---------------- */
export const Plant: React.FC<{x: number; y: number; grow?: number; wilt?: number; t: number; scale?: number}> = ({x, y, grow = 0, wilt = 0, t, scale = 1}) => {
  const green = wilt > 0.5 ? '#8a8a6a' : '#5e9e5a';
  const h = 30 + grow * 150;
  const leaves = Math.round(1 + grow * 7);
  const sway = Math.sin(t * 1.3) * 3;
  const droop = wilt * 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={`M 0 0 Q ${sway + droop * 0.3} ${-h * 0.5} ${sway + droop} ${-h + droop * 0.6}`} stroke={green} strokeWidth={6 + grow * 4} fill="none" strokeLinecap="round" />
      {Array.from({length: leaves}, (_, i) => {
        const u = (i + 1) / (leaves + 1);
        const lx = sway * u + droop * u * u;
        const ly = -h * u + droop * 0.6 * u * u;
        const side = i % 2 ? 1 : -1;
        const keepGreen = wilt > 0.5 && i === leaves - 1;
        return (
          <path key={i} d={`M ${lx} ${ly} q ${side * 30} ${-20 + wilt * 40} ${side * 50} ${-4 + wilt * 50} q ${-side * 26} ${10} ${-side * 50} ${4}`}
            fill={keepGreen ? '#6fc06a' : green} stroke={OL} strokeWidth={2.5} />
        );
      })}
      {grow > 0.8 && wilt < 0.2 &&
        [0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${sway + (i - 1) * 36} ${-h - 10 + Math.abs(i - 1) * 24})`}>
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-11} rx={7} ry={11} fill="#ffd36a" stroke={OL} strokeWidth={2} transform={`rotate(${a})`} />)}
            <circle r={6} fill="#e9883a" />
          </g>
        ))}
      <path d="M -40 0 L 40 0 L 32 56 L -32 56 Z" fill="#c26a44" stroke={OL} strokeWidth={4} />
      <rect x={-46} y={-8} width={92} height={14} rx={4} fill="#d7845a" stroke={OL} strokeWidth={4} />
    </g>
  );
};

/* ---------------- (A) his room ---------------- */
/** day: 1 morning, 0 night. photos: how many are pinned. cover: 0..1 how much of the window is blocked (auto from photos). */
export const Room: React.FC<{t: number; day?: number; photos?: number; grow?: number; wilt?: number; phone?: number; skipPhotos?: number[]; sunset?: boolean; extra?: React.ReactNode; drawing?: boolean}> = ({
  drawing = true,
  t,
  day = 1,
  photos = 0,
  grow = 0.1,
  wilt = 0,
  phone = 0,
  skipPhotos = [],
  sunset = false,
  extra,
}) => {
  const cover = Math.min(1, Math.max(0, (photos - 24) / 12));
  const sun = day * (1 - cover);
  const wall = day > 0.5 ? '#d9b48f' : '#4a3f52';
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      <rect y={0} width={1920} height={60} fill="#00000018" />
      {/* window */}
      <defs>
        <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sunset ? '#f08a5d' : day > 0.5 ? '#8fc7ec' : '#151a33'} />
          <stop offset="1" stopColor={sunset ? '#ffd28a' : day > 0.5 ? '#ffe6b8' : '#2c2a4a'} />
        </linearGradient>
      </defs>
      <rect x={1250} y={180} width={430} height={440} fill="url(#wsky)" />
      {Array.from({length: 7}, (_, i) => (
        <rect key={i} x={1255 + i * 62} y={470 - (i % 3) * 50} width={56} height={160} fill={day > 0.5 ? '#b9a7a0' : '#1f2238'} />
      ))}
      {day > 0.5 && <circle cx={1360} cy={300} r={44} fill={sunset ? '#ffb36a' : '#fff4cc'} />}
      {day <= 0.5 && Array.from({length: 8}, (_, i) => <rect key={i} x={1265 + i * 52} y={500 - (i % 3) * 40} width={10} height={12} fill={C.amberLight} />)}
      <rect x={1250} y={180} width={430} height={440} fill="none" stroke="#7a5236" strokeWidth={18} />
      <line x1={1465} y1={180} x2={1465} y2={620} stroke="#7a5236" strokeWidth={10} />
      <rect x={1225} y={612} width={480} height={22} fill="#8a5d3e" stroke={OL} strokeWidth={4} />
      {/* sun shaft + pool */}
      {sun > 0 && <path d="M 1260 620 L 1670 620 L 1400 1000 L 760 1000 Z" fill="#fff0c4" opacity={0.2 * sun} />}
      {sun > 0 && <Light id="sunL" x={1460} y={560} r={600} color="#ffd98a" o={0.7 * sun} />}
      {/* bed under the wall */}
      <rect x={250} y={690} width={820} height={150} rx={22} fill={day > 0.5 ? '#6f8fb0' : '#3b4660'} stroke={OL} strokeWidth={4} />
      <rect x={250} y={660} width={170} height={66} rx={24} fill="#efe6d2" stroke={OL} strokeWidth={4} />
      <rect x={250} y={830} width={820} height={34} fill="#5a3a28" stroke={OL} strokeWidth={4} />
      {/* nightstand + lamp */}
      <rect x={1090} y={720} width={120} height={140} fill="#7a5236" stroke={OL} strokeWidth={4} />
      <path d="M 1120 720 L 1180 720 L 1170 650 L 1130 650 Z" fill="#e9c27a" stroke={OL} strokeWidth={3.5} />
      {day <= 0.5 && <Light id="lampN" x={1150} y={680} r={360} color={C.amber} o={0.45 * (1 - cover)} />}
      {/* floor */}
      <rect y={860} width={1920} height={220} fill={day > 0.5 ? '#8a5d3e' : '#30262e'} />
      {[900, 960, 1030].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000025" strokeWidth={3} />)}
      <ellipse cx={700} cy={960} rx={420} ry={50} fill="#b0657a" opacity={0.35} />
      {/* his own small drawing */}
      {drawing && <g transform="rotate(-3 300 420)">
        <rect x={240} y={350} width={120} height={150} fill="#f7f1e3" stroke={OL} strokeWidth={3} />
        <path d="M 300 470 q -4 -40 0 -70 M 300 430 q -20 -10 -30 -2 M 300 415 q 18 -12 28 -4" stroke="#5e9e5a" strokeWidth={5} fill="none" />
        <circle cx={300} cy={350} r={5} fill="#5e9e95" />
      </g>}
      {/* photos */}
      {SPOTS.slice(0, Math.floor(photos)).map((s, i) =>
        skipPhotos.includes(i) ? null : <Photo key={i} x={s.x} y={s.y} w={s.w} r={s.r} icon={s.icon} glow={phone} />,
      )}
      {cover > 0 && <rect width={1920} height={1080} fill="#2a0f22" opacity={0.35 * cover} />}
      {phone > 0 && <Light id="feedL" x={700} y={600} r={900} color={PINK} o={0.35 * phone} />}
      {/* the plant on the sill */}
      <Plant x={1560} y={612} t={t} grow={grow} wilt={wilt} scale={1.3} />
      {extra}
    </g>
  );
};

/** A photo flying out of the phone at (fx,fy) to its wall spot. */
export const FlyingPhoto: React.FC<{idx: number; k: number; fx: number; fy: number}> = ({idx, k, fx, fy}) => {
  if (k <= 0 || k >= 1) return null;
  const s = SPOTS[idx];
  const e = 1 - Math.pow(1 - k, 3);
  const x = fx + (s.x - fx) * e;
  const y = fy + (s.y - fy) * e - Math.sin(Math.PI * e) * 140;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.2 + 0.8 * e}) translate(${-x} ${-y})`}>
      <Photo x={x} y={y} w={s.w} r={s.r * e + (1 - e) * 30} icon={s.icon} glow={1} />
    </g>
  );
};

/* ---------------- (B) Leo's dinner ---------------- */
export const Dinner: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#6b4a5a" />
    {/* shelves + window */}
    <rect x={160} y={200} width={420} height={18} fill="#4a3024" />
    <rect x={160} y={360} width={420} height={18} fill="#4a3024" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={180 + i * 78} y={140 + (i % 2) * 10} width={40} height={60 - (i % 2) * 10} fill={['#d98a5a', '#7fb0c8', '#e9c27a', '#9b7fc8', '#7cc38a'][i]} />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={200 + i * 95} y={300} width={60} height={60} rx={8} fill="#c9b08a" />)}
    <rect x={1300} y={170} width={420} height={360} fill="#1d2140" stroke="#3a2622" strokeWidth={16} />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1320 + i * 64} y={380 - (i % 3) * 40} width={52} height={150} fill="#2b3058" />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1330 + i * 64} y={410 - (i % 3) * 40} width={10} height={12} fill={C.amberLight} />)}
    {/* pendant lamp */}
    <line x1={960} y1={0} x2={960} y2={250} stroke="#22252b" strokeWidth={4} />
    <path d="M 890 300 L 1030 300 L 1000 250 L 920 250 Z" fill="#e9c27a" stroke={OL} strokeWidth={4} />
    <Light id="pend" x={960} y={500} r={760} color={C.amber} o={0.8} />
    {/* string lights */}
    {Array.from({length: 12}, (_, i) => (
      <circle key={i} cx={100 + i * 160} cy={70 + Math.sin(i) * 14} r={7} fill={C.amberLight} opacity={0.6 + 0.4 * Math.sin(t * 2 + i)} />
    ))}
    {/* floor */}
    <rect y={820} width={1920} height={260} fill="#3e2a2e" />
  </g>
);
export const DinnerTable: React.FC = () => (
  <g>
    <rect x={260} y={700} width={1400} height={40} rx={10} fill="#8a5d3e" stroke={OL} strokeWidth={5} />
    <rect x={260} y={740} width={1400} height={200} fill="#6b4632" stroke={OL} strokeWidth={5} />
    {[440, 700, 960, 1220, 1480].map((x) => <ellipse key={x} cx={x} cy={706} rx={70} ry={14} fill="#f4ecd8" stroke={OL} strokeWidth={3} />)}
    <rect x={930} y={640} width={20} height={64} rx={6} fill="#b04a5a" stroke={OL} strokeWidth={3} />
    <rect x={1000} y={660} width={30} height={46} rx={6} fill="#e9e4f2" stroke={OL} strokeWidth={3} opacity={0.8} />
  </g>
);

/* ---------------- (C) the park ---------------- */
export const Park: React.FC<{t: number; dawn?: number}> = ({t, dawn = 1}) => (
  <g>
    <defs>
      <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={dawn > 0.5 ? '#f2a46e' : '#2a2f55'} />
        <stop offset="1" stopColor={dawn > 0.5 ? '#ffe2a8' : '#5a4a6a'} />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#psky)" />
    <circle cx={1400} cy={600} r={120} fill="#fff1c9" opacity={dawn} />
    <Light id="sunP" x={1400} y={600} r={900} color="#ffd98a" o={0.7 * dawn} />
    {/* far skyline */}
    {Array.from({length: 13}, (_, i) => <rect key={i} x={i * 150} y={520 - ((i * 53) % 140)} width={130} height={200} fill="#c98a6e" opacity={0.6} />)}
    {/* trees (middle) */}
    {Array.from({length: 9}, (_, i) => (
      <g key={i} transform={`translate(${80 + i * 230} 640)`}>
        <rect x={-10} y={0} width={20} height={80} fill="#6b4632" />
        <circle cx={0} cy={-30} r={70 + (i % 3) * 14} fill={i % 2 ? '#6f9a5a' : '#5e8a4e'} stroke={OL} strokeWidth={3} />
      </g>
    ))}
    {/* grass + path */}
    <rect y={700} width={1920} height={380} fill="#7fae5f" />
    <path d="M 0 860 Q 960 800 1920 860 L 1920 960 Q 960 900 0 960 Z" fill="#e3c99a" stroke="#c9ad7e" strokeWidth={3} />
    {/* bench */}
    <g transform="translate(1180 830)">
      <rect x={-140} y={-70} width={280} height={18} rx={4} fill="#8a5d3e" stroke={OL} strokeWidth={4} />
      <rect x={-150} y={-20} width={300} height={18} rx={4} fill="#8a5d3e" stroke={OL} strokeWidth={4} />
      <rect x={-130} y={-2} width={12} height={40} fill="#4a3024" />
      <rect x={118} y={-2} width={12} height={40} fill="#4a3024" />
    </g>
    {/* lamp */}
    <rect x={400} y={460} width={14} height={420} fill="#2a2c34" />
    <circle cx={407} cy={452} r={20} fill={dawn > 0.5 ? '#efe4cf' : '#fff1c9'} stroke={OL} strokeWidth={3} />
    {Array.from({length: 6}, (_, i) => <circle key={i} cx={(i * 337 + t * 30) % 1920} cy={220 + (i % 3) * 40} r={4} fill="#fff" opacity={0.4} />)}
  </g>
);

/* ---------------- night street with pink billboards ---------------- */
export const PinkStreet: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#151830" />
    {Array.from({length: 12}, (_, i) => (
      <g key={i}>
        <rect x={i * 170 - 20} y={300 - ((i * 61) % 160)} width={150} height={600} fill="#1f2340" />
        {Array.from({length: 6}, (_, k) => <rect key={k} x={i * 170 + (k % 2) * 60} y={330 - ((i * 61) % 160) + Math.floor(k / 2) * 70} width={18} height={22} fill={C.amberLight} opacity={(i + k) % 3 ? 0.15 : 0.8} />)}
      </g>
    ))}
    {[{x: 360, p: LEO}, {x: 1000, p: AVA}, {x: 1620, p: SAM}].map((b, i) => (
      <g key={i}>
        <rect x={b.x - 18} y={420} width={36} height={440} fill="#2a2c34" />
        <rect x={b.x - 200} y={170} width={400} height={260} rx={10} fill={PINK} stroke={OL} strokeWidth={5} />
        <rect x={b.x - 184} y={186} width={368} height={228} fill="#fbeaf3" />
        <Person id={`bb${i}`} x={b.x} y={640} scale={0.62} {...b.p} pose="arms-down" expr={{brow: -0.1, lid: 0, mouth: 0.9}} />
        <rect x={b.x - 184} y={360} width={368} height={54} fill="#fbeaf3" />
        <text x={b.x} y={400} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill={PINK}>{['PROMOTED!', 'ENGAGED!', 'NEW HOUSE!'][i]}</text>
        <Light id={`bbl${i}`} x={b.x} y={300} r={420} color={PINK} o={0.5} />
      </g>
    ))}
    <rect y={860} width={1920} height={220} fill="#2a2a3a" />
    <rect y={860} width={1920} height={14} fill="#46465a" />
    {Array.from({length: 30}, (_, i) => <circle key={i} cx={(i * 73) % 1920} cy={880 + (i % 4) * 40} r={2} fill={PINK} opacity={0.3 + 0.2 * Math.sin(t * 3 + i)} />)}
  </g>
);
