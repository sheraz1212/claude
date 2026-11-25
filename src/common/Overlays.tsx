import React from 'react';
import {AbsoluteFill, Audio, Easing, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BAR, C, H, W} from './theme';

const fadeInOut = (f: number, dur: number, fin = 10, fout = 10) =>
  interpolate(f, [0, fin, dur - fout, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Narrator caption: bottom centre, Patrick Hand, warm cream, no box. Mark one key word as **word**. */
export const Caption: React.FC<{text: string; dur: number; highlight?: string}> = ({text, dur, highlight = C.amberLight}) => {
  const f = useCurrentFrame();
  const o = fadeInOut(f, dur, 12, 12);
  const rise = interpolate(f, [0, 14], [10, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: BAR + 58}}>
      <div
        style={{
          fontFamily: 'Patrick Hand',
          fontSize: 60,
          color: C.caption,
          opacity: o,
          transform: `translateY(${rise}px)`,
          textShadow: '0 2px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.6)',
          letterSpacing: 0.5,
        }}
      >
        {parts.map((p, i) =>
          p.startsWith('**') ? (
            <span key={i} style={{color: highlight}}>
              {p.slice(2, -2)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Head pill: a character's words or thoughts. Small rounded cream pill with dark text.
 * side='above' => (x,y) is the point just above the head; side='left'/'right' => beside the head.
 */
export const HeadPill: React.FC<{text: string; x: number; y: number; dur: number; side?: 'above' | 'left' | 'right'}> = ({
  text,
  x,
  y,
  dur,
  side = 'above',
}) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [0, 7, 11], [0.6, 1.06, 1], {extrapolateRight: 'clamp'});
  const o = fadeInOut(f, dur, 6, 8);
  const anchor =
    side === 'above' ? 'translate(-50%, -100%)' : side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)';
  const origin = side === 'above' ? '50% 100%' : side === 'left' ? '100% 50%' : '0% 50%';
  const tail: React.CSSProperties =
    side === 'above'
      ? {left: '50%', bottom: -9, transform: 'translateX(-50%) rotate(45deg)'}
      : side === 'left'
        ? {right: -8, top: '50%', transform: 'translateY(-50%) rotate(45deg)'}
        : {left: -8, top: '50%', transform: 'translateY(-50%) rotate(45deg)'};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: anchor, opacity: o}}>
      <div style={{transform: `scale(${pop})`, transformOrigin: origin, position: 'relative'}}>
        <div
          style={{
            position: 'relative',
            background: 'rgba(0,0,0,0.10)',
            color: '#ffffff',
            fontFamily: 'Nunito',
            fontWeight: 400,
            fontSize: 40,
            padding: '8px 30px 11px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 6px rgba(0,0,0,0.55)',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** Top-left HUD counter. `changes` = list of [frame, value]; pops when the value changes. */
export const Counter: React.FC<{label: string; changes: [number, string][]; showFrom: number}> = ({label, changes, showFrom}) => {
  const f = useCurrentFrame();
  if (f < showFrom) return null;
  let idx = 0;
  changes.forEach(([fr], i) => {
    if (f >= fr) idx = i;
  });
  const [changedAt, value] = changes[idx];
  const since = f - changedAt;
  const prevEmpty = idx > 0 && changes[idx - 1][1] === '';
  const pop = idx > 0 && !prevEmpty ? interpolate(since, [0, 5, 14], [1.35, 1.1, 1], {extrapolateRight: 'clamp'}) : 1;
  const flash = idx > 0 && !prevEmpty ? interpolate(since, [0, 20], [1, 0], {extrapolateRight: 'clamp'}) : 0;
  let o = interpolate(f, [showFrom, showFrom + 15], [0, 1], {extrapolateRight: 'clamp'});
  if (value === '') {
    // hidden: fade out from the previous value
    const prev = idx > 0 ? changes[idx - 1][1] : '';
    const fo = interpolate(since, [0, 15], [1, 0], {extrapolateRight: 'clamp'});
    if (fo <= 0 || !prev) return null;
    return (
      <div style={{position: 'absolute', left: 72, top: BAR + 34, opacity: o * fo, fontFamily: 'Nunito', display: 'flex', alignItems: 'baseline', gap: 16}}>
        <span style={{fontWeight: 800, fontSize: 21, letterSpacing: 4, color: '#a9bad3', opacity: 0.85}}>{label}</span>
        <span style={{fontWeight: 800, fontSize: 32, color: C.cream}}>{prev}</span>
      </div>
    );
  }
  if (prevEmpty) o = Math.min(o, interpolate(since, [0, 15], [0, 1], {extrapolateRight: 'clamp'}));
  return (
    <div style={{position: 'absolute', left: 72, top: BAR + 34, opacity: o, fontFamily: 'Nunito', display: 'flex', alignItems: 'baseline', gap: 16}}>
      <span style={{fontWeight: 800, fontSize: 21, letterSpacing: 4, color: '#a9bad3', opacity: 0.85}}>{label}</span>
      <span
        style={{
          fontWeight: 800,
          fontSize: 32,
          color: C.cream,
          display: 'inline-block',
          transform: `scale(${pop})`,
          transformOrigin: '0% 70%',
          textShadow: `0 0 ${18 * flash}px ${C.cold}`,
        }}
      >
        {value}
      </span>
    </div>
  );
};

/** Black screen with one centred line (hook / chapter break). */
export const BlackCard: React.FC<{text: string; dur: number; highlight?: string}> = ({text, dur, highlight = C.amberLight}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 26, dur - 16, dur - 4], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: 'Patrick Hand', fontSize: 74, color: C.caption, opacity: o, letterSpacing: 1}}>
        {text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((p, i) =>
          p.startsWith('**') ? <span key={i} style={{color: highlight}}>{p.slice(2, -2)}</span> : <span key={i}>{p}</span>,
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Film look: vignette, animated grain and letterbox bars. */
export const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.11, mixBlendMode: 'screen'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: '#000'}} />
    </AbsoluteFill>
  );
};

/** One sound effect at a time (seconds). */
export const Sfx: React.FC<{at: number; src: string; vol?: number; dur?: number; from?: number; fadeIn?: number; fadeOut?: number}> = ({
  at,
  src,
  vol = 1,
  dur,
  from = 0,
  fadeIn = 0,
  fadeOut = 0,
}) => {
  // stems: --props='{"mix":"music"}' renders only music, '{"mix":"nomusic"}' only SFX + whisper
  const mix = (getInputProps() as {mix?: string}).mix ?? 'full';
  const isMusic = src.startsWith('music/');
  if ((mix === 'music' && !isMusic) || (mix === 'nomusic' && isMusic)) return null;
  // balance: SFX and the whisper sit clearly above the score
  const bal = isMusic ? 0.65 : src.startsWith('sfx/voice/') ? 1.5 : 1.0;
  return (
  <Sequence from={Math.round(at * 30)} durationInFrames={dur ? Math.round(dur * 30) : undefined}>
    <Audio
      src={staticFile(src)}
      startFrom={Math.round(from * 30)}
      volume={(f) => {
        const t = f / 30;
        let v = Math.min(1, vol * bal);
        if (fadeIn > 0) v *= Math.min(1, t / fadeIn);
        if (fadeOut > 0 && dur) v *= Math.max(0, Math.min(1, (dur - t) / fadeOut));
        return v;
      }}
    />
  </Sequence>
  );
};
