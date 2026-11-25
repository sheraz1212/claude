import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {PhoneChat} from '../window/sets';
import {BillInsert, Chair, HALL_Y, Hallway, Kitchen, KitchenTable, MOM, NEW_SHOES, PriceTag, RED, tagAt} from './sets';
import {BankScreen, Bedroom, BEDROOM_Y, CounterInsert} from './sets2';
import {Friends} from './Clip1';

/*
 POCKET MONEY - Clip 3 (33 s)  MUSIC: s2 continues, a little faster
  0-18   THE SAME THREE SHOTS AGAIN, twice (kitchen -> counter -> hallway): a cap, then a jacket.
         Each time Mom looks more tired; each time more red tags on him.
  18-23  WIDE bedroom: shoe boxes up to the window; the demon HEAVY, leaning over him
  23-28  POV phone: "mall saturday?" "bring cash" -> his bank app: $3
  28-33  MEDIUM kitchen: "need $100." - she gives her last bills. Demon: "one more."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.75;
export const MY_CAP = '#e8e4dc';
export const MY_JACKET = '#2a2a32';

/** him in the hallway with whatever he has bought so far */
export const Rich: React.FC<{t: number; x: number; cap?: boolean; jacket?: boolean; expr?: object; tagsO?: number}> = ({t, x, cap, jacket, expr, tagsO = 1}) => (
  <g>
    <Hero id="hr" x={x} y={HALL_Y} scale={S} pose="arms-down" shoes={NEW_SHOES} accessory={cap ? 'cap' : 'none'} accessoryColor={MY_CAP} jacket={jacket ? MY_JACKET : undefined}
      expr={{brow: -0.2, lid: 0.15, mouth: 0.7, eyeX: 12, ...expr}} blink={blinkAt(t, [2.4, 8.8, 15.6])} />
    <g opacity={tagsO}>
      <PriceTag ax={tagAt.shoes(x, HALL_Y, S)[0]} ay={tagAt.shoes(x, HALL_Y, S)[1]} price="$180" s={S * 1.2} t={t} />
      {cap && <PriceTag ax={tagAt.cap(x, HALL_Y, S)[0]} ay={tagAt.cap(x, HALL_Y, S)[1]} price="$90" s={S * 1.2} t={t + 1} />}
      {jacket && <PriceTag ax={tagAt.jacket(x, HALL_Y, S)[0]} ay={tagAt.jacket(x, HALL_Y, S)[1]} price="$300" s={S * 1.2} t={t + 2} />}
    </g>
  </g>
);

const KitchenGive: React.FC<{t: number; tired: number}> = ({t, tired}) => (
  <Stage>
    <Cam s={1.25} cx={960} cy={640} dy={-10}>
      <Kitchen t={t} lamp={1 - tired * 0.3} />
      <Chair x={960} />
      <Hero id="mom" x={960} y={764 + tired * 6} scale={0.8} sit pose="arms-down" {...MOM} lHand={[-170, -150]} rHand={[70, -100]} headTilt={tired * 6}
        expr={{brow: 0.4 + tired * 0.3, lid: 0.4 + tired * 0.25, mouth: 0.2 - tired * 0.2, eyeX: -14, bags: true}} />
      <polygon points="-16,12 0,-14 16,12" transform={`translate(${960 - 0.8 * 170} ${764 + 0.8 * (-58 + (-150 + 58) * 1.4) - 30})`} fill="#86ad7f" stroke={C.outline} strokeWidth={3} />
      <KitchenTable bills={0} />
    </Cam>
  </Stage>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  // round 1: the cap
  if (t < 3.4) return <KitchenGive t={t} tired={0.3} />;
  if (t < 5.6) return <Stage><CounterInsert t={t} unfold={interpolate(t, [3.6, 4.4], [0, 1], cl)} price="$90" boxColor="#d8d4cc" /></Stage>;
  if (t < 9.4)
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={700} dy={-70}>
          <Hallway t={t} />
          <Friends t={t} />
          <Rich t={t} x={1010} cap />
        </Cam>
      </Stage>
    );
  // round 2: the jacket
  if (t < 12.4) return <KitchenGive t={t} tired={0.7} />;
  if (t < 14.6) return <Stage><CounterInsert t={t} unfold={interpolate(t, [12.6, 13.4], [0, 1], cl)} price="$300" boxColor="#3a3a44" /></Stage>;
  if (t < 18.0)
    return (
      <Stage>
        <Cam s={interpolate(t, [14.6, 18], [1.0, 1.06], cl)} cx={1010} cy={700} dy={-70}>
          <Hallway t={t} />
          <Friends t={t} />
          <Rich t={t} x={1010} cap jacket />
        </Cam>
      </Stage>
    );
  // bedroom: the boxes, the demon heavy
  if (t < 23) {
    const lean = interpolate(t, [18.4, 21], [0, 1], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [18, 23], [1.0, 1.06], cl)} cx={760} cy={640} dy={-40}>
          <Bedroom t={t} boxes={14} />
          <Demon id="dm" x={720} y={BEDROOM_Y} t={t} scale={0.8} size={1.25} lean={-8 - lean * 10} headTilt={-10} expr={{eyeX: -10, eyeY: 14, mouth: 0.6}} />
          <Hero id="h" x={430} y={790} scale={0.8} sit pose="arms-down" shoes={NEW_SHOES} accessory="cap" accessoryColor={MY_CAP} jacket={MY_JACKET}
            rHand={[50, -200]} rHold="phone-screen" glow={0.6} glowColor={C.coldLight} expr={{brow: 0.4, lid: 0.3, mouth: -0.2, eyeY: 12, eyeX: 6}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 25.6)
    return (
      <Stage>
        <PhoneChat t={t - 23} name="the boys" msgs={[[0.2, 'mall saturday?'], [0.9, 'bring cash']]} />
      </Stage>
    );
  if (t < 28) return <Stage><BankScreen t={t} bal="$3" /></Stage>;
  // 28-33: "need $100."
  const pause = interpolate(t, [29.8, 30.4], [0, 1], cl);
  const give = interpolate(t, [31.0, 31.6], [0, 1], cl);
  return (
    <Stage>
      <Cam s={1.3} cx={880} cy={640} dy={-20}>
        <Kitchen t={t} lamp={0.7} />
        <Demon id="dk" x={400} y={HALL_Y - 16} t={t} scale={0.8} size={0.92} lean={8} headTilt={10} expr={{eyeX: 16, mouth: 0.6}} />
        <Chair x={1000} />
        <Hero id="mom" x={1000} y={770} scale={0.8} sit pose="arms-down" {...MOM} lHand={give ? [-150, -150] : [-70, -104]} rHand={[70, -100]} headTilt={6}
          expr={{brow: 0.6 + pause * 0.2, lid: 0.55 - pause * 0.2, mouth: -0.1, eyeX: -16 + pause * 16, eyeY: pause * 12, bags: true}} blink={blinkAt(t, [29.0])} />
        <KitchenTable bills={give ? 0 : 2} />
        {give > 0 && <polygon points="-16,12 0,-14 16,12" transform={`translate(${1000 - 0.8 * 150} ${770 + 0.8 * (-58 + (-150 + 58) * 1.4) - 30})`} fill="#86ad7f" stroke={C.outline} strokeWidth={3} />}
        <Hero id="h" x={640} y={HALL_Y - 16} scale={0.8} pose="arms-down" shoes={NEW_SHOES} accessory="cap" accessoryColor={MY_CAP} jacket={MY_JACKET}
          lHand={give ? [140, -160] : undefined} expr={{brow: -0.1, lid: 0.25, mouth: 0, eyeX: 16}} />
      </Cam>
    </Stage>
  );
};

export const PocketClip3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(5.8)} durationInFrames={sec(3.4)}>
        <Caption text="A **cap**." dur={sec(3.4)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(9.6)} durationInFrames={sec(2.6)}>
        <Caption text="Mom looked more **tired**." dur={sec(2.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(14.8)} durationInFrames={sec(3.0)}>
        <Caption text="A **jacket**." dur={sec(3.0)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(18.6)} durationInFrames={sec(4.2)}>
        <Caption text="He always needed **more**." dur={sec(4.2)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(2.6)}>
        <HeadPill text="need $100." x={740} y={250} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(29.6)} durationInFrames={sec(3.2)}>
        <DemonSay text="one more." x={150} y={210} dur={sec(3.2)} />
      </Sequence>
      <Sequence from={sec(31.2)} durationInFrames={sec(1.8)}>
        <Caption text="She never said **no**." dur={sec(1.8)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/room-tone.wav" vol={0.35} dur={3.4} />
      <Sfx at={0.6} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={4.2} src="sfx/cash-register.wav" vol={0.5} />
      <Sfx at={5.6} src="sfx/murmur.wav" vol={0.25} dur={3.8} fadeOut={0.5} />
      <Sfx at={9.4} src="sfx/room-tone.wav" vol={0.35} dur={3} />
      <Sfx at={9.8} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={13.2} src="sfx/cash-register.wav" vol={0.55} />
      <Sfx at={14.6} src="sfx/murmur.wav" vol={0.25} dur={3.4} fadeOut={0.5} />
      <Sfx at={18.0} src="sfx/room-tone.wav" vol={0.35} dur={5} />
      <Sfx at={18.4} src="sfx/heavy-breath.wav" vol={0.25} />
      <Sfx at={23.2} src="sfx/msg-pop-1.wav" vol={0.5} />
      <Sfx at={23.9} src="sfx/msg-pop-2.wav" vol={0.5} />
      <Sfx at={25.7} src="sfx/phone-tap.wav" vol={0.5} />
      <Sfx at={26.0} src="sfx/piano-hit-low.wav" vol={0.45} />
      <Sfx at={28.0} src="sfx/room-tone.wav" vol={0.4} dur={5} />
      <Sfx at={29.7} src="sfx/voice/inner-one-more.wav" vol={0.75} />
      <Sfx at={31.0} src="sfx/paper-slide.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
