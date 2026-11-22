import { Section, SectionHeading } from "@/components/ui/section";
import { TIMELINE } from "@/constants/experience";
import type { TimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  role: "Role",
  program: "Program",
  milestone: "Independent work",
  education: "Education",
};

/**
 * Experience as a plain record: date on the left, substance on the right.
 * A timeline is a genuine sequence, so it reads top to bottom like one —
 * no alternating cards, no animated spine.
 */
export function Experience() {
  return (
    <Section id="experience">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="Where the work happened."
          description="Roles first, then the independent phases behind the projects — each anchored to real repositories and their history."
        />

        <ol className="mt-14 flex flex-col">
          {TIMELINE.map((entry) => (
            <li
              key={entry.id}
              className="border-line grid gap-4 border-t py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10"
            >
              <div className="text-sm">
                <p className="text-ink">{entry.period}</p>
                <p
                  className={cn("mt-1", entry.kind === "role" ? "text-accent" : "text-ink-subtle")}
                >
                  {KIND_LABEL[entry.kind]}
                </p>
              </div>

              <div className="max-w-[68ch] min-w-0">
                <h3 className="text-xl font-semibold sm:text-2xl">{entry.title}</h3>
                <p className="text-ink-muted mt-1 text-sm">
                  {entry.organisation}
                  {entry.location ? `, ${entry.location}` : ""}
                </p>
                <p className="prose-serif mt-4 text-[1.0625rem]">{entry.summary}</p>
                <ul className="text-ink-muted mt-4 flex list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-relaxed">
                  {entry.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
                  {entry.stack.map((s) => (
                    <li
                      key={s}
                      className="border-line text-ink-subtle rounded border px-2 py-0.5 font-mono text-xs"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
