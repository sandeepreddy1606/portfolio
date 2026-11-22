import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight } from "lucide-react";
import { CASE_STUDIES } from "@/constants/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { FlowDiagram } from "@/components/work/flow-diagram";

/**
 * Four projects, each argued as a case study. The compact flow on the right is
 * the same drawing as on the detail page, so the reader sees the shape of the
 * system before deciding to read about it.
 */
export function SelectedWork() {
  return (
    <Section id="work">
      <div className="container-page">
        <SectionHeading
          eyebrow="Work"
          title="Four systems, and the decisions that made them safe to run."
          description="Each one is written up as a case study: the problem, the constraints, the flow of data, and the calls I'd defend in a design review."
        />

        <ul className="mt-16 flex flex-col">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug} className="border-line border-t last:border-b">
              <Link
                href={`/work/${study.slug}`}
                transitionTypes={["nav-forward"]}
                className="group grid gap-8 py-10 md:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14"
              >
                <div className="min-w-0">
                  <div className="text-ink-subtle flex flex-wrap items-baseline gap-x-3 text-sm">
                    <span>{study.period}</span>
                    {study.status && <span className="text-verify">{study.status}</span>}
                  </div>
                  <ViewTransition name={`case-title-${study.slug}`} share="case-morph">
                    <h3 className="group-hover:text-accent mt-2 w-fit text-3xl font-semibold transition-colors sm:text-4xl">
                      {study.title}
                    </h3>
                  </ViewTransition>
                  <p className="prose-serif mt-4 max-w-[52ch] text-lg">{study.thesis}</p>
                  <span className="text-ink mt-6 inline-flex items-center gap-2 text-sm font-medium">
                    Read the case study
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                <div className="flex min-w-0 flex-col justify-center gap-5">
                  <FlowDiagram nodes={study.flow} compact />
                  <dl className="flex flex-wrap gap-x-8 gap-y-3">
                    {study.facts.map((fact) => (
                      <div key={fact.label} className="flex items-baseline gap-2">
                        <dt className="sr-only">{fact.label}</dt>
                        <dd className="font-display text-2xl font-semibold">{fact.value}</dd>
                        <span
                          className="text-ink-subtle max-w-[14ch] text-xs leading-tight"
                          aria-hidden
                        >
                          {fact.label}
                        </span>
                      </div>
                    ))}
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-ink-muted mt-10 text-sm">
          Smaller builds — computer vision, speech, NLP, mobile — are in{" "}
          <Link href="/work" className="text-ink underline underline-offset-4 hover:no-underline">
            the project archive
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
