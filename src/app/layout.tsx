import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig, siteDescription } from "@/site.config";

import "./globals.css";

/**
 * One typeface family for the whole site. `axes: ["wdth"]` pulls in Archivo's
 * variable width axis, which is what lets headings set wide (the `display-face`
 * utility) and body copy set normal from a single font file. That width
 * contrast is the typographic identity — bought for zero extra bytes.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** The instrument-label voice: eyebrows, badges, spec rows, figure captions. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.identity.name} — ${siteConfig.identity.discipline}`,
    template: `%s — ${siteConfig.identity.name}`,
  },
  description: siteDescription,
};

/**
 * Runs before first paint, so the correct theme is applied before the browser
 * has anything to repaint — this is what prevents the white flash on a dark-mode
 * reload. It has to be inline and blocking; an external or deferred script is
 * too late by definition. Deliberately tiny and dependency-free.
 *
 * Precedence: an explicit stored choice wins, otherwise fall back to the OS.
 */
const themeScript = `
try {
  var stored = localStorage.getItem("theme");
  var dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the script above mutates <html>'s class list
    // before React hydrates, so server and client markup differ here by design.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${archivo.variable} ${plexMono.variable}`}>
        <a
          href="#main"
          className="label-face bg-surface text-ink focus:ring-signal sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:px-3 focus:py-2 focus:ring-2"
        >
          Skip to content
        </a>

        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
