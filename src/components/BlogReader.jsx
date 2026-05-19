import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BLOGS_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";
import {
  RTLtoGDSII,
  FloorplanViz,
  PlacementAnim,
  ClockTreeViz,
  RoutingAnim,
  SignoffChecklist,
  SynthesisAnim,
} from "./BlogIllustrations";
import InfoTerm from "./InfoTerm";

const ILLUSTRATION_MAP = {
  RTLtoGDSII,
  SynthesisAnim,
  FloorplanViz,
  PlacementAnim,
  ClockTreeViz,
  RoutingAnim,
  SignoffChecklist,
};

// ✅ DEFINITIONS
const DEFINITIONS = {
  RTL: "Register Transfer Level — describes data flow between registers using logic.",
  ASIC: "Application-Specific Integrated Circuit — custom silicon designed for a specific purpose.",
  GDSII: "Final layout file sent to fabrication representing physical chip.",
  CTS: "Clock Tree Synthesis — builds clock network minimizing skew.",
  DRC: "Design Rule Check — ensures layout meets manufacturing constraints.",
  LVS: "Layout vs Schematic — verifies layout matches logical netlist.",
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
          <button onClick={() => navigate("/")} style={{ color: accent }}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">

          <button
            onClick={() => navigate("/")}
            className="flex gap-2 text-sm transition-all hover:gap-3"
            style={{ color: accent }}
          >
            ← Back
          </button>

          <div className="flex gap-4">
            <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{blog.readTime}</span>
            <span className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{blog.date}</span>

            <button onClick={toggleTheme}>
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">

        {/* TAGS */}
        <div className="flex gap-2 mb-8">
          {blog.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 text-xs rounded-full"
              style={{
                background: isDark ? "#00f0ff22" : "#0066cc22",
                color: accent
              }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CONTENT */}
        {blog.content.map((block, i) => {
          switch (block.type) {

            case "h1":
              return <h1 key={i} className="text-4xl mb-4">{block.text}</h1>;

            case "h2":
              return <h2 key={i} className="text-2xl mt-10 mb-4">{block.text}</h2>;

            case "h3":
              return <h3 key={i} className="text-xl mt-6 mb-3" style={{ color: accent }}>{block.text}</h3>;

            // ✅ MAGIC PART (tooltips)
            case "p":
              return (
                <p key={i} className="mb-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {block.text.split(/(\[.*?\])/g).map((part, j) => {
                    const key = part.replace(/\[|\]/g, "");
                    if (DEFINITIONS[key]) {
                      return <InfoTerm key={j} term={key} definition={DEFINITIONS[key]} />;
                    }
                    return part;
                  })}
                </p>
              );

            case "ul":
              return (
                <ul key={i} className="list-disc pl-6 mb-6">
                  {block.items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              );

            case "code":
              return (
                <pre key={i} className="p-4 rounded-xl mb-6"
                  style={{ background: isDark ? "#111" : "#eee", color: green }}>
                  {block.text}
                </pre>
              );

            case "illustration": {
              const Comp = ILLUSTRATION_MAP[block.component];
              return Comp ? <Comp key={i} /> : null;
            }

            case "hr":
              return <div key={i} className="my-6 border-t" />;

            default:
              return null;
          }
        })}

      </article>
    </div>
  );
}