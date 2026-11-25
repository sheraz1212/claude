import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CREAM, Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* VOLUME UP thumbnail 1280x720: "CAN YOU HEAR?" - his shocked face with glowing headphones,
   a huge red VOLUME MAX bar in front, Grandpa small in the warm lamp light behind with the harmonica. */
const BLUE = '#3FA9FF';
const WARM = '#ffbf6e';

const Grandpa: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => (
  <g filter="url(#rough)" opacity={0.92}>
    <path d={`M ${cx - r * 1.1} ${cy + r * 2.6} C ${cx - r * 1.1} ${cy + r * 1.3} ${cx - r * 0.7} ${cy + r * 0.9} ${cx} ${cy + r * 0.9} C ${cx + r * 0.7} ${cy + r * 0.9} ${cx + r * 1.1} ${cy + r * 1.3} ${cx + r * 1.1} ${cy + r * 2.6} Z`} fill="#8f8f9c" stroke={OL} strokeWidth={6} />
    <circle cx={cx} cy={cy} r={r} fill="#A9A9B4" stroke={OL} strokeWidth={7} />
    {[-1, 1].map((k) => (
      <g key={k}>
        <circle cx={cx + k * r * 0.36} cy={cy - r * 0.08} r={r * 0.25} fill="none" stroke={OL} strokeWidth={5} />
        <ellipse cx={cx + k * r * 0.36} cy={cy - r * 0.06} rx={r * 0.06} ry={r * 0.04} fill={OL} />
        <path d={`M ${cx + k * r * 0.52} ${cy - r * 0.36} Q ${cx + k * r * 0.35} ${cy - r * 0.44} ${cx + k * r * 0.16} ${cy - r * 0.52}`} stroke={OL} strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={cx + k * r * 0.2} cy={cy + r * 0.38} rx={r * 0.24} ry={r * 0.12} fill="#ece8df" stroke={OL} strokeWidth={4} />
      </g>
    ))}
    <ellipse cx={cx + r * 1.0} cy={cy + r * 0.05} rx={r * 0.1} ry={r * 0.18} fill="#bfae8e" stroke={OL} strokeWidth={4} />
    {/* the harmonica held out */}
    <g transform={`translate(${cx - r * 0.2} ${cy + r * 1.55}) rotate(-8)`}>
      <rect x={-r * 0.75} y={-r * 0.2} width={r * 1.5} height={r * 0.4} rx={6} fill="#c9ccd6" stroke={OL} strokeWidth={5} />
      {Array.from({length: 7}, (_, i) => <rect key={i} x={-r * 0.62 + i * r * 0.19} y={-r * 0.06} width={r * 0.09} height={r * 0.12} fill="#2a2b33" />)}
      <ellipse cx={-r * 0.8} cy={r * 0.05} rx={r * 0.25} ry={r * 0.28} fill="#A9A9B4" stroke={OL} strokeWidth={5} />
    </g>
  </g>
);

const Phones: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => (
  <g filter="url(#rough)">
    <path d={`M ${cx - r * 1.05} ${cy - r * 0.05} A ${r * 1.12} ${r * 1.12} 0 0 1 ${cx + r * 1.05} ${cy - r * 0.05}`} stroke={OL} strokeWidth={34} fill="none" strokeLinecap="round" />
    <path d={`M ${cx - r * 1.05} ${cy - r * 0.05} A ${r * 1.12} ${r * 1.12} 0 0 1 ${cx + r * 1.05} ${cy - r * 0.05}`} stroke="#2c303c" strokeWidth={20} fill="none" strokeLinecap="round" />
    {[-1, 1].map((k) => (
      <g key={k}>
        <ellipse cx={cx + k * r * 1.02} cy={cy + r * 0.05} rx={r * 0.42} ry={r * 0.6} fill={BLUE} opacity={0.35} filter="url(#glow)" />
        <rect x={cx + k * r * 1.02 - r * 0.22} y={cy - r * 0.42} width={r * 0.44} height={r * 0.9} rx={r * 0.2} fill="#262a35" stroke={OL} strokeWidth={8} />
        <circle cx={cx + k * r * 1.02} cy={cy + r * 0.03} r={r * 0.08} fill={BLUE} />
      </g>
    ))}
  </g>
);

const VolumeMax: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-6)`} filter="url(#rough)">
    <rect x={-30} y={-150} width={420} height={210} rx={24} fill={RED} opacity={0.35} filter="url(#glow)" />
    <rect x={-20} y={-140} width={400} height={190} rx={22} fill="#120c10" stroke={OL} strokeWidth={8} />
    <path d="M 10 -60 L 40 -60 L 80 -95 L 80 15 L 40 -20 L 10 -20 Z" fill={RED} />
    {Array.from({length: 8}, (_, i) => <rect key={i} x={105 + i * 30} y={-20 - (20 + i * 11)} width={20} height={20 + i * 11} rx={3} fill={i > 5 ? '#ff8a7a' : RED} />)}
    <text x={250} y={36} textAnchor="middle" fontFamily="Knewave" fontSize={46} fill="#fff" stroke={OL} strokeWidth={6} paintOrder="stroke">MAX</text>
  </g>
);

export const VolumeThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={1100} cy={360} rx={300} ry={260} fill={WARM} opacity={0.22} filter="url(#glow)" />
      <Grandpa cx={1110} cy={330} r={84} />
      <ellipse cx={470} cy={480} rx={330} ry={280} fill={BLUE} opacity={0.12} filter="url(#glow)" />
      <ShockedHero cx={470} cy={480} r={180} look={1} rim={BLUE} handOnHead={false} />
      <Phones cx={470} cy={480} r={180} />
      <VolumeMax x={720} y={665} />
      <Title words={[['CAN YOU ', '#fff'], ['HEAR?', YEL]]} size={150} y={165} underline={[230, 1060, 200]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
