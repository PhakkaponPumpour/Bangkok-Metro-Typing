import type { Line, Station } from '../data/lines';
import type { Lang } from '../i18n';

export type Status = 'ready' | 'running' | 'finished';

export interface GameState {
  status: Status;
  /** สถานีปลายทางที่กำลังพิมพ์ (index 1..last) */
  targetIndex: number;
  /** ตัวอักษรที่พิมพ์ถูกแล้วของสถานีปัจจุบัน (normalized) */
  typed: string;
  score: number;
  combo: number;
  maxCombo: number;
  correct: number;
  wrong: number;
  startedAt: number | null;
  endedAt: number | null;
}

export const normalize = (s: string): string => s.normalize('NFC').replace(/\s+/g, '');

export function initialState(): GameState {
  return {
    status: 'ready',
    targetIndex: 1,
    typed: '',
    score: 0,
    combo: 0,
    maxCombo: 0,
    correct: 0,
    wrong: 0,
    startedAt: null,
    endedAt: null,
  };
}

export function currentStation(line: Line, s: GameState): Station {
  const idx = Math.min(s.targetIndex, line.stations.length - 1);
  return line.stations[idx];
}

/** ชื่อสถานีตามภาษาที่เลือก (ใช้แสดงผล — ยังมีช่องว่าง) */
export function stationName(st: Station, lang: Lang = 'th'): string {
  return lang === 'en' && st.nameEn ? st.nameEn : st.name;
}

/** ชื่อสถานีเป้าหมายแบบ normalized (ใช้เทียบการพิมพ์) */
export function currentTarget(line: Line, s: GameState, lang: Lang = 'th'): string {
  return normalize(stationName(currentStation(line, s), lang));
}

/** ชื่อสถานีเป้าหมายแบบดิบ (ใช้แสดงผล) */
export function currentName(line: Line, s: GameState, lang: Lang = 'th'): string {
  return stationName(currentStation(line, s), lang);
}

/** ความคืบหน้ารวม 0..1 ตามระยะทางสถานี (ใช้ interpolate บนแผนที่) */
export function progress(line: Line, s: GameState, lang: Lang = 'th'): number {
  if (s.status === 'finished') return 1;
  const last = line.stations.length - 1;
  if (last <= 0) return 0;
  const target = currentTarget(line, s, lang);
  const seg = target.length === 0 ? 0 : s.typed.length / target.length;
  const p = (Math.min(s.targetIndex, last) - 1 + seg) / last;
  return Math.max(0, Math.min(1, p));
}

export function startGame(now: number): GameState {
  return { ...initialState(), status: 'running', startedAt: now };
}

export function finishGame(s: GameState, now: number): GameState {
  if (s.status === 'finished') return s;
  return { ...s, status: 'finished', endedAt: now };
}

export interface InputResult {
  state: GameState;
  completedStation: boolean;
  mistake: boolean;
}

/**
 * รับข้อความทั้งหมดใน input แล้วเทียบกับชื่อสถานีเป้าหมาย
 * - เก็บเฉพาะ prefix ที่ถูกต้อง
 * - ตัวอักษรเกิน/ผิดนับเป็น mistake 1 ครั้งต่อ input event
 * - พิมพ์ครบชื่อ = ถึงสถานีถัดไป
 */
export function applyInput(
  line: Line,
  s: GameState,
  raw: string,
  now: number,
  lang: Lang = 'th',
): InputResult {
  if (s.status !== 'running') return { state: s, completedStation: false, mistake: false };

  const target = currentTarget(line, s, lang);
  const input = normalize(raw);
  let i = 0;
  while (i < input.length && i < target.length && input[i] === target[i]) i++;

  const complete = i === target.length;
  const mistake = !complete && input.length > i;

  if (!complete) {
    const newlyCorrect = Math.max(0, i - s.typed.length);
    const wrong = mistake ? s.wrong + 1 : s.wrong;
    const combo = mistake ? 0 : s.combo + newlyCorrect;
    return {
      state: {
        ...s,
        typed: input.slice(0, i),
        correct: s.correct + newlyCorrect,
        wrong,
        combo,
        maxCombo: Math.max(s.maxCombo, combo),
        score: s.score + newlyCorrect * 10,
      },
      completedStation: false,
      mistake,
    };
  }

  // ถึงสถานี
  const gained = Math.max(0, target.length - s.typed.length);
  const combo = s.combo + gained;
  const lastIdx = line.stations.length - 1;
  const nextIndex = s.targetIndex + 1;
  const finished = nextIndex > lastIdx;

  return {
    state: {
      ...s,
      status: finished ? 'finished' : 'running',
      targetIndex: Math.min(nextIndex, lastIdx),
      typed: '',
      correct: s.correct + gained,
      combo,
      maxCombo: Math.max(s.maxCombo, combo),
      score: s.score + gained * 10 + 100 + combo * 5,
      endedAt: finished ? now : null,
    },
    completedStation: true,
    mistake: false,
  };
}

export function accuracy(s: GameState): number {
  const total = s.correct + s.wrong;
  return total === 0 ? 100 : (s.correct / total) * 100;
}

export function wpm(s: GameState, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return s.correct / 5 / (elapsedMs / 60000);
}
