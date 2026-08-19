import type { FurnId } from "../data/furniture";

export function FurnitureArt({ id, w, h }: { id: FurnId; w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 64 48" preserveAspectRatio="xMidYMax meet" style={{ overflow: "visible", display: "block" }}>
      <g stroke="#2a1408" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
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
          <rect x="4" y="24" width="56" height="18" rx="3" fill="#8a3a28" />
          <rect x="8" y="14" width="16" height="14" rx="3" fill="#fff3d6" />
          <rect x="24" y="18" width="32" height="12" rx="2" fill="#c44a6a" />
          <rect x="24" y="18" width="32" height="4" fill="#ffb0c4" />
        </>
      );
    case "mesa":
      return (
        <>
          <rect x="8" y="20" width="48" height="8" rx="2" fill="#d99243" />
          <rect x="12" y="28" width="5" height="14" fill="#8a5420" />
          <rect x="47" y="28" width="5" height="14" fill="#8a5420" />
          <ellipse cx="32" cy="18" rx="6" ry="4" fill="#fff3d6" />
        </>
      );
    case "silla":
      return (
        <>
          <rect x="20" y="6" width="24" height="16" rx="2" fill="#6a8ab0" />
          <rect x="18" y="22" width="28" height="8" rx="2" fill="#4a6a90" />
          <rect x="20" y="30" width="5" height="12" fill="#3a4a60" />
          <rect x="39" y="30" width="5" height="12" fill="#3a4a60" />
        </>
      );
    case "lampara":
      return (
        <>
          <rect x="29" y="24" width="6" height="18" fill="#8a5a2c" />
          <path d="M20 24 L32 8 L44 24 Z" fill="#ffe08a" />
          <circle cx="32" cy="18" r="4" fill="#fff8d0" opacity="0.9" />
        </>
      );
    case "planta":
      return (
        <>
          <rect x="26" y="34" width="12" height="10" rx="2" fill="#8a3a28" />
          <ellipse cx="32" cy="22" rx="12" ry="14" fill="#4a9a32" />
          <ellipse cx="24" cy="26" rx="7" ry="9" fill="#6aba44" />
        </>
      );
    case "alfombra":
      return (
        <>
          <ellipse cx="32" cy="32" rx="28" ry="10" fill="#8a2040" />
          <ellipse cx="32" cy="32" rx="18" ry="6" fill="#d06080" />
        </>
      );
    case "estante":
      return (
        <>
          <rect x="12" y="4" width="40" height="40" rx="2" fill="#a86a30" />
          <rect x="16" y="10" width="32" height="6" fill="#6a3a14" />
          <rect x="16" y="22" width="32" height="6" fill="#6a3a14" />
          <rect x="16" y="34" width="32" height="6" fill="#6a3a14" />
          <rect x="18" y="11" width="7" height="4" fill="#c44a6a" />
          <rect x="28" y="23" width="8" height="4" fill="#3a5a8a" />
        </>
      );
    case "horno":
      return (
        <>
          <rect x="14" y="8" width="36" height="34" rx="3" fill="#3a2418" />
          <rect x="20" y="14" width="24" height="14" rx="2" fill="#1a0c08" />
          <ellipse cx="32" cy="21" rx="8" ry="5" fill="#ff8a3a" />
          <rect x="20" y="32" width="24" height="5" rx="1" fill="#5a3a20" />
        </>
      );
    case "sofa":
      return (
        <>
          <rect x="6" y="18" width="52" height="18" rx="4" fill="#4a6aa0" />
          <rect x="8" y="12" width="14" height="12" rx="3" fill="#6a8ac0" />
          <rect x="42" y="12" width="14" height="12" rx="3" fill="#6a8ac0" />
          <rect x="8" y="34" width="8" height="8" fill="#2a3a58" />
          <rect x="48" y="34" width="8" height="8" fill="#2a3a58" />
        </>
      );
    case "pecera":
      return (
        <>
          <rect x="12" y="12" width="40" height="26" rx="3" fill="#8ad4f088" />
          <rect x="12" y="12" width="40" height="7" fill="#e8f8ff66" />
          <ellipse cx="26" cy="28" rx="5" ry="3" fill="#ff8a2a" />
          <ellipse cx="40" cy="24" rx="4" ry="2.5" fill="#ff5fa0" />
        </>
      );
    case "radio":
      return (
        <>
          <rect x="14" y="18" width="36" height="18" rx="3" fill="#6a4220" />
          <circle cx="26" cy="27" r="6" fill="#2a1a08" />
          <rect x="36" y="22" width="10" height="3" fill="#d99243" />
          <rect x="36" y="28" width="10" height="3" fill="#d99243" />
        </>
      );
    case "cuadro":
      return (
        <>
          <rect x="12" y="8" width="40" height="30" rx="2" fill="#c9a86a" />
          <rect x="16" y="12" width="32" height="22" fill="#fff3d6" />
          <circle cx="28" cy="22" r="4" fill="#e3c79a" />
          <ellipse cx="40" cy="26" rx="7" ry="5" fill="#7fc24a" />
        </>
      );
    case "comedero":
      return (
        <>
          <ellipse cx="32" cy="30" rx="16" ry="8" fill="#e8e0d0" />
          <ellipse cx="32" cy="28" rx="11" ry="5" fill="#8a5a2c" />
        </>
      );
    case "ventana":
      return (
        <>
          <rect x="12" y="6" width="40" height="34" rx="2" fill="#5a3216" />
          <rect x="16" y="10" width="14" height="12" fill="#9ad4ff" />
          <rect x="34" y="10" width="14" height="12" fill="#9ad4ff" />
          <rect x="16" y="26" width="14" height="10" fill="#d99243" />
          <rect x="34" y="26" width="14" height="10" fill="#d99243" />
        </>
      );
    case "velas":
      return (
        <>
          <rect x="22" y="20" width="6" height="18" fill="#fff3d6" />
          <rect x="36" y="14" width="6" height="24" fill="#fff3d6" />
          <ellipse cx="25" cy="16" rx="2.4" ry="4" fill="#ffd27a" />
          <ellipse cx="39" cy="10" rx="2.4" ry="4" fill="#ffb347" />
        </>
      );
    case "reloj":
      return (
        <>
          <circle cx="32" cy="24" r="16" fill="#fff3d6" />
          <circle cx="32" cy="24" r="2" fill="#2a1408" />
          <path d="M32 24 L32 12 M32 24 L42 28" fill="none" />
        </>
      );
    case "piano":
      return (
        <>
          <rect x="6" y="20" width="52" height="18" rx="2" fill="#1a1a1e" />
          <rect x="10" y="24" width="44" height="6" fill="#f4f1e8" />
          <rect x="8" y="14" width="14" height="10" rx="1" fill="#121214" />
        </>
      );
    case "armario":
      return (
        <>
          <rect x="14" y="4" width="36" height="40" rx="2" fill="#a86a30" />
          <line x1="32" y1="6" x2="32" y2="42" />
          <circle cx="28" cy="26" r="1.6" fill="#ffd27a" />
          <circle cx="36" cy="26" r="1.6" fill="#ffd27a" />
        </>
      );
    case "tv":
      return (
        <>
          <rect x="12" y="10" width="40" height="26" rx="2" fill="#1a1a22" />
          <rect x="16" y="14" width="32" height="18" fill="#3a6a8a" />
          <rect x="26" y="36" width="12" height="6" fill="#3a3a40" />
        </>
      );
    case "cuna":
      return (
        <>
          <rect x="10" y="20" width="44" height="16" rx="2" fill="#e8c8a0" />
          <rect x="14" y="16" width="36" height="8" fill="#ffe0f0" />
          <line x1="12" y1="20" x2="12" y2="40" />
          <line x1="52" y1="20" x2="52" y2="40" />
        </>
      );
    case "banera":
      return (
        <>
          <path d="M8 22 h48 v12 a10 10 0 0 1 -10 10 H18 a10 10 0 0 1 -10 -10 Z" fill="#e8eef4" />
          <rect x="48" y="10" width="6" height="16" fill="#b8c4d0" />
        </>
      );
    case "perchero":
      return (
        <>
          <rect x="30" y="8" width="4" height="36" fill="#8a5a2c" />
          <line x1="20" y1="14" x2="44" y2="14" />
          <path d="M18 28 q6 8 0 16" fill="none" stroke="#3a5a8a" strokeWidth="3" />
        </>
      );
    case "escritorio":
      return (
        <>
          <rect x="6" y="22" width="52" height="8" rx="1" fill="#c9842a" />
          <rect x="8" y="30" width="16" height="12" fill="#8a5420" />
          <rect x="40" y="30" width="16" height="12" fill="#8a5420" />
          <rect x="18" y="12" width="18" height="10" fill="#fff3d6" />
        </>
      );
    case "cortina":
      return (
        <>
          <rect x="10" y="6" width="44" height="4" fill="#6a3a14" />
          <path d="M12 10 q6 16 0 32 M24 10 q6 16 0 32 M36 10 q6 16 0 32 M48 10 q-6 16 0 32" fill="none" stroke="#c44a6a" strokeWidth="6" />
        </>
      );
    case "cabinaPan":
      return arcade("#d44a2a", "#ffd27a");
    case "cabinaHueso":
      return arcade("#3a6a8a", "#fff3d6");
    case "cabinaSalto":
      return arcade("#3a8a3a", "#b8f080");
    case "cabinaTe":
      return arcade("#7a3a8a", "#e8b0ff");
    default:
      return <rect x="16" y="16" width="32" height="20" fill="#c9842a" />;
  }
}

function arcade(body: string, screen: string) {
  return (
    <>
      <rect x="14" y="2" width="36" height="44" rx="3" fill={body} />
      <rect x="18" y="6" width="28" height="18" rx="1" fill={screen} />
      <rect x="18" y="28" width="28" height="12" rx="1" fill="#1a0c08" />
      <circle cx="26" cy="34" r="2.2" fill="#ff5a4a" />
      <circle cx="34" cy="34" r="2.2" fill="#ffd27a" />
      <circle cx="42" cy="34" r="2.2" fill="#7fd0ff" />
    </>
  );
}

export function WoodIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <rect x="3" y="6" width="14" height="8" rx="2" fill="#c9842a" stroke="#5a3216" strokeWidth="1.4" />
      <path d="M6 8 h8 M6 12 h8" stroke="#8a5420" strokeWidth="1" />
    </svg>
  );
}

export function HammerIcon({ size = 18, color = "#3a1808" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M14 3 l7 7 -3 1 -6 -6 Z" fill={color} />
      <rect x="6" y="10" width="4" height="11" rx="1" transform="rotate(-35 8 16)" fill={color} />
    </svg>
  );
}

export function BagIcon({ size = 18, color = "#ffd27a" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M5 8 h14 l-1.5 13 H6.5 Z" fill={color} stroke="#3a1808" strokeWidth="1.4" />
      <path d="M9 8 q3 -6 6 0" fill="none" stroke="#3a1808" strokeWidth="1.6" />
    </svg>
  );
}
