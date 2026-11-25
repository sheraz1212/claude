import React from 'react';
import {Light} from '../common/sets';
import {C} from '../common/theme';

const OL = C.outline;
export const TRACK_Y = 870;
export const JACKET = '#3f5a48';
export const HEADBAND = '#e9c23a';

/** (A) school track at dusk: dark sky, floodlights, bleachers with a crowd, red track with lanes. scrollX scrolls the near layers (side tracking). */
export const SchoolTrack: React.FC<{t: number; scrollX?: number; crowd?: number; lights?: number}> = ({t, scrollX = 0, crowd = 1, lights = 1}) => {
  const sx = scrollX;
  const mod = (v: number, m: number) => ((v % m) + m) % m;
  return (
    <g>
      <defs>
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15132a" />
          <stop offset="1" stopColor="#4a2f48" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#tsky)" />
      {/* far skyline */}
      {Array.from({length: 14}, (_, i) => {
        const x = mod(i * 150 - sx * 0.15, 2100) - 100;
        const h = 120 + ((i * 47) % 110);
        return (
          <g key={i}>
            <rect x={x} y={420 - h} width={130} height={h + 20} fill="#1f1c34" />
            {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 18 + (k % 2) * 56} y={440 - h + Math.floor(k / 2) * 44} width={14} height={16} fill={C.amberLight} opacity={(i + k) % 3 ? 0.12 : 0.75} />)}
          </g>
        );
      })}
      {/* floodlight towers */}
      {[260, 1660].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y={120} width={16} height={330} fill="#24222e" />
          <rect x={x - 70} y={90} width={140} height={44} rx={6} fill="#2c2a36" stroke={OL} strokeWidth={3} />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={x - 48 + k * 32} cy={112} r={11} fill="#fff1c9" opacity={lights} />)}
          <Light id={`fl${i}`} x={x} y={130} r={700} color="#ffe6b0" o={0.55 * lights} />
          <path d={`M ${x - 60} 134 L ${x + 60} 134 L ${x + (i ? -520 : 520)} 860 L ${x + (i ? -120 : 120)} 860 Z`} fill="#fff1c9" opacity={0.06 * lights} />
        </g>
      ))}
      {/* bleachers + crowd (middle) */}
      <rect y={450} width={1920} height={200} fill="#2a2433" />
      {[0, 1, 2, 3].map((r) => <rect key={r} y={470 + r * 44} width={1920} height={8} fill="#3a3344" />)}
      {Array.from({length: 46}, (_, i) => {
        const x = mod(i * 47 - sx * 0.45, 2160) - 120;
        const row = i % 4;
        const bob = Math.abs(Math.sin(t * 6 + i)) * 8 * crowd;
        return (
          <g key={i} transform={`translate(${x} ${462 + row * 44 - bob})`} opacity={0.85}>
            <circle cx={0} cy={0} r={13} fill={['#6b5a6e', '#5a5e70', '#7a6a5a', '#4e5468'][i % 4]} />
            <rect x={-14} y={10} width={28} height={26} rx={10} fill={['#6b5a6e', '#5a5e70', '#7a6a5a', '#4e5468'][i % 4]} />
          </g>
        );
      })}
      {/* fence */}
      <rect y={650} width={1920} height={10} fill="#3a3a46" />
      {Array.from({length: 24}, (_, i) => <rect key={i} x={mod(i * 90 - sx * 0.7, 2160) - 120} y={640} width={6} height={60} fill="#3a3a46" />)}
      {/* infield grass */}
      <rect y={660} width={1920} height={90} fill="#2c3b30" />
      {/* track */}
      <rect y={750} width={1920} height={330} fill="#6a3330" />
      {[750, 820, 900, 990].map((y) => <rect key={y} y={y} width={1920} height={5} fill="#d9cfc0" opacity={0.55} />)}
      {Array.from({length: 12}, (_, i) => <rect key={i} x={mod(i * 220 - sx, 2640) - 360} y={1030} width={90} height={6} fill="#d9cfc0" opacity={0.25} />)}
      <ellipse cx={960} cy={900} rx={900} ry={140} fill="#ffe6b0" opacity={0.07 * lights} />
    </g>
  );
};

/** start / finish line on the track at world x (after scroll). */
export const TrackLine: React.FC<{x: number; label?: string}> = ({x, label}) => (
  <g>
    <rect x={x - 8} y={750} width={16} height={330} fill="#efe6d6" opacity={0.85} />
    {label && <text x={x} y={740} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={26} fill="#efe6d6" opacity={0.8}>{label}</text>}
  </g>
);

/** race bib on the chest (pass the same x/y/scale as the Hero; classic child build). */
export const Bib: React.FC<{x: number; y: number; scale: number; n?: string; rot?: number; classic?: boolean}> = ({x, y, scale, n = '7', rot = 0, classic = false}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale}) translate(0 ${classic ? 0 : -90})`}>
    <rect x={-30} y={-195} width={60} height={50} rx={5} fill="#f4efe4" stroke={OL} strokeWidth={3} />
    <circle cx={-22} cy={-188} r={3} fill="#999" />
    <circle cx={22} cy={-188} r={3} fill="#999" />
    <text x={0} y={-156} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#c8304f">{n}</text>
  </g>
);

/* ---------------- (B) his flat ---------------- */
export const Flat: React.FC<{t: number; dawn?: number; lamp?: number; drawer?: number; shoes?: boolean; phone?: number}> = ({t, dawn = 0, lamp = 1, drawer = 0, shoes = true, phone = 0}) => (
  <g>
    <rect width={1920} height={1080} fill="#2c2f3b" />
    <rect width={1920} height={90} fill="#24262f" />
    {/* window with city */}
    <defs>
      <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={dawn > 0.5 ? '#2a3150' : '#11142a'} />
        <stop offset="1" stopColor={dawn > 0.5 ? '#7a5a6a' : '#262444'} />
      </linearGradient>
    </defs>
    <rect x={1280} y={190} width={360} height={380} fill="url(#fsky)" />
    {Array.from({length: 6}, (_, i) => <rect key={i} x={1290 + i * 58} y={420 - (i % 3) * 50} width={50} height={160} fill="#1c1e33" />)}
    {Array.from({length: 7}, (_, i) => <rect key={i} x={1300 + i * 50} y={450 - (i % 3) * 45} width={9} height={11} fill={C.amberLight} opacity={0.8} />)}
    <rect x={1280} y={190} width={360} height={380} fill="none" stroke="#4a3a30" strokeWidth={14} />
    <line x1={1460} y1={190} x2={1460} y2={570} stroke="#4a3a30" strokeWidth={8} />
    {dawn > 0.5 && <path d="M 1290 570 L 1630 570 L 1500 900 L 1000 900 Z" fill="#b8c0e0" opacity={0.06} />}
    {/* door + shoe rack */}
    <rect x={1700} y={300} width={180} height={560} fill="#4a3428" stroke={OL} strokeWidth={5} />
    <circle cx={1715} cy={600} r={9} fill="#c9a46a" />
    <rect x={1560} y={840} width={130} height={20} fill="#3a2a22" stroke={OL} strokeWidth={3} />
    {shoes && (
      <g>
        <path d="M 1570 840 q 0 -26 26 -26 l 22 0 q 14 0 16 26 z" fill="#d94c4c" stroke={OL} strokeWidth={3} />
        <path d="M 1622 840 q 0 -26 26 -26 l 22 0 q 14 0 16 26 z" fill="#d94c4c" stroke={OL} strokeWidth={3} />
        <rect x={1572} y={830} width={60} height={8} fill="#efe6d6" />
        <rect x={1624} y={830} width={60} height={8} fill="#efe6d6" />
      </g>
    )}
    {/* chest of drawers + lamp */}
    <rect x={700} y={620} width={240} height={240} fill="#4a3428" stroke={OL} strokeWidth={5} />
    <rect x={718} y={640 + 0} width={204} height={60} fill="#5a4030" stroke={OL} strokeWidth={3} transform={`translate(0 ${drawer * 26}) scale(1 1)`} />
    {drawer > 0 && <rect x={718} y={700} width={204} height={drawer * 26} fill="#1a1412" />}
    <rect x={718} y={720} width={204} height={60} fill="#5a4030" stroke={OL} strokeWidth={3} />
    <rect x={718} y={790} width={204} height={56} fill="#5a4030" stroke={OL} strokeWidth={3} />
    {[670, 750, 818].map((y) => <circle key={y} cx={820} cy={y + (y === 670 ? drawer * 26 : 0)} r={6} fill="#c9a46a" />)}
    <path d="M 790 620 L 850 620 L 840 560 L 800 560 Z" fill="#e9c27a" stroke={OL} strokeWidth={3} />
    <rect x={814} y={540} width={12} height={22} fill="#2a2c34" />
    {lamp > 0 && <Light id="flamp" x={820} y={580} r={620} color={C.amber} o={0.7 * lamp} />}
    {/* bed */}
    <rect x={120} y={700} width={520} height={140} rx={20} fill="#3a4258" stroke={OL} strokeWidth={4} />
    <rect x={120} y={672} width={150} height={60} rx={22} fill="#cfc6b4" stroke={OL} strokeWidth={4} />
    <rect x={120} y={830} width={520} height={32} fill="#3a2a22" stroke={OL} strokeWidth={4} />
    {phone > 0 && <Light id="fph" x={360} y={640} r={420} color="#8fb8f0" o={0.6 * phone} />}
    {/* floor */}
    <rect y={860} width={1920} height={220} fill="#24212a" />
    {[900, 960, 1030].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000040" strokeWidth={3} />)}
    {lamp > 0 && <ellipse cx={820} cy={900} rx={420} ry={50} fill={C.amberLight} opacity={0.08 * lamp} />}
  </g>
);

/* ---------------- stairwell (profile) ---------------- */
export const stairY = (x: number) => 1000 - Math.max(0, Math.min(1, (x - 300) / 1300)) * 520;
export const Stairs: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#262833" />
    {[0, 1, 2].map((i) => <rect key={i} x={200 + i * 600} y={80} width={8} height={40} fill="#2a2c34" />)}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <circle cx={204 + i * 600} cy={128} r={14} fill="#fff1c9" opacity={0.8 + 0.2 * Math.sin(t * 13 + i * 5)} />
        <Light id={`sb${i}`} x={204 + i * 600} y={160} r={520} color={C.amber} o={0.45} />
      </g>
    ))}
    {Array.from({length: 26}, (_, i) => {
      const x = 300 + i * 50;
      const y = stairY(x);
      return <rect key={i} x={x} y={y} width={52} height={1080 - y} fill={i % 2 ? '#3a3542' : '#36313e'} stroke="#1f1c25" strokeWidth={2} />;
    })}
    <rect x={0} y={1000} width={300} height={80} fill="#36313e" />
    <rect x={1600} y={480} width={320} height={600} fill="#36313e" />
    {/* railing */}
    <path d={`M 300 ${stairY(300) - 150} L 1600 ${stairY(1600) - 150}`} stroke="#5a5a68" strokeWidth={8} />
    {Array.from({length: 14}, (_, i) => {
      const x = 320 + i * 95;
      return <line key={i} x1={x} y1={stairY(x) - 150 + 0} x2={x} y2={stairY(x)} stroke="#4a4a58" strokeWidth={5} />;
    })}
  </g>
);

/* ---------------- (C) the park race ---------------- */
export const PARK_Y = 950;
export const ParkRace: React.FC<{t: number; cheer?: number; scrollX?: number}> = ({t, cheer = 1, scrollX = 0}) => {
  const mod = (v: number, m: number) => ((v % m) + m) % m;
  return (
    <g>
      <defs>
        <linearGradient id="prk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1830" />
          <stop offset="1" stopColor="#5a3a40" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#prk)" />
      <circle cx={1500} cy={560} r={70} fill="#e08a5a" opacity={0.5} />
      {Array.from({length: 12}, (_, i) => <rect key={i} x={mod(i * 170 - scrollX * 0.1, 2040) - 60} y={470 - ((i * 53) % 120)} width={150} height={200} fill="#231f36" />)}
      {Array.from({length: 18}, (_, i) => <rect key={i} x={mod(i * 113 - scrollX * 0.1, 2040) - 40} y={500 - ((i * 37) % 90)} width={10} height={12} fill={C.amberLight} opacity={0.6} />)}
      {/* trees */}
      {Array.from({length: 9}, (_, i) => (
        <g key={i} transform={`translate(${mod(80 + i * 230 - scrollX * 0.4, 2100) - 90} 690)`}>
          <rect x={-10} y={0} width={20} height={80} fill="#2a2024" />
          <circle cx={0} cy={-30} r={70 + (i % 3) * 14} fill={i % 2 ? '#24352c' : '#1f2e27'} stroke={OL} strokeWidth={3} />
        </g>
      ))}
      {/* lamps */}
      {[300, 1100, 1800].map((lx, i) => {
        const x = mod(lx - scrollX * 0.7, 2200) - 140;
        return (
          <g key={i}>
            <rect x={x - 6} y={500} width={12} height={380} fill="#1f2028" />
            <circle cx={x} cy={494} r={16} fill="#fff1c9" />
            <Light id={`pl${i}`} x={x} y={520} r={480} color="#ffe3a6" o={0.55} />
            <ellipse cx={x} cy={900} rx={200} ry={26} fill="#fff1c9" opacity={0.12} />
          </g>
        );
      })}
      {/* grass + parents */}
      <rect y={770} width={1920} height={310} fill="#22302a" />
      {Array.from({length: 10}, (_, i) => {
        const x = mod(140 + i * 190 - scrollX * 0.7, 2100) - 90;
        const bob = Math.abs(Math.sin(t * 6 + i)) * 10 * cheer;
        return (
          <g key={i} transform={`translate(${x} ${820 - bob})`} opacity={0.9}>
            <circle cx={0} cy={-120} r={30} fill={['#8a8c94', '#a88f70', '#7a7c86', '#9a8466'][i % 4]} />
            <rect x={-32} y={-92} width={64} height={86} rx={26} fill={['#8a8c94', '#a88f70', '#7a7c86', '#9a8466'][i % 4]} />
            {cheer > 0.5 && <path d={`M -28 -80 L -44 ${-130 - bob}`} stroke={['#8a8c94', '#a88f70', '#7a7c86', '#9a8466'][i % 4]} strokeWidth={14} strokeLinecap="round" />}
          </g>
        );
      })}
      {/* path */}
      <rect y={1010} width={1920} height={500} fill="#1e2a25" />
      <rect y={860} width={1920} height={150} fill="#5a4a40" />
      <rect y={860} width={1920} height={6} fill="#7a6a58" />
      {Array.from({length: 12}, (_, i) => <rect key={i} x={mod(i * 200 - scrollX, 2400) - 200} y={1006} width={80} height={5} fill="#7a6a58" />)}
    </g>
  );
};
export const Ribbon: React.FC<{x: number; broken?: number}> = ({x, broken = 0}) => (
  <g>
    <rect x={x - 6} y={700} width={12} height={250} fill="#d9cfc0" />
    <rect x={x - 6} y={700} width={12} height={250} fill="#d9cfc0" transform="translate(0 0)" opacity={0} />
    {broken < 1 && <path d={`M ${x} 800 L ${x} 950`} stroke="#d94c4c" strokeWidth={6} strokeDasharray="20 10" />}
    <text x={x} y={690} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={26} fill="#d9cfc0">FINISH</text>
  </g>
);

/* ---------------- (D) mind track ---------------- */
export const MindTrack: React.FC<{t: number; light?: number; cracks?: number}> = ({t, light = 0, cracks = 0}) => {
  const vx = 960;
  const vy = 360;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0b0a10" />
      <ellipse cx={vx} cy={vy} rx={900} ry={160} fill="#ff3b3b" opacity={0.12 + 0.04 * Math.sin(t * 2)} />
      <path d={`M ${vx - 30} ${vy} L ${vx + 30} ${vy} L 1700 1080 L 220 1080 Z`} fill="#2a1416" />
      {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => <path key={k} d={`M ${vx + k * 30} ${vy} L ${960 + k * 740} 1080`} stroke="#5a3034" strokeWidth={4} />)}
      {Array.from({length: 9}, (_, i) => {
        const u = Math.pow((i + ((t * 0.8) % 1)) / 9, 2);
        const y = vy + u * (1080 - vy);
        const half = 30 + u * 710;
        return <line key={i} x1={vx - half} y1={y} x2={vx + half} y2={y} stroke="#3a1c20" strokeWidth={2 + u * 4} />;
      })}
      {cracks > 0 &&
        Array.from({length: 6}, (_, i) => {
          const y = 1000 - i * 90;
          const half = 30 + ((y - vy) / (1080 - vy)) * 710;
          const o = Math.max(0, Math.min(1, cracks * 6 - i));
          return <path key={i} d={`M ${vx - half * 0.5} ${y} l ${half * 0.2} -10 l ${half * 0.2} 14 l ${half * 0.3} -12 l ${half * 0.3} 8`} stroke="#ffd98a" strokeWidth={5} fill="none" opacity={o} style={{filter: 'drop-shadow(0 0 10px #ffd98a)'}} />;
        })}
      {light > 0 && <Light id="mtl" x={960} y={900} r={900} color="#ffd98a" o={light} />}
      <rect x={vx - 70} y={vy + 40} width={140} height={10} fill="#efe6d6" opacity={0.5} />
    </g>
  );
};
