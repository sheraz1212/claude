// CLIP 1 (0:00-0:30) - the hook, the perfect profile, situation 1 (the rented car), situation 2 (the hotel lobby).
(() => {
const T = [0, 4, 7.5, 12.5, 15, 19, 23.5, 26, 30];
sfx(0.0, 'morning-amb'); sfx(0.3, 'notif'); sfx(1.2, 'notif', 0.8); sfx(2.1, 'notif', 0.7);
sfx(4.0, 'room-quiet'); sfx(4.4, 'scroll-flick'); sfx(5.6, 'scroll-flick', 0.8);
sfx(7.5, 'street-amb'); sfx(9.6, 'camera-shutter'); sfx(10.8, 'camera-shutter', 0.8);
sfx(12.5, 'notif-burst');
sfx(15.0, 'street-amb'); sfx(15.6, 'pop-8bit-1'); sfx(16.6, 'keys'); sfx(17.4, 'car-beep');
sfx(19.0, 'lobby-amb'); sfx(21.2, 'camera-shutter'); sfx(22.0, 'demon-8bit-1', 0.7); sfx(22.2, 'whisper-nobody', 0.8);
sfx(23.5, 'notif-burst');
sfx(26.0, 'lobby-amb'); sfx(26.6, 'pop-8bit-2'); sfx(28.2, 'steps', 0.7);

const selfie = (x, y, s) => { const hy = y - (166 + 126 + 46) * s; return { handR: [x + 92 * s, hy - 4 * s] }; };
// HOOK (second 0): morning, the phone glow, the likes rolling in
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(330, 345, u), y: lerp(560, 555, u), z: lerp(1.4, 1.5, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true, dawn: true }); bedGlow(g, t, 0.6);
  for (const [k, at] of [[0, 0.3], [1, 1.2], [2, 2.1]]) { if (t < at) continue; const f = Math.min(1, seg(t, at, at + 0.25)) * (1 - seg(t, at + 1.6, at + 2)); g.save(); g.globalAlpha = f; rr(g, 420, 440 - k * 54, 250, 44, 22); g.fillStyle = 'rgba(20,20,28,0.85)'; g.fill(); g.fillStyle = ACC; g.font = '700 20px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(['♥ jess liked your post', '♥ +42 likes', '♥ marco: goals bro 🔥'][k], 436, 462 - k * 54); g.restore(); }
  likesHud(g, t);
  hookLine(g, t, 'His life looked *perfect*.', 0.15, 1.4, 1 - seg(t, 3.5, 3.95));
}
// POV (the profile): cars, hotels, steak - "living the dream"
function s2(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: profileApp({ pics: ['car', 'hotel', 'steak', 'jacket', 'hotel', 'car'] }), thumb: t => [1180, lerp(820, 760, Math.sin((t - a) * 2) * 0.5 + 0.5)] });
  likesHud(g, t);
  caption(g, 'To everyone online, *Alex* was rich.', capA(t, a + 0.3, b - 0.1), ACC);
}
// SITUATION 1: a red sports car. Selfies.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1000, u), y: lerp(600, 610, u), z: lerp(1.15, 1.22, u) });
  rentalLot(g, t, { carX: 1180 });
  const sf = selfie(720, 860, 1.05);
  const hr = Hero(g, { x: 720, y: 860, s: 1.05, ...sf, face: { look: [0.6, -0.3], smile: 0.9, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 720, 862, 90);
  phoneAt(g, sf.handR[0], sf.handR[1], 1.05, 0.6, 0.3);
  for (const ft of [9.6, 10.8]) if (t > ft && t < ft + 0.2) glow(g, sf.handR[0], sf.handR[1], 260, '255,255,255', 0.6 * (1 - (t - ft) / 0.2));
  likesHud(g, t);
  caption(g, 'A brand new *sports car*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.3;
// POST
function s4(g, t, a, b) { phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: postApp({ pic: 'car', caption: 'new ride. hard work. 🔥', likes: likesAt, burst: [13.0, 14.4] }) }); likesHud(g, t); }
// REALITY: the rental guy takes the keys back - "time's up."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 16.2, 16.8);
  setCam(g, { x: lerp(860, 880, u), y: 600, z: lerp(1.4, 1.48, u) });
  rentalLot(g, t, { carX: 1250 });
  const rg = Hero(g, { x: 1060, y: 860, s: 1.05, col: '#A9A9B4', acc: 'cap', accCol: '#d9a657', handL: [lerp(1000, 960, give), 700], face: { look: [-0.8, 0], smile: 0.1, sad: -0.3 } }, { dir: -1 }); vest(g, rg, 1.05); floorShadow(g, 1060, 862, 90);
  const hr = Hero(g, { x: 760, y: 860, s: 1.05, handR: [lerp(860, 920, give), lerp(700, 690, give)], face: { look: [0.7, 0.2], smile: -0.1, sad: 0.4, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 760, 862, 90);
  g.fillStyle = '#d9a657'; g.fillRect(lerp(906, 950, give), 682, 16, 12);
  headText(g, "20 minutes. time's up.", rg.head[0] + 30, rg.head[1] - 115, t, 15.6, 18.3);
  likesHud(g, t);
  caption(g, 'He had *rented* it. For 20 minutes.', capA(t, a + 0.4, b - 0.1), ACC);
}
// SITUATION 2: the hotel lobby. A selfie under the chandelier.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 960, u), y: lerp(560, 570, u), z: lerp(1.05, 1.12, u) });
  hotelLobby(g, t, { desk: false });
  P(g, { x: 1380, y: 850, s: 1.0, col: '#C9A77A', acc: 'longhair', still: false, face: { look: [-0.6, 0.2], smile: 0.4 } }); box(g, 1180, 620, 400, 230, '#3a2a1c', 8); ln(g, [1180, 650, 1580, 650], 3, 'rgba(217,166,87,0.6)');
  const sf = selfie(900, 850, 1.05);
  const hr = Hero(g, { x: 900, y: 850, s: 1.05, ...sf, face: { look: [0.6, -0.3], smile: 0.9, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 900, 852, 90);
  phoneAt(g, sf.handR[0], sf.handR[1], 1.05, 0.6, 0.3);
  if (t > 21.2 && t < 21.4) glow(g, sf.handR[0], sf.handR[1], 260, '255,255,255', 0.6);
  demonAt(g, t, 520, 850, 0.6, 'nobody needs to know.', Math.min(seg(t, 22.2, 22.5), 1 - seg(t, 23.1, 23.5)), { a: es(t, 22.0, 22.5), tx: 200, ty: 120, face: { look: [0.8, 0.2] } });
  likesHud(g, t);
  caption(g, 'A weekend at a *luxury* hotel.', capA(t, a + 0.4, b - 0.1), ACC);
}
s6.fin = 0.3;
function s7(g, t, a, b) { phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: postApp({ pic: 'hotel', caption: 'weekend views ✨', likes: likesAt, burst: [24.0, 25.4] }) }); likesHud(g, t); }
// REALITY: "sir, are you a guest here?" - he walks out fast
function s8(g, t, a, b) {
  const u = ease(seg(t, a, b)), leave = seg(t, 28.0, 30);
  setCam(g, { x: lerp(1000, 980, u), y: 580, z: lerp(1.3, 1.36, u) });
  hotelLobby(g, t);
  const gd = Hero(g, { x: 1220, y: 850, s: 1.1, col: '#C9A77A', acc: 'glasses', ...(t < 28 ? { handL: [1120, 640] } : {}), face: { look: [-0.8, 0], smile: -0.1, sad: -0.4 } }, { dir: -1 }); tie(g, gd, 1.1); earpiece(g, gd, 1.1); floorShadow(g, 1220, 852, 90);
  const hx = lerp(900, 420, leave);
  const hr = leave > 0 ? walker(g, hx, 850, 1.05, -1, t * 8, { face: { sad: 0.5 } }, 1.2) : Hero(g, { x: 900, y: 850, s: 1.05, face: { look: [0.7, 0], wide: 1.3, sad: 0.4 } }, { dir: 1 });
  floorShadow(g, hx, 852, 90);
  headText(g, 'sir, are you a guest here?', gd.head[0] + 20, gd.head[1] - 115, t, 26.6, 28.6);
  likesHud(g, t);
  caption(g, 'He *wasn\'t*.', capA(t, a + 0.6, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6, s7, s8]);
})();
