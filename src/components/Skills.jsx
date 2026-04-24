import { useEffect, useRef } from "react";
import { SKILLS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Skills() {
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
    cyan:    { border: isDark ? "#00f0ff15" : "#00f0ff30", hoverBorder: isDark ? "#00f0ff44" : "#00f0ff66", pill: isDark ? "#00f0ff18" : "#00f0ff20", pillText: "#00f0ff", pillBorder: isDark ? "#00f0ff22" : "#00f0ff44", title: "#00f0ff", hoverShadow: isDark ? "0 0 30px rgba(0,240,255,0.1)" : "0 8px 30px rgba(0,240,255,0.08)" },
    magenta: { border: isDark ? "#ff00aa15" : "#ff00aa30", hoverBorder: isDark ? "#ff00aa44" : "#ff00aa66", pill: isDark ? "#ff00aa18" : "#ff00aa20", pillText: "#ff00aa", pillBorder: isDark ? "#ff00aa22" : "#ff00aa44", title: "#ff00aa", hoverShadow: isDark ? "0 0 30px rgba(255,0,170,0.1)" : "0 8px 30px rgba(255,0,170,0.08)" },
    neon:    { border: isDark ? "#00ff8815" : "#00ff8830", hoverBorder: isDark ? "#00ff8844" : "#00ff8866", pill: isDark ? "#00ff8818" : "#00ff8820", pillText: "#00ff88", pillBorder: isDark ? "#00ff8822" : "#00ff8844", title: "#00ff88", hoverShadow: isDark ? "0 0 30px rgba(0,255,136,0.1)" : "0 8px 30px rgba(0,255,136,0.08)" },
    gold:    { border: isDark ? "#ffd70015" : "#ffd70030", hoverBorder: isDark ? "#ffd70044" : "#ffd70066", pill: isDark ? "#ffd70018" : "#ffd70020", pillText: "#ffd700", pillBorder: isDark ? "#ffd70022" : "#ffd70044", title: "#ffd700", hoverShadow: isDark ? "0 0 30px rgba(255,215,0,0.1)" : "0 8px 30px rgba(255,215,0,0.08)" },
  };

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-[200px]" style={{ background: "#00ff88", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text-cyan">Skills & Tools</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>{"// skills.load()"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKILLS_DATA.map((cat, i) => {
            const c = colorMap[cat.color] || colorMap.cyan;
            return (
              <div
                key={i}
                className="reveal glass rounded-2xl p-8 card-hover group"
                style={{ borderColor: c.border, transitionDelay: `${i * 120}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.hoverBorder; e.currentTarget.style.boxShadow = c.hoverShadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="text-lg font-bold" style={{ color: c.title }}>{cat.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 hover:scale-105"
                      style={{ background: c.pill, color: c.pillText, border: `1px solid ${c.pillBorder}` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
