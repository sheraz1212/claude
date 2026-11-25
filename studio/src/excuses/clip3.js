// CLIP 3 (1:04-1:36) - 0%. The low point: the hand on the bar was his own. The cards. The tiny decision.
(() => {
const T = [64, 67, 73, 79, 83, 87.5, 96];
sfx(64.0, 'bar-hum'); sfx(64.3, 'bar-slide'); sfx(64.4, 'whisper-lasttime'); sfx(65.5, 'bar-thunk'); sfx(65.5, 'low-thud'); sfx(65.5, 'piano-low-hit');
sfx(67.0, 'night-amb'); sfx(67.4, 'demon-brass', 0.8); sfx(68.2, 'whisper-tomorrow2', 0.8); sfx(70.6, 'clock-tick', 0.7);
sfx(73.0, 'bar-hum'); sfx(74.4, 'heartbeat', 0.7); sfx(76.4, 'piano-tear-note');
sfx(79.3, 'pen-write'); sfx(83.3, 'pen-write');
sfx(87.5, 'night-amb'); sfx(89.0, 'cloth-rustle', 0.5); sfx(90.4, 'steps', 0.6); sfx(93.8, 'clock-set');

function s1(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 8, v1: 0, t0: 64.3, t1: 65.5, hand: 'demon' });
  demonText(g, 'one last time.', 960, 190, t, Math.min(seg(t, 64.4, 64.7), 1 - seg(t, 66.5, 66.9)), 78);
  flash(g, t, 65.5, '255,60,40');
}
// WIDE (low point): the edge of his bed, 0%. The voice is heavy behind him.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(820, 800, u), y: lerp(520, 510, u), z: lerp(1.0, 1.08, u) });
  const r = onBed(g, t, { demon: 1.35, dA: es(t, 67.4, 68.2), dtext: 'rest. tomorrow.', da: Math.min(seg(t, 68.2, 68.5), 1 - seg(t, 72.4, 72.9)), tx: 300, ty: -20, hero: { headOff: [0, 8], face: { look: [0, 0.9], sad: 0.9, smile: -0.25, blink: blink(t, 0.6) } } });
  alarmClock(g, 79, 618, 0.7, t, 0, '11:47');
  pbar(g, r.head[0], r.head[1] - 110, 0.85, 0);
  caption(g, 'He never moved *forward*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// INSERT (the realisation): the hand on the slider becomes his own
function s3(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 0, v1: 0, t0: 73.2, t1: 73.3, hand: 'demon', reveal: es(t, 74.4, 76.4) });
  caption(g, 'The hand on the bar was *his*.', capA(t, 76.4, b - 0.1), ACC);
}
const s4 = card2("'Tomorrow' x 365", '= *one year*.');
const s5 = card2('An excuse is a promise', 'to stay the *same*.');
// MEDIUM (the tiny decision): he carries the alarm clock across the room to the desk
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), walk = seg(t, 90.2, 93.4);
  setCam(g, { x: lerp(820, 860, u), y: 520, z: lerp(1.05, 1.12, u) });
  heroRoom(g, t, { lamp: walk >= 1 ? 1 : 0.4 });
  const x = lerp(200, 1290, walk), carrying = t > 89.2 && t < 93.8;
  if (!carrying && t < 89.2) alarmClock(g, 79, 618, 0.7, t, 0, '11:52');
  let r;
  if (walk > 0 && walk < 1) r = walker(g, x, 742, 0.95, 1, t * 6, {});
  else r = Hero(g, { x, y: 742, s: 0.95, ...(t < 90.2 ? { handL: [92, 640] } : { handR: [1340, 600] }), face: { look: t < 90.2 ? [-0.8, 0.3] : [0.7, 0.3], smile: t > 94 ? 0.3 : 0 } }, { dir: 1 });
  floorShadow(g, x, 744, 90);
  if (carrying) alarmClock(g, walk > 0 && walk < 1 ? x + 30 : (t < 90.2 ? 92 : 1340), walk > 0 && walk < 1 ? 600 : (t < 90.2 ? 628 : 590), 0.7, t, 0, '11:52');
  if (t >= 93.8) alarmClock(g, 1370, 572, 0.7, t, 0, '6:00');
  pbar(g, r.head[0], r.head[1] - 110, 0.85, 0);
  caption(g, 'So he moved the *alarm*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s6.fin = 0.5;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
