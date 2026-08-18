import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { type Boss, type Bullet, spawnBoss, stepBoss, BossView, BulletView, BOSS_NAME, type BossType } from "../art/Bosses";
import { fireBossPattern } from "./bossPatterns";
import type { SkinId } from "../data/skins";
import { CEIL, FLOOR, WALL, maxineIntroKind, moodPose, stageFor } from "../data/cinematics";
import { PawIcon } from "../ui/PawButton";
import ArenaArt from "./ArenaArt";
import * as Audio from "./AudioEngine";

type Phase = "black" | "build" | "name" | "bossIn" | "heroIn" | "bar" | "talk" | "fight" | "ko" | "outro";

interface Props {
  type: BossType;
  level: number;
  skin: SkinId;
  hearts: number;
  onHurt: () => void;
  onWin: () => void;
}

const W = 360;
const PW = 32;
const PH = 40;
const G = 1750;
const JUMP = 400;
const MOVE = 200;
const LEFT = WALL + 4;
const RIGHT = W - WALL - PW - 4;
const TOP = CEIL + 4;
const STAND_Y = FLOOR - PH - 1;

function clampPlayer(pl: { x: number; y: number; vy: number; on: boolean; used: boolean }) {
  pl.x = Math.max(LEFT, Math.min(RIGHT, pl.x));
  if (pl.y < TOP) { pl.y = TOP; if (pl.vy < 0) pl.vy = 0; }
  if (pl.y > STAND_Y) { pl.y = STAND_Y; pl.vy = 0; pl.on = true; pl.used = false; }
}

export default function BossStage({ type, level, skin, hearts, onHurt, onWin }: Props) {
  const def = stageFor(type);
  const [phase, setPhase] = useState<Phase>("black");
  const [line, setLine] = useState(0);
  const [barOn, setBarOn] = useState(false);
  const [, setTick] = useState(0);
  const phaseRef = useRef<Phase>("black");
  const p = useRef({ x: LEFT + 10, y: STAND_Y, vx: 0, vy: 0, on: true, face: 1 as 1 | -1, inv: 0, atk: 0, atkCd: 0, coy: 0.14, buf: 0, used: false, prevY: STAND_Y });
  const boss = useRef<Boss | null>(null);
  const bullets = useRef<Bullet[]>([]);
  const ids = useRef(1);
  const input = useRef({ l: false, r: false, jump: false, atk: false });
  const done = useRef(false);
  const pressure = useRef(0);
  const shake = useRef(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    Audio.startBossTheme(type);
    return () => { Audio.stopBossTheme(); Audio.startAmbientMusic(); };
  }, [type]);

  useEffect(() => {
    const seq: { ph: Phase; t: number }[] = [
      { ph: "black", t: 280 },
      { ph: "build", t: 900 },
      { ph: "name", t: 700 },
      { ph: "bossIn", t: 800 },
      { ph: "heroIn", t: 700 },
      { ph: "bar", t: 500 },
      { ph: "talk", t: 0 },
    ];
    let i = 0;
    let tmr = 0;
    const next = () => {
      const step = seq[i];
      if (!step) return;
      setPhase(step.ph);
      if (step.ph === "bar") setBarOn(true);
      if (step.ph === "talk") return;
      tmr = window.setTimeout(() => { i++; next(); }, step.t);
    };
    next();
    return () => clearTimeout(tmr);
  }, []);

  useEffect(() => {
    boss.current = spawnBoss(type, level, 90, W - 90, FLOOR - 80);
    const b = boss.current;
    b.homeY = FLOOR - 78;
    b.y = FLOOR - 78;
    b.minX = 150;
    b.maxX = W - WALL - 50;
  }, [type, level]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const ctx = {
      playerX: 0, playerY: 0, left: LEFT, right: W - WALL - 8, top: TOP, bottom: FLOOR,
      spawnBullet: (bl: Omit<Bullet, "id">) => { bullets.current.push({ id: ids.current++, ...bl }); },
      spawnMouse: () => { /* */ },
      shake: (n: number) => { shake.current = Math.max(shake.current, n); },
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      shake.current = Math.max(0, shake.current - dt * 30);
      const ph = phaseRef.current;
      const fighting = ph === "fight";
      const pl = p.current;
      pl.prevY = pl.y;
      pl.inv = Math.max(0, pl.inv - dt);
      pl.atk = Math.max(0, pl.atk - dt);
      pl.atkCd = Math.max(0, pl.atkCd - dt);

      const dir = fighting ? ((input.current.r ? 1 : 0) - (input.current.l ? 1 : 0)) : 0;
      if (dir) pl.face = dir as 1 | -1;
      pl.vx = dir * MOVE;
      pl.x += pl.vx * dt;

      pl.coy = pl.on ? 0.14 : Math.max(0, pl.coy - dt);
      if (fighting && input.current.jump) { input.current.jump = false; pl.buf = 0.12; }
      pl.buf = Math.max(0, pl.buf - dt);
      if (fighting && pl.buf > 0 && (pl.coy > 0 || !pl.used)) {
        const dbl = pl.coy <= 0;
        if (dbl) pl.used = true;
        pl.vy = dbl ? -JUMP * 0.82 : -JUMP;
        pl.buf = 0; pl.coy = 0; pl.on = false;
      }
      pl.vy += G * dt;
      if (pl.vy > 580) pl.vy = 580;
      pl.y += pl.vy * dt;

      pl.on = false;
      if (pl.vy >= 0) {
        const feet = pl.y + PH;
        for (const s of stageFor(type).plats) {
          if (pl.x + PW > s.x + 3 && pl.x < s.x + s.w - 3 && pl.prevY + PH <= s.y + 7 && feet >= s.y) {
            pl.y = s.y - PH - 0.5; pl.vy = 0; pl.on = true; pl.used = false; break;
          }
        }
        if (!pl.on && feet >= FLOOR) {
          pl.y = STAND_Y; pl.vy = 0; pl.on = true; pl.used = false;
        }
      }
      clampPlayer(pl);

      if (fighting) {
        if (input.current.atk) {
          input.current.atk = false;
          if (pl.atkCd <= 0) { pl.atkCd = 0.28; pl.atk = 0.18; Audio.playAttack(); }
        }
        const b = boss.current;
        if (b && pl.atk > 0) {
          const ax = pl.x + PW / 2 + pl.face * 26, ay = pl.y + PH / 2;
          if (Math.abs(ax - b.x) < 56 && Math.abs(ay - b.y) < 56) {
            if (b.vulnerable || b.stun > 0) {
              b.hp -= 1; b.flash = 0.16; shake.current = Math.max(shake.current, 5);
              if (b.hp <= 0 && !done.current) {
                done.current = true;
                setPhase("ko");
                setTimeout(() => setPhase("outro"), 900);
              }
            } else { b.shieldFlash = 0.2; }
          }
        }
        if (b && !done.current) {
          ctx.playerX = pl.x + PW / 2; ctx.playerY = pl.y + PH / 2;
          stepBoss(b, dt, ctx);
          b.x = Math.max(150, Math.min(W - WALL - 48, b.x));
          b.y = Math.max(CEIL + 50, Math.min(FLOOR - 70, b.y));
          pressure.current += dt;
          if (pressure.current > 1.25) {
            const beat = Math.floor(b.t * 2);
            pressure.current = 0;
            b.telegraph = 0.45;
            b.atkX = pl.x - 10; b.atkY = pl.y - 6; b.atkW = PW + 20; b.atkH = PH + 14;
            fireBossPattern(type, b, ctx, beat);
          }
          if (Math.abs(pl.x + PW / 2 - b.x) < 40 && Math.abs(pl.y + PH / 2 - b.y) < 42 && pl.inv <= 0) {
            pl.inv = 1; pl.vy = -200; pl.x = Math.max(LEFT, pl.x - 22); onHurt(); shake.current = 8;
          }
        }
        for (let i = bullets.current.length - 1; i >= 0; i--) {
          const bl = bullets.current[i];
          bl.life -= dt; if (bl.grav) bl.vy += bl.grav * dt;
          bl.x += bl.vx * dt; bl.y += bl.vy * dt;
          if (bl.x < WALL || bl.x > W - WALL || bl.y < CEIL || bl.y > FLOOR) { bullets.current.splice(i, 1); continue; }
          if (bl.life <= 0) { bullets.current.splice(i, 1); continue; }
          if (Math.abs(bl.x - (pl.x + PW / 2)) < 20 && Math.abs(bl.y - (pl.y + PH / 2)) < 22 && pl.inv <= 0) {
            pl.inv = 1; onHurt(); bullets.current.splice(i, 1); shake.current = 6;
          }
        }
      }
      clampPlayer(pl);
      setTick((n) => (n + 1) & 0xffff);
    };
    raf = requestAnimationFrame(step);
    const kd = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.l = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.r = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { input.current.jump = true; e.preventDefault(); }
      if (e.key === "j" || e.key === "J" || e.key === "x" || e.key === "X") input.current.atk = true;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") input.current.l = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") input.current.r = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [onHurt, type]);

  const talk = phase === "talk" || phase === "outro";
  const talkBeats = phase === "outro"
    ? def.outro.flatMap((text, i) => {
        const beats: { who: "jefe" | "maxine"; text: string }[] = [{ who: "jefe", text }];
        if (i === def.outro.length - 1) beats.push({ who: "maxine", text: def.outroReact });
        return beats;
      })
    : def.intro.flatMap((text, i) => {
        const beats: { who: "jefe" | "maxine"; text: string }[] = [{ who: "jefe", text }];
        if (def.react[i]) beats.push({ who: "maxine", text: def.react[i] });
        return beats;
      });
  const beat = talkBeats[Math.min(line, Math.max(0, talkBeats.length - 1))];
  const kind = maxineIntroKind(skin);
  const reactPose = talk && beat?.who === "maxine" ? moodPose(def.moods[Math.min(Math.floor(line / 2), def.moods.length - 1)] ?? "curious") : null;
  const pose: Pose = phase === "ko" || phase === "outro"
    ? "win"
    : reactPose
      ? reactPose
      : p.current.atk > 0 ? "dig" : !p.current.on && p.current.vy > 50 ? "fall" : "idle";
  const b = boss.current;
  const showWorld = phase !== "black";
  const showBoss = ["bossIn", "heroIn", "bar", "talk", "fight", "ko", "outro"].includes(phase);
  const showHero = phase !== "black";
  const heroAnim = phase === "heroIn" ? `mm-hero-${kind}` : "";

  const advanceTalk = () => {
    if (phase === "talk") {
      if (line + 1 >= talkBeats.length) { setPhase("fight"); setLine(0); }
      else setLine((n) => n + 1);
    } else if (phase === "outro") {
      if (line + 1 >= talkBeats.length) onWin();
      else setLine((n) => n + 1);
    }
  };

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
  };
  const onPadUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pad.current.id !== e.pointerId && pad.current.id !== -1) return;
    const dx = e.clientX - pad.current.x; const dy = e.clientY - pad.current.y;
    if (Math.hypot(dx, dy) < 18) input.current.atk = true;
    input.current.l = false; input.current.r = false; pad.current.id = -1;
  };

  const sx = shake.current > 0 ? (Math.random() - 0.5) * shake.current : 0;
  const sy = shake.current > 0 ? (Math.random() - 0.5) * shake.current : 0;
  const hx = Math.max(LEFT, Math.min(RIGHT, p.current.x));
  const hy = Math.max(TOP, Math.min(STAND_Y, p.current.y));

  return (
    <div className="absolute inset-0 z-[60] overflow-hidden select-none" style={{ background: "#0a0402" }}>
      {showWorld && <ArenaArt type={type} />}
      <div className="absolute inset-0" style={{ background: `radial-gradient(80% 50% at 50% 30%, ${def.glow}22, transparent 70%)` }} />

      <div className="absolute inset-0" style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {showWorld && def.plats.filter((_, i) => i > 0).map((s, i) => (
          <div key={i} className="absolute" style={{
            left: s.x, top: s.y, width: s.w, height: s.h,
            background: "linear-gradient(180deg,#e8c48a,#8a5420)",
            borderRadius: 4,
            boxShadow: "0 4px 0 #2a1408, inset 0 2px 0 #fff3d688",
          }} />
        ))}

        {showBoss && b && (
          <div className={`absolute ${phase === "bossIn" ? "mm-boss-bossIn" : phase === "ko" ? "mm-boss-ko" : ""}`}
            style={{ left: b.x - 64, top: b.y - 64, zIndex: 5 }}>
            <BossView boss={b} size={128} />
          </div>
        )}

        {showHero && (
          <div className={`absolute ${heroAnim}`} style={{
            left: hx - 10, top: hy - 14, zIndex: 8,
            opacity: p.current.inv > 0 && Math.floor(p.current.inv * 12) % 2 === 0 ? 0.55 : 1,
          }}>
            <Maxine skin={skin} pose={pose} facing={p.current.face} size={72} />
            {talk && beat?.who === "maxine" && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                <div className="bg-[#fff3d6] text-[#3a1808] font-display font-bold text-[11px] px-2 py-0.5 rounded-full border-2 border-[#7a4410]">
                  {beat.text.length > 26 ? `${beat.text.slice(0, 24)}…` : beat.text}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "fight" && bullets.current.map((bl) => <BulletView key={bl.id} b={bl} />)}
      </div>

      {/* Room cage — Mega Man box */}
      <div className="pointer-events-none absolute inset-0 z-[20]">
        <div className="absolute top-0 inset-x-0" style={{ height: CEIL, background: "linear-gradient(180deg,#1a0c04,#3a2010)", boxShadow: "inset 0 -4px 0 #1a0c04" }} />
        <div className="absolute left-0 top-0 bottom-0" style={{ width: WALL, background: "repeating-linear-gradient(180deg,#4a2a12 0 16px,#2a1408 16px 18px)" }} />
        <div className="absolute right-0 top-0 bottom-0" style={{ width: WALL, background: "repeating-linear-gradient(180deg,#4a2a12 0 16px,#2a1408 16px 18px)" }} />
        <div className="absolute bottom-0 inset-x-0" style={{ top: FLOOR, background: "linear-gradient(180deg,#c9842a 0 10px,#8a5420 10px 28px,#5a3010 28px 100%)", boxShadow: "inset 0 4px 0 #ffe0b055" }} />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 3px #1a0c04" }} />
      </div>

      {(phase === "name" || barOn) && (
        <div className="absolute left-8 right-8 z-[72] pointer-events-none" style={{ top: 18 }}>
          <div className="text-center font-display font-bold text-[11px] text-amber-200/80 tracking-[0.2em]">{def.place}</div>
          <div className="text-center font-display font-bold text-[17px] text-rose-200" style={{ textShadow: "0 0 10px #ff3060" }}>{BOSS_NAME[type]}</div>
          {barOn && b && (
            <div className="mt-1 h-3 rounded-sm border border-rose-300/50 bg-black/60 overflow-hidden mm-bar">
              <div className="h-full" style={{ width: `${Math.max(0, (b.hp / b.maxHp) * 100)}%`, background: "linear-gradient(90deg,#ff3060,#ffd27a)" }} />
            </div>
          )}
        </div>
      )}

      <div className="absolute z-[72] flex gap-1" style={{ top: 10, left: WALL + 6 }}>
        {Array.from({ length: Math.max(3, hearts) }).map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full border border-rose-200" style={{ background: i < hearts ? "#ff5a6a" : "#3a2010" }} />
        ))}
      </div>

      {talk && (
        <button onClick={advanceTalk} className="absolute inset-x-8 z-[80] text-left" style={{ bottom: 36 }}>
          <div className="rounded-xl border-2 border-amber-300/40 bg-black/80 px-3 py-2.5">
            <div className="font-pixel text-[8px] mb-1" style={{ color: beat?.who === "maxine" ? "#ffd27a" : "#ff8fa0" }}>
              {phase === "outro" ? (beat?.who === "maxine" ? "MAXINE" : "VICTORIA") : beat?.who === "maxine" ? "MAXINE" : BOSS_NAME[type]}
            </div>
            <p className="font-display text-[14px] text-amber-50 leading-snug">{beat?.text ?? ""}</p>
            <div className="text-right font-display text-[11px] text-amber-200/60 mt-1">tocá</div>
          </div>
        </button>
      )}

      {phase === "fight" && (
        <div className="absolute inset-0 z-[65]" style={{ touchAction: "none" }}
          onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
      )}

      {(phase === "fight" || phase === "talk") && (
        <button
          type="button"
          aria-label="Cavar"
          className="btn-3d rounded-full border-2 border-b-4 flex items-center justify-center"
          style={{
            position: "absolute",
            zIndex: 90,
            width: 64,
            height: 64,
            right: 14,
            bottom: 78,
            background: "linear-gradient(180deg,#ffd27a,#d99243)",
            borderColor: "#7a4410",
            boxShadow: "0 6px 0 #5a2a08, 0 8px 16px #0008",
          }}
          onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); input.current.atk = true; }}
        >
          <PawIcon size={40} />
        </button>
      )}

      {phase === "ko" && (
        <div className="absolute inset-0 z-[75] flex items-center justify-center pointer-events-none">
          <div className="font-display font-bold text-5xl text-amber-100 pop" style={{ textShadow: "0 4px 0 #7a1410" }}>KO</div>
        </div>
      )}
    </div>
  );
}
