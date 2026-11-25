import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CREAM, Defs, OL, RED, ShockedHero, Title, YEL} from './PocketThumb';

/* ONE MORE VIDEO thumbnail 1280x720: "ONE MORE?" - his exhausted, shocked face lit dark-yellow by the phone
   in his hand (screen: blurred glow + "next video" ring, nothing visible), the red demon leaning in behind him. */
const AMBER = '#E8A317';

const Phone: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 10}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#rough)">
    <rect x={-120} y={-200} width={240} height={410} rx={40} fill={AMBER} opacity={0.3} filter="url(#glow)" />
    <rect x={-115} y={-200} width={230} height={410} rx={30} fill="#0b0a0d" stroke={OL} strokeWidth={8} />
    <rect x={-100} y={-182} width={200} height={372} rx={20} fill="#2a1d08" />
    <g filter="url(#blur6)">
      <rect x={-88} y={-170} width={86} height={120} rx={10} fill={AMBER} />
      <rect x={4} y={-170} width={86} height={120} rx={10} fill="#b8741a" />
      <rect x={-88} y={-40} width={86} height={120} rx={10} fill="#8a5a1a" />
      <rect x={4} y={-40} width={86} height={120} rx={10} fill="#ffc94a" />
    </g>
    <circle cx={0} cy={135} r={34} fill="none" stroke="#fff" strokeWidth={7} />
    <path d="M -10 120 L 16 135 L -10 150 Z" fill="#fff" />
    <text x={0} y={186} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#fff">next video...</text>
    {/* his mitten holding it */}
    <ellipse cx={-90} cy={150} rx={60} ry={68} fill={CREAM} stroke={OL} strokeWidth={8} />
    <ellipse cx={-120} cy={95} rx={22} ry={30} fill={CREAM} stroke={OL} strokeWidth={7} transform="rotate(25 -120 95)" />
  </g>
);

const DemonBehind: React.FC = () => (
  <g filter="url(#rough)">
    <ellipse cx={1010} cy={420} rx={330} ry={300} fill={RED} opacity={0.28} filter="url(#glow)" />
    <path d="M 760 760 C 760 560 840 520 1010 520 C 1180 520 1260 560 1260 760 Z" fill="#141013" stroke={RED} strokeWidth={9} />
    <circle cx={1010} cy={360} r={170} fill="#141013" stroke={RED} strokeWidth={10} />
    <path d="M 920 330 Q 950 300 985 322 M 1100 330 Q 1070 300 1035 322" stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" />
    <ellipse cx={955} cy={360} rx={22} ry={12} fill={RED} />
    <ellipse cx={1065} cy={360} rx={22} ry={12} fill={RED} />
    <path d="M 950 430 Q 1010 470 1075 425" stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" />
    <text x={1010} y={640} textAnchor="middle" fontFamily="Caveat Brush" fontSize={78} fill={RED} transform="rotate(-6 1010 640)">one more.</text>
  </g>
);

export const OneThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <DemonBehind />
      <ellipse cx={560} cy={470} rx={330} ry={280} fill={AMBER} opacity={0.18} filter="url(#glow)" />
      <ShockedHero cx={400} cy={470} r={185} look={1} rim={AMBER} handOnHead={false} veins glint="#ffc94a" />
      <Phone x={690} y={470} rot={12} />
      <Title words={[['LUST ', YEL], ['WON?', '#fff']]} size={185} y={180} underline={[290, 1050, 220]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
