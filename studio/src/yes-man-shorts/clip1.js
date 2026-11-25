// YES MAN - CLIP 1 (0:00-0:23): the hook, then three yeses: homework, a shift, his last $50.
(() => {
const T = [0, 5, 11, 17, 23];
sfx(0.0, 'hall-amb'); sfx(0.2, 'steps', 0.6); sfx(0.3, 'pen-write', 0.6);
sfx(5.0, 'hall-amb'); sfx(5.8, 'pop-8bit-1'); sfx(7.6, 'pop-8bit-2'); sfx(8.4, 'whoosh-soft', 0.7); sfx(9.0, 'stone-drop'); sfx(9.05, 'low-thud', 0.6);
sfx(11.0, 'ff-amb'); sfx(11.8, 'pop-8bit-3'); sfx(13.6, 'pop-8bit-1'); sfx(14.4, 'whoosh-soft', 0.7); sfx(15.0, 'stone-drop'); sfx(15.05, 'low-thud', 0.7);
sfx(17.0, 'street-amb'); sfx(17.8, 'pop-8bit-2'); sfx(19.2, 'coins', 0.6); sfx(19.9, 'pop-8bit-3'); sfx(20.4, 'whoosh-soft', 0.7); sfx(21.0, 'stone-drop'); sfx(21.05, 'low-thud', 0.8); sfx(21.2, 'breath-heavy', 0.5);

// HOOK: he walks down the corridor, a small bag on his back
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 940, u), y: 600, z: lerp(1.25, 1.32, u) });
  corridor(g, t);
  const hx = lerp(640, 1180, seg(t, a, b));
  const hr = walker(g, hx, CR_F, 1.05, 1, t * 6, { face: { smile: 0.6 } }); floorShadow(g, hx, CR_F + 2, 90);
  backpack(g, hr, 1.05, 1, 0);
  bagHud(g, 2);
  hookLine(g, t, 'He never said *no*.', 0.15, 1.2, 1 - seg(t, 4.4, 4.9));
}
// 1. HOMEWORK: a friend hands him his notebook
const s2 = (g, t, a, b) => situation(g, t, a, b, { place: corridor, F: CR_F, cam: [860, 590, 1.6, 1.66], hx: 760, fx: 1020, friend: { col: '#A9A9B4', acc: 'cap', accCol: '#2f4f7a' },
  give: [6.8, 7.4], fHand: k => [lerp(1000, 900, k), 640], hHand: k => [lerp(800, 880, k), 650],
  extra: (g, t, k) => { if (t < 8.2) box(g, lerp(960, 870, k), 620, 60, 44, '#3b6fb6', 4); },
  ask: ['do my homework? pls', 5.8, 7.5], reply: ['yes.', 7.6, 8.9], n: 0, drop: 9.0, cap: "His friend's *homework*." });
s2.fin = 0.3;
// 2. THE SHIFT: a coworker at the burger place
const s3 = (g, t, a, b) => situation(g, t, a, b, { place: fastFood, F: 850, cam: [860, 590, 1.6, 1.66], hx: 760, fx: 1020, friend: { col: '#C9A77A', acc: 'cap', accCol: '#b8483a' },
  extra: (g, t) => {}, ask: ['cover my shift tonight?', 11.8, 13.5], reply: ['sure.', 13.6, 14.9], n: 1, drop: 15.0, cap: "A coworker's *shift*." });
s3.fin = 0.3;
// 3. HIS LAST $50: a friend at the bus stop
const s4 = (g, t, a, b) => situation(g, t, a, b, { place: busStop, F: BS_F, cam: [880, 590, 1.6, 1.66], hx: 780, fx: 1040, friend: { col: '#8d8d9b', acc: 'glasses' },
  give: [19.9, 20.5], fHand: k => [lerp(1010, 960, k), 660], hHand: k => [lerp(830, 930, k), 660],
  extra: (g, t, k) => { if (t > 18.8 && t < 20.8) { g.fillStyle = '#2e9e6a'; g.fillRect(lerp(840, 935, k) - 26, 640, 52, 28); g.fillStyle = '#fff'; g.font = '800 16px Nunito'; g.textAlign = 'center'; g.fillText('$50', lerp(840, 935, k), 659); } },
  ask: ['lend me $50?', 17.8, 19.4], reply: ['okay.', 19.9, 20.9], n: 2, drop: 21.0, hSad: 0.7, cap: 'The *last* $50 he had.' });
s4.fin = 0.3;
defineClip(0, T, [s1, s2, s3, s4]);
})();
