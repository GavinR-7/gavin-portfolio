import { OG_CONTENT_TYPE, OG_SIZE, createOgImage, truncate } from "@/lib/og";
import { siteConfig } from "@/site.config";

export const alt = `${siteConfig.identity.name} — ${siteConfig.identity.discipline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    eyebrow: siteConfig.identity.discipline,
    title: siteConfig.identity.name,
    subtitle: truncate(siteConfig.positioning.lead, 120),
  });
}
