// ตรวจ mechanics ของ engine แบบ pure (ไม่ต้องใช้ browser)
import { LINES } from '../src/data/lines.ts';
import {
  applyInput,
  currentName,
  currentTarget,
  finishGame,
  initialState,
  progress,
  startGame,
} from '../src/game/engine.ts';

let failed = 0;
function check(name, cond, extra = '') {
  if (cond) {
    console.log(`ok   ${name}`);
  } else {
    failed++;
    console.log(`FAIL ${name} ${extra}`);
  }
}

const line = LINES[0];
let s = startGame(1000);

check('target แรกคือสถานีที่ 1', currentTarget(line, s) === 'ชิดลม', currentTarget(line, s));
check('progress เริ่มที่ 0', progress(line, s) === 0);

// พิมพ์ถูกบางส่วน
let r = applyInput(line, s, 'ชิ', 1100);
s = r.state;
check('typed = ชิ', s.typed === 'ชิ', s.typed);
check('correct = 2', s.correct === 2, String(s.correct));
check('combo = 2', s.combo === 2, String(s.combo));
check('ยังไม่ถึงสถานี', s.targetIndex === 1);

// พิมพ์ผิด
r = applyInput(line, s, 'ชิx', 1200);
s = r.state;
check('mistake ถูกนับ 1', s.wrong === 1, String(s.wrong));
check('combo รีเซ็ต', s.combo === 0, String(s.combo));
check('typed ยังเป็น prefix ที่ถูก', s.typed === 'ชิ', s.typed);

// พิมพ์ครบชื่อ
r = applyInput(line, s, 'ชิดลม', 1300);
s = r.state;
check('completedStation = true', r.completedStation);
check('ไปสถานีถัดไป', s.targetIndex === 2, String(s.targetIndex));
check('typed ถูกล้าง', s.typed === '');
check('progress > 0', progress(line, s) > 0, String(progress(line, s)));
check('ได้คะแนนโบนัส', s.score > 0, String(s.score));

// พิมพ์เกินชื่อ (overshoot) ต้องไม่นับเป็น mistake
const target2 = currentTarget(line, s);
r = applyInput(line, s, target2 + 'extra', 1400);
s = r.state;
check('overshoot ไม่นับ mistake', s.wrong === 1, String(s.wrong));
check('overshoot ยังถือว่าครบสถานี', r.completedStation === true);

// วิ่งจนจบสาย
s = startGame(2000);
for (let i = 1; i < line.stations.length; i++) {
  const t = currentTarget(line, s);
  r = applyInput(line, s, t, 2000 + i * 100);
  s = r.state;
}
check('จบเกมเมื่อถึงปลายทาง', s.status === 'finished', s.status);
check('progress = 1 ที่ปลายทาง', progress(line, s) === 1, String(progress(line, s)));

// โหมดไทม์เอาต์
const t = finishGame(startGame(3000), 4000);
check('finishGame ตั้งสถานะ finished', t.status === 'finished');

// initialState
check('initialState พร้อมเล่น', initialState().status === 'ready');

// ---------- English mode ----------
let es = startGame(5000);
check('EN target = ChitLom', currentTarget(line, es, 'en') === 'ChitLom', currentTarget(line, es, 'en'));
check('EN display คงช่องว่าง', currentName(line, es, 'en') === 'Chit Lom');

let er = applyInput(line, es, 'Chit ', 5100, 'en');
es = er.state;
check('EN รับช่องว่างได้ (ตัดออก)', es.typed === 'Chit', es.typed);
check('EN ยังไม่ครบสถานี', er.completedStation === false);

er = applyInput(line, es, 'Chit Lom', 5200, 'en');
es = er.state;
check('EN ครบสถานี', er.completedStation === true);
check('EN ไปสถานีถัดไป', es.targetIndex === 2, String(es.targetIndex));
check('EN display สถานีถัดไป', currentName(line, es, 'en') === 'Phloen Chit', currentName(line, es, 'en'));

// TH ยังใช้ชื่อไทย
const th2 = startGame(6000);
check('TH target ยังเป็นไทย', currentTarget(line, th2, 'th') === 'ชิดลม', currentTarget(line, th2, 'th'));

// สถานีที่มีช่องว่างในชื่อไทย
const mrt = LINES[1];
const idx9 = mrt.stations.findIndex((s) => s.id === 'phraram9');
const st9 = { ...startGame(7000), targetIndex: idx9 };
check('TH display พระราม 9 มีช่องว่าง', currentName(mrt, st9, 'th') === 'พระราม 9');
check('TH target ตัดช่องว่าง', currentTarget(mrt, st9, 'th') === 'พระราม9', currentTarget(mrt, st9, 'th'));
check('EN display Phra Ram 9', currentName(mrt, st9, 'en') === 'Phra Ram 9');

console.log(failed === 0 ? '\nALL PASS' : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
