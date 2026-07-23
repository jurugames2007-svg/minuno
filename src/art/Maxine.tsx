import type { SkinId } from "../data/skins";

export type Pose = "idle" | "dig" | "fall" | "hurt" | "win" | "dead";

interface Props { skin?: SkinId; pose?: Pose; facing?: 1 | -1; size?: number; className?: string; animate?: boolean; }

interface Pal { main: string; light: string; dark: string; darkR: string; cream: string; creamSh: string; earIn: string; outline: string; nose: string; }
const BASE: Pal = { main: "#e3c79a", light: "#f6e4bf", dark: "#b8956a", darkR: "#8a6a44", cream: "#fff1d0", creamSh: "#ecd2a0", earIn: "#9a7048", outline: "#6a4420", nose: "#1a0e08" };
function palette(skin: SkinId): Pal {
  if (skin === "kissy") return { main: "#ff8fb6", light: "#ffc0d8", dark: "#d65a88", darkR: "#a83a66", cream: "#ffd0e2", creamSh: "#f0a0c0", earIn: "#ff5fa0", outline: "#b02a66", nose: "#1a0e08" };
  if (skin === "pochacco") return { main: "#ffffff", light: "#ffffff", dark: "#d8d8d8", darkR: "#9a9a9a", cream: "#ffffff", creamSh: "#e4e4e4", earIn: "#1a1a1a", outline: "#555555", nose: "#1a0e08" };
  if (skin === "mahoraga") return { main: "#f4f1e6", light: "#ffffff", dark: "#c9c2ae", darkR: "#8a8270", cream: "#ffffff", creamSh: "#d8d2c0", earIn: "#c9c2ae", outline: "#555555", nose: "#1a0e08" };
  return BASE; // default, vampire, santa, lime, harness, bow, yuta, princess, yarnaby, jockey, catto
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

        {/* yarnaby rainbow frill */}
        {skin === "yarnaby" && <g>{Array.from({ length: 32 }).map((_, i) => { const a = (i / 32) * Math.PI * 2; const x = 50 + Math.cos(a) * 26; const y = 42 + Math.sin(a) * 26; const hue = (i / 32) * 360; return <g key={i} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}><path d={`M${x} ${y} q-4 -16 0 -24 q4 8 0 24 Z`} fill={`hsl(${hue} 85% 60%)`} stroke={`hsl(${hue} 80% 38%)`} strokeWidth="0.8" /></g>; })}</g>}

        {/* mahoraga halo wheel — rotates every ~3.5s */}
        {skin === "mahoraga" && (
          <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: animate ? "spin-slow 3.5s linear infinite" : undefined }}>
            <g transform="translate(50 6)">
              <ellipse cx="0" cy="0" rx="20" ry="5" fill="none" stroke="#8a8a6a" strokeWidth="2" />
              {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; const x = Math.cos(a) * 20; const y = Math.sin(a) * 5; return <g key={i}><line x1="0" y1="0" x2={x} y2={y} stroke="#8a8a6a" strokeWidth="1.4" /><circle cx={x} cy={y} r="2.2" fill="#a8a880" stroke="#5a5a3a" strokeWidth="0.6" /></g>; })}
              <circle cx="0" cy="0" r="2.6" fill="#a8a880" stroke="#5a5a3a" strokeWidth="0.6" />
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
        {/* COSTUME: yuta */}
        {skin === "yuta" && <g><path d="M30 62 Q50 56 70 62 L70 84 Q50 90 30 84 Z" fill="#1a2348" stroke="#070b1f" strokeWidth="1.2" /><path d="M44 60 L50 70 L56 60 L54 84 L46 84 Z" fill="#f4f1e6" /><path d="M30 64 L70 82" stroke="#0a0a0a" strokeWidth="3" /></g>}
        {/* COSTUME: pochacco magenta shirt */}
        {skin === "pochacco" && <g><path d="M28 64 Q50 56 72 64 L72 84 Q50 90 28 84 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1.2" /><path d="M28 64 L20 72 L24 80 L30 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" /><path d="M72 64 L80 72 L76 80 L70 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" /><path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" /></g>}
        {/* COSTUME: mahoraga hakama + sash */}
        {skin === "mahoraga" && <g><path d="M28 74 L24 92 L40 90 L50 92 L60 90 L76 92 L72 74 Z" fill="#14181c" stroke="#000" strokeWidth="1" /><rect x="28" y="70" width="44" height="6" fill="#8a9498" stroke="#3a4044" strokeWidth="0.8" /><path d="M46 73 q-4 4 -2 8 q4 -2 6 -4 q2 2 6 4 q2 -4 -2 -8 Z" fill="#8a9498" stroke="#3a4044" strokeWidth="0.6" /><path d="M32 78 l0 10 M42 78 l0 12 M58 78 l0 12 M68 78 l0 10" stroke="#3a4044" strokeWidth="0.6" /></g>}
        {/* kissy long arms */}
        {isKissy && <g><path d="M30 68 Q14 60 8 74 Q4 84 14 86 Q10 80 16 78 Q12 86 20 84" fill="none" stroke="#ff7fb0" strokeWidth="5" strokeLinecap="round" /><path d="M70 68 Q86 60 92 74 Q96 84 86 86 Q90 80 84 78 Q88 86 80 84" fill="none" stroke="#ff7fb0" strokeWidth="5" strokeLinecap="round" /><circle cx="13" cy="85" r="4" fill="#ffe066" stroke="#b8910a" strokeWidth="0.8" /><circle cx="87" cy="85" r="4" fill="#ffe066" stroke="#b8910a" strokeWidth="0.8" /></g>}

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
          {skin === "yuta" && <path d="M30 26 Q40 16 50 20 Q60 16 70 26 Q62 20 50 24 Q38 20 30 26 Z" fill="#1a1008" />}
          {skin === "kissy" && <g><path d="M28 28 Q50 12 72 28 Q68 20 50 16 Q32 20 28 28 Z" fill="#ff5fa0" /><path d="M46 16 q4 -6 8 0 q-4 4 -8 0 Z" fill="#ff8fc0" /></g>}
        </g>
      </g>
      </g>

      {win && <g fill="#ffe066"><path d="M16 24 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /><path d="M84 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z" /></g>}
    </svg>
  );
}
