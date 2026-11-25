import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {FRIENDS} from './canteen';
import {BridgeModel, Corridor} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Clip 5 (35 s): the low point and the tiny decision. MUSIC: sad-piano-2 (0–28) → orchestra-swell (28.5, impact 30.5).
  1  0–5     WIDE empty corridor, he sits alone          → silence, loneliness (held longer: big emotion)
  2  5–8.5   CLOSE, a tear                               → pain
  3  8.5–12  MEDIUM, the phone on his lap lights up      → the same friend again
  4  12–16   POV message: "print my slides too?"         → the ask
  5  16–19.5 POV, his thumb types "Sure."                → habit
  6  19.5–23 CLOSE, he stops                             → doubt
  7  23–26   MEDIUM, he looks at the dried glue on his hand → what it cost
  8  26–28.5 MEDIUM-WIDE, broken bridge, closed door     → the proof
  9  28.5–32 POV, he deletes "Sure." letter by letter    → the turning point
  10 32–35   CLOSE, calm, decided                        → change begins
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Bg: React.FC = () => (
  <g opacity={0.45}>
    <Corridor closed />
  </g>
);

const Typing: React.FC<{t: number; typed: string}> = ({t, typed}) => (
  <Stage>
    <Light id="pov5" x={960} y={560} r={700} color={C.cold} o={0.6} />
    <PhonePOV px={960} py={560}>
      <circle cx={800} cy={300} r={22} fill={FRIENDS[0].color} />
      <rect x={832} y={270} width={300} height={90} rx={18} fill="#d8dde6" />
      <text x={848} y={307} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#1d2027">
        Can you print my
      </text>
      <text x={848} y={337} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#1d2027">
        slides too?
      </text>
      <rect x={770} y={820} width={300} height={56} rx={28} fill="#fff" stroke="#c9d1de" strokeWidth={3} />
      <text x={792} y={858} fontFamily="Nunito" fontWeight={800} fontSize={28} fill="#1d2027">
        {typed}
        {(t * 2) % 1 < 0.5 ? '|' : ''}
      </text>
      <circle cx={1110} cy={848} r={28} fill={typed ? '#5b8fe0' : '#c9d1de'} />
      <path d="M 1098 836 L 1124 848 L 1098 860 Z" fill="#fff" />
    </PhonePOV>
  </Stage>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 5)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 5], [1.0, 1.06], cl)} cx={860} cy={580}>
          <Corridor closed>
            <Hero id="b1" x={800} y={800} lHand={[-80, -110]} rHand={[80, -110]} headTilt={10} expr={{brow: 0.9, lid: 0.4, mouth: -0.5, eyeY: 10, bags: true}} blink={blinkAt(t, [3.0])} />
            <BridgeModel x={800} y={720} s={0.6} built={0.8} broken />
          </Corridor>
        </Cam>
      </Stage>
    );
  if (t < 8.5 || (t >= 19.5 && t < 23) || t >= 32) {
    const shot = t < 8.5 ? 2 : t < 23 ? 6 : 10;
    const tear = shot === 2 ? interpolate(t, [5.5, 8.0], [0, 1], cl) : 0;
    const calm = shot === 10 ? interpolate(t, [32.3, 33.5], [0, 1], cl) : 0;
    return (
      <Stage>
        <Bg />
        <Light id="c5l" x={1000} y={900} r={700} color={shot === 10 ? C.amber : C.cold} o={shot === 10 ? 0.5 * calm : 0.5} />
        <Hero
          id="b2"
          x={1000}
          y={1080}
          scale={1.75}
          pose={shot === 6 ? 'phone' : 'arms-down'}
          glow={shot === 6 ? 0.7 : 0}
          headTilt={shot === 2 ? 6 : 0}
          expr={shot === 2 ? {brow: 1.0, lid: 0.3, mouth: -0.6, eyeY: 6, tear} : shot === 6 ? {brow: 0.5, lid: 0.1, mouth: -0.1, eyeY: 4} : {brow: -0.3 * calm, lid: 0.15, mouth: 0.3 * calm, eyeY: -2, tear: 0.4}}
          blink={blinkAt(t, [21.6, 33.0])}
        />
      </Stage>
    );
  }
  if (t < 12) {
    const lit = t > 9.2;
    return (
      <Stage>
        <Cam s={1.7} cx={800} cy={600}>
          <Corridor closed>
            <Hero id="b3" x={800} y={800} lHand={[-80, -110]} rHand={[80, -110]} headTilt={8} expr={{brow: 0.6, lid: 0.2, mouth: -0.3, eyeY: 12}} blink={blinkAt(t, [11.0])} />
            <BridgeModel x={800} y={720} s={0.6} built={0.8} broken />
            <rect x={740} y={690} width={44} height={22} rx={5} fill={lit ? '#e9eef7' : '#14171c'} stroke={C.outline} strokeWidth={3} />
            {lit && <Light id="b3g" x={762} y={680} r={200} color={C.cold} o={0.9} />}
          </Corridor>
        </Cam>
      </Stage>
    );
  }
  if (t < 16) return <Typing t={t} typed="" />;
  if (t < 19.5) {
    const n = Math.floor(interpolate(t, [16.4, 18.6], [0, 5.99], cl));
    return <Typing t={t} typed={'Sure.'.slice(0, n)} />;
  }
  if (t < 26) {
    return (
      <Stage>
        <Bg />
        <Hero id="b7" x={1000} y={1080} scale={1.75} lHand={[-150, -330]} rHand={[80, -110]} headTilt={-6} expr={{brow: 0.5, lid: 0.1, mouth: -0.2, eyeX: -14, eyeY: 2}} blink={blinkAt(t, [25.2])} />
        {/* dried glue drops on his mitten */}
        {[[-158, -350], [-140, -318], [-170, -322]].map(([gx, gy], i) => (
          <ellipse key={i} cx={1000 + gx * 1.75} cy={1080 + gy * 1.75} rx={9} ry={6} fill="#f6f3ea" stroke="#b9b2a0" strokeWidth={2} />
        ))}
      </Stage>
    );
  }
  if (t < 28.5)
    return (
      <Stage>
        <Cam s={1.15} cx={1000} cy={600}>
          <Corridor closed>
            <Hero id="b8" x={800} y={800} lHand={[-80, -110]} rHand={[80, -110]} headTilt={6} expr={{brow: 0.4, lid: 0.15, mouth: -0.2, eyeX: 14, eyeY: -2}} blink={blinkAt(t, [27.6])} />
            <BridgeModel x={800} y={720} s={0.6} built={0.8} broken />
          </Corridor>
        </Cam>
      </Stage>
    );
  const n = Math.max(0, 5 - Math.floor(interpolate(t, [29.0, 30.5], [0, 5.99], cl)));
  return <Typing t={t} typed={'Sure.'.slice(0, n)} />;
};

export const YesClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '22'], [sec(30.6), '22 · NO 1']]} />
      <Sequence from={sec(32.3)} durationInFrames={sec(2.7)}>
        <Caption text="This time, he didn't **send**." dur={sec(2.7)} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/sad-piano-2.wav" vol={0.6} dur={28.5} />
      <Sfx at={28.5} src="music/orchestra-swell.wav" vol={0.8} />
      {/* SFX */}
      <Sfx at={9.2} src="sfx/phone-buzz.wav" vol={0.6} />
      <Sfx at={12.2} src="sfx/msg-pop-1.wav" vol={0.5} />
      {[16.4, 16.85, 17.3, 17.75, 18.2].map((s) => (
        <Sfx key={s} at={s} src="sfx/key-tap.wav" vol={0.5} />
      ))}
      {[29.0, 29.3, 29.6, 29.9, 30.2].map((s) => (
        <Sfx key={s} at={s} src="sfx/key-tap.wav" vol={0.45} />
      ))}
    </AbsoluteFill>
  );
};
