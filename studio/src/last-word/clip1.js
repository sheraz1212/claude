// CLIP 1 (0:00-0:34) - movie night: he proves her wrong -> a wall. Family dinner: he corrects his dad in front of guests -> a wall.
(() => {
const T = [0, 6, 11, 17, 22.5, 28, 34];
sfx(0.0, 'living-amb'); sfx(0.3, 'crowd-tv', 0.3); sfx(2.6, 'pop-8bit-1'); sfx(4.5, 'pop-8bit-2');
sfx(6.0, 'living-amb'); sfx(6.6, 'phone-tap-soft', 0.7); sfx(7.4, 'pop-8bit-3'); sfx(9.4, 'smug-brass', 0.8);
sfx(11.0, 'living-amb'); for (let i = 0; i < 5; i++) sfx(11.8 + i * 0.5, 'brick', 0.7 + i * 0.05); sfx(14.4, 'low-thud', 0.6);
sfx(17.0, 'dinner-amb'); sfx(17.6, 'dish-clink', 0.6); sfx(18.4, 'pop-8bit-1'); sfx(20.6, 'cup-clink', 0.5);
sfx(22.5, 'dinner-amb'); sfx(23.0, 'pop-8bit-2'); sfx(24.6, 'laugh-soft', 0.8); sfx(25.4, 'smug-brass', 0.8);
sfx(28.0, 'dinner-amb', 0.6); for (let i = 0; i < 6; i++) sfx(28.6 + i * 0.45, 'brick', 0.75 + i * 0.04); sfx(31.4, 'low-thud', 0.7);

// HOOK (second 0): movie night on the couch, the TV's glow. She loved the ending. "actually, it made no sense."
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 975, u), y: 560, z: lerp(1.3, 1.36, u) });
  const { hr, gf } = couchShot(g, t, { gLook: [-0.6, -0.1], hLook: [-0.3, 0] });
  headText(g, 'the ending was so good!', gf.head[0] + 40, gf.head[1] - 110, t, 2.6, 4.4);
  headText(g, 'actually, it made no sense.', hr.head[0] - 40, hr.head[1] - 110, t, 4.5, 5.95);
  winsHud(g, 0);
  hookLine(g, t, 'He never *lost* an argument.', 0.15, 1.3, 1 - seg(t, 5.4, 5.9));
}
// MEDIUM: he shows her the phone. Proof. She goes quiet.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), quiet = es(t, 9.0, 9.8);
  setCam(g, { x: lerp(980, 990, u), y: 520, z: lerp(1.75, 1.82, u) });
  const { hr, gf } = couchShot(g, t, { phone: true, hSmile: 0.8, gLook: [lerp(-0.6, 0.6, quiet), lerp(0, 0.4, quiet)], gSmile: lerp(0.4, -0.1, quiet), gSad: 0.6 * quiet });
  headText(g, "see? I'm right.", hr.head[0] - 40, hr.head[1] - 110, t, 7.4, 9.6);
  winsHud(g, t > 9.4 ? 1 : 0);
  caption(g, 'He proved his *girlfriend* wrong.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: a brick wall rises between them.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 11.6, 14.2);
  setCam(g, { x: lerp(980, 980, u), y: lerp(560, 540, u), z: lerp(1.4, 1.5, u) });
  couchShot(g, t, { wall: w, wallT: 14.2, hSmile: 0.5, gLook: [0.7, 0.3], gSmile: -0.1, gSad: 0.7 });
  winsHud(g, 1);
  caption(g, 'He *won*.', capA(t, 13.6, b - 0.1), ACC);
}
// WIDE (family dinner, guests): his dad tells a story - "it was back in 1998..."
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 990, u), y: lerp(540, 550, u), z: lerp(1.08, 1.14, u) });
  const { dd } = dinnerShot(g, t);
  headText(g, 'it was back in 1998...', dd.head[0], dd.head[1] - 110, t, 18.4, 21.8);
  winsHud(g, 1);
  caption(g, 'Family dinner. *Guests* over.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// MEDIUM: "it was 2001, dad." The guests laugh. His dad's smile drops.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), drop = es(t, 25.4, 26.4);
  setCam(g, { x: lerp(920, 930, u), y: 560, z: lerp(1.5, 1.56, u) });
  const { hr } = dinnerShot(g, t, { laugh: t > 24.5 && t < 26.2, dSmile: lerp(0.7, -0.1, drop), dSad: 0.7 * drop, dLook: [0.5, 0.5 * drop], hSmile: 0.8 });
  headText(g, 'it was 2001, dad.', hr.head[0] + 40, hr.head[1] - 110, t, 23.0, 25.4);
  winsHud(g, t > 25.4 ? 9 : 1);
  caption(g, 'He corrected his *dad*. In front of everyone.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: the wall rises across the table. His dad looks down at his plate.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 28.4, 31.4);
  setCam(g, { x: lerp(910, 915, u), y: lerp(560, 545, u), z: lerp(1.45, 1.55, u) });
  dinnerShot(g, t, { wall: w, wallT: 31.4, dSmile: -0.1, dSad: 0.8, dLook: [0, 0.9], hSmile: 0.4 });
  winsHud(g, 9);
  caption(g, 'His dad stopped *talking*.', capA(t, 30.6, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
