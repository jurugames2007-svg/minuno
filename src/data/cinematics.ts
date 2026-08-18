import type { BossType } from "../art/Bosses";
import type { SkinId } from "./skins";

export interface Plat { x: number; y: number; w: number; h: number; }
export interface StageDef {
  title: string;
  place: string;
  sky: string;
  glow: string;
  plats: Plat[];
  intro: string[];
  outro: string[];
}

const W = 360;
const FLOOR = 560;

function floor(): Plat { return { x: 20, y: FLOOR, w: W - 40, h: 18 }; }

export const STAGES: Partial<Record<BossType, StageDef>> = {
  escoba: {
    title: "EL ARMARIO", place: "Cuarto de escobas",
    sky: "#2a1208", glow: "#ff7a2a",
    plats: [floor(), { x: 36, y: 470, w: 110, h: 14 }, { x: 210, y: 400, w: 120, h: 14 }, { x: 80, y: 330, w: 100, h: 14 }, { x: 200, y: 260, w: 110, h: 14 }],
    intro: ["Una escoba se levanta sola.", "El polvo gira. El mango brilla.", "«Nadie barre a Maxine.»"],
    outro: ["La escoba cae en astillas.", "El armario se abre. Seguí cavando."],
  },
  gato: {
    title: "PASARELA ARCOÍRIS", place: "Azotea de lata",
    sky: "#1a0830", glow: "#ff8fb6",
    plats: [floor(), { x: 40, y: 460, w: 90, h: 14 }, { x: 160, y: 400, w: 90, h: 14 }, { x: 240, y: 340, w: 90, h: 14 }, { x: 70, y: 280, w: 140, h: 14 }],
    intro: ["Siete gatos. Un maullido.", "El arcoíris se tensa como cuerda.", "«¡Atacá cuando se lama!»"],
    outro: ["El gato se enrosca y ronronea.", "La pasarela se apaga. Bajá."],
  },
  antisam: {
    title: "SALA DE COSTURA", place: "Taller de botones",
    sky: "#201008", glow: "#d44a6a",
    plats: [floor(), { x: 30, y: 455, w: 130, h: 14 }, { x: 200, y: 390, w: 130, h: 14 }, { x: 90, y: 310, w: 160, h: 14 }],
    intro: ["Hilo negro. Ojos de botón.", "Anti-Sam se hincha.", "«Cortá la costura.»"],
    outro: ["Los botones ruedan por el piso.", "El taller se deshace. Seguí."],
  },
  caballo: {
    title: "CUARTO DE JUGUETES", place: "Caballito de madera",
    sky: "#2a1808", glow: "#c9842a",
    plats: [floor(), { x: 24, y: 480, w: 80, h: 14 }, { x: 140, y: 420, w: 80, h: 14 }, { x: 250, y: 360, w: 80, h: 14 }, { x: 80, y: 300, w: 200, h: 14 }],
    intro: ["El balancín cruje.", "El caballo abre los ojos.", "«¡Saltá las patas!»"],
    outro: ["El caballo se queda quieto.", "Un niño imaginario aplaude. Seguí."],
  },
  fantasma: {
    title: "COCINA FANTASMA", place: "Vapor y platos",
    sky: "#0e2430", glow: "#7fd0ff",
    plats: [floor(), { x: 50, y: 450, w: 80, h: 14 }, { x: 220, y: 390, w: 80, h: 14 }, { x: 120, y: 320, w: 120, h: 14 }, { x: 40, y: 250, w: 80, h: 14 }],
    intro: ["El vapor toma forma.", "Un delantal vacío flota.", "«Esperá a que se vuelva sólido.»"],
    outro: ["El espectro se disuelve en harina.", "La cocina vuelve a oler a pan."],
  },
  cuchara: {
    title: "EL BOL GIGANTE", place: "Mesa de amasado",
    sky: "#241808", glow: "#d7d2c4",
    plats: [floor(), { x: 30, y: 470, w: 140, h: 14 }, { x: 190, y: 400, w: 140, h: 14 }, { x: 110, y: 320, w: 140, h: 14 }],
    intro: ["La cuchara de palo crece.", "La masa gira en remolino.", "«Pegale al cargar.»"],
    outro: ["La cuchara vuelve a ser utensilio.", "Queda un bol de masa. Seguí."],
  },
  hornito: {
    title: "BOCA DEL HORNO", place: "Ladrillos al rojo",
    sky: "#2a0a04", glow: "#ff5a2a",
    plats: [floor(), { x: 40, y: 460, w: 100, h: 14 }, { x: 210, y: 400, w: 110, h: 14 }, { x: 90, y: 330, w: 180, h: 14 }],
    intro: ["La puerta del horno se abre.", "Chef Hornito sonríe con fuego.", "«Atacá cuando se enfríe.»"],
    outro: ["El horno se apaga. Huele a baguette.", "Una bandeja baja. Seguí."],
  },
  refriRey: {
    title: "TRONO HELADO", place: "Cámara del rey",
    sky: "#0a2030", glow: "#7fd0ff",
    plats: [floor(), { x: 28, y: 470, w: 90, h: 14 }, { x: 240, y: 470, w: 90, h: 14 }, { x: 120, y: 390, w: 120, h: 14 }, { x: 50, y: 310, w: 90, h: 14 }, { x: 220, y: 310, w: 90, h: 14 }],
    intro: ["El hielo canta.", "El Refrigerador Rey se corona.", "«Rompe sus compresores.»"],
    outro: ["El hielo se derrite en leche.", "El trono queda vacío. Seguí."],
  },
  alacena: {
    title: "DESPENSA CIEN AÑOS", place: "Estanterías vivas",
    sky: "#1a1008", glow: "#c9a06a",
    plats: [floor(), { x: 24, y: 480, w: 70, h: 14 }, { x: 140, y: 430, w: 80, h: 14 }, { x: 250, y: 380, w: 80, h: 14 }, { x: 70, y: 320, w: 90, h: 14 }, { x: 200, y: 260, w: 90, h: 14 }],
    intro: ["Las puertas crujen solas.", "Latas y recetarios caen.", "«Atacá al abrir.»"],
    outro: ["La alacena se cierra en paz.", "Queda un frasco de mermelada. Seguí."],
  },
  bigotesGrande: {
    title: "SALA DEL FEO", place: "El último horno",
    sky: "#140808", glow: "#ff3060",
    plats: [floor(), { x: 30, y: 470, w: 100, h: 14 }, { x: 230, y: 470, w: 100, h: 14 }, { x: 110, y: 390, w: 140, h: 14 }, { x: 40, y: 310, w: 90, h: 14 }, { x: 230, y: 310, w: 90, h: 14 }],
    intro: ["Parche. Pinchos. Dientes chuecos.", "Bigotes el Grande ladra tu nombre.", "«¡Rescatá a Javiera!»"],
    outro: ["El saco se abre. Javiera sale.", "Maxine ladra. La cocina es de ellas."],
  },
};

export function stageFor(type: BossType): StageDef {
  return STAGES[type] ?? {
    title: "ARENA ABIERTA", place: "Patio de harina",
    sky: "#1a1008", glow: "#ffb347",
    plats: [floor(), { x: 40, y: 460, w: 120, h: 14 }, { x: 200, y: 380, w: 120, h: 14 }],
    intro: ["Algo se acerca.", "El suelo tiembla.", "¡A pelear!"],
    outro: ["Cayó. El camino sigue."],
  };
}

export function maxineIntroKind(skin: SkinId): "dash" | "drop" | "fade" | "spin" | "tiny" | "charge" | "sparkle" {
  if (skin === "bebe") return "tiny";
  if (skin === "santa" || skin === "astronauta" || skin === "penguin") return "drop";
  if (skin === "vampire" || skin === "darth" || skin === "spooky" || skin === "bat" || skin === "ender") return "fade";
  if (skin === "barbie" || skin === "princess" || skin === "schnauzarella" || skin === "payaso") return "spin";
  if (skin === "boxer" || skin === "subzero" || skin === "wonder" || skin === "captain") return "charge";
  if (skin === "unicornio" || skin === "hada" || skin === "kissy" || skin === "yarnaby") return "sparkle";
  return "dash";
}
