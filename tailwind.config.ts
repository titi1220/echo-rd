import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        royal: "#003DA5",
        civic: "#0B2E63",
        alert: "#CE1126",
        ink: "#182230",
        mist: "#F4F7FB"
      },
      boxShadow: {
        civic: "0 18px 50px rgba(11,46,99,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
