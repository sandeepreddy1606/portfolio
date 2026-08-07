import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-line bg-surface-2/70 text-ink-muted",
        accent: "border-accent/30 bg-accent-soft text-accent",
        outline: "border-line-strong bg-transparent text-ink-muted",
        mono: "border-line bg-surface-2/70 text-ink-subtle font-mono tracking-tight",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        md: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
