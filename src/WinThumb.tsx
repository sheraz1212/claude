import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero} from './common/Hero';
import {Demon} from './common/Demon';
import {Light, Stage} from './common/sets';
import {Across, GOLD} from './window/sets';

/* Thumbnail 1280x720: STOP COMPARING. - his sad face lit only by the gold window across. */
export const WinThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}>
      <Stage bg="#0b0a10">
        <g transform="translate(1000 160) scale(0.55)">
          <Across t={1} scene="party" />
        </g>
        <rect width={1920} height={1080} fill="#08070c" opacity={0.25} />
        <Light id="gold" x={1500} y={480} r={1000} color={GOLD} o={0.9} />
        <Demon id="d" x={1180} y={1560} t={1} scale={1.7} size={1} glow={1.1} expr={{brow: -0.7, lid: 0.3, mouth: 0.6, eyeX: 18}} />
        <Hero id="h" x={600} y={2150} scale={3.4} pose="arms-down" glow={0.8} glowColor={GOLD}
          expr={{brow: 1, lid: 0.05, mouth: -0.7, eyeX: 22, eyeY: -4, tear: 0.9, bags: true}} />
      </Stage>
      <div style={{position: 'absolute', top: 30, width: 1920, textAlign: 'center', fontFamily: 'Nunito', fontWeight: 900, fontSize: 190, lineHeight: 1, color: '#fff', WebkitTextStroke: '16px #000', paintOrder: 'stroke fill', letterSpacing: 2}}>
        STOP COMPARING.
      </div>
    </div>
  </AbsoluteFill>
);
