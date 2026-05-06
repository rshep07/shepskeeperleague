import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // SKL — Black / White / Gold
        ice: {
          50:  "#FFFFFF",   // pure white — headings
          100: "#F0F0F0",   // near white — body text
          200: "#A0A0A0",   // gray — secondary text
          300: "#6A6A6A",   // muted gray — labels
          400: "#404040",   // very muted — borders etc.
        },
        rink: {
          900: "#080808",   // page background
          800: "#101010",   // card background
          700: "#1E1E1E",   // card borders / inner areas
          600: "#2C2C2C",   // hover states / dividers
        },
        gold: {
          300: "#E8CE84",   // light gold — highlights
          400: "#C9A84C",   // primary gold — links, accents
          500: "#A07830",   // deep gold
          600: "#7A5A1C",   // darkest gold
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body:    ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
