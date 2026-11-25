import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, GREY, Person, SCARF, Stage, TAN} from '../common/sets';
import {ArtClass, DeskRoom, Doodle, EchoWords, Table} from '../common/echoSets';
import {Cafe, HandsInsert, Kid, Street, WallInsert} from '../common/echoSets2';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 3: Contrast (1:15–1:50). MUSIC: none. Shots 21–28.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const SAD = {brow: 0.7, lid: 0.35, mouth: -0.4, eyeY: 6, bags: true};
const NIGHT = {top: '#070b14', bottom: '#0d1526'};

const Shots: React.FC<{t: number}> = ({t}) => {
  const laugh = (k: number) => Math.sin(t * 6 + k) * 4;
  if (t < 4.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 4.5], [1.0, 1.05], cl)} cx={960} cy={600}>
          <ArtClass t={t} emptySpot={false} warm={0.9}>
            <Person id="s1" x={620} y={FLOOR} showLegs color={GREY} accessory="glasses" lHand={[-60, -150]} rHand={[110, -260]} headTilt={laugh(0)} expr={{mouth: 1, eyeX: 10}} blink={blinkAt(t, [2.1])} />
            <Doodle x={620 + 110 - 60} y={FLOOR - 260 - 90} w={110} h={84} />
            <Person id="s2" x={940} y={FLOOR} showLegs color={TAN} accessory="bow" accessoryColor="#e07b8a" pose="arms-down" headTilt={laugh(1)} expr={{mouth: 1, eyeX: -10, lid: 0.4}} />
            <Person id="s3" x={1260} y={FLOOR} showLegs color={TAN} accessory="headphones" accessoryColor="#6f8fb0" lHand={[-120, -240]} rHand={[90, -120]} headTilt={laugh(2)} expr={{mouth: 0.9, eyeX: -12}} blink={blinkAt(t, [3.3])} />
            <Doodle x={1260 - 120 - 60} y={FLOOR - 240 - 90} w={110} h={84} />
          </ArtClass>
        </Cam>
      </Stage>
    );
  if (t < 9.5) {
    const reach = interpolate(t, [6.8, 7.6, 8.2, 8.9], [0, 1, 1, 0], {...cl, easing: io});
    const loom = interpolate(t, [7.6, 8.3], [0, 1], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [4.5, 9.5], [1.35, 1.4], cl)} cx={960} cy={560}>
          <ArtClass t={t} emptySpot={false} warm={0.8}>
            <Person id="fr" x={1150} y={FLOOR} showLegs color={GREY} accessory="scarf" accessoryColor={SCARF} lHand={[-150, -250]} rHand={[90, -120]} headTilt={-5} expr={{mouth: 0.8 - loom * 0.6, brow: loom * 0.5, eyeX: -12}} blink={blinkAt(t, [6.2])} />
            <Doodle x={1150 - 150 - 60} y={FLOOR - 250 - 95} w={120} h={92} />
            <Hero id="h22" x={760} y={FLOOR} showLegs lHand={[-90, -110]} rHand={[interpolate(reach, [0, 1], [90, 190]), interpolate(reach, [0, 1], [-110, -240])]} headTilt={loom * 8} expr={{brow: 0.3 + loom * 0.6, lid: 0.2, mouth: -0.1 - loom * 0.4, eyeX: 10 - loom * 16, eyeY: loom * 8, bags: true}} blink={blinkAt(t, [5.6])} />
            <EchoWords t={t} n={2 + loom * 9} area={[540, 330, 1000, 600]} size={[60, 110 + loom * 100]} seed={21} />
          </ArtClass>
        </Cam>
      </Stage>
    );
  }
  if (t < 13.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [9.5, 13.5], [1.0, 1.45], {...cl, easing: io})} cx={1065} cy={300}>
          <ArtClass t={t} emptySpot warm={0.7} />
        </Cam>
      </Stage>
    );
  if (t < 18) {
    const tape = interpolate(t, [15.6, 16.8], [0, 1], {...cl, easing: io});
    const nx = interpolate(tape, [0, 1], [930, 1000]);
    const ny = interpolate(tape, [0, 1], [640, 300]);
    return (
      <Stage>
        <Cam s={interpolate(t, [13.5, 18], [1.05, 1.1], cl)} cx={960} cy={540}>
          <Cafe
            t={t}
            onWindow={
              tape >= 1 ? (
                <g>
                  <Doodle x={940} y={250} w={120} h={90} kid note={false} />
                  <rect x={985} y={244} width={30} height={12} fill="#e9e2c8" opacity={0.8} />
                </g>
              ) : undefined
            }
          >
            <Person id="mom" x={720} y={820} color={TAN} accessory="glasses" lHand={[-60, -130]} rHand={tape > 0 && tape < 1 ? [nx - 720, ny - 820 + 60] : [70, -130]} headTilt={6} expr={{mouth: 0.9, eyeX: 12}} blink={blinkAt(t, [14.6])} />
            <Kid x={1100} y={740} lHand={[-50, -130]} rHand={[60 + Math.sin(t * 16) * (tape > 0 ? 0 : 6), -150]} rHold={tape > 0 ? 'none' : 'pencil'} expr={{mouth: 1, eyeX: tape > 0 ? -12 : -6, eyeY: tape > 0 ? -10 : 8}} />
            <Table x={920} w={700}>{tape < 1 && <Doodle x={nx - 60} y={ny - 45} w={120} h={90} kid note={false} />}</Table>
          </Cafe>
        </Cam>
      </Stage>
    );
  }
  if (t < 21)
    return (
      <Stage>
        <HandsInsert t={t} />
      </Stage>
    );
  if (t < 26) {
    const walk = interpolate(t, [21, 26], [0, 1], cl);
    const clap = Math.abs(Math.sin(t * 14));
    return (
      <Stage>
        <Cam s={1.02} cx={960} cy={560}>
          <Street t={t}>
            <Person id="art" x={1460} y={FLOOR} showLegs color={GREY} accessory="glasses" lHand={[-90, -110]} rHand={[-150, -330 + Math.sin(t * 5) * 30]} headTilt={-6} expr={{mouth: 0.6, eyeX: -12, eyeY: -6}} />
            <Person id="cl1" x={420} y={FLOOR} showLegs scale={0.9} color={TAN} accessory="tie" accessoryColor={C.amber} lHand={[-20 - clap * 30, -200]} rHand={[20 + clap * 30, -200]} expr={{mouth: 1, eyeX: 12}} />
            <Person id="cl2" x={250} y={FLOOR} showLegs scale={0.85} color={GREY} accessory="bow" accessoryColor="#e07b8a" lHand={[-20 - (1 - clap) * 30, -200]} rHand={[20 + (1 - clap) * 30, -200]} expr={{mouth: 1, eyeX: 12}} />
            <Hero id="h26" x={-120 + walk * 2200} y={FLOOR + 110} scale={1.25} showLegs walk={t * 6} pose="arms-down" headTilt={10} expr={{...SAD, eyeY: 12}} />
            <EchoWords t={t} n={4} area={[-120 + walk * 2200 - 220, 330, -120 + walk * 2200 + 220, 560]} size={[50, 110]} seed={26} />
          </Street>
        </Cam>
      </Stage>
    );
  }
  if (t < 30.5)
    return (
      <Stage>
        <Cam s={interpolate(t, [26, 30.5], [1.0, 1.08], cl)} cx={960} cy={540}>
          <WallInsert left={0} pull={0} />
        </Cam>
      </Stage>
    );
  return (
    <Stage bg="#0c0e12">
      <Cam s={interpolate(t, [30.5, 35], [1.3, 1.36], cl)} cx={960} cy={600}>
        <DeskRoom
          t={t}
          lamp={0}
          sky={NIGHT}
          mid={<Hero id="h28" x={960} y={850} lHand={[-80, -200]} rHand={[80, -200]} headTilt={14} expr={{brow: 0.8, lid: 1, mouth: -0.4, bags: true}} />}
          front={<EchoWords t={t} n={10} area={[560, 260, 1360, 560]} size={[60, 150]} seed={28} />}
        />
      </Cam>
    </Stage>
  );
};

export const EchoPart3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="ECHOES" showFrom={0} changes={[[0, '650'], [sec(7.8), '700'], [sec(9.5), '780'], [sec(21), '850'], [sec(30.5), '900']]} />
      <Sequence from={sec(0.5)} durationInFrames={sec(3.8)}>
        <Caption text="Others kept **creating**." dur={sec(3.8)} />
      </Sequence>
      <Sequence from={sec(10.0)} durationInFrames={sec(3.3)}>
        <Caption text="His spot stayed **empty**." dur={sec(3.3)} highlight={C.coldLight} />
      </Sequence>
      <Sequence from={sec(4.8)} durationInFrames={sec(2.6)}>
        <HeadPill text="Draw with us?" x={960 + (1150 - 960) * 1.35} y={560 + (432 - 560) * 1.35 - 10} dur={sec(2.6)} />
      </Sequence>
      {/* SFX (MUSIC: none) */}
      <Sfx at={0} src="sfx/murmur.wav" vol={0.6} dur={4.5} />
      <Sfx at={1.2} src="sfx/soft-laugh.wav" vol={0.5} />
      <Sfx at={7.8} src="sfx/demon-whisper.wav" vol={0.8} />
      <Sfx at={9.5} src="sfx/murmur.wav" vol={0.35} dur={4} />
      <Sfx at={13.5} src="sfx/plates.wav" vol={0.3} />
      <Sfx at={16.0} src="sfx/soft-laugh.wav" vol={0.55} />
      <Sfx at={18.4} src="sfx/demon-whisper.wav" vol={0.5} />
      <Sfx at={21.5} src="sfx/claps.wav" vol={0.7} />
      <Sfx at={21} src="sfx/footsteps.wav" vol={0.35} />
      <Sfx at={23.6} src="sfx/footsteps.wav" vol={0.3} dur={2.4} />
      <Sfx at={26.5} src="sfx/room-tone.wav" vol={0.6} dur={4} />
      <Sfx at={31.0} src="sfx/demon-whisper.wav" vol={0.7} />
    </AbsoluteFill>
  );
};
