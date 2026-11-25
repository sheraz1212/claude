import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Demon, DemonWords} from './common/Demon';
import {Hero} from './common/Hero';
import {FilmLook} from './common/Overlays';
import {Light, Stage} from './common/sets';
import {C, FPS} from './common/theme';

const Label: React.FC<{x: number; text: string; sub: string}> = ({x, text, sub}) => (
  <div style={{position: 'absolute', left: x, top: 925, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: 'Nunito', color: C.cream}}>
    <div style={{fontWeight: 800, fontSize: 28, letterSpacing: 3}}>{text}</div>
    <div style={{fontFamily: 'Patrick Hand', fontSize: 26, color: '#a99f92'}}>{sub}</div>
  </div>
);

export const DemonSheet: React.FC = () => {
  const t = useCurrentFrame() / FPS + 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Stage bg="#15151b">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={i * 480 + 16} y={70} width={448} height={830} rx={16} fill="#1d1d25" />
            <rect x={i * 480 + 16} y={760} width={448} height={140} fill="#24232c" />
          </g>
        ))}
        <Light id="l1" x={240} y={300} r={420} color={C.amber} o={0.35} />
        <Light id="l4" x={1680} y={300} r={420} color={C.amber} o={0.55} />
        {/* 1 SMALL: just his size, behind him */}
        <Demon id="d1" x={330} y={850} t={t} scale={0.42} size={0.7} glow={0.6} />
        <Hero id="h1" x={190} y={850} scale={0.5} pose="arms-down" expr={{brow: 0.1, lid: 0.2, mouth: 0.1, eyeX: 10}} />
        {/* 2 GROWING: leans in to whisper */}
        <Demon id="d2" x={800} y={850} t={t} scale={0.42} size={1.1} headTilt={-12} lean={-6} expr={{mouth: 0.5}} />
        <Hero id="h2" x={650} y={850} scale={0.5} pose="phone" glow={0.6} glowColor="#ff3b3b" expr={{brow: 0.2, lid: 0.4, mouth: 0}} />
        {/* 3 HEAVY: towers over him, hands on his shoulders */}
        <Demon id="d3" x={1210} y={850} t={t} scale={0.42} size={1.45} lHand={[-80, -200]} rHand={[80, -200]} expr={{mouth: 0.6, lid: 0.3}} />
        <Hero id="h3" x={1200} y={850} scale={0.5} pose="arms-down" lean={6} headTilt={-8} expr={{brow: 0.6, lid: 0.55, mouth: -0.4, bags: true}} />
        {/* 4 WEAKER: cracked, smaller, fading */}
        <Hero id="h4" x={1620} y={850} scale={0.5} pose="arms-down" expr={{brow: -0.4, lid: 0, mouth: 0.3}} />
        <Demon id="d4" x={1770} y={850} t={t} scale={0.42} size={0.6} crack={0.9} glow={0.35} opacity={0.75} expr={{brow: 0.5, mouth: -0.4, lid: 0.5}} />
      </Stage>
      <DemonWords text="one more." x={385} y={640} size={46} />
      <DemonWords text="you deserve it." x={790} y={470} size={46} />
      <DemonWords text="stay." x={1300} y={400} size={54} />
      <DemonWords text="weaker…" x={1700} y={680} size={40} o={0.7} />
      <Label x={240} text="1. SMALL" sub="the habit starts" />
      <Label x={720} text="2. GROWING" sub="leans in and whispers" />
      <Label x={1200} text="3. HEAVY" sub="towers over him" />
      <Label x={1680} text="4. WEAKER" sub="cracks and breaks" />
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: 'Nunito', fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.cream}}>
        THE DEMON <span style={{fontSize: 22, color: '#a99f92', letterSpacing: 2}}>· his inner soul · always red + black · red wristband</span>
      </div>
      <FilmLook />
    </AbsoluteFill>
  );
};
