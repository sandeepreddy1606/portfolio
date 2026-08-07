"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { cn } from "@/lib/utils";
import { EASE, fadeUp, stagger, viewportOnce } from "@/lib/motion";

export function Skills() {
  const [activeId, setActiveId] = React.useState(SKILL_CATEGORIES[0].id);
  const active = SKILL_CATEGORIES.find((c) => c.id === activeId) ?? SKILL_CATEGORIES[0];

  return (
    <Section id="skills" className="bg-surface/20 border-line border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Skills"
          title="The toolkit, grouped by the problem it solves."
          description="Not a checklist — these are the technologies I have shipped something with. Pick a category to see what sits inside it."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
          {/* Category rail — horizontal scroll on mobile, vertical list on desktop. */}
          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {SKILL_CATEGORIES.map((category) => {
              const selected = category.id === activeId;
              return (
                <motion.button
                  key={category.id}
                  variants={fadeUp}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  aria-pressed={selected}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors duration-300",
                    selected ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="skill-rail"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="border-line bg-surface absolute inset-0 rounded-2xl border shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]"
                    />
                  )}
                  <category.icon
                    className={cn(
                      "relative z-10 size-4 transition-colors duration-300",
                      selected && "text-accent",
                    )}
                  />
                  <span className="relative z-10 whitespace-nowrap">{category.title}</span>
                  <span className="text-ink-subtle relative z-10 ml-auto hidden font-mono text-[10px] lg:block">
                    {String(category.skills.length).padStart(2, "0")}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="min-h-[22rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p className="text-ink-muted mb-7 max-w-xl text-sm leading-relaxed">
                  {active.description}
                </p>

                <motion.ul
                  variants={stagger(0.045)}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {active.skills.map((skill) => (
                    <motion.li key={skill.name} variants={fadeUp}>
                      <SkillTile name={skill.name} icon={skill.icon} color={skill.color} />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

function SkillTile({
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
      // The brand colour only appears on hover, so the grid reads as one system at rest.
      style={{ "--brand": color } as React.CSSProperties}
      className="border-line bg-surface/40 group hover:border-line-strong relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 -bottom-14 h-24 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-45"
        style={{ background: "var(--brand)" }}
      />
      <Icon className="text-ink-muted relative size-7 transition-all duration-500 group-hover:scale-110 group-hover:text-[var(--brand)]" />
      <span className="text-ink-muted group-hover:text-ink relative text-center text-xs font-medium transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}
