import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, ShockedHero, Title, YEL} from './PocketThumb';

/* THE RED STRING thumbnail 1280x720: "OVERTHINKING?" - his panicked face, red threads spooling out of his head and wrapping
   around him, a phone glowing in front: "Read 2:14 AM". Only the hero. */
const SC = '#FF2E4D';
const Threads: React.FC<{cx: number; cy: number}> = ({cx, cy}) => (
  <g fill="none" strokeLinecap="round">
    {Array.from({length: 13}, (_, i) => { const a = -Math.PI + i * (Math.PI / 12) + 0.1, r1 = 260 + (i % 3) * 60, r2 = 620;
      const d = `M ${cx} ${cy - 150} Q ${cx + Math.cos(a) * r1} ${cy - 150 + Math.sin(a) * r1 - 80} ${cx + Math.cos(a + 0.3) * r2} ${cy - 150 + Math.sin(a + 0.3) * r2}`;
      return <g key={i}><path d={d} stroke={SC} strokeWidth={16} opacity={0.18} /><path d={d} stroke={SC} strokeWidth={5} /></g>; })}
    {[0, 1, 2, 3].map(i => <g key={i}><ellipse cx={cx} cy={cy + 240 + i * 36} rx={230} ry={46} stroke={SC} strokeWidth={16} opacity={0.18} transform={`rotate(${i % 2 ? 6 : -6} ${cx} ${cy + 240})`} />
      <ellipse cx={cx} cy={cy + 240 + i * 36} rx={230} ry={46} stroke={SC} strokeWidth={5} transform={`rotate(${i % 2 ? 6 : -6} ${cx} ${cy + 240})`} /></g>)}
  </g>
);
const Phone: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-8)`} filter="url(#rough)">
    <rect x={-150} y={-230} width={300} height={460} rx={40} fill={SC} opacity={0.45} filter="url(#glow)" />
    <rect x={-130} y={-210} width={260} height={420} rx={34} fill="#0d0d12" stroke={OL} strokeWidth={8} />
    <text x={-100} y={-150} fontFamily="Nunito" fontWeight={800} fontSize={26} fill="#fff">Boss</text>
    <rect x={-70} y={-110} width={180} height={86} rx={22} fill="#1f6b3d" />
    <rect x={-50} y={-88} width={130} height={10} rx={5} fill="#cfe8d6" /><rect x={-50} y={-62} width={90} height={10} rx={5} fill="#cfe8d6" />
    <text x={110} y={10} textAnchor="end" fontFamily="Nunito" fontWeight={800} fontSize={30} fill="#9aa3ad">Read</text>
    <text x={110} y={56} textAnchor="end" fontFamily="Knewave" fontSize={50} fill={SC} stroke={OL} strokeWidth={5} paintOrder="stroke">2:14 AM</text>
  </g>
);
export const StringThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={430} cy={470} rx={360} ry={320} fill={SC} opacity={0.14} filter="url(#glow)" />
      <Threads cx={430} cy={490} />
      <ShockedHero cx={430} cy={490} r={175} look={1} rim={SC} handOnHead veins />
      <g fill="none" strokeLinecap="round">{[0, 1, 2].map(i => <g key={i}><ellipse cx={430} cy={680 + i * 30} rx={200} ry={36} stroke={SC} strokeWidth={5} transform={`rotate(${i % 2 ? 5 : -5} 430 680)`} /></g>)}</g>
      <Phone x={1000} y={470} />
      <Title words={[['OVER', '#fff'], ['THINKING', YEL], ['?', '#fff']]} size={140} y={150} underline={[190, 1100, 190]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
