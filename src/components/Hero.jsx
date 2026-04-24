import { motion } from "framer-motion";
import { HERO_DATA } from "../constants";
import { useTheme } from "../context/ThemeContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: "80px" }}>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px]" style={{ background: "#00f0ff", opacity: isDark ? 0.08 : 0.06 }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px]" style={{ background: "#ff00aa", opacity: isDark ? 0.06 : 0.04 }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-left max-w-2xl space-y-6">
          <motion.p variants={itemVariants} className="font-mono text-sm tracking-[0.3em] uppercase" style={{ color: isDark ? "#00f0ff" : "#0066cc" }}>
            {HERO_DATA.greeting}
          </motion.p>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight">
            <span className="gradient-text">{HERO_DATA.name}</span>
          </motion.h1>

          <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl lg:text-3xl font-medium" style={{ color: "var(--text-muted)" }}>
            {HERO_DATA.title}
          </motion.h2>

          <motion.p variants={itemVariants} className="font-mono" style={{ color: isDark ? "#00f0ff88" : "#0066cc88", fontSize: "15px", lineHeight: "1.8" }}>
            {HERO_DATA.tagline}
          </motion.p>

          <motion.p variants={itemVariants} style={{ color: "var(--text-dim)", maxWidth: "32rem", lineHeight: "1.7" }}>
            {HERO_DATA.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <a
              href={HERO_DATA.ctaLink}
              className="magnetic-btn px-8 py-3 rounded-full font-semibold text-sm tracking-wide"
              style={{
                background: "linear-gradient(135deg, #00f0ff, #00ff88)",
                color: "#0a0a0f",
                boxShadow: "0 0 30px rgba(0,240,255,0.2)",
              }}
            >
              {HERO_DATA.cta}
            </a>
            <a
              href="#contact"
              className="magnetic-btn px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300"
              style={{
                border: `1px solid ${isDark ? "#00f0ff44" : "#0066cc44"}`,
                color: isDark ? "#00f0ff" : "#0066cc",
              }}
            >
              Get In Touch
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 pt-2">
            {["3nm", "14nm", "28nm", "32nm"].map((node) => (
              <span key={node} className={`badge-${node} px-3 py-1 rounded-full text-xs font-mono font-bold`}>
                {node}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5" style={{ border: `2px solid ${isDark ? "#00f0ff44" : "#0066cc44"}` }}>
          <div className="w-1.5 h-3 rounded-full animate-bounce" style={{ background: isDark ? "#00f0ff" : "#0066cc" }} />
        </div>
        <span className="text-xs font-mono tracking-wider" style={{ color: "var(--text-dim)" }}>
          Scroll to explore
        </span>
      </div>
    </section>
  );
}