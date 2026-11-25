// CLIP 6 (2:40-3:10) - the mirrored ending: the same living room, now HE plays. The lesson.
(() => {
const T = [160, 166, 172, 177.5, 183, 190];
sfx(160.0, 'living-amb'); sfx(160.3, 'harm-duet');
sfx(166.0, 'living-amb'); sfx(168.2, 'pop-8bit-3');
sfx(172.0, 'living-amb'); sfx(177.5, 'room-quiet'); sfx(178.6, 'pencil', 0.8); sfx(181.0, 'celesta-sparkle', 0.5);
sfx(183.6, 'pen-write');

function scene(g, t, o = {}) {
  livingRoom(g, t, { lamp: 1, mom: () => { Mom(g, { x: 230, y: 832, s: 0.95, handL: [196, 700], handR: [262, 702], armLines: false, face: { look: [0.8, 0], smile: 0.8, blink: blink(t, 2.2) } }); floorShadow(g, 230, 834, 90, 0.4); } });
  const gp = Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: 1.15, aidNew: true, armLines: false, handL: [ARM[0] - 40, ARM[1] - 26], handR: [ARM[0] + 70 + Math.max(0, Math.sin(t * 6)) * 6, ARM[1] - 60], headTilt: Math.sin(t * 1.6) * 0.05, face: { look: [-0.5, 0.1], smile: 0.9, blink: o.gEyes ? 1 : blink(t, 1.1) } }, { dir: 1 });
  const pl = playPose(SOFA[0], SOFA[1], 1.15, { hip: true });
  const hr = Hero(g, { x: SOFA[0], y: SOFA[1], hip: true, thigh: 20, s: 1.15, armLines: false, ...pl, headTilt: Math.sin(t * 1.4) * 0.04, face: { look: [0.3, 0], smile: 0.5, blink: o.hEyes ? 1 : blink(t, 0.3) } }, { dir: 1 });
  lrFront(g);
  harmonica(g, pl._h[0], pl._h[1], 1.15); notes(g, pl._h[0] + 30, pl._h[1] - 40, t, 1, 1);
  return { gp, hr };
}
// WIDE (the mirror of the first scene): the same room - now the music comes from him
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 990, u), y: lerp(540, 555, u), z: lerp(1, 1.08, u) });
  scene(g, t);
  caption(g, 'Now the music came from *him*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.6;
// MEDIUM (Grandpa): eyes closed, tapping the beat on the armrest
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1400, 1390, u), y: 530, z: lerp(1.45, 1.55, u) });
  const { gp } = scene(g, t, { gEyes: true });
  headText(g, 'play it again.', gp.head[0] + 20, gp.head[1] - 120, t, 168.2, 170.8);
  caption(g, 'Grandpa felt every *note*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (emotion): him, eyes closed, playing - no bar, no headphones
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(660, 670, u), y: 500, z: lerp(2.0, 2.12, u) });
  scene(g, t, { hEyes: true });
  caption(g, 'This time, he *listened*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// INSERT top-down (the object, treasured): his note, and Grandpa's answer
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(540, 530, u), z: lerp(1, 1.06, u) });
  g.fillStyle = '#17141a'; g.fillRect(-200, -200, 2400, 1500); glow(g, 900, 420, 800, WARM, 0.2);
  g.strokeStyle = 'rgba(106,106,120,0.18)'; g.lineWidth = 2; for (let y = -200; y < 1400; y += 70) { g.beginPath(); g.moveTo(-300, y); g.lineTo(2300, y + 20); g.stroke(); }
  notepad(g, 640, 420, 1.7, 'teach me?', 1, -0.08);
  notepad(g, 1200, 560, 1.7, 'same time tomorrow?', seg(t, 178.6, 180.4), 0.06);
  harmonica(g, 900, 830, 3.0, -0.12); glow(g, 900, 830, 200, WARM, 0.2);
  caption(g, 'Some songs only play for a *while*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.3; s4.fout = 0.5;
const s5 = card('Take them off. *Listen*.', 0.5, 2.6, 104);
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
