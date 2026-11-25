import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage} from '../common/sets';
import {FRIENDS} from './canteen';
import {Chair} from './canteen';
import {BridgeModel, CampusPath, Dorm, Library} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Clip 6 (35 s): learning to say no — and it isn't easy. MUSIC: none.
  1  0–4     WIDE library, friend (scarf) arrives, he pulls out a chair → still kind
  2  4–7.5   MEDIUM two-shot, laptop pushed to him                       → the old pattern
  3  7.5–11  MEDIUM, he pushes it back and points: "Start here."         → helps, doesn't do it
  4  11–14.5 MEDIUM, he opens his own notebook; friend starts typing      → NO 2
  5  14.5–18 WIDE dorm evening, he repairs his bridge                     → his own work
  6  18–21.5 MEDIUM, he keeps checking a silent phone                     → doubt
  7  21.5–25 WIDE campus path, a friend walks past without waving         → a real cost
  8  25–28.5 MEDIUM dorm, he glues a new support anyway                    → persistence
  9  28.5–32 INSERT the bridge standing stronger                          → progress
  10 32–35   MEDIUM, small smile at the bridge                            → his time is his
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const F4 = FRIENDS[3];
const F2 = FRIENDS[1];

const LaptopBack: React.FC<{x: number; y: number; facing?: 'him' | 'friend'}> = ({x, y}) => (
  <g>
    <rect x={x - 80} y={y - 106} width={160} height={100} rx={8} fill="#2a2f37" stroke={C.outline} strokeWidth={4} />
    <circle cx={x} cy={y - 56} r={7} fill="#5a6273" />
    <rect x={x - 96} y={y - 8} width={192} height={10} rx={4} fill="#3a4049" stroke={C.outline} strokeWidth={3} />
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 14.5) {
    const shot = t < 4 ? 1 : t < 7.5 ? 2 : t < 11 ? 3 : 4;
    const fx = shot === 1 ? interpolate(t, [0, 2.4], [1800, 1250], {...cl, easing: Easing.out(Easing.quad)}) : 1180;
    const chair = shot === 1 ? interpolate(t, [2.4, 3.4], [0, 1], {...cl, easing: io}) : 1;
    const push = shot === 2 ? interpolate(t, [4.6, 5.6], [0, 1], {...cl, easing: io}) : shot >= 3 ? 1 : 0;
    const back = shot === 3 ? interpolate(t, [7.8, 8.6], [0, 1], {...cl, easing: io}) : shot === 4 ? 1 : 0;
    const lapX = 1100 - push * 160 + back * 160;
    const sitting = shot >= 2;
    const write = shot === 4 ? Math.sin(t * 16) * 5 : 0;
    const cam = shot === 1 ? {s: 1.0, cx: 960, cy: 560} : shot === 2 ? {s: 1.55, cx: 1060, cy: 600} : shot === 3 ? {s: 1.7, cx: 1000, cy: 580} : {s: 1.55, cx: 1060, cy: 600};
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <Library
            children={
              <>
                {!sitting && <Chair x={interpolate(chair, [0, 1], [1320, 1180])} y={FLOOR} s={1} />}
                <Hero
                  id="g1"
                  x={900}
                  y={820}
                  lHand={shot === 1 ? [-60, -130] : shot === 4 ? [-60, -130] : [-60, -130]}
                  rHand={shot === 1 ? [interpolate(chair, [0, 1], [60, 260]), -150] : shot === 3 ? [interpolate(back, [0, 1], [60, 190]), -170] : shot === 4 ? [50 + write, -140] : [60, -130]}
                  rHold={shot === 4 ? 'pencil' : 'none'}
                  expr={shot === 3 ? {brow: -0.2, mouth: 0.4, eyeX: 12} : shot === 4 ? {mouth: 0.4, eyeY: 8} : {mouth: 0.5, eyeX: 12, brow: shot === 2 ? 0.3 : 0}}
                  blink={blinkAt(t, [3.2, 6.6, 13.3])}
                />
                {sitting ? (
                  <Person
                    id="g1f"
                    x={1180}
                    y={820}
                    color={F4.color}
                    accessory={F4.accessory}
                    accessoryColor={F4.accessoryColor}
                    lHand={[interpolate(push, [0, 1], [-60, -150]) + back * 90, -140 + (shot === 4 ? Math.sin(t * 22) * 4 : 0)]}
                    rHand={[60, -130 + (shot === 4 ? Math.cos(t * 22) * 4 : 0)]}
                    expr={shot === 4 ? {brow: 0.4 - interpolate(t, [12, 13], [0, 0.6], cl), mouth: interpolate(t, [12, 13.5], [0, 0.5], cl), eyeX: interpolate(t, [12.4, 13], [-12, 0], cl), eyeY: 8} : {mouth: 0.6, eyeX: -12, brow: shot === 3 ? 0.6 : 0}}
                    blink={blinkAt(t, [9.6])}
                  />
                ) : (
                  <Person id="g1w" x={fx} y={FLOOR} showLegs walk={t < 2.4 ? t * 7 : undefined} color={F4.color} accessory={F4.accessory} accessoryColor={F4.accessoryColor} lHand={[-80, -150]} rHand={[80, -150]} expr={{mouth: 0.6, eyeX: -12}} />
                )}
              </>
            }
            front={
              <>
                {sitting && <LaptopBack x={lapX} y={698} />}
                {shot === 4 && <rect x={830} y={688} width={120} height={12} rx={3} fill="#efe7d0" stroke={C.outline} strokeWidth={2} />}
              </>
            }
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5 || (t >= 25 && t < 28.5) || t >= 32) {
    const shot = t < 18 ? 5 : t < 21.5 ? 6 : t < 28.5 ? 8 : 10;
    const g = shot === 5 || shot === 8 ? Math.sin(t * 10) * 4 : 0;
    const glance = shot === 6 ? Math.max(0, Math.sin((t - 18) * 2.4)) : 0;
    const cam = shot === 5 ? {s: 1.0, cx: 960, cy: 560} : shot === 6 ? {s: 1.7, cx: 1060, cy: 580} : shot === 8 ? {s: 1.55, cx: 1080, cy: 580} : {s: 1.65, cx: 1100, cy: 580};
    const built = shot === 5 ? 0.8 : shot === 6 ? 0.82 : shot === 8 ? interpolate(t, [25, 28.5], [0.85, 0.92], cl) : 0.95;
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <Dorm
            t={t}
            front={
              <>
                <BridgeModel x={1200} y={698} s={0.75} built={built} broken={shot === 5} />
                <rect x={860} y={688} width={60} height={12} rx={4} fill="#14171c" stroke={C.outline} strokeWidth={3} />
              </>
            }
          >
            <Hero
              id="g5"
              x={1000}
              y={820}
              lHand={shot === 10 ? [-50, -130] : [130, -150]}
              rHand={shot === 10 ? [50, -130] : [220 + g, -130]}
              rHold={shot === 10 ? 'none' : 'pencil'}
              headTilt={shot === 6 ? -6 * glance : 4}
              expr={shot === 6 ? {brow: 0.6, mouth: -0.2, eyeX: 14 - glance * 26, eyeY: 8} : shot === 10 ? {brow: -0.1, mouth: 0.6, eyeX: 14, eyeY: 8} : {brow: -0.2, mouth: 0.3, eyeX: 14, eyeY: 10}}
              blink={blinkAt(t, [16.2, 20.4, 27.0, 33.6])}
            />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  if (t < 25) {
    const fx = interpolate(t, [21.5, 25], [1800, 300], cl);
    const wave = interpolate(t, [22.2, 22.6, 23.4, 24.0], [0, 1, 1, 0], cl);
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <CampusPath>
            <Hero id="g7" x={760} y={FLOOR} showLegs lHand={[-90, -110]} rHand={[interpolate(wave, [0, 1], [90, 130]), interpolate(wave, [0, 1], [-110, -400]) + Math.sin(t * 14) * 10 * wave]} expr={{brow: wave > 0.5 ? -0.1 : 0.5, mouth: wave > 0.5 ? 0.6 : -0.2, eyeX: fx > 760 ? 14 : -14}} blink={blinkAt(t, [24.4])} />
            <Person id="g7f" x={fx} y={FLOOR} showLegs walk={t * 7} color={F2.color} accessory={F2.accessory} pose="arms-down" headTilt={-8} expr={{mouth: -0.1, eyeX: -14, eyeY: -4}} />
          </CampusPath>
        </Cam>
      </Stage>
    );
  }
  // 9 — insert: the bridge standing stronger
  return (
    <Stage bg="#14120f">
      <Light id="g9" x={960} y={460} r={800} color={C.amber} o={0.8} />
      <Cam s={interpolate(t, [28.5, 32], [1.0, 1.06], cl)} cx={960} cy={620}>
        <BridgeModel x={960} y={780} s={2.6} built={interpolate(t, [28.5, 31.5], [0.9, 1], cl)} />
        <line x1={0} y1={790} x2={1920} y2={790} stroke={C.line} strokeWidth={5} />
      </Cam>
    </Stage>
  );
};

export const YesClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '22 · NO 1'], [sec(11.3), '22 · NO 2']]} />
      <Sequence from={sec(8.3)} durationInFrames={sec(2.5)}>
        <HeadPill text="Start here." x={1000 + (900 - 1000) * 1.7} y={580 + (390 - 580) * 1.7 - 10} dur={sec(2.5)} />
      </Sequence>
      <Sequence from={sec(18.6)} durationInFrames={sec(2.6)}>
        <HeadPill text="Was that wrong?" x={1060 + (1000 - 1060) * 1.7} y={580 + (390 - 580) * 1.7 - 10} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(22.0)} durationInFrames={sec(2.9)}>
        <Caption text="Not everyone liked **it**." dur={sec(2.9)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(32.2)} durationInFrames={sec(2.8)}>
        <Caption text="His time was his **again**." dur={sec(2.8)} />
      </Sequence>
      {/* SFX (MUSIC: none) */}
      <Sfx at={0.2} src="sfx/steps-hard.wav" vol={0.35} dur={2.2} />
      <Sfx at={2.5} src="sfx/chair-scrape.wav" vol={0.6} />
      <Sfx at={4.7} src="sfx/paper-slide.wav" vol={0.45} />
      <Sfx at={7.9} src="sfx/paper-slide.wav" vol={0.45} />
      <Sfx at={11.2} src="sfx/page-flip.wav" vol={0.5} />
      <Sfx at={12.6} src="sfx/typing.wav" vol={0.4} dur={1.9} />
      <Sfx at={14.8} src="sfx/glue.wav" vol={0.5} />
      <Sfx at={18.3} src="sfx/cloth.wav" vol={0.3} />
      <Sfx at={21.5} src="sfx/steps-hard.wav" vol={0.35} dur={3.5} />
      <Sfx at={25.4} src="sfx/glue.wav" vol={0.5} />
      <Sfx at={26.8} src="sfx/cup-tap.wav" vol={0.35} />
      <Sfx at={29.0} src="sfx/pin-tap.wav" vol={0.4} />
      {/* MUSIC cues */}
      <Sfx at={14.5} src="music/resolve-piano-short.wav" vol={0.55} />
      <Sfx at={25.0} src="music/resolve-piano.wav" vol={0.6} dur={10} />
      {/* BGM score */}
      <Sfx at={0} src="music/light-campus-change.wav" vol={0.4} />
      <Sfx at={21.6} src="music/low-note.wav" vol={0.45} dur={3.4} />
    </AbsoluteFill>
  );
};
