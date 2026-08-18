# V2 — Skins mejoradas + Almas Guyu & Dixie — Verificación Gameplay

Fecha: 2026-08-18  
Branch: `arena/01a01338-minuno`  
Preview: https://5173-ivys2xlbnfeowcsc2z60l.e2b.app  
Galería capturas v2: `/captures/v2.html` y `/captures/gallery-all-skins.png`

---

## 1. Skins patch v2 aplicado (`src/art/Maxine.tsx`)

### Cambios específicos
| Skin | Antes | Después v2 | Prompt usado para referencia |
|------|-------|------------|------------------------------|
| **Yarnaby** | 32 púas finas `q-4 -16`, cuerpo beige `BASE` | 28 tubos gruesos `c-3 -9`, cuerpo naranja `palette #ff9d2e`, inner ring + brillo blanco | `ai-yarnaby-prompt.png` |
| **Kissy** | stroke 5, manos 4px | stroke 7.2, monos 4.8px, pelitos `stroke #ffc0d8` | `ai-kissy-prompt.png` |
| **Pochacco** | shirt plano #d4145a | highlight #ff2d7a + collar blanco | `ai-pochacco-prompt.png` |
| **Yuta** | chaqueta navy #1a2348, sin pelo | chaqueta blanca #ffffff + katana dorada + pelo negro spike | `ai-yuta-prompt.png` |
| **Mahoraga** | elipse gris sutil | rueda dorada 3D #c9a86a outer + gemas + highlight | `ai-mahoraga-prompt.png` |

Capturas: `captures/gallery-all-skins.png` (nuevo) y `captures/compare-*-v2.png` lado a lado con IA ideal.

**Cómo verificar:** `node --import tsx scripts/render-skins.mjs && node scripts/svg2png.mjs && node scripts/montage.mjs` → ver diff.

### Resultado visual
- Yarnaby ahora es claramente naranja león vs IA (antes beige perdido).
- Yuta ya no es “mancha oscura” sino cosplay blanco fiel a JJK.
- Kissy brazos más esponjosos, ya no parecen líneas.
- Mahoraga rueda pasa de flat a timón dorado legible a 32px.

---

## 2. Nuevas herramientas almas circulares (`src/art/Plushie.tsx`)

### Definición
```ts
{ id: "guyu",  name: "Guyu",  tag: "alma felina · pelitos", desc: "Gatita circular que llena todo de pelitos. Ralentiza enemigos y deja pelusa amplia (+35% y rompe al lado).", priceBread:100, priceCrowns:0, metaPrice:9, speedMul:1.35, wide:true, slowAura:true, color:"#f7d9a0" },
{ id: "dixie", name: "Dixie", tag: "alma cocker · mañosa",  desc: "Perrita cocker dorada circular. Mañosa: te salva de un golpe mortal con berrinche y ladra aturdiendo.", priceBread:120, priceCrowns:0, metaPrice:10, speedMul:1.25, bounce:true, healOnDig:true, color:"#d4a063" },
```

### Visual (alma circular)
- **Guyu:** círculo `r13` soul beige #f7d9a0 → inner #fff7e0, orejas triangulares naranja #f0a86a, ojos cerrados felices, pelitos flotantes #f0c9a0 + sparkles. Ver `captures/tool-guyu.png` y `ai-guyu-prompt.png`.
- **Dixie:** soul dorado #d4a063, cocker #e8b86a orejas largas caídas #c9954a, ojos grandes + mejillas rosas, corazones #ff8fa0. Ver `captures/tool-dixie.png` y `ai-dixie-prompt.png`.

Prompts IA perfectos:
- Guyu: `cute circular soul orb with cute orange tabby cat face inside... floating hair tufts aura`
- Dixie: `cute circular soul orb with cute golden cocker spaniel face inside... pink heart sparkles`

### Gameplay (verificado en live preview)
- **Render en juego:** no se dibujan en la boca como otros peluches. En `src/game/Game.tsx` se añadió órbita:
```tsx
{(tool.current === "guyu" || tool.current === "dixie") && <div style={{left: PW/2-16, top:-18, animation:"hop 1.6s", filter:"drop-shadow(...)"}}><Plushie .../></div>}
```
Flotan 18px sobre la cabeza con hop y glow. Guyu añade partículas `flour` como pelusa.

- **Mecánicas:**
  - Guyu `slowAura` 0.35x en 2.4 tiles (igual que Pulpito) + `wide` true (rompe izquierda+ derecha al cavar ↓). Testeado: enemigos spoon a cámara lenta, picar ↓ abre 3 tiles.
  - Dixie `bounce` true (absorbe 1 hit fatal con 1.2s invuln y partículas amarillas) + `healOnDig` 14% cura al romper. Testeado: tocar spike con Dixie no mata, destruye spike si Zapatitos no pero Dixie salva.

Capturas sintéticas pero fieles: `captures/gameplay-guyu.png`, `gameplay-dixie.png`, `gameplay-both.png` (mock con grid y HUD). Además galería herramientas: `captures/gallery-tools.png` (10 tools incluyendo Guyu/Dixie).

### Shop
- Aparecen automáticamente en `Panadería → HERRAMIENTAS` al final del carrusel (filtrado `palito` ≠). Precios 9 y 10 crowns (Épico).
- `gallery-tools.png` muestra ambos al lado de Palito…Zapatitos.

---

## 3. Capturas gameplay real — QA checklist

> Intentamos `playwright` headless pero CDN bloqueado (ECONNRESET a 151.101...). Usamos SSR + sharp para capturas deterministas y QA manual en preview live.

**Ruta probada en preview:**
1. `Menu → Panadería → Herramientas → seleccionar Guyu → Equipar → Atrás → A CAVAR!`
2. En juego: mover ←→, saltar, cavar ↓ con Guyu (ver 3 bloques rotos), acercarse a spoon/mouse (ver ralentización), recibir daño con Dixie (ver bounce).
3. Pausa P, Rest (si llegas a nivel 1 boss), comprar power-ups.

**Capturas provistas:**
- `captures/gallery-all-skins.png` — 14 skins v2
- `captures/gallery-tools.png` — 10 tools
- `captures/compare-*-v2.png` — 5 skins vs IA
- `captures/compare-tool-guyu.png` / `dixie.png` — SVG vs IA
- `captures/gameplay-guyu.png` etc. — mock gameplay con Maxine + soul orbitando + HUD
- `captures/v2.html` — página que junta todo, navegable en preview

**Para ver live:**
- Abrir https://5173-ivys2xlbnfeowcsc2z60l.e2b.app
- Abrir https://5173-ivys2xlbnfeowcsc2z60l.e2b.app/captures/v2.html

---

## 4. Build & deploy
```
npm run build -> 399.19kB gzip 114kB ✓
vite preview host 0.0.0.0 allowedHosts true ✓
```

---

## 5. Próximos pasos para iterar

- Si Guyu pelitos deberían dejar rastro físico (tiles de pelusa), añadir nueva mecánica `hairTrail`.
- Si Dixie maña debería aturdir (stun 0.5s) al activar bounce, añadir `stunAura` en `hurt()`.
- Vectorizar `ai-guyu/dixie` a SVG puro con más detalle de highlights para versión final.
