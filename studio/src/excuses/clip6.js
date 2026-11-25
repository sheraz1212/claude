// CLIP 6 (2:40-3:10) - the mirror of the opening: 6:00, already up. The email. The gym with Jay. The lesson.
(() => {
const T = [160, 166, 172, 178, 183, 190];
sfx(160.0, 'morning-amb'); sfx(160.4, 'alarm-ring', 0.5); sfx(161.0, 'snooze-click', 0.8);
sfx(166.0, 'room-quiet'); sfx(166.8, 'msg-tick'); sfx(167.6, 'celesta-sparkle', 0.6);
sfx(172.0, 'gym-amb'); sfx(173.0, 'pop-8bit-1'); sfx(175.2, 'pop-8bit-2'); [172.6, 174.4, 176.2].forEach(x => sfx(x, 'weight-clank', 0.6));
sfx(178.0, 'gym-amb'); sfx(179.0, 'bar-ding'); sfx(179.2, 'celesta-sparkle', 0.6);
sfx(183.6, 'pen-write');

// WIDE (the same room and framing as the hook): 6:00 - the bed is made; he is already up.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(330, 345, u), y: lerp(560, 555, u), z: lerp(1.4, 1.5, u) });
  heroRoom(g, t, { dawn: true });
  g.fillStyle = 'rgba(40,40,52,0.9)'; rr(g, 300, 640, 540, 30, 12); g.fill();
  alarmClock(g, 79, 618, 0.7, t, t < 161 ? 1 : 0, '6:00');
  const r = Hero(g, { x: 520, y: 742, s: 0.95, handL: t > 160.8 && t < 161.3 ? [92, 610] : null, face: { look: [-0.6, 0], smile: 0.6, blink: blink(t, 0.4) } }, { dir: -1 }); floorShadow(g, 520, 744, 90);
  box(g, 600, 690, 90, 52, '#2f4f7a', 8);
  pbar(g, r.head[0], r.head[1] - 110, 0.85, 100);
  caption(g, '6:00. He was already *up*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.6;
// POV (the payoff of excuse 2): the email
function s2(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: (g, px, py, pw, ph, t) => {
    g.fillStyle = '#f2f4f8'; g.fillRect(px, py, pw, ph); g.fillStyle = '#2b2b38'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = '700 26px Nunito'; g.fillText('Inbox', px + 40, py + 70);
    const k = ease(seg(t, 166.8, 167.2)); g.save(); g.globalAlpha = k; rr(g, px + 30, py + 110, pw - 60, 230, 18); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#d8dce6'; g.lineWidth = 2; g.stroke();
    g.fillStyle = ACC; g.beginPath(); g.arc(px + 70, py + 160, 22, 0, 7); g.fill(); g.fillStyle = '#2b2b38'; g.font = '800 24px Nunito'; g.fillText('City Arts Studio', px + 104, py + 152); g.fillStyle = '#7a8090'; g.font = '400 18px Nunito'; g.fillText('6:41 AM', px + 104, py + 178);
    g.fillStyle = '#2b2b38'; g.font = '800 26px Nunito'; g.fillText('Interview invitation', px + 50, py + 230); g.font = '400 22px Nunito'; g.fillStyle = '#4a5060'; g.fillText('Monday, 9:00 AM.', px + 50, py + 266); g.fillText('We loved your work!', px + 50, py + 298); g.restore();
  } });
  caption(g, 'The email came on a *Monday*.', capA(t, 167.4, b - 0.1), ACC);
}
// WIDE (the proof): the gym with Jay
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(940, 960, u), y: lerp(560, 565, u), z: lerp(1.1, 1.18, u) });
  gym(g, t, { dawn: true, clock: '6:15 AM' });
  P(g, { x: 1500, y: GY_F, s: 1.0, col: '#A9A9B4', acc: 'glasses', ...pose('hold', 1500, GY_F, 1.0) }); floorShadow(g, 1500, GY_F + 2, 80);
  const rp = Math.abs(Math.sin((t - a) * 2.2)), pj = pose('cheer', 1120, GY_F, 1.05);
  const jy = Hero(g, { x: 1120, y: GY_F, s: 1.05, ...JAY, handL: [pj.handL[0], lerp(pj.handL[1] + 120, pj.handL[1], rp)], handR: [pj.handR[0], lerp(pj.handR[1] + 120, pj.handR[1], rp)], face: { look: [-0.6, 0], smile: 0.8 } }, { dir: -1 }); floorShadow(g, 1120, GY_F + 2, 90);
  dumbbell(g, pj.handL[0], lerp(pj.handL[1] + 120, pj.handL[1], rp), 1.05); dumbbell(g, pj.handR[0], lerp(pj.handR[1] + 120, pj.handR[1], rp), 1.05);
  const hr = Hero(g, { x: 820, y: GY_F, s: 1.1, ...pose('hold', 820, GY_F, 1.1), face: { look: [0.6, 0], smile: 0.9, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 820, GY_F + 2, 90);
  dumbbell(g, 820, pose('hold', 820, GY_F, 1.1).handR[1], 1.2);
  pbar(g, hr.head[0], hr.head[1] - 120, 0.9, 100);
  headText(g, '6 AM again?', jy.head[0] + 40, jy.head[1] - 115, t, 173.0, 175.0);
  headText(g, 'every day.', hr.head[0] - 40, hr.head[1] - 165, t, 175.2, 177.4);
  caption(g, 'No more *reasons*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s3.fin = 0.4;
// CLOSE (emotion): his face, the bar full and glowing
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 820, y: lerp(470, 465, u), z: lerp(2.0, 2.1, u) });
  gym(g, t, { dawn: true, clock: '6:15 AM' });
  glow(g, 820, 420, 300, WARM, 0.12);
  const hr = Hero(g, { x: 820, y: GY_F, s: 1.1, ...pose('hold', 820, GY_F, 1.1), face: { look: [-0.1, -0.2], smile: 0.9, blink: blink(t, 0.6) } }, { dir: 1 });
  pbar(g, hr.head[0], hr.head[1] - 110, 0.9, 100);
  glow(g, hr.head[0], hr.head[1] - 125, 200 * es(t, 178.8, 179.6), AMB, 0.35);
  caption(g, 'Just *progress*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fout = 0.5;
const s5 = card("Excuses don't *build* anything.", 0.5, 2.8, 92);
defineClip(160, T, [s1, s2, s3, s4, s5]);
})();
