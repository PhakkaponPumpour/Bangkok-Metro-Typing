import type { ReactElement } from 'react';
import type { Line } from '../data/lines';
import { accuracy, currentName, wpm, type GameState } from '../game/engine';
import type { Ghost } from '../game/replay';
import { fmt, t, type Lang } from '../i18n';

interface Props {
  lines: Line[];
  line: Line;
  state: GameState;
  mode: 'normal' | 'time';
  elapsedMs: number;
  limitMs: number;
  ghost: Ghost | null;
  isRecord: boolean;
  lang: Lang;
  onStart: () => void;
  onSelectLine: (id: string) => void;
  onSelectMode: (mode: 'normal' | 'time') => void;
  onSelectLang: (lang: Lang) => void;
}

function seconds(ms: number): string {
  return `${Math.max(0, ms / 1000).toFixed(1)}s`;
}

export function HUD({
  lines,
  line,
  state,
  mode,
  elapsedMs,
  limitMs,
  ghost,
  isRecord,
  lang,
  onStart,
  onSelectLine,
  onSelectMode,
  onSelectLang,
}: Props) {
  const display = currentName(line, state, lang);
  const typedLen = state.typed.length;
  const lastIdx = line.stations.length - 1;
  const from = line.stations[Math.max(0, state.targetIndex - 1)];
  const to = line.stations[Math.min(state.targetIndex, lastIdx)];
  const running = state.status === 'running';
  const finished = state.status === 'finished';
  const timeLeft = Math.max(0, limitMs - elapsedMs);
  const shownTime = mode === 'time' ? timeLeft : elapsedMs;

  // แสดงชื่อพร้อมช่องว่าง แต่การนับตัวอักษรนับเฉพาะ non-space
  const charNodes: ReactElement[] = [];
  let seen = 0;
  [...display].forEach((ch, i) => {
    if (/\s/.test(ch)) {
      charNodes.push(
        <span key={i} className="space">
          {ch}
        </span>,
      );
      return;
    }
    const cls = seen < typedLen ? 'done' : seen === typedLen && running ? 'hot' : 'rest';
    seen++;
    charNodes.push(
      <span key={i} className={cls}>
        {ch}
      </span>,
    );
  });

  return (
    <aside className="hud">
      <div className="brand">
        METRO<span>TH</span>
        <em>{t(lang, 'tagline')}</em>
      </div>

      <div className="langs">
        <button
          className={lang === 'th' ? 'on' : ''}
          onClick={() => onSelectLang('th')}
          disabled={running}
        >
          ไทย
        </button>
        <button
          className={lang === 'en' ? 'on' : ''}
          onClick={() => onSelectLang('en')}
          disabled={running}
        >
          EN
        </button>
      </div>

      <div className="row">
        <select
          className="select"
          value={line.id}
          onChange={(e) => onSelectLine(e.target.value)}
          disabled={running}
        >
          {lines.map((l) => (
            <option key={l.id} value={l.id}>
              {lang === 'en' ? l.nameEn : l.name}
            </option>
          ))}
        </select>
        <div className="modes">
          <button
            className={mode === 'normal' ? 'on' : ''}
            onClick={() => onSelectMode('normal')}
            disabled={running}
          >
            {t(lang, 'normal')}
          </button>
          <button
            className={mode === 'time' ? 'on' : ''}
            onClick={() => onSelectMode('time')}
            disabled={running}
          >
            {fmt(t(lang, 'time'), { s: Math.round(limitMs / 1000) })}
          </button>
        </div>
      </div>

      <div className="stops">
        {fmt(t(lang, 'station'), { n: state.targetIndex, total: lastIdx })}
        {from && to && (
          <span className="route">
            {lang === 'en' ? from.nameEn : from.name} → {lang === 'en' ? to.nameEn : to.name}
          </span>
        )}
      </div>

      <div className={`target ${state.status === 'ready' ? 'idle' : ''}`}>{charNodes}</div>

      <div className="stats">
        <div>
          <label>{t(lang, 'score')}</label>
          <b>{state.score.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}</b>
        </div>
        <div>
          <label>{t(lang, 'combo')}</label>
          <b className={state.combo >= 10 ? 'hot' : ''}>×{state.combo}</b>
        </div>
        <div>
          <label>{t(lang, 'accuracy')}</label>
          <b>{accuracy(state).toFixed(1)}%</b>
        </div>
        <div>
          <label>WPM</label>
          <b>{Math.round(wpm(state, elapsedMs))}</b>
        </div>
        <div>
          <label>{mode === 'time' ? t(lang, 'timeLeft') : t(lang, 'timeElapsed')}</label>
          <b>{seconds(shownTime)}</b>
        </div>
      </div>

      {finished && (
        <div className="result">
          {t(lang, 'arrived')} {state.score.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
          {isRecord && <span className="record">{t(lang, 'record')}</span>}
          {ghost && !isRecord && (
            <span className="ghostnote">
              {t(lang, 'best')} {ghost.score.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')} •{' '}
              {seconds(ghost.duration)}
            </span>
          )}
        </div>
      )}

      <button className="start" onClick={onStart} disabled={running}>
        {running ? t(lang, 'playing') : finished ? t(lang, 'again') : t(lang, 'start')}
      </button>

      <p className="hint">{t(lang, 'hint')}</p>
    </aside>
  );
}
