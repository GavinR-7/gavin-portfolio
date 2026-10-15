import type { MetadataRoute } from "next";

import { getCaseStudies, getPosts } from "@/lib/content";
import { siteConfig } from "@/site.config";

/**
 * Generated from the same content the pages are generated from, so it can never
 * list a route that doesn't exist or miss one that does. Drafts are already
 * filtered out by the loaders.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/writing", "/about"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    priority: path === "" ? 1 : 0.8,
  }));

  const caseStudies = getCaseStudies().map((entry) => ({
    url: `${siteConfig.url}/projects/${entry.meta.slug}`,
    lastModified: entry.meta.updatedAt ?? entry.meta.publishedAt,
    priority: 0.7,
  }));

  const posts = getPosts().map((entry) => ({
    url: `${siteConfig.url}/writing/${entry.meta.slug}`,
    lastModified: entry.meta.updatedAt ?? entry.meta.publishedAt,
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudies, ...posts];
}
