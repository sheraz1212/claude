// CLIP 4 (1:36-2:08) - the twist comes through another person: "me too."
(() => {
const T = [96, 102, 107.5, 113, 118, 123, 128];
sfx(96, 'night-amb'); sfx(98.2, 'door-open'); sfx(102.6, 'pop-8bit-1'); sfx(105, 'pop-8bit-3'); sfx(108.2, 'count-tick'); sfx(108.7, 'count-tick'); sfx(109.2, 'count-tick'); sfx(109.7, 'count-tick'); sfx(110.6, 'celesta-sparkle');
sfx(113.4, 'pen-write', 0.8); sfx(115.5, 'pen-write', 0.8); sfx(120.3, 'ball-catch'); sfx(123, 'night-amb'); sfx(124.6, 'demon-8bit-2', 0.5); sfx(125.2, 'whisper-onemore', 0.6); sfx(123.2, 'door-open', 0.8);

function stepPeople(g, t, o = {}) {
  const hero = Hero(g, { x: 980, y: 776, hip: true, thigh: 24, s: 1.2, headOff: [0, 16 * (1 - (o.up || 0))], face: { look: [0.6 * (o.up || 0), 0.9 - 0.8 * (o.up || 0)], sad: 0.9, smile: -0.5 + 0.4 * (o.up || 0), blink: 0.3 * (1 - (o.up || 0)) } }, 0, { dir: 1, amt: 0.3, dim: 0.1 });
  eyeBags(g, hero, 1.2, 0.9);
  let dev = null;
  if (o.dev === 'sit') dev = P(g, { x: 1190, y: 776, hip: true, thigh: 24, s: 1.2, ...DEV, face: { look: [-0.6, 0.1], smile: 0.3, sad: 0.3, blink: ((t + 1) % 3.6 < 0.14) ? 1 : 0 }, ...(o.devPose || {}) }, 0.95);
  return { hero, dev };
}
// WIDE (one-off place, the dorm steps at night): his roommate finds him.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1050, u), y: lerp(560, 580, u), z: lerp(1, 1.1, u) });
  steps(g, t, { open: t > 98.2 && t < 99.6 });
  const sat = t >= 100.2;
  if (!sat && t > 98.3) { const dx = lerp(1140, 1210, es(t, 98.5, 100.2)); const w = walker(g, dx, lerp(760, 800, es(t, 99, 100.2)), 1.2, 1, dx / 30, { ...DEV }); light(g, w, 1.2, 0.95); }
  stepPeople(g, t, { dev: sat ? 'sit' : null });
  caption(g, 'His roommate Dev found *him*.', capA(t, 98.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM two-shot (the confession): he finally says it. "me too."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1085, y: lerp(640, 630, u), z: lerp(1.6, 1.7, u) });
  steps(g, t);
  const up = es(t, 105.2, 106.2);
  const { hero, dev } = stepPeople(g, t, { dev: 'sit', up, devPose: { handL: up > 0 ? [lerp(1140, 1070, up), lerp(760, 610, up)] : null, bendL: -1 } });
  headText(g, "i can't stop.", hero.head[0] - 20, hero.head[1] - 112, t, 102.6, 104.7);
  headText(g, 'i know. me too.', dev.head[0] + 30, dev.head[1] - 112, t, 105, 107.3);
  caption(g, 'He said it out *loud*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// POV PHONE (Dev's phone): a long row of day zeros - and then 212.
function s3(g, t, a, b) {
  const k = es(t, 108, 110.6);
  phoneShot(g, t, { t0: a, t1: b, hand: DEV.col, glow: WARM, bg: '90,70,50', draw: (g, px, py, pw, ph) => {
    g.fillStyle = '#12151c'; g.fillRect(px, py, pw, ph);
    g.fillStyle = '#8b93a5'; g.font = '600 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText("DEV'S STREAK", px + pw / 2, py + 60);
    const rows = ['DAY 0', 'DAY 0', 'DAY 2', 'DAY 0', 'DAY 0', 'DAY 5', 'DAY 0', 'DAY 11', 'DAY 0'];
    g.save(); g.beginPath(); g.rect(px, py + 90, pw, 330); g.clip();
    rows.forEach((rw, i) => { const y = py + 130 + i * 58 - k * 250; g.fillStyle = rw === 'DAY 0' ? '#7c4a4a' : '#6b7386'; g.font = '700 30px Nunito'; g.fillText(rw, px + pw / 2, y); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(px + 60, y + 26, pw - 120, 2); });
    g.restore();
    const pop = es(t, 110.4, 110.9);
    glow(g, px + pw / 2, py + 540, 220 * pop, WARM, 0.45 * pop);
    g.save(); g.translate(px + pw / 2, py + 540); g.scale(0.6 + 0.4 * pop, 0.6 + 0.4 * pop); g.globalAlpha = pop; g.fillStyle = '#ffdca0'; g.font = '800 34px Nunito'; g.fillText('DAY', 0, -62); g.font = '800 120px Nunito'; g.fillText('212', 0, 14); g.restore();
  } });
  caption(g, 'Dev had fallen. Many *times*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// BLACK (the wisdom lines)
function s4(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'Shame grows in the *dark*.', seg(t, a + 0.4, a + 2.0), ACC, fo, 88, -70);
  blackLine(g, 'So say it out *loud*.', seg(t, a + 2.5, a + 3.9), ACC, fo, 88, 70);
}
s4.black = true;
// INSERT (the tiny decision): at night, his phone goes into Dev's hand.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 119.2, 120.4), px = lerp(800, 1090, k), py = 520 - Math.sin(Math.PI * k) * 24;
  noCam(g); g.fillStyle = '#121017'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  glow(g, 1500, 420, 900, WARM, 0.22);
  g.lineCap = 'round';
  const arm = (col, x0, y0, x1, y1, hx, hy, rot) => { for (const dark of [true, false]) { g.strokeStyle = g.fillStyle = dark ? C.line : col; g.lineWidth = 190 + (dark ? 14 : 0); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.beginPath(); g.ellipse(hx, hy, 150 + (dark ? 7 : 0), 120 + (dark ? 7 : 0), rot, 0, 7); g.fill(); } };
  const lx = lerp(0, 60, k) - 40 * es(t, 120.6, 121.6);
  arm(C.cream, -200, 760, 520 + lx, 590, 650 + lx, 560, -0.15);
  arm(DEV.col, 2120, 760, 1420, 600, 1280, 570, 0.15);
  g.save(); g.translate(px, py); g.rotate(-0.08 + k * 0.16); rr(g, -150, -82, 300, 164, 26); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke(); rr(g, -138, -70, 276, 140, 18); g.fillStyle = '#0d0d12'; g.fill(); g.restore();
  for (const [col, x, y, rot, show] of [[C.cream, 720 + lx, 500, 0.9, k < 0.9], [DEV.col, 1200, 510, -0.9, k > 0.75]]) if (show) { g.fillStyle = col; g.strokeStyle = C.line; g.lineWidth = 7; g.beginPath(); g.ellipse(x, y, 44, 86, rot, 0, 7); g.fill(); g.stroke(); }
  caption(g, 'At night, Dev kept his *phone*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// THE REPEATED BED SHOT, changed: no glow, and the door stays open (the transformation token).
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 900, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  dorm(g, t, { sleeping: true, glow: 0, bookAt: 'night', door: 'open' });
  demonAt(g, t, 1000, 836, 1.25, 'one more...?', Math.min(seg(t, 125.2, 125.5), 1 - seg(t, 127.2, 127.6)), { tx: 270, ty: 40, crack: 0.25, face: { look: [-0.7, 0.2], smile: -0.4, sad: 0.2 } });
  hud(g, 'DAYS CLEAN', 1);
  caption(g, 'He left the door *open*.', capA(t, a + 0.8, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6]);
})();
