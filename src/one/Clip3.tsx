import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {Cam, Light, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Blanket, FLOOR_Y, PhonePOV, Room, YEL, YEL_L} from './sets';
import {BlanketGlow, LyingBed, OnBed} from './Clip1';

/*
 ONE MORE VIDEO - Clip 3 (33 s)   MUSIC: pad + pedal chords; drone when he falls;
                                  20-33 FAST HORROR run ending on a drum hit + clap
  0-8    WIDE his room: phone face down on the nightstand, light off, he hides under the blanket   "Not tonight."
  8-14   same shot, 23:30 - the demon rises: "just one time."
  14-20  MEDIUM his hand comes out of the blanket to the phone; dark-yellow glow fills the room
  20-33  FAST MONTAGE: the same bed shot again and again + phone inserts, clock spinning, counter 1 -> 63
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLOCKS = ['00:40', '01:55', '02:50', '03:35', '04:20', '05:10'];

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 3.2) {
    const put = interpolate(t, [0.6, 1.6], [0, 1], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={760} cy={620} dy={-40}>
          <Room t={t} time="23:00" />
          <Hero id="hp" x={640} y={790} scale={0.8} sit pose="arms-down" rHand={[95 + put * 330, -205 + put * 140]} rHold={put < 1 ? 'phone' : 'none'}
            expr={{brow: 0.5, lid: 0.2, mouth: -0.2, eyeX: 16 * put, eyeY: 8, bags: true}} />
          {put >= 1 && <rect x={1050} y={728} width={52} height={12} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />}
        </Cam>
      </Stage>
    );
  }
  if (t < 14) {
    const rise = interpolate(t, [8.4, 9.6], [0, 1], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={760} cy={620} dy={-40}>
          <Room t={t} time={t < 8 ? '23:00' : '23:30'} />
          <rect x={1050} y={728} width={52} height={12} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />
          {t > 8.3 && (
            <g opacity={rise}>
              <Demon id="dm" x={1240} y={FLOOR_Y + (1 - rise) * 200} t={t} scale={0.8} size={1.0} lean={-12} headTilt={-12} expr={{eyeX: -18, eyeY: 12, mouth: 0.6}} />
            </g>
          )}
          <Blanket t={t} />
        </Cam>
      </Stage>
    );
  }
  if (t < 20) {
    const hand = interpolate(t, [14.4, 16.2], [0, 1], cl);
    const glow = interpolate(t, [16.2, 17.2], [0, 1], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.7} cx={900} cy={660} dy={-20}>
          <Room t={t} time="23:31" phoneOnTable={glow} />
          {glow <= 0 && <rect x={1050} y={728} width={52} height={12} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />}
          <Blanket t={t} hand={hand} />
          <Light id="fillY" x={1000} y={600} r={1100} color={YEL} o={0.35 * glow} />
        </Cam>
      </Stage>
    );
  }
  // 20-33 montage: cut every ~1.6 s between the bed shot (time moves) and the phone
  const k = Math.floor((t - 20) / 1.6);
  if (k % 2 === 1) return <Stage><PhonePOV t={t} seed={k} /></Stage>;
  const tired = Math.min(1, 0.4 + k * 0.1);
  return (
    <Stage bg="#0d0c11">
      <Cam s={1.0 + (k % 4) * 0.08} cx={700} cy={560} dy={-20}>
        <Room t={t} time={CLOCKS[Math.min(CLOCKS.length - 1, Math.floor(k / 2))]} moon={k < 8} />
        {(k / 2) % 3 === 0 && <OnBed t={t} id={`hm${k}`} tired={tired} expr={{brow: 0.3, lid: 0.15 + tired * 0.2, mouth: 0.1, eyeX: 14, eyeY: 8}} />}
        {(k / 2) % 3 === 1 && <LyingBed t={t} id={`hm${k}`} tired={tired} />}
        {(k / 2) % 3 === 2 && <BlanketGlow t={t} />}
      </Cam>
    </Stage>
  );
};

export const OneClip3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const counts: [number, string][] = [[0, '0'], [sec(16.4), '1']];
  ['3', '6', '10', '14', '19', '27', '33', '40', '48', '55', '63'].forEach((c, i) => counts.push([sec(20 + i * 1.15), c]));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="VIDEOS" showFrom={0} changes={counts} />
      <Sequence from={sec(3.6)} durationInFrames={sec(4.2)}>
        <Caption text="Not **tonight**." dur={sec(4.2)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(9.6)} durationInFrames={sec(3.6)}>
        <DemonSay text="just one time." x={1300} y={300} dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(28.0)} durationInFrames={sec(4.8)}>
        <Caption text="One became **hundreds**." dur={sec(4.8)} highlight={YEL_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/room-tone.wav" vol={0.35} dur={20} />
      <Sfx at={1.4} src="sfx/cup-tap.wav" vol={0.35} />
      <Sfx at={2.2} src="sfx/lamp-click.wav" vol={0.45} />
      <Sfx at={3.3} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={8.4} src="sfx/demon-8bit-2.wav" vol={0.55} />
      <Sfx at={9.7} src="sfx/voice/inner-just-one-time.wav" vol={0.75} />
      <Sfx at={14.4} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={16.2} src="sfx/phone-tap.wav" vol={0.5} />
      <Sfx at={16.5} src="sfx/heartbeat.wav" vol={0.35} dur={3.4} fadeOut={0.6} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Sfx key={i} at={20.2 + i * 1.6} src="sfx/scroll-tick.wav" vol={0.25} />)}
    </AbsoluteFill>
  );
};
