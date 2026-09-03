import type { ReactNode } from "react";

/**
 * The datasheet grammar. Every major block on the site is a numbered figure
 * with a mono caption, which is where the "engineered document" feel comes from
 * — it's typography doing the work, at zero runtime cost.
 */
export function Figure({
  number,
  title,
  children,
  id,
}: {
  number: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  const headingId = `fig-${number}`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="border-line mb-8 flex items-baseline gap-3 border-t pt-4">
        <span className="label-face text-signal">Fig. {number}</span>
        <h2 id={headingId} className="label-face text-muted">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
