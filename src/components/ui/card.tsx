"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = React.ComponentProps<"div"> & {
  /** Brass edge on hover. */
  glow?: boolean;
};

/**
 * Base surface for every card: an instrument plate — solid face, firm edge,
 * and a brass edge on hover. Works on either face (panel or enamel).
 */
export function SpotlightCard({ className, glow = true, children, ...props }: SpotlightCardProps) {
  return (
    <div
      className={cn(
        "group border-line-strong bg-elevated relative overflow-hidden rounded-[14px] border",
        "shadow-[0_14px_28px_-22px_rgb(0_0_0/0.55)] transition-[border-color] duration-300",
        glow && "hover:border-brass",
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
