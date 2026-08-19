export type AreaId = "A1" | "B1" | "C1" | "D1" | "E1" | "F1";

export interface AreaDef {
  id: AreaId;
  name: string;
  tag: string;
  sky: string;
  dirt: string;
  grass: string;
  left?: AreaId;
  right?: AreaId;
  up?: AreaId;
  down?: AreaId;
  hint: string;
}

export const AREAS: Record<AreaId, AreaDef> = {
  A1: { id: "A1", name: "Prado", tag: "A-1", sky: "#7ec8ff", dirt: "#8a5420", grass: "#4a9a2a", right: "B1", down: "C1", hint: "Prado abierto. Lina y María te esperan." },
  B1: { id: "B1", name: "Taller", tag: "B-1", sky: "#6a7a88", dirt: "#5a4a3a", grass: "#3a3a3a", left: "A1", right: "F1", hint: "Neumáticos y tornillos. Huele a goma." },
  C1: { id: "C1", name: "Cueva", tag: "C-1", sky: "#1a1420", dirt: "#3a2a20", grass: "#2a2018", left: "A1", right: "D1", up: "A1", hint: "Oscuro. Huesos y eco." },
  D1: { id: "D1", name: "Claro", tag: "D-1", sky: "#b8e0a0", dirt: "#6a4a20", grass: "#3a8a2a", left: "C1", right: "E1", hint: "Un hada vive entre árboles." },
  E1: { id: "E1", name: "Gruta", tag: "E-1", sky: "#2a2030", dirt: "#4a3a30", grass: "#2a2018", left: "D1", up: "F1", hint: "Piedra, murciélagos y un casco." },
  F1: { id: "F1", name: "Este", tag: "F-1", sky: "#88b8d8", dirt: "#7a4a18", grass: "#3a7a1a", left: "B1", down: "E1", hint: "El taller más lejano. Don Llanta." },
};

export const AREA_LIST: AreaId[] = ["A1", "B1", "C1", "D1", "E1", "F1"];
