// YES MAN - CLIP 2 (0:23-0:41): the 4th yes (his own Saturday game), the low point on his knees, the wisdom card.
(() => {
const T = [23, 27.5, 31.5, 37, 41.5];
sfx(23.0, 'room-quiet'); sfx(23.4, 'msg-in'); sfx(25.0, 'typing', 0.7); sfx(25.9, 'msg-out');
sfx(27.5, 'room-quiet'); sfx(28.0, 'marker-tick'); sfx(28.6, 'marker-tick', 0.8); sfx(29.4, 'whoosh-soft', 0.7); sfx(30.0, 'stone-drop'); sfx(30.05, 'low-thud', 0.9);
sfx(31.5, 'street-amb'); sfx(31.8, 'steps-small', 0.5); sfx(32.6, 'laugh-soft', 0.7); sfx(33.6, 'bump'); sfx(33.7, 'low-thud', 0.8); sfx(34.2, 'demon-8bit-2', 0.6); sfx(34.3, 'whisper-hate', 0.9); sfx(35.6, 'laugh-soft', 0.5);
sfx(37.3, 'pen-write'); sfx(39.1, 'pen-write', 0.9);

// POV (chat): "help me move saturday?" - Saturday is his game. "yes."
function s1(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [23.4], draw: chatApp('Jake', [{ who: 'r', text: 'help me move saturday? 🙏', at: 23.4 }, { who: 'me', text: 'yes.', at: 25.9 }]),
    thumb: t => t > 25 && t < 25.9 ? [1040 + Math.sin(t * 30) * 12, 700] : [1180, 820] });
  bagHud(g, KGS[3]);
  caption(g, 'Saturday was *his* game.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM (his room): he crosses out MY GAME on the calendar. The 4th stone.
const s2 = (g, t, a, b) => situation(g, t, a, b, { place: (g, t) => { heroRoom(g, t, { lamp: 0.6 });
    g.save(); g.translate(760, 360); box(g, -110, -90, 220, 180, '#efe8d4', 4); g.fillStyle = '#c94b3f'; g.fillRect(-110, -90, 220, 34); g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SATURDAY', 0, -72);
    g.fillStyle = ACC; g.font = '700 34px "Patrick Hand"'; g.fillText('MY GAME 🏀', 0, 10); const x = es(t, 27.9, 28.9); if (x > 0) { g.strokeStyle = '#2b2b38'; g.lineWidth = 7; g.beginPath(); g.moveTo(-90, 10); g.lineTo(-90 + 180 * x, 10); g.stroke(); } g.restore(); },
  F: 740, cam: [640, 500, 1.6, 1.66], hx: 560, fx: 0, noFriend: true, hHand: () => [650, 410], n: 3, drop: 30.0, hSad: 0.8, hSmile: -0.2, cap: 'Even his *own* plans.' });
s2.fin = 0.3;
// WIDE (the low point): bent under 26 kg he falls to his knees. People pass, laughing. A whisper: "they'll hate you."
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), fall = es(t, 33.4, 33.9), sh = shake(t, 33.6, 14);
  setCam(g, { x: lerp(920, 940, u) + sh, y: 600, z: lerp(1.5, 1.6, u) });
  busStop(g, t);
  [[1400, -1, '#A9A9B4', 'cap', '#2f4f7a'], [1560, -1, '#C9A77A', 'longhair', '#3a2a22']].forEach(([x0, d, c, ac, acc], i) => { const x = x0 + d * (t - a) * 120; const p = walker(g, x, BS_F, 1.0, d, t * 6 + i, { col: c, acc: ac, accCol: acc, face: { smile: 0.8, look: [-0.9, 0.4] } }); floorShadow(g, x, BS_F + 2, 80); });
  const hx = lerp(700, 860, es(t, a, 33.4)), bn = bend(4, 1);
  const hr = fall > 0 ? Hero(g, { x: hx, y: BS_F - 70 * fall, hip: fall > 0.5, thigh: 20, s: 1.05, view: 'side', dir: 1, lean: 0.35, headOff: [30, 40], face: { look: [0.6, 0.9], sad: 1, smile: -0.3, blink: blink(t, 0.4) } }, { dir: 1 })
    : walker(g, hx, BS_F, 1.05, 1, t * 3, { lean: bn.lean, headOff: bn.headOff, face: { sad: 0.9, smile: -0.2 } }, 0.6);
  floorShadow(g, hx, BS_F + 2, 90);
  backpack(g, hr, 1.05, 1, 4);
  noCam(g); glow(g, W / 2, H * 0.22, 420, '255,58,44', 0.12 * Math.min(seg(t, 34.2, 34.6), 1 - seg(t, 36.4, 36.9)));
  demonText(g, "they'll hate you.", CAM.x, CAM.y + (H * 0.22 - H / 2) / CAM.z, t, Math.min(seg(t, 34.3, 34.7), 1 - seg(t, 36.4, 36.9)), 80);
  bagHud(g, KGS[4]);
  caption(g, 'Nobody carried *him*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.3; s3.fout = 0.4;
// WISDOM
const s4 = card2('Saying yes to everyone', 'means saying *no* to you.', 0.3, 1.7, 70);
defineClip(23, T, [s1, s2, s3, s4]);
})();
