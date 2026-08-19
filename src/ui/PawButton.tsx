interface Props {
  onPress: () => void;
  className?: string;
  size?: number;
  aim?: { x: number; y: number };
}

/** Huella transparente: solo cava al tocarla. */
export default function PawButton({ onPress, className = "", size = 56, aim }: Props) {
  const ax = aim?.x ?? 0;
  const ay = aim?.y ?? 1;
  return (
    <button
      type="button"
      aria-label="Cavar"
      className={`absolute z-[90] flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        right: 10,
        bottom: 18,
        background: "rgba(255,243,214,0.18)",
        border: "2px solid rgba(42,20,8,0.45)",
        boxShadow: "2px 2px 0 rgba(10,4,2,0.28)",
        borderRadius: 3,
        backdropFilter: "blur(2px)",
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onPress();
      }}
    >
      {ax < 0 && <AimTick side="l" />}
      {ax > 0 && <AimTick side="r" />}
      {ay > 0 && <AimTick side="d" />}
      <PawIcon size={size * 0.58} color="rgba(42,20,8,0.72)" />
    </button>
  );
}

function AimTick({ side }: { side: "l" | "r" | "d" }) {
  const pos =
    side === "l" ? { left: 2, top: "42%" } :
    side === "r" ? { right: 2, top: "42%" } :
    { bottom: 2, left: "42%" };
  return (
    <span className="absolute w-1.5 h-1.5 pointer-events-none" style={{ ...pos, background: "#ffd27a", boxShadow: "0 0 4px #ffd27a" }} />
  );
}

export function PawIcon({ size = 36, color = "#3a1808" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <ellipse cx="24" cy="32" rx="11" ry="9" fill={color} />
      <ellipse cx="10" cy="20" rx="5.2" ry="6.4" fill={color} />
      <ellipse cx="19" cy="13" rx="4.8" ry="6" fill={color} />
      <ellipse cx="29" cy="13" rx="4.8" ry="6" fill={color} />
      <ellipse cx="38" cy="20" rx="5.2" ry="6.4" fill={color} />
    </svg>
  );
}
