// YES MAN - CLIP 3 (0:41.5-1:09): the same four - now kind, honest no's. A stone falls out each time. The proof. The lesson.
(() => {
const T = [41.5, 46, 50.5, 55, 59.5, 64.5, 69.5];
sfx(41.5, 'hall-amb'); sfx(42.2, 'pop-8bit-1'); sfx(43.6, 'pop-8bit-2'); sfx(44.4, 'stone-out'); sfx(44.9, 'thump-small', 0.7);
sfx(46.0, 'ff-amb'); sfx(46.6, 'pop-8bit-3'); sfx(47.8, 'pop-8bit-1'); sfx(48.9, 'stone-out'); sfx(49.4, 'thump-small', 0.7);
sfx(50.5, 'street-amb'); sfx(51.1, 'pop-8bit-2'); sfx(52.3, 'pop-8bit-3'); sfx(53.4, 'stone-out'); sfx(53.9, 'thump-small', 0.7);
sfx(55.0, 'room-quiet'); sfx(55.6, 'typing', 0.6); sfx(56.4, 'pop-8bit-1'); sfx(57.9, 'stone-out'); sfx(58.4, 'thump-small', 0.7);
sfx(59.5, 'court-amb'); sfx(60.4, 'ball-bounce', 0.7); sfx(61.3, 'ball-bounce', 0.6); sfx(62.4, 'net-swish'); sfx(62.6, 'crowd-cheer', 0.5);
sfx(64.8, 'pen-write'); sfx(66.6, 'pen-write', 0.9);

const s1 = (g, t, a, b) => situation(g, t, a, b, { place: corridor, F: CR_F, cam: [860, 590, 1.6, 1.66], hx: 760, fx: 1020, friend: { col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a' },
  ask: ['do my homework? pls', 41.9, 43.3], reply: ["can't. but I'll help you study.", 43.5, 45.8], n: 4, out: 44.4, hSad: 0, hSmile: 0.5, fSmile: 0.3, cap: 'This time, he said *no*.' });
s1.fin = 0.3;
const s2 = (g, t, a, b) => situation(g, t, a, b, { place: fastFood, F: 850, cam: [860, 590, 1.6, 1.66], hx: 760, fx: 1020, friend: { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' },
  ask: ['cover my shift tonight?', 46.4, 47.7], reply: ['not tonight.', 47.8, 50.3], n: 3, out: 48.9, hSad: 0, hSmile: 0.5, fSmile: 0.4, cap: 'Kind. But *honest*.' });
s2.fin = 0.3;
const s3 = (g, t, a, b) => situation(g, t, a, b, { place: busStop, F: BS_F, cam: [880, 590, 1.6, 1.66], hx: 780, fx: 1040, friend: { col: '#8d8d9b', acc: 'glasses' },
  ask: ['lend me $50?', 50.9, 52.2], reply: ["I can't. sorry.", 52.3, 54.8], n: 2, out: 53.4, hSad: 0, hSmile: 0.4, fSmile: 0.3, cap: 'Nobody *left*.' });
s3.fin = 0.3;
const s4 = (g, t, a, b) => situation(g, t, a, b, { place: (g, t) => { heroRoom(g, t, { lamp: 0.6, dawn: true });
    g.save(); g.translate(760, 360); box(g, -110, -90, 220, 180, '#efe8d4', 4); g.fillStyle = '#c94b3f'; g.fillRect(-110, -90, 220, 34); g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SATURDAY', 0, -72);
    g.fillStyle = ACC; g.font = '700 34px "Patrick Hand"'; g.fillText('MY GAME 🏀', 0, 10); g.restore(); },
  F: 740, cam: [640, 500, 1.6, 1.66], hx: 560, fx: 0, noFriend: true, phone: true, hHand: () => [650, 560], reply: ["can't. I have my game.", 56.2, 58.9], n: 1, out: 57.9, hSad: 0, hSmile: 0.6, cap: 'His Saturday was *his*.' });
s4.fin = 0.3;
// PROOF: the court. Standing tall, the bag almost empty. He shoots - it goes in.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), sh = es(t, 61.6, 62.0), fly = seg(t, 62.0, 62.6);
  setCam(g, { x: lerp(1080, 1140, u), y: 560, z: lerp(1.55, 1.62, u) });
  outCourt(g, t, { dusk: true });
  [[1380, '#A9A9B4', 'cap', '#2f4f7a'], [1500, '#C9A77A', 'glasses', '']].forEach(([x, c, ac, acc]) => { const pc = t > 62.4 ? pose('cheer', x, 840, 1.0) : {}; P(g, { x, y: 840, s: 1.0, col: c, acc: ac, accCol: acc, ...pc, face: { smile: 0.9, look: [-0.6, -0.2] } }); floorShadow(g, x, 842, 80); });
  const hx = 1000, ps = sh > 0 && sh < 1 || t < 62.0 ? pose('shoot', hx, 840, 1.05) : {};
  const hr = Hero(g, { x: hx, y: 840 - Math.sin(Math.PI * sh) * 30, s: 1.05, ...(t < 61.6 ? pose('dribble', hx, 840, 1.05) : ps), face: { look: [0.6, -0.5], smile: 0.9, blink: blink(t, 0.4) } }, { dir: 1 }); floorShadow(g, hx, 842, 90);
  const bx = t < 61.6 ? hx + 66 : t < 62.0 ? hx + 30 : lerp(hx + 40, 1560, fly), by = t < 61.6 ? 790 - Math.abs(Math.sin(t * 7)) * 120 : t < 62.0 ? 500 : lerp(500, 360, fly) - Math.sin(Math.PI * fly) * 260 + (t > 62.6 ? (t - 62.6) * 500 : 0);
  ball(g, Math.min(bx, 1560), by, 1);
  bagHud(g, 2);
  caption(g, 'He finally had time for *himself*.', capA(t, a + 0.5, b - 0.3), ACC);
}
s5.fin = 0.3; s5.fout = 0.4;
// THE LESSON
const s6 = card('No is a *full sentence*.', 0.4, 2.2, 80);
defineClip(41.5, T, [s1, s2, s3, s4, s5, s6]);
})();
