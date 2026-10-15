# gavinreis.com

Personal engineering portfolio for Gavin Reis — Cornell ECE.

Static Next.js site. Content is MDX files in this repo, validated by zod at build
time. No database, no CMS, no auth.

**Live:** https://gavinreis.com

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build — fails on invalid content frontmatter |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, with Tailwind class sorting |

---

## Adding content

Create one MDX file. Nothing else.

**A case study** — `content/projects/<slug>.mdx`:

```yaml
---
title: Project Name
slug: project-name
lane: client            # client | lab
status: shipped         # shipped | prototype | building | design
role: Design & build
stack: ["Next.js", "TypeScript (strict)"]
liveUrl: https://example.com/
summary: One honest sentence for the card.
publishedAt: 2026-09-03
caseStudy: true         # false = card and live link only, no page
featured: true          # appears on the homepage
draft: false            # true = hidden in production builds
order: 1
---
```

**A post** — `content/writing/<slug>.mdx`: `title`, `slug`, `summary`,
`publishedAt`, `readingTime`, `draft`.

The frontmatter is validated by a zod schema in `src/lib/content.ts`. A missing or
malformed field fails `next build` with the file name and the field name, so bad
content can't reach production.

Two flags do the gating, and they're independent:

- **`status`** — is there something to show?
- **`draft`** — am I allowed to show it? Drafts render in `next dev` and are stripped
  from production builds.

`caseStudy: false` means the project gets a card linking straight to its live site
and no page is generated — used when a project has no outcome to write an ending on.

---

## Structure

```
content/            MDX — projects and writing
src/
  app/              Routes, sitemap, robots, OG images, icons
  components/       UI
  lib/
    content.ts      MDX loader + zod schemas
    schema.ts       JSON-LD builders
    og.tsx          Social card renderer
    step-response.ts  The hero curve — shared by the canvas and the OG cards
  assets/fonts/     WOFF files for OG rendering (Satori needs raw bytes)
  site.config.ts    Every fact that appears more than once
```

`ARCHITECTURE.md` explains the theming system, the content pipeline, the signature
element and the performance numbers. `BUILD_NOTES.md` is the build log.

---

## Notable bits

- **Dark mode** is class-based via a redefined Tailwind v4 `dark:` variant plus a
  blocking inline script, so there's no flash on reload. Colour utilities are
  themeable because tokens go through `@theme inline`.
- **The hero trace** is the step response of an underdamped second-order system,
  hand-written canvas, ~30 lines of math. It plays once and stops. The axis line is
  CSS so the figure survives with JavaScript disabled.
- **OG cards** are generated per page from frontmatter by `next/og`, using the same
  curve function as the hero.
- **Null means "doesn't exist yet."** `site.config.ts` gates the résumé link and the
  view-source link on the thing they point at existing, so a dead link is
  structurally impossible rather than a QA item.

---

Built with Next.js 16, TypeScript, Tailwind v4. Deployed on Vercel.
