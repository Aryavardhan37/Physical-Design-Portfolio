import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BLOGS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { useVisitorCount, formatVisitorCount } from "../hooks/useVisitorCount";

export default function Blogs() {
  const visitors = useVisitorCount();
  const visitorText = formatVisitorCount(visitors);
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );

    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="blogs"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[200px]"
        style={{ background: "#00ff88", opacity: isDark ? 0.06 : 0.03 }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text">Blog</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p
            className="mt-4 font-mono text-sm"
            style={{ color: "var(--text-dim)" }}
          >
            {"// blog.latest()"}
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: isDark ? "#00ff88" : "#0066cc" }}>
            👁 Visitors: {visitorText}
          </p>
        </div>

        <div className="flex justify-center">
          {BLOGS_DATA
            .filter((blog) => blog.featured)
            .map((blog, i) => (
              <div
                key={blog.id}
                className="reveal w-full max-w-4xl"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div
                  className="glass rounded-2xl overflow-hidden p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] group card-hover"
                  onClick={() => navigate(`/blog/${blog.id}`)}
                >
                  {/* Accent line */}
                  <div
                    className="h-1 w-full mb-6 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #00f0ff, #ff00aa, #ffd700)",
                    }}
                  />

                  {/* Title */}
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4 group-hover:opacity-90 transition-opacity"
                    style={{ color: "var(--text)" }}
                  >
                    {blog.title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className="text-sm font-mono mb-4"
                    style={{ color: isDark ? "#00f0ffcc" : "#0066cccc" }}
                  >
                    {blog.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {blog.description}
                  </p>

                  {/* Bottom CTA */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium px-4 py-2 rounded-full"
                      style={{
                        background: isDark
                          ? "rgba(0,240,255,0.08)"
                          : "rgba(0,102,204,0.08)",
                        color: isDark ? "#00f0ff" : "#0066cc",
                      }}
                    >
                      Beginner Friendly
                    </span>

                    <span
                      className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-300"
                      style={{ color: isDark ? "#00f0ff" : "#0066cc" }}
                    >
                      Read Blog →
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}