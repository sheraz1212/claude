// CLIP 4 (1:46-2:06) - the montage (an original 8-bit loop): runs at dawn, study, test 58 -> fills the chest crack with
// gold; guitar practice, test 74 -> the face crack turns gold; the girl walks by, he just smiles and joins his friends -> gold.
(() => {
const T = [106, 109, 111.5, 112.3, 114.3, 117, 118.5, 120.3, 123.5, 126];
sfx(106.0, 'street-amb', 0.6); for (let i = 0; i < 5; i++) sfx(106.2 + i * 0.5, 'steps', 0.5);
sfx(109.0, 'room-quiet'); sfx(109.3, 'pencil', 0.7); sfx(110.4, 'page-turn', 0.6);
sfx(111.5, 'paper-crinkle', 0.6); sfx(111.7, 'pop-8bit-1');
sfx(112.4, 'pen-gold'); sfx(113.0, 'gold-fill');
sfx(114.3, 'room-quiet'); sfx(114.6, 'guitar-strum', 0.5); sfx(115.8, 'guitar-strum', 0.6);
sfx(117.0, 'paper-crinkle', 0.6); sfx(117.2, 'pop-8bit-2');
sfx(118.6, 'pen-gold'); sfx(119.2, 'gold-fill');
sfx(120.3, 'hall-amb', 0.6); sfx(121.6, 'pop-8bit-3'); sfx(122.6, 'laugh-soft', 0.5);
sfx(124.0, 'pen-gold'); sfx(124.6, 'gold-fill');

// dawn run
function s1(g, t, a, b) {
  const u = seg(t, a, b); setCam(g, { x: 960, y: 560, z: 1.1 });
  busStop(g, t); glow(g, 960, 520, 900, WARM, 0.14);
  const hx = lerp(500, 1450, u);
  const r = walker(g, hx, BS_F, 1.05, 1, t * 11, { face: { smile: 0.3, sad: -0.3 } }, 1.6); cracks(g, r, 1.05, crackK(t), goldK(t), t); floorShadow(g, hx, BS_F + 2, 90);
  hudFor(g, t);
  caption(g, 'He started *small*.', capA(t, a + 0.3, b), ACC);
}
s1.fin = 0.3;
// study at his desk
function s2(g, t, a, b) {
  setCam(g, { x: 1100, y: 540, z: 1.4 }); deskRoom(g, t, { clock: 21.5 });
  const ps = SITP(); Me(g, t, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...ps, handR: [ps.handR[0] + Math.sin(t * 9) * 10, ps.handR[1]], headOff: [0, 6], face: { look: [0.1, 0.9], smile: 0.2, blink: blink(t, 0.4) } });
  deskFront(g, t, { pile: 3, pile2: false, open: true });
  hudFor(g, t);
}
// insert: test 58
function s3(g, t, a, b) { setCam(g, { x: 960, y: 560, z: 0.95 }); g.fillStyle = '#221f29'; g.fillRect(-500, -400, 3000, 1900); testPaper(g, 960, 560, 1.0, 58, { marks: [1, 1, 0, 1, 0, 1, 0] }); hudFor(g, t); }
// CLOSE: he fills a crack with gold - the chest
function fillShot(g, t, a, b, which) {
  const u = ease(seg(t, a, b));
  const base = { x: 960, y: 850, s: 1.05 };
  const r0 = { neck: [960, 850 - 166 * 1.05 - 126 * 1.05], hip: [960, 850 - 166 * 1.05], head: [960, 850 - (166 + 126 + 46) * 1.05], hr: 52 };
  const pts = crackPaths(r0, 1.05)[which], [g0, g1] = GD[which], k = es(t, g0, g1), tip = pts[Math.min(pts.length - 1, Math.floor(k * (pts.length - 1)))];
  setCam(g, { x: lerp(960, 965, u), y: which === 1 ? 430 : 560, z: 2.2 });
  g.fillStyle = '#16141c'; g.fillRect(-500, -400, 3000, 1900); glow(g, 960, 500, 600, GOLDRGB, 0.08 + 0.12 * k);
  Me(g, t, { ...base, handR: [tip[0] + 30, tip[1] + 40], face: { look: which === 1 ? [0.6, 0.1] : [0, 0.9], smile: 0.3 * k, sad: 0.2, blink: blink(t, 0.4) } });
  goldPen(g, tip[0] + 8, tip[1] + 6, 1.0, 2.6, 1);
  hudFor(g, t);
  caption(g, 'One crack at a time, he filled it with *gold*.', capA(t, a + 0.2, b - 0.1), ACC);
}
const s4 = (g, t, a, b) => fillShot(g, t, a, b, 0);
// guitar practice on his bed - sore fingers, he keeps going
function s5(g, t, a, b) {
  setCam(g, { x: 560, y: 520, z: 1.5 }); heroRoom(g, t, { lamp: 0.8, under: 0.4 });
  const r = Me(g, t, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: SS, handL: [SIT[0] - 90, SIT[1] - 150], handR: [SIT[0] + 30 + Math.sin(t * 14) * 8, SIT[1] - 110], face: { look: [-0.5, 0.6], smile: t > 116 ? 0.5 : 0, sad: t < 115.6 ? 0.4 : 0, blink: blink(t, 0.6) } }, { dir: 1 });
  heldGuitar(g, r, SS, 1); bedFront(g);
  hudFor(g, t);
  caption(g, 'Practice. *Every* night.', capA(t, a + 0.3, b - 0.1), ACC);
}
function s6(g, t, a, b) { setCam(g, { x: 960, y: 560, z: 0.95 }); g.fillStyle = '#221f29'; g.fillRect(-500, -400, 3000, 1900); testPaper(g, 960, 560, 1.0, 74, { marks: [1, 1, 1, 1, 0, 1, 1] }); hudFor(g, t); }
const s7 = (g, t, a, b) => fillShot(g, t, a, b, 1);
// the hallway: the girl walks by. He just smiles, nods - and goes to his friends who wave him over.
function s8(g, t, a, b) {
  const u = ease(seg(t, a, b)), pass = seg(t, a, a + 2.4);
  setCam(g, { x: lerp(960, 1000, u), y: 560, z: 1.2 });
  corridor(g, t); box(g, 1080, 220, 260, 60, '#2f4f7a', 6); g.fillStyle = '#fff'; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LIBRARY', 1210, 252);
  const gx = lerp(1500, 600, pass); walker(g, gx, CR_F, 1.0, -1, t * 6, { ...GF, face: { smile: 0.4 } }); floorShadow(g, gx, CR_F + 2, 80);
  [[1500, '#A9A9B4', 'cap', '#2f4f7a'], [1640, '#9a8d7e', 'glasses', '']].forEach(([x, c, ac, acc], i) => { P(g, { x, y: CR_F, s: 1.0, col: c, acc: ac, accCol: acc, ...(t > 121.4 && i === 0 ? pose('wave', x, CR_F, 1.0, { dir: -1 }) : {}), face: { look: [-0.8, 0], smile: 0.9 } }); floorShadow(g, x, CR_F + 2, 80); });
  const go = es(t, 122.0, 123.4), hx = lerp(960, 1300, go);
  const r = go > 0 ? walker(g, hx, CR_F, 1.05, 1, t * 6, { face: { smile: 0.8 } }) : Me(g, t, { x: 960, y: CR_F, s: 1.05, headOff: [0, t > 120.8 && t < 121.4 ? 6 : 0], face: { look: [pass < 0.6 ? 0.6 : -0.6, 0], smile: 0.5, blink: blink(t, 0.4) } });
  if (go > 0) cracks(g, r, 1.05, crackK(t), goldK(t), t);
  floorShadow(g, hx, CR_F + 2, 90);
  hudFor(g, t);
  caption(g, 'He let her *go*. And found his people.', capA(t, a + 0.3, b - 0.1), ACC);
}
const s9 = (g, t, a, b) => fillShot(g, t, a, b, 2);
defineClip(106, T, [s1, s2, s3, s4, s5, s6, s7, s8, s9]);
})();
