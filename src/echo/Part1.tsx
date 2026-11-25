import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, mixColor, Stage} from '../common/sets';
import {DeskRoom, Doodle, EchoWords, PhonePOV, Ripples} from '../common/echoSets';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 1: Hook + establish (0:00–0:35). MUSIC: none. 10 shots.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const EVENING = {top: '#232842', bottom: '#5d4a52'};

export const WallArt: React.FC<{n?: number}> = ({n = 6}) => (
  <g>
    {[[300, 600], [420, 640], [1330, 440], [1440, 470], [1550, 430], [1700, 560]].slice(0, n).map(([x, y], i) => (
      <Doodle key={i} x={x} y={y} w={90} h={68} />
    ))}
  </g>
);

/* 2 — close-up of the pencil drawing */
const PencilClose: React.FC<{t: number}> = ({t}) => {
  const draw = interpolate(t, [4, 8], [0.1, 0.8], cl);
  const px = 760 + ((t * 260) % 420);
  const py = 520 + Math.sin(t * 9) * 60;
  return (
    <Stage bg="#15130f">
      <Light id="pcw" x={900} y={300} r={900} color={C.amber} o={1} />
      <Doodle x={460} y={190} w={1000} h={740} draw={draw} />
      <g transform={`translate(${px} ${py}) rotate(30)`}>
        <rect x={-14} y={-300} width={28} height={300} fill="#e9b85a" stroke={C.outline} strokeWidth={5} />
        <path d="M -14 0 L 14 0 L 0 40 Z" fill="#3a2c22" stroke={C.outline} strokeWidth={4} />
      </g>
      <ellipse cx={px + 150} cy={py - 230} rx={110} ry={120} fill={C.cream} stroke={C.outline} strokeWidth={6} />
    </Stage>
  );
};

/* 3, 4, 7 — his room */
const Room: React.FC<{t: number}> = ({t}) => {
  const shot = t < 12 ? 3 : t < 16 ? 4 : 7;
  const lift = shot === 4 ? interpolate(t, [12.2, 13.0], [0, 1], {...cl, easing: io}) : 0;
  const cam = shot === 3 ? {s: interpolate(t, [8, 12], [1.0, 1.04], cl), cx: 960, cy: 560} : shot === 4 ? {s: 1.7, cx: 1010, cy: 520} : {s: interpolate(t, [22, 26], [1.15, 1.2], cl), cx: 960, cy: 600};
  const sc = shot === 3 ? Math.sin(t * 18) * 6 : 0;
  const bob = shot === 7 ? Math.abs(Math.sin(t * 9)) * 4 : 0;
  const by = interpolate(lift, [0, 1], [560, 395]);
  return (
    <Stage>
      <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
        <DeskRoom
          t={t}
          lamp={1}
          sky={EVENING}
          front={
            <>
              <WallArt />
              {shot !== 7 && <Doodle x={interpolate(lift, [0, 1], [1040, 1090])} y={by} w={170} h={130} draw={shot === 3 ? 0.85 : 1} />}
            </>
          }
          mid={
            <Hero
              id="e1h"
              x={960}
              y={820 - bob}
              lHand={shot === 7 ? undefined : [-40, -130]}
              rHand={shot === 7 ? undefined : shot === 4 ? [interpolate(lift, [0, 1], [150, 215]), interpolate(lift, [0, 1], [-175, -300])] : [150 + sc, -175 + sc * 0.5]}
              rHold={shot === 3 ? 'pencil' : 'none'}
              glow={shot === 7 ? 0.8 : 0}
              thumb={shot === 7 && (t * 1.5) % 1 < 0.15 ? 1 : 0}
              headTilt={shot === 4 ? -6 * lift : 0}
              expr={shot === 4 ? {brow: -0.2, mouth: 1, eyeX: 10, eyeY: -6, lid: 0.3} : shot === 7 ? {brow: 0.3, mouth: 0.4, eyeY: 7} : {mouth: 0.4, eyeX: 9, eyeY: 6}}
              blink={blinkAt(t, [10.4, 14.8, 24.5])}
            />
          }
        />
      </Cam>
    </Stage>
  );
};

/* 5 — phone camera frames the drawing; 6 — POST */
const PhoneShots: React.FC<{t: number}> = ({t}) => {
  const flash = interpolate(t, [17.4, 17.5, 17.9], [0, 0.9, 0], cl);
  const camera = t < 19;
  const tap = interpolate(t, [20.0, 20.5, 20.7], [0, 1, 0.6], cl);
  return (
    <Stage>
      <Light id="ppw" x={960} y={560} r={800} color={camera ? C.amber : C.cold} o={0.6} />
      <PhonePOV px={960} py={560} thumb={camera ? undefined : [960 + 40, 560 + 300 - tap * 60]}>
        {camera ? (
          <g>
            <rect x={760} y={190} width={400} height={740} fill="#1d1a15" />
            <Doodle x={790} y={420} w={340} h={260} />
            {[[790, 420], [1130, 420], [790, 680], [1130, 680]].map(([x, y], i) => (
              <path key={i} d={`M ${x + (i % 2 ? -30 : 30)} ${y} L ${x} ${y} L ${x} ${y + (i < 2 ? 30 : -30)}`} stroke="#fff" strokeWidth={5} fill="none" />
            ))}
            <circle cx={960} cy={860} r={40} fill="#fff" stroke="#ccc" strokeWidth={6} />
          </g>
        ) : (
          <g>
            <Doodle x={790} y={260} w={340} h={260} />
            {[0, 1].map((i) => (
              <rect key={i} x={790} y={560 + i * 34} width={i ? 200 : 320} height={14} rx={7} fill="#c9d1de" />
            ))}
            <rect x={800} y={760} width={320} height={80} rx={40} fill={tap > 0.5 ? '#3d7be0' : '#5b8fe0'} />
            <text x={960} y={812} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#fff">
              POST
            </text>
          </g>
        )}
      </PhonePOV>
      {flash > 0 && <rect width={1920} height={1080} fill="#fff" opacity={flash} />}
    </Stage>
  );
};

/* 8 — the comment arrives */
const Comment: React.FC<{t: number}> = ({t}) => {
  const c = interpolate(t, [26.8, 27.2], [0, 1], {...cl, easing: Easing.out(Easing.back(1.5))});
  const x0 = 762;
  const y0 = 190;
  return (
    <Stage>
      <Light id="cmc" x={960} y={560} r={700} color={C.cold} o={0.6} />
      <Cam s={interpolate(t, [26, 29.5], [1.0, 1.12], cl)} cx={960} cy={700}>
        <PhonePOV px={960} py={560}>
          <Doodle x={x0 + 14} y={y0 + 40} w={368} h={276} />
          <line x1={x0 + 14} y1={y0 + 380} x2={x0 + 382} y2={y0 + 380} stroke="#c9d1de" strokeWidth={2} />
          <g opacity={c} transform={`translate(0 ${(1 - c) * 30})`}>
            <circle cx={x0 + 40} cy={y0 + 440} r={22} fill="#6b6f78" />
            <rect x={x0 + 74} y={y0 + 416} width={300} height={62} rx={18} fill="#d8dde6" />
            <text x={x0 + 92} y={y0 + 458} fontFamily="Nunito" fontWeight={800} fontSize={30} fill="#1d2027">
              This is ugly.
            </text>
          </g>
        </PhonePOV>
      </Cam>
    </Stage>
  );
};

/* 9 — extreme close-up of his eyes; 10 — the word peels off into the room */
const Face: React.FC<{t: number}> = ({t}) => {
  const eyes = t < 32;
  const hurt = interpolate(t, [29.8, 31.0], [0, 1], {...cl, easing: io});
  const cold = interpolate(t, [30.4, 32], [0, 1], cl);
  const flick = t > 30.6 && t < 31.4 && (t * 12) % 1 < 0.5 ? 0.4 : 1;
  return (
    <Stage>
      <Cam s={eyes ? interpolate(t, [29.5, 32], [3.2, 3.35], cl) : interpolate(t, [32, 35], [1.0, 1.06], cl)} cx={1100} cy={eyes ? 470 : 560}>
        <Light id="fcl" x={1100} y={900} r={760} color={mixColor(cold, C.amber, C.cold)} o={0.8 * flick} />
        <Hero id="e1c" x={1100} y={1430} scale={2.7} expr={{brow: 0.3 + hurt * 0.7, lid: 0, mouth: 0.6 - hurt * 1.1, eyeY: 6}} blink={blinkAt(t, [33.8])} glow={0.6 + cold * 0.3} glowColor={mixColor(cold, C.amberLight, C.cold)} />
        {!eyes && <EchoWords t={t} n={interpolate(t, [32.2, 34.8], [0.3, 3.2], cl)} area={[760, 520, 1460, 900]} size={[70, 150]} seed={4} />}
        {!eyes && <Ripples x={1100} y={920} t={t} o={1} max={420} />}
      </Cam>
    </Stage>
  );
};

export const EchoPart1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const fromBlack = interpolate(t, [4, 4.4], [1, 0], cl);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && t < 8 && <PencilClose t={t} />}
      {((t >= 8 && t < 16) || (t >= 22 && t < 26)) && <Room t={t} />}
      {t >= 16 && t < 22 && <PhoneShots t={t} />}
      {t >= 26 && t < 29.5 && <Comment t={t} />}
      {t >= 29.5 && <Face t={t} />}
      <AbsoluteFill style={{background: '#000', opacity: fromBlack}} />
      <FilmLook />
      <Counter label="ECHOES" showFrom={sec(4.4)} changes={[[0, '0'], [sec(27.2), '1']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="One comment. Forever loud." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(8.4)} durationInFrames={sec(3.5)}>
        <Caption text="He loved to **draw**." dur={sec(3.5)} />
      </Sequence>
      <Sequence from={sec(22.3)} durationInFrames={sec(3.4)}>
        <HeadPill text="Maybe they'll like it." x={960} y={600 + (390 - 600) * 1.15 - 12} dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(32.3)} durationInFrames={sec(2.7)}>
        <Caption text="It was just one **comment**." dur={sec(2.7)} highlight={C.coldLight} />
      </Sequence>
      {/* SFX (MUSIC: none) */}
      <Sfx at={4.1} src="sfx/pencil.wav" vol={0.7} />
      <Sfx at={5.8} src="sfx/pencil.wav" vol={0.7} />
      <Sfx at={8.5} src="sfx/pencil.wav" vol={0.4} />
      <Sfx at={17.35} src="sfx/shutter.wav" vol={0.7} />
      <Sfx at={20.4} src="sfx/whoosh.wav" vol={0.6} />
      <Sfx at={23.2} src="sfx/refresh-swoosh.wav" vol={0.4} />
      <Sfx at={24.8} src="sfx/refresh-swoosh.wav" vol={0.4} />
      <Sfx at={26.8} src="sfx/notification-ping.wav" vol={0.6} />
      <Sfx at={30.6} src="sfx/glass-hum.wav" vol={0.3} dur={1.5} />
      <Sfx at={32.2} src="sfx/demon-whisper.wav" vol={0.9} />
      <Sfx at={32.4} src="sfx/echo-ping.wav" vol={0.35} />
    </AbsoluteFill>
  );
};
