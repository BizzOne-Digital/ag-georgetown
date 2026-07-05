import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ink: "#1A1A1A",
      black: "#0D0D0D",
      white: "#FFFFFF",
      cream: "#FAF8F4",
      "gold-start": "#C9A227",
      "gold-end": "#F0D98C",
      rose: "#E8879E",
      "rose-deep": "#C65C77",
      error: "#B4433C",
    },
    fontFamily: {
      display: ["var(--font-fraunces)", "serif"],
      body: ["var(--font-inter)", "sans-serif"],
    },
    extend: {
      fontSize: {
        h1: ["clamp(2.75rem, 5vw, 4.5rem)", { lineHeight: "1.05" }],
        h2: ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1" }],
        h3: ["1.5rem", { lineHeight: "1.25" }],
        body: ["1.0625rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.15em" }],
      },
      letterSpacing: {
        label: "0.15em",
      },
      backgroundImage: {
        gold: "linear-gradient(135deg, var(--color-gold-start), var(--color-gold-end))",
        "gold-diag": "linear-gradient(135deg, #C9A227 0%, #F0D98C 50%, #C9A227 100%)",
      },
      clipPath: {
        facet:
          "polygon(8% 0%, 92% 4%, 100% 38%, 96% 100%, 22% 96%, 0% 62%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "foil-sweep": {
          "0%": { transform: "translateX(-150%) rotate(-20deg)" },
          "100%": { transform: "translateX(150%) rotate(-20deg)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "foil-sweep": "foil-sweep 500ms ease-out",
      },
      transitionTimingFunction: {
        "ease-out-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".clip-facet": {
          clipPath:
            "polygon(8% 0%, 92% 4%, 100% 38%, 96% 100%, 22% 96%, 0% 62%)",
        },
        ".clip-facet-sm": {
          clipPath: "polygon(4% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        ".clip-monogram-badge": {
          clipPath:
            "circle(50% at 50% 50%)",
        },
      });
    },
  ],
};

export default config;
