// CLIP 3 (1:02-1:34) - the habit repeats: the same shot, one more note, a bigger voice.
(() => {
const T = [62, 66.5, 71, 76, 80.5, 86, 90, 94];
const N = [1, pickN(8), pickN(33), pickN(87)];
repSfx(62, 0); repSfx(66.5, 1); repSfx(76, 2); repSfx(90, 0);
sfx(71.4, 'phone-buzz'); sfx(73.6, 'msg-tick'); sfx(80.5, 'court-amb'); sfx(81.2, 'pop-8bit-2'); sfx(82.5, 'ball-bounce', 0.7); sfx(83.1, 'ball-bounce', 0.5); sfx(86.6, 'phone-buzz'); sfx(88.0, 'msg-tick'); sfx(90.2, 'low-thud', 0.7);

const r1 = (g, t, a, b) => repShot(g, t, a, b, { n0: N[0], win: 'dusk', lamp: 1, laundry: 0.67, dS: 0.8, think: 'gym...', cap: 'The gym could *wait*.' });
const r2 = (g, t, a, b) => repShot(g, t, a, b, { n0: N[1], win: 'night', lamp: 0.9, laundry: 1, dS: 1.0, think: 'dishes...', cap: 'So could the *dishes*.' });
// POV PHONE: his mom keeps calling.
function s3(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, n: 12, name: 'Mom', sub: 'mobile', who: 'mom', clock: 'SUN 7:40', buzz: [71.4], msgs: [
    { sys: 'Missed call (3)' }, { who: 's', text: 'call me when you can, sweetie', at: 71.4 }, { who: 'h', text: 'tomorrow mom.', at: 73.6 }] });
  caption(g, 'His mom kept *calling*.', capA(t, a + 0.4, b - 0.1), ACC);
}
const r4 = (g, t, a, b) => repShot(g, t, a, b, { n0: N[2], win: 'dusk', lamp: 0.6, laundry: 1, dS: 1.35, cap: 'Every day, more *tomorrows*.', dim: 0.14 });
// WIDE (the court without him): Sam waits alone.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 960, u), y: 545, z: lerp(1.06, 1, u) });
  court(g, t, { behind: () => { const wx = 300 + (t - a) * 55; walker(g, wx, 702, 0.7, 1, wx / 34, { col: '#6f6c78', acc: 'glasses' }); } });
  benchPeople(g, t, false);
  const k = seg(t, 82.2, 83.6), dropped = t > 82.2;
  floorShadow(g, 1100, 800, 80);
  const sam = person(g, { x: 1100, y: 800, s: 1, view: 'side', dir: -1, ...SAM, handR: dropped ? null : [1066, 640], armL: [0.6, 0.9], headOff: [0, 6], face: { look: [0, 0.5], sad: 0.7, smile: -0.4, blink: (t > 84.4 && t < 84.55) ? 1 : 0.1 } });
  g.save(); g.globalCompositeOperation = 'lighter'; const pg = g.createRadialGradient(sam.handL[0], sam.handL[1], 2, sam.handL[0], sam.handL[1], 70); pg.addColorStop(0, 'rgba(170,200,255,0.4)'); pg.addColorStop(1, 'rgba(170,200,255,0)'); g.fillStyle = pg; g.fillRect(sam.handL[0] - 80, sam.handL[1] - 80, 160, 160); g.restore();
  rr(g, sam.handL[0] - 10, sam.handL[1] - 30, 20, 34, 4); g.fillStyle = '#cfe0ff'; g.fill();
  const bx = dropped ? lerp(1066, 960, k) : 1060, by = dropped ? 772 - (1 - k) ** 2 * 130 * Math.abs(Math.cos(k * Math.PI * 2)) : 648;
  ball(g, bx, by, 28);
  headText(g, 'where is he?', sam.head[0] + 30, sam.head[1] - 100, t, 81.2, 83.6);
  caption(g, 'Sam waited at the *court*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function s6(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, n: 60, name: 'Sam', sub: 'best friend', who: 'sam', clock: 'FRI 6:14', buzz: [86.6], msgs: [
    { day: 'Friday' }, { who: 's', text: 'court at 6?' }, { who: 's', text: 'bro?', at: 86.6 }, { who: 'h', text: 'tomorrow.', at: 88.0 }] });
  caption(g, 'He told Sam *tomorrow*.', capA(t, a + 0.4, b - 0.1), ACC);
}
const r7 = (g, t, a, b) => repShot(g, t, a, b, { n0: N[3], win: 'cold', lamp: 0, laundry: 1, dS: 1.8, cap: 'His window got *smaller*.', dim: 0.16, slump: 1 });
defineClip(62, T, [r1, r2, s3, r4, s5, s6, r7]);
})();
