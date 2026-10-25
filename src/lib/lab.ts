/**
 * Systems with no deployment. These get one honest line and a status badge —
 * never a page, because there's nothing to link to and nothing finished to
 * describe. They graduate to MDX case studies when they ship.
 */
export type LabStatus = "building" | "design";

export type LabEntry = {
  readonly title: string;
  readonly status: LabStatus;
  readonly summary: string;
};

/** Stating that they interlock is the systems-thinking signal, so it's said plainly. */
export const labFraming =
  "These interlock. The archiver is meant to feed the tutor, and Inkline’s output is designed to feed it too. I design schemas with their downstream consumers in mind.";

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
      "Planned: a retrieval-augmented tutor over archived course material, with citations back to source. It would consume the archiver’s schema. No code yet.",
  },
  {
    title: "PDF Reader",
    status: "building",
    summary:
      "Reads a PDF aloud with the current sentence highlighted. Continuous audio kept in sync with the text is the hard part — and it’s an architecture problem, not an AI problem.",
  },
  {
    title: "Inkline",
    status: "design",
    summary:
      "Planned: a handwriting-to-text pipeline with a CER/WER eval harness as the release gate. Not started yet.",
  },
  {
    title: "AI legal triage",
    status: "design",
    summary:
      "In design: a New York legal information and triage tool, not legal advice. Escalation-recall evals would be the release blocker. No working version yet.",
  },
];
