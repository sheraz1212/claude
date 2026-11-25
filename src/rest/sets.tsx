import React from 'react';
import {Light} from '../common/sets';
import {C} from '../common/theme';

const OL = C.outline;
export const SCREEN = '#8fb8f0';
export const SCREEN_L = '#b9d4f7';
export type Sky = 'evening' | 'night' | 'dawn' | 'sunset' | 'morning';

const SKY: Record<Sky, [string, string]> = {
  evening: ['#2a2846', '#7a4a5a'],
  night: ['#0e1024', '#20223c'],
  dawn: ['#3a3456', '#e09a62'],
  sunset: ['#3a2a4a', '#e0885a'],
  morning: ['#2c3352', '#8a7a8a'],
};

export const WallClock: React.FC<{x: number; y: number; time: string; r?: number}> = ({x, y, time, r = 55}) => {
  const [h, m] = time.split(':').map(Number);
  const ma = (m / 60) * 360;
  const ha = ((h % 12) / 12) * 360 + m / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#e9e1cf" stroke={OL} strokeWidth={5} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + 14} stroke={OL} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={OL} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ha})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={OL} strokeWidth={4} strokeLinecap="round" transform={`rotate(${ma})`} />
      <circle r={4} fill={OL} />
    </g>
  );
};

/** (A) his living room. */
export const LivingRoom: React.FC<{t: number; sky?: Sky; laptop?: 'open' | 'closed'; cups?: number; time?: string; lamp?: number; tv?: number; note?: boolean; sun?: number}> = ({
  t,
  sky = 'evening',
  laptop = 'open',
  cups = 0,
  time = '18:00',
  lamp = 0.7,
  tv = 0,
  note = false,
  sun = 0,
}) => {
  const [a, b] = SKY[sky];
  const dark = sky === 'night';
  return (
    <g>
      <rect width={1920} height={1080} fill={dark ? '#1e1d28' : '#2b2a36'} />
      <rect width={1920} height={70} fill="#00000030" />
      {/* window */}
      <defs>
        <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x={1300} y={170} width={400} height={430} fill="url(#rsky)" />
      {(sky === 'dawn' || sky === 'sunset') && <circle cx={1500} cy={600 - sun * 150} r={60} fill="#ffcf8a" />}
      {Array.from({length: 6}, (_, i) => <rect key={i} x={1305 + i * 66} y={470 - (i % 3) * 45} width={60} height={140} fill={dark ? '#151729' : '#2a2438'} />)}
      {Array.from({length: 7}, (_, i) => <rect key={i} x={1315 + i * 55} y={500 - (i % 3) * 40} width={9} height={11} fill={C.amberLight} opacity={dark ? 0.8 : 0.4} />)}
      <rect x={1300} y={170} width={400} height={430} fill="none" stroke="#3a2c26" strokeWidth={16} />
      <line x1={1500} y1={170} x2={1500} y2={600} stroke="#3a2c26" strokeWidth={10} />
      <rect x={1280} y={596} width={440} height={20} fill="#4a3428" stroke={OL} strokeWidth={4} />
      {(sky === 'dawn' || sky === 'sunset') && sun > 0 && (
        <>
          <path d="M 1310 600 L 1690 600 L 1300 1000 L 700 1000 Z" fill="#ffcf8a" opacity={0.14 * sun} />
          <Light id="sunR" x={1500} y={520} r={900} color="#ffc27a" o={0.7 * sun} />
        </>
      )}
      <WallClock x={1130} y={240} time={time} />
      {/* poster */}
      <rect x={170} y={220} width={170} height={210} fill="#383448" stroke={OL} strokeWidth={3} />
      <path d="M 190 400 L 250 320 L 290 360 L 320 310 L 320 410 L 190 410 Z" fill="#555070" />
      {/* floor lamp by the sofa */}
      <rect x={668} y={420} width={10} height={440} fill="#24242c" />
      <path d="M 630 420 L 716 420 L 700 360 L 646 360 Z" fill="#d9a66a" stroke={OL} strokeWidth={3} />
      {lamp > 0 && <Light id="flampR" x={673} y={450} r={520} color={C.amber} o={0.75 * lamp} />}
      {/* sofa */}
      <rect x={110} y={560} width={520} height={150} rx={30} fill="#4a5a6e" stroke={OL} strokeWidth={4} />
      <rect x={100} y={680} width={540} height={110} rx={24} fill="#55667c" stroke={OL} strokeWidth={4} />
      <rect x={80} y={620} width={70} height={190} rx={26} fill="#4a5a6e" stroke={OL} strokeWidth={4} />
      <rect x={590} y={620} width={70} height={190} rx={26} fill="#4a5a6e" stroke={OL} strokeWidth={4} />
      <rect x={120} y={790} width={20} height={70} fill="#2a2228" />
      <rect x={600} y={790} width={20} height={70} fill="#2a2228" />
      {tv > 0 && <Light id="tvL" x={260} y={640} r={520} color="#9ab8e8" o={tv * (0.55 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.7))} />}
      {/* kitchen corner: counter + microwave */}
      <rect x={1740} y={640} width={200} height={220} fill="#3a3040" stroke={OL} strokeWidth={4} />
      <rect x={1740} y={622} width={200} height={22} fill="#5a4a50" stroke={OL} strokeWidth={4} />
      <rect x={1760} y={510} width={150} height={112} rx={8} fill="#c9c4bc" stroke={OL} strokeWidth={4} />
      <rect x={1772} y={524} width={96} height={84} rx={4} fill="#2a2830" />
      <rect x={1876} y={530} width={24} height={60} fill="#a6a19a" />
      {/* floor */}
      <rect y={860} width={1920} height={220} fill={dark ? '#18171e' : '#211f28'} />
      {[900, 960, 1030].map((y) => <line key={y} x1={0} y1={y} x2={1920} y2={y} stroke="#00000040" strokeWidth={3} />)}
      {lamp > 0 && <ellipse cx={600} cy={900} rx={380} ry={44} fill={C.amberLight} opacity={0.08 * lamp} />}
    </g>
  );
};

/** The desk with the laptop - drawn AFTER the hero so it hides his legs. */
export const Desk: React.FC<{t: number; laptop?: 'open' | 'closed'; cups?: number; note?: boolean; papers?: number; glow?: number}> = ({t, laptop = 'open', cups = 0, note = false, papers = 0, glow = 1}) => (
  <g>
    {laptop === 'open' && glow > 0 && <Light id="lapL" x={960} y={560} r={520} color={SCREEN} o={0.7 * glow} />}
    <rect x={740} y={640} width={440} height={24} fill="#5a4030" stroke={OL} strokeWidth={4} />
    <rect x={760} y={664} width={20} height={196} fill="#4a3428" />
    <rect x={1140} y={664} width={20} height={196} fill="#4a3428" />
    {laptop === 'open' ? (
      <g>
        <path d="M 880 640 L 1040 640 L 1050 632 L 870 632 Z" fill="#3a3c44" stroke={OL} strokeWidth={3} />
        <rect x={885} y={520} width={150} height={112} rx={6} fill="#33353d" stroke={OL} strokeWidth={4} />
        <circle cx={960} cy={576} r={8} fill="#4a4c56" />
      </g>
    ) : (
      <rect x={880} y={626} width={160} height={14} rx={4} fill="#3a3c44" stroke={OL} strokeWidth={3} />
    )}
    {Array.from({length: cups}, (_, i) => (
      <g key={i} transform={`translate(${790 + i * 26 + (i % 2) * 6} ${640 - (i >= 3 ? 0 : 0)})`}>
        <rect x={-12} y={-34} width={24} height={34} rx={4} fill="#e9e1cf" stroke={OL} strokeWidth={3} />
      </g>
    ))}
    {Array.from({length: papers}, (_, i) => (
      <rect key={i} x={1080 + (i % 3) * 18} y={624 - i * 4} width={60} height={14} fill="#efe6d6" stroke={OL} strokeWidth={2} transform={`rotate(${(i % 3) * 4 - 4} 1100 630)`} />
    ))}
    {note && (
      <g transform="rotate(-6 1100 610)">
        <rect x={1060} y={590} width={90} height={46} fill="#f2d98a" stroke={OL} strokeWidth={2} />
        <path d="M 1070 606 h 60 M 1070 618 h 44" stroke="#5a4a3a" strokeWidth={3} />
      </g>
    )}
  </g>
);

/** Phone call screen POV: "Mom" calling, then declined. */
export const CallScreen: React.FC<{t: number; declined: boolean}> = ({t, declined}) => (
  <g>
    <rect width={1920} height={1080} fill="#14131a" />
    <Light id="cl" x={960} y={540} r={700} color={SCREEN} o={0.35} />
    <rect x={700} y={80} width={520} height={920} rx={56} fill="#111018" stroke={OL} strokeWidth={6} />
    <rect x={724} y={110} width={472} height={860} rx={40} fill={declined ? '#1c1b24' : '#2a3a52'} />
    <circle cx={960} cy={360} r={90} fill="#c9ad86" stroke={OL} strokeWidth={4} />
    <path d="M 900 330 q 60 -60 120 0" stroke="#e9e1cf" strokeWidth={10} fill="none" />
    <text x={960} y={520} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={54} fill="#fff">Mom</text>
    <text x={960} y={570} textAnchor="middle" fontFamily="Nunito" fontSize={28} fill="#c9d4e6">{declined ? 'call declined' : 'incoming call...'}</text>
    {!declined && (
      <>
        <circle cx={850} cy={820} r={56} fill="#d9534f" opacity={0.9 + 0.1 * Math.sin(t * 8)} />
        <circle cx={1070} cy={820} r={56} fill="#4caf50" opacity={0.9 + 0.1 * Math.sin(t * 8)} />
        <text x={850} y={905} textAnchor="middle" fontFamily="Nunito" fontSize={24} fill="#fff">busy</text>
      </>
    )}
  </g>
);
