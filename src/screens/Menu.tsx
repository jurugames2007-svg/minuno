import Maxine from "../art/Maxine";
import { Bread, Flour, KitchenBackdrop, Crown } from "../art/Decor";
import { Plushie } from "../art/Plushie";
import type { SkinId } from "../data/skins";

const HELP = [
  "COMO SE JUEGA",
  "",
  "MOVE  :  flechas / A D",
  "SALTO :  espacio / W / flecha arriba",
  "CAVAR :  flecha abajo / S",
  "PEGAR :  J / X / Shift",
  "PAUSA :  P",
  "",
  "Mantene una direccion y CAVAR",
  "para picar hacia ese lado.",
  "Saltá encima de enemigos para aplastarlos",
  "o pegales con el peluche en la mano.",
  "",
  "MISION: rescatar a JAVIERA,",
  "secuestrada por BIGOTES EL FEO,",
  "un Jack Russell con parche y pinchos.",
  "",
  "Cada nivel termina en un JEFE con su truco:",
  "Aspiradora, Chef Fantasma, Nevera,",
  "Horno Colosal, Pan Monstruo y Bigotes.",
  "Lee la pista bajo su barra de vida.",
  "No los spamees: espera la ventana",
  "y usa el peluche correcto.",
  "",
  "En el descanso compras power-ups",
  "y peluches-herramienta con lo juntado.",
  "Empezas con un palito; desbloquea",
  "a Javiera la matrona en la Panaderia.",
  "",
  "3 corazones - cavar es gratis.",
].join("\n");

import type { ToolId } from "../art/Plushie";
import { TOOL_MAP } from "../art/Plushie";

interface Props {
  skin: SkinId;
  best: number;
  crumbs: number;
  startTool: ToolId;
  ownedTools: ToolId[];
  storyWon: boolean;
  onPlay: () => void;
  onShop: () => void;
  onStory: () => void;
}

export default function Menu({ skin, best, crumbs, startTool, ownedTools, storyWon, onPlay, onShop, onStory }: Props) {
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
        <g transform="translate(312 54)">
          <rect x="6" y="0" width="4" height="14" rx="2" fill="#d7d2c4" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M8 14 Q${2 + i * 4} 24 8 32 Q${14 - i * 4} 24 8 14`} fill="none" stroke="#d7d2c4" strokeWidth="1.2" />
          ))}
        </g>
        <circle cx="180" cy="36" r="8" fill="#c9842a" stroke="#5a3a10" strokeWidth="1.2" />
      </svg>

      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
        <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-300/30">
          <Crown size={16} />
          <span className="font-pixel text-[10px] text-amber-200">{crumbs}</span>
        </div>
        <button onClick={onStory} title="Ver la historia" className="btn-3d bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1.5 border border-amber-300/30 font-pixel text-[10px] text-amber-100 flex items-center gap-1">
          <span className="text-[12px]">📖</span> HISTORIA
        </button>
        <div className="bg-black/35 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-300/30 font-pixel text-[9px] text-amber-100 leading-tight text-right">
          RÉCORD<br /><span className="text-amber-300 text-[11px]">{best} m</span>
        </div>
      </div>
      {storyWon && (
        <div className="absolute top-[52px] left-1/2 -translate-x-1/2 z-20 bg-[#7fc24a] text-[#1a3a08] font-pixel text-[8px] px-2 py-1 rounded-full border-2 border-[#1a3a08] shadow pop flex items-center gap-1">
          ♥ JAVIERA RESCATADA
        </div>
      )}

      <div className="absolute top-[14%] inset-x-0 text-center z-10 px-6 slide-up">
        <div className="inline-block relative">
          <h1
            className="font-display font-bold leading-none text-[64px]"
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
        <p className="font-display text-amber-200/90 tracking-[0.3em] text-xs mt-1 uppercase">Panadería Encantada</p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[34%] z-10">
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
            <Maxine skin={skin} pose="idle" size={180} />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 bg-[#fff3d6] border-2 border-[#7a3410] rounded-full px-3 py-0.5 font-pixel text-[8px] text-[#7a3410] shadow pop flex items-center gap-1">
            <Plushie id={startTool} size={12} />
            <span>ARRANQUE: {TOOL_MAP[startTool].name.toUpperCase()}</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 font-pixel text-[7px] text-amber-200/70">
            {ownedTools.length}/7 peluches en tu mochila
          </div>
          <div className="absolute -right-2 bottom-2">
            <svg width="34" height="40" viewBox="0 0 34 40">
              <path d="M6 18 h18 v10 a8 8 0 0 1 -16 0 Z" fill="#fff3d6" stroke="#7a4410" strokeWidth="1.6" />
              <path d="M24 20 q6 0 6 5 q0 4 -6 4" fill="none" stroke="#7a4410" strokeWidth="1.6" />
              <g className="flicker" style={{ transformOrigin: "15px 14px" }}>
                <path d="M12 14 q-2 -6 2 -10 q2 4 0 6 q4 -2 2 4 Z" fill="#fff" opacity="0.6" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute left-6 top-[58%] hop" style={{ animationDelay: "0.2s" }}><Bread type="baguette" size={30} /></div>
      <div className="absolute right-8 top-[62%] hop" style={{ animationDelay: "0.9s" }}><Bread type="miche" size={30} /></div>
      <div className="absolute right-14 top-[50%] hop" style={{ animationDelay: "0.5s" }}><Bread type="divine" size={26} /></div>

      <div className="absolute bottom-[6%] inset-x-0 px-8 flex flex-col gap-3 z-20 slide-up" style={{ animationDelay: "0.15s" }}>
        <button
          onClick={onPlay}
          className="btn-3d font-display font-bold text-2xl text-white py-3 rounded-full border-b-4 active:border-b-0"
          style={{ background: "linear-gradient(180deg,#ff7a4a,#d9342b)", borderColor: "#7a1410", boxShadow: "0 8px 20px rgba(217,52,43,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}
        >
          ¡A CAVAR!
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onShop}
            className="btn-3d font-display font-semibold text-lg text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
            style={{ background: "linear-gradient(180deg,#e3a35a,#a8642a)", borderColor: "#5a2810", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.3)" }}
          >
            🥐 Panadería
          </button>
          <button
            className="btn-3d font-display font-semibold text-lg text-amber-50 py-2.5 rounded-full border-b-4 active:border-b-0"
            style={{ background: "linear-gradient(180deg,#7a5a3a,#3a2410)", borderColor: "#1a0c04", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.15)" }}
            onClick={() => alert(HELP)}
          >
            ❔ Cómo jugar
          </button>
        </div>
      </div>

      <div className="absolute bottom-1 inset-x-0 text-center font-pixel text-[8px] text-amber-200/40 z-10">v1.1 · prototipo web jugable</div>
    </div>
  );
}
