import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// ── Fonts (loaded via next/font/local — font files vendored in src/fonts/,
// not fetched from Google at build time. Switched 2026-07-19: next/font/google
// needs network access to fonts.googleapis.com during every build, which
// fails on networks that block/can't resolve that domain (seen on a
// corporate-network build). Files here came from the @fontsource npm
// packages (SIL Open Font License, LICENSE copied alongside each), same
// upstream font files Google serves, just vendored instead of fetched. ──
const lora = localFont({
  variable: "--font-lora",
  display: "swap",
  src: [
    { path: "../fonts/lora/lora-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/lora/lora-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/lora/lora-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/lora/lora-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/lora/lora-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/lora/lora-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "../fonts/lora/lora-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/lora/lora-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "../fonts/inter/inter-latin-400-normal.woff", weight: "400", style: "normal" },
    { path: "../fonts/inter/inter-latin-500-normal.woff", weight: "500", style: "normal" },
    { path: "../fonts/inter/inter-latin-600-normal.woff", weight: "600", style: "normal" },
    { path: "../fonts/inter/inter-latin-700-normal.woff", weight: "700", style: "normal" },
  ],
});

// First-class Devanagari face for the prayer reader — system fallback
// rendering of conjuncts/matras is not acceptable for sacred text.
const notoSerifDevanagari = localFont({
  variable: "--font-devanagari",
  display: "swap",
  src: [
    {
      path: "../fonts/noto-serif-devanagari/noto-serif-devanagari-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/noto-serif-devanagari/noto-serif-devanagari-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/noto-serif-devanagari/noto-serif-devanagari-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/noto-serif-devanagari/noto-serif-devanagari-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yatrabeyond.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "YatraBeyond — Sacred Pilgrimage Knowledge Platform",
    template: "%s | YatraBeyond",
  },
  description:
    "The most trusted knowledge and connection platform for sacred pilgrimage journeys across Hindu sacred sites in India.",
  keywords: ["pilgrimage", "yatra", "sacred sites", "India", "Hindu temples", "spirituality"],
  authors: [{ name: "YatraBeyond Editorial Team" }],
  creator: "YatraBeyond",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "YatraBeyond",
    title: "YatraBeyond — Sacred Pilgrimage Knowledge Platform",
    description:
      "Trusted knowledge for sacred pilgrimage journeys across India's most revered sites.",
  },
  twitter: {
    card: "summary_large_image",
    title: "YatraBeyond",
    description: "Trusted knowledge for sacred pilgrimage journeys across India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFDF8" },
    { media: "(prefers-color-scheme: dark)", color: "#3A2A1E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${notoSerifDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        {/* Apply the stored theme before hydration so dark mode doesn't flash.
            Reads only our own localStorage key; falls back to the OS setting. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("yb:theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />

        {/* Skip nav for keyboard/screen reader users */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
