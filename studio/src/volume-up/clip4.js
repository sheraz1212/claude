// CLIP 4 (1:36-2:08) - the low point, the silence, the wisdom lines, one small question.
(() => {
const T = [96, 101.5, 106.5, 110, 114.5, 119, 123.5, 128];
sfx(96.0, 'night-amb'); sfx(96.0, 'phones-leak', 0.5); sfx(97.0, 'demon-brass', 0.8); sfx(97.6, 'whisper-backon');
sfx(101.5, 'heartbeat', 0.8); sfx(101.7, 'whisper-toolate', 0.8); sfx(102.6, 'whisper-canthear', 0.8); sfx(103.4, 'whisper-turnitup', 0.8); sfx(104.1, 'whisper-toolate', 0.6); sfx(104.6, 'whisper-canthear', 0.6); sfx(105.0, 'whisper-backon', 0.6);
sfx(101.5, 'phones-leak', 0.9); sfx(104.0, 'phones-leak', 1.0);
sfx(106.6, 'phones-off'); sfx(106.6, 'low-thud'); sfx(106.6, 'timpani-boom', 0.7); sfx(106.7, 'ear-ring', 0.8); sfx(108.6, 'clock-tick', 0.7);
sfx(110.4, 'pen-write'); sfx(114.9, 'pen-write');
sfx(119.0, 'living-amb'); sfx(120.4, 'drawer'); sfx(121.6, 'celesta-sparkle', 0.6);
sfx(123.5, 'room-quiet'); sfx(124.0, 'pencil', 0.9);

const SIT = [520, 660], S = 0.93;
function onBed(g, t, o = {}) {
  heroRoom(g, t, { under: o.under ?? 0.6, lamp: o.lamp });
  if (o.demon) demonAt(g, t, SIT[0] + (o.dx ?? 260), o.dy ?? 742, o.demon, o.dtext, o.da ?? 1, { a: o.dA ?? 1, tx: o.tx ?? 230, ty: o.ty ?? 10, lean: -0.1, face: { look: [-0.8, 0.4], smile: 0.7 } });
  const r = Hero(g, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: S, armLines: false, face: { look: [0, 0.8], sad: 0.7, smile: -0.15, blink: blink(t, 0.6) }, ...(o.hero || {}) }, { dir: 1, amt: 0.35, dim: 0.12 });
  bedFront(g);
  return r;
}
// WIDE (low point, place): on the edge of his bed. The voice towers over him.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(820, 800, u), y: lerp(520, 510, u), z: lerp(1.0, 1.08, u) });
  const r = onBed(g, t, { demon: 1.3, dA: es(t, 96.8, 97.6), dtext: 'put them back on.', da: Math.min(seg(t, 97.6, 97.9), 1 - seg(t, 100.9, 101.4)), hero: { handL: [SIT[0] - 30, SIT[1] - 20], handR: [SIT[0] + 40, SIT[1] - 30] } });
  phones(g, r, S, { neck: true });
  volBar(g, r.head[0] + 70, r.head[1] - 100, 0.85, 10, 0.9);
  caption(g, 'He wanted to *hide* again.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// CLOSE (the low point): head in his hands, the words fill the room
const WORDS = [[101.7, 'too late.', 300, 300, 80], [102.6, "he can't hear you.", 840, 230, 76], [103.4, 'turn it up.', 260, 720, 70], [104.1, 'too late.', 120, 900, 86], [104.6, "he can't hear you.", 560, 150, 62], [105.0, 'put them back on.', 1000, 480, 66], [105.4, 'too late.', 380, 560, 92]];
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 560, y: lerp(470, 465, u) + Math.sin(t * 40) * es(t, 104, 106.4) * 3, z: lerp(2.0, 2.15, u) });
  const r = onBed(g, t, { demon: 2.4, dx: 250, dy: 1420, dA: 1, hero: { headOff: [0, 10], headTilt: 0.05, handL: [SIT[0] - 62, SIT[1] - 140], handR: [SIT[0] + 62, SIT[1] - 138], face: { look: [0, 0.9], sad: 1, smile: -0.3, blink: 1 } } });
  phones(g, r, S, { on: 1 });
  volBar(g, r.head[0] + 70, r.head[1] - 95, 0.7, 10 - (Math.sin(t * 30) > 0.6 ? 1 : 0));
  for (const [at, w, x, y, sz] of WORDS) { const sx = (x - 960) / 2.1 + 560, sy = (y - 540) / 2.1 + 465; demonText(g, w, sx, sy, t + at, seg(t, at, at + 0.25), sz * (1 + es(t, at, b) * 0.15)); }
  caption(g, 'The voice got *louder*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// CLOSE (the turn): he pulls them OFF. Silence. The bar falls to mute.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 106.6, 10);
  setCam(g, { x: 560 + sh, y: 470, z: lerp(2.1, 2.2, u) });
  const off = es(t, 106.5, 106.9);
  const r = onBed(g, t, { under: 0.6 + off * 0.4, hero: { handL: [lerp(SIT[0] - 66, SIT[0] - 50, off), lerp(SIT[1] - 138, SIT[1] - 40, off)], handR: [lerp(SIT[0] + 62, SIT[0] + 50, off), lerp(SIT[1] - 138, SIT[1] - 40, off)], face: { look: [0, lerp(0.9, 0, es(t, 107.4, 108.2))], wide: 1 + 0.3 * es(t, 107.4, 108.2), sad: 0.6, smile: -0.1, blink: t < 107.2 ? 1 : blink(t, 0.4) } } });
  if (off < 0.5) phones(g, r, S, { on: 1 }); else { g.save(); g.translate(SIT[0], SIT[1] - 30); phones(g, { head: [0, 0] }, S * 0.8, { on: 0 }); g.restore(); }
  volBar(g, r.head[0] + 70, r.head[1] - 95, 0.7, t < 106.6 ? 10 : 0);
  flash(g, t, 106.6, '255,255,255');
  caption(g, 'For the first time, he heard the *silence*.', capA(t, 107.6, b - 0.05), ACC);
}
// WISDOM LINES on black
const s4 = card('Some people *lose* their hearing.', 0.4, 2.5, 88);
const s5 = card('Others just stop *listening*.', 0.4, 2.4, 96);
// MEDIUM (the object comes back): he opens the drawer and finds the harmonica
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), dr = es(t, 120.2, 120.7), k = es(t, 120.9, 121.7);
  setCam(g, { x: lerp(1180, 1170, u), y: 560, z: lerp(1.5, 1.6, u) });
  livingRoom(g, t, { lamp: 0.5, drawer: dr });
  const hand = [lerp(1176, 1100, k), lerp(764, 600, k)];
  const r = Hero(g, { x: 1030, y: LR_F, s: 1.15, lean: 0.12 * (1 - k), armLines: false, handR: dr > 0.2 ? hand : null, bendR: 1, face: { look: [0.7, lerp(0.8, 0.3, k)], sad: 0.4, smile: lerp(-0.1, 0.1, k), blink: blink(t, 0.6) } }, { dir: 1 });
  floorShadow(g, 1030, LR_F + 2, 100);
  if (dr > 0.6) harmonica(g, hand[0] + 4, hand[1] - 6, 1.15, -0.2);
  if (k > 0.8) glow(g, hand[0], hand[1], 80, WARM, 0.25 * k);
  caption(g, "He found Grandpa's *harmonica*.", capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.5;
// INSERT (the tiny decision): he writes one question on a notepad
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); setCam(g, { x: 960, y: lerp(540, 530, u), z: lerp(1, 1.06, u) });
  g.fillStyle = '#17141a'; g.fillRect(-200, -200, 2400, 1500); glow(g, 900, 420, 800, WARM, 0.16);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 20); g.stroke(); }
  harmonica(g, 1430, 760, 3.0, -0.3);
  notepad(g, 860, 520, 2.4, 'teach me?', seg(t, 124.0, 125.8), -0.04);
  const pp = seg(t, 124.0, 125.8), px = 860 + lerp(-200, 210, pp), py = 540 + Math.sin(t * 30) * 6 * (pp > 0 && pp < 1 ? 1 : 0);
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(px + 80, py + 150, 70 + (dark ? 6 : 0), 80 + (dark ? 6 : 0), 0.3, 0, 7); g.fill(); }
  g.strokeStyle = '#e0b84a'; g.lineWidth = 16; g.lineCap = 'butt'; g.beginPath(); g.moveTo(px, py + 10); g.lineTo(px + 120, py + 160); g.stroke(); g.strokeStyle = '#2b2b38'; g.lineWidth = 6; g.beginPath(); g.moveTo(px - 8, py); g.lineTo(px, py + 10); g.stroke();
  caption(g, 'One small *question*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
