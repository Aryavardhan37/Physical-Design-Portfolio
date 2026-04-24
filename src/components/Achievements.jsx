import { useEffect, useRef } from "react";
import { ACHIEVEMENTS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Achievements() {
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
    gold:    { border: isDark ? "#ffd70018" : "#ffd70030", hoverBorder: isDark ? "#ffd70044" : "#ffd70066", text: isDark ? "#ffd700" : "#b8960a", shadow: isDark ? "0 0 30px rgba(255,215,0,0.08)" : "0 8px 30px rgba(255,215,0,0.06)" },
    cyan:    { border: isDark ? "#00f0ff18" : "#00f0ff30", hoverBorder: isDark ? "#00f0ff44" : "#00f0ff66", text: isDark ? "#00f0ff" : "#0077cc", shadow: isDark ? "0 0 30px rgba(0,240,255,0.08)" : "0 8px 30px rgba(0,240,255,0.06)" },
    neon:    { border: isDark ? "#00ff8818" : "#00ff8830", hoverBorder: isDark ? "#00ff8844" : "#00ff8866", text: isDark ? "#00ff88" : "#009955", shadow: isDark ? "0 0 30px rgba(0,255,136,0.08)" : "0 8px 30px rgba(0,255,136,0.06)" },
    magenta: { border: isDark ? "#ff00aa18" : "#ff00aa30", hoverBorder: isDark ? "#ff00aa44" : "#ff00aa66", text: isDark ? "#ff00aa" : "#cc0088", shadow: isDark ? "0 0 30px rgba(255,0,170,0.08)" : "0 8px 30px rgba(255,0,170,0.06)" },
  };

  return (
    <section id="achievements" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-[200px]" style={{ background: "#ffd700", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text">Achievements</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>{"// achievements.report()"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACHIEVEMENTS_DATA.map((item, i) => {
            const c = colorMap[item.color] || colorMap.gold;
            return (
              <div
                key={item.id}
                className="reveal glass rounded-2xl p-8 card-hover"
                style={{ borderColor: c.border, transitionDelay: `${i * 100}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.hoverBorder; e.currentTarget.style.boxShadow = c.shadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>{item.title}</h3>
                <p className="text-sm font-mono mb-3" style={{ color: c.text }}>{item.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
