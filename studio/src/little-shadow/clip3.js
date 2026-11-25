// CLIP 3 (1:04-1:36) - the twist comes through Eli: "like you!"
(() => {
const T = [64, 69.5, 75, 80.5, 86.5, 91.5, 96];
sfx(64, 'night-amb'); sfx(65, 'pop-8bit-1'); sfx(64.6, 'cloth-rustle'); sfx(66.4, 'cloth-rustle'); sfx(69.5, 'night-amb'); sfx(72.2, 'piano-low-hit', 0.7); sfx(75.6, 'cough', 0.7); sfx(76.4, 'cough', 0.6); sfx(77.4, 'pop-8bit-3');
sfx(80.6, 'low-thud'); sfx(82.4, 'demon-8bit-2', 0.6); sfx(82.8, 'whisper-likeyou'); sfx(84, 'piano-tear-note'); sfx(86.6, 'demon-brass'); sfx(88.2, 'whisper-justone', 0.8); sfx(91.9, 'pen-write', 0.8); sfx(93.6, 'pen-write', 0.8);

// WIDE (their room): the top bunk is empty, and the thing in his pocket is gone.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 980, u), y: 550, z: lerp(1.05, 1.12, u) });
  bedroom(g, t); bunk(g);
  const p = Math.floor((t - a) * 1.1) % 2;
  cloud(g, 1130, 180, 110, t, 1, 4);
  floorShadow(g, 1100, 800, 90);
  const hero = actor(g, { x: 1100, y: 800, s: HS, handL: p ? [1060, 560] : [1050, 650], handR: p ? [1150, 650] : [1140, 560], bendL: -1, bendR: 1, face: { look: [p ? -0.6 : 0.6, 0.4], sad: 0.6, smile: -0.3, wide: 1.15 } }, { dir: 1, amt: 0.3, dim: 0.08 });
  eyeBags(g, hero, HS, 0.8);
  headText(g, 'where is it?', hero.head[0] + 20, hero.head[1] - 112, t, 65, 67.4);
  caption(g, 'One night, it was *gone*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function eliAlley(g, t, o = {}) {
  cloud(g, 1130, 560, 26, t, 1, 3);
  const e = person(g, { x: 1100, y: 796, s: 0.8, ...ELI, view: o.side ? 'side' : 'front', dir: 1, handR: o.side ? [1126, 640] : [1146, 690], bendR: 1, headOff: [0, o.cough || 0], face: { smile: o.smile ?? 0.2, look: o.look || [0, 0.2], blink: o.cough ? 1 : 0, sad: o.cough ? 0.5 : 0 } });
  mintGlow(g, e.handR[0], e.handR[1], 0.6); return e;
}
// WIDE (the alley): a very small figure by the bins, with the same green glow.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 960, u), y: 545, z: lerp(1, 1.08, u) });
  alley(g, t);
  eliAlley(g, t, { side: true });
  const hx = lerp(120, 600, es(t, 69.5, 72.2));
  floorShadow(g, hx, 800, 90);
  if (t < 72.2) walker(g, hx, 800, HS, 1, hx / 34, { armLines: true }); else actor(g, { x: hx, y: 800, s: HS, view: 'side', dir: 1, face: { wide: 1.3, sad: 0.5, smile: -0.3 } }, { dir: 1, amt: 0.3, dim: 0.08 });
  caption(g, 'He knew that *glow*.', capA(t, 72.3, b - 0.1), ACC);
}
// MEDIUM (the twist): Eli coughs, then smiles up at him.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(610, 600, u), z: lerp(1.6, 1.7, u) });
  alley(g, t);
  const c = (t > 75.6 && t < 76.0) || (t > 76.4 && t < 76.8) ? 6 + Math.sin(t * 40) * 3 : 0, proud = es(t, 77, 77.6);
  const e = eliAlley(g, t, { cough: c, smile: lerp(0, 0.95, proud), look: [-0.7 * proud, -0.3 * proud] });
  coughPuffs(g, e.head[0] - 20, e.head[1] + 24, t, 75.6, -1); coughPuffs(g, e.head[0] - 20, e.head[1] + 24, t, 76.4, -1);
  floorShadow(g, 780, 800, 90);
  actor(g, { x: 780, y: 800, s: HS, view: 'side', dir: 1, headOff: [0, 4], face: { wide: 1.3, sad: 0.9, smile: -0.5, look: [0, 0.5] } }, { dir: 1, amt: 0.3, dim: 0.08 });
  headText(g, 'like you!', e.head[0] + 30, e.head[1] - 92, t, 77.4, 79.8);
  caption(g, 'Eli was copying him *again*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// CLOSE-UP (it lands): his own cloud behind him, and the voice enjoying it.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 960, 200, 800, COLD, 0.12);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.08, u) });
  cloud(g, 900, 330, 430, t, 0.9, 6);
  const d = demon(g, { x: 1540, y: 1640, s: 3.3, lean: -0.1, face: { look: [-0.8, 0.3], smile: 0.9 } }, { t, a: es(t, 82.2, 83) * 0.9, glow: 28 });
  demonText(g, "he's just like you.", 1480, 240, t, Math.min(seg(t, 82.8, 83.1), 1 - seg(t, 85.8, 86.2)), 76);
  const r = actor(g, { x: 860, y: 1490, s: 3, headOff: [0, es(t, 83.5, 85.5) * 8], face: { wide: lerp(1.3, 1, es(t, 82, 84)), sad: 1.2, smile: -0.7, look: [0, 0.5], blink: (t > 83.2 && t < 83.35) ? 1 : 0.1 } }, { dir: 0, amt: 0.2, dim: 0.1 });
  tear(g, r, 3, seg(t, 83.6, 86.3));
  caption(g, 'It was never only *his* cloud.', capA(t, a + 0.8, b - 0.1), ACC);
}
// IMAGERY (the low point): now Eli has a small voice of his own.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#050508'; g.fillRect(0, 0, W, H); setCam(g, { x: lerp(960, 1000, u), y: 540, z: lerp(1, 1.08, u) });
  pool(g, 960, 880, 900, COLD, 0.14);
  demon(g, { x: 1560, y: 900, s: 2.2, lean: -0.08, handL: [1280, 560], bendL: -1, face: { look: [-0.7, 0.3], smile: 0.9 } }, { t });
  const sm = es(t, 87.4, 88.4);
  const ld = demon(g, { x: 1230, y: 882, s: 0.7 * sm + 0.01, face: { look: [-0.6, 0.2] } }, { t, a: sm });
  demonText(g, 'just one.', ld.head[0] + 10, ld.head[1] - 70, t, Math.min(seg(t, 88.2, 88.5), 1 - seg(t, 90.7, 91.1)), 46);
  cloud(g, 1090, 600, 40, t, 1, 3);
  const e = person(g, { x: 1060, y: 880, s: 0.8, ...ELI, handR: [1104, 780], bendR: 1, face: { smile: 0.5, look: [-0.5, 0] } }); mintGlow(g, e.handR[0], e.handR[1], 0.6);
  floorShadow(g, 520, 882, 90);
  actor(g, { x: 520, y: 760, hip: true, thigh: 20, s: HS, view: 'side', dir: 1, legL: [1.45, -2.6], legR: [1.4, -2.6], handR: [640, 650], headOff: [0, 6], face: { sad: 1.2, smile: -0.7, wide: 1.1 } }, { dir: 1, amt: 0.3, dim: 0.1 });
  caption(g, 'Now Eli had a voice *too*.', capA(t, a + 1.6, b - 0.1), ACC);
}
s5.fin = 0.4; s5.fout = 0.4;
function s6(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'Eli was nine.', seg(t, a + 0.4, a + 1.7), ACC, fo, 92, -72);
  blackLine(g, 'He learned it from his *hero*.', seg(t, a + 2.1, a + 3.6), ACC, fo, 92, 64);
}
s6.black = true;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
