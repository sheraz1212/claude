// CLIP 4 (1:36-2:08) - the tiny decision: it goes in the bin, and he tells the truth.
(() => {
const T = [96, 101.5, 107, 112, 117, 122.5, 128];
sfx(96.2, 'cloth-rustle'); sfx(99.4, 'low-thud', 0.9); sfx(102, 'pop-8bit-1'); sfx(104.4, 'pop-8bit-2'); sfx(107.4, 'pen-write', 0.8); sfx(109.6, 'pen-write', 0.8);
sfx(112.6, 'pop-8bit-3'); sfx(115, 'celesta-sparkle', 0.7); sfx(117.2, 'demon-8bit-3', 0.6); sfx(117.7, 'whisper-justone', 0.8); sfx(117.05, 'count-tick'); sfx(122.6, 'run-steps', 0.5); sfx(124, 'breath-heavy', 0.6);

// INSERT (the object he used against himself): his fist opens over the bin. The glow goes out.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), open = es(t, 98.2, 98.9), fallU = seg(t, 98.8, 99.5);
  noCam(g); g.fillStyle = '#100f15'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  glow(g, 960, 200, 700, COLD, 0.12);
  // the bin's dark mouth
  rr(g, 520, 760, 880, 500, 30); g.fillStyle = '#1b1b25'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke(); g.beginPath(); g.ellipse(960, 790, 400, 60, 0, 0, 7); g.fillStyle = '#050508'; g.fill(); g.stroke();
  const gy = lerp(470, 800, fallU * fallU), ga = 1 - seg(t, 99.3, 99.6);
  if (open > 0.4 && ga > 0) mintGlow(g, 960, gy, 1.6 * ga);
  g.lineCap = 'round';
  for (const dark of [true, false]) { g.strokeStyle = g.fillStyle = dark ? C.line : C.cream; g.lineWidth = 190 + (dark ? 12 : 0); g.beginPath(); g.moveTo(-200, 200); g.lineTo(700, 400); g.stroke(); g.beginPath(); g.ellipse(900, 440, 170 + (dark ? 6 : 0), 140 + (dark ? 6 : 0), 0.15, 0, 7); g.fill(); }
  if (open < 0.6) { glow(g, 950, 470, 230 * (1 - open), MINT, 0.5); glow(g, 950, 540, 60, '220,255,240', 0.7 * (1 - open)); }
  for (let i = 0; i < 3; i++) { g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 6; g.beginPath(); g.ellipse(830 + i * 80, 540 + open * 60, 44, 70, -0.1 + open * 0.5, 0, 7); g.fill(); g.stroke(); }
  caption(g, 'He threw it *away*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// MEDIUM (the alley): he gets down to Eli's height. A promise both ways.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(620, 610, u), z: lerp(1.6, 1.7, u) });
  alley(g, t);
  const e = person(g, { x: 1100, y: 796, s: 0.8, ...ELI, face: { look: [-0.7, 0], smile: lerp(-0.2, 0.6, es(t, 106, 106.8)), sad: 0.4 * (1 - es(t, 106, 106.8)) } });
  floorShadow(g, 860, 800, 90);
  const hero = actor(g, { x: 860, y: 668, hip: true, thigh: 20, s: HS, view: 'side', dir: 1, legL: [1.45, -2.7], legR: [0.3, 1.1], handR: [1040, 600], face: { sad: 0.7, smile: lerp(-0.3, 0.3, es(t, 106, 106.8)) } }, { dir: 1, amt: 0.3, dim: 0.06 });
  cloud(g, 820, 280, 150, t, 1, 5);
  headText(g, 'never copy that.', hero.head[0] - 30, hero.head[1] - 112, t, 102, 104.2);
  headText(g, 'then you stop too.', e.head[0] + 40, e.head[1] - 92, t, 104.4, 106.8);
  caption(g, 'Eli made him *promise*.', capA(t, a + 0.6, b - 0.1), ACC);
}
function s3(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'Someone small is *watching*.', seg(t, a + 0.4, a + 2.0), ACC, fo, 88, -70);
  blackLine(g, 'Be worth *copying*.', seg(t, a + 2.6, a + 3.9), ACC, fo, 88, 70);
}
s3.black = true;
// MEDIUM (the kitchen): he tells his mom. Eli sticks a rocket sticker on him (the token).


function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), st = t > 115;
  setCam(g, { x: 970, y: lerp(580, 570, u), z: lerp(1.3, 1.38, u) });
  kitchen(g, t);
  const hug = es(t, 114, 115);
  const eli = person(g, { x: 1330, y: 744, hip: true, thigh: 20, s: 0.8, ...ELI, handL: st || t < 114.4 ? null : [1240, 668], bendL: -1, face: { look: [-0.7, 0], smile: 0.8 } });
  const mom = person(g, { x: 960, y: 740, hip: true, thigh: 20, s: 1.1, ...MOM, handR: hug > 0 ? [lerp(1010, 1110, hug), lerp(700, 596, hug)] : null, bendR: 1, face: { look: [0.7, 0], sad: 0.7 * (1 - hug), smile: lerp(-0.2, 0.5, hug) } });
  cloud(g, 1180, 400, 96, t, 1, 6);
  const hero = actor(g, { x: 1180, y: 740, hip: true, thigh: 20, s: HS, headOff: [0, 8 * (1 - hug)], face: { look: [-0.6, 0.4 * (1 - hug)], sad: 0.9 * (1 - hug * 0.6), smile: lerp(-0.4, 0.2, hug) } }, { dir: -1, amt: 0.2, dim: 0.04 });
  if (st) sticker(g, hero, HS);
  kitchenTable(g);
  headText(g, 'mom. i need help.', hero.head[0] + 40, hero.head[1] - 112, t, 112.6, 114.8);
  hud(g, 'DAYS WITHOUT', 1);
  caption(g, 'He told his mom the *truth*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// THE REPEATED SHOT without the glow: day three, hands empty.
const s5 = (g, t, a, b) => { const r = alleyRep(g, t, a, b, { label: 'DAYS WITHOUT', n: 3, r: 190, k: 1.5, dx: 540, text: 'just one.', cap: 'Day three was the *worst*.', noGlow: 1, noPuff: 1, crack: 0.2, bags: 0.7, slump: 0.6, pose: { handL: [790, 560 + Math.sin(t * 26) * 4], handR: [852, 560 - Math.sin(t * 26) * 4], bendL: -1, bendR: 1 } }); sticker(g, r, HS); };
// WIDE (the stairs again): slower than the others, but he doesn't stop.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 1000, u), y: lerp(560, 520, u), z: 1.05 });
  stairs(g, t);
  [[520, 70, { col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52' }], [100, 80, { col: '#a3927e', acc: 'longhair' }], [-200, 66, { col: '#b0a08c', acc: 'scarf' }]].forEach(([x0, v, o], i) => { const x = x0 + (t - a) * v; climber(g, x, 0.9, x / 24 + i, o); });
  const hx = 640 + (t - a) * 44, fy = stairY(Math.floor((hx - 300) / 110) * 110 + 300);
  cloud(g, hx + 20, fy - 560, 120, t, 1, 7);
  const w = climber(g, hx, HS, hx / 30, { armLines: true, lean: 0.12, face: { sad: 0.5, smile: -0.1 } }); sticker(g, w, HS);
  hud(g, 'DAYS WITHOUT', 9);
  caption(g, 'His breath came back *slowly*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6]);
})();
