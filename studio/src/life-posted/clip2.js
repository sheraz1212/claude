// CLIP 2 (0:30-1:00) - situation 3 (the steak that wasn't his), situation 4 (the borrowed jacket),
// Danny's dinner he can't afford, and everyone else's real life.
(() => {
const T = [30, 34.5, 37, 41, 45, 47.5, 52.5, 56.5, 60];
sfx(30.0, 'restaurant-amb'); sfx(31.2, 'plate-set', 0.8); sfx(32.4, 'camera-shutter'); sfx(33.0, 'pop-8bit-3');
sfx(34.5, 'notif-burst'); sfx(35.0, 'notif', 0.7);
sfx(37.0, 'room-quiet'); sfx(37.4, 'slurp', 0.8); sfx(39.2, 'slurp', 0.6);
sfx(41.0, 'hall-amb'); sfx(41.5, 'pop-8bit-1'); sfx(42.4, 'cloth'); sfx(43.8, 'camera-shutter');
sfx(45.4, 'notif-burst'); sfx(46.0, 'demon-8bit-2', 0.7); sfx(46.1, 'whisper-rich', 0.8);
sfx(47.5, 'room-quiet'); sfx(47.9, 'msg-in'); sfx(49.4, 'typing', 0.7); sfx(50.6, 'msg-out');
sfx(52.5, 'fridge-hum'); sfx(52.6, 'fridge-open', 0.8); sfx(54.4, 'camera-shutter', 0.7);
sfx(56.5, 'scroll-flick'); sfx(57.8, 'scroll-flick', 0.8); sfx(59.0, 'scroll-flick', 0.7);

const selfie = (x, y, s) => { const hy = y - (166 + 126 + 46) * s; return { handR: [x + 92 * s, hy - 4 * s] }; };
const shutter = (g, t, x, y, at) => { for (const ft of at) if (t > ft && t < ft + 0.2) glow(g, x, y, 260, '255,255,255', 0.6 * (1 - (t - ft) / 0.2)); };

// SITUATION 3 (WIDE): the best restaurant in town. He only ordered water - and shoots the next table's steak.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), lean = es(t, 31.8, 32.3) * (1 - es(t, 33.4, 33.9));
  setCam(g, { x: lerp(960, 980, u), y: lerp(570, 580, u), z: lerp(1.05, 1.12, u) });
  restaurant(g, t);
  // the couple at the next table, the steak arrives
  P(g, { x: 1330, y: 770, hip: true, thigh: 20, s: 1.0, col: '#A9A9B4', acc: 'glasses', ...pose('table', 1330, 770, 1.0, { hip: true, tableY: 708 }), face: { look: [0.6, 0.2], smile: 0.6, blink: blink(t, 1.1) } });
  P(g, { x: 1530, y: 770, hip: true, thigh: 20, s: 1.0, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', face: { look: [-0.6, 0.2], smile: 0.6, blink: blink(t, 2.0) } });
  // the waiter (uniform: apron + bow tie), frowning at him
  const wx = lerp(1760, 1700, es(t, 30.4, 31.2));
  const wt = Hero(g, { x: wx, y: 850, s: 1.05, col: '#8d8d9b', handL: [wx - 60, 640], face: { look: [-0.9, 0.1], smile: lean > 0.3 ? -0.2 : 0.2, sad: lean > 0.3 ? -0.5 : 0 } }, { dir: -1 }); apron(g, wt, 1.05, '#16161e'); floorShadow(g, wx, 852, 90);
  const hp = pose('table', 760, 770, 1.05, { hip: true, tableY: 708 });
  const hr = Hero(g, { x: 760 + lean * 130, y: 770, hip: true, thigh: 20, s: 1.05, lean: lean * 0.18, handL: hp.handL, handR: lean > 0 ? [lerp(hp.handR[0], 1030, lean), lerp(hp.handR[1], 610, lean)] : hp.handR, face: { look: [0.8, 0.4], smile: 0.6, blink: blink(t, 0.4) } }, { dir: 1 });
  restTable(g, 760, 708, 340); glassWater(g, 700, 712);
  restTable(g, 1430, 708, 340); plate(g, 1310, 712, t > 31.2);
  if (lean > 0) phoneAt(g, lerp(hp.handR[0], 1030, lean), lerp(hp.handR[1], 610, lean) - 10, 1.05, 0.6, 0.6);
  shutter(g, t, 1030, 600, [32.4]);
  headText(g, 'just water?', wt.head[0] - 30, wt.head[1] - 115, t, 33.0, 34.4);
  likesHud(g, t);
  caption(g, 'Dinner at the *best* place in town.', capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.3;
// POST: "date night"
function s2(g, t, a, b) { phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: postApp({ pic: 'steak', caption: 'treat yourself 🍷', likes: likesAt, burst: [35.0, 36.4] }) }); likesHud(g, t); }
// INSERT (top-down): the truth - instant noodles at home
function s3(g, t, a, b) { noodleInsert(g, t, a, b); likesHud(g, t); caption(g, 'He ate *noodles* at home.', capA(t, a + 0.4, b - 0.1), ACC); }
s3.fin = 0.3;
// SITUATION 4 (MEDIUM): a friend lends him the designer jacket - "careful with it." Selfie in it.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 41.6, 42.2), on = t > 42.6;
  setCam(g, { x: lerp(940, 955, u), y: 600, z: lerp(1.35, 1.42, u) });
  hallway(g, t);
  const fr = Hero(g, { x: 1180, y: HW_F, s: 1.05, col: '#A9A9B4', acc: 'glasses', handL: on ? null : [lerp(1110, 1050, give), 680], face: { look: [-0.8, 0], smile: 0.1, sad: -0.3, blink: blink(t, 1.3) } }, { dir: -1 }); floorShadow(g, 1180, HW_F + 2, 90);
  const sf = selfie(820, HW_F, 1.05);
  const hr = Hero(g, { x: 820, y: HW_F, s: 1.05, ...(on ? sf : { handR: [lerp(900, 980, give), lerp(700, 690, give)] }), face: { look: on ? [0.6, -0.3] : [0.7, 0.1], smile: on ? 0.9 : 0.4, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 820, HW_F + 2, 90);
  if (on) { jacket(g, hr, 1.05); phoneAt(g, sf.handR[0], sf.handR[1], 1.05, 0.6, 0.3); }
  else { g.save(); g.translate(lerp(1080, 1000, give), 690); rr(g, -40, -20, 80, 70, 10); g.fillStyle = '#b8862a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2; g.stroke(); g.restore(); }
  shutter(g, t, sf.handR[0], sf.handR[1], [43.8]);
  headText(g, 'careful with it.', fr.head[0] + 20, fr.head[1] - 115, t, 41.5, 43.4);
  likesHud(g, t);
  caption(g, 'The jacket was *borrowed*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s4.fin = 0.3;
// POST: "drip" - the inner voice loves it
function s5(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: postApp({ pic: 'jacket', caption: 'drip 💸', likes: likesAt, burst: [45.4, 46.8] }) });
  noCam(g); glow(g, 1500, 300, 300, '255,58,44', 0.15 * seg(t, 45.9, 46.3));
  demonText(g, 'you look rich.', 1480, 300, t, Math.min(seg(t, 46.0, 46.3), 1 - seg(t, 47.1, 47.45)), 84);
  likesHud(g, t);
}
// POV (chat): his best friend Danny - "dinner tonight?" -> "super busy."
function s6(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [47.9], draw: chatApp('Danny', [{ who: 'r', text: "dinner tonight? haven't seen you in months!", at: 47.9 }, { who: 'me', text: 'super busy.', at: 50.6 }]),
    thumb: t => t > 49.4 && t < 50.6 ? [1040 + Math.sin(t * 30) * 12, 700] : [1180, 820] });
  likesHud(g, t);
  caption(g, 'His best friend, *Danny*, missed him.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM: why he said no - an empty fridge. He posts a story anyway.
function s7(g, t, a, b) {
  const u = ease(seg(t, a, b)), look = t > 54.0;
  setCam(g, { x: lerp(1360, 1380, u), y: 560, z: lerp(1.4, 1.48, u) });
  kitchen(g, t, { night: true, lamp: 0.3 }); openFridge(g);
  const ph = pose('phone', 1300, K_F, 1.05, { dir: -1 });
  const hr = Hero(g, { x: 1300, y: K_F, s: 1.05, ...(look ? ph : { handL: [1360, 560] }), headOff: [0, look ? 6 : 0], face: { look: look ? [-0.2, 0.9] : [0.8, 0.1], sad: 0.7, smile: -0.1, blink: blink(t, 0.4) } }, { dir: 1, amt: 0.35 }); floorShadow(g, 1300, K_F + 2, 90);
  if (look) { phoneAt(g, ph.handR[0], ph.handR[1] - 10, 1.05, 0.8); const k = seg(t, 54.6, 54.9) * (1 - seg(t, 56.1, 56.4)); if (k > 0) { g.save(); g.globalAlpha = k; rr(g, 1020, 330, 190, 46, 23); g.fillStyle = 'rgba(20,20,28,0.85)'; g.fill(); g.fillStyle = ACC; g.font = '700 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('grinding 💼', 1115, 354); g.restore(); } }
  likesHud(g, t);
  caption(g, "He couldn't *afford* dinner.", capA(t, a + 0.4, b - 0.1), ACC);
}
s7.fin = 0.3;
// POV (the feed): classmates - a wedding, a new house, a promotion. Real lives.
function feed(g, px, py, pw, ph, t) {
  g.fillStyle = '#0d0d12'; g.fillRect(px, py, pw, ph);
  const off = es(t, 56.8, 57.6) * 300 + es(t, 58.0, 58.8) * 300 + es(t, 59.2, 59.9) * 200;
  [['wedding', 'mike.j', 'we said yes 💍'], ['house', 'sara.k', 'home, finally.'], ['promo', 'dev.p', 'new role!'], ['wedding', 'jen_b', 'best day.']].forEach(([pic, user, cap], i) => {
    const y = py + 30 + i * 330 - off;
    g.fillStyle = C.cream; g.beginPath(); g.arc(px + 50, y + 20, 16, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '700 22px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(user, px + 78, y + 20);
    PICS[pic](g, px + 20, y + 50, pw - 40, 220);
    g.fillStyle = '#d8d8e0'; g.font = '400 22px Nunito'; g.fillText(cap, px + 24, y + 296);
  });
}
function s8(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: feed, thumb: t => [1180, lerp(780, 680, (Math.sin((t - a) * 3) * 0.5 + 0.5))] });
  likesHud(g, t);
  caption(g, 'Everyone else was *really* living.', capA(t, a + 0.4, b - 0.1), ACC);
}
defineClip(30, T, [s1, s2, s3, s4, s5, s6, s7, s8]);
})();
