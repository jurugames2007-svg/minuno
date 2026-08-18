import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { Crown, Flour } from "../art/Decor";
import { Plushie, type ToolId } from "../art/Plushie";
import type { SkinId } from "../data/skins";
import { FIELD_SECRETS, type FieldSecret } from "../data/secrets";
import PawButton from "../ui/PawButton";

const COLS = 118;
const ROWS = 38;
const TILE = 20;
const VW = 360;
const VH = 640;
const PW = 18;
const PH = 24;
const G = 1500;
const JUMP = 430;

type Cell = 0 | 1 | 2 | 3 | 4 | 5;

interface Pickup {
  id: string;
  x: number;
  y: number;
  secret: FieldSecret;
  taken: boolean;
}

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

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function surfaceAt(c: number) {
  const hill = Math.sin(c * 0.11) * 3.2 + Math.sin(c * 0.27) * 1.6;
  return 16 + Math.round(hill);
}

function buildWorld() {
  const R = mulberry(20260818);
  const grid: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      const s = surfaceAt(c);
      if (r < s) row.push(0);
      else if (r === s) row.push(3);
      else if (r < s + 7) row.push(1);
      else row.push(R() < 0.18 ? 2 : 1);
    }
    grid.push(row);
  }
  const carve = (cx: number, cy: number, rw: number, rh: number) => {
    for (let r = cy; r < cy + rh; r++) for (let c = cx; c < cx + rw; c++) {
      if (r > 0 && r < ROWS && c > 1 && c < COLS - 1) grid[r][c] = 0;
    }
  };
  carve(28, 22, 14, 6);
  carve(52, 24, 10, 7);
  carve(78, 21, 16, 8);
  carve(40, 18, 5, 10);
  for (const c of [12, 24, 36, 48, 61, 74, 88, 102]) {
    const s = surfaceAt(c);
    if (grid[s - 1]) grid[s - 1][c] = 4;
    if (c % 24 === 0 && grid[s - 2]) grid[s - 2][c] = 4;
  }
  for (const c of [18, 55, 70]) {
    const s = surfaceAt(c);
    for (let h = 1; h <= 4; h++) if (grid[s - h]) grid[s - h][c] = 5;
    if (grid[s - 5]) { grid[s - 5][c] = 5; grid[s - 5][c + 1] = 5; }
  }
  const pickups: Pickup[] = [
    { id: "lodo", x: 18 * TILE + 4, y: (surfaceAt(18) - 1) * TILE - 6, secret: FIELD_SECRETS[0], taken: false },
    { id: "hueso", x: 34 * TILE + 6, y: 25 * TILE + 4, secret: FIELD_SECRETS[4], taken: false },
    { id: "exploradora", x: 61 * TILE + 2, y: (surfaceAt(61) - 3) * TILE - 4, secret: FIELD_SECRETS[1], taken: false },
    { id: "pico", x: 86 * TILE + 4, y: 27 * TILE + 2, secret: FIELD_SECRETS[5], taken: false },
    { id: "llanta", x: 102 * TILE + 2, y: (surfaceAt(102) - 2) * TILE - 4, secret: FIELD_SECRETS[2], taken: false },
    { id: "hada", x: 55 * TILE + 2, y: (surfaceAt(55) - 6) * TILE, secret: FIELD_SECRETS[3], taken: false },
    { id: "casco", x: 42 * TILE + 4, y: 28 * TILE, secret: FIELD_SECRETS[6], taken: false },
  ];
  return { grid, pickups };
}

export default function Campo({ skin, owned, ownedTools, crumbs, onFindSkin, onFindTool, onEarn, onBack }: Props) {
  const built = useRef(buildWorld());
  const grid = useRef(built.current.grid);
  const pickups = useRef(built.current.pickups.map((p) => {
    const have = (p.secret.skin && owned.includes(p.secret.skin)) || (p.secret.tool && ownedTools.includes(p.secret.tool));
    return { ...p, taken: !!have };
  }));
  const p = useRef({ x: 8 * TILE, y: (surfaceAt(8) - 2) * TILE, vx: 0, vy: 0, on: false, face: 1 as 1 | -1, prevY: 0, dig: 0 });
  const cam = useRef({ x: 0, y: 0 });
  const input = useRef({ l: false, r: false, jump: false, dig: false });
  const [, setTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [found, setFound] = useState(() => pickups.current.filter((q) => q.taken).length);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const solid = (c: Cell) => c === 1 || c === 2 || c === 3 || c === 4 || c === 5;
    const get = (r: number, c: number): Cell => {
      if (c < 0 || c >= COLS || r < 0) return 2;
      if (r >= ROWS) return 2;
      return grid.current[r][c];
    };
    const set = (r: number, c: number, v: Cell) => {
      if (r >= 0 && r < ROWS && c > 0 && c < COLS - 1) grid.current[r][c] = v;
    };
    const tryDig = () => {
      const pl = p.current;
      const pc = Math.floor((pl.x + PW / 2) / TILE);
      const pr = Math.floor((pl.y + PH / 2) / TILE);
      const targets: [number, number][] = [[pr + 1, pc], [pr, pc + pl.face], [pr + 1, pc + pl.face]];
      let broke = false;
      for (const [rr, cc] of targets) {
        const cell = get(rr, cc);
        if (cell === 1 || cell === 3 || cell === 4 || cell === 5) {
          set(rr, cc, 0); broke = true;
          if (cell === 4 && Math.random() < 0.35) onEarn(2);
        } else if (cell === 2) {
          set(rr, cc, 0); broke = true;
        }
      }
      if (broke) { pl.dig = 0.16; onEarn(1); }
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
      pl.x = Math.max(TILE, Math.min(pl.x, COLS * TILE - TILE - PW));
      if (input.current.jump) { input.current.jump = false; if (pl.on) { pl.vy = -JUMP; pl.on = false; } }
      if (input.current.dig) { input.current.dig = false; tryDig(); }
      pl.vy += G * dt; if (pl.vy > 560) pl.vy = 560;
      pl.y += pl.vy * dt; pl.on = false;
      {
        const left = Math.floor(pl.x / TILE); const right = Math.floor((pl.x + PW - 1) / TILE);
        if (pl.vy < 0) {
          const hrow = Math.floor(pl.y / TILE);
          for (let c = left; c <= right; c++) if (solid(get(hrow, c))) { pl.y = (hrow + 1) * TILE + 0.2; pl.vy = 0; break; }
        }
        if (pl.vy >= 0) {
          const row = Math.floor((pl.y + PH) / TILE);
          for (let c = left; c <= right; c++) {
            if (solid(get(row, c))) {
              pl.y = row * TILE - PH - 0.4; pl.vy = 0; pl.on = true; break;
            }
          }
        }
      }
      if (pl.y > ROWS * TILE) { pl.y = (surfaceAt(8) - 2) * TILE; pl.x = 8 * TILE; pl.vy = 0; }

      for (const pk of pickups.current) {
        if (pk.taken) continue;
        if (Math.abs(pk.x - (pl.x + PW / 2)) < 16 && Math.abs(pk.y - (pl.y + PH / 2)) < 16) {
          pk.taken = true;
          if (pk.secret.skin) onFindSkin(pk.secret.skin);
          if (pk.secret.tool) onFindTool(pk.secret.tool);
          onEarn(12);
          setFound((n) => n + 1);
          setToast(`¡${pk.secret.title}! ${pk.secret.blurb}`);
          window.setTimeout(() => setToast(null), 3200);
        }
      }

      const tx = pl.x + PW / 2 - VW / 2;
      const ty = pl.y + PH / 2 - VH * 0.55;
      cam.current.x += (tx - cam.current.x) * Math.min(1, dt * 7);
      cam.current.y += (ty - cam.current.y) * Math.min(1, dt * 7);
      cam.current.x = Math.max(0, Math.min(cam.current.x, COLS * TILE - VW));
      cam.current.y = Math.max(0, Math.min(cam.current.y, ROWS * TILE - VH + 20));
      setTick((n) => (n + 1) & 0xffff);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.l = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.r = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { input.current.jump = true; e.preventDefault(); }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") input.current.dig = true;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.l = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.r = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [onEarn, onFindSkin, onFindTool]);

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

  const pl = p.current;
  const pose: Pose = pl.dig > 0 ? "dig" : !pl.on && pl.vy > 40 ? "fall" : "idle";
  const c0 = Math.floor(cam.current.x / TILE) - 1;
  const c1 = Math.floor((cam.current.x + VW) / TILE) + 1;
  const r0 = Math.floor(cam.current.y / TILE) - 1;
  const r1 = Math.floor((cam.current.y + VH) / TILE) + 1;
  const hiddenLeft = FIELD_SECRETS.length - found;

  return (
    <div className="absolute inset-0 overflow-hidden select-none" style={{ background: "linear-gradient(180deg,#7ec8ff 0%,#c8e8a0 42%,#6a4a22 42%,#3a2410 100%)" }}>
      <Flour count={8} />
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-3 py-2">
          <Crown size={16} /><span className="font-display font-bold text-[15px] text-amber-200">{crumbs}</span>
        </div>
      </div>
      <div className="absolute top-[52px] left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <div className="font-display font-bold text-amber-50 text-[15px]" style={{ textShadow: "0 2px 0 #3a2010" }}>Campo de llantas</div>
        <div className="font-display text-[11px] text-amber-100/85 bg-black/35 rounded-full px-2 py-0.5 mt-0.5">
          Secretos {found}/{FIELD_SECRETS.length}{hiddenLeft > 0 ? ` · ${hiddenLeft} ocultos` : " · ¡todo hallado!"}
        </div>
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
            return <FieldTile key={`${r}-${c}`} c={c} r={r} cell={cell} />;
          });
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const x = (14 + i * 16) * TILE;
          const s = surfaceAt(14 + i * 16);
          return <Tree key={i} x={x} y={s * TILE} />;
        })}
        {pickups.current.filter((pk) => !pk.taken).map((pk) => (
          <div key={pk.id} className="absolute hop" style={{ left: pk.x - 10, top: pk.y - 10 }}>
            {pk.secret.tool ? <Plushie id={pk.secret.tool} size={22} /> : (
              <div className="w-6 h-6 rounded-md border-2 border-amber-200" style={{ background: "radial-gradient(circle,#ffd27a,#c9842a)" }} />
            )}
          </div>
        ))}
        <div className="absolute" style={{ left: pl.x - 6, top: pl.y - 10 }}>
          <Maxine skin={skin} pose={pose} facing={pl.face} size={PW + 18} />
        </div>
      </div>

      <div className="absolute inset-0 z-20" style={{ touchAction: "none" }}
        onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
      <PawButton onPress={() => { input.current.dig = true; }} />

      {toast && (
        <div className="absolute left-3 right-3 z-40 slide-up" style={{ top: 96 }}>
          <div className="rounded-xl border-2 border-amber-300/50 bg-black/80 px-3 py-2 text-center">
            <div className="font-pixel text-[8px] text-amber-200/70">SECRETO</div>
            <div className="font-display font-bold text-amber-50 text-[14px] leading-snug">{toast}</div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none font-display text-[10px] text-amber-50/70 bg-black/40 px-2 py-0.5 rounded-full">
        Corré · saltá · huella cava · husmeá las llantas
      </div>
    </div>
  );
}

function FieldTile({ c, r, cell }: { c: number; r: number; cell: Cell }) {
  const x = c * TILE, y = r * TILE;
  if (cell === 4) {
    return (
      <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE }}>
        <svg width={TILE} height={TILE} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8.2" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="1" />
          <circle cx="10" cy="10" r="4.2" fill="#3a2410" stroke="#6a6a6a" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="1.6" fill="#2a1a08" />
        </svg>
      </div>
    );
  }
  if (cell === 5) {
    return <div className="absolute" style={{ left: x + 2, top: y + 8, width: TILE - 4, height: 6, background: "#6a3a14", borderRadius: 2, boxShadow: "0 2px 0 #2a1408" }} />;
  }
  if (cell === 2) {
    return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#8a8a90", boxShadow: "inset 0 -3px 0 #5a5a62, inset 0 2px 0 #c8c8d0" }} />;
  }
  if (cell === 3) {
    return (
      <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#6a3a14", boxShadow: "inset 0 -3px 0 #3a2010" }}>
        <div className="absolute inset-x-0 top-0 h-2" style={{ background: "#4a9a2a" }} />
        <div className="absolute left-1 top-0 w-1.5 h-2.5 rounded-sm" style={{ background: "#3a7a1a" }} />
      </div>
    );
  }
  return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#8a5420", boxShadow: "inset 0 -3px 0 #5a3010, inset 0 2px 0 #c9842a44" }} />;
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x - 10, top: y - 36, width: 28, height: 40 }}>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2 h-5" style={{ background: "#5a3216" }} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-8 h-8 rounded-full" style={{ background: "#3a7a1a" }} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-6 h-6 rounded-full" style={{ background: "#4a9a2a" }} />
    </div>
  );
}
