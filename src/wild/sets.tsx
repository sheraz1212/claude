import React from 'react';
import {C, H, W} from '../common/theme';
import {FLOOR, Light, Tree} from '../common/sets';

const rnd = (i: number, s = 1) => Math.abs(Math.sin(i * 12.9898 + s * 78.233) * 43758.5453) % 1;

/* ---------- atmosphere helpers ---------- */
export const Dust: React.FC<{t: number; x?: number; y?: number; w?: number; h?: number; n?: number; color?: string; o?: number}> = ({t, x = 0, y = 0, w = W, h = H, n = 40, color = C.amberLight, o = 0.5}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const px = x + ((rnd(i) * w + t * (8 + rnd(i, 2) * 14)) % w);
      const py = y + ((rnd(i, 3) * h - t * (5 + rnd(i, 4) * 10) + h * 4) % h);
      return <circle key={i} cx={px} cy={py} r={1.5 + rnd(i, 5) * 2.5} fill={color} opacity={o * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + i)))} />;
    })}
  </g>
);

export const Shaft: React.FC<{x1: number; x2: number; y?: number; spread?: number; color?: string; o?: number}> = ({x1, x2, y = 0, spread = 500, color = C.amberLight, o = 0.15}) => (
  <g>
    <defs>
      <linearGradient id={`sh${x1}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <polygon points={`${x1},${y} ${x2},${y} ${x2 + spread},${FLOOR + 40} ${x1 + spread * 0.6},${FLOOR + 40}`} fill={`url(#sh${x1})`} style={{mixBlendMode: 'screen'}} />
  </g>
);

export const Snow: React.FC<{t: number; o?: number; n?: number}> = ({t, o = 1, n = 120}) => (
  <g opacity={o}>
    {Array.from({length: n}, (_, i) => {
      const px = (rnd(i) * (W + 200) + Math.sin(t * 0.8 + i) * 30) % (W + 200) - 100;
      const py = (rnd(i, 2) * H + t * (40 + rnd(i, 3) * 60)) % (H + 40) - 20;
      return <circle key={i} cx={px} cy={py} r={2 + rnd(i, 4) * 3} fill="#eaf2ff" opacity={0.5 + rnd(i, 5) * 0.5} />;
    })}
  </g>
);

/* ---------- his apartment, rich and lived-in ---------- */
export const HomeRoom: React.FC<{
  t: number;
  curtains?: number; // 0 open .. 1 closed
  day?: number; // 0 night .. 1 day
  winter?: number; // 0..1 frost + snow imagery
  den?: boolean;
  denGlow?: number;
  headOut?: React.ReactNode; // drawn inside the den opening
  children?: React.ReactNode;
  front?: React.ReactNode;
}> = ({t, curtains = 0, day = 0.6, winter = 0, den = true, denGlow = 0.8, headOut, children, front}) => {
  const sky = day > 0.5 ? '#9cb6d8' : '#14203a';
  return (
    <g>
      {/* wallpaper */}
      <rect width={W} height={FLOOR} fill="#1b1a20" />
      {Array.from({length: 26}, (_, i) =>
        Array.from({length: 9}, (_, j) => (
          <path key={`${i}-${j}`} d={`M ${i * 76 + (j % 2) * 38} ${j * 96 + 40} q 8 -14 16 0 q -8 14 -16 0`} fill="#24232a" />
        )),
      )}
      {/* window with curtains */}
      <rect x={1180} y={150} width={480} height={420} fill={sky} stroke="#3a3540" strokeWidth={10} />
      <rect x={1180} y={420} width={480} height={150} fill={day > 0.5 ? '#7fa36a' : '#101a14'} />
      {[1260, 1420, 1560].map((x, i) => (
        <circle key={x} cx={x} cy={420 - i * 8} r={50 + i * 10} fill={day > 0.5 ? '#5d8a4f' : '#0e1712'} />
      ))}
      <line x1={1420} y1={150} x2={1420} y2={570} stroke="#3a3540" strokeWidth={8} />
      <rect x={1140} y={130} width={560} height={20} rx={8} fill="#2a2630" />
      {[0, 1].map((k) => {
        const open = (1 - curtains) * 190;
        const x = k === 0 ? 1150 + 0 : 1690;
        const wdt = 50 + (190 - open);
        return <path key={k} d={k === 0 ? `M ${x} 150 L ${x + wdt} 150 Q ${x + wdt - 20} 400 ${x + wdt} 600 L ${x} 600 Z` : `M ${x} 150 L ${x - wdt} 150 Q ${x - wdt + 20} 400 ${x - wdt} 600 L ${x} 600 Z`} fill="#6a3a3a" stroke={C.outline} strokeWidth={3} />;
      })}
      {day > 0.3 && curtains < 0.9 && <Shaft x1={1220} x2={1640} y={150} spread={-700} o={0.16 * (1 - curtains) * day} />}
      {/* bookshelf + plant + frames */}
      <rect x={140} y={250} width={300} height={560} fill="#1f1a17" stroke={C.line} strokeWidth={4} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <line x1={140} y1={380 + r * 120} x2={440} y2={380 + r * 120} stroke={C.line} strokeWidth={4} />
          {Array.from({length: 7}, (_, k) => (
            <rect key={k} x={152 + k * 40} y={290 + r * 120 + (k % 3) * 8} width={30} height={88 - (k % 3) * 8} fill={['#6a3a3a', '#3a4a6a', '#4a6a3a', '#6a5a3a', '#4a3a5a'][(k + r) % 5]} stroke={C.outline} strokeWidth={2} />
          ))}
        </g>
      ))}
      <path d="M 290 250 q -40 -60 -10 -120 M 290 250 q 30 -80 70 -100 M 290 250 q -70 -30 -100 -20" stroke="#5d8a4f" strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={265} y={230} width={50} height={30} rx={6} fill="#8a5a3a" stroke={C.outline} strokeWidth={3} />
      {[[560, 260, 120, 90], [700, 230, 90, 120]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#2a2630" stroke={C.amber} strokeWidth={4} />
          <circle cx={x + w / 2} cy={y + h / 2 - 8} r={14} fill={C.cream} opacity={0.6} />
        </g>
      ))}
      {/* radiator */}
      <rect x={1240} y={640} width={360} height={130} rx={10} fill="#22252b" stroke={C.line} strokeWidth={3} />
      {Array.from({length: 8}, (_, i) => (
        <line key={i} x1={1270 + i * 42} y1={650} x2={1270 + i * 42} y2={760} stroke={C.line} strokeWidth={4} />
      ))}
      {/* floor: planks in perspective + rug */}
      <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#1d1712" />
      {Array.from({length: 14}, (_, i) => (
        <line key={i} x1={i * 150} y1={FLOOR} x2={i * 150 - 200} y2={H} stroke="#2a2018" strokeWidth={3} />
      ))}
      <ellipse cx={860} cy={FLOOR + 50} rx={520} ry={60} fill="#5a2f35" opacity={0.6} />
      <ellipse cx={860} cy={FLOOR + 50} rx={470} ry={46} fill="none" stroke={C.amber} strokeWidth={3} opacity={0.4} />
      <Light id="hrwarm" x={600} y={400} r={1100} color={C.amber} o={0.35 * day * (1 - winter)} />
      {children}
      {/* the DEN: a blanket fort over two chairs */}
      {den && (
        <g>
          <Light id="dencold" x={860} y={720} r={420} color={C.cold} o={denGlow} />
          <path d="M 560 860 L 600 600 Q 860 470 1120 600 L 1160 860 Z" fill="#3b4a6a" stroke={C.outline} strokeWidth={5} />
          <path d="M 600 600 Q 860 470 1120 600" stroke="#56688c" strokeWidth={10} fill="none" />
          {Array.from({length: 9}, (_, i) => (
            <line key={i} x1={600 + i * 66} y1={620 - Math.sin((i / 8) * Math.PI) * 120} x2={590 + i * 70} y2={860} stroke="#33405c" strokeWidth={4} />
          ))}
          {Array.from({length: 18}, (_, i) => (
            <line key={`f${i}`} x1={565 + i * 34} y1={858} x2={565 + i * 34} y2={878} stroke="#56688c" strokeWidth={4} />
          ))}
          {/* entrance */}
          <path d="M 760 860 Q 760 700 860 690 Q 960 700 960 860 Z" fill="#0a0d16" stroke={C.outline} strokeWidth={4} />
          <Light id="denin" x={860} y={800} r={160} color={C.coldLight} o={denGlow} />
          {headOut}
        </g>
      )}
      {front}
      {/* foreground: hanging plant silhouette */}
      <g opacity={0.9}>
        <line x1={120} y1={0} x2={120} y2={120} stroke="#0c0d10" strokeWidth={4} />
        <path d="M 70 130 Q 120 100 170 130 L 160 170 L 80 170 Z" fill="#0c0d10" />
        {Array.from({length: 6}, (_, i) => (
          <path key={i} d={`M ${90 + i * 12} 165 q ${-20 + i * 8} 60 ${-10 + i * 6} ${120 + (i % 3) * 30}`} stroke="#0c0d10" strokeWidth={10} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {winter > 0 && (
        <g>
          <rect width={W} height={H} fill="#5b7fb8" opacity={winter * 0.25} style={{mixBlendMode: 'multiply'}} />
          <Snow t={t} o={winter} />
          <rect x={20} y={20} width={W - 40} height={H - 40} fill="none" stroke="#eaf2ff" strokeWidth={60} opacity={winter * 0.25} style={{filter: 'blur(20px)'}} />
        </g>
      )}
    </g>
  );
};

/* ---------- the kitchen at night: the fridge is a glowing watering hole ---------- */
export const Kitchen: React.FC<{t: number; open?: number; children?: React.ReactNode}> = ({t, open = 0, children}) => (
  <g>
    <rect width={W} height={FLOOR} fill="#141518" />
    {Array.from({length: 14}, (_, i) =>
      Array.from({length: 4}, (_, j) => <rect key={`${i}-${j}`} x={200 + i * 60} y={300 + j * 60} width={56} height={56} fill="#1b1d22" />),
    )}
    <rect x={180} y={540} width={900} height={22} fill="#24272d" stroke={C.line} strokeWidth={3} />
    <rect x={180} y={562} width={900} height={FLOOR - 562} fill="#17191d" stroke={C.line} strokeWidth={3} />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={480 + i * 300} y1={562} x2={480 + i * 300} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    ))}
    <rect x={500} y={160} width={160} height={110} fill="#0d1526" stroke={C.line} strokeWidth={6} />
    <circle cx={620} cy={195} r={18} fill="#e9e6da" opacity={0.8} />
    {/* fridge */}
    <rect x={1240} y={180} width={360} height={FLOOR - 180} rx={16} fill="#2a2d33" stroke={C.line} strokeWidth={5} />
    {[[1290, 260, '#e07b8a'], [1330, 300, C.teal], [1300, 340, C.amber]].map(([x, y, c], i) => (
      <rect key={i} x={x as number} y={y as number} width={30} height={30} rx={6} fill={c as string} />
    ))}
    {open > 0 && (
      <g>
        <polygon points={`1240,180 ${1240 - open * 260},140 ${1240 - open * 260},${FLOOR + 30} 1240,${FLOOR}`} fill="#3a3d44" stroke={C.line} strokeWidth={4} />
        <rect x={1250} y={190} width={340} height={FLOOR - 200} fill="#f2f0e6" opacity={open} />
        {[300, 450, 600].map((y) => (
          <line key={y} x1={1250} y1={y} x2={1590} y2={y} stroke="#c9c6ba" strokeWidth={4} opacity={open} />
        ))}
        <Light id="frg" x={1300} y={500} r={900} color="#f2f0e6" o={open * 0.7} />
        <polygon points={`1240,190 1600,190 ${700},${H} ${200},${H}`} fill="#f2f0e6" opacity={open * 0.06} />
      </g>
    )}
    <Dust t={t} x={1000} y={200} w={700} h={650} n={30} color="#f2f0e6" o={0.4 * open} />
    {children}
    <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill="#16171a" />
    {Array.from({length: 10}, (_, i) => (
      <line key={i} x1={i * 200} y1={FLOOR} x2={i * 200 - 300} y2={H} stroke="#202227" strokeWidth={3} />
    ))}
  </g>
);

/* ---------- imagery: the window turns into a savanna, humans move in herds ---------- */
export const Savanna: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="sav" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2c27a" />
        <stop offset="0.6" stopColor="#e9a94f" />
        <stop offset="1" stopColor="#c27a4a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sav)" />
    <circle cx={1450} cy={330} r={130} fill="#fff1d0" opacity={0.85} />
    <path d="M 0 600 Q 400 520 800 580 T 1600 560 T 2000 590 L 2000 1080 L 0 1080 Z" fill="#b8864a" />
    <path d="M 0 700 Q 500 650 1000 700 T 2000 690 L 2000 1080 L 0 1080 Z" fill="#a0723d" />
    {[[300, 560, 1.2], [1100, 570, 0.9], [1700, 560, 1.1]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <line x1={0} y1={0} x2={0} y2={-160} stroke="#4a3220" strokeWidth={14} />
        <ellipse cx={0} cy={-180} rx={160} ry={40} fill="#5a4a2a" />
      </g>
    ))}
    {/* the herd of humans running and playing */}
    {Array.from({length: 9}, (_, i) => {
      const x = ((i * 230 + t * 160) % 2400) - 200;
      const bob = Math.abs(Math.sin(t * 8 + i)) * 14;
      return (
        <g key={i} transform={`translate(${x} ${760 - bob}) scale(0.5)`} opacity={0.85}>
          <ellipse cx={0} cy={-60} rx={60} ry={90} fill="#5a3a22" />
          <circle cx={0} cy={-210} r={70} fill="#5a3a22" />
        </g>
      );
    })}
    {Array.from({length: 12}, (_, i) => {
      const x = ((i * 160 + t * 90) % 2200) - 100;
      return <path key={i} d={`M ${x} ${200 + (i % 4) * 40} q 10 -10 20 0 q 10 -10 20 0`} stroke="#4a3220" strokeWidth={4} fill="none" />;
    })}
    <Dust t={t} n={40} color="#fff1d0" o={0.5} />
  </g>
);

/** Notification birds: little birds with red badges that peck at the window. */
export const NotifBird: React.FC<{x: number; y: number; t: number; k: number; s?: number}> = ({x, y, t, k, s = 1}) => {
  const peck = Math.max(0, Math.sin(t * 9 + k * 2)) * 10;
  return (
    <g transform={`translate(${x + peck} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={34} ry={26} fill="#a6a9b0" stroke={C.outline} strokeWidth={3} />
      <circle cx={26} cy={-20} r={18} fill="#a6a9b0" stroke={C.outline} strokeWidth={3} />
      <path d="M 42 -22 L 58 -18 L 42 -12 Z" fill={C.amber} stroke={C.outline} strokeWidth={2} />
      <circle cx={30} cy={-24} r={3} fill={C.outline} />
      <path d="M -30 -4 L -54 -18 L -40 6 Z" fill="#8a8d94" stroke={C.outline} strokeWidth={2} />
      <circle cx={10} cy={-30} r={11} fill="#e0565b" stroke="#fff" strokeWidth={2} />
      <text x={10} y={-25} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={13} fill="#fff">
        {k + 1}
      </text>
    </g>
  );
};

/* ---------- outside: the street as warm plains at golden hour ---------- */
export const StreetPlains: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <g>
    <defs>
      <linearGradient id="spsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5b7bb0" />
        <stop offset="1" stopColor="#f2c27a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#spsky)" />
    {Array.from({length: 7}, (_, i) => (
      <g key={i}>
        <rect x={i * 290 - 40} y={360 + (i % 3) * 30} width={250} height={420} fill={['#3a3550', '#45405a', '#3a3a52'][i % 3]} />
        <path d={`M ${i * 290 - 60} ${360 + (i % 3) * 30} L ${i * 290 + 85} ${280 + (i % 3) * 30} L ${i * 290 + 230} ${360 + (i % 3) * 30} Z`} fill="#2e2a42" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={i * 290 + (k % 2) * 110} y={420 + (i % 3) * 30 + Math.floor(k / 2) * 110} width={60} height={70} fill={C.amberLight} opacity={(i + k) % 3 === 0 ? 0.7 : 0.2} />
        ))}
      </g>
    ))}
    {[300, 900, 1500].map((x) => (
      <g key={x}>
        <line x1={x} y1={FLOOR} x2={x} y2={420} stroke="#2a2630" strokeWidth={8} />
        <ellipse cx={x} cy={415} rx={26} ry={12} fill={C.amberLight} />
        <Light id={`sp${x}`} x={x} y={430} r={260} color={C.amber} o={0.6} />
      </g>
    ))}
    <rect x={0} y={780} width={W} height={H - 780} fill="#2a2630" />
    <rect x={0} y={780} width={W} height={10} fill="#3a3540" />
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={i * 220 + ((t * 40) % 220) - 220} y={940} width={120} height={8} fill="#e9e2c8" opacity={0.3} />
    ))}
    {Array.from({length: 8}, (_, i) => {
      const x = ((i * 260 + t * 60) % 2200) - 100;
      return <path key={i} d={`M ${x} ${180 + (i % 3) * 50} q 10 -10 20 0 q 10 -10 20 0`} stroke="#2a2630" strokeWidth={4} fill="none" />;
    })}
    <Dust t={t} n={30} color="#fff1d0" o={0.4} />
    {children}
  </g>
);

/* ---------- the park at sunset: big tree, grass, kites ---------- */
export const ParkSunset: React.FC<{t: number; children?: React.ReactNode; kites?: number}> = ({t, children, kites = 2}) => (
  <g>
    <defs>
      <linearGradient id="pksky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3550" />
        <stop offset="1" stopColor="#f2b765" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#pksky)" />
    <circle cx={1500} cy={560} r={120} fill="#ffd69a" />
    <path d="M 0 700 Q 500 620 1000 680 T 2000 660 L 2000 1080 L 0 1080 Z" fill="#3e5a34" />
    <path d="M 0 800 Q 600 760 1200 800 T 2000 790 L 2000 1080 L 0 1080 Z" fill="#4a6a3e" />
    <g transform="translate(330 0)">
      <Tree x={0} s={1.6} warm={1} />
    </g>
    {Array.from({length: 30}, (_, i) => (
      <path key={i} d={`M ${i * 66} ${FLOOR + 20} q 4 -20 ${Math.sin(t * 2 + i) * 6} -36`} stroke="#5d8a4f" strokeWidth={4} fill="none" />
    ))}
    {Array.from({length: kites}, (_, i) => {
      const kx = 1100 + i * 380 + Math.sin(t * 1.3 + i) * 40;
      const ky = 240 + i * 60 + Math.cos(t * 1.1 + i) * 25;
      return (
        <g key={i}>
          <line x1={kx} y1={ky + 50} x2={kx - 200 + i * 60} y2={FLOOR - 220} stroke="#e9e2c8" strokeWidth={2} />
          <g transform={`translate(${kx} ${ky}) rotate(${Math.sin(t * 1.7 + i) * 14})`}>
            <path d="M 0 -50 L 36 0 L 0 50 L -36 0 Z" fill={i ? C.teal : '#e07b8a'} stroke={C.outline} strokeWidth={3} />
            <path d="M 0 50 q 12 20 -6 40 q -14 20 6 40" stroke={C.amberLight} strokeWidth={3} fill="none" />
          </g>
        </g>
      );
    })}
    <Light id="pkw" x={1500} y={560} r={1300} color={C.amber} o={0.9} />
    <Dust t={t} n={40} color="#fff1d0" o={0.5} />
    {children}
  </g>
);

/* ---------- small props ---------- */
export const ChipBag: React.FC<{x: number; y: number; s?: number; c?: string; r?: number}> = ({x, y, s = 1, c = '#e07b8a', r = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${r})`}>
    <path d="M -40 -60 L 40 -60 L 34 60 L -34 60 Z" fill={c} stroke={C.outline} strokeWidth={4} />
    <path d="M -40 -60 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8 l 8 8" stroke={C.outline} strokeWidth={3} fill="none" />
    <circle cx={0} cy={0} r={20} fill="#f2c27a" stroke={C.outline} strokeWidth={3} />
  </g>
);

export const Binoculars: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-24} width={50} height={48} rx={14} fill="#2a2d33" stroke={C.outline} strokeWidth={4} />
    <rect x={10} y={-24} width={50} height={48} rx={14} fill="#2a2d33" stroke={C.outline} strokeWidth={4} />
    <rect x={-12} y={-10} width={24} height={20} fill="#3a3d44" stroke={C.outline} strokeWidth={3} />
    <circle cx={-35} cy={0} r={12} fill="#6f8fb0" />
    <circle cx={35} cy={0} r={12} fill="#6f8fb0" />
  </g>
);

/** Circular binocular view mask over any scene. */
export const BinoView: React.FC<{children: React.ReactNode}> = ({children}) => (
  <g>
    <defs>
      <mask id="bino">
        <rect width={W} height={H} fill="#000" />
        <circle cx={760} cy={540} r={380} fill="#fff" />
        <circle cx={1160} cy={540} r={380} fill="#fff" />
      </mask>
    </defs>
    <rect width={W} height={H} fill="#050608" />
    <g mask="url(#bino)">{children}</g>
  </g>
);

export const Kite: React.FC<{x: number; y: number; s?: number; r?: number; color?: string}> = ({x, y, s = 1, r = 0, color = '#e07b8a'}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${r})`}>
    <path d="M 0 -60 L 44 0 L 0 60 L -44 0 Z" fill={color} stroke={C.outline} strokeWidth={4} />
    <line x1={0} y1={-60} x2={0} y2={60} stroke={C.outline} strokeWidth={3} />
    <line x1={-44} y1={0} x2={44} y2={0} stroke={C.outline} strokeWidth={3} />
    <path d="M 0 60 q 14 24 -8 48 q -16 24 8 48" stroke={C.amberLight} strokeWidth={4} fill="none" />
  </g>
);

export const Door: React.FC<{x: number; open?: number}> = ({x, open = 0}) => (
  <g>
    <rect x={x - 130} y={300} width={260} height={FLOOR - 300} fill="#0a0b0d" stroke={C.line} strokeWidth={6} />
    {open > 0 && <rect x={x - 124} y={306} width={248} height={FLOOR - 306} fill="#f2c27a" opacity={0.85 * open} />}
    <rect x={x - 130} y={300} width={260 * (1 - open * 0.85)} height={FLOOR - 300} fill="#3a2c22" stroke={C.outline} strokeWidth={4} />
    <circle cx={x - 130 + 260 * (1 - open * 0.85) - 30} cy={600} r={10} fill={C.amber} />
  </g>
);
