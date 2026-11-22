import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES, getCaseStudy } from "@/constants/case-studies";
import { SITE } from "@/constants/site";
import { FlowDiagram } from "@/components/work/flow-diagram";
import { ParserSandbox } from "@/components/work/parser-sandbox";
import { GridBackground } from "@/components/ui/backgrounds";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };

  return {
    title: `${study.title} — case study`,
    description: study.thesis,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      type: "article",
      title: `${study.title} — case study`,
      description: study.thesis,
      url: `${SITE.url}/work/${study.slug}`,
      authors: [SITE.name],
    },
    twitter: { card: "summary_large_image", title: study.title, description: study.thesis },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = CASE_STUDIES.indexOf(study);
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    abstract: study.thesis,
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    keywords: study.stack.join(", "),
    url: `${SITE.url}/work/${study.slug}`,
  };

  return (
    <ViewTransition
      enter={{ "nav-forward": "page-enter", default: "none" }}
      exit={{ "nav-forward": "page-exit", default: "none" }}
      default="none"
    >
      <article className="relative pt-28 pb-24 sm:pt-36">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        <GridBackground className="h-[70vh]" />

        <div className="container-page relative">
          <Link
            href="/#work"
            className="text-ink-muted hover:text-ink inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" /> All work
          </Link>

          <header className="mt-10 max-w-4xl">
            <p className="text-ink-subtle flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>{study.role}</span>
              <span>{study.period}</span>
              {study.status && <span className="text-verify">{study.status}</span>}
            </p>
            <ViewTransition name={`case-title-${study.slug}`} share="case-morph">
              <h1
                className="mt-3 w-fit text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-semibold tracking-[-0.03em]"
                style={{ fontVariationSettings: '"wdth" 78, "opsz" 96' }}
              >
                {study.title}
              </h1>
            </ViewTransition>
            <p className="prose-serif mt-6 max-w-[56ch] text-[1.375rem] sm:text-2xl">
              {study.thesis}
            </p>
          </header>

          <dl className="border-line mt-12 grid gap-6 border-y py-6 sm:grid-cols-3">
            {study.facts.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-4xl font-semibold">{f.value}</dd>
                <dt className="text-ink-muted mt-1 text-sm">{f.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
            <div className="flex min-w-0 flex-col gap-16">
              <Block title="The problem">
                <p className="prose-serif max-w-[64ch]">{study.problem}</p>
              </Block>

              <Block title="Constraints">
                <ul className="prose-serif flex max-w-[64ch] list-disc flex-col gap-2 pl-5">
                  {study.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Block>

              <Block title="How it flows">
                <FlowDiagram nodes={study.flow} caption={study.flowCaption} />
              </Block>

              {study.sandbox && (
                <Block title="Try the parser">
                  <p className="text-ink-muted mb-5 max-w-[64ch] text-sm">
                    A simplified replay of the approach, running in your browser. Edit the message
                    and watch which characters each rule claims.
                  </p>
                  <ParserSandbox />
                </Block>
              )}

              <Block title="Decisions I'd defend">
                <ul className="flex flex-col gap-8">
                  {study.decisions.map((d) => (
                    <li key={d.title} className="border-verify max-w-[64ch] border-l-2 pl-5">
                      <h3 className="text-xl font-semibold">{d.title}</h3>
                      <p className="prose-serif mt-2 text-[1.0625rem]">{d.body}</p>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Where it landed">
                <ul className="prose-serif flex max-w-[64ch] list-disc flex-col gap-2 pl-5">
                  {study.outcome.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </Block>
            </div>

            <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
              <div>
                <h2 className="text-ink-subtle text-sm font-normal">Stack</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {study.stack.map((s) => (
                    <li
                      key={s}
                      className="border-line text-ink-muted rounded border px-2 py-0.5 font-mono text-xs"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-ink-subtle text-sm font-normal">Links</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {study.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors"
                      >
                        {l.label} <ArrowUpRight className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <nav
            aria-label="Next case study"
            className="border-line mt-24 flex flex-col gap-6 border-t pt-10 sm:flex-row sm:items-end sm:justify-between"
          >
            <Link
              href={`/work/${next.slug}`}
              transitionTypes={["nav-forward"]}
              className="group flex flex-col gap-2"
            >
              <span className="text-ink-subtle text-sm">Next case study</span>
              <span className="group-hover:text-accent inline-flex items-center gap-3 text-3xl font-semibold transition-colors">
                {next.title}
                <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/#contact" className="text-ink-muted hover:text-ink text-sm">
              Talk to me about this work
            </Link>
          </nav>
        </div>
      </article>
    </ViewTransition>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-semibold sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
