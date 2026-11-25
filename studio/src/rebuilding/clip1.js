// CLIP 1 (0:00-0:34) - the hook (whole, in the mirror), the math test (41 -> a crack on his chest), the open mic
// (a string snaps, they laugh -> a crack across his face).
(() => {
const T = [0, 6, 11, 16, 21, 27.5, 34];
sfx(0.0, 'morning-amb'); sfx(0.6, 'cloth-rustle', 0.6); sfx(3.0, 'birds', 0.5);
sfx(6.0, 'class-amb'); sfx(6.8, 'paper-crinkle', 0.6); sfx(8.4, 'paper-crinkle', 0.7); sfx(9.6, 'steps-small', 0.5);
sfx(11.0, 'class-amb', 0.6); sfx(11.4, 'paper-crinkle', 0.8); sfx(12.6, 'heartbeat', 0.5);
sfx(16.0, 'class-amb', 0.6); sfx(17.0, 'demon-8bit-1', 0.6); sfx(17.1, 'whisper-smart', 0.9); sfx(18.0, 'crack-body'); sfx(18.05, 'low-thud', 0.7); sfx(19.6, 'zipper', 0.6);
sfx(21.0, 'mic-room'); sfx(21.4, 'guitar-strum', 0.7); sfx(23.6, 'guitar-strum', 0.6); sfx(25.6, 'guitar-strum', 0.6);
sfx(27.5, 'mic-room', 0.7); sfx(28.0, 'guitar-strum', 0.5); sfx(28.6, 'string-snap'); sfx(29.0, 'laugh-crowd'); sfx(30.0, 'demon-8bit-2', 0.6); sfx(30.1, 'whisper-everyone', 0.9); sfx(31.0, 'crack-body'); sfx(31.05, 'low-thud', 0.8);

// HOOK (second 0): his room, morning. He fixes his hoodie in the mirror. Whole - not a single crack.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(1160, 1180, u), y: 520, z: lerp(1.4, 1.48, u) });
  heroRoom(g, t, { dawn: true });
  box(g, 1300, 250, 230, 500, '#191822', 6); g.save(); g.beginPath(); g.rect(1314, 264, 202, 472); g.clip(); g.fillStyle = '#1d1f30'; g.fillRect(1314, 264, 202, 472);
  g.globalAlpha = 0.75; Hero(g, { x: 1415, y: 760, s: 0.9, handL: [1360, 470 + Math.sin(t * 3) * 6], face: { look: [-0.5, 0], smile: 0.6 } }, { dir: -1 }); g.globalAlpha = 1;
  g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 30; g.beginPath(); g.moveTo(1330, 420); g.lineTo(1480, 280); g.stroke(); g.restore();
  Me(g, t, { x: 1100, y: 740, s: 1.05, view: 'side', dir: 1, handR: [1170, 470 + Math.sin(t * 3) * 6], face: { look: [0.9, 0], smile: 0.6, blink: blink(t, 0.4) } }); floorShadow(g, 1100, 742, 90);
  hudFor(g, t);
  hookLine(g, t, 'He was fine. *Until* he wasn\'t.', 0.15, 1.3, 1 - seg(t, 5.4, 5.9));
}
// WIDE (classroom): tests come back. The teacher walks down the row.
function rowSeat(g, t, x, y, s, o) { return P(g, { x, y: y + 12 * s, hip: true, thigh: 20, s, ...o, ...pose('table', x, y + 12 * s, s, { hip: true, tableY: y + 6 * s }) }); }
function classShot(g, t, o = {}) {
  classroom(g, t);
  [[520, 640, 0.85, '#A9A9B4', 'cap', '#2f4f7a'], [1400, 640, 0.85, '#C9A77A', 'longhair', '#3a2a22'], [780, 640, 0.85, '#8d8d9b', 'glasses', '']].forEach(([x, y, s, c, ac, acc]) => { rowSeat(g, t, x, y, s, { col: c, acc: ac, accCol: acc, face: { look: [0, 0.9] } }); examDesk(g, x, y, s); });
  if (o.teacher !== false) { const tx = o.tx ?? 1300; const tc = Hero(g, { x: tx, y: 850, s: 1.05, col: '#9a8d7e', acc: 'glasses', ...(o.give ? { handL: [tx - 110, 680] } : pose('hold', tx, 850, 1.05)), face: { look: [-0.8, 0.3], smile: 0 } }, { dir: -1 }); tie(g, tc, 1.05); floorShadow(g, tx, 852, 90); }
  const r = Me(g, t, { x: 1000, y: 812, hip: true, thigh: 20, s: 1.0, ...pose('table', 1000, 812, 1.0, { hip: true, tableY: 806 }), headOff: [0, o.down ? 10 : 0], face: { look: o.look || [0.6, 0], sad: o.sad ?? 0.1, smile: o.smile ?? 0.2, blink: blink(t, 0.4) } });
  examDesk(g, 1000, 800, 1.0, false);
  if (o.paper) { g.fillStyle = '#f7f4ec'; g.fillRect(950, 792, 110, 10); g.fillStyle = '#d0453a'; g.fillRect(1030, 792, 20, 6); }
  return r;
}
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), tx = lerp(1500, 1140, es(t, 6.4, 9.4));
  setCam(g, { x: lerp(960, 980, u), y: 560, z: lerp(1.05, 1.12, u) });
  classShot(g, t, { tx, give: t > 9.4, look: [0.8, -0.1], sad: 0.3, smile: 0 });
  hudFor(g, t);
  caption(g, 'Tests came *back*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// INSERT: his paper - 41
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)); setCam(g, { x: 960, y: lerp(560, 540, u), z: lerp(0.9, 0.96, u) });
  g.fillStyle = '#221f29'; g.fillRect(-500, -400, 3000, 1900); glow(g, 960, 400, 700, WARM, 0.1);
  testPaper(g, 960, 560, 1.0, 41, { marks: [1, 0, 0, 1, 0, 0, 0] });
  topHand(g, 560, 900, 0.9, C.cream, 0.4); topHand(g, 1360, 900, 0.9, C.cream, -0.4);
  hudFor(g, t);
}
// MEDIUM: the whisper behind him - "you're not smart enough." A crack runs down his chest. He hides the paper.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), hide = es(t, 19.4, 20.2);
  setCam(g, { x: lerp(980, 990, u), y: lerp(640, 630, u), z: lerp(1.7, 1.8, u) });
  classroom(g, t);
  demonAt(g, t, 1240, 850, 0.75, null, 0, { a: Math.min(es(t, 16.6, 17.2), 1 - seg(t, 19.6, 20.4)), face: { look: [-0.8, 0.3] } });
  const r = Me(g, t, { x: 1000, y: 812, hip: true, thigh: 20, s: 1.0, ...pose('table', 1000, 812, 1.0, { hip: true, tableY: 806 }), headOff: [0, 10], face: { look: [0, 0.9], sad: 0.9, smile: -0.2, blink: blink(t, 0.4) } });
  examDesk(g, 1000, 800, 1.0, false);
  if (hide < 1) { g.fillStyle = '#f7f4ec'; g.fillRect(950 - hide * 140, 792 + hide * 30, 110, 10); }
  demonText(g, "you're not smart enough.", 1240, 470, t, Math.min(seg(t, 17.1, 17.4), 1 - seg(t, 19.2, 19.6)), 70);
  flash(g, t, 18.0, '255,90,70');
  hudFor(g, t);
  caption(g, 'He failed his math *test*.', capA(t, 18.4, b - 0.1), ACC);
}
// WIDE (open mic night): he steps up with his guitar
function micShot(g, t, o = {}) {
  openMic(g, t);
  const r = Me(g, t, { x: 960, y: ST_F, s: 1.05, handL: [840, ST_F - 228], handR: [990 + (o.strum ? Math.sin(t * 14) * 10 : 0), ST_F - 196], headOff: [0, o.down ? 10 : 0], face: { look: o.look || [0.6, 0], sad: o.sad ?? 0, smile: o.smile ?? 0.4, wide: o.wide || 1, blink: blink(t, 0.4) } });
  floorShadow(g, 960, ST_F + 2, 90);
  heldGuitar(g, r, 1.05, o.strum ? 1 : 0);
  if (o.notes) for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); g.save(); g.globalAlpha = 1 - k; g.fillStyle = o.sour ? '#9a9aa8' : GOLD; g.font = '700 48px Nunito'; g.fillText('♪', 1030 + i * 30 + Math.sin(t * 3 + i) * 20 + (o.sour ? Math.sin(t * 30) * 6 : 0), 520 - k * 220); g.restore(); }
  return r;
}
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 960, u), y: lerp(600, 610, u), z: lerp(1.0, 1.06, u) });
  micShot(g, t, { strum: true, notes: true, smile: 0.5, look: [0.2, -0.1] });
  audience(g, t, 'still');
  hudFor(g, t);
  caption(g, 'Open mic *night*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s5.fin = 0.4;
// MEDIUM: a string snaps. His voice cracks. They laugh - phones up. "everyone's laughing at you." A crack across his face.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), snapped = t > 28.6;
  setCam(g, { x: lerp(960, 965, u), y: lerp(560, 550, u), z: lerp(1.55, 1.62, u) });
  const r = micShot(g, t, { strum: !snapped, notes: true, sour: snapped, wide: snapped ? 1.35 : 1, sad: snapped ? 0.8 : 0, smile: snapped ? -0.2 : 0.4, look: snapped ? [0.3, 0.2] : [0.2, -0.1], down: t > 31.4 });
  if (t > 28.6 && t < 29.4) { g.strokeStyle = '#e9e6df'; g.lineWidth = 2; g.beginPath(); g.moveTo(r.hip[0] + 20, r.hip[1] + 10); g.quadraticCurveTo(r.hip[0] + 60, r.hip[1] - 60 + (t - 28.6) * 200, r.hip[0] + 90, r.hip[1] + 40); g.stroke(); }
  audience(g, t, snapped ? 'laugh' : 'still', 850);
  demonText(g, "everyone's laughing at you.", r.head[0] + 160, r.head[1] - 140, t, Math.min(seg(t, 30.1, 30.4), 1 - seg(t, 32.6, 33.0)), 66);
  flash(g, t, 31.0, '255,90,70');
  hudFor(g, t);
  caption(g, 'They *laughed* at him.', capA(t, 29.4, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
