"use client";

import { useState } from "react";

/**
 * Contact is an action, not a page. The mailto covers people with a mail client
 * configured; the copy button covers everyone else, which on a recruiter's
 * laptop is most of them.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permissions). The mailto link
      // beside this button still works, so there's nothing to recover from.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="label-face text-muted hover:text-ink border-line hover:border-muted rounded-sm border px-3 py-2 transition-colors"
    >
      {/* aria-live so the confirmation is announced, not just seen. */}
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
