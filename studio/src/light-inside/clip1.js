// CLIP 1 (0:00-0:32) - Maya, the book, and the first night.
(() => {
const T = [0, 4.5, 11, 16.5, 22, 27.5, 32];
sfx(0.5, 'pen-write'); sfx(4.6, 'lib-amb'); sfx(7.2, 'page-turn'); sfx(11.0, 'lib-amb'); sfx(11.6, 'book-slide'); sfx(12.6, 'pop-8bit-1'); sfx(14.8, 'pop-8bit-2');
sfx(16.5, 'night-amb'); sfx(17.6, 'phone-buzz-muffled'); sfx(18.2, 'glow-hum'); sfx(19.2, 'demon-8bit-1'); sfx(19.8, 'whisper-nobody'); sfx(22.0, 'glow-hum'); sfx(23.4, 'whisper-once', 0.8); sfx(27.6, 'tap-water'); sfx(29.5, 'light-flicker');

const s1 = card('It started as *curiosity*.', 0.5, 2.7);

function tablePeople(g, t, o = {}) {
  const laugh = Math.sin(t * 9) * 0.03 * (o.laugh || 0);
  const hero = Hero(g, { x: 860, y: 740, hip: true, thigh: 20, s: 1.25, face: { look: [0.65, o.shy ? 0.5 : 0.05], smile: o.shy ? 0.1 : 0.7, sad: o.shy || 0, blink: (t % 3.7 < 0.14) ? 1 : 0 }, ...(o.hero || {}) }, o.lv ?? 1, { dir: 0, amt: 0.15 });
  const maya = P(g, { x: 1160, y: 740 + laugh * 60, hip: true, thigh: 20, s: 1.25, ...MAYA, headTilt: laugh * 2, face: { look: [-0.65, 0.05], smile: 0.8, blink: ((t + 1.3) % 4.1 < 0.14) ? 1 : 0 }, ...(o.maya || {}) }, 1);
  return { hero, maya };
}
// WIDE (the place, mirrored at the end): the library. He and Maya study side by side.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 1000, u), y: lerp(540, 550, u), z: lerp(1, 1.08, u) });
  library(g, t, { behind: () => { const wx = 300 + (t - a) * 70; const w = walker(g, wx, 722, 0.8, 1, wx / 30, { col: '#8d8d9b', acc: 'glasses' }); light(g, w, 0.8, 0.85); } });
  tablePeople(g, t, { laugh: seg(t, 7.5, 8.2) * (1 - seg(t, 9.2, 10)) });
  libTable(g); openBook(g, 860, 694); openBook(g, 1130, 694); book(g, 1270, 686, 110, 20, 0, false);
  caption(g, 'He liked a girl named *Maya*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s2.fin = 0.5;
// MEDIUM two-shot (the bond + the object): she lends him her favourite book.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1010, y: lerp(600, 590, u), z: lerp(1.55, 1.65, u) });
  library(g, t);
  const k = es(t, 11.5, 12.4), bx = lerp(1270, 960, k);
  const { hero, maya } = tablePeople(g, t, { maya: { handL: k < 1 ? [bx + 40, 680] : null, bendL: -1 }, hero: { face: { look: [0.5 - k * 0.2, 0.05 + 0.5 * k * (1 - es(t, 13.2, 13.8))], smile: 0.75 } } });
  libTable(g); openBook(g, 830, 694); openBook(g, 1150, 694); book(g, bx, 686, 120, 22, 0, false);
  headText(g, 'coffee after finals?', maya.head[0] + 30, maya.head[1] - 110, t, 12.6, 14.6);
  headText(g, 'deal.', hero.head[0], hero.head[1] - 110, t, 14.8, 16.3);
  caption(g, 'She lent him her favorite *book*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (his dorm, the first night): a glow under the blanket, and a small voice.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), gl = es(t, 17.6, 19) * 0.4;
  setCam(g, { x: lerp(880, 900, u), y: 545, z: lerp(1, 1.05, u) });
  dorm(g, t, { sleeping: true, glow: gl, bookAt: 'desk' });
  demonAt(g, t, 1000, 836, 0.8, 'nobody will know.', Math.min(seg(t, 19.8, 20.1), 1 - seg(t, 21.6, 21.95)), { a: es(t, 19.2, 19.7), tx: 230, ty: 60 });
  caption(g, 'That night, he got *curious*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s4.fin = 0.4;
// CLOSE-UP (the pull): only the glow on his face. "Just once."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0d0d14'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  g.fillStyle = '#17171f'; g.strokeStyle = LINE; g.lineWidth = 3; rr(g, 380, 250, 1160, 520, 120); g.fill(); g.stroke();
  const d = demon(g, { x: 1560, y: 1620, s: 3.3, lean: -0.12, face: { look: [-0.8, 0.3], smile: 0.8 }, handL: [1130, 760], bendL: -1 }, { t, a: es(t, 23, 23.8) * 0.9, glow: 28 });
  demonText(g, 'just once.', 1560, 250, t, Math.min(seg(t, 23.4, 23.7), 1 - seg(t, 26.6, 27)), 84);
  const pulse = 0.85 + 0.15 * Math.sin(t * 5);
  const r = actor(g, { x: 900, y: 1500, s: 3, headTilt: -0.06, face: { look: [-0.25, 0.75], wide: 1.3, smile: -0.05, sad: 0.3, blink: (t > 24.9 && t < 25.02) ? 1 : 0 } }, { dir: 1, amt: 0.45, dim: 0.1 });
  glow(g, 800, 1000, 520, MAG, 0.5 * pulse); glow(g, 860, 760, 260, MAG, 0.22 * pulse);
  for (const sg of [-1, 1]) glow(g, r.head[0] - 11 + sg * 54, r.head[1] + 20, 7, '255,170,245', 0.85 * pulse);
  g.beginPath(); g.moveTo(-100, 880); g.quadraticCurveTo(700, 800, 1300, 900); g.quadraticCurveTo(1700, 960, 2100, 900); g.lineTo(2100, 1200); g.lineTo(-100, 1200); g.closePath(); g.fillStyle = '#1e1e2b'; g.fill(); g.strokeStyle = LINE; g.stroke();
  glow(g, 760, 930, 300, MAG, 0.3 * pulse);
  caption(g, 'Just *once*, he thought.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REFLECTION (the morning after): the same mirror shot comes back all film long.
function s6(g, t, a, b) {
  const u = seg(t, a, b);
  setCam(g, { x: 960, y: lerp(540, 530, ease(u)), z: lerp(1, 1.05, ease(u)) });
  const fl = (t > 29.5 && t < 30.3) ? -0.4 * Math.abs(Math.sin((t - 29.5) * 20)) : 0;
  mirror(g, t, { lv: 0.85 + fl, face: { smile: 0.25, look: [0, 0.6 * es(t, 29.5, 29.9) * (1 - es(t, 30.6, 31.1))], blink: (t > 28.6 && t < 28.74) ? 1 : 0 } });
  caption(g, "It didn't seem to *matter*.", capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
