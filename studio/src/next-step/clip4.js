// CLIP 4 (1:37-2:12) - Ayesha. She has been there too (her old cards). The pile goes aside. One small card.
(() => {
const T = [97.5, 103.5, 109.5, 115.5, 121.5, 126.5, 132];
sfx(97.5, 'room-quiet'); sfx(98.4, 'steps-small', 0.5); sfx(99.6, 'cloth-rustle', 0.5); sfx(100.2, 'pop-8bit-1');
sfx(103.5, 'room-quiet'); sfx(104.0, 'drawer', 0.8); sfx(105.2, 'cards-riffle'); sfx(107.0, 'cards-riffle', 0.7);
sfx(109.5, 'room-quiet'); sfx(110.6, 'pop-8bit-2'); sfx(112.4, 'book-push'); sfx(113.1, 'book-push', 0.8);
sfx(115.5, 'room-quiet'); sfx(116.0, 'card-place'); sfx(117.0, 'pen-write'); sfx(118.6, 'pen-write', 0.8);
sfx(121.5, 'room-quiet'); sfx(122.0, 'pop-8bit-3'); sfx(124.6, 'steps-small', 0.5);
sfx(126.5, 'room-quiet'); sfx(127.3, 'pen-write', 0.9); sfx(129.3, 'pen-write', 0.8);

const AYX = 1660;
// MEDIUM: she comes to his desk. A hand on his shoulder. The red ink dries away.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 98.0, 100.0), come = es(t, 97.6, 99.2);
  setCam(g, { x: lerp(1230, 1250, u), y: 540, z: lerp(1.42, 1.48, u) });
  deskRoom(g, t, { clock: 21.65, warm: w });
  const ax = lerp(1900, AYX, come);
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...SITP(), headOff: [0, lerp(14, 6, w)], face: { look: w > 0.5 ? [0.8, 0] : [0, 0.9], sad: 0.8, smile: -0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 14 });
  const ay = Hero(g, { x: ax, y: DK_F, s: 1.05, ...AYESHA, handL: come >= 1 ? [1500, 610] : null, face: { look: [-0.9, 0.3], sad: 0.3, smile: 0.4, blink: blink(t, 1.3) } }, { dir: -1, amt: 0.3 }); floorShadow(g, ax, DK_F + 2, 90);
  headText(g, 'hey. I know this feeling.', ay.head[0] - 40, ay.head[1] - 115, t, 100.2, 103.3);
  caption(g, "She didn't *lecture* him.", capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.4;
// INSERT: her old exam cards - a thick bundle, every one ticked. She has been here too.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), fan = es(t, 105.0, 106.6);
  setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1, 1.08, u) });
  tableTop(g, t);
  const txt = ['Ch 1 notes', '20 practice Qs', 'Ch 2 formulas', 'Summary p.40', 'Past paper Q1-5'];
  for (let i = txt.length - 1; i >= 0; i--) indexCard(g, 960 + (i - 2) * 150 * fan, 520 + Math.abs(i - 2) * 30 * fan, 1.0, { text: txt[i], tick: 1, rot: (i - 2) * 0.14 * fan });
  if (fan < 0.4) { g.strokeStyle = '#c94b3f'; g.lineWidth = 8; g.beginPath(); g.ellipse(960, 520, 175, 30, 0, 0, 7); g.stroke(); }
  topHand(g, lerp(1180, 1260, fan), 760, 1.0, '#C9A77A', -0.3);
  caption(g, 'Her old exam cards. She had been *here* too.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: she moves the whole pile aside. "you're looking at all of it at once."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), mv = es(t, 112.2, 113.6);
  setCam(g, { x: lerp(1200, 1180, u), y: 540, z: lerp(1.4, 1.46, u) });
  deskRoom(g, t, { clock: 21.7, warm: 1 });
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...SITP(), headOff: [0, 6], face: { look: [-0.6 * mv + 0.6 * (1 - mv), 0.1], sad: 0.5, wide: mv > 0.5 ? 1.15 : 1, blink: blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 14, px: -mv * 420 });
  const ay = Hero(g, { x: AYX - 200, y: DK_F, s: 1.05, ...AYESHA, handL: t > 112 && t < 113.8 ? [lerp(1000, 720, mv), 560] : null, face: { look: [-0.9, 0.2], smile: 0.4, blink: blink(t, 1.3) } }, { dir: -1, amt: 0.3 }); floorShadow(g, AYX - 200, DK_F + 2, 90);
  headText(g, "you're looking at all of it at once.", ay.head[0] - 120, ay.head[1] - 115, t, 110.6, 113.9);
  caption(g, 'He was carrying the *whole* exam.', capA(t, a + 0.4, b - 0.1), ACC);
}
// INSERT (top-down): one blank card. She writes: ONE TOPIC. 25 MIN.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), slide = es(t, 115.8, 116.5), pr = seg(t, 116.9, 119.6);
  setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.05, 1.12, u) });
  tableTop(g, t);
  indexCard(g, lerp(1500, 960, slide), 520, 1.5, { text: 'ONE TOPIC. 25 MIN.', prog: pr, rot: -0.03 });
  if (t > 116.8) { const px = 960 - 230 + pr * 460; const py = 545 + Math.sin(t * 30) * 6; pencilAt(g, px, py, 1.3, 2.6); topHand(g, px + 110, py + 200, 0.7, '#C9A77A', -0.5); } else topHand(g, lerp(1500, 960, slide) + 120, 760, 0.9, '#C9A77A', -0.3);
  caption(g, 'One *small* task. Nothing else.', capA(t, a + 0.4, b - 0.1), ACC);
}
// CLOSE: he nods. A small smile. She leaves: "just this one. then the next."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), nod = Math.max(0, Math.sin((t - 123.0) * 6)) * (t > 123 && t < 124 ? 1 : 0);
  setCam(g, { x: lerp(1110, 1115, u), y: 545, z: lerp(2.1, 2.2, u) });
  deskRoom(g, t, { clock: 21.75, warm: 1 });
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...SITP(), headOff: [0, 4 + nod * 8], face: { look: [0.7, -0.1], sad: lerp(0.5, 0.1, es(t, 122.4, 124)), smile: lerp(0, 0.5, es(t, 123, 124.4)), blink: blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 0, pile2: false, card: true });
  headText(g, 'just this one. then the next.', r.head[0] + 260, r.head[1] - 60, t, 122.0, 125.0);
  caption(g, 'Then the *next* one.', capA(t, a + 0.4, b - 0.1), ACC);
}
// INSERT: his own hand writes his first card
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), pr = seg(t, 127.2, 130.4);
  setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.05, 1.12, u) });
  tableTop(g, t);
  indexCard(g, 960, 520, 1.5, { text: 'Ch 1 - Topic 1', prog: pr, rot: 0.02 });
  const px = 960 - 200 + pr * 400; const py = 545 + Math.sin(t * 30) * 6; pencilAt(g, px, py, 1.3, 2.6); topHand(g, px + 110, py + 200, 0.7, C.cream, -0.5);
  courseHud(g, 0);
  caption(g, 'He wrote his *first* card.', capA(t, a + 0.4, b - 0.1), ACC);
}
defineClip(97.5, T, [s1, s2, s3, s4, s5, s6]);
})();
