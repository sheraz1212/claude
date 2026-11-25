import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {BedroomSet, blinkAt, Cam, FLOOR, GlassBox, Light, mixColor, Particles, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';

// Part 5 — Tiny decision (2:35–3:05). MUSIC: none → hopeful-guitar (enters softly at 23.0 s = 2:58).

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

export const GlassRoomPart5: React.FC = () => {
  const t = useCurrentFrame() / FPS;

  // shots
  const medium = t >= 8 && t < 17;
  const cam = medium
    ? {s: interpolate(t, [8, 17], [1.6, 1.66], cl), cx: 830, cy: 560}
    : t < 8
      ? {s: interpolate(t, [0, 8], [1.0, 1.05], cl), cx: 700, cy: 560}
      : t < 23
        ? {s: interpolate(t, [17, 23], [1.12, 1.16], cl), cx: 830, cy: 560}
        : {s: interpolate(t, [23, 30], [1.16, 1.02], {...cl, easing: io}), cx: 830, cy: 560};

  // light: dawn → full warm
  const dawn = interpolate(t, [0, 8], [0.15, 0.35], cl);
  const flood = interpolate(t, [23, 26.5], [0, 1], {...cl, easing: io});
  const warm = Math.max(dawn, flood);
  const dark = interpolate(t, [0, 23, 26], [0.25, 0.18, 0], cl);
  const sunY = interpolate(t, [0, 23, 30], [650, 600, 470], cl);
  const sky = {
    top: mixColor(flood, '#1a2238', '#3b4a6a'),
    bottom: mixColor(Math.max(flood, 0.4), '#2a2a3a', '#f2c27a'),
    stars: 0.25 * (1 - flood),
    sunY,
    sunO: interpolate(t, [0, 23, 26], [0.5, 0.6, 1], cl),
  };
  const ray = interpolate(t, [0.5, 6.5], [0, 1], {...cl, easing: Easing.out(Easing.quad)});

  // glass
  const crack = interpolate(t, [17.8, 19.8], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const dissolve = interpolate(t, [23.0, 25.5], [0, 1], {...cl, easing: Easing.in(Easing.quad)});

  // acting
  const lookLight = interpolate(t, [4.6, 5.4], [0, 1], cl);
  const resolve = interpolate(t, [10.8, 11.6], [0, 1], cl);
  const putDown = interpolate(t, [14.4, 15.6], [0, 1], {...cl, easing: io});
  const surprise = interpolate(t, [17.9, 18.4, 21.5, 22.5], [0, 1, 1, 0.3], cl);
  const smile = interpolate(t, [24.5, 26.5], [0, 1], cl);
  const charger = t >= 8 && putDown < 0.5;
  const phoneDown = t >= 15.6 || (t >= 8 && putDown >= 1);

  let lHand: [number, number] = [-24, -142];
  let rHand: [number, number] = [24, -142];
  let lHold: 'charger' | 'none' = 'none';
  let rHold: 'phone' | 'none' = 'none';
  let phoneAt: [number, number] | undefined = [0, -142];
  if (t >= 8) {
    // charger in his right hand (with the band), dead phone in the left
    lHand = [interpolate(putDown, [0, 1], [-70, -84]), interpolate(putDown, [0, 1], [-170, -104])];
    rHand = [interpolate(putDown, [0, 1], [70, 120]), interpolate(putDown, [0, 1], [-160, -96])];
    lHold = charger ? 'charger' : 'none';
    rHold = putDown < 0.98 ? 'phone' : 'none';
    phoneAt = undefined;
  }
  if (t >= 17) {
    lHand = [-84, -104];
    rHand = [96, -104];
    lHold = 'none';
    rHold = 'none';
  }

  const expr = {
    brow: t < 8 ? 0.6 - lookLight * 0.3 : t < 17 ? 0.5 - resolve * 1.1 : t < 23 ? 0.2 + surprise * 0.5 : 0.1 - smile * 0.1,
    lid: t < 8 ? 0.45 - lookLight * 0.15 : t < 17 ? 0.35 - resolve * 0.15 : 0.1 * (1 - surprise),
    mouth: t < 23 ? -0.3 + resolve * 0.3 + surprise * 0.1 : 0.1 + smile * 0.6,
    eyeX: t < 8 ? -lookLight * 12 : t < 17 ? (resolve > 0 ? 0 : 10) + putDown * 10 : t < 23 ? 0 : -smile * 12,
    eyeY: t < 8 ? 6 - lookLight * 10 : t < 17 ? 4 + putDown * 8 : t < 23 ? -4 : -6,
    bags: t < 26,
  };

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <BedroomSet
            t={t}
            sky={sky}
            warm={warm}
            dark={dark}
            mid={
              <>
                <GlassBox id="g5b" layer="back" x={830} w={300} h={540} panes={4} t={t} thick={1 - crack * 0.5} dissolve={dissolve} />
                <Hero
                  id="h5"
                  x={830}
                  y={820}
                  lHand={lHand}
                  rHand={rHand}
                  lHold={lHold}
                  rHold={rHold}
                  phoneAt={phoneAt}
                  headTilt={t < 8 ? -lookLight * 4 : t >= 23 ? -smile * 5 : 0}
                  expr={expr}
                  blink={blinkAt(t, [3.0, 9.4, 13.0, 20.6, 27.4])}
                />
              </>
            }
            front={
              <>
                {/* thin warm line of dawn light across the floor, reaching the glass */}
                <polygon points={`420,${FLOOR + 2} ${420 + ray * 300},${FLOOR + 2} ${440 + ray * 340},${FLOOR + 70} 460,${FLOOR + 70}`} fill={C.amberLight} opacity={0.35 * (1 - flood * 0.5)} />
                {/* the phone lying face-down on the blanket */}
                {phoneDown && (
                  <g>
                    <rect x={872} y={700} width={92} height={16} rx={6} fill="#2a2f37" stroke="#6a7383" strokeWidth={3} />
                    <circle cx={952} cy={708} r={3} fill="#6a7383" />
                  </g>
                )}
                <GlassBox id="g5f" layer="front" x={830} w={300} h={540} panes={4} t={t} thick={1 - crack * 0.5} frost={0.45 * (1 - crack)} crack={crack} dissolve={dissolve} />
                <Particles x={830} y={FLOOR} w={340} h={560} p={interpolate(t, [23.0, 27.0], [0, 1], cl)} seed={3} />
                {crack > 0 && <Light id="crackwarm" x={800} y={560} r={260 + crack * 200} color={C.amber} o={crack * (1 - dissolve * 0.5)} />}
              </>
            }
          />
          {t < 23 && <Light id="g5cold" x={830} y={600} r={460} color={C.cold} o={0.35 * (1 - crack)} />}
        </Cam>
      </Stage>
      <FilmLook />
      <Counter label="SCREEN TIME" showFrom={0} changes={[[0, '11h'], [sec(17.8), '']]} />

      <Sequence from={sec(2.0)} durationInFrames={sec(5.6)}>
        <Caption text="Morning came **anyway**." dur={sec(5.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(24.5)} durationInFrames={sec(5.3)}>
        <Caption text="The world sounded **different**." dur={sec(5.3)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(10.5)} durationInFrames={sec(3.6)}>
        <HeadPill text="Not right now." x={640} y={420} side="left" dur={sec(3.6)} />
      </Sequence>

      {/* SFX */}
      <Sfx at={0} src="sfx/room-tone.wav" vol={0.6} dur={8} />
      <Sfx at={1.5} src="sfx/bird-single.wav" vol={0.5} />
      <Sfx at={5.0} src="sfx/bird-single.wav" vol={0.45} />
      <Sfx at={8} src="sfx/room-tone.wav" vol={0.6} dur={9.8} />
      <Sfx at={15.55} src="sfx/phone-tap.wav" vol={0.7} />
      <Sfx at={17.8} src="sfx/glass-crack.wav" vol={0.85} />
      <Sfx at={23.2} src="sfx/birds.wav" vol={0.7} />
      <Sfx at={24.6} src="sfx/kettle.wav" vol={0.35} dur={4.5} />
      <Sfx at={25.0} src="sfx/wind-chimes.wav" vol={0.5} />
      {/* MUSIC: hopeful-guitar — enters softly at 2:58 and continues into Part 6 */}
      <Sfx at={23.0} src="music/hopeful-guitar.wav" vol={0.75} dur={7.0} />
    </AbsoluteFill>
  );
};
