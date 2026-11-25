// CLIP 1 (0:00-0:32) - excuse 1 (the gym alarm) and excuse 2 (the job application). Each one -> the bar slips.
(() => {
const T = [0, 6, 11, 14, 20, 26, 29, 32];
sfx(0.0, 'alarm-ring'); sfx(0.2, 'pen-write', 0.6); sfx(4.2, 'snooze-click'); sfx(4.4, 'pop-8bit-1'); sfx(4.6, 'cloth-rustle', 0.6);
sfx(6.0, 'room-quiet'); sfx(7.0, 'breath-sleep', 0.6);
sfx(11.0, 'bar-hum'); sfx(11.3, 'demon-8bit-1'); sfx(11.6, 'bar-slide'); sfx(11.8, 'whisper-rest'); sfx(12.8, 'bar-thunk');
sfx(14.0, 'kitchen-night'); sfx(15.0, 'keys-type', 0.6);
sfx(20.0, 'room-quiet'); sfx(21.0, 'trackpad', 0.6); sfx(24.2, 'laptop-close'); sfx(24.6, 'pop-8bit-2');
sfx(26.0, 'bar-hum'); sfx(26.4, 'bar-slide'); sfx(26.5, 'whisper-tomorrow2'); sfx(27.6, 'bar-thunk');
sfx(29.0, 'street-amb');

// HOOK (second 0): 6:00, the GYM alarm. He hits snooze. "5 more minutes."
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), snooze = t > 4.2, reach = es(t, 3.5, 4.1) * (1 - es(t, 4.6, 5.3));
  setCam(g, { x: lerp(330, 345, u), y: lerp(560, 555, u), z: lerp(1.4, 1.5, u) });
  heroRoom(g, t, { lying: true, eyesOpen: t > 1.0 && t < 4.6 });
  alarmClock(g, 79, 618, 0.7, t, snooze ? 0 : 1, '6:00');
  if (reach > 0) { const hx = lerp(310, 92, reach), hy = lerp(650, 606, reach); g.lineCap = 'round'; for (const [w, c] of [[30, C.line], [24, C.cream]]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(320, 660); g.quadraticCurveTo((320 + hx) / 2, 600, hx, hy); g.stroke(); } g.fillStyle = C.line; g.beginPath(); g.arc(hx, hy, 17, 0, 7); g.fill(); g.fillStyle = C.cream; g.beginPath(); g.arc(hx, hy, 14, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.0)';
  box(g, 34, 548, 90, 20, '#24222c', 4); g.fillStyle = '#e9e2cf'; g.font = '700 16px Nunito'; g.textAlign = 'center'; g.fillText('GYM', 79, 560);
  pbar(g, 262, 500, 0.9, 40);
  headText(g, '5 more minutes.', 470, 590, t, 4.4, 5.9);
  hookLine(g, t, 'He always had a *reason*.', 0.2, 1.6, 1 - seg(t, 5.4, 5.9));
}
// CLOSE (back asleep): the clock says 6:09
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 220, y: lerp(590, 585, u), z: lerp(2.3, 2.4, u) });
  heroRoom(g, t, { lying: true });
  alarmClock(g, 79, 618, 0.7, t, 0, t < 8.5 ? '6:05' : '6:09');
  pbar(g, 262, 520, 0.8, 40);
  caption(g, 'He said he would go to the *gym*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// INSERT (the score): a hand drags his progress back
function s3(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 40, v1: 32, t0: 11.6, t1: 12.8, hand: 'demon' });
  demonText(g, 'you deserve rest.', 960, 190, t, Math.min(seg(t, 11.8, 12.1), 1 - seg(t, 13.6, 13.95)), 76);
}
// WIDE (excuse 2): late at the kitchen table, the laptop open
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 980, u), y: lerp(560, 570, u), z: lerp(1.1, 1.18, u) });
  kitchen(g, t, { night: true, lamp: 0.7 });
  const hr = Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.1, ...pose('table', KT[1], 744, 1.1, { hip: true, tableY: 722 }), face: { look: [0, 0.6], smile: 0, blink: blink(t, 0.4) } }, { dir: -1 });
  kitchenTable(g, t, { cup: false });
  laptop(g, KT[1], 722, 0.9, 1);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 32);
  caption(g, 'The job he wanted closed *tonight*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// POV (what he does): DEADLINE TODAY - he closes the laptop
function s5(g, t, a, b) {
  appScreen(g, t, a, b, { close: 24.2, clock: '10:52 PM', cursor: t => [lerp(1400, 640, es(t, 20.6, 22.0)), lerp(760, 600, es(t, 20.6, 22.0))] });
  caption(g, 'He said *tomorrow*.', capA(t, 23.4, b - 0.1), ACC);
}
function s6(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 32, v1: 24, t0: 26.4, t1: 27.6, hand: 'demon' });
  demonText(g, "it'll be there tomorrow.", 960, 190, t, Math.min(seg(t, 26.5, 26.8), 1 - seg(t, 28.6, 28.95)), 70);
}
// WIDE (the next place): the bus stop
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 960, u), y: lerp(560, 565, u), z: lerp(1.05, 1.1, u) });
  busStop(g, t);
  const wx = 1900 - (t - a) * 160; walker(g, wx, BS_F, 0.95, -1, t * 6, { col: '#9a8d7e', acc: 'glasses' }); floorShadow(g, wx, BS_F + 2, 80);
  const hr = Hero(g, { x: 900, y: 712, hip: true, thigh: 20, s: 1.05, ...pose('phone', 900, 712, 1.05, { hip: true }), face: { look: [0.2, 0.8], blink: blink(t, 0.5) } }, { dir: 1 });
  phoneAt(g, pose('phone', 900, 712, 1.05, { hip: true }).handR[0], pose('phone', 900, 712, 1.05, { hip: true }).handR[1] - 10, 1.05, 0.8);
  busBench(g);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 24);
  caption(g, 'His best friend, *Jay*, kept calling.', capA(t, a + 0.4, b + 2), ACC);
}
s7.fin = 0.5;
defineClip(0, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
