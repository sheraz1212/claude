// CLIP 3 (1:10-1:46) - the turn: he cries, then goes back. His mom is mending the handprint with gold. "It's even more
// beautiful now." He says sorry - a hug. She puts the golden pen in his hand. "Cracked isn't finished."
(() => {
const T = [70, 76, 82, 88, 94, 100, 106];
sfx(70.0, 'night-amb'); sfx(70.6, 'sniffle', 0.8); sfx(73.0, 'sniffle', 0.6);
sfx(76.0, 'kitchen-night', 0.8); sfx(76.4, 'steps-small', 0.5); sfx(77.6, 'pen-gold', 0.6); sfx(79.6, 'pen-gold', 0.6);
sfx(82.0, 'room-quiet'); sfx(82.6, 'pen-gold', 0.9); sfx(84.4, 'pen-gold', 0.8); sfx(86.0, 'celesta-sparkle', 0.7);
sfx(88.0, 'kitchen-night', 0.7); sfx(88.6, 'cloth-rustle', 0.5); sfx(89.6, 'pop-8bit-1'); sfx(91.0, 'pop-8bit-2'); sfx(92.2, 'cloth-rustle', 0.8);
sfx(94.0, 'room-quiet'); sfx(95.0, 'pen-gold', 0.6); sfx(96.0, 'celesta-sparkle', 0.8);
sfx(100.3, 'pen-write'); sfx(102.2, 'pen-write', 0.9);

// CLOSE: on his bed, he cries. He sees his mom's face again - the moment it fell.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(560, 565, u), y: 545, z: lerp(2.0, 2.1, u) });
  heroRoom(g, t, { under: 0.5 });
  const r = Me(g, t, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: SS, ...pose('hold', SIT[0], SIT[1], SS, { hip: true }), headOff: [0, 10], face: { look: [0.3, 0.6], sad: 1, smile: -0.25, blink: blink(t, 0.6) } }, { dir: 1, amt: 0.35 });
  bedFront(g);
  for (const [off, sp] of [[0, 1.6], [0.8, 1.9]]) { const k = ((t - a + off) / sp) % 1; g.fillStyle = `rgba(150,200,255,${0.85 * (1 - k)})`; g.beginPath(); g.ellipse(r.head[0] + 20, r.head[1] + 8 + k * 46, 4, 6, 0, 0, 7); g.fill(); }
  memoryBubble(g, 1460, 300, 170, Math.min(seg(t, 71.4, 72.0), 1 - seg(t, 75.2, 75.8)), g => { g.save(); g.translate(1460, 330); g.scale(0.55, 0.55); g.translate(-960, -560); g.fillStyle = '#1a1a22'; g.fillRect(400, 0, 1200, 1200); Hero(g, { x: 960, y: 1000, s: 1.4, ...MOMW, face: { look: [0, 0.2], sad: 0.95, smile: -0.25 } }, { dir: 1 }); g.restore(); });
  hudFor(g, t);
  caption(g, 'He had hurt the one person who *stayed*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// WIDE (kitchen, late): from the doorway he sees his mom at the table - mending the pieces with gold.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1020, u), y: 560, z: lerp(1.15, 1.22, u) });
  kitchen(g, t, { night: true, lamp: 1, note: 'LOVE YOU' });
  Hero(g, { x: 870, y: 744, hip: true, thigh: 20, s: 1.0, ...MOMW, handL: [820, 720], handR: [900 + Math.sin(t * 6) * 8, 712], face: { look: [0.1, 0.9], smile: 0.2, blink: blink(t, 1.2) } }, { dir: 1 });
  kitchenTable(g, t, { cup: false });
  g.save(); g.translate(860, 718); g.scale(1, 0.35); handprint(g, 0, 0, 0.6, { gold: es(t, 76.4, 81.6) }); g.restore();
  goldPen(g, 905 + Math.sin(t * 6) * 8, 712, 0.8, -0.5, 0.8);
  Me(g, t, { x: 1560, y: K_F, s: 1.05, view: 'side', dir: -1, face: { look: [-0.9, 0.2], sad: 0.7, blink: blink(t, 0.4) } }, { dir: -1 }); floorShadow(g, 1560, K_F + 2, 90);
  hudFor(g, t);
  caption(g, "His mom didn't throw it *away*.", capA(t, a + 0.6, b - 0.1), ACC);
}
// INSERT (top-down): the pieces joined with lines of gold
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.0, 1.06, u) });
  tableTop(g, t);
  handprint(g, 960, 540, 3.2, { gold: 0.55 + es(t, 82.4, 86.4) * 0.45 });
  const k = es(t, 82.4, 86.4), px = 960 + Math.cos(k * 6) * 120, py = 540 + Math.sin(k * 6) * 120;
  goldPen(g, px, py, 1.6, 2.5, 1); topHand(g, px + 110, py + 200, 0.75, '#A9A9B4', -0.5);
  hudFor(g, t);
}
// MEDIUM: she puts it back on the fridge. "it's even more beautiful now." - "I'm sorry, mom." A hug.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), hug = es(t, 92.0, 93.0);
  setCam(g, { x: lerp(1400, 1380, u), y: 560, z: lerp(1.45, 1.52, u) });
  kitchen(g, t, { night: true, lamp: 1, note: 'LOVE YOU' });
  handprint(g, 1595, 560, 0.8, { gold: 1 });
  glow(g, 1595, 560, 140, GOLDRGB, 0.25);
  const mx = lerp(1420, 1330, hug), hx = lerp(1130, 1240, hug);
  const mm = Hero(g, { x: mx, y: K_F, s: 1.05, ...MOMW, ...(hug > 0 ? { handL: [mx - 90, 600] } : t < 89.4 ? { handR: [1540, 560] } : {}), face: { look: [-0.8, 0], smile: 0.6, sad: 0.2, blink: hug > 0.8 ? 1 : blink(t, 1.2) } }, { dir: -1 }); floorShadow(g, mx, K_F + 2, 90);
  const r = Me(g, t, { x: hx, y: K_F, s: 1.05, ...(hug > 0 ? { handR: [hx + 90, 600] } : {}), face: { look: [0.8, 0.1], sad: 0.8, smile: hug > 0.5 ? 0.3 : -0.1, blink: hug > 0.8 ? 1 : blink(t, 0.4) } }); floorShadow(g, hx, K_F + 2, 90);
  headText(g, "it's even more beautiful now.", mm.head[0], mm.head[1] - 115, t, 89.6, 91.8);
  headText(g, "I'm sorry, mom.", r.head[0] - 20, r.head[1] - 115, t, 91.0, 93.4);
  hudFor(g, t);
}
// INSERT: she presses the golden pen into his hand
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 94.6, 95.6);
  setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.05, 1.1, u) });
  g.fillStyle = '#151318'; g.fillRect(-400, -400, 2800, 1900); glow(g, 960, 520, 500, GOLDRGB, 0.12 + 0.1 * give);
  topHand(g, 960, 700, 1.3, C.cream, 0);
  goldPen(g, lerp(1350, 1000, give), lerp(420, 640, give), 3.2, -0.9, 1);
  topHand(g, lerp(1560, 1300, give), lerp(260, 420, give) - es(t, 96.4, 97.6) * 300, 1.0, '#A9A9B4', -2.2);
  hudFor(g, t);
  caption(g, 'She gave him the *golden pen*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// WISDOM
const s6 = card('Cracked isn\'t *finished*.', 0.4, 2.2, 100);
defineClip(70, T, [s1, s2, s3, s4, s5, s6]);
})();
