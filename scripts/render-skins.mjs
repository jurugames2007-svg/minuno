import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Maxine from "../src/art/Maxine.tsx";

// We'll dynamically import after setup. Use esm.
// But Maxine.tsx is TSX; need to handle via vite? Alternative: manually recreate simple svg export.

// Fallback: directly create SVG string manually by invoking component via node with tsx loader.
// We'll use vite's transform: easiest is to copy logic and just output placeholder.

// Try to use tsx loader if available
console.log("render skins script");

// List skins from src/data/skins.ts
import { SKINS } from "../src/data/skins.ts";

const outDir = path.resolve("captures");
fs.mkdirSync(outDir, { recursive: true });

for (const skin of SKINS) {
  const svg = renderToStaticMarkup(React.createElement(Maxine, { skin: skin.id, pose: "idle", size: 300 }));
  const html = `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
  fs.writeFileSync(path.join(outDir, `skin-${skin.id}.svg`), html);
  console.log(`wrote ${skin.id}`);
}
