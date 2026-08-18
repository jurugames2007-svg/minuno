import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { type Boss, type Bullet, spawnBoss, stepBoss, BossView, BulletView, BOSS_NAME, type BossType } from "../art/Bosses";
import type { SkinId } from "../data/skins";
import { FLOOR, maxineIntroKind, moodPose, stageFor, type Plat } from "../data/cinematics";
import PawButton from "../ui/PawButton";
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
const H = 640;
const PW = 26;
const PH = 34;
const G = 1680;
const JUMP = 430;
const MOVE = 195;
const STAND_Y = FLOOR - PH - 0.6;

const SHOT_KIND: Partial<Record<BossType, Bullet["kind"]>> = {
  escoba: "dust", gato: "hairball", antisam: "button", caballo: "wood",
  fantasma: "ecto", cuchara: "dough", hornito: "flame", refriRey: "ice",
  alacena: "can", bigotesGrande: "bark", bigotes: "bark",
};

export default function BossStage({ type, level, skin, hearts, onHurt, onWin }: Props) {
  const def = stageFor(type);
  const [phase, setPhase] = useState<Phase>("black");
  const [line, setLine] = useState(0);
  const [barOn, setBarOn] = useState(false);
  const [shake, setShake] = useState(0);
  const [, setTick] = useState(0);
  const phaseRef = useRef<Phase>("black");
  const p = useRef({ x: 36, y: STAND_Y, vx: 0, vy: 0, on: true, face: 1 as 1 | -1, inv: 0, atk: 0, atkCd: 0, coy: 0.12, buf: 0, used: false, prevY: STAND_Y });
  const boss = useRef<Boss | null>(null);
  const bullets = useRef<Bullet[]>([]);
  const ids = useRef(1);
  const input = useRef({ l: false, r: false, jump: false, atk: false });
  const done = useRef(false);
  const pressure = useRef(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    Audio.startBossTheme(type);
    return () => { Audio.stopBossTheme(); Audio.startAmbientMusic(); };
  }, [type]);

  useEffect(() => {
    const seq: { ph: Phase; t: number }[] = [
      { ph: "black", t: 350 },
      { ph: "build", t: 1400 },
      { ph: "name", t: 800 },
      { ph: "bossIn", t: 950 },
      { ph: "heroIn", t: 850 },
      { ph: "bar", t: 650 },
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
    boss.current = spawnBoss(type, level, 70, W - 70, 240);
    const b = boss.current;
    b.homeY = 268;
    b.y = 268;
    b.minX = 70;
    b.maxX = W - 70;
  }, [type, level]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const ctx = {
      playerX: 0, playerY: 0, left: 16, right: W - 16, top: 80, bottom: FLOOR,
      spawnBullet: (bl: Omit<Bullet, "id">) => { bullets.current.push({ id: ids.current++, ...bl }); },
      spawnMouse: () => { /* no minions */ },
      shake: (n: number) => { setShake((s) => Math.max(s, n)); },
    };
    const land = (pl: typeof p.current, plats: Plat[]) => {
      pl.on = false;
      if (pl.vy < 0) return;
      const feet = pl.y + PH;
      for (const s of plats) {
        const onX = pl.x + PW > s.x + 2 && pl.x < s.x + s.w - 2;
        if (!onX) continue;
        if (pl.prevY + PH <= s.y + 8 && feet >= s.y) {
          pl.y = s.y - PH - 0.4; pl.vy = 0; pl.on = true; pl.used = false; return;
        }
      }
      if (feet >= FLOOR) {
        pl.y = STAND_Y; pl.vy = 0; pl.on = true; pl.used = false;
      }
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      setShake((s) => Math.max(0, s - dt * 28));
      const ph = phaseRef.current;
      const live = ph === "fight" || ph === "heroIn" || ph === "bar" || ph === "talk";
      const fighting = ph === "fight";
      const pl = p.current;
      pl.prevY = pl.y;
      pl.inv = Math.max(0, pl.inv - dt);
      pl.atk = Math.max(0, pl.atk - dt); pl.atkCd = Math.max(0, pl.atkCd - dt);

      if (live) {
        const dir = fighting ? ((input.current.r ? 1 : 0) - (input.current.l ? 1 : 0)) : 0;
        if (dir) pl.face = dir as 1 | -1;
        pl.vx = dir * MOVE;
        pl.x += pl.vx * dt;
        pl.x = Math.max(14, Math.min(W - 14 - PW, pl.x));
        pl.coy = pl.on ? 0.14 : Math.max(0, pl.coy - dt);
        if (fighting && input.current.jump) { input.current.jump = false; pl.buf = 0.12; }
        pl.buf = Math.max(0, pl.buf - dt);
        if (fighting && pl.buf > 0 && (pl.coy > 0 || !pl.used)) {
          const dbl = pl.coy <= 0;
          if (dbl) pl.used = true;
          pl.vy = dbl ? -JUMP * 0.86 : -JUMP;
          pl.buf = 0; pl.coy = 0; pl.on = false;
        }
        pl.vy += G * dt; if (pl.vy > 620) pl.vy = 620;
        pl.y += pl.vy * dt;
        land(pl, stageFor(type).plats);
        if (pl.y > FLOOR + 8) { pl.y = STAND_Y; pl.vy = 0; pl.on = true; }
      }

      if (fighting) {
        if (input.current.atk) { input.current.atk = false; if (pl.atkCd <= 0) { pl.atkCd = 0.3; pl.atk = 0.18; Audio.playAttack(); } }
        const b = boss.current;
        if (b && pl.atk > 0) {
          const ax = pl.x + PW / 2 + pl.face * 24, ay = pl.y + PH / 2;
          if (Math.abs(ax - b.x) < 52 && Math.abs(ay - b.y) < 52) {
            if (b.vulnerable || b.stun > 0) {
              b.hp -= 1; b.flash = 0.16; setShake((s) => Math.max(s, 5));
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
          b.y = Math.min(Math.max(b.y, 160), FLOOR - 70);
          pressure.current += dt;
          if (pressure.current > 1.35) {
            pressure.current = 0;
            const dx = ctx.playerX - b.x, dy = ctx.playerY - b.y;
            const d = Math.hypot(dx, dy) || 1;
            const kind = SHOT_KIND[type] ?? "dust";
            ctx.spawnBullet({ x: b.x, y: b.y + 8, vx: (dx / d) * 210, vy: (dy / d) * 210, life: 2.6, kind });
            ctx.spawnBullet({ x: b.x, y: b.y + 8, vx: (dx / d) * 170 - 40, vy: (dy / d) * 170, life: 2.2, kind });
            ctx.spawnBullet({ x: b.x, y: b.y + 8, vx: (dx / d) * 170 + 40, vy: (dy / d) * 170, life: 2.2, kind });
            b.telegraph = 0.55; b.atkX = pl.x - 10; b.atkY = pl.y - 6; b.atkW = PW + 20; b.atkH = PH + 16;
          }
          if (Math.abs(pl.x + PW / 2 - b.x) < 38 && Math.abs(pl.y + PH / 2 - b.y) < 40 && pl.inv <= 0) {
            pl.inv = 1.05; pl.vy = -220; pl.x += pl.x < b.x ? -18 : 18; onHurt(); setShake(8);
          }
        }
        for (let i = bullets.current.length - 1; i >= 0; i--) {
          const bl = bullets.current[i];
          bl.life -= dt; if (bl.grav) bl.vy += bl.grav * dt;
          bl.x += bl.vx * dt; bl.y += bl.vy * dt;
          if (bl.life <= 0 || bl.y > H + 20 || bl.x < -20 || bl.x > W + 20) { bullets.current.splice(i, 1); continue; }
          if (Math.abs(bl.x - (pl.x + PW / 2)) < 20 && Math.abs(bl.y - (pl.y + PH / 2)) < 22 && pl.inv <= 0) {
            pl.inv = 1.05; onHurt(); bullets.current.splice(i, 1); setShake(6);
          }
        }
      }
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
      : p.current.atk > 0 ? "dig" : !p.current.on && p.current.vy > 40 ? "fall" : "idle";
  const b = boss.current;
  const showWorld = phase !== "black";
  const showBoss = ["bossIn", "heroIn", "bar", "talk", "fight", "ko", "outro"].includes(phase);
  const showHero = ["heroIn", "bar", "talk", "fight", "ko", "outro"].includes(phase);
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

  const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
  const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;

  return (
    <div className="absolute inset-0 z-[60] overflow-hidden select-none" style={{ background: def.sky }}>
      {showWorld && <ArenaArt type={type} />}
      <div className="absolute inset-0" style={{ background: `radial-gradient(90% 50% at 50% 18%, ${def.glow}28, transparent 70%)` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-black z-[70]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-black z-[70]" />

      <div className="absolute inset-0" style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {showWorld && def.plats.map((s, i) => (
          <div key={i} className="absolute mm-plat" style={{
            left: s.x, top: s.y, width: s.w, height: i === 0 ? 24 : s.h,
            animationDelay: `${i * 90}ms`,
            background: i === 0
              ? "linear-gradient(180deg,#8a5420,#4a2810 40%,#2a1408)"
              : "linear-gradient(180deg,#e8c48a,#a06a34)",
            borderRadius: i === 0 ? 0 : 5,
            boxShadow: i === 0 ? "inset 0 4px 0 #c9842a66" : "0 4px 0 #3a2010, inset 0 2px 0 #fff3d655",
          }}>
            {i === 0 && <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "repeating-linear-gradient(90deg,#c9842a 0 18px,#8a5420 18px 20px)" }} />}
          </div>
        ))}

        {phase === "fight" && b && b.telegraph > 0 && b.atkW > 0 && (
          <div className="absolute pointer-events-none" style={{
            left: b.atkX, top: b.atkY, width: b.atkW, height: b.atkH,
            border: "2px dashed #ff3060", background: "rgba(255,48,96,0.22)", borderRadius: 8,
          }}>
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 font-display font-bold text-[22px] text-amber-200">!</div>
          </div>
        )}

        {showBoss && b && (
          <div className={`absolute ${phase === "bossIn" ? "mm-boss-bossIn" : phase === "ko" ? "mm-boss-ko" : ""}`} style={{ left: b.x - 55, top: b.y - 55 }}>
            <BossView boss={b} size={110} />
          </div>
        )}

        {showHero && (
          <div className={`absolute ${heroAnim}`} style={{ left: p.current.x - 6, top: p.current.y - 10, opacity: p.current.inv > 0 && Math.floor(p.current.inv * 16) % 2 === 0 ? 0.35 : 1 }}>
            <Maxine skin={skin} pose={pose} facing={p.current.face} size={PW + 18} />
            {talk && beat?.who === "maxine" && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                <div className="bg-[#fff3d6] text-[#3a1808] font-display font-bold text-[11px] px-2 py-0.5 rounded-full border-2 border-[#7a4410] pop">
                  {beat.text.length > 28 ? `${beat.text.slice(0, 26)}…` : beat.text}
                </div>
              </div>
            )}
            {phase === "fight" && b && b.telegraph > 0 && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                <div className="bg-[#3a1808] text-amber-100 font-display font-bold text-[11px] px-2 py-0.5 rounded-full border border-amber-300/50">
                  {def.fightReact}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "fight" && bullets.current.map((bl) => <BulletView key={bl.id} b={bl} />)}
      </div>

      {(phase === "name" || barOn) && (
        <div className="absolute left-4 right-4 z-[72] pointer-events-none" style={{ top: 28 }}>
          <div className="text-center font-display font-bold text-[11px] text-amber-200/80 tracking-[0.2em]">{def.place}</div>
          <div className="text-center font-display font-bold text-[18px] text-rose-200" style={{ textShadow: "0 0 10px #ff3060" }}>{BOSS_NAME[type]}</div>
          {barOn && b && (
            <div className="mt-1 h-2.5 rounded-full border border-rose-300/50 bg-black/50 overflow-hidden mm-bar">
              <div className="h-full origin-left" style={{ width: `${Math.max(0, (b.hp / b.maxHp) * 100)}%`, background: "linear-gradient(90deg,#ff3060,#ffd27a)", transformOrigin: "left" }} />
            </div>
          )}
        </div>
      )}

      <div className="absolute top-2 left-2 z-[72] flex gap-1">{Array.from({ length: Math.max(3, hearts) }).map((_, i) => (
        <div key={i} className="w-4 h-4 rounded-full border border-rose-200" style={{ background: i < hearts ? "#ff5a6a" : "#3a2010" }} />
      ))}</div>

      {talk && (
        <button onClick={advanceTalk} className="absolute inset-x-4 z-[80] text-left" style={{ bottom: 28 }}>
          <div className="rounded-xl border-2 border-amber-300/40 bg-black/75 px-3 py-2.5 slide-up">
            <div className="font-pixel text-[8px] mb-1" style={{ color: beat?.who === "maxine" ? "#ffd27a" : "#ff8fa0" }}>
              {phase === "outro" ? (beat?.who === "maxine" ? "MAXINE" : "VICTORIA") : beat?.who === "maxine" ? "MAXINE" : BOSS_NAME[type]}
            </div>
            <p className="font-display text-[14px] text-amber-50 leading-snug">{beat?.text ?? ""}</p>
            <div className="text-right font-display text-[11px] text-amber-200/60 mt-1">tocá</div>
          </div>
        </button>
      )}

      {phase === "fight" && (
        <>
          <div className="absolute inset-0 z-[65]" style={{ touchAction: "none" }}
            onPointerDown={onPadDown} onPointerMove={onPadMove} onPointerUp={onPadUp} onPointerCancel={onPadUp} />
          <PawButton className="!z-[80]" onPress={() => { input.current.atk = true; }} />
        </>
      )}

      {phase === "ko" && (
        <div className="absolute inset-0 z-[75] flex items-center justify-center pointer-events-none">
          <div className="font-display font-bold text-5xl text-amber-100 pop" style={{ textShadow: "0 4px 0 #7a1410" }}>KO</div>
        </div>
      )}
    </div>
  );
}
