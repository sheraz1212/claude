import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero} from './common/Hero';
import {Demon} from './common/Demon';
import {Light, Stage} from './common/sets';
import {SCREEN, WallClock} from './rest/sets';

/* Thumbnail 1280x720: CAN'T REST? - his exhausted face lit only by the laptop, the clock at 3:07, the demon leaning in. */
export const RestThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}>
      <Stage bg="#0c0b12">
        <rect width={1920} height={1080} fill="#15141d" />
        <WallClock x={1640} y={420} time="3:07" r={120} />
        <Demon id="d" x={1330} y={1700} t={1} scale={1.5} size={1} glow={1.1} lean={-8} expr={{brow: -0.7, lid: 0.3, mouth: 0.6, eyeX: -20}} />
        <Light id="lap" x={700} y={1080} r={1000} color={SCREEN} o={0.95} />
        <Hero id="h" x={700} y={2390} scale={3.3} pose="arms-down" glow={0.9} glowColor={SCREEN}
          expr={{brow: 1, lid: 0, mouth: -0.6, eyeY: 8, bags: true}} />
        {/* sweat drops */}
        <path d="M 1000 470 q -34 62 0 86 q 34 -24 0 -86 Z" fill="#b9d4f7" stroke="#23262c" strokeWidth={6} />
        <path d="M 395 520 q -22 40 0 56 q 22 -16 0 -56 Z" fill="#b9d4f7" stroke="#23262c" strokeWidth={5} />
        {/* the laptop lid (back to camera), its screen light spilling up onto his face */}
        <rect x={420} y={985} width={560} height={120} rx={14} fill="#2b2d35" stroke="#23262c" strokeWidth={8} />
        <rect x={430} y={978} width={540} height={8} rx={4} fill="#b9d4f7" opacity={0.9} />
        <circle cx={700} cy={1040} r={16} fill="#3a3c46" />
      </Stage>
      <div style={{position: 'absolute', top: 30, width: 1920, textAlign: 'center', fontFamily: 'Nunito', fontWeight: 900, fontSize: 200, lineHeight: 1, color: '#fff', WebkitTextStroke: '16px #000', paintOrder: 'stroke fill', letterSpacing: 2}}>
        CAN'T REST?
      </div>
    </div>
  </AbsoluteFill>
);
