// Hero model sheet: front and side, on the same card as references/hero.png.
const sheet = (g) => {
  noCam(g); g.fillStyle = '#d8d8da'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: 1 });
  person(g, { x: 700, y: 1012, s: 2.25, face: { smile: 0.4 } });
  person(g, { x: 1250, y: 1012, s: 2.25, view: 'side', dir: -1, face: { smile: 0.4 } });
};
sheet.raw = true;
defineClip(0, [0, 1], [sheet]);
