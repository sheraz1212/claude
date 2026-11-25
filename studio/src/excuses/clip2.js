// CLIP 2 (0:32-1:04) - excuse 3 (Jay's call), excuse 4 (the guitar), excuse 5 (the diet). The bar keeps slipping.
(() => {
const T = [32, 38, 42, 45, 51, 55, 58, 64];
sfx(32.0, 'street-amb'); sfx(32.6, 'phone-buzz'); sfx(33.4, 'phone-buzz'); sfx(34.5, 'tap'); sfx(35.5, 'pop-8bit-3'); sfx(36.0, 'msg-send');
sfx(38.0, 'room-quiet'); sfx(38.6, 'msg-send'); sfx(40.2, 'msg-tick');
sfx(42.0, 'bar-hum'); sfx(42.3, 'demon-8bit-2'); sfx(42.4, 'bar-slide'); sfx(42.5, 'whisper-understand'); sfx(43.6, 'bar-thunk');
sfx(45.0, 'apt-amb'); sfx(45.0, 'game-beeps', 0.6); sfx(46.4, 'pop-8bit-1'); sfx(48.8, 'pop-8bit-2');
sfx(51.0, 'room-quiet'); sfx(51.6, 'string-dust', 0.7);
sfx(55.0, 'bar-hum'); sfx(55.4, 'bar-slide'); sfx(55.5, 'whisper-tired'); sfx(56.6, 'bar-thunk');
sfx(58.0, 'ff-amb'); sfx(59.0, 'pop-8bit-3'); sfx(60.2, 'tray-slide'); sfx(61.0, 'pop-8bit-1');

const PH = pose('phone', 900, 712, 1.05, { hip: true });
// MEDIUM (excuse 3): Jay is calling. Decline. "busy."
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(920, 930, u), y: 560, z: lerp(1.5, 1.6, u) });
  busStop(g, t);
  const hr = Hero(g, { x: 900, y: 712, hip: true, thigh: 20, s: 1.05, ...PH, face: { look: [0.2, 0.8], smile: t > 34.5 ? 0 : 0.1, blink: blink(t, 0.5) } }, { dir: 1 });
  const ring = t < 34.5; phoneAt(g, PH.handR[0], PH.handR[1] - 10, 1.05, 1, ring ? Math.sin(t * 50) * 0.05 : 0);
  if (ring) { g.fillStyle = '#fff'; g.font = '700 18px Nunito'; g.textAlign = 'center'; g.fillText('Jay', PH.handR[0], PH.handR[1] - 46); }
  busBench(g);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 24);
  headText(g, 'busy.', hr.head[0] + 160, hr.head[1] - 40, t, 35.5, 37.8);
  caption(g, 'Jay called. He *declined*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV (the message)
function s2(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.3, draw: chatApp('Jay', [{ who: 'r', text: 'yo, gym at 6 tmrw?', at: 0 }, { who: 'r', text: 'missed call', at: 0 }, { who: 's', text: 'busy.', at: 38.6 }, { typing: true, at: 39.2, until: 40.2 }, { who: 'r', text: 'u always are.', at: 40.2 }]) });
  caption(g, 'He was always *busy*.', capA(t, a + 0.4, b - 0.1), ACC);
}
function s3(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 24, v1: 16, t0: 42.4, t1: 43.6, hand: 'demon' });
  demonText(g, "he'll understand.", 960, 190, t, Math.min(seg(t, 42.5, 42.8), 1 - seg(t, 44.6, 44.95)), 74);
}
// WIDE (excuse 4): games on the couch. Mom: "you used to play." The guitar in the corner.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1180, 1200, u), y: lerp(560, 565, u), z: lerp(1.15, 1.22, u) });
  apartment(g, t, { dust: 1 });
  const PC = pose('phone2', COUCH[1], 712, 1.1, { hip: true });
  const hr = Hero(g, { x: COUCH[1], y: 712, hip: true, thigh: 20, s: 1.1, ...PC, face: { look: [-0.8, 0.1], smile: 0.2, blink: blink(t, 0.4) } }, { dir: -1 });
  controller(g, COUCH[1], PC.handR[1] - 4, 1.1);
  apFront(g, t, { facedown: false });
  const m = Hero(g, { x: 1540, y: AP_F, s: 1.05, ...MOM, face: { look: [-0.8, 0.1], sad: 0.3, smile: 0.1, blink: blink(t, 1.6) } }, { dir: -1 }); floorShadow(g, 1540, AP_F + 2, 90);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 16);
  headText(g, 'you used to play.', m.head[0], m.head[1] - 115, t, 46.4, 48.6);
  headText(g, 'no time.', hr.head[0], hr.head[1] - 200, t, 48.8, 50.9);
  caption(g, 'He used to play *every day*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// INSERT (the object): the guitar, dusty
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1740, y: lerp(640, 630, u), z: lerp(2.3, 2.45, u) });
  apartment(g, t, { dust: 1 });
  caption(g, 'Now it just collected *dust*.', capA(t, a + 0.4, b - 0.1), ACC);
}
function s6(g, t, a, b) {
  barInsert(g, t, a, b, { v0: 16, v1: 8, t0: 55.4, t1: 56.6, hand: 'demon' });
  demonText(g, "you're too tired.", 960, 190, t, Math.min(seg(t, 55.5, 55.8), 1 - seg(t, 57.6, 57.95)), 74);
}
// WIDE (excuse 5): the fast-food counter. "large fries." The diet starts Monday.
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 960, u), y: lerp(560, 570, u), z: lerp(1.1, 1.18, u) });
  fastFood(g, t);
  const ca = Hero(g, { x: 1060, y: 850, s: 1.05, col: '#C9A77A', acc: 'cap', accCol: '#b8483a', ...pose('hold', 1060, 850, 1.05), face: { look: [-0.8, 0], smile: 0.6, blink: blink(t, 1.2) } }, { dir: -1 }); apron(g, ca, 1.05);
  counterFront(g, t, { tray: t > 60.2 });
  const hr = Hero(g, { x: 620, y: 850, s: 1.1, view: 'side', dir: 1, face: { look: [0.5, 0], smile: 0.3 } }, { dir: 1 }); floorShadow(g, 620, 852, 90);
  P(g, { x: 300, y: 850, s: 1.0, col: '#8d8d9b', acc: 'glasses', view: 'side', dir: 1 }); floorShadow(g, 300, 852, 80);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 8);
  headText(g, 'anything else?', ca.head[0], ca.head[1] - 115, t, 59.0, 60.8);
  headText(g, 'large fries.', hr.head[0] - 40, hr.head[1] - 200, t, 61.0, 63.0);
  caption(g, 'The diet would start *Monday*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s7.fin = 0.4;
defineClip(32, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
