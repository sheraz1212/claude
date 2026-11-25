import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Blob} from './common/Blob';
import {Hero} from './common/Hero';
import {Light, Stage} from './common/sets';
import {FilmLook, HeadPill} from './common/Overlays';
import {C, FPS} from './common/theme';

const RED = '#e0565b';
const Label: React.FC<{x: number; text: string; sub: string}> = ({x, text, sub}) => (
  <div style={{position: 'absolute', left: x, top: 900, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: 'Nunito', color: C.cream}}>
    <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 3}}>{text}</div>
    <div style={{fontFamily: 'Patrick Hand', fontSize: 28, color: '#b9b0a0'}}>{sub}</div>
  </div>
);

export const BlobSheet: React.FC = () => {
  const t = useCurrentFrame() / FPS + 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Stage bg="#22202a">
        <rect y={0} width={1920} height={640} fill="#2b2833" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={i * 480 + 20} y={70} width={440} height={790} rx={18} fill="#2f2c38" />
            <rect x={i * 480 + 20} y={700} width={440} height={160} fill="#3a3542" />
          </g>
        ))}
        <Light id="l1" x={240} y={720} r={420} color={C.amber} o={0.6} />
        <Light id="l2" x={720} y={720} r={420} color={RED} o={0.4} />
        <Light id="l3" x={1200} y={720} r={420} color={C.cold} o={0.55} />
        <Light id="l4" x={1680} y={720} r={420} color={C.amber} o={0.8} />
        {/* 1 SMALL: sits beside him */}
        <ellipse cx={240} cy={812} rx={130} ry={14} fill="#000" opacity={0.3} />
        <Hero id="h1" x={190} y={810} scale={0.62} pose="arms-down" expr={{brow: 0, lid: 0.1, mouth: 0.4}} />
        <Blob id="b1" x={350} y={812} t={t} size={0.32} accent={RED} lean={-0.6} eyeX={-6} />
        {/* 2 GROWING: leans in to whisper */}
        <ellipse cx={720} cy={812} rx={170} ry={16} fill="#000" opacity={0.3} />
        <Blob id="b2" x={800} y={812} t={t} size={0.75} accent={RED} lean={-1} eyeX={-8} smile={0.9} glow={0.9} />
        <Hero id="h2" x={650} y={810} scale={0.62} pose="phone" glow={0.6} glowColor={RED} expr={{brow: 0.1, lid: 0.45, mouth: 0.1}} />
        {/* 3 HEAVY: draped over his shoulders, he sinks */}
        <ellipse cx={1200} cy={812} rx={210} ry={18} fill="#000" opacity={0.35} />
        <Blob id="b3" x={1200} y={812} t={t} size={1.05} accent={RED} lid={0.6} smile={1} glow={1.1} reach={[[-120, -170], [120, -170]]} />
        <Hero id="h3" x={1200} y={812} scale={0.6} pose="arms-down" lean={6} headTilt={-8} expr={{brow: 0.5, lid: 0.6, mouth: -0.4, bags: true}} />
        {/* goo arms in front over his chest */}
        <path d="M 1140 625 Q 1150 660 1168 712" stroke="#1b1a22" strokeWidth={50} fill="none" strokeLinecap="round" />
        <path d="M 1140 625 Q 1150 660 1168 712" stroke="#4a4357" strokeWidth={38} fill="none" strokeLinecap="round" />
        <path d="M 1260 625 Q 1250 660 1232 712" stroke="#1b1a22" strokeWidth={50} fill="none" strokeLinecap="round" />
        <path d="M 1260 625 Q 1250 660 1232 712" stroke="#4a4357" strokeWidth={38} fill="none" strokeLinecap="round" />
        {/* 4 WEAKER: he stands tall, it melts */}
        <ellipse cx={1680} cy={812} rx={150} ry={14} fill="#000" opacity={0.3} />
        <Hero id="h4" x={1630} y={810} scale={0.62} pose="arms-down" expr={{brow: -0.3, lid: 0, mouth: 0.3}} />
        <Blob id="b4" x={1790} y={814} t={t} size={0.4} melt={0.85} accent={RED} lid={0.7} smile={-0.4} glow={0.3} />
      </Stage>
      <HeadPill text="one more." x={420} y={650} dur={999} />
      <HeadPill text="you deserve it." x={760} y={470} dur={999} />
      <HeadPill text="stay." x={1200} y={300} dur={999} />
      <HeadPill text="Weaker." x={1770} y={745} dur={999} />
      <Label x={240} text="1. SMALL" sub="the habit starts" />
      <Label x={720} text="2. GROWING" sub="it leans in and whispers" />
      <Label x={1200} text="3. HEAVY" sub="it sits on him" />
      <Label x={1680} text="4. WEAKER" sub="he fights, it melts" />
      <div style={{position: 'absolute', top: 62, width: '100%', textAlign: 'center', fontFamily: 'Nunito', fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.cream}}>
        THE BLOB <span style={{color: RED}}>·</span> <span style={{fontSize: 24, color: '#b9b0a0', letterSpacing: 2}}>eyes + glow = accent colour of each video</span>
      </div>
      <FilmLook />
    </AbsoluteFill>
  );
};
