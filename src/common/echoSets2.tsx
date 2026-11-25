import React from 'react';
import {Hero} from './Hero';
import {C, H, W} from './theme';
import {clamp01, FLOOR, GREY, Light, Person, TAN} from './sets';
import {Doodle, EchoWords} from './echoSets';

const rnd = (i: number, s = 1) => Math.abs(Math.sin(i * 12.9898 + s * 78.233) * 43758.5453) % 1;

/* rain streaks over the whole frame */
export const Rain: React.FC<{t: number; o?: number; n?: number}> = ({t, o = 0.5, n = 90}) => (
  <g stroke="#9fb4d6" strokeWidth={2} opacity={o} strokeLinecap="round">
    {Array.from({length: n}, (_, i) => {
      const x = rnd(i) * (W + 300) - 150;
      const sp = 900 + rnd(i, 2) * 500;
      const y = ((t * sp + rnd(i, 3) * H) % (H + 200)) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 34} />;
    })}
  </g>
);

/* 11 — bathroom mirror with "ugly." written in the fog */
export const Bathroom: React.FC<{t: number; write: number}> = ({t, write}) => (
  <g>
    {Array.from({length: 9}, (_, i) => (
      <line key={i} x1={0} y1={120 + i * 110} x2={W} y2={120 + i * 110} stroke={C.lineSoft} strokeWidth={2} />
    ))}
    {Array.from({length: 12}, (_, i) => (
      <line key={`v${i}`} x1={80 + i * 160} y1={0} x2={80 + i * 160} y2={H} stroke={C.lineSoft} strokeWidth={2} />
    ))}
    <clipPath id="mir">
      <rect x={640} y={190} width={640} height={470} rx={18} />
    </clipPath>
    <rect x={640} y={190} width={640} height={470} rx={18} fill="#141a24" />
    <g clipPath="url(#mir)">
      <Hero id="mirh" x={960} y={1000} scale={1.05} pose="arms-down" expr={{brow: 0.7, lid: 0.45, mouth: -0.4, eyeY: 4, bags: true}} />
      <rect x={640} y={190} width={640} height={470} fill="#dfe6ef" opacity={0.42} style={{filter: 'blur(6px)'}} />
      <text
        x={960}
        y={520}
        textAnchor="middle"
        fontFamily="Patrick Hand"
        fontSize={190}
        fill="#0f141c"
        opacity={0.75}
        pathLength={1}
        style={{clipPath: `inset(0 ${100 - write * 100}% 0 0)`}}
      >
        ugly.
      </text>
      {write > 0.9 &&
        [880, 940, 1030].map((dx, i) => <line key={dx} x1={dx} y1={530} x2={dx} y2={530 + ((t * 30 + i * 20) % 90)} stroke="#0f141c" strokeWidth={4} opacity={0.5} />)}
    </g>
    <rect x={640} y={190} width={640} height={470} rx={18} fill="none" stroke={C.line} strokeWidth={5} />
    <path d="M 720 720 L 1200 720 Q 1180 820 960 830 Q 740 820 720 720 Z" fill="#16191e" stroke={C.line} strokeWidth={3} />
    <path d="M 950 720 L 950 690 Q 950 675 975 675 L 1000 675" stroke={C.line} strokeWidth={6} fill="none" />
    <Light id="bathc" x={960} y={300} r={700} color={C.cold} o={0.5} />
  </g>
);

/* 12 — cereal bowl, top-down: the letters arrange into UGLY */
export const Cereal: React.FC<{t: number; p: number}> = ({t, p}) => {
  const word = ['U', 'G', 'L', 'Y'];
  return (
    <g>
      <rect width={W} height={H} fill="#121316" />
      <circle cx={960} cy={560} r={360} fill="#1b1d22" stroke={C.line} strokeWidth={6} />
      <circle cx={960} cy={560} r={310} fill="#e7e1d1" />
      {Array.from({length: 22}, (_, i) => {
        const a = rnd(i) * Math.PI * 2;
        const r = 60 + rnd(i, 2) * 220;
        return (
          <text key={i} x={960 + Math.cos(a + t * 0.2) * r} y={570 + Math.sin(a + t * 0.2) * r} fontFamily="Nunito" fontWeight={900} fontSize={46} fill="#d9a35a" stroke="#8a5a2a" strokeWidth={2} textAnchor="middle" opacity={0.85}>
            {'ABCDEFHKMNOPRSTW'[i % 16]}
          </text>
        );
      })}
      {word.map((ch, i) => {
        const a = rnd(i + 40) * Math.PI * 2;
        const sx = 960 + Math.cos(a) * 240;
        const sy = 560 + Math.sin(a) * 220;
        const tx = 960 - 150 + i * 100;
        const ty = 590;
        const q = clamp01(p * 1.3 - i * 0.1);
        return (
          <text key={ch} x={sx + (tx - sx) * q} y={sy + (ty - sy) * q} fontFamily="Nunito" fontWeight={900} fontSize={96} fill="#d9a35a" stroke="#6a4420" strokeWidth={4} textAnchor="middle" style={{filter: q > 0.95 ? `drop-shadow(0 0 14px ${C.cold})` : undefined}}>
            {ch}
          </text>
        );
      })}
      <path d="M 1380 900 L 1180 700" stroke="#c9ccd2" strokeWidth={22} strokeLinecap="round" />
      <ellipse cx={1160} cy={680} rx={46} ry={34} fill="#c9ccd2" transform="rotate(40 1160 680)" />
      <Light id="cerc" x={960} y={560} r={600} color={C.cold} o={0.35} />
    </g>
  );
};

/* 13 — rainy bus stop at night, the rain on the glass spells ugly. */
export const BusStop: React.FC<{t: number; spell: number; children?: React.ReactNode}> = ({t, spell, children}) => (
  <g>
    <rect width={W} height={H} fill="#0b0e14" />
    {/* street lamp */}
    <line x1={1560} y1={FLOOR} x2={1560} y2={240} stroke={C.line} strokeWidth={8} />
    <path d="M 1560 240 q 0 -40 -60 -40 l -40 0" stroke={C.line} strokeWidth={8} fill="none" />
    <ellipse cx={1450} cy={210} rx={30} ry={12} fill={C.amberLight} />
    <polygon points="1430,215 1470,215 1640,860 1260,860" fill={C.amber} opacity={0.08} />
    {/* shelter */}
    <rect x={460} y={260} width={860} height={24} fill="#16191e" stroke={C.line} strokeWidth={3} />
    <line x1={480} y1={284} x2={480} y2={FLOOR} stroke={C.line} strokeWidth={6} />
    <line x1={1300} y1={284} x2={1300} y2={FLOOR} stroke={C.line} strokeWidth={6} />
    <rect x={500} y={300} width={780} height={420} fill="#0f1520" stroke={C.coldLight} strokeOpacity={0.5} strokeWidth={3} />
    <rect x={600} y={720} width={520} height={20} rx={6} fill="#16191e" stroke={C.line} strokeWidth={3} />
    {/* raindrops on the glass forming the word */}
    <text x={890} y={560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={230} fill="none" stroke={C.coldLight} strokeWidth={9} strokeLinecap="round" strokeDasharray="1 20" opacity={spell} style={{filter: `drop-shadow(0 0 8px ${C.cold})`}}>
      ugly.
    </text>
    {children}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    {/* wet street reflections */}
    {[0, 1, 2].map((i) => (
      <line key={i} x1={1380 + i * 40} y1={FLOOR + 30 + i * 30} x2={1520 + i * 40} y2={FLOOR + 30 + i * 30} stroke={C.amberLight} strokeWidth={3} opacity={0.25} />
    ))}
    <Rain t={t} o={0.45} />
  </g>
);

/* 14 — bus window from outside: his reflection-face, rain and passing lights */
export const BusWindow: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={W} height={H} fill="#0a0d13" />
    <rect x={260} y={140} width={1400} height={780} rx={40} fill="#0e131c" stroke={C.line} strokeWidth={10} />
    <clipPath id="bw">
      <rect x={270} y={150} width={1380} height={760} rx={34} />
    </clipPath>
    <g clipPath="url(#bw)">
      {Array.from({length: 14}, (_, i) => {
        const x = ((i * 260 - t * 500) % 2200 + 2200) % 2200 - 150;
        return <circle key={i} cx={x} cy={260 + (i % 4) * 150} r={30 + (i % 3) * 18} fill={i % 3 ? C.amberLight : '#6f8fb0'} opacity={0.18} style={{filter: 'blur(8px)'}} />;
      })}
      <Hero id="bwh" x={900} y={1390} scale={2.2} pose="arms-down" headTilt={8} expr={{brow: 0.8, lid: 0.45, mouth: -0.5, eyeX: 14, eyeY: 4, bags: true}} glow={0.4} />
      <EchoWords t={t} n={7} area={[400, 260, 1500, 760]} size={[60, 150]} seed={44} />
      <rect x={270} y={150} width={1380} height={760} fill="#9fb4d6" opacity={0.06} />
      <Rain t={t} o={0.55} n={70} />
    </g>
  </g>
);

/* 16 — his paper with the letters crawling over it, then crumpled */
export const PaperInsert: React.FC<{t: number; crumple: number}> = ({t, crumple}) => {
  const sc = 1 - crumple * 0.75;
  return (
    <g>
      <rect width={W} height={H} fill="#141519" />
      <g transform={`translate(960 560) scale(${sc}) rotate(${crumple * 25}) translate(-960 -560)`}>
        <Doodle x={560} y={260} w={800} h={600} draw={0.5} />
        {crumple > 0 && <polygon points="560,260 1360,260 1360,860 560,860" fill="none" stroke="#8a836f" strokeWidth={6} strokeDasharray="60 30" opacity={crumple} />}
        {Array.from({length: 9}, (_, i) => {
          const x = 600 + (((t * 120 + i * 140) % 760) + 760) % 760;
          const y = 300 + rnd(i) * 520;
          return (
            <text key={i} x={x} y={y} fontFamily="Nunito" fontWeight={900} fontSize={44} fill="#1d2433" opacity={0.75} transform={`rotate(${rnd(i, 4) * 40 - 20} ${x} ${y})`}>
              ugly
            </text>
          );
        })}
      </g>
      {/* his mitten hands pressing in */}
      <ellipse cx={560 + crumple * 260} cy={620} rx={120} ry={150} fill={C.cream} stroke={C.outline} strokeWidth={6} />
      <ellipse cx={1360 - crumple * 260} cy={620} rx={120} ry={150} fill={C.cream} stroke={C.outline} strokeWidth={6} />
      <rect x={1360 - crumple * 260 + 40} y={700} width={150} height={48} rx={12} fill={C.teal} stroke={C.outline} strokeWidth={6} transform={`rotate(-20 ${1420 - crumple * 260} 724)`} />
      <Light id="ppc" x={960} y={500} r={700} color={C.cold} o={0.4} />
    </g>
  );
};

/* 18 — wall of drawings being taken down */
export const WallInsert: React.FC<{left: number; pull: number}> = ({left, pull}) => (
  <g>
    <rect width={W} height={H} fill="#121418" />
    {Array.from({length: 8}, (_, i) => {
      const x = 260 + (i % 4) * 360;
      const y = 200 + Math.floor(i / 4) * 340;
      const here = i < left;
      const pulling = i === left - 1;
      return (
        <g key={i}>
          <circle cx={x + 120} cy={y - 8} r={9} fill={C.coldLight} stroke={C.outline} strokeWidth={2} />
          {here && (
            <g transform={pulling ? `translate(${pull * 60} ${pull * 220}) rotate(${pull * 18} ${x + 120} ${y})` : undefined}>
              <Doodle x={x} y={y} w={240} h={180} />
            </g>
          )}
        </g>
      );
    })}
    {left > 0 && (
      <ellipse cx={260 + ((left - 1) % 4) * 360 + 120 + pull * 60} cy={200 + Math.floor((left - 1) / 4) * 340 + 200 + pull * 220} rx={70} ry={80} fill={C.cream} stroke={C.outline} strokeWidth={5} />
    )}
    <Light id="wic" x={960} y={540} r={800} color={C.cold} o={0.35} />
  </g>
);

/* 19 — drawer close-up */
export const DrawerInsert: React.FC<{close: number}> = ({close}) => {
  const out = (1 - close) * 260;
  return (
    <g>
      <rect width={W} height={H} fill="#0e1013" />
      <rect x={360} y={200} width={1200} height={760} fill="#15181c" stroke={C.line} strokeWidth={5} />
      <rect x={430} y={300 + out * 0.0} width={1060} height={420 + out} fill="#0b0d10" stroke={C.line} strokeWidth={4} />
      <g transform={`translate(0 ${out * 0.6})`}>
        <Doodle x={660} y={360} w={600} h={300} />
      </g>
      <rect x={410} y={300 + out} width={1100} height={360} rx={10} fill="#1a1d22" stroke={C.line} strokeWidth={5} />
      <line x1={880} y1={480 + out} x2={1040} y2={480 + out} stroke={C.amber} strokeWidth={10} strokeLinecap="round" />
      <Light id="drc" x={960} y={480} r={700} color={C.cold} o={0.35} />
    </g>
  );
};

/* 24 / 41 — cafe: warm pendant lights, big window, table */
export const Cafe: React.FC<{t: number; children?: React.ReactNode; onWindow?: React.ReactNode}> = ({t, children, onWindow}) => (
  <g>
    <rect width={W} height={H} fill="#141210" />
    <rect x={300} y={160} width={1320} height={500} fill="#1a1f2c" stroke={C.line} strokeWidth={5} />
    {[740, 1180].map((x) => (
      <line key={x} x1={x} y1={160} x2={x} y2={660} stroke={C.line} strokeWidth={5} />
    ))}
    {/* street outside at dusk */}
    {Array.from({length: 6}, (_, i) => (
      <rect key={i} x={340 + i * 210} y={420 - (i % 3) * 60} width={150} height={240 + (i % 3) * 60} fill="#131722" stroke="#232a38" strokeWidth={2} />
    ))}
    {onWindow}
    {[620, 1300].map((x) => (
      <g key={x}>
        <line x1={x} y1={0} x2={x} y2={120} stroke={C.line} strokeWidth={3} />
        <path d={`M ${x - 40} 160 L ${x - 20} 120 L ${x + 20} 120 L ${x + 40} 160 Z`} fill="#1d1a15" stroke={C.amber} strokeWidth={3} />
        <Light id={`cafel${x}`} x={x} y={300} r={520} color={C.amber} o={0.8} />
      </g>
    ))}
    {children}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* 25 — his empty hands */
export const HandsInsert: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={W} height={H} fill="#0e1014" />
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${960 + s * 230} ${640 + Math.sin(t * 2 + s) * 4}) rotate(${s * -12})`}>
        <path d={`M ${-s * 80} 420 L ${-s * 60} 120 L ${s * 70} 120 L ${s * 100} 420`} fill={C.cream} stroke={C.outline} strokeWidth={6} />
        <ellipse cx={0} cy={60} rx={150} ry={130} fill={C.cream} stroke={C.outline} strokeWidth={6} />
        <ellipse cx={-s * 130} cy={-10} rx={50} ry={70} fill={C.cream} stroke={C.outline} strokeWidth={6} transform={`rotate(${s * 30} ${-s * 130} -10)`} />
        {s === 1 && <rect x={-90} y={150} width={200} height={56} rx={14} fill={C.teal} stroke={C.outline} strokeWidth={6} />}
      </g>
    ))}
    <Light id="hic" x={960} y={500} r={700} color={C.cold} o={0.45} />
  </g>
);

/* 26 — street at dusk, brick wall with a big chalk mural */
export const Street: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <g>
    <defs>
      <linearGradient id="stsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b2340" />
        <stop offset="1" stopColor="#c27a4a" />
      </linearGradient>
    </defs>
    <rect width={W} height={260} fill="url(#stsky)" />
    <rect x={0} y={260} width={W} height={FLOOR - 260} fill="#1b1714" />
    {Array.from({length: 12}, (_, i) => (
      <line key={i} x1={0} y1={300 + i * 48} x2={W} y2={300 + i * 48} stroke="#2a231d" strokeWidth={3} />
    ))}
    <g transform="translate(560 300)">
      <Doodle x={0} y={0} w={820} h={480} kid note={false} />
    </g>
    <Light id="stw" x={970} y={540} r={900} color={C.amber} o={0.7} />
    {children}
    <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

/* 30 — window close-up: letters press against the glass and cover the moon */
export const WindowMoon: React.FC<{t: number; cover: number}> = ({t, cover}) => (
  <g>
    <rect width={W} height={H} fill="#06080d" />
    <rect x={460} y={140} width={1000} height={800} fill="#0a1222" stroke={C.line} strokeWidth={10} />
    <line x1={960} y1={140} x2={960} y2={940} stroke={C.line} strokeWidth={10} />
    <line x1={460} y1={540} x2={1460} y2={540} stroke={C.line} strokeWidth={10} />
    <circle cx={1180} cy={320} r={90} fill="#e9e6da" opacity={0.9 - cover * 0.6} />
    <EchoWords t={t} n={4 + cover * 26} area={[500, 200, 1420, 880]} size={[90, 260]} seed={61} />
  </g>
);

/* 32 — phone on the floor buzzing */
export const PhoneFloor: React.FC<{t: number; on: number}> = ({t, on}) => {
  const buzz = on > 0 && (t * 3) % 1 < 0.5 ? Math.sin(t * 90) * 5 : 0;
  return (
    <g>
      <rect width={W} height={H} fill="#07080b" />
      <g transform={`translate(${960 + buzz} 600) rotate(-14)`}>
        <rect x={-150} y={-280} width={300} height={560} rx={36} fill="#14171c" stroke={C.outline} strokeWidth={6} />
        <rect x={-130} y={-255} width={260} height={510} rx={22} fill={on ? '#e9eef7' : '#05070a'} opacity={on ? 0.95 : 1} />
        {on > 0 && (
          <g>
            <circle cx={-70} cy={-170} r={34} fill="#6b6f78" />
            <rect x={-20} y={-190} width={130} height={18} rx={9} fill="#9aa3b2" />
            <rect x={-20} y={-160} width={90} height={14} rx={7} fill="#c9d1de" />
          </g>
        )}
      </g>
      {on > 0 && buzz !== 0 && [-1, 1].map((s) => <path key={s} d={`M ${960 + s * 220} 420 q ${s * 20} 30 0 60 q ${s * -20} 30 0 60`} stroke={C.coldLight} strokeWidth={5} fill="none" />)}
      {on > 0 && <Light id="pfc" x={960} y={600} r={600} color={C.cold} o={0.7} />}
    </g>
  );
};

/* 33 — the commenter's empty profile: the same comment under everyone's drawings */
export const ProfilePOV: React.FC<{t: number; x0: number; y0: number}> = ({t, x0, y0}) => {
  const scroll = (t * 140) % 160;
  return (
    <g>
      <circle cx={x0 + 198} cy={y0 + 70} r={46} fill="#6b6f78" />
      <rect x={x0 + 108} y={y0 + 130} width={180} height={16} rx={8} fill="#9aa3b2" />
      {['0', '0', '0'].map((v, i) => (
        <text key={i} x={x0 + 90 + i * 110} y={y0 + 190} fontFamily="Nunito" fontWeight={900} fontSize={30} fill="#1d2027" textAnchor="middle">
          {v}
        </text>
      ))}
      <line x1={x0 + 10} y1={y0 + 215} x2={x0 + 386} y2={y0 + 215} stroke="#c9d1de" strokeWidth={2} />
      <clipPath id="pfclip">
        <rect x={x0} y={y0 + 220} width={400} height={600} />
      </clipPath>
      <g clipPath="url(#pfclip)">
      <g transform={`translate(0 ${-scroll})`}>
        {Array.from({length: 7}, (_, i) => (
          <g key={i} transform={`translate(0 ${y0 + 235 + i * 160})`}>
            <rect x={x0 + 14} y={0} width={120} height={120} rx={8} fill={['#3a2a1e', '#1e2a3a', '#2a3a1e', '#3a1e2a'][i % 4]} />
            <circle cx={x0 + 74} cy={60} r={26 + (i % 3) * 6} fill={['#e9a94f', '#e07b8a', C.teal, '#f2c27a'][i % 4]} opacity={0.8} />
            <rect x={x0 + 150} y={30} width={230} height={52} rx={16} fill="#d8dde6" />
            <text x={x0 + 164} y={65} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#1d2027">
              This is ugly.
            </text>
          </g>
        ))}
      </g>
      </g>
    </g>
  );
};

/* 42 — rooftop at sunset */
export const Rooftop: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <g>
    <defs>
      <linearGradient id="rfsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3550" />
        <stop offset="1" stopColor="#f2b765" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#rfsky)" />
    <circle cx={1400} cy={560} r={110} fill="#ffd69a" />
    {Array.from({length: 12}, (_, i) => {
      const x = i * 170 - 40;
      const h = 160 + (i * 73) % 220;
      return (
        <g key={i}>
          <rect x={x} y={700 - h} width={140} height={h} fill="#2a2030" stroke="#3d3045" strokeWidth={2} />
          {Array.from({length: 4}, (_, k) => (
            <rect key={k} x={x + 20 + (k % 2) * 60} y={720 - h + Math.floor(k / 2) * 50} width={30} height={22} fill={C.amberLight} opacity={(i + k) % 3 === 0 ? 0.7 : 0.15} />
          ))}
        </g>
      );
    })}
    <Light id="rfw" x={1400} y={560} r={1200} color={C.amber} o={1} />
    <rect x={0} y={700} width={W} height={400} fill="#1e1915" />
    <line x1={0} y1={700} x2={W} y2={700} stroke={C.line} strokeWidth={4} />
    {children}
    <line x1={0} y1={790} x2={W} y2={790} stroke={C.line} strokeWidth={6} />
    {Array.from({length: 20}, (_, i) => (
      <line key={i} x1={i * 100} y1={790} x2={i * 100} y2={900} stroke={C.line} strokeWidth={5} />
    ))}
    <line x1={0} y1={900} x2={W} y2={900} stroke={C.line} strokeWidth={6} />
  </g>
);

export const Kid: React.FC<Partial<React.ComponentProps<typeof Hero>> & {x: number; y: number}> = (p) => (
  <Person id="kid" scale={0.62} color={TAN} accessory="bow" accessoryColor="#e07b8a" pose="arms-down" {...p} />
);
export const Teacher: React.FC<Partial<React.ComponentProps<typeof Hero>> & {x: number; y: number}> = (p) => (
  <Person id="teacher" showLegs color={GREY} accessory="tie" accessoryColor={C.teal} {...p} />
);
