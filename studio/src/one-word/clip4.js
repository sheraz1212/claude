// CLIP 4 (1:36-2:08) - he peels the word off, finds his gloves, and lets the first one in.
(() => {
const T = [96, 101.5, 107, 112, 117.5, 123, 128];
sfx(97.6, 'paper-peel'); sfx(99.6, 'paper-crinkle'); sfx(101.9, 'pen-write', 0.8); sfx(104, 'pen-write', 0.8); sfx(107, 'locker-amb'); sfx(107.8, 'locker-clang', 0.7); sfx(109.6, 'cloth-rustle'); sfx(110.6, 'celesta-sparkle', 0.7);
sfx(112, 'crowd', 0.3); sfx(113.4, 'kick'); sfx(114.2, 'net'); sfx(114.6, 'demon-8bit-2', 0.6); sfx(115, 'whisper-useless', 0.7); sfx(115, 'count-tick'); sfx(118.6, 'kick'); sfx(119.4, 'ball-catch'); sfx(120.9, 'kick'); sfx(121.7, 'ball-catch'); sfx(123, 'car-hum'); sfx(123.8, 'pop-8bit-2'); sfx(125.4, 'pop-8bit-3');

// CLOSE (the tiny decision): the word was only stuck on. He peels it off.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), peel = es(t, 97.6, 99.2), drop = seg(t, 99.4, 100.6);
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 1400, 250, 800, WARM, 0.14);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  const cw = [960, 1300 - 292 * 2.4 + 72 * 2.4], hand = [lerp(cw[0] + 70, cw[0] + 330, peel), lerp(cw[1] + 6, cw[1] - 150, peel) + drop * 60];
  const r = actor(g, { x: 960, y: 1300, s: 2.4, handR: t > 96.8 ? [lerp(1200, hand[0], es(t, 96.8, 97.6)), lerp(1000, hand[1], es(t, 96.8, 97.6))] : null, bendR: 1, face: { look: [0.3 * peel, 0.7 - 0.5 * peel], sad: 0.8 * (1 - peel), smile: lerp(-0.4, 0.2, peel) } }, { dir: 1, amt: 0.2, dim: 0.06 });
  if (peel <= 0) chestWord(g, r, 2.4);
  else if (drop < 1) word(g, lerp(cw[0], hand[0] - 20, peel) + drop * 40, lerp(cw[1], hand[1] + 10, peel) + drop * drop * 500, 72 * (1 - drop * 0.4), -0.12 - peel * 0.5 - drop * 2, 1 - drop);
  counters(g, 515);
  caption(g, 'He peeled the word *off*.', capA(t, a + 0.6, b - 0.1), ACC);
}
function s2(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'It was their word.', seg(t, a + 0.4, a + 1.9), ACC, fo, 88, -70);
  blackLine(g, 'It was his *voice*.', seg(t, a + 2.5, a + 3.8), ACC, fo, 88, 70);
}
s2.black = true;
// WIDE (the locker room): the gloves are still there, under the dust. He puts them on (the token).
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), reach = kf(t, [[107.6, 0], [108.4, 1], [109.4, 1], [110.2, 0]]), on = t > 110.2;
  setCam(g, { x: lerp(1000, 1060, u), y: 540, z: lerp(1.05, 1.14, u) });
  lockers(g, t, { open: 7, warm: true });
  if (t < 109.4) glovePair(g, 1194, 640, 1, 'dust');
  if (t > 108.3 && t < 109.6) { const p = seg(t, 108.3, 109.6); g.fillStyle = `rgba(200,195,180,${0.35 * (1 - p)})`; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(1194 + (i - 3) * 22 * (1 + p), 620 - p * 80 - i * 6, 10 + p * 20, 0, 7); g.fill(); } }
  bench(g);
  floorShadow(g, 1050, 842, 90);
  const r = actor(g, { x: 1050, y: 842, s: HS, view: on ? 'front' : 'side', dir: 1, handR: reach > 0.02 ? [lerp(1100, 1180, reach), lerp(720, 648, reach)] : null, armL: on ? [0.5, 1.4] : null, armR: on ? [0.5, 1.4] : null, face: { smile: on ? 0.6 : 0.1, look: [0, on ? 0.6 : 0] } }, { dir: 1, amt: 0.2, dim: 0.03 });
  if (on || t >= 109.4) gloves(g, r, HS);
  counters(g, 515);
  caption(g, 'His gloves were still *there*.', capA(t, a + 0.6, b - 0.1), ACC);
}
const s4 = (g, t, a, b) => training(g, t, a, b, { shots: [[113.4, 0]], sad: 114.3, demon: 1.3, crack: 0.2, dT: 115, n: t => t < 115 ? 515 : 516, cap: 'The first shot went *in*.' });
const s5 = (g, t, a, b) => training(g, t, a, b, { shots: [[118.6, 1], [120.9, 1]], demon: 0.9, crack: 0.5, dT: 999, n: 516, cap: "The tenth one *didn't*." });
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(560, 550, u), z: lerp(1.02, 1.1, u) });
  car(g, t);
  const dad = person(g, { x: 1260, y: 800, hip: true, thigh: 20, s: 1.2, ...DAD, handL: [1180, 760], handR: [1340, 760], bendL: -1, bendR: 1, face: { look: [-0.6, 0], smile: lerp(0.3, 0.9, es(t, 125.6, 126.4)) } });
  const hero = actor(g, { x: 660, y: 800, hip: true, thigh: 20, s: HS, armR: [0.6, 1.5], face: { look: [0.7, 0], smile: 0.7 } }, { dir: 0, amt: 0.2, dim: 0.06 });
  gloves(g, hero, HS); dash(g);
  headText(g, 'good practice?', dad.head[0] - 40, dad.head[1] - 116, t, 123.8, 125.3);
  headText(g, 'i let ten in. saved one.', hero.head[0] + 60, hero.head[1] - 116, t, 125.4, 127.6);
  counters(g, 516);
  caption(g, 'That night, he *talked*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6]);
})();
