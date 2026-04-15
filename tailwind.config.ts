import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nunchi: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bbfc",
          400: "#7c96f8",
          500: "#5a70f3",
          600: "#4050e8",
          700: "#3540d0",
          800: "#2d37a8",
          900: "#2a3585",
        },
        warm: {
          50: "#fff8f0",
          100: "#ffeedd",
          200: "#ffddb8",
          300: "#ffc688",
          400: "#ffa350",
          500: "#ff8a2a",
          600: "#f06d12",
          700: "#c75210",
          800: "#9e4116",
          900: "#7f3714",
        },
        sand: {
          50: "#fafaf7",
          100: "#f5f4ef",
          200: "#ebe9de",
          300: "#dbd8c9",
          400: "#c4c0ac",
          500: "#aba695",
          600: "#918c7e",
          700: "#777266",
          800: "#605d53",
          900: "#4f4d46",
        },
      },
      fontFamily: {
        sans: ["'Pretendard'", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
