// CLIP 5 (2:12-2:44) - the first card done, then TEN DAYS in 15 s: card -> study -> tick -> 5-minute walk -> next card.
// COURSE COVERED climbs 0 -> 100%. (15 s. Music: an original retro 8-bit tune, no drums.)
(() => {
const T = [132, 138, 153];
const D0 = 138, DL = 1.5;
const CARDS = ['Ch 1 - Topic 2', 'Ch 2 notes', '10 practice Qs', 'Ch 3 formulas', 'Summary Ch 4', 'Ch 5 - Topic 1', 'Past paper Q1-5', 'Ch 6 review', 'Flashcards 1-6', 'Full revision'];
sfx(132.0, 'room-quiet'); sfx(132.4, 'timer-wind', 0.8); for (let i = 0; i < 6; i++) sfx(133 + i * 0.5, 'clock-tick', 0.5); sfx(136.0, 'timer-ding'); sfx(136.5, 'tick-mark'); sfx(137.0, 'pop-8bit-1');
for (let d = 0; d < 10; d++) { const t0 = D0 + d * DL; sfx(t0 + 0.03, 'pen-write', 0.5); sfx(t0 + 0.45, 'page-turn', 0.6); sfx(t0 + 0.88, 'tick-mark', 0.9); sfx(t0 + 0.93, ['pop-8bit-1', 'pop-8bit-2', 'pop-8bit-3'][d % 3], 0.55); if (d % 2) sfx(t0 + 1.15, 'steps', 0.45); else sfx(t0 + 1.2, 'book-close', 0.7); }
sfx(152.2, 'win-chime', 0.8);

// MEDIUM: the first card. A small timer. 25 minutes - DONE. A little fist pump.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), done = t > 136.0, pump = es(t, 136.8, 137.2) * (1 - es(t, 137.6, 137.95));
  setCam(g, { x: lerp(1120, 1130, u), y: 545, z: lerp(1.6, 1.68, u) });
  deskRoom(g, t, { clock: 22.2 });
  const ps = SITP();
  const r = Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...ps, handR: pump > 0 ? [lerp(ps.handR[0], DESK[0] + 70, pump), lerp(ps.handR[1], 470, pump)] : [ps.handR[0], ps.handR[1] + Math.sin(t * 9) * 3], headOff: [0, done ? 0 : 8], face: { look: done ? [0.3, 0.2] : [0, 0.9], smile: done ? 0.8 : 0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  deskFront(g, t, { pile: 0, pile2: false, card: true });
  box(g, 1290, 640, 80, 50, '#d06a8a', 10); g.fillStyle = '#fff'; g.font = '800 24px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const left = Math.max(0, 25 - (t - 132.4) / 3.6 * 25); g.fillText(done ? '00:00' : String(Math.floor(left)).padStart(2, '0') + ':' + String(Math.floor((left % 1) * 60)).padStart(2, '0'), 1330, 665);
  courseHud(g, done ? 1 : 0);
  caption(g, 'Twenty-five minutes. *Done*.', capA(t, 136.2, b - 0.1), ACC);
}
s1.fin = 0.3;
// MONTAGE: ten days, fast cuts (1.5 s a day: card -> study -> tick -> walk / stretch)
function s2(g, t, a, b) {
  const d = Math.min(9, Math.floor((t - D0) / DL)), k = (t - D0 - d * DL) / DL, pct = d * 10 + 10 * es(k, 0.58, 0.75), day = d % 2 === 0;
  if (k < 0.27) {   // INSERT: write the day's card
    setCam(g, { x: 960, y: 545, z: 1.08 }); tableTop(g, t);
    for (let i = 0; i < Math.min(d, 6); i++) indexCard(g, 1500 + i * 8, 260 + i * 10, 0.6, { text: CARDS[i], tick: 1, rot: 0.1 });
    const pr = seg(k, 0.02, 0.25); indexCard(g, 900, 560, 1.4, { text: CARDS[d], prog: pr, rot: -0.02 });
    const px = 900 - 200 + pr * 400, py = 585 + Math.sin(t * 30) * 6; pencilAt(g, px, py, 1.2, 2.6); topHand(g, px + 100, py + 190, 0.65, C.cream, -0.5);
  } else if (k < 0.58) {   // MEDIUM: studying, the left pile shrinks and the right grows
    const u = seg(k, 0.27, 0.58); setCam(g, { x: 1100 + (d % 3 - 1) * 20, y: 540, z: lerp(1.4, 1.46, u) });
    deskRoom(g, t, { clock: day ? 10.5 + d * 0.1 : 20.5 + d * 0.1, day });
    const ps = SITP();
    Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...ps, handR: [ps.handR[0] + Math.sin(t * 7) * 10, ps.handR[1]], headOff: [0, 6], face: { look: [0.1, 0.9], smile: 0.35, blink: blink(t, 0.4) } }, { dir: 1 });
    deskFront(g, t, { pile: 10 - d, pile2: false, done: d, card: true });
  } else if (k < 0.75) {   // INSERT: tick
    setCam(g, { x: 960, y: 545, z: 1.12 }); tableTop(g, t);
    indexCard(g, 960, 540, 1.6, { text: CARDS[d], tick: seg(k, 0.58, 0.7), rot: 0.02 });
  } else if (d % 2) {   // WIDE: the 5-minute walk outside (phone stays home)
    const u = seg(k, 0.75, 1); setCam(g, { x: 960, y: 560, z: 1.05 });
    university(g, t); const hx = lerp(700, 1200, u); walker(g, hx, 860, 1.0, 1, t * 7, { face: { smile: 0.6 } }); floorShadow(g, hx, 862, 80);
  } else {   // MEDIUM: book closed, a stretch
    setCam(g, { x: 1100, y: 540, z: 1.4 });
    deskRoom(g, t, { clock: 11 + d * 0.1, day: true });
    const st = es(k, 0.77, 0.88);
    Hero(g, { x: DESK[0], y: DESK[1], hip: true, thigh: 20, s: 1.05, ...(st > 0 ? pose('cheer', DESK[0], DESK[1], 1.05, { hip: true }) : SITP()), face: { look: [0, -0.4], smile: 0.8, blink: k > 0.9 ? 1 : 0 } }, { dir: 1 });
    deskFront(g, t, { pile: 10 - d - 1, pile2: false, done: d + 1, open: false });
  }
  courseHud(g, pct); dayHud(g, d + 1, 1, Math.sin(Math.PI * seg(k, 0, 0.2)));
  caption(g, 'Day after day. *One* card at a time.', capA(t, 138.4, 143.2), ACC);
  caption(g, 'Ten days. Ten *small* steps.', capA(t, 148.2, 152.9), ACC);
}
defineClip(132, T, [s1, s2]);
})();
