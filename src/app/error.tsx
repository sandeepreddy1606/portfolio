"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for a real reporter (Sentry et al.) when one is wired up.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="grid min-h-[100svh] place-items-center px-5 py-32">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="border-line bg-surface/50 grid size-14 place-items-center rounded-2xl border text-amber-500">
          <AlertTriangle className="size-6" />
        </span>

        <h1 className="mt-7 text-2xl font-semibold tracking-tight">Something broke on our side.</h1>
        <p className="text-ink-muted mt-3 text-sm leading-relaxed">
          An unexpected error interrupted this page. Retrying usually resolves it.
        </p>

        {error.digest && (
          <code className="border-line bg-surface-2 text-ink-subtle mt-5 rounded-lg border px-3 py-1.5 font-mono text-[11px]">
            {error.digest}
          </code>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} variant="accent">
            <RotateCcw /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
