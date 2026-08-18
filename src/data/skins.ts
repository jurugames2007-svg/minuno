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
  | "catto"
  // V2 Jujutsu
  | "gojo"
  | "nobara"
  | "megumi"
  | "sukuna"
  // V2 Monster High
  | "draculaura"
  | "frankie"
  // V2 Princess
  | "schnauzarella"
  | "ariel"
  // V2 Heroes
  | "captain"
  | "bat"
  // V2 Poppy
  | "huggy"
  | "catnap"
  // V2 Stranger
  | "eleven"
  // V2 BTS
  | "rm"
  // V2 Minecraft
  | "steve"
  | "creeper"
  // V2 Star Wars
  | "darth"
  // V2 Disfraces
  | "unicornio"
  | "pirata"
  | "astronauta"
  | "zombie"
  | "ninja"
  | "mago"
  | "payaso"
  | "clawdeen"
  | "cleo"
  | "ghoulia"
  | "bella"
  | "jasmine"
  | "tiana"
  | "widow"
  | "spider"
  | "wonder"
  | "dogday"
  | "craftycorn"
  | "alex"
  | "ender";

export interface Skin {
  id: SkinId;
  name: string;
  tag: string;
  price: number;
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
  // V2 Jujutsu
  { id: "gojo", name: "Gojo-schnauzer", tag: "Jujutsu · Infinito", price: 850, rarity: "Legendario", blurb: "Parche negro y pelo blanco plateado. El más fuerte del salón." },
  { id: "nobara", name: "Nobara Kugisaki", tag: "Jujutsu · Clavos", price: 780, rarity: "Épico", blurb: "Delantal con clavos de dulce y martillo. ¡Resonancia!" },
  { id: "megumi", name: "Megumi Schnauzenji", tag: "Jujutsu · Sombras", price: 800, rarity: "Épico", blurb: "Sombrías técnicas de diez sombras. Lobo divino al hombro." },
  { id: "sukuna", name: "Sukuna Schnauzer", tag: "Jujutsu · Rey", price: 1300, rarity: "Legendario", blurb: "Cuatro marcas rojas, ojos dorados y sonrisa maldita." },
  // V2 Monster High
  { id: "draculaura", name: "Draculaura Schnauzer", tag: "Monster High", price: 650, rarity: "Épico", blurb: "Rosado vampiro, colmillitos y murciélago en lomo. 1600 años y tierna." },
  { id: "frankie", name: "Frankie Stein", tag: "Monster High", price: 620, rarity: "Épico", blurb: "Remaches, tornillos en cuello y costuras. ¡Viva la ciencia!" },
  // V2 Princess
  { id: "schnauzarella", name: "Schnauzarella", tag: "Princesa", price: 540, rarity: "Épico", blurb: "Vestido azul celeste, lazo y ratoncitos ayudantes." },
  { id: "ariel", name: "Ariel Schnauzerina", tag: "Princesa · Mar", price: 700, rarity: "Épico", blurb: "Cola de sirena brillante y concha en pecho. Bajo el mar." },
  // V2 Heroes
  { id: "captain", name: "Captain Schnauzerica", tag: "Super", price: 680, rarity: "Épico", blurb: "Traje rojo-azul-blanco y escudo de vibranio panadero." },
  { id: "bat", name: "Bat-schnauzer", tag: "Super", price: 720, rarity: "Épico", blurb: "Capa negra, máscara y emblema murciélago. ¡Justicia nocturna!" },
  // V2 Poppy
  { id: "huggy", name: "Huggy Schnauzery", tag: "Poppy · Azul", price: 880, rarity: "Legendario", blurb: "Pelaje azul eléctrico y sonrisa permanente. Abrazo mortal." },
  { id: "catnap", name: "CatNap Schnauzer", tag: "Poppy · Sueño", price: 900, rarity: "Legendario", blurb: "Púrpura con collar de luna, ojos cerrados y gas somnífero." },
  // V2 Stranger
  { id: "eleven", name: "Eleven Schnauzer", tag: "Stranger", price: 750, rarity: "Épico", blurb: "Vestido rosa, nariz con sangre y caja de waffles." },
  // V2 BTS
  { id: "rm", name: "RM Schnauzer", tag: "BTS · Líder", price: 600, rarity: "Raro", blurb: "Gorro, chaqueta cuero y libro de líder." },
  // V2 Minecraft
  { id: "steve", name: "Steve Schnauzer", tag: "Minecraft", price: 500, rarity: "Raro", blurb: "Camisa azul, pantalón pardo y pico de hierro en mano." },
  { id: "creeper", name: "Creeper-schnauzer", tag: "Minecraft", price: 580, rarity: "Raro", blurb: "Pelaje verde pixelado y cara de 'sss...' Explosivo." },
  { id: "darth", name: "Darth Schnauzer", tag: "Star Wars · Sith", price: 850, rarity: "Legendario", blurb: "Casco negro brillante, capa negra y ojos rojos intensos. El lado oscuro de la panadería." },
  // V2 Disfraces
  { id: "unicornio", name: "Schnauzer Unicornio", tag: "Fantasía", price: 620, rarity: "Épico", blurb: "Cuerno arcoíris y melena multicolor brillante." },
  { id: "pirata", name: "Schnauzer Pirata", tag: "Ahoy!", price: 540, rarity: "Raro", blurb: "Parche, pañuelo rojo y garfio crujiente." },
  { id: "astronauta", name: "Schnauzer Astronauta", tag: "Espacio", price: 800, rarity: "Épico", blurb: "Traje blanco y casco transparente. ¡Al infinito!" },
  { id: "zombie", name: "Schnauzer Zombie", tag: "Terror", price: 420, rarity: "Raro", blurb: "Verde, heridas y ropa rota. Cerebro... ¿pan?" },
  { id: "ninja", name: "Schnauzer Ninja", tag: "Sigilo", price: 700, rarity: "Épico", blurb: "Máscara negra, espada y estrellas de masa." },
  { id: "mago", name: "Schnauzer Mago", tag: "Hechicero", price: 680, rarity: "Épico", blurb: "Sombrero puntiagudo, varita y libro de pan-conjuros." },
  { id: "payaso", name: "Schnauzer Payaso", tag: "Circo", price: 460, rarity: "Raro", blurb: "Peluca naranja, nariz roja y sonrisa pintada." },
  { id: "clawdeen", name: "Clawdeen Wolf", tag: "Monster High", price: 640, rarity: "Épico", blurb: "Peluca morada con mechas, orejas lobo y luna." },
  { id: "cleo", name: "Cleo de Nile", tag: "Monster High", price: 660, rarity: "Épico", blurb: "Vendajes dorados y tiara faraona." },
  { id: "ghoulia", name: "Ghoulia Yelps", tag: "Monster High", price: 620, rarity: "Épico", blurb: "Piel pálida azulada, gafas y gorrito cerebro." },
  { id: "bella", name: "Bella Schnauzer", tag: "Princesa", price: 560, rarity: "Épico", blurb: "Vestido amarillo satinado con rosa encantada." },
  { id: "jasmine", name: "Jasmine Schnauzer", tag: "Princesa", price: 580, rarity: "Épico", blurb: "Top turquesa y pantalón harem con joya." },
  { id: "tiana", name: "Tiana Schnauzer", tag: "Princesa", price: 600, rarity: "Épico", blurb: "Vestido verde con corona de lirios." },
  { id: "widow", name: "Widow Schnauzer", tag: "Super", price: 700, rarity: "Épico", blurb: "Traje negro ajustado con reloj rojo." },
  { id: "spider", name: "Spider-schnauzer", tag: "Super", price: 720, rarity: "Épico", blurb: "Traje rojo-azul con telaraña en pecho." },
  { id: "wonder", name: "Wonder Schnauzer", tag: "Super", price: 740, rarity: "Épico", blurb: "Tiara dorada, lazo y brazaletes." },
  { id: "dogday", name: "DogDay Schnauzer", tag: "Poppy", price: 860, rarity: "Épico", blurb: "Naranja radiante, collar dorado y sonrisa." },
  { id: "craftycorn", name: "CraftyCorn Schnauzer", tag: "Poppy", price: 880, rarity: "Épico", blurb: "Azul cielo, cuerno unicornio y arcoíris." },
  { id: "alex", name: "Alex Schnauzer", tag: "Minecraft", price: 520, rarity: "Raro", blurb: "Camisa naranja, pelo naranja y brazalete." },
  { id: "ender", name: "Ender-schnauzer", tag: "Minecraft", price: 600, rarity: "Raro", blurb: "Negro con ojos violeta y teletransporte." },
];


export const RARITY_COLOR: Record<Skin["rarity"], string> = {
  "Común": "#cfe8a8",
  "Raro": "#7fd0ff",
  "Épico": "#d9a6ff",
  "Legendario": "#ffd27a",
};
