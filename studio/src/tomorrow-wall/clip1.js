// CLIP 1 (0:00-0:30) - cold open: the wall is full, Sam leaves.
(() => {
const T = [0, 4.5, 10.5, 16, 21.5, 26.5, 30];
sfx(0.5, 'pen-write'); sfx(9.6, 'phone-buzz-muffled');
for (const a of [11.5, 12.9, 14.4]) { sfx(a, 'phone-buzz'); sfx(a + 0.02, 'msg-tick'); }
sfx(16.6, 'cloth-rustle'); sfx(17.5, 'paper-peel'); sfx(18.3, 'piano-low-hit'); sfx(21.5, 'truck-leave'); sfx(26.9, 'paper-crinkle'); sfx(28.3, 'piano-tear-note');

const s1 = card("He'd start *tomorrow*.", 0.5, 2.7);

// WIDE (the place): the whole wall is covered, even the window. He sits alone.
function s2(g, t) {
  const u = ease(seg(t, T[1], T[2]));
  setCam(g, { x: lerp(960, 1085, u), y: lerp(540, 525, u), z: lerp(1, 1.13, u) });
  room(g, t, { sc: 2, phoneOn: t > 9.6 && (t < 9.95 || t > 10.05) });
  const turn = es(t, 9.75, 10.25);
  heroSit(g, t, { headOff: [lerp(0, -5, turn), 12 + Math.sin(t * 1.3) * 1.2], headTilt: lerp(0, -0.08, turn),
    face: { look: [lerp(0, -0.75, turn), lerp(0.9, 0.75, turn)], blink: (t > 7.2 && t < 7.36) ? 1 : 0.3, sad: 0.9, smile: -0.45 } });
  caption(g, 'His wall was *full*.', capA(t, T[1] + 0.5, T[2] - 0.1), ACC);
}
s2.fin = 0.5;

// POV PHONE (what he sees): Sam's messages. His own last answer was "tomorrow."
function s3(g, t) {
  phoneShot(g, t, { t0: T[2], t1: T[3], name: 'Sam', sub: 'best friend', who: 'sam', clock: 'FRI 8:02', buzz: [11.5, 12.9, 14.4], msgs: [
    { day: 'Yesterday' }, { who: 's', text: 'last day is friday. come say bye?' }, { who: 'h', text: 'tomorrow.' },
    { day: 'Today', at: 11.5 }, { who: 's', text: "truck's here.", at: 11.5 }, { who: 's', text: 'u coming?', at: 12.9 }, { who: 's', text: 'ok. bye bro.', at: 14.4 }] });
  caption(g, 'His best friend was *leaving*.', capA(t, T[2] + 0.4, T[3] - 0.1), ACC);
}

// MEDIUM from behind (the action): he peels one note off the window. Light comes in.
const HX = 1030, HY = 800;
function handAt(t) {
  const a = [GN.cx - 28, GN.cy + 36];
  return [kf(t, [[16.5, 1094], [17.3, a[0]], [17.5, a[0]], [18.4, 1168], [19.8, 1176]]), kf(t, [[16.5, 690], [17.3, a[1]], [17.5, a[1]], [18.4, 520], [19.8, 566]])];
}
function shaft(g, a) {
  if (a <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createLinearGradient(GN.cx, GN.cy, GN.cx - 330, 900);
  gr.addColorStop(0, `rgba(190,205,245,${0.34 * a})`); gr.addColorStop(1, 'rgba(190,205,245,0)');
  g.fillStyle = gr; g.filter = 'blur(10px)';
  g.beginPath(); g.moveTo(GN.cx - 52, GN.cy - 52); g.lineTo(GN.cx + 52, GN.cy - 30); g.lineTo(GN.cx - 80, 920); g.lineTo(GN.cx - 640, 920); g.closePath(); g.fill();
  g.filter = 'none';
  const b = g.createRadialGradient(GN.cx, GN.cy, 20, GN.cx, GN.cy, 230); b.addColorStop(0, `rgba(200,215,255,${0.5 * a})`); b.addColorStop(1, 'rgba(200,215,255,0)');
  g.fillStyle = b; g.fillRect(GN.cx - 240, GN.cy - 240, 480, 480);
  g.restore();
}
function s4(g, t) {
  const u = ease(seg(t, T[3], T[4]));
  setCam(g, { x: lerp(1050, 1070, u), y: lerp(488, 470, u), z: lerp(1.72, 1.9, u) });
  const peeled = t >= 17.5, open = es(t, 17.55, 18.3);
  room(g, t, { sc: 2, n: peeled ? 96 : 97 });
  shaft(g, open * 0.6);
  const h = handAt(t), lookIn = es(t, 18.6, 19.6);
  floorShadow(g, HX, HY, 90);
  const act = () => actor(g, { x: HX, y: HY, s: 1.2, view: 'back', lean: lookIn * 0.06, headOff: [lookIn * 16, -lookIn * 4 + Math.sin(t * 1.4)], handR: t >= 16.5 ? h : null, bendR: 1 },
    { dir: 1, amt: 0.25 + 0.3 * open, dim: 0.16 - 0.1 * open });
  if (peeled) {
    const k = es(t, 17.5, 18.4);
    act(); drawNote(g, { ...GN, cx: h[0] + 28 + k * 16, cy: h[1] - 36 + k * 20, rot: GN.rot + k * 0.35 }, k > 0.3 ? 'wall' : 'back');
    g.fillStyle = C.cream; g.strokeStyle = C.line; g.lineWidth = 3; g.beginPath(); g.ellipse(h[0] + 2, h[1] - 4, 12, 16, 0.3, 0, 7); g.fill(); g.stroke();
  } else act();
  shaft(g, open * 0.45);
  caption(g, 'He looked. Too *late*.', capA(t, 18.4, T[4] - 0.1), ACC);
}

// POV through the gap (what he sees): the moving truck pulls away with Sam inside.
function street(g, t) {
  skyline(g, 606, 240, 1700, 77, '#171422', [[0, '#15132a'], [0.6, '#4b3f5e'], [1, '#a88a86']]);
  g.fillStyle = '#262431'; g.fillRect(0, 606, W, 40);
  g.fillStyle = '#16151c'; g.fillRect(0, 646, W, 440);
  g.fillStyle = '#3b3946'; for (let i = 0; i < 12; i++) g.fillRect(260 + i * 130, 738, 70, 6);
  g.fillStyle = '#23212b'; g.fillRect(0, 880, W, 200);
  streetLamp(g, 1310, 640, 290, 0.9);
  const wv = Math.sin(t * 7) * 0.25;
  person(g, { x: 1400, y: 638, s: 0.44, col: '#8d8d9b', acc: 'glasses', face: { look: [-0.5, 0], smile: 0.3 }, armL: [2.55 + wv, 0.3], armLines: false });
  const wx = 780 - (t - T[4]) * 46;
  walker(g, wx, 640, 0.44, -1, wx / 22, { col: '#9a8b78', acc: 'scarf' });
  const tt = Math.max(0, t - 22.5), tx = 520 + 0.5 * 250 * tt * tt, ty = 838 + (tt > 0 ? Math.sin(t * 30) * 1.2 : Math.sin(t * 40) * 0.8);
  floorShadow(g, tx + 330, 842, 380, 0.5);
  g.save(); g.translate(tx, ty);
  g.lineJoin = 'round'; g.strokeStyle = '#8c8c9c'; g.lineWidth = 3;
  rr(g, 0, -300, 450, 262, 8); g.fillStyle = '#2b2d3d'; g.fill(); g.stroke();
  g.fillStyle = 'rgba(243,233,210,0.8)'; g.font = '700 54px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MOVING', 225, -190);
  g.strokeStyle = 'rgba(243,233,210,0.6)'; g.strokeRect(180, -150, 44, 40); g.strokeRect(226, -150, 44, 40);
  g.strokeStyle = '#8c8c9c';
  g.beginPath(); g.moveTo(458, -38); g.lineTo(458, -210); g.lineTo(560, -210); g.lineTo(630, -120); g.lineTo(668, -110); g.lineTo(668, -38); g.closePath(); g.fillStyle = '#34374a'; g.fill(); g.stroke();
  const winPath = () => { g.beginPath(); g.moveTo(474, -196); g.lineTo(552, -196); g.lineTo(604, -124); g.lineTo(474, -124); g.closePath(); };
  g.save(); winPath(); g.fillStyle = '#12121a'; g.fill(); g.clip();
  person(g, { x: 532, y: 26, s: 0.5, view: 'side', dir: -1, ...SAM, face: { look: [0, -0.3], sad: 0.8, smile: -0.4 } });
  g.restore(); winPath(); g.stroke();
  g.fillStyle = '#ffdca0'; g.fillRect(656, -96, 12, 20);
  for (const wxx of [110, 360, 590]) { g.fillStyle = '#0b0b10'; g.beginPath(); g.arc(wxx, -30, 40, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(wxx, -30, 15, 0, 7); g.stroke(); const a = tx / 40; g.beginPath(); g.moveTo(wxx, -30); g.lineTo(wxx + Math.cos(a) * 15, -30 + Math.sin(a) * 15); g.stroke(); }
  g.restore();
}
let _MASK;
function s5(g, t) {
  const u = ease(seg(t, T[4], T[5]));
  setCam(g, { x: 940 + u * 30, y: 610, z: 1.22 });
  street(g, t);
  if (!_MASK) {
    _MASK = mk(W, H); const m = _MASK.getContext('2d'), r = rng(12);
    m.fillStyle = '#08070b'; m.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { m.save(); m.translate(r() * W, r() * H); m.rotate((r() - 0.5) * 0.3); m.fillStyle = `hsl(43,55%,${6 + r() * 5}%)`; m.fillRect(-330, -330, 660, 660); m.restore(); }
    m.globalCompositeOperation = 'destination-out';
    m.translate(960, 520); m.rotate(-0.03); m.fillRect(-640, -400, 1280, 800);
  }
  const z = lerp(1.0, 1.05, u);
  noCam(g); g.save(); g.filter = 'blur(6px)';
  g.drawImage(_MASK, W / 2 - W * z / 2, H / 2 - H * z / 2, W * z, H * z); g.restore();
  caption(g, "The truck didn't *wait*.", capA(t, T[4] + 0.6, T[5] - 0.1), ACC);
}
function s6(g, t) { closeNote(g, t, seg(t, T[5], T[6] + 0.3), 'It said *tomorrow*.'); }
s6.fout = 0.45;
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
