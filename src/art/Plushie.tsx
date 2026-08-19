export type ToolId = "palito" | "sam" | "calcetin" | "pulpito" | "pelota" | "kissy" | "javiera" | "zapatitos" | "guyu" | "dixie" | "rodillo" | "batidora" | "sarten" | "cuchilla" | "sacabocados" | "delantal" | "guantes" | "gorro" | "mandil" | "tabla" | "propeler" | "cinturon" | "capa" | "linterna" | "iman" | "bolsa" | "termometro" | "escala" | "botas" | "zapatos" | "hueso" | "pico" | "casco";

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
  unlock?: "shop" | "secret";
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
  { id: "guyu",      name: "Guyu",          tag: "medallita · pelitos", desc: "Medallita circular neutra que cuida a Maxine. Aura de pelitos suaves que ralentiza el peligro y abre camino.", priceBread: 100, priceCrowns: 0, metaPrice: 9, speedMul: 1.35, wide: true, slowAura: true, color: "#e8e0c8" },
  { id: "dixie",     name: "Dixie",         tag: "medallita · mañosa",  desc: "Medallita circular neutra que protege a Maxine. Su berrinche dulce absorbe un golpe y reconforta al cavar.", priceBread: 120, priceCrowns: 0, metaPrice: 10, speedMul: 1.25, bounce: true, healOnDig: true, color: "#e8e0c8" },
  // V2 ofensivas/defensivas/movilidad/utilidad
  { id: "rodillo",   name: "Rodillo",       tag: "amasador",            desc: "Aplasta en línea recta. Cooldown 3s. Wide + 20% velocidad.",              priceBread: 60,  priceCrowns: 0, metaPrice: 6, speedMul: 1.2, wide: true, color: "#a87848" },
  { id: "batidora",  name: "Batidora",      tag: "remolino",            desc: "Crea remolino que empuja. SlowAura + Wide.",                             priceBread: 90,  priceCrowns: 0, metaPrice: 8, speedMul: 1.25, wide: true, slowAura: true, color: "#8a8aa8" },
  { id: "sarten",    name: "Sartén",        tag: "anti-grasa",          desc: "Rebota proyectiles. Bounce + 15% speed.",                                priceBread: 80,  priceCrowns: 0, metaPrice: 7, speedMul: 1.15, bounce: true, color: "#3a3a3a" },
  { id: "cuchilla",  name: "Cuchilla",      tag: "pizza",               desc: "Atraviesa enemigos. Reach 2 tiles.",                                      priceBread: 70,  priceCrowns: 0, metaPrice: 7, speedMul: 1.3, reach: true, color: "#d7d2c4" },
  { id: "sacabocados", name: "Sacabocados", tag: "gigante",             desc: "Crea agujeros temporales. Wide extremo.",                                 priceBread: 110, priceCrowns: 0, metaPrice: 9, speedMul: 1.2, wide: true, color: "#c9a86a" },
  { id: "delantal",  name: "Delantal",      tag: "reforzado",           desc: "Absorbe 2 golpes. Bounce + heal.",                                        priceBread: 100, priceCrowns: 0, metaPrice: 8, speedMul: 1.1, bounce: true, healOnDig: true, color: "#e3a35a" },
  { id: "guantes",   name: "Guantes Horno", tag: "ígneo",               desc: "Inmunidad a calor/lava. SpikeImmune.",                                    priceBread: 85,  priceCrowns: 0, metaPrice: 7, speedMul: 1.15, spikeImmune: true, color: "#ff7a2a" },
  { id: "gorro",     name: "Gorro Chef",    tag: "protector",           desc: "Protege de caídas. Bounce.",                                              priceBread: 75,  priceCrowns: 0, metaPrice: 6, speedMul: 1.1, bounce: true, color: "#fff" },
  { id: "mandil",    name: "Mandil",        tag: "anti-manchas",        desc: "Cura al quedarse quieto. HealOnDig.",                                     priceBread: 90,  priceCrowns: 0, metaPrice: 8, speedMul: 1.2, healOnDig: true, color: "#d7d2c4" },
  { id: "tabla",     name: "Tabla Flotar",  tag: "levitar",             desc: "Flotar tras salto. Yeast + 10% speed (simulado Wide).",                  priceBread: 95,  priceCrowns: 0, metaPrice: 9, speedMul: 1.25, wide: true, color: "#e8c9a0" },
  { id: "propeler",  name: "Propeler Masa", tag: "impulso",             desc: "Impulso vertical extra. Bounce + Wide.",                                  priceBread: 90,  priceCrowns: 0, metaPrice: 8, speedMul: 1.3, bounce: true, wide: true, color: "#ff7a2a" },
  { id: "cinturon",  name: "Cinturón Harina", tag: "seguridad",          desc: "Reduce daño de caída. Bounce.",                                           priceBread: 70,  priceCrowns: 0, metaPrice: 6, speedMul: 1.1, bounce: true, color: "#d7c9a0" },
  { id: "capa",      name: "Capa Azúcar",   tag: "desliz",              desc: "Deslizamiento aéreo prolongado. SlowAura suave.",                          priceBread: 85,  priceCrowns: 0, metaPrice: 7, speedMul: 1.2, slowAura: true, color: "#fff" },
  { id: "linterna",  name: "Linterna Miel", tag: "luz · fantasma",      desc: "Ilumina y repele fantasmas. Revela vulnerables.",                          priceBread: 100, priceCrowns: 0, metaPrice: 9, speedMul: 1.2, slowAura: true, color: "#ffd27a" },
  { id: "iman",      name: "Imán Galletas", tag: "atracción",           desc: "Atrae panes cercanos. Magnet + speed.",                                    priceBread: 95,  priceCrowns: 0, metaPrice: 8, speedMul: 1.25, slowAura: true, color: "#d44a6a" },
  { id: "bolsa",     name: "Bolsa Harina",  tag: "nube",                desc: "Nube que ciega enemigos. SlowAura amplia.",                               priceBread: 80,  priceCrowns: 0, metaPrice: 7, speedMul: 1.2, slowAura: true, color: "#fff" },
  { id: "termometro", name: "Termómetro",   tag: "revela",              desc: "Revela tiles débiles. HealOnDig + Wide.",                                 priceBread: 75,  priceCrowns: 0, metaPrice: 6, speedMul: 1.15, wide: true, healOnDig: true, color: "#7fd0ff" },
  { id: "escala",    name: "Escala Caramelo", tag: "trepar",            desc: "Escala pared temporal. Reach.",                                            priceBread: 85,  priceCrowns: 0, metaPrice: 7, speedMul: 1.2, reach: true, color: "#ff8fb6" },
  { id: "botas",     name: "Botas Antides.", tag: "antidesliz",          desc: "Previene resbalón en hielo/masa. SpikeImmune.",                           priceBread: 80,  priceCrowns: 0, metaPrice: 6, speedMul: 1.1, spikeImmune: true, color: "#5a3410" },
  { id: "zapatos",   name: "Zapatos Levadura", tag: "doble salto+",      desc: "Doble salto mejorado con levadura. Bounce + speed.",                       priceBread: 90,  priceCrowns: 0, metaPrice: 8, speedMul: 1.3, bounce: true, color: "#a8e880" },
  { id: "hueso",     name: "Hueso enterrado", tag: "secreto · patio",   desc: "Desenterrado en el campo. Alcance de dos tiles y olor a patio.",           priceBread: 0, priceCrowns: 0, metaPrice: 0, speedMul: 1.4, reach: true, unlock: "secret", color: "#f4efe0" },
  { id: "pico",      name: "Pico oxidado",    tag: "secreto · mina",    desc: "Rompe piedra de un golpe. Lo escondió un albañil de hojaldre.",            priceBread: 0, priceCrowns: 0, metaPrice: 0, speedMul: 1.55, wide: true, unlock: "secret", color: "#8a8a8a" },
  { id: "casco",     name: "Casco de obra",   tag: "secreto · gruta",   desc: "Amarillo de yema. Absorbe un golpe y cava más seguro.",                    priceBread: 0, priceCrowns: 0, metaPrice: 0, speedMul: 1.2, bounce: true, unlock: "secret", color: "#ffd027" },

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
    case "guyu":
      return (
        <g>
          {/* Guyu — medallita circular neutra sin cara ni color, que cuida a Maxine */}
          {/* medallón base — sin color vivo, tono hueso/niebla */}
          <circle cx="16" cy="16" r="13" fill="#fdfbf3" stroke="#c9bda8" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="11.2" fill="none" stroke="#e8e0c8" strokeWidth="1" />
          <circle cx="16" cy="16" r="9.6" fill="none" stroke="#d7cdb8" strokeWidth="0.7" strokeDasharray="1.2 1.8" opacity="0.7" />
          {/* anilla superior */}
          <circle cx="16" cy="4.2" r="2" fill="none" stroke="#c9bda8" strokeWidth="1.2" />
          <circle cx="16" cy="4.2" r="0.9" fill="#e8e0c8" stroke="#c9bda8" strokeWidth="0.6" />
          {/* grabado central minimalista: pelitos suaves (tres líneas curvas) + huellita tenue */}
          <g stroke="#b8ad98" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.95">
            <path d="M11.5 14 q2 1.2 4 0" />
            <path d="M10.5 16.2 q2 1.4 4.5 0" />
            <path d="M11.8 18.4 q1.8 1 3.8 0" />
          </g>
          <g fill="#b8ad98" opacity="0.9">
            <circle cx="20.2" cy="16" r="1.3" />
            <circle cx="18.6" cy="13.6" r="0.7" />
            <circle cx="21.6" cy="13.7" r="0.7" />
            <circle cx="19.2" cy="18.6" r="0.7" />
            <circle cx="21.8" cy="18" r="0.6" />
          </g>
          {/* brillo sutil */}
          <ellipse cx="13.5" cy="11" rx="1.6" ry="0.9" fill="#fff" opacity="0.55" />
          <circle cx="20.2" cy="10.2" r="0.5" fill="#fff" opacity="0.45" />
        </g>
      );
    case "dixie":
      return (
        <g>
          {/* Dixie — medallita circular neutra sin cara ni color, que protege a Maxine */}
          <circle cx="16" cy="16" r="13" fill="#fdfbf3" stroke="#c9bda8" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="11.2" fill="none" stroke="#e8e0c8" strokeWidth="1" />
          <circle cx="16" cy="16" r="9.6" fill="none" stroke="#d7cdb8" strokeWidth="0.7" strokeDasharray="1.2 1.8" opacity="0.7" />
          <circle cx="16" cy="4.2" r="2" fill="none" stroke="#c9bda8" strokeWidth="1.2" />
          <circle cx="16" cy="4.2" r="0.9" fill="#e8e0c8" stroke="#c9bda8" strokeWidth="0.6" />
          {/* grabado central: corazón hueco minimal + onda mañosa */}
          <g fill="none" stroke="#b8ad98" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            <path d="M16 13.6 c-1.1 -1 -2.6 -1 -3.2 0.4 c-0.6 1.3 1 2.9 3.2 4.1 c2.2 -1.2 3.8 -2.8 3.2 -4.1 c-0.6 -1.4 -2.1 -1.4 -3.2 -0.4 Z" />
            <path d="M10.8 18.6 q1.2 0.7 2.4 0 q1.2 -0.7 2.4 0 q1.2 0.7 2.4 0 q1.2 -0.7 2.4 0" />
          </g>
          {/* puntitos grabado */}
          <circle cx="12.2" cy="15.2" r="0.5" fill="#b8ad98" opacity="0.8" /><circle cx="19.8" cy="15.2" r="0.5" fill="#b8ad98" opacity="0.8" />
          <ellipse cx="13.6" cy="11.1" rx="1.5" ry="0.85" fill="#fff" opacity="0.5" />
        </g>
      );
    case "rodillo":
      return (<g><rect x="6" y="12" width="20" height="8" rx="4" fill="#a87848" stroke="#5a3510" strokeWidth="1"/><rect x="4" y="14" width="3" height="4" rx="1" fill="#5a3510"/><rect x="25" y="14" width="3" height="4" rx="1" fill="#5a3510"/></g>);
    case "batidora":
      return (<g><rect x="12" y="4" width="8" height="14" rx="3" fill="#8a8aa8" stroke="#3a3a6a" strokeWidth="1"/><circle cx="16" cy="22" r="6" fill="none" stroke="#d7d2c4" strokeWidth="1.2"/><path d="M16 22 q-3 3 -6 0" stroke="#d7d2c4" strokeWidth="0.8" fill="none"/></g>);
    case "sarten":
      return (<g><circle cx="16" cy="14" r="8" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1"/><rect x="16" y="12" width="10" height="3" rx="1" fill="#5a3a1a"/><circle cx="13" cy="12" r="1" fill="#fff" opacity="0.6"/></g>);
    case "cuchilla":
      return (<g><circle cx="16" cy="16" r="9" fill="none" stroke="#d7d2c4" strokeWidth="2"/><circle cx="16" cy="16" r="2" fill="#3a3a3a"/><path d="M16 7 l0 18 M7 16 l18 0" stroke="#d7d2c4" strokeWidth="0.8"/></g>);
    case "sacabocados":
      return (<g><rect x="10" y="6" width="12" height="12" rx="6" fill="#c9a86a" stroke="#7a5a2a" strokeWidth="1"/><circle cx="16" cy="12" r="4" fill="#fff" stroke="#7a5a2a" strokeWidth="0.8"/><rect x="14" y="18" width="4" height="8" rx="1" fill="#7a5a2a"/></g>);
    case "delantal":
      return (<g><path d="M10 8 Q16 6 22 8 L24 26 Q16 28 8 26 Z" fill="#e3a35a" stroke="#7a4a1a" strokeWidth="1"/><rect x="14" y="10" width="4" height="3" fill="#fff"/><path d="M10 8 L10 6 L22 6 L22 8" stroke="#7a4a1a" strokeWidth="0.8" fill="none"/></g>);
    case "guantes":
      return (<g><path d="M10 14 Q10 8 14 8 H18 Q22 8 22 14 V22 H10 Z" fill="#ff7a2a" stroke="#7a1410" strokeWidth="1"/><circle cx="15" cy="12" r="1" fill="#fff"/><circle cx="17" cy="14" r="0.8" fill="#fff"/></g>);
    case "gorro":
      return (<g><path d="M8 16 Q16 4 24 16 L24 22 L8 22 Z" fill="#fff" stroke="#7a8aa8" strokeWidth="1"/><rect x="8" y="16" width="16" height="3" fill="#d7d2c4"/></g>);
    case "mandil":
      return (<g><path d="M12 8 Q16 6 20 8 L20 24 Q16 26 12 24 Z" fill="#d7d2c4" stroke="#7a6a5a" strokeWidth="1"/><circle cx="16" cy="12" r="1.2" fill="#ff8fa0"/></g>);
    case "tabla":
      return (<g><rect x="8" y="14" width="16" height="6" rx="3" fill="#e8c9a0" stroke="#7a5a2c" strokeWidth="1"/><path d="M12 17 q4 -2 8 0" stroke="#7a5a2c" strokeWidth="0.6" fill="none"/></g>);
    case "propeler":
      return (<g><circle cx="16" cy="14" r="6" fill="#ff7a2a" stroke="#7a1410" strokeWidth="1"/><path d="M16 8 v12 M10 14 h12" stroke="#fff" strokeWidth="1.2"/><circle cx="16" cy="14" r="2" fill="#fff"/></g>);
    case "cinturon":
      return (<g><rect x="6" y="14" width="20" height="6" rx="2" fill="#d7c9a0" stroke="#7a5a2c" strokeWidth="1"/><rect x="12" y="12" width="8" height="10" rx="1" fill="#c9a86a" stroke="#7a5a2c" strokeWidth="0.8"/><circle cx="16" cy="17" r="1" fill="#fff"/></g>);
    case "capa":
      return (<g><path d="M8 10 L24 10 L22 24 L10 24 Z" fill="#fff" stroke="#d7d2c4" strokeWidth="1"/><path d="M12 14 q4 -1 8 0" stroke="#d7d2c4" strokeWidth="0.6" fill="none"/></g>);
    case "linterna":
      return (<g><rect x="12" y="8" width="8" height="12" rx="2" fill="#ffd27a" stroke="#7a5a0a" strokeWidth="1"/><circle cx="16" cy="22" r="4" fill="#fff" stroke="#7a5a0a" strokeWidth="0.8"/><path d="M16 6 v2" stroke="#7a5a0a" strokeWidth="1.2"/></g>);
    case "iman":
      return (<g><path d="M8 10 v8 a8 8 0 0 0 16 0 v-8 h-4 v8 a4 4 0 0 1 -8 0 v-8 Z" fill="#d44a6a" stroke="#7a1020" strokeWidth="1"/><rect x="8" y="8" width="4" height="3" fill="#d7d2c4"/><rect x="20" y="8" width="4" height="3" fill="#d7d2c4"/></g>);
    case "bolsa":
      return (<g><path d="M8 14 Q8 10 12 10 H20 Q24 10 24 14 L20 22 H12 Z" fill="#fff" stroke="#7a6a5a" strokeWidth="1"/><path d="M12 10 Q16 6 20 10" stroke="#7a6a5a" strokeWidth="0.8" fill="none"/><circle cx="16" cy="16" r="1" fill="#d7c9a0"/></g>);
    case "termometro":
      return (<g><rect x="14" y="6" width="4" height="14" rx="2" fill="#7fd0ff" stroke="#1a5a8a" strokeWidth="1"/><circle cx="16" cy="22" r="4" fill="#ff5a5a" stroke="#7a1410" strokeWidth="0.8"/><rect x="15" y="10" width="2" height="6" fill="#fff"/></g>);
    case "escala":
      return (<g><rect x="10" y="8" width="3" height="16" rx="1" fill="#8a5a2c"/><rect x="19" y="8" width="3" height="16" rx="1" fill="#8a5a2c"/><rect x="10" y="12" width="12" height="2" rx="1" fill="#c9a86a"/><rect x="10" y="18" width="12" height="2" rx="1" fill="#c9a86a"/></g>);
    case "botas":
      return (<g><path d="M8 18 Q8 12 12 12 H20 Q22 12 22 16 V22 H8 Z" fill="#5a3410" stroke="#1a0c04" strokeWidth="1"/><path d="M8 20 H22 V22 H8 Z" fill="#0a0402"/></g>);
    case "zapatos":
      return (<g><path d="M8 16 Q8 12 12 12 H20 Q22 12 22 16 V20 H8 Z" fill="#a8e880" stroke="#2a5a10" strokeWidth="1"/><circle cx="14" cy="15" r="0.7" fill="#fff"/><circle cx="17" cy="15" r="0.7" fill="#fff"/></g>);
    case "hueso":
      return (<g><path d="M8 12 q-3 -3 0 -6 q3 -1 4 2 l10 10 q2 3 -2 4 q-3 1 -4 -2 Z" fill="#f4efe0" stroke="#8a7a60" strokeWidth="1"/><circle cx="8" cy="8" r="3" fill="#f4efe0" stroke="#8a7a60" strokeWidth="0.8"/><circle cx="6" cy="12" r="2.4" fill="#f4efe0" stroke="#8a7a60" strokeWidth="0.8"/><circle cx="24" cy="22" r="3" fill="#f4efe0" stroke="#8a7a60" strokeWidth="0.8"/><circle cx="22" cy="26" r="2.4" fill="#f4efe0" stroke="#8a7a60" strokeWidth="0.8"/></g>);
    case "pico":
      return (<g><rect x="14" y="10" width="4" height="16" rx="1" fill="#6a4020"/><path d="M6 12 L16 6 L26 12 L16 16 Z" fill="#8a8a8a" stroke="#3a3a3a" strokeWidth="1"/><path d="M8 12 L16 8 L24 12" stroke="#c9c9c9" strokeWidth="0.8" fill="none"/></g>);
    case "casco":
      return (<g><path d="M8 18 Q8 8 16 6 Q24 8 24 18 Z" fill="#ffd027" stroke="#8a6a00" strokeWidth="1"/><rect x="6" y="17" width="20" height="4" rx="1" fill="#e8b820" stroke="#8a6a00" strokeWidth="0.8"/><rect x="14" y="10" width="4" height="6" fill="#fff" opacity="0.5"/></g>);
  }
}
