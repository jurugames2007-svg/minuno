import type { FurnId } from "../data/furniture";

export function FurnitureArt({ id, w, h }: { id: FurnId; w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 64 48" preserveAspectRatio="none" style={{ overflow: "visible", display: "block" }}>
      <g stroke="#1a0c04" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {shape(id)}
      </g>
    </svg>
  );
}

function shape(id: FurnId) {
  switch (id) {
    case "cama":
      return (
        <>
          <rect x="2" y="22" width="60" height="22" rx="3" fill="#8a3a28" />
          <rect x="6" y="12" width="18" height="16" rx="3" fill="#fff3d6" />
          <rect x="22" y="16" width="38" height="14" rx="2" fill="#c44a6a" />
          <rect x="22" y="16" width="38" height="5" fill="#ff8fb6" />
        </>
      );
    case "mesa":
      return (
        <>
          <rect x="6" y="18" width="52" height="10" rx="2" fill="#c9842a" />
          <rect x="10" y="28" width="6" height="16" fill="#8a5420" />
          <rect x="48" y="28" width="6" height="16" fill="#8a5420" />
          <ellipse cx="32" cy="16" rx="7" ry="5" fill="#fff3d6" />
        </>
      );
    case "silla":
      return (
        <>
          <rect x="18" y="4" width="28" height="18" rx="2" fill="#6a8ab0" />
          <rect x="16" y="22" width="32" height="10" rx="2" fill="#4a6a90" />
          <rect x="18" y="32" width="6" height="14" fill="#3a4a60" />
          <rect x="40" y="32" width="6" height="14" fill="#3a4a60" />
        </>
      );
    case "lampara":
      return (
        <>
          <rect x="28" y="22" width="8" height="22" fill="#8a5a2c" />
          <path d="M18 22 L32 6 L46 22 Z" fill="#ffd27a" />
          <circle cx="32" cy="16" r="5" fill="#fff3d6" opacity="0.85" />
        </>
      );
    case "planta":
      return (
        <>
          <rect x="24" y="32" width="16" height="12" rx="2" fill="#8a3a28" />
          <ellipse cx="32" cy="20" rx="14" ry="16" fill="#3a8a2a" />
          <ellipse cx="22" cy="24" rx="8" ry="10" fill="#4aaa3a" />
          <ellipse cx="42" cy="22" rx="8" ry="11" fill="#2a6a18" />
        </>
      );
    case "alfombra":
      return (
        <>
          <ellipse cx="32" cy="30" rx="30" ry="12" fill="#7a1430" />
          <ellipse cx="32" cy="30" rx="20" ry="7" fill="#c44a6a" />
        </>
      );
    case "estante":
      return (
        <>
          <rect x="8" y="2" width="48" height="44" rx="2" fill="#8a5128" />
          <rect x="12" y="8" width="40" height="8" fill="#5a3216" />
          <rect x="12" y="20" width="40" height="8" fill="#5a3216" />
          <rect x="12" y="32" width="40" height="8" fill="#5a3216" />
          <rect x="14" y="10" width="8" height="6" fill="#c44a6a" />
          <rect x="26" y="22" width="10" height="6" fill="#3a5a8a" />
          <rect x="40" y="34" width="8" height="6" fill="#fff3d6" />
        </>
      );
    case "horno":
      return (
        <>
          <rect x="10" y="6" width="44" height="38" rx="3" fill="#3a2418" />
          <rect x="16" y="12" width="32" height="16" rx="2" fill="#1a0c08" />
          <ellipse cx="32" cy="20" rx="10" ry="6" fill="#ff7a2a" className="flicker" />
          <rect x="18" y="32" width="28" height="6" rx="1" fill="#5a3a20" />
        </>
      );
    case "sofa":
      return (
        <>
          <rect x="4" y="16" width="56" height="22" rx="4" fill="#3a5a8a" />
          <rect x="8" y="10" width="16" height="14" rx="3" fill="#4a6aa0" />
          <rect x="40" y="10" width="16" height="14" rx="3" fill="#4a6aa0" />
          <rect x="8" y="34" width="10" height="10" fill="#2a3a58" />
          <rect x="46" y="34" width="10" height="10" fill="#2a3a58" />
        </>
      );
    case "pecera":
      return (
        <>
          <rect x="10" y="10" width="44" height="30" rx="3" fill="#7fd0ff88" />
          <rect x="10" y="10" width="44" height="8" fill="#d8f4ff66" />
          <ellipse cx="26" cy="28" rx="6" ry="3" fill="#ff8a2a" />
          <ellipse cx="42" cy="24" rx="5" ry="3" fill="#ff5fa0" />
        </>
      );
    case "radio":
      return (
        <>
          <rect x="10" y="16" width="44" height="22" rx="3" fill="#5a3a1a" />
          <circle cx="24" cy="27" r="7" fill="#2a1a08" />
          <rect x="36" y="20" width="12" height="4" fill="#c9842a" />
          <rect x="36" y="28" width="12" height="4" fill="#c9842a" />
        </>
      );
    case "cuadro":
      return (
        <>
          <rect x="8" y="6" width="48" height="36" rx="2" fill="#c9a86a" />
          <rect x="14" y="12" width="36" height="24" fill="#fff3d6" />
          <circle cx="28" cy="24" r="5" fill="#e3c79a" />
          <ellipse cx="40" cy="28" rx="8" ry="6" fill="#7fc24a" />
        </>
      );
    case "comedero":
      return (
        <>
          <ellipse cx="32" cy="28" rx="20" ry="10" fill="#d7d2c4" />
          <ellipse cx="32" cy="26" rx="14" ry="6" fill="#8a5a2c" />
        </>
      );
    case "ventana":
      return (
        <>
          <rect x="8" y="4" width="48" height="40" rx="2" fill="#3a2010" />
          <rect x="14" y="10" width="16" height="14" fill="#7ec8ff" />
          <rect x="34" y="10" width="16" height="14" fill="#7ec8ff" />
          <rect x="14" y="28" width="16" height="10" fill="#c9842a" />
          <rect x="34" y="28" width="16" height="10" fill="#c9842a" />
        </>
      );
    case "velas":
      return (
        <>
          <rect x="20" y="18" width="8" height="22" fill="#fff3d6" />
          <rect x="36" y="12" width="8" height="28" fill="#fff3d6" />
          <ellipse cx="24" cy="14" rx="3" ry="5" fill="#ffd27a" />
          <ellipse cx="40" cy="8" rx="3" ry="5" fill="#ffb347" />
        </>
      );
    case "reloj":
      return (
        <>
          <circle cx="32" cy="24" r="18" fill="#fff3d6" />
          <circle cx="32" cy="24" r="2" fill="#1a0c04" />
          <path d="M32 24 L32 12 M32 24 L42 28" fill="none" />
        </>
      );
    default:
      return <rect x="12" y="12" width="40" height="24" fill="#c9842a" />;
  }
}

export function WoodIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <rect x="3" y="6" width="14" height="8" rx="2" fill="#c9842a" stroke="#5a3216" strokeWidth="1.4" />
      <path d="M6 8 h8 M6 12 h8" stroke="#8a5420" strokeWidth="1" />
    </svg>
  );
}
