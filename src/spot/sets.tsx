import React from 'react';
import {Light, Person, TAN, GREY, SCARF} from '../common/sets';
import {C} from '../common/theme';

export const PURPLE = '#ff3b3b';
export const PURPLE_L = '#ff7a7a';
export const MIA = {color: TAN, accessory: 'scarf' as const, accessoryColor: SCARF};
const OL = C.outline;

/** Floating music notes rising from a point. */
export const Notes: React.FC<{t: number; x: number; y: number; n?: number; color?: string; o?: number}> = ({t, x, y, n = 5, color = C.amberLight, o = 1}) => (
  <g opacity={o}>
    {Array.from({length: n}, (_, i) => {
      const life = ((t * 0.45 + i / n) % 1 + 1) % 1;
      const nx = x + Math.sin(life * 6 + i * 2) * 50 + (i - n / 2) * 30;
      const ny = y - life * 300;
      const a = Math.sin(life * Math.PI);
      return (
        <g key={i} transform={`translate(${nx} ${ny}) rotate(${Math.sin(life * 5 + i) * 15})`} opacity={a}>
          <ellipse cx={0} cy={0} rx={13} ry={10} fill={color} transform="rotate(-20)" />
          <rect x={9} y={-46} width={5} height={46} fill={color} />
          {i % 2 === 0 && <path d="M 14 -46 q 18 8 14 26" stroke={color} strokeWidth={5} fill="none" />}
        </g>
      );
    })}
  </g>
);

/** Rain streaks over the whole frame. */
export const Rain: React.FC<{t: number; o?: number}> = ({t, o = 1}) => (
  <g opacity={o}>
    {Array.from({length: 140}, (_, i) => {
      const x = (i * 137.3) % 1980;
      const y = ((i * 91.7 + t * 1400) % 1200) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 38} stroke="#b9c6e6" strokeWidth={2} opacity={0.35} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/** (C) THE LANTERN café, seen from the back of the room. Stage up-centre-left. */
export const Cafe: React.FC<{t: number; spot?: number; crowd?: number; day?: boolean}> = ({t, spot = 1, crowd = 6, day = false}) => {
  const seats: [number, number, number][] = [
    [520, 790, 0.5], [700, 800, 0.52], [900, 780, 0.48], [1120, 795, 0.5], [1330, 780, 0.48], [600, 900, 0.62], [1000, 910, 0.62], [380, 880, 0.6],
  ];
  return (
    <g>
      {/* far: brick wall */}
      <rect width={1920} height={640} fill={day ? '#4e3529' : '#46302a'} />
      {Array.from({length: 16}, (_, r) => (
        <g key={r}>
          <line x1={0} y1={r * 40} x2={1920} y2={r * 40} stroke="#4c3126" strokeWidth={3} />
          {Array.from({length: 25}, (_, k) => (
            <line key={k} x1={k * 80 + (r % 2) * 40} y1={r * 40} x2={k * 80 + (r % 2) * 40} y2={r * 40 + 40} stroke="#4c3126" strokeWidth={3} />
          ))}
        </g>
      ))}
      {/* window on the right wall with night city */}
      <rect x={1500} y={150} width={300} height={300} rx={10} fill={day ? '#59607a' : '#1f2a44'} stroke="#2e1e18" strokeWidth={14} />
      {!day && [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1520 + i * 45} y={300 - (i % 3) * 40} width={36} height={150 + (i % 3) * 40} fill="#2b3656" />)}
      {!day && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={1530 + (i % 6) * 45} y={330 + (i % 3) * 30 - (i % 2) * 20} width={10} height={12} fill={C.amberLight} opacity={0.8} />)}
      <line x1={1650} y1={150} x2={1650} y2={450} stroke="#2e1e18" strokeWidth={10} />
      {/* stage curtain + neon sign */}
      <rect x={430} y={120} width={900} height={450} fill="#3b2032" />
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M ${450 + i * 90} 120 q 20 220 0 450`} stroke="#2c1626" strokeWidth={14} fill="none" />)}
      <text x={880} y={100} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={58} fill={C.amberLight} letterSpacing={8} style={{filter: 'drop-shadow(0 0 12px #f2c27a)'}}>
        THE LANTERN
      </text>
      {/* stage platform */}
      <rect x={400} y={560} width={960} height={22} fill="#7a5643" stroke={OL} strokeWidth={3} />
      <rect x={400} y={582} width={960} height={58} fill="#3a2620" stroke={OL} strokeWidth={3} />
      {/* mic stand */}
      <line x1={880} y1={560} x2={880} y2={430} stroke="#22252b" strokeWidth={6} />
      <ellipse cx={880} cy={560} rx={30} ry={6} fill="#22252b" />
      {/* spotlight cone + pool */}
      <defs>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3d6" stopOpacity={0.05} />
          <stop offset="1" stopColor="#fff3d6" stopOpacity={0.32} />
        </linearGradient>
      </defs>
      <path d={`M 860 0 L 900 0 L 1010 565 L 750 565 Z`} fill="url(#cone)" opacity={spot} />
      <ellipse cx={880} cy={566} rx={150} ry={20} fill="#fff3d6" opacity={0.35 * spot} />
      <Light id="stageL" x={880} y={470} r={380} color="#ffe6b0" o={0.55 * spot} />
      {/* string lights */}
      <path d="M 0 40 Q 480 150 960 40 Q 1440 150 1920 40" stroke="#22191a" strokeWidth={3} fill="none" />
      {Array.from({length: 17}, (_, i) => {
        const x = i * 120;
        const u = (x % 960) / 960;
        const y = 40 + 4 * 110 * u * (1 - u) * 0.68 + 10;
        const tw = 0.75 + 0.25 * Math.sin(t * 2 + i * 1.3);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={20} fill={C.amberLight} opacity={0.18 * tw} />
            <circle cx={x} cy={y} r={8} fill={C.amberLight} opacity={tw} />
          </g>
        );
      })}
      {/* floor */}
      <rect y={640} width={1920} height={440} fill="#3b2a24" />
      {Array.from({length: 18}, (_, i) => <line key={i} x1={960 + (i - 9) * 70} y1={640} x2={960 + (i - 9) * 260} y2={1080} stroke="#33241f" strokeWidth={4} />)}
      {[700, 780, 880, 1000].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#33241f" strokeWidth={3} />)}
      <ellipse cx={880} cy={700} rx={520} ry={70} fill="#ffe6b0" opacity={0.08 * spot} />
      {/* audience (backs), small tables */}
      {seats.slice(0, crowd).map(([x, y, sc], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 4} rx={70 * sc * 1.6} ry={12} fill="#000" opacity={0.25} />
          <Person id={`aud${i}`} x={x} y={y} scale={sc} back pose="arms-down" color={i % 2 ? GREY : TAN} accessory={i === 2 ? 'bow' : i === 4 ? 'headphones' : 'none'} accessoryColor={i === 4 ? '#6d8fb3' : '#e07b9a'} headTilt={Math.sin(t * 1.3 + i) * 3} />
        </g>
      ))}
    </g>
  );
};

/** Foreground last-row table (right), drawn over the hero. */
export const CafeFg: React.FC<{cup?: boolean}> = ({cup = true}) => (
  <g>
    <ellipse cx={1500} cy={1075} rx={260} ry={30} fill="#000" opacity={0.3} />
    <rect x={1290} y={930} width={420} height={30} rx={8} fill="#6b4632" stroke={OL} strokeWidth={4} />
    <rect x={1480} y={960} width={40} height={130} fill="#4a3024" stroke={OL} strokeWidth={4} />
    {cup && (
      <g>
        <rect x={1350} y={880} width={46} height={52} rx={6} fill="#efe4cf" stroke={OL} strokeWidth={4} />
        <path d="M 1396 892 q 22 2 18 18 q -4 12 -18 10" stroke={OL} strokeWidth={4} fill="none" />
      </g>
    )}
    <Light id="tableL" x={1500} y={880} r={300} color={C.amber} o={0.35} />
  </g>
);

/* ------------------------------------------------------------------ */
/** (A) His attic room. golden: 0 night … 1 golden hour. lamp: desk lamp on. */
export const Attic: React.FC<{t: number; golden?: number; lamp?: number; dust?: number; guitarInCorner?: boolean; phoneGlow?: number}> = ({
  t,
  golden = 1,
  lamp = 0,
  dust = 0,
  guitarInCorner = false,
  phoneGlow = 0,
}) => {
  const g = golden;
  const wall = g > 0.5 ? '#5e4038' : '#3a313c';
  const wallD = g > 0.5 ? '#4a3029' : '#2c2530';
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      {/* sloped ceiling */}
      <path d="M 0 0 L 520 0 L 0 420 Z" fill={wallD} />
      <path d="M 1920 0 L 1400 0 L 1920 420 Z" fill={wallD} />
      <line x1={520} y1={0} x2={0} y2={420} stroke={OL} strokeWidth={4} opacity={0.5} />
      <line x1={1400} y1={0} x2={1920} y2={420} stroke={OL} strokeWidth={4} opacity={0.5} />
      {/* round window */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g > 0.5 ? '#3a2a4a' : '#141830'} />
          <stop offset="1" stopColor={g > 0.5 ? '#b8704c' : '#242240'} />
        </linearGradient>
        <clipPath id="win">
          <circle cx={1330} cy={330} r={150} />
        </clipPath>
      </defs>
      <circle cx={1330} cy={330} r={150} fill="url(#sky)" />
      <g clipPath="url(#win)">
        {g > 0.5 ? <circle cx={1290} cy={400} r={40} fill="#ffc07a" /> : <circle cx={1380} cy={260} r={26} fill="#e9e6d8" />}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={1180 + i * 55} y={400 - (i % 3) * 30} width={50} height={140} fill={g > 0.5 ? '#3a2838' : '#1a1c30'} />
        ))}
        {g <= 0.5 && [0, 1, 2, 3, 4].map((i) => <rect key={i} x={1195 + i * 55} y={430 - (i % 3) * 30} width={10} height={12} fill={C.amberLight} />)}
      </g>
      <circle cx={1330} cy={330} r={150} fill="none" stroke="#5a3620" strokeWidth={18} />
      <line x1={1180} y1={330} x2={1480} y2={330} stroke="#5a3620" strokeWidth={9} />
      <line x1={1330} y1={180} x2={1330} y2={480} stroke="#5a3620" strokeWidth={9} />
      {/* sun shaft onto the floor */}
      {g > 0.5 && <path d="M 1220 420 L 1440 420 L 1180 1000 L 640 1000 Z" fill="#ffc98a" opacity={0.09 * g} />}
      {/* poster */}
      <rect x={180} y={430} width={150} height={200} fill="#e9dcc0" stroke={OL} strokeWidth={4} transform="rotate(-4 255 530)" />
      <path d="M 230 580 l 0 -90 l 50 -14 l 0 80" stroke="#6b4a8f" strokeWidth={9} fill="none" transform="rotate(-4 255 530)" />
      <circle cx={222} cy={584} r={14} fill="#6b4a8f" />
      <circle cx={272} cy={570} r={14} fill="#6b4a8f" />
      {/* floor */}
      <rect y={820} width={1920} height={260} fill={g > 0.5 ? '#3a2822' : '#262024'} />
      {[860, 920, 1000].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000033" strokeWidth={3} />)}
      {g > 0.5 && <ellipse cx={910} cy={950} rx={360} ry={50} fill="#ffc98a" opacity={0.1} />}
      {g > 0.5 && <Light id="winL" x={1330} y={420} r={620} color={C.amber} o={0.35 * g} />}
      {/* bed (left) */}
      <rect x={60} y={720} width={520} height={130} rx={20} fill="#3c4660" stroke={OL} strokeWidth={4} />
      <rect x={60} y={690} width={140} height={60} rx={22} fill="#efe6d2" stroke={OL} strokeWidth={4} />
      <rect x={60} y={840} width={520} height={30} fill="#4a3226" stroke={OL} strokeWidth={4} />
      {/* desk + lamp (right) */}
      <rect x={1520} y={700} width={360} height={24} fill="#6b4632" stroke={OL} strokeWidth={4} />
      <rect x={1540} y={724} width={22} height={140} fill="#4a3024" />
      <rect x={1840} y={724} width={22} height={140} fill="#4a3024" />
      <path d="M 1800 700 L 1800 600 L 1740 560" stroke="#2d3036" strokeWidth={10} fill="none" />
      <path d="M 1700 540 L 1770 530 L 1760 590 Z" fill="#c9653f" stroke={OL} strokeWidth={4} />
      {lamp > 0 && <Light id="lampL" x={1720} y={650} r={520} color={C.amber} o={0.9 * lamp} />}
      {lamp > 0 && <ellipse cx={1700} cy={705} rx={130} ry={12} fill={C.amberLight} opacity={0.5 * lamp} />}
      {/* drawer */}
      <rect x={1600} y={730} width={180} height={40} fill="#5a3a28" stroke={OL} strokeWidth={3} />
      <circle cx={1690} cy={750} r={6} fill="#c9a46a" />
      {/* plant */}
      <path d="M 640 760 q -40 -70 -10 -130 M 660 760 q 10 -90 50 -120 M 650 760 q -60 -40 -90 -40" stroke="#4f7a4a" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 612 760 L 692 760 L 682 840 L 622 840 Z" fill="#c26a44" stroke={OL} strokeWidth={4} />
      {/* guitar leaning in the corner */}
      {guitarInCorner && (
        <g transform="translate(1420 840) rotate(-12)">
          <rect x={-12} y={-330} width={24} height={200} rx={4} fill="#7a4a2a" stroke={OL} strokeWidth={3.5} />
          <rect x={-18} y={-370} width={36} height={46} rx={8} fill="#5a341c" stroke={OL} strokeWidth={3.5} />
          <path d="M 0 -150 C -70 -150 -80 -90 -60 -70 C -90 -40 -80 0 0 0 C 80 0 90 -40 60 -70 C 80 -90 70 -150 0 -150 Z" fill="#d8954a" stroke={OL} strokeWidth={3.5} />
          <circle cx={0} cy={-85} r={18} fill="#3a2414" />
          {dust > 0 && <path d="M -60 -70 C -90 -40 -80 0 0 0 C 80 0 90 -40 60 -70 Z" fill="#9a9590" opacity={0.45 * dust} />}
        </g>
      )}
      {phoneGlow > 0 && <Light id="phL" x={330} y={700} r={500} color={PURPLE} o={phoneGlow} />}
      {/* dust motes in the light */}
      {g > 0.5 &&
        Array.from({length: 18}, (_, i) => (
          <circle key={i} cx={900 + ((i * 97 + t * 14) % 500) - 120} cy={500 + ((i * 53 + t * 9 * (i % 3 + 1)) % 450)} r={2.5} fill="#fff1c9" opacity={0.6} />
        ))}
    </g>
  );
};

/** Stool he sits on (draw before the hero). */
export const Stool: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    <ellipse cx={x} cy={y + 150} rx={110} ry={16} fill="#000" opacity={0.25} />
    <line x1={x - 50} y1={y} x2={x - 70} y2={y + 150} stroke="#4a3024" strokeWidth={14} strokeLinecap="round" />
    <line x1={x + 50} y1={y} x2={x + 70} y2={y + 150} stroke="#4a3024" strokeWidth={14} strokeLinecap="round" />
    <rect x={x - 80} y={y - 14} width={160} height={24} rx={8} fill="#6b4632" stroke={OL} strokeWidth={4} />
  </g>
);

/* ------------------------------------------------------------------ */
/** (B) The street outside The Lantern. dusk 1 = purple-orange evening, 0 = deep night. */
export const Street: React.FC<{t: number; dusk?: number; rain?: number; poster?: boolean; doorOpen?: number; clap?: number}> = ({t, dusk = 1, rain = 0, poster = true, doorOpen = 0, clap = 0}) => {
  const night = 1 - dusk;
  return (
    <g>
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night > 0.5 ? '#10132a' : '#1c1832'} />
          <stop offset="1" stopColor={night > 0.5 ? '#232240' : '#553648'} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#dusk)" />
      {/* far skyline */}
      {Array.from({length: 14}, (_, i) => {
        const h = 200 + ((i * 73) % 160);
        return (
          <g key={i}>
            <rect x={i * 145 - 20} y={560 - h} width={130} height={h + 40} fill={night > 0.5 ? '#1a1d34' : '#272240'} />
            {Array.from({length: 6}, (_, k) => (
              <rect key={k} x={i * 145 + (k % 3) * 36} y={580 - h + 30 + Math.floor(k / 3) * 50} width={14} height={18} fill={C.amberLight} opacity={(i + k) % 3 === 0 ? 0.85 : 0.15} />
            ))}
          </g>
        );
      })}
      {/* café facade */}
      <rect x={640} y={250} width={980} height={600} fill="#6a3f30" stroke={OL} strokeWidth={5} />
      {Array.from({length: 14}, (_, r) => (
        <line key={r} x1={640} y1={250 + r * 42} x2={1620} y2={250 + r * 42} stroke="#5a3428" strokeWidth={3} />
      ))}
      <rect x={640} y={250} width={980} height={70} fill="#3a2422" />
      <text x={1130} y={302} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={48} fill={C.amberLight} letterSpacing={8} style={{filter: 'drop-shadow(0 0 10px #f2c27a)'}}>
        THE LANTERN
      </text>
      {/* big window with warm inside */}
      <rect x={690} y={380} width={440} height={330} fill="#f2c27a" stroke="#2e1e18" strokeWidth={12} />
      <rect x={690} y={380} width={440} height={330} fill="#e9a94f" opacity={0.5} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.55} transform={`translate(0 ${-Math.abs(Math.sin(t * 7 + i * 1.3)) * 14 * clap})`}>
          <circle cx={760 + i * 140} cy={600} r={34} fill="#6a3f30" />
          <rect x={726 + i * 140} y={630} width={68} height={80} rx={26} fill="#6a3f30" />
        </g>
      ))}
      <line x1={910} y1={380} x2={910} y2={710} stroke="#2e1e18" strokeWidth={8} />
      {/* door */}
      <rect x={1190} y={400} width={190} height={450} fill="#2a1a16" stroke={OL} strokeWidth={5} />
      <g transform={`translate(1190 0) scale(${1 - doorOpen * 0.75} 1) translate(-1190 0)`}>
        <rect x={1190} y={400} width={190} height={450} fill="#7a4a2a" stroke={OL} strokeWidth={5} />
        <rect x={1220} y={430} width={130} height={150} fill="#f2c27a" stroke="#2e1e18" strokeWidth={6} />
        <circle cx={1355} cy={720} r={10} fill="#d9b36a" stroke={OL} strokeWidth={3} />
      </g>
      {doorOpen > 0 && <path d={`M 1380 850 L 1380 400 L ${1190 + 190 * (1 - doorOpen * 0.75)} 400 L ${1190 + 190 * (1 - doorOpen * 0.75)} 850 Z`} fill="#f2c27a" opacity={0.9 * doorOpen} />}
      {doorOpen > 0 && <Light id="doorL" x={1290} y={760} r={500} color={C.amber} o={doorOpen} />}
      {/* shadow by the door where the Blob lives */}
      <ellipse cx={1160} cy={860} rx={120} ry={24} fill="#0d0a14" opacity={0.55} />
      {/* poster */}
      {poster && (
        <g transform="rotate(2 1500 560)">
          <rect x={1420} y={440} width={170} height={240} fill="#efe4cf" stroke={OL} strokeWidth={4} />
          <text x={1505} y={505} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={40} fill={PURPLE}>OPEN</text>
          <text x={1505} y={552} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={40} fill={PURPLE}>MIC</text>
          <text x={1505} y={600} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={26} fill={OL}>TONIGHT</text>
          <path d="M 1480 650 l 0 -26 l 30 -6 l 0 22" stroke={OL} strokeWidth={4} fill="none" />
          <circle cx={1476} cy={652} r={6} fill={OL} />
          <circle cx={1506} cy={646} r={6} fill={OL} />
        </g>
      )}
      {/* window glow onto the sidewalk */}
      <path d="M 690 850 L 1130 850 L 1220 960 L 600 960 Z" fill={C.amberLight} opacity={0.22} />
      {/* sidewalk + road */}
      <rect y={850} width={1920} height={110} fill={night > 0.5 ? '#302f3c' : '#3a3542'} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} y1={850} x2={i * 180 - 40} y2={960} stroke="#00000030" strokeWidth={3} />)}
      <rect y={958} width={1920} height={16} fill="#8c8496" />
      <rect y={974} width={1920} height={106} fill={night > 0.5 ? '#1a1a22' : '#211f28'} />
      {Array.from({length: 8}, (_, i) => <rect key={i} x={i * 280 + 40} y={1022} width={140} height={10} fill="#d9cfa8" opacity={0.5} />)}
      {/* street lamp (left) */}
      <rect x={380} y={330} width={16} height={530} fill="#2a2c34" stroke={OL} strokeWidth={3} />
      <path d="M 388 340 Q 388 290 450 290 L 470 290" stroke="#2a2c34" strokeWidth={14} fill="none" />
      <path d="M 440 290 L 500 290 L 490 320 L 450 320 Z" fill="#2a2c34" />
      <ellipse cx={470} cy={322} rx={20} ry={8} fill="#fff1c9" />
      <path d="M 452 322 L 488 322 L 640 900 L 300 900 Z" fill="#fff1c9" opacity={0.13} />
      <Light id="lampSt" x={470} y={600} r={460} color="#ffe3a6" o={0.6} />
      <ellipse cx={470} cy={900} rx={220} ry={30} fill="#fff1c9" opacity={0.25} />
      {rain > 0 && <Rain t={t} o={rain} />}
      {rain > 0 && <rect width={1920} height={1080} fill="#1a2040" opacity={0.25 * rain} />}
    </g>
  );
};

/** The token: yellow guitar pick on a cord, drawn over the hero (same x/y/scale as the Hero). */
export const PickNecklace: React.FC<{x: number; y: number; scale: number; o?: number; sit?: boolean}> = ({x, y, scale, o = 1, sit = false}) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) translate(0 ${sit ? -27 : -97})`} opacity={o}>
    <path d="M -46 -236 Q 0 -196 46 -236" stroke="#3a2a20" strokeWidth={3.5} fill="none" />
    <path d="M -15 -214 L 15 -214 Q 14 -190 0 -178 Q -14 -190 -15 -214 Z" fill="#f2c94c" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** (D) The Mind Stage: a round platform in a spotlight inside an amphitheatre of Blob faces. */
export const MindStage: React.FC<{t: number; spot?: number; faces?: number; melt?: number; laugh?: number}> = ({t, spot = 1, faces = 1, melt = 0, laugh = 1}) => {
  const rows = [
    {y: 210, n: 15, r: 26},
    {y: 300, n: 13, r: 30},
    {y: 400, n: 11, r: 34},
    {y: 510, n: 9, r: 40},
  ];
  let idx = 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0f0d17" />
      {rows.map((row, ri) => (
        <path key={ri} d={`M -40 ${row.y + row.r + 20} Q 960 ${row.y - 60} 1960 ${row.y + row.r + 20} L 1960 ${row.y + row.r + 60} Q 960 ${row.y - 20} -40 ${row.y + row.r + 60} Z`} fill="#1a1626" />
      ))}
      {rows.map((row, ri) =>
        Array.from({length: row.n}, (_, i) => {
          const k = idx++;
          const visible = k / 48 < faces;
          if (!visible) return null;
          const u = (i + 0.5) / row.n;
          const x = u * 1920;
          const y = row.y + Math.pow(Math.abs(u - 0.5) * 2, 2) * 70;
          const m = Math.min(1, Math.max(0, melt * 2.2 - (k % 7) * 0.18));
          const sway = Math.sin(t * 3 + k) * 4 * laugh;
          const yawn = Math.max(0, Math.sin(t * 1.3 + k * 0.7)) * laugh;
          return (
            <g key={k} transform={`translate(${x + sway} ${y + m * row.r}) scale(1 ${1 - m * 0.7})`} opacity={1 - m * 0.6}>
              <ellipse cx={0} cy={row.r * 0.9} rx={row.r * 1.3} ry={row.r * 0.5} fill={BLOB_BODY} />
              <circle r={row.r} fill={BLOB_BODY} stroke="#0a0910" strokeWidth={3} />
              <rect x={-row.r * 0.55} y={-row.r * 0.2} width={row.r * 0.34} height={row.r * 0.14} rx={3} fill={PURPLE} />
              <rect x={row.r * 0.21} y={-row.r * 0.2} width={row.r * 0.34} height={row.r * 0.14} rx={3} fill={PURPLE} />
              {yawn > 0.6 ? (
                <ellipse cx={0} cy={row.r * 0.4} rx={row.r * 0.2} ry={row.r * 0.22 * yawn} fill="#0a0910" />
              ) : (
                <path d={`M ${-row.r * 0.35} ${row.r * 0.35} Q 0 ${row.r * 0.6} ${row.r * 0.35} ${row.r * 0.3}`} stroke="#0a0910" strokeWidth={3} fill="none" />
              )}
            </g>
          );
        }),
      )}
      {/* purple haze over the crowd */}
      <rect width={1920} height={640} fill={PURPLE} opacity={0.06} />
      {/* platform */}
      <ellipse cx={960} cy={900} rx={520} ry={90} fill="#221d30" stroke="#0a0910" strokeWidth={5} />
      <rect x={440} y={900} width={1040} height={180} fill="#191523" />
      <ellipse cx={960} cy={900} rx={520} ry={90} fill="none" stroke="#2e2840" strokeWidth={4} />
      {/* spotlight */}
      <defs>
        <linearGradient id="mcone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3d6" stopOpacity={0.03} />
          <stop offset="1" stopColor="#fff3d6" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <path d="M 930 0 L 990 0 L 1160 900 L 760 900 Z" fill="url(#mcone)" opacity={spot} />
      <ellipse cx={960} cy={900} rx={200} ry={34} fill="#fff3d6" opacity={0.4 * spot} />
    </g>
  );
};
const BLOB_BODY = '#1c1618';

/** Big purple words floating inside the scene (the inner voice as visuals). */
export const BigWord: React.FC<{text: string; x: number; y: number; size?: number; o?: number; rot?: number; crack?: number}> = ({text, x, y, size = 130, o = 1, rot = 0, crack = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <text textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={size} fill={PURPLE} stroke="#1b1a22" strokeWidth={6} paintOrder="stroke" letterSpacing={4} style={{filter: `drop-shadow(0 0 18px ${PURPLE})`}}>
      {text}
    </text>
    {crack > 0 && (
      <path d={`M ${-size * 2} ${-size * 0.4} l ${size * 0.6} ${size * 0.3} l ${size * 0.4} ${-size * 0.25} l ${size * 0.7} ${size * 0.35} l ${size * 0.5} ${-size * 0.3} l ${size * 0.8} ${size * 0.2}`} stroke="#f7f0ff" strokeWidth={6} fill="none" opacity={crack} />
    )}
  </g>
);
