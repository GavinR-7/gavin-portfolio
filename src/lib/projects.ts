/**
 * TEMPORARY — Phase 2 only.
 *
 * Phase 3 replaces this module with the MDX + zod content pipeline, at which
 * point the shape below becomes the frontmatter schema and this file is
 * deleted. The facts here are real; only the delivery mechanism is provisional.
 */

export type ProjectStatus = "shipped" | "prototype" | "building" | "design";
export type ProjectLane = "client" | "lab";

/** A project with something you can actually click. Earns a card and a page. */
export type LinkedProject = {
  readonly slug: string;
  readonly title: string;
  readonly lane: ProjectLane;
  readonly status: Extract<ProjectStatus, "shipped" | "prototype">;
  readonly liveUrl: string;
  readonly role: string;
  readonly stack: readonly string[];
  readonly summary: string;
  readonly featured: boolean;
};

/** A system with no deployment. Earns one honest line and a badge. Never a page. */
export type LabEntry = {
  readonly title: string;
  readonly status: Extract<ProjectStatus, "building" | "design">;
  readonly summary: string;
};

export const linkedProjects: readonly LinkedProject[] = [
  {
    slug: "john-savoretti-realty",
    title: "John Savoretti Realty",
    lane: "client",
    status: "shipped",
    liveUrl: "https://john-savoretti-realty.vercel.app/",
    role: "Design & build",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    summary:
      "Production site for a brokerage with two Long Island offices. Residential, rental and commercial listings share one typed pipeline built on discriminated unions, so invalid state combinations fail to compile rather than reaching the page.",
    featured: true,
  },
  {
    slug: "above-all-tents",
    title: "Above All Tents",
    lane: "client",
    status: "shipped",
    liveUrl: "https://abovealltents.com/",
    role: "Design, build & delivery",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    summary:
      "A tent rental business on Long Island. The first site I designed, built, shipped and sold end to end — scoped, delivered and handed over on its own domain.",
    featured: true,
  },
  {
    slug: "the-ledger",
    title: "The Ledger",
    lane: "lab",
    status: "prototype",
    liveUrl: "https://the-ledger-ashen.vercel.app/",
    role: "Self-directed",
    stack: ["Next.js", "TypeScript", "Claude API"],
    summary:
      "An experiment in presenting reporting without editorial slant. It runs on sample articles today; the unsolved part is defining “unbiased” precisely enough to measure it.",
    featured: true,
  },
  {
    slug: "gc-kuts",
    title: "GC Kuts",
    lane: "client",
    status: "shipped",
    liveUrl: "https://gckuts-site.vercel.app/",
    role: "Design & build",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    summary:
      "An independent barber in Smithtown whose entire funnel runs through Instagram. Mobile-first, where load speed and the path to a booking are the whole game.",
    featured: false,
  },
];

/**
 * The framing line matters as much as the list: these are designed to feed each
 * other, and saying so plainly is the systems-thinking signal.
 */
export const labFraming =
  "These interlock. The archiver feeds the tutor; Inkline’s output is built to feed it too. I design schemas with their downstream consumers in mind.";

export const labEntries: readonly LabEntry[] = [
  {
    title: "Canvas Course Archiver",
    status: "building",
    summary:
      "Ingestion pipeline that archives Cornell Canvas courses into a clean, queryable manifest — the foundation layer for a course tutor.",
  },
  {
    title: "ECE Course Tutor",
    status: "design",
    summary:
      "Retrieval-augmented tutor over archived course material, with citations back to source. Consumes the archiver’s schema.",
  },
  {
    title: "PDF Reader",
    status: "building",
    summary:
      "Reads a PDF aloud with the current sentence highlighted. Continuous audio kept in sync with the text is the hard part — and it’s an architecture problem, not an AI problem.",
  },
  {
    title: "Inkline",
    status: "building",
    summary:
      "Handwriting-to-text pipeline with a CER/WER eval harness standing as the release gate.",
  },
  {
    title: "AI legal triage",
    status: "building",
    summary:
      "Jurisdiction-aware legal information tool. Escalation-recall evals are the release blocker.",
  },
];

export const featuredProjects = linkedProjects.filter((project) => project.featured);
