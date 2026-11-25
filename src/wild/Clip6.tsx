import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Person, Stage, TAN} from '../common/sets';
import {Door, Dust, HomeRoom, Kite, NotifBird} from './sets';
import {PeekHead} from './Clip1';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 6 (35 s): the rare event. MUSIC: kite-rise → orchestra-swell.
  1 0–4      MEDIUM the door: a second knock, warm light under it   → something outside
  2 4–7.5    WIDE he opens it: a kid with a kite string             → "My kite's stuck!"
  3 7.5–11   IMAGERY the string glows gold across the frozen room    → a path out
  4 11–14.5  CLOSE he looks back at his den                          → the choice
  5 14.5–18  MEDIUM he takes the string; frost melts under his feet  → courage = warmth
  6 18–21.5  WIDE he throws the curtains open; sun floods, birds fly → the world comes back
  7 21.5–25  MEDIUM balcony, he reaches for the stuck kite           → doing, not watching
  8 25–28.5  WIDE the kite flies free into the sky                   → release
  9 28.5–32  CLOSE he squints into the sun and smiles                → first sunlight
  10 32–35   MEDIUM he waves down to the kid; counter → 1            → "A rare sighting."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const KID = {color: TAN, accessory: 'bow' as const, accessoryColor: '#e07b8a'};

const Balcony: React.FC<{t: number; kiteFree?: number; children?: React.ReactNode}> = ({t, kiteFree = 0, children}) => (
  <g>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6f9ad0" />
        <stop offset="1" stopColor="#f2d29a" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#bsky)" />
    <circle cx={1600} cy={220} r={110} fill="#fff1d0" />
    <Light id="bsun" x={1600} y={220} r={1300} color={C.amber} o={0.8} />
    {Array.from({length: 6}, (_, i) => (
      <rect key={i} x={i * 330 - 40} y={560 + (i % 2) * 40} width={280} height={520} fill={['#8a7a96', '#9a8aa6'][i % 2]} opacity={0.6} />
    ))}
    <Dust t={t} n={30} color="#fff1d0" o={0.6} />
    <Kite x={interpolate(kiteFree, [0, 1], [1180, 1400]) + Math.sin(t * 1.5) * 20 * kiteFree} y={interpolate(kiteFree, [0, 1], [640, 220]) + Math.cos(t * 1.2) * 15 * kiteFree} r={interpolate(kiteFree, [0, 1], [70, Math.sin(t * 1.7) * 14])} />
    {children}
    <rect x={0} y={700} width={1920} height={14} fill="#3a3540" />
    {Array.from({length: 24}, (_, i) => (
      <line key={i} x1={i * 82} y1={714} x2={i * 82} y2={FLOOR + 60} stroke="#3a3540" strokeWidth={6} />
    ))}
    <rect x={0} y={FLOOR + 60} width={1920} height={200} fill="#2a2630" />
  </g>
);

const shots = (t: number): React.ReactNode => {
  if (t < 7.5) {
    const open = t >= 4 ? interpolate(t, [4.8, 5.6], [0, 1], {...cl, easing: io}) : 0;
    const shake = t < 4 && ((t > 0.4 && t < 0.9) || (t > 1.4 && t < 1.9)) ? Math.sin(t * 80) * 3 : 0;
    return (
      <Stage>
        <Cam s={t < 4 ? 1.4 : 1.15} cx={t < 4 ? 400 : 560} cy={600} dx={shake}>
          <HomeRoom t={t} curtains={1} day={0.2} winter={1 - open * 0.3} den={t >= 4} headOut={undefined} denGlow={0.2} />
          <Door x={400} open={open} />
          {t < 4 && <rect x={280} y={FLOOR - 6} width={240} height={6} fill={C.amberLight} opacity={0.8} />}
          {open > 0 && (
            <>
              <Light id="dopen" x={400} y={600} r={700} color={C.amber} o={open} />
              <Person id="kid" x={400} y={FLOOR} scale={0.62} showLegs color={KID.color} accessory={KID.accessory} accessoryColor={KID.accessoryColor} lHand={[-60, -150]} rHand={[90, -330]} expr={{mouth: 0.8, eyeX: 12, eyeY: -6, brow: 0.3}} />
              <Hero id="h2" x={700} y={FLOOR} showLegs lHand={[-120, -260]} rHand={[90, -110]} expr={{brow: 0.6, lid: 0, mouth: -0.1, eyeX: -14, eyeY: 4}} blink={blinkAt(t, [6.8])} />
            </>
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 18 && !(t >= 11 && t < 14.5)) {
    const glow = interpolate(t, [7.6, 9.0], [0, 1], cl);
    const take = t >= 14.5 ? interpolate(t, [14.8, 15.6], [0, 1], {...cl, easing: io}) : 0;
    const steps = t >= 14.5 ? Math.floor(interpolate(t, [15.6, 17.8], [0, 5.99], cl)) : 0;
    const hx = t >= 14.5 ? interpolate(t, [15.6, 17.8], [700, 1180], cl) : 700;
    return (
      <Stage>
        <Cam s={t < 11 ? 1.0 : 1.1} cx={960} cy={600}>
          <HomeRoom t={t} curtains={1} day={0.25} winter={1 - take * 0.4} headOut={undefined} denGlow={0.2} />
          <Door x={400} open={1} />
          <Light id="d2" x={400} y={600} r={600} color={C.amber} o={0.7} />
          <path d={`M 455 ${FLOOR - 205} Q 900 360 1420 300`} stroke={C.amberLight} strokeWidth={6} fill="none" opacity={glow} style={{filter: `drop-shadow(0 0 14px ${C.amber})`}} />
          <Dust t={t} x={500} y={250} w={900} h={300} n={30} color={C.amberLight} o={0.8 * glow} />
          {Array.from({length: steps}, (_, i) => (
            <ellipse key={i} cx={720 + i * 95} cy={FLOOR + 30} rx={70} ry={14} fill="#6a8a4a" opacity={0.7} />
          ))}
          <Person id="kid2" x={400} y={FLOOR} scale={0.62} showLegs color={KID.color} accessory={KID.accessory} accessoryColor={KID.accessoryColor} lHand={[-60, -150]} rHand={[90, -330]} expr={{mouth: 0.6, eyeX: 12, eyeY: -6}} />
          <Hero id="h3" x={hx} y={FLOOR} showLegs walk={steps > 0 && steps < 6 ? t * 6 : undefined} lHand={[-90, -110]} rHand={take ? [interpolate(take, [0, 1], [90, 110]), interpolate(take, [0, 1], [-110, -300])] : [90, -110]} expr={{brow: take ? -0.2 : 0.4, mouth: take ? 0.3 : 0, eyeX: 12, eyeY: -8}} glow={glow * 0.4} glowColor={C.amberLight} blink={blinkAt(t, [9.8, 16.4])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 14.5) {
    const look = interpolate(t, [11.4, 12.2, 13.4, 14.0], [0, 1, 1, 0], {...cl, easing: io});
    return (
      <Stage>
        <g opacity={0.45}>
          <HomeRoom t={t} curtains={1} day={0.25} winter={0.9} headOut={undefined} denGlow={0.4} />
        </g>
        <Light id="c6" x={600} y={700} r={600} color={C.amber} o={0.5} />
        <Hero id="h4" x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={look * 10} expr={{brow: 0.6, lid: 0.1, mouth: -0.1, eyeX: 16 * look - 10 * (1 - look), eyeY: 6 * look}} blink={blinkAt(t, [12.8])} />
      </Stage>
    );
  }
  if (t < 21.5) {
    const open = interpolate(t, [18.3, 19.2], [1, 0], {...cl, easing: io});
    return (
      <Stage>
        <HomeRoom t={t} curtains={open} day={1 - open * 0.7} winter={open * 0.6} headOut={undefined} denGlow={0.2} />
        <Hero id="h6" x={1420} y={FLOOR} back showLegs lHand={[-150, -330]} rHand={[150, -330]} />
        {Array.from({length: 6}, (_, k) => (
          <NotifBird key={k} x={1230 + (k % 3) * 120 + (t - 18.3) * 500 * (1 - open)} y={520 - Math.floor(k / 3) * 60 - (t - 18.3) * 300 * (1 - open)} t={t} k={k} s={0.8} />
        ))}
      </Stage>
    );
  }
  if (t < 28.5) {
    const free = t >= 25 ? interpolate(t, [25.3, 27.5], [0, 1], {...cl, easing: Easing.out(Easing.quad)}) : 0;
    const reach = interpolate(t, [21.8, 23.0], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={t < 25 ? 1.4 : 1.0} cx={t < 25 ? 1100 : 960} cy={t < 25 ? 620 : 540}>
          <Balcony t={t} kiteFree={free}>
            <Hero id="h7" x={960} y={FLOOR + 60} showLegs lHand={[-90, -110]} rHand={free > 0 ? [interpolate(free, [0, 1], [230, 160]), interpolate(free, [0, 1], [-270, -420])] : [interpolate(reach, [0, 1], [90, 230]), interpolate(reach, [0, 1], [-110, -270])]} lean={reach * 8 * (1 - free)} expr={{brow: -0.2, mouth: free > 0.5 ? 1 : 0.3, eyeX: 14, eyeY: free > 0 ? -12 : 4}} />
          </Balcony>
        </Cam>
      </Stage>
    );
  }
  if (t < 32)
    return (
      <Stage>
        <g opacity={0.6}>
          <Balcony t={t} kiteFree={1} />
        </g>
        <Light id="sunf" x={1500} y={200} r={1200} color={C.amber} o={1} />
        <Hero id="h9" x={1000} y={1080} scale={1.75} pose="arms-down" headTilt={-6} expr={{brow: -0.3, lid: 0.5, mouth: interpolate(t, [28.8, 30.2], [0.2, 0.9], cl), eyeY: -6}} glow={0.6} glowColor={C.amberLight} />
      </Stage>
    );
  return (
    <Stage>
      <Cam s={1.1} cx={960} cy={560}>
        <Balcony t={t} kiteFree={1}>
          <Hero id="h10" x={960} y={FLOOR + 60} showLegs lHand={[-90, -110]} rHand={[140, -420 + Math.sin(t * 12) * 14]} expr={{mouth: 1, eyeX: 10, eyeY: 12}} />
        </Balcony>
      </Cam>
    </Stage>
  );
};

export const WildClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(t)}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '0'], [sec(32.2), '1']]} />
      <Sequence from={sec(5.8)} durationInFrames={sec(1.7)}>
        <HeadPill text="My kite's stuck!" x={560 + (400 - 560) * 1.15} y={600 + (FLOOR - 0.62 * 430 - 600) * 1.15 - 12} dur={sec(1.7)} />
      </Sequence>
      <Sequence from={sec(7.8)} durationInFrames={sec(3.0)}>
        <Caption text="A rare **opportunity**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(14.8)} durationInFrames={sec(3.0)}>
        <Caption text="The ice began to **melt**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(32.3)} durationInFrames={sec(2.6)}>
        <Caption text="A rare **sighting**." dur={sec(2.6)} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/low-note.wav" vol={0.35} dur={4} />
      <Sfx at={7.6} src="music/kite-rise.wav" vol={0.5} />
      <Sfx at={11.0} src="music/freeze-pad.wav" vol={0.3} dur={3.5} />
      <Sfx at={14.5} src="music/dream-piano.wav" vol={0.4} dur={8.5} />
      <Sfx at={23.3} src="music/orchestra-swell.wav" vol={0.7} />
      {/* SFX */}
      <Sfx at={0.4} src="sfx/knock.wav" vol={0.8} />
      <Sfx at={1.4} src="sfx/knock.wav" vol={0.8} />
      <Sfx at={4.8} src="sfx/door-close.wav" vol={0.4} />
      <Sfx at={4.9} src="sfx/bird-single.wav" vol={0.45} />
      <Sfx at={15.6} src="sfx/thaw.wav" vol={0.6} />
      <Sfx at={18.3} src="sfx/whoosh.wav" vol={0.45} />
      <Sfx at={18.6} src="sfx/birds.wav" vol={0.5} />
      <Sfx at={22.0} src="sfx/cloth.wav" vol={0.4} />
      <Sfx at={25.3} src="sfx/kite-flutter.wav" vol={0.6} />
      <Sfx at={26.0} src="sfx/soft-laugh.wav" vol={0.5} />
      <Sfx at={32.4} src="sfx/far-cheer.wav" vol={0.35} />
    </AbsoluteFill>
  );
};
