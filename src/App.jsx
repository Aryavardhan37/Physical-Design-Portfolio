import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TerminalIntro from "./components/TerminalIntro";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Blogs from "./components/Blogs";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BlogReader from "./components/BlogReader";
import ChipFloorplan from "./components/three/ChipFloorplan";
import { useTheme } from "./context/ThemeContext";

function Portfolio() {
  const [introComplete, setIntroComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark } = useTheme();
  const mainRef = useRef(null);

  useEffect(() => {
    if (!introComplete) return;
    const handleScroll = () => {
      const maxScroll = window.innerHeight * 5;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [introComplete]);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <AnimatePresence>
        {!introComplete && (
          <TerminalIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {introComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Navbar />

          <div
            className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: scrollProgress > 0.4
                ? 0
                : Math.max(0.06, (isDark ? 0.7 : 0.5) - scrollProgress * 1.8),
              transition: "opacity 0.15s ease",
            }}
          >
            <div className="w-[80vmin] h-[80vmin] max-w-[750px] max-h-[750px]">
              <ChipFloorplan scrollProgress={scrollProgress} className="w-full h-full" />
            </div>
          </div>

          <main ref={mainRef} className="relative z-20">
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Publications />
            <Blogs />
            <Achievements />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog/:slug" element={<BlogReader />} />
      </Routes>
    </BrowserRouter>
  );
}