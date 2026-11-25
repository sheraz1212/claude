// ONE CARD AT A TIME - YouTube Short (vertical). A re-edit of the film's own shots: "just 5 minutes" -> 2 hours,
// the boys outside, the cloud that drips YOU WILL FAIL, then exam day: the demon at the door, his card, his eyes
// light up red... cut. A cliffhanger + a "visit the channel" card.
window.WAIT = (async () => {
  const load = src => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.body.appendChild(s); });
  for (const i of [1, 2, 3, 4, 5, 6]) await load('next-step/clip' + i + '.js');
  // the edit: [film start, film end, horizontal shift (screen px), zoom factor, vertical shift (screen px, optional)]
  const SEGS = [[0.3, 5.3, -420, 1.25, -260], [17.6, 21.2, 0, 1.0], [22.6, 25, 0, 0.85], [28, 31.6, 0, 1.0], [61, 64.4, 0, 1.0], [72.2, 77.2, 0, 1.15], [78.3, 81.3, 0, 0.6],
    [153.4, 155.4, 0, 1.0], [163.4, 168.6, 0, 1.0], [168.8, 170.8, 0, 0.95], [171.4, 173.4, 0, 0.9], [173.5, 174.9, 0, 1.0]];
  const CARD = 4.2; let ZK = 1;
  let SHIFT = 0, DY = 0; const _set = setCam;
  setCam = function (g, cam) { _set(g, { x: cam.x + SHIFT / cam.z, y: cam.y + DY / cam.z, z: cam.z * ZK }); };
  const segs = []; let at = 0; for (const [s0, s1, dx, zk, dy] of SEGS) { segs.push({ s0, s1, dx, zk, dy: dy || 0, out: at }); at += s1 - s0; }
  const cardAt = at, dur = at + CARD;
  const events = [];
  for (const sg of segs) for (const [t, n, gain] of EV) if (t >= sg.s0 - 9 && t < sg.s1) events.push([sg.out + (t - sg.s0), n, gain, sg.out + (sg.s1 - sg.s0)]);
  events.push([cardAt, 'low-thud', 0.8, dur], [cardAt + 0.3, 'pen-write', 1, dur], [cardAt + 1.9, 'pen-write', 0.9, dur]);
  CLIP = {
    dur, events,
    frame(g, f) {
      const t = f / FPS; NOW = t;
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      if (t >= cardAt) {
        const k = t - cardAt;
        blackLine(g, 'Visit the channel', seg(k, 0.3, 1.6), ACC, 1, 88, -70);
        blackLine(g, 'for the *full video*.', seg(k, 1.9, 3.0), ACC, 1, 88, 70);
        return;
      }
      const sg = segs.find(s => t < s.out + (s.s1 - s.s0)) || segs[segs.length - 1];
      const src = sg.s0 + (t - sg.out); NOW = src; SHIFT = sg.dx; ZK = sg.zk; DY = sg.dy;
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
