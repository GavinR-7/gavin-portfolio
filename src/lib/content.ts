import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

/**
 * The content pipeline.
 *
 * Content is MDX files on disk. Frontmatter is parsed by gray-matter and then
 * validated by zod — at BUILD TIME, in a server component. A typo in a
 * frontmatter field fails `next build` with the file name and the field name,
 * so bad content can never reach production. That's the whole point: the
 * alternative is a page that renders `undefined` to a recruiter.
 *
 * Nothing here runs in the browser.
 */

const CONTENT_DIR = join(process.cwd(), "content");

/** Shared across projects and posts. */
const baseFields = {
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, digits and hyphens"),
  summary: z.string().min(1),
  publishedAt: z.coerce.date(),
  /** When the content last changed materially (a status or outcome rewrite). Feeds the sitemap. */
  updatedAt: z.coerce.date().optional(),
  /** Permission / readiness gate. Drafts never render in a production build. */
  draft: z.boolean(),
};

export const projectSchema = z.object({
  ...baseFields,
  lane: z.enum(["client", "lab"]),
  /** Is there something to show? Drives the badge and whether a page exists. */
  status: z.enum(["shipped", "prototype", "building", "design"]),
  role: z.string().min(1),
  stack: z.array(z.string()).min(1),
  /** Where it runs. Absent for work with nothing public to open (coursework, private tools). */
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  client: z.string().optional(),
  timeline: z.string().optional(),
  /** One line of plain-English outcome for the card. */
  outcomeLine: z.string().optional(),
  /**
   * Does this project earn a full case study page?
   *
   * False means card + live link only. The case study arc needs an outcome to
   * end on; a project without one is better as an honest card than a thin page.
   */
  caseStudy: z.boolean(),
  featured: z.boolean(),
  order: z.number().int(),
});

export const postSchema = z.object({
  ...baseFields,
  /** Rough read time in minutes, stated rather than estimated by a word count. */
  readingTime: z.number().int().positive(),
});

export type Project = z.infer<typeof projectSchema>;
export type Post = z.infer<typeof postSchema>;

export type Entry<T> = {
  readonly meta: T;
  readonly body: string;
};

/**
 * Reads one directory of MDX, validates every file's frontmatter, and throws
 * with a readable message on the first bad one.
 */
function loadAll<T>(dir: string, schema: z.ZodType<T>): Entry<T>[] {
  const path = join(CONTENT_DIR, dir);
  const files = readdirSync(path).filter((file) => file.endsWith(".mdx"));

  return files.map((file) => {
    const { data, content } = matter(readFileSync(join(path, file), "utf8"));
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      // Fail the build loudly, naming the file and the exact field. A build
      // that dies here is the pipeline working, not the pipeline breaking.
      const problems = parsed.error.issues
        .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid frontmatter in content/${dir}/${file}:\n${problems}`);
    }

    return { meta: parsed.data, body: content };
  });
}

/**
 * Drafts are excluded from production builds only. In `next dev` they render,
 * so unfinished writing is previewable without publishing it.
 */
function isVisible(draft: boolean): boolean {
  return process.env.NODE_ENV !== "production" || !draft;
}

export function getProjects(): Entry<Project>[] {
  return loadAll("projects", projectSchema)
    .filter((entry) => isVisible(entry.meta.draft))
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getProject(slug: string): Entry<Project> | undefined {
  return getProjects().find((entry) => entry.meta.slug === slug);
}

/** Only projects with `caseStudy: true` get a route generated for them. */
export function getCaseStudies(): Entry<Project>[] {
  return getProjects().filter((entry) => entry.meta.caseStudy);
}

export function getPosts(): Entry<Post>[] {
  return loadAll("writing", postSchema)
    .filter((entry) => isVisible(entry.meta.draft))
    .sort((a, b) => b.meta.publishedAt.getTime() - a.meta.publishedAt.getTime());
}

export function getPost(slug: string): Entry<Post> | undefined {
  return getPosts().find((entry) => entry.meta.slug === slug);
}
