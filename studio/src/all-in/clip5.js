// CLIP 5 (2:08-2:40) - the fight: the truth on the steps, Dad, extra shifts, one slip, the ball, the court.
(() => {
const T = [128, 133.5, 139, 144.5, 150, 155.5, 160];
sfx(128.0, 'street-amb'); sfx(129.2, 'pop-8bit-1'); sfx(131.4, 'pop-8bit-2');
sfx(133.5, 'night-amb'); sfx(133.7, 'phone-ring', 0.5); sfx(134.6, 'pop-8bit-3'); sfx(136.8, 'sniffle', 0.5);
sfx(139.0, 'wh-amb'); sfx(139.6, 'box-thud'); sfx(141.2, 'box-thud', 0.8); sfx(142.8, 'box-thud', 0.9); [140.5, 141.5, 142.5, 143.5].forEach(x => sfx(x, 'count-tick', 0.5));
sfx(144.5, 'night-amb'); sfx(145.0, 'phone-tap-soft', 0.7); sfx(145.2, 'demon-8bit-3'); sfx(145.5, 'whisper-onegame'); sfx(146.9, 'lose-tone', 0.6); sfx(148.2, 'delete-poof', 0.8);
sfx(150.0, 'apt-amb'); sfx(151.2, 'blow-dust'); sfx(152.2, 'ball-bounce', 0.8); sfx(153.0, 'ball-bounce', 0.7); sfx(153.8, 'ball-bounce', 0.7);
sfx(155.5, 'street-amb'); [155.8, 156.3, 156.8, 157.3, 158.4, 158.9].forEach((x, i) => sfx(x, 'ball-bounce', 0.6 + (i % 2) * 0.1)); sfx(159.3, 'net-swish');

// WIDE (one-off place): the steps outside. The truth, both ways.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 960, u), y: lerp(600, 610, u), z: lerp(1.15, 1.22, u) });
  steps2(g, t);
  box(g, 560, 704, 800, 40, '#1e1c25');
  const mx = Hero(g, { x: 1110, y: 704, hip: true, s: 1.05, view: 'side', dir: -1, legL: [1.45, -1.45], legR: [1.35, -1.35], ...MARCUS, headOff: [0, 8], face: { look: [-0.4, 0.6], sad: 0.9, smile: -0.2, blink: blink(t, 0.7) } }, { dir: -1 });
  const hr = Hero(g, { x: 810, y: 704, hip: true, s: 1.05, view: 'side', dir: 1, legL: [1.45, -1.45], legR: [1.35, -1.35], headOff: [0, 6], face: { look: [0.6, 0.3], sad: 0.7, smile: -0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  headText(g, 'i lost 14 grand.', mx.head[0] + 40, mx.head[1] - 115, t, 129.2, 131.3);
  headText(g, 'me too. 8.', hr.head[0] - 40, hr.head[1] - 115, t, 131.4, 133.3);
  counter(g, t);
  caption(g, 'Marcus had been losing *too*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// SPLIT SCREEN (the second call): this time he tells Dad. Dad doesn't yell.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  g.save(); noCam(g); g.beginPath(); g.rect(0, 0, 956, H); g.clip();
  setCam(g, { x: lerp(1515, 1525, u), y: 520, z: 1.5 });
  kitchen(g, t, { night: true, lamp: 0.8 });
  const dd = Hero(g, { x: 1200, y: K_F, s: 1.05, ...DAD, handR: [1270, 500], bendR: -1, face: { look: [0.3, 0.2], sad: 0.5, smile: t > 134.4 ? 0.3 : 0, blink: blink(t, 1.2) } }, { dir: 1 }); floorShadow(g, 1200, K_F + 2, 90);
  phoneAt(g, 1258, 486, 1.05, 0.2, 0.2);
  headText(g, 'come home this weekend.', dd.head[0], dd.head[1] - 120, t, 134.6, 137.4);
  g.restore();
  g.save(); noCam(g); g.beginPath(); g.rect(964, 0, 956, H); g.clip();
  setCam(g, { x: lerp(210, 200, u), y: 500, z: 1.5 });
  const r = onBed(g, t, { hero: { handR: [SIT[0] + 66, SIT[1] - 168], bendR: 1, face: { look: [-0.3, 0.6], sad: 0.8, smile: t > 136.4 ? 0.2 : -0.2, blink: blink(t, 0.6) } } });
  phoneAt(g, SIT[0] + 58, SIT[1] - 178, SS, 0.2, -0.2);
  if (t > 136.6) { g.fillStyle = 'rgba(230,240,255,0.9)'; g.beginPath(); g.ellipse(r.head[0] - 18, r.head[1] + 12 + es(t, 136.6, 138) * 22, 3.5, 5, 0, 0, 7); g.fill(); }
  g.restore();
  noCam(g); g.fillStyle = '#000'; g.fillRect(956, 0, 8, H);
  counter(g, t);
  caption(g, "His dad didn't yell. He said: come *home*.", capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.3;
// MEDIUM (the work): extra shifts, box after box. The number starts to fall.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), ph_ = ((t - 139) % 1.6) / 1.6, up = ph_ < 0.5 ? ph_ * 2 : 2 - ph_ * 2;
  setCam(g, { x: lerp(1060, 1080, u), y: 520, z: lerp(1.35, 1.45, u) });
  warehouse(g, t);
  const hr = Hero(g, { x: 1040, y: WH_F, s: 1.1, armLines: false, handL: [1000, lerp(700, 560, up)], handR: [1090, lerp(700, 560, up)], face: { look: [0.2, -0.2 * up], smile: 0.2, blink: blink(t, 0.4) } }, { dir: 1 });
  box(g, 990, lerp(650, 510, up) - 20, 110, 80, '#5a4a36', 3);
  for (let i = 0; i < 4; i++) box(g, 1180, WH_F - 80 - i * 80, 110, 80, '#5a4a36', 3);
  floorShadow(g, 1040, WH_F + 2, 90);
  counter(g, t);
  caption(g, 'Extra shifts. Every *paycheck* went to the debt.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.3;
// REPEATED SHOT (the relapse): the bed, the glow comes back... and he deletes it again
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), on = es(t, 145.0, 145.4) * (1 - es(t, 148.2, 148.6));
  setCam(g, { x: lerp(880, 860, u), y: 545, z: lerp(1, 1.06, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true });
  const dA = es(t, 145.2, 145.8) * (1 - es(t, 148.0, 148.8));
  if (dA > 0) demonAt(g, t, 760, 742, 0.8, 'just one game?', Math.min(seg(t, 145.5, 145.8), 1 - seg(t, 147.8, 148.2)), { a: dA, tx: 60, ty: 150, face: { look: [-0.8, 0.4], smile: 0.6 } });
  if (on > 0) bedGlow(g, t, 0.5 * on); eyes(g, 0.4);
  counter(g, t);
  caption(g, 'One night, he *slipped*.', capA(t, a + 0.5, 148.0), ACC);
  caption(g, 'And deleted it *again*.', capA(t, 148.3, b - 0.1), ACC);
}
s4.fin = 0.4;
// MEDIUM (the object, missed): he picks the dusty ball up, blows off the dust
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), pick = es(t, 150.6, 151.1), dust = 1 - es(t, 151.2, 151.8);
  setCam(g, { x: lerp(1660, 1650, u), y: 620, z: lerp(1.5, 1.6, u) });
  apartment(g, t, { dust: 2 });
  g.fillStyle = '#0b0b10'; g.fillRect(1700, AP_F - 60, 120, 60);
  const bx = lerp(1770, 1700, pick), by = lerp(AP_F - 26, 610, pick);
  const hr = Hero(g, { x: 1620, y: AP_F, s: 1.1, lean: 0.15 * (1 - pick), handR: [bx + 20, by + 10], handL: pick > 0.8 ? [bx - 26, by + 10] : null, face: { look: [0.5, lerp(0.8, 0.2, pick)], smile: 0.3 + pick * 0.3, blink: blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, 1620, AP_F + 2, 90);
  hoodBall(g, bx, by, 1, dust);
  if (t > 151.2 && t < 152) { for (let i = 0; i < 10; i++) { const k = seg(t, 151.2, 152); g.fillStyle = `rgba(170,170,180,${0.5 * (1 - k)})`; g.beginPath(); g.arc(bx + 20 + k * 80 + i * 6, by - 20 - i * 4 * k, 4 + k * 6, 0, 7); g.fill(); } }
  if (t > 152.0) hoodBall(g, bx, by, 1, 0);
  counter(g, t);
  caption(g, 'Then he picked up the *ball*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.3;
// WIDE (core place 4): the court at night. Him and Marcus, one on one. The voice fades at the fence.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1000, u), y: lerp(545, 555, u), z: lerp(1, 1.08, u) });
  outCourt(g, t);
  demonAt(g, t, 240, 760, 0.55, null, 0, { a: 0.6 * (1 - es(t, 156, 159.5)), crack: es(t, 155.6, 158.5), face: { look: [0.8, 0], sad: 0.6, smile: -0.4 } });
  const shoot = t > 158.6, dr = Math.abs(Math.sin(t * 6));
  const hx = 1000 + Math.sin(t * 1.1) * 60;
  const hr = Hero(g, { x: hx, y: OC_F, s: 1.05, handR: shoot ? [hx + 30, 560] : [hx + 46, OC_F - 150], handL: shoot ? [hx - 10, 560] : null, face: { look: [0.6, shoot ? -0.6 : 0.2], smile: 0.6 } }, { dir: 1 }); floorShadow(g, hx, OC_F + 2, 90);
  const mx = Hero(g, { x: hx + 170, y: OC_F, s: 1.05, ...MARCUS, handL: [hx + 84, 690], handR: [hx + 256, 690], face: { look: [-0.6, 0.2], smile: 0.6 } }, { dir: -1 }); floorShadow(g, hx + 170, OC_F + 2, 90);
  if (!shoot) hoodBall(g, hx + 50, OC_F - 30 - dr * 110, 0.85); else { const k = seg(t, 158.6, 159.4); hoodBall(g, lerp(hx + 10, 1560, k), lerp(530, 330, k) - Math.sin(k * Math.PI) * 200, 0.85); }
  counter(g, t);
  caption(g, 'Week by week, the number *fell*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.5;
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
