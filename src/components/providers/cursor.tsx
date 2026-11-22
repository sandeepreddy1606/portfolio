"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerFine, useReducedMotion } from "@/hooks/use-media-query";

/**
 * Custom cursor: a precise dot plus a lagging ring that swells over interactive
 * elements. Desktop-only, and positioned via direct transform writes inside a
 * single rAF rather than React state, so pointer movement never triggers a render.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);

      const el = event.target as HTMLElement | null;
      setActive(Boolean(el?.closest("a, button, [role='button'], input, textarea, [data-cursor]")));
    };

    const loop = () => {
      // Ring eases toward the pointer; the dot tracks it exactly.
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", () => setVisible(false));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="bg-accent fixed top-0 left-0 size-1.5 rounded-full transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="border-accent/50 fixed top-0 left-0 rounded-full border transition-[width,height,opacity,background-color] duration-300 ease-[var(--ease-out-expo)]"
        style={{
          width: active ? 44 : 28,
          height: active ? 44 : 28,
          opacity: visible ? 1 : 0,
          backgroundColor: active ? "var(--accent-soft)" : "transparent",
        }}
      />
    </div>
  );
}
