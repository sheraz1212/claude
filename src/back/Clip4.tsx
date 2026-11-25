import React from 'react';
import {Easing, interpolate, Sequence} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Apartment, Bowling, ShoeRack} from './sets';
import {cl, Pal, YearClip} from './common';
import {C, sec} from '../common/theme';

/*
 Backwards — Clip 4 (35 s): 2028, bowling night with the group.
  1 0–4      WIDE neon alley, friends bowl; his score slot is empty   → they still include him
  2 4–7.5    INSERT shoe rack, his teal shoes wait                    → a place kept for him
  3 7.5–11   MEDIUM friend calls him                                  → they reach out
  4 11–14.5  MEDIUM at home the phone rings on the table, he watches  → he lets it ring
  5 14.5–18  WIDE strike! a high five meets empty air                 → the missing person
  6 18–21.5  MEDIUM group selfie with a gap                           → memories without him
  7 21.5–25  MEDIUM he scrolls at home, phone glow                    → watching from outside
  8 25–28.5  POV the story: selfie + "missed you!"                    → they still care
  9 28.5–31.5 WIDE, alley closing, friend puts the shoes back         → the door closing slowly
  10 31.5–35 rewind → 2027
*/
const io = Easing.inOut(Easing.cubic);
const OTHERS = [
  {x: 1180, c: TAN, a: 'glasses' as const, ac: undefined},
  {x: 1400, c: '#a6a9b0', a: 'headphones' as const, ac: '#e07b8a'},
];

const shots = (t: number): React.ReactNode => {
  if (t < 4 || (t >= 14.5 && t < 18)) {
    const strike = t >= 14.5;
    const pins = strike ? Math.floor(interpolate(t, [15.2, 15.6], [0, 6.99], cl)) : 0;
    const jump = strike && t > 15.6 ? Math.abs(Math.sin((t - 15.6) * 6)) * 30 : 0;
    const five = strike ? interpolate(t, [16.2, 16.7], [0, 1], {...cl, easing: io}) : 0;
    return (
      <Stage>
        <Cam s={interpolate(t, strike ? [14.5, 18] : [0, 4], [1.0, 1.04], cl)} cx={960} cy={600}>
          <Bowling t={t} pinsDown={pins}>
            <Pal x={760} y={FLOOR - jump} showLegs lHand={[-80, -150]} rHand={strike ? [interpolate(five, [0, 1], [90, -150]), interpolate(five, [0, 1], [-150, -380])] : [100, -130]} rHold={!strike ? 'ball' : 'none'} expr={{mouth: 1, eyeX: strike ? -14 : 12, lid: 0.3}} />
            {OTHERS.map((o, i) => (
              <Person key={o.x} id={`ob${i}`} x={o.x} y={FLOOR - jump * (i ? 0.7 : 1)} showLegs color={o.c} accessory={o.a} accessoryColor={o.ac} lHand={[-90, strike ? -350 : -120]} rHand={[90, strike ? -350 : -120]} expr={{mouth: 1, eyeX: -12}} />
            ))}
          </Bowling>
        </Cam>
      </Stage>
    );
  }
  if (t < 7.5)
    return (
      <Stage bg="#100e16">
        <Light id="sr" x={960} y={500} r={800} color="#e07b8a" o={0.3} />
        <Cam s={interpolate(t, [4, 7.5], [1.0, 1.06], cl)} cx={960} cy={560}>
          <ShoeRack x={960} y={820} s={1.8} />
        </Cam>
      </Stage>
    );
  if (t < 11)
    return (
      <Stage>
        <Cam s={1.6} cx={800} cy={600}>
          <Bowling t={t}>
            <Pal x={800} y={FLOOR} showLegs lHand={[-105, -290]} lHold="phone" rHand={[90, -120]} headTilt={-6} expr={{mouth: 0.2, brow: 0.3, eyeX: -12}} blink={blinkAt(t, [9.6])} />
          </Bowling>
        </Cam>
      </Stage>
    );
  if (t < 14.5) {
    const buzz = (t * 3) % 1 < 0.5 ? Math.sin(t * 90) * 3 : 0;
    return (
      <Stage>
        <Cam s={1.55} cx={700} cy={640}>
          <Apartment t={t} lamp={0.5} front={<g transform={`translate(${760 + buzz} 792)`}><rect x={-30} y={-12} width={60} height={14} rx={4} fill="#e9eef7" stroke={C.outline} strokeWidth={3} /></g>}>
            <Hero id="h4" x={640} y={790} pose="arms-down" headTilt={8} expr={{brow: 0.5, lid: 0.2, mouth: -0.3, eyeX: 12, eyeY: 14}} blink={blinkAt(t, [13.4])} />
          </Apartment>
          <Light id="ph4" x={760} y={790} r={200} color={C.cold} o={0.8} />
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5)
    return (
      <Stage>
        <Cam s={1.45} cx={1060} cy={560}>
          <Bowling t={t}>
            <Pal x={880} y={FLOOR} showLegs lHand={[-80, -150]} rHand={[130, -420]} rHold="phone-screen" expr={{mouth: 1, eyeX: 12, eyeY: -10}} />
            {OTHERS.map((o, i) => (
              <Person key={o.x} id={`os${i}`} x={o.x - 60 + i * 20} y={FLOOR} showLegs color={o.c} accessory={o.a} accessoryColor={o.ac} pose="arms-down" headTilt={i ? 6 : -4} expr={{mouth: 1, eyeX: -10, eyeY: -10}} />
            ))}
          </Bowling>
        </Cam>
      </Stage>
    );
  if (t < 25)
    return (
      <Stage>
        <Cam s={1.55} cx={700} cy={620}>
          <Apartment t={t} lamp={0.4}>
            <Hero id="h7" x={700} y={790} expr={{brow: 0.6, lid: 0.3, mouth: -0.2, eyeY: 8}} glow={0.9} thumb={(t * 1.5) % 1 < 0.15 ? 1 : 0} />
          </Apartment>
        </Cam>
      </Stage>
    );
  if (t < 28.5)
    return (
      <Stage>
        <Light id="pv4" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <rect x={762} y={190} width={396} height={680} fill="#1c1626" />
          {[880, 1000, 1080].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={500} r={46} fill={[ '#a6a9b0', TAN, '#a6a9b0'][i]} />
              <rect x={x - 34} y={548} width={68} height={120} rx={28} fill={['#a6a9b0', TAN, '#a6a9b0'][i]} />
            </g>
          ))}
          <rect x={790} y={760} width={220} height={50} rx={12} fill="#ffffff" opacity={0.9} />
          <text x={804} y={794} fontFamily="Nunito" fontWeight={900} fontSize={26} fill="#1d2027">
            missed you!
          </text>
        </PhonePOV>
      </Stage>
    );
  const put = interpolate(t, [29.0, 30.0], [0, 1], {...cl, easing: io});
  return (
    <Stage>
      <Cam s={1.15} cx={960} cy={600}>
        <Bowling t={t}>
          <ShoeRack x={1250} y={780} s={1.0} empty={put < 1} />
          <Pal x={1000} y={FLOOR} showLegs lHand={[-80, -130]} rHand={[interpolate(put, [0, 1], [100, 300]), interpolate(put, [0, 1], [-140, -200])]} headTilt={8} expr={{mouth: -0.1, brow: 0.4, eyeX: 12, eyeY: 4}} />
          {put < 1 && <path d={`M ${1000 + interpolate(put, [0, 1], [100, 300]) - 20} ${FLOOR - interpolate(put, [0, 1], [140, 200]) - 20} q 0 -30 24 -30 l 30 24 l 0 8 z`} fill={C.teal} stroke={C.outline} strokeWidth={3} />}
        </Bowling>
        <rect x={-300} y={-300} width={2600} height={1700} fill="#05060a" opacity={interpolate(t, [28.5, 31.5], [0.2, 0.5], cl)} />
      </Cam>
    </Stage>
  );
};

export const BackClip4: React.FC = () => (
  <YearClip year="2028" prev="2027" shots={shots}>
    <Sequence from={sec(0.8)} durationInFrames={sec(3.0)}>
      <Caption text="They still saved him a **spot**." dur={sec(3.0)} />
    </Sequence>
    <Sequence from={sec(8.0)} durationInFrames={sec(2.8)}>
      <HeadPill text="Come on, pick up!" x={800} y={600 + (FLOOR - 430 - 600) * 1.6 - 10} dur={sec(2.8)} />
    </Sequence>
    <Sequence from={sec(11.4)} durationInFrames={sec(3.0)}>
      <Caption text="He let it **ring**." dur={sec(3.0)} highlight={C.coldLight} />
    </Sequence>
    {/* MUSIC */}
    <Sfx at={0} src="music/bowling-funk.wav" vol={0.45} dur={11} />
    <Sfx at={11.0} src="music/low-note.wav" vol={0.45} dur={3.5} />
    <Sfx at={14.5} src="music/bowling-funk.wav" vol={0.45} dur={7} />
    <Sfx at={21.5} src="music/small-sad.wav" vol={0.5} />
    <Sfx at={28.5} src="music/low-note.wav" vol={0.45} />
    {/* SFX */}
    <Sfx at={0.6} src="sfx/ball-roll.wav" vol={0.5} />
    <Sfx at={2.4} src="sfx/pins-crash.wav" vol={0.5} />
    <Sfx at={8.0} src="sfx/key-tap.wav" vol={0.3} />
    <Sfx at={11.0} src="sfx/ringtone.wav" vol={0.5} dur={3.5} />
    <Sfx at={14.6} src="sfx/ball-roll.wav" vol={0.5} />
    <Sfx at={15.2} src="sfx/pins-crash.wav" vol={0.75} />
    <Sfx at={15.7} src="sfx/far-cheer.wav" vol={0.6} />
    <Sfx at={19.0} src="sfx/shutter.wav" vol={0.5} />
    <Sfx at={25.2} src="sfx/msg-pop-3.wav" vol={0.4} />
    <Sfx at={29.2} src="sfx/cloth.wav" vol={0.4} />
    <Sfx at={31.5} src="sfx/rewind.wav" vol={0.7} />
  </YearClip>
);
