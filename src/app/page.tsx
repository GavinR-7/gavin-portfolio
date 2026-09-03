import Link from "next/link";

import { ContactBand } from "@/components/contact-band";
import { Figure } from "@/components/figure";
import { ProjectCard } from "@/components/project-card";
import { StatusBadge } from "@/components/status-badge";
import { StepResponse } from "@/components/step-response";
import { featuredProjects, labEntries, labFraming } from "@/lib/projects";
import { siteConfig } from "@/site.config";

export default function HomePage() {
  const { identity, positioning, contact } = siteConfig;

  return (
    <>
      {/* Hero. Everything a first-time reader needs is above the trace: who,
          what, and proof one scroll below. The trace is the only motion. */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-4 sm:px-8 sm:pt-24">
        <h1 className="display-face text-ink text-5xl sm:text-7xl">{identity.name}</h1>

        <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed text-balance sm:text-xl">
          <span className="text-ink">{identity.discipline}.</span> {positioning.lead}
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-2.5 gap-y-2">
          {positioning.attributes.map((attribute) => (
            <li
              key={attribute}
              className="label-face text-muted border-line rounded-sm border px-2.5 py-1"
            >
              {attribute}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/projects"
            className="text-signal border-signal/40 hover:bg-signal hover:text-bg rounded-sm border px-4 py-2 text-sm transition-colors"
          >
            See the work
          </Link>
          <a
            href={`mailto:${contact.email}`}
            className="label-face text-muted hover:text-ink transition-colors"
          >
            {contact.email}
          </a>
        </div>

        <StepResponse />
        <p className="label-face text-muted mt-3">Fig. 00 — Step response</p>
      </section>

      <Figure number="01" title="Selected work">
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <Link
          href="/projects"
          className="label-face text-muted hover:text-signal mt-6 inline-block underline-offset-4 hover:underline"
        >
          All projects →
        </Link>
      </Figure>

      <Figure number="02" title="In the lab">
        <p className="text-muted max-w-2xl leading-relaxed text-balance">{labFraming}</p>

        <ul className="border-line mt-8 border-t">
          {labEntries.map((entry) => (
            <li
              key={entry.title}
              className="border-line grid gap-x-6 gap-y-2 border-b py-5 sm:grid-cols-[16rem_1fr]"
            >
              <div className="flex items-center gap-3">
                <h3 className="display-face text-ink text-base">{entry.title}</h3>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-muted text-sm leading-relaxed">{entry.summary}</p>
            </li>
          ))}
        </ul>
      </Figure>

      <Figure number="03" title="About">
        <p className="text-ink max-w-2xl text-lg leading-relaxed text-balance">
          I&rsquo;m a junior in Electrical &amp; Computer Engineering at Cornell, and I
          run a small web practice on Long Island. Most of what I know came from shipping
          things people actually depend on — a brokerage&rsquo;s listings, a
          barber&rsquo;s booking path, a rental business&rsquo;s entire online presence —
          and from building the systems I wanted to exist for my own coursework.
        </p>
        <Link
          href="/about"
          className="label-face text-muted hover:text-signal mt-6 inline-block underline-offset-4 hover:underline"
        >
          More about me →
        </Link>
      </Figure>

      <ContactBand />
    </>
  );
}
