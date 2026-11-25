// SHORT FUSE - shared world. The habit: anger. The symbol: a FUSE on top of his head.
// Every small thing lights it; when the spark reaches his head he explodes. Each new fuse is shorter.
// The object that comes back: Sam's paper rocket (a gift -> broken in the blast -> launched together).
const ACC = '#FFB21E', FIRE = '255,178,30';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235';
const MOM = { col: '#A9A9B4', acc: 'longhair', accCol: '#2e2a33' }, SAM = { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' };
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
  if (o.sign !== false && op < 0.3) { g.save(); g.translate(dx + dw / 2, 440); g.rotate(-0.04); box(g, -60, -24, 120, 48, '#d0453a', 4); g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('KEEP OUT', 0, 2); g.restore(); }
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
