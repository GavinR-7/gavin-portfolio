import { notFound } from "next/navigation";

import { getCaseStudies, getProject } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, createOgImage, truncate } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getCaseStudies().map((entry) => ({ slug: entry.meta.slug }));
}

/** Every field on the card comes from the case study's own frontmatter. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getProject(slug);
  if (!entry) notFound();

  return createOgImage({
    eyebrow: entry.meta.lane === "client" ? "Client work" : "The lab",
    title: entry.meta.title,
    subtitle: truncate(entry.meta.summary, 130),
  });
}
