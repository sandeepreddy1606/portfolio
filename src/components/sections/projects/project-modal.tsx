"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";
import { ProjectCover } from "./project-cover";

/**
 * Expanded case study. Shares `layoutId` with the grid card so the cover and
 * title morph in place rather than cross-fading.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[92] grid place-items-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="bg-canvas/70 absolute inset-0 backdrop-blur-md"
          />

          <motion.div
            layoutId={`project-${project.slug}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-title-${project.slug}`}
            className="glass border-line-strong relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.75)]"
          >
            <motion.div
              layoutId={`cover-${project.slug}`}
              className="relative h-40 shrink-0 sm:h-52"
            >
              <ProjectCover project={project} className="size-full" />
              <div className="from-surface/90 absolute inset-0 bg-gradient-to-t to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="glass text-ink absolute top-4 right-4 grid size-9 place-items-center rounded-full"
              >
                <X className="size-4" />
              </button>
            </motion.div>

            <div
              // Lenis must not hijack the wheel inside a scrollable overlay.
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
              >
                <div className="-mt-8 flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{project.year}</Badge>
                  <Badge variant="mono">{project.category}</Badge>
                </div>

                <h3
                  id={`project-title-${project.slug}`}
                  className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {project.title}
                </h3>
                <p className="text-accent mt-1.5 text-sm">{project.tagline}</p>
                <p className="text-ink-muted mt-5 text-sm leading-relaxed">{project.description}</p>

                {project.metrics && (
                  <div className="border-line mt-6 grid grid-cols-3 gap-4 rounded-2xl border p-4">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="flex flex-col gap-0.5">
                        <span className="font-display text-lg font-bold">{metric.value}</span>
                        <span className="text-ink-subtle text-[11px] leading-tight">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <h4 className="text-ink-subtle mt-8 font-mono text-[11px] tracking-[0.2em] uppercase">
                  What it does
                </h4>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-ink-muted flex gap-2.5 text-sm leading-relaxed"
                    >
                      <ArrowUpRight className="text-accent mt-0.5 size-3.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <h4 className="text-ink-subtle mt-8 font-mono text-[11px] tracking-[0.2em] uppercase">
                  Built with
                </h4>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="outline" size="md">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.demo && (
                    <Button asChild variant="accent">
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink /> Live demo
                      </a>
                    </Button>
                  )}
                  {project.repo && (
                    <Button asChild variant="outline">
                      <a href={project.repo} target="_blank" rel="noopener noreferrer">
                        <Github /> Source code
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
