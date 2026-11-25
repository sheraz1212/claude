import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero} from './common/Hero';
import {Light} from './common/sets';
import {C, H, W} from './common/theme';

// YouTube thumbnail for Glass Room (see CLAUDE.md "YouTube titles and thumbnails").
export const GlassRoomThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#06080c'}}>
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <Light id="tglow" x={1000} y={1000} r={900} color={C.cold} o={1} />
      <Light id="tglow2" x={1000} y={1060} r={420} color={C.coldLight} o={1} />
      {/* glass walls around him */}
      {[560, 1440].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={0} x2={x + (i ? 40 : -40)} y2={H} stroke={C.coldLight} strokeWidth={6} opacity={0.75} style={{filter: `drop-shadow(0 0 14px ${C.cold})`}} />
        </g>
      ))}
      <Hero
        id="thc"
        x={1000}
        y={1720}
        scale={3.2}
        lHand={[-58, -170]}
        rHand={[58, -170]}
        phoneAt={[0, -168]}
        expr={{brow: 1.1, lid: 0, mouth: -0.7, eyeY: 9, bags: true}}
        glow={1.2}
        shimmer={40}
        shimmerAmount={0.6}
      />
      {/* sweat drop */}
      <path d="M 1255 610 q -22 40 0 52 q 22 -12 0 -52 z" fill="#cfe3ff" stroke={C.outline} strokeWidth={5} />
    </svg>
    <div
      style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'Nunito',
        fontWeight: 900,
        fontSize: 190,
        letterSpacing: -4,
        color: '#ffffff',
        WebkitTextStroke: '22px #000',
        paintOrder: 'stroke fill',
        lineHeight: 1,
      }}
    >
      STILL SCROLLING?
    </div>
  </AbsoluteFill>
);
