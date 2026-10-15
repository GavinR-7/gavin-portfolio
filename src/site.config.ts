/**
 * Single source of truth for everything that appears in more than one place.
 *
 * Rule: components never contain business facts. If a string shows up in the
 * hero, a meta description, an OG image and the footer, it lives here once.
 *
 * `null` is meaningful throughout this file — it means "this doesn't exist
 * yet, so don't render a link to it." A dead link is worse than no link.
 */

export type NavItem = {
  readonly href: string;
  readonly label: string;
};

export const siteConfig = {
  /** Canonical origin. Used for metadataBase, sitemap, canonical URLs, OG. */
  url: "https://www.gavinreis.com",

  identity: {
    name: "Gavin Reis",
    discipline: "Electrical & Computer Engineering at Cornell",
    location: "Long Island, NY",
  },

  /**
   * The positioning, locked in Phase 0. This is the only place it is written.
   * The hero, the homepage meta description and the OG card all read from here,
   * which is what keeps them from drifting apart.
   */
  positioning: {
    lead: "I design systems end to end and put them in front of real users.",
    /**
     * The instrument-label strip under the lead. Every label must have a real
     * project behind it on the site — a label with nothing to point at is the
     * fastest way to lose a reader who checks.
     */
    attributes: [
      "production web systems",
      "retrieval pipelines",
      "LLM agents",
      "evals as release gates",
    ],
  },

  contact: {
    email: "gjr74@cornell.edu",
  },

  links: {
    github: "https://github.com/GavinR-7",
    linkedin: "https://www.linkedin.com/in/gavinreis",
    /** The repo behind this site — the code is itself a portfolio piece. */
    repo: "https://github.com/GavinR-7/gavin-portfolio" as string | null,
  },

  /** Renders nowhere until the PDF actually exists in /public. */
  resume: {
    path: "/resume.pdf",
    available: true,
  },

  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/writing", label: "Writing" },
    { href: "/about", label: "About" },
  ] as const satisfies readonly NavItem[],

  /** Flipped on in Phase 6 once the production deploy exists. */
  analytics: false,
} as const;

/** Derived once so the meta description can never drift from the hero. */
export const siteDescription = `${siteConfig.identity.name} — ${siteConfig.identity.discipline}. ${siteConfig.positioning.lead}`;

export type SiteConfig = typeof siteConfig;
