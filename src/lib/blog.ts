import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { BlogPost, BlogPostMeta } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog");

function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

async function parse(filename: string): Promise<BlogPost> {
  const raw = await fs.readFile(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug: filename.replace(/\.md$/, ""),
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString()),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTime(content),
    html: await marked.parse(content, { gfm: true, breaks: false }),
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  let files: string[];
  try {
    files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  const posts = await Promise.all(files.map(parse));
  return posts
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map((post): BlogPostMeta => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      readingTime: post.readingTime,
      tags: post.tags,
    }));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  // Guard against traversal — slug comes from the URL.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    return await parse(`${slug}.md`);
  } catch {
    return null;
  }
}
