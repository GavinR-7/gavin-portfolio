# Build notes

A running log, one section per phase: what got built, what broke, what was learned.

---

## Phase 0 — Positioning & content

**Built:** no code. Three positioning options, a project inventory, `CONTENT_TODO.md`,
and a confirmed sitemap.

**What changed mid-phase.** The build started as a two-audience site — local service
businesses *and* recruiters — and pivoted to a personal engineering site aimed at jobs
and school inquiries, with the freelance practice as evidence rather than the product.
The web-dev sales site becomes a separate property this one links to later.

That pivot cascaded further than the copy:

- **`/services` cut.** A four-step engagement process and a "book a call" CTA reads as
  a freelancer's sales page to a recruiter. Its content is the seed of the separate site.
- **`/work` renamed `/projects`.** "Work" reads freelance.
- **Positioning inverted.** Name became the H1, with the thesis underneath it — which
  also made the homepage `Person` JSON-LD more load-bearing for name searches.
- **The content model gained a second axis.** `status` (is there something to show)
  and `draft` (am I allowed to show it) turned out to be independent questions. Above
  All Tents is a client project that isn't finished; The Ledger is a finished-enough
  prototype nobody paid for. One flag couldn't express both.

**Two things that turned out to matter more than expected.**

The `/work` lane filter in the original spec was unbuildable: it promised symmetry
between Client Work and Lab, but no Lab project had shipped, so one lane was always
empty. It became two labelled sections instead. Worth noticing early — a filter is a
promise about the shape of your data.

The permission gates looked like the critical path for a week of planning, then turned
out to be already closed: all three clients agreed to portfolio use before their builds
started. Asking up front, before doing the work, is the whole lesson there.

**Also decided:** contact email is `gjr74@cornell.edu` (institutional address is the
stronger signal for this audience); the $3,000 Above All Tents sale stays off the site
(the fact a client paid is the signal, the number reads as freelancer framing); The
Ledger ships as a linked `Prototype`, not a case study, because the case study arc
needs an outcome and it runs on sample articles.

---

## Phase 1 — Foundation & design system

**Built:** scaffold, token system, type system, root layout, header, footer, theme
toggle, `site.config.ts`, and the two docs.

**Stack deviation from the spec:** Next.js **16.3.4**, not 15. Next 16 was the current
major by the time the build started. Everything the site needs is supported, and the
site's own build quality is part of what it's evidence for.

**Design plan.** Concept is *datasheet* — the document ECE students live inside. It
fits because the content already has that shape: every project has a role, a stack, a
status and a link, which is a characteristics table whether or not it's drawn as one.
Six tokens, one superfamily plus a mono, an asymmetric grid with a mono metadata rail.

**The self-critique, kept honest.** Two parts of the plan would have been produced for
any generic developer portfolio: the waveform hero (the obvious ECE move — the build
prompt flagged it in advance) and amber-on-graphite (a well-trodden "engineer-y"
palette). What survives the test is the datasheet grammar, because it's derived from
the shape of the content rather than applied on top of it, and the width-axis type
system, which is a typographic decision with a real performance payoff. The waveform
stayed because the *step response* version is specific enough to read as knowledge —
and because it terminates instead of looping.

**What was new here.**

`@theme inline` is the whole dark-mode mechanism. Without `inline`, Tailwind resolves
a token to a literal hex when generating the utility, freezing it to one theme. With
it, the utility keeps the `var()` reference and every color on the page re-resolves
when the `.dark` class flips. No second set of utilities, no `dark:` prefix on
ordinary color usage.

Tailwind v4's built-in `dark:` variant keys off `prefers-color-scheme`, which a toggle
can't override — so it had to be redefined against a class, wrapped in `:where()` to
keep specificity at zero.

The width axis needed `axes: ["wdth"]` in the `next/font` call; without it the
variable font ships weight-only and `font-stretch` silently does nothing. Confirmed it
worked by finding `font-stretch: 62% 125%` on the generated `@font-face` — worth
verifying rather than assuming, because the failure mode is invisible.

**Verified, not assumed:** every contrast ratio was computed against WCAG 2.1 before
any of it was written into CSS. `line` came back at 1.24:1 and stayed that way — SC
1.4.11 only requires 3:1 for boundaries that convey information, and a decorative card
edge doesn't. Anything meaningful uses `signal` or `muted`.

**State at end of phase:** `build`, `typecheck` and `lint` all clean. Homepage is a
stub rendering real positioning copy against the real token system — the signature
element, featured work and CTA band land in Phase 2.

---

## Phase 2 — Homepage

**Built:** hero with the step-response trace, `Fig. 01` selected work (3 cards),
`Fig. 02` the Lab list, `Fig. 03` about teaser, and the contact band. Plus the
reusable pieces the rest of the site will run on: `Figure`, `ProjectCard`,
`StatusBadge`, `ExternalLink`, `CopyEmail`.

**The signature element.** A second-order system's step response, drawn on canvas.
`stepResponse(t)` is the closed-form solution — `1 - (e^(-ζωₙt)/√(1-ζ²))·sin(ω_d t + φ)`
— evaluated once per horizontal pixel. ζ = 0.28 and ωₙ = 14 were picked by
simulating the curve in Node first and checking the peak stayed inside the canvas:
it overshoots 40% (22px of headroom at the top) and settles to 0.98 by the right
edge. Tuning it by eye in the browser would have taken longer and been less precise.

It plays once over 1.5s and stops. Nothing loops, so there's no ongoing cost after
the first sweep.

**Fallbacks are structural, not bolted on** — which was the explicit Phase 2 ask:
- The axis line is drawn in **CSS** (`trace-axis`), not canvas, so it survives with
  JavaScript disabled. The canvas only paints the trace on top of it.
- `prefers-reduced-motion` draws the settled curve instantly, no rAF loop.
- The canvas is `aria-hidden`; the hero reads identically without it.

**Theme-following without knowing about themes.** The trace reads its colour from
`getComputedStyle(canvas).color` and the grid from `borderTopColor`, both set by
Tailwind classes. So the component contains no colour values and no theme logic —
a `MutationObserver` on `<html>`'s class list just triggers a repaint. Same trick
would work for any future canvas.

**JS budget, measured honestly.** Homepage first load is **136K gzipped** for a
modern browser (the 39K polyfills chunk carries `noModule`, so it isn't downloaded).
Of that, all three client components — theme toggle, step response, copy button —
share a single **7.1K gzipped** chunk. The rest is the Next 16 + React 19 App Router
floor. The build prompt's "near-zero client JS" isn't reachable while using the App
Router at all; what *is* controllable is how little of it is ours, and 7.1K for
every interactive thing on the site is the number to hold. Revisit at the Phase 5
Lighthouse pass.

**Small correctness thing worth recording:** killing a backgrounded `npm start`
kills the npm wrapper, not the `next-server` child. A stale server kept serving the
previous build and made the first round of measurements silently wrong — the content
greps all returned zero against a page that looked fine. Verify the server you're
measuring is the one you just built.

**Deferred to later phases by design:** `/projects`, `/about` and `/writing` are
linked from the homepage but don't exist yet (Phases 3 and 4). The Phase 6 QA pass
is where "every link resolves" gets enforced.
