import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.resolve("captures");
const files = fs.readdirSync(dir).filter(f=>f.endsWith(".svg"));
for(const f of files){
  const input = path.join(dir,f);
  const out = input.replace(".svg",".png");
  const svg = fs.readFileSync(input);
  try{
    await sharp(svg).resize(512,512).png().toFile(out);
    console.log("OK",f);
  }catch(e){ console.error("FAIL",f,e.message)}
}
