import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, GREY, Light, Person, SCARF, Stage, TAN} from '../common/sets';
import {ChipBag, HomeRoom, Kite, ParkSunset, StreetPlains} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 7 (35 s): the migration. MUSIC: migration-theme (final hit on the lesson card).
  1 0–4      WIDE golden street, he walks beside the kid with the kite  → "The migration begins."
  2 4–7.5    MEDIUM a neighbour waves; he waves back, first time         → connection
  3 7.5–11   WIDE the park at sunset: kites, people                     → the herd's territory
  4 11–14.5  MEDIUM the kid hands him the string; he flies the kite      → joy
  5 14.5–18  WIDE two young adults wave him over                         → invitation
  6 18–21.5  MEDIUM they sit on the grass sharing snacks (mirror of foraging) → he belongs
  7 21.5–25  IMAGERY his room, empty den folded, sun pouring in, a plant blooms → his world changed
  8 25–28    WIDE silhouettes with kites against the sun                 → "He found his herd."
  9 28–30    CLOSE he laughs                                             → happiness
  10 30–35   black lesson card
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const KID = {color: TAN, accessory: 'bow' as const, accessoryColor: '#e07b8a'};

const shots = (t: number): React.ReactNode => {
  if (t < 7.5) {
    const two = t >= 4;
    const x = two ? 820 : interpolate(t, [0, 4], [300, 760], cl);
    const wave = two ? interpolate(t, [4.6, 5.2], [0, 1], cl) : 0;
    return (
      <Stage>
        <Cam s={two ? 1.45 : 1.0} cx={two ? 1000 : 960} cy={600}>
          <StreetPlains t={t}>
            <Hero id="w1" x={x} y={FLOOR} showLegs walk={!two ? t * 6 : undefined} lHand={[-90, -110]} rHand={two ? [interpolate(wave, [0, 1], [90, 140]), interpolate(wave, [0, 1], [-110, -420]) + Math.sin(t * 12) * 12 * wave] : [90, -110]} expr={{mouth: 0.8, eyeX: 12, brow: -0.1}} />
            <Person id="kidw" x={x + 200} y={FLOOR} scale={0.62} showLegs walk={!two ? t * 8 : undefined} color={KID.color} accessory={KID.accessory} accessoryColor={KID.accessoryColor} lHand={[-60, -150]} rHand={[90, -300]} expr={{mouth: 1, eyeX: -10, eyeY: -6}} />
            <Kite x={x + 200 + 60} y={FLOOR - 340} s={0.6} r={20} />
            {two && <Person id="nb" x={1260} y={FLOOR} showLegs color={GREY} accessory="glasses" lHand={[-140, -400 + Math.sin(t * 12) * 12]} rHand={[90, -110]} expr={{mouth: 1, eyeX: -12}} />}
          </StreetPlains>
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5) {
    const shot = t < 11 ? 3 : t < 14.5 ? 4 : t < 18 ? 5 : 6;
    const cam = shot === 3 ? {s: 1.0, cx: 960} : shot === 4 ? {s: 1.5, cx: 900} : shot === 5 ? {s: 1.1, cx: 1060} : {s: 1.55, cx: 1000};
    const pull = Math.sin(t * 2.4) * 10;
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={600}>
          <ParkSunset t={t} kites={shot === 3 ? 2 : 1}>
            {shot <= 5 && (
              <>
                <Hero id="pk" x={860} y={FLOOR + 20} showLegs lHand={[-90, -110]} rHand={shot >= 4 ? [130, -380 + pull] : [90, -110]} expr={{mouth: 1, eyeX: shot === 5 ? 14 : 10, eyeY: shot === 4 ? -12 : 0, lid: shot === 4 ? 0.3 : 0}} blink={blinkAt(t, [9.2, 16.8])} />
                {shot >= 4 && (
                  <>
                    <line x1={860 + 130} y1={FLOOR + 20 - 380 + pull} x2={1240 + Math.sin(t * 1.3) * 40} y2={300} stroke="#e9e2c8" strokeWidth={2} />
                    <Kite x={1240 + Math.sin(t * 1.3) * 40} y={260 + Math.cos(t * 1.1) * 25} r={Math.sin(t * 1.7) * 14} />
                  </>
                )}
                <Person id="kidp" x={660} y={FLOOR + 20} scale={0.62} showLegs color={KID.color} accessory={KID.accessory} accessoryColor={KID.accessoryColor} lHand={[-60, -150]} rHand={[90, -330]} expr={{mouth: 1, eyeX: 12, eyeY: -10}} />
                {shot === 5 && (
                  <>
                    <Person id="ya1" x={1320} y={FLOOR + 20} showLegs color={GREY} accessory="scarf" accessoryColor={SCARF} lHand={[-150, -400 + Math.sin(t * 10) * 14]} rHand={[90, -110]} expr={{mouth: 1, eyeX: -12}} />
                    <Person id="ya2" x={1520} y={FLOOR + 20} showLegs color={TAN} accessory="headphones" accessoryColor="#6f8fb0" pose="arms-down" expr={{mouth: 1, eyeX: -12}} />
                  </>
                )}
              </>
            )}
            {shot === 6 && (
              <>
                <ellipse cx={1000} cy={FLOOR + 40} rx={420} ry={40} fill="#e07b8a" opacity={0.6} />
                <Person id="s1" x={760} y={FLOOR - 30} color={GREY} accessory="scarf" accessoryColor={SCARF} lHand={[-60, -130]} rHand={[80, -170]} headTilt={Math.sin(t * 6) * 5} expr={{mouth: 1, eyeX: 12, lid: 0.3}} />
                <Hero id="s2" x={1000} y={FLOOR - 30} lHand={[-60, -130]} rHand={[60, -160 + Math.abs(Math.sin(t * 4)) * 30]} headTilt={Math.sin(t * 6 + 1) * 5} expr={{mouth: 1, eyeX: 0, lid: 0.3}} />
                <Person id="s3" x={1240} y={FLOOR - 30} color={TAN} accessory="headphones" accessoryColor="#6f8fb0" lHand={[-80, -170]} rHand={[60, -130]} headTilt={Math.sin(t * 6 + 2) * 5} expr={{mouth: 1, eyeX: -12, lid: 0.3}} />
                <ChipBag x={1000} y={FLOOR + 10} s={0.6} r={-8} />
                <ChipBag x={1120} y={FLOOR + 16} s={0.5} c={C.teal} r={10} />
              </>
            )}
          </ParkSunset>
        </Cam>
      </Stage>
    );
  }
  if (t < 25)
    return (
      <Stage>
        <Cam s={interpolate(t, [21.5, 25], [1.0, 1.05], cl)} cx={960} cy={560}>
          <HomeRoom t={t} curtains={0} day={1} den={false} />
          <rect x={640} y={820} width={440} height={50} rx={16} fill="#3b4a6a" stroke={C.outline} strokeWidth={4} />
          <rect x={660} y={790} width={400} height={34} rx={14} fill="#56688c" stroke={C.outline} strokeWidth={3} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={300 + k * 18} cy={140 - k * 22} r={interpolate(t, [22, 24], [0, 12], cl)} fill="#e07b8a" />
          ))}
          <Light id="sunroom" x={1420} y={300} r={1300} color={C.amber} o={0.6} />
        </Cam>
      </Stage>
    );
  if (t < 28)
    return (
      <Stage>
        <ParkSunset t={t} kites={3}>
          {[500, 760, 1000, 1240, 1480].map((x, i) => (
            <Person key={x} id={`sil${i}`} x={x} y={FLOOR + 20} showLegs color="#2a2030" lHand={[-90, i % 2 ? -380 : -110]} rHand={[90, i % 2 ? -110 : -380]} expr={{mouth: 0.8}} />
          ))}
        </ParkSunset>
      </Stage>
    );
  return (
    <Stage>
      <g opacity={0.5}>
        <ParkSunset t={t} kites={1} />
      </g>
      <Light id="laugh" x={1100} y={600} r={900} color={C.amber} o={0.8} />
      <Hero id="laughH" x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={Math.sin(t * 8) * 4} expr={{mouth: 1, lid: 0.45, brow: -0.2}} />
    </Stage>
  );
};

export const WildClip7: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 30 && shots(t)}
      <FilmLook />
      {t < 30 && <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '1'], [sec(4.8), '2'], [sec(7.6), '7'], [sec(15), '12'], [sec(25), '∞']]} />}
      <Sequence from={sec(0.4)} durationInFrames={sec(3.4)}>
        <Caption text="The migration **begins**." dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(18.3)} durationInFrames={sec(3.0)}>
        <Caption text="He shares his **food**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(25.2)} durationInFrames={sec(2.7)}>
        <Caption text="He found his **herd**." dur={sec(2.7)} />
      </Sequence>
      <Sequence from={sec(30)} durationInFrames={sec(5)}>
        <BlackCard text="Leave the den." dur={sec(5)} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0.4} src="music/migration-theme.wav" vol={0.6} />
      {/* SFX */}
      <Sfx at={0.2} src="sfx/footsteps.wav" vol={0.35} />
      <Sfx at={4.7} src="sfx/soft-laugh.wav" vol={0.35} />
      <Sfx at={7.6} src="sfx/birds.wav" vol={0.4} />
      <Sfx at={11.2} src="sfx/kite-flutter.wav" vol={0.5} />
      <Sfx at={15.0} src="sfx/group-laugh.wav" vol={0.4} />
      <Sfx at={18.4} src="sfx/crunch.wav" vol={0.45} />
      <Sfx at={19.6} src="sfx/group-laugh.wav" vol={0.4} />
      <Sfx at={21.6} src="sfx/bird-single.wav" vol={0.45} />
      <Sfx at={25.0} src="sfx/far-cheer.wav" vol={0.35} />
      <Sfx at={28.1} src="sfx/soft-laugh.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
