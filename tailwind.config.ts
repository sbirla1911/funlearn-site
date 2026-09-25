import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FCFBF6",
        ink: "#1F2A37",
        muted: "#5B6673",
        // Brand green (primary CTA)
        grass: {
          DEFAULT: "#46B06A",
          dark: "#3A9A5A",
          soft: "#E4F5EA",
          tint: "#EAF6EA",
        },
        // FUN highlight yellow
        sunny: {
          DEFAULT: "#FBD24E",
          soft: "#FCE7A0",
          tint: "#FEF6DC",
        },
        // Physics / info blue
        sky: {
          DEFAULT: "#4E9BE6",
          soft: "#E8F2FC",
        },
        // Chemistry orange
        tangerine: {
          DEFAULT: "#F0994A",
          soft: "#FDF0E2",
        },
        // Math / gaming purple
        grape: {
          DEFAULT: "#8B7FE8",
          soft: "#EFEDFB",
        },
        // Friend pink
        blossom: {
          DEFAULT: "#EC8FB0",
          soft: "#FBE9F0",
        },
        teal: {
          DEFAULT: "#3E9CBE",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      boxShadow: {
        soft: "0 14px 40px -18px rgba(31, 42, 55, 0.20)",
        card: "0 8px 24px -12px rgba(31, 42, 55, 0.16)",
        lift: "0 22px 50px -20px rgba(70, 176, 106, 0.40)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pop-in": "pop-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
