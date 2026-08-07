"use client";

import { useCallback, useRef } from "react";

/**
 * Feeds cursor position into the `--mx` / `--my` custom properties consumed by
 * the `spotlight` utility. Writes are batched into a rAF so a fast pointer
 * cannot queue more style mutations than the compositor can flush.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);

  const onMouseMove = useCallback((event: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el || frame.current !== null) return;

    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }, []);

  return { ref, onMouseMove };
}
