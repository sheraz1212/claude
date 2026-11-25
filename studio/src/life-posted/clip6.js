// CLIP 6 (2:27-2:47) - the honest post (47 likes), the hook mirrored (morning, phone face down),
// Danny at the bus stop, the lesson.
(() => {
const T = [147, 151.5, 156.5, 162, 167.5];
sfx(147.0, 'room-quiet'); sfx(147.4, 'tap', 0.7); sfx(148.0, 'notif', 0.6); sfx(149.0, 'notif', 0.5);
sfx(151.5, 'morning-amb'); sfx(152.0, 'phone-down', 0.7); sfx(153.4, 'curtain'); sfx(154.0, 'birds', 0.8);
sfx(156.5, 'street-amb'); sfx(157.4, 'pop-8bit-3'); sfx(159.6, 'laugh-soft', 0.8); sfx(160.0, 'bus-pass', 0.7);
sfx(162.3, 'pen-write'); sfx(164.3, 'pen-write', 0.9);

// POV: the first honest post. A plain window, morning. 47 likes - and that's fine.
function s1(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: postApp({ pic: 'window', caption: 'Still figuring life out.', likes: likesAt, burst: [148, 149.4] }) });
  likesHud(g, t);
  caption(g, 'Fewer likes. A *real* life.', capA(t, a + 0.4, b - 0.1), ACC);
}
// WIDE (the hook, mirrored): same bedroom, morning. The phone stays face down. He opens the window.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 152.2, 153.4);
  setCam(g, { x: lerp(820, 860, u), y: lerp(520, 530, u), z: lerp(1.05, 1.12, u) });
  heroRoom(g, t, { dawn: true });
  box(g, 360, 700, 40, 8, '#0a0a0e', 2);
  const k = es(t, 153.4, 154.6); glow(g, 1025, 320, 520, WARM, 0.25 * k); pool(g, 1025, 760, 380, WARM, 0.2 * k);
  const hx = lerp(700, 960, go);
  const hr = go < 1 && go > 0 ? walker(g, hx, 740, 1.05, 1, t * 7, { face: { smile: 0.5 } }) : Hero(g, { x: hx, y: 740, s: 1.05, ...(go >= 1 ? { handL: [920, 420], handR: [1110, 420 + (1 - k) * 60] } : {}), face: { look: go >= 1 ? [0.2, -0.4] : [0.8, 0.2], smile: 0.4 + 0.4 * k, blink: blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, hx, 742, 90);
  caption(g, "He didn't check the *numbers*.", capA(t, a + 0.4, b - 0.1), ACC);
}
s2.fin = 0.4;
// WIDE (the proof): the bus stop. Danny waves. They laugh - no phones.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), arrive = es(t, 156.6, 158.2);
  setCam(g, { x: lerp(960, 990, u), y: lerp(580, 590, u), z: lerp(1.08, 1.15, u) });
  busStop(g, t);
  P(g, { x: 1500 + 60, y: BS_F, s: 0.95, col: '#8d8d9b', acc: 'cap', accCol: '#2f4f7a', view: 'side', dir: -1 }); floorShadow(g, 1560, BS_F + 2, 80);
  const dn = Hero(g, { x: 1000, y: BS_F, s: 1.05, ...DANNY, ...(t > 157.2 && t < 158.6 ? pose('wave', 1000, BS_F, 1.05, { dir: -1 }) : {}), face: { look: [-0.7, 0], smile: 0.9, blink: blink(t, 1.3) } }, { dir: -1 }); floorShadow(g, 1000, BS_F + 2, 90);
  const hx = lerp(300, 780, arrive);
  const hr = arrive < 1 ? walker(g, hx, BS_F, 1.05, 1, t * 7, { face: { smile: 0.8 } }) : Hero(g, { x: hx, y: BS_F, s: 1.05, headOff: [0, t > 159.6 && t < 160.8 ? -Math.abs(Math.sin(t * 10)) * 4 : 0], face: { look: [0.8, 0], smile: 0.95, blink: blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, hx, BS_F + 2, 90);
  headText(g, 'breakfast? my treat.', hr.head[0] - 20, hr.head[1] - 110, t, 158.4, 160.4);
  caption(g, 'He was finally *living* it.', capA(t, a + 0.5, b - 0.3), ACC);
}
s3.fin = 0.4;
s3.fout = 0.5;
// THE LESSON
const s4 = card2('Stop posting it.', 'Start *living* it.', 0.3, 1.8, 96);
defineClip(147, T, [s1, s2, s3, s4]);
})();
