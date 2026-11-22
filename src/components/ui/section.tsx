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
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
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
      {/* The eyebrow is the section's name in the navigation, so a reader who
          jumped here from the nav sees the word they clicked. */}
      <motion.p variants={fadeUp} className="text-ink-subtle flex items-center gap-3 text-sm">
        <span className="bg-accent h-px w-6" aria-hidden />
        {eyebrow}
      </motion.p>

      <motion.h2
        variants={fadeUp}
        className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-semibold"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p variants={fadeUp} className="prose-serif max-w-[62ch]">
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
