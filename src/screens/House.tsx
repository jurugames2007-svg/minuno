import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine from "../art/Maxine";
import { Maria, Abu } from "../art/Folk";
import { Crown } from "../art/Decor";
import type { SkinId } from "../data/skins";
import {
  FURNS, HOTBAR, START_STOCK, WALLS, FLOORINGS, DEFAULT_WALLS, DEFAULT_FLOORS,
  furnById, newUid,
  type FurnId, type PlacedFurn, type WallId, type FloorId, type ArcadeId, type FurnCat,
} from "../data/furniture";
import { FurnitureArt, WoodIcon, HammerIcon, BagIcon } from "../art/FurnitureArt";
import ArcadePlay from "./ArcadePlay";

const TILE = 20;
const BASE_W = 11;
const ROOF = 52;
const STORY = 118;
const ORIGIN = 64;
const PW = 22;
const PH = 32;
const MS = 56;
const G = 1650;
const JUMP = 420;
const SPEED = 155;

type PalId = "maria" | "abu";
const PALS: { id: PalId; name: string; price: number; blurb: string }[] = [
  { id: "maria", name: "María", price: 180, blurb: "Teje abajo, con mate." },
  { id: "abu", name: "Abu", price: 220, blurb: "Toma té en la sala." },
];

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

function standY(floor: 0 | 1 | 2) {
  return ROOF + STORY * (3 - floor) - 2;
}
function floorOfY(y: number): 0 | 1 | 2 {
  const foot = y + PH;
  if (foot <= standY(2) + 10) return 2;
  if (foot <= standY(1) + 10) return 1;
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
  const [walls, setWalls] = useState<Record<0 | 1 | 2, WallId>>(() => load("maxine_walls", DEFAULT_WALLS));
  const [floors, setFloors] = useState<Record<0 | 1 | 2, FloorId>>(() => load("maxine_floors", DEFAULT_FLOORS));
  const [build, setBuild] = useState(false);
  const [shopOn, setShopOn] = useState(false);
  const [tab, setTab] = useState<FurnCat | "pared" | "piso" | "amigo">("casa");
  const [sel, setSel] = useState<FurnId | null>("cama");
  const [rot, setRot] = useState<0 | 1>(0);
  const [ghost, setGhost] = useState<{ gx: number; floor: 0 | 1 | 2; ok: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [arcade, setArcade] = useState<ArcadeId | null>(null);
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
  useEffect(() => save("maxine_walls", walls), [walls]);
  useEffect(() => save("maxine_floors", floors), [floors]);

  const leftTile = -expL * 2;
  const rightTile = BASE_W + expR * 2;
  const houseL = ORIGIN + leftTile * TILE;
  const houseR = ORIGIN + rightTile * TILE;
  const houseW = houseR - houseL;
  const tilesW = rightTile - leftTile;

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 1600);
  };

  useEffect(() => {
    if (arcade) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const ladL = houseL + 14;
      const ladR = houseL + 40;
      const cx = x.current + PW / 2;
      const nearLad = cx > ladL && cx < ladR;
      if (!build) {
        vx.current = dir.current * SPEED;
        if (dir.current) face.current = dir.current as 1 | -1;
      } else vx.current = 0;
      const wantClimb = nearLad && (jumpQ.current || climb.current || downQ.current);
      if (wantClimb) {
        climb.current = true;
        onG.current = false;
        if (jumpQ.current) y.current -= 170 * dt;
        if (downQ.current) y.current += 170 * dt;
        y.current = Math.max(standY(2) - PH - 8, Math.min(standY(0) - PH, y.current));
        x.current = houseL + 16;
      } else {
        climb.current = false;
        if (jumpQ.current && onG.current && !build) { vy.current = -JUMP; onG.current = false; }
        vy.current += G * dt; if (vy.current > 620) vy.current = 620;
        y.current += vy.current * dt; onG.current = false;
        const foot = y.current + PH;
        for (const fl of [2, 1, 0] as const) {
          const sy = standY(fl);
          if (vy.current >= 0 && foot >= sy && foot <= sy + 16 && x.current + PW > houseL + 4 && x.current < houseR - 4) {
            y.current = sy - PH; vy.current = 0; onG.current = true; break;
          }
        }
        if (y.current > standY(0) - PH) { y.current = standY(0) - PH; vy.current = 0; onG.current = true; }
      }
      jumpQ.current = false;
      x.current += vx.current * dt;
      x.current = Math.max(houseL - 30, Math.min(houseR - PW - 10, x.current));
      const mid = x.current + PW / 2;
      cam.current += (mid - 180 - cam.current) * Math.min(1, dt * 6);
      const maxCam = Math.max(0, houseR + 36 - 360);
      cam.current = Math.max(Math.min(houseL - 36, 0), Math.min(cam.current, maxCam));
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
      if (e.key === "ArrowDown" || e.key === "s") downQ.current = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [build, houseL, houseR, arcade]);

  const countOf = (id: FurnId) => stock[id] ?? 0;

  const canSit = (gx: number, floor: 0 | 1 | 2, id: FurnId, r: 0 | 1, ignore?: string) => {
    const { w } = span(id, r);
    if (gx < leftTile + 2 || gx + w > rightTile) return false;
    const def = furnById(id);
    for (const p of placed) {
      if (p.uid === ignore || p.floor !== floor) continue;
      const a = furnById(p.id);
      if (def.slot === "rug" || a.slot === "rug" || def.slot === "wall" || a.slot === "wall") continue;
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
    if (ly < standY(2) + 8) return 2 as const;
    if (ly < standY(1) + 8) return 1 as const;
    return 0 as const;
  };

  const onWorldMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!build || !sel) { setGhost(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const gx = Math.floor((e.clientX - rect.left + cam.current - ORIGIN) / TILE);
    const floor = pickFloor(e.clientY, rect);
    setGhost({ gx, floor, ok: canSit(gx, floor, sel, rot) && countOf(sel) > 0 });
  };

  const onWorldDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!build) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const gx = Math.floor((e.clientX - rect.left + cam.current - ORIGIN) / TILE);
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
    setSel(id);
    flash(d.name);
  };
  const buyP = (id: PalId, price: number) => {
    if (ownedP.includes(id) || crumbs < price) return;
    onSpend(price);
    setOwnedP((o) => [...o, id]);
  };
  const paintWall = (id: WallId) => {
    const def = WALLS.find((w) => w.id === id);
    if (!def || crumbs < def.price) { flash("Faltan migas"); return; }
    const fl = floorOfY(y.current);
    onSpend(def.price);
    setWalls((w) => ({ ...w, [fl]: id }));
    flash(`Pared · ${def.name}`);
  };
  const paintFloor = (id: FloorId) => {
    const def = FLOORINGS.find((f) => f.id === id);
    if (!def || crumbs < def.price) { flash("Faltan migas"); return; }
    const fl = floorOfY(y.current);
    onSpend(def.price);
    setFloors((f) => ({ ...f, [fl]: id }));
    flash(`Piso · ${def.name}`);
  };
  const expand = (side: "l" | "r") => {
    if (crumbs < 50 || wood < 18) { flash("50 migas y 18 leños"); return; }
    if (side === "l" && expL >= 2) return;
    if (side === "r" && expR >= 2) return;
    onSpend(50);
    setWood((w) => w - 18);
    if (side === "l") setExpL((n) => n + 1); else setExpR((n) => n + 1);
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
  const gxNow = Math.floor((x.current + PW / 2 - ORIGIN) / TILE);
  const nearGame = !build ? placed.find((p) => {
    const d = furnById(p.id);
    if (!d.game || p.floor !== flNow) return false;
    const w = span(p.id, p.rot).w;
    return gxNow >= p.gx - 1 && gxNow <= p.gx + w;
  }) : undefined;
  const nearStump = !build && x.current < houseL + 8;

  const catalog = FURNS.filter((f) => f.cat === tab);

  return (
    <div className="absolute inset-0 select-none overflow-hidden" style={{ background: "linear-gradient(180deg,#1b1630 0%,#0c0816 55%,#141018 100%)" }}>
      <div className="absolute right-8 top-10 w-14 h-14 rounded-full pointer-events-none" style={{ background: "#fff4d0", boxShadow: "0 0 40px #ffe08a66" }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none" style={{
          width: 2, height: 2, left: `${12 + (i * 29) % 80}%`, top: `${8 + (i * 13) % 22}%`, opacity: 0.35,
        }} />
      ))}

      <div className="absolute top-2 left-2 right-2 z-40 flex items-center gap-1.5">
        <button onClick={onBack} aria-label="Atrás" className="btn-3d w-10 h-10 rounded-full border-2 border-b-4 flex items-center justify-center font-display font-bold text-amber-100"
          style={{ background: "#3a2010", borderColor: "#1a0c04" }}>←</button>
        <div className="flex items-center gap-2 ml-auto rounded-full px-2.5 py-1 border-2" style={{ background: "#2a1810cc", borderColor: "#1a0c04" }}>
          <span className="flex items-center gap-0.5"><Crown size={13} /><b className="font-display text-[13px] text-amber-200">{crumbs}</b></span>
          <span className="flex items-center gap-0.5"><WoodIcon size={13} /><b className="font-display text-[13px] text-amber-200">{wood}</b></span>
        </div>
        <button onClick={() => setShopOn(true)} aria-label="Inventario" className="btn-3d w-10 h-10 rounded-full border-2 border-b-4 flex items-center justify-center"
          style={{ background: "#3a2010", borderColor: "#1a0c04" }}><BagIcon size={16} /></button>
        <button onClick={() => setBuild((v) => !v)} aria-label="Construir" className="btn-3d w-10 h-10 rounded-full border-2 border-b-4 flex items-center justify-center"
          style={{ background: build ? "#8fd45a" : "#3a2010", borderColor: "#1a0c04" }}>
          <HammerIcon size={16} color={build ? "#1a3008" : "#ffd27a"} />
        </button>
      </div>

      <div
        className="absolute inset-0"
        style={{ top: 52, bottom: build ? 78 : 70, touchAction: "none" }}
        onPointerMove={onWorldMove}
        onPointerDown={onWorldDown}
        onPointerLeave={() => setGhost(null)}
      >
        <div className="absolute inset-0" style={{ transform: `translate3d(${-cam.current}px,0,0)` }}>
          <div className="absolute" style={{ left: houseL - 10, top: 2, width: houseW + 20, height: ROOF }}>
            <div style={{
              width: "100%", height: "100%",
              background: "repeating-linear-gradient(180deg,#6a3a18 0 7px,#5a2e12 7px 8px)",
              clipPath: "polygon(0 100%, 50% 6%, 100% 100%)",
              boxShadow: "0 8px 0 #2a1408",
            }} />
            <div className="absolute" style={{ right: 18, top: 10, width: 16, height: 28, background: "#4a2814", border: "3px solid #1a0c04" }} />
          </div>

          <div className="absolute overflow-hidden" style={{
            left: houseL, top: ROOF - 2, width: houseW, height: STORY * 3 + 4,
            border: "5px solid #2a1408", background: "#3a2418", boxShadow: "8px 12px 0 #100808",
          }}>
            {([2, 1, 0] as const).map((fl) => (
              <StorySkin key={fl} fl={fl} wall={walls[fl]} floor={floors[fl]} tilesW={tilesW} build={build} />
            ))}

            <div className="absolute bottom-0 pointer-events-none" style={{ left: 18, width: 20, top: 8 }}>
              <div className="absolute inset-y-0 left-0 w-[3px] bg-[#7a4a22]" />
              <div className="absolute inset-y-0 right-0 w-[3px] bg-[#7a4a22]" />
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-[3px]" style={{ top: 8 + i * 22, background: "#c9842a" }} />
              ))}
            </div>

            {placed.filter((p) => furnById(p.id).slot === "rug").map((p) => <Piece key={p.uid} p={p} origin={ORIGIN} houseL={houseL} />)}
            {placed.filter((p) => furnById(p.id).slot !== "rug").map((p) => <Piece key={p.uid} p={p} origin={ORIGIN} houseL={houseL} />)}

            {ghost && sel && (
              <div className="absolute pointer-events-none" style={{
                left: ORIGIN - houseL + ghost.gx * TILE,
                top: standY(ghost.floor) - ROOF + 2 - gH * TILE,
                width: gW * TILE, height: gH * TILE,
                background: ghost.ok ? "#7fc24a44" : "#e23b3b44",
                outline: `2px dashed ${ghost.ok ? "#7fc24a" : "#e23b3b"}`,
              }}>
                <div className="opacity-60"><FurnitureArt id={sel} w={gW * TILE} h={gH * TILE} /></div>
              </div>
            )}

            {ownedP.includes("maria") && (
              <div className="absolute" style={{ left: 86, top: standY(0) - ROOF - 66 }}><Maria size={66} wave /></div>
            )}
            {ownedP.includes("abu") && (
              <div className="absolute" style={{ left: 148, top: standY(1) - ROOF - 66 }}><Abu size={66} /></div>
            )}
          </div>

          <button onPointerDown={(e) => { e.stopPropagation(); chop(); }} className="absolute"
            style={{ left: houseL - 38, top: standY(0) - 22, width: 28, height: 22, background: "#6a3a14", border: "3px solid #2a1408", borderRadius: 6 }}
            aria-label="Leño" />

          {build && expL < 2 && (
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => expand("l")}
              className="absolute font-display font-bold text-[18px] text-[#16300a]"
              style={{ left: houseL - 28, top: ROOF + STORY + 20, width: 24, height: 24, background: "#8fd45a", border: "2px solid #1a3a08", borderRadius: 6 }}>+</button>
          )}
          {build && expR < 2 && (
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => expand("r")}
              className="absolute font-display font-bold text-[18px] text-[#16300a]"
              style={{ left: houseR + 4, top: ROOF + STORY + 20, width: 24, height: 24, background: "#8fd45a", border: "2px solid #1a3a08", borderRadius: 6 }}>+</button>
          )}

          <div className="absolute z-30" style={{ left: x.current - 16, top: y.current - 20, width: MS, height: MS }}>
            <Maxine skin={skin} pose={pose} facing={face.current} size={MS} />
          </div>
        </div>
      </div>

      {toast && (
        <div className="absolute left-8 right-8 z-50 text-center font-display font-bold text-[13px] text-amber-50 bg-black/60 rounded-full py-1" style={{ top: 56 }}>{toast}</div>
      )}

      {!build && nearGame && (
        <button onClick={() => { const g = furnById(nearGame.id).game; if (g) setArcade(g); }}
          className="absolute z-40 btn-3d font-display font-bold text-[13px] px-3 py-1.5 rounded-full"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: 78, background: "#ffd27a", color: "#3a1808" }}>Jugar</button>
      )}
      {!build && nearStump && (
        <button onClick={chop} className="absolute z-40 btn-3d font-display font-bold text-[12px] px-3 py-1.5 rounded-full"
          style={{ left: 12, bottom: 78, background: "#c9842a", color: "#1a0c04" }}>Leño</button>
      )}

      {!build && (
        <div className="absolute bottom-2 inset-x-3 z-40 flex items-end justify-between">
          <div className="flex gap-2">
            <Pad label="‹" onDown={() => { dir.current = -1; }} onUp={() => { dir.current = 0; }} />
            <Pad label="›" onDown={() => { dir.current = 1; }} onUp={() => { dir.current = 0; }} />
          </div>
          <div className="flex gap-2">
            <Pad label="↓" dim onDown={() => { downQ.current = true; climb.current = true; }} onUp={() => { downQ.current = false; climb.current = false; }} />
            <Pad label="↑" gold onDown={() => { jumpQ.current = true; climb.current = true; }} onUp={() => { climb.current = false; }} />
          </div>
        </div>
      )}

      {build && (
        <div className="absolute bottom-0 inset-x-0 z-40 px-2 pb-2 pt-1">
          <div className="flex items-end gap-1 overflow-x-auto scrollbar-none">
            <button onClick={() => setRot((r) => (r ? 0 : 1))} className="shrink-0 w-9 h-11 rounded-lg border-2 font-display font-bold text-[11px] text-amber-100"
              style={{ background: "#2a1810", borderColor: "#1a0c04" }}>90°</button>
            {HOTBAR.concat(FURNS.filter((f) => f.cat === "arcade").map((f) => f.id)).filter((id, i, a) => a.indexOf(id) === i).map((id) => {
              const n = countOf(id);
              const on = sel === id;
              return (
                <button key={id} onClick={() => setSel(id)} className="relative shrink-0 rounded-lg border-2"
                  style={{ width: 40, height: 44, background: on ? "#4a3018" : "#1c100a", borderColor: on ? "#e8c070" : "#1a0c04", opacity: n ? 1 : 0.45 }}>
                  <FurnitureArt id={id} w={36} h={28} />
                  <span className="absolute -top-1 -right-1 min-w-[14px] text-center font-display font-bold text-[9px] bg-[#1a0c04] text-amber-100 rounded-full px-0.5">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {shopOn && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full rounded-t-2xl border-t-2 p-3 max-h-[76%] overflow-y-auto scrollbar-none" style={{ background: "#26160e", borderColor: "#c9a86a55" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-display font-bold text-amber-50 text-[17px]">Decorar</div>
              <button onClick={() => setShopOn(false)} className="font-display font-bold text-amber-200 text-[13px]">Listo</button>
            </div>
            <div className="flex gap-1 mb-2 overflow-x-auto scrollbar-none">
              {([
                ["casa", "Casa"], ["deco", "Deco"], ["arcade", "Arcade"],
                ["pared", "Pared"], ["piso", "Piso"], ["amigo", "Amigos"],
              ] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className="shrink-0 font-display font-bold text-[11px] px-2.5 py-1 rounded-full"
                  style={{ background: tab === id ? "#ffd27a" : "#3a2010", color: tab === id ? "#3a1808" : "#e8c890" }}>{label}</button>
              ))}
            </div>
            {(tab === "casa" || tab === "deco" || tab === "arcade") && (
              <div className="grid grid-cols-4 gap-1.5">
                {catalog.map((f) => (
                  <button key={f.id} onClick={() => buyF(f.id)} className="rounded-lg border p-1 text-left" style={{ background: "#3a2010", borderColor: "#1a0c04" }}>
                    <FurnitureArt id={f.id} w={56} h={36} />
                    <div className="font-display font-bold text-[10px] text-amber-100 leading-tight">{f.name}</div>
                    <div className="font-display text-[9px] text-amber-200/75">{f.price} · x{countOf(f.id)}</div>
                  </button>
                ))}
              </div>
            )}
            {tab === "pared" && (
              <div className="grid grid-cols-4 gap-1.5">
                {WALLS.map((w) => (
                  <button key={w.id} onClick={() => paintWall(w.id)} className="rounded-lg border p-1 h-16" style={{ background: `linear-gradient(180deg,${w.a},${w.b})`, borderColor: walls[flNow] === w.id ? "#ffd27a" : "#1a0c04" }}>
                    <div className="font-display font-bold text-[10px] text-[#2a1408] bg-white/50 rounded px-1">{w.name}</div>
                  </button>
                ))}
              </div>
            )}
            {tab === "piso" && (
              <div className="grid grid-cols-4 gap-1.5">
                {FLOORINGS.map((f) => (
                  <button key={f.id} onClick={() => paintFloor(f.id)} className="rounded-lg border p-1 h-16" style={{ background: `repeating-linear-gradient(90deg,${f.a} 0 10px,${f.b} 10px 20px)`, borderColor: floors[flNow] === f.id ? "#ffd27a" : "#1a0c04" }}>
                    <div className="font-display font-bold text-[10px] text-[#fff8e8] bg-black/35 rounded px-1">{f.name}</div>
                  </button>
                ))}
              </div>
            )}
            {tab === "amigo" && PALS.map((p) => {
              const own = ownedP.includes(p.id);
              return (
                <button key={p.id} disabled={own || crumbs < p.price} onClick={() => buyP(p.id, p.price)}
                  className="w-full text-left rounded-lg border p-2 flex items-center gap-2 mb-1.5 disabled:opacity-50" style={{ background: "#3a2010", borderColor: own ? "#7fc24a" : "#1a0c04" }}>
                  <div className="w-10 h-12">{p.id === "maria" ? <Maria size={50} /> : <Abu size={50} />}</div>
                  <div>
                    <div className="font-display font-bold text-amber-100">{p.name}</div>
                    <div className="font-display text-[11px] text-amber-200/80">{own ? "En casa" : `${p.blurb} · ${p.price}`}</div>
                  </div>
                </button>
              );
            })}
            <p className="mt-2 font-display text-[11px] text-amber-100/60 text-center">Pared y piso se aplican al piso donde está Maxine.</p>
          </div>
        </div>
      )}

      {arcade && <ArcadePlay game={arcade} onEarn={onEarn} onClose={() => setArcade(null)} />}
    </div>
  );
}

function Pad({ label, onDown, onUp, gold, dim }: { label: string; onDown: () => void; onUp: () => void; gold?: boolean; dim?: boolean }) {
  return (
    <button
      className="w-11 h-11 font-pixel text-[14px]"
      style={{ background: gold ? "#e8b45a" : dim ? "#4a2e18" : "#3a2010", color: gold ? "#2a1408" : "#fff3d6", border: "2px solid #1a0c04", boxShadow: "2px 2px 0 #100804", borderRadius: 2 }}
      onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp}
    >{label}</button>
  );
}

function StorySkin({ fl, wall, floor, tilesW, build }: { fl: 0 | 1 | 2; wall: WallId; floor: FloorId; tilesW: number; build: boolean }) {
  const wdef = WALLS.find((w) => w.id === wall) ?? WALLS[0];
  const fdef = FLOORINGS.find((f) => f.id === floor) ?? FLOORINGS[0];
  const top = standY(fl) - ROOF + 2 - (STORY - 10);
  const brick = wall === "ladrillo";
  const stripes = wall === "rayas";
  const bg = brick
    ? `repeating-linear-gradient(0deg,${wdef.a} 0 12px,${wdef.b} 12px 14px)`
    : stripes
      ? `repeating-linear-gradient(90deg,${wdef.a} 0 10px,${wdef.b} 10px 14px)`
      : `linear-gradient(180deg,${wdef.a},${wdef.b})`;
  const board = floor === "damero"
    ? `repeating-conic-gradient(${fdef.a} 0% 25%, ${fdef.b} 0% 50%)`
    : `repeating-linear-gradient(90deg,${fdef.a} 0 14px,${fdef.b} 14px 16px)`;
  return (
    <div className="absolute inset-x-0" style={{ top, height: STORY - 6, background: bg }}>
      <div className="absolute right-3 top-3 w-11 h-14 border-[3px]" style={{ borderColor: "#4a2814", background: "linear-gradient(#7eb7e8,#f0b060)" }}>
        <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[#4a2814]" />
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#4a2814]" />
      </div>
      {build && Array.from({ length: tilesW }).map((_, i) => (
        <div key={i} className="absolute inset-y-0" style={{ left: i * TILE, width: TILE, borderRight: "1px solid #00000012" }} />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-3" style={{ background: board, backgroundSize: floor === "damero" ? "12px 12px" : undefined, boxShadow: "0 -2px 0 #2a1408" }} />
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "#6a3a18" }} />
    </div>
  );
}

function Piece({ p, origin, houseL }: { p: PlacedFurn; origin: number; houseL: number }) {
  const d = furnById(p.id);
  const { w, h } = span(p.id, p.rot);
  const wall = d.slot === "wall";
  const left = origin - houseL + p.gx * TILE;
  const top = standY(p.floor) - ROOF + 2 - (wall ? h * TILE + 16 : h * TILE);
  return (
    <div className="absolute" style={{ left, top, width: w * TILE, height: h * TILE, zIndex: d.slot === "rug" ? 1 : 2 }}>
      {d.id === "lampara" && <div className="absolute -inset-3 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#ffe08a55,transparent 70%)" }} />}
      <FurnitureArt id={p.id} w={w * TILE} h={h * TILE} />
    </div>
  );
}
