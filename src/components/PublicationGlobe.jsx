import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import { useTheme } from "../context/ThemeContext";
import { GLOBE_PINS } from "../constants";

export default function PublicationGlobe() {
  const globeRef = useRef();
  const containerRef = useRef();
  const { isDark } = useTheme();
  const [dims, setDims] = useState({ w: 350, h: 350 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;
    globeRef.current.pointOfView({ lat: 22, lng: 78, altitude: 2.0 }, 1500);
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setDims({ w: Math.min(w, 450), h: Math.min(w, 450) });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Arcs connecting all venues
  const arcsData = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < GLOBE_PINS.length; i++) {
      for (let j = i + 1; j < GLOBE_PINS.length; j++) {
        const dist = Math.abs(GLOBE_PINS[i].lng - GLOBE_PINS[j].lng);
        if (dist > 5) {
          arcs.push({
            startLat: GLOBE_PINS[i].lat,
            startLng: GLOBE_PINS[i].lng,
            endLat: GLOBE_PINS[j].lat,
            endLng: GLOBE_PINS[j].lng,
            color: [GLOBE_PINS[i].color + "88", GLOBE_PINS[j].color + "88"],
          });
        }
      }
    }
    return arcs;
  }, []);

  // Ring pulse data
  const ringsData = useMemo(() =>
    GLOBE_PINS.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      maxR: 3,
      propagationSpeed: 2,
      repeatPeriod: 1200,
      color: p.color,
    })),
  []);

  const handlePointHover = useCallback((point) => {
    setHovered(point);
    if (globeRef.current) {
      globeRef.current.controls().autoRotateSpeed = point ? 0.1 : 0.6;
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative">
      <Globe
        ref={globeRef}
        width={dims.w}
        height={dims.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={
          isDark
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        atmosphereColor={isDark ? "#00e6c8" : "#4488cc"}
        atmosphereAltitude={0.15}
        // Points
        pointsData={GLOBE_PINS}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.04}
        pointRadius={0.6}
        pointsMerge={false}
        onPointHover={handlePointHover}
        // Labels
        labelsData={GLOBE_PINS}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={1.0}
        labelDotRadius={0.3}
        labelColor={() => (isDark ? "rgba(255,255,255,0.85)" : "rgba(26,26,46,0.85)")}
        labelAltitude={0.05}
        labelResolution={2}
        // Arcs
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.15}
        arcDashAnimateTime={2500}
        arcStroke={0.3}
        arcAltitudeAutoScale={0.35}
        // Rings
        ringsData={ringsData}
        ringColor={(d) => (t) => {
          const c = d.color || "#00f0ff";
          return `${c}${Math.round((1 - t) * 255).toString(16).padStart(2, "0")}`;
        }}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-xs font-mono z-50"
          style={{
            background: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
            color: hovered.color,
            border: `1px solid ${hovered.color}44`,
            boxShadow: `0 4px 20px ${hovered.color}22`,
          }}
        >
          {hovered.label} — {hovered.city}
        </div>
      )}

      <p
        className="mt-2 text-xs font-mono tracking-wider"
        style={{ color: "var(--text-dim)" }}
      >
        6 venues across 3 countries
      </p>
    </div>
  );
}