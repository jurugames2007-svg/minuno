import { JavieraHuman } from "./Intro";
import { Flour } from "../art/Decor";
import Maxine from "../art/Maxine";

interface Stats { depth: number; score: number; bread: number; crowns: number; }
interface Props { stats: Stats; onContinue: () => void; onMenu: () => void; unlockedUgly?: boolean; }

export default function Victory({ stats, onContinue, onMenu, unlockedUgly }: Props) {
  return (
    <div className="absolute inset-0 select-none overflow-hidden flex flex-col" style={{ background: "radial-gradient(100% 70% at 50% 18%, #ffd27a44 0%, #7a3410 40%, #2a1408 80%, #0a0402 100%)" }}>
      <Flour count={22} />
      {/* floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="absolute text-rose-300" style={{ left: `${(i * 6.3) % 100}%`, bottom: -20, fontSize: 12 + (i % 3) * 6, animation: `float-up ${5 + (i % 4)}s linear ${i * 0.4}s infinite`, ["--drift" as string]: `${((i % 5) - 2) * 20}px` }}>♥</div>
        ))}
      </div>
      {/* cinematic bars + breathing vignette */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-black/70 z-30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-black/70 z-30" />
      <div className="pointer-events-none absolute inset-0 z-20" style={{ boxShadow: "inset 0 0 120px 20px rgba(0,0,0,.6)", animation: "intro-vig 5s ease-in-out infinite" }} />

      {/* HEADER */}
      <header className="shrink-0 pt-5 pb-1 text-center z-10 slide-up">
        <div className="font-pixel text-[9px] text-amber-200/80 tracking-[0.3em]">VICTORIA</div>
        <h2 className="font-display font-bold text-[32px] leading-none text-amber-50 mt-1" style={{ textShadow: "0 4px 0 #7a3410, 0 6px 14px rgba(0,0,0,.6)" }}>¡JAVIERA RESCATADA!</h2>
        <p className="font-display text-amber-200/80 text-xs mt-1">Bigotes el Feo huyó con el rabo entre las patas.</p>
      </header>

      {/* SCENE — gentle camera pan */}
      <div className="shrink-0 relative overflow-hidden" style={{ height: "38%" }}>
        <div className="absolute inset-0" style={{ animation: "vic-pan 9s ease-in-out infinite alternate" }}>
          {/* broken cage */}
          <svg className="absolute left-1/2 -translate-x-1/2 top-0" width="240" height="180" viewBox="0 0 240 180">
            <g stroke="#8a8a8a" strokeWidth="2" fill="none" opacity="0.7">
              <path d="M40 20 L30 160 M60 18 L56 160 M80 16 L82 160" />
              <path d="M160 16 L158 160 M180 18 L184 160 M200 20 L210 160" />
              <path d="M30 30 L90 28 M150 28 L210 30" />
            </g>
            <g transform="rotate(-30 120 20)" stroke="#a8a8a8" strokeWidth="2" fill="none" opacity="0.8">
              <path d="M100 20 L100 150 M120 18 L120 150 M140 20 L140 150 M96 30 L144 30 M96 80 L144 80 M96 130 L144 130" />
            </g>
          </svg>
          <div className="absolute left-1/2 -translate-x-1/2 top-[6%] pop" style={{ marginLeft: 6 }}><JavieraHuman size={136} waving /></div>
          <div className="absolute left-[24%] top-[42%] hop"><Maxine skin={unlockedUgly ? "bigotes" : "default"} pose="win" size={92} /></div>
          <div className="absolute right-[4%] bottom-[8%]" style={{ animation: "vic-flee 4.5s cubic-bezier(.5,0,.8,.4) infinite" }}>
            <svg width="46" height="46" viewBox="0 0 100 100" style={{ transform: "scaleX(-1)" }}>
              <ellipse cx="50" cy="68" rx="20" ry="12" fill="#fff" stroke="#3a2010" strokeWidth="1.2" />
              <ellipse cx="40" cy="44" rx="14" ry="12" fill="#fff" stroke="#3a2010" strokeWidth="1.2" />
              <circle cx="34" cy="42" r="3.6" fill="#1a1a1a" /><circle cx="48" cy="42" r="2" fill="#ff3030" />
              <path d="M34 50 q6 4 12 0" stroke="#3a1a08" strokeWidth="1" fill="none" />
              <path d="M62 62 Q50 56 52 44" stroke="#7a4410" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* STATS — scroll-safe */}
      <div className="flex-1 min-h-0 px-5 pt-1 pb-1 z-10 flex flex-col justify-center slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-2xl border-2 border-amber-300/30 bg-black/45 backdrop-blur-sm p-3 overflow-hidden">
          <div className="grid grid-cols-4 gap-2 text-center">
            <Stat label="PROFUNDIDAD" value={`${stats.depth}m`} color="#7fd0ff" />
            <Stat label="PANCITOS" value={`${stats.bread}`} color="#ffd27a" />
            <Stat label="PUNTOS" value={`${stats.score}`} color="#ff8fa0" />
            <Stat label="CORONAS" value={`+${stats.crowns}`} color="#d9a6ff" />
          </div>
          <p className="font-display text-amber-100/85 text-[11px] text-center mt-2 italic leading-snug">“Gracias, Maxine. Ahora a hornear juntos otra vez.” — Javiera</p>
        </div>
      </div>

      {/* ACTIONS — reserved, safe-area */}
      <div className="shrink-0 px-7 pt-2 z-20 flex flex-col gap-2 slide-up" style={{ animationDelay: "0.35s", paddingBottom: "max(14px, env(safe-area-inset-bottom))", background: "linear-gradient(180deg,transparent 0%,#0a0402cc 40%,#0a0402 100%)" }}>
        <button onClick={onContinue} className="btn-3d w-full font-display font-bold text-base text-white py-2.5 rounded-full border-b-4 active:border-b-0" style={{ background: "linear-gradient(180deg,#7fc24a,#3a7a1a)", borderColor: "#1a3a08", boxShadow: "0 6px 14px rgba(58,122,26,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}>SEGUIR CAVANDO · MODO INFINITO</button>
        <button onClick={onMenu} className="btn-3d w-full font-display font-semibold text-sm text-amber-50 py-2 rounded-full border-b-4 active:border-b-0" style={{ background: "linear-gradient(180deg,#7a5a3a,#3a2410)", borderColor: "#1a0c04" }}>Volver al menú</button>
      </div>

      <style>{`
        @keyframes vic-flee { 0% { transform: translateX(0) scaleX(-1); opacity:1; } 80% { opacity:1; } 100% { transform: translateX(140px) scaleX(-1); opacity:0; } }
        @keyframes vic-pan { from { transform: translateX(-6px) scale(1.02);} to { transform: translateX(6px) scale(1.04);} }
        @keyframes intro-vig { 0%,100% { box-shadow: inset 0 0 120px 20px rgba(0,0,0,.6);} 50% { box-shadow: inset 0 0 90px 10px rgba(0,0,0,.45);} }
      `}</style>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return <div><div className="font-pixel text-[7px] text-amber-200/60">{label}</div><div className="font-display font-bold text-xl mt-0.5" style={{ color }}>{value}</div></div>;
}
