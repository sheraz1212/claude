import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, GREY, Person, SCARF, Stage, TAN} from '../common/sets';
import {ArtClass, DeskRoom, Doodle} from '../common/echoSets';
import {Cafe, Kid, Rooftop, Teacher} from '../common/echoSets2';
import {WallArt} from './Part1';
import {C, FPS, sec} from '../common/theme';

// The Echo — Part 6: Warm ending + end card (3:00–3:35). MUSIC: hopeful-guitar (file from 7 s → final chord at 29 s). Shots 39–43.
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const HAPPY = {brow: -0.1, mouth: 0.8};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const sc = Math.sin(t * 16) * 6;
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 6], [1.0, 1.05], cl)} cx={960} cy={560}>
          <DeskRoom
            t={t}
            lamp={1}
            sky={{top: '#5b7bb0', bottom: '#f2c27a', sun: 1}}
            warmFlood={1}
            mid={<Hero id="e61" x={960} y={820} lHand={[-50, -130]} rHand={[150 + sc, -175 + sc * 0.5]} rHold="pencil" expr={{...HAPPY, eyeX: 9, eyeY: 6}} blink={blinkAt(t, [3.6])} />}
            front={
              <>
                <WallArt n={Math.floor(interpolate(t, [0.5, 5], [0, 6.99], cl))} />
                <Doodle x={1040} y={560} w={170} h={130} draw={interpolate(t, [0, 5.5], [0.2, 1], cl)} />
              </>
            }
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 11) {
    const pin = interpolate(t, [6.6, 8.0], [0, 1], {...cl, easing: io});
    const placed = t >= 8.0;
    const clap = Math.abs(Math.sin(t * 14)) * (t > 8.3 ? 1 : 0);
    return (
      <Stage>
        <Cam s={interpolate(t, [6, 11], [1.05, 1.1], cl)} cx={1000} cy={540}>
          <ArtClass t={t} emptySpot={!placed} warm={1}>
            {!placed && <Doodle x={interpolate(pin, [0, 1], [1050, 975])} y={interpolate(pin, [0, 1], [FLOOR - 540, 225 + 18])} w={180} h={130} />}
            <Hero id="e62" x={1065} y={FLOOR} showLegs lHand={[-90, -110]} rHand={placed ? [92, -110] : [interpolate(pin, [0, 1], [100, 40]), interpolate(pin, [0, 1], [-300, -470])]} expr={{...HAPPY, eyeY: placed ? 0 : -10, eyeX: placed ? -10 : 0}} blink={blinkAt(t, [9.4])} />
            <Teacher x={1460} y={FLOOR} pose="arms-down" headTilt={t > 8.4 ? Math.sin((t - 8.4) * 8) * 4 : 0} expr={{mouth: 0.9, eyeX: -12}} />
            <Person id="c62a" x={560} y={FLOOR} showLegs color={TAN} accessory="headphones" accessoryColor="#6f8fb0" lHand={[-20 - clap * 30, -200]} rHand={[20 + clap * 30, -200]} expr={{mouth: 1, eyeX: 12}} />
            <Person id="c62b" x={760} y={FLOOR} showLegs scale={0.95} color={GREY} accessory="glasses" lHand={[-20 - (1 - clap) * 30, -200]} rHand={[20 + (1 - clap) * 30, -200]} expr={{mouth: 1, eyeX: 12}} />
          </ArtClass>
        </Cam>
      </Stage>
    );
  }
  if (t < 19) {
    const tape = interpolate(t, [11.5, 12.8], [0, 1], {...cl, easing: io});
    const turn = interpolate(t, [13.4, 14.0], [0, 1], cl);
    const nod = t > 17.6 && t < 18.6 ? Math.sin((t - 17.6) * 12) * 4 : 0;
    return (
      <Stage>
        <Cam s={interpolate(t, [11, 19], [1.08, 1.14], cl)} cx={1060} cy={540}>
          <Cafe
            t={t}
            onWindow={
              <g>
                <Doodle x={860} y={250} w={120} h={90} kid note={false} />
                <rect x={905} y={244} width={30} height={12} fill="#e9e2c8" opacity={0.8} />
                {tape >= 1 && <Doodle x={1020} y={240} w={170} h={128} />}
              </g>
            }
          >
            {tape < 1 && <Doodle x={interpolate(tape, [0, 1], [1210, 1020])} y={interpolate(tape, [0, 1], [430, 240])} w={170} h={128} />}
            <Hero id="e63" x={1290} y={FLOOR} showLegs lHand={[-90, -110]} rHand={tape < 1 ? [interpolate(tape, [0, 1], [10, -150]), interpolate(tape, [0, 1], [-370, -560])] : [92, -110]} headTilt={nod} expr={{...HAPPY, eyeX: tape < 1 ? -10 : -14, eyeY: tape < 1 ? -8 : 6}} blink={blinkAt(t, [15.2])} />
            <Kid x={980} y={FLOOR} showLegs expr={{mouth: 1, eyeX: interpolate(turn, [0, 1], [4, 12]), eyeY: interpolate(turn, [0, 1], [-12, 0])}} blink={blinkAt(t, [16.3])} />
          </Cafe>
        </Cam>
      </Stage>
    );
  }
  const wide = t >= 24;
  return (
    <Stage>
      <Cam s={wide ? interpolate(t, [24, 29], [1.25, 1.0], {...cl, easing: io}) : interpolate(t, [19, 24], [1.35, 1.4], cl)} cx={960} cy={wide ? 600 : 620}>
        <Rooftop t={t}>
          <Person id="rf" x={720} y={850} color={GREY} accessory="scarf" accessoryColor={SCARF} lHand={[-50, -160]} rHand={[50, -150 + Math.sin(t * 8) * 5]} rHold="pencil" expr={{mouth: 0.8, eyeX: 10, eyeY: 8}} />
          <Hero id="rh" x={960} y={850} lHand={[-50, -160]} rHand={[50, -150 + Math.sin(t * 9) * 5]} rHold="pencil" expr={{...HAPPY, eyeX: wide ? 12 : 8, eyeY: wide ? -4 : 8}} blink={blinkAt(t, [21.5, 26.2])} />
          <Kid x={1170} y={820} lHand={[-50, -160]} rHand={[50, -150 + Math.sin(t * 7) * 6]} rHold="pencil" expr={{mouth: 1, eyeX: -10, eyeY: 8}} />
          <Doodle x={890} y={640} w={70} h={52} />
        </Rooftop>
      </Cam>
    </Stage>
  );
};

export const EchoPart6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 29 && <Shots t={t} />}
      <FilmLook />
      <Counter label="ECHOES" showFrom={0} changes={[[0, '0'], [sec(6), '']]} />
      <Sequence from={sec(1.0)} durationInFrames={sec(4.5)}>
        <Caption text="He drew **again**." dur={sec(4.5)} />
      </Sequence>
      <Sequence from={sec(14.0)} durationInFrames={sec(3.5)}>
        <HeadPill text="Can you teach me?" x={1060 + (980 - 1060) * 1.12} y={540 + (FLOOR - 0.62 * 430 - 540) * 1.12 - 14} dur={sec(3.5)} />
      </Sequence>
      <Sequence from={sec(29)} durationInFrames={sec(6)}>
        <BlackCard text="Choose your voice." dur={sec(6)} />
      </Sequence>
      {/* MUSIC: hopeful-guitar */}
      <Sfx at={0} src="music/hopeful-guitar.wav" vol={0.75} from={7.0} />
      {/* SFX */}
      <Sfx at={0.4} src="sfx/pencil.wav" vol={0.45} />
      {[1.2, 2.0, 2.7, 3.4, 4.1].map((s) => (
        <Sfx key={s} at={s} src="sfx/pin-tap.wav" vol={0.5} />
      ))}
      <Sfx at={7.95} src="sfx/pin-tap.wav" vol={0.7} />
      <Sfx at={8.4} src="sfx/claps.wav" vol={0.6} />
      <Sfx at={12.7} src="sfx/page-flip.wav" vol={0.5} />
      <Sfx at={15.0} src="sfx/soft-laugh.wav" vol={0.5} />
      <Sfx at={19} src="sfx/wind.wav" vol={0.35} dur={10} />
      <Sfx at={19.5} src="sfx/birds.wav" vol={0.3} />
    </AbsoluteFill>
  );
};
