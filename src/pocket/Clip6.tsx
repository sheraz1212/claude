import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Chair, HALL_Y, Hallway, Kitchen, KitchenTable, MOM, NEW_SHOES, RED, TAN} from './sets';
import {WalletInsert} from './sets2';
import {Friends} from './Clip1';

/*
 POCKET MONEY - Clip 6 (30 s)  MUSIC: s5 bright major (piano + strings + celesta), rests on one warm chord
  0-8    WIDE hallway (SAME shot as clip 1): the friends' tags glow; his shoes carry no tag.
         "no tags?" - he shrugs and smiles. The tiny demon crumbles. He walks on with a classmate.
  8-18   WIDE kitchen at night (SAME shot as clip 1): Mom holds out the triangle - he closes her hand
         around it and slides a packed lunch box to her side. She wipes her eyes.
  18-22  INSERT his wallet: one triangle bill, kept, never spent
  23-30  BLACK lesson: "Some people pay for your shine."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = 0.75;
const HX = 800;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const k = interpolate(t, [0.2, 3.0], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
    const shrug = interpolate(t, [4.6, 5.0, 5.8, 6.2], [0, 1, 1, 0], cl);
    const crumble = interpolate(t, [2.4, 5.0], [0, 1], cl);
    const leave = t > 6.4;
    const lx = interpolate(t, [6.4, 8.0], [HX, HX + 380], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [0, 8], [1.0, 1.04], cl)} cx={960} cy={700} dy={-70}>
          <Hallway t={t} />
          <g opacity={1 - crumble}>
            <Demon id="dm" x={300} y={HALL_Y} t={t} scale={S} size={0.5 - crumble * 0.15} crack={0.7 + crumble * 0.3} glow={0.5} expr={{brow: 0.4, lid: 0.4, mouth: -0.4}} />
          </g>
          <Friends t={t} />
          {t < 3.0 ? (
            <HeroSide id="hw" x={-120 + k * (HX + 120)} y={HALL_Y} scale={S} dir={1} phase={t * 7} shoes={NEW_SHOES} mouth={0.4} />
          ) : leave ? (
            <g>
              <HeroSide id="hl" x={lx} y={HALL_Y} scale={S} dir={1} phase={t * 7} shoes={NEW_SHOES} mouth={0.6} />
              <HeroSide id="cm" x={lx - 150} y={HALL_Y} scale={S} dir={1} phase={t * 7 + 1} color={TAN} accessory="glasses" jacket="#4a5a4a" mouth={0.5} />
            </g>
          ) : (
            <Hero id="h" x={HX} y={HALL_Y} scale={S} pose="arms-down" shoes={NEW_SHOES} headTilt={shrug * 6}
              lHand={shrug ? [-150, -190] : undefined} rHand={shrug ? [150, -190] : undefined}
              expr={{brow: -0.2, lid: 0.1 + shrug * 0.3, mouth: 0.7, eyeX: 12}} blink={blinkAt(t, [3.8])} />
          )}
          {leave === false && t > 5.4 && (
            <HeroSide id="cm0" x={interpolate(t, [5.4, 6.4], [-80, HX - 150], cl)} y={HALL_Y} scale={S} dir={1} phase={t * 7} color={TAN} accessory="glasses" jacket="#4a5a4a" mouth={0.5} />
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 18) {
    const reach = interpolate(t, [9.4, 10.2], [0, 1], cl);
    const slide = interpolate(t, [12.0, 13.2], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
    const wipe = interpolate(t, [14.4, 15.0, 16.0, 16.6], [0, 1, 1, 0], cl);
    return (
      <Stage>
        <Cam s={interpolate(t, [8, 18], [1.25, 1.32], cl)} cx={880} cy={640} dy={-20}>
          <Kitchen t={t} />
          <Chair x={1000} />
          <Hero id="mom" x={1000} y={764} scale={0.8} sit pose="arms-down" {...MOM} lHand={[-150, -150]} rHand={wipe ? [-30, -285] : [70, -100]}
            expr={{brow: 0.5, lid: 0.2 + wipe * 0.3, mouth: 0.3 + slide * 0.5, eyeX: -16 + slide * 10, tear: slide * 0.7, bags: true}} blink={blinkAt(t, [11.2])} />
          {/* the triangle in her hand, his hand closing over it */}
          <polygon points="-16,12 0,-14 16,12" transform={`translate(${1000 - 0.8 * 150} ${764 + 0.8 * (-58 + (-150 + 58) * 1.4) - 30})`} fill="#86ad7f" stroke={C.outline} strokeWidth={3} opacity={1 - reach * 0.7} />
          <Hero id="h" x={680} y={HALL_Y - 16} scale={0.8} pose="arms-down" shoes={NEW_SHOES}
            lHand={slide > 0 && slide < 1 ? [280 + slide * 100, -160] : undefined} rHand={reach > 0 && slide === 0 ? [150 + reach * 120, -160] : undefined}
            expr={{brow: 0.3, lid: 0.1, mouth: 0.6, eyeX: 16}} blink={blinkAt(t, [14.0])} />
          <KitchenTable bills={0} box={slide > 0 ? 'closed' : 'none'} />
        </Cam>
      </Stage>
    );
  }
  if (t < 23) return <Stage><WalletInsert t={t} o={interpolate(t, [18, 18.4, 22.2, 23], [0, 1, 1, 0], cl)} /></Stage>;
  return null;
};

export const PocketClip6: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(3.6)} durationInFrames={sec(2.6)}>
        <HeadPill text="no tags?" x={1240} y={300} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(5.6)} durationInFrames={sec(2.4)}>
        <Caption text="He stopped **buying in**." dur={sec(2.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(12.4)} durationInFrames={sec(5.4)}>
        <Caption text="This time, he looked **up**." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(23.4)} durationInFrames={sec(6.6)}>
        <BlackCard text="Some people pay for your **shine**." dur={sec(6.6)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/murmur.wav" vol={0.3} dur={8} fadeIn={0.4} fadeOut={0.8} />
      <Sfx at={0.2} src="sfx/footsteps.wav" vol={0.3} dur={2.8} />
      <Sfx at={3.0} src="sfx/timpani-hit.wav" vol={0.4} />
      <Sfx at={3.2} src="sfx/whisper-cloud.wav" vol={0.25} />
      <Sfx at={6.4} src="sfx/footsteps.wav" vol={0.3} dur={1.6} />
      <Sfx at={8.0} src="sfx/room-tone.wav" vol={0.4} dur={10} fadeIn={0.4} fadeOut={0.6} />
      <Sfx at={10.0} src="sfx/pat.wav" vol={0.35} />
      <Sfx at={12.2} src="sfx/paper-slide.wav" vol={0.35} />
      <Sfx at={13.0} src="sfx/cup-tap.wav" vol={0.35} />
      <Sfx at={18.2} src="sfx/paper-slide.wav" vol={0.3} />
      <Sfx at={23.9} src="sfx/pen-write.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
