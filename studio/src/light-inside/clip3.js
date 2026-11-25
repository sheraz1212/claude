// CLIP 3 (1:04-1:36) - the cost: he can't look at her, he comes too late, the voice has his light.
(() => {
const T = [64, 70, 75.5, 81, 86, 91.5, 96];
sfx(64, 'lib-amb'); sfx(65, 'pop-8bit-1'); sfx(67.2, 'pop-8bit-2'); sfx(70.2, 'phone-buzz-muffled'); sfx(72.4, 'phone-buzz-muffled');
sfx(75.5, 'rain-loop'); sfx(77.8, 'cup-clink'); sfx(81, 'rain-loop'); sfx(83.2, 'piano-low-hit', 0.8);
sfx(86.2, 'demon-brass'); const WT = []; { let x = 87, d = 0.7; while (x < 91.2) { WT.push(x); sfx(x, 'whisper-onemore', 0.7 + (x - 87) * 0.1); x += d; d = Math.max(0.17, d * 0.82); } }
sfx(91.9, 'pen-write', 0.8); sfx(93.6, 'pen-write', 0.8); sfx(93.6, 'low-thud', 0.9);

// MEDIUM (the library, changed): he can't meet her eyes. She asks for her book.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1010, y: lerp(590, 600, u), z: lerp(1.6, 1.68, u) });
  library(g, t);
  const fl = Math.max(0, Math.sin(t * 6.5)) * (t > 65.6 && t < 68.5 ? 1 : 0);
  const hero = Hero(g, { x: 860, y: 740, hip: true, thigh: 20, s: 1.25, headOff: [0, 10], face: { look: [0.15, 0.9], smile: -0.4, sad: 0.9, blink: 0.35 } }, 0.14, { dir: 0, amt: 0.15, dim: 0.08 });
  eyeBags(g, hero, 1.25, 0.9);
  const maya = P(g, { x: 1160, y: 740, hip: true, thigh: 20, s: 1.25, ...MAYA, headTilt: -0.06, face: { look: [-0.7, 0.1], smile: -0.15, sad: 0.5, blink: (t > 68.6 && t < 68.75) ? 1 : 0 } }, 1);
  for (const sg of [-1, 1]) glow(g, hero.head[0] + 2 + sg * 23, hero.head[1] + 8, 9, MAG, 0.8 * fl);
  libTable(g); openBook(g, 1150, 694);
  headText(g, 'you okay?', maya.head[0] + 30, maya.head[1] - 110, t, 65, 66.9);
  headText(g, 'my book? i need it.', maya.head[0] + 30, maya.head[1] - 110, t, 67.2, 69.6);
  caption(g, "He couldn't look at *her*.", capA(t, a + 0.5, b - 0.1), ACC);
}
// TOP-DOWN INSERT (the object, ignored): her book under his phone. Never opened.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#121017'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: lerp(1.08, 1, u) });
  g.strokeStyle = 'rgba(106,106,120,0.25)'; g.lineWidth = 2.5; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-100, 140 + i * 230); g.lineTo(2100, 90 + i * 230); g.stroke(); }
  glow(g, 1500, 200, 700, WARM, 0.12);
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; book(g, 900, 540, 520, 700, -0.12); g.restore();
  g.fillStyle = '#b33'; g.fillRect(1010, 190, 26, 70);                 // the bookmark, still at page one
  const r = rng(6); g.fillStyle = 'rgba(220,220,230,0.16)'; for (let i = 0; i < 70; i++) { g.beginPath(); g.arc(660 + r() * 480, 220 + r() * 640, 1 + r() * 2.2, 0, 7); g.fill(); }
  const on = (t > 70.2 && t < 71.6) || (t > 72.4 && t < 74.6);
  g.save(); g.translate(1010, 620); g.rotate(0.5); rr(g, -110, -210, 220, 420, 30); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, -98, -198, 196, 396, 22); g.fillStyle = on ? `rgba(${MAG},0.85)` : '#0d0d12'; g.fill(); g.restore();
  if (on) glow(g, 1010, 620, 520, MAG, 0.4);
  g.strokeStyle = '#2a2a36'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(1100, 800); g.bezierCurveTo(1300, 900, 1500, 700, 1700, 1000); g.lineTo(2000, 1100); g.stroke();
  caption(g, "He hadn't read a *page*.", capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (the cafe, after finals): she waits with two cups.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 970, u), y: 560, z: lerp(1, 1.07, u) });
  cafe(g, t, { clock: [5, 5 + (t - a) * 2], inside: () => {
    const wx = 1500 - (t - a) * 60; const w = walker(g, wx, 782, 0.9, -1, wx / 30, { col: '#9a9aa8', acc: 'glasses' }); g.fillStyle = '#e9dfc8'; g.fillRect(w.neck[0] - 24, w.neck[1] + 40, 48, 120); light(g, w, 0.9, 0.8);
    const lk = es(t, 78.2, 78.8);
    P(g, { x: 770, y: 696, hip: true, thigh: 62, s: 1.05, view: 'side', dir: 1, ...MAYA, legL: [1.4, -1.4], legR: [1.32, -1.32], headOff: [0, 8 * lk], armR: [0.5, 0.9], face: { look: [0, 0.5 * lk], smile: -0.2 * lk, sad: 0.5 * lk } }, 1);
    cafeTable(g, 2, t);
  } });
  rain(g, t, 0.9);
  caption(g, 'After finals, she *waited*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// WIDE (the same window, an hour later): he comes. One cold cup.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(970, 1000, u), y: 570, z: lerp(1.07, 1.14, u) });
  cafe(g, t, { clock: [6, 12], inside: () => { cafeTable(g, 1, null); } });
  const hx = lerp(1700, 1010, es(t, 81, 83.2)), walking = t < 83.2;
  floorShadow(g, hx, 940, 90);
  if (walking) { const w = walker(g, hx, 940, 1.2, -1, hx / 34, {}); } else actor(g, { x: hx, y: 940, s: 1.2, view: 'back', headOff: [0, es(t, 84, 85) * 12], lean: 0 }, { dir: 0, amt: 0.25, dim: 0.14 });
  rain(g, t, 1);
  caption(g, 'He came an hour *late*.', capA(t, 83.2, b - 0.1), ACC);
}
// WIDE (the low point): his light is out. The voice is holding it.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(880, 840, u), y: 535, z: lerp(1, 1.1, u) });
  dorm(g, t, { bookAt: 'desk' });
  noCam(g); g.fillStyle = `rgba(4,3,8,${0.2 + 0.15 * u})`; g.fillRect(0, 0, W, H); setCam(g, CAM);
  const orb = [770, 430 + Math.sin(t * 2) * 8];
  demon(g, { x: 1180, y: 1340, s: lerp(2.7, 3.2, u), lean: -0.2, headOff: [-20, 10], handL: orb, bendL: -1, face: { look: [-0.7, 0.5], smile: 0.9 } }, { t, glow: 40 });
  glow(g, orb[0], orb[1] - 30, 150, WARM, 0.7); g.fillStyle = '#ffe2ad'; g.beginPath(); g.arc(orb[0], orb[1] - 30, 17, 0, 7); g.fill();
  const cover = es(t, 87.2, 88.2);
  floorShadow(g, 520, 800, 90);
  Hero(g, { x: 520, y: 668, hip: true, thigh: 34, s: 1.2, handL: cover ? [478, lerp(720, 452, cover)] : null, handR: cover ? [562, lerp(720, 452, cover)] : null, bendL: -1, bendR: 1, headOff: [Math.sin(t * 23) * 1.5 * cover, 14], face: { look: [0, 0.9], blink: cover, sad: 1, smile: -0.7 } }, 0, { dir: 1, amt: 0.4, dim: 0.22 });
  const r = rng(51);
  WT.forEach((wt, i) => { const x = 200 + r() * 1500, y = 150 + r() * 650, sz = 60 + r() * 110, rot = (r() - 0.5) * 0.5; if (t < wt) return;
    g.save(); noCam(g); g.globalAlpha = Math.min(1, (t - wt) / 0.15) * 0.92; g.translate(x, y); g.rotate(rot); g.font = `${sz}px "Caveat Brush"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(255,30,20,0.9)'; g.shadowBlur = 18; g.fillStyle = RED; g.fillText('one more.', Math.sin(t * 9 + i) * 2, 0); g.restore(); });
  setCam(g, CAM);
  caption(g, 'The voice had his *light*.', capA(t, a + 1.2, b - 0.1), ACC);
}
s5.fin = 0.4; s5.fout = 0.4;
// BLACK (the shock number)
function s6(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, '2 hours a night', seg(t, a + 0.4, a + 1.8), ACC, fo, 92, -72);
  blackLine(g, '= *30 days* a year.', seg(t, a + 2.1, a + 3.4), ACC, fo, 110, 64);
}
s6.black = true;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
