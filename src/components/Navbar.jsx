import { useState, useEffect, useCallback } from "react";
import { NAV_LINKS } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      setIsVisible(currentY < lastScrollY || currentY < 100);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    const handleActiveSection = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      let current = "";
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleActiveSection, { passive: true });
    handleActiveSection();
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  }, []);

  const accentColor = isDark ? "#00f0ff" : "#0066cc";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "glass-strong" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group transition-all duration-300 hover:opacity-90"
        >
          <img
            src="/wafer-logo.png"
            alt="Logo"
            className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[20deg]"
          />
          <div className="flex flex-col">
            <span
              className="text-lg font-bold tracking-tight leading-none"
              style={{
                background: "linear-gradient(135deg, #00f0ff, #ff00aa, #ffd700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AS
            </span>
            <span
              className="text-[10px] font-mono tracking-[0.25em] uppercase leading-tight mt-0.5"
              style={{ color: isDark ? "#00f0ff88" : "#0066cc88" }}
            >
              Physical Designer
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
              style={{
                color: activeSection === id ? accentColor : "var(--text-muted)",
                background:
                  activeSection === id
                    ? isDark
                      ? "rgba(0, 240, 255, 0.08)"
                      : "rgba(0, 102, 204, 0.08)"
                    : "transparent",
              }}
              onMouseEnter={(e) => (e.target.style.color = accentColor)}
              onMouseLeave={(e) => {
                if (activeSection !== id) e.target.style.color = "var(--text-muted)";
              }}
            >
              {label}
            </button>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="#ffd700" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.728-.728M17.657 17.657l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="#6366f1" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="#ffd700" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.728-.728M17.657 17.657l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="#6366f1" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ background: accentColor }}
            />
            <div
              className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
              style={{ background: accentColor }}
            />
            <div
              className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ background: accentColor }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden glass-strong overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300"
              style={{
                color: activeSection === id ? accentColor : "var(--text-muted)",
                background:
                  activeSection === id
                    ? isDark
                      ? "rgba(0, 240, 255, 0.08)"
                      : "rgba(0, 102, 204, 0.08)"
                    : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}