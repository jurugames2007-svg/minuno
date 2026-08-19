import { useEffect, useRef, useState } from "react";
import Maxine from "../art/Maxine";
import { spawnBoss, BossView, BOSS_NAME, type BossType } from "../art/Bosses";
import { Heart } from "../art/Decor";
import type { SkinId } from "../data/skins";
import { BOSS_GENRE, type GenreId } from "../data/bossModes";
import { PawIcon } from "../ui/PawButton";

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

export default function GenreFight({ type, level, skin, hearts, onHurt, onWin }: Props) {
  const genre = BOSS_GENRE[type];
  const [intro, setIntro] = useState(true);
  const [hp, setHp] = useState(8 + Math.min(12, level));
  const max = useRef(8 + Math.min(12, level));
  const boss = useRef(spawnBoss(type, level, 40, 320, 80));
  const done = useRef(false);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (shake <= 0 && flash <= 0) return;
    const id = window.requestAnimationFrame(() => {
      setShake((n) => Math.max(0, n - 1));
      setFlash((n) => Math.max(0, n - 1));
    });
    return () => window.cancelAnimationFrame(id);
  }, [shake, flash]);

  const hit = (n = 1) => {
    if (done.current) return;
    setShake(2);
    setFlash(2);
    setHp((h) => {
      const next = h - n;
      if (next <= 0 && !done.current) {
        done.current = true;
        window.setTimeout(onWin, 400);
      }
      return next;
    });
    boss.current.flash = 0.2;
    boss.current.hp = Math.max(0, boss.current.hp - n);
  };

  const hurt = () => {
    setShake(2);
    setFlash(3);
    onHurt();
  };

  const pct = Math.max(0, hp / max.current);
  const bar = pct > 0.55 ? "#ff4444" : pct > 0.28 ? "#ff8a18" : "#ffd54a";
  const sx = shake > 0 ? (Math.random() - 0.5) * 4 : 0;
  const sy = shake > 0 ? (Math.random() - 0.5) * 4 : 0;

  return (
    <div className="absolute inset-0 z-[60] overflow-hidden select-none" style={{ background: BG }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(70% 50% at 50% 28%, ${WOOD}55, transparent 72%)`,
      }} />

      {/* 10% HUD: 5 corazones + nombre 8px + barra 8px */}
      <div className="absolute inset-x-0 top-0 z-40 pointer-events-none" style={{ height: "10%" }}>
        <div className="absolute top-1 left-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => <Heart key={i} filled={i < hearts} size={16} />)}
        </div>
        <div className="absolute left-0 right-0" style={{ top: 20 }}>
          <div
            className="font-pixel text-[8px] text-white text-center leading-none"
            style={{ textShadow: "-1px 0 #000, 1px 0 #000, 0 -1px #000, 0 1px #000" }}
          >
            {BOSS_NAME[type]}
          </div>
          <div className="h-2 mt-1 overflow-hidden" style={{ background: "#1a0c04", borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
            <div className="h-full" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg,#c62828,${bar})` }} />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0"
        style={{
          top: "10%",
          bottom: 0,
          transform: `translate(${sx}px, ${sy}px)`,
        }}
      >
        {intro ? (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center" style={{ background: "#0a0402" }}>
            <div
              className="font-pixel text-[8px] text-white mb-4 tracking-widest"
              style={{ textShadow: "-1px 0 #000, 1px 0 #000, 0 -1px #000, 0 1px #000" }}
            >
              APARECIÓ UN JEFE
            </div>
            <BossView boss={boss.current} size={140} />
            <div
              className="font-pixel text-[8px] text-white mt-4"
              style={{ textShadow: "-1px 0 #000, 1px 0 #000, 0 -1px #000, 0 1px #000" }}
            >
              {BOSS_NAME[type]}
            </div>
          </div>
        ) : (
          <Play genre={genre} skin={skin} onHit={hit} onHurt={hurt} type={type} />
        )}
      </div>

      {flash > 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none" style={{ background: MAG, opacity: 0.22 }} />
      )}
    </div>
  );
}

function Play({ genre, skin, onHit, onHurt, type }: { genre: GenreId; skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  if (genre === "tiles") return <Tiles onHit={onHit} onHurt={onHurt} />;
  if (genre === "shmup") return <Shmup skin={skin} onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "rpg") return <Rpg onHit={onHit} onHurt={onHurt} />;
  if (genre === "dance") return <Dance onHit={onHit} onHurt={onHurt} />;
  if (genre === "juicio") return <Juicio onHit={onHit} onHurt={onHurt} />;
  if (genre === "novela") return <Novela onHit={onHit} onHurt={onHurt} />;
  if (genre === "sigilo") return <Sigilo skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "breakout") return <Breakout onHit={onHit} onHurt={onHurt} />;
  if (genre === "lucha") return <Lucha skin={skin} onHit={onHit} onHurt={onHurt} type={type} />;
  if (genre === "carrera") return <Carrera onHit={onHit} onHurt={onHurt} />;
  if (genre === "micro") return <Micro skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "td") return <Td onHit={onHit} onHurt={onHurt} />;
  if (genre === "runner") return <Runner skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "match3") return <Match3 onHit={onHit} />;
  if (genre === "doodle") return <Doodle skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "cocina") return <Cocina onHit={onHit} onHurt={onHurt} />;
  if (genre === "fisica") return <Fisica onHit={onHit} />;
  if (genre === "cavar") return <Cavar skin={skin} onHit={onHit} onHurt={onHurt} />;
  if (genre === "snake") return <Snake onHit={onHit} onHurt={onHurt} />;
  return <Final onHit={onHit} onHurt={onHurt} />;
}

function PadBtn({ label, onPress, dim }: { label: string; onPress: () => void; dim?: boolean }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className="font-pixel text-[8px] text-white"
      style={{
        width: 60,
        height: 60,
        background: dim ? "rgba(26,12,4,0.4)" : "rgba(26,12,4,0.7)",
        border: "2px solid rgba(10,4,2,0.55)",
        opacity: dim ? 0.4 : 0.7,
      }}
    >
      {label}
    </button>
  );
}

function Tiles({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [rows, setRows] = useState(() => Array.from({ length: 6 }, (_, i) => ({ y: i * 90, lane: i % 4 })));
  useEffect(() => {
    const id = window.setInterval(() => {
      setRows((rs) => {
        const next = rs.map((r) => ({ ...r, y: r.y + 18 }));
        const miss = next.some((r) => r.y > 520);
        if (miss) onHurt();
        const kept = next.filter((r) => r.y <= 520);
        while (kept.length < 6) kept.unshift({ y: -80, lane: Math.floor(Math.random() * 4) });
        return kept;
      });
    }, 140);
    return () => clearInterval(id);
  }, [onHurt]);
  const tap = (lane: number) => {
    setRows((rs) => {
      const i = rs.findIndex((r) => r.lane === lane && r.y > 380 && r.y < 530);
      if (i < 0) { onHurt(); return rs; }
      onHit(1);
      const copy = rs.slice();
      copy.splice(i, 1);
      copy.unshift({ y: -80, lane: Math.floor(Math.random() * 4) });
      return copy;
    });
  };
  return (
    <div className="absolute inset-0">
      {[0, 1, 2, 3].map((l) => (
        <button key={l} onPointerDown={() => tap(l)} className="absolute top-0 bottom-0" style={{ left: `${l * 25}%`, width: "25%", borderLeft: "1px solid #0004" }} />
      ))}
      {rows.map((r, i) => (
        <div key={i} className="absolute" style={{ left: `${r.lane * 25 + 2}%`, width: "21%", top: r.y, height: 70, background: "#1a0c04", border: `2px solid ${MAG}` }} />
      ))}
    </div>
  );
}

function Shmup({ skin, onHit, onHurt, type }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const p = useRef({ x: 160, y: 420 });
  const shots = useRef<{ x: number; y: number }[]>([]);
  const bullets = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const boss = useRef(spawnBoss(type, 1, 80, 280, 40));
  const [, setT] = useState(0);
  useEffect(() => {
    let raf = 0; let last = performance.now(); let acc = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.04, (now - last) / 1000); last = now; acc += dt;
      boss.current.t += dt;
      boss.current.x = 180 + Math.sin(boss.current.t) * 70;
      if (acc > 0.22) {
        acc = 0;
        shots.current.push({ x: p.current.x, y: p.current.y });
        const a = boss.current.t * 3;
        bullets.current.push({ x: boss.current.x, y: 90, vx: Math.cos(a) * 90, vy: 70 + Math.sin(a) * 40 });
      }
      shots.current = shots.current.filter((s) => { s.y -= 280 * dt; if (Math.hypot(s.x - boss.current.x, s.y - 90) < 36) { onHit(1); return false; } return s.y > 20; });
      bullets.current = bullets.current.filter((b) => {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (Math.hypot(b.x - p.current.x, b.y - p.current.y) < 18) { onHurt(); return false; }
        return b.y < 620 && b.x > 0 && b.x < 360;
      });
      setT((n) => n + 1);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        p.current.x = ((e.clientX - r.left) / r.width) * 360;
        p.current.y = 40 + ((e.clientY - r.top) / r.height) * 520;
      }}>
      <div className="absolute" style={{ left: boss.current.x - 48, top: 40 }}><BossView boss={boss.current} size={96} /></div>
      {shots.current.map((s, i) => <div key={i} className="absolute w-1.5 h-3 bg-amber-100" style={{ left: s.x, top: s.y }} />)}
      {bullets.current.map((b, i) => <div key={i} className="absolute w-2 h-2 rounded-full" style={{ left: b.x, top: b.y, background: MAG }} />)}
      <div className="absolute" style={{ left: p.current.x - 16, top: p.current.y - 16 }}><Maxine skin={skin} size={36} /></div>
    </div>
  );
}

function Rpg({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [lock, setLock] = useState(false);
  const act = (ok: boolean) => {
    if (lock) return;
    setLock(true);
    if (ok) onHit(2); else onHurt();
    window.setTimeout(() => setLock(false), 700);
  };
  return (
    <div className="absolute inset-x-3" style={{ bottom: 18, top: 40 }}>
      <div className="h-[46%] flex items-center justify-center">
        <div className="w-20 h-20" style={{ background: WOOD, border: "3px solid #1a0c04" }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {([["MORDER", true], ["LADRAR", true], ["MIRADA", true], ["ESCONDER", false]] as const).map(([n, ok]) => (
          <button key={n} disabled={lock} onClick={() => act(ok)} className="font-pixel text-[7px] py-3" style={{ background: "rgba(26,12,4,0.7)", color: "#fff", opacity: 0.7 }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function Dance({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const keys = ["←", "↑", "→", "↓"];
  const [seq, setSeq] = useState(() => [0, 2, 1]);
  const [i, setI] = useState(0);
  const press = (k: number) => {
    if (k === seq[i]) {
      if (i + 1 >= seq.length) { onHit(2); setSeq(Array.from({ length: 3 + Math.floor(Math.random() * 2) }, () => Math.floor(Math.random() * 4))); setI(0); }
      else setI(i + 1);
    } else { onHurt(); setI(0); }
  };
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
      <div className="flex gap-2 mb-8">{seq.map((k, n) => <div key={n} className="w-10 h-10 flex items-center justify-center font-pixel text-[10px]" style={{ background: n === i ? "#ffd27a" : "rgba(26,12,4,0.7)", color: n === i ? "#1a0c04" : "#fff" }}>{keys[k]}</div>)}</div>
      <div className="grid grid-cols-3 gap-1">
        <div /><PadBtn label="↑" onPress={() => press(1)} /><div />
        <PadBtn label="←" onPress={() => press(0)} />
        <PadBtn label="↓" onPress={() => press(3)} />
        <PadBtn label="→" onPress={() => press(2)} />
      </div>
    </div>
  );
}

function Juicio({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const good = "PELO";
  return (
    <div className="absolute inset-x-4 flex flex-col justify-end gap-2" style={{ top: 40, bottom: 16 }}>
      {(["PELO", "CUCHARA", "NADA"] as const).map((p) => (
        <button key={p} onClick={() => { if (p === good) onHit(3); else onHurt(); }} className="font-pixel text-[8px] py-3" style={{ background: "rgba(255,243,214,0.7)", color: "#3a1808", opacity: 0.7 }}>{p}</button>
      ))}
    </div>
  );
}

function Novela({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [t, setT] = useState(10);
  useEffect(() => {
    const id = window.setInterval(() => setT((n) => { if (n <= 1) { onHurt(); return 10; } return n - 1; }), 1000);
    return () => clearInterval(id);
  }, [onHurt]);
  return (
    <div className="absolute inset-x-4 flex flex-col justify-end gap-2" style={{ top: 40, bottom: 16 }}>
      <div className="font-pixel text-[8px] text-white text-center" style={{ textShadow: "1px 1px 0 #000" }}>{t}</div>
      {([["ATRACAR", true], ["MUERTO", true], ["LADRAR", false]] as const).map(([n, ok]) => (
        <button key={n} onClick={() => { if (ok) onHit(2); else onHurt(); setT(10); }} className="font-pixel text-[8px] py-3" style={{ background: "rgba(26,12,4,0.7)", color: "#fff", opacity: 0.7 }}>{n}</button>
      ))}
    </div>
  );
}

function Sigilo({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const [x, setX] = useState(40);
  const eye = useRef(180);
  useEffect(() => {
    const id = window.setInterval(() => {
      eye.current = 80 + Math.abs(Math.sin(Date.now() / 800)) * 200;
      if (Math.abs(x - eye.current) < 28) onHurt();
    }, 200);
    return () => clearInterval(id);
  }, [x, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setX(((e.clientX - r.left) / r.width) * 320);
      }}
      onPointerDown={() => { if (Math.abs(x - 280) < 40) onHit(2); }}>
      <div className="absolute top-20 w-10 h-10 rounded-full" style={{ left: eye.current, background: MAG, boxShadow: `0 0 24px ${MAG}88` }} />
      <div className="absolute bottom-24" style={{ left: x }}><Maxine skin={skin} size={40} /></div>
      <div className="absolute right-6 bottom-28 w-8 h-16" style={{ background: "#1a0c04" }} />
    </div>
  );
}

function Breakout({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const pad = useRef(140);
  const ball = useRef({ x: 180, y: 300, vx: 90, vy: -140 });
  const [, setT] = useState(0);
  useEffect(() => {
    let raf = 0; let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.04, (now - last) / 1000); last = now;
      const b = ball.current;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < 8 || b.x > 350) b.vx *= -1;
      if (b.y < 50) { b.vy *= -1; onHit(1); }
      if (b.y > 500 && b.x > pad.current && b.x < pad.current + 70) b.vy = -Math.abs(b.vy);
      if (b.y > 600) { onHurt(); b.y = 300; b.vy = -140; }
      setT((n) => n + 1);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pad.current = Math.max(0, Math.min(290, ((e.clientX - r.left) / r.width) * 360 - 35));
      }}>
      <div className="absolute w-2 h-2 bg-amber-100" style={{ left: ball.current.x, top: ball.current.y }} />
      <div className="absolute h-3" style={{ left: pad.current, top: 500, width: 70, background: "#fff3d6", opacity: 0.7 }} />
    </div>
  );
}

function Lucha({ skin, onHit, onHurt, type }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void; type: BossType }) {
  const boss = useRef(spawnBoss(type, 1, 100, 280, 180));
  const atk = (kind: "hi" | "lo" | "block") => {
    if (kind === "block") return;
    if (Math.random() < 0.35) onHurt();
    else onHit(1);
    boss.current.flash = 0.15;
  };
  return (
    <div className="absolute inset-0">
      <div className="absolute right-6 top-16"><BossView boss={boss.current} size={120} /></div>
      <div className="absolute left-4 bottom-28"><Maxine skin={skin} size={80} pose="dig" /></div>
      <div className="absolute bottom-4 right-3 flex gap-2">
        <PadBtn label="ALTO" onPress={() => atk("hi")} />
        <PadBtn label="BAJO" onPress={() => atk("lo")} />
        <PadBtn label="BLOQ" onPress={() => atk("block")} dim />
      </div>
    </div>
  );
}

function Carrera({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [lane, setLane] = useState(1);
  const obs = useRef<{ y: number; lane: number }[]>([{ y: -40, lane: 0 }]);
  const [, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      obs.current = obs.current.map((o) => ({ ...o, y: o.y + 16 })).filter((o) => o.y < 640);
      if (Math.random() < 0.35) obs.current.push({ y: -30, lane: Math.floor(Math.random() * 3) });
      if (obs.current.some((o) => o.lane === lane && o.y > 430 && o.y < 500)) onHurt();
      else if (Math.random() < 0.2) onHit(1);
      setT((n) => n + 1);
    }, 120);
    return () => clearInterval(id);
  }, [lane, onHit, onHurt]);
  return (
    <div className="absolute inset-0">
      {obs.current.map((o, i) => <div key={i} className="absolute w-12 h-8" style={{ left: 60 + o.lane * 80, top: o.y, background: WOOD }} />)}
      <div className="absolute bottom-20 w-10 h-10" style={{ left: 66 + lane * 80, background: "#e3c79a" }} />
      <div className="absolute bottom-3 inset-x-8 flex justify-between">
        <PadBtn label="←" onPress={() => setLane((n) => Math.max(0, n - 1))} />
        <PadBtn label="→" onPress={() => setLane((n) => Math.min(2, n + 1))} />
      </div>
    </div>
  );
}

function Micro({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const [y, setY] = useState(400);
  const jump = () => {
    setY((v) => {
      const n = v - 70;
      if (n < 80) { onHit(2); return 400; }
      return n;
    });
  };
  useEffect(() => {
    const id = window.setInterval(() => setY((v) => { const n = v + 8; if (n > 520) { onHurt(); return 400; } return n; }), 160);
    return () => clearInterval(id);
  }, [onHurt]);
  return (
    <div className="absolute inset-0" onPointerDown={jump}>
      {[120, 200, 280, 360].map((yy) => <div key={yy} className="absolute h-2 left-16 right-16" style={{ top: yy, background: WOOD }} />)}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: y }}><Maxine skin={skin} size={36} pose="fall" /></div>
    </div>
  );
}

function Td({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [traps, setTraps] = useState<number[]>([]);
  const [wave, setWave] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setWave((w) => {
        const nw = w + 18;
        if (nw > 280) {
          if (traps.length > 0) onHit(1); else onHurt();
          return 0;
        }
        return nw;
      });
    }, 200);
    return () => clearInterval(id);
  }, [traps, onHit, onHurt]);
  return (
    <div className="absolute inset-0" onPointerDown={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      setTraps((t) => [...t.slice(-4), ((e.clientX - r.left) / r.width) * 320]);
    }}>
      <div className="absolute top-24 h-8 w-8" style={{ left: wave, background: MAG }} />
      {traps.map((x, i) => <div key={i} className="absolute top-24 w-6 h-8" style={{ left: x, background: "#7fc24a", opacity: 0.7 }} />)}
    </div>
  );
}

function Runner({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const [duck, setDuck] = useState(false);
  const obs = useRef<{ x: number; kind: "up" | "lo" }>({ x: 360, kind: "lo" });
  const [, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      obs.current.x -= 14;
      if (obs.current.x < -20) { obs.current = { x: 360, kind: Math.random() < 0.5 ? "up" : "lo" }; onHit(1); }
      if (obs.current.x < 80 && obs.current.x > 40) {
        if (obs.current.kind === "lo" && !duck) onHurt();
        if (obs.current.kind === "up" && duck) onHurt();
      }
      setT((n) => n + 1);
    }, 80);
    return () => clearInterval(id);
  }, [duck, onHit, onHurt]);
  return (
    <div className="absolute inset-0">
      <div className="absolute left-10 bottom-28"><Maxine skin={skin} size={56} pose={duck ? "dig" : "idle"} /></div>
      <div className="absolute w-10 h-10" style={{ left: obs.current.x, bottom: obs.current.kind === "up" ? 140 : 96, background: WOOD }} />
      <div className="absolute bottom-3 inset-x-6 flex justify-between">
        <PadBtn label="↑" onPress={() => setDuck(false)} />
        <PadBtn label="↓" onPress={() => setDuck(true)} />
      </div>
    </div>
  );
}

const GEMS = ["#E91E63", "#ffd27a", "#7fd0ff", "#7fc24a"];

function Match3({ onHit }: { onHit: (n?: number) => void }) {
  const [board, setBoard] = useState(() => Array.from({ length: 16 }, () => Math.floor(Math.random() * 4)));
  const [sel, setSel] = useState<number | null>(null);
  const tap = (i: number) => {
    if (sel == null) { setSel(i); return; }
    const a = board.slice();
    const t = a[sel]; a[sel] = a[i]; a[i] = t;
    let hits = 0;
    for (let r = 0; r < 4; r++) if (a[r * 4] === a[r * 4 + 1] && a[r * 4] === a[r * 4 + 2]) hits++;
    if (hits) onHit(hits);
    setBoard(a.map((v, idx) => (hits && idx < 4 ? Math.floor(Math.random() * 4) : v)));
    setSel(null);
  };
  return (
    <div className="absolute inset-x-6 grid grid-cols-4 gap-1" style={{ top: 24 }}>
      {board.map((g, i) => (
        <button key={i} onClick={() => tap(i)} className="h-14" style={{ background: sel === i ? "#ffd27a" : GEMS[g], opacity: 0.85, border: "2px solid #1a0c04" }} />
      ))}
    </div>
  );
}

function Doodle({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const [x, setX] = useState(160);
  const y = useRef(400);
  const vy = useRef(-8);
  const plats = useRef(Array.from({ length: 7 }, (_, i) => ({ x: 40 + (i * 37) % 220, y: 80 + i * 70 })));
  const [, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      vy.current += 0.45;
      y.current += vy.current;
      if (vy.current > 0) {
        for (const p of plats.current) {
          if (Math.abs(x - p.x) < 40 && y.current > p.y - 8 && y.current < p.y + 12) { vy.current = -9; onHit(1); }
        }
      }
      if (y.current > 560) { onHurt(); y.current = 300; vy.current = -8; }
      if (y.current < 120) {
        const dy = 120 - y.current; y.current = 120;
        plats.current = plats.current.map((p) => ({ ...p, y: p.y + dy })).map((p) => p.y > 540 ? { x: 30 + Math.random() * 220, y: -20 } : p);
      }
      setT((n) => n + 1);
    }, 32);
    return () => clearInterval(id);
  }, [x, onHit, onHurt]);
  return (
    <div className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setX(((e.clientX - r.left) / r.width) * 300);
      }}>
      {plats.current.map((p, i) => <div key={i} className="absolute h-2 w-14" style={{ left: p.x, top: p.y, background: WOOD }} />)}
      <div className="absolute" style={{ left: x, top: y.current }}><Maxine skin={skin} size={36} pose="fall" /></div>
    </div>
  );
}

function Cocina({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const need = ["HARINA", "HUEVO", "HORNO"];
  const [have, setHave] = useState<string[]>([]);
  const tap = (n: string) => {
    const next = [...have, n];
    if (next.length === 3) {
      const ok = need.every((x, i) => next[i] === x);
      if (ok) onHit(3); else onHurt();
      setHave([]);
    } else setHave(next);
  };
  return (
    <div className="absolute inset-x-4" style={{ top: 48 }}>
      <div className="h-2 mb-4 overflow-hidden" style={{ background: "#1a0c04" }}>
        <div className="h-full" style={{ width: `${(have.length / 3) * 100}%`, background: "#ffd27a" }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["HUEVO", "HORNO", "HARINA"].map((n) => (
          <button key={n} onClick={() => tap(n)} className="py-6 font-pixel text-[7px] text-white" style={{ background: "rgba(26,12,4,0.7)", opacity: 0.7 }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function Fisica({ onHit }: { onHit: (n?: number) => void }) {
  const [pull, setPull] = useState(0);
  return (
    <div className="absolute inset-0"
      onPointerDown={() => setPull(0)}
      onPointerMove={(e) => { if (e.buttons) setPull(Math.min(80, pull + 2)); }}
      onPointerUp={() => { if (pull > 20) onHit(2); setPull(0); }}>
      <div className="absolute left-8 bottom-32 w-4 h-24 origin-bottom" style={{ background: WOOD, transform: `rotate(${-pull}deg)` }} />
      <div className="absolute right-10 top-16 w-24 h-28" style={{ background: WOOD }} />
    </div>
  );
}

function Cavar({ skin, onHit, onHurt }: { skin: SkinId; onHit: (n?: number) => void; onHurt: () => void }) {
  const [dug, setDug] = useState<Set<number>>(() => new Set());
  const tap = (i: number) => {
    const n = new Set(dug); n.add(i); setDug(n);
    if (n.size % 4 === 0) onHit(1);
    if (Math.random() < 0.12) onHurt();
  };
  return (
    <div className="absolute inset-x-6 grid grid-cols-5 gap-1" style={{ top: 24 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <button key={i} onClick={() => tap(i)} className="h-12" style={{ background: dug.has(i) ? "#1a0c04" : WOOD }}>
          {i === 12 && !dug.has(i) ? <Maxine skin={skin} size={28} pose="dig" /> : null}
        </button>
      ))}
    </div>
  );
}

function Snake({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const body = useRef([{ x: 4, y: 8 }]);
  const food = useRef({ x: 8, y: 6 });
  const [, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      const h = body.current[0];
      const nx = h.x + dir.x; const ny = h.y + dir.y;
      if (nx < 0 || ny < 0 || nx > 11 || ny > 14 || body.current.some((p) => p.x === nx && p.y === ny)) { onHurt(); body.current = [{ x: 4, y: 8 }]; return; }
      const next = [{ x: nx, y: ny }, ...body.current];
      if (nx === food.current.x && ny === food.current.y) {
        onHit(1);
        food.current = { x: 1 + Math.floor(Math.random() * 10), y: 1 + Math.floor(Math.random() * 12) };
      } else next.pop();
      body.current = next;
      setT((n) => n + 1);
    }, 180);
    return () => clearInterval(id);
  }, [dir, onHit, onHurt]);
  return (
    <div className="absolute inset-0">
      {body.current.map((p, i) => <div key={i} className="absolute w-5 h-5" style={{ left: 40 + p.x * 22, top: 40 + p.y * 22, background: i === 0 ? "#e3c79a" : "#c9a888" }} />)}
      <div className="absolute w-5 h-5" style={{ left: 40 + food.current.x * 22, top: 40 + food.current.y * 22, background: MAG }} />
      <div className="absolute bottom-3 inset-x-8 flex justify-between">
        <PadBtn label="←" onPress={() => setDir({ x: -1, y: 0 })} />
        <div className="flex flex-col gap-1">
          <PadBtn label="↑" onPress={() => setDir({ x: 0, y: -1 })} />
          <PadBtn label="↓" onPress={() => setDir({ x: 0, y: 1 })} />
        </div>
        <PadBtn label="→" onPress={() => setDir({ x: 1, y: 0 })} />
      </div>
    </div>
  );
}

const ICONS = ["PAW", "BONE", "STAR", "EYE"] as const;

function Final({ onHit, onHurt }: { onHit: (n?: number) => void; onHurt: () => void }) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [chain, setChain] = useState(0);
  const [slot, setSlot] = useState(0);
  const [lit, setLit] = useState(true);
  const mash = useRef(0);
  const [energy, setEnergy] = useState(0);
  const ring = useRef(1);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (phase !== 1) return;
    const id = window.setInterval(() => {
      setLit((v) => !v);
      setSlot((s) => (s + 1) % 4);
    }, 480);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 3) return;
    const id = window.setInterval(() => {
      ring.current = ring.current <= 0 ? 1 : ring.current - 0.035;
      setTick((n) => n + 1);
    }, 40);
    return () => clearInterval(id);
  }, [phase]);

  const tapSlot = (i: number) => {
    if (phase !== 1) return;
    if (lit && i === slot) {
      const n = chain + 1;
      setChain(n);
      onHit(1);
      if (n >= 6) { setPhase(2); mash.current = 0; setEnergy(0); }
    } else onHurt();
  };

  const mashTap = () => {
    if (phase !== 2) return;
    mash.current += 1;
    setEnergy(Math.min(1, mash.current / 22));
    if (mash.current >= 22) { onHit(4); setPhase(3); ring.current = 1; }
  };

  const ringTap = () => {
    if (phase !== 3) return;
    if (Math.abs(ring.current - 0.38) < 0.1) onHit(8);
    else onHurt();
    ring.current = 1;
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {phase === 1 && (
        <div className="grid grid-cols-2 gap-4">
          {ICONS.map((name, i) => (
            <button
              key={name}
              onPointerDown={() => tapSlot(i)}
              className="w-24 h-24 flex items-center justify-center"
              style={{
                background: lit && i === slot ? MAG : WOOD,
                opacity: lit && i === slot ? 1 : 0.45,
                border: "3px solid #1a0c04",
              }}
            >
              {name === "PAW" ? <PawIcon size={44} color="#fff3d6" /> : (
                <div className="w-8 h-8" style={{
                  background: name === "BONE" ? "#fff3d6" : name === "STAR" ? "#ffd27a" : "#7fd0ff",
                  transform: name === "STAR" ? "rotate(45deg)" : undefined,
                  borderRadius: name === "EYE" ? 99 : 2,
                }} />
              )}
            </button>
          ))}
        </div>
      )}
      {phase === 2 && (
        <button type="button" onPointerDown={mashTap} className="flex flex-col items-center gap-4 w-full px-8">
          <div className="w-full h-3" style={{ background: "#1a0c04" }}>
            <div className="h-full" style={{ width: `${energy * 100}%`, background: "linear-gradient(90deg,#c62828,#ff8a18,#ffd54a)" }} />
          </div>
          <div className="w-[60px] h-[60px] flex items-center justify-center" style={{ background: "rgba(199,21,133,0.7)" }}>
            <PawIcon size={40} color="#fff3d6" />
          </div>
        </button>
      )}
      {phase === 3 && (
        <button type="button" onPointerDown={ringTap} className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute rounded-full" style={{
            width: 28 + ring.current * 90,
            height: 28 + ring.current * 90,
            border: "4px solid #ffd27a",
            boxShadow: "0 0 10px #ffd27a",
          }} />
          <div className="absolute rounded-full" style={{ width: 62, height: 62, border: "2px solid #fff3d6" }} />
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#ffd27a" }}>
            <PawIcon size={32} />
          </div>
        </button>
      )}
    </div>
  );
}
