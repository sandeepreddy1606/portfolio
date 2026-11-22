import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { getAllPosts } from "@/lib/blog";
import { CASE_STUDIES } from "@/constants/case-studies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE.url}/work/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE.url}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
