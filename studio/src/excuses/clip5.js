// CLIP 5 (2:08-2:40) - the guitar again, his own dinner, one bad morning, and the voice runs out of excuses.
(() => {
const T = [128, 134, 137, 143, 149, 154, 160];
sfx(128.0, 'apt-amb'); sfx(128.6, 'string-dust', 0.6); sfx(129.6, 'guitar-strum'); sfx(131.6, 'guitar-strum', 0.9);
sfx(134.0, 'bar-hum'); sfx(134.4, 'bar-slide-up'); sfx(135.6, 'bar-ding');
sfx(137.0, 'kitchen-amb'); sfx(137.4, 'pan-sizzle'); sfx(140.6, 'marker-tick');
sfx(143.0, 'alarm-ring'); sfx(143.6, 'cloth-rustle'); sfx(144.4, 'demon-8bit-1'); sfx(144.6, 'whisper-justonce2'); sfx(145.5, 'bar-slip'); sfx(147.8, 'cloth-rustle');
sfx(149.0, 'morning-amb'); sfx(149.4, 'steps', 0.6); sfx(150.6, 'snooze-click'); sfx(151.4, 'bar-slide-up', 0.7);
sfx(154.0, 'bar-hum'); sfx(154.4, 'bar-slide-up'); sfx(155.2, 'demon-8bit-2'); sfx(156.2, 'crack'); sfx(157.0, 'shatter'); sfx(157.6, 'bar-ding'); sfx(157.8, 'celesta-sparkle', 0.7);

function notesFx(g, x, y, t, a) { for (let i = 0; i < 5; i++) { const ph = (t * 0.45 + i * 0.2) % 1, nx = x + ph * 140 + Math.sin(t * 2 + i) * 14, ny = y - ph * 170, al = a * Math.sin(ph * Math.PI); g.save(); g.globalAlpha = al; g.fillStyle = g.strokeStyle = 'rgb(255,214,150)'; g.lineWidth = 3; g.beginPath(); g.ellipse(nx, ny, 8, 6, -0.4, 0, 7); g.fill(); g.beginPath(); g.moveTo(nx + 7, ny - 2); g.lineTo(nx + 7, ny - 28); g.stroke(); g.restore(); } }
// MEDIUM (excuse 4, reversed): the TV off, the guitar in his lap. Mom smiles in the doorway.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), play = t > 129.4;
  setCam(g, { x: lerp(1160, 1180, u), y: lerp(560, 565, u), z: lerp(1.3, 1.38, u) });
  apartment(g, t, { dust: 0, guitar: false });
  const x = COUCH[1], strum = Math.sin(t * 9) * 8 * (play ? 1 : 0);
  const hr = Hero(g, { x, y: 712, hip: true, thigh: 20, s: 1.1, handL: [x - 116, 636], handR: [x + 24, 688 + strum], face: { look: [-0.3, 0.5], smile: play ? 0.7 : 0.3, blink: play ? 1 : blink(t, 0.4) } }, { dir: -1 });
  guitar(g, x + 40, 742, t < 128.8 ? 1 - seg(t, 128.4, 128.8) : 0, 0.85, -1.2);
  apFront(g, t, { facedown: false });
  Hero(g, { x: 1540, y: AP_F, s: 1.05, ...MOM, face: { look: [-0.8, 0.1], smile: 0.8, blink: blink(t, 1.6) } }, { dir: -1 }); floorShadow(g, 1540, AP_F + 2, 90);
  if (play) notesFx(g, x + 30, 600, t, 1);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 60);
  caption(g, 'He played *again*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
function s2(g, t, a, b) { barInsert(g, t, a, b, { v0: 60, v1: 80, t0: 134.4, t1: 135.6, hand: 'his' }); }
// WIDE (excuse 5, reversed): no fast food - he cooks. A tick on the DIET note.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), tick = t > 140.6;
  setCam(g, { x: lerp(860, 900, u), y: lerp(560, 565, u), z: lerp(1.1, 1.18, u) });
  kitchen(g, t, { note: 'DIET', check: tick });
  const ph = pose('hold', 430, K_F, 1.05), sz = Math.sin(t * 5) * 4;
  const hr = Hero(g, { x: 430, y: K_F, s: 1.05, handL: [ph.handL[0] - 10, ph.handL[1] - 40], handR: [ph.handR[0] + 30, ph.handR[1] - 30 + sz], face: { look: [0, 0.6], smile: 0.5, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 430, K_F + 2, 90);
  g.fillStyle = '#2a2832'; g.strokeStyle = C.line; g.lineWidth = 2.5; g.beginPath(); g.ellipse(ph.handR[0] + 70, ph.handR[1] - 26 + sz, 60, 14, 0, 0, 7); g.fill(); g.stroke(); ln(g, [ph.handR[0] + 10, ph.handR[1] - 26 + sz, ph.handR[0] + 30, ph.handR[1] - 30 + sz], 6, '#2a2832');
  for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; g.fillStyle = `rgba(220,220,230,${0.3 * (1 - k)})`; g.beginPath(); g.arc(ph.handR[0] + 50 + i * 20, ph.handR[1] - 50 - k * 120, 10 + k * 16, 0, 7); g.fill(); }
  Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.05, ...MOM, face: { look: [-0.8, 0.1], smile: 0.7, blink: blink(t, 1.3) } }, { dir: -1 });
  kitchenTable(g, t, { cup: true, cupX: 1060 });
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 80);
  caption(g, 'He made his own *dinner*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// WIDE (the relapse): one bad morning - pillow over his head. The bar slips.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(560, 580, u), y: 540, z: lerp(1.2, 1.28, u) });
  heroRoom(g, t, { lying: true, dawn: true });
  alarmClock(g, 1370, 572, 0.7, t, 1, '6:00');
  if (t > 143.6) { g.save(); g.translate(262, 590); g.rotate(-0.2); rr(g, -70, -40, 140, 60, 24); g.fillStyle = '#26262f'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke(); g.restore(); }
  const dA = es(t, 144.4, 145) * (1 - es(t, 147.6, 148.4));
  if (dA > 0) demonAt(g, t, 640, 742, 0.75, 'just once.', Math.min(seg(t, 144.6, 144.9), 1 - seg(t, 147.4, 147.8)), { a: dA, tx: 60, ty: 150, face: { look: [-0.8, 0.4] } });
  pbar(g, 262, 500, 0.85, kf(t, [[145.5, 80], [146.0, 74]]));
  caption(g, 'Some mornings were *harder*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// WIDE (he gets up anyway): the bar climbs back
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), walk = seg(t, 149.4, 150.4);
  setCam(g, { x: lerp(800, 840, u), y: 530, z: lerp(1.05, 1.1, u) });
  heroRoom(g, t, { dawn: true });
  alarmClock(g, 1370, 572, 0.7, t, t < 150.6 ? 1 : 0, '6:04');
  const x = lerp(900, 1290, walk);
  const r = walk > 0 && walk < 1 ? walker(g, x, 742, 0.95, 1, t * 6.5, {}) : Hero(g, { x, y: 742, s: 0.95, handR: t > 150.4 && t < 151 ? [1350, 580] : null, face: { look: [0.7, 0.1], sad: -0.3, smile: t > 151 ? 0.4 : 0, blink: blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, x, 744, 90);
  pbar(g, r.head[0], r.head[1] - 110, 0.85, kf(t, [[151.4, 74], [152.6, 90]]));
  caption(g, 'But he got up *anyway*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// INSERT (the voice breaks): his hand pushes the bar to 100; the red hand cracks and shatters
function s6(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 90, v1: 100, t0: 154.4, t1: 157.6, hand: 'his' });
  const k = es(t, 154.6, 155.4), br = seg(t, 157.0, 158.2);
  if (br < 1) { g.save(); g.globalAlpha = k * (1 - br); g.shadowColor = 'rgba(255,40,25,0.9)'; g.shadowBlur = 30; g.lineCap = 'round'; g.strokeStyle = '#141217'; g.lineWidth = 90; const tx = lerp(-200, 520, k) + Math.sin(t * 30) * 6 * seg(t, 156, 157); g.beginPath(); g.moveTo(-300, 980); g.quadraticCurveTo(200, 760, tx, 560); g.stroke(); g.fillStyle = '#141217'; g.beginPath(); g.ellipse(tx, 540, 62, 56, 0, 0, 7); g.fill(); g.shadowBlur = 0;
    if (t > 156.2) { g.strokeStyle = RED; g.lineWidth = 4; const q = rng(5); for (let i = 0; i < 9; i++) { let x = tx - 150 + q() * 260, y = 560 + q() * 300; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 4; j++) { x += (q() - 0.5) * 50; y += (q() - 0.5) * 50; g.lineTo(x, y); } g.stroke(); } } g.restore(); }
  if (br > 0) { const q = rng(8); for (let i = 0; i < 40; i++) { const an = q() * 6.28, d = br * (100 + q() * 400); g.fillStyle = i % 3 ? `rgba(20,18,23,${1 - br})` : `rgba(255,58,44,${1 - br})`; g.fillRect(400 + Math.cos(an) * d, 650 + Math.sin(an) * d + br * br * 200, 10 + q() * 14, 10 + q() * 14); } }
  demonText(g, 'tomorrow...?', 520, 200, t, Math.min(seg(t, 155.2, 155.5), 1 - seg(t, 156.8, 157.1)), 64);
  caption(g, 'The voice ran out of *excuses*.', capA(t, 157.4, b - 0.1), ACC);
}
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
