// Shared drawing kit for every video: maths, camera, the hero rig, text, film look.
// ?portrait = a vertical 1080x1920 frame for YouTube Shorts (no letterbox bars, captions higher up)
const PORTRAIT = new URLSearchParams(location.search).has('portrait');
const W = PORTRAIT ? 1080 : 1920, H = PORTRAIT ? 1920 : 1080, FPS = 30, BAR = PORTRAIT ? 0 : 60;
const C = { cream: '#F3EBCF', line: '#1b1a20', text: '#F3E9D2', tan: '#C9A77A', grey: '#A9A9B4' };

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, u) => a + (b - a) * u;
const ease = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const es = (t, a, b) => ease(seg(t, a, b));
function kf(t, k) {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++)
    if (t <= k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], ease((t - k[i][0]) / (k[i + 1][0] - k[i][0])));
  return k[k.length - 1][1];
}
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// ---------------------------------------------------------------- camera
let CAM = { x: W / 2, y: H / 2, z: 1 };
let NOW = 0;   // the film clock, so idle motion (arm sway) never freezes
function setCam(g, cam) { CAM = cam; g.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z, H / 2 - cam.y * cam.z); }
function noCam(g) { g.setTransform(1, 0, 0, 1, 0, 0); }

// ---------------------------------------------------------------- the hero rig
// One smooth shape: every body part is drawn twice (dark, slightly fatter, then cream),
// so the outline only runs around the whole silhouette. Arms get their own inner line
// from the armpit down, like references/hero.png.
function person(g, p) {
  const s = p.s || 1, col = p.col || C.cream, ln = p.line || C.line;
  const ow = (p.ow || Math.max(1.5, 2.6 * Math.pow(s, 0.72))) / s;
  const view = p.view || 'front', d = p.dir || 1, side = view === 'side';
  const TH = p.thigh ?? 76, SHN = 76, TOR = 126, HR = 54, U = 56, F = 54, AW = 25, HX = 14.5, HY = 15;   // arm width and round hand, measured from references/hero.png
  const dv = a => [Math.sin(a), Math.cos(a)];
  const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
  const hip = p.hip ? [0, 0] : [0, -(TH + SHN + 14)];
  const L = p.lean || 0;
  const up = [Math.sin(L), -Math.cos(L)], along = [-up[0], -up[1]], perp = [Math.cos(L), Math.sin(L)];
  const neck = add(hip, up, TOR);
  const ht = L + (p.headTilt || 0), ho = p.headOff || [0, 0];
  const head = [neck[0] + Math.sin(ht) * 46 + ho[0], neck[1] - Math.cos(ht) * 46 + ho[1]];
  const tw = side ? 84 : 100;
  const shapes = [];
  shapes.push({ k: 'cap', pts: [add(neck, along, tw / 2 - 4), add(hip, up, 16)], w: tw });
  if (!side) {   // like the reference: no neck - a wide rounded top right under the head, and wide rounded hips
    const tc = add(neck, along, 22), bc = add(hip, along, 12);
    shapes.push({ k: 'cap', pts: [add(tc, perp, -27), add(tc, perp, 27)], w: 40 }, { k: 'cap', pts: [add(bc, perp, -27), add(bc, perp, 27)], w: 44 });
  }
  const headS = { k: 'ell', c: head, rx: HR, ry: HR, rot: 0 };   // the head is drawn crisp on top, so it meets the body in a clean crease

  // legs
  const feet = [], hands = [];
  const legs = [['L', -1], ['R', 1]].map(([n, sg]) => {
    const a = p['leg' + n] || [0, 0];   // legs stand straight, like references/hero.png
    const h = side ? add(hip, perp, sg * 3) : add(hip, perp, sg * 22);
    const t1 = (side ? d : sg) * a[0], t2 = t1 + (side ? d : sg) * a[1];
    const knee = add(h, dv(t1), TH), ank = add(knee, dv(t2), SHN);
    const foot = side ? [ank[0] + d * 10, ank[1] + 3.5] : [ank[0] + sg * 4, ank[1] + 3.5];
    const sl = Math.hypot(ank[0] - knee[0], ank[1] - knee[1]) || 1, sd = [(ank[0] - knee[0]) / sl, (ank[1] - knee[1]) / sl];
    shapes.push({ k: 'cap', pts: [h, knee, add(ank, sd, -8)], w: 31 });   // simple straight legs, same width all the way down
    feet.push({ k: 'ell', c: foot, rx: side ? 23 : 21, ry: 10.5, rot: 0, ank, sd });   // small flat oval feet, drawn crisp (not melted)
    return { h, knee, ank, foot };
  });

  // arms
  const arms = [['L', -1], ['R', 1]].map(([n, sg]) => {
    const sh = side ? add(neck, along, tw / 2 - 2) : add(add(neck, along, tw / 2 - 15), perp, sg * 50);
    let el, wr;
    const tgt = p['hand' + n];
    if (tgt) {
      const T = [(tgt[0] - p.x) / s, (tgt[1] - p.y) / s];
      let dx = T[0] - sh[0], dy = T[1] - sh[1], dist = Math.hypot(dx, dy);
      const dd = clamp(dist, 8, (U + F) * 0.9), base = Math.atan2(dy, dx);   // never locked dead straight: a soft elbow always shows
      const A = Math.acos(clamp((U * U + dd * dd - F * F) / (2 * U * dd), -1, 1));
      // HUMAN ELBOWS: unless a pose forces it, the elbow hangs DOWN with gravity (the lower of the two
      // possible elbows); when both are level (hand raised high) it points OUTWARD, away from the body.
      let bend = p['bend' + n];
      if (bend == null) {
        const yA = Math.sin(base + A), yB = Math.sin(base - A), xA = Math.cos(base + A), xB = Math.cos(base - A);
        const out = side ? -d : sg;
        bend = (yA + 0.9 * xA * out) > (yB + 0.9 * xB * out) ? 1 : -1;   // lower and outward wins
      }
      el = [sh[0] + Math.cos(base + bend * A) * U, sh[1] + Math.sin(base + bend * A) * U];
      wr = [sh[0] + Math.cos(base) * dd, sh[1] + Math.sin(base) * dd];
    } else {
      // NO ROBOT ARMS: a resting arm hangs with a soft bend at the elbow, the two arms are never
      // identical, and both keep a small slow sway (hero, demon and everyone else).
      const rest = !p['arm' + n], ph = p.x * 0.013 + (sg > 0 ? 1.9 : 0), k = p.still ? 0 : 1;
      const a0 = p['arm' + n] || (side ? [sg > 0 ? 0.0 : -0.02, 0.03] : [sg > 0 ? 0.085 : 0.075, sg > 0 ? -0.03 : -0.02]);   // arms hang down like the reference
      const a = [a0[0] + k * (rest ? 0.025 : 0.02) * Math.sin(NOW * 1.3 + ph), a0[1] + k * (rest ? 0.04 : 0.03) * Math.sin(NOW * 1.05 + ph + 1.2)];
      const t1 = (side ? d : sg) * a[0], t2 = t1 + (side ? d : sg) * a[1];
      el = add(sh, dv(t1), U); wr = add(el, dv(t2), F);
    }
    const fl = Math.hypot(wr[0] - el[0], wr[1] - el[1]) || 1, fd = [(wr[0] - el[0]) / fl, (wr[1] - el[1]) / fl];
    const hc = add(wr, fd, 11), rot = Math.atan2(fd[1], fd[0]) - Math.PI / 2;
    const inner = side ? [d * Math.abs(fd[1]), -d * fd[0] * Math.sign(fd[1] || 1)] : [fd[1] * sg, -fd[0] * sg];
    const th = add(add(wr, fd, 4), inner, -15);
    const parts = [{ k: 'cap', pts: [sh, el, wr], w: AW }, { k: 'ell', c: hc, rx: HX, ry: HY, rot }];   // round mitten, no separate thumb
    shapes.push(parts[0]); hands.push({ k: 'ell', c: hc, rx: HX, ry: HY, rot, wr, fd });   // hands are drawn crisp, as round balls
    return { sh, el, wr, hc, fd, rot, parts };
  });

  const path = (c, sh, grow = 0) => {
    c.beginPath();
    if (sh.k === 'cap') { c.moveTo(sh.pts[0][0], sh.pts[0][1]); for (let i = 1; i < sh.pts.length; i++) c.lineTo(sh.pts[i][0], sh.pts[i][1]); }
    else c.ellipse(sh.c[0], sh.c[1], Math.max(0.5, sh.rx + grow), Math.max(0.5, sh.ry + grow), sh.rot, 0, 7);
  };
  // fill every part in one colour; grow > 0 fattens it (the outline), grow < 0 thins it (a mask)
  const fillAll = (c, list, colour, grow) => {
    c.lineCap = 'round'; c.lineJoin = 'round'; c.fillStyle = c.strokeStyle = colour;
    for (const sh of list) { path(c, sh, grow); if (sh.k === 'cap') { c.lineWidth = Math.max(1, sh.w + 2 * grow); c.stroke(); } else c.fill(); }
  };
  // SMOOTH SILHOUETTE: the parts are melted into one soft shape (blur + threshold), so there are
  // no bumps or pinches at the neck, shoulders, wrists, hips and ankles - one flowing outline.
  const M = g.getTransform().translate(p.x, p.y).scale(s, s), px = Math.hypot(M.a, M.b);
  const sig = clamp(Math.round(4.2 * px), 1, 48);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const sh of shapes.concat(feet, hands, [headS])) for (const q of (sh.k === 'cap' ? sh.pts : [sh.c])) {
    const r = (sh.k === 'cap' ? sh.w / 2 : Math.max(sh.rx, sh.ry)) + ow + 2, X = M.a * q[0] + M.e, Y = M.d * q[1] + M.f;
    x0 = Math.min(x0, X - r * px); x1 = Math.max(x1, X + r * px); y0 = Math.min(y0, Y - r * px); y1 = Math.max(y1, Y + r * px);
  }
  const pad = sig * 3 + 4; x0 = Math.max(0, Math.floor(x0 - pad)); y0 = Math.max(0, Math.floor(y0 - pad)); x1 = Math.min(W, Math.ceil(x1 + pad)); y1 = Math.min(H, Math.ceil(y1 + pad));
  const bw = x1 - x0, bh = y1 - y0, vis = bw > 2 && bh > 2;
  if (!_SA) { _SA = mk(W, H).getContext('2d'); _SB = mk(W, H).getContext('2d'); _SC = mk(W, H).getContext('2d'); }
  // melt the cream shape once; the outline is that same shape made a little fatter, so the
  // outline has one even thickness everywhere and never fills the gaps between limbs.
  const melt = () => {
    _SA.setTransform(1, 0, 0, 1, 0, 0); _SA.clearRect(x0, y0, bw, bh); _SA.setTransform(M); fillAll(_SA, shapes, col, 0);
    _SB.setTransform(1, 0, 0, 1, 0, 0); _SB.globalCompositeOperation = 'source-over'; _SB.clearRect(x0, y0, bw, bh);
    _SB.filter = `url(#goo${sig})`; _SB.drawImage(_SA.canvas, x0, y0, bw, bh, x0, y0, bw, bh); _SB.filter = 'none';
    _SC.setTransform(1, 0, 0, 1, 0, 0); _SC.globalCompositeOperation = 'source-over'; _SC.clearRect(x0, y0, bw, bh); _SC.drawImage(_SB.canvas, x0, y0, bw, bh, x0, y0, bw, bh);
    _SC.globalCompositeOperation = 'source-in'; _SC.fillStyle = ln; _SC.fillRect(x0, y0, bw, bh); _SC.globalCompositeOperation = 'source-over';
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const o = ow * px;
    for (let i = 0; i < 16; i++) { const an = i * Math.PI / 8; g.drawImage(_SC.canvas, x0, y0, bw, bh, x0 + Math.cos(an) * o, y0 + Math.sin(an) * o, bw, bh); }
    g.drawImage(_SB.canvas, x0, y0, bw, bh, x0, y0, bw, bh); g.restore();
  };
  // long hair hangs BEHIND the head (never over the face)
  if (p.acc === 'longhair') {
    g.save(); g.translate(p.x, p.y); g.scale(s, s);
    const bd = view === 'back' ? 0 : (side ? d : 1);
    g.fillStyle = p.accCol || '#3a2d2a'; g.strokeStyle = ln; g.lineWidth = ow;
    g.beginPath(); g.ellipse(head[0] - bd * 50, head[1] + 44, 17, 56, bd * 0.3, 0, 7); g.fill(); g.stroke(); g.restore();
  }
  if (vis) melt();

  g.save();
  g.translate(p.x, p.y); g.scale(s, s);
  g.lineCap = 'round'; g.lineJoin = 'round';
  // head: a clean circle sitting right on the body - no neck, and no line where they overlap
  g.fillStyle = ln; g.beginPath(); g.arc(head[0], head[1], HR + ow, 0, 7); g.fill();
  g.fillStyle = col; g.beginPath(); g.arc(head[0], head[1], HR, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(head[0], head[1], HR + ow + 0.6, 0, 7); g.clip(); g.strokeStyle = col;
  for (const sh of shapes.slice(0, side ? 1 : 2)) { g.lineWidth = Math.max(2, sh.w - ow * 3.2); g.beginPath(); g.moveTo(sh.pts[0][0], sh.pts[0][1]); g.lineTo(sh.pts[1][0], sh.pts[1][1]); g.stroke(); }
  g.restore();
  // feet: plain flat ovals under each leg, with the leg flowing into them (no seam)
  for (const f of feet) { g.fillStyle = ln; g.beginPath(); g.ellipse(f.c[0], f.c[1], f.rx + ow, f.ry + ow, 0, 0, 7); g.fill(); }
  for (const f of feet) {
    g.fillStyle = col; g.beginPath(); g.ellipse(f.c[0], f.c[1], f.rx, f.ry, 0, 0, 7); g.fill();
    g.strokeStyle = col; g.lineWidth = 31 - ow * 0.4; g.lineCap = 'butt'; g.beginPath(); g.moveTo(f.ank[0] - f.sd[0] * 26, f.ank[1] - f.sd[1] * 26); g.lineTo(f.ank[0] - f.sd[0] * 4, f.ank[1] - f.sd[1] * 4); g.stroke(); g.lineCap = 'round';
  }
  // hands: a round ball at the end of each arm with a small pinch at the wrist
  if (side && Math.hypot(hands[0].c[0] - hands[1].c[0], hands[0].c[1] - hands[1].c[1]) < 16) hands.shift();   // side view at rest: the far hand is hidden behind the near one
  for (const h of hands) { g.fillStyle = ln; g.beginPath(); g.ellipse(h.c[0], h.c[1], h.rx + ow, h.ry + ow, h.rot, 0, 7); g.fill(); }
  for (const h of hands) {
    g.fillStyle = col; g.beginPath(); g.ellipse(h.c[0], h.c[1], h.rx, h.ry, h.rot, 0, 7); g.fill();
    g.strokeStyle = col; g.lineWidth = AW - 2; g.lineCap = 'butt'; g.beginPath(); g.moveTo(h.wr[0] - h.fd[0] * 14, h.wr[1] - h.fd[1] * 14); g.lineTo(h.wr[0] + h.fd[0] * 2, h.wr[1] + h.fd[1] * 2); g.stroke(); g.lineCap = 'round';
  }
  // inner lines (arm edges, hand, the line between the legs) - only where a part lies over the body
  if (vis) {
    const c = _SB; c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.clearRect(x0, y0, bw, bh);
    if (p.armLines !== false) for (const a of (side ? [arms[1]] : arms)) {
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
      _SC.setTransform(1, 0, 0, 1, 0, 0); _SC.clearRect(x0, y0, bw, bh); _SC.setTransform(M);
      fillAll(_SC, shapes.filter(sh => !a.parts.includes(sh)), '#000', -ow * 1.0);      // where the rest of the body is
      const A = _SA; A.setTransform(1, 0, 0, 1, 0, 0); A.globalCompositeOperation = 'source-over'; A.clearRect(x0, y0, bw, bh); A.setTransform(M);
      A.strokeStyle = ln; A.fillStyle = '#000'; A.lineWidth = ow; A.lineCap = 'round'; A.lineJoin = 'round';
      const P = [[a.sh[0] + (a.el[0] - a.sh[0]) * 0.3, a.sh[1] + (a.el[1] - a.sh[1]) * 0.3], a.el, a.wr];
      const nrm = (u, v) => { const l = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1; return [-(v[1] - u[1]) / l, (v[0] - u[0]) / l]; };
      const n1 = nrm(P[0], P[1]), n2 = nrm(P[1], P[2]); let nm = [n1[0] + n2[0], n1[1] + n2[1]]; const nl = Math.hypot(nm[0], nm[1]) || 1, k = Math.min(1.6, 2 / nl); nm = [nm[0] / nl * k, nm[1] / nl * k];
      const ul = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]) || 1, fg = A.createLinearGradient(P[0][0], P[0][1], P[0][0] + (P[1][0] - P[0][0]) / ul * 24, P[0][1] + (P[1][1] - P[0][1]) / ul * 24);
      fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, ln); A.strokeStyle = fg;     // the arm line fades in below the shoulder
      A.beginPath();
      for (const sg of [-1, 1]) { const h = AW / 2 * sg; A.moveTo(P[0][0] + n1[0] * h, P[0][1] + n1[1] * h); A.lineTo(P[1][0] + nm[0] * h, P[1][1] + nm[1] * h); A.lineTo(P[2][0] + n2[0] * h, P[2][1] + n2[1] * h); }
      A.stroke(); A.strokeStyle = ln;
      A.globalCompositeOperation = 'destination-out'; A.beginPath(); A.ellipse(a.hc[0], a.hc[1], HX, HY, a.rot, 0, 7); A.fill();   // arm lines stop at the hand
      A.globalCompositeOperation = 'source-over';
      A.globalCompositeOperation = 'destination-out'; A.lineWidth = AW - ow * 1.6; A.beginPath(); A.moveTo(a.el[0], a.el[1]); A.lineTo(a.wr[0] + a.fd[0] * 5, a.wr[1] + a.fd[1] * 5); A.stroke();   // no seam at the wrist
      A.globalCompositeOperation = 'source-over';
      A.setTransform(1, 0, 0, 1, 0, 0); A.globalCompositeOperation = 'destination-in'; A.drawImage(_SC.canvas, x0, y0, bw, bh, x0, y0, bw, bh); A.globalCompositeOperation = 'source-over';
      c.drawImage(A.canvas, x0, y0, bw, bh, x0, y0, bw, bh);
    }
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c.canvas, x0, y0, bw, bh, x0, y0, bw, bh); g.restore();
    if (px > 0.9 && p.armLines !== false) for (const a of (side ? [arms[1]] : arms)) {     // two small soft knuckle curves, like the reference
      g.save(); g.translate(a.hc[0], a.hc[1]); g.rotate(a.rot); g.strokeStyle = ln; g.globalAlpha = 0.5; g.lineWidth = ow * 0.6;
      g.beginPath(); g.arc(-7, 0, 9, 0.15, 1.15); g.stroke(); g.beginPath(); g.arc(-1, -2, 9, 0.35, 1.25); g.stroke(); g.restore();
    }
  }

  // face
  const f = p.face || {};
  if (view !== 'back') {
    const look = f.look || [0, 0], bl = f.blink || 0, sad = f.sad || 0, sm = f.smile ?? 0.15;
    g.fillStyle = p.faceCol || ln; g.strokeStyle = p.faceCol || ln; g.lineWidth = Math.max(ow * 0.8, 1.7);
    if (!side) {
      const cx = head[0] + look[0] * 15, cy = head[1] + look[1] * 11 + 3;
      for (const sg of [-1, 1]) {
        const ex = cx + sg * 19 * (1 - Math.abs(look[0]) * 0.12);
        g.beginPath(); g.ellipse(ex, cy, 4.4 * (f.wide || 1), Math.max(0.9, 4.8 * (f.wide || 1) * (1 - bl)), 0, 0, 7); g.fill();   // small round dot eyes
        const inY = cy - 14 - sad * 6, outY = cy - 14 + sad * 4;
        g.beginPath(); g.moveTo(ex - sg * 9, inY); g.quadraticCurveTo(ex, (inY + outY) / 2 - 2.5 + sad * 1.5, ex + sg * 9, outY); g.stroke();
      }
      g.beginPath(); g.moveTo(cx - 8, cy + 21); g.quadraticCurveTo(cx, cy + 21 + sm * 8, cx + 8, cy + 21); g.stroke();
    } else {
      const cx = head[0] + d * 28, cy = head[1] + 2 + look[1] * 9;
      g.beginPath(); g.ellipse(cx, cy, 4.4, Math.max(0.9, 4.8 * (1 - bl)), 0, 0, 7); g.fill();
      g.beginPath(); g.moveTo(cx - d * 9, cy - 14 + sad * 4); g.quadraticCurveTo(cx, cy - 18, cx + d * 9, cy - 14 - sad * 5); g.stroke();
      g.beginPath(); g.moveTo(cx + d * 4, cy + 22); g.quadraticCurveTo(cx + d * 10, cy + 22 + sm * 7, cx + d * 16, cy + 19); g.stroke();
    }
  }

  // one simple accessory for supporting characters
  if (p.acc === 'cap') {
    const cc = p.accCol || '#3b4a63';
    g.fillStyle = cc; g.strokeStyle = ln; g.lineWidth = ow;
    g.beginPath(); g.arc(head[0], head[1], HR + 2, Math.PI * 1.06, Math.PI * 1.94); g.closePath(); g.fill(); g.stroke();
    const bd = view === 'back' ? 0 : d;
    if (bd) { g.beginPath(); g.ellipse(head[0] + bd * (side ? 52 : 26), head[1] - 12, side ? 34 : 40, 8, bd * 0.1, 0, 7); g.fill(); g.stroke(); }
  }
  if (p.acc === 'longhair') {
    g.fillStyle = p.accCol || '#3a2d2a'; g.strokeStyle = ln; g.lineWidth = ow;
    g.beginPath();
    if (view === 'back') g.arc(head[0], head[1], HR + 2, 0, 7); else g.arc(head[0] - (side ? d * 6 : 0), head[1], HR + 2, Math.PI * (side ? (d > 0 ? 0.75 : 0.95) : 1.13), Math.PI * (side ? (d > 0 ? 2.05 : 2.25) : 1.87));
    g.closePath(); g.fill(); g.stroke();
  }
  if (p.acc === 'scarf') {
    g.strokeStyle = p.accCol || '#6b4a5a'; g.lineWidth = 22;
    g.beginPath(); g.moveTo(neck[0] - 36, neck[1] + 6); g.quadraticCurveTo(neck[0], neck[1] + 20, neck[0] + 36, neck[1] + 6); g.stroke();
  }
  if (p.acc === 'glasses' && view !== 'back') {
    g.strokeStyle = ln; g.lineWidth = ow;
    const cx = head[0] + (side ? d * 27 : 0), cy = head[1] - 3;
    for (const sg of side ? [0] : [-1, 1]) { g.beginPath(); g.arc(cx + sg * 19, cy, 13, 0, 7); g.stroke(); }
  }
  g.restore();
  const w = q => [p.x + q[0] * s, p.y + q[1] * s];
  return { head: w(head), hr: HR * s, handL: w(arms[0].hc), handR: w(arms[1].hc), neck: w(neck), hip: w(hip) };
}

// POSES: correct hand targets for everyday actions, measured from the body (so the arms always look human).
// name: rest | phone (one hand, in front of the chest) | phone2 (both hands) | ear (phone at the ear) | dribble |
// shoot / cheer (both arms up) | wave | table (forearms on a table at tableY) | hold (an object at the belly, both hands) | face (hands to the face)
// x, y = feet (or hip with o.hip), s = scale. Use: person(g, { x, y, s, ...pose('phone', x, y, s) })
function pose(name, x, y, s = 1, o = {}) {
  const hipY = o.hip ? y : y - 166 * s, neckY = hipY - 126 * s, chest = neckY + 52 * s, d = o.dir || 1, headY = neckY - 46 * s;
  switch (name) {
    case 'phone': return { handR: [x + 22 * s * d, chest + 6 * s], handL: null };
    case 'phone2': return { handR: [x + 24 * s, chest + 26 * s], handL: [x - 24 * s, chest + 30 * s] };
    case 'ear': return { handR: [x + 50 * s * d, headY + 14 * s] };
    case 'dribble': return { handR: [x + 62 * s * d, hipY + 46 * s] };
    case 'shoot': case 'cheer': return { handR: [x + 66 * s, headY - 44 * s], handL: [x - 66 * s, headY - 44 * s] };
    case 'wave': return { handL: [x - 74 * s * d, headY - 40 * s] };
    case 'table': return { handL: [x - 64 * s, o.tableY ?? hipY - 14 * s], handR: [x + 64 * s, o.tableY ?? hipY - 14 * s] };
    case 'hold': return { handL: [x - 34 * s, hipY - 34 * s], handR: [x + 34 * s, hipY - 34 * s] };
    case 'face': return { handL: [x - 46 * s, headY + 26 * s], handR: [x + 46 * s, headY + 26 * s] };
    default: return {};
  }
}

// Draw a character on its own layer so it can be shaded by the scene's light.
// light: {dir: -1 | 1 (side the light comes from), amt: shadow strength, dim: overall darkening}
let _SA, _SB, _SC;
let _PL;
function actor(g, p, light = {}) {
  if (!_PL) _PL = mk(W, H);
  const l = _PL.getContext('2d');
  noCam(l); l.clearRect(0, 0, W, H);
  l.setTransform(g.getTransform());
  const r = person(l, p);
  noCam(l);
  const z = CAM.z, sx = (r.head[0] - CAM.x) * z + W / 2, span = 150 * (p.s || 1) * z;
  l.globalCompositeOperation = 'source-atop';
  const dir = light.dir ?? 1, amt = light.amt ?? 0.35;
  const gr = l.createLinearGradient(sx - span * dir, 0, sx + span * dir, 0);
  gr.addColorStop(0, `rgba(12,12,30,${amt})`); gr.addColorStop(0.55, `rgba(12,12,30,${amt * 0.25})`); gr.addColorStop(1, 'rgba(12,12,30,0)');
  l.fillStyle = gr; l.fillRect(0, 0, W, H);
  if (light.dim) { l.fillStyle = `rgba(8,8,18,${light.dim})`; l.fillRect(0, 0, W, H); }
  l.globalCompositeOperation = 'source-over';
  g.save(); noCam(g); g.drawImage(_PL, 0, 0); g.restore();
  return r;
}
function floorShadow(g, x, y, rx, a = 0.45) {
  const gr = g.createRadialGradient(x, y, 0, x, y, rx);
  gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.translate(x, y); g.scale(1, 0.22); g.translate(-x, -y); g.fillStyle = gr; g.fillRect(x - rx, y - rx, rx * 2, rx * 2); g.restore();
}

// ---------------------------------------------------------------- text
// Bottom caption = the narrator. "*word*" marks the accent-colour word.
function parts(text) { return text.split('*').map((s, i) => ({ s, acc: i % 2 === 1 })).filter(p => p.s); }
function richLine(g, text, cx, y, accent, base) {
  const ps = parts(text); let w = 0; for (const p of ps) w += g.measureText(p.s).width;
  let x = cx - w / 2; g.textAlign = 'left';
  for (const p of ps) { g.fillStyle = p.acc ? accent : base; g.fillText(p.s, x, y); x += g.measureText(p.s).width; }
  return w;
}
function caption(g, text, a, accent) {
  if (a <= 0) return;
  g.save(); noCam(g); g.globalAlpha = clamp(a);
  g.font = (PORTRAIT ? 66 : 58) + 'px "Patrick Hand"'; g.textBaseline = 'alphabetic';
  g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 14; g.shadowOffsetY = 2;
  const y = (PORTRAIT ? H * 0.7 : 978) + (1 - clamp(a)) * 8;
  g.lineJoin = 'round'; g.lineWidth = 9; g.strokeStyle = 'rgba(8,8,12,0.85)'; g.textAlign = 'center';
  g.strokeText(text.replace(/\*/g, ''), W / 2, y);
  g.shadowBlur = 0; g.shadowOffsetY = 0;
  richLine(g, text, W / 2, y, accent, C.text);
  g.restore();
}
function capA(t, a, b) { return Math.min(seg(t, a, a + 0.35), 1 - seg(t, b - 0.3, b)); }
// Black-screen line that writes itself on from left to right.
function blackLine(g, text, prog, accent, a = 1, size = 96, dy = 0) {
  g.save(); noCam(g); g.globalAlpha = a;
  g.font = `${size}px "Patrick Hand"`; g.textBaseline = 'middle';
  let w = 0; for (const p of parts(text)) w += g.measureText(p.s).width;
  const x0 = W / 2 - w / 2 - 20;
  g.beginPath(); g.rect(x0, H / 2 + dy - size, (w + 40) * clamp(prog), size * 2); g.clip();
  richLine(g, text, W / 2, H / 2 + dy, accent, C.text);
  g.restore();
}

// ---------------------------------------------------------------- film look
let _grain;
function post(g, f, fade = 1) {
  noCam(g);
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * (PORTRAIT ? 0.62 : 1.05) / (PORTRAIT ? 1 : 1));
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  if (!_grain) {
    _grain = [1, 2, 3].map(sd => {
      const c = mk(480, 270), x = c.getContext('2d'), im = x.createImageData(480, 270), r = rng(sd * 977);
      for (let i = 0; i < im.data.length; i += 4) { const n = 128 + (r() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = n; im.data[i + 3] = 255; }
      x.putImageData(im, 0, 0); return c;
    });
  }
  g.save(); g.globalAlpha = 0.085; g.globalCompositeOperation = 'overlay'; g.imageSmoothingEnabled = true;
  g.drawImage(_grain[f % 3], 0, 0, W, H); g.restore();
  if (fade < 1) { g.fillStyle = `rgba(0,0,0,${1 - fade})`; g.fillRect(0, 0, W, H); }
  g.fillStyle = '#000'; g.fillRect(0, 0, W, BAR); g.fillRect(0, H - BAR, W, BAR);
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

// ---------------------------------------------------------------- head text, demon, HUD
const RED = '#ff3a2c';
function toScreen(wx, wy) { return [(wx - CAM.x) * CAM.z + W / 2, (wy - CAM.y) * CAM.z + H / 2]; }
// Head text = words said or thought by / to a character. White, Nunito regular 40px, soft 10% capsule.
function headText(g, text, wx, wy, t, t0, t1) {
  if (t < t0 || t > t1) return;
  const [sx, sy] = toScreen(wx, wy), u = seg(t, t0, t0 + 0.2);
  const sc = u < 1 ? 0.7 + 0.3 * ease(u) + 0.08 * Math.sin(u * Math.PI) : 1, a = Math.min(u * 2, 1, 1 - seg(t, t1 - 0.25, t1));
  g.save(); noCam(g); g.globalAlpha = clamp(a); g.font = '400 40px Nunito';
  const w = g.measureText(text).width + 48;
  g.translate(clamp(sx, w / 2 + 30, W - w / 2 - 30), Math.max(sy, BAR + 50)); g.scale(sc, sc);
  rr(g, -w / 2, -34, w, 68, 34); g.fillStyle = 'rgba(0,0,0,0.1)'; g.fill();
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 12; g.fillText(text, 0, 2);
  g.restore();
}
// THE DEMON: the hero's own shape, charcoal black, red glow, red face, embers. o: {t, glow, crack, a}
let _DL;
function demon(g, p, o = {}) {
  if (!_DL) _DL = mk(W, H);
  const l = _DL.getContext('2d'), s = p.s || 1;
  noCam(l); l.clearRect(0, 0, W, H); l.setTransform(g.getTransform());
  const r = person(l, { ...p, col: '#141217', line: '#050506', faceCol: RED, face: { sad: -0.9, smile: 0.5, ...(p.face || {}) } });
  if (o.crack > 0) {
    l.globalCompositeOperation = 'source-atop'; l.strokeStyle = RED; l.lineWidth = 3 * s; l.lineJoin = 'bevel';
    const q = rng(41), n = Math.floor(o.crack * 10);
    for (let i = 0; i < n; i++) {
      let x = r.hip[0] + (q() - 0.5) * 110 * s, y = r.head[1] + q() * (r.hip[1] - r.head[1] + 110 * s);
      l.beginPath(); l.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (q() - 0.5) * 50 * s; y += q() * 36 * s; l.lineTo(x, y); } l.stroke();
    }
    l.globalCompositeOperation = 'source-over';
  }
  const a = o.a ?? 1;
  g.save(); noCam(g); g.globalAlpha = a; g.shadowColor = 'rgba(255,40,25,0.95)'; g.shadowBlur = (o.glow ?? 34) * Math.max(0.6, s * CAM.z * 0.6);
  g.drawImage(_DL, 0, 0); g.shadowBlur *= 0.35; g.drawImage(_DL, 0, 0); g.restore();
  const t = o.t || 0, e = rng(9);
  g.save(); g.fillStyle = RED;
  for (let i = 0; i < 12; i++) {
    const ph = (t * 0.45 + e()) % 1, x = p.x + (e() - 0.5) * 130 * s + Math.sin(t * 2 + i) * 8 * s, y = p.y - ph * 170 * s, rad = (1.6 + e() * 2.2) * s;
    g.globalAlpha = (1 - ph) * 0.85 * a; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
  }
  g.restore();
  return r;
}
// The demon's words: red brush handwriting, no capsule.
function demonText(g, text, wx, wy, t, a = 1, size = 70) {
  if (a <= 0) return;
  const [sx, sy] = toScreen(wx, wy);
  g.save(); noCam(g); g.globalAlpha = clamp(a); g.translate(sx, sy); g.rotate(-0.05 + Math.sin(t * 2.3) * 0.02);
  g.font = `${size}px "Caveat Brush"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(255,30,20,0.9)'; g.shadowBlur = 18; g.fillStyle = RED; g.fillText(text, Math.sin(t * 7) * 1.5, 0);
  g.restore();
}
function hud(g, label, val, a = 1) {
  g.save(); noCam(g); g.globalAlpha = 0.85 * a; g.textBaseline = 'middle'; g.textAlign = 'left';
  if (PORTRAIT) { g.translate(0, 120); g.scale(1.7, 1.7); }
  g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 8;
  g.font = '600 24px Nunito'; g.fillStyle = '#b9b3a2'; g.fillText(label, 76, 112);
  g.font = '700 34px Nunito'; g.fillStyle = C.text; g.fillText(String(val), 76 + g.measureText(label).width * 24 / 34 + 34, 112);
  g.restore();
}
// Shared clip runner. Shots are functions (g, t) on the film's global clock.
let CLIP, EV = [];
function sfx(t, name, gain = 1) { EV.push([t, name, gain]); }
function defineClip(t0, T, shots) {
  (window.CLIPS = window.CLIPS || []).push({ t0, T, shots });   // registry, so a Short can re-edit a film's shots
  CLIP = {
    dur: T[T.length - 1] - t0, events: EV,
    frame(g, f) {
      const t = t0 + f / FPS; NOW = t;
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      let i = 0; while (i < shots.length - 1 && t >= T[i + 1]) i++;
      const fn = shots[i];
      g.save(); fn(g, t, T[i], T[i + 1]); g.restore();
      noCam(g); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
      let fade = 1;
      if (fn.fin) fade = Math.min(fade, seg(t, T[i], T[i] + fn.fin));
      if (fn.fout) fade = Math.min(fade, 1 - seg(t, T[i + 1] - fn.fout, T[i + 1]));
      if (fn.raw) return;
      if (fn.black) { g.fillStyle = `rgba(0,0,0,${1 - fade})`; g.fillRect(0, 0, W, H); g.fillStyle = '#000'; g.fillRect(0, 0, W, BAR); g.fillRect(0, H - BAR, W, BAR); }
      else post(g, f, fade);
    }
  };
}
