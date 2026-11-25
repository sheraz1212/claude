// CLIP 1 (0:00-0:33) - 2:14 AM, the text to his boss: "Read". The office chair. The subway stairs.
(() => {
const T = [0, 6, 11, 17.5, 22, 28.5, 33];
sfx(0.0, 'night-amb'); sfx(0.4, 'thread-creak', 0.7); sfx(2.6, 'thread-creak', 0.6);
sfx(6.0, 'room-quiet'); sfx(6.5, 'msg-out', 0.8); sfx(8.0, 'msg-tick', 0.6);
sfx(11.0, 'office-amb'); sfx(11.8, 'phone-tap-soft', 0.6); sfx(13.0, 'thread-creak'); sfx(14.4, 'phone-tap-soft', 0.6); sfx(15.2, 'thread-creak', 0.9);
sfx(17.5, 'room-quiet'); sfx(18.0, 'heartbeat', 0.5); sfx(18.6, 'pop-8bit-1'); sfx(19.4, 'whoosh-soft', 0.6); sfx(20.4, 'cup-clink', 0.5);
sfx(22.0, 'subway-amb'); sfx(22.4, 'steps', 0.7); sfx(24.5, 'bump', 0.8); sfx(24.6, 'thread-creak'); sfx(25.3, 'demon-8bit-1', 0.6); sfx(25.4, 'whisper-laughing', 0.9); sfx(26.6, 'thread-creak', 0.8);
sfx(28.5, 'subway-amb', 0.7); sfx(29.0, 'laugh-soft', 0.7); sfx(30.0, 'whoosh-soft', 0.6); sfx(31.0, 'train-pass', 0.7);

// HOOK (second 0): 2:14 AM, in bed, the phone's glow. A red thread starts to spool out of his head.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(360, 380, u), y: lerp(540, 530, u), z: lerp(1.4, 1.48, u) });
  const r = heroRoom(g, t, { lying: true, eyesOpen: true }); bedGlow(g, t, 0.5);
  threadTo(g, [262, 580], [700, 300], es(t, 0.6, 5.6), 3, t); threadTo(g, [270, 590], [120, 420], es(t, 2.4, 5.8), 5, t);
  loopsHud(g, 1 + Math.floor(es(t, 0.6, 5.6) * 2));
  hookLine(g, t, 'It was all in his *head*.', 0.15, 1.3, 1 - seg(t, 5.4, 5.9));
}
// POV: the text to his boss. "Read 2:14 AM". No reply.
function s2(g, t, a, b) {
  const chat = chatApp('Boss', [{ who: 'me', text: "hey, sorry about the report. I'll fix it asap!! 😅", at: 6.5 }]);
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: (g, px, py, pw, ph, tt) => { chat(g, px, py, pw, ph, tt); if (tt > 8.0) { g.fillStyle = '#9aa3ad'; g.font = '600 20px Nunito'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText('Read 2:14 AM', px + pw - 34, py + 330); } } });
  loopsHud(g, 3);
  caption(g, 'He texted his boss. It said *Read*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM (the office, next morning): he checks it again and again. The thread winds his chair.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 12.6, 16.4);
  setCam(g, { x: lerp(930, 950, u), y: 560, z: lerp(1.35, 1.42, u) });
  office(g, t, { day: true });
  P(g, { x: 360, y: 760, hip: true, thigh: 20, s: 0.9, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', ...pose('table', 360, 760, 0.9, { hip: true, tableY: 742 }) }); officeDesk(g, 360, 760, 0.9);
  P(g, { x: 1560, y: 760, hip: true, thigh: 20, s: 0.9, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', ...pose('table', 1560, 760, 0.9, { hip: true, tableY: 742 }) }); officeDesk(g, 1560, 760, 0.9, { monX: -90 });
  box(g, 880, 520, 160, 200, '#24222c', 20);   // his chair back
  const ph = pose('phone', 960, 760, 1.05, { hip: true });
  const r = Hero(g, { x: 960, y: 760, hip: true, thigh: 20, s: 1.05, ...ph, headOff: [0, 6], face: { look: [0.2, 0.9], sad: 0.5, wide: 1.1, blink: blink(t, 0.4) } }, { dir: 1 });
  phoneAt(g, ph.handR[0], ph.handR[1] - 10, 1.05, 0.8);
  threadTo(g, [r.head[0] - 20, r.head[1] - 20], [880, 560], seg(t, 11.6, 13), 7, t);
  wind(g, 960, 640, 120, 30, 6, w, t);
  officeDesk(g, 960, 760, 1.05, { monX: -110, mug: true });
  loopsHud(g, 3 + Math.floor(w * 9));
  caption(g, 'He checked it *again*. And again.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.4;
// SPLIT: what he imagined (boss furious) / what happened (boss making coffee, phone face down)
function s4(g, t, a, b) {
  splitFrame(g, t, a, b,
    g => { setCam(g, { x: 960, y: 650, z: 1.0 }); office(g, t); const bs = Hero(g, { x: 960, y: OF_F, s: 1.05, ...BOSS, ...pose('phone', 960, OF_F, 1.05), face: { look: [0, 0.6], sad: -0.8, smile: -0.4 } }, { dir: 1 }); tie(g, bs, 1.05); headText(g, "you're done.", bs.head[0], bs.head[1] - 110, t, 18.6, 21.9); },
    g => { setCam(g, { x: 900, y: 650, z: 1.0 }); kitchen(g, t, { lamp: 0.6 }); const bs = Hero(g, { x: 900, y: K_F, s: 1.05, ...BOSS, ...pose('hold', 900, K_F, 1.05), face: { look: [-0.5, 0.3], smile: 0.5, blink: blink(t, 1) } }, { dir: -1 }); tie(g, bs, 1.05); chai(g, 900, 680); box(g, 1100, 724, 40, 10, '#0a0a0e', 3); });
  loopsHud(g, 12);
}
// WIDE (the subway): coming down the stairs, he slips on the last step. A whisper: "they're laughing at you."
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = seg(t, 22.2, 24.4), slip = es(t, 24.4, 24.7) * (1 - es(t, 25.0, 25.6)), w = es(t, 24.6, 27.4), sh = shake(t, 24.5, 8);
  setCam(g, { x: lerp(1060, 1080, u) + sh, y: 600, z: lerp(1.2, 1.26, u) });
  subway(g, t);
  [[500, '#A9A9B4', 'cap', '#b8483a'], [720, '#C9A77A', 'glasses', ''], [860, '#8d8d9b', 'longhair', '#2e2a33']].forEach(([x, c, ac, acc], i) => { P(g, { x, y: SW_F, s: 1.0, col: c, acc: ac, accCol: acc, ...(i === 1 ? pose('phone', x, SW_F, 1.0) : {}), face: { look: [i === 1 ? 0 : 0.6, i === 1 ? 0.9 : 0], blink: blink(t, i) } }); floorShadow(g, x, SW_F + 2, 80); });
  const hx = lerp(1520, 1120, down), hy = down < 1 ? SW_F - 40 - (1 - down) * 160 : SW_F;
  const r = down < 1 ? walker(g, hx, hy, 1.05, -1, t * 6, { face: { smile: 0.1 } }) : Hero(g, { x: 1120 - slip * 30, y: SW_F, s: 1.05, view: 'side', dir: -1, lean: -0.3 * slip, headOff: [-20 * slip, 10 * slip], handL: slip > 0.3 ? [1010, 760] : null, face: { look: [-0.6, 0.2], wide: 1.3, sad: 0.6, smile: -0.2 } }, { dir: -1 });
  floorShadow(g, down < 1 ? hx : 1120, SW_F + 2, 90);
  if (t > 24.4) { wind(g, (down < 1 ? hx : 1120), SW_F - 40, 60, 16, 5, w, t, 0.1); threadTo(g, [r.head[0], r.head[1] - 30], [1120, SW_F - 60], seg(t, 24.5, 25.2), 9, t); }
  noCam(g); glow(g, W / 2, 190, 420, '255,58,44', 0.12 * Math.min(seg(t, 25.3, 25.7), 1 - seg(t, 27.6, 28.1)));
  demonText(g, "they're laughing at you.", CAM.x, CAM.y + (190 - H / 2) / CAM.z, t, Math.min(seg(t, 25.4, 25.8), 1 - seg(t, 27.6, 28.1)), 78);
  loopsHud(g, 12 + Math.floor(w * 18));
  caption(g, 'One small *slip* on the stairs.', capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.4;
// SPLIT: imagined (everyone pointing, laughing) / happened (nobody even looked up)
function s6(g, t, a, b) {
  const crowd = (g, laugh) => { setCam(g, { x: 760, y: 660, z: 1.0 }); subway(g, t);
    [[500, '#A9A9B4', 'cap', '#b8483a'], [720, '#C9A77A', 'glasses', ''], [940, '#8d8d9b', 'longhair', '#2e2a33']].forEach(([x, c, ac, acc], i) => {
      P(g, { x, y: SW_F, s: 1.05, col: c, acc: ac, accCol: acc, ...(laugh ? { handR: [x + 90, 560 + Math.sin(t * 9 + i) * 8] } : pose('phone', x, SW_F, 1.05)), headOff: laugh ? [0, -Math.abs(Math.sin(t * 9 + i)) * 6] : [0, 6], face: laugh ? { look: [0.9, 0], smile: 1, sad: -0.4 } : { look: [0, 0.9], smile: 0, blink: blink(t, i) } }); floorShadow(g, x, SW_F + 2, 80); if (!laugh) { const pp = pose('phone', x, SW_F, 1.05); phoneAt(g, pp.handR[0], pp.handR[1] - 10, 1.05, 0.7); } }); };
  splitFrame(g, t, a, b, g => crowd(g, true), g => crowd(g, false));
  loopsHud(g, 30);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
