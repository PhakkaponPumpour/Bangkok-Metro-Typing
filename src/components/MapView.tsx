import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Line } from '../data/lines';
import { pointAtFraction } from '../game/geom';
import { stationName } from '../game/engine';
import type { Lang } from '../i18n';

const STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface Props {
  line: Line;
  progress: number;
  ghostProgress: number | null;
  lang: Lang;
}

export function MapView({ line, progress, ghostProgress, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stationMarkers = useRef<maplibregl.Marker[]>([]);
  const trainRef = useRef<maplibregl.Marker | null>(null);
  const ghostRef = useRef<maplibregl.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [100.55, 13.75],
      zoom: 12,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.on('load', () => setLoaded(true));
    return () => {
      stationMarkers.current.forEach((m) => m.remove());
      trainRef.current?.remove();
      ghostRef.current?.remove();
      stationMarkers.current = [];
      trainRef.current = null;
      ghostRef.current = null;
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

  // ขบวนรถของผู้เล่น
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const pos = pointAtFraction(
      line.stations.map((s) => s.coord),
      progress,
    );
    if (!trainRef.current) {
      const el = document.createElement('div');
      el.className = 'train';
      el.style.setProperty('--c', line.color);
      trainRef.current = new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(map);
    } else {
      trainRef.current.setLngLat(pos);
      trainRef.current.getElement().style.setProperty('--c', line.color);
    }
  }, [progress, line, loaded]);

  // ghost (สถิติที่ดีที่สุด)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    if (ghostProgress == null) {
      if (ghostRef.current) ghostRef.current.getElement().style.display = 'none';
      return;
    }
    const pos = pointAtFraction(
      line.stations.map((s) => s.coord),
      ghostProgress,
    );
    if (!ghostRef.current) {
      const el = document.createElement('div');
      el.className = 'ghost';
      ghostRef.current = new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(map);
    } else {
      ghostRef.current.getElement().style.display = '';
      ghostRef.current.setLngLat(pos);
    }
  }, [ghostProgress, line, loaded]);

  return <div ref={containerRef} className="map" />;
}
