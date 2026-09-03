import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { stepResponseSvg } from "@/lib/step-response";
import { siteConfig } from "@/site.config";

/**
 * Per-page social cards, generated at build time by `next/og`.
 *
 * ImageResponse takes JSX and renders it to PNG with Satori — a tiny layout
 * engine that understands a subset of flexbox and no CSS files, which is why
 * every style here is an inline object and why fonts must be handed over as
 * raw bytes. The fonts are committed to the repo rather than fetched, so the
 * build has no network dependency.
 *
 * The payoff: every case study gets a branded card derived from its own
 * frontmatter. Nothing is designed by hand and nothing can drift from the page.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontDir = join(process.cwd(), "src/assets/fonts");
const archivo600 = readFileSync(join(fontDir, "archivo-600.woff"));
const archivo400 = readFileSync(join(fontDir, "archivo-400.woff"));
const plexMono500 = readFileSync(join(fontDir, "plex-mono-500.woff"));

// The dark theme's tokens, restated: Satori can't read the stylesheet.
const INK = "#e9ebed";
const MUTED = "#98a0a8";
const BG = "#101214";
const SIGNAL = "#f0a93c";
const LINE = "#2a2f34";

const traceDataUri = `data:image/svg+xml;base64,${Buffer.from(
  stepResponseSvg(1200, 150, SIGNAL),
).toString("base64")}`;

export function createOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        padding: "64px 72px",
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Plex Mono",
            fontSize: 22,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: SIGNAL,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: title.length > 44 ? 62 : 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -1.6,
            color: INK,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.45,
              color: MUTED,
              // Satori has no line-clamp, so long summaries are trimmed by
              // the caller before they get here.
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* The signature element, from the same function the hero canvas uses. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={traceDataUri} width={1056} height={132} alt="" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 22,
            marginTop: 8,
            fontFamily: "Plex Mono",
            fontSize: 20,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <div>{siteConfig.identity.name}</div>
          <div>{siteConfig.url.replace("https://", "")}</div>
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: archivo600, weight: 600, style: "normal" },
        { name: "Archivo", data: archivo400, weight: 400, style: "normal" },
        { name: "Plex Mono", data: plexMono500, weight: 500, style: "normal" },
      ],
    },
  );
}

/** Satori won't clamp text, so long summaries get trimmed on a word boundary. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}
