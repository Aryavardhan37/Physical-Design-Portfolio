import { useEffect, useRef } from "react";
import { PUBLICATIONS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";
import PublicationGlobe from "./PublicationGlobe";

export default function Publications() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const topicColors = {
    "VLSI Physical Design": { bg: isDark ? "#ff00aa18" : "#ff00aa25", text: "#ff00aa" },
    "VLSI / AI-ML": { bg: isDark ? "#ff00aa18" : "#ff00aa25", text: "#ff00aa" },
    "Deep Learning / Marine": { bg: isDark ? "#00f0ff18" : "#00f0ff25", text: "#00f0ff" },
    "AR / Education": { bg: isDark ? "#00ff8818" : "#00ff8825", text: "#00ff88" },
    "IoT / Agriculture": { bg: isDark ? "#ffd70018" : "#ffd70025", text: "#ffd700" },
    "Game-Based Learning": { bg: isDark ? "#00f0ff18" : "#00f0ff25", text: "#00f0ff" },
  };

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background blob */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full blur-[200px]"
        style={{ background: "#00f0ff", opacity: isDark ? 0.06 : 0.03 }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="reveal mb-12 text-center">
          <h2 className="section-heading gradient-text-cyan">
            Publications & Research
          </h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p
            className="mt-4 font-mono text-sm"
            style={{ color: "var(--text-dim)" }}
          >
            {"// "}6 IEEE publications across 3 countries
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            LAYOUT: Globe centered TOP, Papers FULL WIDTH below
            ═══════════════════════════════════════════════ */}

        {/* Globe — centered, compact */}
        <div className="reveal flex flex-col items-center mb-14">
  <div className="w-[340px] h-[340px]">
    <PublicationGlobe />
  </div>
</div>

        {/* Papers — full width, 2-col grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PUBLICATIONS_DATA.map((pub, i) => {
            const tc = topicColors[pub.topic] || {
              bg: isDark ? "#00f0ff18" : "#00f0ff25",
              text: "#00f0ff",
            };

            return (
              <div
                key={pub.id}
                className="reveal glass rounded-2xl p-6 card-hover"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Topic badge + date */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium"
                    style={{
                      background: tc.bg,
                      color: tc.text,
                      border: `1px solid ${tc.text}33`,
                    }}
                  >
                    {pub.topic}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {pub.date}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold mb-2 leading-snug"
                  style={{ color: "var(--text)" }}
                >
                  {pub.title}
                </h3>

                {/* Conference + venue */}
                <p
                  className="text-sm mb-1 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {pub.conference}
                </p>
                <p
                  className="text-xs font-mono mb-3"
                  style={{ color: "var(--text-dim)" }}
                >
                  📍 {pub.venue}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  {pub.citations > 0 && (
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: tc.text }}
                    >
                      {pub.citations} citations
                    </span>
                  )}
                  {pub.views > 0 && (
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {pub.views} views
                    </span>
                  )}
                </div>

                {/* DOI + link */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span
                    className="text-xs font-mono break-all"
                    style={{ color: "var(--text-dim)" }}
                  >
                    DOI: {pub.doi}
                  </span>
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                    style={{ color: isDark ? "#00f0ff" : "#0066cc" }}
                  >
                    IEEE Xplore ↗
                  </a>
                </div>
              </div>
            );
          })}

          {/* Copyright entry */}
          <div className="reveal glass rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{
                  background: isDark ? "#ffd70015" : "#ffd70025",
                  border: `1px solid ${isDark ? "#ffd70033" : "#ffd70055"}`,
                  color: "#ffd700",
                }}
              >
                ©
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono"
                style={{
                  background: isDark ? "#ffd70012" : "#ffd70020",
                  color: "#ffd700",
                  border: `1px solid ${isDark ? "#ffd70033" : "#ffd70055"}`,
                }}
              >
                Copyright
              </span>
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Pathfinding Adventure — A Game Developed in Python
            </h3>
            <p
              className="text-sm mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Patent Office of India — Copyright Registration
            </p>
            <a
              href="https://drive.google.com/file/d/16Njm0x-9bG1PZtaukFVbBDsTDwPNPQ6K/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: isDark ? "#ffd700" : "#b8960a" }}
            >
              View Certificate →
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            COMMENTED OUT: Side-by-side layout (globe left, papers right)
            Uncomment this block and comment out the above layout to switch.
            ═══════════════════════════════════════════════ */}

        {/*
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Globe — sticky left side *\/}
          <div className="reveal-left w-full lg:w-[340px] flex-shrink-0 lg:sticky lg:top-28 self-start flex flex-col items-center">
            <div className="w-[320px] h-[320px]">
              <PublicationGlobe />
            </div>
            <p className="mt-2 text-xs font-mono tracking-wider text-center" style={{ color: "var(--text-dim)" }}>
              6 venues · 3 countries
            </p>
          </div>

          {/* Papers — scrollable right side *\/}
          <div className="flex-1 min-w-0 space-y-5">
            {PUBLICATIONS_DATA.map((pub, i) => {
              const tc = topicColors[pub.topic] || { bg: isDark ? "#00f0ff18" : "#00f0ff25", text: "#00f0ff" };
              return (
                <div key={pub.id} className="reveal glass rounded-2xl p-6 card-hover" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}33` }}>
                      {pub.topic}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{pub.date}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: "var(--text)" }}>{pub.title}</h3>
                  <p className="text-sm mb-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>{pub.conference}</p>
                  <p className="text-xs font-mono mb-3" style={{ color: "var(--text-dim)" }}>📍 {pub.venue}</p>
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    {pub.citations > 0 && <span className="text-xs font-mono font-bold" style={{ color: tc.text }}>{pub.citations} citations</span>}
                    {pub.views > 0 && <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{pub.views} views</span>}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs font-mono break-all" style={{ color: "var(--text-dim)" }}>DOI: {pub.doi}</span>
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: isDark ? "#00f0ff" : "#0066cc" }}>
                      IEEE Xplore ↗
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Copyright *\/}
            <div className="reveal glass rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: isDark ? "#ffd70015" : "#ffd70025", border: `1px solid ${isDark ? "#ffd70033" : "#ffd70055"}`, color: "#ffd700" }}>©</span>
                <span className="px-3 py-1 rounded-full text-xs font-mono" style={{ background: isDark ? "#ffd70012" : "#ffd70020", color: "#ffd700", border: `1px solid ${isDark ? "#ffd70033" : "#ffd70055"}` }}>Copyright</span>
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>Pathfinding Adventure — A Game Developed in Python</h3>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>Patent Office of India — Copyright Registration</p>
              <a href="https://drive.google.com/file/d/16Njm0x-9bG1PZtaukFVbBDsTDwPNPQ6K/view" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: isDark ? "#ffd700" : "#b8960a" }}>
                View Certificate →
              </a>
            </div>
          </div>

        </div>
        */}
      </div>
    </section>
  );
}