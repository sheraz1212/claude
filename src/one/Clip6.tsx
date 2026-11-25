import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {FLOOR_Y, FRIEND, Room, YEL} from './sets';

/*
 ONE MORE VIDEO - Clip 6 (33 s)   MUSIC: pad up (tension) -> FINALE: fast piano + violin together, pads barely heard
  0-7    WIDE his room at night (SAME shot as clip 1): the phone on the nightstand lights up.
         Demon: "it's been a long time. just one."
  7-12   CLOSE-UP he picks it up... his face turns ANGRY - he slams it face down
  12-16  WIDE the demon cracks and shatters into embers
  16-23  WIDE knock - his friend with the ball: "ball tonight?" - "coming!" - he goes
  23-27  WIDE the room stays empty, the phone dark, the door open to the light
  27-33  BLACK lesson: "Real life is outside the screen."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const HX = 640;
const HY = 790;

const Shots: React.FC<{t: number}> = ({t}) => {
  const lit = interpolate(t, [1.0, 1.4], [0, 1], cl);
  if (t < 7) {
    const rise = interpolate(t, [1.6, 2.8], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={760} cy={620} dy={-40}>
          <Room t={t} time="23:04" phoneOnTable={lit} />
          <g opacity={rise}>
            <Demon id="dm" x={1300} y={FLOOR_Y + (1 - rise) * 200} t={t} scale={0.8} size={0.75} lean={-8} expr={{eyeX: -16, mouth: 0.5}} />
          </g>
          <Hero id="h" x={HX} y={HY} scale={0.8} sit pose="arms-down" lHand={[-50, -110]} rHand={[50, -110]}
            expr={{brow: 0.3, lid: 0, mouth: -0.1, eyeX: lit ? 16 : 0, eyeY: lit ? 8 : 0}} blink={blinkAt(t, [4.8])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 12) {
    const hold = t > 7.6 && t < 10.8;
    const angry = interpolate(t, [9.2, 9.8], [0, 1], cl);
    const slam = t >= 10.8;
    return (
      <Stage bg="#0d0c11">
        <Cam s={2.1} cx={HX + 80} cy={500} dy={60}>
          <Room t={t} time="23:05" phoneOnTable={hold || slam ? 0 : lit} />
          <Hero id="hc" x={HX} y={HY} scale={0.8} sit pose="arms-down" rHand={hold ? [95, -205] : slam ? [150, -60] : [50, -110]} rHold={hold ? 'phone' : 'none'}
            
            expr={{brow: 0.2 - angry * 1.2, lid: 0.1 + angry * 0.2, mouth: 0.1 - angry * 0.8, eyeX: 14, eyeY: 8 - angry * 8}} />
          {slam && <rect x={1050} y={730} width={52} height={10} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />}
        </Cam>
      </Stage>
    );
  }
  if (t < 16) {
    const crack = interpolate(t, [12.2, 13.6], [0.2, 1], cl);
    const gone = interpolate(t, [13.6, 15.2], [1, 0], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={760} cy={620} dy={-40}>
          <Room t={t} time="23:05" />
          <rect x={1050} y={730} width={52} height={10} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />
          <g opacity={gone}>
            <Demon id="dm2" x={1300} y={FLOOR_Y} t={t} scale={0.8} size={0.75 - (1 - gone) * 0.2} crack={crack} glow={gone} expr={{brow: 0.6, lid: 0.3, mouth: -0.5}} />
          </g>
          <Hero id="h2" x={HX} y={HY} scale={0.8} sit pose="arms-down" lHand={[-50, -110]} rHand={[50, -110]} expr={{brow: -0.6, lid: 0.15, mouth: -0.2, eyeX: 16}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 23) {
    const door = interpolate(t, [16.0, 16.6], [0, 1], cl);
    const stand = t > 19.4;
    const walk = t > 20.2;
    const x = interpolate(t, [20.2, 22.6], [700, 1720], {...cl, easing: Easing.inOut(Easing.quad)});
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={960} cy={620} dy={-40}>
          <Room t={t} time="23:06" door={door} />
          <rect x={1050} y={730} width={52} height={10} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />
          {door > 0.6 && t < 22.4 && <Hero id="fr" x={1720} y={FLOOR_Y} scale={0.8} pose="arms-down" {...FRIEND} lHand={[-60, -150]} lHold="ball" expr={{brow: -0.2, mouth: 0.6, eyeX: -16}} />}
          {!stand ? (
            <Hero id="h3" x={HX} y={HY} scale={0.8} sit pose="arms-down" lHand={[-50, -110]} rHand={[50, -110]} expr={{brow: -0.2, lid: 0, mouth: 0.7, eyeX: 16}} />
          ) : !walk ? (
            <Hero id="h4" x={700} y={FLOOR_Y} scale={0.8} pose="arms-down" expr={{brow: -0.2, lid: 0, mouth: 0.9, eyeX: 16}} />
          ) : (
            <HeroSide id="hw" x={x} y={FLOOR_Y} scale={0.8} dir={1} phase={t * 8} run={0.4} mouth={0.8} />
          )}
        </Cam>
      </Stage>
    );
  }
  if (t < 27)
    return (
      <Stage bg="#0d0c11">
        <Cam s={interpolate(t, [23, 27], [1.0, 1.05], cl)} cx={960} cy={620} dy={-40}>
          <Room t={t} time="23:07" door={1} />
          <rect x={1050} y={730} width={52} height={10} rx={3} fill="#0a0a0d" stroke="#55525e" strokeWidth={2} />
        </Cam>
      </Stage>
    );
  return null;
};

export const OneClip6: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      {t < 27 && <Counter label="DAYS CLEAN" showFrom={0} changes={[[0, '30']]} />}
      <Sequence from={sec(2.6)} durationInFrames={sec(4.2)}>
        <DemonSay text="it's been a long time. just one." x={1180} y={300} dur={sec(4.2)} size={52} />
      </Sequence>
      <Sequence from={sec(16.8)} durationInFrames={sec(2.0)}>
        <HeadPill text="ball tonight?" x={1720} y={360} dur={sec(2.0)} />
      </Sequence>
      <Sequence from={sec(18.8)} durationInFrames={sec(2.0)}>
        <HeadPill text="coming!" x={HX} y={370} dur={sec(2.0)} />
      </Sequence>
      <Sequence from={sec(23.4)} durationInFrames={sec(3.4)}>
        <Caption text="This time, he **went**." dur={sec(3.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(27)} durationInFrames={sec(6)}>
        <BlackCard text="Real life is outside the **screen**." dur={sec(6)} highlight={YEL} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.0} src="sfx/room-tone.wav" vol={0.35} dur={27} fadeOut={1} />
      <Sfx at={1.0} src="sfx/phone-buzz.wav" vol={0.5} />
      <Sfx at={1.6} src="sfx/demon-8bit-1.wav" vol={0.55} />
      <Sfx at={2.7} src="sfx/voice/inner-its-been-a-long-time-just-one.wav" vol={0.75} />
      <Sfx at={7.6} src="sfx/cloth.wav" vol={0.3} />
      <Sfx at={9.2} src="sfx/heart-thump.wav" vol={0.5} />
      <Sfx at={10.8} src="sfx/bag-thud.wav" vol={0.6} />
      <Sfx at={12.4} src="sfx/glass-crack.wav" vol={0.5} />
      <Sfx at={13.6} src="sfx/timpani-hit.wav" vol={0.55} />
      <Sfx at={13.7} src="sfx/whisper-cloud.wav" vol={0.3} />
      <Sfx at={15.6} src="sfx/knock.wav" vol={0.5} />
      <Sfx at={16.8} src="sfx/pop-8bit-3.wav" vol={0.45} />
      <Sfx at={18.8} src="sfx/pop-8bit-1.wav" vol={0.45} />
      <Sfx at={20.2} src="sfx/run-steps.wav" vol={0.3} dur={2.4} />
      <Sfx at={27.4} src="sfx/pen-write.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
