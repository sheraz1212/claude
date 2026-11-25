// ALL IN - shared world. The habit: sports betting on a phone app (LuckyLine). The symbol: the app's green
// glow + a counter of money LOST. The object: a dusty basketball in the corner (ignored -> missed -> played).
// Every small thing lights it; when the spark reaches his head he explodes. Each new fuse is shorter.
// The object that comes back: Sam's paper rocket (a gift -> broken in the blast -> launched together).
const ACC = '#2BD96B', GREEN = '43,217,107', FIRE = '43,217,107';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235';
const MARCUS = { col: '#C9A77A', acc: 'cap', accCol: '#2f4f7a' }, DAD = { col: '#A9A9B4', acc: 'glasses' }, MOM = { col: '#A9A9B4', acc: 'longhair', accCol: '#2e2a33' }, SAM = { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' };
const GPA = { col: '#A9A9B4', acc: 'glasses' };
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
function flash(g, t, at, rgb = FIRE) { const k = 0.4 * (1 - seg(t, at, at + 0.3)); if (t >= at && k > 0) { g.save(); noCam(g); g.fillStyle = `rgba(${rgb},${k})`; g.fillRect(0, 0, W, H); g.restore(); } }

// ---------------------------------------------------------------- THE SYMBOL: the fuse on his head
// len: 0..1 (how much fuse is left), lit: spark strength, s: scale
function fuse(g, r, s, len, t, lit = 1) {
  const bx = r.head[0] + 6 * s, by = r.head[1] - 50 * s, n = 24, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n * Math.max(0.02, len); pts.push([bx + Math.sin(u * 5.5) * 16 * s * u * 1.4, by - u * 120 * s]); }
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [w, c] of [[10 * s, C.line], [5.5 * s, '#9a7a4e']]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
  g.strokeStyle = 'rgba(40,30,20,0.6)'; g.lineWidth = 1.6 * s; for (let i = 2; i < n; i += 3) { const [x, y] = pts[i]; g.beginPath(); g.moveTo(x - 3 * s, y - 2 * s); g.lineTo(x + 3 * s, y + 2 * s); g.stroke(); }
  const [tx, ty] = pts[n];
  if (lit > 0) {
    g.fillStyle = '#1a1210'; g.beginPath(); g.arc(tx, ty, 4 * s, 0, 7); g.fill();
    const fl = 0.8 + 0.2 * Math.sin(t * 47) * Math.sin(t * 13);
    glow(g, tx, ty, 70 * s * lit * fl, FIRE, 0.55 * lit); glow(g, tx, ty, 18 * s * lit, '255,250,220', 0.95 * lit);
    const q = rng(Math.floor(t * 24)); g.strokeStyle = `rgba(255,220,120,${0.9 * lit})`; g.lineWidth = 2 * s;
    for (let i = 0; i < 9; i++) { const a = q() * 6.28, d0 = 6 * s, d1 = (12 + q() * 26) * s * lit; g.beginPath(); g.moveTo(tx + Math.cos(a) * d0, ty + Math.sin(a) * d0); g.lineTo(tx + Math.cos(a) * d1, ty + Math.sin(a) * d1); g.stroke(); }
  }
  g.restore();
}
// the explosion: k 0 -> 1 over its life
function burst(g, x, y, R, k, seed = 3) {
  if (k <= 0 || k >= 1) return;
  const e = 1 - Math.pow(1 - clamp(k * 2.2), 3), a = 1 - k, q = rng(seed);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [rk, col, al] of [[1, '255,120,30', 0.55], [0.72, '255,190,60', 0.75], [0.42, '255,245,210', 0.9]]) {
    g.fillStyle = `rgba(${col},${al * a})`; g.beginPath();
    for (let i = 0; i < 28; i++) { const an = i / 28 * 6.283, rr_ = R * rk * e * (i % 2 ? 0.55 + q() * 0.15 : 0.9 + q() * 0.2); g.lineTo(x + Math.cos(an) * rr_, y + Math.sin(an) * rr_ * 0.85); }
    g.closePath(); g.fill();
  }
  g.restore();
  glow(g, x, y, R * 1.6 * e, FIRE, 0.5 * a);
  for (let i = 0; i < 10; i++) { const an = q() * 6.28, d = R * (0.6 + q() * 0.8) * e; g.fillStyle = `rgba(60,55,60,${0.5 * a})`; g.beginPath(); g.arc(x + Math.cos(an) * d, y + Math.sin(an) * d * 0.8 - k * 60, R * 0.12 * (0.5 + e), 0, 7); g.fill(); }
  g.fillStyle = `rgba(255,210,120,${a})`; for (let i = 0; i < 16; i++) { const an = q() * 6.28, d = R * 1.4 * e * (0.5 + q()); g.fillRect(x + Math.cos(an) * d, y + Math.sin(an) * d + k * k * 80, 6, 6); }
}
// smoke curling up from where the spark went out
function smoke(g, x, y, t, a, s = 1) {
  if (a <= 0) return;
  for (let i = 0; i < 6; i++) { const ph = (t * 0.5 + i / 6) % 1; g.fillStyle = `rgba(150,150,160,${0.25 * a * (1 - ph)})`; g.beginPath(); g.arc(x + Math.sin(t * 2 + i) * 10 * s * ph, y - ph * 120 * s, (6 + ph * 18) * s, 0, 7); g.fill(); }
}
// Sam's paper rocket (broken = its pieces on the floor)
function rocket(g, x, y, s = 1, rot = 0, broken = false, fire = 0, t = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = C.line;
  if (broken) {
    g.save(); g.translate(-40, 6); g.rotate(-0.9); rr(g, -16, -40, 32, 60, 4); g.fillStyle = '#efe8d4'; g.fill(); g.stroke(); g.restore();
    g.save(); g.translate(30, 10); g.rotate(1.3); g.beginPath(); g.moveTo(-16, 0); g.lineTo(0, -34); g.lineTo(16, 0); g.closePath(); g.fillStyle = '#d0453a'; g.fill(); g.stroke(); g.restore();
    g.save(); g.translate(5, 14); g.rotate(0.3); rr(g, -18, -12, 36, 24, 3); g.fillStyle = '#efe8d4'; g.fill(); g.stroke(); g.fillStyle = '#3b6fb0'; g.fillRect(-12, -4, 10, 8); g.restore();
    g.save(); g.translate(70, 14); g.rotate(2.2); g.beginPath(); g.moveTo(0, 0); g.lineTo(20, 18); g.lineTo(0, 18); g.closePath(); g.fillStyle = '#3b6fb0'; g.fill(); g.stroke(); g.restore();
    g.restore(); return;
  }
  if (fire > 0) { glow(g, 0, 70, 90 * fire, FIRE, 0.7 * fire); g.fillStyle = `rgba(255,220,120,${fire})`; g.beginPath(); g.moveTo(-14, 52); g.quadraticCurveTo(0, 52 + 70 * fire * (0.8 + 0.2 * Math.sin(t * 40)), 14, 52); g.fill(); }
  for (const sg of [-1, 1]) { g.beginPath(); g.moveTo(sg * 18, 20); g.lineTo(sg * 38, 54); g.lineTo(sg * 18, 46); g.closePath(); g.fillStyle = '#3b6fb0'; g.fill(); g.stroke(); }
  rr(g, -19, -40, 38, 92, 6); g.fillStyle = '#efe8d4'; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-19, -38); g.quadraticCurveTo(0, -86, 19, -38); g.closePath(); g.fillStyle = '#d0453a'; g.fill(); g.stroke();
  g.beginPath(); g.arc(0, -14, 9, 0, 7); g.fillStyle = '#5d8fd0'; g.fill(); g.stroke();
  g.fillStyle = '#2b2b38'; g.font = '700 11px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SAM', 0, 10); g.fillText('+ ME', 0, 24);
  g.restore();
}
function Sam(g, o, lt = {}) { return actor(g, { ...SAM, s: 0.62, ...o }, { amt: 0.25, dim: 0.06, ...lt }); }

// ---------------------------------------------------------------- KITCHEN (core place 1: opens and closes the film)
// people sit behind the table (front view); o.dawn
const K_F = 850, KT = [700, 1010, 1300];   // Sam, his seat, (spare)
function kitchen(g, t, o = {}) {
  g.fillStyle = '#131218'; g.fillRect(-500, -400, 3000, K_F + 400); g.fillStyle = '#0b0b10'; g.fillRect(-500, K_F, 3000, 700); ln(g, [-500, K_F, 2500, K_F]);
  g.strokeStyle = 'rgba(106,106,120,0.16)'; g.lineWidth = 2; g.beginPath(); for (let x = -480; x < 2500; x += 70) for (let y = 380; y < 560; y += 70) { g.rect(x, y, 70, 70); } g.stroke();
  // window (morning)
  const gr = g.createLinearGradient(0, 160, 0, 400); gr.addColorStop(0, '#1d1b33'); gr.addColorStop(1, o.night ? '#151a30' : '#5a3d4c'); g.fillStyle = gr; g.fillRect(820, 160, 300, 240);
  g.save(); g.beginPath(); g.rect(820, 160, 300, 240); g.clip(); skyline(g, 430, 820, 1120, 9, '#0b0a12'); g.restore(); g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(820, 160, 300, 240); ln(g, [970, 160, 970, 400], 5, '#2a2a36');
  if (!o.night) glow(g, 970, 300, 420, WARM, 0.1);
  // cabinets + stove (left), fridge (right)
  for (let x = 120; x < 700; x += 140) box(g, x, 140, 130, 190, '#17161e', 6);
  box(g, 100, 560, 620, 30, '#1d1b24'); box(g, 110, 590, 600, 260, '#15141b'); for (let x = 130; x < 700; x += 150) box(g, x, 610, 130, 210, '#18171f', 6);
  box(g, 360, 540, 120, 20, '#222029', 4); for (const x of [385, 455]) { g.strokeStyle = '#4a4856'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, 548, 22, 5, 0, 0, 7); g.stroke(); }
  box(g, 1480, 260, 230, 590, '#1a1a22', 12); ln(g, [1480, 470, 1710, 470]); ln(g, [1500, 300, 1500, 440], 6); ln(g, [1500, 500, 1500, 600], 6);
  // Sam's drawing on the fridge: two brothers and a rocket
  g.save(); g.translate(1600, 360); g.rotate(0.05); box(g, -62, -48, 124, 96, '#e9e2cf', 3);
  g.strokeStyle = '#d0453a'; g.lineWidth = 3; g.beginPath(); g.moveTo(30, 30); g.lineTo(30, -10); g.lineTo(40, -30); g.lineTo(50, -10); g.lineTo(50, 30); g.stroke();
  g.strokeStyle = '#3b6fb0'; for (const [cx, h] of [[-36, 34], [-8, 22]]) { g.beginPath(); g.arc(cx, 30 - h - 8, 8, 0, 7); g.moveTo(cx, 30 - h); g.lineTo(cx, 30); g.stroke(); } g.restore();
  // hanging lamp over the table
  ln(g, [1010, -300, 1010, 240]); g.beginPath(); g.moveTo(950, 290); g.lineTo(980, 240); g.lineTo(1040, 240); g.lineTo(1070, 290); g.closePath(); g.fillStyle = `rgba(255,205,140,${0.5 + 0.4 * (o.lamp ?? 1)})`; g.fill(); g.strokeStyle = LINE; g.stroke();
  glow(g, 1010, 290, 300, WARM, 0.3 * (o.lamp ?? 1)); pool(g, 1010, 740, 420, WARM, 0.18 * (o.lamp ?? 1));
  for (const x of [KT[0], KT[1]]) box(g, x - 56, 600, 112, 130, '#18171f', 12);
}
function kitchenTable(g, t, o = {}) {
  box(g, 560, 728, 620, 16, '#24212b'); box(g, 580, 744, 580, 106, '#18171f');
  if (o.cup !== false) { box(g, o.cupX ?? 760, 696, 30, 34, '#2c3a4a', 4); }
  if (o.paper) { g.save(); g.translate(1000, 722); g.rotate(-0.04); g.fillStyle = '#e9e2cf'; g.fillRect(-60, -6, 120, 8); if (o.spill) { g.fillStyle = 'rgba(232,140,40,0.9)'; g.beginPath(); g.ellipse(-10, -4, 60 * o.spill, 7, 0, 0, 7); g.fill(); } g.restore(); }
}

// ---------------------------------------------------------------- HALLWAY with his door (core place 2, the REPEATED SHOT)
// o.door: 0 shut .. 1 open; o.shake: picture frame tilt; o.rocketAtDoor; o.note
const HW_F = 850;
function hallway(g, t, o = {}) {
  g.fillStyle = '#14131a'; g.fillRect(-500, -400, 3000, HW_F + 400); g.fillStyle = '#0c0b10'; g.fillRect(-500, HW_F, 3000, 700); ln(g, [-500, HW_F, 2500, HW_F]);
  ln(g, [-500, 600, 2500, 600], 2, 'rgba(106,106,120,0.3)');
  for (const lx of [600, 1400]) { ln(g, [lx, -300, lx, 120]); g.beginPath(); g.arc(lx, 140, 28, 0, Math.PI); g.fillStyle = 'rgba(255,205,140,0.85)'; g.fill(); g.stroke(); glow(g, lx, 160, 380, WARM, 0.14); pool(g, lx, HW_F + 10, 380, WARM, 0.12); }
  // Sam's door (left, with a paper star)
  box(g, 180, 340, 200, 510, '#1b1a22'); g.beginPath(); g.arc(360, 600, 7, 0, 7); g.stroke();
  g.fillStyle = '#e0b84a'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? 12 : 28; g.lineTo(280 + Math.cos(a) * q, 430 + Math.sin(a) * q); } g.fill();
  // a family photo, tilts when the door slams
  g.save(); g.translate(900, 380); g.rotate(o.tilt || 0); box(g, -80, -60, 160, 120, '#1b1a22', 4); box(g, -66, -46, 132, 92, '#2a2733');
  for (const [px, pr, c] of [[-38, 14, '#A9A9B4'], [-6, 12, C.cream], [24, 9, '#C9A77A']]) { g.fillStyle = c; g.beginPath(); g.arc(px, -6, pr, 0, 7); g.fill(); g.fillRect(px - pr * 0.8, 6, pr * 1.6, 30); } g.restore();
  // HIS door (right). Opening = dark gap.
  const dx = 1300, dw = 220;
  box(g, dx - 10, 330, dw + 20, 520, '#0f0e14');
  const op = o.door || 0, w = dw * (1 - op * 0.82);
  g.fillStyle = '#211f29'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(dx, 340); g.lineTo(dx + w, 340 - op * 26); g.lineTo(dx + w, 850 + op * 26); g.lineTo(dx, 850); g.closePath(); g.fill(); g.stroke();
  if (op < 0.5) { g.beginPath(); g.arc(dx + w - 26, 600, 8, 0, 7); g.stroke(); g.strokeRect(dx + 30, 380, w - 60, 140); }
  if (o.notice) { g.save(); g.translate(dx + dw / 2 + (o.noticeX || 0), 600 + (o.noticeY || 0)); g.rotate(0.05); box(g, -70, -90, 140, 180, '#efe8d4', 3); g.fillStyle = '#b8322a'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PAST DUE', 0, -52); g.fillStyle = 'rgba(60,60,70,0.4)'; for (let i = 0; i < 5; i++) g.fillRect(-50, -20 + i * 18, 100 - i * 10, 6); g.fillStyle = '#2a2a33'; g.font = '700 22px Nunito'; g.fillText('RENT: $1,150', 0, 72); g.restore(); }
  if (o.sign === true && op < 0.3) { g.save(); g.translate(dx + dw / 2, 440); g.rotate(-0.04); box(g, -60, -24, 120, 48, '#d0453a', 4); g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('KEEP OUT', 0, 2); g.restore(); }
  if (o.rocketAtDoor) rocket(g, dx - 40, HW_F - 54, 0.9, o.rocketFall || 0, o.broken);
}

// ---------------------------------------------------------------- BASKETBALL COURT (one-off, returns once): dark gym, spot lights, a crowd
function court(g, t, o = {}) {
  g.fillStyle = '#100f15'; g.fillRect(-500, -400, 3000, 1000); g.fillStyle = '#1a1612'; g.fillRect(-500, 600, 3000, 900);
  // bleachers + crowd
  for (let row = 0; row < 3; row++) { box(g, -500, 330 + row * 80, 3000, 12, '#1d1b24'); }
  const q = rng(17);
  for (let row = 0; row < 3; row++) for (let x = -60 + row * 40; x < 2000; x += 120 + q() * 50) { const bob = Math.sin(t * 3 + x) * 3 * (o.cheer || 0.3); const cols = ['#5a5a66', '#6b5f52', '#4f5560']; g.fillStyle = cols[Math.floor(q() * 3)]; g.beginPath(); g.arc(x, 300 + row * 80 + bob, 20, 0, 7); g.fill(); g.fillRect(x - 22, 316 + row * 80 + bob, 44, 30); }
  ln(g, [-500, 600, 2500, 600], 3, '#4a3e30'); g.strokeStyle = 'rgba(200,170,120,0.25)'; g.lineWidth = 4; g.beginPath(); g.ellipse(960, 800, 300, 70, 0, 0, 7); g.moveTo(960, 600); g.lineTo(960, 1000); g.stroke();
  // hoop right
  box(g, 1700, 180, 20, 420, '#2a2832'); box(g, 1560, 170, 160, 110, '#e4e0d6', 4); g.strokeStyle = '#d0453a'; g.lineWidth = 4; g.strokeRect(1600, 205, 70, 50); g.beginPath(); g.ellipse(1580, 290, 44, 9, 0, 0, 7); g.stroke();
  for (const lx of [500, 1300]) { glow(g, lx, -40, 700, WARM, 0.16); pool(g, lx, 820, 520, WARM, 0.16); }
  // scoreboard
  box(g, 820, 100, 280, 110, '#0a0a0e', 8); g.fillStyle = '#ff9a3a'; g.font = '800 46px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.score || '42 : 44', 960, 158);
}
function ball(g, x, y, s = 1) { g.fillStyle = '#d97a2b'; g.strokeStyle = C.line; g.lineWidth = 3 * s; g.beginPath(); g.arc(x, y, 22 * s, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 22 * s, y); g.lineTo(x + 22 * s, y); g.moveTo(x, y - 22 * s); g.lineTo(x, y + 22 * s); g.stroke(); }

// ---------------------------------------------------------------- SCHOOL LOCKERS (one-off)
function lockers(g, t, o = {}) {
  g.fillStyle = '#121218'; g.fillRect(-500, -400, 3000, 1250); g.fillStyle = '#0c0c11'; g.fillRect(-500, 840, 3000, 600); ln(g, [-500, 840, 2500, 840]);
  for (let x = -400; x < 2400; x += 110) { box(g, x, 260, 104, 560, '#1a2029', 4); ln(g, [x + 20, 300, x + 84, 300], 2); ln(g, [x + 20, 316, x + 84, 316], 2); ln(g, [x + 80, 520, x + 80, 560], 4); }
  for (const lx of [300, 960, 1620]) { ln(g, [lx - 120, 120, lx + 120, 120], 8, 'rgba(200,215,240,0.8)'); glow(g, lx, 140, 500, COLD, 0.1); pool(g, lx, 850, 420, COLD, 0.08); }
}

// ---------------------------------------------------------------- PLAYGROUND (core place 4, comes back 3 times)
function playground(g, t, o = {}) {
  skyline(g, 600, -400, 2400, 21, '#0d0c14', [[0, '#0a0a14'], [0.7, '#1c1726'], [1, '#2b1f2c']]);
  g.fillStyle = '#0c0b10'; g.fillRect(-500, 600, 3000, 900); ln(g, [-500, 600, 2500, 600], 2, 'rgba(106,106,120,0.4)');
  g.fillStyle = '#111017'; g.beginPath(); g.moveTo(-500, 860); g.lineTo(2500, 860); g.lineTo(2500, 760); g.lineTo(-500, 760); g.fill(); ln(g, [-500, 760, 2500, 760], 2, 'rgba(106,106,120,0.5)'); ln(g, [-500, 860, 2500, 860], 2, 'rgba(106,106,120,0.5)');
  for (const [x, r] of [[180, 150], [420, 110], [1620, 160], [1880, 120]]) { g.fillStyle = '#0e0d14'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.arc(x, 520 - r * 0.6, r, 0, 7); g.fill(); g.stroke(); ln(g, [x, 600, x, 520]); }
  // slide + swing (left)
  g.strokeStyle = '#4a4856'; g.lineWidth = 7; g.beginPath(); g.moveTo(200, 790); g.lineTo(240, 470); g.moveTo(330, 790); g.lineTo(300, 470); g.moveTo(230, 560); g.lineTo(310, 560); g.moveTo(225, 640); g.lineTo(318, 640); g.stroke();
  g.lineWidth = 14; g.strokeStyle = '#3d5a7a'; g.beginPath(); g.moveTo(300, 470); g.quadraticCurveTo(520, 520, 600, 790); g.stroke();
  g.strokeStyle = '#4a4856'; g.lineWidth = 7; g.beginPath(); g.moveTo(1560, 790); g.lineTo(1620, 430); g.lineTo(1840, 430); g.lineTo(1900, 790); g.stroke();
  for (const sx of [1680, 1780]) { const sw = Math.sin(t * 1.4 + sx) * 0.08; ln(g, [sx, 430, sx + Math.sin(sw) * 220, 430 + 220], 2.5, '#6a6a78'); box(g, sx + Math.sin(sw) * 220 - 26, 650, 52, 10, '#2a2832'); }
  lampPost(g, 1440, 760, 520, o.lamp ?? 1);
  // bench (Grandpa sits at 1060)
  box(g, 820, 606, 460, 18, '#211e28', 6); box(g, 820, 636, 460, 18, '#211e28', 6); box(g, 806, 712, 488, 20, '#24212b', 6);
  ln(g, [840, 732, 840, 772], 6); ln(g, [1260, 732, 1260, 772], 6); ln(g, [850, 654, 850, 712], 6); ln(g, [1250, 654, 1250, 712], 6);
}
const BENCH = [1060, 712], PG_F = 812;
function benchFront(g) { box(g, 806, 708, 488, 22, '#24212b', 6); }

// ---------------------------------------------------------------- HIS ROOM (core place 3)
function heroRoom(g, t, o = {}) {
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, 1150); g.fillStyle = '#0b0b10'; g.fillRect(-500, 740, 3000, 700); ln(g, [-500, 740, 2500, 740]);
  // poster + window
  box(g, 560, 230, 170, 230, '#191822', 4); g.strokeStyle = '#6a6a78'; g.globalAlpha = 0.6; g.lineWidth = 6; g.beginPath(); g.arc(645, 330, 50, 0, 7); g.stroke(); g.beginPath(); g.arc(645, 330, 20, 0, 7); g.stroke(); g.globalAlpha = 1;
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
  if (o.screen) { box(g, 1290, 470, 220, 120, '#0a0c14', 6); glow(g, 1400, 530, 200 * o.screen, COLD, 0.25 * o.screen); g.fillStyle = `rgba(120,150,220,${0.5 * o.screen})`; g.fillRect(1302, 482, 196, 96); if (o.lose) { g.fillStyle = '#ff5a4a'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('YOU LOSE', 1400, 530); } }
  if (o.rocket) rocket(g, o.rocket[0], o.rocket[1], o.rocket[2] || 1, 0, o.broken);
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
    g.beginPath(); g.moveTo(300, 680); g.quadraticCurveTo(330, 610, 430, 612); g.quadraticCurveTo(640, 604, 850, 650); g.lineTo(858, 700); g.lineTo(300, 706); g.closePath(); g.fillStyle = '#1e1e2b'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
    return { head: [hx, hy] };
  }
}

// ---------------------------------------------------------------- BUS (one-off)

// ---------------------------------------------------------------- reflection + notepad
function windowRefl(g, t, o = {}) {
  g.fillStyle = '#0e0e15'; g.fillRect(-300, -300, 2600, 1700);
  box(g, 420, 110, 1080, 840, '#0a0c18');
  g.save(); g.beginPath(); g.rect(432, 122, 1056, 816); g.clip();
  skyline(g, 760, 300, 1700, 12, '#06070d', [[0, '#05060c'], [1, '#141830']]);
  g.globalAlpha = 0.5;
  if (o.demon > 0) demon(g, { x: 1240, y: 1500, s: 3.0, face: { look: [-0.6, 0.2], smile: 0.7 }, headOff: [0, Math.sin(t * 1.3) * 4] }, { t, a: o.demon, glow: 24 });
  const r = actor(g, { x: 900, y: 1430, s: 2.3, headOff: [0, (o.down || 0) * 14], face: { look: [0, 0.3], sad: 0.6, smile: -0.1, blink: blink(t, 0.4) }, ...(o.pose || {}) }, { dir: -1, amt: 0.2, dim: 0.25 });
  if (o.fuse) fuse(g, r, 2.3, o.fuse, t, o.lit ?? 0);
  if (o.stub) fuse(g, r, 2.3, 0.05, t, 0);
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


// shared bits for the bed-edge shots
const SIT = [520, 660], SS = 0.93;
function controller(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -24 * s, -12 * s, 48 * s, 24 * s, 10 * s); g.fillStyle = '#20232c'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2.5 * s; g.stroke(); g.fillStyle = '#d0453a'; g.beginPath(); g.arc(12 * s, -2 * s, 3.5 * s, 0, 7); g.fill(); g.restore(); }
function onBed(g, t, o = {}) {
  heroRoom(g, t, { under: o.under ?? 0.5, lamp: o.lamp, screen: o.screen, lose: o.lose, rocket: o.rocket, broken: o.broken });
  if (o.demon) demonAt(g, t, SIT[0] + (o.dx ?? 280), o.dy ?? 742, o.demon, o.dtext, o.da ?? 1, { a: o.dA ?? 1, tx: o.tx ?? 230, ty: o.ty ?? 10, lean: -0.1, face: { look: [-0.8, 0.4], smile: 0.7 } });
  const r = Hero(g, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: SS, face: { look: [0.6, 0.2], sad: -0.5, smile: -0.1, blink: blink(t, 0.6) }, ...(o.hero || {}) }, { dir: 1, amt: 0.35, dim: 0.1 });
  bedFront(g);
  return r;
}
function bedFront(g) { rr(g, 160, 664, 700, 62, 22); g.fillStyle = '#191922'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke(); }


// ---------------------------------------------------------------- people bits
const LOSS = '#9aa3ad';
function vest(g, r, s) {   // warehouse supervisor: orange safety vest with reflective stripes
  const x = r.neck[0], y = r.neck[1] + 8 * s, h = r.hip[1] - y + 6 * s;
  g.save(); rr(g, x - 46 * s, y, 92 * s, h, 18 * s); g.fillStyle = '#e8792b'; g.globalAlpha = 0.95; g.fill(); g.globalAlpha = 1; g.strokeStyle = C.line; g.lineWidth = 2 * s; g.stroke();
  g.fillStyle = '#e9e6d6'; g.fillRect(x - 46 * s, y + h * 0.45, 92 * s, 7 * s); g.fillRect(x - 46 * s, y + h * 0.7, 92 * s, 7 * s); g.restore();
}
function tie(g, r, s) { const x = r.neck[0], y = r.neck[1] + 6 * s; g.fillStyle = '#2f4f7a'; g.strokeStyle = C.line; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x - 7 * s, y); g.lineTo(x + 7 * s, y); g.lineTo(x + 9 * s, y + 60 * s); g.lineTo(x, y + 72 * s); g.lineTo(x - 9 * s, y + 60 * s); g.closePath(); g.fill(); g.stroke(); }
function phoneAt(g, x, y, s, lit = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -13 * s, -24 * s, 26 * s, 46 * s, 5 * s); g.fillStyle = '#0a0a0e'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2; g.stroke(); if (lit > 0) { g.fillStyle = `rgba(${GREEN},${0.55 * lit})`; g.fillRect(-10 * s, -20 * s, 20 * s, 38 * s); } g.restore(); if (lit > 0) glow(g, x, y, 46 * s, GREEN, 0.28 * lit); }
function hoodBall(g, x, y, s = 1, dust = 0) {
  g.fillStyle = '#c86f2b'; g.strokeStyle = C.line; g.lineWidth = 3 * s; g.beginPath(); g.arc(x, y, 26 * s, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x - 26 * s, y); g.lineTo(x + 26 * s, y); g.moveTo(x, y - 26 * s); g.lineTo(x, y + 26 * s); g.moveTo(x - 18 * s, y - 18 * s); g.quadraticCurveTo(x, y, x - 18 * s, y + 18 * s); g.moveTo(x + 18 * s, y - 18 * s); g.quadraticCurveTo(x, y, x + 18 * s, y + 18 * s); g.stroke();
  if (dust > 0) { g.fillStyle = `rgba(150,150,160,${0.55 * dust})`; g.beginPath(); g.arc(x, y, 26 * s, Math.PI * 1.05, Math.PI * 1.95); g.fill(); ln(g, [x - 40 * s, y - 34 * s, x - 20 * s, y - 40 * s], 1.5, `rgba(160,160,170,${0.6 * dust})`); }
}
function coin(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.scale(Math.abs(Math.cos(rot)) * 0.8 + 0.2, 1); g.fillStyle = '#2BD96B'; g.strokeStyle = '#0b5a2a'; g.lineWidth = 3 * s; g.beginPath(); g.arc(0, 0, 22 * s, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#0b5a2a'; g.font = `800 ${26 * s}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 2 * s); g.restore(); }
function demonText2(g, text, x, y, t, a, size) { demonText(g, text, x, y, t, a, size); }

// ---------------------------------------------------------------- APARTMENT living room (core place 1, opens and closes the film)
// couch faces the camera; the TV is a dark silhouette in the near left corner, its cold light on them
const AP_F = 840, COUCH = [800, 980, 1160];
function apartment(g, t, o = {}) {
  const F = AP_F;
  g.fillStyle = '#141319'; g.fillRect(-500, -400, 3000, F + 400); g.fillStyle = '#0b0b10'; g.fillRect(-500, F, 3000, 700); ln(g, [-500, F, 2500, F]);
  // window (right) + posters
  box(g, 1420, 200, 260, 260, '#0b0d1c'); g.save(); g.beginPath(); g.rect(1420, 200, 260, 260); g.clip(); skyline(g, 470, 1420, 1700, 33, '#07080f'); g.restore(); g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(1420, 200, 260, 260); glow(g, 1550, 330, 360, '90,100,160', 0.08);
  box(g, 560, 220, 150, 190, '#1b1a22', 4); g.fillStyle = '#2f4f7a'; g.fillRect(578, 238, 114, 154); g.fillStyle = '#e9e2cf'; g.font = '800 54px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('23', 635, 320);
  box(g, 760, 250, 220, 140, '#1b1a22', 4); g.fillStyle = '#2a2733'; g.fillRect(774, 264, 192, 112); g.strokeStyle = 'rgba(200,170,120,0.5)'; g.lineWidth = 3; g.beginPath(); g.arc(870, 320, 40, 0, 7); g.moveTo(830, 320); g.lineTo(910, 320); g.stroke();
  // couch
  box(g, 650, 560, 660, 150, '#1c1b26', 30); box(g, 650, 690, 660, 64, '#1f1e2a', 16); box(g, 616, 610, 62, 170, '#1f1e2a', 24); box(g, 1282, 610, 62, 170, '#1f1e2a', 24);
  ln(g, [890, 575, 890, 690], 2, 'rgba(106,106,120,0.5)'); ln(g, [1070, 575, 1070, 690], 2, 'rgba(106,106,120,0.5)');
  // the basketball in the corner
  hoodBall(g, 1770, F - 26, 1, o.dust ?? 1);
  if (o.behind) o.behind();
}
function apFront(g, t, o = {}) {
  box(g, 666, 700, 628, 52, '#22212d', 14);
  // coffee table + pizza + phones
  box(g, 700, 788, 560, 14, '#24212b'); ln(g, [720, 802, 720, AP_F + 30], 4); ln(g, [1240, 802, 1240, AP_F + 30], 4);
  box(g, 760, 770, 150, 18, '#c9a46a', 3); g.fillStyle = '#d08a3a'; g.beginPath(); g.moveTo(1000, 786); g.lineTo(1060, 770); g.lineTo(1080, 786); g.fill();
  if (o.facedown) for (const x of [1120, 1160, 1200]) { box(g, x - 16, 780, 32, 8, '#0a0a0e', 2); }
  // the TV, near left corner (its back to us) + its cold light
  const fl = 0.85 + 0.15 * Math.sin(t * 5) * Math.sin(t * 2.1);
  box(g, 80, 600, 380, 230, '#08080b', 10); box(g, 230, 830, 80, 40, '#08080b'); glow(g, 470, 700, 420, COLD, 0.16 * fl); glow(g, 900, 640, 600, COLD, 0.06 * fl);
}

// ---------------------------------------------------------------- WAREHOUSE break room (one-off, returns once)
const WH_F = 850;
function warehouse(g, t, o = {}) {
  g.fillStyle = '#121218'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0c0c11'; g.fillRect(-500, WH_F, 3000, 600); ln(g, [-500, WH_F, 2500, WH_F]);
  // high shelves with boxes
  for (let x = -300; x < 2400; x += 420) { ln(g, [x, 120, x, WH_F], 6, '#3a3846'); ln(g, [x + 380, 120, x + 380, WH_F], 6, '#3a3846'); for (const y of [300, 520, 720]) { ln(g, [x, y, x + 380, y], 5, '#3a3846'); const q = rng(x + y); let bx = x + 12; while (bx < x + 360) { const w = 60 + q() * 50, h = 50 + q() * 60; box(g, bx, y - h, w, h, '#2b2620', 2); bx += w + 8; } } }
  for (const lx of [400, 1100, 1800]) { ln(g, [lx, -300, lx, 60]); g.beginPath(); g.moveTo(lx - 60, 90); g.lineTo(lx + 60, 90); g.lineTo(lx + 30, 60); g.lineTo(lx - 30, 60); g.closePath(); g.fillStyle = 'rgba(200,215,240,0.8)'; g.fill(); glow(g, lx, 110, 520, COLD, 0.12); pool(g, lx, WH_F, 480, COLD, 0.1); }
  // vending machine (left) + break table (center)
  box(g, 140, 430, 200, 420, '#1a1a24', 10); for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) box(g, 164 + c * 52, 460 + r * 60, 40, 44, ['#5a2b2b', '#2b4a5a', '#5a5a2b'][(r + c) % 3], 4); glow(g, 240, 560, 220, COLD, 0.14);
  box(g, 820, 690, 520, 16, '#2a2832'); ln(g, [850, 706, 850, WH_F]); ln(g, [1310, 706, 1310, WH_F]);
}

// ---------------------------------------------------------------- ATM wall at night (one-off)
function atmStreet(g, t, o = {}) {
  skyline(g, 400, -400, 2400, 51, '#0d0c14', [[0, '#0a0a14'], [1, '#1c1726']]);
  g.fillStyle = '#16151d'; g.fillRect(-500, 360, 3000, 520); g.strokeStyle = 'rgba(106,106,120,0.2)'; g.lineWidth = 2; for (let y = 380; y < 860; y += 40) { g.beginPath(); g.moveTo(-500, y); g.lineTo(2500, y); g.stroke(); }
  g.fillStyle = '#0c0b10'; g.fillRect(-500, 860, 3000, 600); ln(g, [-500, 860, 2500, 860]);
  box(g, 820, 400, 280, 320, '#22212b', 10); const ok = o.screen || 'ENTER AMOUNT';
  box(g, 860, 430, 200, 130, ok === 'INSUFFICIENT FUNDS' ? '#2a1414' : '#0f2a1a', 4); glow(g, 960, 495, 220, ok === 'INSUFFICIENT FUNDS' ? '255,120,100' : GREEN, 0.18);
  g.fillStyle = '#e9f5ec'; g.font = '800 20px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; const ws = ok.split(' '); if (ws.length > 1) { g.fillText(ws[0], 960, 480); g.fillText(ws.slice(1).join(' '), 960, 508); } else g.fillText(ok, 960, 495);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) box(g, 880 + c * 34, 590 + r * 30, 26, 22, '#3a3846', 3); box(g, 1000, 600, 70, 10, '#0a0a0e');
  g.fillStyle = '#2BD96B'; g.font = '800 34px Nunito'; g.fillText('ATM', 960, 380 + 0);
  lampPost(g, 1500, 860, 520, 0.8); lampPost(g, 300, 860, 520, 0.6);
}

// ---------------------------------------------------------------- USED CAR LOT at night (one-off: the twist)
function car(g, x, y, s, col, sign) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = C.line; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-170, -20); g.lineTo(-150, -60); g.lineTo(-90, -64); g.lineTo(-50, -110); g.lineTo(70, -110); g.lineTo(120, -64); g.lineTo(165, -56); g.lineTo(175, -20); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#1a2230'; g.beginPath(); g.moveTo(-40, -100); g.lineTo(0, -100); g.lineTo(0, -68); g.lineTo(-72, -68); g.closePath(); g.fill(); g.beginPath(); g.moveTo(12, -100); g.lineTo(64, -100); g.lineTo(100, -68); g.lineTo(12, -68); g.closePath(); g.fill();
  for (const wx of [-100, 110]) { g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(wx, -18, 30, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#555'; g.beginPath(); g.arc(wx, -18, 12, 0, 7); g.fill(); }
  if (sign) { box(g, -40, -96, 80, 40, '#efe8d4', 3); g.fillStyle = '#b8322a'; g.font = '800 15px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sign, 0, -76); }
  g.restore();
}
function carLot(g, t, o = {}) {
  skyline(g, 520, -400, 2400, 61, '#0d0c14', [[0, '#0a0a14'], [1, '#22192a']]);
  g.fillStyle = '#0e0d13'; g.fillRect(-500, 520, 3000, 900); ln(g, [-500, 520, 2500, 520], 2, 'rgba(106,106,120,0.4)');
  for (let x = -400; x < 2400; x += 220) ln(g, [x, 860, x + 120, 700], 2, 'rgba(106,106,120,0.25)');
  // string of flags + small office
  g.strokeStyle = '#4a4856'; g.lineWidth = 2; g.beginPath(); g.moveTo(-100, 300); g.quadraticCurveTo(500, 380, 1100, 300); g.quadraticCurveTo(1600, 380, 2100, 300); g.stroke();
  for (let i = 0; i < 24; i++) { const x = -60 + i * 90, y = 300 + Math.sin((x + 100) / 1200 * Math.PI) * 60 + 6; g.fillStyle = ['#b8322a', '#2f4f7a', '#d9a657'][i % 3]; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 26, y); g.lineTo(x + 13, y + 30); g.fill(); }
  box(g, 1500, 430, 360, 260, '#1a1922', 6); box(g, 1540, 470, 120, 90, '#3a3020'); glow(g, 1600, 515, 200, WARM, 0.25); g.fillStyle = '#d9a657'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('USED CARS', 1680, 455);
  lampPost(g, 400, 860, 560, 0.8); lampPost(g, 1300, 860, 560, 0.7);
  car(g, 200, 760, 0.9, '#3a3a46', '$6,900'); car(g, 1500, 800, 0.95, '#4a3a3a', '$4,200');
}

// ---------------------------------------------------------------- APARTMENT STEPS at night (one-off: the truth)
function steps2(g, t, o = {}) {
  g.fillStyle = '#151419'; g.fillRect(-500, -400, 3000, 1300); g.strokeStyle = 'rgba(106,106,120,0.2)'; g.lineWidth = 2; for (let y = -380; y < 900; y += 40) { g.beginPath(); g.moveTo(-500, y + ((y / 40) % 2) * 0); g.lineTo(2500, y); g.stroke(); }
  box(g, 820, 220, 280, 500, '#1c1a22'); box(g, 840, 240, 240, 480, '#26232c'); g.beginPath(); g.arc(1060, 480, 7, 0, 7); g.stroke();
  ln(g, [960, 120, 960, 170]); g.beginPath(); g.arc(960, 180, 22, 0, Math.PI); g.fillStyle = 'rgba(255,205,140,0.9)'; g.fill(); glow(g, 960, 200, 520, WARM, 0.2);
  for (let i = 0; i < 4; i++) box(g, 560 - i * 30, 720 + i * 50, 800 + i * 60, 50, '#1e1c25');
  g.fillStyle = '#0c0b10'; g.fillRect(-500, 920, 3000, 600);
}
// ---------------------------------------------------------------- OUTDOOR COURT (core place 4: empty -> full)
const OC_F = 840;
function outCourt(g, t, o = {}) {
  skyline(g, 520, -400, 2400, 71, '#0d0c14', [[0, o.dusk ? '#1d1830' : '#0a0a14'], [0.7, o.dusk ? '#4a2f3e' : '#1c1726'], [1, o.dusk ? '#7a4a40' : '#2b1f2c']]);
  g.fillStyle = '#17151b'; g.fillRect(-500, 520, 3000, 900);
  g.strokeStyle = 'rgba(200,190,170,0.25)'; g.lineWidth = 4; g.beginPath(); g.ellipse(960, 900, 360, 70, 0, 0, 7); g.moveTo(-500, 760); g.lineTo(2500, 760); g.stroke();
  // chain-link fence
  g.strokeStyle = 'rgba(106,106,120,0.35)'; g.lineWidth = 1.5; for (let x = -500; x < 2500; x += 34) { g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 220, 520); g.moveTo(x + 220, 300); g.lineTo(x, 520); g.stroke(); } ln(g, [-500, 300, 2500, 300], 4, '#3a3846');
  // hoop (right)
  box(g, 1680, 230, 18, 610, '#2a2832'); box(g, 1540, 220, 160, 110, '#d9d4c8', 4); g.strokeStyle = '#2BD96B'; g.globalAlpha = 0; g.globalAlpha = 1; g.strokeStyle = '#b8483a'; g.lineWidth = 4; g.strokeRect(1580, 252, 70, 50); g.beginPath(); g.ellipse(1560, 340, 44, 9, 0, 0, 7); g.stroke();
  g.strokeStyle = 'rgba(230,230,230,0.6)'; g.lineWidth = 2; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(1560 + i * 13, 340); g.lineTo(1560 + i * 9, 395); g.stroke(); }
  lampPost(g, 300, 840, 560, o.lamp ?? 1);
}

// ---------------------------------------------------------------- PHONE POV (hand + phone; o.draw paints the screen)
function phonePOV(g, t, o) {
  const u = seg(t, o.t0, o.t1);
  noCam(g); g.fillStyle = '#0b0c0e'; g.fillRect(0, 0, W, H);
  const q = rng(o.seed || 3); for (let i = 0; i < 7; i++) glow(g, q() * W, q() * H, 200 + q() * 260, '40,70,55', 0.1);
  let sh = 0; for (const b of o.buzz || []) if (t >= b && t < b + 0.35) sh = Math.sin((t - b) * 95) * 6 * (1 - (t - b) / 0.35);
  setCam(g, { x: 960 - sh, y: 540 + Math.sin(t * 0.9) * 4 + (o.dy || 0), z: lerp(1, 1.06, ease(u)) * (o.zoom || 1) });
  glow(g, 960, 480, 640, GREEN, 0.12 * (o.glow ?? 1));
  for (const dark of [true, false]) { g.strokeStyle = g.fillStyle = dark ? C.line : C.cream; g.lineCap = 'round'; g.lineWidth = 210 + (dark ? 14 : 0); g.beginPath(); g.moveTo(1220, 800); g.lineTo(1800, 1120); g.stroke(); g.beginPath(); g.ellipse(1130, 700, 150 + (dark ? 7 : 0), 185 + (dark ? 7 : 0), 0.25, 0, 7); g.fill(); }
  const px = 760, py = 84, pw = 400, ph = 740;
  rr(g, px, py, pw, ph, 50); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.fillStyle = '#0f1412'; g.fill();
  g.save(); rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.clip(); o.draw(g, px, py, pw, ph, t); g.restore();
  if (o.thumb) { const th = o.thumb(t); for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(th[0], th[1], 46 + (dark ? 7 : 0), 108 + (dark ? 7 : 0), -0.42, 0, 7); g.fill(); } }
}
// the betting app screen. o: {home, away, sh, sa, clock, amount, pick, state: 'bet'|'live'|'won'|'lost', at (result time), double}
function betApp(o) {
  return (g, px, py, pw, ph, t) => {
    const cx = px + pw / 2;
    g.fillStyle = '#0b1610'; g.fillRect(px, py, pw, ph);
    g.fillStyle = '#12261a'; g.fillRect(px, py, pw, 110); g.fillStyle = ACC; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LuckyLine', cx, py + 70);
    rr(g, px + 34, py + 140, pw - 68, 190, 18); g.fillStyle = '#16241c'; g.fill();
    g.fillStyle = '#cfe9d8'; g.font = '700 26px Nunito'; g.fillText(o.home, cx - 80, py + 180); g.fillText(o.away, cx + 80, py + 180); g.fillStyle = '#7f9a88'; g.font = '600 20px Nunito'; g.fillText('vs', cx, py + 180);
    g.fillStyle = '#fff'; g.font = '800 54px Nunito'; g.fillText((typeof o.sh === 'function' ? o.sh(t) : o.sh) + '  -  ' + (typeof o.sa === 'function' ? o.sa(t) : o.sa), cx, py + 250);
    if (o.clock) { g.fillStyle = '#ff7a5a'; g.font = '700 22px Nunito'; g.fillText((o.state === 'live' ? 'LIVE  ' : '') + (typeof o.clock === 'function' ? o.clock(t) : o.clock), cx, py + 304); }
    g.fillStyle = '#7f9a88'; g.font = '600 22px Nunito'; g.fillText('YOUR BET', cx, py + 380);
    g.fillStyle = '#fff'; const bt = '$' + o.amount + ' on ' + o.pick; g.font = `800 ${bt.length > 14 ? 36 : 46}px Nunito`; g.fillText(bt, cx, py + 430);
    const pressed = o.press && t > o.press && t < o.press + 0.2;
    rr(g, px + 60, py + 500, pw - 120, 76, 38); g.fillStyle = o.state === 'bet' ? (pressed ? '#20a852' : ACC) : '#1d3326'; g.fill();
    g.fillStyle = o.state === 'bet' ? '#06150c' : '#6f8a78'; g.font = '800 30px Nunito'; g.fillText(o.all ? 'ALL IN' : (o.state === 'bet' ? 'PLACE BET' : 'BET PLACED'), cx, py + 539);
    if ((o.state === 'won' || o.state === 'lost') && t > o.at) {
      const k = ease(seg(t, o.at, o.at + 0.3)); g.save(); g.globalAlpha = k; g.fillStyle = o.state === 'won' ? 'rgba(10,40,20,0.92)' : 'rgba(18,18,22,0.94)'; g.fillRect(px, py, pw, ph);
      g.translate(cx, py + 330); g.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k);
      g.fillStyle = o.state === 'won' ? ACC : LOSS; g.font = '800 58px Nunito'; g.fillText(o.state === 'won' ? 'YOU WON' : 'YOU LOST', 0, -40); g.font = '800 76px Nunito'; g.fillText((o.state === 'won' ? '+$' : '-$') + o.result, 0, 50);
      if (o.double && t > o.double[0]) { rr(g, -130, 140, 260, 70, 35); g.fillStyle = t > o.double[1] && t < o.double[1] + 0.2 ? '#20a852' : ACC; g.fill(); g.fillStyle = '#06150c'; g.font = '800 28px Nunito'; g.fillText('DOUBLE IT?', 0, 176); }
      g.restore();
      if (o.state === 'won') { const q = rng(4); for (let i = 0; i < 14; i++) { const ph_ = (t - o.at) * 0.8 + q(); coin(g, px + 40 + q() * (pw - 80), py + ((ph_ % 1) * ph), 0.9, t * 4 + i); } }
    }
  };
}
// chat screen. msgs: [{who:'s'|'r', text, at}]
function chatApp(name, msgs) {
  return (g, px, py, pw, ph, t) => {
    g.fillStyle = '#10131a'; g.fillRect(px, py, pw, ph); g.fillStyle = '#171b25'; g.fillRect(px, py, pw, 118);
    g.fillStyle = '#C9A77A'; g.beginPath(); g.arc(px + 62, py + 72, 25, 0, 7); g.fill(); g.fillStyle = '#2f4f7a'; g.beginPath(); g.arc(px + 62, py + 72, 26, Math.PI * 1.1, Math.PI * 1.9); g.fill();
    g.fillStyle = '#fff'; g.font = '700 32px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(name, px + 104, py + 72);
    let y = py + 160;
    for (const m of msgs) {
      if (t < m.at) break;
      if (m.typing) { if (t < m.until) { g.fillStyle = '#272c38'; rr(g, px + 30, y, 90, 50, 25); g.fill(); g.fillStyle = '#9aa'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(px + 55 + i * 20, y + 25 + Math.sin(t * 8 + i) * 3, 5, 0, 7); g.fill(); } } continue; }
      const pop = ease(seg(t, m.at, m.at + 0.22)); g.font = '400 28px Nunito';
      const lines = wrap(g, m.text, 250), bw = Math.max(...lines.map(l => g.measureText(l).width)) + 40, bh = lines.length * 36 + 26;
      const bx = m.who === 'r' ? px + 30 : px + pw - 30 - bw;
      g.save(); g.globalAlpha = pop; rr(g, bx, y, bw, bh, 22); g.fillStyle = m.who === 'r' ? '#272c38' : '#1f6b3d'; g.fill(); g.fillStyle = '#fff'; g.textAlign = 'left';
      lines.forEach((l, i) => g.fillText(l, bx + 20, y + 13 + 18 + i * 36)); g.restore(); y += bh + 14;
    }
  };
}
function wrap(g, text, max) { const out = []; let cur = ''; for (const w of text.split(' ')) { const n = cur ? cur + ' ' + w : w; if (g.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; } out.push(cur); return out; }
// the counter (top-left)
function lost(g, v, a = 1) { hud(g, 'LOST', '$' + Math.round(v).toLocaleString('en-US'), a); }
// green glow on a lying face (the repeated bed shot)
function bedGlow(g, t, k) { const fl = 0.85 + 0.15 * Math.sin(t * 6) * Math.sin(t * 2.3); glow(g, 352, 616, 60 + 140 * k, GREEN, (0.3 + 0.3 * k) * fl); glow(g, 352, 616, 22, '200,255,220', 0.55 * fl); g.fillStyle = '#0a0a0e'; g.strokeStyle = `rgba(${GREEN},0.9)`; g.lineWidth = 2; rr(g, 338, 596, 14, 40, 3); g.fill(); g.stroke(); pool(g, 380, 716, 180 + 200 * k, GREEN, 0.1 + 0.15 * k); }
// the money lost, on the film's clock
const LOSTK = [[0, 0], [34, 0], [34.3, 80], [38.2, 80], [38.5, 300], [43, 300], [43.3, 600], [49.6, 600], [49.9, 900], [53, 900], [53.3, 1500], [54.2, 1500], [54.5, 1900], [59.2, 1900], [59.5, 2600], [83.6, 2600], [83.9, 8400],
  [140, 8400], [144.2, 6100], [146.6, 6100], [146.9, 6200], [155.6, 6200], [159.8, 2300], [176, 2300], [178.5, 0]];
const lostAt = t => kf(t, LOSTK);
function counter(g, t) { const v = lostAt(t); if (v > 0) lost(g, v); else if (t > 177) hud(g, 'LOST', '$0', 1); }
function eyes(g, k) { if (k <= 0) return; g.strokeStyle = `rgba(80,60,90,${k})`; g.lineWidth = 2.4; for (const dy of [9, 14]) { g.beginPath(); g.arc(288, 606 + dy, 8, 0.4, Math.PI - 0.4); g.stroke(); } }
// the phone's home screen: o.del = [longPress, tapDelete]
function homeApp(o) {
  return (g, px, py, pw, ph, t) => {
    const gr = g.createLinearGradient(px, py, px, py + ph); gr.addColorStop(0, '#1a1f2e'); gr.addColorStop(1, '#0d1018'); g.fillStyle = gr; g.fillRect(px, py, pw, ph);
    g.fillStyle = '#fff'; g.font = '600 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('11:48 PM', px + pw / 2, py + 50);
    const cols = ['#3b6fb0', '#d0453a', '#8a5ac8', '#e0b84a', '#4aa3a3', '#c86f2b', '#6a6a78', '#3a8a5a'], gone = t > o.del[1] + 0.25, jig = t > o.del[0] && !gone;
    for (let i = 0; i < 16; i++) {
      const c = i % 4, r = Math.floor(i / 4), x = px + 52 + c * 82, y = py + 110 + r * 100;
      g.save(); g.translate(x + 30, y + 30); if (jig) g.rotate(Math.sin(t * 30 + i) * 0.06);
      if (i === 5) { if (!gone) { const k = t > o.del[1] ? 1 - seg(t, o.del[1], o.del[1] + 0.25) : 1; g.scale(k, k); rr(g, -30, -30, 60, 60, 14); g.fillStyle = '#12261a'; g.fill(); g.strokeStyle = ACC; g.lineWidth = 3; g.stroke(); g.fillStyle = ACC; g.font = '800 34px Nunito'; g.fillText('$', 0, 2); glow(g, 0, 0, 60, GREEN, 0.3); } }
      else { rr(g, -30, -30, 60, 60, 14); g.fillStyle = cols[i % 8]; g.fill(); }
      g.restore();
    }
    if (t > o.del[0] + 0.5 && !gone) {
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(px, py, pw, ph); rr(g, px + 40, py + 260, pw - 80, 230, 24); g.fillStyle = '#232838'; g.fill();
      g.fillStyle = '#fff'; g.font = '700 28px Nunito'; g.fillText('Delete "LuckyLine"?', px + pw / 2, py + 320); g.fillStyle = '#9aa3ad'; g.font = '400 20px Nunito'; g.fillText('This will remove the app.', px + pw / 2, py + 360);
      rr(g, px + 70, py + 400, pw - 140, 62, 31); g.fillStyle = t > o.del[1] - 0.15 ? '#ff6a5a' : '#d0453a'; g.fill(); g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.fillText('Delete App', px + pw / 2, py + 431);
    }
    if (gone) { const k = seg(t, o.del[1] + 0.25, o.del[1] + 0.8); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(200,200,210,${0.5 * (1 - k)})`; g.beginPath(); g.arc(px + 164 + Math.cos(i) * 40 * k * 2, py + 240 + Math.sin(i) * 40 * k * 2, 10 * (1 - k) + 2, 0, 7); g.fill(); } }
  };
}
