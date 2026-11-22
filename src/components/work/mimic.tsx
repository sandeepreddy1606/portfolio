"use client";

import * as React from "react";
import {
  animate,
  motion,
  transform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { FlowNode } from "@/constants/case-studies";
import { cn } from "@/lib/utils";

/**
 * A mimic diagram — the track drawing on a signal-box panel — of a system's
 * data flow, with a train that runs it.
 *
 * Stations are steps; guards are signals that sit at danger until the train
 * passes; the action's stretch of track lights amber. Two ways to drive it:
 *
 *   mode="run"   — the train runs once when the panel comes into view
 *                  (case studies). `holdAt` stops it at a guard until the
 *                  visitor pulls the lever.
 *   mode="scrub" — the train's position follows the page scroll through the
 *                  panel, forwards and backwards (the Work section). Signals
 *                  clear as it passes and return to danger if it backs up.
 *
 * The train moves on a MotionValue (transform only); React re-renders only
 * when it crosses a station. Reduced motion: no movement, final state shown.
 */

type Props = {
  nodes: FlowNode[];
  mode?: "run" | "scrub";
  /** Node id of a guard the train must wait at for the visitor's approval (run mode). */
  holdAt?: string;
  caption?: string;
  /** Show the train-describer readout above the track. */
  describer?: boolean;
  className?: string;
};

const STEP_S = 0.55;

export function Mimic({
  nodes,
  mode = "run",
  holdAt,
  caption,
  describer = true,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const figureRef = React.useRef<HTMLElement>(null);
  const slotRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const last = nodes.length - 1;

  // Continuous position along the route: -1 = not yet arrived, 0..last = at a station.
  const progress = useMotionValue(-1);
  const [pos, setPos] = React.useState(-1);
  useMotionValueEvent(progress, "change", (v) => {
    const at = Math.floor(v + 0.05);
    setPos((p) => (p === at ? p : at));
  });

  /* ---------------- run mode ---------------- */
  const [approved, setApproved] = React.useState(!holdAt);
  const holdIndex = holdAt ? nodes.findIndex((n) => n.id === holdAt) : -1;
  const stopAt = !approved && holdIndex > 0 ? holdIndex - 1 : last;
  const [started, setStarted] = React.useState(false);
  const [runKey, setRunKey] = React.useState(0);

  React.useEffect(() => {
    if (mode !== "run") return;
    const el = figureRef.current;
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
  }, [mode]);

  React.useEffect(() => {
    if (mode !== "run" || !started) return;
    if (reduce) {
      progress.set(stopAt);
      return;
    }
    const from = Math.max(progress.get(), -1);
    const controls = animate(progress, stopAt, {
      duration: Math.max(0.4, (stopAt - from) * STEP_S),
      ease: [0.45, 0, 0.25, 1],
      delay: from < 0 ? 0.25 : 0,
    });
    return () => controls.stop();
  }, [mode, started, stopAt, reduce, progress, runKey]);

  /* ---------------- scrub mode ---------------- */
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start 90%", "end 30%"],
  });

  // Scroll → route position, with a dwell at every station: a short stop at
  // ordinary stations and a longer one at guards, so the train is visibly
  // checked before it clears.
  const keyframes = React.useMemo(() => {
    const input = [0];
    const output = [-1];
    let acc = 0;
    nodes.forEach((n, i) => {
      acc += 1;
      input.push(acc);
      output.push(i);
      acc += n.kind === "guard" ? 0.9 : 0.25;
      input.push(acc);
      output.push(i);
    });
    return { input: input.map((x) => x / acc), output };
  }, [nodes]);

  const tweening = React.useRef(false);
  const scrubTarget = React.useCallback(
    (v: number) => {
      if (reduce) return holdIndex > 0 && !approved ? holdIndex - 1 : last;
      const p = transform(v, keyframes.input, keyframes.output);
      // Held at danger: the train waits just short of the signal.
      return holdIndex > 0 && !approved ? Math.min(p, holdIndex - 0.35) : p;
    },
    [reduce, keyframes, holdIndex, approved, last],
  );
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (mode !== "scrub" || tweening.current) return;
    progress.set(scrubTarget(v));
  });
  React.useEffect(() => {
    if (mode !== "scrub" || tweening.current) return;
    // Place the train for the current scroll position on mount, before any scroll event.
    progress.set(scrubTarget(scrollYProgress.get()));
  }, [mode, scrubTarget, progress, scrollYProgress]);

  const approve = () => {
    setApproved(true);
    if (mode !== "scrub") return;
    // Release the train smoothly to wherever the scroll says it should be.
    const target = transform(scrollYProgress.get(), keyframes.input, keyframes.output);
    tweening.current = true;
    animate(progress, Math.max(target, holdIndex), {
      duration: reduce ? 0 : 0.8,
      ease: [0.45, 0, 0.25, 1],
      onComplete: () => {
        tweening.current = false;
      },
    });
  };

  /* ---------------- station geometry ---------------- */
  const [centers, setCenters] = React.useState<{ x: number; y: number }[]>([]);
  React.useLayoutEffect(() => {
    const fig = figureRef.current;
    if (!fig) return;
    const measure = () => {
      const box = fig.getBoundingClientRect();
      setCenters(
        slotRefs.current.map((el) => {
          const r = el?.getBoundingClientRect();
          return r
            ? { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }
            : { x: 0, y: 0 };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(fig);
    return () => ro.disconnect();
  }, [nodes.length]);

  const held = holdIndex > 0 && !approved && pos >= holdIndex - 1;
  const done = pos >= last;
  const vertical =
    centers.length > 1 &&
    Math.abs(centers[1].y - centers[0].y) > Math.abs(centers[1].x - centers[0].x);

  return (
    <figure ref={figureRef} className={cn("relative min-w-0", className)}>
      {describer && (
        // Train describer: the signal box's readout of where the train is.
        <p className="mb-4 flex items-center justify-between gap-4 rounded-md bg-[#141b18] px-3 py-2 font-mono text-xs uppercase">
          <span className="text-lamp-amber shrink-0 tabular-nums">
            {pos < 0 ? "Approaching" : `Station ${Math.min(pos, last) + 1} of ${nodes.length}`}
          </span>
          <span className={cn("truncate text-right", held ? "text-danger" : "text-ink")}>
            {pos < 0
              ? `Next: ${nodes[0].label}`
              : held
                ? `Held at danger · ${nodes[holdIndex].label}`
                : `${nodes[Math.min(pos, last)].label}${nodes[Math.min(pos, last)].kind === "guard" ? " · cleared" : ""}`}
          </span>
        </p>
      )}
      <ol
        className="relative flex flex-col md:flex-row md:items-start"
        aria-label={`Data flow: ${nodes.map((n) => n.label).join(", then ")}`}
      >
        {nodes.map((node, i) => {
          const reached = pos >= i;
          const cleared = node.kind === "guard" && pos >= i;
          return (
            <li key={node.id} className="flex min-w-0 flex-1 md:flex-col">
              <div className="flex flex-col items-center md:w-full md:flex-row">
                <Rail visible={i > 0} lit={reached} amber={node.kind === "action" && reached} />
                <span
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  className="relative z-10 grid h-11 w-11 shrink-0 place-items-center"
                >
                  <Marker
                    kind={node.kind}
                    cleared={cleared}
                    occupied={pos === i}
                    held={held && i === holdIndex}
                  />
                </span>
                <Rail
                  visible={i < last}
                  lit={pos > i}
                  amber={nodes[i + 1]?.kind === "action" && pos > i}
                />
              </div>
              <div className="min-w-0 self-center py-3 pl-4 md:self-auto md:px-2 md:text-center">
                <p
                  className={cn(
                    "text-[15px] leading-snug font-semibold transition-colors duration-300",
                    node.kind === "action"
                      ? "text-accent"
                      : reached
                        ? "text-ink"
                        : "text-ink-muted",
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

      {centers.length === nodes.length && (
        <Train progress={progress} centers={centers} vertical={vertical} />
      )}

      {holdAt && (
        <div className="border-line mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
          <button
            type="button"
            disabled={!held}
            onClick={approve}
            className="bg-lamp-green rounded-md px-4 py-2.5 text-sm font-bold text-[#06170d] transition-opacity disabled:opacity-30"
          >
            Pull lever: approve
          </button>
          {/* Replay only makes sense when time drives the train, not the scroll. */}
          {done && mode === "run" && (
            <button
              type="button"
              onClick={() => {
                setApproved(false);
                progress.set(-1);
                setRunKey((k) => k + 1);
              }}
              className="border-line-strong hover:border-ink rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              Send another post
            </button>
          )}
          <p className="text-ink-muted text-sm" aria-live="polite">
            {pos < 0 &&
              (mode === "scrub" ? "Scroll to bring a post down the line." : "Waiting for a post.")}
            {pos >= 0 && !held && !approved && "Parsing with rules — no model in the path."}
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

/** A stretch of rail on sleepers: the sleepers are always there, the rail lights up. */
function Rail({ visible, lit, amber }: { visible: boolean; lit: boolean; amber: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative min-h-[22px] w-3.5 flex-1 md:h-3.5 md:min-h-0 md:w-auto",
        !visible && "invisible",
        // Sleepers: short cross-ties at a regular pitch, from the real object.
        "bg-[repeating-linear-gradient(0deg,rgb(236_231_214/0.16)_0_2px,transparent_2px_9px)] md:bg-[repeating-linear-gradient(90deg,rgb(236_231_214/0.16)_0_2px,transparent_2px_9px)]",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 transition-colors duration-300 md:inset-x-0 md:top-1/2 md:left-0 md:h-1.5 md:w-auto md:translate-x-0 md:-translate-y-1/2",
          lit ? (amber ? "bg-lamp-amber" : "bg-ink") : "bg-ink/25",
        )}
      />
    </span>
  );
}

/** The train: an amber locomotive with a headlamp, interpolated between stations. */
function Train({
  progress,
  centers,
  vertical,
}: {
  progress: MotionValue<number>;
  centers: { x: number; y: number }[];
  vertical: boolean;
}) {
  const at = (v: number, axis: "x" | "y") => {
    const last = centers.length - 1;
    if (v <= 0) {
      // Approaching the first station from off-panel.
      const gap = centers.length > 1 ? centers[1][axis] - centers[0][axis] : 60;
      return centers[0][axis] + Math.max(v, -1) * gap * 0.6;
    }
    if (v >= last) return centers[last][axis];
    const i = Math.floor(v);
    const t = v - i;
    return centers[i][axis] + (centers[i + 1][axis] - centers[i][axis]) * t;
  };
  const x = useTransform(progress, (v) => at(v, "x"));
  const y = useTransform(progress, (v) => at(v, "y"));
  const opacity = useTransform(progress, [-1, -0.55, -0.2], [0, 0, 1]);

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-20"
      style={{ x, y, opacity }}
    >
      <span
        className={cn(
          "bg-lamp-amber relative flex items-center justify-around rounded-[4px] shadow-[0_3px_8px_-2px_rgb(0_0_0/0.6)]",
          vertical
            ? "-mt-[17px] -ml-[7px] h-[34px] w-3.5 flex-col"
            : "-mt-[7px] -ml-[17px] h-3.5 w-[34px]",
        )}
      >
        <span className="size-1.5 rounded-[1px] bg-[#1b1405]/70" />
        <span className="size-1.5 rounded-[1px] bg-[#1b1405]/70" />
        {/* Headlamp, at the leading end. */}
        <span
          className={cn(
            "absolute size-1.5 rounded-full bg-[#fff6d8] shadow-[0_0_8px_3px_rgb(255_240_190/0.7)]",
            vertical
              ? "-bottom-0.5 left-1/2 -translate-x-1/2"
              : "top-1/2 -right-0.5 -translate-y-1/2",
          )}
        />
      </span>
    </motion.span>
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
            "size-3.5 rounded-full transition-[background-color,box-shadow] duration-200",
            cleared ? "bg-lamp-red/15" : "bg-lamp-red shadow-[0_0_10px_2px_rgb(227_64_45/0.45)]",
            held && "animate-pulse",
          )}
        />
        <span
          className={cn(
            "size-3.5 rounded-full transition-[background-color,box-shadow] duration-200",
            cleared
              ? "bg-lamp-green shadow-[0_0_10px_2px_rgb(76_194_122/0.5)]"
              : "bg-lamp-green/15",
          )}
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 shrink-0 place-items-center border-2 transition-[background-color,transform] duration-300",
        kind === "action" ? "border-accent" : "border-ink",
        kind === "store" ? "rounded-sm" : "rounded-full",
        occupied
          ? kind === "action"
            ? "bg-accent scale-110"
            : "bg-ink scale-110"
          : "bg-surface-2",
      )}
    />
  );
}
