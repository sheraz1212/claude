// CLIP 3 (1:09-1:39) - the turn: his dad alone on the porch, two cups of tea. "I knew the year was wrong."
// "I just wanted you to sit with me." He sits down. The first wall falls.
(() => {
const T = [69, 75, 81, 87, 93, 99];
sfx(69.0, 'porch-amb'); sfx(69.4, 'crickets', 0.7); sfx(72.6, 'door-open', 0.5);
sfx(75.0, 'porch-amb'); sfx(75.4, 'steps-small', 0.6); sfx(76.6, 'pop-8bit-1');
sfx(81.0, 'porch-amb'); sfx(81.8, 'pop-8bit-2');
sfx(87.0, 'porch-amb'); sfx(87.6, 'sniffle', 0.7); sfx(89.4, 'chair-creak', 0.8); sfx(90.6, 'cup-clink', 0.6);
sfx(93.0, 'porch-amb'); sfx(93.6, 'crickets', 0.6); sfx(95.0, 'brick-fall'); sfx(95.2, 'low-thud', 0.5); sfx(95.6, 'celesta-sparkle', 0.5);

const DX = 1450, EX = 1700, TX = 1575;
function porchShot(g, t, o = {}) {
  porch(g, t);
  if (o.wall !== undefined) { brickWall(g, 760, PO_F, 260, 520, 1, o.wall, 31); dust(g, 760, PO_F, t, 95.0, 260); }
  porchChair(g, DX); porchChair(g, EX);
  const dd = Hero(g, { x: DX, y: 760, hip: true, thigh: 20, s: 1.05, ...DADW, ...(o.sip ? { handR: [DX + 40, 600] } : pose('hold', DX, 760, 1.05, { hip: true })), face: { look: o.dLook || [0.6, 0.1], smile: o.dSmile ?? 0.2, sad: o.dSad ?? 0.4, blink: blink(t, 1.4) } }, { dir: 1, amt: 0.3 });
  porchChair(g, DX, true);
  let hr = null;
  if (o.hSit) { hr = Hero(g, { x: EX, y: 760, hip: true, thigh: 20, s: 1.05, ...(o.hSip ? { handL: [EX - 40, 600] } : pose('hold', EX, 760, 1.05, { hip: true })), face: { look: o.hLook || [-0.6, 0.1], smile: o.hSmile ?? 0.3, sad: o.hSad ?? 0.2, blink: blink(t, 0.4) } }, { dir: -1, amt: 0.3 }); }
  porchChair(g, EX, true);
  porchTable(g, TX, 2, 1, t);
  if (!o.hSit && o.hx !== undefined) { hr = o.walk ? walker(g, o.hx, PO_F, 1.05, 1, t * 5, { face: { sad: 0.4 } }) : Hero(g, { x: o.hx, y: PO_F, s: 1.05, view: o.side ? 'side' : undefined, dir: 1, face: { look: o.hLook || [0.8, 0], sad: o.hSad ?? 0.5, smile: o.hSmile ?? 0, blink: blink(t, 0.4) } }, { dir: -1, amt: 0.3 }); floorShadow(g, o.hx, PO_F + 2, 90); }
  return { dd, hr };
}
// WIDE (the porch at dusk): his dad alone, two cups, an empty chair. He watches from the doorway.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1060, u), y: 540, z: lerp(1.0, 1.06, u) });
  porchShot(g, t, { hx: 230, side: true, hLook: [0.9, 0.1], hSad: 0.6 });
  winsHud(g, 47);
  caption(g, 'His dad sat outside. *Alone*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.6;
// MEDIUM: he steps out. His dad, not looking at him: "I knew the year was wrong."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 75.2, 77.2);
  setCam(g, { x: lerp(1420, 1440, u), y: 560, z: lerp(1.45, 1.52, u) });
  const { dd } = porchShot(g, t, { hx: lerp(1000, 1260, go), walk: go > 0 && go < 1, hSad: 0.6, dLook: [0.7, 0.2], dSad: 0.6 });
  headText(g, 'I knew the year was wrong.', dd.head[0] + 30, dd.head[1] - 110, t, 76.6, 80.8);
  winsHud(g, 47);
}
// CLOSE (dad): "I just wanted you to sit with me."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1460, 1465, u), y: 580, z: lerp(2.1, 2.2, u) });
  const { dd } = porchShot(g, t, { hx: 1260, dLook: [-0.4, 0], dSmile: 0.35, dSad: 0.5 });
  headText(g, 'I just wanted you to sit with me.', dd.head[0] + 20, dd.head[1] - 100, t, 81.8, 86.6);
  winsHud(g, 47);
}
// CLOSE (him): his eyes fill. He sits down next to his dad.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), sit = t > 89.4;
  setCam(g, { x: lerp(sit ? 1660 : 1300, sit ? 1650 : 1290, u), y: 560, z: lerp(2.0, 2.1, u) });
  const { hr } = porchShot(g, t, sit ? { hSit: true, hSad: 0.7, hSmile: 0.2, hLook: [-0.7, 0.2] } : { hx: 1260, hSad: 0.9, hLook: [0.4, 0.3] });
  if (hr) for (const [off, sp] of [[0, 1.6], [0.8, 1.9]]) { const k = ((t - a + off) / sp) % 1; g.fillStyle = `rgba(150,200,255,${0.85 * (1 - k)})`; g.beginPath(); g.ellipse(hr.head[0] + (sit ? -20 : 22), hr.head[1] + 8 + k * 46, 4, 6, 0, 0, 7); g.fill(); }
  winsHud(g, 47);
  caption(g, 'He finally *sat* down.', capA(t, 89.6, b - 0.1), ACC);
}
// WIDE: father and son, tea, the sunset. Behind them, the first wall crumbles.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), fall = es(t, 95.0, 96.6);
  setCam(g, { x: lerp(1150, 1200, u), y: 540, z: lerp(1.0, 1.06, u) });
  porchShot(g, t, { hSit: true, sip: t > 94 && t < 95.4, hSip: t > 96.4 && t < 97.8, dSmile: 0.6, dSad: 0, dLook: [0.6, 0], hSmile: 0.6, hSad: 0, wall: fall });
  if (t < 95) winsHud(g, 47, 1 - seg(t, 94.4, 95)); else wallsHud(g, 47 - Math.floor(seg(t, 95, 96) * 1));
  caption(g, 'The first wall *fell*.', capA(t, 96.0, b - 0.1), ACC);
}
s5.fin = 0.3;
defineClip(69, T, [s1, s2, s3, s4, s5]);
})();
