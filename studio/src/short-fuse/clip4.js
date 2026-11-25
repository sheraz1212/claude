// CLIP 4 (1:36-2:08) - the low point (sparks everywhere), one breath, the wisdom lines, the pieces.
(() => {
const T = [96, 101.5, 106.5, 110, 114.5, 119, 123.5, 128];
sfx(96.0, 'night-amb'); sfx(96.6, 'demon-brass', 0.8); sfx(97.4, 'whisper-forgive');
sfx(101.5, 'fuse-hiss'); sfx(102.2, 'fuse-hiss', 0.8); sfx(102.9, 'fuse-hiss', 0.8); sfx(103.6, 'fuse-hiss', 0.9); sfx(102.0, 'heartbeat', 0.8); sfx(102.4, 'whisper-always', 0.8); sfx(104.2, 'whisper-whoyouare', 0.7); sfx(105.0, 'whisper-forgive', 0.6);
sfx(106.6, 'breath-in'); sfx(108.0, 'breath-out'); [107.6, 107.9, 108.2, 108.5, 108.8].forEach((x, i) => sfx(x, 'fizz-out', 0.6 - i * 0.05));
sfx(110.4, 'pen-write'); sfx(114.9, 'pen-write');
sfx(119.0, 'room-quiet'); sfx(119.8, 'paper-crinkle', 0.5); sfx(121.4, 'glue-squeeze', 0.8);
sfx(123.5, 'room-quiet'); sfx(124.6, 'pencil', 0.9); sfx(126.4, 'celesta-sparkle', 0.5);

// WIDE (low point, place): alone on his bed. The voice towers.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(820, 800, u), y: lerp(520, 510, u), z: lerp(1.0, 1.08, u) });
  const r = onBed(g, t, { demon: 1.3, dA: es(t, 96.6, 97.4), dtext: "they'll never forgive you.", da: Math.min(seg(t, 97.4, 97.7), 1 - seg(t, 100.9, 101.4)), tx: 420, ty: -40, hero: { headOff: [0, 8],  face: { look: [0, 0.9], sad: 0.9, smile: -0.25, blink: blink(t, 0.6) } } });
  fuse(g, r, SS, 0.02, t, 0);
  caption(g, 'He sat alone with what he had *done*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// the room full of lit fuses (low point) - they go out one by one when he breathes
const FZ = Array.from({ length: 14 }, (_, i) => { const q = rng(100 + i); return [80 + q() * 1000, 300 + q() * 520, 0.6 + q() * 0.6, 101.6 + i * 0.25, 107.6 + q() * 1.4]; });
function sparks(g, t, out = 1e9) {
  for (const [x, y, s, on, off] of FZ) { if (t < on) continue; const lit = t < Math.min(off, out) ? es(t, on, on + 0.2) : 0; fuse(g, { head: [x, y + 50 * s] }, s, 0.6, t + x, lit); if (!lit && t > off) smoke(g, x + 6 * s, y - 70 * s, t, 1 - seg(t, off, off + 2), s * 0.6); }
}
// CLOSE (the low point): sparks everywhere, the voice repeats, he grips his head
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 580, y: lerp(470, 465, u) + Math.sin(t * 40) * es(t, 104, 106.4) * 3, z: lerp(1.9, 2.05, u) });
  const r = onBed(g, t, { demon: 2.4, dx: 280, dy: 1420, dA: 1, hero: { armLines: false, headOff: [0, 10], handL: [SIT[0] - 62, SIT[1] - 140], handR: [SIT[0] + 62, SIT[1] - 138], face: { look: [0, 0.6], sad: 1, smile: -0.35, blink: 1 } } });
  sparks(g, t);
  fuse(g, r, SS, 0.08, t, 1);
  demonText(g, "you'll always be like this.", 760, 300, t, Math.min(seg(t, 102.4, 102.7), 1 - seg(t, 104.0, 104.2)), 52);
  demonText(g, "that's who you are.", 440, 320, t, Math.min(seg(t, 104.2, 104.5), 1 - seg(t, 105.0, 105.2)), 56);
  demonText(g, "they'll never forgive you.", 600, 290, t, seg(t, 105.0, 105.3), 50);
  caption(g, 'Every thought was a *spark*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// CLOSE (the turn): eyes shut, one long breath in... and out. The sparks go out, one by one.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), inh = es(t, 106.6, 107.6) * (1 - es(t, 108.0, 109.2));
  setCam(g, { x: 580, y: 470, z: lerp(2.05, 2.15, u) });
  const r = onBed(g, t, { demon: 2.4, dx: 280, dy: 1420 + es(t, 108, 109.6) * 300, dA: 1 - es(t, 108, 109.4), hero: { headOff: [0, -8 * inh], face: { look: [0, 0.2], sad: 0.5 - inh * 0.3, smile: 0, blink: 1 } } });
  sparks(g, t, 1e9);
  fuse(g, r, SS, 0.08, t, 1 - es(t, 108.0, 108.4)); smoke(g, r.head[0] + 6, r.head[1] - 60, t, es(t, 108.2, 108.6), SS);
  caption(g, 'Then, for once, he *breathed*.', capA(t, 107.0, b - 0.05), ACC);
}
// WISDOM LINES
const s4 = card('Anger lights in a *second*.', 0.4, 2.4, 96);
const s5 = card('But you choose what it *burns*.', 0.4, 2.5, 96);
// MEDIUM (the object comes back): at his desk, gluing the rocket back together
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 120.4, 122.8);
  setCam(g, { x: lerp(1300, 1290, u), y: 520, z: lerp(1.55, 1.65, u) });
  heroRoom(g, t, { lamp: 1 });
  const r = Hero(g, { x: 1430, y: 742, s: 0.95, lean: 0.06, headOff: [0, 6], armLines: false, handL: [1380, 580 + Math.sin(t * 5) * 3], handR: [1470, 578 - Math.sin(t * 5) * 3], face: { look: [0, 0.9], sad: 0.3, smile: 0.1, blink: blink(t, 0.5) } }, { dir: 1 });
  floorShadow(g, 1430, 744, 90); fuse(g, r, 0.95, 0.02, t, 0);
  if (k < 0.99) { rocket(g, lerp(1350, 1420, k), 574, 0.5, 0, true); } else rocket(g, 1420, 556, 0.42, 0);
  box(g, 1300, 572, 30, 14, '#c9c2b0', 4);
  caption(g, 'He picked up the *pieces*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.5;
// INSERT top-down (the tiny decision): the rocket stands again; he writes one word
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(540, 530, u), z: lerp(1, 1.06, u) });
  g.fillStyle = '#17141a'; g.fillRect(-200, -200, 2400, 1500); glow(g, 900, 420, 800, WARM, 0.18);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 20); g.stroke(); }
  rocket(g, 1420, 520, 3.4, 0.25);
  ln(g, [1330, 310, 1360, 340, 1350, 380], 3, 'rgba(255,255,255,0.4)');
  notepad(g, 760, 520, 2.3, 'sorry, Sam.', seg(t, 124.6, 126.3), -0.04);
  const pp = seg(t, 124.6, 126.3), px = 760 + lerp(-230, 230, pp), py = 540 + Math.sin(t * 30) * 6 * (pp > 0 && pp < 1 ? 1 : 0);
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(px + 80, py + 150, 70 + (dark ? 6 : 0), 80 + (dark ? 6 : 0), 0.3, 0, 7); g.fill(); }
  g.strokeStyle = '#e0b84a'; g.lineWidth = 16; g.lineCap = 'butt'; g.beginPath(); g.moveTo(px, py + 10); g.lineTo(px + 120, py + 160); g.stroke(); g.strokeStyle = '#2b2b38'; g.lineWidth = 6; g.beginPath(); g.moveTo(px - 8, py); g.lineTo(px, py + 10); g.stroke();
  caption(g, 'And one small *word*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
