// THE LIGHT INSIDE - shared world. The habit is never shown: only a magenta phone glow.
// The one symbol: a small warm light in every chest. His fades; the voice takes it.
const ACC = '#E845D6';                       // magenta = the habit
const LINE = '#6a6a78', DARK = '#16161e', WARM = '255,190,110', MAG = '232,69,214';
const MAYA = { col: '#c4ab94', acc: 'longhair' }, DEV = { col: '#A9A9B4', acc: 'glasses' };
const BOOK = '#2f7f86';

function glow(g, x, y, r, rgb, a) {
  if (a <= 0 || r <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
function pool(g, x, y, r, rgb, a) { g.save(); g.translate(x, y); g.scale(1, 0.2); glow(g, 0, 0, r, rgb, a); g.restore(); }
// the light in a chest. lv 1 = full, 0 = out (an empty dark ring)
function light(g, r, s, lv, flick = 0) {
  const x = r.neck[0], y = r.neck[1] + 66 * s; lv = clamp(lv + flick);
  if (lv < 0.04) { g.strokeStyle = 'rgba(70,62,58,0.9)'; g.lineWidth = 2.2 * s; g.beginPath(); g.arc(x, y, 6.5 * s, 0, 7); g.stroke(); return; }
  glow(g, x, y, (12 + 26 * lv) * s, WARM, 0.25 + 0.35 * lv);
  g.fillStyle = `rgba(255,222,165,${0.45 + 0.55 * lv})`; g.beginPath(); g.arc(x, y, (4 + 4.5 * lv) * s, 0, 7); g.fill();
}
// person + chest light (supporting people: drawn plain, slightly dimmed)
function P(g, o, lv = 0.9) { const r = person(g, { armLines: (o.s || 1) > 0.8, ...o }); if (o.view !== 'back') light(g, r, o.s || 1, lv); return r; }
function Hero(g, o, lv, lt = {}, flick = 0) { const r = actor(g, o, { amt: 0.3, dim: 0.05, ...lt }); if (o.view !== 'back') light(g, r, o.s || 1, lv, flick); return r; }
function eyeBags(g, r, s, k) {
  if (k <= 0) return; g.save(); g.strokeStyle = `rgba(70,50,85,${Math.min(1, k * 1.2)})`; g.lineWidth = 2.4 * s; g.lineCap = 'round';
  for (const sg of [-1, 1]) for (let i = 0; i < (k > 0.6 ? 2 : 1); i++) { g.beginPath(); g.arc(r.head[0] + sg * 19 * s, r.head[1] + (3 + i * 5) * s, 10.5 * s, 0.35, Math.PI - 0.35); g.stroke(); }
  g.restore();
}
function book(g, x, y, w, h, rot = 0, star = true) {
  g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2, -h / 2, w, h, w * 0.04); g.fillStyle = BOOK; g.fill(); g.strokeStyle = '#0e2a2d'; g.lineWidth = Math.max(1.5, w * 0.02); g.stroke();
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(-w / 2, -h / 2, w * 0.1, h);
  if (star) { g.fillStyle = '#f3d27a'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = (i % 2 ? 0.1 : 0.24) * Math.min(w, h); g.lineTo(w * 0.05 + Math.cos(a) * q, Math.sin(a) * q); } g.fill(); }
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

// ---------------------------------------------------------------- LIBRARY (core place 1)
function library(g, t, o = {}) {
  g.fillStyle = '#121118'; g.fillRect(-400, -300, 2800, 1200);
  const r = rng(14);
  for (let i = 0; i < 6; i++) {
    const x = -80 + i * 350; g.fillStyle = '#17161f'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(x, 110, 320, 560); g.strokeRect(x, 110, 320, 560);
    for (let row = 0; row < 5; row++) {
      const y = 126 + row * 108; let bx = x + 12;
      while (bx < x + 300) { const w = 12 + r() * 16, h = 62 + r() * 30; g.fillStyle = `hsl(${r() * 360},${18 + r() * 22}%,${13 + r() * 10}%)`; g.fillRect(bx, y + 96 - h, w, h); bx += w + 2 + (r() > 0.85 ? 16 : 0); }
      g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 97); g.lineTo(x + 320, y + 97); g.stroke();
    }
  }
  g.fillStyle = '#0c0b11'; g.fillRect(-400, 720, 2800, 600); g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-400, 720); g.lineTo(2400, 720); g.stroke();
  // far table with three students
  const nod = Math.sin(t * 1.7) * 0.04;
  P(g, { x: 150, y: 668, hip: true, thigh: 20, s: 0.72, col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52', headOff: [0, 8], headTilt: nod, face: { look: [0, 0.8] } }, 0.85);
  P(g, { x: 270, y: 668, hip: true, thigh: 20, s: 0.72, col: '#a3927e', acc: 'longhair', headTilt: -nod, face: { look: [0.5, 0.5] } }, 0.9);
  P(g, { x: 390, y: 668, hip: true, thigh: 20, s: 0.72, col: '#9a9aa8', acc: 'glasses', handR: [404, 618 + Math.sin(t * 6) * 3], bendR: 1, face: { look: [0, 0.9] } }, 0.85);
  g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(70, 630, 400, 14); g.strokeRect(70, 630, 400, 14); g.fillRect(84, 644, 372, 96); g.strokeRect(84, 644, 372, 96);
  for (const lx of [270, 1010, 1680]) {
    g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(lx, -300); g.lineTo(lx, 250); g.stroke();
    g.beginPath(); g.moveTo(lx - 46, 296); g.lineTo(lx - 22, 250); g.lineTo(lx + 22, 250); g.lineTo(lx + 46, 296); g.closePath(); g.fillStyle = 'rgba(255,205,140,0.85)'; g.fill(); g.stroke();
    glow(g, lx, 330, 520, WARM, 0.12); pool(g, lx, 700, 420, WARM, 0.12);
  }
  if (o.behind) o.behind();
}
// the main table goes in front of the seated people
function libTable(g) {
  g.fillStyle = '#1d1b25'; g.strokeStyle = LINE; g.lineWidth = 2.5;
  g.fillRect(620, 696, 780, 20); g.strokeRect(620, 696, 780, 20); g.fillStyle = '#16151d'; g.fillRect(640, 716, 740, 190); g.strokeRect(640, 716, 740, 190);
  pool(g, 1010, 712, 380, WARM, 0.1);
}
function openBook(g, x, y) { g.fillStyle = '#cfc7b0'; g.strokeStyle = '#3a3640'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 52, y); g.lineTo(x, y - 6); g.lineTo(x + 52, y); g.lineTo(x + 52, y - 12); g.lineTo(x, y - 18); g.lineTo(x - 52, y - 12); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x, y - 18); g.stroke(); }

// ---------------------------------------------------------------- DORM ROOM (core place 2)
// o: glow 0..1 (magenta under the blanket), door ('open'), lamp, sleeping (true = in bed), bookAt ('desk' | 'night' | null), phoneOnDesk
function dorm(g, t, o = {}) {
  g.fillStyle = '#131319'; g.fillRect(-500, -400, 3000, 1150); g.fillStyle = '#0b0b10'; g.fillRect(-500, 740, 3000, 700);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-500, 740); g.lineTo(2500, 740); g.stroke();
  // window with the night city
  const gr = g.createLinearGradient(0, 170, 0, 470); gr.addColorStop(0, o.dawn ? '#3a3350' : '#0b0d1c'); gr.addColorStop(1, o.dawn ? '#c98a66' : '#1b1e36'); g.fillStyle = gr; g.fillRect(900, 170, 250, 300);
  const q = rng(4); g.fillStyle = '#07080f'; for (let x = 900; x < 1150; x += 50) { const h = 50 + q() * 80; g.fillRect(x, 470 - h, 48, h); if (q() > 0.4) { g.fillStyle = '#d9a657'; g.fillRect(x + 16, 470 - h + 14, 12, 16); g.fillStyle = '#07080f'; } }
  g.strokeStyle = '#2a2a36'; g.lineWidth = 9; g.strokeRect(900, 170, 250, 300); g.lineWidth = 5; g.beginPath(); g.moveTo(1025, 170); g.lineTo(1025, 470); g.stroke();
  glow(g, 1025, 320, 420, o.dawn ? WARM : '90,100,160', o.dawn ? 0.2 : 0.1);
  // door (right). Open = warm hallway light falls in
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5;
  if (o.door === 'open') {
    const dg = g.createLinearGradient(1680, 0, 1860, 0); dg.addColorStop(0, '#8a5f33'); dg.addColorStop(1, '#c9924a'); g.fillStyle = dg; g.fillRect(1680, 270, 180, 470); g.strokeRect(1680, 270, 180, 470);
    g.save(); g.globalCompositeOperation = 'lighter'; const fg = g.createLinearGradient(0, 740, 0, 1000); fg.addColorStop(0, `rgba(${WARM},0.26)`); fg.addColorStop(1, `rgba(${WARM},0)`);
    g.fillStyle = fg; g.beginPath(); g.moveTo(1680, 740); g.lineTo(1860, 740); g.lineTo(1800, 1000); g.lineTo(1150, 1000); g.fill(); g.restore(); glow(g, 1770, 500, 520, WARM, 0.16);
  } else { g.fillRect(1680, 270, 180, 470); g.strokeRect(1680, 270, 180, 470); g.strokeRect(1700, 296, 140, 180); g.strokeRect(1700, 500, 140, 210); g.beginPath(); g.arc(1702, 520, 6, 0, 7); g.stroke(); }
  // desk + lamp + chair
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(1240, 590, 380, 16); g.strokeRect(1240, 590, 380, 16); g.beginPath(); g.moveTo(1256, 606); g.lineTo(1256, 740); g.moveTo(1604, 606); g.lineTo(1604, 740); g.stroke();
  g.beginPath(); g.moveTo(1560, 590); g.lineTo(1560, 520); g.quadraticCurveTo(1560, 490, 1530, 496); g.stroke(); g.beginPath(); g.moveTo(1500, 520); g.lineTo(1516, 484); g.lineTo(1548, 492); g.lineTo(1552, 524); g.closePath(); g.fillStyle = o.lamp ? 'rgba(255,205,140,0.9)' : DARK; g.fill(); g.stroke();
  if (o.lamp) { glow(g, 1520, 540, 300 * o.lamp, WARM, 0.3 * o.lamp); pool(g, 1440, 596, 220, WARM, 0.25 * o.lamp); }
  if (o.bookAt === 'desk') { book(g, 1380, 578, 120, 22, 0, false); }
  if (o.phoneOnDesk) { g.fillStyle = '#0a0a0e'; g.strokeStyle = LINE; g.lineWidth = 2; rr(g, 1350, 562, 60, 9, 3); g.fill(); g.stroke(); }
  // bed (left)
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5;
  rr(g, 120, 520, 46, 300, 10); g.fill(); g.stroke(); g.fillRect(160, 720, 690, 46); g.strokeRect(160, 720, 690, 46); g.fillRect(820, 766, 18, 50); g.strokeRect(820, 766, 18, 50);
  rr(g, 160, 656, 700, 70, 22); g.fillStyle = '#191922'; g.fill(); g.stroke();
  rr(g, 178, 624, 160, 50, 22); g.fillStyle = '#1d1d27'; g.fill(); g.stroke();
  // nightstand
  g.fillStyle = DARK; g.fillRect(40, 640, 78, 100); g.strokeRect(40, 640, 78, 100); if (o.bookAt === 'night') book(g, 79, 630, 70, 18, 0, false);
  if (o.sleeping) {
    const gl = o.glow || 0, hx = 262, hy = 606;
    // head on the pillow, turned to the phone
    // his head on the pillow, turned towards the phone (the body is under the blanket)
    g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 3.4; g.beginPath(); g.arc(hx, hy, 50, 0, 7); g.fill(); g.stroke();
    g.fillStyle = C.line; g.lineWidth = 3;
    if (gl > 0.02) { g.beginPath(); g.ellipse(hx + 26, hy - 2, 5, 8.5 + gl * 2, 0, 0, 7); g.fill(); } else { g.beginPath(); g.moveTo(hx + 19, hy); g.quadraticCurveTo(hx + 26, hy + 5, hx + 33, hy); g.stroke(); }
    g.beginPath(); g.moveTo(hx + 17, hy - 22 + gl * 5); g.quadraticCurveTo(hx + 26, hy - 27, hx + 35, hy - 22 - gl * 5); g.stroke();
    g.beginPath(); g.moveTo(hx + 30, hy + 26); g.quadraticCurveTo(hx + 38, hy + 26 + (gl > 0.02 ? 0 : 5), hx + 45, hy + 24); g.stroke();
    const r = { head: [hx, hy] };
    // blanket over the body
    g.beginPath(); g.moveTo(300, 680); g.quadraticCurveTo(330, 600 - gl * 26, 430, 606 - gl * 30); g.quadraticCurveTo(640, 600, 850, 650); g.lineTo(858, 700); g.lineTo(300, 706); g.closePath(); g.fillStyle = '#1e1e2b'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
    if (gl > 0.02) {   // only the glow: a small pool on face and blanket, leaking out
      glow(g, 352, 622, 60 + 150 * gl, MAG, 0.35 + 0.35 * gl); glow(g, 352, 622, 26, '255,200,250', 0.6);
      g.fillStyle = '#0a0a0e'; g.strokeStyle = `rgba(${MAG},0.9)`; g.lineWidth = 2; rr(g, 338, 600, 14, 40, 3); g.fill(); g.stroke();
      pool(g, 380, 716, 200 + 260 * gl, MAG, 0.12 + 0.2 * gl);
    }
    return r;
  }
}
function demonAt(g, t, x, y, k, text, a, o = {}) {
  const d = demon(g, { x, y, s: 1.2 * k, lean: o.lean ?? -0.05 * k, headOff: [-8 * k, Math.sin(t * 1.7) * 2], face: { look: [-0.7, 0.3], ...(o.face || {}) }, ...(o.pose || {}) }, { t, crack: o.crack, a: o.a ?? 1 });
  if (text) demonText(g, text, d.head[0] + (o.tx ?? 60 * k), d.head[1] - (o.ty ?? 130 * k), t, a, 54 + 14 * k);
  return d;
}

// ---------------------------------------------------------------- BATHROOM MIRROR (core place 3, the repeated morning shot)
// o: lv, bags, face, warm, demon (alpha), flick (magenta in his eyes), u (0..1 through the shot)
function mirror(g, t, o = {}) {
  g.fillStyle = '#12121a'; g.fillRect(-300, -300, 2600, 1700);
  g.strokeStyle = 'rgba(106,106,120,0.22)'; g.lineWidth = 2; g.beginPath(); for (let x = -260; x < 2300; x += 130) { g.moveTo(x, -300); g.lineTo(x, 1400); } for (let y = -40; y < 1300; y += 130) { g.moveTo(-300, y); g.lineTo(2300, y); } g.stroke();
  const rgb = o.warm ? WARM : '170,190,235';
  rr(g, 700, 70, 520, 26, 13); g.fillStyle = `rgba(${rgb},0.9)`; g.fill(); glow(g, 960, 90, 620, rgb, 0.2);
  rr(g, 560, 130, 800, 660, 28); g.fillStyle = '#0d0d14'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 6; g.stroke();
  g.save(); rr(g, 574, 144, 772, 632, 18); g.clip();
  const gr = g.createLinearGradient(560, 130, 1360, 790); gr.addColorStop(0, o.warm ? '#2a2422' : '#1c1d2a'); gr.addColorStop(1, '#0e0e15'); g.fillStyle = gr; g.fillRect(560, 130, 800, 660);
  if (o.demon > 0) demon(g, { x: 1180, y: 1330, s: 3.0, face: { look: [-0.6, 0.2], smile: 0.7 }, headOff: [0, Math.sin(t * 1.3) * 4] }, { t, a: o.demon, glow: 24 });
  const r = Hero(g, { x: 930, y: 1240, s: 2.4, headOff: [0, (o.down || 0) * 14], ...(o.pose || {}), face: { smile: 0, ...(o.face || {}) } }, o.lv ?? 1, { dir: 0, amt: 0.12, dim: o.warm ? 0 : 0.06 });
  eyeBags(g, r, 2.4, o.bags || 0);
  if (o.flick) for (const sg of [-1, 1]) glow(g, r.head[0] + sg * 46, r.head[1] - 7, 16, MAG, 0.7 * o.flick);
  g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 34; g.beginPath(); g.moveTo(620, 420); g.lineTo(840, 150); g.moveTo(730, 470); g.lineTo(940, 190); g.stroke();
  g.restore();
  // sink + cup
  rr(g, 640, 860, 640, 190, 40); g.fillStyle = '#1b1b25'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
  g.beginPath(); g.ellipse(960, 900, 250, 26, 0, 0, 7); g.stroke(); g.lineWidth = 12; g.beginPath(); g.moveTo(960, 880); g.lineTo(960, 826); g.quadraticCurveTo(960, 806, 990, 808); g.stroke();
  g.lineWidth = 3; rr(g, 1390, 790, 56, 74, 8); g.fillStyle = '#1b1b25'; g.fill(); g.stroke(); g.beginPath(); g.moveTo(1410, 790); g.lineTo(1400, 720); g.moveTo(1430, 790); g.lineTo(1442, 730); g.stroke();
  return r;
}

// ---------------------------------------------------------------- phone in a hand (POV). o.hand = skin colour, o.draw(g, px, py, pw, ph) or o.msgs
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
    g.fillStyle = MAYA.col; g.beginPath(); g.arc(px + 62, py + 72, 25, 0, 7); g.fill(); g.fillStyle = '#3a2d2a'; g.beginPath(); g.arc(px + 62, py + 72, 26, Math.PI * 1.1, Math.PI * 1.9); g.fill();
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

// ---------------------------------------------------------------- CAFE WINDOW in the rain (core place 4)
// o: maya (true/false), cups, clock [h, m], rain 0..1, inside (fn drawn inside the window), warm
function cafe(g, t, o = {}) {
  g.fillStyle = '#14121b'; g.fillRect(-400, -300, 2800, 1200);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; g.beginPath(); for (let y = 40; y < 860; y += 46) { g.moveTo(-400, y); g.lineTo(2400, y); } g.stroke();
  // window
  g.save(); g.beginPath(); g.rect(420, 300, 1080, 480); g.clip();
  const gr = g.createLinearGradient(0, 300, 0, 780); gr.addColorStop(0, '#4a3324'); gr.addColorStop(1, '#2a1d18'); g.fillStyle = gr; g.fillRect(420, 300, 1080, 480);
  for (const lx of [640, 960, 1280]) { g.strokeStyle = '#1a1210'; g.lineWidth = 3; g.beginPath(); g.moveTo(lx, 300); g.lineTo(lx, 380); g.stroke(); g.fillStyle = 'rgba(255,215,150,0.95)'; g.beginPath(); g.arc(lx, 392, 16, 0, 7); g.fill(); glow(g, lx, 400, 300, WARM, 0.3); }
  // clock on the wall
  g.fillStyle = '#e9dfc8'; g.strokeStyle = '#1a1210'; g.lineWidth = 4; g.beginPath(); g.arc(1390, 400, 40, 0, 7); g.fill(); g.stroke();
  const [hh, mm] = o.clock || [5, 0], am = mm / 60 * Math.PI * 2 - Math.PI / 2, ah = (hh % 12 + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2;
  g.lineWidth = 4; g.beginPath(); g.moveTo(1390, 400); g.lineTo(1390 + Math.cos(am) * 30, 400 + Math.sin(am) * 30); g.moveTo(1390, 400); g.lineTo(1390 + Math.cos(ah) * 20, 400 + Math.sin(ah) * 20); g.stroke();
  // people in the back + a waiter in an apron
  P(g, { x: 470, y: 700, hip: true, thigh: 20, s: 0.7, col: '#8d8d9b', acc: 'cap', accCol: '#4a3f38', face: { look: [0.6, 0], smile: 0.5 } }, 0.85);
  P(g, { x: 580, y: 700, hip: true, thigh: 20, s: 0.7, col: '#a3927e', acc: 'scarf', face: { look: [-0.6, 0], smile: 0.6 }, headTilt: Math.sin(t * 2) * 0.05 }, 0.9);
  g.fillStyle = '#241812'; g.fillRect(430, 690, 200, 12); g.fillRect(522, 702, 14, 80);
  if (o.inside) o.inside();
  g.restore();
  g.strokeStyle = '#2b2630'; g.lineWidth = 14; g.strokeRect(420, 300, 1080, 480); g.lineWidth = 8; g.beginPath(); g.moveTo(960, 300); g.lineTo(960, 780); g.stroke();
  // sign + door + pavement
  rr(g, 800, 196, 320, 74, 12); g.fillStyle = '#1b1620'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  g.fillStyle = 'rgba(255,214,150,0.95)'; g.font = '700 44px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('COFFEE', 960, 236); glow(g, 960, 234, 240, WARM, 0.16);
  g.fillStyle = '#1b1620'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(1580, 330, 190, 500); g.strokeRect(1580, 330, 190, 500); g.fillStyle = '#3a2a20'; g.fillRect(1604, 360, 142, 250); g.strokeRect(1604, 360, 142, 250);
  g.fillStyle = '#0e0d13'; g.fillRect(-400, 830, 2800, 500); g.strokeStyle = LINE; g.beginPath(); g.moveTo(-400, 830); g.lineTo(2400, 830); g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter'; const fg = g.createLinearGradient(0, 830, 0, 1060); fg.addColorStop(0, `rgba(${WARM},0.3)`); fg.addColorStop(1, `rgba(${WARM},0)`); g.fillStyle = fg; g.beginPath(); g.moveTo(420, 830); g.lineTo(1500, 830); g.lineTo(1700, 1060); g.lineTo(220, 1060); g.fill(); g.restore();
  lampPost(g, 250, 840, 470, 0.8);
}
function cafeTable(g, cups, t) {
  g.fillStyle = '#241812'; g.strokeStyle = '#120c0a'; g.lineWidth = 3; g.fillRect(850, 636, 240, 14); g.strokeRect(850, 636, 240, 14); g.fillRect(962, 650, 16, 140);
  for (const cx of [760, 1180]) { g.fillRect(cx - 40, 700, 80, 10); g.fillRect(cx - 36, 710, 8, 80); g.fillRect(cx + 28, 710, 8, 80); g.fillRect(cx + (cx < 960 ? -44 : 36), 600, 8, 110); }
  [[905, 0], [1035, 1]].slice(0, cups).forEach(([x, i]) => { g.fillStyle = '#e9dfc8'; rr(g, x - 18, 606, 36, 30, 6); g.fill(); g.stroke(); g.beginPath(); g.arc(x + 20, 620, 9, -1.2, 1.2); g.stroke();
    if (i === 0 || cups === 2 && t !== null) { g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 3; for (let k = 0; k < 2; k++) { g.beginPath(); g.moveTo(x - 6 + k * 12, 600); g.quadraticCurveTo(x - 14 + k * 12 + Math.sin((t || 0) * 2 + k) * 6, 580, x - 6 + k * 12, 560); g.stroke(); } g.strokeStyle = '#120c0a'; g.lineWidth = 3; } });
}
function rain(g, t, a) {
  if (a <= 0) return; g.save(); noCam(g); g.strokeStyle = `rgba(170,190,235,${0.3 * a})`; g.lineWidth = 2; g.beginPath(); const r = rng(88);
  for (let i = 0; i < 150; i++) { const x = r() * 2200 - 140, sp = 900 + r() * 500, y = ((r() * 1300 + t * sp) % 1300) - 110; g.moveTo(x, y); g.lineTo(x - 14, y + 46); } g.stroke(); g.restore();
}

// ---------------------------------------------------------------- one-off places
function lecture(g, t) {
  g.fillStyle = '#121118'; g.fillRect(-300, -300, 2600, 1700);
  g.fillStyle = 'rgba(190,205,245,0.9)'; g.fillRect(-300, 60, 520, 330); glow(g, 100, 240, 1100, '170,190,235', 0.22);
  const rows = [[520, 0.95, [330, 610, 890, 1170, 1450, 1730]], [800, 1.25, [420, 800, 1180, 1560]]];
  const out = {};
  rows.forEach(([top, s, xs], ri) => {
    xs.forEach((x, i) => {
      if (ri === 1 && i === 1) { out.hero = [x, top + 96 * s, s]; return; }
      const k = (ri * 7 + i) % 4, o = [{ col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }, { col: '#a3927e', acc: 'longhair' }, { col: '#9a9aa8', acc: 'glasses' }, { col: '#b0a08c', acc: 'scarf' }][k];
      P(g, { x, y: top + 96 * s, hip: true, thigh: 20, s, ...o, handR: [x + 30 * s, top - 6 + Math.sin(t * 5 + i) * 3], bendR: 1, face: { look: [-0.6, k % 2 ? -0.3 : 0.8] }, headTilt: Math.sin(t + i) * 0.03 }, 0.9);
    });
    if (ri === 1) out.draw = () => { g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(-300, top, 2600, 18); g.strokeRect(-300, top, 2600, 18); g.fillStyle = '#14131b'; g.fillRect(-300, top + 18, 2600, 400); };
    else { g.fillStyle = '#1a1922'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(-300, top, 2600, 16); g.strokeRect(-300, top, 2600, 16); g.fillStyle = '#15141c'; g.fillRect(-300, top + 16, 2600, 190); }
  });
  return out;
}
function steps(g, t, o = {}) {
  skyline(g, 760, -300, 620, 33, '#0e0d17', [[0, '#07070f'], [0.7, '#15152a'], [1, '#232040']]);
  g.fillStyle = '#17151e'; g.fillRect(560, -300, 1900, 1100); g.strokeStyle = 'rgba(106,106,120,0.16)'; g.lineWidth = 2; g.beginPath(); for (let y = -260; y < 760; y += 52) { g.moveTo(560, y); g.lineTo(2400, y); } g.stroke();
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(560, -300); g.lineTo(560, 910); g.stroke();
  // door with a lit window, lamp above
  g.fillStyle = o.open ? '#b98445' : '#1d1a24'; g.fillRect(1040, 330, 200, 430); g.strokeRect(1040, 330, 200, 430); if (!o.open) { g.fillStyle = '#d9a657'; g.fillRect(1090, 380, 100, 130); g.strokeRect(1090, 380, 100, 130); }
  g.fillStyle = 'rgba(255,215,150,0.95)'; g.beginPath(); g.arc(1140, 270, 16, 0, 7); g.fill(); glow(g, 1140, 280, 520, WARM, 0.3);
  rr(g, 1500, 420, 250, 200, 6); g.fillStyle = '#0d0c13'; g.fill(); g.stroke(); g.fillStyle = '#d9a657'; g.fillRect(1520, 440, 90, 160);
  // steps
  g.fillStyle = '#0e0d13'; g.fillRect(-400, 910, 2900, 400);
  [[760, 760, 760], [700, 810, 880], [640, 860, 1000]].forEach(([x, y, w]) => { g.fillStyle = '#1b1923'; g.fillRect(x, y, w, 52); g.strokeRect(x, y, w, 52); });
  pool(g, 1140, 800, 520, WARM, 0.24);
  g.strokeStyle = LINE; g.beginPath(); g.moveTo(-400, 910); g.lineTo(2500, 910); g.stroke();
  lampPost(g, 200, 912, 440, 0.7);
  // someone walks past with a phone, far left
  const wx = 520 - ((t * 38) % 700); const w = walker(g, wx, 912, 0.72, -1, wx / 26, { col: '#6f6c78', acc: 'scarf' }); light(g, w, 0.72, 0.8);
}
function track(g, t, sc) {
  skyline(g, 640, -300, 2300, 9, '#1b1626', [[0, '#231f40'], [0.55, '#8a5670'], [1, '#f0a868']]);
  glow(g, 1500, 640, 700, WARM, 0.45);
  g.strokeStyle = '#2a2632'; g.lineWidth = 8; for (const x of [300, 1200]) { g.beginPath(); g.moveTo(x - (sc * 0.2) % 900 + 300, 640); g.lineTo(x - (sc * 0.2) % 900 + 300, 300); g.stroke(); g.fillStyle = '#2a2632'; g.fillRect(x - (sc * 0.2) % 900 + 250, 280, 100, 40); }
  g.fillStyle = '#18201c'; g.fillRect(-400, 640, 2800, 70); g.fillStyle = '#3a2422'; g.fillRect(-400, 710, 2800, 600);
  g.strokeStyle = 'rgba(240,230,215,0.35)'; g.lineWidth = 4; g.beginPath(); for (const y of [712, 780, 880, 1010]) { g.moveTo(-400, y); g.lineTo(2400, y); } g.stroke();
  g.fillStyle = 'rgba(240,230,215,0.25)'; g.font = '700 60px Nunito'; for (let i = -1; i < 4; i++) g.fillText(String(((i % 4) + 4) % 4 + 1), i * 700 - (sc % 700) + 350, 960);
}
