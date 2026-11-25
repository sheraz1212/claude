import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {PhoneChat} from '../window/sets';
import {GREY, MOM_WORK, UNIFORM, NEW_SHOES, PriceTag, RED, tagAt, TAN} from './sets';
import {Bedroom, BEDROOM_Y, Diner, DINER_Y, DinerTable, Store, STORE_Y} from './sets2';
import {MY_CAP, MY_JACKET} from './Clip3';

/*
 POCKET MONEY - Clip 5 (33 s)  MUSIC: 2 s silence -> s4 hopeful piano alone, strings join
  0-7    MEDIUM bedroom: he pulls the price tags off, one by one; they fall and fade. The demon cracks: "they'll laugh."
  7-13   WIDE sneaker store: he hands back the cap and the jacket; the clerk gives the money back
  13-16  INSERT the refund receipt: +$390
  16-22  WIDE the diner at lunchtime: he walks in, points at an empty booth; Mom's coworker takes her tables
  22-28  MEDIUM the booth: Mom and him, two plates; she laughs
  28-33  POV phone: "mall saturday?" -> "can't. lunch with mom."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const COWORKER = {color: TAN, accessory: 'headband' as const, accessoryColor: '#c0392b', ...UNIFORM};

const FallingTag: React.FC<{t: number; t0: number; ax: number; ay: number; price: string; s: number}> = ({t, t0, ax, ay, price, s}) => {
  const k = interpolate(t, [t0, t0 + 1.2], [0, 1], cl);
  if (k >= 1) return null;
  return (
    <g transform={`translate(${k * 30} ${k * k * 260}) rotate(${k * 40} ${ax} ${ay})`} opacity={1 - k}>
      <PriceTag ax={ax} ay={ay} price={price} s={s} t={t} glow={1 - k} />
    </g>
  );
};

const Receipt: React.FC<{t: number}> = ({t}) => {
  const k = interpolate(t, [13.2, 14.2], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return (
    <g>
      <rect width={1920} height={1080} fill="#2e2834" />
      <Light id="rc" x={960} y={500} r={900} color="#fff2d0" o={0.55} />
      <g transform={`translate(0 ${(1 - k) * 200})`} opacity={k}>
        <path d="M 760 140 L 1160 140 L 1160 900 L 1140 920 L 1120 900 L 1100 920 L 1080 900 L 1060 920 L 1040 900 L 1020 920 L 1000 900 L 980 920 L 960 900 L 940 920 L 920 900 L 900 920 L 880 900 L 860 920 L 840 900 L 820 920 L 800 900 L 780 920 L 760 900 Z" fill="#f4f0e6" stroke={C.outline} strokeWidth={5} />
        <text x={960} y={230} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={52} fill={C.outline} letterSpacing={6}>KICKS</text>
        <text x={960} y={300} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={34} fill="#7a7d86">RETURN</text>
        {[['CAP', '$90'], ['JACKET', '$300']].map(([n, v], i) => (
          <g key={n}>
            <text x={810} y={420 + i * 80} fontFamily="Nunito" fontWeight={700} fontSize={40} fill={C.outline}>{n}</text>
            <text x={1110} y={420 + i * 80} textAnchor="end" fontFamily="Nunito" fontWeight={800} fontSize={40} fill={C.outline}>{v}</text>
          </g>
        ))}
        <line x1={800} y1={600} x2={1120} y2={600} stroke={C.outline} strokeWidth={3} strokeDasharray="10 8" />
        <text x={810} y={690} fontFamily="Nunito" fontWeight={900} fontSize={38} fill={C.outline}>BACK</text>
        <text x={1110} y={690} textAnchor="end" fontFamily="Nunito" fontWeight={900} fontSize={52} fill="#3a8a4a">+$390</text>
      </g>
    </g>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const s = 0.8;
    const x = 760;
    const reach = (a: number) => interpolate(t, [a - 0.6, a - 0.2, a + 0.2, a + 0.6], [0, 1, 1, 0], cl);
    const r1 = reach(1.6);
    const r2 = reach(3.2);
    const r3 = reach(4.8);
    const crack = interpolate(t, [1.6, 4.8], [0.15, 0.6], cl);
    const size = interpolate(t, [1.6, 5.5], [0.95, 0.7], cl);
    return (
      <Stage>
        <Cam s={1.3} cx={800} cy={620} dy={-60}>
          <Bedroom t={t} boxes={14} />
          <Demon id="dm" x={1140} y={BEDROOM_Y} t={t} scale={0.8} size={size} crack={crack} glow={1 - crack * 0.6} expr={{brow: 0.2, lid: 0.3, mouth: -0.1, eyeX: -14}} />
          <Hero id="h" x={x} y={BEDROOM_Y} scale={s} pose="arms-down" shoes={NEW_SHOES} accessory="cap" accessoryColor={MY_CAP} jacket={MY_JACKET}
            rHand={r1 > 0 ? [60 + r1 * 20, -200 - r1 * 260] : r2 > 0 ? [110 + r2 * 30, -200] : r3 > 0 ? [60, -40 + r3 * 20] : undefined}
            expr={{brow: -0.4, lid: 0.1, mouth: -0.2, eyeX: 10, eyeY: r3 ? 16 : 0}} />
          {t < 1.6 && <PriceTag ax={tagAt.cap(x, BEDROOM_Y, s)[0]} ay={tagAt.cap(x, BEDROOM_Y, s)[1]} price="$90" s={s * 1.2} t={t} />}
          {t < 3.2 && <PriceTag ax={tagAt.jacket(x, BEDROOM_Y, s)[0]} ay={tagAt.jacket(x, BEDROOM_Y, s)[1]} price="$300" s={s * 1.2} t={t} />}
          {t < 4.8 && <PriceTag ax={tagAt.shoes(x, BEDROOM_Y, s)[0]} ay={tagAt.shoes(x, BEDROOM_Y, s)[1]} price="$180" s={s * 1.2} t={t} />}
          <FallingTag t={t} t0={1.6} ax={tagAt.cap(x, BEDROOM_Y, s)[0]} ay={tagAt.cap(x, BEDROOM_Y, s)[1]} price="$90" s={s * 1.2} />
          <FallingTag t={t} t0={3.2} ax={tagAt.jacket(x, BEDROOM_Y, s)[0]} ay={tagAt.jacket(x, BEDROOM_Y, s)[1]} price="$300" s={s * 1.2} />
          <FallingTag t={t} t0={4.8} ax={tagAt.shoes(x, BEDROOM_Y, s)[0]} ay={tagAt.shoes(x, BEDROOM_Y, s)[1]} price="$180" s={s * 1.2} />
        </Cam>
      </Stage>
    );
  }
  if (t < 13) {
    const give = interpolate(t, [8.6, 9.4], [0, 1], cl);
    const back = interpolate(t, [10.6, 11.2], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.15} cx={1560} cy={640} dy={-60}>
          <Store t={t} spot={0.4} />
          <Hero id="clerk" x={1820} y={STORE_Y} scale={0.75} pose="arms-down" color={GREY} accessory="cap" accessoryColor="#1a1820" jacket="#1a1820"
            lHand={back ? [-140, -230] : undefined} expr={{mouth: 0.4, eyeX: -14}} />
          <Hero id="h" x={1480} y={STORE_Y} scale={0.75} pose="arms-down" shoes={NEW_SHOES} rHand={give < 1 ? [80 + give * 120, -230] : back ? [190, -230] : undefined}
            expr={{brow: -0.2, lid: 0.1, mouth: 0.3, eyeX: 16}} blink={blinkAt(t, [11.8])} />
          {/* the cap + jacket folded on the counter */}
          <g opacity={give}>
            <rect x={1700} y={600} width={120} height={40} rx={6} fill={MY_JACKET} stroke={C.outline} strokeWidth={3} />
            <path d="M 1718 600 Q 1760 556 1800 600 Z" fill={MY_CAP} stroke={C.outline} strokeWidth={3} />
          </g>
          {back > 0 && <rect x={1750} y={610 - 40} width={60} height={26} rx={3} fill="#86ad7f" stroke={C.outline} strokeWidth={2} opacity={back} />}
        </Cam>
      </Stage>
    );
  }
  if (t < 16) return <Stage><Receipt t={t} /></Stage>;
  if (t < 22) {
    const k = interpolate(t, [16.2, 18.6], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const walking = t < 18.6;
    const nod = interpolate(t, [19.6, 20.2], [0, 1], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [16, 22], [1.0, 1.04], cl)} cx={1000} cy={660} dy={-60}>
          <Diner t={t} />
          <Hero id="c1" x={1500} y={DINER_Y} scale={0.75} pose="arms-down" color={GREY} accessory="cap" accessoryColor="#5a6a3a" jacket="#3a3a50" back />
          <Hero id="c2" x={1760} y={DINER_Y} scale={0.75} pose="arms-down" color={C.tan} accessory="glasses" jacket="#5a3a3a" back />
          <Hero id="cw" x={1180} y={DINER_Y} scale={0.75} pose="arms-down" {...COWORKER} lHand={nod ? [-140, -230] : undefined}
            expr={{brow: -0.1, mouth: 0.4 + nod * 0.4, eyeX: -14}} headTilt={nod * 8} />
          <Hero id="mom" x={1320} y={DINER_Y} scale={0.75} pose="arms-down" {...MOM_WORK} lHand={[-120, -230]}
            expr={{brow: 0.6, lid: 0, mouth: 0.1 + nod * 0.4, eyeX: -18, bags: true}} />
          {walking ? (
            <HeroSide id="hw" x={-100 + k * 900} y={DINER_Y} scale={0.75} dir={1} phase={t * 7} shoes={NEW_SHOES} mouth={0.3} />
          ) : (
            <Hero id="h" x={800} y={DINER_Y} scale={0.75} pose="arms-down" shoes={NEW_SHOES} lHand={[-170, -230]}
              expr={{brow: -0.1, lid: 0, mouth: 0.6, eyeX: 16}} />
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 28) {
    const laugh = interpolate(t, [24.4, 24.8], [0, 1], cl);
    const bob = laugh ? Math.abs(Math.sin(t * 9)) * 4 : 0;
    return (
      <Stage>
        <Cam s={1.45} cx={460} cy={640} dy={-20}>
          <Diner t={t} />
          <Hero id="mom" x={340} y={790 + bob} scale={0.8} sit pose="arms-down" {...MOM_WORK} lHand={[-40, -110]} rHand={[50, -110]}
            expr={{brow: laugh ? -0.1 : 0.3, lid: laugh ? 0.5 : 0, mouth: 0.4 + laugh * 0.6, eyeX: 16, bags: true}} blink={blinkAt(t, [23.4])} />
          <Hero id="h" x={590} y={790} scale={0.8} sit pose="arms-down" shoes={NEW_SHOES} lHand={[-50, -110]} rHand={[40, -110]}
            expr={{brow: -0.1, lid: laugh ? 0.4 : 0.1, mouth: 0.8, eyeX: -16}} blink={blinkAt(t, [26.2])} />
          <DinerTable x={465} plates={2} />
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <PhoneChat t={t - 28} name="the boys" msgs={[[0.2, 'mall saturday?'], [0.7, 'bring cash']]} reply={[1.4, "can't. lunch with mom."]} cps={10} />
    </Stage>
  );
};

export const PocketClip5: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(2.0)} durationInFrames={sec(3.6)}>
        <DemonSay text="they'll laugh." x={1240} y={300} dur={sec(3.6)} size={50} />
      </Sequence>
      <Sequence from={sec(5.4)} durationInFrames={sec(1.6)}>
        <Caption text="He took them **off**." dur={sec(1.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(8.0)} durationInFrames={sec(4.8)}>
        <Caption text="He took it all **back**." dur={sec(4.8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(17.0)} durationInFrames={sec(4.8)}>
        <Caption text="Then he went to **Mom**." dur={sec(4.8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(22.6)} durationInFrames={sec(5.2)}>
        <Caption text="Lunch for **two**." dur={sec(5.2)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/room-tone.wav" vol={0.35} dur={7} fadeOut={0.5} />
      <Sfx at={1.6} src="sfx/tag-rip.wav" vol={0.6} />
      <Sfx at={2.1} src="sfx/voice/inner-theyll-laugh.wav" vol={0.6} />
      <Sfx at={3.2} src="sfx/tag-rip.wav" vol={0.6} />
      <Sfx at={4.8} src="sfx/tag-rip.wav" vol={0.6} />
      <Sfx at={5.0} src="sfx/glass-crack.wav" vol={0.35} />
      <Sfx at={5.2} src="sfx/celesta-sun.wav" vol={0.45} />
      <Sfx at={7.0} src="sfx/murmur.wav" vol={0.2} dur={6} fadeIn={0.4} fadeOut={0.6} />
      <Sfx at={8.8} src="sfx/bag-rustle.wav" vol={0.45} />
      <Sfx at={10.8} src="sfx/cash-register.wav" vol={0.45} />
      <Sfx at={13.3} src="sfx/paper-slide.wav" vol={0.45} />
      <Sfx at={16.0} src="sfx/door-bell.wav" vol={0.45} />
      <Sfx at={16.0} src="sfx/plates.wav" vol={0.3} dur={12} fadeIn={0.5} fadeOut={1} />
      <Sfx at={16.0} src="sfx/murmur.wav" vol={0.25} dur={12} fadeIn={0.5} fadeOut={1} />
      <Sfx at={22.6} src="sfx/cutlery.wav" vol={0.4} />
      <Sfx at={24.4} src="sfx/soft-laugh.wav" vol={0.5} />
      <Sfx at={28.2} src="sfx/msg-pop-1.wav" vol={0.5} />
      <Sfx at={28.7} src="sfx/msg-pop-2.wav" vol={0.5} />
      <Sfx at={29.4} src="sfx/key-tap.wav" vol={0.4} dur={2.2} />
      <Sfx at={32.0} src="sfx/msg-sent.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
