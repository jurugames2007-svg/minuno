export type Zone = "A" | "B" | "C" | "D" | "E" | "F";
export type AreaId =
  | "A1" | "A2" | "A3" | "A4" | "A5"
  | "B1" | "B2" | "B3" | "B4" | "B5"
  | "C1" | "C2" | "C3" | "C4" | "C5"
  | "D1" | "D2" | "D3" | "D4" | "D5"
  | "E1" | "E2" | "E3" | "E4" | "E5"
  | "F1" | "F2" | "F3" | "F4" | "F5";

export type AreaShape = "hills" | "garage" | "cave" | "forest" | "grotto" | "tower" | "bridge" | "shaft" | "rooftop" | "pit";

export interface AreaDef {
  id: AreaId;
  name: string;
  tag: string;
  zone: Zone;
  depth: 1 | 2 | 3 | 4 | 5;
  sky: string;
  dirt: string;
  grass: string;
  shape: AreaShape;
  left?: AreaId;
  right?: AreaId;
  up?: AreaId;
  down?: AreaId;
  hint: string;
  mapC: number;
  mapR: number;
}

const ZONES: Zone[] = ["A", "B", "C", "D", "E", "F"];
const DEPTHS = [1, 2, 3, 4, 5] as const;

const PAL: Record<Zone, { sky: string; dirt: string; grass: string }> = {
  A: { sky: "#7ec8ff", dirt: "#8a5420", grass: "#4a9a2a" },
  B: { sky: "#6a7a88", dirt: "#5a4a3a", grass: "#3a3a3a" },
  C: { sky: "#1a1420", dirt: "#3a2a20", grass: "#2a2018" },
  D: { sky: "#b8e0a0", dirt: "#6a4a20", grass: "#3a8a2a" },
  E: { sky: "#1a3048", dirt: "#3a4a50", grass: "#2a3840" },
  F: { sky: "#c07040", dirt: "#7a4a18", grass: "#3a7a1a" },
};

const META: Record<AreaId, { name: string; hint: string; shape: AreaShape }> = {
  A1: { name: "Prado", hint: "Casa de Lina. El viento huele a pan.", shape: "hills" },
  A2: { name: "Loma", hint: "Subí las lomas. Hay un nido vacío.", shape: "hills" },
  A3: { name: "Trigal", hint: "Espigas altas. Cuidado al saltar.", shape: "bridge" },
  A4: { name: "Molino", hint: "Aspas quietas. El piso cruje.", shape: "shaft" },
  A5: { name: "Mirador", hint: "Se ve todo el campo desde aquí.", shape: "rooftop" },
  B1: { name: "Taller", hint: "Tornillos y goma. Tico vive acá.", shape: "garage" },
  B2: { name: "Depósito", hint: "Cajas apiladas. Un pasillo estrecho.", shape: "garage" },
  B3: { name: "Cinta", hint: "Plataformas como cintas viejas.", shape: "bridge" },
  B4: { name: "Calderas", hint: "Hace calor. El metal resbala.", shape: "shaft" },
  B5: { name: "Nave", hint: "El techo del taller. Hay viento.", shape: "rooftop" },
  C1: { name: "Cueva", hint: "Oscuro. Nube esconde huesos.", shape: "cave" },
  C2: { name: "Galería", hint: "Pilares de piedra y ecos.", shape: "cave" },
  C3: { name: "Cristales", hint: "Brillan si ladrás cerca.", shape: "pit" },
  C4: { name: "Sima", hint: "Un pozo hondo. Bajá con calma.", shape: "shaft" },
  C5: { name: "Núcleo", hint: "El corazón de la cueva late.", shape: "pit" },
  D1: { name: "Claro", hint: "Un hada entre los árboles.", shape: "forest" },
  D2: { name: "Robledal", hint: "Raíces como escaleras.", shape: "forest" },
  D3: { name: "Ruinas", hint: "Ladrillos viejos de un horno.", shape: "bridge" },
  D4: { name: "Santuario", hint: "Harina en el aire, como nieve.", shape: "forest" },
  D5: { name: "Raíces", hint: "Bajo el roble. Huele a tierra dulce.", shape: "pit" },
  E1: { name: "Gruta", hint: "Gotea. El casco de Don está lejos.", shape: "grotto" },
  E2: { name: "Laguna", hint: "Orillas resbalosas y musgo.", shape: "grotto" },
  E3: { name: "Corriente", hint: "El agua empuja las plataformas.", shape: "bridge" },
  E4: { name: "Burbujas", hint: "Suben y bajan. Tomá aire.", shape: "shaft" },
  E5: { name: "Abismo", hint: "Lo más hondo del campo.", shape: "pit" },
  F1: { name: "Este", hint: "Don Llanta espera en el andén.", shape: "tower" },
  F2: { name: "Andamio", hint: "Tablones y clavos oxidados.", shape: "bridge" },
  F3: { name: "Campana", hint: "Si suena, algo se acerca.", shape: "tower" },
  F4: { name: "Terraza", hint: "Atardecer sobre las llantas.", shape: "rooftop" },
  F5: { name: "Torre", hint: "El último piso. La canasta…", shape: "rooftop" },
};

function aid(z: Zone, n: number): AreaId {
  return `${z}${n}` as AreaId;
}

function makeAreas(): Record<AreaId, AreaDef> {
  const out = {} as Record<AreaId, AreaDef>;
  for (let ci = 0; ci < ZONES.length; ci++) {
    const z = ZONES[ci];
    for (const n of DEPTHS) {
      const id = aid(z, n);
      const pal = PAL[z];
      const meta = META[id];
      out[id] = {
        id, name: meta.name, tag: `${z}-${n}`, zone: z, depth: n,
        sky: pal.sky, dirt: pal.dirt, grass: pal.grass, shape: meta.shape,
        hint: meta.hint, mapC: ci, mapR: n - 1,
        left: ci > 0 ? aid(ZONES[ci - 1], n) : undefined,
        right: ci < 5 ? aid(ZONES[ci + 1], n) : undefined,
        up: n > 1 ? aid(z, n - 1) : undefined,
        down: n < 5 ? aid(z, n + 1) : undefined,
      };
    }
  }
  return out;
}

export const AREAS: Record<AreaId, AreaDef> = makeAreas();

export const AREA_LIST: AreaId[] = ZONES.flatMap((z) => DEPTHS.map((n) => aid(z, n)));

export function zoneOf(id: AreaId): Zone {
  return id[0] as Zone;
}
