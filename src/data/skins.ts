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
  | "gojo"
  | "nobara"
  | "megumi"
  | "sukuna"
  | "yuji"
  | "draculaura"
  | "frankie"
  | "schnauzarella"
  | "ariel"
  | "captain"
  | "bat"
  | "huggy"
  | "catnap"
  | "eleven"
  | "rm"
  | "steve"
  | "creeper"
  | "darth"
  | "padme"
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
  | "ender"
  | "boxer"
  | "laufey"
  | "penguin"
  | "bigotes"
  | "eevee"
  | "kira"
  | "spooky"
  | "matrona"
  | "subzero"
  | "barbie"
  | "bebe"
  | "abuela"
  | "sabio"
  | "freddy"
  | "foxy"
  | "bonnie"
  | "chica"
  | "hada"
  | "panadero"
  | "croissant";

export type SkinRarity = "Común" | "Raro" | "Épico" | "Legendario" | "Feo";
export type SkinCategory =
  | "Clásico"
  | "Jujutsu"
  | "Monster High"
  | "Princesa"
  | "Héroes"
  | "Poppy"
  | "Star Wars"
  | "Minecraft"
  | "Disfraz"
  | "FNAF"
  | "Pokémon"
  | "Familia"
  | "Feo";

export type SkinUnlock = "shop" | "bigotes";

export interface Skin {
  id: SkinId;
  name: string;
  tag: string;
  price: number;
  rarity: SkinRarity;
  category: SkinCategory;
  blurb: string;
  unlock: SkinUnlock;
}

export const SKINS: Skin[] = [
  { id: "default", name: "Maxine", tag: "Pañuelito rojo", price: 0, rarity: "Común", category: "Clásico", unlock: "shop", blurb: "La clásica. Hambre infinita y cola inquieta." },
  { id: "bow", name: "Moño Rosa", tag: "Coqueta", price: 120, rarity: "Común", category: "Clásico", unlock: "shop", blurb: "Un lazo enorme para ocasiones muy hambrientas." },
  { id: "lime", name: "Polerita Lima", tag: "Sport", price: 180, rarity: "Común", category: "Clásico", unlock: "shop", blurb: "Verde neón para cavar más rápido que la vista." },
  { id: "harness", name: "Arnés Rosado", tag: "Paseo épico", price: 220, rarity: "Raro", category: "Clásico", unlock: "shop", blurb: "Correas acolchadas. Lista para la aventura." },
  { id: "santa", name: "Santa Claws", tag: "Navidad", price: 350, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Gorro con pompón y barba de nata montada." },
  { id: "vampire", name: "Condesa Colmillo", tag: "Noche", price: 420, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Capa negra, colmillos tiernos. Solo muerde pancitos." },
  { id: "princess", name: "Princesa Pan", tag: "Realeza", price: 500, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Tiara dorada y vestido de merengue." },
  { id: "yuta", name: "Yuta Okkotsu", tag: "Hechicero", price: 700, rarity: "Épico", category: "Jujutsu", unlock: "shop", blurb: "Uniforme blanco, pelo negro revuelto y katana al hombro. Rika aprueba." },
  { id: "yuji", name: "Yuji Itadori", tag: "Recipiente", price: 820, rarity: "Épico", category: "Jujutsu", unlock: "shop", blurb: "Pelo rosa puntiagudo, hoodie rojo y chaqueta de Tokio Jujutsu. ¡Divergente puño!" },
  { id: "kissy", name: "Kissy Missy", tag: "Poppy", price: 850, rarity: "Épico", category: "Poppy", unlock: "shop", blurb: "Brazos largos rosados, lazo azul y sonrisa traviesa." },
  { id: "yarnaby", name: "Yarnaby", tag: "Arcoíris", price: 1200, rarity: "Legendario", category: "Poppy", unlock: "shop", blurb: "Melena de lana arcoíris. La piel más rara de la panadería." },
  { id: "pochacco", name: "Pochacco", tag: "Sanrio", price: 550, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Perrito blanco con orejas negras y polera magenta." },
  { id: "mahoraga", name: "Mahoraga", tag: "Shikigami", price: 900, rarity: "Legendario", category: "Jujutsu", unlock: "shop", blurb: "La rueda de los ocho mangos gira sobre su cabeza." },
  { id: "jockey", name: "Jockey", tag: "Hípica", price: 480, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Un jinete en miniatura monta a Maxine como si fuera pura sangre." },
  { id: "catto", name: "Gatito Café con Leche", tag: "Miau", price: 360, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Orejas triangulares, cola larga y nariz rosa." },
  { id: "gojo", name: "Satoru Gojo", tag: "Infinito", price: 850, rarity: "Legendario", category: "Jujutsu", unlock: "shop", blurb: "Pelo blanco, venda negra y uniforme de hechicero. El más fuerte del salón." },
  { id: "nobara", name: "Nobara Kugisaki", tag: "Clavos", price: 780, rarity: "Épico", category: "Jujutsu", unlock: "shop", blurb: "Bob castaño, abrigo marrón y martillo de resonancia." },
  { id: "megumi", name: "Megumi Fushiguro", tag: "Sombras", price: 800, rarity: "Épico", category: "Jujutsu", unlock: "shop", blurb: "Flequillo negro, uniforme oscuro y lobo divino al hombro." },
  { id: "sukuna", name: "Ryomen Sukuna", tag: "Rey", price: 1300, rarity: "Legendario", category: "Jujutsu", unlock: "shop", blurb: "Marcas negras, kimono abierto y sonrisa maldita." },
  { id: "draculaura", name: "Draculaura", tag: "Monster High", price: 650, rarity: "Épico", category: "Monster High", unlock: "shop", blurb: "Coletas negras, vestido rosa y murciélago en el lomo." },
  { id: "frankie", name: "Frankie Stein", tag: "Monster High", price: 620, rarity: "Épico", category: "Monster High", unlock: "shop", blurb: "Mechas blancas y negras, tornillos en el cuello y costuras." },
  { id: "schnauzarella", name: "Cenicienta", tag: "Princesa", price: 540, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Vestido azul celeste, lazo y zapatito de cristal." },
  { id: "ariel", name: "Ariel", tag: "Mar", price: 700, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Pelo rojo, cola de sirena y concha perlada." },
  { id: "captain", name: "Capitana América", tag: "Super", price: 680, rarity: "Épico", category: "Héroes", unlock: "shop", blurb: "Traje rojo-azul-blanco y escudo estrellado." },
  { id: "bat", name: "Bat-schnauzer", tag: "Super", price: 720, rarity: "Épico", category: "Héroes", unlock: "shop", blurb: "Capa, máscara de orejas y emblema de murciélago." },
  { id: "huggy", name: "Huggy Wuggy", tag: "Poppy", price: 880, rarity: "Legendario", category: "Poppy", unlock: "shop", blurb: "Pelaje azul, boca cremallera y brazos larguísimos." },
  { id: "catnap", name: "CatNap", tag: "Sueño", price: 900, rarity: "Legendario", category: "Poppy", unlock: "shop", blurb: "Púrpura, collar de luna y ojos soñolientos." },
  { id: "eleven", name: "Eleven", tag: "Hawkins", price: 750, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Pelo corto castaño, vestido rosa y waffle Eggo." },
  { id: "rm", name: "RM", tag: "BTS", price: 600, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Gorro de cubo, chaqueta de cuero y libreta de líder." },
  { id: "steve", name: "Steve", tag: "Minecraft", price: 500, rarity: "Raro", category: "Minecraft", unlock: "shop", blurb: "Pelo castaño pixel, camisa cyan y pico de hierro." },
  { id: "creeper", name: "Creeper", tag: "Minecraft", price: 580, rarity: "Raro", category: "Minecraft", unlock: "shop", blurb: "Verde pixelado y hocico de sss… ¿pan?" },
  { id: "darth", name: "Darth Vader", tag: "Sith", price: 950, rarity: "Legendario", category: "Star Wars", unlock: "shop", blurb: "Casco de tres aletas, capa, panel de pecho y sable rojo. El lado oscuro del hojaldre." },
  { id: "padme", name: "Padmé Amidala", tag: "Senado", price: 880, rarity: "Legendario", category: "Star Wars", unlock: "shop", blurb: "Moños de Naboo, vestido burdeos y joyas doradas. Reina de la masa madre." },
  { id: "unicornio", name: "Unicornio", tag: "Fantasía", price: 620, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Cuerno nacarado y melena arcoíris." },
  { id: "pirata", name: "Pirata", tag: "Ahoy", price: 540, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Pañuelo rojo, parche y garfio de hojaldre." },
  { id: "astronauta", name: "Astronauta", tag: "Espacio", price: 800, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Traje blanco y visor dorado. Al infinito y al horno." },
  { id: "zombie", name: "Zombie", tag: "Terror", price: 420, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Piel verdosa, ropa rota. ¿Cerebro… o pan?" },
  { id: "ninja", name: "Ninja", tag: "Sigilo", price: 700, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Máscara, shurikens de masa y katana corta." },
  { id: "mago", name: "Mago", tag: "Hechizos", price: 680, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Sombrero puntiagudo, túnica y varita de baguette." },
  { id: "payaso", name: "Payaso", tag: "Circo", price: 460, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Peluca naranja, nariz roja y lunares." },
  { id: "clawdeen", name: "Clawdeen Wolf", tag: "Monster High", price: 640, rarity: "Épico", category: "Monster High", unlock: "shop", blurb: "Melena morada con mechas, orejas de lobo y luna." },
  { id: "cleo", name: "Cleo de Nile", tag: "Monster High", price: 660, rarity: "Épico", category: "Monster High", unlock: "shop", blurb: "Pelo negro con mecha dorada y tiara de faraona." },
  { id: "ghoulia", name: "Ghoulia Yelps", tag: "Monster High", price: 620, rarity: "Épico", category: "Monster High", unlock: "shop", blurb: "Coleta roja, gafas y gorrito de cerebro." },
  { id: "bella", name: "Bella", tag: "Princesa", price: 560, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Moño castaño, vestido amarillo y rosa encantada." },
  { id: "jasmine", name: "Jasmín", tag: "Princesa", price: 580, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Coleta alta, top turquesa y joya de frente." },
  { id: "tiana", name: "Tiana", tag: "Princesa", price: 600, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Moño con tiara de lirios y vestido verde de gala." },
  { id: "widow", name: "Viuda Negra", tag: "Super", price: 700, rarity: "Épico", category: "Héroes", unlock: "shop", blurb: "Traje táctico, reloj de hora roja y coleta." },
  { id: "spider", name: "Spider-Max", tag: "Super", price: 720, rarity: "Épico", category: "Héroes", unlock: "shop", blurb: "Máscara de lentes blancos y telaraña en el pecho." },
  { id: "wonder", name: "Wonder Woman", tag: "Super", price: 740, rarity: "Épico", category: "Héroes", unlock: "shop", blurb: "Tiara con estrella, lazo dorado y brazaletes." },
  { id: "dogday", name: "DogDay", tag: "Poppy", price: 860, rarity: "Épico", category: "Poppy", unlock: "shop", blurb: "Naranja soleado, collar dorado y sonrisa de sol." },
  { id: "craftycorn", name: "CraftyCorn", tag: "Poppy", price: 880, rarity: "Épico", category: "Poppy", unlock: "shop", blurb: "Azul cielo, cuerno pastel y mancha arcoíris." },
  { id: "alex", name: "Alex", tag: "Minecraft", price: 520, rarity: "Raro", category: "Minecraft", unlock: "shop", blurb: "Pelo naranja pixel y camisa de exploradora." },
  { id: "ender", name: "Enderman", tag: "Minecraft", price: 600, rarity: "Raro", category: "Minecraft", unlock: "shop", blurb: "Alto, oscuro y con ojos violeta. No lo mires." },
  { id: "boxer", name: "Boxeadora", tag: "Ring", price: 640, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Guantes rojos, cinta en la frente y cinturón de campeona." },
  { id: "laufey", name: "Laufey", tag: "Jazz", price: 760, rarity: "Épico", category: "Disfraz", unlock: "shop", blurb: "Flequillo de cortina, vestido vintage y micrófono de oro. Baller de la panadería." },
  { id: "penguin", name: "Pingüino", tag: "Ártico", price: 520, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Esmoquin natural, pico naranja y aletas para deslizarse." },
  { id: "bigotes", name: "Bigotes el Feo", tag: "Solo al derrotarlo", price: 0, rarity: "Feo", category: "Feo", unlock: "bigotes", blurb: "Parche, collar de pinchos y dientes chuecos. Se pone la piel del villano… si sobrevive a él." },
  { id: "eevee", name: "Eevee", tag: "Pokémon", price: 640, rarity: "Épico", category: "Pokémon", unlock: "shop", blurb: "Melena crema, collar de pelusa y orejitas marrones. Evoluciona… en pancito." },
  { id: "kira", name: "Kira", tag: "Pastora", price: 580, rarity: "Raro", category: "Familia", unlock: "shop", blurb: "Pastora alemana: silla negra, capa fuego y mirada de guardiana." },
  { id: "spooky", name: "Spooky", tag: "Gato negro", price: 420, rarity: "Raro", category: "Disfraz", unlock: "shop", blurb: "Gato negro de medianoche, ojos amarillos y cola de bruja." },
  { id: "matrona", name: "Matrona", tag: "Obstetricia", price: 700, rarity: "Épico", category: "Familia", unlock: "shop", blurb: "Uniforme rojo de matrona chilena, cruz blanca y estetoscopio. A cuidar pancitos." },
  { id: "subzero", name: "Sub-Zero", tag: "Lin Kuei", price: 860, rarity: "Legendario", category: "Héroes", unlock: "shop", blurb: "Máscara azul, hielo en las patas y klon-clone de harina." },
  { id: "barbie", name: "Barbie", tag: "Malibú", price: 720, rarity: "Épico", category: "Princesa", unlock: "shop", blurb: "Moño rubio, vestido rosa y estrella. Puedes ser lo que quieras hornear." },
  { id: "bebe", name: "Maxine Bebé", tag: "Familia", price: 300, rarity: "Común", category: "Familia", unlock: "shop", blurb: "Chiquitita, ojitos de tapioca y un calcetín. Todavía no cava, pero lo intenta." },
  { id: "abuela", name: "Maxine Abuelita", tag: "Familia", price: 480, rarity: "Raro", category: "Familia", unlock: "shop", blurb: "Gafas, chal de lana y canas. Hornea desde 1978." },
  { id: "sabio", name: "Maxine Sabia", tag: "Familia", price: 900, rarity: "Legendario", category: "Familia", unlock: "shop", blurb: "Barba larga, báculo de baguette y halo de migas. Conoce la receta secreta." },
  { id: "freddy", name: "Freddy", tag: "FNAF", price: 780, rarity: "Épico", category: "FNAF", unlock: "shop", blurb: "Sombrero de copa, micrófono y corbatín. La pizzería abre a medianoche." },
  { id: "foxy", name: "Foxy", tag: "FNAF", price: 800, rarity: "Épico", category: "FNAF", unlock: "shop", blurb: "La más tierna del muelle: parche rosa, cola esponjosa y garrito de caramelo." },
  { id: "bonnie", name: "Bonnie", tag: "FNAF", price: 760, rarity: "Épico", category: "FNAF", unlock: "shop", blurb: "Conejo violeta, guitarra roja y orejas enormes." },
  { id: "chica", name: "Chica", tag: "FNAF", price: 760, rarity: "Épico", category: "FNAF", unlock: "shop", blurb: "Babero LET'S EAT y cupcake. Pico de pollito, corazón de hojaldre." },
];

export const RARITY_COLOR: Record<SkinRarity, string> = {
  "Común": "#cfe8a8",
  "Raro": "#7fd0ff",
  "Épico": "#d9a6ff",
  "Legendario": "#ffd27a",
  "Feo": "#c07040",
};

export const CATEGORIES: SkinCategory[] = [
  "Clásico",
  "Familia",
  "FNAF",
  "Pokémon",
  "Jujutsu",
  "Monster High",
  "Princesa",
  "Héroes",
  "Poppy",
  "Star Wars",
  "Minecraft",
  "Disfraz",
  "Feo",
];

export const SKIN_MAP: Record<SkinId, Skin> = Object.fromEntries(SKINS.map((s) => [s.id, s])) as Record<SkinId, Skin>;
