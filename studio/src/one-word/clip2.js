// CLIP 2 (0:32-1:04) - he repeats it: the bench, the classroom, the sign-up sheet, the stands.
(() => {
const T = [32, 36.5, 41, 45.5, 50, 54.5, 59.5, 64];
[[32, 1], [41, 2], [59.5, 0]].forEach(([a, i]) => { sfx(a, 'locker-amb'); sfx(a + 0.2, 'demon-8bit-' + (i + 1), 0.7); sfx(a + 0.7, 'whisper-useless'); sfx(a + 0.05, 'count-tick'); });
sfx(36.5, 'class-amb'); sfx(38.5, 'whisper-useless', 0.7); sfx(45.6, 'pen-write', 0.5); sfx(47.6, 'whisper-useless', 0.7); sfx(50, 'crowd'); sfx(51.5, 'crowd-groan'); sfx(54.5, 'car-hum'); sfx(55.4, 'pop-8bit-2'); sfx(56.4, 'whisper-useless', 0.7); sfx(60.5, 'low-thud', 0.7);

const pass = (t, a, v = 200) => () => { for (const [x0, o] of [[-200, { col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }], [-520, { ...LEO }]]) { const x = x0 + (t - a) * v; walker(g2, x, 842, 1.0, 1, x / 30, o); } };
let g2;
const r1 = (g, t, a, b) => { g2 = g; benchRep(g, t, a, b, { n: said(t, [[32, 5], [36.5, 14]]), k: 1.0, text: 'useless.', cap: 'Before every practice, he *froze*.', others: pass(t, a, 420) }); };
// WIDE, one-off place (the classroom): everyone's hand goes up. His stops halfway.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 960, u), y: lerp(580, 600, u), z: lerp(1.05, 1.16, u) });
  classroom(g, t, (x, y, s) => {
    const up = kf(t, [[37, 0.15], [37.8, 1.5], [38.6, 1.5], [39.4, 0.15]]);
    const r = actor(g, { x, y, hip: true, thigh: 20, s, armR: [up, 0.3], headOff: [0, 10 * es(t, 38.6, 39.4)], face: { look: [0, 0.6 * es(t, 38.6, 39.4)], sad: 0.7, smile: -0.3 } }, { dir: 0, amt: 0.15, dim: 0.06 });
    chestWord(g, r, s); demonText(g, 'useless.', x + 210, y - 330, t, Math.min(seg(t, 38.5, 38.8), 1 - seg(t, 40.2, 40.6)), 56);
  });
  counters(g, said(t, [[36.5, 30], [41, 44]]));
  caption(g, 'He stopped raising his *hand*.', capA(t, a + 0.5, b - 0.1), ACC);
}
const r3 = (g, t, a, b) => { g2 = g; benchRep(g, t, a, b, { n: said(t, [[41, 80], [45.5, 96]]), k: 1.35, text: 'useless.', cap: 'The word got *louder*.', others: pass(t, a, 420) }); };
function s4(g, t, a, b) {
  const near = kf(t, [[45.5, 0], [46.6, 1], [48.2, 1], [49.4, 0]]), sh = near > 0.95 ? Math.sin(t * 30) * 5 : 0;
  sheet(g, t, a, b, { sign: 0, hx: lerp(1500, 800, near) + sh, hy: lerp(900, 700, near) + sh });
  demonText(g, 'useless.', 1500, 330, t, Math.min(seg(t, 47.6, 47.9), 1 - seg(t, 49.3, 49.7)), 84);
  counters(g, said(t, [[45.5, 140], [50, 156]]));
  caption(g, "He didn't sign *up*.", capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE, one-off place (the stands): his team loses without him.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 1000, u), y: 560, z: lerp(1.02, 1.1, u) });
  g.fillStyle = '#131219'; g.fillRect(-300, -300, 2600, 1700); glow(g, 300, 0, 900, COLD, 0.2);
  rr(g, 1360, 110, 440, 150, 14); g.fillStyle = '#0a0a0e'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke(); g.fillStyle = '#ffd9a0'; g.font = '700 38px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('HOME   AWAY', 1580, 156); g.font = '800 62px Nunito'; g.fillText('0  :  3', 1580, 214);
  const rows = [[520, 0.85, [260, 520, 1100, 1700]], [800, 1.15, [380, 960, 1560]]];
  rows.forEach(([top, s, xs], ri) => {
    xs.forEach((x, i) => {
      if (ri === 1 && i === 1) { const r = actor(g, { x, y: top + 40, hip: true, thigh: 24, s, headOff: [0, 14], face: { look: [0, 0.9], sad: 1, smile: -0.5, blink: 0.3 } }, { dir: -1, amt: 0.2, dim: 0.08 }); chestWord(g, r, s); glovePair(g, x, top + 30, 1.1); return; }
      const o = [{ col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }, { col: '#a3927e', acc: 'longhair' }, { col: '#9a9aa8', acc: 'glasses' }, { col: '#b0a08c', acc: 'scarf' }][(ri * 2 + i) % 4];
      person(g, { x, y: top + 40, hip: true, thigh: 24, s, ...o, armL: t > 51.5 ? [2.5, 1.0] : null, armR: t > 51.5 ? [2.5, 1.0] : null, face: { sad: t > 51.5 ? 0.8 : 0, smile: t > 51.5 ? -0.4 : 0.3, look: [-0.3, 0.3] }, armLines: false });
    });
    g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(-300, top + 50, 2600, 22); g.strokeRect(-300, top + 50, 2600, 22);
  });
  counters(g, said(t, [[50, 190], [54.5, 205]]));
  caption(g, 'His team lost without *him*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(560, 550, u), z: lerp(1.02, 1.1, u) });
  car(g, t);
  const d = demon(g, { x: 960, y: 1060, s: 1.5, face: { look: [-0.5, 0.3] } }, { t, a: 0.85 }); demonText(g, 'useless.', 960, 300, t, Math.min(seg(t, 56.4, 56.7), 1 - seg(t, 58.6, 59)), 64);
  const dad = person(g, { x: 1260, y: 800, hip: true, thigh: 20, s: 1.2, ...DAD, handL: [1180, 760], handR: [1340, 760], bendL: -1, bendR: 1, face: { look: [-0.6, 0], sad: 0.4, smile: 0 } });
  const hero = actor(g, { x: 660, y: 800, hip: true, thigh: 20, s: HS, headOff: [-10, 10], headTilt: -0.1, face: { look: [-0.8, 0.3], sad: 0.9, smile: -0.4 } }, { dir: 0, amt: 0.2, dim: 0.12 });
  chestWord(g, hero, HS); dash(g);
  headText(g, 'you love that game.', dad.head[0] - 60, dad.head[1] - 116, t, 55.4, 57.6);
  counters(g, said(t, [[54.5, 232], [59.5, 248]]));
  caption(g, "His dad didn't *understand*.", capA(t, a + 0.5, b - 0.1), ACC);
}
const r7 = (g, t, a, b) => { g2 = g; benchRep(g, t, a, b, { n: said(t, [[59.5, 296], [64, 318]]), k: 1.9, dx: 1420, dy: 910, tx: -330, ty: 40, text: 'useless.', cap: 'He said it more than *anyone*.', lampA: 0.6 }); };
defineClip(32, T, [r1, s2, r3, s4, s5, s6, r7]);
})();
