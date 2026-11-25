import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* EXCUSES thumbnail 1280x720: "TOMORROW?" - his stressed face, a big PROGRESS bar at 0% glowing red in front,
   the alarm clock showing 6:00 small behind. Only the hero. */
const Bar: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-6)`} filter="url(#rough)">
    <rect x={-250} y={-90} width={500} height={180} rx={30} fill={RED} opacity={0.4} filter="url(#glow)" />
    <rect x={-235} y={-75} width={470} height={150} rx={26} fill="#120c10" stroke={OL} strokeWidth={8} />
    <text x={-200} y={-22} fontFamily="Nunito" fontWeight={800} fontSize={34} fill="#fff">PROGRESS</text>
    <text x={200} y={-18} textAnchor="end" fontFamily="Knewave" fontSize={46} fill="#ff6a5a" stroke={OL} strokeWidth={5} paintOrder="stroke">0%</text>
    <rect x={-200} y={14} width={400} height={36} rx={18} fill="#2a2730" stroke="#ff6a5a" strokeWidth={4} />
    <circle cx={-190} cy={32} r={20} fill="#fff" stroke={OL} strokeWidth={4} />
  </g>
);
const Clock: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(8)`} filter="url(#rough)" opacity={0.95}>
    <rect x={-95} y={-60} width={190} height={110} rx={20} fill="#1b1a22" stroke={OL} strokeWidth={7} />
    <text x={0} y={18} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={58} fill="#ff5a4a">6:00</text>
    <ellipse cx={0} cy={-5} rx={90} ry={50} fill="#ff5a4a" opacity={0.18} filter="url(#glow)" />
  </g>
);
export const ExcusesThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={1080} cy={380} rx={240} ry={200} fill="#ffbf6e" opacity={0.14} filter="url(#glow)" />
      <Clock x={1090} y={350} />
      <ellipse cx={440} cy={470} rx={340} ry={300} fill="#FFA630" opacity={0.14} filter="url(#glow)" />
      <ShockedHero cx={430} cy={490} r={180} look={1} rim="#FFA630" handOnHead veins />
      <Bar x={890} y={560} />
      <Title words={[['TOMORROW', YEL], ['?', '#fff']]} size={160} y={160} underline={[230, 1060, 200]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
