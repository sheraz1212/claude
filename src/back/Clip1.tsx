import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {Apartment, Cake, RewindFX, YearHUD} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Backwards — Clip 1 (35 s): 2031, his birthday, alone. Then the first REWIND.
  1  0–4      black hook                                      → curiosity
  2  4–8      WIDE dark apartment, he sits alone on the sofa   → loneliness
  3  8–11.5   INSERT the cake with one candle                  → it's his birthday
  4  11.5–15  MEDIUM, he lights the candle, glances at phone   → hoping someone remembers
  5  15–18.5  POV phone: no messages; old chat "Coffee tomorrow?" (2026) unanswered → the seed
  6  18.5–22  CLOSE (head+shoulders), it hits him               → regret
  7  22–25.5  MEDIUM, he blows out the candle                    → no wish
  8  25.5–29  WIDE, smoke curls in the dark room                 → emptiness
  9  29–31.5  CLOSE, he closes his eyes                          → "what if..."
  10 31.5–35  REWIND: smoke flows back into the candle, 2031 → 2030 → the film starts going back
 MUSIC: lonely music box (4–16), low note (18.5), music box again (25.5), rewind sound.
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const LONELY = {brow: 0.7, lid: 0.35, mouth: -0.3, eyeY: 8, bags: true};

const Room: React.FC<{t: number; lit: number; smoke: number; shot: 'wide' | 'medium' | 'blow' | 'smoke'}> = ({t, lit, smoke, shot}) => {
  const cam = shot === 'wide' ? {s: interpolate(t, [4, 8], [1.0, 1.04], cl), cx: 800, cy: 560} : shot === 'smoke' ? {s: 1.0, cx: 800, cy: 560} : {s: 1.6, cx: 720, cy: 620};
  const lean = shot === 'blow' ? interpolate(t, [23.0, 23.6], [0, 1], {...cl, easing: io}) : 0;
  return (
    <Stage>
      <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
        <Apartment t={t} lamp={0.6} front={<Cake x={700} y={800} s={0.7} candles={1} lit={lit} t={t} smoke={smoke} />}>
          <Hero
            id="b1h"
            x={700}
            y={790}
            lean={lean * 6}
            lHand={shot === 'medium' && t < 13.5 ? [60, -120] : [-70, -120]}
            rHand={[70, -120]}
            expr={shot === 'medium' ? {...LONELY, eyeX: t > 13.6 ? 14 : 0, eyeY: 14, lid: 0.2} : shot === 'blow' ? {...LONELY, mouth: lean > 0.3 ? -0.8 : -0.3, eyeY: 14} : LONELY}
            blink={blinkAt(t, [6.4, 14.4, 27.5])}
          />
        </Apartment>
      </Cam>
    </Stage>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) return <Room t={t} lit={0} smoke={0} shot="wide" />;
  if (t < 11.5)
    return (
      <Stage bg="#0c0d10">
        <Cam s={interpolate(t, [8, 11.5], [1.0, 1.06], cl)} cx={960} cy={600}>
          <Light id="ci" x={960} y={500} r={700} color={C.cold} o={0.25} />
          <rect x={500} y={760} width={920} height={30} rx={8} fill="#1d2026" stroke={C.line} strokeWidth={4} />
          <Cake x={960} y={760} s={2.4} candles={1} lit={0} t={t} />
        </Cam>
      </Stage>
    );
  if (t < 15) return <Room t={t} lit={interpolate(t, [12.4, 12.8], [0, 1], cl)} smoke={0} shot="medium" />;
  if (t < 18.5)
    return (
      <Stage>
        <Light id="pv" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <text x={960} y={260} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#8a93a3">
            No new messages
          </text>
          <line x1={780} y1={300} x2={1140} y2={300} stroke="#c9d1de" strokeWidth={2} />
          <text x={960} y={560} textAnchor="middle" fontFamily="Nunito" fontWeight={700} fontSize={20} fill="#8a93a3">
            June 2026
          </text>
          <circle cx={800} cy={620} r={22} fill="#a6a9b0" />
          <rect x={832} y={592} width={230} height={58} rx={18} fill="#d8dde6" />
          <text x={848} y={630} fontFamily="Nunito" fontWeight={800} fontSize={24} fill="#1d2027">
            Coffee tomorrow?
          </text>
          <text x={1140} y={690} textAnchor="end" fontFamily="Nunito" fontWeight={700} fontSize={18} fill="#c0392b" opacity={interpolate(t, [16.6, 17.2], [0, 1], cl)}>
            Not answered
          </text>
        </PhonePOV>
      </Stage>
    );
  if (t < 22 || (t >= 29 && t < 31.5)) {
    const hit = t < 22 ? interpolate(t, [18.8, 20.0], [0, 1], cl) : 1;
    const close = t >= 29 ? interpolate(t, [29.4, 30.4], [0, 1], cl) : 0;
    return (
      <Stage>
        <g opacity={0.45}>
          <Apartment t={t} lamp={0.4} />
        </g>
        <Light id="cf" x={1000} y={900} r={600} color={C.amber} o={t < 22 ? 0.5 : 0} />
        <Hero id="b1c" x={1000} y={1080} scale={1.75} pose="arms-down" expr={{brow: 0.5 + hit * 0.5, lid: close, mouth: -0.2 - hit * 0.4, eyeY: 6, bags: true, tear: hit * 0.8}} blink={t < 22 ? blinkAt(t, [21.3]) : 0} />
      </Stage>
    );
  }
  if (t < 25.5) return <Room t={t} lit={interpolate(t, [23.5, 23.8], [1, 0], cl)} smoke={interpolate(t, [23.7, 25.5], [0, 1], cl)} shot="blow" />;
  if (t < 29) return <Room t={t} lit={0} smoke={interpolate(t, [25.5, 29], [1, 1.6], cl)} shot="smoke" />;
  // 10 — REWIND: the smoke flows back into the candle, the flame comes back
  const tr = interpolate(t, [31.5, 35], [25.5, 22.2], cl);
  return <Room t={tr} lit={interpolate(tr, [23.5, 23.8], [1, 0], cl)} smoke={interpolate(tr, [23.7, 25.5], [0, 1], cl)} shot="blow" />;
};

export const BackClip1: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const rw = interpolate(t, [31.5, 35], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      {t >= 4.4 && <YearHUD year={t < 33.2 ? '2031' : '2030'} flash={t > 33.2 ? interpolate(t, [33.2, 34], [1, 0], cl) : 0} />}
      <RewindFX p={rw} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="This is where it ends." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(4.6)} durationInFrames={sec(3.2)}>
        <Caption text="His birthday. Nobody **came**." dur={sec(3.2)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(25.8)} durationInFrames={sec(3.0)}>
        <Caption text="He wondered **when** it started." dur={sec(3.0)} />
      </Sequence>
      {/* MUSIC cues */}
      <Sfx at={4.0} src="music/music-box-lonely.wav" vol={0.5} dur={11.5} />
      <Sfx at={18.6} src="music/low-note.wav" vol={0.55} />
      <Sfx at={25.6} src="music/music-box-lonely.wav" vol={0.35} dur={5.8} />
      {/* SFX */}
      <Sfx at={5.0} src="sfx/far-siren.wav" vol={0.5} />
      <Sfx at={12.3} src="sfx/lighter.wav" vol={0.6} />
      <Sfx at={13.8} src="sfx/cloth.wav" vol={0.3} />
      <Sfx at={23.4} src="sfx/candle-blow.wav" vol={0.7} />
      <Sfx at={31.5} src="sfx/rewind.wav" vol={0.7} />
    </AbsoluteFill>
  );
};
