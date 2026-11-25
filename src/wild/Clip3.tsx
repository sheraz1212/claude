import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, Light, Stage} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {HomeRoom, NotifBird} from './sets';
import {CaveDen, PeekHead} from './Clip1';
import {C, FPS, sec} from '../common/theme';

/*
 Wild Human — Clip 3 (35 s): communication. MUSIC: doc-flute (light) + comic stings.
  1 0–4      WIDE the den shakes as the phone rings inside   → "A call. A threat."
  2 4–7.5    MEDIUM cave: he freezes, then plays dead         → comedy, avoidance
  3 7.5–11   POV phone: "Mom calling" → "Missed call"       → who he avoids
  4 11–14.5  IMAGERY window: notification birds land and peck → messages pile up
  5 14.5–18  MEDIUM more and more birds, badges count up       → pressure
  6 18–21.5  MEDIUM he peeks out at the birds, ducks back      → fear
  7 21.5–25  WIDE he yanks the curtains shut; bird shadows on the cloth → shutting out
  8 25–28.5  IMAGERY cave: his short replies float up like smoke and vanish → empty contact
  9 28.5–32  CLOSE tired face in the glow                       → lonely
  10 32–35   WIDE quiet room, bird shadows on the curtain       → "He replies only in text."
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);

const Birds: React.FC<{t: number; n: number}> = ({t, n}) => (
  <g>
    {Array.from({length: Math.floor(n)}, (_, k) => (
      <NotifBird key={k} x={1230 + (k % 5) * 90} y={540 - Math.floor(k / 5) * 60} t={t} k={k} s={0.9} />
    ))}
  </g>
);

const shots = (t: number): React.ReactNode => {
  if (t < 4) {
    const shake = Math.sin(t * 60) * (t > 0.6 && t < 3.6 ? 5 : 0);
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560} dx={shake}>
          <HomeRoom t={t} curtains={0.3} day={0.8} headOut={<PeekHead t={t} out={0} />} denGlow={0.8 + Math.abs(Math.sin(t * 12)) * 0.4} />
        </Cam>
      </Stage>
    );
  }
  if (t < 7.5) {
    const dead = interpolate(t, [5.4, 5.9], [0, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.05} cx={960} cy={640}>
          <CaveDen t={t} fire={0.6 + Math.abs(Math.sin(t * 12)) * 0.4}>
            <g transform={`translate(${dead * 220} ${dead * -40}) rotate(${dead * -88} 960 880)`}>
              <Hero id="dead" x={960} y={880} scale={0.95} pose="arms-down" expr={dead > 0.5 ? {brow: 0, lid: 1, mouth: -0.4} : {brow: 1.0, lid: 0, mouth: -0.5, eyeX: -10}} />
            </g>
          </CaveDen>
        </Cam>
      </Stage>
    );
  }
  if (t < 11) {
    const missed = t > 9.6;
    return (
      <Stage>
        <Light id="pv3w" x={960} y={560} r={700} color={C.cold} o={0.55} />
        <PhonePOV px={960} py={560}>
          <rect x={762} y={190} width={396} height={680} fill={missed ? '#e9eef7' : '#1d3a2a'} />
          {!missed ? (
            <g>
              <circle cx={960} cy={380} r={70} fill="#c9ad86" />
              <path d="M 905 360 q 55 -60 110 0" stroke="#5a3a2a" strokeWidth={14} fill="none" />
              <text x={960} y={510} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={38} fill="#fff">
                Mom
              </text>
              <text x={960} y={555} textAnchor="middle" fontFamily="Nunito" fontWeight={700} fontSize={24} fill="#cfe8d6">
                calling...
              </text>
              <circle cx={860} cy={760} r={40} fill="#e0565b" />
              <circle cx={1060} cy={760} r={40} fill="#4caf6a" />
            </g>
          ) : (
            <text x={960} y={420} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill="#c0392b">
              Missed call · Mom
            </text>
          )}
        </PhonePOV>
      </Stage>
    );
  }
  if (t < 18) {
    const n = t < 14.5 ? interpolate(t, [11.2, 14.4], [1, 4.99], cl) : interpolate(t, [14.5, 17.8], [5, 14.99], cl);
    const cam = t < 14.5 ? {s: 1.3, cx: 1420, cy: 420} : {s: 1.0, cx: 1300, cy: 500};
    return (
      <Stage>
        <Cam s={cam.s} cx={cam.cx} cy={cam.cy}>
          <HomeRoom t={t} curtains={0.3} day={0.8} headOut={<PeekHead t={t} out={0} />} />
          <Birds t={t} n={n} />
        </Cam>
      </Stage>
    );
  }
  if (t < 21.5) {
    const out = interpolate(t, [18.3, 19.0, 20.2, 20.7], [0, 1, 1, 0], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.25} cx={1060} cy={620}>
          <HomeRoom t={t} curtains={0.3} day={0.8} headOut={<PeekHead t={t} out={out} sleepy={0} />} />
          <Birds t={t} n={15} />
        </Cam>
      </Stage>
    );
  }
  if (t < 25) {
    const pull = interpolate(t, [21.8, 22.8], [0.3, 1], {...cl, easing: io});
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <HomeRoom t={t} curtains={pull} day={0.8 - pull * 0.5} headOut={<PeekHead t={t} out={0} />} />
          <g opacity={pull > 0.95 ? 0.35 : 0}>
            {Array.from({length: 8}, (_, k) => (
              <ellipse key={k} cx={1250 + (k % 4) * 110} cy={520 - Math.floor(k / 4) * 70} rx={40} ry={30} fill="#000" />
            ))}
          </g>
        </Cam>
      </Stage>
    );
  }
  if (t < 28.5) {
    const words = ['ok', 'busy', 'later', 'k', 'lol', 'maybe'];
    return (
      <Stage>
        <CaveDen t={t}>
          <Hero id="txt" x={960} y={1000} scale={0.95} expr={{brow: 0.3, lid: 0.3, mouth: -0.1, eyeY: 12}} glow={1} thumb={(t * 4) % 1 < 0.3 ? 1 : 0} />
          {words.map((w, i) => {
            const p = ((t - 25) * 0.5 + i / words.length) % 1;
            return (
              <text key={w} x={960 + Math.sin(i * 2.2) * 160} y={720 - p * 500} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={44} fill={C.coldLight} opacity={Math.sin(Math.PI * p) * 0.8}>
                {w}
              </text>
            );
          })}
        </CaveDen>
      </Stage>
    );
  }
  if (t < 32)
    return (
      <Stage>
        <CaveDen t={t} fire={0.8} />
        <Hero id="lon" x={960} y={1080} scale={1.75} expr={{brow: 0.6, lid: 0.35, mouth: -0.3, eyeY: 10, bags: true}} glow={0.9} blink={blinkAt(t, [30.6])} />
      </Stage>
    );
  return (
    <Stage>
      <HomeRoom t={t} curtains={1} day={0.35} headOut={<PeekHead t={t} out={0} />} />
      <g opacity={0.3}>
        {Array.from({length: 8}, (_, k) => (
          <ellipse key={k} cx={1250 + (k % 4) * 110 + Math.sin(t * 6 + k) * 6} cy={520 - Math.floor(k / 4) * 70} rx={40} ry={30} fill="#000" />
        ))}
      </g>
    </Stage>
  );
};

export const WildClip3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots(t)}
      <FilmLook />
      <Counter label="SIGHTINGS OUTSIDE" showFrom={0} changes={[[0, '0']]} />
      <Sequence from={sec(0.4)} durationInFrames={sec(3.4)}>
        <Caption text="A call. A **threat**." dur={sec(3.4)} />
      </Sequence>
      <Sequence from={sec(5.6)} durationInFrames={sec(1.9)}>
        <Caption text="He plays **dead**." dur={sec(1.9)} />
      </Sequence>
      <Sequence from={sec(11.4)} durationInFrames={sec(3.0)}>
        <Caption text="The messages **gather**." dur={sec(3.0)} />
      </Sequence>
      <Sequence from={sec(32.2)} durationInFrames={sec(2.7)}>
        <Caption text="He replies only in **text**." dur={sec(2.7)} highlight={C.coldLight} />
      </Sequence>
      {/* MUSIC */}
      <Sfx at={0} src="music/pizz-comic.wav" vol={0.4} dur={7.5} />
      <Sfx at={7.6} src="music/low-note.wav" vol={0.4} dur={3.4} />
      <Sfx at={11.0} src="music/doc-flute.wav" vol={0.4} dur={10.5} />
      <Sfx at={25.0} src="music/lonely-pad.wav" vol={0.4} />
      {/* SFX */}
      <Sfx at={0.5} src="sfx/ringtone.wav" vol={0.55} dur={3.2} />
      <Sfx at={4.0} src="sfx/ringtone.wav" vol={0.45} dur={1.4} />
      <Sfx at={5.5} src="sfx/bag-thud.wav" vol={0.5} />
      <Sfx at={9.6} src="sfx/voicemail-beep.wav" vol={0.35} />
      {[11.3, 12.1, 12.9, 13.8, 14.7, 15.3, 15.9, 16.4, 16.9, 17.4].map((s, i) => (
        <Sfx key={s} at={s} src={i % 2 ? 'sfx/peck.wav' : 'sfx/chirp-notif.wav'} vol={0.45} />
      ))}
      <Sfx at={21.9} src="sfx/whoosh.wav" vol={0.45} />
      <Sfx at={22.3} src="sfx/cloth.wav" vol={0.5} />
      {[25.3, 25.9, 26.6, 27.2, 27.8].map((s) => (
        <Sfx key={s} at={s} src="sfx/key-tap.wav" vol={0.35} />
      ))}
      <Sfx at={32.6} src="sfx/peck.wav" vol={0.25} />
    </AbsoluteFill>
  );
};
