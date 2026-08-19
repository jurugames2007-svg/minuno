import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine from "../art/Maxine";
import { Maria, Abu } from "../art/Folk";
import { Crown } from "../art/Decor";
import type { SkinId } from "../data/skins";
import { FURNS, HOTBAR, START_STOCK, furnById, newUid, type FurnId, type PlacedFurn } from "../data/furniture";
import { FurnitureArt, WoodIcon } from "../art/FurnitureArt";

const TILE = 20;
const BASE_W = 11;
const ROOF = 46;
const STORY = 112;
const ORIGIN = 72;
const PW = 22;
const PH = 32;
const MS = 58;
const G = 1650;
const JUMP = 420;
const SPEED = 155;

type PalId = "maria" | "abu";
const PALS: { id: PalId; name: string; price: number; blurb: string }[] = [
  { id: "maria", name: "María", price: 180, blurb: "Teje en la planta baja." },
  { id: "abu", name: "Abu", price: 220, blurb: "Toma té en el comedor." },
];

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

function standY(floor: 0 | 1 | 2) {
  return ROOF + STORY * (3 - floor) - 4;
}
function floorOfY(y: number): 0 | 1 | 2 {
  const foot = y + PH;
  if (foot <= standY(2) + 8) return 2;
  if (foot <= standY(1) + 8) return 1;
  return 0;
}
function span(id: FurnId, rot: 0 | 1) {
  const d = furnById(id);
  return rot ? { w: d.h, h: d.w } : { w: d.w, h: d.h };
}

interface Props {
  skin: SkinId;
  crumbs: number;
  onSpend: (n: number) => void;
  onEarn: (n: number) => void;
  onBack: () => void;
}

export default function House({ skin, crumbs, onSpend, onEarn, onBack }: Props) {
  const [placed, setPlaced] = useState<PlacedFurn[]>(() => load("maxine_placed", []));
  const [stock, setStock] = useState<Partial<Record<FurnId, number>>>(() => load("maxine_stock", START_STOCK));
  const [wood, setWood] = useState(() => load("maxine_wood", 36));
  const [expL, setExpL] = useState(() => load("maxine_expl", 0));
  const [expR, setExpR] = useState(() => load("maxine_expr", 0));
  const [ownedP, setOwnedP] = useState<PalId[]>(() => load("maxine_pals", []));
  const [build, setBuild] = useState(false);
  const [shopOn, setShopOn] = useState(false);
  const [sel, setSel] = useState<FurnId | null>("cama");
  const [rot, setRot] = useState<0 | 1>(0);
  const [ghost, setGhost] = useState<{ gx: number; floor: 0 | 1 | 2; ok: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const chops = useRef(0);
  const x = useRef(ORIGIN + 5 * TILE);
  const y = useRef(standY(0) - PH);
  const vx = useRef(0);
  const vy = useRef(0);
  const onG = useRef(true);
  const face = useRef<1 | -1>(1);
  const climb = useRef(false);
  const dir = useRef(0);
  const jumpQ = useRef(false);
  const downQ = useRef(false);
  const cam = useRef(0);
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_placed", placed), [placed]);
  useEffect(() => save("maxine_stock", stock), [stock]);
  useEffect(() => save("maxine_wood", wood), [wood]);
  useEffect(() => save("maxine_expl", expL), [expL]);
  useEffect(() => save("maxine_expr", expR), [expR]);
  useEffect(() => save("maxine_pals", ownedP), [ownedP]);

  const leftTile = -expL * 2;
  const rightTile = BASE_W + expR * 2;
  const houseL = ORIGIN + leftTile * TILE;
  const houseR = ORIGIN + rightTile * TILE;
  const houseW = houseR - houseL;
  const tilesW = rightTile - leftTile;

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const ladL = houseL + 10;
      const ladR = houseL + 36;
      const cx = x.current + PW / 2;
      const nearLad = cx > ladL && cx < ladR;
      if (!build) {
        vx.current = dir.current * SPEED;
        if (dir.current) face.current = dir.current as 1 | -1;
      } else {
        vx.current = 0;
      }
      const wantClimb = nearLad && (jumpQ.current || climb.current);
      if (wantClimb && nearLad) {
        climb.current = true;
        onG.current = false;
        if (jumpQ.current) y.current -= 170 * dt;
        if (downQ.current) y.current += 170 * dt;
        y.current = Math.max(standY(2) - PH - 8, Math.min(standY(0) - PH, y.current));
        x.current = houseL + 12;
      } else {
        climb.current = false;
        if (jumpQ.current && onG.current && !build) {
          vy.current = -JUMP;
          onG.current = false;
        }
        vy.current += G * dt;
        if (vy.current > 620) vy.current = 620;
        y.current += vy.current * dt;
        onG.current = false;
        const foot = y.current + PH;
        for (const fl of [2, 1, 0] as const) {
          const sy = standY(fl);
          if (vy.current >= 0 && foot >= sy && foot <= sy + 16 && x.current + PW > houseL + 4 && x.current < houseR - 4) {
            y.current = sy - PH;
            vy.current = 0;
            onG.current = true;
            break;
          }
        }
        if (y.current > standY(0) - PH) {
          y.current = standY(0) - PH;
          vy.current = 0;
          onG.current = true;
        }
      }
      jumpQ.current = false;
      x.current += vx.current * dt;
      x.current = Math.max(houseL + 6, Math.min(houseR - PW - 8, x.current));
      const mid = x.current + PW / 2;
      cam.current += (mid - 180 - cam.current) * Math.min(1, dt * 6);
      const maxCam = Math.max(0, houseR + 40 - 360);
      cam.current = Math.max(Math.min(houseL - 40, 0), Math.min(cam.current, maxCam));
      setTick((n) => (n + 1) & 1023);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") dir.current = -1;
      if (e.key === "ArrowRight" || e.key === "d") dir.current = 1;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { jumpQ.current = true; e.preventDefault(); }
      if (e.key === "ArrowDown" || e.key === "s") downQ.current = true;
      if (e.key === "b") setBuild((v) => !v);
      if (e.key === "r") setRot((r) => (r ? 0 : 1));
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") dir.current = 0;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [build, houseL, houseR]);

  const countOf = (id: FurnId) => stock[id] ?? 0;

  const canSit = (gx: number, floor: 0 | 1 | 2, id: FurnId, r: 0 | 1, ignore?: string) => {
    const { w } = span(id, r);
    if (gx < leftTile || gx + w > rightTile) return false;
    const def = furnById(id);
    for (const p of placed) {
      if (p.uid === ignore || p.floor !== floor) continue;
      const a = furnById(p.id);
      if (def.slot === "rug" || a.slot === "rug") continue;
      if (def.slot === "wall" || a.slot === "wall") continue;
      const sw = span(p.id, p.rot).w;
      if (gx < p.gx + sw && gx + w > p.gx) return false;
    }
    return true;
  };

  const placeAt = (gx: number, floor: 0 | 1 | 2) => {
    if (!sel || countOf(sel) <= 0) return;
    if (!canSit(gx, floor, sel, rot)) { flash("Ahí no cabe"); return; }
    setPlaced((ps) => [...ps, { uid: newUid(), id: sel, gx, floor, rot }]);
    setStock((s) => ({ ...s, [sel]: (s[sel] ?? 0) - 1 }));
  };

  const pickup = (uid: string) => {
    const it = placed.find((p) => p.uid === uid);
    if (!it) return;
    setPlaced((ps) => ps.filter((p) => p.uid !== uid));
    setStock((s) => ({ ...s, [it.id]: (s[it.id] ?? 0) + 1 }));
    setSel(it.id);
  };

  const pickFloor = (clientY: number, rect: DOMRect) => {
    const ly = clientY - rect.top;
    const attic = standY(2);
    const mid = standY(1);
    if (ly < attic + 8) return 2 as const;
    if (ly < mid + 8) return 1 as const;
    return 0 as const;
  };

  const onWorldMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!build || !sel) { setGhost(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const lx = e.clientX - rect.left + cam.current;
    const gx = Math.floor((lx - ORIGIN) / TILE);
    const floor = pickFloor(e.clientY, rect);
    setGhost({ gx, floor, ok: canSit(gx, floor, sel, rot) && countOf(sel) > 0 });
  };

  const onWorldDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!build) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const lx = e.clientX - rect.left + cam.current;
    const gx = Math.floor((lx - ORIGIN) / TILE);
    const floor = pickFloor(e.clientY, rect);
    const hit = [...placed].reverse().find((p) => {
      if (p.floor !== floor) return false;
      const w = span(p.id, p.rot).w;
      return gx >= p.gx && gx < p.gx + w;
    });
    if (hit) { pickup(hit.uid); return; }
    placeAt(gx, floor);
  };

  const buyF = (id: FurnId) => {
    const d = furnById(id);
    if (crumbs < d.price || wood < d.wood) { flash("Faltan recursos"); return; }
    onSpend(d.price);
    setWood((w) => w - d.wood);
    setStock((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));
    flash(`+1 ${d.name}`);
  };
  const buyP = (id: PalId, price: number) => {
    if (ownedP.includes(id) || crumbs < price) return;
    onSpend(price);
    setOwnedP((o) => [...o, id]);
  };
  const expand = (side: "l" | "r") => {
    if (crumbs < 50 || wood < 18) { flash("50 migas y 18 leños"); return; }
    if (side === "l" && expL >= 2) return;
    if (side === "r" && expR >= 2) return;
    onSpend(50);
    setWood((w) => w - 18);
    if (side === "l") setExpL((n) => n + 1);
    else setExpR((n) => n + 1);
    flash("¡Habitación nueva!");
  };
  const chop = () => {
    setWood((w) => w + 1);
    chops.current += 1;
    if (chops.current % 4 === 0) onEarn(1);
  };

  const pose = !onG.current && vy.current > 40 ? "fall" as const : "idle" as const;
  const flNow = floorOfY(y.current);
  const gW = sel ? span(sel, rot).w : 1;
  const gH = sel ? span(sel, rot).h : 1;

  return (
    <div className="absolute inset-0 select-none overflow-hidden" style={{ background: "radial-gradient(120% 80% at 50% 0%, #1a1028 0%, #080610 70%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-100/70" style={{
            width: 2 + (i % 3), height: 2 + (i % 3),
            left: `${(i * 37) % 100}%`, top: `${(i * 17) % 42}%`, opacity: 0.35 + (i % 5) * 0.08,
          }} />
        ))}
      </div>

      <div className="absolute top-2 left-2 right-2 z-40 flex items-center justify-between gap-1.5">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-2 py-1.5">
            <Crown size={14} /><span className="font-display font-bold text-[13px] text-amber-200">{crumbs}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-2 py-1.5">
            <WoodIcon size={14} /><span className="font-display font-bold text-[13px] text-amber-200">{wood}</span>
          </div>
        </div>
        <button onClick={() => setBuild((v) => !v)} className="btn-3d font-display font-bold text-[12px] px-2.5 py-2 rounded-xl border-2 border-b-4"
          style={{ background: build ? "linear-gradient(180deg,#7fc24a,#3a7a1a)" : "#3a2010", color: build ? "#102008" : "#ffd27a", borderColor: "#1a0c04" }}>
          {build ? "Construir" : "Pasear"}
        </button>
      </div>
      <div className="absolute z-40 flex gap-1.5" style={{ top: 50, left: 8, right: 8 }}>
        <div className="font-display text-[11px] text-amber-100/80 bg-black/40 rounded-full px-2 py-0.5">{tilesW}×5 · 3 pisos</div>
        <button onClick={() => setShopOn(true)} className="btn-3d ml-auto font-display font-bold text-[12px] px-2.5 py-1 rounded-lg border-2" style={{ background: "#3a2010", color: "#ffd27a", borderColor: "#1a0c04" }}>Inventario</button>
        {build && (
          <button onClick={() => setRot((r) => (r ? 0 : 1))} className="btn-3d font-display font-bold text-[12px] px-2.5 py-1 rounded-lg border-2" style={{ background: "#3a2010", color: "#ffd27a", borderColor: "#1a0c04" }}>Girar</button>
        )}
      </div>

      <div
        className="absolute inset-0"
        style={{ top: 78, bottom: build ? 92 : 78, touchAction: "none" }}
        onPointerMove={onWorldMove}
        onPointerDown={onWorldDown}
        onPointerLeave={() => setGhost(null)}
      >
        <div className="absolute inset-0" style={{ transform: `translate3d(${-cam.current}px,0,0)` }}>
          <div className="absolute" style={{ left: houseL - 8, top: 4, width: houseW + 16, height: ROOF + 8 }}>
            <div style={{
              width: "100%", height: "100%",
              background: "#5a3218",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              boxShadow: "0 6px 0 #2a1408",
              border: "3px solid #1a0c04",
            }} />
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: ROOF * 0.45, width: 18, height: 22, background: "#3a2010", border: "3px solid #1a0c04" }} />
          </div>

          <div className="absolute overflow-hidden" style={{
            left: houseL, top: ROOF, width: houseW, height: STORY * 3 + 6,
            border: "4px solid #1a0c04", background: "#2a1810", boxShadow: "0 10px 0 #120808",
          }}>
            {([2, 1, 0] as const).map((fl) => {
              const top = standY(fl) - ROOF - (STORY - 8);
              const pal = fl === 2 ? "#4a2e1c" : fl === 1 ? "#3a2840" : "#2a3040";
              return (
                <div key={fl} className="absolute inset-x-0" style={{ top, height: STORY - 4, background: `linear-gradient(180deg,${pal},#1a120c)` }}>
                  {build && Array.from({ length: tilesW }).map((_, i) => (
                    <div key={i} className="absolute inset-y-0" style={{
                      left: i * TILE, width: TILE,
                      borderRight: "1px solid #ffd27a22",
                      borderTop: "1px solid #ffd27a18",
                    }} />
                  ))}
                  <div className="absolute inset-x-0 bottom-0 h-2" style={{ background: "#6a3a14", borderTop: "3px solid #1a0c04" }} />
                  <div className="absolute left-2 top-2 font-display text-[10px] text-amber-100/40">
                    {fl === 2 ? "Ático" : fl === 1 ? "Sala" : "Cocina"}
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-0" style={{ left: 12, width: 22, top: 6 }}>
              <div className="absolute inset-y-0 left-0 w-1 bg-[#8a5a2c]" />
              <div className="absolute inset-y-0 right-0 w-1 bg-[#8a5a2c]" />
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-0.5" style={{ top: 10 + i * 20, background: "#c9842a" }} />
              ))}
            </div>

            {placed.filter((p) => furnById(p.id).slot === "rug").map((p) => <Piece key={p.uid} p={p} origin={ORIGIN} houseL={houseL} />)}
            {placed.filter((p) => furnById(p.id).slot !== "rug").map((p) => <Piece key={p.uid} p={p} origin={ORIGIN} houseL={houseL} />)}

            {ghost && sel && (
              <div className="absolute pointer-events-none" style={{
                left: ORIGIN - houseL + ghost.gx * TILE,
                top: standY(ghost.floor) - ROOF - gH * TILE,
                width: gW * TILE, height: gH * TILE,
                background: ghost.ok ? "#7fc24a66" : "#e23b3b66",
                outline: `3px dashed ${ghost.ok ? "#7fc24a" : "#e23b3b"}`,
              }}>
                <div className="opacity-70"><FurnitureArt id={sel} w={gW * TILE} h={gH * TILE} /></div>
              </div>
            )}

            {ownedP.includes("maria") && (
              <div className="absolute" style={{ left: 90, top: standY(0) - ROOF - 70 }}><Maria size={70} wave /></div>
            )}
            {ownedP.includes("abu") && (
              <div className="absolute" style={{ left: 150, top: standY(0) - ROOF - 70 }}><Abu size={70} /></div>
            )}
          </div>

          {expL < 2 && (
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => expand("l")} className="absolute font-display font-bold text-[22px] text-[#102008]"
              style={{ left: houseL - 34, top: ROOF + STORY, width: 30, height: 30, background: "#7fc24a", border: "3px solid #1a3a08", borderRadius: 8 }}>+</button>
          )}
          {expR < 2 && (
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => expand("r")} className="absolute font-display font-bold text-[22px] text-[#102008]"
              style={{ left: houseR + 4, top: ROOF + STORY, width: 30, height: 30, background: "#7fc24a", border: "3px solid #1a3a08", borderRadius: 8 }}>+</button>
          )}

          <div className="absolute z-30" style={{ left: x.current - 18, top: y.current - 22, width: MS, height: MS }}>
            <Maxine skin={skin} pose={pose} facing={face.current} size={MS} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-display font-bold text-[9px] text-amber-50 bg-black/55 px-1.5 rounded-full whitespace-nowrap">Maxine</div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="absolute left-4 right-4 z-50 text-center font-display font-bold text-amber-50 bg-black/75 rounded-xl py-1.5 border border-amber-200/30" style={{ top: 86 }}>{toast}</div>
      )}

      {!build && (
        <div className="absolute bottom-2 inset-x-2 z-40 flex gap-2">
          <button className="btn-3d flex-1 font-display font-bold text-[15px] py-2.5 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
            onPointerDown={() => { dir.current = -1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Izq</button>
          <button className="btn-3d font-display font-bold text-[13px] px-3 py-2.5 rounded-full border-b-4" style={{ background: "#c9842a", color: "#1a0c04", borderColor: "#5a3216" }}
            onPointerDown={() => { downQ.current = true; climb.current = true; }} onPointerUp={() => { downQ.current = false; climb.current = false; }} onPointerLeave={() => { downQ.current = false; climb.current = false; }}>Bajar</button>
          <button className="btn-3d font-display font-bold text-[14px] px-3 py-2.5 rounded-full border-b-4" style={{ background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}
            onPointerDown={() => { jumpQ.current = true; climb.current = true; }} onPointerUp={() => { climb.current = false; }}>Salto</button>
          <button className="btn-3d flex-1 font-display font-bold text-[15px] py-2.5 rounded-full border-b-4 text-white" style={{ background: "#3a2010", borderColor: "#1a0c04" }}
            onPointerDown={() => { dir.current = 1; }} onPointerUp={() => { dir.current = 0; }} onPointerLeave={() => { dir.current = 0; }}>Der</button>
        </div>
      )}

      {build && (
        <div className="absolute bottom-0 inset-x-0 z-40 px-1.5 pb-2 pt-1" style={{ background: "linear-gradient(180deg,#0000,#0a0614 30%)" }}>
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {HOTBAR.map((id) => {
              const n = countOf(id);
              const on = sel === id;
              return (
                <button key={id} onClick={() => setSel(id)} className="relative shrink-0 rounded-lg border-2"
                  style={{ width: 42, height: 46, background: on ? "#4a3018" : "#24140c", borderColor: on ? "#ffd27a" : "#1a0c04" }}>
                  <FurnitureArt id={id} w={38} h={30} />
                  <span className="absolute -top-1 -right-1 min-w-[16px] text-center font-display font-bold text-[10px] bg-[#1a0c04] text-amber-100 rounded-full px-1">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {shopOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-end">
          <div className="w-full rounded-t-2xl border-2 border-amber-200/30 p-3 max-h-[78%] overflow-y-auto scrollbar-none" style={{ background: "#24140c" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-display font-bold text-amber-50 text-[18px]">Inventario</div>
              <button onClick={() => setShopOn(false)} className="font-display font-bold text-amber-100">Cerrar</button>
            </div>
            <p className="font-display text-[12px] text-amber-100/75 mb-2">Comprá muebles, giralos (R) y colocálos en la rejilla. Tocá un mueble puesto para recogerlo.</p>
            <div className="grid grid-cols-4 gap-1.5">
              {FURNS.map((f) => (
                <button key={f.id} onClick={() => buyF(f.id)} className="rounded-lg border-2 p-1 text-left" style={{ background: "#3a2010", borderColor: "#1a0c04" }}>
                  <FurnitureArt id={f.id} w={48} h={36} />
                  <div className="font-display font-bold text-[11px] text-amber-100 leading-tight">{f.name}</div>
                  <div className="font-display text-[10px] text-amber-200/80">{f.price} · {f.wood} leño · x{countOf(f.id)}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {PALS.map((p) => {
                const own = ownedP.includes(p.id);
                return (
                  <button key={p.id} disabled={own || crumbs < p.price} onClick={() => buyP(p.id, p.price)}
                    className="w-full text-left rounded-lg border-2 p-2 flex items-center gap-2 disabled:opacity-50" style={{ background: "#3a2010", borderColor: own ? "#7fc24a" : "#1a0c04" }}>
                    <div className="w-10 h-12">{p.id === "maria" ? <Maria size={52} /> : <Abu size={52} />}</div>
                    <div>
                      <div className="font-display font-bold text-amber-100">{p.name}</div>
                      <div className="font-display text-[11px] text-amber-200/80">{own ? "Vive aquí" : `${p.blurb} · ${p.price}`}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={chop} className="btn-3d mt-3 w-full font-display font-bold py-2 rounded-xl" style={{ background: "#7fc24a", color: "#102008" }}>Amasar leño +1</button>
          </div>
        </div>
      )}
      <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-30 font-display text-[10px] text-amber-100/50 pointer-events-none">
        {flNow === 2 ? "Ático" : flNow === 1 ? "Sala" : "Cocina"}
      </div>
    </div>
  );
}

function Piece({ p, origin, houseL }: { p: PlacedFurn; origin: number; houseL: number }) {
  const d = furnById(p.id);
  const { w, h } = span(p.id, p.rot);
  const wall = d.slot === "wall";
  const left = origin - houseL + p.gx * TILE;
  const top = standY(p.floor) - ROOF - (wall ? h * TILE + 18 : h * TILE);
  return (
    <div className="absolute" style={{ left, top, width: w * TILE, height: h * TILE, zIndex: d.slot === "rug" ? 1 : 2 }}>
      <FurnitureArt id={p.id} w={w * TILE} h={h * TILE} />
    </div>
  );
}
