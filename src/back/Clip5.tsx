import React from 'react';
import {interpolate, Sequence} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Apartment, Balcony, Cake} from './sets';
import {cl, Pal, YearClip} from './common';
import {C, sec} from '../common/theme';

/*
 Backwards — Clip 5 (35 s): 2027, his friend's birthday. Three calls ignored.
  1 0–4      WIDE balcony party, fairy lights, cake           → warmth he's missing
  2 4–7.5    MEDIUM friend calls him, waiting                  → "Where is he?"
  3 7.5–11   MEDIUM sofa: phone rings, he declines             → call 1
  4 11–14.5  MEDIUM friend calls again, smile fading           → call 2
  5 14.5–18  INSERT phone face-down on the cushion, buzzing    → he hides from it
  6 18–21.5  MEDIUM friend leaves a voicemail: "Miss you, man." → the friend still tries
  7 21.5–25  WIDE friends sing, friend blows out the candles   → life goes on
  8 25–28.5  POV "3 missed calls · 1 voicemail"                → the evidence
  9 28.5–31.5 MEDIUM-CLOSE him on the sofa, guilt              → he knows
  10 31.5–35 rewind → 2026
*/
const GUESTS = [
  {x: 640, c: TAN, a: 'glasses' as const},
  {x: 1300, c: '#a6a9b0', a: 'headphones' as const},
];

const Party: React.FC<{t: number; s?: number; cx?: number; blow?: number; phoneUp?: boolean}> = ({t, s = 1, cx = 960, blow = 0, phoneUp}) => (
  <Stage>
    <Cam s={s} cx={cx} cy={600}>
      <Balcony t={t} front={<g><rect x={830} y={780} width={260} height={16} rx={5} fill="#2a2630" stroke={C.line} strokeWidth={3} /><line x1={850} y1={796} x2={850} y2={FLOOR} stroke={C.line} strokeWidth={4} /><line x1={1070} y1={796} x2={1070} y2={FLOOR} stroke={C.line} strokeWidth={4} /><Cake x={960} y={780} s={0.8} candles={3} lit={1 - blow} t={t} smoke={blow} /></g>}>
        {GUESTS.map((g, i) => (
          <Person key={g.x} id={`pg${i}`} x={g.x} y={FLOOR} showLegs color={g.c} accessory={g.a} accessoryColor="#e07b8a" lHand={[-90, -120]} rHand={[90, -120]} headTilt={Math.sin(t * 3 + i) * 4} expr={{mouth: 1, eyeX: i ? -12 : 12}} />
        ))}
        <Pal x={960} y={FLOOR - 40} showLegs lHand={phoneUp ? [-105, -290] : [-90, -120]} lHold={phoneUp ? 'phone' : 'none'} rHand={[90, -120]} expr={{mouth: phoneUp ? 0.2 : 0.8, brow: phoneUp ? 0.3 : 0, eyeX: phoneUp ? -12 : 0, eyeY: blow ? 10 : 0}} blink={blinkAt(t, [2.6, 23.4])} />
      </Balcony>
    </Cam>
  </Stage>
);

const Sofa: React.FC<{t: number; decline?: boolean; glow?: number}> = ({t, decline, glow = 0}) => {
  const ring = decline && t < 9.6;
  const buzz = ring && (t * 3) % 1 < 0.5 ? Math.sin(t * 90) * 3 : 0;
  return (
    <Stage>
      <Cam s={1.55} cx={700} cy={620}>
        <Apartment t={t} lamp={0.5}>
          <Hero id="hs" x={700 + buzz * 0} y={790} expr={{brow: 0.5, lid: 0.2, mouth: -0.3, eyeY: 8}} glow={glow} thumb={decline && t > 9.4 && t < 9.8 ? 1 : 0} />
        </Apartment>
      </Cam>
    </Stage>
  );
};

const shots = (t: number): React.ReactNode => {
  if (t < 4) return <Party t={t} s={interpolate(t, [0, 4], [1.0, 1.04], cl)} />;
  if (t < 7.5 || (t >= 11 && t < 14.5)) return <Party t={t} s={1.7} cx={900} phoneUp />;
  if (t < 11) return <Sofa t={t} decline glow={0.9} />;
  if (t < 18) {
    const buzz = (t * 3) % 1 < 0.5 ? Math.sin(t * 90) * 4 : 0;
    return (
      <Stage bg="#101114">
        <Light id="cu5" x={960} y={560} r={700} color={C.cold} o={0.25} />
        <Cam s={interpolate(t, [14.5, 18], [1.0, 1.06], cl)} cx={960} cy={600}>
          <rect x={300} y={600} width={1320} height={240} rx={40} fill="#20242b" stroke={C.line} strokeWidth={5} />
          <g transform={`translate(${960 + buzz} 640)`}>
            <rect x={-150} y={-30} width={300} height={44} rx={14} fill="#14171c" stroke={C.outline} strokeWidth={5} />
            <circle cx={110} cy={-8} r={7} fill="#3a4049" />
          </g>
          {buzz !== 0 && [-1, 1].map((sgn) => <path key={sgn} d={`M ${960 + sgn * 200} 590 q ${sgn * 16} 20 0 40 q ${sgn * -16} 20 0 40`} stroke={C.coldLight} strokeWidth={5} fill="none" />)}
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5) return <Party t={t} s={1.7} cx={900} phoneUp />;
  if (t < 25) return <Party t={t} s={1.15} blow={interpolate(t, [23.0, 23.4], [0, 1], cl)} />;
  if (t < 28.5)
    return (
      <Stage>
        <Light id="pv5" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <text x={960} y={330} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill="#c0392b">
            3 missed calls
          </text>
          <rect x={800} y={380} width={320} height={70} rx={18} fill="#d8dde6" />
          <circle cx={840} cy={415} r={16} fill="#a6a9b0" />
          <path d="M 870 415 h 120" stroke="#5a6273" strokeWidth={6} strokeLinecap="round" />
          <circle cx={1080} cy={415} r={16} fill="#5b8fe0" />
          <path d="M 1075 405 l 12 10 l -12 10 z" fill="#fff" />
        </PhonePOV>
      </Stage>
    );
  return (
    <Stage>
      <g opacity={0.45}>
        <Apartment t={t} lamp={0.4} />
      </g>
      <Hero id="h9" x={1000} y={1080} scale={1.75} pose="phone" glow={0.6} expr={{brow: 0.8, lid: 0.25, mouth: -0.5, eyeY: 8, bags: true}} blink={blinkAt(t, [30.2])} />
    </Stage>
  );
};

export const BackClip5: React.FC = () => (
  <YearClip year="2027" prev="2026" shots={shots}>
    <Sequence from={sec(0.8)} durationInFrames={sec(3.0)}>
      <Caption text="His friend turned **twenty-five**." dur={sec(3.0)} />
    </Sequence>
    <Sequence from={sec(4.6)} durationInFrames={sec(2.6)}>
      <HeadPill text="Where is he?" x={900 + (960 - 900) * 1.7} y={600 + (FLOOR - 40 - 430 - 600) * 1.7 - 10} dur={sec(2.6)} />
    </Sequence>
    <Sequence from={sec(18.4)} durationInFrames={sec(2.8)}>
      <HeadPill text="Miss you, man." x={900 + (960 - 900) * 1.7} y={600 + (FLOOR - 40 - 430 - 600) * 1.7 - 10} dur={sec(2.8)} />
    </Sequence>
    {/* MUSIC */}
    <Sfx at={0} src="music/balcony-guitar.wav" vol={0.45} dur={7.5} />
    <Sfx at={7.5} src="music/lonely-pad.wav" vol={0.4} dur={7} />
    <Sfx at={14.5} src="music/music-box-lonely.wav" vol={0.4} dur={7} />
    <Sfx at={21.5} src="music/balcony-guitar.wav" vol={0.45} dur={3.5} />
    <Sfx at={25.0} src="music/low-note.wav" vol={0.5} />
    {/* SFX */}
    <Sfx at={0.3} src="sfx/soft-laugh.wav" vol={0.45} />
    <Sfx at={7.6} src="sfx/ringtone.wav" vol={0.5} dur={2.0} />
    <Sfx at={9.5} src="sfx/key-tap.wav" vol={0.4} />
    <Sfx at={14.6} src="sfx/phone-buzz.wav" vol={0.6} />
    <Sfx at={16.2} src="sfx/phone-buzz.wav" vol={0.55} />
    <Sfx at={18.2} src="sfx/voicemail-beep.wav" vol={0.5} />
    <Sfx at={22.0} src="sfx/group-laugh.wav" vol={0.4} />
    <Sfx at={23.0} src="sfx/candle-blow.wav" vol={0.6} />
    <Sfx at={23.5} src="sfx/applause.wav" vol={0.35} />
    <Sfx at={25.2} src="sfx/msg-pop-3.wav" vol={0.4} />
    <Sfx at={31.5} src="sfx/rewind.wav" vol={0.7} />
  </YearClip>
);
