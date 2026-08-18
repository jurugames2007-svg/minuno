import { useState } from "react";
import Maxine from "../art/Maxine";
import { Bread, Flour, KitchenBackdrop, Crown } from "../art/Decor";
import { Plushie, TOOL_MAP, type ToolId } from "../art/Plushie";
import type { SkinId } from "../data/skins";

interface Props {
  skin: SkinId;
  best: number;
  crumbs: number;
  startTool: ToolId;
  ownedTools: ToolId[];
  storyWon: boolean;
  checkpoint: number;
  unlocked: number[];
  onSelectCheckpoint: (lv: number) => void;
  onPlay: () => void;
  onShop: () => void;
  onHouse: () => void;
  onStory: () => void;
}

export default function Menu({ skin, best, crumbs, startTool, ownedTools, storyWon, checkpoint, unlocked, onSelectCheckpoint, onPlay, onShop, onHouse, onStory }: Props) {
  const [help, setHelp] = useState(false);

  return (
    <div className="absolute inset-0 select-none">
      <KitchenBackdrop depth={0} />
      <Flour count={28} />

      <svg className="absolute top-0 left-0 w-full" height="90" viewBox="0 0 360 90" preserveAspectRatio="none">
        <g stroke="#5a3a1a" strokeWidth="2">
          <line x1="40" y1="0" x2="40" y2="40" />
          <line x1="320" y1="0" x2="320" y2="54" />
          <line x1="180" y1="0" x2="180" y2="30" />
        </g>
        <path d="M32 40 h16 v6 a8 8 0 0 1 -16 0 Z" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1.4" />
        <circle cx="180" cy="36" r="8" fill="#c9842a" stroke="#5a3a10" strokeWidth="1.2" />
      </svg>

      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
        <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-300/30">
          <Crown size={16} />
          <span className="font-display font-bold text-[14px] text-amber-200 tabular-nums">{crumbs}</span>
        </div>
        <button onClick={onStory} title="Ver la historia" className="btn-3d bg-black/45 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-300/30 font-display font-semibold text-[13px] text-amber-100">
          Historia
        </button>
        <div className="bg-black/35 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-300/30 font-display text-[12px] text-amber-100 leading-tight text-right">
          Récord<br /><span className="text-amber-300 text-[15px] font-bold">{best} m</span>
        </div>
      </div>
      {storyWon && (
        <div className="absolute top-[52px] left-1/2 -translate-x-1/2 z-20 bg-[#7fc24a] text-[#1a3a08] font-display font-bold text-[12px] px-2.5 py-1 rounded-full border-2 border-[#1a3a08] shadow pop">
          Javiera rescatada · piel Feo desbloqueada
        </div>
      )}

      <div className="absolute top-[13%] inset-x-0 text-center z-10 px-6 slide-up">
        <div className="inline-block relative">
          <h1
            className="font-display font-bold leading-none text-[58px] tracking-tight"
            style={{
              color: "#fff3d6",
              textShadow: "0 4px 0 #7a3410, 0 6px 0 #3a1808, 0 8px 18px rgba(0,0,0,.5)",
              WebkitTextStroke: "2px #5a2810",
            }}
          >
            MAXINE
          </h1>
          <div className="absolute -top-3 -right-4 rotate-12">
            <Bread type="croissant" size={34} />
          </div>
          <div className="absolute -top-2 -left-5 -rotate-12">
            <Bread type="pretzel" size={30} />
          </div>
        </div>
        <p className="font-display text-amber-200/90 tracking-[0.22em] text-[13px] mt-1 uppercase font-semibold">Panadería Encantada</p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[32%] z-10">
        <div className="relative">
          <svg width="220" height="120" viewBox="0 0 220 120" className="absolute left-1/2 -translate-x-1/2 top-10">
            <ellipse cx="110" cy="92" rx="100" ry="22" fill="#000" opacity="0.35" />
            <path d="M20 80 Q20 40 110 38 Q200 40 200 80 Q200 100 110 102 Q20 100 20 80 Z" fill="#d99243" stroke="#5a2810" strokeWidth="3" />
            <path d="M30 70 Q110 50 190 70" stroke="#f4c389" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M70 50 l6 30 M110 46 l0 34 M150 50 l-6 30" stroke="#7a3410" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex justify-center" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))" }}>
            <div className="absolute left-[28%] top-[56%] z-20 rotate-12" style={{ animation: "hop 1.8s ease-in-out infinite" }}>
              <Plushie id={startTool} size={startTool === "kissy" ? 38 : 34} />
            </div>
            <Maxine skin={skin} pose="idle" size={176} />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 bg-[#fff3d6] border-2 border-[#7a3410] rounded-full px-3 py-0.5 font-display font-bold text-[11px] text-[#7a3410] shadow pop flex items-center gap-1 whitespace-nowrap">
            <Plushie id={startTool} size={12} />
            <span>Arranque: {TOOL_MAP[startTool].name}</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 font-display text-[11px] text-amber-200/70">
            {ownedTools.length} herramientas en la mochila
          </div>
        </div>
      </div>

      <div className="absolute left-6 top-[58%] hop" style={{ animationDelay: "0.2s" }}><Bread type="baguette" size={30} /></div>
      <div className="absolute right-8 top-[62%] hop" style={{ animationDelay: "0.9s" }}><Bread type="miche" size={30} /></div>

      <div className="absolute bottom-[5%] inset-x-0 px-6 flex flex-col gap-2 z-20 slide-up" style={{ animationDelay: "0.15s", paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={onPlay}
          className="btn-3d font-display font-bold text-[22px] text-white py-3 rounded-full border-b-4 active:border-b-0"
          style={{ background: "linear-gradient(180deg,#ff7a4a,#d9342b)", borderColor: "#7a1410", boxShadow: "0 8px 20px rgba(217,52,43,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}
        >
          ¡A cavar!{checkpoint > 1 ? ` · N${checkpoint}` : ""}
        </button>
        <div className="bg-black/35 backdrop-blur-sm rounded-xl p-2 border border-amber-300/20">
          <div className="font-display font-semibold text-[11px] text-amber-200/80 text-center mb-1.5">Checkpoint cada 5 niveles</div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 5, 10, 15, 20].map((lv) => {
              const isUnlocked = unlocked.includes(lv);
              const isActive = checkpoint === lv;
              return (
                <button key={lv} disabled={!isUnlocked} onClick={() => isUnlocked && onSelectCheckpoint(lv)}
                  className="btn-3d font-display font-bold text-[12px] py-2 rounded-lg border-b-2 active:border-b-0 flex flex-col items-center justify-center"
                  style={{
                    background: isActive ? "linear-gradient(180deg,#7fc24a,#3a7a1a)" : isUnlocked ? "#3a2010" : "#1a0c04",
                    color: isActive ? "#fff" : isUnlocked ? "#ffd27a" : "#6a5a4a",
                    borderColor: isActive ? "#1a3a08" : "#1a0c04",
                    opacity: isUnlocked ? 1 : 0.5,
                  }}>
                  <span>N{lv}</span>
                  <span className="text-[10px] font-semibold">{isUnlocked ? (isActive ? "aquí" : "ok") : "—"}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onHouse}
            className="btn-3d font-display font-semibold text-[14px] text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
            style={{ background: "linear-gradient(180deg,#7fc24a,#3a7a1a)", borderColor: "#1a3a08", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.3)" }}
          >
            Casa
          </button>
          <button
            onClick={onShop}
            className="btn-3d font-display font-semibold text-[14px] text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
            style={{ background: "linear-gradient(180deg,#e3a35a,#a8642a)", borderColor: "#5a2810", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.3)" }}
          >
            Tienda
          </button>
          <button
            className="btn-3d font-display font-semibold text-[17px] text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
            style={{ background: "linear-gradient(180deg,#7a5a3a,#3a2410)", borderColor: "#1a0c04", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.15)" }}
            onClick={() => setHelp(true)}
          >
            Cómo jugar
          </button>
        </div>
      </div>

      <div className="absolute bottom-1 inset-x-0 text-center font-display text-[10px] text-amber-200/40 z-10">v2.0 · torre de bolsillo</div>

      {help && <HelpModal onClose={() => setHelp(false)} />}
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-[360px] rounded-2xl border-2 border-amber-300/30 bg-[#2a1408] p-4 shadow-2xl slide-up max-h-[82%] overflow-y-auto scrollbar-none">
        <h2 className="font-display font-bold text-[22px] text-amber-50 text-center">Cómo se juega</h2>
        <p className="font-display text-[13px] text-amber-100/85 mt-2 leading-snug text-center">
          Sube la torre de la cocina, cava, salta y rescata a Javiera.
        </p>
        <ul className="mt-3 space-y-1.5 font-display text-[13px] text-amber-100/90">
          <li><b className="text-amber-200">Mover</b> — deslizá a los lados (o A / D)</li>
          <li><b className="text-amber-200">Saltar</b> — deslizá hacia arriba (o espacio)</li>
          <li><b className="text-amber-200">Cavar</b> — botón CAVAR, deslizá abajo o S</li>
          <li><b className="text-amber-200">Pegar</b> — tocá la pantalla (o J)</li>
          <li><b className="text-amber-200">Pausa</b> — P o el botón de arriba</li>
        </ul>
        <p className="font-display text-[13px] text-amber-100/80 mt-3 leading-snug">
          Aplasta enemigos cayéndoles encima. Cada nivel cierra con un jefe: espera la ventana verde y golpea con el peluche.
        </p>
        <p className="font-display text-[13px] text-amber-100/80 mt-2 leading-snug">
          El último es <b className="text-[#c07040]">Bigotes el Feo</b>. Si lo derrotas, desbloqueas su piel en la categoría Feo.
        </p>
        <button onClick={onClose} className="btn-3d mt-4 w-full font-display font-bold text-[16px] text-white py-2.5 rounded-full border-b-4" style={{ background: "linear-gradient(180deg,#ff7a4a,#d9342b)", borderColor: "#7a1410" }}>
          Entendido
        </button>
      </div>
    </div>
  );
}
