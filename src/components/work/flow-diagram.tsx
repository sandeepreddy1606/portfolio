"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Database,
  LogIn,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { FlowNode, FlowNodeKind } from "@/constants/case-studies";
import { cn } from "@/lib/utils";

/**
 * A project's data flow as a left-to-right drawing (top-to-bottom on phones).
 *
 * Colour is the legend, not decoration: teal nodes are guards that can stop
 * the flow, amber nodes are the steps with consequences outside the system.
 * Reading the colours alone tells you where the safety sits.
 */

const KIND: Record<FlowNodeKind, { icon?: LucideIcon; box: string; label: string; name: string }> =
  {
    source: {
      icon: LogIn,
      box: "border-line-strong border-dashed",
      label: "text-ink",
      name: "Input",
    },
    step: { box: "border-line-strong", label: "text-ink", name: "Step" },
    guard: {
      icon: ShieldCheck,
      box: "border-verify bg-verify-soft",
      label: "text-verify",
      name: "Guard",
    },
    action: {
      icon: Zap,
      box: "border-accent bg-accent-soft",
      label: "text-accent",
      name: "Action",
    },
    store: {
      icon: Database,
      box: "border-line-strong bg-surface-2/60",
      label: "text-ink",
      name: "Stored state",
    },
  };

export function FlowDiagram({
  nodes,
  caption,
  compact = false,
  className,
}: {
  nodes: FlowNode[];
  caption?: string;
  compact?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const step = reduce ? 0 : 0.14;

  return (
    <figure className={cn("min-w-0", className)}>
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className={cn(
          "flex flex-col items-stretch gap-1",
          compact ? "sm:flex-row sm:items-center" : "lg:flex-row lg:items-stretch",
        )}
        aria-label="Data flow"
      >
        {nodes.map((node, i) => {
          const k = KIND[node.kind];
          const Icon = k.icon;
          return (
            <li key={node.id} className={cn("contents")}>
              <motion.div
                variants={{
                  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * step, duration: 0.35 } },
                }}
                className={cn(
                  "flex min-w-0 flex-1 flex-col justify-center rounded-md border",
                  k.box,
                  compact ? "px-2.5 py-2" : "px-3.5 py-3",
                )}
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5 font-mono leading-tight",
                    k.label,
                    compact ? "text-[11px]" : "text-[13px]",
                  )}
                >
                  {Icon && <Icon className="size-3.5 shrink-0" aria-hidden />}
                  <span className="min-w-0 [overflow-wrap:anywhere]">{node.label}</span>
                  <span className="sr-only">({k.name})</span>
                </span>
                {!compact && node.note && (
                  <span className="text-ink-subtle mt-1 text-xs leading-snug">{node.note}</span>
                )}
              </motion.div>

              {i < nodes.length - 1 && (
                <motion.span
                  aria-hidden
                  variants={{
                    hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.4 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { delay: i * step + step / 2, duration: 0.3 },
                    },
                  }}
                  className={cn(
                    "text-ink-subtle grid shrink-0 place-items-center",
                    compact ? "h-4 sm:h-auto sm:w-4" : "h-5 lg:h-auto lg:w-6",
                  )}
                >
                  <ArrowDown className={cn("size-3.5", compact ? "sm:hidden" : "lg:hidden")} />
                  <ArrowRight
                    className={cn("hidden size-3.5", compact ? "sm:block" : "lg:block")}
                  />
                </motion.span>
              )}
            </li>
          );
        })}
      </motion.ol>

      {!compact && (
        <figcaption className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {caption && <span className="text-ink-muted max-w-[60ch] text-sm">{caption}</span>}
          <span className="text-ink-subtle flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-xs">
            <Legend kind="guard" />
            <Legend kind="action" />
            <Legend kind="store" />
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function Legend({ kind }: { kind: FlowNodeKind }) {
  const k = KIND[kind];
  const Icon = k.icon!;
  return (
    <span className={cn("inline-flex items-center gap-1.5", k.label)}>
      <Icon className="size-3" aria-hidden />
      <span className="text-ink-subtle">
        {kind === "guard"
          ? "can stop the flow"
          : kind === "action"
            ? "acts in the world"
            : "stored state"}
      </span>
    </span>
  );
}
