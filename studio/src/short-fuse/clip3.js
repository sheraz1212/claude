// CLIP 3 (1:04-1:36) - the twist: Sam explodes like him. Then the biggest blast. The rocket breaks.
(() => {
const T = [64, 69.5, 75, 80.5, 86, 91.5, 96];
sfx(64.0, 'park-amb'); sfx(64.4, 'kids-play', 0.7); sfx(66.0, 'ball-bounce', 0.6); sfx(66.3, 'fuse-light', 0.7); sfx(66.4, 'fuse-hiss', 0.5); sfx(67.6, 'boom-small'); sfx(67.7, 'pop-8bit-1'); sfx(68.0, 'thump-small', 0.8);
sfx(69.5, 'park-amb'); sfx(70.2, 'heartbeat', 0.7); sfx(71.0, 'piano-low-hit', 0.6);
sfx(75.0, 'kitchen-night'); sfx(75.6, 'pop-8bit-2'); sfx(77.0, 'fuse-light'); sfx(77.1, 'fuse-hiss'); sfx(78.6, 'boom-big'); sfx(78.6, 'timpani-boom', 0.8); sfx(78.9, 'paper-crush');
sfx(80.5, 'room-quiet'); sfx(81.2, 'paper-crinkle', 0.5); sfx(82.4, 'piano-tear-note', 0.6);
sfx(86.0, 'kitchen-night'); sfx(86.6, 'sniffle', 0.7); sfx(88.0, 'pop-8bit-3'); sfx(88.2, 'low-thud'); sfx(88.2, 'piano-low-hit');
sfx(91.5, 'night-amb'); sfx(92.4, 'demon-8bit-3'); sfx(93.0, 'whisper-whoyouare');

// WIDE (core place 4): the playground. A kid takes Sam's ball - Sam's own little fuse lights - he explodes
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 67.6, 6);
  setCam(g, { x: lerp(820, 860, u) + sh, y: lerp(560, 570, u), z: lerp(1.05, 1.13, u) });
  playground(g, t);
  const grab = t > 66.0, boom = t > 67.6, fall = es(t, 67.7, 68.1);
  const kx = 690 - fall * 30;
  const kid = Sam(g, { x: kx, y: PG_F, col: '#A9A9B4', acc: 'glasses', lean: -0.3 * fall, armLines: false, handL: grab ? [kx - 20, PG_F - 150] : null, handR: grab ? [kx + 20, PG_F - 150] : null, face: { look: [-0.8, 0], smile: grab && !boom ? 0.6 : -0.2, sad: boom ? 0.8 : 0, wide: boom ? 1.3 : 1 } }); floorShadow(g, kx, PG_F + 2, 50);
  const sm = Sam(g, { x: 530, y: PG_F, lean: boom ? 0.15 : 0, armLines: false, handL: boom ? [600, PG_F - 160] : (grab ? [510, PG_F - 120] : [520, PG_F - 150]), handR: boom ? [610, PG_F - 150] : (grab ? [550, PG_F - 120] : [570, PG_F - 150]), face: { look: [0.8, 0], sad: grab ? -0.9 : 0, smile: grab ? -0.4 : 0.8 } }); floorShadow(g, 530, PG_F + 2, 50);
  ball(g, grab ? kx : 545, grab ? PG_F - 165 : PG_F - 165, 0.8);
  if (t > 66.3) fuse(g, sm, 0.62, boom ? 0.03 : lerp(0.5, 0.03, seg(t, 66.3, 67.6)), t, boom ? 0 : 1);
  burst(g, sm.head[0], sm.head[1] - 20, 130, seg(t, 67.6, 68.3), 9); if (boom) smoke(g, sm.head[0], sm.head[1] - 40, t, 1, 0.6);
  headText(g, 'MINE!', sm.head[0] - 40, sm.head[1] - 90, t, 67.7, 69.3);
  const hr = Hero(g, { x: 1100, y: BENCH[1], hip: true, thigh: 20, s: 1.0, face: { look: [-0.8, 0.2], smile: boom ? -0.1 : 0.3, wide: boom ? 1.3 : 1, sad: boom ? 0.5 : 0 } }, { dir: -1 });
  benchFront(g);
  caption(g, 'Then Sam lost his *temper*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// CLOSE (the twist lands): on the bench, he sees it
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1060, y: lerp(470, 465, u), z: lerp(2.0, 2.12, u) });
  playground(g, t);
  const k = es(t, 70.8, 72);
  Hero(g, { x: 1100, y: BENCH[1], hip: true, thigh: 20, s: 1.0, headOff: [0, 4 * k], face: { look: [-0.8, lerp(0.2, 0.5, k)], wide: lerp(1.35, 1, k), sad: 0.4 + 0.5 * k, smile: -0.2, blink: blink(t, 0.7) } }, { dir: -1 });
  benchFront(g);
  caption(g, 'Sam had learned it from *him*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM (the biggest one): Mom asks for help. The fuse is so short now. BOOM - the rocket flies.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 78.6, 22), boom = t > 78.6, k = seg(t, 78.6, 79.3);
  setCam(g, { x: lerp(1060, 1075, u) + sh, y: 545, z: lerp(1.35, 1.45, u) });
  kitchen(g, t, { night: true, lamp: 0.6 });
  const m = Mom(g, { x: 1330, y: K_F, s: 1.05, armLines: false, handL: [1280, 700], handR: [1370, 704], face: { look: [-0.8, 0.1], smile: boom ? -0.2 : 0.3, sad: boom ? 0.7 : 0.2, wide: boom ? 1.3 : 1 } }); box(g, 1268, 660, 120, 54, '#3a3a46', 8); floorShadow(g, 1330, K_F + 2, 90);
  const hr = Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.1, handL: boom ? [KT[1] - 130, 580] : [KT[1] - 98, 724], handR: boom ? [KT[1] + 130, 590] : [KT[1] + 98, 722], face: { look: [0.6, 0], sad: t > 77 ? -0.9 : 0, smile: t > 77 ? -0.5 : 0, wide: boom ? 1.3 : 1 } }, { dir: 1 });
  kitchenTable(g, t, { cup: false });
  if (!boom) rocket(g, 880, 700, 0.55, 0); else if (k < 1) rocket(g, lerp(880, 620, k), lerp(700, 800, k) - Math.sin(k * Math.PI) * 220, 0.55, -k * 7);
  else rocket(g, 620, 830, 0.55, 0, true);
  if (t > 77) fuse(g, hr, 1.1, boom ? 0.02 : lerp(0.15, 0.02, seg(t, 77, 78.6)), t, boom ? 0 : 1);
  burst(g, hr.head[0], hr.head[1] - 40, 620, seg(t, 78.6, 79.9), 11);
  if (boom) smoke(g, hr.head[0] + 6, hr.head[1] - 60, t, 1, 1.1);
  headText(g, 'can you help me?', m.head[0], m.head[1] - 115, t, 75.6, 77.4);
  flash(g, t, 78.6);
  caption(g, 'Then came the *biggest* one.', capA(t, a + 0.5, b - 0.1), ACC);
}
// INSERT top-down (the object): the rocket in pieces on the kitchen floor
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(1, 1.08, u) });
  g.fillStyle = '#121117'; g.fillRect(-200, -200, 2400, 1500);
  g.strokeStyle = 'rgba(106,106,120,0.22)'; g.lineWidth = 2; for (let x = -200; x < 2200; x += 160) { g.beginPath(); g.moveTo(x, -200); g.lineTo(x + 300, 1300); g.stroke(); } for (let y = -200; y < 1400; y += 160) { g.beginPath(); g.moveTo(-200, y); g.lineTo(2200, y - 100); g.stroke(); }
  glow(g, 960, 500, 700, WARM, 0.08);
  rocket(g, 900, 560, 3.2, 0.1, true);
  g.save(); g.translate(1280, 680); g.rotate(-0.3); g.fillStyle = '#efe8d4'; g.fillRect(-80, -40, 160, 80); g.strokeStyle = C.line; g.lineWidth = 3; g.strokeRect(-80, -40, 160, 80); g.fillStyle = '#2b2b38'; g.font = '700 36px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SAM + ME', 0, 2); g.restore();
  caption(g, "Sam's rocket. In *pieces*.", capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.3;
// MEDIUM (the hurt): Sam crying in Mom's arms. "you're scary." It hits him.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 88.2, 8), hit = es(t, 88.2, 88.7);
  setCam(g, { x: lerp(820, 830, u) + sh, y: 545, z: lerp(1.4, 1.5, u) });
  kitchen(g, t, { night: true, lamp: 0.5 });
  Mom(g, { x: 560, y: K_F, s: 1.05, armLines: false, handL: [520, 700], handR: [650, 690], face: { look: [0.7, 0.2], sad: 0.8, smile: -0.2, blink: blink(t, 1.5) } }); floorShadow(g, 560, K_F + 2, 90);
  const sm = Sam(g, { x: 640, y: K_F, armLines: false, handL: [624, K_F - 200], handR: [656, K_F - 200], headOff: [0, Math.sin(t * 9) * 1.5], face: { look: [0.6, 0.1], sad: 1, smile: -0.4, blink: blink(t, 0.3, 2) } }); floorShadow(g, 640, K_F + 2, 50);
  for (const sg of [-1, 1]) { const ty = sm.head[1] + 10 + ((t * 0.8 + (sg > 0 ? 0.5 : 0)) % 1) * 30; g.fillStyle = 'rgba(230,240,255,0.85)'; g.beginPath(); g.ellipse(sm.head[0] + sg * 12, ty, 2.6, 4, 0, 0, 7); g.fill(); }
  const hr = Hero(g, { x: 1080, y: K_F, s: 1.1, headOff: [0, hit * 8], lean: -0.05 * hit, face: { look: [-0.8, 0.2 + hit * 0.4], sad: 0.3 + hit * 0.7, smile: -0.2, wide: 1 + hit * 0.3 } }, { dir: -1 }); floorShadow(g, 1080, K_F + 2, 90);
  fuse(g, hr, 1.1, 0.02, t, 0); smoke(g, hr.head[0] + 6, hr.head[1] - 55, t, 0.6, 1.1);
  rocket(g, 860, K_F - 10, 0.55, 0, true);
  headText(g, "you're scary.", sm.head[0] + 120, sm.head[1] - 60, t, 88.0, 90.6);
  caption(g, 'Sam was *afraid* of him.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REFLECTION (the dark window): himself, the burnt stub, and the voice
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(540, 530, u), z: lerp(1, 1.06, u) });
  windowRefl(g, t, { demon: 0.6 * es(t, 92.4, 93.2), stub: true, down: es(t, 92, 93) });
  demonText(g, "that's who you are.", 1300, 330, t, Math.min(seg(t, 93.0, 93.3), 1 - seg(t, 95.4, 95.9)), 80);
  caption(g, 'Was this who he *was*?', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fout = 0.4;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
