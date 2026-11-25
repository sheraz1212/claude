import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {Classroom, CLASS_Y, FRIEND2, FRIEND3, GIRL, GREY, SchoolChair, SchoolDesk, Street, STREET_Y, TAN, TEACHER, TileCloud, UniHall, UNI_Y, YEL_L} from './sets';

/*
 ONE MORE VIDEO - Clip 2 (33 s)   MUSIC: dark pad, slow, heavy, lazy + low pedal chords, no melody
  0-7    WIDE morning street: he drags himself to uni, tired eyes                        (place, cost)
  7-15   MEDIUM uni hallway: his friend (girl) talks - "did you finish the notes?" - he stares, she waves
  15-24  WIDE classroom: teacher at the board; above his head a cloud of blurred dark-yellow tiles;
         "you with us?" - everyone turns
  24-33  WIDE street at dusk: he walks home alone, head down
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.78;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const x = interpolate(t, [0, 7], [-80, 1100], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={960} cy={640} dy={-40}>
          <Street t={t} dusk={1} lamp={0.35} />
          <HeroSide id="p1" x={1700 - t * 120} y={STREET_Y} scale={0.72} dir={-1} phase={t * 6.5} color={GREY} accessory="cap" accessoryColor="#5a4a2a" jacket="#3a3a50" mouth={0.2} />
          <HeroSide id="hw" x={x} y={STREET_Y} scale={S} dir={1} phase={t * 4} lean={8} headTilt={10} brow={0.4} lid={0.55} mouth={-0.2} />
        </Cam>
      </Stage>
    );
  }
  if (t < 15) {
    const wave = t > 11.0 && t < 13.2 ? Math.sin(t * 14) * 30 : 0;
    const waving = t > 11.0 && t < 13.2;
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.35} cx={980} cy={620} dy={-60}>
          <UniHall t={t} />
          <HeroSide id="c1" x={1420 + (t - 7) * 120} y={UNI_Y} scale={0.72} dir={1} phase={t * 6} color={TAN} accessory="glasses" jacket="#4a3a3a" mouth={0.2} />
          <Hero id="girl" x={1180} y={UNI_Y} scale={S} pose="arms-down" {...GIRL} lHand={waving ? [-200 + wave, -330] : undefined}
            expr={{brow: waving ? 0.4 : -0.1, lid: 0, mouth: waving ? 0.1 : 0.5, eyeX: -16}} blink={blinkAt(t, [9.6])} />
          <Hero id="h" x={860} y={UNI_Y} scale={S} pose="arms-down" headTilt={6}
            expr={{brow: 0.2, lid: 0.55, mouth: -0.1, eyeX: 0, eyeY: 10, bags: true}} blink={blinkAt(t, [13.6])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 24) {
    const turn = interpolate(t, [20.6, 21.0], [0, 1], cl);
    const snap = interpolate(t, [21.4, 21.8], [0, 1], cl);
    const desks = [700, 1000, 1300, 1600];
    const kids = [
      {id: 's1', ...FRIEND2},
      {id: 's2', ...FRIEND3},
      null,
      {id: 's4', ...GIRL},
    ];
    return (
      <Stage bg="#0d0c11">
        <Cam s={interpolate(t, [15, 24], [1.0, 1.05], cl)} cx={1100} cy={620} dy={-40}>
          <Classroom t={t} />
          <Hero id="tch" x={420} y={CLASS_Y} scale={S} pose="arms-down" {...TEACHER} rHand={turn ? [150, -260] : [130, -340]} expr={{brow: turn ? 0.3 : 0, mouth: turn ? -0.2 : 0.3, eyeX: turn ? 18 : 8}} />
          {desks.map((x, i) => (
            <g key={x}>
              <SchoolChair x={x} />
              {kids[i] ? (
                <Hero x={x} y={790} scale={S} sit pose="arms-down" {...kids[i]!} lHand={[-50, -110]} rHand={[50, -110]}
                  expr={{brow: 0, lid: 0.15, mouth: 0.1, eyeX: turn ? (x < 1300 ? 16 : -16) : -16, eyeY: -4}} blink={blinkAt(t, [16.5 + i, 19.5 + i])} />
              ) : (
                <Hero id="h" x={x} y={790} scale={S} sit pose="arms-down" lHand={[-50, -110]} rHand={[50, -110]} headTilt={snap ? 0 : 8}
                  expr={{brow: snap ? 0.6 : 0.2, lid: snap ? 0 : 0.55, mouth: snap ? -0.3 : 0, eyeY: snap ? 0 : 12, bags: true}} />
              )}
              <SchoolDesk x={x} />
            </g>
          ))}
          <TileCloud x={1300} y={290} t={t} s={0.85} o={1 - snap} />
        </Cam>
      </Stage>
    );
  }
  const x = interpolate(t, [24, 33], [1950, 700], cl);
  return (
    <Stage bg="#0d0c11">
      <Cam s={1.0} cx={960} cy={640} dy={-40}>
        <Street t={t} dusk={1} lamp={0.9} />
        <HeroSide id="hw2" x={x} y={STREET_Y} scale={S} dir={-1} phase={t * 3.6} lean={10} headTilt={14} brow={0.5} lid={0.5} mouth={-0.3} />
      </Cam>
    </Stage>
  );
};

export const OneClip2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="VIDEOS" showFrom={0} changes={[[0, '17']]} />
      <Sequence from={sec(0.8)} durationInFrames={sec(5.6)}>
        <Caption text="Morning came too **fast**." dur={sec(5.6)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(7.6)} durationInFrames={sec(2.8)}>
        <HeadPill text="did you finish the notes?" x={1360} y={371} side="right" dur={sec(2.8)} />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(3.8)}>
        <Caption text="He was there. But not **there**." dur={sec(3.8)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(20.6)} durationInFrames={sec(2.6)}>
        <HeadPill text="you with us?" x={420} y={330} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(25.0)} durationInFrames={sec(7.4)}>
        <Caption text="Every day, the **same**." dur={sec(7.4)} highlight={YEL_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/street-amb.wav" vol={0.3} dur={7} fadeOut={0.6} />
      <Sfx at={0.3} src="sfx/footsteps.wav" vol={0.25} dur={6.4} />
      <Sfx at={7.0} src="sfx/murmur.wav" vol={0.3} dur={8} fadeIn={0.4} fadeOut={0.8} />
      <Sfx at={7.6} src="sfx/pop-8bit-3.wav" vol={0.45} />
      <Sfx at={15.0} src="sfx/room-tone.wav" vol={0.35} dur={9} />
      <Sfx at={15.4} src="sfx/pencil.wav" vol={0.25} />
      <Sfx at={20.6} src="sfx/pop-8bit-1.wav" vol={0.45} />
      <Sfx at={21.2} src="sfx/chair-creak.wav" vol={0.35} />
      <Sfx at={24.0} src="sfx/street-amb.wav" vol={0.3} dur={9} fadeIn={0.5} fadeOut={1} />
      <Sfx at={24.2} src="sfx/footsteps.wav" vol={0.2} dur={8.4} />
    </AbsoluteFill>
  );
};
