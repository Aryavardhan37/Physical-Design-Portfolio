import { useEffect, useRef } from "react";
import { ABOUT_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function About() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[200px]" style={{ background: "#ff00aa", opacity: isDark ? 0.07 : 0.04 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16">
          <h2 className="section-heading gradient-text-cyan">{ABOUT_DATA.heading}</h2>
          <div className="neon-line w-24 mt-4" />
        </div>

        <div className="grid grid-cols-1 max-w-3xl">

          <div className="space-y-6">
            {ABOUT_DATA.paragraphs.map((para, i) => (
              <p key={i} className="reveal leading-relaxed text-lg" style={{ color: "var(--text-muted)", transitionDelay: `${200 + i * 150}ms` }}>
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {ABOUT_DATA.highlights.map((item, i) => (
            <div
              key={i}
              className="reveal glass rounded-2xl p-6 text-center card-hover"
              style={{ transitionDelay: `${600 + i * 100}ms` }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{item.value}</div>
              <div className="text-sm font-mono uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
