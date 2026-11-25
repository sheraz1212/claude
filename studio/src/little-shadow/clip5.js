// CLIP 5 (2:08-2:40) - the fight: he teaches Eli, slips once, and breathes it out.
(() => {
const T = [128, 133.5, 138.5, 143.5, 148.5, 153, 160];
sfx(128, 'morning-amb', 0.6); sfx(128.2, 'skate-roll', 0.7); sfx(133.5, 'night-amb'); sfx(134.2, 'demon-8bit-1', 0.7); sfx(134.7, 'whisper-justone'); sfx(136.4, 'inhale'); sfx(136.9, 'puff'); sfx(136.6, 'count-tick'); sfx(136.6, 'low-thud', 0.8);
sfx(140, 'pop-8bit-2'); sfx(144, 'phone-buzz'); sfx(146, 'msg-tick'); sfx(148.5, 'run-steps'); sfx(153.2, 'heartbeat'); sfx(154, 'inhale', 1.4); sfx(155.6, 'blow'); sfx(157.4, 'light-return'); sfx(157.2, 'cymbal-swell', 0.8);

// WIDE (the driveway): the board, treasured - he finally teaches Eli.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1040, u), y: 560, z: lerp(1.05, 1.12, u) });
  driveway(g, t, { doorOpen: true });
  person(g, { x: 1715, y: 840, s: 1.0, ...MOM, face: { look: [-0.6, 0], smile: 0.8 }, armLines: false });
  const ex = lerp(980, 1200, seg(t, a, b)), wob = Math.sin(t * 6) * 0.06;
  const eli = rider(g, ex, 838, 0.8, 1, t, { ...ELI, lean: wob, armL: [1.2, 0.2], face: { smile: 0.9 } });
  cloud(g, ex - 130, 300, 84, t, 1, 8);
  floorShadow(g, ex - 150, 842, 90);
  const hero = _layer(g, () => walker(_PL.getContext('2d'), ex - 150, 840, HS, 1, ex / 30, { armLines: true, handR: [eli.handR[0] - 4, eli.handR[1]], face: { smile: 0.7, look: [0, 0.3] } }));
  sticker(g, hero, HS);
  hud(g, 'DAYS WITHOUT', 12);
  caption(g, 'He finally taught *Eli*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
function _layer(g, fn) { if (!_PL) _PL = mk(W, H); const l = _PL.getContext('2d'); noCam(l); l.clearRect(0, 0, W, H); l.setTransform(g.getTransform()); const r = fn(); g.save(); noCam(g); g.drawImage(_PL, 0, 0); g.restore(); return r; }
// WIDE (the skate park again): one night he slips. The counter falls to zero.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 980, u), y: 560, z: lerp(1.08, 1.16, u) });
  skatepark(g, t);
  person(g, { x: 500, y: 830, s: 1.0, col: '#8d8d9b', acc: 'glasses', face: { look: [0.6, 0.1], smile: 0.4 }, armLines: false });
  const rx = 300 + (t - a) * 80; rider(g, rx, 828, 0.8, 1, t, { col: '#a3927e', acc: 'longhair', armLines: false });
  const took = t > 136, up = kf(t, [[136, 0], [136.5, 1], [137.1, 1], [137.8, 0]]);
  const d = demon(g, { x: 1280, y: 838, s: lerp(1.2, 1.7, es(t, 134.2, 137.5)), lean: -0.05, face: { look: [-0.7, 0.1] } }, { t, crack: 0.3 }); demonText(g, 'just one.', d.head[0] + 170, d.head[1] - 40, t, Math.min(seg(t, 134.7, 135), 1 - seg(t, 137.4, 137.8)), 70);
  const ray = person(g, { x: 860, y: 830, s: 1.1, view: 'side', dir: 1, ...RAY, handR: took ? null : [948, 640], face: { smile: 0.6 } });
  floorShadow(g, 1050, 832, 90);
  cloud(g, 1080, 300, lerp(70, 170, es(t, 136.9, 138.3)), t, 1, 6);
  const hero = actor(g, { x: 1050, y: 830, s: HS, view: 'side', dir: -1, handR: took ? [lerp(968, 1012, up), lerp(644, 470, up)] : (t > 135.3 ? [lerp(1010, 968, es(t, 135.3, 136)), lerp(700, 644, es(t, 135.3, 136))] : null), face: { look: [0, 0.4], sad: 0.6, smile: -0.2, blink: up > 0.8 ? 0.9 : 0 } }, { dir: 1, amt: 0.3, dim: 0.06 });
  sticker(g, hero, HS);
  mintGlow(g, took ? hero.handR[0] : 950, took ? hero.handR[1] : 636, 0.9);
  hud(g, 'DAYS WITHOUT', t < 136.6 ? 12 : 0);
  if (t >= 136.6 && t < 137.1) { noCam(g); g.fillStyle = `rgba(${MINT},${0.22 * (1 - seg(t, 136.6, 137.1))})`; g.fillRect(0, 0, W, H); }
  caption(g, 'One night, he *slipped*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// MEDIUM (their room): Eli leans down from the top bunk.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(680, 700, u), y: 560, z: lerp(1.3, 1.38, u) });
  bedroom(g, t); bunk(g);
  const up = es(t, 142.2, 143);
  const eli = person(g, { x: 450, y: 402, hip: true, thigh: 30, s: 0.8, ...ELI, lean: 0.25, headOff: [14, 10], handR: [540, 470], bendR: 1, face: { look: [0.6, 0.8], smile: 0.5, sad: 0.3 } });
  paperRocket(g, 548, 474);
  cloud(g, 620, 430, 96, t, 1, 4);
  const hero = actor(g, { x: 620, y: 652, hip: true, thigh: 34, s: HS, headOff: [0, 16 * (1 - up)], face: { look: [-0.5 * up, 0.9 - 1.2 * up], sad: 0.9, smile: lerp(-0.5, 0.1, up), blink: 0.3 * (1 - up) } }, { dir: 1, amt: 0.3, dim: 0.08 });
  headText(g, 'try again?', eli.head[0] + 60, eli.head[1] - 80, t, 140, 142.2);
  hud(g, 'DAYS WITHOUT', 0);
  caption(g, "Eli didn't give *up* on him.", capA(t, a + 0.5, b - 0.1), ACC);
}
function paperRocket(g, x, y) { g.save(); g.translate(x, y); g.rotate(0.4); g.fillStyle = '#f3e9d2'; g.strokeStyle = '#1b1a20'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -16); g.quadraticCurveTo(10, -5, 7, 11); g.lineTo(-7, 11); g.quadraticCurveTo(-10, -5, 0, -16); g.fill(); g.stroke(); g.fillStyle = '#e0763c'; g.beginPath(); g.moveTo(-7, 11); g.lineTo(0, 20); g.lineTo(7, 11); g.fill(); g.restore(); }
function s4(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, name: 'Ray', sub: 'skate park', clock: 'FRI 7:10', av: RAY.col, avTop: RAY.accCol, glow: WARM, bg: '80,70,50', buzz: [144], msgs: [
    { who: 's', text: 'park tonight?', at: 144 }, { who: 'h', text: "can't. teaching my brother.", at: 146 }] });
  caption(g, 'He chose a different *night*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (the stairs, reversed): now he is the one passing people.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(860, 1080, u), y: lerp(580, 500, u), z: 1.05 });
  stairs(g, t);
  [[620, 50, { col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52' }], [900, 46, { col: '#a3927e', acc: 'longhair' }], [300, 52, { col: '#b0a08c', acc: 'scarf' }]].forEach(([x0, v, o], i) => { const x = x0 + (t - a) * v; climber(g, x, 0.9, x / 24 + i, o); });
  const hx = 380 + (t - a) * 190, fy = stairY(Math.floor((hx - 300) / 110) * 110 + 300);
  cloud(g, hx - 30, fy - 500, 30, t, 0.8, 7);
  const w = climber(g, hx, HS, t * 9, { armLines: true, face: { smile: 0.6 } }, 1.5); sticker(g, w, HS);
  hud(g, 'DAYS WITHOUT', 21);
  caption(g, 'Day twenty-one. *Lighter*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// IMAGERY (the turning point): one deep clean breath blows the whole cloud away.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), inh = es(t, 154, 155.4), blow = seg(t, 155.6, 157.8), bl = ease(blow);
  noCam(g); g.fillStyle = '#050508'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: lerp(1, 1.06, u) });
  pool(g, 960, 900, 900, WARM, 0.1 + 0.26 * es(t, 157, 159));
  if (bl < 1) {
    const d = demon(g, { x: 1320 + bl * 500, y: 900, s: 1.9 * (1 - bl * 0.3), lean: bl * 0.3, armL: [bl * 1.5 + 0.2, 0.3], armR: [bl * 1.5 + 0.2, 0.3], face: { look: [-0.7, 0.1], sad: blow > 0 ? 0.9 : -0.9, smile: blow > 0 ? -0.8 : 0.6 } }, { t, crack: 0.4 + bl, a: 1 - bl });
    demonText(g, 'you need me.', d.head[0] - 60, d.head[1] - 230, t, Math.min(seg(t, 153.3, 153.6), 1 - seg(t, 155.2, 155.6)), 70);
    cloud(g, 1150 + bl * 700, 480 - bl * 120, 320 * (1 - bl * 0.8), t, 1 - bl, 5);
  }
  if (blow > 0 && blow < 1) { g.save(); g.strokeStyle = `rgba(235,245,255,${0.5 * (1 - blow)})`; g.lineWidth = 5; g.lineCap = 'round'; const q = rng(8); for (let i = 0; i < 9; i++) { const y0 = 470 + (q() - 0.5) * 260, x0 = 640 + ((t * 900 + q() * 900) % 900); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + 120 + q() * 120, y0 + (q() - 0.5) * 30); g.stroke(); } g.restore(); }
  floorShadow(g, 470, 900, 90);
  const hero = actor(g, { x: 470, y: 900, s: HS, view: 'side', dir: 1, lean: -0.14 * inh * (1 - bl) + 0.16 * Math.sin(Math.PI * blow), armL: [-0.5 * inh * (1 - bl), 0.2], armR: [-0.6 * inh * (1 - bl), 0.2], face: { blink: inh > 0.5 && blow <= 0 ? 0.9 : 0, sad: -0.3 * (1 - bl), smile: lerp(0, 0.8, es(t, 157.6, 159)) } }, { dir: 1, amt: 0.25, dim: 0.03 });
  sticker(g, hero, HS);
  hud(g, 'DAYS WITHOUT', 30);
  caption(g, 'He breathed it all *out*.', capA(t, 157.4, b - 0.1), ACC);
}
s6.fin = 0.3; s6.fout = 0.4;
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
