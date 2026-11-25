// CLIP 4 (1:36-2:08) - the low point (the losses pile up), the stat card, wisdom lines, delete, the text.
(() => {
const T = [96, 101.5, 106.5, 110, 114.5, 119, 123.5, 128];
sfx(96.0, 'night-amb'); sfx(96.6, 'demon-brass', 0.8); sfx(97.4, 'whisper-winback');
sfx(101.5, 'coin-rain'); sfx(102.2, 'heartbeat', 0.8); sfx(102.4, 'whisper-double', 0.8); sfx(103.8, 'whisper-due', 0.7); sfx(104.8, 'whisper-nobody', 0.7); sfx(105.6, 'whisper-double', 0.5);
sfx(106.7, 'pen-write'); sfx(110.4, 'pen-write'); sfx(114.9, 'pen-write');
sfx(119.0, 'room-quiet'); sfx(120.0, 'tap', 0.7); sfx(121.6, 'tap'); sfx(121.8, 'delete-poof'); sfx(122.4, 'celesta-sparkle', 0.5);
sfx(123.5, 'room-quiet'); sfx(124.2, 'msg-send'); sfx(126.4, 'msg-tick');

// WIDE (low point, place): the edge of his bed. The voice is huge now.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(820, 800, u), y: lerp(520, 510, u), z: lerp(1.0, 1.08, u) });
  const r = onBed(g, t, { demon: 1.35, dA: es(t, 96.6, 97.4), dtext: 'win it back.', da: Math.min(seg(t, 97.4, 97.7), 1 - seg(t, 100.9, 101.4)), tx: 320, ty: -30, hero: { headOff: [0, 8], face: { look: [0, 0.9], sad: 0.9, smile: -0.25, blink: blink(t, 0.6) } } });
  phoneAt(g, SIT[0] + 60, SIT[1] - 6, SS, 0.15, 1.2);
  counter(g, t);
  caption(g, 'He owed more than he *had*.', capA(t, a + 0.5, b - 0.1), ACC);
}
s1.fin = 0.5;
// CLOSE (imagery at the low point): coins rain down and pile up around him
function s2(g, t, a, b) {
  const u = ease(seg(t, a, b)), k = seg(t, 101.6, 106.3);
  setCam(g, { x: 580, y: lerp(470, 465, u) + Math.sin(t * 40) * es(t, 104.5, 106.4) * 3, z: lerp(1.9, 2.05, u) });
  const r = onBed(g, t, { demon: 2.4, dx: 280, dy: 1420, dA: 1, hero: { armLines: false, headOff: [0, 10], handL: [SIT[0] - 62, SIT[1] - 140], handR: [SIT[0] + 62, SIT[1] - 138], face: { look: [0, 0.6], sad: 1, smile: -0.35, blink: 1 } } });
  const q = rng(77), pile = 742 - k * 150;
  for (let i = 0; i < 70; i++) { const x = 160 + q() * 900, sp = 0.6 + q() * 0.6, ph_ = (t * sp + q()) % 1; if (t < 101.6 + q() * 2) continue; coin(g, x, 120 + ph_ * (pile - 120), 0.9, t * 5 + i); }
  for (let i = 0; i < 90; i++) { const x = 160 + q() * 900, y = 742 - q() * (742 - pile); if (y < pile) continue; coin(g, x, y, 0.9, i); }
  demonText(g, 'just double it.', 760, 290, t, Math.min(seg(t, 102.4, 102.7), 1 - seg(t, 103.6, 103.8)), 58);
  demonText(g, "you're due.", 420, 300, t, Math.min(seg(t, 103.8, 104.1), 1 - seg(t, 104.6, 104.8)), 60);
  demonText(g, 'nobody has to know.', 660, 280, t, seg(t, 104.8, 105.1), 54);
  counter(g, t);
  caption(g, 'The losses piled *up*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// THE SHOCK STAT CARD + WISDOM LINES
const s3 = card('$20 a day = *$7,300* a year.', 0.3, 2.0, 92);
const s4 = card('Every bet felt *small*.', 0.4, 2.3, 96);
const s5 = card('Every loss was *real*.', 0.4, 2.3, 96);
// POV (the tiny decision): press and hold - "Delete LuckyLine?" - Delete.
function s6(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.4, draw: homeApp({ del: [120.0, 121.6] }), thumb: t => t < 120.6 ? [lerp(1180, 975, es(t, 119.2, 119.9)), lerp(800, 430, es(t, 119.2, 119.9))] : t < 121.7 ? [lerp(975, 1040, es(t, 120.6, 121.4)), lerp(430, 620, es(t, 120.6, 121.4))] : [lerp(1040, 1180, es(t, 121.8, 122.4)), lerp(620, 820, es(t, 121.8, 122.4))] });
  counter(g, t);
  caption(g, 'He *deleted* it.', capA(t, 121.9, b - 0.1), ACC);
}
s6.fin = 0.4;
// POV (the next step): a text to Marcus
function s7(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.3, draw: chatApp('Marcus', [{ who: 'r', text: "who's got the late game?", at: 0 }, { who: 's', text: 'we need to talk.', at: 124.2 }, { typing: true, at: 125.0, until: 126.4 }, { who: 'r', text: '...yeah. we do.', at: 126.4 }]) });
  counter(g, t);
  caption(g, 'Then he texted *Marcus*.', capA(t, a + 0.5, b - 0.1), ACC);
}
defineClip(96, T, [s1, s2, s3, s4, s5, s6, s7]);
})();
