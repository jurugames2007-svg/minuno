export type FurnId =
  | "cama" | "mesa" | "silla" | "lampara" | "planta" | "alfombra" | "estante" | "horno"
  | "sofa" | "pecera" | "radio" | "cuadro" | "comedero" | "ventana" | "velas" | "reloj";

export type FurnSlot = "floor" | "wall" | "rug";

export interface FurnDef {
  id: FurnId;
  name: string;
  w: number;
  h: number;
  price: number;
  wood: number;
  slot: FurnSlot;
  hotbar: boolean;
}

export const FURNS: FurnDef[] = [
  { id: "cama", name: "Cama", w: 3, h: 2, price: 80, wood: 6, slot: "floor", hotbar: true },
  { id: "mesa", name: "Mesa", w: 2, h: 1, price: 45, wood: 4, slot: "floor", hotbar: true },
  { id: "silla", name: "Silla", w: 1, h: 2, price: 28, wood: 2, slot: "floor", hotbar: true },
  { id: "lampara", name: "Lámpara", w: 1, h: 2, price: 36, wood: 1, slot: "floor", hotbar: true },
  { id: "planta", name: "Helecho", w: 1, h: 2, price: 24, wood: 0, slot: "floor", hotbar: true },
  { id: "alfombra", name: "Alfombra", w: 3, h: 1, price: 32, wood: 0, slot: "rug", hotbar: true },
  { id: "estante", name: "Estante", w: 2, h: 3, price: 70, wood: 8, slot: "floor", hotbar: true },
  { id: "horno", name: "Horno", w: 2, h: 2, price: 110, wood: 5, slot: "floor", hotbar: true },
  { id: "sofa", name: "Sofá", w: 3, h: 2, price: 95, wood: 7, slot: "floor", hotbar: false },
  { id: "pecera", name: "Pecera", w: 2, h: 2, price: 88, wood: 2, slot: "floor", hotbar: false },
  { id: "radio", name: "Radio", w: 1, h: 1, price: 54, wood: 1, slot: "floor", hotbar: false },
  { id: "cuadro", name: "Retrato", w: 2, h: 2, slot: "wall", price: 40, wood: 1, hotbar: false },
  { id: "comedero", name: "Comedero", w: 1, h: 1, price: 18, wood: 1, slot: "floor", hotbar: false },
  { id: "ventana", name: "Ventana", w: 2, h: 2, slot: "wall", price: 48, wood: 3, hotbar: false },
  { id: "velas", name: "Velas", w: 1, h: 1, price: 22, wood: 0, slot: "floor", hotbar: false },
  { id: "reloj", name: "Reloj", w: 1, h: 2, slot: "wall", price: 60, wood: 2, hotbar: false },
];

export const HOTBAR: FurnId[] = FURNS.filter((f) => f.hotbar).map((f) => f.id);

export function furnById(id: FurnId): FurnDef {
  return FURNS.find((f) => f.id === id) ?? FURNS[0];
}

export interface PlacedFurn {
  uid: string;
  id: FurnId;
  gx: number;
  floor: 0 | 1 | 2;
  rot: 0 | 1;
}

export function newUid(): string {
  return `f${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export const START_STOCK: Partial<Record<FurnId, number>> = {
  cama: 1, mesa: 1, silla: 2, lampara: 1, planta: 1, alfombra: 1, estante: 1, horno: 1,
};
