// CLIP 3 (1:04-1:36) - the twist: the coach doesn't even remember.
(() => {
const T = [64, 69.5, 75, 80.5, 86, 91.5, 96];
sfx(64.6, 'phone-buzz'); sfx(65.8, 'phone-buzz'); sfx(67.4, 'msg-tick'); sfx(69.5, 'market-amb'); sfx(73, 'pop-8bit-1'); sfx(75.4, 'pop-8bit-2'); sfx(77.4, 'pop-8bit-3'); sfx(79.2, 'pop-8bit-1');
sfx(80.6, 'low-thud'); for (let i = 0; i < 12; i++) sfx(82 + i * 0.2, 'count-tick', 0.8); sfx(84.5, 'piano-low-hit'); sfx(86.2, 'demon-brass');
const WT = []; { let x = 87, d = 0.7; while (x < 91.2) { WT.push(x); sfx(x, 'whisper-useless', 0.7 + (x - 87) * 0.1); x += d; d = Math.max(0.17, d * 0.82); } }
sfx(91.9, 'pen-write', 0.8); sfx(93.6, 'pen-write', 0.8);

function s1(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, name: 'Leo', sub: 'team captain', clock: 'MON 4:12', av: LEO.col, avTop: LEO.accCol, glow: COLD, bg: '60,60,110', buzz: [64.6, 65.8], msgs: [
    { who: 's', text: 'cup final friday.', at: 64.6 }, { who: 's', text: 'we need our keeper.', at: 65.8 }, { who: 'h', text: "i'm useless in goal.", at: 67.4 }] });
  counters(g, said(t, [[64, 402], [69.5, 420]]));
  caption(g, 'His team asked him *back*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE, one-off place (the supermarket): he runs into his old coach.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 1000, u), y: 560, z: lerp(1, 1.08, u) });
  market(g, t);
  person(g, { x: 220, y: 852, s: 0.95, col: '#a3927e', acc: 'longhair', handR: [270, 560], bendR: 1, face: { look: [0.4, -0.4] }, armLines: false });
  const wx = 1900 - (t - a) * 30; walker(g, wx, 852, 0.9, -1, wx / 26, { col: '#9a9aa8', acc: 'glasses' });
  const cx = lerp(1700, 1300, es(t, 69.5, 72.6)), wave = t > 73 ? [2.6, 0.3 + Math.sin(t * 7) * 0.12] : null;
  cart(g, cx - 110, 852);
  if (t < 72.6) walker(g, cx, 852, 1.2, -1, cx / 30, { ...COACH, armLines: true }); else person(g, { x: cx, y: 852, s: 1.2, view: 'side', dir: -1, ...COACH, armL: wave, face: { smile: 0.8 } });
  floorShadow(g, 760, 854, 90);
  const hero = actor(g, { x: 760, y: 852, s: HS, view: 'side', dir: 1, handR: [820, 720], face: { wide: t > 72.8 ? 1.25 : 1, sad: 0.5, smile: -0.2 } }, { dir: 0, amt: 0.2, dim: 0.05 });
  chestWord(g, hero, HS);
  rr(g, 790, 716, 80, 56, 8); g.fillStyle = '#2b2a36'; g.fill(); g.strokeStyle = LINE; g.lineWidth = 2.5; g.stroke();
  counters(g, said(t, [[69.5, 470], [75, 488]]));
  caption(g, 'Then he ran into his *coach*.', capA(t, a + 0.6, b - 0.1), ACC);
}
// MEDIUM two-shot (the twist, through another person).
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 1010, y: lerp(620, 610, u), z: lerp(1.45, 1.55, u) });
  market(g, t);
  const conf = es(t, 79, 79.6);
  const coach = person(g, { x: 1250, y: 852, s: 1.2, view: 'side', dir: -1, ...COACH, armL: conf ? [1.9, 1.6] : [0.9, 0.9], face: { smile: lerp(0.9, 0.1, conf), sad: 0.5 * conf } });
  floorShadow(g, 780, 854, 90);
  const hero = actor(g, { x: 780, y: 852, s: HS, view: 'side', dir: 1, face: { wide: 1.2, sad: 0.7, smile: -0.4, look: [0, -0.1] } }, { dir: 0, amt: 0.2, dim: 0.05 });
  chestWord(g, hero, HS);
  headText(g, 'my best keeper!', coach.head[0] - 20, coach.head[1] - 116, t, 75.4, 77.2);
  headText(g, 'you called me useless.', hero.head[0] + 20, hero.head[1] - 116, t, 77.4, 79.1);
  headText(g, 'i did? when?', coach.head[0] - 20, coach.head[1] - 116, t, 79.2, 80.45);
  counters(g, 505);
  caption(g, "His coach didn't *remember*.", capA(t, a + 0.8, b - 0.1), ACC);
}
// CLOSE (the twist counter): COACH 1 / HIM 515.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), n = Math.round(lerp(1, 515, es(t, 82, 84.5)));
  noCam(g); g.fillStyle = '#0c0c13'; g.fillRect(0, 0, W, H); glow(g, 960, 300, 900, WARM, 0.1);
  setCam(g, { x: 960, y: 540, z: lerp(1, 1.07, u) });
  const r = actor(g, { x: 960, y: 1300, s: 2.4, headOff: [0, 6], face: { wide: 1.25, sad: 1, smile: -0.5, look: [0, 0.5 * es(t, 84.6, 85.6)], blink: (t > 83 && t < 83.15) ? 1 : 0 } }, { dir: 0, amt: 0.15, dim: 0.08 });
  chestWord(g, r, 2.4 * (t > 82 && t < 84.5 ? 1 + 0.06 * Math.sin(t * 40) : 1));
  noCam(g); g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 14;
  const pa = es(t, 81, 81.6);
  g.globalAlpha = pa; g.fillStyle = '#b9b3a2'; g.font = '600 40px Nunito'; g.fillText('COACH', 330, 400); g.fillStyle = C.text; g.font = '800 190px Nunito'; g.fillText('1', 330, 540);
  g.fillStyle = '#b9b3a2'; g.font = '600 40px Nunito'; g.fillText('HIM', 1590, 400); g.fillStyle = ACC; g.font = '800 190px Nunito'; g.fillText(String(n), 1590, 540); g.globalAlpha = 1; g.shadowBlur = 0;
  caption(g, 'He had said it *515* times.', capA(t, 84.4, b - 0.1), ACC);
}
// WIDE (the low point): the bench again. The word is on every locker - in his own handwriting.
function s5(g, t, a, b) {
  const q = rng(77);
  const r = benchRep(g, t, a, b, { n: 515, k: 3.0, dx: 1500, dy: 1400, tx: -9999, text: '', lampA: 0.45, cap: 'The loudest voice was *his*.', others: () => {
    for (let i = 0; i < 26; i++) { const x = 100 + q() * 1720, y = 220 + q() * 480, sz = 34 + q() * 46, rot = (q() - 0.5) * 0.6, at = 86.3 + i * 0.15; if (t > at) word(g, x, y, sz, rot, Math.min(1, (t - at) / 0.3) * 0.8); }
  }, pose: { handL: [858, lerp(700, 470, es(t, 87, 88))], handR: [942, lerp(700, 470, es(t, 87, 88))], bendL: -1, bendR: 1 }, face: { blink: 1, sad: 1, smile: -0.7 } });
  const p = rng(51);
  WT.forEach((wt, i) => { const x = 200 + p() * 1500, y = 150 + p() * 650, sz = 60 + p() * 110, rot = (p() - 0.5) * 0.5; if (t < wt) return;
    g.save(); noCam(g); g.globalAlpha = Math.min(1, (t - wt) / 0.15) * 0.92; g.translate(x, y); g.rotate(rot); g.font = `${sz}px "Caveat Brush"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(255,30,20,0.9)'; g.shadowBlur = 18; g.fillStyle = RED; g.fillText('useless.', Math.sin(t * 9 + i) * 2, 0); g.restore(); });
}
s5.fin = 0.4; s5.fout = 0.4;
function s6(g, t, a, b) {
  const fo = 1 - seg(t, b - 0.6, b - 0.15);
  blackLine(g, 'The coach said it once.', seg(t, a + 0.4, a + 1.9), ACC, fo, 92, -72);
  blackLine(g, 'He said it *515* times.', seg(t, a + 2.1, a + 3.5), ACC, fo, 92, 64);
}
s6.black = true;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
