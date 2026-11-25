// CLIP 6 (2:40-3:10) - the mirror: same morning, same juice - no explosion. The rocket flies. The lesson.
(() => {
const T = [160, 166, 172, 177.5, 183, 190];
sfx(160.0, 'kitchen-amb'); sfx(160.3, 'sizzle-pan', 0.6); sfx(161.5, 'cup-knock'); sfx(161.7, 'splash-small'); sfx(162.0, 'fuse-light', 0.8); sfx(162.1, 'fuse-hiss', 0.6); sfx(162.5, 'breath-in', 0.7); sfx(163.4, 'breath-out', 0.7); sfx(163.6, 'fizz-out');
sfx(166.0, 'kitchen-amb'); sfx(167.0, 'pop-8bit-1'); sfx(168.4, 'cloth-rustle', 0.5);
sfx(172.0, 'park-amb'); sfx(173.0, 'stomp'); sfx(173.1, 'rocket-launch'); sfx(174.4, 'kids-cheer', 0.8); sfx(175.6, 'celesta-sparkle', 0.7);
sfx(177.5, 'park-amb');
sfx(183.6, 'pen-write');

function table(g, t, o = {}) {
  kitchen(g, t);
  const k = Math.sin(t * 3);
  Mom(g, { x: 430, y: K_F, s: 1.05, handR: o.momTurn ? null : [520 - k * 6, 650], face: { look: o.momTurn ? [0.8, 0] : [-0.2, 0.8], smile: o.momTurn ? 0.8 : 0.3, blink: blink(t, 2.1) } }); floorShadow(g, 430, K_F + 2, 90);
  const sm = Sam(g, { x: KT[0], y: 744, hip: true, thigh: 20, face: { look: [0.7, 0], smile: 0.7, blink: blink(t, 1.3) }, ...(o.sam || {}) }, { dir: 1 });
  const hr = Hero(g, { x: KT[1], y: 744, hip: true, thigh: 20, s: 1.1, handL: [KT[1] - 98, 724], handR: [KT[1] + 98, 722], face: { look: [-0.5, 0.4], smile: 0.3, blink: blink(t, 0.4) }, ...(o.hero || {}) }, { dir: -1 });
  kitchenTable(g, t, { paper: true, spill: o.spill || 0, cupX: o.cupX, cup: o.cup });
  rocket(g, 640, 700, 0.5, 0);
  return { sm, hr };
}
// WIDE (the mirror of the first morning): the cup tips again. The spark - a breath - it goes out.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 161.3, 161.6), inh = es(t, 162.5, 163.2) * (1 - es(t, 163.4, 164));
  setCam(g, { x: lerp(860, 880, u), y: lerp(560, 565, u), z: lerp(1.2, 1.28, u) });
  const { hr } = table(g, t, { cupX: lerp(760, 790, k), cup: k < 0.9, spill: es(t, 161.6, 162), sam: { handR: [lerp(KT[0] + 40, 790, es(t, 160.8, 161.4)), 716], face: { look: [0.6, 0.6], sad: t > 161.6 ? 0.7 : 0, smile: t > 161.6 ? -0.2 : 0.5, wide: t > 161.6 ? 1.3 : 1 } },
    hero: { headOff: [0, -5 * inh], face: { look: [-0.2, 0.8], sad: t > 162 && t < 163.6 ? -0.3 : 0, smile: t > 164.2 ? 0.7 : 0, blink: inh > 0.3 ? 1 : 0 } } });
  if (k > 0.9) { g.save(); g.translate(820, 712); g.rotate(1.4); box(g, -15, -17, 30, 34, '#2c3a4a', 4); g.restore(); }
  if (t > 162) fuse(g, hr, 1.1, 0.3, t, t < 163.6 ? lerp(1, 0.2, seg(t, 162.5, 163.6)) : 0);
  if (t > 163.6) smoke(g, hr.head[0] + 6, hr.head[1] - 80, t, 1 - seg(t, 164.6, 165.9), 1.1);
  caption(g, 'Same morning. Same *juice*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.6;
// MEDIUM (the new ending of the old moment): he laughs, ruffles Sam's cap. Mom turns and smiles.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), rf = Math.sin(t * 10) * es(t, 168.2, 168.5) * (1 - es(t, 169.6, 170));
  setCam(g, { x: lerp(820, 830, u), y: 555, z: lerp(1.35, 1.42, u) });
  const { hr } = table(g, t, { momTurn: true, spill: 1, cup: false, sam: { headOff: [rf * 3, 0], face: { look: [0.6, -0.3], smile: 0.9, blink: t > 168.3 && t < 169.6 ? 1 : 0 } }, hero: { handR: t > 168.2 && t < 170 ? [KT[0] + rf * 10, 600] : [KT[1] + 40, 716], face: { look: [-0.7, 0.3], smile: 0.8 } } });
  fuse(g, hr, 1.1, 0.3, t, 0);
  headText(g, "it's okay.", hr.head[0] + 40, hr.head[1] - 115, t, 167.0, 169.4);
  caption(g, 'This time, *nothing* exploded.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (core place 4, last time): dusk at the playground. A stomp - the rocket flies.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), fly = seg(t, 173.1, 176.5);
  setCam(g, { x: lerp(860, 880, u), y: lerp(540, 470, u), z: lerp(1.05, 1.0, u) });
  playground(g, t);
  const ry = PG_F - 60 - ease(fly) * 1000, rx = 760 + fly * 120;
  if (fly > 0) for (let i = 0; i < 12; i++) { const tt_ = fly - i * 0.02; if (tt_ < 0) continue; glow(g, 760 + tt_ * 120, PG_F - 60 - ease(tt_) * 1000 + 70, 30 - i * 2, FIRE, 0.35 * (1 - i / 12)); }
  rocket(g, rx, ry, 0.6, 0.1 * fly, false, fly > 0 && fly < 1 ? 1 : 0, t);
  box(g, 720, PG_F - 14, 80, 14, '#2a2832', 4);
  const cheer = t > 173.6;
  const sm = Sam(g, { x: 600, y: PG_F, armLines: false, handL: cheer ? [570, PG_F - 270] : [590, PG_F - 150], handR: cheer ? [640, PG_F - 270] : [620, PG_F - 150], face: { look: [0.4, cheer ? -0.8 : 0.2], smile: 1, wide: 1.2 } }); floorShadow(g, 600, PG_F + 2, 50);
  const hr = Hero(g, { x: 900, y: PG_F, s: 1.05, legL: t > 172.8 && t < 173.2 ? [0.4, -0.6] : [0, 0], handL: cheer ? [860, 520] : null, face: { look: [-0.2, cheer ? -0.9 : 0.3], smile: 0.9 } }, { dir: -1 }); floorShadow(g, 900, PG_F + 2, 90);
  fuse(g, hr, 1.05, 0.3, t, 0);
  caption(g, 'The only thing that flew was the *rocket*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.5;
// CLOSE (emotion): him, watching it fall slowly back. The fuse is still there - unlit.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 900, y: lerp(470, 465, u), z: lerp(2.0, 2.1, u) });
  playground(g, t);
  const hr = Hero(g, { x: 900, y: PG_F, s: 1.05, face: { look: [-0.3, -0.5], smile: 0.8, blink: blink(t, 0.6) } }, { dir: -1 });
  fuse(g, hr, 1.05, 0.3, t, 0);
  Sam(g, { x: 760, y: PG_F, handR: [812, PG_F - 130], face: { look: [0.6, -0.4], smile: 1 } });
  caption(g, 'He still had a fuse. Now, he *held* it.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fout = 0.5;
const s5 = card('Breathe before you *burn*.', 0.5, 2.6, 104);
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
