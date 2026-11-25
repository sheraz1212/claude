import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage} from '../common/sets';
import {FRIENDS} from './canteen';
import {BridgeModel, Dorm} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 The One Who Always Said Yes — Clip 3 (35 s): his own dream vs. one more favour. MUSIC: none.
  1  0–4     WIDE dorm, he builds the bridge               → his dream, the poster with the date
  2  4–7.5   INSERT the half-built bridge model            → the object that matters
  3  7.5–11  MEDIUM, he glues a stick, happy               → he loves it
  4  11–15   MEDIUM-WIDE, friend walks in with a laptop    → the interruption
  5  15–18.5 CLOSE (head+shoulders), looks bridge → friend → the choice
  6  18.5–22 MEDIUM, slides the bridge away, takes laptop  → YES 22
  7  22–26   WIDE night time-lapse, moon moves, friend sleeps → the whole night is gone
  8  26–29.5 MEDIUM morning, friend pats him and leaves    → no thanks, just a pat
  9  29.5–33 MEDIUM, he turns to the unfinished bridge     → what he gave up
  10 33–35   INSERT poster + clock: one hour left          → the clock starts
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const F1 = FRIENDS[0];

const Laptop: React.FC<{x: number; y: number; open?: boolean; glow?: number}> = ({x, y, open = true, glow = 0}) => (
  <g>
    {open ? (
      <>
        <rect x={x - 80} y={y - 110} width={160} height={104} rx={8} fill="#2a2f37" stroke={C.outline} strokeWidth={4} />
        <circle cx={x} cy={y - 58} r={8} fill="#5a6273" />
        <rect x={x - 96} y={y - 8} width={192} height={10} rx={4} fill="#3a4049" stroke={C.outline} strokeWidth={3} />
        {glow > 0 && <Light id={`lg${x}`} x={x} y={y - 140} r={260} color={C.cold} o={glow} />}
      </>
    ) : (
      <rect x={x - 90} y={y - 14} width={180} height={14} rx={4} fill="#3a4049" stroke={C.outline} strokeWidth={3} />
    )}
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  const glueing = Math.sin(t * 10) * 4;
  // 1 — wide
  if (t < 4)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 4], [1.0, 1.03], cl)} cx={960} cy={560}>
          <Dorm t={t} front={<BridgeModel x={1180} y={698} s={0.7} built={0.5} />}>
            <Hero id="w1" x={980} y={820} lHand={[-50, -130]} rHand={[150 + glueing, -140]} expr={{mouth: 0.6, eyeX: 12, eyeY: 8}} blink={blinkAt(t, [2.6])} />
          </Dorm>
        </Cam>
      </Stage>
    );
  // 2 — insert: the model
  if (t < 7.5)
    return (
      <Stage bg="#14120f">
        <Light id="bi" x={960} y={460} r={800} color={C.amber} o={0.8} />
        <Cam s={interpolate(t, [4, 7.5], [1.0, 1.06], cl)} cx={960} cy={600}>
          <BridgeModel x={960} y={780} s={2.6} built={0.55} />
          <g transform="translate(1500 780)">
            <rect x={-40} y={-150} width={80} height={150} rx={14} fill="#e9e4d6" stroke={C.outline} strokeWidth={5} />
            <path d="M -16 -150 L 0 -200 L 16 -150 Z" fill={C.amber} stroke={C.outline} strokeWidth={4} />
          </g>
          <line x1={0} y1={790} x2={1920} y2={790} stroke={C.line} strokeWidth={5} />
        </Cam>
      </Stage>
    );
  // 3 — medium: glueing, focused
  if (t < 11)
    return (
      <Stage>
        <Cam s={1.6} cx={1060} cy={580}>
          <Dorm t={t} front={<BridgeModel x={1180} y={698} s={0.7} built={interpolate(t, [7.5, 11], [0.55, 0.62], cl)} />}>
            <Hero id="m3" x={980} y={820} lHand={[120, -150]} rHand={[200 + glueing, -130]} rHold="pencil" headTilt={6} expr={{brow: -0.3, mouth: 0.7, eyeX: 14, eyeY: 10}} blink={blinkAt(t, [9.6])} />
          </Dorm>
        </Cam>
      </Stage>
    );
  // 4 — friend walks in with the laptop
  if (t < 15) {
    const fx = interpolate(t, [11.3, 12.6], [300, 600], {...cl, easing: Easing.out(Easing.quad)});
    return (
      <Stage>
        <Cam s={1.25} cx={900} cy={580}>
          <Dorm t={t} front={<BridgeModel x={1180} y={698} s={0.7} built={0.62} />}>
            <Hero id="m4" x={980} y={820} lHand={[-50, -130]} rHand={[150, -140]} headTilt={-4} expr={{brow: 0.1, mouth: 0.3, eyeX: -14}} blink={blinkAt(t, [13.4])} />
            <Person id="f4in" x={fx} y={FLOOR} showLegs walk={t < 12.6 ? t * 7 : undefined} color={F1.color} accessory={F1.accessory} accessoryColor={F1.accessoryColor} lHand={[-80, -140]} rHand={[80, -160]} expr={{mouth: 0.7, eyeX: 12, brow: 0.3}} />
            <Laptop x={fx + 20} y={FLOOR - 140} open={false} />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  // 5 — close: bridge → friend
  if (t < 18.5) {
    const look = interpolate(t, [15.3, 16.2, 17.2, 18.0], [0, 1, 1, -1], cl);
    return (
      <Stage>
        <g opacity={0.45}>
          <Dorm t={t} />
        </g>
        <Hero id="c5" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: 0.4, mouth: -0.1, eyeX: look >= 0 ? 14 * look : 14 * look, eyeY: look > 0 ? 8 * look : 0}} blink={blinkAt(t, [16.7])} />
      </Stage>
    );
  }
  // 6 — slides the bridge away, takes the laptop
  if (t < 22) {
    const aside = interpolate(t, [18.8, 19.8], [0, 1], {...cl, easing: io});
    const take = interpolate(t, [20.2, 21.0], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.55} cx={1000} cy={580}>
          <Dorm
            t={t}
            front={
              <>
                <BridgeModel x={1180 + aside * 170} y={698} s={0.7} built={0.62} />
                {take > 0.5 && <Laptop x={960} y={698} />}
              </>
            }
          >
            <Hero id="m6" x={980} y={820} lHand={[-50, -130]} rHand={[150 + aside * 120, -140]} expr={{brow: 0.3, mouth: 0.3, eyeX: -10}} blink={blinkAt(t, [21.4])} />
            <Person id="f6" x={600} y={FLOOR} showLegs color={F1.color} accessory={F1.accessory} accessoryColor={F1.accessoryColor} lHand={[interpolate(take, [0, 1], [-80, 230]), interpolate(take, [0, 1], [-140, -200])]} rHand={[80, -160]} expr={{mouth: 0.9, eyeX: 12}} />
            {take <= 0.5 && <Laptop x={interpolate(take, [0, 0.5], [620, 820])} y={FLOOR - 140} open={false} />}
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  // 7 — night time-lapse
  if (t < 26) {
    const p = (t - 22) / 4;
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <Dorm t={t} night={1} moonX={1480 + p * 260} front={<><Laptop x={960} y={698} glow={0.9} /><BridgeModel x={1350} y={698} s={0.7} built={0.62} /></>}>
            <Person id="f7" x={330} y={700} color={F1.color} accessory={F1.accessory} accessoryColor={F1.accessoryColor} pose="arms-down" headTilt={18} expr={{lid: 1, mouth: 0.1}} />
            <Hero id="m7" x={980} y={820} lHand={[-40, -140 + Math.sin(t * 30) * 4]} rHand={[40, -140 + Math.cos(t * 30) * 4]} expr={{brow: 0.4, lid: 0.2 + p * 0.3, mouth: -0.1, eyeY: 8, bags: p > 0.5}} glow={0.8} blink={blinkAt(t, [23.5, 25.2])} />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  // 8 — morning: pat on the shoulder, he leaves
  if (t < 29.5) {
    const leave = interpolate(t, [27.6, 29.4], [0, 1], cl);
    const pat = t > 26.6 && t < 27.5 ? Math.abs(Math.sin((t - 26.6) * 12)) * 12 : 0;
    return (
      <Stage>
        <Cam s={1.35} cx={900} cy={580}>
          <Dorm t={t} morning={1} front={<BridgeModel x={1350} y={698} s={0.7} built={0.62} />}>
            <Hero id="m8" x={980} y={820} lHand={[-50, -130]} rHand={[50, -130]} headTilt={pat ? 4 : 0} expr={{brow: 0.3, lid: 0.45, mouth: 0.2, eyeX: -12, bags: true}} blink={blinkAt(t, [28.4])} />
            <Person id="f8" x={interpolate(leave, [0, 1], [620, 200])} y={FLOOR} showLegs walk={leave > 0 ? t * 7 : undefined} color={F1.color} accessory={F1.accessory} accessoryColor={F1.accessoryColor} lHand={[-80, -160]} rHand={leave > 0 ? [80, -120] : [260, -320 + pat]} expr={{mouth: 1, eyeX: leave > 0 ? -12 : 12}} />
            <Laptop x={interpolate(leave, [0, 1], [620, 200]) - 80} y={FLOOR - 160} open={false} />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  // 9 — alone, he turns to the bridge
  if (t < 33) {
    const turn = interpolate(t, [30.0, 31.0], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.6} cx={1100} cy={580}>
          <Dorm t={t} morning={1} front={<BridgeModel x={1300} y={698} s={0.8} built={0.62} />}>
            <Hero id="m9" x={1000} y={820} lHand={[-50, -130]} rHand={[50, -130]} headTilt={turn * 6} expr={{brow: 0.6, lid: 0.45, mouth: -0.3, eyeX: 14 * turn, eyeY: 8 * turn, bags: true}} blink={blinkAt(t, [32.0])} />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  // 10 — insert: the poster and the clock
  const hand = interpolate(t, [33, 35], [0, 6], cl);
  return (
    <Stage bg="#121316">
      <Light id="pst" x={960} y={540} r={800} color={C.amber} o={0.5} />
      <Cam s={interpolate(t, [33, 35], [1.0, 1.05], cl)} cx={960} cy={540}>
        <g transform="translate(560 160) scale(1.6)">
          <rect x={0} y={0} width={260} height={300} fill="#1e1a14" stroke={C.amber} strokeWidth={4} />
          <text x={130} y={60} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={C.amberLight}>
            DESIGN
          </text>
          <text x={130} y={275} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={24} fill={C.cream}>
            FRI · 10:00
          </text>
          <path d="M 30 220 Q 130 120 230 220" stroke={C.amberLight} strokeWidth={5} fill="none" />
        </g>
        <g transform="translate(1420 420)">
          <circle r={130} fill="#16191e" stroke={C.cream} strokeWidth={8} />
          <line x1={0} y1={0} x2={-70} y2={0} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={-100} stroke={C.amberLight} strokeWidth={7} strokeLinecap="round" transform={`rotate(${hand})`} />
        </g>
      </Cam>
    </Stage>
  );
};

export const YesClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '21'], [sec(21.0), '22']]} />
      <Sequence from={sec(0.5)} durationInFrames={sec(3.3)}>
        <Caption text="He had his own **dream**." dur={sec(3.3)} />
      </Sequence>
      <Sequence from={sec(12.4)} durationInFrames={sec(2.4)}>
        <HeadPill text="Due by morning!" x={900 + (700 - 900) * 1.25} y={580 + (FLOOR - 430 - 580) * 1.25 - 10} dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(33.2)} durationInFrames={sec(1.8)}>
        <Caption text="One hour **left**." dur={sec(1.8)} highlight="#e0565b" />
      </Sequence>
      {/* SFX only (MUSIC: none) */}
      <Sfx at={1.2} src="sfx/glue.wav" vol={0.5} />
      <Sfx at={8.3} src="sfx/glue.wav" vol={0.6} />
      <Sfx at={9.6} src="sfx/cup-tap.wav" vol={0.3} />
      <Sfx at={11.0} src="sfx/knock.wav" vol={0.7} />
      <Sfx at={11.4} src="sfx/steps-hard.wav" vol={0.35} dur={1.3} />
      <Sfx at={19.0} src="sfx/paper-slide.wav" vol={0.5} />
      <Sfx at={20.6} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={22.0} src="sfx/typing.wav" vol={0.55} dur={4} />
      <Sfx at={22.0} src="sfx/clock-fast.wav" vol={0.5} />
      <Sfx at={26.1} src="sfx/bird-single.wav" vol={0.4} />
      <Sfx at={26.7} src="sfx/pat.wav" vol={0.6} />
      <Sfx at={27.6} src="sfx/steps-hard.wav" vol={0.35} dur={1.6} />
      <Sfx at={29.2} src="sfx/door-close.wav" vol={0.6} />
      <Sfx at={33.0} src="sfx/clock-tick.wav" vol={0.6} />
      <Sfx at={34.0} src="sfx/clock-tick.wav" vol={0.6} />
      {/* MUSIC cues */}
      <Sfx at={12.6} src="music/dark-sting.wav" vol={0.7} />
      <Sfx at={29.6} src="music/low-note.wav" vol={0.6} />
      {/* BGM score */}
      <Sfx at={0} src="music/dream-piano.wav" vol={0.45} />
      <Sfx at={18.8} src="music/small-sad.wav" vol={0.4} dur={3.4} />
      <Sfx at={22.0} src="music/night-arp.wav" vol={0.45} />
      <Sfx at={26.1} src="music/morning-guitar.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
