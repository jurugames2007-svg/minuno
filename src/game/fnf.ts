export type Judge = "sick" | "good" | "bad" | "miss";

export interface ChartNote {
  t: number;
  lane: number;
  side: "p" | "e";
}

const PATTERN = [0, 2, 1, 3, 0, 1, 2, 3, 1, 0, 3, 2, 0, 3, 1, 2];

/** Chart determinista: 4/4, enemigo en el offbeat, jugador en el pulso. */
export function makeChart(bars = 12, bpm = 132): ChartNote[] {
  const beat = 60 / bpm;
  const notes: ChartNote[] = [];
  for (let b = 0; b < bars * 4; b++) {
    const t = 1.15 + b * beat;
    notes.push({ t, lane: PATTERN[b % PATTERN.length], side: "p" });
    if (b % 2 === 1) notes.push({ t: t - beat * 0.5, lane: PATTERN[(b + 2) % PATTERN.length], side: "e" });
    if (b % 8 === 4) notes.push({ t: t + beat * 0.25, lane: PATTERN[(b + 1) % PATTERN.length], side: "p" });
  }
  return notes.sort((a, c) => a.t - c.t);
}

export function judgeDelta(px: number): Judge {
  const a = Math.abs(px);
  if (a <= 18) return "sick";
  if (a <= 36) return "good";
  if (a <= 54) return "bad";
  return "miss";
}

export function judgeScore(j: Judge): number {
  if (j === "sick") return 2;
  if (j === "good") return 1;
  return 0;
}

export const LANE_KEYS = ["ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"] as const;
export const LANE_GLYPH = ["←", "↓", "↑", "→"] as const;
export const LANE_COL = ["#31b0ff", "#7fc24a", "#ff5fa0", "#ffd27a"] as const;
