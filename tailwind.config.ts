import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        background: "var(--bg)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        glass: "var(--glass)",
        border: "var(--border)",
        accent: "var(--accent)",
        "on-accent": "var(--on-accent)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        "chart-line": "var(--chart-line)",
      },
      borderRadius: {
        panel: "22px",
        segmented: "14px",
        nav: "13px",
        input: "12px",
        button: "11px",
        bar: "9px 9px 3px 3px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "var(--shadow)",
        glow: "0 0 25px rgba(255, 217, 28, 0.35)",
        "glow-lg": "0 0 45px rgba(255, 217, 28, 0.45)",
      },
      animation: {
        "orb-float-1": "float1 14s ease-in-out infinite alternate",
        "orb-float-2": "float2 16s ease-in-out infinite alternate",
      },
      keyframes: {
        float1: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(60px, 40px) scale(1.15)" },
          "100%": { transform: "translate(-30px, 70px) scale(0.95)" },
        },
        float2: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-70px, -50px) scale(1.1)" },
          "100%": { transform: "translate(40px, -30px) scale(0.9)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
