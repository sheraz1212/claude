import React from 'react';
import {Light} from '../common/sets';
import {C} from '../common/theme';
import {Rain} from '../common/echoSets2';
import {MOM, RED, NEW_SHOES} from './sets';

const OL = C.outline;

const Sky: React.FC<{x: number; y: number; w: number; h: number; id: string}> = ({x, y, w, h, id}) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141428" />
        <stop offset="1" stopColor="#2c2440" />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    {Array.from({length: Math.ceil(w / 60)}, (_, i) => {
      const bh = h * (0.3 + Math.abs(Math.sin(i * 3.7 + x)) * 0.5);
      return (
        <g key={i}>
          <rect x={x + i * 60} y={y + h - bh} width={56} height={bh} fill="#1b1926" />
          {Math.sin(i * 5.1) > 0 && <rect x={x + i * 60 + 18} y={y + h - bh + 16} width={9} height={11} fill={C.amberLight} opacity={0.7} />}
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------------ (C) HIS BEDROOM */
export const BEDROOM_Y = 880;
export const Bedroom: React.FC<{t: number; boxes?: number; lamp?: number}> = ({t, boxes = 0, lamp = 1}) => (
  <g>
    <rect width={1920} height={1080} fill="#26222e" />
    {/* window */}
    <Sky x={760} y={190} w={400} h={330} id="bsky" />
    <rect x={760} y={190} width={400} height={330} fill="none" stroke="#3a2e36" strokeWidth={14} />
    <line x1={960} y1={190} x2={960} y2={520} stroke="#3a2e36" strokeWidth={9} />
    <Light id="bwin" x={960} y={380} r={500} color={C.coldLight} o={0.25} />
    {/* bed */}
    <rect x={120} y={640} width={520} height={110} rx={18} fill="#3e4a66" stroke={OL} strokeWidth={4} />
    <rect x={100} y={500} width={40} height={360} rx={10} fill="#4a3428" stroke={OL} strokeWidth={4} />
    <rect x={150} y={600} width={140} height={56} rx={22} fill="#d8d2c4" stroke={OL} strokeWidth={4} />
    <rect x={120} y={750} width={520} height={30} fill="#2e3850" />
    {/* desk lamp on a small desk */}
    <rect x={1420} y={640} width={360} height={22} fill="#5a4030" stroke={OL} strokeWidth={4} />
    <rect x={1440} y={662} width={18} height={198} fill="#4a3428" />
    <rect x={1742} y={662} width={18} height={198} fill="#4a3428" />
    <path d="M 1700 640 L 1700 560 L 1650 520" stroke="#2a2a30" strokeWidth={8} fill="none" />
    <path d="M 1610 540 L 1680 500 L 1690 530 Z" fill="#d9a66a" stroke={OL} strokeWidth={3} />
    {lamp > 0 && <Light id="blamp" x={1640} y={560} r={520} color={C.amber} o={0.7 * lamp} />}
    {/* poster */}
    <rect x={1300} y={240} width={150} height={190} fill="#3d3550" stroke={OL} strokeWidth={3} />
    <path d="M 1320 400 Q 1375 300 1430 400 Z" fill="#5a4f74" />
    {/* shoe boxes stacked by the window */}
    {Array.from({length: boxes}, (_, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return (
        <g key={i} transform={`translate(${1180 + col * 120 + (row % 2) * 10} ${840 - row * 54})`}>
          <rect x={0} y={0} width={112} height={50} rx={3} fill={['#e46a5a', '#e8e4dc', '#3a3a44', '#d8a44a'][i % 4]} stroke={OL} strokeWidth={3} />
          <rect x={0} y={0} width={112} height={12} fill="#00000025" />
        </g>
      );
    })}
    {/* floor */}
    <rect y={BEDROOM_Y} width={1920} height={200} fill="#1f1c25" />
    {[930, 990, 1050].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000030" strokeWidth={3} />)}
    {lamp > 0 && <ellipse cx={1600} cy={910} rx={360} ry={40} fill={C.amberLight} opacity={0.06 * lamp} />}
  </g>
);

/* ------------------------------------------------------------------ (D) SNEAKER STORE at the mall */
export const STORE_Y = 880;
const Shoe: React.FC<{x: number; y: number; c: string; s?: number}> = ({x, y, c, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 0 L -40 -22 Q -30 -34 -6 -30 L 10 -16 Q 34 -14 42 -2 L 42 0 Z" fill={c} stroke={OL} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-42} y={-4} width={86} height={7} rx={3} fill="#f4f2ee" stroke={OL} strokeWidth={2} />
    <path d="M -20 -20 L 4 -10" stroke={RED} strokeWidth={4} />
  </g>
);
export const Store: React.FC<{t: number; spot?: number; shoppers?: boolean}> = ({t, spot = 1}) => (
  <g>
    <rect width={1920} height={1080} fill="#221f2b" />
    {/* glass front of the store, the mall corridor behind (left) */}
    <rect x={0} y={150} width={420} height={730} fill="#191826" />
    {[60, 220, 380].map((lx) => <circle key={lx} cx={lx} cy={220} r={14} fill="#f2e2b8" opacity={0.7} />)}
    <rect x={30} y={420} width={150} height={460} fill="#2a2638" />
    <rect x={240} y={480} width={160} height={400} fill="#2e2a3c" />
    <line x1={420} y1={150} x2={420} y2={880} stroke="#3a3446" strokeWidth={14} />
    <rect x={0} y={150} width={420} height={730} fill="#9fb4d6" opacity={0.05} />
    {/* store sign */}
    <rect x={760} y={70} width={520} height={80} rx={10} fill="#1a1820" stroke="#3a3446" strokeWidth={4} />
    <text x={1020} y={127} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={46} fill={RED} letterSpacing={6}>KICKS</text>
    {/* shelf wall with shoes */}
    {[300, 430, 560].map((sy, r) => (
      <g key={sy}>
        <rect x={520} y={sy} width={1000} height={14} fill="#d8d0c0" opacity={0.9} />
        <rect x={520} y={sy - 6} width={1000} height={6} fill="#fff2d0" opacity={0.6} />
        {Array.from({length: 9}, (_, i) => <Shoe key={i} x={580 + i * 110} y={sy} c={['#e8e4dc', '#3a3a44', '#d8a44a', '#5b86b8', '#e46a5a'][(i + r) % 5]} />)}
      </g>
    ))}
    <Light id="shelfL" x={1020} y={420} r={700} color="#fff2d0" o={0.5} />
    {/* the hero sneaker on a lit pedestal */}
    <rect x={1560} y={600} width={200} height={280} fill="#2e2a38" stroke={OL} strokeWidth={4} />
    <rect x={1550} y={590} width={220} height={20} fill="#3e3a48" stroke={OL} strokeWidth={4} />
    <Shoe x={1660} y={590} c={NEW_SHOES} s={1.3} />
    {spot > 0 && (
      <>
        <path d="M 1610 0 L 1710 0 L 1800 600 L 1520 600 Z" fill="#fff2d0" opacity={0.07 * spot} />
        <Light id="spotL" x={1660} y={560} r={360} color="#fff2d0" o={0.8 * spot} />
      </>
    )}
    {/* counter + register (right) */}
    <rect x={1780} y={640} width={200} height={240} fill="#3a3040" stroke={OL} strokeWidth={4} />
    {/* floor: glossy */}
    <rect y={STORE_Y} width={1920} height={200} fill="#24212c" />
    {[920, 980, 1040].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000030" strokeWidth={3} />)}
    <ellipse cx={1020} cy={910} rx={520} ry={40} fill="#fff2d0" opacity={0.06} />
  </g>
);

/* INSERT top-down: the store counter, money laid flat */
export const CounterInsert: React.FC<{t: number; unfold: number; box?: number; price?: string; boxColor?: string}> = ({t, unfold, box = 1, price = '$180', boxColor = '#e46a5a'}) => {
  const u = Math.max(0, Math.min(1, unfold));
  const P = (a: [number, number], b: [number, number]) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const pts = [P([-95, 70], [-170, -80]), P([0, -95], [170, -80]), P([95, 70], [170, 80]), P([-95, 70], [-170, 80])].map(([x, y]) => `${860 + x},${560 + y}`).join(' ');
  return (
    <g>
      <rect width={1920} height={1080} fill="#3a3040" />
      <rect x={0} y={0} width={1920} height={1080} fill="#2e2834" />
      <Light id="ctrL" x={960} y={500} r={900} color="#fff2d0" o={0.55} />
      {/* shoe box with $180 sticker */}
      <g opacity={box}>
        <rect x={1180} y={300} width={520} height={340} rx={10} fill={boxColor} stroke={OL} strokeWidth={6} />
        <rect x={1180} y={300} width={520} height={60} fill="#00000025" />
        <rect x={1460} y={520} width={190} height={80} rx={8} fill={RED} stroke={OL} strokeWidth={4} />
        <text x={1555} y={576} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={46} fill="#fff">{price}</text>
      </g>
      {/* other bills already there */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={420 + i * 30} y={700 + i * 14} width={340} height={160} rx={6} fill="#7fa77a" stroke={OL} strokeWidth={4} transform={`rotate(${i * 4 - 6} 590 780)`} />)}
      <polygon points={pts} fill="#86ad7f" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      {u > 0.6 && <text x={860} y={590} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#4c6e48" opacity={(u - 0.6) / 0.4}>20</text>}
    </g>
  );
};

/* ------------------------------------------------------------------ (E) STREET in the rain: bus stop + the diner across */
export const STREET_Y = 900;
export const Street: React.FC<{t: number; rain?: number}> = ({t, rain = 0.55}) => (
  <g>
    <rect width={1920} height={1080} fill="#14131c" />
    <Sky x={0} y={60} w={1920} h={320} id="ssky" />
    {/* the diner across the street */}
    <rect x={980} y={300} width={900} height={420} fill="#2a2430" stroke={OL} strokeWidth={4} />
    <rect x={1040} y={420} width={780} height={250} fill="#f2c27a" opacity={0.85} />
    <rect x={1040} y={420} width={780} height={250} fill="none" stroke="#3a3040" strokeWidth={12} />
    {[1235, 1430, 1625].map((x) => <line key={x} x1={x} y1={420} x2={x} y2={670} stroke="#3a3040" strokeWidth={8} />)}
    {/* tiny people inside the diner */}
    {[1120, 1330, 1520, 1720].map((x, i) => <circle key={x} cx={x} cy={560 + (i % 2) * 10} r={26} fill="#3a3040" opacity={0.55} />)}
    <rect x={1220} y={320} width={420} height={70} rx={10} fill="#1a1820" stroke="#3a3446" strokeWidth={4} />
    <text x={1430} y={372} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={48} fill={C.amberLight} letterSpacing={8}>DINER</text>
    <Light id="dinerL" x={1430} y={560} r={800} color={C.amber} o={0.75} />
    {/* sidewalk across + road */}
    <rect y={720} width={1920} height={40} fill="#26232e" />
    <rect y={760} width={1920} height={140} fill="#1b1a22" />
    {[100, 500, 900, 1300, 1700].map((x) => <rect key={x} x={x} y={826} width={160} height={8} fill="#5a5660" opacity={0.6} />)}
    {/* reflections on the wet road */}
    <rect x={1040} y={770} width={780} height={110} fill={C.amberLight} opacity={0.08} />
    {/* street lamp near */}
    <rect x={640} y={240} width={14} height={660} fill="#24242c" />
    <path d="M 647 240 Q 647 200 700 200 L 740 200" stroke="#24242c" strokeWidth={12} fill="none" />
    <rect x={716} y={196} width={60} height={20} rx={6} fill="#f2e2b8" />
    <Light id="slamp" x={746} y={520} r={520} color={C.amberLight} o={0.6} />
    {/* bus shelter (near, left) */}
    <rect x={60} y={420} width={480} height={20} fill="#3a3a44" stroke={OL} strokeWidth={4} />
    <rect x={70} y={440} width={12} height={460} fill="#3a3a44" />
    <rect x={520} y={440} width={12} height={460} fill="#3a3a44" />
    <rect x={82} y={450} width={438} height={300} fill="#9fb4d6" opacity={0.08} stroke="#4a4a54" strokeWidth={3} />
    <rect x={150} y={760} width={300} height={22} rx={6} fill="#4a4a54" stroke={OL} strokeWidth={3} />
    {/* near sidewalk */}
    <rect y={STREET_Y} width={1920} height={180} fill="#201e27" />
    {[960, 1030].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000035" strokeWidth={3} />)}
    <ellipse cx={746} cy={930} rx={300} ry={30} fill={C.amberLight} opacity={0.08} />
    <Rain t={t} o={rain} n={110} />
  </g>
);

/* ------------------------------------------------------------------ (F) INSIDE THE DINER (warm) */
export const DINER_Y = 890;
export const Diner: React.FC<{t: number; rain?: number; customers?: boolean}> = ({t, rain = 0, customers = true}) => (
  <g>
    <rect width={1920} height={1080} fill="#2d2530" />
    {/* window to the night street */}
    <rect x={100} y={180} width={760} height={360} fill="#16151f" />
    <Sky x={100} y={260} w={760} h={280} id="dsky" />
    <rect x={100} y={180} width={760} height={360} fill="none" stroke="#4a3a40" strokeWidth={14} />
    {[353, 606].map((x) => <line key={x} x1={x} y1={180} x2={x} y2={540} stroke="#4a3a40" strokeWidth={8} />)}
    {rain > 0 && (
      <g opacity={rain}>
        {Array.from({length: 26}, (_, i) => <line key={i} x1={120 + i * 28} y1={200 + ((t * 120 + i * 37) % 300)} x2={118 + i * 28} y2={230 + ((t * 120 + i * 37) % 300)} stroke="#9fb4d6" strokeWidth={2} />)}
      </g>
    )}
    {/* pendant lamps */}
    {[480, 1160, 1600].map((x) => (
      <g key={x}>
        <line x1={x} y1={0} x2={x} y2={150} stroke="#1a1a1e" strokeWidth={4} />
        <path d={`M ${x - 50} 190 L ${x + 50} 190 L ${x + 26} 150 L ${x - 26} 150 Z`} fill="#c0392b" stroke={OL} strokeWidth={3} />
        <Light id={`dl${x}`} x={x} y={320} r={520} color={C.amber} o={0.6} />
      </g>
    ))}
    {/* menu board + kitchen hatch */}
    <rect x={1000} y={170} width={300} height={170} rx={8} fill="#1e1d24" stroke="#4a3a40" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={1030} y1={210 + i * 32} x2={1200 - (i % 2) * 40} y2={210 + i * 32} stroke="#d8cbb0" strokeWidth={4} opacity={0.6} />)}
    <rect x={1380} y={190} width={420} height={170} fill="#3a2e30" stroke={OL} strokeWidth={4} />
    <rect x={1400} y={210} width={380} height={130} fill="#f2c27a" opacity={0.5} />
    {/* counter with stools (right) */}
    <rect x={1240} y={600} width={680} height={60} fill="#7a3a34" stroke={OL} strokeWidth={4} />
    <rect x={1240} y={660} width={680} height={230} fill="#4a3036" stroke={OL} strokeWidth={4} />
    {customers && [1360, 1560, 1760].map((x, i) => <circle key={x} cx={x} cy={540 + (i % 2) * 6} r={0} />)}
    {/* booth (left, near): back of the bench */}
    <rect x={80} y={600} width={760} height={140} rx={20} fill="#8a3a34" stroke={OL} strokeWidth={4} />
    {/* floor: checker */}
    <rect y={DINER_Y} width={1920} height={190} fill="#2a2228" />
    {Array.from({length: 24}, (_, i) => <rect key={i} x={i * 80} y={DINER_Y + (i % 2) * 40} width={80} height={40} fill="#3a2e34" opacity={0.6} />)}
    <ellipse cx={1160} cy={920} rx={420} ry={40} fill={C.amberLight} opacity={0.08} />
  </g>
);

/** A diner table (front) - draw after people sitting behind it. */
export const DinerTable: React.FC<{x: number; plates?: number}> = ({x, plates = 0}) => (
  <g>
    <rect x={x - 220} y={700} width={440} height={24} rx={6} fill="#d8cbb0" stroke={OL} strokeWidth={4} />
    <rect x={x - 12} y={724} width={24} height={166} fill="#3a3a44" />
    {Array.from({length: plates}, (_, i) => (
      <g key={i} transform={`translate(${x - 90 + i * 180} 700)`}>
        <ellipse cx={0} cy={-4} rx={60} ry={12} fill="#f4f2ee" stroke={OL} strokeWidth={3} />
        <ellipse cx={0} cy={-12} rx={34} ry={12} fill="#c98a4a" stroke={OL} strokeWidth={2} />
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ (G) THE DINER'S BACK ALLEY */
export const ALLEY_Y = 890;
export const Alley: React.FC<{t: number; rain?: number; bulb?: number}> = ({t, rain = 0.4, bulb = 1}) => (
  <g>
    <rect width={1920} height={1080} fill="#1a1820" />
    {/* brick wall */}
    <rect x={0} y={80} width={1920} height={810} fill="#2c2228" />
    {Array.from({length: 22}, (_, r) =>
      Array.from({length: 26}, (_, c) => (
        <rect key={`${r}-${c}`} x={c * 80 - (r % 2) * 40} y={90 + r * 36} width={74} height={30} fill="#33272e" opacity={0.7} />
      )),
    )}
    {/* back door + bulb */}
    <rect x={820} y={420} width={220} height={470} fill="#3a3640" stroke={OL} strokeWidth={5} />
    <rect x={1000} y={640} width={12} height={40} rx={4} fill="#8a877f" />
    <rect x={840} y={440} width={180} height={80} fill="#f2c27a" opacity={0.35} />
    <rect x={912} y={360} width={36} height={26} rx={6} fill="#efe6cf" />
    <Light id="bulb" x={930} y={520} r={620} color={C.amberLight} o={0.7 * bulb} />
    {/* dumpster + crates */}
    <rect x={1300} y={640} width={420} height={250} rx={10} fill="#2f4a3e" stroke={OL} strokeWidth={4} />
    <rect x={1290} y={620} width={440} height={30} rx={6} fill="#28403a" stroke={OL} strokeWidth={4} />
    <rect x={260} y={760} width={150} height={130} fill="#6a4a36" stroke={OL} strokeWidth={4} />
    <rect x={430} y={800} width={120} height={90} fill="#5a3e2e" stroke={OL} strokeWidth={4} />
    {/* ground + puddles */}
    <rect y={ALLEY_Y} width={1920} height={190} fill="#18161e" />
    <ellipse cx={930} cy={930} rx={300} ry={26} fill={C.amberLight} opacity={0.1 * bulb} />
    <ellipse cx={1420} cy={970} rx={160} ry={16} fill="#9fb4d6" opacity={0.12} />
    <Rain t={t} o={rain} n={70} />
  </g>
);

/** A wooden crate to sit on (draw before the sitter). */
export const Crate: React.FC<{x: number; y?: number}> = ({x, y = 890}) => (
  <g>
    <rect x={x - 80} y={y - 140} width={160} height={140} fill="#6a4a36" stroke={OL} strokeWidth={4} />
    <line x1={x - 80} y1={y - 94} x2={x + 80} y2={y - 94} stroke={OL} strokeWidth={3} />
    <line x1={x - 80} y1={y - 48} x2={x + 80} y2={y - 48} stroke={OL} strokeWidth={3} />
  </g>
);

/* INSERT top-down: Mom's lunch box on her lap - open, EMPTY */
export const LunchboxInsert: React.FC<{t: number; open: number}> = ({t, open}) => (
  <g>
    <rect width={1920} height={1080} fill="#1e1a22" />
    <rect x={0} y={0} width={1920} height={1080} fill={MOM.jacket} opacity={0.55} />
    <Light id="lbL" x={960} y={400} r={900} color={C.amberLight} o={0.5} />
    <rect x={560} y={330} width={800} height={460} rx={40} fill="#5b86b8" stroke={OL} strokeWidth={8} />
    <rect x={600} y={370} width={720} height={380} rx={26} fill="#3e5e86" />
    {/* lid sliding off */}
    <rect x={560 + open * 900} y={330 - open * 120} width={800} height={460} rx={40} fill="#4a72a2" stroke={OL} strokeWidth={8} opacity={1 - open * 0.2} />
    {/* her two mitten hands holding the box */}
    <ellipse cx={520} cy={600} rx={90} ry={100} fill={MOM.color} stroke={OL} strokeWidth={7} />
    <ellipse cx={1400} cy={600} rx={90} ry={100} fill={MOM.color} stroke={OL} strokeWidth={7} />
  </g>
);

/* INSERT: his wallet, one folded triangle kept */
export const WalletInsert: React.FC<{t: number; o?: number}> = ({t, o = 1}) => (
  <g opacity={o}>
    <rect width={1920} height={1080} fill="#221c1e" />
    <Light id="wl" x={960} y={500} r={900} color={C.amber} o={0.75} />
    <rect x={460} y={260} width={1000} height={560} rx={40} fill="#6a4630" stroke={OL} strokeWidth={8} />
    <line x1={960} y1={270} x2={960} y2={810} stroke="#4a3020" strokeWidth={8} />
    <rect x={520} y={420} width={380} height={340} rx={20} fill="#5a3a26" stroke={OL} strokeWidth={5} />
    <rect x={1020} y={420} width={380} height={340} rx={20} fill="#5a3a26" stroke={OL} strokeWidth={5} />
    <polygon points="1210,330 1110,500 1310,500" fill="#86ad7f" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <rect x={560} y={470} width={300} height={50} rx={8} fill="#c9c4bc" stroke={OL} strokeWidth={3} />
  </g>
);

/** Phone POV: bank app showing his balance */
export const BankScreen: React.FC<{t: number; bal: string}> = ({t, bal}) => (
  <g>
    <rect width={1920} height={1080} fill="#15141b" />
    <Light id="bkl" x={960} y={540} r={700} color={C.coldLight} o={0.4} />
    <rect x={700} y={80} width={520} height={920} rx={56} fill="#111018" stroke={OL} strokeWidth={6} />
    <rect x={724} y={110} width={472} height={860} rx={40} fill="#f4f2f7" />
    <text x={960} y={220} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={34} fill={OL}>My Bank</text>
    <text x={960} y={360} textAnchor="middle" fontFamily="Nunito" fontWeight={700} fontSize={30} fill="#7a7d86">balance</text>
    <text x={960} y={470} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill={RED}>{bal}</text>
    {[['KICKS', '-$180'], ['CAP CO.', '-$90'], ['JACKETS+', '-$300']].map(([n, v], i) => (
      <g key={n}>
        <text x={760} y={600 + i * 80} fontFamily="Nunito" fontWeight={700} fontSize={30} fill={OL}>{n}</text>
        <text x={1160} y={600 + i * 80} textAnchor="end" fontFamily="Nunito" fontWeight={800} fontSize={30} fill={RED}>{v}</text>
      </g>
    ))}
  </g>
);
