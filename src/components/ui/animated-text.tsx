"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { charReveal, EASE, stagger, viewportOnce } from "@/lib/motion";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** `char` gives the hero its per-letter lift; `word` is cheaper for long copy. */
  by?: "char" | "word";
  as?: "span" | "h1" | "h2" | "h3" | "p";
};

/**
 * Staggered entrance for a line of text. The full string stays in the
 * accessibility tree via `aria-label`; the animated pieces are hidden from it.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  by = "word",
  as = "span",
}: TextRevealProps) {
  const Comp = motion[as];
  const pieces = by === "char" ? [...text] : text.split(" ");

  return (
    <Comp
      aria-label={text}
      variants={stagger(by === "char" ? 0.025 : 0.06, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn("inline-block", className)}
    >
      {pieces.map((piece, index) => (
        <span key={`${piece}-${index}`} aria-hidden className="inline-block overflow-hidden">
          <motion.span variants={charReveal} className="inline-block">
            {piece === " " ? " " : piece}
            {by === "word" && index < pieces.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}

/** Cycles through phrases in place. Used for the hero's rotating role line. */
export function RotatingText({
  phrases,
  interval = 2600,
  className,
}: {
  phrases: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    return () => clearInterval(id);
  }, [interval, phrases.length]);

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {/* Invisible longest phrase reserves the width so nothing reflows mid-cycle. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {phrases.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrases[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Counts up to a value when scrolled into view. */
export function CountUp({
  value,
  duration = 1400,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast arrival, soft landing.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
