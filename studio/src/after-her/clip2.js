// AFTER HER - CLIP 2 (0:36-1:12): game night without him, sad songs, the cafe they loved (a warm memory of her),
// the rainy walk ("she's happier without you."), and the low point: it wasn't her keeping him there.
(() => {
const T = [36, 42, 48, 54, 60, 66, 72];
sfx(36.0, 'court-amb'); sfx(36.6, 'ball-bounce', 0.6); sfx(38.2, 'net-swish', 0.7); sfx(38.6, 'crowd-cheer', 0.3); sfx(40.4, 'ball-bounce', 0.5);
sfx(42.0, 'room-quiet'); sfx(42.4, 'headphones-leak', 0.7); sfx(45.0, 'sigh', 0.6);
sfx(48.0, 'street-amb'); sfx(48.4, 'steps', 0.6); sfx(50.4, 'memory-chime', 0.7);
sfx(54.0, 'cafe-amb'); sfx(54.4, 'laugh-soft', 0.6); sfx(56.4, 'cup-clink', 0.6); sfx(57.8, 'laugh-soft', 0.5);
sfx(60.0, 'rain-loop'); sfx(60.4, 'steps', 0.5); sfx(62.6, 'demon-8bit-2', 0.6); sfx(62.7, 'whisper-happier', 0.95); sfx(64.4, 'thunder-far', 0.7);
sfx(66.0, 'night-amb'); sfx(66.6, 'heartbeat', 0.6); sfx(69.2, 'low-thud', 0.6); sfx(69.3, 'piano-low-hit', 0.6);

// WIDE (the court at sunset): game night goes on - without him.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 980, u), y: 560, z: lerp(1.0, 1.06, u) });
  cCourt(g, t);
  const ph = (t - a) * 2.4, bx = 960 + Math.sin(ph) * 360, by = 760 - Math.abs(Math.sin(ph * 2)) * 140;
  [[620, '#A9A9B4', 'cap', '#2f4f7a'], [860, '#C9A77A', 'scarf', '#c0453a'], [1120, '#8d8d9b', 'glasses', ''], [1380, '#C9A77A', 'cap', '#3b6a4a']].forEach(([x, c, ac, acc], i) => {
    const ux = x + Math.sin(t * 2 + i) * 50, run = Math.abs(Math.sin(t * 3 + i)) > 0.5;
    if (run) walker(g, ux, CC_F, 1.0, Math.cos(t * 2 + i) > 0 ? 1 : -1, t * 9 + i, { col: c, acc: ac, accCol: acc }, 1.5); else P(g, { x: ux, y: CC_F, s: 1.0, col: c, acc: ac, accCol: acc, face: { smile: 0.9 } });
    floorShadow(g, ux, CC_F + 2, 70); });
  ball(g, bx, by, 1);
  daysHud(g, 31);
  caption(g, 'They still played. Just *without* him.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
// MEDIUM: his room, headphones on, the same sad song. Her memory leans on his shoulder.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(620, 640, u), y: 520, z: lerp(1.5, 1.56, u) });
  const r = cOnBed(g, t, { mode: 'evening', dust: 0.6, behind: () => memoryHer(g, SIT[0] + 170, SIT[1], SS, 1, { hip: true, thigh: 20, headOff: [-12, 6], face: { look: [-0.8, 0.3], smile: 0.4 } }),
    hero: { ...pose('hold', SIT[0], SIT[1], SS, { hip: true }), headOff: [0, 10], face: { look: [0.2, 0.8], sad: 0.9, smile: -0.2, blink: 1 } } });
  g.strokeStyle = '#2b2b38'; g.lineWidth = 8; g.beginPath(); g.arc(r.head[0], r.head[1] - 6, 54, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  for (const sx of [-1, 1]) box(g, r.head[0] + sx * 56 - 12, r.head[1] - 14, 24, 40, '#2b2b38', 8);
  for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); g.save(); g.globalAlpha = 1 - k; g.fillStyle = '#9ab0d8'; g.font = '700 40px Nunito'; g.fillText('♪', r.head[0] + 80 + i * 30, r.head[1] - 40 - k * 160); g.restore(); }
  daysHud(g, 38);
  caption(g, 'He stayed in his room with the same *sad* songs.', capA(t, a + 0.4, b - 0.1), ACC);
}
s2.fin = 0.3;
// WIDE (outside the cafe they loved): he walks past, slows down, looks in.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = seg(t, 48.2, 51.0);
  setCam(g, { x: lerp(960, 980, u), y: 560, z: lerp(1.05, 1.1, u) });
  grad(g, -500, -400, 3000, 1300, [[0, '#6fa8d8'], [1, '#bfe0f4']]);
  box(g, 300, 160, 1320, 700, '#f0b765', 8); g.fillStyle = '#c0453a'; g.fillRect(300, 160, 1320, 70); g.fillStyle = '#fff'; g.font = '800 44px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CORNER CAFE', 960, 196);
  grad(g, 420, 300, 700, 400, [[0, '#ffe2a8'], [1, '#f0b765']]); g.strokeStyle = '#f3ead8'; g.lineWidth = 12; g.strokeRect(420, 300, 700, 400);
  g.save(); g.beginPath(); g.rect(420, 300, 700, 400); g.clip(); box(g, 620, 560, 300, 14, '#f3ead8', 6); box(g, 640, 500, 60, 60, '#7a4a2c', 6); box(g, 840, 500, 60, 60, '#7a4a2c', 6); g.restore();
  box(g, 1240, 360, 200, 500, '#7a4a2c', 6); glow(g, 770, 500, 500, WARM, 0.25);
  g.fillStyle = '#8a8f98'; g.fillRect(-500, 860, 3000, 600); ln(g, [-500, 860, 2500, 860], 3, '#5a5f68');
  const hx = lerp(1700, 860, go);
  const r = go < 1 ? walker(g, hx, 860, 1.05, -1, t * 6, { face: { sad: 0.7 } }) : Hero(g, { x: hx, y: 860, s: 1.05, view: 'side', dir: -1, face: { look: [-0.9, -0.1], sad: 0.9, smile: -0.2, blink: blink(t, 0.4) } }, { dir: -1 });
  floorShadow(g, hx, 862, 90);
  daysHud(g, 45);
  caption(g, 'He even avoided the *café* they used to love.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// INSIDE (the memory, soft and golden): the two of them laughing at "their" table. It fades - he sits there alone.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), fade = es(t, 57.4, 58.8);
  setCam(g, { x: lerp(960, 965, u), y: 560, z: lerp(1.4, 1.46, u) });
  cCafe(g, t);
  const laugh = Math.abs(Math.sin(t * 8)) * 4 * (1 - fade);
  if (fade < 1) { g.save(); g.globalAlpha = 1 - fade; Hero(g, { x: 1120, y: 770, hip: true, thigh: 20, s: 1.0, ...GF, ...pose('table', 1120, 770, 1.0, { hip: true, tableY: 712 }), headOff: [0, -laugh], face: { look: [-0.8, 0], smile: 1 } }, { dir: -1 }); g.restore(); }
  else memoryHer(g, 1120, 770, 1.0, 0.8, { hip: true, thigh: 20, ...pose('table', 1120, 770, 1.0, { hip: true, tableY: 712 }), face: { look: [-0.8, 0], smile: 0.5 } });
  Hero(g, { x: 800, y: 770, hip: true, thigh: 20, s: 1.05, ...pose('table', 800, 770, 1.05, { hip: true, tableY: 712 }), headOff: [0, fade > 0.5 ? 10 : -laugh], face: { look: [0.8, fade > 0.5 ? 0.5 : 0], smile: lerp(1, -0.2, fade), sad: lerp(0, 0.9, fade), blink: blink(t, 0.4) } }, { dir: 1 });
  cafeTable(g, 960, 712, 420); chai(g, 880, 712); chai(g, 1050, 712);
  if (fade < 0.5) { noCam(g); const v = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1000); v.addColorStop(0, 'rgba(255,230,200,0)'); v.addColorStop(1, `rgba(255,220,180,${0.45 * (1 - fade * 2)})`); g.fillStyle = v; g.fillRect(0, 0, W, H); }
  daysHud(g, 45);
  caption(g, 'Every corner still had *her* in it.', capA(t, a + 0.4, b - 0.1), ACC);
}
// WIDE (a rainy street at night): he walks alone, her memory beside him. The voice: "she's happier without you."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = seg(t, a, b);
  setCam(g, { x: lerp(900, 980, u), y: 560, z: lerp(1.1, 1.16, u) });
  cRain(g, t);
  const hx = lerp(500, 1300, go);
  memoryHer(g, hx + 140, CR2_F, 1.0, 0.7 * (1 - seg(t, 62.4, 63.4)), { view: 'side', dir: 1, face: { look: [0.8, 0] } });
  walker(g, hx, CR2_F, 1.05, 1, t * 4.5, { headOff: [0, 8], face: { sad: 1 } }, 0.7); floorShadow(g, hx, CR2_F + 2, 90);
  noCam(g); glow(g, W / 2, 200, 420, '255,58,44', 0.12 * Math.min(seg(t, 62.6, 63.0), 1 - seg(t, 65.2, 65.7)));
  demonText(g, "she's happier without you.", CAM.x, CAM.y + (H * 0.2 - H / 2) / CAM.z, t, Math.min(seg(t, 62.7, 63.1), 1 - seg(t, 65.2, 65.7)), 80);
  daysHud(g, 52);
  caption(g, 'And a quiet voice kept telling him the *worst*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s5.fin = 0.4;
// THE LOW POINT (his room): dust on the gym bag, the guitar untouched, 47 unread messages. It wasn't her keeping him here.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), see = es(t, 68.6, 69.4);
  setCam(g, { x: lerp(1150, 1170, u), y: 520, z: lerp(1.08, 1.12, u) });
  cRoom(g, t, { mode: 'night', dust: 1, lamp: 0.4 });
  const r = Hero(g, { x: 1160, y: CF, hip: true, thigh: 20, s: 1.0, ...pose('hold', 1160, CF, 1.0, { hip: true }), headOff: [0, 12 - see * 6], face: { look: see > 0.5 ? [0.6, 0.3] : [0, 0.9], sad: 1, wide: see > 0.5 ? 1.25 : 1, blink: blink(t, 0.4) } }, { dir: 1 });
  box(g, 1080, 720, 160, 12, '#0a0a0e', 4); g.fillStyle = '#ff5a5a'; g.beginPath(); g.arc(1230, 712, 16, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 16px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('47', 1230, 713);
  if (see > 0) { g.save(); g.globalAlpha = see; for (const [x, y, txt, rad] of [[1560, 700, 'gym', 95], [1870, 610, 'music', 120], [1230, 712, 'friends', 46]]) { g.strokeStyle = ROSE; g.lineWidth = 4; g.beginPath(); g.arc(x, y, rad, 0, 7); g.stroke(); g.fillStyle = ROSE; g.font = '700 34px "Patrick Hand"'; g.fillText(txt, x, y - rad - 24); } g.restore(); }
  daysHud(g, 60);
  caption(g, "It wasn't her keeping him here. It was *him*.", capA(t, 68.8, b - 0.1), ACC);
}
s6.fin = 0.4;
defineClip(36, T, [s1, s2, s3, s4, s5, s6]);
})();
