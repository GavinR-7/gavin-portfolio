import { notFound } from "next/navigation";

import { getPost, getPosts } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, createOgImage, truncate } from "@/lib/og";

export const alt = "Writing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getPosts().map((entry) => ({ slug: entry.meta.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getPost(slug);
  if (!entry) notFound();

  return createOgImage({
    eyebrow: "Writing",
    title: entry.meta.title,
    subtitle: truncate(entry.meta.summary, 130),
  });
}
