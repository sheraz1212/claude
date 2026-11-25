// CLIP 6 (2:40-3:10) - the mirror: the same game night, phones face down. The court full again. The lesson.
(() => {
const T = [160, 166, 172, 177.5, 183, 190];
sfx(160.0, 'apt-amb'); sfx(160.0, 'crowd-tv', 0.7); sfx(162.6, 'tv-cheer', 0.8);
sfx(166.0, 'apt-amb'); sfx(166.0, 'crowd-tv', 0.5); sfx(167.0, 'pop-8bit-1'); sfx(169.2, 'pop-8bit-2');
sfx(172.0, 'court-amb'); [172.3, 172.8, 173.3, 173.8].forEach(x => sfx(x, 'ball-bounce', 0.6)); sfx(174.6, 'net-swish'); sfx(174.8, 'kids-cheer', 0.7);
sfx(177.5, 'court-amb'); sfx(178.6, 'count-tick', 0.6); sfx(178.8, 'celesta-sparkle', 0.6);
sfx(183.6, 'pen-write');

function night(g, t, o = {}) {
  apartment(g, t, { dust: 0 });
  const cheer = o.cheer ? es(t, o.cheer, o.cheer + 0.3) * (1 - es(t, o.cheer + 1.4, o.cheer + 1.8)) : 0;
  const fr = P(g, { x: COUCH[0], y: 712, hip: true, thigh: 20, s: 1.1, col: '#A9A9B4', acc: 'glasses', handL: cheer ? [COUCH[0] - 60, 520] : null, handR: cheer ? [COUCH[0] + 60, 520] : null, face: { look: o.fLook || [-0.8, 0.1], smile: 0.5 + cheer * 0.4, blink: blink(t, 2.2) } });
  const hr = Hero(g, { x: COUCH[1], y: 712, hip: true, thigh: 20, s: 1.1, handL: cheer ? [COUCH[1] - 60, 520] : null, handR: cheer ? [COUCH[1] + 60, 520] : null, face: { look: o.hLook || [-0.8, 0.1], smile: 0.6 + cheer * 0.4, blink: blink(t, 0.4) } }, { dir: -1 });
  const mx = Hero(g, { x: COUCH[2], y: 712, hip: true, thigh: 20, s: 1.1, ...MARCUS, handL: cheer ? [COUCH[2] - 60, 520] : null, handR: cheer ? [COUCH[2] + 60, 520] : null, face: { look: [-0.8, 0.1], smile: 0.6 + cheer * 0.4, blink: blink(t, 1.1) } }, { dir: -1 });
  apFront(g, t, { facedown: true });
  hoodBall(g, 1770, AP_F - 26, 1, 0);
  return { fr, hr, mx };
}
// WIDE (the mirror of the first game night): same couch, same friends - phones face down
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 980, u), y: lerp(590, 600, u), z: lerp(1.12, 1.2, u) });
  night(g, t, { cheer: 162.6 });
  counter(g, t);
  caption(g, 'Game night again. Phones face *down*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.6;
// MEDIUM (the answer): "got money on this?" - "nah. just watching."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 910, u), y: 530, z: lerp(1.5, 1.6, u) });
  const { fr, hr } = night(g, t, { fLook: t > 166.8 && t < 169 ? [0.8, 0.1] : [-0.8, 0.1], hLook: t > 169 && t < 171 ? [-0.8, 0] : [-0.8, 0.1] });
  headText(g, 'got money on this?', fr.head[0] - 20, fr.head[1] - 115, t, 167.0, 169.0);
  headText(g, 'nah. just watching.', hr.head[0] + 20, hr.head[1] - 115, t, 169.2, 171.6);
  counter(g, t);
  caption(g, 'Just the *game*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (core place 4, full again): dusk at the court. Pickup game. He scores.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1020, u), y: lerp(545, 555, u), z: lerp(1, 1.08, u) });
  outCourt(g, t, { dusk: true, lamp: 0.6 });
  const shoot = t > 173.9, k = seg(t, 173.9, 174.6), cheer = t > 174.6;
  for (const [x, c, acc, d, ac] of [[620, '#A9A9B4', 'glasses', 1, null], [1330, '#9a8d7e', 'cap', -1, '#6b3a3a'], [1500, '#b49b80', 'longhair', -1, '#3a2d2a']]) { P(g, { x, y: OC_F, s: 1.0, col: c, acc, accCol: ac, handL: cheer ? [x - 50, 560] : null, handR: cheer ? [x + 50, 560] : null, face: { look: [d * 0.6, cheer ? -0.4 : 0], smile: cheer ? 0.9 : 0.4 } }); floorShadow(g, x, OC_F + 2, 80); }
  Hero(g, { x: 1130, y: OC_F, s: 1.0, ...MARCUS, handL: cheer ? [1080, 560] : null, handR: cheer ? [1180, 560] : null, face: { look: [-0.5, cheer ? -0.4 : 0], smile: 0.8 } }, { dir: -1 }); floorShadow(g, 1130, OC_F + 2, 80);
  const hx = 880;
  Hero(g, { x: hx, y: OC_F, s: 1.05, handR: shoot ? [hx + 30, 560] : [hx + 46, OC_F - 150], handL: shoot ? [hx - 10, 560] : null, face: { look: [0.7, shoot ? -0.6 : 0.2], smile: 0.8 } }, { dir: 1 }); floorShadow(g, hx, OC_F + 2, 90);
  if (!shoot) hoodBall(g, hx + 50, OC_F - 30 - Math.abs(Math.sin(t * 6)) * 110, 0.85); else hoodBall(g, lerp(hx + 10, 1560, Math.min(k, 1)), lerp(530, 360, Math.min(k, 1)) - Math.sin(Math.min(k, 1) * Math.PI) * 220 + (t > 174.6 ? (t - 174.6) * 300 : 0), 0.85);
  counter(g, t);
  caption(g, 'And the court was full *again*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.5;
// CLOSE (emotion): his face in the warm lamp light. The number reaches zero.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 950, y: lerp(470, 465, u), z: lerp(2.0, 2.1, u) });
  outCourt(g, t, { dusk: true, lamp: 0.6 });
  glow(g, 900, 420, 300, WARM, 0.15);
  Hero(g, { x: 940, y: OC_F, s: 1.05, handR: [990, 700], face: { look: [-0.2, -0.3], smile: 0.8, blink: blink(t, 0.6) } }, { dir: 1 });
  hoodBall(g, 1000, 690, 0.85);
  counter(g, t);
  caption(g, 'He still loved the game. Now he *played* it.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fout = 0.5;
const s5 = card('The house always wins. *Walk away*.', 0.5, 2.8, 92);
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
