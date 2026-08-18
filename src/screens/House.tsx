import { useEffect, useRef, useState } from "react";
import Maxine from "../art/Maxine";
import { Maria, Abu } from "../art/Folk";
import { Crown, Flour } from "../art/Decor";
import type { SkinId } from "../data/skins";

type FurnId = "alfombra" | "sofa" | "horno" | "planta" | "cama" | "ventana";
type PalId = "maria" | "abu";

interface Furn { id: FurnId; name: string; price: number; x: number; }
interface Pal { id: PalId; name: string; tag: string; price: number; blurb: string; }

const FURNS: Furn[] = [
  { id: "alfombra", name: "Alfombra", price: 40, x: 90 },
  { id: "sofa", name: "Sofá", price: 90, x: 40 },
  { id: "horno", name: "Horno", price: 120, x: 230 },
  { id: "planta", name: "Helecho", price: 50, x: 300 },
  { id: "cama", name: "Cama", price: 110, x: 160 },
  { id: "ventana", name: "Ventana", price: 70, x: 200 },
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
  const [knead, setKnead] = useState(0);
  const x = useRef(140);
  const face = useRef<1 | -1>(1);
  const dir = useRef(0);
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_furn", ownedF), [ownedF]);
  useEffect(() => save("maxine_pals", ownedP), [ownedP]);
  useEffect(() => save("maxine_room", room), [room]);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      x.current += dir.current * 2.2;
      x.current = Math.max(16, Math.min(300, x.current));
      if (dir.current) face.current = dir.current as 1 | -1;
      setTick((n) => (n + 1) & 255);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") dir.current = -1;
      if (e.key === "ArrowRight" || e.key === "d") dir.current = 1;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") dir.current = 0;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, []);

  const buyF = (f: Furn) => {
    if (ownedF.includes(f.id) || crumbs < f.price) return;
    onSpend(f.price); setOwnedF((o) => [...o, f.id]);
  };
  const buyP = (p: Pal) => {
    if (ownedP.includes(p.id) || crumbs < p.price) return;
    onSpend(p.price); setOwnedP((o) => [...o, p.id]);
  };
  const upgrade = () => {
    if (room >= 3 || crumbs < 200) return;
    onSpend(200); setRoom((r) => r + 1);
  };
  const tapDough = () => {
    const n = knead + 1;
    setKnead(n);
    if (n > 0 && n % 8 === 0) onEarn(3);
  };

  const walls = room === 1 ? "#6a3a22" : room === 2 ? "#3a4a6a" : "#4a2a50";
  const floor = room === 1 ? "#c9842a" : room === 2 ? "#d8c4a0" : "#e8d0e8";

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
            {ownedF.includes("ventana") && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-20 rounded-md border-4 border-[#5a3216]" style={{ background: "linear-gradient(180deg,#7fd0ff,#ffe0b0)" }} />
            )}
            {ownedF.includes("alfombra") && (
              <div className="absolute bottom-8 left-10 right-10 h-8 rounded-full" style={{ background: "#7a1430", boxShadow: "inset 0 2px 0 #c44" }} />
            )}
            {ownedF.includes("sofa") && (
              <div className="absolute bottom-14 left-6 w-24 h-14 rounded-t-xl" style={{ background: "#3a5a8a", border: "3px solid #1a2a40" }} />
            )}
            {ownedF.includes("cama") && (
              <div className="absolute bottom-14 left-[38%] w-28 h-12 rounded-md" style={{ background: "#fff3d6", border: "3px solid #8a5a2c" }}>
                <div className="absolute top-0 inset-x-2 h-3 rounded-b bg-[#ff8fb6]" />
              </div>
            )}
            {ownedF.includes("horno") && (
              <div className="absolute bottom-14 right-8 w-16 h-20 rounded-md" style={{ background: "#3a1a08", border: "3px solid #1a0804" }}>
                <div className="absolute left-2 right-2 top-3 h-8 rounded-sm flicker" style={{ background: "radial-gradient(circle,#ffd27a,#ff5a2a)" }} />
              </div>
            )}
            {ownedF.includes("planta") && (
              <div className="absolute bottom-14 right-2 w-8">
                <div className="h-8 rounded-full mx-auto w-8" style={{ background: "#3a7a1a" }} />
                <div className="h-6 w-6 mx-auto rounded-sm" style={{ background: "#8a5128" }} />
              </div>
            )}
            {ownedP.includes("maria") && (
              <div className="absolute bottom-10" style={{ left: 18 }}><Maria size={86} wave /></div>
            )}
            {ownedP.includes("abu") && (
              <div className="absolute bottom-10" style={{ right: 22 }}><Abu size={86} /></div>
            )}
            <div className="absolute bottom-8" style={{ left: x.current }}>
              <Maxine skin={skin} pose="idle" facing={face.current} size={78} />
            </div>
            <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: floor, boxShadow: "inset 0 4px 0 #0003" }} />
          </div>
          <div className="absolute bottom-0 inset-x-0 flex gap-2 px-6">
            <button className="btn-3d flex-1 font-display font-bold text-[16px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = -1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Izq</button>
            <button className="btn-3d flex-1 font-display font-bold text-[16px] py-2 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
              onPointerDown={() => { dir.current = 1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Der</button>
          </div>
        </div>
      )}

      {tab === "tienda" && (
        <div className="absolute inset-x-0 overflow-y-auto scrollbar-none px-3 space-y-3" style={{ top: 96, bottom: 12 }}>
          <div className="bg-black/40 rounded-xl p-2 border border-amber-300/20">
            <div className="font-display font-bold text-amber-100 text-sm mb-1">Mejorar casa · nivel {room}/3</div>
            <button disabled={room >= 3 || crumbs < 200} onClick={upgrade}
              className="btn-3d w-full font-display font-bold text-[14px] py-2 rounded-lg border-2 disabled:opacity-50"
              style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>
              {room >= 3 ? "Casa máxima" : "Ampliar · 200"}
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
                  <div className="font-pixel text-[8px] text-amber-200">{own ? "VIVE AQUÍ" : p.blurb}</div>
                  {!own && <div className="font-display font-bold text-[12px] text-amber-100 mt-0.5">CRO {p.price}</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === "juego" && (
        <div className="absolute inset-x-4 flex flex-col items-center" style={{ top: 110 }}>
          <div className="font-display font-bold text-amber-100 text-xl">Amasar</div>
          <p className="font-display text-[13px] text-amber-100/80 text-center mt-1">Tocá la masa. Cada 8 toques, 3 migas.</p>
          <button onClick={tapDough} className="mt-6 pop" style={{ width: 180, height: 140 }}>
            <div className="w-full h-full rounded-[40%] border-4 border-[#7a4410]" style={{ background: "radial-gradient(circle at 40% 35%, #ffe4b0, #d99243)", boxShadow: "0 10px 0 #5a2810" }} />
          </button>
          <div className="mt-3 font-display font-bold text-amber-200">Toques {knead}</div>
        </div>
      )}
    </div>
  );
}
