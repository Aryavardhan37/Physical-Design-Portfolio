import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/* ═══════ RTL to GDSII Flow Animation ═══════ */
export function RTLtoGDSII() {
  const { isDark } = useTheme();
  const [step, setStep] = useState(0);
  const accent = isDark ? "#00f0ff" : "#0066cc";
  const green = isDark ? "#00ff88" : "#009955";
  const pink = isDark ? "#ff00aa" : "#cc0088";
  const gold = isDark ? "#ffd700" : "#cc9900";
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";
  const cardBg = isDark ? "#14142a" : "#e8e8f0";
  const lineDim = isDark ? "#1a1a2e" : "#d0d0d8";

  const stages = [
    { label: "RTL", icon: "{ }", color: accent, desc: "Verilog / VHDL" },
    { label: "Synthesis", icon: "⚙", color: green, desc: "Gate-level netlist" },
    { label: "Floorplan", icon: "▣", color: pink, desc: "Powerplanning + Placing the macros" },
    { label: "Place", icon: "⊞", color: gold, desc: "Std cells placed" },
    { label: "CTS", icon: "🕐", color: accent, desc: "Clock tree built" },
    { label: "Route", icon: "⟿", color: green, desc: "Metal wires" },
    { label: "Signoff", icon: "✓", color: pink, desc: "DRC/PERC/CNOD/LVS/STA" },
    { label: "GDSII", icon: "◆", color: gold, desc: "Tape-out!" },
  ];

  // Left column: 0,1,2,3 top→bottom
  // Right column: 7,6,5,4 top→bottom (so GDSII at top, CTS at bottom — arrow connects Place→CTS)
  const leftIdx = [0, 1, 2, 3];
  const rightIdx = [7, 6, 5, 4];

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (stages.length + 1)), 1200);
    return () => clearInterval(id);
  }, []);

  const renderNode = (idx) => {
    const s = stages[idx];
    const active = idx <= step;
    const isCurrent = idx === step;
    return (
      <div className="flex items-center gap-3" style={{ minHeight: "48px" }}>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
          style={{
            background: active ? s.color + "22" : cardBg,
            border: `2px solid ${active ? s.color : "transparent"}`,
            color: s.color,
            boxShadow: isCurrent ? `0 0 18px ${s.color}44` : "none",
            opacity: active ? 1 : 0.25,
            transition: "all 0.5s ease",
          }}
        >
          {s.icon}
        </div>
        <div className="flex flex-col" style={{ opacity: active ? 1 : 0.25, transition: "opacity 0.5s ease" }}>
          <span className="text-xs font-mono font-bold" style={{ color: active ? s.color : isDark ? "#333" : "#bbb" }}>
            {s.label}
          </span>
          <span className="text-[10px] font-mono" style={{ color: isDark ? "#555" : "#999" }}>
            {s.desc}
          </span>
        </div>
      </div>
    );
  };

  const renderVLine = (fromIdx, toIdx) => {
    const active = Math.min(fromIdx, toIdx) < step;
    const c1 = stages[fromIdx]?.color || accent;
    const c2 = stages[toIdx]?.color || accent;
    return (
      <div className="flex justify-start" style={{ paddingLeft: "20px", height: "16px" }}>
        <div
          className="w-0.5 h-full rounded"
          style={{
            background: active ? `linear-gradient(180deg, ${c1}, ${c2})` : lineDim,
            transition: "background 0.5s ease",
          }}
        />
      </div>
    );
  };

  const bridgeActive = step >= 4;

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      <p className="text-xs font-mono mb-5 text-center" style={{ color: isDark ? "#555" : "#999" }}>
        RTL → GDSII Flow (auto-playing)
      </p>

      <div className="flex justify-center">
        {/* Left column */}
        <div className="flex flex-col" style={{ width: "170px" }}>
          {leftIdx.map((idx, i) => (
            <div key={idx}>
              {renderNode(idx)}
              {i < leftIdx.length - 1 && renderVLine(leftIdx[i], leftIdx[i + 1])}
            </div>
          ))}
        </div>

        {/* Bridge arrow — aligned to bottom row */}
        <div className="flex flex-col justify-end" style={{ width: "60px", paddingBottom: "16px" }}>
          <div className="flex items-center justify-center">
            <div
              className="h-0.5 rounded"
              style={{
                width: "32px",
                background: bridgeActive
                  ? `linear-gradient(90deg, ${gold}, ${accent})`
                  : lineDim,
                transition: "background 0.5s ease",
              }}
            />
            <div style={{
              width: 0, height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: `8px solid ${bridgeActive ? accent : lineDim}`,
              transition: "border-left-color 0.5s ease",
            }} />
          </div>
        </div>

        {/* Right column — same structure, aligned rows */}
        <div className="flex flex-col" style={{ width: "170px" }}>
          {rightIdx.map((idx, i) => (
            <div key={idx}>
              {renderNode(idx)}
              {i < rightIdx.length - 1 && renderVLine(rightIdx[i], rightIdx[i + 1])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════ Floorplan Visualization ═══════ */
export function FloorplanViz() {
  const { isDark } = useTheme();
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";
  const accent = isDark ? "#00f0ff" : "#0066cc";
  const dimLine = isDark ? "#1a1a2e" : "#d0d0d8";
  const ringColor = isDark ? "#ffd700" : "#cc9900";
  const strapColor = isDark ? "#00ff88" : "#009955";
  const railColor = isDark ? "#00f0ff" : "#0066cc";
  const macroColor1 = "#ff00aa";
  const macroColor2 = "#00f0ff";
  const macroColor3 = "#ffd700";
  const macroColor4 = "#00ff88";

  // Phases: 0=Die, 1=Power Rings, 2=Straps, 3=Rails, 4=Macros, 5=Std Cell + IO
  const phaseLabels = [
    "Die boundary defined",
    "Power rings (VDD/VSS) on upper metals",
    "Power straps across the core",
    "Follow pins / Standard cell rails (M1)",
    "Macro placement with constraints/guidelines",
    "Floorplan complete \u2713",
  ];
  const phaseColors = ["#555", ringColor, strapColor, railColor, macroColor1, "#00ff88"];
  const pillLabels = ["Die", "Rings", "Straps", "Rails", "Macros", "Done"];

  useEffect(() => {
    const timings = [2000, 2500, 2500, 2500, 3000, 3000];
    const id = setTimeout(() => {
      setPhase((p) => (p + 1) % 6);
      setTick((t) => t + 1);
    }, timings[phase]);
    return () => clearTimeout(id);
  }, [phase, tick]);

  const show = (minPhase) => phase >= minPhase;
  const isCurrent = (p) => phase === p;

  // Macro data with placement constraints annotations
  const macros = [
    { id: "B1", label: "Block 1", x: 8, y: 10, w: 22, h: 28, color: macroColor1, orient: "R0", note: "Near IO pins" },
    { id: "B2", label: "Block 2", x: 70, y: 10, w: 22, h: 28, color: macroColor2, orient: "MY", note: "Mirrored Y" },
    { id: "B3", label: "Block 3", x: 8, y: 62, w: 18, h: 18, color: macroColor3, orient: "R0", note: "Connectivity" },
    { id: "B4", label: "Block 4", x: 74, y: 65, w: 18, h: 15, color: macroColor4, orient: "R180", note: "Area fit" },
    { id: "B5", label: "Block 5", x: 35, y: 8, w: 28, h: 12, color: macroColor2, orient: "R90", note: "Channel spacing" },
  ];

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      {/* Phase indicator pills */}
      <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
        {pillLabels.map((lbl, p) => (
          <div
            key={p}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all duration-500"
            style={{
              background: show(p) ? phaseColors[p] + "22" : "transparent",
              border: `1px solid ${show(p) ? phaseColors[p] + "66" : "transparent"}`,
              color: show(p) ? phaseColors[p] : (isDark ? "#333" : "#ccc"),
              fontWeight: isCurrent(p) ? 700 : 400,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: show(p) ? phaseColors[p] : (isDark ? "#333" : "#ccc"), transition: "background 0.5s" }}
            />
            {lbl}
          </div>
        ))}
      </div>

      <svg viewBox="0 0 100 105" className="w-full max-w-md mx-auto" style={{ maxHeight: "380px" }}>

        {/* ═══ PHASE 0: Die boundary + IO pads ═══ */}
        <rect x="3" y="3" width="94" height="94" rx="1.5"
          fill="none" stroke={accent + (show(0) ? "55" : "00")} strokeWidth="1.2"
          style={{ transition: "stroke 0.8s ease" }}
        />
        {/* Corner markers */}
        {[[3,3],[97,3],[3,97],[97,97]].map(([cx,cy], i) => (
          <circle key={`c${i}`} cx={cx} cy={cy} r="1" fill={accent}
            opacity={show(0) ? 0.6 : 0} style={{ transition: "opacity 0.8s" }} />
        ))}
        {/* IO pads */}
        {show(0) && Array.from({ length: 14 }, (_, i) => (
          <g key={`pad${i}`}>
            {/* Top */}
            <rect x={8 + i * 6.2} y="3" width="4" height="2.5" rx="0.4"
              fill={isDark ? "#2a3a4a" : "#9999bb"} opacity="0.7"
              style={{ transition: "opacity 0.5s", transitionDelay: `${i * 30}ms` }} />
            {/* Bottom */}
            <rect x={8 + i * 6.2} y="94.5" width="4" height="2.5" rx="0.4"
              fill={isDark ? "#2a3a4a" : "#9999bb"} opacity="0.7"
              style={{ transition: "opacity 0.5s", transitionDelay: `${i * 30}ms` }} />
          </g>
        ))}
        {show(0) && Array.from({ length: 10 }, (_, i) => (
          <g key={`padv${i}`}>
            {/* Left */}
            <rect x="3" y={10 + i * 8.2} width="2.5" height="4" rx="0.4"
              fill={isDark ? "#2a3a4a" : "#9999bb"} opacity="0.7"
              style={{ transition: "opacity 0.5s", transitionDelay: `${i * 30}ms` }} />
            {/* Right */}
            <rect x="94.5" y={10 + i * 8.2} width="2.5" height="4" rx="0.4"
              fill={isDark ? "#2a3a4a" : "#9999bb"} opacity="0.7"
              style={{ transition: "opacity 0.5s", transitionDelay: `${i * 30}ms` }} />
          </g>
        ))}

        {/* ═══ PHASE 1: Power Rings (VDD outer, VSS inner) ═══ */}
        {/* Outer ring — VDD */}
        <rect x="6" y="6" width="88" height="88" rx="1"
          fill="none" stroke={ringColor} strokeWidth={isCurrent(1) ? "1.2" : "0.8"}
          opacity={show(1) ? 0.85 : 0}
          style={{ transition: "all 0.8s ease" }}
        >
          {isCurrent(1) && (
            <animate attributeName="stroke-dashoffset" from="0" to="-352" dur="3s" repeatCount="indefinite" />
          )}
        </rect>
        {show(1) && (
          <text x="50" y="5.5" textAnchor="middle" fontSize="2" fontFamily="monospace" fill={ringColor} opacity="0.7">VDD Ring (upper metal)</text>
        )}

        {/* Inner ring — VSS */}
        <rect x="8" y="8" width="84" height="84" rx="1"
          fill="none" stroke={ringColor} strokeWidth={isCurrent(1) ? "1" : "0.6"}
          opacity={show(1) ? 0.6 : 0}
          strokeDasharray="2 1"
          style={{ transition: "all 0.8s ease" }}
        >
          {isCurrent(1) && (
            <animate attributeName="stroke-dashoffset" from="0" to="336" dur="4s" repeatCount="indefinite" />
          )}
        </rect>
        {show(1) && (
          <text x="50" y="93.5" textAnchor="middle" fontSize="2" fontFamily="monospace" fill={ringColor} opacity="0.5">VSS Ring</text>
        )}

        {/* ═══ PHASE 2: Power Straps (vertical, across core) ═══ */}
        {show(2) && Array.from({ length: 8 }, (_, i) => {
          const x = 14 + i * 10;
          const delay = i * 150;
          return (
            <g key={`strap${i}`}>
              <line
                x1={x} y1="9" x2={x} y2="91"
                stroke={strapColor}
                strokeWidth={isCurrent(2) ? "0.8" : "0.5"}
                opacity={show(2) ? 0.65 : 0}
                strokeDasharray={i % 2 === 0 ? "none" : "2 1.5"}
                style={{ transition: `opacity 0.5s ease ${delay}ms` }}
              />
              {/* Strap label at top */}
              {i === 0 && (
                <text x={x} y="8" textAnchor="middle" fontSize="1.8" fontFamily="monospace" fill={strapColor} opacity="0.6">
                  VDD
                </text>
              )}
              {i === 1 && (
                <text x={x} y="8" textAnchor="middle" fontSize="1.8" fontFamily="monospace" fill={strapColor} opacity="0.6">
                  VSS
                </text>
              )}
            </g>
          );
        })}

        {/* ═══ PHASE 3: Standard Cell Rails (horizontal, M1, fine pitch) ═══ */}
        {show(3) && Array.from({ length: 22 }, (_, i) => {
          const y = 24 + i * 3.2;
          if (y > 89) return null;
          const isVDD = i % 2 === 0;
          return (
            <line
              key={`rail${i}`}
              x1="9" y1={y} x2="91" y2={y}
              stroke={railColor}
              strokeWidth="0.25"
              opacity={show(3) ? (isCurrent(3) ? 0.5 : 0.3) : 0}
              style={{ transition: `opacity 0.4s ease ${i * 40}ms` }}
            />
          );
        })}
        {show(3) && (
          <text x="93" y="26" fontSize="1.6" fontFamily="monospace" fill={railColor} opacity="0.5">
            M1 rails
          </text>
        )}

        {/* ═══ PHASE 4: Macro Placement ═══ */}
        {macros.map((m, i) => {
          const visible = show(4);
          const delay = i * 300;
          return (
            <g key={m.id}>
              {/* Macro body */}
              <rect
                x={m.x} y={m.y} width={m.w} height={m.h} rx="1"
                fill={m.color + (visible ? "25" : "00")}
                stroke={m.color + (visible ? "88" : "00")}
                strokeWidth="0.7"
                style={{ transition: `all 0.6s ease ${delay}ms` }}
              />
              {/* Macro hatch pattern (internal detail) */}
              {visible && Array.from({ length: Math.floor(m.h / 3) }, (_, j) => (
                <line
                  key={`h${i}${j}`}
                  x1={m.x + 1} y1={m.y + 2 + j * 3}
                  x2={m.x + m.w - 1} y2={m.y + 2 + j * 3}
                  stroke={m.color + "22"} strokeWidth="0.3"
                  style={{ transition: `opacity 0.4s ease ${delay + 200}ms` }}
                />
              ))}
              {/* Macro label */}
              <text
                x={m.x + m.w / 2} y={m.y + m.h / 2 + 1}
                textAnchor="middle" fontSize="3" fontFamily="monospace" fontWeight="bold"
                fill={m.color}
                opacity={visible ? 0.85 : 0}
                style={{ transition: `opacity 0.5s ease ${delay}ms` }}
              >
                {m.label}
              </text>
              {/* Orientation badge */}
              <text
                x={m.x + m.w - 1} y={m.y + 3}
                textAnchor="end" fontSize="1.8" fontFamily="monospace"
                fill={m.color}
                opacity={visible ? 0.5 : 0}
                style={{ transition: `opacity 0.5s ease ${delay + 100}ms` }}
              >
                {m.orient}
              </text>
              {/* Constraint annotation */}
              {visible && isCurrent(4) && (
                <text
                  x={m.x + m.w / 2} y={m.y + m.h / 2 + 4.5}
                  textAnchor="middle" fontSize="1.8" fontFamily="monospace"
                  fill={m.color} opacity="0.45"
                >
                  {m.note}
                </text>
              )}
              {/* Macro pins (small ticks on edges) */}
              {visible && Array.from({ length: Math.floor(m.w / 4) }, (_, p) => (
                <rect
                  key={`pin${i}t${p}`}
                  x={m.x + 2 + p * 4} y={m.y - 0.5}
                  width="1.5" height="1" rx="0.2"
                  fill={m.color + "55"}
                  style={{ transition: `opacity 0.3s ease ${delay + 300}ms` }}
                />
              ))}
              {visible && Array.from({ length: Math.floor(m.w / 4) }, (_, p) => (
                <rect
                  key={`pin${i}b${p}`}
                  x={m.x + 2 + p * 4} y={m.y + m.h - 0.5}
                  width="1.5" height="1" rx="0.2"
                  fill={m.color + "55"}
                  style={{ transition: `opacity 0.3s ease ${delay + 300}ms` }}
                />
              ))}
              {/* Keepout zone (dashed) */}
              {visible && (
                <rect
                  x={m.x - 1.5} y={m.y - 1.5} width={m.w + 3} height={m.h + 3} rx="1.5"
                  fill="none" stroke={m.color + "22"} strokeWidth="0.3" strokeDasharray="1.5 1"
                  style={{ transition: `opacity 0.5s ease ${delay + 100}ms` }}
                />
              )}
            </g>
          );
        })}

        {/* ═══ PHASE 5: Std Cell Area + channel markers ═══ */}
        {show(5) && (
          <>
            {/* Std cell region */}
            <rect x="28" y="42" width="40" height="36" rx="1"
              fill={accent + "08"} stroke={accent + "33"} strokeWidth="0.5" strokeDasharray="3 2"
              style={{ transition: "opacity 0.8s" }}
            />
            <text x="48" y="62" textAnchor="middle" fontSize="3" fontFamily="monospace" fill={accent} opacity="0.5">
              Std Cell Area
            </text>

            {/* Channel spacing annotations */}
            {/* Horizontal channel between top macros and middle */}
            <line x1="30" y1="40" x2="62" y2="40" stroke={accent + "44"} strokeWidth="0.3" strokeDasharray="1 1" />
            <text x="46" y="39" textAnchor="middle" fontSize="1.6" fontFamily="monospace" fill={accent} opacity="0.4">
              routing channel
            </text>

            {/* Vertical channel between left macros and std cell */}
            <line x1="27" y1="42" x2="27" y2="78" stroke={accent + "44"} strokeWidth="0.3" strokeDasharray="1 1" />
            <text x="27" y="85" textAnchor="middle" fontSize="1.6" fontFamily="monospace" fill={accent} opacity="0.4">
              channel
            </text>
          </>
        )}

        {/* Die label */}
        <text x="50" y="99" textAnchor="middle" fontSize="2" fontFamily="monospace"
          fill={isDark ? "#444" : "#aaa"}>
          Die — IO Pads — Power Grid — Hard Macros — Core Area
        </text>
      </svg>

      {/* Status bar */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-1.5 rounded-full flex-1 max-w-xs" style={{ background: isDark ? "#1a1a2e" : "#d0d0d8" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(phase / 5) * 100}%`,
              background: `linear-gradient(90deg, ${ringColor}, ${strapColor}, ${railColor}, ${macroColor1}, #00ff88)`,
            }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color: phaseColors[phase] }}>
          {phaseLabels[phase]}
        </span>
      </div>
    </div>
  );
}

/* ═══════ Placement Animation ═══════ */
export function PlacementAnim() {
  const { isDark } = useTheme();
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";
  const accent = isDark ? "#00f0ff" : "#0066cc";
  const rowColor = isDark ? "#1a1a2e" : "#d0d0d8";
  const siteColor = isDark ? "#111122" : "#e4e4ec";

  const ROW_Y = [14, 30, 46, 62, 78];
  const ROW_H = 12;
  const CX = 8;
  const CW = 84;

  // Final placement — no overlaps, snapped to rows
  const cells = [
    { w: 12, row: 0, fx: 9,  color: "#00f0ff" },
    { w: 18, row: 0, fx: 23, color: "#ff00aa" },
    { w: 10, row: 0, fx: 43, color: "#00ff88" },
    { w: 16, row: 0, fx: 55, color: "#ffd700" },
    { w: 18, row: 0, fx: 73, color: "#00f0ff" },
    { w: 20, row: 1, fx: 9,  color: "#ffd700" },
    { w: 14, row: 1, fx: 31, color: "#00f0ff" },
    { w: 22, row: 1, fx: 47, color: "#ff00aa" },
    { w: 20, row: 1, fx: 71, color: "#00ff88" },
    { w: 16, row: 2, fx: 9,  color: "#00ff88" },
    { w: 24, row: 2, fx: 27, color: "#ffd700" },
    { w: 10, row: 2, fx: 53, color: "#ff00aa" },
    { w: 14, row: 2, fx: 65, color: "#00f0ff" },
    { w: 10, row: 2, fx: 81, color: "#00ff88" },
    { w: 26, row: 3, fx: 9,  color: "#ff00aa" },
    { w: 12, row: 3, fx: 37, color: "#00f0ff" },
    { w: 18, row: 3, fx: 51, color: "#ffd700" },
    { w: 20, row: 3, fx: 71, color: "#00ff88" },
    { w: 14, row: 4, fx: 9,  color: "#00f0ff" },
    { w: 22, row: 4, fx: 25, color: "#ff00aa" },
    { w: 12, row: 4, fx: 49, color: "#ffd700" },
    { w: 10, row: 4, fx: 63, color: "#00ff88" },
    { w: 16, row: 4, fx: 75, color: "#00f0ff" },
  ];

  // Pre-compute random + legalized positions (stable across renders)
  const rng = (seed) => (Math.sin(seed * 9876.54 + 1234) * 0.5 + 0.5);

  const getPos = (c, i) => {
    if (phase === 0) {
      return { x: 5 + rng(i * 3) * 75, y: 8 + rng(i * 7 + 1) * 72 };
    }
    if (phase === 1) {
      const shift = (rng(i * 5 + 99) - 0.5) * 30;
      return {
        x: Math.max(CX, Math.min(CX + CW - c.w, c.fx + shift)),
        y: ROW_Y[c.row] + 0.75,
      };
    }
    return { x: c.fx, y: ROW_Y[c.row] + 0.75 };
  };

  useEffect(() => {
    const t = [2500, 2000, 3000][phase];
    const id = setTimeout(() => { setPhase((p) => (p + 1) % 3); setTick((k) => k + 1); }, t);
    return () => clearTimeout(id);
  }, [phase, tick]);

  const labels = [
    "Global Placement \u2014 cells scattered",
    "Legalization \u2014 snapping to site rows\u2026",
    "Detailed Placement \u2014 optimized \u2713",
  ];
  const pColors = [
    isDark ? "#ff4444" : "#cc0000",
    isDark ? "#ffd700" : "#cc9900",
    isDark ? "#00ff88" : "#009955",
  ];

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      {/* Phase pills */}
      <div className="flex items-center justify-center gap-3 mb-5">
        {["Scatter", "Legalize", "Place"].map((lbl, p) => (
          <div key={p} className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono"
            style={{
              background: phase === p ? pColors[p] + "22" : "transparent",
              border: `1px solid ${phase === p ? pColors[p] + "66" : isDark ? "#222" : "#ddd"}`,
              color: phase === p ? pColors[p] : isDark ? "#444" : "#aaa",
              fontWeight: phase === p ? 700 : 400,
              transition: "all 0.5s ease",
            }}>
            <div className="w-2 h-2 rounded-full" style={{
              background: phase === p ? pColors[p] : isDark ? "#333" : "#ccc",
              transition: "background 0.5s ease",
            }} />
            {lbl}
          </div>
        ))}
      </div>

      <svg viewBox="0 0 100 100" className="w-full max-w-lg mx-auto" style={{ maxHeight: "340px" }}>
        {/* Core boundary */}
        <rect x={CX - 2} y="6" width={CW + 4} height="90" rx="2"
          fill="none" stroke={accent + "33"} strokeWidth="0.8" strokeDasharray="3 2" />

        {/* Site rows */}
        {ROW_Y.map((y, i) => (
          <g key={`r${i}`}>
            <rect x={CX} y={y} width={CW} height={ROW_H} rx="0.5"
              fill={siteColor} style={{ opacity: phase === 0 ? 0.25 : 0.55, transition: "opacity 0.8s" }} />
            <line x1={CX} y1={y} x2={CX + CW} y2={y}
              stroke={rowColor} strokeWidth="0.4" strokeDasharray="2 1.5"
              style={{ opacity: phase === 0 ? 0.2 : 0.6, transition: "opacity 0.8s" }} />
            <line x1={CX} y1={y + ROW_H} x2={CX + CW} y2={y + ROW_H}
              stroke={rowColor} strokeWidth="0.4" strokeDasharray="2 1.5"
              style={{ opacity: phase === 0 ? 0.2 : 0.6, transition: "opacity 0.8s" }} />
            <text x={CX - 1} y={y + ROW_H / 2 + 1} textAnchor="end" fontSize="2.5"
              fontFamily="monospace" fill={accent}
              style={{ opacity: phase === 0 ? 0.2 : 0.5, transition: "opacity 0.8s" }}>
              R{i}
            </text>
            <text x={CX + CW + 1} y={y + 3} fontSize="1.6" fontFamily="monospace"
              fill={isDark ? "#00f0ff28" : "#0066cc28"}>VDD</text>
            <text x={CX + CW + 1} y={y + ROW_H - 0.5} fontSize="1.6" fontFamily="monospace"
              fill={isDark ? "#ff00aa28" : "#cc008828"}>VSS</text>
          </g>
        ))}

        {/* Site ticks (visible in phase 1+) */}
        {phase > 0 && ROW_Y.map((y, ri) =>
          Array.from({ length: Math.floor(CW / 4) }, (_, si) => (
            <line key={`t${ri}_${si}`}
              x1={CX + si * 4} y1={y} x2={CX + si * 4} y2={y + 1.2}
              stroke={rowColor} strokeWidth="0.2" opacity="0.4" />
          ))
        )}

        {/* Cells */}
        {cells.map((c, i) => {
          const pos = getPos(c, i);
          const cellH = ROW_H - 1.5;
          const bright = phase === 2;

          return (
            <g key={i}>
              <rect
                x={pos.x} y={pos.y} width={c.w} height={cellH} rx="0.8"
                fill={c.color + (bright ? "22" : "12")}
                stroke={c.color + (bright ? "88" : "44")}
                strokeWidth={bright ? "0.5" : "0.3"}
                style={{ transition: "x 1.2s cubic-bezier(.4,1.6,.6,1), y 1.2s cubic-bezier(.4,1.6,.6,1), fill 0.6s, stroke 0.6s" }}
              />
              {/* Pin dots */}
              <circle cx={pos.x + c.w * 0.3} cy={pos.y + 1} r="0.5"
                fill={c.color + (bright ? "66" : "22")}
                style={{ transition: "cx 1.2s cubic-bezier(.4,1.6,.6,1), cy 1.2s cubic-bezier(.4,1.6,.6,1), fill 0.6s" }}
              />
              <circle cx={pos.x + c.w * 0.7} cy={pos.y + 1} r="0.5"
                fill={c.color + (bright ? "66" : "22")}
                style={{ transition: "cx 1.2s cubic-bezier(.4,1.6,.6,1), cy 1.2s cubic-bezier(.4,1.6,.6,1), fill 0.6s" }}
              />
            </g>
          );
        })}

        {/* Status */}
        <text x="50" y="95" textAnchor="middle" fontSize="2.5" fontFamily="monospace"
          fill={pColors[phase]} style={{ transition: "fill 0.5s" }}>
          {labels[phase]}
        </text>
      </svg>
    </div>
  );
}

/* ═══════ Clock Tree Visualization ═══════ */
export function ClockTreeViz() {
  const { isDark } = useTheme();
  const [pulse, setPulse] = useState(0);
  const accent = isDark ? "#00f0ff" : "#0066cc";
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const buffers = [
    { x: 50, y: 10, level: 0 },
    { x: 25, y: 30, level: 1 }, { x: 75, y: 30, level: 1 },
    { x: 12, y: 55, level: 2 }, { x: 38, y: 55, level: 2 },
    { x: 62, y: 55, level: 2 }, { x: 88, y: 55, level: 2 },
  ];

  const flops = [
    5, 19, 31, 45, 55, 69, 81, 95
  ].map((x) => ({ x, y: 80 }));

  const getOpacity = (level) => {
    const phase = (pulse - level * 25 + 100) % 100;
    return phase < 30 ? 0.4 + (phase / 30) * 0.6 : phase < 60 ? 1 : 1 - ((phase - 60) / 40) * 0.6;
  };

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      <p className="text-xs font-mono mb-4 text-center" style={{ color: isDark ? "#555" : "#999" }}>
        Clock Tree — signal propagation from root to flip-flops
      </p>
      <svg viewBox="0 0 100 95" className="w-full max-w-lg mx-auto" style={{ maxHeight: "280px" }}>
        {/* Lines from root to L1 */}
        <line x1="50" y1="14" x2="25" y2="28" stroke={accent} strokeWidth="0.6" opacity={getOpacity(0)} />
        <line x1="50" y1="14" x2="75" y2="28" stroke={accent} strokeWidth="0.6" opacity={getOpacity(0)} />

        {/* Lines from L1 to L2 */}
        <line x1="25" y1="34" x2="12" y2="53" stroke={accent} strokeWidth="0.5" opacity={getOpacity(1)} />
        <line x1="25" y1="34" x2="38" y2="53" stroke={accent} strokeWidth="0.5" opacity={getOpacity(1)} />
        <line x1="75" y1="34" x2="62" y2="53" stroke={accent} strokeWidth="0.5" opacity={getOpacity(1)} />
        <line x1="75" y1="34" x2="88" y2="53" stroke={accent} strokeWidth="0.5" opacity={getOpacity(1)} />

        {/* Lines from L2 to flops */}
        {[0, 1].map((j) => (
          <line key={`l0${j}`} x1="12" y1="59" x2={flops[j].x} y2="78" stroke={accent} strokeWidth="0.3" opacity={getOpacity(2)} />
        ))}
        {[2, 3].map((j) => (
          <line key={`l1${j}`} x1="38" y1="59" x2={flops[j].x} y2="78" stroke={accent} strokeWidth="0.3" opacity={getOpacity(2)} />
        ))}
        {[4, 5].map((j) => (
          <line key={`l2${j}`} x1="62" y1="59" x2={flops[j].x} y2="78" stroke={accent} strokeWidth="0.3" opacity={getOpacity(2)} />
        ))}
        {[6, 7].map((j) => (
          <line key={`l3${j}`} x1="88" y1="59" x2={flops[j].x} y2="78" stroke={accent} strokeWidth="0.3" opacity={getOpacity(2)} />
        ))}

        {/* Buffers */}
        {buffers.map((b, i) => (
          <g key={`buf${i}`}>
            <polygon
              points={`${b.x - 4},${b.y - 3} ${b.x + 4},${b.y} ${b.x - 4},${b.y + 3}`}
              fill={accent + "22"} stroke={accent} strokeWidth="0.6"
              opacity={getOpacity(b.level)}
            />
          </g>
        ))}

        {/* Flip-flops */}
        {flops.map((f, i) => (
          <g key={`ff${i}`}>
            <rect x={f.x - 3} y={f.y - 3} width="6" height="6" rx="0.8"
              fill={isDark ? "#ff00aa22" : "#ff00aa33"}
              stroke="#ff00aa" strokeWidth="0.5"
              opacity={getOpacity(3)}
            />
            <text x={f.x} y={f.y + 1} textAnchor="middle" fontSize="2.5"
              fontFamily="monospace" fill="#ff00aa" opacity={getOpacity(3)}>
              FF
            </text>
          </g>
        ))}

        {/* Labels */}
        <text x="50" y="7" textAnchor="middle" fontSize="3" fontFamily="monospace" fill={accent} fontWeight="bold">CLK Root</text>
        <text x="50" y="93" textAnchor="middle" fontSize="2.5" fontFamily="monospace" fill={isDark ? "#444" : "#aaa"}>
          ▲ buffers   ◻ flip-flops   — clock signal
        </text>
      </svg>
    </div>
  );
}

/* ═══════ Routing Animation ═══════ */
export function RoutingAnim() {
  const { isDark } = useTheme();
  const [activeLayer, setActiveLayer] = useState(0);
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";
  const gridColor = isDark ? "#111122" : "#e0e0e8";
  const labelColor = isDark ? "#333" : "#bbb";
  const viaGlow = isDark ? 0.8 : 0.5;

  // 8 metal layers (M1–M8) alternating H/V with colors
  // Real PD: odd metals horizontal, even metals vertical (simplified)
  const layers = [
    { id: "M1",  color: "#00f0ff", dir: "H", y1: 75, x1: 10, x2: 45 },
    { id: "M2",  color: "#00ff88", dir: "V", x1: 45, y1: 75, y2: 55 },
    { id: "M3",  color: "#ff00aa", dir: "H", y1: 55, x1: 45, x2: 78 },
    { id: "M4",  color: "#ffd700", dir: "V", x1: 78, y1: 55, y2: 35 },
    { id: "M5",  color: "#00f0ff", dir: "H", y1: 35, x1: 78, x2: 50 },
    { id: "M6",  color: "#00ff88", dir: "V", x1: 50, y1: 35, y2: 18 },
    { id: "M7",  color: "#ff00aa", dir: "H", y1: 18, x1: 50, x2: 85 },
    { id: "M8",  color: "#ffd700", dir: "V", x1: 85, y1: 18, y2: 8  },
  ];

  // Vias sit between consecutive layers at the junction point
  const vias = layers.slice(0, -1).map((l, i) => {
    const next = layers[i + 1];
    // Via is at the end of current layer / start of next
    if (l.dir === "H") {
      return { x: l.x2, y: l.y1, color: next.color, label: `V${i + 1}` };
    } else {
      return { x: l.x1, y: l.y2, color: next.color, label: `V${i + 1}` };
    }
  });

  // Animate: show one layer at a time, then its via drops in
  // Total steps: layer0, via0, layer1, via1, ... layer7, done, pause, reset
  const totalSteps = layers.length * 2 + 2; // +1 for final hold, +1 for reset gap

  useEffect(() => {
    const id = setInterval(() => {
      setActiveLayer((s) => (s + 1) % totalSteps);
    }, 600);
    return () => clearInterval(id);
  }, []);

  const getLayerVisible = (i) => activeLayer >= i * 2;
  const getViaVisible = (i) => activeLayer >= i * 2 + 1;

  // Progress: which metal layer is currently being drawn
  const currentMetal = Math.floor(activeLayer / 2);
  const isDrawingVia = activeLayer % 2 === 1;

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      <p className="text-xs font-mono mb-2 text-center" style={{ color: isDark ? "#555" : "#999" }}>
        Metal Routing — layer by layer with vias
      </p>

      {/* Layer legend */}
      <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
        {layers.map((l, i) => (
          <span
            key={l.id}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all duration-300"
            style={{
              background: getLayerVisible(i) ? l.color + "22" : "transparent",
              color: getLayerVisible(i) ? l.color : (isDark ? "#333" : "#ccc"),
              border: `1px solid ${getLayerVisible(i) ? l.color + "66" : "transparent"}`,
            }}
          >
            {l.id}
          </span>
        ))}
      </div>

      <svg viewBox="0 0 100 90" className="w-full max-w-lg mx-auto" style={{ maxHeight: "320px" }}>
        {/* Background grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={`g${i}`}>
            <line x1={i * 10 + 5} y1="0" x2={i * 10 + 5} y2="90"
              stroke={gridColor} strokeWidth="0.2" />
            <line x1="0" y1={i * 9 + 5} x2="100" y2={i * 9 + 5}
              stroke={gridColor} strokeWidth="0.2" />
          </g>
        ))}

        {/* Source pin */}
        <circle cx={layers[0].x1} cy={layers[0].y1} r="2"
          fill={layers[0].color + "44"} stroke={layers[0].color} strokeWidth="0.5" />
        <text x={layers[0].x1} y={layers[0].y1 + 5} textAnchor="middle"
          fontSize="2.5" fontFamily="monospace" fill={layers[0].color} opacity="0.7">
          SRC
        </text>

        {/* Destination pin */}
        {getLayerVisible(layers.length - 1) && (
          <>
            <circle cx={layers[layers.length - 1].dir === "V" ? layers[layers.length - 1].x1 : layers[layers.length - 1].x2}
              cy={layers[layers.length - 1].dir === "V" ? layers[layers.length - 1].y2 : layers[layers.length - 1].y1}
              r="2" fill={layers[layers.length - 1].color + "44"} stroke={layers[layers.length - 1].color} strokeWidth="0.5"
              style={{ opacity: getLayerVisible(layers.length - 1) ? 1 : 0, transition: "opacity 0.5s" }} />
            <text
              x={layers[layers.length - 1].x1}
              y={layers[layers.length - 1].y2 - 2}
              textAnchor="middle" fontSize="2.5" fontFamily="monospace"
              fill={layers[layers.length - 1].color} opacity="0.7">
              DST
            </text>
          </>
        )}

        {/* Metal traces — appear one by one */}
        {layers.map((l, i) => {
          const visible = getLayerVisible(i);
          const isCurrent = currentMetal === i && !isDrawingVia;

          if (l.dir === "H") {
            return (
              <g key={l.id}>
                <line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y1}
                  stroke={l.color}
                  strokeWidth={isCurrent ? "1.5" : "1"}
                  opacity={visible ? 1 : 0}
                  strokeDasharray={isCurrent ? "3 1.5" : "none"}
                  style={{ transition: "opacity 0.4s ease" }}
                >
                  {isCurrent && (
                    <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="0.8s" repeatCount="indefinite" />
                  )}
                </line>
                {/* Layer label */}
                <text
                  x={(l.x1 + l.x2) / 2} y={l.y1 - 1.5}
                  textAnchor="middle" fontSize="2.2" fontFamily="monospace" fontWeight="bold"
                  fill={l.color}
                  opacity={visible ? 0.8 : 0}
                  style={{ transition: "opacity 0.4s ease" }}
                >
                  {l.id}
                </text>
                {/* Direction arrow */}
                {visible && (
                  <polygon
                    points={l.x2 > l.x1
                      ? `${l.x2 - 0.5},${l.y1 - 1} ${l.x2 + 1},${l.y1} ${l.x2 - 0.5},${l.y1 + 1}`
                      : `${l.x2 + 0.5},${l.y1 - 1} ${l.x2 - 1},${l.y1} ${l.x2 + 0.5},${l.y1 + 1}`
                    }
                    fill={l.color}
                    opacity="0.6"
                    style={{ transition: "opacity 0.4s ease" }}
                  />
                )}
              </g>
            );
          } else {
            // Vertical
            return (
              <g key={l.id}>
                <line
                  x1={l.x1} y1={l.y1} x2={l.x1} y2={l.y2}
                  stroke={l.color}
                  strokeWidth={isCurrent ? "1.5" : "1"}
                  opacity={visible ? 1 : 0}
                  strokeDasharray={isCurrent ? "3 1.5" : "none"}
                  style={{ transition: "opacity 0.4s ease" }}
                >
                  {isCurrent && (
                    <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="0.8s" repeatCount="indefinite" />
                  )}
                </line>
                <text
                  x={l.x1 + 2} y={(l.y1 + l.y2) / 2 + 0.8}
                  fontSize="2.2" fontFamily="monospace" fontWeight="bold"
                  fill={l.color}
                  opacity={visible ? 0.8 : 0}
                  style={{ transition: "opacity 0.4s ease" }}
                >
                  {l.id}
                </text>
                {visible && (
                  <polygon
                    points={l.y2 < l.y1
                      ? `${l.x1 - 1},${l.y2 + 0.5} ${l.x1},${l.y2 - 1} ${l.x1 + 1},${l.y2 + 0.5}`
                      : `${l.x1 - 1},${l.y2 - 0.5} ${l.x1},${l.y2 + 1} ${l.x1 + 1},${l.y2 - 0.5}`
                    }
                    fill={l.color}
                    opacity="0.6"
                    style={{ transition: "opacity 0.4s ease" }}
                  />
                )}
              </g>
            );
          }
        })}

        {/* Vias — drop in between layers */}
        {vias.map((v, i) => {
          const visible = getViaVisible(i);
          const isCurrent = currentMetal === i && isDrawingVia;

          return (
            <g key={v.label}>
              {/* Glow ring */}
              <circle
                cx={v.x} cy={v.y} r={isCurrent ? "3" : "2"}
                fill="none"
                stroke={v.color}
                strokeWidth="0.4"
                opacity={visible ? (isCurrent ? viaGlow : 0.3) : 0}
                style={{ transition: "all 0.4s ease" }}
              >
                {isCurrent && (
                  <animate attributeName="r" values="2;3.5;2" dur="0.8s" repeatCount="indefinite" />
                )}
              </circle>
              {/* Via dot */}
              <circle
                cx={v.x} cy={v.y} r="1.2"
                fill={v.color}
                opacity={visible ? 1 : 0}
                style={{ transition: "opacity 0.3s ease" }}
              />
              {/* Inner highlight */}
              <circle
                cx={v.x - 0.3} cy={v.y - 0.3} r="0.4"
                fill="#ffffff"
                opacity={visible ? 0.6 : 0}
                style={{ transition: "opacity 0.3s ease" }}
              />
              {/* Via label */}
              <text
                x={v.x} y={v.y + 3.5}
                textAnchor="middle" fontSize="1.8" fontFamily="monospace"
                fill={v.color}
                opacity={visible ? 0.7 : 0}
                style={{ transition: "opacity 0.3s ease" }}
              >
                {v.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <text x="50" y="88" textAnchor="middle" fontSize="2.2" fontFamily="monospace" fill={labelColor}>
          ● via &nbsp; ─ metal trace &nbsp; M1(bottom) → M8(top)
        </text>
      </svg>

      {/* Status bar */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-1.5 rounded-full flex-1 max-w-xs" style={{ background: isDark ? "#1a1a2e" : "#d0d0d8" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (activeLayer / (totalSteps - 2)) * 100)}%`,
              background: `linear-gradient(90deg, #00f0ff, #00ff88, #ff00aa, #ffd700)`,
            }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color: isDark ? "#555" : "#999" }}>
          {currentMetal < layers.length
            ? (isDrawingVia ? `Via ${currentMetal + 1} dropped` : `${layers[currentMetal].id} routing...`)
            : "Route complete ✓"
          }
        </span>
      </div>
    </div>
  );
}

/* ═══════ Signoff Checklist ═══════ */
export function SignoffChecklist() {
  const { isDark } = useTheme();
  const [checked, setChecked] = useState(0);
  const bg = isDark ? "#0d0d1a" : "#f0f0f5";
  const green = isDark ? "#00ff88" : "#009955";

  const items = [
    { label: "DRC (Design Rule Check)", tool: "IC Validator" },
    { label: "LVS (Layout vs Schematic)", tool: "IC Validator" },
    { label: "STA (Static Timing)", tool: "PrimeTime" },
    { label: "IR Drop Analysis", tool: "RedHawk-SC" },
    { label: "EM Check", tool: "RedHawk-SC" },
    { label: "Antenna Check", tool: "IC Validator" },
    { label: "ERC (Electrical Rule)", tool: "IC Validator" },
    { label: "GDSII Export", tool: "Fusion Compiler" },
  ];

  useEffect(() => {
    if (checked < items.length) {
      const id = setTimeout(() => setChecked((c) => c + 1), 600);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setChecked(0), 3000);
    return () => clearTimeout(id);
  }, [checked]);

  return (
    <div className="my-10 rounded-2xl p-6" style={{ background: bg, border: `1px solid ${isDark ? "#1a1a2e" : "#d0d0d8"}` }}>
      <p className="text-xs font-mono mb-4 text-center" style={{ color: isDark ? "#555" : "#999" }}>
        Signoff Checklist (auto-playing)
      </p>
      <div className="max-w-md mx-auto space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500"
            style={{
              background: i < checked ? green + "11" : "transparent",
              border: `1px solid ${i < checked ? green + "33" : isDark ? "#1a1a2e" : "#e0e0e8"}`,
              opacity: i < checked ? 1 : i === checked ? 0.7 : 0.3,
              transform: i < checked ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
              style={{
                background: i < checked ? green : "transparent",
                border: `2px solid ${i < checked ? green : isDark ? "#333" : "#ccc"}`,
                color: i < checked ? (isDark ? "#0a0a0f" : "#fff") : "transparent",
              }}
            >
              ✓
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: i < checked ? "var(--text)" : "var(--text-dim)" }}>
                {item.label}
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>
              {item.tool}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}