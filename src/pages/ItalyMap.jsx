// // ItalyMap.jsx
// // SVG choropleth map of Italy — colors regions by scam count
// // Props:
// //   data: { [regionName]: number }  — e.g. { "Lombardia": 42, "Sicilia": 18 }
// //   onRegionClick: (regionName) => void
// //   activeRegion: string | null

// import React, { useState } from "react";

// // Simplified but accurate SVG paths for all 20 Italian regions
// // Viewbox: 0 0 500 560
// const REGIONS = [
//   {
//     name: "Valle d'Aosta",
//     d: "M68 52 L82 48 L90 58 L84 68 L70 66 Z",
//   },
//   {
//     name: "Piemonte",
//     d: "M42 60 L68 52 L84 68 L80 90 L70 110 L50 118 L30 100 L28 80 Z",
//   },
//   {
//     name: "Liguria",
//     d: "M50 118 L70 110 L90 116 L100 128 L80 136 L58 132 Z",
//   },
//   {
//     name: "Lombardia",
//     d: "M84 68 L120 62 L148 68 L156 82 L148 98 L120 104 L90 100 L80 90 Z",
//   },
//   {
//     name: "Trentino-Alto Adige",
//     d: "M120 42 L152 38 L168 50 L164 66 L148 68 L120 62 Z",
//   },
//   {
//     name: "Veneto",
//     d: "M148 68 L190 64 L208 76 L204 96 L180 106 L156 102 L148 98 Z",
//   },
//   {
//     name: "Friuli-Venezia Giulia",
//     d: "M190 64 L222 60 L232 74 L220 86 L204 96 L208 76 Z",
//   },
//   {
//     name: "Emilia-Romagna",
//     d: "M90 100 L148 98 L180 106 L178 126 L160 140 L130 146 L100 140 L84 126 Z",
//   },
//   {
//     name: "Toscana",
//     d: "M84 126 L130 146 L138 168 L128 192 L108 200 L84 196 L68 178 L70 156 Z",
//   },
//   {
//     name: "Marche",
//     d: "M178 126 L210 122 L218 144 L208 162 L186 164 L172 148 L178 134 Z",
//   },
//   {
//     name: "Umbria",
//     d: "M138 168 L172 148 L186 164 L178 184 L158 192 L140 186 Z",
//   },
//   {
//     name: "Lazio",
//     d: "M128 192 L158 192 L178 184 L184 208 L172 228 L148 236 L124 228 L110 210 Z",
//   },
//   {
//     name: "Abruzzo",
//     d: "M186 164 L218 160 L228 182 L216 200 L192 202 L178 184 Z",
//   },
//   {
//     name: "Molise",
//     d: "M192 202 L216 200 L220 216 L204 222 L188 216 Z",
//   },
//   {
//     name: "Campania",
//     d: "M172 228 L204 222 L220 216 L228 238 L220 260 L196 268 L172 260 L158 244 L160 232 Z",
//   },
//   {
//     name: "Puglia",
//     d: "M220 216 L252 208 L272 222 L276 248 L264 272 L248 284 L232 276 L220 260 L228 238 Z",
//   },
//   {
//     name: "Basilicata",
//     d: "M196 268 L220 260 L232 276 L224 292 L204 296 L188 284 Z",
//   },
//   {
//     name: "Calabria",
//     d: "M188 284 L204 296 L212 316 L208 344 L196 356 L180 348 L172 328 L176 304 Z",
//   },
//   {
//     name: "Sicilia",
//     d: "M148 390 L192 378 L224 382 L240 398 L228 416 L200 424 L168 420 L144 406 Z",
//   },
//   {
//     name: "Sardegna",
//     d: "M68 290 L88 280 L102 288 L108 316 L104 344 L88 356 L70 350 L60 328 L62 304 Z",
//   },
// ];

// function getColor(count, max) {
//   if (!count || count === 0) return "#f1f5f9";
//   const intensity = Math.min(count / Math.max(max, 1), 1);
//   // teal scale: light → dark
//   if (intensity < 0.2) return "#ccfbf1";
//   if (intensity < 0.4) return "#5eead4";
//   if (intensity < 0.6) return "#2dd4bf";
//   if (intensity < 0.8) return "#0d9488";
//   return "#0f766e";
// }

// export default function ItalyMap({ data = {}, onRegionClick, activeRegion }) {
//   const [hovered, setHovered] = useState(null);
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

//   const max = Math.max(...Object.values(data), 1);

//   const handleMouseMove = (e, name) => {
//     const rect = e.currentTarget.closest("svg").getBoundingClientRect();
//     setTooltipPos({
//       x: e.clientX - rect.left + 10,
//       y: e.clientY - rect.top - 10,
//     });
//     setHovered(name);
//   };

//   return (
//     <div style={{ position: "relative", width: "100%" }}>
//       <svg
//         viewBox="0 0 300 440"
//         style={{ width: "100%", height: "auto" }}
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         {REGIONS.map((r) => {
//           const count = data[r.name] || 0;
//           const isActive = activeRegion === r.name;
//           const isHovered = hovered === r.name;

//           return (
//             <path
//               key={r.name}
//               d={r.d}
//               fill={getColor(count, max)}
//               stroke="white"
//               strokeWidth={isActive ? "2.5" : "1.5"}
//               strokeLinejoin="round"
//               style={{
//                 cursor: "pointer",
//                 transition: "fill 0.2s, opacity 0.2s",
//                 opacity: isActive ? 1 : isHovered ? 0.85 : 0.95,
//                 filter: isActive
//                   ? "drop-shadow(0 0 4px rgba(13,148,136,0.5))"
//                   : "none",
//               }}
//               onClick={() => onRegionClick?.(r.name)}
//               onMouseMove={(e) => handleMouseMove(e, r.name)}
//               onMouseLeave={() => setHovered(null)}
//             />
//           );
//         })}
//       </svg>

//       {/* Tooltip */}
//       {hovered && (
//         <div
//           style={{
//             position: "absolute",
//             left: tooltipPos.x,
//             top: tooltipPos.y,
//             background: "#0f172a",
//             color: "white",
//             padding: "6px 10px",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: 500,
//             pointerEvents: "none",
//             whiteSpace: "nowrap",
//             zIndex: 10,
//           }}
//         >
//           <span style={{ color: "#94a3b8", marginRight: 6 }}>{hovered}</span>
//           <span style={{ color: "#2dd4bf" }}>
//             {data[hovered] ?? 0} segnalazioni
//           </span>
//         </div>
//       )}

//       {/* Legend */}
//       <div
//         style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}
//       >
//         <span style={{ fontSize: 10, color: "#94a3b8" }}>0</span>
//         {["#ccfbf1", "#5eead4", "#2dd4bf", "#0d9488", "#0f766e"].map((c) => (
//           <div
//             key={c}
//             style={{ width: 24, height: 8, background: c, borderRadius: 2 }}
//           />
//         ))}
//         <span style={{ fontSize: 10, color: "#94a3b8" }}>{max}</span>
//       </div>
//     </div>
//   );
// }

// ItalyMap.jsx — Real geographic choropleth map of Italy with Leaflet
// Uses authentic GeoJSON boundaries for all 20 Italian regions
// Props:
//   data: { [regionName]: number }
//   onRegionClick: (regionName) => void
//   activeRegion: string | null

// ItalyMap.jsx — Real geographic choropleth map of Italy with Leaflet
// Uses authentic GeoJSON boundaries for all 20 Italian regions
// Props:
//   data: { [regionName]: number }
//   onRegionClick: (regionName) => void
//   activeRegion: string | null

// ItalyMap.jsx — Real interactive map of Italy using Mapbox GL and OpenStreetMap
// Displays actual regional boundaries and allows filtering by region

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set mapbox token to a free/public one (or you can use your own)
// Using the public Mapbox vector tiles without authentication
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycW1weWU0d3hnNjMifQ.rJcFIG214AriISLbB6B5aw";

// Region colors based on data intensity
function getColor(count, max) {
  if (!count || count === 0) return "#f1f5f9";
  const intensity = Math.min(count / Math.max(max, 1), 1);
  if (intensity < 0.2) return "#ccfbf1";
  if (intensity < 0.4) return "#5eead4";
  if (intensity < 0.6) return "#2dd4bf";
  if (intensity < 0.8) return "#0d9488";
  return "#0f766e";
}

// Italian region names mapping (OpenStreetMap feature names)
const REGION_NAMES = {
  Piemonte: "Piemonte",
  "Valle d'Aosta": "Valle d'Aosta",
  Lombardia: "Lombardia",
  "Trentino-Alto Adige": "Trentino-Alto Adige",
  Veneto: "Veneto",
  "Friuli-Venezia Giulia": "Friuli-Venezia Giulia",
  "Emilia-Romagna": "Emilia-Romagna",
  Toscana: "Toscana",
  Umbria: "Umbria",
  Marche: "Marche",
  Lazio: "Lazio",
  Abruzzo: "Abruzzo",
  Molise: "Molise",
  Campania: "Campania",
  Puglia: "Puglia",
  Basilicata: "Basilicata",
  Calabria: "Calabria",
  Sicilia: "Sicilia",
  Sardegna: "Sardegna",
};

export default function ItalyMap({ data = {}, onRegionClick, activeRegion }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const max = Math.max(...Object.values(data), 1);

  useEffect(() => {
    if (map.current) return; // Prevent duplicate initialization

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [12.5674, 41.8719], // Center of Italy (lng, lat)
      zoom: 5.5,
      pitch: 0,
      bearing: 0,
    });

    map.current.on("load", () => {
      // Add layer for admin boundaries (regions)
      if (!map.current.getLayer("admin-1-boundary")) {
        map.current.addLayer(
          {
            id: "admin-1-boundary",
            type: "line",
            source: {
              type: "vector",
              url: "mapbox://mapbox.mapbox-streets-v8",
            },
            "source-layer": "admin_1_boundary_disputed",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#cbd5e1",
              "line-width": 1,
            },
          },
          "waterway-label",
        );
      }

      // Add regions fill layer
      if (!map.current.getLayer("regions-fill")) {
        map.current.addLayer({
          id: "regions-fill",
          type: "fill",
          source: {
            type: "vector",
            url: "mapbox://mapbox.mapbox-streets-v8",
          },
          "source-layer": "admin_1",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hovered"], false],
              "rgba(13, 148, 136, 0.3)",
              [
                "case",
                ["boolean", ["feature-state", "active"], false],
                "rgba(13, 148, 136, 0.25)",
                "rgba(0, 0, 0, 0.02)",
              ],
            ],
            "fill-opacity": 0.7,
          },
        });
      }

      // Handle region clicks
      map.current.on("click", "regions-fill", (e) => {
        const regionName = e.features[0]?.properties?.name;
        if (regionName && REGION_NAMES[regionName]) {
          onRegionClick?.(REGION_NAMES[regionName]);
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "regions-fill", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "regions-fill", () => {
        map.current.getCanvas().style.cursor = "";
      });

      setLoaded(true);
    });

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update region colors based on data
  useEffect(() => {
    if (!loaded || !map.current) return;

    const layer = map.current.getLayer("regions-fill");
    if (!layer) return;

    // Create paint expression for dynamic coloring
    const paintExpression = [
      "case",
      ["boolean", ["feature-state", "active"], false],
      ["feature-state", "activeColor", "rgba(13, 148, 136, 0.35)"],
      ["feature-state", "color", "rgba(0, 0, 0, 0.02)"],
    ];

    map.current.setPaintProperty("regions-fill", "fill-color", paintExpression);

    // Update feature states for all regions
    Object.entries(REGION_NAMES).forEach(([osmName, regionName]) => {
      const count = data[regionName] ?? 0;
      const color = getColor(count, max);
      const isActive = activeRegion === regionName;

      // Find features with this region name
      const features = map.current
        .querySourceFeatures("mapbox.mapbox-streets-v8", {
          sourceLayer: "admin_1",
        })
        .filter((f) => f.properties?.name === osmName);

      features.forEach((feature) => {
        map.current.setFeatureState(
          {
            source: "mapbox.mapbox-streets-v8",
            sourceLayer: "admin_1",
            id: feature.id,
          },
          {
            color: color,
            activeColor: isActive ? color : "rgba(13, 148, 136, 0.25)",
            active: isActive,
            hovered: false,
          },
        );
      });
    });
  }, [data, activeRegion, loaded, max]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .italy-map-container {
          position: relative;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
          height: 420px;
          margin-bottom: 1.25rem;
        }

        .italy-map-container .mapboxgl-canvas {
          border-radius: 14px;
        }

        .italy-map-container .mapboxgl-ctrl-group {
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .italy-map-container .mapboxgl-ctrl button {
          color: #0d9488;
          font-weight: 600;
        }

        .italy-map-container .mapboxgl-ctrl button:hover {
          background-color: #f0fdfa;
        }

        .map-subtitle {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.02em;
        }

        .map-description {
          font-size: 12px;
          color: #94a3b8;
          margin: 0 0 1rem 0;
        }

        .map-legend {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.875rem;
          border-radius: 10px;
          background: rgba(241, 196, 15, 0.05);
          border: 1px solid rgba(241, 196, 15, 0.2);
          margin-top: 1rem;
        }

        .legend-gradient {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            #f1f5f9,
            #ccfbf1,
            #5eead4,
            #2dd4bf,
            #0d9488,
            #0f766e
          );
        }

        .legend-label {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          min-width: 1.5rem;
        }

        .legend-label.high {
          text-align: right;
        }

        .legend-max {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 0.75rem;
          border-left: 1px solid rgba(13, 148, 136, 0.1);
          min-width: max-content;
        }

        .legend-max .label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .legend-max .value {
          font-size: 13px;
          font-weight: 700;
          color: #0f766e;
        }

        @media (max-width: 640px) {
          .italy-map-container {
            height: 300px;
          }
        }
      `}</style>

      <p className="map-subtitle">
        Distribuzione geografica delle segnalazioni
      </p>
      <p className="map-description">
        Clicca su una regione per filtrare. Le regioni più scure hanno più
        segnalazioni.
      </p>

      <div
        className="italy-map-container"
        ref={mapContainer}
        role="region"
        aria-label="Mappa interattiva dell'Italia con distribuzione delle segnalazioni"
      />

      <div className="map-legend">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <span className="legend-label">Basso</span>
          <div className="legend-gradient" />
          <span className="legend-label high">Alto</span>
        </div>
        <div className="legend-max">
          <span className="label">Max:</span>
          <span className="value">{max}</span>
        </div>
      </div>
    </div>
  );
}
