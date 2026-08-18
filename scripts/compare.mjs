import sharp from "sharp";
import fs from "fs";
import path from "path";

async function compare(id){
  const a = `captures/skin-${id}.png`;
  const b = `captures/ai-${id}-prompt.png`;
  if(!fs.existsSync(a) || !fs.existsSync(b)){ console.log("skip",id); return; }
  const w=512, h=512, pad=14;
  const totalW=w*2+pad*3;
  const totalH=h+80;
  const bg="#1a0c04";
  const svg=`<svg width="${totalW}" height="${totalH}">
    <text x="${w/2+pad}" y="36" font-family="Fredoka,sans-serif" font-size="22" font-weight="700" fill="#fff3d6" text-anchor="middle">ACTUAL SVG</text>
    <text x="${w+pad*2+w/2}" y="36" font-family="Fredoka,sans-serif" font-size="22" font-weight="700" fill="#ffd27a" text-anchor="middle">PROMPT IA IDEAL</text>
    <text x="${totalW/2}" y="${h+64}" font-family="Press Start 2P,monospace" font-size="10" fill="#fff3d6" text-anchor="middle">${id.toUpperCase()} — COMPARATIVA</text>
  </svg>`;
  const svgBuf=Buffer.from(svg);
  const base=sharp({create:{width:totalW,height:totalH,channels:4,background:bg}}).png();
  const aBuf=await sharp(a).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  const bBuf=await sharp(b).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  await base.composite([
    {input:aBuf, top:48, left:pad},
    {input:bBuf, top:48, left:pad*2+w},
    {input:svgBuf, top:0, left:0}
  ]).toFile(`captures/compare-${id}.png`);
  console.log("done",id);
}
for(const id of ["yarnaby","kissy","pochacco","mahoraga","yuta","vampire"]){
  await compare(id);
}
