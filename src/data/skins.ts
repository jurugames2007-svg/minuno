export type SkinId =
  | "default"
  | "vampire"
  | "santa"
  | "lime"
  | "harness"
  | "bow"
  | "yuta"
  | "kissy"
  | "princess"
  | "yarnaby"
  | "pochacco"
  | "mahoraga"
  | "jockey"
  | "catto";

export interface Skin {
  id: SkinId;
  name: string;
  tag: string;
  price: number; // in collected bread-crumbs (meta currency)
  rarity: "Común" | "Raro" | "Épico" | "Legendario";
  blurb: string;
}

export const SKINS: Skin[] = [
  { id: "default", name: "Maxine", tag: "Pañuelito rojo", price: 0, rarity: "Común", blurb: "La clásica. Hambre infinita y cola inquieta." },
  { id: "bow", name: "Moño Rosa", tag: "Coqueta", price: 120, rarity: "Común", blurb: "Un lazo enorme para ocasiones muy hambrientas." },
  { id: "lime", name: "Polerita Lima", tag: "Sport", price: 180, rarity: "Común", blurb: "Verde neón para cavar más rápido que la vista." },
  { id: "harness", name: "Arnés Rosado", tag: "Paseo épico", price: 220, rarity: "Raro", blurb: "Correas acolchadas. Lista para la aventura." },
  { id: "santa", name: "Santa Claws", tag: "Navidad", price: 350, rarity: "Raro", blurb: "Gorro con pompón y barrita de pan de jengibre." },
  { id: "vampire", name: "Condesa Colmillo", tag: "Noche", price: 420, rarity: "Raro", blurb: "Capa negra, colmillos tiernos. Solo muerde pancitos." },
  { id: "princess", name: "Princesa Pan", tag: "Realeza", price: 500, rarity: "Épico", blurb: "Tiara dorada y vestido de merengue." },
  { id: "yuta", name: "Yuta Okkotsu", tag: "Hechicero", price: 700, rarity: "Épico", blurb: "Uniforme de Jujutsu y katana al hombro. Rika aprueba." },
  { id: "kissy", name: "Kissy Missy", tag: "Poppy", price: 850, rarity: "Épico", blurb: "Brazos largos rosados y sonrisa traviesa." },
  { id: "yarnaby", name: "Yarnaby", tag: "Arcoíris", price: 1200, rarity: "Legendario", blurb: "Melena de flecos arcoíris. La piel más rara de la panadería." },
  { id: "pochacco", name: "Pochacco", tag: "Sanrio", price: 550, rarity: "Épico", blurb: "Perrito blanco con orejas negras y polera magenta. Puro estilo." },
  { id: "mahoraga", name: "Mahoraga", tag: "Shikigami", price: 900, rarity: "Legendario", blurb: "La rueda de los ocho mangos gira sobre su cabeza cada pocos segundos." },
  { id: "jockey", name: "Jockey", tag: "Hípica", price: 480, rarity: "Raro", blurb: "Un jinete en miniatura monta a Maxine como si fuera pura sangre." },
  { id: "catto", name: "Gatito Café con Leche", tag: "Miau", price: 360, rarity: "Raro", blurb: "Orejas triangulares, cola larga y nariz rosa. Sigue siendo Maxine por dentro." },
];

export const RARITY_COLOR: Record<Skin["rarity"], string> = {
  "Común": "#cfe8a8",
  "Raro": "#7fd0ff",
  "Épico": "#d9a6ff",
  "Legendario": "#ffd27a",
};
