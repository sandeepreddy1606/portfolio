"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, ExternalLink, GitPullRequest, ScrollText, Trophy } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACHIEVEMENTS } from "@/constants/achievements";
import type { Achievement } from "@/types";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const KIND_ICON: Record<Achievement["kind"], typeof Award> = {
  certification: ScrollText,
  program: Award,
  "open-source": GitPullRequest,
  award: Trophy,
  research: BookOpen,
};

export function Achievements() {
  if (ACHIEVEMENTS.length === 0) return null;

  return (
    <Section id="achievements">
      <div className="container-page">
        <SectionHeading
          eyebrow="Achievements"
          title="Milestones worth pointing at."
          description="Programs completed, systems shipped and contributions made — each one traceable to something public."
        />

        <motion.ul
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACHIEVEMENTS.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <motion.li key={item.id} variants={fadeUp}>
                <SpotlightCard className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="border-line bg-surface-2 text-accent grid size-10 place-items-center rounded-xl border">
                      <Icon className="size-4.5" />
                    </span>
                    <Badge variant="mono">{item.date}</Badge>
                  </div>

                  <h3 className="mt-5 text-base leading-snug font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-accent mt-1 text-xs font-medium">{item.issuer}</p>
                  <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-muted hover:text-ink mt-5 inline-flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <ExternalLink className="size-3.5" /> View
                    </a>
                  )}
                </SpotlightCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </Section>
  );
}
