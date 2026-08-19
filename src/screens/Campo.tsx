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

const COLS = 56;
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
  A1: ["lodo"],
  B1: ["exploradora"],
  C1: ["hueso"],
  D1: ["hada"],
  E1: ["casco", "pico"],
  F1: ["llanta"],
};

type QLog = Record<QuestId, { state: QuestState; n: number }>;

function load<T>(k: string, def: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : def; } catch { return def; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

function emptyQuests(): QLog {
  return {
    cesta: { state: "active", n: 0 },
    cinta: { state: "idle", n: 0 },
    tornillos: { state: "idle", n: 0 },
    huesos: { state: "idle", n: 0 },
    hada: { state: "idle", n: 0 },
    casco: { state: "idle", n: 0 },
  };
}

function surfaceAt(c: number, area: AreaId) {
  const z = AREAS[area].zone;
  const base = z === "C" || z === "E" ? 18 : 20;
  return base + Math.round(Math.sin(c * 0.16 + area.charCodeAt(0) + AREAS[area].depth) * 1.4);
}

function fill(grid: Cell[][], r0: number, c0: number, r1: number, c1: number, cell: Cell) {
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = cell;
  }
}

function buildArea(area: AreaId) {
  const def = AREAS[area];
  const metal = def.zone === "B" || def.zone === "F";
  const grid: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      const s = surfaceAt(c, area);
      if (c === 0 || c === COLS - 1) row.push(2);
      else if (r < s) row.push(0);
      else if (r === s) row.push(metal ? 4 : 3);
      else if (r < s + 4) row.push(1);
      else row.push(2);
    }
    grid.push(row);
  }
  const plat = (r: number, a: number, b: number) => fill(grid, r, a, r, b, 6);
  const shape = def.shape;
  const n = def.depth;
  if (shape === "hills") {
    plat(16 - n, 8, 14); plat(13, 20, 28); plat(11, 34, 42); plat(15, 44, 50);
    plat(9, 16, 22); if (n > 1) plat(8, 30, 36);
  } else if (shape === "garage") {
    plat(17, 6, 12); plat(14, 16, 24); plat(11, 28, 36); plat(15, 40, 50);
    plat(8, 32, 40); fill(grid, 8, 10, 8, 14, 5);
  } else if (shape === "cave" || shape === "grotto" || shape === "pit") {
    fill(grid, 9, 8, 17, 48, 0);
    plat(16, 10, 18); plat(13, 22, 32); plat(17, 36, 46); plat(11, 40, 48);
    plat(9, 14, 20); if (n > 2) plat(8, 26, 34);
  } else if (shape === "forest") {
    plat(16, 10, 16); plat(12, 22, 30); plat(15, 36, 46);
    plat(9, 18, 24); plat(18, 40, 48); plat(11, 4, 9);
  } else if (shape === "tower") {
    plat(16, 8, 16); plat(12, 22, 32); plat(15, 38, 48);
    plat(9, 28, 36); plat(18, 18, 24); plat(7, 40, 48);
  } else if (shape === "bridge") {
    plat(14, 4, 18); plat(14, 24, 38); plat(10, 16, 28); plat(18, 40, 52);
  } else if (shape === "shaft") {
    fill(grid, 6, 18, 20, 36, 0);
    plat(18, 8, 16); plat(14, 20, 28); plat(10, 32, 42); plat(7, 12, 20);
  } else if (shape === "rooftop") {
    plat(18, 6, 20); plat(14, 22, 34); plat(10, 36, 50); plat(7, 14, 26);
  }
  if (def.down) fill(grid, 20, 5, 25, 7, 0);
  return grid;
}

interface Foe { id: number; x: number; y: number; vx: number; hp: number; kind: "mouse" | "bat" }

function foesFor(area: AreaId): Foe[] {
  const s = (c: number) => (surfaceAt(c, area) - 2) * TILE;
  if (area === "A1") return [
    { id: 1, x: 18 * TILE, y: s(18), vx: 50, hp: 2, kind: "mouse" },
    { id: 2, x: 38 * TILE, y: 11 * TILE, vx: -40, hp: 2, kind: "mouse" },
  ];
  if (area === "B1") return [
    { id: 3, x: 22 * TILE, y: 12 * TILE, vx: 55, hp: 2, kind: "mouse" },
    { id: 4, x: 42 * TILE, y: 13 * TILE, vx: -50, hp: 2, kind: "mouse" },
  ];
  if (area === "C1") return [
    { id: 5, x: 16 * TILE, y: 12 * TILE, vx: 70, hp: 2, kind: "bat" },
    { id: 6, x: 40 * TILE, y: 10 * TILE, vx: -70, hp: 2, kind: "bat" },
  ];
  if (area === "E1") return [
    { id: 7, x: 24 * TILE, y: 12 * TILE, vx: 80, hp: 3, kind: "bat" },
    { id: 8, x: 40 * TILE, y: 14 * TILE, vx: -60, hp: 2, kind: "bat" },
  ];
  if (area === "F1") return [{ id: 9, x: 30 * TILE, y: s(30), vx: 45, hp: 3, kind: "mouse" }];
  return [{ id: 10, x: 24 * TILE, y: 12 * TILE, vx: 40, hp: 2, kind: "mouse" }];
}

export default function Campo({ skin, owned, ownedTools, crumbs, onFindSkin, onFindTool, onEarn, onBack }: Props) {
  const [area, setArea] = useState<AreaId>("A1");
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
  const p = useRef({ x: 5 * TILE, y: 10 * TILE, vx: 0, vy: 0, on: false, face: 1 as 1 | -1, dig: 0, atk: 0, inv: 0 });
  const cam = useRef({ x: 0, y: 0 });
  const input = useRef({ l: false, r: false, jump: false, dig: false, atk: false, down: false });
  const taken = useRef<Set<string>>(new Set(
    FIELD_SECRETS.filter((s) => (s.skin && owned.includes(s.skin)) || (s.tool && ownedTools.includes(s.tool))).map((s) => s.id),
  ));
  const loot = useRef<Set<string>>(new Set(load<string[]>("maxine_loot", [])));
  const [, setTick] = useState(0);

  useEffect(() => save("maxine_visited", visited), [visited]);
  useEffect(() => save("maxine_quests", quests), [quests]);

  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2400);
  };

  const go = (next: AreaId, from: "left" | "right" | "up" | "down") => {
    setArea(next);
    setVisited((v) => v.includes(next) ? v : [...v, next]);
    grid.current = buildArea(next);
    foes.current = foesFor(next);
    if (from === "right") p.current.x = 3 * TILE;
    else if (from === "left") p.current.x = (COLS - 5) * TILE;
    else if (from === "down") p.current.x = 8 * TILE;
    else p.current.x = 8 * TILE;
    p.current.y = (surfaceAt(8, next) - 3) * TILE;
    p.current.vy = 0;
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const solid = (c: Cell, oneWay: boolean) => c === 1 || c === 2 || c === 3 || c === 4 || c === 5 || (oneWay && c === 6);
    const get = (r: number, c: number): Cell => {
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return 2;
      return grid.current[r][c];
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const pl = p.current;
      pl.dig = Math.max(0, pl.dig - dt);
      pl.atk = Math.max(0, pl.atk - dt);
      pl.inv = Math.max(0, pl.inv - dt);
      const dir = (input.current.r ? 1 : 0) - (input.current.l ? 1 : 0);
      if (dir) pl.face = dir as 1 | -1;
      pl.vx = dir * 200;
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
        if (cc > 0 && cc < COLS - 1 && rr >= 0 && rr < ROWS) {
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
      const def = AREAS[area];
      if (pl.x < TILE * 1.6 && def.left) go(def.left, "left");
      if (pl.x > (COLS - 2.4) * TILE && def.right) go(def.right, "right");
      const pc = Math.floor((pl.x + PW / 2) / TILE);
      if (def.down && input.current.down && pc >= 5 && pc <= 8 && pl.on) go(def.down, "down");
      if (def.up && pl.y < TILE * 2 && pc >= 6 && pc <= 12) go(def.up, "up");
      if (pl.y > ROWS * TILE) { pl.y = (surfaceAt(8, area) - 3) * TILE; pl.vy = 0; }

      for (const f of foes.current) {
        if (f.hp <= 0) continue;
        f.x += f.vx * dt;
        if (f.x < 3 * TILE || f.x > (COLS - 4) * TILE) f.vx *= -1;
        if (f.kind === "bat") f.y += Math.sin(now / 220 + f.id) * 0.6;
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
  }, [area, onEarn, onFindSkin, onFindTool]);

  const pad = useRef({ x: 0, y: 0, id: -1, jumped: false });
  const onPadDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    pad.current = { x: e.clientX, y: e.clientY, id: e.pointerId, jumped: false };
  };
  const onPadMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pad.current.id !== e.pointerId) return;
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.abs(dx) > 14) { input.current.l = dx < 0; input.current.r = dx > 0; }
    if (dy < -34 && !pad.current.jumped) { input.current.jump = true; pad.current.jumped = true; }
    input.current.down = dy > 28;
  };
  const onPadUp = (e: PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) input.current.atk = true;
    input.current.l = false; input.current.r = false; input.current.down = false; pad.current.id = -1;
  };

  const nearNpc = NPCS.find((n) => n.area === area && Math.abs(p.current.x - n.col * TILE) < 28);
  const speak = () => {
    if (!nearNpc) return;
    const qid = nearNpc.quest;
    if (qid) {
      const q = quests[qid];
      const def = QUESTS[qid];
      if (q.state === "idle") {
        setQuests((old) => ({ ...old, [qid]: { ...old[qid], state: "active" } }));
        setTalk({ name: nearNpc.name, line: nearNpc.idle[0] });
        return;
      }
      if (q.n >= def.need && q.state !== "done") {
        setQuests((old) => ({ ...old, [qid]: { ...old[qid], state: "done" } }));
        onEarn(def.crumbs);
        setTalk({ name: nearNpc.name, line: def.done });
        return;
      }
      if (q.state === "done") {
        setTalk({ name: nearNpc.name, line: nearNpc.idle[2] });
        return;
      }
    }
    const line = nearNpc.idle[Math.floor(Math.random() * nearNpc.idle.length)];
    setTalk({ name: nearNpc.name, line });
  };

  const def = AREAS[area];
  const pl = p.current;
  const pose: Pose = pl.dig > 0 ? "dig" : pl.atk > 0 ? "win" : !pl.on && pl.vy > 40 ? "fall" : "idle";
  const c0 = Math.floor(cam.current.x / TILE) - 1;
  const c1 = Math.floor((cam.current.x + VW) / TILE) + 1;
  const r0 = Math.floor(cam.current.y / TILE) - 1;
  const r1 = Math.floor((cam.current.y + VH) / TILE) + 1;
  const hereSecrets = (SECRETS_IN[area] ?? []).filter((id) => !taken.current.has(id));
  const npcsHere = NPCS.filter((n) => n.area === area);

  if (hp <= 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: def.sky }}>
        <div className="font-display font-bold text-[28px] text-amber-50">Maxine se cansó</div>
        <button onClick={() => { setHp(5); p.current.x = 5 * TILE; p.current.y = 8 * TILE; }} className="btn-3d mt-4 font-display font-bold px-6 py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>Otra vez</button>
        <button onClick={onBack} className="mt-2 font-display text-amber-100">Menú</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden select-none" style={{ background: def.sky }}>
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4">Atrás</button>
        <div className="flex gap-1">
          <button onClick={() => setLogOn(true)} className="btn-3d font-display font-bold text-[12px] px-2.5 py-2 rounded-xl border-2 border-b-4" style={{ background: "#3a2010", color: "#ffd27a", borderColor: "#1a0c04" }}>Misiones</button>
          <button onClick={() => setMapOn(true)} className="btn-3d font-display font-bold text-[12px] px-2.5 py-2 rounded-xl border-2 border-b-4" style={{ background: "#1a3a5a", color: "#7fd0ff", borderColor: "#0a2030" }}>Mapa</button>
        </div>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-2 py-1.5">
          <Crown size={14} /><span className="font-display font-bold text-[14px] text-amber-200">{crumbs}</span>
        </div>
      </div>
      <div className="absolute top-[50px] left-2 z-30 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => <Heart key={i} filled={i < hp} size={16} />)}
      </div>
      <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
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
        {PICKUPS.filter((pk) => pk.area === area && !loot.current.has(pk.id)).map((pk) => (
          <div key={pk.id} className="absolute hop" style={{ left: pk.col * TILE, top: (surfaceAt(pk.col, area) + pk.rowOff) * TILE }}>
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-amber-100" style={{ background: "#ffd27a" }} />
          </div>
        ))}
        {npcsHere.map((n) => (
          <div key={n.id} className="absolute" style={{ left: n.col * TILE - 8, top: surfaceAt(n.col, area) * TILE - 52 }}>
            <NpcArt kind={n.kind} />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-display font-bold text-[9px] text-amber-50 bg-black/50 px-1 rounded-full whitespace-nowrap">{n.name}</div>
          </div>
        ))}
        {foes.current.filter((f) => f.hp > 0).map((f) => (
          <div key={f.id} className="absolute" style={{ left: f.x, top: f.y, width: 22, height: 18, background: f.kind === "bat" ? "#3a2a50" : "#c9a888", border: "2px solid #1a0c04", borderRadius: 8 }} />
        ))}
        {def.left && <div className="absolute font-display font-bold text-amber-50/80 text-[12px]" style={{ left: 28, top: surfaceAt(3, area) * TILE - 44 }}>← {AREAS[def.left].tag}</div>}
        {def.right && <div className="absolute font-display font-bold text-amber-50/80 text-[12px]" style={{ left: (COLS - 6) * TILE, top: surfaceAt(COLS - 4, area) * TILE - 44 }}>{AREAS[def.right].tag} →</div>}
        {def.down && <div className="absolute font-display font-bold text-[11px] text-amber-50 bg-black/40 px-1 rounded" style={{ left: 5 * TILE, top: surfaceAt(6, area) * TILE - 28 }}>↓ {AREAS[def.down].tag}</div>}
        {def.up && <div className="absolute font-display font-bold text-[11px] text-amber-50 bg-black/40 px-1 rounded" style={{ left: 8 * TILE, top: 2 * TILE }}>↑ {AREAS[def.up].tag}</div>}
        <div className="absolute" style={{ left: pl.x - 8, top: pl.y - 12, opacity: pl.inv > 0 ? 0.6 : 1 }}>
          <Maxine skin={skin} pose={pose} facing={pl.face} size={PW + 20} />
        </div>
        {pl.atk > 0 && (
          <div className="absolute rounded-full" style={{
            left: pl.x + (pl.face === 1 ? PW : -14), top: pl.y + 4, width: 16, height: 16,
            background: "#ffd27a88", border: "2px solid #fff3d6",
          }} />
        )}
      </div>

      <div className="absolute inset-0 z-20" style={{ touchAction: "none" }}
        onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
      <PawButton
        aim={input.current.down ? { x: 0, y: 1 } : { x: p.current.face, y: 0 }}
        onPress={() => { input.current.dig = true; }}
      />
      {nearNpc && (
        <button onClick={speak} className="absolute z-40 btn-3d font-display font-bold text-[13px] px-3 py-2 rounded-full border-2"
          style={{ left: 10, bottom: 56, background: "#ffd27a", color: "#3a1808", borderColor: "#7a4410" }}>Hablar</button>
      )}

      {toast && (
        <div className="absolute left-3 right-3 z-40" style={{ top: 96 }}>
          <div className="rounded-xl border-2 border-amber-300/50 bg-black/80 px-3 py-2 text-center font-display font-bold text-amber-50">{toast}</div>
        </div>
      )}
      {talk && (
        <div className="absolute left-3 right-3 z-50" style={{ bottom: 120 }} onClick={() => setTalk(null)}>
          <div className="rounded-2xl border-2 border-amber-200/40 bg-[#1a1008]/95 px-3 py-2">
            <div className="font-display font-bold text-amber-200 text-[13px]">{talk.name}</div>
            <div className="font-display text-[14px] text-amber-50 leading-snug">{talk.line}</div>
          </div>
        </div>
      )}

      {storyOn && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-end p-3">
          <div className="w-full rounded-2xl border-2 border-amber-200/30 bg-[#1a1008] p-3">
            <div className="font-display font-bold text-amber-50 text-[18px] mb-1">Ruta de las Migas</div>
            {CAMPO_STORY.map((l) => <p key={l} className="font-display text-[13px] text-amber-100/90 leading-snug">{l}</p>)}
            <button onClick={() => { setStoryOn(false); save("maxine_campo_story", true); }} className="btn-3d mt-3 w-full font-display font-bold py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>Salir al prado</button>
          </div>
        </div>
      )}

      {logOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center p-3">
          <div className="w-full rounded-2xl border-2 border-amber-200/30 bg-[#1a1008] p-3">
            <div className="font-display font-bold text-amber-50 text-center mb-2">Misiones del campo</div>
            {Object.values(QUESTS).map((q) => {
              const st = quests[q.id];
              return (
                <div key={q.id} className="mb-1.5 rounded-lg border border-amber-200/20 px-2 py-1.5">
                  <div className="font-display font-bold text-[13px] text-amber-100">{q.title} · {st.n}/{q.need}</div>
                  <div className="font-display text-[11px] text-amber-200/80">{st.state === "done" ? q.done : q.hint}</div>
                </div>
              );
            })}
            <button onClick={() => setLogOn(false)} className="btn-3d mt-2 w-full font-display font-bold py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>Cerrar</button>
          </div>
        </div>
      )}

      {mapOn && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
          <div className="w-full rounded-2xl border-2 border-[#3a8ab0] p-3" style={{ background: "#0a1830" }}>
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
                      className="rounded-sm border font-pixel text-[6px] py-1.5 leading-tight disabled:opacity-35"
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
            <button onClick={() => setMapOn(false)} className="btn-3d w-full font-display font-bold py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NpcArt({ kind }: { kind: (typeof NPCS)[number]["kind"] }) {
  const map: Record<typeof kind, ReactNode> = {
    lina: <Lina size={48} />,
    tico: <Tico size={44} />,
    nube: <Nube size={46} />,
    hada: <HadaNpc size={46} />,
    don: <DonLlanta size={50} />,
    maria: <Maria size={56} wave />,
  };
  return <>{map[kind]}</>;
}

function Tile({ c, r, cell, dirt, grass }: { c: number; r: number; cell: Cell; dirt: string; grass: string }) {
  const x = c * TILE, y = r * TILE;
  if (cell === 4) {
    return (
      <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#2a2a30", border: "1px solid #111" }}>
        <div className="absolute inset-1 rounded-full" style={{ background: "#3a2410" }} />
      </div>
    );
  }
  if (cell === 5) return <div className="absolute" style={{ left: x + 2, top: y + 2, width: TILE - 4, height: TILE - 4, background: "#8a5a2c", border: "2px solid #3a2010" }} />;
  if (cell === 6) return <div className="absolute" style={{ left: x, top: y + 10, width: TILE, height: 6, background: "#c9842a", borderTop: "2px solid #fff3d6", boxShadow: "0 2px 0 #5a3216" }} />;
  if (cell === 2) return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "#6a6a72" }} />;
  if (cell === 3) return (
    <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }}>
      <div className="absolute inset-x-0 top-0 h-2" style={{ background: grass }} />
    </div>
  );
  return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: dirt }} />;
}
