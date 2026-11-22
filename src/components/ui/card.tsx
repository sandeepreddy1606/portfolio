"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSpotlight } from "@/hooks/use-spotlight";

type SpotlightCardProps = React.ComponentProps<"div"> & {
  /** Adds the animated conic border on hover. */
  glow?: boolean;
};

/**
 * Base surface for every card in the site: glass fill, hairline border, and a
 * cursor-tracked radial highlight.
 */
export function SpotlightCard({ className, glow = true, children, ...props }: SpotlightCardProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "spotlight group border-line bg-surface/50 relative overflow-hidden rounded-[14px] border",
        "transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
        "hover:border-line-strong hover:shadow-[0_24px_70px_-40px_rgba(0,0,0,0.6)]",
        glow && "border-glow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-6 sm:p-7", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6 sm:px-7 sm:pb-7", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-ink-muted text-sm leading-relaxed", className)} {...props} />;
}
