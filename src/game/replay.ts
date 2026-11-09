export interface GhostSample {
  /** ms จากเริ่มเกม */
  t: number;
  /** progress 0..1 */
  p: number;
}

export interface Ghost {
  lineId: string;
  mode: 'normal' | 'time';
  duration: number;
  score: number;
  samples: GhostSample[];
  at: number;
}

const key = (lineId: string, mode: string) => `metro-th:ghost:${lineId}:${mode}`;

export function loadGhost(lineId: string, mode: 'normal' | 'time'): Ghost | null {
  try {
    const raw = localStorage.getItem(key(lineId, mode));
    if (!raw) return null;
    const g = JSON.parse(raw) as Ghost;
    return Array.isArray(g.samples) ? g : null;
  } catch {
    return null;
  }
}

/** เก็บเฉพาะสถิติที่ดีกว่า (คะแนนสูงกว่า หรือคะแนนเท่ากันแต่เร็วกว่า) */
export function saveGhost(g: Ghost): boolean {
  try {
    const prev = loadGhost(g.lineId, g.mode);
    const better =
      !prev ||
      g.score > prev.score ||
      (g.score === prev.score && g.duration < prev.duration);
    if (better) {
      localStorage.setItem(key(g.lineId, g.mode), JSON.stringify(g));
      return true;
    }
  } catch {
    /* localStorage อาจถูกปิด */
  }
  return false;
}

export function ghostProgressAt(g: Ghost, elapsedMs: number): number | null {
  if (elapsedMs <= 0) return 0;
  const s = g.samples;
  if (s.length === 0) return null;
  if (elapsedMs >= s[s.length - 1].t) return s[s.length - 1].p;

  let lo = 0;
  let hi = s.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (s[mid].t < elapsedMs) lo = mid + 1;
    else hi = mid;
  }
  const b = s[lo];
  const a = s[Math.max(0, lo - 1)];
  const span = b.t - a.t;
  return span <= 0 ? b.p : a.p + (b.p - a.p) * ((elapsedMs - a.t) / span);
}
