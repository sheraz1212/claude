// CLIP 2 (0:34-1:09) - the locker room (he proves his teammate's mistake), the cafe (his fired friend gets a lecture),
// the low point (walled in, arguing online at 2 AM), the wisdom lines.
(() => {
const T = [34, 40, 45.5, 51.5, 57, 63, 69];
sfx(34.0, 'locker-amb'); sfx(35.0, 'pop-8bit-1'); sfx(37.4, 'pop-8bit-2'); sfx(38.8, 'smug-brass', 0.8);
sfx(40.0, 'locker-amb', 0.7); for (let i = 0; i < 6; i++) sfx(40.6 + i * 0.45, 'brick', 0.75 + i * 0.04); sfx(43.4, 'low-thud', 0.7);
sfx(45.5, 'cafe-amb'); sfx(46.2, 'pop-8bit-3'); sfx(48.4, 'pop-8bit-1'); sfx(50.4, 'smug-brass', 0.7);
sfx(51.5, 'cafe-amb', 0.7); for (let i = 0; i < 6; i++) sfx(52.0 + i * 0.45, 'brick', 0.75 + i * 0.04); sfx(54.8, 'low-thud', 0.8); sfx(55.4, 'chair-creak', 0.6); sfx(55.8, 'steps', 0.5);
sfx(57.0, 'night-amb'); sfx(57.6, 'typing', 0.7); sfx(59.4, 'typing', 0.7); sfx(61.0, 'msg-out', 0.6); sfx(61.4, 'smug-brass', 0.5);
sfx(63.3, 'pen-write'); sfx(65.3, 'pen-write', 0.9);

// the locker room after a loss: his teammate on the bench, head down
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(920, 935, u), y: 560, z: lerp(1.35, 1.42, u) });
  const { mt, hr } = lockerShot(g, t, { point: t > 37.4 && t < 39.6, smile: t > 38.8 ? 0.6 : 0.1 });
  headText(g, 'my fault, man.', mt.head[0] + 40, mt.head[1] - 110, t, 35.0, 37.2);
  headText(g, 'yeah. you missed 3 free throws.', hr.head[0] - 20, hr.head[1] - 115, t, 37.4, 39.9);
  winsHud(g, t > 38.8 ? 20 : 9);
  caption(g, 'After the *loss*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.4;
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 40.4, 43.4);
  setCam(g, { x: lerp(910, 915, u), y: lerp(560, 545, u), z: lerp(1.5, 1.6, u) });
  lockerShot(g, t, { wall: w, wallT: 43.4, smile: 0.4 });
  winsHud(g, 20);
  caption(g, 'Another *wall*.', capA(t, 42.6, b - 0.1), ACC);
}
// the cafe: his best friend just lost his job. "well, actually, you should've..."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 965, u), y: 570, z: lerp(1.38, 1.45, u) });
  const { bd, hr } = cafeShot(g, t, { point: t > 48.4 && t < 50.8, smile: 0.3 });
  headText(g, 'got fired today.', bd.head[0] + 30, bd.head[1] - 110, t, 46.2, 48.2);
  headText(g, "well, actually, you should've...", hr.head[0] - 30, hr.head[1] - 115, t, 48.4, 51.3);
  winsHud(g, 20);
  caption(g, 'His best friend lost his *job*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.4;
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 51.8, 54.8);
  setCam(g, { x: lerp(960, 960, u), y: lerp(570, 555, u), z: lerp(1.4, 1.5, u) });
  cafeShot(g, t, { wall: w, wallT: 54.8, smile: 0.3 });
  winsHud(g, t > 52 ? 35 : 20);
  caption(g, 'He was right. His friend *left*.', capA(t, 53.6, b - 0.1), ACC);
}
// THE LOW POINT (his room, 2 AM): walls on every side. Arguing with a stranger online. WINS 47.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), PH = pose('phone', SIT[0], SIT[1], SS, { hip: true });
  setCam(g, { x: lerp(560, 540, u), y: lerp(500, 510, u), z: lerp(1.1, 1.2, u) });
  const r = onBed(g, t, { under: 0, hero: { ...PH, headOff: [0, 8], face: { look: [0.1, 0.9], smile: t > 61.2 ? 0.4 : 0.1, sad: 0.4, blink: blink(t, 0.6) } } });
  phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 0.9); glow(g, r.head[0] + 20, r.head[1] + 40, 80, GREEN, 0.12);
  brickWall(g, -60, 900, 340, 900, 1, 0, 23); brickWall(g, 930, 900, 160, 900, 1, 0, 21); brickWall(g, 1300, 760, 420, 640, 1, 0, 22);
  winsHud(g, 35 + Math.floor(es(t, 57.5, 61.4) * 12));
  caption(g, 'He won every time. *Alone*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s5.fin = 0.5; s5.fout = 0.5;
// WISDOM
const s6 = card2('You can win the argument', 'and lose the *person*.', 0.3, 1.8, 88);
defineClip(34, T, [s1, s2, s3, s4, s5, s6]);
})();
