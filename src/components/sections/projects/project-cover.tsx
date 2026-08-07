"use client";

import type { Project } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Generated cover artwork.
 *
 * Every project gets a distinct, deterministic image built from its accent pair
 * — no screenshots to capture, no binary assets to ship, and nothing to go stale
 * when a UI changes. The seed is derived from the slug so a project's cover is
 * stable across renders.
 */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const [from, to] = project.accent;
  const seed = [...project.slug].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const rings = Array.from({ length: 4 }, (_, i) => 26 + i * 16 + (seed % 7));
  const bars = Array.from({ length: 12 }, (_, i) => 12 + ((seed * (i + 3)) % 62));

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${from}22, ${to}12)` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: `radial-gradient(120% 100% at 20% 0%, ${from}45, transparent 60%)` }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(90% 80% at 100% 100%, ${to}40, transparent 65%)` }}
      />

      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id={`stroke-${project.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="0.85" />
            <stop offset="100%" stopColor={to} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {rings.map((r) => (
          <circle
            key={r}
            cx="158"
            cy="18"
            r={r}
            fill="none"
            stroke={`url(#stroke-${project.slug})`}
            strokeWidth="0.5"
          />
        ))}

        {/* Signal bars — a different silhouette per project via the seed. */}
        <g transform="translate(14, 104)">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={i * 7}
              y={-h}
              width="3"
              height={h}
              rx="1.5"
              fill={i % 2 ? to : from}
              opacity={0.14 + (i % 5) * 0.06}
            />
          ))}
        </g>
      </svg>

      {/* Monogram derived from the title. */}
      <span
        className="font-display absolute bottom-3 left-5 text-[3.5rem] leading-none font-bold tracking-tighter opacity-[0.14]"
        style={{ color: from }}
      >
        {project.title
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("")}
      </span>
    </div>
  );
}
