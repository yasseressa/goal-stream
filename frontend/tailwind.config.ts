import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "#f7f5ec",
          100: "#ebe5d0",
          600: "#1f6f52",
          700: "#16523d",
          900: "#10261d"
        },
        accent: {
          400: "#ffb703",
          500: "#fb8500"
        }
      },
      boxShadow: {
        card: "0 18px 45px rgba(16, 38, 29, 0.12)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
