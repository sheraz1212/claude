// CLIP 2 (0:32-1:04) - the habit repeats: the court, the SAME door slam three times, the games.
(() => {
const T = [32, 37.5, 43, 48.5, 54, 59, 64];
sfx(32.0, 'gym-amb'); sfx(33.0, 'ball-bounce', 0.8); sfx(34.0, 'fuse-light'); sfx(34.1, 'fuse-hiss', 0.7); sfx(35.9, 'boom', 0.8); sfx(35.9, 'ball-slam'); sfx(36.0, 'pop-8bit-1'); sfx(36.6, 'whistle', 0.8); sfx(37.0, 'crowd-groan', 0.7);
sfx(37.5, 'hall-amb'); sfx(37.6, 'stomp'); sfx(38.0, 'fuse-hiss', 0.6); sfx(40.3, 'door-slam'); sfx(40.35, 'low-thud', 0.7);
sfx(43.0, 'night-amb'); sfx(43.0, 'game-beeps', 0.7); sfx(44.5, 'game-lose'); sfx(44.6, 'fuse-light'); sfx(44.7, 'fuse-hiss', 0.8); sfx(45.4, 'demon-8bit-2'); sfx(45.6, 'whisper-cheated'); sfx(46.6, 'boom', 0.8); sfx(46.9, 'plastic-crack');
sfx(48.5, 'hall-amb'); sfx(48.6, 'stomp'); sfx(50.9, 'door-slam'); sfx(50.95, 'low-thud', 0.8); sfx(51.0, 'frame-rattle');
sfx(54.0, 'night-amb'); sfx(54.0, 'fuse-hiss', 0.6); sfx(54.4, 'demon-brass', 0.7); sfx(54.8, 'whisper-alwaysright'); sfx(56.6, 'whisper-pushyou');
sfx(59.0, 'hall-amb'); sfx(59.3, 'steps-small', 0.8); sfx(60.4, 'paper-crinkle', 0.4); sfx(62.6, 'door-close-soft', 0.7);

// WIDE (one-off place): the court. A bad pass - he slams the ball - the whistle
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 35.9, 10);
  setCam(g, { x: lerp(960, 990, u) + sh, y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  court(g, t, { cheer: 0.5 });
  const tm = P(g, { x: 1320, y: 840, s: 1.05, col: '#A9A9B4', acc: 'glasses', handL: [1236, 660], handR: [1404, 668], face: { look: [-0.7, 0], sad: t > 36 ? 0.6 : 0, smile: t > 36 ? -0.1 : 0.4 } }); floorShadow(g, 1320, 842, 90);
  const ref = P(g, { x: 1700, y: 840, s: 1.0, col: '#8d8d9b', acc: 'cap', accCol: '#222', handR: t > 36.5 ? [1650, 560] : null, face: { look: [-0.8, 0] } }); floorShadow(g, 1700, 842, 80);
  const slam = t > 35.9;
  const hr = Hero(g, { x: 800, y: 840, s: 1.1, lean: slam ? 0.12 : 0, handL: slam ? [730, 790] : [716, 690], handR: slam ? [870, 790] : [884, 690], face: { look: [0.8, t > 33.6 ? 0.6 : 0], sad: t > 34 ? -0.8 : 0, smile: t > 34 ? -0.3 : 0.2 } }, { dir: 1 }); floorShadow(g, 800, 842, 90);
  // the bad pass bounces past him; after the slam the ball flies off
  let bx, by;
  if (t < 34) { const k = seg(t, 32.6, 34); bx = lerp(1270, 600, k); by = 640 + Math.abs(Math.sin(k * 6.3)) * -120 + 120 * k; }
  else if (!slam) { bx = 820; by = lerp(840, 700, es(t, 34, 35.6)); }
  else { const k = seg(t, 35.9, 37.5); bx = 800 + k * 900; by = 820 - Math.abs(Math.sin(k * 9)) * 260 * (1 - k); }
  ball(g, bx, by);
  if (t > 34) fuse(g, hr, 1.1, slam ? 0.03 : lerp(0.62, 0.03, seg(t, 34, 35.9)), t, slam ? 0 : 1);
  burst(g, hr.head[0], hr.head[1] - 40, 240, seg(t, 35.9, 36.7), 5);
  if (slam) smoke(g, hr.head[0] + 6, hr.head[1] - 60, t, 1, 1.1);
  headText(g, 'are you blind?!', hr.head[0] - 300, hr.head[1] - 120, t, 36.1, 37.4);
  caption(g, 'On the court, one bad *pass*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// THE REPEATED SHOT: the hallway door. o: who's there, how hard it slams
function doorShot(g, t, a, b, o) {
  const u = ease(seg(t, a, b)), sh = shake(t, o.slam, o.k || 10);
  setCam(g, { x: lerp(960, 975, u) + sh, y: lerp(545, 550, u), z: lerp(1, 1.06, u) });
  const open = t < o.slam - 0.15 ? es(t, o.open, o.open + 0.3) : 1 - es(t, o.slam - 0.15, o.slam);
  hallway(g, t, { door: open, tilt: t > o.slam ? (o.tilt || 0.1) * (1 - 0.4 * Math.sin((t - o.slam) * 12) * Math.exp(-(t - o.slam) * 3)) : 0, rocketAtDoor: o.rocket, rocketFall: o.rocket && t > o.slam ? -1.4 * es(t, o.slam, o.slam + 0.3) : 0 });
  if (o.extra) o.extra(t);
  if (o.hero && t < o.slam - 0.25) {
    const hx = lerp(380, 1400, seg(t, a + 0.1, o.slam - 0.3));
    const hr = walker(g, hx, HW_F, 1.1, 1, t * 8, { face: { sad: -0.8, smile: -0.3 } }, 1.25); floorShadow(g, hx, HW_F + 2, 90);
    fuse(g, hr, 1.1, o.fuse ?? 0.4, t, 1);
  }
}
// REPEATED SHOT (1): he storms in and slams his door. Sam flinches at his own door.
function s2(g, t, a, b) {
  doorShot(g, t, a, b, { open: 39.4, slam: 40.4, hero: true, fuse: 0.35, extra: t => { const fl = t > 40.4 ? es(t, 40.4, 40.6) : 0; const sm = Sam(g, { x: 290, y: HW_F, headOff: [0, fl * 8], handL: [272, 700 - fl * 60], handR: [312, 704 - fl * 60], armLines: false, face: { look: [0.8, 0], wide: 1 + fl * 0.4, sad: fl * 0.8, smile: 0.3 - fl * 0.5 } }); floorShadow(g, 290, HW_F + 2, 50); rocket(g, 292, 690 - fl * 60, 0.4, 0); } });
  caption(g, 'At home, the *door* took the rest.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// MEDIUM (his room): YOU LOSE. The spark. The controller hits the wall.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 46.6, 10), thr = t > 46.6, k = seg(t, 46.6, 47.0);
  setCam(g, { x: lerp(860, 880, u) + sh, y: 500, z: lerp(1.45, 1.55, u) });
  const r = onBed(g, t, { screen: 1, lose: t > 44.5, demon: 0.95, dx: 360, dA: es(t, 45.4, 46.0), dtext: 'they cheated.', da: Math.min(seg(t, 45.6, 45.9), 1 - seg(t, 48.0, 48.4)), tx: 60, ty: 150,
    hero: { handL: thr ? [SIT[0] - 60, SIT[1] - 40] : [SIT[0] - 30, SIT[1] - 60], handR: thr ? [SIT[0] + 150, SIT[1] - 200] : [SIT[0] + 30, SIT[1] - 60], armLines: false, face: { look: [0.8, 0.1], sad: t > 44.5 ? -0.9 : -0.2, smile: t > 44.5 ? -0.4 : 0.1, wide: t > 46.6 ? 1.3 : 1 } } });
  if (!thr) controller(g, SIT[0], SIT[1] - 64, SS);
  else if (k < 1) controller(g, lerp(SIT[0] + 150, 1180, k), lerp(SIT[1] - 210, 420, k), SS, k * 9);
  else { controller(g, 1160, 735, SS, 2.8); g.strokeStyle = LINE; g.lineWidth = 2; g.beginPath(); g.moveTo(1180, 400); g.lineTo(1166, 420); g.lineTo(1190, 432); g.lineTo(1172, 452); g.stroke(); }
  if (t > 44.6) fuse(g, r, SS, thr ? 0.03 : lerp(0.5, 0.03, seg(t, 44.6, 46.6)), t, thr ? 0 : 1);
  burst(g, r.head[0], r.head[1] - 40, 200, seg(t, 46.6, 47.4), 7); if (thr) smoke(g, r.head[0] + 6, r.head[1] - 55, t, 1, SS);
  caption(g, 'Every lost game. Every *loss*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.3;
// REPEATED SHOT (2): harder. Mom is there now; Sam hides behind her. The photo swings.
function s4(g, t, a, b) {
  doorShot(g, t, a, b, { open: 50.0, slam: 50.9, k: 14, tilt: 0.22, hero: true, fuse: 0.28, extra: t => {
    const fl = t > 50.9 ? es(t, 50.9, 51.1) : 0;
    Mom(g, { x: 640, y: HW_F, s: 1.05, armLines: false, handL: [600, 690], handR: [690, 690], face: { look: [0.8, 0], sad: 0.5 + fl * 0.3, smile: -0.1 } }); box(g, 588, 640, 116, 60, '#3a3a46', 10); floorShadow(g, 640, HW_F + 2, 90);
    Sam(g, { x: 560, y: HW_F, headOff: [0, fl * 8], handR: [612, 690], face: { look: [0.8, 0], wide: 1 + fl * 0.4, sad: 0.6 } }); floorShadow(g, 560, HW_F + 2, 50);
  } });
  caption(g, 'Every slam got *louder*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (the voice grows): the fuse already lit again; the voice leans in, heavy
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 600, y: lerp(470, 465, u), z: lerp(2.0, 2.12, u) });
  const r = onBed(g, t, { demon: 2.2, dx: 300, dy: 1400, dA: es(t, 54.2, 55.0), hero: { headOff: [0, 6], face: { look: [-0.2, 0.7], sad: -0.6, smile: -0.25, blink: blink(t, 0.8) } } });
  fuse(g, r, SS, lerp(0.3, 0.18, seg(t, a, b)), t, 1);
  demonText(g, "you're always right.", 900, 330, t, Math.min(seg(t, 54.8, 55.1), 1 - seg(t, 56.3, 56.6)), 64);
  demonText(g, 'they push you.', 880, 330, t, Math.min(seg(t, 56.6, 56.9), 1 - seg(t, 58.6, 59)), 70);
  caption(g, 'And a voice kept it *burning*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REPEATED SHOT (3): the hallway is quiet. Sam leaves the rocket at his door, and walks away.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), put = t > 60.6;
  setCam(g, { x: lerp(1060, 1080, u), y: lerp(560, 565, u), z: lerp(1.2, 1.28, u) });
  hallway(g, t, { door: 0, tilt: 0.22, rocketAtDoor: put });
  const sx = t < 60.2 ? lerp(500, 1200, seg(t, a, 60.2)) : t < 61.2 ? 1200 : lerp(1200, 400, seg(t, 61.2, b));
  const sm = (t > 60.2 && t < 61.2) ? Sam(g, { x: 1200, y: HW_F, lean: 0.25 * Math.sin(seg(t, 60.2, 61.2) * Math.PI), handR: [1250, 800], face: { look: [0.6, 0.8], sad: 0.8, smile: -0.2 } }) : person(g, { ...SAM, x: sx, y: HW_F - Math.abs(Math.cos(t * 6)) * 3, s: 0.62, view: 'side', dir: t < 60.2 ? 1 : -1, legL: [0.4 * Math.sin(t * 6), 0], legR: [-0.4 * Math.sin(t * 6), 0], armL: [-0.3 * Math.sin(t * 6), 0.3], armR: [0.3 * Math.sin(t * 6), 0.3], armLines: false, face: { sad: 0.8, smile: -0.2 } });
  floorShadow(g, sx, HW_F + 2, 50);
  if (t < 60.4) rocket(g, sx + 26, HW_F - 120, 0.4, 0);
  caption(g, 'Sam stopped *knocking*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(32, T, [s1, s2, s3, s4, s5, s6]);
})();
