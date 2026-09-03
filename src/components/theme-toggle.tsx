"use client";

/**
 * The only interactive chrome on the site, and deliberately tiny.
 *
 * It reads and writes the `.dark` class on <html> directly rather than holding
 * React state. That matters: the class is already correct before hydration
 * (the inline script in layout.tsx set it), so the icons — which are swapped by
 * CSS, not by JS — render correctly on the very first paint. No state means no
 * hydration mismatch and no flash of the wrong icon.
 */
export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", nextTheme === "dark");
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Private browsing or blocked storage: the toggle still works for this
      // page view, it just won't be remembered. Not worth failing over.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="text-muted hover:text-ink hover:border-muted border-line -m-1 rounded-sm border p-1.5 transition-colors"
    >
      {/* Moon shows in light mode: the action available is "go dark". */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      {/* Sun shows in dark mode. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden size-4 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
