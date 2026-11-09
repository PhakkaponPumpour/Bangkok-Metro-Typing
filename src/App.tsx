import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LINES } from './data/lines';
import { MapView } from './components/MapView';
import { HUD } from './components/HUD';
import {
  applyInput,
  finishGame,
  initialState,
  progress,
  startGame,
  type GameState,
} from './game/engine';
import {
  ghostProgressAt,
  loadGhost,
  saveGhost,
  type Ghost,
  type GhostSample,
} from './game/replay';
import { t, type Lang } from './i18n';

type Mode = 'normal' | 'time';
const TIME_LIMIT = 90_000;
const LANG_KEY = 'metro-th:lang';

function readLang(): Lang {
  try {
    // รองรับลิงก์แชร์: ?lang=en / ?lang=th
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'th') return q;
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'th';
  } catch {
    return 'th';
  }
}

export default function App() {
  const [lineId, setLineId] = useState(LINES[0].id);
  const line = useMemo(() => LINES.find((l) => l.id === lineId) ?? LINES[0], [lineId]);
  const [mode, setMode] = useState<Mode>('normal');
  const [lang, setLang] = useState<Lang>(readLang);
  const [state, setState] = useState<GameState>(initialState);
  const [elapsed, setElapsed] = useState(0);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [isRecord, setIsRecord] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  const lineRef = useRef(line);
  lineRef.current = line;
  const langRef = useRef(lang);
  langRef.current = lang;
  const startedAtRef = useRef<number | null>(null);
  const samplesRef = useRef<GhostSample[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // จำภาษาที่เลือก
  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  // โหลด ghost เมื่อเปลี่ยนสาย/โหมด
  useEffect(() => {
    setGhost(loadGhost(line.id, mode));
    setIsRecord(false);
  }, [line.id, mode]);

  // รีเซ็ตเกมเมื่อเปลี่ยนสาย/โหมด
  useEffect(() => {
    setState(initialState());
    setElapsed(0);
    startedAtRef.current = null;
    samplesRef.current = [];
    if (inputRef.current) inputRef.current.value = '';
  }, [line.id, mode]);

  const saveRun = useCallback(
    (s: GameState, now: number) => {
      const started = startedAtRef.current ?? now;
      const g: Ghost = {
        lineId: lineRef.current.id,
        mode,
        duration: Math.max(1, now - started),
        score: s.score,
        samples: samplesRef.current,
        at: Date.now(),
      };
      const saved = saveGhost(g);
      setIsRecord(saved);
      if (saved) setGhost(g);
    },
    [mode],
  );

  const begin = useCallback(() => {
    const now = performance.now();
    startedAtRef.current = now;
    samplesRef.current = [{ t: 0, p: 0 }];
    setIsRecord(false);
    const s = startGame(now);
    stateRef.current = s;
    setState(s);
    setElapsed(0);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, []);

  // นาฬิกาเกม
  useEffect(() => {
    if (state.status !== 'running') return;
    const id = window.setInterval(() => {
      const started = startedAtRef.current;
      if (started == null) return;
      const e = performance.now() - started;
      setElapsed(e);
      if (mode === 'time' && e >= TIME_LIMIT) {
        const current = stateRef.current;
        if (current.status === 'running') {
          const now = performance.now();
          const f = finishGame(current, now);
          stateRef.current = f;
          setState(f);
          samplesRef.current.push({
            t: now - started,
            p: progress(lineRef.current, f, langRef.current),
          });
          saveRun(f, now);
        }
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [state.status, mode, saveRun]);

  const handleInput = (raw: string) => {
    const s = stateRef.current;
    if (s.status !== 'running') {
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    const now = performance.now();
    const res = applyInput(lineRef.current, s, raw, now, langRef.current);
    if (inputRef.current) inputRef.current.value = res.state.typed;
    if (res.state === s) return;

    stateRef.current = res.state;
    setState(res.state);

    const started = startedAtRef.current ?? now;
    samplesRef.current.push({
      t: Math.max(0, now - started),
      p: progress(lineRef.current, res.state, langRef.current),
    });

    if (res.state.status === 'finished') {
      saveRun(res.state, now);
    }
  };

  const focusInput = () => inputRef.current?.focus();

  const ghostProgress =
    ghost && state.status === 'running' ? ghostProgressAt(ghost, elapsed) : null;

  return (
    <div className="app" onPointerDown={focusInput}>
      <MapView
        line={line}
        progress={progress(line, state, lang)}
        ghostProgress={ghostProgress}
        lang={lang}
      />

      <HUD
        lines={LINES}
        line={line}
        state={state}
        mode={mode}
        elapsedMs={elapsed}
        limitMs={TIME_LIMIT}
        ghost={ghost}
        isRecord={isRecord}
        lang={lang}
        onStart={begin}
        onSelectLine={setLineId}
        onSelectMode={setMode}
        onSelectLang={setLang}
      />

      <input
        ref={inputRef}
        className="capture"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onInput={(e) => handleInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && stateRef.current.status !== 'running') begin();
        }}
      />

      <div className="footer">{t(lang, 'footer')}</div>
    </div>
  );
}
