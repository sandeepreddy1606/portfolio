"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Search, SlidersHorizontal, X } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { PROJECTS, PROJECT_FILTERS } from "@/constants/projects";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { EASE, fadeUp, viewportOnce } from "@/lib/motion";
import { useSpotlight } from "@/hooks/use-spotlight";
import { ProjectCover } from "./project-cover";
import { ProjectModal } from "./project-modal";

export function Projects() {
  const [query, setQuery] = React.useState("");
  const [activeTech, setActiveTech] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Project | null>(null);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();

    return PROJECTS.filter((project) => {
      if (activeTech && !project.stack.includes(activeTech)) return false;
      if (!needle) return true;

      // Search title, tagline, description and stack together — users type the
      // technology as often as they type the project name.
      return [project.title, project.tagline, project.description, ...project.stack]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [query, activeTech]);

  const hasFilters = query !== "" || activeTech !== null;

  return (
    <Section id="work">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected work"
          title="Twelve projects. Every one of them runs."
          description="Each card maps to a public repository with a README you can follow. Open one for the full breakdown."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="text-ink-subtle pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, stacks, ideas…"
                aria-label="Search projects"
                className="border-line bg-surface/50 placeholder:text-ink-subtle focus:border-accent/60 h-12 w-full rounded-full border pr-4 pl-11 text-sm backdrop-blur-md transition-colors duration-300 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-ink-subtle hover:text-ink absolute top-1/2 right-4 -translate-y-1/2"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <p className="text-ink-subtle flex shrink-0 items-center gap-2 font-mono text-xs">
              <SlidersHorizontal className="size-3.5" />
              {filtered.length} of {PROJECTS.length}
            </p>
          </div>

          <div className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <FilterChip
              label="All"
              active={activeTech === null}
              onClick={() => setActiveTech(null)}
            />
            {PROJECT_FILTERS.map((tech) => (
              <FilterChip
                key={tech}
                label={tech}
                active={activeTech === tech}
                onClick={() => setActiveTech(activeTech === tech ? null : tech)}
              />
            ))}
          </div>
        </motion.div>

        <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onOpen={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed px-6 py-20 text-center"
          >
            <p className="text-ink-muted text-sm">Nothing matches that combination.</p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveTech(null);
                }}
                className="text-accent text-sm underline-offset-4 hover:underline"
              >
                Reset filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-300",
        active ? "text-accent-ink" : "text-ink-muted hover:text-ink border-line border",
      )}
    >
      {active && (
        <motion.span
          layoutId="project-filter"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
          className="bg-accent absolute inset-0 rounded-full"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { ref, onMouseMove } = useSpotlight<HTMLLIElement>();

  return (
    <motion.li
      ref={ref}
      onMouseMove={onMouseMove}
      layout
      layoutId={`project-${project.slug}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="spotlight border-glow group border-line bg-surface/40 relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.7)]"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open details for ${project.title}`}
        className="flex flex-1 flex-col text-left"
      >
        <motion.div layoutId={`cover-${project.slug}`} className="relative h-40 overflow-hidden">
          <ProjectCover
            project={project}
            className="size-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
          {project.featured && (
            <span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase">
              Featured
            </span>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg leading-tight font-semibold tracking-tight">{project.title}</h3>
            <span className="text-ink-subtle shrink-0 font-mono text-xs">{project.year}</span>
          </div>

          <p className="text-ink-muted flex-1 text-sm leading-relaxed">{project.tagline}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.stack.slice(0, 4).map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
            {project.stack.length > 4 && (
              <Badge variant="outline">+{project.stack.length - 4}</Badge>
            )}
          </div>
        </div>
      </button>

      <div className="border-line flex items-center gap-1 border-t px-4 py-3">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink hover:bg-surface-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
          >
            <Github className="size-3.5" /> Code
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink hover:bg-surface-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
          >
            <ExternalLink className="size-3.5" /> Live
          </a>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="text-accent ml-auto rounded-full px-3 py-1.5 text-xs font-medium"
        >
          Case study →
        </button>
      </div>
    </motion.li>
  );
}
