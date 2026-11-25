import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {
  AlarmClock,
  BedroomSet,
  blinkAt,
  Cam,
  DiningSet,
  FLOOR,
  GlassBox,
  GREY,
  Light,
  MetroSet,
  NoodleBowl,
  Person,
  Stage,
  TAN,
} from '../common/sets';
import {C, FPS, sec} from '../common/theme';

// Part 2 — Routine montage (0:35–1:15). MUSIC: energy-8bit (starts at 0, cut hard at 39.0 s).

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

const glowFlicker = (t: number) => 0.7 * (0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 2.1));

/* 2.1 — brushing teeth, phone in the other hand (0–5) */
const Brushing: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [0, 5], [1.05, 1.1], cl);
  const brush = Math.sin(t * 22) * 6;
  return (
    <Stage>
      <Cam s={s} cx={1150} cy={560}>
        <BedroomSet
          t={t}
          sky={{top: '#26304a', bottom: '#5e6d8c', stars: 0}}
          front={
            <>
              <GlassBox id="g21b" layer="back" x={1250} w={290} h={540} panes={1} t={t} />
              <Hero
                id="h21"
                x={1250}
                y={FLOOR}
                showLegs
                lHand={[-42, -172]}
                lHold="phone"
                rHand={[20 + brush * 0.3, -224 + brush]}
                rHold="toothbrush"
                expr={{brow: 0.5, lid: 0.4, mouth: 0, eyeX: -9, eyeY: 9, bags: true}}
                blink={blinkAt(t, [3.2])}
                glow={glowFlicker(t) * 0.8}
              />
              <GlassBox id="g21f" layer="front" x={1250} w={290} h={540} panes={1} t={t} />
            </>
          }
        />
        <Light id="l21" x={1210} y={680} r={420} color={C.cold} o={0.6} />
      </Cam>
    </Stage>
  );
};

/* 2.2 + 2.3 — metro (5–17) */
const Metro: React.FC<{t: number}> = ({t}) => {
  const back = t >= 11; // 2.3 ride back
  const doorOpen = back ? 0 : interpolate(t, [7.0, 7.85], [1, 0], {...cl, easing: io});
  const scroll = back ? t * 900 : t < 8 ? 0 : Math.pow(t - 8, 2) * 420;
  const panes = back ? 2 : 1 + interpolate(t, [8.5, 10.2], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const s = back ? interpolate(t, [11, 17], [1.0, 1.05], cl) : interpolate(t, [5, 11], [1.0, 1.06], cl);
  const sway = back || t > 8 ? Math.sin(t * 3.1) * 1.2 : 0;
  const hx = 1420;
  const flick = (t * 1.6) % 1 < 0.15 ? 1 : 0;
  return (
    <Stage>
      <Cam s={s} cx={back ? 900 : 1150} cy={560}>
        <g transform={`rotate(${sway * 0.3} 960 900)`}>
          <MetroSet t={t} doorOpen={doorOpen} outside={back ? 'tunnel' : 'platform'} scroll={scroll} dir={back ? -1 : 1}>
            {back && (
              <>
                <Person id="p1" x={250} y={744} scale={0.9} color={GREY} accessory="headphones" accessoryColor="#6f8fb0" pose="arms-down" headTilt={Math.sin(t * 2) * 3} expr={{mouth: 0.6, eyeX: 8}} blink={blinkAt(t, [12.4, 15.8])} />
                <Person id="p2" x={400} y={744} scale={0.9} color={TAN} accessory="glasses" pose="arms-down" headTilt={-4 + Math.sin(t * 2.4) * 3} expr={{mouth: 0.8, eyeX: -6}} blink={blinkAt(t, [13.6])} />
                <Person id="p3" x={550} y={744} scale={0.9} color={GREY} accessory="tie" accessoryColor={C.amber} pose="arms-down" headTilt={-6} expr={{mouth: 0.4, eyeX: -10, eyeY: -4}} blink={blinkAt(t, [14.8])} />
              </>
            )}
            <GlassBox id="g22b" layer="back" x={hx} w={290} h={540} panes={panes} t={t} />
            <Hero
              id="h22"
              x={hx}
              y={FLOOR}
              showLegs
              expr={{brow: 0.5, lid: 0.35, mouth: -0.2, eyeY: 6, bags: true}}
              blink={blinkAt(t, [6.4, 9.6, 13.2, 16.1])}
              glow={glowFlicker(t)}
              thumb={flick}
            />
            <GlassBox id="g22f" layer="front" x={hx} w={290} h={540} panes={panes} t={t} />
            <Light id="l22" x={hx} y={680} r={420} color={C.cold} o={0.6} />
          </MetroSet>
        </g>
      </Cam>
    </Stage>
  );
};

/* 2.4 — lunch in bed, cold noodles (17–23) */
const Lunch: React.FC<{t: number}> = ({t}) => {
  const panes = 2 + interpolate(t, [18.5, 20.5], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const s = interpolate(t, [17, 23], [1.06, 1.1], cl);
  return (
    <Stage>
      <Cam s={s} cx={760} cy={600}>
        <BedroomSet
          t={t}
          sky={{top: '#34405a', bottom: '#75839e', stars: 0}}
          nightstand={
            <>
              <AlarmClock t={t} x={575} y={694} />
              <NoodleBowl x={635} y={710} />
            </>
          }
          mid={
            <>
              <GlassBox id="g24b" layer="back" x={830} w={300} h={540} panes={panes} t={t} />
              <Hero id="h24" x={830} y={820} expr={{brow: 0.5, lid: 0.45, mouth: -0.3, eyeY: 5, bags: true}} blink={blinkAt(t, [19.4, 22.1])} glow={glowFlicker(t)} thumb={(t * 1.4) % 1 < 0.15 ? 1 : 0} />
            </>
          }
          front={<GlassBox id="g24f" layer="front" x={830} w={300} h={540} panes={panes} t={t} />}
        />
        <Light id="l24" x={830} y={650} r={480} color={C.cold} o={0.55} />
      </Cam>
    </Stage>
  );
};

/* 2.5 — dinner at Mom's (23–30) */
const Dinner: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [23, 30], [1.0, 1.05], cl);
  const momSad = interpolate(t, [27.6, 28.6], [0, 1], cl);
  const momTalk = t > 23.8 && t < 26.4 ? Math.abs(Math.sin(t * 9)) * 0.4 : 0;
  return (
    <Stage>
      <Cam s={s} cx={960} cy={560}>
        <DiningSet t={t} warm={1}>
          <Person
            id="mom25"
            x={720}
            y={820}
            color={TAN}
            accessory="glasses"
            lHand={[-60, -128]}
            rHand={[64, -128]}
            headTilt={5}
            expr={{brow: momSad * 0.7, mouth: 0.6 - momSad * 0.8 + momTalk, eyeX: 10}}
            blink={blinkAt(t, [24.9, 29.1])}
          />
          <GlassBox id="g25b" layer="back" x={1200} w={300} h={560} panes={3} t={t} />
          <Hero id="h25" x={1200} y={820} expr={{brow: 0.4, lid: 0.35, mouth: -0.1, eyeY: 7, bags: true}} blink={blinkAt(t, [26.1])} glow={glowFlicker(t)} thumb={(t * 1.3) % 1 < 0.15 ? 1 : 0} />
          <GlassBox id="g25f" layer="front" x={1200} w={300} h={560} panes={3} t={t} />
          <Light id="l25" x={1200} y={650} r={340} color={C.cold} o={0.7} />
        </DiningSet>
      </Cam>
    </Stage>
  );
};

/* 2.6 — night: the last pane closes (30–40) */
const Closing: React.FC<{t: number}> = ({t}) => {
  const panes = 3 + interpolate(t, [35.5, 38.9], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const s = interpolate(t, [30, 40], [1.0, 1.1], {...cl, easing: io});
  const shut = t >= 38.9 ? interpolate(t, [38.9, 39.6], [1, 0], cl) : 0;
  return (
    <Stage>
      <Cam s={s} cx={830} cy={560} dx={shut * (Math.random() > 2 ? 0 : Math.sin(t * 80) * 3)}>
        <BedroomSet
          t={t}
          sky={{top: '#0c1424', bottom: '#101a2c', stars: 1}}
          mid={
            <>
              <GlassBox id="g26b" layer="back" x={830} w={300} h={540} panes={panes} t={t} />
              <Hero id="h26" x={830} y={820} expr={{brow: 0.6, lid: 0.5, mouth: -0.3, eyeY: 5, bags: true}} blink={blinkAt(t, [32.0, 36.4])} glow={glowFlicker(t)} thumb={(t * 1.2) % 1 < 0.15 ? 1 : 0} />
            </>
          }
          front={<GlassBox id="g26f" layer="front" x={830} w={300} h={540} panes={panes} t={t} />}
        />
        <Light id="l26" x={830} y={650} r={520} color={C.cold} o={0.6 + shut * 0.4} />
      </Cam>
    </Stage>
  );
};

export const GlassRoomPart2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 5 && <Brushing t={t} />}
      {t >= 5 && t < 17 && <Metro t={t} />}
      {t >= 17 && t < 23 && <Lunch t={t} />}
      {t >= 23 && t < 30 && <Dinner t={t} />}
      {t >= 30 && <Closing t={t} />}
      <FilmLook />
      <Counter label="SCREEN TIME" showFrom={0} changes={[[0, '4h'], [sec(5), '5h'], [sec(17), '6h'], [sec(23), '7h'], [sec(30), '8h']]} />

      <Sequence from={sec(8.3)} durationInFrames={sec(2.6)}>
        <Caption text="He missed his **stop**." dur={sec(2.6)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(35.6)} durationInFrames={sec(4.3)}>
        <Caption text="The walls closed **in**." dur={sec(4.3)} highlight={C.coldLight} />
      </Sequence>

      <Sequence from={sec(12.3)} durationInFrames={sec(4.2)}>
        <HeadPill text="One more video." x={1420 + (1420 - 900) * 0.03} y={440} dur={sec(4.2)} />
      </Sequence>
      <Sequence from={sec(23.8)} durationInFrames={sec(3.0)}>
        <HeadPill text="How was your week?" x={725} y={372} dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(27.0)} durationInFrames={sec(2.8)}>
        <HeadPill text="Mm. Yeah, fine." x={1205} y={372} dur={sec(2.8)} />
      </Sequence>

      {/* MUSIC: energy-8bit — hard cut when the box closes */}
      <Sfx at={0} src="music/energy-8bit.wav" vol={0.42} dur={39.0} />

      {/* SFX */}
      <Sfx at={0.3} src="sfx/brushing.wav" vol={0.6} dur={4.6} />
      <Sfx at={2.6} src="sfx/notification-ping.wav" vol={0.5} />
      <Sfx at={6.1} src="sfx/metro-doors.wav" vol={0.7} />
      <Sfx at={8.0} src="sfx/train-rumble.wav" vol={0.8} dur={3.0} />
      <Sfx at={11.0} src="sfx/train-rumble.wav" vol={0.8} dur={6.0} />
      <Sfx at={13.6} src="sfx/notification-ping.wav" vol={0.5} />
      <Sfx at={18.0} src="sfx/notification-ping.wav" vol={0.5} />
      <Sfx at={19.1} src="sfx/notification-ping.wav" vol={0.5} />
      <Sfx at={18.5} src="sfx/glass-hum.wav" vol={0.35} dur={4.5} />
      <Sfx at={23.3} src="sfx/plates-muffled.wav" vol={0.8} />
      <Sfx at={35.5} src="sfx/glass-hum.wav" vol={0.5} dur={3.5} />
      <Sfx at={38.85} src="sfx/glass-click.wav" vol={0.9} />
      <Sfx at={39.0} src="sfx/room-tone.wav" vol={0.8} dur={1.0} />
    </AbsoluteFill>
  );
};
