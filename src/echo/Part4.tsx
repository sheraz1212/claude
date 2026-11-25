import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Light, Stage} from '../common/sets';
import {DeskRoom, EchoWords} from '../common/echoSets';
import {PhoneFloor, WindowMoon} from '../common/echoSets2';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 4: Low point (1:50–2:30). MUSIC: sad-piano. Shots 28–33a.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const HX = 1450;
const HY = FLOOR + 50;

const Corner: React.FC<{t: number}> = ({t}) => {
  const ears = t >= 9 && t < 16;
  const reachP = interpolate(t, [36, 38.5], [0, 1], {...cl, easing: io});
  const lookUp = interpolate(t, [22.5, 24], [0, 1], {...cl, easing: io});
  const dim = t < 21 ? 0 : interpolate(t, [21, 27], [0, 0.7], cl);
  const tear = interpolate(t, [11, 15], [0, 1], cl);
  const cam =
    t < 9
      ? {s: interpolate(t, [0, 9], [1.0, 1.1], {...cl, easing: io}), cx: 1300, cy: 600}
      : t < 16
        ? {s: interpolate(t, [9, 16], [2.1, 2.2], cl), cx: HX, cy: 560}
        : t < 29
          ? {s: interpolate(t, [21, 29], [1.5, 1.45], cl), cx: HX, cy: 600}
          : {s: interpolate(t, [35, 40], [1.35, 1.3], cl), cx: HX - 100, cy: 640};
  const expr = ears
    ? {brow: 1.1, lid: 1, mouth: -0.6, bags: true, tear}
    : t < 9
      ? {brow: 0.9, lid: 0.45, mouth: -0.5, eyeY: 8, bags: true}
      : t < 35
        ? {brow: 0.8, lid: 0.25, mouth: -0.4, eyeY: 4 - lookUp * 8, bags: true, tear: 1 - lookUp * 0.5}
        : {brow: 0.6, lid: 0.2, mouth: -0.3, eyeX: -14, eyeY: 10, bags: true};
  const hands: [[number, number], [number, number]] = ears ? [[-108, -330], [108, -330]] : t >= 35 ? [[interpolate(reachP, [0, 1], [-30, -190]), interpolate(reachP, [0, 1], [-128, -70])], [30, -128]] : [[-30, -128], [30, -128]];
  return (
    <Stage bg="#0a0c0f">
      <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
        <DeskRoom
          t={t}
          lamp={0}
          sky={{top: '#05080f', bottom: '#0a1020'}}
          front={
            <>
              <EchoWords t={t} n={60} area={[200, 220, 1760, 860]} size={[70, 260]} dim={dim} seed={31} />
              <Hero id="e4h" x={HX} y={HY} lHand={hands[0]} rHand={hands[1]} headTilt={ears ? 0 : t >= 35 ? 10 : 6 - lookUp * 10} expr={expr} blink={ears ? 0 : blinkAt(t, [6.0, 26.5])} />
              {[-36, 36].map((kx) => (
                <ellipse key={kx} cx={HX + kx} cy={HY - 92} rx={34} ry={44} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />
              ))}
              {!ears && t < 35 && [-30, 30].map((kx) => <ellipse key={kx} cx={HX + kx} cy={HY - 128} rx={19} ry={21} fill={C.cream} stroke={C.outline} strokeWidth={3.5} />)}
              {t >= 35 && (
                <g>
                  <rect x={HX - 300} y={FLOOR - 14} width={90} height={14} rx={5} fill="#e9eef7" stroke={C.outline} strokeWidth={3} />
                  <Light id="e4ph" x={HX - 255} y={FLOOR - 10} r={260} color={C.cold} o={0.9} />
                </g>
              )}
            </>
          }
        />
        <Light id="e4c" x={HX} y={600} r={700} color={C.cold} o={0.45 * (1 - dim * 0.5)} />
      </Cam>
    </Stage>
  );
};

export const EchoPart4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {(t < 16 || (t >= 21 && t < 29) || t >= 35) && <Corner t={t} />}
      {t >= 16 && t < 21 && (
        <Stage>
          <Cam s={interpolate(t, [16, 21], [1.0, 1.08], cl)} cx={960} cy={540}>
            <WindowMoon t={t} cover={interpolate(t, [16.3, 20.5], [0, 1], cl)} />
          </Cam>
        </Stage>
      )}
      {t >= 29 && t < 35 && (
        <Stage>
          <Cam s={interpolate(t, [29, 35], [1.0, 1.1], cl)} cx={960} cy={600}>
            <PhoneFloor t={t} on={t >= 30.5 ? 1 : 0} />
          </Cam>
        </Stage>
      )}
      <FilmLook />
      <Counter label="ECHOES" showFrom={0} changes={[[0, '930'], [sec(5), '999']]} />
      <Sequence from={sec(10.0)} durationInFrames={sec(3.5)}>
        <HeadPill text="Make it stop." x={1215} y={540} side="left" dur={sec(3.5)} />
      </Sequence>
      <Sequence from={sec(22.0)} durationInFrames={sec(6.0)}>
        <Caption text="He couldn't hear **himself**." dur={sec(6.0)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC: sad-piano */}
      <Sfx at={0} src="music/sad-piano.wav" vol={0.65} dur={40} />
      {/* SFX */}
      <Sfx at={0} src="sfx/whisper-cloud.wav" vol={0.6} />
      <Sfx at={9.2} src="sfx/whisper-cloud.wav" vol={0.85} dur={6.8} />
      <Sfx at={11.5} src="sfx/demon-whisper.wav" vol={0.9} />
      <Sfx at={16.3} src="sfx/demon-whisper.wav" vol={0.6} />
      <Sfx at={30.5} src="sfx/phone-buzz.wav" vol={0.8} />
      <Sfx at={32.2} src="sfx/phone-buzz.wav" vol={0.7} />
    </AbsoluteFill>
  );
};
