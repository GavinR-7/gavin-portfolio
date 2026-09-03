/**
 * Structured data — the machine-readable copy of what the page already says.
 *
 * Search engines (and increasingly, AI crawlers) read this to understand what a
 * page *is* rather than guessing from markup. A `Person` on the homepage is what
 * lets a search for "Gavin Reis" resolve to a person with an affiliation and
 * known profiles, rather than to a string that happens to appear on a page.
 *
 * The rule that matters: JSON-LD must describe what a human can actually see on
 * the page. Structured data that claims more than the page shows is spam, and
 * search engines treat it that way.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Safe: `data` is built from our own typed content, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
