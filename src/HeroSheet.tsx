import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero} from './common/Hero';
import {HeroSide} from './common/HeroSide';

/* The channel hero on a plain background: front view + side view. */
export const HeroSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#d9d9dc'}}>
    <svg width={1920} height={1080}>
      <Hero id="hf" x={700} y={1000} scale={1.45} pose="arms-down" expr={{brow: 0, lid: 0, mouth: 0.4}} />
      <HeroSide id="hs" x={1250} y={1000} scale={1.45} dir={-1} mouth={0.4} />
    </svg>
  </AbsoluteFill>
);
