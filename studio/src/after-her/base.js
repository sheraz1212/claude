// AFTER HER - shared world. FIRST FILM IN THE NEW COLOUR THEME (warm, coloured rooms, daylight, sunsets) + NARRATION
// (captions = the narrator's lines; the voice is added by the owner). The struggle: he can't let go after a breakup.
// The symbol: HER MEMORY - a soft pink, see-through version of her that sits beside him everywhere; it fades as he heals.
// HUD: DAYS SINCE 1 -> 90. Turn: his dad's old photo - his own first heartbreak. Recovery mirrors the fall.
const ACC = '#FF7A9A', HL = '255,122,154', PINK = '255,122,154', AMB = '255,122,154', GREEN = '170,200,255', FIRE = '255,122,154';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235';
const JAY = { col: '#C9A77A', acc: 'cap', accCol: '#2f4f7a' }, MARCUS = JAY, DAD = { col: '#A9A9B4', acc: 'glasses' }, MOM = { col: '#A9A9B4', acc: 'longhair', accCol: '#2e2a33' }, SAM = { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' };
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
  // a note on the fridge (o.note), e.g. 'DIET' - o.check adds a tick
  g.save(); g.translate(1600, 360); g.rotate(0.05); box(g, -62, -48, 124, 96, '#e9e2cf', 3); g.fillStyle = '#2b2b38'; g.font = '700 30px "Patrick Hand"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.note || 'DIET', 0, -6); if (o.check) { g.strokeStyle = '#2f9a4a'; g.lineWidth = 6; g.beginPath(); g.moveTo(-20, 26); g.lineTo(-6, 38); g.lineTo(24, 10); g.stroke(); } g.restore();
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
  if (o.guitar !== false) guitar(g, 1760, F, o.dust ?? 1);
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


// ---------------------------------------------------------------- EXCUSES: the symbol
// the progress bar above his head (world space). v = 0..100
function pbar(g, x, y, s, v, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha = a;
  const w = 230 * s, h = 30 * s;
  rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = 'rgba(12,12,18,0.85)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2 * s; g.stroke();
  if (v > 0.5) { g.save(); rr(g, x - w / 2 + 4 * s, y - h / 2 + 4 * s, (w - 8 * s) * v / 100, h - 8 * s, (h - 8 * s) / 2); g.clip(); g.fillStyle = ACC; g.fillRect(x - w / 2, y - h / 2, w, h); g.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = -2; i < 14; i++) { const sx = x - w / 2 + i * 22 * s + (NOW * 30 * s) % (22 * s); g.beginPath(); g.moveTo(sx, y + h / 2); g.lineTo(sx + 10 * s, y + h / 2); g.lineTo(sx + 22 * s, y - h / 2); g.lineTo(sx + 12 * s, y - h / 2); g.fill(); } g.restore(); glow(g, x - w / 2 + (w * v / 100), y, 60 * s, AMB, 0.25); }
  g.fillStyle = v > 0.5 ? '#fff' : '#9aa3ad'; g.font = `800 ${18 * s}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 6;
  g.fillText('PROGRESS  ' + Math.round(v) + '%', x, y - h / 2 - 16 * s);
  g.restore();
}
// THE INSERT: the big progress bar; a hand drags the slider from v0 to v1 between t0 and t1.
// o.hand: 'demon' (charcoal + red glow) | 'his' (cream mitten); o.reveal: 0..1 turns the demon hand into his own
function barInsert(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0c0c11'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960, y: 540, z: lerp(1.0, 1.05, u) });
  glow(g, 960, 520, 700, o.hand === 'his' ? WARM : '255,60,40', 0.07);
  const v = lerp(o.v0, o.v1, es(t, o.t0, o.t1)), bx = 360, bw = 1200, by = 500, bh = 92;
  rr(g, bx, by - bh / 2, bw, bh, bh / 2); g.fillStyle = '#16161e'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 4; g.stroke();
  if (v > 0.3) { g.save(); rr(g, bx + 10, by - bh / 2 + 10, (bw - 20) * v / 100, bh - 20, (bh - 20) / 2); g.clip(); g.fillStyle = ACC; g.fillRect(bx, by - bh / 2, bw, bh); g.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = -2; i < 40; i++) { const sx = bx + i * 60 + (t * 70) % 60; g.beginPath(); g.moveTo(sx, by + bh / 2); g.lineTo(sx + 28, by + bh / 2); g.lineTo(sx + 60, by - bh / 2); g.lineTo(sx + 32, by - bh / 2); g.fill(); } g.restore(); }
  const kx = bx + 10 + (bw - 20) * v / 100;
  glow(g, kx, by, 160, AMB, v > 0.3 ? 0.35 : 0);
  g.fillStyle = '#fff'; g.font = '800 46px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('PROGRESS', 380, 360);
  g.font = '800 110px Nunito'; g.textAlign = 'right'; g.fillStyle = v > 0.3 ? ACC : '#6a6a78'; g.fillText(Math.round(v) + '%', 1560, 350); g.textAlign = 'center';
  // the knob + the hand that holds it
  const rv = o.reveal || 0, demonA = o.hand === 'demon' ? 1 - rv : 0, hisA = o.hand === 'his' ? 1 : rv;
  const grip = t > o.t0 - 0.6 && t < o.t1 + 0.5 ? 1 : es(t, o.t0 - 1.2, o.t0 - 0.6);
  const hx = kx, hy = by - 6, ax = hx + 380, ay = hy + 640;
  for (const [al, col, ln_] of [[demonA, '#141217', '#050506'], [hisA, C.cream, C.line]]) {
    if (al <= 0) continue; g.save(); g.globalAlpha = al * grip;
    if (col === '#141217') { g.shadowColor = 'rgba(255,40,25,0.9)'; g.shadowBlur = 30; }
    g.lineCap = 'round'; g.strokeStyle = ln_; g.lineWidth = 104; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(hx + 260, hy + 160, hx + 40, hy + 40); g.stroke();
    g.strokeStyle = col; g.lineWidth = 90; g.stroke(); g.shadowBlur = 0;
    g.fillStyle = ln_; g.beginPath(); g.ellipse(hx, hy, 70, 64, 0.3, 0, 7); g.fill(); g.fillStyle = col; g.beginPath(); g.ellipse(hx, hy, 62, 56, 0.3, 0, 7); g.fill();
    g.restore();
  }
  g.fillStyle = '#fff'; g.beginPath(); g.arc(kx, by, 26, 0, 7); g.fill();
}
// ---------------------------------------------------------------- props
function alarmClock(g, x, y, s, t, ring = 0, label = '6:00') {
  const sh = ring ? Math.sin(t * 60) * 3 * s * ring : 0;
  g.save(); g.translate(x + sh, y);
  rr(g, -46 * s, -34 * s, 92 * s, 52 * s, 10 * s); g.fillStyle = '#1b1a22'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  g.fillStyle = '#ff5a4a'; g.font = `800 ${28 * s}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 0, -8 * s);
  glow(g, 0, -8 * s, 70 * s, '255,90,74', 0.25 + 0.25 * ring);
  if (ring) { g.strokeStyle = `rgba(255,200,180,${0.7 * ring})`; g.lineWidth = 3 * s; for (const sg of [-1, 1]) for (let i = 1; i < 3; i++) { g.beginPath(); g.arc(sg * 30 * s, -10 * s, (34 + i * 14) * s, sg < 0 ? Math.PI * 0.8 : -Math.PI * 0.2, sg < 0 ? Math.PI * 1.2 : Math.PI * 0.2); g.stroke(); } }
  g.restore();
}
function guitar(g, x, y, dust = 1, s = 1, rot = -0.18, playing = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round';
  g.fillStyle = '#7a4a28'; g.strokeStyle = C.line; g.lineWidth = 3;
  g.beginPath(); g.ellipse(0, -60, 50, 56, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, -140, 38, 40, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#1a120c'; g.beginPath(); g.arc(0, -110, 14, 0, 7); g.fill();
  box(g, -7, -320, 14, 180, '#3a2a1a'); box(g, -12, -350, 24, 34, '#2a1e14', 4);
  g.strokeStyle = 'rgba(230,220,200,0.7)'; g.lineWidth = 1.2; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 3, -330); g.lineTo(i * 3, -40); g.stroke(); }
  if (dust > 0) { g.fillStyle = `rgba(160,160,170,${0.45 * dust})`; g.beginPath(); g.ellipse(-6, -96, 40, 60, 0, Math.PI * 1.1, Math.PI * 1.9); g.fill(); ln(g, [30, -200, 60, -230], 1.5, `rgba(170,170,180,${0.6 * dust})`); ln(g, [60, -230, 70, -180], 1.5, `rgba(170,170,180,${0.6 * dust})`); }
  g.restore();
}
function laptop(g, x, y, s, lit = 1, lid = 1) {
  g.save(); g.translate(x, y);
  box(g, -90 * s, -6 * s, 180 * s, 12 * s, '#2a2a34', 3);
  const h = 110 * s * lid; rr(g, -82 * s, -6 * s - h, 164 * s, h, 6); g.fillStyle = '#1b1b24'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2; g.stroke();
  if (lid > 0.6 && lit > 0) { g.fillStyle = `rgba(150,180,240,${0.55 * lit})`; g.fillRect(-74 * s, -h, 148 * s, h - 12 * s); }
  g.restore(); if (lit > 0 && lid > 0.6) glow(g, x, y - 60 * s, 160 * s, COLD, 0.2 * lit);
}
// ---------------------------------------------------------------- the laptop screen (POV): the job application
function appScreen(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0b0b10'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.05, u) });
  const lid = o.close ? 1 - es(t, o.close, o.close + 0.6) : 1;
  box(g, 260, 860, 1400, 40, '#24242e', 8);
  const top = 860 - 720 * lid;
  rr(g, 300, top, 1320, 860 - top, 22); g.fillStyle = '#16161e'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
  if (lid < 0.25) return;
  g.save(); g.beginPath(); g.rect(330, top + 30, 1260, 860 - top - 60); g.clip();
  g.fillStyle = '#e9edf4'; g.fillRect(330, top + 30, 1260, 800); g.fillStyle = '#d2d8e4'; g.fillRect(330, top + 30, 1260, 54);
  g.fillStyle = '#2b2b38'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = '800 46px Nunito'; g.fillText('Junior Designer', 400, top + 150);
  g.font = '400 28px Nunito'; g.fillStyle = '#5a6070'; g.fillText('Full-time  ·  Apply online', 400, top + 200);
  g.fillStyle = '#c0392b'; g.font = '800 34px Nunito'; g.fillText('Deadline: TODAY, 11:59 PM', 400, top + 270);
  g.fillStyle = 'rgba(60,60,70,0.2)'; for (let i = 0; i < 4; i++) g.fillRect(400, top + 330 + i * 40, 900 - i * 120, 16);
  const sent = o.sent && t > o.sent;
  rr(g, 400, top + 520, 420, 84, 42); g.fillStyle = sent ? '#2f9a4a' : (o.press && t > o.press - 0.15 && t < o.press + 0.1 ? '#d98a1f' : ACC); g.fill();
  g.fillStyle = '#fff'; g.font = '800 32px Nunito'; g.textAlign = 'center'; g.fillText(sent ? 'SUBMITTED ✓' : 'SUBMIT APPLICATION', 610, top + 563);
  g.fillStyle = '#2b2b38'; g.textAlign = 'right'; g.font = '700 30px Nunito'; g.fillText(o.clock || '10:52 PM', 1540, top + 57);
  // the cursor
  const cp = o.cursor ? o.cursor(t) : [1300, 700]; g.fillStyle = '#111'; g.beginPath(); g.moveTo(cp[0], cp[1]); g.lineTo(cp[0], cp[1] + 34); g.lineTo(cp[0] + 10, cp[1] + 26); g.lineTo(cp[0] + 22, cp[1] + 30); g.closePath(); g.fill();
  g.restore();
}
// ---------------------------------------------------------------- BUS STOP (core place 3)
const BS_F = 840;
function busStop(g, t, o = {}) {
  skyline(g, 560, -400, 2400, 81, '#0d0c14', [[0, '#0a0a14'], [0.7, '#1c1726'], [1, '#2b1f2c']]);
  g.fillStyle = '#121118'; g.fillRect(-500, 560, 3000, 900); ln(g, [-500, 560, 2500, 560], 2, 'rgba(106,106,120,0.4)');
  g.fillStyle = '#0e0d13'; g.fillRect(-500, BS_F + 40, 3000, 600); ln(g, [-500, BS_F + 40, 2500, BS_F + 40], 2, 'rgba(106,106,120,0.5)');
  // the shelter
  box(g, 600, 300, 760, 20, '#24222c'); ln(g, [620, 320, 620, BS_F]); ln(g, [1340, 320, 1340, BS_F]);
  g.fillStyle = 'rgba(140,160,200,0.06)'; g.fillRect(620, 330, 720, 380); g.strokeStyle = 'rgba(140,160,200,0.25)'; g.lineWidth = 2; g.strokeRect(620, 330, 720, 380);
  box(g, 1180, 360, 140, 200, '#1b1a22', 6); g.fillStyle = 'rgba(255,205,140,0.7)'; g.fillRect(1192, 372, 116, 176); glow(g, 1250, 460, 220, WARM, 0.15);
  g.fillStyle = '#2b2b38'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('CITY', 1250, 440); g.fillText('ARTS', 1250, 480);
  box(g, 680, 700, 440, 18, '#24222c', 6); ln(g, [700, 718, 700, BS_F]); ln(g, [1100, 718, 1100, BS_F]);
  // the stop sign
  ln(g, [1500, BS_F, 1500, 380], 6, '#3a3846'); g.fillStyle = '#2f4f7a'; g.beginPath(); g.arc(1500, 380, 44, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 30px Nunito'; g.fillText('42', 1500, 382);
  lampPost(g, 320, BS_F, 560, 0.8);
}
function busBench(g) { box(g, 680, 700, 440, 18, '#24222c', 6); }
// ---------------------------------------------------------------- FAST FOOD counter (core place 5)
function fastFood(g, t, o = {}) {
  g.fillStyle = '#16131a'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0e0c11'; g.fillRect(-500, 850, 3000, 600); ln(g, [-500, 850, 2500, 850]);
  for (let i = 0; i < 3; i++) { const x = 560 + i * 300; box(g, x, 170, 270, 150, '#201a14', 8); g.fillStyle = 'rgba(255,190,110,0.85)'; g.fillRect(x + 12, 182, 246, 126); glow(g, x + 135, 245, 260, WARM, 0.22);
    g.fillStyle = '#3a2410'; g.font = '800 28px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(['BURGERS', 'FRIES', 'SHAKES'][i], x + 135, 210); g.fillStyle = 'rgba(60,36,16,0.5)'; for (let k = 0; k < 3; k++) g.fillRect(x + 40, 240 + k * 22, 190 - k * 30, 10); }
  box(g, 1560, 500, 200, 340, '#1b1a22', 8); g.fillStyle = 'rgba(170,200,255,0.25)'; g.fillRect(1574, 514, 172, 230);
  if (o.behind) o.behind();
}
function counterFront(g, t, o = {}) {
  box(g, 380, 600, 1080, 20, '#2e2a33'); box(g, 400, 620, 1040, 230, '#1f1b22'); g.fillStyle = '#b8483a'; g.fillRect(400, 640, 1040, 14);
  if (o.tray) { box(g, 740, 584, 200, 18, '#a8483a', 4); g.fillStyle = '#d9a657'; g.beginPath(); g.ellipse(790, 570, 34, 20, 0, Math.PI, 0); g.fill(); g.fillStyle = '#6b3a20'; g.fillRect(758, 568, 64, 10); box(g, 860, 540, 44, 44, '#c0392b', 4); for (let i = 0; i < 5; i++) { g.fillStyle = '#f2c14e'; g.fillRect(864 + i * 8, 524 - (i % 2) * 6, 5, 22); } }
}
function apron(g, r, s, col = '#efe8d4') { const x = r.neck[0], y = r.neck[1] + 40 * s, h = r.hip[1] - y + 30 * s; g.save(); rr(g, x - 38 * s, y, 76 * s, h, 10 * s); g.fillStyle = col; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2 * s; g.stroke(); g.fillStyle = '#b8483a'; g.fillRect(x + 6 * s, y + 10 * s, 24 * s, 10 * s); g.restore(); }
// ---------------------------------------------------------------- GYM (one-off, then the proof at the end)
const GY_F = 850;
function gym(g, t, o = {}) {
  g.fillStyle = '#121218'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0c0c11'; g.fillRect(-500, GY_F, 3000, 600); ln(g, [-500, GY_F, 2500, GY_F]);
  box(g, 200, 200, 1520, 500, '#14161e', 6); g.fillStyle = 'rgba(170,190,235,0.05)'; g.fillRect(212, 212, 1496, 476); g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 40; g.beginPath(); g.moveTo(400, 690); g.lineTo(700, 210); g.moveTo(1300, 690); g.lineTo(1550, 210); g.stroke();
  for (const x of [120, 1800]) { box(g, x - 80, 520, 160, 330, '#1b1a22', 6); for (let i = 0; i < 4; i++) { ln(g, [x - 60, 560 + i * 70, x + 60, 560 + i * 70], 6, '#3a3846'); g.fillStyle = '#2a2832'; g.beginPath(); g.arc(x - 50, 560 + i * 70, 14, 0, 7); g.arc(x + 50, 560 + i * 70, 14, 0, 7); g.fill(); } }
  for (const lx of [500, 1400]) { ln(g, [lx - 120, 120, lx + 120, 120], 8, 'rgba(200,215,240,0.8)'); glow(g, lx, 140, 500, COLD, 0.1); pool(g, lx, GY_F, 420, COLD, 0.08); }
  if (o.dawn) glow(g, 960, 300, 700, WARM, 0.12);
  g.fillStyle = 'rgba(255,90,74,0.9)'; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.fillText(o.clock || '6:12 AM', 960, 160);
}
function dumbbell(g, x, y, s = 1) { g.fillStyle = '#2a2832'; g.strokeStyle = C.line; g.lineWidth = 2; g.fillRect(x - 26 * s, y - 4 * s, 52 * s, 8 * s); for (const sg of [-1, 1]) { g.beginPath(); g.ellipse(x + sg * 26 * s, y, 9 * s, 16 * s, 0, 0, 7); g.fill(); g.stroke(); } }
function card2(l1, l2, w0 = 0.3, w1 = 1.6, size = 92) {
  const fn = (g, t, a, b) => { const f = 1 - seg(t, b - 0.5, b - 0.1); blackLine(g, l1, seg(t, a + w0, a + w1), ACC, f, size, -60); blackLine(g, l2, seg(t, a + w1 + 0.2, a + w1 + 1.4), ACC, f, size, 60); };
  fn.black = true; return fn;
}
// the hook line over the first scene (top of frame, on a soft dark band)
function hookLine(g, t, text, t0, t1, a = 1) {
  if (a <= 0) return; noCam(g); const gr = g.createLinearGradient(0, 60, 0, 300); gr.addColorStop(0, `rgba(0,0,0,${0.75 * a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 60, W, 240);
  blackLine(g, text, seg(t, t0, t1), ACC, a, 72, -380);
}


// ================================================================ THE LIFE HE POSTED
const DANNY = { col: '#C9A77A', acc: 'cap', accCol: '#3b6a4a' };
// ---- likes on the film's clock (HUD top-left, a heart + the number)
const LIKESK = [[0, 1240], [13.0, 1240], [14.4, 2100], [24.0, 2100], [25.4, 3300], [35.0, 3300], [36.4, 5100], [45.4, 5100], [46.8, 8700],
  [64.5, 8700], [67.5, 12000], [94.6, 12000], [100.4, 0], [148, 0], [149.4, 47]];
const likesAt = t => kf(t, LIKESK);
function likesHud(g, t, a = 1) {
  const v = Math.round(likesAt(t)); g.save(); noCam(g); g.globalAlpha = 0.9 * a;
  const x = PORTRAIT ? 70 : 76, y = PORTRAIT ? 230 : 112, s = PORTRAIT ? 1.6 : 1;
  g.translate(x, y); g.scale(s, s); g.fillStyle = ACC; g.beginPath(); g.moveTo(14, 8); g.bezierCurveTo(14, -6, -6, -6, -6, 4); g.bezierCurveTo(-6, 12, 6, 16, 14, 24); g.bezierCurveTo(22, 16, 34, 12, 34, 4); g.bezierCurveTo(34, -6, 14, -6, 14, 8); g.fill();
  g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 8; g.fillStyle = C.text; g.font = '700 34px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(v.toLocaleString('en-US'), 46, 9);
  g.restore();
}
// ---- the little pictures inside a post (drawn into a w x h box)
function picBg(g, x, y, w, h, c0, c1) { const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fillRect(x, y, w, h); }
function miniMe(g, x, y, s, smile = 0.9) { person(g, { x, y, s, still: true, face: { smile, look: [0, 0] } }); }
const PICS = {
  car(g, x, y, w, h) { picBg(g, x, y, w, h, '#ff9a6a', '#4a2a4a'); g.fillStyle = 'rgba(255,240,200,0.8)'; g.beginPath(); g.arc(x + w * 0.75, y + h * 0.35, h * 0.12, 0, 7); g.fill(); sportsCar(g, x + w * 0.55, y + h * 0.88, w / 900, '#e0302a'); miniMe(g, x + w * 0.2, y + h * 0.92, w / 900); },
  hotel(g, x, y, w, h) { picBg(g, x, y, w, h, '#f2d79a', '#7a5a3a'); for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x + w * (0.15 + i * 0.3), y + h * 0.1, w * 0.04, h * 0.8); } g.fillStyle = '#fff6d0'; g.beginPath(); g.arc(x + w / 2, y + h * 0.18, h * 0.08, 0, 7); g.fill(); miniMe(g, x + w * 0.5, y + h * 0.95, w / 800); },
  steak(g, x, y, w, h) { picBg(g, x, y, w, h, '#3a2420', '#1a1010'); g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(x + w / 2, y + h * 0.6, w * 0.32, h * 0.22, 0, 0, 7); g.fill(); g.fillStyle = '#7a3a22'; g.beginPath(); g.ellipse(x + w / 2, y + h * 0.58, w * 0.18, h * 0.11, 0.2, 0, 7); g.fill(); g.fillStyle = '#8a1a2a'; g.fillRect(x + w * 0.78, y + h * 0.2, w * 0.06, h * 0.4); glow(g, x + w * 0.2, y + h * 0.3, h * 0.3, WARM, 0.4); },
  jacket(g, x, y, w, h) { picBg(g, x, y, w, h, '#2a2a3a', '#101018'); person(g, { x: x + w / 2, y: y + h * 0.98, s: w / 700, still: true, face: { smile: 0.4, look: [0.3, 0] } }); g.fillStyle = '#b8862a'; g.fillRect(x + w / 2 - w * 0.08, y + h * 0.45, w * 0.16, h * 0.28); },
  window(g, x, y, w, h) { picBg(g, x, y, w, h, '#f0b48a', '#5a4a5a'); g.strokeStyle = '#2a2a36'; g.lineWidth = w * 0.03; g.strokeRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.55); person(g, { x: x + w * 0.5, y: y + h * 0.98, s: w / 900, hip: true, thigh: 20, still: true, face: { smile: 0.5, look: [0.4, 0] } }); g.fillStyle = '#efe8d4'; g.fillRect(x + w * 0.6, y + h * 0.7, w * 0.06, h * 0.08); },
  wedding(g, x, y, w, h) { picBg(g, x, y, w, h, '#f6e9f0', '#c9a7b8'); person(g, { x: x + w * 0.38, y: y + h * 0.96, s: w / 950, col: '#A9A9B4', still: true, face: { smile: 1 } }); person(g, { x: x + w * 0.62, y: y + h * 0.96, s: w / 950, col: '#C9A77A', acc: 'longhair', still: true, face: { smile: 1 } }); },
  house(g, x, y, w, h) { picBg(g, x, y, w, h, '#a8d0f0', '#6a8a5a'); g.fillStyle = '#efe8d4'; g.fillRect(x + w * 0.25, y + h * 0.4, w * 0.5, h * 0.45); g.fillStyle = '#b8483a'; g.beginPath(); g.moveTo(x + w * 0.2, y + h * 0.42); g.lineTo(x + w / 2, y + h * 0.15); g.lineTo(x + w * 0.8, y + h * 0.42); g.fill(); g.fillStyle = '#7a4a28'; g.fillRect(x + w * 0.45, y + h * 0.6, w * 0.1, h * 0.25); },
  promo(g, x, y, w, h) { picBg(g, x, y, w, h, '#2a3a5a', '#101828'); g.fillStyle = '#fff'; g.font = `800 ${h * 0.14}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PROMOTED!', x + w / 2, y + h * 0.3); person(g, { x: x + w / 2, y: y + h * 0.98, s: w / 900, col: '#9a9aa8', acc: 'glasses', still: true, face: { smile: 1 } }); },
  plain(g, x, y, w, h) { picBg(g, x, y, w, h, '#2a2a34', '#18181e'); g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = w * 0.02; g.beginPath(); g.arc(x + w / 2, y + h * 0.5, w * 0.28, 0, 7); g.fill(); g.stroke(); g.fillStyle = C.line; for (const sg of [-1, 1]) { g.beginPath(); g.arc(x + w / 2 + sg * w * 0.09, y + h * 0.48, w * 0.025, 0, 7); g.fill(); } g.beginPath(); g.arc(x + w / 2, y + h * 0.55, w * 0.07, 0.2, Math.PI - 0.2); g.stroke(); },
};
// a post screen (Glimpse app). o: {pic, likes (fn t), caption, burst:[t0,t1], user}
function postApp(o) {
  return (g, px, py, pw, ph, t) => {
    g.fillStyle = '#0d0d12'; g.fillRect(px, py, pw, ph);
    g.fillStyle = '#16161e'; g.fillRect(px, py, pw, 100); g.fillStyle = ACC; g.font = '800 30px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('Glimpse', px + 34, py + 62);
    g.fillStyle = C.cream; g.beginPath(); g.arc(px + 54, py + 138, 20, 0, 7); g.fill(); g.strokeStyle = ACC; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.font = '700 22px Nunito'; g.fillText(o.user || 'alex.lives', px + 86, py + 138);
    PICS[o.pic](g, px, py + 170, pw, pw);
    const ly = py + 170 + pw + 40, lv = Math.round(o.likes(t));
    const pop = o.burst ? Math.sin(Math.PI * seg(t, o.burst[0], o.burst[0] + 0.4)) : 0;
    g.save(); g.translate(px + 50, ly); g.scale(1 + pop * 0.4, 1 + pop * 0.4); g.fillStyle = ACC; g.beginPath(); g.moveTo(0, 8); g.bezierCurveTo(0, -8, -20, -8, -20, 4); g.bezierCurveTo(-20, 14, -6, 18, 0, 26); g.bezierCurveTo(6, 18, 20, 14, 20, 4); g.bezierCurveTo(20, -8, 0, -8, 0, 8); g.fill(); g.restore();
    g.fillStyle = '#fff'; g.font = '800 28px Nunito'; g.fillText(lv.toLocaleString('en-US') + ' likes', px + 86, ly + 8);
    g.font = '400 24px Nunito'; g.fillStyle = '#d8d8e0'; g.fillText(o.caption, px + 34, ly + 56);
    if (o.burst && t > o.burst[0]) { const q = rng(7); for (let i = 0; i < 16; i++) { const ph_ = ((t - o.burst[0]) * 0.9 + q()) % 1; if (t > o.burst[1] && ph_ < 0.1) continue; const hx = px + 40 + q() * (pw - 80), hy = py + 170 + pw - ph_ * pw * 0.9; g.save(); g.globalAlpha = (1 - ph_) * 0.9; g.fillStyle = ACC; g.translate(hx, hy); g.scale(0.9, 0.9); g.beginPath(); g.moveTo(0, 8); g.bezierCurveTo(0, -8, -20, -8, -20, 4); g.bezierCurveTo(-20, 14, -6, 18, 0, 26); g.bezierCurveTo(6, 18, 20, 14, 20, 4); g.bezierCurveTo(20, -8, 0, -8, 0, 8); g.fill(); g.restore(); } }
  };
}
// the profile grid. o: {pics: [...], gone (fn t -> how many deleted from the end), avatar: 'fancy'|'plain'}
function profileApp(o) {
  return (g, px, py, pw, ph, t) => {
    g.fillStyle = '#0d0d12'; g.fillRect(px, py, pw, ph);
    const plain = o.plainAt && t > o.plainAt;
    g.fillStyle = plain ? '#2a2a34' : ACC; g.beginPath(); g.arc(px + 80, py + 110, 50, 0, 7); g.fill();
    if (plain) PICS.plain(g, px + 36, py + 66, 88, 88); else { g.save(); g.beginPath(); g.arc(px + 80, py + 110, 44, 0, 7); g.clip(); PICS.car(g, px + 36, py + 66, 88, 88); g.restore(); }
    g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('alex.lives', px + 150, py + 92);
    g.fillStyle = '#9aa3ad'; g.font = '400 20px Nunito'; g.fillText(plain ? 'still figuring life out.' : 'living the dream 💸', px + 150, py + 126);
    const n = o.pics.length, gone = Math.floor(o.gone ? o.gone(t) : 0), tw = (pw - 24) / 3;
    for (let i = 0; i < n - gone; i++) PICS[o.pics[i]](g, px + 6 + (i % 3) * (tw + 6), py + 190 + Math.floor(i / 3) * (tw + 6), tw, tw);
    if (o.del && t > o.del[0] && gone < n) { const i = n - gone - 1, k = ((t - o.del[0]) / ((o.del[1] - o.del[0]) / n)) % 1; g.fillStyle = `rgba(255,60,60,${0.4 * k})`; g.fillRect(px + 6 + (i % 3) * (tw + 6), py + 190 + Math.floor(i / 3) * (tw + 6), tw, tw); }
  };
}
function bankApp(bal) {
  return (g, px, py, pw, ph, t) => {
    g.fillStyle = '#0f1420'; g.fillRect(px, py, pw, ph); g.fillStyle = '#1a2236'; g.fillRect(px, py, pw, 110);
    g.fillStyle = '#fff'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('My Bank', px + pw / 2, py + 66);
    g.fillStyle = '#9aa3ad'; g.font = '600 24px Nunito'; g.fillText('Available balance', px + pw / 2, py + 220);
    g.fillStyle = '#ff6a5a'; g.font = '800 72px Nunito'; g.fillText(bal, px + pw / 2, py + 300);
    g.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 4; i++) g.fillRect(px + 40, py + 400 + i * 70, pw - 80, 50);
    g.fillStyle = '#9aa3ad'; g.font = '400 20px Nunito'; g.textAlign = 'left'; ['Car rental  -$80', 'Jacket clean  -$25', 'Rent  -$900', 'Noodles  -$6'].forEach((s, i) => g.fillText(s, px + 60, py + 425 + i * 70));
  };
}
// ---- places + props
function sportsCar(g, x, y, s, col = '#e0302a') {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = C.line; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-220, -20); g.lineTo(-200, -55); g.lineTo(-90, -70); g.lineTo(-30, -112); g.lineTo(80, -112); g.lineTo(150, -70); g.lineTo(215, -58); g.lineTo(225, -20); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#1a2230'; g.beginPath(); g.moveTo(-20, -104); g.lineTo(70, -104); g.lineTo(120, -72); g.lineTo(-70, -72); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(-180, -48, 380, 6);
  for (const wx of [-140, 150]) { g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(wx, -18, 34, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#9a9aa8'; g.beginPath(); g.arc(wx, -18, 15, 0, 7); g.fill(); }
  g.fillStyle = '#fff2c0'; g.fillRect(205, -50, 14, 10); g.restore();
}
function rentalLot(g, t, o = {}) {
  carLot(g, t);
  box(g, 1510, 425, 340, 44, '#1a1922', 4); g.fillStyle = '#d9a657'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('LUXE RENTALS', 1680, 455);
  g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '700 24px Nunito'; g.fillText('$80 / 20 MIN', 1680, 600);
  if (o.car !== false) sportsCar(g, o.carX ?? 1180, 860, 1.9, '#e0302a');
}
function hotelLobby(g, t, o = {}) {
  g.fillStyle = '#1a1612'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#120f0c'; g.fillRect(-500, 850, 3000, 600);
  g.strokeStyle = 'rgba(217,166,87,0.25)'; g.lineWidth = 2; for (let x = -480; x < 2500; x += 160) { g.beginPath(); g.moveTo(x, 850); g.lineTo(x - 200, 1100); g.stroke(); } ln(g, [-500, 850, 2500, 850], 2.5, 'rgba(217,166,87,0.5)');
  for (const cx of [300, 1620]) { box(g, cx - 40, 120, 80, 730, '#2a221a'); ln(g, [cx - 40, 160, cx + 40, 160], 3, 'rgba(217,166,87,0.5)'); }
  // chandelier
  ln(g, [960, -300, 960, 150], 3, '#5a4a30'); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const cx = 960 + Math.cos(a) * 120, cy = 190 + Math.sin(a) * 30; g.fillStyle = '#fff2c0'; g.beginPath(); g.arc(cx, cy, 8, 0, 7); g.fill(); ln(g, [cx, cy - 8, cx, cy + 22], 2, 'rgba(255,240,200,0.6)'); } glow(g, 960, 200, 520, WARM, 0.35); pool(g, 960, 850, 700, WARM, 0.18);
  // reception desk + sign
  g.fillStyle = '#d9a657'; g.font = '700 34px Nunito'; g.textAlign = 'center'; g.fillText('THE GRAND', 1380, 330); if (o.desk !== false) { box(g, 1180, 620, 400, 230, '#3a2a1c', 8); ln(g, [1180, 650, 1580, 650], 3, 'rgba(217,166,87,0.6)'); }
  box(g, 380, 640, 220, 70, '#5a3a3a', 20); box(g, 380, 700, 220, 40, '#4a2e2e', 10);
}
function restaurant(g, t, o = {}) {
  g.fillStyle = '#1a1214'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#120c0e'; g.fillRect(-500, 850, 3000, 600); ln(g, [-500, 850, 2500, 850], 2.5, 'rgba(217,166,87,0.4)');
  for (let x = -300; x < 2400; x += 260) { box(g, x, 180, 200, 300, '#24181a', 6); g.fillStyle = 'rgba(217,166,87,0.12)'; g.fillRect(x + 10, 190, 180, 280); }
  for (const lx of [500, 1400]) { ln(g, [lx, -300, lx, 140]); g.beginPath(); g.arc(lx, 160, 26, Math.PI, 0); g.fillStyle = 'rgba(255,205,140,0.9)'; g.fill(); glow(g, lx, 180, 360, WARM, 0.22); }
}
function restTable(g, x, y, w = 360, food = true) {
  g.fillStyle = '#efe8d4'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x + w / 2, y); g.lineTo(x + w / 2 + 20, y + 120); g.lineTo(x - w / 2 - 20, y + 120); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#fff2c0'; g.fillRect(x - 6, y - 44, 12, 40); glow(g, x, y - 50, 70, WARM, 0.45);
}
function plate(g, x, y, steak = true) { g.fillStyle = '#f7f4ec'; g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 54, 12, 0, 0, 7); g.fill(); g.stroke(); if (steak) { g.fillStyle = '#7a3a22'; g.beginPath(); g.ellipse(x, y - 6, 30, 9, 0, 0, 7); g.fill(); } }
function glassWater(g, x, y) { g.fillStyle = 'rgba(180,210,240,0.35)'; g.strokeStyle = 'rgba(200,220,240,0.8)'; g.lineWidth = 2; g.fillRect(x - 10, y - 40, 20, 40); g.strokeRect(x - 10, y - 40, 20, 40); }
function jacket(g, r, s) { const x = r.neck[0], y = r.neck[1] + 4 * s, h = r.hip[1] - y + 14 * s; g.save(); rr(g, x - 52 * s, y, 104 * s, h, 18 * s); g.fillStyle = '#b8862a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2 * s; g.stroke(); g.fillStyle = '#7a5418'; g.beginPath(); g.moveTo(x - 20 * s, y); g.lineTo(x, y + 40 * s); g.lineTo(x + 20 * s, y); g.fill(); g.fillStyle = '#e9d9a0'; g.fillRect(x + 24 * s, y + 30 * s, 14 * s, 6 * s); g.restore(); }
function earpiece(g, r, s) { g.strokeStyle = '#e9e6df'; g.lineWidth = 2 * s; g.beginPath(); g.moveTo(r.head[0] + 52 * s, r.head[1] + 6 * s); g.quadraticCurveTo(r.head[0] + 62 * s, r.head[1] + 40 * s, r.neck[0] + 30 * s, r.neck[1] + 20 * s); g.stroke(); }
function openFridge(g) { box(g, 1480, 260, 230, 590, '#0d1a24', 12); glow(g, 1595, 560, 360, COLD, 0.4); g.fillStyle = 'rgba(200,225,255,0.55)'; g.fillRect(1494, 274, 202, 562); ln(g, [1494, 460, 1696, 460], 3, 'rgba(255,255,255,0.7)'); ln(g, [1494, 640, 1696, 640], 3, 'rgba(255,255,255,0.7)'); box(g, 1600, 600, 30, 40, '#e9e2cf', 3); box(g, 1400, 240, 70, 630, '#1a1a22', 10); ln(g, [1450, 420, 1450, 520], 6); }
function noodleInsert(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(1, 1.08, u) });
  g.fillStyle = '#16141a'; g.fillRect(-400, -400, 2800, 1900); g.strokeStyle = 'rgba(106,106,120,0.2)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 20); g.stroke(); }
  glow(g, 960, 420, 700, COLD, 0.12);
  g.fillStyle = '#efe8d4'; g.strokeStyle = C.line; g.lineWidth = 4; g.beginPath(); g.ellipse(960, 520, 230, 230, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e9c27a'; g.beginPath(); g.ellipse(960, 520, 190, 190, 0, 0, 7); g.fill();
  g.strokeStyle = '#f2d89a'; g.lineWidth = 6; for (let i = 0; i < 18; i++) { g.beginPath(); g.arc(960 + Math.sin(i * 2.1) * 80, 520 + Math.cos(i * 1.7) * 80, 40 + i * 2, i, i + 2); g.stroke(); }
  g.fillStyle = '#b8483a'; g.fillRect(1240, 360, 220, 100); g.fillStyle = '#fff'; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.fillText('NOODLES', 1350, 420); g.font = '700 22px Nunito'; g.fillText('$0.89', 1350, 448);
  ln(g, [560, 760, 820, 600], 10, '#c9a46a');
  for (let i = 0; i < 4; i++) { const k = (t * 0.4 + i / 4) % 1; g.fillStyle = `rgba(230,230,240,${0.25 * (1 - k)})`; g.beginPath(); g.arc(900 + i * 40, 420 - k * 200, 20 + k * 30, 0, 7); g.fill(); }
}

// ================================================================ ONE CARD AT A TIME - places + props
const DK_F = 850, DESK = [1100, 700];          // floor; where he sits at the desk (hip)
const AYESHA = { col: '#C9A77A', acc: 'longhair', accCol: '#2e2420' }, ZAIN = { col: '#A9A9B4', acc: 'glasses' };
const BOOKC = ['#3b6fb6', '#c0453a', '#2e9e6a', '#d9a03a', '#7a4fb0', '#2a8fa0', '#d06a8a', '#5a7a3a'];
// a stack of coloured books (spines towards us)
function books(g, x, y, n, seed = 1, w = 150) {
  const q = rng(seed); let yy = y;
  for (let i = 0; i < n; i++) { const h = 18 + q() * 14, bw = w - q() * 40, dx = (q() - 0.5) * 16; box(g, x - bw / 2 + dx, yy - h, bw, h, BOOKC[Math.floor(q() * BOOKC.length)], 3); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x - bw / 2 + dx + 10, yy - h / 2 - 2, bw * 0.3, 4); yy -= h; }
  return yy;
}
function chai(g, x, y, steam = 0, t = 0) { box(g, x - 14, y - 30, 28, 30, '#e9e2cf', 4); g.fillStyle = '#a0683a'; g.fillRect(x - 11, y - 27, 22, 6); g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.arc(x + 16, y - 16, 7, -1.3, 1.3); g.stroke();
  if (steam) for (let i = 0; i < 2; i++) { const k = (t * 0.5 + i / 2) % 1; g.fillStyle = `rgba(230,230,240,${0.2 * (1 - k)})`; g.beginPath(); g.arc(x, y - 40 - k * 60, 6 + k * 10, 0, 7); g.fill(); } }
function wallClock(g, x, y, r, hours) {   // hours as a float, e.g. 19.25 = 7:15
  g.fillStyle = '#e9e2cf'; g.strokeStyle = '#2a2a36'; g.lineWidth = 6; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#2b2b38'; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.arc(x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8, r * 0.05, 0, 7); g.fill(); }
  const hA = (hours % 12) / 12 * Math.PI * 2, mA = (hours % 1) * Math.PI * 2;
  g.lineCap = 'round'; g.strokeStyle = '#2b2b38'; g.lineWidth = r * 0.09; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(hA) * r * 0.5, y - Math.cos(hA) * r * 0.5); g.stroke();
  g.lineWidth = r * 0.06; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(mA) * r * 0.75, y - Math.cos(mA) * r * 0.75); g.stroke();
}
// his room: window (left), wall clock over the desk, a poster, the desk lamp. o.clock (hours), o.dusk, o.lamp, o.warm (sister's light)
function deskRoom(g, t, o = {}) {
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, DK_F + 400); g.fillStyle = '#0b0b10'; g.fillRect(-500, DK_F, 3000, 700); ln(g, [-500, DK_F, 2500, DK_F]);
  const gr = g.createLinearGradient(0, 200, 0, 520); gr.addColorStop(0, o.day ? '#3a3350' : '#0b0d1c'); gr.addColorStop(1, o.day ? '#c98a66' : '#1f2140'); g.fillStyle = gr; g.fillRect(180, 200, 300, 320);
  g.save(); g.beginPath(); g.rect(180, 200, 300, 320); g.clip(); skyline(g, 520, 180, 480, 14, '#07080f'); g.restore();
  g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(180, 200, 300, 320); g.lineWidth = 5; g.beginPath(); g.moveTo(330, 200); g.lineTo(330, 520); g.stroke();
  glow(g, 330, 360, 380, o.day ? WARM : '90,100,160', o.day ? 0.18 : 0.1);
  box(g, 1560, 250, 170, 220, '#191822', 4); g.fillStyle = '#2f4f7a'; g.fillRect(1574, 264, 142, 192); g.fillStyle = '#e9e2cf'; g.font = '800 40px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GOALS', 1645, 330); g.font = '600 22px Nunito'; g.fillText('4.0 GPA', 1645, 380);
  wallClock(g, 1100, 210, 62, o.clock ?? 19);
  // bookshelf (right)
  box(g, 1780, 360, 200, 490, '#17161e', 6); for (let k = 0; k < 4; k++) { ln(g, [1780, 470 + k * 110, 1980, 470 + k * 110]); const q = rng(k + 3); for (let x = 1792; x < 1960; x += 22) { g.fillStyle = BOOKC[Math.floor(q() * 8)]; g.globalAlpha = 0.55; g.fillRect(x, 470 + k * 110 - 60 - q() * 30, 18, 60 + q() * 30); g.globalAlpha = 1; } }
  // the door (far left)
  box(g, -60, 300, 170, 550, '#1b1a22'); g.beginPath(); g.arc(90, 590, 6, 0, 7); g.stroke();
  if (o.door) { g.fillStyle = `rgba(255,205,140,${0.6 * o.door})`; g.fillRect(-56, 304, 162 * o.door, 542); glow(g, 40, 580, 420, WARM, 0.25 * o.door); }
  if (o.warm) glow(g, 1100, 560, 700, WARM, 0.18 * o.warm);
}
// the desk in front of him (draw AFTER the hero). o.pile (books on the left), o.done (books on the right, finished), o.open (open book), o.lamp
function deskFront(g, t, o = {}) {
  const x0 = 640, x1 = 1560, top = 690;
  if (o.lamp ?? 1) { ln(g, [1460, top, 1460, 570]); g.beginPath(); g.moveTo(1460, 570); g.quadraticCurveTo(1460, 540, 1420, 546); g.stroke(); g.beginPath(); g.moveTo(1380, 570); g.lineTo(1398, 530); g.lineTo(1436, 538); g.lineTo(1440, 574); g.closePath(); g.fillStyle = 'rgba(255,205,140,0.9)'; g.fill(); g.stroke(); glow(g, 1410, 610, 340, WARM, 0.3 * (o.lamp ?? 1)); }
  const pile = o.pile ?? 9, px = o.px ?? 0; let py = top; if (pile > 0) py = books(g, 790 + px, top, pile, 7, 170);
  if (o.pile2 ?? pile > 6) books(g, 960 + px * 1.3, top, Math.min(5, Math.floor(pile / 2)), 11, 130);
  if (o.done) books(g, 1330, top, o.done, 21, 150);
  if (o.open ?? 1) { g.fillStyle = '#efe8d4'; g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(1010, top - 2); g.lineTo(1100, top - 12); g.lineTo(1190, top - 2); g.lineTo(1190, top + 6); g.lineTo(1010, top + 6); g.closePath(); g.fill(); g.stroke(); }
  if (o.chai ?? 1) chai(g, 1240, top, 1, t);
  if (o.card) { g.save(); g.translate(1200, top - 4); g.scale(1, 0.35); box(g, -50, -34, 100, 68, '#f7f4ec', 3); g.restore(); }
  box(g, x0, top, x1 - x0, 18, '#2a2530', 6); box(g, x0 + 20, top + 18, x1 - x0 - 40, DK_F - top - 18, '#1c1922');
  ln(g, [x0 + 40, top + 80, x1 - 40, top + 80], 2, 'rgba(106,106,120,0.4)'); g.fillStyle = LINE; g.fillRect(1080, top + 46, 40, 6);
}
const SITP = (s = 1.05) => pose('table', DESK[0], DESK[1], s, { hip: true, tableY: 696 });
// an index card (front view). o: text, tick (0..1), rot, prog (write-on), blank
function indexCard(g, x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 20 * s; box(g, -170 * s, -110 * s, 340 * s, 220 * s, '#f7f4ec', 6 * s); g.shadowBlur = 0;
  g.fillStyle = '#c94b3f'; g.fillRect(-170 * s, -78 * s, 340 * s, 3 * s); g.strokeStyle = 'rgba(80,110,170,0.35)'; g.lineWidth = 1.5 * s; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-156 * s, (-34 + i * 36) * s); g.lineTo(156 * s, (-34 + i * 36) * s); g.stroke(); }
  if (o.text) { g.font = `${48 * s}px "Patrick Hand"`; let w = g.measureText(o.text).width; if (w > 300 * s) { g.font = `${48 * s * 300 * s / w}px "Patrick Hand"`; w = g.measureText(o.text).width; }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.save(); g.beginPath(); g.rect(-w / 2 - 10, -80 * s, (w + 20) * clamp(o.prog ?? 1), 170 * s); g.clip(); g.fillStyle = '#2b2b38'; g.fillText(o.text, 0, 6 * s); g.restore(); }
  if (o.tick > 0) { g.strokeStyle = '#2e9e6a'; g.lineWidth = 10 * s; g.lineCap = 'round'; g.beginPath(); const k = clamp(o.tick); g.moveTo(90 * s, 50 * s); g.lineTo(90 * s + 22 * s * Math.min(1, k * 2), 50 * s + 22 * s * Math.min(1, k * 2)); if (k > 0.5) g.lineTo(112 * s + 50 * s * (k - 0.5) * 2, 72 * s - 70 * s * (k - 0.5) * 2); g.stroke(); }
  g.restore();
}
// the dark cloud of fear over his head (black, red rim + glow), dripping red ink
function fearCloud(g, x, y, s, t, a = 1) {
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  const pts = [[-90, 10, 56], [-30, -20, 70], [40, -10, 64], [95, 14, 48], [0, 26, 60]];
  g.shadowColor = RED; g.shadowBlur = 30 * s;
  g.fillStyle = '#0c0a0e'; for (const [dx, dy, r] of pts) { g.beginPath(); g.arc(x + (dx + Math.sin(t * 1.3 + dx) * 4) * s, y + (dy + Math.cos(t * 1.1 + dy) * 3) * s, r * s, 0, 7); g.fill(); }
  g.shadowBlur = 0; g.strokeStyle = 'rgba(255,58,44,0.8)'; g.lineWidth = 3 * s; for (const [dx, dy, r] of pts) { g.beginPath(); g.arc(x + (dx + Math.sin(t * 1.3 + dx) * 4) * s, y + (dy + Math.cos(t * 1.1 + dy) * 3) * s, r * s, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }
  g.restore();
}
function drops(g, x0, x1, y0, y1, t, t0, a = 1) {   // red ink drops falling from the cloud
  if (t < t0 || a <= 0) return; const q = rng(5);
  for (let i = 0; i < 12; i++) { const st = t0 + q() * 3, x = x0 + q() * (x1 - x0), sp = 0.7 + q() * 0.3; const k = ((t - st) / sp); if (k < 0) continue; const ph = k % 1;
    g.fillStyle = `rgba(255,40,40,${0.9 * a})`; g.beginPath(); const yy = y0 + (y1 - y0) * ph; g.moveTo(x, yy - 14); g.quadraticCurveTo(x + 7, yy, x, yy + 6); g.quadraticCurveTo(x - 7, yy, x, yy - 14); g.fill(); }
}
// red handwriting that bleeds onto a page (word by word), with little runs
function redWrite(g, text, x, y, size, prog, a = 1, t = 0) {
  if (a <= 0 || prog <= 0) return; g.save(); g.globalAlpha = a; g.font = `${size}px "Caveat Brush"`; g.textAlign = 'left'; g.textBaseline = 'middle';
  const w = g.measureText(text).width; g.beginPath(); g.rect(x - w / 2 - 10, y - size, (w + 20) * clamp(prog), size * 3); g.clip();
  g.shadowColor = RED; g.shadowBlur = 18; g.fillStyle = '#e8261c'; g.fillText(text, x - w / 2, y); g.shadowBlur = 0;
  const q = rng(9); for (let i = 0; i < 9; i++) { const dx = q() * w, len = 10 + q() * 40 * clamp(prog * 1.4 - q() * 0.4); g.fillStyle = '#c81e16'; g.fillRect(x - w / 2 + dx, y + size * 0.25, 4, len); g.beginPath(); g.arc(x - w / 2 + dx + 2, y + size * 0.25 + len, 4, 0, 7); g.fill(); }
  g.restore();
}
// the window POV: the boys playing ball outside (dusk), seen through his window frame
function windowPOV(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: lerp(960, 980, u), y: 560, z: lerp(1.05, 1.1, u) });
  outCourt(g, t, { dusk: true, lamp: 0.8 });
  const ph = (t - a) * 2.2, bx = 960 + Math.sin(ph) * 380, by = 700 - Math.abs(Math.sin(ph * 2)) * 120;
  [[620, '#A9A9B4', 'cap', '#b8483a'], [880, '#C9A77A', 'scarf', '#2f4f7a'], [1160, '#8d8d9b', 'cap', '#2a2a2a'], [1400, '#C9A77A', 'glasses']].forEach(([x, c, ac, acc], i) => {
    const run = Math.sin(t * 2 + i) * 60, ux = x + run, up = i === 1 && Math.sin(ph) > 0.6;
    const r = Math.abs(Math.sin(t * 3 + i)) > 0.5 ? walker(g, ux, 840, 0.95, Math.cos(t * 2 + i) > 0 ? 1 : -1, t * 9 + i, { col: c, acc: ac, accCol: acc }, 1.5) : P(g, { x: ux, y: 840, s: 0.95, col: c, acc: ac, accCol: acc, ...(up ? pose('shoot', ux, 840, 0.95) : {}), face: { smile: 0.8 } });
    floorShadow(g, ux, 842, 70);
  });
  ball(g, bx, by, 1);
  noCam(g); g.fillStyle = '#0b0b10'; g.fillRect(0, 0, 150, H); g.fillRect(W - 150, 0, 150, H); g.fillRect(0, 0, W, 110); g.fillRect(0, H - 150, W, 150); g.fillRect(940, 0, 40, H);
  g.strokeStyle = '#2a2a36'; g.lineWidth = 14; g.strokeRect(150, 110, W - 300, H - 260); g.fillStyle = 'rgba(160,180,230,0.04)'; g.fillRect(150, 110, W - 300, H - 260);
}
// the phone feed (short videos), the phone's own clock at the top
function feedApp(clockStr) {
  return (g, px, py, pw, ph, t) => {
    g.fillStyle = '#0d0d12'; g.fillRect(px, py, pw, ph);
    const k = Math.floor(t * 1.4), off = ((t * 1.4) % 1);
    const cols = [['#ff9a6a', '#4a2a4a'], ['#3b6fb6', '#151a30'], ['#2e9e6a', '#10261c'], ['#d06a8a', '#2a1020'], ['#d9a03a', '#2a1c08']];
    for (let i = -1; i < 2; i++) { const c = cols[(k + i + 50) % cols.length], y = py + (i - es(off, 0.75, 1)) * ph; const gr = g.createLinearGradient(0, y, 0, y + ph); gr.addColorStop(0, c[0]); gr.addColorStop(1, c[1]); g.fillStyle = gr; g.fillRect(px, y, pw, ph);
      g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(px + pw / 2, y + ph * 0.45, 60, 0, 7); g.fill(); g.fillStyle = c[1]; g.beginPath(); g.moveTo(px + pw / 2 - 18, y + ph * 0.45 - 28); g.lineTo(px + pw / 2 + 30, y + ph * 0.45); g.lineTo(px + pw / 2 - 18, y + ph * 0.45 + 28); g.fill();
      g.fillStyle = '#fff'; g.font = '700 22px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(['@funnyclips', '@gamer.max', '@dailyfails', '@lofi.cats', '@topgoals'][(k + i + 50) % 5], px + 30, y + ph - 110); }
    g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(px, py, pw, 58); g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(clockStr(t), px + pw / 2, py + 34);
  };
}
function fmtTime(h) { const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return ((hh - 1) % 12 + 1) + ':' + String(mm).padStart(2, '0') + (hh >= 12 && hh < 24 ? ' PM' : ' AM'); }
// HUDs: fall = EXAM IN 10 DAYS; recovery = COURSE COVERED + DAY n (bottom right)
function examHud(g, a = 1) { hud(g, 'EXAM IN', '10 DAYS', a); }
function courseHud(g, pct, a = 1) { hud(g, 'COURSE COVERED', Math.round(pct) + '%', a); }
function dayHud(g, d, a = 1, pop = 0) {
  g.save(); noCam(g); g.globalAlpha = a; g.translate(W - 110, H - 140); g.scale(1 + pop * 0.25, 1 + pop * 0.25); g.textAlign = 'right'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 10;
  g.font = '600 26px Nunito'; g.fillStyle = '#b9b3a2'; g.fillText('DAY', -86, 4); g.font = '800 56px Nunito'; g.fillStyle = ACC; g.fillText(String(d), 0, 0); g.restore();
}
// ---- the university (exterior), the corridor with the EXAM HALL door, the hall
function university(g, t) {
  skyline(g, 560, -400, 2400, 91, '#0d0c14', [[0, '#141626'], [0.7, '#3a3350'], [1, '#c98a66']]); glow(g, 960, 520, 900, WARM, 0.12);
  box(g, 360, 220, 1200, 420, '#1a1922', 4); g.beginPath(); g.moveTo(330, 220); g.lineTo(960, 70); g.lineTo(1590, 220); g.closePath(); g.fillStyle = '#1d1c26'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  for (let x = 440; x < 1520; x += 140) { box(g, x, 280, 40, 360, '#24232e', 4); }
  g.fillStyle = '#d9a657'; g.font = '800 40px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('STATE UNIVERSITY', 960, 180);
  for (let x = 500; x < 1500; x += 140) { g.fillStyle = 'rgba(217,166,87,0.55)'; g.fillRect(x + 30, 330, 40, 60); }
  box(g, 880, 470, 160, 170, '#2a2028', 6); g.fillStyle = 'rgba(255,205,140,0.6)'; g.fillRect(892, 482, 136, 158); glow(g, 960, 560, 260, WARM, 0.25);
  g.fillStyle = '#121118'; g.fillRect(-500, 640, 3000, 900); ln(g, [-500, 640, 2500, 640], 2, 'rgba(106,106,120,0.4)');
  for (let i = 0; i < 4; i++) box(g, 700 + i * 20 - 40, 640 + i * 40, 600 - i * 40 + 80, 40, '#191820');
  box(g, 120, 520, 80, 80, '#2e9e6a', 30); box(g, 1720, 520, 80, 80, '#2e9e6a', 30); ln(g, [160, 600, 160, 850], 8, '#3a2a1c'); ln(g, [1760, 600, 1760, 850], 8, '#3a2a1c');
  lampPost(g, 420, 860, 520, 0.7); lampPost(g, 1560, 860, 520, 0.7);
}
const CR_F = 850;
function corridor(g, t, o = {}) {
  g.fillStyle = '#15141b'; g.fillRect(-500, -400, 3000, CR_F + 400); g.fillStyle = '#0c0b10'; g.fillRect(-500, CR_F, 3000, 700); ln(g, [-500, CR_F, 2500, CR_F]);
  for (const lx of [400, 1100, 1800]) { ln(g, [lx - 80, 110, lx + 80, 110], 8, 'rgba(220,230,250,0.75)'); glow(g, lx, 130, 380, COLD, 0.12); pool(g, lx, CR_F, 380, COLD, 0.08); }
  // lockers (left, colour props)
  for (let i = 0; i < 6; i++) { box(g, 60 + i * 74, 420, 70, 430, ['#2f4f7a', '#3b6fb6'][i % 2], 4); g.fillStyle = 'rgba(0,0,0,0.3)'; for (let k = 0; k < 3; k++) g.fillRect(74 + i * 74, 450 + k * 10, 40, 4); }
  // notice board with coloured papers
  box(g, 620, 330, 300, 200, '#5a3d24', 6); [['#FFE14D', 640, 350], ['#ff9a6a', 740, 360], ['#8fd0ff', 830, 350], ['#f7f4ec', 660, 440], ['#d06a8a', 780, 450]].forEach(([c, x, y], i) => { g.save(); g.translate(x + 40, y + 34); g.rotate((i % 2 ? 1 : -1) * 0.06); box(g, -40, -34, 80, 68, c, 3); g.restore(); });
  // the EXAM HALL double door
  box(g, 1040, 300, 340, 550, '#1d1b24', 4); ln(g, [1210, 300, 1210, 850], 3); box(g, 1080, 360, 90, 140, '#0f1018', 4); box(g, 1250, 360, 90, 140, '#0f1018', 4);
  box(g, 1080, 220, 260, 60, '#b8483a', 6); g.fillStyle = '#fff'; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('EXAM HALL', 1210, 252);
  if (o.open) { g.fillStyle = `rgba(255,220,160,${0.7 * o.open})`; g.fillRect(1044, 304, 332, 542); glow(g, 1210, 580, 500, WARM, 0.3 * o.open); }
}
function examHall(g, t, o = {}) {
  g.fillStyle = '#14131a'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0d0c11'; g.fillRect(-500, 640, 3000, 900); ln(g, [-500, 640, 2500, 640]);
  for (const lx of [500, 1400]) { ln(g, [lx - 120, 70, lx + 120, 70], 8, 'rgba(220,230,250,0.75)'); glow(g, lx, 90, 500, COLD, 0.1); }
  box(g, 560, 180, 800, 260, '#1d2a24', 6); g.fillStyle = 'rgba(240,240,230,0.85)'; g.font = '700 46px "Patrick Hand"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FINAL EXAM', 960, 260); g.font = '400 36px "Patrick Hand"'; g.fillText('9:00 - 12:00  •  No phones', 960, 330);
  wallClock(g, 1600, 230, 56, 9.02);
  box(g, 200, 200, 180, 240, '#d06a8a', 6); g.fillStyle = '#fff'; g.font = '800 28px Nunito'; g.fillText('GOOD', 290, 290); g.fillText('LUCK!', 290, 330);
  g.save(); g.translate(1760, 380); g.beginPath(); g.moveTo(0, 0); g.lineTo(160, 40); g.lineTo(0, 80); g.closePath(); g.fillStyle = '#2f4f7a'; g.fill(); g.strokeStyle = LINE; g.stroke(); g.restore();
  box(g, 120, 470, 120, 90, '#FFE14D', 4);
}
function examDesk(g, x, y, s = 1, paper = true) { box(g, x - 90 * s, y, 180 * s, 12 * s, '#3a3040', 3); box(g, x - 80 * s, y + 12 * s, 160 * s, 110 * s, '#221f29', 3); if (paper) { g.fillStyle = '#f7f4ec'; g.fillRect(x - 40 * s, y - 4 * s, 70 * s, 6 * s); } }
function lasers(g, eyes, to, k, t) {
  if (k <= 0) return; g.save(); g.globalCompositeOperation = 'lighter';
  for (const [ex, ey] of eyes) { const tx = lerp(ex, to[0], clamp(k)), ty = lerp(ey, to[1], clamp(k)), wob = Math.sin(t * 60) * 2;
    for (const [w, c] of [[30, 'rgba(255,40,30,0.25)'], [14, 'rgba(255,70,50,0.7)'], [5, 'rgba(255,230,220,0.95)']]) { g.strokeStyle = c; g.lineWidth = w + wob; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex, ey); g.lineTo(tx, ty); g.stroke(); }
    glow(g, ex, ey, 40, '255,60,40', 0.9); if (k >= 1) glow(g, tx, ty, 120, '255,90,60', 0.8); }
  g.restore();
}
function shards(g, x, y, t, t0, s = 1) {
  if (t < t0) return; const k = t - t0, q = rng(13);
  for (let i = 0; i < 26; i++) { const a = q() * 7, v = 200 + q() * 500, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 400 * k * k, r = (8 + q() * 22) * s;
    g.save(); g.globalAlpha = Math.max(0, 1 - k / 1.2); g.translate(px, py); g.rotate(k * (q() * 8 - 4)); g.fillStyle = q() > 0.3 ? '#141217' : RED; g.beginPath(); g.moveTo(-r, -r * 0.4); g.lineTo(r * 0.8, -r * 0.7); g.lineTo(r * 0.3, r); g.closePath(); g.fill(); g.restore(); }
}

// a mitten hand + forearm seen from above (inserts), coming in from the bottom edge
function topHand(g, x, y, s, col = C.cream, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : col; g.beginPath(); g.ellipse(0, 230 * s, (62 + (dark ? 6 : 0)) * s, 260 * s, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, 0, (66 + (dark ? 6 : 0)) * s, (80 + (dark ? 6 : 0)) * s, 0, 0, 7); g.fill(); }
  g.restore();
}
function pencilAt(g, x, y, s = 1, rot = -0.6) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#FFE14D'; g.strokeStyle = C.line; g.lineWidth = 3; g.fillRect(-10 * s, -150 * s, 20 * s, 150 * s); g.strokeRect(-10 * s, -150 * s, 20 * s, 150 * s); g.fillStyle = '#e9c27a'; g.beginPath(); g.moveTo(-10 * s, 0); g.lineTo(10 * s, 0); g.lineTo(0, 26 * s); g.closePath(); g.fill(); g.restore(); }
function tableTop(g, t) { g.fillStyle = '#1e1a20'; g.fillRect(-400, -400, 2800, 1900); g.strokeStyle = 'rgba(106,106,120,0.15)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 10); g.stroke(); } glow(g, 1300, 300, 700, WARM, 0.2); }

// ================================================================ THE RED STRING
const SC = '#FF2E4D', SCR = '255,46,77';
const BOSS = { col: '#8d8d9b', acc: 'glasses' }, SIS = { col: '#C9A77A', acc: 'longhair', accCol: '#2e2420' }, PAL = { col: '#C9A77A', acc: 'cap', accCol: '#3b6a4a' };
function loopsHud(g, n, a = 1) { hud(g, 'LOOPS', Math.round(n), a); }
// a glowing scarlet thread through points (smooth), drawn up to k (0..1)
function thread(g, pts, k = 1, w = 3, t = 0) {
  if (k <= 0 || pts.length < 2) return;
  const n = Math.max(2, Math.ceil(pts.length * clamp(k)));
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [lw, c] of [[w * 4, `rgba(${SCR},0.18)`], [w, SC]]) {
    g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < n - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; g.quadraticCurveTo(pts[i][0] + Math.sin(t * 2 + i) * 2, pts[i][1], mx, my); }
    g.lineTo(pts[n - 1][0], pts[n - 1][1]); g.stroke();
  }
  g.restore();
}
// loops wound around something (an ellipse band), k = how many of n loops are done
function wind(g, cx, cy, rx, ry, n, k, t = 0, tilt = 0.25) {
  const m = n * clamp(k); if (m <= 0) return;
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < Math.ceil(m); i++) { const f = Math.min(1, m - i), y = cy + (i - n / 2) * ry * 0.5;
    for (const [lw, c] of [[12, `rgba(${SCR},0.15)`], [3.2, SC]]) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.ellipse(cx, y, rx, ry, tilt * (i % 2 ? 1 : -1), Math.PI * 0.05, Math.PI * 0.05 + Math.PI * 2 * f); g.stroke(); } }
  g.restore();
}
// from his head: a thread that wanders to a target, then winds around it
function threadTo(g, from, to, k, seed = 1, t = 0) {
  const q = rng(seed), pts = [from]; const N = 7;
  for (let i = 1; i < N; i++) { const f = i / N; pts.push([lerp(from[0], to[0], f) + (q() - 0.5) * 160, lerp(from[1], to[1], f) - Math.sin(f * Math.PI) * 120 + (q() - 0.5) * 60]); }
  pts.push(to); thread(g, pts, k, 3, t);
}
// snapping: little red bits flying off
function snapBits(g, x, y, t, t0) { if (t < t0 || t > t0 + 0.8) return; const k = t - t0, q = rng(17); g.save(); g.strokeStyle = SC; g.lineWidth = 3; g.globalAlpha = 1 - k / 0.8;
  for (let i = 0; i < 10; i++) { const a = q() * 7, v = 120 + q() * 220, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 200 * k * k; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + 10, py - 10, px + 22 * Math.cos(a), py + 22 * Math.sin(a)); g.stroke(); }
  glow(g, x, y, 80 * (1 - k), SCR, 0.5); g.restore(); }
// ---- the OFFICE (core place): city windows, desks with monitors
const OF_F = 850;
function office(g, t, o = {}) {
  g.fillStyle = '#14141b'; g.fillRect(-500, -400, 3000, OF_F + 400); g.fillStyle = '#0c0c11'; g.fillRect(-500, OF_F, 3000, 700); ln(g, [-500, OF_F, 2500, OF_F]);
  for (let i = 0; i < 4; i++) { const x = 140 + i * 460; box(g, x, 170, 400, 300, '#0b0d1c', 4); g.save(); g.beginPath(); g.rect(x, 170, 400, 300); g.clip();
    const gr = g.createLinearGradient(0, 170, 0, 470); gr.addColorStop(0, o.day ? '#3a4a6a' : '#0b0d1c'); gr.addColorStop(1, o.day ? '#c98a66' : '#1f2140'); g.fillStyle = gr; g.fillRect(x, 170, 400, 300); skyline(g, 470, x, x + 400, 50 + i, '#07080f'); g.restore();
    g.strokeStyle = '#2a2a36'; g.lineWidth = 8; g.strokeRect(x, 170, 400, 300); }
  for (const lx of [500, 1400]) { ln(g, [lx - 140, 80, lx + 140, 80], 8, 'rgba(220,230,250,0.75)'); glow(g, lx, 100, 520, COLD, 0.1); }
  box(g, 1790, 250, 120, 120, '#2e9e6a', 60); ln(g, [1850, 370, 1850, 560], 8, '#3a2a1c'); box(g, 1810, 540, 80, 70, '#5a3d24', 6);
  if (o.behind) o.behind();
}
// a desk seen from the front, with a monitor; the person sits behind it (hip at y)
function officeDesk(g, x, y, s = 1, o = {}) {
  const top = y - 10 * s;
  box(g, x + (o.monX ?? 90) * s - 75 * s, top - 140 * s, 150 * s, 100 * s, '#1b1b24', 6); g.fillStyle = o.screen || 'rgba(120,170,230,0.55)'; g.fillRect(x + (o.monX ?? 90) * s - 66 * s, top - 132 * s, 132 * s, 84 * s); ln(g, [x + (o.monX ?? 90) * s, top - 40 * s, x + (o.monX ?? 90) * s, top], 6 * s);
  box(g, x - 200 * s, top, 400 * s, 16 * s, '#2a2530', 5); box(g, x - 186 * s, top + 16 * s, 372 * s, 150 * s, '#1c1922');
  if (o.mug) chai(g, x - 120 * s, top);
}
// ---- the SUBWAY stairs (core place): tiled wall, a few steps down to the platform, the line sign
const SW_F = 860;
function subway(g, t, o = {}) {
  g.fillStyle = '#16161c'; g.fillRect(-500, -400, 3000, 1300);
  g.strokeStyle = 'rgba(200,210,220,0.06)'; g.lineWidth = 2; for (let x = -500; x < 2500; x += 60) { g.beginPath(); g.moveTo(x, 100); g.lineTo(x, SW_F); g.stroke(); } for (let y = 100; y < SW_F; y += 40) { g.beginPath(); g.moveTo(-500, y); g.lineTo(2500, y); g.stroke(); }
  g.fillStyle = '#2e9e6a'; g.fillRect(-500, 300, 3000, 22);
  for (const [x, c, n] of [[300, '#2e9e6a', '4'], [380, '#2e9e6a', '5'], [460, '#c0453a', '2']]) { g.fillStyle = c; g.beginPath(); g.arc(x, 220, 32, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 36px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n, x, 222); }
  g.fillStyle = '#e9e2cf'; g.font = '800 40px Nunito'; g.textAlign = 'left'; g.fillText('UPTOWN', 520, 222);
  for (const lx of [500, 1400]) { ln(g, [lx - 140, 60, lx + 140, 60], 8, 'rgba(230,235,210,0.7)'); glow(g, lx, 80, 500, WARM, 0.08); }
  g.fillStyle = '#0e0e13'; g.fillRect(-500, SW_F, 3000, 700); ln(g, [-500, SW_F, 2500, SW_F]);
  // the stairs (right): 5 steps coming down to the platform
  for (let i = 0; i < 5; i++) { const x = 1100 + i * 90, y = SW_F - (i + 1) * 40; box(g, x, y, 900, 40, '#24232c'); ln(g, [x, y, x + 900, y], 3, '#e0b84a'); }
  ln(g, [1080, SW_F - 120, 1560, SW_F - 320], 6, '#4a4856');
}
// ---- the BREAK ROOM: banner, balloons, cake on the table
function breakRoom(g, t, o = {}) {
  office(g, t, o);
  const lit = o.lit ?? 1;
  g.save(); g.globalAlpha = lit; for (let i = 0; i < 11; i++) { const x = 560 + i * 80; g.fillStyle = ['#FF2E4D', '#FFE14D', '#3b6fb6', '#2e9e6a'][i % 4]; g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 70, 300); g.lineTo(x + 35, 360); g.fill(); }
  g.fillStyle = '#fff'; g.font = '800 52px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('HAPPY BIRTHDAY!', 960, 230);
  for (const [x, y, c] of [[380, 420, '#FF2E4D'], [440, 380, '#FFE14D'], [1500, 400, '#3b6fb6'], [1560, 440, '#2e9e6a']]) { ln(g, [x, y + 60, x + 10, y + 260], 2, '#9a9aa8'); g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 44, 56, 0, 0, 7); g.fill(); }
  g.restore();
}
function cake(g, x, y, lit = 1, t = 0) {
  box(g, x - 110, y - 70, 220, 70, '#f7f4ec', 10); box(g, x - 110, y - 70, 220, 18, '#FF7AA8', 8);
  for (let i = 0; i < 5; i++) { const cx = x - 70 + i * 35; box(g, cx - 4, y - 110, 8, 40, ['#3b6fb6', '#FFE14D', '#2e9e6a'][i % 3], 2); if (lit) { g.fillStyle = '#ffd27a'; g.beginPath(); g.ellipse(cx, y - 120 + Math.sin(t * 20 + i) * 1.5, 5, 9, 0, 0, 7); g.fill(); glow(g, cx, y - 120, 40, WARM, 0.5); } }
}
// ---- the SPLIT FRAME: top = WHAT HE IMAGINED (red, blurred), bottom = WHAT HAPPENED (plain). Each half draws its own scene.
function splitFrame(g, t, a, b, imagined, happened, o = {}) {
  const k = es(t, a + 0.1, a + 0.6), j = es(t, a + 1.4, a + 1.9);
  for (const [half, fn, show] of [[0, imagined, k], [1, happened, j]]) {
    g.save(); noCam(g); g.beginPath(); g.rect(0, half * H / 2, W, H / 2); g.clip();
    const dy = half * H / 2 - H / 4, _s = setCam; setCam = (gg, c) => { _s(gg, c); const m = gg.getTransform(); gg.setTransform(m.a, m.b, m.c, m.d, m.e, m.f + dy); };
    const _ts = toScreen; toScreen = (x, y) => { const r = _ts(x, y); return [r[0], r[1] + dy]; };
    try { fn(g, t); } finally { setCam = _s; toScreen = _ts; }
    noCam(g);
    if (half === 0) { g.fillStyle = 'rgba(120,0,15,0.35)'; g.fillRect(0, 0, W, H / 2); const v = g.createRadialGradient(W / 2, H / 4, 100, W / 2, H / 4, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,0,5,0.7)'); g.fillStyle = v; g.fillRect(0, 0, W, H / 2); }
    if (show < 1) { g.fillStyle = `rgba(0,0,0,${1 - show})`; g.fillRect(0, half * H / 2, W, H / 2); }
    g.save(); g.globalAlpha = show; g.fillStyle = 'rgba(0,0,0,0.55)'; rr(g, W - 450, half * H / 2 + 80, half ? 330 : 360, 54, 10); g.fill(); g.fillStyle = half ? '#e9e6df' : SC; g.font = '800 30px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(half ? 'WHAT HAPPENED' : 'WHAT HE IMAGINED', W - 430, half * H / 2 + 108); g.restore();
    g.restore();
  }
  noCam(g); g.fillStyle = '#000'; g.fillRect(0, H / 2 - 4, W, 8);
}
// a thought bubble (memory) with a scene inside, drawn on screen
function memoryBubble(g, x, y, r, a, draw) {
  if (a <= 0) return; g.save(); noCam(g); g.globalAlpha = a;
  for (const [dx, dy, rr_] of [[-r * 0.9, r * 1.05, 14], [-r * 0.7, r * 0.85, 22]]) { g.fillStyle = 'rgba(230,220,220,0.85)'; g.beginPath(); g.arc(x + dx, y + dy, rr_, 0, 7); g.fill(); }
  g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = '#e9e2df'; g.fill(); g.save(); g.beginPath(); g.arc(x, y, r - 8, 0, 7); g.clip(); draw(g); g.fillStyle = 'rgba(140,0,20,0.3)'; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore();
  g.restore();
}
// the small worry notebook
function notebook(g, x, y, s = 1, rot = 0, open = 0) { g.save(); g.translate(x, y); g.rotate(rot); box(g, -40 * s, -54 * s, 80 * s, 108 * s, '#2f4f7a', 6 * s); g.fillStyle = '#e9e2cf'; g.fillRect(-28 * s, -40 * s, 56 * s, 14 * s); ln(g, [-40 * s, -54 * s, -40 * s, 54 * s], 5 * s, '#1d3150'); g.restore(); }

// ================================================================ THE LAST WORD
const GF = { col: '#C9A77A', acc: 'longhair', accCol: '#2e2420' }, DADW = { col: '#A9A9B4', acc: 'glasses' }, MOMW = { col: '#A9A9B4', acc: 'longhair', accCol: '#2e2a33' };
const MATE = { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' }, BUD = { col: '#8d8d9b', acc: 'cap', accCol: '#2f4f7a' };
function winsHud(g, n, a = 1) { hud(g, 'WINS', Math.round(n), a); }
function wallsHud(g, n, a = 1) { hud(g, 'WALLS', Math.round(n), a); }
// a brick wall standing on floor y, centred at x. k = how high it has risen (0..1). fall = 0..1 crumbling (bricks tumble).
function brickWall(g, x, y, w, h, k, fall = 0, seed = 3) {
  if (k <= 0) return; const bh = 34, bw = 72, rows = Math.ceil(h * clamp(k) / bh), q = rng(seed);
  g.save(); g.lineWidth = 2;
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? bw / 2 : 0;
    for (let c = -1; c * bw < w + bw; c++) {
      let bx = x - w / 2 + c * bw + off, by = y - (r + 1) * bh, ww = bw - 4;
      if (bx + ww < x - w / 2 || bx > x + w / 2) continue;
      const cx0 = Math.max(bx, x - w / 2), cx1 = Math.min(bx + ww, x + w / 2);
      const shade = 0.75 + q() * 0.25;
      g.save();
      if (fall > 0) { const d = clamp(fall * 1.6 - (rows - r) / rows * 0.6 - q() * 0.2); g.translate((q() - 0.5) * 300 * d, d * d * (y - by + 200)); g.rotate((q() - 0.5) * 4 * d); g.globalAlpha = 1 - clamp(d * 1.2 - 0.2); }
      g.fillStyle = `rgb(${Math.round(150 * shade)},${Math.round(72 * shade)},${Math.round(44 * shade)})`; g.strokeStyle = '#2a1a14';
      g.fillRect(cx0, by + 2, cx1 - cx0, bh - 4); g.strokeRect(cx0, by + 2, cx1 - cx0, bh - 4);
      g.restore();
    }
  }
  if (fall <= 0) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x - w / 2, y - rows * bh, w, rows * bh); }
  g.restore();
}
function dust(g, x, y, t, t0, w = 200) { if (t < t0 || t > t0 + 1.2) return; const k = t - t0, q = rng(29); g.save(); for (let i = 0; i < 14; i++) { const px = x + (q() - 0.5) * w + (q() - 0.5) * 160 * k, py = y - q() * 30 - 60 * k; g.fillStyle = `rgba(190,170,150,${0.35 * (1 - k / 1.2)})`; g.beginPath(); g.arc(px, py, 10 + 30 * k * q(), 0, 7); g.fill(); } g.restore(); }
// the family dinner table (front), people sit behind it with their hips at y 744
const DT_Y = 728;
function dinnerTable(g, t) {
  box(g, 380, DT_Y, 1160, 16, '#2a2530', 6); box(g, 400, DT_Y + 16, 1120, 106, '#1c1922');
  for (const x of [520, 700, 880, 1060, 1240, 1400]) { g.fillStyle = '#f7f4ec'; g.beginPath(); g.ellipse(x, DT_Y - 4, 46, 10, 0, 0, 7); g.fill(); g.fillStyle = '#b0703a'; g.beginPath(); g.ellipse(x, DT_Y - 8, 24, 6, 0, 0, 7); g.fill(); }
  box(g, 940, DT_Y - 60, 40, 56, 'rgba(180,210,240,0.4)', 4); glow(g, 960, DT_Y - 80, 160, WARM, 0.2);
}
function seated(g, o, x, look, face = {}, extra = {}) { return Hero(g, { x, y: 744, hip: true, thigh: 20, s: 1.0, ...o, ...pose('table', x, 744, 1.0, { hip: true, tableY: 722 }), face: { look, blink: blink(NOW, x * 0.01), ...face }, ...extra }, { dir: look[0] >= 0 ? 1 : -1, amt: 0.25 }); }
// the PORCH at dusk: the house wall, the screen door (warm light inside), wooden boards, two chairs, a small table, tea
const PO_F = 860;
function porch(g, t, o = {}) {
  const gr = g.createLinearGradient(0, -200, 0, 700); gr.addColorStop(0, '#141626'); gr.addColorStop(0.7, '#3a3350'); gr.addColorStop(1, '#c98a66'); g.fillStyle = gr; g.fillRect(-500, -400, 3000, 1300);
  skyline(g, 700, 1300, 2600, 61, '#0d0c14');
  g.fillStyle = '#1b1922'; g.fillRect(-500, -400, 1700, PO_F + 400); g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; for (let y = -380; y < PO_F; y += 36) { g.beginPath(); g.moveTo(-500, y); g.lineTo(1200, y); g.stroke(); }
  box(g, 120, 360, 220, 500, '#2a2028', 6); g.fillStyle = `rgba(255,205,140,${o.doorLit ?? 0.55})`; g.fillRect(136, 376, 188, 470); glow(g, 230, 600, 380, WARM, 0.25 * (o.doorLit ?? 0.55));
  g.strokeStyle = '#3a3040'; g.lineWidth = 4; for (let y = 400; y < 840; y += 40) { g.beginPath(); g.moveTo(140, y); g.lineTo(320, y); g.stroke(); }
  box(g, 520, 300, 260, 200, '#0b0d1c', 4); g.fillStyle = 'rgba(255,205,140,0.35)'; g.fillRect(532, 312, 236, 176);
  ln(g, [1200, -400, 1200, PO_F], 10, '#3a2a1c');
  g.fillStyle = '#2a1f18'; g.fillRect(-500, PO_F, 3000, 700); for (let x = -500; x < 2500; x += 90) ln(g, [x, PO_F, x + 40, PO_F + 300], 2, 'rgba(0,0,0,0.4)'); ln(g, [-500, PO_F, 2500, PO_F], 3, '#4a3626');
  for (let x = 1240; x < 2400; x += 70) ln(g, [x, PO_F, x, PO_F - 220], 8, '#4a3626'); ln(g, [1220, PO_F - 220, 2400, PO_F - 220], 12, '#4a3626');
  for (let i = 0; i < 9; i++) { const x = 500 + i * 140, y = 120 + Math.sin(i) * 14; g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); glow(g, x, y, 60, WARM, 0.35); }
  g.strokeStyle = 'rgba(80,70,60,0.8)'; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 9; i++) { const x = 500 + i * 140, y = 120 + Math.sin(i) * 14; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  glow(g, 1600, 600, 700, WARM, 0.18);
}
function porchChair(g, x, front = false) { if (front) { box(g, x - 80, 740, 160, 18, '#5a3d24', 6); ln(g, [x - 70, 758, x - 70, PO_F], 6, '#5a3d24'); ln(g, [x + 70, 758, x + 70, PO_F], 6, '#5a3d24'); } else { box(g, x - 80, 560, 160, 190, '#4a3220', 10); } }
function porchTable(g, x, cups = 2, steam = 1, t = 0) { box(g, x - 60, 720, 120, 14, '#5a3d24', 4); ln(g, [x, 734, x, PO_F], 6, '#5a3d24'); for (let i = 0; i < cups; i++) chai(g, x - 22 + i * 44, 720, steam, t + i); }

// ---- the four places (shared by the fall and the mirrored recovery)
const HX = 860, GX = 1100, WX = 980;
function couchShot(g, t, o) {
  apartment(g, t, { guitar: false });
  const hr = Hero(g, { x: HX, y: 712, hip: true, thigh: 20, s: 1.05, ...(o.phone ? { handR: [HX + 120, 600] } : pose('hold', HX, 712, 1.05, { hip: true })), face: { look: o.hLook || [0.8, 0], smile: o.hSmile ?? 0.3, sad: o.hSad ?? 0, blink: blink(t, 0.4) } }, { dir: -1 });
  if (o.extra) o.extra();
  const gf = Hero(g, { x: GX, y: 712, hip: true, thigh: 20, s: 1.0, ...GF, ...pose('hold', GX, 712, 1.0, { hip: true }), face: { look: o.gLook || [-0.8, 0], smile: o.gSmile ?? 0.6, sad: o.gSad ?? 0, blink: blink(t, 1.2) } }, { dir: -1 });
  if (o.phone) phoneAt(g, HX + 120, 590, 1.05, 0.9, 0.3);
  apFront(g, t);
  if (o.wall) { brickWall(g, WX, 880, 70, 600, o.wall, o.fall || 0, 5); dust(g, WX, 880, t, o.wallT); }
  return { hr, gf };
}
function dinnerShot(g, t, o = {}) {
  kitchen(g, t, { night: true, lamp: 1, note: 'GROCERIES' });
  const dd = seated(g, DADW, 740, o.dLook || [0.5, 0], { smile: o.dSmile ?? 0.7, sad: o.dSad ?? 0 });
  seated(g, MOMW, 560, [0.6, 0], { smile: 0.5 });
  const lg = o.laugh ? Math.abs(Math.sin(t * 10)) * 5 : 0;
  seated(g, { col: '#C9A77A', acc: 'cap', accCol: '#3b6a4a' }, 1290, [-0.6, 0], { smile: o.laugh ? 1 : 0.5 }, { headOff: [0, -lg] });
  seated(g, { col: '#8d8d9b', acc: 'longhair', accCol: '#3a2a22' }, 1470, [-0.7, 0], { smile: o.laugh ? 1 : 0.5 }, { headOff: [0, -lg] });
  const hr = seated(g, {}, 1090, o.hLook || [-0.6, 0], { smile: o.hSmile ?? 0.3 });
  dinnerTable(g, t);
  if (o.wall) { brickWall(g, 910, 900, 70, 640, o.wall, o.fall || 0, 9); dust(g, 910, 900, t, o.wallT); }
  return { dd, hr };
}
function lockerShot(g, t, o = {}) {
  lockers(g, t);
  box(g, 820, 720, 520, 18, '#2a2832', 6); ln(g, [850, 738, 850, 840], 6); ln(g, [1310, 738, 1310, 840], 6);
  const mt = Hero(g, { x: 1120, y: 744, hip: true, thigh: 20, s: 1.0, ...MATE, ...pose('face', 1120, 744, 1.0, { hip: true }), headOff: [0, 12], face: { look: [-0.2, 0.9], sad: 1, smile: -0.3, blink: 1 } }, { dir: -1 });
  const hr = o.sit ? Hero(g, { x: 990, y: 744, hip: true, thigh: 20, s: 1.05, handR: [1080, 590], face: { look: [0.8, 0.3], smile: 0.3, sad: 0.3, blink: blink(t, 0.4) } }, { dir: 1 }) : Hero(g, { x: 700, y: 840, s: 1.05, ...(o.point ? { handR: [820, 560] } : {}), face: { look: [0.8, 0.3], smile: o.smile ?? 0.2, sad: -0.3, blink: blink(t, 0.4) } }, { dir: 1 }); if (!o.sit) floorShadow(g, 700, 842, 90);
  if (o.wall) { brickWall(g, 900, 880, 70, 640, o.wall, o.fall || 0, 13); dust(g, 900, 880, t, o.wallT); }
  return { mt, hr };
}
function cafeShot(g, t, o = {}) {
  restaurant(g, t);
  const bd = Hero(g, { x: 1120, y: 770, hip: true, thigh: 20, s: 1.05, ...BUD, ...pose('table', 1120, 770, 1.05, { hip: true, tableY: 708 }), headOff: [0, 10], face: { look: [-0.4, 0.6], sad: 0.9, smile: -0.2, blink: blink(t, 1.3) } }, { dir: -1 });
  const hr = Hero(g, { x: 800, y: 770, hip: true, thigh: 20, s: 1.05, ...pose('table', 800, 770, 1.05, { hip: true, tableY: 708 }), ...(o.point ? { handR: [920, 620] } : o.reach ? { handR: [1010, 690] } : {}), face: { look: [0.8, 0], smile: o.smile ?? 0.2, sad: -0.3, blink: blink(t, 0.4) } }, { dir: 1 });
  restTable(g, 960, 708, 480); chai(g, 880, 708); chai(g, 1060, 708);
  if (o.wall) { brickWall(g, 960, 900, 70, 640, o.wall, o.fall || 0, 17); dust(g, 960, 900, t, o.wallT); }
  return { bd, hr };
}

// ================================================================ REBUILDING
const GOLD = '#F2B33D', GOLDRGB = '242,179,61';
function cracksHud(g, n, a = 1) { hud(g, 'CRACKS', Math.round(n), a); }
function goldHud(g, n, a = 1) { hud(g, 'GOLD', Math.round(n) + ' / 4', a); }
// the four cracks, as zig-zags relative to his body (r from person()). k = 0..1 how far each has run.
// gold[i] = 0..1 how much of crack i is filled with gold.
function crackPaths(r, s) {
  const [nx, ny] = r.neck, [hx, hy] = r.hip, [cx, cy] = r.head, R = r.hr;
  return [
    [[nx - 18 * s, ny + 34 * s], [nx + 6 * s, ny + 52 * s], [nx - 10 * s, ny + 70 * s], [nx + 14 * s, ny + 92 * s], [nx + 2 * s, hy - 20 * s]],          // chest
    [[cx - R * 0.55, cy - R * 0.7], [cx - R * 0.3, cy - R * 0.35], [cx - R * 0.5, cy - R * 0.05], [cx - R * 0.2, cy + R * 0.3], [cx - R * 0.3, cy + R * 0.6]], // face
    [[nx + 34 * s, ny + 22 * s], [nx + 24 * s, ny + 48 * s], [nx + 40 * s, ny + 70 * s], [hx + 26 * s, hy - 28 * s], [hx + 34 * s, hy - 4 * s]],         // side / back
    [[hx - 18 * s, hy + 18 * s], [hx - 30 * s, hy + 46 * s], [hx - 16 * s, hy + 74 * s], [hx - 28 * s, hy + 104 * s], [hx - 20 * s, hy + 130 * s]],      // leg
  ];
}
function cracks(g, r, s, k, gold = [0, 0, 0, 0], t = 0) {
  const P = crackPaths(r, s);
  P.forEach((pts, i) => {
    const kk = clamp(k[i] || 0); if (kk <= 0) return;
    const n = Math.max(2, Math.ceil(pts.length * kk));
    const gd = clamp(gold[i] || 0);
    const path = () => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let j = 1; j < n; j++) g.lineTo(pts[j][0], pts[j][1]); };
    g.save(); g.lineCap = 'round'; g.lineJoin = 'miter';
    if (gd < 1) { path(); g.strokeStyle = 'rgba(40,30,30,0.9)'; g.lineWidth = 4.5 * s; g.stroke(); path(); g.strokeStyle = 'rgba(255,90,70,0.35)'; g.lineWidth = 1.5 * s; g.stroke(); }
    if (gd > 0) { // gold flows along the crack
      const m = Math.max(2, Math.ceil(n * gd)); g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let j = 1; j < m; j++) g.lineTo(pts[j][0], pts[j][1]);
      g.shadowColor = GOLD; g.shadowBlur = 14 * s; g.strokeStyle = GOLD; g.lineWidth = 6 * s; g.stroke(); g.shadowBlur = 0; g.strokeStyle = '#fff3c4'; g.lineWidth = 2 * s; g.stroke(); }
    g.restore();
  });
}
// a falling chip of him (cream shard)
function chip(g, x, y, t, t0, s = 1) { if (t < t0 || t > t0 + 1.4) return; const k = t - t0; g.save(); g.translate(x - 30 * k, y + 380 * k * k); g.rotate(k * 5); g.globalAlpha = 1 - k / 1.4; g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 2; g.beginPath(); g.moveTo(-10 * s, -6 * s); g.lineTo(12 * s, -8 * s); g.lineTo(4 * s, 10 * s); g.closePath(); g.fill(); g.stroke(); g.restore(); }
// the clay handprint he made for his mom at six (a round tile with a small hand pressed in). pieces = 0 whole, 0..1 shattering; gold = mended
function handprint(g, x, y, s = 1, o = {}) {
  const br = o.breakK || 0, q = rng(41), parts = 6;
  if (br <= 0) { g.fillStyle = '#e2c49a'; g.strokeStyle = C.line; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 70 * s, 0, 7); g.fill(); g.stroke(); g.strokeStyle = 'rgba(120,80,40,0.35)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 62 * s, 0, 7); g.stroke(); }
  else for (let i = 0; i < parts; i++) {
    const a0 = i / parts * Math.PI * 2, a1 = (i + 1) / parts * Math.PI * 2, am = (a0 + a1) / 2;
    g.save(); g.translate(x, y);
    if (br > 0) { const d = br; g.translate(Math.cos(am) * 120 * d * (0.5 + q()), d * d * 300 + Math.sin(am) * 40 * d); g.rotate((q() - 0.5) * 3 * d); }
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 70 * s, a0, a1); g.closePath(); g.fillStyle = '#e2c49a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2.5; g.stroke();
    g.restore();
  }
  if (br <= 0) {
    g.save(); g.translate(x, y); g.fillStyle = '#b8895a';
    g.beginPath(); g.ellipse(0, 12 * s, 24 * s, 22 * s, 0, 0, 7); g.fill();
    for (let f = 0; f < 5; f++) { const a = -2.4 + f * 0.42; g.beginPath(); g.ellipse(Math.cos(a) * 34 * s, 12 * s + Math.sin(a) * 34 * s, 6 * s, 13 * s, a + Math.PI / 2, 0, 7); g.fill(); }
    g.fillStyle = '#5a3a24'; g.font = `700 ${14 * s}px "Patrick Hand"`; g.textAlign = 'center'; g.fillText('FOR MOM', 0, 56 * s);
    if (o.gold) { g.save(); g.shadowColor = GOLD; g.shadowBlur = 12; g.strokeStyle = GOLD; g.lineWidth = 4 * s; for (let i = 0; i < parts; i++) { const a = i / parts * Math.PI * 2; g.beginPath(); g.moveTo(0, 0); const m = clamp(o.gold * parts - i); g.lineTo(Math.cos(a) * 70 * s * m, Math.sin(a) * 70 * s * m); g.stroke(); } g.restore(); }
    g.restore();
  }
}
// the golden pen
function goldPen(g, x, y, s = 1, rot = -0.7, glowK = 0.5) { g.save(); g.translate(x, y); g.rotate(rot); box(g, -6 * s, -70 * s, 12 * s, 70 * s, GOLD, 4); g.fillStyle = '#3a2a14'; g.fillRect(-6 * s, -70 * s, 12 * s, 14 * s); g.fillStyle = '#fff3c4'; g.beginPath(); g.moveTo(-6 * s, 0); g.lineTo(6 * s, 0); g.lineTo(0, 14 * s); g.closePath(); g.fill(); g.restore(); if (glowK) glow(g, x, y, 50 * s, GOLDRGB, 0.4 * glowK); }
// ---- the open-mic stage (a small cafe stage): spotlight, mic, a few rows of audience backs
const ST_F = 760;
function openMic(g, t, o = {}) {
  restaurant(g, t);
  box(g, 560, ST_F, 800, 40, '#2a2028', 4); box(g, 560, ST_F + 40, 800, 90, '#1d161b');
  g.fillStyle = '#d9a657'; g.font = '800 34px Nunito'; g.textAlign = 'center'; g.fillText('OPEN MIC NIGHT', 960, 160);
  ln(g, [960, -200, 960, 90], 4); glow(g, 960, 300, 600, WARM, 0.18 * (o.spot ?? 1)); pool(g, 960, ST_F, 360, WARM, 0.3 * (o.spot ?? 1));
  if (o.mic !== false) { ln(g, [1060, ST_F, 1060, 560], 5, '#3a3846'); g.fillStyle = '#2a2832'; g.beginPath(); g.ellipse(1060, 552, 12, 18, 0, 0, 7); g.fill(); }
}
// audience in front (backs of heads + shoulders), reacting: 'laugh' | 'clap' | 'still'
function audience(g, t, mode = 'still', y0 = 1000) {
  const cols = ['#A9A9B4', '#C9A77A', '#8d8d9b', '#9a8d7e'];
  for (let row = 0; row < 2; row++) for (let i = 0; i < 9; i++) {
    const x = 180 + i * 200 + row * 100, y = y0 + row * 110, bob = mode === 'laugh' ? Math.abs(Math.sin(t * 10 + i)) * 10 : 0;
    g.fillStyle = cols[(i + row) % 4]; g.strokeStyle = C.line; g.lineWidth = 3;
    g.beginPath(); g.ellipse(x, y + 70, 80, 60, 0, Math.PI, 0); g.fill(); g.stroke();
    g.beginPath(); g.arc(x, y - bob, 46, 0, 7); g.fill(); g.stroke();
    if (mode === 'clap') { const k = Math.abs(Math.sin(t * 12 + i)); g.beginPath(); g.ellipse(x - 30 + k * 12, y + 10, 16, 20, 0, 0, 7); g.ellipse(x + 30 - k * 12, y + 10, 16, 20, 0, 0, 7); g.fill(); g.stroke(); }
    if (mode === 'laugh' && i % 3 === 1) { box(g, x + 40, y - 70, 30, 50, '#0a0a0e', 4); glow(g, x + 55, y - 45, 40, GREEN, 0.4); }
  }
}
// ---- the house party: the apartment with coloured light, people dancing
function party(g, t) {
  apartment(g, t, { guitar: false });
  const c = [['255,80,160'], ['80,160,255'], ['160,80,255'], ['80,220,180']];
  for (let i = 0; i < 4; i++) { const ph = (t * 0.8 + i * 0.25) % 1; glow(g, 300 + i * 450 + Math.sin(t + i) * 120, 300, 520, c[i][0], 0.18 * (0.5 + 0.5 * Math.sin(t * 3 + i))); }
  for (let i = 0; i < 14; i++) { const x = 100 + i * 140; g.fillStyle = ['#FF4FA0', '#4FA0FF', '#F2B33D', '#4FE0B0'][i % 4]; g.beginPath(); g.arc(x, 90 + Math.sin(i) * 10, 9, 0, 7); g.fill(); }
}
function dancer(g, x, y, o, t, ph = 0) { const k = Math.sin(t * 6 + ph); return P(g, { x: x + k * 6, y: y - Math.abs(k) * 6, s: 1.0, ...o, handL: [x - 70, y - 300 + k * 30], handR: [x + 70, y - 300 - k * 30], face: { look: [k * 0.5, -0.2], smile: 0.9 } }); }
// ---- a classroom (math)
function classroom(g, t, o = {}) {
  g.fillStyle = '#14131a'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0d0c11'; g.fillRect(-500, 850, 3000, 700); ln(g, [-500, 850, 2500, 850]);
  for (const lx of [500, 1400]) { ln(g, [lx - 120, 70, lx + 120, 70], 8, 'rgba(220,230,250,0.75)'); glow(g, lx, 90, 500, COLD, 0.1); }
  box(g, 560, 170, 800, 280, '#1d2a24', 6); g.fillStyle = 'rgba(240,240,230,0.85)'; g.font = '700 52px "Patrick Hand"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MATH 101', 960, 240); g.font = '400 40px "Patrick Hand"'; g.fillText('x² + 5x + 6 = 0', 960, 320); g.fillText('TESTS RETURNED', 960, 390);
  wallClock(g, 1600, 230, 56, 10.2); box(g, 200, 200, 180, 240, '#3b6fb6', 6);
}
// the test paper (insert, top-down)
function testPaper(g, x, y, s, score, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.04); g.scale(s, s);
  box(g, -320, -420, 640, 840, '#f7f4ec', 8); g.fillStyle = '#2b2b38'; g.font = '700 44px "Patrick Hand"'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('MATH TEST', -270, -350);
  for (let i = 0; i < 7; i++) { g.strokeStyle = 'rgba(60,60,80,0.3)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-270, -250 + i * 80); g.lineTo(150, -250 + i * 80); g.stroke(); const ok = o.marks ? o.marks[i] : i % 3 === 0;
    g.strokeStyle = ok ? '#2e9e6a' : '#d0453a'; g.lineWidth = 6; g.beginPath(); if (ok) { g.moveTo(190, -255 + i * 80); g.lineTo(205, -240 + i * 80); g.lineTo(235, -275 + i * 80); } else { g.moveTo(190, -270 + i * 80); g.lineTo(230, -235 + i * 80); g.moveTo(230, -270 + i * 80); g.lineTo(190, -235 + i * 80); } g.stroke(); }
  const good = score >= 60; g.strokeStyle = good ? '#2e9e6a' : '#d0453a'; g.lineWidth = 9; g.beginPath(); g.arc(170, -330, 80, 0, 7); g.stroke();
  g.fillStyle = good ? '#2e9e6a' : '#d0453a'; g.font = '800 76px Nunito'; g.textAlign = 'center'; g.fillText(String(score), 170, -326);
  g.restore();
}
// ---- the backstage wings (dark, a curtain, the stage light spilling in)
function backstage(g, t) {
  g.fillStyle = '#0f0d12'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0a090c'; g.fillRect(-500, 850, 3000, 700); ln(g, [-500, 850, 2500, 850]);
  for (let i = 0; i < 9; i++) { const x = 1300 + i * 60; g.fillStyle = i % 2 ? '#5a1820' : '#6a1e28'; g.fillRect(x, -400, 64, 1250); }
  glow(g, 1600, 500, 600, WARM, 0.22); for (let i = 0; i < 4; i++) box(g, 200 + i * 130, 760, 110, 90, '#24222c', 4);
}
// the crack / gold timeline (global seconds) - every shot reads it, so his body is always consistent
const CR = [[18.0, 18.8], [31.0, 31.8], [48.6, 49.4], [60.2, 61.0]], GD = [[112.4, 113.2], [118.6, 119.4], [124.0, 124.8], [140.4, 141.2]];
function crackK(t) { return CR.map(([a, b]) => es(t, a, b)); }
function goldK(t) { return GD.map(([a, b]) => es(t, a, b)); }
function nCracks(t) { return CR.filter(([a]) => t >= a).length; }
function nGold(t) { return GD.filter(([a, b]) => t >= b).length; }
function Me(g, t, o, lt = { dir: 1 }) { const r = Hero(g, o, lt); cracks(g, r, o.s || 1, crackK(t), goldK(t), t); return r; }
function hudFor(g, t) { if (t < 106) cracksHud(g, nCracks(t)); else goldHud(g, nGold(t)); }
function heldGuitar(g, r, s = 1, play = 0) { guitar(g, r.hip[0] + 20 * s, r.hip[1] + 40 * s, 0, 0.8 * s, -1.2, play); }

// ================================================================ AFTER HER - the colour theme
const ROSE = '#FF7A9A', ROSERGB = '255,122,154';
function daysHud(g, n, a = 1) { g.save(); noCam(g); g.globalAlpha = 0.55 * a; g.fillStyle = '#14121a'; rr(g, 56, 84, PORTRAIT ? 380 : 260, PORTRAIT ? 90 : 56, 28); g.fill(); g.restore(); hud(g, 'DAYS SINCE', Math.round(n), a); }
function grad(g, x, y, w, h, stops) { const gr = g.createLinearGradient(0, y, 0, y + h); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(x, y, w, h); }
const CF = 740;   // bedroom floor (same bed geometry as heroRoom, so SIT / SS still work)
// HIS BEDROOM in colour. o.mode: 'night' | 'morning' | 'evening'; o.dust (gym bag + guitar dusty), o.lamp, o.open (window open, sunlight)
function cRoom(g, t, o = {}) {
  const m = o.mode || 'night', N = m === 'night', M = m === 'morning';
  grad(g, -500, -400, 3000, CF + 400, N ? [[0, '#1c2346'], [1, '#2c3766']] : M ? [[0, '#7fa6d2'], [1, '#a9c4e0']] : [[0, '#a8627a'], [1, '#d08a72']]);
  g.fillStyle = N ? '#3b2a22' : '#9a6a48'; g.fillRect(-500, CF, 3000, 700); for (let x = -500; x < 2500; x += 120) ln(g, [x, CF, x - 60, CF + 360], 2, 'rgba(0,0,0,0.18)'); ln(g, [-500, CF, 2500, CF], 3, 'rgba(0,0,0,0.3)');
  g.fillStyle = N ? '#24204a' : '#c9a37a'; g.fillRect(-500, CF - 20, 3000, 20);
  // window + sky
  const sky = N ? [[0, '#0b1030'], [1, '#2a2f6a']] : M ? [[0, '#5fb4f0'], [1, '#d8f0ff']] : [[0, '#6a4a8a'], [0.6, '#f08a5a'], [1, '#ffd08a']];
  grad(g, 960, 170, 320, 300, sky);
  g.save(); g.beginPath(); g.rect(960, 170, 320, 300); g.clip();
  if (N) { g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(1210, 230, 26, 0, 7); g.fill(); const q = rng(3); for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + q() * 0.5})`; g.fillRect(960 + q() * 320, 175 + q() * 200, 3, 3); } }
  else { g.fillStyle = M ? '#fff3b0' : '#ffd27a'; g.beginPath(); g.arc(M ? 1220 : 1120, M ? 230 : 430, 38, 0, 7); g.fill(); }
  const qq = rng(9); for (let x = 960; x < 1280; x += 46) { const h = 40 + qq() * 90; g.fillStyle = N ? '#141a3a' : M ? '#6b86a8' : '#5a3a5a'; g.fillRect(x, 470 - h, 44, h); if (N && qq() > 0.4) { g.fillStyle = '#ffd27a'; g.fillRect(x + 14, 470 - h + 12, 10, 12); } }
  g.restore();
  box(g, 960, 170, 320, 300, 'rgba(0,0,0,0)'); g.strokeStyle = '#f3ead8'; g.lineWidth = 12; g.strokeRect(960, 170, 320, 300); g.lineWidth = 6; g.beginPath(); g.moveTo(1120, 170); g.lineTo(1120, 470); g.stroke();
  const op = o.open || 0;   // curtains
  g.fillStyle = N ? '#7a3a5a' : '#e0708a'; g.beginPath(); g.moveTo(940 - op * 60, 150); g.quadraticCurveTo(990 - op * 80, 330, 950 - op * 60, 500); g.lineTo(900 - op * 60, 500); g.lineTo(900 - op * 60, 150); g.fill();
  g.beginPath(); g.moveTo(1300 + op * 60, 150); g.quadraticCurveTo(1250 + op * 80, 330, 1290 + op * 60, 500); g.lineTo(1340 + op * 60, 500); g.lineTo(1340 + op * 60, 150); g.fill();
  if (!N) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,230,170,${0.10 + 0.12 * op})`; g.beginPath(); g.moveTo(960, 470); g.lineTo(1280, 470); g.lineTo(1000, CF + 200); g.lineTo(560, CF + 200); g.closePath(); g.fill(); g.restore(); }
  glow(g, 1120, 320, 460, N ? '120,140,255' : WARM, N ? 0.12 : 0.22);
  // posters
  box(g, 520, 220, 170, 230, '#2f4f7a', 6); g.fillStyle = '#FFD27A'; g.beginPath(); g.arc(605, 300, 40, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.fillText('SUMMER', 605, 400);
  box(g, 730, 260, 140, 110, '#f3ead8', 4); g.fillStyle = '#d9a0b0'; g.fillRect(744, 274, 112, 82);
  // desk + lamp
  box(g, 1420, 600, 380, 16, '#8a5a3c', 4); ln(g, [1436, 616, 1436, CF], 6, '#6a4430'); ln(g, [1784, 616, 1784, CF], 6, '#6a4430');
  box(g, 1690, 520, 70, 80, '#3b6fb6', 8); if (o.lamp ?? N) { glow(g, 1725, 560, 300, WARM, 0.35); pool(g, 1650, 606, 240, WARM, 0.3); }
  // guitar + gym bag
  guitar(g, 1880, CF, o.dust ?? 0, 1, -0.18);
  box(g, 1480, CF - 70, 160, 70, '#c0453a', 22); ln(g, [1500, CF - 70, 1620, CF - 70], 4, '#7a2a24');
  if (o.dust) { g.fillStyle = 'rgba(220,210,190,0.35)'; g.fillRect(1490, CF - 72, 140, 8); }
  // bed (left)
  rr(g, 120, 520, 46, 300, 10); g.fillStyle = '#6a4430'; g.fill(); box(g, 160, 720, 690, 46, '#8a5a3c', 6); box(g, 820, 766, 18, 50, '#6a4430');
  rr(g, 160, 656, 700, 70, 22); g.fillStyle = '#2fa39a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2.5; g.stroke(); rr(g, 178, 624, 160, 50, 22); g.fillStyle = '#f3ead8'; g.fill(); g.stroke();
  box(g, 40, 640, 78, 100, '#8a5a3c', 4);
  if (o.lying) {
    const hx = 262, hy = 606, eyes = o.eyesOpen;
    g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 3.4; g.beginPath(); g.arc(hx, hy, 50, 0, 7); g.fill(); g.stroke();
    g.fillStyle = C.line; g.lineWidth = 3;
    if (eyes) { g.beginPath(); g.ellipse(hx + 26, hy - 2, 4.5, 7, 0, 0, 7); g.fill(); } else { g.beginPath(); g.moveTo(hx + 19, hy); g.quadraticCurveTo(hx + 26, hy + 5, hx + 33, hy); g.stroke(); }
    g.beginPath(); g.moveTo(hx + 17, hy - 22); g.quadraticCurveTo(hx + 26, hy - (o.sad ? 18 : 26), hx + 35, hy - 22); g.stroke();
    g.beginPath(); g.moveTo(300, 680); g.quadraticCurveTo(330, 610, 430, 612); g.quadraticCurveTo(640, 604, 850, 650); g.lineTo(858, 700); g.lineTo(300, 706); g.closePath(); g.fillStyle = '#3ab8ad'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2.5; g.stroke();
    return { head: [hx, hy] };
  }
}
function cBedFront(g) { rr(g, 160, 664, 700, 62, 22); g.fillStyle = '#2fa39a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2.5; g.stroke(); }
function cOnBed(g, t, o = {}) { cRoom(g, t, o); if (o.behind) o.behind(); const r = Hero(g, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: SS, face: { look: [0.6, 0.2], sad: 0.5, blink: blink(t, 0.6) }, ...(o.hero || {}) }, { dir: 1, amt: 0.3, dim: 0.02 }); if (o.mid) o.mid(r); cBedFront(g); return r; }
// HER MEMORY: a grey, slightly see-through version of her (drawn on its own layer so it is evenly transparent)
let _HL;
function memoryHer(g, x, y, s, a, o = {}) {
  if (a <= 0) return null; if (!_HL) _HL = mk(W, H);
  const l = _HL.getContext('2d'); noCam(l); l.clearRect(0, 0, W, H); l.setTransform(g.getTransform());
  const r = person(l, { x, y, s, col: '#A9A9B4', acc: 'longhair', accCol: '#3a3440', ...o, face: { smile: 0.6, look: [0.6, 0], ...(o.face || {}) } });
  g.save(); noCam(g); g.globalAlpha = a * 0.85; g.drawImage(_HL, 0, 0); g.restore();
  return r;
}
// rose petals / sparkles (her memory dissolving)
function petals(g, x, y, t, t0, n = 20) { if (t < t0) return; const k = t - t0, q = rng(55); for (let i = 0; i < n; i++) { const a = q() * 7, v = 60 + q() * 160, px = x + Math.cos(a) * v * k + Math.sin(k * 3 + i) * 20, py = y - 40 * k - q() * 200 * k; g.save(); g.globalAlpha = Math.max(0, 0.9 - k / 3); g.fillStyle = i % 3 ? ROSE : '#ffe2ea'; g.translate(px, py); g.rotate(k * 3 + i); g.beginPath(); g.ellipse(0, 0, 8, 4, 0, 0, 7); g.fill(); g.restore(); } }
// THE GYM in colour (dawn): teal walls, wood floor, mirror wall, racks
const CG_F = 860;
function cGym(g, t, o = {}) {
  grad(g, -500, -400, 3000, CG_F + 400, [[0, '#2b7a86'], [1, '#3e95a0']]);
  g.fillStyle = '#c9a77a'; g.fillRect(-500, CG_F, 3000, 700); for (let x = -500; x < 2500; x += 140) ln(g, [x, CG_F, x - 80, CG_F + 300], 2, 'rgba(0,0,0,0.15)');
  for (let i = 0; i < 3; i++) { const x = 200 + i * 560; grad(g, x, 160, 440, 260, [[0, '#ffb07a'], [1, '#ffe2a8']]); g.strokeStyle = '#f3ead8'; g.lineWidth = 10; g.strokeRect(x, 160, 440, 260); }
  glow(g, 960, 300, 900, WARM, 0.2);
  box(g, 140, 470, 1640, 300, 'rgba(200,230,240,0.25)', 6); g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 30; g.beginPath(); g.moveTo(300, 760); g.lineTo(520, 480); g.moveTo(1200, 760); g.lineTo(1420, 480); g.stroke();
  for (const x of [260, 1660]) { box(g, x - 90, 560, 180, 300, '#2b2b33', 6); for (let k = 0; k < 4; k++) dumbbell(g, x, 600 + k * 60, 1.1); }
  g.fillStyle = '#fff'; g.font = '800 46px Nunito'; g.textAlign = 'center'; g.fillText('KEEP GOING', 960, 120);
  box(g, 700, CG_F - 10, 520, 14, '#c0453a', 4);
}
// THE COURT at sunset (game night): purple-orange sky, trees, orange court, lights coming on
const CC_F = 860;
function cCourt(g, t, o = {}) {
  grad(g, -500, -400, 3000, 900, [[0, '#5a4a9a'], [0.55, '#e0788a'], [1, '#ffc27a']]);
  g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(1500, 520, 70, 0, 7); g.fill(); glow(g, 1500, 520, 400, WARM, 0.3);
  const q = rng(17); for (let x = -500; x < 2500; x += 90) { const h = 120 + q() * 160; g.fillStyle = '#3a2a5a'; g.fillRect(x, 520 - h, 88, h); }
  for (let x = -400; x < 2400; x += 220) { g.fillStyle = '#2f6a4a'; g.beginPath(); g.arc(x, 560, 90, 0, 7); g.fill(); g.fillStyle = '#245a3c'; g.beginPath(); g.arc(x + 60, 590, 70, 0, 7); g.fill(); }
  g.fillStyle = '#d9733b'; g.fillRect(-500, 640, 3000, 900); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-500, 700); g.lineTo(2500, 700); g.ellipse(960, 920, 380, 90, 0, Math.PI, 0); g.stroke();
  g.strokeStyle = 'rgba(40,30,60,0.5)'; g.lineWidth = 1.5; for (let x = -500; x < 2500; x += 34) { g.beginPath(); g.moveTo(x, 420); g.lineTo(x + 220, 640); g.moveTo(x + 220, 420); g.lineTo(x, 640); g.stroke(); } ln(g, [-500, 420, 2500, 420], 4, '#3a3050');
  box(g, 1690, 250, 18, 610, '#2a2832'); box(g, 1550, 240, 160, 110, '#f3ead8', 4); g.strokeStyle = '#c0453a'; g.lineWidth = 4; g.strokeRect(1590, 272, 70, 50); g.beginPath(); g.ellipse(1570, 362, 40, 10, 0, 0, 7); g.stroke();
  for (const lx of [260, 1180]) { ln(g, [lx, CC_F, lx, 300], 7, '#3a3846'); g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(lx, 296, 14, 0, 7); g.fill(); glow(g, lx, 300, 260, WARM, 0.4 * (o.lights ?? 1)); }
}
// THE CAFE ("their" place): warm yellow walls, plants, a big window on the street, string lights
const CK_F = 860;
function cCafe(g, t, o = {}) {
  grad(g, -500, -400, 3000, CK_F + 400, [[0, '#f0b765'], [1, '#e8a050']]);
  g.fillStyle = '#7a4a2c'; g.fillRect(-500, 640, 3000, CK_F - 640); for (let x = -500; x < 2500; x += 60) ln(g, [x, 640, x, CK_F], 2, 'rgba(0,0,0,0.15)');
  g.fillStyle = '#5a3420'; g.fillRect(-500, CK_F, 3000, 700);
  grad(g, 700, 170, 560, 340, [[0, '#8fd0f0'], [1, '#d8f0ff']]); const q = rng(21); for (let x = 700; x < 1260; x += 70) { g.fillStyle = ['#e0708a', '#6a8ab8', '#8ab86a'][Math.floor(q() * 3)]; g.fillRect(x, 400 - q() * 120, 66, 200); } g.strokeStyle = '#f3ead8'; g.lineWidth = 12; g.strokeRect(700, 170, 560, 340);
  g.fillStyle = '#c0453a'; g.font = '800 40px Nunito'; g.textAlign = 'center'; g.fillText('CORNER CAFE', 980, 140);
  box(g, 1420, 200, 300, 220, '#2b2b33', 8); g.fillStyle = '#fff'; g.font = '700 30px "Patrick Hand"'; g.textAlign = 'left'; ['LATTE  4', 'MOCHA  5', 'COCOA  3', 'CAKE   4'].forEach((l, i) => g.fillText(l, 1450, 250 + i * 44));
  for (const x of [200, 560, 1820]) { box(g, x - 30, 560, 60, 80, '#c0453a', 6); g.fillStyle = '#3f8a4a'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + (k - 2) * 18, 530 - Math.abs(k - 2) * 10, 16, 40, (k - 2) * 0.3, 0, 7); g.fill(); } }
  g.strokeStyle = 'rgba(80,60,40,0.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-200, 80); for (let x = -200; x < 2200; x += 160) g.quadraticCurveTo(x + 80, 120, x + 160, 80); g.stroke();
  for (let x = -120; x < 2200; x += 80) { g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(x, 98, 7, 0, 7); g.fill(); glow(g, x, 100, 40, WARM, 0.4); }
  glow(g, 980, 340, 600, WARM, 0.18);
}
function cafeTable(g, x, y = 712, w = 300) { box(g, x - w / 2, y, w, 16, '#f3ead8', 8); ln(g, [x, y + 16, x, CK_F], 8, '#5a3420'); box(g, x - 60, CK_F - 8, 120, 10, '#5a3420', 4); }
// THE RAINY STREET at night: coloured shop lights, wet road with reflections, rain
const CR2_F = 860;
function cRain(g, t) {
  grad(g, -500, -400, 3000, 900, [[0, '#141a36'], [1, '#2a2f58']]);
  const q = rng(31); for (let x = -500; x < 2500; x += 160) { const h = 260 + q() * 260; g.fillStyle = '#1d2244'; g.fillRect(x, 640 - h, 156, h); for (let k = 0; k < 6; k++) if (q() > 0.4) { g.fillStyle = ['#ffd27a', '#7ad0ff', '#ff8fb0'][Math.floor(q() * 3)]; g.globalAlpha = 0.7; g.fillRect(x + 20 + (k % 3) * 44, 640 - h + 30 + Math.floor(k / 3) * 60, 26, 30); g.globalAlpha = 1; } }
  for (const [x, c, txt] of [[300, '255,120,170', 'BAR'], [1300, '120,210,255', 'OPEN 24/7']]) { g.fillStyle = `rgb(${c})`; g.font = '800 40px Nunito'; g.textAlign = 'center'; g.fillText(txt, x, 470); glow(g, x, 460, 220, c, 0.35); }
  g.fillStyle = '#1a1d30'; g.fillRect(-500, 640, 3000, 900);
  g.save(); g.globalAlpha = 0.25; g.scale(1, -1); g.translate(0, -1280); for (const [x, c] of [[300, '255,120,170'], [1300, '120,210,255']]) glow(g, x, 460, 260, c, 0.6); g.restore();
  for (const lx of [600, 1600]) { lampPost(g, lx, CR2_F, 520, 0.8); }
  g.strokeStyle = 'rgba(180,200,255,0.35)'; g.lineWidth = 2; const r = rng(7); for (let i = 0; i < 140; i++) { const x = (r() * 2600 - 300 + t * 200) % 2400 - 200, y = ((r() * 1200 + t * 1400) % 1300) - 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 8, y + 34); g.stroke(); }
}
