// CLIP 6 (2:38-3:10) - he goes to Sam, the mirrored ending, the lesson.
(() => {
const T = [158, 163, 168, 175, 183, 190];
sfx(158, 'night-amb'); sfx(160.2, 'bus-arrive'); sfx(163, 'bus-ride'); sfx(168, 'morning-amb'); sfx(168.6, 'whoosh-soft'); sfx(169.5, 'net-swish'); sfx(169.9, 'ball-bounce', 0.6); sfx(170.3, 'ball-bounce', 0.35);
sfx(170.6, 'pop-8bit-3'); sfx(172.5, 'pop-8bit-1'); sfx(173.0, 'whoosh-soft', 0.7); sfx(173.7, 'ball-catch');
sfx(178.2, 'phone-buzz-muffled'); sfx(178.4, 'pop-8bit-2'); sfx(180.6, 'pop-8bit-3'); sfx(183.6, 'pen-write', 0.9);

// WIDE, one-off place (bus stop at night): Sam lives far away now. He goes anyway.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 1040, u), y: 550, z: lerp(1, 1.05, u) });
  skyline(g, 700, -200, 2300, 55, '#0e0d17', [[0, '#07070f'], [0.7, '#15152a'], [1, '#232040']]);
  g.fillStyle = '#17161e'; g.fillRect(-300, 700, 2700, 130); g.fillStyle = '#0e0d13'; g.fillRect(-300, 830, 2700, 400);
  g.fillStyle = '#2d2b38'; for (let i = 0; i < 16; i++) g.fillRect(-200 + i * 160, 930, 90, 6);
  // shelter
  g.strokeStyle = LINE; g.lineWidth = 4; g.fillStyle = 'rgba(40,44,62,0.35)'; g.fillRect(430, 500, 420, 300); g.strokeRect(430, 500, 420, 300);
  g.beginPath(); g.moveTo(400, 500); g.lineTo(880, 500); g.moveTo(470, 730); g.lineTo(810, 730); g.moveTo(490, 730); g.lineTo(490, 800); g.moveTo(790, 730); g.lineTo(790, 800); g.stroke();
  person(g, { x: 560, y: 726, hip: true, thigh: 30, s: 0.95, col: '#8a8795', acc: 'scarf', headOff: [0, 8], face: { look: [0, 0.7], blink: 0.8 }, armLines: false });
  const p2 = person(g, { x: 730, y: 808, s: 1.0, col: '#9a8b78', acc: 'glasses', handR: [760, 600], bendR: 1, face: { look: [0.3, 0.7] }, armLines: false });
  rr(g, 752, 572, 18, 30, 4); g.fillStyle = '#cfe0ff'; g.fill();
  g.strokeStyle = '#4a4858'; g.lineWidth = 8; g.beginPath(); g.moveTo(940, 810); g.lineTo(940, 430); g.stroke();
  rr(g, 870, 380, 140, 86, 10); g.fillStyle = '#1c2540'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
  g.fillStyle = C.text; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 28px Nunito'; g.fillText('BUS 12', 940, 408); g.font = '400 18px Nunito'; g.fillText('to RIVERTON', 940, 442);
  streetLamp(g, 1260, 810, 460, 1);
  // the bus
  const bx = lerp(2500, 1330, 1 - (1 - seg(t, 160.0, 162.8)) ** 2), on = t > 160;
  if (on) {
    g.save(); g.globalCompositeOperation = 'lighter'; const hl = g.createLinearGradient(bx - 520, 0, bx, 0); hl.addColorStop(0, 'rgba(255,230,170,0)'); hl.addColorStop(1, 'rgba(255,230,170,0.32)');
    g.fillStyle = hl; g.beginPath(); g.moveTo(bx, 760); g.lineTo(bx - 520, 690); g.lineTo(bx - 520, 850); g.lineTo(bx, 790); g.fill(); g.restore();
    rr(g, bx, 490, 980, 320, 26); g.fillStyle = '#252838'; g.fill(); g.strokeStyle = '#8c8c9c'; g.lineWidth = 3; g.stroke();
    for (let i = 0; i < 6; i++) { rr(g, bx + 40 + i * 152, 530, 128, 120, 10); g.fillStyle = '#d9b06a'; g.fill(); g.stroke(); if (i % 2) { g.fillStyle = '#4a3f38'; g.beginPath(); g.arc(bx + 104 + i * 152, 630, 26, 0, 7); g.fill(); } }
    g.fillStyle = '#ffe6b0'; g.fillRect(bx - 2, 750, 12, 30);
    for (const w of [170, 780]) { g.fillStyle = '#0b0b10'; g.beginPath(); g.arc(bx + w, 812, 44, 0, 7); g.fill(); g.stroke(); }
  }
  floorShadow(g, 1100, 810, 90);
  const r = actor(g, { x: 1100, y: 810, s: 1.1, handR: [1176, 668], bendR: 1, face: { look: [0.7 * es(t, 160.2, 161), 0], smile: 0.35, blink: (t > 159.4 && t < 159.55) ? 1 : 0 } }, { dir: 1, amt: 0.3, dim: 0.03 });
  chestNote(g, r, 1.1); ball(g, 1182, 650, 40, false);
  caption(g, 'Sam lived far away *now*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
// MEDIUM, one-off place (inside the bus): four hours, with the ball on his lap.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), j = Math.sin(t * 13) * 1.5;
  setCam(g, { x: 960, y: 540 + j, z: lerp(1.02, 1.1, u) });
  g.fillStyle = '#14131b'; g.fillRect(-200, -200, 2400, 1500);
  for (let i = -1; i < 4; i++) {
    const x = 60 + i * 620;
    g.save(); rr(g, x, 190, 560, 360, 30); g.clip();
    const gr = g.createLinearGradient(0, 190, 0, 550); gr.addColorStop(0, '#0a0b18'); gr.addColorStop(1, '#2a2440'); g.fillStyle = gr; g.fillRect(x, 190, 560, 360);
    const off = (t * 420) % 620; g.fillStyle = '#0c0b14';
    for (let k = -2; k < 6; k++) g.fillRect(x - off + k * 310 + i * 90, 430 - ((k * 37 + i * 11) % 5) * 22, 240, 200);
    g.globalCompositeOperation = 'lighter';
    for (let k = -1; k < 4; k++) { const lx = x + 800 - ((t * 900 + k * 520) % 1900); const lg = g.createRadialGradient(lx, 300, 4, lx, 300, 160); lg.addColorStop(0, 'rgba(255,200,120,0.7)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = lg; g.fillRect(lx - 170, 130, 340, 340); }
    g.restore(); rr(g, x, 190, 560, 360, 30); g.strokeStyle = LINE; g.lineWidth = 4; g.stroke();
  }
  // passengers behind
  for (const [x, o] of [[400, { col: '#8a8795', acc: 'cap', accCol: '#4a3f38', face: { blink: 1 }, headTilt: 0.2 }], [1540, { col: '#a3927e', acc: 'longhair', face: { look: [0, 0.8] } }]]) {
    person(g, { x, y: 760, hip: true, thigh: 30, s: 1.15, armLines: false, ...o });
    rr(g, x - 150, 600, 300, 520, 40); g.fillStyle = '#1b1a25'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
  }
  rr(g, 700, 470, 520, 700, 50); g.fillStyle = '#1d1c28'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 3; g.stroke();
  const r = actor(g, { x: 960, y: 800, hip: true, thigh: 30, s: 1.6, handL: [900, 800], handR: [1020, 800], bendL: -1, bendR: 1, headTilt: -0.05,
    face: { look: [-0.65, -0.1], smile: 0.45, blink: (t > 165.3 && t < 165.45) ? 1 : 0 } }, { dir: -1, amt: 0.35, dim: 0.06 });
  chestNote(g, r, 1.6); ball(g, 960, 830, 78, false);
  const sweep = ((t * 900) % 1900) / 1900;
  g.save(); noCam(g); g.globalCompositeOperation = 'lighter'; const sg = g.createLinearGradient(W * (1.2 - sweep * 1.5) - 300, 0, W * (1.2 - sweep * 1.5) + 300, 0); sg.addColorStop(0, 'rgba(255,190,110,0)'); sg.addColorStop(0.5, 'rgba(255,190,110,0.13)'); sg.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H); g.restore();
  caption(g, 'Four hours. He *went*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE, one-off place (Sam's new driveway at sunrise): he brings the ball back.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 1010, u), y: 545, z: lerp(1, 1.07, u) });
  skyline(g, 720, -300, 900, 91, '#1b1626', [[0, '#231f40'], [0.55, '#8a5670'], [1, '#f0a868']]);
  g.save(); g.globalCompositeOperation = 'lighter'; let gr = g.createRadialGradient(520, 720, 10, 520, 720, 700); gr.addColorStop(0, 'rgba(255,190,110,0.5)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(-300, 0, 1700, 800); g.restore();
  // Sam's new house: garage with a hoop, boxes by the door
  g.fillStyle = '#1b1824'; g.strokeStyle = LINE; g.lineWidth = 2.5;
  g.beginPath(); g.moveTo(960, 330); g.lineTo(1420, 170); g.lineTo(2100, 330); g.lineTo(2100, 820); g.lineTo(960, 820); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#211e2b'; g.fillRect(1120, 500, 440, 320); g.strokeRect(1120, 500, 440, 320); for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(1120, 500 + i * 80); g.lineTo(1560, 500 + i * 80); g.stroke(); }
  g.fillStyle = '#2b2a36'; g.fillRect(1280, 356, 120, 86); g.strokeRect(1280, 356, 120, 86); g.strokeRect(1318, 392, 44, 34);
  g.strokeStyle = '#b8683c'; g.lineWidth = 5; g.beginPath(); g.ellipse(1340, 452, 34, 9, 0, 0, 7); g.stroke();
  g.strokeStyle = 'rgba(230,225,210,0.4)'; g.lineWidth = 1.6; g.beginPath(); for (let i = 0; i <= 4; i++) { g.moveTo(1308 + i * 16, 456); g.lineTo(1318 + i * 11, 506); } g.stroke();
  g.fillStyle = '#e0a55c'; g.strokeStyle = LINE; g.lineWidth = 2.5; g.fillRect(1660, 560, 110, 260); g.strokeRect(1660, 560, 110, 260);
  g.save(); g.globalCompositeOperation = 'lighter'; gr = g.createRadialGradient(1715, 690, 10, 1715, 690, 300); gr.addColorStop(0, 'rgba(255,190,110,0.35)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(1400, 380, 640, 620); g.restore();
  [[1800, 752, 104, 70], [1812, 690, 84, 62], [1880, 770, 70, 52]].forEach(([x, y, w, h]) => { g.fillStyle = '#6b4a2c'; g.strokeStyle = '#b08a5a'; g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h); g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x + w, y + 14); g.stroke(); });
  g.fillStyle = '#19161f'; g.fillRect(-400, 820, 2800, 400); g.fillStyle = '#231f2a'; g.beginPath(); g.moveTo(1100, 820); g.lineTo(1580, 820); g.lineTo(1760, 1100); g.lineTo(820, 1100); g.fill();
  g.strokeStyle = LINE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-400, 820); g.lineTo(2400, 820); g.stroke();
  const jx = -120 + (t - a) * 130; walker(g, jx, 822, 0.62, 1, jx / 26, { col: '#6f6c78', acc: 'scarf' });
  person(g, { x: 1960, y: 822, s: 0.9, col: '#8a8795', acc: 'glasses', handL: [1930, 700], handR: [1990, 700], bendL: -1, bendR: 1, armLines: false, face: { look: [-0.6, 0] } });
  // Sam shoots alone, then sees him
  const turned = t >= 170.2, hy = kf(t, [[168.0, 640], [168.6, 452], [169.3, 470], [170.0, 700]]);
  const toss = seg(t, 173.0, 173.7), caught = t >= 173.7;
  floorShadow(g, 1320, 850, 80);
  const hx = lerp(280, 800, es(t, 168.6, 171.2)), walking = t > 168.6 && t < 171.2;
  let hb = [hx + 52, 690];
  if (toss > 0) hb = [lerp(hx + 52, 1262, toss), lerp(690, 664, toss) - Math.sin(Math.PI * toss) * 90];
  const sam = turned
    ? person(g, { x: 1320, y: 850, s: 1.1, view: 'side', dir: -1, ...SAM, handL: caught ? [hb[0] + 30, hb[1] + 14] : null, handR: caught ? [hb[0] + 34, hb[1] - 4] : null, armL: [toss * 1.2 + 0.2, 0.3], armR: [toss * 1.1 + 0.15, 0.3], face: { smile: lerp(0.0, 1, es(t, 170.3, 170.9)), look: [0, 0], blink: (t > 174.2 && t < 174.35) ? 1 : 0 } })
    : person(g, { x: 1320, y: 850, s: 1.1, view: 'back', ...SAM, handL: [1300, hy], handR: [1340, hy], bendL: -1, bendR: 1 });
  // Sam's own shot (a plain ball)
  let sb; if (t < 168.6) sb = [1320, hy - 34]; else if (t < 169.5) { const k = seg(t, 168.6, 169.5); sb = [lerp(1320, 1340, k), lerp(470, 440, k) - Math.sin(Math.PI * k) * 150]; } else { const k = seg(t, 169.5, 171.5); sb = [1340 + k * 180, 826 - Math.abs(Math.cos(k * Math.PI * 2.5)) * (1 - k) ** 2 * 380]; }
  g.save(); g.globalAlpha = 0.9; ball(g, sb[0], sb[1], 26, false); g.restore();
  floorShadow(g, hx, 850, 85);
  const hero = walking
    ? (() => { const l = _PLw(g, () => walker(_PL.getContext('2d'), hx, 850, 1.1, 1, hx / 30, { handR: [hb[0] - 4, hb[1] + 26], armLines: true, face: { smile: 0.5 } })); return l; })()
    : actor(g, { x: hx, y: 850, s: 1.1, view: 'side', dir: 1, handR: toss > 0 ? null : [hb[0] - 4, hb[1] + 26], armR: [toss > 0 ? 1.5 * (1 - es(t, 173.7, 174.5)) + 0.1 : 0, 0.2], face: { smile: 0.8, blink: (t > 172.0 && t < 172.15) ? 1 : 0 } }, { dir: -1, amt: 0.25, dim: 0.02 });
  chestNote(g, hero, 1.1);
  ball(g, hb[0], hb[1], 40, false);
  headText(g, 'you came?!', sam.head[0] + 20, sam.head[1] - 110, t, 170.6, 172.4);
  headText(g, 'today.', hero.head[0], hero.head[1] - 110, t, 172.5, 174.4);
  caption(g, 'He brought the ball *back*.', capA(t, 171.2, b - 0.1), ACC);
}
function _PLw(g, fn) { if (!_PL) _PL = mk(W, H); const l = _PL.getContext('2d'); noCam(l); l.clearRect(0, 0, W, H); l.setTransform(g.getTransform()); const r = fn(); g.save(); noCam(g); g.drawImage(_PL, 0, 0); g.restore(); return r; }
// WIDE - THE MIRROR OF THE FIRST SCENE: same room, same shot. The wall is clear.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 1085, u), y: lerp(540, 525, u), z: lerp(1, 1.13, u) });
  const on = t > 178.2;
  room(g, t, { n: 0, win: 'warm', ball: false, today: true, phoneOn: on, floorNotes: false });
  const look = es(t, 178.3, 178.8) * (1 - es(t, 180.4, 180.9)), out = es(t, 181.0, 181.8);
  const r = heroSit(g, t, { headOff: [-5 * look, Math.sin(t * 1.3) * 1.2], face: { look: [-0.75 * look - 0.5 * out, 0.7 * look - 0.2 * out], smile: 0.5 + 0.4 * look, blink: (t > 177.0 && t < 177.15) ? 1 : 0 }, light: { dir: -1, amt: 0.25, dim: 0 } });
  headText(g, 'ball friday?', 1250, 560, t, 178.4, 180.4);
  headText(g, "i'll be there.", r.head[0] + 40, r.head[1] - 120, t, 180.6, 182.7);
  caption(g, 'His wall was *clear*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.5; s4.fout = 0.6;
const s5 = (g, t, a, b) => blackLine(g, 'Tomorrow is *today*.', seg(t, a + 0.6, a + 2.8), ACC, 1 - seg(t, b - 1.2, b - 0.2), 104);
s5.black = true;
defineClip(158, T, [s1, s2, s3, s4, s5]);
})();
