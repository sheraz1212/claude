import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage} from '../common/sets';
import {Canteen, FRIENDS, Tray} from './canteen';
import {BridgeModel, Library} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Clip 7 (35 s): help comes back + the canteen again + end card. MUSIC: hopeful-guitar-2 (final strum at 30 s).
  1  0–4     WIDE library, he repairs the bridge; the scarf friend arrives → setup
  2  4–7.5   MEDIUM, he starts pushing his bridge aside — "Wait."          → old habit, stopped
  3  7.5–11  INSERT the friend's finished assignment (A)                  → he did it himself
  4  11–14.5 MEDIUM two-shot, friend points at the broken support          → "Let me help."
  5  14.5–18 MEDIUM, together they stand the bridge up                     → help came back
  6  18–21   WIDE canteen, he walks in with his tray                      → mirror of the opening
  7  21–24   MEDIUM, bag on the chair, the empty cup held out again       → the test
  8  24–27   CLOSE (head+shoulders), calm smile, he doesn't take it       → he changed
  9  27–30   MEDIUM, the scarf friend moves the bag and offers the chair  → belonging, unearned
  10 30–35   black end card                                                → message
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const F4 = FRIENDS[3];
const HAPPY = {brow: -0.1, mouth: 0.7};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 18) {
    const shot = t < 4 ? 1 : t < 7.5 ? 2 : t < 11 ? 3 : t < 14.5 ? 4 : 5;
    if (shot === 3)
      return (
        <Stage bg="#14120f">
          <Light id="h3" x={960} y={460} r={800} color={C.amber} o={0.7} />
          <Cam s={interpolate(t, [7.5, 11], [1.0, 1.06], cl)} cx={960} cy={540}>
            <g transform="rotate(-3 960 540)">
              <rect x={660} y={200} width={600} height={720} fill="#efe7d0" stroke={C.outline} strokeWidth={6} />
              {Array.from({length: 9}, (_, i) => (
                <rect key={i} x={720} y={420 + i * 52} width={i % 3 === 2 ? 300 : 480} height={14} rx={7} fill="#b9b2a0" />
              ))}
              <circle cx={1120} cy={300} r={70} fill="none" stroke="#c0392b" strokeWidth={8} />
              <text x={1120} y={326} textAnchor="middle" fontFamily="Patrick Hand" fontSize={90} fill="#c0392b">
                A
              </text>
              <rect x={720} y={260} width={260} height={24} rx={8} fill="#8a836f" />
            </g>
          </Cam>
        </Stage>
      );
    const fx = shot === 1 ? interpolate(t, [0.3, 3.0], [1800, 1250], {...cl, easing: Easing.out(Easing.quad)}) : 1250;
    const aside = shot === 2 ? interpolate(t, [4.3, 5.2], [0, 0.6], {...cl, easing: io}) : 0;
    const stop = shot === 2 ? interpolate(t, [5.0, 5.5], [0, 1], cl) : 0;
    const point = shot === 4 ? interpolate(t, [11.4, 12.2], [0, 1], {...cl, easing: io}) : 0;
    const lift = shot === 5 ? interpolate(t, [14.8, 16.2], [0, 1], {...cl, easing: io}) : 0;
    const cam = shot === 1 ? {s: 1.0, cx: 960, cy: 560} : shot === 5 ? {s: 1.55, cx: 1060, cy: 560} : {s: 1.6, cx: 1060, cy: 580};
    const bx = 1060 + aside * 200;
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <Library
            children={
              <>
                <Hero
                  id="k1"
                  x={880}
                  y={820}
                  lHand={shot === 5 ? [120, -150 - lift * 40] : [100, -150]}
                  rHand={shot === 5 ? [200, -150 - lift * 40] : shot === 2 ? [170 + aside * 200, -140] : [190 + Math.sin(t * 10) * 3, -140]}
                  rHold={shot === 1 ? 'pencil' : 'none'}
                  expr={shot === 2 ? {brow: 0.3 - stop * 0.2, mouth: 0.2, eyeX: 14 * stop, lid: 0} : shot === 5 ? {...HAPPY, eyeX: 12, eyeY: -4} : {mouth: 0.4, eyeX: shot === 4 ? 14 : 10, eyeY: shot === 1 ? 8 : 0}}
                  blink={blinkAt(t, [2.4, 9.0, 13.6, 17.0])}
                />
                {shot === 1 ? (
                  <Person id="k1f" x={fx} y={FLOOR} showLegs walk={t < 3 ? t * 7 : undefined} color={F4.color} accessory={F4.accessory} accessoryColor={F4.accessoryColor} lHand={[-80, -150]} rHand={[80, -150]} expr={{mouth: 0.7, eyeX: -12}} />
                ) : (
                  <Person
                    id="k2f"
                    x={1250}
                    y={shot === 2 ? FLOOR : 820}
                    showLegs={shot === 2}
                    color={F4.color}
                    accessory={F4.accessory}
                    accessoryColor={F4.accessoryColor}
                    lHand={shot === 2 ? [interpolate(stop, [0, 1], [-80, -170]), interpolate(stop, [0, 1], [-150, -330])] : shot === 4 ? [interpolate(point, [0, 1], [-60, -170]), interpolate(point, [0, 1], [-130, -150])] : [-110, -150 - lift * 40]}
                    rHand={[80, -140]}
                    expr={{mouth: 0.8, eyeX: -12, brow: shot === 2 ? 0.2 : 0}}
                    blink={blinkAt(t, [6.6, 15.4])}
                  />
                )}
              </>
            }
            front={<BridgeModel x={bx} y={698 - lift * 30} s={0.7} built={shot === 5 ? 1 : 0.95} broken={shot < 5} />}
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 21) {
    const x = interpolate(t, [18, 20.6], [2000, 1440], {...cl, easing: Easing.out(Easing.quad)});
    return (
      <Stage>
        <Cam s={1.4} cx={1250} cy={580}>
          <Canteen t={t}>
            <Hero id="k6" x={x} y={FLOOR + 40} showLegs walk={t < 20.6 ? t * 6.5 : undefined} lHand={[-70, -150]} rHand={[70, -150]} expr={{...HAPPY, eyeX: -12}} />
            <Tray x={x} y={FLOOR + 40} />
          </Canteen>
        </Cam>
      </Stage>
    );
  }
  if (t < 24) {
    const hold = interpolate(t, [21.3, 22.0], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.6} cx={560} cy={600}>
          <Canteen t={t} laugh={0.3} f1Cup={hold} />
        </Cam>
      </Stage>
    );
  }
  if (t < 27) {
    return (
      <Stage>
        <g opacity={0.45}>
          <Canteen t={t} friends={false} />
        </g>
        <Light id="k8" x={1000} y={800} r={700} color={C.amber} o={0.5} />
        <Hero id="k8h" x={1000} y={1080} scale={1.75} lHand={[-70, -150]} rHand={[70, -150]} headTilt={t > 24.6 && t < 25.6 ? Math.sin((t - 24.6) * 12) * 4 : 0} expr={{brow: -0.1, mouth: 0.5, eyeX: -10, lid: 0.15}} blink={blinkAt(t, [26.2])} />
        <Tray x={1000} y={1080 + interpolate(t, [26.0, 26.8], [0, 60], cl) * 1.75} s={1.75} />
      </Stage>
    );
  }
  const bag = interpolate(t, [27.3, 28.1], [0, 1], {...cl, easing: io});
  const pull = interpolate(t, [28.1, 28.8], [0, 1], {...cl, easing: io});
  const sit = interpolate(t, [28.9, 29.5], [0, 1], {...cl, easing: io});
  return (
    <Stage>
      <Cam s={1.45} cx={1150} cy={600}>
        <Canteen t={t} laugh={0.6} bagOff={bag} chairX={1250 + pull * 80} f4Reach={Math.max(bag, 1 - pull) * (sit > 0 ? 0 : 1)} />
        <Hero
          id="k9"
          x={1330 + pull * 0}
          y={interpolate(sit, [0, 1], [FLOOR + 40, 820])}
          showLegs={sit < 0.5}
          lHand={[-70, -150]}
          rHand={[70, -150]}
          expr={{...HAPPY, eyeX: -14, mouth: 0.6 + sit * 0.3}}
          blink={blinkAt(t, [29.4])}
        />
      </Cam>
    </Stage>
  );
};

export const YesClip7: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 30 && <Shots t={t} />}
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '22 · NO 2'], [sec(18), '']]} />
      <Sequence from={sec(5.0)} durationInFrames={sec(2.3)}>
        <HeadPill text="Wait." x={1060 + (1250 - 1060) * 1.6} y={580 + (FLOOR - 430 - 580) * 1.6 - 10} dur={sec(2.3)} />
      </Sequence>
      <Sequence from={sec(12.0)} durationInFrames={sec(2.4)}>
        <HeadPill text="Let me help." x={1060 + (1250 - 1060) * 1.6} y={580 + (390 - 580) * 1.6 - 10} dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(15.0)} durationInFrames={sec(2.9)}>
        <Caption text="This time, help came **back**." dur={sec(2.9)} />
      </Sequence>
      <Sequence from={sec(30)} durationInFrames={sec(5)}>
        <BlackCard text="Belonging isn't earned." dur={sec(5)} />
      </Sequence>
      {/* MUSIC: hopeful-guitar-2 (final strum lands on the end card) */}
      <Sfx at={0} src="music/hopeful-guitar-2.wav" vol={0.7} />
      {/* SFX */}
      <Sfx at={0.4} src="sfx/glue.wav" vol={0.4} />
      <Sfx at={0.5} src="sfx/steps-hard.wav" vol={0.3} dur={2.5} />
      <Sfx at={4.4} src="sfx/paper-slide.wav" vol={0.35} />
      <Sfx at={7.6} src="sfx/page-flip.wav" vol={0.5} />
      <Sfx at={15.2} src="sfx/cup-tap.wav" vol={0.35} />
      <Sfx at={18.2} src="sfx/steps-hard.wav" vol={0.35} dur={2.4} />
      <Sfx at={20.6} src="sfx/tray-rattle.wav" vol={0.45} />
      <Sfx at={21.4} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={26.4} src="sfx/tray-rattle.wav" vol={0.5} />
      <Sfx at={27.4} src="sfx/bag-thud.wav" vol={0.5} />
      <Sfx at={28.2} src="sfx/chair-scrape.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
