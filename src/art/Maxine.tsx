import type { ReactElement } from "react";
import type { SkinId } from "../data/skins";

export type Pose = "idle" | "dig" | "fall" | "hurt" | "win" | "dead";

interface Props {
  skin?: SkinId;
  pose?: Pose;
  facing?: 1 | -1;
  size?: number;
  className?: string;
  animate?: boolean;
}

interface Pal {
  main: string; light: string; dark: string; darkR: string;
  cream: string; creamSh: string; earIn: string; outline: string; nose: string;
}

const BASE: Pal = {
  main: "#e3c79a", light: "#f6e4bf", dark: "#b8956a", darkR: "#8a6a44",
  cream: "#fff1d0", creamSh: "#ecd2a0", earIn: "#9a7048", outline: "#6a4420", nose: "#1a0e08",
};

/** Only full-body “become the creature” skins recolor Maxine’s fur. Costume skins stay schnauzer. */
function palette(skin: SkinId): Pal {
  if (skin === "kissy") return { main: "#ff8fb6", light: "#ffc0d8", dark: "#d65a88", darkR: "#a83a66", cream: "#ffd0e2", creamSh: "#f0a0c0", earIn: "#ff5fa0", outline: "#b02a66", nose: "#1a0e08" };
  if (skin === "pochacco") return { main: "#ffffff", light: "#ffffff", dark: "#d8d8d8", darkR: "#9a9a9a", cream: "#ffffff", creamSh: "#e4e4e4", earIn: "#1a1a1a", outline: "#555555", nose: "#1a0e08" };
  if (skin === "mahoraga") return { main: "#f4f1e6", light: "#ffffff", dark: "#c9c2ae", darkR: "#8a8270", cream: "#ffffff", creamSh: "#d8d2c0", earIn: "#c9c2ae", outline: "#555555", nose: "#1a0e08" };
  if (skin === "yarnaby") return { main: "#ff9d2e", light: "#ffb86a", dark: "#d96a1a", darkR: "#8a3a0a", cream: "#fff1d0", creamSh: "#ffd9a0", earIn: "#d96a1a", outline: "#6a2a00", nose: "#1a0e08" };
  if (skin === "huggy") return { main: "#3d8bff", light: "#7fb4ff", dark: "#1a4ec8", darkR: "#123a96", cream: "#fff7e8", creamSh: "#dce8ff", earIn: "#7fd0ff", outline: "#0d2a6a", nose: "#1a0e08" };
  if (skin === "catnap") return { main: "#b06bff", light: "#d9a6ff", dark: "#7a3ab0", darkR: "#4a1a70", cream: "#e9d5ff", creamSh: "#c9a6e8", earIn: "#7a3ab0", outline: "#3a1a5a", nose: "#1a0e08" };
  if (skin === "dogday") return { main: "#ffb347", light: "#ffd27a", dark: "#d98a20", darkR: "#8a4a10", cream: "#fff1d0", creamSh: "#ffd9a0", earIn: "#d98a20", outline: "#6a3410", nose: "#1a0e08" };
  if (skin === "craftycorn") return { main: "#a8e4ff", light: "#d8f4ff", dark: "#7ab8d8", darkR: "#4a8ab0", cream: "#fff1d0", creamSh: "#ffd9a0", earIn: "#4a8ab0", outline: "#3a6a8a", nose: "#1a0e08" };
  if (skin === "creeper") return { main: "#5aa83a", light: "#7fc24a", dark: "#3a7a1a", darkR: "#2a5a10", cream: "#3a7a1a", creamSh: "#2a5a10", earIn: "#2a5a10", outline: "#1a3a08", nose: "#1a1a1a" };
  if (skin === "zombie") return { main: "#8fb86a", light: "#b8d890", dark: "#5a7a3a", darkR: "#3a5a1a", cream: "#c8d8a0", creamSh: "#9ab070", earIn: "#5a7a3a", outline: "#2a4a10", nose: "#3a4a20" };
  if (skin === "penguin") return { main: "#1a1a22", light: "#3a3a48", dark: "#0a0a10", darkR: "#000", cream: "#f4f1e8", creamSh: "#d8d2c4", earIn: "#1a1a22", outline: "#000", nose: "#f08a20" };
  if (skin === "bigotes") return { main: "#f4f0e8", light: "#fff", dark: "#d8d0c4", darkR: "#8a6a44", cream: "#fff", creamSh: "#e8e0d4", earIn: "#7a4410", outline: "#3a2010", nose: "#1a0e08" };
  if (skin === "catto") return { main: "#d9c39a", light: "#f0e0b8", dark: "#b8956a", darkR: "#8a6a44", cream: "#fff1d0", creamSh: "#ecd2a0", earIn: "#ff8fa0", outline: "#6a4420", nose: "#ff7a9a" };
  if (skin === "ender") return { main: "#1a1a2e", light: "#2a2a4a", dark: "#0a0a1a", darkR: "#000", cream: "#1a1a2e", creamSh: "#0a0a1a", earIn: "#b06bff", outline: "#000", nose: "#b06bff" };
  if (skin === "unicornio") return { main: "#fff4fb", light: "#ffffff", dark: "#f0c8e8", darkR: "#d9a6ff", cream: "#fff", creamSh: "#ffe0f0", earIn: "#ff8fb6", outline: "#b06bff", nose: "#ff5fa0" };
  if (skin === "eevee") return { main: "#c4843a", light: "#e8b06a", dark: "#8a5420", darkR: "#5a3410", cream: "#fff3d6", creamSh: "#e8d2a0", earIn: "#f0c090", outline: "#5a3410", nose: "#3a2010" };
  if (skin === "kira") return { main: "#c9842a", light: "#e8b86a", dark: "#2a1a10", darkR: "#1a1008", cream: "#f4e8d0", creamSh: "#d8c4a0", earIn: "#1a1a1a", outline: "#1a1008", nose: "#1a0e08" };
  if (skin === "spooky") return { main: "#1a1a1e", light: "#3a3a42", dark: "#0a0a0c", darkR: "#000", cream: "#2a2a30", creamSh: "#141418", earIn: "#ffb347", outline: "#000", nose: "#1a0e08" };
  if (skin === "freddy") return { main: "#8a4a18", light: "#c9842a", dark: "#5a2a0a", darkR: "#3a1808", cream: "#f0d2a0", creamSh: "#d4b070", earIn: "#5a2a0a", outline: "#2a1408", nose: "#1a0e08" };
  if (skin === "foxy") return { main: "#d44a2a", light: "#ff8a5a", dark: "#8a2410", darkR: "#5a1408", cream: "#fff1d0", creamSh: "#f0c8a0", earIn: "#ff8fa0", outline: "#5a1408", nose: "#1a0e08" };
  if (skin === "bonnie") return { main: "#6a4ab0", light: "#9a7ad8", dark: "#3a2870", darkR: "#241850", cream: "#e8d8ff", creamSh: "#c8b0e8", earIn: "#ff8fa0", outline: "#241850", nose: "#1a0e08" };
  if (skin === "chica") return { main: "#f0c040", light: "#ffe066", dark: "#c99020", darkR: "#8a6010", cream: "#fff8d0", creamSh: "#f0d890", earIn: "#ff8fa0", outline: "#8a6010", nose: "#e07020" };
  if (skin === "croissant") return { main: "#e8a048", light: "#ffd27a", dark: "#b86a20", darkR: "#7a4410", cream: "#fff3d6", creamSh: "#f0c890", earIn: "#ffb347", outline: "#6a3410", nose: "#8a4418" };
  return BASE;
}

const BODY_SKINS = new Set<SkinId>(["kissy", "pochacco", "mahoraga", "yarnaby", "huggy", "catnap", "dogday", "craftycorn", "creeper", "zombie", "penguin", "bigotes", "catto", "ender", "unicornio", "eevee", "kira", "spooky", "freddy", "foxy", "bonnie", "chica", "croissant"]);

export default function Maxine({ skin = "default", pose = "idle", facing = 1, size = 120, className = "", animate = true }: Props) {
  const tailWag = animate && (pose === "idle" || pose === "win" || pose === "dig");
  const bodyBob = animate && pose === "idle";
  const hurt = pose === "hurt"; const dead = pose === "dead"; const win = pose === "win"; const dig = pose === "dig"; const fall = pose === "fall";
  const pal = palette(skin);
  const isKissy = skin === "kissy";
  const isHuggy = skin === "huggy";
  const belly = isKissy ? "#ffd0e2" : skin === "penguin" ? "#f7f3ea" : pal.cream;
  const hideBeard = skin === "mahoraga" || skin === "pochacco" || skin === "penguin" || skin === "creeper" || skin === "spider" || skin === "spooky" || skin === "eevee" || skin === "kira" || skin === "freddy" || skin === "foxy" || skin === "bonnie" || skin === "chica" || skin === "croissant";
  const hideTuft = hideBeard || skin === "gojo" || skin === "yuta" || skin === "yuji" || skin === "eleven" || skin === "laufey" || skin === "padme" || skin === "steve" || skin === "alex" || skin === "darth" || skin === "nobara" || skin === "megumi" || skin === "jasmine" || skin === "bella" || skin === "tiana" || skin === "clawdeen" || skin === "cleo" || skin === "ghoulia" || skin === "draculaura" || skin === "barbie" || skin === "matrona" || skin === "bebe" || skin === "abuela" || skin === "sabio" || skin === "subzero" || skin === "hada" || skin === "panadero";

  const Wiry = ({ cx, cy, n = 6, r = 10, color }: { cx: number; cy: number; n?: number; r?: number; color?: string }) => (
    <g stroke={color || pal.darkR} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.85">
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + (cx % 2);
        const x2 = cx + Math.cos(a) * r; const y2 = cy + Math.sin(a) * r;
        return <path key={i} d={`M${cx} ${cy} Q${(cx + x2) / 2 + (i % 2 ? 1 : -1)} ${(cy + y2) / 2} ${x2} ${y2}`} />;
      })}
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`${className} ${bodyBob ? "bob" : ""}`} style={{ overflow: "visible", filter: hurt ? "drop-shadow(0 0 6px #ff5a5a)" : undefined }}>
      <defs>
        <radialGradient id={`eye-${skin}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#6b3a18" /><stop offset="70%" stopColor="#2a1408" /><stop offset="100%" stopColor="#0a0402" />
        </radialGradient>
        <linearGradient id={`cape-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0a10" /><stop offset="100%" stopColor="#2a1020" /></linearGradient>
        <linearGradient id={`fur-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={pal.light} /><stop offset="55%" stopColor={pal.main} /><stop offset="100%" stopColor={pal.dark} /></linearGradient>
        <linearGradient id={`vader-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2a32" /><stop offset="50%" stopColor="#0a0a0c" /><stop offset="100%" stopColor="#000" /></linearGradient>
        <linearGradient id={`gown-${skin}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a1430" /><stop offset="100%" stopColor="#4a0818" /></linearGradient>
      </defs>

      <g transform={facing === -1 ? "translate(100,0) scale(-1,1)" : undefined}>
      <g transform={dead ? "rotate(-18 50 72) translate(0 6)" : ""}>

        <Capes skin={skin} />
        <YarnMane skin={skin} />
        <MahoragaWheel skin={skin} animate={animate} />

        {/* TAIL */}
        <g className={tailWag ? "wag" : ""} style={{ transformOrigin: "72px 64px" }}>
          {skin === "mahoraga" ? (
            <g>
              <path d="M68 60 Q84 52 92 64 Q88 70 80 68 Q86 74 78 78 Q74 70 66 66 Z" fill="#c9c2ae" stroke="#555" strokeWidth="0.8" />
              <path d="M76 62 l8 4 M74 68 l8 4 M72 74 l6 4" stroke="#8a8270" strokeWidth="0.8" />
            </g>
          ) : skin === "pochacco" ? (
            <path d="M70 62 Q80 58 82 66 Q78 70 72 68 Z" fill="#1a1a1a" />
          ) : skin === "catto" || skin === "catnap" || skin === "spooky" || skin === "eevee" ? (
            <path d="M68 64 Q86 58 90 40 Q92 34 88 32 Q86 40 82 46 Q84 38 80 36 Q78 48 70 58 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" />
          ) : skin === "penguin" ? (
            <ellipse cx="76" cy="68" rx="5" ry="8" fill="#1a1a22" stroke="#000" strokeWidth="0.6" transform="rotate(30 76 68)" />
          ) : skin === "ariel" ? (
            <g>
              <path d="M66 62 Q86 70 88 86 Q80 82 74 78 Q82 86 70 88 Q68 76 64 68 Z" fill="#00b8a9" stroke="#0a5a4a" strokeWidth="1" />
              <path d="M86 84 Q94 80 96 88 Q90 90 86 86 Z" fill="#7ff0d8" stroke="#0a5a4a" strokeWidth="0.6" />
              <path d="M86 84 Q94 92 88 96 Q84 90 86 86 Z" fill="#00b8a9" stroke="#0a5a4a" strokeWidth="0.6" />
            </g>
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
          <ellipse cx="37" cy="90" rx="4.5" ry="2.6" fill={isKissy || isHuggy ? "#ffe066" : skin === "penguin" ? "#f08a20" : pal.creamSh} />
          <ellipse cx="63" cy="90" rx="4.5" ry="2.6" fill={isKissy || isHuggy ? "#ffe066" : skin === "penguin" ? "#f08a20" : pal.creamSh} />
        </g>

        {/* BODY */}
        <g>
          <ellipse cx="50" cy="70" rx="22" ry="17" fill={`url(#fur-${skin})`} stroke={pal.outline} strokeWidth="1.2" />
          <ellipse cx="50" cy="74" rx="13" ry="10" fill={belly} />
          {skin === "creeper" && (
            <g fill="#1a2a10">
              <rect x="36" y="64" width="6" height="6" /><rect x="58" y="66" width="5" height="5" /><rect x="44" y="78" width="12" height="4" />
            </g>
          )}
          {!BODY_SKINS.has(skin) && (
            <g stroke={pal.darkR} strokeWidth="0.7" fill="none" opacity="0.55" strokeLinecap="round">
              <path d="M32 64 q3 -3 6 0" /><path d="M40 62 q3 -3 6 0" /><path d="M54 62 q3 -3 6 0" /><path d="M62 64 q3 -3 6 0" />
              <path d="M30 72 q3 -3 6 0" /><path d="M64 72 q3 -3 6 0" />
            </g>
          )}
        </g>

        <BodyCostume skin={skin} />
        <LongArms skin={skin} />
        {skin === "jockey" && <JockeyRider />}

        {/* FRONT LEGS */}
        <g>
          {dig ? (
            <><g style={{ transformOrigin: "40px 78px", animation: "wag 0.16s linear infinite" }}><rect x="34" y="76" width="9" height="12" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="38" cy="88" rx="5" ry="3" fill={isKissy || isHuggy ? "#ffe066" : pal.creamSh} /></g><g style={{ transformOrigin: "60px 78px", animation: "wag 0.16s linear infinite reverse" }}><rect x="57" y="76" width="9" height="12" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="62" cy="88" rx="5" ry="3" fill={isKissy || isHuggy ? "#ffe066" : pal.creamSh} /></g></>
          ) : fall ? (
            <><rect x="34" y="70" width="9" height="10" rx="4" fill={pal.dark} transform="rotate(-20 38 75)" /><rect x="57" y="70" width="9" height="10" rx="4" fill={pal.dark} transform="rotate(20 62 75)" /></>
          ) : (
            <><rect x="36" y="78" width="8" height="11" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><rect x="56" y="78" width="8" height="11" rx="4" fill={pal.dark} stroke={pal.outline} strokeWidth="1" /><ellipse cx="40" cy="89" rx="4.5" ry="2.6" fill={isKissy || isHuggy ? "#ffe066" : skin === "penguin" ? "#f08a20" : pal.creamSh} /><ellipse cx="60" cy="89" rx="4.5" ry="2.6" fill={isKissy || isHuggy ? "#ffe066" : skin === "penguin" ? "#f08a20" : pal.creamSh} /></>
          )}
        </g>

        <Neckwear skin={skin} />

        {/* HEAD */}
        <g>
          <Ears skin={skin} pal={pal} Wiry={Wiry} />

          <path d="M28 38 Q28 20 50 18 Q72 20 72 38 Q74 52 66 58 Q50 62 34 58 Q26 52 28 38 Z" fill={`url(#fur-${skin})`} stroke={pal.outline} strokeWidth="1.2" />
          <g stroke={pal.darkR} strokeWidth="0.7" fill="none" opacity="0.55" strokeLinecap="round"><path d="M32 28 q3 -3 6 0" /><path d="M42 24 q3 -3 6 0" /><path d="M54 24 q3 -3 6 0" /><path d="M62 28 q3 -3 6 0" /></g>
          <path d="M28 44 Q22 50 26 58 Q34 54 36 46 Z" fill={pal.light} />
          <path d="M72 44 Q78 50 74 58 Q66 54 64 46 Z" fill={pal.light} />

          {!hideTuft && (
            <g>
              <g stroke={pal.darkR} strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M42 20 q-2 8 -6 12" /><path d="M48 18 q0 8 -2 14" /><path d="M54 18 q2 8 4 12" /><path d="M60 22 q4 6 6 10" /></g>
              <path d="M40 18 Q50 12 60 18 Q56 22 50 20 Q44 22 40 18 Z" fill={pal.dark} />
            </g>
          )}

          {skin === "mahoraga" ? (
            <g fill="#fff" stroke="#b8b0a0" strokeWidth="0.8">
              <path d="M14 40 q4 -6 10 -2 q4 -4 8 0 q4 -2 4 4 q-4 4 -10 2 q-6 2 -12 -4 Z" />
              <path d="M86 40 q-4 -6 -10 -2 q-4 -4 -8 0 q-4 -2 -4 4 q4 4 10 2 q6 2 12 -4 Z" />
            </g>
          ) : skin !== "spider" && skin !== "darth" && (
            <g>
              <path d="M30 32 Q38 24 48 32 Q42 30 36 34 Q32 34 30 32 Z" fill={pal.light} stroke={pal.darkR} strokeWidth="0.6" />
              <path d="M70 32 Q62 24 52 32 Q58 30 64 34 Q68 34 70 32 Z" fill={pal.light} stroke={pal.darkR} strokeWidth="0.6" />
              <g stroke={pal.darkR} strokeWidth="0.7" fill="none" strokeLinecap="round"><path d="M34 30 l-2 4" /><path d="M40 28 l-1 4" /><path d="M46 30 l0 4" /><path d="M66 30 l2 4" /><path d="M60 28 l1 4" /><path d="M54 30 l0 4" /></g>
            </g>
          )}

          <path d="M38 42 Q50 38 62 42 Q64 52 58 58 Q50 62 42 58 Q36 52 38 42 Z" fill={pal.cream} stroke={pal.creamSh} strokeWidth="0.8" />

          {!hideBeard && (
            <g>
              <g stroke={pal.light} strokeWidth="1.1" fill="none" strokeLinecap="round"><path d="M40 52 q-2 6 -4 10" /><path d="M44 54 q-1 6 -2 10" /><path d="M48 55 q0 6 0 10" /><path d="M52 55 q0 6 0 10" /><path d="M56 54 q1 6 2 10" /><path d="M60 52 q2 6 4 10" /></g>
              <path d="M40 48 Q44 54 50 52 Q56 54 60 48 Q58 56 50 56 Q42 56 40 48 Z" fill={pal.light} />
            </g>
          )}

          {(skin === "catto" || skin === "catnap" || skin === "spooky") && <g stroke="#fff" strokeWidth="0.8" strokeLinecap="round"><path d="M36 48 l-12 -2 M36 50 l-12 1 M36 52 l-12 3 M64 48 l12 -2 M64 50 l12 1 M64 52 l12 3" /></g>}

          {/* eyes */}
          {skin === "mahoraga" ? null : hurt ? (
            <><path d="M36 40 l6 6 M42 40 l-6 6" stroke="#3a1a08" strokeWidth="2" strokeLinecap="round" /><path d="M58 40 l6 6 M64 40 l-6 6" stroke="#3a1a08" strokeWidth="2" strokeLinecap="round" /></>
          ) : dead ? (
            <><path d="M36 42 q4 4 8 0" stroke="#3a1a08" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M56 42 q4 4 8 0" stroke="#3a1a08" strokeWidth="2" fill="none" strokeLinecap="round" /></>
          ) : skin === "catnap" ? (
            <g stroke="#2a1040" strokeWidth="1.6" fill="none" strokeLinecap="round"><path d="M36 42 q4 3 8 0" /><path d="M56 42 q4 3 8 0" /></g>
          ) : skin === "spider" ? null : (
            <g className={animate ? "blink" : ""} style={{ transformOrigin: "50px 42px" }}>
              <ellipse cx="40" cy="42" rx="4.4" ry={win ? 4.8 : 5.4} fill="#fff" />
              <ellipse cx="60" cy="42" rx="4.4" ry={win ? 4.8 : 5.4} fill="#fff" />
              <circle cx="40.5" cy="43" r="3.4" fill={isKissy ? "#3aa0ff" : isHuggy ? "#1a1a2e" : skin === "sukuna" ? "#c93030" : skin === "ender" ? "#b06bff" : skin === "gojo" ? "#7fd0ff" : `url(#eye-${skin})`} />
              <circle cx="60.5" cy="43" r="3.4" fill={isKissy ? "#3aa0ff" : isHuggy ? "#1a1a2e" : skin === "sukuna" ? "#c93030" : skin === "ender" ? "#b06bff" : skin === "gojo" ? "#7fd0ff" : `url(#eye-${skin})`} />
              {skin === "catto" ? <><ellipse cx="41" cy="43" rx="0.8" ry="2.4" fill="#0a0402" /><ellipse cx="61" cy="43" rx="0.8" ry="2.4" fill="#0a0402" /></>
                : skin === "bigotes" ? <><circle cx="41" cy="43" r="1.6" fill="#0a0402" /><circle cx="61" cy="43" r="1.6" fill="#ff3030" /></>
                : <><circle cx="41" cy="43" r="1.6" fill="#0a0402" /><circle cx="61" cy="43" r="1.6" fill="#0a0402" /></>}
              <circle cx="42.2" cy="41.6" r="0.9" fill="#fff" /><circle cx="62.2" cy="41.6" r="0.9" fill="#fff" />
              {isKissy && <g stroke="#1a3a6a" strokeWidth="0.7" fill="none"><path d="M36 38 q4 -2 8 0" /><path d="M56 38 q4 -2 8 0" /></g>}
            </g>
          )}

          {skin === "mahoraga" ? (
            <g>
              <ellipse cx="50" cy="52" rx="8" ry="5.5" fill="#fff" stroke="#3a3a3a" strokeWidth="1.2" />
              <path d="M45 47 v10 M48 47 v10 M51 47 v10 M54 47 v10" stroke="#3a3a3a" strokeWidth="0.9" />
            </g>
          ) : (
            <g>
              {skin === "penguin" ? (
                <path d="M44 46 L50 56 L56 46 Q50 44 44 46 Z" fill="#f08a20" stroke="#b45a10" strokeWidth="0.7" />
              ) : (
                <path d="M45 47 Q50 44 55 47 Q56 51 50 53 Q44 51 45 47 Z" fill={skin === "catto" ? "#ff7a9a" : pal.nose} />
              )}
              {skin !== "catto" && skin !== "penguin" && <ellipse cx="48.5" cy="47.5" rx="1.4" ry="0.8" fill="#fff" opacity="0.75" />}
              {win ? <g><path d="M44 54 Q50 62 56 54 Q52 58 50 58 Q48 58 44 54 Z" fill="#5a1410" /><path d="M47 56 Q50 60 53 56 Q50 58 47 56 Z" fill="#ff7a9a" /></g>
                : hurt || dead ? <path d="M45 56 Q50 53 55 56" stroke="#3a1a08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                : skin === "huggy" ? <path d="M40 54 Q50 62 60 54 Q50 58 40 54 Z" fill="#1a0a10" />
                : skin === "bigotes" ? <g><path d="M42 54 Q50 62 58 54 Q54 58 50 58 Q46 58 42 54 Z" fill="#3a0810" /><path d="M45 55 l1 4 M49 56 l0 4 M53 56 l-1 4" stroke="#fff" strokeWidth="1" /></g>
                : skin === "pochacco" ? null
                : <path d="M46 55 Q50 58 54 55" stroke="#3a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
              {(skin === "vampire" || skin === "draculaura") && <g fill="#fff" stroke="#dcdcdc" strokeWidth="0.3"><path d="M46 55 l1.4 3 l1.4 -3 Z" /><path d="M51.2 55 l1.4 3 l1.4 -3 Z" /></g>}
              {skin === "laufey" && <ellipse cx="50" cy="56" rx="3.2" ry="1.1" fill="#c43a4a" opacity="0.85" />}
            </g>
          )}

          <HeadGear skin={skin} />
        </g>

        <HeldProps skin={skin} />
      </g>
      </g>

      {win && <g fill="#ffe066"><path d="M16 24 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /><path d="M84 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z" /></g>}
    </svg>
  );
}

function Capes({ skin }: { skin: SkinId }) {
  if (skin === "vampire") return (
    <g>
      <path d="M22 48 Q14 78 26 92 L50 86 L74 92 Q86 78 78 48 Q66 56 50 56 Q34 56 22 48 Z" fill="url(#cape-vampire)" stroke="#0c0612" strokeWidth="1.2" />
      <path d="M26 52 Q22 76 30 88 L50 82 L70 88 Q78 76 74 52 Q64 60 50 60 Q36 60 26 52 Z" fill="#7a1430" opacity="0.9" />
    </g>
  );
  if (skin === "bat" || skin === "darth") return (
    <g>
      <path d="M18 46 Q8 80 24 96 L50 88 L76 96 Q92 80 82 46 Q66 58 50 56 Q34 58 18 46 Z" fill="#0a0a0c" stroke="#000" strokeWidth="1.2" />
      <path d="M24 50 Q16 78 28 90 L50 84 L72 90 Q84 78 76 50 Q64 60 50 58 Q36 60 24 50 Z" fill={skin === "darth" ? "#141418" : "#222"} />
      {skin === "bat" && <path d="M30 70 L26 86 L34 80 L38 90 L44 78 L50 92 L56 78 L62 90 L66 80 L74 86 L70 70" fill="#111" />}
    </g>
  );
  return null;
}

function YarnMane({ skin }: { skin: SkinId }) {
  if (skin !== "yarnaby") return null;
  return (
    <g>
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const x = 50 + Math.cos(a) * 27; const y = 42 + Math.sin(a) * 27;
        const hue = (i / 28) * 360; const len = 22 + (i % 3) * 4;
        return (
          <g key={i} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}>
            <path d={`M${x} ${y} c-3 -9 -5 -16 0 -${len} c4 5 3 13 0 ${len} Z`} fill={`hsl(${hue} 85% 58%)`} stroke={`hsl(${hue} 78% 32%)`} strokeWidth="1.1" strokeLinecap="round" />
            <path d={`M${x} ${y + 1} c-1.5 -6 -2 -10 0 -${len - 4}`} fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.35" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function MahoragaWheel({ skin, animate }: { skin: SkinId; animate: boolean }) {
  if (skin !== "mahoraga") return null;
  return (
    <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: animate ? "spin-slow 3.5s linear infinite" : undefined }}>
      <g transform="translate(50 6)">
        <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="#c9a86a" strokeWidth="3.2" />
        <ellipse cx="0" cy="0" rx="20" ry="6" fill="none" stroke="#ffd27a" strokeWidth="1" opacity="0.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2; const x = Math.cos(a) * 20; const y = Math.sin(a) * 6;
          return <g key={i}><line x1="0" y1="0" x2={x} y2={y} stroke="#8a6a2a" strokeWidth="2.2" /><line x1="0" y1="0" x2={x} y2={y} stroke="#ffd27a" strokeWidth="0.9" /><circle cx={x} cy={y} r="2.6" fill="#2a1a0a" stroke="#c9a86a" strokeWidth="0.9" /><circle cx={x} cy={y} r="1" fill="#ffd27a" /></g>;
        })}
        <circle cx="0" cy="0" r="4" fill="#2a1a0a" stroke="#c9a86a" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="2" fill="#ffd27a" />
      </g>
    </g>
  );
}

function BodyCostume({ skin }: { skin: SkinId }) {
  switch (skin) {
    case "lime": return <g><path d="M29 66 Q50 56 71 66 L70 82 Q50 90 30 82 Z" fill="#a8e85a" stroke="#4f7a1e" strokeWidth="1.3" /><path d="M29 66 Q50 56 71 66 L70 70 Q50 62 30 70 Z" fill="#c6ff7a" /><path d="M40 58 Q50 62 60 58 L60 64 Q50 68 40 64 Z" fill="#7fc24a" stroke="#4f7a1e" strokeWidth="1" /><circle cx="50" cy="74" r="3" fill="#fff" opacity="0.5" /><path d="M47 74 q3 2 6 0" stroke="#4f7a1e" strokeWidth="0.7" fill="none" /></g>;
    case "harness": return <g stroke="#ff5fa0" strokeWidth="3.2" fill="none" strokeLinecap="round"><path d="M36 60 L44 84" /><path d="M64 60 L56 84" /><path d="M30 72 L70 72" /><circle cx="50" cy="72" r="3.4" fill="#ffd27a" stroke="#b8730a" strokeWidth="1" /><circle cx="50" cy="72" r="1.2" fill="#fff" /></g>;
    case "princess": return <g><path d="M26 68 Q50 58 74 68 L78 88 Q68 84 64 90 Q58 84 52 90 Q46 84 40 90 Q34 84 26 90 Z" fill="#ffb3d1" stroke="#c93a78" strokeWidth="1.2" /><path d="M26 68 Q50 62 74 68 L72 74 Q50 68 28 74 Z" fill="#ffd9e6" /><path d="M30 78 q6 4 12 0 M48 80 q6 4 12 0 M58 78 q6 4 10 0" stroke="#fff" strokeWidth="1" fill="none" /></g>;
    case "santa": return <g><path d="M28 64 Q50 56 72 64 L72 80 Q50 88 28 80 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1" /><path d="M28 76 Q50 70 72 76 L72 82 Q50 88 28 82 Z" fill="#fff" /><path d="M28 64 Q50 58 72 64 L70 68 Q50 64 30 68 Z" fill="#ff5a4a" /></g>;
    case "yuta": return <g>
      <path d="M30 62 Q50 55 70 62 L70 84 Q50 91 30 84 Z" fill="#f4f6fa" stroke="#b8c0cc" strokeWidth="1.2" />
      <path d="M40 58 Q50 62 60 58 L60 66 Q50 70 40 66 Z" fill="#fff" stroke="#b8c0cc" strokeWidth="1" />
      <circle cx="48" cy="64" r="0.9" fill="#c9a86a" /><circle cx="52" cy="64" r="0.9" fill="#c9a86a" />
      <path d="M32 64 L70 86" stroke="#1a1a1a" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="33" y="62" width="7" height="3.2" rx="1" fill="#c9a86a" stroke="#7a5a2a" strokeWidth="0.5" />
      <rect x="28" y="78" width="44" height="8" fill="#1a1a22" />
    </g>;
    case "yuji": return <g>
      <path d="M30 62 Q50 54 70 62 L70 84 Q50 92 30 84 Z" fill="#1c2744" stroke="#0a1020" strokeWidth="1.2" />
      <path d="M38 58 Q50 62 62 58 L60 70 Q50 74 40 70 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1" />
      <path d="M44 62 L50 72 L56 62" fill="#b01018" />
      <path d="M32 78 h36" stroke="#c9a86a" strokeWidth="1.4" />
      <circle cx="36" cy="72" r="1.1" fill="#c9a86a" /><circle cx="64" cy="72" r="1.1" fill="#c9a86a" />
    </g>;
    case "pochacco": return <g>
      <path d="M28 64 Q50 55 72 64 L72 84 Q50 91 28 84 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1.2" />
      <path d="M28 64 L18 72 L22 80 L30 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" />
      <path d="M72 64 L82 72 L78 80 L70 74 Z" fill="#d4145a" stroke="#7a0830" strokeWidth="1" />
      <path d="M28 64 Q50 60 72 64 L71 68 Q50 63 29 68 Z" fill="#ff2d7a" />
    </g>;
    case "mahoraga": return <g><path d="M28 74 L24 92 L40 90 L50 92 L60 90 L76 92 L72 74 Z" fill="#14181c" stroke="#000" strokeWidth="1" /><rect x="28" y="70" width="44" height="6" fill="#8a9498" stroke="#3a4044" strokeWidth="0.8" /><path d="M46 73 q-4 4 -2 8 q4 -2 6 -4 q2 2 6 4 q2 -4 -2 -8 Z" fill="#8a2020" /></g>;
    case "gojo": return <g>
      <path d="M29 64 Q50 54 71 64 L70 84 Q50 92 30 84 Z" fill="#1a2340" stroke="#0a1020" strokeWidth="1.2" />
      <path d="M40 58 Q50 62 60 58 L60 66 Q50 70 40 66 Z" fill="#e8eef8" stroke="#9aa8c0" strokeWidth="0.9" />
      <path d="M32 78 h36" stroke="#c9a86a" strokeWidth="1.2" />
    </g>;
    case "nobara": return <g>
      <path d="M28 64 Q50 54 72 64 L71 84 Q50 92 29 84 Z" fill="#6a3a1a" stroke="#3a2010" strokeWidth="1.2" />
      <rect x="34" y="70" width="7" height="7" fill="#d44a6a" stroke="#5a1020" strokeWidth="0.6" />
      <rect x="59" y="70" width="7" height="7" fill="#d44a6a" stroke="#5a1020" strokeWidth="0.6" />
      <rect x="72" y="60" width="3" height="16" rx="1" fill="#5a3a1a" />
      <rect x="68" y="58" width="11" height="5" rx="1" fill="#c9a86a" />
    </g>;
    case "megumi": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#1a1a2e" stroke="#0a0a1a" strokeWidth="1.2" />
      <path d="M40 58 Q50 62 60 58 L60 66 Q50 70 40 66 Z" fill="#e8eef8" stroke="#7a8ab0" strokeWidth="0.8" />
      {/* divine dog pup */}
      <g transform="translate(70 52)">
        <ellipse cx="0" cy="6" rx="7" ry="5" fill="#2a2a3a" stroke="#000" strokeWidth="0.6" />
        <circle cx="2" cy="0" r="4" fill="#2a2a3a" stroke="#000" strokeWidth="0.6" />
        <circle cx="1" cy="-1" r="0.7" fill="#7fd0ff" /><circle cx="4" cy="-1" r="0.7" fill="#7fd0ff" />
      </g>
    </g>;
    case "sukuna": return <g>
      <path d="M28 64 Q50 54 72 64 L72 84 Q50 92 28 84 Z" fill="#c93030" stroke="#7a1020" strokeWidth="1.2" />
      <path d="M38 62 L46 86 M54 62 L62 86" stroke="#1a0a0a" strokeWidth="1.4" />
      <path d="M42 70 h16" stroke="#1a0a0a" strokeWidth="1" />
      <ellipse cx="50" cy="74" rx="6" ry="4" fill="#e3c79a" />
    </g>;
    case "draculaura": return <g>
      <path d="M28 66 Q50 58 72 66 L76 88 Q50 94 24 88 Z" fill="#ff8fb6" stroke="#b02a66" strokeWidth="1.2" />
      <path d="M28 66 Q50 62 72 66 L70 72 Q50 68 30 72 Z" fill="#1a1a1a" />
      <circle cx="50" cy="78" r="2.4" fill="#fff" /><path d="M48 76 l4 4 M52 76 l-4 4" stroke="#ff5fa0" strokeWidth="0.6" />
      <g transform="translate(68 58)"><ellipse cx="0" cy="0" rx="5" ry="3" fill="#1a1a1a" /><path d="M-4 -1 L-8 -6 L-2 -3 Z M4 -1 L8 -6 L2 -3 Z" fill="#1a1a1a" /></g>
    </g>;
    case "frankie": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#7fc24a" stroke="#2a5a10" strokeWidth="1.2" />
      <path d="M34 68 L34 84 M50 68 L50 84 M66 68 L66 84" stroke="#2a5a10" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x="28" y="70" width="4" height="4" fill="#c9a86a" stroke="#3a2010" strokeWidth="0.5" />
      <rect x="68" y="70" width="4" height="4" fill="#c9a86a" stroke="#3a2010" strokeWidth="0.5" />
    </g>;
    case "schnauzarella": return <g>
      <path d="M24 68 Q50 56 76 68 L80 90 Q50 96 20 90 Z" fill="#7fd0ff" stroke="#1a5a8a" strokeWidth="1.2" />
      <path d="M24 68 Q50 62 76 68 L74 74 Q50 68 26 74 Z" fill="#fff" opacity="0.7" />
      <ellipse cx="36" cy="88" rx="5" ry="2.2" fill="#d8f4ff" stroke="#7fd0ff" strokeWidth="0.6" />
    </g>;
    case "ariel": return <g>
      <path d="M32 62 Q50 56 68 62 L66 74 Q50 68 34 74 Z" fill="#5ad0c8" stroke="#0a5a4a" strokeWidth="1" />
      <ellipse cx="50" cy="68" rx="5" ry="3.4" fill="#fff8e0" stroke="#e8c070" strokeWidth="0.7" />
      <path d="M46 66 q4 3 8 0" stroke="#e8c070" strokeWidth="0.5" fill="none" />
    </g>;
    case "captain": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#1a3a8a" stroke="#0a1a4a" strokeWidth="1.2" />
      <path d="M30 64 Q50 58 70 64 L68 70 Q50 66 32 70 Z" fill="#d9342b" />
      <circle cx="50" cy="74" r="7" fill="#fff" stroke="#d9342b" strokeWidth="1.3" />
      <path d="M50 68 l2 4 l4 0 l-3 3 l1 4 l-4 -3 l-4 3 l1 -4 l-3 -3 l4 0 Z" fill="#d9342b" />
    </g>;
    case "huggy": return <g>
      <path d="M38 58 Q50 64 62 58 L58 68 L50 70 L42 68 Z" fill="#1a1a2e" />
      <circle cx="50" cy="62" r="2" fill="#fff" />
    </g>;
    case "catnap": return <g>
      <path d="M32 62 Q50 58 68 62 L66 70 Q50 74 34 70 Z" fill="#3a1a5a" stroke="#1a0830" strokeWidth="1" />
      <circle cx="50" cy="66" r="4" fill="#ffd27a" stroke="#7a5a2a" strokeWidth="0.6" />
      <path d="M50 64 Q53 66 50 69 Q47 66 50 64" fill="#7a3ab0" />
    </g>;
    case "eleven": return <g>
      <path d="M30 64 Q50 56 70 64 L72 86 Q50 92 28 86 Z" fill="#ff8fb6" stroke="#b02a66" strokeWidth="1.2" />
      <rect x="43" y="72" width="14" height="8" rx="1" fill="#e8c070" stroke="#7a5a2c" strokeWidth="0.6" />
      <path d="M45 74 h10 M45 76 h10 M45 78 h10 M48 72 v8 M52 72 v8" stroke="#7a5a2c" strokeWidth="0.45" />
    </g>;
    case "rm": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.2" />
      <path d="M38 64 L38 84 M62 64 L62 84" stroke="#3a3a3a" strokeWidth="1.2" />
      <rect x="43" y="70" width="14" height="9" rx="1" fill="#c9a86a" stroke="#7a5a2a" strokeWidth="0.7" />
      <path d="M50 70 v9" stroke="#7a5a2c" strokeWidth="0.6" />
    </g>;
    case "steve": return <g>
      <path d="M30 64 Q50 56 70 64 L70 78 Q50 72 30 78 Z" fill="#3aa0d0" stroke="#1a4a6e" strokeWidth="1.2" />
      <path d="M30 76 L30 88 Q50 92 70 88 L70 76 Q50 80 30 76 Z" fill="#5a3a22" />
      <rect x="68" y="58" width="3.2" height="16" fill="#7a5a2c" />
      <rect x="64" y="56" width="11" height="5" fill="#c8d0d4" stroke="#6a7074" strokeWidth="0.5" />
    </g>;
    case "alex": return <g>
      <path d="M30 64 Q50 56 70 64 L70 78 Q50 72 30 78 Z" fill="#e07020" stroke="#7a3a10" strokeWidth="1.2" />
      <path d="M30 76 L30 88 Q50 92 70 88 L70 76 Q50 80 30 76 Z" fill="#3a5a8a" />
    </g>;
    case "creeper": return <g>
      <rect x="36" y="66" width="8" height="8" fill="#0a0a0a" /><rect x="56" y="66" width="8" height="8" fill="#0a0a0a" />
      <rect x="42" y="74" width="16" height="5" fill="#0a0a0a" /><rect x="46" y="79" width="8" height="5" fill="#0a0a0a" />
    </g>;
    case "darth": return <g>
      <path d="M28 62 Q50 54 72 62 L72 86 Q50 94 28 86 Z" fill="#0c0c10" stroke="#000" strokeWidth="1.2" />
      <rect x="40" y="68" width="20" height="12" rx="1" fill="#1a1a1e" stroke="#444" strokeWidth="0.6" />
      <rect x="42" y="70" width="6" height="3" fill="#c93030" /><rect x="50" y="70" width="8" height="3" fill="#3a8ac0" />
      <rect x="42" y="75" width="16" height="2" fill="#2a2a2a" />
      <circle cx="44" cy="76" r="0.7" fill="#ffd27a" /><circle cx="56" cy="76" r="0.7" fill="#7fd0ff" />
    </g>;
    case "padme": return <g>
      <path d="M24 66 Q50 56 76 66 L80 90 Q50 98 20 90 Z" fill="url(#gown-padme)" stroke="#3a0814" strokeWidth="1.2" />
      <path d="M24 66 Q50 60 76 66 L74 72 Q50 66 26 72 Z" fill="#c9a86a" />
      <path d="M36 78 q14 6 28 0" stroke="#ffd27a" strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="76" r="2.2" fill="#ffd27a" stroke="#8a6a20" strokeWidth="0.5" />
    </g>;
    case "unicornio": return <g>
      <path d="M32 64 Q50 72 68 64" stroke="#ff8fb6" strokeWidth="2" fill="none" />
      <path d="M34 68 Q50 76 66 68" stroke="#7fd0ff" strokeWidth="2" fill="none" />
      <path d="M36 72 Q50 80 64 72" stroke="#b06bff" strokeWidth="2" fill="none" />
    </g>;
    case "pirata": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2" />
      <path d="M30 64 Q50 58 70 64 L68 70 Q50 66 32 70 Z" fill="#1a1a1a" />
      <circle cx="42" cy="74" r="1.4" fill="#ffd27a" /><circle cx="58" cy="74" r="1.4" fill="#ffd27a" />
      <path d="M72 70 Q86 66 88 78" stroke="#8a8a8a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M86 76 q4 2 2 6 q-4 0 -4 -4" fill="#8a8a8a" />
    </g>;
    case "astronauta": return <g>
      <path d="M28 62 Q50 54 72 62 L74 86 Q50 94 26 86 Z" fill="#f4f6fa" stroke="#7a8aa8" strokeWidth="1.3" />
      <rect x="42" y="70" width="16" height="10" rx="1.5" fill="#1a2a40" stroke="#7a8aa8" strokeWidth="0.7" />
      <circle cx="46" cy="75" r="1.4" fill="#3ad060" /><circle cx="52" cy="75" r="1.4" fill="#ffd27a" /><circle cx="58" cy="75" r="1.4" fill="#ff4040" />
    </g>;
    case "zombie": return <g>
      <path d="M30 64 Q50 56 70 64 L68 84 Q50 90 32 84 Z" fill="#4a5a30" stroke="#2a3a10" strokeWidth="1" />
      <path d="M34 70 L38 84 M60 68 L56 86" stroke="#1a1a1a" strokeWidth="1.1" strokeDasharray="3 2" />
    </g>;
    case "ninja": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.2" />
      <path d="M30 64 Q50 60 70 64 L68 68 Q50 64 32 68 Z" fill="#7a1410" />
    </g>;
    case "mago": return <g>
      <path d="M28 64 Q50 54 72 64 L74 88 Q50 94 26 88 Z" fill="#1a1450" stroke="#0a0830" strokeWidth="1.2" />
      <circle cx="40" cy="74" r="1.2" fill="#ffd27a" /><circle cx="60" cy="78" r="1.2" fill="#ffd27a" />
      <path d="M50 70 l1.2 2.4 l2.6 0.2 l-2 1.8 l0.6 2.6 l-2.4 -1.4 l-2.4 1.4 l0.6 -2.6 l-2 -1.8 l2.6 -0.2 Z" fill="#ffd27a" />
    </g>;
    case "payaso": return <g>
      <path d="M28 64 Q50 54 72 64 L72 84 Q50 92 28 84 Z" fill="#fff" stroke="#d7d2c4" strokeWidth="1.2" />
      <circle cx="38" cy="72" r="2.6" fill="#ff5fa0" /><circle cx="62" cy="72" r="2.6" fill="#7fd0ff" /><circle cx="50" cy="78" r="2.6" fill="#ffd27a" />
    </g>;
    case "clawdeen": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#4a1a60" stroke="#2a0a40" strokeWidth="1.2" />
      <path d="M30 64 Q50 58 70 64 L68 70 Q50 66 32 70 Z" fill="#1a0a10" />
      <circle cx="50" cy="74" r="3.4" fill="#ffd27a" stroke="#7a5a0a" strokeWidth="0.6" />
      <path d="M48 72 l2 3 l2 -3" fill="none" stroke="#7a5a0a" strokeWidth="0.6" />
    </g>;
    case "cleo": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#1a8ab0" stroke="#0a4a60" strokeWidth="1.2" />
      <rect x="34" y="70" width="32" height="4" fill="#ffd27a" stroke="#7a5a0a" strokeWidth="0.5" />
      <rect x="47" y="70" width="6" height="10" fill="#c9a020" />
      <path d="M32 78 h36" stroke="#ffd27a" strokeWidth="1.4" />
    </g>;
    case "ghoulia": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#a8c0d8" stroke="#4a5a80" strokeWidth="1.2" />
      <rect x="36" y="70" width="28" height="5" rx="1" fill="#ff5fa0" stroke="#b02a66" strokeWidth="0.5" />
    </g>;
    case "bella": return <g>
      <path d="M24 68 Q50 56 76 68 L80 90 Q50 98 20 90 Z" fill="#ffd027" stroke="#8a6a00" strokeWidth="1.2" />
      <path d="M24 68 Q50 62 76 68 L74 74 Q50 68 26 74 Z" fill="#fff6c0" opacity="0.7" />
      <g transform="translate(62 78)"><circle cx="0" cy="0" r="3.2" fill="#d44a6a" stroke="#7a1430" strokeWidth="0.5" /><circle cx="0" cy="0" r="1.4" fill="#ff8fa0" /></g>
    </g>;
    case "jasmine": return <g>
      <path d="M32 62 Q50 54 68 62 L68 74 Q50 68 32 74 Z" fill="#2ec4b6" stroke="#0a5a58" strokeWidth="1.2" />
      <path d="M32 74 Q50 84 68 74 L68 86 Q50 92 32 86 Z" fill="#1aa89c" stroke="#0a5a58" strokeWidth="1" />
      <circle cx="50" cy="70" r="2" fill="#ffd27a" stroke="#8a6a20" strokeWidth="0.5" />
      <path d="M28 64 L22 78 M72 64 L78 78" stroke="#2ec4b6" strokeWidth="3.4" strokeLinecap="round" />
    </g>;
    case "tiana": return <g>
      <path d="M26 68 Q50 58 74 68 L78 90 Q50 96 22 90 Z" fill="#2e8a3a" stroke="#145018" strokeWidth="1.2" />
      <path d="M26 68 Q50 62 74 68 L72 74 Q50 68 28 74 Z" fill="#7fc24a" opacity="0.7" />
      <circle cx="50" cy="76" r="2" fill="#fff" />
    </g>;
    case "widow": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#141418" stroke="#000" strokeWidth="1.2" />
      <path d="M44 68 Q50 64 56 68 Q54 74 50 72 Q46 74 44 68 Z" fill="#c93030" />
      <circle cx="50" cy="74" r="1.2" fill="#fff" />
    </g>;
    case "spider": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2" />
      <path d="M30 64 Q50 58 70 64 L68 70 Q50 66 32 70 Z" fill="#1a3a8a" />
      <path d="M50 62 v24 M36 70 Q50 66 64 70 M34 78 Q50 72 66 78 M38 86 Q50 80 62 86" stroke="#fff" strokeWidth="0.7" fill="none" />
    </g>;
    case "wonder": return <g>
      <path d="M30 64 Q50 54 70 64 L70 84 Q50 92 30 84 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2" />
      <path d="M32 70 h36 v4 h-36 Z" fill="#ffd27a" />
      <path d="M30 78 Q50 88 70 78 L70 86 Q50 92 30 86 Z" fill="#1a1a4a" />
      <rect x="26" y="66" width="6" height="8" rx="1" fill="#ffd27a" /><rect x="68" y="66" width="6" height="8" rx="1" fill="#ffd27a" />
    </g>;
    case "dogday": return <g>
      <circle cx="50" cy="70" r="5" fill="#ffd27a" stroke="#7a5a0a" strokeWidth="0.7" />
      <circle cx="50" cy="70" r="2" fill="#fff" />
    </g>;
    case "craftycorn": return <g>
      <path d="M44 66 L50 78 L56 66 Z" fill="#fff" stroke="#b06bff" strokeWidth="0.7" />
      <path d="M40 74 q10 6 20 0" stroke="#ff8fb6" strokeWidth="1.4" fill="none" />
    </g>;
    case "ender": return <g>
      <circle cx="50" cy="74" r="2.4" fill="#b06bff" stroke="#7a3ab0" strokeWidth="0.6" />
      <circle cx="50" cy="74" r="0.8" fill="#fff" />
    </g>;
    case "boxer": return <g>
      <path d="M32 72 Q50 68 68 72 L70 88 Q50 94 30 88 Z" fill="#f4f1e8" stroke="#3a2010" strokeWidth="1" />
      <path d="M34 78 h32" stroke="#d9342b" strokeWidth="3" />
      <path d="M36 68 Q50 64 64 68 L62 74 Q50 78 38 74 Z" fill="#c9a020" stroke="#7a5a0a" strokeWidth="0.8" />
      <circle cx="50" cy="71" r="2" fill="#ffd27a" />
    </g>;
    case "laufey": return <g>
      <path d="M28 66 Q50 56 72 66 L74 88 Q50 94 26 88 Z" fill="#1a1210" stroke="#0a0604" strokeWidth="1.2" />
      <path d="M28 66 Q50 60 72 66 L70 72 Q50 66 30 72 Z" fill="#f3e6d0" />
      <path d="M36 76 q14 5 28 0" stroke="#c9a86a" strokeWidth="1" fill="none" />
    </g>;
    case "penguin": return <g>
      <path d="M40 62 Q50 66 60 62 L58 70 L50 72 L42 70 Z" fill="#d9342b" />
      <circle cx="50" cy="66" r="1.6" fill="#ffd27a" />
    </g>;
    case "bigotes": return <g>
      <path d="M32 60 Q50 66 68 60 L66 70 Q50 74 34 70 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${36 + i * 4.6} 62 l1 -5 l1 5 Z`} fill="#d7d2c4" />)}
    </g>;
    case "bow": return <path d="M38 58 Q50 64 62 58 L58 68 L50 70 L42 68 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1" />;
    case "eevee": return <g>
      <ellipse cx="50" cy="62" rx="12" ry="6" fill="#fff3d6" />
      <path d="M32 58 Q28 48 36 52 Q34 58 32 60 Z" fill="#fff3d6" />
      <path d="M68 58 Q72 48 64 52 Q66 58 68 60 Z" fill="#fff3d6" />
    </g>;
    case "kira": return <g>
      <path d="M30 62 Q40 58 50 64 Q60 58 70 62" fill="none" stroke="#1a1a1a" strokeWidth="4" />
      <path d="M36 56 L32 72 M64 56 L68 72" stroke="#1a1a1a" strokeWidth="3.2" />
      <ellipse cx="38" cy="66" rx="5" ry="7" fill="#1a1a1a" />
      <ellipse cx="62" cy="66" rx="5" ry="7" fill="#1a1a1a" />
    </g>;
    case "spooky": return <g>
      <path d="M40 60 Q50 66 60 60" fill="none" stroke="#ffb347" strokeWidth="1.2" />
      <circle cx="50" cy="68" r="2" fill="#7a1430" />
    </g>;
    case "matrona": return <g>
      <path d="M28 62 Q50 54 72 62 L74 86 Q50 94 26 86 Z" fill="#d41a1a" stroke="#7a0808" strokeWidth="1.2" />
      <path d="M40 58 Q50 62 60 58 L58 68 Q50 72 42 68 Z" fill="#b01010" />
      <path d="M48 64 h4 v6 h-4 Z" fill="#fff" />
      <path d="M46 66 h8" stroke="#fff" strokeWidth="1.6" />
      <circle cx="50" cy="76" r="3" fill="#d7d2c4" stroke="#2a2a2a" strokeWidth="0.7" />
    </g>;
    case "subzero": return <g>
      <path d="M30 62 Q50 54 70 62 L70 84 Q50 92 30 84 Z" fill="#1a4a8a" stroke="#0a2048" strokeWidth="1.2" />
      <path d="M30 62 Q50 58 70 62 L68 68 Q50 64 32 68 Z" fill="#7fd0ff" opacity="0.55" />
      <path d="M36 70 h28" stroke="#7fd0ff" strokeWidth="1.4" />
      <path d="M28 66 Q16 60 12 74" stroke="#1a4a8a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M72 66 Q84 60 88 74" stroke="#1a4a8a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>;
    case "barbie": return <g>
      <path d="M26 66 Q50 56 74 66 L78 90 Q50 96 22 90 Z" fill="#ff6bb5" stroke="#b02a66" strokeWidth="1.2" />
      <path d="M26 66 Q50 60 74 66 L72 72 Q50 66 28 72 Z" fill="#ffd0e8" />
      <circle cx="50" cy="76" r="2.4" fill="#ffd27a" />
    </g>;
    case "bebe": return <g>
      <path d="M34 70 Q50 66 66 70 L64 84 Q50 88 36 84 Z" fill="#fff3d6" stroke="#e8c8a0" strokeWidth="1" />
      <path d="M40 78 h20" stroke="#ff8fb6" strokeWidth="2" />
      <circle cx="50" cy="62" r="3" fill="#ff8fb6" />
    </g>;
    case "abuela": return <g>
      <path d="M28 64 Q50 58 72 64 L74 86 Q50 92 26 86 Z" fill="#7a3a6a" stroke="#3a1830" strokeWidth="1.2" />
      <path d="M30 72 q20 8 40 0" stroke="#c9a86a" strokeWidth="1.4" fill="none" />
    </g>;
    case "sabio": return <g>
      <path d="M28 64 Q50 56 72 64 L74 88 Q50 94 26 88 Z" fill="#3a2a18" stroke="#1a1008" strokeWidth="1.2" />
      <path d="M32 70 q18 10 36 0" stroke="#c9a86a" strokeWidth="1.6" fill="none" />
      <rect x="74" y="48" width="3.2" height="36" rx="1" fill="#d99243" />
      <circle cx="75.6" cy="46" r="4" fill="#7fc24a" stroke="#2a5a10" strokeWidth="0.6" />
    </g>;
    case "freddy": return <g>
      <path d="M32 62 Q50 58 68 62 L66 78 Q50 84 34 78 Z" fill="#5a2a0a" />
      <path d="M44 64 L50 74 L56 64 Z" fill="#1a1a1a" />
      <rect x="46" y="70" width="8" height="3" fill="#c9a86a" />
    </g>;
    case "foxy": return <g>
      <path d="M36 60 Q50 66 64 60 L62 70 Q50 74 38 70 Z" fill="#ff8fa0" />
      <circle cx="50" cy="66" r="2" fill="#fff" />
      <path d="M72 70 Q86 64 88 78" stroke="#ffd27a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M86 76 q5 2 2 7 q-5 0 -5 -5" fill="#ffd27a" />
    </g>;
    case "bonnie": return <g>
      <path d="M32 64 Q50 58 68 64 L66 80 Q50 86 34 80 Z" fill="#4a2888" />
      <rect x="70" y="58" width="6" height="18" rx="1" fill="#d9342b" />
      <path d="M68 56 h10 l-2 6 h-6 Z" fill="#c02828" />
    </g>;
    case "chica": return <g>
      <path d="M32 62 Q50 56 68 62 L70 78 Q50 84 30 78 Z" fill="#fff" stroke="#3a2010" strokeWidth="0.8" />
      <text x="50" y="74" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="5" fill="#d9342b">EAT</text>
    </g>;
    case "hada": return <g>
      <path d="M18 40 Q6 28 16 18 Q28 28 26 44 Z" fill="#d8f4ff" stroke="#7fd0ff" strokeWidth="0.8" opacity="0.85" />
      <path d="M82 40 Q94 28 84 18 Q72 28 74 44 Z" fill="#ffe0f0" stroke="#ff8fb6" strokeWidth="0.8" opacity="0.85" />
      <path d="M32 64 Q50 56 68 64 L70 84 Q50 90 30 84 Z" fill="#f4e8ff" stroke="#b06bff" strokeWidth="1" />
      <path d="M32 64 Q50 60 68 64 L66 70 Q50 66 34 70 Z" fill="#fff" opacity="0.7" />
    </g>;
    case "panadero": return <g>
      <path d="M30 64 Q50 56 70 64 L70 84 Q50 92 30 84 Z" fill="#fff" stroke="#c8c0b0" strokeWidth="1.2" />
      <path d="M30 76 Q50 82 70 76 L70 86 Q50 92 30 86 Z" fill="#1a3a6a" />
      <path d="M32 70 h36" stroke="#d9342b" strokeWidth="2" />
    </g>;
    case "croissant": return <g>
      <path d="M28 62 Q50 70 72 62" stroke="#fff3d6" strokeWidth="2.4" fill="none" />
      <path d="M30 68 Q50 76 70 68" stroke="#ffd27a" strokeWidth="2" fill="none" />
      <path d="M32 74 Q50 80 68 74" stroke="#c9842a" strokeWidth="1.6" fill="none" />
    </g>;
    default: return null;
  }
}

function LongArms({ skin }: { skin: SkinId }) {
  if (skin === "kissy") return (
    <g>
      <path d="M30 68 Q10 54 4 74 Q0 86 14 88 Q10 80 16 76 Q10 86 22 84" fill="none" stroke="#ff7fb0" strokeWidth="7.4" strokeLinecap="round" />
      <path d="M70 68 Q90 54 96 74 Q100 86 86 88 Q90 80 84 76 Q90 86 78 84" fill="none" stroke="#ff7fb0" strokeWidth="7.4" strokeLinecap="round" />
      <circle cx="12" cy="87" r="5.2" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
      <circle cx="88" cy="87" r="5.2" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
    </g>
  );
  if (skin === "huggy") return (
    <g>
      <path d="M28 66 Q6 48 2 72 Q-2 90 16 90 Q8 80 18 76 Q8 88 24 84" fill="none" stroke="#3d8bff" strokeWidth="8" strokeLinecap="round" />
      <path d="M72 66 Q94 48 98 72 Q102 90 84 90 Q92 80 82 76 Q92 88 76 84" fill="none" stroke="#3d8bff" strokeWidth="8" strokeLinecap="round" />
      <circle cx="12" cy="90" r="5.4" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
      <circle cx="88" cy="90" r="5.4" fill="#ffe066" stroke="#b8910a" strokeWidth="0.9" />
      <path d="M8 88 h8 M84 88 h8" stroke="#c9a020" strokeWidth="0.6" />
    </g>
  );
  if (skin === "boxer") return (
    <g>
      <path d="M30 68 Q16 62 12 74" stroke="#e3c79a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M70 68 Q84 62 88 74" stroke="#e3c79a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="10" cy="78" rx="8" ry="7" fill="#d9342b" stroke="#7a1410" strokeWidth="1.1" />
      <ellipse cx="90" cy="78" rx="8" ry="7" fill="#d9342b" stroke="#7a1410" strokeWidth="1.1" />
      <path d="M6 76 h8 M86 76 h8" stroke="#fff" strokeWidth="1.1" />
      <path d="M8 80 h6 M88 80 h6" stroke="#7a1410" strokeWidth="0.6" />
    </g>
  );
  if (skin === "penguin") return (
    <g>
      <path d="M28 66 Q12 70 10 84 Q16 80 28 76 Z" fill="#1a1a22" stroke="#000" strokeWidth="0.8" />
      <path d="M72 66 Q88 70 90 84 Q84 80 72 76 Z" fill="#1a1a22" stroke="#000" strokeWidth="0.8" />
    </g>
  );
  if (skin === "padme") return (
    <g>
      <path d="M28 66 Q16 72 14 82" stroke="#6a1024" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M72 66 Q84 72 86 82" stroke="#6a1024" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="83" r="2.4" fill="#f0c090" /><circle cx="86" cy="83" r="2.4" fill="#f0c090" />
    </g>
  );
  if (skin === "yuji") return (
    <g>
      <path d="M30 66 Q18 70 16 80" stroke="#1c2744" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      <path d="M70 66 Q82 70 84 80" stroke="#1c2744" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="81" r="2.6" fill="#e3c79a" stroke="#6a4420" strokeWidth="0.5" />
      <circle cx="84" cy="81" r="2.6" fill="#e3c79a" stroke="#6a4420" strokeWidth="0.5" />
    </g>
  );
  if (skin === "laufey") return (
    <g>
      <path d="M28 66 Q16 74 18 84" stroke="#1a1210" strokeWidth="4.6" fill="none" strokeLinecap="round" />
      <path d="M72 66 Q84 74 82 84" stroke="#1a1210" strokeWidth="4.6" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="85" r="2.2" fill="#f0c090" /><circle cx="82" cy="85" r="2.2" fill="#f0c090" />
    </g>
  );
  return null;
}

function Neckwear({ skin }: { skin: SkinId }) {
  if (skin === "default") return <g><path d="M36 56 Q50 62 64 56 L60 70 L50 74 L40 70 Z" fill="#e23b3b" stroke="#7a1410" strokeWidth="1" /><circle cx="50" cy="62" r="3" fill="#ff6b6b" /><circle cx="44" cy="64" r="0.9" fill="#fff" /><circle cx="56" cy="64" r="0.9" fill="#fff" /><circle cx="50" cy="68" r="0.9" fill="#fff" /></g>;
  if (skin === "vampire") return <g><path d="M40 58 L50 64 L60 58 L56 66 L50 68 L44 66 Z" fill="#0c0612" /><circle cx="50" cy="62" r="2.4" fill="#e23b3b" stroke="#fff" strokeWidth="0.5" /></g>;
  if (skin === "princess") return <path d="M38 60 Q50 66 62 60" fill="none" stroke="#fff" strokeWidth="2.4" />;
  if (skin === "laufey") return <g><circle cx="44" cy="62" r="1.3" fill="#f4e8d0" /><circle cx="50" cy="64" r="1.3" fill="#f4e8d0" /><circle cx="56" cy="62" r="1.3" fill="#f4e8d0" /></g>;
  return null;
}

function Ears({ skin, pal, Wiry }: { skin: SkinId; pal: Pal; Wiry: (p: { cx: number; cy: number; n?: number; r?: number }) => ReactElement }) {
  if (skin === "yuta" || skin === "yuji" || skin === "megumi") {
    return <><path d="M28 32 Q20 40 26 52 Q34 46 36 36 Z" fill="#2a1a10" /><path d="M72 32 Q80 40 74 52 Q66 46 64 36 Z" fill="#2a1a10" /></>;
  }
  if (skin === "catto" || skin === "catnap" || skin === "spooky") {
    return <><path d="M28 32 L22 12 L40 26 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" /><path d="M30 28 L26 16 L36 25 Z" fill="#ff8fa0" /><path d="M72 32 L78 12 L60 26 Z" fill={pal.main} stroke={pal.outline} strokeWidth="1" /><path d="M70 28 L74 16 L64 25 Z" fill="#ff8fa0" /></>;
  }
  if (skin === "pochacco") {
    return <><path d="M26 32 Q12 40 14 66 Q22 70 28 60 Q32 46 34 36 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" /><path d="M74 32 Q88 40 86 66 Q78 70 72 60 Q68 46 66 36 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" /></>;
  }
  if (skin === "penguin") {
    return <><ellipse cx="30" cy="36" rx="5" ry="8" fill="#1a1a22" /><ellipse cx="70" cy="36" rx="5" ry="8" fill="#1a1a22" /></>;
  }
  if (skin === "eevee") {
    return <><path d="M26 30 L16 8 L40 24 Z" fill="#c4843a" stroke="#5a3410" strokeWidth="0.8" /><path d="M28 26 L20 12 L36 22 Z" fill="#fff3d6" /><path d="M74 30 L84 8 L60 24 Z" fill="#c4843a" stroke="#5a3410" strokeWidth="0.8" /><path d="M72 26 L80 12 L64 22 Z" fill="#fff3d6" /></>;
  }
  if (skin === "kira") {
    return <><path d="M26 32 L18 8 L38 24 Z" fill="#2a1a10" stroke="#1a1008" strokeWidth="0.8" /><path d="M74 32 L82 8 L62 24 Z" fill="#c9842a" stroke="#1a1008" strokeWidth="0.8" /></>;
  }
  if (skin === "foxy" || skin === "bonnie") {
    const c = skin === "foxy" ? "#d44a2a" : "#6a4ab0";
    const inC = skin === "foxy" ? "#ff8fa0" : "#ff8fa0";
    return <><path d="M30 28 L22 0 L38 22 Z" fill={c} stroke="#2a1008" strokeWidth="0.7" /><path d="M32 24 L26 6 L36 20 Z" fill={inC} /><path d="M70 28 L78 0 L62 22 Z" fill={c} stroke="#2a1008" strokeWidth="0.7" /><path d="M68 24 L74 6 L64 20 Z" fill={inC} /></>;
  }
  if (skin === "mahoraga" || skin === "darth") return null;
  if (skin === "bigotes") {
    return (
      <g>
        <path d="M26 34 Q14 44 16 66 Q22 68 28 60 Q32 48 34 38 Z" fill="#7a4410" stroke="#3a2010" strokeWidth="1" />
        <path d="M74 34 Q86 44 84 66 Q78 68 72 60 Q68 48 66 38 Z" fill="#f4f0e8" stroke="#3a2010" strokeWidth="1" />
      </g>
    );
  }
  return (
    <>
      <path d="M26 34 Q14 44 16 66 Q22 68 28 60 Q32 48 34 38 Z" fill={pal.dark} stroke={pal.outline} strokeWidth="1" />
      <path d="M74 34 Q86 44 84 66 Q78 68 72 60 Q68 48 66 38 Z" fill={pal.dark} stroke={pal.outline} strokeWidth="1" />
      <path d="M22 44 Q18 56 22 62" fill="none" stroke={pal.earIn} strokeWidth="1.6" />
      <path d="M78 44 Q82 56 78 62" fill="none" stroke={pal.earIn} strokeWidth="1.6" />
      <Wiry cx={22} cy={50} n={5} r={4} /><Wiry cx={78} cy={50} n={5} r={4} />
    </>
  );
}

function HeadGear({ skin }: { skin: SkinId }) {
  switch (skin) {
    case "bow": return <g transform="translate(50 14)"><path d="M-2 0 Q-16 -10 -16 4 Q-16 12 -2 5 Z" fill="#ff5fa0" stroke="#b02a66" strokeWidth="1" /><path d="M2 0 Q16 -10 16 4 Q16 12 2 5 Z" fill="#ff5fa0" stroke="#b02a66" strokeWidth="1" /><circle cx="0" cy="2.4" r="3.4" fill="#ff8fc0" stroke="#b02a66" strokeWidth="1" /><circle cx="-1" cy="1" r="1" fill="#fff" opacity="0.7" /></g>;
    case "santa": return <g>
      <path d="M30 26 Q50 6 70 26 Q66 16 58 12 Q66 0 50 -2 Q34 2 40 14 Q32 18 30 26 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1.2" />
      <path d="M28 24 Q50 16 72 24 L70 30 Q50 24 30 30 Z" fill="#fff" />
      <circle cx="52" cy="-2" r="4.4" fill="#fff" stroke="#dcdcdc" strokeWidth="0.5" />
    </g>;
    case "princess": return <g><path d="M34 22 L39 8 L46 18 L50 4 L54 18 L61 8 L66 22 Z" fill="#ffd27a" stroke="#a8730a" strokeWidth="1" /><circle cx="50" cy="12" r="2.2" fill="#ff5fa0" /><circle cx="40" cy="16" r="1.2" fill="#7fd0ff" /><circle cx="60" cy="16" r="1.2" fill="#7fd0ff" /></g>;
    case "yuta": return <g>
      <path d="M26 30 Q30 10 44 8 Q50 4 58 8 Q70 6 76 20 Q74 30 68 32 Q62 16 50 18 Q38 16 28 30 Z" fill="#0c0c10" />
      <path d="M34 16 q4 8 6 12 M48 10 q2 10 0 16 M60 14 q-2 8 2 14" stroke="#1a1a22" strokeWidth="1.2" fill="none" />
    </g>;
    case "yuji": return <g>
      <path d="M28 28 Q26 10 40 8 Q50 2 62 8 Q76 8 74 28 Q70 16 50 16 Q32 16 28 28 Z" fill="#f0a0b0" />
      <path d="M32 16 L28 4 L38 12 M44 8 L46 -2 L50 8 M56 8 L62 -2 L60 12 M68 14 L76 2 L70 18" fill="#e890a4" stroke="#c07088" strokeWidth="0.5" />
      <path d="M36 20 q6 -6 14 -2 q8 -6 16 0" fill="#f8c0c8" />
    </g>;
    case "kissy": return <g>
      <path d="M36 18 Q50 8 64 18 Q58 12 50 12 Q42 12 36 18 Z" fill="#5ad0ff" stroke="#1a6aa0" strokeWidth="0.8" />
      <path d="M42 12 Q50 2 58 12 Q54 8 50 8 Q46 8 42 12 Z" fill="#7fe0ff" />
      <circle cx="50" cy="10" r="2" fill="#3aa0ff" />
    </g>;
    case "gojo": return <g>
      <path d="M28 22 Q36 6 50 6 Q64 6 72 22 Q68 12 50 12 Q32 12 28 22 Z" fill="#f4f6fa" stroke="#c8d0dc" strokeWidth="0.7" />
      <path d="M32 16 L30 6 L38 12 M50 6 L50 -2 L54 8 M66 14 L72 4 L68 16" fill="#e8eef8" />
      <rect x="28" y="32" width="44" height="9" rx="3" fill="#121216" stroke="#000" strokeWidth="0.7" />
      <rect x="30" y="34" width="40" height="5" rx="2" fill="#1a1a22" />
    </g>;
    case "nobara": return <g>
      <path d="M28 28 Q26 12 40 12 Q50 8 62 12 Q76 12 74 28 Q68 16 50 16 Q34 16 28 28 Z" fill="#5a3a22" />
      <path d="M34 16 q4 -8 8 -2 M58 14 q6 -8 10 0" fill="#6a4428" />
    </g>;
    case "megumi": return <g>
      <path d="M28 26 Q30 8 44 8 Q50 4 58 8 Q72 6 74 26 Q68 14 50 14 Q34 14 28 26 Z" fill="#0c0c14" />
      <path d="M36 14 L32 2 L42 10 M50 6 L48 -4 L54 8 M64 12 L70 0 L66 16" fill="#12121a" />
    </g>;
    case "sukuna": return <g>
      <path d="M34 28 q3 -4 6 0 M44 24 q3 -4 6 0 M50 22 q3 -4 6 0 M60 24 q3 -4 6 0" stroke="#1a0a0a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M36 36 q4 0 4 6 M60 36 q-4 0 -4 6" stroke="#1a0a0a" strokeWidth="1.4" fill="none" />
      <circle cx="38" cy="40" r="1.1" fill="#ffd27a" /><circle cx="62" cy="40" r="1.1" fill="#ffd27a" />
    </g>;
    case "draculaura": return <g>
      <path d="M22 28 Q16 8 34 14 Q30 24 26 32 Z" fill="#1a1a1a" />
      <path d="M78 28 Q84 8 66 14 Q70 24 74 32 Z" fill="#1a1a1a" />
      <circle cx="24" cy="12" r="3.2" fill="#ff5fa0" stroke="#b02a66" strokeWidth="0.6" />
      <circle cx="76" cy="12" r="3.2" fill="#ff5fa0" stroke="#b02a66" strokeWidth="0.6" />
      <path d="M28 20 Q36 8 50 12 Q64 8 72 20" fill="#1a1a1a" />
    </g>;
    case "frankie": return <g>
      <path d="M30 20 Q40 8 50 12 Q60 8 70 20" fill="#f4f6fa" />
      <path d="M50 12 Q62 6 72 18" fill="#1a1a1a" />
      <rect x="22" y="36" width="5" height="5" fill="#c9a86a" stroke="#3a2010" strokeWidth="0.5" />
      <rect x="73" y="36" width="5" height="5" fill="#c9a86a" stroke="#3a2010" strokeWidth="0.5" />
      <path d="M40 22 Q50 26 60 22" stroke="#2a5a10" strokeWidth="0.7" strokeDasharray="2 1" fill="none" />
    </g>;
    case "huggy": return <g>
      <path d="M24 30 Q12 22 16 40 Q22 36 28 34 Z" fill="#7fd0ff" />
      <path d="M76 30 Q88 22 84 40 Q78 36 72 34 Z" fill="#7fd0ff" />
      <path d="M38 54 Q50 64 62 54" fill="none" stroke="#fff" strokeWidth="1.6" />
    </g>;
    case "catnap": return <g><ellipse cx="50" cy="14" rx="13" ry="4.4" fill="#5a2080" stroke="#3a1a5a" strokeWidth="0.7" /></g>;
    case "darth": return <g>
      <path d="M28 20 Q50 2 72 20 L74 44 Q50 52 26 44 Z" fill="url(#vader-darth)" stroke="#000" strokeWidth="1.3" />
      <path d="M32 24 Q50 10 68 24 L66 32 Q50 22 34 32 Z" fill="#1a1a22" />
      <rect x="34" y="34" width="12" height="6" rx="2" fill="#3a0808" />
      <rect x="54" y="34" width="12" height="6" rx="2" fill="#3a0808" />
      <rect x="36" y="35.5" width="8" height="3" rx="1" fill="#ff2020" opacity="0.95" />
      <rect x="56" y="35.5" width="8" height="3" rx="1" fill="#ff2020" opacity="0.95" />
      <path d="M38 46 Q50 42 62 46 L60 54 Q50 58 40 54 Z" fill="#0a0a0c" stroke="#333" strokeWidth="0.5" />
      <path d="M42 48 h16 M44 51 h12 M46 54 h8" stroke="#555" strokeWidth="0.7" />
      <path d="M30 22 L26 8 L36 18 M70 22 L74 8 L64 18" fill="#111" stroke="#000" strokeWidth="0.5" />
    </g>;
    case "padme": return <g>
      <path d="M30 24 Q36 8 50 10 Q64 8 70 24 Q64 16 50 16 Q36 16 30 24 Z" fill="#3a2010" />
      <ellipse cx="22" cy="28" rx="9" ry="11" fill="#4a2814" stroke="#2a1408" strokeWidth="0.7" />
      <ellipse cx="78" cy="28" rx="9" ry="11" fill="#4a2814" stroke="#2a1408" strokeWidth="0.7" />
      <ellipse cx="22" cy="28" rx="5" ry="6" fill="#c9a86a" opacity="0.35" />
      <ellipse cx="78" cy="28" rx="5" ry="6" fill="#c9a86a" opacity="0.35" />
      <path d="M34 20 Q50 12 66 20" stroke="#c9a86a" strokeWidth="1.4" fill="none" />
      <circle cx="50" cy="14" r="2.2" fill="#ffd27a" />
    </g>;
    case "unicornio": return <g>
      <path d="M50 0 L46 18 L54 18 Z" fill="#fff" stroke="#b06bff" strokeWidth="1" />
      <path d="M48 16 Q50 6 52 16" fill="none" stroke="#ffd27a" strokeWidth="1.1" />
      <path d="M30 20 Q24 6 40 12 Q34 20 30 22 Z" fill="#ff8fb6" />
      <path d="M40 16 Q36 4 50 8 Q46 16 42 18 Z" fill="#7fd0ff" />
      <path d="M50 14 Q52 2 62 10 Q56 16 52 18 Z" fill="#b06bff" />
      <path d="M60 18 Q68 6 74 20 Q66 22 62 22 Z" fill="#ffd27a" />
    </g>;
    case "pirata": return <g>
      <path d="M28 24 Q50 8 72 24 L70 30 Q50 16 30 30 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1" />
      <path d="M28 26 Q50 18 72 26" stroke="#ffd27a" strokeWidth="1.2" />
      <circle cx="40" cy="40" r="6" fill="#1a1a1a" />
      <path d="M34 34 L50 48" stroke="#1a1a1a" strokeWidth="1.4" />
    </g>;
    case "astronauta": return <g>
      <ellipse cx="50" cy="34" rx="20" ry="18" fill="none" stroke="#d8dee8" strokeWidth="3" />
      <ellipse cx="50" cy="34" rx="17" ry="15" fill="#9ad4ff" opacity="0.22" />
      <path d="M36 24 Q50 16 64 26" fill="#fff" opacity="0.35" />
      <rect x="44" y="10" width="12" height="5" rx="1" fill="#d8dee8" stroke="#7a8aa8" strokeWidth="0.5" />
    </g>;
    case "ninja": return <g>
      <rect x="28" y="30" width="44" height="12" rx="3" fill="#121216" />
      <ellipse cx="40" cy="36" rx="2.2" ry="1.6" fill="#ff3030" />
      <ellipse cx="60" cy="36" rx="2.2" ry="1.6" fill="#ff3030" />
      <path d="M72 34 Q84 32 80 44" stroke="#7a1410" strokeWidth="2" fill="none" />
    </g>;
    case "clawdeen": return <g>
      <path d="M24 28 Q18 4 40 10 Q36 20 30 30 Z" fill="#6a2a90" />
      <path d="M76 28 Q82 4 60 10 Q64 20 70 30 Z" fill="#6a2a90" />
      <path d="M28 18 Q40 2 50 8 Q60 2 72 18" fill="#4a1a70" />
      <path d="M36 10 Q40 0 46 8" fill="#c9a020" />
      <path d="M28 32 L22 10 L36 24 Z" fill="#5a3a1a" />
      <path d="M72 32 L78 10 L64 24 Z" fill="#5a3a1a" />
    </g>;
    case "cleo": return <g>
      <path d="M28 22 Q36 4 50 6 Q64 4 72 22 Q66 12 50 12 Q34 12 28 22 Z" fill="#1a1a1a" />
      <path d="M58 10 Q70 0 74 16" fill="#c9a020" />
      <path d="M32 16 Q50 6 68 16 Q62 10 50 12 Q38 10 32 16 Z" fill="#ffd27a" stroke="#8a6a20" strokeWidth="0.6" />
      <circle cx="50" cy="12" r="1.6" fill="#2ec4b6" />
    </g>;
    case "ghoulia": return <g>
      <path d="M58 16 Q72 4 76 24 Q70 20 64 26 Z" fill="#d9342b" />
      <rect x="30" y="30" width="40" height="6" rx="1" fill="#3a2010" />
      <circle cx="36" cy="33" r="3.2" fill="#7fd0ff" opacity="0.45" stroke="#4a8aa8" strokeWidth="0.5" />
      <circle cx="64" cy="33" r="3.2" fill="#7fd0ff" opacity="0.45" stroke="#4a8aa8" strokeWidth="0.5" />
      <path d="M40 16 Q50 10 60 16 Q56 22 50 20 Q44 22 40 16 Z" fill="#ff8fa0" />
    </g>;
    case "bella": return <g>
      <path d="M30 24 Q36 8 50 8 Q64 8 70 24 Q64 14 50 14 Q36 14 30 24 Z" fill="#4a2a12" />
      <ellipse cx="50" cy="10" rx="6" ry="5" fill="#5a3418" />
      <circle cx="56" cy="8" r="2.4" fill="#ffd27a" />
    </g>;
    case "jasmine": return <g>
      <path d="M36 10 Q50 -2 56 16 Q52 8 44 12 Z" fill="#1a1a1a" />
      <path d="M40 16 Q50 6 68 14 Q60 22 50 18 Q42 22 40 16 Z" fill="#1a1a1a" />
      <circle cx="50" cy="12" r="2.6" fill="#ffd27a" stroke="#8a6a20" strokeWidth="0.6" />
      <path d="M48 12 q2 3 4 0" fill="#c9a020" />
    </g>;
    case "tiana": return <g>
      <path d="M32 22 Q40 8 50 10 Q60 8 68 22 Q60 14 50 14 Q40 14 32 22 Z" fill="#2a1a10" />
      <ellipse cx="50" cy="10" rx="7" ry="5" fill="#3a2414" />
      <path d="M36 12 Q50 2 64 12 Q58 8 50 8 Q42 8 36 12 Z" fill="#2e8a3a" stroke="#145018" strokeWidth="0.6" />
      <circle cx="50" cy="8" r="1.4" fill="#fff" />
    </g>;
    case "widow": return <g>
      <path d="M40 12 Q50 2 54 16 Q50 10 44 14 Z" fill="#1a1a1a" />
      <path d="M28 28 Q22 16 36 18 Q34 26 32 32 Z" fill="#111" />
    </g>;
    case "spider": return <g>
      <path d="M28 22 Q50 10 72 22 L74 48 Q50 56 26 48 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="1" />
      <path d="M30 24 Q50 14 70 24 L68 34 Q50 26 32 34 Z" fill="#1a3a8a" />
      <ellipse cx="40" cy="36" rx="6" ry="5" fill="#fff" />
      <ellipse cx="60" cy="36" rx="6" ry="5" fill="#fff" />
      <path d="M36 36 h8 M56 36 h8 M40 32 v8 M60 32 v8" stroke="#dce8f4" strokeWidth="0.5" />
    </g>;
    case "wonder": return <g>
      <path d="M32 18 Q50 6 68 18 Q62 12 50 12 Q38 12 32 18 Z" fill="#ffd27a" stroke="#8a6a20" strokeWidth="0.8" />
      <circle cx="50" cy="12" r="2" fill="#d9342b" />
      <path d="M48 11 l2 3 l2 -3" fill="#fff" />
    </g>;
    case "dogday": return <g>
      <path d="M26 30 L18 8 L38 24 Z" fill="#ffb347" stroke="#7a4a10" strokeWidth="0.8" />
      <path d="M74 30 L82 8 L62 24 Z" fill="#ffb347" stroke="#7a4a10" strokeWidth="0.8" />
      <circle cx="50" cy="14" r="3.4" fill="#ffd27a" stroke="#7a4a10" strokeWidth="0.6" />
    </g>;
    case "craftycorn": return <g>
      <path d="M50 2 L46 18 L54 18 Z" fill="#fff" stroke="#b06bff" strokeWidth="0.8" />
      <path d="M30 20 Q24 8 40 14" fill="#ff8fb6" /><path d="M60 18 Q70 6 74 20" fill="#7fd0ff" />
    </g>;
    case "alex": return <g>
      <path d="M28 24 Q32 8 50 8 Q68 8 72 24 Q64 14 50 14 Q36 14 28 24 Z" fill="#e07020" />
    </g>;
    case "steve": return <g>
      <path d="M30 24 Q34 10 50 10 Q66 10 70 24 Q64 16 50 16 Q36 16 30 24 Z" fill="#3a2410" />
    </g>;
    case "ender": return <g>
      <rect x="34" y="38" width="10" height="6" fill="#b06bff" /><rect x="56" y="38" width="10" height="6" fill="#b06bff" />
    </g>;
    case "eleven": return <g>
      <path d="M30 26 Q34 12 50 12 Q66 12 70 26 Q64 16 50 16 Q36 16 30 26 Z" fill="#5a3a22" />
      <path d="M62 46 q2 6 0 10" stroke="#c93030" strokeWidth="1.3" fill="none" />
    </g>;
    case "rm": return <g>
      <rect x="26" y="12" width="48" height="16" rx="3" fill="#1a1a1a" stroke="#000" strokeWidth="0.8" />
      <rect x="28" y="26" width="44" height="4" fill="#2a2a2a" />
    </g>;
    case "boxer": return <g>
      <path d="M32 28 Q50 22 68 28" fill="none" stroke="#d9342b" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M34 26 Q50 20 66 26" fill="none" stroke="#fff" strokeWidth="1" />
      <path d="M36 38 q2 4 0 6" stroke="#3a1a08" strokeWidth="1.1" opacity="0.5" />
    </g>;
    case "laufey": return <g>
      <path d="M24 30 Q22 8 40 8 Q50 2 62 8 Q80 6 78 30 Q72 14 50 14 Q30 14 24 30 Z" fill="#1a1210" />
      <path d="M30 22 Q40 16 50 22 Q60 16 70 22 Q64 28 50 26 Q36 28 30 22 Z" fill="#2a1a16" />
      <path d="M34 24 Q42 30 50 24 Q58 30 66 24" fill="#1a1210" />
    </g>;
    case "penguin": return <g>
      <ellipse cx="34" cy="34" rx="4" ry="5" fill="#1a1a22" />
      <ellipse cx="66" cy="34" rx="4" ry="5" fill="#1a1a22" />
    </g>;
    case "bigotes": return <g>
      <circle cx="40" cy="40" r="6.2" fill="#121212" />
      <path d="M32 30 L50 50" stroke="#121212" strokeWidth="1.6" />
      <path d="M54 32 l5 8" stroke="#c44a5a" strokeWidth="1.2" />
      <path d="M28 36 Q34 28 42 34" fill="#7a4410" />
    </g>;
    case "bat": return <g>
      <path d="M28 20 L18 6 L36 16 M72 20 L82 6 L64 16" fill="#111" />
      <path d="M30 28 Q50 18 70 28 L68 40 Q50 34 32 40 Z" fill="#111" />
      <path d="M44 36 Q50 32 56 36" stroke="#fff" strokeWidth="0.7" fill="none" />
    </g>;
    case "captain": return <g>
      <path d="M28 24 Q36 12 50 12 Q64 12 72 24 Q64 16 50 16 Q36 16 28 24 Z" fill="#d9342b" />
      <circle cx="50" cy="14" r="2" fill="#fff" />
    </g>;
    case "schnauzarella": return <g>
      <path d="M40 10 Q50 2 60 10 Q56 8 50 8 Q44 8 40 10 Z" fill="#7fd0ff" />
      <circle cx="50" cy="8" r="2" fill="#fff" />
    </g>;
    case "ariel": return <g>
      <path d="M28 24 Q24 4 44 10 Q38 20 34 28 Z" fill="#d9342b" />
      <path d="M72 24 Q76 4 56 10 Q62 20 66 28 Z" fill="#d9342b" />
      <path d="M32 16 Q50 0 68 16 Q60 10 50 10 Q40 10 32 16 Z" fill="#c02828" />
    </g>;
    case "mago": return <g>
      <path d="M50 -6 L28 28 L72 28 Z" fill="#1a1450" stroke="#0a0830" strokeWidth="1" />
      <ellipse cx="50" cy="28" rx="24" ry="5" fill="#1a1450" stroke="#0a0830" strokeWidth="0.8" />
      <circle cx="50" cy="10" r="2" fill="#ffd27a" />
    </g>;
    case "payaso": return <g>
      <path d="M22 28 Q16 4 36 12 Q32 22 28 30 Z" fill="#ff7a18" />
      <path d="M78 28 Q84 4 64 12 Q68 22 72 30 Z" fill="#ff7a18" />
      <path d="M30 16 Q50 2 70 16" fill="#ff8a28" />
      <circle cx="50" cy="50" r="3.2" fill="#d9342b" stroke="#7a1410" strokeWidth="0.6" />
    </g>;
    case "barbie": return <g>
      <path d="M22 30 Q16 0 40 10 Q34 22 30 32 Z" fill="#ffe066" />
      <path d="M78 30 Q84 0 60 10 Q66 22 70 32 Z" fill="#ffe066" />
      <path d="M28 18 Q50 -4 72 18 Q64 10 50 8 Q36 10 28 18 Z" fill="#ffd27a" />
      <path d="M40 8 Q50 -2 54 12 Q50 6 44 10 Z" fill="#ffe89a" />
      <circle cx="50" cy="10" r="2.2" fill="#ff5fa0" />
    </g>;
    case "matrona": return <g>
      <path d="M28 22 Q50 8 72 22 L70 30 Q50 18 30 30 Z" fill="#fff" stroke="#d41a1a" strokeWidth="1.2" />
      <rect x="42" y="10" width="16" height="12" rx="2" fill="#d41a1a" />
      <path d="M48 12 h4 v8 h-4 Z" fill="#fff" />
      <path d="M46 16 h8" stroke="#fff" strokeWidth="2" />
    </g>;
    case "subzero": return <g>
      <path d="M28 26 Q50 12 72 26 L70 48 Q50 54 30 48 Z" fill="#1a4a8a" stroke="#0a2048" strokeWidth="1.2" />
      <rect x="32" y="34" width="36" height="10" rx="3" fill="#0a2048" />
      <rect x="34" y="36" width="12" height="6" rx="1.5" fill="#7fd0ff" />
      <rect x="54" y="36" width="12" height="6" rx="1.5" fill="#7fd0ff" />
      <path d="M36 46 Q50 50 64 46" stroke="#7fd0ff" strokeWidth="1.2" fill="none" />
    </g>;
    case "bebe": return <g>
      <path d="M30 22 Q50 4 70 22 Q64 14 50 14 Q36 14 30 22 Z" fill="#ffd0e8" stroke="#d980b0" strokeWidth="0.8" />
      <circle cx="50" cy="8" r="4" fill="#fff" />
      <circle cx="50" cy="8" r="2" fill="#ff8fb6" />
      <ellipse cx="50" cy="56" rx="4" ry="3.2" fill="#ff8fa0" stroke="#c44a6a" strokeWidth="0.5" />
    </g>;
    case "abuela": return <g>
      <path d="M26 28 Q28 10 50 8 Q72 10 74 28 Q68 16 50 16 Q32 16 26 28 Z" fill="#e8e4dc" />
      <path d="M30 22 Q50 12 70 22" fill="#d8d4cc" />
      <circle cx="40" cy="40" r="6.4" fill="none" stroke="#7fd0ff" strokeWidth="1.4" />
      <circle cx="60" cy="40" r="6.4" fill="none" stroke="#7fd0ff" strokeWidth="1.4" />
      <path d="M46 40 h8" stroke="#7fd0ff" strokeWidth="1.2" />
    </g>;
    case "sabio": return <g>
      <path d="M34 52 Q50 78 66 52 Q60 70 50 72 Q40 70 34 52 Z" fill="#f4f1e6" stroke="#c9c2ae" strokeWidth="0.8" />
      <path d="M38 58 q4 8 0 14 M50 60 q0 12 0 16 M62 58 q-4 8 0 14" stroke="#e8e0d0" strokeWidth="1.4" fill="none" />
      <ellipse cx="50" cy="16" rx="10" ry="3" fill="#ffd27a" opacity="0.7" />
    </g>;
    case "freddy": return <g>
      <ellipse cx="50" cy="10" rx="10" ry="4" fill="#1a1a1a" />
      <rect x="46" y="2" width="8" height="8" rx="1" fill="#1a1a1a" />
      <ellipse cx="50" cy="2" rx="6" ry="2.4" fill="#1a1a1a" />
      <circle cx="50" cy="10" r="1.4" fill="#c9a86a" />
      <ellipse cx="32" cy="22" rx="6" ry="5" fill="#5a2a0a" stroke="#2a1408" strokeWidth="0.6" />
      <ellipse cx="68" cy="22" rx="6" ry="5" fill="#5a2a0a" stroke="#2a1408" strokeWidth="0.6" />
    </g>;
    case "foxy": return <g>
      <circle cx="40" cy="40" r="7" fill="#ff8fb6" stroke="#b02a66" strokeWidth="0.8" />
      <path d="M36 40 q4 -2 8 0" stroke="#fff" strokeWidth="0.8" fill="none" />
      <path d="M39 37 l2 2 l3 -4" fill="none" stroke="#fff" strokeWidth="0.7" />
      <ellipse cx="36" cy="48" rx="3.2" ry="2" fill="#ff8fa0" opacity="0.8" />
      <ellipse cx="64" cy="48" rx="3.2" ry="2" fill="#ff8fa0" opacity="0.8" />
      <path d="M72 18 Q80 6 70 8 Q66 16 68 22" fill="#ff8fb6" />
      <circle cx="72" cy="10" r="2.2" fill="#fff" />
    </g>;
    case "bonnie": return <g>
      <ellipse cx="50" cy="52" rx="4" ry="3" fill="#3a1a5a" />
      <path d="M44 54 Q50 58 56 54" stroke="#2a1040" strokeWidth="1" fill="none" />
    </g>;
    case "chica": return <g>
      <path d="M42 10 L50 0 L58 10 Z" fill="#d9342b" stroke="#7a1410" strokeWidth="0.6" />
      <path d="M46 12 L50 4 L54 12 Z" fill="#ff5a4a" />
      <ellipse cx="50" cy="52" rx="5" ry="3.4" fill="#e07020" stroke="#8a4010" strokeWidth="0.6" />
    </g>;
    case "eevee": return <g>
      <path d="M30 22 Q24 6 42 14 Q36 22 32 26 Z" fill="#fff3d6" />
      <path d="M70 22 Q76 6 58 14 Q64 22 68 26 Z" fill="#fff3d6" />
      <path d="M40 16 Q50 6 60 16 Q54 20 50 18 Q46 20 40 16 Z" fill="#fff3d6" />
    </g>;
    case "kira": return <g>
      <path d="M36 20 Q42 8 50 16 Q46 20 40 22 Z" fill="#1a1a1a" />
      <path d="M32 26 Q28 18 38 22" fill="#2a1a10" />
    </g>;
    case "spooky": return <g>
      <ellipse cx="40" cy="42" rx="5" ry="5.4" fill="#ffd27a" />
      <ellipse cx="60" cy="42" rx="5" ry="5.4" fill="#ffd27a" />
      <ellipse cx="40" cy="43" rx="1.1" ry="3.2" fill="#0a0402" />
      <ellipse cx="60" cy="43" rx="1.1" ry="3.2" fill="#0a0402" />
      <g stroke="#fff" strokeWidth="0.8" strokeLinecap="round">
        <path d="M36 48 l-11 -2 M36 50 l-11 1 M36 52 l-11 3 M64 48 l11 -2 M64 50 l11 1 M64 52 l11 3" />
      </g>
    </g>;
    case "hada": return <g>
      <path d="M34 16 L39 6 L46 16 L50 2 L54 16 L61 6 L66 16 Z" fill="#fff" stroke="#b06bff" strokeWidth="0.7" />
      <circle cx="50" cy="10" r="1.6" fill="#ffd27a" />
    </g>;
    case "panadero": return <g>
      <ellipse cx="50" cy="18" rx="16" ry="6" fill="#fff" stroke="#c8c0b0" strokeWidth="0.8" />
      <rect x="36" y="4" width="28" height="16" rx="8" fill="#fff" stroke="#c8c0b0" strokeWidth="0.8" />
      <path d="M42 54 Q50 58 58 54" stroke="#8a6a44" strokeWidth="1.4" fill="none" />
    </g>;
    case "croissant": return <g>
      <path d="M28 28 Q22 16 36 18 Q32 26 30 30 Z" fill="#ffd27a" />
      <path d="M72 28 Q78 16 64 18 Q68 26 70 30 Z" fill="#ffd27a" />
    </g>;
    default: return null;
  }
}

function HeldProps({ skin }: { skin: SkinId }) {
  if (skin === "darth") return (
    <g transform="translate(78 70) rotate(18)">
      <rect x="0" y="0" width="4" height="10" rx="1" fill="#2a2a2a" stroke="#111" strokeWidth="0.5" />
      <rect x="0.6" y="-22" width="2.8" height="22" rx="1" fill="#ff3030" opacity="0.95" />
      <rect x="1.2" y="-20" width="1.4" height="18" fill="#ffb0b0" opacity="0.7" />
    </g>
  );
  if (skin === "yuta") return (
    <g transform="translate(76 48) rotate(-28)">
      <rect x="0" y="0" width="3.2" height="28" rx="1" fill="#1a1a1a" />
      <rect x="-1" y="24" width="5.2" height="3" fill="#c9a86a" />
    </g>
  );
  if (skin === "laufey") return (
    <g transform="translate(78 72)">
      <rect x="0" y="0" width="3" height="10" rx="1" fill="#c9a86a" />
      <ellipse cx="1.5" cy="-4" rx="5" ry="5" fill="#1a1a1a" stroke="#c9a86a" strokeWidth="0.7" />
      <circle cx="1.5" cy="-4" r="2" fill="#3a2010" />
    </g>
  );
  if (skin === "ninja") return (
    <g transform="translate(78 64) rotate(20)">
      {[-8, 0, 8].map((y) => <g key={y} transform={`translate(0 ${y})`}><path d="M0 3 L3 0 L6 3 L3 6 Z" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" /></g>)}
    </g>
  );
  if (skin === "mago") return (
    <g transform="translate(76 68) rotate(12)">
      <rect x="0" y="0" width="2.4" height="18" fill="#e3c79a" />
      <circle cx="1.2" cy="-1" r="2.2" fill="#7fd0ff" />
    </g>
  );
  if (skin === "hada") return (
    <g transform="translate(76 60) rotate(18)">
      <rect x="0" y="0" width="2.2" height="16" fill="#ffd27a" />
      <path d="M1.1 -6 l2 4 l4 0.4 l-3 2.6 l1 4 l-4 -2.2 l-4 2.2 l1 -4 l-3 -2.6 l4 -0.4 Z" fill="#fff" stroke="#b06bff" strokeWidth="0.4" />
    </g>
  );
  if (skin === "freddy") return (
    <g transform="translate(74 58) rotate(12)">
      <rect x="0" y="0" width="2.6" height="14" fill="#3a2010" />
      <ellipse cx="1.3" cy="-3" rx="3.4" ry="3" fill="#1a1a1a" />
    </g>
  );
  return null;
}

function JockeyRider() {
  return (
    <g>
      <path d="M30 56 Q26 64 30 72 L34 72 Q34 64 36 58 Z" fill="#f4f1e6" stroke="#3a3a3a" strokeWidth="0.8" />
      <path d="M70 56 Q74 64 70 72 L66 72 Q66 64 64 58 Z" fill="#f4f1e6" stroke="#3a3a3a" strokeWidth="0.8" />
      <rect x="28" y="70" width="7" height="5" rx="1.5" fill="#1a1a1a" />
      <rect x="65" y="70" width="7" height="5" rx="1.5" fill="#1a1a1a" />
      <path d="M38 40 Q50 34 62 40 L60 58 Q50 62 40 58 Z" fill="#d9342b" stroke="#5a0808" strokeWidth="1" />
      <path d="M42 40 l0 18 M48 38 l0 20 M54 38 l0 20 M58 40 l0 18" stroke="#fff" strokeWidth="1.4" />
      <path d="M38 44 Q30 50 32 58" stroke="#d9342b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M62 44 Q70 50 68 58" stroke="#d9342b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="58" r="2" fill="#f0c090" /><circle cx="68" cy="58" r="2" fill="#f0c090" />
      <path d="M32 58 Q40 62 44 62 M68 58 Q60 62 56 62" stroke="#3a2010" strokeWidth="0.8" fill="none" />
      <circle cx="50" cy="32" r="7" fill="#f0c090" stroke="#7a4410" strokeWidth="0.8" />
      <path d="M42 30 Q50 18 58 30 Q58 26 50 24 Q42 26 42 30 Z" fill="#1a1a1a" />
      <path d="M42 30 Q50 26 58 30 L58 32 L42 32 Z" fill="#d9342b" />
    </g>
  );
}
