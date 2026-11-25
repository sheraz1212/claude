import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero} from './common/Hero';
import {Demon} from './common/Demon';
import {Light, Stage} from './common/sets';
import {Bib, JACKET, SchoolTrack} from './kid/sets';

/* Thumbnail 1280x720 (drawn at 1920x1080 and scaled). Text: STOPPED RUNNING? */
export const KidThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, transform: 'scale(0.6667)', transformOrigin: '0 0'}}>
      <Stage>
        <SchoolTrack t={1} crowd={0} lights={1.2} />
        <rect width={1920} height={1080} fill="#08070c" opacity={0.55} />
        <Light id="spot" x={1500} y={80} r={900} color="#ffe6b0" o={0.8} />
        <Demon id="d" x={1520} y={1560} t={1} scale={2.0} size={1} glow={1.3} expr={{brow: -0.7, lid: 0.3, mouth: 0.6}} />
        <Hero id="h" x={640} y={2150} scale={3.4} pose="arms-down" jacket={JACKET} glow={0.5} glowColor="#ffe6b0"
          expr={{brow: 1, lid: 0, mouth: -0.8, eyeX: 10, eyeY: -2, tear: 0.8, bags: true}} />
        
      </Stage>
      <div style={{position: 'absolute', top: 30, width: 1920, textAlign: 'center', fontFamily: 'Nunito', fontWeight: 900, fontSize: 190, lineHeight: 1, color: '#fff', WebkitTextStroke: '16px #000', paintOrder: 'stroke fill', letterSpacing: 2}}>
        STOPPED RUNNING?
      </div>
    </div>
  </AbsoluteFill>
);
