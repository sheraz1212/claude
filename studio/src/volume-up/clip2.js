// CLIP 2 (0:32-1:04) - the habit repeats: the same dinner, the bus, his room. The bar climbs.
(() => {
const T = [32, 37.5, 43, 48.5, 54, 59, 64];
sfx(32.0, 'dinner-amb'); sfx(32.2, 'phones-leak', 0.5); sfx(33.0, 'pop-8bit-1'); sfx(35.2, 'pop-8bit-2'); sfx(34.2, 'dish-clink', 0.7);
sfx(37.5, 'bus-ride', 0.8); sfx(37.6, 'phones-leak', 0.6); [38.6, 39.0].forEach(x => sfx(x, 'vol-tick', 0.6));
sfx(43.0, 'dinner-amb'); sfx(43.0, 'phones-leak', 0.6); sfx(43.8, 'pop-8bit-3'); sfx(45.4, 'demon-8bit-2'); sfx(46.0, 'whisper-turnitup'); [46.4, 46.8].forEach(x => sfx(x, 'vol-tick', 0.65));
sfx(48.5, 'dinner-amb'); sfx(50.6, 'harm-down', 0.8);
sfx(54.0, 'dinner-amb'); sfx(54.0, 'phones-leak', 0.75); sfx(55.0, 'dish-clink', 0.5); sfx(56.4, 'vol-tick', 0.7);
sfx(59.0, 'night-amb'); sfx(59.3, 'harm-muffled'); sfx(59.0, 'phones-leak', 0.8); [61.0, 61.4, 61.8].forEach(x => sfx(x, 'vol-tick', 0.7));

// the REPEATED SHOT: the dinner table. o: vol, hero, gpa, mom, demon (k), dtext, harm
function dinner(g, t, o = {}) {
  dinnerRoom(g, t);
  if (o.demon) demonAt(g, t, 1430, 900, o.demon, o.dtext, o.da ?? 1, { a: o.dA ?? 1, tx: 40, ty: 150, face: { look: [-0.6, 0.4] } });
  const m = Mom(g, { x: DIN[0], y: 740, hip: true, thigh: 20, s: 1.1, handL: [DIN[0] - 40, 712], handR: [DIN[0] + 44, 712], armLines: false, face: { look: [0.8, 0], smile: 0.4, blink: blink(t, 2) }, ...(o.mom || {}) }, { dir: 1 });
  const gp = Gpa(g, { x: DIN[1], y: 740, hip: true, thigh: 20, s: 1.1, handL: [DIN[1] - 42, 712], handR: [DIN[1] + 46, 712], armLines: false, face: { look: [0.6, 0.1], smile: 0.4, blink: blink(t, 0.7) }, ...(o.gpa || {}) }, { dir: 1 });
  const hr = Hero(g, { x: DIN[2], y: 740, hip: true, thigh: 20, s: 1.1, handL: [DIN[2] - 30, 712], handR: [DIN[2] + 44, 700], armLines: false, face: { look: [0.1, 0.8], smile: 0.1, blink: blink(t, 0.2) }, ...(o.hero || {}) }, { dir: -1 });
  phones(g, hr, 1.1, { on: 1 }); phoneIn(g, [DIN[2] + 44, 700], 1.1, 0.5);
  dinnerTable(g, t, { harm: o.harm });
  if ((o.vol ?? 6) >= 0) volBar(g, hr.head[0] + 80, hr.head[1] - 100, 1.0, o.vol ?? 6);
  return { m, gp, hr };
}
// WIDE (the repeated shot, first time): Mom asks, he hears nothing; Grandpa leans in - "what?"
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 975, u), y: lerp(590, 600, u), z: lerp(1.15, 1.23, u) });
  const lean = es(t, 35.0, 35.5);
  const { m, gp } = dinner(g, t, { vol: 6, mom: { face: { look: [0.9, 0], smile: 0.4 } }, gpa: { lean: -0.12 * lean, headTilt: -0.1 * lean, handL: [DIN[1] - 42, 712], handR: lean > 0 ? [DIN[1] + 50, 520] : [DIN[1] + 46, 712], face: { look: [-0.6, 0], sad: 0.3 * lean, smile: 0.2 } } });
  headText(g, 'how was school?', m.head[0], m.head[1] - 115, t, 33.0, 35.0);
  headText(g, 'hm? say again?', gp.head[0], gp.head[1] - 115, t, 35.2, 37.3);
  caption(g, 'At dinner, the headphones stayed *on*.', capA(t, a + 0.6, b - 0.1), ACC);
}
s1.fin = 0.5;
// WIDE (one-off place): the bus. An old man stands; he sits with his eyes shut
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), bob = Math.sin(t * 9) * 2;
  setCam(g, { x: lerp(940, 960, u), y: 540 + bob * 0.3, z: lerp(1, 1.07, u) });
  bus(g, t);
  P(g, { x: 250, y: 700 + bob, hip: true, thigh: 20, s: 1.0, col: '#8d8d9b', acc: 'cap', accCol: '#4a3a46', handL: [236, 640], handR: [262, 630], face: { look: [0, 0.8] } }); phoneIn(g, [262, 630], 1, 0.4);
  P(g, { x: 600, y: 700 + bob, hip: true, thigh: 20, s: 1.0, col: '#b49b80', acc: 'longhair', face: { look: [0.5, 0], blink: blink(t, 1.5) } });
  const hr = Hero(g, { x: 960, y: 700 + bob, hip: true, thigh: 20, s: 1.0, headTilt: Math.sin(t * 2.4) * 0.05, face: { blink: 1, smile: 0.25 } }, { dir: -1 });
  phones(g, hr, 1.0, { on: 1 });
  P(g, { x: 1670, y: 700 + bob, hip: true, thigh: 20, s: 1.0, col: '#9a9aa8', acc: 'glasses', face: { look: [-0.5, 0.6] } });
  const om = P(g, { x: 1300, y: 822, s: 0.98, lean: 0.08, col: '#a2a2ae', acc: 'glasses', handR: [1420, 440], handL: [1240, 700], bendL: 1, face: { look: [-0.7, 0.3], sad: 0.4, smile: 0, blink: blink(t, 0.5) } });
  busFront(g); floorShadow(g, 1300, 824, 90); ln(g, [1238, 700, 1220, 822], 5, '#6a5844');
  volBar(g, hr.head[0] + 80, hr.head[1] - 100, 0.9, kf(t, [[38.6, 6], [39.2, 7]]));
  caption(g, 'On the bus, he heard *nothing*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s2.fin = 0.4;
// REPEATED SHOT (2): Grandpa holds the harmonica out across the table. The voice is bigger.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 43.4, 44.0), dA = es(t, 45.4, 46.2);
  setCam(g, { x: lerp(1060, 1080, u), y: 540, z: lerp(1.2, 1.28, u) });
  const hx = lerp(DIN[1] + 46, DIN[1] + 150, k);
  const { gp } = dinner(g, t, { vol: kf(t, [[46.3, 7], [46.9, 8]]), demon: 0.95, dA, dtext: 'turn it up.', da: Math.min(seg(t, 46.0, 46.3), 1 - seg(t, 48.1, 48.5)), gpa: { lean: 0.08 * k, handR: [hx, 690], face: { look: [0.7, 0], smile: 0.7 } }, hero: { face: { look: [0.1, 0.85], smile: 0.15, blink: blink(t, 0.2) } } });
  harmonica(g, hx + 6, 676, 1.1, 0.05);
  headText(g, 'after dinner, a song?', gp.head[0], gp.head[1] - 115, t, 43.8, 46.0);
  caption(g, 'Grandpa kept *trying*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// CLOSE (emotion): Grandpa's smile fades; he lowers the harmonica
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = es(t, 50.2, 51.2);
  setCam(g, { x: DIN[1] + 20, y: lerp(560, 550, u), z: lerp(2.0, 2.1, u) });
  dinner(g, t, { vol: -1, gpa: { headTilt: 0.06 * k, headOff: [0, 6 * k], handR: [lerp(DIN[1] + 120, DIN[1] + 46, k), lerp(690, 712, k)], face: { look: [lerp(0.7, 0.1, k), lerp(0, 0.8, k)], smile: lerp(0.6, -0.15, k), sad: 0.5 * k, blink: blink(t, 0.9) } } });
  harmonica(g, lerp(DIN[1] + 126, DIN[1] + 56, k), lerp(676, 704, k), 1.1, 0.05);
  caption(g, 'His smile got a little *smaller*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// REPEATED SHOT (3): no one talks. Mom looks at him. The voice is HEAVY behind him.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(960, 975, u), y: lerp(590, 600, u), z: lerp(1.15, 1.23, u) });
  dinner(g, t, { vol: kf(t, [[56.4, 8], [56.9, 9]]), demon: 1.2, mom: { face: { look: [0.9, 0.1], sad: 0.5, smile: -0.1 } }, gpa: { headOff: [0, 6], face: { look: [0, 0.9], sad: 0.4, smile: -0.1 } }, harm: [DIN[1] + 40, 712] });
  caption(g, 'Soon, no one *talked*.', capA(t, a + 0.5, b - 0.1), ACC);
}
// WIDE (his room, night): the harmonica plays through the wall. He turns it up to MAX.
function s6(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(880, 860, u), y: 545, z: lerp(1, 1.06, u) });
  const r = heroRoom(g, t, { lying: true, under: 1, eyesOpen: true });
  const fade = 1 - es(t, 61.0, 62.2);
  notes(g, 1700, 740, t, fade, 1, '255,214,150', -1);
  volBar(g, r.head[0] + 90, r.head[1] - 130, 1.0, kf(t, [[60.9, 9], [62.0, 10]]));
  caption(g, 'He turned it all the way *up*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s6.fin = 0.5;
defineClip(32, T, [s1, s2, s3, s4, s5, s6]);
})();
