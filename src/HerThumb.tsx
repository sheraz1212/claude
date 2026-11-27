import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, ShockedHero, Title, YEL} from './PocketThumb';

/* AFTER HER thumbnail 1280x720 (new colour theme): "STILL CHECKING?" - his heartbroken face in a deep-blue night room,
   tears, the phone in front glowing pink with her story, and her soft pink memory faint behind him. */
const ROSE = '#FF7A9A';
export const HerThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <defs><linearGradient id="nightRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2346" /><stop offset="1" stopColor="#34407a" /></linearGradient></defs>
      <rect width={1280} height={720} fill="url(#nightRoom)" />
      <rect x={880} y={210} width={300} height={260} fill="#0b1030" stroke="#f3ead8" strokeWidth={10} />
      <circle cx={1110} cy={270} r={26} fill="#fff6d8" />
      <ellipse cx={420} cy={480} rx={340} ry={300} fill={ROSE} opacity={0.16} filter="url(#glow)" />
      <ShockedHero cx={420} cy={500} r={180} look={1} rim={ROSE} handOnHead={false} />
      <g transform="translate(1010 520) rotate(10)" filter="url(#rough)">
        <rect x={-150} y={-210} width={300} height={420} rx={40} fill={ROSE} opacity={0.5} filter="url(#glow)" />
        <rect x={-130} y={-190} width={260} height={380} rx={34} fill="#ff9a8a" stroke={OL} strokeWidth={8} />
        <rect x={-130} y={-40} width={260} height={230} fill="#ffc27a" /><rect x={-130} y={90} width={260} height={100} fill="#2a4a7a" />
        <circle cx={50} cy={-60} r={40} fill="#fff3b0" />
        <circle cx={-90} cy={-150} r={20} fill={ROSE} stroke="#fff" strokeWidth={4} />
        <text x={-60} y={-142} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#fff">her.story</text>
        {[0, 1, 2, 3, 4].map(i => <rect key={i} x={-110 + i * 46} y={-178} width={40} height={6} rx={3} fill="#fff" opacity={i < 3 ? 1 : 0.4} />)}
      </g>
      <Title words={[['STILL', '#fff'], [' CHECKING', YEL], ['?', '#fff']]} size={132} y={140} underline={[150, 1130, 180]} />
      <rect width={1280} height={720} fill="url(#vig)" opacity={0.6} />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.06} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
