import { cn } from "@/lib/utils";

/**
 * Drafting-paper grid. The only ambient background on the site: it says
 * "engineering drawing" and then gets out of the way. Masked so the lines
 * dissolve toward the edges instead of ending at a hard border.
 */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("grid-bg pointer-events-none absolute inset-0", className)}
      style={{
        maskImage: "radial-gradient(ellipse 80% 60% at 30% 30%, #000 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 30% 30%, #000 30%, transparent 100%)",
      }}
    />
  );
}
