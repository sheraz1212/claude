import React from 'react';
import {Composition, Series} from 'remotion';
import {GlassRoomPart1} from './glass-room/Part1';
import {GlassRoomPart2} from './glass-room/Part2';
import {GlassRoomPart3} from './glass-room/Part3';
import {GlassRoomPart4} from './glass-room/Part4';
import {GlassRoomPart5} from './glass-room/Part5';
import {GlassRoomPart6} from './glass-room/Part6';
import {FPS, H, W} from './common/theme';
import {GlassRoomThumb} from './Thumbnail';
import {BlobSheet} from './BlobSheet';
import {DemonSheet} from './DemonSheet';
import {SpotClip1} from './spot/Clip1';
import {SpotClip2} from './spot/Clip2';
import {SpotClip3} from './spot/Clip3';
import {SpotClip4} from './spot/Clip4';
import {SpotClip5} from './spot/Clip5';
import {SpotClip6} from './spot/Clip6';
import {WallClip1} from './wall/Clip1';
import {WallClip2} from './wall/Clip2';
import {KidClip1} from './kid/Clip1';
import {KidClip2} from './kid/Clip2';
import {KidClip3} from './kid/Clip3';
import {KidClip4} from './kid/Clip4';
import {KidClip5} from './kid/Clip5';
import {KidClip6} from './kid/Clip6';
import {SideTest} from './SideTest';
import {Outro} from './Outro';
import {KidThumb} from './KidThumb';
import {WinThumb} from './WinThumb';
import {RestThumb} from './RestThumb';
import {PocketThumb} from './PocketThumb';
import {OneThumb} from './OneThumb';
import {VolumeThumb} from './VolumeThumb';
import {FuseThumb} from './FuseThumb';
import {AllInThumb} from './AllInThumb';
import {ExcusesThumb} from './ExcusesThumb';
import {LifeThumb} from './LifeThumb';
import {CardThumbPressure, CardThumbStress} from './CardThumb';
import {StringThumb} from './StringThumb';
import {WallThumb} from './WallThumb';
import {GoldThumb} from './GoldThumb';
import {HeroSheet} from './HeroSheet';
import {RestClip1} from './rest/Clip1';
import {RestClip2} from './rest/Clip2';
import {RestClip3} from './rest/Clip3';
import {RestClip4} from './rest/Clip4';
import {RestClip5} from './rest/Clip5';
import {RestClip6} from './rest/Clip6';
import {PocketClip1} from './pocket/Clip1';
import {PocketClip2} from './pocket/Clip2';
import {PocketClip3} from './pocket/Clip3';
import {PocketClip4} from './pocket/Clip4';
import {PocketClip5} from './pocket/Clip5';
import {PocketClip6} from './pocket/Clip6';
import {OneClip1} from './one/Clip1';
import {OneClip2} from './one/Clip2';
import {OneClip3} from './one/Clip3';
import {OneClip4} from './one/Clip4';
import {OneClip5} from './one/Clip5';
import {OneClip6} from './one/Clip6';

import {WinClip1} from './window/Clip1';
import {WinClip2} from './window/Clip2';
import {WinClip3} from './window/Clip3';
import {WinClip4} from './window/Clip4';
import {WinClip5} from './window/Clip5';
import {WinClip6} from './window/Clip6';
import {YesClip1} from './yes/Clip1';
import {BackClip1} from './back/Clip1';
import {WildClip1} from './wild/Clip1';
import {WildClip2} from './wild/Clip2';
import {WildClip3} from './wild/Clip3';
import {WildClip4} from './wild/Clip4';
import {WildClip5} from './wild/Clip5';
import {WildClip6} from './wild/Clip6';
import {WildClip7} from './wild/Clip7';
import {BackClip2} from './back/Clip2';
import {BackClip3} from './back/Clip3';
import {BackClip4} from './back/Clip4';
import {BackClip5} from './back/Clip5';
import {BackClip6} from './back/Clip6';
import {BackClip7} from './back/Clip7';
import {YesClip2} from './yes/Clip2';
import {YesClip3} from './yes/Clip3';
import {YesClip4} from './yes/Clip4';
import {YesClip5} from './yes/Clip5';
import {YesClip6} from './yes/Clip6';
import {YesClip7} from './yes/Clip7';
import {EchoPart1} from './echo/Part1';
import {EchoPart2} from './echo/Part2';
import {EchoPart3} from './echo/Part3';
import {EchoPart4} from './echo/Part4';
import {EchoPart5} from './echo/Part5';
import {EchoPart6} from './echo/Part6';

const PARTS = [
  {id: 'GlassRoom-Part1', c: GlassRoomPart1, s: 35},
  {id: 'GlassRoom-Part2', c: GlassRoomPart2, s: 40},
  {id: 'GlassRoom-Part3', c: GlassRoomPart3, s: 40},
  {id: 'GlassRoom-Part4', c: GlassRoomPart4, s: 40},
  {id: 'GlassRoom-Part5', c: GlassRoomPart5, s: 30},
  {id: 'GlassRoom-Part6', c: GlassRoomPart6, s: 35},
];

const GlassRoomFull: React.FC = () => (
  <Series>
    {PARTS.map((p) => (
      <Series.Sequence key={p.id} durationInFrames={p.s * FPS}>
        <p.c />
      </Series.Sequence>
    ))}
  </Series>
);

const WILD = [
  {id: 'Wild-Clip1', c: WildClip1, s: 35},
  {id: 'Wild-Clip2', c: WildClip2, s: 35},
  {id: 'Wild-Clip3', c: WildClip3, s: 35},
  {id: 'Wild-Clip4', c: WildClip4, s: 35},
  {id: 'Wild-Clip5', c: WildClip5, s: 35},
  {id: 'Wild-Clip6', c: WildClip6, s: 35},
  {id: 'Wild-Clip7', c: WildClip7, s: 35},
];

const BACK = [
  {id: 'Back-Clip1', c: BackClip1, s: 35},
  {id: 'Back-Clip2', c: BackClip2, s: 35},
  {id: 'Back-Clip3', c: BackClip3, s: 35},
  {id: 'Back-Clip4', c: BackClip4, s: 35},
  {id: 'Back-Clip5', c: BackClip5, s: 35},
  {id: 'Back-Clip6', c: BackClip6, s: 35},
  {id: 'Back-Clip7', c: BackClip7, s: 35},
];

const YES = [
  {id: 'Yes-Clip1', c: YesClip1, s: 35},
  {id: 'Yes-Clip2', c: YesClip2, s: 35},
  {id: 'Yes-Clip3', c: YesClip3, s: 35},
  {id: 'Yes-Clip4', c: YesClip4, s: 35},
  {id: 'Yes-Clip5', c: YesClip5, s: 35},
  {id: 'Yes-Clip6', c: YesClip6, s: 35},
  {id: 'Yes-Clip7', c: YesClip7, s: 35},
];

const ECHO = [
  {id: 'Echo-Part1', c: EchoPart1, s: 35},
  {id: 'Echo-Part2', c: EchoPart2, s: 40},
  {id: 'Echo-Part3', c: EchoPart3, s: 35},
  {id: 'Echo-Part4', c: EchoPart4, s: 40},
  {id: 'Echo-Part5', c: EchoPart5, s: 30},
  {id: 'Echo-Part6', c: EchoPart6, s: 35},
];

export const RemotionRoot: React.FC = () => (
  <>
    {PARTS.map((p) => (
      <Composition key={p.id} id={p.id} component={p.c} durationInFrames={p.s * FPS} fps={FPS} width={W} height={H} />
    ))}
    {WILD.map((p) => (
      <Composition key={p.id} id={p.id} component={p.c} durationInFrames={p.s * FPS} fps={FPS} width={W} height={H} />
    ))}
    {BACK.map((p) => (
      <Composition key={p.id} id={p.id} component={p.c} durationInFrames={p.s * FPS} fps={FPS} width={W} height={H} />
    ))}
    {YES.map((p) => (
      <Composition key={p.id} id={p.id} component={p.c} durationInFrames={p.s * FPS} fps={FPS} width={W} height={H} />
    ))}
    {ECHO.map((p) => (
      <Composition key={p.id} id={p.id} component={p.c} durationInFrames={p.s * FPS} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="Spot-Clip1" component={SpotClip1} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Spot-Clip2" component={SpotClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Spot-Clip3" component={SpotClip3} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Spot-Clip4" component={SpotClip4} durationInFrames={34 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Spot-Clip5" component={SpotClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Spot-Clip6" component={SpotClip6} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Wall-Clip1" component={WallClip1} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Wall-Clip2" component={WallClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Demon-Sheet" component={DemonSheet} durationInFrames={60} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip1" component={KidClip1} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Side-Test" component={SideTest} durationInFrames={30} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip2" component={KidClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip3" component={KidClip3} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip4" component={KidClip4} durationInFrames={34 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip5" component={KidClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Clip6" component={KidClip6} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Outro" component={Outro} durationInFrames={7 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kid-Thumb" component={KidThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Win-Clip1" component={WinClip1} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Clip2" component={WinClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Clip3" component={WinClip3} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Clip4" component={WinClip4} durationInFrames={34 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Clip5" component={WinClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Clip6" component={WinClip6} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Win-Thumb" component={WinThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Rest-Thumb" component={RestThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Pocket-Thumb" component={PocketThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="One-Thumb" component={OneThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Volume-Thumb" component={VolumeThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Fuse-Thumb" component={FuseThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="AllIn-Thumb" component={AllInThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Excuses-Thumb" component={ExcusesThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Life-Thumb" component={LifeThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Card-Thumb-Pressure" component={CardThumbPressure} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Card-Thumb-Stress" component={CardThumbStress} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="String-Thumb" component={StringThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Wall-Thumb" component={WallThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Gold-Thumb" component={GoldThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Hero-Sheet" component={HeroSheet} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip1" component={RestClip1} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip2" component={RestClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip3" component={RestClip3} durationInFrames={32 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip4" component={RestClip4} durationInFrames={34 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip5" component={RestClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Rest-Clip6" component={RestClip6} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip1" component={PocketClip1} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip2" component={PocketClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip3" component={PocketClip3} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip4" component={PocketClip4} durationInFrames={34 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip5" component={PocketClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Pocket-Clip6" component={PocketClip6} durationInFrames={30 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip1" component={OneClip1} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip2" component={OneClip2} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip3" component={OneClip3} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip4" component={OneClip4} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip5" component={OneClip5} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="One-Clip6" component={OneClip6} durationInFrames={33 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Blob-Sheet" component={BlobSheet} durationInFrames={180} fps={FPS} width={W} height={H} />
    <Composition id="GlassRoom-Thumb" component={GlassRoomThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="GlassRoom-Full" component={GlassRoomFull} durationInFrames={PARTS.reduce((a, p) => a + p.s, 0) * FPS} fps={FPS} width={W} height={H} />
  </>
);
