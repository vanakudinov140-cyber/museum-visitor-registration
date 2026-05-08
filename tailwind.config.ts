import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#111827",
          foreground: "#f9fafb"
        },
        muted: "#6b7280"
      },
      boxShadow: {
        card: "0 12px 36px -18px rgba(17,24,39,.35)"
      }
    }
  },
  plugins: []
};

export default config;
