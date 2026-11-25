import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HeroSide} from './common/HeroSide';
import {Stage} from './common/sets';
import {SchoolTrack, Bib} from './kid/sets';
export const SideTest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill>
      <Stage>
        <SchoolTrack t={t} />
        <HeroSide id="a" x={300} y={930} scale={0.68} phase={0.3} run={1} brow={-0.3} mouth={0.8} />
        <HeroSide id="b" x={700} y={930} scale={0.68} phase={1.8} run={1} color="#a6a9b0" accessory="cap" accessoryColor="#8a3b3b" />
        <HeroSide id="c" x={1100} y={930} scale={0.68} phase={0.8} run={0} color="#c9ad86" accessory="headband" accessoryColor="#4f7fa8" />
        <HeroSide id="d" x={1500} y={930} scale={0.68} dir={-1} brow={0.6} mouth={-0.5} />
      </Stage>
    </AbsoluteFill>
  );
};
