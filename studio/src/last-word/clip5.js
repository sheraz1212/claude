// CLIP 5 (2:09-2:27) - the opening mirrored: the couch, movie night - now with his dad too, everyone laughing. The lesson.
(() => {
const T = [129, 135.5, 141.5, 147.5];
sfx(129.0, 'living-amb'); sfx(129.3, 'crowd-tv', 0.3); sfx(130.6, 'laugh-soft', 0.9); sfx(132.6, 'laugh-soft', 0.7); sfx(133.4, 'pop-8bit-1');
sfx(135.5, 'porch-amb'); sfx(135.8, 'crickets', 0.6); sfx(137.6, 'cup-clink', 0.6);
sfx(141.8, 'pen-write'); sfx(143.6, 'pen-write', 0.9);

// WIDE (the first shot again): the same couch. His dad sits with them. Everyone laughs. No walls.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), lg = Math.abs(Math.sin(t * 9)) * (t > 130.5 && t < 132.6 ? 1 : 0);
  setCam(g, { x: lerp(960, 975, u), y: 560, z: lerp(1.3, 1.36, u) });
  const { hr, gf } = couchShot(g, t, { hSmile: 0.95, gSmile: 0.95, hLook: [-0.4, -lg * 0.2], gLook: [-0.6, -lg * 0.2],
    extra: () => Hero(g, { x: 700, y: 712, hip: true, thigh: 20, s: 1.0, ...DADW, ...pose('hold', 700, 712, 1.0, { hip: true }), headOff: [0, -lg * 5], face: { look: [-0.5, 0], smile: 0.95, blink: blink(t, 1.2) } }, { dir: -1 }) });
  headText(g, 'okay, that ending WAS dumb.', hr.head[0] - 40, hr.head[1] - 110, t, 133.4, 135.4);
  wallsHud(g, 0);
  caption(g, 'No walls. Just *them*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// WIDE (the porch at sunset): two cups. He doesn't need the last word anymore.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1520, 1560, u), y: 560, z: lerp(1.35, 1.42, u) });
  porch(g, t);
  porchChair(g, 1450); porchChair(g, 1700);
  Hero(g, { x: 1450, y: 760, hip: true, thigh: 20, s: 1.05, ...DADW, ...(t > 137.4 && t < 138.6 ? { handR: [1490, 600] } : pose('hold', 1450, 760, 1.05, { hip: true })), face: { look: [0.7, 0], smile: 0.7, blink: blink(t, 1.4) } }, { dir: 1 }); porchChair(g, 1450, true);
  Hero(g, { x: 1700, y: 760, hip: true, thigh: 20, s: 1.05, ...pose('hold', 1700, 760, 1.05, { hip: true }), face: { look: [-0.7, 0], smile: 0.7, blink: blink(t, 0.4) } }, { dir: -1 }); porchChair(g, 1700, true);
  porchTable(g, 1575, 2, 1, t);
  wallsHud(g, 0);
  caption(g, 'He didn\'t need the last *word*.', capA(t, a + 0.6, b - 0.3), ACC);
}
s2.fin = 0.4; s2.fout = 0.6;
// THE LESSON
const s3 = card('Be *kind*, not right.', 0.4, 2.2, 96);
defineClip(129, T, [s1, s2, s3]);
})();
