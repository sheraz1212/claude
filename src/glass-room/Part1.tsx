import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill} from '../common/Overlays';
import {C, FPS, H, W, sec} from '../common/theme';

// Part 1 — Hook + establish (0:00–0:35). MUSIC: none.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

const blinkAt = (t: number, times: number[]) => {
  let b = 0;
  for (const bt of times) {
    const d = Math.abs(t - bt);
    if (d < 0.12) b = Math.max(b, 1 - d / 0.12);
  }
  return b;
};

// thumb flick times (close-up) — synced with scroll ticks
const FLICKS = [12.5, 13.4, 14.4, 15.0, 16.6, 17.5, 18.1, 19.0, 19.6];
const thumbAt = (t: number) => {
  let v = 0;
  for (const ft of FLICKS) {
    const d = t - ft;
    if (d >= -0.1 && d < 0.25) v = Math.max(v, d < 0 ? (d + 0.1) / 0.1 : 1 - d / 0.25);
  }
  return v;
};

const PINGS = [13.2, 16.0, 18.6];
const pingFlash = (t: number) => {
  let v = 0;
  for (const p of PINGS) {
    const d = t - p;
    if (d >= 0 && d < 0.6) v = Math.max(v, 1 - d / 0.6);
  }
  return v;
};

/* ---------------- Bedroom (shots 1.2, 1.4, 1.5) ---------------- */

const FLOOR = 862;

const Bedroom: React.FC<{t: number}> = ({t}) => {
  // camera per shot
  let cam = {s: 1, cx: 860, cy: 560};
  if (t < 12) cam = {s: interpolate(t, [4, 12], [1.0, 1.08], {...clamp, easing: ease}), cx: 840, cy: 560};
  else if (t < 28) cam = {s: interpolate(t, [20, 28], [0.98, 1.02], clamp), cx: 960, cy: 600};
  else cam = {s: interpolate(t, [28, 35], [1.02, 1.09], {...clamp, easing: ease}), cx: 700, cy: 520};

  // sunrise (1.5)
  const sun = interpolate(t, [28.3, 33.5], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  // glass pane growth (1.4)
  const beam = interpolate(t, [20.4, 21.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const beamFade = interpolate(t, [22.5, 24], [1, 0], clamp);
  const pane = interpolate(t, [21.3, 25.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const paneShine = (t * 0.35) % 1;

  // hero acting
  const turn = interpolate(t, [30.2, 31.6], [0, 1], {...clamp, easing: ease});
  const blink = blinkAt(t, [6.8, 10.4, 23.6, 27.0, 33.2]);
  const flicker = 0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 2.1);
  const glow = 0.7 * flicker;

  // alarm (1.5)
  const ringing = t >= 29 && t < 31.1;
  const shake = ringing ? Math.sin(t * 90) * 3 : 0;

  const heroX = 830;
  const heroY = 820;

  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="roomGlow" cx={heroX} cy={heroY - 175} r={560} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.cold} stopOpacity={0.42} />
          <stop offset="0.45" stopColor={C.cold} stopOpacity={0.12} />
          <stop offset="1" stopColor={C.cold} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={interpolateColor(sun, '#0c1424', '#3b3550')} />
          <stop offset="1" stopColor={interpolateColor(sun, '#101a2c', '#e9a94f')} />
        </linearGradient>
        <radialGradient id="warmSpill" cx={380} cy={420} r={720} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.amber} stopOpacity={0.4} />
          <stop offset="0.5" stopColor={C.amber} stopOpacity={0.1} />
          <stop offset="1" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="paneFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.coldLight} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.cold} stopOpacity={0.05} />
        </linearGradient>
        <clipPath id="winClip">
          <rect x={232} y={252} width={296} height={306} />
        </clipPath>
        <clipPath id="paneClip">
          <rect x={1015} y={FLOOR - 470 * pane} width={150} height={470 * pane} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={C.bg} />

      <g transform={`translate(${cam.cx} ${cam.cy}) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`}>
        {/* window */}
        <g clipPath="url(#winClip)">
          <rect x={232} y={252} width={296} height={306} fill="url(#sky)" />
          {[
            [270, 290],
            [350, 330],
            [480, 280],
            [420, 380],
            [300, 420],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.8} fill="#cfd8ea" opacity={(1 - sun) * (0.5 + 0.5 * Math.sin(t * 2 + i))} />
          ))}
          <circle cx={380} cy={interpolate(sun, [0, 1], [640, 480])} r={58} fill={C.amberLight} opacity={sun} />
        </g>
        <rect x={230} y={250} width={300} height={310} fill="none" stroke={C.line} strokeWidth={3} />
        <line x1={380} y1={250} x2={380} y2={560} stroke={C.line} strokeWidth={3} />
        <line x1={230} y1={405} x2={530} y2={405} stroke={C.line} strokeWidth={3} />
        <line x1={215} y1={566} x2={545} y2={566} stroke={C.line} strokeWidth={3} strokeLinecap="round" />

        {/* warm sunrise spill + floor patch */}
        <rect width={W} height={H} fill="url(#warmSpill)" opacity={sun} style={{mixBlendMode: 'screen'}} />
        <polygon points={`300,${FLOOR} 470,${FLOOR} 620,${FLOOR + 90} 380,${FLOOR + 90}`} fill={C.amber} opacity={sun * 0.18} />

        {/* phone glow in the room */}
        <rect width={W} height={H} fill="url(#roomGlow)" opacity={glow * (1 - sun * 0.3)} style={{mixBlendMode: 'screen'}} />

        {/* headboard + pillow */}
        <rect x={690} y={520} width={34} height={FLOOR - 520} rx={8} fill={C.bg} stroke={C.line} strokeWidth={3} />
        <rect x={730} y={600} width={190} height={96} rx={40} fill="#191c22" stroke={C.line} strokeWidth={3} />

        {/* hero */}
        <Hero
          id="hero-room"
          x={heroX}
          y={heroY}
          scale={1}
          lean={turn * 7}
          headTilt={4 + turn * 6}
          expr={{brow: 0.6, lid: 0.45, mouth: -0.3, eyeX: 2 + turn * 7, eyeY: 4, bags: true}}
          blink={blink}
          glow={glow}
          thumb={0}
        />

        {/* blanket + mattress */}
        <path
          d={`M 735 712 C 800 690 880 700 960 706 C 1100 716 1300 700 1420 690 C 1470 670 1520 672 1548 700 L 1556 768 L 726 768 Z`}
          fill="#1a1e25"
          stroke={C.line}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d="M 1000 724 q 120 16 260 2" stroke={C.lineSoft} strokeWidth={3} fill="none" strokeLinecap="round" />
        <rect x={700} y={768} width={880} height={26} rx={6} fill={C.bg} stroke={C.line} strokeWidth={3} />
        <line x1={720} y1={794} x2={720} y2={FLOOR} stroke={C.line} strokeWidth={4} />
        <line x1={1560} y1={794} x2={1560} y2={FLOOR} stroke={C.line} strokeWidth={4} />
        <rect x={1550} y={640} width={30} height={FLOOR - 640} rx={8} fill={C.bg} stroke={C.line} strokeWidth={3} />

        {/* nightstand + alarm clock (warm detail) */}
        <rect x={540} y={730} width={130} height={FLOOR - 730} rx={6} fill={C.bg} stroke={C.line} strokeWidth={3} />
        <line x1={555} y1={790} x2={655} y2={790} stroke={C.lineSoft} strokeWidth={3} />
        <g transform={`translate(${605 + shake} 694)`}>
          <circle cx={-20} cy={-28} r={9} fill={C.bg} stroke={C.line} strokeWidth={3} />
          <circle cx={20} cy={-28} r={9} fill={C.bg} stroke={C.line} strokeWidth={3} />
          <circle cx={0} cy={0} r={30} fill="#16191e" stroke={C.line} strokeWidth={3} />
          <line x1={0} y1={0} x2={0} y2={-18} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={0} x2={13} y2={4} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
          <line
            x1={0}
            y1={0}
            x2={22 * Math.sin((Math.floor(t) * Math.PI) / 30)}
            y2={-22 * Math.cos((Math.floor(t) * Math.PI) / 30)}
            stroke={C.amberLight}
            strokeWidth={1.5}
            opacity={0.8}
          />
          <line x1={-18} y1={28} x2={-24} y2={36} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
          <line x1={18} y1={28} x2={24} y2={36} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
          {ringing &&
            [-1, 1].map((s) => (
              <g key={s} stroke={C.amberLight} strokeWidth={3} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 40)}>
                <line x1={s * 44} y1={-30} x2={s * 56} y2={-40} />
                <line x1={s * 48} y1={-12} x2={s * 62} y2={-14} />
              </g>
            ))}
        </g>

        {/* floor line */}
        <line x1={120} y1={FLOOR} x2={1800} y2={FLOOR} stroke={C.line} strokeWidth={3} strokeLinecap="round" />

        {/* light beam from phone to pane base (1.4) */}
        {beam > 0 && beamFade > 0 && (
          <path
            d={`M ${heroX + 30} ${heroY - 175} Q 980 ${heroY - 120} ${heroX + 30 + (1090 - heroX - 30) * beam} ${heroY - 175 + (FLOOR - heroY + 175) * beam}`}
            stroke={C.coldLight}
            strokeWidth={3}
            fill="none"
            opacity={0.8 * beamFade}
            strokeLinecap="round"
            style={{filter: `drop-shadow(0 0 8px ${C.cold})`}}
          />
        )}

        {/* the glass pane */}
        {pane > 0 && (
          <g>
            <rect
              x={1015}
              y={FLOOR - 470 * pane}
              width={150}
              height={470 * pane}
              fill="url(#paneFill)"
              stroke={C.coldLight}
              strokeWidth={2.5}
              strokeOpacity={0.85}
              style={{filter: `drop-shadow(0 0 10px ${C.cold})`}}
            />
            <g clipPath="url(#paneClip)">
              <line x1={1030} y1={FLOOR - 130} x2={1110} y2={FLOOR - 330} stroke="#dbe8ff" strokeOpacity={0.35} strokeWidth={4} />
              <line x1={1060} y1={FLOOR - 110} x2={1125} y2={FLOOR - 270} stroke="#dbe8ff" strokeOpacity={0.2} strokeWidth={2} />
              <rect x={1015 + paneShine * 260 - 80} y={FLOOR - 480} width={26} height={480} fill="#ffffff" opacity={0.07} transform={`skewX(-18)`} />
            </g>
            <line x1={1005} y1={FLOOR} x2={1175} y2={FLOOR} stroke={C.coldLight} strokeWidth={3} opacity={0.6 * pane} />
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---------------- Close-up (shot 1.3) ---------------- */

const CloseUp: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [12, 20], [1.0, 1.045], clamp);
  const flash = pingFlash(t);
  const blink = blinkAt(t, [15.6, 18.9]);
  const shimmer = FLICKS.filter((ft) => ft < t).length * 46 + thumbAt(t) * 30;
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="cuGlow" cx={1100} cy={900} r={760} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.cold} stopOpacity={0.4 + flash * 0.2} />
          <stop offset="1" stopColor={C.cold} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={C.bg} />
      <g transform={`translate(1100 600) scale(${s}) translate(-1100 -600)`}>
        <rect width={W} height={H} fill="url(#cuGlow)" style={{mixBlendMode: 'screen'}} />
        {/* faint pillow edge behind */}
        <rect x={700} y={760} width={820} height={400} rx={160} fill="#171a20" stroke={C.lineSoft} strokeWidth={4} />
        <Hero
          id="hero-cu"
          x={1100}
          y={1430}
          scale={2.7}
          headTilt={3}
          expr={{brow: 0.75, lid: 0.55, mouth: -0.35, eyeY: 6, bags: true}}
          blink={blink}
          glow={0.85 + flash * 0.4}
          shimmer={shimmer}
          shimmerAmount={1}
          thumb={thumbAt(t)}
        />
      </g>
    </svg>
  );
};

/* ---------------- helpers ---------------- */

function interpolateColor(p: number, a: string, b: string) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * p));
  return `rgb(${c.join(',')})`;
}

/* ---------------- Part 1 composition ---------------- */

const SCROLL_TICKS_WIDE = [5.0, 5.25, 5.5, 7.2, 7.45, 9.0, 9.2, 9.4, 9.6, 11.0, 11.25, 22.0, 22.3, 24.8, 25.1];

export const GlassRoomPart1: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fromBlack = interpolate(t, [4, 4.5], [1, 0], clamp);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 1.2 + 1.4 + 1.5 bedroom (continuous), 1.3 close-up cut in on top */}
      {t >= 4 && <Bedroom t={t} />}
      {t >= 12 && t < 20 && <CloseUp t={t} />}
      <AbsoluteFill style={{background: '#000', opacity: fromBlack}} />

      <FilmLook />

      {/* HUD */}
      <Counter label="SCREEN TIME" showFrom={sec(4.4)} changes={[[0, '2h'], [sec(30.0), '3h']]} />

      {/* 1.1 hook */}
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He's never alone. Or is he?" dur={sec(4)} />
      </Sequence>

      {/* bottom captions (narrator) */}
      <Sequence from={sec(6.0)} durationInFrames={sec(5.6)}>
        <Caption text="Another night. Same **glow**." dur={sec(5.6)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(22.3)} durationInFrames={sec(5.3)}>
        <Caption text="Something was **growing**." dur={sec(5.3)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(31.0)} durationInFrames={sec(4.0)}>
        <Caption text="He missed the **sunrise**." dur={sec(4.0)} highlight={C.amberLight} />
      </Sequence>

      {/* head pill (close-up: beside the head) */}
      <Sequence from={sec(14.0)} durationInFrames={sec(5.4)}>
        <HeadPill text="Just five more minutes." x={790} y={470} side="left" dur={sec(5.4)} />
      </Sequence>

      {/* ---------- SFX (MUSIC: none) ---------- */}
      <Sequence from={sec(3.0)}>
        <Audio src={staticFile('sfx/phone-buzz.wav')} volume={0.8} />
      </Sequence>
      {Array.from({length: 25}, (_, i) => 4 + i).map((s) => (
        <Sequence key={`clk${s}`} from={sec(s)} durationInFrames={sec(0.3)}>
          <Audio src={staticFile('sfx/clock-tick.wav')} volume={s >= 12 && s < 20 ? 0.18 : 0.4} />
        </Sequence>
      ))}
      {[...SCROLL_TICKS_WIDE, ...FLICKS].map((s, i) => (
        <Sequence key={`scr${i}`} from={sec(s)} durationInFrames={sec(0.2)}>
          <Audio src={staticFile('sfx/scroll-tick.wav')} volume={s >= 12 && s < 20 ? 0.7 : 0.4} />
        </Sequence>
      ))}
      {PINGS.map((s) => (
        <Sequence key={`ping${s}`} from={sec(s)} durationInFrames={sec(1)}>
          <Audio src={staticFile('sfx/notification-ping.wav')} volume={0.6} />
        </Sequence>
      ))}
      <Sequence from={sec(20.5)} durationInFrames={sec(6)}>
        <Audio src={staticFile('sfx/glass-hum.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={sec(26.0)} durationInFrames={sec(6)}>
        <Audio src={staticFile('sfx/glass-hum.wav')} volume={0.3} />
      </Sequence>
      <Sequence from={sec(29.0)} durationInFrames={sec(2.3)}>
        <Audio src={staticFile('sfx/alarm.wav')} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};
