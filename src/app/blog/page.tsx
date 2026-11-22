import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { SITE } from "@/constants/site";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/section";
import { GridBackground } from "@/components/ui/backgrounds";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description: `Notes on engineering from ${SITE.name} — architecture decisions, agent design and the trade-offs behind shipped systems.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Writing · ${SITE.shortName}`,
    description: "Notes on architecture decisions, agent design and shipped systems.",
    url: `${SITE.url}/blog`,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="relative">
      <GridBackground className="h-[60vh]" />

      <div className="container-page relative z-10 pt-36 pb-24 sm:pt-44 sm:pb-32">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="bg-accent size-1.5 rounded-full" aria-hidden />
            <span className="text-ink-muted font-mono text-[11px] tracking-[0.22em] uppercase">
              Writing
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            Notes on the decisions behind the code.
          </h1>
          <p className="text-ink-muted mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            Occasional write-ups on architecture, agent design and the trade-offs I actually hit
            while building the projects on this site.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="text-ink-muted border-line mt-16 rounded-3xl border border-dashed px-6 py-20 text-center text-sm">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="mt-16 flex flex-col">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06}>
                <li>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="border-line hover:bg-surface/40 group -mx-4 flex flex-col gap-3 rounded-3xl border-b px-4 py-8 transition-colors duration-300 sm:px-6"
                  >
                    <div className="text-ink-subtle flex flex-wrap items-center gap-3 font-mono text-xs">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h2 className="flex items-start gap-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                      <span className="group-hover:text-accent transition-colors duration-300">
                        {post.title}
                      </span>
                      <ArrowUpRight className="text-ink-subtle group-hover:text-accent mt-1.5 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h2>

                    <p className="text-ink-muted max-w-2xl text-sm leading-relaxed">
                      {post.description}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
