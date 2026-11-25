import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Blob} from './demonShim';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, GREY, Light, Person, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Cafe, CafeFg, MIA, Notes, PickNecklace, PURPLE, Street} from './sets';

/*
 SPOTLIGHT — Clip 6 (33 s): the mirrored ending + lesson.
  0–6    WIDE street (the repeated shot, reversed): Blob is a puddle; he OPENS the door
  6–13   WIDE café: he is on the stage now, knees shaking; Mia gives a thumbs up
  13–20  MEDIUM he plays; warm light fills the room
  20–25  WIDE the small crowd claps
  25–29  MIRROR of the opening shot: in the last seat, a shy kid mouths along
  29–33  BLACK lesson
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const OnStage: React.FC<{t: number; x?: number; warm?: number; shake?: number}> = ({t, x = 880, warm = 0, shake = 0}) => {
  const j = Math.sin(t * 38) * 3 * shake;
  return (
    <g>
      <Light id="warmS" x={880} y={470} r={700} color={C.amber} o={warm} />
      <Hero id="h" x={x + j} y={562} scale={0.55} guitar lHand={[-20, -125 + Math.sin(t * 9) * 12]} rHand={[135, -190]} glow={0.4 * warm} glowColor={C.amberLight}
        expr={{brow: 0.5 - warm * 0.8, lid: warm > 0.5 ? 0.7 : 0, mouth: -0.2 + warm * 0.8, eyeY: warm > 0.5 ? 0 : 8}} blink={blinkAt(t, [9.3])} />
      <PickNecklace x={x + j} y={562} scale={0.55} />
    </g>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) {
    const inK = interpolate(t, [0, 2.4], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const x = 300 + inK * 990;
    const reach = interpolate(t, [2.6, 3.2], [0, 1], cl);
    const door = interpolate(t, [3.2, 4.2], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const gone = interpolate(t, [4.6, 5.4], [1, 0], cl);
    return (
      <Stage>
        <Street t={t} dusk={1} doorOpen={door} />
        <Blob id="b" x={1080} y={864} t={t} size={0.35} melt={0.9} accent={PURPLE} lid={0.8} smile={-0.5} glow={0.2} />
        <g opacity={gone}>
          <ellipse cx={x} cy={902} rx={80} ry={12} fill="#000" opacity={0.3} />
          <Hero id="h" x={x} y={900} scale={0.85} walk={t < 2.4 ? t * 8 : undefined} pose="arms-down" rHand={reach > 0 ? [92 + reach * 40, -100 - reach * 51] : undefined}
            glow={door * 0.5} glowColor={C.amberLight} expr={{brow: 0.2, lid: 0, mouth: 0.2 + door * 0.4, eyeX: 14}} />
          <PickNecklace x={x} y={900} scale={0.85} />
        </g>
      </Stage>
    );
  }
  if (t < 13)
    return (
      <Stage>
        <Cam s={interpolate(t, [6, 13], [1.0, 1.08], cl)} cx={1000} cy={240}>
          <Cafe t={t} crowd={7} />
          <OnStage t={t} shake={t < 10.5 ? 1 : 0.3} warm={interpolate(t, [10.5, 13], [0, 0.4], cl)} />
          <Person id="mia" x={1290} y={640} scale={0.6} {...MIA} pose="arms-down" rHand={t > 8 ? [80, -300] : undefined} expr={{brow: -0.1, lid: 0, mouth: 0.8, eyeX: -16}} />
          <CafeFg cup={false} />
        </Cam>
      </Stage>
    );
  if (t < 20) {
    const warm = interpolate(t, [13, 16], [0.4, 1], cl);
    return (
      <Stage>
        <Cam s={2.3} cx={880} cy={430} dy={90}>
          <Cafe t={t} crowd={0} />
          <OnStage t={t} warm={warm} />
          <Notes t={t} x={940} y={360} n={6} o={warm} />
        </Cam>
      </Stage>
    );
  }
  if (t < 25)
    return (
      <Stage>
        <Cam s={1.06} cx={1000} cy={240}>
          <Cafe t={t + 0.3} crowd={8} />
          <OnStage t={t} warm={1} />
          <Person id="mia" x={1290} y={640} scale={0.6} {...MIA} pose="arms-down" lHand={[-30, -230 + Math.abs(Math.sin(t * 8)) * 20]} rHand={[30, -230 + Math.abs(Math.sin(t * 8 + 1)) * 20]} expr={{brow: 0, lid: 0.6, mouth: 0.9}} />
          <CafeFg cup={false} />
        </Cam>
      </Stage>
    );
  return (
    <Stage>
      <Cam s={interpolate(t, [25, 29], [1.0, 1.05], cl)} cx={1200} cy={240}>
        <Cafe t={t} crowd={7} />
        <OnStage t={t} warm={1} />
        <Person id="kid" x={1560} y={1000} scale={0.95} color={GREY} accessory="glasses" pose="arms-down" expr={{brow: 0.1, lid: 0.15, mouth: 0.15 + 0.45 * Math.abs(Math.sin(t * 5.2)), eyeX: -14, eyeY: -4}} blink={blinkAt(t, [27.1])} />
        <CafeFg />
      </Cam>
    </Stage>
  );
};

export const SpotClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 29 && <Shots t={t} />}
      {t < 29 && <FilmLook />}
      {t < 4.2 && <Counter label="SHOWS SKIPPED" showFrom={0} changes={[[0, '50']]} />}
      {t >= 4.2 && t < 29 && <Counter label="SHOWS PLAYED" showFrom={sec(4.2)} changes={[[0, '1']]} />}
      <Sequence from={sec(0.6)} durationInFrames={sec(3.2)}>
        <Caption text="Night fifty-one." dur={sec(3.2)} />
      </Sequence>
      <Sequence from={sec(7.0)} durationInFrames={sec(4.0)}>
        <Caption text="His hands **shook**." dur={sec(4.0)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(14.0)} durationInFrames={sec(4.5)}>
        <Caption text="He played **anyway**." dur={sec(4.5)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(21.0)} durationInFrames={sec(3.6)}>
        <Caption text="Nobody laughed." dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(25.4)} durationInFrames={sec(3.4)}>
        <Caption text="Someone was **listening**." dur={sec(3.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(29)} durationInFrames={sec(4)}>
        <BlackCard text="Shaking hands still **count**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/hope-keys.wav" vol={0.6} dur={13} fadeIn={1.2} fadeOut={1.0} />
      <Sfx at={12.8} src="sfx/his-song.wav" vol={0.45} dur={7.4} fadeIn={0.3} fadeOut={1} />
      <Sfx at={13.2} src="music/hope-keys.wav" from={8} vol={0.55} dur={16} fadeIn={1.5} fadeOut={1.5} />
      <Sfx at={28.4} src="music/soft-piano-end.wav" vol={0.7} dur={4.6} fadeOut={1.2} />
      {/* SFX */}
      <Sfx at={0} src="sfx/street-amb.wav" vol={0.3} dur={5} fadeOut={0.6} />
      <Sfx at={0} src="sfx/steps-street.wav" vol={0.4} dur={2.4} />
      <Sfx at={3.3} src="sfx/door-bell.wav" vol={0.5} />
      <Sfx at={6} src="sfx/canteen-ambience.wav" vol={0.25} dur={4} fadeIn={0.4} fadeOut={1} />
      <Sfx at={6.4} src="sfx/heartbeat.wav" vol={0.4} dur={4} fadeOut={1} />
      <Sfx at={20.2} src="sfx/applause.wav" vol={0.5} dur={5} fadeOut={1.2} />
      <Sfx at={20.6} src="sfx/far-cheer.wav" vol={0.25} dur={3} />
    </AbsoluteFill>
  );
};
