import type { Metadata } from "next";

import { Figure } from "@/components/figure";
import { ProjectCard } from "@/components/project-card";
import { StatusBadge } from "@/components/status-badge";
import { getProjects } from "@/lib/content";
import { labEntries, labFraming } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Client sites and self-directed systems — what's shipped, what's in progress, and what each one is actually for.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const clientWork = projects.filter((entry) => entry.meta.lane === "client");
  const labWork = projects.filter((entry) => entry.meta.lane === "lab");

  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-4 sm:px-8 sm:pt-24">
        <h1 className="display-face text-ink text-4xl sm:text-6xl">Projects</h1>
        <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed text-balance">
          Everything with a live link is here. Work that isn&rsquo;t deployed yet gets one
          honest line and a status, not a page pretending to be finished.
        </p>
      </section>

      <Figure number="01" title="Client work">
        <div className="grid gap-4 sm:grid-cols-2">
          {clientWork.map((entry) => (
            <ProjectCard key={entry.meta.slug} project={entry.meta} />
          ))}
        </div>
      </Figure>

      <Figure number="02" title="The lab">
        <p className="text-muted max-w-2xl leading-relaxed text-balance">{labFraming}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {labWork.map((entry) => (
            <ProjectCard key={entry.meta.slug} project={entry.meta} />
          ))}
        </div>

        <h3 className="label-face text-muted mt-12">In progress — no deployment yet</h3>
        <ul className="border-line mt-4 border-t">
          {labEntries.map((entry) => (
            <li
              key={entry.title}
              className="border-line grid gap-x-6 gap-y-2 border-b py-5 sm:grid-cols-[16rem_1fr]"
            >
              <div className="flex items-center gap-3">
                <h4 className="display-face text-ink text-base">{entry.title}</h4>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-muted text-sm leading-relaxed">{entry.summary}</p>
            </li>
          ))}
        </ul>
      </Figure>
    </>
  );
}
