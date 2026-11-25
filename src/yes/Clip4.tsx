import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../common/Hero';
import {Caption, Counter, FilmLook, Sfx} from '../common/Overlays';
import {blinkAt, Cam, FLOOR, GREY, Light, Person, Stage, TAN} from '../common/sets';
import {PhonePOV} from '../common/echoSets';
import {FRIENDS} from './canteen';
import {BridgeModel, Corridor, Dorm} from './sets';
import {C, FPS, sec} from '../common/theme';

/*
 Clip 4 (35 s): the rush, the broken support, no help, the closed door. MUSIC: none.
  1  0–3.5   MEDIUM, he glues fast, sweating            → panic of time
  2  3.5–7   INSERT the model: one support snaps        → disaster
  3  7–10.5  CLOSE (head+shoulders), wide eyes          → shock
  4  10.5–14 MEDIUM, one hand holds bridge, one types   → he asks for help
  5  14–17.5 POV phone: busy / seen / no reply          → nobody comes
  6  17.5–21 CLOSE, waiting, hope drains                → loneliness
  7  21–25   WIDE corridor, he runs in with the bridge  → race against time
  8  25–28.5 MEDIUM, the door shuts in front of him     → too late
  9  28.5–32 WIDE, others leave happy with their models → contrast
  10 32–35   MEDIUM, he sits on the bench, bridge in lap → low
*/
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const SWEAT = (x: number, y: number) => <path d={`M ${x} ${y} q -12 22 0 30 q 12 -8 0 -30 z`} fill="#cfe3ff" stroke={C.outline} strokeWidth={3} />;

const Shots: React.FC<{t: number}> = ({t}) => {
  if (t < 3.5) {
    const g = Math.sin(t * 22) * 6;
    return (
      <Stage>
        <Cam s={1.6} cx={1080} cy={580}>
          <Dorm t={t} morning={1} front={<BridgeModel x={1220} y={698} s={0.75} built={interpolate(t, [0, 3.5], [0.62, 0.8], cl)} />}>
            <Hero id="a1" x={1000} y={820} lHand={[140, -150]} rHand={[230 + g, -130]} rHold="pencil" headTilt={6} expr={{brow: 0.7, lid: 0, mouth: -0.2, eyeX: 14, eyeY: 10}} />
            {SWEAT(1080, 420)}
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  if (t < 7) {
    const broke = t > 4.6;
    const shake = broke && t < 5.0 ? Math.sin(t * 80) * 6 : 0;
    return (
      <Stage bg="#14120f">
        <Light id="ins" x={960} y={460} r={800} color={C.amber} o={0.7} />
        <Cam s={interpolate(t, [3.5, 7], [1.0, 1.08], cl)} cx={960} cy={620}>
          <g transform={`translate(${shake} 0)`}>
            <BridgeModel x={960} y={780} s={2.6} built={0.8} broken={broke} />
          </g>
          <line x1={0} y1={790} x2={1920} y2={790} stroke={C.line} strokeWidth={5} />
        </Cam>
      </Stage>
    );
  }
  if (t < 10.5 || (t >= 17.5 && t < 21)) {
    const first = t < 10.5;
    const drain = first ? 0 : interpolate(t, [18, 20.5], [0, 1], cl);
    return (
      <Stage>
        <g opacity={0.45}>
          <Dorm t={t} morning={1} />
        </g>
        <Hero id="a3" x={1000} y={1080} scale={1.75} pose={first ? 'arms-down' : 'phone'} glow={first ? 0 : 0.7} expr={first ? {brow: 1.0, lid: 0, mouth: -0.6, eyeY: 4} : {brow: 0.4 + drain * 0.5, lid: drain * 0.4, mouth: 0.1 - drain * 0.6, eyeY: 8}} blink={blinkAt(t, [9.6, 20.0])} />
        {first && SWEAT(1170, 430)}
      </Stage>
    );
  }
  if (t < 14) {
    return (
      <Stage>
        <Cam s={1.5} cx={1080} cy={580}>
          <Dorm t={t} morning={1} front={<BridgeModel x={1200} y={698} s={0.75} built={0.8} broken />}>
            <Hero id="a4" x={1000} y={820} lHand={[-40, -170]} lHold="phone" rHand={[200, -120]} expr={{brow: 0.8, mouth: -0.3, eyeX: -6, eyeY: 8}} glow={0.4} blink={blinkAt(t, [12.6])} />
            {SWEAT(1080, 420)}
          </Dorm>
        </Cam>
      </Stage>
    );
  }
  if (t < 17.5) {
    const rows = [
      {who: 'me', text: 'Can someone help? 5 min', at: 14.1},
      {who: FRIENDS[1].color, text: 'busy rn', at: 14.9},
      {who: 'seen', text: 'Seen by 2', at: 15.7},
      {who: FRIENDS[0].color, text: 'typing...', at: 16.4},
    ];
    const typingGone = t > 17.1;
    return (
      <Stage>
        <Light id="pov4" x={960} y={560} r={700} color={C.cold} o={0.6} />
        <PhonePOV px={960} py={560}>
          {rows.map((r, i) =>
            t < r.at || (r.text === 'typing...' && typingGone) ? null : (
              <g key={i} transform={`translate(0 ${240 + i * 100})`}>
                {r.who === 'me' ? (
                  <>
                    <rect x={850} y={0} width={300} height={60} rx={18} fill="#5b8fe0" />
                    <text x={866} y={39} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#fff">
                      {r.text}
                    </text>
                  </>
                ) : r.who === 'seen' ? (
                  <text x={1140} y={20} textAnchor="end" fontFamily="Nunito" fontWeight={700} fontSize={20} fill="#8a93a3">
                    {r.text}
                  </text>
                ) : (
                  <>
                    <circle cx={800} cy={30} r={22} fill={r.who} />
                    <rect x={832} y={0} width={200} height={60} rx={18} fill="#d8dde6" />
                    <text x={848} y={39} fontFamily="Nunito" fontWeight={800} fontSize={22} fill="#1d2027" opacity={r.text === 'typing...' ? 0.6 : 1}>
                      {r.text}
                    </text>
                  </>
                )}
              </g>
            ),
          )}
        </PhonePOV>
      </Stage>
    );
  }
  if (t < 25) {
    const x = interpolate(t, [21, 25], [-200, 1050], cl);
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <Corridor>
            <Hero id="a7" x={x} y={FLOOR} showLegs walk={t * 12} lHand={[-85, -140]} rHand={[85, -140]} headTilt={-4} expr={{brow: 0.8, mouth: -0.3, eyeX: 12}} />
            <BridgeModel x={x} y={FLOOR - 135} s={0.6} built={0.8} broken />
          </Corridor>
        </Cam>
      </Stage>
    );
  }
  if (t < 28.5) {
    const shut = interpolate(t, [25.2, 25.8], [0.6, 0], {...cl, easing: Easing.in(Easing.quad)});
    return (
      <Stage>
        <Cam s={1.5} cx={1250} cy={560}>
          <Corridor doorOpen={shut} closed={t > 25.8}>
            <Hero id="a8" x={1080} y={FLOOR} showLegs lHand={[-85, -140]} rHand={[85, -140]} expr={{brow: 1.0, lid: 0, mouth: -0.5, eyeX: 14}} blink={blinkAt(t, [27.6])} />
            <BridgeModel x={1080} y={FLOOR - 135} s={0.6} built={0.8} broken />
          </Corridor>
        </Cam>
      </Stage>
    );
  }
  if (t < 32) {
    const walk = interpolate(t, [28.5, 32], [0, 1], cl);
    return (
      <Stage>
        <Cam s={1.0} cx={960} cy={560}>
          <Corridor closed>
            <Person id="s1" x={1400 - walk * 700} y={FLOOR} showLegs walk={t * 7} color={TAN} accessory="glasses" lHand={[-85, -140]} rHand={[85, -140]} expr={{mouth: 0.9, eyeX: -10}} />
            <BridgeModel x={1400 - walk * 700} y={FLOOR - 135} s={0.55} built={1} />
            <Person id="s2" x={1650 - walk * 700} y={FLOOR} showLegs walk={t * 7 + 1} color={GREY} accessory="tie" accessoryColor={C.amber} lHand={[-85, -140]} rHand={[85, -140]} expr={{mouth: 0.9, eyeX: -12}} />
            <BridgeModel x={1650 - walk * 700} y={FLOOR - 135} s={0.5} built={1} />
            <Hero id="a9" x={360} y={FLOOR} showLegs lHand={[-85, -140]} rHand={[85, -140]} expr={{brow: 0.8, mouth: -0.4, eyeX: 14}} />
            <BridgeModel x={360} y={FLOOR - 135} s={0.6} built={0.8} broken />
          </Corridor>
        </Cam>
      </Stage>
    );
  }
  return (
    <Stage>
      <Cam s={interpolate(t, [32, 35], [1.5, 1.55], cl)} cx={800} cy={600}>
        <Corridor closed>
          <Hero id="a10" x={800} y={800} lHand={[-80, -110]} rHand={[80, -110]} headTilt={8} expr={{brow: 0.8, lid: 0.35, mouth: -0.5, eyeY: 10, bags: true}} blink={blinkAt(t, [33.8])} />
          <BridgeModel x={800} y={720} s={0.6} built={0.8} broken />
        </Corridor>
      </Cam>
    </Stage>
  );
};

export const YesClip4: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shots t={t} />
      <FilmLook />
      <Counter label="YES" showFrom={0} changes={[[0, '22']]} />
      <Sequence from={sec(32.2)} durationInFrames={sec(2.8)}>
        <Caption text="Too late. And **alone**." dur={sec(2.8)} highlight={C.coldLight} />
      </Sequence>
      {/* SFX (MUSIC: none) */}
      <Sfx at={0.2} src="sfx/glue.wav" vol={0.6} />
      <Sfx at={1.6} src="sfx/glue.wav" vol={0.5} />
      <Sfx at={3.0} src="sfx/clock-tick.wav" vol={0.5} />
      <Sfx at={4.6} src="sfx/snap.wav" vol={0.85} />
      <Sfx at={7.2} src="sfx/heart-thump.wav" vol={0.6} />
      <Sfx at={11.0} src="sfx/key-tap.wav" vol={0.5} />
      <Sfx at={11.3} src="sfx/key-tap.wav" vol={0.5} />
      <Sfx at={11.7} src="sfx/key-tap.wav" vol={0.5} />
      <Sfx at={14.1} src="sfx/whoosh.wav" vol={0.4} />
      <Sfx at={14.9} src="sfx/msg-pop-2.wav" vol={0.5} />
      <Sfx at={15.7} src="sfx/seen-pop.wav" vol={0.5} />
      <Sfx at={16.4} src="sfx/msg-pop-3.wav" vol={0.35} />
      <Sfx at={21.0} src="sfx/run-steps.wav" vol={0.6} dur={4} />
      <Sfx at={25.5} src="sfx/door-slam.wav" vol={0.8} />
      <Sfx at={28.6} src="sfx/group-laugh.wav" vol={0.4} />
      <Sfx at={29.0} src="sfx/steps-hard.wav" vol={0.35} dur={3} />
      {/* MUSIC cues */}
      <Sfx at={0} src="music/tension-pulse.wav" vol={0.6} />
      <Sfx at={25.45} src="music/impact-low.wav" vol={0.85} />
      {/* BGM score */}
      <Sfx at={14.0} src="music/lonely-pad.wav" vol={0.45} dur={7} />
      <Sfx at={21.0} src="music/run-strings.wav" vol={0.5} dur={4.45} />
      <Sfx at={28.6} src="music/small-sad.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
