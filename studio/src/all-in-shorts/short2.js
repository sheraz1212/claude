// SHORT 2 (38 s, vertical) - "His friend always won." Marcus's wins, his own losses, the car lot, the history.
(() => {
const T = [0, 3.5, 9, 14, 19, 25, 30.5, 35, 38];
sfx(0.1, 'pen-write', 0.7); sfx(0.3, 'crowd-tv', 0.5); sfx(1.5, 'win-chime'); sfx(1.6, 'coins');
sfx(3.5, 'apt-amb'); sfx(3.5, 'crowd-tv', 0.6); sfx(4.2, 'pop-8bit-1'); sfx(6.6, 'pop-8bit-2');
sfx(9.0, 'crowd-tv', 0.6); sfx(9.8, 'tap'); sfx(9.9, 'bet-placed'); sfx(12.0, 'win-chime'); sfx(12.1, 'coins');
sfx(14.0, 'crowd-tv', 0.6); sfx(15.0, 'lose-tone'); sfx(15.2, 'count-tick', 0.6); sfx(15.6, 'demon-8bit-2'); sfx(15.9, 'whisper-winback'); sfx(17.6, 'lose-tone'); sfx(17.8, 'count-tick', 0.7);
sfx(19.0, 'street-amb'); sfx(19.2, 'steps', 0.6); sfx(20.4, 'pop-8bit-3'); sfx(22.0, 'keys', 0.8); sfx(23.0, 'sniffle', 0.6);
sfx(25.0, 'room-quiet'); sfx(25.6, 'msg-tick', 0.5); sfx(26.8, 'piano-tear-note', 0.6);
sfx(30.8, 'pen-write'); sfx(35.3, 'pen-write');

// HOOK: Marcus's phone. A big win. The line above it.
function s1(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, zoom: 1.55, dy: -70, draw: appState({ home: 'BEARS', away: 'KINGS', sh: 104, sa: 99, clock: 'FINAL', amount: 150, pick: 'BEARS', result: 300, at: 1.5 }, t => t < 1.5 ? 'live' : 'won') });
  blackLine(g, 'His friend *always* won.', seg(t, 0.15, 1.3), ACC, 1, 92, -740);
}
// MEDIUM two-shot: Marcus shows the win
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), show = es(t, 3.8, 4.3);
  setCam(g, { x: lerp(1075, 1085, u), y: 560, z: lerp(1.65, 1.75, u) });
  apartment(g, t, { dust: 1 });
  const hr = Hero(g, { x: COUCH[1], y: 712, hip: true, thigh: 20, s: 1.1, face: { look: show > 0.5 ? [0.8, 0.4] : [-0.8, 0.1], wide: 1 + show * 0.2, smile: 0.4, blink: blink(t, 0.4) } }, { dir: -1 });
  const mx = Hero(g, { x: COUCH[2], y: 712, hip: true, thigh: 20, s: 1.1, ...MARCUS, handR: [COUCH[2] + 40 - 150 * show, lerp(690, 600, show)], face: { look: [-0.7, 0.2], smile: 0.9, blink: blink(t, 1.1) } }, { dir: -1 });
  phoneAt(g, COUCH[2] + 40 - 150 * show, lerp(680, 586, show), 1.1, show, -0.2);
  apFront(g, t);
  headText(g, 'won $300 tonight, bro.', mx.head[0], mx.head[1] - 115, t, 4.2, 6.4);
  headText(g, 'for real?', hr.head[0], hr.head[1] - 115, t, 6.6, 8.8);
  caption(g, 'This is *Marcus*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s2.fin = 0.3;
function s3(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, zoom: 1.55, dy: -70, buzz: [12.0], draw: appState({ home: 'HAWKS', away: 'WOLVES', sh: t => t < 11.6 ? 96 : 98, sa: 97, clock: t => t < 11.6 ? 'Q4 0:02' : 'FINAL', amount: 20, pick: 'HAWKS', result: 40, at: 12.0, press: 9.8 }, t => t < 9.8 ? 'bet' : t < 12 ? 'live' : 'won'),
    thumb: t => t < 9.9 ? [lerp(1180, 990, es(t, 9.1, 9.75)), lerp(800, 640, es(t, 9.1, 9.75))] : [lerp(990, 1180, es(t, 9.9, 10.4)), lerp(640, 820, es(t, 9.9, 10.4))] });
  caption(g, 'So he tried it *too*.', capA(t, a + 0.4, b - 0.1), ACC);
}
function s4(g, t, a, b) {
  const second = t > 16.4;
  phonePOV(g, t, { t0: a, t1: b, zoom: 1.55, dy: -70, buzz: [15.0, 17.6], draw: second ? appState({ home: 'BEARS', away: 'KINGS', sh: 101, sa: 103, clock: 'FINAL', amount: 600, pick: 'BEARS', result: 600, at: 17.6 }, t => t < 17.6 ? 'live' : 'lost')
    : appState({ home: 'HAWKS', away: 'RAMS', sh: 88, sa: 94, clock: 'FINAL', amount: 300, pick: 'HAWKS', result: 300, at: 15.0, double: [15.5, 16.3] }, () => 'lost') });
  demonText(g, 'win it back.', 1120, 60, t, Math.min(seg(t, 15.9, 16.2), 1 - seg(t, 18.4, 18.9)), 80);
  lost(g, kf(t, [[15.0, 0], [15.3, 300], [17.6, 300], [17.9, 900]]));
  caption(g, 'He *lost*. Then lost more.', capA(t, a + 0.4, b - 0.1), ACC);
}
// WIDE: the car lot. Marcus sells his car.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 21.6, 22.2);
  setCam(g, { x: lerp(1040, 1060, u), y: lerp(610, 620, u), z: lerp(1.2, 1.28, u) });
  carLot(g, t);
  car(g, 1060, 830, 1.05, '#2f4f7a', 'SOLD');
  const dl = Hero(g, { x: 1340, y: 860, s: 1.05, col: '#8d8d9b', acc: 'glasses', handL: [lerp(1290, 1250, give), 700], face: { look: [-0.8, 0], smile: 0.5 } }, { dir: -1 }); tie(g, dl, 1.05); floorShadow(g, 1340, 862, 90);
  const wipe = t > 22.8 && t < 24.2;
  Hero(g, { x: 1180, y: 860, s: 1.05, ...MARCUS, headOff: [0, 6], handR: [lerp(1220, 1250, give), 700], handL: wipe ? [1150, 560] : null, face: { look: [0.5, 0.7], sad: 0.9, smile: -0.3, blink: wipe ? 1 : blink(t, 0.7) } }, { dir: -1 }); floorShadow(g, 1180, 862, 90);
  const hx = Math.min(780, 500 + (t - a) * 260);
  if (hx < 780) walker(g, hx, 860, 1.05, 1, t * 6, {}); else Hero(g, { x: 780, y: 860, s: 1.05, face: { look: [0.8, 0], wide: 1.3, sad: 0.4 } }, { dir: 1 });
  floorShadow(g, hx, 862, 90);
  headText(g, 'sign here.', dl.head[0] - 60, dl.head[1] - 115, t, 20.4, 22.3);
  caption(g, 'Then Marcus sold his *car*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s5.fin = 0.3;
// INSERT: the bet history he never showed
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(640, 620, u), z: lerp(1.2, 1.26, u) });
  const gr = g.createLinearGradient(0, 0, 1920, 1080); gr.addColorStop(0, '#1a2a44'); gr.addColorStop(1, '#0d1626'); g.fillStyle = gr; g.fillRect(-400, -800, 2800, 2800);
  g.save(); g.translate(960, 520); g.rotate(-0.08);
  rr(g, -210, -380, 420, 760, 44); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, -196, -366, 392, 732, 34); g.fillStyle = '#0b1610'; g.fill();
  g.fillStyle = ACC; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BET HISTORY', 0, -320);
  const rows = [['+$300', 1], ['-$500', 0], ['-$1,200', 0], ['-$900', 0], ['+$150', 1], ['-$2,000', 0], ['-$750', 0], ['-$3,400', 0], ['-$1,800', 0], ['-$4,100', 0]];
  rows.forEach(([v, w], i) => { if (t < 25.4 + i * 0.12) return; const y = -260 + i * 52; g.fillStyle = '#16241c'; g.fillRect(-170, y - 20, 340, 44); g.fillStyle = w ? ACC : LOSS; g.font = '700 26px Nunito'; g.textAlign = 'left'; g.fillText(['HAWKS', 'BEARS', 'KINGS', 'RAMS', 'WOLVES'][i % 5], -150, y + 2); g.textAlign = 'right'; g.fillText(v, 150, y + 2); });
  if (t > 26.8) { g.fillStyle = '#fff'; g.font = '800 38px Nunito'; g.textAlign = 'center'; g.fillText('TOTAL:  -$14,200', 0, 320); }
  g.restore();
  caption(g, 'He only ever showed his *wins*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s6.fout = 0.4;
const s7 = card2('Nobody posts', 'their *losses*.');
const s8 = card2('The house always wins.', '*Walk away*.', 0.2, 1.2);
defineClip(0, T, [s1, s2, s3, s4, s5, s6, s7, s8]);
})();
