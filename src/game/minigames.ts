/** Lógica pura de minijuegos — testeable, sin React. */

export function markMatches(a: readonly number[], w = 4): Set<number> {
  const mark = new Set<number>();
  const h = a.length / w;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w - 2; c++) {
      const i0 = r * w + c;
      if (a[i0] === a[i0 + 1] && a[i0] === a[i0 + 2]) {
        mark.add(i0); mark.add(i0 + 1); mark.add(i0 + 2);
      }
    }
  }
  for (let c = 0; c < w; c++) {
    for (let r = 0; r < h - 2; r++) {
      const i0 = r * w + c;
      if (a[i0] === a[i0 + w] && a[i0] === a[i0 + w * 2]) {
        mark.add(i0); mark.add(i0 + w); mark.add(i0 + w * 2);
      }
    }
  }
  return mark;
}

export function applyGravity(board: number[], fill: () => number, w = 4): number[] {
  const h = board.length / w;
  const next = board.slice();
  for (let c = 0; c < w; c++) {
    const col: number[] = [];
    for (let r = h - 1; r >= 0; r--) {
      const v = next[r * w + c];
      if (v >= 0) col.push(v);
    }
    while (col.length < h) col.push(fill());
    for (let r = h - 1; r >= 0; r--) next[r * w + c] = col[h - 1 - r];
  }
  return next;
}

export function neighbors(i: number, j: number, w = 4): boolean {
  const ar = Math.abs(Math.floor(i / w) - Math.floor(j / w));
  const ac = Math.abs((i % w) - (j % w));
  return ar + ac === 1;
}

export function trySwap(board: number[], i: number, j: number, fill: () => number, w = 4): { board: number[]; cleared: number } | null {
  if (!neighbors(i, j, w)) return null;
  const a = board.slice();
  const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  const mark = markMatches(a, w);
  if (!mark.size) return { board, cleared: 0 };
  for (const k of mark) a[k] = -1;
  return { board: applyGravity(a, fill, w), cleared: mark.size };
}

export function isOrthoAdj(pos: number, i: number, cols: number): boolean {
  const pr = Math.floor(pos / cols), pc = pos % cols;
  const r = Math.floor(i / cols), c = i % cols;
  return Math.abs(pr - r) + Math.abs(pc - c) === 1;
}

export function prizeRevealed(dug: ReadonlySet<number>, prize: number, cols: number): boolean {
  for (const p of dug) if (isOrthoAdj(p, prize, cols)) return true;
  return false;
}

export type LuchaAct = "hi" | "lo" | "block";
export function luchaResolve(act: LuchaAct, warn: LuchaAct | null): "hit" | "hurt" | "block" | "idle" {
  if (!warn) return "idle";
  if (act === "block") return "block";
  return act === warn ? "hit" : "hurt";
}

export function checkpointsForDepth(depth: number, cycle: number): number[] {
  const out = [1];
  for (const lv of [5, 10, 15, 20, 25]) {
    if (depth >= (lv - 1) * cycle) out.push(lv);
  }
  return out;
}

export function gamepadEdge(prev: boolean, now: boolean): boolean {
  return now && !prev;
}
