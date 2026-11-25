// CLIP 2 (0:32-1:04) - it repeats: the same alley, a bigger cloud, a bigger voice.
(() => {
const T = [32, 36.5, 41, 46, 50.5, 55, 59.5, 64];
[[32, 'whisper-needit', 1], [41, 'whisper-onemore', 2], [59.5, 'whisper-cantstop', 0]].forEach(([a, w, i]) => { sfx(a + 0.2, 'demon-8bit-' + (i + 1), 0.7); sfx(a + 0.7, w); sfx(a + 0.05, 'count-tick'); sfx(a + 1.9, 'inhale'); sfx(a + 2.5, 'cough'); });
sfx(36.6, 'cup-clink'); sfx(37.6, 'cough'); sfx(38.4, 'cough', 0.8); sfx(38.8, 'pop-8bit-1'); sfx(46, 'run-steps', 0.6); sfx(47.2, 'breath-heavy'); sfx(51, 'pop-8bit-2'); sfx(50.6, 'skate-roll', 0.6); sfx(52.4, 'skate-clack'); sfx(55.5, 'phone-buzz'); sfx(57, 'msg-tick'); sfx(58.1, 'phone-buzz');

const r1 = (g, t, a, b) => alleyRep(g, t, a, b, { n: 9, r: 90, k: 1.0, text: 'you need it.', cap: 'Then every *break*.', bags: 0.3 });
// MEDIUM (the kitchen table): his mom hears the cough. Eli sits exactly like him.
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: 970, y: lerp(580, 570, u), z: lerp(1.3, 1.38, u) });
  kitchen(g, t);
  const c = (t > 37.6 && t < 38.0) || (t > 38.4 && t < 38.8) ? Math.sin(t * 40) * 4 : 0, look = es(t, 38.2, 38.8);
  person(g, { x: 760, y: 744, hip: true, thigh: 20, s: 0.8, ...ELI, headOff: [0, 8], lean: 0.06, face: { look: [0.7 * look, 0.5 * (1 - look)], smile: 0.3 } });
  const mom = person(g, { x: 960, y: 740, hip: true, thigh: 20, s: 1.1, ...MOM, headTilt: 0.05 * look, face: { look: [0.7 * look, 0.5 * (1 - look)], sad: 0.6 * look, smile: 0.3 - 0.5 * look } });
  cloud(g, 1180, 400, 74, t, 1, 6);
  const hero = actor(g, { x: 1180, y: 740 + c, hip: true, thigh: 20, s: HS, headOff: [0, 8 + Math.abs(c) * 2], lean: 0.06, face: { look: [0, 0.8], sad: 0.3, smile: -0.2, blink: c ? 1 : 0.2 } }, { dir: -1, amt: 0.2, dim: 0.05 });
  eyeBags(g, hero, HS, 0.4);
  coughPuffs(g, hero.head[0] - 30, hero.head[1] + 30, t, 37.6, -1); coughPuffs(g, hero.head[0] - 30, hero.head[1] + 30, t, 38.4, -1);
  kitchenTable(g);
  headText(g, 'you okay, honey?', mom.head[0] - 20, mom.head[1] - 104, t, 38.8, 40.6);
  caption(g, 'His mom heard the *cough*.', capA(t, a + 0.5, b - 0.1), ACC);
}
const r3 = (g, t, a, b) => alleyRep(g, t, a, b, { n: 24, r: 150, k: 1.35, text: 'one more.', cap: 'The cloud followed him *everywhere*.', bags: 0.6, slump: 0.5 });
// WIDE, one-off place (school stairs): everyone passes him.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(900, 980, u), y: lerp(560, 530, u), z: 1.05 });
  stairs(g, t);
  [[420, 60, { col: '#8d8d9b', acc: 'cap', accCol: '#5a4a52' }], [150, 75, { col: '#a3927e', acc: 'longhair' }], [1080, 55, { col: '#9a9aa8', acc: 'glasses' }], [-150, 68, { col: '#b0a08c', acc: 'scarf' }]].forEach(([x0, v, o], i) => { const x = x0 + (t - a) * v; climber(g, x, 0.9, x / 24 + i, o); });
  const fy = stairY(740);
  cloud(g, 800, fy - 420, 130, t, 1, 7);
  const pant = Math.sin(t * 5) * 0.03;
  const hero = actor(g, { x: 800, y: fy, s: HS, view: 'side', dir: 1, lean: 0.5 + pant, handR: [846, fy - 170], handL: [830, fy - 168], headOff: [0, 6], face: { look: [0, 0.8], sad: 0.9, smile: -0.5, blink: 0.4 } }, { dir: 1, amt: 0.3, dim: 0.08 });
  for (let i = 0; i < 2; i++) { const p = (t * 0.9 + i * 0.5) % 1; g.fillStyle = `rgba(200,215,240,${0.4 * (1 - p)})`; g.beginPath(); g.arc(hero.head[0] + 60 + p * 60, hero.head[1] + 30 + p * 14, 8 + p * 16, 0, 7); g.fill(); }
  caption(g, 'The stairs got *harder*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (the driveway again): Eli tries to learn alone. He walks the other way.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(980, 940, u), y: 560, z: lerp(1.05, 1.1, u) });
  driveway(g, t);
  const hx = lerp(760, 250, seg(t, a, b)); cloud(g, hx, 400, 110, t, 1, 8);
  const l = walker(g, hx, 840, HS, -1, hx / 34, { armLines: true, headOff: [0, 8], face: { look: [0, 0.6], sad: 0.4 } });
  const fall = es(t, 52.3, 52.8), wob = Math.sin(t * 9) * 0.12 * (1 - fall);
  let eli;
  if (fall < 0.5) eli = rider(g, lerp(1120, 1260, seg(t, a, 52.3)), 838, 0.8, 1, t * 2, { ...ELI, lean: wob, face: { smile: 0.5 - 0.6 * seg(t, 51.8, 52.3), sad: seg(t, 51.8, 52.3) } });
  else { board(g, 1420 + fall * 60, 824, 0.8, 0.3); eli = person(g, { x: 1270, y: 824, hip: true, s: 0.8, view: 'side', dir: -1, ...ELI, legL: [1.5, 0], legR: [1.42, 0], armL: [0.6, 0.4], armR: [-0.5, -0.3], headOff: [0, 6], face: { look: [0, 0.2], sad: 0.9, smile: -0.5 } }); }
  headText(g, 'hey! watch me!', eli.head[0], eli.head[1] - 90, t, 51, 52.3);
  caption(g, 'Eli tried to learn *alone*.', capA(t, a + 0.5, b - 0.1), ACC);
}
function s6(g, t, a, b) {
  phoneShot(g, t, { t0: a, t1: b, name: 'Ray', sub: 'skate park', clock: 'WED 6:58', av: RAY.col, avTop: RAY.accCol, glow: MINT, bg: '40,90,70', buzz: [55.5, 58.1], msgs: [
    { who: 's', text: 'park. got a new flavor.', at: 55.5 }, { who: 'h', text: 'omw.', at: 57 }, { sys: "Mom: dinner's ready", at: 58.1 }] });
  caption(g, 'He always had *time* for it.', capA(t, a + 0.5, b - 0.1), ACC);
}
const r7 = (g, t, a, b) => alleyRep(g, t, a, b, { n: 60, r: 250, k: 1.9, dx: 520, dy: 870, tx: -40, ty: -20, text: "you can't stop.", cap: "He couldn't go an *hour*.", bags: 0.9, slump: 1, lampA: 0.5 });
defineClip(32, T, [r1, s2, r3, s4, s5, s6, r7]);
})();
