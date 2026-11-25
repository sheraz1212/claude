// CLIP 2 (0:32-1:05) - the pile again, the call with Zain ("almost done!"), the boys playing outside.
(() => {
const T = [32, 37.5, 43, 50, 55, 60.5, 65];
sfx(32.0, 'room-quiet'); sfx(32.6, 'phone-down', 0.8); sfx(34.8, 'sigh', 0.8);
sfx(37.5, 'room-quiet'); sfx(39.6, 'breath-heavy', 0.7);
sfx(43.0, 'room-quiet'); sfx(43.2, 'call-connect', 0.8); sfx(43.8, 'pop-8bit-3'); sfx(45.6, 'pop-8bit-1'); sfx(47.8, 'pop-8bit-2');
sfx(50.0, 'room-quiet'); sfx(51.2, 'phone-down', 0.6);
sfx(55.0, 'room-quiet'); sfx(55.4, 'chair-creak', 0.8); sfx(56.2, 'steps-small', 0.6); sfx(58.0, 'kids-play', 0.5);
sfx(60.5, 'kids-play'); sfx(60.8, 'ball-bounce', 0.6); sfx(61.6, 'whisper-goplay', 0.85); sfx(62.6, 'ball-bounce', 0.5); sfx(63.8, 'net-swish', 0.6);

// WIDE (low angle): he puts the phone down - and the pile is still there. Taller than ever.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = t > 32.6;
  setCam(g, { x: lerp(980, 1000, u), y: lerp(560, 575, u), z: lerp(1.15, 1.22, u) });
  deskRoom(g, t, { clock: 21.25 });
  const ps = SITP(), ph = pose('phone', DESK[0], DESK[1], 1.05, { hip: true });
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...(down ? ps : ph), headOff: [0, 4], face: { look: [-0.6, 0.1], wide: 1.25, sad: 0.6, blink: blink(t, 0.4) } }, { dir: 1 });
  if (!down) phoneAt(g, ph.handR[0], ph.handR[1] - 10, 1.05, 0.8);
  deskFront(g, t, { pile: 14 });
  examHud(g);
  caption(g, 'And the books were *still* there.', capA(t, a + 0.4, b - 0.1), ACC);
}
// CLOSE: overwhelmed - head in his hands
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), hands = t > 38.6;
  setCam(g, { x: lerp(1080, 1090, u), y: 545, z: lerp(2.1, 2.2, u) });
  deskRoom(g, t, { clock: 21.27 });
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...(hands ? pose('face', DESK[0], DESK[1], 1.05, { hip: true }) : SITP()), headOff: [0, hands ? 14 : 6], face: { look: [-0.4, 0.4], sad: 0.9, smile: -0.25, blink: hands ? 1 : blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 14 });
  examHud(g);
  caption(g, 'It felt *impossible*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// SPLIT SCREEN: he calls his friend Zain. "how's the prep?" - "good! almost done. you?" - "yeah... same."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  g.save(); noCam(g); g.beginPath(); g.rect(0, 0, 956, H); g.clip();
  setCam(g, { x: lerp(1410, 1420, u), y: 520, z: 1.5 });
  deskRoom(g, t, { clock: 21.3 });
  const pe = pose('ear', DESK[0], DESK[1], 1.05, { hip: true });
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...pe, headOff: [0, 6], face: { look: [0.4, 0.3], sad: t > 46 ? 0.8 : 0.4, smile: t > 47.8 ? 0.1 : -0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  phoneAt(g, pe.handR[0], pe.handR[1], 1.05, 0.2, 0.2);
  deskFront(g, t, { pile: 14 });
  headText(g, "how's the prep going?", r.head[0], r.head[1] - 115, t, 43.8, 45.5);
  headText(g, 'yeah... same.', r.head[0], r.head[1] - 115, t, 47.8, 49.9);
  g.restore();
  g.save(); noCam(g); g.beginPath(); g.rect(964, 0, 956, H); g.clip();
  setCam(g, { x: lerp(215, 205, u), y: 500, z: 1.5 });
  const pz = pose('ear', SIT[0], SIT[1], SS, { hip: true });
  const z = onBed(g, t, { under: 0, lamp: 1, hero: { ...ZAIN, ...pz, face: { look: [-0.3, 0.2], smile: 0.8, blink: blink(t, 1.1) } } });
  phoneAt(g, pz.handR[0], pz.handR[1], SS, 0.2, -0.2);
  books(g, 1420, 590, 3, 31, 120);
  headText(g, 'good! almost done. you?', z.head[0] + 30, z.head[1] - 110, t, 45.6, 47.7);
  g.restore();
  noCam(g); g.fillStyle = '#000'; g.fillRect(956, 0, 8, H);
  examHud(g);
  caption(g, 'He called his *best friend*.', capA(t, a + 0.4, 45.4), ACC);
}
s3.fin = 0.3;
// CLOSE: after the call. Everyone was ahead.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), low = es(t, 50.8, 51.6);
  setCam(g, { x: lerp(1100, 1095, u), y: 545, z: lerp(2.15, 2.25, u) });
  deskRoom(g, t, { clock: 21.35 });
  const pe = pose('ear', DESK[0], DESK[1], 1.05, { hip: true }), ps = SITP();
  const hr = [lerp(pe.handR[0], ps.handR[0], low), lerp(pe.handR[1], ps.handR[1], low)];
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, handL: ps.handL, handR: hr, headOff: [0, 6 + low * 8], face: { look: [0, 0.8], sad: 1, smile: -0.3, blink: blink(t, 0.4) } }, { dir: 1 });
  phoneAt(g, hr[0], hr[1], 1.05, 0.2, 0.2 - low * 1.2);
  deskFront(g, t, { pile: 14 });
  examHud(g);
  caption(g, 'Everyone was *ahead* of him.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: he goes to the window. Voices outside.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 55.6, 57.6);
  setCam(g, { x: lerp(600, 560, u), y: 540, z: lerp(1.35, 1.42, u) });
  deskRoom(g, t, { clock: 21.4 });
  glow(g, 330, 400, 300, WARM, 0.12);
  const hx = lerp(900, 560, go);
  const r = go > 0 && go < 1 ? walker(g, hx, DK_F, 1.05, -1, t * 6, { face: { sad: 0.6 } }) : Hero(g, { x: hx, y: DK_F, s: 1.05, view: 'side', dir: -1, headOff: [-4, 0], face: { look: [-0.9, -0.1], sad: 0.5, smile: 0.1, blink: blink(t, 0.4) } }, { dir: -1 });
  floorShadow(g, hx, DK_F + 2, 90);
  if (hx > 640) deskFront(g, t, { pile: 14 });
  examHud(g);
  caption(g, 'Outside, the boys were *playing*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s5.fin = 0.3;
// POV (through his window): the game. A whisper: "exam is far... go play."
function s6(g, t, a, b) {
  windowPOV(g, t, a, b);
  noCam(g); glow(g, W / 2, 190, 420, '255,58,44', 0.12 * Math.min(seg(t, 61.5, 61.9), 1 - seg(t, 64.0, 64.4)));
  demonText(g, 'exam is far... go play.', CAM.x, CAM.y + (190 - H / 2) / CAM.z, t, Math.min(seg(t, 61.6, 62.0), 1 - seg(t, 64.0, 64.4)), 80);
  examHud(g);
  caption(g, 'He wanted to go *so* badly.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(32, T, [s1, s2, s3, s4, s5, s6]);
})();
