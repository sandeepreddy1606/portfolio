"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AI_PROJECTS } from "@/constants/projects";
import type { AiProject } from "@/types";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { AuroraBackground } from "@/components/ui/backgrounds";

const DISCIPLINES = ["All", "Agents", "LLM", "Computer Vision", "NLP", "Speech"] as const;

export function AiProjects() {
  const [discipline, setDiscipline] = React.useState<(typeof DISCIPLINES)[number]>("All");

  const visible =
    discipline === "All"
      ? AI_PROJECTS
      : AI_PROJECTS.filter((project) => project.discipline === discipline);

  return (
    <Section id="ai" className="border-line relative overflow-hidden border-y">
      <AuroraBackground className="opacity-60" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="AI engineering"
          title="Where the model meets the product."
          description="Seven systems built around language models, vision and speech — each one shown as the pipeline it actually is, not as a black box with a prompt in it."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="-mx-5 mt-10 flex scrollbar-none gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {DISCIPLINES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDiscipline(item)}
              aria-pressed={discipline === item}
              className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ${
                discipline === item
                  ? "text-accent-ink"
                  : "border-line text-ink-muted hover:text-ink border"
              }`}
            >
              {discipline === item && (
                <motion.span
                  layoutId="ai-filter"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="bg-accent absolute inset-0 rounded-full"
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </motion.div>

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-8 grid gap-6 lg:grid-cols-2"
        >
          {visible.map((project) => (
            <motion.li key={project.slug} variants={fadeUp} layout>
              <AiCard project={project} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}

function AiCard({ project }: { project: AiProject }) {
  return (
    <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <Badge variant="accent">{project.discipline}</Badge>
      </div>

      <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">{project.summary}</p>

      <ArchitectureStrip stages={project.architecture} />

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink ml-auto inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <Github className="size-3.5" /> Source
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}

/** Horizontal pipeline diagram — the data path, stage by stage. */
function ArchitectureStrip({ stages }: { stages: string[] }) {
  return (
    <div className="border-line mt-6 rounded-2xl border border-dashed p-4">
      <p className="text-ink-subtle mb-3 font-mono text-[10px] tracking-[0.2em] uppercase">
        Pipeline
      </p>
      <ol className="flex scrollbar-none items-center gap-1.5 overflow-x-auto">
        {stages.map((stage, index) => (
          <li key={stage} className="flex shrink-0 items-center gap-1.5">
            <span className="border-line bg-surface-2/70 text-ink-muted rounded-lg border px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap">
              {stage}
            </span>
            {index < stages.length - 1 && (
              <ArrowRight className="text-ink-subtle size-3 shrink-0" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
