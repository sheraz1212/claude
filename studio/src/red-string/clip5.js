// CLIP 5 (2:11-2:30) - he passes the notebook to the new guy, the hook mirrored (he sleeps), the lesson.
(() => {
const T = [131, 137.5, 144, 150];
sfx(131.0, 'office-amb'); sfx(131.4, 'thread-creak', 0.5); sfx(132.0, 'steps', 0.6); sfx(133.6, 'pop-8bit-3'); sfx(134.6, 'paper-slide', 0.7);
sfx(137.5, 'night-amb'); sfx(138.4, 'breath-sleep', 0.8); sfx(140.6, 'thread-snap', 0.5); sfx(140.8, 'celesta-sparkle', 0.5);
sfx(144.3, 'pen-write'); sfx(146.2, 'pen-write', 0.9);

// MEDIUM (office): a new guy stares at his phone - a thin red thread starting. He walks over and hands him the notebook.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 131.6, 133.4), give = es(t, 134.2, 134.9);
  setCam(g, { x: lerp(1000, 1020, u), y: 560, z: lerp(1.35, 1.42, u) });
  office(g, t, { day: true });
  const nx = 1200, ph = pose('phone', nx, 760, 1.0, { hip: true });
  const ng = P(g, { x: nx, y: 760, hip: true, thigh: 20, s: 1.0, col: '#A9A9B4', acc: 'cap', accCol: '#3b4a63', ...(give > 0.5 ? { handR: [1120, 640] } : ph), headOff: [0, 6], face: { look: give > 0.3 ? [-0.8, 0] : [0, 0.9], sad: give > 0.5 ? 0.1 : 0.5, smile: give > 0.8 ? 0.4 : 0 } });
  if (give <= 0.5) phoneAt(g, ph.handR[0], ph.handR[1] - 10, 1.0, 0.8);
  if (give < 0.8) thread(g, [[ng.head[0] - 10, ng.head[1] - 40], [ng.head[0] + 30, ng.head[1] - 100], [ng.head[0] - 20, ng.head[1] - 160]], es(t, 131.2, 132.4) * (1 - give), 3, t);
  officeDesk(g, nx, 760, 1.0, { monX: 110 });
  const hx = lerp(700, 1010, go);
  const r = go < 1 ? walker(g, hx, OF_F, 1.05, 1, t * 6, { face: { smile: 0.5 } }) : Hero(g, { x: hx, y: OF_F, s: 1.05, handR: give < 1 ? [lerp(1070, 1110, give), 650] : null, face: { look: [0.8, 0.2], smile: 0.6, blink: blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, hx, OF_F + 2, 90);
  if (go >= 1) notebook(g, lerp(1080, 1120, give), 650, 0.9, 0.2);
  headText(g, 'write it down. it helps.', r.head[0] - 40, r.head[1] - 115, t, 133.6, 136.6);
  loopsHud(g, 0);
  caption(g, 'He passed it *on*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
// WIDE (the hook, mirrored): his bed at night. Phone face down. He sleeps. One last thread falls - and turns to light.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), fall = es(t, 138.6, 140.6);
  setCam(g, { x: lerp(360, 380, u), y: lerp(540, 530, u), z: lerp(1.4, 1.48, u) });
  heroRoom(g, t, { lying: true, eyesOpen: false, lamp: 0.3 });
  box(g, 60, 632, 40, 8, '#0a0a0e', 2);
  if (fall < 1) { g.save(); g.globalAlpha = 1 - fall * 0.6; thread(g, [[420, 200 + fall * 300], [440, 260 + fall * 300], [410, 320 + fall * 300], [430, 380 + fall * 300]], 1, 3, t); g.restore(); }
  glow(g, 425, 520, 120 * es(t, 140.4, 141.2), WARM, 0.4 * (1 - seg(t, 141.6, 143)));
  loopsHud(g, 0);
  caption(g, 'He finally *slept*.', capA(t, a + 0.6, b - 0.3), ACC);
}
s2.fin = 0.4; s2.fout = 0.6;
// THE LESSON
const s3 = card("Don't believe every *thought* you think.", 0.4, 2.6, 78);
defineClip(131, T, [s1, s2, s3]);
})();
