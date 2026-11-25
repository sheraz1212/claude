// VOLUME UP - shared world. The habit: headphones always on, the world shut out.
// The one symbol: a blue VOLUME BAR beside his head. It climbs while he shuts Grandpa out.
// The object that comes back: Grandpa's harmonica (ignored -> missed -> treasured).
const ACC = '#3FA9FF', BLUE = '63,169,255';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235';
const GPA = { col: '#A9A9B4', acc: 'glasses' }, MOM = { col: '#C9A77A', acc: 'longhair' };

function glow(g, x, y, r, rgb, a) {
  if (a <= 0 || r <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
function pool(g, x, y, r, rgb, a) { g.save(); g.translate(x, y); g.scale(1, 0.2); glow(g, 0, 0, r, rgb, a); g.restore(); }
function ln(g, pts, w = 2.5, col = LINE) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); }
function box(g, x, y, w, h, fill = DARK, r = 0) { g.fillStyle = fill; g.strokeStyle = LINE; g.lineWidth = 2.5; if (r) { rr(g, x, y, w, h, r); g.fill(); g.stroke(); } else { g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h); } }
// where a person's head will be (so hands can reach the mouth before the body is drawn)
function headAt(x, y, s, o = {}) {
  const L = o.lean || 0, ht = L + (o.headTilt || 0), ho = o.headOff || [0, 0], hy = o.hip ? y : y - 166 * s;
  const nx = x + Math.sin(L) * 126 * s, ny = hy - Math.cos(L) * 126 * s;
  return [nx + Math.sin(ht) * 46 * s + ho[0] * s, ny - Math.cos(ht) * 46 * s + ho[1] * s];
}
const blink = (t, off = 0, per = 3.9) => (((t + off) % per) < 0.13 ? 1 : 0);
function Hero(g, o, lt = {}) { return actor(g, o, { amt: 0.3, dim: 0.05, ...lt }); }
// Grandpa: grey, glasses, a white moustache, a small hearing aid
function Gpa(g, o, lt = {}) {
  const s = o.s || 1, r = actor(g, { ...GPA, ...o }, { amt: 0.28, dim: 0.06, ...lt });
  const lk = (o.face && o.face.look) || [0, 0];
  if (o.view !== 'back') {
    const mx = r.head[0] + lk[0] * 15 * s, my = r.head[1] + (lk[1] * 11 + 3 + 15) * s;
    g.fillStyle = '#ece8df'; g.strokeStyle = C.line; g.lineWidth = Math.max(1.4, 2 * s);
    for (const sg of [-1, 1]) { g.beginPath(); g.ellipse(mx + sg * 11 * s, my, 13 * s, 6.5 * s, sg * -0.25, 0, 7); g.fill(); g.stroke(); }
    if (o.aid !== false) { g.fillStyle = o.aidNew ? '#d9c39a' : '#bfae8e'; g.beginPath(); g.ellipse(r.head[0] + 55 * s, r.head[1] + 4 * s, 6 * s, 10 * s, 0.3, 0, 7); g.fill(); g.stroke(); }
  }
  return r;
}
function Mom(g, o, lt = {}) { return actor(g, { ...MOM, ...o }, { amt: 0.25, dim: 0.08, ...lt }); }
function P(g, o) { return person(g, { armLines: (o.s || 1) > 0.8, ...o }); }

// ---------------------------------------------------------------- props
// headphones on his head (o.neck = pulled down around the neck, o.on = blue LED strength, o.side = side view dir)
function phones(g, r, s, o = {}) {
  const [x, y] = r.head || [0, 0], R = 54 * s;
  g.save(); g.lineCap = 'round';
  if (o.neck) {
    const [nx, ny] = r.neck;
    g.strokeStyle = C.line; g.lineWidth = 11 * s; g.beginPath(); g.arc(nx, ny - 12 * s, 44 * s, 0.12 * Math.PI, 0.88 * Math.PI); g.stroke();
    g.strokeStyle = '#2a2e3a'; g.lineWidth = 6 * s; g.stroke();
    for (const sg of [-1, 1]) { g.fillStyle = '#262a35'; g.strokeStyle = C.line; g.lineWidth = 3 * s; g.beginPath(); g.ellipse(nx + sg * 44 * s, ny + 2 * s, 14 * s, 20 * s, sg * 0.5, 0, 7); g.fill(); g.stroke(); }
    g.restore(); return;
  }
  const on = o.on ?? 1;
  g.strokeStyle = C.line; g.lineWidth = 13 * s; g.beginPath(); g.arc(x, y + 4 * s, R + 7 * s, Math.PI * 1.06, Math.PI * 1.94); g.stroke();
  g.strokeStyle = '#2c303c'; g.lineWidth = 7 * s; g.stroke();
  const cups = o.side ? [x - o.side * 16 * s] : [x - R - 3 * s, x + R + 3 * s];
  for (const cx of cups) {
    g.fillStyle = '#262a35'; g.strokeStyle = C.line; g.lineWidth = 3 * s; rr(g, cx - 15 * s, y - 25 * s, 30 * s, 52 * s, 13 * s); g.fill(); g.stroke(); if (o.side && on > 0) glow(g, cx, y, 40 * s, BLUE, 0.3 * on);
    if (on > 0 && !o.side) { g.fillStyle = `rgba(${BLUE},${0.95 * on})`; g.beginPath(); g.arc(cx, y + 1 * s, 4.5 * s, 0, 7); g.fill(); glow(g, cx, y, 42 * s, BLUE, 0.4 * on); }
  }
  g.restore();
}
// THE SYMBOL: speaker + 10 bars. v = 0..10
function volBar(g, x, y, s, v, a = 1) {
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  glow(g, x + 100 * s, y, 150 * s * (0.4 + v / 10), BLUE, 0.16 * v / 10);
  g.fillStyle = v > 0.05 ? ACC : '#5d6270';
  g.beginPath(); g.moveTo(x, y - 8 * s); g.lineTo(x + 10 * s, y - 8 * s); g.lineTo(x + 22 * s, y - 19 * s); g.lineTo(x + 22 * s, y + 19 * s); g.lineTo(x + 10 * s, y + 8 * s); g.lineTo(x, y + 8 * s); g.closePath(); g.fill();
  if (v <= 0.05) { g.strokeStyle = '#8a8f9c'; g.lineWidth = 3 * s; g.beginPath(); g.moveTo(x + 30 * s, y - 10 * s); g.lineTo(x + 48 * s, y + 10 * s); g.moveTo(x + 48 * s, y - 10 * s); g.lineTo(x + 30 * s, y + 10 * s); g.stroke(); }
  for (let i = 0; i < 10; i++) {
    const bx = x + 40 * s + i * 13 * s, h = (8 + i * 3.6) * s, on = clamp(v - i);
    g.globalAlpha = a; g.fillStyle = 'rgba(255,255,255,0.13)'; g.fillRect(bx, y + 19 * s - h, 8 * s, h);
    if (on > 0) { g.globalAlpha = a * on; g.fillStyle = i >= 8 ? '#a8daff' : ACC; g.fillRect(bx, y + 19 * s - h, 8 * s, h); }
  }
  g.globalAlpha = a;
  if (v >= 9.95) { g.font = `700 ${17 * s}px Nunito`; g.fillStyle = '#cfe9ff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('MAX', x + 176 * s, y + 6 * s); }
  g.restore();
}
function harmonica(g, x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  rr(g, -33 * s, -9 * s, 66 * s, 18 * s, 4 * s);
  const gr = g.createLinearGradient(0, -9 * s, 0, 9 * s); gr.addColorStop(0, '#eef0f6'); gr.addColorStop(0.5, '#a3a7b4'); gr.addColorStop(1, '#5f626d');
  g.fillStyle = gr; g.fill(); g.strokeStyle = C.line; g.lineWidth = Math.max(1.5, 2.2 * s); g.stroke();
  g.fillStyle = '#2a2b33'; for (let i = 0; i < 8; i++) g.fillRect(-27 * s + i * 7 * s, -2 * s, 4 * s, 4 * s);
  g.restore();
}
// a person playing the harmonica: hands at the mouth
function playPose(x, y, s, o = {}) {
  const h = headAt(x, y, s, o);
  return { handL: [h[0] - 34 * s, h[1] + 33 * s], handR: [h[0] + 34 * s, h[1] + 33 * s], bendL: 1, bendR: -1, _h: [h[0], h[1] + 31 * s] };
}
// little music notes drifting up from (x, y)
function notes(g, x, y, t, a, s = 1, col = '255,214,150', dir = 1) {
  if (a <= 0) return;
  for (let i = 0; i < 5; i++) {
    const ph = (t * 0.42 + i * 0.2) % 1, nx = x + dir * ph * 150 * s + Math.sin(t * 2 + i * 1.7) * 18 * s, ny = y - ph * 190 * s, al = a * Math.sin(ph * Math.PI);
    g.save(); g.globalAlpha = al; g.fillStyle = g.strokeStyle = `rgb(${col})`; g.lineWidth = 3 * s;
    g.beginPath(); g.ellipse(nx, ny, 8 * s, 6 * s, -0.4, 0, 7); g.fill();
    g.beginPath(); g.moveTo(nx + 7 * s, ny - 2 * s); g.lineTo(nx + 7 * s, ny - 30 * s); if (i % 2) g.quadraticCurveTo(nx + 18 * s, ny - 24 * s, nx + 16 * s, ny - 14 * s); g.stroke();
    g.restore(); glow(g, nx, ny - 10 * s, 26 * s, col, 0.18 * al);
  }
}
// a phone held in a hand, screen toward him: only a small light on the hand
function phoneIn(g, hand, s, lit = 1) {
  const [x, y] = hand;
  g.fillStyle = '#0a0a0e'; g.strokeStyle = LINE; g.lineWidth = 2; rr(g, x - 13 * s, y - 30 * s, 26 * s, 46 * s, 5 * s); g.fill(); g.stroke();
  glow(g, x, y - 10 * s, 50 * s, BLUE, 0.25 * lit);
}
function demonAt(g, t, x, y, k, text, a, o = {}) {
  const d = demon(g, { x, y, s: 1.2 * k, lean: o.lean ?? -0.05 * k, headOff: [-8 * k, Math.sin(t * 1.7) * 2], face: { look: [-0.7, 0.3], ...(o.face || {}) }, ...(o.pose || {}) }, { t, crack: o.crack, a: o.a ?? 1 });
  if (text) demonText(g, text, d.head[0] + (o.tx ?? 60 * k), d.head[1] - (o.ty ?? 130 * k), t, a, 54 + 14 * k);
  return d;
}
function walker(g, x, y, s, d, ph, o = {}, run = 1) {
  const sw = Math.sin(ph) * run;
  return person(g, { x, y: y - Math.abs(Math.cos(ph)) * 4 * s * run, s, view: 'side', dir: d, lean: d * 0.07 * (run - 1), legL: [0.48 * sw, -0.55 * run * Math.max(0, Math.cos(ph))], legR: [-0.48 * sw, -0.55 * run * Math.max(0, -Math.cos(ph))], armL: [-0.45 * sw, 0.3 + 0.5 * (run - 1)], armR: [0.45 * sw, 0.3 + 0.5 * (run - 1)], armLines: false, ...o });
}
function skyline(g, y, x0, x1, seed, col, sky) {
  if (sky) { const gr = g.createLinearGradient(0, y - 560, 0, y); sky.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(x0 - 600, y - 1000, x1 - x0 + 1200, 1000); }
  const r = rng(seed); let x = x0;
  while (x < x1) {
    const w = 150 + r() * 120, h = 150 + r() * 150; g.fillStyle = col; g.fillRect(x, y - h, w, h);
    for (let i = 0; i < 4; i++) { const lit = r() > 0.6; g.fillStyle = lit ? '#d9a657' : 'rgba(255,255,255,0.05)'; g.fillRect(x + 22 + (i % 2) * (w - 80), y - h + 34 + Math.floor(i / 2) * 62, 34, 40); }
    x += w + 6 + r() * 14;
  }
}
function lampPost(g, x, y, h, a = 1) {
  g.strokeStyle = '#3a3846'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h + 30); g.quadraticCurveTo(x, y - h, x - 40, y - h); g.stroke();
  glow(g, x - 44, y - h + 6, 170, WARM, 0.6 * a); pool(g, x - 44, y + 30, 330, WARM, 0.3 * a);
}
function card(text, w0 = 0.5, w1 = 2.6, size = 96, dy = 0) {
  const fn = (g, t, a, b) => blackLine(g, text, seg(t, a + w0, a + w1), ACC, 1 - seg(t, b - 0.6, b - 0.15), size, dy);
  fn.black = true; return fn;
}
function shake(t, at, k = 12) { return (t >= at && t < at + 0.4) ? Math.sin((t - at) * 80) * k * (1 - (t - at) / 0.4) : 0; }
function flash(g, t, at, rgb = BLUE) { const k = 0.4 * (1 - seg(t, at, at + 0.3)); if (t >= at && k > 0) { g.save(); noCam(g); g.fillStyle = `rgba(${rgb},${k})`; g.fillRect(0, 0, W, H); g.restore(); } }

// ---------------------------------------------------------------- LIVING ROOM (core place 1: opens and closes the film)
// o: lamp (0..1), mom (fn drawn in the kitchen door), harm ('table' | null), drawer, aidBox
const LR_F = 840;
function livingRoom(g, t, o = {}) {
  const F = LR_F, lamp = o.lamp ?? 1;
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, F + 400); g.fillStyle = '#0b0b10'; g.fillRect(-500, F, 3000, 700);
  g.lineCap = 'round'; g.lineJoin = 'round'; ln(g, [-500, F, 2500, F]);
  g.strokeStyle = 'rgba(106,106,120,0.12)'; g.lineWidth = 2; g.beginPath(); for (let x = -480; x < 2500; x += 90) { g.moveTo(x, -400); g.lineTo(x, F); } g.stroke();
  ln(g, [-500, 520, 2500, 520], 2, 'rgba(106,106,120,0.35)');
  // kitchen doorway (left), warm
  const kg = g.createLinearGradient(110, 0, 330, 0); kg.addColorStop(0, '#5e4127'); kg.addColorStop(1, '#9c7040'); g.fillStyle = kg; g.fillRect(110, 340, 220, 500);
  g.fillStyle = '#4a3520'; g.fillRect(110, 640, 220, 26); g.fillStyle = '#3b2a1a'; g.fillRect(110, 666, 220, 174);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.strokeRect(110, 340, 220, 500); glow(g, 220, 560, 380, WARM, 0.12); pool(g, 260, F + 10, 300, WARM, 0.12);
  if (o.mom) o.mom();
  g.strokeStyle = LINE; g.lineWidth = 7; g.strokeRect(104, 334, 232, 506);
  // window with the night city
  const gr = g.createLinearGradient(0, 180, 0, 460); gr.addColorStop(0, '#0b0d1c'); gr.addColorStop(1, o.dawn ? '#5a3f4a' : '#1b1e36'); g.fillStyle = gr; g.fillRect(820, 180, 260, 280);
  const q = rng(7); g.fillStyle = '#07080f'; for (let x = 820; x < 1080; x += 52) { const h = 50 + q() * 90; g.fillRect(x, 460 - h, 50, h); if (q() > 0.4) { g.fillStyle = '#d9a657'; g.fillRect(x + 17, 460 - h + 14, 12, 16); g.fillStyle = '#07080f'; } }
  g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(820, 180, 260, 280); g.lineWidth = 5; ln(g, [950, 180, 950, 460], 5, '#2a2a36'); glow(g, 950, 320, 380, '90,100,160', 0.08);
  // shelf + framed photo (Grandpa, young, with the harmonica) above the sofa
  box(g, 470, 300, 260, 10, '#1d1b25'); box(g, 520, 214, 74, 86, '#1b1a22', 4); box(g, 532, 226, 50, 62, '#2a2730');
  g.fillStyle = '#8f8f9c'; g.beginPath(); g.arc(557, 248, 11, 0, 7); g.fill(); g.fillRect(547, 260, 20, 28); g.fillStyle = '#c9ccd6'; g.fillRect(549, 258, 16, 4);
  box(g, 640, 250, 18, 50, '#2c2633'); box(g, 662, 262, 16, 38, '#33303d'); box(g, 682, 256, 16, 44, '#26303a');
  // floor lamp (right)
  ln(g, [1760, F, 1760, 440], 5, '#3a3846'); g.beginPath(); g.moveTo(1700, 440); g.lineTo(1722, 370); g.lineTo(1798, 370); g.lineTo(1820, 440); g.closePath();
  g.fillStyle = lamp > 0.05 ? `rgba(255,205,140,${0.35 + 0.5 * lamp})` : DARK; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  glow(g, 1760, 430, 560, WARM, 0.2 * lamp); pool(g, 1620, F + 10, 520, WARM, 0.2 * lamp);
  // rug
  g.save(); g.beginPath(); g.ellipse(1060, F + 70, 620, 50, 0, 0, 7); g.fillStyle = '#16141c'; g.fill(); g.strokeStyle = 'rgba(106,106,120,0.5)'; g.lineWidth = 2; g.stroke(); g.restore();
  if (o.behind) o.behind();
  // sofa (left) - he sits at x 640
  box(g, 430, 560, 520, 150, '#1a1a25', 30); box(g, 430, 690, 520, 64, '#1d1d29', 16);
  box(g, 396, 610, 62, 170, '#1d1d29', 24); box(g, 922, 610, 62, 170, '#1d1d29', 24);
  ln(g, [690, 575, 690, 690], 2, 'rgba(106,106,120,0.5)'); box(g, 440, 754, 14, F - 754, DARK); box(g, 926, 754, 14, F - 754, DARK);
  // armchair (right) - Grandpa sits at x 1480
  box(g, 1340, 520, 280, 190, '#1c1922', 40); box(g, 1340, 690, 280, 64, '#201c27', 16);
  box(g, 1306, 600, 60, 180, '#201c27', 24); box(g, 1594, 600, 60, 180, '#201c27', 24); box(g, 1350, 754, 14, F - 754, DARK); box(g, 1600, 754, 14, F - 754, DARK);
  // side table with a cup (and the harmonica / the drawer)
  box(g, 1110, 726, 130, 14, '#1e1c26'); box(g, 1124, 740, 102, 52, '#18171f'); ln(g, [1130, 792, 1130, F]); ln(g, [1220, 792, 1220, F]);
  ln(g, [1150, 766, 1200, 766], 3); if (o.drawer) { box(g, 1120 + 0, 744, 110, 44 * o.drawer, '#24222c'); }
  box(g, 1196, 700, 26, 26, '#2a2832', 4);
  if (o.harm === 'table') harmonica(g, 1150, 718, 0.95, -0.05);
  if (o.aidBox) { box(g, 1140, 708, 44, 18, '#2c3a4a', 4); g.fillStyle = '#d9c39a'; g.beginPath(); g.ellipse(1162, 704, 7, 5, 0, 0, 7); g.fill(); }
}
function bedFront(g) { rr(g, 160, 664, 700, 62, 22); g.fillStyle = '#191922'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke(); }
const SOFA = [640, 712], ARM = [1480, 712];
// the front of the seat cushions, drawn over the sitters so they read as SITTING (legs hang below)
function lrFront(g) {
  box(g, 446, 700, 488, 52, '#1f1f2b', 14); box(g, 1352, 700, 256, 52, '#221e29', 14);
  ln(g, [690, 704, 690, 748], 2, 'rgba(106,106,120,0.5)');
}

// ---------------------------------------------------------------- DINNER TABLE (core place 2, the REPEATED SHOT)
function dinnerRoom(g, t, o = {}) {
  g.fillStyle = '#121218'; g.fillRect(-500, -400, 3000, 1200); g.fillStyle = '#0b0b10'; g.fillRect(-500, 850, 3000, 600); ln(g, [-500, 850, 2500, 850]);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; g.beginPath(); for (let y = 120; y < 850; y += 120) { g.moveTo(-500, y); g.lineTo(2500, y); } g.stroke();
  // window (left) and a clock (right)
  box(g, 180, 220, 230, 270, '#0d0f1d'); ln(g, [295, 220, 295, 490], 5, '#2a2a36'); glow(g, 295, 350, 300, '90,100,160', 0.07);
  g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.arc(1620, 290, 54, 0, 7); g.fillStyle = '#1a1a22'; g.fill(); g.stroke();
  const ang = t * 0.4; ln(g, [1620, 290, 1620 + Math.sin(ang) * 40, 290 - Math.cos(ang) * 40], 3, '#9a9aa8'); ln(g, [1620, 290, 1620 + 26, 290 + 8], 4, '#9a9aa8');
  // hanging lamp
  ln(g, [960, -300, 960, 150], 2.5); g.beginPath(); g.moveTo(880, 210); g.lineTo(920, 150); g.lineTo(1000, 150); g.lineTo(1040, 210); g.closePath(); g.fillStyle = 'rgba(255,205,140,0.85)'; g.fill(); g.strokeStyle = LINE; g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter'; const cg = g.createLinearGradient(0, 210, 0, 760); cg.addColorStop(0, `rgba(${WARM},0.16)`); cg.addColorStop(1, `rgba(${WARM},0)`);
  g.fillStyle = cg; g.beginPath(); g.moveTo(880, 210); g.lineTo(1040, 210); g.lineTo(1440, 760); g.lineTo(480, 760); g.closePath(); g.fill(); g.restore();
  glow(g, 960, 200, 260, WARM, 0.35);
  // chair backs behind the people
  for (const x of DIN) { box(g, x - 62, 585, 124, 150, '#18171f', 14); }
}
const DIN = [620, 960, 1300];   // Mom, Grandpa, him
function dinnerTable(g, t, o = {}) {
  box(g, 430, 724, 1060, 18, '#22202a'); box(g, 450, 742, 1020, 140, '#18171f');
  pool(g, 960, 732, 520, WARM, 0.18);
  for (const x of DIN) { g.strokeStyle = '#8a8a96'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x, 718, 62, 9, 0, 0, 7); g.fillStyle = '#2a2a34'; g.fill(); g.stroke(); }
  if (o.harm) harmonica(g, o.harm[0], o.harm[1], 1.0, 0.1);
}

// ---------------------------------------------------------------- HIS ROOM (core place 3)
// o: lying (true: in bed with the headphones), glow (blue), under ('notes' warm light + notes under the door), lamp
function heroRoom(g, t, o = {}) {
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, 1150); g.fillStyle = '#0b0b10'; g.fillRect(-500, 740, 3000, 700); ln(g, [-500, 740, 2500, 740]);
  // poster + window
  box(g, 560, 230, 170, 230, '#191822', 4); g.strokeStyle = ACC; g.globalAlpha = 0.5; g.lineWidth = 6; g.beginPath(); g.arc(645, 330, 50, 0, 7); g.stroke(); g.beginPath(); g.arc(645, 330, 20, 0, 7); g.stroke(); g.globalAlpha = 1;
  const gr = g.createLinearGradient(0, 170, 0, 470); gr.addColorStop(0, o.dawn ? '#3a3350' : '#0b0d1c'); gr.addColorStop(1, o.dawn ? '#c98a66' : '#1b1e36'); g.fillStyle = gr; g.fillRect(900, 170, 250, 300);
  const q = rng(4); g.fillStyle = '#07080f'; for (let x = 900; x < 1150; x += 50) { const h = 50 + q() * 80; g.fillRect(x, 470 - h, 48, h); if (q() > 0.4) { g.fillStyle = '#d9a657'; g.fillRect(x + 16, 470 - h + 14, 12, 16); g.fillStyle = '#07080f'; } }
  g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(900, 170, 250, 300); g.lineWidth = 5; g.beginPath(); g.moveTo(1025, 170); g.lineTo(1025, 470); g.stroke();
  glow(g, 1025, 320, 420, o.dawn ? WARM : '90,100,160', o.dawn ? 0.2 : 0.1);
  // door (right), warm light under it from the living room
  box(g, 1680, 270, 180, 470); g.strokeRect(1700, 296, 140, 180); g.strokeRect(1700, 500, 140, 210); g.beginPath(); g.arc(1702, 520, 6, 0, 7); g.stroke();
  const und = o.under ?? 0;
  if (und > 0) { g.fillStyle = `rgba(255,200,130,${0.8 * und})`; g.fillRect(1684, 734, 172, 6); g.save(); g.globalCompositeOperation = 'lighter'; const fg = g.createLinearGradient(0, 740, 0, 860); fg.addColorStop(0, `rgba(${WARM},${0.22 * und})`); fg.addColorStop(1, `rgba(${WARM},0)`); g.fillStyle = fg; g.beginPath(); g.moveTo(1684, 740); g.lineTo(1856, 740); g.lineTo(1900, 860); g.lineTo(1560, 860); g.fill(); g.restore(); }
  // desk + lamp
  box(g, 1240, 590, 380, 16); ln(g, [1256, 606, 1256, 740]); ln(g, [1604, 606, 1604, 740]);
  g.beginPath(); g.moveTo(1560, 590); g.lineTo(1560, 520); g.quadraticCurveTo(1560, 490, 1530, 496); g.stroke(); g.beginPath(); g.moveTo(1500, 520); g.lineTo(1516, 484); g.lineTo(1548, 492); g.lineTo(1552, 524); g.closePath(); g.fillStyle = o.lamp ? 'rgba(255,205,140,0.9)' : DARK; g.fill(); g.stroke();
  if (o.lamp) { glow(g, 1520, 540, 300 * o.lamp, WARM, 0.3 * o.lamp); pool(g, 1440, 596, 220, WARM, 0.25 * o.lamp); }
  if (o.harmDesk) harmonica(g, 1380, 582, 1, 0);
  // bed (left)
  rr(g, 120, 520, 46, 300, 10); g.fillStyle = DARK; g.fill(); g.stroke(); box(g, 160, 720, 690, 46); box(g, 820, 766, 18, 50);
  rr(g, 160, 656, 700, 70, 22); g.fillStyle = '#191922'; g.fill(); g.stroke(); rr(g, 178, 624, 160, 50, 22); g.fillStyle = '#1d1d27'; g.fill(); g.stroke();
  box(g, 40, 640, 78, 100);
  if (o.lying) {
    const hx = 262, hy = 606, gl = o.glow ?? 1, s = 0.93, eyes = o.eyesOpen;
    g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 3.4; g.beginPath(); g.arc(hx, hy, 50, 0, 7); g.fill(); g.stroke();
    g.fillStyle = C.line; g.lineWidth = 3;
    if (eyes) { g.beginPath(); g.ellipse(hx + 26, hy - 2, 4.5, 7, 0, 0, 7); g.fill(); } else { g.beginPath(); g.moveTo(hx + 19, hy); g.quadraticCurveTo(hx + 26, hy + 5, hx + 33, hy); g.stroke(); }
    g.beginPath(); g.moveTo(hx + 17, hy - 22); g.quadraticCurveTo(hx + 26, hy - 26, hx + 35, hy - 22); g.stroke();
    g.beginPath(); g.moveTo(hx + 30, hy + 26); g.quadraticCurveTo(hx + 38, hy + 27, hx + 45, hy + 24); g.stroke();
    phones(g, { head: [hx, hy] }, s, { on: gl });
    g.beginPath(); g.moveTo(300, 680); g.quadraticCurveTo(330, 610, 430, 612); g.quadraticCurveTo(640, 604, 850, 650); g.lineTo(858, 700); g.lineTo(300, 706); g.closePath(); g.fillStyle = '#1e1e2b'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
    return { head: [hx, hy] };
  }
}

// ---------------------------------------------------------------- BUS (one-off)
function bus(g, t, o = {}) {
  g.fillStyle = '#14141b'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0c0c11'; g.fillRect(-500, 820, 3000, 600); ln(g, [-500, 820, 2500, 820]);
  for (let i = 0; i < 6; i++) {
    const x = -60 + i * 360;
    g.save(); rr(g, x, 200, 310, 250, 26); g.clip(); g.fillStyle = '#0a0c18'; g.fillRect(x, 200, 310, 250);
    g.translate(-((t * 260) % 1400), 0); skyline(g, 450, x - 200, x + 1800, 30 + i, '#07080f'); g.restore();
    rr(g, x, 200, 310, 250, 26); g.strokeStyle = '#2a2a36'; g.lineWidth = 8; g.stroke();
  }
  ln(g, [-500, 150, 2500, 150], 6, '#2a2a36'); for (let x = 60; x < 2000; x += 120) { g.strokeStyle = '#3a3846'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 150); g.lineTo(x, 190); g.stroke(); g.beginPath(); g.arc(x, 200, 10, 0, 7); g.stroke(); }
  for (const x of [500, 1420]) { ln(g, [x, 150, x, 820], 8, '#4a4856'); }
  for (let x = 0; x < 2000; x += 260) glow(g, x + 130, 160, 200, COLD, 0.06);
  for (const x of [250, 600, 960, 1320, 1670]) box(g, x - 110, 560, 220, 170, '#1b1a24', 20);
}
function busFront(g) { for (const x of [250, 600, 960, 1670]) box(g, x - 104, 690, 208, 44, '#201f2a', 14); }

// ---------------------------------------------------------------- PARK BENCH at night (core place 4)
function park(g, t, o = {}) {
  skyline(g, 600, -400, 2400, 21, '#0d0c14', [[0, '#0a0a14'], [0.7, '#1c1726'], [1, '#2b1f2c']]);
  g.fillStyle = '#0c0b10'; g.fillRect(-500, 600, 3000, 900); ln(g, [-500, 600, 2500, 600], 2, 'rgba(106,106,120,0.4)');
  g.fillStyle = '#111017'; g.beginPath(); g.moveTo(-500, 860); g.lineTo(2500, 860); g.lineTo(2500, 760); g.lineTo(-500, 760); g.fill(); ln(g, [-500, 760, 2500, 760], 2, 'rgba(106,106,120,0.5)'); ln(g, [-500, 860, 2500, 860], 2, 'rgba(106,106,120,0.5)');
  for (const [x, r] of [[180, 150], [420, 110], [1620, 160], [1880, 120]]) { g.fillStyle = '#0e0d14'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.arc(x, 520 - r * 0.6, r, 0, 7); g.fill(); g.stroke(); ln(g, [x, 600, x, 520]); }
  lampPost(g, 1440, 760, 520, o.lamp ?? 1);
  // bench (Grandpa sits at 1060)
  box(g, 820, 606, 460, 18, '#211e28', 6); box(g, 820, 636, 460, 18, '#211e28', 6); box(g, 806, 712, 488, 20, '#24212b', 6);
  ln(g, [840, 732, 840, 772], 6); ln(g, [1260, 732, 1260, 772], 6); ln(g, [850, 654, 850, 712], 6); ln(g, [1250, 654, 1250, 712], 6);
}
const BENCH = [1060, 712];
function benchFront(g) { box(g, 806, 708, 488, 22, '#24212b', 6); }

// ---------------------------------------------------------------- INSERTS
// top-down: the kitchen table with the letter (o.k = letter slid out 0..1)
function letterInsert(g, t, o = {}) {
  g.fillStyle = '#17141a'; g.fillRect(-300, -300, 2600, 1700);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 20); g.stroke(); }
  glow(g, 900, 420, 800, WARM, 0.14);
  // envelope
  g.save(); g.translate(1300, 650); g.rotate(0.18); box(g, -220, -130, 440, 260, '#cbbfa6', 6); ln(g, [-220, -130, 0, 10, 220, -130], 2.5, '#6d6457'); g.restore();
  // the letter
  g.save(); g.translate(lerp(1180, 820, o.k ?? 1), 520); g.rotate(-0.06);
  box(g, -330, -380, 660, 780, '#ece5d2', 6);
  g.fillStyle = '#2a2a33'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = '800 40px Nunito'; g.fillText('HEARING TEST', -280, -300);
  g.font = '400 26px Nunito'; g.fillStyle = '#4a4a55'; g.fillText('Patient: Grandpa (age 78)', -280, -250);
  g.fillStyle = 'rgba(60,60,70,0.25)'; for (let i = 0; i < 4; i++) g.fillRect(-280, -200 + i * 38, 520 - i * 70, 12);
  g.fillStyle = '#2a2a33'; g.font = '700 32px Nunito'; g.fillText('Result:', -280, 20);
  g.fillStyle = '#b8322a'; g.font = '800 42px Nunito'; g.fillText('SEVERE HEARING LOSS', -280, 78);
  g.fillStyle = '#4a4a55'; g.font = '400 28px Nunito'; g.fillText('Both ears. Getting worse.', -280, 130);
  g.fillStyle = 'rgba(60,60,70,0.25)'; for (let i = 0; i < 3; i++) g.fillRect(-280, 190 + i * 38, 480 - i * 90, 12);
  // a small hearing-loss chart line going down
  g.strokeStyle = '#b8322a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-280, 320); g.bezierCurveTo(-120, 320, 0, 330, 260, 380); g.stroke();
  g.restore();
  harmonica(g, 1480, 300, 2.6, 0.4);
}
// the phone screen (POV): the volume slider climbs; a warning pops up and he taps OK
function volumePOV(g, t, o) {
  const u = seg(t, o.t0, o.t1);
  noCam(g); g.fillStyle = '#0c0c12'; g.fillRect(0, 0, W, H);
  const q = rng(3); for (let i = 0; i < 7; i++) glow(g, q() * W, q() * H, 200 + q() * 260, '50,70,110', 0.1);
  setCam(g, { x: 960, y: 540 + Math.sin(t * 0.9) * 4, z: lerp(1, 1.06, ease(u)) });
  glow(g, 960, 480, 640, BLUE, 0.14);
  // hand
  for (const dark of [true, false]) { g.strokeStyle = g.fillStyle = dark ? C.line : C.cream; g.lineCap = 'round'; g.lineWidth = 210 + (dark ? 14 : 0); g.beginPath(); g.moveTo(1220, 800); g.lineTo(1800, 1120); g.stroke(); g.beginPath(); g.ellipse(1130, 700, 150 + (dark ? 7 : 0), 185 + (dark ? 7 : 0), 0.25, 0, 7); g.fill(); }
  const px = 760, py = 84, pw = 400, ph = 740;
  rr(g, px, py, pw, ph, 50); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.fillStyle = '#10131a'; g.fill();
  // now playing
  rr(g, px + 70, py + 90, 260, 260, 20); const ag = g.createLinearGradient(px + 70, py + 90, px + 330, py + 350); ag.addColorStop(0, '#1d3d66'); ag.addColorStop(1, '#0d1626'); g.fillStyle = ag; g.fill();
  g.strokeStyle = ACC; g.lineWidth = 5; g.beginPath(); g.arc(px + 200, py + 220, 70, 0, 7); g.stroke(); g.beginPath(); g.arc(px + 200, py + 220, 18, 0, 7); g.stroke();
  g.fillStyle = '#fff'; g.font = '700 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('loud mix vol. 3', px + 200, py + 400);
  g.fillStyle = '#8b93a5'; g.font = '400 22px Nunito'; g.fillText('on repeat', px + 200, py + 436);
  // volume slider
  const v = o.vol(t);
  g.fillStyle = '#8b93a5'; g.font = '600 22px Nunito'; g.fillText('VOLUME', px + 200, py + 510);
  rr(g, px + 50, py + 545, 300, 14, 7); g.fillStyle = '#2a2f3c'; g.fill(); rr(g, px + 50, py + 545, 300 * v, 14, 7); g.fillStyle = ACC; g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(px + 50 + 300 * v, py + 552, 18, 0, 7); g.fill(); glow(g, px + 50 + 300 * v, py + 552, 60, BLUE, 0.4);
  g.fillStyle = '#fff'; g.font = '800 34px Nunito'; g.fillText(Math.round(v * 100) + '%', px + 200, py + 610);
  // warning
  const w = o.warn ? ease(seg(t, o.warn[0], o.warn[0] + 0.25)) * (1 - seg(t, o.warn[1], o.warn[1] + 0.2)) : 0;
  if (w > 0) {
    g.save(); g.globalAlpha = w; g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(px + 13, py + 13, pw - 26, ph - 26);
    rr(g, px + 40, py + 250, 320, 250, 24); g.fillStyle = '#1e2230'; g.fill(); g.strokeStyle = '#3a4058'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#ffcf5a'; g.font = '800 40px Nunito'; g.fillText('!', px + 200, py + 290);
    g.fillStyle = '#fff'; g.font = '600 25px Nunito'; g.fillText('High volume can', px + 200, py + 340); g.fillText('damage your hearing.', px + 200, py + 372);
    rr(g, px + 120, py + 410, 160, 56, 28); g.fillStyle = (t > o.warn[1] - 0.3) ? '#6fc0ff' : ACC; g.fill(); g.fillStyle = '#06101c'; g.font = '800 28px Nunito'; g.fillText('OK', px + 200, py + 439);
    g.restore();
  }
  // thumb
  const th = o.thumb(t);
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(th[0], th[1], 46 + (dark ? 7 : 0), 108 + (dark ? 7 : 0), -0.42, 0, 7); g.fill(); }
}
// a window at night: his reflection, faint, with the city behind (o.demon alpha, o.phones)
function windowRefl(g, t, o = {}) {
  g.fillStyle = '#0e0e15'; g.fillRect(-300, -300, 2600, 1700);
  box(g, 420, 110, 1080, 840, '#0a0c18');
  g.save(); g.beginPath(); g.rect(432, 122, 1056, 816); g.clip();
  skyline(g, 760, 300, 1700, 12, '#06070d', [[0, '#05060c'], [1, '#141830']]);
  g.globalAlpha = 0.5;
  if (o.demon > 0) demon(g, { x: 1240, y: 1500, s: 3.0, face: { look: [-0.6, 0.2], smile: 0.7 }, headOff: [0, Math.sin(t * 1.3) * 4] }, { t, a: o.demon, glow: 24 });
  const r = actor(g, { x: 900, y: 1430, s: 2.3, headOff: [0, (o.down || 0) * 14], face: { look: [0, 0.3], sad: 0.6, smile: -0.1, blink: blink(t, 0.4) }, ...(o.pose || {}) }, { dir: -1, amt: 0.2, dim: 0.25 });
  if (o.phones) phones(g, r, 2.3, { neck: o.phones === 'neck', on: 0.8 });
  g.globalAlpha = 1;
  g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 40; g.beginPath(); g.moveTo(480, 520); g.lineTo(780, 140); g.moveTo(620, 620); g.lineTo(900, 260); g.stroke();
  g.restore();
  g.strokeStyle = '#2a2a36'; g.lineWidth = 14; g.strokeRect(420, 110, 1080, 840); ln(g, [960, 110, 960, 950], 10, '#2a2a36');
  return r;
}
// a notepad held up in his mitten, written in pencil
function notepad(g, x, y, s, text, prog = 1, rot = -0.04) {
  g.save(); g.translate(x, y); g.rotate(rot);
  box(g, -150 * s, -110 * s, 300 * s, 220 * s, '#efe8d4', 6 * s); g.fillStyle = '#c94b3f'; g.fillRect(-150 * s, -110 * s, 300 * s, 16 * s);
  g.strokeStyle = 'rgba(80,110,170,0.35)'; g.lineWidth = 1.5 * s; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-136 * s, (-50 + i * 34) * s); g.lineTo(136 * s, (-50 + i * 34) * s); g.stroke(); }
  g.font = `${54 * s}px "Patrick Hand"`; let w = g.measureText(text).width; if (w > 262 * s) { g.font = `${54 * s * 262 * s / w}px "Patrick Hand"`; w = g.measureText(text).width; } g.textAlign = 'center'; g.textBaseline = 'middle';
  g.beginPath(); g.rect(-w / 2 - 10, -80 * s, (w + 20) * clamp(prog), 160 * s); g.clip(); g.fillStyle = '#2b2b38'; g.fillText(text, 0, 6 * s);
  g.restore();
}
