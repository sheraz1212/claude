import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Rain} from '../common/echoSets2';
import {MOM_WORK, NEW_SHOES, PriceTag, RED, tagAt, GREY} from './sets';
import {Alley, ALLEY_Y, Crate, Diner, DINER_Y, LunchboxInsert, Street, STREET_Y} from './sets2';
import {MY_CAP, MY_JACKET} from './Clip3';

/*
 POCKET MONEY - Clip 4 (34 s)  MUSIC: s2 fades -> s3 sad VIOLIN + soft pad (the reveal)
  0-6    WIDE bus stop in the rain, shopping bags; across the street a diner window glows      (place)
  6-12   POV through the diner window: a waitress carrying plates... it's MOM
  12-15  WIDE the diner's back alley, one bulb: Mom on a crate on her break, the cook eats
  15-18  INSERT her lunch box opens: EMPTY                                                    (the reveal)
  18-21  MEDIUM she drinks water, looks at a photo of him on her phone and smiles
  21-25  CLOSE-UP him at the alley corner, the bags slip from his hand                           (emotion)
  25-28.6 WIDE dark: his glowing tags look huge and silly; the demon towers
  28.6-34 BLACK wisdom lines: "He wore $570." / "She ate nothing."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Bags: React.FC<{x: number; y: number; drop?: number}> = ({x, y, drop = 0}) => (
  <g transform={`translate(${x} ${y + drop * 90}) rotate(${drop * 20})`}>
    <path d="M -10 -70 Q 25 -100 60 -70" stroke={C.outline} strokeWidth={5} fill="none" />
    <rect x={-20} y={-70} width={90} height={100} rx={6} fill="#e46a5a" stroke={C.outline} strokeWidth={4} />
    <rect x={30} y={-50} width={80} height={90} rx={6} fill="#e8e4dc" stroke={C.outline} strokeWidth={4} />
    <text x={70} y={10} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={18} fill={RED}>KICKS</text>
  </g>
);

const Me: React.FC<{t: number; x: number; y: number; s: number; expr?: object; lHand?: [number, number]; headTilt?: number; tags?: number; tagScale?: number}> = ({t, x, y, s, expr, lHand, headTilt = 0, tags = 1, tagScale = 1}) => (
  <g>
    <Hero id="me" x={x} y={y} scale={s} pose="arms-down" shoes={NEW_SHOES} accessory="cap" accessoryColor={MY_CAP} jacket={MY_JACKET} lHand={lHand} headTilt={headTilt}
      expr={{brow: 0.2, lid: 0.2, mouth: -0.1, ...expr}} blink={blinkAt(t, [3.2, 10.1, 26.4])} />
    {tags > 0 && (
      <g opacity={tags}>
        <PriceTag ax={tagAt.shoes(x, y, s)[0]} ay={tagAt.shoes(x, y, s)[1]} price="$180" s={s * 1.2 * tagScale} t={t} />
        <PriceTag ax={tagAt.cap(x, y, s)[0]} ay={tagAt.cap(x, y, s)[1]} price="$90" s={s * 1.2 * tagScale} t={t + 1} />
        <PriceTag ax={tagAt.jacket(x, y, s)[0]} ay={tagAt.jacket(x, y, s)[1]} price="$300" s={s * 1.2 * tagScale} t={t + 2} />
      </g>
    )}
  </g>
);

const MomOnCrate: React.FC<{t: number; phase: 'box' | 'phone'; x?: number}> = ({t, phase, x = 640}) => (
  <g>
    <Crate x={x} />
    <Hero id="momA" x={x} y={800} scale={0.8} sit pose="arms-down" {...MOM_WORK}
      lHand={phase === 'box' ? [-60, -120] : [-60, -230]} lHold={phase === 'phone' ? 'cup' : 'none'}
      rHand={phase === 'box' ? [60, -120] : [50, -200]} rHold={phase === 'phone' ? 'phone-screen' : 'none'}
      glow={phase === 'phone' ? 0.4 : 0} glowColor={C.coldLight} headTilt={phase === 'phone' ? 6 : 0}
      expr={phase === 'box' ? {brow: 0.5, lid: 0.45, mouth: -0.1, eyeY: 14, bags: true} : {brow: 0.5, lid: 0.35, mouth: 0.55, eyeY: 12, eyeX: 6, bags: true}}
      blink={blinkAt(t, [13.4, 19.6])} />
    {phase === 'box' && (
      <g>
        <rect x={x - 70} y={668} width={140} height={44} rx={8} fill="#5b86b8" stroke={C.outline} strokeWidth={3} />
      </g>
    )}
  </g>
);

const Cook: React.FC<{t: number}> = ({t}) => {
  const bite = Math.sin(t * 3) > 0.6 ? 1 : 0;
  return (
    <g>
      <Hero id="cook" x={1080} y={ALLEY_Y} scale={0.8} pose="arms-down" color={GREY} accessory="cap" accessoryColor="#e8e4dc" jacket="#e8e4dc"
        rHand={[40, -260 + bite * 10]} expr={{brow: -0.1, lid: 0.3, mouth: bite ? -0.2 : 0.3, eyeX: -6}} />
      <g transform={`translate(${1080 + 0.8 * 40} ${ALLEY_Y + 0.8 * (-58 + (-260 + bite * 10 + 58) * 1.4) - 34})`}>
        <ellipse rx={34} ry={14} cy={-12} fill="#d8a44a" stroke={C.outline} strokeWidth={3} />
        <rect x={-34} y={-6} width={68} height={10} fill="#6a3a2a" />
        <ellipse rx={34} ry={10} cy={8} fill="#d8a44a" stroke={C.outline} strokeWidth={3} />
      </g>
    </g>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const look = interpolate(t, [2.4, 3.2], [0, 1], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 6], [1.18, 1.24], cl)} cx={560} cy={640} dy={-120}>
          <Street t={t} />
          <Me t={t} x={300} y={STREET_Y} s={0.75} lHand={[-100, -40]} expr={{brow: 0.1 + look * 0.4, lid: 0.15, mouth: 0.1 - look * 0.4, eyeX: look * 20}} tags={0.9} />
          <Bags x={300 - 0.75 * 120} y={STREET_Y - 70} />
        </Cam>
      </Stage>
    );
  }
  if (t < 12) {
    const wx = interpolate(t, [6.4, 10.6], [1640, 1010], cl);
    return (
      <Stage>
        <Cam s={1.12} cx={1160} cy={640} dy={-30}>
          <Diner t={t} />
          {/* customers at the counter */}
          <Hero id="c1" x={1420} y={DINER_Y} scale={0.75} pose="arms-down" color={GREY} accessory="cap" accessoryColor="#5a6a3a" jacket="#3a3a50" back />
          <Hero id="c2" x={1700} y={DINER_Y} scale={0.75} pose="arms-down" color={C.tan} accessory="glasses" jacket="#5a3a3a" back />
          <Hero id="momW" x={wx} y={DINER_Y + 20} scale={0.75} pose="arms-down" {...MOM_WORK} walk={t * 7} lHand={[-120, -230]} rHand={[120, -230]}
            expr={{brow: 0.3, lid: 0.3, mouth: 0.45, eyeX: -10, bags: true}} />
          {[-1, 1].map((k) => (
            <g key={k} transform={`translate(${wx + k * 0.75 * 120} ${DINER_Y + 20 + 0.75 * (-58 + (-230 + 58) * 1.4) - 26})`}>
              <ellipse rx={50} ry={11} fill="#f4f2ee" stroke={C.outline} strokeWidth={3} />
              <ellipse rx={28} ry={10} cy={-8} fill="#c98a4a" stroke={C.outline} strokeWidth={2} />
            </g>
          ))}
        </Cam>
        {/* the window he looks through: frame, rain on the glass, a cold tint */}
        <rect width={1920} height={1080} fill="#1c2840" opacity={0.18} />
        <Rain t={t} o={0.45} n={70} />
        <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#14131a" strokeWidth={150} />
        <line x1={960} y1={0} x2={960} y2={1080} stroke="#14131a" strokeWidth={30} />
      </Stage>
    );
  }
  if (t < 15)
    return (
      <Stage>
        <Cam s={1.05} cx={860} cy={700} dy={-60}>
          <Alley t={t} />
          <Cook t={t} />
          <MomOnCrate t={t} phase="box" />
        </Cam>
      </Stage>
    );
  if (t < 18) return <Stage><LunchboxInsert t={t} open={interpolate(t, [15.6, 16.6], [0, 1], cl)} /></Stage>;
  if (t < 21)
    return (
      <Stage>
        <Cam s={1.6} cx={680} cy={560} dy={0}>
          <Alley t={t} />
          <MomOnCrate t={t} phase="phone" />
        </Cam>
      </Stage>
    );
  if (t < 25) {
    const slip = interpolate(t, [22.6, 23.4], [0, 1], cl);
    return (
      <Stage>
        <Cam s={2.3} cx={260} cy={460} dy={80}>
          <Alley t={t} />
          <Me t={t} x={300} y={ALLEY_Y} s={0.75} lHand={[-100, -40 + slip * 30]} tags={0}
            expr={{brow: 0.9, lid: 0, mouth: -0.6, eyeX: 16, eyeY: 4, tear: interpolate(t, [23.0, 24.6], [0, 0.8], cl)}} />
          {/* the wall corner he hides behind */}
          <rect x={0} y={0} width={210} height={1080} fill="#221a20" />
          <rect x={196} y={0} width={14} height={1080} fill="#15111a" />
        </Cam>
      </Stage>
    );
  }
  // 25-28.6: dark - only his tags glow, the demon towers
  return (
    <Stage bg="#08070b">
      <Cam s={interpolate(t, [25, 28.6], [1.0, 1.08], cl)} cx={960} cy={640} dy={-150}>
        <rect width={1920} height={1080} fill="#0b0a10" />
        <Light id="dk" x={960} y={500} r={700} color={RED} o={0.35} />
        <Demon id="dt" x={1180} y={900} t={t} scale={0.8} size={1.45} lean={-6} headTilt={-8} expr={{eyeX: -14, eyeY: 12, mouth: 0.7}} />
        <Me t={t} x={820} y={900} s={0.8} tagScale={1.35} expr={{brow: 0.8, lid: 0.3, mouth: -0.5, eyeY: 12}} headTilt={6} />
      </Cam>
    </Stage>
  );
};

export const PocketClip4: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 28.6 && <Shots t={t} />}
      <FilmLook />
      <Sequence from={sec(6.6)} durationInFrames={sec(2.8)}>
        <Caption text="The waitress was his **mom**." dur={sec(2.8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(9.4)} durationInFrames={sec(2.5)}>
        <Caption text="He never asked where she **worked**." dur={sec(2.5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(12.3)} durationInFrames={sec(2.6)}>
        <Caption text="Her lunch break." dur={sec(2.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(16.0)} durationInFrames={sec(2.0)}>
        <Caption text="Her lunch box was **empty**." dur={sec(2.0)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(18.4)} durationInFrames={sec(2.6)}>
        <Caption text="She skipped lunch. For **him**." dur={sec(2.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(25.4)} durationInFrames={sec(3.0)}>
        <Caption text="His shine had a **price**." dur={sec(3.0)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(2.7)}>
        <BlackCard text="He wore **$570**." dur={sec(2.7)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(31.3)} durationInFrames={sec(2.7)}>
        <BlackCard text="She ate **$0**." dur={sec(2.7)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/rain.wav" vol={0.5} dur={6} fadeIn={0.5} fadeOut={0.6} />
      <Sfx at={0.0} src="sfx/street-amb.wav" vol={0.25} dur={6} fadeOut={0.6} />
      <Sfx at={6.0} src="sfx/rain.wav" vol={0.3} dur={6} fadeOut={0.5} />
      <Sfx at={6.0} src="sfx/plates-muffled.wav" vol={0.4} dur={6} fadeIn={0.4} fadeOut={0.5} />
      <Sfx at={12.0} src="sfx/rain.wav" vol={0.35} dur={13} fadeIn={0.3} fadeOut={0.8} />
      <Sfx at={12.4} src="sfx/crunch.wav" vol={0.25} />
      <Sfx at={15.6} src="sfx/drawer-open.wav" vol={0.35} />
      <Sfx at={16.3} src="sfx/piano-dark-hit.wav" vol={0.65} />
      <Sfx at={18.6} src="sfx/cup-tap.wav" vol={0.3} />
      <Sfx at={22.8} src="sfx/bag-rustle.wav" vol={0.5} />
      <Sfx at={23.4} src="sfx/bag-thud.wav" vol={0.45} />
      <Sfx at={25.0} src="sfx/low-hum.wav" vol={0.4} dur={3.6} fadeIn={0.4} fadeOut={0.6} />
      <Sfx at={25.2} src="sfx/demon-horn.wav" vol={0.5} />
      <Sfx at={28.9} src="sfx/pen-write.wav" vol={0.5} />
      <Sfx at={31.6} src="sfx/pen-write.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
