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
