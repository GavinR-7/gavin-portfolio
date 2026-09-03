import Link from "next/link";

/**
 * The signature element's second and only other appearance: the same axis, with
 * no trace on it. Zero JavaScript — it's the CSS fallback line from the hero,
 * used deliberately rather than as a degradation.
 */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
      <p className="label-face text-signal">Error 404</p>
      <h1 className="display-face text-ink mt-4 text-4xl sm:text-5xl">No signal</h1>
      <p className="text-muted mt-4 max-w-md text-lg leading-relaxed">
        This page doesn&rsquo;t exist. Nothing is wrong with your connection.
      </p>

      <div className="trace-axis border-line mt-12 h-28 w-full" aria-hidden="true" />
      <p className="label-face text-muted mt-3">Fig. 404 — Flat line</p>

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
        <Link
          href="/"
          className="text-signal border-signal/40 hover:bg-signal hover:text-bg rounded-sm border px-4 py-2 text-sm transition-colors"
        >
          Back home
        </Link>
        <Link
          href="/projects"
          className="label-face text-muted hover:text-ink self-center transition-colors"
        >
          Projects
        </Link>
      </div>
    </section>
  );
}
