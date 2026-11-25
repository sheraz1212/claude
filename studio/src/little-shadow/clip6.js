// CLIP 6 (2:40-3:10) - clear air, and the mirrored driveway.
(() => {
const T = [160, 166, 172, 178, 183.5, 190];
sfx(160.4, 'cup-clink'); sfx(162, 'cup-clink', 0.7); sfx(166, 'night-amb', 0.7); sfx(166.2, 'skate-roll', 0.6); sfx(172, 'morning-amb'); sfx(172.4, 'skate-roll'); sfx(179, 'pop-8bit-1'); sfx(180.4, 'ball-catch', 0.7); sfx(181.2, 'pop-8bit-3'); sfx(183.6, 'pen-write', 0.9);

// MEDIUM (the kitchen, changed): nobody coughs.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), lf = Math.sin(t * 9) * 0.03 * es(t, 162, 162.6) * (1 - es(t, 164, 165));
  setCam(g, { x: 970, y: lerp(580, 570, u), z: lerp(1.3, 1.38, u) });
  kitchen(g, t);
  person(g, { x: 760, y: 744 + lf * 60, hip: true, thigh: 20, s: 0.8, ...ELI, headTilt: lf * 2, face: { look: [0.7, 0], smile: 0.95 } });
  person(g, { x: 960, y: 740, hip: true, thigh: 20, s: 1.1, ...MOM, face: { look: [0.6 * Math.sin(t * 0.8), 0.1], smile: 0.8, blink: (t % 3.3 < 0.14) ? 1 : 0 } });
  const hero = actor(g, { x: 1180, y: 740 - lf * 60, hip: true, thigh: 20, s: HS, headTilt: -lf * 2, face: { look: [-0.7, 0], smile: 0.9 } }, { dir: -1, amt: 0.15, dim: 0 });
  sticker(g, hero, HS);
  kitchenTable(g);
  for (const x of [760, 960, 1180]) for (let k = 0; k < 2; k++) { g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 8 + k * 16, 672); g.quadraticCurveTo(x - 16 + k * 16 + Math.sin(t * 2 + k + x) * 6, 652, x - 8 + k * 16, 632); g.stroke(); }
  hud(g, 'DAYS WITHOUT', 44);
  caption(g, 'Nobody *coughed* at dinner.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// THE REPEATED SHOT, reversed: the alley is just an alley now. Warm lamp, clear air.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  alley(g, t, { warm: true });
  const ex = lerp(380, 1250, seg(t, a, b));
  const eli = rider(g, ex, 798, 0.8, 1, t, { ...ELI, armL: [1.2, 0.2], face: { smile: 0.9 } });
  floorShadow(g, ex + 150, 800, 90);
  const hero = walker(g, ex + 150, 800, HS, 1, ex / 30, { armLines: true, handL: [eli.handL[0] + 4, eli.handL[1]], face: { smile: 0.7 } }); sticker(g, hero, HS);
  hud(g, 'DAYS WITHOUT', 44);
  caption(g, 'The alley was just an *alley*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// WIDE - THE MIRROR OF THE FIRST SCENE: same driveway, same shot. Eli still copies everything.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 960, u), y: 560, z: lerp(1, 1.07, u) });
  driveway(g, t, { dawn: true });
  person(g, { x: 150, y: 840, s: 0.95, col: '#8d8d9b', acc: 'glasses', armR: [2.6, 0.3 + Math.sin(t * 7) * 0.12], face: { look: [0.5, 0], smile: 0.7 }, armLines: false });
  const hx = lerp(420, 1000, es(t, 172.4, 177));
  rider(g, hx - 250, 838, 0.8, 1, t, { ...ELI, face: { smile: 0.95 } });
  floorShadow(g, hx, 842, 90);
  const hero = rider(g, hx, 838, HS, 1, t, { face: { smile: 0.8 } }); sticker(g, hero, HS);
  caption(g, 'His little brother still copied *everything*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s3.fin = 0.4;
// MEDIUM (the last line answers the twist): "like you!" - "like me."
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), bump = kf(t, [[179.8, 0], [180.4, 1], [181, 1], [181.8, 0]]);
  setCam(g, { x: 1000, y: lerp(620, 610, u), z: lerp(1.55, 1.65, u) });
  driveway(g, t, { dawn: true });
  board(g, 760, 824, HS, 0.02); board(g, 1190, 826, 0.8, -0.02);
  const eli = person(g, { x: 1090, y: 838, s: 0.8, view: 'side', dir: -1, ...ELI, handR: bump > 0.02 ? [lerp(1060, 990, bump), lerp(760, 700, bump)] : null, face: { smile: 0.95, look: [0, -0.3] } });
  floorShadow(g, 880, 842, 90);
  const hero = actor(g, { x: 880, y: 838, s: HS, view: 'side', dir: 1, handR: bump > 0.02 ? [lerp(920, 974, bump), lerp(720, 700, bump)] : null, face: { smile: 0.9, look: [0, 0.4], blink: (t > 182 && t < 182.14) ? 1 : 0 } }, { dir: -1, amt: 0.15, dim: 0 });
  sticker(g, hero, HS);
  headText(g, 'like you!', eli.head[0] + 30, eli.head[1] - 92, t, 179, 181);
  headText(g, 'like me.', hero.head[0] - 20, hero.head[1] - 112, t, 181.2, 183.1);
  caption(g, 'This time, he was *glad*.', capA(t, a + 0.7, b - 0.1), ACC);
}
s4.fout = 0.6;
const s5 = (g, t, a, b) => blackLine(g, 'Someone is *copying* you.', seg(t, a + 0.6, a + 2.8), ACC, 1 - seg(t, b - 1.2, b - 0.2), 104);
s5.black = true;
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
