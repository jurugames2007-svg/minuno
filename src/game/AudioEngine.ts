// Motor de audio — secuenciador por capas, frases A/B y rellenos.
// Sin archivos externos. La música cambia de sección cada 8 compases.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let noise: AudioBuffer | null = null;

let musicOn = false;
let schedTimer = 0;
let nextNote = 0;
let step = 0;
let bar = 0;
let tune: Tune | null = null;
let lastType = "";

interface Tune {
  bpm: number;
  root: number;
  scale: number[];
  lead: OscillatorType;
  bass: OscillatorType;
  drums: number;
  swing: number;
  phrases: number[][];
}

function ac(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.22;
    musicGain.connect(master);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.28;
    sfxGain.connect(master);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noise = buf;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function midi(n: number) { return 440 * Math.pow(2, (n - 69) / 12); }

function envGain(t: number, peak: number, a: number, r: number, dest: AudioNode) {
  const c = ac();
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
  g.connect(dest);
  return g;
}

function oscAt(t: number, freq: number, type: OscillatorType, peak: number, dur: number, dest: AudioNode) {
  const c = ac();
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  const g = envGain(t, peak, 0.01, dur, dest);
  o.connect(g);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function kick(t: number, gain: number) {
  const c = ac();
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(148, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  const g = envGain(t, gain, 0.004, 0.18, musicGain!);
  o.connect(g);
  o.start(t);
  o.stop(t + 0.22);
}

function hat(t: number, gain: number, open = false) {
  const c = ac();
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = open ? 6000 : 9000;
  src.connect(f);
  const g = envGain(t, gain, 0.001, open ? 0.12 : 0.04, musicGain!);
  f.connect(g);
  src.start(t);
  src.stop(t + (open ? 0.14 : 0.05));
}

function snare(t: number, gain: number) {
  const c = ac();
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1800;
  src.connect(f);
  const g = envGain(t, gain, 0.002, 0.12, musicGain!);
  f.connect(g);
  src.start(t);
  src.stop(t + 0.14);
  oscAt(t, 180, "triangle", gain * 0.35, 0.08, musicGain!);
}

function pad(t: number, freq: number, gain: number, dur: number) {
  oscAt(t, freq, "sine", gain, dur, musicGain!);
  oscAt(t, freq * 1.498, "sine", gain * 0.45, dur, musicGain!);
}

const AMBIENT: Tune = {
  bpm: 86,
  root: 57,
  scale: [0, 2, 3, 5, 7, 9, 10],
  lead: "triangle",
  bass: "sine",
  drums: 0.35,
  swing: 0.04,
  phrases: [
    [0, 2, 4, 2, 5, 4, 2, 0],
    [4, 5, 7, 5, 4, 2, 0, 2],
    [7, 5, 4, 2, 4, 0, 2, 4],
    [0, 4, 7, 4, 5, 2, 4, 0],
  ],
};

const TUNES: Record<string, Tune> = {
  escoba: { bpm: 108, root: 50, scale: [0, 2, 3, 5, 7, 8, 10], lead: "square", bass: "triangle", drums: 0.7, swing: 0.06, phrases: [[0, 3, 5, 3, 7, 5, 3, 0], [7, 5, 3, 2, 0, 3, 5, 3], [0, 0, 3, 5, 7, 10, 7, 5]] },
  vacuum: { bpm: 134, root: 47, scale: [0, 1, 3, 5, 7, 8, 10], lead: "sawtooth", bass: "square", drums: 0.85, swing: 0.02, phrases: [[0, 1, 3, 5, 3, 1, 0, 7], [5, 3, 1, 0, 8, 7, 5, 3]] },
  chef: { bpm: 98, root: 55, scale: [0, 2, 3, 5, 7, 9, 10], lead: "triangle", bass: "sine", drums: 0.55, swing: 0.08, phrases: [[0, 2, 4, 7, 5, 4, 2, 0], [7, 9, 7, 5, 4, 2, 4, 0]] },
  caballo: { bpm: 122, root: 62, scale: [0, 2, 4, 5, 7, 9, 10], lead: "square", bass: "triangle", drums: 0.8, swing: 0.1, phrases: [[0, 4, 5, 7, 5, 4, 2, 0], [7, 5, 4, 2, 4, 5, 7, 4]] },
  alacena: { bpm: 100, root: 53, scale: [0, 2, 4, 5, 7, 9, 11], lead: "triangle", bass: "sine", drums: 0.5, swing: 0.05, phrases: [[0, 4, 7, 4, 5, 2, 0, 4], [7, 11, 9, 7, 5, 4, 2, 0]] },
  espectro: { bpm: 84, root: 51, scale: [0, 2, 4, 6, 8, 10], lead: "sine", bass: "sine", drums: 0.25, swing: 0, phrases: [[0, 2, 4, 6, 4, 2, 0, 8], [6, 4, 2, 0, 10, 8, 6, 4]] },
  fantasma: { bpm: 90, root: 48, scale: [0, 2, 3, 5, 7, 8, 10], lead: "sine", bass: "triangle", drums: 0.4, swing: 0.03, phrases: [[0, 3, 7, 8, 7, 3, 0, 5], [10, 8, 7, 5, 3, 0, 3, 7]] },
  cuchara: { bpm: 112, root: 57, scale: [0, 2, 4, 5, 7, 9, 10], lead: "square", bass: "triangle", drums: 0.65, swing: 0.07, phrases: [[0, 2, 4, 2, 5, 4, 0, 2], [4, 7, 5, 4, 2, 0, 4, 2]] },
  gato: { bpm: 128, root: 64, scale: [0, 2, 4, 7, 9], lead: "triangle", bass: "sine", drums: 0.7, swing: 0.04, phrases: [[0, 2, 4, 7, 4, 2, 0, 4], [7, 9, 7, 4, 2, 0, 2, 4]] },
  pastelero: { bpm: 142, root: 60, scale: [0, 2, 4, 5, 7, 9, 11], lead: "square", bass: "sawtooth", drums: 0.9, swing: 0.02, phrases: [[0, 4, 7, 4, 5, 2, 0, 7], [11, 9, 7, 5, 4, 2, 0, 4]] },
  duende: { bpm: 118, root: 59, scale: [0, 2, 3, 5, 7, 8, 10], lead: "triangle", bass: "triangle", drums: 0.6, swing: 0.09, phrases: [[0, 3, 5, 7, 5, 3, 2, 0], [7, 8, 7, 5, 3, 0, 5, 3]] },
  reinaMigas: { bpm: 104, root: 52, scale: [0, 2, 4, 5, 7, 9, 10], lead: "square", bass: "sine", drums: 0.55, swing: 0.05, phrases: [[0, 4, 5, 4, 7, 5, 4, 0], [5, 7, 9, 7, 5, 4, 2, 0]] },
  oven: { bpm: 136, root: 50, scale: [0, 2, 3, 5, 7, 8, 10], lead: "sawtooth", bass: "square", drums: 0.85, swing: 0.03, phrases: [[0, 3, 5, 7, 5, 3, 0, 8], [7, 5, 3, 2, 0, 3, 5, 7]] },
  maestroChoco: { bpm: 110, root: 56, scale: [0, 2, 4, 5, 7, 9, 11], lead: "triangle", bass: "sine", drums: 0.6, swing: 0.06, phrases: [[0, 4, 7, 11, 9, 7, 4, 0], [4, 5, 7, 5, 4, 2, 0, 4]] },
  hornito: { bpm: 102, root: 49, scale: [0, 3, 5, 7, 10], lead: "sawtooth", bass: "triangle", drums: 0.7, swing: 0.04, phrases: [[0, 3, 5, 7, 5, 3, 0, 10], [7, 5, 3, 0, 10, 7, 5, 3]] },
  fridge: { bpm: 94, root: 54, scale: [0, 2, 3, 5, 7, 8, 10], lead: "sine", bass: "sine", drums: 0.45, swing: 0.02, phrases: [[0, 3, 5, 7, 8, 7, 5, 0], [10, 8, 7, 5, 3, 2, 0, 3]] },
  bread: { bpm: 108, root: 58, scale: [0, 2, 4, 5, 7, 9, 10], lead: "triangle", bass: "triangle", drums: 0.6, swing: 0.08, phrases: [[0, 2, 4, 5, 4, 2, 0, 4], [7, 5, 4, 2, 0, 2, 4, 0]] },
  antisam: { bpm: 100, root: 46, scale: [0, 1, 3, 5, 7, 8, 10], lead: "square", bass: "sawtooth", drums: 0.75, swing: 0.05, phrases: [[0, 1, 3, 5, 3, 1, 0, 7], [8, 7, 5, 3, 1, 0, 3, 5]] },
  refriRey: { bpm: 96, root: 51, scale: [0, 2, 3, 5, 7, 8, 10], lead: "sine", bass: "triangle", drums: 0.5, swing: 0.03, phrases: [[0, 3, 7, 8, 7, 5, 3, 0], [10, 8, 7, 5, 3, 0, 5, 7]] },
  bigotes: { bpm: 148, root: 43, scale: [0, 1, 3, 5, 6, 8, 10], lead: "square", bass: "sawtooth", drums: 1, swing: 0.01, phrases: [[0, 1, 3, 0, 5, 3, 1, 0], [6, 5, 3, 1, 0, 8, 6, 5], [0, 3, 6, 10, 8, 6, 3, 0]] },
  bigotesGrande: { bpm: 148, root: 43, scale: [0, 1, 3, 5, 6, 8, 10], lead: "square", bass: "sawtooth", drums: 1, swing: 0.01, phrases: [[0, 1, 3, 0, 5, 3, 1, 0], [6, 5, 3, 1, 0, 8, 6, 5], [0, 3, 6, 10, 8, 6, 3, 0]] },
};

function degree(deg: number) {
  const sc = (tune ?? AMBIENT).scale;
  const oct = Math.floor(deg / sc.length);
  const i = ((deg % sc.length) + sc.length) % sc.length;
  return (tune ?? AMBIENT).root + sc[i] + oct * 12;
}

function scheduleNote() {
  if (!musicOn || !ctx || !musicGain) return;
  const t = nextNote;
  const s = step % 16;
  const tn = tune ?? AMBIENT;
  const phrase = tn.phrases[Math.floor(bar / 8) % tn.phrases.length];
  const fill = bar % 8 === 7;
  const drop = bar % 16 === 15;
  const swing = (s % 2 === 1) ? tn.swing * (60 / tn.bpm / 4) : 0;
  const ht = t + swing;
  const d = tn.drums * (drop ? 0.25 : 1);

  if (s === 0 || s === 8) kick(ht, 0.22 * d);
  if (fill && (s === 4 || s === 6 || s === 12 || s === 14)) kick(ht, 0.12 * d);
  if (s === 4 || s === 12) snare(ht, 0.14 * d);
  if (fill && s % 2 === 0) snare(ht, 0.06 * d);
  if (s % 2 === 0) hat(ht, (s % 4 === 2 ? 0.045 : 0.03) * Math.max(0.4, d), fill && s % 4 === 2);
  if (drop && s % 4 === 0) hat(ht, 0.02, true);

  if (s === 0 || s === 8) {
    const rootDeg = phrase[0];
    oscAt(ht, midi(degree(rootDeg) - 12), tn.bass, 0.16, 0.42, musicGain);
  } else if (s === 4 || s === 12) {
    oscAt(ht, midi(degree(phrase[2] ?? 0) - 12), tn.bass, 0.12, 0.28, musicGain);
  }

  if (s === 0) pad(ht, midi(degree(phrase[0])), 0.045, 1.6);

  const leadStep = Math.floor(s / 2);
  if (s % 2 === 0 && !drop) {
    const rest = (bar + leadStep) % 11 === 4;
    if (!rest) {
      const deg = phrase[leadStep % phrase.length];
      const oct = (bar % 8 >= 4 && leadStep % 3 === 0) ? 12 : 0;
      oscAt(ht, midi(degree(deg) + oct), tn.lead, 0.09, 0.18, musicGain);
    }
  }

  step++;
  if (step % 16 === 0) bar++;
  nextNote += 60 / tn.bpm / 4;
}

function pump() {
  if (!musicOn || !ctx) return;
  while (nextNote < ctx.currentTime + 0.14) scheduleNote();
  schedTimer = window.setTimeout(pump, 40);
}

function startTune(next: Tune, key: string) {
  ac();
  if (musicOn && lastType === key) return;
  stopMusic();
  tune = next;
  lastType = key;
  musicOn = true;
  step = 0;
  bar = 0;
  nextNote = ac().currentTime + 0.05;
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(ac().currentTime);
    musicGain.gain.setValueAtTime(0.001, ac().currentTime);
    musicGain.gain.exponentialRampToValueAtTime(0.22, ac().currentTime + 0.4);
  }
  pump();
}

function stopMusic() {
  musicOn = false;
  lastType = "";
  if (schedTimer) window.clearTimeout(schedTimer);
  schedTimer = 0;
}

export function startAmbientMusic() {
  startTune(AMBIENT, "ambient");
}

export function stopAmbientMusic() {
  if (lastType === "ambient") stopMusic();
}

export function startBossTheme(type: string) {
  startTune(TUNES[type] ?? TUNES.escoba, `boss:${type}`);
}

export function stopBossTheme() {
  if (lastType.startsWith("boss:")) stopMusic();
}

function sfxOsc(freq: number, type: OscillatorType, dur: number, gainVal: number, slide?: number) {
  try {
    const c = ac();
    if (!sfxGain) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    const g = envGain(t, gainVal, 0.008, dur, sfxGain);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.04);
  } catch { /* silencio */ }
}

export function playJump() { sfxOsc(520, "triangle", 0.1, 0.12, 780); }
export function playJumpBoost() { sfxOsc(660, "sine", 0.14, 0.12, 1180); }
export function playWallClimb() { sfxOsc(640, "square", 0.08, 0.07); }
export function playHurt() { sfxOsc(140, "sawtooth", 0.22, 0.14, 70); }
export function playBread() { sfxOsc(780, "sine", 0.08, 0.1); sfxOsc(1040, "sine", 0.1, 0.07); }
export function playPowerBoost() { sfxOsc(440, "triangle", 0.1, 0.1, 880); }
export function playAttack() { sfxOsc(280, "square", 0.08, 0.1, 180); }
export function playDig() { sfxOsc(200, "sine", 0.1, 0.08, 140); }
export function playBossDefeat() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => sfxOsc(f, "triangle", 0.28, 0.14), i * 110)); }
export function playRest() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => sfxOsc(f, "sine", 0.22, 0.1), i * 130)); }
export function playHit() { sfxOsc(660, "square", 0.07, 0.1, 990); }
export function playMiss() { sfxOsc(180, "sawtooth", 0.12, 0.08, 90); }
export function playCombo() { sfxOsc(880, "triangle", 0.1, 0.1, 1320); }
export function playKo() { [392, 523, 659, 784].forEach((f, i) => setTimeout(() => sfxOsc(f, "triangle", 0.24, 0.13), i * 90)); }
export function playPhase() { sfxOsc(220, "square", 0.18, 0.12, 440); }
export function playDash() { sfxOsc(240, "square", 0.09, 0.1, 90); sfxOsc(520, "triangle", 0.08, 0.07); }
export function playCharge() { sfxOsc(380, "sine", 0.16, 0.08, 760); }
