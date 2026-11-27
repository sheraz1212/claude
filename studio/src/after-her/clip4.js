// AFTER HER - CLIP 4 (1:44-2:14): the recovery, mirrored - the gym at dawn, game night, the cafe (just a cafe now),
// one hard night (he puts the phone down and plays), and her memory slowly fading.
(() => {
const T = [104, 110, 116, 122, 128, 134];
sfx(104.0, 'gym-amb'); sfx(104.8, 'weight-clank', 0.6); sfx(106.6, 'weight-clank', 0.7); sfx(108.0, 'clap-soft', 0.6); sfx(108.6, 'pop-8bit-1');
sfx(110.0, 'court-amb'); sfx(110.6, 'ball-bounce', 0.6); sfx(112.4, 'net-swish'); sfx(112.6, 'crowd-cheer', 0.5); sfx(113.4, 'clap-soft', 0.7);
sfx(116.0, 'cafe-amb'); sfx(116.6, 'cup-clink', 0.6); sfx(118.4, 'pencil', 0.6); sfx(119.6, 'memory-chime', 0.6); sfx(120.4, 'celesta-sparkle', 0.6);
sfx(122.0, 'night-amb'); sfx(122.6, 'phone-buzz', 0.6); sfx(124.6, 'phone-down', 0.7); sfx(125.4, 'guitar-strum', 0.6); sfx(126.8, 'guitar-strum', 0.6);
sfx(128.0, 'room-quiet'); sfx(128.6, 'guitar-strum', 0.4); sfx(131.0, 'celesta-sparkle', 0.5);

// WIDE (the gym at dawn): he's back. His best friend spots him. A high five.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), rep = Math.abs(Math.sin((t - a) * 2.2)), hi5 = t > 108 && t < 109.2;
  setCam(g, { x: lerp(920, 960, u), y: 560, z: lerp(1.15, 1.22, u) });
  cGym(g, t);
  memoryHer(g, 560, CG_F, 1.0, 0.5 - 0.2 * seg(t, a, b), { face: { look: [0.8, 0], smile: 0.6 } });
  const pc = pose('cheer', 900, CG_F, 1.05);
  Hero(g, { x: 900, y: CG_F, s: 1.05, ...(hi5 ? { handR: [1010, 560] } : { handL: [pc.handL[0], lerp(pc.handL[1] + 120, pc.handL[1], rep)], handR: [pc.handR[0], lerp(pc.handR[1] + 120, pc.handR[1], rep)] }), face: { look: [0.6, -0.3], smile: 0.6, sad: -0.3, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 900, CG_F + 2, 90);
  if (!hi5) for (const h of [[pc.handL[0], lerp(pc.handL[1] + 120, pc.handL[1], rep)], [pc.handR[0], lerp(pc.handR[1] + 120, pc.handR[1], rep)]]) dumbbell(g, h[0], h[1], 1.2);
  Hero(g, { x: 1120, y: CG_F, s: 1.05, ...DANNY, ...(hi5 ? { handL: [1010, 560] } : {}), face: { look: [-0.8, -0.1], smile: 0.9 } }, { dir: -1 }); floorShadow(g, 1120, CG_F + 2, 90);
  daysHud(g, 64);
  caption(g, 'He went back to the *gym*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.4;
// WIDE (game night): he shoots - it goes in. The boys cheer.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = es(t, 111.6, 112.0), fly = seg(t, 112.0, 112.5);
  setCam(g, { x: lerp(1080, 1120, u), y: 560, z: lerp(1.15, 1.2, u) });
  cCourt(g, t);
  [[700, '#A9A9B4', 'cap', '#2f4f7a'], [1240, '#C9A77A', 'scarf', '#c0453a'], [1400, '#8d8d9b', 'glasses', '']].forEach(([x, c, ac, acc]) => { P(g, { x, y: CC_F, s: 1.0, col: c, acc: ac, accCol: acc, ...(t > 112.6 ? pose('cheer', x, CC_F, 1.0) : {}), face: { smile: 0.9, look: [0.5, -0.3] } }); floorShadow(g, x, CC_F + 2, 80); });
  const hx = 1000;
  Hero(g, { x: hx, y: CC_F - Math.sin(Math.PI * sh) * 30, s: 1.05, ...(t < 111.6 ? pose('dribble', hx, CC_F, 1.05) : t < 112.4 ? pose('shoot', hx, CC_F, 1.05) : pose('cheer', hx, CC_F, 1.05)), face: { look: [0.7, -0.4], smile: 0.95, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, hx, CC_F + 2, 90);
  const bx = t < 111.6 ? hx + 66 : t < 112.0 ? hx + 30 : lerp(hx + 40, 1570, fly), by = t < 111.6 ? CC_F - 40 - Math.abs(Math.sin(t * 7)) * 110 : t < 112.0 ? 540 : lerp(540, 370, fly) - Math.sin(Math.PI * fly) * 220 + (t > 112.5 ? (t - 112.5) * 500 : 0);
  ball(g, Math.min(bx, 1570), Math.min(by, CC_F - 22), 1);
  daysHud(g, 70);
  caption(g, 'He said *yes* to his friends.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// MEDIUM (the cafe): their old table. He sits there with his sketchbook. Her memory smiles across from him - and drifts away as petals.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), go = es(t, 119.6, 121.4);
  setCam(g, { x: lerp(960, 965, u), y: 560, z: lerp(1.4, 1.46, u) });
  cCafe(g, t);
  if (go < 1) memoryHer(g, 1120, 770, 1.0, 0.8 * (1 - go), { hip: true, thigh: 20, ...pose('table', 1120, 770, 1.0, { hip: true, tableY: 712 }), face: { look: [-0.8, 0], smile: 0.8 } });
  petals(g, 1120, 560, t, 119.6, 24);
  Hero(g, { x: 800, y: 770, hip: true, thigh: 20, s: 1.05, ...pose('table', 800, 770, 1.05, { hip: true, tableY: 712 }), handR: [870 + Math.sin(t * 8) * 8, 706], headOff: [0, t < 119.4 ? 8 : 0], face: { look: t < 119.4 ? [0.3, 0.8] : [0.8, -0.1], smile: t > 119.6 ? 0.6 : 0.2, blink: blink(t, 0.4) } }, { dir: 1 });
  cafeTable(g, 960, 712, 420); chai(g, 1050, 712); box(g, 820, 700, 140, 10, '#f7f4ec', 3);
  daysHud(g, 78);
  caption(g, 'The same café. This time, it was *just* a café.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.4;
// MEDIUM (night, the relapse): his phone buzzes - her new photo, with someone. He looks... puts the phone down, picks up his guitar.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = t > 124.6, gtr = t > 125.0, PH = pose('phone', SIT[0], SIT[1], SS, { hip: true });
  setCam(g, { x: lerp(560, 580, u), y: 520, z: lerp(1.45, 1.52, u) });
  const r = cOnBed(g, t, { mode: 'night', lamp: 1, hero: gtr ? { handL: [SIT[0] - 90, SIT[1] - 150], handR: [SIT[0] + 30 + Math.sin(t * 14) * 8, SIT[1] - 110], face: { look: [-0.4, 0.6], smile: 0.3, sad: 0.3, blink: blink(t, 0.6) } } : { ...PH, headOff: [0, 8], face: { look: [0.1, 0.9], sad: 0.9, blink: blink(t, 0.6) } },
    mid: r => { if (gtr) heldGuitar(g, r, SS, 1); } });
  if (!down) { phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 1); const k = seg(t, 122.8, 123.2); g.save(); g.globalAlpha = k; const cx = SIT[0] + 250, cy = SIT[1] - 330; box(g, cx - 110, cy - 90, 220, 180, '#ffc27a', 10); person(g, { x: cx - 40, y: cy + 80, s: 0.3, ...GF, face: { smile: 0.9 } }); person(g, { x: cx + 40, y: cy + 80, s: 0.32, col: '#A9A9B4', acc: 'cap', accCol: '#2a2a2a', face: { smile: 0.9 } }); g.fillStyle = '#ffc27a'; g.beginPath(); g.moveTo(cx - 60, cy + 90); g.lineTo(PH.handR[0] + 10, PH.handR[1] - 30); g.lineTo(cx - 20, cy + 90); g.fill(); g.restore(); }
  else box(g, 60, 632, 40, 8, '#0a0a0e', 2);
  daysHud(g, 84);
  caption(g, 'Some nights were still *hard*. He didn\'t look back.', capA(t, a + 0.4, b - 0.1), ACC);
}
s4.fin = 0.3;
// MEDIUM: day by day the memory gets lighter - she sits at the end of his bed, almost gone, and waves.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), d = Math.round(lerp(84, 90, es(t, a, b - 1)));
  setCam(g, { x: lerp(620, 640, u), y: 520, z: lerp(1.35, 1.4, u) });
  cOnBed(g, t, { mode: 'morning', lamp: 0, behind: () => memoryHer(g, SIT[0] + 260, SIT[1], SS, 0.45 * (1 - seg(t, 131.4, 133.6)), { hip: true, thigh: 20, ...(t > 130 ? pose('wave', SIT[0] + 260, SIT[1], SS, { hip: true, dir: -1 }) : {}), face: { look: [-0.8, 0], smile: 0.9 } }),
    hero: { ...pose('hold', SIT[0], SIT[1], SS, { hip: true }), face: { look: [0.8, 0], smile: 0.6, blink: blink(t, 0.6) } } });
  petals(g, SIT[0] + 260, SIT[1] - 150, t, 131.4, 18);
  daysHud(g, d);
  caption(g, 'Day by day, the memory got *lighter*.', capA(t, a + 0.4, b - 0.1), ACC);
}
defineClip(104, T, [s1, s2, s3, s4, s5]);
})();
