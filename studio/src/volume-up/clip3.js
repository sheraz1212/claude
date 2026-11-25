// CLIP 3 (1:04-1:36) - the cost and the twist: the bench, the song stops, the letter.
(() => {
const T = [64, 69.5, 75, 80.5, 86, 91.5, 96];
sfx(64.0, 'night-amb'); sfx(64.0, 'phones-leak', 0.6); sfx(64.2, 'steps', 0.8); sfx(65.6, 'pop-8bit-1');
sfx(69.5, 'living-amb'); sfx(69.6, 'harm-off'); sfx(72.3, 'aid-squeal', 0.8);
sfx(75.0, 'living-amb'); sfx(77.0, 'drawer'); sfx(78.6, 'drawer', 0.6);
sfx(80.5, 'room-quiet'); sfx(80.7, 'paper-crinkle', 0.8); sfx(82.4, 'piano-low-hit', 0.6);
sfx(86.0, 'living-amb'); sfx(86.6, 'phones-off'); sfx(87.4, 'pop-8bit-2'); sfx(89.4, 'low-thud'); sfx(89.4, 'piano-low-hit');
sfx(91.5, 'night-amb'); sfx(92.6, 'demon-8bit-3'); sfx(93.2, 'whisper-toolate');

// WIDE (core place 4): the bench at night. Grandpa waves; he walks right past.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 990, u), y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  park(g, t);
  const pw = walker(g, 1700 - (t - a) * 90, 812, 0.85, -1, t * 6, { col: '#9a8d7e', acc: 'cap', accCol: '#3b4a63' }); floorShadow(g, 1700 - (t - a) * 90, 814, 70);
  const wave = t > 65.3 && t < 67.8, wv = Math.sin(t * 10) * 18;
  const gp = Gpa(g, { x: BENCH[0], y: BENCH[1], hip: true, thigh: 20, s: 1.1, handL: wave ? [BENCH[0] - 110 + wv, BENCH[1] - 230] : [BENCH[0] - 40, BENCH[1] - 20], handR: [BENCH[0] + 40, BENCH[1] - 24], armLines: false, face: { look: [-0.8, 0], smile: wave ? 0.8 : 0.2, sad: t > 68 ? 0.4 : 0 } }, { dir: 1 });
  benchFront(g); harmonica(g, BENCH[0] + 40, BENCH[1] - 30, 1.1, 0.2);
  const hx = 200 + (t - a) * 190;
  const hr = walker(g, hx, 812, 1.1, 1, t * 6.5, {}); phones(g, hr, 1.1, { on: 1, side: 1 }); floorShadow(g, hx, 814, 80);
  headText(g, 'sit with me?', gp.head[0] - 40, gp.head[1] - 115, t, 65.6, 67.8);
  caption(g, 'He walked right *past*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM (the turn): the song goes wrong. Grandpa stops, taps his ear.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), stop = t > 71.6;
  setCam(g, { x: lerp(1400, 1390, u), y: 540, z: lerp(1.4, 1.5, u) });
  livingRoom(g, t, { lamp: 0.8 });
  const gs = 1.15, pl = playPose(ARM[0], ARM[1], gs, { hip: true, lean: -0.05 }), tap = t > 72.2;
  const gpo = stop ? { handL: [ARM[0] - 40, ARM[1] - 26], handR: tap ? [ARM[0] + 78, ARM[1] - 200 + Math.sin(t * 14) * 4] : [ARM[0] + 44, ARM[1] - 30] } : pl;
  Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: gs, lean: -0.05, armLines: false, ...gpo, face: { look: stop ? [0.2, 0.5] : [0, 0.1], sad: stop ? 0.7 : 0, smile: stop ? -0.2 : 0.4, blink: stop ? 0 : 1 } }, { dir: 1 });
  if (!stop) { harmonica(g, pl._h[0], pl._h[1], gs); notes(g, pl._h[0] - 30, pl._h[1] - 40, t, 1 - seg(t, 70.8, 71.6), 1, '255,214,150', -1); }
  else harmonica(g, ARM[0] - 30, ARM[1] - 32, gs, 0.1);
  lrFront(g);
  caption(g, "One night, Grandpa's song *stopped*.", capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (emotion): he puts the harmonica away in the drawer
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), dr = Math.min(es(t, 76.6, 77.2), 1 - es(t, 78.4, 78.9)), k = es(t, 77.2, 78.2);
  setCam(g, { x: lerp(1330, 1320, u), y: 600, z: lerp(1.9, 2.0, u) });
  livingRoom(g, t, { lamp: 0.6, drawer: dr });
  const hand = [lerp(ARM[0] - 120, 1176, k), lerp(ARM[1] - 70, 760, k)];
  Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: 1.15, lean: -0.12 * k, armLines: false, handL: hand, bendL: -1, handR: [ARM[0] + 40, ARM[1] - 26], headOff: [0, 6], face: { look: [-0.7, 0.7], sad: 0.8, smile: -0.25, blink: blink(t, 0.5, 2.8) } }, { dir: 1 });
  if (t < 78.4) harmonica(g, hand[0] - 10, hand[1] - 4, 1.15, -0.1);
  lrFront(g);
  caption(g, 'He put the harmonica *away*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// INSERT top-down (the detail): the letter on the kitchen table
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 900, u), y: lerp(560, 520, u), z: lerp(1.0, 1.12, u) });
  letterInsert(g, t, { k: es(t, 80.7, 81.6) });
  caption(g, 'Then he found a *letter*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.3;
// MEDIUM (the twist, through Mom): headphones off, the letter in his hands
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 89.4);
  setCam(g, { x: lerp(920, 930, u) + sh, y: 560, z: lerp(1.4, 1.5, u) });
  livingRoom(g, t, { lamp: 0.7 });
  const hit = es(t, 89.4, 89.9);
  const m = Mom(g, { x: 1180, y: LR_F, s: 1.15, handL: [1120, 640], armLines: false, face: { look: [-0.8, 0.1], sad: 0.6, smile: -0.1, blink: blink(t, 1.4) } }, { dir: 1 }); floorShadow(g, 1180, LR_F + 2, 100);
  const hy = LR_F - 250 + hit * 10;
  const hr = Hero(g, { x: 800, y: LR_F, s: 1.15, headOff: [0, hit * 8], handL: [760, hy], handR: [858, hy - 6], armLines: false, face: { look: [0.1, 0.9 - hit * 0.5], wide: 1 + hit * 0.4, sad: 0.2 + hit * 0.6, smile: -0.1 - hit * 0.2, blink: blink(t, 0.3) } }, { dir: 1 });
  phones(g, hr, 1.15, { neck: true }); floorShadow(g, 800, LR_F + 2, 100);
  g.save(); g.translate(810, hy - 20); g.rotate(-0.08); box(g, -56, -70, 112, 140, '#ece5d2', 4); g.fillStyle = 'rgba(60,60,70,0.4)'; for (let i = 0; i < 5; i++) g.fillRect(-40, -50 + i * 20, 80 - i * 8, 6); g.fillStyle = '#b8322a'; g.fillRect(-40, 52, 70, 8); g.restore();
  headText(g, "he didn't want you to worry.", m.head[0] + 40, m.head[1] - 115, t, 87.4, 89.2);
  flash(g, t, 89.4);
  caption(g, 'Grandpa was going *deaf*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REFLECTION (the window): his own face, and the voice behind it
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(540, 530, u), z: lerp(1, 1.06, u) });
  const r = windowRefl(g, t, { demon: 0.6 * es(t, 92.6, 93.4), phones: 'neck', down: es(t, 92, 93) });
  demonText(g, 'too late.', 1300, 330, t, Math.min(seg(t, 93.2, 93.5), 1 - seg(t, 95.4, 95.9)), 84);
  caption(g, 'He could hear. He chose *not* to.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fout = 0.4;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
