import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BLOGS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { RTLtoGDSII, FloorplanViz, PlacementAnim, ClockTreeViz, RoutingAnim, SignoffChecklist } from "./BlogIllustrations";

const ILLUSTRATION_MAP = {
  RTLtoGDSII,
  FloorplanViz,
  PlacementAnim,
  ClockTreeViz,
  RoutingAnim,
  SignoffChecklist,
};
export default function BlogReader() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const blog = BLOGS_DATA.find((b) => b.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const accent = isDark ? "#00f0ff" : "#0066cc";
  const green = isDark ? "#00ff88" : "#006644";

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--text)" }}>Blog not found</h1>
          <button onClick={() => navigate("/")} style={{ color: accent }}>← Back to Portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
            style={{ color: accent }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </button>

          <div className="flex items-center gap-4">
            {blog && (
              <>
                <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{blog.readTime}</span>
                <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{blog.date}</span>
              </>
            )}
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="#ffd700" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="#0066cc" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-mono"
              style={{
                background: isDark ? "rgba(0,240,255,0.08)" : "rgba(0,102,204,0.08)",
                color: accent,
                border: `1px solid ${isDark ? "#00f0ff22" : "#0066cc22"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Render blog content from JSX array */}
        {blog.content.map((block, i) => {
          switch (block.type) {
            case "h1":
              return <h1 key={i} className="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style={{ color: "var(--text)" }}>{block.text}</h1>;
            case "subtitle":
              return <p key={i} className="text-sm font-mono mb-8" style={{ color: "var(--text-dim)" }}>{block.text}</p>;
            case "hr":
              return <div key={i} className="neon-line my-8" />;
            case "h2":
              return <h2 key={i} className="text-2xl font-bold mt-12 mb-4" style={{ color: "var(--text)" }}>{block.text}</h2>;
            case "h3":
              return <h3 key={i} className="text-xl font-bold mt-8 mb-3" style={{ color: accent }}>{block.text}</h3>;
            case "p":
              return <p key={i} className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }} dangerouslySetInnerHTML={{ __html: block.text }} />;
            case "ul":
              return (
                <ul key={i} className="list-disc pl-6 mb-6 space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              );
            case "ol":
              return (
                <ol key={i} className="list-decimal pl-6 mb-6 space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              );
            case "code":
              return (
                <pre
                  key={i}
                  className="rounded-xl p-6 mb-6 overflow-x-auto text-sm font-mono leading-relaxed"
                  style={{
                    background: isDark ? "#0d0d1a" : "#f0f0f5",
                    border: `1px solid ${isDark ? "#1a1a2e" : "#e0e0e8"}`,
                    color: green,
                  }}
                >
                  <code>{block.text}</code>
                </pre>
              );
            case "table":
              return (
                <div key={i} className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {block.headers.map((h, j) => (
                          <th key={j} className="px-4 py-3 text-left font-bold font-mono text-xs uppercase tracking-wider"
                            style={{ background: isDark ? "#1a1a2e" : "#f0f0f5", color: accent, borderBottom: `1px solid ${isDark ? "#2a2a3e" : "#d0d0d8"}` }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k} className="px-4 py-3" style={{ color: "var(--text-muted)", borderBottom: `1px solid ${isDark ? "#1a1a2e" : "#e8e8f0"}` }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            case "blockquote":
              return (
                <blockquote key={i} className="border-l-4 pl-6 my-6 italic" style={{ borderColor: accent, color: "var(--text-dim)" }}>
                  {block.text}
                </blockquote>
              );
            case "illustration": {
              const Comp = ILLUSTRATION_MAP[block.component];
              return Comp ? <Comp key={i} /> : null;
            }
            default:
              return null;
          }
        })}

        {/* Bottom nav */}
        <div className="mt-16 pt-8" style={{ borderTop: `1px solid ${isDark ? "#1a1a2e" : "#e0e0e8"}` }}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
            style={{ color: accent }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </button>
        </div>
      </article>
    </div>
  );
}