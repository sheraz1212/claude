// CLIP 4 (1:34-2:06) - the cost and the low point.
(() => {
const T = [94, 100, 105, 111, 113.6, 116.2, 121, 126];
sfx(94.2, 'door-open'); sfx(94.8, 'pop-8bit-3'); sfx(97.5, 'pop-8bit-1'); sfx(97.2, 'demon-8bit-2', 0.7); sfx(98.2, 'whisper-tomorrow');
sfx(100.5, 'pen-write', 0.9); sfx(104.55, 'low-thud', 1.2);
sfx(105.2, 'demon-brass', 1); const WT = []; { let x = 105.9, d = 0.75; while (x < 110.7) { WT.push(x); sfx(x, 'whisper-tomorrow', 0.75 + (x - 105.9) * 0.12); x += d; d = Math.max(0.16, d * 0.82); } }
sfx(111.1, 'piano-low-hit', 0.8); sfx(114.0, 'paper-crinkle'); sfx(115.2, 'piano-tear-note'); sfx(116.4, 'demon-8bit-3', 0.6);
sfx(121.4, 'pen-write', 0.8); sfx(123.7, 'pen-write', 0.8);

// MEDIUM (the news, through another person): Sam at the door with a moving box.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(470, 500, u), y: 535, z: lerp(1.5, 1.58, u) });
  room(g, t, { n: 93, win: 'night', lamp: 0.5, laundry: 1, door: 'open' });
  const sam = person(g, { x: 186, y: 692, s: 1.12, ...SAM, handL: [146, 478], handR: [226, 478], bendL: -1, bendR: 1, face: { look: [0.5, 0], sad: 0.6, smile: -0.1, blink: (t > 96.8 && t < 96.95) ? 1 : 0 } });
  g.fillStyle = '#6b4a2c'; g.strokeStyle = '#b08a5a'; g.lineWidth = 2.5; g.fillRect(128, 430, 116, 84); g.strokeRect(128, 430, 116, 84); g.beginPath(); g.moveTo(128, 450); g.lineTo(244, 450); g.moveTo(186, 430); g.lineTo(186, 450); g.stroke();
  g.fillStyle = 'rgba(243,233,210,0.85)'; g.font = '700 24px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MOVING', 186, 484);
  const d = demon(g, { x: 800, y: 850, s: 2.0, lean: -0.1, handL: [640, 500], bendL: -1, face: { look: [-0.7, 0.3] }, headOff: [-20, 10] }, { t });
  demonText(g, 'tomorrow.', d.head[0] - 60, d.head[1] - 150, t, Math.min(seg(t, 98.2, 98.5), 1 - seg(t, 99.6, 99.95)), 80);
  floorShadow(g, 600, 800, 90);
  const hero = actor(g, { x: 600, y: 800, s: 1.2, view: 'side', dir: -1, headOff: [0, 6 * es(t, 96.5, 97.3)], face: { sad: 0.7, smile: -0.3, look: [0, 0.3] } }, { dir: -1, amt: 0.15, dim: 0.12 });
  headText(g, "i'm moving. friday.", sam.head[0] + 150, sam.head[1] - 86, t, 94.8, 97.3);
  headText(g, "i'll come. tomorrow.", hero.head[0] + 30, hero.head[1] - 100, t, 97.5, 99.8);
  hud(g, 'NOTES', 93);
  caption(g, 'Sam was moving *away*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// INSERT: the last note. The last light goes out.
const s2 = (g, t, a, b) => { writeInsert(g, t, a, b, { lines: [['say bye to Sam', 84, -110], ['tomorrow', 150, 40]], w: [[0.1, 0.4], [0.45, 0.76]], cap: 'The last light went *out*.' }); hud(g, 'NOTES', t > 103.9 ? 97 : 96); };
s2.fout = 0.4;
// WIDE (the low point): the voice fills the room.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1060, u), y: 530, z: lerp(1, 1.1, u) });
  room(g, t, { n: 97, win: 'cold', laundry: 1 });
  noCam(g); g.fillStyle = `rgba(4,3,8,${0.25 + 0.2 * u})`; g.fillRect(0, 0, W, H); setCam(g, CAM);
  const grow = lerp(2.6, 3.3, u);
  demon(g, { x: 960, y: 1330, s: grow, lean: 0.2, headOff: [20, 10], handR: [1330, 520], bendR: 1, face: { look: [0.7, 0.6], smile: 0.9 } }, { t, glow: 40 });
  const cover = es(t, 106.2, 107.2);
  heroSit(g, t, { handL: cover ? [1378, lerp(700, 440, cover)] : null, handR: cover ? [1462, lerp(700, 440, cover)] : null, bendL: -1, bendR: 1, headOff: [Math.sin(t * 23) * 1.5 * cover, 14], face: { look: [0, 0.9], blink: cover, sad: 1, smile: -0.7 }, light: { dir: -1, amt: 0.5, dim: 0.25 } });
  const r = rng(51);
  WT.forEach((wt, i) => {
    const x = 200 + r() * 1500, y = 150 + r() * 650, sz = 60 + r() * 120, rot = (r() - 0.5) * 0.5;
    if (t < wt) return;
    g.save(); noCam(g); g.globalAlpha = Math.min(1, (t - wt) / 0.15) * 0.92; g.translate(x, y); g.rotate(rot); g.font = `${sz}px "Caveat Brush"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(255,30,20,0.9)'; g.shadowBlur = 18; g.fillStyle = RED; g.fillText('tomorrow.', Math.sin(t * 9 + i) * 2, 0); g.restore();
  });
  setCam(g, CAM);
  hud(g, 'NOTES', 97);
  caption(g, 'The voice filled the *room*.', capA(t, a + 1.6, b - 0.1), ACC);
}
s3.fin = 0.4;
// TOP-DOWN INSERT (the object, missed): Sam's ball still here.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.fillStyle = '#0b0b10'; g.fillRect(0, 0, W, H);
  setCam(g, { x: 960, y: 540, z: lerp(1.06, 1, u) });
  g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(700, 0, 1500, 0); gr.addColorStop(0, 'rgba(180,195,240,0)'); gr.addColorStop(0.5, 'rgba(180,195,240,0.2)'); gr.addColorStop(1, 'rgba(180,195,240,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(1500, -50); g.lineTo(1900, -50); g.lineTo(900, 1130); g.lineTo(380, 1130); g.fill(); g.restore();
  g.strokeStyle = 'rgba(110,110,125,0.3)'; g.lineWidth = 2.5; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-100, 120 + i * 190); g.lineTo(2100, 60 + i * 190); g.stroke(); }
  [[420, 300, 0.4], [1480, 760, -0.3], [1300, 240, 1.0]].forEach(([x, y, r]) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = 'hsl(45,60%,24%)'; g.fillRect(-90, -90, 180, 180); g.restore(); });
  floorShadow(g, 990, 760, 330, 0.6);
  ball(g, 960, 520, 230, true);
  caption(g, '*Friday* came.', capA(t, a + 0.3, b - 0.05), ACC);
}
const s5 = (g, t, a, b) => closeNote(g, t, 0.2 + 0.75 * seg(t, a, b), 'He *missed* it.');
// REFLECTION (who he became): the mirror shows the voice, not him.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  noCam(g); g.save(); g.filter = 'blur(14px) brightness(0.6)'; g.drawImage(wall(96, 'cold', 1), 200, 100, 900, 506, -40, -30, 2000, 1140); g.restore();
  g.fillStyle = 'rgba(6,6,12,0.5)'; g.fillRect(0, 0, W, H);
  setCam(g, { x: lerp(960, 930, u), y: 540, z: lerp(1, 1.07, u) });
  rr(g, 560, 110, 440, 860, 26); g.fillStyle = '#0d0d14'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 6; g.stroke();
  g.save(); rr(g, 574, 124, 412, 832, 16); g.clip();
  let gr = g.createLinearGradient(560, 110, 1000, 970); gr.addColorStop(0, '#1a1a26'); gr.addColorStop(1, '#0c0c12'); g.fillStyle = gr; g.fillRect(560, 110, 440, 860);
  const hd = es(t, 118.6, 120.2);
  demon(g, { x: 770, y: 1290, s: 2.3, handR: [930, 610], bendR: 1, headOff: [0, hd * 16], face: { look: [0.3, 0.2 + hd * 0.5], smile: 0.6 } }, { t, glow: 26 });
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 30; g.beginPath(); g.moveTo(600, 420); g.lineTo(820, 130); g.moveTo(690, 470); g.lineTo(900, 190); g.stroke();
  g.restore();
  actor(g, { x: 1270, y: 1520, s: 2.5, view: 'back', handL: [1008, 640], bendL: -1, headOff: [0, hd * 18], lean: -0.03 }, { dir: 1, amt: 0.45, dim: 0.14 });
  caption(g, "This wasn't *him*.", capA(t, a + 0.8, b - 0.6), ACC);
}
s6.fout = 0.5;
// BLACK: the wisdom lines.
function s7(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'Tomorrow never *comes*.', seg(t, a + 0.4, a + 2.2), ACC, fo, 88, -70);
  blackLine(g, 'It is always *today*.', seg(t, a + 2.7, a + 4.2), ACC, fo, 88, 70);
}
s7.black = true;
defineClip(94, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
