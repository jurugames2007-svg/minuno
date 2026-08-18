import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir="captures";
const order=fs.readdirSync(dir).filter(f=>f.startsWith("skin-")&&f.endsWith(".png")).map(f=>f.replace("skin-","").replace(".png","")).sort();
const size=256;
const cols=4;
const rows=Math.ceil(order.length/cols);
const padding=12;
const bg="#1a0c04";
const labelH=36;

const canvasW=cols*size + (cols+1)*padding;
const canvasH=rows*(size+labelH) + (rows+1)*padding;

// create canvas
let composite=[];
let positions=[];
for(let i=0;i<order.length;i++){
  const id=order[i];
  const col=i%cols;
  const row=Math.floor(i/cols);
  const x=padding+col*(size+padding);
  const y=padding+row*(size+labelH+padding);
  const pngPath=path.join(dir,`skin-${id}.png`);
  if(fs.existsSync(pngPath)){
    const buf=await sharp(pngPath).resize(size,size,{fit:"contain",background: {r:0,g:0,b:0,alpha:0}}).toBuffer();
    composite.push({input:buf, top:y, left:x});
  }
}

let base = sharp({create:{width:canvasW,height:canvasH,channels:4,background:bg}}).png();

let svgLabels=`<svg width="${canvasW}" height="${canvasH}">` +
 order.map((id,i)=>{
   const col=i%cols;
   const row=Math.floor(i/cols);
   const x=padding+col*(size+padding);
   const y=padding+row*(size+labelH+padding);
   const cx=x+size/2;
   const cy=y+size+22;
   const name=id.toUpperCase();
   return `<text x="${cx}" y="${cy}" font-family="Fredoka,Nunito,sans-serif" font-size="13" font-weight="700" fill="#fff3d6" text-anchor="middle">${name}</text>`;
 }).join("") + `</svg>`;

const labelBuf=Buffer.from(svgLabels);

await base.composite([...composite,{input:labelBuf, top:0, left:0}]).toFile(path.join(dir,"gallery-all-skins.png"));
console.log("gallery done",canvasW,canvasH);

// also create comparison per section
