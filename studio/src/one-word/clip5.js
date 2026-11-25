// CLIP 5 (2:08-2:40) - the same places, reversed - and the word comes back one last time.
(() => {
const T = [128, 133, 138, 143, 148.5, 153.5, 160];
sfx(128, 'class-amb'); sfx(129.2, 'celesta-sparkle', 0.6); sfx(133.6, 'pen-write', 0.8); sfx(138, 'locker-amb'); sfx(138.6, 'demon-8bit-3', 0.5); sfx(139.1, 'whisper-useless', 0.5); sfx(141.2, 'run-steps', 0.5);
sfx(143, 'crowd'); sfx(145.5, 'whistle'); sfx(148.5, 'heartbeat'); sfx(150, 'whisper-useless', 0.9); sfx(151.5, 'ball-catch', 0.8); sfx(153.6, 'heartbeat'); sfx(155.2, 'kick'); sfx(156.2, 'ball-catch'); sfx(156.25, 'shatter'); sfx(156.25, 'timpani-boom'); sfx(156.3, 'cymbal-crash'); sfx(157, 'light-return');

function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(600, 580, u), z: lerp(1.16, 1.06, u) });
  classroom(g, t, (x, y, s) => { const up = kf(t, [[128.6, 0.15], [129.4, 2.7]]); actor(g, { x, y, hip: true, thigh: 20, s, armR: [up, 0.25 + Math.sin(t * 5) * 0.06], face: { look: [0, -0.3], smile: 0.6 } }, { dir: 0, amt: 0.15, dim: 0.02 }); });
  counters(g, 516);
  caption(g, 'His hand went *up*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
function s2(g, t, a, b) {
  const w = es(t, 133.6, 135.4), away = es(t, 135.8, 137);
  sheet(g, t, a, b, { sign: w, hx: lerp(1500, 760, es(t, 133, 133.6)) + w * 150 + away * 700 + (w > 0 && w < 1 ? Math.sin(t * 38) * 6 : 0), hy: lerp(900, 696, es(t, 133, 133.6)) + away * 400 });
  counters(g, 516);
  caption(g, 'He signed *up*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// THE REPEATED SHOT, reversed: this time he gets up off the bench.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = t > 140.6;
  setCam(g, { x: 960, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  lockers(g, t, { warm: true });
  const d = demon(g, { x: 1330, y: 842, s: 0.9, face: { look: [-0.7, 0.2], sad: 0.4, smile: -0.4 } }, { t, crack: 0.6 }); demonText(g, 'useless...?', d.head[0] + 150, d.head[1] - 70, t, Math.min(seg(t, 139.1, 139.4), 1 - seg(t, 141.6, 142)) * 0.8, 52);
  bench(g);
  const hx = lerp(900, 420, es(t, 141.2, 143.4));
  floorShadow(g, hx, 842, 90);
  let r;
  if (!up) r = actor(g, { x: 900, y: 744, hip: true, thigh: 34, s: HS, armL: [0.4, 1.3], armR: [0.4, 1.3], face: { look: [0, 0.3], smile: 0.3 } }, { dir: 0, amt: 0.15, dim: 0.02 });
  else if (t < 141.2) r = actor(g, { x: 900, y: 842, s: HS, face: { smile: 0.5 } }, { dir: 0, amt: 0.15, dim: 0.02 });
  else r = walker(g, hx, 842, HS, -1, hx / 30, { armLines: true, face: { smile: 0.5 } });
  gloves(g, r, HS);
  counters(g, 516);
  caption(g, 'The voice got *quieter*.', capA(t, a + 0.9, b - 0.1), ACC);
}
// WIDE (the cup final): he walks back to the same goal.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1100, u), y: lerp(570, 560, u), z: lerp(1, 1.1, u) });
  pitch(g, t, { cheer: 0.6 });
  for (const [x, o] of [[980, { col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }], [1150, { ...LEO }]]) person(g, { x, y: 812, s: 0.95, view: 'side', dir: 1, ...o, armR: [2.6, 0.3 + Math.sin(t * 6 + x) * 0.1], face: { smile: 0.7 }, armLines: false });
  person(g, { x: 700, y: 822, s: 1.0, view: 'side', dir: 1, col: '#7f7a88', acc: 'glasses', face: { smile: 0.3 }, armLines: false }); ball(g, 760, 800, 22);
  const hx = lerp(1250, 1470, es(t, 143, 146));
  floorShadow(g, hx, 804, 90);
  const r = t < 146 ? walker(g, hx, 800, HS, 1, hx / 30, { armLines: true }) : actor(g, { x: 1470, y: 800, s: HS, view: 'side', dir: -1, armL: [0.9, 0.5], armR: [0.8, 0.5], lean: -0.06, face: { sad: -0.3, smile: 0.1 } }, { dir: -1, amt: 0.25, dim: 0.03 });
  gloves(g, r, HS); goal(g);
  caption(g, 'The cup final. The same *goal*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (the relapse that doesn't land): the word flies at him again - and falls off.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), fly = seg(t, 150.4, 151.5), off = seg(t, 151.5, 152.8);
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 960, 100, 900, COLD, 0.2);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  const d = demon(g, { x: 1520, y: 1500, s: 2.9, lean: -0.1, face: { look: [-0.8, 0.3], smile: off > 0 ? -0.5 : 0.8, sad: off > 0 ? 0.6 : -0.9 } }, { t, a: 0.9, glow: 28, crack: 0.5 });
  demonText(g, 'useless.', 1490, 300, t, Math.min(seg(t, 150, 150.3), 1 - seg(t, 152.4, 152.8)), 90);
  const r = actor(g, { x: 860, y: 1300, s: 2.4, armL: [0.5, 1.5], armR: [0.5, 1.5], face: { look: [0, -0.1], sad: -0.5, smile: lerp(0, 0.4, off), blink: (t > 149.6 && t < 149.75) ? 1 : 0 } }, { dir: -1, amt: 0.3, dim: 0.06 });
  gloves(g, r, 2.4);
  const cx = r.neck[0], cy = r.neck[1] + 170;
  if (fly > 0 && off <= 0) word(g, lerp(1400, cx, ease(fly)), lerp(360, cy, ease(fly)), 90, -0.1, 1);
  if (off > 0 && off < 1) word(g, cx - off * 160, cy + off * off * 600, 90 * (1 - off * 0.3), -0.12 - off * 2.4, 1 - off);
  counters(g, 516);
  caption(g, "The word came back. It didn't *stick*.", capA(t, a + 0.6, b - 0.1), ACC);
}
// IMAGERY (the turning point): the voice shoots the word at him. He catches it.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), kT = 155.2, cT = 156.2, after = Math.max(0, t - cT), gone = es(t, cT + 0.1, cT + 1.5);
  noCam(g); g.fillStyle = '#050508'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960 + (after > 0 && after < 0.4 ? Math.sin(after * 80) * 12 * (1 - after / 0.4) : 0), y: 540, z: lerp(1, 1.06, u) });
  pool(g, 960, 900, 900, WARM, 0.1 + 0.25 * es(t, cT, cT + 2));
  const kick = kf(t, [[kT - 0.4, 0], [kT, 1], [kT + 0.5, 0]]);
  if (gone < 1) demon(g, { x: 420 - gone * 60, y: 900, s: 1.9 * (1 - gone * 0.3), view: 'side', dir: 1, legR: [1.1 * kick, -0.2], armL: [-0.6 * kick + gone * 1.4, 0.3], face: { sad: gone > 0 ? 1 : -0.9, smile: gone > 0 ? -0.8 : 0.6 } }, { t, crack: 0.5 + gone, a: 1 - gone });
  const fl = seg(t, kT, cT); let bx = 560, by = 860;
  if (t >= kT) { bx = lerp(560, 1290, Math.min(1, fl)); by = lerp(860, 560, Math.min(1, fl)) - Math.sin(Math.PI * Math.min(1, fl)) * 80; }
  const dive = kf(t, [[kT + 0.5, 0], [cT, 1], [cT + 0.9, 0.2]]);
  floorShadow(g, 1420, 902, 90);
  const hero = actor(g, { x: 1420 - dive * 60, y: 900 - dive * 90, s: HS, view: 'side', dir: -1, lean: -0.35 * dive, handL: t >= cT ? [bx + 6, by + 14] : null, handR: t >= cT ? [bx - 4, by - 10] : null, armL: [2.2 * dive + 0.2, 0.2], armR: [2.0 * dive + 0.2, 0.2], face: { sad: -0.4 * (1 - gone), smile: lerp(0, 0.8, es(t, cT + 0.4, cT + 1.6)) } }, { dir: -1, amt: 0.25, dim: 0.03 });
  if (t >= cT) { bx = hero.handL[0] - 6; by = hero.handL[1] - 10; }
  ball(g, bx, by, 26); gloves(g, hero, HS);
  // the word rides on the ball, then breaks apart
  if (t < cT) word(g, bx, by - 50, 64, Math.sin(t * 8) * 0.2, t >= kT - 1 ? 1 : seg(t, 153.8, 154.4), RED);
  else { const q = rng(9); g.save(); g.font = '64px "Caveat Brush"'; g.fillStyle = RED; g.textAlign = 'center'; [...'useless'].forEach((c, i) => { const vx = (q() - 0.5) * 900, vy = -200 - q() * 500; g.save(); g.globalAlpha = 1 - seg(after, 0.6, 1.3); g.translate(1290 + (i - 3) * 26 + vx * after, 500 + vy * after + 900 * after * after); g.rotate((q() - 0.5) * 9 * after); g.fillText(c, 0, 0); g.restore(); }); g.restore(); }
  if (after > 0 && after < 0.25) { noCam(g); g.fillStyle = `rgba(255,235,200,${0.7 * (1 - after / 0.25)})`; g.fillRect(0, 0, W, H); setCam(g, CAM); }
  caption(g, 'This time, he *caught* it.', capA(t, cT + 0.7, b - 0.1), ACC);
}
s6.fin = 0.3; s6.fout = 0.4;
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
