// CLIP 6 (2:40-3:10) - the gloves stay, the word doesn't; the mirrored goal; the lesson.
(() => {
const T = [160, 165.5, 171, 177.5, 183.5, 190];
sfx(160, 'locker-amb'); sfx(162.6, 'locker-clang', 0.6); sfx(165.5, 'car-hum'); sfx(171, 'crowd'); sfx(173.1, 'kick'); sfx(173.9, 'ball-catch'); sfx(174, 'crowd-cheer'); sfx(177.5, 'crowd-cheer', 0.7); sfx(178.2, 'pop-8bit-1'); sfx(180.4, 'pop-8bit-3'); sfx(183.6, 'pen-write', 0.9);

function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), put = kf(t, [[161.2, 0], [162.2, 1], [162.9, 1], [163.8, 0]]), done = t > 162.6;
  setCam(g, { x: lerp(1000, 1060, u), y: 540, z: lerp(1.05, 1.14, u) });
  lockers(g, t, { open: 7, warm: true });
  if (done) glovePair(g, 1194, 600);
  bench(g); floorShadow(g, 1050, 842, 90);
  const r = actor(g, { x: 1050, y: 842, s: HS, view: 'side', dir: 1, handR: put > 0.02 ? [lerp(1100, 1180, put), lerp(720, 610, put)] : null, face: { smile: 0.6 } }, { dir: 1, amt: 0.2, dim: 0.02 });
  if (!done) gloves(g, r, HS);
  caption(g, 'He kept the gloves. Not the *word*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), lf = Math.sin(t * 9) * 0.03;
  setCam(g, { x: 960, y: lerp(560, 550, u), z: lerp(1.02, 1.1, u) });
  car(g, t);
  person(g, { x: 1260, y: 800 + lf * 50, hip: true, thigh: 20, s: 1.2, ...DAD, handL: [1180, 760], handR: [1340, 760], bendL: -1, bendR: 1, headTilt: lf * 2, face: { look: [-0.6, 0], smile: 0.95 } });
  const tk = Math.sin(t * 3) * 0.25;
  actor(g, { x: 660, y: 800 - lf * 50, hip: true, thigh: 20, s: HS, armR: [1.6 + tk, 1.0], armL: [1.4 - tk, 1.1], headTilt: -lf * 2, face: { look: [0.7, 0], smile: 0.95 } }, { dir: 0, amt: 0.15, dim: 0.02 });
  dash(g);
  g.strokeStyle = '#3b6a8a'; g.lineWidth = 8; g.beginPath(); g.moveTo(930, 770); g.lineTo(960, 820); g.lineTo(990, 770); g.stroke(); g.fillStyle = '#e8c15a'; g.strokeStyle = '#1b1a20'; g.lineWidth = 3; g.beginPath(); g.arc(960, 842, 26, 0, 7); g.fill(); g.stroke();
  caption(g, 'And he told his dad *everything*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE - THE MIRROR OF THE FIRST SCENE: the same goal, the same shot. This time he gets there.
const s3 = (g, t, a, b) => training(g, t, a, b, { shots: [[173.1, 1]], shooter: { col: '#7f7a88', acc: 'glasses' }, cheer: tt => es(tt, 173.9, 174.4), n: null, cap: "He was the team's *keeper* again." });
s3.fin = 0.4;
// MEDIUM (the last line answers the first word).
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 900, y: lerp(640, 630, u), z: lerp(1.4, 1.5, u) });
  pitch(g, t, { cheer: 1 });
  const cl = Math.sin(t * 10) * 0.15;
  const coach = person(g, { x: 620, y: 860, s: 1.25, view: 'side', dir: 1, ...COACH, armL: [1.0 + cl, 1.2], armR: [1.0 - cl, 1.2], face: { smile: 0.9 } });
  g.fillStyle = '#d9d9e0'; g.beginPath(); g.arc(coach.neck[0] + 26, coach.neck[1] + 60, 9, 0, 7); g.fill();
  person(g, { x: 1330, y: 862, s: 1.05, view: 'side', dir: -1, ...LEO, armL: [2.7, 0.3 + cl], armR: [2.6, 0.3 - cl], face: { smile: 0.95 } });
  floorShadow(g, 1100, 864, 90);
  const hero = actor(g, { x: 1100, y: 860, s: HS, view: 'side', dir: -1, handL: [1040, 700], handR: [1052, 676], face: { smile: 0.85, look: [0, 0.1], blink: (t > 181 && t < 181.14) ? 1 : 0 } }, { dir: -1, amt: 0.2, dim: 0.02 });
  ball(g, 1040, 690, 24); gloves(g, hero, HS);
  headText(g, "that's my keeper.", coach.head[0] + 60, coach.head[1] - 120, t, 178.2, 180.2);
  headText(g, 'i know.', hero.head[0] + 20, hero.head[1] - 116, t, 180.4, 182.6);
  caption(g, 'This time, the words were *his*.', capA(t, a + 0.7, b - 0.1), ACC);
}
s4.fout = 0.6;
const s5 = (g, t, a, b) => blackLine(g, 'Stop repeating their *words*.', seg(t, a + 0.6, a + 2.8), ACC, 1 - seg(t, b - 1.2, b - 0.2), 100);
s5.black = true;
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
