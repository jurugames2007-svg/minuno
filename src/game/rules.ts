import type { BossType } from "../art/Bosses";
import { BOSS_GENRE, type GenreId } from "../data/bossModes";
import { CYCLE, GATE_H, LEVEL_LEN, REST_H } from "../data/world";

/** Teclado alineado con la ayuda: J carga, Shift/K dash. */
export const CHARGE_KEYS = ["j", "J", "x", "X"] as const;
export const DASH_KEYS = ["k", "K", "Shift"] as const;
export const JUMP_KEYS = [" ", "ArrowUp", "w", "W"] as const;

export const DANCE_BEAT = 0.5;
export const DANCE_SEQ = [0, 1, 3, 2, 0, 2, 1, 3, 0, 3, 1, 2] as const;

export const ENEMY_TYPES = ["spoon", "mouse", "whisk", "bubble", "spatula"] as const;
export type FieldEnemy = (typeof ENEMY_TYPES)[number];

export function isChargeKey(key: string): boolean {
  return (CHARGE_KEYS as readonly string[]).includes(key);
}
export function isDashKey(key: string): boolean {
  return (DASH_KEYS as readonly string[]).includes(key);
}

export function cycleLength(): number {
  return LEVEL_LEN + GATE_H + REST_H + 2;
}

export function rowOfLevel(level: number): number {
  return 3 + (Math.max(1, level) - 1) * CYCLE;
}

export function uniqueGenres(types: BossType[]): GenreId[] {
  return Array.from(new Set(types.map((t) => BOSS_GENRE[t])));
}

export function enemyPeriod(type: FieldEnemy): number {
  if (type === "spoon") return 2.2;
  if (type === "mouse") return 0.9;
  if (type === "whisk") return 1.6;
  if (type === "bubble") return 0;
  return 2.8;
}

export function cineLineCount(intro: string[], react: string[]): number {
  return [
    intro[0] ?? "Algo se acerca.",
    react[0] ?? "¡Guau!",
    intro[1] ?? intro[intro.length - 1] ?? "¡A pelear!",
  ].length;
}
