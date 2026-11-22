import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES, getCaseStudy } from "@/constants/case-studies";
import { SITE } from "@/constants/site";
import { Mimic } from "@/components/work/mimic";
import { ParserSandbox } from "@/components/work/parser-sandbox";

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
              <h1 className="mt-3 w-fit text-[clamp(3.25rem,9vw,7rem)] leading-[0.86] font-extrabold uppercase">
                {study.title}
              </h1>
            </ViewTransition>
            <p className="prose-lead text-ink-muted mt-6 max-w-[56ch] text-xl sm:text-[1.375rem]">
              {study.thesis}
            </p>
          </header>

          <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
            <div className="flex min-w-0 flex-col gap-16">
              <Block title="The problem">
                <p className="prose-lead max-w-[64ch]">{study.problem}</p>
              </Block>

              <Block title="Constraints">
                <ul className="prose-lead flex max-w-[64ch] list-disc flex-col gap-2 pl-5">
                  {study.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Block>

              <Block title="How it flows">
                <div className="border-brass/50 bg-surface-2 rounded-[14px] border p-5 sm:p-7">
                  <Mimic nodes={study.flow} caption={study.flowCaption} />
                </div>
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
                {/* An interlocking table: each guard, and why it holds. */}
                <div className="enamel overflow-hidden rounded-md">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-line-strong border-b-2">
                        <th className="px-5 py-3 text-sm font-bold">Guard</th>
                        <th className="hidden px-5 py-3 text-sm font-bold md:table-cell">
                          Why it holds
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {study.decisions.map((d) => (
                        <tr
                          key={d.title}
                          className="border-line border-b align-top last:border-b-0"
                        >
                          <td className="px-5 py-5 md:w-[38%]">
                            <span className="flex gap-3">
                              <span
                                aria-hidden
                                className="bg-lamp-green mt-1.5 size-2.5 shrink-0 rounded-full"
                              />
                              <span className="font-bold">{d.title}</span>
                            </span>
                            <p className="text-ink-muted mt-2 text-[15px] leading-relaxed md:hidden">
                              {d.body}
                            </p>
                          </td>
                          <td className="text-ink-muted hidden px-5 py-5 text-[15px] leading-relaxed md:table-cell">
                            {d.body}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Block>

              <Block title="Where it landed">
                <ul className="prose-lead flex max-w-[64ch] list-disc flex-col gap-2 pl-5">
                  {study.outcome.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </Block>
            </div>

            <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
              <div>
                <h2 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal normal-case">
                  Particulars
                </h2>
                <dl className="mt-3 flex flex-col gap-2">
                  {study.facts.map((f) => (
                    <div key={f.label} className="flex items-baseline gap-2 text-sm">
                      <dt className="sr-only">{f.label}</dt>
                      <dd className="text-ink font-mono font-semibold tabular-nums">{f.value}</dd>
                      <span className="text-ink-muted" aria-hidden>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h2 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal normal-case">
                  Stack
                </h2>
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
                <h2 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal normal-case">
                  Links
                </h2>
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
              <span className="font-display group-hover:text-accent inline-flex items-center gap-3 text-5xl font-extrabold uppercase transition-colors">
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
      <h2 className="mb-6 text-4xl font-extrabold uppercase sm:text-5xl">{title}</h2>
      {children}
    </section>
  );
}
