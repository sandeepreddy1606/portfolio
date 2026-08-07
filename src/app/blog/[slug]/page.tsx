import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/blog";
import { SITE } from "@/constants/site";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/ui/backgrounds";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [SITE.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <AuroraBackground className="h-[50vh] opacity-50" />

      <article className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44 sm:pb-32">
        <Link
          href="/blog"
          className="text-ink-muted hover:text-ink group inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All writing
        </Link>

        <header className="mt-8 flex flex-col gap-5">
          <div className="text-ink-subtle flex flex-wrap items-center gap-3 font-mono text-xs">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="text-4xl leading-[1.08] font-semibold sm:text-5xl">{post.title}</h1>
          <p className="text-ink-muted text-lg leading-relaxed">{post.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <div className="via-line my-12 h-px bg-gradient-to-r from-transparent to-transparent" />

        <div
          // Post bodies are authored markdown in this repo — not user input.
          dangerouslySetInnerHTML={{ __html: post.html }}
          className="prose-article"
        />

        <footer className="border-line mt-16 border-t pt-8">
          <p className="text-ink-muted text-sm">
            Written by {SITE.name}.{" "}
            <Link href="/#contact" className="text-accent underline-offset-4 hover:underline">
              Get in touch
            </Link>{" "}
            if any of this is useful to you.
          </p>
        </footer>
      </article>
    </div>
  );
}
