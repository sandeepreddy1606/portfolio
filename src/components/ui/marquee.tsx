"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  reverse?: boolean;
  /** Seconds for one full pass. */
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless horizontal loop.
 *
 * The children are rendered as two identical halves and the track shifts by
 * exactly -50%. Each half carries its own trailing gap (`pr-*` matching `gap-*`)
 * so both halves are the same width and the seam lands on an identical frame —
 * a gap on the outer track instead would leave a half-gap jump each cycle.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const half = <div className="flex shrink-0 items-center gap-4 pr-4">{children}</div>;

  return (
    <div className={cn("group mask-fade-edges w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {half}
        <div aria-hidden>{half}</div>
      </div>
    </div>
  );
}
