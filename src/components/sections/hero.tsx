import { Suspense } from "react";
import { Download } from "lucide-react";
import { SITE, SOCIALS } from "@/constants/site";
import { CopyEmail } from "@/components/ui/copy-email";
import { HeroPortrait } from "./hero-portrait";
import { NowStrip, NowStripSkeleton } from "./now-strip";

/**
 * First viewport: the claim in signage type beside the portrait-as-signal-lamp,
 * the one-paragraph explanation, the ways to act on it, and a live strip of
 * what's true right now.
 */
export function Hero() {
  return (
    <section id="hero" className="relative pt-24 pb-14 sm:pt-28 sm:pb-16">
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-12">
          <div className="min-w-0">
            <h1 className="flex flex-col gap-4">
              <span className="text-ink-muted font-sans text-lg font-medium tracking-normal normal-case">
                {SITE.name}, full-stack and AI engineer
              </span>
              <span className="rise text-[clamp(3rem,7.2vw,6.25rem)] leading-[0.86] font-extrabold uppercase">
                I build AI systems you can trust to act.
              </span>
            </h1>
            <p
              className="rise prose-lead text-ink-muted mt-7 max-w-[58ch]"
              style={{ animationDelay: "120ms" }}
            >
              Like a railway interlocking: the clever part proposes, a deterministic guard decides,
              and anything that can&apos;t be undone waits for a person. Full-stack engineer across
              Next.js, FastAPI, NestJS and Spring Boot, currently building Velobite.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <a
                href="#register"
                className="bg-accent text-accent-ink rounded-md px-4 py-2.5 font-bold transition-[filter] hover:brightness-110"
              >
                Ask about my work
              </a>
              <a
                href={SITE.resumeUrl}
                download
                className="text-ink hover:text-accent inline-flex items-center gap-2 font-semibold transition-colors"
              >
                <Download className="size-4" /> Résumé
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

          <HeroPortrait />
        </div>

        <div className="rise mt-12" style={{ animationDelay: "240ms" }}>
          <Suspense fallback={<NowStripSkeleton />}>
            <NowStrip />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
