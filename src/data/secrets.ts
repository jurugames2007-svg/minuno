import type { SkinId } from "./skins";
import type { ToolId } from "../art/Plushie";

export type SecretKind = "skin" | "tool";

export interface FieldSecret {
  id: string;
  kind: SecretKind;
  skin?: SkinId;
  tool?: ToolId;
  title: string;
  blurb: string;
  hint: string;
}

export const FIELD_SECRETS: FieldSecret[] = [
  { id: "lodo", kind: "skin", skin: "lodo", title: "Maxine Lodosa", blurb: "Barro hasta las cejas. El campo la adoptó.", hint: "Revolcá una llanta hundida." },
  { id: "exploradora", kind: "skin", skin: "exploradora", title: "Exploradora", blurb: "Sombrero de paja y mochila de migas.", hint: "Subí a la pila de llantas del cerro." },
  { id: "llanta", kind: "skin", skin: "llanta", title: "Neumático", blurb: "Una llanta le queda de collar. Corre como kart.", hint: "Revisá el taller de gomas al este." },
  { id: "hada", kind: "skin", skin: "hada", title: "Hada del trigal", blurb: "Alas de harina. Aparece solo si husmeás el claro.", hint: "Hay un claro entre dos árboles." },
  { id: "hueso", kind: "tool", tool: "hueso", title: "Hueso enterrado", blurb: "Alcanza dos tiles. Sabe a patio.", hint: "Cavá bajo la cueva del medio." },
  { id: "pico", kind: "tool", tool: "pico", title: "Pico oxidado", blurb: "Rompe piedra de un golpe. Huele a óxido dulce.", hint: "Un cofre bajo piedra, lejos al este." },
  { id: "casco", kind: "tool", tool: "casco", title: "Casco de obra", blurb: "Te salva de un golpe. Amarillo de yema.", hint: "Hay un casco en una gruta honda." },
];

export const SECRET_SKIN_IDS: SkinId[] = FIELD_SECRETS.filter((s) => s.skin).map((s) => s.skin as SkinId);
export const SECRET_TOOL_IDS: ToolId[] = FIELD_SECRETS.filter((s) => s.tool).map((s) => s.tool as ToolId);

export function secretById(id: string): FieldSecret | undefined {
  return FIELD_SECRETS.find((s) => s.id === id);
}
