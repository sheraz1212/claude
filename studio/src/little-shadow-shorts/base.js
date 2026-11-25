// LITTLE SHADOW - shared world. The habit is never shown: only a small mint-green glow in a
// closed hand and the mint cloud that follows him. His little brother Eli copies everything.
const ACC = '#5FE3B0', MINT = '95,227,176';
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', COLD = '170,190,235', MAG = MINT;
const ELI = { col: '#D2B48C', acc: 'cap', accCol: '#3b6a8a' }, MOM = { col: '#c4ab94', acc: 'longhair' }, RAY = { col: '#A9A9B4', acc: 'scarf', accCol: '#5a4a6a' };
const HS = 1.15, ES = 0.7;      // hero scale, Eli scale (a real small child)

// ---- generic helpers (same as the last film)
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
      if (m.sys) { const sp = ease(seg(t, m.at, m.at + 0.22)); g.globalAlpha = sp; rr(g, px + 40, y, pw - 80, 50, 25); g.fillStyle = '#3a2f1f'; g.fill(); g.fillStyle = '#ffd9a0'; g.font = '600 22px Nunito'; g.textAlign = 'center'; g.fillText(m.sys, px + pw / 2, y + 26); g.globalAlpha = 1; y += 64; continue; }
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

function rain(g, t, a) {
  if (a <= 0) return; g.save(); noCam(g); g.strokeStyle = `rgba(170,190,235,${0.3 * a})`; g.lineWidth = 2; g.beginPath(); const r = rng(88);
  for (let i = 0; i < 150; i++) { const x = r() * 2200 - 140, sp = 900 + r() * 500, y = ((r() * 1300 + t * sp) % 1300) - 110; g.moveTo(x, y); g.lineTo(x - 14, y + 46); } g.stroke(); g.restore();
}


// ---------------------------------------------------------------- the cloud, the glow, small props
// the mint cloud: soft puffs that drift. r = size, a = strength
function cloud(g, x, y, r, t, a = 1, seed = 5) {
  if (r <= 1 || a <= 0) return;
  g.save(); g.filter = `blur(${Math.max(2, r * 0.16 * CAM.z)}px)`; const q = rng(seed);
  for (let i = 0; i < 9; i++) {
    const an = q() * 6.28, d = q() * r * 0.75, rr2 = r * (0.34 + q() * 0.3), wob = Math.sin(t * (0.5 + q() * 0.6) + i) * r * 0.07;
    g.fillStyle = `rgba(${MINT},${(0.2 + q() * 0.16) * a})`; g.beginPath(); g.arc(x + Math.cos(an) * d + wob, y + Math.sin(an) * d * 0.62 - wob * 0.5, rr2, 0, 7); g.fill();
  }
  g.restore();
}
function mintGlow(g, x, y, k = 1) { glow(g, x, y, 70 * k, MINT, 0.6); glow(g, x, y, 16 * k, '220,255,240', 0.9); }
function board(g, x, y, s = 1, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = '#b9b3a2'; g.lineWidth = 6 * s; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-62 * s, -4 * s); g.quadraticCurveTo(-52 * s, 0, -44 * s, 0); g.lineTo(44 * s, 0); g.quadraticCurveTo(52 * s, 0, 62 * s, -4 * s); g.stroke();
  g.fillStyle = '#0b0b10'; g.strokeStyle = LINE; g.lineWidth = 2; for (const wx of [-34, 34]) { g.beginPath(); g.arc(wx * s, 9 * s, 7 * s, 0, 7); g.fill(); g.stroke(); } g.restore();
}
// someone riding a board, side view. o: person options
function rider(g, x, y, s, d, t, o = {}) {
  board(g, x, y - 16 * s, s);
  return person(g, { x, y: y - 24 * s + Math.sin(t * 3) * 1.5, s, view: 'side', dir: d, legL: [0.32, -0.3], legR: [-0.3, -0.05], armL: [0.9 + Math.sin(t * 2) * 0.1, 0.3], armR: [-0.8 - Math.sin(t * 2) * 0.1, -0.3], lean: d * 0.05, ...o });
}
function coughPuffs(g, x, y, t, t0, d = 1) { const u = seg(t, t0, t0 + 0.9); if (u <= 0 || u >= 1) return; for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(${MINT},${0.5 * (1 - u)})`; g.beginPath(); g.arc(x + d * (20 + u * 70 + i * 16), y - i * 9 + Math.sin(i * 2 + u * 6) * 8, 7 + u * 14 + i * 2, 0, 7); g.fill(); } }

// ---------------------------------------------------------------- DRIVEWAY at dusk (core place 1, mirrored at the end)
function driveway(g, t, o = {}) {
  skyline(g, 700, -400, 1000, 61, '#15121f', [[0, '#141228'], [0.55, '#3f3154'], [1, o.dawn ? '#f0a868' : '#8f5f5c']]);
  if (o.dawn) glow(g, 300, 700, 700, WARM, 0.4);
  g.fillStyle = '#1b1824'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(900, 330); g.lineTo(1400, 170); g.lineTo(2300, 330); g.lineTo(2300, 840); g.lineTo(900, 840); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#211e2b'; g.fillRect(1040, 470, 460, 370); g.strokeRect(1040, 470, 460, 370); for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(1040, 470 + i * 92); g.lineTo(1500, 470 + i * 92); g.stroke(); }
  g.fillStyle = o.doorOpen ? '#c9924a' : '#2a2430'; g.fillRect(1640, 520, 150, 320); g.strokeRect(1640, 520, 150, 320);
  g.fillStyle = '#d9a657'; g.fillRect(1840, 560, 110, 120); g.strokeRect(1840, 560, 110, 120); glow(g, 1760, 660, 380, WARM, 0.22);
  g.fillStyle = '#17151d'; g.fillRect(-500, 840, 3000, 60); g.fillStyle = '#100f15'; g.fillRect(-500, 900, 3000, 400);
  g.fillStyle = '#231f2a'; g.beginPath(); g.moveTo(1020, 840); g.lineTo(1520, 840); g.lineTo(1640, 900); g.lineTo(900, 900); g.fill();
  g.strokeStyle = LINE; g.beginPath(); g.moveTo(-500, 840); g.lineTo(2500, 840); g.moveTo(-500, 900); g.lineTo(2500, 900); g.stroke();
  g.strokeStyle = '#4a4858'; g.lineWidth = 6; g.beginPath(); g.moveTo(820, 840); g.lineTo(820, 740); g.stroke(); rr(g, 790, 700, 70, 42, 14); g.fillStyle = '#2b2a36'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  lampPost(g, 330, 842, 470, 0.9);
}
// ---------------------------------------------------------------- THE ALLEY behind the garage (core place 2, the repeated shot)
function alley(g, t, o = {}) {
  g.fillStyle = '#131219'; g.fillRect(-500, -400, 3000, 1200);
  g.strokeStyle = 'rgba(106,106,120,0.16)'; g.lineWidth = 2; g.beginPath(); for (let y = -340; y < 780; y += 48) { g.moveTo(-500, y); g.lineTo(2500, y); } g.stroke();
  g.fillStyle = '#0b0b10'; g.fillRect(-500, 790, 3000, 700); g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-500, 790); g.lineTo(2500, 790); g.stroke();
  // wall lamp: cold light = hiding (warm at the very end)
  const rgb = o.warm ? WARM : COLD;
  g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(900, 250); g.lineTo(900, 290); g.stroke(); g.beginPath(); g.moveTo(866, 320); g.lineTo(884, 290); g.lineTo(916, 290); g.lineTo(934, 320); g.closePath(); g.fillStyle = `rgba(${rgb},0.9)`; g.fill(); g.stroke();
  glow(g, 900, 360, 560, rgb, 0.2 * (o.lampA ?? 1)); pool(g, 900, 800, 440, rgb, 0.26 * (o.lampA ?? 1));
  // bins + fence + a pipe
  for (const bx of [1260, 1420]) { rr(g, bx, 600, 140, 190, 12); g.fillStyle = '#1b1b25'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke(); rr(g, bx - 8, 584, 156, 26, 10); g.fillStyle = '#22222e'; g.fill(); g.stroke(); }
  g.strokeStyle = '#3a3846'; g.lineWidth = 5; g.beginPath(); for (let x = 1640; x < 2400; x += 60) { g.moveTo(x, 520); g.lineTo(x, 790); } g.moveTo(1620, 560); g.lineTo(2400, 560); g.moveTo(1620, 740); g.lineTo(2400, 740); g.stroke();
  g.lineWidth = 9; g.beginPath(); g.moveTo(330, -340); g.lineTo(330, 790); g.stroke();
}
// ---------------------------------------------------------------- THEIR ROOM at night (core place 3): bunk bed
function bedroom(g, t, o = {}) {
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, 1200); g.fillStyle = '#0b0b10'; g.fillRect(-500, 800, 3000, 700);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-500, 800); g.lineTo(2500, 800); g.stroke();
  const gr = g.createLinearGradient(0, 200, 0, 480); gr.addColorStop(0, '#0b0d1c'); gr.addColorStop(1, '#1b1e36'); g.fillStyle = gr; g.fillRect(1080, 200, 240, 280);
  g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(1080, 200, 240, 280); g.lineWidth = 5; g.beginPath(); g.moveTo(1200, 200); g.lineTo(1200, 480); g.stroke(); glow(g, 1200, 340, 420, '90,100,160', 0.12);
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(1640, 300, 180, 500); g.strokeRect(1640, 300, 180, 500); g.beginPath(); g.arc(1662, 560, 6, 0, 7); g.stroke();
  if (o.board ?? true) board(g, 1540, 720, 1, -1.35);
  // night light
  rr(g, 1380, 760, 40, 40, 10); g.fillStyle = 'rgba(255,205,140,0.9)'; g.fill(); glow(g, 1400, 770, 260, WARM, 0.22);
}
function bunk(g) {   // drawn after the people on the lower bunk, before the ones on top? (frame in front)
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5;
  for (const y of [400, 650]) { rr(g, 200, y, 620, 50, 16); g.fillStyle = '#191922'; g.fill(); g.stroke(); g.fillRect(196, y + 46, 628, 18); g.strokeRect(196, y + 46, 628, 18); rr(g, 214, y - 28, 130, 40, 16); g.fillStyle = '#1d1d27'; g.fill(); g.stroke(); }
  g.lineWidth = 9; g.strokeStyle = '#3a3846'; g.beginPath(); g.moveTo(196, 300); g.lineTo(196, 800); g.moveTo(824, 300); g.lineTo(824, 800); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.moveTo(860, 420); g.lineTo(860, 800); g.moveTo(910, 420); g.lineTo(910, 800); for (let y = 480; y < 800; y += 70) { g.moveTo(860, y); g.lineTo(910, y); } g.stroke();
}
// ---------------------------------------------------------------- KITCHEN table (core place 4)
function kitchen(g, t) {
  g.fillStyle = '#15141c'; g.fillRect(-500, -400, 3000, 1300); g.fillStyle = '#0d0c12'; g.fillRect(-500, 860, 3000, 600);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-500, 860); g.lineTo(2500, 860); g.stroke();
  rr(g, 120, 240, 250, 620, 14); g.fillStyle = '#1b1b25'; g.fill(); g.stroke(); g.beginPath(); g.moveTo(120, 470); g.lineTo(370, 470); g.moveTo(340, 320); g.lineTo(340, 430); g.moveTo(340, 510); g.lineTo(340, 640); g.stroke();
  const gr = g.createLinearGradient(0, 220, 0, 470); gr.addColorStop(0, '#0b0d1c'); gr.addColorStop(1, '#1b1e36'); g.fillStyle = gr; g.fillRect(1500, 220, 260, 250); g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(1500, 220, 260, 250);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(960, -400); g.lineTo(960, 230); g.stroke(); g.beginPath(); g.moveTo(900, 290); g.lineTo(930, 230); g.lineTo(990, 230); g.lineTo(1020, 290); g.closePath(); g.fillStyle = 'rgba(255,205,140,0.9)'; g.fill(); g.stroke();
  glow(g, 960, 330, 620, WARM, 0.2);
}
function kitchenTable(g) {
  g.fillStyle = '#1d1b25'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(540, 690, 840, 20); g.strokeRect(540, 690, 840, 20); g.fillStyle = '#16151d'; g.fillRect(560, 710, 800, 200); g.strokeRect(560, 710, 800, 200);
  pool(g, 960, 704, 420, WARM, 0.14);
  for (const x of [760, 960, 1180]) { g.fillStyle = '#d8d0ba'; g.strokeStyle = '#3a3640'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, 684, 48, 9, 0, 0, 7); g.fill(); g.stroke(); }
}
// ---------------------------------------------------------------- one-off places
function skatepark(g, t) {
  skyline(g, 720, -400, 2400, 17, '#0e0d17', [[0, '#07070f'], [0.7, '#15152a'], [1, '#232040']]);
  g.fillStyle = '#15141c'; g.fillRect(-500, 720, 3000, 110); g.fillStyle = '#0e0d13'; g.fillRect(-500, 830, 3000, 500);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-500, 830); g.lineTo(2500, 830); g.stroke();
  g.fillStyle = '#1b1923'; g.beginPath(); g.moveTo(1500, 830); g.quadraticCurveTo(1800, 820, 1900, 520); g.lineTo(2400, 520); g.lineTo(2400, 830); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = '#8c8c9c'; g.lineWidth = 6; g.beginPath(); g.moveTo(560, 760); g.lineTo(980, 760); g.moveTo(600, 760); g.lineTo(600, 830); g.moveTo(940, 760); g.lineTo(940, 830); g.stroke();
  lampPost(g, 1260, 832, 470, 1); lampPost(g, 200, 832, 440, 0.5);
}
const stairY = x => 900 - (x - 300) * 0.5;
function stairs(g, t) {
  g.fillStyle = '#131219'; g.fillRect(-500, -400, 3000, 1900);
  for (const wx of [500, 1000, 1500]) { g.fillStyle = '#1c2038'; g.fillRect(wx, 60, 220, 190); g.strokeStyle = '#2a2a36'; g.lineWidth = 8; g.strokeRect(wx, 60, 220, 190); glow(g, wx + 110, 160, 380, COLD, 0.1); }
  g.fillStyle = '#17161e'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-500, 900);
  for (let i = 0; i < 12; i++) { const x = 300 + i * 110; g.lineTo(x, stairY(x)); g.lineTo(x + 110, stairY(x)); } g.lineTo(2500, stairY(1620)); g.lineTo(2500, 1400); g.lineTo(-500, 1400); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = '#4a4858'; g.lineWidth = 7; g.beginPath(); g.moveTo(260, stairY(260) - 150); g.lineTo(1660, stairY(1660) - 150); for (let x = 300; x < 1700; x += 220) { g.moveTo(x, stairY(x) - 150); g.lineTo(x, stairY(x)); } g.stroke();
}
function climber(g, x, s, ph, o = {}, run = 1) { const fy = stairY(Math.floor((x - 300) / 110) * 110 + 300); return walker(g, x, fy, s, 1, ph, o, run); }
function tear(g, r, s, u) {   // u 0..1; falls from the left eye
  if (u <= 0) return; const ex = r.head[0] - 19 * s, ey = r.head[1] + 10 * s, yy = ey + ease(seg(u, 0.3, 1)) * 50 * s, sz = (3 + 1.6 * seg(u, 0, 0.3)) * s;
  g.fillStyle = 'rgba(190,215,255,0.92)'; g.strokeStyle = 'rgba(120,150,200,0.8)'; g.lineWidth = 0.7 * s;
  g.beginPath(); g.moveTo(ex, yy - sz * 1.9); g.quadraticCurveTo(ex + sz * 1.2, yy, ex, yy + sz); g.quadraticCurveTo(ex - sz * 1.2, yy, ex, yy - sz * 1.9); g.fill(); g.stroke();
}
// THE REPEATED SHOT: the alley, the cloud a little bigger, the voice a little bigger
function alleyRep(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  alley(g, t, { warm: o.warm, lampA: o.lampA });
  const d = demon(g, { x: o.dx ?? 560, y: o.dy ?? 800, s: 1.2 * o.k, lean: 0.05 * o.k, headOff: [8 * o.k, Math.sin(t * 1.7) * 2], face: { look: [0.7, 0.3], ...(o.dface || {}) } }, { t, crack: o.crack });
  demonText(g, o.text, d.head[0] + (o.tx ?? -150 * o.k), d.head[1] - (o.ty ?? 120 * o.k), t, Math.min(seg(t, a + 0.7, a + 1.0), 1 - seg(t, b - 0.8, b - 0.4)), 52 + 14 * o.k);
  const lift = o.noPuff ? 0 : kf(t, [[a + 1.2, 0], [a + 1.9, 1], [a + 2.6, 1], [a + 3.2, 0]]);
  floorShadow(g, 820, 800, 90);
  const r = actor(g, { x: 820, y: 800, s: HS, handR: lift > 0.02 ? [lerp(880, 846, lift), lerp(690, 478, lift)] : null, bendR: 1, headOff: [0, (o.slump || 0) * 12], face: { look: [0.5 * Math.sin(t * 1.1), 0.3], sad: 0.4 + (o.slump || 0) * 0.5, smile: -0.2, blink: lift > 0.8 ? 0.8 : 0.1, ...(o.face || {}) }, ...(o.pose || {}) }, { dir: 1, amt: 0.3, dim: 0.08 });
  eyeBags(g, r, HS, o.bags || 0);
  if (!o.noGlow) mintGlow(g, r.handR[0], r.handR[1], 0.7 + 0.5 * lift);
  cloud(g, 850, 330 - o.r * 0.72, o.r * (1 + 0.12 * es(t, a + 2.4, a + 3.4)), t, 1, 5);
  if (!o.noPuff) coughPuffs(g, r.head[0] + 20, r.head[1] + 30, t, a + 2.5);
  hud(g, o.label || 'PUFFS A DAY', typeof o.n === 'function' ? o.n(t) : o.n);
  caption(g, o.cap, capA(t, a + 0.9, b - 0.1), ACC);
  return r;
}
// the token: Eli's rocket sticker on his chest
function sticker(g, r, s) { const x = r.neck[0] - 14 * s, y = r.neck[1] + 70 * s; g.save(); g.translate(x, y); g.rotate(-0.3); g.fillStyle = '#f3e9d2'; g.strokeStyle = '#1b1a20'; g.lineWidth = 1.6 * s; g.beginPath(); g.moveTo(0, -13 * s); g.quadraticCurveTo(8 * s, -4 * s, 6 * s, 9 * s); g.lineTo(-6 * s, 9 * s); g.quadraticCurveTo(-8 * s, -4 * s, 0, -13 * s); g.fill(); g.stroke(); g.fillStyle = '#e0763c'; g.beginPath(); g.moveTo(-6 * s, 9 * s); g.lineTo(0, 17 * s); g.lineTo(6 * s, 9 * s); g.fill(); g.restore(); }
