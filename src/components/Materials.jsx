import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Materials() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const accent = isDark ? "#00f0ff" : "#0066cc";

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Navbar />
      <div className="pt-24 px-6 py-20 md:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <button
            onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
          style={{
            color: accent,
            border: `1px solid ${accent}`,
            background: isDark ? "rgba(0, 240, 255, 0.08)" : "rgba(0, 102, 204, 0.08)",
          }}
        >
          ← Back to Portfolio
        </button>

        <header className="space-y-4">
          <p className="text-sm font-mono uppercase tracking-[0.36em]" style={{ color: accent }}>
            VLSI Physical Design Materials
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text)" }}>
            Study resources for physical design, timing closure, placement, routing, and signoff.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[color:var(--text-muted)]">
            A curated collection of foundational and practical sources for VLSI physical design. These links cover design flow concepts, floorplanning, clock-tree synthesis, routing, timing analysis, tools, open-source PDKs, and hands-on implementation.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 p-6 bg-white/5 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-semibold" style={{ color: "var(--text)" }}>
              Key Physical Design Concepts
            </h2>
            <ul className="space-y-4 text-sm leading-7 text-[color:var(--text-muted)]">
              <li>
                <strong>Floorplanning & Placement</strong> — Understand macro placement, block alignment, power planning, and how placement quality affects congestion.
                <br />
                <a href="https://www.techplayon.com/asic-layout-design-flow/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  TechPlayon: ASIC layout and physical design flow
                </a>
              </li>
              <li>
                <strong>Clock Tree Synthesis (CTS)</strong> — Learn clock buffering, insertion delay, skew, latency, and balanced tree construction.
                <br />
                <a href="https://semiengineering.com/the-introduction-to-clock-tree-synthesis/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  SemiEngineering: Introduction to CTS
                </a>
              </li>
              <li>
                <strong>Routing & Congestion</strong> — Global vs detailed routing, via use, routing layers, and congestion-driven optimization.
                <br />
                <a href="https://learn.edf.com/learn/routing-and-congestion" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  EDF Learning: Routing and congestion fundamentals
                </a>
              </li>
              <li>
                <strong>Static Timing Analysis (STA)</strong> — Setup, slack, path analysis, false paths, multi-cycle paths, and timing signoff.
                <br />
                <a href="https://www.opencores.org/projects/sta-basics" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  OpenCores: STA basics for ASIC design
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 p-6 bg-white/5 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-semibold" style={{ color: "var(--text)" }}>
              Signoff, Tools, and Open Design Resources
            </h2>
            <ul className="space-y-4 text-sm leading-7 text-[color:var(--text-muted)]">
              <li>
                <strong>Design Rule Check / Layout vs. Schematic</strong> — Essential signoff checks before tape-out.
                <br />
                <a href="https://www.edn.com/what-is-drc-layout-vs-schematic-lvs-and-why-does-it-matter/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  EDN: DRC, LVS, and signoff explained
                </a>
              </li>
              <li>
                <strong>OpenLane / OpenROAD</strong> — Open-source full-flow PnR framework for learning physical design on SkyWater 130nm.
                <br />
                <a href="https://github.com/efabless/openlane" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  OpenLane GitHub repository
                </a>
              </li>
              <li>
                <strong>SkyWater PDK</strong> — Open-process design kit used by many educational and research flows.
                <br />
                <a href="https://skywater-pdk.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  SkyWater PDK documentation
                </a>
              </li>
              <li>
                <strong>OpenROAD documentation</strong> — Practical references for automatic placement, routing, and timing-driven optimization.
                <br />
                <a href="https://openroad.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  OpenROAD docs
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 p-6 bg-white/5 backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-semibold" style={{ color: "var(--text)" }}>
            Practical links and concept references
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[color:var(--text-muted)]">
            <div>
              <p className="font-semibold">Textbook-style reference</p>
              <a href="https://en.wikipedia.org/wiki/Physical_design_(electronics)" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                Wikipedia: Physical design (electronics)
              </a>
              <p>Good for a high-level overview of the physical-design stages and terminology.</p>
            </div>

            <div>
              <p className="font-semibold">Research and advanced flow notes</p>
              <a href="https://www.cadence.com/en_US/home/tools/system-design-and-verification/innovus-signoff.html" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                Cadence Innovus physical design overview
              </a>
              <p>Useful to compare academic concepts with commercial tool flow behavior.</p>
            </div>

            <div>
              <p className="font-semibold">Open-source toolchain walkthrough</p>
              <a href="https://github.com/The-OpenROAD-Project/OpenROAD" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                OpenROAD GitHub project
              </a>
              <p>Contains source, examples, and papers for automatic place-and-route research.</p>
            </div>

            <div>
              <p className="font-semibold">Timing closure primer</p>
              <a href="https://www.design-reuse.com/articles/51557/what-is-timing-closure-in-asic-design.html" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                Design & Reuse: What is timing closure?
              </a>
              <p>Explains the iterative nature of timing optimization across placement, CTS, and routing.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
