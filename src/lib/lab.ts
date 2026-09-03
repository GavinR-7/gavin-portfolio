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
