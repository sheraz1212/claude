// CLIP 1 (0:00-0:32) - the hook, game night with Marcus, the first bet, the first win.
(() => {
const T = [0, 3, 9, 15, 21, 27, 32];
sfx(0.1, 'pen-write', 0.7); sfx(0.3, 'crowd-tv', 0.5); sfx(1.5, 'win-chime'); sfx(1.6, 'coins');
sfx(3.0, 'apt-amb'); sfx(3.0, 'crowd-tv', 0.7); sfx(6.6, 'tv-cheer', 0.6);
sfx(9.0, 'apt-amb'); sfx(9.0, 'crowd-tv', 0.6); sfx(10.2, 'msg-tick', 0.7); sfx(10.4, 'pop-8bit-1'); sfx(12.8, 'pop-8bit-2');
sfx(15.0, 'crowd-tv', 0.8); sfx(16.2, 'tap'); sfx(16.3, 'bet-placed'); sfx(17.2, 'heartbeat', 0.6); sfx(19.2, 'win-chime'); sfx(19.3, 'coins'); sfx(19.2, 'tv-cheer', 0.8);
sfx(21.0, 'apt-amb'); sfx(22.2, 'demon-8bit-1'); sfx(22.8, 'whisper-skill');
sfx(27.0, 'night-amb'); sfx(27.4, 'phone-tap-soft', 0.6); sfx(29.0, 'phone-tap-soft', 0.6); sfx(30.4, 'win-chime', 0.5);

const appState = (o, st) => (g, px, py, pw, ph, t) => betApp({ ...o, state: st(t) })(g, px, py, pw, ph, t);
// game night on the couch (s2, s3, s5)
function night(g, t, o = {}) {
  apartment(g, t, { dust: 1, behind: o.behind });
  const cheer = o.cheer ? es(t, o.cheer, o.cheer + 0.3) * (1 - es(t, o.cheer + 1.4, o.cheer + 1.8)) : 0;
  const fr = P(g, { x: COUCH[0], y: 712, hip: true, thigh: 20, s: 1.1, col: '#A9A9B4', acc: 'glasses', handL: cheer ? [COUCH[0] - 60, 520] : null, handR: cheer ? [COUCH[0] + 60, 520] : null, face: { look: [-0.8, 0.1], smile: 0.4 + cheer * 0.5, blink: blink(t, 2.2) } });
  const hr = Hero(g, { x: COUCH[1], y: 712, hip: true, thigh: 20, s: 1.1, face: { look: o.hLook || [-0.8, 0.1], smile: o.hSmile ?? 0.4, wide: o.hWide || 1, blink: blink(t, 0.4) }, ...(o.hero || {}) }, { dir: -1 });
  const mx = Hero(g, { x: COUCH[2], y: 712, hip: true, thigh: 20, s: 1.1, ...MARCUS, face: { look: o.mLook || [-0.8, 0.1], smile: 0.6, blink: blink(t, 1.1) }, ...(o.marcus || {}) }, { dir: -1 });
  apFront(g, t);
  return { fr, hr, mx };
}

// HOOK (3 s): a phone. $20 -> "YOU WON +$40". The line writes on above it.
function s1(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, zoom: 0.75, dy: -136, draw: appState({ home: 'HAWKS', away: 'WOLVES', sh: 98, sa: 97, clock: 'FINAL', amount: 20, pick: 'HAWKS', result: 40, at: 1.5 }, t => t < 1.5 ? 'live' : 'won') });
  blackLine(g, 'He only bet *twenty* dollars.', seg(t, 0.15, 1.3), ACC, 1, 84, -390);
}
// WIDE (the place + the people): game night. The basketball sits in the corner.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 980, u), y: lerp(590, 600, u), z: lerp(1.12, 1.2, u) });
  night(g, t, { cheer: 6.6, hLook: [-0.8, 0.1], hSmile: 0.6 });
  caption(g, 'Game night with his roommate, *Marcus*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.5;
// MEDIUM two-shot (the temptation): Marcus shows his win
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), show = es(t, 10.0, 10.5);
  setCam(g, { x: lerp(1080, 1090, u), y: 530, z: lerp(1.5, 1.6, u) });
  const { hr, mx } = night(g, t, { hLook: show > 0.5 ? [0.8, 0.4] : [-0.8, 0.1], hWide: 1 + show * 0.2, marcus: { handR: [COUCH[2] + 40 - 150 * show, lerp(690, 600, show)], face: { look: [-0.7, 0.2], smile: 0.9 } } });
  phoneAt(g, COUCH[2] + 40 - 150 * show, lerp(680, 586, show), 1.1, show, -0.2);
  headText(g, 'won $300 tonight, bro.', mx.head[0] + 30, mx.head[1] - 115, t, 10.4, 12.6);
  headText(g, 'for real?', hr.head[0] - 30, hr.head[1] - 115, t, 12.8, 14.6);
  caption(g, 'Marcus always seemed to *win*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// POV (what he does): $20 on the Hawks - the last second - YOU WON
function s4(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, buzz: [19.2], draw: appState({ home: 'HAWKS', away: 'WOLVES', sh: t => t < 18.6 ? 96 : 98, sa: 97, clock: t => t < 18.6 ? '0:0' + Math.max(1, Math.ceil(19 - t)) : 'FINAL', amount: 20, pick: 'HAWKS', result: 40, at: 19.2, press: 16.2 }, t => t < 16.2 ? 'bet' : t < 19.2 ? 'live' : 'won'),
    thumb: t => t < 16.4 ? [lerp(1180, 990, es(t, 15.3, 16.1)), lerp(780, 690, es(t, 15.3, 16.1))] : [lerp(990, 1180, es(t, 16.4, 17)), lerp(690, 800, es(t, 16.4, 17))] });
  flash(g, t, 19.2);
  caption(g, 'His first *bet*. Twenty dollars.', capA(t, a + 0.5, 18.9), ACC);
  caption(g, 'He *won*.', capA(t, 19.4, b - 0.1), ACC);
}
// CLOSE (emotion): green light on his face. A small voice, quietly proud of him.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), dA = es(t, 22.2, 22.9);
  setCam(g, { x: lerp(1000, 1010, u), y: 470, z: lerp(2.1, 2.2, u) });
  const { hr } = night(g, t, { behind: () => { if (dA > 0) demonAt(g, t, 1290, 860, 0.75, "it's skill, not luck.", Math.min(seg(t, 22.8, 23.1), 1 - seg(t, 26.4, 26.9)), { a: dA, tx: -60, ty: 160, face: { look: [-0.7, 0.3] } }); }, hLook: [0.1, 0.7], hSmile: 0.7, hWide: 1.15, hero: { handR: [COUCH[1] + 20, 600], handL: [COUCH[1] - 30, 640] } });
  phoneAt(g, COUCH[1] + 10, 588, 1.1, 1, 0.1); glow(g, hr.head[0], hr.head[1] + 40, 90, GREEN, 0.18);
  caption(g, 'It felt *easy*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (the REPEATED SHOT is born): his bed, late. The green glow under his face.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(880, 860, u), y: 545, z: lerp(1, 1.06, u) });
  heroRoom(g, t, { lying: true, eyesOpen: true }); bedGlow(g, t, 0.4);
  caption(g, 'So he bet again. And *again*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.5;
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
