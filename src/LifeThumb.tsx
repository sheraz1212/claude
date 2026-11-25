import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, ShockedHero, Title, YEL} from './PocketThumb';

/* THE LIFE HE POSTED thumbnail 1280x720: "FAKE LIFE?" - his panicked face, a big phone glowing pink in front
   showing his car post with 12,000 likes, and the real bank balance $23 small behind. Only the hero. */
const PINK = '#FF4F8B';
const Heart: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 8 C0 -8 -20 -8 -20 4 C-20 14 -6 18 0 26 C6 18 20 14 20 4 C20 -8 0 -8 0 8Z" fill={PINK} />
);
const Phone: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(8)`} filter="url(#rough)">
    <rect x={-190} y={-250} width={380} height={500} rx={46} fill={PINK} opacity={0.45} filter="url(#glow)" />
    <rect x={-170} y={-230} width={340} height={460} rx={40} fill="#0d0d12" stroke={OL} strokeWidth={9} />
    <rect x={-150} y={-180} width={300} height={220} fill="#ff9a6a" />
    <rect x={-150} y={-60} width={300} height={100} fill="#4a2a4a" />
    <circle cx={90} cy={-130} r={30} fill="#ffe9b8" />
    <path d="M-120 20 L-90 -20 L40 -24 L90 0 L120 20 Z" fill="#e0302a" stroke={OL} strokeWidth={5} />
    <circle cx={-70} cy={22} r={16} fill="#222" /><circle cx={70} cy={22} r={16} fill="#222" />
    <text x={-150} y={-198} fontFamily="Nunito" fontWeight={800} fontSize={26} fill={PINK}>Glimpse</text>
    <Heart x={-128} y={84} s={1.4} />
    <text x={-92} y={112} fontFamily="Knewave" fontSize={48} fill="#fff" stroke={OL} strokeWidth={6} paintOrder="stroke">12,000</text>
    <text x={-150} y={170} fontFamily="Nunito" fontWeight={700} fontSize={22} fill="#d8d8e0">Hard work changes everything.</text>
    {[[-120, -60, 1.1], [110, -150, 0.9], [-30, -120, 0.8], [130, 60, 1], [-140, 180, 0.7]].map(([hx, hy, s], i) => <Heart key={i} x={hx} y={hy} s={s} />)}
  </g>
);
const Bank: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-6)`} filter="url(#rough)" opacity={0.95}>
    <rect x={-110} y={-60} width={220} height={120} rx={20} fill="#0f1420" stroke={OL} strokeWidth={7} />
    <text x={0} y={-18} textAnchor="middle" fontFamily="Nunito" fontWeight={700} fontSize={22} fill="#9aa3ad">BALANCE</text>
    <text x={0} y={36} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={52} fill="#ff5a4a">$23</text>
  </g>
);
export const LifeThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={420} cy={480} rx={340} ry={300} fill={PINK} opacity={0.16} filter="url(#glow)" />
      <ShockedHero cx={410} cy={490} r={180} look={1} rim={PINK} handOnHead veins />
      <Bank x={720} y={640} />
      <Phone x={1000} y={470} />
      <Title words={[['FAKE', YEL], [' LIFE?', '#fff']]} size={170} y={160} underline={[250, 1040, 200]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
