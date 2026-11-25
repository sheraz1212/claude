import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Airport, Apartment, Balcony, Bowling, Cake, ForwardFX, Suitcase, WeddingHall, YearHUD} from './sets';
import {cl, Pal} from './common';
import {C, FPS, sec} from '../common/theme';

/*
 Backwards — Clip 7 (35 s): 2026 again. This time he says yes — and the film FAST-FORWARDS through the same years, now warm.
  1 0–4     MEDIUM 2026 sofa, warm lamp, phone lights up     → second chance
  2 4–7.5   POV "Coffee tomorrow?" → he types "Yes! 9am?"     → the tiny decision
  3 7.5–11  CLOSE he smiles; fast-forward starts              → change
  4 11–14   WIDE 2027 balcony: he's there, cake, laughing      → present
  5 14–17   WIDE 2028 bowling: strike, a real high five        → part of the group
  6 17–20   WIDE 2029 airport: the goodbye hug                 → he shows up
  7 20–23   WIDE 2030 wedding: best man toast                  → the big day
  8 23–27   WIDE 2031 his birthday, the room is full           → the ending rewritten
  9 27–30   CLOSE he blows out the candles, smiling            → warmth
  10 30–35  black lesson card
*/
const io = Easing.inOut(Easing.cubic);
const OTHER = {c: TAN, a: 'glasses' as const};

const shots = (t: number): React.ReactNode => {
  if (t < 4)
    return (
      <Stage>
        <Cam s={1.55} cx={700} cy={620}>
          <Apartment t={t} lamp={1} warm={0.3}>
            <Hero id="s1" x={700} y={790} expr={{brow: 0.4, lid: 0.1, mouth: -0.1, eyeY: 8}} glow={0.6} blink={blinkAt(t, [2.4])} />
          </Apartment>
        </Cam>
      </Stage>
    );
  if (t < 7.5) {
    const n = Math.floor(interpolate(t, [4.8, 6.4], [0, 9.99], cl));
    const sent = t > 6.7;
    return (
      <Stage>
        <Light id="p7" x={960} y={560} r={700} color={C.amber} o={0.45} />
        <PhonePOV px={960} py={560} thumb={[960 + 150, 560 + 300 - (sent ? 20 : 0)]}>
          <circle cx={800} cy={300} r={22} fill="#a6a9b0" />
          <rect x={832} y={272} width={230} height={58} rx={18} fill="#d8dde6" />
          <text x={848} y={310} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#1d2027">
            Coffee tomorrow?
          </text>
          {sent && (
            <g>
              <rect x={970} y={360} width={150} height={58} rx={18} fill="#5b8fe0" />
              <text x={986} y={398} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#fff">
                Yes! 9am?
              </text>
            </g>
          )}
          <rect x={770} y={820} width={300} height={56} rx={28} fill="#fff" stroke="#c9d1de" strokeWidth={3} />
          <text x={792} y={858} fontFamily="Nunito" fontWeight={800} fontSize={28} fill="#1d2027">
            {sent ? '' : 'Yes! 9am?'.slice(0, n)}
          </text>
          <circle cx={1110} cy={848} r={28} fill="#5b8fe0" />
        </PhonePOV>
      </Stage>
    );
  }
  if (t < 11)
    return (
      <Stage>
        <g opacity={0.45}>
          <Apartment t={t} lamp={1} warm={0.5} />
        </g>
        <Light id="c7" x={1000} y={800} r={700} color={C.amber} o={0.7} />
        <Hero id="c7h" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: -0.2, mouth: interpolate(t, [7.8, 8.8], [0.1, 0.9], cl), eyeY: 0, lid: 0.15}} blink={blinkAt(t, [9.4])} />
      </Stage>
    );
  if (t < 14) {
    const s = interpolate(t, [11, 14], [1.05, 1.1], cl);
    return (
      <Stage>
        <Cam s={s} cx={960} cy={600}>
          <Balcony t={t} front={<g><rect x={830} y={780} width={260} height={16} rx={5} fill="#2a2630" stroke={C.line} strokeWidth={3} /><Cake x={960} y={780} s={0.8} candles={3} lit={1} t={t} /></g>}>
            <Pal x={1120} y={FLOOR} showLegs lHand={[-150, -250]} rHand={[90, -120]} headTilt={-6} expr={{mouth: 1, eyeX: -12, lid: 0.3}} />
            <Hero id="b7" x={800} y={FLOOR} showLegs lHand={[-90, -120]} rHand={[150, -250]} headTilt={6} expr={{mouth: 1, eyeX: 12, lid: 0.3}} />
          </Balcony>
        </Cam>
      </Stage>
    );
  }
  if (t < 17) {
    const five = interpolate(t, [15.0, 15.4], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.1} cx={960} cy={600}>
          <Bowling t={t} pinsDown={6} full>
            <Hero id="w7" x={880} y={FLOOR} showLegs lHand={[-90, -120]} rHand={[interpolate(five, [0, 1], [90, 110]), interpolate(five, [0, 1], [-150, -400])]} expr={{mouth: 1, eyeX: 12, eyeY: -6}} />
            <Pal x={1080} y={FLOOR} showLegs lHand={[interpolate(five, [0, 1], [-90, -110]), interpolate(five, [0, 1], [-150, -400])]} rHand={[90, -120]} expr={{mouth: 1, eyeX: -12, eyeY: -6}} />
            <Person id="ow" x={1340} y={FLOOR} showLegs color={OTHER.c} accessory={OTHER.a} lHand={[-90, -350]} rHand={[90, -350]} expr={{mouth: 1, eyeX: -12}} />
          </Bowling>
        </Cam>
      </Stage>
    );
  }
  if (t < 20)
    return (
      <Stage>
        <Cam s={1.25} cx={960} cy={600}>
          <Airport t={t}>
            <Pal x={1010} y={FLOOR} showLegs lHand={[-150, -240]} rHand={[90, -120]} headTilt={-8} expr={{mouth: 0.7, lid: 0.6, eyeX: -12}} />
            <Hero id="a7" x={880} y={FLOOR} showLegs lHand={[-90, -120]} rHand={[150, -240]} headTilt={8} expr={{mouth: 0.7, lid: 0.6, eyeX: 12}} />
            <Suitcase x={1200} y={FLOOR} />
          </Airport>
        </Cam>
      </Stage>
    );
  if (t < 23)
    return (
      <Stage>
        <Cam s={1.2} cx={960} cy={600}>
          <WeddingHall t={t}>
            <Pal x={1060} y={FLOOR} showLegs pose="arms-down" expr={{mouth: 1, eyeX: -12}} />
            <Person id="br7" x={1230} y={FLOOR} scale={0.95} showLegs color={TAN} accessory="bow" accessoryColor="#f3ebcf" pose="arms-down" expr={{mouth: 1, eyeX: -12}} />
            <Hero id="wd7" x={800} y={FLOOR} showLegs lHand={[-90, -120]} rHand={[100, -360]} rHold="cup" expr={{mouth: 1, eyeX: 12, brow: -0.1}} />
          </WeddingHall>
        </Cam>
      </Stage>
    );
  if (t < 27)
    return (
      <Stage>
        <Cam s={interpolate(t, [23, 27], [1.0, 1.05], cl)} cx={800} cy={600}>
          <Apartment t={t} lamp={1} warm={0.8} front={<Cake x={700} y={800} s={0.7} candles={5} lit={1} t={t} />}>
            <Hero id="r7" x={700} y={790} lHand={[-70, -120]} rHand={[70, -120]} expr={{mouth: 1, eyeX: 10, lid: 0.25}} />
            <Pal x={520} y={790} pose="arms-down" headTilt={6} expr={{mouth: 1, eyeX: 12}} />
            <Person id="r7b" x={880} y={790} color={TAN} accessory="bow" accessoryColor="#f3ebcf" pose="arms-down" expr={{mouth: 1, eyeX: -12}} />
            <Person id="r7c" x={1200} y={FLOOR} showLegs color={OTHER.c} accessory={OTHER.a} lHand={[-90, -340]} rHand={[90, -340]} expr={{mouth: 1, eyeX: -12}} />
          </Apartment>
        </Cam>
      </Stage>
    );
  const blow = interpolate(t, [28.0, 28.4], [0, 1], cl);
  return (
    <Stage>
      <g opacity={0.45}>
        <Apartment t={t} lamp={1} warm={0.8} />
      </g>
      <Light id="c9" x={1000} y={900} r={700} color={C.amber} o={1 - blow * 0.5} />
      <Hero id="c9h" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{mouth: blow > 0 && blow < 1 ? -0.8 : 0.9, lid: 0.2, eyeY: 6}} />
    </Stage>
  );
};

export const BackClip7: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ff = (a: number) => interpolate(t, [a - 0.25, a + 0.35], [0, 1], cl);
  const pulse = Math.max(t > 9.5 && t < 11 ? interpolate(t, [9.5, 11], [0, 1], cl) : 0, ...[14, 17, 20, 23].map((a) => (t > a - 0.25 && t < a + 0.35 ? ff(a) : 0)));
  const year = t < 10.6 ? '2026' : t < 14 ? '2027' : t < 17 ? '2028' : t < 20 ? '2029' : t < 23 ? '2030' : '2031';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 30 && shots(t)}
      <FilmLook />
      {t < 30 && <YearHUD year={year} />}
      <ForwardFX p={pulse} />
      <Sequence from={sec(8.2)} durationInFrames={sec(2.6)}>
        <Caption text="This time, he said **yes**." dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(20.3)} durationInFrames={sec(2.5)}>
        <HeadPill text="To my best friend!" x={960 + (800 - 960) * 1.2} y={600 + (FLOOR - 430 - 600) * 1.2 - 10} dur={sec(2.5)} />
      </Sequence>
      <Sequence from={sec(30)} durationInFrames={sec(5)}>
        <BlackCard text="Call while you can." dur={sec(5)} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0.4} src="music/forward-theme.wav" vol={0.6} />
      {/* SFX */}
      <Sfx at={0.5} src="sfx/msg-pop-1.wav" vol={0.45} />
      {[4.9, 5.2, 5.5, 5.8, 6.1].map((s) => (
        <Sfx key={s} at={s} src="sfx/key-tap.wav" vol={0.4} />
      ))}
      <Sfx at={6.7} src="sfx/msg-sent.wav" vol={0.55} />
      <Sfx at={9.5} src="sfx/fast-forward.wav" vol={0.5} />
      <Sfx at={11.3} src="sfx/group-laugh.wav" vol={0.4} />
      <Sfx at={14.2} src="sfx/pins-crash.wav" vol={0.55} />
      <Sfx at={15.1} src="sfx/pat.wav" vol={0.6} />
      <Sfx at={17.2} src="sfx/airport-chime.wav" vol={0.35} />
      <Sfx at={20.2} src="sfx/glass-clink.wav" vol={0.5} />
      <Sfx at={21.5} src="sfx/applause.wav" vol={0.35} />
      <Sfx at={23.3} src="sfx/soft-laugh.wav" vol={0.45} />
      <Sfx at={28.0} src="sfx/candle-blow.wav" vol={0.6} />
      <Sfx at={28.5} src="sfx/applause.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
