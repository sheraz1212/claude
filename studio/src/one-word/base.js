// ONE WORD - shared world. A coach says "useless" once. It sticks to his chest in purple
// handwriting, and he repeats it to himself 515 times.
const ACC = '#A66BFF', PUR = '166,107,255';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235', MAG = PUR;
const COACH = { col: '#A9A9B4', acc: 'cap', accCol: '#7a2f2f' }, LEO = { col: '#C9A77A', acc: 'scarf', accCol: '#2f6a5a' }, DAD = { col: '#b7a58f', acc: 'glasses' };
const HS = 1.15;
function glow(g, x, y, r, rgb, a) {
  if (a <= 0 || r <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
function pool(g, x, y, r, rgb, a) { g.save(); g.translate(x, y); g.scale(1, 0.2); glow(g, 0, 0, r, rgb, a); g.restore(); }
// the light in a chest. lv 1 = full, 0 = out (an empty dark ring)
function eyeBags(g, r, s, k) {
  if (k <= 0) return; g.save(); g.strokeStyle = `rgba(70,50,85,${Math.min(1, k * 1.2)})`; g.lineWidth = 2.4 * s; g.lineCap = 'round';
  for (const sg of [-1, 1]) for (let i = 0; i < (k > 0.6 ? 2 : 1); i++) { g.beginPath(); g.arc(r.head[0] + sg * 19 * s, r.head[1] + (3 + i * 5) * s, 10.5 * s, 0.35, Math.PI - 0.35); g.stroke(); }
  g.restore();
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
function card(text, w0 = 0.5, w1 = 2.6, size = 96) {
  const fn = (g, t, a, b) => blackLine(g, text, seg(t, a + w0, a + w1), ACC, 1 - seg(t, b - 0.6, b - 0.15), size);
  fn.black = true; return fn;
}

function wrap(g, text, max) { const out = []; let cur = ''; for (const w of text.split(' ')) { const n = cur ? cur + ' ' + w : w; if (g.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; } out.push(cur); return out; }
function phoneShot(g, t, o) {
  const u = seg(t, o.t0, o.t1), skin = o.hand || C.cream;
  noCam(g); g.fillStyle = '#0c0c12'; g.fillRect(0, 0, W, H);
  const q = rng(o.seed || 2); for (let i = 0; i < 7; i++) glow(g, q() * W, q() * H, 200 + q() * 260, o.bg || '60,60,90', 0.1);
  let shake = 0; for (const b of o.buzz || []) if (t >= b && t < b + 0.35) shake = Math.sin((t - b) * 95) * 5 * (1 - (t - b) / 0.35);
  setCam(g, { x: 960 - shake, y: 540 + Math.sin(t * 0.9) * 4, z: lerp(1, 1.06, ease(u)) });
  g.lineCap = 'round'; g.lineJoin = 'round';
  const hand = dark => {
    g.strokeStyle = g.fillStyle = dark ? C.line : skin;
    g.lineWidth = 210 + (dark ? 14 : 0); g.beginPath(); g.moveTo(1220, 800); g.lineTo(1800, 1120); g.stroke();
    g.beginPath(); g.ellipse(1130, 700, 150 + (dark ? 7 : 0), 185 + (dark ? 7 : 0), 0.25, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(742, 470 + i * 92, 50 + (dark ? 7 : 0), 40 + (dark ? 7 : 0), 0.1, 0, 7); g.fill(); }
  };
  glow(g, 960, 480, 640, o.glow || '150,180,255', 0.16);
  hand(true); hand(false);
  const px = 760, py = 84, pw = 400, ph = 740;
  g.save(); g.translate(960, 480); g.rotate(-0.025); g.translate(-960, -480);
  rr(g, px, py, pw, ph, 50); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.fillStyle = '#10131a'; g.fill();
  g.save(); rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.clip();
  if (o.draw) o.draw(g, px, py, pw, ph);
  else {
    g.fillStyle = '#171b25'; g.fillRect(px, py, pw, 118);
    g.fillStyle = o.av || '#A9A9B4'; g.beginPath(); g.arc(px + 62, py + 72, 25, 0, 7); g.fill(); g.fillStyle = o.avTop || '#6b4a5a'; g.beginPath(); g.arc(px + 62, py + 72, 26, Math.PI * 1.1, Math.PI * 1.9); g.fill();
    g.fillStyle = '#fff'; g.font = '700 32px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(o.name, px + 104, py + 66);
    g.fillStyle = '#8b93a5'; g.font = '400 19px Nunito'; g.fillText(o.sub, px + 105, py + 94); g.textAlign = 'right'; g.fillText(o.clock, px + pw - 34, py + 40);
    let y = py + 148;
    for (const m of o.msgs) {
      if (m.at > 0 && t < m.at) break;
      if (m.day) { g.fillStyle = '#737b8c'; g.font = '400 19px Nunito'; g.textAlign = 'center'; g.fillText(m.day, px + pw / 2, y + 8); y += 34; continue; }
      const pop = m.at > 0 ? ease(seg(t, m.at, m.at + 0.22)) : 1; g.font = '400 27px Nunito';
      const lines = wrap(g, m.text, 240), bw = Math.max(...lines.map(l => g.measureText(l).width)) + 40, bh = lines.length * 35 + 26;
      const bx = m.who === 's' ? px + 30 : px + pw - 30 - bw, ax = bx + (m.who === 's' ? 0 : bw);
      g.save(); g.translate(ax, y + bh); g.scale(0.6 + 0.4 * pop, 0.6 + 0.4 * pop); g.translate(-ax, -(y + bh)); g.globalAlpha = pop;
      rr(g, bx, y, bw, bh, 22); g.fillStyle = m.who === 's' ? '#272c38' : '#3d4a6b'; g.fill(); g.fillStyle = '#fff'; g.textAlign = 'left';
      lines.forEach((l, i) => g.fillText(l, bx + 20, y + 13 + 18 + i * 35)); g.restore(); y += bh + 14;
    }
  }
  g.restore(); g.restore();
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : skin; g.beginPath(); g.ellipse(1150, 600, 46 + (dark ? 7 : 0), 108 + (dark ? 7 : 0), -0.42, 0, 7); g.fill(); }
  g.fillStyle = skin; g.beginPath(); g.ellipse(1210, 700, 66, 86, 0.25, 0, 7); g.fill();
}


// ---------------------------------------------------------------- the word, the gloves, the two counters
function word(g, x, y, size, rot = -0.12, a = 1, col = ACC, txt = 'useless') {
  if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = clamp(a); g.font = `${size}px "Caveat Brush"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = `rgba(${PUR},0.8)`; g.shadowBlur = size * 0.3; g.fillStyle = col; g.fillText(txt, 0, 0); g.restore();
}
function chestWord(g, r, s, a = 1) { word(g, r.neck[0], r.neck[1] + 72 * s, 30 * s, -0.12, a); }
function gloves(g, r, s) { for (const h of [r.handL, r.handR]) { g.fillStyle = '#e9e4d6'; g.strokeStyle = '#1b1a20'; g.lineWidth = 1.6 * s; g.beginPath(); g.arc(h[0], h[1], 20 * s, 0, 7); g.fill(); g.stroke(); } }
function glovePair(g, x, y, s = 1, dust = 0) { for (const dx of [-16, 16]) { g.fillStyle = dust ? '#8f8b82' : '#e9e4d6'; g.strokeStyle = '#1b1a20'; g.lineWidth = 2 * s; rr(g, x + dx * s - 14 * s, y - 20 * s, 28 * s, 40 * s, 10 * s); g.fill(); g.stroke(); g.fillStyle = dust ? '#5d4a7a' : ACC; g.fillRect(x + dx * s - 14 * s, y + 10 * s, 28 * s, 8 * s); } }
function ball(g, x, y, r) { g.fillStyle = '#e9e4d6'; g.strokeStyle = '#1b1a20'; g.lineWidth = Math.max(1.5, r * 0.09); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#1b1a20'; g.beginPath(); for (let i = 0; i < 5; i++) { const an = -1.57 + i * 1.2566; g.lineTo(x + Math.cos(an) * r * 0.36, y + Math.sin(an) * r * 0.36); } g.fill(); }
function counters(g, he, a = 1) {
  g.save(); noCam(g); g.globalAlpha = 0.9 * a; g.textBaseline = 'middle'; g.textAlign = 'left'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 8;
  [['COACH SAID IT', 1, 110], ['HE SAID IT', he, 150]].forEach(([l, v, y]) => { g.font = '600 22px Nunito'; g.fillStyle = '#b9b3a2'; g.fillText(l, 76, y); g.font = '700 32px Nunito'; g.fillStyle = l[0] === 'H' ? ACC : C.text; g.fillText(String(v), 262, y); });
  g.restore();
}
const said = (t, pts) => Math.round(kf(t, pts));

// ---------------------------------------------------------------- THE PITCH and its goal (core place 1, mirrored at the end)
function pitch(g, t, o = {}) {
  skyline(g, 560, -400, 2400, 23, '#0f0e18', [[0, '#0a0a16'], [0.6, '#1c1a34'], [1, '#3a2f52']]);
  g.fillStyle = '#16151f'; g.fillRect(-500, 470, 3000, 250);
  const q = rng(7); for (let row = 0; row < 3; row++) for (let i = 0; i < 46; i++) { const lit = q() > 0.5; g.fillStyle = lit ? `rgba(200,195,180,${0.25 + q() * 0.3})` : 'rgba(110,110,125,0.25)'; const jump = o.cheer ? Math.abs(Math.sin(t * 6 + i)) * 8 * o.cheer : 0; g.beginPath(); g.arc(-380 + i * 62 + row * 20, 520 + row * 54 - jump, 13, 0, 7); g.fill(); }
  for (const fx of [260, 1660]) { g.strokeStyle = '#3a3846'; g.lineWidth = 9; g.beginPath(); g.moveTo(fx, 720); g.lineTo(fx, 150); g.stroke(); g.fillStyle = '#e9ecff'; g.fillRect(fx - 60, 120, 120, 44); glow(g, fx, 150, 520, COLD, 0.3); }
  g.fillStyle = '#101c17'; g.fillRect(-500, 720, 3000, 700); g.strokeStyle = 'rgba(230,235,225,0.22)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-500, 722); g.lineTo(2500, 722); g.moveTo(1200, 900); g.lineTo(2500, 900); g.moveTo(1200, 900); g.lineTo(1290, 722); g.stroke();
  pool(g, 960, 860, 1000, COLD, 0.12);
}
function goal(g) {   // drawn in front of the keeper's far side
  g.strokeStyle = 'rgba(230,235,225,0.22)'; g.lineWidth = 1.6; g.beginPath(); for (let i = 0; i <= 8; i++) { g.moveTo(1560 + i * 26, 462); g.lineTo(1600 + i * 26, 800); } for (let i = 0; i <= 7; i++) { g.moveTo(1560 + i * 5, 462 + i * 48); g.lineTo(1770 + i * 5, 462 + i * 48); } g.stroke();
  g.strokeStyle = '#e9ecf5'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(1560, 800); g.lineTo(1560, 462); g.lineTo(1770, 462); g.stroke();
}
// ---------------------------------------------------------------- LOCKER ROOM (core place 2, the repeated shot)
function lockers(g, t, o = {}) {
  g.fillStyle = '#131219'; g.fillRect(-500, -400, 3000, 1250); g.fillStyle = '#0b0b10'; g.fillRect(-500, 840, 3000, 700);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.lineJoin = 'round';
  for (let i = 0; i < 12; i++) { const x = 60 + i * 152, open = o.open === i; g.fillStyle = open ? '#0a0a0e' : '#191922'; g.fillRect(x, 170, 140, 560); g.strokeRect(x, 170, 140, 560); if (!open) { g.beginPath(); for (let k = 0; k < 3; k++) { g.moveTo(x + 30, 215 + k * 16); g.lineTo(x + 110, 215 + k * 16); } g.moveTo(x + 116, 440); g.lineTo(x + 116, 480); g.stroke(); } }
  g.beginPath(); g.moveTo(-500, 840); g.lineTo(2500, 840); g.stroke();
  glow(g, 960, 60, 900, o.warm ? WARM : COLD, 0.16 * (o.lampA ?? 1)); pool(g, 960, 850, 760, o.warm ? WARM : COLD, 0.18 * (o.lampA ?? 1));
}
function bench(g) { g.fillStyle = '#1d1b25'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(500, 742, 900, 22); g.strokeRect(500, 742, 900, 22); g.fillRect(560, 764, 20, 78); g.strokeRect(560, 764, 20, 78); g.fillRect(1320, 764, 20, 78); g.strokeRect(1320, 764, 20, 78); }
// the repeated shot: he sits on the bench and cannot get up. o: n, k, text, cap, gl (gloves on bench)
function benchRep(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  lockers(g, t, { lampA: o.lampA, warm: o.warm });
  if (o.others) o.others();
  if (o.k) { const d = demon(g, { x: o.dx ?? 1330, y: o.dy ?? 842, s: 1.2 * o.k, lean: -0.05 * o.k, headOff: [-8 * o.k, Math.sin(t * 1.7) * 2], face: { look: [-0.7, 0.3], ...(o.dface || {}) } }, { t, crack: o.crack });
    demonText(g, o.text, d.head[0] + (o.tx ?? 170 * o.k), d.head[1] - (o.ty ?? 90 * o.k), t, Math.min(seg(t, a + 0.7, a + 1.0), 1 - seg(t, b - 0.8, b - 0.4)), 54 + 14 * o.k); }
  bench(g);
  const r = actor(g, { x: 900, y: 744, hip: true, thigh: 34, s: HS, headOff: [0, 6 + (o.slump ?? 1) * 10], face: { look: [0, 0.9], sad: 0.9, smile: -0.5, blink: 0.3, ...(o.face || {}) }, ...(o.pose || {}) }, { dir: 0, amt: 0.2, dim: 0.08 });
  if (!o.noWord) chestWord(g, r, HS);
  if (o.gl) glovePair(g, 1090, 722, 1, o.gl === 'dust');
  counters(g, typeof o.n === 'function' ? o.n(t) : o.n);
  if (o.cap) caption(g, o.cap, capA(t, a + 0.9, b - 0.1), ACC);
  return r;
}
// ---------------------------------------------------------------- DAD'S CAR at night (core place 3)
function car(g, t, o = {}) {
  g.fillStyle = '#0c0c14'; g.fillRect(-300, -300, 2600, 1700);
  // rear window + passing street lights
  rr(g, 520, 230, 880, 300, 40); g.fillStyle = '#12142a'; g.fill();
  g.save(); rr(g, 520, 230, 880, 300, 40); g.clip(); for (let k = 0; k < 4; k++) { const lx = 1500 - ((t * 420 + k * 330) % 1300); glow(g, lx, 330, 150, WARM, 0.55); } g.restore();
  g.strokeStyle = LINE; g.lineWidth = 3; rr(g, 520, 230, 880, 300, 40); g.stroke();
  // seats
  for (const x of [660, 1260]) { rr(g, x - 150, 330, 300, 620, 60); g.fillStyle = '#1b1a25'; g.fill(); g.stroke(); rr(g, x - 70, 250, 140, 110, 30); g.fill(); g.stroke(); }
  const sw = ((t * 420) % 1300) / 1300; glow(g, 1900 - sw * 2200, 500, 500, WARM, 0.1);
}
function dash(g) { g.fillStyle = '#12111a'; g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(-300, 800); g.quadraticCurveTo(960, 740, 2220, 800); g.lineTo(2220, 1400); g.lineTo(-300, 1400); g.closePath(); g.fill(); g.stroke(); g.lineWidth = 16; g.strokeStyle = '#2a2a36'; g.beginPath(); g.ellipse(1260, 800, 150, 110, 0, Math.PI, Math.PI * 2); g.stroke(); }
// ---------------------------------------------------------------- one-off places
function classroom(g, t, heroFn) {
  g.fillStyle = '#131219'; g.fillRect(-300, -300, 2600, 1700);
  for (const wx of [200, 820, 1440]) { g.fillStyle = '#1c2038'; g.fillRect(wx, 80, 300, 200); g.strokeStyle = '#2a2a36'; g.lineWidth = 8; g.strokeRect(wx, 80, 300, 200); glow(g, wx + 150, 180, 420, COLD, 0.1); }
  const rows = [[520, 0.9, [300, 620, 940, 1260, 1580]], [800, 1.2, [420, 960, 1500]]];
  rows.forEach(([top, s, xs], ri) => {
    xs.forEach((x, i) => {
      if (ri === 1 && i === 1) { heroFn(x, top + 96 * s, s); return; }
      const k = (ri * 3 + i) % 4, o = [{ col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }, { col: '#a3927e', acc: 'longhair' }, { col: '#9a9aa8', acc: 'glasses' }, { col: '#b0a08c', acc: 'scarf' }][k], up = (i + ri) % 2 === 0;
      person(g, { x, y: top + 96 * s, hip: true, thigh: 20, s, ...o, armR: up ? [2.7, 0.2 + Math.sin(t * 5 + i) * 0.08] : null, face: { look: [0, -0.3], smile: 0.4 }, armLines: false });
    });
    g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(-300, top, 2600, 16); g.strokeRect(-300, top, 2600, 16); g.fillStyle = ri ? '#14131b' : '#15141c'; g.fillRect(-300, top + 16, 2600, ri ? 500 : 190);
  });
}
function market(g, t) {
  g.fillStyle = '#15141c'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0e0d13'; g.fillRect(-500, 850, 3000, 600);
  const q = rng(31);
  for (let sx = -200; sx < 2300; sx += 520) { g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(sx, 200, 470, 560); g.strokeRect(sx, 200, 470, 560);
    for (let row = 0; row < 4; row++) { let bx = sx + 14; while (bx < sx + 440) { const w = 30 + q() * 40, h = 60 + q() * 46; g.fillStyle = `hsl(${q() * 360},${20 + q() * 25}%,${16 + q() * 12}%)`; g.fillRect(bx, 330 + row * 140 - h, w, h); bx += w + 5; } g.strokeStyle = LINE; g.beginPath(); g.moveTo(sx, 332 + row * 140); g.lineTo(sx + 470, 332 + row * 140); g.stroke(); } }
  for (const lx of [400, 1000, 1600]) { g.fillStyle = 'rgba(255,225,180,0.9)'; g.fillRect(lx - 120, 60, 240, 16); glow(g, lx, 90, 620, WARM, 0.13); }
  g.strokeStyle = LINE; g.beginPath(); g.moveTo(-500, 850); g.lineTo(2500, 850); g.stroke();
}
function cart(g, x, y) { g.strokeStyle = '#8c8c9c'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 90, y - 150); g.lineTo(x - 60, y - 150); g.lineTo(x - 40, y - 40); g.lineTo(x + 70, y - 40); g.lineTo(x + 90, y - 130); g.lineTo(x - 56, y - 130); g.stroke(); for (const wx of [-30, 60]) { g.beginPath(); g.arc(x + wx, y - 12, 12, 0, 7); g.stroke(); } }

// INSERT (the object held in his hand): the team sheet. The keeper's line stays empty.
function sheet(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#241c16'; g.fillRect(0, 0, W, H); glow(g, 960, 300, 900, WARM, 0.16);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  g.save(); g.translate(880, 520); g.rotate(-0.03); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; g.fillStyle = '#e9e2cc'; g.fillRect(-380, -400, 760, 800); g.shadowColor = 'transparent';
  g.fillStyle = '#b33'; g.beginPath(); g.arc(0, -372, 16, 0, 7); g.fill();
  g.fillStyle = '#2a1c06'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = '700 46px Nunito'; g.fillText('CUP FINAL - TEAM SHEET', -330, -300);
  g.font = '44px "Patrick Hand"'; ['Leo', 'Max', 'Danny', 'Cole'].forEach((n, i) => { g.fillText(`${i + 1}.  ${n}`, -320, -200 + i * 78); g.fillRect(-320, -168 + i * 78, 560, 2); });
  g.font = '700 40px Nunito'; g.fillText('KEEPER:', -320, 170); g.fillRect(-120, 196, 420, 3);
  if (o.sign > 0) { g.save(); g.beginPath(); g.rect(-120, 110, 430 * o.sign, 100); g.clip(); g.font = '70px "Patrick Hand"'; g.fillStyle = '#1b2a6b'; g.fillText('me.', -100, 166); g.restore(); }
  g.restore();
  const hx = o.hx, hy = o.hy;
  g.lineCap = 'round';
  for (const dark of [true, false]) { g.strokeStyle = g.fillStyle = dark ? C.line : C.cream; g.lineWidth = 190 + (dark ? 12 : 0); g.beginPath(); g.moveTo(hx + 260, hy + 300); g.lineTo(hx + 900, hy + 900); g.stroke(); g.beginPath(); g.ellipse(hx + 160, hy + 180, 140 + (dark ? 6 : 0), 160 + (dark ? 6 : 0), -0.6, 0, 7); g.fill(); }
  g.strokeStyle = '#0c0c10'; g.lineWidth = 20; g.beginPath(); g.moveTo(hx + 8, hy - 8); g.lineTo(hx + 210, hy - 250); g.stroke(); g.fillStyle = '#0c0c10'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + 2, hy - 18); g.lineTo(hx + 18, hy - 6); g.fill();
  g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 7; g.beginPath(); g.ellipse(hx + 70, hy + 40, 40, 74, 0.9, 0, 7); g.fill(); g.stroke();
}


// the training pitch: Leo shoots, he saves (or not). o: shots [[tKick, saved]], n, cap, demon
function training(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1040, 1100, u), y: 565, z: lerp(1.04, 1.12, u) });
  pitch(g, t, { cheer: o.cheer ? o.cheer(t) : 0 });
  let bx = 780, by = 800, dive = 0, saved = 0, kick = 0;
  for (const [tk, sv] of o.shots) {
    kick = Math.max(kick, kf(t, [[tk - 0.3, 0], [tk, 1], [tk + 0.4, 0]]));
    if (t >= tk && t < tk + 2.2) { const fl = seg(t, tk, tk + 0.8); dive = kf(t, [[tk + 0.35, 0], [tk + 0.8, 1], [tk + 1.5, 0]]);
      if (sv) { saved = seg(t, tk + 0.8, tk + 2.2); bx = fl < 1 ? lerp(780, 1420, fl) : 1420 - saved * 30; by = fl < 1 ? lerp(800, 600, fl) - Math.sin(Math.PI * fl) * 50 : lerp(600, 700, ease(saved)); }
      else { bx = fl < 1 ? lerp(780, 1650, fl) : 1650; by = fl < 1 ? lerp(800, 540, fl) - Math.sin(Math.PI * fl) * 50 : lerp(540, 786, ease(seg(t, tk + 0.8, tk + 1.8))); } }
  }
  person(g, { x: 740, y: 822, s: 1.0, view: 'side', dir: 1, ...(o.shooter || LEO), legR: [1.1 * kick, -0.2], armL: [-0.6 * kick, 0.3], armR: saved > 0.3 ? [2.6, 0.3] : null, armLines: false, face: { smile: 0.6 } });
  if (o.demon) { const d = demon(g, { x: 1060, y: 806, s: 1.2 * o.demon, face: { look: [0.7, 0.2] } }, { t, crack: o.crack }); demonText(g, 'useless.', d.head[0] - 170, d.head[1] - 60, t, Math.min(seg(t, o.dT, o.dT + 0.3), 1 - seg(t, o.dT + 2, o.dT + 2.4)), 60); }
  floorShadow(g, 1470, 804, 90);
  const r = actor(g, { x: 1470 - dive * (saved || dive > 0 && o.shots.some(([tk, sv]) => sv && t >= tk && t < tk + 2.2) ? 40 : 0), y: 800 - dive * 70, s: HS, view: 'side', dir: -1, lean: -0.3 * dive, armL: [2.4 * dive + 0.15, 0.2], armR: [2.2 * dive + 0.15, 0.2], headOff: [0, o.sad ? 10 * es(t, o.sad, o.sad + 0.8) : 0], face: { look: [0, -0.3 * dive], sad: o.sad ? es(t, o.sad, o.sad + 0.8) * 0.8 : 0, smile: o.sad ? -0.3 : 0.2 + 0.6 * saved } }, { dir: -1, amt: 0.25, dim: 0.04 });
  gloves(g, r, HS); ball(g, bx, by, 22); goal(g);
  if (o.n !== null) counters(g, typeof o.n === 'function' ? o.n(t) : o.n);
  caption(g, o.cap, capA(t, a + 0.6, b - 0.1), ACC);
}
