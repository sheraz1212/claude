// CLIP 6 (2:40-3:10) - the quiet after, the mirrored library, the lesson.
(() => {
const T = [160, 165.5, 171, 176.5, 183, 190];
sfx(160.2, 'tap-water'); sfx(162.4, 'celesta-sparkle', 0.7); sfx(165.5, 'night-amb'); sfx(171, 'lib-amb'); sfx(176.5, 'lib-amb'); sfx(177.6, 'book-slide'); sfx(177.2, 'pop-8bit-1'); sfx(179.4, 'pop-8bit-3'); sfx(181.6, 'pop-8bit-2'); sfx(183.6, 'pen-write', 0.9);

// REFLECTION (the mirror, one last time): no voice behind him. His own smile.
function s1(g, t, a, b) {
  setCam(g, { x: 960, y: 535, z: lerp(1, 1.06, ease(seg(t, a, b))) });
  mirror(g, t, { warm: true, lv: 1, bags: 0, face: { smile: lerp(0.1, 0.9, es(t, 161.6, 162.8)), blink: (t > 161.2 && t < 161.34) ? 1 : 0 } });
  hud(g, 'DAYS CLEAN', 41);
  caption(g, 'The mirror was *his* again.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// THE REPEATED BED SHOT, reversed: dark, quiet, door open. Nothing glows.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 900, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  dorm(g, t, { sleeping: true, glow: 0, bookAt: null, door: 'open' });
  glow(g, 330, 660, 60, WARM, 0.35 + 0.08 * Math.sin(t * 1.4));
  for (let i = 0; i < 3; i++) { const p = ((t * 0.4 + i * 0.33) % 1); g.save(); g.globalAlpha = (1 - p) * 0.7; g.fillStyle = '#fff'; g.font = `400 ${22 + p * 22}px Nunito`; g.fillText('z', 320 + p * 50, 560 - p * 90); g.restore(); }
  hud(g, 'DAYS CLEAN', 41);
  caption(g, 'The nights got *quiet*.', capA(t, a + 0.7, b - 0.1), ACC);
}
function maya(g, t, o = {}) { return P(g, { x: 1160, y: 740, hip: true, thigh: 20, s: 1.25, ...MAYA, face: { look: [0, 0.85], smile: 0.2, blink: ((t + 1.3) % 4.1 < 0.14) ? 1 : 0 }, headOff: [0, 6], ...o }, 1); }
// WIDE - THE MIRROR OF THE FIRST SCENE: the same library. He walks in with her book.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 930, u), y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  library(g, t, { behind: () => { const wx = 1900 - (t - a) * 70; const w = walker(g, wx, 722, 0.8, -1, wx / 30, { col: '#8d8d9b', acc: 'glasses' }); light(g, w, 0.8, 0.85); } });
  const seen = es(t, 174.6, 175.3);
  maya(g, t, { face: { look: [-0.7 * seen, 0.85 * (1 - seen)], smile: 0.2, sad: -0.0 }, headOff: [0, 6 * (1 - seen)] });
  libTable(g); openBook(g, 1150, 694);
  const hx = lerp(60, 500, es(t, 171, 174.6));
  floorShadow(g, hx, 904, 90);
  const w = walker(g, hx, 904, 1.25, 1, hx / 34, { armLines: true, handR: [hx + 70, 640], face: { smile: 0.1, sad: 0.3 } }); light(g, w, 1.25, 1);
  book(g, hx + 78, 628, 92, 120, 0.1);
  caption(g, 'He brought her book *back*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s3.fin = 0.4;
// MEDIUM two-shot, the same framing as the first one: this time he looks her in the eyes.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(850, 880, u), y: lerp(590, 580, u), z: lerp(1.45, 1.55, u) });
  library(g, t);
  const k = es(t, 177, 178), sm = es(t, 179.2, 180.2);
  const m = maya(g, t, { face: { look: [-0.7, 0.05], smile: lerp(0.05, 0.9, sm), blink: (t > 178.6 && t < 178.74) ? 1 : 0 }, headOff: [0, 0], headTilt: -0.05 * sm });
  libTable(g); openBook(g, 1150, 694);
  book(g, lerp(590, 760, k), lerp(600, 684, k), lerp(92, 120, k), lerp(120, 22, k), 0.1 * (1 - k), k < 0.5);
  floorShadow(g, 520, 904, 90);
  const hero = Hero(g, { x: 520, y: 904, s: 1.25, view: 'side', dir: 1, handR: k < 1 ? [lerp(590, 740, k), lerp(640, 676, k)] : null, face: { look: [0, -0.05], smile: lerp(0.0, 0.8, sm), sad: 0.4 * (1 - sm), blink: (t > 180.6 && t < 180.74) ? 1 : 0 } }, 1, { dir: 1, amt: 0.2, dim: 0 });
  headText(g, 'sorry i vanished.', hero.head[0] + 20, hero.head[1] - 112, t, 177.2, 179.2);
  headText(g, 'you owe me coffee.', m.head[0] + 20, m.head[1] - 112, t, 179.4, 181.5);
  headText(g, 'now?', hero.head[0] + 20, hero.head[1] - 112, t, 181.6, 182.9);
  caption(g, 'This time, he looked *up*.', capA(t, a + 0.7, b - 0.1), ACC);
}
s4.fout = 0.6;
const s5 = (g, t, a, b) => blackLine(g, 'What you feed, *grows*.', seg(t, a + 0.6, a + 2.8), ACC, 1 - seg(t, b - 1.2, b - 0.2), 104);
s5.black = true;
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
