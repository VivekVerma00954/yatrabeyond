import type { Metadata, Viewport } from "next";
import { Lora, Inter, Noto_Serif_Devanagari } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// ── Fonts (loaded via next/font — zero layout shift, self-hosted from Google) ─
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// First-class Devanagari face for the prayer reader — system fallback
// rendering of conjuncts/matras is not acceptable for sacred text.
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
