import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Stage} from '../common/sets';
import {ChipBag, HomeRoom, Kitchen} from './sets';
import {CaveDen, PeekHead} from './Clip1';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 2 (35 s): night foraging. MUSIC: pizz-comic (sneaky) with a "holy" fridge chord.
  1 0–4      WIDE the room at night, den glowing          → "At night, he forages."
  2 4–7.5    MEDIUM he creeps out of the den, low and slow   → animal behaviour
  3 7.5–11   WIDE kitchen, moonlight, he tiptoes            → the hunt
  4 11–14.5  MEDIUM the fridge opens: a heavenly light       → "The watering hole."
  5 14.5–18  MEDIUM he grabs an armful of snacks             → the catch
  6 18–21.5  CLOSE crunching, crumbs flying                  → comedy
  7 21.5–25  WIDE he scurries back, a trail of crumbs        → the retreat
  8 25–28.5  IMAGERY inside the cave: wrappers piled like treasure around the phone-fire → his hoard
  9 28.5–32  CLOSE he yawns in the glow                      → tired, still scrolling
  10 32–35   WIDE grey dawn at the window, den still glowing → "He returns before dawn."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const SNEAK = {brow: -0.2, lid: 0, mouth: 0.1, eyeX: 12};

const shots = (t: number): React.ReactNode => {
  if (t < 4)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 4], [1.0, 1.03], cl)} cx={960} cy={560}>
          <HomeRoom t={t} curtains={1} day={0} headOut={<PeekHead t={t} out={0} />} denGlow={1} />
        </Cam>
      </Stage>
    );
  if (t < 7.5) {
    const x = interpolate(t, [4.2, 7.3], [860, 1300], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.5} cx={1060} cy={680}>
          <HomeRoom t={t} curtains={1} day={0} denGlow={0.8}>
            <></>
          </HomeRoom>
          <Hero id="cr" x={x} y={FLOOR + 30} scale={0.9} showLegs walk={t * 5} lean={24} lHand={[-60, -40]} rHand={[90, -40]} expr={{...SNEAK, eyeX: 14, eyeY: -4}} blink={blinkAt(t, [6.4])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 11) {
    const x = interpolate(t, [7.5, 11], [300, 1050], cl);
    const tip = Math.abs(Math.sin(t * 5)) * 18;
    return (
      <Stage>
        <Kitchen t={t}>
          <Hero id="tip" x={x} y={FLOOR - tip} showLegs walk={t * 5} lHand={[-90, -260]} rHand={[90, -260]} expr={{...SNEAK, eyeX: 14}} />
        </Kitchen>
      </Stage>
    );
  }
  if (t < 18) {
    const open = interpolate(t, [11.3, 12.0], [0, 1], {...cl, easing: io});
    const grab = t >= 14.5 ? interpolate(t, [14.8, 16.2], [0, 1], {...cl, easing: io}) : 0;
    return (
      <Stage>
        <Cam s={1.35} cx={1250} cy={560}>
          <Kitchen t={t} open={open}>
            <Hero id="fr" x={1080} y={FLOOR} showLegs lHand={grab ? [-60, -170] : [-90, -360 + open * 40]} rHand={grab ? [60, -170] : [90, -360 + open * 40]} expr={{brow: -0.4, lid: 0, mouth: open > 0.5 ? 0.9 : 0.3, eyeX: 14, eyeY: -4}} glow={open * 0.6} glowColor="#f2f0e6" blink={blinkAt(t, [13.6])} />
            {grab > 0 && (
              <g>
                <ChipBag x={1040} y={FLOOR - 230 + (1 - grab) * -80} s={0.7} r={-10} />
                <ChipBag x={1110} y={FLOOR - 240 + (1 - grab) * -60} s={0.65} c={C.teal} r={12} />
                <ChipBag x={1080} y={FLOOR - 300 + (1 - grab) * -40} s={0.6} c={C.amber} r={-4} />
              </g>
            )}
          </Kitchen>
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5) {
    const chew = Math.abs(Math.sin(t * 14));
    return (
      <Stage>
        <g opacity={0.5}>
          <Kitchen t={t} open={1} />
        </g>
        <Light id="chewL" x={1300} y={500} r={800} color="#f2f0e6" o={0.4} />
        <Hero id="chew" x={1000} y={1080} scale={1.75} lHand={[-40, -260]} rHand={[90, -140]} expr={{brow: -0.2, lid: 0.3, mouth: chew > 0.5 ? 0.6 : -0.2, eyeX: 6}} blink={blinkAt(t, [20.2])} />
        <ChipBag x={1000 + 90 * 1.75} y={1080 - 140 * 1.75 - 40} s={1.4} r={10} />
        {Array.from({length: 12}, (_, i) => {
          const p = ((t * 2 + i * 0.37) % 1);
          return <circle key={i} cx={1000 + Math.sin(i * 7) * 90 + p * (i % 2 ? 140 : -140)} cy={520 + p * 400} r={6} fill="#f2c27a" opacity={1 - p} />;
        })}
      </Stage>
    );
  }
  if (t < 25) {
    const x = interpolate(t, [21.5, 25], [1300, 250], cl);
    return (
      <Stage>
        <Kitchen t={t}>
          {Array.from({length: 14}, (_, i) => (x < 1300 - i * 80 ? <circle key={i} cx={1300 - i * 80} cy={FLOOR + 6} r={6} fill="#f2c27a" /> : null))}
          <Hero id="run" x={x} y={FLOOR} showLegs walk={t * 12} lHand={[-60, -170]} rHand={[60, -170]} expr={{...SNEAK, eyeX: -14}} />
          <ChipBag x={x} y={FLOOR - 210} s={0.7} r={-6} />
          <ChipBag x={x + 40} y={FLOOR - 250} s={0.6} c={C.teal} r={10} />
        </Kitchen>
      </Stage>
    );
  }
  if (t < 28.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [25, 28.5], [1.0, 1.06], cl)} cx={960} cy={700}>
          <CaveDen t={t}>
            {Array.from({length: 16}, (_, i) => (
              <ChipBag key={i} x={620 + (i % 8) * 95} y={930 - Math.floor(i / 8) * 70 + Math.abs(3.5 - (i % 8)) * 10} s={0.6} c={['#e07b8a', C.teal, C.amber, '#8a4a4a'][i % 4]} r={(i * 37) % 40 - 20} />
            ))}
            <Hero id="hoard" x={960} y={820} scale={0.85} lHand={[-60, -150]} rHand={[60, -150]} expr={{brow: -0.2, lid: 0.2, mouth: 0.8, eyeY: 12}} glow={1} />
          </CaveDen>
        </Cam>
      </Stage>
    );
  if (t < 32) {
    const yawn = interpolate(t, [29.2, 30.0, 30.8], [0, 1, 0], cl);
    return (
      <Stage>
        <CaveDen t={t} />
        <Hero id="yawn" x={960} y={1080} scale={1.75} expr={{brow: 0.3, lid: 0.5 + yawn * 0.4, mouth: -yawn, eyeY: 10, bags: true}} glow={1} />
      </Stage>
    );
  }
  return (
    <Stage>
      <Cam s={1.0} cx={960} cy={560}>
        <HomeRoom t={t} curtains={0.85} day={0.25} headOut={<PeekHead t={t} out={0} />} denGlow={1} />
      </Cam>
    </Stage>
  );
};

export const WildClip2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(t)}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '0']]} />
      <Sequence from={sec(0.4)} durationInFrames={sec(3.4)}>
        <Caption text="At night, he **forages**." dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(11.6)} durationInFrames={sec(2.8)}>
        <Caption text="The watering **hole**." dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(25.3)} durationInFrames={sec(3.0)}>
        <Caption text="He guards his **treasure**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(32.2)} durationInFrames={sec(2.7)}>
        <Caption text="He returns before **dawn**." dur={sec(2.7)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/pizz-comic.wav" vol={0.5} dur={11.2} />
      <Sfx at={11.3} src="music/kite-rise.wav" vol={0.45} dur={3.5} />
      <Sfx at={14.5} src="music/pizz-comic.wav" vol={0.5} dur={14} />
      <Sfx at={28.5} src="music/low-note.wav" vol={0.4} />
      {/* SFX */}
      <Sfx at={4.4} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={7.6} src="sfx/steps-hard.wav" vol={0.2} dur={3.3} />
      <Sfx at={11.2} src="sfx/fridge-door.wav" vol={0.6} />
      <Sfx at={11.4} src="sfx/fridge-hum.wav" vol={0.5} />
      <Sfx at={14.9} src="sfx/paper-slide.wav" vol={0.4} />
      <Sfx at={18.2} src="sfx/crunch.wav" vol={0.6} />
      <Sfx at={20.0} src="sfx/crunch.wav" vol={0.5} />
      <Sfx at={21.6} src="sfx/run-steps.wav" vol={0.35} dur={3.4} />
      <Sfx at={25.2} src="sfx/paper-slide.wav" vol={0.35} />
    </AbsoluteFill>
  );
};
