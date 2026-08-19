import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Maxine from "../art/Maxine";
import { spawnBoss, BossView, BOSS_NAME, type BossType } from "../art/Bosses";
import { Heart } from "../art/Decor";
import type { SkinId } from "../data/skins";
import { BOSS_GENRE, type GenreId } from "../data/bossModes";
import { stageFor } from "../data/cinematics";
import { PawIcon } from "../ui/PawButton";
import * as Audio from "./AudioEngine";

interface Props {
  type: BossType;
  level: number;
  skin: SkinId;
  hearts: number;
  onHurt: () => void;
  onWin: () => void;
}

const BG = "#3D2817";
const WOOD = "#8B6914";
const MAG = "#C71585";
const CREAM = "#fff3d6";
const INK = "#1a0c04";

export default function GenreFight({ type, level, skin, hearts, onHurt, onWin }: Props) {
  const genre = BOSS_GENRE[type];
  const stage = stageFor(type);
  const [intro, setIntro] = useState(0);
  const [hp, setHp] = useState(10);
  const max = useRef(10);
  const boss = useRef(spawnBoss(type, level, 40, 320, 80));
  const done = useRef(false);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState<"hit" | "hurt" | 0>(0);
  const [ko, setKo] = useState(false);
  const hurtCd = useRef(0);
  const hitCd = useRef(0);

  useEffect(() => {
    const a = window.setTimeout(() => setIntro(1), 80);
    const b = window.setTimeout(() => setIntro(2), 900);
    const c = window.setTimeout(() => setIntro(3), 3000);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (hurtCd.current && now > hurtCd.current) hurtCd.current = 0;
      if (hitCd.current && now > hitCd.current) hitCd.current = 0;
      setShake((n) => (n > 0 ? n - 1 : 0));
      setFlash((f) => (f ? 0 : f));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onWinRef = useRef(onWin);
  const onHurtRef = useRef(onHurt);
  onWinRef.current = onWin;
  onHurtRef.current = onHurt;

  const hit = useCallback((n = 1) => {
    if (done.current) return;
    const now = performance.now();
    if (now < hitCd.current) return;
    hitCd.current = now + 140;
    Audio.playHit();
    setShake(2);
    setFlash("hit");
    setHp((h) => {
      const next = h - n;
      if (next <= 0 && !done.current) {
        done.current = true;
        setKo(true);
        Audio.playKo();
        window.setTimeout(() => onWinRef.current(), 700);
      }
      return next;
    });
    boss.current.flash = 0.18;
    boss.current.hp = Math.max(0, boss.current.hp - n);
  }, []);

  const hurt = useCallback(() => {
    const now = performance.now();
    if (now < hurtCd.current || done.current) return;
    hurtCd.current = now + 700;
    Audio.playMiss();
    setShake(2);
    setFlash("hurt");
    onHurtRef.current();
  }, []);

  const pct = Math.max(0, hp / max.current);
  const bar = pct > 0.55 ? "#e53935" : pct > 0.28 ? "#fb8c00" : "#ffd54a";
  const sx = shake > 0 ? (Math.random() - 0.5) * 4 : 0;
  const sy = shake > 0 ? (Math.random() - 0.5) * 4 : 0;

  return (
    <div className="absolute inset-0 z-[60] overflow-hidden select-none" style={{ background: BG }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(70% 48% at 50% 30%, ${WOOD}66, transparent 70%)`,
      }} />

      <div className="absolute inset-x-0 top-0 z-40 pointer-events-none" style={{ height: "10%" }}>
        <div className="absolute top-1 left-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => <Heart key={i} filled={i < hearts} size={16} />)}
        </div>
        <div className="absolute left-0 right-0" style={{ top: 20 }}>
          <div className="font-pixel text-[8px] text-white text-center leading-none" style={{ textShadow: "-1px 0 #000, 1px 0 #000, 0 -1px #000, 0 1px #000" }}>
            {BOSS_NAME[type]}
          </div>
          <div className="h-2 mt-1 overflow-hidden" style={{ background: INK, borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
            <div className="h-full" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg,#8b0000,${bar})` }} />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0" style={{ top: "10%", bottom: 0, transform: `translate(${sx}px, ${sy}px)` }}>
        {intro < 3 ? (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center" style={{ background: "#0a0402" }}>
            <div className="font-pixel text-[8px] text-white mb-2 tracking-[0.18em]" style={{ textShadow: "1px 1px 0 #000", opacity: intro >= 1 ? 1 : 0 }}>
              APARECIÓ UN JEFE
            </div>
            <div style={{ transform: intro >= 1 ? "scale(1)" : "scale(0.4)", opacity: intro >= 1 ? 1 : 0, transition: "transform .25s, opacity .25s" }}>
              <BossView boss={boss.current} size={148} />
            </div>
            <div className="font-pixel text-[8px] text-white mt-3" style={{ textShadow: "1px 1px 0 #000" }}>{BOSS_NAME[type]}</div>
            <div className="font-pixel text-[7px] mt-1" style={{ color: MAG }}>{stage.place}</div>
          </div>
        ) : (
          <Play genre={genre} skin={skin} onHit={hit} onHurt={hurt} type={type} />
        )}
      </div>

      {flash === "hurt" && <div className="absolute inset-0 z-50 pointer-events-none" style={{ background: MAG, opacity: 0.28 }} />}
      {flash === "hit" && <div className="absolute inset-0 z-50 pointer-events-none" style={{ background: CREAM, opacity: 0.12 }} />}
      {ko && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center pointer-events-none" style={{ background: "#0a0402cc" }}>
          <div className="font-pixel text-[22px] text-white" style={{ textShadow: "3px 3px 0 #7a1410" }}>KO</div>
        </div>
      )}
    </div>
  );
}

function Play({ genre, skin, onHit, onHurt, type }: { genre: GenreId; skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  if (genre === "tiles") return <Tiles onHit={onHit} onHurt={onHurt} />;
  if (genre === "shmup") return <Shmup skin={skin} onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "rpg") return <Rpg onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "dance") return <Dance onHit={onHit} onHurt={onHurt} />;
  if (genre === "juicio") return <Juicio onHit={onHit} onHurt={onHurt} />;
  if (genre === "novela") return <Novela onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "sigilo") return <Sigilo skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "breakout") return <Breakout onHit={onHit} onHurt={onHurt} />;
  if (genre === "lucha") return <Lucha skin={skin} onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "carrera") return <Carrera onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "micro") return <Micro skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "td") return <Td onHit={onHit} onHurt={onHurt} />;
  if (genre === "runner") return <Runner skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "match3") return <Match3 onHit={onHit} />;
  if (genre === "doodle") return <Doodle skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "cocina") return <Cocina onHit={onHit} onHurt={onHurt} />;
  if (genre === "fisica") return <Fisica onHit={onHit} type={type} />;
  if (genre === "cavar") return <Cavar skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "snake") return <Snake onHit={onHit} onHurt={onHurt} />;
  return <Final onHit={onHit} onHurt={onHurt} type={type} />;
}

function Pad({ children, onPress, w = 60, h = 60 }: { children: ReactNode; onPress: () => void; w?: number; h?: number }) {
  return (
    <button type="button" onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className="font-pixel text-[8px] text-white flex items-center justify-center"
      style={{ width: w, height: h, background: "rgba(26,12,4,0.62)", border: "2px solid rgba(10,4,2,0.5)", opacity: 0.72 }}>
      {children}
    </button>
  );
}

function useLoop(fn: (dt: number) => void, deps: unknown[]) {
  useEffect(() => {
    let raf = 0; let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      fn(dt);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Tiles({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const tiles = useRef<{ id: number; y: number; lane: number; hit: boolean }[]>([
    { id: 1, y: 40, lane: 1, hit: false }, { id: 2, y: -90, lane: 3, hit: false }, { id: 3, y: -220, lane: 0, hit: false },
  ]);
  const nid = useRef(4);
  const spawn = useRef(0);
  const [, setT] = useState(0);
  const ZONE = 430;
  useLoop((dt) => {
    spawn.current += dt;
    if (spawn.current > 0.62) {
      spawn.current = 0;
      tiles.current.push({ id: nid.current++, y: -80, lane: Math.floor(Math.random() * 4), hit: false });
    }
    for (const t of tiles.current) t.y += 210 * dt;
    for (const t of tiles.current) {
      if (!t.hit && t.y > ZONE + 58) { t.hit = true; onHurt(); }
    }
    tiles.current = tiles.current.filter((t) => t.y < 620);
    setT((n) => n + 1);
  }, [onHurt]);
  const tap = (lane: number) => {
    const t = tiles.current.find((x) => !x.hit && x.lane === lane && x.y > ZONE - 50 && x.y < ZONE + 50);
    if (!t) { onHurt(); return; }
    t.hit = true;
    onHit(1);
    tiles.current = tiles.current.filter((x) => x !== t);
  };
  return (
    <div className="absolute inset-0">
      {[0, 1, 2, 3].map((l) => (
        <button key={l} onPointerDown={() => tap(l)} className="absolute top-0 bottom-0" style={{ left: `${l * 25}%`, width: "25%", background: l % 2 ? "#2a1a1088" : "#24160e88" }} />
      ))}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: ZONE, height: 52, borderTop: `2px solid ${CREAM}`, borderBottom: `2px solid ${CREAM}`, background: "#fff3d618" }} />
      {tiles.current.filter((t) => !t.hit).map((t) => (
        <div key={t.id} className="absolute pointer-events-none" style={{
          left: `${t.lane * 25 + 3}%`, width: "19%", top: t.y, height: 70,
          background: INK, border: `3px solid ${MAG}`, boxShadow: `0 0 8px ${MAG}66`,
        }} />
      ))}
    </div>
  );
}

function Shmup({ skin, onHit, onHurt, type }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const p = useRef({ x: 180, y: 460 });
  const shots = useRef<{ x: number; y: number }[]>([]);
  const bullets = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const acc = useRef(0);
  const dmg = useRef(0);
  const [, setT] = useState(0);
  useLoop((dt) => {
    const b = boss.current;
    b.t += dt;
    b.x = 180 + Math.sin(b.t * 1.2) * 86;
    acc.current += dt;
    if (acc.current > 0.18) {
      acc.current = 0;
      shots.current.push({ x: p.current.x, y: p.current.y - 10 });
      const wave = Math.floor(b.t / 3) % 3;
      if (wave === 0) {
        const a = b.t * 4;
        bullets.current.push({ x: b.x, y: 88, vx: Math.cos(a) * 70, vy: 80 + Math.sin(a) * 20 });
      } else if (wave === 1) {
        for (let i = -1; i <= 1; i++) bullets.current.push({ x: b.x, y: 88, vx: i * 55, vy: 110 });
      } else {
        bullets.current.push({ x: b.x, y: 88, vx: (p.current.x - b.x) * 0.35, vy: 130 });
      }
    }
    shots.current = shots.current.filter((s) => {
      s.y -= 340 * dt;
      if (Math.hypot(s.x - b.x, s.y - 90) < 38) {
        dmg.current += dt;
        if (dmg.current > 0.25) { dmg.current = 0; onHit(1); }
        return false;
      }
      return s.y > 8;
    });
    bullets.current = bullets.current.filter((bl) => {
      bl.x += bl.vx * dt; bl.y += bl.vy * dt;
      if (Math.hypot(bl.x - p.current.x, bl.y - p.current.y) < 16) { onHurt(); return false; }
      return bl.y < 600 && bl.x > -10 && bl.x < 370;
    });
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        p.current.x = Math.max(18, Math.min(342, ((e.clientX - r.left) / r.width) * 360));
        p.current.y = Math.max(80, Math.min(530, ((e.clientY - r.top) / r.height) * 560));
      }}>
      <div className="absolute" style={{ left: boss.current.x - 48, top: 28 }}><BossView boss={boss.current} size={96} /></div>
      {shots.current.map((s, i) => <div key={i} className="absolute w-1.5 h-3" style={{ left: s.x, top: s.y, background: CREAM }} />)}
      {bullets.current.map((b, i) => <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ left: b.x, top: b.y, background: MAG, boxShadow: `0 0 6px ${MAG}` }} />)}
      <div className="absolute" style={{ left: p.current.x - 18, top: p.current.y - 18 }}><Maxine skin={skin} size={36} /></div>
    </div>
  );
}

function Rpg({ onHit, onHurt, type }: { onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const [lock, setLock] = useState(false);
  const [tele, setTele] = useState<"bite" | "slam" | null>("slam");
  const [hide, setHide] = useState(false);
  const [buff, setBuff] = useState(0);
  const act = (kind: "morder" | "ladrar" | "mirada" | "esconder") => {
    if (lock) return;
    setLock(true);
    if (kind === "esconder") {
      setHide(true);
      window.setTimeout(() => { setHide(false); setTele(Math.random() < 0.5 ? "bite" : "slam"); setLock(false); }, 700);
      return;
    }
    if (kind === "ladrar") {
      onHit(1);
      setTele(null);
      window.setTimeout(() => { setTele(Math.random() < 0.5 ? "bite" : "slam"); setLock(false); }, 700);
      return;
    }
    if (kind === "mirada") {
      setBuff((n) => n + 1);
      window.setTimeout(() => { setLock(false); }, 500);
      return;
    }
    onHit(1 + buff);
    setBuff(0);
    if (tele && !hide) onHurt();
    window.setTimeout(() => { setTele(Math.random() < 0.5 ? "bite" : "slam"); setLock(false); }, 700);
  };
  return (
    <div className="absolute inset-0">
      <div className="absolute right-4 top-6"><BossView boss={boss.current} size={120} /></div>
      {tele && <div className="absolute right-8 top-2 font-pixel text-[8px]" style={{ color: MAG }}>{tele === "slam" ? "!" : "!!"}</div>}
      <div className="absolute left-3 bottom-36" style={{ opacity: hide ? 0.35 : 1 }}><Maxine size={72} pose="dig" /></div>
      <div className="absolute bottom-3 inset-x-3 grid grid-cols-2 gap-2">
        <Pad onPress={() => act("morder")} w={undefined as unknown as number} h={52}>MORDER</Pad>
        <button type="button" onPointerDown={() => act("ladrar")} className="font-pixel text-[8px] text-white h-[52px]" style={{ background: "rgba(26,12,4,0.62)", opacity: 0.72 }}>LADRAR</button>
        <button type="button" onPointerDown={() => act("mirada")} className="font-pixel text-[8px] text-white h-[52px]" style={{ background: "rgba(26,12,4,0.62)", opacity: 0.72 }}>MIRADA</button>
        <button type="button" onPointerDown={() => act("esconder")} className="font-pixel text-[8px] text-white h-[52px]" style={{ background: "rgba(26,12,4,0.62)", opacity: 0.72 }}>ESCONDER</button>
      </div>
    </div>
  );
}

function Dance({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const notes = useRef<{ id: number; lane: number; y: number; done: boolean }[]>([]);
  const nid = useRef(1);
  const spawn = useRef(0);
  const LINE = 390;
  const [, setT] = useState(0);
  useLoop((dt) => {
    spawn.current += dt;
    if (spawn.current > 0.7) {
      spawn.current = 0;
      notes.current.push({ id: nid.current++, lane: Math.floor(Math.random() * 4), y: -40, done: false });
    }
    for (const n of notes.current) n.y += 240 * dt;
    for (const n of notes.current) if (!n.done && n.y > LINE + 46) { n.done = true; onHurt(); }
    notes.current = notes.current.filter((n) => n.y < 560);
    setT((x) => x + 1);
  }, [onHurt]);
  const press = (lane: number) => {
    const n = notes.current.find((q) => !q.done && q.lane === lane && Math.abs(q.y - LINE) < 42);
    if (!n) { onHurt(); return; }
    n.done = true;
    onHit(1);
    notes.current = notes.current.filter((q) => q !== n);
  };
  const arrows = ["←", "↑", "→", "↓"];
  return (
    <div className="absolute inset-0">
      <div className="absolute left-8 right-8" style={{ top: LINE, height: 44, border: `2px solid ${CREAM}`, background: "#fff3d614" }} />
      {notes.current.filter((n) => !n.done).map((n) => (
        <div key={n.id} className="absolute w-12 h-12 flex items-center justify-center font-pixel text-[12px] text-white"
          style={{ left: 28 + n.lane * 78, top: n.y, background: MAG, border: `2px solid ${INK}` }}>{arrows[n.lane]}</div>
      ))}
      <div className="absolute bottom-3 inset-x-6 flex justify-between">
        <Pad onPress={() => press(0)}>←</Pad>
        <Pad onPress={() => press(1)}>↑</Pad>
        <Pad onPress={() => press(3)}>↓</Pad>
        <Pad onPress={() => press(2)}>→</Pad>
      </div>
    </div>
  );
}

const CASES = [
  { claim: "«¡El perro tiró la harina!»", good: "PELO", opts: ["PELO", "CUCHARA", "NADA"] },
  { claim: "«¡Nadie abrió la alacena!»", good: "HUELLA", opts: ["HUELLA", "VAPOR", "NADA"] },
  { claim: "«¡Fue el viento!»", good: "BIGOTE", opts: ["VIENTO", "BIGOTE", "HARINA"] },
];

function Juicio({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [i, setI] = useState(0);
  const c = CASES[i % CASES.length];
  return (
    <div className="absolute inset-x-4 flex flex-col justify-end gap-2" style={{ top: 24, bottom: 14 }}>
      <div className="font-pixel text-[7px] text-center text-white mb-2" style={{ textShadow: "1px 1px 0 #000" }}>{c.claim}</div>
      {c.opts.map((p) => (
        <button key={p} onClick={() => {
          if (p === c.good) onHit(2); else onHurt();
          setI((n) => n + 1);
        }} className="font-pixel text-[8px] py-3" style={{ background: "rgba(255,243,214,0.78)", color: "#3a1808" }}>{p}</button>
      ))}
    </div>
  );
}

const SCENES = [
  { line: "El pasillo se oscurece.", opts: [["AVANZAR", true], ["ESPERAR", true], ["LADRAR", false]] as const },
  { line: "Una olla cae sola.", opts: [["ESQUIVAR", true], ["MORDER", false], ["OLER", true]] as const },
  { line: "Oís a Javiera lejos.", opts: [["CORRER", true], ["AULLAR", false], ["SEGUIR", true]] as const },
];

function Novela({ onHit, onHurt, type }: { onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const [i, setI] = useState(0);
  const [t, setT] = useState(8);
  const scene = SCENES[i % SCENES.length];
  useEffect(() => {
    const id = window.setInterval(() => setT((n) => {
      if (n <= 1) { onHurt(); setI((s) => s + 1); return 8; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [onHurt, i]);
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 -translate-x-1/2 top-4"><BossView boss={boss.current} size={100} /></div>
      <div className="absolute inset-x-4 bottom-3 flex flex-col gap-2">
        <div className="h-1.5" style={{ background: INK }}><div className="h-full" style={{ width: `${(t / 8) * 100}%`, background: MAG }} /></div>
        <div className="font-pixel text-[7px] text-white text-center" style={{ textShadow: "1px 1px 0 #000" }}>{scene.line}</div>
        {scene.opts.map(([n, ok]) => (
          <button key={n} onClick={() => { if (ok) onHit(2); else onHurt(); setI((s) => s + 1); setT(8); }}
            className="font-pixel text-[8px] py-3 text-white" style={{ background: "rgba(26,12,4,0.7)" }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function Sigilo({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const p = useRef({ x: 40, y: 420 });
  const ang = useRef(0);
  const [, setT] = useState(0);
  useLoop((dt) => {
    ang.current += dt * 1.15;
    const cx = 180, cy = 210;
    const dx = p.current.x - cx, dy = p.current.y - cy;
    const a = Math.atan2(dy, dx);
    let d = a - ang.current;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    const dist = Math.hypot(dx, dy);
    if (Math.abs(d) < 0.42 && dist < 170) {
      onHurt();
      p.current = { x: 40, y: 420 };
    }
    setT((n) => n + 1);
  }, [onHurt]);
  const goal = Math.hypot(p.current.x - 300, p.current.y - 80) < 36;
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        p.current.x = ((e.clientX - r.left) / r.width) * 340;
        p.current.y = ((e.clientY - r.top) / r.height) * 540;
      }}
      onPointerDown={() => { if (goal) onHit(3); }}>
      <div className="absolute left-[180px] top-[210px] w-0 h-0">
        <div style={{
          width: 170, height: 170, transform: `rotate(${ang.current}rad)`, transformOrigin: "0 0",
          background: "conic-gradient(from -24deg, #c7158533 0 48deg, transparent 48deg)",
        }} />
      </div>
      <div className="absolute w-6 h-6 rounded-full" style={{ left: 168, top: 198, background: MAG }} />
      <div className="absolute w-8 h-14" style={{ left: 292, top: 64, background: INK, border: `2px solid ${CREAM}` }} />
      <div className="absolute" style={{ left: p.current.x - 16, top: p.current.y - 16 }}><Maxine skin={skin} size={36} /></div>
    </div>
  );
}

function Breakout({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const pad = useRef(145);
  const ball = useRef({ x: 180, y: 300, vx: 130, vy: -170 });
  const bricks = useRef(Array.from({ length: 18 }, (_, i) => ({ x: 18 + (i % 6) * 54, y: 36 + Math.floor(i / 6) * 26, on: true })));
  const [, setT] = useState(0);
  useLoop((dt) => {
    const b = ball.current;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < 8 || b.x > 350) b.vx *= -1;
    if (b.y < 8) b.vy = Math.abs(b.vy);
    if (b.y > 488 && b.x > pad.current && b.x < pad.current + 78) {
      b.vy = -Math.abs(b.vy);
      b.vx = ((b.x - (pad.current + 39)) / 39) * 180;
    }
    if (b.y > 560) { onHurt(); b.x = 180; b.y = 300; b.vx = 130; b.vy = -170; }
    for (const k of bricks.current) {
      if (!k.on) continue;
      if (b.x > k.x && b.x < k.x + 50 && b.y > k.y && b.y < k.y + 22) {
        k.on = false; b.vy *= -1; onHit(1);
      }
    }
    if (bricks.current.every((k) => !k.on)) {
      bricks.current = bricks.current.map((k) => ({ ...k, on: true }));
    }
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pad.current = Math.max(4, Math.min(278, ((e.clientX - r.left) / r.width) * 360 - 39));
      }}>
      {bricks.current.filter((k) => k.on).map((k, i) => (
        <div key={i} className="absolute" style={{ left: k.x, top: k.y, width: 50, height: 20, background: i % 2 ? MAG : WOOD, border: `1px solid ${INK}` }} />
      ))}
      <div className="absolute w-2.5 h-2.5 rounded-full" style={{ left: ball.current.x, top: ball.current.y, background: CREAM }} />
      <div className="absolute h-3" style={{ left: pad.current, top: 500, width: 78, background: CREAM, opacity: 0.8 }} />
    </div>
  );
}

function Lucha({ skin, onHit, onHurt, type }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 100, 280, 180));
  const [warn, setWarn] = useState<"hi" | "lo" | null>(null);
  const [pose, setPose] = useState<"idle" | "dig">("idle");
  const lock = useRef(false);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (lock.current) return;
      const w = Math.random() < 0.5 ? "hi" : "lo";
      setWarn(w);
      lock.current = true;
      window.setTimeout(() => {
        setWarn(null);
        lock.current = false;
      }, 900);
    }, 1400);
    return () => clearInterval(id);
  }, []);
  const act = (kind: "hi" | "lo" | "block") => {
    if (!warn) return;
    if (kind === "block") { setWarn(null); lock.current = false; return; }
    if (kind !== warn) { onHit(1); setPose("dig"); }
    else onHurt();
    setWarn(null);
    lock.current = false;
    window.setTimeout(() => setPose("idle"), 200);
  };
  return (
    <div className="absolute inset-0">
      <div className="absolute right-4 top-10" style={{ transform: warn === "hi" ? "translateY(-10px)" : warn === "lo" ? "translateY(12px)" : undefined }}>
        <BossView boss={boss.current} size={124} />
      </div>
      {warn && <div className="absolute right-10 top-4 font-pixel text-[10px] text-white" style={{ textShadow: "1px 1px 0 #000" }}>{warn === "hi" ? "ALTO" : "BAJO"}</div>}
      <div className="absolute left-3 bottom-28"><Maxine skin={skin} size={80} pose={pose} /></div>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <Pad onPress={() => act("hi")}>ALTO</Pad>
        <Pad onPress={() => act("lo")}>BAJO</Pad>
        <Pad onPress={() => act("block")}>BLOQ</Pad>
      </div>
    </div>
  );
}

function Carrera({ onHit, onHurt, type }: { onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const [lane, setLane] = useState(1);
  const laneRef = useRef(1);
  const obs = useRef<{ y: number; lane: number; id: number }[]>([]);
  const nid = useRef(1);
  const spawn = useRef(0);
  const dist = useRef(0);
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const [, setT] = useState(0);
  useLoop((dt) => {
    spawn.current += dt;
    if (spawn.current > 0.7) {
      spawn.current = 0;
      const L = Math.floor(Math.random() * 3);
      obs.current.push({ y: -40, lane: L, id: nid.current++ });
    }
    for (const o of obs.current) o.y += 260 * dt;
    const hitO = obs.current.find((o) => o.lane === laneRef.current && o.y > 430 && o.y < 490);
    if (hitO) { onHurt(); obs.current = obs.current.filter((o) => o !== hitO); }
    const passed = obs.current.filter((o) => o.y > 540);
    if (passed.length) {
      dist.current += passed.length;
      if (dist.current % 2 === 0) onHit(1);
    }
    obs.current = obs.current.filter((o) => o.y < 560);
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  const go = (d: number) => {
    const n = Math.max(0, Math.min(2, lane + d));
    setLane(n); laneRef.current = n;
  };
  return (
    <div className="absolute inset-0">
      {[0, 1, 2].map((i) => <div key={i} className="absolute top-0 bottom-16" style={{ left: 48 + i * 88, width: 70, background: "#00000018" }} />)}
      <div className="absolute top-6" style={{ left: 54 + 88, opacity: 0.9 }}><BossView boss={boss.current} size={64} /></div>
      {obs.current.map((o) => <div key={o.id} className="absolute w-12 h-8" style={{ left: 58 + o.lane * 88, top: o.y, background: WOOD, border: `2px solid ${INK}` }} />)}
      <div className="absolute bottom-20" style={{ left: 56 + lane * 88 }}><Maxine size={40} /></div>
      <div className="absolute bottom-3 inset-x-10 flex justify-between">
        <Pad onPress={() => go(-1)}>←</Pad>
        <Pad onPress={() => go(1)}>→</Pad>
      </div>
    </div>
  );
}

function Micro({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const p = useRef({ x: 160, y: 400, vy: 0, on: true });
  const plats = useRef([{ x: 80, y: 450, w: 200 }, { x: 40, y: 330, w: 120 }, { x: 200, y: 230, w: 120 }, { x: 90, y: 130, w: 140 }]);
  const [, setT] = useState(0);
  useLoop((dt) => {
    const pl = p.current;
    pl.vy += 900 * dt;
    pl.y += pl.vy * dt;
    pl.on = false;
    if (pl.vy >= 0) {
      for (const s of plats.current) {
        if (pl.x + 20 > s.x && pl.x < s.x + s.w && pl.y > s.y - 8 && pl.y < s.y + 14) {
          pl.y = s.y - 6; pl.vy = 0; pl.on = true;
        }
      }
    }
    if (pl.y > 560) { onHurt(); pl.y = 400; pl.vy = 0; pl.x = 160; }
    if (pl.y < 70) { onHit(2); pl.y = 400; pl.x = 160; pl.vy = 0; }
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerDown={() => { if (p.current.on) p.current.vy = -340; }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        p.current.x = ((e.clientX - r.left) / r.width) * 320;
      }}>
      {plats.current.map((s, i) => <div key={i} className="absolute h-2" style={{ left: s.x, top: s.y, width: s.w, background: WOOD }} />)}
      <div className="absolute" style={{ left: p.current.x, top: p.current.y }}><Maxine skin={skin} size={36} pose={p.current.on ? "idle" : "fall"} /></div>
    </div>
  );
}

function Td({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const ants = useRef<{ x: number; id: number }[]>([{ x: -20, id: 1 }]);
  const traps = useRef<{ x: number; id: number }[]>([]);
  const nid = useRef(2);
  const spawn = useRef(0);
  const [, setT] = useState(0);
  useLoop((dt) => {
    spawn.current += dt;
    if (spawn.current > 1.4) { spawn.current = 0; ants.current.push({ x: -24, id: nid.current++ }); }
    for (const a of ants.current) a.x += 70 * dt;
    for (const a of ants.current) {
      const tr = traps.current.find((t) => Math.abs(t.x - a.x) < 18);
      if (tr) { onHit(1); a.x = 999; traps.current = traps.current.filter((t) => t !== tr); }
      if (a.x > 340) { onHurt(); a.x = 999; }
    }
    ants.current = ants.current.filter((a) => a.x < 400);
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0" onPointerDown={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 360;
      if (traps.current.length < 3) traps.current.push({ x, id: nid.current++ });
    }}>
      <div className="absolute left-0 right-0 h-10" style={{ top: 180, background: "#5a3a1488" }} />
      {ants.current.map((a) => <div key={a.id} className="absolute w-7 h-7 rounded-full" style={{ left: a.x, top: 186, background: MAG }} />)}
      {traps.current.map((t) => <div key={t.id} className="absolute w-5 h-10" style={{ left: t.x, top: 176, background: "#7fc24a" }} />)}
    </div>
  );
}

function Runner({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const duck = useRef(false);
  const jump = useRef(0);
  const obs = useRef<{ x: number; kind: "up" | "lo"; id: number }>({ x: 360, kind: "lo", id: 1 });
  const nid = useRef(2);
  const [, setT] = useState(0);
  useLoop((dt) => {
    if (jump.current > 0) jump.current = Math.max(0, jump.current - dt);
    obs.current.x -= 210 * dt;
    if (obs.current.x < -30) {
      onHit(1);
      obs.current = { x: 380, kind: Math.random() < 0.5 ? "up" : "lo", id: nid.current++ };
    }
    if (obs.current.x < 92 && obs.current.x > 48) {
      if (obs.current.kind === "lo" && jump.current <= 0) onHurt();
      if (obs.current.kind === "up" && !duck.current) onHurt();
    }
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0">
      <div className="absolute left-0 right-0" style={{ bottom: 88, height: 8, background: WOOD }} />
      <div className="absolute left-10" style={{ bottom: jump.current > 0 ? 160 : 96 }}><Maxine skin={skin} size={56} pose={duck.current ? "dig" : jump.current > 0 ? "fall" : "idle"} /></div>
      <div className="absolute w-10" style={{
        left: obs.current.x, bottom: obs.current.kind === "up" ? 148 : 96,
        height: obs.current.kind === "up" ? 70 : 36, background: INK, border: `2px solid ${MAG}`,
      }} />
      <div className="absolute bottom-3 inset-x-6 flex justify-between">
        <Pad onPress={() => { duck.current = false; jump.current = 0.42; }}>↑</Pad>
        <button type="button" onPointerDown={() => { duck.current = true; }} onPointerUp={() => { duck.current = false; }}
          className="font-pixel text-[8px] text-white" style={{ width: 60, height: 60, background: "rgba(26,12,4,0.62)", opacity: 0.72 }}>↓</button>
      </div>
    </div>
  );
}

const GEMS = ["#E91E63", "#ffd27a", "#7fd0ff", "#7fc24a"];

function fillBoard(): number[] {
  const a = Array.from({ length: 16 }, () => Math.floor(Math.random() * 4));
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(i / 4), c = i % 4;
    if (c >= 2 && a[i] === a[i - 1] && a[i] === a[i - 2]) a[i] = (a[i] + 1) % 4;
    if (r >= 2 && a[i] === a[i - 4] && a[i] === a[i - 8]) a[i] = (a[i] + 1) % 4;
  }
  return a;
}

function Match3({ onHit }: { onHit: (n?: number) => void }) {
  const [board, setBoard] = useState(fillBoard);
  const [sel, setSel] = useState<number | null>(null);
  const tap = (i: number) => {
    if (sel == null) { setSel(i); return; }
    const ar = Math.abs(Math.floor(sel / 4) - Math.floor(i / 4));
    const ac = Math.abs((sel % 4) - (i % 4));
    if (ar + ac !== 1) { setSel(i); return; }
    const a = board.slice();
    const tmp = a[sel]; a[sel] = a[i]; a[i] = tmp;
    const mark = new Set<number>();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        const i0 = r * 4 + c;
        if (a[i0] === a[i0 + 1] && a[i0] === a[i0 + 2]) { mark.add(i0); mark.add(i0 + 1); mark.add(i0 + 2); }
      }
    }
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 2; r++) {
        const i0 = r * 4 + c;
        if (a[i0] === a[i0 + 4] && a[i0] === a[i0 + 8]) { mark.add(i0); mark.add(i0 + 4); mark.add(i0 + 8); }
      }
    }
    if (mark.size) {
      onHit(Math.min(3, Math.floor(mark.size / 3)));
      Audio.playCombo();
      for (const k of mark) a[k] = Math.floor(Math.random() * 4);
    }
    setBoard(a);
    setSel(null);
  };
  return (
    <div className="absolute inset-x-6 grid grid-cols-4 gap-1.5" style={{ top: 28 }}>
      {board.map((g, i) => (
        <button key={i} onClick={() => tap(i)} className="h-14" style={{ background: GEMS[g], outline: sel === i ? `3px solid ${CREAM}` : "2px solid #1a0c04" }} />
      ))}
    </div>
  );
}

function Doodle({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const x = useRef(160);
  const y = useRef(380);
  const vy = useRef(-7);
  const plats = useRef(Array.from({ length: 7 }, (_, i) => ({ x: 30 + (i * 47) % 230, y: 70 + i * 68 })));
  const [, setT] = useState(0);
  useLoop(() => {
    vy.current += 0.38;
    y.current += vy.current;
    if (vy.current > 0) {
      for (const p of plats.current) {
        if (Math.abs(x.current - p.x) < 42 && y.current > p.y - 10 && y.current < p.y + 10) {
          vy.current = -9.2; onHit(1);
        }
      }
    }
    if (y.current > 560) { onHurt(); y.current = 300; vy.current = -8; }
    if (y.current < 110) {
      const dy = 110 - y.current; y.current = 110;
      plats.current = plats.current.map((p) => ({ ...p, y: p.y + dy })).map((p) => p.y > 530 ? { x: 24 + Math.random() * 230, y: -16 } : p);
    }
    setT((n) => n + 1);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.current = ((e.clientX - r.left) / r.width) * 300;
      }}>
      {plats.current.map((p, i) => <div key={i} className="absolute h-2.5 w-16" style={{ left: p.x, top: p.y, background: WOOD, borderRadius: 2 }} />)}
      <div className="absolute" style={{ left: x.current, top: y.current }}><Maxine skin={skin} size={36} pose="fall" /></div>
    </div>
  );
}

const ORDERS = [
  ["HARINA", "HUEVO", "HORNO"],
  ["HUEVO", "HARINA", "HORNO"],
  ["HARINA", "HORNO", "HUEVO"],
];

function Cocina({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [oi, setOi] = useState(0);
  const [have, setHave] = useState<string[]>([]);
  const [left, setLeft] = useState(7);
  const need = ORDERS[oi % ORDERS.length];
  useEffect(() => {
    const id = window.setInterval(() => setLeft((n) => {
      if (n <= 1) { onHurt(); setHave([]); return 7; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [onHurt, oi]);
  const tap = (n: string) => {
    const next = [...have, n];
    if (next.length === 3) {
      const ok = need.every((x, i) => next[i] === x);
      if (ok) onHit(2); else onHurt();
      setHave([]); setOi((v) => v + 1); setLeft(7);
    } else setHave(next);
  };
  return (
    <div className="absolute inset-x-4" style={{ top: 28 }}>
      <div className="flex gap-1 mb-2 justify-center">
        {need.map((n, i) => (
          <div key={n + i} className="font-pixel text-[6px] px-2 py-1" style={{ background: have[i] === n ? "#7fc24a" : INK, color: CREAM }}>{n}</div>
        ))}
      </div>
      <div className="h-1.5 mb-4" style={{ background: INK }}><div className="h-full" style={{ width: `${(left / 7) * 100}%`, background: MAG }} /></div>
      <div className="grid grid-cols-3 gap-2">
        {["HUEVO", "HORNO", "HARINA"].map((n) => (
          <button key={n} onClick={() => tap(n)} className="py-8 font-pixel text-[7px] text-white" style={{ background: "rgba(26,12,4,0.7)" }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function Fisica({ onHit, type }: { onHit: (n?: number) => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const pull = useRef({ x: 0, y: 0, on: false });
  const ball = useRef<{ x: number; y: number; vx: number; vy: number; fly: boolean } | null>(null);
  const [, setT] = useState(0);
  useLoop((dt) => {
    const b = ball.current;
    if (b?.fly) {
      b.vy += 520 * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (Math.hypot(b.x - 268, b.y - 90) < 48) { onHit(2); ball.current = null; }
      if (b.y > 560 || b.x > 400 || b.x < -20) ball.current = null;
    }
    setT((n) => n + 1);
  }, [onHit]);
  return (
    <div className="absolute inset-0"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pull.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
      }}
      onPointerMove={(e) => {
        if (!pull.current.on) return;
        const r = e.currentTarget.getBoundingClientRect();
        pull.current.x = e.clientX - r.left; pull.current.y = e.clientY - r.top;
      }}
      onPointerUp={(e) => {
        if (!pull.current.on) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = 70, py = 420;
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        const vx = (px - (cx / r.width) * 360) * 4;
        const vy = (py - (cy / r.height) * 560) * 4;
        ball.current = { x: px, y: py, vx, vy, fly: true };
        pull.current.on = false;
      }}>
      <div className="absolute right-8 top-8"><BossView boss={boss.current} size={100} /></div>
      <div className="absolute left-8 bottom-28"><Maxine size={48} pose="dig" /></div>
      {ball.current && <div className="absolute w-3 h-3 rounded-full" style={{ left: ball.current.x, top: ball.current.y, background: CREAM }} />}
      {pull.current.on && <div className="absolute left-[70px] bottom-[140px] w-1 origin-bottom" style={{ height: 80, background: WOOD, transform: "rotate(-25deg)" }} />}
    </div>
  );
}

function Cavar({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const COLS = 6, ROWS = 7;
  const [grid, setGrid] = useState<number[]>(() => Array.from({ length: COLS * ROWS }, (_, i) => (i === 3 ? 0 : 1)));
  const [pos, setPos] = useState(3);
  const prize =  COLS * ROWS - 2;
  const tap = (i: number) => {
    const pr = Math.floor(pos / COLS), pc = pos % COLS;
    const r = Math.floor(i / COLS), c = i % COLS;
    if (Math.abs(pr - r) + Math.abs(pc - c) !== 1) return;
    if (i === prize) { onHit(3); return; }
    if (grid[i] === 2) { onHurt(); return; }
    const n = grid.slice();
    n[i] = 0;
    if (Math.random() < 0.12) n[i] = 2;
    setGrid(n);
    setPos(i);
    if (n.filter((v) => v === 0).length % 5 === 0) onHit(1);
  };
  return (
    <div className="absolute inset-x-5 grid gap-1" style={{ top: 16, gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {grid.map((v, i) => (
        <button key={i} onClick={() => tap(i)} className="h-11" style={{ background: v === 0 ? INK : v === 2 ? MAG : WOOD }}>
          {i === pos ? <Maxine skin={skin} size={26} pose="dig" /> : i === prize ? <div className="w-3 h-3 mx-auto" style={{ background: CREAM }} /> : null}
        </button>
      ))}
    </div>
  );
}

function Snake({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const dir = useRef({ x: 1, y: 0 });
  const body = useRef([{ x: 3, y: 7 }]);
  const food = useRef({ x: 8, y: 5 });
  const [, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      const h = body.current[0];
      const nx = h.x + dir.current.x, ny = h.y + dir.current.y;
      if (nx < 0 || ny < 0 || nx > 11 || ny > 13 || body.current.some((p) => p.x === nx && p.y === ny)) {
        onHurt(); body.current = [{ x: 3, y: 7 }]; dir.current = { x: 1, y: 0 }; return;
      }
      const next = [{ x: nx, y: ny }, ...body.current];
      if (nx === food.current.x && ny === food.current.y) {
        onHit(1);
        food.current = { x: 1 + Math.floor(Math.random() * 10), y: 1 + Math.floor(Math.random() * 11) };
      } else next.pop();
      body.current = next;
      setT((n) => n + 1);
    }, 160);
    return () => clearInterval(id);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0">
      {body.current.map((p, i) => <div key={i} className="absolute w-5 h-5" style={{ left: 36 + p.x * 22, top: 20 + p.y * 22, background: i === 0 ? CREAM : "#c9a888" }} />)}
      <div className="absolute w-5 h-5" style={{ left: 36 + food.current.x * 22, top: 20 + food.current.y * 22, background: MAG }} />
      <div className="absolute bottom-3 inset-x-8 flex justify-between">
        <Pad onPress={() => { if (dir.current.x !== 1) dir.current = { x: -1, y: 0 }; }}>←</Pad>
        <div className="flex flex-col gap-1">
          <Pad onPress={() => { if (dir.current.y !== 1) dir.current = { x: 0, y: -1 }; }} h={36}>↑</Pad>
          <Pad onPress={() => { if (dir.current.y !== -1) dir.current = { x: 0, y: 1 }; }} h={36}>↓</Pad>
        </div>
        <Pad onPress={() => { if (dir.current.x !== -1) dir.current = { x: 1, y: 0 }; }}>→</Pad>
      </div>
    </div>
  );
}

function Final({ onHit, onHurt, type }: { onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [danger, setDanger] = useState(0);
  const [chain, setChain] = useState(0);
  const mash = useRef(0);
  const [energy, setEnergy] = useState(0);
  const ring = useRef(1);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (phase !== 1) return;
    const id = window.setInterval(() => setDanger(Math.floor(Math.random() * 4)), 700);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    const id = window.setInterval(() => {
      mash.current = Math.max(0, mash.current - 0.35);
      setEnergy(Math.min(1, mash.current / 24));
    }, 80);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 3) return;
    const id = window.setInterval(() => {
      ring.current = ring.current <= 0.08 ? 1 : ring.current - 0.028;
      setTick((n) => n + 1);
    }, 32);
    return () => clearInterval(id);
  }, [phase]);

  const dodge = (i: number) => {
    if (phase !== 1) return;
    if (i !== danger) {
      const n = chain + 1;
      setChain(n);
      onHit(1);
      if (n >= 6) { Audio.playPhase(); setPhase(2); mash.current = 0; setEnergy(0); }
    } else onHurt();
  };

  const mashTap = () => {
    if (phase !== 2) return;
    mash.current += 1.2;
    setEnergy(Math.min(1, mash.current / 24));
    if (mash.current >= 24) { Audio.playPhase(); onHit(3); setPhase(3); ring.current = 1; }
  };

  const ringTap = () => {
    if (phase !== 3) return;
    if (Math.abs(ring.current - 0.36) < 0.09) onHit(4);
    else onHurt();
    ring.current = 1;
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center">
      <div className="mt-2"><BossView boss={boss.current} size={88} /></div>
      {phase === 1 && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <button key={i} onPointerDown={() => dodge(i)} className="w-24 h-24 flex items-center justify-center"
              style={{ background: i === danger ? MAG : WOOD, opacity: i === danger ? 1 : 0.55, border: `3px solid ${INK}` }}>
              {i === 0 ? <PawIcon size={40} color={CREAM} /> : <div className="w-8 h-8" style={{ background: CREAM, borderRadius: i === 3 ? 99 : 2, transform: i === 2 ? "rotate(45deg)" : undefined }} />}
            </button>
          ))}
        </div>
      )}
      {phase === 2 && (
        <button type="button" onPointerDown={mashTap} className="mt-10 flex flex-col items-center gap-4 w-full px-8">
          <div className="w-full h-3" style={{ background: INK }}>
            <div className="h-full" style={{ width: `${energy * 100}%`, background: "linear-gradient(90deg,#c62828,#ff8a18,#ffd54a)" }} />
          </div>
          <div className="w-[64px] h-[64px] flex items-center justify-center" style={{ background: "rgba(199,21,133,0.75)" }}>
            <PawIcon size={40} color={CREAM} />
          </div>
        </button>
      )}
      {phase === 3 && (
        <button type="button" onPointerDown={ringTap} className="relative w-40 h-40 mt-8 flex items-center justify-center">
          <div className="absolute rounded-full" style={{
            width: 30 + ring.current * 96, height: 30 + ring.current * 96,
            border: "4px solid #ffd27a", boxShadow: Math.abs(ring.current - 0.36) < 0.09 ? "0 0 16px #ffd27a" : "none",
          }} />
          <div className="absolute rounded-full" style={{ width: 64, height: 64, border: `2px solid ${CREAM}` }} />
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "#ffd27a" }}>
            <PawIcon size={32} />
          </div>
        </button>
      )}
    </div>
  );
}
