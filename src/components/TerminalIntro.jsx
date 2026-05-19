import { useState, useEffect, useRef } from "react";

const LINES = [
  { text: "lazarous_pitt_pd> source asic_profile.tcl", color: "#00ff88", delay: 50, pause: 400 },
  { text: "Loading physical design data...", color: "#00ff88", delay: 30, pause: 500 },
  { text: "Extracting IO & Logic structures...", color: "#9ca3af", delay: 30, pause: 400 },
  { text: "Checking timing constraints: [OK]", color: "#9ca3af", delay: 30, pause: 250, hl: "[OK]", hlc: "#00f0ff" },
  { text: "Running place and route iterations: [OK]", color: "#9ca3af", delay: 30, pause: 250, hl: "[OK]", hlc: "#00f0ff" },
  { text: "Verifying signoff parameters: [OK]", color: "#9ca3af", delay: 30, pause: 250, hl: "[OK]", hlc: "#00f0ff" },
  { text: "", color: "#9ca3af", delay: 0, pause: 200 },
  { text: "Aryavardhan_Sharma.profile initialized.", color: "#00ff88", delay: 45, pause: 0, glow: true },
];

export default function TerminalIntro({ onComplete }) {
  const [rendered, setRendered] = useState([]);
  const [fading, setFading] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const skippedRef = useRef(false);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Main typing engine — runs ONCE, uses plain setTimeout chain
  useEffect(() => {
    let cancelled = false;
    const output = [];

    async function sleep(ms) {
      return new Promise(r => {
        timerRef.current = setTimeout(r, ms);
      });
    }

    async function run() {
      for (let li = 0; li < LINES.length; li++) {
        if (cancelled || skippedRef.current) return;
        const line = LINES[li];

        if (line.text === "") {
          output.push({ ...line, typed: "" });
          setRendered([...output]);
          await sleep(line.pause);
          continue;
        }

        output.push({ ...line, typed: "" });
        setRendered([...output]);

        for (let ci = 0; ci < line.text.length; ci++) {
          if (cancelled || skippedRef.current) return;
          output[output.length - 1] = { ...line, typed: line.text.slice(0, ci + 1) };
          setRendered([...output]);
          const jitter = Math.random() * 20 - 10;
          await sleep(Math.max(10, line.delay + jitter));
        }

        if (line.pause > 0) await sleep(line.pause);
      }

      if (cancelled || skippedRef.current) return;
      setDone(true);
      await sleep(700);
      if (cancelled || skippedRef.current) return;
      setFading(true);
      await sleep(800);
      if (!cancelled) onComplete?.();
    }

    run();
    return () => { cancelled = true; clearTimeout(timerRef.current); };
  }, []);

  const handleSkip = () => {
    skippedRef.current = true;
    clearTimeout(timerRef.current);
    setRendered(LINES.map(l => ({ ...l, typed: l.text })));
    setDone(true);
    setTimeout(() => setFading(true), 200);
    setTimeout(() => onComplete?.(), 900);
  };

  const renderLine = (line, i) => {
    if (!line.typed) return <div key={i} className="h-5" />;
    if (line.hl && line.typed.includes(line.hl)) {
      const idx = line.typed.indexOf(line.hl);
      return (
        <div key={i}>
          <span style={{ color: line.color }}>{line.typed.slice(0, idx)}</span>
          <span style={{ color: line.hlc, fontWeight: 700, textShadow: `0 0 8px ${line.hlc}66` }}>{line.hl}</span>
          <span style={{ color: line.color }}>{line.typed.slice(idx + line.hl.length)}</span>
        </div>
      );
    }
    return (
      <div key={i}>
        <span style={{
          color: line.color,
          textShadow: line.glow && line.typed === line.text ? `0 0 12px ${line.color}88` : "none",
        }}>{line.typed}</span>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        fading ? "opacity-0 -translate-y-16 scale-95" : "opacity-100"
      }`}
      style={{ background: "#0a0a12" }}
    >
      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.012) 2px, rgba(0,255,136,0.012) 4px)"
      }} />
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)"
      }} />

      <div className="relative z-20 w-[92vw] max-w-[780px]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-t-xl" style={{ background: "#1c1c34" }}>
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          <span className="ml-3 text-xs tracking-wider" style={{
            color: "#6b7290", fontFamily: '"JetBrains Mono", monospace'
          }}>fc_shell — asic_profile</span>
        </div>

        {/* Body */}
        <div className="p-6 rounded-b-xl" style={{
          background: "#111122",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "14px",
          lineHeight: "1.9",
          border: "1px solid #1c1c34",
          borderTop: "none",
          minHeight: "260px",
        }}>
          {rendered.map((line, i) => renderLine(line, i))}

          {/* Blinking cursor */}
          {!done && (
            <span style={{
              display: "inline-block",
              width: "9px", height: "18px",
              background: cursorVisible ? "#00ff88" : "transparent",
              verticalAlign: "text-bottom",
              marginLeft: "2px",
            }} />
          )}
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-30 px-5 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: "#555",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onMouseEnter={e => { e.target.style.color = "#00f0ff"; e.target.style.borderColor = "#00f0ff33"; }}
        onMouseLeave={e => { e.target.style.color = "#555"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
      >
        Skip ▸
      </button>
    </div>
  );
}