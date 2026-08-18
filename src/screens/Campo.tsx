import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { Crown } from "../art/Decor";
import { Plushie, type ToolId } from "../art/Plushie";
import type { SkinId } from "../data/skins";
import { FIELD_SECRETS } from "../data/secrets";
import { AREAS, AREA_LIST, type AreaId } from "../data/areas";
import PawButton from "../ui/PawButton";

const COLS = 48;
const ROWS = 22;
const TILE = 20;
const VW = 360;
const VH = 640;
const PW = 18;
const PH = 24;
const G = 1500;
const JUMP = 430;

type Cell = 0 | 1 | 2 | 3 | 4 | 5;

interface Props {
  skin: SkinId;
  owned: SkinId[];
  ownedTools: ToolId[];
  crumbs: number;
  onFindSkin: (id: SkinId) => void;
  onFindTool: (id: ToolId) => void;
  onEarn: (n: number) => void;
  onBack: () => void;
}

const SECRETS_IN: Partial<Record<AreaId, string[]>> = {
  A1: ["lodo"],
  B1: ["exploradora"],
  C1: ["hueso"],
  D1: ["hada"],
  E1: ["casco", "pico"],
  F1: ["llanta"],
};

function surfaceAt(c: number, area: AreaId) {
  const base = area === "C1" || area === "E1" ? 10 : 14;
  return base + Math.round(Math.sin(c * 0.18 + area.charCodeAt(0)) * 2.2);
}

function buildArea(area: AreaId) {
  const grid: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      const s = surfaceAt(c, area);
      if (c === 0 || c === COLS - 1) row.push(2);
      else if (r < s) row.push(0);
      else if (r === s) row.push(area === "B1" || area === "F1" ? 4 : 3);
      else if (r < s + 5) row.push(1);
      else row.push(2);
    }
    grid.push(row);
  }
  if (area === "C1" || area === "E1") {
    for (let r = 12; r < 18; r++) for (let c = 16; c < 34; c++) grid[r][c] = 0;
  }
  for (const c of [10, 22, 34]) {
    const s = surfaceAt(c, area);
    if (grid[s - 1]) grid[s - 1][c] = 5;
  }
  return grid;
}

export default function Campo({ skin, owned, ownedTools, crumbs, onFindSkin, onFindTool, onEarn, onBack }: Props) {
  const [area, setArea] = useState<AreaId>("A1");
  const [mapOn, setMapOn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [visited, setVisited] = useState<AreaId[]>(["A1"]);
  const grid = useRef(buildArea("A1"));
  const p = useRef({ x: 4 * TILE, y: 10 * TILE, vx: 0, vy: 0, on: false, face: 1 as 1 | -1, prevY: 0, dig: 0 });
  const cam = useRef({ x: 0, y: 0 });
  const input = useRef({ l: false, r: false, jump: false, dig: false });
  const taken = useRef<Set<string>>(new Set(
    FIELD_SECRETS.filter((s) => (s.skin && owned.includes(s.skin)) || (s.tool && ownedTools.includes(s.tool))).map((s) => s.id),
  ));
  const [, setTick] = useState(0);

  const go = (next: AreaId, from: "left" | "right") => {
    setArea(next);
    setVisited((v) => v.includes(next) ? v : [...v, next]);
    grid.current = buildArea(next);
    p.current.x = from === "right" ? 3 * TILE : (COLS - 5) * TILE;
    p.current.y = (surfaceAt(4, next) - 2) * TILE;
    p.current.vy = 0;
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const solid = (c: Cell) => c === 1 || c === 2 || c === 3 || c === 4 || c === 5;
    const get = (r: number, c: number): Cell => {
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return 2;
      return grid.current[r][c];
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const pl = p.current;
      pl.prevY = pl.y;
      pl.dig = Math.max(0, pl.dig - dt);
      const dir = (input.current.r ? 1 : 0) - (input.current.l ? 1 : 0);
      if (dir) pl.face = dir as 1 | -1;
      pl.vx = dir * 190;
      pl.x += pl.vx * dt;
      {
        const top = Math.floor(pl.y / TILE); const bot = Math.floor((pl.y + PH - 1) / TILE);
        if (pl.vx > 0) {
          const col = Math.floor((pl.x + PW) / TILE);
          for (let r = top; r <= bot; r++) if (solid(get(r, col))) { pl.x = col * TILE - PW - 0.1; pl.vx = 0; break; }
        } else if (pl.vx < 0) {
          const col = Math.floor(pl.x / TILE);
          for (let r = top; r <= bot; r++) if (solid(get(r, col))) { pl.x = (col + 1) * TILE + 0.1; pl.vx = 0; break; }
        }
      }
      if (input.current.jump) { input.current.jump = false; if (pl.on) { pl.vy = -JUMP; pl.on = false; } }
      if (input.current.dig) {
        input.current.dig = false;
        const pc = Math.floor((pl.x + PW / 2) / TILE); const pr = Math.floor((pl.y + PH / 2) / TILE);
        const rr = pr + 1, cc = pc;
        if (cc > 0 && cc < COLS - 1 && rr < ROWS) {
          const cell = get(rr, cc);
          if (cell === 1 || cell === 3 || cell === 4 || cell === 5 || cell === 2) {
            grid.current[rr][cc] = 0; pl.dig = 0.16; onEarn(1);
          }
        }
      }
      pl.vy += G * dt; if (pl.vy > 560) pl.vy = 560;
      pl.y += pl.vy * dt; pl.on = false;
      {
        const left = Math.floor(pl.x / TILE); const right = Math.floor((pl.x + PW - 1) / TILE);
        if (pl.vy >= 0) {
          const row = Math.floor((pl.y + PH) / TILE);
          for (let c = left; c <= right; c++) if (solid(get(row, c))) { pl.y = row * TILE - PH - 0.4; pl.vy = 0; pl.on = true; break; }
        }
      }
      const def = AREAS[area];
      if (pl.x < TILE * 2 && def.left) go(def.left, "left");
      if (pl.x > (COLS - 3) * TILE && def.right) go(def.right, "right");
      if (pl.y > ROWS * TILE) { pl.y = (surfaceAt(8, area) - 2) * TILE; pl.vy = 0; }

      const idsHere = SECRETS_IN[area] ?? [];
      for (const id of idsHere) {
        if (taken.current.has(id)) continue;
        const sec = FIELD_SECRETS.find((s) => s.id === id);
        if (!sec) continue;
        const sx = 22 * TILE, sy = (surfaceAt(22, area) - 1) * TILE;
        if (Math.abs(pl.x - sx) < 20 && Math.abs(pl.y - sy) < 22) {
          taken.current.add(id);
          if (sec.skin) onFindSkin(sec.skin);
          if (sec.tool) onFindTool(sec.tool);
          onEarn(12);
          setToast(`¡${sec.title}!`);
          window.setTimeout(() => setToast(null), 2800);
        }
      }

      cam.current.x += (pl.x + PW / 2 - VW / 2 - cam.current.x) * Math.min(1, dt * 7);
      cam.current.y += (pl.y + PH / 2 - VH * 0.55 - cam.current.y) * Math.min(1, dt * 7);
      cam.current.x = Math.max(0, Math.min(cam.current.x, COLS * TILE - VW));
      cam.current.y = Math.max(0, Math.min(cam.current.y, ROWS * TILE - VH + 8));
      setTick((n) => (n + 1) & 0xffff);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a") input.current.l = true;
      if (e.key === "ArrowRight" || e.key === "d") input.current.r = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { input.current.jump = true; e.preventDefault(); }
      if (e.key === "ArrowDown" || e.key === "s") input.current.dig = true;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") input.current.l = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [area, onEarn, onFindSkin, onFindTool]);

  const pad = useRef({ x: 0, y: 0, id: -1, jumped: false, dug: false });
  const onPadDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    pad.current = { x: e.clientX, y: e.clientY, id: e.pointerId, jumped: false, dug: false };
  };
  const onPadMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pad.current.id !== e.pointerId) return;
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.abs(dx) > 14) { input.current.l = dx < 0; input.current.r = dx > 0; }
    if (dy < -34 && !pad.current.jumped) { input.current.jump = true; pad.current.jumped = true; }
    if (dy > 34 && !pad.current.dug) { input.current.dig = true; pad.current.dug = true; }
  };
  const onPadUp = () => { input.current.l = false; input.current.r = false; pad.current.id = -1; };

  const def = AREAS[area];
  const pl = p.current;
  const pose: Pose = pl.dig > 0 ? "dig" : !pl.on && pl.vy > 40 ? "fall" : "idle";
  const c0 = Math.floor(cam.current.x / TILE) - 1;
  const c1 = Math.floor((cam.current.x + VW) / TILE) + 1;
  const r0 = Math.floor(cam.current.y / TILE) - 1;
  const r1 = Math.floor((cam.current.y + VH) / TILE) + 1;
  const hereSecrets = (SECRETS_IN[area] ?? []).filter((id) => !taken.current.has(id));

  return (
    <div className="absolute inset-0 overflow-hidden select-none" style={{ background: def.sky }}>
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <button onClick={() => setMapOn(true)} className="btn-3d font-display font-bold text-[13px] px-3 py-2 rounded-xl border-2 border-b-4" style={{ background: "#1a3a5a", color: "#7fd0ff", borderColor: "#0a2030" }}>Mapa</button>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-3 py-2">
          <Crown size={16} /><span className="font-display font-bold text-[15px] text-amber-200">{crumbs}</span>
        </div>
      </div>
      <div className="absolute top-[52px] left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <div className="font-display font-bold text-amber-50 text-[15px]" style={{ textShadow: "0 2px 0 #102" }}>{def.tag} · {def.name}</div>
        <div className="font-display text-[11px] text-amber-100/85 bg-black/35 rounded-full px-2 py-0.5 mt-0.5">{def.hint}</div>
      </div>

      <div className="absolute inset-0" style={{ transform: `translate3d(${-cam.current.x}px, ${-cam.current.y}px, 0)` }}>
        {Array.from({ length: Math.max(0, r1 - r0 + 1) }).flatMap((_, ir) => {
          const r = r0 + ir;
          if (r < 0 || r >= ROWS) return [];
          return Array.from({ length: Math.max(0, c1 - c0 + 1) }).map((__, ic) => {
            const c = c0 + ic;
            if (c < 0 || c >= COLS) return null;
            const cell = grid.current[r][c];
            if (cell === 0) return null;
            return <Tile key={`${r}-${c}`} c={c} r={r} cell={cell} dirt={def.dirt} grass={def.grass} />;
          });
        })}
        {hereSecrets.map((id) => {
          const sec = FIELD_SECRETS.find((s) => s.id === id);
          if (!sec) return null;
          return (
            <div key={id} className="absolute hop" style={{ left: 22 * TILE - 8, top: (surfaceAt(22, area) - 1) * TILE - 10 }}>
              {sec.tool ? <Plushie id={sec.tool} size={22} /> : <div className="w-6 h-6 rounded-md border-2 border-amber-200" style={{ background: "#ffd27a" }} />}
            </div>
          );
        })}
        {def.left && <div className="absolute font-display font-bold text-amber-100/70 text-[12px]" style={{ left: 28, top: surfaceAt(3, area) * TILE - 40 }}>← {AREAS[def.left].tag}</div>}
        {def.right && <div className="absolute font-display font-bold text-amber-100/70 text-[12px]" style={{ left: (COLS - 6) * TILE, top: surfaceAt(COLS - 4, area) * TILE - 40 }}>{AREAS[def.right].tag} →</div>}
        <div className="absolute" style={{ left: pl.x - 6, top: pl.y - 10 }}>
          <Maxine skin={skin} pose={pose} facing={pl.face} size={PW + 18} />
        </div>
      </div>

      <div className="absolute inset-0 z-20" style={{ touchAction: "none" }}
        onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
      <PawButton onPress={() => { input.current.dig = true; }} />

      {toast && (
        <div className="absolute left-3 right-3 z-40" style={{ top: 96 }}>
          <div className="rounded-xl border-2 border-amber-300/50 bg-black/80 px-3 py-2 text-center font-display font-bold text-amber-50">{toast}</div>
        </div>
      )}

      {mapOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
          <div className="w-full rounded-2xl border-2 border-[#3a8ab0] p-3" style={{ background: "#0a1830" }}>
            <div className="font-display font-bold text-[#7fd0ff] text-center mb-2">Mapa del campo</div>
            <div className="grid grid-cols-3 gap-2">
              {AREA_LIST.map((id) => {
                const a = AREAS[id];
                const seen = visited.includes(id);
                return (
                  <button key={id} disabled={!seen} onClick={() => { if (seen) { go(id, "right"); setMapOn(false); } }}
                    className="rounded-lg border-2 py-2 font-display font-bold text-[13px] disabled:opacity-40"
                    style={{ background: id === area ? "#2a6a8a" : "#12243a", color: "#d8f4ff", borderColor: seen ? "#4aa0c8" : "#1a3048" }}>
                    {seen ? `${a.tag} ${a.name}` : "???"}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setMapOn(false)} className="btn-3d mt-3 w-full font-display font-bold py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ c, r, cell, dirt, grass }: { c: number; r: number; cell: Cell; dirt: string; grass: string }) {
  const x = c * TILE, y = r * TILE;
  if (cell === 4) {
    return (
      <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE }}>
        <svg width={TILE} height={TILE} viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#1a1a1a" /><circle cx="10" cy="10" r="4" fill="#3a2410" /></svg>
      </div>
    );
  }
  if (cell === 5) return <div className="absolute" style={{ left: x + 2, top: y + 8, width: TILE - 4, height: 6, background: "#6a3a14" }} />;
  if (cell === 2) return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#6a6a72" }} />;
  if (cell === 3) return (
    <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }}>
      <div className="absolute inset-x-0 top-0 h-2" style={{ background: grass }} />
    </div>
  );
  return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }} />;
}
