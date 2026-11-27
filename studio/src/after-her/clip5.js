// AFTER HER - CLIP 5 (2:14-2:32): the hook mirrored - morning, phone face down, he opens the window; a run with his
// best friend in the sun. The lesson.
(() => {
const T = [134, 140, 146, 152];
sfx(134.0, 'birds', 0.8); sfx(134.6, 'morning-amb'); sfx(135.8, 'curtain'); sfx(136.6, 'celesta-sparkle', 0.5);
sfx(140.0, 'street-amb', 0.6); sfx(140.2, 'birds', 0.6); for (let i = 0; i < 8; i++) sfx(140.4 + i * 0.7, 'steps', 0.4); sfx(142.6, 'laugh-soft', 0.6);
sfx(146.3, 'pen-write'); sfx(148.0, 'pen-write', 0.9);

// WIDE (his room, the first shot again - now morning): the phone face down. He pulls the curtains open. Sunlight.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 134.4, 135.6), op = es(t, 135.8, 137.2);
  setCam(g, { x: lerp(820, 880, u), y: lerp(520, 510, u), z: lerp(1.0, 1.06, u) });
  cRoom(g, t, { mode: 'morning', open: op, dust: 0 });
  box(g, 60, 632, 40, 8, '#0a0a0e', 2);
  const hx = lerp(700, 1120, go);
  if (go > 0 && go < 1) walker(g, hx, CF, 1.05, 1, t * 6, { face: { smile: 0.6 } }); else Me2(g, t, hx, op);
  floorShadow(g, hx, CF + 2, 90);
  daysHud(g, 90);
  caption(g, 'Ninety days later, he opened the *window*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function Me2(g, t, hx, op) { Hero(g, { x: hx, y: CF, s: 1.05, ...(op > 0 && op < 1 ? { handL: [hx - 120, 330], handR: [hx + 120, 330] } : {}), face: { look: [0.2, -0.3], smile: 0.4 + 0.5 * op, blink: blink(t, 0.4) } }, { dir: 1 }); }
// WIDE (a sunny park path): he runs with his best friend, laughing.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = seg(t, a, b);
  setCam(g, { x: lerp(900, 1020, u), y: 560, z: lerp(1.05, 1.1, u) });
  grad(g, -500, -400, 3000, 1000, [[0, '#5fb4f0'], [1, '#d8f0ff']]); g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(1500, 220, 60, 0, 7); g.fill(); glow(g, 1500, 220, 500, WARM, 0.35);
  for (let x = -400; x < 2400; x += 200) { g.fillStyle = '#5aa05a'; g.beginPath(); g.arc(x, 560, 110, 0, 7); g.fill(); ln(g, [x, 560, x, 700], 18, '#6a4430'); g.fillStyle = '#4a904a'; g.beginPath(); g.arc(x + 60, 520, 80, 0, 7); g.fill(); }
  g.fillStyle = '#7cc46a'; g.fillRect(-500, 680, 3000, 900); g.fillStyle = '#e8d4a8'; g.beginPath(); g.moveTo(-500, 820); g.quadraticCurveTo(960, 780, 2500, 820); g.lineTo(2500, 920); g.quadraticCurveTo(960, 880, -500, 920); g.fill();
  const hx = lerp(500, 1400, go);
  walker(g, hx, 870, 1.05, 1, t * 10, { face: { smile: 0.95 } }, 1.5); floorShadow(g, hx, 872, 90);
  walker(g, hx + 170, 870, 1.05, 1, t * 10 + 1, { ...DANNY, face: { smile: 0.95, look: [-0.6, 0] } }, 1.5); floorShadow(g, hx + 170, 872, 90);
  daysHud(g, 90);
  caption(g, 'And he finally moved on *too*.', capA(t, a + 0.5, b - 0.3), ACC);
}
s2.fin = 0.4; s2.fout = 0.5;
// THE LESSON
const s3 = card('Let go to *grow*.', 0.4, 2.0, 104);
defineClip(134, T, [s1, s2, s3]);
})();
