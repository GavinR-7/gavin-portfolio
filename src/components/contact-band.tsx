import { CopyEmail } from "@/components/copy-email";
import { ExternalLink } from "@/components/external-link";
import { siteConfig } from "@/site.config";

export function ContactBand() {
  const { contact, links } = siteConfig;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="border-line bg-surface rounded-sm border p-8 sm:p-12">
        <h2 id="contact-heading" className="display-face text-ink text-3xl sm:text-4xl">
          Get in touch
        </h2>
        <p className="text-muted mt-3 max-w-lg leading-relaxed">
          Email is the fastest way to reach me.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="text-signal border-signal/40 hover:bg-signal hover:text-bg rounded-sm border px-4 py-2 text-sm transition-colors"
          >
            {contact.email}
          </a>
          <CopyEmail email={contact.email} />
        </div>

        <nav aria-label="Elsewhere" className="border-line mt-8 flex gap-6 border-t pt-6">
          <ExternalLink
            href={links.github}
            className="label-face text-muted hover:text-signal transition-colors"
          >
            GitHub
          </ExternalLink>
          <ExternalLink
            href={links.linkedin}
            className="label-face text-muted hover:text-signal transition-colors"
          >
            LinkedIn
          </ExternalLink>
        </nav>
      </div>
    </section>
  );
}
