// Demon model sheet: next to the hero (1.35x his size), front and side, plus the cracked "weak" state.
const sheet = (g) => {
  noCam(g); g.fillStyle = '#121218'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: 1 });
  g.strokeStyle = '#6a6a78'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, 1000); g.lineTo(W, 1000); g.stroke();
  person(g, { x: 230, y: 1000, s: 1.65, face: { smile: -0.2, sad: 0.5, look: [0.6, 0] } });
  demon(g, { x: 660, y: 1000, s: 1.65 * 1.35 }, { t: 0.4 });
  demon(g, { x: 1180, y: 1000, s: 1.65 * 1.35, view: 'side', dir: -1 }, { t: 1.1 });
  demon(g, { x: 1640, y: 1000, s: 1.65 * 1.1, face: { sad: 0.6, smile: -0.5 } }, { t: 0.7, crack: 0.8 });
  demonText(g, 'tomorrow.', 930, 150, 0, 1, 76);
  person(g, { x: 1930, y: 1000, s: 0.01 });
};
sheet.raw = true;
defineClip(0, [0, 1], [sheet]);
