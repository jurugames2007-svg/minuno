# 🎮 PROMPT PERFECTO — Maxine · Panadería Encantada

> **Este es el prompt maestro para recrear el juego en su forma perfecta**, tal como lo pidió el usuario. Cópialo tal cual en Lovable, v0, Bolt, Cursor, Windsurf, Midjourney + Code o cualquier generador de juegos. Incluye arte, mecánicas, skins y las nuevas medallitas Guyu/Dixie (neutras, sin cara ni color).

---

## 📋 PROMPT MAESTRO (copiar-pegar para IA de código)

```
Crea el juego web "Maxine · Panadería Encantada" con React + Vite + Tailwind, 9:16 portrait (360x640), 60fps.

CONCEPTO: Roguelite vertical de cavado. Maxine es una cachorra schnauzer miniatura kawaii que cava hacia abajo infinito para rescatar a Javiera de Bigotes el Feo (Jack Russell con parche). Inspirado en Downwell + Once Upon a Tower. Tono tierno-panadero, no terror.

ARTE BASE (OBLIGATORIO):
- Maxine: chibi miniature schnauzer, pelaje beige #e3c79a con luces crema #f6e4bf y sombras #b8956a, orejas caídas, barba esponjosa blanca, ojos negros grandes con brillo, nariz #1a0e08. Vector plano, contorno grueso #6a4420, fondo blanco, 1:1, SVG viewBox 0 0 100 100, animaciones: wag 0.55s, bob 2.2s, blink 4s. Usa componente Maxine.tsx con prop skin.
- Paleta cocina: cocoa #2a1408, amber #ffb347, honey #ffd27a, cream #fff3d6. Fondos radiales por zona: mesa #3a2410, horno #2a0e08, nevera #0e2436, despensa #2a1a08, sótano #14081f.

MECÁNICAS CORE:
- Grilla 8 columnas x infinito filas, TILE 45. Cols 0 y 7 son muros indestructibles. Generación procedural por rows con veinCol que se mueve ±1, garantiza corredor de 2 tiles de aire + hombros siempre cavables (evita soft-lock). Piedra (2) necesita 2 golpes o 1 con speed≥1.3, pinchos (3) hacen daño salvo Zapatitos.
- Movimiento: ←→ 175 speed (magnet 1.4x, hielo 0.4x), gravedad 1400, salto 470, coyote 0.12s, jump buffer 0.12s, doble salto con levadura.
- Cavado direccional: mantén dirección + ↓. wide: también rompe izq+der al cavar abajo. reach: alcanza 2 tiles horizontal. healOnDig: 14% cura al romper. spikeImmune: rompe pinchos al pisar. bounce: salva 1 muerte.
- Ataque con peluche: arco 1.1x0.9 tiles en dirección de mira, cooldown 0.32s, daño 1(+1 si speed≥1.45)(+1 si healOnDig). Devuelve sartenes del Chef.
- Enemigos 5 tipos: spoon (patrulla), mouse (salta), whisk (flota aleatorio), bubble (sube y empuja), spatula (trampa que se activa). IA con slowAura 0.35x en 2.4 tiles si tool slowAura.
- Recogibles: 5 panes (baguette 10, miche 25 cura, croissant 50, pretzel 100 + speed 8s, divine 500 + full heal), powers (leche escudo, imán 18s, mantequilla 12s, levadura 30s).
- Cámara sigue a player con lerp 6, shake al daño/boss.

PROGRESIÓN:
- Cada 32 filas = nivel. ARENA_H 9 + REST_H 4 + puerta. Puerta bloqueada hasta derrotar jefe del nivel. BossForLevel: 1 vacuum,2 chef,3 fridge (3 compresores),4 oven (embestida),5 bigotes, luego loop. Cada boss tiene estados vulnerable/stun con pistas (ej: "Golpéala cuando se detenga a cargar").
- Muerte: game over si corazones 0. Victoria nivel 5 rescata a Javiera. Meta moneda: coronas 👑 y migas. Tienda permanente (Panadería) con skins y tools metaPrice.

SKINS (14, viewMaxine skin id):
default Maxine pañuelito rojo, bow moño rosa coqueta, lime polerita lima sport verde neón #a8e85a, harness arnés rosado paseo, santa Santa Claws rojo Navidad, vampire Condesa Colmillo capa negra interior vino, princess Princesa Pan vestido merengue + tiara dorada, yuta Yuta Okkotsu JJK uniforme blanco + katana, kissy Kissy Missy rosa #ff8fb6 brazos largos manos amarillas, yarnaby Yarnaby león naranja #ff9d2e melena arcoíris de lana 28 tubos, pochacco Pochacco Sanrio blanco orejas negras camiseta magenta #d4145a, mahoraga rueda 8 mangos dorada 3D giratoria, jockey jinete mini rojo, catto gatito café con leche orejas triangulares cola larga. Ver Maxine.tsx palette y accesorios exactos.

TOOLS / HERRAMIENTAS (10, tipo ToolId): palito 1.0, sam 1.25 oso, calcetín wide 1.15, pulpito slowAura 1.3, pelota bounce 1.2, kissy reach 1.45, javiera healOnDig 1.8, zapatitos spikeImmune footwear, GUYU medallita neutra pelitos wide+slowAura 1.35 "#e8e0c8", DIXIE medallita neutra mañosa bounce+healOnDig 1.25 "#e8e0c8". Guyu pelitos deja aura amplia, Dixie berrinche salva 1 hit. IMPORTANTE: Guyu y Dixie son MEDALLITAS circulares neutras SIN CARA NI COLOR VIVO — tono hueso #fdfbf3 borde #c9bda8, anilla superior, grabado minimalista (Guyu: 3 curvas + paw dots, Dixie: corazón hueco + onda). No son personajes, son amuletos que orbitan 18px sobre Maxine con hop 1.6s y glow. Ver Plushie.tsx renderPlush guyu/dixie.

SHOP & UI:
- Menú: Maxine sentada en mesa con pan, HUD crowns, récord, botón A CAVAR, Panadería, Cómo jugar.
- Panadería: tabs PIELES/HERRAMIENTAS, preview Maxine + tool, vitrina, carrusel scroll horizontal, chips stats.
- Game HUD: corazones, crowns/pan run, nivel/zona, nombre herramienta, boss bar con estados, aura escudo/hielo, controles táctiles ◀▶ SALTO 👊 CAVAR.
- Pausa y RestStop con power-ups y tools comprables con pan/crowns de la run.

TECNOLOGÍA:
- Vite 7, React 19, Tailwind 4, vite-plugin-singlefile, alias @, server host 0.0.0.0 allowedHosts true (preview E2B). SSR capturas con sharp + tsx para testing visual.

ENTREGABLES:
- src/art/Maxine.tsx, Plushie.tsx, data/skins.ts, game/Game.tsx funcionales, build 399kB singlefile, preview https://5173-*.e2b.app, capturas en captures/ (gallery-all-skins.png, gallery-tools.png, compares).

NEGATIVE: No fotos realistas, no 3D, no texto watermark, no gore.

OBJETIVO: Juego jugable vertical 60fps, loop adictivo, boss skill-based, meta progresión panadería, arte kawaii consistente.
```

---

## 🎨 PROMPT ARTE — Maxine base (para generar imágenes/skins nuevas)

**Español:**
```
schnauzer miniatura chibi kawaii llamado Maxine, pelaje beige suave #e3c79a con luces crema #f6e4bf y sombras marrón #b8956a, orejas caídas peludas, cejas y barba blanca esponjosa, ojos negros redondos enormes con brillo blanco, nariz triangular negra #1a0e08, sentado de frente, ilustración vectorial plana, contorno grueso marrón #6a4420, estilo icono panadería, fondo blanco puro, 1:1 512x512, sombras suaves
```

**Inglés (Midjourney/SDXL):**
```
cute chibi miniature schnauzer puppy mascot named Maxine, fluffy wiry beige fur #e3c79a with cream #f6e4bf highlights and dark brown #b8956a shadows, floppy ears, white beard, big round black eyes with sparkle, tiny black nose #1a0e08, sitting facing front, flat vector illustration, clean bold outline #6a4420, bakery game icon, pure white background, 1:1 512x512, ultra detailed, kawaii SVG style --ar 1:1 --style cute
```
**Negative:** `photo, realistic, 3d render, blurry, lowres, extra limbs, text, watermark, dark background`

**Paleta bloqueada:** #fff1d0 crema, #e3c79a beige, #6a4420 outline, #2a1408 cocoa

---

## 👗 PROMPTS SKINS (añadir al base)

Cada uno es `[BASE] + traje` :

- **bow:** `+ huge pink bow #ff5fa0 on head, center knot #ff8fc0`
- **lime:** `+ lime neon green turtleneck sweater #a8e85a with collar #7fc24a`
- **harness:** `+ pink padded harness #ff5fa0 with gold tag #ffd27a`
- **santa:** `+ Santa hat and coat red #d9342b with white fur trim, pompom`
- **vampire:** `+ black cape with red wine interior, tiny fangs, golden bat clasp`
- **princess:** `+ pink dress #ffb3d1 with golden crown #ffd27a + pink jewel`
- **yuta:** `+ Yuta Okkotsu cosplay white uniform jacket + black pants + katana with gold guard`
- **kissy:** `+ Kissy Missy pink fluffy fur #ff8fb6 long arms yellow hands #ffe066 blue bow`
- **yarnaby:** `+ Yarnaby lion orange body #ff9d2e, rainbow yarn mane 28 thick tubes, 3 fangs`
- **pochacco:** `+ Pochacco white dog #ffffff black floppy ears magenta shirt #d4145a`
- **mahoraga:** `+ Mahoraga pale gray #f4f1e6, 8-handled golden wheel halo, cloud eyebrows, hakama #14181c`
- **jockey:** `+ tiny jockey rider red silks white stripes on back, holding reins`
- **catto:** `+ cat transformation triangle ears pink inside #ff8fa0, pink nose #ff7a9a, vertical slit pupils`

---

## 🛡️ PROMPTS HERRAMIENTAS — Medallitas Guyu & Dixie (FORMA PERFECTA NEUTRA)

> **Forma perfecta solicitada:** medallitas circulares **sin cara ni color vivo**, tono hueso/niebla, que se compran y portan para cuidar a Maxine. Son amuletos, no personajes. Orbitan sobre Maxine.

**Base medallita (común a ambas):**
```
minimalist circular medal amulet to protect a puppy, flat vector icon, 32x32 viewBox, outer rim thick 1.6 #c9bda8, inner ring 1.0 #e8e0c8, dashed inner #d7cdb8, top loop ring 2mm, fill ivory #fdfbf3 matte ceramic, no face, no vivid color, neutral beige-bone palette only #fdfbf3 #e8e0c8 #c9bda8 #b8ad98, delicate line engraving, soft shadow, centered on white background, 1:1
```

**Guyu específico (pelitos):**
```
[BASE MEDALLITA] + engraving: three soft curved horizontal lines stacked left + small paw print dots (1 large 4 small) right, representing floating hair tufts, protecting aura
```
Prompt inglés ideal: `minimalist circular medal amulet beige neutral no face, three curved hair strands + paw dots engraving, delicate`

**Dixie específico (mañosa):**
```
[BASE MEDALLITA] + engraving: hollow heart outline with small wavy line underneath, representing sweet tantrum, protecting charm
```
Prompt inglés ideal: `minimalist circular medal amulet beige neutral no face, hollow heart + wavy line engraving, delicate`

**Capturas actuales:** `captures/tool-guyu.png` (3 curvas + paw), `tool-dixie.png` (corazón+onda) — ver también `ai-guyu-medallion.png` / `ai-dixie-medallion.png` (versiones IA suaves).

**Efecto gameplay asociado (para balance):**
- Guyu medallita: `wide true + slowAura true, speedMul 1.35` — aura pelusa amplia, ralentiza enemigos 65% en 2.4 tiles, rompe laterales al cavar.
- Dixie medallita: `bounce true + healOnDig true, speedMul 1.25` — absorbe 1 golpe mortal (1.2s invuln) y 14% cura al romper.

---

## 🧪 CÓMO USAR EL PROMPT PERFECTO

1. **Para nuevo juego desde cero:** pega el `PROMPT MAESTRO` en tu IA de código, adjunta `captures/gallery-all-skins.png` y `gallery-tools.png` como referencia visual.
2. **Para nueva skin:** usa `PROMPT ARTE base + skin específico`, genera en Midjourney a 1024px, vectoriza con potrace.
3. **Para nueva medallita:** usa `BASE MEDALLITA + Guyu/Dixie específico`, genera icono 512px, úsalo en `Plushie.tsx`.

Ver galerías: `/captures/` , `/captures/v2.html` , `docs/SKINS_ESTUDIO.md` y `docs/V2_GUYU_DIXIE.md`.
