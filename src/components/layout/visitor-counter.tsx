"use client";

import * as React from "react";

/**
 * The visitor count at the end of the line, as an Edmondson ticket stub:
 * how many visitors have come through, and this visitor's own number.
 * Counts once per browser session; renders nothing until storage is set up.
 */

type State = { visitors: number; views: number; you: number | null };

const SESSION_KEY = "sr_counted";
const fmt = new Intl.NumberFormat("en-IN");

export function VisitorCounter() {
  const [state, setState] = React.useState<State | null>(null);

  React.useEffect(() => {
    let counted = false;
    try {
      counted = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked — count anyway; the cookie still prevents double visitors */
    }
    const controller = new AbortController();
    fetch("/api/visits", { method: counted ? "GET" : "POST", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.enabled) return;
        if (!counted) {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
        }
        setState({ visitors: data.visitors, views: data.views, you: data.you ?? null });
      })
      .catch(() => {
        /* offline or aborted: the counter simply doesn't show */
      });
    return () => controller.abort();
  }, []);

  if (!state || state.visitors < 1) return null;

  return (
    <p
      className="text-ink-muted inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
      aria-live="polite"
    >
      <span className="border-brass/60 text-brass rounded-sm border px-2 py-0.5 font-mono text-xs tabular-nums">
        No. {String(state.you ?? state.visitors).padStart(6, "0")}
      </span>
      <span>
        <strong className="text-ink font-semibold tabular-nums">
          {fmt.format(state.visitors)}
        </strong>{" "}
        {state.visitors === 1 ? "visitor" : "visitors"} so far
        {state.you ? (
          <>
            {" "}
            · you&apos;re No. <span className="tabular-nums">{fmt.format(state.you)}</span>
          </>
        ) : null}
      </span>
    </p>
  );
}
