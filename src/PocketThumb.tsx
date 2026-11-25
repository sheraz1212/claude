import React from 'react';
import {AbsoluteFill} from 'remotion';

/*
 POCKET MONEY thumbnails, 1280x720, click-first style:
  - huge marker-brush words (white + one yellow word), thick black outline, a red brush underline
  - one giant exaggerated face (big white eyes, tiny pupils, eye bags, sweat, open mouth, hand on head)
  - soft shading + a coloured rim light, rough hand-drawn edges, dark grainy background, ONE warm light
  - the symbolic prop up front (the $570 receipt), Mom in her uniform in the warm light behind
*/
export const OL = '#141217';
export const CREAM = '#F3EBCF';
const TAN = '#c9ad86';
export const RED = '#ff3b30';
export const YEL = '#ffd21f';

export const Defs: React.FC = () => (
  <defs>
    <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={5} />
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={2} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
    <radialGradient id="faceShade" cx="0.62" cy="0.32" r="0.8">
      <stop offset="0" stopColor="#fbf6e6" />
      <stop offset="0.6" stopColor={CREAM} />
      <stop offset="1" stopColor="#b7a9c6" />
    </radialGradient>
    <radialGradient id="warm" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#ffb347" stopOpacity={0.75} />
      <stop offset="1" stopColor="#ffb347" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="redGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={RED} stopOpacity={0.6} />
      <stop offset="1" stopColor={RED} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={0.75} />
    </radialGradient>
  </defs>
);

/** Big brush title (heavy hand-lettered brush, like top channels): huge white words, very thick black
    outline + drop shadow, ONE word in yellow, red brush underline, slight tilt. */
export const Title: React.FC<{words: [string, string][]; size?: number; y?: number; underline?: [number, number, number]; rot?: number}> = ({words, size = 170, y = 170, underline, rot = -3}) => (
  <g transform={`rotate(${rot} 640 ${y})`}>
    {underline && (
      <path d={`M ${underline[0]} ${underline[2] + 4} C ${underline[0] + 120} ${underline[2] - 10} ${underline[1] - 200} ${underline[2] - 18} ${underline[1]} ${underline[2] - 12}
                L ${underline[1] - 20} ${underline[2] + 2} C ${underline[1] - 220} ${underline[2] + 2} ${underline[0] + 140} ${underline[2] + 14} ${underline[0] + 30} ${underline[2] + 22} Z`} fill={RED} />
    )}
    <text x={646} y={y + 9} textAnchor="middle" fontFamily="Knewave" fontSize={size} fill="#000" stroke="#000" strokeWidth={34} strokeLinejoin="round" opacity={0.6}>
      {words.map(([w], i) => <tspan key={i}>{w}</tspan>)}
    </text>
    <text x={640} y={y} textAnchor="middle" fontFamily="Knewave" fontSize={size} stroke="#000" strokeWidth={30} strokeLinejoin="round" paintOrder="stroke fill" letterSpacing={2}>
      {words.map(([w, c], i) => <tspan key={i} fill={c}>{w}</tspan>)}
    </text>
  </g>
);

/** The hero's shocked face, big. (cx, cy) = head centre, r = head radius. */
export const ShockedHero: React.FC<{cx: number; cy: number; r: number; look?: number; rim?: string; handOnHead?: boolean; veins?: boolean; glint?: string}> = ({cx, cy, r, look = 1, rim = RED, handOnHead = true, veins = false, glint}) => {
  const ex = r * 0.36;
  const ey = cy - r * 0.02;
  const er = r * 0.25;
  return (
    <g filter="url(#rough)">
      {/* body */}
      <path d={`M ${cx - r * 1.05} ${cy + r * 2.2} C ${cx - r * 1.1} ${cy + r * 1.1} ${cx - r * 0.7} ${cy + r * 0.85} ${cx} ${cy + r * 0.85} C ${cx + r * 0.7} ${cy + r * 0.85} ${cx + r * 1.1} ${cy + r * 1.1} ${cx + r * 1.05} ${cy + r * 2.2} Z`} fill="url(#faceShade)" stroke={OL} strokeWidth={9} />
      {/* head */}
      <circle cx={cx} cy={cy} r={r} fill="url(#faceShade)" stroke={OL} strokeWidth={10} />
      {/* red rim light on the right side */}
      <path d={`M ${cx + r * 0.55} ${cy - r * 0.82} A ${r} ${r} 0 0 1 ${cx + r * 0.62} ${cy + r * 0.78}`} stroke={rim} strokeWidth={10} fill="none" opacity={0.75} filter="url(#blur6)" />
      {/* worry shading under the eyes */}
      {[-1, 1].map((k) => (
        <ellipse key={k} cx={cx + k * ex} cy={ey + er * 1.15} rx={er * 1.15} ry={er * 0.55} fill="#7a5f9a" opacity={0.28} />
      ))}
      {/* eyes: big whites, tiny pupils looking right */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={cx + k * ex} cy={ey} rx={er * 0.92} ry={er} fill="#fff" stroke={OL} strokeWidth={8} />
          {veins && [0, 1, 2, 3, 4, 5].map((v) => {
            const ang = (v / 6) * Math.PI * 2 + 0.4;
            const x0 = cx + k * ex + Math.cos(ang) * er * 0.88;
            const y0 = ey + Math.sin(ang) * er * 0.95;
            const xm = cx + k * ex + Math.cos(ang + 0.3) * er * 0.6;
            const ym = ey + Math.sin(ang + 0.3) * er * 0.6;
            const x1 = cx + k * ex + Math.cos(ang - 0.1) * er * 0.4;
            const y1 = ey + Math.sin(ang - 0.1) * er * 0.4;
            return <path key={v} d={`M ${x0} ${y0} Q ${xm} ${ym} ${x1} ${y1} M ${xm} ${ym} l ${Math.cos(ang + 1.2) * er * 0.18} ${Math.sin(ang + 1.2) * er * 0.18}`} stroke="#d4232b" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />;
          })}
          {veins && <ellipse cx={cx + k * ex} cy={ey} rx={er * 0.92} ry={er} fill="none" stroke="#e05a5f" strokeWidth={10} opacity={0.25} />}
          <circle cx={cx + k * ex + er * 0.42 * look} cy={ey + er * 0.1} r={er * (veins ? 0.3 : 0.24)} fill={OL} />
          {glint && <circle cx={cx + k * ex + er * 0.42 * look + er * 0.08} cy={ey + er * 0.02} r={er * 0.09} fill={glint} />}
          <path d={`M ${cx + k * ex - er * 0.8} ${ey + er * 1.35} q ${er * 0.8} ${er * 0.35} ${er * 1.6} 0`} stroke="#5a4672" strokeWidth={5} fill="none" opacity={0.7} />
          <path d={`M ${cx + k * ex - er * 0.6} ${ey + er * 1.6} q ${er * 0.6} ${er * 0.25} ${er * 1.2} 0`} stroke="#5a4672" strokeWidth={4} fill="none" opacity={0.5} />
        </g>
      ))}
      {/* brows: inner ends pushed UP - worried, shocked */}
      <path d={`M ${cx - ex - er * 1.05} ${ey - er * 1.25} Q ${cx - ex - er * 0.2} ${ey - er * 1.35} ${cx - ex + er * 0.85} ${ey - er * 1.95}`} stroke={OL} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M ${cx + ex + er * 1.05} ${ey - er * 1.25} Q ${cx + ex + er * 0.2} ${ey - er * 1.35} ${cx + ex - er * 0.85} ${ey - er * 1.95}`} stroke={OL} strokeWidth={12} fill="none" strokeLinecap="round" />
      {/* open mouth, corners DOWN (shock, not a smile) */}
      <path d={`M ${cx - r * 0.24} ${cy + r * 0.72} Q ${cx - r * 0.2} ${cy + r * 0.42} ${cx} ${cy + r * 0.4} Q ${cx + r * 0.2} ${cy + r * 0.42} ${cx + r * 0.24} ${cy + r * 0.72} Q ${cx} ${cy + r * 0.62} ${cx - r * 0.24} ${cy + r * 0.72} Z`} fill="#6a1822" stroke={OL} strokeWidth={8} strokeLinejoin="round" />
      <ellipse cx={cx} cy={cy + r * 0.6} rx={r * 0.1} ry={r * 0.04} fill="#c8505c" />
      {/* sweat + a tear */}
      <path d={`M ${cx - r * 0.78} ${cy - r * 0.42} q ${-r * 0.1} ${r * 0.18} 0 ${r * 0.24} q ${r * 0.1} ${-r * 0.06} 0 ${-r * 0.24} Z`} fill="#8fc4ff" stroke={OL} strokeWidth={5} />
      <path d={`M ${cx - ex} ${ey + er * 1.2} q ${-r * 0.06} ${r * 0.12} 0 ${r * 0.16} q ${r * 0.06} ${-r * 0.04} 0 ${-r * 0.16} Z`} fill="#8fc4ff" stroke={OL} strokeWidth={4} />
      {/* hand on head */}
      {handOnHead && <><g transform={`rotate(-20 ${cx - r * 0.7} ${cy - r * 0.75})`}>
        <ellipse cx={cx - r * 0.7} cy={cy - r * 0.75} rx={r * 0.3} ry={r * 0.36} fill={CREAM} stroke={OL} strokeWidth={9} />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${cx - r * 0.86 + i * r * 0.16} ${cy - r * 0.55} l ${r * 0.02} ${-r * 0.2}`} stroke={OL} strokeWidth={5} strokeLinecap="round" />)}
      </g>
      <path d={`M ${cx - r * 0.85} ${cy + r * 2.2} C ${cx - r * 1.0} ${cy + r * 0.6} ${cx - r * 0.95} ${cy - r * 0.2} ${cx - r * 0.82} ${cy - r * 0.55}`} stroke={OL} strokeWidth={r * 0.44} fill="none" strokeLinecap="round" />
      <path d={`M ${cx - r * 0.85} ${cy + r * 2.2} C ${cx - r * 1.0} ${cy + r * 0.6} ${cx - r * 0.95} ${cy - r * 0.2} ${cx - r * 0.82} ${cy - r * 0.55}`} stroke={CREAM} strokeWidth={r * 0.44 - 18} fill="none" strokeLinecap="round" /></>}
      {/* red stress marks */}
      {[[-1.2, -1.0, -1.45, -1.25], [-1.0, -1.25, -1.15, -1.55], [-0.65, -1.32, -0.7, -1.65]].map(([a, b, c, d], i) => (
        <line key={i} x1={cx + r * a} y1={cy + r * b} x2={cx + r * c} y2={cy + r * d} stroke={RED} strokeWidth={11} strokeLinecap="round" />
      ))}
    </g>
  );
};

/** The receipt with $570 circled - the prop, held up in his right mitten. */
const Receipt: React.FC<{x: number; y: number; rot?: number; s?: number}> = ({x, y, rot = 12, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#rough)">
    <rect x={-110} y={-170} width={240} height={360} fill={RED} opacity={0.35} filter="url(#glow)" />
    <path d="M -100 -160 L 110 -160 L 110 170 L 95 182 L 80 170 L 65 182 L 50 170 L 35 182 L 20 170 L 5 182 L -10 170 L -25 182 L -40 170 L -55 182 L -70 170 L -85 182 L -100 170 Z" fill="#f6f2ea" stroke={OL} strokeWidth={7} />
    {[-120, -92, -64, 70, 98, 126].map((yy, i) => <rect key={yy} x={-76} y={yy} width={i % 2 ? 120 : 150} height={10} rx={4} fill="#b8b2a8" />)}
    <ellipse cx={5} cy={5} rx={92} ry={44} fill="none" stroke={RED} strokeWidth={9} transform="rotate(-6 5 5)" />
    <text x={5} y={26} textAnchor="middle" fontFamily="Permanent Marker" fontSize={62} fill={RED}>$570</text>
    {/* mitten holding it */}
    <ellipse cx={70} cy={150} rx={66} ry={72} fill={CREAM} stroke={OL} strokeWidth={8} />
    <ellipse cx={18} cy={110} rx={22} ry={32} fill={CREAM} stroke={OL} strokeWidth={7} transform="rotate(-30 18 110)" />
  </g>
);

/** Mom in her waitress uniform, holding her open, empty lunch box. */
const Mom: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => (
  <g filter="url(#rough)">
    {/* ponytail behind */}
    <path d={`M ${cx + r * 0.6} ${cy + r * 0.5} C ${cx + r * 1.2} ${cy + r * 0.6} ${cx + r * 1.2} ${cy + r * 1.5} ${cx + r * 1.1} ${cy + r * 2.3} C ${cx + r * 0.9} ${cy + r * 1.8} ${cx + r * 0.8} ${cy + r * 1.1} ${cx + r * 0.5} ${cy + r * 0.8} Z`} fill="#7a4a2c" stroke={OL} strokeWidth={6} />
    {/* body: teal dress + apron + name tag */}
    <path d={`M ${cx - r * 1.1} ${cy + r * 2.6} C ${cx - r * 1.1} ${cy + r * 1.3} ${cx - r * 0.7} ${cy + r * 0.9} ${cx} ${cy + r * 0.9} C ${cx + r * 0.7} ${cy + r * 0.9} ${cx + r * 1.1} ${cy + r * 1.3} ${cx + r * 1.1} ${cy + r * 2.6} Z`} fill="#2f7f7f" stroke={OL} strokeWidth={7} />
    <path d={`M ${cx - r * 0.55} ${cy + r * 1.2} L ${cx + r * 0.55} ${cy + r * 1.2} L ${cx + r * 0.62} ${cy + r * 2.6} L ${cx - r * 0.62} ${cy + r * 2.6} Z`} fill="#f2efe8" stroke={OL} strokeWidth={5} />
    <path d={`M ${cx - r * 0.3} ${cy + r * 0.92} Q ${cx} ${cy + r * 1.08} ${cx + r * 0.3} ${cy + r * 0.92}`} stroke="#f2efe8" strokeWidth={9} fill="none" />
    <rect x={cx + r * 0.32} y={cy + r * 1.0} width={r * 0.36} height={r * 0.16} rx={4} fill={YEL} stroke={OL} strokeWidth={4} />
    {/* head */}
    <circle cx={cx} cy={cy} r={r} fill={TAN} stroke={OL} strokeWidth={8} />
    <path d={`M ${cx - r * 1.01} ${cy + r * 0.1} C ${cx - r * 1.05} ${cy - r * 1.05} ${cx + r * 1.05} ${cy - r * 1.05} ${cx + r * 1.01} ${cy + r * 0.1} C ${cx + r * 0.85} ${cy - r * 0.4} ${cx + r * 0.4} ${cy - r * 0.5} ${cx} ${cy - r * 0.58} C ${cx - r * 0.4} ${cy - r * 0.5} ${cx - r * 0.85} ${cy - r * 0.4} ${cx - r * 1.01} ${cy + r * 0.1} Z`} fill="#7a4a2c" stroke={OL} strokeWidth={7} />
    <line x1={cx} y1={cy - r * 0.98} x2={cx} y2={cy - r * 0.6} stroke={OL} strokeWidth={4} />
    {/* tired eyes + lashes + eye bags, small sad smile */}
    {[-1, 1].map((k) => (
      <g key={k}>
        <path d={`M ${cx + k * r * 0.38 - r * 0.14} ${cy + r * 0.02} q ${r * 0.14} ${r * 0.1} ${r * 0.28} 0`} stroke={OL} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={cx + k * r * 0.38} cy={cy + r * 0.07} r={r * 0.06} fill={OL} />
        <path d={`M ${cx + k * r * 0.38 + k * r * 0.14} ${cy} l ${k * r * 0.08} ${-r * 0.06}`} stroke={OL} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${cx + k * r * 0.38 - r * 0.13} ${cy + r * 0.2} q ${r * 0.13} ${r * 0.07} ${r * 0.26} 0`} stroke="#6a4a3a" strokeWidth={4} fill="none" opacity={0.7} />
        <path d={`M ${cx + k * r * 0.38 - r * 0.16} ${cy - r * 0.16} q ${r * 0.16} ${-r * 0.08} ${r * 0.32} ${k * r * 0.03}`} stroke={OL} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <path d={`M ${cx - r * 0.14} ${cy + r * 0.45} q ${r * 0.14} ${r * 0.08} ${r * 0.28} 0`} stroke={OL} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* empty lunch box, lid open */}
    <g transform={`translate(${cx} ${cy + r * 1.95})`}>
      <rect x={-r * 0.75} y={-r * 0.22} width={r * 1.5} height={r * 0.5} rx={10} fill="#4f7fb8" stroke={OL} strokeWidth={6} />
      <rect x={-r * 0.64} y={-r * 0.14} width={r * 1.28} height={r * 0.28} rx={6} fill="#2e4e7a" />
      <rect x={-r * 0.8} y={-r * 0.5} width={r * 1.55} height={r * 0.16} rx={8} fill="#5b8fcf" stroke={OL} strokeWidth={6} transform={`rotate(-12 ${-r * 0.8} ${-r * 0.3})`} />
      {[-1, 1].map((k) => <ellipse key={k} cx={k * r * 0.8} cy={r * 0.05} rx={r * 0.2} ry={r * 0.24} fill={TAN} stroke={OL} strokeWidth={6} />)}
    </g>
  </g>
);

const Background: React.FC = () => (
  <g>
    <rect width={1280} height={720} fill="#0e0d14" />
    {/* store shelves on the left, lost in the dark */}
    {[260, 380, 500].map((y) => <rect key={y} x={0} y={y} width={190} height={10} fill="#1d1b26" />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 42} y={222} width={30} height={38} rx={4} fill="#1a1822" />)}
    {/* warm diner window behind Mom = the one light source */}
    <rect x={850} y={190} width={400} height={300} fill="#ffb347" opacity={0.85} />
    <rect x={850} y={190} width={400} height={300} fill="none" stroke="#1e1a1e" strokeWidth={12} />
    <line x1={1050} y1={190} x2={1050} y2={490} stroke="#1e1a1e" strokeWidth={10} />
    <ellipse cx={1050} cy={420} rx={460} ry={380} fill="url(#warm)" />
    {/* counter in front of Mom */}
    <rect x={820} y={640} width={460} height={80} fill="#1e1a1e" />
  </g>
);

export const PocketThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <Background />
      <ellipse cx={600} cy={430} rx={300} ry={260} fill="url(#redGlow)" />
      <Mom cx={1060} cy={390} r={96} />
      <ShockedHero cx={410} cy={450} r={185} />
      <Receipt x={690} y={545} rot={14} s={0.95} />
      <Title words={[['WHO ', '#fff'], ['PAID?', YEL]]} size={175} y={175} underline={[300, 1060, 214]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
