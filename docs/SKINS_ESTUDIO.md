# 🐶 MAXINE — Estudio Completo de Skins + Prompts Perfectos

**Juego:** Maxine · Panadería Encantada (0be2d764)  
**Fecha:** 2026-08-18  
**Autor:** Arena Agent — branch `arena/01a01338-minuno`  
**Preview vivo:** https://5173-ivys2xlbnfeowcsc2z60l.e2b.app (dev server en `0.0.0.0:5173`)

---

## 📋 Resumen ejecutivo

Se identificaron **14 skins** en `src/data/skins.ts`:

| # | id | Nombre | Tag | Precio | Rareza | ¿Recrear? |
|---|----|--------|-----|--------|--------|-----------|
| 1 | `default` | **Maxine** | Pañuelito rojo | 0 | Común | ⛔ Excluida (base) |
| 2 | `bow` | Moño Rosa | Coqueta | 120 | Común | ✅ |
| 3 | `lime` | Polerita Lima | Sport | 180 | Común | ✅ |
| 4 | `harness` | Arnés Rosado | Paseo épico | 220 | Raro | ✅ |
| 5 | `santa` | Santa Claws | Navidad | 350 | Raro | ✅ |
| 6 | `vampire` | Condesa Colmillo | Noche | 420 | Raro | ✅ |
| 7 | `princess` | Princesa Pan | Realeza | 500 | Épico | ✅ |
| 8 | `yuta` | Yuta Okkotsu | Hechicero | 700 | Épico | ✅ |
| 9 | `kissy` | Kissy Missy | Poppy | 850 | Épico | ✅ |
|10 | `yarnaby` | Yarnaby | Arcoíris |1200| Legendario | ✅ |
|11 | `pochacco` | Pochacco | Sanrio | 550 | Épico | ✅ |
|12 | `mahoraga` | Mahoraga | Shikigami | 900 | Legendario | ✅ |
|13 | `jockey` | Jockey | Hípica | 480 | Raro | ✅ |
|14 | `catto` | Gatito Café con Leche | Miau | 360 | Raro | ✅ |

> **Nota sobre Guyu y Dixie:** Pediste excluir “Maxine, Guyu y Dixie”. En el repo actual no existen skins con id `guyu` ni `dixie` — solo `default` (Maxine). Se respeta la exclusión de Maxine; Guyu/Dixie se dejan documentadas como “no presentes / reservadas para futuro”.

Todas las imágenes de referencia buscadas en internet se guardaron en `image-search/` y las capturas vectoriales actuales en `captures/skin-*.png`.

---

## 🎮 PROMPT PERFECTO BASE DEL JUEGO

Este es el ADN visual de Maxine. **Úsalo como prefijo para cualquier skin nueva.**

### Prompt en español (para documentar)
```
schnauzer miniatura chibi kawaii llamado Maxine, pelaje beige suave #e3c79a con luces crema #f6e4bf y sombras marrón #b8956a, orejas caídas peludas, cejas y barba blanca esponjosa, ojos negros redondos enormes con brillo blanco, nariz triangular negra #1a0e08, sentado de frente mirando a cámara, ilustración vectorial plana, contorno grueso marrón oscuro #6a4420, estilo icono de juego de panadería, fondo blanco puro, iluminación de estudio suave, proporción 1:1, 512x512, ultra detallado, sombras suaves
```

### Prompt en inglés (para Midjourney / SDXL / DALL·E / Firefly)
```
cute chibi miniature schnauzer puppy mascot named Maxine, fluffy wiry beige fur #e3c79a with cream #f6e4bf highlights and dark brown #b8956a shadows, floppy fluffy ears, white beard and eyebrows, big round expressive black eyes with white sparkle, tiny black triangular nose #1a0e08, sitting facing front, flat vector illustration, clean bold outline #6a4420 dark brown, bakery game icon style, centered on pure white background, soft studio lighting, 1:1 square, 512x512, ultra detailed, soft shadows, kawaii, SVG style --ar 1:1 --style cute
```

### Negative prompt (siempre añadir)
```
Negative: photo, realistic, 3d render, blurry, lowres, ugly, deformed, extra limbs, text, watermark, signature, dark background, noisy, grainy
```

### Parámetros recomendados
- **Modelo:** SDXL / Midjourney v6 / DALL·E 3
- **Aspect:** `1:1` (1024x1024 y luego downscale a 512)
- **Estilo:** `flat vector, cel shading, clean lines`
- **Paleta fija del juego:** crema #fff1d0, beige #e3c79a, marrón #6a4420, outline #3a2010
- **ViewBox objetivo:** `0 0 100 100` (como en `Maxine.tsx`) para que encaje perfecto en el SVG del juego.

---

## 🖼️ GALERÍA — Capturas actuales del código (fieles al SVG)

Estas son **capturas 100% reales** renderizadas por `scripts/render-skins.mjs` + `sharp` desde el componente `src/art/Maxine.tsx`. Sirven como baseline para iterar.

![Galería completa](captures/gallery-all-skins.png)

Cada PNG individual está en `captures/skin-<id>.png`:

- `captures/skin-default.png` — Maxine base (pañuelo rojo)
- `captures/skin-bow.png` — Moño Rosa
- `captures/skin-lime.png` — Polerita Lima
- `captures/skin-harness.png` — Arnés Rosado
- `captures/skin-santa.png` — Santa Claws
- `captures/skin-vampire.png` — Condesa Colmillo
- `captures/skin-princess.png` — Princesa Pan
- `captures/skin-yuta.png` — Yuta Okkotsu
- `captures/skin-kissy.png` — Kissy Missy
- `captures/skin-yarnaby.png` — Yarnaby
- `captures/skin-pochacco.png` — Pochacco
- `captures/skin-mahoraga.png` — Mahoraga
- `captures/skin-jockey.png` — Jockey
- `captures/skin-catto.png` — Gatito

> Para verlas interactivas abre el juego en la preview y ve a **Panadería → PIELES**.

---

## 🔍 REFERENCIAS DE INTERNET + PROMPT POR SKIN

### 1) `bow` — Moño Rosa (Coqueta) · Común 120
**Qué es:** Variante coqueta de Maxine con lazo gigante rosa en la cabeza.
**Referencia web:** No necesita licencia; es diseño original. Inspirado en accesorios kawaii Sanrio / moños gigantes.
**SVG actual:** `Maxine.tsx` línea `bow`: `<path>` rosa #ff5fa0 + centro #ff8fc0. Bien, pero el lazo es pequeño en `translate(50 16)`. 
**Prompt perfecto:**
```
[PROMPT BASE] + wearing a huge pink bow on top of head, bow color #ff5fa0 with darker outline #b02a66, center knot #ff8fc0, oversized kawaii, ribbon tails, cute --
```
**Mejora iterativa v2:** Hacer el moño 1.6x más grande, añadir pliegue central y brillo blanco. Probar con `generate_image` y comparar captura.

### 2) `lime` — Polerita Lima (Sport) · Común 180
**Ref:** Ropa deportiva neón.
**SVG actual:** Traje verde lima #a8e85a con franja clara #c6ff7a. Correcto pero plano.
**Prompt:**
```
[PROMPT BASE] + wearing a lime neon green turtleneck sweater, sporty, sleeves covering front legs, ribbed collar #7fc24a, bright #a8e85a, high saturation --
```
**Mejora:** Añadir textura de punto y loguito de hueso.

### 3) `harness` — Arnés Rosado (Paseo épico) · Raro 220
**Ref:** Arnés de paseo acolchado rosa neón.
**SVG actual:** Tres correas rosa #ff5fa0 + medalla dorada #ffd27a. Minimalista.
**Prompt:**
```
[PROMPT BASE] + wearing a pink padded harness with three straps, gold circular tag in center, stitching details, adventure-ready --
```
**Mejora:** Añadir hebillas metálicas y sombra de acolchado.

### 4) `santa` — Santa Claws (Navidad) · Raro 350
**Ref:** Gorro y capa de Santa.
**SVG actual:** Gorro rojo #d9342b + pompon blanco + traje con franja blanca. Falta barba de Santa? Es solo traje.
**Prompt:**
```
[PROMPT BASE] + wearing Santa Claus costume, red hat with white fur trim and white pompom, red coat with white fluffy border, Christmas bakery theme --
```
**Mejora:** Añadir pompón 3D y textura peluda en el borde.

### 5) `vampire` — Condesa Colmillo (Noche) · Raro 420
**Ref:** Vampira tierna “solo muerde pancitos”.
**Referencia inspiración vampiro kawaii:** Capa negra, colmillos.
**SVG actual:** Capa `linearGradient` #1a1024→#3a1830 con interior vino #7a1430 + collar 0c0612 + colmillos blancos. Bien pero capa muy oscura, pierde silueta en fondo oscuro.
**Captura AI generada (nuevo prompt):** `captures/ai-vampire-prompt.png`
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy vampire countess, fluffy beige fur, wearing black cape with red interior #d9342b lining, golden bat clasp, tiny cute fangs visible, cape collar high, kawaii spooky, flat vector illustration, clean bold outline, bakery game mascot style, centered on white background, 1:1 square, dark night palette with red accents --ar 1:1
```
**Mejora v2:** Cambiar capa a negro puro con brillo rojo interior, hacer fangs 20% más grandes, añadir mucro bat clip dorado. La IA propone añadir murciélagos decorativos — quitarlos para mantener 1 color.

### 6) `princess` — Princesa Pan (Realeza) · Épico 500
**Ref:** Princesa de merengue.
**SVG actual:** Vestido rosa #ffb3d1 + corona dorada #ffd27a con gema rosa. Simple.
**Prompt:**
```
[PROMPT BASE] + wearing a pink princess dress with fluffy skirt #ffb3d1, white frill trim #ffd9e6, golden crown with pink jewel, tiara, royal elegant --
```
**Mejora:** Añadir volumen al vestido (capas) y brillo en corona.

### 7) `yuta` — Yuta Okkotsu (Hechicero) · Épico 700
**Referencia real buscada:** Yuta Okkotsu de *Jujutsu Kaisen* — joven de pelo negro desordenado y ojos azul oscuro, uniforme blanco suelto con mangas hasta antebrazo, pantalón negro, zapatillas blancas, katana a la espalda [1](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu) [2](https://caibotlist.com/character/yuta-okkotsu/FewYnMwRBBSuSFGVFf-QJ5R26vmby6d9ThyVDTh07c0)
**Imágenes referencia:** `image-search/yuta-okkotsu-*.jpg`
**SVG actual:** Chaquetón azul oscuro #1a2348 + camisa blanca + katana negra diagonal. Le falta el pelo negro característico (solo orejas oscuras) y la espada es muy sutil.
**Captura AI nueva:** `captures/ai-yuta-prompt.png` — MUCHO más fiel: pelo negro messy, uniforme blanco, katana realista, ojos cansados azul.
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy as Yuta Okkotsu from Jujutsu Kaisen, fluffy beige fur, messy black hair tuft on top, tired dark blue eyes with dark circles, wearing white loose uniform jacket with high collar, black slender pants, white sneakers, katana on back with dark scabbard and silver guard, faithful anime adaptation, flat vector illustration, clean bold outline, bakery game mascot style, centered on white background, 1:1 --ar 1:1
```
**Negative:** no Rika giant monster (solo chico)
**Iteración:** v2 añadir anillo de compromiso (detalle lore) y mejorar katana con empuñadura rombos.

### 8) `kissy` — Kissy Missy (Poppy) · Épico 850
**Referencia real:** Kissy Missy es criatura alta y esbelta de pelaje rosa grueso, similar a Huggy Wuggy pero rosa, con lazo azul, manos y pies amarillos, ojos con pestañas [3](https://poppyplaytime.wiki.gg/wiki/Kissy_Missy) [4](https://poppyplaytimewiki.org/wiki/characters/kissy-missy). Es “tall slender pink creature, blue bow, yellow hands and feet” [5](https://caibotlist.com/character/kissy-missy/v0BQj1VHyeg1tw14-ylvhl6mgXoPbai7gtEm0clDqU0)
**Imágenes:** `image-search/kissy-missy-*.jpg/.webp`
**SVG actual:** `palette` cambia a rosa #ff8fb6 + brazos largos rosas con manos amarillas #ffe066 + ojos azules #3aa0ff. Silueta correcta pero pelaje no es lo suficientemente “woolly” y los brazos se ven como líneas.
**Captura AI nueva:** `captures/ai-kissy-prompt.png` — pelaje rosado esponjoso, brazos larguísimos hasta el suelo, manos amarillas grandes, lazo azul claro, ojos azules con pestañas. Perfecto.
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy as Kissy Missy from Poppy Playtime, transform fur to fluffy bright pink #ff8fb6, long fluffy pink arms reaching to ground with yellow hands #ffe066, blue bowtie on neck, big blue eyes with long eyelashes #3aa0ff, white muzzle, fluffy pink wool texture, flat vector illustration, clean bold outline #b02a66, bakery game mascot style, centered on white background, 1:1 --ar 1:1
```
**Iteración:** En Maxine.tsx ampliar ancho de brazo a 7px, añadir pelitos en borde rosa para textura.

### 9) `yarnaby` — Yarnaby (Arcoíris) · Legendario 1200
**Referencia real:** Yarnaby de *Poppy Playtime Chapter 4* — león de peluche grande naranja con melena arcoíris de hebras de lana, cara ámbar, ojos negros gigantes, sonrisa con 3 dientes [6](https://screenrant.com/poppy-playtime-chapter-4-yarnaby-appearance-lore-explainer/) [7](https://poppy-playtime.fandom.com/wiki/Yarnaby). Descripción oficial: “bright orange body and large, rainbow mane that's made completely out of different colored strands of yarn. Two giant black eyes and a wide grin with three big teeth” [8](https://screenrant.com/poppy-playtime-chapter-4-yarnaby-appearance-lore-explainer/)
**Imágenes:** `image-search/yarnaby-*.png/jpg`
**SVG actual:** 32 púas `hsl(hue 85% 60%)` alrededor de `50,42` radius 26. Se ve como sol puntiagudo, no como melena de lana. Cuerpo sigue beige, no naranja. Le falta la cara ámbar y los 3 dientes.
**Captura AI nueva:** `captures/ai-yarnaby-prompt.png` — melena de lana arcoíris completa, cuerpo naranja #ff8a2a, cara beige felpa. Mucho más fiel al juguete.
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy as Yarnaby from Poppy Playtime, orange lion-like body #ff8c2a, fluffy amber face, huge rainbow yarn mane made of thick yarn strands surrounding head like lion, colors red orange yellow green cyan blue purple pink, yarn texture visible, big round black eyes, goofy smile with three white triangular fangs, lion tail absent, flat vector illustration, clean bold outline, bakery game mascot style, centered on white background, 1:1 --ar 1:1
```
**Mejora v2 para `Maxine.tsx`:** Cambiar `palette` a naranja para yarnaby, usar `path` ondulado para lana (no flechas), añadir `face fill #f0a070` y 3 dientes.

### 10) `pochacco` — Pochacco (Sanrio) · Épico 550
**Referencia real:** Pochacco — perro blanco con orejas negras caídas, sin boca visible, cuerpo regordete, suele llevar camiseta roja o azul deportiva [9](https://hellokitty.fandom.com/wiki/Pochacco) [10](https://en.wikipedia.org/wiki/List_of_Sanrio_characters). Basado en Snoopy [11](https://bokksu.com/blogs/news/pochacco-unleashed-exploring-the-playful-world-of-sanrios-charming-pup)
**Imágenes:** `image-search/pochacco-*.jpg`
**SVG actual:** Palette blanco #ffffff + orejas negras + camiseta magenta #d4145a. Correcto pero hocico sigue siendo crema, debería ser blanco puro, y falta la carita sin boca.
**Captura AI nueva:** `captures/ai-pochacco-prompt.png` — perro blanco perfecto, orejas negras caídas grandes, camiseta magenta, sin boca, estilo Sanrio.
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy as Pochacco Sanrio, transform fur to white #ffffff with black floppy ears, short tail with black tip, no visible mouth, black nose and paw pads, wearing magenta hot pink t-shirt #d4145a with short sleeves, sporty playful, chubby round body, flat vector illustration, clean bold outline #555555, bakery game mascot style, centered on white background, 1:1 --ar 1:1
```
**Iteración:** Quitar bigotes/barba en pochacco (ya se hace), pero también ocultar la nariz beige y ponerla negra, y añadir sombra gris clara en hocico.

### 11) `mahoraga` — Mahoraga (Shikigami) · Legendario 900
**Referencia real:** Mahoraga — General Divino de 8 espadas Divergentes, shikigami más fuerte de las Diez Sombras, figura humanoide musculosa gigante con rueda de 8 mangos flotando sobre la cabeza que gira al adaptarse [12](https://jujutsu-kaisen.fandom.com/wiki/Eight-Handled_Sword_Divergent_Sila_Divine_General_Mahoraga) [13](https://gamerant.com/jujutsu-kaisen-mahoraga-adaptation-explained/)
**Imágenes:** `image-search/mahoraga-*.jpg/webp`
**SVG actual:** Halo rueda #8a8a6a con 8 rayos + cejas nube blancas + boca dentada blanca + hakama negro. Bien pero rueda es 2D elipse, no 8 mangos 3D; cuerpo sigue beige normal no musculoso.
**Captura AI nueva:** `captures/ai-mahoraga-prompt.png` — musculatura exagerada, rueda dorada 8-spoke tipo timón, cejas nube, hakama gris, boca dentada gigante.
**Prompt perfecto:**
```
cute chibi miniature schnauzer puppy as Mahoraga Divine General from Jujutsu Kaisen, pale gray-white muscular fluffy fur #f4f1e6, white cloud-shaped eyebrows, large white rectangular mouth with vertical black teeth lines, eight-handled wheel halo floating above head with 8 spokes and golden rim, dark hakama pants #14181c with gray sash #8a9498 and red knot, strong arms, flat vector illustration, clean bold outline #555555, bakery game mascot style, centered on white background, 1:1 --ar 1:1
```
**Iteración:** Hacer rueda con 8 mangos marrones y animación `spin-slow 3.5s` ya existe — aumentar a 3D con grosor, y hacer cuerpo más ancho.

### 12) `jockey` — Jockey (Hípica) · Raro 480
**Ref:** Jinete miniatura montando a Maxine como caballo pura sangre.
**SVG actual:** Jinete completo con casco rojo, chaqueta roja rayas blancas, pantalón crema, botas negras sobre lomo. Muy detallado y gracioso.
**Prompt:**
```
[PROMPT BASE] + with tiny jockey rider on back, jockey wearing red racing silks with white vertical stripes, black helmet with red band, beige pants, black boots, holding reins attached to red bandana, horse-racing theme --
```
**Mejora:** Dar más contraste al jinete (sombra) y hacer que mire al frente no de lado.

### 13) `catto` — Gatito Café con Leche (Miau) · Raro 360
**Ref:** Versión gato de Maxine.
**SVG actual:** Orejas triangulares rosas #ff8fa0, cola larga gato, bigotes blancos, nariz rosa #ff7a9a, ojos verticales slit. Muy logrado.
**Prompt:**
```
[PROMPT BASE] + transformed into cat, triangular cat ears pink inside, long cat tail, pink nose #ff7a9a, vertical slit pupils, white whiskers, cafe con leche fur #d9c39a, still schnauzer beard but catlike --
```
**Mejora:** Añadir manchas atigradas suaves.

---

## 🧪 CAPTURAS INTERACTIVAS + MÉTODO DE ITERACIÓN

### Cómo probar cambios ahora mismo (sin esperar build)

1. **Edita `src/art/Maxine.tsx`** — cambia colores, paths, animaciones.
2. Guarda → Vite hace HMR instantáneo en https://5173-ivys2xlbnfeowcsc2z60l.e2b.app
3. En la tienda, cambia de piel con los botones del carrusel para ver side-by-side.
4. Ejecuta `node scripts/render-skins.mjs && node scripts/svg2png.mjs && node scripts/montage.mjs` para regenerar `captures/gallery-all-skins.png` y ver diff en Git.

### Flujo recomendado de mejora (iterativo)

Para cada skin `X`:
```bash
# 1. Ajusta Maxine.tsx (ej: agranda moño)
code src/art/Maxine.tsx

# 2. Regenera capturas vectoriales
node scripts/render-skins.mjs
node scripts/svg2png.mjs
node scripts/montage.mjs

# 3. Compara con IA
# Abre captures/skin-X.png vs captures/ai-X-prompt.png
# Ajusta hasta que el SVG se acerque 80% al ideal manteniendo estilo plano del juego

# 4. Commit
git add src/art/Maxine.tsx captures/
git commit -m "skin(X): mejorar fidelidad a referencia"
```

### Capturas vs IA — comparativa rápida

| Skin | SVG actual (captura) | IA prompt ideal | Diferencia clave |
|------|----------------------|-----------------|------------------|
| **yuta** | Chaqueta oscura, sin pelo | `ai-yuta-prompt.png` pelo negro + katana detallada | Cambiar palette no basta; añadir `path` pelo |
| **kissy** | Rosa plano, brazos finos | `ai-kissy-prompt.png` rosa peludo, brazos grusos | Engordar stroke a 7 |
| **yarnaby** | Sol de pinchos | `ai-yarnaby-prompt.png` melena de lana gruesa | Reemplazar flechas por tubos de lana |
| **pochacco** | Blanco correcto pero hocico crema | `ai-pochacco-prompt.png` blanco puro sin barba | Quitar barba y poner nose negro |
| **mahoraga** | Rueda plana | `ai-mahoraga-prompt.png` rueda timón dorada | Añadir profundidad a rueda |
| **vampire** | Capa oscura plana | `ai-vampire-prompt.png` capa con brillo rojo | Añadir highlight interno |

Todas las IA están en `captures/ai-*.png`. Úsalas como **target image** para tu prompt en Stable Diffusion si quieres vectorizar.

---

## 🎨 PROMPT MAESTRO (copiar-pegar para Midjourney / SDXL)

```
cute chibi miniature schnauzer puppy bakery mascot, fluffy wiry beige fur, big round black eyes, flat vector illustration, clean bold outline #6a4420, soft studio lighting, centered on pure white background, 1:1 square, 512x512, kawaii, SVG style -- [COSTUME DETAILS] --ar 1:1 --style raw --s 250 --v 6
```

**Reemplaza [COSTUME DETAILS] con:**

- Bow: `huge pink bow #ff5fa0 on head with center knot #ff8fc0`
- Lime: `lime neon green turtleneck sweater #a8e85a`
- Harness: `pink padded harness #ff5fa0 with gold tag #ffd27a`
- Santa: `Santa hat and coat red #d9342b with white fur trim`
- Vampire: `black cape with red interior, tiny fangs, golden bat clasp`
- Princess: `pink dress #ffb3d1 with golden crown #ffd27a`
- Yuta: `Yuta Okkotsu cosplay white uniform jacket black pants katana`
- Kissy: `Kissy Missy pink fluffy fur #ff8fb6 long arms yellow hands #ffe066 blue bow`
- Yarnaby: `Yarnaby lion rainbow yarn mane, orange body`
- Pochacco: `Pochacco white dog black ears magenta shirt #d4145a`
- Mahoraga: `Mahoraga eight-handled wheel halo, cloud eyebrows, hakama`
- Jockey: `tiny jockey rider red silks on back`
- Catto: `cat transformation triangle ears pink nose`

---

## 📦 Entregables en este repo

```
captures/
  skin-default.png … skin-catto.png        # 14 capturas SVG reales (baseline)
  gallery-all-skins.png                     # Montage 4x4 para review rápido
  ai-yuta-prompt.png / ai-kissy-*.png …    # 6 recreaciones IA con prompt perfecto

image-search/
  yuta-okkotsu-*.jpg / kissy-missy-*.jpg …  # Fotos descargadas de internet

scripts/
  render-skins.mjs   # SSR React → SVG
  svg2png.mjs        # SVG → PNG vía sharp
  montage.mjs        # gallery

docs/SKINS_ESTUDIO.md  # este archivo
```

---

## 🚀 Próximos pasos sugeridos

1. **Mejorar Yarnaby y Mahoraga primero** (son Legendarias y las que más difieren de la referencia).
2. Aplicar micro-ajustes a **Pochacco** (quitar barba) y **Kissy** (engordar brazos).
3. Crear variantes `guyu` / `dixie` si las tienes en mente — ya está el sistema de `SkinId` listo (añadir a `SKINS` y `Maxine.tsx`).
4. Cuando estés satisfecho con `captures/gallery-all-skins.png`, reemplaza los `generate_image` outputs por vectores trazados con `potrace` o redibuja en Figma.

¿Quieres que ahora te genere el **patch de `Maxine.tsx` v2** con las mejoras de Yarnaby + Pochacco + Kissy aplicadas y te saque la nueva galería para comparar lado a lado?
```

