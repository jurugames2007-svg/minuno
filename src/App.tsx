import { useEffect, useState } from "react";
import Menu from "./screens/Menu";
import Intro from "./screens/Intro";
import Victory from "./screens/Victory";
import Shop from "./screens/Shop";
import GameOver from "./screens/GameOver";
import Game from "./game/Game";
import House from "./screens/House";
import Campo from "./screens/Campo";
import { Flour } from "./art/Decor";
import { SKINS, type SkinId } from "./data/skins";
import type { ToolId } from "./art/Plushie";
import { CYCLE } from "./data/world";
import { checkpointsForDepth } from "./game/minigames";
import { type SpellId } from "./data/spells";
import ErrorBound from "./ui/ErrorBound";

type Screen = "intro" | "menu" | "shop" | "game" | "over" | "victory" | "house" | "campo";

interface OverStats { depth: number; score: number; bread: number; crowns: number; isNewBest: boolean; }

function hideSplash() {
  const s = document.getElementById("splash");
  if (!s) return;
  s.classList.add("hide");
  window.setTimeout(() => s.remove(), 700);
}

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }

function grantBigotes(owned: SkinId[]): SkinId[] {
  return owned.includes("bigotes") ? owned : [...owned, "bigotes"];
}

export default function App() {
  const [storyWon, setStoryWon] = useState<boolean>(() => load("maxine_story_won", false));
  const [screen, setScreen] = useState<Screen>(() => (load("maxine_intro_seen", false) ? "menu" : "intro"));
  const [skin, setSkin] = useState<SkinId>(() => load("maxine_skin", "default" as SkinId));
  const [owned, setOwned] = useState<SkinId[]>(() => {
    const o = load<SkinId[]>("maxine_owned", ["default"]);
    return load("maxine_story_won", false) ? grantBigotes(o) : o;
  });
  const [crumbs, setCrumbs] = useState<number>(() => load("maxine_crumbs", 250));
  const [best, setBest] = useState<number>(() => load("maxine_best", 0));
  const [ownedTools, setOwnedTools] = useState<ToolId[]>(() => load("maxine_tools", ["palito" as ToolId]));
  const [startTool, setStartTool] = useState<ToolId>(() => load("maxine_starttool", "palito" as ToolId));
  const [runId, setRunId] = useState(0);
  const [overStats, setOverStats] = useState<OverStats | null>(null);
  const [checkpoint, setCheckpoint] = useState<number>(() => load("maxine_checkpoint", 1));
  const [unlocked, setUnlocked] = useState<number[]>(() => load("maxine_checkpoints", [1]));
  const [justUnlockedUgly, setJustUnlockedUgly] = useState(false);
  const [spells, setSpells] = useState<SpellId[]>(() => load("maxine_spells", [] as SpellId[]));
  const [spell, setSpell] = useState<SpellId | null>(() => load("maxine_spell", null as SpellId | null));

  useEffect(() => {
    hideSplash();
    const t = setTimeout(hideSplash, 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => save("maxine_skin", skin), [skin]);
  useEffect(() => save("maxine_owned", owned), [owned]);
  useEffect(() => save("maxine_crumbs", crumbs), [crumbs]);
  useEffect(() => save("maxine_best", best), [best]);
  useEffect(() => save("maxine_tools", ownedTools), [ownedTools]);
  useEffect(() => save("maxine_starttool", startTool), [startTool]);
  useEffect(() => save("maxine_checkpoint", checkpoint), [checkpoint]);
  useEffect(() => save("maxine_checkpoints", unlocked), [unlocked]);
  useEffect(() => save("maxine_story_won", storyWon), [storyWon]);
  useEffect(() => save("maxine_spells", spells), [spells]);
  useEffect(() => save("maxine_spell", spell), [spell]);

  const unlockForDepth = (depth: number) => {
    const newUnlock = checkpointsForDepth(depth, CYCLE);
    const merged = Array.from(new Set([...unlocked, ...newUnlock])).sort((a, b) => a - b);
    if (merged.length !== unlocked.length) setUnlocked(merged);
  };

  const grantSkin = (id: SkinId) => {
    setOwned((o) => o.includes(id) ? o : [...o, id]);
    setSkin(id);
  };
  const grantTool = (id: ToolId) => {
    setOwnedTools((o) => o.includes(id) ? o : [...o, id]);
    setStartTool(id);
  };

  const buySkin = (id: SkinId, price: number) => {
    const found = SKINS.find((s) => s.id === id);
    if (!found || found.unlock === "bigotes" || found.unlock === "secret") return;
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

  const finishRun = (s: OverStats) => {
    setCrumbs((c) => c + s.crowns);
    setBest((b) => Math.max(b, s.depth));
    unlockForDepth(s.depth);
    setOverStats(s);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "radial-gradient(120% 90% at 50% 0%, #3a1c0a 0%, #1a0c04 55%, #070301 100%)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "#ff7a2a22" }} />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full blur-3xl" style={{ background: "#b06bff1a" }} />
        <Flour count={8} />
      </div>

      <div
        className="relative overflow-hidden shadow-2xl app-frame"
        style={{
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
          borderRadius: 22,
          boxShadow: "0 30px 80px rgba(0,0,0,.7), 0 0 0 2px #2a1408",
          background: "#1a0c04",
        }}
      >
        {screen === "menu" && (
          <ErrorBound>
            <Menu
              skin={skin}
              best={best}
              crumbs={crumbs}
              startTool={startTool}
              ownedTools={ownedTools}
              storyWon={storyWon}
              checkpoint={checkpoint}
              unlocked={unlocked}
              onSelectCheckpoint={setCheckpoint}
              onPlay={() => { setRunId((n) => n + 1); setScreen("game"); }}
              onShop={() => setScreen("shop")}
              onHouse={() => setScreen("house")}
              onCampo={() => setScreen("campo")}
              onStory={() => setScreen("intro")}
            />
          </ErrorBound>
        )}
        {screen === "shop" && (
          <ErrorBound>
            <Shop
              skin={skin}
              owned={owned}
              crumbs={crumbs}
              ownedTools={ownedTools}
              startTool={startTool}
              storyWon={storyWon}
              onEquip={(id) => setSkin(id)}
              onBuySkin={(id: SkinId) => { const found = SKINS.find((s) => s.id === id); buySkin(id, found ? found.price : 0); }}
              onBuyTool={buyToolMeta}
              onEquipTool={(id: ToolId) => setStartTool(id)}
              onBack={() => setScreen("menu")}
            />
          </ErrorBound>
        )}
        {screen === "house" && (
          <ErrorBound>
            <House
              skin={skin}
              crumbs={crumbs}
              onSpend={(n) => setCrumbs((c) => Math.max(0, c - n))}
              onEarn={(n) => setCrumbs((c) => c + n)}
              onBack={() => setScreen("menu")}
            />
          </ErrorBound>
        )}
        {screen === "campo" && (
          <ErrorBound>
            <Campo
              skin={skin}
              owned={owned}
              ownedTools={ownedTools}
              crumbs={crumbs}
              onFindSkin={grantSkin}
              onFindTool={grantTool}
              onEarn={(n) => setCrumbs((c) => c + n)}
              onBack={() => setScreen("menu")}
            />
          </ErrorBound>
        )}
        {screen === "intro" && (
          <ErrorBound>
            <Intro
              skin={skin}
              onStart={() => { save("maxine_intro_seen", true); setScreen("menu"); }}
            />
          </ErrorBound>
        )}
        {screen === "game" && (
          <ErrorBound>
            <Game
              key={runId}
              skin={skin}
              best={best}
              startTool={startTool}
              ownedMeta={ownedTools}
              startLevel={checkpoint}
              storyWon={storyWon}
              spells={spells}
              spell={spell}
              onCycleSpell={() => {
                if (spells.length === 0) return;
                const i = spell ? spells.indexOf(spell) : -1;
                setSpell(spells[(i + 1) % spells.length]);
              }}
              onUnlockSpell={(id) => {
                setSpells((s) => s.includes(id) ? s : [...s, id]);
                setSpell(id);
              }}
              onExit={(s) => { finishRun(s); setScreen("over"); }}
              onVictory={(s) => {
                const first = !storyWon;
                finishRun({ ...s, isNewBest: s.depth > best });
                setStoryWon(true);
                setOwned((o) => grantBigotes(o));
                setJustUnlockedUgly(first);
                if (first) setSkin("bigotes");
                setScreen("victory");
              }}
            />
          </ErrorBound>
        )}
        {screen === "victory" && overStats && (
          <ErrorBound>
            <Victory
              stats={overStats}
              unlockedUgly={justUnlockedUgly}
              onContinue={() => { setRunId((n) => n + 1); setScreen("game"); }}
              onMenu={() => setScreen("menu")}
            />
          </ErrorBound>
        )}
        {screen === "over" && overStats && (
          <ErrorBound>
            <GameOver
              stats={overStats}
              onRetry={() => { setRunId((n) => n + 1); setScreen("game"); }}
              onMenu={() => setScreen("menu")}
            />
          </ErrorBound>
        )}
      </div>
    </div>
  );
}
