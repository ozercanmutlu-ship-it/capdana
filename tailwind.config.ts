import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#141414",
        text: "#F5F5F5",
        muted: "#9CA3AF",
        red: "#E10600",
        neon: "#39FF14",
      },
    },
  },
  plugins: [],
};

export default config;
