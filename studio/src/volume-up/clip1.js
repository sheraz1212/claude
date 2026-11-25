// CLIP 1 (0:00-0:32) - the hook, Grandpa's harmonica, the headphones go on.
(() => {
const T = [0, 3, 9.5, 15.5, 21, 26.5, 32];
sfx(0.1, 'pen-write', 0.8); sfx(0.25, 'phones-leak', 0.5); [0.5, 0.75, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0].forEach((x, i) => sfx(x, 'vol-tick', 0.6 + i * 0.05));
sfx(3.0, 'living-amb'); sfx(3.4, 'harm-tune-1'); sfx(4.6, 'dish-clink', 0.6); sfx(9.5, 'living-amb'); sfx(10.5, 'pop-8bit-1');
sfx(15.5, 'living-amb'); sfx(16.3, 'pop-8bit-2'); sfx(17.9, 'phones-on'); sfx(18.3, 'phones-leak', 0.7); [18.4, 18.7, 19.0, 19.3].forEach(x => sfx(x, 'vol-tick', 0.6));
sfx(21.0, 'living-amb'); sfx(21.0, 'phones-leak', 0.6); sfx(21.7, 'pop-8bit-3'); sfx(23.0, 'demon-8bit-1'); sfx(23.7, 'whisper-boring'); [24.6, 24.9].forEach(x => sfx(x, 'vol-tick', 0.6));
sfx(26.6, 'phones-leak', 0.9); [26.9, 27.3, 27.7, 28.1, 28.5].forEach(x => sfx(x, 'vol-tick', 0.7)); sfx(29.0, 'phone-warn'); sfx(30.3, 'tap', 0.9);

// the family evening (used by s2, s3, s5)
function evening(g, t, o = {}) {
  livingRoom(g, t, { mom: () => { const k = Math.sin(t * 3.2); const m = Mom(g, { x: 230, y: 832, s: 0.95, view: 'side', dir: -1, handL: [168 + k * 8, 650], handR: [178 - k * 8, 652], face: { look: [-0.5, 0.6] } }); floorShadow(g, 230, 834, 90, 0.4); }, harm: o.harm, behind: o.behind });
  const gs = 1.15, pl = o.gPlay ? playPose(ARM[0], ARM[1], gs, { hip: true, lean: -0.05 }) : {};
  const gp = Gpa(g, { x: ARM[0], y: ARM[1], hip: true, thigh: 20, s: gs, armLines: !o.gPlay, lean: o.gPlay ? -0.05 : -0.08, headTilt: o.gTilt || 0, ...pl, face: { look: o.gLook || [-0.6, 0.1], smile: o.gSmile ?? 0.6, blink: blink(t, 1.1) }, ...(o.gpa || {}) }, { dir: 1 });
  if (o.gPlay) { harmonica(g, pl._h[0], pl._h[1], gs); notes(g, pl._h[0] - 30, pl._h[1] - 40, t, o.gPlay, 1, '255,214,150', -1); }
  const hr = Hero(g, { x: SOFA[0], y: SOFA[1], hip: true, thigh: 20, s: 1.15, face: { look: o.hLook || [0.6, 0.2], smile: o.hSmile ?? 0.2, sad: o.hSad || 0, blink: blink(t, 0.3) }, handR: o.phone ? [SOFA[0] + 44, SOFA[1] - 40] : null, handL: o.phone ? [SOFA[0] - 58, SOFA[1] - 4] : null, armLines: !o.phone, ...(o.hero || {}) }, { dir: 1 });
  lrFront(g);
  if (o.phone) phoneIn(g, [SOFA[0] + 44, SOFA[1] - 46], 1.15, 0.6);
  if (o.on) phones(g, hr, 1.15, { on: o.on }); else phones(g, hr, 1.15, { neck: true });
  return { gp, hr };
}

// HOOK (over the picture, 3 s): his face in the dark, eyes shut, the bar slams to MAX
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 960, y: 560, z: lerp(1.0, 1.08, u) });
  g.fillStyle = '#07070b'; g.fillRect(-200, -200, 2400, 1500);
  const r = Hero(g, { x: 960, y: 1520, s: 2.6, headTilt: Math.sin(t * 6) * 0.03, face: { look: [0, 0.2], blink: 1, smile: 0.1 } }, { dir: 1, amt: 0.4, dim: 0.45 });
  phones(g, r, 2.6, { on: 1 });
  volBar(g, r.head[0] + 190, r.head[1] - 40, 2.0, kf(t, [[0.3, 2], [2.1, 10]]), es(t, 0.2, 0.5));
  blackLine(g, 'He turned the *volume* up.', seg(t, 0.15, 1.35), ACC, 1, 92, -330);
}
// WIDE (the place, mirrored at the end): the living room, Grandpa plays, Mom washes up
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 990, u), y: lerp(540, 555, u), z: lerp(1, 1.08, u) });
  evening(g, t, { gPlay: 1, gLook: [-0.2, 0.2], gSmile: 0.5, hLook: [0.7, 0.1], hSmile: 0.3 });
  caption(g, 'He lived with his *grandpa*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.5;
// MEDIUM (the offer): Grandpa lowers the harmonica and turns to him
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1390, 1370, u), y: 520, z: lerp(1.4, 1.5, u) });
  const play = 1 - es(t, 10.0, 10.4);
  const { gp } = evening(g, t, { gPlay: play > 0.5 ? play : 0, gLook: [-0.7, 0.05], gSmile: 0.8, gpa: play > 0.5 ? {} : { armLines: false, handR: [ARM[0] + 30, ARM[1] - 40], handL: [ARM[0] - 95, ARM[1] - 70], bendL: -1 } });
  if (play <= 0.5) harmonica(g, ARM[0] - 120, ARM[1] - 72, 1.15, -0.1);
  headText(g, 'want to learn this one?', gp.head[0] - 80, gp.head[1] - 120, t, 10.5, 13.4);
  caption(g, 'Every night, Grandpa played his *harmonica*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (his choice): "not now." - he pulls the headphones on, the bar appears
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(700, 720, u), y: 500, z: lerp(2.0, 2.12, u) });
  const up = es(t, 17.6, 18.0), on = t >= 17.95;
  const r = evening(g, t, { hLook: on ? [0.2, 0.35] : [0.6, 0.1], hSmile: on ? 0.35 : 0, on: on ? 1 : 0, hero: up > 0 && up < 1 ? { handL: [SOFA[0] - 70, SOFA[1] - 175], handR: [SOFA[0] + 70, SOFA[1] - 175] } : (on ? {} : {}) , phone: on && up >= 1 }).hr;
  headText(g, 'not now, grandpa.', r.head[0] - 40, r.head[1] - 120, t, 16.3, 17.6);
  volBar(g, r.head[0] + 100, r.head[1] - 90, 1.0, kf(t, [[18.3, 0], [19.4, 4]]), es(t, 18.1, 18.4));
  caption(g, 'But he had his own *music*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM two-shot (it starts): Grandpa talks, he nods without hearing; a small voice behind the sofa
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1000, u), y: 545, z: lerp(1.3, 1.38, u) });
  const nod = Math.max(0, Math.sin(t * 5)) * 0.06;
  const dA = es(t, 23.0, 23.8);
  const { gp, hr } = evening(g, t, { behind: () => { if (dA > 0) demonAt(g, t, 500, 840, 0.75, "he's boring.", Math.min(seg(t, 23.7, 24.0), 1 - seg(t, 25.9, 26.3)), { a: dA, face: { look: [0.8, 0.2] }, tx: 130, ty: 120, lean: 0.06 }); }, gLook: [-0.7, 0.1], gSmile: 0.5, gpa: { handL: [ARM[0] - 95, ARM[1] - 150 + Math.sin(t * 4) * 8], bendL: -1 }, harm: 'table', on: 1, phone: true, hLook: [0, 0.75], hero: { headTilt: nod }, hSmile: 0.3 });
  headText(g, 'when I was your age...', gp.head[0], gp.head[1] - 120, t, 21.7, 23.6);
  volBar(g, hr.head[0] + 100, hr.head[1] - 90, 1.0, kf(t, [[24.5, 4], [25.0, 6]]));
  caption(g, 'He stopped *listening*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// POV (what he does): the volume slider, a warning, he taps OK
function s6(g, t, a, b) {
  volumePOV(g, t, { t0: a, t1: b, vol: t => kf(t, [[26.8, 0.6], [28.6, 1]]), warn: [29.0, 30.4], thumb: t => t < 29 ? [lerp(1060, 1120, es(t, 26.8, 28.6)), 690] : [lerp(1120, 990, es(t, 29.6, 30.2)), lerp(690, 540, es(t, 29.6, 30.2))] });
  caption(g, 'Every day, a little *louder*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
