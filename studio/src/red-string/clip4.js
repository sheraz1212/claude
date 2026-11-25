// CLIP 4 (1:39-2:11) - the recovery, mirrored: the text (sent, let go), the stairs (laughs it off), the whisper (relapse)
// -> the BIRTHDAY surprise, the boss's reply.
(() => {
const T = [99, 105.5, 112, 118.5, 125, 131];
sfx(99.0, 'office-amb'); sfx(99.8, 'typing', 0.6); sfx(100.8, 'msg-out'); sfx(101.6, 'phone-down', 0.8); sfx(102.6, 'keys-type', 0.6);
sfx(105.5, 'subway-amb'); sfx(105.8, 'steps', 0.7); sfx(107.9, 'bump', 0.7); sfx(108.6, 'laugh-soft', 0.8); sfx(109.4, 'pop-8bit-1'); sfx(110.8, 'pop-8bit-2'); sfx(111.0, 'train-pass', 0.5);
sfx(112.0, 'office-amb'); sfx(112.6, 'whisper-crowd', 0.5); sfx(113.2, 'thread-creak'); sfx(114.4, 'breath-in', 0.8); sfx(115.4, 'breath-out', 0.8); sfx(116.2, 'chair-creak', 0.6); sfx(117.4, 'pop-8bit-3');
sfx(118.5, 'office-amb', 0.6); sfx(118.9, 'door-open', 0.7); sfx(119.3, 'party-pop'); sfx(119.4, 'crowd-cheer', 0.7); sfx(119.6, 'thread-snap'); sfx(120.6, 'pop-8bit-1'); sfx(121.0, 'celesta-sparkle', 0.6);
sfx(125.0, 'room-quiet'); sfx(125.6, 'msg-in'); sfx(127.6, 'pop-8bit-2', 0.6);

// MEDIUM (office): he sends the text, turns the phone face down, and works. A thread starts... and falls away.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = t > 101.6, k = es(t, 102.0, 103.0), fall = es(t, 103.4, 104.4);
  setCam(g, { x: lerp(930, 950, u), y: 560, z: lerp(1.35, 1.42, u) });
  office(g, t, { day: true });
  P(g, { x: 360, y: 760, hip: true, thigh: 20, s: 0.9, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', ...pose('table', 360, 760, 0.9, { hip: true, tableY: 742 }) }); officeDesk(g, 360, 760, 0.9);
  box(g, 880, 520, 160, 200, '#24222c', 20);
  const ps = down ? pose('table', 960, 760, 1.05, { hip: true, tableY: 742 }) : pose('phone', 960, 760, 1.05, { hip: true });
  const r = Hero(g, { x: 960, y: 760, hip: true, thigh: 20, s: 1.05, ...ps, handR: down ? [ps.handR[0] + Math.sin(t * 12) * 6, ps.handR[1]] : ps.handR, headOff: [0, 4], face: { look: down ? [-0.6, 0.2] : [0.2, 0.9], smile: down ? 0.4 : 0.1, blink: blink(t, 0.4) } }, { dir: 1 });
  if (!down) phoneAt(g, ps.handR[0], ps.handR[1] - 10, 1.05, 0.8);
  if (k > 0 && fall < 1) { g.save(); g.globalAlpha = 1 - fall; thread(g, [[r.head[0] + 20, r.head[1] - 40], [r.head[0] + 80, r.head[1] - 120 + fall * 200], [r.head[0] + 160, r.head[1] - 60 + fall * 400]], k, 3, t); g.restore(); }
  officeDesk(g, 960, 760, 1.05, { monX: -110, mug: true });
  if (down) box(g, 1080, 742, 44, 10, '#0a0a0e', 3);
  loopsHud(g, 40 - Math.floor(fall * 10));
  caption(g, 'He sent it. And let it *go*.', capA(t, a + 0.4, b - 0.1), ACC);
}
s1.fin = 0.4;
// WIDE (subway stairs): he slips again - and laughs. A stranger smiles: "happens to me daily."
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), down = seg(t, 105.6, 107.8), slip = es(t, 107.8, 108.1) * (1 - es(t, 108.4, 109.0));
  setCam(g, { x: lerp(1060, 1080, u), y: 600, z: lerp(1.2, 1.26, u) });
  subway(g, t);
  const st = P(g, { x: 820, y: SW_F, s: 1.0, col: '#C9A77A', acc: 'glasses', face: { look: [0.8, 0], smile: t > 109 ? 0.8 : 0.2 } }); floorShadow(g, 820, SW_F + 2, 80);
  P(g, { x: 540, y: SW_F, s: 1.0, col: '#8d8d9b', acc: 'longhair', accCol: '#2e2a33', ...pose('phone', 540, SW_F, 1.0), face: { look: [0, 0.9] } }); floorShadow(g, 540, SW_F + 2, 80);
  const hx = lerp(1520, 1120, down), hy = down < 1 ? SW_F - 40 - (1 - down) * 160 : SW_F, laugh = t > 108.5 && t < 110 ? Math.abs(Math.sin(t * 9)) : 0;
  const r = down < 1 ? walker(g, hx, hy, 1.05, -1, t * 6, { face: { smile: 0.3 } }) : Hero(g, { x: 1120 - slip * 30, y: SW_F, s: 1.05, view: 'side', dir: -1, lean: -0.3 * slip, headOff: [-20 * slip, 10 * slip - laugh * 5], face: { look: [-0.6, 0], smile: t > 108.4 ? 0.95 : 0, wide: slip > 0.5 ? 1.2 : 1 } }, { dir: -1 });
  floorShadow(g, down < 1 ? hx : 1120, SW_F + 2, 90);
  headText(g, 'happens to me daily.', st.head[0], st.head[1] - 115, t, 109.4, 111.8);
  loopsHud(g, 30 - Math.floor(seg(t, 108.4, 109) * 10));
  caption(g, 'He laughed it *off*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// MEDIUM (office, the relapse): they whisper again. A thread winds his wrist... he breathes. He walks over: "hey, what's up?"
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), w = es(t, 113.0, 114.4) * (1 - es(t, 115.4, 116.0)), up = es(t, 116.0, 117.2);
  setCam(g, { x: lerp(1080, 1100, u), y: 560, z: lerp(1.3, 1.36, u) });
  office(g, t, { day: true });
  box(g, 1460, 330, 220, 520, '#1d1b24', 4); g.fillStyle = '#e9e2cf'; g.font = '800 24px Nunito'; g.textAlign = 'center'; g.fillText('BREAK ROOM', 1570, 310);
  const cw1 = Hero(g, { x: 1450, y: OF_F, s: 1.0, col: '#C9A77A', acc: 'longhair', accCol: '#3a2a22', view: 'side', dir: 1, headOff: [8, 4], face: { look: [t > 117 ? -0.9 : 0.9, 0.1], smile: 0.4, wide: t > 117.4 ? 1.3 : 1 } }, { dir: 1 }); floorShadow(g, 1450, OF_F + 2, 80);
  Hero(g, { x: 1600, y: OF_F, s: 1.0, col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a', view: 'side', dir: -1, headOff: [-8, 4], face: { look: [-0.9, 0.1], smile: 0.5 } }, { dir: -1 }); floorShadow(g, 1600, OF_F + 2, 80);
  let r;
  if (up <= 0) { box(g, 880, 520, 160, 200, '#24222c', 20); r = Hero(g, { x: 960, y: 760, hip: true, thigh: 20, s: 1.05, ...pose('table', 960, 760, 1.05, { hip: true, tableY: 742 }), face: { look: [0.9, -0.1], sad: t > 114.4 && t < 115.6 ? 0.1 : 0.5, wide: 1.1, blink: t > 114.4 && t < 115.4 ? 1 : blink(t, 0.4) } }, { dir: 1 }); wind(g, 1030, 735, 30, 10, 4, w, t, 0.1); officeDesk(g, 960, 760, 1.05, { monX: -110, mug: true }); }
  else { box(g, 880, 520, 160, 200, '#24222c', 20); officeDesk(g, 960, 760, 1.05, { monX: -110, mug: true }); const hx = lerp(960, 1290, up); r = walker(g, hx, OF_F, 1.05, 1, t * 6, { face: { smile: 0.5 } }); floorShadow(g, hx, OF_F + 2, 90); }
  headText(g, "hey, what's up?", r.head[0], r.head[1] - 115, t, 117.4, 118.4);
  loopsHud(g, 20 + Math.floor(w * 15));
  caption(g, 'The old fear came *back*.', capA(t, a + 0.4, 115.8), ACC);
  caption(g, 'This time, he *asked*.', capA(t, 116.0, b - 0.1), ACC);
}
s3.fin = 0.4;
// WIDE (break room): SURPRISE - the cake, the banner, the boss. The last chest thread snaps.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), lit = es(t, 119.0, 119.4);
  setCam(g, { x: lerp(960, 980, u), y: lerp(540, 550, u), z: lerp(1.05, 1.12, u) });
  breakRoom(g, t, { day: true, lit });
  const ppl = [[620, '#C9A77A', 'longhair', '#3a2a22'], [780, '#A9A9B4', 'cap', '#2f4f7a'], [1300, '#9a8d7e', 'glasses', ''], [1460, '#C9A77A', 'cap', '#b8483a']];
  ppl.forEach(([x, c, ac, acc], i) => { const ch = t > 119.3 && i % 2 === 0; P(g, { x, y: OF_F, s: 1.0, col: c, acc: ac, accCol: acc, ...(ch ? pose('cheer', x, OF_F, 1.0) : {}), face: { look: [x < 960 ? 0.6 : -0.6, 0], smile: 0.95 } }); floorShadow(g, x, OF_F + 2, 80); });
  const bs = Hero(g, { x: 1140, y: OF_F, s: 1.05, ...BOSS, ...pose('hold', 1140, OF_F, 1.05), face: { look: [-0.7, 0], smile: 0.9 } }, { dir: -1 }); tie(g, bs, 1.05); floorShadow(g, 1140, OF_F + 2, 90);
  box(g, 1040, 680, 200, 14, '#2a2530', 4); cake(g, 1140, 680, lit, t);
  const r = Hero(g, { x: 930, y: OF_F, s: 1.05, ...(t > 120 ? pose('face', 930, OF_F, 1.05) : {}), face: { look: [0.6, 0], wide: t < 120 ? 1.4 : 1, smile: t > 119.6 ? 0.95 : 0.2, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, 930, OF_F + 2, 90);
  if (t < 119.6) wind(g, 930, 600, 70, 18, 4, 1, t, 0.1);
  snapBits(g, 930, 600, t, 119.6);
  if (lit > 0) for (let i = 0; i < 30; i++) { const q = rng(i + 3), k = (t - 119.3) * 0.6 + q() * 0.3; if (k < 0) continue; g.fillStyle = ['#FF2E4D', '#FFE14D', '#3b6fb6', '#2e9e6a'][i % 4]; g.fillRect(500 + q() * 960, 120 + (k % 1) * 760, 10, 16); }
  headText(g, 'happy birthday!', bs.head[0], bs.head[1] - 115, t, 120.6, 124.6);
  loopsHud(g, 10);
  caption(g, 'They were planning his *birthday*.', capA(t, a + 0.8, b - 0.1), ACC);
}
s4.fin = 0.3;
// POV: the boss's reply to that 2:14 AM text, finally
function s5(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [125.6], draw: chatApp('Boss', [{ who: 'me', text: "hey, sorry about the report. I'll fix it asap!! 😅", at: 0 }, { who: 'r', text: 'sounds great, thanks! enjoy your day 🎂', at: 125.6 }]) });
  loopsHud(g, 5);
  caption(g, 'Most of it never *happened*.', capA(t, a + 0.6, b - 0.1), ACC);
}
defineClip(99, T, [s1, s2, s3, s4, s5]);
})();
