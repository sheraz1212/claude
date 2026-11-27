// AFTER HER - CLIP 1 (0:00-0:36): the breakup, her stories every night, her memory beside him, no gym, no game night.
(() => {
const T = [0, 6, 12, 18, 24, 30, 36];
sfx(0.0, 'night-amb'); sfx(0.6, 'phone-tap-soft', 0.6); sfx(2.4, 'scroll-flick', 0.6); sfx(4.2, 'scroll-flick', 0.5);
sfx(6.0, 'room-quiet'); sfx(6.6, 'phone-tap-soft', 0.7); sfx(8.8, 'phone-tap-soft', 0.6); sfx(10.4, 'phone-tap-soft', 0.6);
sfx(12.0, 'night-amb'); sfx(13.2, 'memory-chime', 0.6); sfx(15.6, 'sigh', 0.7);
sfx(18.0, 'birds', 0.7); sfx(18.6, 'phone-buzz', 0.8); sfx(19.4, 'pop-8bit-1'); sfx(21.0, 'pop-8bit-2'); sfx(21.8, 'cloth-rustle', 0.7);
sfx(24.0, 'room-quiet'); sfx(25.0, 'page-turn', 0.6); sfx(26.6, 'page-turn', 0.5); sfx(28.2, 'page-turn', 0.5);
sfx(30.0, 'room-quiet'); sfx(30.6, 'msg-in'); sfx(32.6, 'typing', 0.6); sfx(33.6, 'msg-out');

// HOOK: 2 AM, in bed, the phone glow. Her stories.
function s1(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(420, 440, u), y: lerp(540, 530, u), z: lerp(1.35, 1.42, u) });
  cRoom(g, t, { mode: 'night', lying: true, eyesOpen: true, sad: true, lamp: 0 }); bedGlow(g, t, 0.5);
  daysHud(g, 1);
  hookLine(g, t, 'She moved on. He *didn\'t*.', 0.15, 1.3, 1 - seg(t, 5.4, 5.9));
  caption(g, 'She ended it on a Sunday.', capA(t, 1.4, b - 0.1), ACC);
}
// POV: her story - a sunset, "sunday vibes". Tap, tap, tap.
function storyApp(g, px, py, pw, ph, t) {
  grad(g, px, py, pw, ph, [[0, '#ff9a8a'], [0.6, '#ffc27a'], [1, '#3a2a5a']]);
  g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(px + pw * 0.7, py + ph * 0.35, 50, 0, 7); g.fill();
  g.fillStyle = '#2a4a7a'; g.fillRect(px, py + ph * 0.62, pw, ph * 0.38);
  person(g, { x: px + pw * 0.4, y: py + ph * 0.78, s: 0.5, col: '#C9A77A', acc: 'longhair', accCol: '#2e2420', ...pose('wave', px + pw * 0.4, py + ph * 0.78, 0.5, { dir: -1 }), face: { smile: 0.9 } });
  const n = Math.min(5, Math.floor((t - 6) / 1.1) + 1); for (let i = 0; i < 5; i++) { g.fillStyle = i < n ? '#fff' : 'rgba(255,255,255,0.35)'; g.fillRect(px + 30 + i * ((pw - 60) / 5), py + 30, (pw - 60) / 5 - 8, 5); }
  g.fillStyle = '#fff'; g.font = '800 24px Nunito'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('her.story', px + 80, py + 70); g.beginPath(); g.arc(px + 50, py + 70, 18, 0, 7); g.fillStyle = ROSE; g.fill();
  g.fillStyle = '#fff'; g.font = '700 30px Nunito'; g.textAlign = 'center'; g.fillText('sunday vibes ☀️', px + pw / 2, py + ph * 0.52);
}
function s2(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, draw: storyApp, thumb: t => [1180, ((t - a) % 1.1) < 0.2 ? 760 : 820] });
  daysHud(g, 1 + Math.floor(es(t, a, b) * 6));
  caption(g, 'But every night, he still watched her *stories*.', capA(t, a + 0.3, b - 0.1), ACC);
}
// MEDIUM: on his bed. Her memory sits beside him - soft, pink, see-through.
function s3(g, t, a, b) {
  const u = ease(seg(t, a, b)), PH = pose('phone', SIT[0], SIT[1], SS, { hip: true }), m = es(t, 12.8, 14.0);
  setCam(g, { x: lerp(600, 620, u), y: 520, z: lerp(1.45, 1.52, u) });
  const r = cOnBed(g, t, { mode: 'night', lamp: 1, behind: () => memoryHer(g, SIT[0] + 230, SIT[1], SS, m, { hip: true, thigh: 20, face: { look: [-0.8, 0.2], smile: 0.5 } }), hero: { ...PH, headOff: [0, 8], face: { look: t > 14.4 ? [0.8, 0] : [0.1, 0.9], sad: 0.8, smile: -0.1, blink: blink(t, 0.6) } } });
  phoneAt(g, PH.handR[0], PH.handR[1] - 10, SS, 0.8);
  daysHud(g, 7);
  caption(g, 'Her *memory* sat with him everywhere.', capA(t, a + 0.4, b - 0.1), ACC);
}
// MORNING: "gym? 7am" from his best friend. "nah." He pulls the blanket up.
function s4(g, t, a, b) {
  const u = ease(seg(t, a, b));
  setCam(g, { x: lerp(440, 460, u), y: 520, z: lerp(1.4, 1.46, u) });
  const r = cRoom(g, t, { mode: 'morning', lying: true, eyesOpen: t < 22, sad: true, dust: 0.3 });
  box(g, 346, 600, 14, 30, '#0a0a0e', 3); if (t > 18.6) glow(g, 352, 612, 60, GREEN, 0.4);
  headText(g, 'gym? 7am 💪 - Mike', 520, 470, t, 19.4, 21.0);
  headText(g, 'nah.', r.head[0] + 40, r.head[1] - 100, t, 21.0, 23.6);
  daysHud(g, 9);
  caption(g, 'His best friend asked him to the *gym*. He said no.', capA(t, a + 0.3, b - 0.1), ACC);
}
s4.fin = 0.4;
// INSERT: the gym bag gathers dust. The calendar flips - week 1, 2, 3, 4.
function s5(g, t, a, b) {
  const u = ease(seg(t, a, b)), wk = Math.min(4, 1 + Math.floor((t - 24.6) / 1.6));
  setCam(g, { x: lerp(1560, 1580, u), y: 520, z: lerp(1.8, 1.9, u) });
  cRoom(g, t, { mode: 'morning', dust: Math.min(1, (t - a) / 5) });
  box(g, 1440, 260, 220, 200, '#f7f4ec', 6); g.fillStyle = '#c0453a'; g.fillRect(1440, 260, 220, 46); g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CALENDAR', 1550, 284);
  g.fillStyle = '#2b2b38'; g.font = '800 54px Nunito'; g.fillText('WEEK ' + wk, 1550, 386);
  daysHud(g, 7 * wk);
  caption(g, 'One week became *four*.', capA(t, a + 0.4, b - 0.1), ACC);
}
// POV (chat): "game night tonight? 🏀" - "can't."
function s6(g, t, a, b) {
  phonePOV(g, t, { t0: a, t1: b, glow: 0.5, buzz: [30.6], draw: chatApp('the boys 🏀', [{ who: 'r', text: 'game night tonight? we miss you bro', at: 30.6 }, { who: 'me', text: "can't.", at: 33.6 }]),
    thumb: t => t > 32.6 && t < 33.6 ? [1040 + Math.sin(t * 30) * 12, 700] : [1180, 820] });
  daysHud(g, 28);
  caption(g, 'His friends invited him to game night. *No* again.', capA(t, a + 0.3, b - 0.1), ACC);
}
defineClip(0, T, [s1, s2, s3, s4, s5, s6]);
})();
