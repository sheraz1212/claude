import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {BlackCard, Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {BillInsert, Chair, CHEAP_SHOES, F1, F2, F3, GREY, HALL_Y, Hallway, Kitchen, KitchenTable, MOM, PriceTag, RED, tagAt, TAN} from './sets';

/*
 POCKET MONEY - Clip 1 (33 s)  MUSIC: hook silent -> s1 light piano
  0-4    BLACK hook "He wanted to look rich."
  4-10   WIDE hallway: friends with glowing price tags; he walks in, $12 on his shoes   (place + symbol)
  10-15  MEDIUM red-cap points at his shoes, they laugh: "nice shoes lol"
  15-19  CLOSE-UP his face, eyes drop                                                    (emotion)
  19-25  WIDE kitchen at night: Mom in her worn coat counts bills                          (who she is)
  25-28  INSERT her hand folds a $20 into a triangle, holds it out                         (the object)
  28-33  MEDIUM he takes it without looking up from his phone, walks off
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.75; // people scale in the hallway
const HX = 800; // where he stops

/** the three friends + their tags */
export const Friends: React.FC<{t: number; laugh?: number; point?: number; s?: number; tagsO?: number}> = ({t, laugh = 0, point = 0, s = S, tagsO = 1}) => {
  const bob = (k: number) => (laugh > 0 ? Math.abs(Math.sin(t * 9 + k)) * 6 * laugh : 0);
  const fx = [1230, 1440, 1650];
  return (
    <g>
      <Hero id="f1" x={fx[0]} y={HALL_Y + bob(0)} scale={s} pose="arms-down" {...F1} lHand={point > 0 ? [-110 - 90 * point, -170 + 40 * point] : undefined}
        expr={{brow: -0.2, lid: laugh ? 0.45 : 0.2, mouth: 0.4 + laugh * 0.6, eyeX: -14}} blink={blinkAt(t, [6.2, 12.8])} />
      <Hero id="f2" x={fx[1]} y={HALL_Y + bob(1)} scale={s} pose="arms-down" {...F2}
        expr={{brow: -0.1, lid: laugh ? 0.5 : 0.15, mouth: 0.3 + laugh * 0.7, eyeX: -16}} blink={blinkAt(t, [7.4])} />
      <Hero id="f3" x={fx[2]} y={HALL_Y + bob(2)} scale={s} pose="arms-down" {...F3}
        expr={{brow: 0, lid: laugh ? 0.5 : 0.1, mouth: 0.3 + laugh * 0.6, eyeX: -16}} blink={blinkAt(t, [8.8])} />
      <g opacity={tagsO}>
        <PriceTag ax={tagAt.shoes(fx[0], HALL_Y, s)[0]} ay={tagAt.shoes(fx[0], HALL_Y, s)[1]} price="$180" s={s * 1.2} t={t} />
        <PriceTag ax={tagAt.jacket(fx[0], HALL_Y, s)[0]} ay={tagAt.jacket(fx[0], HALL_Y, s)[1]} price="$250" s={s * 1.2} t={t + 1} />
        <PriceTag ax={tagAt.cap(fx[1], HALL_Y, s)[0]} ay={tagAt.cap(fx[1], HALL_Y, s)[1]} price="$90" s={s * 1.2} t={t + 2} />
        <PriceTag ax={tagAt.shoes(fx[1], HALL_Y, s)[0]} ay={tagAt.shoes(fx[1], HALL_Y, s)[1]} price="$160" s={s * 1.2} t={t + 3} />
        <PriceTag ax={tagAt.jacket(fx[2], HALL_Y, s)[0]} ay={tagAt.jacket(fx[2], HALL_Y, s)[1]} price="$300" s={s * 1.2} t={t + 4} />
      </g>
    </g>
  );
};

/** passers-by in the back of the hallway */
export const Passers: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const u = t - t0;
  return (
    <g>
      <HeroSide id="p1" x={1950 - u * 230} y={HALL_Y} scale={0.72} dir={-1} phase={t * 6.5} color={GREY} accessory="headband" accessoryColor="#3f6a8a" jacket="#3a4a3a" mouth={0.2} />
      <HeroSide id="p2" x={-120 + u * 150} y={HALL_Y} scale={0.72} dir={1} phase={t * 6} color={TAN} accessory="cap" accessoryColor="#7a5a2a" jacket="#55405a" mouth={0.1} />
    </g>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  // 4-10 WIDE hallway, he walks in
  if (t < 10) {
    const k = interpolate(t, [4.3, 8.6], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const walking = t < 8.6;
    const x = -120 + k * (HX + 120);
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 10], [1.0, 1.04], cl)} cx={960} cy={700} dy={-70}>
          <Hallway t={t} />
          <Passers t={t} t0={4} />
          <Friends t={t} />
          {walking ? (
            <HeroSide id="hw" x={x} y={HALL_Y} scale={S} dir={1} phase={t * 7} shoes={CHEAP_SHOES} brow={0.1} mouth={0.1} />
          ) : (
            <Hero id="h" x={HX} y={HALL_Y} scale={S} pose="arms-down" shoes={CHEAP_SHOES} expr={{brow: 0.1, lid: 0.1, mouth: 0.25, eyeX: 12}} blink={blinkAt(t, [9.4])} />
          )}
          <PriceTag ax={walking ? x + 30 * S : tagAt.shoes(HX, HALL_Y, S)[0]} ay={walking ? HALL_Y - 20 * S : tagAt.shoes(HX, HALL_Y, S)[1]} price="$12" s={S * 1.2} small big t={t} />
        </Cam>
      </Stage>
    );
  }
  // 10-15 MEDIUM: red-cap points at his shoes, they laugh
  if (t < 15) {
    const point = interpolate(t, [10.4, 11.0], [0, 1], cl);
    const laugh = interpolate(t, [11.0, 11.4], [0, 1], cl);
    const look = interpolate(t, [12.4, 13.0], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.42} cx={1010} cy={660} dy={-110}>
          <Hallway t={t} />
          <Friends t={t} laugh={laugh} point={point} />
          <Hero id="h" x={HX} y={HALL_Y} scale={S} pose="arms-down" shoes={CHEAP_SHOES}
            expr={{brow: 0.1 + look * 0.6, lid: look * 0.25, mouth: 0.25 - look * 0.6, eyeX: 12 - look * 4, eyeY: look * 14}} headTilt={look * 6} />
          <PriceTag ax={tagAt.shoes(HX, HALL_Y, S)[0]} ay={tagAt.shoes(HX, HALL_Y, S)[1]} price="$12" s={S * 1.2} small big t={t} />
        </Cam>
      </Stage>
    );
  }
  // 15-19 CLOSE-UP: his face, eyes drop
  if (t < 19) {
    const drop = interpolate(t, [15.6, 16.6], [0, 1], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [15, 19], [2.5, 2.62], cl)} cx={HX} cy={500} dy={60}>
          <Hallway t={t} />
          <Hero id="hc" x={HX} y={HALL_Y} scale={S} pose="arms-down" shoes={CHEAP_SHOES}
            expr={{brow: 0.7, lid: 0.25 + drop * 0.25, mouth: -0.5, eyeY: drop * 16, eyeX: 4}} headTilt={drop * 7} blink={blinkAt(t, [17.8])} />
        </Cam>
      </Stage>
    );
  }
  // 19-25 WIDE kitchen: Mom counts bills
  if (t < 25) {
    const c = Math.sin(t * 5);
    return (
      <Stage>
        <Cam s={interpolate(t, [19, 25], [1.0, 1.05], cl)} cx={960} cy={640}>
          <Kitchen t={t} />
          <Chair x={960} />
          <Hero id="mom" x={960} y={764} scale={0.8} sit pose="arms-down" {...MOM} lHand={[-80 + c * 12, -102]} rHand={[70, -100]}
            expr={{brow: 0.35, lid: 0.45, mouth: 0, eyeY: 12, bags: true}} blink={blinkAt(t, [21.5, 23.9])} />
          <KitchenTable bills={5} />
        </Cam>
      </Stage>
    );
  }
  // 25-28 INSERT: the folded $20
  if (t < 28) {
    return (
      <Stage>
        <BillInsert t={t} fold={interpolate(t, [25.4, 26.6], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)})} reach={interpolate(t, [26.9, 27.8], [0, 1], {...cl, easing: Easing.out(Easing.quad)})} />
      </Stage>
    );
  }
  // 28-33 MEDIUM: he takes it without looking up, walks off
  const take = interpolate(t, [29.4, 30.0], [0, 1], cl);
  const leaving = t > 31.0;
  const lx = interpolate(t, [31.0, 33.0], [620, 140], cl);
  const momHand: [number, number] = [-150 - 90 * (1 - take), -150];
  return (
    <Stage>
      <Cam s={1.3} cx={880} cy={640} dy={-20}>
        <Kitchen t={t} />
        <Chair x={1000} />
        <Hero id="mom" x={1000} y={764} scale={0.8} sit pose="arms-down" {...MOM} lHand={take < 1 ? momHand : [-80, -104]} rHand={[70, -100]}
          expr={{brow: 0.45, lid: 0.3, mouth: take ? 0.35 : 0.2, eyeX: -16, bags: true}} blink={blinkAt(t, [32.0])} />
        <KitchenTable bills={1} />
        {take < 1 && (
          <polygon points="-16,12 0,-14 16,12" transform={`translate(${1000 + 0.8 * momHand[0]} ${764 + 0.8 * (-58 + (momHand[1] + 58) * 1.4) - 30})`} fill="#86ad7f" stroke={C.outline} strokeWidth={3} />
        )}
        {leaving ? (
          <HeroSide id="hl" x={lx} y={HALL_Y - 16} scale={0.8} dir={-1} phase={t * 7} shoes={CHEAP_SHOES} brow={0} mouth={0} />
        ) : (
          <Hero id="h" x={620} y={HALL_Y - 16} scale={0.8} pose="arms-down" shoes={CHEAP_SHOES} rHand={[60, -190]} rHold="phone-screen"
            lHand={take > 0 && take < 1 ? [140, -150] : [-92, -100]} glow={0.5} glowColor={C.coldLight}
            expr={{brow: -0.1, lid: 0.3, mouth: 0, eyeY: 14, eyeX: 8}} />
        )}
      </Cam>
    </Stage>
  );
};

export const PocketClip1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="He wanted to look **rich**." dur={sec(4)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(5.0)} durationInFrames={sec(4.8)}>
        <Caption text="Everyone had a **price**." dur={sec(4.8)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(11.4)} durationInFrames={sec(3.4)}>
        <HeadPill text="nice shoes lol" x={1290} y={130} dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(15.6)} durationInFrames={sec(3.2)}>
        <Caption text="His was **cheap**." dur={sec(3.2)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(20.0)} durationInFrames={sec(4.6)}>
        <Caption text="His **mom** worked till midnight." dur={sec(4.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(25.2)} durationInFrames={sec(2.8)}>
        <Caption text="Every dollar went to **him**." dur={sec(2.8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(29.4)} durationInFrames={sec(3.4)}>
        <Caption text="He didn't look **up**." dur={sec(3.4)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.5} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={4.0} src="sfx/murmur.wav" vol={0.35} dur={11} fadeIn={0.6} fadeOut={1.2} />
      <Sfx at={4.4} src="sfx/footsteps.wav" vol={0.35} dur={4.2} />
      <Sfx at={6.3} src="sfx/locker-slam.wav" vol={0.25} />
      <Sfx at={11.1} src="sfx/group-laugh.wav" vol={0.6} />
      <Sfx at={19.0} src="sfx/room-tone.wav" vol={0.4} dur={14} fadeIn={0.5} />
      <Sfx at={19.0} src="sfx/fridge-hum.wav" vol={0.25} dur={6} fadeOut={1} />
      <Sfx at={20.2} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={22.4} src="sfx/paper-slide.wav" vol={0.35} />
      <Sfx at={25.4} src="sfx/paper-slide.wav" vol={0.55} />
      <Sfx at={29.4} src="sfx/paper-slide.wav" vol={0.35} />
      <Sfx at={31.0} src="sfx/footsteps.wav" vol={0.3} dur={1.8} />
      <Sfx at={32.3} src="sfx/door-close.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
