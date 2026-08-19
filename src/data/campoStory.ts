import type { AreaId } from "./areas";

export type QuestId = "cesta" | "cinta" | "tornillos" | "huesos" | "hada" | "casco";
export type QuestState = "idle" | "active" | "done";

export interface CampoNpc {
  id: string;
  name: string;
  area: AreaId;
  col: number;
  kind: "lina" | "tico" | "nube" | "hada" | "don" | "maria";
  idle: string[];
  quest?: QuestId;
}

export interface QuestDef {
  id: QuestId;
  title: string;
  giver: string;
  need: number;
  hint: string;
  done: string;
  crumbs: number;
}

export const CAMPO_STORY = [
  "Alguien se llevó la canasta del domingo.",
  "Los vecinos del campo vieron una sombra con bigotes.",
  "Recorre A-1 a F-1, salta las plataformas y pregunta con cariño.",
];

export const QUESTS: Record<QuestId, QuestDef> = {
  cesta: { id: "cesta", title: "La canasta perdida", giver: "Lina", need: 3, hint: "Reúne 3 pistas de la canasta.", done: "¡La canasta volvió a casa!", crumbs: 40 },
  cinta: { id: "cinta", title: "Cinta rosa", giver: "Lina", need: 1, hint: "La cinta está en el Taller B-1.", done: "Lina te abraza con la cinta puesta.", crumbs: 18 },
  tornillos: { id: "tornillos", title: "Tres tornillos", giver: "Tico", need: 3, hint: "Hay tornillos en B-1 y F-1.", done: "Tico te dedica un pitido feliz.", crumbs: 22 },
  huesos: { id: "huesos", title: "Huesos de la cueva", giver: "Nube", need: 2, hint: "Cava en C-1, bajo las plataformas.", done: "Nube esconde los huesos otra vez, jugando.", crumbs: 20 },
  hada: { id: "hada", title: "Polvo de trigo", giver: "Hada", need: 1, hint: "Saluda a la Hada en D-1.", done: "Un brillo te sigue un rato.", crumbs: 16 },
  casco: { id: "casco", title: "Casco olvidado", giver: "Don Llanta", need: 1, hint: "Baja a la Gruta E-1.", done: "Don asiente, orgulloso.", crumbs: 24 },
};

export const NPCS: CampoNpc[] = [
  {
    id: "lina", name: "Lina", area: "A1", col: 12, kind: "lina", quest: "cinta",
    idle: [
      "Maxine, mi cinta rosa se fue con el viento… ¿me ayudás?",
      "Si la encontrás, te doy un besito en la tesita.",
      "El prado es más lindo cuando vos corrés.",
    ],
  },
  {
    id: "tico", name: "Tico", area: "B1", col: 18, kind: "tico", quest: "tornillos",
    idle: [
      "¡Pío! Se me cayeron tres tornillos, jefa.",
      "Sin tornillos el kart no arranca. Te quiero igual.",
      "Olisqueá las llantas. Ahí suelen esconderse.",
    ],
  },
  {
    id: "nube", name: "Nube", area: "C1", col: 20, kind: "nube", quest: "huesos",
    idle: [
      "Shh… la cueva guarda huesos dulces.",
      "Si cavás dos, te presto mi bufanda.",
      "No tengas miedo. Yo ladraría por vos.",
    ],
  },
  {
    id: "hada", name: "Hada", area: "D1", col: 26, kind: "hada", quest: "hada",
    idle: [
      "Una schnauzer con moño rojo. Qué milagro.",
      "Tocame y te dejo polvo de trigo en las orejas.",
      "El claro te espera siempre, Maxine.",
    ],
  },
  {
    id: "don", name: "Don Llanta", area: "F1", col: 14, kind: "don", quest: "casco",
    idle: [
      "En la gruta quedó mi casco de obra, hijita.",
      "Cuidado con los murciélagos. Son groseros, no malos.",
      "Si lo traés, te enseño a derrapar con estilo.",
    ],
  },
  {
    id: "mariaC", name: "María", area: "A1", col: 30, kind: "maria", quest: "cesta",
    idle: [
      "Alguien se llevó la canasta del té, mi vida.",
      "Hay pistas en el Taller, el Claro y el Este.",
      "Volvé con migas y te hago pan con mantequilla.",
    ],
  },
];

export interface Pickup {
  id: string;
  area: AreaId;
  col: number;
  rowOff: number;
  quest: QuestId;
  label: string;
}

export const PICKUPS: Pickup[] = [
  { id: "cinta1", area: "B1", col: 40, rowOff: -2, quest: "cinta", label: "Cinta rosa" },
  { id: "tor1", area: "B1", col: 28, rowOff: -1, quest: "tornillos", label: "Tornillo" },
  { id: "tor2", area: "B1", col: 48, rowOff: -3, quest: "tornillos", label: "Tornillo" },
  { id: "tor3", area: "F1", col: 36, rowOff: -2, quest: "tornillos", label: "Tornillo" },
  { id: "h1", area: "C1", col: 24, rowOff: 2, quest: "huesos", label: "Hueso" },
  { id: "h2", area: "C1", col: 38, rowOff: 1, quest: "huesos", label: "Hueso" },
  { id: "hd1", area: "D1", col: 26, rowOff: -1, quest: "hada", label: "Polvo" },
  { id: "cas1", area: "E1", col: 32, rowOff: 0, quest: "casco", label: "Casco" },
  { id: "pista1", area: "B1", col: 10, rowOff: -1, quest: "cesta", label: "Pista" },
  { id: "pista2", area: "D1", col: 14, rowOff: -2, quest: "cesta", label: "Pista" },
  { id: "pista3", area: "F1", col: 44, rowOff: -1, quest: "cesta", label: "Pista" },
];
