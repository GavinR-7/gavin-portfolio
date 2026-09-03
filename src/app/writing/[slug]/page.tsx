import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxContent } from "@/components/mdx-content";
import { getPost, getPosts } from "@/lib/content";
import { siteConfig } from "@/site.config";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((entry) => ({ slug: entry.meta.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPost(slug);
  if (!entry) return {};

  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/writing/${slug}` },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const entry = getPost(slug);
  if (!entry) notFound();

  const { meta, body } = entry;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <Link
        href="/writing"
        className="label-face text-muted hover:text-signal underline-offset-4 hover:underline"
      >
        ← All writing
      </Link>

      <h1 className="display-face text-ink mt-6 text-4xl text-balance sm:text-5xl">
        {meta.title}
      </h1>

      <p className="label-face text-muted border-line mt-6 border-b pb-6">
        <time dateTime={meta.publishedAt.toISOString()}>
          {dateFormat.format(meta.publishedAt)}
        </time>
        {" · "}
        {meta.readingTime} min read
      </p>

      <div className="mt-10">
        <MdxContent source={body} />
      </div>

      <aside className="border-line mt-16 border-t pt-8">
        <p className="text-muted leading-relaxed">
          Questions, corrections, or something you&rsquo;re working on —{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-signal underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </aside>
    </article>
  );
}
