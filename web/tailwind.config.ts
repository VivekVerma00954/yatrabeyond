import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      // ── Brand colour tokens ─────────────────────────────────────────────
      // Swap these here to re-skin the entire platform in one edit.
      colors: {
        brand: {
          brown: "#3A2A1E",       // primary dark · header · dark-mode base · body text
          terracotta: "#B5532E",  // main accent · links · buttons · active states
          gold: "#C9A227",        // sparing highlights ONLY — never body/small text
          cream: "#F4ECDD",       // warm surfaces · cards · section bands
        },
      },

      fontFamily: {
        // next/font CSS variables wired in layout.tsx
        serif: ["var(--font-lora)", "Georgia", "'Times New Roman'", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        devanagari: [
          "var(--font-devanagari)",
          "'Noto Serif Devanagari'",
          "'Tiro Devanagari Hindi'",
          "serif",
        ],
      },

      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.brand.brown"),
            "--tw-prose-headings": theme("colors.brand.brown"),
            "--tw-prose-links": theme("colors.brand.terracotta"),
            "--tw-prose-bold": theme("colors.brand.brown"),
            "--tw-prose-counters": theme("colors.brand.terracotta"),
            "--tw-prose-bullets": theme("colors.brand.terracotta"),
            "--tw-prose-hr": theme("colors.brand.cream"),
            "--tw-prose-quotes": theme("colors.brand.brown"),
            "--tw-prose-quote-borders": theme("colors.brand.terracotta"),
            "--tw-prose-captions": theme("colors.brand.brown"),
            "--tw-prose-code": theme("colors.brand.brown"),
            "--tw-prose-pre-bg": theme("colors.brand.cream"),
            maxWidth: "none",
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "#F4ECDD",
            "--tw-prose-headings": "#F4ECDD",
            "--tw-prose-links": "#D4653A",
          },
        },
      }),

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
