"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { SITE } from "@/constants/site";

const SESSION_KEY = "portfolio:intro-played";
const DURATION_MS = 1500;

const noopSubscribe = () => () => {};

/**
 * Decided once, at hydration: play the intro only on the first visit of a
 * session, and never under reduced-motion. Read through `useSyncExternalStore`
 * so the server renders nothing and the client makes the call in the same pass.
 */
function useShouldPlayIntro() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () =>
      !sessionStorage.getItem(SESSION_KEY) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** First-visit intro curtain. A loader that reappears on every navigation is an obstacle. */
export function PageLoader() {
  const shouldPlay = useShouldPlayIntro();
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (!shouldPlay || finished) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setFinished(true);
      document.body.style.overflow = "";
    }, DURATION_MS);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [shouldPlay, finished]);

  return (
    <AnimatePresence>
      {shouldPlay && !finished && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="bg-canvas fixed inset-0 z-[99] grid place-items-center"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="from-accent to-iris text-accent-ink font-display grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-lg font-bold shadow-[0_12px_40px_-12px_var(--accent)]"
            >
              {SITE.initials}
            </motion.span>

            <div className="bg-line h-px w-40 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: DURATION_MS / 1000, ease: EASE }}
                className="from-accent to-cyan h-full w-full bg-gradient-to-r"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
