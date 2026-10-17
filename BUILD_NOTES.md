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
stronger signal for this audience); the $1,100 Above All Tents engagement stays off the site
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

---

## Phase 3 — Work system & case studies

**Built:** the MDX + zod pipeline, `/projects`, `/projects/[slug]`, and two full case
studies.

**The pipeline.** `gray-matter` splits frontmatter from body; a zod schema validates
the frontmatter; the loader throws with the file name, the field name and the legal
values if anything is wrong. All of it runs in a server component at build time.

I broke a field deliberately to check the claim rather than assert it — set The
Ledger's `status` to `mostly-done` and ran a build:

```
Error: Invalid frontmatter in content/projects/the-ledger.mdx:
  status: Invalid option: expected one of "shipped"|"prototype"|"building"|"design"
```

Exit code 1. Bad content can't reach production, and the error tells you exactly
where to look. That's the entire argument for validating content the same way you'd
validate an API response.

**The second axis, in practice.** Phase 0's `status` / `draft` split turned into a
third field once the content was real: `caseStudy`. Status says whether there's
something to show, draft says whether I'm allowed to show it, and `caseStudy` says
whether there's a *story that ends somewhere*. Above All Tents and The Ledger both
have live links and neither has an outcome to write an ending on, so they're cards
that link straight to the live site and generate no route.

That distinction earns its keep in `ProjectCard`: when `caseStudy` is false the title
links to `liveUrl` instead of `/projects/<slug>`. A card structurally cannot point at
a page that doesn't exist — verified by crawling every internal link on every page.

**Drafts render in dev, not in production.** `process.env.NODE_ENV !== "production"`
in the visibility filter, so unfinished writing is previewable without publishing it.

**Where the content stops.** Both shipped case studies are written from facts. Above
All Tents didn't get one because I don't know the build story and won't reconstruct
one — that's in `CONTENT_TODO.md` as a specific list of questions rather than a
paragraph of plausible-sounding filler.

---

## Phase 4 — Supporting pages

`/writing` with one real post on discriminated unions — drawn from the Savoretti
build, so the writing and the case study reinforce each other rather than sitting in
separate silos.

`/about` groups skills by what they let me deliver rather than by proficiency. No
bars. The résumé link is still gated on `resume.available`.

The 404 is the signature element's one echo: the same axis with no trace on it. It's
the hero's CSS fallback line, used deliberately rather than as a degradation — zero
JavaScript on the page.

---

## Phase 5 — Polish, SEO, performance

**OG images.** `ImageResponse` renders JSX to PNG through Satori, which understands a
subset of flexbox and nothing else — no stylesheet, so the theme tokens are restated
as literals in `src/lib/og.tsx`, and fonts have to arrive as raw bytes. I committed
three WOFF files to `src/assets/fonts/` rather than fetching from Google at build
time; a build that needs the network to succeed is a build that fails on a plane.

The nice part: the trace on every card is drawn by `stepResponseSvg()`, the same
function the hero canvas uses. Extracting that math into `src/lib/step-response.ts`
means the social preview carries the same curve rather than a lookalike.

Satori has no `line-clamp`, so summaries are trimmed on a word boundary before they
reach the layout.

**Structured data.** `Person` on the homepage — the site is found by searching a
name, and this is what turns that string into an entity with an affiliation and known
profiles. `CreativeWork` on case studies with `sameAs` pointing at the live site.
`BlogPosting` on posts. The rule everything obeys: JSON-LD must describe what a human
can actually see on the page. Claiming more is spam and gets treated as such.

**A font weight that was costing real bytes.** `next/font` preloads every declared
weight on every route. IBM Plex Mono 400 was only used by inline code in a single
post, so it was putting ~19KB on the critical path of pages that never render it.
Dropped it; inline code sets at 500 and arguably reads better.

The remaining honest cost is Archivo at 88KB — larger than one static weight because
it carries the full `wght` and `wdth` ranges. It's still smaller than the three or
four static faces it replaces and it's cached across every route, but it is the
single heaviest asset on the site and it's the price of the width-axis idea.

**Measured, gzipped:** HTML 6.3–9.2KB per route; first-load JS ~138KB for a modern
browser, of which 7.1KB is ours; fonts 98KB across two files.

**Verification sweep:** all 15 routes return the expected status (including the two
card-only projects correctly 404ing), every internal link on every page resolves,
exactly one `h1` per page with no skipped heading levels, landmarks and skip link on
every route, no image without alt text, JSON-LD parses to the expected `@type` on all
three page kinds.

**What I could not do here: run Lighthouse.** Chrome's shared libraries aren't
installed in this WSL environment and installing them needs sudo. Downloading Chrome
for Testing got as far as `libnspr4.so: cannot open shared object file`. So the
performance budget is verified by proxy — static rendering everywhere, no
render-blocking JavaScript, fonts preloaded and self-hosted, no third-party requests
— but not by an actual Lighthouse run. That's the one Section 8 requirement still
outstanding, and it needs a real browser.
