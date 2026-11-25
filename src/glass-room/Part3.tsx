import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {Balloon, blinkAt, Cam, Dog, FLOOR, GlassBox, GREY, Light, mixColor, Person, SCARF, Stage, TAN, Tree} from '../common/sets';
import {C, FPS, H, W, sec} from '../common/theme';

// Part 3 — Contrast: everyone else is living (1:15–1:55). MUSIC: none (only muffled outside sounds).

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glowFlicker = (t: number) => 0.7 * (0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 2.1));

/* ------------------------------------------------ park (3.1 + 3.2) */
const Park: React.FC<{t: number}> = ({t}) => {
  const close = t >= 8;
  const walkP = interpolate(t, [0, 5.4], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const hx = close ? 560 : -160 + walkP * 720;
  const walking = !close && t < 5.4;
  // 3.2 acting
  const knock = close && t > 8.5 && t < 9.4 ? Math.abs(Math.sin((t - 8.5) * 22)) : 0;
  const reach = close ? interpolate(t, [8.1, 8.5, 12.6, 13.3], [0, 1, 1, 0], cl) : 0;
  const looksUp = close ? interpolate(t, [9.6, 9.9, 11.7, 12.0], [0, 1, 1, 0], cl) : 0;
  const friendSad = close ? interpolate(t, [12.2, 13.0], [0, 1], cl) : 0;
  const cam = close ? {s: interpolate(t, [8, 15], [1.32, 1.38], cl), cx: 720, cy: 620} : {s: interpolate(t, [0, 8], [1.0, 1.03], cl), cx: 960, cy: 560};
  const fx = close ? 860 : 1060;
  const laugh = (k: number) => Math.sin(t * 6 + k) * 3;
  return (
    <Stage>
      <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
        <Light id="parkwarm" x={1300} y={520} r={1000} color={C.amber} o={0.9} />
        <Tree x={240} s={1.1} warm={0.5} />
        <Tree x={1720} s={1.25} warm={1} />
        <Tree x={1960} s={0.9} warm={1} />
        {/* picnic blanket + cake */}
        <polygon points={`1020,${FLOOR - 4} 1600,${FLOOR - 4} 1660,${FLOOR + 50} 960,${FLOOR + 50}`} fill="#2a2018" stroke={C.amber} strokeWidth={3} opacity={0.9} />
        {[1100, 1220, 1340, 1460].map((lx) => (
          <line key={lx} x1={lx} y1={FLOOR - 4} x2={lx - 30} y2={FLOOR + 50} stroke={C.amber} strokeWidth={2} opacity={0.4} />
        ))}
        {/* balloons */}
        <Balloon x={1700} y={470} color="#e9a94f" t={t} k={0} anchor={[1720, FLOOR - 4]} />
        <Balloon x={1780} y={430} color="#e07b8a" t={t} k={1} anchor={[1720, FLOOR - 4]} />
        <Balloon x={1750} y={540} color={C.teal} t={t} k={2} anchor={[1720, FLOOR - 4]} />
        {/* friends */}
        <Person
          id="friend"
          x={fx}
          y={FLOOR}
          showLegs
          color={GREY}
          accessory="scarf"
          accessoryColor={SCARF}
          lHand={close ? [-110 - reach * 60 + knock * 10, -250 - reach * 40] : [-80, -110]}
          rHand={close ? [90, -110] : [100, -150 + Math.sin(t * 6) * 10]}
          headTilt={close ? -6 : laugh(0)}
          expr={{mouth: close ? 0.7 - friendSad * 0.8 : 0.9, brow: close ? friendSad * 0.6 : 0, eyeX: close ? -12 : -6}}
          blink={blinkAt(t, [3.1, 10.6, 13.8])}
        />
        {!close && (
          <>
            <Person id="f2" x={1300} y={FLOOR} showLegs color={TAN} accessory="bow" accessoryColor="#e07b8a" lHand={[-70, -150 + Math.sin(t * 5) * 8]} rHand={[90, -120]} headTilt={laugh(1)} expr={{mouth: 1, eyeX: -6}} blink={blinkAt(t, [4.2])} scale={0.92} />
            <Person id="f3" x={1580} y={FLOOR} showLegs color={GREY} accessory="glasses" pose="arms-down" headTilt={laugh(2)} expr={{mouth: 0.9, eyeX: -8}} blink={blinkAt(t, [2.4, 6.6])} scale={0.96} />
          </>
        )}
        {!close && (
          <>
        <g transform={`translate(1430 ${FLOOR + 30})`}>
            <rect x={-40} y={-40} width={80} height={40} rx={6} fill="#f3ebcf" stroke={C.outline} strokeWidth={3} />
            <path d="M -40 -26 q 20 10 40 0 q 20 10 40 0" stroke="#e07b8a" strokeWidth={4} fill="none" />
            {[-20, 0, 20].map((cx) => (
              <g key={cx}>
                <line x1={cx} y1={-40} x2={cx} y2={-58} stroke={C.coldLight} strokeWidth={4} />
                <ellipse cx={cx} cy={-66 + Math.sin(t * 12 + cx) * 1.5} rx={4} ry={7} fill={C.amberLight} />
              </g>
            ))}
          </g>
            </>
        )}
        {/* hero in the closed box */}
        <GlassBox id="g31b" layer="back" x={hx} w={290} h={540} panes={4} t={t} />
        <Hero
          id="h31"
          x={hx}
          y={FLOOR}
          showLegs
          walk={walking ? t * 7 : undefined}
          expr={{
            brow: 0.5 - looksUp * 0.7,
            lid: 0.35 * (1 - looksUp),
            mouth: -0.2,
            eyeX: looksUp * 12,
            eyeY: 6 - looksUp * 12,
            bags: true,
          }}
          headTilt={looksUp * -5}
          blink={blinkAt(t, [2.0, 6.2, 13.9])}
          glow={glowFlicker(t)}
          thumb={looksUp > 0.5 ? 0 : (t * 1.5) % 1 < 0.15 ? 1 : 0}
        />
        <GlassBox id="g31f" layer="front" x={hx} w={290} h={540} panes={4} t={t} />
        <Light id="g31l" x={hx} y={680} r={360} color={C.cold} o={0.55} />
        <line x1={-400} y1={FLOOR} x2={2300} y2={FLOOR} stroke={C.line} strokeWidth={3} />
      </Cam>
    </Stage>
  );
};

/* ------------------------------------------------ phone POV (3.3) */
const PhonePOV: React.FC<{t: number}> = ({t}) => {
  const tap = interpolate(t, [17.2, 17.9, 18.0, 18.4], [0, 1, 1, 0], cl);
  const liked = t >= 18.0;
  const heartPop = liked ? interpolate(t, [18.0, 18.12, 18.3], [1, 1.5, 1.1], cl) : 1;
  const s = interpolate(t, [15, 23], [1.0, 1.04], cl);
  const px = 960;
  const py = 560;
  const pw = 440;
  const ph = 800;
  return (
    <Stage>
      {/* blurred party behind the glass */}
      <g style={{filter: 'blur(18px)'}}>
        {Array.from({length: 18}, (_, i) => (
          <circle key={i} cx={(i * 263) % 1920} cy={260 + ((i * 131) % 520)} r={40 + (i % 4) * 22} fill={i % 3 === 0 ? '#e07b8a' : i % 3 === 1 ? C.amber : C.amberLight} opacity={0.25 + 0.1 * Math.sin(t * 2 + i)} />
        ))}
      </g>
      <Light id="povcold" x={px} y={py} r={700} color={C.cold} o={0.8} />
      {/* glass edge in front of the view */}
      <line x1={330} y1={44} x2={300} y2={1036} stroke={C.coldLight} strokeWidth={3} opacity={0.5} style={{filter: `drop-shadow(0 0 8px ${C.cold})`}} />
      <line x1={1610} y1={44} x2={1640} y2={1036} stroke={C.coldLight} strokeWidth={3} opacity={0.5} style={{filter: `drop-shadow(0 0 8px ${C.cold})`}} />
      <Cam s={s} cx={px} cy={py}>
        {/* phone */}
        <rect x={px - pw / 2} y={py - ph / 2} width={pw} height={ph} rx={46} fill="#14171c" stroke={C.outline} strokeWidth={6} />
        <rect x={px - pw / 2 + 22} y={py - ph / 2 + 30} width={pw - 44} height={ph - 60} rx={26} fill="#e9eef7" />
        {/* post: the picnic photo */}
        <g>
          <rect x={px - 190} y={py - 300} width={380} height={380} rx={10} fill="#3a2a1e" />
          <circle cx={px + 90} cy={py - 210} r={44} fill={C.amberLight} opacity={0.8} />
          {[[-110, -220, '#e9a94f'], [-60, -250, '#e07b8a'], [-20, -215, C.teal]].map(([bx, by, col], i) => (
            <g key={i}>
              <line x1={px + (bx as number)} y1={py + (by as number) + 26} x2={px - 60} y2={py - 40} stroke="#d9c9a8" strokeWidth={2} />
              <ellipse cx={px + (bx as number)} cy={py + (by as number)} rx={20} ry={26} fill={col as string} />
            </g>
          ))}
          {[-110, -20, 70].map((fx, i) => (
            <g key={fx} transform={`translate(${px + fx} ${py + 60})`}>
              <rect x={-24} y={-70} width={48} height={60} rx={22} fill={i === 1 ? TAN : GREY} />
              <circle cx={0} cy={-100} r={32} fill={i === 1 ? TAN : GREY} />
              <path d="M -10 -92 q 10 8 20 0" stroke={C.outline} strokeWidth={3} fill="none" />
              {i === 0 && <path d="M -26 -72 q 26 12 52 0 l 0 10 q -26 12 -52 0 z" fill={SCARF} />}
            </g>
          ))}
          <rect x={px - 190} y={py + 60} width={380} height={20} fill="#2a2018" />
        </g>
        {/* heart + count */}
        <g transform={`translate(${px - 150} ${py + 150}) scale(${heartPop})`}>
          <path d="M 0 12 C -30 -10 -22 -34 0 -20 C 22 -34 30 -10 0 12 Z" fill={liked ? '#e0565b' : 'none'} stroke={liked ? '#e0565b' : '#5a6273'} strokeWidth={4} strokeLinejoin="round" />
        </g>
        <text x={px - 112} y={py + 160} fontFamily="Nunito" fontWeight={800} fontSize={30} fill="#5a6273">
          {liked ? '24' : '23'}
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={px - 190} y={py + 200 + i * 34} width={i === 2 ? 200 : 360} height={14} rx={7} fill="#c9d1de" />
        ))}
        {/* hands holding the phone (POV: his right hand on the right, with the teal band) */}
        <g>
          <ellipse cx={px - pw / 2 - 6} cy={py + 230} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <path d={`M ${px - pw / 2 - 60} ${py + 330} L ${px - pw / 2 - 90} 1100 L ${px - pw / 2 + 30} 1100 L ${px - pw / 2 + 40} ${py + 300}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <ellipse cx={px + pw / 2 + 6} cy={py + 250} rx={60} ry={110} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <path d={`M ${px + pw / 2 + 60} ${py + 350} L ${px + pw / 2 + 90} 1100 L ${px + pw / 2 - 30} 1100 L ${px + pw / 2 - 40} ${py + 320}`} fill={C.cream} stroke={C.outline} strokeWidth={5} />
          <rect x={px + pw / 2 - 52} y={py + 385} width={150} height={44} rx={12} fill={C.teal} stroke={C.outline} strokeWidth={5} transform={`rotate(8 ${px + pw / 2 + 20} ${py + 405})`} />
          {/* thumb moving to the heart */}
          <ellipse
            cx={interpolate(tap, [0, 1], [px + pw / 2 - 20, px - 150])}
            cy={interpolate(tap, [0, 1], [py + 200, py + 160])}
            rx={38}
            ry={54}
            fill={C.cream}
            stroke={C.outline}
            strokeWidth={5}
            transform={`rotate(-50 ${interpolate(tap, [0, 1], [px + pw / 2 - 20, px - 150])} ${interpolate(tap, [0, 1], [py + 200, py + 160])})`}
          />
        </g>
      </Cam>
    </Stage>
  );
};

/* ------------------------------------------------ beach (3.4 + 3.5) */
const HORIZON = 600;
const Beach: React.FC<{t: number}> = ({t}) => {
  const set = interpolate(t, [33, 38.5], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const leave = interpolate(t, [33.5, 39.5], [0, 1], cl);
  const frost = interpolate(t, [34, 40], [0, 1], cl);
  const lower = interpolate(t, [35.6, 36.6], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const sunY = 585 + set * 130;
  const skyTop = mixColor(set, '#3b2f4a', '#141523');
  const skyBot = mixColor(set, '#e9a94f', '#3a2c3c');
  const s = interpolate(t, [23, 40], [1.0, 1.06], cl);
  const dogX = 1000 + Math.sin(t * 0.9) * 220 + leave * 900;
  const dogFacing = Math.cos(t * 0.9) > 0 || leave > 0.05 ? 1 : -1;
  const hx = 500;
  const hy = 905;
  return (
    <Stage>
      <defs>
        <linearGradient id="bsky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="1" stopColor={skyBot} />
        </linearGradient>
        <clipPath id="abovesea">
          <rect x={0} y={0} width={W} height={HORIZON} />
        </clipPath>
      </defs>
      <Cam s={s} cx={700} cy={600}>
        <rect x={-200} y={0} width={W + 400} height={HORIZON} fill="url(#bsky3)" />
        <g clipPath="url(#abovesea)">
          <circle cx={1300} cy={sunY} r={90} fill={C.amberLight} opacity={0.95} />
        </g>
        <rect x={-200} y={HORIZON} width={W + 400} height={190} fill={mixColor(set, '#2b2740', '#121522')} />
        {/* sun reflection + wave lines */}
        {Array.from({length: 7}, (_, i) => (
          <rect key={i} x={1300 - 70 + i * 3 + Math.sin(t * 2 + i) * 14} y={HORIZON + 14 + i * 22} width={140 - i * 14} height={5} rx={2} fill={C.amberLight} opacity={(0.5 - i * 0.05) * (1 - set)} />
        ))}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M -200 ${700 + i * 26 + Math.sin(t * 1.2 + i) * 5} q 200 -12 400 0 t 400 0 t 400 0 t 400 0 t 400 0 t 400 0`}
            stroke="#5d6b85"
            strokeWidth={2.5}
            fill="none"
            opacity={0.5}
          />
        ))}
        <rect x={-200} y={790} width={W + 400} height={400} fill="#1a1714" />
        <line x1={-200} y1={790} x2={W + 200} y2={790} stroke={C.line} strokeWidth={3} />
        <Light id="beachwarm" x={1300} y={HORIZON} r={1100} color={C.amber} o={0.8 * (1 - set)} />

        {/* people on the beach */}
        <g transform={`translate(${leave * 900} 0)`}>
          <Person id="kid" x={1470} y={FLOOR} scale={0.62} showLegs color={TAN} accessory="bow" accessoryColor="#e07b8a" lHand={[-60, -150]} rHand={[90, -330]} expr={{mouth: 0.9, eyeX: 10, eyeY: -8}} walk={leave > 0 ? t * 8 : undefined} />
          <line x1={1470 + 90 * 0.62} y1={FLOOR - 330 * 0.62} x2={1650 + Math.sin(t * 1.4) * 30} y2={250 + Math.cos(t * 1.1) * 20} stroke="#d9c9a8" strokeWidth={2} />
          <g transform={`translate(${1650 + Math.sin(t * 1.4) * 30} ${250 + Math.cos(t * 1.1) * 20}) rotate(${Math.sin(t * 1.7) * 12})`}>
            <path d="M 0 -50 L 34 0 L 0 50 L -34 0 Z" fill={C.amber} stroke={C.outline} strokeWidth={3} />
            <line x1={0} y1={-50} x2={0} y2={50} stroke={C.outline} strokeWidth={2} />
            <path d={`M 0 50 q 10 20 -6 40 q -14 20 6 40`} stroke="#e07b8a" strokeWidth={3} fill="none" />
          </g>
          <Person
            id="walker1"
            x={1760 - (t - 23) * 18}
            y={FLOOR}
            scale={0.9}
            showLegs
            walk={t * 6}
            color={GREY}
            accessory="glasses"
            pose="arms-down"
            expr={{mouth: 0.8, eyeX: 10}}
          />
          <Person id="walker2" x={1880 - (t - 23) * 18} y={FLOOR} scale={0.88} showLegs walk={t * 6 + 1} color={TAN} accessory="tie" accessoryColor={C.teal} pose="arms-down" expr={{mouth: 0.9, eyeX: -10}} />
        </g>
        <Dog x={dogX} t={t} run={1} facing={dogFacing as 1 | -1} s={0.9} />

        {/* hero from behind, sitting in the box, filming */}
        <GlassBox id="g34b" layer="back" x={hx} floor={hy} w={280} h={480} panes={4} t={t} thick={frost * 0.5} />
        <Hero
          id="h34"
          x={hx}
          y={hy}
          back
          lHand={lower < 1 ? [interpolate(lower, [0, 1], [70, -80]), interpolate(lower, [0, 1], [-350, -110])] : [-80, -110]}
          rHand={lower < 1 ? [interpolate(lower, [0, 1], [150, 86]), interpolate(lower, [0, 1], [-345, -110])] : [86, -110]}
          lean={-lower * 3}
          headTilt={lower * 6}
        />
        {/* the phone screen (we see what he films) */}
        {lower < 0.6 && (
          <g transform={`translate(${hx + 110 * (1 - lower)} ${hy - 395 * (1 - lower * 1.2)})`} opacity={1 - lower * 1.6}>
            <rect x={-62} y={-38} width={124} height={76} rx={10} fill="#14171c" stroke={C.outline} strokeWidth={4} />
            <rect x={-54} y={-31} width={108} height={62} rx={5} fill={skyBot} />
            <circle cx={14} cy={4} r={12} fill={C.amberLight} />
            <rect x={-54} y={8} width={108} height={23} fill="#2b2740" />
            <circle cx={40} cy={-22} r={5} fill="#e0565b" opacity={(t * 2) % 1 < 0.5 ? 1 : 0.2} />
          </g>
        )}
        <GlassBox id="g34f" layer="front" x={hx} floor={hy} w={280} h={480} panes={4} t={t} frost={frost} thick={frost * 0.5} />
        <Light id="g34l" x={hx + 110} y={hy - 395} r={260} color={C.cold} o={0.6 * (1 - lower)} />
        {/* foreground dune hides his legs */}
        <path d={`M -200 ${FLOOR + 10} Q 300 ${FLOOR - 30} 700 ${FLOOR + 2} T 1600 ${FLOOR + 12} T 2200 ${FLOOR} L 2200 1200 L -200 1200 Z`} fill="#14110f" stroke={C.line} strokeWidth={3} />
      </Cam>
    </Stage>
  );
};

export const GlassRoomPart3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 15 && <Park t={t} />}
      {t >= 15 && t < 23 && <PhonePOV t={t} />}
      {t >= 23 && <Beach t={t} />}
      <FilmLook />
      <Counter label="SCREEN TIME" showFrom={0} changes={[[0, '9h'], [sec(23), '10h']]} />

      <Sequence from={sec(2.5)} durationInFrames={sec(5.3)}>
        <Caption text="Everyone else was **outside**." dur={sec(5.3)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(18.8)} durationInFrames={sec(4.0)}>
        <Caption text="He liked it. From **there**." dur={sec(4.0)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(25.0)} durationInFrames={sec(5.0)}>
        <Caption text="He filmed the **sunset**." dur={sec(5.0)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(9.0)} durationInFrames={sec(3.2)}>
        <HeadPill text="Come join us!" x={860 + (860 - 720) * 0.35 - 30} y={300} dur={sec(3.2)} />
      </Sequence>

      {/* SFX only (MUSIC: none). Outside sounds are muffled by the glass. */}
      <Sfx at={0} src="sfx/birds-muffled.wav" vol={0.7} dur={5} />
      <Sfx at={5} src="sfx/birds-muffled.wav" vol={0.7} dur={5} />
      <Sfx at={10} src="sfx/birds-muffled.wav" vol={0.5} dur={5} />
      <Sfx at={0.2} src="sfx/footsteps.wav" vol={0.35} />
      <Sfx at={2.8} src="sfx/footsteps.wav" vol={0.3} dur={2.5} />
      <Sfx at={1.0} src="sfx/crowd-laugh-muffled.wav" vol={0.9} />
      <Sfx at={4.6} src="sfx/crowd-laugh-muffled.wav" vol={0.8} dur={3.4} />
      <Sfx at={8.6} src="sfx/knock-glass.wav" vol={0.9} />
      <Sfx at={11.6} src="sfx/phone-buzz.wav" vol={0.8} />
      <Sfx at={13.0} src="sfx/crowd-laugh-muffled.wav" vol={0.5} dur={2} />
      <Sfx at={15} src="sfx/crowd-laugh-muffled.wav" vol={0.35} dur={4} />
      <Sfx at={18.0} src="sfx/like-tap.wav" vol={0.7} />
      <Sfx at={23} src="sfx/waves-muffled.wav" vol={0.9} dur={8} />
      <Sfx at={30.5} src="sfx/waves-muffled.wav" vol={0.9} dur={9.5} />
      <Sfx at={25.5} src="sfx/gull-muffled.wav" vol={0.6} />
      <Sfx at={29.2} src="sfx/gull-muffled.wav" vol={0.5} />
      <Sfx at={33} src="sfx/wind.wav" vol={0.7} dur={7} />
      <Sfx at={34.5} src="sfx/frost-creak.wav" vol={0.7} />
      <Sfx at={37.2} src="sfx/frost-creak.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
