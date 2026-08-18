import { useEffect, useRef, useState } from "react";
import Maxine from "../art/Maxine";
import { Maria, Abu } from "../art/Folk";
import { Crown, Flour } from "../art/Decor";
import type { SkinId } from "../data/skins";

type FurnId = "alfombra" | "sofa" | "horno" | "planta" | "cama" | "ventana" | "mesa" | "radio" | "pecera" | "lampara" | "cuadro" | "comedero";
type PalId = "maria" | "abu";

interface Furn { id: FurnId; name: string; price: number; }
interface Pal { id: PalId; name: string; tag: string; price: number; blurb: string; }

const FURNS: Furn[] = [
  { id: "alfombra", name: "Alfombra", price: 40 },
  { id: "sofa", name: "Sofá", price: 90 },
  { id: "horno", name: "Horno", price: 120 },
  { id: "planta", name: "Helecho", price: 50 },
  { id: "cama", name: "Cama", price: 110 },
  { id: "ventana", name: "Ventana", price: 70 },
  { id: "mesa", name: "Mesa té", price: 80 },
  { id: "radio", name: "Radio", price: 95 },
  { id: "pecera", name: "Pecera", price: 130 },
  { id: "lampara", name: "Lámpara", price: 60 },
  { id: "cuadro", name: "Retrato", price: 75 },
  { id: "comedero", name: "Comedero", price: 45 },
];
const PALS: Pal[] = [
  { id: "maria", name: "María", tag: "Abuela humana", price: 180, blurb: "Teje, hornea y regaña con cariño." },
  { id: "abu", name: "Abu", tag: "Mamá de Javiera", price: 220, blurb: "Matrona jubilada. Trae té y recetas." },
];

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
  const [bubble, setBubble] = useState<string | null>(null);
  const x = useRef(140);
  const y = useRef(0);
  const vy = useRef(0);
  const face = useRef<1 | -1>(1);
  const dir = useRef(0);
  const onFloor = useRef(true);
  const mx = useRef(30);
  const ax = useRef(240);
  const md = useRef(1);
  const ad = useRef(-1);
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_furn", ownedF), [ownedF]);
  useEffect(() => save("maxine_pals", ownedP), [ownedP]);
  useEffect(() => save("maxine_room", room), [room]);

  const maxX = 80 + room * 80;

  useEffect(() => {
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      x.current += dir.current * 2.4;
      x.current = Math.max(16, Math.min(maxX, x.current));
      if (dir.current) face.current = dir.current as 1 | -1;
      if (!onFloor.current) {
        vy.current += 0.55;
        y.current += vy.current;
        if (y.current >= 0) { y.current = 0; vy.current = 0; onFloor.current = true; }
      }
      if (ownedP.includes("maria")) {
        mx.current += md.current * 0.6;
        if (mx.current < 18) md.current = 1;
        if (mx.current > maxX - 40) md.current = -1;
      }
      if (ownedP.includes("abu")) {
        ax.current += ad.current * 0.45;
        if (ax.current < 40) ad.current = 1;
        if (ax.current > maxX - 10) ad.current = -1;
      }
      setTick((n) => (n + 1) & 255);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") dir.current = -1;
      if (e.key === "ArrowRight" || e.key === "d") dir.current = 1;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        if (onFloor.current) { onFloor.current = false; vy.current = -8; }
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") dir.current = 0;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [maxX, ownedP]);

  const say = (t: string) => { setBubble(t); window.setTimeout(() => setBubble(null), 1800); };

  const buyF = (f: Furn) => {
    if (ownedF.includes(f.id) || crumbs < f.price) return;
    onSpend(f.price); setOwnedF((o) => [...o, f.id]);
  };
  const buyP = (p: Pal) => {
    if (ownedP.includes(p.id) || crumbs < p.price) return;
    onSpend(p.price); setOwnedP((o) => [...o, p.id]);
  };
  const upgrade = () => {
    if (room >= 4 || crumbs < 180) return;
    onSpend(180); setRoom((r) => r + 1);
  };
  const tapDough = () => {
    const n = knead + 1;
    setKnead(n);
    if (n > 0 && n % 8 === 0) onEarn(3);
  };
  const tapBone = () => {
    const n = bone + 1;
    setBone(n);
    if (n % 6 === 0) onEarn(2);
  };
  const tapTea = () => {
    const n = tea + 1;
    setTea(n);
    if (n % 5 === 0) onEarn(4);
  };

  const walls = ["#6a3a22", "#3a4a6a", "#4a2a50", "#2a4a3a"][room - 1] ?? "#6a3a22";
  const floor = ["#c9842a", "#d8c4a0", "#e8d0e8", "#c8e0b0"][room - 1] ?? "#c9842a";
  const roomName = ["Cabaña", "Salón", "Suite", "Patio interior"][room - 1] ?? "Cabaña";

  return (
    <div className="absolute inset-0 select-none overflow-hidden" style={{ background: "#1a0c04" }}>
      <Flour count={10} />
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
        <div className="absolute inset-x-0" style={{ top: 96, bottom: 88 }}>
          <div className="absolute inset-x-3 top-0 bottom-10 rounded-2xl overflow-hidden border-4 border-[#3a2010]" style={{ background: walls, boxShadow: "inset 0 0 40px #0006" }}>
            {ownedF.includes("lampara") && (
              <div className="absolute top-2 right-6 w-10">
                <div className="h-3 w-8 mx-auto rounded-t-full" style={{ background: "#ffd27a", boxShadow: "0 8px 20px #ffd27a88" }} />
                <div className="h-8 w-1 mx-auto" style={{ background: "#5a3216" }} />
              </div>
            )}
            {ownedF.includes("ventana") && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-20 rounded-md border-4 border-[#5a3216]" style={{ background: "linear-gradient(180deg,#7fd0ff,#ffe0b0)" }}>
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#5a3216]" />
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#5a3216]" />
              </div>
            )}
            {ownedF.includes("cuadro") && (
              <div className="absolute top-8 left-4 w-12 h-14 rounded-sm border-4 border-[#8a5a2c]" style={{ background: "#fff3d6" }}>
                <div className="absolute left-1 right-1 top-2 h-6 rounded-full" style={{ background: "#e3c79a" }} />
                <div className="text-[7px] text-center mt-8 font-display text-[#7a3410]">Javi</div>
              </div>
            )}
            {ownedF.includes("alfombra") && (
              <div className="absolute bottom-8 left-10 right-10 h-8 rounded-full" style={{ background: "#7a1430", boxShadow: "inset 0 2px 0 #c44" }} />
            )}
            {ownedF.includes("sofa") && (
              <button className="absolute bottom-14 left-6 w-24 h-14 rounded-t-xl" style={{ background: "#3a5a8a", border: "3px solid #1a2a40" }}
                onClick={() => say("Sofá. Siesta de 3 minutos.")} />
            )}
            {ownedF.includes("cama") && (
              <button className="absolute bottom-14 left-[38%] w-28 h-12 rounded-md" style={{ background: "#fff3d6", border: "3px solid #8a5a2c" }}
                onClick={() => say("Zzz… sueña con baguettes.")}>
                <div className="absolute top-0 inset-x-2 h-3 rounded-b bg-[#ff8fb6]" />
              </button>
            )}
            {ownedF.includes("horno") && (
              <button className="absolute bottom-14 right-8 w-16 h-20 rounded-md" style={{ background: "#3a1a08", border: "3px solid #1a0804" }}
                onClick={() => { say("Huele a pan. +1 miga."); onEarn(1); }}>
                <div className="absolute left-2 right-2 top-3 h-8 rounded-sm flicker" style={{ background: "radial-gradient(circle,#ffd27a,#ff5a2a)" }} />
              </button>
            )}
            {ownedF.includes("planta") && (
              <div className="absolute bottom-14 right-2 w-8">
                <div className="h-8 rounded-full mx-auto w-8" style={{ background: "#3a7a1a" }} />
                <div className="h-6 w-6 mx-auto rounded-sm" style={{ background: "#8a5128" }} />
              </div>
            )}
            {ownedF.includes("mesa") && (
              <div className="absolute bottom-16 left-[22%] w-16 h-8 rounded-sm" style={{ background: "#8a5128", border: "2px solid #3a2010" }}>
                <div className="absolute -top-2 left-2 w-4 h-3 rounded-full" style={{ background: "#7fc24a" }} />
                <div className="absolute -top-1 right-2 w-3 h-3 rounded-full" style={{ background: "#fff3d6" }} />
              </div>
            )}
            {ownedF.includes("radio") && (
              <button className="absolute bottom-20 left-[8%] w-10 h-8 rounded-sm" style={{ background: "#5a3a1a", border: "2px solid #2a1408" }}
                onClick={() => say("♪ Radio cocina… ffff…")}>
                <div className="absolute -top-2 left-1 w-1 h-3 bg-[#d7d2c4]" />
                <div className="absolute inset-x-1 top-1 h-2 rounded-sm" style={{ background: "#1a0c04" }} />
              </button>
            )}
            {ownedF.includes("pecera") && (
              <div className="absolute bottom-20 right-[28%] w-12 h-10 rounded-sm" style={{ background: "#7fd0ff88", border: "2px solid #4a8aa8" }}>
                <div className="absolute left-2 top-3 w-3 h-2 rounded-full hop" style={{ background: "#ff7a4a" }} />
              </div>
            )}
            {ownedF.includes("comedero") && (
              <button className="absolute bottom-10 left-[48%] w-10 h-4 rounded-full" style={{ background: "#d7d2c4", border: "2px solid #5a4a30" }}
                onClick={() => { say("¡Ñam! Croquetas."); onEarn(1); }} />
            )}
            {ownedP.includes("maria") && (
              <div className="absolute bottom-10" style={{ left: mx.current }}><Maria size={86} wave={md.current > 0} /></div>
            )}
            {ownedP.includes("abu") && (
              <div className="absolute bottom-10" style={{ left: ax.current }}><Abu size={86} /></div>
            )}
            <div className="absolute" style={{ left: x.current, bottom: 8 - y.current }}>
              <Maxine skin={skin} pose={onFloor.current ? "idle" : "fall"} facing={face.current} size={78} />
              {bubble && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#fff3d6] text-[#3a1808] font-display font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#7a4410]">
                  {bubble}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: floor, boxShadow: "inset 0 4px 0 #0003" }} />
            <div className="absolute top-2 left-2 font-display text-[11px] text-amber-100/80 bg-black/25 px-2 py-0.5 rounded-full">{roomName}</div>
          </div>
          <div className="absolute bottom-0 inset-x-0 flex gap-2 px-4">
            <button className="btn-3d flex-1 font-display font-bold text-[16px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = -1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Izq</button>
            <button className="btn-3d font-display font-bold text-[16px] px-4 py-2 rounded-full border-b-4 text-[#3a1808]" style={{ background: "linear-gradient(180deg,#ffd27a,#d99243)", borderColor: "#7a4410" }}
              onPointerDown={() => { if (onFloor.current) { onFloor.current = false; vy.current = -8; } }}>Salto</button>
            <button className="btn-3d flex-1 font-display font-bold text-[16px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = 1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Der</button>
          </div>
        </div>
      )}

      {tab === "tienda" && (
        <div className="absolute inset-x-0 overflow-y-auto scrollbar-none px-3 space-y-3" style={{ top: 96, bottom: 12 }}>
          <div className="bg-black/40 rounded-xl p-2 border border-amber-300/20">
            <div className="font-display font-bold text-amber-100 text-sm mb-1">Mejorar casa · {roomName} {room}/4</div>
            <button disabled={room >= 4 || crumbs < 180} onClick={upgrade}
              className="btn-3d w-full font-display font-bold text-[14px] py-2 rounded-lg border-2 disabled:opacity-50"
              style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>
              {room >= 4 ? "Casa máxima" : "Ampliar · 180"}
            </button>
          </div>
          <div className="font-display font-bold text-amber-100 text-sm px-1">Muebles</div>
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
          <div className="font-display font-bold text-amber-100 text-sm px-1">Acompañantes</div>
          {PALS.map((p) => {
            const own = ownedP.includes(p.id);
            return (
              <button key={p.id} disabled={own || crumbs < p.price} onClick={() => buyP(p)}
                className="btn-3d w-full text-left rounded-lg border-2 p-2 flex items-center gap-2 disabled:opacity-60" style={{ background: "#3a2010", borderColor: own ? "#7fc24a" : "#1a0c04" }}>
                <div className="w-12 h-14 shrink-0">{p.id === "maria" ? <Maria size={56} /> : <Abu size={56} />}</div>
                <div>
                  <div className="font-display font-bold text-amber-100">{p.name}</div>
                  <div className="font-display text-[11px] text-amber-200/80">{p.tag}</div>
                  <div className="font-pixel text-[8px] text-amber-200">{own ? "VIVE AQUÍ · pasea sola" : p.blurb}</div>
                  {!own && <div className="font-display font-bold text-[12px] text-amber-100 mt-0.5">CRO {p.price}</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === "juego" && (
        <div className="absolute inset-x-3 overflow-y-auto scrollbar-none" style={{ top: 100, bottom: 12 }}>
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
              <div className="font-display font-bold text-amber-100 text-xl">Amasar</div>
              <p className="font-display text-[13px] text-amber-100/80 text-center mt-1">Tocá la masa. Cada 8 toques, 3 migas.</p>
              <button onClick={tapDough} className="mt-6 pop" style={{ width: 180, height: 140 }}>
                <div className="w-full h-full rounded-[40%] border-4 border-[#7a4410]" style={{ background: "radial-gradient(circle at 40% 35%, #ffe4b0, #d99243)", boxShadow: "0 10px 0 #5a2810" }} />
              </button>
              <div className="mt-3 font-display font-bold text-amber-200">Toques {knead}</div>
            </div>
          )}
          {game === "hueso" && (
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-amber-100 text-xl">Esconder el hueso</div>
              <p className="font-display text-[13px] text-amber-100/80 text-center mt-1">Maxine lo esconde. Cada 6 toques, 2 migas.</p>
              <button onClick={tapBone} className="mt-6 pop relative" style={{ width: 160, height: 120 }}>
                <div className="absolute inset-0 rounded-xl" style={{ background: "#6a3a14" }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 rounded-full" style={{ background: "#f4efe0", transform: `rotate(${bone * 18}deg)` }} />
              </button>
              <div className="mt-3 font-display font-bold text-amber-200">Escondidas {bone}</div>
            </div>
          )}
          {game === "te" && (
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-amber-100 text-xl">Té con Abu</div>
              <p className="font-display text-[13px] text-amber-100/80 text-center mt-1">Serví tazas. Cada 5, 4 migas y un chisme.</p>
              <button onClick={tapTea} className="mt-6 pop" style={{ width: 140, height: 120 }}>
                <div className="w-full h-full rounded-b-[40%] border-4 border-[#5a3216]" style={{ background: "linear-gradient(180deg,#fff3d6,#c9842a)" }} />
              </button>
              <div className="mt-3 font-display font-bold text-amber-200">Tazas {tea}</div>
              {tea > 0 && tea % 5 === 0 && <p className="font-display text-[12px] text-amber-100/80 mt-1">«Javiera de chica escondía galletas.»</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
