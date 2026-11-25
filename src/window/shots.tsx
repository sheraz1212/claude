import React from 'react';
import {Hero} from '../common/Hero';
import {Demon} from '../common/Demon';
import {Cam, Stage} from '../common/sets';
import {AcrossScene, MyRoom} from './sets';

/** The repeated shot: from inside, he stands with his back to us at his window, the gold window across. */
export const WindowShot: React.FC<{t: number; scene: AcrossScene; lamp: number; demon?: number; rain?: number; wave?: boolean; push?: number; painting?: 'open' | 'covered' | 'new'}> = ({t, scene, lamp, demon = 0, rain = 0, wave = false, push = 0, painting = 'open'}) => (
  <Stage>
    <Cam s={1.3 + push * 0.06} cx={1510} cy={480}>
      <MyRoom t={t} lamp={lamp} scene={scene} rain={rain} painting={painting} />
      {demon > 0 && <Demon id="dw" x={1700} y={1000} t={t} scale={0.95} size={demon} headTilt={-10} lean={-5} expr={{eyeX: -14}} />}
      <Hero id="hb" x={1420} y={1000} scale={0.95} back pose="arms-down" rHand={wave ? [110, -330 + Math.sin(t * 8) * 20] : undefined} headTilt={Math.sin(t * 0.8) * 2} />
    </Cam>
  </Stage>
);
