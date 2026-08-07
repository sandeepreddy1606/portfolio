"use client";

import { motion } from "framer-motion";
import { GitFork, Star } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import type { GithubStats } from "@/types";
import { SITE } from "@/constants/site";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/animated-text";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

/** Fixed palette so language colours stay consistent between the bar and legend. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Dart: "#0175C2",
  Java: "#F89820",
  PHP: "#777BB4",
  HTML: "#E34F26",
  CSS: "#663399",
  Shell: "#89E051",
};

const colorFor = (name: string) => LANGUAGE_COLORS[name] ?? "var(--accent)";

export function GithubView({ stats }: { stats: GithubStats }) {
  const cards = [
    { label: "Public repos", value: stats.publicRepos },
    { label: "Stars earned", value: stats.totalStars },
    { label: "Followers", value: stats.followers },
    { label: "Languages", value: stats.languages.length },
  ];

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <SpotlightCard key={card.label} glow={false} className="flex flex-col gap-1 p-5 sm:p-6">
            <span className="font-display from-ink to-ink-subtle bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              <CountUp value={card.value} />
            </span>
            <span className="text-ink-subtle text-xs">{card.label}</span>
          </SpotlightCard>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <motion.div variants={fadeUp}>
          <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-tight">Language distribution</h3>
            <p className="text-ink-subtle mt-1 text-xs">
              Share of source across owned repositories.
            </p>

            <div className="bg-surface-2 mt-6 flex h-2.5 overflow-hidden rounded-full">
              {stats.languages.map((language, index) => (
                <motion.span
                  key={language.name}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${language.percentage}%` }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: colorFor(language.name) }}
                  title={`${language.name} — ${language.percentage}%`}
                />
              ))}
            </div>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {stats.languages.map((language) => (
                <li key={language.name} className="flex items-center gap-3 text-sm">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: colorFor(language.name) }}
                    aria-hidden
                  />
                  <span className="text-ink-muted flex-1">{language.name}</span>
                  <span className="text-ink-subtle font-mono text-xs">{language.percentage}%</span>
                </li>
              ))}
            </ul>

            <p className="text-ink-subtle border-line mt-6 border-t pt-4 text-xs">
              Building publicly since {formatDate(stats.memberSince, { day: undefined })}.
            </p>
          </SpotlightCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-tight">Recent activity</h3>
            <p className="text-ink-subtle mt-1 text-xs">Most recently pushed repositories.</p>

            <ul className="mt-5 flex flex-1 flex-col">
              {stats.repos.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line hover:bg-surface-2/50 -mx-3 flex flex-col gap-1.5 rounded-xl border-b px-3 py-3.5 transition-colors last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-1 truncate font-mono text-sm">{repo.name}</span>
                      {repo.stars > 0 && (
                        <span className="text-ink-subtle flex items-center gap-1 text-xs">
                          <Star className="size-3" /> {repo.stars}
                        </span>
                      )}
                      {repo.forks > 0 && (
                        <span className="text-ink-subtle flex items-center gap-1 text-xs">
                          <GitFork className="size-3" /> {repo.forks}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-ink-muted line-clamp-1 text-xs">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      {repo.language && <Badge>{repo.language}</Badge>}
                      <span className="text-ink-subtle text-[11px]">
                        {formatDate(repo.updatedAt)}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <Button asChild variant="outline" size="sm" className="mt-6 self-start">
              <a
                href={`https://github.com/${SITE.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github /> View full profile
              </a>
            </Button>
          </SpotlightCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Shown while the GitHub request is in flight. */
export function GithubSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-line bg-surface/40 h-28 rounded-3xl border" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="border-line bg-surface/40 h-80 rounded-3xl border" />
        <div className="border-line bg-surface/40 h-80 rounded-3xl border" />
      </div>
    </div>
  );
}

/** Rendered when the API is unreachable or rate limited. */
export function GithubFallback() {
  return (
    <div className="border-line flex flex-col items-center gap-5 rounded-3xl border border-dashed px-6 py-16 text-center">
      <Github className="text-ink-subtle size-8" />
      <p className="text-ink-muted max-w-sm text-sm">
        Live GitHub stats are unavailable right now — the public API rate limit is shared and
        occasionally exhausted. The profile itself is always up to date.
      </p>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://github.com/${SITE.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github /> Open GitHub profile
        </a>
      </Button>
    </div>
  );
}
