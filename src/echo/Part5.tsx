import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, mixColor, Particles, Stage} from '../common/sets';
import {DeskRoom, Doodle, EchoWords, PhonePOV} from '../common/echoSets';
import {ProfilePOV} from '../common/echoSets2';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 5: Twist + tiny decision (2:30–3:00). MUSIC: none → orchestra-swell (start 20 s, impact 22 s). Shots 33–38.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

export const EchoPart5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const shatter = interpolate(t, [22, 25.5], [0, 1], cl);
  const flood = interpolate(t, [22, 25], [0, 1], {...cl, easing: io});
  const smile = interpolate(t, [24.5, 26.5], [0, 1], cl);
  const line = interpolate(t, [19.4, 21.8], [0, 0.22], cl);
  const shake = t > 19 && t < 21.8 ? Math.sin(t * 40) * 2.5 : 0;

  let scene: React.ReactNode = null;
  if (t < 7) {
    scene = (
      <Stage>
        <Light id="pfp" x={960} y={560} r={700} color={C.cold} o={0.6} />
        <Cam s={interpolate(t, [0, 7], [1.0, 1.1], cl)} cx={960} cy={560}>
          <PhonePOV px={960} py={560}>
            <ProfilePOV t={t} x0={762} y0={190} />
          </PhonePOV>
        </Cam>
      </Stage>
    );
  } else if (t < 10) {
    const wide = interpolate(t, [7.2, 7.8], [0, 1], cl);
    scene = (
      <Stage>
        <Cam s={interpolate(t, [7, 10], [1.4, 1.5], cl)} cx={1100} cy={520}>
          <Light id="fz" x={1100} y={900} r={760} color={C.cold} o={0.6} />
          <Hero id="e5e" x={1100} y={1430} scale={2.7} expr={{brow: 0.5 - wide * 0.6, lid: 0, mouth: -0.2 + wide * 0.2, eyeY: 2}} glow={0.7} />
          {/* the letters freeze in the air */}
          <EchoWords t={7} n={8} area={[700, 300, 1500, 760]} size={[60, 140]} dim={0.25} seed={51} />
        </Cam>
      </Stage>
    );
  } else if (t < 12.8 || (t >= 19 && t < 30)) {
    const open = interpolate(t, [11.0, 12.0], [0, 1], {...cl, easing: io});
    const sitting = t >= 19;
    const cam = !sitting
      ? {s: interpolate(t, [10, 12.8], [1.2, 1.28], cl), cx: 1150, cy: 640}
      : t < 22
        ? {s: interpolate(t, [19, 22], [1.4, 1.45], cl), cx: 1010, cy: 560}
        : {s: interpolate(t, [22, 30], [1.25, 1.02], {...cl, easing: io}), cx: 1000, cy: 560};
    scene = (
      <Stage bg="#0a0c0f">
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <DeskRoom
            t={t}
            lamp={sitting ? interpolate(t, [22, 24], [0.4, 1], cl) : 0}
            sky={{top: mixColor(flood, '#05080f', '#3b4a6a'), bottom: mixColor(flood, '#0a1020', '#f2c27a'), sun: flood}}
            drawer={sitting ? 0 : open}
            drawerGlow={sitting ? 0 : Math.max(1 - open, 0.6)}
            warmFlood={flood}
            mid={
              sitting ? (
                <Hero
                  id="e5s"
                  x={960}
                  y={820}
                  lHand={[-50, -130]}
                  rHand={[150 + shake, -175 + shake]}
                  rHold="pencil"
                  expr={{brow: t < 22 ? -0.4 : -smile * 0.1, lid: 0.15, mouth: t < 22 ? 0 : smile * 0.8, eyeX: t < 22 ? 9 : 0, eyeY: t < 22 ? 6 : -4, bags: t < 25}}
                  blink={blinkAt(t, [27.4])}
                />
              ) : undefined
            }
            front={
              <>
                {!sitting && (
                  <Hero id="e5w" x={1240} y={FLOOR} showLegs lHand={open > 0.5 ? [-40, -150] : undefined} rHand={open > 0.2 ? [60, -120] : undefined} pose="arms-down" headTilt={8} expr={{brow: 0.4, lid: 0.1, mouth: -0.1, eyeX: -6, eyeY: 10, bags: true}} glow={open * 0.8} glowColor={C.amberLight} />
                )}
                {sitting && <Doodle x={1040} y={560} w={170} h={130} draw={line} />}
                {sitting && t < 22.5 && <Light id="e5ln" x={1080} y={660} r={220} color={C.amberLight} o={0.9} />}
                <EchoWords t={t} n={40} area={[200, 220, 1760, 860]} size={[70, 240]} dim={0.6} shatter={shatter} seed={31} />
                <Particles x={1000} y={900} w={1500} h={600} p={interpolate(t, [22, 27], [0, 1], cl)} seed={8} />
                {!sitting && <Light id="e5dl" x={1185} y={700} r={300 + open * 300} color={C.amber} o={0.5 + open * 0.5} />}
              </>
            }
          />
        </Cam>
      </Stage>
    );
  } else if (t < 15) {
    scene = (
      <Stage bg="#0b0a08">
        <Light id="e5in" x={960} y={540} r={800} color={C.amber} o={1} />
        <g transform={`rotate(-2 960 540) translate(960 540) scale(${interpolate(t, [12.8, 15], [1, 1.06], cl)}) translate(-960 -540)`}>
          <Doodle x={560} y={230} w={800} h={600} kid />
        </g>
      </Stage>
    );
  } else {
    scene = (
      <Stage bg="#0a0c0f">
        <Light id="e5cw" x={1100} y={900} r={700} color={C.amber} o={1} />
        <Hero id="e5c" x={1100} y={1430} scale={2.7} pose="arms-down" expr={{brow: 0.4, lid: 0.15, mouth: interpolate(t, [16, 18], [-0.2, 0.5], cl), eyeY: 8, tear: 1}} blink={blinkAt(t, [17.8])} glow={0.9} glowColor={C.amberLight} />
      </Stage>
    );
  }

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      <FilmLook />
      <Counter label="ECHOES" showFrom={0} changes={[[0, '999'], [sec(23), '740'], [sec(23.5), '420'], [sec(24), '180'], [sec(24.5), '40'], [sec(25), '0']]} />
      <Sequence from={sec(2.5)} durationInFrames={sec(4.3)}>
        <Caption text="He wrote it to **everyone**." dur={sec(4.3)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(15.5)} durationInFrames={sec(3.3)}>
        <HeadPill text="It was never about me." x={810} y={470} side="left" dur={sec(3.3)} />
      </Sequence>
      <Sequence from={sec(25.0)} durationInFrames={sec(4.8)}>
        <Caption text="The echo **broke**." dur={sec(4.8)} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.3} src="sfx/scroll-tick.wav" vol={0.4} />
      <Sfx at={1.5} src="sfx/scroll-tick.wav" vol={0.4} />
      <Sfx at={3.0} src="sfx/scroll-tick.wav" vol={0.4} />
      <Sfx at={4.5} src="sfx/scroll-tick.wav" vol={0.4} />
      <Sfx at={10.2} src="sfx/bird-single.wav" vol={0.25} />
      <Sfx at={10.9} src="sfx/drawer-open.wav" vol={0.7} />
      <Sfx at={12.8} src="sfx/page-flip.wav" vol={0.6} />
      <Sfx at={19.5} src="sfx/pencil.wav" vol={0.7} />
      <Sfx at={22.0} src="sfx/shatter.wav" vol={0.9} />
      {/* MUSIC: orchestra-swell */}
      <Sfx at={20.0} src="music/orchestra-swell.wav" vol={0.85} />
    </AbsoluteFill>
  );
};
