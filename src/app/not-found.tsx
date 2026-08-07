import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBackground, GridBackground } from "@/components/ui/backgrounds";
import { NAV_ITEMS } from "@/constants/site";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-32">
      <AuroraBackground />
      <GridBackground />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <span className="border-line bg-surface/50 text-ink-muted inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs backdrop-blur-md">
          <Compass className="size-3.5" /> Lost in the stack
        </span>

        <p className="font-display from-ink to-ink-subtle mt-8 bg-gradient-to-b bg-clip-text text-[7rem] leading-none font-bold tracking-tighter text-transparent sm:text-[9rem]">
          404
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          This route was never deployed.
        </h1>
        <p className="text-ink-muted mt-4 text-sm leading-relaxed">
          The page you asked for does not exist — or it moved somewhere more sensible. Here is the
          way back.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/">
              <ArrowLeft /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#work">See the work</Link>
          </Button>
        </div>

        <nav aria-label="Site sections" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-subtle hover:text-ink text-xs transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
