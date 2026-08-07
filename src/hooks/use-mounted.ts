"use client";

import { useSyncExternalStore } from "react";

/** Never fires — mounted-ness flips exactly once, at hydration. */
const noopSubscribe = () => () => {};

/**
 * `false` during SSR and the first render, `true` afterwards.
 *
 * Uses `useSyncExternalStore` rather than a `setState` in an effect so the
 * transition happens as part of hydration instead of a cascading second render.
 */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
