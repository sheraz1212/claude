import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Caption, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Stage} from '../common/sets';
import {C, FPS, sec} from '../common/theme';
import {PhoneChat} from '../window/sets';
import {CallScreen, Desk, LivingRoom, SCREEN_L} from './sets';
import {AtDesk} from './parts';

/*
 HE COULDN'T REST — Clip 3 (32 s): the cost.
  0–8    MEDIUM morning, the microwave: yesterday's forgotten tea is still inside
  8–13   WIDE the desk: two days of work, nothing finished
  13–23  POV phone: Mom calling -> "busy"; then "did you eat?" - unanswered
  23–32  WIDE night, more cups, the demon bigger
*/
const G = 900;
const HS = 0.8;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 8) {
    const open = t > 2.2;
    const see = t > 3.2;
    return (
      <Stage>
        <Cam s={1.3} cx={1720} cy={G} dy={-150}>
          <LivingRoom t={t} sky="morning" time="08:15" lamp={0} />
          {open && (
            <g>
              <rect x={1772} y={524} width={96} height={84} rx={4} fill="#e9d9a6" />
              <rect x={1806} y={562} width={26} height={34} rx={4} fill="#e9e1cf" stroke="#23262c" strokeWidth={3} />
              <rect x={1700} y={512} width={70} height={108} fill="#b9b4ac" stroke="#23262c" strokeWidth={4} transform="skewY(-8)" />
            </g>
          )}
          <Hero id="h" x={1640} y={G} scale={HS} pose="arms-down" lHand={open ? [140, -330] : undefined} rHand={[60, -200]} rHold="cup"
            expr={{brow: see ? 0.7 : 0.3, lid: see ? 0 : 0.45, mouth: see ? -0.4 : -0.1, eyeX: 16, eyeY: see ? -6 : 4, bags: true}} blink={blinkAt(t, [5.6])} />
        </Cam>
      </Stage>
    );
  }
  if (t < 13)
    return (
      <Stage>
        <LivingRoom t={t} sky="morning" time="09:40" lamp={0} />
        <Hero id="h" x={1220} y={G} scale={HS} pose="arms-down" headTilt={-8} expr={{brow: 0.6, lid: 0.35, mouth: -0.4, eyeX: -16, eyeY: 10, bags: true}} />
        <Desk t={t} laptop="open" cups={2} papers={5} />
      </Stage>
    );
  if (t < 17) return <Stage><CallScreen t={t} declined={t > 15.6} /></Stage>;
  if (t < 23)
    return (
      <Stage>
        <PhoneChat t={t} name="Mom" msgs={[[17.6, 'did you eat? ❤️'], [19.0, 'call me when you can']]} />
      </Stage>
    );
  return (
    <Stage>
      <LivingRoom t={t} sky="night" time="23:50" lamp={0} />
      <Demon id="d" x={1230} y={G} t={t} scale={HS} size={1.35} headTilt={-12} lean={-5} expr={{eyeX: -16, mouth: 0.6}} />
      <AtDesk t={t} expr={{brow: 0.6, lid: 0.3, mouth: -0.4, eyeY: 10, bags: true}} />
      <Desk t={t} laptop="open" cups={4} papers={6} />
    </Stage>
  );
};

export const RestClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Sequence from={sec(3.6)} durationInFrames={sec(4.2)}>
        <Caption text="Yesterday's tea was still **inside**." dur={sec(4.2)} highlight={C.amberLight} />
      </Sequence>
      <Sequence from={sec(8.6)} durationInFrames={sec(4.2)}>
        <Caption text="Two days. Nothing **finished**." dur={sec(4.2)} highlight={SCREEN_L} />
      </Sequence>
      <Sequence from={sec(19.8)} durationInFrames={sec(3)}>
        <Caption text="He didn't even **reply**." dur={sec(3)} highlight={SCREEN_L} />
      </Sequence>
      <Sequence from={sec(24.0)} durationInFrames={sec(7.6)}>
        <Caption text="Busy. Always **busy**." dur={sec(7.6)} highlight={SCREEN_L} />
      </Sequence>
      {/* SFX */}
      <Sfx at={2.2} src="sfx/fridge-door.wav" vol={0.45} />
      <Sfx at={13.2} src="sfx/ringtone.wav" vol={0.4} dur={2.4} />
      <Sfx at={15.6} src="sfx/phone-tap.wav" vol={0.5} />
      <Sfx at={17.6} src="sfx/msg-pop-1.wav" vol={0.45} />
      <Sfx at={19.0} src="sfx/msg-pop-2.wav" vol={0.45} />
      <Sfx at={23.2} src="sfx/typing.wav" vol={0.3} dur={8.6} />
      <Sfx at={23.2} src="sfx/clock-tick.wav" vol={0.25} dur={8.6} />
    </AbsoluteFill>
  );
};
