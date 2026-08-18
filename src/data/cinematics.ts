import type { BossType } from "../art/Bosses";
import type { SkinId } from "./skins";

export interface Plat { x: number; y: number; w: number; h: number; }
export type MaxineMood = "brave" | "scared" | "curious" | "angry" | "tiny" | "hungry" | "playful" | "howl";

export interface StageDef {
  title: string;
  place: string;
  sky: string;
  glow: string;
  plats: Plat[];
  intro: string[];
  react: string[];
  moods: MaxineMood[];
  fightReact: string;
  outro: string[];
  outroReact: string;
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
    react: ["¿Una palita con patas? ¡Guau!", "¡Achís! El polvo me pica la nariz.", "¡Nadie me barre a MÍ!"],
    moods: ["curious", "scared", "angry"],
    fightReact: "¡Al mango, al mango!",
    outro: ["La escoba cae en astillas.", "El armario se abre. Seguí cavando."],
    outroReact: "¡Quedó hecha palitos! ¿Hay premio?",
  },
  gato: {
    title: "PASARELA ARCOÍRIS", place: "Azotea de lata",
    sky: "#1a0830", glow: "#ff8fb6",
    plats: [floor(), { x: 40, y: 460, w: 90, h: 14 }, { x: 160, y: 400, w: 90, h: 14 }, { x: 240, y: 340, w: 90, h: 14 }, { x: 70, y: 280, w: 140, h: 14 }],
    intro: ["Siete gatos. Un maullido.", "El arcoíris se tensa como cuerda.", "«¡Atacá cuando se lama!»"],
    react: ["Gatos… ¿amigos o merienda?", "Ese arcoíris me mareó la cola.", "Cuando se lama, ¡le muerdo el pompón!"],
    moods: ["curious", "playful", "brave"],
    fightReact: "¡Se lame! ¡Ahora!",
    outro: ["El gato se enrosca y ronronea.", "La pasarela se apaga. Bajá."],
    outroReact: "Ronronea. Creo que… ¿somos colegas?",
  },
  antisam: {
    title: "SALA DE COSTURA", place: "Taller de botones",
    sky: "#201008", glow: "#d44a6a",
    plats: [floor(), { x: 30, y: 455, w: 130, h: 14 }, { x: 200, y: 390, w: 130, h: 14 }, { x: 90, y: 310, w: 160, h: 14 }],
    intro: ["Hilo negro. Ojos de botón.", "Anti-Sam se hincha.", "«Cortá la costura.»"],
    react: ["Ese oso está al revés. ¡Feo!", "Se hincha… ¡como un pancito enojado!", "¡A los botones! ¡Ñam de costura!"],
    moods: ["scared", "curious", "angry"],
    fightReact: "¡Los botones, Maxine!",
    outro: ["Los botones ruedan por el piso.", "El taller se deshace. Seguí."],
    outroReact: "Botones para Javiera. Yo me quedo el hilo.",
  },
  caballo: {
    title: "CUARTO DE JUGUETES", place: "Caballito de madera",
    sky: "#2a1808", glow: "#c9842a",
    plats: [floor(), { x: 24, y: 480, w: 80, h: 14 }, { x: 140, y: 420, w: 80, h: 14 }, { x: 250, y: 360, w: 80, h: 14 }, { x: 80, y: 300, w: 200, h: 14 }],
    intro: ["El balancín cruje.", "El caballo abre los ojos.", "«¡Saltá las patas!»"],
    react: ["¿Me deja montar? ¿No?", "¡Tiene ojos! ¡No era de palo!", "¡Patas arriba, hocico abajo!"],
    moods: ["playful", "scared", "brave"],
    fightReact: "¡Salto las patas!",
    outro: ["El caballo se queda quieto.", "Un niño imaginario aplaude. Seguí."],
    outroReact: "Gracias por el paseo, caballito.",
  },
  fantasma: {
    title: "COCINA FANTASMA", place: "Vapor y platos",
    sky: "#0e2430", glow: "#7fd0ff",
    plats: [floor(), { x: 50, y: 450, w: 80, h: 14 }, { x: 220, y: 390, w: 80, h: 14 }, { x: 120, y: 320, w: 120, h: 14 }, { x: 40, y: 250, w: 80, h: 14 }],
    intro: ["El vapor toma forma.", "Un delantal vacío flota.", "«Esperá a que se vuelva sólido.»"],
    react: ["¡Fantasmita! ¿Trae pancito frío?", "Delantal vacío… ¿y el chef?", "Cuando se vea, ¡le ladro el alma!"],
    moods: ["curious", "scared", "howl"],
    fightReact: "¡Ya se ve! ¡Guau!",
    outro: ["El espectro se disuelve en harina.", "La cocina vuelve a oler a pan."],
    outroReact: "Huele a pan. Mi cola está feliz.",
  },
  cuchara: {
    title: "EL BOL GIGANTE", place: "Mesa de amasado",
    sky: "#241808", glow: "#d7d2c4",
    plats: [floor(), { x: 30, y: 470, w: 140, h: 14 }, { x: 190, y: 400, w: 140, h: 14 }, { x: 110, y: 320, w: 140, h: 14 }],
    intro: ["La cuchara de palo crece.", "La masa gira en remolino.", "«Pegale al cargar.»"],
    react: ["¡Esa cuchara es más grande que yo!", "Masa… ¿puedo probar un poquito?", "Cuando cargue, ¡mordisco al mango!"],
    moods: ["scared", "hungry", "brave"],
    fightReact: "¡Carga! ¡Ahora el mango!",
    outro: ["La cuchara vuelve a ser utensilio.", "Queda un bol de masa. Seguí."],
    outroReact: "Dejame lamer el bol. Porfa.",
  },
  hornito: {
    title: "BOCA DEL HORNO", place: "Ladrillos al rojo",
    sky: "#2a0a04", glow: "#ff5a2a",
    plats: [floor(), { x: 40, y: 460, w: 100, h: 14 }, { x: 210, y: 400, w: 110, h: 14 }, { x: 90, y: 330, w: 180, h: 14 }],
    intro: ["La puerta del horno se abre.", "Chef Hornito sonríe con fuego.", "«Atacá cuando se enfríe.»"],
    react: ["¡Caliente, caliente, caliente!", "Esa sonrisa… ¿me quiere hornear?", "Cuando se apague, ¡entro yo!"],
    moods: ["scared", "scared", "brave"],
    fightReact: "¡Se enfrió! ¡Adentro!",
    outro: ["El horno se apaga. Huele a baguette.", "Una bandeja baja. Seguí."],
    outroReact: "Baguette gratis. Día perfecto.",
  },
  refriRey: {
    title: "TRONO HELADO", place: "Cámara del rey",
    sky: "#0a2030", glow: "#7fd0ff",
    plats: [floor(), { x: 28, y: 470, w: 90, h: 14 }, { x: 240, y: 470, w: 90, h: 14 }, { x: 120, y: 390, w: 120, h: 14 }, { x: 50, y: 310, w: 90, h: 14 }, { x: 220, y: 310, w: 90, h: 14 }],
    intro: ["El hielo canta.", "El Refrigerador Rey se corona.", "«Rompe sus compresores.»"],
    react: ["¡Tengo la cola congelada!", "Un rey… ¿me da un yogur?", "¡A los compresores! ¡Crac!"],
    moods: ["scared", "hungry", "angry"],
    fightReact: "¡Rompe el hielo, rompe el hielo!",
    outro: ["El hielo se derrite en leche.", "El trono queda vacío. Seguí."],
    outroReact: "Leche. ¿Puedo lamer el piso? ¿No?",
  },
  alacena: {
    title: "DESPENSA CIEN AÑOS", place: "Estanterías vivas",
    sky: "#1a1008", glow: "#c9a06a",
    plats: [floor(), { x: 24, y: 480, w: 70, h: 14 }, { x: 140, y: 430, w: 80, h: 14 }, { x: 250, y: 380, w: 80, h: 14 }, { x: 70, y: 320, w: 90, h: 14 }, { x: 200, y: 260, w: 90, h: 14 }],
    intro: ["Las puertas crujen solas.", "Latas y recetarios caen.", "«Atacá al abrir.»"],
    react: ["Huele a mermelada vieja. Rico.", "¡Cuidado la lata! Esa no se come.", "Cuando abra, ¡hocico adentro!"],
    moods: ["hungry", "playful", "brave"],
    fightReact: "¡Abierta! ¡Ahora!",
    outro: ["La alacena se cierra en paz.", "Queda un frasco de mermelada. Seguí."],
    outroReact: "Mermelada para Javiera. Un lametón para mí.",
  },
  bigotesGrande: {
    title: "SALA DEL FEO", place: "El último horno",
    sky: "#140808", glow: "#ff3060",
    plats: [floor(), { x: 30, y: 470, w: 100, h: 14 }, { x: 230, y: 470, w: 100, h: 14 }, { x: 110, y: 390, w: 140, h: 14 }, { x: 40, y: 310, w: 90, h: 14 }, { x: 230, y: 310, w: 90, h: 14 }],
    intro: ["Parche. Pinchos. Dientes chuecos.", "Bigotes el Grande ladra tu nombre.", "«¡Rescatá a Javiera!»"],
    react: ["¡Él se llevó a Javiera!", "No me da miedo. Bueno… un poquito.", "¡Javiera, ya voy! ¡AÚÚÚ!"],
    moods: ["angry", "scared", "howl"],
    fightReact: "¡Al parche, al parche!",
    outro: ["El saco se abre. Javiera sale.", "Maxine ladra. La cocina es de ellas."],
    outroReact: "Javiera. Estoy aquí. Nunca más te dejo.",
  },
};

const FALLBACK: StageDef = {
  title: "ARENA ABIERTA", place: "Patio de harina",
  sky: "#1a1008", glow: "#ffb347",
  plats: [floor(), { x: 40, y: 460, w: 120, h: 14 }, { x: 200, y: 380, w: 120, h: 14 }],
  intro: ["Algo se acerca.", "El suelo tiembla.", "¡A pelear!"],
  react: ["Huelo peligro… y pan.", "¡La tierra me habla!", "¡Guau guau! ¡Vamos!"],
  moods: ["curious", "scared", "brave"],
  fightReact: "¡Ahora, Maxine!",
  outro: ["Cayó. El camino sigue."],
  outroReact: "Otra victoria. ¿Hay galleta?",
};

export function stageFor(type: BossType): StageDef {
  return STAGES[type] ?? FALLBACK;
}

export function moodPose(mood: MaxineMood): "idle" | "dig" | "hurt" | "win" {
  if (mood === "scared") return "hurt";
  if (mood === "angry" || mood === "hungry") return "dig";
  if (mood === "brave" || mood === "playful" || mood === "howl" || mood === "tiny") return "win";
  return "idle";
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
