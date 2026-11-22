import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight } from "lucide-react";
import { CASE_STUDIES } from "@/constants/case-studies";
import { Section, SectionHeading } from "@/components/ui/section";
import { Mimic } from "@/components/work/mimic";
import { cn } from "@/lib/utils";

/**
 * Four systems, each drawn as its own mimic panel. Reading the lamps tells
 * you where each one is guarded before you read a word about it.
 */
export function SelectedWork() {
  return (
    <Section id="work">
      <div className="container-page">
        <SectionHeading
          title="Four systems, and where each one is guarded"
          description="Red-then-green lamps are the checks that can stop the flow. Amber track is the step with consequences outside the system. Open any of them for the full case study."
        />

        <ul className="mt-14 flex flex-col">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug} className="border-line border-t last:border-b">
              <article className="grid gap-8 py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
                <div className="min-w-0">
                  <p className="text-ink-subtle flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span>{study.period}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className={cn(
                          "size-2 rounded-full",
                          study.status ? "bg-lamp-amber" : "bg-lamp-green",
                        )}
                      />
                      {study.status ?? "Shipped"}
                    </span>
                  </p>
                  <ViewTransition name={`case-title-${study.slug}`} share="case-morph">
                    <h3 className="mt-3 w-fit text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold uppercase">
                      {study.title}
                    </h3>
                  </ViewTransition>
                  <p className="prose-lead text-ink-muted mt-4 max-w-[48ch]">{study.thesis}</p>
                  <Link
                    href={`/work/${study.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="group text-ink hover:text-accent mt-6 inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  >
                    Read the case study
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="bg-surface-2 border-line hidden min-w-0 self-center rounded-[14px] border p-5 md:block">
                  <Mimic nodes={study.flow} />
                </div>
              </article>
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
