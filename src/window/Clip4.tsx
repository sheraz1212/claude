import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {HeroSide} from '../common/HeroSide';
import {BlackCard, Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Person, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {Across, GOLD_L, MyRoom, NEIGHBOUR} from './sets';
import {WindowShot} from './shots';

/*
 THE WINDOW ACROSS — Clip 4 (34 s): the twist, wisdom lines, the tiny decision.
  0–6    WINDOW SHOT, rain: across, a calm evening
  6–12   POV the gold window goes dark; the "perfect" neighbour steps onto the balcony, alone, crying
  12–18  CLOSE his face: he did not know
  18–26  BLACK wisdom lines
  26–34  WIDE he turns his lamp back on and walks to the door
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const G = 920;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 6) return <WindowShot t={t} scene="calm" lamp={0} rain={1} push={t / 6} painting="covered" />;
  if (t < 12) {
    const out = t > 7.0;
    const step = interpolate(t, [8.0, 9.2], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.15} cx={960} cy={640}>
          <Across t={t} scene={out ? 'crying' : 'calm'} rain={1}
            balcony={out ? (
              <g opacity={step}>
                <Person id="nbB" x={960} y={850} scale={0.62} {...NEIGHBOUR} pose="arms-down" lHand={[-40, -250]} rHand={[40, -250]} headTilt={-12} expr={{brow: 0.9, lid: 0.6, mouth: -0.6, tear: 1}} />
              </g>
            ) : undefined}
          />
        </Cam>
      </Stage>
    );
  }
  if (t < 18)
    return (
      <Stage>
        <Cam s={2.3} cx={1000} cy={560} dy={40}>
          <MyRoom t={t} lamp={0} scene="crying" painting="covered" rain={1} />
          <Hero id="h" x={1000} y={G} scale={HS} pose="arms-down" expr={{brow: 0.9, lid: 0, mouth: -0.2, eyeX: 16, eyeY: -2}} blink={blinkAt(t, [16.4])} />
        </Cam>
      </Stage>
    );
  if (t < 26) return null;
  const lamp = interpolate(t, [27, 27.5], [0, 1], cl);
  const walk = interpolate(t, [29.5, 34], [1060, 120], cl);
  return (
    <Stage>
      <MyRoom t={t} lamp={lamp} scene="crying" painting="covered" rain={0.6} />
      {t < 29.5 ? (
        <Hero id="h" x={1060} y={G} scale={HS} pose="arms-down" rHand={t > 26.6 && t < 27.8 ? [110, -270] : undefined} expr={{brow: -0.2, lid: 0.1, mouth: 0.1, eyeX: 10}} />
      ) : (
        <HeroSide id="hs" x={walk} y={G} scale={HS} dir={-1} phase={t * 7} brow={-0.3} mouth={0.1} />
      )}
    </Stage>
  );
};

export const WinClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(0.8)} durationInFrames={sec(4.6)}>
        <Caption text="Then, one rainy night..." dur={sec(4.6)} />
      </Sequence>
      <Sequence from={sec(12.6)} durationInFrames={sec(5)}>
        <Caption text="The perfect window went **dark**." dur={sec(5)} highlight={GOLD_L} />
      </Sequence>
      <Sequence from={sec(18)} durationInFrames={sec(4)}>
        <BlackCard text="You see their window." dur={sec(4)} />
      </Sequence>
      <Sequence from={sec(22)} durationInFrames={sec(4)}>
        <BlackCard text="Not their **night**." dur={sec(4)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(27.8)} durationInFrames={sec(5.6)}>
        <Caption text="He turned his light back **on**." dur={sec(5.6)} highlight={C.amberLight} />
      </Sequence>
      {/* SFX */}
      <Sfx at={0} src="sfx/rain.wav" vol={0.45} dur={18} fadeIn={0.5} fadeOut={1} />
      <Sfx at={3.0} src="sfx/thunder-far.wav" vol={0.4} />
      <Sfx at={7.0} src="sfx/lamp-click.wav" vol={0.35} />
      <Sfx at={8.0} src="sfx/door-close.wav" vol={0.3} />
      <Sfx at={13.0} src="sfx/heartbeat.wav" vol={0.35} dur={4.5} fadeOut={1} />
      <Sfx at={18.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={22.3} src="sfx/pen-write.wav" vol={0.55} />
      <Sfx at={26} src="sfx/rain.wav" vol={0.3} dur={8} fadeIn={0.5} />
      <Sfx at={27.0} src="sfx/lamp-click.wav" vol={0.6} />
      <Sfx at={29.5} src="sfx/footsteps.wav" vol={0.4} dur={4.5} />
    </AbsoluteFill>
  );
};
