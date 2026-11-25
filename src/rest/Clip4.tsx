import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {BlackCard, Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Desk, LivingRoom, SCREEN_L} from './sets';
import {AtDesk} from './parts';

/*
 HE COULDN'T REST — Clip 4 (34 s): the low point, wisdom, the sunrise.
  0–8    WIDE 3:07 AM: five cups; his hand shakes; the cup falls and breaks; the demon touches the ceiling
  8–13   MEDIUM he stands over the pieces, empty
  13–21  BLACK wisdom lines
  21–28  WIDE the sun comes up; its light reaches his hand
  28–34  CLOSE his face in the warm light
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 900;
const HS = 0.8;

const Pieces: React.FC = () => (
  <g fill="#e9e1cf" stroke="#23262c" strokeWidth={2}>
    <path d="M 1040 890 l 22 -6 l 6 12 z" />
    <path d="M 1080 896 l 16 -10 l 10 10 z" />
    <path d="M 1010 896 l 12 -14 l 8 12 z" />
  </g>
);

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const shake = t > 2 && t < 5 ? Math.sin(t * 60) * 4 : 0;
    const fall = interpolate(t, [5.0, 5.6], [0, 1], {...cl});
    return (
      <Stage>
        <LivingRoom t={t} sky="night" time="03:07" lamp={0} />
        <rect width={1920} height={1080} fill="#05050a" opacity={0.25} />
        <Demon id="d" x={1240} y={G} t={t} scale={HS} size={1.75} headTilt={-14} lean={-6} expr={{eyeX: -18, mouth: 0.7}} />
        <AtDesk t={t} typing={false} expr={{brow: 0.75, lid: 0.1, mouth: -0.4, eyeY: 10, bags: true}} />
        <Desk t={t} laptop="open" cups={5} papers={7} />
        {t > 2 && t < 5 && <rect x={1050 + shake} y={600} width={26} height={34} rx={4} fill="#e9e1cf" stroke="#23262c" strokeWidth={3} />}
        {fall > 0 && fall < 1 && <rect x={1060} y={600 + fall * 280} width={26} height={34} rx={4} fill="#e9e1cf" stroke="#23262c" strokeWidth={3} transform={`rotate(${fall * 120} 1073 ${617 + fall * 280})`} />}
        {t >= 5.6 && <Pieces />}
      </Stage>
    );
  }
  if (t < 13)
    return (
      <Stage>
        <Cam s={1.5} cx={1060} cy={G} dy={-180}>
          <LivingRoom t={t} sky="night" time="03:09" lamp={0} />
          <rect width={1920} height={1080} fill="#05050a" opacity={0.3} />
          <Desk t={t} laptop="open" cups={4} papers={7} />
          <Pieces />
          <Hero id="h" x={1220} y={G} scale={HS} pose="arms-down" lean={5} headTilt={-12} expr={{brow: 0.4, lid: 0.15, mouth: -0.2, eyeY: 14, bags: true}} />
        </Cam>
      </Stage>
    );
  if (t < 21) return null;
  const sun = interpolate(t, [21, 27], [0, 1], cl);
  if (t < 28)
    return (
      <Stage>
        <LivingRoom t={t} sky="dawn" time="06:12" lamp={0} sun={sun} />
        <Desk t={t} laptop="open" cups={4} papers={7} glow={0.3} />
        <Pieces />
        <Hero id="h" x={1220} y={G} scale={HS} pose="arms-down" rHand={t > 24 ? [70, -150] : undefined} glow={sun * 0.6} glowColor={C.amberLight}
          expr={{brow: 0.3 - sun * 0.3, lid: 0.15, mouth: -0.2 + sun * 0.3, eyeX: 16, eyeY: -4}} blink={blinkAt(t, [25.4])} />
      </Stage>
    );
  return (
    <Stage>
      <Cam s={2.4} cx={1220} cy={560} dy={40}>
        <LivingRoom t={t} sky="dawn" time="06:20" lamp={0} sun={1} />
        <Light id="face" x={1400} y={500} r={600} color="#ffc27a" o={0.8} />
        <Hero id="h" x={1220} y={G} scale={HS} pose="arms-down" glow={0.7} glowColor={C.amberLight}
          expr={{brow: 0.2, lid: interpolate(t, [29, 32], [0.1, 0.4], cl), mouth: 0.2, eyeX: 16, eyeY: -4, tear: interpolate(t, [30, 33], [0, 0.8], cl)}} />
      </Cam>
    </Stage>
  );
};

export const RestClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      {t < 13 && <Counter label="" showFrom={0} changes={[[0, '3:07 AM']]} />}
      <Sequence from={sec(8.6)} durationInFrames={sec(4.2)}>
        <Caption text="His mind wouldn't **stop**." dur={sec(4.2)} highlight={SCREEN_L} />
      </Sequence>
      <Sequence from={sec(13)} durationInFrames={sec(4)}>
        <BlackCard text="A tired mind doesn't work harder." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(17)} durationInFrames={sec(4)}>
        <BlackCard text="It just works **longer**." dur={sec(4)} highlight={SCREEN_L} />
      </Sequence>
      <Sequence from={sec(22.0)} durationInFrames={sec(5.4)}>
        <Caption text="Then the sun came **up**." dur={sec(5.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(28.6)} durationInFrames={sec(5)}>
        <Caption text="He hadn't seen it in **weeks**." dur={sec(5)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0} src="sfx/clock-tick.wav" vol={0.35} dur={5} />
      <Sfx at={2.0} src="sfx/heartbeat.wav" vol={0.35} dur={3.2} />
      <Sfx at={5.55} src="sfx/shatter.wav" vol={0.6} />
      <Sfx at={5.55} src="sfx/piano-dark-hit.wav" vol={0.6} />
      <Sfx at={13.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={17.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={21.4} src="sfx/birds-muffled.wav" vol={0.25} dur={6} fadeIn={1} />
      <Sfx at={24.2} src="sfx/celesta-sun.wav" vol={0.5} />
    </AbsoluteFill>
  );
};
