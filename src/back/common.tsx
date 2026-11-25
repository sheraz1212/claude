import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Person} from '../common/sets';
import {FilmLook} from '../common/Overlays';
import {FPS} from '../common/theme';
import {FRIEND, RewindFX, YearHUD} from './sets';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The best friend (grey, mustard scarf). */
export const Pal: React.FC<Partial<React.ComponentProps<typeof Person>> & {x: number; y: number}> = (p) => (
  <Person id={`pal${p.x}${p.y}`} color={FRIEND.color} accessory={FRIEND.accessory} accessoryColor={FRIEND.accessoryColor} {...p} />
);

/**
 * Frame for one "year" clip: it opens out of the previous rewind (0–0.8 s),
 * and the last 3.5 s rewind the previous 3.5 s of picture backwards into the earlier year.
 */
export const YearClip: React.FC<{year: string; prev: string; shots: (t: number) => React.ReactNode; children?: React.ReactNode; noRewind?: boolean}> = ({year, prev, shots, children, noRewind}) => {
  const t = useCurrentFrame() / FPS;
  const rewinding = !noRewind && t >= 31.5;
  const tt = rewinding ? 31.5 - (t - 31.5) * 1.6 : t;
  const pIn = interpolate(t, [0, 0.8], [0.5, 1], cl);
  const pOut = rewinding ? interpolate(t, [31.5, 35], [0, 1], cl) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(tt)}
      <FilmLook />
      <YearHUD year={rewinding && t > 33.2 ? prev : year} flash={rewinding && t > 33.2 ? interpolate(t, [33.2, 34], [1, 0], cl) : t < 1 ? 1 - t : 0} />
      <RewindFX p={t < 0.8 ? pIn : pOut} />
      {children}
    </AbsoluteFill>
  );
};
