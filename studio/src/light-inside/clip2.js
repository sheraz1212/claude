// CLIP 2 (0:32-1:04) - the habit repeats: the same bed, the same mirror, a little less light.
(() => {
const T = [32, 36.5, 40.5, 45, 49, 54.5, 59, 64];
[[32, 'whisper-onemore', 1], [40.5, 'whisper-deserve', 2], [59, 'whisper-onemore', 0]].forEach(([a, w, i]) => { sfx(a, 'glow-hum'); sfx(a + 0.3, 'demon-8bit-' + (i + 1), 0.7); sfx(a + 0.8, w); sfx(a + 0.05, 'count-tick'); });
sfx(36.6, 'tap-water'); sfx(45, 'lecture-amb'); sfx(49.3, 'phone-buzz'); sfx(50.2, 'phone-buzz'); sfx(52.2, 'msg-tick'); sfx(54.6, 'tap-water'); sfx(56.2, 'demon-8bit-3', 0.5); sfx(60.5, 'low-thud', 0.7);

function bedRep(g, t, a, b, o) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 900, y: lerp(545, 538, u), z: lerp(1, 1.04, u) });
  dorm(g, t, { sleeping: true, glow: o.gl * (0.9 + 0.1 * Math.sin(t * 4)), bookAt: 'desk', phoneOnDesk: false, door: o.door });
  demonAt(g, t, o.dx ?? 1000, o.dy ?? 836, o.k, o.text, Math.min(seg(t, a + 0.8, a + 1.1), 1 - seg(t, b - 0.8, b - 0.4)), { tx: o.tx, ty: o.ty, lean: o.lean, crack: o.crack, pose: o.pose });
  hud(g, o.label || 'NIGHT', o.n);
  caption(g, o.cap, capA(t, a + 0.9, b - 0.1), ACC);
}
const r1 = (g, t, a, b) => bedRep(g, t, a, b, { n: 9, gl: 0.55, k: 1.0, text: 'one more.', tx: 250, ty: 40, cap: 'Then every *night*.' });
const m2 = (g, t, a, b) => { setCam(g, { x: 960, y: 535, z: lerp(1, 1.05, ease(seg(t, a, b))) }); mirror(g, t, { lv: 0.6, bags: 0.4, face: { smile: -0.1, sad: 0.3, blink: (t > 38 && t < 38.3) ? 1 : 0.25 } }); caption(g, 'Every morning, a little *less*.', capA(t, a + 0.4, b - 0.1), ACC); };
const r3 = (g, t, a, b) => bedRep(g, t, a, b, { n: 27, gl: 0.78, k: 1.35, text: 'you deserve it.', dx: 980, tx: 330, ty: 30, lean: -0.1, cap: 'Her book stayed *closed*.' });
// ONE-OFF PLACE (lecture hall): everyone else is awake.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1000, 900, u), y: 560, z: lerp(1.12, 1.2, u) });
  const L = lecture(g, t), [x, y, s] = L.hero;
  const r = Hero(g, { x, y: y + 20, hip: true, thigh: 20, s, headTilt: 0.5, headOff: [26, 46 + Math.sin(t * 1.6) * 3], face: { blink: 1, smile: -0.1 } }, 0.45, { dir: -1, amt: 0.3, dim: 0.1 });
  eyeBags(g, r, s, 0.5);
  L.draw();
  for (let i = 0; i < 3; i++) { const p = ((t * 0.5 + i * 0.33) % 1); g.save(); g.globalAlpha = (1 - p) * 0.8; g.fillStyle = '#fff'; g.font = `400 ${26 + p * 26}px Nunito`; g.fillText('z', r.head[0] + 70 + p * 60, r.head[1] - 60 - p * 110); g.restore(); }
  caption(g, 'He slept through *class*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV PHONE: Maya keeps a seat for him.
function s5(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, name: 'Maya', sub: 'study partner', clock: 'TUE 3:52', buzz: [49.3, 50.2], msgs: [
    { day: 'Today' }, { who: 's', text: 'library at 4?', at: 49.3 }, { who: 's', text: 'saved you a seat :)', at: 50.2 }, { who: 'h', text: 'tired. next time.', at: 52.2 }] });
  caption(g, 'He kept saying *next time*.', capA(t, a + 0.5, b - 0.1), ACC);
}
const m6 = (g, t, a, b) => { setCam(g, { x: 960, y: 535, z: lerp(1.02, 1.09, ease(seg(t, a, b))) });
  mirror(g, t, { lv: 0.28, bags: 0.9, down: es(t, 57, 58), demon: es(t, 56.2, 57) * 0.9, flick: Math.max(0, Math.sin(t * 7)) * seg(t, 55, 55.5), face: { smile: -0.4, sad: 0.8, look: [0, 0.5 * es(t, 57, 58)], blink: 0.3 } });
  caption(g, 'He stopped liking the *mirror*.', capA(t, a + 0.4, b - 0.1), ACC); };
const r7 = (g, t, a, b) => bedRep(g, t, a, b, { n: 60, gl: 1, k: 1.9, text: 'one more.', dx: 1010, dy: 900, tx: 300, ty: -40, lean: -0.16, cap: 'It was never *one more*.' });
defineClip(32, T, [r1, m2, r3, s4, s5, m6, r7]);
})();
