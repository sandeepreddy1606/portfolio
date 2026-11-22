"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Search, SlidersHorizontal, X } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { Section, SectionHeading } from "@/components/ui/section";
import { PROJECTS, PROJECT_FILTERS } from "@/constants/projects";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { EASE, fadeUp, viewportOnce } from "@/lib/motion";
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
    <Section id="archive" className="pt-32 sm:pt-40 lg:pt-44">
      <div className="container-page">
        <SectionHeading
          title={`All ${PROJECTS.length} projects`}
          description="Each one maps to a public repository with a README you can follow. Search by name or by technology, and open a project for the full breakdown."
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
                className="border-line-strong bg-surface-2 placeholder:text-ink-subtle focus:border-accent h-12 w-full rounded-md border pr-4 pl-11 text-[15px] transition-colors duration-300 outline-none"
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

        <motion.ul layout className="border-line-strong mt-10 border-t">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectRow
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
            className="border-line mt-10 flex flex-col items-center gap-4 rounded-md border border-dashed px-6 py-20 text-center"
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
        "relative shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300",
        active ? "text-accent-ink" : "text-ink-muted hover:text-ink border-line border",
      )}
    >
      {active && (
        <motion.span
          layoutId="project-filter"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
          className="bg-accent absolute inset-0 rounded-md"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

/** One timetable line: year, project, stack, and where to go next. */
function ProjectRow({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="border-line grid gap-3 border-b py-7 md:grid-cols-[4.5rem_minmax(0,5fr)_minmax(0,4fr)_auto] md:items-start md:gap-8"
    >
      <span className="text-ink-subtle pt-1 font-mono text-sm tabular-nums">{project.year}</span>
      <div className="min-w-0">
        <h3 className="text-3xl font-extrabold uppercase">
          <button
            type="button"
            onClick={onOpen}
            className="hover:text-accent text-left transition-colors"
            aria-label={`Open details for ${project.title}`}
          >
            {project.title}
          </button>
        </h3>
        <p className="text-ink-muted mt-2 max-w-[52ch] leading-relaxed">{project.tagline}</p>
      </div>
      <p className="text-ink-subtle pt-1 text-sm leading-relaxed">{project.stack.join(", ")}</p>
      <div className="flex items-center gap-1 md:pt-0.5">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink hover:bg-surface-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
          >
            <Github className="size-3.5" /> Code
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink hover:bg-surface-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
          >
            <ExternalLink className="size-3.5" /> Live
          </a>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="text-accent rounded-md px-2.5 py-1.5 text-sm font-bold"
        >
          Details
        </button>
      </div>
    </motion.li>
  );
}
