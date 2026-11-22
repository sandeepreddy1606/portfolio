"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { Marquee } from "@/components/ui/marquee";
import { TECH_WALL } from "@/constants/skills";
import { fadeUp, viewportOnce } from "@/lib/motion";

/** Split into three rows that scroll at different speeds and directions. */
const ROWS = [
  { items: TECH_WALL.filter((_, i) => i % 3 === 0), reverse: false, duration: 46 },
  { items: TECH_WALL.filter((_, i) => i % 3 === 1), reverse: true, duration: 54 },
  { items: TECH_WALL.filter((_, i) => i % 3 === 2), reverse: false, duration: 62 },
];

export function TechStack() {
  return (
    <Section id="stack" className="overflow-hidden">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tech wall"
          title="Everything I reach for, in one place."
          align="center"
          className="mx-auto items-center"
        />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 flex flex-col gap-4"
      >
        {ROWS.map((row, index) => (
          <Marquee key={index} reverse={row.reverse} duration={row.duration}>
            {row.items.map((tech) => (
              <TechPill key={tech.name} name={tech.name} icon={tech.icon} color={tech.color} />
            ))}
          </Marquee>
        ))}
      </motion.div>
    </Section>
  );
}

function TechPill({
  name,
  icon: Icon,
  color,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div
      style={{ "--brand": color } as React.CSSProperties}
      className="border-line bg-surface/50 group hover:border-line-strong flex shrink-0 items-center gap-2.5 rounded-2xl border px-5 py-3.5 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
    >
      <Icon className="text-ink-muted size-5 transition-colors duration-500 group-hover:text-[var(--brand)]" />
      <span className="text-ink-muted group-hover:text-ink text-sm font-medium whitespace-nowrap transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}
