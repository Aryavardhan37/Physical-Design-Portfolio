# Aryavardhan Sharma — 3D ASIC Physical Design Portfolio v2

A stunning, interactive portfolio with an **actual chip floorplan** (IO pads, core area, blocks, signal traces), **terminal intro animation**, **dark/light theme toggle**, and scroll-driven chip expansion.

## ✨ Key Features

- **Terminal Boot Animation** — ASIC-themed `source asic_profile.tcl` sequence
- **Interactive SVG Chip Floorplan** — Real chip die with IO pads, blocks (CPU, Memory Controller, SRAM, DMA, PLL, etc.), animated signal traces, hover tooltips
- **Scroll-Driven Expansion** — Chip blocks spread apart as you scroll down
- **Dark/Light Theme** — Toggle with persistent localStorage
- **Glassmorphism + Neon Glows** — EDA-inspired color palette
- **3D Tilt Cards** — Projects react to mouse movement
- **Scroll Reveal Animations** — Every section animates on scroll
- **9 Sections** — Hero, About, Experience, Skills, Projects, Publications, Achievements, Contact, Footer

## 🚀 Quick Start

```bash
cd portfolio-3d-v2
npm install
npm run dev
# → http://localhost:5173
```

## 🌐 Deploy

Push to GitHub → Import on [vercel.com](https://vercel.com) → Click Deploy. Done!

## 📁 Customize

| What | File |
|------|------|
| Your data | `src/constants/index.js` |
| Colors/theme | `tailwind.config.js` + `src/index.css` |
| Chip blocks | `CHIP_BLOCKS` in constants |
| EmailJS | Replace placeholder in `Contact.jsx` |

## 🛠 Stack

React (Vite) · Three.js · R3F · Drei · Framer Motion · GSAP · Tailwind CSS

---
Built with ⚡ by Aryavardhan Sharma
