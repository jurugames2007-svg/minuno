export type ToolId = "palito" | "sam" | "calcetin" | "pulpito" | "pelota" | "kissy" | "javiera" | "zapatitos";

export interface ToolDef {
  id: ToolId;
  name: string;
  tag: string;
  desc: string;
  priceBread: number;   // run currency (rest stop)
  priceCrowns: number;  // run premium currency (rest stop, 0 = bread only)
  metaPrice: number;    // permanent unlock in the bakery menu (meta crowns)
  speedMul: number;     // dig speed multiplier
  wide?: boolean;       // also break left+right when digging down
  reach?: boolean;      // can break 2 tiles ahead horizontally
  slowAura?: boolean;   // enemies near player move slower
  bounce?: boolean;     // survive one fatal fall / spike
  healOnDig?: boolean;  // small chance to heal when breaking
  spikeImmune?: boolean;// walk over spikes safely, breaking them
  footwear?: boolean;   // drawn on Maxine's feet instead of in her mouth
  color: string;
}

export function toolRank(t: ToolDef): "Gratis" | "Común" | "Raro" | "Épico" | "Legendario" {
  if (t.metaPrice <= 0) return "Gratis";
  if (t.metaPrice <= 4) return "Común";
  if (t.metaPrice <= 7) return "Raro";
  if (t.metaPrice <= 11) return "Épico";
  return "Legendario";
}
export const RANK_COLOR: Record<ReturnType<typeof toolRank>, string> = {
  "Gratis": "#cfe8a8",
  "Común": "#cfe8a8",
  "Raro": "#7fd0ff",
  "Épico": "#d9a6ff",
  "Legendario": "#ffd27a",
};

export const TOOLS: ToolDef[] = [
  { id: "palito",    name: "Palito",        tag: "de calle",            desc: "Humilde. Leal. Rompe lo justo.",                                       priceBread: 0,   priceCrowns: 0, metaPrice: 0,  speedMul: 1.0,  color: "#8a5a2c" },
  { id: "sam",       name: "Sam",           tag: "oso de peluche",      desc: "Oso marrón con parche. Cavado +25%.",                                  priceBread: 40,  priceCrowns: 0, metaPrice: 3,  speedMul: 1.25, color: "#a87848" },
  { id: "calcetin",  name: "Calcetín",      tag: "rayado y sospechoso", desc: "Rompe también el tile de al lado. Huele raro.",                        priceBread: 70,  priceCrowns: 0, metaPrice: 5,  speedMul: 1.15, wide: true, color: "#e23b3b" },
  { id: "pulpito",   name: "Pulpito",       tag: "de tela negra",       desc: "Tentáculos negros. Ralentiza enemigos cercanos.",                      priceBread: 90,  priceCrowns: 0, metaPrice: 7,  speedMul: 1.3,  slowAura: true, color: "#1a1a1a" },
  { id: "pelota",    name: "Pelota",        tag: "de tenis mordida",    desc: "Te salva de una caída o pincho mortal. Un solo uso por run.",          priceBread: 110, priceCrowns: 0, metaPrice: 8,  speedMul: 1.2,  bounce: true, color: "#d4e84a" },
  { id: "kissy",     name: "Kissy Missy",   tag: "peluche rosa",        desc: "Brazos largos: cava 2 tiles de alcance horizontal.",                   priceBread: 140, priceCrowns: 0, metaPrice: 11, speedMul: 1.45, reach: true, color: "#ff7fb0" },
  { id: "javiera",   name: "Javiera",       tag: "matrona · scrubs rojos", desc: "Gatita naranja con uniforme de matrona chilena. Cavado +80% y cura al romper.", priceBread: 0, priceCrowns: 6, metaPrice: 15, speedMul: 1.8, healOnDig: true, color: "#e23b3b" },
  { id: "zapatitos", name: "Zapatitos",     tag: "de lona roja",          desc: "Zapatillas de lona con suela gruesa. Caminas sobre pinchos sin pincharte.", priceBread: 80, priceCrowns: 0, metaPrice: 6, speedMul: 1.1, spikeImmune: true, footwear: true, color: "#e23b3b" },
];

export const TOOL_MAP: Record<ToolId, ToolDef> = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, ToolDef>;

/* ---------------------------------------------------------------- */
/*  Plushie SVGs — drawn at the puppy's mouth while digging.         */
/* ---------------------------------------------------------------- */
export function Plushie({ id, size = 26, flip = 1 }: { id: ToolId; size?: number; flip?: 1 | -1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ transform: `scaleX(${flip})`, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.4))" }}>
      {renderPlush(id)}
    </svg>
  );
}

function renderPlush(id: ToolId) {
  switch (id) {
    case "palito":
      return (
        <g>
          <path d="M4 24 L26 8" stroke="#6a4020" strokeWidth="3" strokeLinecap="round" />
          <path d="M4 24 L26 8" stroke="#a87848" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M18 14 l4 -2 M12 18 l3 -1" stroke="#3a2010" strokeWidth="1" strokeLinecap="round" />
          <circle cx="26" cy="8" r="1.6" fill="#3a2010" />
        </g>
      );
    case "sam":
      return (
        <g>
          {/* ears */}
          <circle cx="10" cy="9" r="3.4" fill="#8a5a30" stroke="#3a2010" strokeWidth="0.8" />
          <circle cx="22" cy="9" r="3.4" fill="#8a5a30" stroke="#3a2010" strokeWidth="0.8" />
          <circle cx="10" cy="9" r="1.6" fill="#d4a070" />
          <circle cx="22" cy="9" r="1.6" fill="#d4a070" />
          {/* head */}
          <circle cx="16" cy="15" r="8" fill="#b07a48" stroke="#3a2010" strokeWidth="1" />
          <ellipse cx="16" cy="18" rx="4" ry="3" fill="#e8c89a" />
          {/* patch over eye */}
          <circle cx="12" cy="13" r="2.4" fill="#5a3a1a" />
          <circle cx="12" cy="13" r="0.9" fill="#1a0a04" />
          <circle cx="20" cy="13" r="1.1" fill="#1a0a04" />
          <circle cx="16" cy="17" r="1.1" fill="#1a0a04" />
          {/* seam */}
          <path d="M16 9 v14" stroke="#3a2010" strokeWidth="0.5" strokeDasharray="1 1" />
          <path d="M13 20 q3 2 6 0" stroke="#3a2010" strokeWidth="0.8" fill="none" />
          {/* body hint */}
          <path d="M10 22 q6 4 12 0 l-2 6 h-8 Z" fill="#a06a3c" stroke="#3a2010" strokeWidth="0.8" />
        </g>
      );
    case "calcetin":
      return (
        <g>
          <path d="M12 4 h8 v14 q0 4 4 6 q4 2 4 6 q0 2 -3 2 h-10 q-3 0 -3 -3 v-25 Z" fill="#fff" stroke="#3a2010" strokeWidth="1" />
          <path d="M12 8 h8 M12 12 h8 M12 16 h8" stroke="#e23b3b" strokeWidth="2" />
          <path d="M20 22 q4 2 4 6 q0 2 -3 2 h-6" fill="#e23b3b" stroke="#3a2010" strokeWidth="1" />
          <path d="M12 4 h8 v2 h-8 Z" fill="#e23b3b" />
        </g>
      );
    case "pulpito":
      return (
        <g>
          <ellipse cx="16" cy="14" rx="10" ry="9" fill="#141414" stroke="#000" strokeWidth="0.8" />
          <ellipse cx="14" cy="10" rx="3" ry="2" fill="#fff" opacity="0.25" />
          {/* tentacles */}
          <path d="M8 20 q-2 6 -1 10" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M13 22 q-1 6 0 10" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M19 22 q1 6 0 10" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24 20 q2 6 1 10" stroke="#141414" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* eyes */}
          <circle cx="12" cy="13" r="2.4" fill="#fff" />
          <circle cx="20" cy="13" r="2.4" fill="#fff" />
          <circle cx="12.4" cy="13.4" r="1.2" fill="#000" />
          <circle cx="20.4" cy="13.4" r="1.2" fill="#000" />
          <path d="M14 18 q2 1.5 4 0" stroke="#ff5fa0" strokeWidth="1" fill="none" />
        </g>
      );
    case "pelota":
      return (
        <g>
          <circle cx="16" cy="16" r="11" fill="#d4e84a" stroke="#6a7a10" strokeWidth="1.2" />
          <path d="M6 12 q10 4 20 0" stroke="#fff" strokeWidth="1.6" fill="none" />
          <path d="M6 20 q10 -4 20 0" stroke="#fff" strokeWidth="1.6" fill="none" />
          <ellipse cx="12" cy="11" rx="2.5" ry="1.4" fill="#fff" opacity="0.55" />
          {/* bite mark */}
          <path d="M22 22 q2 -2 4 0 q-2 2 -4 0 Z" fill="#6a7a10" />
        </g>
      );
    case "kissy":
      return (
        <g>
          {/* long arms */}
          <path d="M8 14 q-6 4 -4 12" stroke="#ff7fb0" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24 14 q6 4 4 12" stroke="#ff7fb0" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="4" cy="26" r="2.4" fill="#ffe066" />
          <circle cx="28" cy="26" r="2.4" fill="#ffe066" />
          {/* head */}
          <circle cx="16" cy="14" r="8" fill="#ff9ec4" stroke="#b02a66" strokeWidth="1" />
          <circle cx="13" cy="13" r="1.4" fill="#1a0a04" />
          <circle cx="19" cy="13" r="1.4" fill="#1a0a04" />
          <path d="M12 17 q4 4 8 0 q-1 3 -4 3 q-3 0 -4 -3 Z" fill="#7a1430" />
          <path d="M13 18 l1 1 M19 18 l-1 1" stroke="#fff" strokeWidth="0.8" />
        </g>
      );
    case "zapatitos":
      return (
        <g>
          {/* left shoe */}
          <g transform="translate(2 14)">
            <path d="M2 8 Q2 2 8 2 H14 Q18 2 18 6 V10 H22 Q24 10 24 12 V14 H2 Z" fill="#e23b3b" stroke="#5a0808" strokeWidth="1" />
            <path d="M2 12 H24 V14 H2 Z" fill="#fff" />
            <circle cx="10" cy="6" r="0.9" fill="#fff" /><circle cx="13" cy="6" r="0.9" fill="#fff" />
            <path d="M8 4 l4 2 M8 7 l4 2" stroke="#fff" strokeWidth="0.6" />
          </g>
          {/* right shoe */}
          <g transform="translate(8 18)">
            <path d="M2 8 Q2 2 8 2 H14 Q18 2 18 6 V10 H22 Q24 10 24 12 V14 H2 Z" fill="#d41430" stroke="#5a0808" strokeWidth="1" />
            <path d="M2 12 H24 V14 H2 Z" fill="#fff" />
            <circle cx="10" cy="6" r="0.9" fill="#fff" /><circle cx="13" cy="6" r="0.9" fill="#fff" />
            <path d="M8 4 l4 2 M8 7 l4 2" stroke="#fff" strokeWidth="0.6" />
          </g>
        </g>
      );
    case "javiera":
      return (
        <g>
          {/* tail */}
          <path d="M24 22 q6 -2 4 -8" stroke="#e88a3a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* body in red scrubs — wrap-style V neck like Chilean matrona uniform */}
          <path d="M9 16 Q16 12 23 16 L24 28 Q16 30 8 28 Z" fill="#d41a1a" stroke="#7a0808" strokeWidth="0.9" />
          {/* V crossover collar */}
          <path d="M11 16 L16 22 L21 16 L19 16 L16 20 L13 16 Z" fill="#b01010" />
          <path d="M11 16 L16 22 L21 16" fill="none" stroke="#7a0808" strokeWidth="0.8" />
          {/* chest pocket with tiny white cross */}
          <rect x="17" y="19" width="4" height="3.4" rx="0.4" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          <path d="M19 19.6 v2.2 M18 20.7 h2" stroke="#fff" strokeWidth="0.6" />
          {/* lower pockets */}
          <rect x="10" y="24" width="5" height="3.4" rx="0.4" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          <rect x="17" y="24" width="5" height="3.4" rx="0.4" fill="#b01010" stroke="#7a0808" strokeWidth="0.4" />
          {/* stethoscope */}
          <path d="M12 16 q-2 6 4 7 q6 -1 4 -7" fill="none" stroke="#2a2a2a" strokeWidth="0.9" />
          <circle cx="16" cy="23.5" r="1.4" fill="#d7d2c4" stroke="#2a2a2a" strokeWidth="0.5" />
          {/* head — orange cat */}
          <circle cx="16" cy="10" r="6" fill="#f0902e" stroke="#7a3a08" strokeWidth="0.9" />
          {/* ears */}
          <path d="M11 6 l-1 -4 l4 2 Z" fill="#f0902e" stroke="#7a3a08" strokeWidth="0.7" />
          <path d="M21 6 l1 -4 l-4 2 Z" fill="#f0902e" stroke="#7a3a08" strokeWidth="0.7" />
          <path d="M11 5 l-0.5 -2 l2 1 Z" fill="#ff8fa0" />
          <path d="M21 5 l0.5 -2 l-2 1 Z" fill="#ff8fa0" />
          {/* stripes */}
          <path d="M13 5 l0 2 M16 4 l0 2 M19 5 l0 2" stroke="#b0580a" strokeWidth="0.6" />
          {/* white muzzle */}
          <ellipse cx="16" cy="12" rx="3" ry="2" fill="#fff3d6" />
          {/* happy closed eyes */}
          <path d="M12.5 10 q1 -1.4 2 0" stroke="#1a0a04" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <path d="M17.5 10 q1 -1.4 2 0" stroke="#1a0a04" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          {/* nose + smile */}
          <path d="M15.4 11.4 h1.2 l-0.6 0.8 Z" fill="#ff5fa0" />
          <path d="M16 12.2 v0.8 M16 13 q-1 0.6 -2 0 M16 13 q1 0.6 2 0" stroke="#1a0a04" strokeWidth="0.5" fill="none" />
          {/* whiskers */}
          <path d="M10 11 l-3 -0.5 M10 12 l-3 0.5 M22 11 l3 -0.5 M22 12 l3 0.5" stroke="#fff" strokeWidth="0.4" />
          {/* matrona cap */}
          <path d="M11 4 q5 -3 10 0 l-1 2 q-4 -1.5 -8 0 Z" fill="#fff" stroke="#b0b0b0" strokeWidth="0.5" />
          <path d="M15 3 h2 v1.5 h-1.5 v1 h-1 v-1 h-0.5 Z" fill="#d41a1a" />
        </g>
      );
  }
}
