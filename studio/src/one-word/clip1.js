// CLIP 1 (0:00-0:32) - one goal, one word.
(() => {
const T = [0, 4.5, 11, 16.5, 21.5, 27, 32];
sfx(0.5, 'pen-write'); sfx(4.6, 'crowd'); sfx(6.6, 'kick'); sfx(7.5, 'net'); sfx(7.7, 'crowd-groan'); sfx(11, 'crowd', 0.5); sfx(11.6, 'whistle'); sfx(12.2, 'pop-8bit-1'); sfx(13.6, 'low-thud', 1.2); sfx(13.6, 'piano-low-hit');
sfx(16.5, 'locker-amb'); sfx(19.3, 'locker-clang'); sfx(21.5, 'night-amb'); sfx(23, 'demon-8bit-1'); sfx(23.6, 'whisper-useless'); sfx(23.6, 'count-tick'); sfx(24.6, 'pop-8bit-2'); sfx(27, 'car-hum'); sfx(27.8, 'pop-8bit-3'); sfx(29.6, 'pop-8bit-1');

const s1 = card('It was only one *word*.', 0.5, 2.6);
// WIDE (the place, mirrored at the end): the goal. The shot comes. He is late.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1100, u), y: lerp(570, 560, u), z: lerp(1, 1.1, u) });
  pitch(g, t);
  for (const [x, o] of [[980, { col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }], [1150, { ...LEO }]]) person(g, { x, y: 812, s: 0.95, view: 'side', dir: -1, ...o, armL: t > 7.6 ? [2.6, 0.9] : null, armR: t > 7.6 ? [2.5, 0.9] : null, face: { sad: t > 7.6 ? 0.8 : 0, smile: t > 7.6 ? -0.4 : 0.2 }, armLines: false });
  const run = seg(t, 5, 6.5), kx = lerp(420, 720, ease(run)), kick = kf(t, [[6.3, 0], [6.6, 1], [7.1, 0]]);
  if (run < 1) walker(g, kx, 822, 1.0, 1, kx / 22, { col: '#7f7a88', acc: 'glasses' }, 1.5); else person(g, { x: 720, y: 822, s: 1.0, view: 'side', dir: 1, col: '#7f7a88', acc: 'glasses', legR: [1.1 * kick, -0.2], armL: [-0.6 * kick, 0.3], armLines: false, face: { smile: 0.6 } });
  const fl = seg(t, 6.6, 7.5); let bx = 760, by = 800;
  if (t >= 6.6 && t < 7.5) { bx = lerp(760, 1650, fl); by = lerp(800, 520, fl) - Math.sin(Math.PI * fl) * 60; } else if (t >= 7.5) { const k = seg(t, 7.5, 8.6); bx = 1650 + k * 30; by = lerp(520, 786, k * k); }
  const dive = kf(t, [[7.25, 0], [7.7, 1], [8.3, 0]]), down = es(t, 8.6, 9.6);
  floorShadow(g, 1470, 804, 90);
  const r = actor(g, { x: 1470, y: 800 - dive * 70, s: HS, view: 'side', dir: -1, lean: -0.25 * dive, armL: [2.5 * dive + 0.1, 0.2], armR: [2.3 * dive + 0.1, 0.2], headOff: [0, 14 * down], face: { look: [0, -0.4 * dive + 0.7 * down], sad: 0.9 * down, smile: -0.4 * down } }, { dir: -1, amt: 0.25, dim: 0.04 });
  gloves(g, r, HS); ball(g, bx, by, 22); goal(g);
  caption(g, "He was the team's *keeper*.", capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.5;
// MEDIUM (the word hits): the coach says it once. It sticks.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), hit = 13.6, after = Math.max(0, t - hit), sunk = es(t, hit, hit + 0.8);
  setCam(g, { x: 900 + (after > 0 && after < 0.4 ? Math.sin(after * 80) * 12 * (1 - after / 0.4) : 0), y: lerp(640, 630, u), z: lerp(1.4, 1.5, u) });
  pitch(g, t);
  const pt = kf(t, [[11.8, 0.2], [12.3, 1.5], [14.5, 1.4], [15.5, 0.3]]);
  const coach = person(g, { x: 640, y: 860, s: 1.25, view: 'side', dir: 1, ...COACH, armR: [pt, 0.1], face: { sad: -0.9, smile: -0.6 } });
  g.fillStyle = '#d9d9e0'; g.beginPath(); g.arc(coach.neck[0] + 26, coach.neck[1] + 60, 9, 0, 7); g.fill();
  floorShadow(g, 1160, 864, 90);
  const hero = actor(g, { x: 1160, y: 860, s: HS, view: 'side', dir: -1, lean: -0.1 * sunk, headOff: [0, 6 + 14 * sunk], face: { look: [0, 0.5 + 0.4 * sunk], sad: 0.6 + 0.5 * sunk, smile: -0.4, wide: after > 0 && after < 0.5 ? 1.3 : 1 } }, { dir: -1, amt: 0.25, dim: 0.05 });
  gloves(g, hero, HS);
  const fly = seg(t, 12.6, hit);
  if (fly > 0 && fly < 1) word(g, lerp(760, hero.neck[0], ease(fly)), lerp(540, hero.neck[1] + 80, ease(fly)), lerp(60, 150, Math.sin(Math.PI * fly)) + 40, -0.1, 1);
  if (after > 0) { chestWord(g, hero, HS * (1 + 0.6 * (1 - seg(after, 0, 0.4)))); counters(g, 0, seg(after, 0.2, 0.8)); }
  if (after > 0 && after < 0.3) { noCam(g); g.fillStyle = `rgba(${PUR},${0.4 * (1 - after / 0.3)})`; g.fillRect(0, 0, W, H); setCam(g, CAM); }
  headText(g, 'useless.', coach.head[0] + 60, coach.head[1] - 120, t, 12.2, 14.2);
  caption(g, 'His coach said one *word*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// THE REPEATED SHOT, first time: the locker-room bench. The gloves go in the locker.
function s4(g, t, a, b) {
  const th = seg(t, 18.6, 19.3);
  benchRep(g, t, a, b, { n: 0, cap: 'The word followed him *inside*.', slump: 1, others: () => {
    for (const [x0, o] of [[700, { col: '#8d8d9b', acc: 'cap', accCol: '#3b4a63' }], [300, { ...LEO }]]) { const x = x0 + (t - a) * 200; walker(g, x, 842, 1.0, 1, x / 30, o); }
    g.fillStyle = '#0a0a0e'; g.fillRect(1124, 170, 140, 560); g.strokeStyle = LINE; g.strokeRect(1124, 170, 140, 560);
    if (th <= 0) glovePair(g, 1040, 722); else glovePair(g, lerp(1040, 1194, th), lerp(722, 640, th) - Math.sin(Math.PI * th) * 120);
  }, pose: th > 0 && th < 1 ? { armR: [1.6, 0.3] } : {} });
}
// CLOSE (that night): the voice repeats it - and then he says it himself.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 400, 200, 700, COLD, 0.12);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  const d = demon(g, { x: 1500, y: 1500, s: 2.9, lean: -0.1, face: { look: [-0.8, 0.3], smile: 0.8 } }, { t, a: es(t, 23, 23.8) * 0.9, glow: 28 });
  demonText(g, 'useless.', 1490, 300, t, Math.min(seg(t, 23.6, 23.9), 1 - seg(t, 26.4, 26.8)), 90);
  const r = actor(g, { x: 860, y: 1300, s: 2.4, headOff: [0, 8], face: { look: [0, 0.7], sad: 1, smile: -0.5, blink: (t > 25.4 && t < 25.55) ? 1 : 0.2 } }, { dir: -1, amt: 0.3, dim: 0.1 });
  chestWord(g, r, 2.4 * (1 + 0.05 * Math.sin(t * 5)));
  headText(g, 'useless...', r.head[0] - 60, r.head[1] - 190, t, 24.6, 26.6);
  counters(g, t < 23.6 ? 0 : (t < 24.6 ? 1 : 2));
  caption(g, 'That night, he said it *too*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM (dad's car): he tells his dad nothing.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(560, 550, u), z: lerp(1.02, 1.1, u) });
  car(g, t);
  const dad = person(g, { x: 1260, y: 800, hip: true, thigh: 20, s: 1.2, ...DAD, handL: [1180, 760], handR: [1340, 760], bendL: -1, bendR: 1, face: { look: [-0.6 * es(t, 27.6, 28.2) * (1 - es(t, 29.6, 30.2)), 0], smile: 0.4 } });
  const hero = actor(g, { x: 660, y: 800, hip: true, thigh: 20, s: HS, headOff: [-8, 10], face: { look: [-0.7, 0.5], sad: 0.9, smile: -0.4 } }, { dir: 0, amt: 0.2, dim: 0.12 });
  chestWord(g, hero, HS); dash(g);
  headText(g, 'good game?', dad.head[0] - 30, dad.head[1] - 116, t, 27.8, 29.5);
  headText(g, 'fine.', hero.head[0] + 20, hero.head[1] - 116, t, 29.6, 31.2);
  counters(g, said(t, [[27, 2], [32, 5]]));
  caption(g, 'He told his dad *nothing*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
