export type BossType = "vacuum" | "chef" | "fridge" | "oven" | "bread" | "bigotes";

export interface Part { id: number; ox: number; oy: number; hp: number; maxHp: number; kind: "compressor" | "arm"; flash: number; }
export interface Boss {
  type: BossType;
  x: number; y: number; vx: number; vy: number;
  hp: number; maxHp: number;
  t: number; cd: number; phase: number; flash: number;
  homeY: number; minX: number; maxX: number;
  frozen: number; charge: number;
  // new mechanics
  stun: number; telegraph: number; vulnerable: boolean; shieldFlash: number;
  parts: Part[]; phase2: boolean; vulnTimer: number;
}

export interface Bullet {
  id: number; x: number; y: number; vx: number; vy: number;
  life: number; kind: "dust" | "pan" | "panback" | "ice" | "flame" | "crumb" | "shock" | "bark";
  grav?: number;
}

export interface BossCtx {
  playerX: number; playerY: number;
  left: number; right: number; top: number; bottom: number;
  spawnBullet: (b: Omit<Bullet, "id">) => void;
  spawnMouse: (x: number, y: number) => void;
  shake: (n: number) => void;
}

export function bossForLevel(level: number): BossType {
  if (level === 5) return "bigotes";
  if (level > 5 && level % 5 === 0) return "bigotes";
  const order: BossType[] = ["vacuum", "chef", "fridge", "oven", "bread"];
  if (level <= 4) return order[level - 1];
  return order[(level - 1) % 5];
}
export const BOSS_NAME: Record<BossType, string> = {
  vacuum: "LA ASPIRADORA", chef: "CHEF FANTASMA", fridge: "NEVERA MALVADA",
  oven: "HORNO COLOSAL", bread: "PAN MONSTRUO", bigotes: "BIGOTES EL FEO",
};
export const BOSS_TAUNT: Record<BossType, string> = {
  vacuum: "Golpeala cuando se detenga a cargar.",
  chef: "Espera a que aterrice · devolvele sus sartenes.",
  fridge: "Rompe los 3 compresores primero.",
  oven: "Esquiva la embestida · pegale al subir.",
  bread: "Cortale los brazos de masa.",
  bigotes: "¡Rescata a Javiera! Esquiva sus embestidas.",
};

export function spawnBoss(type: BossType, level: number, left: number, right: number, top: number): Boss {
  const baseHp = 6 + level * 2;
  const maxHp = type === "bread" ? baseHp + 4 : type === "bigotes" ? baseHp + 8 : baseHp;
  const parts: Part[] = [];
  if (type === "fridge") {
    parts.push({ id: 1, ox: -34, oy: -6, hp: 1, maxHp: 1, kind: "compressor", flash: 0 });
    parts.push({ id: 2, ox: 34, oy: -6, hp: 1, maxHp: 1, kind: "compressor", flash: 0 });
    parts.push({ id: 3, ox: 0, oy: -34, hp: 1, maxHp: 1, kind: "compressor", flash: 0 });
  }
  if (type === "bread") {
    parts.push({ id: 1, ox: -34, oy: 6, hp: 2, maxHp: 2, kind: "arm", flash: 0 });
    parts.push({ id: 2, ox: 34, oy: 6, hp: 2, maxHp: 2, kind: "arm", flash: 0 });
  }
  return {
    type, x: (left + right) / 2, y: top + 90, vx: type === "bigotes" ? 120 : 50, vy: 0,
    hp: maxHp, maxHp, t: 0, cd: 1.4, phase: 0, flash: 0,
    homeY: top + 90, minX: left + 40, maxX: right - 40, frozen: 0, charge: 0,
    stun: 0, telegraph: 0, vulnerable: false, shieldFlash: 0, parts, phase2: false, vulnTimer: 0,
  };
}

export function bossPartsWorld(b: Boss) { return b.parts.map((p) => ({ ...p, x: b.x + p.ox, y: b.y + p.oy })); }

export function stepBoss(b: Boss, dt: number, ctx: BossCtx) {
  b.t += dt; b.flash = Math.max(0, b.flash - dt); b.shieldFlash = Math.max(0, b.shieldFlash - dt);
  b.stun = Math.max(0, b.stun - dt); b.telegraph = Math.max(0, b.telegraph - dt); b.vulnTimer = Math.max(0, b.vulnTimer - dt); b.cd -= dt;
  for (const p of b.parts) p.flash = Math.max(0, p.flash - dt);
  const enraged = 1 + Math.min(1.5, (b.maxHp - b.hp) / b.maxHp);
  const stunned = b.stun > 0;

  if (b.type === "vacuum") {
    if (stunned) { b.vulnerable = true; b.x += Math.sin(b.t * 30) * 0.6; }
    else {
      // cycle: move 2.2s → telegraph+charge 0.9s (vulnerable)
      const cycle = b.t % 3.1;
      if (cycle > 2.2) { b.telegraph = Math.max(b.telegraph, 0.05); b.vulnerable = true; b.vx *= 0.85; }
      else { b.vulnerable = false; b.x += b.vx * enraged * dt; if (b.x < b.minX) { b.x = b.minX; b.vx = Math.abs(b.vx); } if (b.x > b.maxX) { b.x = b.maxX; b.vx = -Math.abs(b.vx); } }
      b.y = b.homeY + Math.sin(b.t * 1.4) * 14;
      if (b.cd <= 0 && cycle < 2.2) { b.cd = 2.0 / enraged; for (let i = -1; i <= 1; i++) ctx.spawnBullet({ x: b.x + i * 14, y: b.y + 22, vx: i * 30, vy: 140, life: 3, kind: "dust", grav: 40 }); }
    }
  } else if (b.type === "chef") {
    b.vulnerable = stunned || b.vulnTimer > 0;
    if (stunned) { b.x += Math.sin(b.t * 30) * 0.6; }
    else {
      if (b.cd <= 0) {
        b.cd = 1.5 / enraged;
        const anchors = [b.minX + 20, (b.minX + b.maxX) / 2, b.maxX - 20];
        const target = anchors[(b.phase + 1) % 3]; b.phase++;
        b.vx = (target - b.x) / 0.45; b.vy = -200;
        const dx = ctx.playerX - b.x, dy = ctx.playerY - b.y; const d = Math.hypot(dx, dy) || 1;
        ctx.spawnBullet({ x: b.x, y: b.y + 10, vx: (dx / d) * 150, vy: (dy / d) * 120 - 40, life: 3, kind: "pan", grav: 180 });
      }
      b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 380 * dt;
      if (b.y > b.homeY + 40) { if (b.vy > 0) { b.vulnTimer = 0.55; ctx.shake(3); } b.y = b.homeY + 40; b.vy = 0; b.vx *= 0.5; }
    }
  } else if (b.type === "fridge") {
    b.vulnerable = stunned || b.parts.length === 0;
    if (b.parts.length === 0 && b.stun <= 0) b.stun = 3; // window after parts destroyed
    b.x += b.vx * 0.6 * dt; if (b.x < b.minX) { b.x = b.minX; b.vx = Math.abs(b.vx); } if (b.x > b.maxX) { b.x = b.maxX; b.vx = -Math.abs(b.vx); }
    b.y = b.homeY + Math.sin(b.t * 0.8) * 6;
    if (b.cd <= 0) { b.cd = 1.3 / enraged; const dir = b.phase % 2 === 0 ? 1 : -1; b.phase++; ctx.spawnBullet({ x: b.x + dir * 22, y: b.y + 6, vx: dir * 180, vy: 0, life: 3, kind: "ice" }); if (b.phase % 4 === 0) b.frozen = 1.4; }
  } else if (b.type === "oven") {
    if (stunned) { b.vulnerable = true; }
    else if (b.charge <= 0) {
      b.vulnerable = false;
      b.x += b.vx * 0.8 * dt; if (b.x < b.minX) { b.x = b.minX; b.vx = Math.abs(b.vx); } if (b.x > b.maxX) { b.x = b.maxX; b.vx = -Math.abs(b.vx); }
      b.y += (b.homeY - b.y) * Math.min(1, dt * 3);
      if (b.cd <= 0) { b.cd = 2.4 / enraged; b.charge = 0.8; b.x = ctx.playerX; b.telegraph = 0.5; }
    } else {
      b.vulnerable = false; // i-frames during slam
      b.charge -= dt; b.y += 460 * dt;
      if (b.y > ctx.bottom - 80) {
        b.y = ctx.bottom - 80; b.charge = 0; b.vulnTimer = 1.1; ctx.shake(8);
        for (let i = 0; i < 5; i++) ctx.spawnBullet({ x: b.x + (Math.random() - 0.5) * 20, y: b.y + 20 - i * 14, vx: 0, vy: -30, life: 1.4, kind: "flame" });
        ctx.spawnBullet({ x: b.x, y: b.y + 20, vx: 140, vy: 0, life: 2, kind: "shock" });
        ctx.spawnBullet({ x: b.x, y: b.y + 20, vx: -140, vy: 0, life: 2, kind: "shock" });
      }
    }
  } else if (b.type === "bread") {
    b.vulnerable = stunned || b.parts.length === 0;
    const sp = b.parts.length === 0 ? 1.5 : 1;
    if (b.cd <= 0) { b.cd = (1.7 / enraged) / sp; const dir = ctx.playerX > b.x ? 1 : -1; b.vx = dir * 120 * sp; b.vy = -260; }
    b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 520 * dt;
    if (b.x < b.minX) { b.x = b.minX; b.vx = Math.abs(b.vx) * 0.6; } if (b.x > b.maxX) { b.x = b.maxX; b.vx = -Math.abs(b.vx) * 0.6; }
    if (b.y > b.homeY + 80) { if (b.vy > 0) { ctx.shake(6); for (let i = -2; i <= 2; i++) ctx.spawnBullet({ x: b.x, y: b.y + 20, vx: i * 70, vy: -120, life: 2.4, kind: "crumb", grav: 260 }); if (b.parts.length === 0) b.stun = Math.max(b.stun, 0.6); } b.y = b.homeY + 80; b.vy = 0; b.vx *= 0.5; }
  } else if (b.type === "bigotes") {
    if (!b.phase2 && b.hp <= b.maxHp * 0.5) { b.phase2 = true; b.vx = 180; b.stun = 0.8; ctx.shake(6); }
    const sp = (b.phase2 ? 1.6 : 1) * enraged;
    if (stunned) { b.vulnerable = true; }
    else {
      // charge attack every ~2.6s: i-frames while charging
      const cycle = b.t % (2.6 / sp);
      if (cycle < 0.55) { b.vulnerable = false; b.x += (b.vx > 0 ? 1 : -1) * 260 * sp * dt; }
      else { b.vulnerable = true; b.x += b.vx * 0.7 * dt; }
      if (b.x < b.minX) { b.x = b.minX; b.vx = Math.abs(b.vx); } if (b.x > b.maxX) { b.x = b.maxX; b.vx = -Math.abs(b.vx); }
      b.y = b.homeY + Math.sin(b.t * 2) * 10 + (b.phase2 ? Math.abs(Math.sin(b.t * 4)) * -18 : 0);
      if (b.cd <= 0) {
        b.cd = (b.phase2 ? 2.2 : 3.2) / sp;
        // bark shockwave
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ctx.spawnBullet({ x: b.x, y: b.y, vx: Math.cos(a) * 130, vy: Math.sin(a) * 130, life: 1.6, kind: "bark" }); }
        ctx.shake(4);
        if (b.phase2 || Math.random() < 0.6) ctx.spawnMouse(b.x + (Math.random() < 0.5 ? -40 : 40), b.y + 40);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
export function BossView({ boss, size = 110 }: { boss: Boss; size?: number }) {
  const hit = boss.flash > 0;
  const shielded = boss.shieldFlash > 0;
  const filter = hit ? "brightness(2.4) drop-shadow(0 0 10px #fff)" : shielded ? "drop-shadow(0 0 8px #ff3060)" : "drop-shadow(0 6px 10px rgba(0,0,0,.5))";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter, overflow: "visible" }}>
      {/* state auras */}
      {boss.vulnerable && boss.stun <= 0 && <circle cx="50" cy="50" r="46" fill="none" stroke="#7fc24a" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" style={{ animation: "spin-slow 2s linear infinite", transformBox: "fill-box", transformOrigin: "center" }} />}
      {boss.stun > 0 && <g fill="#ffd27a" style={{ animation: "spin-slow 1s linear infinite", transformBox: "fill-box", transformOrigin: "center" }}><path d="M50 2 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" /><path d="M14 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z" /><path d="M86 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z" /></g>}
      {!boss.vulnerable && boss.stun <= 0 && boss.type !== "bigotes" && <circle cx="50" cy="50" r="46" fill="none" stroke="#ff3060" strokeWidth="1.6" opacity={0.35 + Math.sin(boss.t * 6) * 0.2} />}
      {boss.telegraph > 0 && <text x="50" y="-4" textAnchor="middle" fontFamily="Press Start 2P" fontSize="14" fill="#ffd27a" style={{ filter: "drop-shadow(0 0 6px #ff3030)" }}>!</text>}

      {boss.type === "vacuum" && <Vacuum t={boss.t} charging={boss.vulnerable && boss.stun <= 0} />}
      {boss.type === "chef" && <Chef t={boss.t} />}
      {boss.type === "fridge" && <Fridge t={boss.t} />}
      {boss.type === "oven" && <Oven t={boss.t} charge={boss.charge} open={boss.vulnTimer > 0} />}
      {boss.type === "bread" && <BreadMonster t={boss.t} arms={boss.parts.length} />}
      {boss.type === "bigotes" && <Bigotes t={boss.t} phase2={boss.phase2} charging={!boss.vulnerable && boss.stun <= 0} />}

      {/* parts */}
      {boss.parts.map((p) => {
        const cx = 50 + p.ox, cy = 50 + p.oy; const flash = p.flash > 0;
        if (p.kind === "compressor") return (
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{ filter: flash ? "brightness(3)" : undefined }}>
            <rect x="-7" y="-9" width="14" height="18" rx="2" fill="#8a9498" stroke="#3a4044" strokeWidth="1.2" />
            <rect x="-5" y="-7" width="10" height="3" fill="#3a4044" /><rect x="-5" y="-1" width="10" height="3" fill="#3a4044" /><rect x="-5" y="5" width="10" height="3" fill="#3a4044" />
            <circle cx="0" cy="0" r="2" fill="#ff3030" style={{ filter: "drop-shadow(0 0 3px #ff3030)" }} />
          </g>
        );
        return (
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{ filter: flash ? "brightness(2.4)" : undefined }}>
            <path d={`M0 0 Q${p.ox < 0 ? -14 : 14} -4 ${p.ox < 0 ? -18 : 18} 6 Q${p.ox < 0 ? -10 : 10} 12 0 8 Z`} fill="#f4d9a0" stroke="#7a4410" strokeWidth="1.4" />
            <path d={`M${p.ox < 0 ? -16 : 16} 4 l${p.ox < 0 ? -3 : 3} 3 M${p.ox < 0 ? -12 : 12} 6 l${p.ox < 0 ? -3 : 3} 3`} stroke="#7a4410" strokeWidth="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

function Vacuum({ t, charging }: { t: number; charging: boolean }) {
  const wob = Math.sin(t * 8) * 2;
  return (
    <g transform={`translate(0 ${wob})`}>
      <ellipse cx="50" cy="86" rx="30" ry="5" fill="#000" opacity="0.3" />
      <path d="M18 30 Q18 18 32 18 H68 Q82 18 82 30 V62 Q82 76 68 76 H32 Q18 76 18 62 Z" fill="#d44a6a" stroke="#5a1020" strokeWidth="2" />
      <rect x="22" y="40" width="56" height="10" rx="3" fill="#7a1430" />
      {charging && <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "spin-slow .3s linear infinite" }} transform="translate(50 45)"><path d="M-6 0 q6 -6 12 0 q-6 6 -12 0" fill="none" stroke="#7fd0ff" strokeWidth="1.4" /><path d="M-10 0 q10 -10 20 0 q-10 10 -20 0" fill="none" stroke="#7fd0ff" strokeWidth="1" opacity="0.6" /></g>}
      <path d="M28 60 H72 V72 H28 Z" fill="#3a0810" />
      <g stroke="#7fd0ff" strokeWidth="1.4" opacity="0.7"><path d="M36 72 q-2 6 0 12" fill="none" className="flicker" /><path d="M50 72 q0 6 0 12" fill="none" className="flicker" /><path d="M64 72 q2 6 0 12" fill="none" className="flicker" /></g>
      <circle cx="38" cy="30" r="4" fill="#fff" /><circle cx="62" cy="30" r="4" fill="#fff" />
      <circle cx={charging ? 38 : 39} cy="31" r="2" fill="#1a0a04" /><circle cx={charging ? 62 : 63} cy="31" r="2" fill="#1a0a04" />
      <path d="M42 36 q8 4 16 0" stroke="#1a0a04" strokeWidth="1.4" fill="none" />
    </g>
  );
}
function Chef({ t }: { t: number }) {
  const float = Math.sin(t * 2) * 3;
  return (
    <g transform={`translate(0 ${float})`} opacity="0.92">
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#000" opacity="0.25" />
      <path d="M28 50 Q22 78 36 84 Q50 90 64 84 Q78 78 72 50 Z" fill="#f4f1e6" opacity="0.85" stroke="#7a7060" strokeWidth="1.4" />
      <circle cx="50" cy="38" r="18" fill="#f4f1e6" opacity="0.9" stroke="#7a7060" strokeWidth="1.4" />
      <path d="M32 30 Q30 14 42 14 Q46 8 54 12 Q64 8 68 18 Q74 22 68 30 Z" fill="#fff" stroke="#7a7060" strokeWidth="1.2" />
      <circle cx="44" cy="38" r="3" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)" }} />
      <circle cx="56" cy="38" r="3" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)" }} />
      <path d="M42 46 q8 6 16 0" stroke="#3a1a08" strokeWidth="1.6" fill="none" />
      <path d="M42 44 q4 2 8 0 q4 2 8 0" stroke="#d7d2c4" strokeWidth="2" fill="none" />
    </g>
  );
}
function Fridge({ t }: { t: number }) {
  return (
    <g>
      <rect x="22" y="14" width="56" height="72" rx="6" fill="#e8f4fa" stroke="#4a8aa8" strokeWidth="2" />
      <rect x="22" y="46" width="56" height="3" fill="#4a8aa8" />
      <rect x="68" y="24" width="3" height="14" rx="1.5" fill="#4a8aa8" /><rect x="68" y="54" width="3" height="14" rx="1.5" fill="#4a8aa8" />
      <circle cx="40" cy="30" r="4" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)", animation: `flicker ${0.4 + Math.sin(t) * 0.2}s infinite` }} />
      <circle cx="60" cy="30" r="4" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)", animation: `flicker ${0.4 + Math.cos(t) * 0.2}s infinite` }} />
      <path d="M38 38 l4 4 l4 -4 l4 4 l4 -4 l4 4" stroke="#3a1a08" strokeWidth="1.8" fill="none" />
    </g>
  );
}
function Oven({ t, charge, open }: { t: number; charge: number; open: boolean }) {
  const glow = 0.6 + Math.sin(t * 6) * 0.3;
  return (
    <g>
      <rect x="16" y="18" width="68" height="66" rx="6" fill="#3a1a08" stroke="#1a0804" strokeWidth="2" />
      <rect x="22" y="24" width="56" height="36" rx="3" fill="#1a0804" />
      <rect x="26" y="28" width="48" height="28" rx="2" fill={open ? "#fff3d6" : `rgba(255,${80 + glow * 80 | 0},40,${0.6 + glow * 0.3})`} style={{ filter: `drop-shadow(0 0 ${open ? 16 : 10}px ${open ? "#fff" : "#ff5a2a"})` }} />
      {!open && <g className="flicker" style={{ transformOrigin: "50px 42px" }}><path d="M36 54 q-4 -14 4 -20 q2 8 0 12 q6 -4 4 8 Z" fill="#ffd27a" /><path d="M50 54 q-4 -18 4 -24 q2 10 0 14 q6 -4 4 10 Z" fill="#ff7a2a" /><path d="M64 54 q-4 -14 4 -20 q2 8 0 12 q6 -4 4 8 Z" fill="#ffd27a" /></g>}
      {open && <text x="50" y="46" textAnchor="middle" fontFamily="Press Start 2P" fontSize="10" fill="#ff3030">ABIERTO</text>}
      <circle cx="30" cy="70" r="3" fill="#d7d2c4" /><circle cx="42" cy="70" r="3" fill="#d7d2c4" />
      {charge > 0 && <g stroke="#fff" strokeWidth="1.6" fill="none"><path d="M28 40 q4 -4 8 0" /><path d="M64 40 q4 -4 8 0" /></g>}
    </g>
  );
}
function BreadMonster({ t, arms }: { t: number; arms: number }) {
  const squish = 1 + Math.sin(t * 4) * 0.05;
  return (
    <g transform={`translate(50 50) scale(${1 / squish} ${squish}) translate(-50 -50)`}>
      <ellipse cx="50" cy="88" rx="32" ry="5" fill="#000" opacity="0.3" />
      <path d="M16 48 Q16 22 50 22 Q84 22 84 48 Q86 72 70 78 Q50 84 30 78 Q14 72 16 48 Z" fill="#d99243" stroke="#5a2810" strokeWidth="2" />
      <path d="M24 40 Q50 28 76 40" stroke="#f4c389" strokeWidth="4" fill="none" />
      <circle cx="38" cy="48" r="5" fill="#fff" /><circle cx="62" cy="48" r="5" fill="#fff" />
      <circle cx="39" cy="49" r="2.4" fill="#7a1410" /><circle cx="63" cy="49" r="2.4" fill="#7a1410" />
      <path d="M34 62 Q50 74 66 62 Q62 70 50 70 Q38 70 34 62 Z" fill="#3a0810" />
      <path d="M40 64 l2 4 M48 66 l2 4 M56 66 l2 4 M62 64 l-2 4" stroke="#fff" strokeWidth="1.2" />
      {arms === 0 && <text x="50" y="14" textAnchor="middle" fontFamily="Press Start 2P" fontSize="7" fill="#ff3030">SIN BRAZOS</text>}
    </g>
  );
}
function Bigotes({ t, phase2, charging }: { t: number; phase2: boolean; charging: boolean }) {
  const lean = charging ? 6 : Math.sin(t * 4) * 2;
  return (
    <g transform={`rotate(${lean} 50 60)`}>
      <ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity="0.35" />
      {/* body */}
      <ellipse cx="50" cy="68" rx="22" ry="14" fill="#fff" stroke="#3a2010" strokeWidth="1.4" />
      <path d="M34 60 Q40 56 46 62 Q42 70 34 70 Z" fill="#7a4410" />
      <path d="M62 64 Q70 62 72 72 Q64 74 60 70 Z" fill="#7a4410" />
      {/* head */}
      <ellipse cx="50" cy="42" rx="18" ry="16" fill="#fff" stroke="#3a2010" strokeWidth="1.4" />
      <path d="M34 34 Q42 26 50 32 Q46 38 36 40 Z" fill="#7a4410" />
      {/* ears */}
      <path d="M34 30 Q28 22 30 36 Q36 36 38 32 Z" fill="#7a4410" stroke="#3a2010" strokeWidth="0.8" />
      <path d="M66 30 Q72 22 70 36 Q64 36 62 32 Z" fill="#fff" stroke="#3a2010" strokeWidth="0.8" />
      {/* eyepatch */}
      <circle cx="42" cy="40" r="5" fill="#1a1a1a" />
      <path d="M34 30 L50 48" stroke="#1a1a1a" strokeWidth="1.4" />
      <circle cx="58" cy="40" r="3" fill="#fff" /><circle cx="58" cy="41" r="1.6" fill="#ff3030" />
      {/* scar */}
      <path d="M54 32 l4 8" stroke="#d44a6a" strokeWidth="1.2" />
      <path d="M53 34 l2 0 M55 38 l2 0" stroke="#d44a6a" strokeWidth="0.8" />
      {/* snarl */}
      <path d="M42 50 Q50 56 58 50 Q54 54 50 54 Q46 54 42 50 Z" fill="#3a0810" />
      <path d="M44 50 l1 3 M48 51 l1 3 M52 51 l-1 3 M56 50 l-1 3" stroke="#fff" strokeWidth="1" />
      <ellipse cx="50" cy="46" rx="3" ry="2" fill="#1a0e08" />
      {/* spike collar */}
      <path d="M34 56 Q50 62 66 56 L64 62 Q50 66 36 62 Z" fill="#1a1a1a" />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${38 + i * 5} 56 l1 -3 l1 3 Z`} fill="#d7d2c4" />)}
      {/* tail up */}
      <path d="M70 66 Q82 58 80 44" stroke="#7a4410" strokeWidth="4" fill="none" strokeLinecap="round" />
      {phase2 && <g fill="#ff3030" opacity="0.8" style={{ animation: "flicker .3s infinite" }}><path d="M30 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /><path d="M70 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /></g>}
      {charging && <text x="50" y="6" textAnchor="middle" fontFamily="Press Start 2P" fontSize="10" fill="#ff3030" style={{ filter: "drop-shadow(0 0 6px #ff3030)" }}>GRR</text>}
    </g>
  );
}

/* ------------------------------------------------------------------ */
export function BulletView({ b }: { b: Bullet }) {
  if (b.kind === "dust") return <div className="absolute rounded-full" style={{ left: b.x - 5, top: b.y - 5, width: 10, height: 10, background: "radial-gradient(circle,#d9c39a,#7a5a2c)", boxShadow: "0 0 6px #d9c39a88" }} />;
  if (b.kind === "pan" || b.kind === "panback") return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: "absolute", left: b.x - 11, top: b.y - 11, animation: "spin-slow .4s linear infinite", filter: b.kind === "panback" ? "drop-shadow(0 0 6px #7fc24a)" : undefined }}>
      <circle cx="10" cy="12" r="7" fill={b.kind === "panback" ? "#7fc24a" : "#3a3a3a"} stroke="#1a1a1a" strokeWidth="1.2" />
      <rect x="15" y="10" width="8" height="3" rx="1.5" fill="#5a3a1a" />
      <circle cx="8" cy="10" r="1.5" fill="#fff" opacity="0.5" />
    </svg>
  );
  if (b.kind === "ice") return <div className="absolute" style={{ left: b.x - 7, top: b.y - 7, width: 14, height: 14, background: "linear-gradient(135deg,#d8f4ff,#7fd0ff)", border: "1px solid #4a8aa8", transform: "rotate(45deg)", boxShadow: "0 0 8px #7fd0ff88" }} />;
  if (b.kind === "flame") return <div className="absolute rounded-full flicker" style={{ left: b.x - 8, top: b.y - 8, width: 16, height: 16, background: "radial-gradient(circle,#ffd27a,#ff5a2a 70%,transparent)", transformOrigin: "center" }} />;
  if (b.kind === "crumb") return <div className="absolute rounded-sm" style={{ left: b.x - 4, top: b.y - 4, width: 8, height: 8, background: "#d99243", border: "1px solid #5a2810" }} />;
  if (b.kind === "bark") return <div className="absolute rounded-full" style={{ left: b.x - 5, top: b.y - 5, width: 10, height: 10, background: "radial-gradient(circle,#fff,#ff8fa0 70%,transparent)", boxShadow: "0 0 8px #ff8fa0" }} />;
  return <div className="absolute rounded-full" style={{ left: b.x - 6, top: b.y - 6, width: 12, height: 12, background: "radial-gradient(circle,#fff3d6,#d99243)", boxShadow: "0 0 10px #ffd27a" }} />;
}
