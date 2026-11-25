import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, ShockedHero, Title, YEL} from './PocketThumb';

/* REBUILDING thumbnail 1280x720: "FEEL BROKEN?" - his worried face with dark cracks, some already filled with glowing
   gold, and the golden pen glowing in front. Only the hero. */
const G = '#F2B33D';
const Crack: React.FC<{d: string; gold?: boolean}> = ({d, gold}) => gold
  ? <g><path d={d} stroke={G} strokeWidth={18} fill="none" opacity={0.35} filter="url(#glow)" /><path d={d} stroke={G} strokeWidth={9} fill="none" strokeLinejoin="miter" /><path d={d} stroke="#fff3c4" strokeWidth={3} fill="none" /></g>
  : <path d={d} stroke="#2a1e1e" strokeWidth={8} fill="none" strokeLinejoin="miter" />;
export const GoldThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={460} cy={480} rx={360} ry={320} fill={G} opacity={0.16} filter="url(#glow)" />
      <ShockedHero cx={460} cy={500} r={180} look={1} rim={G} handOnHead={false} veins />
      <Crack d="M 350 360 L 390 410 L 360 450 L 400 500" />
      <Crack d="M 560 350 L 520 400 L 560 440 L 530 480" gold />
      <Crack d="M 430 640 L 470 680 L 440 720" gold />
      <Crack d="M 600 560 L 640 600 L 610 640" />
      <g transform="translate(980 470) rotate(-35)">
        <ellipse cx={0} cy={-60} rx={90} ry={260} fill={G} opacity={0.3} filter="url(#glow)" />
        <rect x={-22} y={-260} width={44} height={260} rx={12} fill={G} stroke="#141217" strokeWidth={8} />
        <rect x={-22} y={-260} width={44} height={50} fill="#3a2a14" />
        <path d="M -22 0 L 22 0 L 0 52 Z" fill="#fff3c4" stroke="#141217" strokeWidth={6} />
      </g>
      <Title words={[['FEEL', '#fff'], [' BROKEN', YEL], ['?', '#fff']]} size={150} y={150} underline={[200, 1080, 192]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
