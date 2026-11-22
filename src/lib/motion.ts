import type { Transition, Variants } from "framer-motion";

/** Shared easing curve so every surface decelerates the same way. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const springSoft: Transition = { type: "spring", stiffness: 140, damping: 20, mass: 0.6 };
export const springSnappy: Transition = { type: "spring", stiffness: 320, damping: 30 };

/**
 * Standard scroll-reveal. Deliberately quiet — a short settle rather than a
 * blur-and-slide, so the page reads as content arriving, not as an effect.
 */
export const fadeUp: Variants = {
  // Visible by default: a reveal that fails to fire must never hide content.
  hidden: { opacity: 1, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Per-character reveal for the hero headline. */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotateX: -45 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

/** Viewport config shared by every scroll reveal — fires once, slightly early. */
export const viewportOnce = { once: true, margin: "-80px 0px -80px 0px" } as const;
