import { useEffect, useRef, useState } from "react";
import type { ArcadeId } from "../data/furniture";

interface Props {
  game: ArcadeId;
  onEarn: (n: number) => void;
  onClose: () => void;
}

const TITLES: Record<ArcadeId, string> = {
  amasar: "Amasar",
  hueso: "Buscá el hueso",
  salto: "Salto justo",
  te: "Servir el té",
};

export default function ArcadePlay({ game, onEarn, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "#0008" }}>
      <div className="w-[92%] mb-6 rounded-2xl border-2 p-3" style={{ background: "#2a1810", borderColor: "#c9a86a" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="font-display font-bold text-amber-50 text-[18px]">{TITLES[game]}</div>
          <button onClick={onClose} className="font-display font-bold text-amber-200 text-[13px]">Cerrar</button>
        </div>
        {game === "amasar" && <Knead onEarn={onEarn} />}
        {game === "hueso" && <Bones onEarn={onEarn} />}
        {game === "salto" && <Timing onEarn={onEarn} />}
        {game === "te" && <Tea onEarn={onEarn} />}
      </div>
    </div>
  );
}

function Knead({ onEarn }: { onEarn: (n: number) => void }) {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[12px] text-amber-100/80 text-center">Tocá la masa. Cada 8 toques, 3 migas.</p>
      <button
        onClick={() => { const v = n + 1; setN(v); if (v % 8 === 0) onEarn(3); }}
        className="mt-3 rounded-[42%] border-4"
        style={{ width: 140, height: 100, background: "radial-gradient(circle at 40% 35%, #ffe4b0, #d99243)", borderColor: "#7a4410" }}
      />
      <div className="mt-2 font-display font-bold text-amber-200 text-[13px]">{n}</div>
    </div>
  );
}

function Bones({ onEarn }: { onEarn: (n: number) => void }) {
  const [found, setFound] = useState<number[]>([]);
  const holes = [18, 42, 70];
  const tap = (i: number) => {
    if (found.includes(i)) return;
    const next = [...found, i];
    setFound(next);
    onEarn(2);
  };
  return (
    <div>
      <p className="font-display text-[12px] text-amber-100/80 text-center mb-2">Husmeá los montículos.</p>
      <div className="relative h-28 rounded-xl" style={{ background: "#6a4420" }}>
        {holes.map((left, i) => (
          <button key={i} onClick={() => tap(i)} className="absolute bottom-3 w-12 h-8 rounded-full"
            style={{ left: `${left}%`, background: found.includes(i) ? "#c9842a" : "#4a2a10" }} />
        ))}
      </div>
    </div>
  );
}

function Timing({ onEarn }: { onEarn: (n: number) => void }) {
  const [x, setX] = useState(0);
  const dir = useRef(1);
  useEffect(() => {
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      setX((v) => {
        let n = v + dir.current * 1.8;
        if (n > 100) { n = 100; dir.current = -1; }
        if (n < 0) { n = 0; dir.current = 1; }
        return n;
      });
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const hit = () => { if (x > 42 && x < 62) onEarn(4); };
  return (
    <div>
      <p className="font-display text-[12px] text-amber-100/80 text-center mb-2">Tocá cuando esté en el verde.</p>
      <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "#3a2010" }}>
        <div className="absolute top-0 bottom-0" style={{ left: "42%", width: "20%", background: "#7fc24a" }} />
        <div className="absolute top-0 bottom-0 w-1 bg-amber-50" style={{ left: `${x}%` }} />
      </div>
      <button onClick={hit} className="btn-3d mt-3 w-full font-display font-bold py-2 rounded-full" style={{ background: "#ffd27a", color: "#3a1808" }}>¡Ya!</button>
    </div>
  );
}

function Tea({ onEarn }: { onEarn: (n: number) => void }) {
  const [fill, setFill] = useState(0);
  const hold = useRef(false);
  useEffect(() => {
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      if (hold.current) setFill((v) => Math.min(100, v + 0.9));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const release = () => {
    hold.current = false;
    if (fill > 70 && fill < 92) onEarn(4);
    setFill(0);
  };
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[12px] text-amber-100/80 text-center">Mantené y soltá entre 70 y 90.</p>
      <div className="mt-2 w-16 h-24 rounded-b-[40%] border-4 overflow-hidden relative" style={{ borderColor: "#5a3216", background: "#fff3d6" }}>
        <div className="absolute inset-x-0 bottom-0" style={{ height: `${fill}%`, background: "#c9842a" }} />
      </div>
      <div className="font-display text-[12px] text-amber-200 mt-1">{Math.round(fill)}</div>
      <button
        className="btn-3d mt-2 font-display font-bold px-6 py-2 rounded-full"
        style={{ background: "#ffd27a", color: "#3a1808" }}
        onPointerDown={() => { hold.current = true; }}
        onPointerUp={release}
        onPointerLeave={() => { hold.current = false; }}
      >Verter</button>
    </div>
  );
}
