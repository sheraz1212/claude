import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, GREY, Person, SCARF, Stage, TAN} from '../common/sets';
import {Binoculars, BinoView, HomeRoom, Kite, ParkSunset, Savanna} from './sets';
import {PeekHead} from './Clip1';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 4 (35 s): he watches others of his kind. IMAGERY: the window becomes a savanna.
  1 0–4      MEDIUM at the window with binoculars          → the observer
  2 4–7.5    IMAGERY savanna, humans run in herds           → freedom out there
  3 7.5–11   POV binoculars: two friends laugh on a bench   → connection
  4 11–14.5  IMAGERY savanna: they gather and share food    → belonging
  5 14.5–18  CLOSE he lowers the binoculars, longing        → he wants it
  6 18–21.5  MEDIUM he waves at the window, nobody sees      → invisible
  7 21.5–25  POV binoculars: a kid flying a kite           → (sets up the twist)
  8 25–28.5  MEDIUM his hand on the window latch… stops     → fear wins
  9 28.5–32  WIDE he crawls back into the den              → retreat
  10 32–35   MEDIUM the den flap falls shut                 → "He stays behind."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

const AtWindow: React.FC<{t: number; bino?: boolean; wave?: number; latch?: number; expr?: object; s?: number; cx?: number}> = ({t, bino, wave = 0, latch = 0, expr = {}, s = 1.4, cx = 1300}) => (
  <Stage>
    <Cam s={s} cx={cx} cy={560}>
      <HomeRoom t={t} curtains={0.35} day={0.9} den={true} headOut={undefined} denGlow={0.4} />
      <Hero
        id="win"
        x={1420}
        y={FLOOR}
        back
        showLegs
        lHand={bino ? [-40, -380] : latch ? [-60, -200] : [-90, -110]}
        rHand={bino ? [40, -380] : wave ? [interpolate(wave, [0, 1], [90, 150]), interpolate(wave, [0, 1], [-110, -420]) + Math.sin(t * 14) * 12 * wave] : latch ? [interpolate(latch, [0, 1], [90, 130]), interpolate(latch, [0, 1], [-110, -330])] : [90, -110]}
        expr={expr}
      />
      {bino && [-1, 1].map((sg) => <rect key={sg} x={1420 + sg * 70 - 16} y={FLOOR - 420} width={32} height={40} rx={10} fill="#2a2d33" stroke={C.outline} strokeWidth={3} />)}
    </Cam>
  </Stage>
);

const Bench: React.FC<{t: number}> = ({t}) => (
  <ParkSunset t={t} kites={0}>
    <rect x={700} y={760} width={520} height={20} rx={6} fill="#2a2018" stroke={C.line} strokeWidth={3} />
    <Person id="bf1" x={840} y={840} color={GREY} accessory="scarf" accessoryColor={SCARF} lHand={[-60, -130]} rHand={[80, -170 + Math.sin(t * 8) * 10]} headTilt={Math.sin(t * 6) * 5} expr={{mouth: 1, eyeX: 12, lid: 0.3}} />
    <Person id="bf2" x={1080} y={840} color={TAN} accessory="headphones" accessoryColor="#e07b8a" lHand={[-80, -170]} rHand={[60, -130]} headTilt={Math.sin(t * 6 + 1) * 5} expr={{mouth: 1, eyeX: -12, lid: 0.3}} />
    <line x1={720} y1={780} x2={720} y2={FLOOR + 40} stroke={C.line} strokeWidth={5} />
    <line x1={1200} y1={780} x2={1200} y2={FLOOR + 40} stroke={C.line} strokeWidth={5} />
  </ParkSunset>
);

const shots = (t: number): React.ReactNode => {
  if (t < 4) return <AtWindow t={t} bino />;
  if (t < 7.5 || (t >= 11 && t < 14.5))
    return (
      <Stage>
        <Cam s={interpolate(t, t < 7.5 ? [4, 7.5] : [11, 14.5], [1.0, 1.05], cl)} cx={960} cy={600}>
          <Savanna t={t} />
          {t >= 11 && (
            <g>
              <ellipse cx={960} cy={830} rx={260} ry={40} fill="#5a8ab0" opacity={0.7} />
              {Array.from({length: 7}, (_, i) => (
                <g key={i} transform={`translate(${720 + i * 80} ${820 - Math.abs(Math.sin(t * 5 + i)) * 8}) scale(0.5)`}>
                  <ellipse cx={0} cy={-60} rx={60} ry={90} fill="#5a3a22" />
                  <circle cx={0} cy={-210} r={70} fill="#5a3a22" />
                </g>
              ))}
            </g>
          )}
        </Cam>
      </Stage>
    );
  if (t < 11 || (t >= 21.5 && t < 25))
    return (
      <Stage>
        <BinoView>
          <Cam s={1.1} cx={960} cy={560}>
            {t < 11 ? (
              <Bench t={t} />
            ) : (
              <ParkSunset t={t} kites={0}>
                <Kite x={1180 + Math.sin(t * 1.4) * 40} y={300 + Math.cos(t * 1.2) * 20} r={Math.sin(t * 1.7) * 14} />
                <line x1={1180 + Math.sin(t * 1.4) * 40} y1={360} x2={900} y2={FLOOR - 240} stroke="#e9e2c8" strokeWidth={2} />
                <Person id="kidk" x={880} y={FLOOR + 20} scale={0.62} showLegs walk={t * 8} color={TAN} accessory="bow" accessoryColor="#e07b8a" lHand={[-60, -150]} rHand={[90, -380]} expr={{mouth: 1, eyeX: 12, eyeY: -10}} />
              </ParkSunset>
            )}
          </Cam>
        </BinoView>
      </Stage>
    );
  if (t < 18) {
    const lower = interpolate(t, [14.8, 15.6], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <g opacity={0.45}>
          <HomeRoom t={t} curtains={0.35} day={0.9} den={false} />
        </g>
        <Hero id="long" x={1000} y={1080} scale={1.75} lHand={[-40, interpolate(lower, [0, 1], [-380, -120])]} rHand={[40, interpolate(lower, [0, 1], [-380, -120])]} expr={{brow: 0.5, lid: 0.1, mouth: -0.1, eyeX: 10, eyeY: -8}} blink={blinkAt(t, [17.0])} />
        {lower < 0.6 && <Binoculars x={1000} y={1080 - 400 * 1.75 + lower * 400} s={1.6} />}
      </Stage>
    );
  }
  if (t < 21.5) return <AtWindow t={t} wave={interpolate(t, [18.4, 19.0, 20.6, 21.2], [0, 1, 1, 0], cl)} s={1.25} />;
  if (t < 28.5) return <AtWindow t={t} latch={interpolate(t, [25.3, 26.2, 27.4, 28.2], [0, 1, 1, 0], {...cl, easing: io})} s={1.8} cx={1420} />;
  if (t < 32) {
    const x = interpolate(t, [28.5, 31.6], [1420, 900], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <HomeRoom t={t} curtains={0.35} day={0.8} denGlow={0.6} />
          <Hero id="ret" x={x} y={FLOOR + 30} scale={0.9} showLegs walk={t * 5} lean={-22} lHand={[-90, -40]} rHand={[60, -40]} expr={{brow: 0.6, mouth: -0.3, eyeX: -14, eyeY: 8}} />
        </Cam>
      </Stage>
    );
  }
  const flap = interpolate(t, [32.5, 33.3], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  return (
    <Stage>
      <Cam s={1.8} cx={860} cy={720}>
        <HomeRoom t={t} curtains={0.35} day={0.7} headOut={<PeekHead t={t} out={1 - flap} sleepy={0.4} />} denGlow={0.7} />
        <path d={`M 760 ${690 + 0} Q 860 ${690 - 10} 960 690 L 960 ${690 + flap * 170} Q 860 ${700 + flap * 170} 760 ${690 + flap * 170} Z`} fill="#3b4a6a" stroke={C.outline} strokeWidth={4} />
      </Cam>
    </Stage>
  );
};

export const WildClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(t)}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '0']]} />
      <Sequence from={sec(0.4)} durationInFrames={sec(3.4)}>
        <Caption text="He studies others of his **kind**." dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(4.3)} durationInFrames={sec(3.0)}>
        <Caption text="They move in **herds**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(11.3)} durationInFrames={sec(3.0)}>
        <Caption text="They share their **food**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(32.2)} durationInFrames={sec(2.7)}>
        <Caption text="He stays **behind**." dur={sec(2.7)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/doc-flute.wav" vol={0.45} dur={14.5} />
      <Sfx at={14.5} src="music/small-sad.wav" vol={0.45} />
      <Sfx at={21.5} src="music/kite-rise.wav" vol={0.35} dur={3.6} />
      <Sfx at={25.2} src="music/low-note.wav" vol={0.5} />
      <Sfx at={28.6} src="music/lonely-pad.wav" vol={0.4} dur={6.4} />
      {/* SFX */}
      <Sfx at={0.5} src="sfx/binocular.wav" vol={0.5} />
      <Sfx at={4.2} src="sfx/far-cheer.wav" vol={0.35} />
      <Sfx at={7.7} src="sfx/soft-laugh.wav" vol={0.45} />
      <Sfx at={11.4} src="sfx/group-laugh.wav" vol={0.35} />
      <Sfx at={18.5} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={21.7} src="sfx/kite-flutter.wav" vol={0.4} />
      <Sfx at={25.6} src="sfx/key-tap.wav" vol={0.3} />
      <Sfx at={28.7} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={33.0} src="sfx/bag-thud.wav" vol={0.35} />
    </AbsoluteFill>
  );
};
