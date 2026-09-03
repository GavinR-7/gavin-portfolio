import type { Metadata } from "next";

import { ContactBand } from "@/components/contact-band";
import { ExternalLink } from "@/components/external-link";
import { Figure } from "@/components/figure";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cornell ECE junior on Long Island. What I build, how I learned it, and what I can deliver.",
};

/**
 * Skills grouped by what they let me deliver, not by proficiency. No bars, no
 * percentages — a reader who cares can click through to something running.
 */
const capabilities = [
  {
    deliverable: "Ship a production site",
    items: [
      "Next.js (App Router)",
      "TypeScript, strict",
      "Tailwind v4",
      "Vercel CI/CD",
      "Static rendering & Core Web Vitals",
    ],
  },
  {
    deliverable: "Build a retrieval system",
    items: [
      "Claude API",
      "Vercel AI SDK",
      "pgvector on Neon",
      "Drizzle ORM",
      "Document ingestion pipelines",
    ],
  },
  {
    deliverable: "Know whether it works",
    items: [
      "Eval harnesses (CER/WER, escalation recall)",
      "Types as a correctness tool",
      "Lighthouse budgets",
    ],
  },
  {
    deliverable: "Work day to day",
    items: ["Python via uv", "Git", "WSL + VS Code"],
  },
] as const;

export default function AboutPage() {
  const { identity, links, resume } = siteConfig;

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-4 sm:px-8 sm:pt-24">
        <h1 className="display-face text-ink text-4xl sm:text-6xl">About</h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          <p className="text-ink">
            I&rsquo;m a junior studying Electrical &amp; Computer Engineering at Cornell.
            I&rsquo;m from Long Island, and that&rsquo;s where most of the work on this
            site came from.
          </p>
          <p className="text-muted">
            I run a small web practice building sites for local businesses — a real estate
            brokerage, a barber, a tent rental company. Three of them are live and one of
            them I sold. That work taught me things a course can&rsquo;t: that a data
            model is a promise you make to whoever maintains it, that speed is part of a
            first impression, and that the hardest part of a project is usually deciding
            what not to build.
          </p>
          <p className="text-muted">
            The other half is systems I build for myself — retrieval pipelines over course
            material, a handwriting-to-text converter, a reader that speaks a PDF aloud
            and keeps the audio in sync with the text. Several are designed to feed each
            other. I like the problems where the interesting part turns out to be the
            architecture rather than the model.
          </p>
          <p className="text-muted">
            {/* Deliberately plain — the web-dev practice gets its own site later, and
                this line will link to it when it exists. */}
            Currently: coursework, the systems above, and looking for what&rsquo;s next.
          </p>
        </div>

        {resume.available ? (
          <a
            href={resume.path}
            className="text-signal border-signal/40 hover:bg-signal hover:text-bg mt-10 inline-block rounded-sm border px-4 py-2 text-sm transition-colors"
          >
            Download résumé (PDF)
          </a>
        ) : null}
      </section>

      <Figure number="01" title="What I can deliver">
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {capabilities.map((group) => (
            <div key={group.deliverable}>
              <h3 className="display-face text-ink text-lg">{group.deliverable}</h3>
              <ul className="mt-4 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-muted text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Figure>

      <Figure number="02" title="Elsewhere">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <ExternalLink
              href={links.github}
              className="text-ink hover:text-signal underline underline-offset-4"
            >
              GitHub
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={links.linkedin}
              className="text-ink hover:text-signal underline underline-offset-4"
            >
              LinkedIn
            </ExternalLink>
          </li>
          <li className="label-face text-muted self-center">{identity.location}</li>
        </ul>
      </Figure>

      <ContactBand />
    </>
  );
}
