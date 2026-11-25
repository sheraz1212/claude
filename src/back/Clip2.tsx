import React from 'react';
import {Easing, interpolate, Sequence} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Chair} from '../yes/canteen';
import {Apartment, PlaceCard, WeddingHall} from './sets';
import {cl, Pal, YearClip} from './common';
import {C, sec} from '../common/theme';

/*
 Backwards — Clip 2 (35 s): 2030, the wedding he skipped.
  1 0–4     WIDE hall, friend dances with his bride            → happiest day
  2 4–7.5   INSERT the empty chair with his little place card   → he's missing
  3 7.5–11  MEDIUM friend's toast, he glances at the empty seat → it hurts the friend
  4 11–14.5 WIDE group photo with a gap                         → the hole he left
  5 14.5–18 MEDIUM 2030 apartment, phone glow                    → where he was
  6 18–21.5 POV chat: "You're my best man, right?" "I'll try"   → the excuse
  7 21.5–25 CLOSE he turns the phone face down                  → avoidance
  8 25–28.5 WIDE, lights off, friend picks up the place card     → aftermath
  9 28.5–31.5 CLOSE friend with the card, sad smile             → the friend's side
  10 31.5–35 rewind → 2029
*/
const io = Easing.inOut(Easing.cubic);
const BRIDE = {color: TAN, accessory: 'bow' as const, accessoryColor: '#f3ebcf'};

const shots = (t: number): React.ReactNode => {
  const sway = Math.sin(t * 2.4) * 10;
  if (t < 4)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 4], [1.0, 1.04], cl)} cx={960} cy={560}>
          <WeddingHall t={t}>
            <Pal x={900 + sway} y={FLOOR} showLegs lHand={[60, -200]} rHand={[90, -130]} headTilt={6} expr={{mouth: 1, eyeX: 12, lid: 0.3}} />
            <Person id="bride" x={1060 + sway} y={FLOOR} scale={0.95} showLegs color={BRIDE.color} accessory={BRIDE.accessory} accessoryColor={BRIDE.accessoryColor} lHand={[-70, -200]} rHand={[90, -130]} headTilt={-6} expr={{mouth: 1, eyeX: -12, lid: 0.3}} />
            {[400, 1500].map((x, i) => (
              <Person key={x} id={`g${x}`} x={x} y={FLOOR} scale={0.85} showLegs color={i ? TAN : '#a6a9b0'} accessory={i ? 'glasses' : 'tie'} accessoryColor={C.amber} lHand={[-20 - Math.abs(Math.sin(t * 10)) * 25, -210]} rHand={[20 + Math.abs(Math.sin(t * 10)) * 25, -210]} expr={{mouth: 1, eyeX: i ? -12 : 12}} />
            ))}
          </WeddingHall>
        </Cam>
      </Stage>
    );
  if (t < 7.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 7.5], [1.0, 1.05], cl)} cx={960} cy={620}>
          <WeddingHall t={t}>
            <Chair x={960} y={FLOOR + 60} s={1.8} />
          </WeddingHall>
          <rect x={500} y={760} width={920} height={24} rx={6} fill="#1d1a1c" stroke={C.line} strokeWidth={4} />
          <ellipse cx={960} cy={756} rx={110} ry={16} fill="#f3ebcf" stroke={C.outline} strokeWidth={3} />
          <PlaceCard x={960} y={752} s={1.6} />
        </Cam>
      </Stage>
    );
  if (t < 11) {
    const glance = interpolate(t, [8.8, 9.4], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.7} cx={900} cy={560}>
          <WeddingHall t={t}>
            <Pal x={900} y={FLOOR} showLegs lHand={[-80, -140]} rHand={[100, -360]} rHold="cup" expr={{mouth: 1 - glance * 0.7, brow: glance * 0.5, eyeX: 12 * glance, eyeY: 4 * glance}} blink={blinkAt(t, [10.4])} />
          </WeddingHall>
        </Cam>
      </Stage>
    );
  }
  if (t < 14.5) {
    const flash = interpolate(t, [12.8, 12.9, 13.3], [0, 0.8, 0], cl);
    return (
      <Stage>
        <Cam s={1.15} cx={960} cy={600}>
          <WeddingHall t={t}>
            {[
              {x: 560, c: TAN, a: 'glasses'},
              {x: 760, c: '#a6a9b0', a: 'tie'},
            ].map((g) => (
              <Person key={g.x} id={`gp${g.x}`} x={g.x} y={FLOOR} showLegs color={g.c} accessory={g.a as 'glasses'} accessoryColor={C.amber} pose="arms-down" expr={{mouth: 1}} />
            ))}
            <Pal x={1160} y={FLOOR} showLegs pose="arms-down" expr={{mouth: 0.8, eyeX: -6}} />
            <Person id="bride2" x={1340} y={FLOOR} scale={0.95} showLegs color={BRIDE.color} accessory={BRIDE.accessory} accessoryColor={BRIDE.accessoryColor} pose="arms-down" expr={{mouth: 1}} />
            {/* the gap where he should stand */}
            <rect x={890} y={420} width={160} height={440} rx={60} fill="none" stroke="#5a6273" strokeWidth={3} strokeDasharray="10 12" opacity={0.6} />
          </WeddingHall>
          {flash > 0 && <rect x={-200} y={-200} width={2400} height={1500} fill="#fff" opacity={flash} />}
        </Cam>
      </Stage>
    );
  }
  if (t < 18)
    return (
      <Stage>
        <Cam s={1.55} cx={700} cy={620}>
          <Apartment t={t} lamp={0.5}>
            <Hero id="h5" x={700} y={790} expr={{brow: 0.6, lid: 0.3, mouth: -0.3, eyeY: 8}} glow={0.85} blink={blinkAt(t, [16.4])} />
          </Apartment>
        </Cam>
      </Stage>
    );
  if (t < 21.5) {
    const photo = t > 19.8;
    return (
      <Stage>
        <Light id="pv2" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <circle cx={800} cy={290} r={22} fill="#a6a9b0" />
          <rect x={832} y={262} width={290} height={58} rx={18} fill="#d8dde6" />
          <text x={846} y={299} fontFamily="Nunito" fontWeight={800} fontSize={21} fill="#1d2027">
            You're my best man, right?
          </text>
          <rect x={950} y={350} width={170} height={56} rx={18} fill="#5b8fe0" />
          <text x={966} y={386} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#fff">
            I'll try...
          </text>
          {photo && (
            <g>
              <circle cx={800} cy={470} r={22} fill="#a6a9b0" />
              <rect x={832} y={444} width={290} height={200} rx={14} fill="#3a2a22" />
              {[870, 930, 1060, 1100].map((x, i) => (
                <g key={x}>
                  <circle cx={x} cy={560} r={20} fill={i % 2 ? TAN : '#a6a9b0'} />
                  <rect x={x - 14} y={580} width={28} height={40} rx={10} fill={i % 2 ? TAN : '#a6a9b0'} />
                </g>
              ))}
              <rect x={975} y={530} width={50} height={92} rx={18} fill="none" stroke="#9aa3b2" strokeDasharray="5 5" strokeWidth={2} />
            </g>
          )}
        </PhonePOV>
      </Stage>
    );
  }
  if (t < 25)
    return (
      <Stage>
        <g opacity={0.45}>
          <Apartment t={t} lamp={0.4} />
        </g>
        <Hero id="h7" x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={-6} expr={{brow: 0.7, lid: 0.3, mouth: -0.4, eyeX: -14, bags: true}} blink={blinkAt(t, [23.6])} />
      </Stage>
    );
  if (t < 28.5) {
    const pick = interpolate(t, [26.0, 27.0], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.1} cx={960} cy={600}>
          <WeddingHall t={t} lights={0.4}>
            <Chair x={1100} y={FLOOR} s={1} />
            <Pal x={960} y={FLOOR} showLegs lHand={[-80, -130]} rHand={[interpolate(pick, [0, 1], [130, 90]), interpolate(pick, [0, 1], [-160, -250])]} headTilt={8} expr={{mouth: -0.1, brow: 0.5, eyeX: 12, eyeY: 8}} />
            {pick > 0.5 ? <PlaceCard x={1050} y={FLOOR - 250} s={0.6} /> : <PlaceCard x={1100} y={FLOOR - 160} s={0.6} />}
          </WeddingHall>
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <g opacity={0.4}>
        <WeddingHall t={t} lights={0.4} />
      </g>
      <Pal x={1000} y={1080} scale={1.75} lHand={[-130, -180]} rHand={[80, -120]} headTilt={6} expr={{brow: 0.6, mouth: 0.15, eyeX: -10, eyeY: 8, lid: 0.2}} blink={blinkAt(t, [30.4])} />
      <PlaceCard x={1000 - 130 * 1.75} y={1080 - 200 * 1.75} s={1.1} />
    </Stage>
  );
};

export const BackClip2: React.FC = () => (
  <YearClip year="2030" prev="2029" shots={shots}>
    <Sequence from={sec(0.8)} durationInFrames={sec(3.0)}>
      <Caption text="His best friend got **married**." dur={sec(3.0)} />
    </Sequence>
    <Sequence from={sec(14.8)} durationInFrames={sec(3.0)}>
      <Caption text="He said he was **busy**." dur={sec(3.0)} highlight={C.coldLight} />
    </Sequence>
    {/* MUSIC */}
    <Sfx at={0} src="music/waltz-sad.wav" vol={0.5} dur={14.5} />
    <Sfx at={14.5} src="music/lonely-pad.wav" vol={0.45} />
    <Sfx at={25.0} src="music/waltz-sad.wav" vol={0.35} dur={6.5} />
    {/* SFX */}
    <Sfx at={0.2} src="sfx/applause.wav" vol={0.35} />
    <Sfx at={8.0} src="sfx/glass-clink.wav" vol={0.55} />
    <Sfx at={12.8} src="sfx/shutter.wav" vol={0.6} />
    <Sfx at={18.2} src="sfx/msg-pop-1.wav" vol={0.45} />
    <Sfx at={19.8} src="sfx/msg-pop-2.wav" vol={0.45} />
    <Sfx at={22.2} src="sfx/phone-tap.wav" vol={0.5} />
    <Sfx at={26.2} src="sfx/paper-slide.wav" vol={0.35} />
    <Sfx at={31.5} src="sfx/rewind.wav" vol={0.7} />
  </YearClip>
);
