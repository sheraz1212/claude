import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* ALL IN thumbnail 1280x720: "ALL IN?" - his shocked face lit by the phone, the phone big in front glowing red
   with "YOU LOST -$8,400", green coins falling, no other character. */
const Phone: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 10}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#rough)">
    <rect x={-135} y={-225} width={270} height={450} rx={44} fill={RED} opacity={0.4} filter="url(#glow)" />
    <rect x={-120} y={-210} width={240} height={420} rx={32} fill="#0b0a0d" stroke={OL} strokeWidth={8} />
    <rect x={-104} y={-192} width={208} height={384} rx={22} fill="#1a0b0b" />
    <text x={0} y={-120} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={30} fill="#2BD96B">LuckyLine</text>
    <text x={0} y={-30} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={42} fill="#ff6a5a">YOU LOST</text>
    <text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={52} fill="#fff">-$8,400</text>
    <rect x={-80} y={95} width={160} height={50} rx={25} fill="#2BD96B" />
    <text x={0} y={128} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#06150c">ALL IN</text>
    <ellipse cx={-110} cy={150} rx={60} ry={68} fill="#F3EBCF" stroke={OL} strokeWidth={8} />
  </g>
);
const Coin: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => (
  <g opacity={o}><circle cx={x} cy={y} r={r} fill="#2BD96B" stroke="#0b5a2a" strokeWidth={4} /><text x={x} y={y + r * 0.38} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={r * 1.1} fill="#0b5a2a">$</text></g>
);
const Marcus: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => (
  <g filter="url(#rough)" opacity={0.9}>
    <path d={`M ${cx - r * 1.1} ${cy + r * 2.6} C ${cx - r * 1.1} ${cy + r * 1.3} ${cx - r * 0.7} ${cy + r * 0.9} ${cx} ${cy + r * 0.9} C ${cx + r * 0.7} ${cy + r * 0.9} ${cx + r * 1.1} ${cy + r * 1.3} ${cx + r * 1.1} ${cy + r * 2.6} Z`} fill="#b8966a" stroke={OL} strokeWidth={6} />
    <circle cx={cx} cy={cy} r={r} fill="#C9A77A" stroke={OL} strokeWidth={6} />
    <path d={`M ${cx - r * 1.02} ${cy - r * 0.1} A ${r} ${r} 0 0 1 ${cx + r * 1.02} ${cy - r * 0.1} Z`} fill="#2f4f7a" stroke={OL} strokeWidth={5} />
    <ellipse cx={cx - r * 0.7} cy={cy - r * 0.15} rx={r * 0.7} ry={r * 0.14} fill="#2f4f7a" stroke={OL} strokeWidth={5} />
    {[-1, 1].map((k) => (<g key={k}><ellipse cx={cx + k * r * 0.35} cy={cy + r * 0.2} rx={r * 0.08} ry={r * 0.1} fill={OL} /><path d={`M ${cx + k * r * 0.52} ${cy + r * 0.0} Q ${cx + k * r * 0.35} ${cy - r * 0.08} ${cx + k * r * 0.16} ${cy - r * 0.16}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" /></g>))}
    <path d={`M ${cx - r * 0.25} ${cy + r * 0.62} Q ${cx} ${cy + r * 0.45} ${cx + r * 0.25} ${cy + r * 0.62}`} stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);
export const AllInThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={430} cy={470} rx={340} ry={300} fill="#2BD96B" opacity={0.14} filter="url(#glow)" />
      {[[120, 300, 26], [250, 620, 22], [620, 300, 20], [1120, 640, 30], [1010, 250, 22], [60, 560, 20], [1180, 330, 26], [1080, 470, 18]].map(([x, y, r], i) => <Coin key={i} x={x} y={y} r={r} o={0.85} />)}
      <ShockedHero cx={420} cy={490} r={180} look={1} rim="#2BD96B" handOnHead veins />
      <Phone x={850} y={480} rot={10} />
      <Title words={[['ALL ', '#fff'], ['IN?', YEL]]} size={170} y={160} underline={[330, 960, 200]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
