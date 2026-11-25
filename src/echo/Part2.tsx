import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, Stage} from '../common/sets';
import {ArtClass, DeskRoom, EchoWords, Table} from '../common/echoSets';
import {Bathroom, BusStop, BusWindow, Cereal, DrawerInsert, PaperInsert, Teacher, WallInsert} from '../common/echoSets2';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 2: Routine montage (0:35–1:15). MUSIC: none (whispers only). Shots 11–20.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const SAD = {brow: 0.7, lid: 0.35, mouth: -0.4, eyeY: 7, bags: true};
const NIGHT = {top: '#070b14', bottom: '#0d1526'};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 4)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 4], [1.0, 1.06], cl)} cx={960} cy={420}>
          <Bathroom t={t} write={interpolate(t, [0.5, 2.6], [0, 1], cl)} />
        </Cam>
      </Stage>
    );
  if (t < 7.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [4, 7.5], [1.0, 1.08], cl)} cx={960} cy={560}>
          <Cereal t={t} p={interpolate(t, [4.5, 6.6], [0, 1], {...cl, easing: io})} />
        </Cam>
      </Stage>
    );
  if (t < 12)
    return (
      <Stage>
        <Cam s={interpolate(t, [7.5, 12], [1.0, 1.05], cl)} cx={900} cy={560}>
          <BusStop t={t} spell={interpolate(t, [8.4, 10.6], [0, 1], cl)}>
            <Hero id="e2bs" x={1060} y={FLOOR} showLegs pose="arms-down" headTilt={8} expr={{...SAD, eyeX: -14, eyeY: -2}} blink={blinkAt(t, [9.6])} />
          </BusStop>
        </Cam>
      </Stage>
    );
  if (t < 16)
    return (
      <Stage>
        <Cam s={interpolate(t, [12, 16], [1.0, 1.05], cl)} cx={900} cy={540}>
          <BusWindow t={t} />
        </Cam>
      </Stage>
    );
  if (t < 20)
    return (
      <Stage>
        <Cam s={interpolate(t, [16, 20], [1.08, 1.12], cl)} cx={1060} cy={600}>
          <ArtClass t={t} emptySpot={false}>
            <Hero id="e2ac" x={960} y={820} lHand={[-60, -128]} rHand={[50, -140]} rHold="pencil" headTilt={t > 18.6 ? Math.sin((t - 18.6) * 14) * 8 : 0} expr={{...SAD, eyeX: 10, eyeY: 2}} blink={blinkAt(t, [17.2])} />
            <Table x={960}>
              <rect x={900} y={694} width={130} height={8} fill="#efe7d0" />
            </Table>
            <Teacher x={1360} y={FLOOR} lHand={[-130, -230]} rHand={[90, -110]} headTilt={-4} expr={{mouth: 0.6, eyeX: -12, eyeY: 6}} blink={blinkAt(t, [18.2])} />
            <EchoWords t={t} n={interpolate(t, [17, 19.5], [2, 8], cl)} area={[720, 430, 1220, 690]} size={[60, 120]} seed={12} />
          </ArtClass>
        </Cam>
      </Stage>
    );
  if (t < 23.5)
    return (
      <Stage>
        <PaperInsert t={t} crumple={interpolate(t, [22.2, 23.2], [0, 1], {...cl, easing: io})} />
      </Stage>
    );
  if (t < 27.5)
    return (
      <Stage bg="#0c0e12">
        <Cam s={interpolate(t, [23.5, 27.5], [1.3, 1.36], cl)} cx={960} cy={560}>
          <DeskRoom
            t={t}
            lamp={0}
            sky={NIGHT}
            mid={<Hero id="e2nt" x={960} y={820} expr={{brow: 0.9, lid: 0.3, mouth: -0.5, eyeY: 7, bags: true}} glow={0.85} blink={blinkAt(t, [25.0])} />}
            front={<EchoWords t={t} n={12} area={[520, 300, 1450, 690]} size={[70, 160]} seed={14} />}
          />
        </Cam>
      </Stage>
    );
  if (t < 32) {
    const k = Math.floor((t - 27.5) / 1.5);
    const p = ((t - 27.5) % 1.5) / 1.5;
    return (
      <Stage>
        <WallInsert left={[6, 4, 2][Math.min(2, k)]} pull={interpolate(p, [0.2, 0.8], [0, 1], cl)} />
      </Stage>
    );
  }
  if (t < 35.5)
    return (
      <Stage>
        <DrawerInsert close={interpolate(t, [32.5, 33.6], [0, 1], {...cl, easing: Easing.in(Easing.quad)})} />
      </Stage>
    );
  return (
    <Stage bg="#0c0e12">
      <Cam s={interpolate(t, [35.5, 40], [1.0, 0.95], cl)} cx={960} cy={560}>
        <DeskRoom
          t={t}
          lamp={0}
          sky={NIGHT}
          mid={<Hero id="e2w" x={960} y={820} lHand={[-60, -128]} rHand={[60, -128]} headTilt={10} expr={{...SAD, eyeY: 10}} blink={blinkAt(t, [38.0])} />}
          front={<EchoWords t={t} n={interpolate(t, [35.5, 39.5], [18, 34], cl)} area={[260, 240, 1700, 840]} size={[60, 220]} seed={15} />}
        />
      </Cam>
    </Stage>
  );
};

export const EchoPart2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="ECHOES" showFrom={0} changes={[[0, '12'], [sec(7.5), '48'], [sec(16), '120'], [sec(23.5), '300'], [sec(27.5), '420'], [sec(35.5), '600']]} />
      <Sequence from={sec(8.0)} durationInFrames={sec(3.8)}>
        <Caption text="It followed him **everywhere**." dur={sec(3.8)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(32.3)} durationInFrames={sec(3.1)}>
        <Caption text="He stopped **drawing**." dur={sec(3.1)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(16.4)} durationInFrames={sec(2.9)}>
        <HeadPill text="Your turn to share!" x={1360 + (1360 - 1060) * 0.1} y={392} dur={sec(2.9)} />
      </Sequence>
      <Sequence from={sec(24.0)} durationInFrames={sec(3.2)}>
        <HeadPill text="Maybe they're right." x={960} y={560 + (390 - 560) * 1.33 - 12} dur={sec(3.2)} />
      </Sequence>
      {/* SFX (MUSIC: none) */}
      <Sfx at={0.9} src="sfx/demon-whisper.wav" vol={0.8} />
      <Sfx at={5.6} src="sfx/demon-whisper.wav" vol={0.6} />
      <Sfx at={7.5} src="sfx/rain.wav" vol={0.8} dur={8.5} />
      <Sfx at={9.2} src="sfx/demon-whisper.wav" vol={0.75} />
      <Sfx at={12} src="sfx/train-rumble.wav" vol={0.4} dur={4} />
      <Sfx at={13.2} src="sfx/demon-whisper.wav" vol={0.6} />
      <Sfx at={16} src="sfx/murmur.wav" vol={0.5} dur={4} />
      <Sfx at={18.6} src="sfx/demon-whisper.wav" vol={0.6} />
      <Sfx at={20.3} src="sfx/demon-whisper.wav" vol={0.7} />
      <Sfx at={22.2} src="sfx/crumple.wav" vol={0.8} />
      <Sfx at={23.8} src="sfx/notification-ping.wav" vol={0.45} />
      <Sfx at={24.6} src="sfx/demon-whisper.wav" vol={0.7} />
      <Sfx at={27.8} src="sfx/page-flip.wav" vol={0.6} />
      <Sfx at={29.3} src="sfx/page-flip.wav" vol={0.6} />
      <Sfx at={30.8} src="sfx/page-flip.wav" vol={0.6} />
      <Sfx at={32.75} src="sfx/drawer-close.wav" vol={0.8} />
      <Sfx at={35.5} src="sfx/whisper-cloud.wav" vol={0.8} dur={4.5} />
      <Sfx at={35.8} src="sfx/echo-swell.wav" vol={0.6} />
    </AbsoluteFill>
  );
};
