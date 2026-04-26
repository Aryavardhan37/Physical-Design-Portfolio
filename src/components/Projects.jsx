import { useEffect, useRef, useState } from "react";
import { PROJECTS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Projects() {
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
    cyan:    { accent: "#00f0ff", hoverBorder: isDark ? "#00f0ff44" : "#00f0ff66", text: isDark ? "#00f0ff" : "#0077cc" },
    magenta: { accent: "#ff00aa", hoverBorder: isDark ? "#ff00aa44" : "#ff00aa66", text: isDark ? "#ff00aa" : "#cc0088" },
    neon:    { accent: "#00ff88", hoverBorder: isDark ? "#00ff8844" : "#00ff8866", text: isDark ? "#00ff88" : "#009955" },
    gold:    { accent: "#ffd700", hoverBorder: isDark ? "#ffd70044" : "#ffd70066", text: isDark ? "#ffd700" : "#cc9900" },
  };

  // Interactive tilt on mouse move
 const handleMouseMove = (e) => {
  const cardEl = e.currentTarget;
  const rect = cardEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / 20);
  const rotateY = ((centerX - x) / 20);
  cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
};

const handleMouseLeave = (e) => {
  const cardEl = e.currentTarget;
  cardEl.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
};

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-[200px]" style={{ background: "#ffd700", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text">Projects</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>{"// project.showcase()"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS_DATA.map((project, i) => {
            const c = colorMap[project.color] || colorMap.cyan;
            let cardRef = null;
            return (
              <div
                key={project.id}
                ref={el => cardRef = el}
                className="reveal glass rounded-2xl overflow-hidden tilt-card card-hover"
                style={{ transitionDelay: `${i * 120}ms`, transition: "transform 0.15s ease-out" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                >
                <div className="h-1 w-full" style={{ background: c.accent }} />
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>{project.title}</h3>
                  <p className="text-sm font-mono mb-4" style={{ color: c.text }}>{project.subtitle}</p>
                  <p className="leading-relaxed mb-6 text-sm" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="px-3 py-1 rounded-full text-xs font-mono" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: "var(--text-muted)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:underline transition-all duration-300" style={{ color: c.text }}>
                      View Project
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
