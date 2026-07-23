import Maxine from "../art/Maxine";
import { Bread, Crown, Flour } from "../art/Decor";

interface Stats {
  depth: number;
  score: number;
  bread: number;
  crowns: number;
  isNewBest: boolean;
}

interface Props {
  stats: Stats;
  onRetry: () => void;
  onMenu: () => void;
}

export default function GameOver({ stats, onRetry, onMenu }: Props) {
  return (
    <div className="absolute inset-0 select-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 50% 40%, #3a1810 0%, #140604 70%, #050201 100%)" }} />
      <Flour count={10} />

      {/* sad spotlight */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-64 h-64 rounded-full blur-3xl" style={{ background: "#ff5a5a22" }} />

      <div className="absolute top-[10%] inset-x-0 text-center slide-up">
        <h2 className="font-display font-bold text-5xl text-amber-100" style={{ textShadow: "0 4px 0 #7a1410, 0 6px 14px rgba(0,0,0,.6)" }}>
          ¡Ay, Maxine!
        </h2>
        <p className="font-display text-amber-200/70 mt-1 text-sm">La cocina ganó esta vez…</p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[26%] pop">
        <div style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>
          <Maxine pose="dead" size={170} />
        </div>
        {/* spilled bread */}
        <div className="absolute -left-6 bottom-2 rotate-12"><Bread type="miche" size={26} /></div>
        <div className="absolute -right-4 bottom-0 -rotate-12"><Bread type="baguette" size={24} /></div>
      </div>

      {/* stats card */}
      <div className="absolute left-6 right-6 top-[56%] slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-2xl border-2 border-amber-300/30 bg-black/45 backdrop-blur-sm p-4 shadow-2xl">
          {stats.isNewBest && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffd27a] text-[#3a2010] font-pixel text-[9px] px-3 py-1 rounded-full border-2 border-[#7a4410] shadow pop">
              ¡NUEVO RÉCORD!
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="PROFUNDIDAD" value={`${stats.depth} m`} color="#7fd0ff" />
            <Stat label="PANCITOS" value={`${stats.bread}`} color="#ffd27a" />
            <Stat label="PUNTOS" value={`${stats.score}`} color="#ff8fa0" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 bg-[#3a2010]/70 rounded-lg py-2 border border-amber-300/20">
            <Crown size={16} />
            <span className="font-display text-amber-100">+{stats.crowns} coronitas para la panadería</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[6%] inset-x-0 px-8 flex flex-col gap-3 slide-up" style={{ animationDelay: "0.35s" }}>
        <button
          onClick={onRetry}
          className="btn-3d font-display font-bold text-2xl text-white py-3 rounded-full border-b-4 active:border-b-0"
          style={{ background: "linear-gradient(180deg,#7fc24a,#3a7a1a)", borderColor: "#1a3a08", boxShadow: "0 8px 20px rgba(58,122,26,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}
        >
          REINTENTAR
        </button>
        <button
          onClick={onMenu}
          className="btn-3d font-display font-semibold text-lg text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
          style={{ background: "linear-gradient(180deg,#7a5a3a,#3a2410)", borderColor: "#1a0c04", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.15)" }}
        >
          Menú principal
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="font-pixel text-[7px] text-amber-200/60">{label}</div>
      <div className="font-display font-bold text-2xl mt-1" style={{ color }}>{value}</div>
    </div>
  );
}
