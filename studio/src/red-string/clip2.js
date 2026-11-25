// CLIP 2 (0:33-1:04.5) - the whispering coworkers, the notebook from his sister, the 3-year-old fight. The web. Low point.
(() => {
const T = [33, 39.5, 44, 50.5, 58.5, 64.5];
sfx(33.0, 'office-amb'); sfx(34.2, 'whisper-crowd', 0.5); sfx(35.0, 'thread-creak'); sfx(36.6, 'thread-creak', 0.9); sfx(38.0, 'breath-heavy', 0.5);
sfx(39.5, 'room-quiet'); sfx(40.0, 'heartbeat', 0.5); sfx(40.4, 'pop-8bit-2'); sfx(41.6, 'paper-crinkle', 0.6);
sfx(44.0, 'kitchen-night'); sfx(45.0, 'pop-8bit-3'); sfx(46.8, 'cloth-rustle', 0.5); sfx(48.2, 'book-slide');
sfx(50.5, 'night-amb'); sfx(51.0, 'thread-creak'); sfx(52.4, 'thread-creak', 0.9); sfx(53.6, 'pop-8bit-1'); sfx(54.6, 'demon-8bit-2', 0.6); sfx(54.7, 'whisper-ruined', 0.95); sfx(55.6, 'thread-creak'); sfx(57.0, 'thread-creak', 0.8);
sfx(58.5, 'night-amb', 0.7); sfx(59.0, 'heartbeat', 0.8); sfx(61.6, 'low-thud', 0.7); sfx(61.7, 'piano-low-hit', 0.8);

// MEDIUM (the office): two coworkers whisper by the break room and glance at him. The thread binds his chest.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 34.8, 38.6);
  setCam(g, { x: lerp(1080, 1100, u), y: 560, z: lerp(1.3, 1.36, u) });
  office(g, t, { day: true });
  box(g, 1460, 330, 220, 520, '#1d1b24', 4); g.fillStyle = '#e9e2cf'; g.font = '800 24px Nunito'; g.textAlign = 'center'; g.fillText('BREAK ROOM', 1570, 310);
  const lk = Math.sin(t * 1.3) > 0.2;
  Hero(g, { x: 1450, y: OF_F, s: 1.0, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', view: 'side', dir: 1, headOff: [8, 4], face: { look: [lk ? -0.8 : 0.9, 0.1], smile: 0.4 } }, { dir: 1 }); floorShadow(g, 1450, OF_F + 2, 80);
  Hero(g, { x: 1600, y: OF_F, s: 1.0, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', view: 'side', dir: -1, headOff: [-8, 4], face: { look: [-0.9, 0.1], smile: 0.5 } }, { dir: -1 }); floorShadow(g, 1600, OF_F + 2, 80);
  box(g, 880, 520, 160, 200, '#24222c', 20);
  const r = Hero(g, { x: 960, y: 760, hip: true, thigh: 20, s: 1.05, ...pose('table', 960, 760, 1.05, { hip: true, tableY: 742 }), headOff: [0, 4], face: { look: [0.9, -0.1], sad: 0.6, wide: 1.15, blink: blink(t, 0.4) } }, { dir: 1 });
  wind(g, 960, 650, 120, 30, 6, 1, t);
  wind(g, 960, 610, 110, 26, 5, w, t, -0.15);
  officeDesk(g, 960, 760, 1.05, { monX: -110, mug: true });
  loopsHud(g, 30 + Math.floor(w * 25));
  caption(g, 'His coworkers were *whispering*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.4;
// SPLIT: imagined ("he's so weird.") / happened (they hide something behind their backs... what?)
function s2(g, t, a, b) {
  const two = (g, mean) => { setCam(g, { x: 1100, y: 650, z: 1.0 }); office(g, t, { day: true });
    const a1 = Hero(g, { x: 1000, y: OF_F, s: 1.05, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', ...(mean ? { handR: [1110, 560] } : { handL: [940, 700] }), face: mean ? { look: [0.6, 0], smile: 0.9, sad: -0.5 } : { look: [0.5, 0], smile: 0.5 } }, { dir: 1 }); floorShadow(g, 1000, OF_F + 2, 80);
    const a2 = Hero(g, { x: 1200, y: OF_F, s: 1.05, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', ...(mean ? {} : { handR: [1270, 700] }), face: mean ? { look: [-0.6, 0], smile: 1 } : { look: [-0.5, 0], smile: 0.5 } }, { dir: -1 }); floorShadow(g, 1200, OF_F + 2, 80);
    if (mean) headText(g, "he's so weird.", a1.head[0] + 100, a1.head[1] - 110, t, 40.4, 43.9);
    else { box(g, 1250, 660, 80, 70, '#3b6fb6', 6); ln(g, [1290, 660, 1290, 730], 6, '#FFE14D'); ln(g, [1250, 695, 1330, 695], 6, '#FFE14D'); } };
  splitFrame(g, t, a, b, g => two(g, true), g => two(g, false));
  loopsHud(g, 55);
}
// MEDIUM (the kitchen, evening): his big sister hands him a small notebook. "write it down. it helps." He tosses it.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 46.4, 47.0), toss = es(t, 48.0, 48.5);
  setCam(g, { x: lerp(960, 975, u), y: 560, z: lerp(1.35, 1.42, u) });
  kitchen(g, t, { night: true, lamp: 0.8, note: 'MILK, EGGS' });
  const sx = 1180, hx = 820;
  const sis = Hero(g, { x: sx, y: K_F, s: 1.05, ...SIS, handL: give < 1 ? [lerp(1100, 1000, give), 640] : null, face: { look: [-0.8, 0.1], smile: 0.5, blink: blink(t, 1.3) } }, { dir: -1 }); floorShadow(g, sx, K_F + 2, 90);
  const holding = give >= 1 && toss < 1;
  const r = Hero(g, { x: hx, y: K_F, s: 1.05, handR: holding ? [lerp(930, 900, toss), lerp(650, 600, toss)] : null, face: { look: [0.8, 0.1], sad: 0.4, smile: -0.1, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, hx, K_F + 2, 90);
  wind(g, hx, K_F - 30, 55, 14, 4, 1, t, 0.1);
  kitchenTable(g, t, { cup: false });
  if (give < 1) notebook(g, lerp(1080, 980, give), 640, 1, 0.1);
  else if (toss < 1) notebook(g, lerp(950, 760, toss), lerp(640, 700 - Math.sin(toss * Math.PI) * 120, toss), 1, toss * 3);
  else notebook(g, 760, 716, 1, 1.5);
  headText(g, 'write it down. it helps.', sis.head[0], sis.head[1] - 115, t, 45.0, 47.8);
  loopsHud(g, 55);
  caption(g, 'His big sister gave him a *notebook*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.4;
// WIDE (bedroom, 3 AM): he replays a fight from three years ago. The whole room becomes a web. "you ruined it."
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 50.8, 57.5);
  setCam(g, { x: lerp(560, 600, u), y: lerp(520, 500, u), z: lerp(1.15, 1.22, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true }); bedGlow(g, t, 0.25);
  const H0 = [262, 590], anchors = [[40, 120], [600, 150], [1030, 200], [1460, 280], [1700, 520], [860, 740], [140, 720], [480, 420], [1280, 600], [1680, 300], [300, 200], [760, 560]];
  anchors.forEach((p, i) => threadTo(g, H0, p, clamp(w * 12 - i), 20 + i, t));
  for (let i = 0; i < 4; i++) thread(g, [[160 + i * 160, 660], [300 + i * 160, 600], [460 + i * 140, 680], [600 + i * 120, 610], [860, 650 + i * 10]], clamp(w * 3 - 1.5 - i * 0.3), 3, t);
  memoryBubble(g, 1380, 300, 190, Math.min(seg(t, 51.4, 52.0), 1 - seg(t, 57.6, 58.2)), g => {
    g.save(); g.translate(1380, 300); g.scale(0.32, 0.32); g.translate(-960, -560); restaurant(g, t); restTable(g, 960, 708, 300);
    Hero(g, { x: 820, y: 770, hip: true, thigh: 20, s: 1.05, view: 'side', dir: 1, handR: [900, 640], face: { look: [0.9, 0], sad: -0.6, smile: -0.3 } }, { dir: 1 });
    const f = Hero(g, { x: 1100, y: 770, hip: true, thigh: 20, s: 1.05, ...PAL, view: 'side', dir: -1, face: { look: [-0.9, 0], sad: 0.7, smile: -0.3 } }, { dir: -1 });
    g.fillStyle = '#fff'; g.font = '800 120px Nunito'; g.textAlign = 'center'; g.fillText('whatever, man.', 960, 360); g.restore(); });
  noCam(g); glow(g, W / 2, 190, 420, '255,58,44', 0.12 * Math.min(seg(t, 54.6, 55.0), 1 - seg(t, 57.0, 57.5)));
  demonText(g, 'you ruined it.', CAM.x, CAM.y + (190 - H / 2) / CAM.z, t, Math.min(seg(t, 54.7, 55.1), 1 - seg(t, 57.0, 57.5)), 84);
  loopsHud(g, 55 + Math.floor(w * 44));
  caption(g, 'He replayed a fight from *three years* ago.', capA(t, a + 0.4, b - 0.1), ACC);
}
s4.fin = 0.5;
// CLOSE (the low point): pinned to the bed. His eyes follow the threads... they all come from HIS head.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), see = es(t, 60.6, 61.6);
  setCam(g, { x: lerp(330, 300, u), y: lerp(560, 590, u), z: lerp(2.1, 2.3, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true });
  const H0 = [262, 590];
  for (let i = 0; i < 14; i++) { const a_ = -2.6 + i * 0.32; thread(g, [H0, [H0[0] + Math.cos(a_) * 90, H0[1] + Math.sin(a_) * 90], [H0[0] + Math.cos(a_ + 0.2) * 300, H0[1] + Math.sin(a_ + 0.2) * 300], [H0[0] + Math.cos(a_) * 700, H0[1] + Math.sin(a_) * 700]], 1, 3, t); }
  glow(g, H0[0], H0[1] - 30, 90 + 60 * see, SCR, 0.25 + 0.35 * see * (0.7 + 0.3 * Math.sin(t * 6)));
  flash(g, t, 61.6, SCR);
  loopsHud(g, 99);
  caption(g, 'Every thread came from *his own head*.', capA(t, 61.8, b - 0.1), ACC);
}
defineClip(33, T, [s1, s2, s3, s4, s5]);
})();
