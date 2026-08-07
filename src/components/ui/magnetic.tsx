"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePointerFine, useReducedMotion } from "@/hooks/use-media-query";

type MagneticProps = {
  children: React.ReactNode;
  /** How far the element travels toward the cursor, as a fraction of the offset. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the cursor while hovered. Disabled entirely on coarse
 * pointers and under reduced-motion, where the effect is meaningless or unwanted.
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={enabled ? { x: sx, y: sy } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  max?: number;
};

/** 3D tilt-on-hover wrapper for cards. */
export function Tilt({ children, className, max = 8 }: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 20 });
  const sy = useSpring(py, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        enabled ? { rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 } : undefined
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
