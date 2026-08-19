import type { BossType } from "../art/Bosses";

export type GenreId =
  | "tiles" | "shmup" | "rpg" | "dance" | "juicio"
  | "novela" | "sigilo" | "breakout" | "lucha" | "carrera"
  | "micro" | "td" | "runner" | "match3" | "doodle"
  | "cocina" | "fisica" | "cavar" | "snake" | "final";

export interface GenreDef {
  id: GenreId;
  title: string;
  blurb: string;
}

export const GENRE: Record<GenreId, GenreDef> = {
  tiles: { id: "tiles", title: "Piano", blurb: "Tocá las teclas." },
  shmup: { id: "shmup", title: "Navecitas", blurb: "Deslizá y esquivá." },
  rpg: { id: "rpg", title: "Turnos", blurb: "Elegí un comando." },
  dance: { id: "dance", title: "Baile", blurb: "Flechas a tiempo." },
  juicio: { id: "juicio", title: "Juicio", blurb: "Elegí la pista." },
  novela: { id: "novela", title: "Novela", blurb: "Decidí ya." },
  sigilo: { id: "sigilo", title: "Sigilo", blurb: "No te vea." },
  breakout: { id: "breakout", title: "Rebote", blurb: "Rebotá la pelota." },
  lucha: { id: "lucha", title: "Lucha", blurb: "Alto, bajo, bloqueo." },
  carrera: { id: "carrera", title: "Carrera", blurb: "Alcanzalo." },
  micro: { id: "micro", title: "Pelaje", blurb: "Saltá de pelo en pelo." },
  td: { id: "td", title: "Defensa", blurb: "Poné trampas." },
  runner: { id: "runner", title: "Huida", blurb: "Salto y agache." },
  match3: { id: "match3", title: "Combinar", blurb: "Tres iguales." },
  doodle: { id: "doodle", title: "Salto", blurb: "Subí sin caer." },
  cocina: { id: "cocina", title: "Cocina", blurb: "Armá el plato." },
  fisica: { id: "fisica", title: "Resortera", blurb: "Apuntá y soltá." },
  cavar: { id: "cavar", title: "Excavar", blurb: "Cavá túneles." },
  snake: { id: "snake", title: "Cola", blurb: "Crece y rodealo." },
  final: { id: "final", title: "El Feo", blurb: "Tres fases." },
};

export const BOSS_GENRE: Record<BossType, GenreId> = {
  escoba: "tiles",
  vacuum: "shmup",
  chef: "rpg",
  caballo: "dance",
  alacena: "juicio",
  espectro: "novela",
  fantasma: "sigilo",
  cuchara: "breakout",
  gato: "lucha",
  pastelero: "carrera",
  duende: "micro",
  reinaMigas: "td",
  oven: "runner",
  maestroChoco: "match3",
  hornito: "doodle",
  fridge: "cocina",
  bread: "fisica",
  antisam: "cavar",
  refriRey: "snake",
  bigotesGrande: "final",
  bigotes: "final",
};
