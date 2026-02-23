import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        foreground: "#fafafa",
        accent: {
          DEFAULT: "#A3F15A",
          foreground: "#0a0a0b",
        },
        card: {
          DEFAULT: "rgba(20, 20, 22, 0.8)",
          foreground: "#fafafa",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(163, 241, 90, 0.3)",
        "glow-sm": "0 0 20px -5px rgba(163, 241, 90, 0.2)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(163, 241, 90, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163, 241, 90, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
