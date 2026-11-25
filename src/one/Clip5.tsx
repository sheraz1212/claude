import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Ball, Classroom, CLASS_Y, FLOOR_Y, FRIEND, FRIEND2, FRIEND3, GIRL, Road, Room, SchoolChair, SchoolDesk, Street, STREET_Y, TEACHER, UniHall, UNI_Y} from './sets';

/*
 ONE MORE VIDEO - Clip 5 (33 s)   MUSIC: pads far back; fast piano + driving drums (the fight)
  0-6.5   WIDE street: he plays ball with his friends, scores, high-five            DAYS CLEAN 1
  6.5-12  WIDE road at night: he runs under the street lamps                         DAYS CLEAN 5
  12-18   MEDIUM his room: squats, the drawer shut                                   DAYS CLEAN 9
  18-24   WIDE classroom: he raises his hand and answers; the teacher nods          DAYS CLEAN 15
  24-33   MEDIUM uni hallway: the girl talks - this time he listens and laughs       DAYS CLEAN 21
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.78;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6.5) {
    const kick = interpolate(t, [2.2, 3.4], [0, 1], cl);
    const bx = 600 + kick * 1100;
    const by = STREET_Y - 22 - Math.sin(kick * Math.PI) * 200;
    const five = t > 4.2;
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={960} cy={640} dy={-40}>
          <Street t={t} dusk={1} />
          <Hero id="a" x={1100} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND} lHand={five ? [-150, -330] : undefined} expr={{mouth: 0.9, lid: 0.3, eyeX: -16}} />
          <Hero id="b" x={1450} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND2} rHand={kick > 0.9 ? [150, -340] : undefined} expr={{mouth: 0.8, eyeX: -12}} />
          <Hero id="c" x={1750} y={STREET_Y} scale={0.75} pose="arms-down" {...FRIEND3} expr={{mouth: kick > 0.9 ? -0.3 : 0.4, brow: 0.3, eyeX: -16}} />
          {t < 2.2 ? (
            <HeroSide id="hr" x={300 + t * 130} y={STREET_Y} scale={S} dir={1} phase={t * 8} run={0.5} mouth={0.6} brow={-0.3} />
          ) : (
            <Hero id="h" x={600 + Math.min(1, (t - 2.2) / 1.6) * 330} y={STREET_Y} scale={S} pose="arms-down" rHand={five ? [150, -330] : undefined}
              expr={{brow: -0.2, lid: five ? 0.4 : 0, mouth: 0.9, eyeX: 16}} />
          )}
          {kick < 1 && <Ball x={t < 2.2 ? 380 + t * 130 + 50 : bx} y={t < 2.2 ? STREET_Y - 22 : by} />}
        </Cam>
      </Stage>
    );
  }
  if (t < 12)
    return (
      <Stage bg="#0d0c11">
        <Road t={t} scroll={(t - 6.5) * 520} />
        <HeroSide id="run" x={900} y={880} scale={S} dir={1} phase={t * 11} run={1} brow={-0.5} mouth={-0.1} />
      </Stage>
    );
  if (t < 18) {
    const sq = (Math.sin((t - 12) * 4.2) + 1) / 2; // squat up/down
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.25} cx={800} cy={640} dy={-40}>
          <Room t={t} time="07:10" lamp={1} moon={false} />
          <Hero id="sq" x={760} y={FLOOR_Y + sq * 40} scale={0.8} pose="arms-down" lHand={[-120, -260 - sq * 20]} rHand={[120, -260 - sq * 20]}
            expr={{brow: -0.5, lid: 0.1, mouth: -0.1}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 24) {
    const up = interpolate(t, [18.6, 19.2], [0, 1], cl);
    const nod = t > 21.4 ? Math.sin((t - 21.4) * 8) * 4 : 0;
    const desks = [700, 1000, 1300, 1600];
    const kids = [FRIEND2, FRIEND3, null, GIRL];
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={1100} cy={620} dy={-40}>
          <Classroom t={t} board="x + 7 = 12" />
          <Hero id="tch" x={420} y={CLASS_Y} scale={S} pose="arms-down" {...TEACHER} headTilt={nod} expr={{brow: -0.1, mouth: t > 21.4 ? 0.7 : 0.2, eyeX: 18}} />
          {desks.map((x, i) => (
            <g key={x}>
              <SchoolChair x={x} />
              {kids[i] ? (
                <Hero id={`k${i}`} x={x} y={790} scale={S} sit pose="arms-down" {...kids[i]!} lHand={[-50, -110]} rHand={[50, -110]} expr={{lid: 0.1, mouth: 0.2, eyeX: t > 19.4 ? (x < 1300 ? 16 : -16) : -16}} />
              ) : (
                <Hero id="h" x={x} y={790} scale={S} sit pose="arms-down" lHand={[-50, -110]} rHand={up ? [60, -400 * up] : [50, -110]}
                  expr={{brow: -0.2, lid: 0, mouth: 0.5, eyeX: -16}} blink={blinkAt(t, [22.6])} />
              )}
              <SchoolDesk x={x} />
            </g>
          ))}
        </Cam>
      </Stage>
    );
  }
  const laugh = t > 28.4 && t < 31 ? Math.abs(Math.sin(t * 9)) * 4 : 0;
  return (
    <Stage bg="#0d0c11">
      <Cam s={1.35} cx={980} cy={620} dy={-60}>
        <UniHall t={t} />
        <Hero id="girl" x={1180} y={UNI_Y + laugh} scale={S} pose="arms-down" {...GIRL} expr={{brow: -0.1, lid: laugh ? 0.5 : 0, mouth: 0.6 + (laugh ? 0.3 : 0), eyeX: -16}} blink={blinkAt(t, [25.6])} />
        <Hero id="h" x={860} y={UNI_Y + laugh} scale={S} pose="arms-down" expr={{brow: -0.1, lid: laugh ? 0.5 : 0, mouth: 0.8, eyeX: 16}} blink={blinkAt(t, [27.0])} />
      </Cam>
    </Stage>
  );
};

export const OneClip5: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="DAYS CLEAN" showFrom={0} changes={[[0, '1'], [sec(6.5), '5'], [sec(12), '9'], [sec(18), '15'], [sec(24), '21']]} />
      <Sequence from={sec(0.6)} durationInFrames={sec(5.6)}>
        <Caption text="He went **outside**." dur={sec(5.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(7.0)} durationInFrames={sec(4.6)}>
        <Caption text="He ran it **out**." dur={sec(4.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(12.6)} durationInFrames={sec(5.0)}>
        <Caption text="He got **stronger**." dur={sec(5.0)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(19.4)} durationInFrames={sec(2.2)}>
        <HeadPill text="x = 5" x={1300} y={330} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(21.6)} durationInFrames={sec(2.2)}>
        <HeadPill text="good." x={420} y={330} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(24.6)} durationInFrames={sec(2.4)}>
        <HeadPill text="did you finish the notes?" x={1360} y={371} side="right" dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(27.0)} durationInFrames={sec(2.2)}>
        <HeadPill text="notes? sure." x={732} y={371} side="left" dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(29.4)} durationInFrames={sec(3.4)}>
        <Caption text="He came **back**." dur={sec(3.4)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/street-amb.wav" vol={0.3} dur={6.5} fadeOut={0.5} />
      <Sfx at={0.2} src="sfx/run-steps.wav" vol={0.3} dur={2} />
      <Sfx at={2.2} src="sfx/ball-kick.wav" vol={0.55} />
      <Sfx at={3.4} src="sfx/far-cheer.wav" vol={0.35} />
      <Sfx at={4.3} src="sfx/claps.wav" vol={0.4} />
      <Sfx at={6.5} src="sfx/run-steps.wav" vol={0.35} dur={5.5} />
      <Sfx at={6.5} src="sfx/heavy-breath.wav" vol={0.25} dur={5.5} />
      <Sfx at={12.0} src="sfx/room-tone.wav" vol={0.3} dur={6} />
      <Sfx at={18.0} src="sfx/room-tone.wav" vol={0.3} dur={6} />
      <Sfx at={19.4} src="sfx/pop-8bit-2.wav" vol={0.45} />
      <Sfx at={21.6} src="sfx/pop-8bit-3.wav" vol={0.45} />
      <Sfx at={24.0} src="sfx/murmur.wav" vol={0.3} dur={9} fadeIn={0.4} fadeOut={0.8} />
      <Sfx at={24.6} src="sfx/pop-8bit-1.wav" vol={0.45} />
      <Sfx at={27.0} src="sfx/pop-8bit-2.wav" vol={0.45} />
      <Sfx at={28.4} src="sfx/soft-laugh.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
