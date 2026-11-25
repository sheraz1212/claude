// CLIP 4 (1:39-2:09) - the recovery, mirrored: the same four places. He lets it go - each wall falls. The relapse online.
(() => {
const T = [99, 105, 111, 117, 123, 129];
sfx(99.0, 'dinner-amb'); sfx(99.6, 'pop-8bit-1'); sfx(101.6, 'laugh-soft', 0.8); sfx(102.6, 'brick-fall'); sfx(102.8, 'celesta-sparkle', 0.5);
sfx(105.0, 'living-amb'); sfx(105.3, 'crowd-tv', 0.3); sfx(105.6, 'pop-8bit-2'); sfx(107.4, 'pop-8bit-3'); sfx(108.6, 'brick-fall'); sfx(108.8, 'celesta-sparkle', 0.5);
sfx(111.0, 'locker-amb'); sfx(111.8, 'brick-fall'); sfx(112.0, 'celesta-sparkle', 0.5); sfx(112.6, 'steps-small', 0.5); sfx(113.2, 'chair-creak', 0.5); sfx(113.8, 'pop-8bit-1');
sfx(117.0, 'cafe-amb'); sfx(117.6, 'pop-8bit-2'); sfx(119.4, 'pop-8bit-3'); sfx(120.6, 'brick-fall'); sfx(120.8, 'celesta-sparkle', 0.5);
sfx(123.0, 'night-amb'); sfx(123.4, 'typing', 0.7); sfx(124.2, 'demon-8bit-3', 0.6); sfx(124.3, 'whisper-prove', 0.9); sfx(126.0, 'delete', 0.8); sfx(126.8, 'phone-down', 0.8); sfx(127.4, 'brick-fall', 0.8);

// DINNER: his dad tells the same story, wrong year again. He just smiles - and laughs along. The wall falls.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), f = es(t, 102.6, 104.2);
  setCam(g, { x: lerp(930, 920, u), y: 555, z: lerp(1.4, 1.48, u) });
  const { dd, hr } = dinnerShot(g, t, { wall: 1, fall: f, wallT: 102.6, laugh: t > 101.6 && t < 103, dSmile: 0.8, hSmile: 0.9, hLook: [-0.6, 0] });
  headText(g, 'it was back in 1998...', dd.head[0], dd.head[1] - 110, t, 99.6, 101.8);
  wallsHud(g, t < 102.6 ? 46 : 40);
  caption(g, 'This time, he let it *go*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
// COUCH: "the ending was dumb." - "yeah. you're right."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), f = es(t, 108.6, 110.2);
  setCam(g, { x: lerp(975, 985, u), y: 545, z: lerp(1.45, 1.52, u) });
  const { hr, gf } = couchShot(g, t, { wall: 1, fall: f, wallT: 108.6, hSmile: 0.7, hLook: [0.8, 0], gSmile: t > 108.4 ? 0.9 : 0.3, gLook: [-0.8, 0] });
  headText(g, 'the ending was dumb.', gf.head[0] + 30, gf.head[1] - 110, t, 105.6, 107.3);
  headText(g, "yeah. you're right.", hr.head[0] - 30, hr.head[1] - 110, t, 107.4, 109.6);
  wallsHud(g, t < 108.6 ? 40 : 30);
  caption(g, 'He didn\'t need to *win*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// LOCKER ROOM: he sits next to his teammate. "we lost together."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), f = es(t, 111.8, 113.2);
  setCam(g, { x: lerp(1000, 1010, u), y: 560, z: lerp(1.45, 1.52, u) });
  const { hr } = lockerShot(g, t, { wall: 1, fall: f, wallT: 111.8, sit: t > 113.2 });
  if (hr) headText(g, 'we lost together.', hr.head[0] - 20, hr.head[1] - 115, t, 113.8, 116.6);
  wallsHud(g, t < 111.8 ? 30 : 20);
  caption(g, 'He sat *with* him.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// CAFE: his friend is down again. He doesn't lecture. He listens. "I'm here, man."
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), f = es(t, 120.6, 122.2);
  setCam(g, { x: lerp(960, 965, u), y: 570, z: lerp(1.42, 1.5, u) });
  const { bd, hr } = cafeShot(g, t, { wall: 1, fall: f, wallT: 120.6, reach: t > 119.4, smile: 0.4 });
  headText(g, 'rough week, man.', bd.head[0] + 30, bd.head[1] - 110, t, 117.6, 119.3);
  headText(g, "I'm here. tell me.", hr.head[0] - 30, hr.head[1] - 115, t, 119.4, 122.0);
  wallsHud(g, t < 120.6 ? 20 : 10);
  caption(g, 'He just *listened*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// THE RELAPSE (his room, night): an argument online, a whisper - "prove him wrong." He deletes it. Puts the phone down.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), PH = pose('phone', SIT[0], SIT[1], SS, { hip: true }), down = t > 126.8, f = es(t, 127.4, 128.8);
  setCam(g, { x: lerp(560, 540, u), y: lerp(500, 510, u), z: lerp(1.2, 1.28, u) });
  const r = onBed(g, t, { under: 0.3, hero: { ...(down ? { handR: [SIT[0] + 40, SIT[1] - 30] } : PH), headOff: [0, 8], face: { look: down ? [0.5, 0.1] : [0.1, 0.9], smile: down ? 0.4 : 0, sad: down ? 0 : 0.3, blink: blink(t, 0.6) } } });
  if (down) phoneAt(g, SIT[0] + 40, SIT[1] - 40, SS, 0, 1.4); else { phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 0.9); glow(g, r.head[0] + 20, r.head[1] + 40, 80, GREEN, 0.12); }
  brickWall(g, 930, 900, 160, 900, 1, f, 21);
  dust(g, 930, 900, t, 127.4);
  noCam(g); glow(g, W / 2, 190, 420, '255,58,44', 0.12 * Math.min(seg(t, 124.2, 124.6), 1 - seg(t, 125.8, 126.2)));
  demonText(g, 'prove him wrong.', CAM.x, CAM.y + (190 - H / 2) / CAM.z, t, Math.min(seg(t, 124.3, 124.7), 1 - seg(t, 125.8, 126.2)), 84);
  wallsHud(g, t < 127.4 ? 10 : 1);
  caption(g, 'The old habit *came back*.', capA(t, a + 0.4, 125.9), ACC);
  caption(g, 'He let it *go*.', capA(t, 126.4, b - 0.1), ACC);
}
s5.fin = 0.4;
defineClip(99, T, [s1, s2, s3, s4, s5]);
})();
