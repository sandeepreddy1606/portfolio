import { Suspense } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { SITE, SOCIALS } from "@/constants/site";
import { GridBackground } from "@/components/ui/backgrounds";
import { ProfileImage } from "@/components/ui/avatar";
import { AskConsole } from "@/components/ask/ask-console";
import { CopyEmail } from "@/components/ui/copy-email";
import { NowStrip, NowStripSkeleton } from "./now-strip";

/**
 * The hero is the site's one loud moment: a condensed headline that states the
 * argument, and a working assistant directly under it. Everything else on the
 * page is quiet by comparison.
 *
 * Server component — the only client islands are the console and the copy
 * button. The load sequence is CSS (see .rise in globals.css), so the headline
 * paints without waiting for any JavaScript.
 */
export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
      <GridBackground />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          <div className="min-w-0">
            <h1 className="flex flex-col gap-5">
              <span className="rise text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-base font-medium tracking-normal sm:text-lg">
                {SITE.name}
                <span className="text-ink-subtle font-normal">{SITE.role}</span>
              </span>
              <span
                className="rise text-[clamp(2.75rem,9.5vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.02em]"
                style={{
                  fontVariationSettings: '"wdth" 84, "opsz" 96',
                  animationDelay: "80ms",
                }}
              >
                I build AI systems you can trust to act.
              </span>
            </h1>

            <p
              className="rise prose-serif mt-8 max-w-[58ch] text-[1.25rem] sm:text-[1.375rem]"
              style={{ animationDelay: "200ms" }}
            >
              Full-stack engineer working across Next.js, FastAPI, NestJS and Spring Boot. I put
              deterministic logic wherever an action can&apos;t be undone, and a model only where
              being approximately right is good enough. Right now I&apos;m building{" "}
              <Link href="/work/velobite" className="text-ink underline-offset-4 hover:underline">
                Velobite
              </Link>
              , a food-delivery platform run as four products.
            </p>

            <div className="rise mt-10 max-w-2xl" style={{ animationDelay: "320ms" }}>
              <AskConsole />
            </div>

            <div
              className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
              style={{ animationDelay: "420ms" }}
            >
              <a
                href={SITE.resumeUrl}
                download
                className="text-ink hover:text-accent inline-flex items-center gap-2 font-medium transition-colors"
              >
                <Download className="size-4" /> Download résumé
              </a>
              <CopyEmail />
              <ul className="flex items-center gap-1">
                {SOCIALS.filter((s) => s.label !== "Email").map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-ink-muted hover:text-ink grid size-9 place-items-center rounded-md transition-colors"
                    >
                      <social.icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside
            className="rise flex flex-row items-start gap-5 lg:flex-col"
            style={{ animationDelay: "260ms" }}
            aria-label="At a glance"
          >
            <div className="border-line-strong relative aspect-square w-24 shrink-0 overflow-hidden rounded-full border sm:w-32 lg:w-48">
              <ProfileImage priority sizes="(max-width: 1024px) 9rem, 15rem" />
            </div>
            <Suspense fallback={<NowStripSkeleton />}>
              <NowStrip />
            </Suspense>
          </aside>
        </div>
      </div>
    </section>
  );
}
