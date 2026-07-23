import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { Plushie, TOOL_MAP, TOOLS, type ToolId } from "../art/Plushie";
import { Bread, type BreadType, Heart, Crown, PowerIcon, Flour, zoneOf, ZONE_NAME } from "../art/Decor";
import { type Boss, type Bullet, type BossCtx, spawnBoss, stepBoss, bossForLevel, BossView, BulletView, BOSS_NAME, BOSS_TAUNT, bossPartsWorld } from "../art/Bosses";
import type { SkinId } from "../data/skins";

const COLS = 8;
const TILE = 45;
const STAGE_W = COLS * TILE;
const STAGE_H = 640;
const PW = TILE * 0.6;
const PH = TILE * 0.82;
const G = 1400;
const JUMP_V = 470;
const MAX_FALL = 540;
const MOVE = 175;

const LEVEL_LEN = 32;
const ARENA_H = 9;
const REST_H = 4;
const CYCLE = LEVEL_LEN + ARENA_H + REST_H + 2; // +door +floor

type Cell = 0 | 1 | 2 | 3 | 4 | 5;
type EnemyType = "spoon" | "mouse" | "whisk" | "bubble" | "spatula";
interface Enemy { id: number; x: number; y: number; vx: number; vy: number; minX: number; maxX: number; type: EnemyType; hp: number; hitCd: number; homeY: number; stateT: number; active: boolean; }
interface BreadItem { id: number; x: number; y: number; type: BreadType; taken: boolean; phase: number; }
interface PowerItem { id: number; x: number; y: number; kind: string; taken: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number; }

interface World { rows: Record<number, Cell[]>; enemies: Enemy[]; breads: BreadItem[]; powers: PowerItem[]; bullets: Bullet[]; isRest: Record<number, boolean>; isBoss: Record<number, boolean>; doorRow: Record<number, number>; }
interface Player { x: number; y: number; prevY: number; vx: number; vy: number; onGround: boolean; facing: 1 | -1; invuln: number; hurtTimer: number; digTimer: number; attackTimer: number; attackCd: number; coyote: number; jumpBuf: number; usedDouble: boolean; }
interface Active { shield: number; magnet: number; speed: number; yeast: number; frozen: number; bounceUsed: boolean; }

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function pickBread(r: () => number): BreadType { const v = r() * 100; if (v < 52) return "baguette"; if (v < 80) return "miche"; if (v < 93) return "croissant"; if (v < 98.5) return "pretzel"; return "divine"; }
const BREAD_SCORE: Record<BreadType, number> = { baguette: 10, miche: 25, croissant: 50, pretzel: 100, divine: 500 };
const BREAD_RUN: Record<BreadType, number> = { baguette: 1, miche: 2, croissant: 4, pretzel: 8, divine: 20 };
const BREAD_CROWNS: Record<BreadType, number> = { baguette: 0, miche: 0, croissant: 0, pretzel: 1, divine: 3 };

const cycleOf = (r: number) => (r < 3 ? 0 : Math.floor((r - 3) / CYCLE));
const offOf = (r: number) => (r < 3 ? -1 : (r - 3) % CYCLE);

interface Props {
  skin: SkinId;
  onExit: (stats: { depth: number; score: number; bread: number; crowns: number; isNewBest: boolean }) => void;
  onVictory: (stats: { depth: number; score: number; bread: number; crowns: number }) => void;
  best: number;
  startTool: ToolId;
  ownedMeta: ToolId[];
}

export default function Game({ skin, onExit, onVictory, best, startTool, ownedMeta }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  const [resting, setResting] = useState(false);
  const restingRef = useRef(false);
  useEffect(() => { restingRef.current = resting; }, [resting]);

  useLayoutEffect(() => {
    const el = stageRef.current?.parentElement; if (!el) return;
    const fit = () => { const r = el.getBoundingClientRect(); setScale(Math.min(r.width / STAGE_W, r.height / STAGE_H)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);

  const world = useRef<World>({ rows: {}, enemies: [], breads: [], powers: [], bullets: [], isRest: {}, isBoss: {}, doorRow: {} });
  const player = useRef<Player>({ x: 3 * TILE + TILE / 2 - PW / 2, y: 2 * TILE, prevY: 2 * TILE, vx: 0, vy: 0, onGround: false, facing: 1, invuln: 0, hurtTimer: 0, digTimer: 0, attackTimer: 0, attackCd: 0, coyote: 0, jumpBuf: 0, usedDouble: false });
  const active = useRef<Active>({ shield: 0, magnet: 0, speed: 0, yeast: 0, frozen: 0, bounceUsed: false });
  const cameraY = useRef(0);
  const hearts = useRef(3);
  const score = useRef(0);
  const breadRun = useRef(0);
  const crownsRun = useRef(0);
  const breadCount = useRef(0);
  const startY = useRef(2 * TILE);
  const maxDepth = useRef(0);
  const ids = useRef(1);
  const input = useRef({ left: false, right: false, digEdge: false, jumpEdge: false, attackEdge: false, lastHoriz: 0 });
  const aim = useRef<{ x: number; y: number }>({ x: 0, y: 1 });
  const over = useRef(false);
  const elapsed = useRef(0);
  const stoneHits = useRef<Map<string, number>>(new Map());
  const level = useRef(1);
  const lastRestLevel = useRef(0);
  const lastBossLevel = useRef(0);
  const tool = useRef<ToolId>(startTool);
  const ownedTools = useRef<ToolId[]>(Array.from(new Set(["palito" as ToolId, ...ownedMeta, startTool])));
  const veinCol = useRef(3);
  const boss = useRef<Boss | null>(null);
  const bossActive = useRef(false);
  const bossDefeated = useRef<Record<number, boolean>>({});
  const shake = useRef(0);
  const rng = useRef(mulberry32((Math.random() * 1e9) | 0));

  function ensureRow(r: number) {
    const w = world.current; if (w.rows[r]) return;
    const R = rng.current; const off = offOf(r);
    if (r < 3) { w.rows[r] = new Array(COLS).fill(0); return; }
    // ARENA
    if (off >= LEVEL_LEN && off < LEVEL_LEN + ARENA_H) {
      const row = new Array(COLS).fill(0) as Cell[]; row[0] = 2; row[COLS - 1] = 2;
      const local = off - LEVEL_LEN;
      if (local === 3) { row[1] = 2; row[2] = 2; row[COLS - 3] = 2; row[COLS - 2] = 2; }
      if (local === 6) { row[3] = 2; row[4] = 2; }
      w.rows[r] = row; w.isBoss[r] = true; return;
    }
    // DOOR
    if (off === LEVEL_LEN + ARENA_H) {
      const row = new Array(COLS).fill(2) as Cell[]; row[0] = 2; row[COLS - 1] = 2;
      w.rows[r] = row; w.doorRow[cycleOf(r)] = r; return;
    }
    // REST
    if (off > LEVEL_LEN + ARENA_H && off <= LEVEL_LEN + ARENA_H + REST_H) {
      const row = new Array(COLS).fill(0) as Cell[]; row[0] = 2; row[COLS - 1] = 2;
      w.rows[r] = row; w.isRest[r] = true; return;
    }
    // FLOOR with wide gap
    if (off === CYCLE - 1) {
      const row = new Array(COLS).fill(2) as Cell[]; row[2] = 0; row[3] = 0; row[4] = 0; row[5] = 0;
      w.rows[r] = row; return;
    }
    // LEVEL rows (dense)
    const cells: Cell[] = new Array(COLS).fill(1);
    cells[0] = 2; cells[COLS - 1] = 2;
    veinCol.current += R() < 0.5 ? -1 : 1;
    if (veinCol.current < 1) veinCol.current = 1; if (veinCol.current > COLS - 2) veinCol.current = COLS - 2;
    const v = veinCol.current; cells[v] = 0; cells[v + 1] = 0;
    const easy = r < 12;
    let stoneRun = 0;
    for (let c = 1; c < COLS - 1; c++) {
      if (cells[c] === 0) { stoneRun = 0; continue; }
      const nearVein = c === v - 1 || c === v + 2; // keep the vein's shoulders diggable (1-hit dirt) so you can always claw back to the safe corridor
      const x = R();
      if (x < 0.14) cells[c] = 0;
      else if (!nearVein && x < (easy ? 0.18 : 0.26)) cells[c] = 2;
      else if (!nearVein && x < (easy ? 0.20 : 0.29)) cells[c] = 3;
      else if (x < 0.34) cells[c] = R() < 0.5 ? 4 : 5;
      if (cells[c] === 2) { stoneRun++; if (stoneRun > 2) { cells[c] = 1; stoneRun = 0; } } else stoneRun = 0; // no stone slab wider than 2
    }
    // hard guarantee: the vein and its shoulders are never spike/stone -> a soft-lock is impossible
    for (const c of [v - 1, v, v + 1, v + 2]) if (c > 0 && c < COLS - 1 && (cells[c] === 2 || cells[c] === 3)) cells[c] = 1;
    w.rows[r] = cells;
    for (let c = 1; c < COLS - 1; c++) if (cells[c] === 0 && R() < 0.22) w.breads.push({ id: ids.current++, x: c * TILE + TILE / 2, y: r * TILE + TILE / 2, type: pickBread(R), taken: false, phase: R() * 6 });
    if (R() < 0.07) {
      const empt = []; for (let c = 1; c < COLS - 1; c++) if (cells[c] === 0) empt.push(c);
      if (empt.length) { const c = empt[(R() * empt.length) | 0]; const kinds = ["milk", "magnet", "butter", "yeast"]; w.powers.push({ id: ids.current++, x: c * TILE + TILE / 2, y: r * TILE + TILE / 2, kind: kinds[(R() * kinds.length) | 0], taken: false }); }
    }
    if (!easy && R() < 0.22) {
      const cands = []; for (let c = 1; c < COLS - 1; c++) if ((cells[c] === 1 || cells[c] === 2) && w.rows[r - 1] && w.rows[r - 1][c] === 0) cands.push(c);
      if (cands.length) {
        const c = cands[(R() * cands.length) | 0];
        const types: EnemyType[] = ["spoon", "mouse", "whisk", "bubble", "spatula"];
        const type = types[(R() * types.length) | 0];
        let lo = c, hi = c; const above = w.rows[r - 1];
        while (lo > 1 && above[lo - 1] === 0) lo--; while (hi < COLS - 2 && above[hi + 1] === 0) hi++;
        const hp = type === "whisk" ? 2 : type === "bubble" ? 999 : 1;
        w.enemies.push({ id: ids.current++, x: c * TILE + TILE / 2, y: (r - 1) * TILE + TILE * 0.5, vx: (R() < 0.5 ? -1 : 1) * (type === "mouse" ? 70 : 35), vy: 0, minX: lo * TILE + TILE / 2, maxX: hi * TILE + TILE / 2, type, hp, hitCd: 0, homeY: (r - 1) * TILE + TILE * 0.5, stateT: R() * 3, active: type !== "spatula" });
      }
    }
  }

  function getCell(r: number, c: number): Cell { if (c < 0 || c >= COLS) return 2; ensureRow(r); return world.current.rows[r]?.[c] ?? 1; }
  function setCell(r: number, c: number, v: Cell) { ensureRow(r); if (world.current.rows[r]) world.current.rows[r][c] = v; }
  const solid = (c: Cell) => c === 1 || c === 2 || c === 3;

  const particles = useRef<Particle[]>([]);
  function spawnDust(x: number, y: number, color: string, n = 8) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2; const sp = 30 + Math.random() * 110; particles.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 0.5, max: 0.5, color, size: 2 + Math.random() * 3 }); } }

  function hurt() {
    const p = player.current; if (p.invuln > 0 || over.current) return;
    if (active.current.shield > 0) { active.current.shield = 0; p.invuln = 0.6; p.hurtTimer = 0.2; spawnDust(p.x + PW / 2, p.y + PH / 2, "#7fd0ff", 14); return; }
    if (TOOL_MAP[tool.current].bounce && !active.current.bounceUsed) { active.current.bounceUsed = true; p.invuln = 1.2; p.hurtTimer = 0.3; spawnDust(p.x + PW / 2, p.y + PH / 2, "#d4e84a", 18); return; }
    hearts.current -= 1; p.invuln = 1.2; p.hurtTimer = 0.4; shake.current = Math.max(shake.current, 6); spawnDust(p.x + PW / 2, p.y + PH / 2, "#ff5a5a", 12);
    if (hearts.current <= 0) endGame();
  }
  function endGame() { if (over.current) return; over.current = true; const depth = maxDepth.current; const isNewBest = depth > best; setTimeout(() => onExit({ depth, score: score.current, bread: breadCount.current, crowns: crownsRun.current, isNewBest }), 650); }

  function collectBread(b: BreadItem) {
    b.taken = true; score.current += BREAD_SCORE[b.type]; breadRun.current += BREAD_RUN[b.type]; crownsRun.current += BREAD_CROWNS[b.type]; breadCount.current += 1; spawnDust(b.x, b.y, "#ffe066", 10);
    if (b.type === "miche" && hearts.current < 5) hearts.current++;
    if (b.type === "croissant" && hearts.current < 5) hearts.current++;
    if (b.type === "pretzel") { active.current.speed = Math.max(active.current.speed, 8); if (hearts.current < 5) hearts.current++; }
    if (b.type === "divine") { hearts.current = 5; player.current.invuln = Math.max(player.current.invuln, 3); }
  }

  function tryDig() {
    const p = player.current; const t = TOOL_MAP[tool.current]; const ax = aim.current.x, ay = aim.current.y;
    const pc = Math.floor((p.x + PW / 2) / TILE); const pr = Math.floor((p.y + PH / 2) / TILE);
    const targets: [number, number][] = [[pr + ay, pc + ax]];
    if (ay === 1 && ax === 0 && t.wide) { targets.push([pr + 1, pc - 1], [pr + 1, pc + 1]); }
    if (ax !== 0 && ay === 0 && t.reach) targets.push([pr, pc + ax * 2]);
    let broke = false;
    for (const [rr, cc] of targets) {
      if (cc < 1 || cc > COLS - 2) continue; // border walls are indestructible — you can never dig out of the kitchen
      const cyc = cycleOf(rr); const lockedDoor = world.current.doorRow[cyc] === rr && !bossDefeated.current[cyc + 1];
      if (lockedDoor) { spawnDust(cc * TILE + TILE / 2, rr * TILE + TILE / 2, "#9aa0a8", 4); continue; } // the gate won't budge until the boss falls
      const cell = getCell(rr, cc);
      if (cell === 1 || cell === 4 || cell === 5) { setCell(rr, cc, 0); broke = true; spawnDust(cc * TILE + TILE / 2, rr * TILE + TILE / 2, cell === 1 ? "#caa06a" : "#e3a35a", 10); score.current += 2; if (t.healOnDig && Math.random() < 0.14 && hearts.current < 5) { hearts.current++; spawnDust(p.x + PW / 2, p.y, "#ff8fa0", 10); } }
      else if (cell === 2) { const key = `${rr},${cc}`; const need = t.speedMul >= 1.3 ? 1 : 2; const have = (stoneHits.current.get(key) ?? 0) + 1; if (have >= need) { setCell(rr, cc, 0); stoneHits.current.delete(key); broke = true; spawnDust(cc * TILE + TILE / 2, rr * TILE + TILE / 2, "#d7d2c4", 12); score.current += 3; } else { stoneHits.current.set(key, have); spawnDust(cc * TILE + TILE / 2, rr * TILE + TILE / 2, "#ffffff", 5); } }
    }
    if (broke) { p.digTimer = 0.18 / t.speedMul; if (ax !== 0 && ay === 0) { const targetX = (pc + ax) * TILE + (ax > 0 ? 2 : TILE - PW - 2); p.x += (targetX - p.x) * 0.6; p.facing = ax as 1 | -1; } if (ay === 1) p.onGround = false; }
  }

  function attackArc() {
    const p = player.current; const ax = aim.current.x, ay = aim.current.y;
    const cx = p.x + PW / 2, cy = p.y + PH / 2;
    const dx = ax !== 0 ? ax : 0, dy = ay !== 0 ? ay : 0;
    const w = TILE * 1.1, h = TILE * 0.9;
    return { x: cx + dx * TILE * 0.6 - (dx === 0 ? w / 2 : 0) - (dx > 0 ? 0 : w * 0.3), y: cy + dy * TILE * 0.5 - h / 2, w, h, dx, dy };
  }

  function doAttack() {
    const p = player.current; if (p.attackCd > 0) return;
    p.attackCd = 0.32; p.attackTimer = 0.18;
    const t = TOOL_MAP[tool.current]; const dmg = 1 + (t.speedMul >= 1.45 ? 1 : 0) + (t.healOnDig ? 1 : 0);
    const arc = attackArc();
    spawnDust(arc.x + arc.w / 2, arc.y + arc.h / 2, "#fff3d6", 6);
    for (const e of world.current.enemies) {
      if (e.hp >= 999) continue;
      if (e.x > arc.x && e.x < arc.x + arc.w && e.y > arc.y && e.y < arc.y + arc.h) {
        e.hp -= dmg; e.hitCd = 0.3; e.vx += arc.dx * 120; e.vy -= 80; spawnDust(e.x, e.y, "#ffd27a", 8);
        if (e.hp <= 0) { score.current += 15; spawnDust(e.x, e.y, "#ff8fa0", 14); }
      }
    }
    world.current.enemies = world.current.enemies.filter((e) => e.hp > 0);
    // return chef's pans
    for (const bl of world.current.bullets) {
      if (bl.kind === "pan" && bl.x > arc.x && bl.x < arc.x + arc.w && bl.y > arc.y && bl.y < arc.y + arc.h) {
        const bo = boss.current; const tx = bo ? bo.x : bl.x, ty = bo ? bo.y : bl.y - 40;
        const dx = tx - bl.x, dy = ty - bl.y; const d = Math.hypot(dx, dy) || 1;
        bl.kind = "panback"; bl.vx = (dx / d) * 280; bl.vy = (dy / d) * 280; bl.life = 2; bl.grav = 0;
        spawnDust(bl.x, bl.y, "#7fc24a", 6);
      }
    }
    const b = boss.current;
    if (b) {
      const partsW = bossPartsWorld(b); let hitPart = false;
      for (const p of partsW) {
        if (p.hp <= 0) continue;
        if (p.x > arc.x && p.x < arc.x + arc.w && p.y > arc.y && p.y < arc.y + arc.h) {
          const part = b.parts.find((q) => q.id === p.id);
          if (part) { part.hp -= dmg; part.flash = 0.2; hitPart = true; spawnDust(p.x, p.y, "#ffd27a", 8); shake.current = Math.max(shake.current, 3); if (part.hp <= 0) { b.parts = b.parts.filter((q) => q.id !== part.id); spawnDust(p.x, p.y, "#ff8fa0", 14); } }
        }
      }
      if (!hitPart) {
        const bodyHit = b.x > arc.x - 22 && b.x < arc.x + arc.w + 22 && b.y > arc.y - 22 && b.y < arc.y + arc.h + 22;
        if (bodyHit) {
          if (b.vulnerable || b.stun > 0) { b.hp -= dmg; b.flash = 0.18; shake.current = Math.max(shake.current, 4); spawnDust(b.x, b.y, "#ffd27a", 10); if (b.hp <= 0) onBossDefeated(); }
          else { b.shieldFlash = 0.25; spawnDust(b.x, b.y - 24, "#9aa0a8", 6); }
        }
      }
    }
  }

  function onBossDefeated() {
    const b = boss.current; if (!b) return;
    const L = level.current; bossDefeated.current[L] = true; bossActive.current = false;
    spawnDust(b.x, b.y, "#ffd27a", 40); shake.current = 14; score.current += 200; crownsRun.current += 3;
    if (b.type === "bigotes" && L === 5) { boss.current = null; setTimeout(() => onVictory({ depth: maxDepth.current, score: score.current, bread: breadCount.current, crowns: crownsRun.current }), 750); return; }
    const cyc = cycleOf(Math.floor(player.current.y / TILE));
    let dr = world.current.doorRow[cyc];
    if (dr == null) { const rr = 3 + cyc * CYCLE + LEVEL_LEN + ARENA_H; ensureRow(rr); dr = world.current.doorRow[cyc]; } // make sure the gate exists even if the camera hadn't generated it yet
    if (dr != null) for (let c = 1; c < COLS - 1; c++) setCell(dr, c, 0);
    boss.current = null;
  }

  // ---------- main loop ----------
  useEffect(() => {
    for (let r = 0; r < 60; r++) ensureRow(r);
    let raf = 0; let last = performance.now();
    const ctx: BossCtx = {
      playerX: 0, playerY: 0, left: TILE, right: (COLS - 1) * TILE, top: 0, bottom: 0,
      spawnBullet: (b) => { world.current.bullets.push({ id: ids.current++, ...b }); },
      spawnMouse: (x, y) => { world.current.enemies.push({ id: ids.current++, x, y, vx: (Math.random() < 0.5 ? -1 : 1) * 60, vy: 0, minX: x - 40, maxX: x + 40, type: "mouse", hp: 1, hitCd: 0, homeY: y, stateT: 0, active: true }); },
      shake: (n) => { shake.current = Math.max(shake.current, n); },
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      shake.current = Math.max(0, shake.current - dt * 30);
      if (pausedRef.current || over.current || restingRef.current) { setTick((t) => (t + 1) & 0xffff); return; }
      elapsed.current += dt;
      const p = player.current; const a = active.current; const t = TOOL_MAP[tool.current];
      a.shield = Math.max(0, a.shield - dt); a.magnet = Math.max(0, a.magnet - dt); a.speed = Math.max(0, a.speed - dt); a.yeast = Math.max(0, a.yeast - dt); a.frozen = Math.max(0, a.frozen - dt);
      p.invuln = Math.max(0, p.invuln - dt); p.hurtTimer = Math.max(0, p.hurtTimer - dt); p.digTimer = Math.max(0, p.digTimer - dt); p.attackTimer = Math.max(0, p.attackTimer - dt); p.attackCd = Math.max(0, p.attackCd - dt);
      p.prevY = p.y;

      if (input.current.left) { aim.current = { x: -1, y: 0 }; input.current.lastHoriz = now; }
      else if (input.current.right) { aim.current = { x: 1, y: 0 }; input.current.lastHoriz = now; }
      else if (now - input.current.lastHoriz > 180) aim.current = { x: 0, y: 1 };

      const frozenMul = a.frozen > 0 ? 0.4 : 1;
      const speedMul = (a.speed > 0 ? 1.4 : 1) * frozenMul;
      const dir = (input.current.right ? 1 : 0) - (input.current.left ? 1 : 0);
      if (dir !== 0) p.facing = dir as 1 | -1;
      p.vx = dir * MOVE * speedMul;

      const pc = Math.floor((p.x + PW / 2) / TILE); const pr = Math.floor((p.y + PH / 2) / TILE);
      if (getCell(pr, pc) === 4) p.vx *= 0.45;

      p.x += p.vx * dt;
      {
        const top = Math.floor(p.y / TILE); const bot = Math.floor((p.y + PH - 1) / TILE);
        if (p.vx > 0) { const col = Math.floor((p.x + PW) / TILE); for (let r = top; r <= bot; r++) if (solid(getCell(r, col))) { p.x = col * TILE - PW; p.vx = 0; break; } }
        else if (p.vx < 0) { const col = Math.floor(p.x / TILE); for (let r = top; r <= bot; r++) if (solid(getCell(r, col))) { p.x = (col + 1) * TILE; p.vx = 0; break; } }
      }
      p.x = Math.max(TILE, Math.min(p.x, (COLS - 1) * TILE - PW));

      if (input.current.digEdge) { input.current.digEdge = false; tryDig(); }
      if (input.current.attackEdge) { input.current.attackEdge = false; doAttack(); }

      // jump buffering + coyote
      p.coyote = p.onGround ? 0.12 : Math.max(0, p.coyote - dt);
      if (input.current.jumpEdge) { input.current.jumpEdge = false; p.jumpBuf = 0.12; }
      p.jumpBuf = Math.max(0, p.jumpBuf - dt);
      if (p.jumpBuf > 0 && (p.coyote > 0 || (a.yeast > 0 && !p.usedDouble))) {
        if (p.coyote <= 0) p.usedDouble = true;
        p.vy = -JUMP_V; p.jumpBuf = 0; p.coyote = 0; p.onGround = false;
        spawnDust(p.x + PW / 2, p.y + PH, "#fff3d6", 6);
      }

      p.vy += G * dt; if (p.vy > MAX_FALL) p.vy = MAX_FALL;
      p.y += p.vy * dt; p.onGround = false;
      {
        const left = Math.floor(p.x / TILE); const right = Math.floor((p.x + PW - 1) / TILE);
        if (p.vy < 0) { const hrow = Math.floor(p.y / TILE); for (let c = left; c <= right; c++) if (solid(getCell(hrow, c))) { p.y = (hrow + 1) * TILE; p.vy = 0; break; } } // ceiling: never jump through a block or the locked gate
        if (p.vy >= 0) { const row = Math.floor((p.y + PH) / TILE); for (let c = left; c <= right; c++) { const cell = getCell(row, c); if (solid(cell)) { p.y = row * TILE - PH; p.vy = 0; p.onGround = true; p.usedDouble = false; if (cell === 3) { if (TOOL_MAP[tool.current].spikeImmune) { setCell(row, c, 0); spawnDust(c * TILE + TILE / 2, row * TILE + TILE / 2, "#d7d2c4", 8); score.current += 1; } else hurt(); } break; } } }
        // re-resolve horizontal against the post-fall rows (kills the 1-frame side-ledge nibble so walls always feel solid)
        { const t2 = Math.floor(p.y / TILE); const b2 = Math.floor((p.y + PH - 1) / TILE);
          if (p.vx >= 0) { const col = Math.floor((p.x + PW) / TILE); for (let r = t2; r <= b2; r++) if (solid(getCell(r, col))) { p.x = col * TILE - PW; p.vx = 0; break; } }
          else { const col = Math.floor(p.x / TILE); for (let r = t2; r <= b2; r++) if (solid(getCell(r, col))) { p.x = (col + 1) * TILE; p.vx = 0; break; } }
          p.x = Math.max(TILE, Math.min(p.x, (COLS - 1) * TILE - PW)); }
        // emergency eject: if a knockback or a weird frame ever leaves the puppy embedded in a solid tile, spit her out upward so she can never get stuck
        const eR = Math.floor((p.y + PH / 2) / TILE); const eC = Math.floor((p.x + PW / 2) / TILE);
        if (solid(getCell(eR, eC))) { let er = eR; while (er >= 0 && solid(getCell(er, eC))) er--; p.y = er * TILE - PH; p.vy = 0; p.onGround = true; p.usedDouble = false; }
      }

      const frontRow = Math.floor((p.y + STAGE_H) / TILE) + 4;
      for (let r = 0; r <= frontRow; r++) ensureRow(r);

      const d = Math.max(0, Math.floor((p.y - startY.current) / TILE)); if (d > maxDepth.current) maxDepth.current = d;
      level.current = cycleOf(Math.floor(p.y / TILE)) + 1;

      // boss trigger
      const pRow = Math.floor(p.y / TILE);
      if (world.current.isBoss[pRow] && !bossActive.current && !bossDefeated.current[level.current]) {
        const cyc = cycleOf(pRow); const arenaTop = 3 + cyc * CYCLE + LEVEL_LEN;
        boss.current = spawnBoss(bossForLevel(level.current), level.current, TILE, (COLS - 1) * TILE, arenaTop * TILE);
        bossActive.current = true; lastBossLevel.current = level.current;
      }
      // rest trigger
      if (world.current.isRest[pRow] && level.current > lastRestLevel.current && !bossActive.current) {
        level.current = Math.max(level.current, lastRestLevel.current + 1); lastRestLevel.current = level.current; p.vy = 0; setResting(true);
      }

      const target = p.y - STAGE_H * 0.45; cameraY.current += (target - cameraY.current) * Math.min(1, dt * 6);

      // enemies AI
      for (const e of world.current.enemies) {
        if (e.y < cameraY.current - 120 || e.y > cameraY.current + STAGE_H + 120) continue;
        e.hitCd = Math.max(0, e.hitCd - dt); e.stateT += dt;
        const slowAura = t.slowAura && Math.hypot(e.x - (p.x + PW / 2), e.y - (p.y + PH / 2)) < TILE * 2.4 ? 0.35 : 1;
        if (e.type === "spoon") {
          e.x += e.vx * slowAura * dt; if (e.x < e.minX) { e.x = e.minX; e.vx = Math.abs(e.vx); } if (e.x > e.maxX) { e.x = e.maxX; e.vx = -Math.abs(e.vx); }
        } else if (e.type === "mouse") {
          e.x += e.vx * slowAura * dt; if (e.x < e.minX) { e.x = e.minX; e.vx = Math.abs(e.vx); } if (e.x > e.maxX) { e.x = e.maxX; e.vx = -Math.abs(e.vx); }
          e.vy += 700 * dt; e.y += e.vy * dt; if (e.y > e.homeY) { e.y = e.homeY; e.vy = 0; if (Math.random() < 0.01) e.vy = -220; }
        } else if (e.type === "whisk") {
          if (e.stateT > 0.6) { e.stateT = 0; e.vx = (Math.random() - 0.5) * 120; e.vy = (Math.random() - 0.5) * 120; }
          e.x += e.vx * slowAura * dt; e.y += e.vy * slowAura * dt;
          if (e.x < e.minX) { e.x = e.minX; e.vx = Math.abs(e.vx); } if (e.x > e.maxX) { e.x = e.maxX; e.vx = -Math.abs(e.vx); }
          if (e.y < e.homeY - 30) { e.y = e.homeY - 30; e.vy = Math.abs(e.vy); } if (e.y > e.homeY + 30) { e.y = e.homeY + 30; e.vy = -Math.abs(e.vy); }
        } else if (e.type === "bubble") {
          e.y -= 18 * dt; e.x += Math.sin(e.stateT * 2) * 20 * dt;
          if (e.y < cameraY.current - 60) e.hp = 0;
          // push player
          if (Math.abs(e.x - (p.x + PW / 2)) < PW && Math.abs(e.y - (p.y + PH / 2)) < PH) { p.vx += (p.x + PW / 2 > e.x ? 1 : -1) * 200 * dt; p.vy -= 60 * dt; }
        } else if (e.type === "spatula") {
          const phase = e.stateT % 2.4; e.active = phase > 1.6 && phase < 2.1;
          e.y = e.active ? e.homeY - 22 : e.homeY + 10;
        }
      }
      world.current.enemies = world.current.enemies.filter((e) => e.hp > 0);

      // enemy collision with player (stomp vs hurt)
      for (const e of world.current.enemies) {
        if (e.type === "bubble") continue;
        if (!e.active && e.type === "spatula") continue;
        const ex = e.x - TILE * 0.4, ey = e.y - TILE * 0.4, ew = TILE * 0.8, eh = TILE * 0.8;
        if (p.x < ex + ew && p.x + PW > ex && p.y < ey + eh && p.y + PH > ey) {
          if (p.vy > 120 && p.prevY + PH <= ey + 6) { // stomp
            const dmg = 1 + (t.healOnDig ? 1 : 0); e.hp -= dmg; p.vy = -320; e.hitCd = 0.2; spawnDust(e.x, e.y, "#ffd27a", 10);
            if (e.hp <= 0) { score.current += 15; spawnDust(e.x, e.y, "#ff8fa0", 14); }
          } else if (e.hitCd <= 0) hurt();
        }
      }

      // boss step + collision
      if (bossActive.current && boss.current) {
        ctx.playerX = p.x + PW / 2; ctx.playerY = p.y + PH / 2;
        ctx.top = cameraY.current; ctx.bottom = cameraY.current + STAGE_H;
        stepBoss(boss.current, dt, ctx);
        if (boss.current.frozen > 0) { a.frozen = Math.max(a.frozen, boss.current.frozen); boss.current.frozen = 0; }
        const b = boss.current; const bx = b.x - 36, by = b.y - 36, bw = 72, bh = 72;
        if (p.x < bx + bw && p.x + PW > bx && p.y < by + bh && p.y + PH > by) {
          // no stomping bosses — you must use the plushie attack at the right moment
          hurt(); p.vy = -200; p.vx += (p.x + PW / 2 < b.x ? -1 : 1) * 140;
        }
      }

      // bullets
      for (let i = world.current.bullets.length - 1; i >= 0; i--) {
        const b = world.current.bullets[i]; b.life -= dt; if (b.life <= 0) { world.current.bullets.splice(i, 1); continue; }
        if (b.grav) b.vy += b.grav * dt;
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.kind === "panback") {
          const bo = boss.current;
          if (bo && Math.abs(b.x - bo.x) < 42 && Math.abs(b.y - bo.y) < 42) {
            if (bo.vulnerable || bo.stun > 0 || bo.type === "chef") { bo.hp -= 2; bo.flash = 0.2; shake.current = Math.max(shake.current, 4); spawnDust(bo.x, bo.y, "#7fc24a", 12); if (bo.hp <= 0) onBossDefeated(); }
            else { bo.shieldFlash = 0.2; }
            world.current.bullets.splice(i, 1); continue;
          }
        } else if (Math.abs(b.x - (p.x + PW / 2)) < PW * 0.7 && Math.abs(b.y - (p.y + PH / 2)) < PH * 0.7) { hurt(); world.current.bullets.splice(i, 1); continue; }
      }

      // breads + powers
      for (const b of world.current.breads) {
        if (b.taken) continue; b.phase += dt; if (b.y < cameraY.current - 60 || b.y > cameraY.current + STAGE_H + 60) continue;
        let bx = b.x, by = b.y;
        if (a.magnet > 0) { const dx = (p.x + PW / 2) - bx, dy = (p.y + PH / 2) - by; const dist = Math.hypot(dx, dy); if (dist < 150) { bx += (dx / dist) * 220 * dt; by += (dy / dist) * 220 * dt; b.x = bx; b.y = by; } }
        if (Math.abs(bx - (p.x + PW / 2)) < PW * 0.9 && Math.abs(by - (p.y + PH / 2)) < PH * 0.9) collectBread(b);
      }
      for (const pw of world.current.powers) {
        if (pw.taken) continue; if (pw.y < cameraY.current - 60 || pw.y > cameraY.current + STAGE_H + 60) continue;
        if (Math.abs(pw.x - (p.x + PW / 2)) < PW && Math.abs(pw.y - (p.y + PH / 2)) < PH) { pw.taken = true; spawnDust(pw.x, pw.y, "#7fd0ff", 12); if (pw.kind === "milk") a.shield = 999; if (pw.kind === "magnet") a.magnet = 18; if (pw.kind === "butter") a.speed = 12; if (pw.kind === "yeast") a.yeast = 30; }
      }

      // particles
      const ps = particles.current; for (let i = ps.length - 1; i >= 0; i--) { const q = ps[i]; q.life -= dt; if (q.life <= 0) { ps.splice(i, 1); continue; } q.vy += 260 * dt; q.x += q.vx * dt; q.y += q.vy * dt; }

      setTick((t2) => (t2 + 1) & 0xffff);
    };
    raf = requestAnimationFrame(step);

    const kd = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.right = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") { input.current.digEdge = true; e.preventDefault(); }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { input.current.jumpEdge = true; e.preventDefault(); }
      if (e.key === "j" || e.key === "J" || e.key === "x" || e.key === "X" || e.key === "Shift") { input.current.attackEdge = true; }
      if (e.key === "p" || e.key === "P" || e.key === "Escape") setPaused((v) => !v);
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.right = false;
    };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- render ----------
  const p = player.current; const cam = cameraY.current;
  const r0 = Math.floor(cam / TILE) - 1; const r1 = Math.floor((cam + STAGE_H) / TILE) + 1;
  const depth = maxDepth.current; const zone = zoneOf(depth);
  const pose: Pose = p.hurtTimer > 0 ? "hurt" : (!p.onGround && p.vy > 30 ? "fall" : p.digTimer > 0 ? "dig" : p.attackTimer > 0 ? "dig" : "idle");
  const flick = p.invuln > 0 && Math.floor(elapsed.current * 16) % 2 === 0;

  const tiles: ReactElement[] = [];
  for (let r = r0; r <= r1; r++) {
    ensureRow(r); const row = world.current.rows[r]; if (!row) continue;
    const z = zoneOf(Math.max(0, r - 3)); const isRest = world.current.isRest[r]; const isArena = world.current.isBoss[r];
    for (let c = 0; c < COLS; c++) {
      const cell = row[c];
      if (cell === 0) { if (isRest) tiles.push(<RestTile key={`r${r}-${c}`} c={c} r={r} level={level.current} />); else if (isArena) tiles.push(<ArenaTile key={`a${r}-${c}`} c={c} r={r} />); continue; }
      tiles.push(<Tile key={`${r}-${c}`} c={c} r={r} cell={cell} zone={z} />);
      if (isArena && (c === 0 || c === COLS - 1) && r % 3 === 0) tiles.push(<Torch key={`t${r}-${c}`} c={c} r={r} />);
    }
  }

  const aimPc = Math.floor((p.x + PW / 2) / TILE); const aimPr = Math.floor((p.y + PH / 2) / TILE);
  const aimR = aimPr + aim.current.y; const aimC = aimPc + aim.current.x;
  const activeList: { kind: string; t: number }[] = [];
  if (active.current.shield > 0) activeList.push({ kind: "milk", t: active.current.shield > 100 ? -1 : active.current.shield });
  if (active.current.magnet > 0) activeList.push({ kind: "magnet", t: active.current.magnet });
  if (active.current.speed > 0) activeList.push({ kind: "butter", t: active.current.speed });
  if (active.current.yeast > 0) activeList.push({ kind: "yeast", t: active.current.yeast });

  const buyPower = (kind: string, cost: number) => { if (breadRun.current < cost) return; breadRun.current -= cost; if (kind === "shield") active.current.shield = 999; if (kind === "magnet") active.current.magnet = 22; if (kind === "butter") active.current.speed = 14; if (kind === "heal") hearts.current = Math.min(5, hearts.current + 1); if (kind === "yeast") active.current.yeast = 30; setTick((t) => t + 1); };
  const buyTool = (id: ToolId) => {
    const def = TOOL_MAP[id]; const have = ownedTools.current.includes(id) || ownedMeta.includes(id);
    if (have) { tool.current = id; setTick((t) => t + 1); return; }
    if (def.priceCrowns > 0) { if (crownsRun.current < def.priceCrowns) return; crownsRun.current -= def.priceCrowns; }
    else { if (breadRun.current < def.priceBread) return; breadRun.current -= def.priceBread; }
    ownedTools.current = [...ownedTools.current, id]; tool.current = id; setTick((t) => t + 1);
  };

  const shx = shake.current > 0 ? (Math.random() - 0.5) * shake.current : 0;
  const shy = shake.current > 0 ? (Math.random() - 0.5) * shake.current : 0;
  const arc = p.attackTimer > 0 ? attackArc() : null;
  const isFoot = TOOL_MAP[tool.current].footwear;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div ref={stageRef} className="relative overflow-hidden" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: "center center", borderRadius: 18, boxShadow: "0 0 0 4px #1a0c04, 0 20px 60px rgba(0,0,0,.7)" }}>
        <KitchenBG depth={depth} />
        <Flour count={10} />

        <div className="absolute left-0 top-0" style={{ width: STAGE_W, transform: `translate3d(${shx}px, ${-cam + shy}px, 0)` }}>
          {tiles}

          {!bossActive.current && (
            <div className="absolute pointer-events-none" style={{ left: aimC * TILE, top: aimR * TILE, width: TILE, height: TILE }}>
              <div className="absolute inset-1 rounded-md border-2 border-dashed" style={{ borderColor: "#ffe06688", animation: "glow-pulse 1s infinite" }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-200 font-display text-lg" style={{ textShadow: "0 1px 2px #000" }}>{aim.current.y === 1 ? "↓" : aim.current.x === -1 ? "←" : "→"}</div>
            </div>
          )}

          {world.current.breads.filter((b) => !b.taken && b.y > cam - 40 && b.y < cam + STAGE_H + 40).map((b) => (<div key={b.id} className="absolute" style={{ left: b.x - 14, top: b.y - 14 + Math.sin(b.phase * 2) * 3 }}><Bread type={b.type} size={28} /></div>))}
          {world.current.powers.filter((pw) => !pw.taken && pw.y > cam - 40 && pw.y < cam + STAGE_H + 40).map((pw) => (<div key={pw.id} className="absolute hop" style={{ left: pw.x - 15, top: pw.y - 15 }}><div className="rounded-full bg-white/20 p-1 border border-white/40" style={{ boxShadow: "0 0 10px #7fd0ff" }}><PowerIcon kind={pw.kind} size={22} /></div></div>))}
          {world.current.enemies.filter((e) => e.y > cam - 60 && e.y < cam + STAGE_H + 60).map((e) => (<div key={e.id} className="absolute" style={{ left: e.x - 20, top: e.y - 20, transform: `scaleX(${e.vx < 0 ? -1 : 1})`, opacity: e.hitCd > 0 ? 0.5 : 1, filter: e.hitCd > 0 ? "brightness(2)" : undefined }}><EnemyView type={e.type} active={e.active} /></div>))}
          {world.current.bullets.filter((b) => b.y > cam - 40 && b.y < cam + STAGE_H + 40).map((b) => <BulletView key={b.id} b={b} />)}
          {particles.current.map((q, i) => (<div key={i} className="absolute rounded-full" style={{ left: q.x, top: q.y, width: q.size, height: q.size, background: q.color, opacity: Math.max(0, q.life / q.max) }} />))}

          {bossActive.current && boss.current && (
            <div className="absolute" style={{ left: boss.current.x - 55, top: boss.current.y - 55, pointerEvents: "none" }}>
              <BossView boss={boss.current} size={110} />
            </div>
          )}

          {arc && (
            <div className="absolute pointer-events-none" style={{ left: arc.x, top: arc.y, width: arc.w, height: arc.h }}>
              <svg width={arc.w} height={arc.h} viewBox="0 0 44 36" style={{ transform: `scaleX(${p.facing})`, opacity: p.attackTimer / 0.18 }}>
                <path d="M4 18 Q22 -4 40 18 Q22 40 4 18 Z" fill="none" stroke="#fff3d6" strokeWidth="3" strokeLinecap="round" />
                <path d="M10 18 Q22 6 34 18" fill="none" stroke="#ffd27a" strokeWidth="2" />
              </svg>
            </div>
          )}

          <div className="absolute" style={{ left: p.x - 6, top: p.y - 14, width: PW + 12, height: PH + 18, opacity: flick ? 0.35 : 1, transition: "opacity .05s" }}>
            {active.current.shield > 0 && <div className="absolute inset-0 rounded-full border-2 border-cyan-300" style={{ boxShadow: "0 0 12px #7fd0ff", animation: "glow-pulse 1.2s infinite" }} />}
            {active.current.frozen > 0 && <div className="absolute inset-0 rounded-full" style={{ background: "#7fd0ff33", boxShadow: "inset 0 0 10px #7fd0ff" }} />}
            {!isFoot && <div className="absolute" style={{ left: p.facing === 1 ? PW - 2 + (p.attackTimer > 0 ? 6 : 0) : -12 - (p.attackTimer > 0 ? 6 : 0), top: PH * 0.48, zIndex: 2, transform: p.attackTimer > 0 ? `rotate(${p.facing * -25}deg)` : undefined, transition: "transform .08s" }}><Plushie id={tool.current} size={tool.current === "kissy" ? 26 : 22} flip={p.facing} /></div>}
            <Maxine skin={skin} pose={pose} facing={p.facing} size={PW + 18} />
            {isFoot && <div className="absolute pointer-events-none" style={{ left: -2, top: PH * 0.82, width: PW + 12, height: 14, zIndex: 3 }}><Plushie id="zapatitos" size={PW + 12} /></div>}
          </div>
        </div>

        {/* HUD */}
        <div className="absolute top-2 left-2 flex gap-1 z-30">{Array.from({ length: Math.max(3, hearts.current) }).map((_, i) => <Heart key={i} filled={i < hearts.current} size={20} />)}</div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-30">
          <div className="flex items-center gap-1 bg-black/45 rounded-full px-2 py-0.5 border border-amber-300/30"><Crown size={12} /><span className="font-pixel text-[10px] text-amber-200">{crownsRun.current}</span></div>
          <div className="flex items-center gap-1 bg-black/45 rounded-full px-2 py-0.5 border border-amber-300/30"><span className="text-[12px]">🍞</span><span className="font-pixel text-[10px] text-amber-100">{breadRun.current}</span></div>
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
          <div className="font-pixel text-[8px] text-amber-200/80">NIVEL {level.current} · {ZONE_NAME[zone]}</div>
          <div className="font-display font-bold text-amber-50 text-base leading-none" style={{ textShadow: "0 2px 0 #7a3410" }}>{depth} m</div>
        </div>
        <div className="absolute top-[58px] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1 bg-black/35 rounded-full px-2 py-0.5 border border-amber-300/20"><Plushie id={tool.current} size={14} /><span className="font-pixel text-[8px] text-amber-100">{TOOL_MAP[tool.current].name}</span></div>

        {bossActive.current && boss.current && (
          <div className="absolute left-4 right-4 z-30 pointer-events-none" style={{ top: 86 }}>
            <div className="text-center font-pixel text-[9px] text-rose-200 mb-0.5" style={{ textShadow: "0 0 6px #ff3060" }}>{BOSS_NAME[boss.current.type]}</div>
            <div className="h-2.5 rounded-full border border-rose-300/50 bg-black/50 overflow-hidden">
              <div className="h-full" style={{ width: `${Math.max(0, (boss.current.hp / boss.current.maxHp) * 100)}%`, background: "linear-gradient(90deg,#ff3060,#ffd27a)", transition: "width .15s", boxShadow: "0 0 8px #ff306088" }} />
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {boss.current.stun > 0 ? <span className="font-pixel text-[7px] px-1.5 py-0.5 rounded-full bg-amber-300 text-amber-900">ATURDIDO</span>
                : boss.current.vulnerable ? <span className="font-pixel text-[7px] px-1.5 py-0.5 rounded-full bg-lime-300 text-lime-900">VULNERABLE</span>
                : <span className="font-pixel text-[7px] px-1.5 py-0.5 rounded-full bg-rose-400/80 text-white">PROTEGIDO</span>}
              <span className="font-display italic text-[10px] text-amber-100/80">{BOSS_TAUNT[boss.current.type]}</span>
            </div>
          </div>
        )}

        <button onClick={() => setPaused((v) => !v)} className="absolute top-10 right-2 z-40 bg-black/45 rounded-md px-2 py-1 font-pixel text-[9px] text-amber-100 border border-amber-300/30">{paused ? "▶" : "❚❚"}</button>

        {activeList.length > 0 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {activeList.map((a2, i) => (<div key={i} className="relative bg-black/55 rounded-full p-1.5 border border-white/30"><PowerIcon kind={a2.kind} size={22} />{a2.t >= 0 && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-pixel text-[7px] text-amber-100">{Math.ceil(a2.t)}</div>}</div>))}
          </div>
        )}

        {/* controls */}
        <div className="absolute bottom-3 left-3 flex gap-2 z-30">
          <TouchBtn label="◀" onDown={() => (input.current.left = true)} onUp={() => (input.current.left = false)} />
          <TouchBtn label="▶" onDown={() => (input.current.right = true)} onUp={() => (input.current.right = false)} />
        </div>
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2 z-30">
          <TouchBtn label="SALTO" color="jump" onDown={() => (input.current.jumpEdge = true)} onUp={() => {}} />
          <div className="flex gap-2">
            <TouchBtn label="👊" color="attack" onDown={() => (input.current.attackEdge = true)} onUp={() => {}} />
            <TouchBtn label="CAVAR" color="dig" big onDown={() => (input.current.digEdge = true)} onUp={() => {}} />
          </div>
        </div>

        {paused && !resting && (
          <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
            <div className="font-display font-bold text-4xl text-amber-100">PAUSA</div>
            <Maxine skin={skin} pose="idle" size={120} />
            <div className="font-pixel text-[8px] text-amber-200/70 text-center leading-relaxed px-6">
              ← → moverse · ESPACIO saltar<br />↓ cavar · J / X pegar · P pausa
            </div>
            <button onClick={() => setPaused(false)} className="btn-3d font-display font-bold text-xl text-white px-8 py-2 rounded-full border-b-4" style={{ background: "linear-gradient(180deg,#7fc24a,#3a7a1a)", borderColor: "#1a3a08" }}>CONTINUAR</button>
          </div>
        )}

        {resting && <RestStop level={level.current} bread={breadRun.current} crowns={crownsRun.current} hearts={hearts.current} tool={tool.current} owned={ownedTools.current} ownedMeta={ownedMeta} onBuyPower={buyPower} onBuyTool={buyTool} onContinue={() => setResting(false)} />}
      </div>
    </div>
  );
}

function TouchBtn({ label, onDown, onUp, big, color }: { label: string; onDown: () => void; onUp: () => void; big?: boolean; color?: "jump" | "attack" | "dig" }) {
  const palette = color === "jump" ? ["#7fc24a", "#3a7a1a", "#1a3a08"] : color === "attack" ? ["#d96bff", "#7a1aa8", "#3a0858"] : color === "dig" ? ["#ff7a4a", "#d9342b", "#7a1410"] : ["#7a5a3a", "#3a2410", "#1a0c04"];
  return (
    <button onPointerDown={(e) => { e.preventDefault(); onDown(); }} onPointerUp={onUp} onPointerLeave={onUp} onPointerCancel={onUp}
      className={`btn-3d select-none font-display font-bold text-amber-50 rounded-full border-b-4 active:border-b-0 ${big ? "px-5 py-3 text-base" : "w-14 h-14 text-lg"}`}
      style={{ background: `linear-gradient(180deg,${palette[0]},${palette[1]})`, borderColor: palette[2], boxShadow: "0 4px 10px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.25)" }}>{label}</button>
  );
}

function EnemyView({ type, active }: { type: EnemyType; active: boolean }) {
  if (type === "spoon") return (<svg width="40" height="40" viewBox="0 0 48 48"><rect x="22" y="22" width="4" height="22" rx="2" fill="#d7d2c4" stroke="#6a6555" strokeWidth="1.2" /><ellipse cx="24" cy="14" rx="10" ry="12" fill="#ece7d6" stroke="#6a6555" strokeWidth="1.4" /><circle cx="21" cy="14" r="1.4" fill="#1a1a1a" /><circle cx="27" cy="14" r="1.4" fill="#1a1a1a" /><path d="M21 18 q3 2 6 0" stroke="#1a1a1a" strokeWidth="1" fill="none" /></svg>);
  if (type === "mouse") return (<svg width="40" height="28" viewBox="0 0 48 32"><path d="M40 22 Q48 18 44 12" stroke="#b08a6a" strokeWidth="2" fill="none" /><ellipse cx="22" cy="20" rx="16" ry="9" fill="#c9a888" stroke="#6a4a2a" strokeWidth="1.2" /><circle cx="10" cy="16" r="6" fill="#c9a888" stroke="#6a4a2a" strokeWidth="1.2" /><circle cx="8" cy="10" r="4" fill="#e0b894" /><circle cx="14" cy="10" r="4" fill="#e0b894" /><circle cx="9" cy="15" r="1.2" fill="#1a1a1a" /><circle cx="4" cy="17" r="1.4" fill="#ff8fa0" /></svg>);
  if (type === "whisk") return (<svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "spin-slow 0.3s linear infinite" }}><rect x="18" y="2" width="4" height="14" rx="2" fill="#7a4410" />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M20 16 Q${8 + i * 6} 28 20 38 Q${32 - i * 6} 28 20 16`} fill="none" stroke="#d7d2c4" strokeWidth="1.6" />)}</svg>);
  if (type === "bubble") return (<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#b6e6ff33" stroke="#7fd0ff" strokeWidth="1.5" /><circle cx="14" cy="14" r="3" fill="#fff" opacity="0.8" /><circle cx="24" cy="22" r="1.4" fill="#fff" opacity="0.6" /></svg>);
  // spatula
  return (<svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: active ? 1 : 0.3 }}><rect x="17" y="20" width="6" height="18" rx="2" fill="#5a3a1a" /><rect x="10" y="6" width="20" height="16" rx="3" fill="#d7d2c4" stroke="#5a5545" strokeWidth="1.2" /><rect x="14" y="10" width="2" height="8" fill="#5a5545" /><rect x="19" y="10" width="2" height="8" fill="#5a5545" /><rect x="24" y="10" width="2" height="8" fill="#5a5545" /></svg>);
}

function Tile({ c, r, cell, zone }: { c: number; r: number; cell: Cell; zone: string }) {
  const pal: Record<string, { dirt: string; dirtDk: string; wall: string; wallDk: string }> = {
    mesa: { dirt: "#b07a3c", dirtDk: "#7a4a1c", wall: "#e4d2ac", wallDk: "#a89068" },
    horno: { dirt: "#6a2e14", dirtDk: "#3a1608", wall: "#8a3a22", wallDk: "#4a1808" },
    nevera: { dirt: "#8fc6dd", dirtDk: "#4a8aa8", wall: "#d8eef6", wallDk: "#8ab6cc" },
    despensa: { dirt: "#8a5a2c", dirtDk: "#4a2c10", wall: "#c9a06a", wallDk: "#7a5428" },
    sotano: { dirt: "#3a2450", dirtDk: "#1c1030", wall: "#4a3468", wallDk: "#241438" },
  };
  const P = pal[zone] || pal.mesa; const x = c * TILE, y = r * TILE;
  if (cell === 3) return (<div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE }}><svg width={TILE} height={TILE} viewBox="0 0 45 45"><rect x="0" y="34" width="45" height="11" fill={P.wallDk} />{Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${3 + i * 9} 34 L${7.5 + i * 9} 8 L${12 + i * 9} 34 Z`} fill="#d7d2c4" stroke="#5a5545" strokeWidth="1" />)}</svg></div>);
  if (cell === 4) return <div className="absolute rounded-md" style={{ left: x + 3, top: y + 3, width: TILE - 6, height: TILE - 6, background: "radial-gradient(circle at 40% 30%, #ffe08a99, #c9842a99)", border: "2px solid #7a441066" }} />;
  if (cell === 5) return <div className="absolute rounded-md" style={{ left: x + 2, top: y + 6, width: TILE - 4, height: TILE - 10, background: "linear-gradient(180deg,#5a4010aa,#2a1c08cc)", border: "1px solid #ffe06655" }} />;
  if (cell === 2) return (<div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: P.wall, boxShadow: `inset 0 -4px 0 ${P.wallDk}, inset 0 3px 0 rgba(255,255,255,.18)` }}><div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, ${P.wallDk}66 0 2px, transparent 2px ${TILE / 2}px), linear-gradient(to bottom, ${P.wallDk}66 0 2px, transparent 2px ${TILE / 2}px)`, backgroundSize: `${TILE / 2}px ${TILE / 2}px` }} /></div>);
  return (<div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: P.dirt, boxShadow: `inset 0 -4px 0 ${P.dirtDk}, inset 0 3px 0 rgba(255,255,255,.12)` }}><div className="absolute rounded-sm" style={{ left: 6, top: 8, width: 7, height: 6, background: P.dirtDk, opacity: 0.6 }} /><div className="absolute rounded-sm" style={{ left: 26, top: 20, width: 9, height: 7, background: P.dirtDk, opacity: 0.5 }} />{zone === "horno" && <div className="absolute rounded-full" style={{ left: 30, top: 8, width: 4, height: 4, background: "#ff7a2a", boxShadow: "0 0 6px #ff7a2a", animation: "flicker 1s infinite" }} />}</div>);
}

function ArenaTile({ c, r }: { c: number; r: number }) {
  const x = c * TILE, y = r * TILE;
  return <div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "radial-gradient(circle at 50% 0%, #3a1a3044, #14081488)", boxShadow: "inset 0 0 0 1px #ff306011" }} />;
}
function Torch({ c, r }: { c: number; r: number }) {
  const x = c * TILE + (c === 0 ? TILE - 8 : 2);
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: r * TILE + 6, width: 10, height: 20 }}>
      <rect x="3" y="8" width="4" height="10" fill="#3a2010" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-4 rounded-full flicker" style={{ background: "radial-gradient(circle,#ffd27a,#ff5a2a 70%,transparent)", filter: "drop-shadow(0 0 8px #ff7a2a)" }} />
    </div>
  );
}
function RestTile({ c, r, level }: { c: number; r: number; level: number }) {
  const x = c * TILE, y = r * TILE; const isMid = c === 3 || c === 4; const isTop = offOf(r) === LEVEL_LEN + ARENA_H + 1;
  return (<div className="absolute" style={{ left: x, top: y, width: TILE, height: TILE, background: "repeating-conic-gradient(#e8c89a 0% 25%, #d9a86a 0% 50%) 0 0 / 22px 22px", boxShadow: "inset 0 0 0 1px #7a441033" }}>{isTop && isMid && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"><div className="bg-[#fff3d6] border-2 border-[#7a3410] rounded px-2 py-0.5 font-display font-bold text-[#7a3410] text-[10px] shadow pop whitespace-nowrap">¡NIVEL {level}! · descanso</div></div>}</div>);
}

function KitchenBG({ depth }: { depth: number }) {
  const zone = zoneOf(depth);
  const palettes: Record<string, { sky: string; glow: string; accent: string }> = { mesa: { sky: "#3a2410", glow: "#ffb347", accent: "#7a4a22" }, horno: { sky: "#2a0e08", glow: "#ff5a2a", accent: "#7a2410" }, nevera: { sky: "#0e2436", glow: "#7fd0ff", accent: "#2a5a7a" }, despensa: { sky: "#2a1a08", glow: "#e3a35a", accent: "#6a4420" }, sotano: { sky: "#14081f", glow: "#b06bff", accent: "#3a1a5a" } };
  const p = palettes[zone];
  return (<div className="absolute inset-0"><div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${p.glow}44 0%, ${p.sky} 60%, #0a0402 100%)` }} /><svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 360 640" preserveAspectRatio="none"><g stroke={p.accent} strokeWidth="2" fill="none"><line x1="60" y1="0" x2="60" y2="60" /><line x1="300" y1="0" x2="300" y2="90" /></g><circle cx="60" cy="72" r="12" fill={p.accent} /><path d="M288 102 h24 v10 a12 12 0 0 1 -24 0 Z" fill={p.accent} /></svg><div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[140%] h-40 rounded-full blur-2xl" style={{ background: p.glow, opacity: 0.15, animation: "glow-pulse 3s ease-in-out infinite" }} /><div className="absolute inset-0" style={{ boxShadow: "inset 0 0 80px 10px rgba(0,0,0,.6)" }} /></div>);
}

/* REST STOP */
interface RestProps { level: number; bread: number; crowns: number; hearts: number; tool: ToolId; owned: ToolId[]; ownedMeta: ToolId[]; onBuyPower: (kind: string, cost: number) => void; onBuyTool: (id: ToolId) => void; onContinue: () => void; }
function RestStop({ level, bread, crowns, hearts, tool, owned, ownedMeta, onBuyPower, onBuyTool, onContinue }: RestProps) {
  const POWERS = [
    { kind: "shield", name: "Escudo Leche", cost: 30, icon: "🥛" },
    { kind: "magnet", name: "Imán", cost: 40, icon: "🧲" },
    { kind: "butter", name: "Mantequilla", cost: 35, icon: "🧈" },
    { kind: "yeast", name: "Levadura (doble salto)", cost: 45, icon: "🫧" },
    { kind: "heal", name: "+1 corazón", cost: 60, icon: "❤" },
  ];
  return (
    <div className="absolute inset-0 z-50 overflow-hidden" style={{ background: "radial-gradient(80% 60% at 50% 30%, #5a3418 0%, #2a1408 70%, #140804 100%)" }}>
      <Flour count={14} />
      <svg className="absolute top-0 inset-x-0 w-full" height="50" viewBox="0 0 360 50" preserveAspectRatio="none">{[60, 180, 300].map((x, i) => <g key={i}><line x1={x} y1="0" x2={x} y2="22" stroke="#3a2010" strokeWidth="1.5" /><circle cx={x} cy="28" r="6" fill="#ffd27a" style={{ filter: "drop-shadow(0 0 8px #ffb347)", animation: `glow-pulse ${2 + i * 0.3}s infinite` }} /></g>)}</svg>
      <div className="absolute top-3 inset-x-0 text-center slide-up">
        <div className="font-pixel text-[9px] text-amber-200/70">DESCANSO · JEFE DERROTADO</div>
        <h2 className="font-display font-bold text-3xl text-amber-100" style={{ textShadow: "0 3px 0 #7a3410" }}>Nivel {level} ✓</h2>
      </div>
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 pop"><Maxine pose="win" size={96} /></div>
      <div className="absolute top-[36%] left-1/2 -translate-x-1/2 flex gap-2">
        <Pill icon="🍞" value={bread} color="#ffd27a" /><Pill iconCrown value={crowns} color="#ff8fa0" /><Pill icon="❤" value={hearts} color="#ff5a6a" />
      </div>
      <div className="absolute left-0 right-0 top-[44%] bottom-14 overflow-y-auto scrollbar-none px-3 space-y-3">
        <Section title="Power-ups">
          <div className="grid grid-cols-2 gap-2">{POWERS.map((pw) => { const can = bread >= pw.cost; return (<button key={pw.kind} disabled={!can} onClick={() => onBuyPower(pw.kind, pw.cost)} className="btn-3d text-left rounded-lg border-2 p-2 flex items-center gap-2 disabled:opacity-50" style={{ background: "#3a2010", borderColor: can ? "#ffd27a" : "#1a0c04", boxShadow: "0 3px 0 #1a0c04" }}><span className="text-xl">{pw.icon}</span><div className="flex-1"><div className="font-display font-bold text-amber-100 text-sm leading-tight">{pw.name}</div><div className="font-pixel text-[8px] text-amber-200/80">🍞 {pw.cost}</div></div></button>); })}</div>
        </Section>
        <Section title="Herramientas de cavado">
          <div className="grid grid-cols-2 gap-2">{TOOLS.filter((t2) => t2.id !== "palito").map((t2) => { const have = owned.includes(t2.id) || ownedMeta.includes(t2.id); const equipped = tool === t2.id; const price = t2.priceCrowns > 0 ? t2.priceCrowns : t2.priceBread; const curr = t2.priceCrowns > 0 ? crowns : bread; const can = have || curr >= price; return (<button key={t2.id} disabled={!can} onClick={() => onBuyTool(t2.id)} className="btn-3d text-left rounded-lg border-2 p-2 flex items-center gap-2 disabled:opacity-50" style={{ background: equipped ? "#5a3216" : "#3a2010", borderColor: equipped ? t2.color : can ? "#ffd27a88" : "#1a0c04", boxShadow: "0 3px 0 #1a0c04" }}><div className="w-10 h-10 rounded bg-black/40 flex items-center justify-center shrink-0"><Plushie id={t2.id} size={30} /></div><div className="flex-1 min-w-0"><div className="font-display font-bold text-amber-100 text-sm leading-tight truncate">{t2.name}</div><div className="font-pixel text-[7px] text-amber-200/70 leading-tight">{t2.tag}</div><div className="font-pixel text-[8px] mt-0.5" style={{ color: t2.color }}>{equipped ? "EN MANO" : have ? "EQUIPAR" : t2.priceCrowns > 0 ? `👑 ${price}` : `🍞 ${price}`}</div></div></button>); })}</div>
        </Section>
      </div>
      <div className="absolute bottom-2 inset-x-0 px-6 z-10"><button onClick={onContinue} className="btn-3d w-full font-display font-bold text-xl text-white py-2.5 rounded-full border-b-4 active:border-b-0" style={{ background: "linear-gradient(180deg,#7fc24a,#3a7a1a)", borderColor: "#1a3a08", boxShadow: "0 6px 14px rgba(58,122,26,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}>SEGUIR CAVANDO ▶</button></div>
    </div>
  );
}

function Pill({ icon, iconCrown, value, color }: { icon?: string; iconCrown?: boolean; value: number; color: string }) { return (<div className="flex items-center gap-1 bg-black/55 rounded-full px-2.5 py-1 border border-amber-300/30">{iconCrown ? <Crown size={12} /> : <span className="text-[12px]">{icon}</span>}<span className="font-pixel text-[10px]" style={{ color }}>{value}</span></div>); }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return (<div className="bg-black/35 rounded-xl p-2 border border-amber-300/20 slide-up"><div className="font-display font-bold text-amber-100 text-sm mb-1.5 px-1">{title}</div>{children}</div>); }
