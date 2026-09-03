import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Prose styling is explicit component overrides rather than a typography
 * plugin. It's more lines, but every rule here is one I can point at — and the
 * measure, rhythm and code treatment are part of the design system rather than
 * a plugin's opinion layered on top of it.
 *
 * This is all server-rendered. MDX ships no JavaScript to the browser.
 */
const components = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="display-face text-ink mt-14 mb-4 text-2xl first:mt-0" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="display-face text-ink mt-10 mb-3 text-lg" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-ink/90 my-5 leading-[1.75]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="marker:text-signal my-5 list-disc space-y-2 pl-5" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="marker:text-muted my-5 list-decimal space-y-2 pl-5" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-ink/90 leading-[1.7]" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-ink font-semibold" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-signal underline decoration-1 underline-offset-4" {...props} />
  ),
  hr: () => <hr className="border-line my-12" />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-signal/40 text-muted my-6 border-l-2 pl-5 italic"
      {...props}
    />
  ),
  // Inline code. The `pre > code` case is handled by `pre` below, which strips
  // this styling by resetting the background.
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-surface border-line rounded-sm border px-1 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  // Code blocks scroll inside themselves rather than pushing the page sideways —
  // the one rule that keeps long lines from breaking the 360px layout.
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-surface border-line my-6 overflow-x-auto rounded-sm border p-4 text-sm leading-relaxed [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
