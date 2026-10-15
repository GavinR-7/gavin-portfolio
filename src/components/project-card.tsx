import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { StatusBadge } from "@/components/status-badge";
import type { Project } from "@/lib/content";

/** Hostname only — "abovealltents.com" reads better than a full URL. */
function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

/**
 * A spec block, not a marketing tile: name, one honest line, then a
 * characteristics row of real values.
 *
 * The title links to the case study when there is one and straight to the live
 * site when there isn't — so a card can never point at a page that doesn't
 * exist. `caseStudy: false` is a content decision, not a missing file.
 */
export function ProjectCard({ project }: { project: Project }) {
  // Case study, else the live site, else the code; a project with none of them is a plain card.
  const outside = project.liveUrl ?? project.repoUrl;
  const href = project.caseStudy ? `/projects/${project.slug}` : outside;

  return (
    <article className="border-line bg-surface hover:border-muted group relative rounded-sm border p-6 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <h3 className="display-face text-ink text-xl">
          {project.caseStudy && href ? (
            <Link href={href} className="before:absolute before:inset-0">
              {project.title}
            </Link>
          ) : href ? (
            <ExternalLink href={href} className="before:absolute before:inset-0">
              {project.title}
            </ExternalLink>
          ) : (
            project.title
          )}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-muted mt-3 text-sm leading-relaxed">{project.summary}</p>

      <dl className="border-line mt-5 grid gap-x-6 gap-y-2 border-t pt-4 sm:grid-cols-2">
        <SpecRow label="Role" value={project.role} />
        <SpecRow label="Stack" value={project.stack.join(", ")} />
      </dl>

      {/* Sits above the card-wide overlay link so it stays independently clickable. */}
      {outside ? (
        <ExternalLink
          href={outside}
          className="label-face text-muted hover:text-signal relative z-10 mt-4 inline-block underline-offset-4 hover:underline"
        >
          {project.liveUrl
            ? displayHost(outside)
            : `${displayHost(outside)}${new URL(outside).pathname}`}{" "}
          ↗
        </ExternalLink>
      ) : null}
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="label-face text-muted shrink-0">{label}</dt>
      <dd className="text-ink text-sm">{value}</dd>
    </div>
  );
}
