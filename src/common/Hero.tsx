import React from 'react';
import {C} from './theme';

/**
 * The hero, drawn to match references/hero.png.
 * Local coordinates: origin at his feet (0,0), head centre at (0,-330), head radius 100.
 * Teal wristband is always on HIS RIGHT wrist (viewer's left in front view).
 */
export type Expression = {
  brow?: number; // + = worried/sad (inner ends up), - = determined (inner ends down)
  lid?: number; // 0 open .. 1 closed (upper eyelid)
  mouth?: number; // -1 frown .. +1 smile
  eyeX?: number; // gaze offset
  eyeY?: number;
  bags?: boolean; // tired under-eye lines
  tear?: number; // 0..1
};

type Props = {
  id: string;
  x: number;
  y: number;
  scale?: number;
  expr?: Expression;
  blink?: number; // 0..1, overrides lid when larger
  headTilt?: number; // degrees
  lean?: number; // degrees, whole upper body around the hips
  pose?: 'phone' | 'arms-down';
  glow?: number; // 0..1 cold phone glow on face/body
  glowColor?: string;
  shimmer?: number; // scroll offset for light bands on face (close-ups)
  shimmerAmount?: number;
  thumb?: number; // 0..1 thumb flick position
  showLegs?: boolean;
  /** custom arms: hand targets in local coords (overrides pose). l = HIS right arm (viewer's left, wristband). */
  lHand?: [number, number];
  rHand?: [number, number];
  /** what each hand holds */
  lHold?: Hold;
  rHold?: Hold;
  /** both hands hold one phone between them at this point (back to camera) */
  phoneAt?: [number, number];
  walk?: number; // walk-cycle phase in radians (needs showLegs)
  color?: string; // body colour (supporting characters: grey / tan)
  accessory?: Accessory;
  accessoryColor?: string;
  band?: boolean; // teal wristband (hero only)
  back?: boolean; // seen from behind: no face; wristband shows on the viewer's right
  smallScale?: number; // child characters
  sit?: boolean; // seated: short legs hang over the seat edge, feet below
  guitar?: boolean;
  ink?: string; // colour of eyes, brows, mouth (demon: red)
  classic?: boolean; // old short build (default: taller young-man build)
  jacket?: string; // jacket colour (body + sleeves)
  shoes?: string; // shoe colour (feet)
  apron?: string; // work apron colour (waitress uniform)
  bandColor?: string; // acoustic guitar across the body (pair with lHand ~[-20,-120] strum, rHand ~[120,-205] neck)
};

export type Hold = 'none' | 'phone' | 'phone-flat' | 'phone-screen' | 'toothbrush' | 'ball' | 'charger' | 'spoon' | 'pencil' | 'cup';
export type Accessory = 'none' | 'glasses' | 'scarf' | 'headphones' | 'tie' | 'bow' | 'cap' | 'headband' | 'bun' | 'longhair';

const O = 3.5; // outline width

/** Arm + mitten as ONE smooth piece: outline pass first, then the fill pass, so the wrist has no seam. */
const Limb: React.FC<{d: string; hx: number; hy: number; flip?: boolean; thumb?: number; color: string; hand: string}> = ({d, hx, hy, flip, thumb = 0, color, hand}) => {
  const s = flip ? -1 : 1;
  const th = `rotate(${s * 25} ${hx + s * 12} ${hy - 16 - thumb * 12})`;
  return (
    <g>
      <path d={d} fill="none" stroke={C.outline} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={hx} cy={hy} rx={19} ry={21} fill={C.outline} stroke={C.outline} strokeWidth={O * 2} />
      <ellipse cx={hx + s * 12} cy={hy - 16 - thumb * 12} rx={7} ry={10} transform={th} fill={C.outline} stroke={C.outline} strokeWidth={O * 2} />
      <path d={d} fill="none" stroke={color} strokeWidth={40 - O * 2} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={hx} cy={hy} rx={19} ry={21} fill={hand} />
      <ellipse cx={hx + s * 12} cy={hy - 16 - thumb * 12} rx={7} ry={10} transform={th} fill={hand} />
      <path d={`M ${hx + s * 4} ${hy - 4} q ${s * 4} -8 ${s * 3} -15`} stroke={C.outline} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d={`M ${hx - s * 6} ${hy + 8} q ${s * 3} 6 ${s * 7} 7`} stroke={C.outline} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** stretch a path's y values around the hips (y = -58) */
const stretchY = (d: string, k: number) => {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (m) => (i++ % 2 === 1 ? String(-58 + (Number(m) + 58) * k) : m));
};

/** Quadratic arm from shoulder to hand, bending outward. Returns path + wristband point/angle. */
const armGeom = (sx: number, sy: number, hx: number, hy: number, side: number) => {
  const mx = (sx + hx) / 2;
  const my = (sy + hy) / 2;
  const dx = hx - sx;
  const dy = hy - sy;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular pointing outward (away from body centre)
  let px = -dy / len;
  let py = dx / len;
  if (px * side < 0) {
    px = -px;
    py = -py;
  }
  const bend = Math.max(0, 70 - len * 0.25);
  const cx = mx + px * bend;
  const cy = my + py * bend;
  const tt = 0.8;
  const bx = (1 - tt) ** 2 * sx + 2 * (1 - tt) * tt * cx + tt * tt * hx;
  const by = (1 - tt) ** 2 * sy + 2 * (1 - tt) * tt * cy + tt * tt * hy;
  const tx = 2 * (1 - tt) * (cx - sx) + 2 * tt * (hx - cx);
  const ty = 2 * (1 - tt) * (cy - sy) + 2 * tt * (hy - cy);
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI;
  return {d: `M ${sx} ${sy} Q ${cx} ${cy} ${hx} ${hy}`, bx, by, ang};
};

const HeldItem: React.FC<{hold: Hold; x: number; y: number; side: number}> = ({hold, x, y, side}) => {
  if (hold === 'phone')
    return <rect x={x - 20} y={y - 62} width={40} height={68} rx={8} fill="#1a1d22" stroke={C.outline} strokeWidth={O} />;
  if (hold === 'phone-screen')
    return (
      <g>
        <rect x={x - 22} y={y - 64} width={44} height={72} rx={8} fill="#1a1d22" stroke={C.outline} strokeWidth={O} />
        <rect x={x - 17} y={y - 58} width={34} height={58} rx={4} fill={C.coldLight} opacity={0.9} />
      </g>
    );
  if (hold === 'phone-flat')
    return <rect x={x - 38} y={y - 30} width={76} height={42} rx={8} fill="#1a1d22" stroke={C.outline} strokeWidth={O} />;
  if (hold === 'toothbrush')
    return (
      <g>
        <line x1={x} y1={y} x2={x - side * 8} y2={y - 70} stroke={C.outline} strokeWidth={11} strokeLinecap="round" />
        <line x1={x} y1={y} x2={x - side * 8} y2={y - 70} stroke="#7fb3c9" strokeWidth={6} strokeLinecap="round" />
        <rect x={x - side * 8 - 6} y={y - 88} width={12} height={18} rx={3} fill="#e8eef2" stroke={C.outline} strokeWidth={2.5} />
      </g>
    );
  if (hold === 'ball') return <circle cx={x} cy={y - 26} r={20} fill={C.amber} stroke={C.outline} strokeWidth={O} />;
  if (hold === 'charger')
    return (
      <g>
        <path d={`M ${x} ${y} q ${-side * 40} 60 ${-side * 10} 120`} stroke="#d8d8d8" strokeWidth={4} fill="none" />
        <rect x={x - 7} y={y - 34} width={14} height={28} rx={3} fill="#e8e8e8" stroke={C.outline} strokeWidth={2.5} />
      </g>
    );
  if (hold === 'cup')
    return (
      <g>
        <path d={`M ${x - 16} ${y - 52} L ${x + 16} ${y - 52} L ${x + 12} ${y - 4} L ${x - 12} ${y - 4} Z`} fill="#e9e4d6" stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />
        <rect x={x - 18} y={y - 58} width={36} height={8} rx={3} fill="#c9c2ae" stroke={C.outline} strokeWidth={3} />
        <rect x={x - 13} y={y - 36} width={26} height={12} fill={C.amber} opacity={0.7} />
      </g>
    );
  if (hold === 'pencil')
    return (
      <g>
        <line x1={x} y1={y} x2={x + side * 10} y2={y - 58} stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
        <line x1={x} y1={y} x2={x + side * 10} y2={y - 58} stroke="#e9b85a" strokeWidth={7} strokeLinecap="round" />
        <path d={`M ${x - 5} ${y + 2} L ${x + 5} ${y + 2} L ${x} ${y + 16} Z`} fill="#3a2c22" />
      </g>
    );
  if (hold === 'spoon')
    return (
      <g>
        <line x1={x} y1={y} x2={x + side * 4} y2={y - 50} stroke="#c9ccd2" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={x + side * 5} cy={y - 56} rx={7} ry={10} fill="#c9ccd2" stroke={C.outline} strokeWidth={2} />
      </g>
    );
  return null;
};

const Mitten: React.FC<{x: number; y: number; flip?: boolean; thumb?: number; color?: string}> = ({x, y, flip, thumb = 0, color = C.cream}) => {
  const s = flip ? -1 : 1;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={19} ry={21} fill={color} stroke={C.outline} strokeWidth={O} />
      {/* thumb */}
      <ellipse
        cx={x + s * 12}
        cy={y - 16 - thumb * 12}
        rx={7}
        ry={10}
        transform={`rotate(${s * 25} ${x + s * 12} ${y - 16 - thumb * 12})`}
        fill={color}
        stroke={C.outline}
        strokeWidth={O * 0.85}
      />
      {/* finger hints */}
      <path d={`M ${x - s * 6} ${y + 8} q ${s * 3} 6 ${s * 7} 7`} stroke={C.outline} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Eye: React.FC<{cx: number; cy: number; lid: number; id: string; bags?: boolean; ink?: string}> = ({cx, cy, lid, id, bags, ink = C.outline}) => {
  const r = 7.5;
  const lidY = cy - r - 1 + lid * (2 * r + 2);
  return (
    <g>
      {/* the eye dot is cut off above the eyelid line (no cream patch, so face lighting stays even) */}
      <clipPath id={id}>
        <rect x={cx - r - 3} y={lid > 0.02 ? lidY : cy - r - 3} width={2 * r + 6} height={2 * r + 6} />
      </clipPath>
      {lid < 0.98 && <circle cx={cx} cy={cy} r={r} fill={ink} clipPath={`url(#${id})`} />}
      {lid > 0.02 && (
        <line x1={cx - r - 3} y1={lidY} x2={cx + r + 3} y2={lidY} stroke={ink} strokeWidth={2.6} strokeLinecap="round" />
      )}
      {bags && <path d={`M ${cx - 9} ${cy + 13} q 9 5 18 0`} stroke={C.outline} strokeOpacity={0.45} strokeWidth={2} fill="none" strokeLinecap="round" />}
    </g>
  );
};

export const Hero: React.FC<Props> = ({
  id,
  x,
  y,
  scale = 1,
  expr = {},
  blink = 0,
  headTilt = 0,
  lean = 0,
  pose = 'phone',
  glow = 0,
  glowColor = C.cold,
  shimmer = 0,
  shimmerAmount = 0,
  thumb = 0,
  showLegs = true,
  sit = false,
  lHand,
  rHand,
  lHold = 'none',
  rHold = 'none',
  phoneAt,
  walk,
  color = C.cream,
  accessory = 'none',
  accessoryColor = '#e07b39',
  band = false,
  back = false,
  guitar = false,
  ink = C.outline,
  classic = false,
  jacket,
  shoes,
  bandColor = C.teal,
  apron,
}) => {
  const W8 = walk ?? 0;
  const walking = walk !== undefined;
  const bob = walking ? -Math.abs(Math.sin(W8)) * 6 : 0;
  const {brow = 0, lid = 0, mouth = 0, eyeX = 0, eyeY = 0, bags = false, tear = 0} = expr;
  const effLid = Math.max(lid, blink);
  // build: taller legs, longer body, smaller head => a young man, not a child
  const U = classic ? 0 : sit ? 0 : 125; // extra leg length (standing)
  const BS = classic ? 1 : 1.4; // body vertical stretch around the hips
  const HS = classic ? 1 : 0.85; // head scale around the neck
  const neckY = -58 - 178 * BS; // top of the stretched body
  const bodyPath =
    'M -40 -236 C -76 -230 -86 -190 -86 -150 C -89 -100 -80 -68 -58 -58 L -13 -58 Q 0 -72 13 -58 L 58 -58 C 80 -68 89 -100 86 -150 C 86 -190 76 -230 40 -236 Z';

  // phone pose geometry
  const Y = (v: number) => -58 + (v + 58) * BS; // arms are drawn unscaled, only their points follow the taller body
  const lArm = 'M -70 -205 Q -104 -150 -78 -122 Q -52 -114 -26 -140';
  const rArm = 'M 70 -205 Q 104 -150 78 -122 Q 52 -114 26 -140';
  const downL = 'M -72 -205 Q -96 -160 -92 -100';
  const downR = 'M 72 -205 Q 96 -160 92 -100';

  const sleeve = jacket ?? color;
  /** masked = the copy drawn IN FRONT of the body: it fades out near the shoulders, so the arm grows out of the body */
  const arms = (masked: boolean) => {
    let limbs: React.ReactNode = null;
    let extra: React.ReactNode = null;
    if (lHand || rHand) {
      const L: [number, number] = lHand ? [lHand[0], Y(lHand[1])] : [-92, Y(-100)];
      const R: [number, number] = rHand ? [rHand[0], Y(rHand[1])] : [92, Y(-100)];
      const la = armGeom(-70, Y(-205), L[0], L[1], -1);
      const ra = armGeom(70, Y(-205), R[0], R[1], 1);
      const bw = back ? ra : la;
      extra = (
        <>
          {phoneAt && (
            <g>
              <rect x={phoneAt[0] - 25} y={Y(phoneAt[1]) - 70} width={50} height={84} rx={9} fill="#1a1d22" stroke={C.outline} strokeWidth={O} />
              <circle cx={phoneAt[0] - 12} cy={Y(phoneAt[1]) - 58} r={4} fill="#2c3139" />
            </g>
          )}
          <HeldItem hold={lHold} x={L[0]} y={L[1]} side={-1} />
          <HeldItem hold={rHold} x={R[0]} y={R[1]} side={1} />
        </>
      );
      limbs = (
        <>
          <Limb d={la.d} hx={L[0]} hy={L[1]} color={sleeve} hand={color} />
          <Limb d={ra.d} hx={R[0]} hy={R[1]} flip thumb={thumb} color={sleeve} hand={color} />
          {band && (
            <rect x={bw.bx - 6} y={bw.by - 20} width={12} height={40} rx={4} transform={`rotate(${bw.ang} ${bw.bx} ${bw.by})`} fill={bandColor} stroke={C.outline} strokeWidth={O * 0.8} />
          )}
        </>
      );
    } else if (pose === 'phone') {
      extra = (
        <g>
          <rect x={-25} y={Y(-142) - 70} width={50} height={84} rx={9} fill="#1a1d22" stroke={C.outline} strokeWidth={O} />
          <circle cx={-12} cy={Y(-142) - 58} r={4} fill="#2c3139" />
        </g>
      );
      limbs = (
        <>
          <Limb d={stretchY(lArm, BS)} hx={-24} hy={Y(-142)} color={sleeve} hand={color} />
          <Limb d={stretchY(rArm, BS)} hx={24} hy={Y(-142)} flip thumb={thumb} color={sleeve} hand={color} />
        </>
      );
    } else {
      limbs = (
        <>
          <Limb d={stretchY(downL + ' L -92 -70', BS)} hx={-92} hy={Y(-70)} color={sleeve} hand={color} />
          <Limb d={stretchY(downR + ' L 92 -70', BS)} hx={92} hy={Y(-70)} flip color={sleeve} hand={color} />
        </>
      );
    }
    return (
      <>
        {extra}
        <g mask={masked ? `url(#${id}-shoulders)` : undefined}>{limbs}</g>
      </>
    );
  };

  const bodyT = `translate(0 ${bob - U}) rotate(${lean} 0 -60)`;
  const headT = `translate(0 ${neckY + 236}) rotate(${headTilt} 0 -236) translate(0 -236) scale(${HS}) translate(0 236)`;
  const LINE = {fill: C.outline, stroke: C.outline, strokeWidth: O * 2, strokeLinejoin: 'round' as const};
  /** legs + feet: 'line' = the outline pass, 'fill' = the colour pass (so legs flow out of the body, no seams) */
  const legs = (mode: 'line' | 'fill') => {
    if (!showLegs) return null;
    const st = (c: string) => (mode === 'line' ? LINE : {fill: c});
    if (sit)
      return (
        <g>
          {[-34, 34].map((lx) => (
            <g key={lx}>
              <rect x={lx - 21} y={-100} width={42} height={classic ? 130 : 115} rx={20} {...st(color)} />
              <ellipse cx={lx + (lx < 0 ? -4 : 4)} cy={classic ? 34 : 19} rx={28} ry={15} {...st(shoes ?? color)} />
            </g>
          ))}
        </g>
      );
    return (
      <g>
        {[-34, 34].map((lx, li) => {
          const ph = W8 + (li === 0 ? 0 : Math.PI);
          const swing = walking ? Math.sin(ph) * 12 : 0;
          const lift = walking ? Math.max(0, Math.cos(ph)) * 10 : 0;
          return (
            <g key={lx} transform={`translate(${swing} ${-lift})`}>
              <rect x={lx - 22} y={-96 - U} width={44} height={88 + U} rx={20} {...st(color)} />
              <ellipse cx={lx + (lx < 0 ? -6 : 6)} cy={-8} rx={30} ry={14} {...st(shoes ?? color)} />
            </g>
          );
        })}
      </g>
    );
  };

  const body = stretchY(bodyPath, BS);
  const SB = `translate(0 -58) scale(1 ${BS}) translate(0 58)`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`${id}-glow`} cx="0" cy="-175" r="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={glowColor} stopOpacity={0.75} />
          <stop offset="0.55" stopColor={glowColor} stopOpacity={0.3} />
          <stop offset="1" stopColor={glowColor} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}-headclip`}>
          <circle cx={0} cy={-330} r={100 - O / 2} />
        </clipPath>
        <clipPath id={`${id}-bodyclip`}>
          <path d={body} />
        </clipPath>
        <mask id={`${id}-shoulders`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={-600} y={-700} width={1200} height={900}>
          <rect x={-600} y={-700} width={1200} height={900} fill="#fff" />
          <circle cx={-72} cy={Y(-205)} r={62} fill={`url(#${id}-fade)`} />
          <circle cx={72} cy={Y(-205)} r={62} fill={`url(#${id}-fade)`} />
        </mask>
        <radialGradient id={`${id}-fade`}>
          <stop offset="0.35" stopColor="#000" />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>

      {accessory === 'longhair' && (
        <g transform={bodyT}>
          <g transform={headT}>
            {/* low ponytail at the nape: gathered behind the head, falling behind the right shoulder */}
            <path d="M 40 -262 C 96 -262 128 -240 138 -200 C 150 -150 136 -100 150 -60 C 128 -70 112 -100 108 -140 C 104 -180 96 -214 60 -230 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
            <path d="M 112 -210 C 124 -170 116 -130 128 -96" stroke="#8a5c3c" strokeWidth={3} fill="none" strokeLinecap="round" />
            <ellipse cx={96} cy={-246} rx={16} ry={11} fill="#3a2418" stroke={C.outline} strokeWidth={2.5} transform="rotate(-25 96 -246)" />
          </g>
        </g>
      )}
      {/* PASS 1 - one outline around the whole silhouette (legs, body, head, arms) */}
      {legs('line')}
      <g transform={bodyT}>
        <path d={body} {...LINE} />
        <g transform={headT}>
          <circle cx={0} cy={-330} r={100} {...LINE} />
        </g>
        {arms(false)}
      </g>
      {/* PASS 2 - the colour on top: the inner seams disappear, he is one smooth shape */}
      {legs('fill')}
      <g transform={bodyT}>
        <path d={body} fill={jacket ?? color} />
        <g transform={SB}>
        {apron && !back && (
          <g>
            <path d="M -30 -228 Q 0 -214 30 -228" stroke={apron} strokeWidth={6} fill="none" />
            <path d="M -52 -196 L 52 -196 L 60 -66 Q 0 -54 -60 -66 Z" fill={apron} stroke={C.outline} strokeWidth={2.5} strokeLinejoin="round" />
            <rect x={-26} y={-140} width={52} height={30} rx={4} fill="none" stroke={C.outline} strokeWidth={2} opacity={0.6} />
            <rect x={22} y={-224} width={34} height={14} rx={3} fill="#f2d98a" stroke={C.outline} strokeWidth={2} />
          </g>
        )}
        {jacket && !back && !apron && <path d="M 0 -232 L 0 -62" stroke={C.outline} strokeWidth={2.5} opacity={0.6} />}
        {jacket && !back && !apron && <path d="M -30 -234 L 0 -200 L 30 -234" stroke={C.outline} strokeWidth={2.5} fill="none" opacity={0.6} />}
        {accessory === 'tie' && (
          <path d="M 0 -232 l -10 14 l 10 60 l 10 -60 z" fill={accessoryColor} stroke={C.outline} strokeWidth={2.5} strokeLinejoin="round" />
        )}
        {glow > 0 && <path d={bodyPath} fill={`url(#${id}-glow)`} opacity={glow * 0.6} />}
        {guitar && !back && (
          <g transform="rotate(-24 -10 -120)">
            <rect x={20} y={-136} width={190} height={24} rx={5} fill="#7a4a2a" stroke={C.outline} strokeWidth={O} />
            {[50, 80, 110, 140, 170].map((fx) => <line key={fx} x1={fx} y1={-136} x2={fx} y2={-112} stroke="#c9a46a" strokeWidth={2} />)}
            <rect x={200} y={-142} width={40} height={36} rx={8} fill="#5a341c" stroke={C.outline} strokeWidth={O} />
            <path d="M -40 -168 C 0 -170 10 -150 20 -140 C 30 -150 40 -158 50 -140 C 60 -122 60 -102 50 -88 C 40 -74 30 -82 20 -92 C 6 -72 -20 -60 -50 -66 C -96 -74 -112 -110 -100 -140 C -90 -164 -66 -170 -40 -168 Z" fill="#d8954a" stroke={C.outline} strokeWidth={O} />
            <circle cx={-14} cy={-118} r={17} fill="#3a2414" stroke={C.outline} strokeWidth={2.5} />
            <rect x={-70} y={-126} width={14} height={16} rx={3} fill="#5a341c" />
            {[-120, -116, -112].map((sy) => <line key={sy} x1={-62} y1={sy + 2} x2={230} y2={sy + 2} stroke="#f0e2c0" strokeWidth={1.2} opacity={0.8} />)}
          </g>
        )}

        </g>
        {back && arms(true)}
        {/* head */}
        <g transform={headT}>
          <circle cx={0} cy={-330} r={100} fill={color} />
          <g clipPath={`url(#${id}-headclip)`}>
            {glow > 0 && <rect x={-110} y={-440} width={220} height={220} fill={`url(#${id}-glow)`} opacity={glow} />}
            {shimmerAmount > 0 &&
              [0, 1, 2, 3, 4].map((i) => {
                const yy = -250 - (((shimmer + i * 46) % 230) + 230) % 230;
                return <rect key={i} x={-110} y={yy} width={220} height={14} fill={C.coldLight} opacity={shimmerAmount * 0.22} />;
              })}
          </g>
          {/* face */}
          {!back && (<>
          <Eye id={`${id}-el`} cx={-34 + eyeX} cy={-322 + eyeY} lid={effLid} bags={bags} ink={ink} />
          <Eye id={`${id}-er`} cx={34 + eyeX} cy={-322 + eyeY} lid={effLid} bags={bags} ink={ink} />
          <path
            d={`M ${-50 + eyeX} -347 Q ${-37 + eyeX} ${-351 - brow * 4} ${-22 + eyeX} ${-348 - brow * 8}`}
            stroke={ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${50 + eyeX} -347 Q ${37 + eyeX} ${-351 - brow * 4} ${22 + eyeX} ${-348 - brow * 8}`}
            stroke={ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${-12 + eyeX * 0.6} -284 Q ${eyeX * 0.6} ${-284 + mouth * 9} ${12 + eyeX * 0.6} -284`}
            stroke={ink}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          {tear > 0 && (
            <ellipse cx={-36 + eyeX} cy={-306 + tear * 30} rx={4} ry={6} fill={C.coldLight} opacity={Math.min(1, tear * 2)} />
          )}
          {accessory === 'glasses' && (
            <g fill="none" stroke={C.outline} strokeWidth={3.2}>
              <circle cx={-34 + eyeX} cy={-322 + eyeY} r={17} />
              <circle cx={34 + eyeX} cy={-322 + eyeY} r={17} />
              <path d={`M ${-17 + eyeX} ${-324 + eyeY} q 17 -8 34 0`} />
            </g>
          )}
          {accessory === 'headphones' && (
            <g>
              <path d="M -96 -330 C -96 -460 96 -460 96 -330" fill="none" stroke={C.outline} strokeWidth={9} />
              <path d="M -96 -330 C -96 -460 96 -460 96 -330" fill="none" stroke={accessoryColor} strokeWidth={5} />
              <rect x={-112} y={-356} width={24} height={50} rx={10} fill={accessoryColor} stroke={C.outline} strokeWidth={3} />
              <rect x={88} y={-356} width={24} height={50} rx={10} fill={accessoryColor} stroke={C.outline} strokeWidth={3} />
            </g>
          )}
          {accessory === 'longhair' && (
            <g>
              {/* sleek hair, middle part, swept back over the ears */}
              <path d="M -101 -318 C -106 -400 -60 -434 0 -434 C 60 -434 106 -400 101 -318 C 92 -350 56 -366 4 -374 L 0 -366 L -4 -374 C -56 -366 -92 -350 -101 -318 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
              <path d="M 0 -432 L 0 -370" stroke={C.outline} strokeWidth={2.2} opacity={0.7} />
              {[-1, 1].map((k) => (
                <g key={k} stroke="#8a5c3c" strokeWidth={3} fill="none" strokeLinecap="round">
                  <path d={`M ${k * 10} -420 C ${k * 50} -410 ${k * 80} -380 ${k * 94} -336`} />
                  <path d={`M ${k * 8} -400 C ${k * 44} -392 ${k * 70} -372 ${k * 84} -346`} />
                </g>
              ))}
              {!back && [-1, 1].map((k) => (
                <path key={k} d={`M ${k * (34 + 9) + eyeX} ${-326 + eyeY} l ${k * 7} -5 M ${k * (34 + 6) + eyeX} ${-330 + eyeY} l ${k * 5} -7`} stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
              ))}
            </g>
          )}
          {accessory === 'bun' && (
            <g>
              <path d="M -98 -350 C -96 -446 96 -446 98 -350 C 80 -400 -80 -400 -98 -350 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
              <circle cx={0} cy={-440} r={34} fill={accessoryColor} stroke={C.outline} strokeWidth={O} />
            </g>
          )}
          {accessory === 'cap' && (
            <g>
              <path d="M -99 -350 C -99 -452 99 -452 99 -350 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} />
              <path d="M -60 -352 Q 0 -336 118 -352 Q 126 -336 112 -328 Q 20 -318 -60 -340 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
              <circle cx={0} cy={-428} r={7} fill={accessoryColor} stroke={C.outline} strokeWidth={2.5} />
            </g>
          )}
          {accessory === 'headband' && (
            <path d="M -99 -372 Q 0 -398 99 -372 L 97 -352 Q 0 -378 -97 -352 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />
          )}
          {accessory === 'bow' && (
            <g transform="translate(52 -418) rotate(20)">
              <path d="M 0 0 l -26 -14 l 0 28 z M 0 0 l 26 -14 l 0 28 z" fill={accessoryColor} stroke={C.outline} strokeWidth={2.5} strokeLinejoin="round" />
              <circle r={6} fill={accessoryColor} stroke={C.outline} strokeWidth={2.5} />
            </g>
          )}
          </>)}
        </g>
        {accessory === 'scarf' && (
          <g transform={`translate(0 ${neckY + 236})`}>
            <path d="M -62 -240 Q 0 -212 62 -240 L 60 -220 Q 0 -192 -60 -220 Z" fill={accessoryColor} stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />
            <path d="M 30 -222 l 6 58 l 22 -4 l -8 -58 z" fill={accessoryColor} stroke={C.outline} strokeWidth={3} strokeLinejoin="round" />
          </g>
        )}

        {!back && arms(true)}
      </g>
    </g>
  );
};
