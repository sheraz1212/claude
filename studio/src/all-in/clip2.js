// CLIP 2 (0:32-1:04) - the habit repeats: the SAME bed shot, the warehouse, "can't, game's on", double it.
(() => {
const T = [32, 37.5, 43, 48.5, 54, 59, 64];
sfx(32.0, 'night-amb'); sfx(32.4, 'phone-tap-soft', 0.6); sfx(34.2, 'lose-tone', 0.7); sfx(34.3, 'count-tick', 0.6);
sfx(37.5, 'wh-amb'); sfx(38.5, 'count-tick', 0.6); sfx(39.4, 'steps', 0.7); sfx(40.6, 'pop-8bit-1');
sfx(43.0, 'apt-amb'); sfx(43.0, 'crowd-tv', 0.5); sfx(43.3, 'count-tick', 0.6); sfx(44.2, 'pop-8bit-2'); sfx(46.4, 'pop-8bit-3');
sfx(48.5, 'crowd-tv', 0.6); sfx(49.6, 'lose-tone'); sfx(49.9, 'count-tick', 0.6); sfx(50.0, 'demon-8bit-2'); sfx(50.3, 'whisper-winback'); sfx(50.9, 'tap'); sfx(51.0, 'bet-placed'); sfx(51.2, 'heartbeat', 0.7); sfx(53.0, 'lose-tone'); sfx(53.3, 'count-tick', 0.7); sfx(53.2, 'low-thud', 0.6);
sfx(54.0, 'night-amb'); sfx(54.4, 'demon-brass', 0.7); sfx(55.0, 'whisper-due'); sfx(54.5, 'count-tick', 0.6);
sfx(59.0, 'morning-amb'); sfx(59.5, 'count-tick', 0.6); sfx(61.0, 'alarm', 0.8);

const appState = (o, st) => (g, px, py, pw, ph, t) => betApp({ ...o, state: st(t) })(g, px, py, pw, ph, t);
// THE REPEATED SHOT: his bed at night, the green glow. o: k glow, bags, dawn, demon
function bed(g, t, a, b, o = {}) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(880, 860, u), y: 545, z: lerp(1, 1.06, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true, dawn: o.dawn });
  if (o.demon) demonAt(g, t, 760, 742, o.demon, o.dtext, o.da ?? 1, { a: o.dA ?? 1, tx: 60, ty: 150, face: { look: [-0.8, 0.4], smile: 0.7 } });
  bedGlow(g, t, o.k ?? 0.5); eyes(g, o.bags || 0);
  counter(g, t);
}
// REPEATED SHOT (1): small bets, small losses
function s1(g, t, a, b) { bed(g, t, a, b, { k: 0.5 }); caption(g, 'Small bets. Then small *losses*.', capA(t, a + 0.5, b - 0.1), ACC); }
s1.fin = 0.5;
// WIDE (one-off place): the warehouse break room. He hides the phone. The supervisor walks in.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), caught = t > 40.5;
  setCam(g, { x: lerp(820, 860, u), y: lerp(560, 570, u), z: lerp(1.05, 1.13, u) });
  warehouse(g, t);
  P(g, { x: 950, y: 712, hip: true, thigh: 20, s: 1.0, col: '#9a8d7e', acc: 'cap', accCol: '#5a4a52', handR: [990, 680 + Math.sin(t * 5) * 6], face: { look: [0.5, 0.3], smile: 0.4 } });
  P(g, { x: 1180, y: 712, hip: true, thigh: 20, s: 1.0, col: '#A9A9B4', acc: 'glasses', face: { look: [-0.5, 0.3], smile: 0.5, blink: blink(t, 1.6) } });
  box(g, 820, 690, 520, 16, '#2a2832'); box(g, 900, 676, 40, 14, '#3a3846', 3); box(g, 1150, 676, 40, 14, '#3a3846', 3);
  const hr = Hero(g, { x: 440, y: WH_F, s: 1.05, headOff: [0, caught ? -4 : 6], handR: caught ? [520, 760] : [470, 640], handL: caught ? null : [420, 650], face: { look: caught ? [0.8, 0] : [0.1, 0.9], wide: caught ? 1.3 : 1, smile: 0.1 } }, { dir: 1 });
  floorShadow(g, 440, WH_F + 2, 90); phoneAt(g, caught ? 520 : 446, caught ? 770 : 632, 1.05, caught ? 0.3 : 1);
  const sx = Math.max(720, 1900 - (t - 39.3) * 600);
  if (t > 39.3) { const sv = sx > 720 ? walker(g, sx, WH_F, 1.1, -1, t * 6, { col: '#8d8d9b', acc: 'cap', accCol: '#2a2a2a' }) : P(g, { x: 720, y: WH_F, s: 1.1, col: '#8d8d9b', acc: 'cap', accCol: '#2a2a2a', handL: [640, 560], face: { look: [-0.8, 0.2], sad: -0.5, smile: -0.2 } }); vest(g, sv, 1.1); floorShadow(g, sx, WH_F + 2, 90);
    headText(g, "phone away. break's over.", sv.head[0], sv.head[1] - 115, t, 40.6, 42.9); }
  counter(g, t);
  caption(g, 'At work, he *hid* it.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// MEDIUM (what it costs): a friend asks him to play. "can't. game's on." The ball stays in the corner.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1300, 1320, u), y: 560, z: lerp(1.25, 1.32, u) });
  apartment(g, t, { dust: 1 });
  const hr = Hero(g, { x: COUCH[1], y: 712, hip: true, thigh: 20, s: 1.1, handR: [COUCH[1] + 20, 610], handL: [COUCH[1] - 30, 640], face: { look: t > 46.2 ? [0.6, 0.1] : [0.1, 0.8], smile: 0, blink: blink(t, 0.4) } }, { dir: 1 });
  phoneAt(g, COUCH[1] + 10, 598, 1.1, 1, 0.1);
  apFront(g, t);
  const fr = P(g, { x: 1560, y: AP_F, s: 1.1, col: '#A9A9B4', acc: 'glasses', handL: [1500, 720], face: { look: [-0.8, 0.2], smile: t > 46.4 ? -0.1 : 0.6, sad: t > 46.4 ? 0.5 : 0 } }); floorShadow(g, 1560, AP_F + 2, 90);
  headText(g, 'pickup game tomorrow?', fr.head[0], fr.head[1] - 115, t, 44.2, 46.2);
  headText(g, "can't. game's on.", hr.head[0], hr.head[1] - 115, t, 46.4, 48.4);
  counter(g, t);
  caption(g, 'He stopped *playing*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// POV (the trap): YOU LOST - "win it back." - DOUBLE IT? - he taps - lost again
function s4(g, t, a, b) {
  const second = t > 51.0;
  phonePOV(g, t, { t0: a, t1: b, buzz: [49.6, 53.0], draw: second ? appState({ home: 'BEARS', away: 'KINGS', sh: t => t < 52.6 ? 101 : 101, sa: t => t < 52.6 ? 99 : 103, clock: t => t < 52.6 ? 'Q4 0:12' : 'FINAL', amount: 600, pick: 'BEARS', result: 600, at: 53.0 }, t => t < 53.0 ? 'live' : 'lost')
    : appState({ home: 'HAWKS', away: 'RAMS', sh: 88, sa: 94, clock: 'FINAL', amount: 300, pick: 'HAWKS', result: 300, at: 49.6, double: [50.2, 50.9] }, () => 'lost'),
    thumb: t => t < 50.9 ? [lerp(1180, 990, es(t, 50.2, 50.85)), lerp(800, 640, es(t, 50.2, 50.85))] : [lerp(990, 1180, es(t, 51.0, 51.6)), lerp(640, 820, es(t, 51.0, 51.6))] });
  demonText(g, 'win it back.', 470, 300, t, Math.min(seg(t, 50.3, 50.6), 1 - seg(t, 52.4, 52.8)), 84);
  counter(g, t);
  caption(g, 'When he lost, he bet *bigger*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REPEATED SHOT (2): later. The voice sits at the end of his bed.
function s5(g, t, a, b) { bed(g, t, a, b, { k: 0.75, bags: 0.5, demon: 1.0, dA: es(t, 54.4, 55.2), dtext: "you're due.", da: Math.min(seg(t, 55.0, 55.3), 1 - seg(t, 58.4, 58.9)) }); caption(g, 'He was sure the next one would *hit*.', capA(t, a + 0.5, b - 0.1), ACC); }
// REPEATED SHOT (3): dawn in the window. Still awake. The alarm.
function s6(g, t, a, b) { bed(g, t, a, b, { k: 0.9, bags: 1, dawn: true }); caption(g, 'He stopped *sleeping*.', capA(t, a + 0.5, b - 0.1), ACC); }
defineClip(32, T, [s1, s2, s3, s4, s5, s6]);
})();
