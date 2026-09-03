import type { ReactNode } from "react";

/**
 * Every off-site link on this site goes through here.
 *
 * Live project links open in a new tab so a reader doesn't lose the portfolio
 * to get back to it — but "opens in a new tab" is information a sighted user
 * gets from the ↗ and a screen-reader user gets from nothing at all, so it's
 * stated explicitly for them.
 */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
