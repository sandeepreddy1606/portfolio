import { ArrowUpRight } from "lucide-react";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { cn } from "@/lib/utils";

/**
 * Achievements as a register: one ruled line each, dated, with the issuer and
 * a link to the evidence where one exists. A table, not a card grid — these
 * are records to scan, not tiles to admire.
 */
export function AchievementList({ className }: { className?: string }) {
  if (ACHIEVEMENTS.length === 0) return null;

  return (
    <ul className={cn("border-line-strong border-t", className)}>
      {ACHIEVEMENTS.map((item) => (
        <li
          key={item.id}
          className="border-line grid gap-2 border-b py-6 md:grid-cols-[9rem_minmax(0,4fr)_minmax(0,6fr)] md:gap-8"
        >
          <p className="text-ink-subtle font-mono text-sm tabular-nums">
            {item.date || (item.kind === "certification" ? "Certified" : "")}
          </p>
          <div>
            <h4 className="font-sans text-lg leading-snug font-bold tracking-normal normal-case">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent inline-flex items-start gap-1 transition-colors"
                >
                  {item.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-60" aria-hidden />
                </a>
              ) : (
                item.title
              )}
            </h4>
            <p className="text-brass mt-1 text-sm font-semibold">{item.issuer}</p>
          </div>
          <p className="text-ink-muted text-[15px] leading-relaxed">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
