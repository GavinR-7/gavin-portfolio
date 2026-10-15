import type { Post, Project } from "@/lib/content";
import { siteConfig, siteDescription } from "@/site.config";

/** The homepage's identity claim, in the form a crawler can parse. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.identity.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.contact.email}`,
    description: siteDescription,
    jobTitle: "Engineering student and web developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Long Island",
      addressRegion: "NY",
      addressCountry: "US",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Cornell University",
    },
    knowsAbout: [...siteConfig.positioning.attributes],
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  };
}

/** A case study is a CreativeWork about a thing that exists at `liveUrl` (when it is public). */
export function caseStudySchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.summary,
    url: `${siteConfig.url}/projects/${project.slug}`,
    dateCreated: project.publishedAt.toISOString(),
    creator: { "@type": "Person", name: siteConfig.identity.name, url: siteConfig.url },
    about: project.client ? { "@type": "Organization", name: project.client } : undefined,
    keywords: project.stack.join(", "),
    sameAs: project.liveUrl,
  };
}

export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    url: `${siteConfig.url}/writing/${post.slug}`,
    datePublished: post.publishedAt.toISOString(),
    // Matches the sitemap's lastModified, so crawlers see one revision date.
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    author: { "@type": "Person", name: siteConfig.identity.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.identity.name },
    mainEntityOfPage: `${siteConfig.url}/writing/${post.slug}`,
  };
}
