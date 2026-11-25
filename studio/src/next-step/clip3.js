// CLIP 3 (1:05-1:37) - the fear: "what if I fail?" (the cloud drips red ink: YOU WILL FAIL). He walks the living
// room, lost. His big sister Ayesha sees it all.
(() => {
const T = [65, 70, 78, 82, 88.5, 93.5, 97.5];
sfx(65.0, 'room-quiet'); sfx(65.6, 'kids-play', 0.25); sfx(66.8, 'steps-small', 0.6); sfx(68.6, 'chair-creak', 0.7);
sfx(70.0, 'room-quiet'); sfx(70.6, 'cloud-rumble'); sfx(72.4, 'drip'); sfx(72.9, 'drip', 0.8); sfx(73.0, 'whisper-fail', 0.9); sfx(73.6, 'drip', 0.9); sfx(74.3, 'drip', 0.7); sfx(75.2, 'drip', 0.8); sfx(76.0, 'heartbeat', 0.8);
sfx(78.0, 'ink-bleed'); sfx(78.3, 'low-thud', 0.9); sfx(79.6, 'drip', 0.7); sfx(80.8, 'drip', 0.6);
sfx(82.0, 'living-amb'); sfx(82.4, 'steps-small', 0.5); sfx(84.6, 'steps-small', 0.5); sfx(86.6, 'steps-small', 0.45);
sfx(88.5, 'living-amb'); sfx(90.4, 'laptop-close', 0.8); sfx(91.6, 'cloth-rustle', 0.6);
sfx(93.5, 'room-quiet'); sfx(94.6, 'door-open', 0.8);

// MEDIUM: he turns from the window - the desk waits
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 66.6, 68.6);
  setCam(g, { x: lerp(780, 820, u), y: 545, z: lerp(1.25, 1.32, u) });
  deskRoom(g, t, { clock: 21.45 });
  const hx = lerp(560, 1100, go), sit = t > 68.6;
  if (sit) Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...SITP(), headOff: [0, 8], face: { look: [0, 0.9], sad: 0.7, smile: -0.2, blink: blink(t, 0.4) } }, { dir: 1 });
  else { const r = go > 0 ? walker(g, hx, DK_F, 1.05, 1, t * 5, { face: { sad: 0.7 } }) : Hero(g, { x: hx, y: DK_F, s: 1.05, view: 'side', dir: 1, face: { look: [0.9, 0.2], sad: 0.6 } }, { dir: 1 }); floorShadow(g, hx, DK_F + 2, 90); }
  deskFront(g, t, { pile: 14 });
  examHud(g);
  caption(g, 'But the exam was *waiting*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.3;
// MEDIUM (the fear): a dark cloud gathers over him and drips red ink onto the book - "you will fail"
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), ca = es(t, 70.5, 72.0);
  setCam(g, { x: lerp(1100, 1100, u), y: lerp(520, 505, u), z: lerp(1.55, 1.68, u) });
  deskRoom(g, t, { clock: 21.5 });
  noCam(g); g.fillStyle = `rgba(0,0,0,${0.35 * ca})`; g.fillRect(0, 0, W, H); setCam(g, { x: 1100, y: lerp(520, 505, u), z: lerp(1.55, 1.68, u) });
  const shrink = es(t, 73.0, 74.5);
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...SITP(), headOff: [0, 8 + shrink * 10], face: { look: [0, 0.9], sad: 0.9 + shrink * 0.1, wide: t > 73 ? 1.25 : 1, smile: -0.3, blink: blink(t, 0.4) } }, { dir: 1, dim: 0.05 + 0.15 * ca });
  deskFront(g, t, { pile: 14 });
  glow(g, 1100, 400, 260, '255,40,30', 0.12 * ca);
  fearCloud(g, 1100, 410 + (1 - ca) * -40, 0.5 + 0.1 * ca, t, ca);
  drops(g, 1050, 1150, 440, 680, t, 72.4, ca);
  examHud(g);
  caption(g, 'What if his marks were *low*?', capA(t, a + 0.6, b - 0.1), ACC);
}
// INSERT (top-down page): YOU WILL FAIL bleeds into the notes
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.05, 1.14, u) });
  g.fillStyle = '#0e0c10'; g.fillRect(-400, -400, 2800, 1900); glow(g, 960, 540, 700, '255,40,30', 0.08);
  g.save(); g.translate(960, 560); g.rotate(-0.04); box(g, -560, -330, 1120, 660, '#e9e2cf', 8); ln(g, [0, -330, 0, 330], 3);
  g.strokeStyle = 'rgba(60,60,80,0.35)'; g.lineWidth = 3; for (let k = 0; k < 14; k++) { g.beginPath(); g.moveTo(-520, -280 + k * 42); g.lineTo(-40, -280 + k * 42); g.moveTo(40, -280 + k * 42); g.lineTo(520, -280 + k * 42); g.stroke(); } g.restore();
  redWrite(g, 'YOU WILL FAIL', 960, 520, 190, seg(t, 78.2, 80.6), 1, t);
  drops(g, 400, 1500, -100, 980, t, 78, 1);
  examHud(g);
  caption(g, 'What if he *failed*?', capA(t, a + 0.4, b - 0.1), ACC);
}
// WIDE (living room): he walks out, slow, around the room... and back. Ayesha on the couch with her laptop.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = seg(t, 82.2, 87.6);
  setCam(g, { x: lerp(960, 980, u), y: lerp(560, 570, u), z: lerp(1.05, 1.1, u) });
  apartment(g, t, { guitar: false });
  const ap = pose('hold', COUCH[2], 712, 1.0, { hip: true });
  const ay = Hero(g, { x: COUCH[2], y: 712, hip: true, thigh: 20, s: 1.0, ...AYESHA, ...ap, face: { look: [-0.6, 0.3], smile: 0.2, blink: blink(t, 1.3) } }, { dir: -1, amt: 0.25 });
  laptop(g, COUCH[2], 690, 0.7, 0.6);
  apFront(g, t);
  const out = k < 0.5, hx = out ? lerp(300, 1600, k * 2) : lerp(1600, 300, (k - 0.5) * 2);
  walker(g, hx, AP_F + 10, 1.05, out ? 1 : -1, t * 4.2, { face: { sad: 0.9, smile: -0.2 }, headOff: [0, 8] }, 0.7); floorShadow(g, hx, AP_F + 12, 90);
  caption(g, "He couldn't sit *still*.", capA(t, a + 0.4, b - 0.1), ACC);
}
s4.fin = 0.4;
// MEDIUM: Ayesha watches him go back to his room. She closes the laptop.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), close = es(t, 90.2, 90.7), up = es(t, 91.4, 92.4);
  setCam(g, { x: lerp(1120, 1130, u), y: 560, z: lerp(1.45, 1.52, u) });
  apartment(g, t, { guitar: false });
  const ap = pose('hold', COUCH[2], 712, 1.0, { hip: true });
  const ay = Hero(g, { x: COUCH[2], y: lerp(712, 690, up), hip: true, thigh: 20, s: 1.0, ...AYESHA, ...(up > 0 ? {} : ap), face: { look: [-0.9, 0], sad: 0.5, smile: -0.1, blink: blink(t, 1.3) } }, { dir: -1, amt: 0.25 });
  if (up <= 0) laptop(g, COUCH[2], 690, 0.7, 0.6, 1 - close);
  apFront(g, t);
  caption(g, '*His big sister* saw it all.', capA(t, a + 0.4, b - 0.1), ACC);
}
// WIDE (his room): head down at the desk. The door opens - warm light.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), op = es(t, 94.6, 95.6);
  setCam(g, { x: lerp(800, 820, u), y: lerp(540, 545, u), z: lerp(1.05, 1.1, u) });
  deskRoom(g, t, { clock: 21.6, door: op });
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...pose('face', DESK[0], DESK[1], 1.05, { hip: true }), headOff: [0, 14], face: { look: [0, 0.9], sad: 1, blink: 1 } }, { dir: 1 });
  deskFront(g, t, { pile: 14 });
  if (op > 0.3) { Hero(g, { x: 40, y: DK_F, s: 1.0, ...AYESHA, face: { look: [0.9, 0.1], sad: 0.4, smile: 0.1 } }, { dir: -1, amt: 0.3 }); floorShadow(g, 40, DK_F + 2, 80); }
  examHud(g);
}
s6.fin = 0.3;
defineClip(65, T, [s1, s2, s3, s4, s5, s6]);
})();
