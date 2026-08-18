# Maxine · Panadería Encantada

Juego de torre vertical (estilo *Once Upon a Tower*) para móvil. Retrato 9:16, toques grandes, skins de Maxine la schnauzer.

## Jugar en el navegador

```bash
npm install
npm run dev
```

## Empaquetar como APK (Android)

Ya está configurado **Capacitor**. En un Mac/PC con Android Studio:

```bash
npm install
npm run build
npx cap add android          # solo la primera vez
npx cap sync android
npx cap open android
```

En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

El `appId` es `com.minuno.panaderia`. El icono y el splash usan el fondo cacao `#140804`.

## Pieles nuevas

- Darth Vader, Padmé, Yuji Itadori, Boxeadora, Laufey, Pingüino
- **Bigotes el Feo** (categoría *Feo*): solo se desbloquea al derrotarlo
