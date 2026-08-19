import { useMemo, useState } from "react";
import Maxine from "../art/Maxine";
import { SKINS, RARITY_COLOR, CATEGORIES, canBuySkin, isUglyLocked, visibleShopSkins, type SkinId, type SkinCategory } from "../data/skins";
import { TOOLS, TOOL_MAP, toolRank, RANK_COLOR, Plushie, type ToolId } from "../art/Plushie";
import { Crown, Flour, PixelNpc } from "../art/Decor";

interface Props {
  skin: SkinId;
  owned: SkinId[];
  crumbs: number;
  ownedTools: ToolId[];
  startTool: ToolId;
  storyWon: boolean;
  onEquip: (id: SkinId) => void;
  onBuySkin: (id: SkinId) => void;
  onBuyTool: (id: ToolId, price: number) => void;
  onEquipTool: (id: ToolId) => void;
  onBack: () => void;
}

type Tab = "skins" | "tools";

export default function Shop({ skin, owned, crumbs, ownedTools, startTool, storyWon, onEquip, onBuySkin, onBuyTool, onEquipTool, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("skins");
  const [previewSkin, setPreviewSkin] = useState<SkinId>(skin);
  const [previewTool, setPreviewTool] = useState<ToolId>(startTool);
  const [cat, setCat] = useState<SkinCategory | "Todas">("Todas");

  const list = useMemo(() => visibleShopSkins(owned).filter((s) => cat === "Todas" || s.category === cat), [cat, owned]);
  const cats = useMemo(() => CATEGORIES.filter((c) => c !== "Secreto" || owned.some((id) => SKINS.find((s) => s.id === id)?.category === "Secreto")), [owned]);
  const curSkin = SKINS.find((s) => s.id === previewSkin) ?? SKINS[0];
  const curTool = TOOL_MAP[previewTool];
  const rank = toolRank(curTool);
  const locked = isUglyLocked(curSkin, owned, storyWon);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="absolute inset-0 brick" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 50% at 50% 20%, rgba(255,180,90,.18), transparent 70%), linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.55))" }} />
      <Flour count={14} />

      <div className="absolute top-0 inset-x-0 h-[26%]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 180" preserveAspectRatio="none">
          <rect x="10" y="54" width="340" height="9" fill="#5a3216" stroke="#2a1408" strokeWidth="2" />
          <rect x="10" y="128" width="340" height="9" fill="#5a3216" stroke="#2a1408" strokeWidth="2" />
          <line x1="30" y1="0" x2="30" y2="54" stroke="#3a2010" strokeWidth="2" />
          <line x1="330" y1="0" x2="330" y2="54" stroke="#3a2010" strokeWidth="2" />
          <rect x="40" y="26" width="22" height="28" rx="3" fill="#ff8fa0" opacity="0.85" stroke="#7a1430" strokeWidth="1.5" />
          <rect x="40" y="24" width="22" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          <rect x="74" y="30" width="20" height="24" rx="3" fill="#ffe066" opacity="0.85" stroke="#a8730a" strokeWidth="1.5" />
          <rect x="74" y="28" width="20" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          <rect x="106" y="24" width="24" height="30" rx="3" fill="#7fc24a" opacity="0.85" stroke="#2a5a10" strokeWidth="1.5" />
          <rect x="106" y="22" width="24" height="6" fill="#d7d2c4" stroke="#3a2010" strokeWidth="1" />
          <g transform="translate(40 84)">
            <rect x="0" y="0" width="52" height="32" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1.5" />
            <text x="26" y="14" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="9" fill="#fff3d6">MAXINE</text>
            <text x="26" y="25" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="8" fill="#ffd27a">HORNO</text>
          </g>
        </svg>
        <div className="absolute left-[18%] top-[12%] hop" style={{ animationDelay: "0.3s" }}><PixelNpc variant={0} size={34} /></div>
        <div className="absolute right-[20%] top-[14%] hop" style={{ animationDelay: "1.1s" }}><PixelNpc variant={2} size={32} /></div>
      </div>

      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-30">
        <button onClick={onBack} className="btn-3d font-display font-bold text-[13px] bg-[#3a2010] text-amber-100 px-3 py-2 rounded-xl border-2 border-[#1a0c04] border-b-4 active:border-b-2">
          Atrás
        </button>
        <div className="flex items-center gap-1.5 bg-[#3a2010] border-2 border-[#1a0c04] rounded-xl px-3 py-2">
          <Crown size={16} />
          <span className="font-display font-bold text-[15px] text-amber-200 tabular-nums">{crumbs}</span>
        </div>
      </div>

      <div className="absolute left-2 right-2 z-30 flex gap-1.5" style={{ top: "calc(2% + 42px)" }}>
        <TabBtn active={tab === "skins"} onClick={() => setTab("skins")} label="Pieles" />
        <TabBtn active={tab === "tools"} onClick={() => setTab("tools")} label="Herramientas" />
      </div>

      <div className="absolute left-0 right-0" style={{ top: "28%", height: "28%" }}>
        <div className="absolute bottom-0 inset-x-0 h-[46%] wood border-t-4 border-[#2a1408]" style={{ boxShadow: "inset 0 6px 0 rgba(255,255,255,.08)" }} />
        <svg className="absolute left-2 bottom-0" width="52" height="66" viewBox="0 0 56 70">
          <ellipse cx="28" cy="8" rx="22" ry="6" fill="#3a2010" />
          <path d="M6 8 Q2 36 6 62 Q28 70 50 62 Q54 36 50 8 Z" fill="#8a5128" stroke="#2a1408" strokeWidth="2" />
          <path d="M6 20 Q28 26 50 20 M6 48 Q28 54 50 48" stroke="#3a2010" strokeWidth="2" fill="none" />
        </svg>
        {tab === "tools" ? (
          <div className="absolute right-2 bottom-2" style={{ width: 74, height: 74 }}>
            <div className="absolute inset-0 rounded-lg border-2 border-[#3a2010]" style={{ background: "radial-gradient(circle at 50% 40%, #fff3d655, #3a201088 70%, #1a0c04cc)", boxShadow: "inset 0 0 14px #ffd27a66, 0 0 12px #ffd27a33" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hop"><Plushie id={previewTool} size={52} /></div>
              </div>
              <div className="absolute top-0.5 inset-x-0 text-center font-display text-[10px] font-bold text-amber-200/80">Vitrina</div>
            </div>
          </div>
        ) : (
          <svg className="absolute right-2 bottom-0" width="56" height="60" viewBox="0 0 60 64">
            <path d="M10 24 Q4 60 14 62 H46 Q56 60 50 24 Q40 18 30 18 Q20 18 10 24 Z" fill="#d9c39a" stroke="#5a3a1a" strokeWidth="2" />
            <path d="M22 18 q8 -8 16 0" fill="none" stroke="#5a3a1a" strokeWidth="2" />
            <text x="30" y="46" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="8" fill="#5a3a1a">HARINA</text>
          </svg>
        )}

        <div className="absolute left-1/2 -translate-x-1/2 bottom-[30%] z-10 pop" key={tab + (tab === "skins" ? previewSkin : previewTool)}>
          <div className="relative" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.5))" }}>
            {tab === "tools" && (
              <div className="absolute left-[28%] top-[58%] z-20 rotate-12">
                <Plushie id={previewTool} size={previewTool === "kissy" ? 34 : 28} />
              </div>
            )}
            <Maxine skin={tab === "skins" ? previewSkin : skin} pose="idle" size={140} />
            {tab === "skins" && locked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/70 text-amber-100 font-display font-bold text-xs px-2 py-1 rounded-full border border-amber-300/40">Cerrada</div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 z-20 bg-[#fff3d6] border-2 border-[#3a2010] rounded-xl px-3 py-1 text-center shadow-lg min-w-[160px]">
          {tab === "skins" ? (
            <>
              <div className="font-display font-bold text-[#3a2010] text-[15px] leading-none">{curSkin.name}</div>
              <div className="font-display text-[11px] mt-0.5 font-semibold" style={{ color: locked ? "#8a4a20" : RARITY_COLOR[curSkin.rarity] }}>
                {locked ? "FEO · SECRETA" : `${curSkin.rarity} · ${curSkin.category}`}
              </div>
            </>
          ) : (
            <>
              <div className="font-display font-bold text-[#3a2010] text-[15px] leading-none">{curTool.name}</div>
              <div className="font-display text-[11px] mt-0.5 font-semibold" style={{ color: RANK_COLOR[rank] }}>{rank} · vel ×{curTool.speedMul.toFixed(2)}</div>
            </>
          )}
        </div>
      </div>

      <div className="absolute left-3 right-3 top-[57%] z-20 text-center">
        {tab === "skins" ? (
          <p className="font-display text-amber-100/90 text-[13px] leading-snug px-2">
            {locked ? "Derrota a Bigotes el Feo para ponerte su piel. No se compra: se gana." : curSkin.blurb}
          </p>
        ) : (
          <div className="space-y-1">
            <p className="font-display text-amber-100/90 text-[13px] leading-snug px-2">{curTool.desc}</p>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <StatChip label={`Vel ×${curTool.speedMul.toFixed(2)}`} color="#ffd27a" />
              {curTool.wide && <StatChip label="Rompe al lado" color="#7fd0ff" />}
              {curTool.reach && <StatChip label="Alcance 2" color="#7fd0ff" />}
              {curTool.slowAura && <StatChip label="Aura lenta" color="#b06bff" />}
              {curTool.bounce && <StatChip label="1 rebote" color="#7fc24a" />}
              {curTool.healOnDig && <StatChip label="Cura al cavar" color="#ff8fa0" />}
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-0 right-0 bottom-0 top-[67%] z-20 bg-gradient-to-b from-[#2a1408]/80 to-[#1a0c04]/95 border-t-2 border-[#5a3216]">
        {tab === "skins" && (
          <div className="flex gap-1 overflow-x-auto scrollbar-none px-2 pt-1.5">
            <CatChip label="Todas" active={cat === "Todas"} onClick={() => setCat("Todas")} />
            {cats.map((c) => (
              <CatChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} ugly={c === "Feo"} />
            ))}
          </div>
        )}
        <div className="flex gap-2 overflow-x-auto scrollbar-none px-3 py-2 h-[calc(100%-28px)] items-stretch">
          {tab === "skins" ? list.map((s) => {
            const own = owned.includes(s.id);
            const active = s.id === skin;
            const sel = s.id === previewSkin;
            const secret = isUglyLocked(s, owned, storyWon);
            const canBuy = canBuySkin(s, owned, crumbs, storyWon);
            return (
              <button
                key={s.id}
                onClick={() => setPreviewSkin(s.id)}
                className="btn-3d shrink-0 w-[92px] rounded-xl border-2 p-1.5 flex flex-col items-center gap-1 relative transition-transform hover:scale-[1.03]"
                style={{
                  background: active ? "#5a3216" : "#3a2010",
                  borderColor: sel ? RARITY_COLOR[s.rarity] : "#1a0c04",
                  boxShadow: sel ? `0 0 0 2px ${RARITY_COLOR[s.rarity]}55, 0 4px 0 #1a0c04` : "0 3px 0 #1a0c04",
                }}
              >
                <div className="absolute top-0.5 right-0.5 font-display font-bold text-[9px] px-1 rounded" style={{ background: RARITY_COLOR[s.rarity], color: "#1a0c04" }}>
                  {s.rarity === "Legendario" ? "LEG" : s.rarity === "Épico" ? "EPI" : s.rarity === "Feo" ? "FEO" : s.rarity.slice(0, 3).toUpperCase()}
                </div>
                <div className="w-full aspect-square rounded bg-[#1a0c04]/60 flex items-center justify-center overflow-hidden relative">
                  <Maxine skin={s.id} pose="idle" size={64} animate={sel && !secret} />
                  {secret && <div className="absolute inset-0 bg-black/55 flex items-center justify-center font-display font-bold text-amber-100 text-[11px]">?</div>}
                </div>
                <div className="font-display font-semibold text-[11px] text-amber-100 leading-tight text-center truncate w-full">{secret ? "???" : s.name}</div>
                {secret ? (
                  <div className="font-display text-[10px] text-[#c07040]">Derrota a Bigotes</div>
                ) : own ? (
                  active ? (
                    <div className="font-display font-bold text-[11px]" style={{ color: "#7fc24a" }}>En uso</div>
                  ) : (
                    <div
                      onClick={(e) => { e.stopPropagation(); onEquip(s.id); setPreviewSkin(s.id); }}
                      className="font-display font-bold text-[11px] bg-[#7fc24a] text-[#1a2a08] px-1.5 py-0.5 rounded border border-[#2a5a10]"
                    >Equipar</div>
                  )
                ) : (
                  <div
                    onClick={(e) => { e.stopPropagation(); if (canBuy) { onBuySkin(s.id); setPreviewSkin(s.id); } }}
                    className="font-display font-bold text-[11px] px-1.5 py-0.5 rounded border flex items-center gap-0.5"
                    style={{ background: canBuy ? "#ffd27a" : "#6a5a4a", color: "#3a2010", borderColor: "#3a2010", opacity: canBuy ? 1 : 0.7 }}
                  ><Crown size={8} /> {s.price === 0 ? "Gratis" : s.price}</div>
                )}
              </button>
            );
          }) : TOOLS.filter((t) => t.unlock !== "secret" || ownedTools.includes(t.id)).map((t) => {
            const own = ownedTools.includes(t.id);
            const isStart = t.id === startTool;
            const sel = t.id === previewTool;
            const canBuy = crumbs >= t.metaPrice;
            const rk = toolRank(t);
            return (
              <button
                key={t.id}
                onClick={() => setPreviewTool(t.id)}
                className="btn-3d shrink-0 w-[92px] rounded-xl border-2 p-1.5 flex flex-col items-center gap-1 relative transition-transform hover:scale-[1.03] overflow-hidden"
                style={{
                  background: isStart ? "#5a3216" : "#3a2010",
                  borderColor: sel ? RANK_COLOR[rk] : "#1a0c04",
                  boxShadow: sel ? `0 0 0 2px ${RANK_COLOR[rk]}55, 0 4px 0 #1a0c04` : "0 3px 0 #1a0c04",
                }}
              >
                <div className="absolute top-0.5 right-0.5 font-display font-bold text-[9px] px-1 rounded" style={{ background: RANK_COLOR[rk], color: "#1a0c04" }}>
                  {rk.slice(0, 3).toUpperCase()}
                </div>
                {isStart && <div className="absolute top-0.5 left-0.5 font-display text-[11px] text-amber-300">★</div>}
                <div className="w-full aspect-square rounded bg-[#1a0c04]/70 flex items-center justify-center overflow-hidden relative" style={{ boxShadow: `inset 0 0 10px ${t.color}55` }}>
                  <div className={sel ? "hop" : ""}><Plushie id={t.id} size={56} /></div>
                </div>
                <div className="font-display font-semibold text-[11px] text-amber-100 leading-tight text-center truncate w-full">{t.name}</div>
                <div className="font-display text-[10px]" style={{ color: "#ffd27a" }}>vel ×{t.speedMul.toFixed(1)}</div>
                {own ? (
                  isStart ? (
                    <div className="font-display font-bold text-[11px]" style={{ color: "#ffd27a" }}>Arranque</div>
                  ) : (
                    <div
                      onClick={(e) => { e.stopPropagation(); onEquipTool(t.id); setPreviewTool(t.id); }}
                      className="font-display font-bold text-[11px] bg-[#7fc24a] text-[#1a2a08] px-1.5 py-0.5 rounded border border-[#2a5a10]"
                    >Usar</div>
                  )
                ) : (
                  <div
                    onClick={(e) => { e.stopPropagation(); if (canBuy) { onBuyTool(t.id, t.metaPrice); setPreviewTool(t.id); } }}
                    className="font-display font-bold text-[11px] px-1.5 py-0.5 rounded border flex items-center gap-0.5"
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

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="btn-3d flex-1 font-display font-bold text-[14px] py-2 rounded-xl border-2 border-b-4 active:border-b-2 transition-colors"
      style={{
        background: active ? "linear-gradient(180deg,#ffb347,#d97a1a)" : "#3a2010",
        color: active ? "#3a1808" : "#d9b070",
        borderColor: "#1a0c04",
        boxShadow: active ? "0 0 10px #ffb34755" : "none",
      }}
    >
      {label}
    </button>
  );
}

function CatChip({ label, active, onClick, ugly }: { label: string; active: boolean; onClick: () => void; ugly?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 font-display font-bold text-[11px] px-2 py-0.5 rounded-full border"
      style={{
        background: active ? (ugly ? "#c07040" : "#ffd27a") : "#2a1408",
        color: active ? "#1a0c04" : "#d9b070",
        borderColor: ugly ? "#8a4020" : "#5a3216",
      }}
    >{label}</button>
  );
}

function StatChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="font-display font-semibold text-[11px] px-1.5 py-0.5 rounded-full border" style={{ background: `${color}22`, color, borderColor: `${color}88` }}>
      {label}
    </span>
  );
}
