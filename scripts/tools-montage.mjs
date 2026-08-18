import sharp from "sharp";
import fs from "fs";
import path from "path";

const tools = ["palito","sam","calcetin","pulpito","pelota","kissy","javiera","zapatitos","guyu","dixie","rodillo","batidora","sarten","cuchilla","sacabocados","delantal","guantes","gorro","mandil","tabla"];
const names = {palito:"Palito",sam:"Sam",calcetin:"Calcetín",pulpito:"Pulpito",pelota:"Pelota",kissy:"Kissy",javiera:"Javiera",zapatitos:"Zapatitos",guyu:"Guyu",dixie:"Dixie",rodillo:"Rodillo",batidora:"Batidora",sarten:"Sartén",cuchilla:"Cuchilla",sacabocados:"Sacabocados",delantal:"Delantal",guantes:"Guantes",gorro:"Gorro",mandil:"Mandil",tabla:"Tabla"};
const size=180;
const cols=5;
const rows=Math.ceil(tools.length/cols);
const pad=12, labelH=52;
const bg="#1a0c04";
const W=cols*size + (cols+1)*pad;
const H=rows*(size+labelH)+(rows+1)*pad;

let composite=[];
for(let i=0;i<tools.length;i++){
  const id=tools[i];
  const col=i%cols, row=Math.floor(i/cols);
  const x=pad+col*(size+pad), y=pad+row*(size+labelH+pad);
  const p=`captures/tool-${id}.png`;
  if(fs.existsSync(p)){
    const buf=await sharp(p).resize(size,size,{fit:"contain",background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
    composite.push({input:buf, top:y, left:x});
  }
}
const svgLabels=`<svg width="${W}" height="${H}">
${tools.map((id,i)=>{
  const col=i%cols,row=Math.floor(i/cols);
  const x=pad+col*(size+pad), y=pad+row*(size+labelH+pad);
  const cx=x+size/2, cy=y+size+20;
  const tag = id==="guyu" ? "MEDALLITA · PELITOS" : id==="dixie" ? "MEDALLITA · MAÑOSA" : "";
  return `<text x="${cx}" y="${cy}" font-family="Fredoka,sans-serif" font-size="13" font-weight="700" fill="#fff3d6" text-anchor="middle">${names[id].toUpperCase()}</text><text x="${cx}" y="${cy+14}" font-family="Press Start 2P,monospace" font-size="7" fill="#ffd27a" text-anchor="middle">${tag}</text>`;
}).join("")}
</svg>`;
const labelBuf=Buffer.from(svgLabels);
await sharp({create:{width:W,height:H,channels:4,background:bg}}).png().composite([...composite,{input:labelBuf, top:0, left:0}]).toFile("captures/gallery-tools.png");
console.log("tools gallery done");
