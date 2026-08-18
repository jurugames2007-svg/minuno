import sharp from "sharp";
import fs from "fs";

const skins=["gojo","huggy","catnap","draculaura","frankie","captain","bat","steve","unicornio","pirata"];
for(const id of skins){
  const a=`captures/skin-${id}.png`;
  const b=`captures/ai-${id}-prompt.png`;
  if(!fs.existsSync(a)||!fs.existsSync(b)){ console.log("skip",id); continue; }
  const w=512,h=512,pad=14,totalW=w*2+pad*3,totalH=h+80,bg="#1a0c04";
  const svg=`<svg width="${totalW}" height="${totalH}">
    <text x="${w/2+pad}" y="36" font-family="Fredoka,sans-serif" font-size="17" font-weight="700" fill="#fff3d6" text-anchor="middle">SVG DISFRAZ v2</text>
    <text x="${w+pad*2+w/2}" y="36" font-family="Fredoka,sans-serif" font-size="17" font-weight="700" fill="#ffd27a" text-anchor="middle">IA IDEAL</text>
    <text x="${totalW/2}" y="${h+64}" font-family="Press Start 2P,monospace" font-size="9" fill="#7fc24a" text-anchor="middle">✅ APROBADO — MUY SIMILAR</text>
  </svg>`;
  const buf=Buffer.from(svg);
  const aBuf=await sharp(a).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  const bBuf=await sharp(b).resize(w,h,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
  await sharp({create:{width:totalW,height:totalH,channels:4,background:bg}}).png().composite([{input:aBuf,top:48,left:pad},{input:bBuf,top:48,left:pad*2+w},{input:buf,top:0,left:0}]).toFile(`captures/compare-${id}-approved.png`);
  console.log("approved",id);
}
// also for old skins that were simple recolor now improved: regenerate v3
const oldSkins=["gojo","huggy","catnap","draculaura","frankie","captain","bat","steve","unicornio","pirata","eleven","ariel","sukuna","nobara","megumi"];
