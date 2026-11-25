// CLIP 1 (0:00-0:32) - the hook, Sam and the rocket, the first explosion, the fuse grows back shorter.
(() => {
const T = [0, 3, 9, 15, 21, 26.5, 32];
sfx(0.1, 'pen-write', 0.8); sfx(0.2, 'fuse-hiss'); sfx(2.4, 'boom'); sfx(2.4, 'piano-low-hit', 0.7);
sfx(3.0, 'kitchen-amb'); sfx(3.4, 'sizzle-pan', 0.7); sfx(5.5, 'pop-8bit-1'); sfx(6.0, 'paper-crinkle', 0.4);
sfx(9.0, 'kitchen-amb'); sfx(10.5, 'cup-knock'); sfx(10.7, 'splash-small'); sfx(11.0, 'fuse-light'); sfx(11.1, 'fuse-hiss', 0.7); sfx(11.3, 'pop-8bit-2');
sfx(15.0, 'kitchen-amb'); sfx(15.0, 'fuse-hiss', 0.9); sfx(15.8, 'demon-8bit-1'); sfx(16.3, 'whisper-purpose'); sfx(18.4, 'boom'); sfx(18.4, 'low-thud'); sfx(18.5, 'pop-8bit-3');
sfx(21.0, 'room-quiet'); sfx(21.3, 'smoke-fizz', 0.7); sfx(23.0, 'chair-creak', 0.6);
sfx(26.5, 'hall-amb'); sfx(26.6, 'steps', 0.8); sfx(28.5, 'bump'); sfx(28.8, 'fuse-light'); sfx(28.9, 'fuse-hiss', 0.7);

// the morning table (s2, s3, s5)
function morning(g, t, o = {}) {
  kitchen(g, t);
  const k = Math.sin(t * 3);
  const m = Mom(g, { x: 430, y: K_F, s: 1.05, handR: o.momTurn ? null : [520 - k * 6, 650], face: { look: o.momTurn ? [0.8, 0] : [-0.2, 0.8], sad: o.momTurn ? 0.4 : 0, smile: o.momTurn ? -0.1 : 0.3, blink: blink(t, 2.1) } }); floorShadow(g, 430, K_F + 2, 90);
  const sm = Sam(g, { x: KT[0], y: 744, hip: true, thigh: 20, face: { look: o.samLook || [0.7, 0], smile: o.samSmile ?? 0.7, sad: o.samSad || 0, wide: o.samWide || 1, blink: blink(t, 1.3) }, headOff: o.samShrink ? [0, 10 * o.samShrink] : [0, 0], ...(o.sam || {}) }, { dir: 1 });
  const hr = Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.1, handL: [KT[1] - 98, 724], handR: [KT[1] + 98, 722], face: { look: o.hLook || [-0.5, 0.4], smile: o.hSmile ?? 0.3, sad: o.hSad || 0, blink: blink(t, 0.4) }, ...(o.hero || {}) }, { dir: -1 });
  kitchenTable(g, t, { paper: true, spill: o.spill || 0, cupX: o.cupX, cup: o.cup });
  if (o.rocketHeld) rocket(g, sm.handR[0], sm.handR[1] - 40, 0.55, 0.1);
  else if (o.rocketTable) rocket(g, 640, 700, 0.5, 0);
  return { sm, hr, m };
}

// HOOK (3 s, over the picture): his face, the spark racing down the fuse - BOOM
function s1(g, t, a, b) {
  const sh = shake(t, 2.4, 16);
  setCam(g, { x: 960 + sh, y: 560, z: lerp(1.0, 1.08, ease(seg(t, a, b))) });
  g.fillStyle = '#07070b'; g.fillRect(-200, -200, 2400, 1500);
  const r = Hero(g, { x: 960, y: 1560, s: 2.6, face: { look: [0, -0.1], sad: -0.8, smile: -0.35, wide: 1.1 } }, { dir: 1, amt: 0.4, dim: 0.4 });
  if (t < 2.4) fuse(g, r, 2.6, lerp(0.9, 0.04, seg(t, 0.2, 2.4)), t, 1);
  glow(g, r.head[0], r.head[1] - 100, 300, FIRE, 0.12);
  burst(g, r.head[0], r.head[1] - 60, 700, seg(t, 2.4, 3.2));
  if (t < 2.4) blackLine(g, 'He was always about to *explode*.', seg(t, 0.15, 1.35), ACC, 1, 88, -360);
  flash(g, t, 2.4, '255,220,150');
}
// WIDE (the place + the people): Mom cooks, Sam gives him the rocket he made
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 5.2, 5.7);
  setCam(g, { x: lerp(940, 960, u), y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  const { sm } = morning(g, t, { rocketHeld: true, sam: { handR: [KT[0] + 40, lerp(726, 600, up)], handL: [KT[0] - 30, 724] }, hLook: [-0.6, 0.2], hSmile: 0.5 + up * 0.3 });
  headText(g, 'made it for you!', sm.head[0], sm.head[1] - 100, t, 5.5, 7.8);
  caption(g, 'His little brother, *Sam*, looked up to him.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.5;
// MEDIUM two-shot (cause): the cup tips - juice all over his homework - the fuse lights
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 10.3, 10.6), sp = es(t, 10.6, 11.1);
  setCam(g, { x: lerp(860, 870, u), y: 560, z: lerp(1.45, 1.55, u) });
  const { sm, hr } = morning(g, t, { rocketTable: true, cupX: lerp(760, 790, k), cup: k < 0.9, spill: sp, sam: { handR: [lerp(KT[0] + 40, 790, es(t, 9.8, 10.4)), 716] }, samLook: [0.6, 0.6], samSmile: t > 10.6 ? -0.1 : 0.5, samSad: t > 10.6 ? 0.6 : 0, samWide: t > 10.6 ? 1.3 : 1, hLook: t > 10.6 ? [-0.2, 0.8] : [-0.5, 0.4], hSmile: t > 10.6 ? -0.2 : 0.3, hSad: t > 10.9 ? -0.6 : 0 });
  if (k > 0.9) { g.save(); g.translate(820, 712); g.rotate(1.4); box(g, -15, -17, 30, 34, '#2c3a4a', 4); g.restore(); }
  if (t > 11.0) fuse(g, hr, 1.1, lerp(0.9, 0.82, seg(t, 11, 15)), t, es(t, 11.0, 11.2));
  headText(g, 'oops...', sm.head[0] - 20, sm.head[1] - 100, t, 11.3, 13.2);
  caption(g, 'But small things *lit* him up.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (emotion): the spark races down; a voice agrees with the anger; BOOM
function s4(g, t, a, b) {
  const sh = shake(t, 18.4, 14);
  setCam(g, { x: lerp(1060, 1075, ease(seg(t, a, b))) + sh, y: 470, z: lerp(2.0, 2.1, ease(seg(t, a, b))) });
  kitchen(g, t);
  const dA = es(t, 15.8, 16.5) * (1 - es(t, 18.2, 18.5));
  if (dA > 0) demonAt(g, t, 1250, 900, 0.9, 'he did it on purpose.', Math.min(seg(t, 16.3, 16.6), 1 - seg(t, 18.0, 18.3)), { a: dA, tx: 120, ty: 30, face: { look: [-0.7, 0.3] } });
  const boom = t > 18.4;
  const hr = Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.1, headOff: boom ? [0, -4] : [0, 4], handL: boom ? [KT[1] - 130, 590] : [KT[1] - 98, 724], handR: boom ? [KT[1] + 130, 590] : [KT[1] + 98, 722], face: { look: [-0.4, 0.5], sad: -0.9, smile: boom ? -0.6 : -0.3, wide: boom ? 1.3 : 1 } }, { dir: -1 });
  kitchenTable(g, t, { paper: true, spill: 1, cup: false });
  if (!boom) fuse(g, hr, 1.1, lerp(0.82, 0.03, seg(t, 15.2, 18.4)), t, 1);
  burst(g, hr.head[0], hr.head[1] - 40, 360, seg(t, 18.4, 19.4));
  headText(g, 'WATCH IT!', hr.head[0] - 220, hr.head[1] - 40, t, 18.5, 20.6);
  flash(g, t, 18.4);
  caption(g, 'And then he *exploded*.', capA(t, 18.6, b - 0.1), ACC);
}
// MEDIUM (after): smoke over his head. Sam hugs the rocket and shrinks back. Mom turns.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(820, 830, u), y: 555, z: lerp(1.3, 1.38, u) });
  const { hr } = morning(g, t, { momTurn: true, rocketHeld: true, sam: { handR: [KT[0] + 20, 640], handL: [KT[0] - 20, 650] }, samLook: [0.6, 0.3], samSmile: -0.2, samSad: 0.8, samWide: 1.2, samShrink: 1, spill: 1, cup: false, hLook: [-0.1, 0.9], hSmile: -0.1, hSad: 0.3 });
  fuse(g, hr, 1.1, 0.03, t, 0); smoke(g, hr.head[0] + 6, hr.head[1] - 60, t, 1 - seg(t, 24, 26.4), 1.1);
  caption(g, 'Then it was over. Until the next *spark*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (one-off place): school lockers. A bump - a NEW fuse grows on his head, shorter, and lights.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 980, u), y: 540, z: lerp(1, 1.08, u) });
  lockers(g, t);
  for (const [x0, v, c, acc] of [[1900, -70, '#8d8d9b', 'glasses'], [-100, 60, '#b49b80', 'longhair'], [1500, 0, '#9a8d7e', 'cap']]) {
    const x = x0 + v * (t - a); if (v) walker(g, x, 840, 0.95, Math.sign(v), t * 6, { col: c, acc }); else P(g, { x, y: 840, s: 0.95, col: c, acc, handR: [x + 30, 600], face: { look: [0.6, 0] } }); floorShadow(g, x, 842, 80);
  }
  const bumped = t > 28.5, hx = bumped ? 860 + (28.5 - a) * 80 : 860 + (t - a) * 80;
  const bx = lerp(1300, hx + 50, es(t, 26.8, 28.5));
  walker(g, bx, 840, 1.0, -1, t * 7, { col: '#a2a2ae', acc: 'cap', accCol: '#3b4a63' }); floorShadow(g, bx, 842, 80);
  const hr = bumped ? Hero(g, { x: hx - es(t, 28.5, 28.7) * 20, y: 840, s: 1.05, lean: -0.08 * (1 - es(t, 28.7, 29.3)), face: { look: [0.7, 0], sad: -0.7, smile: -0.3 } }, { dir: 1 }) : walker(g, hx, 840, 1.05, 1, t * 6.5, {});
  floorShadow(g, hx, 842, 90);
  if (t > 28.6) fuse(g, hr, 1.05, lerp(0, 0.62, es(t, 28.6, 28.85)), t, es(t, 28.8, 29.0));
  caption(g, 'Every new fuse was a little *shorter*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.4;
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
