import type { CSSProperties, ReactNode } from "react";

/** Botón 32-bit estilo Mega Man X: bisel metálico, highlight cian. */
export default function ChromeBtn({
  children, onPress, w = 60, h = 60, accent = "#3ec8ff", dim,
}: {
  children: ReactNode;
  onPress: () => void;
  w?: number;
  h?: number;
  accent?: string;
  dim?: boolean;
}) {
  const style: CSSProperties = {
    width: w,
    height: h,
    background: `linear-gradient(180deg,#4a6280 0%,#243044 42%,#141c28 100%)`,
    border: "2px solid #0a1018",
    boxShadow: `inset 0 2px 0 #8ab4d0, inset 0 -3px 0 #0a1018, 0 3px 0 #070b10, 0 0 0 1px ${accent}55`,
    color: "#e8f4ff",
    opacity: dim ? 0.45 : 0.88,
    textShadow: "0 1px 0 #000",
  };
  return (
    <button type="button" onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className="font-pixel text-[8px] flex items-center justify-center"
      style={style}>
      {children}
    </button>
  );
}
