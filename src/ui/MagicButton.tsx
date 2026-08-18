import type { SpellId } from "../data/spells";
import { SPELL_MAP } from "../data/spells";

interface Props {
  spell: SpellId | null;
  locked?: boolean;
  onCycle: () => void;
}

/** Botón de magia: icono de varita, sin emoji. Cada toque cambia el hechizo. */
export default function MagicButton({ spell, locked, onCycle }: Props) {
  const color = spell ? SPELL_MAP[spell].color : "#6a5a4a";
  return (
    <button
      type="button"
      aria-label={spell ? `Magia: ${SPELL_MAP[spell].name}` : "Magia"}
      className="btn-3d rounded-xl border-2 border-b-4 flex flex-col items-center justify-center"
      style={{
        position: "absolute",
        zIndex: 90,
        width: 58,
        height: 64,
        left: 12,
        bottom: 78,
        background: locked ? "#3a2010" : `linear-gradient(180deg, ${color}, #2a1408)`,
        borderColor: "#1a0c04",
        boxShadow: "0 5px 0 #1a0c04, 0 8px 14px #0007",
        opacity: locked ? 0.55 : 1,
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!locked) onCycle();
      }}
    >
      <WandIcon color={spell ? "#fff3d6" : "#8a7a6a"} />
      <span className="font-display font-bold text-[9px] leading-none mt-0.5" style={{ color: "#fff3d6" }}>
        {locked || !spell ? "—" : SPELL_MAP[spell].name}
      </span>
    </button>
  );
}

export function WandIcon({ color = "#fff3d6", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M7 27 L20 8" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 6 l3 2 l-2 3" fill={color} />
      <path d="M22 5 l2 0 M23 3 l0 2 M26 8 l2 0 M27 6 l0 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="23" cy="7" r="1.2" fill={color} />
    </svg>
  );
}
