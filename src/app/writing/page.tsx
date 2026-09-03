import type { Metadata } from "next";
import Link from "next/link";

import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on engineering decisions from work I've actually shipped — the reasoning, not the tutorial.",
};

/** Dates render in a stable, locale-independent form so SSG output is deterministic. */
const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function WritingPage() {
  const posts = getPosts();

  return (
    <section className="mx-auto max-w-3xl px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <h1 className="display-face text-ink text-4xl sm:text-6xl">Writing</h1>
      <p className="text-muted mt-5 text-lg leading-relaxed text-balance">
        Notes on decisions from work I&rsquo;ve shipped. Writing one of these is usually
        how I find out whether I actually understood the problem.
      </p>

      <ul className="border-line mt-12 border-t">
        {posts.map(({ meta }) => (
          <li key={meta.slug} className="border-line border-b py-8">
            <article className="group relative">
              <h2 className="display-face text-ink text-xl text-balance">
                <Link
                  href={`/writing/${meta.slug}`}
                  className="before:absolute before:inset-0"
                >
                  {meta.title}
                </Link>
              </h2>
              <p className="text-muted mt-3 leading-relaxed">{meta.summary}</p>
              <p className="label-face text-muted mt-4">
                <time dateTime={meta.publishedAt.toISOString()}>
                  {dateFormat.format(meta.publishedAt)}
                </time>
                {" · "}
                {meta.readingTime} min read
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
