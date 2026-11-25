// LITTLE SHADOW - YouTube Short (vertical). A re-edit of the film's own shots (clips 1-3), reframed for
// a phone screen, ending on the twist ("like you!") as a cliffhanger + a "visit the channel" card.
window.WAIT = (async () => {
  const load = src => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.body.appendChild(s); });
  for (const i of [1, 2, 3]) await load('little-shadow/clip' + i + '.js');
  // the edit: [film start, film end, horizontal shift in screen px to keep the action centred on a phone]
  const SEGS = [[5.0, 10.5, -250], [11.5, 16, 0], [17, 21.5, 0], [22, 26.5, -270], [41.5, 45.5, -270], [60, 64, -280], [70, 75, -90], [75.5, 80.5, -30]];
  const ZK = 1.22, CARD = 4.5;
  let SHIFT = 0; const _set = setCam;
  setCam = function (g, cam) { _set(g, { x: cam.x + SHIFT / cam.z, y: cam.y, z: cam.z * ZK }); };
  const segs = []; let at = 0; for (const [s0, s1, dx] of SEGS) { segs.push({ s0, s1, dx, out: at }); at += s1 - s0; }
  const cardAt = at, dur = at + CARD;
  // sound: every film event still sounding inside a segment, re-timed (python trims the start and cuts at the segment end)
  const events = [];
  for (const sg of segs) for (const [t, n, gain] of EV) if (t >= sg.s0 - 9 && t < sg.s1) events.push([sg.out + (t - sg.s0), n, gain, sg.out + (sg.s1 - sg.s0)]);
  events.push([cardAt + 0.3, 'pen-write', 1, dur], [cardAt + 1.9, 'pen-write', 0.9, dur]);
  CLIP = {
    dur, events,
    frame(g, f) {
      const t = f / FPS; NOW = t;
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      if (t >= cardAt) {   // the end card
        const k = t - cardAt;
        blackLine(g, 'Visit the channel', seg(k, 0.3, 1.6), ACC, 1, 88, -70);
        blackLine(g, 'for the *full video*.', seg(k, 1.9, 3.0), ACC, 1, 88, 70);
        return;
      }
      const sg = segs.find(s => t < s.out + (s.s1 - s.s0)) || segs[segs.length - 1];
      const src = sg.s0 + (t - sg.out); NOW = src; SHIFT = sg.dx;
      const c = CLIPS.find(c => src >= c.T[0] && src < c.T[c.T.length - 1]);
      let i = 0; while (i < c.shots.length - 1 && src >= c.T[i + 1]) i++;
      const fn = c.shots[i], a = c.T[i], b = c.T[i + 1];
      g.save(); fn(g, src, a, b); g.restore();
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
      if (t < 3.4) {   // the hook, over the first shot
        const gr = g.createLinearGradient(0, 0, 0, 520); gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 520);
        blackLine(g, 'So be careful', seg(t, 0.1, 0.9), ACC, 1 - seg(t, 3.0, 3.4), 92, -740);
        blackLine(g, 'what you *do*.', seg(t, 0.9, 1.7), ACC, 1 - seg(t, 3.0, 3.4), 92, -620);
      }
      if (fn.black) return;
      post(g, f, 1);
    }
  };
})();
