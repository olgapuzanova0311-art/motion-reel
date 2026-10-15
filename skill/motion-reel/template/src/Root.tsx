import {Composition} from "remotion";
import {Reel, REEL_DURATION} from "./reel/Reel";

export const RemotionRoot = () => (
  // 16:9, как на экране ноутбука. Для вертикального рилса поменяй на 1080×1920 и перестрой вёрстку сцен.
  <Composition id="reel" component={Reel} durationInFrames={REEL_DURATION} fps={30} width={1920} height={1080} />
);
