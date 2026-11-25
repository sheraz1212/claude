import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Demon, DemonSide} from '../common/Demon';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Desk, LivingRoom} from './sets';
import {OnSofa} from './parts';

/*
 HE COULDN'T REST — Clip 6 (33 s): the mirrored ending + lesson.
  0–10   WIDE the same sofa shot as clip 1, now at sunset: the demon walks over and sits down beside him
  10–20  MEDIUM both on the sofa, watching the sunset; the demon calm and small
  20–29  WIDE the room pulls back; laptop closed, the note on the desk
  29–33  BLACK lesson
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 900;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 10) {
    const walking = t < 4.6;
    const dx = interpolate(t, [0.6, 4.6], [960, 560], cl);
    return (
      <Stage>
        <LivingRoom t={t} sky="sunset" time="19:05" sun={0.7} lamp={0.6} />
        <Desk t={t} laptop="closed" glow={0} cups={1} note />
        <OnSofa cup expr={{brow: -0.1, lid: 0.4, mouth: 0.5, eyeX: 12}} />
        {walking ? (
          <DemonSide id="ds" x={dx} y={G} t={t} scale={HS} size={0.7} dir={-1} phase={t > 0.6 ? t * 5 : undefined} glow={0.4} />
        ) : (
          <Demon id="d" x={540} y={760} t={t} scale={HS} size={0.7} sit glow={0.35} expr={{brow: 0.2, lid: 0.55, mouth: 0.1, eyeX: 12}} />
        )}
      </Stage>
    );
  }
  if (t < 20)
    return (
      <Stage>
        <Cam s={1.6} cx={470} cy={700} dy={-120}>
          <LivingRoom t={t} sky="sunset" time="19:15" sun={0.8} lamp={0.6} />
          <OnSofa cup expr={{brow: -0.2, lid: 0.5, mouth: 0.5, eyeX: 16}} />
          <Demon id="d" x={540} y={760} t={t} scale={HS} size={0.7} sit glow={0.3} expr={{brow: 0.2, lid: 0.6, mouth: 0.1, eyeX: 16}} />
        </Cam>
      </Stage>
    );
  if (t < 29)
    return (
      <Stage>
        <Cam s={interpolate(t, [20, 29], [1.1, 1.0], cl)} cx={960} cy={560}>
          <LivingRoom t={t} sky="sunset" time="19:25" sun={0.9} lamp={0.6} />
          <Desk t={t} laptop="closed" glow={0} cups={1} note />
          <OnSofa cup expr={{brow: -0.2, lid: 0.6, mouth: 0.5, eyeX: 16}} />
          <Demon id="d" x={540} y={760} t={t} scale={HS} size={0.65} sit glow={0.25} expr={{brow: 0.2, lid: 0.7, mouth: 0.1, eyeX: 16}} />
        </Cam>
      </Stage>
    );
  return null;
};

export const RestClip6: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      {t < 29 && <FilmLook />}
      <Sequence from={sec(5.4)} durationInFrames={sec(4.2)}>
        <Caption text="The voice sat down **too**." dur={sec(4.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(11.0)} durationInFrames={sec(8)}>
        <Caption text="For once, nothing **pulled** him." dur={sec(8)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(21.0)} durationInFrames={sec(7.4)}>
        <Caption text="The work could **wait**." dur={sec(7.4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(29)} durationInFrames={sec(4)}>
        <BlackCard text="You don't have to **earn** your rest." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0.6} src="sfx/footsteps.wav" vol={0.25} dur={4} />
      <Sfx at={4.8} src="sfx/cloth.wav" vol={0.35} />
      <Sfx at={10} src="sfx/birds-muffled.wav" vol={0.18} dur={18} fadeIn={1} fadeOut={2} />
      <Sfx at={29.3} src="sfx/pen-write.wav" vol={0.55} />
    </AbsoluteFill>
  );
};
