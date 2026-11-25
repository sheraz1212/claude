// EXCUSES - YouTube Short (vertical). A re-edit of the film's own shots (clips 1-3): all five excuses fast,
// the bar falling to 0%, and a cliffhanger on the reveal (the hand on the bar was his) + a "visit the channel" card.
window.WAIT = (async () => {
  const load = src => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.body.appendChild(s); });
  for (const i of [1, 2, 3]) await load('excuses/clip' + i + '.js');
  // the edit: [film start, film end, horizontal shift (screen px), zoom factor] - inserts are zoomed out so the bar fits
  const SEGS = [[0, 5.5, -100, 1.3], [11.4, 13.6, 0, 0.82], [15, 18.5, 50, 1.35], [22.8, 25, 0, 0.75], [26.3, 28.3, 0, 0.82], [33, 37.5, -40, 1.25], [42.3, 44.3, 0, 0.82],
    [46.3, 50.9, 84, 1.05], [55.3, 57.3, 0, 0.82], [59.5, 63.2, -126, 1.2], [64.2, 66.4, 0, 0.82], [74, 79, 0, 0.82]];
  const CARD = 4.2; let ZK = 1;
  let SHIFT = 0; const _set = setCam;
  setCam = function (g, cam) { _set(g, { x: cam.x + SHIFT / cam.z, y: cam.y, z: cam.z * ZK }); };
  const segs = []; let at = 0; for (const [s0, s1, dx, zk] of SEGS) { segs.push({ s0, s1, dx, zk, out: at }); at += s1 - s0; }
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
      const src = sg.s0 + (t - sg.out); NOW = src; SHIFT = sg.dx; ZK = sg.zk;
      const c = CLIPS.find(c => src >= c.T[0] && src < c.T[c.T.length - 1]);
      let i = 0; while (i < c.shots.length - 1 && src >= c.T[i + 1]) i++;
      const fn = c.shots[i], a = c.T[i], b = c.T[i + 1];
      g.save(); fn(g, src, a, b); g.restore();
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
      if (fn.black) return;
      post(g, f, 1);
    }
  };
})();
