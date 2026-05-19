import { useEffect, useRef, useState } from "react";
import { SOCIAL_LINKS } from "../constants";
import { useTheme } from "../context/ThemeContext";

export default function Contact() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setFormData({ name: "", email: "", message: "" }); setTimeout(() => setStatus(""), 3000); }, 1500);
  };

  const accent = isDark ? "#00f0ff" : "#0066cc";
  const accentGreen = isDark ? "#00ff88" : "#009955";
  const accentPink = isDark ? "#ff00aa" : "#cc0088";

  const socialLinks = [
    { label: "Email", href: `mailto:${SOCIAL_LINKS.email}`, display: SOCIAL_LINKS.email, color: accent,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, display: "LinkedIn", color: accent,
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { label: "GitHub", href: SOCIAL_LINKS.github, display: "GitHub", color: accentGreen,
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg> },
    { label: "HDLbits", href: SOCIAL_LINKS.hdlbits, display: "HDLbits Profile", color: accentPink,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg> },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[200px]" style={{ background: "#ff00aa", opacity: isDark ? 0.06 : 0.03 }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal mb-16 text-center">
          <h2 className="section-heading gradient-text">Get In Touch</h2>
          <div className="neon-line w-24 mt-4 mx-auto" />
          <p className="mt-4 font-mono text-sm" style={{ color: "var(--text-dim)" }}>{"// init_contact()"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal-left">
            <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>
              Let's build something <span style={{ color: accent }}>together</span>.
            </h3>
            <div className="glass rounded-xl p-6 mb-8 font-mono text-sm leading-loose" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: accentGreen }}>lazarous_pitt_pd&gt;</span>{" "}
              <span>connect --engineer Aryavardhan</span><br />
              <span style={{ color: "var(--text-dim)" }}>Establishing secure link...</span><br />
              <span>Connection status: </span>
              <span style={{ color: accent, fontWeight: 700 }}>[READY]</span><br />
              <span style={{ color: "var(--text-dim)" }}>Available for collaborations, research, and new challenges.</span>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target={link.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-4 glass rounded-xl card-hover transition-all duration-300"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={e => e.currentTarget.style.color = link.color}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  {link.icon}
                  <div>
                    <div className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{link.label}</div>
                    <div className="text-sm font-medium">{link.display}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="reveal-right">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-mono mb-2" style={{ color: "var(--text-dim)" }}>name <span style={{ color: "#ff00aa" }}>*</span></label>
                <input id="name" type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl focus:outline-none transition-all duration-300" placeholder="Your name"
                  style={{ background: "var(--input-bg)", border: `1px solid var(--input-border)`, color: "var(--text)" }} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-mono mb-2" style={{ color: "var(--text-dim)" }}>email <span style={{ color: "#ff00aa" }}>*</span></label>
                <input id="email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl focus:outline-none transition-all duration-300" placeholder="you@example.com"
                  style={{ background: "var(--input-bg)", border: `1px solid var(--input-border)`, color: "var(--text)" }} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-mono mb-2" style={{ color: "var(--text-dim)" }}>message <span style={{ color: "#ff00aa" }}>*</span></label>
                <textarea id="message" rows={5} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl focus:outline-none transition-all duration-300 resize-none" placeholder="Your message..."
                  style={{ background: "var(--input-bg)", border: `1px solid var(--input-border)`, color: "var(--text)" }} />
              </div>
              <button type="submit" disabled={status === "sending"}
                className="magnetic-btn w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #00f0ff, #ff00aa)", color: "#0a0a0f", boxShadow: "0 0 30px rgba(0,240,255,0.15), 0 0 30px rgba(255,0,170,0.15)" }}>
                {status === "sending" ? "Transmitting..." : status === "sent" ? "✓ Message Sent!" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
