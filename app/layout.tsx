import type { Metadata } from "next";
import { Inter, Instrument_Serif, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { FaviconSync } from "@/components/favicon-sync";
import { MotionProvider } from "@/components/motion-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rushikesh Gandhmal — AI Software Engineer",
  description:
    "AI Software Engineer with 4+ years shipping production AI systems — agents, RAG pipelines, MCP servers, and streaming UIs. Available for senior roles.",
  keywords: [
    "Rushikesh Gandhmal",
    "AI Engineer",
    "AI Software Engineer",
    "LLM Engineer",
    "Full Stack Developer",
    "RAG",
    "MCP",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Rushikesh Gandhmal" }],
  creator: "Rushikesh Gandhmal",
  metadataBase: new URL("https://rushikesh.dev"),
  openGraph: {
    title: "Rushikesh Gandhmal — AI Software Engineer",
    description:
      "Shipping production AI systems — agents, RAG, MCP, streaming UIs.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rushikesh Gandhmal — AI Software Engineer",
    description:
      "Shipping production AI systems — agents, RAG, MCP, streaming UIs.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The inline script in <head> overwrites `data-theme` before paint;
  // the default here just guarantees something sensible for SSR.
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${caveat.variable} ${jetbrains.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="bg-paper text-ink font-sans antialiased">
        <ThemeProvider>
          <MotionProvider>
            <FaviconSync />
            <ScrollToTop />
            <ScrollProgress />
            <CustomCursor />
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
