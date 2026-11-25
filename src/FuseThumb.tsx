import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* SHORT FUSE thumbnail 1280x720: "ALWAYS ANGRY?" - his stressed face with red veins, a lit fuse burning down
   on top of his head (the prop, glowing), little Sam small in the warm light behind holding his broken rocket. */
const FIRE = '#FFB21E';
const Fuse: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g filter="url(#rough)">
    <path d={`M ${x} ${y} C ${x + 30} ${y - 35} ${x - 10} ${y - 60} ${x + 20} ${y - 90}`} stroke={OL} strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d={`M ${x} ${y} C ${x + 30} ${y - 35} ${x - 10} ${y - 60} ${x + 20} ${y - 90}`} stroke="#9a7a4e" strokeWidth={12} fill="none" strokeLinecap="round" />
    <circle cx={x + 20} cy={y - 95} r={70} fill={FIRE} opacity={0.5} filter="url(#glow)" />
    <circle cx={x + 20} cy={y - 95} r={20} fill="#fff6d8" />
    {Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2, r0 = 22, r1 = 48 + (i % 3) * 14; return <line key={i} x1={x + 20 + Math.cos(a) * r0} y1={y - 95 + Math.sin(a) * r0} x2={x + 20 + Math.cos(a) * r1} y2={y - 95 + Math.sin(a) * r1} stroke="#ffd36a" strokeWidth={6} strokeLinecap="round" />; })}
  </g>
);
const Sam: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => (
  <g filter="url(#rough)" opacity={0.95}>
    <path d={`M ${cx - r * 1.0} ${cy + r * 2.4} C ${cx - r} ${cy + r * 1.2} ${cx - r * 0.6} ${cy + r * 0.9} ${cx} ${cy + r * 0.9} C ${cx + r * 0.6} ${cy + r * 0.9} ${cx + r} ${cy + r * 1.2} ${cx + r} ${cy + r * 2.4} Z`} fill="#b8966a" stroke={OL} strokeWidth={6} />
    <circle cx={cx} cy={cy} r={r} fill="#C9A77A" stroke={OL} strokeWidth={6} />
    <path d={`M ${cx - r * 1.02} ${cy - r * 0.1} A ${r} ${r} 0 0 1 ${cx + r * 1.02} ${cy - r * 0.1} Z`} fill="#b8483a" stroke={OL} strokeWidth={5} />
    <ellipse cx={cx + r * 0.7} cy={cy - r * 0.15} rx={r * 0.7} ry={r * 0.14} fill="#b8483a" stroke={OL} strokeWidth={5} />
    {[-1, 1].map((k) => (
      <g key={k}>
        <ellipse cx={cx + k * r * 0.35} cy={cy + r * 0.2} rx={r * 0.08} ry={r * 0.1} fill={OL} />
        <path d={`M ${cx + k * r * 0.52} ${cy + r * 0.0} Q ${cx + k * r * 0.35} ${cy - r * 0.08} ${cx + k * r * 0.16} ${cy - r * 0.16}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <path d={`M ${cx - r * 0.25} ${cy + r * 0.62} Q ${cx} ${cy + r * 0.45} ${cx + r * 0.25} ${cy + r * 0.62}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />
    <ellipse cx={cx - r * 0.38} cy={cy + r * 0.45} rx={r * 0.07} ry={r * 0.12} fill="#dfefff" />
    {/* the broken rocket in his hands */}
    <g transform={`translate(${cx + r * 0.2} ${cy + r * 1.6}) rotate(-25)`}>
      <rect x={-r * 0.25} y={-r * 0.5} width={r * 0.5} height={r * 0.7} rx={6} fill="#efe8d4" stroke={OL} strokeWidth={4} />
      <path d={`M ${-r * 0.25} ${-r * 0.5} L 0 ${-r * 0.95} L ${r * 0.25} ${-r * 0.5} Z`} fill="#d0453a" stroke={OL} strokeWidth={4} transform={`translate(${r * 0.5} ${r * 0.2}) rotate(50)`} />
    </g>
  </g>
);
export const FuseThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={1050} cy={430} rx={260} ry={240} fill="#ffbf6e" opacity={0.18} filter="url(#glow)" />
      <Sam cx={1060} cy={420} r={78} />
      <ellipse cx={480} cy={430} rx={360} ry={320} fill={FIRE} opacity={0.16} filter="url(#glow)" />
      <ShockedHero cx={480} cy={500} r={180} look={1} rim={FIRE} handOnHead veins />
      <Fuse x={490} y={335} />
      <Title words={[['ALWAYS ', '#fff'], ['ANGRY?', YEL]]} size={150} y={150} underline={[200, 1080, 190]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
