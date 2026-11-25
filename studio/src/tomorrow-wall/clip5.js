// CLIP 5 (2:06-2:38) - one tiny decision, then the fight (with one relapse).
(() => {
const T = [126, 131, 137, 139.5, 142, 147, 152, 158];
const NR = pickN(31);
sfx(126.6, 'pen-write', 0.9); sfx(130.2, 'celesta-sparkle');
for (let i = 0; i < 16; i++) sfx(131.4 + i * 0.33, 'paper-rip', 0.7 + (i % 3) * 0.15);
sfx(132.5, 'demon-8bit-2', 0.6); sfx(134.6, 'cymbal-swell');
sfx(137, 'washer-hum'); sfx(139.6, 'call-connect'); sfx(140.3, 'pop-8bit-2');
repSfx(142, 1, 2.6); sfx(147.9, 'cloth-rustle'); sfx(148.9, 'paper-peel', 0.8); sfx(150.2, 'ball-catch');
sfx(152.4, 'whisper-tomorrow', 0.6); sfx(153.5, 'whoosh-soft', 1.4); sfx(154.3, 'shatter'); sfx(154.3, 'timpani-boom'); sfx(154.32, 'cymbal-crash'); sfx(155.3, 'ball-bounce', 0.7); sfx(155.9, 'ball-bounce', 0.4);

// INSERT (the tiny decision): on the back of the note he writes one new word.
const s1 = (g, t, a, b) => writeInsert(g, t, a, b, { pale: true, lines: [['today', 230, 0]], w: [[0.14, 0.6]], cap: 'He wrote one new *word*.' });
// WIDE (the fight): he tears the wall down. Light comes back.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), n = Math.round(kf(t, [[131.3, 97], [136.7, 52]]));
  setCam(g, { x: lerp(980, 940, u), y: 535, z: lerp(1.04, 1, u) });
  room(g, t, { n, win: 'warm', laundry: 1, floorNotes: true });
  const dS = lerp(1.8, 1.15, u);
  const d = demon(g, { x: 400, y: 820, s: 1.2 * dS, lean: -0.08, armL: [0.8, 0.4], armR: [0.9, 0.5], face: { look: [0.6, 0], sad: 0.3, smile: -0.5 }, headOff: [Math.sin(t * 20) * 2, 0] }, { t, crack: u * 0.6 });
  demonText(g, 'wait... tomorrow!', d.head[0] + 250, d.head[1] - 30, t, Math.min(seg(t, 132.5, 132.8), 1 - seg(t, 134.6, 135)), 62);
  const hx = lerp(820, 1120, seg(t, 131, 136.8)), sw = Math.sin(t * 9.5);
  floorShadow(g, hx, 800, 90);
  actor(g, { x: hx, y: 800 - Math.abs(sw) * 10, s: 1.2, view: 'back', handR: [hx + 96, 400 + 110 * sw], handL: [hx - 96, 400 - 110 * sw], bendR: 1, bendL: -1 }, { dir: 0, amt: 0.2, dim: 0.02 });
  for (let i = 0; i < 44; i++) {            // notes flying off
    const born = 131.35 + i * 0.12, age = t - born; if (age < 0 || age > 2.2) continue;
    const nt = noteAt(96 - i), r = rng(i + 7), vx = (r() - 0.5) * 500, x = nt.cx + vx * age, y = nt.cy - 120 * age + 420 * age * age;
    g.save(); g.translate(x, y); g.rotate(nt.rot + age * (r() - 0.5) * 9); g.scale(1, Math.cos(age * 6 + i)); g.globalAlpha = 1 - seg(age, 1.6, 2.2); g.fillStyle = `hsl(45,66%,${30 + r() * 12}%)`; g.fillRect(-52, -52, 104, 104); g.restore();
  }
  hud(g, 'NOTES', n);
  caption(g, 'One note. Then *another*.', capA(t, a + 0.8, b - 0.1), ACC);
}
// ONE-OFF PLACE (laundry room): the things he put off, done today.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1040, u), y: 540, z: 1.08 });
  g.fillStyle = '#15141c'; g.fillRect(-300, -200, 2600, 1000); g.fillStyle = '#0d0c12'; g.fillRect(-300, 790, 2600, 500);
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-300, 790); g.lineTo(2300, 790); g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter'; let gr = g.createRadialGradient(1000, 140, 10, 1000, 140, 800); gr.addColorStop(0, 'rgba(255,190,110,0.3)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(0, -200, 2000, 1200); g.restore();
  g.strokeStyle = LINE; g.beginPath(); g.moveTo(1000, -100); g.lineTo(1000, 110); g.moveTo(950, 150); g.lineTo(970, 110); g.lineTo(1030, 110); g.lineTo(1050, 150); g.closePath(); g.stroke();
  [900, 1160, 1420].forEach((x, i) => {
    rr(g, x, 480, 236, 310, 12); g.fillStyle = '#1b1b25'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
    g.beginPath(); g.moveTo(x, 536); g.lineTo(x + 236, 536); g.stroke(); g.beginPath(); g.arc(x + 196, 508, 9, 0, 7); g.stroke();
    g.beginPath(); g.arc(x + 118, 668, 84, 0, 7); g.fillStyle = i === 1 ? '#2a3550' : '#101016'; g.fill(); g.stroke();
    if (i === 1) { g.save(); g.beginPath(); g.arc(x + 118, 668, 80, 0, 7); g.clip(); for (let k = 0; k < 5; k++) { const an = t * 5 + k * 1.3; g.fillStyle = [C.cream, '#7f93c4', ACC, '#b9b3a2', '#c98d6a'][k]; g.beginPath(); g.ellipse(x + 118 + Math.cos(an) * 40, 668 + Math.sin(an) * 40, 36, 22, an, 0, 7); g.fill(); } g.restore(); g.beginPath(); g.arc(x + 118, 668, 84, 0, 7); g.stroke(); }
  });
  g.strokeStyle = LINE; g.lineWidth = 3; g.beginPath(); g.moveTo(1720, 640); g.lineTo(2050, 640); g.moveTo(1740, 640); g.lineTo(1740, 790); g.stroke();
  person(g, { x: 1850, y: 800, s: 1.05, col: '#a3927e', acc: 'longhair', handL: [1800, 630 + Math.sin(t * 3) * 8], handR: [1890, 630 - Math.sin(t * 3) * 8], bendL: -1, bendR: 1, face: { look: [0, 0.7], smile: 0.4 }, armLines: false });
  g.fillStyle = '#2a2a38'; g.strokeStyle = LINE; rr(g, 1790, 612, 110, 28, 8); g.fill(); g.stroke();
  floorShadow(g, 640, 800, 90);
  const r = actor(g, { x: 640, y: 800, s: 1.2, armR: [2.7, 0.2 + Math.sin(t * 8) * 0.12], face: { look: [0.6, 0], smile: 0.9 } }, { dir: 1, amt: 0.25, dim: 0.02 });
  chestNote(g, r, 1.2);
  caption(g, 'Laundry. *Today*.', capA(t, a + 0.3, b - 0.05), ACC);
}
// POV PHONE: he finally calls his mom.
function s4(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, n: 40, call: (g, px, py, pw, ph) => {
    const gr = g.createLinearGradient(0, py, 0, py + ph); gr.addColorStop(0, '#5a4030'); gr.addColorStop(1, '#2a1f1c'); g.fillStyle = gr; g.fillRect(px, py, pw, ph);
    g.save(); g.globalCompositeOperation = 'lighter'; const l = g.createRadialGradient(px + 300, py + 150, 10, px + 300, py + 150, 320); l.addColorStop(0, 'rgba(255,200,120,0.4)'); l.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = l; g.fillRect(px, py, pw, ph); g.restore();
    const wv = Math.sin(t * 9) * 0.25;
    person(g, { x: px + 200, y: py + 740, s: 1.3, col: '#c4ab94', acc: 'longhair', armL: [2.6 + wv, 0.3], face: { smile: 1, blink: (t > 140.9 && t < 141.05) ? 1 : 0 }, headTilt: 0.06 });
    g.fillStyle = '#fff'; g.font = '700 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 8; g.fillText('Mom', px + pw / 2, py + 56);
    g.font = '400 20px Nunito'; g.fillText('00:0' + Math.floor(1 + (t - a) * 1), px + pw / 2, py + 88); g.shadowBlur = 0;
    g.fillStyle = '#e5484d'; g.beginPath(); g.arc(px + pw / 2, py + ph - 76, 34, 0, 7); g.fill();
  } });
  headText(g, 'you called!', 950, 690, t, 140.3, 141.9);
  caption(g, 'He called his *mom*.', capA(t, a + 0.3, b - 0.05), ACC);
}
// THE REPEATED SHOT again - one relapse. The counter jumps back up.
const s5 = (g, t, a, b) => repShot(g, t, a, b, { n0: NR, win: 'night', lamp: 0.5, laundry: 0, dS: 1.3, crack: 0.4, dText: "you're tired. tomorrow.", cap: 'Some nights, the voice *won*.', tp: 2.6, slump: 1, dim: 0.14 });
// MEDIUM (the object, treasured): Sam's ball is still there. He picks it up.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(680, 700, u), y: lerp(610, 590, u), z: lerp(1.5, 1.6, u) });
  room(g, t, { n: 20, win: 'warm', ball: false, floorNotes: false });
  const d = demon(g, { x: 1090, y: 800, s: 1.15, face: { look: [-0.7, 0], sad: 0.4, smile: -0.4 } }, { t, crack: 0.7 });
  demonText(g, 'tomorrow?', d.head[0] + 20, d.head[1] - 110, t, Math.min(seg(t, 148.3, 148.6), 1 - seg(t, 150, 150.4)) * 0.8, 50);
  const reach = kf(t, [[147.7, 0], [148.7, 1], [150.0, 1], [151.0, 0]]), lift = es(t, 150.0, 151.0), peel = seg(t, 148.9, 150.2);
  const bx = lerp(520, 640, lift), by = lerp(756, 590, lift);
  floorShadow(g, 700, 800, 90);
  if (lift < 0.02) { floorShadow(g, 520, 800, 60, 0.35); ball(g, bx, by, 44, peel <= 0); }
  const r = actor(g, { x: 700, y: 800, s: 1.2, lean: -0.38 * reach * (1 - lift), headOff: [-10 * reach * (1 - lift), 0],
    handL: reach > 0.02 ? [lerp(600, peel > 0 && lift <= 0 ? 520 : bx - 40, reach), lerp(690, lift > 0 ? by + 6 : 742, reach)] : null, handR: lift > 0.02 ? [bx + 44, by + 8] : null, bendL: -1, bendR: 1,
    face: { look: [-0.6 * (1 - lift), 0.6], smile: lerp(-0.1, 0.7, lift), sad: 0.4 * (1 - lift) } }, { dir: 1, amt: 0.2, dim: 0.02 });
  chestNote(g, r, 1.2);
  if (lift >= 0.02) ball(g, bx, by, 44, false);
  if (peel > 0 && peel < 1) { g.save(); g.translate(532 - peel * 150, 742 + peel * peel * 90 - peel * 40); g.rotate(-0.15 - peel * 4); g.globalAlpha = 1 - seg(peel, 0.7, 1); g.fillStyle = 'hsl(45,64%,40%)'; g.fillRect(-27, -27, 54, 54); g.restore(); }
  hud(g, 'NOTES', 20);
  caption(g, "Sam's ball was still *there*.", capA(t, a + 0.7, b - 0.1), ACC);
}
// IMAGERY (he beats the word): the ball goes straight through TOMORROW.
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b)), hit = 154.3, after = Math.max(0, t - hit);
  noCam(g); g.fillStyle = '#050508'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960 + (t > hit && after < 0.4 ? Math.sin(after * 80) * 12 * (1 - after / 0.4) : 0), y: 540, z: lerp(1, 1.05, u) });
  g.save(); g.translate(960, 880); g.scale(1, 0.16); let gr = g.createRadialGradient(0, 0, 20, 0, 0, 900); gr.addColorStop(0, `rgba(255,200,130,${0.14 + 0.2 * es(t, hit, hit + 2)})`); gr.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = gr; g.fillRect(-900, -900, 1800, 1800); g.restore();
  const gone = es(t, hit, hit + 1.3);
  if (gone < 1) {
    const d = demon(g, { x: 1560 + gone * 60, y: 880, s: 1.62 * (1 - gone * 0.3), face: { sad: gone > 0 ? 1 : -0.9, smile: gone > 0 ? -0.8 : 0.5, look: [-0.7, 0] }, armL: [gone * 1.5, 0.3], armR: [gone * 1.5, 0.3] }, { t, crack: 0.8 + gone, a: 1 - gone });
    demonText(g, 'tomorrow... tomorrow...', d.head[0] - 40, d.head[1] - 130, t, Math.min(seg(t, 152.4, 152.7), 1 - seg(t, 153.8, 154.1)) * 0.8, 50);
  }
  // the word
  const word = 'TOMORROW'; g.save(); g.font = '250px "Caveat Brush"'; g.textAlign = 'left'; g.textBaseline = 'middle';
  let wsum = 0; const ws = [...word].map(c => g.measureText(c).width); const tot = ws.reduce((x, y) => x + y, 0);
  g.shadowColor = 'rgba(255,30,20,0.9)'; g.shadowBlur = 30; g.fillStyle = RED;
  const r = rng(77);
  [...word].forEach((c, i) => {
    const x0 = 1150 - tot / 2 + wsum + ws[i] / 2; wsum += ws[i];
    const vx = (x0 - 1100) * 1.6 + (r() - 0.5) * 300, vy = -300 - r() * 400, sp = (r() - 0.5) * 8;
    g.save(); g.translate(x0 + vx * after, 470 + vy * after + 900 * after * after + Math.sin(t * 3 + i) * 4 * (after > 0 ? 0 : 1)); g.rotate(sp * after); g.globalAlpha = 1 - seg(after, 0.7, 1.4);
    g.fillText(c, -ws[i] / 2, 0); g.restore();
  });
  g.restore();
  if (after > 0 && after < 0.25) { noCam(g); g.fillStyle = `rgba(255,235,200,${0.7 * (1 - after / 0.25)})`; g.fillRect(0, 0, W, H); setCam(g, CAM); }
  // hero + the throw
  const wind = kf(t, [[152.5, 0], [153.3, 1], [153.5, -1], [154.2, 0]]);
  floorShadow(g, 440, 880, 90);
  let bx, by;
  if (t < 153.5) { bx = 440 + (wind > 0 ? -70 * wind : 0) + 50; by = 620 - 60 * Math.max(0, wind); }
  else if (t < hit) { const k = seg(t, 153.5, hit); bx = lerp(520, 1150, k); by = lerp(560, 470, k) - Math.sin(Math.PI * k) * 60; }
  else { const k = seg(t, hit, hit + 2.2); bx = lerp(1150, 760, k); by = 836 - Math.abs(Math.cos(k * Math.PI * 2.5)) * (1 - k) ** 2 * 366; }
  const hero = actor(g, { x: 440, y: 880, s: 1.2, view: 'side', dir: 1, lean: -0.12 * Math.max(0, wind) + 0.15 * Math.max(0, -wind), handR: t < 153.5 ? [bx - 8, by + 30] : null, armR: [1.9 * Math.max(0, -wind) + 0.1, 0.1], armL: [0.2, 0.3],
    face: { look: [0, -0.1], sad: -0.5 * (1 - es(t, hit, hit + 1)), smile: lerp(-0.2, 0.7, es(t, hit + 0.4, hit + 1.6)) } }, { dir: 1, amt: 0.3, dim: 0.03 });
  chestNote(g, hero, 1.2);
  ball(g, bx, by, 44, false);
  caption(g, '*Today* was louder.', capA(t, hit + 0.8, b - 0.1), ACC);
}
s7.fin = 0.3; s7.fout = 0.4;
defineClip(126, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
