import { useEffect, useRef } from "react";
import { EXPERIENCE_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Experience() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const colorMap = {
    cyan:    { border: isDark ? "#00f0ff22" : "#00f0ff44", dot: "#00f0ff", text: "#00f0ff", shadow: "rgba(0,240,255,0.15)" },
    magenta: { border: isDark ? "#ff00aa22" : "#ff00aa44", dot: "#ff00aa", text: "#ff00aa", shadow: "rgba(255,0,170,0.15)" },
    neon:    { border: isDark ? "#00ff8822" : "#00ff8844", dot: "#00ff88", text: "#00ff88", shadow: "rgba(0,255,136,0.15)" },
  };

  return (
    <section id="experience" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[200px]" style={{ background: "#00f0ff", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="reveal mb-20 text-center">
          <h2 className="section-heading gradient-text">Experience</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>{"// career.timeline()"}</p>
        </div>

        <div className="relative">
          <div className="timeline-line" />

          {EXPERIENCE_DATA.map((exp, i) => {
            const colors = colorMap[exp.color] || colorMap.cyan;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={exp.id}
                className={`reveal relative mb-16 md:mb-24 md:flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div
                  className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-8 w-5 h-5 rounded-full z-10 animate-pulse-glow"
                  style={{ background: colors.dot, border: `3px solid var(--bg)`, boxShadow: `0 0 15px ${colors.shadow}` }}
                />

                <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}>
                  <div
                    className="glass rounded-2xl p-8 card-hover"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono tracking-wider" style={{ color: colors.text }}>{exp.period}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>{exp.role}</h3>
                    <p className="font-medium mb-1" style={{ color: colors.text }}>{exp.company}</p>
                    <p className="text-sm mb-4" style={{ color: "var(--text-dim)" }}>{exp.location}</p>
                    <p className="mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{exp.description}</p>

                    <ul className="space-y-2 mb-4">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {exp.techNodes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.techNodes.map((node) => (
                          <span key={node} className={`badge-${node} px-3 py-1 rounded-full text-xs font-mono font-bold`}>{node}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
