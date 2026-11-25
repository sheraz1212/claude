import React from 'react';
import {Hero, Expression} from '../common/Hero';
import {SCREEN} from './sets';

/** Hero sitting behind the desk (draw BEFORE <Desk/>). */
export const AtDesk: React.FC<{t: number; expr?: Expression; glow?: number; typing?: boolean; chair?: boolean}> = ({t, expr, glow = 0.8, typing = true, chair = true}) => (
  <g>
    {chair && <rect x={895} y={540} width={130} height={170} rx={20} fill="#2c2a34" stroke="#23262c" strokeWidth={4} />}
    <Hero id="hd" x={960} y={724 + (typing ? Math.abs(Math.sin(t * 7)) * 3 : 0)} scale={0.8} sit pose="arms-down" lHand={[-60, -130]} rHand={[60, -130]} glow={glow} glowColor={SCREEN}
      expr={{brow: 0.2, lid: 0.3, mouth: -0.1, eyeY: 8, ...expr}} />
  </g>
);

/** Hero sitting on the sofa. */
export const OnSofa: React.FC<{expr?: Expression; x?: number; cup?: boolean; glow?: number; glowColor?: string}> = ({expr, x = 380, cup = false, glow = 0, glowColor}) => (
  <Hero id="hs" x={x} y={746} scale={0.8} sit pose="arms-down" rHand={cup ? [60, -170] : undefined} rHold={cup ? 'cup' : 'none'} glow={glow} glowColor={glowColor}
    expr={{brow: 0, lid: 0.3, mouth: 0.3, ...expr}} />
);
