import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // SKL brand palette
        ice: {
          50:  "#f0f7ff",
          100: "#e0efff",
          200: "#b9dcff",
        },
        rink: {
          900: "#0a0f1e",
          800: "#0f1629",
          700: "#162038",
          600: "#1e2d4a",
        },
        gold: {
          400: "#f5c842",
          500: "#e6b800",
          600: "#c9a000",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
