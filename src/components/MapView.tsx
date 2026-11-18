import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Line } from '../data/lines';
import { bearingAt, pointAtFraction } from '../game/geom';
import { stationName } from '../game/engine';
import type { Lang } from '../i18n';

const STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface Props {
  line: Line;
  progress: number;
  lang: Lang;
}

export function MapView({ line, progress, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stationMarkers = useRef<maplibregl.Marker[]>([]);
  const trainRef = useRef<maplibregl.Marker | null>(null);
  const trainBodyRef = useRef<HTMLDivElement | null>(null);
  const lastBearingRef = useRef<number | null>(null);
  const coordsRef = useRef<[number, number][]>([]);
  const shownProgressRef = useRef<number | null>(null);
  const targetProgressRef = useRef<number | null>(null);
  const lineIdRef = useRef('');
  const movingRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [100.55, 13.75],
      zoom: 12,
      attributionControl: false,
    });
    // วาง attribution ไว้มุมขวาบน เพื่อไม่ให้แถบล่างบัง (ODbL ต้องมองเห็นได้)
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'top-right');
    mapRef.current = map;
    // กัน canvas แย่ง focus จาก input ตอนผู้เล่นคลิกแผนที่
    map.getCanvas().removeAttribute('tabindex');
    map.on('load', () => setLoaded(true));
    return () => {
      stationMarkers.current.forEach((m) => m.remove());
      trainRef.current?.remove();
      stationMarkers.current = [];
      trainRef.current = null;
      trainBodyRef.current = null;
      lastBearingRef.current = null;
      coordsRef.current = [];
      shownProgressRef.current = null;
      targetProgressRef.current = null;
      lineIdRef.current = '';
      movingRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // เส้นทาง + ป้ายสถานี
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    stationMarkers.current.forEach((m) => m.remove());
    stationMarkers.current = [];

    const coords = line.stations.map((s) => s.coord);
    const geojson = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: coords },
    };

    const src = map.getSource('route') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(geojson);
      map.setPaintProperty('route-line', 'line-color', line.color);
    } else {
      map.addSource('route', { type: 'geojson', data: geojson });
      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#000', 'line-width': 11, 'line-opacity': 0.55 },
      });
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': line.color, 'line-width': 5 },
      });
    }

    for (const st of line.stations) {
      const el = document.createElement('div');
      el.className = 'station';
      const dot = document.createElement('i');
      dot.style.setProperty('--c', line.color);
      const label = document.createElement('b');
      label.textContent = stationName(st, lang);
      el.append(dot, label);
      const marker = new maplibregl.Marker({ element: el, anchor: 'left' })
        .setLngLat(st.coord)
        .addTo(map);
      stationMarkers.current.push(marker);
    }

    const bounds = new maplibregl.LngLatBounds();
    for (const c of coords) bounds.extend(c);
    map.fitBounds(bounds, { padding: 90, duration: 500 });
  }, [line, loaded, lang]);

  // ขบวนรถของผู้เล่น — ตั้งเป้าความคืบหน้าไว้ แล้วให้ rAF ข้างล่างไล่ตามบนเส้นทาง
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    const coords = line.stations.map((s) => s.coord);
    coordsRef.current = coords;
    const pos = pointAtFraction(coords, progress);

    // เปลี่ยนสาย → กระโดดไปจุดใหม่ทันที (ไม่ให้รถลอยข้ามเมือง)
    if (lineIdRef.current !== line.id) {
      lineIdRef.current = line.id;
      shownProgressRef.current = null;
    }

    targetProgressRef.current = progress;

    if (!trainRef.current) {
      const el = document.createElement('div');
      el.className = 'train';
      el.style.setProperty('--c', line.color);
      const body = document.createElement('div');
      body.className = 'train-body';
      const bearing = bearingAt(coords, progress);
      body.style.transform = `rotate(${bearing}deg)`;
      lastBearingRef.current = bearing;
      el.append(body);
      trainBodyRef.current = body;
      trainRef.current = new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(map);
      shownProgressRef.current = progress;
    } else {
      trainRef.current.getElement().style.setProperty('--c', line.color);
    }
  }, [progress, line, loaded]);

  // อนิเมชันการเคลื่อนที่ของรถ — ไล่ "ความคืบหน้า" ทีละเฟรม แล้วคำนวณพิกัดบนเส้นทาง
  // (ไม่ lerp พิกัดตรง ๆ เพราะจะทำให้รถตัดมุมออกนอกเส้น)
  useEffect(() => {
    if (!loaded) return;
    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last); // กันรถกระโดดหลังสลับแท็บ
      last = now;

      const target = targetProgressRef.current;
      const marker = trainRef.current;
      const coords = coordsRef.current;

      if (target != null && marker && coords.length > 1) {
        let shown = shownProgressRef.current;
        let changed = false;

        if (shown == null) {
          shown = target;
          shownProgressRef.current = shown;
          changed = true;
        } else {
          const diff = target - shown;
          const moving = Math.abs(diff) > 1e-5;

          if (moving) {
            const k = reduce ? 1 : 1 - Math.pow(0.18, dt / 100);
            shown += diff * k;
            if (Math.abs(target - shown) < 1e-6) shown = target;
            shownProgressRef.current = shown;
            changed = true;
          } else if (shown !== target) {
            shown = target;
            shownProgressRef.current = shown;
            changed = true;
          }

          if (moving !== movingRef.current) {
            movingRef.current = moving;
            marker.getElement().classList.toggle('moving', moving);
          }
        }

        if (changed) {
          marker.setLngLat(pointAtFraction(coords, shown));

          // หันตัวรถตามแนวราง ณ ตำแหน่งที่รถอยู่จริง
          const body = trainBodyRef.current;
          if (body) {
            const bearing = bearingAt(coords, shown);
            if (
              lastBearingRef.current == null ||
              Math.abs(bearing - lastBearingRef.current) > 0.01
            ) {
              lastBearingRef.current = bearing;
              body.style.transform = `rotate(${bearing}deg)`;
            }
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  return <div ref={containerRef} className="map" />;
}
