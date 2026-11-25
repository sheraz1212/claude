// CLIP 3 (1:00-1:30) - he can't stop, the biggest post (12,000 likes), then his brother's text:
// Mom is proud... and needs help with the electricity bill. $23 in the bank. The mirror.
(() => {
const T = [60, 64, 68, 72, 77.5, 81, 84, 90];
sfx(60.0, 'room-quiet'); sfx(60.4, 'scroll-flick', 0.7); sfx(61.6, 'phone-down', 0.8); sfx(62.0, 'demon-8bit-3', 0.7); sfx(62.1, 'whisper-onemore', 0.8); sfx(63.3, 'phone-up', 0.7);
sfx(64.0, 'camera-shutter', 0.7); sfx(64.5, 'notif-burst'); sfx(65.4, 'notif-burst', 0.8); sfx(66.4, 'notif-burst', 0.7);
sfx(68.0, 'room-quiet'); sfx(68.5, 'notif', 0.7); sfx(69.4, 'notif', 0.6); sfx(70.2, 'notif', 0.5);
sfx(72.4, 'msg-in'); sfx(74.6, 'msg-in'); sfx(76.2, 'msg-in', 0.9);
sfx(77.8, 'thud'); sfx(77.8, 'piano-low');
sfx(81.0, 'room-quiet'); sfx(81.3, 'tap', 0.7);
sfx(84.0, 'room-quiet'); sfx(85.0, 'demon-8bit-1', 0.6); sfx(85.1, 'whisper-post', 0.8); sfx(88.0, 'phone-down', 0.8);

const PH = pose('phone', SIT[0], SIT[1], SS, { hip: true });
// MEDIUM (bed, night): he closes the app... the voice: "one more post." He opens it again.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = t > 61.6 && t < 63.3;
  setCam(g, { x: lerp(520, 540, u), y: lerp(520, 515, u), z: lerp(1.45, 1.52, u) });
  const r = onBed(g, t, { under: 0, demon: 1.0, dA: Math.min(es(t, 61.9, 62.6), 1 - seg(t, 63.6, 64)), dtext: 'one more post.', da: Math.min(seg(t, 62.1, 62.4), 1 - seg(t, 63.4, 63.8)), tx: 200, ty: 40,
    hero: { ...(down ? { handR: [SIT[0] + 40, SIT[1] - 30] } : PH), headOff: [0, down ? 4 : 8], face: { look: down ? [0.5, 0.2] : [0.1, 0.9], sad: 0.3, blink: blink(t, 0.6) } } });
  if (down) phoneAt(g, SIT[0] + 40, SIT[1] - 40, SS, 0, 1.4); else { phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 0.9); glow(g, r.head[0] + 20, r.head[1] + 40, 90, GREEN, 0.12); }
  likesHud(g, t);
  caption(g, "He couldn't *stop*.", capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.4;
// POV: the biggest post of all - the car again. "Hard work changes everything." 12,000 likes.
function s2(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.6, draw: postApp({ pic: 'car', caption: 'Hard work changes everything.', likes: likesAt, burst: [64.5, 67.5] }) });
  likesHud(g, t);
  caption(g, 'His biggest post *ever*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// CLOSE (the high): he smiles at the screen, likes still raining in
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(560, 570, u), y: lerp(548, 540, u), z: lerp(2.1, 2.2, u) });
  const r = onBed(g, t, { under: 0, hero: { ...PH, headOff: [0, 8], face: { look: [0.2, 0.9], smile: 0.95, blink: blink(t, 0.6) } } });
  phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 1); glow(g, r.head[0] + 20, r.head[1] + 40, 80, GREEN, 0.14);
  for (const [k, at] of [[0, 68.5], [1, 69.4], [2, 70.2]]) { if (t < at) continue; const f = seg(t, at, at + 0.25) * (1 - seg(t, at + 1.8, at + 2.1)); g.save(); g.globalAlpha = f; rr(g, 640, 450 - k * 40, 210, 34, 17); g.fillStyle = 'rgba(20,20,28,0.85)'; g.fill(); g.fillStyle = ACC; g.font = '700 17px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(['♥ +1,200 likes', '♥ "goals!!"', '♥ "how bro??"'][k], 654, 467 - k * 40); g.restore(); }
  likesHud(g, t);
  caption(g, '12,000 people *believed* it.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV (chat): his little brother. "Mom saw your post. She's so proud." ... "the electricity bill"
function s4(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [72.4, 74.6], draw: chatApp('Leo (bro)', [
    { who: 'r', text: "Mom saw your post. She's so proud of you.", at: 72.4 },
    { who: 'r', text: 'she wanted to ask if you could help with the electricity bill this month...', at: 74.6 },
    { who: 'r', text: "she didn't want to bother you.", at: 76.2 }]) });
  likesHud(g, t);
  caption(g, 'Then his little brother, *Leo*, texted.', capA(t, a + 0.3, 74.4), ACC);
}
// CLOSE (the hit): the smile falls. Impact.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 77.8);
  setCam(g, { x: lerp(560, 565, u) + sh, y: 545, z: lerp(2.2, 2.3, u) });
  const fall = es(t, 77.6, 78.4);
  const r = onBed(g, t, { under: 0, hero: { ...PH, headOff: [0, 8 + fall * 8], face: { look: [0.2, 0.9], smile: lerp(0.3, -0.3, fall), sad: lerp(0.2, 1, fall), wide: fall > 0.5 && t < 79.5 ? 1.3 : 1, blink: blink(t, 0.6) } } });
  phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 1); glow(g, r.head[0] + 20, r.head[1] + 40, 80, GREEN, 0.14);
  flash(g, t, 77.8, PINK);
  likesHud(g, t);
  caption(g, 'His mom believed *all* of it.', capA(t, a + 0.6, b - 0.1), ACC);
}
// POV (bank): the truth in one number
function s6(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: bankApp('$23.40'), zoom: lerp(1, 1.08, es(t, 81.5, 83.5)) });
  likesHud(g, t);
  caption(g, 'He had *$23*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// REFLECTION (the window at night): the voice behind him - "post it." He lowers the phone.
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b)), low = es(t, 87.6, 88.4);
  setCam(g, { x: lerp(960, 960, u), y: lerp(540, 560, u), z: lerp(1.0, 1.08, u) });
  windowRefl(g, t, { demon: Math.min(es(t, 84.8, 85.6), 1 - seg(t, 88.2, 89)), down: 0.6 + low * 0.4, pose: { handR: [lerp(1010, 1000, low), lerp(1080, 1300, low)] } });
  demonText(g, 'post it.', 1270, 380, t, Math.min(seg(t, 85.1, 85.4), 1 - seg(t, 87.4, 87.8)), 90);
  likesHud(g, t);
  caption(g, 'For once, he *didn\'t*.', capA(t, 88.0, b - 0.1), ACC);
}
s7.fin = 0.4;
defineClip(60, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
