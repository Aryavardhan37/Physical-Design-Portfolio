import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BLOGS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";
import BlogCard from "./BlogCard";

export default function Blogs() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="blogs" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[200px]"
        style={{ background: "#00ff88", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text">Blog</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>
            {"// blog.latest()"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOGS_DATA.map((blog, i) => (
            <div key={blog.id} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              <BlogCard
                blog={blog}
                onClick={() => navigate(`/blog/${blog.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}