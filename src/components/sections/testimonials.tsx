"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { TESTIMONIALS } from "@/constants/achievements";
import { EASE } from "@/lib/motion";

/**
 * Renders nothing until real, attributable quotes exist in the constants file.
 * A testimonial section with invented quotes is worse than no section at all.
 */
export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  if (TESTIMONIALS.length === 0) return null;

  const paginate = (delta: number) => {
    setDirection(delta);
    setIndex((current) => (current + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const active = TESTIMONIALS[index];

  return (
    <Section id="testimonials" className="bg-surface/20 border-line border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people I've worked with say."
          align="center"
          className="mx-auto items-center"
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="min-h-[18rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -48 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="glass flex flex-col items-center gap-7 rounded-3xl px-7 py-12 text-center sm:px-12"
              >
                <Quote className="text-accent size-7 opacity-60" aria-hidden />
                <blockquote className="text-lg leading-relaxed text-balance sm:text-xl">
                  &ldquo;{active.quote}&rdquo;
                </blockquote>
                <figcaption className="flex flex-col items-center gap-3">
                  <span className="border-line bg-surface-2 font-display grid size-12 place-items-center rounded-full border text-sm font-bold">
                    {active.avatarInitials}
                  </span>
                  <span className="text-sm font-semibold">{active.name}</span>
                  <span className="text-ink-subtle text-xs">
                    {active.role} · {active.company}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {TESTIMONIALS.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous testimonial"
                className="border-line bg-surface/60 text-ink-muted hover:text-ink grid size-10 place-items-center rounded-full border transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
                {TESTIMONIALS.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "bg-accent w-6" : "bg-line-strong w-1.5"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next testimonial"
                className="border-line bg-surface/60 text-ink-muted hover:text-ink grid size-10 place-items-center rounded-full border transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
