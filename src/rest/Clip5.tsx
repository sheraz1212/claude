import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, HeadPill, Sfx} from '../common/Overlays';
import {Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {DemonSay} from '../spot/demonShim';
import {Stool} from '../spot/sets';
import {Desk, LivingRoom} from './sets';
import {AtDesk} from './parts';

/*
 HE COULDN'T REST — Clip 5 (33 s): the tiny decision.
  0–8    WIDE evening: one task done, the next step on paper, the laptop CLOSED
  8–14   MEDIUM he calls Mom back: "yes mom. eating now."
  14–22  WIDE the demon calls him back: "one more." He stays. Tea to the window. The demon shrinks.
  22–33  WIDE by the window: his leg shakes... then stops
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 900;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const closed = t > 6.0;
    return (
      <Stage>
        <LivingRoom t={t} sky="sunset" time="18:20" sun={0.4} lamp={0.4} />
        <AtDesk t={t} typing={t < 3.5} glow={closed ? 0 : 0.6} expr={{brow: -0.1, lid: 0.25, mouth: t > 3.5 ? 0.4 : 0.1, eyeY: t > 4 ? 14 : 8}} />
        <Desk t={t} laptop={closed ? 'closed' : 'open'} glow={closed ? 0 : 0.6} cups={1} note={t > 4.8} />
      </Stage>
    );
  }
  if (t < 14)
    return (
      <Stage>
        <Cam s={1.3} cx={1300} cy={G} dy={-150}>
          <LivingRoom t={t} sky="sunset" time="18:30" sun={0.5} lamp={0.4} />
          <Hero id="h" x={1300} y={G} scale={HS} pose="arms-down" rHand={[70, -330]} rHold="phone" expr={{brow: 0.1, lid: 0.3, mouth: 0.5, eyeX: 6}} />
        </Cam>
      </Stage>
    );
  if (t < 22) {
    const shrink = interpolate(t, [16.5, 21], [1.0, 0.75], cl);
    const walk = t > 18.0;
    const x = interpolate(t, [18.0, 20.4], [1100, 1420], cl);
    return (
      <Stage>
        <LivingRoom t={t} sky="sunset" time="18:40" sun={0.6} lamp={0.4} />
        <Demon id="d" x={960} y={740} t={t} scale={HS} size={shrink} sit rHand={t < 17 ? [80, -280] : undefined} glow={shrink} expr={{eyeX: 16}} />
        <Desk t={t} laptop="closed" glow={0} cups={1} note />
        {!walk ? (
          <Hero id="h" x={1100} y={G} scale={HS} pose="arms-down" rHand={[60, -200]} rHold="cup" expr={{brow: -0.1, lid: 0.1, mouth: 0, eyeX: -16}} />
        ) : (
          <HeroSide id="hw" x={x} y={G} scale={HS} dir={1} phase={t * 6} mouth={0.3} />
        )}
      </Stage>
    );
  }
  const k = interpolate(t, [23, 30], [1, 0], cl);
  const jig = Math.sin(t * 22) * 3 * k;
  return (
    <Stage>
      <Cam s={1.2} cx={1450} cy={G} dy={-120}>
        <LivingRoom t={t} sky="sunset" time="18:55" sun={0.8} lamp={0.4} />
        <Stool x={1450} y={760} />
        <Hero id="h" x={1450} y={804 + jig} scale={HS} sit pose="arms-down" rHand={[60, -180]} rHold="cup" glow={0.5} glowColor={C.amberLight}
          expr={{brow: 0.2 * k, lid: 0.2 + (1 - k) * 0.4, mouth: 0.1 + (1 - k) * 0.4, eyeX: 14, eyeY: -4}} />
      </Cam>
    </Stage>
  );
};

export const RestClip5: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(0.6)} durationInFrames={sec(3.6)}>
        <Caption text="One task. **Done**." dur={sec(3.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(4.6)} durationInFrames={sec(3.2)}>
        <Caption text="The next step, on paper." dur={sec(3.2)} />
      </Sequence>
      <Sequence from={sec(9.0)} durationInFrames={sec(3.6)}>
        <HeadPill text="yes mom. eating now." x={1300} y={215} dur={sec(3.6)} />
      </Sequence>
      <Sequence from={sec(14.8)} durationInFrames={sec(2.4)}>
        <DemonSay text="one more." x={1040} y={330} dur={sec(2.4)} />
      </Sequence>
      <Sequence from={sec(18.2)} durationInFrames={sec(3.6)}>
        <Caption text="This time, he **stayed**." dur={sec(3.6)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(23.0)} durationInFrames={sec(4)}>
        <Caption text="His leg kept shaking." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(27.6)} durationInFrames={sec(5)}>
        <Caption text="Then it **stopped**." dur={sec(5)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0} src="sfx/typing.wav" vol={0.3} dur={3.4} />
      <Sfx at={4.8} src="sfx/pencil.wav" vol={0.5} />
      <Sfx at={6.0} src="sfx/laptop-close.wav" vol={0.6} />
      <Sfx at={14.6} src="sfx/demon-horn.wav" vol={0.35} />
      <Sfx at={14.8} src="sfx/voice/inner-one-more.wav" vol={0.6} />
      <Sfx at={18.0} src="sfx/footsteps.wav" vol={0.3} dur={2.4} />
      <Sfx at={22.4} src="sfx/birds-muffled.wav" vol={0.2} dur={10} fadeIn={1} fadeOut={2} />
    </AbsoluteFill>
  );
};
