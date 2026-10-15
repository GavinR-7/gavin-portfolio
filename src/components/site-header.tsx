import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/site.config";

/**
 * No hamburger menu, and that's deliberate: three short nav items plus a
 * contact link fit on one line above 640px and wrap onto their own row below
 * it. A wrapping flex row costs zero JavaScript; a mobile drawer costs a client
 * component, a state hook, focus trapping and an escape handler.
 */
export function SiteHeader() {
  return (
    <header className="border-line bg-bg/85 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
        <Link href="/" className="display-face text-ink text-base">
          {siteConfig.identity.name}
        </Link>

        <nav
          aria-label="Primary"
          className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end sm:gap-6"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-face text-muted hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            className="label-face text-ink border-muted hover:border-signal hover:text-signal rounded-sm border px-2.5 py-1 transition-colors"
          >
            Contact
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
