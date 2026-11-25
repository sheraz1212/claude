// CLIP 6 (2:44-3:43) - exam day. The demon appears ONCE, at the exam hall door: "you are not prepared." He looks at
// his card, lifts his head - red lasers - it breaks. Inside: he reads only Question 1, and begins. The moral. Home: a hug.
(() => {
// the montage was cut from 26 s to 15 s: this clip keeps its own clock (164...) and is played 11 s earlier
const SH = 11, sfx = (t, n, gn) => window.sfx(t - SH, n, gn);
const T = [164, 169, 174, 179.5, 182, 184.5, 190, 195, 200, 205, 211, 218.5];
sfx(164.0, 'street-amb'); sfx(164.4, 'birds', 0.7); sfx(165.0, 'steps', 0.6);
sfx(169.0, 'hall-amb'); sfx(169.4, 'steps', 0.8); sfx(171.0, 'steps', 0.7);
sfx(174.0, 'hall-amb', 0.6); sfx(174.5, 'demon-8bit-1'); sfx(174.6, 'demon-brass', 0.8); sfx(175.4, 'whisper-notprepared', 0.95); sfx(177.6, 'whisper-goback', 0.9);
sfx(179.5, 'heartbeat', 0.8);
sfx(182.0, 'cloth-rustle', 0.6); sfx(182.6, 'paper-crinkle', 0.6);
sfx(185.4, 'laser'); sfx(186.4, 'crack'); sfx(187.2, 'shatter'); sfx(187.2, 'boom-big', 0.8); sfx(187.25, 'timpani-boom', 0.8);
sfx(190.0, 'hall-amb', 0.6); sfx(190.6, 'door-open'); sfx(191.4, 'steps', 0.7);
sfx(195.0, 'exam-room'); sfx(196.0, 'chair-creak', 0.6); sfx(198.4, 'paper-crinkle', 0.5);
sfx(200.0, 'exam-room'); sfx(201.6, 'paper-crinkle', 0.6); sfx(203.2, 'breath-in', 0.7);
sfx(205.0, 'exam-room', 0.8); sfx(205.8, 'paper-slide'); sfx(207.4, 'pencil'); sfx(208.6, 'pencil', 0.8);
sfx(211.3, 'pen-write'); sfx(213.4, 'pen-write', 0.9);
sfx(218.5, 'living-amb'); sfx(219.6, 'door-open', 0.6); sfx(221.2, 'paper-crinkle', 0.5); sfx(222.6, 'pop-8bit-3'); sfx(224.2, 'cloth-rustle', 0.8); sfx(224.6, 'celesta-sparkle', 0.6);

// WIDE: exam day. The university.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 980, u), y: lerp(520, 530, u), z: lerp(1.0, 1.08, u) });
  university(g, t);
  [[300, '#A9A9B4', 'cap', '#3b6a4a', 1], [1500, '#C9A77A', 'glasses', '', -1], [1700, '#8d8d9b', 'scarf', '#b8483a', -1]].forEach(([x0, c, ac, acc, d], i) => { const x = x0 + d * (t - a) * 60; walker(g, x, 900, 0.95, d, t * 6 + i, { col: c, acc: ac, accCol: acc }); floorShadow(g, x, 902, 70); });
  const hx = lerp(700, 900, seg(t, a, b)); walker(g, hx, 880, 1.0, 1, t * 6, { face: { smile: 0.2, look: [0.6, -0.2] } }); floorShadow(g, hx, 882, 80);
  courseHud(g, 100); dayHud(g, 10);
  caption(g, 'Exam *day*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// WIDE: the corridor. The EXAM HALL door at the end.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = seg(t, 169.2, 173.6);
  setCam(g, { x: lerp(860, 900, u), y: 560, z: lerp(1.05, 1.12, u) });
  corridor(g, t);
  P(g, { x: 560, y: CR_F, s: 1.0, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', view: 'side', dir: 1, face: { look: [1, 0.6] } }); floorShadow(g, 560, CR_F + 2, 80);
  P(g, { x: 1520, y: CR_F, s: 1.0, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', ...pose('hold', 1520, CR_F, 1.0), face: { look: [0, 0.8] } }); floorShadow(g, 1520, CR_F + 2, 80);
  const hx = lerp(260, 900, go); walker(g, hx, CR_F, 1.05, 1, t * 6, { face: { sad: 0.2, look: [0.8, 0] } }); floorShadow(g, hx, CR_F + 2, 90);
  courseHud(g, 100);
  caption(g, 'The exam *hall*.', capA(t, a + 0.4, b - 0.1), ACC);
}
const DX = 1290;
function door(g, t, o) {   // the shared door shot: hero left, the door right
  corridor(g, t);
  const da = o.dA ?? 0;
  if (da > 0 && !o.gone) { demonAt(g, t, DX, CR_F, 1.15, null, 0, { a: da, crack: o.crack || 0, face: { look: [-0.9, 0.2], smile: 0.6 }, lean: -0.08 }); if (o.dtext) demonText(g, o.dtext, DX - 420, CR_F - 520, t, o.ta ?? 0, 76); }
  const r = Hero(g, { x: 840, y: CR_F, s: 1.05, ...(o.card ? { handR: [930, 640] } : {}), headOff: [0, o.down ? 14 : 0], face: o.face }, { dir: 1, amt: 0.3 }); floorShadow(g, 840, CR_F + 2, 90);
  return r;
}
// MEDIUM: at the door - the demon. For the first and only time, it shows itself.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1060, 1080, u), y: lerp(560, 540, u), z: lerp(1.25, 1.32, u) });
  noCam(g); setCam(g, { x: lerp(1060, 1080, u), y: lerp(560, 540, u), z: lerp(1.25, 1.32, u) });
  const two = t > 177.5;
  door(g, t, { dA: es(t, 174.4, 175.4), dtext: two ? 'go back.' : 'you are not prepared.', ta: two ? Math.min(seg(t, 177.6, 177.9), 1 - seg(t, 179.1, 179.45)) : Math.min(seg(t, 175.4, 175.7), 1 - seg(t, 177.1, 177.45)), face: { look: [0.9, -0.2], wide: 1.35, sad: 0.6, smile: -0.2, blink: blink(t, 0.4) } });
  noCam(g); g.fillStyle = `rgba(80,0,0,${0.15 * es(t, 174.4, 175.4)})`; g.fillRect(0, 0, W, H);
}
s3.fin = 0.2;
// CLOSE: his head goes down
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(860, 865, u), y: 470, z: lerp(2.2, 2.3, u) });
  door(g, t, { dA: 1, down: true, face: { look: [0.2, 0.9], sad: 1, smile: -0.3, blink: blink(t, 0.4) } });
  noCam(g); g.fillStyle = 'rgba(80,0,0,0.15)'; g.fillRect(0, 0, W, H);
  caption(g, 'For a second, he *believed* it.', capA(t, a + 0.3, b - 0.05), ACC);
}
// INSERT: the card from his pocket - "Q1 only."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 182.1, 182.8);
  setCam(g, { x: 960, y: 545, z: lerp(1.05, 1.1, u) });
  g.fillStyle = '#121119'; g.fillRect(-400, -400, 2800, 1900); glow(g, 960, 500, 600, WARM, 0.15);
  indexCard(g, 960, lerp(900, 500, up), 1.5, { text: 'Q1 only.', rot: -0.05 });
  topHand(g, 1150, lerp(1100, 700, up), 0.8, C.cream, -0.4);
  caption(g, 'Then he remembered his *card*.', capA(t, a + 0.3, b - 0.05), ACC);
}
// MEDIUM: head up. Eyes blazing - two red lasers. The demon cracks... and shatters.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = shake(t, 187.2, 18) + shake(t, 185.4, 6);
  setCam(g, { x: lerp(1060, 1070, u) + sh, y: 540, z: lerp(1.25, 1.3, u) });
  const lift = es(t, 184.6, 185.2), gone = t > 187.2;
  const r = door(g, t, { dA: 1, gone, crack: es(t, 186.3, 187.2), face: { look: [0.9, -0.1], sad: lift > 0.5 ? -0.7 : 0.8, smile: lift > 0.5 ? 0.1 : -0.3, blink: 0 } });
  const s = 1.05, ex = r.head[0] + 22 * s, ey = r.head[1] - 4 * s;
  lasers(g, [[ex - 2, ey], [ex + 26, ey]], [DX - 10, CR_F - 470], es(t, 185.4, 185.8) * (1 - seg(t, 187.2, 187.5)), t);
  shards(g, DX, CR_F - 300, t, 187.2, 1.4);
  flash(g, t, 187.2, '255,90,60');
  courseHud(g, 100);
  caption(g, 'Not *today*.', capA(t, 187.8, b - 0.1), ACC);
}
// WIDE: the doors open. He walks in.
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b)), op = es(t, 190.5, 191.3), go = seg(t, 191.2, 194.6);
  setCam(g, { x: lerp(1000, 1060, u), y: 560, z: lerp(1.1, 1.18, u) });
  corridor(g, t, { open: op });
  const hx = lerp(840, 1210, go); const r = walker(g, hx, CR_F, 1.05 - go * 0.25, 1, t * 6, { face: { smile: 0.4 } }); floorShadow(g, hx, CR_F + 2, 90);
  courseHud(g, 100);
  caption(g, 'He walked *in*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// the exam hall rows (back to front); the hero sits front-centre
function rows(g, t, hero) {
  const R = [[600, 0.7, [460, 720, 980, 1240, 1500]], [700, 0.85, [360, 660, 960, 1260, 1560]], [820, 1.0, [300, 640, 960, 1280, 1620]]];
  const cols = ['#A9A9B4', '#C9A77A', '#8d8d9b'], accs = ['cap', 'glasses', 'longhair', 'scarf', 'cap'];
  R.forEach(([y, s, xs], ri) => xs.forEach((x, i) => {
    if (ri === 2 && x === 960) { hero(x, y, s); return; }
    const k = (ri * 5 + i), dn = Math.sin(t * 2 + k) > 0.3;
    P(g, { x, y: y + 12 * s, hip: true, thigh: 20, s, col: cols[k % 3], acc: accs[k % 5], accCol: ['#2f4f7a', '#b8483a', '#3b6a4a'][k % 3], ...pose('table', x, y + 12 * s, s, { hip: true, tableY: y + 6 * s }), headOff: [0, dn ? 6 * s : 2 * s], face: { look: [0, 0.9], blink: blink(t, k * 0.37) } });
    examDesk(g, x, y, s);
  }));
}
// WIDE: the hall. Many students, heads down. The invigilator.
function s8(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 960, u), y: lerp(500, 520, u), z: lerp(1.0, 1.06, u) });
  examHall(g, t);
  rows(g, t, (x, y, s) => { Hero(g, { x, y: y + 12 * s, hip: true, thigh: 20, s, ...pose('table', x, y + 12 * s, s, { hip: true, tableY: y + 6 * s }), face: { look: [0, 0.8], smile: 0.1, blink: blink(t, 0.4) } }, { dir: 1 }); examDesk(g, x, y, s); });
  const ix = 1780 - (t - a) * 30; const iv = Hero(g, { x: ix, y: 900, s: 1.05, col: '#8d8d9b', acc: 'glasses', ...pose('hold', ix, 900, 1.05), face: { look: [-0.8, 0.3] } }, { dir: -1 }); tie(g, iv, 1.05); floorShadow(g, ix, 902, 90);
  courseHud(g, 100);
  caption(g, 'He took his *seat*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s8.fin = 0.4;
// MEDIUM (close behind him are other students): the paper in front of him. He doesn't flip through it.
function s9(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 965, u), y: lerp(640, 630, u), z: lerp(1.7, 1.78, u) });
  examHall(g, t);
  rows(g, t, (x, y, s) => { const r = Hero(g, { x, y: y + 12 * s, hip: true, thigh: 20, s, ...pose('table', x, y + 12 * s, s, { hip: true, tableY: y + 6 * s }), headOff: [0, 6], face: { look: [0, 0.9], smile: t > 202.6 ? 0.3 : 0, sad: t < 202 ? 0.3 : 0, blink: blink(t, 0.4) } }, { dir: 1 }); examDesk(g, x, y, s); g.fillStyle = '#f7f4ec'; g.fillRect(x - 60, y - 6, 120, 8); });
  courseHud(g, 100);
  caption(g, "He didn't read the *whole* paper.", capA(t, a + 0.4, b - 0.1), ACC);
}
// INSERT (top-down): the rough sheet covers the bottom. Only Question 1. The pencil starts.
function s10(g, t, a, b) {
  const u = ease(seg(t, a, b)), cov = es(t, 205.6, 206.4), wr = seg(t, 207.2, 210.6);
  setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(1.0, 1.06, u) });
  g.fillStyle = '#221f29'; g.fillRect(-400, -400, 2800, 1900);
  g.save(); g.translate(960, 640); g.rotate(-0.02); box(g, -380, -470, 760, 940, '#f7f4ec', 6);
  g.fillStyle = '#2b2b38'; g.font = '700 40px "Patrick Hand"'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('FINAL EXAM', -330, -410);
  g.font = '400 34px "Patrick Hand"'; ['Q1. Solve for x:  3x + 7 = 22', 'Q2. Explain the process of...', 'Q3. Calculate the area...', 'Q4. Compare and contrast...', 'Q5. Prove that...'].forEach((q, i) => { g.fillText(q, -330, -320 + i * 170); g.strokeStyle = 'rgba(60,60,80,0.25)'; g.lineWidth = 2; for (let k = 1; k < 3; k++) { g.beginPath(); g.moveTo(-330, -320 + i * 170 + k * 46); g.lineTo(330, -320 + i * 170 + k * 46); g.stroke(); } });
  g.fillStyle = '#2e4f8a'; g.font = '400 38px "Patrick Hand"'; g.save(); g.beginPath(); g.rect(-330, -290, 600 * wr, 60); g.clip(); g.fillText('3x = 15   ->   x = 5', -320, -274); g.restore();
  g.restore();
  g.save(); g.translate(960, lerp(1500, 940, cov)); g.rotate(0.03); box(g, -420, -300, 840, 600, '#e9e2cf', 6); g.fillStyle = 'rgba(60,60,80,0.4)'; g.font = '400 28px "Patrick Hand"'; g.textAlign = 'center'; g.fillText('rough sheet', 0, -240); g.restore();
  if (wr > 0) { const px = 660 + wr * 560, py = 376 + Math.sin(t * 30) * 5; pencilAt(g, px, py, 1.2, 2.6); topHand(g, px + 100, py + 190, 0.65, C.cream, -0.5); }
  caption(g, 'Just *question one*. And he began.', capA(t, a + 0.4, b - 0.1), ACC);
}
// THE MORAL
const s11 = card2("Don't stress about the *end*.", 'Make it *one small task*.', 0.3, 1.8, 84);
// HOME (his room, the opening shot changed): books stacked neat, the card pile. He gives Ayesha one card. A hug.
function s12(g, t, a, b) {
  const u = ease(seg(t, a, b)), come = es(t, 218.8, 220.6), give = es(t, 221.0, 221.6), hug = es(t, 223.4, 224.4);
  setCam(g, { x: lerp(980, 1060, u), y: lerp(530, 545, u), z: lerp(1.08, 1.28, u) });
  deskRoom(g, t, { clock: 17.5, day: true, warm: 0.8 });
  deskFront(g, t, { pile: 0, pile2: false, done: 10, open: false, card: true });
  const ax = lerp(1460, 1160, hug), hx = lerp(lerp(400, 820, come), 1060, hug);
  const ay = Hero(g, { x: ax, y: DK_F + 60, s: 1.05, ...AYESHA, handL: give > 0 && hug < 0.5 ? [lerp(1340, 1250, give), 690] : hug > 0 ? [ax - 80, 640] : null, face: { look: [-0.9, 0.1], smile: 0.6 + hug * 0.3, blink: hug > 0.8 ? 1 : blink(t, 1.3) } }, { dir: -1, amt: 0.25 }); floorShadow(g, ax, DK_F + 62, 90);
  const r = come < 1 ? walker(g, hx, DK_F + 60, 1.05, 1, t * 6, { face: { smile: 0.8 } }) : Hero(g, { x: hx, y: DK_F + 60, s: 1.05, handR: hug > 0 ? [hx + 90, 640] : give < 1 ? [lerp(1000, 1220, give), 690] : null, face: { look: [0.9, 0.1], smile: 0.9, blink: hug > 0.8 ? 1 : blink(t, 0.4) } }, { dir: 1 });
  floorShadow(g, hx, DK_F + 62, 90);
  if (hug < 0.6 && t > 220.6) { g.save(); g.translate(give < 1 ? lerp(1250, 1300, give) : 1290, 680); g.scale(0.32, 0.32); indexCard(g, 0, 0, 1, { text: 'thank you', tick: 1 }); g.restore(); }
  headText(g, 'one card at a time.', ay.head[0] + 20, ay.head[1] - 115, t, 222.4, 224.2);
}
s12.fin = 0.5; s12.fout = 0.8;
const shift = fn => { const w = (g, t, a, b) => fn(g, t + SH, a + SH, b + SH); for (const k of ['fin', 'fout', 'black']) if (fn[k] !== undefined) w[k] = fn[k]; return w; };
defineClip(164 - SH, T.concat([226]).map(x => x - SH), [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12].map(shift));
})();
