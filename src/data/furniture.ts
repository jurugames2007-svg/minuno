export type FurnId =
  | "cama" | "mesa" | "silla" | "lampara" | "planta" | "alfombra" | "estante" | "horno"
  | "sofa" | "pecera" | "radio" | "cuadro" | "comedero" | "ventana" | "velas" | "reloj"
  | "piano" | "armario" | "tv" | "cuna" | "banera" | "perchero" | "escritorio" | "cortina"
  | "cabinaPan" | "cabinaHueso" | "cabinaSalto" | "cabinaTe";

export type FurnSlot = "floor" | "wall" | "rug";
export type FurnCat = "casa" | "deco" | "arcade";
export type ArcadeId = "amasar" | "hueso" | "salto" | "te";

export interface FurnDef {
  id: FurnId;
  name: string;
  w: number;
  h: number;
  price: number;
  wood: number;
  slot: FurnSlot;
  cat: FurnCat;
  game?: ArcadeId;
}

export const FURNS: FurnDef[] = [
  { id: "cama", name: "Cama", w: 3, h: 2, price: 80, wood: 6, slot: "floor", cat: "casa" },
  { id: "mesa", name: "Mesa", w: 2, h: 1, price: 45, wood: 4, slot: "floor", cat: "casa" },
  { id: "silla", name: "Silla", w: 1, h: 2, price: 28, wood: 2, slot: "floor", cat: "casa" },
  { id: "lampara", name: "Lámpara", w: 1, h: 2, price: 36, wood: 1, slot: "floor", cat: "casa" },
  { id: "planta", name: "Helecho", w: 1, h: 2, price: 24, wood: 0, slot: "floor", cat: "deco" },
  { id: "alfombra", name: "Alfombra", w: 3, h: 1, price: 32, wood: 0, slot: "rug", cat: "deco" },
  { id: "estante", name: "Estante", w: 2, h: 3, price: 70, wood: 8, slot: "floor", cat: "casa" },
  { id: "horno", name: "Horno", w: 2, h: 2, price: 110, wood: 5, slot: "floor", cat: "casa" },
  { id: "sofa", name: "Sofá", w: 3, h: 2, price: 95, wood: 7, slot: "floor", cat: "casa" },
  { id: "pecera", name: "Pecera", w: 2, h: 2, price: 88, wood: 2, slot: "floor", cat: "deco" },
  { id: "radio", name: "Radio", w: 1, h: 1, price: 54, wood: 1, slot: "floor", cat: "deco" },
  { id: "cuadro", name: "Retrato", w: 2, h: 2, slot: "wall", price: 40, wood: 1, cat: "deco" },
  { id: "comedero", name: "Comedero", w: 1, h: 1, price: 18, wood: 1, slot: "floor", cat: "deco" },
  { id: "ventana", name: "Ventana", w: 2, h: 2, slot: "wall", price: 48, wood: 3, cat: "deco" },
  { id: "velas", name: "Velas", w: 1, h: 1, price: 22, wood: 0, slot: "floor", cat: "deco" },
  { id: "reloj", name: "Reloj", w: 1, h: 2, slot: "wall", price: 60, wood: 2, cat: "deco" },
  { id: "piano", name: "Piano", w: 3, h: 2, price: 160, wood: 10, slot: "floor", cat: "casa" },
  { id: "armario", name: "Armario", w: 2, h: 3, price: 90, wood: 8, slot: "floor", cat: "casa" },
  { id: "tv", name: "Tele", w: 2, h: 2, price: 120, wood: 3, slot: "floor", cat: "deco" },
  { id: "cuna", name: "Cuna", w: 2, h: 2, price: 70, wood: 5, slot: "floor", cat: "casa" },
  { id: "banera", name: "Bañera", w: 3, h: 2, price: 130, wood: 4, slot: "floor", cat: "casa" },
  { id: "perchero", name: "Perchero", w: 1, h: 3, price: 34, wood: 3, slot: "floor", cat: "deco" },
  { id: "escritorio", name: "Escritorio", w: 3, h: 2, price: 85, wood: 6, slot: "floor", cat: "casa" },
  { id: "cortina", name: "Cortina", w: 2, h: 3, slot: "wall", price: 38, wood: 1, cat: "deco" },
  { id: "cabinaPan", name: "Arcade Amasar", w: 2, h: 3, price: 150, wood: 8, slot: "floor", cat: "arcade", game: "amasar" },
  { id: "cabinaHueso", name: "Arcade Hueso", w: 2, h: 3, price: 150, wood: 8, slot: "floor", cat: "arcade", game: "hueso" },
  { id: "cabinaSalto", name: "Arcade Salto", w: 2, h: 3, price: 160, wood: 8, slot: "floor", cat: "arcade", game: "salto" },
  { id: "cabinaTe", name: "Arcade Té", w: 2, h: 3, price: 150, wood: 8, slot: "floor", cat: "arcade", game: "te" },
];

export const HOTBAR: FurnId[] = [
  "cama", "mesa", "silla", "lampara", "planta", "alfombra", "sofa", "cabinaPan",
];

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

export type WallId = "crema" | "rosa" | "sage" | "cielo" | "lila" | "ladrillo" | "noche" | "rayas";
export type FloorId = "madera" | "damero" | "piedra" | "coral" | "musgo";

export interface WallDef { id: WallId; name: string; a: string; b: string; price: number }
export interface FloorDef { id: FloorId; name: string; a: string; b: string; price: number }

export const WALLS: WallDef[] = [
  { id: "crema", name: "Crema", a: "#f3ddb8", b: "#e6c894", price: 20 },
  { id: "rosa", name: "Rosa", a: "#f0c8c4", b: "#e0a8b0", price: 24 },
  { id: "sage", name: "Salvia", a: "#cddcba", b: "#a8c090", price: 24 },
  { id: "cielo", name: "Cielo", a: "#c8dce8", b: "#a8c4d8", price: 24 },
  { id: "lila", name: "Lila", a: "#d8c8e4", b: "#b8a0c8", price: 28 },
  { id: "ladrillo", name: "Ladrillo", a: "#c07050", b: "#a05038", price: 32 },
  { id: "noche", name: "Noche", a: "#3a3048", b: "#2a2438", price: 28 },
  { id: "rayas", name: "Rayas", a: "#fff3d6", b: "#e8c890", price: 26 },
];

export const FLOORINGS: FloorDef[] = [
  { id: "madera", name: "Roble", a: "#b07a3a", b: "#8a5420", price: 20 },
  { id: "damero", name: "Damero", a: "#fff3d6", b: "#5a3a20", price: 28 },
  { id: "piedra", name: "Piedra", a: "#8a8a90", b: "#5a5a62", price: 26 },
  { id: "coral", name: "Coral", a: "#d06070", b: "#a04050", price: 30 },
  { id: "musgo", name: "Musgo", a: "#6a8a48", b: "#4a6a30", price: 26 },
];

export const DEFAULT_WALLS: Record<0 | 1 | 2, WallId> = { 0: "crema", 1: "sage", 2: "rosa" };
export const DEFAULT_FLOORS: Record<0 | 1 | 2, FloorId> = { 0: "madera", 1: "madera", 2: "madera" };
