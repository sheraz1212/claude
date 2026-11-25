// CLIP 5 (2:06-2:40) - backstage, the open mic again: the demon, huge - "you can't do it." He looks at the pen:
// cracked isn't finished. A golden beam - the demon shatters like glass. On stage: they cheer. Home: a hug. The lesson.
(() => {
const T = [126, 132, 137, 142.5, 148.5, 154, 160];
sfx(126.0, 'mic-room', 0.5); sfx(126.6, 'demon-brass', 0.8); sfx(127.2, 'demon-8bit-3', 0.7); sfx(127.4, 'whisper-cant', 0.95); sfx(129.6, 'heartbeat', 0.7);
sfx(132.0, 'room-quiet'); sfx(133.4, 'pen-gold', 0.6); sfx(134.0, 'pop-8bit-1');
sfx(137.0, 'room-quiet'); sfx(138.4, 'gold-beam'); sfx(140.4, 'shatter'); sfx(140.4, 'boom-big', 0.7); sfx(140.5, 'timpani-boom', 0.7); sfx(140.8, 'gold-fill'); sfx(141.2, 'celesta-sparkle', 0.8);
sfx(142.5, 'mic-room'); sfx(143.0, 'guitar-strum', 0.7); sfx(144.6, 'guitar-strum', 0.7); sfx(145.8, 'crowd-cheer', 0.7); sfx(146.2, 'clap-soft', 0.8);
sfx(148.5, 'kitchen-night', 0.6); sfx(149.0, 'door-open', 0.6); sfx(150.6, 'pop-8bit-2'); sfx(151.6, 'cloth-rustle', 0.8);
sfx(154.3, 'pen-write'); sfx(156.4, 'pen-write', 0.9);

function backShot(g, t, o = {}) {
  backstage(g, t);
  if (!o.gone) demonAt(g, t, 1240, 850, 1.6, null, 0, { a: o.dA ?? 1, crack: o.crack || 0, face: { look: [-0.8, 0.3], smile: 0.8 }, lean: -0.1 });
  const r = Me(g, t, { x: 780, y: 850, s: 1.05, ...(o.pen ? { handR: o.pen } : {}), headOff: [0, o.down ? 12 : 0], face: o.face || { look: [0.8, -0.1], sad: 0.5 } }, { dir: 1 }); floorShadow(g, 780, 852, 90);
  if (!o.pen) heldGuitar(g, r, 1.05, 0);
  return r;
}
// WIDE (backstage): the demon rises out of the dark, bigger than ever. "you can't do it."
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1020, u), y: lerp(520, 500, u), z: lerp(1.0, 1.08, u) });
  backShot(g, t, { dA: es(t, 126.4, 127.4), face: { look: [0.8, -0.2], wide: 1.3, sad: 0.7, blink: blink(t, 0.4) } });
  demonText(g, "you can't do it.", 1080, 160, t, Math.min(seg(t, 127.4, 127.8), 1 - seg(t, 131.0, 131.6)), 96);
  noCam(g); g.fillStyle = `rgba(80,0,0,${0.15 * es(t, 126.4, 127.4)})`; g.fillRect(0, 0, W, H);
  hudFor(g, t);
}
// CLOSE: his head drops... then his eyes find the golden pen. "cracked isn't finished."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 134.6, 135.4);
  setCam(g, { x: lerp(790, 795, u), y: 480, z: lerp(2.1, 2.2, u) });
  const r = backShot(g, t, { gone: true, down: up < 0.5, pen: t > 133.2 ? [860, 600] : null, face: { look: up > 0.5 ? [0.6, -0.2] : [0.3, 0.8], sad: lerp(0.9, -0.5, up), smile: lerp(-0.2, 0.2, up), blink: blink(t, 0.4) } });
  glow(g, 1180, 420, 420, '255,40,30', 0.22 * (1 - up * 0.6));
  if (t > 133.2) goldPen(g, 862, 596, 1.2, -0.4, 1);
  headText(g, "cracked isn't finished.", r.head[0] + 40, r.head[1] - 110, t, 134.0, 136.8);
  hudFor(g, t);
}
// MEDIUM: he raises the pen - a golden beam. The demon cracks and shatters like glass. His last crack turns gold.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 140.4, 16), beam = es(t, 138.4, 138.9) * (1 - seg(t, 140.4, 140.8));
  setCam(g, { x: lerp(1000, 1010, u) + sh, y: 540, z: lerp(1.15, 1.2, u) });
  const r = backShot(g, t, { gone: t > 140.4, crack: es(t, 139.4, 140.4), pen: [880, 520], face: { look: [0.8, -0.3], sad: -0.6, smile: 0.2, blink: 0 } });
  goldPen(g, 884, 512, 1.2, -1.0, 1);
  if (beam > 0) { const tip = [930, 470], tg = [1240, 400], k = es(t, 138.4, 138.8); g.save(); g.globalCompositeOperation = 'lighter'; for (const [w, c] of [[60, `rgba(${GOLDRGB},0.25)`], [24, `rgba(${GOLDRGB},0.7)`], [8, 'rgba(255,250,220,0.95)']]) { g.strokeStyle = c; g.lineWidth = w + Math.sin(t * 50) * 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(tip[0], tip[1]); g.lineTo(lerp(tip[0], tg[0], k), lerp(tip[1], tg[1], k)); g.stroke(); } glow(g, tg[0], tg[1], 200 * beam, GOLDRGB, 0.6 * beam); g.restore(); }
  shards(g, 1240, 500, t, 140.4, 1.8);
  if (t > 140.4 && t < 141.6) { const q = rng(77), k = t - 140.4; for (let i = 0; i < 24; i++) { const ang = q() * 7, v = 300 + q() * 600; g.fillStyle = `rgba(220,235,255,${0.8 * (1 - k / 1.2)})`; g.save(); g.translate(1240 + Math.cos(ang) * v * k, 480 + Math.sin(ang) * v * k + 300 * k * k); g.rotate(k * 6 + i); g.fillRect(-6, -14, 12, 28); g.restore(); } }
  flash(g, t, 140.4, GOLDRGB);
  hudFor(g, t);
  caption(g, 'Cracked. Not *finished*.', capA(t, 141.0, b - 0.1), ACC);
}
// WIDE (the open mic again): he plays. This time they cheer.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 960, u), y: lerp(600, 590, u), z: lerp(1.0, 1.06, u) });
  openMic(g, t);
  const r = Me(g, t, { x: 960, y: ST_F, s: 1.05, handL: [840, ST_F - 228], handR: [990 + Math.sin(t * 14) * 10, ST_F - 196], face: { look: [0.2, -0.2], smile: 0.9, blink: blink(t, 0.4) } }); floorShadow(g, 960, ST_F + 2, 90);
  heldGuitar(g, r, 1.05, 1);
  for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); g.save(); g.globalAlpha = 1 - k; g.fillStyle = GOLD; g.font = '700 48px Nunito'; g.fillText('♪', 1030 + i * 30 + Math.sin(t * 3 + i) * 20, 520 - k * 220); g.restore(); }
  audience(g, t, t > 145.8 ? 'clap' : 'still');
  hudFor(g, t);
  caption(g, 'This time, they *cheered*.', capA(t, 145.8, b - 0.1), ACC);
}
s4.fin = 0.5;
// HOME: he comes in smiling and hugs his mom. The golden handprint glows on the fridge.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), walk = es(t, 149.0, 150.6), hug = es(t, 151.4, 152.4);
  setCam(g, { x: lerp(1300, 1320, u), y: 560, z: lerp(1.35, 1.42, u) });
  kitchen(g, t, { night: true, lamp: 1, note: 'LOVE YOU' });
  handprint(g, 1595, 560, 0.8, { gold: 1 }); glow(g, 1595, 560, 150, GOLDRGB, 0.28);
  const mx = lerp(1380, 1330, hug);
  Hero(g, { x: mx, y: K_F, s: 1.05, ...MOMW, ...(hug > 0 ? { handL: [mx - 90, 600] } : {}), face: { look: [-0.8, 0], smile: 0.9, blink: hug > 0.8 ? 1 : blink(t, 1.2) } }, { dir: -1 }); floorShadow(g, mx, K_F + 2, 90);
  const hx = lerp(lerp(800, 1150, walk), 1240, hug);
  const r = walk < 1 ? walker(g, hx, K_F, 1.05, 1, t * 6, { face: { smile: 0.9 } }) : Me(g, t, { x: hx, y: K_F, s: 1.05, ...(hug > 0 ? { handR: [hx + 90, 600] } : {}), face: { look: [0.8, 0], smile: 0.95, blink: hug > 0.8 ? 1 : blink(t, 0.4) } });
  if (walk < 1) cracks(g, r, 1.05, crackK(t), goldK(t), t);
  floorShadow(g, hx, K_F + 2, 90);
  hudFor(g, t);
  caption(g, 'Still cracked. Now *golden*.', capA(t, 152.4, b - 0.3), ACC);
}
s5.fin = 0.4; s5.fout = 0.5;
// THE LESSON
const s6 = card2("You're not broken.", "You're *rebuilding*.", 0.3, 1.8, 96);
defineClip(126, T, [s1, s2, s3, s4, s5, s6]);
})();
