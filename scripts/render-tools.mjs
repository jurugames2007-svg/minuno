import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Plushie } from "../src/art/Plushie.tsx";
import { TOOLS } from "../src/art/Plushie.tsx";

const outDir = path.resolve("captures");
fs.mkdirSync(outDir, { recursive: true });

for (const t of TOOLS) {
  const svg = renderToStaticMarkup(React.createElement(Plushie, { id: t.id, size: 300 }));
  const html = `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
  fs.writeFileSync(path.join(outDir, `tool-${t.id}.svg`), html);
  console.log(`wrote tool ${t.id}`);
}
