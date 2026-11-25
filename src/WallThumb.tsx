import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Defs, OL, ShockedHero, Title, YEL} from './PocketThumb';

/* THE LAST WORD thumbnail 1280x720: "ALWAYS RIGHT?" - his shocked face behind a tall brick wall that rises around him,
   warm light from the other side. Only the hero. */
const BR = ['#9a4a2c', '#8a4026', '#a5532f'];
const Wall: React.FC<{x: number; y: number; w: number; rows: number}> = ({x, y, w, rows}) => (
  <g filter="url(#rough)">
    {Array.from({length: rows}, (_, r) => Array.from({length: Math.ceil(w / 90) + 1}, (_, c) => {
      const bx = x + c * 90 - (r % 2 ? 45 : 0); if (bx > x + w || bx + 86 < x) return null;
      const x0 = Math.max(bx, x), x1 = Math.min(bx + 86, x + w);
      return <rect key={r + '-' + c} x={x0} y={y - (r + 1) * 42} width={x1 - x0} height={38} fill={BR[(r + c) % 3]} stroke="#2a1a14" strokeWidth={4} />; }))}
  </g>
);
export const WallThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <svg width={1280} height={720}>
      <Defs />
      <rect width={1280} height={720} fill="#0b0a0f" />
      <ellipse cx={1050} cy={420} rx={300} ry={320} fill="#ffbf6e" opacity={0.25} filter="url(#glow)" />
      <ellipse cx={430} cy={480} rx={340} ry={300} fill="#E8743B" opacity={0.14} filter="url(#glow)" />
      <ShockedHero cx={430} cy={500} r={175} look={1} rim="#E8743B" handOnHead={false} veins />
      <Wall x={720} y={740} w={360} rows={13} />
      <Wall x={-20} y={740} w={180} rows={10} />
      <Title words={[['ALWAYS', '#fff'], [' RIGHT', YEL], ['?', '#fff']]} size={150} y={150} underline={[180, 1100, 192]} />
      <rect width={1280} height={720} fill="url(#vig)" />
      <rect width={1280} height={720} filter="url(#grain)" opacity={0.08} style={{mixBlendMode: 'screen'}} />
    </svg>
  </AbsoluteFill>
);
