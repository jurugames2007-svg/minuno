import { useEffect, useRef, useState, type PointerEvent } from "react";
import Maxine, { type Pose } from "../art/Maxine";
import { Flour } from "../art/Decor";
import { type Boss, type Bullet, spawnBoss, stepBoss, BossView, BulletView, BOSS_NAME, type BossType } from "../art/Bosses";
import type { SkinId } from "../data/skins";
import { maxineIntroKind, moodPose, stageFor, type Plat } from "../data/cinematics";
import PawButton from "../ui/PawButton";

type Phase = "black" | "build" | "name" | "bossIn" | "heroIn" | "bar" | "talk" | "fight" | "ko" | "outro";

interface Props {
  type: BossType;
  level: number;
  skin: SkinId;
  hearts: number;
  onHurt: () => void;
  onWin: () => void;
  onSkipTalk?: () => void;
}

const W = 360;
const H = 640;
const PW = 26;
const PH = 34;
const G = 1400;
const JUMP = 460;

export default function BossStage({ type, level, skin, hearts, onHurt, onWin }: Props) {
  const def = stageFor(type);
  const [phase, setPhase] = useState<Phase>("black");
  const [line, setLine] = useState(0);
  const [barOn, setBarOn] = useState(false);
  const [, setTick] = useState(0);
  const phaseRef = useRef<Phase>("black");
  const p = useRef({ x: 48, y: 500, vx: 0, vy: 0, on: false, face: 1 as 1 | -1, inv: 0, atk: 0, atkCd: 0, coy: 0, buf: 0, used: false, prevY: 500 });
  const boss = useRef<Boss | null>(null);
  const bullets = useRef<Bullet[]>([]);
  const ids = useRef(1);
  const input = useRef({ l: false, r: false, jump: false, atk: false });
  const done = useRef(false);
  const invulnRef = useRef(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const seq: { ph: Phase; t: number }[] = [
      { ph: "black", t: 400 },
      { ph: "build", t: 1100 },
      { ph: "name", t: 900 },
      { ph: "bossIn", t: 1000 },
      { ph: "heroIn", t: 900 },
      { ph: "bar", t: 700 },
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
    boss.current = spawnBoss(type, level, 40, W - 40, 180);
    const b = boss.current;
    b.homeY = 220;
    b.y = 220;
    b.minX = 50;
    b.maxX = W - 50;
  }, [type, level]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const ctx = {
      playerX: 0, playerY: 0, left: 24, right: W - 24, top: 0, bottom: H,
      spawnBullet: (bl: Omit<Bullet, "id">) => { bullets.current.push({ id: ids.current++, ...bl }); },
      spawnMouse: () => { /* no minions in staged arena */ },
      shake: () => { /* overlay shake via tick */ },
    };
    const land = (pl: typeof p.current, plats: Plat[]) => {
      pl.on = false;
      if (pl.vy < 0) return;
      const feet = pl.y + PH;
      for (const s of plats) {
        if (pl.x + PW > s.x && pl.x < s.x + s.w && pl.prevY + PH <= s.y + 4 && feet >= s.y) {
          pl.y = s.y - PH - 0.4; pl.vy = 0; pl.on = true; pl.used = false; return;
        }
      }
    };
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const fighting = phaseRef.current === "fight";
      const pl = p.current;
      pl.prevY = pl.y;
      pl.inv = Math.max(0, pl.inv - dt); invulnRef.current = pl.inv;
      pl.atk = Math.max(0, pl.atk - dt); pl.atkCd = Math.max(0, pl.atkCd - dt);
      if (fighting) {
        const dir = (input.current.r ? 1 : 0) - (input.current.l ? 1 : 0);
        if (dir) pl.face = dir as 1 | -1;
        pl.vx = dir * 170;
        pl.x += pl.vx * dt;
        pl.x = Math.max(24, Math.min(W - 24 - PW, pl.x));
        pl.coy = pl.on ? 0.12 : Math.max(0, pl.coy - dt);
        if (input.current.jump) { input.current.jump = false; pl.buf = 0.12; }
        pl.buf = Math.max(0, pl.buf - dt);
        if (pl.buf > 0 && (pl.coy > 0 || !pl.used)) {
          const dbl = pl.coy <= 0;
          if (dbl) pl.used = true;
          pl.vy = dbl ? -JUMP * 0.9 : -JUMP;
          pl.buf = 0; pl.coy = 0; pl.on = false;
        }
        pl.vy += G * dt; if (pl.vy > 520) pl.vy = 520;
        pl.y += pl.vy * dt;
        land(pl, stageFor(type).plats);
        if (pl.y > H + 40) { pl.y = 480; pl.vy = 0; }

        if (input.current.atk) { input.current.atk = false; if (pl.atkCd <= 0) { pl.atkCd = 0.32; pl.atk = 0.18; } }
        const b = boss.current;
        if (b && pl.atk > 0) {
          const ax = pl.x + PW / 2 + pl.face * 22, ay = pl.y + PH / 2;
          if (Math.abs(ax - b.x) < 48 && Math.abs(ay - b.y) < 48) {
            if (b.vulnerable || b.stun > 0) {
              b.hp -= 1; b.flash = 0.16;
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
          if (Math.abs(pl.x + PW / 2 - b.x) < 36 && Math.abs(pl.y + PH / 2 - b.y) < 36 && pl.inv <= 0) {
            pl.inv = 1.1; pl.vy = -180; pl.vx = pl.x < b.x ? -140 : 140; onHurt();
          }
        }
        for (let i = bullets.current.length - 1; i >= 0; i--) {
          const bl = bullets.current[i];
          bl.life -= dt; if (bl.grav) bl.vy += bl.grav * dt;
          bl.x += bl.vx * dt; bl.y += bl.vy * dt;
          if (bl.life <= 0) { bullets.current.splice(i, 1); continue; }
          if (Math.abs(bl.x - (pl.x + PW / 2)) < 16 && Math.abs(bl.y - (pl.y + PH / 2)) < 16 && pl.inv <= 0) {
            pl.inv = 1.1; onHurt(); bullets.current.splice(i, 1);
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

  const advanceTalk = () => {
    if (phase === "talk") {
      if (line + 1 >= def.intro.length) { setPhase("fight"); setLine(0); }
      else setLine((n) => n + 1);
    } else if (phase === "outro") {
      if (line + 1 >= def.outro.length) onWin();
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

  return (
    <div className="absolute inset-0 z-[60] overflow-hidden select-none" style={{ background: def.sky }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(90% 60% at 50% 20%, ${def.glow}33, transparent 70%)` }} />
      <Flour count={12} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-black z-[70]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-black z-[70]" />

      {showWorld && (
        <div className="absolute inset-0">
          {def.plats.map((s, i) => (
            <div key={i} className="absolute mm-plat" style={{
              left: s.x, top: s.y, width: s.w, height: s.h,
              animationDelay: `${i * 80}ms`,
              background: i === 0 ? "linear-gradient(180deg,#6a3a18,#3a1c08)" : "linear-gradient(180deg,#c9a06a,#8a5a2c)",
              borderRadius: 4, boxShadow: "0 3px 0 #1a0c04, inset 0 1px 0 #ffe0b055",
            }} />
          ))}
        </div>
      )}

      {showBoss && b && (
        <div className={`absolute mm-boss-${phase === "bossIn" || phase === "ko" ? phase : "idle"}`} style={{ left: b.x - 55, top: b.y - 55 }}>
          <BossView boss={b} size={110} />
        </div>
      )}

      {showHero && (
        <div className={`absolute mm-hero-${kind}`} style={{ left: p.current.x - 6, top: p.current.y - 10, opacity: p.current.inv > 0 && Math.floor(p.current.inv * 16) % 2 === 0 ? 0.35 : 1 }}>
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

      <style>{`
        .mm-plat { animation: mm-plat .55s cubic-bezier(.2,1.2,.3,1) both; }
        @keyframes mm-plat { from { transform: translateY(70px); opacity: 0; } to { transform: none; opacity: 1; } }
        .mm-bar { animation: mm-bar .55s cubic-bezier(.2,.8,.2,1) both; transform-origin: left; }
        @keyframes mm-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .mm-boss-bossIn { animation: mm-boss-in .85s cubic-bezier(.2,1.2,.3,1) both; }
        .mm-boss-ko { animation: mm-boss-ko .8s ease both; }
        .mm-boss-idle {}
        @keyframes mm-boss-in { 0% { transform: translateY(-180px) scale(.6); opacity: 0; } 70% { transform: translateY(8px) scale(1.06); opacity: 1; } 100% { transform: none; } }
        @keyframes mm-boss-ko { to { transform: translateY(40px) rotate(18deg); opacity: 0; filter: brightness(3); } }
        .mm-hero-dash { animation: mm-dash .7s cubic-bezier(.2,.8,.2,1) both; }
        .mm-hero-drop { animation: mm-drop .75s cubic-bezier(.2,1.2,.3,1) both; }
        .mm-hero-fade { animation: mm-fade .8s ease both; }
        .mm-hero-spin { animation: mm-spin .8s cubic-bezier(.2,1.3,.3,1) both; }
        .mm-hero-tiny { animation: mm-tiny .7s cubic-bezier(.2,1.4,.3,1) both; }
        .mm-hero-charge { animation: mm-charge .55s cubic-bezier(.1,.8,.2,1) both; }
        .mm-hero-sparkle { animation: mm-spark .8s ease both; }
        @keyframes mm-dash { from { transform: translateX(-90px); opacity: 0; } }
        @keyframes mm-drop { 0% { transform: translateY(-160px); opacity: 0; } 75% { transform: translateY(8px); } }
        @keyframes mm-fade { from { opacity: 0; filter: blur(8px); } }
        @keyframes mm-spin { from { transform: rotate(-400deg) scale(.2); opacity: 0; } }
        @keyframes mm-tiny { from { transform: scale(.2) translateY(30px); opacity: 0; } }
        @keyframes mm-charge { from { transform: translateX(-120px) scaleX(1.3); opacity: 0; } }
        @keyframes mm-spark { 0% { opacity: 0; filter: drop-shadow(0 0 0 #fff); } 50% { filter: drop-shadow(0 0 12px #ffd27a); } }
      `}</style>
    </div>
  );
}
