"use client";

import * as React from "react";
import type { FlowNode } from "@/constants/case-studies";
import { cn } from "@/lib/utils";

/**
 * A mimic diagram — the track drawing on a signal-box panel — of a system's
 * data flow. Stations are steps; guards are signals that sit at danger until
 * the train is allowed past; the action's stretch of track lights amber when
 * occupied. Lamps carry the meaning, so the legend is the same everywhere.
 *
 * `holdAt` stops the train at that guard until the visitor pulls the lever:
 * the hero uses it to make the visitor the human in the loop.
 */

type Props = {
  nodes: FlowNode[];
  /** Node id of a guard the train must wait at for the visitor's approval. */
  holdAt?: string;
  caption?: string;
  className?: string;
};

const STEP_MS = 520;

export function Mimic({ nodes, holdAt, caption, className }: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  // Index of the station the train has reached; -1 before it enters.
  const [pos, setPos] = React.useState(-1);
  const [approved, setApproved] = React.useState(!holdAt);
  const holdIndex = holdAt ? nodes.findIndex((n) => n.id === holdAt) : -1;
  const stopAt = !approved && holdIndex > 0 ? holdIndex - 1 : nodes.length - 1;
  const [started, setStarted] = React.useState(false);

  // Start once, when the panel is on screen. Reduced motion: no run, every
  // guard shown cleared — except an interactive hold, which stays the
  // visitor's decision.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!started) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pos >= stopAt) return;
    const t = window.setTimeout(
      () => setPos(reduce ? stopAt : pos + 1),
      reduce ? 0 : pos < 0 ? 300 : STEP_MS,
    );
    return () => window.clearTimeout(t);
  }, [started, pos, stopAt]);

  const held = holdIndex > 0 && !approved && pos >= holdIndex - 1;
  const done = pos >= nodes.length - 1;

  return (
    <figure ref={rootRef} className={cn("min-w-0", className)}>
      <ol
        className="flex flex-col md:flex-row md:items-start"
        aria-label={`Data flow: ${nodes.map((n) => n.label).join(", then ")}`}
      >
        {nodes.map((node, i) => {
          const reached = pos >= i;
          // A guard clears when the train is allowed through it.
          const cleared =
            node.kind === "guard" && (pos >= i || (i === holdIndex && approved && pos >= i - 1));
          const occupied = pos === i || (node.kind === "action" && reached);
          return (
            <li key={node.id} className="flex min-w-0 flex-1 md:flex-col">
              {/* Track + marker row (column on phones). */}
              <div className="flex flex-col items-center md:w-full md:flex-row">
                <span
                  aria-hidden
                  className={cn(
                    "min-h-[18px] w-1.5 flex-1 transition-colors duration-300 md:h-1.5 md:min-h-0 md:w-auto",
                    i === 0
                      ? "invisible"
                      : reached
                        ? node.kind === "action"
                          ? "bg-accent"
                          : "bg-ink"
                        : "bg-ink/25",
                  )}
                />
                {/* Fixed slot so a tall signal head and a small station dot
                    keep the track on one line. */}
                <span className="grid h-11 w-11 shrink-0 place-items-center">
                  <Marker
                    kind={node.kind}
                    cleared={cleared}
                    occupied={occupied}
                    held={held && i === holdIndex}
                  />
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "min-h-[18px] w-1.5 flex-1 transition-colors duration-300 md:h-1.5 md:min-h-0 md:w-auto",
                    i === nodes.length - 1 ? "invisible" : pos > i ? "bg-ink" : "bg-ink/25",
                  )}
                />
              </div>
              <div className="min-w-0 py-3 pl-4 md:px-2 md:text-center">
                <p
                  className={cn(
                    "text-[15px] leading-snug font-semibold",
                    node.kind === "action" && "text-accent",
                  )}
                >
                  {node.label}
                </p>
                {node.note && (
                  <p className="text-ink-subtle mt-1 text-[13px] leading-snug">{node.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {holdAt && (
        <div className="border-line mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
          <button
            type="button"
            disabled={!held}
            onClick={() => setApproved(true)}
            className="bg-lamp-green rounded-md px-4 py-2.5 text-sm font-bold text-[#06170d] transition-opacity disabled:opacity-30"
          >
            Pull lever: approve
          </button>
          {done && (
            <button
              type="button"
              onClick={() => {
                setApproved(false);
                setPos(-1);
              }}
              className="border-line-strong hover:border-ink rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              Send another post
            </button>
          )}
          <p className="text-ink-muted text-sm" aria-live="polite">
            {pos < 0 && "Waiting for a post."}
            {pos >= 0 &&
              !held &&
              !done &&
              !approved &&
              "Parsing with rules — no model in the path."}
            {held && "Held at danger. Nothing is sent until a person approves."}
            {approved && !done && pos >= 0 && "Route set by a person. Sending."}
            {done && approved && "Sent, and logged as applied."}
          </p>
        </div>
      )}

      {caption && (
        <figcaption className="text-ink-muted mt-4 max-w-[62ch] text-sm">{caption}</figcaption>
      )}
    </figure>
  );
}

function Marker({
  kind,
  cleared,
  occupied,
  held,
}: {
  kind: FlowNode["kind"];
  cleared: boolean;
  occupied: boolean;
  held: boolean;
}) {
  if (kind === "guard") {
    return (
      <span
        className="border-ink bg-surface-2 flex shrink-0 flex-col items-center gap-1 rounded-md border-2 px-1.5 py-1.5"
        role="img"
        aria-label={cleared ? "Signal cleared" : "Signal at danger"}
      >
        <span
          className={cn(
            "size-3.5 rounded-full transition-colors duration-200",
            cleared ? "bg-lamp-red/15" : "bg-lamp-red",
            held && "shadow-[0_0_0_4px_rgb(227_64_45/0.25)]",
          )}
        />
        <span
          className={cn(
            "size-3.5 rounded-full transition-colors duration-200",
            cleared ? "bg-lamp-green" : "bg-lamp-green/15",
          )}
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 shrink-0 place-items-center border-2 transition-colors duration-300",
        kind === "action" ? "border-accent" : "border-ink",
        kind === "store" ? "rounded-sm" : "rounded-full",
        occupied ? (kind === "action" ? "bg-accent" : "bg-ink") : "bg-transparent",
      )}
    />
  );
}
