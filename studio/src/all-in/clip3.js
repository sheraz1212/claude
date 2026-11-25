// CLIP 3 (1:04-1:36) - the cost: the ATM, the rent, Dad's call, ALL IN. The twist: Marcus.
(() => {
const T = [64, 69.5, 75, 80.5, 86, 91.5, 96];
sfx(64.0, 'street-amb'); sfx(64.6, 'steps', 0.6); sfx(65.6, 'atm-beeps'); sfx(66.4, 'atm-deny');
sfx(69.5, 'hall-amb'); sfx(69.6, 'steps', 0.6); sfx(72.6, 'paper-rip', 0.7); sfx(73.4, 'paper-crush', 0.6);
sfx(75.0, 'night-amb'); sfx(75.2, 'phone-ring', 0.6); sfx(75.6, 'pop-8bit-1'); sfx(78.2, 'pop-8bit-2');
sfx(80.5, 'crowd-tv', 0.5); sfx(81.4, 'tap'); sfx(81.5, 'bet-placed'); sfx(81.8, 'heartbeat'); sfx(83.6, 'boom-loss'); sfx(83.6, 'piano-low-hit'); sfx(83.9, 'count-tick', 0.8);
sfx(86.0, 'street-amb'); sfx(86.2, 'steps', 0.6); sfx(87.0, 'pop-8bit-3'); sfx(88.6, 'keys', 0.8); sfx(89.6, 'sniffle', 0.6);
sfx(91.5, 'room-quiet'); sfx(92.2, 'msg-tick', 0.5); sfx(93.0, 'piano-tear-note', 0.6);

const appState = (o, st) => (g, px, py, pw, ph, t) => betApp({ ...o, state: st(t) })(g, px, py, pw, ph, t);
// WIDE (one-off place): the ATM at night. INSUFFICIENT FUNDS.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(880, 900, u), y: lerp(560, 550, u), z: lerp(1.2, 1.3, u) });
  atmStreet(g, t, { screen: t < 66.4 ? 'ENTER AMOUNT' : 'INSUFFICIENT FUNDS' });
  const hr = Hero(g, { x: 740, y: 860, s: 1.1, view: 'side', dir: 1, handR: t > 65.4 && t < 66.6 ? [900, 610] : null, face: { look: [0.6, 0], sad: t > 66.6 ? 0.6 : 0 } }, { dir: 1 });
  floorShadow(g, 740, 862, 90);
  counter(g, t);
  caption(g, 'Then the money ran *out*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM (one-off): his apartment door. PAST DUE. He tears it down before anyone sees.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), torn = t > 72.6;
  setCam(g, { x: lerp(1300, 1310, u), y: 560, z: lerp(1.4, 1.5, u) });
  hallway(g, t, { door: 0, notice: !torn, sign: false });
  const hx = Math.min(1200, 700 + (t - a) * 400);
  const hr = hx < 1200 ? walker(g, hx, HW_F, 1.1, 1, t * 6, {}) : Hero(g, { x: 1200, y: HW_F, s: 1.1, handR: t > 72.0 && t < 73.6 ? [1400, 600 + es(t, 72.6, 73.4) * 120] : null, face: { look: [0.8, -0.1], sad: 0.6, smile: -0.1 } }, { dir: 1 });
  floorShadow(g, hx, HW_F + 2, 90);
  if (torn && t < 73.6) { g.save(); g.translate(1400, 600 + es(t, 72.6, 73.4) * 120); g.rotate(0.6); box(g, -40, -50, 80, 100, '#efe8d4', 3); g.restore(); }
  counter(g, t);
  caption(g, 'Rent was *late*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.3;
// SPLIT SCREEN (the lie): Dad in his kitchen, proud. Him on his bed: "yeah, dad."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  g.save(); noCam(g); g.beginPath(); g.rect(0, 0, 956, H); g.clip();
  setCam(g, { x: lerp(1515, 1525, u), y: 520, z: 1.5 });
  kitchen(g, t, { night: true, lamp: 0.8 });
  const dd = Hero(g, { x: 1200, y: K_F, s: 1.05, ...DAD, handR: [1270, 500], bendR: -1, face: { look: [0.3, 0], smile: 0.6, blink: blink(t, 1.2) } }, { dir: 1 }); floorShadow(g, 1200, K_F + 2, 90);
  phoneAt(g, 1258, 486, 1.05, 0.2, 0.2);
  headText(g, 'tuition went through? proud of you.', dd.head[0], dd.head[1] - 120, t, 75.6, 78.1);
  g.restore();
  g.save(); noCam(g); g.beginPath(); g.rect(964, 0, 956, H); g.clip();
  setCam(g, { x: lerp(210, 200, u), y: 500, z: 1.5 });
  const r = onBed(g, t, { hero: { handR: [SIT[0] + 66, SIT[1] - 168], bendR: 1, face: { look: [-0.3, 0.7], sad: 0.7, smile: -0.1, blink: blink(t, 0.6) } } });
  phoneAt(g, SIT[0] + 58, SIT[1] - 178, SS, 0.2, -0.2);
  headText(g, 'yeah, dad.', r.head[0], r.head[1] - 110, t, 78.2, 80.3);
  g.restore();
  noCam(g); g.fillStyle = '#000'; g.fillRect(956, 0, 8, H);
  counter(g, t);
  caption(g, 'His dad had sent his tuition *money*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.3;
// POV (the biggest bet): ALL IN. The last seconds. LOST. Silence.
function s4(g, t, a, b) {
  const sh = shake(t, 83.6, 14);
  phonePOV(g, t, { t0: a, t1: b, buzz: [83.6], dy: sh, draw: appState({ home: 'WOLVES', away: 'HAWKS', sh: t => t < 83.0 ? 110 : 110, sa: t => t < 83.0 ? 108 : 111, clock: t => t < 83.0 ? 'Q4 0:0' + Math.max(1, Math.ceil(83.0 - t)) : 'FINAL', amount: '5,800', pick: 'WOLVES', result: '5,800', at: 83.6, press: 81.4, all: true }, t => t < 81.4 ? 'bet' : t < 83.6 ? 'live' : 'lost'),
    thumb: t => t < 81.5 ? [lerp(1180, 990, es(t, 80.7, 81.35)), lerp(800, 640, es(t, 80.7, 81.35))] : [lerp(990, 1180, es(t, 81.5, 82)), lerp(640, 820, es(t, 81.5, 82))] });
  flash(g, t, 83.6, '255,255,255');
  counter(g, t);
  caption(g, 'He went all *in*.', capA(t, a + 0.5, 83.5), ACC);
}
// WIDE (the twist): the used-car lot. Marcus is selling his car, wiping his eyes.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 930, u), y: lerp(560, 570, u), z: lerp(1.05, 1.12, u) });
  carLot(g, t);
  car(g, 1060, 830, 1.05, '#2f4f7a', 'SOLD');
  const give = es(t, 88.2, 88.8);
  const dl = Hero(g, { x: 1340, y: 860, s: 1.05, col: '#8d8d9b', acc: 'glasses', handL: [lerp(1290, 1250, give), 700], face: { look: [-0.8, 0], smile: 0.5 } }, { dir: -1 }); tie(g, dl, 1.05); floorShadow(g, 1340, 862, 90);
  const wipe = t > 89.4 && t < 90.8;
  const mx = Hero(g, { x: 1180, y: 860, s: 1.05, ...MARCUS, headOff: [0, 6], handR: [lerp(1220, 1250, give), 700], handL: wipe ? [1160, 560] : null, face: { look: [0.5, 0.7], sad: 0.9, smile: -0.3, blink: wipe ? 1 : blink(t, 0.7) } }, { dir: -1 }); floorShadow(g, 1180, 862, 90);
  if (t < 88.9) { g.fillStyle = '#d9a657'; g.fillRect(lerp(1222, 1248, give), 694, 14, 10); }
  const hx = Math.min(560, 120 + (t - a) * 300);
  const hr = hx < 560 ? walker(g, hx, 860, 1.05, 1, t * 6, {}) : Hero(g, { x: 560, y: 860, s: 1.05, face: { look: [0.8, 0], wide: 1.3, sad: 0.4 } }, { dir: 1 });
  floorShadow(g, hx, 862, 90);
  headText(g, 'sign here.', dl.head[0], dl.head[1] - 115, t, 87.0, 88.9);
  counter(g, t);
  caption(g, 'Then he saw Marcus selling his *car*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.5;
// INSERT top-down (the truth): Marcus's phone on the hood. Every bet he never showed.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(1, 1.08, u) });
  const gr = g.createLinearGradient(0, 0, 1920, 1080); gr.addColorStop(0, '#1a2a44'); gr.addColorStop(1, '#0d1626'); g.fillStyle = gr; g.fillRect(-200, -200, 2400, 1500);
  g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 60; g.beginPath(); g.moveTo(200, 1100); g.lineTo(900, -100); g.stroke();
  g.save(); g.translate(960, 520); g.rotate(-0.12);
  rr(g, -210, -380, 420, 760, 44); g.fillStyle = '#07070a'; g.fill(); g.strokeStyle = '#5c5c6a'; g.lineWidth = 3; g.stroke();
  rr(g, -196, -366, 392, 732, 34); g.fillStyle = '#0b1610'; g.fill();
  g.fillStyle = ACC; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BET HISTORY', 0, -320);
  const rows = [['+$300', 1], ['-$500', 0], ['-$1,200', 0], ['-$900', 0], ['+$150', 1], ['-$2,000', 0], ['-$750', 0], ['-$3,400', 0], ['-$1,800', 0], ['-$4,100', 0]];
  rows.forEach(([v, w], i) => { if (t < 91.9 + i * 0.12) return; const y = -260 + i * 52; g.fillStyle = '#16241c'; g.fillRect(-170, y - 20, 340, 44); g.fillStyle = w ? ACC : LOSS; g.font = '700 26px Nunito'; g.textAlign = 'left'; g.fillText(['HAWKS', 'BEARS', 'KINGS', 'RAMS', 'WOLVES'][i % 5], -150, y + 2); g.textAlign = 'right'; g.fillText(v, 150, y + 2); });
  if (t > 93.2) { g.fillStyle = '#fff'; g.font = '800 38px Nunito'; g.textAlign = 'center'; g.fillText('TOTAL:  -$14,200', 0, 320); }
  g.restore();
  counter(g, t);
  caption(g, 'Marcus only ever showed his *wins*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.3; s6.fout = 0.4;
defineClip(64, T, [s1, s2, s3, s4, s5, s6]);
})();
