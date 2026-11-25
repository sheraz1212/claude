// CLIP 5 (2:08-2:40) - the fight: run, fall once, get up again, and take the light back.
(() => {
const T = [128, 133, 137.5, 142, 147, 151.5, 160];
sfx(128, 'morning-amb'); sfx(128.2, 'run-steps'); sfx(133.2, 'tap-water'); sfx(134.2, 'splash'); sfx(135.6, 'light-return', 0.6);
sfx(137.5, 'glow-hum'); sfx(137.8, 'demon-8bit-3', 0.7); sfx(138.3, 'whisper-deserve'); sfx(139.6, 'count-tick'); sfx(139.6, 'low-thud', 0.8);
sfx(142.2, 'knock'); sfx(143, 'door-open', 0.8); sfx(143.6, 'pop-8bit-2'); sfx(147, 'lib-amb'); sfx(148.6, 'page-turn'); sfx(150.4, 'page-turn');
sfx(152, 'heartbeat'); sfx(153.6, 'whisper-onemore', 0.5); sfx(155.9, 'light-return'); sfx(156.6, 'shatter'); sfx(156.6, 'timpani-boom'); sfx(156.62, 'cymbal-crash');

// WIDE (one-off place, the track at dawn): Dev runs with him.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), sc = (t - a) * 420;
  setCam(g, { x: 960, y: lerp(560, 550, u), z: lerp(1, 1.06, u) });
  track(g, t, sc);
  for (const [x0, v, o] of [[1500, 30, { col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52' }], [300, 110, { col: '#a3927e', acc: 'longhair' }]]) { const x = x0 + (t - a) * v; const w = walker(g, x, 770, 0.72, 1, t * 9 + x0, o, 1.5); light(g, w, 0.72, 0.9); }
  const hx = lerp(700, 860, u), dx = lerp(1010, 1120, u);
  floorShadow(g, dx, 900, 80, 0.3); const d = walker(g, dx, 900, 1.15, 1, t * 8.4, { ...DEV, face: { smile: 0.5 } }, 1.5); light(g, d, 1.15, 0.95);
  floorShadow(g, hx, 900, 80, 0.3);
  const l = _PLayer(g, () => walker(_PL.getContext('2d'), hx, 900, 1.15, 1, t * 8 + 1.4, { face: { smile: -0.2, sad: 0.5 } }, 1.5)); light(g, l, 1.15, 0.22);
  for (let i = 0; i < 2; i++) { const p = (t * 1.1 + i * 0.5) % 1; g.fillStyle = `rgba(190,215,255,${0.8 * (1 - p)})`; g.beginPath(); g.ellipse(l.head[0] - 46 - p * 26, l.head[1] - 10 + p * 80 + i * 14, 5, 8, 0.3, 0, 7); g.fill(); }
  hud(g, 'DAYS CLEAN', 3);
  caption(g, 'Day three. He *ran*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function _PLayer(g, fn) { if (!_PL) _PL = mk(W, H); const l = _PL.getContext('2d'); noCam(l); l.clearRect(0, 0, W, H); l.setTransform(g.getTransform()); const r = fn(); g.save(); noCam(g); g.drawImage(_PL, 0, 0); g.restore(); return r; }
s1.fin = 0.4;
// REFLECTION (the mirror shot again): cold water - and a little light is back.
function s2(g, t, a, b) {
  setCam(g, { x: 960, y: 535, z: lerp(1, 1.05, ease(seg(t, a, b))) });
  const sp = seg(t, 134.2, 135.2), lv = lerp(0.22, 0.5, es(t, 135.4, 136.6));
  const r = mirror(g, t, { lv, bags: 0.5, face: { smile: lerp(-0.2, 0.3, es(t, 135.6, 136.8)), blink: sp > 0 && sp < 0.5 ? 1 : 0, sad: 0.3 * (1 - es(t, 135.6, 136.8)) }, pose: sp > 0 && sp < 0.6 ? { handL: [860, 470], handR: [1000, 470], bendL: -1, bendR: 1 } : {} });
  if (sp > 0 && sp < 1) { const q = rng(3); g.fillStyle = `rgba(190,215,255,${0.8 * (1 - sp)})`; for (let i = 0; i < 16; i++) { const an = q() * 6.28, d = 60 + sp * (120 + q() * 160); g.beginPath(); g.arc(930 + Math.cos(an) * d, 420 + Math.sin(an) * d * 0.8 + sp * sp * 160, 5 + q() * 5, 0, 7); g.fill(); } }
  hud(g, 'DAYS CLEAN', 6);
  caption(g, 'A little light came *back*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// THE REPEATED BED SHOT - the relapse. The counter falls back to zero.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), gl = es(t, 137.8, 139) * 0.8;
  setCam(g, { x: 900, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  dorm(g, t, { sleeping: true, glow: gl * (0.9 + 0.1 * Math.sin(t * 4)), bookAt: 'night' });
  demonAt(g, t, 990, 850, lerp(1.2, 1.6, u), 'you earned it.', Math.min(seg(t, 138.3, 138.6), 1 - seg(t, 141.2, 141.6)), { tx: 320, ty: 20, crack: 0.25, lean: -0.1 });
  hud(g, 'DAYS CLEAN', t < 139.6 ? 6 : 0);
  if (t >= 139.6 && t < 140.1) { noCam(g); g.fillStyle = `rgba(${MAG},${0.25 * (1 - seg(t, 139.6, 140.1))})`; g.fillRect(0, 0, W, H); }
  caption(g, 'One night, he *fell*.', capA(t, a + 0.9, b - 0.1), ACC);
}
// MEDIUM (his door, next morning): Dev knocks anyway.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), open = t > 143;
  setCam(g, { x: lerp(1500, 1480, u), y: 545, z: lerp(1.5, 1.58, u) });
  dorm(g, t, { door: open ? 'open' : null, dawn: true, bookAt: 'night', phoneOnDesk: true });
  let dev = null;
  if (open) dev = P(g, { x: 1770, y: 742, s: 1.15, ...DEV, armR: [2.5, 0.4 + Math.sin(t * 7) * 0.12], face: { look: [-0.6, 0], smile: 0.7 } }, 0.95);
  const up = es(t, 144.4, 145.6);
  floorShadow(g, 1340, 800, 90);
  const hero = Hero(g, { x: 1340, y: 800, s: 1.2, view: 'side', dir: 1, headOff: [0, 16 * (1 - up)], lean: 0.08 * (1 - up), face: { look: [0, 0.6 * (1 - up)], sad: 0.9 * (1 - up), smile: lerp(-0.5, 0.25, up), blink: 0.3 * (1 - up) } }, lerp(0.1, 0.3, up), { dir: 1, amt: 0.2, dim: 0.1 * (1 - up) });
  if (dev) headText(g, 'day one. again.', dev.head[0] - 60, dev.head[1] - 112, t, 143.6, 146.2);
  hud(g, 'DAYS CLEAN', t < 145 ? 0 : 1);
  caption(g, 'Dev knocked *anyway*.', capA(t, a + 0.9, b - 0.1), ACC);
}
// MEDIUM (the library, alone): the object, treasured - he finally reads her book.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 880, u), y: lerp(600, 590, u), z: lerp(1.55, 1.65, u) });
  library(g, t, { behind: () => { const wx = 1500 - (t - a) * 60; const w = walker(g, wx, 722, 0.8, -1, wx / 30, { col: '#a3927e', acc: 'longhair' }); light(g, w, 0.8, 0.9); } });
  const pg = (t > 148.6 && t < 148.9) || (t > 150.4 && t < 150.7);
  const hero = Hero(g, { x: 860, y: 740, hip: true, thigh: 20, s: 1.25, headOff: [0, 8], handL: [806, 668], handR: pg ? [880, 650] : [914, 668], bendL: -1, bendR: 1, face: { look: [0.05 * Math.sin(t * 1.4), 0.9], smile: 0.45, blink: (t % 3.1 < 0.14) ? 1 : 0 } }, 0.72, { dir: 0, amt: 0.15 });
  libTable(g);
  g.fillStyle = BOOK; g.strokeStyle = '#0e2a2d'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(790, 690); g.lineTo(860, 682); g.lineTo(930, 690); g.lineTo(930, 664); g.lineTo(860, 656); g.lineTo(790, 664); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#e4dcc6'; g.beginPath(); g.moveTo(796, 664); g.lineTo(860, 657); g.lineTo(924, 664); g.lineTo(924, 652); g.lineTo(860, 645); g.lineTo(796, 652); g.closePath(); g.fill(); g.stroke();
  hud(g, 'DAYS CLEAN', 19);
  caption(g, 'He finally read her *book*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// IMAGERY (the turning point): he walks up to the voice and takes his light back.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), take = 155.9, br = 156.6, after = Math.max(0, t - br);
  noCam(g); g.fillStyle = '#050508'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960 + (after > 0 && after < 0.4 ? Math.sin(after * 80) * 12 * (1 - after / 0.4) : 0), y: 540, z: lerp(1, 1.06, u) });
  pool(g, 960, 900, 900, WARM, 0.12 + 0.22 * es(t, br, br + 2));
  const gone = es(t, br, br + 1.4), tk = es(t, take, take + 0.9);
  const orb0 = [1050, 470 + Math.sin(t * 2) * 6];
  if (gone < 1) {
    const d = demon(g, { x: 1300 + gone * 70, y: 900, s: 1.9 * (1 - gone * 0.3), lean: -0.06, handL: tk > 0.3 ? null : orb0, bendL: -1, armL: [gone * 1.4 + 0.3, 0.4], armR: [gone * 1.4, 0.3], face: { look: [-0.7, 0.2], sad: tk > 0 ? 0.9 : -0.9, smile: tk > 0 ? -0.8 : 0.6 } }, { t, crack: 0.3 + 0.5 * seg(t, 153, take) + gone, a: 1 - gone });
    demonText(g, 'you need me.', d.head[0] - 30, d.head[1] - 240, t, Math.min(seg(t, 153.6, 153.9), 1 - seg(t, 155.4, 155.8)), 70);
  }
  if (after > 0 && after < 1.6) { const q = rng(19); g.fillStyle = RED; for (let i = 0; i < 46; i++) { const an = q() * 6.28, sp = 200 + q() * 700; g.globalAlpha = (1 - after / 1.6) * 0.9; g.beginPath(); g.arc(1320 + Math.cos(an) * sp * after, 560 + Math.sin(an) * sp * after + 500 * after * after, 3 + q() * 7, 0, 7); g.fill(); } g.globalAlpha = 1; }
  const hx = lerp(330, 840, es(t, 151.5, 154.6)), walking = t < 154.6;
  floorShadow(g, hx, 900, 90);
  const hand = [lerp(hx + 90, orb0[0] - 18, es(t, 155, take)), lerp(700, orb0[1] - 10, es(t, 155, take))];
  let hero;
  if (walking) hero = _PLayer(g, () => walker(_PL.getContext('2d'), hx, 900, 1.2, 1, hx / 34, { face: { sad: -0.3, smile: -0.1 } }));
  else hero = actor(g, { x: hx, y: 900, s: 1.2, view: 'side', dir: 1, handR: t >= 155 && tk < 1 ? [lerp(hand[0], hx + 40, tk), lerp(hand[1], 660, tk)] : null, face: { sad: -0.4 * (1 - tk), smile: lerp(-0.1, 0.7, es(t, br + 0.3, br + 1.6)), look: [0, -0.3 * (1 - tk)] } }, { dir: 1, amt: 0.25, dim: 0.03 });
  const chest = [hero.neck[0] + 6, hero.neck[1] + 66 * 1.2];
  if (tk < 1) { const ox = lerp(orb0[0], chest[0], tk), oy = lerp(orb0[1] - 30, chest[1], tk); glow(g, ox, oy, 150 + 80 * Math.sin(Math.PI * tk), WARM, 0.75); g.fillStyle = '#ffe2ad'; g.beginPath(); g.arc(ox, oy, 17, 0, 7); g.fill(); light(g, hero, 1.2, 0); }
  else { light(g, hero, 1.2, 1); glow(g, chest[0], chest[1], 220 * (1 - seg(t, take + 0.9, take + 2.2)) + 60, WARM, 0.5); }
  if (after > 0 && after < 0.25) { noCam(g); g.fillStyle = `rgba(255,235,200,${0.7 * (1 - after / 0.25)})`; g.fillRect(0, 0, W, H); setCam(g, CAM); }
  hud(g, 'DAYS CLEAN', 30);
  caption(g, 'The light was always *his*.', capA(t, br + 0.7, b - 0.1), ACC);
}
s6.fin = 0.3; s6.fout = 0.4;
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
