import type { CSSProperties } from "react";

/* ----------------------------- BREAD ----------------------------- */
export type BreadType = "baguette" | "miche" | "croissant" | "pretzel" | "divine";

export function Bread({ type, size = 28 }: { type: BreadType; size?: number }) {
  const s = size;
  switch (type) {
    case "baguette":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <g transform="rotate(-30 16 16)">
            <rect x="4" y="12" width="24" height="8" rx="4" fill="#d99243" stroke="#7a4410" strokeWidth="1.2" />
            <rect x="5" y="13" width="22" height="3" rx="1.5" fill="#f0b873" />
            <path d="M9 14 l2 4 M14 14 l2 4 M19 14 l2 4 M24 14 l2 4" stroke="#7a4410" strokeWidth="1" />
          </g>
        </svg>
      );
    case "miche":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <rect x="6" y="8" width="20" height="16" rx="3" fill="#e3a35a" stroke="#7a4410" strokeWidth="1.3" />
          <rect x="6" y="8" width="20" height="5" rx="2.5" fill="#f4c389" />
          <path d="M11 12 v12 M16 12 v12 M21 12 v12" stroke="#7a4410" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case "croissant":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M6 20 Q10 8 16 12 Q22 8 26 20 Q22 18 16 22 Q10 18 6 20 Z" fill="#e8a64a" stroke="#7a4410" strokeWidth="1.2" />
          <path d="M10 16 q2 -3 4 -1 M18 15 q2 -2 4 1" stroke="#7a4410" strokeWidth="0.9" fill="none" />
          <path d="M8 19 Q16 14 24 19" stroke="#fff0c4" strokeWidth="1" fill="none" opacity="0.7" />
        </svg>
      );
    case "pretzel":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <g filter="drop-shadow(0 0 4px #ffe066)">
            <path d="M10 22 Q4 14 12 12 Q16 11 16 16 Q16 11 20 12 Q28 14 22 22 Q18 18 16 22 Q14 18 10 22 Z"
              fill="none" stroke="#c9842a" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M10 22 Q4 14 12 12 Q16 11 16 16 Q16 11 20 12 Q28 14 22 22 Q18 18 16 22 Q14 18 10 22 Z"
              fill="none" stroke="#ffe066" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <circle cx="9" cy="15" r="0.9" fill="#fff" />
            <circle cx="23" cy="15" r="0.9" fill="#fff" />
            <circle cx="16" cy="20" r="0.9" fill="#fff" />
          </g>
        </svg>
      );
    case "divine":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <g filter="drop-shadow(0 0 6px #ffe066)">
            <path d="M6 22 Q6 12 16 12 Q26 12 26 22 Z" fill="#fff3c4" stroke="#c9942a" strokeWidth="1.2" />
            <path d="M6 22 Q16 26 26 22 L24 26 Q16 28 8 26 Z" fill="#ff8fb0" stroke="#c93a78" strokeWidth="1" />
            <path d="M10 12 l2 -4 l2 3 l2 -5 l2 5 l2 -3 l2 4" fill="none" stroke="#ffd27a" strokeWidth="1.4" />
            <circle cx="16" cy="8" r="1.6" fill="#ff5fa0" />
            <path d="M12 18 q4 3 8 0" stroke="#c93a78" strokeWidth="1" fill="none" />
            <circle cx="13" cy="17" r="0.8" fill="#3a1a08" />
            <circle cx="19" cy="17" r="0.8" fill="#3a1a08" />
          </g>
        </svg>
      );
  }
}

/* ----------------------------- HEART ----------------------------- */
export function Heart({ filled, size = 22 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: filled ? "drop-shadow(0 2px 0 #7a1430)" : "none" }}>
      <path
        d="M12 21 C4 14 2 9 6 6 C9 4 12 7 12 9 C12 7 15 4 18 6 C22 9 20 14 12 21 Z"
        fill={filled ? "#ff4d6d" : "transparent"}
        stroke={filled ? "#7a1430" : "#6b5a4a"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {filled && <path d="M8 8 q2 -2 4 0" stroke="#ffd0dc" strokeWidth="1.4" fill="none" />}
    </svg>
  );
}

/* ----------------------------- CROWN / COIN ----------------------------- */
export function Crown({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 8 l4 4 l5 -8 l5 8 l4 -4 l-2 12 H5 Z" fill="#ffd27a" stroke="#a8730a" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="7" cy="8" r="1.6" fill="#ff5fa0" />
      <circle cx="12" cy="4" r="1.6" fill="#7fd0ff" />
      <circle cx="17" cy="8" r="1.6" fill="#ff5fa0" />
    </svg>
  );
}

/* ----------------------------- ENEMIES ----------------------------- */
export function Spoon({ size = 40, flip = 1 }: { size?: number; flip?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: `scaleX(${flip})` }}>
      <rect x="22" y="22" width="4" height="22" rx="2" fill="#d7d2c4" stroke="#6a6555" strokeWidth="1.2" />
      <ellipse cx="24" cy="14" rx="10" ry="12" fill="#ece7d6" stroke="#6a6555" strokeWidth="1.4" />
      <ellipse cx="21" cy="11" rx="3" ry="5" fill="#fff" opacity="0.8" />
      <circle cx="21" cy="14" r="1.4" fill="#1a1a1a" />
      <circle cx="27" cy="14" r="1.4" fill="#1a1a1a" />
      <path d="M21 18 q3 2 6 0" stroke="#1a1a1a" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function Mouse({ size = 38, flip = 1 }: { size?: number; flip?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 32" style={{ transform: `scaleX(${flip})` }}>
      <path d="M40 22 Q48 18 44 12" stroke="#b08a6a" strokeWidth="2" fill="none" />
      <ellipse cx="22" cy="20" rx="16" ry="9" fill="#c9a888" stroke="#6a4a2a" strokeWidth="1.2" />
      <circle cx="10" cy="16" r="6" fill="#c9a888" stroke="#6a4a2a" strokeWidth="1.2" />
      <circle cx="8" cy="10" r="4" fill="#e0b894" stroke="#6a4a2a" strokeWidth="1" />
      <circle cx="14" cy="10" r="4" fill="#e0b894" stroke="#6a4a2a" strokeWidth="1" />
      <circle cx="9" cy="15" r="1.2" fill="#1a1a1a" />
      <circle cx="4" cy="17" r="1.4" fill="#ff8fa0" />
      <path d="M2 19 l-3 -1 M2 20 l-3 1" stroke="#fff" strokeWidth="0.8" />
    </svg>
  );
}

export function Whisk({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ animation: "spin-slow 0.4s linear infinite" }}>
      <rect x="18" y="2" width="4" height="14" rx="2" fill="#7a4410" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M20 16 Q${8 + i * 6} 28 20 38 Q${32 - i * 6} 28 20 16`} fill="none" stroke="#d7d2c4" strokeWidth="1.6" />
      ))}
    </svg>
  );
}

/* ----------------------------- POWERUPS ----------------------------- */
export function PowerIcon({ kind, size = 26 }: { kind: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 32 32" } as const;
  if (kind === "butter")
    return (
      <svg {...common}>
        <rect x="6" y="12" width="20" height="12" rx="2" fill="#ffe066" stroke="#a8730a" strokeWidth="1.2" />
        <rect x="6" y="12" width="20" height="4" fill="#fff3b0" />
        <path d="M10 18 h12" stroke="#a8730a" strokeWidth="0.8" />
      </svg>
    );
  if (kind === "milk")
    return (
      <svg {...common}>
        <path d="M12 4 h8 v4 l3 4 v14 a2 2 0 0 1 -2 2 H11 a2 2 0 0 1 -2 -2 V12 l3 -4 Z" fill="#fff" stroke="#7a6a5a" strokeWidth="1.2" />
        <rect x="9" y="16" width="14" height="6" fill="#ff8fa0" />
        <path d="M13 8 h6" stroke="#7a6a5a" strokeWidth="1" />
      </svg>
    );
  if (kind === "yeast")
    return (
      <svg {...common}>
        <circle cx="16" cy="18" r="9" fill="#f4d9a0" stroke="#7a4410" strokeWidth="1.2" />
        <circle cx="13" cy="16" r="1.4" fill="#7a4410" />
        <circle cx="19" cy="18" r="1.4" fill="#7a4410" />
        <path d="M12 21 q4 3 8 0" stroke="#7a4410" strokeWidth="1.2" fill="none" />
        <path d="M10 10 q2 -4 4 -2 M22 10 q-2 -4 -4 -2" stroke="#fff" strokeWidth="1.4" fill="none" />
      </svg>
    );
  if (kind === "boost")
    return (
      <svg {...common}>
        <circle cx="16" cy="18" r="9" fill="#ffd27a" stroke="#a8730a" strokeWidth="1.2" />
        <path d="M12 14 l4 6 l4 -6" fill="#ff5a2a" stroke="#7a1410" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="14" r="1.4" fill="#fff" />
        <path d="M8 22 q8 3 16 0" fill="none" stroke="#7a4410" strokeWidth="1" />
      </svg>
    );
  // magnet
  return (
    <svg {...common}>
      <path d="M8 6 v10 a8 8 0 0 0 16 0 V6 h-5 v10 a3 3 0 0 1 -6 0 V6 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1.2" />
      <rect x="8" y="6" width="5" height="4" fill="#d7d2c4" />
      <rect x="19" y="6" width="5" height="4" fill="#d7d2c4" />
    </svg>
  );
}

/* ----------------------------- KITCHEN PARALLAX BG ----------------------------- */
export function KitchenBackdrop({ depth, style }: { depth: number; style?: CSSProperties }) {
  // zone by depth
  const zone = zoneOf(depth);
  const palettes: Record<string, { sky: string; glow: string; accent: string }> = {
    mesa: { sky: "#3a2410", glow: "#ffb347", accent: "#7a4a22" },
    horno: { sky: "#2a0e08", glow: "#ff5a2a", accent: "#7a2410" },
    nevera: { sky: "#0e2436", glow: "#7fd0ff", accent: "#2a5a7a" },
    despensa: { sky: "#2a1a08", glow: "#e3a35a", accent: "#6a4420" },
    sotano: { sky: "#14081f", glow: "#b06bff", accent: "#3a1a5a" },
  };
  const p = palettes[zone];
  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${p.glow}33 0%, ${p.sky} 60%, #0a0402 100%)` }} />
      {/* far shelves */}
      <div className="absolute inset-x-0" style={{ top: "8%", opacity: 0.35 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="absolute h-2 rounded" style={{ left: `${(i * 19) % 100}%`, width: 60, background: p.accent, top: (i % 3) * 30 }} />
        ))}
      </div>
      {/* hanging pots */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }} preserveAspectRatio="none" viewBox="0 0 360 640">
        <g stroke={p.accent} strokeWidth="2" fill="none">
          <line x1="60" y1="0" x2="60" y2="80" />
          <line x1="300" y1="0" x2="300" y2="120" />
        </g>
        <circle cx="60" cy="92" r="14" fill={p.accent} />
        <path d="M288 132 h24 v10 a12 12 0 0 1 -24 0 Z" fill={p.accent} />
      </svg>
      {/* warm vignette */}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 120px 30px rgba(0,0,0,0.55)" }} />
      {/* oven glow pulse */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[140%] h-40 rounded-full blur-2xl" style={{ background: p.glow, opacity: 0.18, animation: "glow-pulse 3s ease-in-out infinite" }} />
    </div>
  );
}

export function zoneOf(depth: number) {
  if (depth < 30) return "mesa";
  if (depth < 70) return "horno";
  if (depth < 110) return "nevera";
  if (depth < 160) return "despensa";
  return "sotano";
}
export const ZONE_NAME: Record<string, string> = {
  mesa: "Mesa de Preparación",
  horno: "El Horno",
  nevera: "La Nevera",
  despensa: "La Despensa",
  sotano: "Sótano Panadero",
};

/* ----------------------------- FLOUR PARTICLES ----------------------------- */
export function Flour({ count = 24 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const dur = 6 + ((i * 13) % 7);
        const delay = (i * 0.7) % 6;
        const drift = ((i % 5) - 2) * 12;
        const sz = 2 + (i % 4);
        return (
          <span
            key={i}
            className="flour"
            style={{
              left: `${left}%`,
              bottom: `-10px`,
              width: sz,
              height: sz,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              ["--drift" as string]: `${drift}px`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ----------------------------- PIXEL TAVERN NPC ----------------------------- */
export function PixelNpc({ variant, size = 56 }: { variant: number; size?: number }) {
  // 8x8-ish blocky character drawn with rects
  const palettes = [
    { skin: "#f0c090", hair: "#3a2410", shirt: "#7a3a8a", pant: "#2a2a4a" },
    { skin: "#e0a878", hair: "#d9b04a", shirt: "#3a7a3a", pant: "#5a3a1a" },
    { skin: "#c98a5a", hair: "#1a1a1a", shirt: "#2a4a8a", pant: "#1a1a2a" },
    { skin: "#f0d0a0", hair: "#a83a2a", shirt: "#d9342b", pant: "#2a2a2a" },
  ];
  const c = palettes[variant % palettes.length];
  const px = size / 10;
  const grid = [
    "..HHHH..",
    ".HHHHHH.",
    ".HSSSSH.",
    ".SSSSSS.",
    "..TTTT..",
    ".TTTTTT.",
    ".PP..PP.",
    ".PP..PP.",
  ];
  const colorMap: Record<string, string> = { H: c.hair, S: c.skin, T: c.shirt, P: c.pant };
  return (
    <svg width={size} height={size * 1.1} viewBox={`0 0 ${px * 8} ${px * 8}`} className="pixelated">
      {grid.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "." ? null : <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={colorMap[ch]} />
        )
      )}
      {/* eyes */}
      <rect x={2.6 * px} y={2.4 * px} width={px * 0.8} height={px * 0.8} fill="#1a1a1a" />
      <rect x={4.6 * px} y={2.4 * px} width={px * 0.8} height={px * 0.8} fill="#1a1a1a" />
    </svg>
  );
}
