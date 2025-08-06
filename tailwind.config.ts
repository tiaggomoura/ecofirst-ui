import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        soft: "#f8f9fb",
        primary: "#011b5f",
        accent: "#0071ea",
      },
    },
  },
};

export default config;
