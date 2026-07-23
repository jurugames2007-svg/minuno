import { useEffect, useState } from "react";
import Menu from "./screens/Menu";
import Intro from "./screens/Intro";
import Victory from "./screens/Victory";

function hideSplash() {
  const s = document.getElementById("splash");
  if (!s) return;
  s.classList.add("hide");
  setTimeout(() => s.remove(), 700);
}
import Shop from "./screens/Shop";
import GameOver from "./screens/GameOver";
import Game from "./game/Game";
import { Flour } from "./art/Decor";
import type { SkinId } from "./data/skins";
import type { ToolId } from "./art/Plushie";

type Screen = "intro" | "menu" | "shop" | "game" | "over" | "victory";

interface OverStats { depth: number; score: number; bread: number; crowns: number; isNewBest: boolean; }

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }

export default function App() {
  const [storyWon, setStoryWon] = useState<boolean>(() => load("maxine_story_won", false));
  const [screen, setScreen] = useState<Screen>(() => (load("maxine_intro_seen", false) ? "menu" : "intro"));
  const [skin, setSkin] = useState<SkinId>(() => load("maxine_skin", "default" as SkinId));
  const [owned, setOwned] = useState<SkinId[]>(() => load("maxine_owned", ["default" as SkinId]));
  const [crumbs, setCrumbs] = useState<number>(() => load("maxine_crumbs", 250));
  const [best, setBest] = useState<number>(() => load("maxine_best", 0));
  const [ownedTools, setOwnedTools] = useState<ToolId[]>(() => load("maxine_tools", ["palito" as ToolId]));
  const [startTool, setStartTool] = useState<ToolId>(() => load("maxine_starttool", "palito" as ToolId));
  const [runId, setRunId] = useState(0);
  const [overStats, setOverStats] = useState<OverStats | null>(null);

  useEffect(() => { const t = setTimeout(hideSplash, 900); return () => clearTimeout(t); }, []);

  useEffect(() => save("maxine_skin", skin), [skin]);
  useEffect(() => save("maxine_owned", owned), [owned]);
  useEffect(() => save("maxine_crumbs", crumbs), [crumbs]);
  useEffect(() => save("maxine_best", best), [best]);
  useEffect(() => save("maxine_tools", ownedTools), [ownedTools]);
  useEffect(() => save("maxine_starttool", startTool), [startTool]);

  const buySkin = (id: SkinId, price: number) => {
    if (owned.includes(id) || crumbs < price) return;
    setCrumbs((c) => c - price);
    setOwned((o) => [...o, id]);
    setSkin(id);
  };
  const buyToolMeta = (id: ToolId, price: number) => {
    if (ownedTools.includes(id) || crumbs < price) return;
    setCrumbs((c) => c - price);
    setOwnedTools((o) => [...o, id]);
    setStartTool(id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "radial-gradient(120% 90% at 50% 0%, #3a1c0a 0%, #1a0c04 55%, #070301 100%)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "#ff7a2a22" }} />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full blur-3xl" style={{ background: "#b06bff1a" }} />
        <Flour count={18} />
      </div>

      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
          borderRadius: 22,
          boxShadow: "0 30px 80px rgba(0,0,0,.7), 0 0 0 2px #2a1408",
          background: "#1a0c04",
        }}
      >
        {screen === "menu" && (
          <Menu
            skin={skin}
            best={best}
            crumbs={crumbs}
            startTool={startTool}
            ownedTools={ownedTools}
            storyWon={storyWon}
            onPlay={() => { setRunId((n) => n + 1); setScreen("game"); }}
            onShop={() => setScreen("shop")}
            onStory={() => setScreen("intro")}
          />
        )}
        {screen === "shop" && (
          <Shop
            skin={skin}
            owned={owned}
            crumbs={crumbs}
            ownedTools={ownedTools}
            startTool={startTool}
            onEquip={(id) => setSkin(id)}
            onBuySkin={(id: SkinId) => { const price: Record<SkinId, number> = { default: 0, bow: 120, lime: 180, harness: 220, santa: 350, vampire: 420, princess: 500, yuta: 700, kissy: 850, yarnaby: 1200, pochacco: 550, mahoraga: 900, jockey: 480, catto: 360 }; buySkin(id, price[id]); }}
            onBuyTool={buyToolMeta}
            onEquipTool={(id: ToolId) => setStartTool(id)}
            onBack={() => setScreen("menu")}
          />
        )}
        {screen === "intro" && (
          <Intro
            skin={skin}
            onStart={() => { save("maxine_intro_seen", true); setScreen("menu"); }}
          />
        )}
        {screen === "game" && (
          <Game
            key={runId}
            skin={skin}
            best={best}
            startTool={startTool}
            ownedMeta={ownedTools}
            onExit={(s) => {
              setCrumbs((c) => c + s.crowns);
              setBest((b) => Math.max(b, s.depth));
              setOverStats(s);
              setScreen("over");
            }}
            onVictory={(s) => {
              setCrumbs((c) => c + s.crowns);
              setBest((b) => Math.max(b, s.depth));
              setOverStats({ ...s, isNewBest: s.depth > best });
              setStoryWon(true); save("maxine_story_won", true);
              setScreen("victory");
            }}
          />
        )}
        {screen === "victory" && overStats && (
          <Victory
            stats={overStats}
            onContinue={() => { setRunId((n) => n + 1); setScreen("game"); }}
            onMenu={() => setScreen("menu")}
          />
        )}
        {screen === "over" && overStats && (
          <GameOver
            stats={overStats}
            onRetry={() => { setRunId((n) => n + 1); setScreen("game"); }}
            onMenu={() => setScreen("menu")}
          />
        )}
      </div>

      <div className="hidden lg:flex absolute left-6 bottom-6 flex-col gap-1 text-amber-200/40 font-pixel text-[9px] leading-relaxed pointer-events-none">
        <div>MAXINE · PANADERÍA ENCANTADA</div>
        <div>prototipo web · inspirado en Once Upon a Tower</div>
      </div>
    </div>
  );
}
