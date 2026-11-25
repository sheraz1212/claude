import {continueRender, delayRender, staticFile} from 'remotion';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BAR = 44; // letterbox bar height

export const C = {
  bg: '#0f1114',
  line: '#3d434d',
  lineSoft: '#2a2f37',
  outline: '#23262c',
  cream: '#F3EBCF',
  teal: '#5E9E95',
  caption: '#F4E7C8',
  cold: '#5b8fe0',
  coldLight: '#8fb8f0',
  amber: '#E9A94F',
  amberLight: '#F2C27A',
  grey: '#9a9da3',
  tan: '#c9ad86',
};

export const sec = (s: number) => Math.round(s * FPS);

// Load local fonts once and block rendering until ready.
const fontHandle = delayRender('fonts');
Promise.all([
  new FontFace('Patrick Hand', `url(${staticFile('fonts/PatrickHand-Regular.ttf')})`).load(),
  new FontFace('Nunito', `url(${staticFile('fonts/Nunito.ttf')})`, {weight: '200 1000'}).load(),
  new FontFace('Caveat Brush', `url(${staticFile('fonts/CaveatBrush-Regular.ttf')})`).load(),
  new FontFace('Permanent Marker', `url(${staticFile('fonts/PermanentMarker.woff2')})`).load(),
  new FontFace('Knewave', `url(${staticFile('fonts/Knewave.woff2')})`).load(),
])
  .then((faces) => {
    faces.forEach((f) => document.fonts.add(f));
    continueRender(fontHandle);
  })
  .catch((e) => {
    console.error(e);
    continueRender(fontHandle);
  });
