import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, Counter, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {FLOOR_Y, FRIEND, PhonePOV, Room, YEL, YEL_L} from './sets';

/*
 ONE MORE VIDEO - Clip 1 (33 s)
  0-4    BLACK hook "It started with one video."
  4-10   WIDE his dark room: he sits on the bed, the phone's dark-yellow glow on his face      VIDEOS 1
  10-15  CLOSE-UP his eyes go wide, a slow small smile                                       (the pull)
  15-22  WIDE the door opens - his friend with a ball: "ball tonight?" - "nah." - door closes
  22-28  MEDIUM the demon rises behind the bed: "one more video." / "you deserve to relax."
  28-31  POV phone: blurred dark-yellow tiles (nothing visible) - VIDEOS 2,3,4...
  31-33  WIDE same room, 3:47 AM, VIDEOS 9
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const HX = 640;
const HY = 790;

/** him on the bed with the phone (back of the phone to camera - we never see the screen) */
export const OnBed: React.FC<{t: number; expr?: object; glow?: number; tired?: number; id?: string}> = ({t, expr, glow = 0.85, tired = 0, id = 'hb'}) => (
  <g>
    <Light id={`${id}-pl`} x={HX + 76} y={HY - 330} r={190} color={YEL} o={0.55 * glow} />
    <Hero id={id} x={HX} y={HY} scale={0.8} sit pose="arms-down" rHand={[95, -205]} rHold="phone" lHand={[-30, -150]}
      expr={{brow: 0.1, lid: 0.25 + tired * 0.25, mouth: 0.1, eyeX: 14, eyeY: 8, bags: tired > 0.3, ...expr}} blink={blinkAt(t, [6.6, 9.1, 32.0])} />
  </g>
);

/** him LYING on the bed: head on the pillow, the blanket up to his chest, phone held up above his face */
export const LyingBed: React.FC<{t: number; tired?: number; id?: string}> = ({t, tired = 0, id = 'hl'}) => (
  <g>
    <Light id={`${id}-pl`} x={440} y={540} r={150} color={YEL} o={0.5} />
    <g transform="translate(730 652) rotate(-90)">
      <Hero id={id} x={0} y={0} scale={0.7} pose="arms-down" rHand={[160, -215]} rHold="phone" lHand={[130, -190]}
        expr={{brow: 0.2, lid: 0.25 + tired * 0.3, mouth: 0.1, eyeX: 18, eyeY: 0, bags: tired > 0.3}} blink={blinkAt(t, [24.4, 30.2])} />
    </g>
    {/* the blanket, pulled up to his chest */}
    <path d="M 515 702 Q 510 600 570 588 Q 760 580 880 606 Q 905 640 900 702 Z" fill="#26304a" stroke="#55525e" strokeWidth={4} />
    <path d="M 580 636 Q 740 650 880 638 M 560 672 Q 740 688 890 674" stroke="#1a2236" strokeWidth={4} fill="none" />
  </g>
);

/** under the blanket: the phone's light seeps out through it */
export const BlanketGlow: React.FC<{t: number}> = ({t}) => {
  const fl = 0.8 + 0.2 * Math.sin(t * 7) * Math.sin(t * 2.3);
  return (
    <g>
      <defs>
        <radialGradient id="bgl" cx="0.55" cy="0.6" r="0.6">
          <stop offset="0" stopColor={YEL_L} stopOpacity={0.75 * fl} />
          <stop offset="0.6" stopColor={YEL} stopOpacity={0.3 * fl} />
          <stop offset="1" stopColor={YEL} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d="M 300 700 Q 330 600 480 595 Q 700 610 860 640 Q 900 660 900 700 Z" fill="#26304a" stroke="#55525e" strokeWidth={4} />
      <path d="M 300 700 Q 330 600 480 595 Q 700 610 860 640 Q 900 660 900 700 Z" fill="url(#bgl)" />
      <path d="M 420 640 Q 560 660 700 640 M 480 670 Q 620 690 760 668" stroke="#1a2236" strokeWidth={4} fill="none" />
      <path d="M 620 700 L 760 700" stroke={YEL_L} strokeWidth={6} opacity={0.8 * fl} strokeLinecap="round" />
      <Light id="bgL" x={640} y={690} r={300} color={YEL} o={0.45 * fl} />
    </g>
  );
};

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10)
    return (
      <Stage bg="#0d0c11">
        <Cam s={interpolate(t, [4, 10], [1.0, 1.06], cl)} cx={760} cy={620} dy={-40}>
          <Room t={t} time="23:04" />
          <OnBed t={t} />
        </Cam>
      </Stage>
    );
  if (t < 15) {
    const wide = interpolate(t, [10.6, 11.6], [0, 1], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={interpolate(t, [10, 15], [2.4, 2.52], cl)} cx={HX + 60} cy={480} dy={60}>
          <Room t={t} time="23:20" />
          <OnBed t={t} expr={{brow: 0.1 - wide * 0.3, lid: 0.25 - wide * 0.25, mouth: 0.1 + wide * 0.5, eyeX: 16, eyeY: 10}} glow={1} />
        </Cam>
      </Stage>
    );
  }
  if (t < 22) {
    const door = interpolate(t, [15.1, 15.7, 20.3, 20.9], [0, 1, 1, 0], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.0} cx={960} cy={620} dy={-40}>
          <Room t={t} time="23:41" door={door} />
          {door > 0.6 && <Hero id="fr" x={1720} y={FLOOR_Y} scale={0.8} pose="arms-down" {...FRIEND} lHand={[-60, -150]} lHold="ball" expr={{brow: -0.2, mouth: 0.6, eyeX: -16}} />}
          <OnBed t={t} expr={{lid: 0.2, mouth: 0.2, eyeY: 8, eyeX: 14}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 28) {
    const rise = interpolate(t, [22.1, 23.4], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const lean = interpolate(t, [25.0, 26.0], [0, 1], cl);
    return (
      <Stage bg="#0d0c11">
        <Cam s={1.35} cx={700} cy={600} dy={-60}>
          <Room t={t} time="00:12" />
          <g opacity={rise}>
            <Demon id="dm" x={860} y={FLOOR_Y + (1 - rise) * 200} t={t} scale={0.8} size={0.9} lean={-6 - lean * 10} headTilt={-8} expr={{eyeX: -16, eyeY: 10}} />
          </g>
          <OnBed t={t} expr={{lid: 0.2, mouth: 0.3, eyeY: 8, eyeX: 14}} />
        </Cam>
      </Stage>
    );
  }
  if (t < 31) return <Stage><PhonePOV t={t} seed={Math.floor((t - 28) * 2)} /></Stage>;
  return (
    <Stage bg="#0d0c11">
      <Cam s={1.0} cx={760} cy={620} dy={-40}>
        <Room t={t} time="03:47" />
        <LyingBed t={t} tired={1} />
      </Cam>
    </Stage>
  );
};

export const OneClip1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= 4 && <Shots t={t} />}
      <FilmLook />
      <Counter label="VIDEOS" showFrom={sec(4.6)} changes={[[sec(4.6), '1'], [sec(28.5), '2'], [sec(29.2), '3'], [sec(29.8), '4'], [sec(30.4), '6'], [sec(31.1), '9']]} />
      <Sequence durationInFrames={sec(4)}>
        <BlackCard text="It started with **one** video." dur={sec(4)} highlight={YEL} />
      </Sequence>
      <Sequence from={sec(5.0)} durationInFrames={sec(4.6)}>
        <Caption text="Late at **night**." dur={sec(4.6)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(3.8)}>
        <Caption text="It felt **good**." dur={sec(3.8)} highlight={YEL_L} />
      </Sequence>
      <Sequence from={sec(15.8)} durationInFrames={sec(2.2)}>
        <HeadPill text="ball tonight?" x={1720} y={360} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(18.0)} durationInFrames={sec(2.2)}>
        <HeadPill text="nah." x={HX} y={370} dur={sec(2.2)} />
      </Sequence>
      <Sequence from={sec(22.8)} durationInFrames={sec(2.6)}>
        <DemonSay text="one more video." x={1060} y={190} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(25.4)} durationInFrames={sec(2.6)}>
        <DemonSay text="you deserve to relax." x={1060} y={190} dur={sec(2.6)} />
      </Sequence>
      <Sequence from={sec(31.2)} durationInFrames={sec(1.8)}>
        <Caption text="3:47 AM." dur={sec(1.8)} highlight={YEL_L} />
      </Sequence>
      {/* SFX - music (8-bit counter run etc.) is in the music file */}
      <Sfx at={0.5} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={4.0} src="sfx/room-tone.wav" vol={0.35} dur={29} fadeIn={0.5} />
      <Sfx at={4.6} src="sfx/phone-tap.wav" vol={0.4} />
      <Sfx at={11.0} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={14.8} src="sfx/knock.wav" vol={0.5} />
      <Sfx at={15.8} src="sfx/pop-8bit-1.wav" vol={0.45} />
      <Sfx at={18.0} src="sfx/pop-8bit-2.wav" vol={0.45} />
      <Sfx at={20.6} src="sfx/door-close.wav" vol={0.45} />
      <Sfx at={22.1} src="sfx/demon-8bit-3.wav" vol={0.55} />
      <Sfx at={23.0} src="sfx/voice/inner-one-more-video.wav" vol={0.75} />
      <Sfx at={25.6} src="sfx/voice/inner-you-deserve-to-relax.wav" vol={0.75} />
      <Sfx at={28.2} src="sfx/scroll-tick.wav" vol={0.3} />
      <Sfx at={29.6} src="sfx/scroll-tick.wav" vol={0.3} />
    </AbsoluteFill>
  );
};
