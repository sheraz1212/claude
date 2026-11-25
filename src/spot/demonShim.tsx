import React from 'react';
import {Demon, DEMON_BODY, DEMON_RED} from '../common/Demon';

/** Spotlight remake: maps the old Blob calls onto the new red/black Demon. */
export const Blob: React.FC<{
  id: string; x: number; y: number; t: number; size?: number; melt?: number; lean?: number; eyeX?: number;
  lid?: number; smile?: number; glow?: number; opacity?: number; hs?: number; accent?: string; reach?: unknown;
}> = ({id, x, y, t, size = 1, melt = 0, lean = 0, eyeX = 0, lid = 0.35, smile = 0.5, glow = 1, opacity = 1, hs = 0.85}) => {
  const ds = Math.min(1.15, 0.35 + 0.7 * size) * (1 - melt * 0.35);
  return (
    <Demon id={id} x={x} y={y} t={t} scale={hs} size={ds} crack={melt} glow={glow * (1 - melt * 0.5)} opacity={opacity * (1 - melt * 0.3)}
      headTilt={-lean * 10} lean={-lean * 4} expr={{brow: melt > 0.4 ? 0.5 : -0.6, lid: Math.min(0.6, lid), mouth: melt > 0.4 ? -0.4 : smile * 0.5, eyeX}} />
  );
};

/** The demon's hands resting on the hero's shoulders (drawn over the hero). */
export const DemonGrip: React.FC<{x: number; y: number; hs: number; o?: number}> = ({x, y, hs, o = 1}) => (
  <g opacity={o}>
    {[-1, 1].map((sd) => (
      <ellipse key={sd} cx={x + sd * 58 * hs} cy={y - 292 * hs} rx={26 * hs} ry={22 * hs} fill={DEMON_BODY} stroke={DEMON_RED} strokeWidth={3 * hs} style={{filter: `drop-shadow(0 0 ${6 * hs}px ${DEMON_RED})`}} />
    ))}
  </g>
);

/** The demon's words, fading in/out with a tiny tremble. Place inside a <Sequence>. */
import {interpolate, useCurrentFrame} from 'remotion';
import {DemonWords} from '../common/Demon';
export const DemonSay: React.FC<{text: string; x: number; y: number; dur: number; size?: number}> = ({text, x, y, dur, size = 62}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <DemonWords text={text} x={x + Math.sin(f * 0.9) * 1.5} y={y + Math.cos(f * 1.1) * 1.5} size={size} o={o} />;
};
