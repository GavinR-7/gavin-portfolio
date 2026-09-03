import { siteConfig } from "@/site.config";

/**
 * Phase 1 stub. This is the real positioning copy rendered against the real
 * token and type system — not placeholder content — but the hero's signature
 * element, featured work, Lab strip and CTA band all arrive in Phase 2.
 */
export default function HomePage() {
  const { identity, positioning } = siteConfig;

  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
      <h1 className="display-face text-ink text-5xl sm:text-7xl">{identity.name}</h1>

      <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed text-balance sm:text-xl">
        <span className="text-ink">{identity.discipline}.</span> {positioning.lead}
      </p>

      <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-2">
        {positioning.attributes.map((attribute) => (
          <li
            key={attribute}
            className="label-face text-muted border-line rounded-sm border px-2.5 py-1"
          >
            {attribute}
          </li>
        ))}
      </ul>
    </section>
  );
}
