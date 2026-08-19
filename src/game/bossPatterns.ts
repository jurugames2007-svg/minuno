import type { Boss, BossCtx, BossType, Bullet } from "../art/Bosses";

/** Patrones distintos por jefe. Cada uno rota 3 formas de atacar. */
export function fireBossPattern(type: BossType, b: Boss, ctx: BossCtx, beat: number) {
  const n = beat % 3;
  const px = ctx.playerX, py = ctx.playerY;
  const aim = (spd: number, ox = 0, oy = 0) => {
    const dx = px - b.x + ox, dy = py - b.y + oy;
    const d = Math.hypot(dx, dy) || 1;
    return { vx: (dx / d) * spd, vy: (dy / d) * spd };
  };
  const shot = (bl: Omit<Bullet, "id">) => ctx.spawnBullet(bl);

  if (type === "escoba") {
    if (n === 0) {
      for (let i = -2; i <= 2; i++) shot({ x: b.x, y: b.y + 10, vx: i * 70, vy: 180, life: 2.2, kind: "dust", grav: 40 });
    } else if (n === 1) {
      const a = aim(200); shot({ x: b.x, y: b.y, ...a, life: 2, kind: "splinter" });
      shot({ x: b.x, y: b.y, vx: a.vx * 0.7, vy: a.vy, life: 2, kind: "dust" });
    } else {
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        shot({ x: b.x, y: b.y, vx: Math.cos(ang) * 140, vy: Math.sin(ang) * 140, life: 1.8, kind: "dust" });
      }
    }
  } else if (type === "gato") {
    if (n === 0) {
      shot({ x: b.x, y: b.y + 16, vx: 160, vy: 0, life: 2.2, kind: "shock" });
      shot({ x: b.x, y: b.y + 16, vx: -160, vy: 0, life: 2.2, kind: "shock" });
    } else if (n === 1) {
      for (let i = 0; i < 3; i++) shot({ x: b.x + (i - 1) * 16, y: b.y, vx: (i - 1) * 40, vy: 90, life: 3, kind: "hairball", grav: 90 });
    } else {
      const a = aim(190); shot({ x: b.x, y: b.y, ...a, life: 2, kind: "hairball" });
    }
  } else if (type === "antisam") {
    if (n === 0) shot({ x: b.x, y: b.y, vx: px > b.x ? 160 : -160, vy: 80, life: 2.4, kind: "button", grav: 120 });
    else if (n === 1) { const a = aim(170); shot({ x: b.x, y: b.y, ...a, life: 2, kind: "shock" }); }
    else for (let i = -1; i <= 1; i++) shot({ x: b.x + i * 18, y: b.y, vx: i * 50, vy: 140, life: 2, kind: "button", grav: 80 });
  } else if (type === "caballo") {
    if (n === 0) { b.charge = 0.7; b.vx = px > b.x ? 180 : -180; ctx.shake(4); }
    else if (n === 1) for (let i = 0; i < 3; i++) shot({ x: b.x + (i - 1) * 12, y: b.y - 20, vx: 0, vy: 150, life: 2.4, kind: "wood", grav: 160 });
    else { b.vy = -260; ctx.shake(3); }
  } else if (type === "fantasma") {
    if (n === 0) { const a = aim(150); shot({ x: b.x, y: b.y, ...a, life: 2.6, kind: "ecto" }); }
    else if (n === 1) for (let i = 0; i < 2; i++) shot({ x: b.x, y: b.y, vx: (i ? 1 : -1) * 90, vy: -20, life: 2, kind: "pan" });
    else { b.x = px; ctx.shake(2); }
  } else if (type === "cuchara") {
    if (n === 0) shot({ x: b.x, y: b.y + 8, vx: 0, vy: 160, life: 2.4, kind: "dough", grav: 50 });
    else if (n === 1) for (let i = -1; i <= 1; i++) shot({ x: b.x + i * 12, y: b.y, vx: i * 55, vy: 130, life: 2.2, kind: "dough" });
    else for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      shot({ x: b.x, y: b.y, vx: Math.cos(ang) * 100, vy: Math.sin(ang) * 100, life: 1.8, kind: "dust" });
    }
  } else if (type === "hornito") {
    if (n === 0) { b.x = px; b.charge = 0.55; ctx.shake(3); }
    else if (n === 1) { const a = aim(210); shot({ x: b.x, y: b.y, ...a, life: 1.8, kind: "flame" }); }
    else { shot({ x: b.x, y: b.y + 10, vx: 150, vy: 0, life: 2, kind: "shock" }); shot({ x: b.x, y: b.y + 10, vx: -150, vy: 0, life: 2, kind: "shock" }); }
  } else if (type === "refriRey") {
    if (n === 0) shot({ x: b.x, y: b.y, vx: px > b.x ? 180 : -180, vy: 0, life: 2.4, kind: "ice" });
    else if (n === 1) shot({ x: b.x, y: b.y - 8, vx: 0, vy: 140, life: 2.2, kind: "ice" });
    else { const a = aim(160); shot({ x: b.x, y: b.y, ...a, life: 2, kind: "ice" }); b.frozen = 0.6; }
  } else if (type === "alacena") {
    if (n === 0) for (let i = 0; i < 3; i++) shot({ x: b.x + (i - 1) * 14, y: b.y, vx: (i - 1) * 70, vy: 120, life: 2.3, kind: "can", grav: 160 });
    else if (n === 1) shot({ x: b.x, y: b.y - 16, vx: 0, vy: 110, life: 2.8, kind: "book", grav: 70 });
    else { b.vulnTimer = 0.8; ctx.shake(3); }
  } else {
    if (n === 0) for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      shot({ x: b.x, y: b.y, vx: Math.cos(ang) * 150, vy: Math.sin(ang) * 150, life: 1.6, kind: "bark" });
    }
    else if (n === 1) { b.vx = px > b.x ? 200 : -200; ctx.shake(5); }
    else { const a = aim(200); shot({ x: b.x, y: b.y, ...a, life: 2, kind: "bark" }); }
  }
  ctx.shake(2);
}
