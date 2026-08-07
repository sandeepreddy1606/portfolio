"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type SectionProps = React.ComponentProps<"section"> & {
  /** Anchor target for the nav scroll-spy. */
  id: string;
};

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt clears the fixed navbar when jumping to an anchor.
      className={cn("relative scroll-mt-24 py-24 sm:py-32 lg:py-40", className)}
      {...props}
    >
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <span className="bg-accent size-1.5 rounded-full" aria-hidden />
        <span className="text-ink-muted font-mono text-[11px] tracking-[0.22em] uppercase">
          {eyebrow}
        </span>
        <span
          className="via-line h-px w-12 bg-gradient-to-r from-transparent to-transparent"
          aria-hidden
        />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="max-w-3xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUp}
          className="text-ink-muted max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
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
