import sharp from "sharp";
import fs from "fs";

const W=360, H=640;
const dir="captures";

// try to embed recent captures as base64
function toBase64(p){
  const b=fs.readFileSync(p);
  return `data:image/png;base64,${b.toString("base64")}`;
}
const guyuB64 = fs.existsSync(`${dir}/tool-guyu.png`) ? toBase64(`${dir}/tool-guyu.png`) : null;
const dixieB64 = fs.existsSync(`${dir}/tool-dixie.png`) ? toBase64(`${dir}/tool-dixie.png`) : null;
const maxineDefault = toBase64(`${dir}/skin-default.png`);

// Create gameplay mock SVG
const svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a1c0a"/><stop offset="60%" stop-color="#1a0c04"/><stop offset="100%" stop-color="#070301"/></linearGradient>
    <linearGradient id="dirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b07a3c"/><stop offset="100%" stop-color="#7a4a1c"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- tiles grid mimic -->
  <g opacity="0.9">
    ${Array.from({length:9}).map((_,r)=> Array.from({length:8}).map((_,c)=>{
      const x=c*45, y=180+r*45;
      const isWall = c===0 || c===7;
      const isDirt = !isWall && (r%2!==c%2);
      const fill = isWall ? "#e4d2ac" : isDirt ? "#b07a3c" : "#d99243";
      return `<rect x="${x}" y="${y}" width="44" height="44" fill="${fill}" rx="2" stroke="#3a2010" stroke-width="0.5"/>`;
    }).join("") ).join("")}
  </g>
  <!-- HUD top -->
  <rect x="8" y="8" width="90" height="22" rx="11" fill="rgba(0,0,0,0.45)" stroke="#ffd27a" stroke-width="0.8"/>
  <text x="14" y="22" font-family="Press Start 2P,monospace" font-size="7" fill="#ff4d6d">❤❤❤</text>
  <text x="50" y="23" font-family="Fredoka,sans-serif" font-size="9" fill="#ffd27a" font-weight="700">3</text>
  <!-- depth -->
  <text x="${W/2}" y="28" font-family="Press Start 2P,monospace" font-size="6" fill="#fff3d6" text-anchor="middle" opacity="0.8">NIVEL 1 · MESA DE PREPARACIÓN</text>
  <text x="${W/2}" y="42" font-family="Fredoka,sans-serif" font-size="14" fill="#fff3d6" text-anchor="middle" font-weight="700">12 m</text>
  <!-- tool indicator -->
  <rect x="${W/2-36}" y="54" width="72" height="16" rx="8" fill="rgba(0,0,0,0.35)" stroke="#ffd27a" stroke-width="0.6"/>
  <text x="${W/2}" y="65" font-family="Press Start 2P,monospace" font-size="6" fill="#ffd27a" text-anchor="middle">♡ GUYU EQUIPADA</text>
  <!-- aim reticle -->
  <rect x="158" y="340" width="44" height="44" fill="none" stroke="#ffe066" stroke-width="1.6" stroke-dasharray="4 3" rx="6" opacity="0.85"/>
  <text x="180" y="366" font-family="Fredoka,sans-serif" font-size="14" fill="#ffe066" text-anchor="middle">↓</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(`${dir}/gameplay-mock-base.png`);
console.log("base done");

// Now composite Maxine + Guyu onto it
const maxineBuf = await sharp(`${dir}/skin-default.png`).resize(140,140).toBuffer();
const guyuBuf = await sharp(`${dir}/tool-guyu.png`).resize(48,48).toBuffer();
const dixieBuf = await sharp(`${dir}/tool-dixie.png`).resize(48,48).toBuffer();

await sharp(`${dir}/gameplay-mock-base.png`).composite([
  {input: maxineBuf, top: 380, left: 110},
  {input: guyuBuf, top: 360, left: 180}, // floating near mouth
  // add glow for Guyu soul
]).png().toFile(`${dir}/gameplay-guyu.png`);

await sharp(`${dir}/gameplay-mock-base.png`).composite([
  {input: maxineBuf, top: 380, left: 110},
  {input: dixieBuf, top: 360, left: 182},
]).png().toFile(`${dir}/gameplay-dixie.png`);

// combined both orbiting
await sharp(`${dir}/gameplay-mock-base.png`).composite([
  {input: maxineBuf, top: 380, left: 110},
  {input: guyuBuf, top: 350, left: 70},
  {input: dixieBuf, top: 350, left: 235},
]).png().toFile(`${dir}/gameplay-both.png`);

console.log("gameplay mocks done");
