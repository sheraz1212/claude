// CLIP 4 (1:30-1:57) - the turn: wisdom lines, he deletes every fake post, a plain photo,
// and he calls Mom and tells her the truth.
(() => {
const T = [90, 94.2, 101, 105, 112, 117];
sfx(90.3, 'pen-write'); sfx(92.0, 'pen-write', 0.9);
sfx(94.2, 'room-quiet'); for (let i = 0; i < 9; i++) sfx(94.6 + i * (5.8 / 9), 'delete', 0.7 + 0.03 * i);
sfx(101.0, 'room-quiet'); sfx(102.0, 'camera-shutter', 0.6); sfx(102.4, 'tap', 0.7);
sfx(105.0, 'night-amb'); sfx(105.2, 'phone-ring', 0.7); sfx(105.6, 'pop-8bit-2'); sfx(108.6, 'pop-8bit-3');
sfx(112.0, 'room-quiet'); sfx(113.0, 'breath', 0.8); sfx(115.2, 'breath', 0.6);

// WISDOM (black card)
const s1 = card2('He showed everyone a life', 'and forgot to *live* one.', 0.3, 1.7, 84);
// POV: one by one, he deletes the lie. The likes fall to zero.
function s2(g, t, a, b) {
  const n = 9;
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: profileApp({ pics: ['car', 'hotel', 'steak', 'jacket', 'hotel', 'car', 'steak', 'jacket', 'car'], gone: t => clamp((t - 94.6) / 5.8) * n, del: [94.6, 100.4] }),
    thumb: t => { const k = ((t - 94.6) / (5.8 / n)) % 1; return [1080 + Math.sin(t) * 30, 700 - (k < 0.3 ? 30 : 0)]; } });
  likesHud(g, t);
  caption(g, 'One by one, he deleted the *lie*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV: a new profile photo - plain, real.
function s3(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: profileApp({ pics: [], plainAt: 102.4 }), zoom: 1.08 });
  likesHud(g, t, 1 - seg(t, 104, 104.8));
  caption(g, 'Just *Alex*.', capA(t, 102.6, b - 0.1), ACC);
}
// SPLIT SCREEN: Mom in her kitchen at night, him on his bed. The truth.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  g.save(); noCam(g); g.beginPath(); g.rect(0, 0, 956, H); g.clip();
  setCam(g, { x: lerp(1515, 1525, u), y: 520, z: 1.5 });
  kitchen(g, t, { night: true, lamp: 0.8 });
  const pe = pose('ear', 1200, K_F, 1.05, { dir: 1 });
  const mm = Mom(g, { x: 1200, y: K_F, s: 1.05, ...pe, face: { look: [0.3, 0.2], smile: t > 109 ? 0.5 : 0.1, sad: t > 107.8 ? 0.6 : 0.2, blink: blink(t, 1.2) } }, { dir: 1 }); floorShadow(g, 1200, K_F + 2, 90);
  phoneAt(g, pe.handR[0], pe.handR[1], 1.05, 0.2, 0.2);
  headText(g, 'I just want you to be okay.', mm.head[0], mm.head[1] - 120, t, 108.6, 111.8);
  g.restore();
  g.save(); noCam(g); g.beginPath(); g.rect(964, 0, 956, H); g.clip();
  setCam(g, { x: lerp(215, 205, u), y: 500, z: 1.5 });
  const ps = pose('ear', SIT[0], SIT[1], SS, { hip: true });
  const r = onBed(g, t, { under: 0, hero: { ...ps, headOff: [0, 8], face: { look: [-0.3, 0.6], sad: 0.8, smile: t > 110 ? 0.2 : -0.1, blink: blink(t, 0.6) } } });
  phoneAt(g, ps.handR[0], ps.handR[1], SS, 0.2, -0.2);
  headText(g, "Mom... things aren't as good as they look.", r.head[0] + 40, r.head[1] - 110, t, 105.6, 108.4);
  g.restore();
  noCam(g); g.fillStyle = '#000'; g.fillRect(956, 0, 8, H);
  caption(g, 'He called his mom. He told her the *truth*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.4;
// CLOSE: tears - then, for the first time in months, a real small smile
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), sm = es(t, 114.2, 115.4);
  setCam(g, { x: lerp(560, 565, u), y: 545, z: lerp(2.2, 2.3, u) });
  const ps = pose('ear', SIT[0], SIT[1], SS, { hip: true });
  const r = onBed(g, t, { under: 0.3 * sm, hero: { ...ps, headOff: [0, lerp(10, 4, sm)], face: { look: [0.2, 0.5], sad: lerp(0.9, 0.3, sm), smile: lerp(-0.2, 0.45, sm), blink: blink(t, 0.6) } } });
  phoneAt(g, ps.handR[0], ps.handR[1], SS, 0.2, -0.2);
  for (const [off, sp] of [[0, 1.6], [0.8, 1.9]]) { const k = ((t - a + off) / sp) % 1; g.fillStyle = `rgba(150,200,255,${0.85 * (1 - k)})`; g.beginPath(); g.ellipse(r.head[0] + 24, r.head[1] + 8 + k * 46, 4, 6, 0, 0, 7); g.fill(); }
  caption(g, 'She never cared about the *likes*.', capA(t, a + 0.4, b - 0.1), ACC);
}
defineClip(90, T, [s1, s2, s3, s4, s5]);
})();
