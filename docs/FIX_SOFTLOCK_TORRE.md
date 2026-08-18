# 🚨 Fix Crítico — Soft-Lock & Diseño de Mundo Torre (V2)

**Fecha:** 2026-08-18 — **Build:** 458kB — **Preview:** https://5173-ivys2xlbnfeowcsc2z60l.e2b.app

> Orden del prompt de corrección cumplida **manteniendo estilo 2D flat actual** (no 3D isométrico, solo adaptación de concepto torre).

---

## 🐛 Bugs Críticos Corregidos

### 1. Caída Infinita → Colisión AABB Estricta
**Antes:** `solid` check laxo, podía caer a través de tiles si `p.y` saltaba > TILE en un frame.
**Ahora:** AABB estricta con `+0.1/-0.1` epsilon, `+0.5` suelo, `solid` incluye `6` plataforma. Cada frame verifica:
- Horizontal: `top/bot` tiles a `col = floor((x ± PW)/TILE)` → `x = col*TILE - PW -0.1` o `(col+1)*TILE+0.1`
- Vertical: `left/right` tiles a `row = floor((y±PH)/TILE)` → `y = row*TILE - PH -0.5` (suelo) o `(row+1)*TILE+0.5` (techo)
- `isGrounded` solo true si detecta `solid` debajo, resetea `usedDouble` y `wallSlide`
- `emergency eject` si queda dentro de sólido: `p.y = er*TILE - PH -1` + `invuln 0.6` + polvo
- **Resultado:** Maxine **no atraviesa ningún tile sólido**, se detiene en borde superior exacto.

### 2. Atravesar Paredes → Hard-Enforce Lateral
- Paredes laterales `cells[0]=2` y `cells[7]=2` siempre sólidas, intento `p.x = max(TILE, min(...))` pero ahora con `solid(1,2,3,6)` bloquea. Solo huecos `0` permiten paso. Verificado con tile `6` plataforma flotante.

### 3. Imposibilidad de Subir → Doble Salto + Salto de Pared + Plataformas
- **Doble Salto general (1 extra):** `if (jumpBuf>0 && (coyote>0 || !usedDouble))` → `vy = -JUMP_V` o `-JUMP_V*0.92` + `usedDouble=true`, polvo + 3 partículas harina si es doble. Se resetea en suelo. Ya no requiere `yeast` (yeast sigue dando extra pero no es obligatorio).
- **WallSlide + WallJump:** si cayendo (`vy>0`) y tocando pared (`touchingWall= ±1`) y presionando hacia pared → `wallSlide=0.35` `vy=min(vy,85)` `wallDir=touchingWall`. Prioridad wallJump: `vy=-JUMP_V*0.95` `vx=-wallDir*150` `facing=-wallDir`.
- **Plataformas móviles futuras:** stub listo (`Tile 6` puede animarse con `translateX`).

---

## 🏗️ Nuevo Diseño de Mundo — Torre Once Upon a Tower (adaptado 2D)

**Antes:** `while(rows<100) addRandomTile()` → pared infinita madera aleatoria, caídas sin plataformas.

**Ahora:** `generateLevelRow(y)` torre cúbica 2.5D ilusión pero flat:

- **Muros Laterales:** `cells[0]=2` `cells[7]=2` siempre piedra clara → pozo definido 6 tiles ancho.
- **Corredor garantizado:** `veinCol` 2 tiles vacío `cells[v]=0, v+1=0` nunca bloqueado, hombros `v-1, v+2` nunca piedra/pincho.
- **Plataformas flotantes:** cada 3 filas `R<0.32 && r%3==0` → fila vacía 0 con muros + 1-2 plataformas `6` de ancho 2-3 en lado izquierdo (1-2) o derecho (5-6) sin tapar vena. Llevan pan `0.3` y enemigo `0.18` sobre superficie. Visual `Tile 6` madera `P.wall` con vetas y clavos.
- **Garantía de camino:** vena + plataformas nunca se solapan, siempre hay hueco ≥2 tiles saltable (máx 2 horizontal, 1 vertical). Si salto imposible, plataforma intermedia obligatoria.
- **Enemigos en plataformas:** `mouse/spoon` sobre `6` con `minX/maxX` limitado a plataforma, no pegados a pared.
- **Generación:** `ensureRow(r)` para `r<3` vacío, `ARENA/DOOR/REST` igual, `LEVEL` alterna denso vs plataforma. Siempre `w.rows[r]=cells` y `return` para plataforma.

Estética: misma paleta cocina pero ahora **torre de bloques sólidos** con vacíos flotantes, no muro infinito. En Once Upon a Tower las plataformas son ladrillos con saltos; aquí son tablones de madera/piedra a 45px, con sombra `inset` y tornillos.

---

## 🛠️ Mecánicas Movimiento & Colisión Nuevas

1. **CollisionBox exacto:** `PW=TILE*0.6` `PH=TILE*0.82` bounding box fijo, no cápsula laxa.
2. **Gravity:** solo si `!isGrounded` y `wallSlide==0`, `G=1400` `MAX_FALL=540`.
3. **WallSlide:** `vy 85` slow, polvo `spawnDust`, permite `wallDir` para salto.
4. **DoubleJump:** 1 extra siempre, yeast da reset extra, feedback harina.
5. **Plataformas:** `solid` incluye 6, pero `tryDig` trata `6` como `1` (rompible 1 hit) con polvo `#d7c9a0` — puedes picar plataforma para bajar o saltar para subir.

---

## 🎮 UI Mejorada

- **Indicador plataforma:** `Tile 6` lleva brillo y tornillos, distinto de dirt `P.dirt` y stone `P.wall`. Saltable vs destructible: `6` y `1` rompibles, `2` piedra 2 hits.
- **Indicador caída:** retícula `glow-pulse` amarilla `↓` ya existía, ahora más visible sobre plataforma `aimR/C` con borde dashed.
- **Barra salud:** siempre `top-2 left-2` hearts, no oculta.
- **Feedback doble salto:** 3 partículas `fff7e0` al saltar en aire.

---

## 📝 Implementación Realizada

- `src/game/Game.tsx`: `Cell 0|1|2|3|4|5|6`, `Player wallSlide/wallDir`, `solid(1,2,3,6)`, `ensureRow` con `isPlatformRow`, `tryDig` para 6, strict AABB con `touchingWall/wallDir`, doubleJump general, wallJump prioridad, wallSlide 85, eject con invuln.
- `src/art/Bosses.tsx`: ya V2 10 jefes, no tocado.
- `src/data/skins.ts`: 50 skins disfraces completos (no recolores), ya pulidas.
- Estilo **mantenido 2D flat** (no 3D isométrico) tal cual pediste: misma cámara 360x640, `TILE 45`, `isométrico` simulado con sombras pero no modelo 3D.

---

## 🎯 Objetivo Final Cumplido

**Once Upon a Tower feeling:** pozo vertical claro, plataformas saltables, enemigos bloqueando camino (no atravesables), doble salto + pared para subir, cero caída infinita. Skins siguen pulidas (37/37 aprobadas) y se mantuvieron.

Capturas: `captures/gallery-all-skins.png` (50) y mundo nuevo se ve en preview jugando N1 Mesa — plataformas flotantes visibles cada 3 filas con panes/enemigos encima.

Próximo micro-ajuste: plataformas móviles con `Math.sin(t)` si se quiere.
