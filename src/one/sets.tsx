import React from 'react';
import {Light} from '../common/sets';
import {C} from '../common/theme';
import {WallClock} from '../rest/sets';

/* ONE MORE VIDEO - sets in the DEFAULT look: near-black rooms, thin soft grey line-art, dark fills,
   light only from the phone / a lamp / the street. Accent = dark yellow. */
export const YEL = '#E8A317';
export const YEL_L = '#ffc94a';
export const GREY = '#9a9da3';
export const TAN = C.tan;
const LN = '#55525e'; // line-art grey
const FILL = '#16151b'; // dark fill
const BG = '#0d0c11';
export const FLOOR_Y = 880;

export const FRIEND = {color: GREY, accessory: 'cap' as const, accessoryColor: '#2f6a8a', jacket: '#2e3442'};
export const FRIEND2 = {color: TAN, accessory: 'headband' as const, accessoryColor: '#8a3b3b', jacket: '#3a3040'};
export const FRIEND3 = {color: GREY, accessory: 'glasses' as const, jacket: '#3a4a3a'};
export const GIRL = {color: TAN, accessory: 'longhair' as const, accessoryColor: '#5a3a26', jacket: '#4a3a5a'};
export const TEACHER = {color: GREY, accessory: 'glasses' as const, jacket: '#3a3a44'};

const L: React.FC<{d: string; w?: number; fill?: string}> = ({d, w = 3, fill = FILL}) => <path d={d} fill={fill} stroke={LN} strokeWidth={w} strokeLinejoin="round" />;

/* ---------------------------------------------------------- (A) HIS BEDROOM */
export const Room: React.FC<{t: number; time?: string; door?: number; lamp?: number; moon?: boolean; phoneOnTable?: number; drawerOpen?: number}> = ({
  t, time = '23:00', door = 0, lamp = 0, moon = true, phoneOnTable = 0, drawerOpen = 0,
}) => (
  <g>
    <rect width={1920} height={1080} fill={BG} />
    {/* window */}
    <rect x={1180} y={220} width={300} height={260} fill="#11152a" stroke={LN} strokeWidth={4} />
    <line x1={1330} y1={220} x2={1330} y2={480} stroke={LN} strokeWidth={4} />
    <line x1={1180} y1={350} x2={1480} y2={350} stroke={LN} strokeWidth={4} />
    {moon && <circle cx={1410} cy={280} r={22} fill="#e8e4d0" opacity={0.9} />}
    <Light id="winL" x={1330} y={400} r={420} color="#8fa8d8" o={0.18} />
    {/* wall clock */}
    <g opacity={0.9}><WallClock x={880} y={250} time={time} r={46} /></g>
    {/* door (right) - opens inward, warm hall light behind */}
    <rect x={1620} y={430} width={200} height={450} fill={door > 0 ? '#e9b56a' : FILL} stroke={LN} strokeWidth={4} />
    {door > 0 && <Light id="doorL" x={1720} y={700} r={500} color={C.amber} o={0.55 * door} />}
    <path d={`M 1620 430 L ${1620 + 200 * (1 - door * 0.8)} ${430 + door * 30} L ${1620 + 200 * (1 - door * 0.8)} ${880 - door * 30} L 1620 880 Z`} fill={FILL} stroke={LN} strokeWidth={4} />
    <circle cx={1620 + 180 * (1 - door * 0.8)} cy={660} r={7} fill={LN} />
    {/* bed (left) */}
    <L d="M 220 560 L 250 560 L 250 880 L 220 880 Z" />
    <L d="M 250 700 L 900 700 L 900 790 L 250 790 Z" />
    <L d="M 270 670 Q 280 640 380 645 Q 420 650 420 690 L 270 700 Z" fill="#1f1e26" />
    <L d="M 520 690 Q 700 670 900 700 L 900 760 L 520 760 Z" fill="#1c2236" />
    <L d="M 870 790 L 890 790 L 890 880 L 870 880 Z" />
    {/* nightstand + drawer */}
    <L d="M 960 740 L 1120 740 L 1120 880 L 960 880 Z" />
    <L d={`M 972 ${760 + drawerOpen * 30} L 1108 ${760 + drawerOpen * 30} L 1108 ${808 + drawerOpen * 30} L 972 ${808 + drawerOpen * 30} Z`} fill="#1b1a21" />
    <circle cx={1040} cy={784 + drawerOpen * 30} r={5} fill={LN} />
    {/* small lamp on the nightstand */}
    <path d="M 1010 740 L 1010 700 M 990 700 L 1030 700 L 1020 670 L 1000 670 Z" stroke={LN} strokeWidth={3} fill={lamp > 0 ? '#e9b56a' : FILL} />
    {lamp > 0 && <Light id="lampL" x={1010} y={700} r={420} color={C.amber} o={0.6 * lamp} />}
    {phoneOnTable > 0 && (
      <g>
        <rect x={1050} y={728} width={52} height={12} rx={3} fill="#0a0a0d" stroke={LN} strokeWidth={2} />
        <Light id="ptL" x={1076} y={700} r={300} color={YEL} o={0.8 * phoneOnTable} />
      </g>
    )}
    {/* floor line */}
    <line x1={0} y1={FLOOR_Y} x2={1920} y2={FLOOR_Y} stroke={LN} strokeWidth={3} />
  </g>
);

/** The blanket lump on the bed (he hides under it). hand = 0..1 his mitten reaching out to the phone */
export const Blanket: React.FC<{t: number; hand?: number}> = ({t, hand = 0}) => {
  const br = Math.sin(t * 1.4) * 3;
  return (
    <g>
      <path d={`M 300 700 Q 330 ${600 - br} 480 ${595 - br} Q 700 ${610 - br} 860 640 Q 900 660 900 700 Z`} fill="#26304a" stroke={LN} strokeWidth={4} />
      <path d="M 420 640 Q 560 660 700 640 M 480 670 Q 620 690 760 668" stroke="#1a2236" strokeWidth={4} fill="none" />
      {hand > 0 && (
        <g>
          <path d={`M 860 660 L ${860 + hand * 180} ${660 + hand * 60}`} stroke={C.outline} strokeWidth={40} strokeLinecap="round" />
          <path d={`M 860 660 L ${860 + hand * 180} ${660 + hand * 60}`} stroke={C.cream} strokeWidth={33} strokeLinecap="round" />
          <ellipse cx={860 + hand * 190} cy={664 + hand * 62} rx={20} ry={22} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />
        </g>
      )}
    </g>
  );
};

/* ---------------------------------------------------------- (B) THE STREET (outside his window) */
export const STREET_Y = 900;
export const Street: React.FC<{t: number; dusk?: number; lamp?: number}> = ({t, dusk = 0, lamp = 1}) => (
  <g>
    <rect width={1920} height={1080} fill={BG} />
    <defs>
      <linearGradient id="stsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f1020" />
        <stop offset="1" stopColor={dusk ? '#3a2a3a' : '#171a2c'} />
      </linearGradient>
    </defs>
    <rect width={1920} height={560} fill="url(#stsky)" />
    {/* houses: line-art with a few warm windows */}
    {[[60, 330, 300], [420, 300, 260], [760, 360, 340], [1180, 320, 280], [1520, 280, 360]].map(([x, y, w], i) => (
      <g key={i}>
        <L d={`M ${x} ${y} L ${x + w / 2} ${y - 90} L ${x + w} ${y} L ${x + w} 700 L ${x} 700 Z`} />
        {[0, 1].map((k) => <rect key={k} x={x + 40 + k * (w - 120)} y={y + 70} width={44} height={54} fill={(i + k) % 3 === 0 ? C.amberLight : '#1d1c24'} opacity={(i + k) % 3 === 0 ? 0.75 : 1} stroke={LN} strokeWidth={2} />)}
      </g>
    ))}
    {/* fence */}
    <line x1={0} y1={760} x2={1920} y2={760} stroke={LN} strokeWidth={3} />
    {Array.from({length: 40}, (_, i) => <line key={i} x1={i * 50} y1={760} x2={i * 50} y2={840} stroke={LN} strokeWidth={2} />)}
    <line x1={0} y1={800} x2={1920} y2={800} stroke={LN} strokeWidth={2} />
    {/* street lamps */}
    {[520, 1400].map((x) => (
      <g key={x}>
        <line x1={x} y1={340} x2={x} y2={STREET_Y} stroke={LN} strokeWidth={6} />
        <rect x={x - 26} y={326} width={52} height={14} rx={5} fill="#f2e2b8" opacity={lamp} />
        <path d={`M ${x - 20} 340 L ${x + 20} 340 L ${x + 240} ${STREET_Y} L ${x - 240} ${STREET_Y} Z`} fill="#f2e2b8" opacity={0.05 * lamp} />
        <Light id={`sl${x}`} x={x} y={620} r={520} color={C.amberLight} o={0.45 * lamp} />
        <ellipse cx={x} cy={STREET_Y + 20} rx={260} ry={26} fill={C.amberLight} opacity={0.07 * lamp} />
      </g>
    ))}
    <line x1={0} y1={STREET_Y} x2={1920} y2={STREET_Y} stroke={LN} strokeWidth={3} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={140 + i * 400} y={980} width={150} height={8} fill={LN} opacity={0.6} />)}
  </g>
);

export const Ball: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 20}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#e8e4d8" stroke={C.outline} strokeWidth={3} />
    <path d={`M ${x - r * 0.4} ${y - r * 0.3} l ${r * 0.4} ${-r * 0.25} l ${r * 0.4} ${r * 0.25} l -${r * 0.15} ${r * 0.45} h -${r * 0.5} z`} fill={C.outline} />
  </g>
);

/* ---------------------------------------------------------- (C) UNI HALLWAY */
export const UNI_Y = 880;
export const UniHall: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill={BG} />
    {/* tall windows with morning light */}
    {[140, 620, 1100, 1580].map((x) => (
      <g key={x}>
        <rect x={x} y={160} width={200} height={420} fill="#1b2034" stroke={LN} strokeWidth={4} />
        <line x1={x + 100} y1={160} x2={x + 100} y2={580} stroke={LN} strokeWidth={3} />
        <path d={`M ${x} 580 L ${x + 200} 580 L ${x + 330} ${UNI_Y} L ${x + 70} ${UNI_Y} Z`} fill="#c9d4f0" opacity={0.05} />
        <Light id={`uw${x}`} x={x + 100} y={380} r={360} color="#c9d4f0" o={0.2} />
      </g>
    ))}
    {/* pillars + notice board */}
    {[480, 960, 1440].map((x) => <L key={x} d={`M ${x - 30} 120 L ${x + 30} 120 L ${x + 30} ${UNI_Y} L ${x - 30} ${UNI_Y} Z`} />)}
    <L d="M 1290 300 L 1420 300 L 1420 420 L 1290 420 Z" fill="#2a2620" />
    {[0, 1, 2].map((i) => <rect key={i} x={1300 + i * 40} y={315 + (i % 2) * 20} width={30} height={40} fill="#d8d0c0" opacity={0.6} />)}
    <line x1={0} y1={UNI_Y} x2={1920} y2={UNI_Y} stroke={LN} strokeWidth={3} />
    {[930, 990].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke={LN} strokeWidth={1.5} opacity={0.5} />)}
  </g>
);

/* ---------------------------------------------------------- (D) CLASSROOM */
export const CLASS_Y = 880;
export const Classroom: React.FC<{t: number; board?: string}> = ({t, board = 'f(x) = 2x + 3'}) => (
  <g>
    <rect width={1920} height={1080} fill={BG} />
    <rect x={560} y={170} width={800} height={340} fill="#16261e" stroke={LN} strokeWidth={6} />
    <text x={960} y={360} textAnchor="middle" fontFamily="Patrick Hand" fontSize={70} fill="#d8dccf" opacity={0.85}>{board}</text>
    <Light id="clL" x={960} y={120} r={900} color="#e9e2cf" o={0.25} />
    <rect x={900} y={90} width={120} height={12} rx={4} fill="#efe6cf" />
    {/* window strip */}
    <rect x={1500} y={200} width={320} height={300} fill="#1b2034" stroke={LN} strokeWidth={4} />
    <line x1={1660} y1={200} x2={1660} y2={500} stroke={LN} strokeWidth={3} />
    <line x1={0} y1={CLASS_Y} x2={1920} y2={CLASS_Y} stroke={LN} strokeWidth={3} />
  </g>
);

/** A student desk (draw AFTER the seated student) */
export const SchoolDesk: React.FC<{x: number; y?: number}> = ({x, y = 690}) => (
  <g>
    <L d={`M ${x - 110} ${y} L ${x + 110} ${y} L ${x + 110} ${y + 18} L ${x - 110} ${y + 18} Z`} fill="#24222a" />
    <line x1={x - 96} y1={y + 18} x2={x - 96} y2={CLASS_Y} stroke={LN} strokeWidth={4} />
    <line x1={x + 96} y1={y + 18} x2={x + 96} y2={CLASS_Y} stroke={LN} strokeWidth={4} />
  </g>
);

/** Chair back (draw BEFORE the seated person) */
export const SchoolChair: React.FC<{x: number}> = ({x}) => (
  <g>
    <L d={`M ${x - 60} 560 L ${x + 60} 560 L ${x + 60} 730 L ${x - 60} 730 Z`} fill="#1b1a20" />
    <line x1={x - 50} y1={730} x2={x - 50} y2={CLASS_Y} stroke={LN} strokeWidth={4} />
    <line x1={x + 50} y1={730} x2={x + 50} y2={CLASS_Y} stroke={LN} strokeWidth={4} />
  </g>
);

/* ---------------------------------------------------------- (E) ROAD AT NIGHT (running) */
export const Road: React.FC<{t: number; scroll?: number}> = ({t, scroll = 0}) => (
  <g>
    <rect width={1920} height={1080} fill={BG} />
    <rect width={1920} height={600} fill="#0f1020" />
    {Array.from({length: 7}, (_, i) => {
      const x = ((i * 360 - scroll) % 2520 + 2520) % 2520 - 300;
      return (
        <g key={i}>
          <line x1={x} y1={330} x2={x} y2={880} stroke={LN} strokeWidth={6} />
          <rect x={x - 24} y={318} width={48} height={14} rx={5} fill="#f2e2b8" />
          <Light id={`rl${i}`} x={x} y={620} r={420} color={C.amberLight} o={0.4} />
          <ellipse cx={x} cy={900} rx={220} ry={22} fill={C.amberLight} opacity={0.07} />
        </g>
      );
    })}
    <line x1={0} y1={880} x2={1920} y2={880} stroke={LN} strokeWidth={3} />
    {Array.from({length: 8}, (_, i) => {
      const x = ((i * 300 - scroll * 1.2) % 2400 + 2400) % 2400 - 200;
      return <rect key={i} x={x} y={970} width={140} height={8} fill={LN} opacity={0.6} />;
    })}
  </g>
);

/* ---------------------------------------------------------- PHONE POV: blurred dark-yellow tiles (nothing visible) */
export const PhonePOV: React.FC<{t: number; seed?: number; dark?: boolean; reflect?: React.ReactNode}> = ({t, seed = 0, dark = false, reflect}) => (
  <g>
    <rect width={1920} height={1080} fill="#08070a" />
    {!dark && <Light id="ppl" x={960} y={540} r={760} color={YEL} o={0.45} />}
    <defs>
      <filter id="tileBlur"><feGaussianBlur stdDeviation="16" /></filter>
      <clipPath id="scr"><rect x={724} y={110} width={472} height={860} rx={40} /></clipPath>
    </defs>
    <rect x={700} y={80} width={520} height={920} rx={56} fill="#0a0a0d" stroke="#2a2a30" strokeWidth={6} />
    {dark ? (
      <g clipPath="url(#scr)">
        <rect x={724} y={110} width={472} height={860} fill="#050506" />
        {reflect}
      </g>
    ) : (
      <g clipPath="url(#scr)">
        <rect x={724} y={110} width={472} height={860} fill="#1a1408" />
        <g filter="url(#tileBlur)">
          {Array.from({length: 8}, (_, i) => {
            const k = (i + seed) % 5;
            return <rect key={i} x={744 + (i % 2) * 222} y={140 + Math.floor(i / 2) * 200 - ((t * 60) % 200)} width={208} height={180} rx={14}
              fill={[YEL, '#b8741a', '#5a3a14', YEL_L, '#8a5a1a'][k]} opacity={0.85} />;
          })}
        </g>
        <rect x={744} y={900} width={432} height={8} rx={4} fill="#3a2a10" />
        <rect x={744} y={900} width={(t * 90) % 432} height={8} rx={4} fill={YEL} />
        <circle cx={1150} cy={150} r={22} fill="none" stroke={YEL} strokeWidth={5} />
        <path d="M 1143 140 L 1160 150 L 1143 160 Z" fill={YEL} />
      </g>
    )}
  </g>
);

/** A thought cloud above a head with flickering blurred tiles inside. */
export const TileCloud: React.FC<{x: number; y: number; t: number; s?: number; o?: number}> = ({x, y, t, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <defs><filter id="cb"><feGaussianBlur stdDeviation="6" /></filter></defs>
    <circle cx={-120} cy={140} r={12} fill="#2a2830" stroke={LN} strokeWidth={2} />
    <circle cx={-90} cy={100} r={18} fill="#2a2830" stroke={LN} strokeWidth={2} />
    <path d="M -200 40 C -230 -40 -120 -80 -60 -50 C -20 -110 120 -100 140 -40 C 220 -40 220 60 150 70 C 120 110 -20 110 -60 80 C -140 110 -230 90 -200 40 Z" fill="#1e1c24" stroke={LN} strokeWidth={3} />
    <g filter="url(#cb)">
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-150 + i * 70} y={-40 + Math.sin(t * 6 + i) * 6} width={56} height={70} rx={8} fill={[YEL, '#b8741a', YEL_L, '#8a5a1a'][(i + Math.floor(t * 3)) % 4]} />)}
    </g>
  </g>
);
