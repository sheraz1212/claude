import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FilmLook, Sfx} from './common/Overlays';
import {C, FPS} from './common/theme';

/* Channel outro (7 s): profile pops in, LIKE / SHARE / SUBSCRIBE pop one by one, a cursor clicks subscribe. */
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#c8303f';

const Btn: React.FC<{f: number; at: number; label: string; icon: string; bg: string; fg?: string; w?: number}> = ({f, at, label, icon, bg, fg = '#fff', w = 250}) => {
  const s = spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{transform: `scale(${s})`, opacity: s, width: w, height: 84, borderRadius: 42, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: 'Nunito', fontWeight: 900, fontSize: 32, letterSpacing: 2, boxShadow: '0 8px 26px rgba(0,0,0,0.5)'}}>
      <span style={{fontSize: 34}}>{icon}</span>
      {label}
    </div>
  );
};

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const pop = spring({frame: f - 6, fps: FPS, config: {damping: 12, stiffness: 120}});
  const float = Math.sin(t * 2) * 6;
  const clicked = t > 4.1;
  const cx = interpolate(t, [3.2, 4.0], [1500, 1250], {...cl, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(t, [3.2, 4.0], [1000, 745], {...cl, easing: Easing.inOut(Easing.cubic)});
  const press = t > 4.0 && t < 4.15 ? 0.85 : 1;
  const out = interpolate(t, [6.3, 7], [1, 0], cl);
  const fadeIn = interpolate(t, [0, 0.5], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: '#0d0c12', opacity: out * fadeIn}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, rgba(200,48,63,0.28) 0%, rgba(13,12,18,0) 45%)'}} />
      <div style={{position: 'absolute', left: 960, top: 380 + float, transform: `translate(-50%, -50%) scale(${pop})`}}>
        <div style={{width: 460, height: 460, borderRadius: '50%', background: '#f6f1e8', overflow: 'hidden', boxShadow: `0 0 0 8px ${RED}, 0 0 60px rgba(200,48,63,0.6)`}}>
          <Img src={staticFile('outro/profile.webp')} style={{width: 460, height: 460, objectFit: 'cover'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 690, width: '100%', display: 'flex', justifyContent: 'center', gap: 34}}>
        <Btn f={f} at={36} label="LIKE" icon="👍" bg="#2b2b36" />
        <Btn f={f} at={54} label="SHARE" icon="↗" bg="#2b2b36" />
        <div style={{transform: `scale(${press})`}}>
          <Btn f={f} at={72} label={clicked ? 'SUBSCRIBED' : 'SUBSCRIBE'} icon={clicked ? '🔔' : '▶'} bg={clicked ? '#3a3a46' : RED} w={clicked ? 380 : 330} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 830, width: '100%', textAlign: 'center', fontFamily: 'Patrick Hand', fontSize: 52, color: C.caption, opacity: interpolate(t, [4.6, 5.2], [0, 1], cl)}}>
        See you in the next <span style={{color: '#ff7a7a'}}>story</span>.
      </div>
      {t > 3.1 && t < 6.2 && (
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <path d={`M ${cx} ${cy} l 0 46 l 12 -11 l 10 22 l 8 -4 l -10 -21 l 16 -1 z`} fill="#fff" stroke="#111" strokeWidth={3} />
        </svg>
      )}
      <FilmLook />
      <Sfx at={0.25} src="sfx/one-note.wav" vol={0.5} />
      <Sfx at={1.2} src="sfx/msg-pop-1.wav" vol={0.5} />
      <Sfx at={1.8} src="sfx/msg-pop-2.wav" vol={0.5} />
      <Sfx at={2.4} src="sfx/msg-pop-3.wav" vol={0.5} />
      <Sfx at={4.0} src="sfx/key-tap.wav" vol={0.6} />
      <Sfx at={4.15} src="sfx/celesta-rise.wav" vol={0.45} />
    </AbsoluteFill>
  );
};
