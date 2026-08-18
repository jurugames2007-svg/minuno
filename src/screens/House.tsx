import { useEffect, useRef, useState } from "react";
import Maxine from "../art/Maxine";
import { Maria, Abu } from "../art/Folk";
import { Crown } from "../art/Decor";
import type { SkinId } from "../data/skins";

type FurnId = "alfombra" | "sofa" | "horno" | "planta" | "cama" | "ventana" | "mesa" | "radio" | "pecera" | "lampara" | "cuadro" | "comedero";
type PalId = "maria" | "abu";
interface Furn { id: FurnId; name: string; price: number; floor: 0 | 1 | 2; }
interface Pal { id: PalId; name: string; tag: string; price: number; blurb: string; }

const FURNS: Furn[] = [
  { id: "alfombra", name: "Alfombra", price: 40, floor: 0 },
  { id: "sofa", name: "Sofá", price: 90, floor: 0 },
  { id: "horno", name: "Horno", price: 120, floor: 0 },
  { id: "planta", name: "Helecho", price: 50, floor: 0 },
  { id: "cama", name: "Cama", price: 110, floor: 1 },
  { id: "ventana", name: "Ventana", price: 70, floor: 0 },
  { id: "mesa", name: "Mesa té", price: 80, floor: 0 },
  { id: "radio", name: "Radio", price: 95, floor: 1 },
  { id: "pecera", name: "Pecera", price: 130, floor: 1 },
  { id: "lampara", name: "Lámpara", price: 60, floor: 2 },
  { id: "cuadro", name: "Retrato", price: 75, floor: 0 },
  { id: "comedero", name: "Comedero", price: 45, floor: 0 },
];
const PALS: Pal[] = [
  { id: "maria", name: "María", tag: "Abuela humana", price: 180, blurb: "Teje en la planta baja." },
  { id: "abu", name: "Abu", tag: "Mamá de Javiera", price: 220, blurb: "Toma té en el comedor." },
];

const FLOORS = [428, 292, 156];
const LADDER_X = 28;

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

interface Props {
  skin: SkinId;
  crumbs: number;
  onSpend: (n: number) => void;
  onEarn: (n: number) => void;
  onBack: () => void;
}

export default function House({ skin, crumbs, onSpend, onEarn, onBack }: Props) {
  const [ownedF, setOwnedF] = useState<FurnId[]>(() => load("maxine_furn", ["alfombra"]));
  const [ownedP, setOwnedP] = useState<PalId[]>(() => load("maxine_pals", []));
  const [room, setRoom] = useState<number>(() => load("maxine_room", 1));
  const [tab, setTab] = useState<"casa" | "tienda" | "juego">("casa");
  const [game, setGame] = useState<"amasar" | "hueso" | "te">("amasar");
  const [knead, setKnead] = useState(0);
  const [bone, setBone] = useState(0);
  const [tea, setTea] = useState(0);
  const x = useRef(90);
  const floor = useRef(0);
  const face = useRef<1 | -1>(1);
  const dir = useRef(0);
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_furn", ownedF), [ownedF]);
  useEffect(() => save("maxine_pals", ownedP), [ownedP]);
  useEffect(() => save("maxine_room", room), [room]);

  const maxFloor = Math.min(2, room);
  const maxX = 250;

  useEffect(() => {
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      x.current += dir.current * 2.1;
      x.current = Math.max(48, Math.min(maxX, x.current));
      if (dir.current) face.current = dir.current as 1 | -1;
      setTick((n) => (n + 1) & 255);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") dir.current = -1;
      if (e.key === "ArrowRight" || e.key === "d") dir.current = 1;
      if (e.key === "ArrowUp" || e.key === "w") {
        if (x.current < 78 && floor.current < maxFloor) floor.current += 1;
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        if (x.current < 78 && floor.current > 0) floor.current -= 1;
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") dir.current = 0;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [maxFloor]);

  const buyF = (f: Furn) => {
    if (ownedF.includes(f.id) || crumbs < f.price) return;
    onSpend(f.price); setOwnedF((o) => [...o, f.id]);
  };
  const buyP = (p: Pal) => {
    if (ownedP.includes(p.id) || crumbs < p.price) return;
    onSpend(p.price); setOwnedP((o) => [...o, p.id]);
  };
  const upgrade = () => {
    if (room >= 3 || crumbs < 180) return;
    onSpend(180); setRoom((r) => r + 1);
  };
  const nearLadder = x.current < 78;

  return (
    <div className="absolute inset-0 select-none overflow-hidden" style={{ background: "#0c0818" }}>
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-3 py-2">
          <Crown size={16} /><span className="font-display font-bold text-[15px] text-amber-200">{crumbs}</span>
        </div>
      </div>
      <div className="absolute left-2 right-2 z-30 flex gap-1.5" style={{ top: 52 }}>
        {(["casa", "tienda", "juego"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="btn-3d flex-1 font-display font-bold text-[13px] py-1.5 rounded-xl border-2 border-b-4 capitalize"
            style={{ background: tab === t ? "linear-gradient(180deg,#ffb347,#d97a1a)" : "#3a2010", color: tab === t ? "#3a1808" : "#d9b070", borderColor: "#1a0c04" }}>{t}</button>
        ))}
      </div>

      {tab === "casa" && (
        <div className="absolute inset-x-2" style={{ top: 92, bottom: 78 }}>
          <div className="absolute inset-0 overflow-hidden" style={{ background: "#0a0614" }}>
            {/* roof */}
            <div className="absolute left-2 right-2" style={{ top: 8, height: 48, background: "#4a2814", clipPath: "polygon(0 100%, 50% 0, 100% 100%)", boxShadow: "0 6px 0 #2a1408" }} />
            {/* house body */}
            <div className="absolute left-3 right-3 bottom-2 border-4 border-[#3a2010]" style={{ top: 52, background: "#2a1810" }}>
              {/* attic */}
              <div className="absolute inset-x-0" style={{ top: 0, height: 136, background: "linear-gradient(180deg,#3a2418,#2a1810)" }}>
                <div className="absolute left-2 top-2 w-10 h-8 rounded-sm" style={{ background: "#6a3a1a", display: maxFloor >= 2 ? "block" : "none" }} />
                {ownedF.includes("lampara") && maxFloor >= 2 && (
                  <div className="absolute right-8 top-3 w-3 h-8" style={{ background: "#ffd27a", boxShadow: "0 0 18px #ffd27a" }} />
                )}
                {ownedF.includes("cama") && maxFloor >= 2 && (
                  <div className="absolute right-10 bottom-3 w-16 h-8 rounded-sm" style={{ background: "#7a1430", border: "2px solid #3a0808" }} />
                )}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-8 h-8 rounded-sm" style={{ background: "#8a5a2c" }} />
              </div>
              {/* mid */}
              <div className="absolute inset-x-0 border-t-4 border-[#5a3216]" style={{ top: 136, height: 136, background: "linear-gradient(180deg,#3a2a40,#241828)" }}>
                {ownedF.includes("cama") && (
                  <div className="absolute right-6 bottom-4 w-20 h-10 rounded-sm" style={{ background: "#6a4a8a", border: "2px solid #2a1830" }}>
                    <div className="absolute top-0 inset-x-2 h-2 bg-[#ff8fb6]" />
                  </div>
                )}
                {ownedF.includes("radio") && (
                  <div className="absolute left-16 bottom-5 w-8 h-6 rounded-sm" style={{ background: "#5a3a1a" }} />
                )}
                {ownedF.includes("pecera") && (
                  <div className="absolute left-28 bottom-5 w-10 h-8 rounded-sm" style={{ background: "#7fd0ff88", border: "2px solid #4a8aa8" }} />
                )}
              </div>
              {/* ground */}
              <div className="absolute inset-x-0 bottom-0 border-t-4 border-[#5a3216]" style={{ height: 148, background: "linear-gradient(180deg,#2a3040,#1a2028)" }}>
                {ownedF.includes("ventana") && (
                  <div className="absolute right-4 top-4 w-14 h-12 border-4 border-[#3a2010]" style={{ background: "linear-gradient(#3a2a10,#c9842a)" }} />
                )}
                {ownedF.includes("cuadro") && (
                  <div className="absolute left-16 top-3 w-8 h-10 border-2 border-[#8a5a2c]" style={{ background: "#fff3d6" }} />
                )}
                {ownedF.includes("alfombra") && (
                  <div className="absolute bottom-2 left-16 right-8 h-3 rounded-full" style={{ background: "#7a1430" }} />
                )}
                {ownedF.includes("sofa") && (
                  <div className="absolute left-14 bottom-5 w-16 h-10 rounded-t-lg" style={{ background: "#3a5a8a" }} />
                )}
                {ownedF.includes("horno") && (
                  <div className="absolute right-8 bottom-5 w-10 h-14 rounded-sm" style={{ background: "#3a1a08" }}>
                    <div className="absolute left-1 right-1 top-2 h-5 flicker" style={{ background: "radial-gradient(circle,#ffd27a,#ff5a2a)" }} />
                  </div>
                )}
                {ownedF.includes("mesa") && (
                  <div className="absolute left-32 bottom-5 w-14 h-7" style={{ background: "#8a5128" }} />
                )}
                {ownedF.includes("planta") && (
                  <div className="absolute left-24 bottom-5 w-6 h-8 rounded-full" style={{ background: "#3a7a1a" }} />
                )}
                {ownedF.includes("comedero") && (
                  <div className="absolute left-20 bottom-2 w-8 h-3 rounded-full" style={{ background: "#d7d2c4" }} />
                )}
                <div className="absolute left-[46%] bottom-4 w-10 h-16 rounded-t-md" style={{ background: "#8a3a18", border: "3px solid #3a2010" }} />
                {ownedP.includes("maria") && (
                  <div className="absolute bottom-3" style={{ left: 120 }}><Maria size={64} wave /></div>
                )}
                {ownedP.includes("abu") && (
                  <div className="absolute bottom-3" style={{ left: 168 }}><Abu size={64} /></div>
                )}
              </div>
              {/* beams */}
              <div className="absolute left-0 right-0 top-[136px] h-1.5 bg-[#6a3a14]" />
              <div className="absolute left-0 right-0 top-[272px] h-1.5 bg-[#6a3a14]" />
              {/* ladder */}
              <div className="absolute bottom-0" style={{ left: LADDER_X, width: 22, top: maxFloor >= 2 ? 8 : maxFloor >= 1 ? 140 : 280 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 h-0.5" style={{ top: i * 22, background: "#8a5a2c" }} />
                ))}
                <div className="absolute inset-y-0 left-0 w-1 bg-[#6a3a14]" />
                <div className="absolute inset-y-0 right-0 w-1 bg-[#6a3a14]" />
              </div>
              <div className="absolute" style={{ left: x.current, top: FLOORS[Math.min(floor.current, maxFloor)] - 70 }}>
                <Maxine skin={skin} pose="idle" facing={face.current} size={70} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 flex gap-2">
            <button className="btn-3d flex-1 font-display font-bold text-[15px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = -1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Izq</button>
            <button disabled={!nearLadder || floor.current >= maxFloor} className="btn-3d font-display font-bold text-[14px] px-3 py-2 rounded-full border-b-4 disabled:opacity-40" style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}
              onClick={() => { if (nearLadder && floor.current < maxFloor) floor.current += 1; }}>Subir</button>
            <button disabled={!nearLadder || floor.current <= 0} className="btn-3d font-display font-bold text-[14px] px-3 py-2 rounded-full border-b-4 disabled:opacity-40" style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}
              onClick={() => { if (nearLadder && floor.current > 0) floor.current -= 1; }}>Bajar</button>
            <button className="btn-3d flex-1 font-display font-bold text-[15px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = 1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Der</button>
          </div>
        </div>
      )}

      {tab === "tienda" && (
        <div className="absolute inset-x-0 overflow-y-auto scrollbar-none px-3 space-y-3" style={{ top: 96, bottom: 12 }}>
          <div className="bg-black/40 rounded-xl p-2 border border-amber-300/20">
            <div className="font-display font-bold text-amber-100 text-sm mb-1">Pisos {room}/3</div>
            <button disabled={room >= 3 || crumbs < 180} onClick={upgrade}
              className="btn-3d w-full font-display font-bold text-[14px] py-2 rounded-lg border-2 disabled:opacity-50"
              style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>
              {room >= 3 ? "Casa completa" : "Abrir piso · 180"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FURNS.map((f) => {
              const own = ownedF.includes(f.id);
              return (
                <button key={f.id} disabled={own || crumbs < f.price} onClick={() => buyF(f)}
                  className="btn-3d text-left rounded-lg border-2 p-2 disabled:opacity-60" style={{ background: "#3a2010", borderColor: own ? "#7fc24a" : "#1a0c04" }}>
                  <div className="font-display font-bold text-amber-100 text-sm">{f.name}</div>
                  <div className="font-pixel text-[8px] text-amber-200/80">{own ? "EN CASA" : `CRO ${f.price}`}</div>
                </button>
              );
            })}
          </div>
          {PALS.map((p) => {
            const own = ownedP.includes(p.id);
            return (
              <button key={p.id} disabled={own || crumbs < p.price} onClick={() => buyP(p)}
                className="btn-3d w-full text-left rounded-lg border-2 p-2 flex items-center gap-2 disabled:opacity-60" style={{ background: "#3a2010", borderColor: own ? "#7fc24a" : "#1a0c04" }}>
                <div className="w-12 h-14 shrink-0">{p.id === "maria" ? <Maria size={56} /> : <Abu size={56} />}</div>
                <div>
                  <div className="font-display font-bold text-amber-100">{p.name}</div>
                  <div className="font-pixel text-[8px] text-amber-200">{own ? "VIVE AQUÍ" : p.blurb}</div>
                  {!own && <div className="font-display font-bold text-[12px] text-amber-100">CRO {p.price}</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === "juego" && (
        <div className="absolute inset-x-3" style={{ top: 100 }}>
          <div className="flex gap-1.5 mb-3">
            {(["amasar", "hueso", "te"] as const).map((g) => (
              <button key={g} onClick={() => setGame(g)} className="btn-3d flex-1 font-display font-bold text-[12px] py-1.5 rounded-lg border-2"
                style={{ background: game === g ? "#ffd27a" : "#3a2010", color: game === g ? "#3a1808" : "#d9b070", borderColor: "#1a0c04" }}>
                {g === "amasar" ? "Amasar" : g === "hueso" ? "Hueso" : "Té"}
              </button>
            ))}
          </div>
          {game === "amasar" && (
            <div className="flex flex-col items-center">
              <p className="font-display text-[13px] text-amber-100/80 text-center">Tocá la masa. Cada 8, 3 migas.</p>
              <button onClick={() => { const n = knead + 1; setKnead(n); if (n % 8 === 0) onEarn(3); }} className="mt-4" style={{ width: 160, height: 120 }}>
                <div className="w-full h-full rounded-[40%] border-4 border-[#7a4410]" style={{ background: "radial-gradient(circle at 40% 35%, #ffe4b0, #d99243)" }} />
              </button>
              <div className="mt-2 font-display font-bold text-amber-200">Toques {knead}</div>
            </div>
          )}
          {game === "hueso" && (
            <div className="flex flex-col items-center">
              <button onClick={() => { const n = bone + 1; setBone(n); if (n % 6 === 0) onEarn(2); }} className="mt-4 w-36 h-24 rounded-xl" style={{ background: "#6a3a14" }} />
              <div className="mt-2 font-display font-bold text-amber-200">Escondidas {bone}</div>
            </div>
          )}
          {game === "te" && (
            <div className="flex flex-col items-center">
              <button onClick={() => { const n = tea + 1; setTea(n); if (n % 5 === 0) onEarn(4); }} className="mt-4 w-28 h-24 rounded-b-[40%] border-4 border-[#5a3216]" style={{ background: "linear-gradient(#fff3d6,#c9842a)" }} />
              <div className="mt-2 font-display font-bold text-amber-200">Tazas {tea}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
