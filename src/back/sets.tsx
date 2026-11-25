import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W} from '../common/theme';
import {FLOOR, Light} from '../common/sets';

/* His apartment (2031): big window with city lights, sofa, coffee table, kitchen counter, wall clock */
export const Apartment: React.FC<{t: number; warm?: number; children?: React.ReactNode; front?: React.ReactNode; lamp?: number}> = ({t, warm = 0, children, front, lamp = 1}) => (
  <g>
    <rect width={W} height={H} fill="#101114" />
    {/* window + city */}
    <rect x={260} y={160} width={760} height={440} fill="#0b1222" stroke={C.line} strokeWidth={5} />
    {Array.from({length: 9}, (_, i) => {
      const bx = 280 + i * 82;
      const bh = 120 + ((i * 53) % 160);
      return (
        <g key={i}>
          <rect x={bx} y={600 - bh} width={70} height={bh} fill="#151c2c" />
          {Array.from({length: 6}, (_, k) => (
            <rect key={k} x={bx + 10 + (k % 2) * 30} y={610 - bh + Math.floor(k / 2) * 34} width={16} height={14} fill={C.amberLight} opacity={(i * 7 + k * 3) % 5 === 0 ? 0.6 : 0.08} />
          ))}
        </g>
      );
    })}
    <line x1={640} y1={160} x2={640} y2={600} stroke={C.line} strokeWidth={5} />
    {/* wall clock */}
    <g transform="translate(1250 260)">
      <circle r={60} fill="#16191e" stroke={C.line} strokeWidth={4} />
      <line x1={0} y1={0} x2={0} y2={-40} stroke={C.cream} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={0} x2={28} y2={10} stroke={C.cream} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={0} x2={44 * Math.sin(t * 0.21)} y2={-44 * Math.cos(t * 0.21)} stroke={C.amber} strokeWidth={2} />
    </g>
    {/* kitchen counter (right) */}
    <rect x={1460} y={560} width={420} height={FLOOR - 560} fill="#15171b" stroke={C.line} strokeWidth={4} />
    <rect x={1440} y={540} width={460} height={22} fill="#1d2026" stroke={C.line} strokeWidth={3} />
    <rect x={1520} y={480} width={60} height={60} rx={8} fill="#1d2026" stroke={C.line} strokeWidth={3} />
    {/* floor lamp */}
    <line x1={1120} y1={FLOOR} x2={1120} y2={430} stroke={C.line} strokeWidth={5} />
    <path d="M 1080 430 L 1100 380 L 1140 380 L 1160 430 Z" fill="#1d1a15" stroke={C.amber} strokeWidth={3} />
    <Light id="aplamp" x={1120} y={520} r={600} color={C.amber} o={0.5 * lamp} />
    <Light id="apcity" x={640} y={400} r={700} color={C.cold} o={0.35} />
    {warm > 0 && <Light id="apwarm" x={960} y={500} r={1200} color={C.amber} o={warm} />}
    {/* sofa back */}
    <rect x={400} y={600} width={600} height={140} rx={30} fill="#1b1e24" stroke={C.line} strokeWidth={4} />
    {children}
    {/* sofa seat + arms */}
    <rect x={380} y={730} width={640} height={60} rx={18} fill="#20242b" stroke={C.line} strokeWidth={4} />
    <rect x={360} y={640} width={60} height={150} rx={22} fill="#20242b" stroke={C.line} strokeWidth={4} />
    <rect x={980} y={640} width={60} height={150} rx={22} fill="#20242b" stroke={C.line} strokeWidth={4} />
    {/* coffee table */}
    <rect x={520} y={800} width={360} height={18} rx={5} fill="#1d2026" stroke={C.line} strokeWidth={3} />
    <line x1={545} y1={818} x2={545} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    <line x1={855} y1={818} x2={855} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* Small birthday cake with candles (lit 0..1). */
export const Cake: React.FC<{x: number; y: number; s?: number; candles?: number; lit?: number; t: number; smoke?: number}> = ({x, y, s = 1, candles = 1, lit = 0, t, smoke = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-60} width={140} height={60} rx={8} fill="#f3ebcf" stroke={C.outline} strokeWidth={4} />
    <path d="M -70 -44 q 17 14 35 0 q 17 14 35 0 q 17 14 35 0 q 17 14 35 0" stroke="#e07b8a" strokeWidth={6} fill="none" />
    {Array.from({length: candles}, (_, i) => {
      const cx = (i - (candles - 1) / 2) * 28;
      return (
        <g key={i}>
          <rect x={cx - 5} y={-100} width={10} height={40} fill={C.coldLight} stroke={C.outline} strokeWidth={2} />
          {lit > 0 && <ellipse cx={cx} cy={-112 + Math.sin(t * 18 + i) * 1.5} rx={7 * lit} ry={13 * lit} fill={C.amberLight} />}
          {smoke > 0 && (
            <path d={`M ${cx} -104 q 10 -20 0 -40 q -10 -20 0 -40`} stroke="#9aa3b2" strokeWidth={4} fill="none" opacity={smoke * 0.6} strokeLinecap="round" transform={`translate(0 ${-smoke * 30})`} />
          )}
        </g>
      );
    })}
    {lit > 0 && <Light id={`cake${x}`} x={0} y={-110} r={260} color={C.amber} o={lit * 0.9} />}
  </g>
);

/** The film's signature REWIND transition: scan lines, colour split, jitter and a ◀◀ badge. */
export const RewindFX: React.FC<{p: number}> = ({p}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const k = Math.sin(Math.PI * Math.min(1, p));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 14}, (_, i) => {
          const y = ((f * 37 + i * 97) % H);
          return <rect key={i} x={0} y={y} width={W} height={3 + (i % 3) * 4} fill="#ffffff" opacity={0.08 * k + (i % 4 === 0 ? 0.08 * k : 0)} />;
        })}
        <rect x={0} y={((f * 23) % H) - 40} width={W} height={70} fill="#9fb4d6" opacity={0.12 * k} />
      </svg>
      <div style={{position: 'absolute', right: 240, top: 132, fontFamily: 'Nunito', fontWeight: 900, fontSize: 54, color: '#fff', opacity: 0.85 * k, letterSpacing: -6}}>◀◀</div>
      <AbsoluteFill style={{background: `rgba(120,140,180,${0.12 * k})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** Big year in the top-right corner that ticks backwards. */
export const YearHUD: React.FC<{year: string; flash?: number}> = ({year, flash = 0}) => (
  <div style={{position: 'absolute', right: 80, top: 150, fontFamily: 'Nunito', fontWeight: 900, fontSize: 40, color: C.cream, opacity: 0.85, textShadow: `0 0 ${20 * flash}px ${C.coldLight}`}}>{year}</div>
);

/* ---------- characters ---------- */
export const FRIEND = {color: '#a6a9b0', accessory: 'scarf' as const, accessoryColor: '#d9a35a'};

/* ---------- 2030: wedding hall ---------- */
export const WeddingHall: React.FC<{t: number; lights?: number; children?: React.ReactNode; front?: React.ReactNode}> = ({t, lights = 1, children, front}) => (
  <g>
    <rect width={W} height={H} fill="#141114" />
    {Array.from({length: 24}, (_, i) => (
      <circle key={i} cx={40 + i * 80} cy={120 + Math.sin(i * 0.7) * 30} r={6} fill={C.amberLight} opacity={(0.3 + 0.5 * ((Math.sin(t * 3 + i) + 1) / 2)) * lights} />
    ))}
    <path d={`M 0 110 ${Array.from({length: 25}, (_, i) => `Q ${i * 80 + 40} ${160 + Math.sin(i) * 20} ${(i + 1) * 80} 110`).join(' ')}`} stroke={C.line} strokeWidth={2} fill="none" />
    <path d="M 760 640 L 760 330 Q 960 180 1160 330 L 1160 640" stroke="#e9e2c8" strokeWidth={10} fill="none" opacity={0.6} />
    {[800, 900, 1020, 1120].map((x, i) => (
      <circle key={x} cx={x} cy={300 - (i % 2) * 40} r={16} fill={i % 2 ? '#e07b8a' : '#f3ebcf'} opacity={0.7} />
    ))}
    <Light id="wedw" x={960} y={360} r={1100} color={C.amber} o={0.8 * lights} />
    {children}
    {[300, 1620].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={760} rx={170} ry={20} fill="#1d1a1c" stroke={C.line} strokeWidth={3} />
        <rect x={x - 160} y={760} width={320} height={100} fill="#e9e2c8" opacity={0.15} />
      </g>
    ))}
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    {lights < 1 && <rect width={W} height={H} fill="#05060a" opacity={(1 - lights) * 0.7} />}
  </g>
);

/** Little place card with a drawing of him (no names in this film). */
export const PlaceCard: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 0 L -50 -70 L 50 -70 L 60 0 Z" fill="#f3ebcf" stroke={C.outline} strokeWidth={3} />
    <circle cx={0} cy={-46} r={14} fill={C.cream} stroke={C.outline} strokeWidth={2.5} />
    <rect x={-10} y={-32} width={20} height={14} rx={6} fill={C.cream} stroke={C.outline} strokeWidth={2.5} />
    <rect x={-14} y={-24} width={6} height={6} fill={C.teal} />
    <path d="M -36 -14 q 36 10 72 0" stroke={C.amber} strokeWidth={3} fill="none" />
  </g>
);

/* ---------- 2029: airport ---------- */
export const Airport: React.FC<{t: number; planeX?: number; children?: React.ReactNode}> = ({t, planeX, children}) => (
  <g>
    <rect width={W} height={H} fill="#0f1217" />
    <rect x={0} y={140} width={W} height={430} fill="#1a2234" />
    {Array.from({length: 8}, (_, i) => (
      <line key={i} x1={i * 260} y1={140} x2={i * 260} y2={570} stroke={C.line} strokeWidth={6} />
    ))}
    <rect x={0} y={480} width={W} height={90} fill="#141a26" />
    {planeX !== undefined && (
      <g transform={`translate(${planeX} ${480 - Math.max(0, planeX - 700) * 0.22}) rotate(${planeX > 700 ? -10 : 0})`}>
        <path d="M -160 0 L 140 -10 Q 180 -10 180 0 Q 180 10 140 10 L -160 10 Z" fill="#c9ccd2" stroke={C.outline} strokeWidth={3} />
        <path d="M -20 0 L -80 60 L -40 60 L 30 0 Z M -20 0 L -70 -50 L -40 -50 L 30 0 Z M -150 0 L -175 -40 L -150 -40 L -120 0 Z" fill="#a6a9b0" stroke={C.outline} strokeWidth={3} />
      </g>
    )}
    {/* departures board */}
    <rect x={860} y={180} width={480} height={200} rx={8} fill="#0b0d10" stroke={C.line} strokeWidth={4} />
    {['GATE 12  BOARDING', 'GATE 14  ON TIME', 'GATE 09  DELAYED'].map((r, i) => (
      <text key={i} x={890} y={240 + i * 52} fontFamily="Nunito" fontWeight={800} fontSize={30} fill={i === 0 ? C.amberLight : '#8a93a3'} opacity={i === 0 && (t * 2) % 1 < 0.5 ? 0.6 : 1}>
        {r}
      </text>
    ))}
    {children}
    <rect x={0} y={760} width={W} height={4} fill={C.lineSoft} />
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

export const Suitcase: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-50} y={-130} width={100} height={130} rx={12} fill="#5a6273" stroke={C.outline} strokeWidth={4} />
    <line x1={-20} y1={-130} x2={-20} y2={-190} stroke={C.outline} strokeWidth={6} />
    <line x1={20} y1={-130} x2={20} y2={-190} stroke={C.outline} strokeWidth={6} />
    <line x1={-26} y1={-190} x2={26} y2={-190} stroke={C.outline} strokeWidth={8} strokeLinecap="round" />
  </g>
);

/* ---------- 2028: bowling alley ---------- */
export const Bowling: React.FC<{t: number; pinsDown?: number; children?: React.ReactNode; front?: React.ReactNode; full?: boolean}> = ({t, pinsDown = 0, children, front, full}) => (
  <g>
    <rect width={W} height={H} fill="#100e16" />
    {['#e07b8a', C.teal, C.amberLight].map((c, i) => (
      <rect key={i} x={0} y={170 + i * 26} width={W} height={6} fill={c} opacity={0.35 + 0.2 * Math.sin(t * 3 + i)} />
    ))}
    {/* score screen */}
    <rect x={700} y={250} width={520} height={150} rx={10} fill="#0b0d10" stroke={C.amber} strokeWidth={3} />
    {['🟊', '', '', ''].map((_, i) => (
      <g key={i}>
        <circle cx={760 + i * 120} cy={325} r={26} fill={i === 3 ? (full ? C.cream : 'none') : ['#a6a9b0', '#c9ad86', '#c9ad86'][i]} stroke={i === 3 && !full ? '#5a6273' : C.outline} strokeWidth={3} strokeDasharray={i === 3 && !full ? '6 6' : undefined} />
        <text x={760 + i * 120} y={380} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={22} fill={C.cream}>
          {i === 3 ? (full ? '131' : '—') : ['142', '98', '120'][i]}
        </text>
      </g>
    ))}
    {/* lanes in perspective */}
    {[0, 1, 2].map((i) => (
      <polygon key={i} points={`${560 + i * 270},560 ${790 + i * 270},560 ${980 + i * 470},${FLOOR} ${480 + i * 470},${FLOOR}`} fill="#3a2c22" stroke={C.line} strokeWidth={3} opacity={0.9} />
    ))}
    {/* pins on the middle lane */}
    {Array.from({length: 6}, (_, k) => {
      const down = k < pinsDown;
      const px = 890 + (k % 3) * 22 - Math.floor(k / 3) * 11;
      const py = 548 - Math.floor(k / 3) * 10;
      return <ellipse key={k} cx={px + (down ? 14 : 0)} cy={py + (down ? 10 : 0)} rx={6} ry={down ? 6 : 16} fill="#f3ebcf" stroke={C.outline} strokeWidth={2} transform={down ? `rotate(70 ${px} ${py})` : undefined} />;
    })}
    <Light id="bwn" x={960} y={300} r={1000} color="#e07b8a" o={0.35} />
    {children}
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

export const ShoeRack: React.FC<{x: number; y: number; s?: number; empty?: boolean}> = ({x, y, s = 1, empty}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-260} width={440} height={260} fill="#17151c" stroke={C.line} strokeWidth={4} />
    {[0, 1].map((r) => (
      <line key={r} x1={-220} y1={-130 + r * 130 - 2} x2={220} y2={-130 + r * 130 - 2} stroke={C.line} strokeWidth={4} />
    ))}
    {[-150, -50, 50, 150].map((sx, i) => (
      <g key={sx} opacity={i === 2 && empty ? 0 : 1}>
        <path d={`M ${sx - 40} -140 q 0 -40 30 -40 l 40 30 l 0 10 z`} fill={i === 2 ? C.teal : '#8a4a4a'} stroke={C.outline} strokeWidth={3} />
        <path d={`M ${sx - 40} -10 q 0 -40 30 -40 l 40 30 l 0 10 z`} fill={i === 2 ? C.teal : '#5a6273'} stroke={C.outline} strokeWidth={3} />
      </g>
    ))}
  </g>
);

/* ---------- 2027: balcony party ---------- */
export const Balcony: React.FC<{t: number; children?: React.ReactNode; front?: React.ReactNode}> = ({t, children, front}) => (
  <g>
    <defs>
      <linearGradient id="balsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b1f36" />
        <stop offset="1" stopColor="#4a3550" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#balsky)" />
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={i * 200} y={420 - ((i * 47) % 140)} width={150} height={400} fill="#1c1a28" />
    ))}
    <path d={`M 0 180 ${Array.from({length: 13}, (_, i) => `Q ${i * 160 + 80} 240 ${(i + 1) * 160} 180`).join(' ')}`} stroke={C.line} strokeWidth={2} fill="none" />
    {Array.from({length: 13}, (_, i) => (
      <circle key={i} cx={80 + i * 160} cy={222} r={8} fill={['#e9a94f', '#e07b8a', C.teal][i % 3]} opacity={0.6 + 0.4 * Math.sin(t * 4 + i)} />
    ))}
    <Light id="balw" x={960} y={400} r={1000} color={C.amber} o={0.75} />
    {children}
    <rect x={0} y={700} width={W} height={10} fill="#2a2630" />
    {Array.from({length: 24}, (_, i) => (
      <line key={i} x1={i * 82} y1={710} x2={i * 82} y2={FLOOR} stroke={C.line} strokeWidth={4} />
    ))}
    {front}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* ---------- 2026: graduation hall ---------- */
export const GradHall: React.FC<{t: number; confetti?: number; children?: React.ReactNode; dim?: number}> = ({t, confetti = 0, children, dim = 0}) => (
  <g>
    <rect width={W} height={H} fill="#121218" />
    <rect x={460} y={140} width={1000} height={70} rx={8} fill="#1d1a15" stroke={C.amber} strokeWidth={3} />
    <text x={960} y={190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={40} fill={C.amberLight}>
      CLASS OF 2026
    </text>
    {[300, 1620].map((x) => (
      <rect key={x} x={x - 40} y={140} width={80} height={720} fill="#1a1820" stroke={C.line} strokeWidth={3} />
    ))}
    <Light id="grw" x={960} y={300} r={1100} color={C.amber} o={0.7} />
    {children}
    {confetti > 0 &&
      Array.from({length: 60}, (_, i) => {
        const r1 = Math.abs(Math.sin(i * 12.9) * 4375.5) % 1;
        const r2 = Math.abs(Math.sin(i * 78.2) * 1234.5) % 1;
        const x = r1 * W;
        const y = ((confetti * 600 + r2 * 900) % 1000) - 60;
        return <rect key={i} x={x + Math.sin(t * 3 + i) * 20} y={y} width={12} height={18} fill={['#e9a94f', '#e07b8a', C.teal, '#f3ebcf'][i % 4]} transform={`rotate(${t * 200 + i * 30} ${x} ${y})`} opacity={0.85} />;
      })}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    {dim > 0 && <rect width={W} height={H} fill="#05060a" opacity={dim} />}
  </g>
);

/** Graduation cap (drawn on a head, local coords like Hero). */
export const GradCap: React.FC<{x: number; y: number; s?: number; tilt?: number}> = ({x, y, s = 1, tilt = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`}>
    <path d="M -110 -430 L 0 -470 L 110 -430 L 0 -392 Z" fill="#1d1f24" stroke={C.outline} strokeWidth={4} />
    <path d="M -60 -420 L -60 -400 Q 0 -380 60 -400 L 60 -420" fill="#1d1f24" stroke={C.outline} strokeWidth={4} />
    <path d="M 0 -431 L 90 -420 L 96 -380" stroke={C.amber} strokeWidth={4} fill="none" />
  </g>
);

/** FAST-FORWARD transition (warm version of the rewind). */
export const ForwardFX: React.FC<{p: number}> = ({p}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const k = Math.sin(Math.PI * Math.min(1, p));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 10}, (_, i) => {
          const y = H - ((f * 41 + i * 113) % H);
          return <rect key={i} x={0} y={y} width={W} height={3 + (i % 3) * 3} fill={C.amberLight} opacity={0.1 * k} />;
        })}
      </svg>
      <div style={{position: 'absolute', right: 240, top: 132, fontFamily: 'Nunito', fontWeight: 900, fontSize: 54, color: C.amberLight, opacity: 0.9 * k, letterSpacing: -6}}>▶▶</div>
      <AbsoluteFill style={{background: `rgba(233,169,79,${0.1 * k})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
