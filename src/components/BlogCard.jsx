import { useTheme } from "../context/ThemeContext";

export default function BlogCard({ blog, onClick }) {
  const { isDark } = useTheme();

  const colorMap = {
    cyan: { text: "#00f0ff", border: isDark ? "#00f0ff22" : "#00f0ff44", hover: isDark ? "#00f0ff44" : "#00f0ff66" },
    magenta: { text: "#ff00aa", border: isDark ? "#ff00aa22" : "#ff00aa44", hover: isDark ? "#ff00aa44" : "#ff00aa66" },
    neon: { text: "#00ff88", border: isDark ? "#00ff8822" : "#00ff8844", hover: isDark ? "#00ff8844" : "#00ff8866" },
    gold: { text: "#ffd700", border: isDark ? "#ffd70022" : "#ffd70044", hover: isDark ? "#ffd70044" : "#ffd70066" },
  };

  const c = colorMap[blog.color] || colorMap.cyan;

  return (
    <article
      onClick={onClick}
      className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
      style={{ borderColor: c.border }}
      onMouseEnter={e => e.currentTarget.style.borderColor = c.hover}
      onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
    >
      {/* Cover gradient */}
      <div
        className="h-32 relative overflow-hidden"
        style={{ background: blog.coverGradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-20 font-mono font-bold" style={{ color: c.text }}>
            {"{ }"}
          </span>
        </div>
        {/* Read time badge */}
        <div className="absolute top-4 right-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-medium"
            style={{
              background: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
              color: c.text,
            }}
          >
            {blog.readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>
            {blog.date}
          </span>
        </div>

        <h3
          className="text-lg font-bold mb-2 leading-snug group-hover:underline decoration-1 underline-offset-4"
          style={{ color: "var(--text)", textDecorationColor: c.text }}
        >
          {blog.title}
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
          {blog.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full text-xs font-mono"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                color: "var(--text-dim)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read arrow */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: c.text }}>
          Read Article
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </article>
  );
}