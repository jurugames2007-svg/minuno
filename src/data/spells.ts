import type { BossType } from "../art/Bosses";

export type SpellId =
  | "barrido"
  | "arcoiris"
  | "costura"
  | "carga"
  | "espectro"
  | "masa"
  | "llama"
  | "hielo"
  | "iman"
  | "ladrido";

export interface SpellDef {
  id: SpellId;
  name: string;
  tag: string;
  desc: string;
  color: string;
  boss: BossType;
}

export const SPELLS: SpellDef[] = [
  { id: "barrido", name: "Barrido", tag: "Escoba", desc: "Abanico de polvo. Más ancho.", color: "#d9c39a", boss: "escoba" },
  { id: "arcoiris", name: "Arcoíris", tag: "Gato", desc: "Impulso y un instante invulnerable.", color: "#ff8fb6", boss: "gato" },
  { id: "costura", name: "Costura", tag: "Anti-Sam", desc: "Escudo de hilo un golpe.", color: "#d44a6a", boss: "antisam" },
  { id: "carga", name: "Embestida", tag: "Caballo", desc: "Embiste hacia adelante.", color: "#c9842a", boss: "caballo" },
  { id: "espectro", name: "Vapor", tag: "Fantasma", desc: "Atraviesa un instante.", color: "#7fd0ff", boss: "fantasma" },
  { id: "masa", name: "Bola de masa", tag: "Cuchara", desc: "Tira masa con gravedad.", color: "#e8c48a", boss: "cuchara" },
  { id: "llama", name: "Llamarada", tag: "Hornito", desc: "Chorro de horno.", color: "#ff5a2a", boss: "hornito" },
  { id: "hielo", name: "Escarcha", tag: "Rey", desc: "Congela el aire cercano.", color: "#7fd0ff", boss: "refriRey" },
  { id: "iman", name: "Despensa", tag: "Alacena", desc: "Atrae panes un rato.", color: "#c9a06a", boss: "alacena" },
  { id: "ladrido", name: "Ladrido", tag: "Feo", desc: "Onda que empuja todo.", color: "#ff3060", boss: "bigotesGrande" },
];

export const SPELL_MAP: Record<SpellId, SpellDef> = Object.fromEntries(SPELLS.map((s) => [s.id, s])) as Record<SpellId, SpellDef>;

export function spellForBoss(type: BossType): SpellId {
  if (type === "bigotes") return "ladrido";
  const found = SPELLS.find((s) => s.boss === type);
  return found ? found.id : "barrido";
}
