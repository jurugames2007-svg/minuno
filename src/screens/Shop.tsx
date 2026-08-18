import { useState } from "react";
import Maxine from "../art/Maxine";
import { SKINS, RARITY_COLOR, type SkinId } from "../data/skins";
import { TOOLS, TOOL_MAP, toolRank, RANK_COLOR, Plushie, type ToolId } from "../art/Plushie";
import { Crown, Flour, PixelNpc } from "../art/Decor";

interface Props {
  skin: SkinId;
  owned: SkinId[];
  crumbs: number;
  ownedTools: ToolId[];
  startTool: ToolId;
  onEquip: (id: SkinId) => void;
  onBuySkin: (id: SkinId) => void;
  onBuyTool: (id: ToolId, price: number) => void;
  onEquipTool: (id: ToolId) => void;
  onBack: () => void;
}

type Tab = "skins" | "tools";

export default function Shop({ skin, owned, crumbs, ownedTools, startTool, onEquip, onBuySkin, onBuyTool, onEquipTool, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("tools"); // open on tools so the new section is unmissable
  const [previewSkin, setPreviewSkin] = useState<SkinId>(skin);
  const [previewTool, setPreviewTool] = useState<ToolId>(startTool);

  const curSkin = SKINS.find((s) => s.id === previewSkin)!;
  const curTool = TOOL_MAP[previewTool];
  const rank = toolRank(curTool);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* brick wall */}
      <div className="absolute inset-0 brick" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 50% at 50% 20%, rgba(255,180,90,.18), transparent 70%), linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.55))" }} />
      <Flour count={14} />

      {/* hanging shelf */}
      <div className="absolute top-0 inset-x-0 h-[28%]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 180" preserveAspectRatio="none">
          <rect x="10" y="54" width="340" height="9" fill="#5a3216" stroke="#2a1408" strokeWidth="2" />
          <rect x="10" y="128" width="340" height="9" fill="#5a3216" stroke="#2a1408" strokeWidth="2" />
          <line x1="30" y1="0" x2="30" y2="54" stroke="#3a2010" strokeWidth="2" />
          <line x1="330" y1="0" x2="330" y2="54" stroke="#3a2010" strokeWidth="2" />
          {/* jars */}
          <rect x="40" y="26" width="22" height="28" rx="3" fill="#ff8fa0" opacity="0.85" stroke="#7a1430" strokeWidth="1.5" />
          <rect x="40" y="24" width="22" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          <rect x="74" y="30" width="20" height="24" rx="3" fill="#ffe066" opacity="0.85" stroke="#a8730a" strokeWidth="1.5" />
          <rect x="74" y="28" width="20" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          <rect x="106" y="24" width="24" height="30" rx="3" fill="#7fc24a" opacity="0.85" stroke="#2a5a10" strokeWidth="1.5" />
          <rect x="106" y="22" width="24" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          {/* hanging garlic */}
          <g transform="translate(250 6)">
            <line x1="10" y1="0" x2="10" y2="18" stroke="#3a2010" strokeWidth="1.5" />
            {[0, 1, 2].map((i) => <ellipse key={i} cx={6 + i * 5} cy={24 + (i % 2) * 4} rx="3" ry="5" fill="#f4e4b0" stroke="#7a5a20" strokeWidth="0.8" />)}
          </g>
          <g transform="translate(290 6)">
            <line x1="8" y1="0" x2="8" y2="16" stroke="#3a2010" strokeWidth="1.5" />
            <path d="M6 16 q-4 10 2 18 q4 -8 -2 -18" fill="#d9342b" stroke="#7a1410" strokeWidth="0.8" />
            <path d="M12 18 q-2 10 4 16 q2 -8 -4 -16" fill="#d9342b" stroke="#7a1410" strokeWidth="0.8" />
          </g>
          {/* second shelf: sign + shield */}
          <g transform="translate(40 84)">
            <rect x="0" y="0" width="44" height="32" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1.5" />
            <text x="22" y="14" textAnchor="middle" fontFamily="Press Start 2P" fontSize="6" fill="#fff3d6">MAXINE</text>
            <text x="22" y="24" textAnchor="middle" fontFamily="Press Start 2P" fontSize="5" fill="#ffd27a">BAKERY</text>
          </g>
          <g transform="translate(260 82)">
            <circle cx="20" cy="20" r="18" fill="#c9842a" stroke="#3a2010" strokeWidth="2" />
            <circle cx="20" cy="20" r="10" fill="#e3a35a" />
            <circle cx="20" cy="20" r="3" fill="#7a3410" />
          </g>
        </svg>
        <div className="absolute left-[18%] top-[12%] hop" style={{ animationDelay: "0.3s" }}><PixelNpc variant={0} size={34} /></div>
        <div className="absolute right-[20%] top-[14%] hop" style={{ animationDelay: "1.1s" }}><PixelNpc variant={2} size={32} /></div>
      </div>

      {/* top bar */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-30">
        <button onClick={onBack} className="btn-3d font-pixel text-[10px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded border-2 border-[#1a0c04] border-b-4 active:border-b-2">
          ◀ ATRÁS
        </button>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded px-3 py-2">
          <Crown size={16} />
          <span className="font-pixel text-[11px] text-amber-200">{crumbs}</span>
        </div>
      </div>

      {/* tabs */}
      <div className="absolute left-2 right-2 z-30 flex gap-1.5" style={{ top: "calc(2% + 34px)" }}>
        <TabBtn active={tab === "skins"} onClick={() => setTab("skins")} label="PIELES" emoji="PIE" />
        <TabBtn active={tab === "tools"} onClick={() => setTab("tools")} label="HERRAMIENTAS" emoji="HER" />
      </div>

      {/* counter zone */}
      <div className="absolute left-0 right-0" style={{ top: "30%", height: "28%" }}>
        <div className="absolute bottom-0 inset-x-0 h-[46%] wood border-t-4 border-[#2a1408]" style={{ boxShadow: "inset 0 6px 0 rgba(255,255,255,.08)" }} />
        {/* barrel */}
        <svg className="absolute left-2 bottom-0" width="52" height="66" viewBox="0 0 56 70">
          <ellipse cx="28" cy="8" rx="22" ry="6" fill="#3a2010" />
          <path d="M6 8 Q2 36 6 62 Q28 70 50 62 Q54 36 50 8 Z" fill="#8a5128" stroke="#2a1408" strokeWidth="2" />
          <path d="M6 20 Q28 26 50 20 M6 48 Q28 54 50 48" stroke="#3a2010" strokeWidth="2" fill="none" />
        </svg>
        {/* vitrine / sack on right depending on tab */}
        {tab === "tools" ? (
          <div className="absolute right-2 bottom-2" style={{ width: 74, height: 74 }}>
            <div className="absolute inset-0 rounded-lg border-2 border-[#3a2010]" style={{ background: "radial-gradient(circle at 50% 40%, #fff3d655, #3a201088 70%, #1a0c04cc)", boxShadow: "inset 0 0 14px #ffd27a66, 0 0 12px #ffd27a33" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hop"><Plushie id={previewTool} size={52} /></div>
              </div>
              <div className="absolute top-0.5 inset-x-0 text-center font-pixel text-[6px] text-amber-200/80">VITRINA</div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: "#ffd27a", boxShadow: "0 0 8px #ffd27a", animation: "glow-pulse 1.4s infinite" }} />
            </div>
          </div>
        ) : (
          <svg className="absolute right-2 bottom-0" width="56" height="60" viewBox="0 0 60 64">
            <path d="M10 24 Q4 60 14 62 H46 Q56 60 50 24 Q40 18 30 18 Q20 18 10 24 Z" fill="#d9c39a" stroke="#5a3a1a" strokeWidth="2" />
            <path d="M22 18 q8 -8 16 0" fill="none" stroke="#5a3a1a" strokeWidth="2" />
            <text x="30" y="46" textAnchor="middle" fontFamily="Press Start 2P" fontSize="6" fill="#5a3a1a">HARINA</text>
          </svg>
        )}

        {/* seated maxine (+ held plushie on tools tab) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[30%] z-10 pop" key={tab + (tab === "skins" ? previewSkin : previewTool)}>
          <div className="relative" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.5))" }}>
            {tab === "tools" && (
              <div className="absolute left-[28%] top-[58%] z-20 rotate-12">
                <Plushie id={previewTool} size={previewTool === "kissy" ? 34 : 28} />
              </div>
            )}
            <Maxine skin={tab === "skins" ? previewSkin : skin} pose="idle" size={140} />
          </div>
        </div>

        {/* nameplate */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 z-20 bg-[#fff3d6] border-2 border-[#3a2010] rounded px-3 py-1 text-center shadow-lg min-w-[140px]">
          {tab === "skins" ? (
            <>
              <div className="font-display font-bold text-[#3a2010] text-sm leading-none">{curSkin.name}</div>
              <div className="font-pixel text-[7px] mt-0.5" style={{ color: RARITY_COLOR[curSkin.rarity] }}>{curSkin.rarity.toUpperCase()}</div>
            </>
          ) : (
            <>
              <div className="font-display font-bold text-[#3a2010] text-sm leading-none flex items-center justify-center gap-1">
                <span>{curTool.name}</span>
              </div>
              <div className="font-pixel text-[7px] mt-0.5" style={{ color: RANK_COLOR[rank] }}>{rank.toUpperCase()} · VEL x{curTool.speedMul.toFixed(2)}</div>
            </>
          )}
        </div>
      </div>

      {/* blurb + stats */}
      <div className="absolute left-3 right-3 top-[59%] z-20 text-center">
        {tab === "skins" ? (
          <p className="font-display text-amber-100/90 text-[13px] leading-snug px-2">{curSkin.blurb}</p>
        ) : (
          <div className="space-y-1">
            <p className="font-display text-amber-100/90 text-[12px] leading-snug px-2">{curTool.desc}</p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <StatChip label={`VEL x${curTool.speedMul.toFixed(2)}`} color="#ffd27a" />
              {curTool.wide && <StatChip label="↔ rompe al lado" color="#7fd0ff" />}
              {curTool.reach && <StatChip label="⇒ alcance 2" color="#7fd0ff" />}
              {curTool.slowAura && <StatChip label="🐢 aura lenta" color="#b06bff" />}
              {curTool.bounce && <StatChip label="🛡 1 rebote" color="#7fc24a" />}
              {curTool.healOnDig && <StatChip label="COR cura al cavar" color="#ff8fa0" />}
            </div>
          </div>
        )}
      </div>

      {/* catalog */}
      <div className="absolute left-0 right-0 bottom-0 top-[68%] z-20 bg-gradient-to-b from-[#2a1408]/80 to-[#1a0c04]/95 border-t-2 border-[#5a3216]">
        <div className="flex gap-2 overflow-x-auto scrollbar-none px-3 py-2 h-full items-stretch">
          {tab === "skins" ? SKINS.map((s) => {
            const own = owned.includes(s.id);
            const active = s.id === skin;
            const sel = s.id === previewSkin;
            const canBuy = crumbs >= s.price;
            return (
              <button
                key={s.id}
                onClick={() => setPreviewSkin(s.id)}
                className="btn-3d shrink-0 w-[88px] rounded-lg border-2 p-1.5 flex flex-col items-center gap-1 relative transition-transform hover:scale-[1.03]"
                style={{
                  background: active ? "#5a3216" : "#3a2010",
                  borderColor: sel ? RARITY_COLOR[s.rarity] : "#1a0c04",
                  boxShadow: sel ? `0 0 0 2px ${RARITY_COLOR[s.rarity]}55, 0 4px 0 #1a0c04` : "0 3px 0 #1a0c04",
                }}
              >
                <div className="absolute top-0.5 right-0.5 font-pixel text-[6px] px-1 rounded" style={{ background: RARITY_COLOR[s.rarity], color: "#1a0c04" }}>
                  {s.rarity.slice(0, 3).toUpperCase()}
                </div>
                <div className="w-full aspect-square rounded bg-[#1a0c04]/60 flex items-center justify-center overflow-hidden">
                  <Maxine skin={s.id} pose="idle" size={64} animate={sel} />
                </div>
                <div className="font-pixel text-[7px] text-amber-100 leading-tight text-center truncate w-full">{s.name}</div>
                {own ? (
                  active ? (
                    <div className="font-pixel text-[7px]" style={{ color: "#7fc24a" }}>EN USO</div>
                  ) : (
                    <div
                      onClick={(e) => { e.stopPropagation(); onEquip(s.id); setPreviewSkin(s.id); }}
                      className="font-pixel text-[7px] bg-[#7fc24a] text-[#1a2a08] px-1.5 py-0.5 rounded border border-[#2a5a10]"
                    >EQUIPAR</div>
                  )
                ) : (
                  <div
                    onClick={(e) => { e.stopPropagation(); if (canBuy) { onBuySkin(s.id); setPreviewSkin(s.id); } }}
                    className="font-pixel text-[7px] px-1.5 py-0.5 rounded border flex items-center gap-0.5"
                    style={{ background: canBuy ? "#ffd27a" : "#6a5a4a", color: "#3a2010", borderColor: "#3a2010", opacity: canBuy ? 1 : 0.7 }}
                  ><Crown size={8} /> {s.price}</div>
                )}
              </button>
            );
          }) : TOOLS.map((t) => {
            const own = ownedTools.includes(t.id);
            const isStart = t.id === startTool;
            const sel = t.id === previewTool;
            const canBuy = crumbs >= t.metaPrice;
            const rk = toolRank(t);
            return (
              <button
                key={t.id}
                onClick={() => setPreviewTool(t.id)}
                className="btn-3d shrink-0 w-[92px] rounded-lg border-2 p-1.5 flex flex-col items-center gap-1 relative transition-transform hover:scale-[1.03] overflow-hidden"
                style={{
                  background: isStart ? "#5a3216" : "#3a2010",
                  borderColor: sel ? RANK_COLOR[rk] : "#1a0c04",
                  boxShadow: sel ? `0 0 0 2px ${RANK_COLOR[rk]}55, 0 4px 0 #1a0c04` : "0 3px 0 #1a0c04",
                }}
              >
                {sel && <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 skew-x-12 pointer-events-none" style={{ animation: "sheen 2.4s ease-in-out infinite" }} />}
                <div className="absolute top-0.5 right-0.5 font-pixel text-[6px] px-1 rounded" style={{ background: RANK_COLOR[rk], color: "#1a0c04" }}>
                  {rk.slice(0, 3).toUpperCase()}
                </div>
                {isStart && <div className="absolute top-0.5 left-0.5 font-pixel text-[7px]" style={{ color: "#ffd27a", textShadow: "0 0 4px #ffd27a" }}>★</div>}
                <div className="w-full aspect-square rounded bg-[#1a0c04]/70 flex items-center justify-center overflow-hidden relative"
                  style={{ boxShadow: `inset 0 0 10px ${t.color}55` }}>
                  <div className={sel ? "hop" : ""}><Plushie id={t.id} size={56} /></div>
                </div>
                <div className="font-pixel text-[7px] text-amber-100 leading-tight text-center truncate w-full">{t.name}</div>
                <div className="font-pixel text-[6px]" style={{ color: "#ffd27a" }}>VELx{t.speedMul.toFixed(1)}</div>
                {own ? (
                  isStart ? (
                    <div className="font-pixel text-[7px]" style={{ color: "#ffd27a" }}>ARRANQUE</div>
                  ) : (
                    <div
                      onClick={(e) => { e.stopPropagation(); onEquipTool(t.id); setPreviewTool(t.id); }}
                      className="font-pixel text-[7px] bg-[#7fc24a] text-[#1a2a08] px-1.5 py-0.5 rounded border border-[#2a5a10]"
                    >USAR</div>
                  )
                ) : (
                  <div
                    onClick={(e) => { e.stopPropagation(); if (canBuy) { onBuyTool(t.id, t.metaPrice); setPreviewTool(t.id); } }}
                    className="font-pixel text-[7px] px-1.5 py-0.5 rounded border flex items-center gap-0.5"
                    style={{ background: canBuy ? "#ffd27a" : "#6a5a4a", color: "#3a2010", borderColor: "#3a2010", opacity: canBuy ? 1 : 0.7 }}
                  ><Crown size={8} /> {t.metaPrice}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className="btn-3d flex-1 font-pixel text-[9px] py-2 rounded border-2 border-b-4 active:border-b-2 flex items-center justify-center gap-1 transition-colors"
      style={{
        background: active ? "linear-gradient(180deg,#ffb347,#d97a1a)" : "#3a2010",
        color: active ? "#3a1808" : "#d9b070",
        borderColor: "#1a0c04",
        boxShadow: active ? "0 0 10px #ffb34755" : "none",
      }}
    >
      <span className="text-[12px]">{emoji}</span>{label}
    </button>
  );
}

function StatChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="font-pixel text-[7px] px-1.5 py-0.5 rounded-full border"
      style={{ background: `${color}22`, color, borderColor: `${color}88` }}
    >{label}</span>
  );
}
