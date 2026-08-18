import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir="captures";
const files=fs.readdirSync(dir).filter(f=>f.startsWith("tool-")&&f.endsWith(".svg"));
for(const f of files){
  const svg=fs.readFileSync(path.join(dir,f));
  const out=f.replace(".svg",".png");
  await sharp(svg).resize(512,512).png().toFile(path.join(dir,out));
  console.log("png",out);
}
