import React from 'react';
import {C, H, W} from '../common/theme';
import {FLOOR, Light} from '../common/sets';
import {Backpack} from './canteen';

/* Classroom: blackboard, rows of desks seen from the front */
export const Classroom: React.FC<{children?: React.ReactNode; front?: React.ReactNode}> = ({children, front}) => (
  <g>
    <rect width={W} height={H} fill="#111315" />
    <rect x={360} y={150} width={1200} height={300} rx={8} fill="#18241e" stroke={C.line} strokeWidth={6} />
    <path d="M 420 230 q 60 -30 120 0 t 120 0 M 420 300 l 300 0 M 420 360 l 200 0" stroke="#cfd8c8" strokeWidth={4} fill="none" opacity={0.5} />
    <text x={1300} y={260} fontFamily="Patrick Hand" fontSize={60} fill="#cfd8c8" opacity={0.5}>
      E = mc²
    </text>
    <Light id="clw" x={960} y={300} r={900} color="#cfd8c8" o={0.25} />
    {children}
    {[360, 960, 1560].map((x) => (
      <g key={x}>
        <rect x={x - 200} y={700} width={400} height={20} rx={5} fill="#1b1d22" stroke={C.line} strokeWidth={3} />
        <line x1={x - 180} y1={720} x2={x - 180} y2={FLOOR} stroke={C.line} strokeWidth={5} />
        <line x1={x + 180} y1={720} x2={x + 180} y2={FLOOR} stroke={C.line} strokeWidth={5} />
      </g>
    ))}
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* Library: tall shelves, green reading lamps, long table */
export const Library: React.FC<{children?: React.ReactNode; front?: React.ReactNode}> = ({children, front}) => (
  <g>
    <rect width={W} height={H} fill="#13110f" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={80 + i * 370} y={120} width={330} height={560} fill="#17140f" stroke={C.line} strokeWidth={4} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <line x1={80 + i * 370} y1={250 + r * 120} x2={410 + i * 370} y2={250 + r * 120} stroke={C.line} strokeWidth={4} />
            {Array.from({length: 9}, (_, k) => (
              <rect key={k} x={92 + i * 370 + k * 35} y={160 + r * 120 + (k % 3) * 6} width={26} height={88 - (k % 3) * 6} fill={['#3a2a22', '#22303a', '#2e3a22', '#3a3322'][(k + r + i) % 4]} stroke={C.lineSoft} strokeWidth={2} />
            ))}
          </g>
        ))}
      </g>
    ))}
    <Light id="lbw" x={960} y={600} r={900} color={C.amber} o={0.6} />
    {children}
    <rect x={300} y={700} width={1320} height={22} rx={6} fill="#1d1a16" stroke={C.line} strokeWidth={3} />
    {[620, 1300].map((x) => (
      <g key={x}>
        <line x1={x} y1={700} x2={x} y2={630} stroke={C.line} strokeWidth={4} />
        <path d={`M ${x - 50} 640 Q ${x} 590 ${x + 50} 640 Z`} fill="#2f5a40" stroke={C.outline} strokeWidth={3} />
        <ellipse cx={x} cy={644} rx={40} ry={7} fill={C.amberLight} opacity={0.8} />
      </g>
    ))}
    <line x1={340} y1={722} x2={340} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    <line x1={1580} y1={722} x2={1580} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* Football ground: sky, goal posts, grass line */
export const Field: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <g>
    <defs>
      <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#24324a" />
        <stop offset="1" stopColor="#6e86a6" />
      </linearGradient>
    </defs>
    <rect width={W} height={620} fill="url(#fsky)" />
    <rect x={0} y={620} width={W} height={H - 620} fill="#18221a" />
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={0} y1={660 + i * 60} x2={W} y2={660 + i * 60} stroke="#22301f" strokeWidth={3} />
    ))}
    <g stroke="#d8dde6" strokeWidth={8} fill="none">
      <path d="M 1380 760 L 1380 520 L 1760 520 L 1760 760" />
    </g>
    <g stroke="#d8dde6" strokeWidth={2} opacity={0.3}>
      {Array.from({length: 8}, (_, i) => (
        <line key={i} x1={1380 + i * 54} y1={520} x2={1400 + i * 50} y2={740} />
      ))}
    </g>
    <circle cx={260} cy={170} r={60} fill="#f2e6c4" opacity={0.6} />
    {children}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke="#2a3a28" strokeWidth={3} />
  </g>
);

/* His dorm room: bunk bed, poster with the competition date, desk with the bridge model */
export const Dorm: React.FC<{t: number; night?: number; morning?: number; children?: React.ReactNode; front?: React.ReactNode; moonX?: number}> = ({t, night = 0, morning = 0, children, front, moonX}) => (
  <g>
    <rect width={W} height={H} fill="#121316" />
    {/* window (right) */}
    <rect x={1460} y={200} width={300} height={320} fill={morning ? '#e9c58a' : night ? '#0a1222' : '#3a3550'} stroke={C.line} strokeWidth={5} />
    <line x1={1610} y1={200} x2={1610} y2={520} stroke={C.line} strokeWidth={5} />
    {night > 0 && moonX !== undefined && <circle cx={moonX} cy={280} r={30} fill="#e9e6da" opacity={0.9} />}
    {morning > 0 && <Light id="dmorn" x={1610} y={360} r={900} color={C.amber} o={morning} />}
    {/* bunk bed (left) */}
    <rect x={120} y={260} width={420} height={40} rx={8} fill="#1a1e25" stroke={C.line} strokeWidth={4} />
    <rect x={120} y={600} width={420} height={50} rx={8} fill="#1a1e25" stroke={C.line} strokeWidth={4} />
    <line x1={130} y1={200} x2={130} y2={FLOOR} stroke={C.line} strokeWidth={6} />
    <line x1={530} y1={200} x2={530} y2={FLOOR} stroke={C.line} strokeWidth={6} />
    {/* poster: the competition */}
    <rect x={720} y={180} width={260} height={300} fill="#1e1a14" stroke={C.amber} strokeWidth={4} />
    <path d="M 750 400 Q 850 300 950 400" stroke={C.amberLight} strokeWidth={5} fill="none" />
    <line x1={750} y1={400} x2={950} y2={400} stroke={C.amberLight} strokeWidth={5} />
    {[790, 850, 910].map((x) => (
      <line key={x} x1={x} y1={400} x2={x} y2={355 - (x === 850 ? 20 : 0)} stroke={C.amberLight} strokeWidth={3} />
    ))}
    <text x={850} y={240} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={C.amberLight}>
      DESIGN
    </text>
    <text x={850} y={455} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={24} fill={C.cream} opacity={0.8}>
      FRI · 10:00
    </text>
    {night > 0 && <rect width={W} height={H} fill="#060810" opacity={night * 0.45} />}
    {children}
    {/* desk */}
    <rect x={700} y={700} width={720} height={22} rx={5} fill="#1b1d22" stroke={C.line} strokeWidth={3} />
    {front}
    <line x1={720} y1={722} x2={720} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    <line x1={1400} y1={722} x2={1400} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* The bridge model: sticks on a base. built 0..1, broken = one support snapped */
export const BridgeModel: React.FC<{x: number; y: number; s?: number; built?: number; broken?: boolean}> = ({x, y, s = 1, built = 0.5, broken}) => {
  const sticks = 9;
  const shown = Math.floor(built * sticks);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-170} y={-12} width={340} height={14} rx={3} fill="#3a2c22" stroke={C.outline} strokeWidth={3} />
      <path d="M -150 -12 Q 0 -130 150 -12" stroke="#d9b77a" strokeWidth={8} fill="none" strokeDasharray={`${built * 420} 999`} strokeLinecap="round" />
      <line x1={-150} y1={-40} x2={150} y2={-40} stroke="#c9a86a" strokeWidth={7} strokeDasharray={`${built * 300} 999`} />
      {Array.from({length: shown}, (_, i) => {
        const px = -120 + i * 30;
        const top = -12 - Math.sin(((px + 150) / 300) * Math.PI) * 118;
        const isBroken = broken && i === 4;
        return (
          <line
            key={i}
            x1={px}
            y1={-12}
            x2={isBroken ? px + 30 : px}
            y2={isBroken ? -30 : top}
            stroke="#e0c48a"
            strokeWidth={6}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

/** A pile of three backpacks in his arms (drawn on top of him, local coords like Hero). */
export const BagsInArms: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Backpack x={-40} y={-90} s={0.75} />
    <g transform="rotate(12)">
      <Backpack x={50} y={-110} s={0.7} />
    </g>
    <g transform="rotate(-8)">
      <Backpack x={10} y={-180} s={0.65} />
    </g>
  </g>
);

/* Corridor outside the submission room: door with a sign, bench, notice board */
export const Corridor: React.FC<{doorOpen?: number; closed?: boolean; children?: React.ReactNode; front?: React.ReactNode}> = ({doorOpen = 0, closed, children, front}) => (
  <g>
    <rect width={W} height={H} fill="#111214" />
    {Array.from({length: 6}, (_, i) => (
      <rect key={i} x={100 + i * 300} y={60} width={200} height={24} rx={6} fill="#d8dde6" opacity={0.12} />
    ))}
    <Light id="corl" x={960} y={80} r={1100} color="#cfd8e6" o={0.25} />
    {/* notice board */}
    <rect x={160} y={260} width={360} height={240} fill="#2a2018" stroke={C.line} strokeWidth={4} />
    {[[190, 290], [330, 300], [200, 400], [360, 410]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width={110} height={80} fill="#d9d2bf" opacity={0.55} />
    ))}
    {/* submission door */}
    <rect x={1180} y={220} width={340} height={FLOOR - 220} fill="#0c0d0f" stroke={C.line} strokeWidth={5} />
    <rect x={1180} y={220} width={340 * (1 - doorOpen)} height={FLOOR - 220} fill="#1d1f24" stroke={C.line} strokeWidth={5} />
    <circle cx={1180 + 340 * (1 - doorOpen) - 30} cy={560} r={10} fill={C.amber} />
    <rect x={1240} y={140} width={220} height={56} rx={8} fill="#1d1a15" stroke={C.amber} strokeWidth={3} />
    <text x={1350} y={178} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={26} fill={C.amberLight}>
      SUBMISSIONS
    </text>
    {closed && (
      <g>
        <rect x={1270} y={380} width={160} height={60} rx={6} fill="#e0565b" stroke={C.outline} strokeWidth={3} />
        <text x={1350} y={421} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill="#fff">
          CLOSED
        </text>
      </g>
    )}
    {children}
    {/* bench */}
    <rect x={560} y={740} width={480} height={22} rx={6} fill="#1b1d21" stroke={C.line} strokeWidth={3} />
    <line x1={590} y1={762} x2={590} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    <line x1={1010} y1={762} x2={1010} y2={FLOOR} stroke={C.line} strokeWidth={5} />
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* Campus path outdoors: buildings far, lamp posts, a walkway */
export const CampusPath: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <defs>
      <linearGradient id="cpsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a3248" />
        <stop offset="1" stopColor="#7a7a8e" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#cpsky)" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={150 + i * 600} y={300} width={420} height={360} fill="#1e2230" stroke="#2c3244" strokeWidth={3} />
        {Array.from({length: 8}, (_, k) => (
          <rect key={k} x={180 + i * 600 + (k % 4) * 100} y={340 + Math.floor(k / 4) * 120} width={60} height={70} fill="#2a3044" />
        ))}
      </g>
    ))}
    <rect x={0} y={660} width={W} height={H - 660} fill="#1a1c1f" />
    {[300, 960, 1620].map((x) => (
      <g key={x}>
        <line x1={x} y1={FLOOR} x2={x} y2={420} stroke={C.line} strokeWidth={6} />
        <ellipse cx={x} cy={415} rx={22} ry={10} fill={C.amberLight} opacity={0.5} />
      </g>
    ))}
    {children}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);
