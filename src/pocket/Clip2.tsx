import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {BillInsert, Chair, CHEAP_SHOES, GREY, HALL_Y, Hallway, Kitchen, KitchenTable, MOM, NEW_SHOES, PriceTag, RED, tagAt, TAN} from './sets';
import {Bedroom, BEDROOM_Y, CounterInsert, Store, STORE_Y} from './sets2';
import {Friends, Passers} from './Clip1';

/*
 POCKET MONEY - Clip 2 (33 s)  MUSIC: s1 fades -> s2 sneaky piano + pizzicato + soft drums
  0-6    MEDIUM bedroom, phone in hand: the DEMON rises behind him - "you need it."
  6-11   WIDE sneaker store: the $180 pair on a lit pedestal; he walks up          (place)
  11-15  INSERT top-down: the triangle bill unfolds flat on the counter; register
  15-22  WIDE hallway (same shot as clip 1): $180 on his feet, fist bump - he fits
  22-28  WIDE kitchen: Mom packs HIS lunch, then quickly closes her own (empty) box (the seed)
  28-33  INSERT the triangle held out again: "Every week."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.75;
const HX = 800;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const rise = interpolate(t, [0.4, 2.0], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return (
      <Stage>
        <Cam s={1.35} cx={760} cy={620} dy={-60}>
          <Bedroom t={t} boxes={0} />
          <g opacity={rise}>
            <Demon id="dm" x={1060} y={BEDROOM_Y + (1 - rise) * 160} t={t} scale={S} size={0.85} lean={-6} headTilt={-8} expr={{eyeX: -16}} />
          </g>
          <Hero id="h" x={760} y={BEDROOM_Y} scale={0.8} pose="arms-down" shoes={CHEAP_SHOES} rHand={[50, -200]} rHold="phone-screen" glow={0.6} glowColor={C.coldLight}
            expr={{brow: 0.3 - rise * 0.2, lid: 0.2, mouth: -0.1, eyeY: 12, eyeX: 6}} blink={blinkAt(t, [4.5])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 11) {
    const k = interpolate(t, [6.3, 9.0], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const x = 300 + k * 1050;
    return (
      <Stage>
        <Cam s={interpolate(t, [6, 11], [1.0, 1.05], cl)} cx={1100} cy={700} dy={-60}>
          <Store t={t} />
          <HeroSide id="s1" x={560 + (t - 6) * 40} y={STORE_Y} scale={0.72} dir={1} phase={t * 3} color={GREY} accessory="glasses" jacket="#3a4a3a" mouth={0.2} />
          <Hero id="s2" x={980} y={STORE_Y} scale={0.72} pose="arms-down" color={TAN} accessory="cap" accessoryColor="#7a5a2a" jacket="#55405a" back />
          <Hero id="clerk" x={1880} y={STORE_Y} scale={0.72} pose="arms-down" color={GREY} accessory="cap" accessoryColor="#1a1820" jacket="#1a1820" expr={{mouth: 0.4, eyeX: -14}} />
          {t < 9 ? (
            <HeroSide id="hw" x={x} y={STORE_Y} scale={S} dir={1} phase={t * 7} shoes={CHEAP_SHOES} />
          ) : (
            <Hero id="h" x={1350} y={STORE_Y} scale={S} pose="arms-down" shoes={CHEAP_SHOES} expr={{brow: -0.2, lid: 0, mouth: 0.3, eyeX: 18, eyeY: -6}} />
          )}
          <PriceTag ax={1700} ay={565} dx={20} dy={30} price="$180" s={1.1} t={t} />
        </Cam>
      </Stage>
    );
  }
  if (t < 15) {
    return (
      <Stage>
        <CounterInsert t={t} unfold={interpolate(t, [11.6, 12.8], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)})} />
      </Stage>
    );
  }
  if (t < 22) {
    const bump = interpolate(t, [17.6, 18.2, 19.4, 20.0], [0, 1, 1, 0], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [15, 22], [1.0, 1.04], cl)} cx={960} cy={700} dy={-70}>
          <Hallway t={t} />
          <Passers t={t} t0={14} />
          <g opacity={0.85}>
            <Demon id="dh" x={260} y={HALL_Y} t={t} scale={S} size={0.95} expr={{eyeX: 18, mouth: 0.6}} />
          </g>
          <Friends t={t} point={bump * 0.6} laugh={0} />
          <Hero id="h" x={1010} y={HALL_Y} scale={S} pose="arms-down" shoes={NEW_SHOES} rHand={bump > 0 ? [150 + 30 * bump, -200] : undefined}
            expr={{brow: -0.2, lid: 0.15, mouth: 0.8, eyeX: 12}} blink={blinkAt(t, [16.4, 20.6])} />
          <PriceTag ax={tagAt.shoes(1010, HALL_Y, S)[0]} ay={tagAt.shoes(1010, HALL_Y, S)[1]} price="$180" s={S * 1.2} t={t} />
        </Cam>
      </Stage>
    );
  }
  if (t < 28) {
    // Mom packs HIS lunch (green box), then her own blue box: she looks inside, closes it fast, slides it away
    const pack = interpolate(t, [22.4, 23.4], [0, 1], cl);
    const ownBox: 'open' | 'closed' | 'none' = t < 25.2 ? 'open' : t < 26.6 ? 'closed' : 'none';
    const look = interpolate(t, [24.0, 24.6], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.25} cx={960} cy={640} dy={-10}>
          <Kitchen t={t} />
          <Chair x={960} />
          <Hero id="mom" x={960} y={764} scale={0.8} sit pose="arms-down" {...MOM}
            lHand={[-150 + pack * 30, -110]} rHand={t < 25.2 ? [150, -110] : [190 + (t > 26 ? 60 : 0), -120]}
            expr={{brow: 0.3 + look * 0.3, lid: 0.35, mouth: look ? -0.2 : 0.3, eyeX: look * 20, eyeY: 12, bags: true}} blink={blinkAt(t, [23.2, 27.2])} />
          <KitchenTable box={ownBox} lunch />
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <BillInsert t={t} fold={1} reach={interpolate(t, [28.4, 29.4], [0, 1], {...cl, easing: Easing.out(Easing.quad)})}
        take={interpolate(t, [31.0, 31.6], [0, 1], cl)} />
    </Stage>
  );
};

export const PocketClip2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(1.8)} durationInFrames={sec(3.8)}>
        <DemonSay text="you need it." x={1180} y={230} dur={sec(3.8)} />
      </Sequence>
      <Sequence from={sec(7.0)} durationInFrames={sec(3.8)}>
        <Caption text="So he **bought** it." dur={sec(3.8)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(16.0)} durationInFrames={sec(5.6)}>
        <Caption text="For a moment, he **fit** in." dur={sec(5.6)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(22.6)} durationInFrames={sec(5.2)}>
        <Caption text="Mom packed **his** lunch first." dur={sec(5.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(4.2)}>
        <Caption text="Every **week**." dur={sec(4.2)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/room-tone.wav" vol={0.35} dur={6} fadeOut={0.5} />
      <Sfx at={0.3} src="sfx/demon-tuba.wav" vol={0.6} />
      <Sfx at={2.0} src="sfx/pat.wav" vol={0.45} />
      <Sfx at={1.9} src="sfx/voice/inner-you-need-it.wav" vol={0.75} />
      <Sfx at={6.0} src="sfx/murmur.wav" vol={0.25} dur={5} fadeIn={0.4} fadeOut={0.6} />
      <Sfx at={6.3} src="sfx/footsteps.wav" vol={0.3} dur={2.6} />
      <Sfx at={8.8} src="sfx/shoe-squeak.wav" vol={0.35} />
      <Sfx at={11.5} src="sfx/paper-slide.wav" vol={0.5} />
      <Sfx at={13.2} src="sfx/cash-register.wav" vol={0.6} />
      <Sfx at={14.2} src="sfx/bag-rustle.wav" vol={0.45} />
      <Sfx at={15.0} src="sfx/murmur.wav" vol={0.3} dur={7} fadeIn={0.5} fadeOut={0.8} />
      <Sfx at={18.0} src="sfx/pat.wav" vol={0.5} />
      <Sfx at={18.4} src="sfx/soft-laugh.wav" vol={0.4} />
      <Sfx at={22.0} src="sfx/room-tone.wav" vol={0.4} dur={11} fadeIn={0.4} />
      <Sfx at={22.6} src="sfx/drawer-close.wav" vol={0.3} />
      <Sfx at={25.2} src="sfx/cup-tap.wav" vol={0.4} />
      <Sfx at={26.4} src="sfx/paper-slide.wav" vol={0.3} />
      <Sfx at={28.5} src="sfx/paper-slide.wav" vol={0.45} />
      <Sfx at={31.0} src="sfx/paper-slide.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
