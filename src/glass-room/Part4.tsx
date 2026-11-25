import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {BedroomSet, blinkAt, Cam, GlassBox, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';

// Part 4 — Low point (1:55–2:35). MUSIC: none (near silence; slowest, darkest part).

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const NIGHT = {top: '#070b14', bottom: '#0a1220', stars: 0.6};

/* 4.1 + 4.2 — bedroom, thick glass */
const Room: React.FC<{t: number}> = ({t}) => {
  const medium = t >= 10;
  const cam = medium ? {s: interpolate(t, [10, 18], [1.55, 1.6], cl), cx: 830, cy: 520} : {s: interpolate(t, [0, 10], [1.0, 1.04], cl), cx: 830, cy: 600};
  const flick = (at: number) => {
    const d = t - at;
    return d >= -0.1 && d < 0.35 ? (d < 0 ? (d + 0.1) / 0.1 : 1 - d / 0.35) : 0;
  };
  const thumb = medium ? Math.max(flick(11.0), flick(13.2)) : (t * 0.9) % 1 < 0.12 ? 1 : 0;
  const anxious = medium ? interpolate(t, [11.4, 12.2], [0, 1], cl) : 0;
  const glow = 0.75 * (0.9 + 0.1 * Math.sin(t * 5));
  return (
    <Stage bg="#0b0d10">
      <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
        <BedroomSet
          t={t}
          sky={NIGHT}
          dark={0.28}
          mid={
            <>
              <GlassBox id="g41b" layer="back" x={830} w={300} h={540} panes={4} t={t} thick={1} />
              <Hero
                id="h41"
                x={830}
                y={820}
                expr={{brow: 0.6 + anxious * 0.4, lid: 0.55 * (1 - anxious), mouth: -0.3 - anxious * 0.1, eyeY: 6, bags: true}}
                blink={blinkAt(t, [4.5, 8.8, 15.9])}
                glow={glow}
                thumb={thumb}
              />
            </>
          }
          front={<GlassBox id="g41f" layer="front" x={830} w={300} h={540} panes={4} t={t} thick={1} frost={0.45} />}
        />
        <Light id="l41" x={830} y={650} r={520} color={C.cold} o={0.75} />
      </Cam>
    </Stage>
  );
};

/* 4.3 + 4.4 — the phone in his hands (POV) */
const Phone: React.FC<{t: number}> = ({t}) => {
  const dead = t >= 21.5;
  const lowFlash = (t * 2.2) % 1 < 0.55;
  const bigBattery = interpolate(t, [19.6, 20.0, 21.2, 21.45], [0, 1, 1, 0], cl);
  const off = interpolate(t, [21.3, 21.6], [0, 1], cl); // screen switching off
  const ambient = dead ? interpolate(t, [21.5, 23.5, 27, 29], [0, 0, 0.0, 0.35], cl) : 1;
  const reflect = interpolate(t, [27.5, 31], [0, 1], cl);
  const tear = interpolate(t, [31.2, 35.2], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const s = t < 27 ? interpolate(t, [18, 27], [1.0, 1.03], cl) : interpolate(t, [27, 40], [1.08, 1.2], {...cl, easing: Easing.inOut(Easing.quad)});
  const px = 960;
  const py = t < 27 ? 560 : 520;
  const pw = 440;
  const ph = 800;
  const sx = px - pw / 2 + 22;
  const sy = py - ph / 2 + 30;
  const sw = pw - 44;
  const sh = ph - 60;
  return (
    <Stage bg="#07080a">
      <Cam s={s} cx={px} cy={py}>
        {!dead && <Light id="p4c" x={px} y={py} r={700} color={C.cold} o={0.7 * (1 - off)} />}
        <rect x={px - pw / 2} y={py - ph / 2} width={pw} height={ph} rx={46} fill="#101317" stroke={dead ? '#2a2f37' : C.outline} strokeWidth={6} opacity={dead ? 0.6 + ambient : 1} />
        <defs>
          <clipPath id="scr4">
            <rect x={sx} y={sy} width={sw} height={sh} rx={26} />
          </clipPath>
        </defs>
        <g clipPath="url(#scr4)">
          <rect x={sx} y={sy} width={sw} height={sh} fill="#05070a" />
          {/* empty feed: nothing new */}
          <g opacity={1 - off}>
            <rect x={sx} y={sy} width={sw} height={sh} fill="#e9eef7" />
            <rect x={sx + sw - 74} y={sy + 22} width={44} height={22} rx={5} fill="none" stroke={lowFlash ? '#e0565b' : '#9aa3b2'} strokeWidth={3} />
            <rect x={sx + sw - 70} y={sy + 26} width={5} height={14} fill="#e0565b" />
            <rect x={sx + sw - 30} y={sy + 28} width={4} height={10} fill={lowFlash ? '#e0565b' : '#9aa3b2'} />
            {[0, 1, 2, 3].map((i) => (
              <g key={i} opacity={0.35}>
                <circle cx={sx + 60} cy={sy + 130 + i * 120} r={30} fill="#c9d1de" />
                <rect x={sx + 110} y={sy + 112 + i * 120} width={220} height={14} rx={7} fill="#c9d1de" />
                <rect x={sx + 110} y={sy + 136 + i * 120} width={140} height={12} rx={6} fill="#dde3ec" />
              </g>
            ))}
            {/* refresh spinner that finds nothing */}
            <circle cx={px} cy={sy + 64} r={16} fill="none" stroke="#9aa3b2" strokeWidth={4} strokeDasharray="60 40" transform={`rotate(${t * 360} ${px} ${sy + 64})`} opacity={t < 19.5 ? 1 : 0} />
            {/* big low battery */}
            <g opacity={bigBattery} transform={`translate(${px} ${py})`}>
              <rect x={-110} y={-200} width={220} height={400} fill="#e9eef7" opacity={0.9} />
              <rect x={-60} y={-40} width={110} height={56} rx={10} fill="none" stroke="#e0565b" strokeWidth={6} />
              <rect x={52} y={-22} width={10} height={20} rx={3} fill="#e0565b" />
              <rect x={-52} y={-32} width={12} height={40} rx={3} fill="#e0565b" opacity={lowFlash ? 1 : 0.3} />
            </g>
          </g>
          {/* power-off line */}
          {off > 0 && off < 1 && <rect x={sx} y={py - 3} width={sw} height={6} fill="#ffffff" opacity={1 - off} />}
          {/* his reflection in the black glass */}
          {reflect > 0 && (
            <g opacity={reflect * 0.4}>
              <Hero id="refl" x={px} y={py + 640} scale={1.65} expr={{brow: 0.8, lid: 0.5, mouth: -0.5, bags: true, tear}} blink={blinkAt(t, [36.2])} pose="arms-down" />
            </g>
          )}
          {/* glass sheen */}
          <rect x={sx - 100} y={sy} width={120} height={sh} fill="#ffffff" opacity={0.04} transform={`skewX(-14)`} />
        </g>
        {/* hands (POV) */}
        <g opacity={dead ? Math.max(0.25, ambient + 0.25) : 1}>
          <ellipse cx={px - pw / 2 - 6} cy={py + 230} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <path d={`M ${px - pw / 2 - 60} ${py + 330} L ${px - pw / 2 - 90} 1150 L ${px - pw / 2 + 30} 1150 L ${px - pw / 2 + 40} ${py + 300}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <ellipse cx={px + pw / 2 + 6} cy={py + 250} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <path d={`M ${px + pw / 2 + 60} ${py + 350} L ${px + pw / 2 + 90} 1150 L ${px + pw / 2 - 30} 1150 L ${px + pw / 2 - 40} ${py + 320}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <rect x={px + pw / 2 - 52} y={py + 385} width={150} height={44} rx={12} fill={C.teal} stroke={C.outline} strokeWidth={5} transform={`rotate(8 ${px + pw / 2 + 20} ${py + 405})`} />
          <ellipse cx={px + pw / 2 - 20} cy={py + 200} rx={38} ry={54} fill={C.cream} stroke={C.outline} strokeWidth={5} transform={`rotate(-50 ${px + pw / 2 - 20} ${py + 200})`} />
          {/* darkness wash over the hands once the screen is off */}
          {dead && <rect x={0} y={0} width={1920} height={1200} fill="#07080a" opacity={0.55 - ambient * 0.6} />}
        </g>
      </Cam>
    </Stage>
  );
};

export const GlassRoomPart4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 18 && <Room t={t} />}
      {t >= 18 && <Phone t={t} />}
      <FilmLook />
      <Counter label="SCREEN TIME" showFrom={0} changes={[[0, '11h']]} />

      <Sequence from={sec(11.5)} durationInFrames={sec(3.1)}>
        <HeadPill text="Nobody's texting." x={830} y={318} dur={sec(3.1)} />
      </Sequence>
      <Sequence from={sec(14.8)} durationInFrames={sec(3.1)}>
        <Caption text="Hundreds of friends. No one **there**." dur={sec(3.1)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(33.0)} durationInFrames={sec(6.4)}>
        <Caption text="He finally saw **himself**." dur={sec(6.4)} highlight={C.amberLight} />
      </Sequence>

      {/* SFX (MUSIC: none) */}
      <Sfx at={0} src="sfx/glass-hum.wav" vol={0.35} />
      <Sfx at={5.5} src="sfx/glass-hum.wav" vol={0.35} />
      <Sfx at={0} src="sfx/room-tone.wav" vol={0.8} />
      <Sfx at={8} src="sfx/room-tone.wav" vol={0.8} dur={10} />
      <Sfx at={11.0} src="sfx/refresh-swoosh.wav" vol={0.6} />
      <Sfx at={13.2} src="sfx/refresh-swoosh.wav" vol={0.6} />
      <Sfx at={11.4} src="sfx/glass-hum.wav" vol={0.25} dur={6.6} />
      <Sfx at={18} src="sfx/room-tone.wav" vol={0.6} dur={3.4} />
      <Sfx at={21.3} src="sfx/power-down.wav" vol={0.7} />
      <Sfx at={27} src="sfx/heartbeat.wav" vol={0.85} />
      <Sfx at={36.4} src="sfx/heartbeat.wav" vol={0.6} dur={3.6} />
    </AbsoluteFill>
  );
};
