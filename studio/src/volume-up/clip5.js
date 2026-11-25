// CLIP 5 (2:08-2:40) - the fight: the question, lessons, one relapse, the bench, the voice breaks.
(() => {
const T = [128, 133.5, 139, 144.5, 150, 155.5, 160];
sfx(128.0, 'living-amb'); sfx(128.3, 'steps', 0.6); sfx(130.0, 'paper-crinkle', 0.5);
sfx(133.5, 'living-amb'); sfx(135.4, 'celesta-sparkle', 0.7); sfx(136.6, 'pop-8bit-1');
sfx(139.0, 'living-amb'); sfx(139.6, 'harm-squeak'); sfx(141.6, 'pop-8bit-2'); sfx(142.6, 'cloth-rustle', 0.5);
sfx(144.5, 'dinner-amb'); sfx(145.2, 'demon-8bit-1'); sfx(145.6, 'whisper-onesong'); sfx(145.3, 'vol-tick', 0.6); sfx(147.6, 'phones-off', 0.8);
sfx(150.0, 'night-amb'); sfx(150.3, 'harm-tune-2'); sfx(153.4, 'clap-soft', 0.7);
sfx(155.5, 'night-amb'); sfx(156.0, 'cloth-rustle', 0.6); sfx(157.0, 'whisper-weaker', 0.7); sfx(158.6, 'shatter'); sfx(158.6, 'low-thud', 0.8);

// WIDE (the question): he holds the notepad up beside Grandpa's chair
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), wx = Math.min(1180, 400 + (t - a) * 520), walking = wx < 1180, lift = es(t, 130.0, 130.6);
  setCam(g, { x: lerp(1000, 1030, u), y: lerp(545, 555, u), z: lerp(1, 1.08, u) });
  livingRoom(g, t, { lamp: 0.85 });
  const gp = Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: 1.15, armLines: false, handL: [ARM[0] - 40, ARM[1] - 26], handR: [ARM[0] + 44, ARM[1] - 30], face: { look: walking ? [0, 0.5] : [-0.6, 0.2], sad: walking ? 0.6 : 0.2, smile: -0.1, blink: blink(t, 1.2) } }, { dir: 1 });
  lrFront(g);
  if (walking) { const r = walker(g, wx, LR_F, 1.15, 1, t * 6.5, {}); phones(g, r, 1.15, { neck: true }); }
  else { const r = Hero(g, { x: 1180, y: LR_F, s: 1.15, armLines: false, handL: [1220, LR_F - 260 - lift * 70], handR: [1300, LR_F - 264 - lift * 70], face: { look: [0.7, 0.1], smile: 0.2, blink: blink(t, 0.5) } }, { dir: 1 }); phones(g, r, 1.15, { neck: true }); notepad(g, 1262, LR_F - 296 - lift * 70, 0.42, 'teach me?', 1, -0.15 + lift * 0.1); }
  floorShadow(g, wx, LR_F + 2, 100);
  caption(g, 'He asked, the only way Grandpa could *hear*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// CLOSE (emotion): Grandpa reads it. A tear, then a smile.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), sm = es(t, 135.2, 136.4);
  setCam(g, { x: 1440, y: lerp(470, 465, u), z: lerp(2.1, 2.2, u) });
  livingRoom(g, t, { lamp: 0.9 });
  const gp = Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: 1.15, armLines: false, handL: [ARM[0] - 40, ARM[1] - 26], handR: [ARM[0] + 44, ARM[1] - 30], headTilt: -0.05 * sm, face: { look: [-0.6, lerp(0.5, 0.1, sm)], sad: lerp(0.5, 0.1, sm), smile: lerp(-0.1, 0.8, sm), wide: 1 + 0.2 * sm, blink: blink(t, 0.4, 3.1) } }, { dir: 1 });
  const ty = gp.head[1] + 8 + es(t, 134.6, 136.4) * 40;
  if (t > 134.4) { g.fillStyle = 'rgba(230,240,255,0.9)'; g.beginPath(); g.ellipse(gp.head[0] - 30, ty, 4, 6, 0, 0, 7); g.fill(); }
  lrFront(g);
  notepad(g, 1262, LR_F - 366, 0.42, 'teach me?', 1, -0.05);
  for (const dark of [true, false]) { g.fillStyle = dark ? C.line : C.cream; g.beginPath(); g.ellipse(1200, LR_F - 352, 16 + (dark ? 3 : 0), 17 + (dark ? 3 : 0), 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(1326, LR_F - 360, 16 + (dark ? 3 : 0), 17 + (dark ? 3 : 0), 0, 0, 7); g.fill(); }
  headText(g, 'every night.', gp.head[0] + 140, gp.head[1] - 40, t, 136.6, 138.8);
  caption(g, 'Grandpa *smiled* again.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM two-shot (the lessons): side by side on the sofa, a squeaky first try
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), laugh = es(t, 142.4, 142.8) * (1 - es(t, 143.8, 144.3));
  setCam(g, { x: lerp(690, 700, u), y: 545, z: lerp(1.45, 1.55, u) });
  livingRoom(g, t, { lamp: 0.9 });
  const pl = playPose(560, SOFA[1], 1.15, { hip: true });
  const hr = Hero(g, { x: 560, y: SOFA[1], hip: true, thigh: 20, s: 1.15, armLines: false, ...pl, face: { look: [0.3, 0], sad: t < 141 ? 0.4 : 0, smile: 0.3 + laugh * 0.5, blink: t > 142.4 && t < 143.8 ? 1 : blink(t, 0.3) } }, { dir: 1 });
  phones(g, hr, 1.15, { neck: true });
  harmonica(g, pl._h[0], pl._h[1], 1.15); notes(g, pl._h[0] + 30, pl._h[1] - 40, t, t < 141.4 ? 0.6 : 0.9, 0.9);
  const gp = Gpa(g, { x: 840, y: SOFA[1] + Math.sin(t * 16) * 3 * laugh, hip: true, thigh: 20, s: 1.15, armLines: false, handL: [700, SOFA[1] - 150], bendL: -1, handR: [880, SOFA[1] - 30], headTilt: laugh * 0.08, face: { look: [-0.6, 0.1], smile: 0.6 + laugh * 0.4, blink: laugh > 0.5 ? 1 : blink(t, 1.1) } }, { dir: 1 });
  lrFront(g);
  headText(g, 'feel it. not hear it.', gp.head[0] + 40, gp.head[1] - 115, t, 141.6, 143.8);
  caption(g, 'Night after night, he *practiced*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REPEATED SHOT (the relapse): at dinner he reaches for the headphones... and stops
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 145.0, 145.6) * (1 - es(t, 147.4, 148.0)), dA = es(t, 145.2, 145.8) * (1 - es(t, 148.6, 149.4));
  setCam(g, { x: lerp(1080, 1090, u), y: 600, z: lerp(1.25, 1.32, u) });
  dinnerRoom(g, t);
  if (dA > 0) demonAt(g, t, 1430, 900, 0.85, 'just one song.', Math.min(seg(t, 145.6, 145.9), 1 - seg(t, 147.6, 148.0)), { a: dA, tx: 60, ty: 150, face: { look: [-0.6, 0.4] } });
  Mom(g, { x: DIN[0], y: 740, hip: true, thigh: 20, s: 1.1, armLines: false, handL: [DIN[0] - 40, 712], handR: [DIN[0] + 44, 712], face: { look: [0.8, 0], smile: 0.5, blink: blink(t, 2) } }, { dir: 1 });
  const gp = Gpa(g, { x: DIN[1], y: 740, hip: true, thigh: 20, s: 1.1, armLines: false, handL: [DIN[1] - 42, 712], handR: [DIN[1] + 46, 712], face: { look: [-0.5, 0.1], smile: 0.6, blink: blink(t, 0.7) } }, { dir: 1 });
  const hr = Hero(g, { x: DIN[2], y: 740, hip: true, thigh: 20, s: 1.1, armLines: false, handL: [DIN[2] - 66 + up * 4, 712 - up * 150], handR: [DIN[2] + 66 - up * 4, 712 - up * 150], face: { look: t > 147 ? [-0.8, 0.1] : [0, 0.6], sad: 0.3 * up, smile: t > 148.2 ? 0.4 : 0, blink: blink(t, 0.2) } }, { dir: -1 });
  if (up > 0.5) phones(g, { head: [hr.head[0], hr.head[1] - 40 * (1 - up) - 6] }, 1.1, { on: 0.3 * up });
  else phones(g, hr, 1.1, { neck: true });
  dinnerTable(g, t);
  volBar(g, hr.head[0] + 80, hr.head[1] - 100, 1.0, 3 * up);
  caption(g, 'Some nights were *harder*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (core place 4, changed): the bench. Now HE plays; people stop to listen.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1000, u), y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  park(g, t);
  const w1 = Math.max(1450, 1800 - (t - a) * 160), w2 = Math.min(640, 300 + (t - a) * 140);
  if (w1 > 1450) walker(g, w1, 812, 0.85, -1, t * 6, { col: '#9a8d7e', acc: 'cap', accCol: '#3b4a63' }); else P(g, { x: w1, y: 812, s: 0.85, col: '#9a8d7e', acc: 'cap', accCol: '#3b4a63', face: { look: [-0.7, 0.1], smile: 0.6 } });
  floorShadow(g, w1, 814, 70);
  if (w2 < 640) walker(g, w2, 812, 0.85, 1, t * 6, { col: '#b49b80', acc: 'longhair' }); else P(g, { x: w2, y: 812, s: 0.85, col: '#b49b80', acc: 'longhair', face: { look: [0.7, 0.1], smile: 0.6 } });
  floorShadow(g, w2, 814, 70);
  const pl = playPose(940, BENCH[1], 1.1, { hip: true });
  const hr = Hero(g, { x: 940, y: BENCH[1], hip: true, thigh: 20, s: 1.1, armLines: false, ...pl, face: { blink: 1, smile: 0.4 } }, { dir: -1 });
  phones(g, hr, 1.1, { neck: true });
  const clap = t > 153.2 ? Math.abs(Math.sin(t * 9)) : 0;
  Gpa(g, { x: 1170, y: BENCH[1], hip: true, thigh: 20, s: 1.1, armLines: false, handL: [1150 - clap * 20, BENCH[1] - 100], handR: [1190 + clap * 20, BENCH[1] - 100], face: { look: [-0.6, 0.1], smile: 0.9, blink: blink(t, 0.4) } }, { dir: -1 });
  benchFront(g);
  harmonica(g, pl._h[0], pl._h[1], 1.1); notes(g, pl._h[0], pl._h[1] - 40, t, 1, 1);
  caption(g, "He learned Grandpa's *song*.", capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.4;
// MEDIUM (the token + the voice breaks): headphones hung on the hook; the voice cracks and shatters
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 155.9, 156.8), br = seg(t, 158.6, 159.4), sh = shake(t, 158.6, 10);
  setCam(g, { x: lerp(1300, 1290, u) + sh, y: 520, z: lerp(1.45, 1.55, u) });
  heroRoom(g, t, { lamp: 1, harmDesk: true });
  ln(g, [1180, 380, 1180, 396], 6, '#6a6a78'); g.strokeStyle = LINE; g.lineWidth = 4; g.beginPath(); g.arc(1190, 398, 10, Math.PI, 0, true); g.stroke();
  if (br < 1) demonAt(g, t, 1520, 742, lerp(0.75, 0.55, es(t, 156, 158.6)), br > 0 ? null : 'weaker...', Math.min(seg(t, 157.0, 157.3), 1 - seg(t, 158.3, 158.6)), { a: 1 - br, crack: es(t, 156.4, 158.5), face: { look: [-0.8, 0.2], sad: 0.6, smile: -0.4 } });
  if (br > 0) { const q = rng(5); for (let i = 0; i < 26; i++) { const ang = q() * 6.28, d = br * (80 + q() * 260); g.fillStyle = i % 3 ? '#141217' : RED; g.globalAlpha = 1 - br; g.fillRect(1520 + Math.cos(ang) * d, 560 + Math.sin(ang) * d + br * br * 120, 8 + q() * 12, 8 + q() * 12); } g.globalAlpha = 1; }
  const hand = [lerp(1150, 1190, k), lerp(560, 410, k)];
  const r = Hero(g, { x: 1080, y: 742, s: 0.95, armLines: false, handR: t < 157.2 ? hand : null, face: { look: t > 158.4 ? [0.8, 0] : [0.5, -0.4], smile: t > 158.8 ? 0.5 : 0.15, blink: blink(t, 0.3) } }, { dir: 1 });
  floorShadow(g, 1080, 744, 90);
  if (k < 0.95) phones(g, { neck: [hand[0], hand[1] + 30] }, 0.95, { neck: true });
  else phones(g, { neck: [1190, 430] }, 0.95, { neck: true });
  flash(g, t, 158.6);
  caption(g, 'The voice got *quiet*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
