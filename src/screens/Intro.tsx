import { useEffect, useState, type ReactElement } from "react";
import { Flour } from "../art/Decor";
import type { SkinId } from "../data/skins";

/* ------------------------------------------------------------------ */
/*  JAVIERA (humana) — articulada: respira, parpadea, se balancea,     */
/*  saluda con overshoot; pose `scared` para el momento del secuestro. */
/* ------------------------------------------------------------------ */
export function JavieraHuman({ size = 120, waving = false, scared = false }: { size?: number; waving?: boolean; scared?: boolean }) {
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 60 100" style={{ overflow: "visible" }}>
      {/* whole-body idle sway */}
      <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: scared ? undefined : "jv-sway 3.6s ease-in-out infinite" }}>
        {/* legs */}
        <rect x="22" y="74" width="7" height="22" rx="2" fill="#d41a1a" stroke="#7a0808" strokeWidth="0.8" />
        <rect x="31" y="74" width="7" height="22" rx="2" fill="#d41a1a" stroke="#7a0808" strokeWidth="0.8" />
        <rect x="21" y="94" width="9" height="4" rx="1" fill="#3a2010" />
        <rect x="30" y="94" width="9" height="4" rx="1" fill="#3a2010" />
        {/* torso breathes */}
        <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "jv-breathe 2.8s ease-in-out infinite" }}>
          <path d="M14 36 Q30 30 46 36 L48 76 Q30 80 12 76 Z" fill="#d41a1a" stroke="#7a0808" strokeWidth="1.2" />
          <path d="M20 36 L30 50 L40 36 L36 36 L30 46 L24 36 Z" fill="#b01010" />
          <path d="M20 36 L30 50 L40 36" fill="none" stroke="#7a0808" strokeWidth="0.8" />
          <rect x="34" y="44" width="7" height="6" rx="0.6" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          <path d="M37.5 45 v4 M35.5 47 h4" stroke="#fff" strokeWidth="0.8" />
          <rect x="16" y="62" width="10" height="7" rx="0.6" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          <rect x="34" y="62" width="10" height="7" rx="0.6" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          <path d="M22 36 q-4 12 8 14 q12 -2 8 -14" fill="none" stroke="#2a2a2a" strokeWidth="1.2" />
          <circle cx="30" cy="52" r="2.4" fill="#d7d2c4" stroke="#2a2a2a" strokeWidth="0.6" />
          {/* left arm */}
          {scared
            ? <path d="M14 38 Q4 30 8 18" stroke="#d41a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
            : <path d="M14 38 Q6 50 10 62" stroke="#d41a1a" strokeWidth="6" fill="none" strokeLinecap="round" />}
          <circle cx={scared ? 8 : 10} cy={scared ? 18 : 62} r="3.4" fill="#f0c090" stroke="#7a4410" strokeWidth="0.6" />
          {/* right arm: waves with overshoot, or raised if scared */}
          <g style={{ transformBox: "fill-box", transformOrigin: "46px 38px", animation: scared ? undefined : waving ? "jv-wave 1.9s cubic-bezier(.34,1.56,.64,1) infinite" : undefined }}>
            {scared
              ? <path d="M46 38 Q56 30 52 18" stroke="#d41a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
              : <path d="M46 38 Q54 44 52 30" stroke="#d41a1a" strokeWidth="6" fill="none" strokeLinecap="round" />}
            <circle cx={scared ? 52 : 52} cy={scared ? 18 : 28} r="3.4" fill="#f0c090" stroke="#7a4410" strokeWidth="0.6" />
          </g>
        </g>
        {/* head: subtle nod */}
        <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "jv-nod 4.2s ease-in-out infinite" }}>
          <rect x="27" y="26" width="6" height="6" fill="#f0c090" />
          <circle cx="30" cy="18" r="11" fill="#f0c090" stroke="#7a4410" strokeWidth="0.8" />
          <path d="M19 18 Q18 6 30 5 Q42 6 41 18 Q42 22 40 26 Q38 14 30 12 Q22 14 20 26 Q18 22 19 18 Z" fill="#6a3a18" />
          {/* hair sway */}
          <g style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: "jv-hair 3s ease-in-out infinite" }}>
            <path d="M19 18 Q16 30 18 38 M41 18 Q44 30 42 38" stroke="#6a3a18" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
          {/* brows */}
          {scared
            ? <path d="M23 13 q3 -2 5 1 M32 14 q2 -3 5 -1" stroke="#3a1a08" strokeWidth="0.9" fill="none" />
            : <path d="M24 15 q2 -1.4 4 0 M32 15 q2 -1.4 4 0" stroke="#3a1a08" strokeWidth="0.7" fill="none" />}
          {/* eyes blink */}
          <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "jv-blink 3.4s ease-in-out infinite" }}>
            {scared
              ? <><path d="M24 17 l4 3 l-4 3 M36 17 l-4 3 l4 3" stroke="#1a0a04" strokeWidth="1.1" fill="none" /></>
              : <><circle cx="26" cy="18" r="1.2" fill="#1a0a04" /><circle cx="34" cy="18" r="1.2" fill="#1a0a04" /></>}
          </g>
          <circle cx="24" cy="21" r="1.4" fill="#ff8fa0" opacity="0.6" /><circle cx="36" cy="21" r="1.4" fill="#ff8fa0" opacity="0.6" />
          {scared
            ? <ellipse cx="30" cy="24" rx="2.2" ry="2.8" fill="#5a1410" />
            : <><path d="M26 23 q4 3 8 0" stroke="#7a1430" strokeWidth="1" fill="none" strokeLinecap="round" /><path d="M27 24 q3 1.6 6 0 q-1.5 1.4 -3 1.4 q-1.5 0 -3 -1.4 Z" fill="#d44a6a" /></>}
          <circle cx="19.5" cy="20" r="0.8" fill="#fff" /><circle cx="40.5" cy="20" r="0.8" fill="#fff" />
          {scared && <path d="M22 22 q-1 4 0 6" stroke="#6ec8ff" strokeWidth="1.2" fill="none" style={{ animation: "jv-tear 1.6s ease-in infinite" }} />}
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  MAXINE (intro) — articulada, con variantes calm / shock / bark.    */
/* ------------------------------------------------------------------ */
function MaxineIntro({ pose = "calm", size = 78 }: { pose?: "calm" | "shock" | "bark"; size?: number }) {
  const shock = pose === "shock"; const bark = pose === "bark";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "mx-breathe 2.4s ease-in-out infinite" }}>
        {/* tail follow-through */}
        <g style={{ transformBox: "fill-box", transformOrigin: "72px 64px", animation: "mx-tail 0.6s ease-in-out infinite" }}>
          <path d="M68 62 Q86 56 92 40 Q90 50 84 52 Q90 44 86 34 Q82 44 74 52 Q78 46 72 44 Q72 54 66 58 Z" fill="#b8956a" stroke="#6a4420" strokeWidth="0.8" />
        </g>
        <ellipse cx="50" cy="72" rx="20" ry="13" fill="#e3c79a" stroke="#6a4420" strokeWidth="1.2" />
        <ellipse cx="50" cy="76" rx="11" ry="8" fill="#fff1d0" />
        {/* legs */}
        <rect x="37" y="78" width="7" height="10" rx="3.5" fill="#b8956a" /><rect x="56" y="78" width="7" height="10" rx="3.5" fill="#b8956a" />
        {/* ears flap */}
        <g style={{ transformBox: "fill-box", transformOrigin: "30px 36px", animation: "mx-ear 0.7s ease-in-out infinite" }}><path d="M26 34 Q14 44 16 64 Q22 66 28 58 Q32 48 34 38 Z" fill="#b8956a" stroke="#6a4420" strokeWidth="0.8" /></g>
        <g style={{ transformBox: "fill-box", transformOrigin: "70px 36px", animation: "mx-ear 0.7s ease-in-out infinite .1s" }}><path d="M74 34 Q86 44 84 64 Q78 66 72 58 Q68 48 66 38 Z" fill="#b8956a" stroke="#6a4420" strokeWidth="0.8" /></g>
        {/* head */}
        <path d="M28 38 Q28 22 50 20 Q72 22 72 38 Q74 50 66 56 Q50 60 34 56 Q26 50 28 38 Z" fill="#e3c79a" stroke="#6a4420" strokeWidth="1.2" />
        <g stroke="#8a6a44" strokeWidth="1.2" fill="none" strokeLinecap="round"><path d="M42 22 q-2 7 -5 10 M48 20 q0 7 -2 12 M54 20 q2 7 4 10" /></g>
        <path d="M38 42 Q50 38 62 42 Q64 50 58 55 Q50 59 42 55 Q36 50 38 42 Z" fill="#fff1d0" />
        {/* brows */}
        {shock || bark
          ? <g stroke="#8a6a44" strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M34 30 q4 -4 8 -1 M58 29 q4 -3 8 1" /></g>
          : <g stroke="#8a6a44" strokeWidth="1.1" fill="none" strokeLinecap="round"><path d="M34 32 q4 -2 8 0 M58 32 q4 -2 8 0" /></g>}
        {/* eyes blink / wide */}
        <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "mx-blink 3.2s ease-in-out infinite" }}>
          <ellipse cx="40" cy="42" rx={shock ? 4.6 : 4} ry={shock ? 5.4 : 4.6} fill="#fff" />
          <ellipse cx="60" cy="42" rx={shock ? 4.6 : 4} ry={shock ? 5.4 : 4.6} fill="#fff" />
          <circle cx="40.5" cy="43" r={shock ? 1.6 : 2.4} fill="#2a1408" />
          <circle cx="60.5" cy="43" r={shock ? 1.6 : 2.4} fill="#2a1408" />
          <circle cx="41.6" cy="41.6" r="0.9" fill="#fff" /><circle cx="61.6" cy="41.6" r="0.9" fill="#fff" />
        </g>
        <path d="M45 47 Q50 44 55 47 Q56 51 50 53 Q44 51 45 47 Z" fill="#1a0e08" />
        {/* mouth per pose */}
        {bark
          ? <path d="M42 53 Q50 64 58 53 Q54 60 50 60 Q46 60 42 53 Z" fill="#5a1410" />
          : shock
            ? <ellipse cx="50" cy="56" rx="3" ry="3.4" fill="#5a1410" />
            : <path d="M46 55 Q50 58 54 55" stroke="#3a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
        {/* bandana */}
        <path d="M36 56 Q50 62 64 56 L60 68 L50 72 L40 68 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  BIGOTES — articulado en 4 niveles: pos → sink → bounce → tilt,     */
/*  con patas en trote diagonal, cola/orejas con follow-through,       */
/*  saco pendular y Javiera asomando (parpadea + llora).               */
/* ------------------------------------------------------------------ */
function BigotesIntro({ size = 104 }: { size?: number }) {
  return (
    <div className="bj-pos">
      <div className="bj-sink">
        <div className="bj-bounce">
          {/* shadow that breathes with the bounce */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -4, width: size * 0.7, height: 8 }}>
            <div className="bj-shadow" style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(ellipse,#0008 0%,#0000 70%)" }} />
          </div>
          <div className="bj-tilt" style={{ width: size, height: size, position: "relative" }}>
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
              {/* legs: diagonal trot */}
              <g style={{ transformBox: "fill-box", transformOrigin: "34px 74px", animation: "bj-legA 0.34s ease-in-out infinite" }}><path d="M34 74 q-5 9 -9 13" stroke="#fff" strokeWidth="5.5" fill="none" strokeLinecap="round" /><circle cx="24" cy="88" r="3" fill="#7a4410" /></g>
              <g style={{ transformBox: "fill-box", transformOrigin: "52px 74px", animation: "bj-legB 0.34s ease-in-out infinite" }}><path d="M52 74 q5 9 9 11" stroke="#fff" strokeWidth="5.5" fill="none" strokeLinecap="round" /><circle cx="61" cy="86" r="3" fill="#7a4410" /></g>
              <g style={{ transformBox: "fill-box", transformOrigin: "42px 74px", animation: "bj-legB 0.34s ease-in-out infinite" }}><path d="M42 74 q-3 9 -6 13" stroke="#e8d4b0" strokeWidth="5" fill="none" strokeLinecap="round" /><circle cx="36" cy="88" r="2.6" fill="#5a3410" /></g>
              <g style={{ transformBox: "fill-box", transformOrigin: "58px 74px", animation: "bj-legA 0.34s ease-in-out infinite" }}><path d="M58 74 q3 9 6 12" stroke="#e8d4b0" strokeWidth="5" fill="none" strokeLinecap="round" /><circle cx="64" cy="87" r="2.6" fill="#5a3410" /></g>
              {/* tail follow-through */}
              <g style={{ transformBox: "fill-box", transformOrigin: "62px 62px", animation: "bj-tail 0.5s cubic-bezier(.34,1.4,.64,1) infinite" }}><path d="M62 62 Q76 52 72 38" stroke="#7a4410" strokeWidth="4" fill="none" strokeLinecap="round" /></g>
              {/* body */}
              <ellipse cx="46" cy="66" rx="20" ry="13" fill="#fff" stroke="#3a2010" strokeWidth="1.3" />
              <path d="M30 58 Q36 54 42 60 Q38 68 30 68 Z" fill="#7a4410" />
              {/* sack on back with Javiera */}
              <g style={{ transformBox: "fill-box", transformOrigin: "62px 36px", animation: "bj-sack 0.5s ease-in-out infinite" }}>
                <path d="M52 24 Q46 12 58 8 Q72 6 78 18 Q82 32 72 42 Q58 46 50 36 Z" fill="#d9c39a" stroke="#5a3a1a" strokeWidth="1.4" />
                <path d="M56 12 q8 -4 16 0" fill="none" stroke="#5a3a1a" strokeWidth="1.4" />
                <path d="M54 30 l4 4 M70 28 l4 4" stroke="#5a3a1a" strokeWidth="0.8" />
                {/* JAVIERA asoma — claramente humana: piel, pelo castaño con coleta, scrub rojo, llora */}
                <g className="bj-girl">
                  <path d="M58 6 q-2 -4 2 -6 q4 0 4 4" fill="#d41a1a" /> {/* scrub collar */}
                  <circle cx="63" cy="6" r="6.4" fill="#f0c090" stroke="#7a4410" strokeWidth="0.6" />
                  <path d="M57 4 Q63 -4 69 4 Q70 8 68 10 Q66 2 63 2 Q60 2 58 10 Q56 8 57 4 Z" fill="#6a3a18" />
                  <path d="M69 4 q4 2 3 8" stroke="#6a3a18" strokeWidth="2.2" fill="none" strokeLinecap="round" /> {/* coleta */}
                  <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "jv-blink 2.6s ease-in-out infinite" }}>
                    <path d="M60 6 l2 1.6 l-2 1.6 M66 6 l-2 1.6 l2 1.6" stroke="#1a0a04" strokeWidth="0.9" fill="none" />
                  </g>
                  <ellipse cx="63" cy="10" rx="1.6" ry="2" fill="#5a1410" />
                  <path d="M59 9 q-1 3 0 5" stroke="#6ec8ff" strokeWidth="1.1" fill="none" style={{ animation: "jv-tear 1.4s ease-in infinite" }} />
                </g>
              </g>
              {/* head */}
              <g style={{ transformBox: "fill-box", transformOrigin: "40px 44px", animation: "bj-head 0.34s ease-in-out infinite" }}>
                <ellipse cx="40" cy="42" rx="16" ry="14" fill="#fff" stroke="#3a2010" strokeWidth="1.3" />
                <path d="M26 34 Q34 26 42 32 Q38 38 28 40 Z" fill="#7a4410" />
                {/* ears flap */}
                <g style={{ transformBox: "fill-box", transformOrigin: "28px 30px", animation: "bj-ear 0.4s ease-in-out infinite" }}><path d="M26 30 Q20 22 22 36 Q28 36 30 32 Z" fill="#7a4410" stroke="#3a2010" strokeWidth="0.7" /></g>
                <g style={{ transformBox: "fill-box", transformOrigin: "54px 30px", animation: "bj-ear 0.4s ease-in-out infinite .08s" }}><path d="M54 30 Q60 22 58 36 Q52 36 50 32 Z" fill="#fff" stroke="#3a2010" strokeWidth="0.7" /></g>
                <circle cx="34" cy="40" r="4.4" fill="#1a1a1a" />
                <path d="M26 30 L42 48" stroke="#1a1a1a" strokeWidth="1.3" />
                <circle cx="48" cy="40" r="2.6" fill="#fff" /><circle cx="48" cy="41" r="1.4" fill="#ff3030" />
                <path d="M44 32 l4 8" stroke="#d44a6a" strokeWidth="1.1" />
                <path d="M34 50 Q40 56 48 50 Q44 54 40 54 Q36 54 34 50 Z" fill="#3a0810" />
                <path d="M36 50 l1 3 M40 51 l1 3 M44 51 l-1 3 M46 50 l-1 3" stroke="#fff" strokeWidth="0.9" />
                <ellipse cx="40" cy="46" rx="2.6" ry="1.8" fill="#1a0e08" />
                <path d="M26 56 Q40 62 54 56 L52 62 Q40 66 28 62 Z" fill="#1a1a1a" />
                {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${30 + i * 5} 56 l1 -3 l1 3 Z`} fill="#d7d2c4" />)}
              </g>
            </svg>
            {/* dust puffs from back paws */}
            <div className="bj-dust">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="bj-puff" style={{ left: 14 + i * 3, bottom: 4, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LINES: { t: string; hi?: string[] }[] = [
  { t: "En la cocina encantada," },
  { t: "JAVIERA horneaba con Maxine a sus pies.", hi: ["JAVIERA"] },
  { t: "Hasta que entró BIGOTES EL FEO,", hi: ["BIGOTES EL FEO"] },
  { t: "un Jack Russell con parche y collar de pinchos." },
  { t: "Agarró a JAVIERA y la metió en un saco.", hi: ["JAVIERA"] },
  { t: "Ahora Maxine cava tras él para rescatarla." },
];

export default function Intro({ onStart, skin: _skin }: { onStart: () => void; skin?: SkinId }) {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (line >= LINES.length) return;
    const full = LINES[line].t; let i = 0; setTyped("");
    const id = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i >= full.length) { clearInterval(id); setTimeout(() => setLine((l) => l + 1), line === LINES.length - 1 ? 2200 : 1200); } }, 26);
    return () => clearInterval(id);
  }, [line, cycle]);
  // restart the diorama+text loop gently every 16s so it never feels frozen
  useEffect(() => { const id = setInterval(() => { setCycle((c) => c + 1); setLine(0); }, 16000); return () => clearInterval(id); }, []);

  const renderLine = (text: string, hi?: string[]) => {
    if (!hi) return text;
    const parts: (string | ReactElement)[] = [text];
    hi.forEach((word) => {
      for (let k = 0; k < parts.length; k++) {
        const p = parts[k]; if (typeof p !== "string") continue;
        const idx = p.indexOf(word); if (idx < 0) continue;
        parts.splice(k, 1, p.slice(0, idx), <strong key={`${word}-${k}`} className="text-rose-300 font-bold" style={{ textShadow: "0 0 8px #ff306066" }}>{word}</strong>, p.slice(idx + word.length));
        break;
      }
    });
    return parts;
  };
  const visible = LINES.slice(0, line);
  const window4 = visible.slice(-4);

  return (
    <div className="absolute inset-0 select-none overflow-hidden flex flex-col" style={{ background: "radial-gradient(120% 80% at 50% 0%, #ffb34733 0%, #3a1c0a 55%, #0a0402 100%)" }}>
      <Flour count={20} />
      {/* cinematic letterbox + breathing vignette */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-black/70 z-30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-black/70 z-30" />
      <div className="pointer-events-none absolute inset-0 z-20 intro-vignette" />

      {/* HEADER */}
      <header className="shrink-0 pt-5 pb-1 text-center z-10">
        <div className="font-pixel text-[9px] text-amber-200/70 tracking-[0.3em]">CAPÍTULO 1</div>
        <h2 className="font-display font-bold text-2xl text-amber-100 mt-1" style={{ textShadow: "0 3px 0 #7a3410" }}>La Cocina Encantada</h2>
      </header>

      {/* DIORAMA — one orchestrated 9.5s pass, then holds alive */}
      <div key={cycle} className="shrink-0 relative overflow-hidden" style={{ height: "40%" }}>
        {/* hanging utensils */}
        <svg className="absolute top-0 left-0 w-full h-12" viewBox="0 0 360 50" preserveAspectRatio="none">
          <g stroke="#5a3a1a" strokeWidth="2"><line x1="60" y1="0" x2="60" y2="28" /><line x1="300" y1="0" x2="300" y2="36" /></g>
          <path d="M52 28 h16 v6 a8 8 0 0 1 -16 0 Z" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1.4" />
          <g transform="translate(292 36)"><rect x="6" y="0" width="4" height="12" rx="2" fill="#d7d2c4" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M8 12 Q${2 + i * 4} 22 8 30 Q${14 - i * 4} 22 8 12`} fill="none" stroke="#d7d2c4" strokeWidth="1.2" />)}</g>
        </svg>
        {/* warm window glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-40 h-20 rounded-full blur-2xl" style={{ background: "#ffb347", opacity: 0.25, animation: "glow-pulse 4s ease-in-out infinite" }} />
        {/* floor */}
        <div className="absolute bottom-0 inset-x-0 h-[34%]" style={{ background: "repeating-conic-gradient(#e8c89a 0% 25%, #d9a86a 0% 50%) 0 0 / 28px 28px", boxShadow: "inset 0 8px 12px rgba(0,0,0,.35)" }} />
        {/* hole on the right */}
        <div className="absolute bottom-[30%] rounded-b-[50%]" style={{ left: "78%", width: 70, height: 22, background: "radial-gradient(ellipse at top, #000 0%, #1a0804 65%, transparent 100%)", boxShadow: "inset 0 6px 10px #000" }} />

        {/* JAVIERA standing (calm → scared → gone) */}
        <div className="absolute bottom-[30%] jv-calm" style={{ left: "12%" }}><JavieraHuman size={128} waving /></div>
        <div className="absolute bottom-[30%] jv-scared" style={{ left: "12%" }}><JavieraHuman size={128} scared /></div>

        {/* MAXINE calm → shock → leaper */}
        <div className="absolute bottom-[30%] mx-calm" style={{ left: "24%" }}><MaxineIntro pose="calm" size={70} /></div>
        <div className="absolute bottom-[30%] mx-shock" style={{ left: "22%" }}><MaxineIntro pose="shock" size={74} /></div>
        <div className="absolute bottom-[30%] mx-leap" style={{ left: "22%" }}>
          <MaxineIntro pose="bark" size={76} />
          <div className="mx-bark-bubble">¡GUAU!</div>
          <div className="mx-bark-ring" />
          <div className="mx-bark-ring mx-bark-ring2" />
        </div>

        {/* BIGOTES orchestrated */}
        <div className="absolute bottom-[30%]" style={{ left: 0, right: 0, height: 0 }}><BigotesIntro size={108} /></div>
      </div>

      {/* TEXT — fixed-height window of last 4 lines, never overflows */}
      <div className="flex-1 min-h-0 px-5 pt-2 pb-1 z-10 flex flex-col">
        <div className="relative flex-1 min-h-0 rounded-xl border-2 border-amber-300/30 bg-black/55 backdrop-blur-sm overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-6 z-10" style={{ background: "linear-gradient(180deg,#0a0402 0%,transparent 100%)" }} />
          <div className="absolute inset-0 flex flex-col justify-end p-3 gap-1">
            {window4.map((l, i) => (
              <p key={`${cycle}-${line - window4.length + i}`} className="font-display text-[12.5px] leading-snug text-amber-100/90 intro-line-in">{renderLine(l.t, l.hi)}</p>
            ))}
            {line < LINES.length && (
              <p className="font-display text-[12.5px] leading-snug text-amber-50 intro-line-in">
                {renderLine(typed, LINES[line].hi)}
                <span className="inline-block w-[2px] h-3.5 bg-amber-200 ml-0.5 align-middle" style={{ animation: "flicker 0.6s infinite" }} />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS — reserved strip, safe-area aware, never overlapped */}
      <div className="shrink-0 px-7 pt-2 z-20" style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))", background: "linear-gradient(180deg,transparent 0%,#0a0402cc 40%,#0a0402 100%)" }}>
        <button onClick={onStart} className="btn-3d w-full font-display font-bold text-lg text-white py-2.5 rounded-full border-b-4 active:border-b-0" style={{ background: "linear-gradient(180deg,#ff7a4a,#d9342b)", borderColor: "#7a1410", boxShadow: "0 8px 20px rgba(217,52,43,.45), inset 0 2px 0 rgba(255,255,255,.35)" }}>
          ¡A RESCATARLA!
        </button>
        <button onClick={onStart} className="w-full mt-1 font-pixel text-[8px] text-amber-200/60">saltar historia ▶</button>
      </div>

      <style>{`
        /* ---- scene trajectories (one pass, hold on last frame) ---- */
        .bj-pos { position:absolute; left:0; right:0; bottom:0; height:0; animation: bj-left 9.5s both; }
        @keyframes bj-left {
          0%   { left:112%; animation-timing-function: ease-in; }
          30%  { left:112%; animation-timing-function: cubic-bezier(.4,0,.6,1); }
          35%  { left:52%;  animation-timing-function: cubic-bezier(.45,.05,.55,.95); }
          50%  { left:30%;  animation-timing-function: ease-in-out; }
          56%  { left:28%;  animation-timing-function: cubic-bezier(.5,.05,.7,.3); }
          90%  { left:-4%;  animation-timing-function: cubic-bezier(.5,0,.8,.4); }
          100% { left:-4%; }
        }
        .bj-sink { animation: bj-sink 9.5s both; }
        @keyframes bj-sink { 0%,90% { transform: translateY(0); opacity:1; animation-timing-function: cubic-bezier(.5,0,.8,.4);} 100% { transform: translateY(150px); opacity:0; } }

        .jv-calm   { animation: jv-calm 9.5s both; }
        .jv-scared { animation: jv-scared 9.5s both; }
        @keyframes jv-calm   { 0% { opacity:0; transform: translateY(6px);} 6% { opacity:1; transform:translateY(0);} 30% { opacity:1; } 35% { opacity:0; } 100% { opacity:0; } }
        @keyframes jv-scared { 0%,30% { opacity:0; } 35% { opacity:1; transform: translate(0,0) scale(1);} 40% { transform: translate(2px,-2px) scale(1.02);} 44% { transform: translate(-2px,1px) scale(.98);} 48% { transform: translate(40px,-14px) scale(.82); opacity:1;} 54% { transform: translate(64px,-22px) scale(.7); opacity:0;} 100% { opacity:0; transform: translate(64px,-22px) scale(.7);} }

        .mx-calm  { animation: mx-calm 9.5s both; }
        .mx-shock { animation: mx-shock 9.5s both; }
        .mx-leap  { animation: mx-leap 9.5s both; }
        @keyframes mx-calm  { 0% { opacity:0; transform:translateY(6px);} 8% { opacity:1; transform:translateY(0);} 30% { opacity:1;} 34% { opacity:0;} 100% { opacity:0;} }
        @keyframes mx-shock { 0%,30% { opacity:0;} 34% { opacity:1; transform: scale(1);} 38% { transform: scale(1.08,.94);} 42% { transform: scale(.96,1.05);} 56% { opacity:1; transform: scale(1);} 60% { opacity:0;} 100% { opacity:0;} }
        @keyframes mx-leap  {
          0%,58% { opacity:0; left:22%; transform: translate(0,0) scale(1,1); animation-timing-function: ease-in; }
          60% { opacity:1; left:22%; transform: translate(0,2px) scale(1.12,.86); animation-timing-function: cubic-bezier(.2,.7,.3,1); }
          64% { left:30%; transform: translate(0,-26px) scale(.92,1.14); animation-timing-function: cubic-bezier(.4,0,.6,1); }
          78% { left:62%; transform: translate(0,-34px) scale(.96,1.06); animation-timing-function: cubic-bezier(.5,0,.8,.3); }
          88% { left:74%; transform: translate(0,2px) scale(1.14,.84); animation-timing-function: cubic-bezier(.2,.8,.3,1); }
          93% { left:75%; transform: translate(0,0) scale(.97,1.04); }
          100% { left:75%; transform: translate(0,0) scale(1,1); opacity:1; }
        }
        .bj-girl { animation: bj-girl 9.5s both; }
        @keyframes bj-girl { 0%,44% { opacity:0; } 50% { opacity:1; } 100% { opacity:1; } }

        .mx-bark-bubble { position:absolute; left:-10px; top:-14px; background:#fff; color:#d41430; font-family:"Fredoka",sans-serif; font-weight:700; font-size:11px; padding:2px 6px; border:2px solid #7a0830; border-radius:8px; box-shadow:0 3px 6px #0006; animation: mx-bubble 9.5s both; }
        @keyframes mx-bubble { 0%,63% { opacity:0; transform: scale(.4) rotate(-8deg);} 66% { opacity:1; transform: scale(1.15) rotate(4deg);} 70% { transform: scale(1) rotate(-2deg);} 80% { opacity:1;} 88% { opacity:0; transform: scale(.8) translateY(-6px);} 100% { opacity:0;} }
        .mx-bark-ring { position:absolute; left:50%; top:42%; width:14px; height:14px; margin:-7px 0 0 -7px; border:2px solid #ffd27a; border-radius:50%; animation: mx-ring 9.5s both; }
        .mx-bark-ring2 { animation-delay: -0.18s; }
        @keyframes mx-ring { 0%,64% { opacity:0; transform: scale(.4);} 68% { opacity:.9; transform: scale(1);} 78% { opacity:0; transform: scale(2.4);} 100% { opacity:0;} }

        /* ---- cyclic, organic ---- */
        .bj-bounce { animation: bj-bounce .34s ease-in-out infinite; }
        @keyframes bj-bounce { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-4px);} }
        .bj-tilt { animation: bj-tilt .34s ease-in-out infinite; }
        @keyframes bj-tilt { 0%,100% { transform: rotate(-2deg);} 50% { transform: rotate(2deg);} }
        .bj-shadow { animation: bj-shadow .34s ease-in-out infinite; transform-origin:center; }
        @keyframes bj-shadow { 0%,100% { transform: scaleX(1); opacity:.55;} 50% { transform: scaleX(.7); opacity:.3;} }
        .bj-legA { animation: bj-legA .34s cubic-bezier(.45,.05,.55,.95) infinite; }
        .bj-legB { animation: bj-legB .34s cubic-bezier(.45,.05,.55,.95) infinite; }
        @keyframes bj-legA { 0%,100% { transform: rotate(22deg);} 50% { transform: rotate(-26deg);} }
        @keyframes bj-legB { 0%,100% { transform: rotate(-26deg);} 50% { transform: rotate(22deg);} }
        .bj-tail { animation: bj-tail .5s cubic-bezier(.34,1.4,.64,1) infinite; }
        @keyframes bj-tail { 0%,100% { transform: rotate(-10deg);} 50% { transform: rotate(14deg);} }
        .bj-ear  { animation: bj-ear .4s ease-in-out infinite; }
        @keyframes bj-ear { 0%,100% { transform: rotate(-6deg);} 50% { transform: rotate(8deg);} }
        .bj-sack { animation: bj-sack .5s ease-in-out infinite; }
        @keyframes bj-sack { 0%,100% { transform: rotate(-5deg);} 50% { transform: rotate(6deg);} }
        .bj-head { animation: bj-head .34s ease-in-out infinite; }
        @keyframes bj-head { 0%,100% { transform: rotate(-1.5deg) translateY(0);} 50% { transform: rotate(1.5deg) translateY(-1px);} }
        .bj-dust { position:absolute; left:0; bottom:0; width:100%; height:20px; pointer-events:none; animation: bj-dustwin 9.5s both; }
        @keyframes bj-dustwin { 0%,54% { opacity:0;} 58% { opacity:1;} 90% { opacity:1;} 96% { opacity:0;} 100% { opacity:0;} }
        .bj-puff { position:absolute; width:7px; height:7px; border-radius:50%; background:radial-gradient(circle,#e8d4b0aa,#0000 70%); animation: bj-puff .8s ease-out infinite; }
        @keyframes bj-puff { 0% { transform: translate(0,0) scale(.4); opacity:0;} 20% { opacity:.8;} 100% { transform: translate(18px,-6px) scale(1.6); opacity:0;} }

        .mx-breathe { animation: mx-breathe 2.4s ease-in-out infinite; }
        @keyframes mx-breathe { 0%,100% { transform: scaleY(1);} 50% { transform: scaleY(1.03);} }
        .mx-tail { animation: mx-tail .6s ease-in-out infinite; }
        @keyframes mx-tail { 0%,100% { transform: rotate(-16deg);} 50% { transform: rotate(20deg);} }
        .mx-ear  { animation: mx-ear .7s ease-in-out infinite; }
        @keyframes mx-ear { 0%,100% { transform: rotate(-4deg);} 50% { transform: rotate(5deg);} }
        .mx-blink { animation: mx-blink 3.2s ease-in-out infinite; }
        @keyframes mx-blink { 0%,92%,100% { transform: scaleY(1);} 95% { transform: scaleY(.1);} }

        .jv-breathe { animation: jv-breathe 2.8s ease-in-out infinite; }
        @keyframes jv-breathe { 0%,100% { transform: scaleY(1);} 50% { transform: scaleY(1.025);} }
        .jv-sway { animation: jv-sway 3.6s ease-in-out infinite; }
        @keyframes jv-sway { 0%,100% { transform: translateX(0) rotate(0);} 50% { transform: translateX(.6px) rotate(.4deg);} }
        .jv-nod  { animation: jv-nod 4.2s ease-in-out infinite; }
        @keyframes jv-nod  { 0%,100% { transform: rotate(0);} 50% { transform: rotate(-1.2deg);} }
        .jv-hair { animation: jv-hair 3s ease-in-out infinite; }
        @keyframes jv-hair { 0%,100% { transform: rotate(-2deg);} 50% { transform: rotate(3deg);} }
        .jv-blink { animation: jv-blink 3.4s ease-in-out infinite; }
        @keyframes jv-blink { 0%,90%,100% { transform: scaleY(1);} 94% { transform: scaleY(.1);} }
        .jv-wave { animation: jv-wave 1.9s cubic-bezier(.34,1.56,.64,1) infinite; }
        @keyframes jv-wave { 0%,100% { transform: rotate(0);} 30% { transform: rotate(-22deg);} 50% { transform: rotate(-12deg);} 70% { transform: rotate(-20deg);} }
        .jv-tear { animation: jv-tear 1.6s ease-in infinite; }
        @keyframes jv-tear { 0% { transform: translateY(0); opacity:0;} 20% { opacity:1;} 100% { transform: translateY(8px); opacity:0;} }

        .intro-line-in { animation: intro-line-in .45s cubic-bezier(.2,.8,.3,1) both; }
        @keyframes intro-line-in { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
        .intro-vignette { box-shadow: inset 0 0 120px 20px rgba(0,0,0,.7); animation: intro-vig 5s ease-in-out infinite; }
        @keyframes intro-vig { 0%,100% { box-shadow: inset 0 0 120px 20px rgba(0,0,0,.7);} 50% { box-shadow: inset 0 0 90px 10px rgba(0,0,0,.55);} }
      `}</style>
    </div>
  );
}
