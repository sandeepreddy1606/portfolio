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
          description="Each system is drawn as a route. Scroll through a panel and its train runs the line; open any of them for the full case study."
        />

        {/* The panel legend, drawn with the same parts the panels use. */}
        <dl className="text-ink-muted mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2.5">
            <dt
              className="border-ink bg-surface-2 flex flex-col gap-0.5 rounded-[4px] border px-1 py-1"
              aria-hidden
            >
              <span className="bg-lamp-red size-1.5 rounded-full" />
              <span className="bg-lamp-green size-1.5 rounded-full" />
            </dt>
            <dd>Guard: a check that can stop the flow</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="bg-lamp-amber h-1.5 w-7 rounded-full" aria-hidden />
            <dd>Action: reaches outside the system</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="bg-lamp-amber relative h-3 w-6 rounded-[3px]" aria-hidden>
              <span className="absolute top-1/2 -right-0.5 size-1 -translate-y-1/2 rounded-full bg-[#fff6d8]" />
            </dt>
            <dd>The train: where the request is now</dd>
          </div>
        </dl>

        <ul className="mt-14 flex flex-col">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug} className="border-line border-t last:border-b">
              <article className="group grid gap-8 py-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
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
                  {/* The particulars a recruiter scans for: counts, then stack. */}
                  <dl className="mt-5 flex flex-col gap-1 text-sm">
                    {study.facts.map((f) => (
                      <div key={f.label} className="flex items-baseline gap-2">
                        <dt className="sr-only">{f.label}</dt>
                        <dd className="text-ink w-10 shrink-0 font-mono font-semibold tabular-nums">
                          {f.value}
                        </dd>
                        <span className="text-ink-muted" aria-hidden>
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </dl>
                  <p className="text-ink-subtle mt-4 font-mono text-xs leading-relaxed">
                    {study.stack.join(" · ")}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="group/link text-ink hover:text-accent mt-6 inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  >
                    Read the case study
                    <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
                <div className="bg-surface-2 border-line group-hover:border-brass/60 min-w-0 self-center rounded-[14px] border p-4 transition-colors duration-300 sm:p-5">
                  <Mimic
                    nodes={study.flow}
                    mode="scrub"
                    caption={study.flowCaption}
                    // Auto Apply is the one route a visitor gets to signal.
                    holdAt={study.slug === "auto-apply" ? "review" : undefined}
                  />
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
