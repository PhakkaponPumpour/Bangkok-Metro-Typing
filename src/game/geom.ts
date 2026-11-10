export type Coord = [number, number]; // [lng, lat]

function segmentLengths(coords: Coord[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i];
    const b = coords[i + 1];
    // ปรับ lng ตาม cos(lat) เพื่อให้ระยะทางสมจริงขึ้น (พอเพียงสำหรับ MVP)
    const dx = (b[0] - a[0]) * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180);
    const dy = b[1] - a[1];
    out.push(Math.hypot(dx, dy));
  }
  return out;
}

/**
 * หาทิศทางของเส้นที่เศษส่วน f (0..1)
 * คืนค่า bearing 0–360 องศา (0 = เหนือ, 90 = ตะวันออก, หมุนตามเข็มนาฬิกา)
 */
export function bearingAt(coords: Coord[], f: number): number {
  if (coords.length < 2) return 0;

  const lens = segmentLengths(coords);
  const total = lens.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  let d = Math.max(0, Math.min(1, f)) * total;
  let i = 0;
  while (i < lens.length - 1 && d > lens[i]) {
    d -= lens[i];
    i++;
  }

  const a = coords[i];
  const b = coords[i + 1];
  if (!a || !b) return 0;

  // dx ปรับ cos(lat) ให้สอดคล้องกับ segmentLengths
  const dx = (b[0] - a[0]) * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180);
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return 0;

  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}

/** หาพิกัดที่เศษส่วน f (0..1) ของความยาวเส้น */
export function pointAtFraction(coords: Coord[], f: number): Coord {
  if (coords.length === 0) return [0, 0];
  if (coords.length === 1) return coords[0];

  const lens = segmentLengths(coords);
  const total = lens.reduce((a, b) => a + b, 0);
  if (total === 0) return coords[0];

  let d = Math.max(0, Math.min(1, f)) * total;

  for (let i = 0; i < lens.length; i++) {
    const isLast = i === lens.length - 1;
    if (d <= lens[i] || isLast) {
      const t = lens[i] === 0 ? 0 : Math.min(1, d / lens[i]);
      const a = coords[i];
      const b = coords[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    d -= lens[i];
  }
  return coords[coords.length - 1];
}
