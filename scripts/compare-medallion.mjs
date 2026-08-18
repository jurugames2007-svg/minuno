import sharp from "sharp";
import fs from "fs";

async function compare(id, aiPath){
  const a=`captures/tool-${id}.png`;
  const b=aiPath;
  const w=512,h=512,pad=14,totalW=w*2+pad*3,totalH=h+80,bg="#1a0c04";
  const svg=`<svg width="${totalW}" height="${totalH}">
    <text x="${w/2+pad}" y="36" font-family="Fredoka,sans-serif" font-size="18" font-weight="700" fill="#fff3d6" text-anchor="middle">SVG MEDALLITA</text>
    <text x="${w+pad*2+w/2}" y="36" font-family="Fredoka,sans-serif" font-size="18" font-weight="700" fill="#ffd27a" text-anchor="middle">IA NEUTRA</text>
    <text x="${totalW/2}" y="${h+64}" font-family="Press Start 2P,monospace" font-size="9" fill="#fff3d6" text-anchor="middle">${id.toUpperCase()} — MEDALLITA NEUTRA</text>
  </svg>`;
  const buf=Buffer.from(svg);
  const aBuf=await sharp(a).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  const bBuf=await sharp(b).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  await sharp({create:{width:totalW,height:totalH,channels:4,background:bg}}).png().composite([{input:aBuf,top:48,left:pad},{input:bBuf,top:48,left:pad*2+w},{input:buf,top:0,left:0}]).toFile(`captures/compare-${id}-medallion.png`);
  console.log(id);
}
await compare("guyu","captures/ai-guyu-medallion.png");
await compare("dixie","captures/ai-dixie-medallion.png");
