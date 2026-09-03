import { ExternalLink } from "@/components/external-link";
import { siteConfig } from "@/site.config";

/**
 * Every link here is conditional on the thing it points at actually existing.
 * `repo` is null until the GitHub repo is created in Phase 6, and `resume`
 * stays unavailable until the PDF is in /public — so neither can ship as a 404.
 */
export function SiteFooter() {
  const { identity, contact, links, resume } = siteConfig;

  return (
    <footer className="border-line mt-28 border-t">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="display-face text-ink text-lg">{identity.name}</p>
            <p className="label-face text-muted mt-2">{identity.location}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5 sm:items-end">
            <FooterLink href={`mailto:${contact.email}`}>{contact.email}</FooterLink>
            <ExternalLink href={links.github} className={FOOTER_LINK}>
              GitHub
            </ExternalLink>
            <ExternalLink href={links.linkedin} className={FOOTER_LINK}>
              LinkedIn
            </ExternalLink>
            {resume.available ? <FooterLink href={resume.path}>Résumé</FooterLink> : null}
          </nav>
        </div>

        <p className="label-face text-muted border-line mt-10 border-t pt-6">
          Built with Next.js, TypeScript and Tailwind
          {links.repo ? (
            <>
              {" — "}
              <ExternalLink
                href={links.repo}
                className="hover:text-signal underline underline-offset-4"
              >
                view source
              </ExternalLink>
            </>
          ) : null}
        </p>
      </div>
    </footer>
  );
}

const FOOTER_LINK = "text-muted hover:text-signal text-sm transition-colors";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className={FOOTER_LINK}>
      {children}
    </a>
  );
}
