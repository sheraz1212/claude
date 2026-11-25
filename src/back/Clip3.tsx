import React from 'react';
import {interpolate, Sequence} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Stage} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Airport, Apartment, Suitcase} from './sets';
import {cl, Pal, YearClip} from './common';
import {C, sec} from '../common/theme';

/*
 Backwards — Clip 3 (35 s): 2029, the airport goodbye he never came to.
  1 0–4      WIDE terminal, friend rolls his suitcase in        → he's leaving the country
  2 4–7.5    MEDIUM friend texts, looks at the entrance          → waiting for him
  3 7.5–11   POV his phone: "Leaving at 6. Come say bye?"       → the invite
  4 11–14.5  MEDIUM he lies on the sofa, types "Stuck in traffic" → the lie
  5 14.5–18  WIDE gate, BOARDING, friend is last in line         → time running out
  6 18–21.5  CLOSE friend looks back one last time              → heartbreak
  7 21.5–25  WIDE the plane takes off behind the glass           → gone
  8 25–28.5  MEDIUM he watches a plane light cross his window    → he knows
  9 28.5–31.5 CLOSE him                                         → regret
  10 31.5–35 rewind → 2028
*/
const shots = (t: number): React.ReactNode => {
  if (t < 7.5) {
    const walk = interpolate(t, [0, 3.6], [200, 860], cl);
    const two = t >= 4;
    return (
      <Stage>
        <Cam s={two ? 1.6 : 1.0} cx={two ? 900 : 960} cy={two ? 600 : 560}>
          <Airport t={t}>
            <Pal x={two ? 860 : walk} y={FLOOR} showLegs walk={!two && t < 3.6 ? t * 6 : undefined} lHand={two ? [-40, -180] : [-80, -150]} lHold={two ? 'phone' : 'none'} rHand={[110, -120]} expr={{mouth: 0.5, eyeX: two ? (t > 5.6 ? -14 : 0) : 12, eyeY: two && t < 5.6 ? 8 : 0}} blink={blinkAt(t, [2.6, 6.6])} />
            <Suitcase x={(two ? 860 : walk) + 150} y={FLOOR} />
          </Airport>
        </Cam>
      </Stage>
    );
  }
  if (t < 11)
    return (
      <Stage>
        <Light id="pv3" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <circle cx={800} cy={300} r={22} fill="#a6a9b0" />
          <rect x={832} y={270} width={290} height={90} rx={18} fill="#d8dde6" />
          <text x={846} y={306} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#1d2027">
            Leaving at 6.
          </text>
          <text x={846} y={338} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#1d2027">
            Come say bye?
          </text>
        </PhonePOV>
      </Stage>
    );
  if (t < 14.5) {
    const n = Math.floor(interpolate(t, [11.8, 13.6], [0, 22.99], cl));
    return (
      <Stage>
        <Cam s={1.55} cx={700} cy={620}>
          <Apartment t={t} lamp={0.5}>
            <Hero id="h4" x={700} y={790} headTilt={-12} expr={{brow: 0.3, lid: 0.35, mouth: -0.1, eyeY: 8}} glow={0.8} thumb={(t * 6) % 1 < 0.4 ? 1 : 0} />
          </Apartment>
          <g transform="translate(860 420)">
            <rect x={0} y={0} width={300} height={56} rx={18} fill="#5b8fe0" opacity={n > 0 ? 1 : 0} />
            <text x={16} y={37} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#fff">
              {'Stuck in traffic, sorry'.slice(0, n)}
            </text>
          </g>
        </Cam>
      </Stage>
    );
  }
  if (t < 18)
    return (
      <Stage>
        <Cam s={1.25} cx={1100} cy={560}>
          <Airport t={t}>
            <rect x={1500} y={500} width={60} height={360} fill="#1d1f24" stroke={C.line} strokeWidth={3} />
            <Pal x={1300} y={FLOOR} showLegs lHand={[-80, -150]} rHand={[110, -120]} headTilt={interpolate(t, [15.5, 16.3], [0, -8], cl)} expr={{mouth: 0, brow: 0.4, eyeX: interpolate(t, [15.5, 16.3], [10, -14], cl)}} blink={blinkAt(t, [17.2])} />
            <Suitcase x={1450} y={FLOOR} />
          </Airport>
        </Cam>
      </Stage>
    );
  if (t < 21.5)
    return (
      <Stage>
        <g opacity={0.45}>
          <Airport t={t} />
        </g>
        <Pal x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={-6} expr={{brow: 0.7, mouth: -0.2, eyeX: -14, lid: 0.15}} blink={blinkAt(t, [20.4])} />
      </Stage>
    );
  if (t < 25)
    return (
      <Stage>
        <Airport t={t} planeX={interpolate(t, [21.5, 25], [200, 1900], cl)} />
      </Stage>
    );
  if (t < 28.5) {
    const px = interpolate(t, [25, 28.5], [300, 1000], cl);
    return (
      <Stage>
        <Cam s={1.4} cx={640} cy={460}>
          <Apartment t={t} lamp={0.4}>
            <Hero id="h8" x={700} y={790} pose="arms-down" headTilt={-8} expr={{brow: 0.6, lid: 0.2, mouth: -0.3, eyeX: -10, eyeY: -12}} />
          </Apartment>
          <circle cx={px} cy={230 - (px - 300) * 0.08} r={4} fill="#ff6b6b" opacity={(t * 3) % 1 < 0.5 ? 1 : 0.3} />
          <circle cx={px} cy={230 - (px - 300) * 0.08} r={2} fill="#fff" />
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <g opacity={0.45}>
        <Apartment t={t} lamp={0.4} />
      </g>
      <Hero id="h9" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: 0.9, lid: 0.3, mouth: -0.5, eyeY: -4, bags: true, tear: interpolate(t, [29, 31], [0, 0.8], cl)}} blink={blinkAt(t, [30.6])} />
    </Stage>
  );
};

export const BackClip3: React.FC = () => (
  <YearClip year="2029" prev="2028" shots={shots}>
    <Sequence from={sec(0.8)} durationInFrames={sec(3.0)}>
      <Caption text="His friend moved far **away**." dur={sec(3.0)} />
    </Sequence>
    <Sequence from={sec(12.0)} durationInFrames={sec(2.4)}>
      <Caption text="He wasn't in **traffic**." dur={sec(2.4)} highlight={C.coldLight} />
    </Sequence>
    {/* MUSIC */}
    <Sfx at={0} src="music/freeze-pad.wav" vol={0.4} />
    <Sfx at={11.0} src="music/low-note.wav" vol={0.45} />
    <Sfx at={18.0} src="music/low-note.wav" vol={0.55} />
    <Sfx at={21.5} src="music/sad-piano-2.wav" vol={0.45} dur={10} />
    {/* SFX */}
    <Sfx at={0.2} src="sfx/suitcase-roll.wav" vol={0.5} />
    <Sfx at={4.6} src="sfx/key-tap.wav" vol={0.4} />
    <Sfx at={7.6} src="sfx/msg-pop-1.wav" vol={0.5} />
    {[11.9, 12.2, 12.5, 12.8, 13.1, 13.4].map((s) => (
      <Sfx key={s} at={s} src="sfx/key-tap.wav" vol={0.4} />
    ))}
    <Sfx at={13.7} src="sfx/msg-sent.wav" vol={0.45} />
    <Sfx at={14.6} src="sfx/airport-chime.wav" vol={0.55} />
    <Sfx at={21.5} src="sfx/jet-takeoff.wav" vol={0.7} />
    <Sfx at={31.5} src="sfx/rewind.wav" vol={0.7} />
  </YearClip>
);
