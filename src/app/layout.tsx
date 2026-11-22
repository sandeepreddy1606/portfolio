import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Geist_Mono, Public_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SITE } from "@/constants/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { CommandPaletteProvider } from "@/components/providers/command-palette";
import { CustomCursor } from "@/components/providers/cursor";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { PageLoader } from "@/components/layout/page-loader";
import { NoiseOverlay } from "@/components/ui/backgrounds";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  // next/font has no metrics for Big Shoulders, so it cannot size-match a
  // fallback; a condensed system face keeps the swap from reflowing much.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif-condensed", "sans-serif"],
});
const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2c3b35" },
    { media: "(prefers-color-scheme: dark)", color: "#2c3b35" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${shoulders.variable} ${publicSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            <LenisProvider>
              <JsonLd />
              <PageLoader />
              <NoiseOverlay />
              <CustomCursor />
              <ScrollProgress />
              <Navbar />
              <main id="main">{children}</main>
              <Footer />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    toast:
                      "!bg-surface !border-line !text-ink !rounded-2xl !backdrop-blur-xl !shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]",
                    description: "!text-ink-muted",
                  },
                }}
              />
            </LenisProvider>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
