// CLIP 4 (1:36-2:08) - the turn back: the same places, reversed. Alarm -> up. Gym. Application -> sent. Jay -> picked up.
(() => {
const T = [96, 102, 107, 110, 116, 119, 125, 128];
sfx(96.0, 'alarm-ring'); sfx(96.6, 'demon-8bit-3', 0.6); sfx(96.9, 'whisper-fivemore', 0.6); sfx(97.6, 'cloth-rustle'); sfx(98.4, 'steps', 0.6); sfx(100.2, 'snooze-click');
sfx(102.0, 'gym-amb'); [102.8, 104.2, 105.6].forEach(x => sfx(x, 'weight-clank', 0.7));
sfx(107.0, 'bar-hum'); sfx(107.4, 'bar-slide-up'); sfx(108.6, 'bar-ding');
sfx(110.0, 'room-quiet'); sfx(110.8, 'keys-type', 0.6); sfx(112.6, 'tap'); sfx(112.8, 'submit-chime');
sfx(116.0, 'bar-hum'); sfx(116.4, 'bar-slide-up'); sfx(117.6, 'bar-ding');
sfx(119.0, 'street-amb'); sfx(119.4, 'phone-buzz'); sfx(120.4, 'tap'); sfx(121.0, 'pop-8bit-2');
sfx(125.0, 'bar-hum'); sfx(125.4, 'bar-slide-up'); sfx(126.6, 'bar-ding');

// WIDE (the mirror of the first shot): 6:00 - the alarm is across the room. He gets up.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = t > 97.6, walk = seg(t, 98.4, 100.0), off = t > 100.2;
  setCam(g, { x: lerp(800, 840, u), y: 530, z: lerp(1.05, 1.12, u) });
  heroRoom(g, t, { lying: !up, eyesOpen: t > 96.6, dawn: true });
  alarmClock(g, 1370, 572, 0.7, t, off ? 0 : 1, '6:00');
  if (!up) demonAt(g, t, 560, 742, 0.6, '5 more minutes...', Math.min(seg(t, 96.9, 97.2), 1 - seg(t, 97.3, 97.6)), { a: 1, tx: 60, ty: 140, face: { look: [-0.8, 0.4] } });
  if (up) {
    const x = lerp(420, 1290, walk);
    const r = walk > 0 && walk < 1 ? walker(g, x, 742, 0.95, 1, t * 6.5, {}) : Hero(g, { x, y: 742, s: 0.95, handR: off ? null : (walk >= 1 ? [1350, 580] : null), face: { look: walk >= 1 ? [0.7, 0.3] : [0.6, 0], smile: off ? 0.4 : 0, blink: blink(t, 0.4) } }, { dir: 1 });
    floorShadow(g, x, 744, 90); pbar(g, r.head[0], r.head[1] - 110, 0.85, 0);
  } else pbar(g, 262, 500, 0.85, 0);
  caption(g, '6:00. This time, he got *up*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// WIDE (the place he never went): the gym at sunrise
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), rep = Math.abs(Math.sin((t - a) * 2.2));
  setCam(g, { x: lerp(940, 960, u), y: lerp(560, 565, u), z: lerp(1.05, 1.12, u) });
  gym(g, t, { dawn: true, clock: '6:12 AM' });
  const others = [[480, '#9a8d7e', 'cap'], [1460, '#A9A9B4', 'glasses']];
  for (const [x, c, ac] of others) { const pr = pose('cheer', x, GY_F, 1.0); const k = Math.abs(Math.sin((t - a) * 2 + x)); P(g, { x, y: GY_F, s: 1.0, col: c, acc: ac, accCol: '#3b4a63', handL: [pr.handL[0], lerp(pr.handL[1] + 120, pr.handL[1], k)], handR: [pr.handR[0], lerp(pr.handR[1] + 120, pr.handR[1], k)] }); floorShadow(g, x, GY_F + 2, 80); }
  const pr = pose('cheer', 960, GY_F, 1.1), hl = [pr.handL[0] - 14, lerp(pr.handL[1] + 90, pr.handL[1], rep)], hrr = [pr.handR[0] + 14, lerp(pr.handR[1] + 90, pr.handR[1], rep)];
  const hr = Hero(g, { x: 960, y: GY_F, s: 1.1, handL: hl, handR: hrr, face: { look: [0, -0.2], sad: -0.3, smile: 0.3, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 960, GY_F + 2, 90);
  dumbbell(g, hl[0], hl[1], 1.1); dumbbell(g, hrr[0], hrr[1], 1.1);
  pbar(g, hr.head[0], hr.head[1] - 120 - 60 * rep, 0.9, 0);
  caption(g, 'He *went*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.3;
function s3(g, t, a, b) { barInsert(g, t, a, b, { v0: 0, v1: 20, t0: 107.4, t1: 108.6, hand: 'his' }); }
// POV (excuse 2, reversed): SUBMIT
function s4(g, t, a, b) {
  appScreen(g, t, a, b, { clock: '9:14 PM', press: 112.6, sent: 112.8, cursor: t => [lerp(1400, 610, es(t, 110.6, 112.3)), lerp(760, 563, es(t, 110.6, 112.3))] });
  caption(g, 'He sent it *that night*.', capA(t, 113.0, b - 0.1), ACC);
}
s4.fin = 0.3;
function s5(g, t, a, b) { barInsert(g, t, a, b, { v0: 20, v1: 40, t0: 116.4, t1: 117.6, hand: 'his' }); }
// MEDIUM (excuse 3, reversed): Jay calls - he picks up, and smiles
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), pick = t > 120.4;
  setCam(g, { x: lerp(920, 930, u), y: 560, z: lerp(1.5, 1.6, u) });
  busStop(g, t);
  const ps = pick ? pose('ear', 900, 712, 1.05, { hip: true }) : pose('phone', 900, 712, 1.05, { hip: true });
  const hr = Hero(g, { x: 900, y: 712, hip: true, thigh: 20, s: 1.05, ...ps, face: { look: pick ? [0.3, 0] : [0.2, 0.8], smile: pick ? 0.8 : 0.2, blink: blink(t, 0.5) } }, { dir: 1 });
  phoneAt(g, ps.handR[0], ps.handR[1] - 10, 1.05, pick ? 0.2 : 1, pick ? 0.3 : (Math.sin(t * 50) * 0.05));
  if (!pick) { g.fillStyle = '#fff'; g.font = '700 18px Nunito'; g.textAlign = 'center'; g.fillText('Jay', ps.handR[0], ps.handR[1] - 46); }
  busBench(g);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 40);
  headText(g, "hey! what's up?", hr.head[0] - 220, hr.head[1] - 40, t, 121.0, 123.6);
  caption(g, 'He picked *up*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.4;
function s7(g, t, a, b) { barInsert(g, t, a, b, { v0: 40, v1: 60, t0: 125.4, t1: 126.6, hand: 'his' }); }
defineClip(96, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
