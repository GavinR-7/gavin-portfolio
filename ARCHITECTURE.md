# Architecture

How this site is put together, and why each decision went the way it did.

---

## Stack

| Choice | Why |
|---|---|
| Next.js 16 (App Router) | Current major. Static export of every route; `ImageResponse` for OG cards |
| TypeScript, strict + extras | See [tsconfig](#typescript-configuration) |
| Tailwind v4, CSS-first theming | Tokens live in CSS, not a JS config object — see [Theming](#theming) |
| MDX + zod frontmatter | Content is files in the repo. Versioned, no CMS, no database, no attack surface |
| Vercel | Static hosting + CI from GitHub |

No database, no auth, no CMS. That isn't a limitation to apologize for — it's why
the site is fast, free to host, and impossible to deface.

---

## Directory layout

```
content/          MDX case studies and posts (Phase 3)
public/           Static assets — resume.pdf, screenshots, favicons
src/
  app/            App Router routes
    globals.css   Tokens, base styles, custom utilities
    layout.tsx    Fonts, theme script, header/footer shell, root metadata
  components/     Shared UI
  lib/            Content loader, zod schemas (Phase 3)
  site.config.ts  Single source of truth for facts that appear more than once
```

---

## `site.config.ts` — one place for every fact

Business facts never live in components. The positioning line is written **once**;
the hero, the meta description and the OG card all read from it, which is what stops
them drifting apart over time.

`null` is meaningful in that file: it means "this doesn't exist yet, so don't render
a link to it." `links.repo` is null until the GitHub repo exists; `resume.available`
is false until the PDF is in `/public`. Both are gates that make a dead link
structurally impossible rather than a thing to remember at QA time.

---

## Theming

### The token layer

Six tokens carry every color on the site. They're defined as plain CSS custom
properties on `:root` (light) and `.dark` (dark), then exposed to Tailwind through
`@theme inline`:

```css
:root  { --ink: #121417; ... }
.dark  { --ink: #e9ebed; ... }

@theme inline {
  --color-ink: var(--ink);
}
```

**`inline` is the load-bearing keyword.** Without it, Tailwind resolves the token to
a literal hex when it generates `text-ink`, and the utility is frozen to one theme.
With it, the generated CSS keeps the `var(--ink)` reference, so toggling the `.dark`
class re-resolves every utility on the page at once. That is the entire dark-mode
mechanism — there is no second set of utilities and no `dark:` prefix on ordinary
color usage.

### The variant

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Tailwind v4's built-in `dark:` variant keys off `prefers-color-scheme`, which a user
toggle cannot override. Redefining it against a class on `<html>` puts the site in
control. `:where()` holds the selector at specificity 0, so the variant never wins a
cascade fight it shouldn't.

### The flash-prevention script

A small inline script in `<head>` sets the class before first paint. It has to be
inline and blocking — an external or deferred script runs after the browser has
already painted, which is the white flash on a dark-mode reload. Precedence is:
stored choice wins, otherwise fall back to the OS preference.

`<html>` carries `suppressHydrationWarning` because that script deliberately makes
the client's class list differ from the server's.

### Palette

Light and dark were designed in parallel, not derived by inverting one another.

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#f6f7f8` | `#101214` | Page ground. Cool off-white; elevated graphite, never `#000` |
| `surface` | `#ffffff` | `#191c1f` | Cards and spec blocks — depth from elevation, not shadow |
| `ink` | `#121417` | `#e9ebed` | Primary text — 17.2:1 / 15.7:1 |
| `muted` | `#565d65` | `#98a0a8` | Secondary text, and borders that must be perceived — 6.2:1 / 7.1:1 |
| `line` | `#dce0e4` | `#2a2f34` | Decorative borders only |
| `signal` | `#9a5b00` | `#f0a93c` | The one accent — 5.1:1 / 9.3:1 |

**`line` sits below 3:1 on purpose.** WCAG 2.1 SC 1.4.11 requires 3:1 only for
boundaries that *convey information*. A decorative card edge isn't one. Anything
that carries meaning — focus rings, interactive borders — uses `signal` or `muted`,
both of which clear the threshold comfortably. Quiet edges, clean audit.

**`signal` is a state color, not a decoration.** It marks live links, focus, status,
and the hero trace. It is never a gradient and never a filled shouting button. The
light value is dark and desaturated so it can carry text; the dark value is the
bright LED version of the same hue.

---

## Type

**Archivo (variable) + IBM Plex Mono.** Two font files, ~98KB, for the entire site.

The display face and the body face are the *same family at different widths*.
Archivo ships a `wdth` variable axis; `next/font` pulls it in via `axes: ["wdth"]`,
and the `display-face` utility drives it with `font-stretch: 112%`. Headings set wide
and read like equipment signage; body copy sets normal and reads as neutral prose.
The typographic character comes from a variable axis rather than a second font
download — verified in the build output as `font-stretch: 62% 125%` on the
`@font-face`.

IBM Plex Mono carries the instrument-label voice: eyebrows, badges, spec rows and
figure captions, via the `label-face` utility.

Plex Mono ships **one weight**. `next/font` preloads every declared weight on every
route, so carrying a 400 that only inline code in a single post uses would have put
~19KB on the critical path of pages that never render it.

Both are self-hosted by `next/font` with `display: swap` and latin subsetting. No
network request to a font CDN, so no third-party connection on the critical path.

The honest tradeoff: the Archivo variable file is 88KB — larger than a single static
weight, because it carries the full `wght` (100–900) and `wdth` (62–125) ranges. It's
still smaller than the three or four static faces it replaces, it's cached across
every route, and it's the asset the whole type system depends on.

---

## Accessibility

Not a Phase 5 audit item — a constraint the components are built under.

- Focus is drawn globally in `signal` with an offset, so nothing can ship without a
  visible focus state.
- `prefers-reduced-motion` is honored in a global base rule rather than per
  component, so no animation can accidentally ignore it.
- A skip link is the first focusable element on every page.
- The header wraps instead of collapsing into a drawer. No hamburger means no client
  component, no focus trap, and no escape handler to get wrong — and it works at
  360px.

---

## TypeScript configuration

Beyond `strict`:

| Flag | Why it's on |
|---|---|
| `noUncheckedIndexedAccess` | Array access returns `T \| undefined`. Matters most in the content loader, where a missing frontmatter field must be a type error, not a runtime crash |
| `noUnusedLocals` / `noUnusedParameters` | Dead code fails the build instead of accumulating |
| `noImplicitOverride` | Explicit intent on overrides |
| `noFallthroughCasesInSwitch` | Cheap insurance around the discriminated unions the content model uses |

---

## Decision log

| Decision | Alternative considered | Why this way |
|---|---|---|
| Class-based dark mode | `prefers-color-scheme` only | A media query can't be overridden by a user toggle |
| `@theme inline` | Plain `@theme` | Plain `@theme` bakes hex values and freezes utilities to one theme |
| One superfamily + mono | Separate display face | Width axis gives the contrast for zero extra bytes |
| Wrapping header | Mobile drawer | Zero JS for the same outcome at 360px |
| Conditional links off config | Ship links, fix later | Makes a dead link structurally impossible |
| `/services` cut | Keep it | Primary audience is recruiters and faculty; a sales page reads as freelancer positioning to them. It's the seed of a separate site |
| `/work` → `/projects` | Keep `/work` | "Work" reads freelance; "Projects" is the right word for a personal engineering site |

---

## The signature element

`src/components/step-response.tsx` — the hero trace.

It draws the step response of an underdamped second-order system: the canonical way
to characterise a system in ECE, and the exact shape of the positioning — sharp
input arrives, the system overshoots and rings, then holds steady.

```
y(t) = 1 - (e^(-ζωₙt) / √(1-ζ²)) · sin(ω_d·t + arccos ζ),   ω_d = ωₙ√(1-ζ²)
```

ζ = 0.28, ωₙ = 14. Those constants were chosen by simulating the curve in Node and
checking the 40% overshoot stayed inside the canvas before any of it was drawn.

Three properties it was built to have:

**It terminates.** One 1.5s sweep on load, then the rAF loop exits. An animation
that loops forever on a portfolio is a battery cost with no information in it.

**It knows nothing about theming.** Colours come from `getComputedStyle` —
`color` for the trace, `borderTopColor` for the grid — both set by Tailwind
classes on the canvas. A `MutationObserver` on `<html>`'s class list triggers a
repaint when the theme flips. No colour literals in the component.

**Its fallbacks are structural.** The axis line is a CSS gradient
(the `trace-axis` utility), so it renders with JavaScript disabled; the canvas only
paints the trace over it. `prefers-reduced-motion` draws the settled curve
immediately. The canvas is `aria-hidden` and the hero is complete without it.

## Client JS budget

| | gzipped |
|---|---|
| Homepage first load (modern browser) | ~136K |
| — of which our own client components | 7.1K |
| Polyfills chunk (`noModule`, not downloaded by modern browsers) | 39K |

Three client components exist site-wide: the theme toggle, the step response, and
the copy-email button. Everything else is a server component and ships no JS.


---

## Social cards

`src/lib/og.tsx` renders every OG image at build time through `next/og`.

`ImageResponse` takes JSX and rasterises it with **Satori**, a small layout engine
that understands a subset of flexbox and nothing else. That constrains the code in
two ways worth knowing before reading the file: there is no stylesheet, so every
style is an inline object and the theme tokens are restated as literals; and fonts
must be handed over as raw bytes, which is why `src/assets/fonts/` holds three WOFF
files committed to the repo. Fetching them at build time would have made the build
depend on a network round trip to Google.

Each route gets its card from a co-located `opengraph-image.tsx`:

| File | Card |
|---|---|
| `app/opengraph-image.tsx` | Homepage — name and positioning from `site.config.ts` |
| `app/projects/[slug]/opengraph-image.tsx` | Per case study, from its frontmatter |
| `app/writing/[slug]/opengraph-image.tsx` | Per post, from its frontmatter |

Nothing is designed by hand, so a card cannot drift from the page it represents —
change a summary in frontmatter and the card changes with it. The trace on the card
is drawn by `stepResponseSvg()`, the same function the hero canvas uses, so the
social preview carries literally the same curve rather than a redrawing of it.

Satori has no `line-clamp`, so summaries are trimmed on a word boundary by
`truncate()` before they reach the layout.

---

## Structured data

JSON-LD, one block per page type, built in `src/lib/schema.ts` from the same typed
content the page renders.

| Page | Type | Why |
|---|---|---|
| `/` | `Person` | The site is found by searching a name. This is what turns that string into an entity with an affiliation, a location and known profiles |
| `/projects/[slug]` | `CreativeWork` | A case study is a work *about* a thing that exists at `liveUrl` — `sameAs` points there |
| `/writing/[slug]` | `BlogPosting` | Author, publish date, canonical URL |

The rule the whole thing lives under: **structured data must describe what a human
can actually see on the page.** Claiming more than the page shows is spam, and search
engines treat it as such. Every field here has a visible counterpart.

---

## Performance

Measured on the production build, gzipped:

| | |
|---|---|
| HTML per route | 6.3–9.2 KB |
| First-load JS (modern browser) | ~138 KB |
| — our own client components | 7.1 KB |
| Fonts | 98 KB (2 files, cached across all routes) |
| Polyfills chunk | 39 KB, `noModule` — never downloaded by a modern browser |

Three client components exist site-wide: the theme toggle, the step-response trace,
and the copy-email button. Every other component is a server component and ships no
JavaScript. MDX is compiled and rendered on the server, so a case study page ships
the same JS as an empty one.

The ~138 KB is the Next 16 App Router and React 19 floor, not something this site
adds to. What's controllable is how little of it is ours.
