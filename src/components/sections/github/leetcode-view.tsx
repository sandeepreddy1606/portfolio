"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Flame } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import type { LeetcodeStats } from "@/types";
import { SITE } from "@/constants/site";
import { SpotlightCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const DIFFICULTY = [
  { key: "easy", label: "Easy", color: "#22C55E" },
  { key: "medium", label: "Medium", color: "#F59E0B" },
  { key: "hard", label: "Hard", color: "#EF4444" },
] as const;

export function LeetcodeView({ stats }: { stats: LeetcodeStats }) {
  const { total } = stats.solved;

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid gap-6 lg:grid-cols-[1.3fr_1fr]"
    >
      <motion.div variants={fadeUp}>
        <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <SiLeetcode className="text-accent size-4" />
              <h3 className="font-sans text-sm font-semibold tracking-normal">Problem solving</h3>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-end gap-8">
            <div className="flex flex-col">
              <span className="font-display text-5xl font-extrabold tabular-nums">{total}</span>
              <span className="text-ink-subtle mt-1 text-xs">Problems solved</span>
            </div>

            <div className="flex gap-6">
              <Stat icon={Flame} value={stats.streak} label="Day streak" />
              <Stat icon={CalendarCheck} value={stats.activeDays} label="Active days" />
            </div>
          </div>

          {/* Difficulty split — proportional bar plus an explicit legend. */}
          <div className="bg-surface-2 mt-7 flex h-2.5 overflow-hidden rounded-full">
            {DIFFICULTY.map((tier) => (
              <span
                key={tier.key}
                style={{
                  width: `${(stats.solved[tier.key] / total) * 100}%`,
                  background: tier.color,
                }}
                title={`${tier.label} — ${stats.solved[tier.key]}`}
              />
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            {DIFFICULTY.map((tier) => (
              <li key={tier.key} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: tier.color }}
                  aria-hidden
                />
                <span className="text-ink-muted">{tier.label}</span>
                <span className="font-mono text-xs font-semibold">{stats.solved[tier.key]}</span>
              </li>
            ))}
          </ul>

          <h4 className="text-ink-subtle mt-8 font-sans text-sm font-semibold tracking-normal">
            Strongest topics
          </h4>
          <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
            {stats.topics.map((topic) => (
              <li key={topic.name}>
                <Badge variant="outline" size="md">
                  {topic.name}
                  <span className="text-ink-subtle font-mono">{topic.solved}</span>
                </Badge>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" size="sm" className="mt-7 self-start">
            <a href={stats.profileUrl} target="_blank" rel="noopener noreferrer">
              <SiLeetcode /> LeetCode profile
            </a>
          </Button>
        </SpotlightCard>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
          <h3 className="font-sans text-sm font-semibold tracking-normal">Solved by language</h3>
          <p className="text-ink-subtle mt-1 text-xs">Where the algorithm work actually happens.</p>

          <ul className="mt-6 flex flex-col gap-4">
            {stats.languages.map((language) => (
              <li key={language.name} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink-muted">{language.name}</span>
                  <span className="font-mono text-xs font-semibold">{language.solved}</span>
                </div>
                <div className="bg-surface-2 h-1.5 overflow-hidden rounded-full">
                  <div
                    style={{ width: `${(language.solved / stats.languages[0].solved) * 100}%` }}
                    className="bg-accent h-full rounded-full"
                  />
                </div>
              </li>
            ))}
          </ul>

          {stats.badges.length > 0 && (
            <>
              <h4 className="text-ink-subtle mt-8 font-sans text-sm font-semibold tracking-normal">
                Badges
              </h4>
              <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                {stats.badges.map((badge) => (
                  <li
                    key={badge.name}
                    className="border-line bg-surface-2/40 flex items-center gap-3 rounded-xl border px-3 py-2.5"
                  >
                    {/* Remote badge art from LeetCode's CDN — plain <img> avoids
                        adding a whole domain to the image optimiser for two icons. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={badge.icon} alt="" aria-hidden className="size-7 shrink-0" />
                    <span className="text-sm">{badge.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {stats.school && (
            <p className="text-ink-subtle border-line mt-7 border-t pt-4 text-xs">{stats.school}</p>
          )}
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Flame; value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5">
        <Icon className="text-accent size-4" />
        <span className="font-display text-2xl font-bold">{value}</span>
      </span>
      <span className="text-ink-subtle text-xs">{label}</span>
    </div>
  );
}

export function LeetcodeSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="border-line bg-surface/40 h-96 rounded-[14px] border" />
      <div className="border-line bg-surface/40 h-96 rounded-[14px] border" />
    </div>
  );
}

export function LeetcodeFallback() {
  return (
    <div className="border-line flex flex-col items-center gap-5 rounded-[14px] border border-dashed px-6 py-14 text-center">
      <SiLeetcode className="text-ink-subtle size-7" />
      <p className="text-ink-muted max-w-sm text-sm">
        Live LeetCode stats could not be loaded right now.
      </p>
      <Button asChild variant="outline" size="sm">
        <a
          href={`https://leetcode.com/u/${SITE.leetcodeUsername}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiLeetcode /> Open LeetCode profile
        </a>
      </Button>
    </div>
  );
}
