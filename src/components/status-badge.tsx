import type { ProjectStatus } from "@/lib/projects";

/**
 * Status is stated, never implied. A badge that says `Design` is doing more for
 * credibility than a project page pretending to be finished would.
 */
const LABELS: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  prototype: "Prototype",
  building: "Building",
  design: "Design",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  // `signal` marks live things; everything in progress stays quiet. The accent
  // is a state colour, so it has to mean something consistent everywhere.
  const isLive = status === "shipped";

  return (
    <span
      className={`label-face rounded-sm border px-1.5 py-0.5 ${
        isLive ? "border-signal/40 text-signal" : "border-line text-muted"
      }`}
    >
      {LABELS[status]}
    </span>
  );
}
