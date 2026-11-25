// CLIP 1 (0:00-0:32) - Eli copies everything. A friend offers something. It stays hidden.
(() => {
const T = [0, 4.5, 11, 16.5, 22, 27, 32];
sfx(0.5, 'pen-write'); sfx(4.6, 'morning-amb', 0.6); sfx(5, 'skate-roll'); sfx(8.2, 'pop-8bit-1'); sfx(9.8, 'pop-8bit-2'); sfx(11, 'night-amb'); sfx(11.6, 'pop-8bit-3'); sfx(14, 'demon-8bit-1'); sfx(14.4, 'whisper-justone');
sfx(18.2, 'inhale'); sfx(19.2, 'puff'); sfx(22, 'night-amb'); sfx(24.5, 'puff', 0.6); sfx(27.8, 'pop-8bit-1'); sfx(29.8, 'pop-8bit-2');

const s1 = card('Just to take the *edge* off.', 0.5, 2.8);
// WIDE (the place, mirrored at the end): the driveway. He skates, Eli copies his every move.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 960, u), y: 560, z: lerp(1, 1.07, u) });
  driveway(g, t);
  person(g, { x: 150, y: 840, s: 0.95, col: '#8d8d9b', acc: 'glasses', handR: [176, 660], bendR: 1, face: { look: [0.2, 0.8] }, armLines: false });
  const hx = lerp(240, 800, es(t, 5, 8.2)), moving = t < 8.2;
  const eli = person(g, { x: 1060, y: 838, s: 0.8, view: 'side', dir: -1, ...ELI, legL: [0.32, -0.3], legR: [-0.3, -0.05], armL: [0.9 + Math.sin(t * 2) * 0.1, 0.3], armR: [-0.8 - Math.sin(t * 2) * 0.1, -0.3], face: { smile: 0.9 } });
  floorShadow(g, hx, 842, 90);
  const hero = moving ? rider(g, hx, 838, HS, 1, t, { face: { smile: 0.6 } }) : (board(g, hx + 90, 822, HS), actor(g, { x: hx, y: 838, s: HS, view: 'side', dir: 1, face: { smile: 0.4, look: [0, 0.2] } }, { dir: -1, amt: 0.25, dim: 0.04 }));
  headText(g, 'teach me?', eli.head[0], eli.head[1] - 90, t, 8.2, 9.7);
  headText(g, 'later, Eli.', hero.head[0], hero.head[1] - 110, t, 9.8, 10.95);
  caption(g, 'His little brother copied *everything*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s2.fin = 0.5;
// WIDE, one-off place (the skate park at night): a friend holds out a small green glow.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 960, u), y: 560, z: lerp(1.05, 1.14, u) });
  skatepark(g, t);
  const rx = 1900 - (t - a) * 90; rider(g, rx, 828, 0.8, -1, t, { col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52', armLines: false });
  person(g, { x: 700, y: 752, hip: true, thigh: 26, s: 0.95, col: '#a3927e', acc: 'longhair', face: { look: [0.6, 0], smile: 0.5 }, armLines: false });
  person(g, { x: 500, y: 830, s: 1.0, col: '#8d8d9b', acc: 'glasses', face: { look: [0.6, 0.1], smile: 0.4 }, armLines: false });
  const reach = es(t, 15.3, 16.1), dA = es(t, 14, 14.5);
  if (dA > 0) { const d = demon(g, { x: 1260, y: 832, s: 0.96, face: { look: [-0.7, 0.1] } }, { t, a: dA }); demonText(g, 'just one.', d.head[0] + 150, d.head[1] - 60, t, Math.min(seg(t, 14.4, 14.7), 1 - seg(t, 16.1, 16.45)), 66); }
  const ray = person(g, { x: 860, y: 830, s: 1.1, view: 'side', dir: 1, ...RAY, handR: [948, 640], face: { smile: 0.6 } });
  mintGlow(g, 950, 636, 0.9);
  floorShadow(g, 1050, 832, 90);
  const hero = actor(g, { x: 1050, y: 830, s: HS, view: 'side', dir: -1, handR: reach > 0.02 ? [lerp(1010, 968, reach), lerp(700, 644, reach)] : null, face: { look: [0, 0.4], sad: 0.3 * (1 - reach), smile: 0 } }, { dir: 1, amt: 0.3, dim: 0.05 });
  headText(g, 'takes the edge off.', ray.head[0] - 30, ray.head[1] - 110, t, 11.6, 13.9);
  caption(g, 'A friend offered him *something*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// CLOSE-UP (the first one): only the glow in his closed hand, and the first mint cloud.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 1500, 260, 700, WARM, 0.14);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  const up = kf(t, [[17, 0], [17.9, 1], [19, 1], [19.8, 0]]), ex = es(t, 19.2, 21.6);
  cloud(g, 1180, 380 - ex * 60, 260 * ex, t, 1, 9);
  const r = actor(g, { x: 880, y: 1490, s: 3, handR: [lerp(1150, 1000, up), lerp(1000, 640, up)], bendR: 1, face: { look: [0.2, 0.3], blink: up > 0.9 && t < 19.1 ? 0.9 : (t > 19.2 ? 0.45 : 0), smile: lerp(0, 0.5, ex), sad: 0.2 * (1 - ex) } }, { dir: 1, amt: 0.4, dim: 0.1 });
  mintGlow(g, r.handR[0], r.handR[1], 1.6 + 0.6 * Math.sin(t * 6) * (up > 0.9 ? 1 : 0)); glow(g, r.head[0] + 60, r.head[1] + 90, 150, MINT, 0.25 * up);
  caption(g, 'It tasted like *mint*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// THE REPEATED SHOT, first time: the alley behind the garage.
const s5 = (g, t, a, b) => alleyRep(g, t, a, b, { n: 2, r: 56, k: 0.8, text: 'nobody sees.', cap: 'He kept it *hidden*.' });
// MEDIUM (their room): Eli asks again.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(680, 700, u), y: 560, z: lerp(1.3, 1.38, u) });
  bedroom(g, t); bunk(g);
  const eli = person(g, { x: 430, y: 402, hip: true, thigh: 30, s: 0.8, ...ELI, legL: [0.06 + Math.sin(t * 3) * 0.12, 0], legR: [0.06 - Math.sin(t * 3) * 0.12, 0], headOff: [6, 8], face: { look: [0.5, 0.8], smile: 0.6 } });
  cloud(g, 600, 480, 46, t, 1, 4);
  const hero = actor(g, { x: 600, y: 652, hip: true, thigh: 34, s: HS, headOff: [0, 10], face: { look: [0, 0.8], smile: -0.1, sad: 0.3, blink: 0.25 } }, { dir: 1, amt: 0.3, dim: 0.08 });
  headText(g, 'teach me tomorrow?', eli.head[0] + 40, eli.head[1] - 86, t, 27.8, 29.7);
  headText(g, 'soon.', hero.head[0] + 190, hero.head[1] - 40, t, 29.8, 31.2);
  caption(g, 'And Eli kept *waiting*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
