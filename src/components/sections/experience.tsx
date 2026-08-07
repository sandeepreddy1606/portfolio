"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Award, Building2, GraduationCap, Rocket } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIMELINE } from "@/constants/experience";
import type { TimelineEntry } from "@/types";
import { fadeUp, viewportOnce } from "@/lib/motion";

const KIND_META: Record<TimelineEntry["kind"], { icon: typeof Rocket; label: string }> = {
  role: { icon: Building2, label: "Role" },
  program: { icon: Award, label: "Program" },
  milestone: { icon: Rocket, label: "Milestone" },
  education: { icon: GraduationCap, label: "Education" },
};

export function Experience() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });
  // The spine fills as the timeline scrolls past the reading line.
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="experience">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="A timeline reconstructed from what I actually shipped."
          description="Each phase below is anchored to real repositories and their commit history — what I was building, and what it taught me."
        />

        <div ref={containerRef} className="relative mt-16">
          {/* Spine: static track, animated fill, travelling glow. */}
          <div
            aria-hidden
            className="bg-line absolute top-0 left-[15px] h-full w-px sm:left-[19px] lg:left-1/2 lg:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="from-accent via-iris to-cyan absolute top-0 left-[15px] h-full w-px origin-top bg-gradient-to-b sm:left-[19px] lg:left-1/2 lg:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={{ top: glowY }}
            className="bg-accent absolute left-[15px] size-2 -translate-x-1/2 rounded-full shadow-[0_0_20px_6px_var(--accent)] sm:left-[19px] lg:left-1/2"
          />

          <ol className="flex flex-col gap-10 sm:gap-14">
            {TIMELINE.map((entry, index) => (
              <TimelineItem key={entry.id} entry={entry} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const { icon: Icon, label } = KIND_META[entry.kind];
  const flipped = index % 2 === 1;

  return (
    <motion.li
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative pl-11 sm:pl-16 lg:grid lg:grid-cols-2 lg:gap-14 lg:pl-0"
    >
      {/* Marker sits on the spine at every breakpoint. */}
      <span
        className="border-line bg-canvas text-accent absolute top-1 left-0 z-10 grid size-8 place-items-center rounded-full border sm:size-10 lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden
      >
        <Icon className="size-3.5 sm:size-4" />
      </span>

      <div
        className={
          flipped ? "lg:col-start-2 lg:pl-6" : "lg:col-start-1 lg:row-start-1 lg:pr-6 lg:text-right"
        }
      >
        <SpotlightCard className="p-6 sm:p-7">
          <div className={`flex flex-wrap items-center gap-2.5 ${flipped ? "" : "lg:justify-end"}`}>
            <Badge variant="accent">{entry.period}</Badge>
            <Badge variant="mono">{label}</Badge>
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-tight">{entry.title}</h3>
          <p className="text-accent mt-1 text-sm font-medium">
            {entry.organisation}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          <p className="text-ink-muted mt-3 text-sm leading-relaxed">{entry.summary}</p>

          <ul className={`mt-5 flex flex-col gap-2.5 ${flipped ? "" : "lg:items-end"}`}>
            {entry.highlights.map((highlight) => (
              <li
                key={highlight}
                className={`text-ink-muted flex gap-2.5 text-sm leading-relaxed ${
                  flipped ? "" : "lg:flex-row-reverse lg:text-right"
                }`}
              >
                <span className="bg-accent mt-[0.55em] size-1 shrink-0 rounded-full" aria-hidden />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className={`mt-5 flex flex-wrap gap-1.5 ${flipped ? "" : "lg:justify-end"}`}>
            {entry.stack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </motion.li>
  );
}
