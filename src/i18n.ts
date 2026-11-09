export type Lang = 'th' | 'en';

const dict = {
  th: {
    tagline: 'พิมพ์ชื่อสถานีให้ถึงปลายทาง',
    normal: 'ธรรมดา',
    time: 'ไทม์ {s}s',
    station: 'สถานี {n} / {total}',
    score: 'คะแนน',
    combo: 'คอมโบ',
    accuracy: 'ความแม่น',
    timeLeft: 'เหลือ',
    timeElapsed: 'เวลา',
    arrived: 'ถึงปลายทาง!',
    record: 'สถิติใหม่ 🏆',
    best: 'สถิติเดิม',
    start: 'เริ่มเกม (Enter)',
    playing: 'กำลังเล่น…',
    again: 'เล่นอีกครั้ง (Enter)',
    hint: 'พิมพ์ชื่อสถานีถัดไป • ตัวอักษรผิดจะรีเซ็ตคอมโบ • เส้นประ = ghost สถิติเดิม',
    footer: 'ข้อมูลตัวอย่างเพื่อการเรียนรู้ • ควรแทนที่ด้วยข้อมูล OSM (ODbL) ก่อนเผยแพร่',
    points: 'คะแนน',
  },
  en: {
    tagline: 'Type the station names to reach the end',
    normal: 'Normal',
    time: 'Time {s}s',
    station: 'Station {n} / {total}',
    score: 'Score',
    combo: 'Combo',
    accuracy: 'Accuracy',
    timeLeft: 'Left',
    timeElapsed: 'Time',
    arrived: 'Destination reached!',
    record: 'New record 🏆',
    best: 'Best',
    start: 'Start (Enter)',
    playing: 'Playing…',
    again: 'Play again (Enter)',
    hint: 'Type the next station • a wrong letter resets combo • dashed = ghost of your best run',
    footer: 'Sample data for learning • replace with OSM (ODbL) data before publishing',
    points: 'points',
  },
} as const;

export type Dict = typeof dict.th;

export function t(lang: Lang, key: keyof Dict): string {
  return dict[lang][key];
}

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}
