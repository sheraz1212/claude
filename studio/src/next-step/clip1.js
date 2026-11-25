// CLIP 1 (0:00-0:32) - ten days before exams. He tries to study, nothing goes in, "just 5 minutes" -> two hours.
(() => {
const T = [0, 5.5, 11, 17, 22, 27, 32];
sfx(0.0, 'night-amb'); sfx(0.5, 'page-turn', 0.8); sfx(2.4, 'pencil', 0.7);
sfx(5.5, 'room-quiet'); sfx(6.4, 'page-turn', 0.7); sfx(8.6, 'highlighter', 0.8);
sfx(11.0, 'room-quiet'); sfx(12.6, 'pencil', 0.8); sfx(14.4, 'sigh'); sfx(15.4, 'book-push'); sfx(15.6, 'pop-8bit-1');
sfx(17.0, 'room-quiet'); sfx(18.2, 'pop-8bit-2'); sfx(19.6, 'phone-up', 0.8); sfx(20.4, 'phone-tap-soft', 0.7);
sfx(22.0, 'feed-loop'); for (let i = 0; i < 6; i++) sfx(22.6 + i * 0.75, 'scroll-flick', 0.7 + (i % 2) * 0.15);
sfx(27.0, 'clock-spin'); sfx(30.6, 'low-thud', 0.7);

// WIDE (hook, second 0): his room, the desk buried in books. He sits down to study.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 980, u), y: lerp(520, 530, u), z: lerp(1.0, 1.08, u) });
  deskRoom(g, t, { clock: 19 + (t - a) / 600 });
  const ps = SITP();
  Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...ps, handR: [ps.handR[0] - 30, 690 + Math.sin(t * 3) * 3], headOff: [0, 8], face: { look: [0, 0.9], blink: blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 9 });
  examHud(g);
  hookLine(g, t, 'Ten days. *Too* many books.', 0.15, 1.4, 1 - seg(t, 4.9, 5.4));
}
// INSERT (top-down): open books, notes, highlighters, chai - everything at once
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(1, 1.07, u) });
  g.fillStyle = '#1e1a20'; g.fillRect(-400, -400, 2800, 1900); g.strokeStyle = 'rgba(106,106,120,0.15)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 10); g.stroke(); }
  glow(g, 1300, 300, 700, WARM, 0.18);
  const q = rng(4);
  for (let i = 0; i < 9; i++) { g.save(); g.translate(300 + (i % 5) * 330 + q() * 60, 260 + Math.floor(i / 5) * 420 + q() * 80); g.rotate((q() - 0.5) * 0.5); box(g, -150, -110, 300, 220, BOOKC[i % 8], 6); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(-120, -80, 140, 14); g.restore(); }
  g.save(); g.translate(960, 560); g.rotate(-0.05); box(g, -260, -170, 520, 340, '#f2ecdc', 6); ln(g, [0, -170, 0, 170], 2);
  g.strokeStyle = 'rgba(60,60,80,0.4)'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(-230, -130 + k * 32); g.lineTo(-30, -130 + k * 32); g.moveTo(30, -130 + k * 32); g.lineTo(230, -130 + k * 32); g.stroke(); }
  g.fillStyle = 'rgba(255,225,77,0.55)'; g.fillRect(-232, -56, 180 * es(t, 8.4, 9.4), 20); g.restore();
  for (const [x, y, c, r] of [[1420, 760, '#FFE14D', 0.4], [1480, 790, '#ff7ab0', 0.2], [1530, 760, '#7ae0a0', -0.1]]) { g.save(); g.translate(x, y); g.rotate(r); box(g, -14, -70, 28, 140, c, 8); g.restore(); }
  g.fillStyle = '#e9e2cf'; g.beginPath(); g.arc(1500, 300, 70, 0, 7); g.fill(); g.fillStyle = '#a0683a'; g.beginPath(); g.arc(1500, 300, 56, 0, 7); g.fill();
  examHud(g);
  caption(g, 'Ten days before his *exams*, he tried to study.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: nothing goes in. He rubs his head, pushes the book away.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), rub = t > 13.6 && t < 15.2, push = es(t, 15.3, 15.8);
  setCam(g, { x: lerp(1090, 1100, u), y: 520, z: lerp(1.45, 1.52, u) });
  deskRoom(g, t, { clock: 19.08 });
  const ps = SITP();
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...(rub ? pose('face', DESK[0], DESK[1], 1.05, { hip: true }) : { ...ps, handR: [ps.handR[0] + push * 40, ps.handR[1]] }), headOff: [0, rub ? 10 : 6], face: { look: [0, 0.9], sad: 0.6, smile: -0.2, blink: rub ? 1 : blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 9, open: push < 0.5 });
  headText(g, "ugh. nothing goes in.", r.head[0] + 30, r.head[1] - 110, t, 13.4, 16.6);
  examHud(g);
  caption(g, 'Nothing *stayed* in his head.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.3;
// CLOSE: "just 5 minutes." He picks up the phone to relax.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 19.4, 20.0);
  setCam(g, { x: lerp(1100, 1105, u), y: 545, z: lerp(2.1, 2.2, u) });
  deskRoom(g, t, { clock: 19.1 });
  const ph = pose('phone', DESK[0], DESK[1], 1.05, { hip: true }), ps = SITP();
  const hx = lerp(ps.handR[0], ph.handR[0], up), hy = lerp(ps.handR[1], ph.handR[1], up);
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, handL: ps.handL, handR: [hx, hy], headOff: [0, 6], face: { look: up > 0.5 ? [0.2, 0.9] : [0.6, 0.6], sad: 0.4, smile: up > 0.8 ? 0.2 : -0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  phoneAt(g, hx, hy - 10, 1.05, up);
  deskFront(g, t, { pile: 9, open: false });
  headText(g, 'just 5 minutes.', r.head[0] + 40, r.head[1] - 110, t, 18.2, 21.6);
  examHud(g);
  caption(g, 'Just *five minutes*. To relax.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV: the feed. Video after video. The phone's own clock runs.
function s5(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: feedApp(t => fmtTime(19.1 + es(t, 22, 26.8) * 1.0)), thumb: t => [1180, lerp(800, 690, (Math.sin((t - a) * 8.4) * 0.5 + 0.5))] });
  examHud(g);
  caption(g, 'One video. Then another.', capA(t, a + 0.4, b - 0.1), ACC);
}
// INSERT (the wall clock spins): 7:10 -> 9:15
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), h = 19.15 + es(t, 27.3, 30.4) * 2.08;
  setCam(g, { x: 1100, y: 220, z: lerp(2.6, 2.75, u) });
  deskRoom(g, t, { clock: h });
  if (t > 30.6) { noCam(g); const k = seg(t, 30.6, 30.9); g.save(); g.globalAlpha = k; g.fillStyle = ACC; g.font = '800 96px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 16; g.fillText('-2 HOURS', W / 2, H / 2 + 260 - k * 20); g.restore(); }
  examHud(g);
  caption(g, 'Five minutes became *two hours*.', capA(t, a + 0.4, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
