// Rig check sheet: hero and demon in the poses the films use, on a plain grey card.
defineClip(0, [0, 1], [(g, t) => {
  noCam(g); g.fillStyle = '#dcdcde'; g.fillRect(0, 0, W, H); setCam(g, { x: 960, y: 540, z: 1 });
  const S = 1.15, Y = 500;
  person(g, { x: 170, y: Y, s: S, face: { smile: 0.5 } });
  person(g, { x: 440, y: Y, s: S, view: 'side', dir: 1, face: { smile: 0.5 } });
  person(g, { x: 700, y: Y, s: S, view: 'back' });
  person(g, { x: 960, y: Y, s: S, armR: [2.6, 0.3], armL: [0.5, 0.6], face: { smile: 0.8 } });
  person(g, { x: 1230, y: Y - 110, hip: true, thigh: 34, s: S, armL: [0.2, -0.42], armR: [0.2, -0.42], headOff: [0, 12], face: { look: [0, 0.9], sad: 0.9, smile: -0.45 } });
  const sw = 0.9; person(g, { x: 1500, y: Y, s: S, view: 'side', dir: 1, legL: [0.48 * sw, -0.3], legR: [-0.48 * sw, -0.1], armL: [-0.4 * sw, 0.25], armR: [0.4 * sw, 0.25], face: { smile: 0.4 } });
  person(g, { x: 1760, y: Y, s: S, handL: [1730, 300], handR: [1795, 300], bendL: -1, bendR: 1, face: { smile: 0.2 } });
  person(g, { x: 170, y: 1000, s: S, col: '#c4ab94', acc: 'longhair', face: { smile: 0.8 } });
  person(g, { x: 430, y: 1000, s: S, view: 'side', dir: 1, col: '#c4ab94', acc: 'longhair', face: { smile: 0.6 } });
  person(g, { x: 690, y: 1000, s: S, col: C.tan, acc: 'cap', face: { smile: 0.6 } });
  person(g, { x: 950, y: 1000, s: S, col: C.grey, acc: 'glasses', face: { smile: 0.3 } });
  demon(g, { x: 1280, y: 1000, s: S * 1.1 }, { t: 0.4 });
  demon(g, { x: 1650, y: 1000, s: S * 1.1, view: 'side', dir: -1, armL: [0.8, 0.5] }, { t: 0.4, crack: 0.6 });
}]);
