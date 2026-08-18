import type { SkinId } from "../data/skins";

export type Pose = "idle" | "dig" | "fall" | "hurt" | "win" | "dead";

interface Props { skin?: SkinId; pose?: Pose; facing?: 1 | -1; size?: number; className?: string; animate?: boolean; }

interface Pal { main: string; light: string; dark: string; darkR: string; cream: string; creamSh: string; earIn: string; outline: string; nose: string; }
const BASE: Pal = { main: "#e3c79a", light: "#f6e4bf", dark: "#b8956a", darkR: "#8a6a44", cream: "#fff1d0", creamSh: "#ecd2a0", earIn: "#9a7048", outline: "#6a4420", nose: "#1a0e08" };
function palette(skin: SkinId): Pal {
  if (skin === "kissy") return { main: "#ff8fb6", light: "#ffc0d8", dark: "#d65a88", darkR: "#a83a66", cream: "#ffd0e2", creamSh: "#f0a0c0", earIn: "#ff5fa0", outline: "#b02a66", nose: "#1a0e08" };
  if (skin === "pochacco") return { main: "#ffffff", light: "#ffffff", dark: "#d8d8d8", darkR: "#9a9a9a", cream: "#ffffff", creamSh: "#e4e4e4", earIn: "#1a1a1a", outline: "#555555", nose: "#1a0e08" };
  if (skin === "mahoraga") return { main: "#f4f1e6", light: "#ffffff", dark: "#c9c2ae", darkR: "#8a8270", cream: "#ffffff", creamSh: "#d8d2c0", earIn: "#c9c2ae", outline: "#555555", nose: "#1a0e08" };
  if (skin === "yarnaby") return { main: "#ff9d2e", light: "#ffb86a", dark: "#d96a1a", darkR: "#8a3a0a", cream: "#fff1d0", creamSh: "#ffd9a0", earIn: "#d96a1a", outline: "#6a2a00", nose: "#1a0e08" };
  if (skin === "huggy") return { main: "#7fd0ff", light: "#a8e4ff", dark: "#3a8ac0", darkR: "#1a4a70", cream: "#d8f4ff", creamSh: "#a0cce8", earIn: "#1a4a70", outline: "#1a3a5a", nose: "#1a0e08" };
  if (skin === "catnap") return { main: "#b06bff", light: "#d9a6ff", dark: "#7a3ab0", darkR: "#4a1a70", cream: "#e9d5ff", creamSh: "#c9a6e8", earIn: "#7a3ab0", outline: "#3a1a5a", nose: "#1a0e08" };
  if (skin === "gojo") return { main: "#e8f1ff", light: "#ffffff", dark: "#b8c8e8", darkR: "#7a8ab0", cream: "#fff1d0", creamSh: "#e8d2b8", earIn: "#7a8ab0", outline: "#3a4a6a", nose: "#1a0e08" };
  if (skin === "sukuna") return { main: "#e3c79a", light: "#f6e4bf", dark: "#b8956a", darkR: "#8a6a44", cream: "#fff1d0", creamSh: "#ecd2a0", earIn: "#c93030", outline: "#6a4420", nose: "#1a0e08" };
  if (skin === "draculaura") return { main: "#ff8fb6", light: "#ffc0d8", dark: "#d65a88", darkR: "#a83a66", cream: "#ffd0e2", creamSh: "#f0a0c0", earIn: "#ff5fa0", outline: "#b02a66", nose: "#1a0e08" };
  return BASE; // default, vampire, santa, lime, harness, bow, yuta, princess, jockey, catto, frankie, etc
}

export default function Maxine({ skin = "default", pose = "idle", facing = 1, size = 120, className = "", animate = true }: Props) {
  const tailWag = animate && (pose === "idle" || pose === "win" || pose === "dig");
  const bodyBob = animate && pose === "idle";
  const hurt = pose === "hurt"; const dead = pose === "dead"; const win = pose === "win"; const dig = pose === "dig"; const fall = pose === "fall";
  const pal = palette(skin);
  const isKissy = skin === "kissy";
  const belly = isKissy ? "#ffd0e2" : pal.cream;

  const Wiry = ({ cx, cy, n = 6, r = 10, color }: { cx: number; cy: number; n?: number; r?: number; color?: string }) => (
    <g stroke={color || pal.darkR} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.85">
      {Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2 + (cx % 2); const x2 = cx + Math.cos(a) * r; const y2 = cy + Math.sin(a) * r; return <path key={i} d={`M${cx} ${cy} Q${(cx + x2) / 2 + (i % 2 ? 1 : -1)} ${(cy + y2) / 2} ${x2} ${y2}`} />; })}
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`${className} ${bodyBob ? "bob" : ""}`} style={{ overflow: "visible", filter: hurt ? "drop-shadow(0 0 6px #ff5a5a)" : undefined }}>
      <defs>
        <radialGradient id={`eye-${skin}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#6b3a18" /><stop offset="70%" stopColor="#2a1408" /><stop offset="100%" stopColor="#0a0402" />
        </radialGradient>
        <linearGradient id={`cape-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1024" /><stop offset="100%" stopColor="#3a1830" /></linearGradient>
        <linearGradient id={`fur-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={pal.light} /><stop offset="55%" stopColor={pal.main} /><stop offset="100%" stopColor={pal.dark} /></linearGradient>
      </defs>

      <g transform={facing === -1 ? "translate(100,0) scale(-1,1)" : undefined}>
      <g transform={dead ? "rotate(-18 50 72) translate(0 6)" : ""}>

        {/* vampire cape */}
        {skin === "vampire" && <g><path d="M22 48 Q14 78 26 92 L50 86 L74 92 Q86 78 78 48 Q66 56 50 56 Q34 56 22 48 Z" fill={`url(#cape-${skin})`} stroke="#0c0612" strokeWidth="1.2" /><path d="M26 52 Q22 76 30 88 L50 82 L70 88 Q78 76 74 52 Q64 60 50 60 Q36 60 26 52 Z" fill="#7a1430" opacity="0.85" /></g>}

        {/* yarnaby rainbow yarn mane — improved v2: thick yarn tubes with rounded caps */}
        {skin === "yarnaby" && <g>
          {Array.from({ length: 28 }).map((_, i) => { const a = (i / 28) * Math.PI * 2; const x = 50 + Math.cos(a) * 27; const y = 42 + Math.sin(a) * 27; const hue = (i / 28) * 360; const len = 22 + (i % 3) * 4; return <g key={i} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}><path d={`M${x} ${y} c-3 -9 -5 -16 0 -${len} c4 5 3 13 0 ${len} Z`} fill={`hsl(${hue} 85% 58%)`} stroke={`hsl(${hue} 78% 32%)`} strokeWidth="1.1" strokeLinecap="round" opacity="0.98" /><path d={`M${x} ${y+1} c-1.5 -6 -2 -10 0 -${len-4}`} fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.35" strokeLinecap="round" /></g>; })}
          {/* inner bright ring for volume */}
          <circle cx="50" cy="42" r="15" fill="none" stroke="#ff9d2e" strokeWidth="0.6" opacity="0.2" />
        </g>}

        {/* mahoraga halo wheel — v2 golden 3D dharmachakra rotates 3.5s */}
        {skin === "mahoraga" && (
          <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: animate ? "spin-slow 3.5s linear infinite" : undefined }}>
            <g transform="translate(50 6)">
              {/* outer golden ring with depth */}
              <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="#c9a86a" strokeWidth="3.2" />
              <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="#ffd27a" strokeWidth="1" opacity="0.6" />
              <ellipse cx="0" cy="0" rx="14" ry="4.2" fill="none" stroke="#8a6a2a" strokeWidth="1" opacity="0.5" />
              {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; const x = Math.cos(a) * 20; const y = Math.sin(a) * 6; return <g key={i}><line x1="0" y1="0" x2={x} y2={y} stroke="#8a6a2a" strokeWidth="2.2" /><line x1="0" y1="0" x2={x} y2={y} stroke="#ffd27a" strokeWidth="0.9" opacity="0.8" /><circle cx={x} cy={y} r="2.6" fill="#2a1a0a" stroke="#c9a86a" strokeWidth="0.9" /><circle cx={x} cy={y} r="1" fill="#ffd27a" /></g>; })}
              <circle cx="0" cy="0" r="4" fill="#2a1a0a" stroke="#c9a86a" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="2" fill="#ffd27a" />
              <circle cx="0" cy="-1" r="0.9" fill="#fff" opacity="0.7" />
            </g>
          </g>
        )}

        {/* TAIL */}
        <g className={tailWag ? "wag" : ""} style={{ transformOrigin: "72px 64px" }}>
          {skin === "mahoraga" ? (
            <g>
              <path d="M68 60 Q84 52 92 64 Q88 70 80 68 Q86 74 78 78 Q74 70 66 66 Z" fill="#c9c2ae" stroke="#555" strokeWidth="0.8" />
              <path d="M76 62 l8 4 M74 68 l8 4 M72 74 l6 4" stroke="#8a8270" strokeWidth="0.8" />
            </g>
          ) : skin === "pochacco" ? (
            <path d="M70 62 Q80 58 82 66 Q78 70 72 68 Z" fill="#1a1a1a" />
          ) : skin === "catto" ? (
            <path d="M68 64 Q86 58 90 40 Q92 34 88 32 Q86 40 82 46 Q84 38 80 36 Q78 48 70 58 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" />
          ) : (
            <g>
              <path d="M68 62 Q86 56 92 40 Q90 50 84 52 Q90 44 86 34 Q82 44 74 52 Q78 46 72 44 Q72 54 66 58 Z" fill={pal.dark} stroke={pal.outline} strokeWidth="0.8" />
              <Wiry cx={82} cy={44} n={5} r={5} />
              <path d="M88 38 Q92 34 92 40 Q90 44 86 44 Z" fill={pal.cream} />
            </g>
          )}
        </g>

        {/* BACK LEGS */}
        <g>
          <ellipse cx="38" cy="86" rx="7.5" ry="6.5" fill={pal.dark} />
          <ellipse cx="62" cy="86" rx="7.5" ry="6.5" fill={pal.dark} />
          <Wiry cx={38} cy={84} n={5} r={4} /><Wiry cx={62} cy={84} n={5} r={4} />
          <ellipse cx="37" cy="90" rx="4.5" ry="2.6" fill={isKissy ? "#ffe066" : pal.creamSh} />
          <ellipse cx="63" cy="90" rx="4.5" ry="2.6" fill={isKissy ? "#ffe066" : pal.creamSh} />
        </g>

        {/* BODY */}
        <g>
          <ellipse cx="50" cy="70" rx="22" ry="17" fill={`url(#fur-${skin})`} stroke={pal.outline} strokeWidth="1.2" />
          <ellipse cx="50" cy="74" rx="13" ry="10" fill={belly} />
          <g stroke={pal.darkR} strokeWidth="0.7" fill="none" opacity="0.6" strokeLinecap="round">
            <path d="M32 64 q3 -3 6 0" /><path d="M40 62 q3 -3 6 0" /><path d="M54 62 q3 -3 6 0" /><path d="M62 64 q3 -3 6 0" />
            <path d="M30 72 q3 -3 6 0" /><path d="M64 72 q3 -3 6 0" />
          </g>
        </g>

        {/* COSTUME: lime */}
        {skin === "lime" && <g><path d="M29 66 Q50 56 71 66 L70 82 Q50 90 30 82 Z" fill="#a8e85a" stroke="#4f7a1e" strokeWidth="1.3" /><path d="M29 66 Q50 56 71 66 L70 70 Q50 62 30 70 Z" fill="#c6ff7a" /><path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#7fc24a" stroke="#4f7a1e" strokeWidth="1" /></g>}
        {/* COSTUME: harness */}
        {skin === "harness" && <g stroke="#ff5fa0" strokeWidth="3.2" fill="none" strokeLinecap="round"><path d="M36 60 L44 84" /><path d="M64 60 L56 84" /><path d="M30 72 L70 72" /><circle cx="50" cy="72" r="3" fill="#ffd27a" stroke="#b8730a" strokeWidth="1" /></g>}
        {/* COSTUME: princess */}
        {skin === "princess" && <g><path d="M28 70 Q50 62 72 70 L76 86 Q68 84 64 88 Q58 84 52 88 Q46 84 40 88 Q34 84 28 88 Z" fill="#ffb3d1" stroke="#c93a78" strokeWidth="1.2" /><path d="M28 70 Q50 62 72 70 L70 74 Q50 68 30 74 Z" fill="#ffd9e6" /></g>}
        {/* COSTUME: santa */}
        {skin === "santa" && <g><path d="M28 64 Q50 56 72 64 L72 72 Q50 64 28 72 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1" /><path d="M28 70 Q50 62 72 70 L72 76 Q50 68 28 76 Z" fill="#fff" /></g>}
        {/* COSTUME: yuta — v2 white JJK uniform accurate */}
        {skin === "yuta" && <g>
          <path d="M30 62 Q50 55 70 62 L70 84 Q50 91 30 84 Z" fill="#ffffff" stroke="#b8c0cc" strokeWidth="1.2" />
          <path d="M30 62 Q50 60 70 62 L70 66 Q50 62 30 66 Z" fill="#e8ecf4" />
          {/* collar */}
          <path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#ffffff" stroke="#b8c0cc" strokeWidth="1" />
          <circle cx="48" cy="64" r="0.9" fill="#c9a86a" /><circle cx="52" cy="64" r="0.9" fill="#c9a86a" />
          {/* katana strap diagonal */}
          <path d="M32 62 L70 84" stroke="#2a2a2a" strokeWidth="3.2" strokeLinecap="round" />
          <rect x="34" y="62" width="6" height="3" rx="1" fill="#c9a86a" stroke="#7a5a2a" strokeWidth="0.6" />
        </g>}
        {/* COSTUME: pochacco magenta shirt — v2 with shading + collar */}
        {skin === "pochacco" && <g>
          <path d="M28 64 Q50 55 72 64 L72 84 Q50 91 28 84 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1.2" />
          <path d="M28 64 L19 71 L23 79 L30 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" />
          <path d="M72 64 L81 71 L77 79 L70 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" />
          <path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" />
          {/* highlight & collar */}
          <path d="M28 64 Q50 60 72 64 L71 68 Q50 63 29 68 Z" fill="#ff2d7a" opacity="0.9" />
          <path d="M44 60 Q50 64 56 60" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
          {/* Pochacco face charm dot on shirt */}
          <circle cx="50" cy="74" r="2.2" fill="#fff" opacity="0.0" />
        </g>}
        {/* COSTUME: mahoraga hakama + sash */}
        {skin === "mahoraga" && <g><path d="M28 74 L24 92 L40 90 L50 92 L60 90 L76 92 L72 74 Z" fill="#14181c" stroke="#000" strokeWidth="1" /><rect x="28" y="70" width="44" height="6" fill="#8a9498" stroke="#3a4044" strokeWidth="0.8" /><path d="M46 73 q-4 4 -2 8 q4 -2 6 -4 q2 2 6 4 q2 -4 -2 -8 Z" fill="#8a9498" stroke="#3a4044" strokeWidth="0.6" /><path d="M32 78 l0 10 M42 78 l0 12 M58 78 l0 12 M68 78 l0 10" stroke="#3a4044" strokeWidth="0.6" /></g>}
        {/* COSTUME: gojo — silver uniform */}
        {skin === "gojo" && <g><path d="M29 66 Q50 55 71 66 L70 84 Q50 91 30 84 Z" fill="#e8f1ff" stroke="#7a8ab0" strokeWidth="1.2"/><path d="M29 66 Q50 60 71 66 L71 68 Q50 63 29 68 Z" fill="#ffffff" opacity="0.8"/><circle cx="38" cy="72" r="1" fill="#7a8ab0"/><circle cx="62" cy="72" r="1" fill="#7a8ab0"/></g>}
        {/* COSTUME: nobara — brown coat red buttons hammer */}
        {skin === "nobara" && <g><path d="M28 66 Q50 55 72 66 L71 84 Q50 91 29 84 Z" fill="#6a3a1a" stroke="#3a2010" strokeWidth="1.2"/><path d="M34 70 h6 v6 h-6 Z" fill="#d44a6a" stroke="#5a1020" strokeWidth="0.7"/><path d="M60 70 h6 v6 h-6 Z" fill="#d44a6a" stroke="#5a1020" strokeWidth="0.7"/><rect x="44" y="73" width="12" height="3" fill="#c9a86a"/></g>}
        {/* COSTUME: megumi — black uniform with dog shadow */}
        {skin === "megumi" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#1a1a2e" stroke="#0a0a1a" strokeWidth="1.2"/><path d="M44 72 Q50 76 56 72" stroke="#7a8ab0" strokeWidth="0.8" fill="none"/><circle cx="50" cy="76" r="1.5" fill="#7a8ab0"/></g>}
        {/* COSTUME: sukuna — kimono open with tattoos */}
        {skin === "sukuna" && <g><path d="M28 66 Q50 55 72 66 L72 84 Q50 91 28 84 Z" fill="#c93030" stroke="#7a1020" strokeWidth="1.2"/><path d="M36 66 L42 84 M58 66 L64 84" stroke="#1a0a0a" strokeWidth="1"/><path d="M44 70 Q50 74 56 70" stroke="#000" strokeWidth="0.8" fill="none"/></g>}
        {/* COSTUME: draculaura — pink victorian dress */}
        {skin === "draculaura" && <g><path d="M28 68 Q50 60 72 68 L74 84 Q50 90 26 84 Z" fill="#ff8fb6" stroke="#b02a66" strokeWidth="1.2"/><path d="M28 68 Q50 64 72 68 L71 72 Q50 68 29 72 Z" fill="#1a1a1a" opacity="0.9"/><circle cx="50" cy="76" r="2" fill="#fff"/></g>}
        {/* COSTUME: frankie — stitched green jacket */}
        {skin === "frankie" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#7fc24a" stroke="#2a5a10" strokeWidth="1.2"/><path d="M34 68 L34 84 M50 68 L50 84 M66 68 L66 84" stroke="#2a5a10" strokeWidth="0.6" strokeDasharray="2 2"/></g>}
        {/* COSTUME: schnauzarella — blue ball gown */}
        {skin === "schnauzarella" && <g><path d="M26 68 Q50 58 74 68 L76 84 Q50 92 24 84 Z" fill="#7fd0ff" stroke="#1a5a8a" strokeWidth="1.2"/><path d="M26 68 Q50 64 74 68 L73 72 Q50 68 27 72 Z" fill="#fff" opacity="0.6"/></g>}
        {/* COSTUME: ariel — mermaid tail */}
        {skin === "ariel" && <g><path d="M30 68 Q50 62 70 68 L68 84 Q50 92 32 84 Z" fill="#00b8a9" stroke="#0a5a4a" strokeWidth="1.2"/><path d="M50 84 L46 92 L54 92 Z" fill="#00b8a9" stroke="#0a5a4a" strokeWidth="0.8"/><circle cx="50" cy="74" r="2.5" fill="#ffd27a" stroke="#7a5a0a" strokeWidth="0.6"/></g>}
        {/* COSTUME: captain — star shield */}
        {skin === "captain" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#1a3a8a" stroke="#0a1a4a" strokeWidth="1.2"/><circle cx="50" cy="74" r="6" fill="#fff" stroke="#d9342b" strokeWidth="1.2"/><path d="M50 68 l2 4 l4 0 l-3 3 l1 4 l-4 -3 l-4 3 l1 -4 l-3 -3 l4 0 Z" fill="#d9342b"/></g>}
        {/* COSTUME: bat — black cape */}
        {skin === "bat" && <g><path d="M22 48 Q14 78 26 92 L50 86 L74 92 Q86 78 78 48 Q66 56 50 56 Q34 56 22 48 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.2"/><path d="M26 52 Q22 76 30 88 L50 82 L70 88 Q78 76 74 52 Q64 60 50 60 Q36 60 26 52 Z" fill="#3a3a3a" opacity="0.9"/></g>}
        {/* COSTUME: huggy — already blue fur via palette, add bow tie */}
        {skin === "huggy" && <g><path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#ffd27a" stroke="#7a5a2a" strokeWidth="0.8"/><circle cx="50" cy="62" r="1.5" fill="#d9342b"/></g>}
        {/* COSTUME: catnap — purple collar moon */}
        {skin === "catnap" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#7a3ab0" stroke="#3a1a5a" strokeWidth="1.2"/><circle cx="50" cy="72" r="3" fill="#ffd27a" stroke="#7a5a2a" strokeWidth="0.6"/><path d="M50 72 Q52 74 50 76 Q48 74 50 72" fill="#7a3ab0"/></g>}
        {/* COSTUME: eleven — pink dress + waffle */}
        {skin === "eleven" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#ff8fb6" stroke="#b02a66" strokeWidth="1.2"/><rect x="44" y="72" width="12" height="6" rx="1" fill="#e3c79a" stroke="#7a5a2c" strokeWidth="0.6"/><path d="M46 73 h8 M48 75 h4" stroke="#7a5a2c" strokeWidth="0.6"/></g>}
        {/* COSTUME: rm — leather jacket */}
        {skin === "rm" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.2"/><path d="M38 66 L38 84 M62 66 L62 84" stroke="#3a3a3a" strokeWidth="1"/><rect x="44" y="71" width="12" height="7" rx="1" fill="#c9a86a" stroke="#7a5a2a" strokeWidth="0.8"/><path d="M50 71 v7" stroke="#7a5a2c" strokeWidth="0.6"/><circle cx="46" cy="74" r="0.6" fill="#fff"/><circle cx="54" cy="74" r="0.6" fill="#fff"/></g>}
        {/* COSTUME: steve — blue shirt pickaxe */}
        {skin === "steve" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#3a8ac0" stroke="#1a4a6e" strokeWidth="1.2"/><rect x="48" y="70" width="10" height="3" fill="#7a5a2c"/><rect x="56" y="68" width="3" height="8" fill="#d7d2c4"/></g>}
        {/* COSTUME: creeper — pixel green */}
        {skin === "creeper" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#7fc24a" stroke="#2a5a10" strokeWidth="1.2"/><rect x="34" y="70" width="6" height="6" fill="#1a1a1a"/><rect x="60" y="70" width="6" height="6" fill="#1a1a1a"/><rect x="44" y="76" width="12" height="3" fill="#1a1a1a"/></g>}
        {/* COSTUME: unicornio — rainbow body */}
        {skin === "unicornio" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#fff" stroke="#d9a6ff" strokeWidth="1.2"/><path d="M30 66 Q50 62 70 66 L70 70 Q50 66 30 70 Z" fill="url(#fur-unicornio)" opacity="0.35"/></g>}
        {/* COSTUME: pirata — red coat */}
        {skin === "pirata" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2"/><circle cx="42" cy="72" r="1.2" fill="#ffd27a"/><circle cx="58" cy="72" r="1.2" fill="#ffd27a"/></g>}
        {/* COSTUME: astronauta — white suit */}
        {skin === "astronauta" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#fff" stroke="#7a8aa8" strokeWidth="1.2"/><rect x="44" y="70" width="12" height="6" rx="1" fill="#d8f4ff" stroke="#7a8aa8" strokeWidth="0.6"/><circle cx="50" cy="73" r="1" fill="#ff3030"/></g>}
        {/* COSTUME: zombie — torn green */}
        {skin === "zombie" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#7fc24a" stroke="#2a5a10" strokeWidth="1.2"/><path d="M34 70 L36 84 M60 72 L58 84" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2"/></g>}
        {/* COSTUME: ninja — black suit */}
        {skin === "ninja" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.2"/><path d="M38 70 L38 84 M62 70 L62 84" stroke="#3a3a3a" strokeWidth="1"/></g>}
        {/* COSTUME: mago — robe stars */}
        {skin === "mago" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#1a1a5a" stroke="#0a0a3a" strokeWidth="1.2"/><circle cx="40" cy="72" r="1" fill="#ffd27a"/><circle cx="60" cy="74" r="1" fill="#ffd27a"/><path d="M50 70 l1 2 l2 0 l-1 2 l1 2 l-2 -1 l-2 1 l1 -2 l-1 -2 l2 0 Z" fill="#ffd27a"/></g>}
        {/* COSTUME: payaso — polka dots */}
        {skin === "payaso" && <g><path d="M30 66 Q50 55 70 66 L70 84 Q50 91 30 84 Z" fill="#fff" stroke="#d7d2c4" strokeWidth="1.2"/><circle cx="38" cy="72" r="2" fill="#ff5fa0"/><circle cx="62" cy="72" r="2" fill="#7fd0ff"/><circle cx="50" cy="76" r="2" fill="#ffd27a"/></g>}

        {/* kissy long arms — v2 thicker + fur texture */}
        {isKissy && <g>
          <path d="M30 68 Q12 58 6 72 Q2 82 12 86 Q9 80 15 77 Q11 85 20 83" fill="none" stroke="#ff7fb0" strokeWidth="7.2" strokeLinecap="round" />
          <path d="M70 68 Q88 58 94 72 Q98 82 88 86 Q91 80 85 77 Q89 85 80 83" fill="none" stroke="#ff7fb0" strokeWidth="7.2" strokeLinecap="round" />
          {/* fur tuft lines on arms */}
          <g stroke="#ffc0d8" strokeWidth="0.9" opacity="0.6" fill="none" strokeLinecap="round">
            <path d="M20 70 q-2 3 -4 6" /><path d="M18 76 q-1 3 -2 5" /><path d="M80 70 q2 3 4 6" /><path d="M82 76 q1 3 2 5" />
          </g>
          <circle cx="12" cy="85.5" r="4.8" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
          <circle cx="88" cy="85.5" r="4.8" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
          <circle cx="11" cy="84" r="1" fill="#fff" opacity="0.7" /><circle cx="87" cy="84" r="1" fill="#fff" opacity="0.7" />
        </g>}

        {/* JOCKEY rider (behind Maxine's head) */}
        {skin === "jockey" && (
          <g>
            {/* legs straddling */}
            <path d="M30 56 Q26 64 30 72 L34 72 Q34 64 36 58 Z" fill="#f4f1e6" stroke="#3a3a3a" strokeWidth="0.8" />
            <path d="M70 56 Q74 64 70 72 L66 72 Q66 64 64 58 Z" fill="#f4f1e6" stroke="#3a3a3a" strokeWidth="0.8" />
            <rect x="28" y="70" width="7" height="5" rx="1.5" fill="#1a1a1a" />
            <rect x="65" y="70" width="7" height="5" rx="1.5" fill="#1a1a1a" />
            {/* torso */}
            <path d="M38 40 Q50 34 62 40 L60 58 Q50 62 40 58 Z" fill="#d9342b" stroke="#5a0808" strokeWidth="1" />
            <path d="M42 40 l0 18 M48 38 l0 20 M54 38 l0 20 M58 40 l0 18" stroke="#fff" strokeWidth="1.4" />
            {/* arms holding reins */}
            <path d="M38 44 Q30 50 32 58" stroke="#d9342b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M62 44 Q70 50 68 58" stroke="#d9342b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <circle cx="32" cy="58" r="2" fill="#f0c090" /><circle cx="68" cy="58" r="2" fill="#f0c090" />
            {/* reins to Maxine's bandana */}
            <path d="M32 58 Q40 62 44 62 M68 58 Q60 62 56 62" stroke="#3a2010" strokeWidth="0.8" fill="none" />
            {/* head + helmet */}
            <circle cx="50" cy="32" r="7" fill="#f0c090" stroke="#7a4410" strokeWidth="0.8" />
            <path d="M42 30 Q50 18 58 30 Q58 26 50 24 Q42 26 42 30 Z" fill="#1a1a1a" />
            <path d="M42 30 Q50 26 58 30 L58 32 L42 32 Z" fill="#d9342b" />
            <rect x="49" y="18" width="2" height="4" fill="#1a1a1a" />
            <circle cx="47" cy="32" r="0.9" fill="#1a0a04" /><circle cx="53" cy="32" r="0.9" fill="#1a0a04" />
            <path d="M48 35 q2 1 4 0" stroke="#3a1a08" strokeWidth="0.6" fill="none" />
          </g>
        )}

        {/* FRONT LEGS */}
        <g>
          {dig ? (
            <><g style={{ transformOrigin: "40px 78px", animation: "wag 0.16s linear infinite" }}><rect x="34" y="76" width="9" height="12" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="38" cy="88" rx="5" ry="3" fill={isKissy ? "#ffe066" : pal.creamSh} /></g><g style={{ transformOrigin: "60px 78px", animation: "wag 0.16s linear infinite reverse" }}><rect x="57" y="76" width="9" height="12" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="62" cy="88" rx="5" ry="3" fill={isKissy ? "#ffe066" : pal.creamSh} /></g></>
          ) : fall ? (
            <><rect x="34" y="70" width="9" height="10" rx="4" fill={pal.dark} transform="rotate(-20 38 75)" /><rect x="57" y="70" width="9" height="10" rx="4" fill={pal.dark} transform="rotate(20 62 75)" /></>
          ) : (
            <><rect x="36" y="78" width="8" height="11" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><rect x="56" y="78" width="8" height="11" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="40" cy="89" rx="4.5" ry="2.6" fill={isKissy ? "#ffe066" : pal.creamSh} /><ellipse cx="60" cy="89" rx="4.5" ry="2.6" fill={isKissy ? "#ffe066" : pal.creamSh} /></>
          )}
        </g>

        {/* NECKWEAR */}
        {skin === "default" && <g><path d="M36 56 Q50 62 64 56 L60 70 L50 74 L40 70 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1" /><circle cx="50" cy="62" r="3" fill="#ff6b6b" /><circle cx="44" cy="64" r="0.9" fill="#fff" /><circle cx="56" cy="64" r="0.9" fill="#fff" /><circle cx="50" cy="68" r="0.9" fill="#fff" /></g>}
        {skin === "bow" && <path d="M38 58 Q50 64 62 58 L58 68 L50 70 L42 68 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1" />}
        {skin === "vampire" && <g><path d="M40 58 L50 64 L60 58 L56 66 L50 68 L44 66 Z" fill="#0c0612" /><circle cx="50" cy="62" r="2.4" fill="#e23b3b" stroke="#fff" strokeWidth="0.5" /></g>}
        {skin === "princess" && <path d="M38 60 Q50 66 62 60" fill="none" stroke="#fff" strokeWidth="2.4" />}

        {/* HEAD */}
        <g>
          {/* ears per skin */}
          {skin === "yuta" ? (
            <><path d="M28 32 Q20 40 26 52 Q34 46 36 36 Z" fill="#2a1a10" /><path d="M72 32 Q80 40 74 52 Q66 46 64 36 Z" fill="#2a1a10" /></>
          ) : skin === "catto" ? (
            <><path d="M28 32 L22 14 L40 26 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" /><path d="M30 28 L26 18 L36 25 Z" fill="#ff8fa0" /><path d="M72 32 L78 14 L60 26 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" /><path d="M70 28 L74 18 L64 25 Z" fill="#ff8fa0" /></>
          ) : skin === "pochacco" ? (
            <><path d="M26 32 Q12 40 14 66 Q22 70 28 60 Q32 46 34 36 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" /><path d="M74 32 Q88 40 86 66 Q78 70 72 60 Q68 46 66 36 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" /><circle cx="20" cy="52" r="1" fill="#fff" opacity="0.5" /><circle cx="80" cy="52" r="1" fill="#fff" opacity="0.5" /></>
          ) : skin === "mahoraga" ? null : (
            <><path d="M26 34 Q14 44 16 66 Q22 68 28 60 Q32 48 34 38 Z" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><path d="M74 34 Q86 44 84 66 Q78 68 72 60 Q68 48 66 38 Z" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><path d="M22 44 Q18 56 22 62" fill="none" stroke={pal.earIn} strokeWidth="1.6" /><path d="M78 44 Q82 56 78 62" fill="none" stroke={pal.earIn} strokeWidth="1.6" /><Wiry cx={22} cy={50} n={5} r={4} /><Wiry cx={78} cy={50} n={5} r={4} /></>
          )}

          {/* skull */}
          <path d="M28 38 Q28 20 50 18 Q72 20 72 38 Q74 52 66 58 Q50 62 34 58 Q26 52 28 38 Z" fill={`url(#fur-${skin})`} stroke={pal.outline} strokeWidth="1.2" />
          <g stroke={pal.darkR} strokeWidth="0.7" fill="none" opacity="0.55" strokeLinecap="round"><path d="M32 28 q3 -3 6 0" /><path d="M42 24 q3 -3 6 0" /><path d="M54 24 q3 -3 6 0" /><path d="M62 28 q3 -3 6 0" /></g>
          {/* cheek tufts */}
          <path d="M28 44 Q22 50 26 58 Q34 54 36 46 Z" fill={pal.light} />
          <path d="M72 44 Q78 50 74 58 Q66 54 64 46 Z" fill={pal.light} />

          {/* messy forehead tuft (skip for mahoraga/pochacco clean look) */}
          {skin !== "mahoraga" && skin !== "pochacco" && (
            <g>
              <g stroke={pal.darkR} strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M42 20 q-2 8 -6 12" /><path d="M48 18 q0 8 -2 14" /><path d="M54 18 q2 8 4 12" /><path d="M60 22 q4 6 6 10" /></g>
              <path d="M40 18 Q50 12 60 18 Q56 22 50 20 Q44 22 40 18 Z" fill={pal.dark} />
            </g>
          )}

          {/* mahoraga cloud brows (instead of schnauzer brows) */}
          {skin === "mahoraga" ? (
            <g fill="#fff" stroke="#b8b0a0" strokeWidth="0.8">
              <path d="M14 40 q4 -6 10 -2 q4 -4 8 0 q4 -2 4 4 q-4 4 -10 2 q-6 2 -12 -4 Z" />
              <path d="M86 40 q-4 -6 -10 -2 q-4 -4 -8 0 q-4 -2 -4 4 q4 4 10 2 q6 2 12 -4 Z" />
              <path d="M18 48 q3 -4 8 -1 q4 -2 6 2 q-4 3 -10 1 Z" />
              <path d="M82 48 q-3 -4 -8 -1 q-4 -2 -6 2 q4 3 10 1 Z" />
            </g>
          ) : (
            <g>
              <path d="M30 32 Q38 24 48 32 Q42 30 36 34 Q32 34 30 32 Z" fill={pal.light} stroke={pal.darkR} strokeWidth="0.6" />
              <path d="M70 32 Q62 24 52 32 Q58 30 64 34 Q68 34 70 32 Z" fill={pal.light} stroke={pal.darkR} strokeWidth="0.6" />
              <g stroke={pal.darkR} strokeWidth="0.7" fill="none" strokeLinecap="round"><path d="M34 30 l-2 4" /><path d="M40 28 l-1 4" /><path d="M46 30 l0 4" /><path d="M66 30 l2 4" /><path d="M60 28 l1 4" /><path d="M54 30 l0 4" /></g>
            </g>
          )}

          {/* muzzle */}
          <path d="M38 42 Q50 38 62 42 Q64 52 58 58 Q50 62 42 58 Q36 52 38 42 Z" fill={pal.cream} stroke={pal.creamSh} strokeWidth="0.8" />

          {/* beard / mustache (skip mahoraga & pochacco) */}
          {skin !== "mahoraga" && skin !== "pochacco" && (
            <g>
              <g stroke={pal.light} strokeWidth="1.1" fill="none" strokeLinecap="round"><path d="M40 52 q-2 6 -4 10" /><path d="M44 54 q-1 6 -2 10" /><path d="M48 55 q0 6 0 10" /><path d="M52 55 q0 6 0 10" /><path d="M56 54 q1 6 2 10" /><path d="M60 52 q2 6 4 10" /></g>
              <path d="M40 48 Q44 54 50 52 Q56 54 60 48 Q58 56 50 56 Q42 56 40 48 Z" fill={pal.light} />
            </g>
          )}

          {/* catto whiskers */}
          {skin === "catto" && <g stroke="#fff" strokeWidth="0.8" strokeLinecap="round"><path d="M36 48 l-12 -2 M36 50 l-12 1 M36 52 l-12 3 M64 48 l12 -2 M64 50 l12 1 M64 52 l12 3" /></g>}

          {/* eyes */}
          {skin === "mahoraga" ? null : hurt ? (
            <><path d="M36 40 l6 6 M42 40 l-6 6" stroke="#3a1a08" strokeWidth="2" strokeLinecap="round" /><path d="M58 40 l6 6 M64 40 l-6 6" stroke="#3a1a08" strokeWidth="2" strokeLinecap="round" /><path d="M40 48 q-2 4 -4 6" stroke="#6ec8ff" strokeWidth="1.6" fill="none" /><path d="M60 48 q2 4 4 6" stroke="#6ec8ff" strokeWidth="1.6" fill="none" /></>
          ) : dead ? (
            <><path d="M36 42 q4 4 8 0" stroke="#3a1a08" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M56 42 q4 4 8 0" stroke="#3a1a08" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M62 46 q2 6 0 10" stroke="#6ec8ff" strokeWidth="2" fill="none" /></>
          ) : (
            <g className={animate ? "blink" : ""} style={{ transformOrigin: "50px 42px" }}>
              <ellipse cx="40" cy="42" rx="4.4" ry={win ? 4.8 : 5.4} fill="#fff" />
              <ellipse cx="60" cy="42" rx="4.4" ry={win ? 4.8 : 5.4} fill="#fff" />
              <circle cx="40.5" cy="43" r="3.4" fill={isKissy ? "#3aa0ff" : `url(#eye-${skin})`} />
              <circle cx="60.5" cy="43" r="3.4" fill={isKissy ? "#3aa0ff" : `url(#eye-${skin})`} />
              {skin === "catto" ? <><ellipse cx="41" cy="43" rx="0.8" ry="2.4" fill="#0a0402" /><ellipse cx="61" cy="43" rx="0.8" ry="2.4" fill="#0a0402" /></> : <><circle cx="41" cy="43" r="1.6" fill="#0a0402" /><circle cx="61" cy="43" r="1.6" fill="#0a0402" /></>}
              <circle cx="42.2" cy="41.6" r="0.9" fill="#fff" /><circle cx="62.2" cy="41.6" r="0.9" fill="#fff" />
            </g>
          )}

          {/* mahoraga teeth-mouth (replaces nose+mouth) */}
          {skin === "mahoraga" ? (
            <g>
              <ellipse cx="50" cy="52" rx="8" ry="5.5" fill="#fff" stroke="#3a3a3a" strokeWidth="1.2" />
              <path d="M45 47 v10 M48 47 v10 M51 47 v10 M54 47 v10" stroke="#3a3a3a" strokeWidth="0.9" />
            </g>
          ) : (
            <g>
              <path d="M45 47 Q50 44 55 47 Q56 51 50 53 Q44 51 45 47 Z" fill={skin === "catto" ? "#ff7a9a" : pal.nose} />
              {skin !== "catto" && <ellipse cx="48.5" cy="47.5" rx="1.4" ry="0.8" fill="#fff" opacity="0.75" />}
              {win ? <g><path d="M44 54 Q50 62 56 54 Q52 58 50 58 Q48 58 44 54 Z" fill="#5a1410" /><path d="M47 56 Q50 60 53 56 Q50 58 47 56 Z" fill="#ff7a9a" /></g>
                : hurt || dead ? <path d="M45 56 Q50 53 55 56" stroke="#3a1a08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                : <path d="M46 55 Q50 58 54 55" stroke="#3a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
              {skin === "vampire" && <g fill="#fff" stroke="#dcdcdc" strokeWidth="0.3"><path d="M46 55 l1.4 3 l1.4 -3 Z" /><path d="M51.2 55 l1.4 3 l1.4 -3 Z" /></g>}
            </g>
          )}

          {/* HEAD ACCESSORIES */}
          {skin === "bow" && <g transform="translate(50 16)"><path d="M-2 0 Q-14 -8 -14 2 Q-14 10 -2 4 Z" fill="#ff5fa0" stroke="#b02a66" strokeWidth="1" /><path d="M2 0 Q14 -8 14 2 Q14 10 2 4 Z" fill="#ff5fa0" stroke="#b02a66" strokeWidth="1" /><circle cx="0" cy="2" r="3" fill="#ff8fc0" stroke="#b02a66" strokeWidth="1" /></g>}
          {skin === "santa" && <g><path d="M30 26 Q50 8 70 26 Q66 18 58 14 Q64 4 50 2 Q36 6 40 16 Q32 20 30 26 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2" /><path d="M28 24 Q50 18 72 24 L70 30 Q50 26 30 30 Z" fill="#fff" /><circle cx="52" cy="2" r="4" fill="#fff" /></g>}
          {skin === "princess" && <g><path d="M36 22 L40 10 L46 18 L50 6 L54 18 L60 10 L64 22 Z" fill="#ffd27a" stroke="#a8730a" strokeWidth="1" /><circle cx="50" cy="12" r="2" fill="#ff5fa0" /></g>}
          {skin === "yuta" && <g>
            <path d="M28 28 Q32 14 42 12 Q48 8 55 12 Q64 10 72 18 Q70 26 66 28 Q62 18 50 20 Q38 18 30 26 Z" fill="#0a0a0a" stroke="#000" strokeWidth="0.8" />
            <path d="M38 16 q2 4 3 6 q2 -3 4 -5" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.6" />
          </g>}
          {skin === "kissy" && <g><path d="M28 28 Q50 12 72 28 Q68 20 50 16 Q32 20 28 28 Z" fill="#ff5fa0" /><path d="M46 16 q4 -6 8 0 q-4 4 -8 0 Z" fill="#ff8fc0" /></g>}
          {skin === "gojo" && <g><rect x="30" y="30" width="40" height="8" rx="2" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" /><rect x="32" y="32" width="36" height="4" rx="1" fill="#7fd0ff" opacity="0.6" /><path d="M38 18 Q50 10 62 18 Q58 12 50 14 Q42 12 38 18 Z" fill="#ffffff" stroke="#b8c8e8" strokeWidth="0.8" /></g>}
          {skin === "sukuna" && <g><path d="M34 28 q2 -2 4 0 M42 24 q2 -2 4 0 M58 24 q-2 -2 -4 0 M66 28 q-2 -2 -4 0" stroke="#c93030" strokeWidth="1.4" fill="none" strokeLinecap="round"/><circle cx="40" cy="42" r="1" fill="#ffd27a"/><circle cx="60" cy="42" r="1" fill="#ffd27a"/></g>}
          {skin === "draculaura" && <g><path d="M28 30 Q30 18 42 22 Q40 28 34 32 Z" fill="#1a1a1a" /><path d="M72 30 Q70 18 58 22 Q60 28 66 32 Z" fill="#1a1a1a" /><circle cx="50" cy="16" r="3" fill="#ff5fa0" stroke="#b02a66" strokeWidth="0.8"/><path d="M44 14 l2 2 l2 -2" fill="#000"/></g>}
          {skin === "frankie" && <g><path d="M30 32 Q32 28 34 32 M66 32 Q68 28 70 32" stroke="#000" strokeWidth="1" fill="none"/><rect x="34" y="18" width="4" height="4" fill="#7a5a2c" stroke="#000" strokeWidth="0.6"/><rect x="62" y="18" width="4" height="4" fill="#7a5a2c" stroke="#000" strokeWidth="0.6"/><path d="M40 22 Q50 26 60 22" stroke="#000" strokeWidth="0.7" strokeDasharray="2 2" fill="none"/></g>}
          {skin === "huggy" && <g><path d="M26 34 Q14 38 16 50 Q22 48 26 40 Z" fill="#7fd0ff" stroke="#1a3a5a" strokeWidth="0.8"/><path d="M74 34 Q86 38 84 50 Q78 48 74 40 Z" fill="#7fd0ff" stroke="#1a3a5a" strokeWidth="0.8"/><path d="M36 30 Q50 34 64 30" fill="none" stroke="#fff" strokeWidth="1.2"/><circle cx="50" cy="16" r="2.2" fill="#ffd27a" stroke="#7a3a5a" strokeWidth="0.6"/></g>}
          {skin === "catnap" && <g><ellipse cx="50" cy="16" rx="12" ry="4" fill="#7a3ab0" stroke="#3a1a5a" strokeWidth="0.8"/><circle cx="50" cy="14" r="2" fill="#ffd27a" stroke="#7a5a2a" strokeWidth="0.6"/><path d="M38 46 q4 -2 8 2" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.5"/><path d="M54 46 q4 -2 8 2" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.5"/></g>}
          {skin === "unicornio" && <g><path d="M50 6 L46 18 L54 18 Z" fill="#fff" stroke="#b06bff" strokeWidth="1"/><path d="M46 18 Q50 10 54 18" fill="none" stroke="#ffd27a" strokeWidth="1.2"/><path d="M36 22 Q40 14 46 16 Q42 20 36 22 Z" fill="#ff8fb6"/><path d="M64 22 Q60 14 54 16 Q58 20 64 22 Z" fill="#ff8fb6"/></g>}
          {skin === "pirata" && <g><path d="M30 26 Q50 12 70 26 L68 30 Q50 18 32 30 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1"/><circle cx="42" cy="38" r="5" fill="#1a1a1a"/><path d="M42 38 l6 6" stroke="#fff" strokeWidth="0.8"/></g>}
          {skin === "astronauta" && <g><circle cx="50" cy="32" r="16" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="50" cy="32" r="14" fill="#d8f4ff" opacity="0.25"/><rect x="44" y="12" width="12" height="4" rx="1" fill="#fff" stroke="#7a8aa8" strokeWidth="0.6"/></g>}
          {skin === "ninja" && <g><rect x="30" y="28" width="40" height="10" rx="2" fill="#1a1a1a" /><ellipse cx="40" cy="33" rx="1.5" ry="1" fill="#ff3030"/><ellipse cx="60" cy="33" rx="1.5" ry="1" fill="#ff3030"/></g>}
        </g>
      </g>
      </g>

      {win && <g fill="#ffe066"><path d="M16 24 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /><path d="M84 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z" /></g>}
    </svg>
  );
}
