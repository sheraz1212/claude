// AFTER HER - CLIP 3 (1:12-1:44): the turn - his dad sits down next to him, an old photo, his own first heartbreak,
// "then I met your mom." The wisdom lines. One small step: he mutes her stories and archives the chat.
(() => {
const T = [72, 78, 84, 90, 96, 104];
sfx(72.0, 'room-quiet'); sfx(72.4, 'knock-soft'); sfx(73.6, 'door-open', 0.5); sfx(74.4, 'steps-small', 0.5); sfx(76.0, 'chair-creak', 0.6);
sfx(78.0, 'room-quiet'); sfx(78.6, 'paper-crinkle', 0.6); sfx(80.0, 'memory-chime', 0.5);
sfx(84.0, 'room-quiet'); sfx(84.4, 'pop-8bit-1'); sfx(87.2, 'pop-8bit-2'); sfx(88.8, 'laugh-soft', 0.4);
sfx(90.3, 'pen-write'); sfx(92.3, 'pen-write', 0.9);
sfx(96.0, 'room-quiet'); sfx(97.0, 'phone-tap-soft', 0.7); sfx(98.6, 'toggle-click'); sfx(100.6, 'phone-tap-soft', 0.7); sfx(101.6, 'toggle-click'); sfx(102.4, 'celesta-sparkle', 0.5);

const DX = SIT[0] + 230;
// MEDIUM (his room, evening): a knock. His dad comes in and sits down next to him.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b)), come = es(t, 73.6, 75.8);
  setCam(g, { x: lerp(560, 600, u), y: 520, z: lerp(1.3, 1.36, u) });
  cOnBed(g, t, { mode: 'evening', dust: 1, lamp: 1, behind: () => { if (come >= 1) Hero(g, { x: DX, y: SIT[1], hip: true, thigh: 20, s: SS * 1.05, ...DADW, ...pose('hold', DX, SIT[1], SS * 1.05, { hip: true }), face: { look: [-0.8, 0.2], smile: 0.3, sad: 0.2, blink: blink(t, 1.2) } }, { dir: -1 }); },
    hero: { ...pose('hold', SIT[0], SIT[1], SS, { hip: true }), headOff: [0, 10], face: { look: come > 0.5 ? [0.8, 0.1] : [0.1, 0.8], sad: 0.9, blink: blink(t, 0.6) } } });
  if (come < 1) { const dx = lerp(-80, DX, come); walker(g, dx, CF, 1.05, 1, t * 5, { ...DADW }); floorShadow(g, dx, CF + 2, 90); }
  daysHud(g, 61);
  caption(g, 'That night, his *dad* sat down next to him.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// INSERT: an old photo in his dad's hand - young dad with a girl, "1996"
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), up = es(t, 78.4, 79.4);
  setCam(g, { x: 960, y: lerp(560, 545, u), z: lerp(1.0, 1.06, u) });
  grad(g, -500, -400, 3000, 1900, [[0, '#a8627a'], [1, '#d08a72']]); glow(g, 960, 500, 700, WARM, 0.2);
  g.save(); g.translate(960, lerp(900, 520, up)); g.rotate(-0.06);
  box(g, -300, -280, 600, 560, '#f7f4ec', 8); grad(g, -260, -240, 520, 400, [[0, '#9ac8e8'], [1, '#f0d8a8']]);
  g.fillStyle = '#e8c9a0'; g.fillRect(-260, 80, 520, 80);
  person(g, { x: -80, y: 140, s: 0.85, col: '#A9A9B4', acc: 'cap', accCol: '#c0453a', handR: [10, -110], face: { smile: 0.9, look: [0.4, 0] } });
  person(g, { x: 90, y: 140, s: 0.8, col: '#C9A77A', acc: 'longhair', accCol: '#5a3a24', handL: [10, -110], face: { smile: 0.9, look: [-0.4, 0] } });
  g.fillStyle = '#2b2b38'; g.font = '44px "Patrick Hand"'; g.textAlign = 'center'; g.fillText('summer 1996', 0, 230);
  g.restore();
  topHand(g, 1240, lerp(1300, 920, up), 1.0, '#A9A9B4', -0.4);
  daysHud(g, 61);
  caption(g, 'An old photo. His dad\'s first *heartbreak*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// MEDIUM: "I thought I'd never smile again." ... "then I met your mom." A small smile.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), sm = es(t, 87.6, 89.0);
  setCam(g, { x: lerp(650, 660, u), y: 500, z: lerp(1.6, 1.66, u) });
  const d = { v: null };
  cOnBed(g, t, { mode: 'evening', dust: 1, lamp: 1, behind: () => { d.v = Hero(g, { x: DX, y: SIT[1], hip: true, thigh: 20, s: SS * 1.05, ...DADW, ...pose('hold', DX, SIT[1], SS * 1.05, { hip: true }), face: { look: [-0.8, 0.1], smile: t > 87.2 ? 0.8 : 0.3, sad: t < 87 ? 0.4 : 0, blink: blink(t, 1.2) } }, { dir: -1 }); },
    hero: { ...pose('hold', SIT[0], SIT[1], SS, { hip: true }), headOff: [0, lerp(8, 2, sm)], face: { look: [0.8, 0], sad: lerp(0.8, 0.1, sm), smile: lerp(-0.1, 0.5, sm), blink: blink(t, 0.6) } } });
  if (d.v) { headText(g, "I thought I'd never smile again.", d.v.head[0] + 40, d.v.head[1] - 110, t, 84.4, 87.0); headText(g, 'then I met your mom.', d.v.head[0] + 40, d.v.head[1] - 110, t, 87.2, 89.9); }
  daysHud(g, 61);
  caption(g, 'His dad had been here *too*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// THE WISDOM
const s4 = card2("You can't start the next chapter", 'if you keep rereading the *last* one.', 0.3, 1.9, 72);
// POV: one small step - mute her stories, archive the chat. He doesn't hate her. He just lets go.
function s5(g, t, a, b) {
  const m1 = es(t, 98.4, 98.8), m2 = es(t, 101.4, 101.8);
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: (g, px, py, pw, ph, tt) => {
    g.fillStyle = '#10131a'; g.fillRect(px, py, pw, ph);
    g.fillStyle = ROSE; g.beginPath(); g.arc(px + pw / 2, py + 150, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('her.story', px + pw / 2, py + 250);
    [['Mute stories', m1], ['Archive chat', m2]].forEach(([l, k], i) => { const y = py + 340 + i * 110; g.fillStyle = '#1b2030'; rr(g, px + 30, y, pw - 60, 80, 16); g.fill(); g.fillStyle = '#fff'; g.font = '600 28px Nunito'; g.textAlign = 'left'; g.fillText(l, px + 56, y + 40);
      rr(g, px + pw - 140, y + 22, 80, 36, 18); g.fillStyle = k > 0.5 ? ROSE : '#3a3f50'; g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(px + pw - 122 + k * 44, y + 40, 14, 0, 7); g.fill(); });
  }, thumb: t => t < 98.4 ? [lerp(1180, 1110, es(t, 97.4, 98.3)), lerp(820, 470, es(t, 97.4, 98.3))] : t < 101.4 ? [lerp(1110, 1110, 1), lerp(470, 580, es(t, 100.4, 101.3))] : [lerp(1110, 1180, es(t, 101.8, 102.6)), lerp(580, 820, es(t, 101.8, 102.6))] });
  daysHud(g, 62);
  caption(g, 'He didn\'t hate her. He just let her *go*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(72, T, [s1, s2, s3, s4, s5]);
})();
