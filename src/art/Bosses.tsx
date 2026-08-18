export type BossType = "escoba" | "gato" | "antisam" | "caballo" | "fantasma" | "cuchara" | "hornito" | "refriRey" | "alacena" | "bigotesGrande" | "vacuum" | "chef" | "fridge" | "oven" | "bread" | "bigotes" | "pastelero" | "duende" | "reinaMigas" | "maestroChoco" | "espectro";

export interface Part { id: number; ox: number; oy: number; hp: number; maxHp: number; kind: "compressor" | "arm" | "broom" | "miniGato" | "button" | "pata" | "eye" | "compressorRey"; flash: number; }
export interface Boss {
  type: BossType;
  x: number; y: number; vx: number; vy: number;
  hp: number; maxHp: number;
  t: number; cd: number; phase: number; flash: number;
  homeY: number; minX: number; maxX: number;
  frozen: number; charge: number;
  stun: number; telegraph: number; vulnerable: boolean; shieldFlash: number;
  parts: Part[]; phase2: boolean; vulnTimer: number;
}

export interface Bullet {
  id: number; x: number; y: number; vx: number; vy: number;
  life: number; kind: "dust" | "pan" | "panback" | "ice" | "flame" | "crumb" | "shock" | "bark" | "splinter" | "hairball" | "button" | "wood" | "ecto" | "dough" | "can" | "book";
  grav?: number;
}

export interface BossCtx {
  playerX: number; playerY: number;
  left: number; right: number; top: number; bottom: number;
  spawnBullet: (b: Omit<Bullet, "id">) => void;
  spawnMouse: (x: number, y: number) => void;
  shake: (n: number) => void;
}

export function bossForLevel(level: number): BossType {
  // V2 chronological order 1-10, then loop + bigotes every 10
  const order: BossType[] = ["escoba","gato","antisam","caballo","fantasma","cuchara","hornito","refriRey","alacena","bigotesGrande"];
  if (level >=1 && level <=10) return order[level-1];
  if (level >10 && level % 10 ===0) return "bigotesGrande";
  // bonus rotation for checkpoints beyond 10
  const loop: BossType[] = ["escoba","gato","antisam","caballo","fantasma"];
  return loop[(level-11)%loop.length];
}
export const BOSS_NAME: Record<BossType, string> = {
  escoba: "ESCOBA MÁGICA", gato: "GATO ARCOÍRIS", antisam: "ANTI-SAM", caballo: "CABALLO DE MADERA",
  fantasma: "FANTASMA DE LA COCINA", cuchara: "CUCHARA GIGANTE", hornito: "CHEF HORNITO",
  refriRey: "REFRIGERADOR REY", alacena: "ALACENA ANTIGUA", bigotesGrande: "BIGOTES EL GRANDE",
  vacuum: "LA ASPIRADORA", chef: "CHEF FANTASMA", fridge: "NEVERA MALVADA",
  oven: "HORNO COLOSAL", bread: "PAN MONSTRUO", bigotes: "BIGOTES EL FEO",
  pastelero: "PASTELERO ENFURECIDO", duende: "DUENDE DEL HORNO", reinaMigas: "REINA DE LAS MIGAS",
  maestroChoco: "MAESTRO CHOCOLATERO", espectro: "ESPECTRO DE LA DESPENSA"
};
export const BOSS_TAUNT: Record<BossType, string> = {
  escoba: "Golpea el mango cuando carga.",
  gato: "¡Ataca al acicalarse!",
  antisam: "Golpea su costura al hincharse.",
  caballo: "¡Patas vulnerables al levantar!",
  fantasma: "¡Luz para volverlo tangible!",
  cuchara: "Golpea al cargar el vórtice.",
  hornito: "¡Ataca al enfriarse!",
  refriRey: "¡Rompe sus compresores sobrecalentados!",
  alacena: "¡Ataca al abrir puertas!",
  bigotesGrande: "¡Solo su parche es vulnerable al ladrar!",
  vacuum: "Golpeala cuando se detenga a cargar.",
  chef: "Espera a que aterrice · devolvele sus sartenes.",
  fridge: "Rompe los 3 compresores primero.",
  oven: "Esquiva la embestida · pegale al subir.",
  bread: "Cortale los brazos de masa.",
  bigotes: "¡Rescata a Javiera! Esquiva sus embestidas.",
  pastelero: "¡Esquiva pasteles explosivos!",
  duende: "¡Atrapa su teletransporte!",
  reinaMigas: "¡No dejes que hormigas roben!",
  maestroChoco: "¡Evita ríos de chocolate!",
  espectro: "¡Revela su posesión con luz!"
};

export function spawnBoss(type: BossType, level: number, left: number, right: number, top: number): Boss {
  const baseHp = 6 + level * 2;
  let maxHp = baseHp;
  if (type === "bigotesGrande") maxHp = baseHp + 12;
  else if (type === "refriRey" || type === "alacena") maxHp = baseHp + 6;
  else if (type === "bread") maxHp = baseHp + 4;
  const parts: Part[] = [];
  if (type === "refriRey") {
    parts.push({ id:1, ox:-34, oy:-10, hp:2, maxHp:2, kind:"compressorRey", flash:0 });
    parts.push({ id:2, ox:34, oy:-10, hp:2, maxHp:2, kind:"compressorRey", flash:0 });
    parts.push({ id:3, ox:0, oy:-32, hp:2, maxHp:2, kind:"compressorRey", flash:0 });
  }
  if (type === "fridge") {
    parts.push({ id:1, ox:-34, oy:-6, hp:1, maxHp:1, kind:"compressor", flash:0 });
    parts.push({ id:2, ox:34, oy:-6, hp:1, maxHp:1, kind:"compressor", flash:0 });
    parts.push({ id:3, ox:0, oy:-34, hp:1, maxHp:1, kind:"compressor", flash:0 });
  }
  if (type === "gato") {
    for(let i=0;i<7;i++) parts.push({ id:i+1, ox: -36+ i*12, oy: -30, hp:1, maxHp:1, kind:"miniGato", flash:0 });
  }
  if (type === "antisam") {
    parts.push({ id:1, ox:-18, oy:-12, hp:2, maxHp:2, kind:"button", flash:0 });
    parts.push({ id:2, ox:18, oy:-12, hp:2, maxHp:2, kind:"button", flash:0 });
  }
  if (type === "caballo") {
    parts.push({ id:1, ox:-16, oy:16, hp:2, maxHp:2, kind:"pata", flash:0 });
    parts.push({ id:2, ox:16, oy:16, hp:2, maxHp:2, kind:"pata", flash:0 });
  }
  if (type === "fantasma") {
    parts.push({ id:1, ox:-12, oy:-16, hp:1, maxHp:1, kind:"eye", flash:0 });
    parts.push({ id:2, ox:12, oy:-16, hp:1, maxHp:1, kind:"eye", flash:0 });
  }
  if (type === "bread") {
    parts.push({ id:1, ox:-34, oy:6, hp:2, maxHp:2, kind:"arm", flash:0 });
    parts.push({ id:2, ox:34, oy:6, hp:2, maxHp:2, kind:"arm", flash:0 });
  }
  if (type === "alacena") {
    parts.push({ id:1, ox:-26, oy:-8, hp:2, maxHp:2, kind:"arm", flash:0 });
    parts.push({ id:2, ox:26, oy:-8, hp:2, maxHp:2, kind:"arm", flash:0 });
  }
  return {
    type, x: (left + right)/2, y: top + 90, vx: type==="bigotesGrande"?140 : type==="caballo"?90 : type==="gato"?70 : 50, vy:0,
    hp: maxHp, maxHp, t:0, cd:1.3, phase:0, flash:0,
    homeY: top+90, minX:left+40, maxX:right-40, frozen:0, charge:0,
    stun:0, telegraph:0, vulnerable:false, shieldFlash:0, parts, phase2:false, vulnTimer:0,
  };
}

export function bossPartsWorld(b: Boss){ return b.parts.map(p=>({ ...p, x: b.x+p.ox, y:b.y+p.oy })); }

export function stepBoss(b:Boss, dt:number, ctx:BossCtx){
  b.t+=dt; b.flash=Math.max(0,b.flash-dt); b.shieldFlash=Math.max(0,b.shieldFlash-dt);
  b.stun=Math.max(0,b.stun-dt); b.telegraph=Math.max(0,b.telegraph-dt); b.vulnTimer=Math.max(0,b.vulnTimer-dt); b.cd-=dt;
  for(const p of b.parts) p.flash=Math.max(0,p.flash-dt);
  const enraged=1+Math.min(1.5,(b.maxHp-b.hp)/b.maxHp);
  const stunned=b.stun>0;
  const hpPct=b.hp/b.maxHp;

  if(b.type==="escoba"){
    // F1 barrido polvo ralentiza, F2 astillas, F3 tornado
    const phase = hpPct >0.66?1: hpPct>0.33?2:3;
    b.phase=phase;
    if(stunned){ b.vulnerable=true; b.x+=Math.sin(b.t*30)*0.6; }
    else {
      const cycle=b.t% (phase===3?2.2:3.0);
      const isTelegraph= cycle> (phase===3?1.2:2.0);
      if(isTelegraph){ b.telegraph=0.05; b.vulnerable=true; b.vx*=0.85; }
      else { b.vulnerable=false; b.x+=b.vx*enraged*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} }
      b.y=b.homeY+Math.sin(b.t*1.2)*12;
      if(b.cd<=0 && !isTelegraph){
        b.cd= (phase===1?1.6: phase===2?1.2:0.9)/enraged;
        if(phase===1){ for(let i=-1;i<=1;i++) ctx.spawnBullet({x:b.x+i*16, y:b.y+18, vx:i*20, vy:90, life:3, kind:"dust", grav:20}); ctx.spawnBullet({x:b.x, y:b.y+30, vx:0, vy:0, life:0.8, kind:"shock"}); }
        if(phase===2){ ctx.spawnBullet({x:b.x, y:b.y+10, vx:(Math.random()-0.5)*160, vy:180, life:2.5, kind:"splinter", grav:120}); }
        if(phase===3){ b.charge=0.6; for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; ctx.spawnBullet({x:b.x, y:b.y, vx:Math.cos(a)*110, vy:Math.sin(a)*110, life:1.8, kind:"dust"});} ctx.shake(3); }
      }
    }
  } else if(b.type==="gato"){
    const phase= hpPct>0.66?1: hpPct>0.33?2:3;
    b.phase=phase;
    if(b.parts.length===0 && !stunned && phase===3){ b.vulnerable=true; b.stun=Math.max(b.stun,2);}
    else if(stunned){ b.vulnerable=true; }
    else {
      b.vulnerable = phase===1? b.vulnTimer>0 : phase===2? false : false;
      b.x+=b.vx*0.7*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
      b.y=b.homeY+Math.sin(b.t*1.6)*10;
      if(b.cd<=0){
        b.cd=(phase===1?1.4: phase===2?1.3:1.8)/enraged;
        if(phase===1){ b.vy=-240; b.y+=b.vy*dt; // salto onda
          ctx.spawnBullet({x:b.x, y:b.y+20, vx:90, vy:0, life:2, kind:"shock"});
          ctx.spawnBullet({x:b.x, y:b.y+20, vx:-90, vy:0, life:2, kind:"shock"});
          b.vulnTimer=0.6; ctx.shake(4);
        } else if(phase===2){
          for(let i=0;i<3;i++) ctx.spawnBullet({x:b.x+(Math.random()-0.5)*40, y:b.y, vx:(Math.random()-0.5)*60, vy:80, life:5, kind:"hairball", grav:80});
        } else {
          // fase 3 dividirse: si tiene partes, las suelta
          if(b.parts.length>0){ /* parts already spawned as targets */ }
        }
      }
      b.vy+=500*dt; if(b.y>b.homeY+20){ b.y=b.homeY+20; b.vy=0;}
    }
  } else if(b.type==="antisam"){
    if(b.parts.length===0 && !stunned) b.stun=Math.max(b.stun,2);
    b.vulnerable=stunned || b.parts.length===0;
    b.x+=b.vx*0.6*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
    b.y=b.homeY+Math.sin(b.t*0.9)*8;
    if(b.cd<=0){
      b.cd=1.2/enraged;
      if(b.phase%2===0){ ctx.spawnBullet({x:b.x, y:b.y, vx:(Math.random()<0.5?-1:1)*80, vy:100, life:3, kind:"button", grav:140}); }
      else { ctx.spawnBullet({x:b.x, y:b.y+10, vx:0, vy:0, life:2, kind:"shock"}); /* telaraña */ b.frozen=0; }
      b.phase++;
      if(b.t>12 && !b.phase2){ b.phase2=true; b.vx*=1.4; }
    }
  } else if(b.type==="caballo"){
    const charging=b.charge>0;
    if(stunned){ b.vulnerable=true; b.charge=0; }
    else if(charging){
      b.vulnerable=false; b.charge-=dt; b.x+=(b.vx>0?1:-1)*220*enraged*dt;
      if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);b.charge=0;}
      if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);b.charge=0;}
    } else {
      b.x+=b.vx*0.8*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
      b.y=b.homeY+Math.sin(b.t*1.8)*6;
      if(b.cd<=0){
        b.cd=2.0/enraged;
        if(b.phase%3===0){ b.charge=0.9; b.telegraph=0.6; b.vx=(Math.random()<0.5?1:-1)*160; }
        else if(b.phase%3===1){ for(let i=0;i<3;i++) ctx.spawnBullet({x:b.x + (Math.random()-0.5)*30, y:b.y-30, vx:0, vy:120, life:3, kind:"wood", grav:180}); }
        else { b.vy=-280; ctx.shake(5); ctx.spawnBullet({x:b.x-40, y:b.y+20, vx:0, vy:0, life:1, kind:"shock"}); ctx.spawnBullet({x:b.x+40, y:b.y+20, vx:0, vy:0, life:1, kind:"shock"}); }
        b.phase++;
      }
      b.vy+=500*dt; if(b.y>b.homeY) {b.y=b.homeY; b.vy=0; b.vulnTimer=0.5; b.vulnerable=true; }
    }
  } else if(b.type==="fantasma"){
    b.phase = hpPct>0.5? (b.t%4<2?1:2) :3;
    const intangible = !stunned && b.t%3<1.5;
    b.vulnerable = stunned || !intangible;
    b.x+=Math.sin(b.t*0.7)*40*dt*enraged; b.y=b.homeY+Math.sin(b.t*0.8)*14;
    if(b.cd<=0){
      b.cd=1.4/enraged;
      if(intangible){ /* atraviesa paredes no colision */ }
      else {
        if(b.phase===2) ctx.spawnBullet({x:b.x, y:b.y, vx:(Math.random()-0.5)*80, vy:70, life:4, kind:"ecto", grav:10});
        if(b.phase===3){ for(let i=0;i<2;i++) ctx.spawnBullet({x:b.x+ (Math.random()-0.5)*20, y:b.y, vx:(Math.random()-0.5)*100, vy:-30, life:2, kind:"pan"}); }
      }
    }
    if(stunned) b.vulnerable=true;
    if(!intangible) b.telegraph=0;
    else b.telegraph=0.05;
  } else if(b.type==="cuchara"){
    if(stunned){ b.vulnerable=true; b.x+=Math.sin(b.t*30)*0.6; }
    else {
      const cycle=b.t%3.0;
      if(cycle>2.0){ b.telegraph=0.05; b.vulnerable=true; b.vx*=0.9; }
      else { b.vulnerable=false; b.x+=b.vx*enraged*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} }
      b.y=b.homeY+Math.sin(b.t*1.2)*10;
      if(b.cd<=0 && cycle<2.0){
        b.cd=1.8/enraged;
        const pat = b.phase%3;
        if(pat===0) ctx.spawnBullet({x:b.x, y:b.y+10, vx:0, vy:130, life:2.5, kind:"dough", grav:40});
        if(pat===1) for(let i=-1;i<=1;i++) ctx.spawnBullet({x:b.x+i*14, y:b.y, vx:i*40, vy:110, life:3, kind:"dough"});
        if(pat===2){ for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; ctx.spawnBullet({x:b.x, y:b.y, vx:Math.cos(a)*80, vy:Math.sin(a)*80, life:2, kind:"dust"});} ctx.shake(3); }
        b.phase++;
      }
    }
  } else if(b.type==="hornito"){
    if(stunned){ b.vulnerable=true; }
    else if(b.charge<=0){
      b.vulnerable=false;
      b.x+=b.vx*0.8*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
      b.y+=(b.homeY-b.y)*Math.min(1,dt*3);
      if(b.cd<=0){ b.cd=2.4/enraged; b.charge=0.7; b.x=ctx.playerX; b.telegraph=0.5; }
    } else {
      b.vulnerable=false; b.charge-=dt; b.y+=460*dt;
      if(b.y>ctx.bottom-80){ b.y=ctx.bottom-80; b.charge=0; b.vulnTimer=1.1; ctx.shake(8);
        for(let i=0;i<4;i++) ctx.spawnBullet({x:b.x+(Math.random()-0.5)*20, y:b.y, vx:(Math.random()-0.5)*60, vy:-80, life:1.8, kind:"dough", grav:120});
        ctx.spawnBullet({x:b.x, y:b.y+10, vx:140, vy:0, life:2, kind:"shock"}); ctx.spawnBullet({x:b.x, y:b.y+10, vx:-140, vy:0, life:2, kind:"shock"});
      }
    }
  } else if(b.type==="refriRey"){
    b.vulnerable=stunned || b.parts.length===0;
    if(b.parts.length===0 && b.stun<=0) b.stun=2.5;
    b.x+=b.vx*0.5*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
    b.y=b.homeY+Math.sin(b.t*0.7)*5;
    if(b.cd<=0){
      b.cd=1.2/enraged;
      const dir=b.phase%2===0?1:-1; b.phase++;
      ctx.spawnBullet({x:b.x+dir*24, y:b.y, vx:dir*170, vy:0, life:3, kind:"ice"});
      ctx.spawnBullet({x:b.x, y:b.y-10, vx:0, vy:90, life:3, kind:"ice"});
      if(b.phase%4===0) b.frozen=1.2;
    }
  } else if(b.type==="alacena"){
    b.vulnerable=stunned || b.vulnTimer>0;
    b.x+=b.vx*0.4*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
    b.y=b.homeY+Math.sin(b.t*0.6)*4;
    if(b.cd<=0){
      b.cd=1.6/enraged;
      if(b.phase%3===0){ for(let i=0;i<3;i++) ctx.spawnBullet({x:b.x+(Math.random()-0.5)*30, y:b.y, vx:(Math.random()-0.5)*90, vy:110, life:2.5, kind:"can", grav:180}); }
      else if(b.phase%3===1){ for(let i=0;i<2;i++) ctx.spawnBullet({x:b.x, y:b.y-20, vx:0, vy:90, life:3.5, kind:"book", grav:80}); }
      else { b.vulnTimer=0.9; b.telegraph=0.4; ctx.shake(3); }
      b.phase++;
    }
  } else if(b.type==="bigotesGrande"){
    if(!b.phase2 && b.hp<=b.maxHp*0.5) { b.phase2=true; b.vx=180; b.stun=0.8; ctx.shake(6); }
    const sp=(b.phase2?1.7:1)*enraged;
    if(stunned){ b.vulnerable=true; }
    else {
      const subPhase = b.hp/b.maxHp>0.75?1 : b.hp/b.maxHp>0.5?2 : b.hp/b.maxHp>0.25?3:4;
      b.phase=subPhase;
      if(subPhase===4){
        // solo parche vulnerable cuando ladra
        b.vulnerable = b.t%3 <0.6;
        b.telegraph= b.vulnerable?0.05:0;
      } else {
        const cyc=b.t%(2.6/sp);
        if(cyc<0.55){ b.vulnerable=false; b.x+=(b.vx>0?1:-1)*260*sp*dt; }
        else { b.vulnerable=true; b.x+=b.vx*0.7*dt; }
      }
      if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);}
      b.y=b.homeY+Math.sin(b.t*2)*10 + (b.phase2? Math.abs(Math.sin(b.t*4))*-18:0);
      if(b.cd<=0){
        b.cd=(b.phase2?2.0:3.0)/sp;
        for(let i=0;i<(b.phase2?10:6);i++){ const a=i/(b.phase2?10:6)*Math.PI*2; ctx.spawnBullet({x:b.x,y:b.y,vx:Math.cos(a)* (b.phase2?140:120), vy:Math.sin(a)* (b.phase2?140:120), life:1.6, kind:"bark"});}
        ctx.shake(4);
        if(subPhase===2) for(let i=0;i<2;i++) ctx.spawnMouse(b.x+(Math.random()<0.5?-40:40), b.y+40);
      }
    }
  } else if(b.type==="vacuum"){
    if(stunned){ b.vulnerable=true; b.x+=Math.sin(b.t*30)*0.6; }
    else { const cyc=b.t%3.1; if(cyc>2.2){ b.telegraph=0.05; b.vulnerable=true; b.vx*=0.85; } else { b.vulnerable=false; b.x+=b.vx*enraged*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} } b.y=b.homeY+Math.sin(b.t*1.4)*14; if(b.cd<=0 && cyc<2.2){ b.cd=2.0/enraged; for(let i=-1;i<=1;i++) ctx.spawnBullet({x:b.x+i*14,y:b.y+22,vx:i*30,vy:140,life:3,kind:"dust",grav:40}); } }
  } else if(b.type==="chef"){
    b.vulnerable=stunned||b.vulnTimer>0;
    if(!stunned){
      if(b.cd<=0){ b.cd=1.5/enraged; const anchors=[b.minX+20,(b.minX+b.maxX)/2,b.maxX-20]; const target=anchors[(b.phase+1)%3]; b.phase++; b.vx=(target-b.x)/0.45; b.vy=-200; const dx=ctx.playerX-b.x, dy=ctx.playerY-b.y; const d=Math.hypot(dx,dy)||1; ctx.spawnBullet({x:b.x,y:b.y+10,vx:(dx/d)*150,vy:(dy/d)*120-40,life:3,kind:"pan",grav:180}); }
      b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=380*dt; if(b.y>b.homeY+40){ if(b.vy>0){b.vulnTimer=0.55; ctx.shake(3);} b.y=b.homeY+40; b.vy=0; b.vx*=0.5; }
    }
  } else if(b.type==="fridge"){
    b.vulnerable=stunned||b.parts.length===0; if(b.parts.length===0 && b.stun<=0) b.stun=3; b.x+=b.vx*0.6*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} b.y=b.homeY+Math.sin(b.t*0.8)*6; if(b.cd<=0){b.cd=1.3/enraged; const dir=b.phase%2===0?1:-1; b.phase++; ctx.spawnBullet({x:b.x+dir*22,y:b.y+6,vx:dir*180,vy:0,life:3,kind:"ice"}); if(b.phase%4===0) b.frozen=1.4; }
  } else if(b.type==="oven"){
    if(stunned){ b.vulnerable=true; } else if(b.charge<=0){ b.vulnerable=false; b.x+=b.vx*0.8*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} b.y+=(b.homeY-b.y)*Math.min(1,dt*3); if(b.cd<=0){b.cd=2.4/enraged; b.charge=0.8; b.x=ctx.playerX; b.telegraph=0.5;} } else { b.vulnerable=false; b.charge-=dt; b.y+=460*dt; if(b.y>ctx.bottom-80){b.y=ctx.bottom-80; b.charge=0; b.vulnTimer=1.1; ctx.shake(8); for(let i=0;i<5;i++) ctx.spawnBullet({x:b.x+(Math.random()-0.5)*20,y:b.y+20-i*14,vx:0,vy:-30,life:1.4,kind:"flame"}); ctx.spawnBullet({x:b.x,y:b.y+20,vx:140,vy:0,life:2,kind:"shock"}); ctx.spawnBullet({x:b.x,y:b.y+20,vx:-140,vy:0,life:2,kind:"shock"}); } }
  } else if(b.type==="bread"){
    b.vulnerable=stunned||b.parts.length===0; const sp=b.parts.length===0?1.5:1; if(b.cd<=0){b.cd=(1.7/enraged)/sp; const dir=ctx.playerX>b.x?1:-1; b.vx=dir*120*sp; b.vy=-260;} b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=520*dt; if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx)*0.6;} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx)*0.6;} if(b.y>b.homeY+80){ if(b.vy>0){ctx.shake(6); for(let i=-2;i<=2;i++) ctx.spawnBullet({x:b.x,y:b.y+20,vx:i*70,vy:-120,life:2.4,kind:"crumb",grav:260}); if(b.parts.length===0) b.stun=Math.max(b.stun,0.6);} b.y=b.homeY+80; b.vy=0; b.vx*=0.5; }
  } else if(b.type==="bigotes"){
    if(!b.phase2 && b.hp<=b.maxHp*0.5){ b.phase2=true; b.vx=180; b.stun=0.8; ctx.shake(6); } const sp=(b.phase2?1.6:1)*enraged; if(stunned){b.vulnerable=true;} else { const cyc=b.t%(2.6/sp); if(cyc<0.55){b.vulnerable=false; b.x+=(b.vx>0?1:-1)*260*sp*dt;} else {b.vulnerable=true; b.x+=b.vx*0.7*dt;} if(b.x<b.minX){b.x=b.minX;b.vx=Math.abs(b.vx);} if(b.x>b.maxX){b.x=b.maxX;b.vx=-Math.abs(b.vx);} b.y=b.homeY+Math.sin(b.t*2)*10 + (b.phase2? Math.abs(Math.sin(b.t*4))*-18:0); if(b.cd<=0){b.cd=(b.phase2?2.2:3.2)/sp; for(let i=0;i<8;i++){const a=i/8*Math.PI*2; ctx.spawnBullet({x:b.x,y:b.y,vx:Math.cos(a)*130,vy:Math.sin(a)*130,life:1.6,kind:"bark"});} ctx.shake(4); if(b.phase2||Math.random()<0.6) ctx.spawnMouse(b.x+(Math.random()<0.5?-40:40),b.y+40);} }
  }
}

/* ------------------------------------------------------------------ */
export function BossView({ boss, size=110 }: { boss: Boss; size?: number }){
  const hit=boss.flash>0; const shielded=boss.shieldFlash>0;
  const filter=hit?"brightness(2.4) drop-shadow(0 0 10px #fff)": shielded?"drop-shadow(0 0 8px #ff3060)":"drop-shadow(0 6px 10px rgba(0,0,0,.5))";
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" style={{filter, overflow:"visible"}}>
      {boss.vulnerable && boss.stun<=0 && <circle cx="50" cy="50" r="46" fill="none" stroke="#7fc24a" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" style={{animation:"spin-slow 2s linear infinite", transformBox:"fill-box", transformOrigin:"center"}} />}
      {boss.stun>0 && <g fill="#ffd27a" style={{animation:"spin-slow 1s linear infinite", transformBox:"fill-box", transformOrigin:"center"}}><path d="M50 2 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"/><path d="M14 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z"/><path d="M86 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 Z"/></g>}
      {!boss.vulnerable && boss.stun<=0 && boss.type!=="bigotes" && boss.type!=="bigotesGrande" && <circle cx="50" cy="50" r="46" fill="none" stroke="#ff3060" strokeWidth="1.6" opacity={0.35 + Math.sin(boss.t*6)*0.2} />}
      {boss.telegraph>0 && <text x="50" y="-4" textAnchor="middle" fontFamily="Press Start 2P" fontSize="14" fill="#ffd27a" style={{filter:"drop-shadow(0 0 6px #ff3030)"}}>!</text>}

      {boss.type==="escoba" && <Escoba t={boss.t} charging={boss.vulnerable && boss.stun<=0} phase={boss.phase} />}
      {boss.type==="gato" && <Gato t={boss.t} phase={boss.phase} />}
      {boss.type==="antisam" && <AntiSam t={boss.t} />}
      {boss.type==="caballo" && <Caballo t={boss.t} charge={boss.charge} />}
      {boss.type==="fantasma" && <Fantasma t={boss.t} vulnerable={boss.vulnerable} />}
      {boss.type==="cuchara" && <Cuchara t={boss.t} />}
      {boss.type==="hornito" && <Hornito t={boss.t} charge={boss.charge} open={boss.vulnTimer>0} />}
      {boss.type==="refriRey" && <RefriRey t={boss.t} />}
      {boss.type==="alacena" && <Alacena t={boss.t} />}
      {boss.type==="bigotesGrande" && <BigotesGrande t={boss.t} phase2={boss.phase2} phase={boss.phase} charging={!boss.vulnerable && boss.stun<=0} />}

      {boss.type==="vacuum" && <Vacuum t={boss.t} charging={boss.vulnerable && boss.stun<=0} />}
      {boss.type==="chef" && <Chef t={boss.t} />}
      {boss.type==="fridge" && <Fridge t={boss.t} />}
      {boss.type==="oven" && <Oven t={boss.t} charge={boss.charge} open={boss.vulnTimer>0} />}
      {boss.type==="bread" && <BreadMonster t={boss.t} arms={boss.parts.length} />}
      {boss.type==="bigotes" && <Bigotes t={boss.t} phase2={boss.phase2} charging={!boss.vulnerable && boss.stun<=0} />}

      {boss.type==="pastelero" && <Pastelero t={boss.t} />}
      {boss.type==="duende" && <Duende t={boss.t} />}
      {boss.type==="reinaMigas" && <ReinaMigas t={boss.t} />}
      {boss.type==="maestroChoco" && <MaestroChoco t={boss.t} />}
      {boss.type==="espectro" && <Espectro t={boss.t} />}

      {boss.parts.map((p)=>{
        const cx=50+p.ox, cy=50+p.oy; const flash=p.flash>0;
        if(p.kind==="compressor" || p.kind==="compressorRey") return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(3)":undefined}}>
            <rect x="-7" y="-9" width="14" height="18" rx="2" fill={p.kind==="compressorRey"?"#a8cde8":"#8a9498"} stroke="#3a4044" strokeWidth="1.2"/>
            <rect x="-5" y="-7" width="10" height="3" fill="#3a4044"/><rect x="-5" y="-1" width="10" height="3" fill="#3a4044"/><rect x="-5" y="5" width="10" height="3" fill="#3a4044"/>
            <circle cx="0" cy="0" r="2" fill={p.kind==="compressorRey"?"#7fd0ff":"#ff3030"} style={{filter:"drop-shadow(0 0 3px #ff3030)"}}/>
          </g>
        );
        if(p.kind==="miniGato") return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(2)":undefined}}>
            <circle cx="0" cy="0" r="5" fill={`hsl(${p.id*50} 80% 65%)`} stroke="#3a2010" strokeWidth="0.8"/>
            <circle cx="-1.5" cy="-1" r="0.7" fill="#000"/><circle cx="1.5" cy="-1" r="0.7" fill="#000"/>
          </g>
        );
        if(p.kind==="button") return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(2)":undefined}}>
            <circle cx="0" cy="0" r="4" fill="#d44a6a" stroke="#5a1020" strokeWidth="1"/><circle cx="0" cy="0" r="1" fill="#fff"/><circle cx="1" cy="-1" r="0.5" fill="#fff"/>
          </g>
        );
        if(p.kind==="pata") return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(2)":undefined}}>
            <rect x="-5" y="-6" width="10" height="10" rx="2" fill="#8a5128" stroke="#3a2010" strokeWidth="1"/>
            <rect x="-3" y="4" width="6" height="3" fill="#5a2a0a"/>
          </g>
        );
        if(p.kind==="eye") return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(3)":undefined}}>
            <ellipse cx="0" cy="0" rx="4" ry="6" fill="#b06bff" stroke="#3a1a5a" strokeWidth="1"/><circle cx="0" cy="0" r="1.2" fill="#fff"/>
          </g>
        );
        return(
          <g key={p.id} transform={`translate(${cx} ${cy})`} style={{filter: flash?"brightness(2.4)":undefined}}>
            <path d={`M0 0 Q${p.ox<0?-14:14} -4 ${p.ox<0?-18:18} 6 Q${p.ox<0?-10:10} 12 0 8 Z`} fill="#f4d9a0" stroke="#7a4410" strokeWidth="1.4"/>
          </g>
        );
      })}
    </svg>
  );
}

function Escoba({t, charging, phase}:{t:number, charging:boolean, phase:number}){
  const wob=Math.sin(t*10)*1.5;
  return(
    <g transform={`translate(0 ${wob})`}>
      <ellipse cx="50" cy="86" rx="28" ry="4" fill="#000" opacity="0.25"/>
      <rect x="48" y="10" width="6" height="50" rx="3" fill="#7a4a1a" stroke="#3a2010" strokeWidth="1.2"/>
      <path d="M36 55 L28 75 L34 74 L32 78 L38 77 L36 82 L42 80 L40 84 L60 84 L58 80 L64 82 L62 77 L68 78 L66 74 L72 75 L64 55 Z" fill="#d9c39a" stroke="#7a5a2c" strokeWidth="1.2"/>
      <g stroke="#b8a070" strokeWidth="0.7" fill="none"><path d="M38 58 L30 76"/><path d="M44 57 L38 78"/><path d="M50 56 L50 82"/><path d="M56 57 L62 78"/><path d="M62 58 L70 76"/></g>
      <circle cx="52" cy="18" r="2.5" fill="#ff3030" opacity={charging?1:0} style={{filter:"drop-shadow(0 0 4px #ff3030)"}}/>
      <text x="50" y="12" fontFamily="Press Start 2P" fontSize="5" fill="#ffd27a" textAnchor="middle" opacity={phase}>F{phase}</text>
    </g>
  );
}
function Gato({t, phase}:{t:number, phase:number}){
  const bob=Math.sin(t*2)*2;
  return(
    <g transform={`translate(0 ${bob})`}>
      <ellipse cx="50" cy="88" rx="26" ry="4" fill="#000" opacity="0.2"/>
      <ellipse cx="50" cy="68" rx="22" ry="16" fill="#ffd27a" stroke="#7a5a2a" strokeWidth="1.2"/>
      {/* rainbow stripes on back */}
      <g opacity="0.9">
        <path d="M32 60 q18 8 36 0" stroke="#ff5a6a" strokeWidth="2" fill="none"/>
        <path d="M32 63 q18 8 36 0" stroke="#ffb347" strokeWidth="2" fill="none"/>
        <path d="M32 66 q18 8 36 0" stroke="#7fd0ff" strokeWidth="2" fill="none"/>
        <path d="M32 69 q18 8 36 0" stroke="#b06bff" strokeWidth="2" fill="none"/>
      </g>
      <circle cx="50" cy="46" r="16" fill="#fff" stroke="#3a2010" strokeWidth="1.2"/>
      <circle cx="44" cy="45" r="2" fill="#000"/><circle cx="56" cy="45" r="2" fill="#000"/>
      <path d="M46 50 q4 4 8 0" stroke="#000" strokeWidth="1" fill="none"/>
      <path d="M34 40 l-5 -6 l6 2 Z" fill="#ffb347" stroke="#7a5a2a" strokeWidth="0.8"/>
      <path d="M66 40 l5 -6 l-6 2 Z" fill="#ffb347" stroke="#7a5a2a" strokeWidth="0.8"/>
      {phase===3 && <text x="50" y="28" fontFamily="Press Start 2P" fontSize="5" fill="#ff3030" textAnchor="middle">x7</text>}
    </g>
  );
}
function AntiSam({t}:{t:number}){
  const wob=Math.sin(t*1.5)*1.5;
  return(
    <g transform={`translate(0 ${wob})`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#000" opacity="0.25"/>
      <circle cx="50" cy="48" r="20" fill="#6a3a1a" stroke="#2a1608" strokeWidth="1.4"/>
      <circle cx="50" cy="48" r="16" fill="#8a5a2c" opacity="0.6"/>
      {/* eye patch + buttons */}
      <circle cx="38" cy="44" r="5" fill="#d44a6a" stroke="#5a1020" strokeWidth="1"/><circle cx="38" cy="44" r="1.2" fill="#fff"/>
      <circle cx="62" cy="44" r="5" fill="#d44a6a" stroke="#5a1020" strokeWidth="1"/><circle cx="62" cy="44" r="1.2" fill="#fff"/>
      <path d="M50 54 q6 4 12 0" stroke="#000" strokeWidth="1.2" fill="none"/>
      <path d="M46 34 q8 3 16 0" stroke="#3a2010" strokeWidth="0.9" fill="none" strokeDasharray="2 2"/>
      <rect x="44" y="18" width="12" height="4" rx="1" fill="#3a2010"/>
    </g>
  );
}
function Caballo({t, charge}:{t:number, charge:number}){
  const bob= charge>0? -6: Math.sin(t*3)*1;
  return(
    <g transform={`translate(0 ${bob})`}>
      <ellipse cx="50" cy="88" rx="30" ry="4" fill="#000" opacity="0.25"/>
      {/* horse body wooden */}
      <path d="M20 60 Q20 44 36 44 H64 Q80 44 80 60 V68 H20 Z" fill="#8a5128" stroke="#3a2010" strokeWidth="1.4"/>
      <path d="M64 44 L76 28 L68 24 L60 36" fill="#8a5128" stroke="#3a2010" strokeWidth="1"/>
      <circle cx="72" cy="26" r="2" fill="#000"/><rect x="68" y="18" width="8" height="4" fill="#3a2010"/>
      {/* rocker */}
      <path d="M22 68 Q50 76 78 68" stroke="#5a2a0a" strokeWidth="2" fill="none"/>
      <circle cx="36" cy="56" r="1.5" fill="#fff"/><circle cx="64" cy="56" r="1.5" fill="#fff"/>
      {charge>0 && <text x="50" y="16" fontFamily="Press Start 2P" fontSize="6" fill="#ff3030" textAnchor="middle">!!!</text>}
    </g>
  );
}
function Fantasma({t, vulnerable}:{t:number, vulnerable:boolean}){
  return(
    <g opacity={vulnerable?1:0.45}>
      <path d="M30 50 Q30 32 50 32 Q70 32 70 50 Q70 70 60 74 Q54 78 50 74 Q46 78 40 74 Q30 70 30 50 Z" fill="#f4f1e6" stroke="#7a7060" strokeWidth="1.2"/>
      <circle cx="43" cy="48" r="3" fill="#000"/><circle cx="57" cy="48" r="3" fill="#000"/>
      <path d="M44 56 q6 4 12 0" stroke="#000" strokeWidth="1.2" fill="none"/>
      <g opacity="0.3"><circle cx="50" cy="60" r="1.5" fill="#7fd0ff"/></g>
      {!vulnerable && <text x="50" y="28" fontFamily="Press Start 2P" fontSize="5" fill="#7fd0ff" textAnchor="middle">INTANGIBLE</text>}
    </g>
  );
}
function Cuchara({t:_t}:{t:number}){
  const rot=Math.sin(t*1.2)*6;
  return(
    <g transform={`rotate(${rot} 50 50)`}>
      <rect x="48" y="40" width="4" height="30" rx="2" fill="#d7d2c4" stroke="#6a6555" strokeWidth="1.2"/>
      <ellipse cx="50" cy="28" rx="14" ry="18" fill="#ece7d6" stroke="#6a6555" strokeWidth="1.4"/>
      <ellipse cx="44" cy="24" rx="4" ry="6" fill="#fff" opacity="0.6"/>
    </g>
  );
}
function Hornito({t, charge:_charge, open}:{t:number, charge:number, open:boolean}){
  const glow=0.6+Math.sin(t*6)*0.3;
  return(
    <g>
      <rect x="18" y="22" width="64" height="60" rx="6" fill="#3a1a08" stroke="#1a0804" strokeWidth="2"/>
      <rect x="24" y="28" width="52" height="32" rx="3" fill="#1a0804"/>
      <rect x="28" y="32" width="44" height="24" rx="2" fill={open?"#fff3d6":`rgba(255,${80+glow*80|0},40,${0.6+glow*0.3})`} style={{filter:`drop-shadow(0 0 ${open?16:10}px ${open?"#fff":"#ff5a2a"})`}}/>
      {!open && <g className="flicker"><path d="M38 54 q-4 -10 4 -16 q0 6 0 10 q6 -4 4 10 Z" fill="#ffd27a"/><path d="M50 54 q-4 -14 4 -20 q0 8 0 10 q6 -4 4 10 Z" fill="#ff7a2a"/></g>}
      {open && <text x="50" y="46" textAnchor="middle" fontFamily="Press Start 2P" fontSize="8" fill="#ff3030">HI!</text>}
    </g>
  );
}
function RefriRey({t:_t}:{t:number}){
  return(
    <g>
      <rect x="20" y="14" width="60" height="72" rx="8" fill="#e8f4fa" stroke="#4a8aa8" strokeWidth="2"/>
      <rect x="20" y="46" width="60" height="3" fill="#4a8aa8"/>
      <rect x="70" y="24" width="4" height="16" rx="2" fill="#4a8aa8"/><rect x="70" y="54" width="4" height="16" rx="2" fill="#4a8aa8"/>
      <rect x="28" y="18" width="44" height="8" rx="2" fill="#b06bff" stroke="#3a1a5a" strokeWidth="1"/>
      <text x="50" y="24" fontFamily="Press Start 2P" fontSize="5" fill="#fff" textAnchor="middle">REY</text>
      <circle cx="38" cy="40" r="3" fill="#7fd0ff" style={{filter:"drop-shadow(0 0 4px #7fd0ff)"}}/><circle cx="62" cy="40" r="3" fill="#7fd0ff"/>
    </g>
  );
}
function Alacena({t:_t}:{t:number}){
  return(
    <g>
      <rect x="16" y="18" width="68" height="66" rx="4" fill="#6a3a10" stroke="#3a2010" strokeWidth="1.6"/>
      <rect x="18" y="20" width="30" height="62" rx="2" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1"/>
      <rect x="52" y="20" width="30" height="62" rx="2" fill="#8a5a2c" stroke="#3a2010" strokeWidth="1"/>
      <rect x="46" y="30" width="8" height="10" rx="1" fill="#c9a86a" stroke="#3a2010" strokeWidth="0.8"/>
      <rect x="24" y="30" width="18" height="10" rx="1" fill="#d7c9a0" opacity="0.6"/>
      <rect x="58" y="30" width="18" height="10" rx="1" fill="#d7c9a0" opacity="0.6"/>
      <circle cx="45" cy="50" r="1.2" fill="#ffd27a"/><circle cx="55" cy="50" r="1.2" fill="#ffd27a"/>
    </g>
  );
}
function BigotesGrande({t, phase2, phase, charging}:{t:number, phase2:boolean, phase:number, charging:boolean}){
  const lean=charging?7:Math.sin(t*4)*3;
  return(
    <g transform={`rotate(${lean} 50 60)`}>
      <ellipse cx="50" cy="90" rx="32" ry="5" fill="#000" opacity="0.35"/>
      <ellipse cx="50" cy="68" rx="26" ry="16" fill="#fff" stroke="#3a2010" strokeWidth="1.4"/>
      <ellipse cx="50" cy="42" rx="20" ry="18" fill="#fff" stroke="#3a2010" strokeWidth="1.4"/>
      <path d="M32 38 Q38 28 44 36 Q40 40 34 40 Z" fill="#7a4410"/>
      <circle cx="40" cy="40" r="6" fill="#1a1a1a"/><path d="M32 30 L48 48" stroke="#1a1a1a" strokeWidth="1.6"/>
      <circle cx="60" cy="40" r="4" fill="#fff"/><circle cx="60" cy="41" r="2" fill="#ff3030"/>
      <path d="M40 50 Q50 58 60 50 Q54 55 50 55 Q46 55 40 50 Z" fill="#3a0810"/>
      <path d="M44 50 l1 3 M48 52 l1 3 M52 52 l-1 3 M56 50 l-1 3" stroke="#fff" strokeWidth="1.2"/>
      <path d="M32 56 Q50 64 68 56 L66 64 Q50 68 34 64 Z" fill="#1a1a1a"/>
      {Array.from({length:6}).map((_,i)=><path key={i} d={`M${36+i*5.5} 56 l1 -4 l1 4 Z`} fill="#ffd27a" />)}
      <text x="50" y="14" fontFamily="Press Start 2P" fontSize="6" fill="#ffd27a" textAnchor="middle">F{phase}</text>
      {phase2 && <g fill="#ff3030" opacity="0.85" style={{animation:"flicker .3s infinite"}}><path d="M28 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z"/><path d="M72 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z"/></g>}
    </g>
  );
}

/* legacy bosses keep for bonus */
function Vacuum({ t, charging }: { t: number; charging: boolean }) {
  const wob = Math.sin(t * 8) * 2;
  return (
    <g transform={`translate(0 ${wob})`}>
      <ellipse cx="50" cy="86" rx="30" ry="5" fill="#000" opacity="0.3" />
      <path d="M18 30 Q18 18 32 18 H68 Q82 18 82 30 V62 Q82 76 68 76 H32 Q18 76 18 62 Z" fill="#d44a6a" stroke="#5a1020" strokeWidth="2" />
      <rect x="22" y="40" width="56" height="10" rx="3" fill="#7a1430" />
      {charging && <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "spin-slow .3s linear infinite" }} transform="translate(50 45)"><path d="M-6 0 q6 -6 12 0 q-6 6 -12 0" fill="none" stroke="#7fd0ff" strokeWidth="1.4" /><path d="M-10 0 q10 -10 20 0 q-10 10 -20 0" fill="none" stroke="#7fd0ff" strokeWidth="1" opacity="0.6" /></g>}
      <path d="M28 60 H72 V72 H28 Z" fill="#3a0810" />
      <g stroke="#7fd0ff" strokeWidth="1.4" opacity="0.7"><path d="M36 72 q-2 6 0 12" fill="none" className="flicker" /><path d="M50 72 q0 6 0 12" fill="none" className="flicker" /><path d="M64 72 q2 6 0 12" fill="none" className="flicker" /></g>
      <circle cx="38" cy="30" r="4" fill="#fff" /><circle cx="62" cy="30" r="4" fill="#fff" />
      <circle cx={charging ? 38 : 39} cy="31" r="2" fill="#1a0a04" /><circle cx={charging ? 62 : 63} cy="31" r="2" fill="#1a0a04" />
      <path d="M42 36 q8 4 16 0" stroke="#1a0a04" strokeWidth="1.4" fill="none" />
    </g>
  );
}
function Chef({ t }: { t: number }) {
  const float = Math.sin(t * 2) * 3;
  return (
    <g transform={`translate(0 ${float})`} opacity="0.92">
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#000" opacity="0.25" />
      <path d="M28 50 Q22 78 36 84 Q50 90 64 84 Q78 78 72 50 Z" fill="#f4f1e6" opacity="0.85" stroke="#7a7060" strokeWidth="1.4" />
      <circle cx="50" cy="38" r="18" fill="#f4f1e6" opacity="0.9" stroke="#7a7060" strokeWidth="1.4" />
      <path d="M32 30 Q30 14 42 14 Q46 8 54 12 Q64 8 68 18 Q74 22 68 30 Z" fill="#fff" stroke="#7a7060" strokeWidth="1.2" />
      <circle cx="44" cy="38" r="3" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)" }} />
      <circle cx="56" cy="38" r="3" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)" }} />
      <path d="M42 46 q8 6 16 0" stroke="#3a1a08" strokeWidth="1.6" fill="none" />
      <path d="M42 44 q4 2 8 0 q4 2 8 0" stroke="#d7d2c4" strokeWidth="2" fill="none" />
    </g>
  );
}
function Fridge({ t }: { t: number }) {
  return (
    <g>
      <rect x="22" y="14" width="56" height="72" rx="6" fill="#e8f4fa" stroke="#4a8aa8" strokeWidth="2" />
      <rect x="22" y="46" width="56" height="3" fill="#4a8aa8" />
      <rect x="68" y="24" width="3" height="14" rx="1.5" fill="#4a8aa8" /><rect x="68" y="54" width="3" height="14" rx="1.5" fill="#4a8aa8" />
      <circle cx="40" cy="30" r="4" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)", animation: `flicker ${0.4 + Math.sin(t) * 0.2}s infinite` }} />
      <circle cx="60" cy="30" r="4" fill="#ff3030" style={{ filter: "drop-shadow(0 0 4px #ff3030)", animation: `flicker ${0.4 + Math.cos(t) * 0.2}s infinite` }} />
      <path d="M38 38 l4 4 l4 -4 l4 4 l4 -4 l4 4" stroke="#3a1a08" strokeWidth="1.8" fill="none" />
    </g>
  );
}
function Oven({ t, charge, open }: { t: number; charge: number; open: boolean }) {
  const glow = 0.6 + Math.sin(t * 6) * 0.3;
  return (
    <g>
      <rect x="16" y="18" width="68" height="66" rx="6" fill="#3a1a08" stroke="#1a0804" strokeWidth="2" />
      <rect x="22" y="24" width="56" height="36" rx="3" fill="#1a0804" />
      <rect x="26" y="28" width="48" height="28" rx="2" fill={open ? "#fff3d6" : `rgba(255,${80 + glow * 80 | 0},40,${0.6 + glow * 0.3})`} style={{ filter: `drop-shadow(0 0 ${open ? 16 : 10}px ${open ? "#fff" : "#ff5a2a"})` }} />
      {!open && <g className="flicker" style={{ transformOrigin: "50px 42px" }}><path d="M36 54 q-4 -14 4 -20 q2 8 0 12 q6 -4 4 8 Z" fill="#ffd27a" /><path d="M50 54 q-4 -18 4 -24 q2 10 0 14 q6 -4 4 10 Z" fill="#ff7a2a" /><path d="M64 54 q-4 -14 4 -20 q2 8 0 12 q6 -4 4 8 Z" fill="#ffd27a" /></g>}
      {open && <text x="50" y="46" textAnchor="middle" fontFamily="Press Start 2P" fontSize="10" fill="#ff3030">ABIERTO</text>}
      <circle cx="30" cy="70" r="3" fill="#d7d2c4" /><circle cx="42" cy="70" r="3" fill="#d7d2c4" />
      {charge > 0 && <g stroke="#fff" strokeWidth="1.6" fill="none"><path d="M28 40 q4 -4 8 0" /><path d="M64 40 q4 -4 8 0" /></g>}
    </g>
  );
}
function BreadMonster({ t, arms }: { t: number; arms: number }) {
  const squish = 1 + Math.sin(t * 4) * 0.05;
  return (
    <g transform={`translate(50 50) scale(${1 / squish} ${squish}) translate(-50 -50)`}>
      <ellipse cx="50" cy="88" rx="32" ry="5" fill="#000" opacity="0.3" />
      <path d="M16 48 Q16 22 50 22 Q84 22 84 48 Q86 72 70 78 Q50 84 30 78 Q14 72 16 48 Z" fill="#d99243" stroke="#5a2810" strokeWidth="2" />
      <path d="M24 40 Q50 28 76 40" stroke="#f4c389" strokeWidth="4" fill="none" />
      <circle cx="38" cy="48" r="5" fill="#fff" /><circle cx="62" cy="48" r="5" fill="#fff" />
      <circle cx="39" cy="49" r="2.4" fill="#7a1410" /><circle cx="63" cy="49" r="2.4" fill="#7a1410" />
      <path d="M34 62 Q50 74 66 62 Q62 70 50 70 Q38 70 34 62 Z" fill="#3a0810" />
      <path d="M40 64 l2 4 M48 66 l2 4 M56 66 l2 4 M62 64 l-2 4" stroke="#fff" strokeWidth="1.2" />
      {arms === 0 && <text x="50" y="14" textAnchor="middle" fontFamily="Press Start 2P" fontSize="7" fill="#ff3030">SIN BRAZOS</text>}
    </g>
  );
}
function Bigotes({ t, phase2, charging }: { t: number; phase2: boolean; charging: boolean }) {
  const lean = charging ? 6 : Math.sin(t * 4) * 2;
  return (
    <g transform={`rotate(${lean} 50 60)`}>
      <ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity="0.35" />
      <ellipse cx="50" cy="68" rx="22" ry="14" fill="#fff" stroke="#3a2010" strokeWidth="1.4" />
      <path d="M34 60 Q40 56 46 62 Q42 70 34 70 Z" fill="#7a4410" />
      <path d="M62 64 Q70 62 72 72 Q64 74 60 70 Z" fill="#7a4410" />
      <ellipse cx="50" cy="42" rx="18" ry="16" fill="#fff" stroke="#3a2010" strokeWidth="1.4" />
      <path d="M34 34 Q42 26 50 32 Q46 38 36 40 Z" fill="#7a4410" />
      <path d="M34 30 Q28 22 30 36 Q36 36 38 32 Z" fill="#7a4410" stroke="#3a2010" strokeWidth="0.8" />
      <path d="M66 30 Q72 22 70 36 Q64 36 62 32 Z" fill="#fff" stroke="#3a2010" strokeWidth="0.8" />
      <circle cx="42" cy="40" r="5" fill="#1a1a1a" />
      <path d="M34 30 L50 48" stroke="#1a1a1a" strokeWidth="1.4" />
      <circle cx="58" cy="40" r="3" fill="#fff" /><circle cx="58" cy="41" r="1.6" fill="#ff3030" />
      <path d="M54 32 l4 8" stroke="#d44a6a" strokeWidth="1.2" />
      <path d="M53 34 l2 0 M55 38 l2 0" stroke="#d44a6a" strokeWidth="0.8" />
      <path d="M42 50 Q50 56 58 50 Q54 54 50 54 Q46 54 42 50 Z" fill="#3a0810" />
      <path d="M44 50 l1 3 M48 51 l1 3 M52 51 l-1 3 M56 50 l-1 3" stroke="#fff" strokeWidth="1" />
      <ellipse cx="50" cy="46" rx="3" ry="2" fill="#1a0e08" />
      <path d="M34 56 Q50 62 66 56 L64 62 Q50 66 36 62 Z" fill="#1a1a1a" />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${38 + i * 5} 56 l1 -3 l1 3 Z`} fill="#d7d2c4" />)}
      <path d="M70 66 Q82 58 80 44" stroke="#7a4410" strokeWidth="4" fill="none" strokeLinecap="round" />
      {phase2 && <g fill="#ff3030" opacity="0.8" style={{ animation: "flicker .3s infinite" }}><path d="M30 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /><path d="M70 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" /></g>}
      {charging && <text x="50" y="6" textAnchor="middle" fontFamily="Press Start 2P" fontSize="10" fill="#ff3030" style={{ filter: "drop-shadow(0 0 6px #ff3030)" }}>GRR</text>}
    </g>
  );
}
function Pastelero({t:_t}:{t:number}){ return <g><ellipse cx="50" cy="88" rx="24" ry="4" fill="#000" opacity="0.2"/><rect x="26" y="36" width="48" height="32" rx="6" fill="#ffd27a" stroke="#7a4a1a" strokeWidth="1.2"/><circle cx="50" cy="28" r="10" fill="#ff8fa0" stroke="#7a1430" strokeWidth="1"/><circle cx="46" cy="26" r="1" fill="#000"/><circle cx="54" cy="26" r="1" fill="#000"/></g>;}
function Duende({t:_t}:{t:number}){ return <g><circle cx="50" cy="44" r="14" fill="#7fc24a" stroke="#2a5a10" strokeWidth="1.2"/><rect x="44" y="30" width="12" height="8" rx="2" fill="#d44a6a"/><circle cx="46" cy="44" r="2" fill="#000"/><circle cx="54" cy="44" r="2" fill="#000"/></g>;}
function ReinaMigas({t:_t}:{t:number}){ return <g><ellipse cx="50" cy="88" rx="22" ry="4" fill="#000" opacity="0.2"/><ellipse cx="50" cy="58" rx="18" ry="12" fill="#5a2a0a" stroke="#1a0c04" strokeWidth="1"/><circle cx="50" cy="38" r="10" fill="#ffd27a" stroke="#7a4a1a" strokeWidth="1"/><path d="M44 56 q6 4 12 0" stroke="#000" strokeWidth="1" fill="none"/></g>;}
function MaestroChoco({t:_t}:{t:number}){ return <g><rect x="28" y="36" width="44" height="30" rx="4" fill="#5a2a0a" stroke="#1a0c04" strokeWidth="1.2"/><rect x="32" y="20" width="36" height="18" rx="3" fill="#fff" stroke="#1a0c04" strokeWidth="1"/><circle cx="46" cy="28" r="1.2" fill="#000"/><circle cx="54" cy="28" r="1.2" fill="#000"/></g>;}
function Espectro({t:_t}:{t:number}){ return <g opacity="0.85"><path d="M30 50 Q30 30 50 30 Q70 30 70 50 Q70 70 60 74 Q50 78 40 74 Q30 70 30 50 Z" fill="#d8f4ff" stroke="#4a8aa8" strokeWidth="1"/><circle cx="44" cy="48" r="2" fill="#4a8aa8"/><circle cx="56" cy="48" r="2" fill="#4a8aa8"/><path d="M46 56 q4 3 8 0" stroke="#4a8aa8" strokeWidth="1" fill="none"/></g>;}

export function BulletView({ b }: { b: Bullet }) {
  if (b.kind === "dust") return <div className="absolute rounded-full" style={{ left: b.x - 5, top: b.y - 5, width: 10, height: 10, background: "radial-gradient(circle,#d9c39a,#7a5a2c)", boxShadow: "0 0 6px #d9c39a88" }} />;
  if (b.kind === "pan" || b.kind === "panback") return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: "absolute", left: b.x - 11, top: b.y - 11, animation: "spin-slow .4s linear infinite", filter: b.kind === "panback" ? "drop-shadow(0 0 6px #7fc24a)" : undefined }}>
      <circle cx="10" cy="12" r="7" fill={b.kind === "panback" ? "#7fc24a" : "#3a3a3a"} stroke="#1a1a1a" strokeWidth="1.2" />
      <rect x="15" y="10" width="8" height="3" rx="1.5" fill="#5a3a1a" />
      <circle cx="8" cy="10" r="1.5" fill="#fff" opacity="0.5" />
    </svg>
  );
  if (b.kind === "ice") return <div className="absolute" style={{ left: b.x - 7, top: b.y - 7, width: 14, height: 14, background: "linear-gradient(135deg,#d8f4ff,#7fd0ff)", border: "1px solid #4a8aa8", transform: "rotate(45deg)", boxShadow: "0 0 8px #7fd0ff88" }} />;
  if (b.kind === "flame" || b.kind === "dough") return <div className="absolute rounded-full flicker" style={{ left: b.x - 8, top: b.y - 8, width: 16, height: 16, background: b.kind==="dough"?"radial-gradient(circle,#ffe4b0,#d99243 70%,transparent)":"radial-gradient(circle,#ffd27a,#ff5a2a 70%,transparent)", transformOrigin: "center" }} />;
  if (b.kind === "crumb" || b.kind === "can") return <div className="absolute rounded-sm" style={{ left: b.x - 4, top: b.y - 4, width: 8, height: 8, background: b.kind==="can"?"#d7d2c4":"#d99243", border: "1px solid #5a2810" }} />;
  if (b.kind === "bark") return <div className="absolute rounded-full" style={{ left: b.x - 5, top: b.y - 5, width: 10, height: 10, background: "radial-gradient(circle,#fff,#ff8fa0 70%,transparent)", boxShadow: "0 0 8px #ff8fa0" }} />;
  if (b.kind === "splinter") return <div className="absolute" style={{ left: b.x - 6, top: b.y - 2, width: 12, height: 4, background: "#8a5a2c", border: "1px solid #3a2010", transform: `rotate(${b.vx}deg)` }} />;
  if (b.kind === "hairball") return <div className="absolute rounded-full" style={{ left: b.x - 7, top: b.y - 7, width: 14, height: 14, background: "radial-gradient(circle,#ff9ec4,#d65a88)", border: "1px solid #b02a66" }} />;
  if (b.kind === "button") return <div className="absolute rounded-full" style={{ left: b.x - 6, top: b.y - 6, width: 12, height: 12, background: "#d44a6a", border: "2px solid #5a1020", boxShadow: "inset 0 2px 0 #fff" }} />;
  if (b.kind === "wood") return <div className="absolute" style={{ left: b.x - 8, top: b.y - 6, width: 16, height: 12, background: "#8a5a2c", border: "1px solid #3a2010", borderRadius: 2 }} />;
  if (b.kind === "ecto") return <div className="absolute rounded-full" style={{ left: b.x - 6, top: b.y - 6, width: 12, height: 12, background: "radial-gradient(circle,#d8f4ff88,#7fd0ff33)", border: "1px solid #7fd0ff", boxShadow: "0 0 8px #7fd0ff" }} />;
  if (b.kind === "book") return <div className="absolute" style={{ left: b.x - 8, top: b.y - 10, width: 16, height: 20, background: "#5a3a10", border: "1px solid #1a0c04", borderRadius: 1 }} />;
  if (b.kind === "shock") return <div className="absolute rounded-full" style={{ left: b.x - 8, top: b.y - 8, width: 16, height: 16, background: "radial-gradient(circle,#fff3d6aa,#ffb34733)", border: "1px solid #ffb347" }} />;
  return <div className="absolute rounded-full" style={{ left: b.x - 6, top: b.y - 6, width: 12, height: 12, background: "radial-gradient(circle,#fff3d6,#d99243)", boxShadow: "0 0 10px #ffd27a" }} />;
}
