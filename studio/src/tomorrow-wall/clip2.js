// CLIP 2 (0:30-1:02) - one summer earlier: Sam, the ball, the first "tomorrow".
(() => {
const T = [30, 33.5, 40, 45.5, 52, 57, 62];
sfx(30.5, 'pen-write', 0.8); sfx(33.5, 'court-amb'); sfx(34.5, 'whoosh-soft'); sfx(35.4, 'net-swish'); sfx(35.95, 'ball-bounce'); sfx(36.4, 'ball-bounce', 0.5);
sfx(36.4, 'pop-8bit-1'); sfx(38.3, 'pop-8bit-2'); sfx(40.5, 'pop-8bit-3'); sfx(42.55, 'ball-catch');
sfx(46.58, 'ball-bounce'); sfx(47.14, 'ball-bounce', 0.6); sfx(47.7, 'ball-bounce', 0.35); sfx(47.2, 'pop-8bit-1'); sfx(48.5, 'demon-8bit-1'); sfx(49.2, 'whisper-tomorrow');
sfx(52.5, 'pen-write', 0.9); sfx(57.3, 'bed-flop'); sfx(58.6, 'msg-tick');

const s1 = card('One summer *earlier*.', 0.5, 2.3);

// WIDE (the place): the court at dusk. Sam scores, they plan the next game.
function s2(g, t) {
  const u = ease(seg(t, T[1], T[2]));
  setCam(g, { x: lerp(940, 1000, u), y: 545, z: lerp(1, 1.06, u) });
  court(g, t, { behind: () => { const wx = 1900 - (t - T[1]) * 60; walker(g, wx, 702, 0.7, -1, wx / 34, { col: '#6f6c78', acc: 'scarf' }); } });
  benchPeople(g, t, true);
  const up = kf(t, [[33.9, 0.5], [34.5, 2.75], [35.3, 2.6], [36.0, 0.4]]), turned = t > 36.15;
  floorShadow(g, 1150, 800, 80); floorShadow(g, 850, 800, 80);
  const jump = Math.sin(Math.PI * seg(t, 34.25, 34.85)) * 46;
  const sam = person(g, { x: 1150, y: 800 - jump, s: 1, view: 'side', dir: turned ? -1 : 1, ...SAM, armL: [up, -0.25], armR: [up * 0.92, -0.25], face: { smile: turned ? 0.8 : 0.3, look: [0, turned ? 0 : -0.5] } });
  const cheer = kf(t, [[35.4, 0.1], [35.8, 2.7], [36.6, 2.5], [37.2, 0.1]]);
  const hero = actor(g, { x: 850, y: 800 - Math.sin(Math.PI * seg(t, 35.5, 35.95)) * 26, s: 1, view: 'side', dir: 1, armL: [cheer, -0.2], armR: [cheer * 0.9, -0.2], face: { smile: 0.75, look: [0, -0.3], blink: (t > 37.6 && t < 37.75) ? 1 : 0 } }, { dir: -1, amt: 0.3, dim: 0.06 });
  // the shot
  let bx, by;
  if (t < 34.5) { bx = sam.handR[0] + 6; by = sam.handR[1] - 26; }
  else if (t < 35.4) { const k = seg(t, 34.5, 35.4); bx = lerp(1196, HOOP[0], k); by = lerp(430, HOOP[1] - 14, k) - Math.sin(Math.PI * k) * 190; }
  else { const k = seg(t, 35.4, 37.2); bx = HOOP[0] - k * 110; by = 776 - Math.abs(Math.cos(k * Math.PI * 2.5 + 0.0)) * (1 - k) * (776 - HOOP[1]) * (k < 0.2 ? 1 : 0.35); if (k < 0.2) by = lerp(HOOP[1], 776, (k / 0.2) ** 2); }
  ball(g, bx, by, 28);
  headText(g, 'same time friday?', sam.head[0], sam.head[1] - 100, t, 36.4, 38.2);
  headText(g, 'always.', hero.head[0], hero.head[1] - 100, t, 38.3, 39.85);
  caption(g, 'Sam was his best *friend*.', capA(t, T[1] + 0.5, T[2] - 0.1), ACC);
}
s2.fin = 0.4;

// MEDIUM two-shot (the bond): Sam hands him the ball.
function s3(g, t) {
  const u = ease(seg(t, T[2], T[3]));
  setCam(g, { x: 1000, y: lerp(560, 550, u), z: lerp(1.62, 1.72, u) });
  court(g, t); 
  const k = es(t, 42.0, 42.6), bx = lerp(1050, 950, k), by = 596 - Math.sin(Math.PI * k) * 40;
  floorShadow(g, 1130, 800, 80); floorShadow(g, 870, 800, 80);
  const sam = person(g, { x: 1130, y: 800, s: 1, view: 'side', dir: -1, ...SAM, handL: k < 0.2 ? [bx + 24, by + 8] : null, handR: k < 0.2 ? [bx + 30, by - 6] : null, armL: [0.5 * (1 - k) + 0.1, 0.2], armR: [0.4 * (1 - k), 0.2], face: { smile: 0.8, blink: (t > 43.6 && t < 43.74) ? 1 : 0 } });
  const hero = actor(g, { x: 870, y: 800, s: 1, view: 'side', dir: 1, handL: [bx - 24, by + 10], handR: [bx - 30, by - 6], face: { smile: 0.5 + 0.4 * k, look: [0, 0.3 * k] } }, { dir: -1, amt: 0.3, dim: 0.06 });
  ball(g, bx, by, 34);
  headText(g, 'keep it till friday.', sam.head[0] + 40, sam.head[1] - 100, t, 40.5, 42.7);
  caption(g, 'Sam lent him his *ball*.', capA(t, 42.3, T[3] - 0.1), ACC);
}

// WIDE (his room, still clean): the ball drops, the laundry waits, a small voice shows up.
function s4(g, t) {
  const u = ease(seg(t, T[3], T[4]));
  setCam(g, { x: lerp(900, 930, u), y: 540, z: lerp(1, 1.05, u) });
  room(g, t, { n: 0, win: 'dusk', lamp: 1, laundry: 0.67, ball: false });
  const k = seg(t, 46.3, 47.7), held = t < 46.3;
  const lookL = es(t, 46.9, 47.3) * (1 - es(t, 48.9, 49.3)), lookR = es(t, 48.9, 49.3);
  const dA = es(t, 48.5, 49.0);
  if (dA > 0) {
    const d = demon(g, { x: 1010, y: 800, s: 0.96, face: { look: [-0.6, 0.1] }, armL: [0.2, -0.2] }, { t, a: dA });
    demonText(g, 'tomorrow.', d.head[0] + 170, d.head[1] - 50, t, Math.min(seg(t, 49.2, 49.5), 1 - seg(t, 51.6, 51.95)), 70);
  }
  floorShadow(g, 760, 800, 90);
  const hero = actor(g, { x: 760, y: 800, s: 1.2, handR: held ? [840, 690] : null, face: { look: [lookR * 0.7 - lookL * 0.8, lookL * 0.3], smile: lerp(0.1, 0.6, es(t, 50.3, 51)), sad: lookL * 0.4 } }, { dir: 1, amt: 0.3, dim: 0.05 });
  const bx = held ? 846 : lerp(846, 520, k), by = held ? 712 : 756 - 44 * (1 - k) ** 2 * Math.abs(Math.cos(k * Math.PI * 2.5));
  floorShadow(g, bx, 800, 60, 0.35); ball(g, bx, by, 44);
  headText(g, 'laundry...', hero.head[0], hero.head[1] - 110, t, 47.2, 48.7);
  caption(g, 'A small voice said *tomorrow*.', capA(t, 49.3, T[4] - 0.1), ACC);
}

// INSERT (the habit is born): he writes it down.
const s5 = (g, t, a, b) => writeInsert(g, t, a, b, { lines: [['laundry', 110, -110], ['tomorrow', 150, 40]], w: [[0.12, 0.34], [0.4, 0.74]], cap: 'So he wrote it *down*.' });

// MEDIUM (the reward): first note on the wall, phone in his hands. It felt good.
function s6(g, t) {
  const u = ease(seg(t, T[5], T[6]));
  setCam(g, { x: lerp(1360, 1380, u), y: 545, z: lerp(1.45, 1.55, u) });
  room(g, t, { n: 1, win: 'night', lamp: 1, laundry: 0.67, ballNote: false, phone: false });
  demon(g, { x: 1090, y: 800, s: 0.96, face: { look: [0.7, 0.1], smile: 0.8 }, headTilt: Math.sin(t * 1.2) * 0.05 }, { t });
  const r = heroSit(g, t, { handL: [1402, 610], handR: [1440, 610], bendL: -1, bendR: 1, headOff: [0, 8], face: { look: [0, 0.85], smile: 0.85, blink: (t > 59.5 && t < 59.65) ? 1 : 0.15 }, light: { dir: -1, amt: 0.25, dim: 0.03 } });
  g.save(); const pg = g.createRadialGradient(1421, 590, 2, 1421, 590, 100); pg.addColorStop(0, 'rgba(170,200,255,0.35)'); pg.addColorStop(1, 'rgba(170,200,255,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = pg; g.fillRect(1320, 490, 200, 200); g.restore();
  rr(g, 1401, 566, 40, 62, 7); g.fillStyle = '#0a0a0e'; g.fill(); g.strokeStyle = '#9aa'; g.lineWidth = 2; g.stroke();
  caption(g, 'It felt *good*.', capA(t, T[5] + 0.6, T[6] - 0.1), ACC);
}
defineClip(30, T, [s1, s2, s3, s4, s5, s6]);
})();
