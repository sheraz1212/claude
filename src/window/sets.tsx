import React from 'react';
import {Light, Person, GREY, TAN} from '../common/sets';
import {Rain} from '../spot/sets';
import {C} from '../common/theme';

const OL = C.outline;
export const GOLD = '#f2c27a';
export const GOLD_L = '#ffd98a';
export const NEIGHBOUR = {color: TAN, accessory: 'glasses' as const};
export const FRIEND1 = {color: GREY, accessory: 'cap' as const, accessoryColor: '#3f6a4e'};
export const FRIEND2 = {color: GREY, accessory: 'headband' as const, accessoryColor: '#8a3b3b'};

export type AcrossScene = 'party' | 'medal' | 'guitar' | 'cake' | 'dark' | 'crying' | 'wave' | 'calm';

/** What happens inside the bright window across the street. Local box: 0..W x 0..H (window interior). */
const Inside: React.FC<{t: number; scene: AcrossScene; w: number; h: number}> = ({t, scene, w, h}) => {
  const s = h / 900; // person scale base
  const floor = h - 10;
  const bob = (k: number) => Math.abs(Math.sin(t * 5 + k)) * 6;
  if (scene === 'dark' || scene === 'crying') return null;
  return (
    <g>
      {/* warm interior */}
      <rect width={w} height={h} fill={GOLD} />
      <rect width={w} height={h} fill="#e9a94f" opacity={0.35} />
      <rect y={h * 0.62} width={w} height={h * 0.38} fill="#c98a4f" opacity={0.6} />
      {/* string lights */}
      {Array.from({length: 9}, (_, i) => <circle key={i} cx={(i + 0.5) * (w / 9)} cy={h * 0.1 + Math.sin(i) * 6} r={5} fill="#fff6dc" />)}
      {(scene === 'party' || scene === 'cake') && <rect x={w * 0.2} y={h * 0.66} width={w * 0.6} height={14} rx={6} fill="#8a5a3a" />}
      {scene === 'cake' && (
        <g transform={`translate(${w * 0.5} ${h * 0.66})`}>
          <rect x={-40} y={-40} width={80} height={40} rx={6} fill="#f4e7d8" stroke={OL} strokeWidth={2} />
          {[-20, 0, 20].map((x) => <g key={x}><rect x={x - 2} y={-56} width={4} height={16} fill="#e07b9a" /><ellipse cx={x} cy={-60} rx={4} ry={6} fill="#ffcf5a" /></g>)}
        </g>
      )}
      {scene === 'medal' && (
        <g transform={`translate(${w * 0.78} ${h * 0.3})`}>
          <rect x={-60} y={-40} width={120} height={90} fill="#6b4632" stroke={OL} strokeWidth={3} />
          <circle cx={0} cy={5} r={22} fill="#e9b949" stroke={OL} strokeWidth={3} />
          <path d="M -10 -30 L 0 -15 L 10 -30" stroke="#c8304f" strokeWidth={6} fill="none" />
        </g>
      )}
      {scene === 'guitar' && <rect x={w * 0.7} y={h * 0.3} width={20} height={h * 0.45} rx={6} fill="#d8954a" stroke={OL} strokeWidth={2} transform={`rotate(-12 ${w * 0.7} ${h * 0.5})`} />}
      {/* the people */}
      {scene !== 'calm' && scene !== 'wave' && (
        <>
          <Person id="nb" x={w * 0.42} y={floor - bob(0) * 0.3} scale={s} {...NEIGHBOUR} pose="arms-down" rHand={scene === 'party' ? [60, -300 - bob(1)] : undefined} expr={{brow: -0.1, lid: 0.5, mouth: 0.9}} />
          <Person id="f1" x={w * 0.2} y={floor - bob(2) * 0.3} scale={s} {...FRIEND1} pose="arms-down" lHand={scene === 'party' ? [-60, -300 - bob(3)] : undefined} expr={{brow: -0.1, lid: 0.6, mouth: 0.9}} />
          <Person id="f2" x={w * 0.66} y={floor - bob(4) * 0.3} scale={s} {...FRIEND2} pose="arms-down" expr={{brow: -0.1, lid: 0.6, mouth: 0.8}} />
        </>
      )}
      {scene === 'calm' && <Person id="nbc" x={w * 0.5} y={floor} scale={s} {...NEIGHBOUR} pose="arms-down" expr={{brow: 0, lid: 0.2, mouth: 0.3}} />}
      {scene === 'wave' && <Person id="nbw" x={w * 0.5} y={floor} scale={s} {...NEIGHBOUR} pose="arms-down" rHand={[90, -330 + Math.sin(t * 8) * 20]} expr={{brow: -0.1, lid: 0.1, mouth: 0.8}} />}
    </g>
  );
};

/** The building across the street with its ONE bright window. Can be drawn at any position/scale. */
export const Across: React.FC<{t: number; scene: AcrossScene; x?: number; y?: number; s?: number; rain?: number; glow?: number; balcony?: React.ReactNode}> = ({t, scene, x = 0, y = 0, s = 1, rain = 0, glow = 1, balcony}) => {
  const W = 1920;
  const H = 1080;
  const wx = 560;
  const wy = 240;
  const ww = 800;
  const wh = 500;
  const lit = scene !== 'dark' && scene !== 'crying';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width={W} height={H} fill="#13121c" />
      {/* facade */}
      <rect x={120} y={0} width={1680} height={H} fill="#211e2c" />
      {Array.from({length: 5}, (_, r) =>
        Array.from({length: 8}, (_, c) => {
          const bx = 170 + c * 205;
          const by = 40 + r * 230;
          if (bx > wx - 120 && bx < wx + ww && by > wy - 160 && by < wy + wh + 40) return null;
          const on = (r * 3 + c * 5) % 7 === 0;
          return <rect key={`${r}-${c}`} x={bx} y={by} width={140} height={150} fill={on ? '#6a5a4a' : '#1a1824'} stroke="#2c2838" strokeWidth={6} />;
        }),
      )}
      {lit && <Light id="acrossGlow" x={wx + ww / 2} y={wy + wh / 2} r={900} color={GOLD} o={0.55 * glow} />}
      <g transform={`translate(${wx} ${wy})`}>
        {lit ? <Inside t={t} scene={scene} w={ww} h={wh} /> : <rect width={ww} height={wh} fill="#16151f" />}
        <rect width={ww} height={wh} fill="none" stroke="#3a3040" strokeWidth={16} />
        <line x1={ww / 2} y1={0} x2={ww / 2} y2={wh} stroke="#3a3040" strokeWidth={10} />
      </g>
      {/* balcony */}
      <rect x={wx - 40} y={wy + wh + 10} width={ww + 80} height={14} fill="#3a3646" />
      {Array.from({length: 15}, (_, i) => <rect key={i} x={wx - 30 + i * 60} y={wy + wh + 24} width={6} height={80} fill="#3a3646" />)}
      <rect x={wx - 40} y={wy + wh + 100} width={ww + 80} height={12} fill="#3a3646" />
      {balcony}
      {rain > 0 && <Rain t={t} o={rain} />}
    </g>
  );
};

/** (A) his small flat. lamp 0..1, painting 'open' | 'covered'. The window shows the building across. */
export const MyRoom: React.FC<{t: number; lamp?: number; painting?: 'open' | 'covered' | 'new'; scene?: AcrossScene; rain?: number; noodles?: boolean}> = ({t, lamp = 1, painting = 'open', scene = 'party', rain = 0, noodles = true}) => {
  const L = lamp;
  return (
    <g>
      <rect width={1920} height={1080} fill="#211f2a" />
      <rect width={1920} height={80} fill="#1a1922" />
      {/* window to the street, with the building across */}
      <defs>
        <clipPath id="mywin">
          <rect x={1230} y={170} width={560} height={480} />
        </clipPath>
      </defs>
      <g clipPath="url(#mywin)">
        <Across t={t} scene={scene} x={1107} y={204} s={0.42} rain={rain} />
      </g>
      <rect x={1230} y={170} width={560} height={480} fill="none" stroke="#3a2c26" strokeWidth={16} />
      <line x1={1510} y1={170} x2={1510} y2={650} stroke="#3a2c26" strokeWidth={10} />
      <rect x={1205} y={645} width={610} height={22} fill="#4a3428" stroke={OL} strokeWidth={4} />
      {/* gold spill from across onto his floor */}
      {scene !== 'dark' && scene !== 'crying' && <path d="M 1240 660 L 1780 660 L 1600 1000 L 1050 1000 Z" fill={GOLD} opacity={0.06} />}
      {/* poster + shelf */}
      <rect x={170} y={260} width={150} height={190} fill="#3a3446" stroke={OL} strokeWidth={3} />
      <path d="M 190 420 L 240 340 L 270 380 L 300 330 L 300 430 L 190 430 Z" fill="#5a5070" />
      <rect x={380} y={300} width={240} height={14} fill="#3a2c26" />
      {[400, 450, 500, 560].map((x, i) => <rect key={x} x={x} y={250 + (i % 2) * 10} width={36} height={50 - (i % 2) * 10} fill={['#7a5a4a', '#4a5a6a', '#6a4a5a', '#5a6a4a'][i]} />)}
      {/* easel + painting */}
      <g>
        <line x1={640} y1={880} x2={720} y2={420} stroke="#5a4030" strokeWidth={12} />
        <line x1={860} y1={880} x2={780} y2={420} stroke="#5a4030" strokeWidth={12} />
        <line x1={750} y1={430} x2={750} y2={880} stroke="#4a3428" strokeWidth={10} />
        <rect x={620} y={650} width={260} height={14} fill="#5a4030" />
        <rect x={620} y={420} width={260} height={230} fill="#efe6d6" stroke={OL} strokeWidth={4} />
        {painting !== 'covered' && (
          <g>
            <rect x={632} y={432} width={236} height={206} fill="#2c3550" />
            <circle cx={800} cy={500} r={26} fill={GOLD_L} />
            <path d="M 632 600 L 700 540 L 760 590 L 820 550 L 868 590 L 868 638 L 632 638 Z" fill="#3a4a3a" />
            {painting === 'new' && (
              <g>
                <rect x={660} y={470} width={50} height={60} fill={GOLD} stroke={OL} strokeWidth={2} />
                <rect x={790} y={470} width={50} height={60} fill={GOLD} stroke={OL} strokeWidth={2} />
              </g>
            )}
          </g>
        )}
        {painting === 'covered' && <path d="M 600 410 Q 750 380 900 410 L 910 700 Q 750 720 590 700 Z" fill="#5a5466" stroke={OL} strokeWidth={4} />}
      </g>
      {/* small table, lamp, noodles, phone */}
      <rect x={930} y={720} width={260} height={18} fill="#4a3428" stroke={OL} strokeWidth={3} />
      <rect x={950} y={738} width={14} height={140} fill="#3a2a22" />
      <rect x={1156} y={738} width={14} height={140} fill="#3a2a22" />
      <path d="M 1110 720 L 1110 640 L 1080 610" stroke="#2a2c34" strokeWidth={8} fill="none" />
      <path d="M 1040 600 L 1100 590 L 1092 636 Z" fill="#c9653f" stroke={OL} strokeWidth={3} />
      {L > 0 && <Light id="mylamp" x={1060} y={660} r={420 + 260 * L} color={C.amber} o={0.85 * L} />}
      {L > 0 && <ellipse cx={1060} cy={724} rx={110 * L + 30} ry={10} fill={C.amberLight} opacity={0.4 * L} />}
      {noodles && (
        <g>
          <path d="M 960 700 Q 990 724 1020 700 Z" fill="#efe6d6" stroke={OL} strokeWidth={3} />
          <path d="M 970 700 q 10 -12 20 0 q 10 -12 20 0" stroke="#d9b36a" strokeWidth={3} fill="none" />
        </g>
      )}
      <rect x={1120} y={708} width={44} height={12} rx={3} fill="#15141b" stroke={OL} strokeWidth={2} />
      {/* floor */}
      <rect y={880} width={1920} height={200} fill="#1c1a22" />
      {[920, 980, 1050].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000040" strokeWidth={3} />)}
      {L > 0 && <ellipse cx={900} cy={940} rx={500 * L} ry={50} fill={C.amberLight} opacity={0.08 * L} />}
      {rain > 0 && <rect width={1920} height={1080} fill="#101428" opacity={0.2 * rain} />}
    </g>
  );
};

/** (C) the shared rooftop at night. */
export const Rooftop: React.FC<{t: number; dawn?: number}> = ({t, dawn = 0}) => (
  <g>
    <defs>
      <linearGradient id="roofsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#12122a" />
        <stop offset="1" stopColor={dawn > 0.5 ? '#6a4a5a' : '#3a2a44'} />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#roofsky)" />
    {Array.from({length: 16}, (_, i) => {
      const h = 160 + ((i * 61) % 220);
      return (
        <g key={i}>
          <rect x={i * 125 - 20} y={720 - h} width={115} height={h} fill="#1c1a2e" />
          {Array.from({length: 6}, (_, k) => <rect key={k} x={i * 125 + (k % 2) * 50} y={740 - h + Math.floor(k / 2) * 50} width={12} height={14} fill={GOLD} opacity={(i + k) % 3 ? 0.15 : 0.7} />)}
        </g>
      );
    })}
    {/* water tank */}
    <g transform="translate(300 520)">
      <rect x={-90} y={0} width={180} height={200} rx={20} fill="#2a2632" stroke={OL} strokeWidth={4} />
      <path d="M -100 0 L 0 -60 L 100 0 Z" fill="#302b3a" stroke={OL} strokeWidth={4} />
      {[-70, 70].map((x) => <rect key={x} x={x - 6} y={200} width={12} height={130} fill="#22202a" />)}
    </g>
    {/* string lights */}
    <path d="M 600 400 Q 1100 480 1700 400" stroke="#1a1820" strokeWidth={3} fill="none" />
    {Array.from({length: 12}, (_, i) => {
      const u = i / 11;
      const x = 600 + u * 1100;
      const y = 400 + Math.sin(Math.PI * u) * 70;
      return (
        <g key={i}>
          <circle cx={x} cy={y + 8} r={16} fill={GOLD} opacity={0.2} />
          <circle cx={x} cy={y + 8} r={7} fill="#fff1c9" opacity={0.75 + 0.25 * Math.sin(t * 2 + i)} />
        </g>
      );
    })}
    <Light id="roofL" x={1150} y={520} r={700} color={GOLD} o={0.4} />
    {/* roof floor + railing */}
    <rect y={850} width={1920} height={230} fill="#2a2630" />
    <rect y={850} width={1920} height={10} fill="#3a3542" />
    <rect y={760} width={1920} height={8} fill="#4a4552" />
    {Array.from({length: 24}, (_, i) => <rect key={i} x={i * 85} y={768} width={6} height={84} fill="#4a4552" />)}
    <ellipse cx={1150} cy={920} rx={600} ry={60} fill={GOLD} opacity={0.08} />
  </g>
);

/** A phone chat seen POV (full frame). */
export const PhoneChat: React.FC<{t: number; name: string; msgs: [number, string][]; reply?: [number, string]; cps?: number}> = ({t, name, msgs, reply, cps = 5}) => {
  const fade = (a: number) => Math.max(0, Math.min(1, (t - a) / 0.4));
  const typing = reply ? reply[1].slice(0, Math.max(0, Math.floor((t - reply[0]) * cps))) : '';
  const sent = reply ? t > reply[0] + reply[1].length / cps + 0.4 : false;
  return (
    <g>
      <rect width={1920} height={1080} fill="#15141b" />
      <Light id="phl" x={960} y={540} r={700} color="#8fb8f0" o={0.4} />
      <rect x={700} y={80} width={520} height={920} rx={56} fill="#111018" stroke={OL} strokeWidth={6} />
      <rect x={724} y={110} width={472} height={860} rx={40} fill="#f4f2f7" />
      <rect x={724} y={110} width={472} height={110} rx={40} fill="#e6e2ee" />
      <circle cx={790} cy={165} r={30} fill="#a6a9b0" stroke={OL} strokeWidth={3} />
      <text x={835} y={176} fontFamily="Nunito" fontWeight={800} fontSize={32} fill={OL}>{name}</text>
      {msgs.map(([at, m], i) => (
        <g key={i} opacity={fade(at)}>
          <rect x={750} y={250 + i * 84} width={m.length * 14.5 + 40} height={64} rx={30} fill="#e2deea" />
          <text x={770} y={293 + i * 84} fontFamily="Nunito" fontWeight={700} fontSize={28} fill={OL}>{m}</text>
        </g>
      ))}
      {reply && sent && (
        <g opacity={fade(reply[0] + reply[1].length / cps + 0.4)}>
          <rect x={1170 - reply[1].length * 14.5 - 40} y={250 + msgs.length * 84 + 20} width={reply[1].length * 14.5 + 40} height={64} rx={30} fill="#5b8fe0" />
          <text x={1150} y={293 + msgs.length * 84 + 20} textAnchor="end" fontFamily="Nunito" fontWeight={700} fontSize={28} fill="#fff">{reply[1]}</text>
        </g>
      )}
      <rect x={744} y={880} width={432} height={66} rx={33} fill="#fff" stroke="#d6d0e2" strokeWidth={3} />
      {reply && !sent && <text x={772} y={923} fontFamily="Nunito" fontWeight={700} fontSize={28} fill={OL}>{typing}</text>}
    </g>
  );
};

/** Exterior: his building (left) and the one across (right), a street between, both windows lit. */
export const TwoBuildings: React.FC<{t: number; mine?: number; theirs?: number}> = ({t, mine = 1, theirs = 1}) => (
  <g>
    <defs>
      <linearGradient id="extsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#11122a" />
        <stop offset="1" stopColor="#3a2a44" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#extsky)" />
    {Array.from({length: 40}, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 380} r={1.6} fill="#fff" opacity={0.4 + 0.3 * Math.sin(t + i)} />)}
    {[{x: 120, w: 620, lit: mine, wx: 460}, {x: 1180, w: 620, lit: theirs, wx: 1300}].map((b, k) => (
      <g key={k}>
        <rect x={b.x} y={150} width={b.w} height={800} fill="#211e2c" stroke="#15131d" strokeWidth={6} />
        {Array.from({length: 4}, (_, r) => Array.from({length: 3}, (_, c) => (
          <rect key={`${r}${c}`} x={b.x + 60 + c * 190} y={200 + r * 180} width={130} height={120} fill={(r * 2 + c + k) % 5 === 0 ? '#5a4a3a' : '#1a1824'} />
        )))}
        <rect x={b.wx} y={380} width={160} height={140} fill={b.lit > 0 ? GOLD : '#1a1824'} opacity={0.4 + 0.6 * b.lit} stroke="#3a3040" strokeWidth={8} />
        {b.lit > 0 && <Light id={`ext${k}`} x={b.wx + 80} y={450} r={420} color={GOLD} o={0.6 * b.lit} />}
      </g>
    ))}
    <rect y={950} width={1920} height={130} fill="#26242e" />
    <rect x={0} y={1010} width={1920} height={8} fill="#3a3846" />
    {[960].map((x) => (
      <g key={x}>
        <rect x={x - 6} y={640} width={12} height={320} fill="#2a2c34" />
        <circle cx={x} cy={636} r={14} fill="#fff1c9" />
        <Light id="extlamp" x={x} y={660} r={380} color="#ffe3a6" o={0.4} />
      </g>
    ))}
  </g>
);
