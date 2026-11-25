import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon, DemonSide} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, GREY, Stage, TAN} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {HEADBAND, JACKET, PARK_Y, ParkRace, Ribbon, SchoolTrack} from './sets';

/*
 THE KID WHO FELL — Clip 3 (32 s): the park.
  0–7    WIDE dusk park: he walks home, the demon walks behind him            → his routine
  7–13   WIDE a kids' race on the park path, parents cheering                 → the mirror of his past
  13–19  MEDIUM the little kid with the yellow headband trips and cries       → the wound, again
  19–25  CLOSE his face; flash cuts of himself falling on the school track    → memory
  25–32  MEDIUM the demon grips his shoulder: "don't. they'll laugh."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#ff7a7a';
const G = PARK_Y;
const HS = 0.78;
const RUNNERS = [
  {c: GREY, a: 'cap' as const, ac: '#3f6a4e', off: 0},
  {c: TAN, a: 'none' as const, ac: '', off: 60},
  {c: '#c9ad86', a: 'cap' as const, ac: '#8a3b3b', off: -80},
  {c: GREY, a: 'none' as const, ac: '', off: 140},
];

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 7) {
    const x = interpolate(t, [0, 7], [300, 980], cl);
    return (
      <Stage>
        <ParkRace t={t} cheer={0} />
        <DemonSide id="ds" x={x - 260} y={G} t={t} scale={HS} size={1.0} dir={1} phase={t * 6} />
        <ellipse cx={x} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        <HeroSide id="h" x={x} y={G} scale={HS} dir={1} jacket={JACKET} phase={t * 6} brow={0.3} lid={0.35} mouth={-0.2} headTilt={6} />
      </Stage>
    );
  }
  if (t < 13) {
    return (
      <Stage>
        <ParkRace t={t} cheer={1} />
        <Ribbon x={1560} />
        {RUNNERS.map((r, i) => (
          <HeroSide key={i} id={`r${i}`} x={interpolate(t, [7, 13], [-80 + r.off, 1300 + r.off], cl)} y={G + 10 + (i % 2) * 30} scale={0.36} color={r.c} accessory={r.a} accessoryColor={r.ac} phase={t * 16 + i} run={1} mouth={0.6} />
        ))}
        <HeroSide id="kid" x={interpolate(t, [7, 13], [-40, 1200], cl)} y={G + 25} scale={0.34} color={TAN} accessory="headband" accessoryColor={HEADBAND} phase={t * 17} run={1} mouth={0.8} brow={-0.2} />
        <HeroSide id="h" x={180} y={G - 20} scale={HS} dir={1} jacket={JACKET} brow={0.1} lid={0.2} mouth={0} />
      </Stage>
    );
  }
  if (t < 19) {
    const fall = interpolate(t, [13.6, 14.0], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
    const x = interpolate(t, [13, 13.6], [760, 900], cl) + interpolate(t, [14.0, 14.5], [0, 60], cl);
    const sitUp = t > 15.6;
    return (
      <Stage>
        <Cam s={1.7} cx={930} cy={975} dy={-330}>
          <ParkRace t={t} cheer={t < 14 ? 1 : 0} />
          {RUNNERS.map((r, i) => (
            <HeroSide key={i} id={`r${i}`} x={interpolate(t, [13, 17], [700 + r.off, 1900 + r.off], cl)} y={G + 10 + (i % 2) * 30} scale={0.36} color={r.c} accessory={r.a} accessoryColor={r.ac} phase={t * 16 + i} run={1} />
          ))}
          {!sitUp ? (
            <g transform={`rotate(${fall * 84} ${x} ${G + 25})`}>
              <HeroSide id="kid" x={x} y={G + 25} scale={0.34} color={TAN} accessory="headband" accessoryColor={HEADBAND} phase={t < 13.6 ? t * 17 : 13.6 * 17} run={1} brow={fall > 0.3 ? 0.9 : -0.2} mouth={fall > 0.3 ? -0.7 : 0.7} armUp={fall} />
            </g>
          ) : (
            <Hero id="kidF" x={980} y={G + 30} scale={0.42} classic sit color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-40, -150]} rHand={[40, -150]} expr={{brow: 0.9, lid: 0.5, mouth: -0.8, tear: interpolate(t, [15.8, 17.5], [0, 1], cl)}} blink={blinkAt(t, [17.9])} />
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 25) {
    const flash = (t > 21 && t < 21.5) || (t > 22.1 && t < 22.5) || (t > 23.1 && t < 23.4);
    if (flash)
      return (
        <Stage>
          <SchoolTrack t={t} crowd={0} />
          <g transform="rotate(84 900 935)">
            <HeroSide id="old" x={900} y={935} scale={0.66} brow={0.9} mouth={-0.7} armUp={1} />
          </g>
          <rect width={1920} height={1080} fill="#ff3b3b" opacity={0.12} />
        </Stage>
      );
    return (
      <Stage>
        <Cam s={2.3} cx={1000} cy={540} dy={60}>
          <ParkRace t={t} cheer={0} />
          <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" jacket={JACKET} expr={{brow: 0.7, lid: 0, mouth: -0.3, eyeX: 10, eyeY: 8}} blink={blinkAt(t, [20.2])} />
        </Cam>
      </Stage>
    );
  }
  const grip = interpolate(t, [25.3, 26.2], [0, 1], cl);
  return (
    <Stage>
      <Cam s={1.3} cx={900} cy={900} dy={-150}>
        <ParkRace t={t} cheer={0} />
        <Demon id="d" x={1110} y={G} t={t} scale={HS} size={1.1} lHand={[-60 - grip * 40, -150 - grip * 40]} headTilt={-14} lean={-6} />
        <ellipse cx={1000} cy={G + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
        <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" jacket={JACKET} lean={-3 * grip} expr={{brow: 0.75, lid: 0.15, mouth: -0.35, eyeX: -10, eyeY: 6}} blink={blinkAt(t, [29.6])} />
        <Hero id="kidF" x={520} y={G + 30} scale={0.42} classic sit color={TAN} accessory="headband" accessoryColor={HEADBAND} pose="arms-down" lHand={[-40, -150]} rHand={[40, -150]} expr={{brow: 0.9, lid: 0.5, mouth: -0.8, tear: 1}} />
      </Cam>
    </Stage>
  );
};

export const KidClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(1.0)} durationInFrames={sec(5.4)}>
        <Caption text="The same way **home**. Every night." dur={sec(5.4)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(8.0)} durationInFrames={sec(4.4)}>
        <Caption text="Then he saw a **race**." dur={sec(4.4)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(16.2)} durationInFrames={sec(2.6)}>
        <Caption text="A kid **fell**." dur={sec(2.6)} highlight={RED} />
      </Sequence>
      <Sequence from={sec(26.4)} durationInFrames={sec(2.8)}>
        <DemonSay text="don't. they'll laugh." x={1230} y={250} dur={sec(2.8)} size={58} />
      </Sequence>
      <Sequence from={sec(29.0)} durationInFrames={sec(2.9)}>
        <Caption text="He knew that **feeling**." dur={sec(2.9)} highlight={RED} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/sad-cello.wav" vol={0.7} dur={7.6} fadeIn={1} fadeOut={1} />
      <Sfx at={7.0} src="music/kids-run.wav" vol={0.75} dur={6.8} fadeIn={0.4} fadeOut={0.05} />
      <Sfx at={16.0} src="music/sad-cello.wav" from={12} vol={0.75} dur={16} fadeIn={1.5} fadeOut={1.5} />
      {/* SFX */}
      <Sfx at={0} src="sfx/footsteps.wav" vol={0.3} dur={7} />
      <Sfx at={7.2} src="sfx/far-cheer.wav" vol={0.4} dur={6.4} fadeOut={0.3} />
      <Sfx at={7.2} src="sfx/run-park.wav" vol={0.35} dur={6.6} />
      <Sfx at={13.9} src="sfx/fall-thud.wav" vol={0.6} />
      <Sfx at={14.0} src="sfx/crowd-gasp.wav" vol={0.45} />
      <Sfx at={19.2} src="sfx/heartbeat.wav" vol={0.45} dur={5.6} fadeOut={1} />
      <Sfx at={21.0} src="sfx/fall-thud.wav" vol={0.4} />
      <Sfx at={22.1} src="sfx/group-laugh.wav" vol={0.35} dur={1.4} fadeOut={0.3} />
      <Sfx at={25.4} src="sfx/goo.wav" vol={0.35} />
      <Sfx at={26.4} src="sfx/voice/inner-theyll-laugh.wav" vol={0.7} />
    </AbsoluteFill>
  );
};
