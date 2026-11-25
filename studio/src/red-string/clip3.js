// CLIP 3 (1:04.5-1:39) - the turn: he writes every thought down (threads snap), texts his old friend - "bro I forgot
// about that" - the shock card, the wisdom lines.
(() => {
const T = [64.5, 71, 76, 82, 88, 94, 99];
sfx(64.5, 'night-amb'); sfx(65.2, 'chair-creak', 0.6); sfx(66.0, 'page-turn', 0.7); for (let i = 0; i < 4; i++) { sfx(66.6 + i * 1.0, 'pencil', 0.7); sfx(67.2 + i * 1.0, 'thread-snap'); }
sfx(71.0, 'room-quiet'); sfx(71.4, 'pencil', 0.7); sfx(73.6, 'pencil', 0.9);
sfx(76.0, 'room-quiet'); sfx(76.5, 'typing', 0.6); sfx(77.4, 'msg-out'); sfx(79.0, 'msg-in'); sfx(80.6, 'msg-in', 0.8);
sfx(82.3, 'pen-write'); sfx(84.4, 'pen-write', 0.9);
sfx(88.3, 'pen-write'); sfx(90.4, 'pen-write', 0.9);
sfx(94.0, 'night-amb', 0.6); sfx(94.6, 'breath-out', 0.7);

const NB = SIT[0] + 40, NBY = SIT[1] - 70;
// MEDIUM (bedroom): he sits up and opens the notebook. With every line he writes, a thread snaps.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), done = clamp((t - 67.2) / 4), left = 12 - Math.floor(done * 4) * 3;
  setCam(g, { x: lerp(560, 580, u), y: 520, z: lerp(1.35, 1.42, u) });
  const r = onBed(g, t, { under: 0, lamp: 0.7, hero: { handL: [SIT[0] + 10, SIT[1] - 70], handR: [SIT[0] + 60 + Math.sin(t * 14) * 6, SIT[1] - 72], headOff: [0, 10], face: { look: [0.3, 0.9], sad: 0.4, blink: blink(t, 0.4) } } });
  notebook(g, NB, NBY, 0.9, -1.4);
  const anchors = [[40, 120], [600, 150], [1030, 200], [1460, 280], [1700, 520], [860, 740], [140, 720], [480, 420], [1280, 600], [1680, 300], [300, 200], [760, 560]];
  anchors.slice(0, left).forEach((p, i) => threadTo(g, [r.head[0], r.head[1] - 30], p, 1, 20 + i, t));
  for (let i = 0; i < 4; i++) snapBits(g, anchors[11 - i * 3][0], anchors[11 - i * 3][1], t, 67.2 + i);
  loopsHud(g, 99 - Math.floor(done * 40));
  caption(g, 'He wrote every thought *down*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// INSERT (top-down, the notebook): the worries - and one small step at the bottom
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.0, 1.06, u) });
  tableTop(g, t);
  g.save(); g.translate(960, 560); g.rotate(-0.03); box(g, -420, -330, 840, 660, '#f2ecdc', 8); g.fillStyle = '#2f4f7a'; g.fillRect(-420, -330, 30, 660);
  g.strokeStyle = 'rgba(80,110,170,0.3)'; g.lineWidth = 2; for (let k = 0; k < 11; k++) { g.beginPath(); g.moveTo(-370, -260 + k * 56); g.lineTo(380, -260 + k * 56); g.stroke(); }
  g.fillStyle = '#2b2b38'; g.font = '52px "Patrick Hand"'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  ['boss hates me?', 'they laughed at me?', 'they talk about me?', 'I ruined our friendship?'].forEach((l, i) => { g.fillText(l, -340, -220 + i * 112); g.strokeStyle = 'rgba(200,40,60,0.75)'; g.lineWidth = 5; const w_ = g.measureText(l).width; g.beginPath(); g.moveTo(-345, -236 + i * 112); g.lineTo(-345 + (w_ + 10) * es(t, 71.6 + i * 0.5, 72.0 + i * 0.5), -236 + i * 112); g.stroke(); });
  g.fillStyle = '#c0453a'; g.save(); g.beginPath(); g.rect(-345, 180, 700 * es(t, 73.6, 75.0), 100); g.clip(); g.font = '64px "Patrick Hand"'; g.fillText('-> text him. say sorry.', -340, 250); g.restore();
  g.restore();
  loopsHud(g, 59);
  caption(g, 'Then *one* small step.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV (chat with his old friend): "still think about that day. sorry." -> "bro I forgot about that 😂"
function s3(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [79.0, 80.6], draw: chatApp('Mike', [{ who: 'me', text: 'hey. still think about that day. sorry man.', at: 77.4 }, { who: 'r', text: 'bro I forgot about that 😂', at: 79.0 }, { who: 'r', text: 'ball this weekend?', at: 80.6 }]),
    thumb: t => t > 76.4 && t < 77.4 ? [1040 + Math.sin(t * 30) * 12, 700] : [1180, 820] });
  loopsHud(g, 59);
  caption(g, 'His old friend had *forgotten* it.', capA(t, 79.4, b - 0.1), ACC);
}
// SHOCK CARD: HIM 999 / THEM 1
function s4(g, t, a, b) {
  const f = 1 - seg(t, b - 0.5, b - 0.1);
  blackLine(g, 'He replayed it *999* times.', seg(t, a + 0.3, a + 1.8), ACC, f, 84, -60);
  blackLine(g, 'His friend forgot it in *a day*.', seg(t, a + 2.1, a + 3.6), ACC, f, 84, 60);
}
s4.black = true;
// WISDOM
const s5 = card2('A thought is not a *fact*.', 'Most of it never *happens*.', 0.3, 1.8, 90);
// CLOSE: lighter. The threads are gone; the notebook on his chest. A small smile.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(560, 565, u), y: 545, z: lerp(2.1, 2.2, u) });
  const r = onBed(g, t, { under: 0.3, lamp: 0.8, hero: { handL: [SIT[0] + 10, SIT[1] - 70], handR: [SIT[0] + 60, SIT[1] - 72], headOff: [0, 2], face: { look: [0.6, -0.2], smile: 0.5, blink: blink(t, 0.4) } } });
  notebook(g, NB, NBY, 0.9, -1.4);
  loopsHud(g, 40);
  caption(g, 'For once, his head was *quiet*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s6.fin = 0.5;
defineClip(64.5, T, [s1, s2, s3, s4, s5, s6]);
})();
