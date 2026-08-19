import type { BossType } from "../art/Bosses";

/** Fondos de arena estilo Mega Man: cada jefe es un sitio distinto. */
export default function ArenaArt({ type }: { type: BossType }) {
  switch (type) {
    case "escoba": return <Closet />;
    case "gato": return <Rooftop />;
    case "antisam": return <Sewing />;
    case "caballo": return <ToyRoom />;
    case "fantasma": return <GhostKitchen />;
    case "cuchara": return <BowlTable />;
    case "hornito": return <OvenMouth />;
    case "refriRey": return <IceThrone />;
    case "alacena": return <Pantry />;
    case "bigotesGrande":
    case "bigotes": return <UglyHall />;
    default: return <Closet />;
  }
}

function Closet() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#4a2410 0%,#2a1408 70%,#1a0c04 100%)" }} />
      <div className="absolute left-8 right-8 top-24 bottom-40 opacity-35" style={{
        backgroundImage: "repeating-linear-gradient(180deg,#5a3216 0 10px,#0000 10px 46px)",
      }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-28 font-display font-bold text-[12px] tracking-[0.35em] text-amber-200/25">ESCOBAS</div>
    </div>
  );
}

function Rooftop() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#1a0838 0%,#2a1048 40%,#3a2060 100%)" }} />
      <div className="absolute right-8 top-10 w-16 h-16 rounded-full" style={{ background: "#fff3d6", boxShadow: "0 0 30px #ffe0b088" }} />
      <svg className="absolute inset-x-0 top-24 w-full h-24" viewBox="0 0 360 80" preserveAspectRatio="none">
        <path d="M0 50 Q90 10 180 40 T360 20" fill="none" stroke="#ff5a6a" strokeWidth="4" />
        <path d="M0 58 Q90 18 180 48 T360 28" fill="none" stroke="#ffd027" strokeWidth="4" />
        <path d="M0 66 Q90 26 180 56 T360 36" fill="none" stroke="#7fd0ff" strokeWidth="4" />
      </svg>
      <div className="absolute inset-x-0 bottom-28 h-8" style={{ background: "repeating-linear-gradient(90deg,#6a6a74 0 18px,#4a4a52 18px 20px)" }} />
    </div>
  );
}

function Sewing() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#3a1810,#201008)" }} />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg,#0000 0 14px,#d44a6a22 14px 16px), repeating-linear-gradient(90deg,#0000 0 14px,#d44a6a22 14px 16px)" }} />
      {[30, 80, 150, 220].map((x, i) => (
        <div key={x} className="absolute rounded-full" style={{ left: x, top: 40 + i * 18, width: 22, height: 22, background: ["#d44a6a", "#7fd0ff", "#ffd027", "#fff"][i], boxShadow: "inset 0 0 0 4px #2a1008" }} />
      ))}
      <div className="absolute left-8 right-8 top-36 h-px" style={{ background: "#c9a06a", transform: "rotate(-8deg)" }} />
    </div>
  );
}

function ToyRoom() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#5a3a18,#2a1808)" }} />
      <div className="absolute inset-x-0 top-0 h-20" style={{ background: "repeating-linear-gradient(90deg,#7fc24a 0 28px,#ff8fa0 28px 56px,#7fd0ff 56px 84px)" }} />
      <div className="absolute left-6 top-28 w-10 h-10" style={{ background: "#d9342b" }} />
      <div className="absolute left-14 top-32 w-10 h-10" style={{ background: "#ffd027" }} />
      <div className="absolute right-10 top-24 w-14 h-10 rounded-t-full" style={{ background: "#8a5128" }} />
    </div>
  );
}

function GhostKitchen() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0e2430,#081418)" }} />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(0deg,#7fd0ff11 0 18px,#0000 18px 36px)" }} />
      {[50, 160, 270].map((x) => (
        <div key={x} className="absolute" style={{ left: x, top: 30 }}>
          <div className="w-0.5 h-16 mx-auto" style={{ background: "#5a6a70" }} />
          <div className="w-10 h-8 rounded-b-full" style={{ background: "#8a9498" }} />
        </div>
      ))}
      <div className="absolute left-1/2 top-20 w-8 h-10 rounded-full opacity-40 hop" style={{ background: "#d8f4ff" }} />
    </div>
  );
}

function BowlTable() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#4a3010,#241808)" }} />
      <div className="absolute inset-x-6 top-24 h-40 rounded-[40%]" style={{ background: "radial-gradient(circle at 50% 20%,#fff3d6,#d99243 70%,#7a4410)", boxShadow: "inset 0 -20px 0 #5a281088" }} />
      <div className="absolute left-10 top-16 w-8 h-8 rounded-full" style={{ background: "#ffe4b0", opacity: 0.7 }} />
      <div className="absolute right-16 top-20 w-6 h-6 rounded-full" style={{ background: "#fff3d6", opacity: 0.5 }} />
    </div>
  );
}

function OvenMouth() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 brick opacity-80" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(70% 50% at 50% 80%,#ff5a2a66,transparent 70%)" }} />
      <div className="absolute left-8 right-8 top-20 h-36 rounded-t-[40%] border-8" style={{ borderColor: "#3a1a08", background: "radial-gradient(circle,#ffd27a,#ff5a2a 55%,#3a0a04)" }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-28 w-16 h-20 flicker" style={{ background: "radial-gradient(circle,#fff3d6,#ff7a2a)" }} />
    </div>
  );
}

function IceThrone() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0a2038,#0a141c)" }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-16 w-28 h-36" style={{ background: "linear-gradient(180deg,#d8f4ff,#7fd0ff88)", clipPath: "polygon(20% 100%, 0 40%, 30% 0, 70% 0, 100% 40%, 80% 100%)", boxShadow: "0 0 24px #7fd0ff66" }} />
      {[20, 80, 280, 320].map((x) => (
        <div key={x} className="absolute bottom-36 w-6" style={{ left: x, height: 40 + (x % 30), background: "linear-gradient(#d8f4ff,#4a8aa8)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
      ))}
    </div>
  );
}

function Pantry() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#3a2410,#1a1008)" }} />
      {[50, 110, 170, 230].map((y) => (
        <div key={y} className="absolute left-8 right-8 h-3" style={{ top: y, background: "#6a3a14", boxShadow: "0 4px 0 #1a0c04" }}>
          {[12, 50, 90, 140, 190].map((x) => (
            <div key={x} className="absolute -top-7 w-7 h-7 rounded-sm" style={{ left: x, background: ["#d44a6a", "#7fc24a", "#c9842a", "#7fd0ff", "#fff3d6"][x % 5], border: "2px solid #3a2010" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function UglyHall() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#2a0808,#0a0404)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 20%,#ff306044,transparent)" }} />
      {[40, 300].map((x) => (
        <div key={x} className="absolute top-0 w-3" style={{ left: x, height: 180, background: "#3a2010" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute w-8 h-1.5" style={{ left: x < 100 ? 3 : -32, top: 20 + i * 28, background: "#8a8a8a", transform: `rotate(${x < 100 ? 20 : -20}deg)` }} />
          ))}
        </div>
      ))}
      <div className="absolute left-1/2 -translate-x-1/2 top-14 font-display font-bold text-[22px] text-rose-300/40 tracking-[0.4em]">FEO</div>
    </div>
  );
}
