import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { Crown, Heart } from "../art/Decor";
import { Plushie, type ToolId } from "../art/Plushie";
import { Maria, Lina, Tico, Nube, HadaNpc, DonLlanta } from "../art/Folk";
import type { SkinId } from "../data/skins";
import { FIELD_SECRETS } from "../data/secrets";
import { AREAS, type AreaId } from "../data/areas";
import { CAMPO_STORY, NPCS, PICKUPS, QUESTS, type QuestId, type QuestState } from "../data/campoStory";
import PawButton from "../ui/PawButton";

const COLS = 96;
const ICOLS = 32;
const ROWS = 26;
const TILE = 18;
const VW = 360;
const VH = 640;
const PW = 18;
const PH = 24;
const G = 1550;
const JUMP = 450;

type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  A1: ["lodo"], B1: ["exploradora"], C1: ["hueso"], D1: ["hada"], E1: ["casco", "pico"], F1: ["llanta"],
};

type QLog = Record<QuestId, { state: QuestState; n: number }>;

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

function emptyQuests(): QLog {
  return {
    cesta: { state: "active", n: 0 }, cinta: { state: "idle", n: 0 }, tornillos: { state: "idle", n: 0 },
    huesos: { state: "idle", n: 0 }, hada: { state: "idle", n: 0 }, casco: { state: "idle", n: 0 },
  };
}

function surfaceAt(c: number, area: AreaId) {
  const z = AREAS[area].zone;
  const base = z === "C" || z === "E" ? 18 : 20;
  return base + Math.round(Math.sin(c * 0.11 + area.charCodeAt(0) + AREAS[area].depth) * 1.6);
}

function fill(grid: Cell[][], r0: number, c0: number, r1: number, c1: number, cell: Cell) {
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
    if (r >= 0 && r < ROWS && c >= 0 && c < grid[0].length) grid[r][c] = cell;
  }
}

function emptyGrid(cols: number) {
  const grid: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(cols).fill(0) as Cell[]);
  return grid;
}

function buildArea(area: AreaId) {
  const def = AREAS[area];
  const metal = def.zone === "B" || def.zone === "F";
  const grid = emptyGrid(COLS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const s = surfaceAt(c, area);
      if (c === 0 || c === COLS - 1) grid[r][c] = 2;
      else if (r < s) grid[r][c] = 0;
      else if (r === s) grid[r][c] = metal ? 4 : 3;
      else if (r < s + 4) grid[r][c] = 1;
      else grid[r][c] = 2;
    }
  }
  const plat = (r: number, a: number, b: number) => fill(grid, r, a, r, b, 6);
  const n = def.depth;
  plat(16 - (n % 3), 10, 18);
  plat(13, 28, 40);
  plat(11, 48, 60);
  plat(15, 68, 80);
  plat(9, 36, 46);
  plat(18, 82, 92);
  if (def.shape === "cave" || def.shape === "grotto" || def.shape === "pit") {
    fill(grid, 8, 16, 17, 72, 0);
    plat(16, 18, 30); plat(12, 40, 54); plat(9, 60, 74);
  }
  if (def.shape === "shaft") {
    fill(grid, 6, 30, 20, 58, 0);
    plat(18, 12, 24); plat(14, 32, 44); plat(10, 50, 64);
  }
  if (def.down) fill(grid, 20, 6, 25, 9, 0);
  return grid;
}

function buildInterior(): Cell[][] {
  const grid = emptyGrid(ICOLS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < ICOLS; c++) {
      if (c === 0 || c === ICOLS - 1 || r === ROWS - 1 || r < 8) grid[r][c] = 2;
      else if (r >= 20) grid[r][c] = 3;
      else grid[r][c] = 0;
    }
  }
  fill(grid, 16, 8, 16, 14, 6);
  fill(grid, 13, 18, 13, 26, 6);
  fill(grid, 19, 4, 19, 6, 0);
  return grid;
}

interface Foe { id: number; x: number; y: number; vx: number; hp: number; kind: "mouse" | "bat" }

function foesFor(area: AreaId): Foe[] {
  const def = AREAS[area];
  const bat = def.zone === "C" || def.zone === "E";
  const n = 2 + Math.min(3, def.depth);
  const out: Foe[] = [];
  for (let i = 0; i < n; i++) {
    const col = 14 + i * 16;
    out.push({
      id: def.mapC * 20 + def.depth * 4 + i,
      x: col * TILE,
      y: (bat ? 11 : surfaceAt(col, area) - 2) * TILE,
      vx: (i % 2 === 0 ? 1 : -1) * (42 + def.depth * 7),
      hp: 1 + Math.floor(def.depth / 2),
      kind: bat ? "bat" : "mouse",
    });
  }
  return out;
}

function doorCol(area: AreaId) {
  return 22 + (AREAS[area].depth % 3) * 8;
}

export default function Campo({ skin, owned, ownedTools, crumbs, onFindSkin, onFindTool, onEarn, onBack }: Props) {
  const [area, setArea] = useState<AreaId>("A1");
  const [inside, setInside] = useState(false);
  const [mapOn, setMapOn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [visited, setVisited] = useState<AreaId[]>(() => load("maxine_visited", ["A1"]));
  const [storyOn, setStoryOn] = useState(() => !load("maxine_campo_story", false));
  const [talk, setTalk] = useState<{ name: string; line: string } | null>(null);
  const [quests, setQuests] = useState<QLog>(() => load("maxine_quests", emptyQuests()));
  const [hp, setHp] = useState(5);
  const [logOn, setLogOn] = useState(false);
  const grid = useRef(buildArea("A1"));
  const foes = useRef<Foe[]>(foesFor("A1"));
  const p = useRef({ x: 8 * TILE, y: 10 * TILE, vx: 0, vy: 0, on: false, face: 1 as 1 | -1, dig: 0, atk: 0, inv: 0 });
  const cam = useRef({ x: 0, y: 0 });
  const input = useRef({ l: false, r: false, jump: false, dig: false, atk: false, down: false });
  const taken = useRef<Set<string>>(new Set(
    FIELD_SECRETS.filter((s) => (s.skin && owned.includes(s.skin)) || (s.tool && ownedTools.includes(s.tool))).map((s) => s.id),
  ));
  const loot = useRef<Set<string>>(new Set(load<string[]>("maxine_loot", [])));
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_visited", visited), [visited]);
  useEffect(() => save("maxine_quests", quests), [quests]);

  const colsNow = () => (inside ? ICOLS : COLS);

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2200);
  };

  const go = (next: AreaId, from: "left" | "right" | "up" | "down") => {
    setInside(false);
    setArea(next);
    setVisited((v) => v.includes(next) ? v : [...v, next]);
    grid.current = buildArea(next);
    foes.current = foesFor(next);
    if (from === "right") p.current.x = 4 * TILE;
    else if (from === "left") p.current.x = (COLS - 6) * TILE;
    else p.current.x = 10 * TILE;
    p.current.y = (surfaceAt(10, next) - 3) * TILE;
    p.current.vy = 0;
  };

  const enter = () => {
    setInside(true);
    grid.current = buildInterior();
    foes.current = [];
    p.current.x = 6 * TILE;
    p.current.y = 17 * TILE;
    p.current.vy = 0;
  };
  const leave = () => {
    setInside(false);
    grid.current = buildArea(area);
    foes.current = foesFor(area);
    p.current.x = doorCol(area) * TILE;
    p.current.y = (surfaceAt(doorCol(area), area) - 3) * TILE;
    p.current.vy = 0;
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const solid = (c: Cell, oneWay: boolean) => c === 1 || c === 2 || c === 3 || c === 4 || c === 5 || (oneWay && c === 6);
    const get = (r: number, c: number): Cell => {
      const W = grid.current[0]?.length ?? COLS;
      if (c < 0 || c >= W || r < 0 || r >= ROWS) return 2;
      return grid.current[r][c];
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const pl = p.current;
      const W = grid.current[0]?.length ?? COLS;
      pl.dig = Math.max(0, pl.dig - dt);
      pl.atk = Math.max(0, pl.atk - dt);
      pl.inv = Math.max(0, pl.inv - dt);
      const dir = (input.current.r ? 1 : 0) - (input.current.l ? 1 : 0);
      if (dir) pl.face = dir as 1 | -1;
      pl.vx = dir * 210;
      pl.x += pl.vx * dt;
      {
        const top = Math.floor(pl.y / TILE); const bot = Math.floor((pl.y + PH - 1) / TILE);
        if (pl.vx > 0) {
          const col = Math.floor((pl.x + PW) / TILE);
          for (let r = top; r <= bot; r++) if (solid(get(r, col), false)) { pl.x = col * TILE - PW - 0.1; pl.vx = 0; break; }
        } else if (pl.vx < 0) {
          const col = Math.floor(pl.x / TILE);
          for (let r = top; r <= bot; r++) if (solid(get(r, col), false)) { pl.x = (col + 1) * TILE + 0.1; pl.vx = 0; break; }
        }
      }
      if (input.current.jump) { input.current.jump = false; if (pl.on) { pl.vy = -JUMP; pl.on = false; } }
      if (input.current.atk) { input.current.atk = false; pl.atk = 0.22; }
      if (input.current.dig) {
        input.current.dig = false;
        const pc = Math.floor((pl.x + PW / 2) / TILE); const pr = Math.floor((pl.y + PH / 2) / TILE);
        const ax = input.current.down ? 0 : pl.face;
        const ay = input.current.down ? 1 : 0;
        const rr = pr + ay, cc = pc + ax;
        if (cc > 0 && cc < W - 1 && rr >= 0 && rr < ROWS) {
          const cell = get(rr, cc);
          if (cell === 1 || cell === 3 || cell === 4 || cell === 5) {
            grid.current[rr][cc] = 0; pl.dig = 0.16; onEarn(1);
          }
        }
      }
      pl.vy += G * dt; if (pl.vy > 580) pl.vy = 580;
      pl.y += pl.vy * dt; pl.on = false;
      {
        const left = Math.floor(pl.x / TILE); const right = Math.floor((pl.x + PW - 1) / TILE);
        if (pl.vy >= 0) {
          const row = Math.floor((pl.y + PH) / TILE);
          for (let c = left; c <= right; c++) if (solid(get(row, c), true)) { pl.y = row * TILE - PH - 0.4; pl.vy = 0; pl.on = true; break; }
        } else {
          const row = Math.floor(pl.y / TILE);
          for (let c = left; c <= right; c++) if (solid(get(row, c), false)) { pl.y = (row + 1) * TILE + 0.2; pl.vy = 0; break; }
        }
      }
      if (!inside) {
        const def = AREAS[area];
        if (pl.x < TILE * 1.4 && def.left) go(def.left, "left");
        if (pl.x > (COLS - 2.2) * TILE && def.right) go(def.right, "right");
        const pc = Math.floor((pl.x + PW / 2) / TILE);
        if (def.down && input.current.down && pc >= 6 && pc <= 9 && pl.on) go(def.down, "down");
        if (def.up && pl.y < TILE * 2 && pc >= 8 && pc <= 14) go(def.up, "up");
      } else if (pl.x < TILE * 2.2 && pl.on) {
        leave();
      }
      if (pl.y > ROWS * TILE) { pl.y = 16 * TILE; pl.vy = 0; }

      for (const f of foes.current) {
        if (f.hp <= 0) continue;
        f.x += f.vx * dt;
        if (f.x < 4 * TILE || f.x > (W - 5) * TILE) f.vx *= -1;
        if (f.kind === "bat") f.y += Math.sin(now / 220 + f.id) * 0.55;
        if (pl.atk > 0) {
          const ax = pl.x + (pl.face === 1 ? PW : -16);
          if (Math.abs(f.x - ax) < 22 && Math.abs(f.y - pl.y) < 22) {
            f.hp -= 1; f.vx = pl.face * 80; f.x += pl.face * 10;
            if (f.hp <= 0) onEarn(3);
          }
        }
        if (pl.inv <= 0 && Math.abs(f.x - pl.x) < 16 && Math.abs(f.y - pl.y) < 18) {
          pl.inv = 0.9;
          setHp((h) => Math.max(0, h - 1));
          pl.vx = -pl.face * 120; pl.vy = -180;
        }
      }

      if (!inside) {
        const idsHere = SECRETS_IN[area] ?? [];
        for (const id of idsHere) {
          if (taken.current.has(id)) continue;
          const sec = FIELD_SECRETS.find((s) => s.id === id);
          if (!sec) continue;
          const sx = 40 * TILE, sy = (surfaceAt(40, area) - 1) * TILE;
          if (Math.abs(pl.x - sx) < 20 && Math.abs(pl.y - sy) < 22) {
            taken.current.add(id);
            if (sec.skin) onFindSkin(sec.skin);
            if (sec.tool) onFindTool(sec.tool);
            onEarn(12);
            flash(`¡${sec.title}!`);
          }
        }
        for (const pk of PICKUPS) {
          if (pk.area !== area || loot.current.has(pk.id)) continue;
          const sx = pk.col * TILE;
          const sy = (surfaceAt(pk.col, area) + pk.rowOff) * TILE;
          if (Math.abs(pl.x - sx) < 16 && Math.abs(pl.y - sy) < 20) {
            loot.current.add(pk.id);
            save("maxine_loot", Array.from(loot.current));
            setQuests((q) => {
              const cur = q[pk.quest];
              const n = cur.n + 1;
              const need = QUESTS[pk.quest].need;
              return { ...q, [pk.quest]: { state: n >= need ? "done" : (cur.state === "idle" ? "active" : cur.state), n } };
            });
            onEarn(4);
            flash(`¡${pk.label}!`);
          }
        }
      }

      cam.current.x += (pl.x + PW / 2 - VW / 2 - cam.current.x) * Math.min(1, dt * 8);
      cam.current.y += (pl.y + PH / 2 - VH * 0.55 - cam.current.y) * Math.min(1, dt * 8);
      cam.current.x = Math.max(0, Math.min(cam.current.x, W * TILE - VW));
      cam.current.y = Math.max(0, Math.min(cam.current.y, ROWS * TILE - VH + 8));
      setTick((n) => (n + 1) & 0xffff);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a") input.current.l = true;
      if (e.key === "ArrowRight" || e.key === "d") input.current.r = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { input.current.jump = true; e.preventDefault(); }
      if (e.key === "ArrowDown" || e.key === "s") input.current.down = true;
      if (e.key === "j" || e.key === "k") input.current.atk = true;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") input.current.l = false;
      if (e.key === "ArrowDown" || e.key === "s") input.current.down = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [area, inside, onEarn, onFindSkin, onFindTool]);

  const pad = useRef({ x: 0, y: 0, id: -1, jumped: false });
  const onPadDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    pad.current = { x: e.clientX, y: e.clientY, id: e.pointerId, jumped: false };
  };
  const onPadMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pad.current.id !== e.pointerId) return;
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.abs(dx) > 12) { input.current.l = dx < 0; input.current.r = dx > 0; }
    if (dy < -34 && !pad.current.jumped) { input.current.jump = true; pad.current.jumped = true; }
    input.current.down = dy > 28;
  };
  const onPadUp = (e: PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) input.current.atk = true;
    input.current.l = false; input.current.r = false; input.current.down = false; pad.current.id = -1;
  };

  const nearNpc = !inside ? NPCS.find((n) => n.area === area && Math.abs(p.current.x - n.col * TILE) < 28) : undefined;
  const dcol = doorCol(area);
  const nearDoor = !inside && Math.abs(p.current.x - dcol * TILE) < 22 && p.current.on;
  const speak = () => {
    if (!nearNpc) return;
    const qid = nearNpc.quest;
    if (qid) {
      const q = quests[qid];
      const qdef = QUESTS[qid];
      if (q.state === "idle") {
        setQuests((old) => ({ ...old, [qid]: { ...old[qid], state: "active" } }));
        setTalk({ name: nearNpc.name, line: nearNpc.idle[0] });
        return;
      }
      if (q.n >= qdef.need && q.state !== "done") {
        setQuests((old) => ({ ...old, [qid]: { ...old[qid], state: "done" } }));
        onEarn(qdef.crumbs);
        setTalk({ name: nearNpc.name, line: qdef.done });
        return;
      }
      if (q.state === "done") {
        setTalk({ name: nearNpc.name, line: nearNpc.idle[2] });
        return;
      }
    }
    setTalk({ name: nearNpc.name, line: nearNpc.idle[Math.floor(Math.random() * nearNpc.idle.length)] });
  };

  const def = AREAS[area];
  const pl = p.current;
  const pose: Pose = pl.dig > 0 ? "dig" : pl.atk > 0 ? "win" : !pl.on && pl.vy > 40 ? "fall" : "idle";
  const W = colsNow();
  const c0 = Math.floor(cam.current.x / TILE) - 1;
  const c1 = Math.floor((cam.current.x + VW) / TILE) + 1;
  const r0 = Math.floor(cam.current.y / TILE) - 1;
  const r1 = Math.floor((cam.current.y + VH) / TILE) + 1;
  const hereSecrets = inside ? [] : (SECRETS_IN[area] ?? []).filter((id) => !taken.current.has(id));
  const npcsHere = inside ? [] : NPCS.filter((n) => n.area === area);

  if (hp <= 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: def.sky }}>
        <div className="font-display font-bold text-[28px] text-amber-50">Maxine se cansó</div>
        <button onClick={() => { setHp(5); p.current.x = 8 * TILE; p.current.y = 8 * TILE; }} className="btn-3d mt-4 font-display font-bold px-6 py-2" style={{ background: "#ffd27a", color: "#3a1808" }}>Otra vez</button>
        <button onClick={onBack} className="mt-2 font-display text-amber-100">Menú</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden select-none" style={{ background: inside ? "#2a1c14" : def.sky }}>
      {!inside && <Sky zone={def.zone} />}
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <div className="flex gap-1">
          <button onClick={() => setLogOn(true)} className="btn-3d font-display font-bold text-[12px] px-2.5 py-2 border-2 border-b-4" style={{ background: "#3a2010", color: "#ffd27a", borderColor: "#1a0c04" }}>Misiones</button>
          <button onClick={() => setMapOn(true)} className="btn-3d font-display font-bold text-[12px] px-2.5 py-2 border-2 border-b-4" style={{ background: "#1a3a5a", color: "#7fd0ff", borderColor: "#0a2030" }}>Mapa</button>
        </div>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] px-2 py-1.5">
          <Crown size={14} /><span className="font-display font-bold text-[14px] text-amber-200">{crumbs}</span>
        </div>
      </div>
      <div className="absolute top-[50px] left-2 z-30 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => <Heart key={i} filled={i < hp} size={16} />)}
      </div>
      <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <div className="font-display font-bold text-amber-50 text-[14px]" style={{ textShadow: "0 2px 0 #102" }}>
          {inside ? "Interior" : `${def.tag} · ${def.name}`}
        </div>
      </div>

      <div className="absolute inset-0" style={{ transform: `translate3d(${-cam.current.x}px, ${-cam.current.y}px, 0)` }}>
        {Array.from({ length: Math.max(0, r1 - r0 + 1) }).flatMap((_, ir) => {
          const r = r0 + ir;
          if (r < 0 || r >= ROWS) return [];
          return Array.from({ length: Math.max(0, c1 - c0 + 1) }).map((__, ic) => {
            const c = c0 + ic;
            if (c < 0 || c >= W) return null;
            const cell = grid.current[r][c];
            if (cell === 0) return null;
            return <Tile key={`${r}-${c}`} c={c} r={r} cell={cell} dirt={def.dirt} grass={def.grass} zone={def.zone} />;
          });
        })}
        {!inside && <Hut x={dcol * TILE} y={surfaceAt(dcol, area) * TILE - 52} />}
        {hereSecrets.map((id) => {
          const sec = FIELD_SECRETS.find((s) => s.id === id);
          if (!sec) return null;
          return (
            <div key={id} className="absolute hop" style={{ left: 40 * TILE - 8, top: (surfaceAt(40, area) - 1) * TILE - 10 }}>
              {sec.tool ? <Plushie id={sec.tool} size={22} /> : <div className="w-6 h-6 border-2 border-amber-200" style={{ background: "#ffd27a" }} />}
            </div>
          );
        })}
        {!inside && PICKUPS.filter((pk) => pk.area === area && !loot.current.has(pk.id)).map((pk) => (
          <div key={pk.id} className="absolute hop" style={{ left: pk.col * TILE, top: (surfaceAt(pk.col, area) + pk.rowOff) * TILE }}>
            <div className="w-3.5 h-3.5 border-2 border-amber-100" style={{ background: "#ffd27a" }} />
          </div>
        ))}
        {npcsHere.map((n) => (
          <div key={n.id} className="absolute" style={{ left: n.col * TILE - 8, top: surfaceAt(n.col, area) * TILE - 52 }}>
            <NpcArt kind={n.kind} />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-display font-bold text-[9px] text-amber-50 bg-black/50 px-1 whitespace-nowrap">{n.name}</div>
          </div>
        ))}
        {foes.current.filter((f) => f.hp > 0).map((f) => (
          <FoeView key={f.id} f={f} />
        ))}
        {!inside && def.left && <div className="absolute font-display font-bold text-amber-50/80 text-[12px]" style={{ left: 28, top: surfaceAt(3, area) * TILE - 44 }}>← {AREAS[def.left].tag}</div>}
        {!inside && def.right && <div className="absolute font-display font-bold text-amber-50/80 text-[12px]" style={{ left: (COLS - 7) * TILE, top: surfaceAt(COLS - 4, area) * TILE - 44 }}>{AREAS[def.right].tag} →</div>}
        <div className="absolute" style={{ left: pl.x - 8, top: pl.y - 12, opacity: pl.inv > 0 ? 0.6 : 1 }}>
          <Maxine skin={skin} pose={pose} facing={pl.face} size={PW + 20} />
        </div>
      </div>

      <div className="absolute inset-0 z-20" style={{ touchAction: "none" }}
        onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
      <PawButton
        aim={input.current.down ? { x: 0, y: 1 } : { x: p.current.face, y: 0 }}
        onPress={() => { input.current.dig = true; }}
      />
      {nearNpc && (
        <button onClick={speak} className="absolute z-40 btn-3d font-display font-bold text-[13px] px-3 py-2 border-2"
          style={{ left: 10, bottom: 56, background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>Hablar</button>
      )}
      {nearDoor && (
        <button onClick={enter} className="absolute z-40 btn-3d font-display font-bold text-[13px] px-3 py-2 border-2"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: 78, background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>Entrar</button>
      )}

      {toast && (
        <div className="absolute left-3 right-3 z-40" style={{ top: 88 }}>
          <div className="border-2 border-amber-300/50 bg-black/80 px-3 py-2 text-center font-display font-bold text-amber-50">{toast}</div>
        </div>
      )}
      {talk && (
        <div className="absolute left-3 right-3 z-50" style={{ bottom: 120 }} onClick={() => setTalk(null)}>
          <div className="border-2 border-amber-200/40 bg-[#1a1008]/95 px-3 py-2">
            <div className="font-display font-bold text-amber-200 text-[13px]">{talk.name}</div>
            <div className="font-display text-[14px] text-amber-50 leading-snug">{talk.line}</div>
          </div>
        </div>
      )}

      {storyOn && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-end p-3">
          <div className="w-full border-2 border-amber-200/30 bg-[#1a1008] p-3">
            <div className="font-display font-bold text-amber-50 text-[18px] mb-1">Ruta de las Migas</div>
            {CAMPO_STORY.map((l) => <p key={l} className="font-display text-[13px] text-amber-100/90 leading-snug">{l}</p>)}
            <button onClick={() => { setStoryOn(false); save("maxine_campo_story", true); }} className="btn-3d mt-3 w-full font-display font-bold py-2" style={{ background: "#ffd27a", color: "#3a1808" }}>Salir al prado</button>
          </div>
        </div>
      )}

      {logOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center p-3">
          <div className="w-full border-2 border-amber-200/30 bg-[#1a1008] p-3">
            <div className="font-display font-bold text-amber-50 text-center mb-2">Misiones</div>
            {Object.values(QUESTS).map((q) => {
              const st = quests[q.id];
              return (
                <div key={q.id} className="mb-1.5 border border-amber-200/20 px-2 py-1.5">
                  <div className="font-display font-bold text-[13px] text-amber-100">{q.title} · {st.n}/{q.need}</div>
                  <div className="font-display text-[11px] text-amber-200/80">{st.state === "done" ? q.done : q.hint}</div>
                </div>
              );
            })}
            <button onClick={() => setLogOn(false)} className="btn-3d mt-2 w-full font-display font-bold py-2" style={{ background: "#ffd27a", color: "#3a1808" }}>Cerrar</button>
          </div>
        </div>
      )}

      {mapOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
          <div className="w-full border-2 border-[#3a8ab0] p-3" style={{ background: "#0a1830" }}>
            <div className="font-display font-bold text-[#7fd0ff] text-center mb-1">Mapa · 30 áreas</div>
            <div className="font-pixel text-[7px] text-[#7fd0ff]/70 text-center mb-2">{visited.length}/30</div>
            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
              {([1, 2, 3, 4, 5] as const).flatMap((depth) =>
                (["A", "B", "C", "D", "E", "F"] as const).map((z) => {
                  const id = `${z}${depth}` as AreaId;
                  const a = AREAS[id];
                  const seen = visited.includes(id);
                  return (
                    <button key={id} disabled={!seen} onClick={() => { if (seen) { go(id, "right"); setMapOn(false); } }}
                      className="border font-pixel text-[6px] py-1.5 leading-tight disabled:opacity-35"
                      style={{
                        background: id === area ? "#3a90b8" : seen ? "#163048" : "#0c1828",
                        color: "#d8f4ff",
                        borderColor: id === area ? "#7fd0ff" : seen ? "#2a6080" : "#122030",
                      }}>
                      {seen ? a.tag : "·"}
                    </button>
                  );
                })
              )}
            </div>
            <button onClick={() => setMapOn(false)} className="btn-3d w-full font-display font-bold py-2" style={{ background: "#ffd27a", color: "#3a1808" }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Sky({ zone }: { zone: string }) {
  const hills = zone === "C" || zone === "E" ? "#121018" : zone === "B" ? "#4a5560" : zone === "F" ? "#8a4020" : "#5aaa3a";
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "42%" }}>
      <div className="absolute inset-x-0 bottom-[28%] h-16" style={{ background: hills, clipPath: "polygon(0 70%, 12% 40%, 28% 55%, 44% 22%, 62% 48%, 78% 18%, 100% 50%, 100% 100%, 0 100%)", opacity: 0.35 }} />
      <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: hills, clipPath: "polygon(0 50%, 18% 20%, 36% 45%, 55% 10%, 74% 40%, 100% 15%, 100% 100%, 0 100%)", opacity: 0.22 }} />
    </div>
  );
}

function Hut({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: x - 10, top: y, width: 44, height: 52 }}>
      <svg width="44" height="52" viewBox="0 0 44 52">
        <path d="M2 24 L22 4 L42 24" fill="#8a3a18" stroke="#2a1408" strokeWidth="2" />
        <rect x="6" y="24" width="32" height="26" fill="#c9842a" stroke="#2a1408" strokeWidth="2" />
        <rect x="16" y="32" width="12" height="18" fill="#3a2010" />
        <rect x="8" y="28" width="8" height="8" fill="#7ec8ff" stroke="#2a1408" strokeWidth="1" />
      </svg>
    </div>
  );
}

function FoeView({ f }: { f: Foe }) {
  return (
    <div className="absolute" style={{ left: f.x, top: f.y }}>
      <svg width="24" height="20" viewBox="0 0 24 20">
        {f.kind === "bat" ? (
          <>
            <path d="M4 10 Q1 4 8 8 Q12 2 16 8 Q23 4 20 10 Q16 14 12 12 Q8 14 4 10" fill="#3a2a50" stroke="#1a0c04" strokeWidth="1.2" />
            <circle cx="10" cy="10" r="1" fill="#ffd27a" /><circle cx="14" cy="10" r="1" fill="#ffd27a" />
          </>
        ) : (
          <>
            <ellipse cx="12" cy="12" rx="9" ry="6" fill="#c9a888" stroke="#5a3a1a" strokeWidth="1.2" />
            <circle cx="6" cy="10" r="3.2" fill="#c9a888" stroke="#5a3a1a" strokeWidth="1" />
            <circle cx="5" cy="9.5" r="0.8" fill="#1a0c04" />
            <path d="M20 12 Q24 8 22 6" stroke="#b08a6a" strokeWidth="1.4" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}

function NpcArt({ kind }: { kind: (typeof NPCS)[number]["kind"] }) {
  const map: Record<typeof kind, ReactNode> = {
    lina: <Lina size={48} />, tico: <Tico size={44} />, nube: <Nube size={46} />,
    hada: <HadaNpc size={46} />, don: <DonLlanta size={50} />, maria: <Maria size={56} wave />,
  };
  return <>{map[kind]}</>;
}

function Tile({ c, r, cell, dirt, grass, zone }: { c: number; r: number; cell: Cell; dirt: string; grass: string; zone: string }) {
  const x = c * TILE, y = r * TILE;
  const hash = ((c * 13) ^ (r * 7)) & 3;
  if (cell === 6) {
    return (
      <div className="absolute" style={{ left: x, top: y + 8, width: TILE, height: 10 }}>
        <div style={{ height: 4, background: "linear-gradient(180deg,#f0d2a0,#c9842a)", boxShadow: "0 2px 0 #5a3216" }} />
        <div style={{ height: 6, background: "repeating-linear-gradient(90deg,#8a5420 0 4px,#6a3a14 4px 5px)" }} />
      </div>
    );
  }
  if (cell === 4) {
    return (
      <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#2a2a32" }}>
        <div className="absolute inset-[3px]" style={{ borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#5a4a3a,#1a1410)", boxShadow: "inset 0 0 0 3px #111" }} />
      </div>
    );
  }
  if (cell === 5) {
    return (
      <div className="absolute" style={{ left: x + 1, top: y + 1, width: TILE - 2, height: TILE - 2, background: "linear-gradient(180deg,#c9842a,#6a3a14)", boxShadow: "inset 0 1px 0 #ffd27a88, 2px 2px 0 #2a1408" }} />
    );
  }
  if (cell === 2) {
    const brick = zone === "C" || zone === "E" ? "#4a4250" : "#7a6e66";
    const grout = "#2a2420";
    return (
      <div className="absolute" style={{
        left: x, top: y, width: TILE, height: TILE, background: brick,
        backgroundImage: `linear-gradient(${grout} 1px, transparent 1px), linear-gradient(90deg, ${grout} 1px, transparent 1px)`,
        backgroundSize: "9px 6px",
        backgroundPosition: hash ? "4px 0" : "0 0",
      }} />
    );
  }
  if (cell === 3) {
    return (
      <div className="absolute overflow-hidden" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }}>
        <div className="absolute inset-x-0 top-0 h-[5px]" style={{ background: `linear-gradient(180deg,${grass},#2a6a18)` }} />
        <div className="absolute left-1 top-0 w-0.5 h-2" style={{ background: grass }} />
        <div className="absolute right-2 top-0 w-0.5 h-1.5" style={{ background: "#6aba3a" }} />
        {hash === 1 && <div className="absolute left-2 bottom-1 w-1.5 h-1 rounded-full" style={{ background: "#5a3410", opacity: 0.5 }} />}
      </div>
    );
  }
  return (
    <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }}>
      {hash === 2 && <div className="absolute left-2 top-2 w-2 h-1" style={{ background: "#0002" }} />}
    </div>
  );
}
