// CLIP 5 (2:08-2:40) - the fight: he knocks, he breathes, one relapse, he teaches Sam, the voice burns out.
(() => {
const T = [128, 133.5, 139, 144.5, 150, 155.5, 160];
sfx(128.0, 'hall-amb'); sfx(128.2, 'steps', 0.6); sfx(130.2, 'knock-soft'); sfx(131.2, 'door-open', 0.6);
sfx(133.5, 'hall-amb'); sfx(134.4, 'paper-crinkle', 0.4); sfx(135.6, 'pop-8bit-1'); sfx(136.8, 'celesta-sparkle', 0.6);
sfx(139.0, 'gym-amb'); sfx(139.8, 'bump'); sfx(140.0, 'fuse-light'); sfx(140.1, 'fuse-hiss', 0.6); sfx(140.6, 'pop-8bit-2'); sfx(141.0, 'breath-in', 0.8); sfx(142.2, 'breath-out', 0.8); sfx(142.5, 'fizz-out'); sfx(143.4, 'crowd-cheer', 0.5);
sfx(144.5, 'night-amb'); sfx(144.6, 'game-lose'); sfx(144.7, 'fuse-light'); sfx(144.8, 'fuse-hiss', 0.8); sfx(145.0, 'demon-8bit-1'); sfx(145.3, 'whisper-throwit'); sfx(146.6, 'boom-small'); sfx(146.8, 'cloth-rustle', 0.7); sfx(148.4, 'breath-out', 0.6);
sfx(150.0, 'park-amb'); sfx(150.3, 'kids-play', 0.6); sfx(150.6, 'fuse-light', 0.6); sfx(150.7, 'fuse-hiss', 0.4); sfx(151.4, 'pop-8bit-3'); sfx(152.4, 'breath-out', 0.6); sfx(152.8, 'fizz-out', 0.7); sfx(154.0, 'ball-bounce', 0.6);
sfx(155.5, 'morning-amb'); sfx(155.8, 'whisper-justonce', 0.6); sfx(156.6, 'breath-out', 0.6); sfx(157.4, 'fizz-out'); sfx(157.6, 'low-thud', 0.6); sfx(158.2, 'ash-crumble');

// REPEATED SHOT, reversed: the hallway. He walks to SAM's door - and knocks.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 945, u), y: lerp(545, 550, u), z: lerp(1, 1.06, u) });
  hallway(g, t, { door: 0, tilt: 0.22 });
  const open = es(t, 131.2, 131.8);
  if (open > 0) { g.fillStyle = '#0a0a0e'; g.fillRect(180, 340, 200 * open * 0.6, 510); Sam(g, { x: 230, y: HW_F, s: 0.62, face: { look: [0.8, 0], sad: 0.4, smile: 0, wide: 1.1 } }); }
  const hx = Math.max(470, 1300 - (t - a) * 420), arrived = hx <= 470;
  const knock = t > 130.2 && t < 130.9 ? Math.abs(Math.sin((t - 130.2) * 14)) : 0;
  const hr = arrived ? Hero(g, { x: 470, y: HW_F, s: 1.1, handL: knock ? [400 - knock * 10, 560] : null, handR: [520, 640], face: { look: [-0.8, 0.1], sad: 0.4, smile: 0.1 } }, { dir: -1 }) : walker(g, hx, HW_F, 1.1, -1, t * 6, {});
  floorShadow(g, hx, HW_F + 2, 90);
  if (arrived) rocket(g, 520, 610, 0.4, 0);
  caption(g, 'This time, he *knocked*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM-CLOSE (emotion): Sam sees the rocket - fixed - and the note
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), sm_ = es(t, 135.4, 136.4);
  setCam(g, { x: 340, y: lerp(640, 630, u), z: lerp(1.9, 2.0, u) });
  hallway(g, t, { door: 0 });
  g.fillStyle = '#0a0a0e'; g.fillRect(180, 340, 120, 510);
  const sm = Sam(g, { x: 270, y: HW_F, face: { look: [0.7, -0.2], sad: lerp(0.4, 0, sm_), smile: lerp(0, 0.9, sm_), wide: 1.1 } }); floorShadow(g, 270, HW_F + 2, 50);
  const hr = Hero(g, { x: 470, y: HW_F + 40, s: 1.1, lean: -0.25, armLines: false, handL: [360, 640], handR: [400, 660], face: { look: [-0.9, 0.5], sad: 0.3, smile: 0.2 + sm_ * 0.4 } }, { dir: -1 });
  rocket(g, 380, 610, 0.42, 0); notepad(g, 410, 690, 0.32, 'sorry, Sam.', 1, 0.1);
  headText(g, 'you fixed it?', sm.head[0] - 40, sm.head[1] - 90, t, 135.6, 138.2);
  caption(g, 'Sam *smiled* again.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM (the court, again): a hard bump - the fuse lights - he breathes, and it goes out
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), bump = es(t, 139.8, 140.0) * (1 - es(t, 140.3, 140.8)), inh = es(t, 141.0, 141.8) * (1 - es(t, 142.2, 143));
  setCam(g, { x: lerp(980, 990, u), y: 560, z: lerp(1.45, 1.55, u) });
  court(g, t, { cheer: t > 143.4 ? 1 : 0.4, score: '58 : 57' });
  P(g, { x: lerp(1500, 1180, es(t, 139.2, 139.9)), y: 840, s: 1.05, col: '#9a8d7e', acc: 'cap', accCol: '#3b4a63', handR: t > 143 ? [1120, 660] : null, face: { look: [-0.7, 0], smile: t > 143 ? 0.4 : -0.1 } }); floorShadow(g, 1180, 842, 80);
  const hr = Hero(g, { x: 960 - bump * 30, y: 840, s: 1.1, lean: -0.15 * bump, headOff: [0, -6 * inh], handR: t > 143 ? [1060, 660] : null, face: { look: [0.6, 0], sad: t > 140 && t < 142.5 ? -0.5 : 0.1, smile: t > 142.6 ? 0.4 : -0.1, blink: t > 140.8 && t < 142.4 ? 1 : 0 } }, { dir: 1 }); floorShadow(g, 960, 842, 90);
  if (t > 140) fuse(g, hr, 1.1, 0.4, t, t < 142.5 ? lerp(1, 0.3, seg(t, 141, 142.5)) : 0);
  if (t > 142.5) smoke(g, hr.head[0] + 6, hr.head[1] - 100, t, 1 - seg(t, 143.5, 144.4), 1.1);
  headText(g, 'breathe. 1... 2... 3.', hr.head[0] - 260, hr.head[1] - 60, t, 140.6, 142.8);
  caption(g, 'He learned to *breathe*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.3;
// MEDIUM (the relapse): a loss - "just throw it." - he does. Then he sees Sam at the door.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), thr = t > 146.6, k = seg(t, 146.6, 147.0);
  setCam(g, { x: lerp(820, 840, u), y: 500, z: lerp(1.35, 1.45, u) });
  const r = onBed(g, t, { screen: 1, lose: true, demon: 0.75, dx: 330, dA: es(t, 145.0, 145.6) * (1 - es(t, 147.6, 148.4)), dtext: 'just throw it.', da: Math.min(seg(t, 145.3, 145.6), 1 - seg(t, 147.2, 147.6)), tx: 60, ty: 150,
    hero: { handL: thr ? [SIT[0] - 60, SIT[1] - 40] : [SIT[0] - 30, SIT[1] - 60], handR: thr ? [SIT[0] - 120, SIT[1] - 150] : [SIT[0] + 30, SIT[1] - 60], armLines: false, face: { look: t > 147.6 ? [0.8, 0] : [0.8, 0.1], sad: t > 147.6 ? 0.7 : -0.8, smile: -0.3, wide: t > 147.6 ? 1.3 : 1 } } });
  if (!thr) controller(g, SIT[0], SIT[1] - 64, SS); else controller(g, lerp(SIT[0] - 120, 300, k), lerp(SIT[1] - 160, 640, k) - Math.sin(k * Math.PI) * 60, SS, k * 6);
  if (t > 144.7) fuse(g, r, SS, thr ? 0.02 : lerp(0.3, 0.02, seg(t, 144.7, 146.6)), t, thr ? 0 : 1);
  burst(g, r.head[0], r.head[1] - 30, 120, seg(t, 146.6, 147.2), 13); if (thr) smoke(g, r.head[0] + 6, r.head[1] - 55, t, 1, SS);
  if (t > 147.4) { g.fillStyle = 'rgba(255,200,130,0.25)'; g.fillRect(1684, 270, 40, 470); Sam(g, { x: 1640, y: 742, s: 0.55, face: { look: [-0.8, 0], sad: 0.6, wide: 1.2 } }); }
  caption(g, 'Some days, it still *blew*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.3;
// WIDE (core place 4, changed): the playground. Sam's spark lights - they breathe together - it goes out.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), inh = es(t, 151.6, 152.2) * (1 - es(t, 152.4, 153));
  setCam(g, { x: lerp(780, 800, u), y: lerp(560, 570, u), z: lerp(1.1, 1.18, u) });
  playground(g, t);
  const share = t > 153.4;
  const kid = Sam(g, { x: 760, y: PG_F, col: '#A9A9B4', acc: 'glasses', armLines: false, handL: [740, PG_F - 150], handR: [780, PG_F - 150], face: { look: [-0.8, 0], smile: share ? 0.7 : 0.1 } }); floorShadow(g, 760, PG_F + 2, 50);
  const sm = Sam(g, { x: 560, y: PG_F, headOff: [0, -5 * inh], handR: share ? [640, PG_F - 160] : null, face: { look: t < 151.4 ? [0.8, 0] : [-0.8, -0.2], sad: t < 152.6 ? -0.7 : 0, smile: share ? 0.8 : -0.2, blink: inh > 0.3 ? 1 : 0 } }); floorShadow(g, 560, PG_F + 2, 50);
  ball(g, share ? 700 : 760, share ? PG_F - 165 - Math.abs(Math.sin(t * 5)) * 30 : PG_F - 165, 0.8);
  const hr = Hero(g, { x: 420, y: PG_F + 50, s: 1.0, lean: 0.18, headOff: [0, -5 * inh], handR: [520, PG_F - 120], face: { look: [0.8, 0.4], smile: 0.4, blink: inh > 0.3 ? 1 : 0 } }, { dir: 1 }); floorShadow(g, 420, PG_F + 2, 80);
  if (t > 150.6) fuse(g, sm, 0.62, 0.35, t, t < 152.8 ? lerp(1, 0.2, seg(t, 151.4, 152.8)) : 0);
  if (t > 152.8) smoke(g, sm.head[0] + 4, sm.head[1] - 60, t, 1 - seg(t, 154, 155.4), 0.6);
  headText(g, 'breathe with me.', hr.head[0] - 60, hr.head[1] - 110, t, 151.4, 153.2);
  caption(g, 'Now Sam learned *this* from him.', capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.4;
// MEDIUM (the voice burns out): dawn in his room. One last whisper - one breath - it crumbles to ash.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), ash = seg(t, 157.4, 159.2);
  setCam(g, { x: lerp(1140, 1130, u), y: 520, z: lerp(1.4, 1.5, u) });
  heroRoom(g, t, { dawn: true, rocket: [1420, 556, 0.42] });
  if (ash < 1) demonAt(g, t, 1380, 742, lerp(0.6, 0.45, es(t, 155.6, 157.4)), ash > 0 ? null : 'just once more...', Math.min(seg(t, 155.8, 156.1), 1 - seg(t, 157.0, 157.4)), { a: 1 - ash, crack: es(t, 156.2, 157.4), face: { look: [-0.8, 0.2], sad: 0.7, smile: -0.4 } });
  if (ash > 0) { const q = rng(8); for (let i = 0; i < 40; i++) { const x = 1380 + (q() - 0.5) * 160, y0 = 560 + q() * 180; g.fillStyle = i % 4 ? `rgba(70,66,74,${1 - ash})` : `rgba(255,58,44,${0.8 * (1 - ash)})`; g.fillRect(x + Math.sin(t * 2 + i) * 20 * ash, y0 + ash * ash * (742 - y0), 6, 6); } smoke(g, 1380, 600, t, 1 - ash, 1.4); }
  const inh = es(t, 156.2, 156.6) * (1 - es(t, 156.6, 157.4));
  const r = Hero(g, { x: 1000, y: 742, s: 0.95, headOff: [0, -5 * inh], face: { look: [0.8, 0], smile: t > 158.4 ? 0.5 : 0.1, blink: inh > 0.3 ? 1 : blink(t, 0.3) } }, { dir: 1 }); floorShadow(g, 1000, 744, 90);
  fuse(g, r, 0.95, 0.06, t, 0);
  caption(g, 'The voice burned *out*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(128, T, [s1, s2, s3, s4, s5, s6]);
})();
