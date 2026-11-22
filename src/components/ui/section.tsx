"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";

type SectionProps = React.ComponentProps<"section"> & {
  /** Anchor target for the nav scroll-spy. */
  id: string;
};

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt clears the fixed navbar when jumping to an anchor.
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
      {...props}
    >
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Section title in signage type. No eyebrow label above it: the heading names
 * the section by itself, and the nav uses the same words.
 */
export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <h2 className="max-w-4xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-extrabold uppercase">
        {title}
      </h2>
      {description && <p className="prose-lead text-ink-muted max-w-[62ch]">{description}</p>}
    </div>
  );
}

/** Drop-in scroll reveal for anything that does not need its own variants. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
