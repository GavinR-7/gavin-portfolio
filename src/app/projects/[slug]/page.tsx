import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ExternalLink } from "@/components/external-link";
import { JsonLd } from "@/components/json-ld";
import { MdxContent } from "@/components/mdx-content";
import { StatusBadge } from "@/components/status-badge";
import { getCaseStudies, getProject } from "@/lib/content";
import { caseStudySchema } from "@/lib/schema";
import { siteConfig } from "@/site.config";

type Params = { params: Promise<{ slug: string }> };

/**
 * Only projects with `caseStudy: true` get a route. A project without a story
 * that ends somewhere is a card, not a page.
 */
export function generateStaticParams() {
  return getCaseStudies().map((entry) => ({ slug: entry.meta.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProject(slug);
  if (!entry) return {};

  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: entry.meta.title,
      description: entry.meta.summary,
      url: `${siteConfig.url}/projects/${slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const entry = getProject(slug);

  // Covers a draft in production and a slug that was never a case study.
  if (!entry || !entry.meta.caseStudy) notFound();

  const { meta, body } = entry;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={caseStudySchema(meta)} />
      <Link
        href="/projects"
        className="label-face text-muted hover:text-signal underline-offset-4 hover:underline"
      >
        ← All projects
      </Link>

      <h1 className="display-face text-ink mt-6 text-4xl text-balance sm:text-5xl">
        {meta.title}
      </h1>
      <p className="text-muted mt-4 text-lg leading-relaxed text-balance">
        {meta.summary}
      </p>

      {/* The TL;DR strip — scannable in five seconds, straight from frontmatter,
          which is why it can never drift from the card on the index page. */}
      <dl className="border-line mt-8 grid gap-x-8 gap-y-4 border-y py-6 sm:grid-cols-2">
        {meta.client ? <Spec label="Client" value={meta.client} /> : null}
        <Spec label="Role" value={meta.role} />
        <Spec label="Stack" value={meta.stack.join(", ")} />
        {meta.timeline ? <Spec label="Timeline" value={meta.timeline} /> : null}
        <div className="flex gap-3">
          <dt className="label-face text-muted shrink-0 pt-0.5">Status</dt>
          <dd>
            <StatusBadge status={meta.status} />
          </dd>
        </div>
        {meta.liveUrl ? (
          <div className="flex gap-3">
            <dt className="label-face text-muted shrink-0">Live</dt>
            <dd className="text-sm">
              <ExternalLink
                href={meta.liveUrl}
                className="text-signal underline underline-offset-4"
              >
                {new URL(meta.liveUrl).host.replace(/^www\./, "")} ↗
              </ExternalLink>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-12">
        <MdxContent source={body} />
      </div>

      {/* Every case study ends with a way to act on it. */}
      <aside className="border-line bg-surface mt-16 rounded-sm border p-8">
        <p className="display-face text-ink text-2xl">Working on something similar?</p>
        <p className="text-muted mt-3 leading-relaxed">
          I&rsquo;m happy to talk through how I&rsquo;d approach it.
        </p>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-signal border-signal/40 hover:bg-signal hover:text-bg mt-6 inline-block rounded-sm border px-4 py-2 text-sm transition-colors"
        >
          {siteConfig.contact.email}
        </a>
      </aside>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="label-face text-muted shrink-0">{label}</dt>
      <dd className="text-ink text-sm">{value}</dd>
    </div>
  );
}
