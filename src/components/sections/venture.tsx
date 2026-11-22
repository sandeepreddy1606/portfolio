"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Rocket } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/animated-text";
import { AuroraBackground, GridBackground } from "@/components/ui/backgrounds";
import { VENTURE, VENTURE_STATS } from "@/constants/venture";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export function Venture() {
  return (
    <Section id="venture" className="enamel relative overflow-hidden">
      <AuroraBackground className="opacity-70" />
      <GridBackground className="opacity-50" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Currently building"
          title={
            <>
              {VENTURE.name} —{" "}
              <span className="text-ink-subtle">{VENTURE.tagline.replace(/^A /, "a ")}</span>
            </>
          }
          description={VENTURE.summary}
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 flex flex-col gap-6"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <span className="border-accent/30 bg-accent-soft text-accent inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2.5 text-xs font-medium">
              <span className="relative flex size-2">
                <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                <span className="bg-accent relative inline-flex size-2 rounded-full" />
              </span>
              {VENTURE.status}
            </span>
            <Badge variant="mono" size="md">
              {VENTURE.period}
            </Badge>
            <Badge variant="outline" size="md">
              <Lock className="size-3" /> Private repositories
            </Badge>
            <a
              href={VENTURE.orgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              github.com/{VENTURE.org}
              <ArrowUpRight className="size-3.5" />
            </a>
          </motion.div>

          {/* Headline numbers. */}
          <motion.ul variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {VENTURE_STATS.map((stat) => (
              <li key={stat.label}>
                <SpotlightCard glow={false} className="flex flex-col gap-1 p-5 sm:p-6">
                  <span className="font-display from-ink to-ink-subtle bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    <CountUp value={stat.value} />
                  </span>
                  <span className="text-ink-subtle text-xs leading-tight">{stat.label}</span>
                </SpotlightCard>
              </li>
            ))}
          </motion.ul>

          <SurfaceMap />

          <motion.div variants={fadeUp}>
            <SpotlightCard className="p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <Rocket className="text-accent size-4" />
                <h3 className="text-sm font-semibold tracking-tight">
                  Decisions behind the authentication service
                </h3>
              </div>
              <p className="text-ink-muted mt-3 max-w-2xl text-sm leading-relaxed">
                Ten endpoints under a single envelope, and a set of choices I would defend in a
                review. These are the ones that changed the shape of the schema.
              </p>

              <ol className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {VENTURE.decisions.map((decision, index) => (
                  <li key={decision.title} className="flex gap-4">
                    <span className="text-ink-subtle mt-0.5 shrink-0 font-mono text-[11px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm leading-snug font-semibold tracking-tight">
                        {decision.title}
                      </h4>
                      <p className="text-ink-muted text-sm leading-relaxed">{decision.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </SpotlightCard>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
            {VENTURE.stack.map((group) => (
              <SpotlightCard key={group.label} glow={false} className="p-5 sm:p-6">
                <h3 className="text-ink-subtle font-mono text-[10px] tracking-[0.2em] uppercase">
                  {group.label}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/**
 * The four product surfaces, each showing its frontend/backend repository pair.
 * Selecting one expands its detail — the grid stays scannable at rest.
 */
function SurfaceMap() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = VENTURE.surfaces[activeIndex];

  return (
    <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <ul className="flex flex-col gap-3">
        {VENTURE.surfaces.map((surface, index) => {
          const selected = index === activeIndex;
          return (
            <li key={surface.name}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={selected}
                className={`relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-300 ${
                  selected ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="venture-surface"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="border-line bg-surface/60 absolute inset-0 rounded-2xl border backdrop-blur-md"
                  />
                )}
                <span
                  className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                    selected ? "border-accent/40 bg-accent-soft text-accent" : "border-line"
                  }`}
                >
                  <surface.icon className="size-4" />
                </span>
                <span className="relative z-10 flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold tracking-tight">{surface.name}</span>
                  <span className="text-ink-subtle text-xs">{surface.audience}</span>
                </span>
                <span className="text-ink-subtle relative z-10 font-mono text-[10px]">fe · be</span>
              </button>
            </li>
          );
        })}
      </ul>

      <SpotlightCard className="flex flex-col p-6 sm:p-7">
        <motion.div
          key={active.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-1 flex-col"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{active.name}</h3>
            <Badge variant="accent">{active.audience}</Badge>
          </div>

          <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">{active.description}</p>

          <h4 className="text-ink-subtle mt-7 font-mono text-[10px] tracking-[0.2em] uppercase">
            Repositories
          </h4>
          <ul className="mt-3 flex flex-col gap-2">
            {[
              { tier: "Frontend", repo: active.frontendRepo },
              { tier: "Backend", repo: active.backendRepo },
            ].map(({ tier, repo }) => (
              <li
                key={repo}
                className="border-line bg-surface-2/40 flex items-center gap-3 rounded-xl border px-3.5 py-2.5"
              >
                <span className="text-ink-subtle w-16 shrink-0 font-mono text-[10px] tracking-wider uppercase">
                  {tier}
                </span>
                <code className="min-w-0 flex-1 truncate font-mono text-xs">{repo}</code>
                <Lock className="text-ink-subtle size-3 shrink-0" aria-label="Private" />
              </li>
            ))}
          </ul>
        </motion.div>
      </SpotlightCard>
    </motion.div>
  );
}
