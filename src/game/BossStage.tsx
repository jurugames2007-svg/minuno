import { useEffect } from "react";
import type { BossType } from "../art/Bosses";
import type { SkinId } from "../data/skins";
import * as Audio from "./AudioEngine";
import GenreFight from "./GenreFight";

interface Props {
  type: BossType;
  level: number;
  skin: SkinId;
  hearts: number;
  onHurt: () => void;
  onWin: () => void;
}

/** Caja Mega Man: intro corta + minijuego de género, sin cajas de texto. */
export default function BossStage(props: Props) {
  useEffect(() => {
    Audio.startBossTheme(props.type);
    return () => {
      Audio.stopBossTheme();
      Audio.startAmbientMusic();
    };
  }, [props.type]);

  return <GenreFight {...props} />;
}
