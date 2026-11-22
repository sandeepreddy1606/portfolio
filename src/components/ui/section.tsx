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
  /** Small section label shown above the heading. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Section title in signage type, with an optional small label above it.
 */
export function SectionHeading({
  eyebrow,
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
      {eyebrow && (
        <p className="text-brass flex items-center gap-3 text-sm font-semibold">
          <span className="bg-accent h-px w-6" aria-hidden />
          {eyebrow}
        </p>
      )}
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
