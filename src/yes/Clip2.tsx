import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage} from '../common/sets';
import {Doodle, PhonePOV} from '../common/echoSets';
import {FRIENDS} from './canteen';
import {BagsInArms, Classroom, Dorm, Field, Library} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 The One Who Always Said Yes — Clip 2 (35 s): the habit montage. MUSIC: yes-8bit (0–24.5), then none.
  1  0–3.5    WIDE class, he takes careful notes          → he is a good student
  2  3.5–7    MEDIUM two-shot, friend takes his notebook  → YES 2
  3  7–10.5   WIDE library, he reads his own book         → his own work
  4  10.5–14  MEDIUM two-shot, papers slid onto his book  → YES 3, he pushes his book aside
  5  14–17.5  WIDE field, he runs in to play              → he wants to join
  6  17.5–21  MEDIUM, bags dumped into his arms           → YES 4
  7  21–24.5  WIDE sideline, game goes on without him     → left out
  8  24.5–28  MEDIUM his room at night, phone lights up   → hope
  9  28–31.5  POV phone, every message is a favour        → YES 9 → 21
  10 31.5–35  CLOSE (head+shoulders), smile fades         → realisation begins
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const F = (i: number) => FRIENDS[i];
const Pal: React.FC<{i: number} & Partial<React.ComponentProps<typeof Person>> & {x: number; y: number}> = ({i, ...p}) => (
  <Person id={`p${i}${p.x}`} color={F(i).color} accessory={F(i).accessory} accessoryColor={F(i).accessoryColor} {...p} />
);

const Shots: React.FC<{t: number}> = ({t}) => {
  const write = Math.sin(t * 16) * 5;
  if (t < 7) {
    const two = t >= 3.5;
    const take = two ? interpolate(t, [4.2, 5.2], [0, 1], {...cl, easing: io}) : 0;
    return (
      <Stage>
        <Cam s={two ? 1.6 : 1.0} cx={two ? 1060 : 960} cy={two ? 600 : 560}>
          <Classroom
            children={
              <>
                <Person id="tch" x={540} y={FLOOR - 120} scale={0.8} showLegs color={TAN2} accessory="glasses" lHand={[-160, -360]} rHand={[90, -110]} expr={{mouth: 0.3, eyeX: -12, eyeY: -6}} />
                <Hero id="c1h" x={960} y={820} lHand={[-50, -130]} rHand={[40 + (take ? 0 : write), -140]} rHold="pencil" expr={{mouth: two ? 0.5 : 0.2, eyeX: two ? 14 : 0, eyeY: two ? 0 : 8}} blink={blinkAt(t, [2.4, 6.3])} />
                {two && <Pal i={1} x={1260} y={820} lHand={[interpolate(take, [0, 1], [-60, -200]), interpolate(take, [0, 1], [-130, -150])]} rHand={[60, -130]} headTilt={-6} expr={{mouth: 0.7, eyeX: -12}} />}
              </>
            }
            front={<Doodle x={two ? interpolate(take, [0, 1], [900, 1070]) : 900} y={690} w={120} h={14} />}
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 14) {
    const two = t >= 10.5;
    const slide = two ? interpolate(t, [11.0, 11.8], [0, 1], {...cl, easing: io}) : 0;
    const aside = two ? interpolate(t, [12.6, 13.3], [0, 1], {...cl, easing: io}) : 0;
    return (
      <Stage>
        <Cam s={two ? 1.6 : 1.0} cx={two ? 900 : 960} cy={two ? 600 : 560}>
          <Library
            children={
              <>
                <Hero id="l1h" x={960} y={820} lHand={[-60, -130]} rHand={[60, -130]} expr={{mouth: two ? 0.4 : 0.3, eyeY: two && slide < 1 ? 0 : 8, eyeX: two && slide < 1 ? -12 : 0}} blink={blinkAt(t, [9.2, 13.8])} />
                {two && <Pal i={2} x={660} y={820} lHand={[interpolate(slide, [0, 1], [-60, 120]), -140]} rHand={[60, -130]} headTilt={6} expr={{mouth: 0.8, eyeX: 12}} />}
              </>
            }
            front={
              <>
                <rect x={900 + aside * 260} y={680} width={120} height={20} rx={3} fill="#5a3a2a" stroke={C.outline} strokeWidth={3} />
                {two && <rect x={interpolate(slide, [0, 1], [700, 905])} y={676} width={110} height={10} fill="#efe7d0" stroke={C.outline} strokeWidth={2} />}
              </>
            }
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 24.5) {
    const shot = t < 17.5 ? 5 : t < 21 ? 6 : 7;
    const runIn = interpolate(t, [14, 16.5], [-150, 700], {...cl, easing: Easing.out(Easing.quad)});
    const dump = shot === 6 ? interpolate(t, [18.0, 18.6], [0, 1], cl) : 1;
    const ballX = shot === 7 ? interpolate(t, [21, 24.5], [500, 1700], cl) : 1200 + Math.sin(t * 3) * 200;
    const ballY = shot === 7 ? 760 - Math.sin(((t - 21) / 3.5) * Math.PI) * 260 : FLOOR - 20;
    const cam = shot === 5 ? {s: 1.0, cx: 960, cy: 560} : shot === 6 ? {s: 1.6, cx: 760, cy: 600} : {s: 1.0, cx: 960, cy: 560};
    const hx = shot === 5 ? runIn : shot === 6 ? 760 : 300;
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <Field t={t}>
            {[0, 2, 3].map((i, k) => (
              <Pal key={i} i={i} x={(shot === 6 ? 1060 : 1000) + k * (shot === 6 ? 150 : 200) + Math.sin(t * 4 + k) * 30} y={FLOOR} showLegs walk={t * 9 + k} pose="arms-down" expr={{mouth: 0.9, eyeX: 10}} />
            ))}
            {shot === 6 && dump < 1 && <BagsInArms x={interpolate(dump, [0, 1], [1050, 760])} y={FLOOR - 150} s={1} />}
            <Hero
              id="fh"
              x={hx}
              y={FLOOR}
              showLegs
              walk={shot === 5 && t < 16.5 ? t * 9 : undefined}
              lHand={shot === 5 ? undefined : [-60, -170]}
              rHand={shot === 5 ? undefined : [60, -170]}
              pose="arms-down"
              expr={shot === 5 ? {brow: -0.2, mouth: 0.9, eyeX: 12} : shot === 6 ? {brow: 0.3, mouth: 0.2, eyeX: 12, eyeY: -4} : {brow: 0.5, mouth: -0.1, eyeX: 14 + (ballX - 900) / 80, eyeY: -4}}
              blink={blinkAt(t, [16.8, 20.2, 23.6])}
            />
            {shot !== 5 && dump >= 1 && <BagsInArms x={hx} y={FLOOR} s={1} />}
            <circle cx={ballX} cy={ballY} r={22} fill="#f3ebcf" stroke={C.outline} strokeWidth={4} />
            <path d={`M ${ballX - 10} ${ballY - 8} l 10 -6 l 10 6 l -4 12 l -12 0 z`} fill={C.outline} />
          </Field>
        </Cam>
      </Stage>
    );
  }
  if (t < 28) {
    const lit = t > 25.4;
    return (
      <Stage>
        <Cam s={1.5} cx={1060} cy={560}>
          <Dorm t={t} night={1}>
            <Hero id="dh" x={1060} y={820} expr={{brow: lit ? -0.3 : 0.3, mouth: lit ? 0.9 : 0.1, eyeY: 8, lid: lit ? 0 : 0.3}} glow={lit ? 0.9 : 0} blink={blinkAt(t, [26.8])} />
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  if (t < 31.5) {
    const msgs = ['Send me your notes?', 'Can you print this?', 'Cover my shift?', 'Fix my slides pls', 'Help me move Sat?'];
    const n = Math.floor(interpolate(t, [28.2, 31.2], [1, 5.99], cl));
    return (
      <Stage>
        <Light id="pov" x={960} y={560} r={700} color={C.cold} o={0.6} />
        <PhonePOV px={960} py={560}>
          {msgs.slice(0, n).map((m, i) => (
            <g key={i} transform={`translate(0 ${-560 + i * 96})`}>
              <circle cx={800} cy={830} r={22} fill={FRIENDS[i % 4].color} />
              <rect x={832} y={800} width={290} height={60} rx={18} fill="#d8dde6" />
              <text x={848} y={839} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#1d2027">
                {m}
              </text>
            </g>
          ))}
        </PhonePOV>
      </Stage>
    );
  }
  const fade = interpolate(t, [32.0, 33.5], [0, 1], cl);
  return (
    <Stage>
      <g opacity={0.45}>
        <Dorm t={t} night={1} />
      </g>
      <Hero id="dcu" x={1000} y={1080} scale={1.75} expr={{brow: fade * 0.6, mouth: 0.8 - fade * 1.0, eyeY: 8}} glow={0.9} blink={blinkAt(t, [34.0])} />
    </Stage>
  );
};
const TAN2 = '#c9ad86';

export const YesClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '1'], [sec(5.0), '2'], [sec(13.3), '3'], [sec(18.6), '4'], [sec(28.4), '9'], [sec(29.6), '14'], [sec(30.8), '21']]} />
      <Sequence from={sec(10.8)} durationInFrames={sec(2.6)}>
        <HeadPill text="Just this once?" x={900 + (660 - 900) * 1.6} y={600 + (390 - 600) * 1.6 - 10} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(14.3)} durationInFrames={sec(3.0)}>
        <Caption text="He always said **yes**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(31.8)} durationInFrames={sec(3.1)}>
        <Caption text="Every message wanted **something**." dur={sec(3.1)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC: yes-8bit for the montage only */}
      <Sfx at={0} src="music/yes-8bit.wav" vol={0.35} dur={24.5} />
      {/* SFX on events */}
      <Sfx at={0.3} src="sfx/pencil.wav" vol={0.35} />
      <Sfx at={4.3} src="sfx/paper-slide.wav" vol={0.6} />
      <Sfx at={7.2} src="sfx/page-flip.wav" vol={0.4} />
      <Sfx at={11.0} src="sfx/paper-slide.wav" vol={0.6} />
      <Sfx at={12.7} src="sfx/paper-slide.wav" vol={0.35} />
      <Sfx at={14.2} src="sfx/whistle.wav" vol={0.5} />
      <Sfx at={15.0} src="sfx/ball-kick.wav" vol={0.5} />
      <Sfx at={18.4} src="sfx/bag-thud.wav" vol={0.7} />
      <Sfx at={18.6} src="sfx/bag-thud.wav" vol={0.5} />
      <Sfx at={21.0} src="sfx/ball-kick.wav" vol={0.6} />
      <Sfx at={22.2} src="sfx/far-cheer.wav" vol={0.6} />
      <Sfx at={25.3} src="sfx/phone-buzz.wav" vol={0.6} />
      <Sfx at={28.4} src="sfx/msg-pop-1.wav" vol={0.6} />
      <Sfx at={29.0} src="sfx/msg-pop-2.wav" vol={0.6} />
      <Sfx at={29.6} src="sfx/msg-pop-3.wav" vol={0.6} />
      <Sfx at={30.2} src="sfx/msg-pop-1.wav" vol={0.6} />
      <Sfx at={30.8} src="sfx/msg-pop-2.wav" vol={0.6} />
      {/* BGM score */}
      <Sfx at={24.6} src="music/lonely-pad.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
