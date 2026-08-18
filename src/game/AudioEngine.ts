// Motor de audio sintético — Web Audio API, sin archivos externos
// Genera tonos, efectos y música ambiental programáticamente

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function playTone(freq: number, type: OscillatorType = 'sine', duration = 0.15, gainVal = 0.1) {
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
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
  } catch (e) { /* silencio en navegadores sin AudioContext */ }
}

export function playJump() { playTone(520, 'triangle', 0.12, 0.08); }
export function playJumpBoost() { playTone(880, 'sine', 0.2, 0.1); playTone(1320, 'sine', 0.15, 0.06); }
export function playWallClimb() { playTone(660, 'square', 0.1, 0.06); }
export function playHurt() { playTone(120, 'sawtooth', 0.3, 0.1); playTone(80, 'sawtooth', 0.2, 0.08); }
export function playBread() { playTone(780, 'sine', 0.08, 0.08); playTone(1040, 'sine', 0.08, 0.06); }
export function playPowerBoost() { playTone(440, 'triangle', 0.1, 0.08); setTimeout(() => playTone(880, 'triangle', 0.15, 0.08), 80); }
export function playAttack() { playTone(300, 'square', 0.1, 0.1); }
export function playDig() { playTone(220, 'sine', 0.12, 0.08); }
export function playBossDefeat() { [440, 554, 659, 880].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.3, 0.12), i * 120)); }
export function playRest() { [440, 554, 659, 880, 1046].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.25, 0.1), i * 150)); }

// Música ambiental simple: secuencia de acordes en bucle
export function startAmbientMusic() {
  try {
    const c = getCtx();
    if ((c as any)._ambientRunning) return;
    (c as any)._ambientRunning = true;
    const notes = [330, 392, 494, 330, 392, 494, 392, 494, 587, 330];
    let i = 0;
    const loop = () => {
      if (!c || !(c as any)._ambientRunning) return;
      playTone(notes[i % notes.length], 'triangle', 0.4, 0.05);
      i++;
      setTimeout(loop, 600);
    };
    loop();
  } catch (e) {}
}

export function stopAmbientMusic() {
  try { if (getCtx()) (getCtx() as any)._ambientRunning = false; } catch (e) {}
}
