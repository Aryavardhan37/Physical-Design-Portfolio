/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyan: "#00f0ff",
        magenta: "#ff00aa",
        neon: "#00ff88",
        gold: "#ffd700",
        dark: {
          bg: "#0a0a0f",
          card: "rgba(15,15,25,0.6)",
          surface: "#12121a",
        },
        light: {
          bg: "#f5f5f8",
          card: "rgba(255,255,255,0.7)",
          surface: "#ffffff",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,240,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,240,255,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
