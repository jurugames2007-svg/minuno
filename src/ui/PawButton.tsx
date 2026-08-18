interface Props {
  onPress: () => void;
  className?: string;
  size?: number;
}

/** Botón de cavar: solo huella, sin texto. */
export default function PawButton({ onPress, className = "", size = 58 }: Props) {
  return (
    <button
      type="button"
      aria-label="Cavar"
      className={`absolute z-40 btn-3d rounded-full border-2 border-b-4 active:border-b-2 flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        right: 10,
        bottom: 52,
        background: "linear-gradient(180deg,#ffd27a,#d99243)",
        borderColor: "#7a4410",
        boxShadow: "0 6px 0 #5a2a08, 0 8px 16px #0006",
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onPress();
      }}
    >
      <PawIcon size={size * 0.62} />
    </button>
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
      <ellipse cx="22" cy="30" rx="2.2" ry="1.4" fill="#ffd27a" opacity="0.35" />
    </svg>
  );
}
