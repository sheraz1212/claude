// CLIP 5 (1:57-2:27) - the recovery, mirrored: the rental lot, dinner with Danny, the jacket back,
// extra shifts, real help for Mom, real food at home.
(() => {
const T = [117, 122, 126.5, 131, 136, 141, 147];
sfx(117.0, 'street-amb'); sfx(117.4, 'steps', 0.7); sfx(119.0, 'laugh-soft', 0.8); sfx(120.4, 'pop-8bit-1');
sfx(122.0, 'diner-amb'); sfx(122.6, 'phone-down', 0.7); sfx(122.9, 'phone-down', 0.6); sfx(123.4, 'pop-8bit-2'); sfx(124.8, 'laugh-soft', 0.9);
sfx(126.5, 'hall-amb'); sfx(127.2, 'cloth'); sfx(127.8, 'pop-8bit-3'); sfx(129.4, 'pop-8bit-1');
sfx(131.0, 'warehouse-amb'); sfx(131.8, 'box-drop'); sfx(133.6, 'box-drop', 0.8); sfx(134.4, 'pop-8bit-2');
sfx(136.0, 'room-quiet'); sfx(136.6, 'msg-out'); sfx(138.6, 'msg-in'); sfx(139.4, 'celesta');
sfx(141.0, 'morning-amb'); sfx(141.6, 'sizzle', 0.7);

const DN = (g, o) => P(g, { ...DANNY, ...o });
// WIDE (mirror of the rental lot): he walks past the red car with Danny - laughing, no phone
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 1010, u), y: 600, z: lerp(1.05, 1.12, u) });
  rentalLot(g, t, { carX: 1250 });
  const x = lerp(380, 1180, seg(t, a, b));
  const d = walker(g, x + 150, 860, 1.05, 1, t * 7, { ...DANNY, face: { smile: 0.9, look: [-0.6, 0] } }); floorShadow(g, x + 150, 862, 90);
  const hr = walker(g, x, 860, 1.05, 1, t * 7 + 1.4, { face: { smile: 0.9, look: [0.7, 0] } }); floorShadow(g, x, 862, 90);
  headText(g, 'nice car.', d.head[0] + 30, d.head[1] - 110, t, 118.2, 119.8);
  headText(g, "not mine. never was.", hr.head[0] - 30, hr.head[1] - 110, t, 120.2, 121.9);
  caption(g, 'No more *rented* cars.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// MEDIUM (mirror of the restaurant): a cheap diner with Danny. Both phones face down.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), laugh = Math.abs(Math.sin((t - a) * 6)) * (t > 124.6 && t < 125.8 ? 1 : 0);
  setCam(g, { x: lerp(960, 975, u), y: 580, z: lerp(1.38, 1.46, u) });
  fastFood(g, t);
  P(g, { x: 1600, y: 850, s: 0.95, col: '#8d8d9b', acc: 'glasses', view: 'side', dir: -1 }); floorShadow(g, 1600, 852, 80);
  const dp = pose('table', 1120, 770, 1.05, { hip: true, tableY: 712 });
  const dn = DN(g, { x: 1120, y: 770, hip: true, thigh: 20, s: 1.05, ...dp, headOff: [0, -laugh * 4], face: { look: [-0.8, 0.1], smile: 0.9, blink: blink(t, 1.3) } });
  const hp = pose('table', 800, 770, 1.05, { hip: true, tableY: 712 });
  const hr = Hero(g, { x: 800, y: 770, hip: true, thigh: 20, s: 1.05, ...hp, headOff: [0, -laugh * 5], face: { look: [0.8, 0.1], smile: 0.95, blink: blink(t, 0.4) } }, { dir: 1 });
  restTable(g, 960, 712, 480);
  box(g, 820, 690, 160, 20, '#a8483a', 4); box(g, 960, 690, 160, 20, '#a8483a', 4);
  for (const [px, at] of [[920, 122.6], [1010, 122.9]]) if (t > at) { box(g, px, 702, 46, 10, '#0a0a0e', 3); }
  headText(g, 'missed you, man.', dn.head[0] + 30, dn.head[1] - 110, t, 123.4, 125.2);
  caption(g, 'Real dinners. With *Danny*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s2.fin = 0.3;
// MEDIUM (mirror of the hallway): he gives the jacket back, in his own clothes
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), give = es(t, 127.0, 127.6);
  setCam(g, { x: lerp(955, 940, u), y: 600, z: lerp(1.42, 1.35, u) });
  hallway(g, t);
  const fr = Hero(g, { x: 1180, y: HW_F, s: 1.05, col: '#A9A9B4', acc: 'glasses', handL: give > 0.9 && t < 129 ? [1060, 690] : null, face: { look: [-0.8, 0], smile: 0.5, blink: blink(t, 1.3) } }, { dir: -1 }); floorShadow(g, 1180, HW_F + 2, 90);
  const hr = Hero(g, { x: 820, y: HW_F, s: 1.05, handR: t < 129 ? [lerp(900, 990, give), lerp(700, 690, give)] : null, face: { look: [0.7, 0.1], smile: 0.6, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 820, HW_F + 2, 90);
  if (t < 129) { g.save(); g.translate(lerp(930, 1020, give), 690); rr(g, -40, -20, 80, 70, 10); g.fillStyle = '#b8862a'; g.fill(); g.strokeStyle = C.line; g.lineWidth = 2; g.stroke(); g.restore(); }
  headText(g, 'thanks, man.', hr.head[0] - 20, hr.head[1] - 110, t, 127.8, 129.4);
  headText(g, 'you look better like this.', fr.head[0] + 30, fr.head[1] - 110, t, 129.4, 130.9);
  caption(g, 'He gave the jacket *back*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s3.fin = 0.3;
// WIDE (one-off, the work): extra shifts at the warehouse. The supervisor nods.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), lift = es(t, 132.2, 132.9) * (1 - es(t, 133.2, 133.6));
  setCam(g, { x: lerp(940, 970, u), y: lerp(570, 580, u), z: lerp(1.05, 1.12, u) });
  warehouse(g, t);
  for (let i = 0; i < 4; i++) box(g, 1240 + (i % 2) * 110, 760 - Math.floor(i / 2) * 90, 100, 90, '#5a4630', 4);
  P(g, { x: 300, y: WH_F, s: 1.0, col: '#9a8d7e', acc: 'cap', accCol: '#5a4a52', ...pose('hold', 300, WH_F, 1.0) }); box(g, 260, 600, 80, 60, '#5a4630', 4); floorShadow(g, 300, WH_F + 2, 80);
  const hx = lerp(760, 1000, es(t, 131.2, 133.2));
  const ph = pose('hold', hx, WH_F, 1.05);
  const hr = Hero(g, { x: hx, y: WH_F, s: 1.05, handL: [ph.handL[0], ph.handL[1] - 40 - lift * 30], handR: [ph.handR[0], ph.handR[1] - 40 - lift * 30], face: { look: [0.6, 0.2], smile: 0.4, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, hx, WH_F + 2, 90);
  if (t < 133.3) box(g, hx - 50, ph.handL[1] - 100 - lift * 30, 100, 80, '#6a5238', 4);
  const sv = Hero(g, { x: 1600, y: WH_F, s: 1.1, col: '#8d8d9b', acc: 'cap', accCol: '#2a2a2a', handL: t > 134.2 ? [1520, 600] : null, face: { look: [-0.8, 0.1], smile: 0.6 } }, { dir: -1 }); vest(g, sv, 1.1); floorShadow(g, 1600, WH_F + 2, 90);
  headText(g, 'good work, Alex.', sv.head[0], sv.head[1] - 115, t, 134.4, 136);
  caption(g, 'He took extra *shifts*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s4.fin = 0.3;
// POV (chat with Mom): real help, not a fake post
function s5(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [138.6], draw: chatApp('Mom', [{ who: 'me', text: 'sent $60 for the bill. sorry it took so long.', at: 136.6 }, { who: 'r', text: 'my boy. ❤️', at: 138.6 }]) });
  caption(g, 'Real help. Not a *post*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MEDIUM (mirror of the empty fridge): morning, he cooks real food. A budget on the fridge.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b)), stir = Math.sin(t * 5) * 10;
  setCam(g, { x: lerp(620, 650, u), y: 540, z: lerp(1.4, 1.48, u) });
  kitchen(g, t, { lamp: 0.6, note: 'BUDGET', check: true });
  const hr = Hero(g, { x: 560, y: K_F, s: 1.05, handL: [455 + stir, 548], handR: null, headOff: [0, 4], face: { look: [-0.4, 0.6], smile: 0.6, blink: blink(t, 0.4) } }, { dir: -1 }); floorShadow(g, 560, K_F + 2, 90);
  g.fillStyle = '#2a2832'; g.beginPath(); g.ellipse(420, 548, 50, 12, 0, 0, Math.PI); g.fill(); ln(g, [470, 548, 505, 556], 6, '#2a2832');
  for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; g.fillStyle = `rgba(230,230,240,${0.22 * (1 - k)})`; g.beginPath(); g.arc(400 + i * 22, 500 - k * 140, 12 + k * 22, 0, 7); g.fill(); }
  glow(g, 420, 520, 120, WARM, 0.2);
  caption(g, 'Cheap food. Cooked by *him*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s6.fin = 0.4;
defineClip(117, T, [s1, s2, s3, s4, s5, s6]);
})();
