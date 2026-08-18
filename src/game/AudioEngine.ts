// Motor de audio sintético — Web Audio API, sin archivos externos

let ctx: AudioContext | null = null;
let ambientTimer = 0;
let bossTimer = 0;
let ambientOn = false;
let bossOn = false;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

function playTone(freq: number, type: OscillatorType = "sine", duration = 0.15, gainVal = 0.1) {
  try {
    const c = getCtx();
    if (c.state === "suspended") void c.resume();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    osc.connect(g);
    g.connect(c.destination);
    g.gain.setValueAtTime(gainVal, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch { /* silencio */ }
}

export function playJump() { playTone(520, "triangle", 0.12, 0.08); }
export function playJumpBoost() { playTone(880, "sine", 0.2, 0.1); playTone(1320, "sine", 0.15, 0.06); }
export function playWallClimb() { playTone(660, "square", 0.1, 0.06); }
export function playHurt() { playTone(120, "sawtooth", 0.3, 0.1); playTone(80, "sawtooth", 0.2, 0.08); }
export function playBread() { playTone(780, "sine", 0.08, 0.08); playTone(1040, "sine", 0.08, 0.06); }
export function playPowerBoost() { playTone(440, "triangle", 0.1, 0.08); setTimeout(() => playTone(880, "triangle", 0.15, 0.08), 80); }
export function playAttack() { playTone(300, "square", 0.1, 0.1); }
export function playDig() { playTone(220, "sine", 0.12, 0.08); }
export function playBossDefeat() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => playTone(f, "triangle", 0.3, 0.12), i * 120)); }
export function playRest() { [440, 554, 659, 880, 1046].forEach((f, i) => setTimeout(() => playTone(f, "sine", 0.25, 0.1), i * 150)); }

export function startAmbientMusic() {
  try {
    const c = getCtx();
    if (ambientOn) return;
    ambientOn = true;
    const notes = [330, 392, 494, 330, 392, 494, 392, 494, 587, 330];
    let i = 0;
    const loop = () => {
      if (!ambientOn || !c) return;
      playTone(notes[i % notes.length], "triangle", 0.4, 0.04);
      i++;
      ambientTimer = window.setTimeout(loop, 620);
    };
    loop();
  } catch { /* */ }
}

export function stopAmbientMusic() {
  ambientOn = false;
  if (ambientTimer) window.clearTimeout(ambientTimer);
}

interface Theme { notes: number[]; gap: number; wave: OscillatorType; gain: number; }

const BOSS_THEME: Record<string, Theme> = {
  escoba: { notes: [196, 247, 220, 165, 196, 247, 294, 220], gap: 280, wave: "square", gain: 0.045 },
  gato: { notes: [523, 659, 784, 659, 587, 698, 880, 698], gap: 220, wave: "triangle", gain: 0.05 },
  antisam: { notes: [155, 185, 208, 155, 233, 185], gap: 300, wave: "sawtooth", gain: 0.035 },
  caballo: { notes: [392, 440, 349, 392, 494, 440], gap: 260, wave: "triangle", gain: 0.05 },
  fantasma: { notes: [311, 370, 415, 277, 311, 466], gap: 340, wave: "sine", gain: 0.055 },
  cuchara: { notes: [262, 330, 294, 220, 262, 349], gap: 250, wave: "square", gain: 0.04 },
  hornito: { notes: [175, 208, 233, 175, 277, 233, 311], gap: 240, wave: "sawtooth", gain: 0.04 },
  refriRey: { notes: [523, 494, 440, 392, 349, 330, 392], gap: 300, wave: "sine", gain: 0.05 },
  alacena: { notes: [220, 247, 262, 196, 220, 294], gap: 270, wave: "triangle", gain: 0.045 },
  bigotesGrande: { notes: [110, 131, 147, 110, 165, 147, 196, 110], gap: 200, wave: "square", gain: 0.055 },
  bigotes: { notes: [110, 131, 147, 110, 165, 147, 196, 110], gap: 200, wave: "square", gain: 0.055 },
};

export function startBossTheme(type: string) {
  stopAmbientMusic();
  stopBossTheme();
  try {
    getCtx();
    const th = BOSS_THEME[type] ?? BOSS_THEME.escoba;
    bossOn = true;
    let i = 0;
    const loop = () => {
      if (!bossOn) return;
      playTone(th.notes[i % th.notes.length], th.wave, th.gap / 1000 + 0.08, th.gain);
      if (i % 4 === 0) playTone(th.notes[0] / 2, "triangle", 0.35, th.gain * 0.6);
      i++;
      bossTimer = window.setTimeout(loop, th.gap);
    };
    loop();
  } catch { /* */ }
}

export function stopBossTheme() {
  bossOn = false;
  if (bossTimer) window.clearTimeout(bossTimer);
}
