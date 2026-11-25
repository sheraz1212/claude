// SHORT 1 (37 s, vertical) - "He only bet $20." The habit in fast-forward, ALL IN, the stat card.
(() => {
const T = [0, 3.5, 9, 14, 19, 24.5, 29, 33.5, 37];
sfx(0.1, 'pen-write', 0.7); sfx(0.3, 'crowd-tv', 0.5); sfx(1.6, 'win-chime'); sfx(1.7, 'coins');
sfx(3.5, 'night-amb'); sfx(4.0, 'phone-tap-soft', 0.6); sfx(5.6, 'lose-tone', 0.7); sfx(5.8, 'count-tick', 0.6);
sfx(9.0, 'night-amb'); sfx(9.4, 'demon-brass', 0.7); sfx(10.0, 'whisper-due'); sfx(10.6, 'count-tick', 0.6);
sfx(14.0, 'morning-amb'); sfx(14.4, 'count-tick', 0.6); sfx(15.6, 'alarm', 0.8);
sfx(19.0, 'crowd-tv', 0.5); sfx(19.8, 'tap'); sfx(19.9, 'bet-placed'); sfx(20.2, 'heartbeat'); sfx(22.2, 'boom-loss'); sfx(22.2, 'piano-low-hit'); sfx(22.5, 'count-tick', 0.8);
sfx(24.5, 'coin-rain'); sfx(25.2, 'whisper-double', 0.8); sfx(26.6, 'whisper-nobody', 0.7);
sfx(29.3, 'pen-write'); sfx(33.8, 'pen-write');

const V = (t, k) => kf(t, k);
// HOOK: the phone, the first win, the line above it
function s1(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, zoom: 1.55, dy: -70, draw: appState({ home: 'HAWKS', away: 'WOLVES', sh: 98, sa: 97, clock: 'FINAL', amount: 20, pick: 'HAWKS', result: 40, at: 1.6 }, t => t < 1.6 ? 'live' : 'won') });
  blackLine(g, 'He only bet *$20*.', seg(t, 0.15, 1.2), ACC, 1, 96, -740);
}
function s2(g, t, a, b) { bedV(g, t, a, b, { k: 0.5 }); lost(g, V(t, [[5.6, 0], [5.9, 80]])); caption(g, 'Then he bet *again*.', capA(t, a + 0.4, b - 0.1), ACC); }
s2.fin = 0.3;
function s3(g, t, a, b) { bedV(g, t, a, b, { k: 0.75, bags: 0.5, demon: 1.0, dA: es(t, 9.4, 10.0), dtext: "you're due.", da: Math.min(seg(t, 10.0, 10.3), 1 - seg(t, 13.4, 13.9)) }); lost(g, V(t, [[10.6, 80], [10.9, 1900]])); caption(g, 'And *again*.', capA(t, a + 0.4, b - 0.1), ACC); }
function s4(g, t, a, b) { bedV(g, t, a, b, { k: 0.9, bags: 1, dawn: true }); lost(g, V(t, [[14.4, 1900], [14.7, 2600]])); caption(g, 'He stopped *sleeping*.', capA(t, a + 0.4, b - 0.1), ACC); }
function s5(g, t, a, b) {
  const sh = shake(t, 22.2, 14);
  phonePOV(g, t, { t0: a, t1: b, zoom: 1.55, dy: -70 + sh, buzz: [22.2], draw: appState({ home: 'WOLVES', away: 'HAWKS', sh: 110, sa: t => t < 21.6 ? 108 : 111, clock: t => t < 21.6 ? 'Q4 0:0' + Math.max(1, Math.ceil(21.6 - t)) : 'FINAL', amount: '5,800', pick: 'WOLVES', result: '5,800', at: 22.2, press: 19.8, all: true }, t => t < 19.8 ? 'bet' : t < 22.2 ? 'live' : 'lost'),
    thumb: t => t < 19.9 ? [lerp(1180, 990, es(t, 19.1, 19.75)), lerp(800, 640, es(t, 19.1, 19.75))] : [lerp(990, 1180, es(t, 19.9, 20.4)), lerp(640, 820, es(t, 19.9, 20.4))] });
  flash(g, t, 22.2, '255,255,255');
  lost(g, V(t, [[22.2, 2600], [22.6, 8400]]));
  caption(g, 'Then he went all *in*.', capA(t, a + 0.4, 22.1), ACC);
}
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = seg(t, 24.6, 28.8);
  setCam(g, { x: 560, y: lerp(470, 460, u) + Math.sin(t * 40) * es(t, 27, 28.9) * 3, z: lerp(2.0, 2.15, u) });
  onBed(g, t, { demon: 2.4, dx: 280, dy: 1420, dA: 1, hero: { headOff: [0, 10], ...pose('face', SIT[0], SIT[1], SS, { hip: true }), face: { look: [0, 0.6], sad: 1, smile: -0.35, blink: 1 } } });
  const q = rng(77), pile = 742 - k * 150;
  for (let i = 0; i < 60; i++) { const x = 260 + q() * 600, sp = 0.6 + q() * 0.6, ph_ = (t * sp + q()) % 1; if (t < 24.6 + q() * 1.5) continue; coin(g, x, -100 + ph_ * (pile + 100), 0.9, t * 5 + i); }
  for (let i = 0; i < 80; i++) { const x = 260 + q() * 600, y = 742 - q() * (742 - pile); if (y < pile) continue; coin(g, x, y, 0.9, i); }
  demonText(g, 'just double it.', 620, 280, t, Math.min(seg(t, 25.2, 25.5), 1 - seg(t, 26.4, 26.6)), 52);
  demonText(g, 'nobody has to know.', 560, 280, t, seg(t, 26.6, 26.9), 46);
  lost(g, 8400);
  caption(g, 'The losses piled *up*.', capA(t, a + 0.4, b - 0.1), ACC);
}
const s7 = card2('$20 a day', '= *$7,300* a year.');
const s8 = card2('The house always wins.', '*Walk away*.');
defineClip(0, T, [s1, s2, s3, s4, s5, s6, s7, s8]);
})();
