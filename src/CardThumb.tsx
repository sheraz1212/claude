import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CREAM, Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* ONE CARD AT A TIME thumbnails 1280x720: "EXAM PRESSURE." / "EXAM STRESS." - he sits with an open book in front of
   him, bloodshot eyes, hand on his head, a tower of books behind. The open book glows - the one prop. Only the hero. */
const COLS = ['#3b6fb6', '#c0453a', '#2e9e6a', '#d9a03a', '#7a4fb0', '#2a8fa0', '#d06a8a', '#5a7a3a'];
const Tower: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g filter="url(#rough)">
    {Array.from({length: 15}, (_, i) => { const w = 230 - (i % 3) * 22, h = 38; return (
      <g key={i} transform={`translate(${x + Math.sin(i * 1.7) * 18 + i * 3} ${y - i * h}) rotate(${Math.sin(i * 2.3) * 4})`}>
        <rect x={-w / 2} y={-h} width={w} height={h} rx={5} fill={COLS[i % 8]} stroke={OL} strokeWidth={5} />
        <rect x={-w / 2 + 16} y={-h / 2 - 3} width={w * 0.3} height={6} fill="#fff" opacity={0.4} />
      </g>); })}
  </g>
);
// the open book on the desk in front of him, red stress scribbles on the pages
const OpenBook: React.FC = () => (
  <g filter="url(#rough)">
    <rect x={0} y={640} width={1280} height={80} fill="#1d1922" />
    <path d="M 200 720 L 300 560 L 600 585 L 900 560 L 1000 720 Z" fill={YEL} opacity={0.35} filter="url(#glow)" />
    <path d="M 240 712 L 320 572 L 600 596 L 600 712 Z" fill="#f7f4ec" stroke={OL} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 960 712 L 880 572 L 600 596 L 600 712 Z" fill="#efe8d4" stroke={OL} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2, 3].map(i => <g key={i}><path d={`M ${330 - i * 10} ${615 + i * 24} L ${570} ${625 + i * 24}`} stroke="#b9b2a2" strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${630} ${625 + i * 24} L ${870 + i * 10} ${615 + i * 24}`} stroke="#b9b2a2" strokeWidth={6} strokeLinecap="round" /></g>)}
    <path d="M 360 640 L 520 650" stroke={YEL} strokeWidth={14} opacity={0.8} strokeLinecap="round" />
    <path d="M 680 612 q 30 -30 60 0 t 60 0 t 60 0" stroke={RED} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M 700 662 l 50 30 m 0 -30 l -50 30" stroke={RED} strokeWidth={8} strokeLinecap="round" />
    <path d="M 760 560 C 820 560 860 600 870 640" stroke={OL} strokeWidth={84} fill="none" strokeLinecap="round" />
    <path d="M 760 560 C 820 560 860 600 870 640" stroke={CREAM} strokeWidth={66} fill="none" strokeLinecap="round" />
    <ellipse cx={878} cy={660} rx={52} ry={42} fill={CREAM} stroke={OL} strokeWidth={9} />
  </g>
);
const Thumb: React.FC<{words: [string, string][]; size: number; line: [number, number, number]}> = ({words, size, line}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={1050} cy={430} rx={260} ry={300} fill="#ffbf6e" opacity={0.14} filter="url(#glow)" />
      <Tower x={1060} y={720} />
      <ellipse cx={600} cy={430} rx={360} ry={300} fill={YEL} opacity={0.12} filter="url(#glow)" />
      <ShockedHero cx={600} cy={400} r={170} look={0} rim={YEL} handOnHead veins />
      <OpenBook />
      <Title words={words} size={size} y={150} underline={line} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
export const CardThumbPressure: React.FC = () => <Thumb words={[['EXAM', '#fff'], [' PRESSURE', YEL], ['.', '#fff']]} size={132} line={[150, 1130, 190]} />;
export const CardThumbStress: React.FC = () => <Thumb words={[['EXAM', '#fff'], [' STRESS', YEL], ['.', '#fff']]} size={160} line={[220, 1060, 196]} />;
