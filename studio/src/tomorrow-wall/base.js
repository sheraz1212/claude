// TOMORROW WALL - the shared world: the note wall, his room, the phone, the street, small props.
const ACC = '#F2C230';                       // sticky-note yellow = "tomorrow"
const LINE = '#6a6a78', DARK = '#16161e';
const WIN = { x: 800, y: 120, w: 380, h: 420 };
const TASKS = ['gym', 'call mom', 'laundry', 'apply', 'dishes', 'email', 'run', 'read', 'bills', 'dentist', 'clean', 'study', 'cook', 'call Sam', 'wake up early', 'reply'];
const NOTES = (() => {
  const r = rng(31), a = [];
  for (let row = 0; row < 5; row++) for (let col = 0; col < 14; col++)
    a.push({ cx: 372 + col * 108 + (r() - 0.5) * 12, cy: 130 + row * 112 + (r() - 0.5) * 10, rot: (r() - 0.5) * 0.16, sh: r(), task: TASKS[Math.floor(r() * TASKS.length)] });
  while (a.length < 97) {
    const cx = 340 + r() * 1500, cy = 150 + r() * 440, rot = (r() - 0.5) * 0.3, sh = r(), task = TASKS[Math.floor(r() * TASKS.length)];
    if (cx > WIN.x - 90 && cx < WIN.x + WIN.w + 90) continue;
    a.push({ cx, cy, rot, sh, task, top: 1 });
  }
  // order they go up: first around the bed, the window last, the "Sam" note very last
  const GAPI = 2 * 14 + 7, q = rng(8);
  a.forEach((n, i) => { n.win = !n.top && n.cx > WIN.x - 20 && n.cx < WIN.x + WIN.w + 20 && n.cy > WIN.y - 20 && n.cy < WIN.y + WIN.h + 20; n.key = i === GAPI ? 1e9 : (n.win ? 1e6 + q() : Math.hypot(n.cx - 1340, n.cy - 340) + q() * 260); });
  [...a].sort((x, y) => x.key - y.key).forEach((n, i) => n.rank = i);
  a[0 * 14 + 9].task = 'laundry'; a.find(n => n.rank === 0).task = 'laundry'; a.find(n => n.rank === 1).task = 'gym'; a.find(n => n.rank === 8).task = 'dishes'; a.find(n => n.rank === 96).task = 'bye Sam';
  return a;
})();
const GN = NOTES.find(n => n.rank === 96);
const noteAt = k => NOTES.find(n => n.rank === k);

function drawNote(g, n, mode) {            // mode: 'wall' | 'back' (backlit) | 'lit'
  g.save(); g.translate(n.cx, n.cy); g.rotate(n.rot);
  const l = 21 + n.sh * 8;
  g.fillStyle = mode === 'back' ? `hsl(43,58%,${13 + n.sh * 5}%)` : mode === 'lit' ? ACC : `hsl(45,64%,${l}%)`;
  g.fillRect(-55, -55, 110, 110);
  g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(-55, 44, 110, 11);
  g.fillStyle = mode === 'back' ? 'rgba(0,0,0,0.5)' : 'rgba(28,18,4,0.8)';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '19px "Patrick Hand"'; g.fillText(n.task, 0, -22);
  g.font = '27px "Patrick Hand"'; g.fillText('tomorrow', 0, 10);
  g.restore();
}
const WINS = {
  cold: { top: '#b9c6ea', bot: '#e6e2e0', b: 1, rgb: '150,170,225' },
  warm: { top: '#f3c57c', bot: '#fbe6b4', b: 1.1, rgb: '255,190,110' },
  dusk: { top: '#2a2146', bot: '#8d5c5a', b: 0.3, rgb: '170,120,150' },
  night: { top: '#0b0d1c', bot: '#1b1e36', b: 0.1, rgb: '90,100,160' },
};
function windowView(g, mode) {
  const m = WINS[mode], gr = g.createLinearGradient(0, WIN.y, 0, WIN.y + WIN.h);
  gr.addColorStop(0, m.top); gr.addColorStop(1, m.bot);
  g.fillStyle = gr; g.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
  if (mode === 'dusk' || mode === 'night') {
    const r = rng(3); g.fillStyle = mode === 'dusk' ? '#1a1528' : '#07080f';
    for (let x = WIN.x; x < WIN.x + WIN.w; x += 62) { const h = 60 + r() * 90; g.fillRect(x, WIN.y + WIN.h - h, 58, h); if (r() > 0.4) { g.fillStyle = '#d9a657'; g.fillRect(x + 18, WIN.y + WIN.h - h + 16, 14, 18); g.fillStyle = mode === 'dusk' ? '#1a1528' : '#07080f'; } }
  }
  g.strokeStyle = '#2a2a36'; g.lineWidth = 10; g.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h);
  g.lineWidth = 6; g.beginPath(); g.moveTo(WIN.x + WIN.w / 2, WIN.y); g.lineTo(WIN.x + WIN.w / 2, WIN.y + WIN.h); g.moveTo(WIN.x, WIN.y + WIN.h / 2); g.lineTo(WIN.x + WIN.w, WIN.y + WIN.h / 2); g.stroke();
}
const _WALLS = {};
function wall(n, mode = 'cold', sc = 1) {
  const k = n + mode + sc; if (_WALLS[k]) return _WALLS[k];
  const c = mk(1920 * sc, 700 * sc), g = c.getContext('2d'); g.scale(sc, sc);
  g.fillStyle = '#131319'; g.fillRect(0, 0, 1920, 700);
  windowView(g, mode);
  const back = WINS[mode].b >= 1;
  NOTES.forEach(nt => { if (nt.rank < n) drawNote(g, nt, back && nt.win ? 'back' : 'wall'); });
  return _WALLS[k] = c;
}
function paperNote(g, x, y, size, rot, lines, col = '#F6EFD6') {   // a single readable note (e.g. "today")
  g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.fillRect(-size / 2, -size / 2, size, size);
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(-size / 2, size * 0.4, size, size * 0.1);
  g.fillStyle = '#2a1c06'; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach(([txt, fs, dy]) => { g.font = `${fs * size}px "Patrick Hand"`; g.fillText(txt, 0, dy * size); });
  g.restore();
}
function ball(g, x, y, r, note) {
  g.fillStyle = '#5a3418'; g.strokeStyle = '#a06a3c'; g.lineWidth = Math.max(2, r * 0.06);
  g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke();
  g.beginPath(); g.arc(x - r, y, r * 0.77, -1.1, 1.1); g.stroke(); g.beginPath(); g.arc(x + r, y, r * 0.77, Math.PI - 1.1, Math.PI + 1.1); g.stroke();
  if (note) {
    const k = r / 44; g.save(); g.translate(x + 12 * k, y - 14 * k); g.rotate(-0.15); g.fillStyle = 'hsl(45,64%,36%)'; g.fillRect(-27 * k, -27 * k, 54 * k, 54 * k);
    g.fillStyle = 'rgba(28,18,4,0.85)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `${13 * k}px "Patrick Hand"`; g.fillText("Sam's ball", 0, -10 * k); g.font = `${15 * k}px "Patrick Hand"`; g.fillText('tomorrow', 0, 8 * k); g.restore();
  }
}

// ---------------------------------------------------------------- the room (one world)
// o: n (notes up), win, sc, lamp 0..1, ball, ballNote, laundry 0..3, phoneOn, floorNotes, door ('open'), today
function room(g, t, o = {}) {
  const n = o.n ?? 97, win = o.win || 'cold', m = WINS[win], open = 1 - clamp((n - 81) / 16);
  g.fillStyle = '#131319'; g.fillRect(-600, -400, 3200, 1100);
  g.drawImage(wall(n, win, o.sc || 1), 0, 0, 1920, 700);
  if (o.today) paperNote(g, 1330, 330, 110, 0.06, [['today', 0.34, 0]]);
  g.fillStyle = '#0b0b10'; g.fillRect(-600, 690, 3200, 700);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(-600, 690); g.lineTo(2600, 690); g.stroke();
  // window light: a full pool while the window is open, thin slivers once it is covered
  g.save(); g.globalCompositeOperation = 'lighter';
  let gr = g.createRadialGradient(990, 330, 40, 990, 330, 560);
  gr.addColorStop(0, `rgba(${m.rgb},${0.13 * m.b * (1 + 1.6 * open)})`); gr.addColorStop(1, `rgba(${m.rgb},0)`);
  g.fillStyle = gr; g.fillRect(250, -250, 1500, 1200);
  if (open > 0.05) {
    gr = g.createLinearGradient(0, 690, 0, 1000); gr.addColorStop(0, `rgba(${m.rgb},${0.3 * m.b * open})`); gr.addColorStop(1, `rgba(${m.rgb},0)`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(WIN.x, 690); g.lineTo(WIN.x + WIN.w, 690); g.lineTo(WIN.x + WIN.w + 60, 1000); g.lineTo(WIN.x - 330, 1000); g.fill();
  }
  if (open < 0.6) {
    const r = rng(5);
    for (let i = 0; i < 4; i++) {
      const x = WIN.x + 40 + i * 100 + r() * 20, w = 5 + r() * 5;
      gr = g.createLinearGradient(0, 690, 0, 960); gr.addColorStop(0, `rgba(170,185,230,${0.2 * m.b * (1 - open)})`); gr.addColorStop(1, 'rgba(170,185,230,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x, 690); g.lineTo(x + w, 690); g.lineTo(x + w * 4 - 150 + i * 60, 960); g.lineTo(x - 150 + i * 60 - w * 2, 960); g.fill();
    }
  }
  g.restore();
  // door
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5;
  if (o.door === 'open') {
    gr = g.createLinearGradient(96, 0, 276, 0); gr.addColorStop(0, '#c9924a'); gr.addColorStop(1, '#8a5f33'); g.fillStyle = gr; g.fillRect(96, 236, 180, 454); g.strokeRect(96, 236, 180, 454);
    g.save(); g.globalCompositeOperation = 'lighter'; gr = g.createLinearGradient(0, 690, 0, 940); gr.addColorStop(0, 'rgba(255,180,100,0.22)'); gr.addColorStop(1, 'rgba(255,180,100,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(96, 690); g.lineTo(276, 690); g.lineTo(560, 940); g.lineTo(140, 940); g.fill(); g.restore();
  } else {
    g.fillRect(96, 236, 180, 454); g.strokeRect(96, 236, 180, 454); g.strokeRect(116, 262, 140, 180); g.strokeRect(116, 466, 140, 196);
    g.beginPath(); g.arc(254, 478, 6, 0, 7); g.stroke();
  }
  // laundry pile by the door (one of the things he keeps putting off)
  const ld = o.laundry || 0;
  if (ld > 0) {
    g.fillStyle = '#1c1c26'; g.strokeStyle = LINE; g.lineWidth = 2.5;
    for (let i = 0; i < Math.ceil(ld * 3); i++) { const k = Math.min(1, ld * 3 - i); g.beginPath(); g.ellipse(360 + (i % 2) * 34 - 10, 770 - i * 24 * k, 62 - i * 8, 26, (i % 2 ? 0.12 : -0.1), 0, 7); g.fill(); g.stroke(); }
  }
  // floor lamp
  g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(1205, 792); g.lineTo(1205, 470); g.moveTo(1180, 792); g.lineTo(1230, 792); g.stroke();
  g.beginPath(); g.moveTo(1172, 470); g.lineTo(1238, 470); g.lineTo(1226, 410); g.lineTo(1184, 410); g.closePath(); g.fillStyle = o.lamp ? `rgba(255,${200 + 20 * o.lamp},150,${0.35 + 0.6 * o.lamp})` : DARK; g.fill(); g.stroke();
  if (o.lamp) {
    g.save(); g.globalCompositeOperation = 'lighter';
    gr = g.createRadialGradient(1205, 450, 10, 1205, 450, 420); gr.addColorStop(0, `rgba(255,180,100,${0.3 * o.lamp})`); gr.addColorStop(1, 'rgba(255,180,100,0)'); g.fillStyle = gr; g.fillRect(760, 20, 900, 900);
    g.translate(1205, 800); g.scale(1, 0.22); gr = g.createRadialGradient(0, 0, 10, 0, 0, 330); gr.addColorStop(0, `rgba(255,180,100,${0.3 * o.lamp})`); gr.addColorStop(1, 'rgba(255,180,100,0)'); g.fillStyle = gr; g.fillRect(-340, -340, 680, 680);
    g.restore();
  }
  // notes that fell on the floor
  if (o.floorNotes ?? n > 60) [[640, 742, 0.3], [1080, 812, -0.5], [760, 880, 0.9], [1190, 730, 0.15]].forEach(([x, y, a], i) => {
    g.save(); g.translate(x, y); g.scale(1, 0.38); g.rotate(a); g.fillStyle = `hsl(45,60%,${22 + i * 2}%)`; g.fillRect(-52, -52, 104, 104); g.restore();
  });
  // Sam's basketball
  if (o.ball ?? true) { floorShadow(g, 520, 800, 70); ball(g, 520, 756, 44, o.ballNote ?? true); }
  // bed
  g.fillStyle = DARK; g.strokeStyle = LINE; g.lineWidth = 2.5;
  rr(g, 1806, 520, 46, 276, 10); g.fill(); g.stroke();
  g.fillRect(1252, 700, 566, 46); g.strokeRect(1252, 700, 566, 46);
  g.fillRect(1262, 746, 18, 48); g.strokeRect(1262, 746, 18, 48);
  rr(g, 1664, 604, 134, 46, 20); g.fillStyle = '#1d1d27'; g.fill(); g.stroke();
  rr(g, 1236, 640, 586, 66, 20); g.fillStyle = '#191922'; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(1560, 642); g.quadraticCurveTo(1575, 675, 1562, 704); g.stroke();
  // his phone on the bed
  if (o.phone ?? true) {
    g.save(); g.translate(1300, 636);
    if (o.phoneOn) { const pg = g.createRadialGradient(0, -4, 2, 0, -4, 110); pg.addColorStop(0, 'rgba(170,200,255,0.38)'); pg.addColorStop(1, 'rgba(170,200,255,0)'); g.fillStyle = pg; g.fillRect(-120, -120, 240, 240); }
    g.beginPath(); g.moveTo(-34, 2); g.lineTo(-22, -9); g.lineTo(36, -9); g.lineTo(26, 2); g.closePath();
    g.fillStyle = o.phoneOn ? '#cfe0ff' : '#0a0a0e'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2; g.stroke(); g.restore();
  }
}
// hero sitting on the bed edge, facing us (the opening / closing pose)
function heroSit(g, t, o = {}) {
  floorShadow(g, 1420, 792, 90);
  return actor(g, { x: 1420, y: 652, hip: true, thigh: 34, s: 1.2, armL: [0.2, -0.42], armR: [0.2, -0.42], ...o }, o.light || { dir: -1, amt: 0.42, dim: 0.1 });
}
function chestNote(g, r, s) { paperNote(g, r.neck[0] + 4 * s, r.neck[1] + 62 * s, 46 * s, -0.08, [['today', 0.36, 0]]); }

// ---------------------------------------------------------------- phone in his hand (POV)
function wrap(g, text, max) { const out = []; let cur = ''; for (const w of text.split(' ')) { const n = cur ? cur + ' ' + w : w; if (g.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; } out.push(cur); return out; }
function avatar(g, x, y, who) {
  g.fillStyle = who === 'mom' ? '#c4ab94' : C.tan; g.beginPath(); g.arc(x, y, 25, 0, 7); g.fill();
  if (who === 'mom') { g.fillStyle = '#3a2d2a'; g.beginPath(); g.arc(x, y, 26, Math.PI, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x - 24, y + 12, 7, 18, 0.2, 0, 7); g.fill(); }
  else { g.fillStyle = '#3b4a63'; g.beginPath(); g.arc(x, y, 26, Math.PI * 1.05, Math.PI * 1.95); g.fill(); g.beginPath(); g.ellipse(x + 16, y - 10, 20, 5, 0, 0, 7); g.fill(); }
}
// o: name, sub, who, clock, msgs [{day}|{who:'s'|'h', text, at}|{sys, at}], t0, t1, buzz [times], call (fn drawn instead of the chat)
function phoneShot(g, t, o) {
  const u = seg(t, o.t0, o.t1);
  noCam(g); g.save(); g.filter = 'blur(22px) brightness(0.55)'; g.drawImage(wall(o.n ?? 97, 'cold', 1), 300, 100, 1300, 500, -100, -60, 2120, 1260); g.restore();
  g.fillStyle = 'rgba(6,6,10,0.55)'; g.fillRect(0, 0, W, H);
  let shake = 0; for (const b of o.buzz || []) if (t >= b && t < b + 0.35) shake = Math.sin((t - b) * 95) * 5 * (1 - (t - b) / 0.35);
  setCam(g, { x: 960 - shake, y: 540 + Math.sin(t * 0.9) * 4, z: lerp(1, 1.06, ease(u)) });
  g.lineCap = 'round'; g.lineJoin = 'round';
  const hand = dark => {
    g.strokeStyle = g.fillStyle = dark ? C.line : C.cream;
    g.lineWidth = 210 + (dark ? 14 : 0); g.beginPath(); g.moveTo(1220, 800); g.lineTo(1800, 1120); g.stroke();
    g.beginPath(); g.ellipse(1130, 700, 150 + (dark ? 7 : 0), 185 + (dark ? 7 : 0), 0.25, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(742, 470 + i * 92, 50 + (dark ? 7 : 0), 40 + (dark ? 7 : 0), 0.1, 0, 7); g.fill(); }
  };
  const glow = g.createRadialGradient(960, 480, 100, 960, 480, 640); glow.addColorStop(0, 'rgba(150,180,255,0.16)'); glow.addColorStop(1, 'rgba(150,180,255,0)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  hand(true); hand(false);
  const px = 760, py = 84, pw = 400, ph = 740;
  g.save(); g.translate(960, 480); g.rotate(-0.025); g.translate(-960, -480);
  rr(g, px, py, pw, ph, 50); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.fillStyle = '#10131a'; g.fill();
  g.save(); rr(g, px + 13, py + 13, pw - 26, ph - 26, 38); g.clip();
  if (o.call) o.call(g, px, py, pw, ph);
  else {
    g.fillStyle = '#171b25'; g.fillRect(px, py, pw, 118);
    avatar(g, px + 62, py + 72, o.who);
    g.fillStyle = '#fff'; g.font = '700 32px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(o.name, px + 104, py + 66);
    g.fillStyle = '#8b93a5'; g.font = '400 19px Nunito'; g.fillText(o.sub, px + 105, py + 94);
    g.textAlign = 'right'; g.fillText(o.clock, px + pw - 34, py + 40);
    let y = py + 148;
    for (const m of o.msgs) {
      if (m.at > 0 && t < m.at) break;
      if (m.day) { g.fillStyle = '#737b8c'; g.font = '400 19px Nunito'; g.textAlign = 'center'; g.fillText(m.day, px + pw / 2, y + 8); y += 34; continue; }
      const pop = m.at > 0 ? ease(seg(t, m.at, m.at + 0.22)) : 1;
      if (m.sys) { g.globalAlpha = pop; rr(g, px + 50, y, pw - 100, 46, 23); g.fillStyle = '#3a1f24'; g.fill(); g.fillStyle = '#ff8d86'; g.font = '600 22px Nunito'; g.textAlign = 'center'; g.fillText(m.sys, px + pw / 2, y + 24); g.globalAlpha = 1; y += 60; continue; }
      g.font = '400 27px Nunito';
      const lines = wrap(g, m.text, 240), bw = Math.max(...lines.map(l => g.measureText(l).width)) + 40, bh = lines.length * 35 + 26;
      const bx = m.who === 's' ? px + 30 : px + pw - 30 - bw, ax = bx + (m.who === 's' ? 0 : bw);
      g.save(); g.translate(ax, y + bh); g.scale(0.6 + 0.4 * pop, 0.6 + 0.4 * pop); g.translate(-ax, -(y + bh)); g.globalAlpha = pop;
      rr(g, bx, y, bw, bh, 22); g.fillStyle = m.who === 's' ? '#272c38' : ACC; g.fill();
      g.fillStyle = m.who === 's' ? '#fff' : '#1c1405'; g.textAlign = 'left';
      lines.forEach((l, i) => g.fillText(l, bx + 20, y + 13 + 18 + i * 35));
      g.restore(); y += bh + 14;
    }
  }
  g.restore(); g.restore();
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(1150, 600, 46 + (dark ? 7 : 0), 108 + (dark ? 7 : 0), -0.42, 0, 7); g.fill(); }
  g.fillStyle = C.cream; g.beginPath(); g.ellipse(1210, 700, 66, 86, 0.25, 0, 7); g.fill();
}

// ---------------------------------------------------------------- people + outdoor pieces
const SAM = { col: C.tan, acc: 'cap' };
function walker(g, x, y, s, d, ph, o) {
  const sw = Math.sin(ph);
  return person(g, { x, y: y - Math.abs(Math.cos(ph)) * 4 * s, s, view: 'side', dir: d, legL: [0.48 * sw, -0.55 * Math.max(0, Math.cos(ph))], legR: [-0.48 * sw, -0.55 * Math.max(0, -Math.cos(ph))], armL: [-0.4 * sw, 0.25], armR: [0.4 * sw, 0.25], armLines: false, ...o });
}
function skyline(g, y, x0, x1, seed, col, sky) {
  if (sky) { const gr = g.createLinearGradient(0, y - 560, 0, y); sky.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(x0 - 400, y - 900, x1 - x0 + 800, 900); }
  const r = rng(seed); let x = x0;
  while (x < x1) {
    const w = 150 + r() * 120, h = 150 + r() * 150;
    g.fillStyle = col; g.fillRect(x, y - h, w, h);
    g.beginPath(); g.moveTo(x - 8, y - h); g.lineTo(x + w / 2, y - h - 50 - r() * 30); g.lineTo(x + w + 8, y - h); g.fill();
    for (let i = 0; i < 4; i++) { const lit = r() > 0.6; g.fillStyle = lit ? '#d9a657' : 'rgba(255,255,255,0.05)'; g.fillRect(x + 22 + (i % 2) * (w - 80), y - h + 34 + Math.floor(i / 2) * 62, 34, 40); }
    x += w + 6 + r() * 14;
  }
}
function streetLamp(g, x, y, h, a = 1) {
  g.strokeStyle = '#3a3846'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h + 30); g.quadraticCurveTo(x, y - h, x - 40, y - h); g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter';
  let gr = g.createRadialGradient(x - 44, y - h + 6, 3, x - 44, y - h + 6, 170); gr.addColorStop(0, `rgba(255,205,130,${0.8 * a})`); gr.addColorStop(0.15, `rgba(255,190,110,${0.3 * a})`); gr.addColorStop(1, 'rgba(255,190,110,0)');
  g.fillStyle = gr; g.fillRect(x - 230, y - h - 170, 380, 380);
  g.translate(x - 44, y + 30); g.scale(1, 0.2); gr = g.createRadialGradient(0, 0, 5, 0, 0, 330); gr.addColorStop(0, `rgba(255,190,110,${0.3 * a})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(-330, -330, 660, 660);
  g.restore();
}
// big black-screen cards
function card(text, w0 = 0.5, w1 = 2.6, size = 96) {
  const fn = (g, t, a, b) => blackLine(g, text, seg(t, a + w0, a + w1), ACC, 1 - seg(t, b - 0.6, b - 0.15), size);
  fn.black = true; return fn;
}

// CLOSE-UP (the emotion): the note in his hand says "tomorrow". u runs 0..1 through the shot.
function closeNote(g, t, u, cap) {
  noCam(g); g.save(); g.filter = 'blur(16px) brightness(0.7)'; g.drawImage(wall(96, 'cold', 1), 750, 125, 750, 422, -40, -30, 2000, 1140); g.restore();
  g.fillStyle = 'rgba(6,6,12,0.35)'; g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter';
  let gr = g.createRadialGradient(1500, 250, 30, 1500, 250, 900); gr.addColorStop(0, 'rgba(190,205,250,0.42)'); gr.addColorStop(1, 'rgba(190,205,250,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
  setCam(g, { x: 960, y: 540 + ease(u) * 6, z: lerp(1, 1.06, ease(u)) });
  const hand = [1168, 742 + Math.sin(t * 2.1) * 3];
  const bl = (u > 0.34 && u < 0.39) ? 1 : 0.12 + es(u, 0.6, 0.83) * 0.35, cry = es(u, 0.26, 0.54);
  const r = actor(g, { x: 790, y: 1500, s: 3, handR: hand, bendR: 1, armL: [0.1, -0.05], headTilt: 0.05, headOff: [0, es(u, 0.5, 0.9) * 3],
    face: { look: [0.62, 0.3], blink: bl, sad: 1 + cry * 0.35, smile: -0.55 - cry * 0.3 } }, { dir: 1, amt: 0.5, dim: 0.03 });
  const tr = seg(u, 0.49, 0.97);
  if (tr > 0) {
    const ex = r.head[0] + 0.62 * 45 + 19 * 3 * 0.93, ey = r.head[1] + 0.3 * 33 - 9 + 30;
    const yy = ey + ease(seg(tr, 0.3, 1)) * 150, sz = 9 + 5 * seg(tr, 0, 0.3);
    g.fillStyle = 'rgba(190,215,255,0.92)'; g.strokeStyle = 'rgba(120,150,200,0.8)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ex, yy - sz * 1.9); g.quadraticCurveTo(ex + sz * 1.2, yy, ex, yy + sz); g.quadraticCurveTo(ex - sz * 1.2, yy, ex, yy - sz * 1.9); g.fill(); g.stroke();
    if (tr > 0.3) { g.strokeStyle = 'rgba(190,215,255,0.35)'; g.lineWidth = 5; g.beginPath(); g.moveTo(ex, ey + 6); g.lineTo(ex, yy - sz * 1.9); g.stroke(); }
  }
  g.save(); g.translate(hand[0] + 150, hand[1] - 190); g.rotate(0.07 + Math.sin(t * 2.1) * 0.01);
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30;
  gr = g.createLinearGradient(-170, 0, 170, 0); gr.addColorStop(0, '#d9ab22'); gr.addColorStop(1, '#f7cf4a');
  g.fillStyle = gr; g.fillRect(-170, -170, 340, 340); g.shadowBlur = 0;
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(-170, 140, 340, 30);
  g.fillStyle = '#2a1c06'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '58px "Patrick Hand"'; g.fillText('say bye to Sam', 0, -78);
  g.font = '88px "Patrick Hand"'; g.fillText('tomorrow', 0, 22);
  g.strokeStyle = '#2a1c06'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-128, 76); g.quadraticCurveTo(0, 66, 130, 78); g.stroke();
  g.restore();
  g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 8; g.beginPath(); g.ellipse(hand[0] + 18, hand[1] - 34, 30, 50, 0.5, 0, 7); g.fill(); g.stroke();
  caption(g, cap, Math.min(seg(u, 0.1, 0.2), 1), ACC);
}

// ---------------------------------------------------------------- the court at dusk (core place 2)
const HOOP = [1464, 372];
function court(g, t, o = {}) {
  skyline(g, 640, -200, 2200, 21, '#15121f', [[0, '#141228'], [0.55, '#3f3154'], [1, '#8f5f5c']]);
  g.fillStyle = '#17151d'; g.fillRect(-400, 640, 2800, 80);
  g.strokeStyle = 'rgba(125,125,150,0.28)'; g.lineWidth = 1.5; g.beginPath();
  for (let x = -300; x < 2300; x += 28) { g.moveTo(x, 470); g.lineTo(x + 115, 700); g.moveTo(x, 470); g.lineTo(x - 115, 700); } g.stroke();
  g.strokeStyle = '#3a3846'; g.lineWidth = 5; g.beginPath(); g.moveTo(-300, 470); g.lineTo(2300, 470); for (let x = -260; x < 2300; x += 330) { g.moveTo(x, 462); g.lineTo(x, 704); } g.stroke();
  if (o.behind) o.behind();
  g.fillStyle = '#1b1822'; g.fillRect(-400, 700, 2800, 500);
  g.strokeStyle = 'rgba(230,225,210,0.16)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-400, 866); g.lineTo(2400, 866); g.moveTo(1010, 866); g.lineTo(1080, 716); g.lineTo(1840, 716); g.stroke();
  streetLamp(g, 420, 790, 440, 1);
  // hoop
  g.strokeStyle = '#4a4858'; g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); g.moveTo(1610, 800); g.lineTo(1610, 330); g.lineTo(1524, 330); g.stroke();
  g.fillStyle = '#2b2a36'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(1510, 246, 14, 134); g.strokeRect(1510, 246, 14, 134);
  g.strokeStyle = '#b8683c'; g.lineWidth = 5; g.beginPath(); g.moveTo(1420, 372); g.lineTo(1510, 372); g.stroke();
  g.strokeStyle = 'rgba(230,225,210,0.4)'; g.lineWidth = 1.6; g.beginPath(); for (let i = 0; i <= 5; i++) { g.moveTo(1422 + i * 17, 374); g.lineTo(1436 + i * 11, 432); } g.moveTo(1429, 400); g.lineTo(1500, 400); g.moveTo(1434, 422); g.lineTo(1494, 422); g.stroke();
  // bench
  g.strokeStyle = LINE; g.lineWidth = 4; g.beginPath(); g.moveTo(90, 716); g.lineTo(330, 716); g.moveTo(110, 716); g.lineTo(110, 800); g.moveTo(310, 716); g.lineTo(310, 800); g.moveTo(90, 660); g.lineTo(330, 660); g.stroke();
}
function benchPeople(g, t, two) {
  const nod = Math.sin(t * 2.2) * 0.05;
  if (two) person(g, { x: 160, y: 712, hip: true, thigh: 30, s: 0.95, col: '#8d8d9b', acc: 'glasses', headTilt: nod, face: { look: [0.6, 0], smile: 0.5 }, armLines: false });
  person(g, { x: 268, y: 712, hip: true, thigh: 30, s: 0.95, col: '#a3927e', acc: 'longhair', headTilt: -nod, face: { look: [two ? -0.6 : 0.2, two ? 0 : 0.6], smile: 0.4 }, armLines: false });
}

// ---------------------------------------------------------------- INSERT: his hand writes a note (top-down)
// o: lines [[text, size, dy]], pale, w [[t0,t1] per line] as fractions of the shot
function writeInsert(g, t, a, b, o) {
  const u = seg(t, a, b);
  noCam(g); g.fillStyle = '#100f15'; g.fillRect(0, 0, W, H);
  let gr = g.createRadialGradient(900, 420, 60, 900, 420, 900); gr.addColorStop(0, o.pale ? 'rgba(255,200,130,0.20)' : 'rgba(255,190,110,0.13)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960, y: 540, z: lerp(1.0, 1.07, ease(u)) });
  g.strokeStyle = 'rgba(110,110,125,0.35)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-100, 250); g.lineTo(2100, 190); g.stroke();
  const cx = 900, cy = 500, S = 560;
  g.save(); g.translate(cx, cy); g.rotate(-0.04);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; g.shadowOffsetY = 10;
  gr = g.createLinearGradient(-S / 2, -S / 2, S / 2, S / 2); gr.addColorStop(0, o.pale ? '#fbf5df' : '#f7cf4a'); gr.addColorStop(1, o.pale ? '#e6dcc0' : '#d9ab22');
  g.fillStyle = gr; g.fillRect(-S / 2, -S / 2, S, S); g.shadowColor = 'transparent';
  g.fillStyle = 'rgba(0,0,0,0.1)'; g.fillRect(-S / 2, S / 2 - 50, S, 50);
  let tip = [S * 0.1, S * 0.2], writing = false;
  g.fillStyle = '#2a1c06'; g.textAlign = 'left'; g.textBaseline = 'middle';
  o.lines.forEach(([txt, fs, dy], i) => {
    g.font = `${fs}px "Patrick Hand"`; const w = g.measureText(txt).width, p = seg(u, o.w[i][0], o.w[i][1]);
    if (p > 0) { g.save(); g.beginPath(); g.rect(-w / 2 - 10, dy - fs, (w + 20) * p, fs * 2); g.clip(); g.fillText(txt, -w / 2, dy); g.restore(); }
    if (u >= o.w[i][0] - 0.06) { tip = [-w / 2 + w * p, dy + fs * 0.12 + (p > 0 && p < 1 ? Math.sin(t * 38) * fs * 0.2 : 0)]; writing = p > 0 && p < 1; }
  });
  g.restore();
  // hand + pen; it leaves when the writing is done
  const end = o.w[o.lines.length - 1][1], away = es(u, end + 0.03, end + 0.2), inn = 1 - es(u, 0, 0.1);
  const c = Math.cos(-0.04), s = Math.sin(-0.04);
  const tx = cx + tip[0] * c - tip[1] * s + (away + inn) * 700, ty = cy + tip[0] * s + tip[1] * c + (away + inn) * 520;
  g.lineCap = 'round';
  for (const dark of [true, false]) {
    g.strokeStyle = g.fillStyle = dark ? C.line : C.cream;
    g.lineWidth = 200 + (dark ? 14 : 0); g.beginPath(); g.moveTo(tx + 250, ty + 280); g.lineTo(tx + 900, ty + 900); g.stroke();
    g.beginPath(); g.ellipse(tx + 150, ty + 170, 140 + (dark ? 7 : 0), 165 + (dark ? 7 : 0), -0.6, 0, 7); g.fill();
    g.beginPath(); g.ellipse(tx + 40, ty + 120, 44 + (dark ? 7 : 0), 82 + (dark ? 7 : 0), 0.75, 0, 7); g.fill();
  }
  g.strokeStyle = '#0c0c10'; g.lineWidth = 20; g.beginPath(); g.moveTo(tx + 8, ty - 8); g.lineTo(tx + 210, ty - 250); g.stroke();
  g.strokeStyle = '#5a5a68'; g.lineWidth = 3; g.beginPath(); g.moveTo(tx + 22, ty - 4); g.lineTo(tx + 222, ty - 244); g.stroke();
  g.fillStyle = '#0c0c10'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + 2, ty - 18); g.lineTo(tx + 18, ty - 6); g.fill();
  g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 7; g.beginPath(); g.ellipse(tx + 70, ty + 40, 40, 74, 0.9, 0, 7); g.fill(); g.stroke();
  g.fillStyle = C.cream; g.beginPath(); g.ellipse(tx + 135, ty + 110, 70, 80, 0.5, 0, 7); g.fill();
  if (o.cap) caption(g, o.cap, capA(t, a + 0.5, b - 0.1), ACC);
}

// ---------------------------------------------------------------- THE REPEATED SHOT: same wall, one more note
function pickN(k) { while (noteAt(k).cy < 330 || noteAt(k).cx < 430 || noteAt(k).cx > 1700) k++; return k; }
// o: n0, win, lamp, laundry, dS (demon size), dText, cap, think, thinkAt
function repShot(g, t, a, b, o) {
  const u = seg(t, a, b), tp = a + (o.tp ?? 1.7), nt = noteAt(o.n0), n = t < tp ? o.n0 : o.n0 + 1;
  setCam(g, { x: 960, y: lerp(540, 534, ease(u)), z: lerp(1, 1.035, ease(u)) });
  room(g, t, { n, win: o.win, lamp: o.lamp, laundry: o.laundry, ballNote: o.n0 > 0, floorNotes: o.n0 > 50 });
  const hx = clamp(nt.cx - 46, 430, 1185), reach = Math.max(0, 392 - nt.cy);
  const hy = 800 - Math.min(reach, 120) * Math.sin(Math.PI * seg(t, tp - 0.22, tp + 0.22));
  const k = kf(t, [[a + 0.7, 0], [tp, 1], [tp + 0.3, 1], [tp + 1.1, 0]]);
  const hand = [lerp(hx + 62, nt.cx - 12, k), lerp(690, nt.cy + 22, k) + (hy - 800)];
  // the demon behind him
  const dS = o.dS, dx = hx - 250 - dS * 40, dy = 800 + (dS > 1.5 ? 70 : 0), ds = 1.2 * dS;
  const d = demon(g, { x: dx, y: dy, s: ds, lean: 0.04 * dS, headOff: [8 * dS, Math.sin(t * 1.7) * 2], face: { look: [0.7, 0.2] }, armR: [0.3 + 0.2 * Math.sin(t * 1.3), -0.3] }, { t, a: o.dA ?? 1, crack: o.crack });
  let tx = d.head[0] - 215 * dS, ty = d.head[1] - 24 * dS; if (tx < 250) { tx = d.head[0] + 150 * dS; ty = d.head[1] - 78 * dS; }
  demonText(g, o.dText || 'tomorrow.', tx, ty, t, Math.min(seg(t, a + 0.5, a + 0.8), 1 - seg(t, b - 0.9, b - 0.5)), 56 + 16 * dS);
  floorShadow(g, hx, 800, 90);
  actor(g, { x: hx, y: hy, s: 1.2, view: 'back', handR: k > 0.01 ? hand : null, bendR: 1, headOff: [0, Math.sin(t * 1.5) + (o.slump || 0) * 14], lean: (o.slump || 0) * 0.05 }, { dir: o.lamp ? 1 : -1, amt: 0.35, dim: o.dim ?? 0.1 });
  if (t < tp && k > 0.01) drawNote(g, { ...nt, cx: hand[0] + 12, cy: hand[1] - 22 }, 'wall');
  if (t >= tp && t < tp + 0.35) { g.save(); g.globalAlpha = 0.5 * (1 - seg(t, tp, tp + 0.35)); g.fillStyle = ACC; g.translate(nt.cx, nt.cy); g.rotate(nt.rot); const e = 1 + seg(t, tp, tp + 0.35) * 0.5; g.fillRect(-55 * e, -55 * e, 110 * e, 110 * e); g.restore(); }
  if (o.think) headText(g, o.think, hx, hy - 510, t, a + 0.25, tp - 0.1);
  hud(g, 'NOTES', n);
  if (o.cap) caption(g, o.cap, capA(t, a + 1.0, b - 0.1), ACC);
}
function repSfx(a, i, tp = 1.7) { sfx(a + 0.2, 'demon-8bit-' + (i % 3 + 1), 0.8); sfx(a + 0.55, 'whisper-tomorrow'); sfx(a + tp, 'note-slap'); sfx(a + tp + 0.02, 'count-tick'); }
