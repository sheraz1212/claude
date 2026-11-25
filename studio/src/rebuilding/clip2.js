// CLIP 2 (0:34-1:10) - the party: the girl he likes, with someone else (a crack, a chip falls). Home: his mom asks
// about his day - he snaps, his hand hits the fridge, the clay handprint he made for her at six shatters. His room: "you break everything."
(() => {
const T = [34, 40, 46, 52, 58, 64, 70];
sfx(34.0, 'party-amb'); sfx(36.0, 'laugh-crowd', 0.3);
sfx(40.0, 'party-amb'); sfx(43.0, 'laugh-soft', 0.4);
sfx(46.0, 'party-amb', 0.5); sfx(47.4, 'demon-8bit-3', 0.6); sfx(47.5, 'whisper-pick', 0.9); sfx(48.6, 'crack-body'); sfx(48.65, 'low-thud', 0.8); sfx(49.6, 'chip-fall', 0.8);
sfx(52.0, 'kitchen-night'); sfx(52.4, 'door-close-soft', 0.6); sfx(53.0, 'pop-8bit-1'); sfx(55.6, 'pop-8bit-2');
sfx(58.0, 'kitchen-night'); sfx(59.8, 'slam-hand'); sfx(60.2, 'clay-shatter'); sfx(60.2, 'crack-body', 0.8); sfx(61.6, 'steps', 0.8); sfx(63.4, 'door-slam', 0.8);
sfx(64.0, 'night-amb'); sfx(64.6, 'demon-brass', 0.7); sfx(65.0, 'demon-8bit-1', 0.6); sfx(65.1, 'whisper-break', 0.95); sfx(67.0, 'heartbeat', 0.6);

const GUY = { col: '#A9A9B4', acc: 'cap', accCol: '#2a2a2a' };
// WIDE (the party): lights, music, people dancing. He stands by the door with a soda.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 940, u), y: 560, z: lerp(1.05, 1.12, u) });
  party(g, t);
  [[760, '#8d8d9b', 'scarf', '#b8483a'], [1500, '#9a8d7e', 'glasses', ''], [1700, '#C9A77A', 'cap', '#3b6a4a']].forEach(([x, c, ac, acc], i) => { dancer(g, x, AP_F, { col: c, acc: ac, accCol: acc }, t, i); floorShadow(g, x, AP_F + 2, 80); });
  const k = Math.sin(t * 5); Hero(g, { x: 1100, y: AP_F, s: 1.0, ...GF, handL: [1040, 600 + k * 20], face: { look: [0.6, -0.1], smile: 0.9 } }, { dir: 1 }); floorShadow(g, 1100, AP_F + 2, 80);
  Hero(g, { x: 1260, y: AP_F, s: 1.05, ...GUY, handR: [1330, 600 - k * 20], face: { look: [-0.6, -0.1], smile: 0.9 } }, { dir: -1 }); floorShadow(g, 1260, AP_F + 2, 80);
  Me(g, t, { x: 320, y: AP_F, s: 1.05, handR: [380, 640], face: { look: [0.9, 0], smile: 0.4, blink: blink(t, 0.4) } }); box(g, 368, 612, 26, 36, '#c0453a', 4); floorShadow(g, 320, AP_F + 2, 90);
  hudFor(g, t);
  caption(g, 'The girl he liked was *there*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM: she is with someone else. Close. They dance - and hold hands.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), hold = es(t, 43.0, 43.8), close = lerp(0, 18, es(t, 41, 43));
  setCam(g, { x: lerp(1180, 1180, u), y: 540, z: lerp(1.6, 1.68, u) });
  party(g, t);
  const k = Math.sin(t * 5) * (1 - hold);
  Hero(g, { x: 1080 + close, y: AP_F, s: 1.0, ...GF, handR: hold > 0 ? [1180, 650] : [1150, 600 + k * 20], face: { look: [0.8, 0], smile: 0.95, blink: blink(t, 1.2) } }, { dir: 1 }); floorShadow(g, 1080 + close, AP_F + 2, 80);
  Hero(g, { x: 1290 - close, y: AP_F, s: 1.05, ...GUY, handL: hold > 0 ? [1180, 650] : [1210, 600 - k * 20], face: { look: [-0.8, 0], smile: 0.9 } }, { dir: -1 }); floorShadow(g, 1290 - close, AP_F + 2, 80);
  if (hold > 0.9) glow(g, 1180, 650, 60, '255,120,170', 0.3);
  hudFor(g, t);
  caption(g, 'She was with *someone else*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// CLOSE: him by the door. "she'd never pick you." A crack down his side - a piece falls.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(380, 390, u), y: 480, z: lerp(2.0, 2.1, u) });
  party(g, t);
  demonAt(g, t, 160, AP_F, 0.85, null, 0, { a: Math.min(es(t, 47.0, 47.6), 1 - seg(t, 50.2, 51)), face: { look: [0.8, 0.2] } });
  const r = Me(g, t, { x: 320, y: AP_F, s: 1.05, handR: [380, 650], headOff: [0, t > 48.6 ? 8 : 0], face: { look: [0.9, 0.1], sad: 0.9, smile: -0.25, blink: blink(t, 0.4) } }); box(g, 368, 622, 26, 36, '#c0453a', 4);
  chip(g, r.neck[0] + 40, r.neck[1] + 70, t, 49.4, 1.05);
  demonText(g, "she'd never pick you.", 250, 300, t, Math.min(seg(t, 47.5, 47.8), 1 - seg(t, 49.8, 50.2)), 62);
  flash(g, t, 48.6, '255,90,70');
  hudFor(g, t);
}
// the kitchen at night: his mom, the fridge with the clay handprint
const HPX = 1595, HPY = 560;
function kitchenShot(g, t, o = {}) {
  kitchen(g, t, { night: true, lamp: 0.9, note: 'LOVE YOU' });
  handprint(g, HPX, HPY, 0.8, { breakK: o.breakK || 0, gold: o.gold });
  const mm = Hero(g, { x: o.mx ?? 900, y: K_F, s: 1.05, ...MOMW, ...(o.mHand || {}), face: { look: o.mLook || [0.8, 0], smile: o.mSmile ?? 0.6, sad: o.mSad ?? 0, blink: blink(t, 1.2) } }, { dir: 1 }); floorShadow(g, o.mx ?? 900, K_F + 2, 90);
  return mm;
}
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), walk = es(t, 52.2, 54.6);
  setCam(g, { x: lerp(1160, 1180, u), y: 560, z: lerp(1.2, 1.26, u) });
  const mm = kitchenShot(g, t, { mx: 900 });
  const hx = lerp(1900, 1380, walk);
  const r = walk < 1 ? walker(g, hx, K_F, 1.05, -1, t * 5, { face: { sad: 0.8 } }) : Me(g, t, { x: hx, y: K_F, s: 1.05, view: 'side', dir: -1, face: { look: [-0.9, 0.2], sad: 0.9, smile: -0.3 } }, { dir: -1 });
  if (walk < 1) cracks(g, r, 1.05, crackK(t), goldK(t), t);
  floorShadow(g, hx, K_F + 2, 90);
  headText(g, 'how was your day, sweetie?', mm.head[0], mm.head[1] - 115, t, 53.0, 55.4);
  headText(g, 'just leave me alone!', r.head[0] - 30, r.head[1] - 115, t, 55.6, 57.9);
  hudFor(g, t);
  caption(g, 'His mom was waiting *up* for him.', capA(t, a + 0.5, 55.4), ACC);
}
s4.fin = 0.5;
// MEDIUM: his hand slams the fridge. The handprint falls and shatters. His mom's face. He storms off.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), slam = es(t, 59.4, 59.8), br = es(t, 60.0, 61.0), go = es(t, 61.6, 63.6), sh = shake(t, 59.8, 10);
  setCam(g, { x: lerp(1380, 1360, u) + sh, y: 560, z: lerp(1.5, 1.56, u) });
  kitchenShot(g, t, { mx: 1020, breakK: br, mSmile: t > 60.2 ? -0.2 : 0.3, mSad: t > 60.2 ? 0.9 : 0.2, mLook: [0.8, t > 60.4 ? 0.5 : 0], mHand: t > 60.4 ? { handL: [990, 560] } : {} });
  const hx = lerp(1380, 1900, go);
  const r = go > 0 ? walker(g, hx, K_F, 1.05, 1, t * 7, { face: { sad: 1 } }, 1.3) : Me(g, t, { x: 1380, y: K_F, s: 1.05, view: 'side', dir: 1, handR: [lerp(1440, 1520, slam), lerp(640, 560, slam)], face: { look: [0.9, 0], sad: -0.6, smile: -0.4, blink: blink(t, 0.4) } });
  if (go > 0) cracks(g, r, 1.05, crackK(t), goldK(t), t);
  floorShadow(g, hx, K_F + 2, 90);
  flash(g, t, 60.2, '255,90,70');
  hudFor(g, t);
  caption(g, 'The handprint he made her when he was *six*.', capA(t, 60.8, b - 0.1), ACC);
}
// THE LOW POINT (his room, dark): the demon fills the room. "you break everything."
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(560, 600, u), y: lerp(500, 480, u), z: lerp(1.2, 1.3, u) });
  heroRoom(g, t, { under: 0.4 });
  demonAt(g, t, 880, 760, 1.3, null, 0, { a: es(t, 64.4, 65.4), face: { look: [-0.8, 0.4], smile: 0.8 }, lean: -0.12 });
  const r = Me(g, t, { x: SIT[0], y: SIT[1], hip: true, thigh: 20, s: SS, ...pose('face', SIT[0], SIT[1], SS, { hip: true }), headOff: [0, 14], face: { look: [0, 0.9], sad: 1, blink: 1 } }, { dir: 1, amt: 0.35, dim: 0.15 });
  bedFront(g);
  demonText(g, 'you break everything.', CAM.x + (W * (PORTRAIT ? 0.5 : 0.3) - W / 2) / CAM.z, CAM.y + (H * 0.2 - H / 2) / CAM.z, t, Math.min(seg(t, 65.1, 65.5), 1 - seg(t, 69.2, 69.8)), 90);
  hudFor(g, t);
}
s6.fin = 0.4;
defineClip(34, T, [s1, s2, s3, s4, s5, s6]);
})();
