"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { TIMELINE } from "@/constants/experience";
import type { TimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Experience as Edmondson railway tickets — the pre-printed card tickets
 * Indian Railways and British lines issued for a century and a half. Each
 * entry is one card: class band, serial, a stamped date, and the journey.
 *
 * The front is built for a one-minute scan (role, organisation, dates, the
 * headline); turning the ticket over reveals the full record. The current
 * role is a season ticket: full width, open by default.
 */

const CLASS: Record<TimelineEntry["kind"], { label: string; band: string }> = {
  role: { label: "Role", band: "bg-lamp-amber text-[#1b1405]" },
  milestone: { label: "Independent", band: "bg-lamp-green text-[#06170d]" },
  program: { label: "Program", band: "bg-[#c9a66b] text-[#1f1607]" },
  education: { label: "Education", band: "bg-[#ece7d6] text-[#1f2a25]" },
};

/** Semicircle notches where the stub tears off, cut from both edges. */
const NOTCH_Y = "5.25rem";
const NOTCHES = `radial-gradient(circle at 0 ${NOTCH_Y}, transparent 9px, #000 9.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% ${NOTCH_Y}, transparent 9px, #000 9.5px) right / 51% 100% no-repeat`;

export function Experience() {
  const [current, ...rest] = TIMELINE;
  const origin = rest.pop()!;

  return (
    <Section id="experience">
      <div className="container-page">
        <SectionHeading
          title="Where the work happened"
          description="One ticket per stretch of the journey, newest first. Each front gives the role, the dates and the point of it; turn a ticket over for the full record."
        />

        <ol className="mt-14 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li className="md:col-span-2 lg:col-span-3">
            <Ticket entry={current} serial={1} variant="season" />
          </li>
          {rest.map((entry, i) => (
            <li key={entry.id}>
              <Ticket entry={entry} serial={i + 2} />
            </li>
          ))}
          {/* Where it started: a platform ticket, the pass that gets you onto
              the platform before any journey. Closes the set full width. */}
          <li className="md:col-span-2 lg:col-span-3">
            <Ticket entry={origin} serial={TIMELINE.length} variant="platform" />
          </li>
        </ol>
      </div>
    </Section>
  );
}

function Ticket({
  entry,
  serial,
  variant = "single",
}: {
  entry: TimelineEntry;
  serial: number;
  /** season: current role, wide and open; platform: the starting point, wide. */
  variant?: "single" | "season" | "platform";
}) {
  const season = variant === "season";
  const wide = variant !== "single";
  const [open, setOpen] = React.useState(wide);
  const id = React.useId();
  const cls = CLASS[entry.kind];

  return (
    <article
      className="enamel group relative rounded-[10px] shadow-[0_18px_30px_-22px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1"
      style={{ mask: NOTCHES, WebkitMask: NOTCHES }}
      aria-labelledby={`${id}-title`}
    >
      {/* Class band + serial, as printed across the top of the card. */}
      <header
        className={cn(
          "flex items-center justify-between rounded-t-[10px] px-5 py-2 text-xs font-bold",
          cls.band,
        )}
      >
        <span>
          {season
            ? `${cls.label} · season ticket`
            : variant === "platform"
              ? "Platform ticket · where it started"
              : cls.label}
        </span>
        <span className="font-mono tabular-nums">No. {String(serial).padStart(4, "0")}</span>
      </header>

      {/* Stub: the stamped date, where a booking clerk's press would print it. */}
      <div className="flex h-[3.25rem] items-center px-5">
        <p className="border-ink/40 text-ink inline-flex -rotate-1 items-center gap-2 rounded-sm border border-dashed px-2.5 py-1 font-mono text-[13px] font-semibold tabular-nums">
          {entry.period.toUpperCase()}
        </p>
      </div>

      {/* Tear line between stub and body, level with the notches. */}
      <div aria-hidden className="border-ink/30 mx-3 border-t-2 border-dashed" />

      <div
        className={cn(
          "px-5 pt-5 pb-4",
          wide && "lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10",
        )}
      >
        <div>
          <h3
            id={`${id}-title`}
            className={cn(
              "font-extrabold uppercase",
              season ? "text-[clamp(2rem,4vw,3rem)]" : "text-[1.75rem]",
            )}
          >
            {entry.title}
          </h3>
          {/* "Independent" is already printed on the class band. */}
          {entry.organisation !== "Independent" && (
            <p className="text-brass mt-1 text-sm font-bold">
              {entry.organisation}
              {entry.location ? `, ${entry.location}` : ""}
            </p>
          )}
          <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">{entry.summary}</p>
        </div>

        <div className={cn(wide ? "mt-5 lg:mt-0" : "mt-4")}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-record`}
            onClick={() => setOpen((o) => !o)}
            className="text-ink hover:text-accent inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
          >
            {open ? "Turn back over" : `Turn over · ${entry.highlights.length} highlights`}
            <ChevronDown
              className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
              aria-hidden
            />
          </button>

          {/* The back of the ticket. Height animates through grid rows, so the
              content stays in the DOM and in reading order. */}
          <div
            id={`${id}-record`}
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden" inert={!open}>
              <ul className="mt-4 flex flex-col gap-2.5">
                {entry.highlights.map((h) => (
                  <li key={h} className="text-ink-muted flex gap-3 text-[14.5px] leading-relaxed">
                    <span aria-hidden className="bg-verify mt-2 size-2 shrink-0 rounded-full" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-line flex flex-wrap gap-x-3 gap-y-1 border-t px-5 py-3">
        {entry.stack.map((s) => (
          <span key={s} className="text-ink-subtle font-mono text-xs">
            {s}
          </span>
        ))}
      </footer>
    </article>
  );
}
