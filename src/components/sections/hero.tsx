import { Suspense } from "react";
import { Download } from "lucide-react";
import { SITE, SOCIALS } from "@/constants/site";
import { getCaseStudy } from "@/constants/case-studies";
import { ProfileImage } from "@/components/ui/avatar";
import { CopyEmail } from "@/components/ui/copy-email";
import { Mimic } from "@/components/work/mimic";
import { NowStrip, NowStripSkeleton } from "./now-strip";

/**
 * First viewport: the claim in signage type, and the proof directly under it —
 * Auto Apply on a signal-box panel, stopped at danger until the visitor pulls
 * the lever. The visitor plays the human in the loop the headline promises.
 */
export function Hero() {
  const autoApply = getCaseStudy("auto-apply")!;

  return (
    <section id="hero" className="relative pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-14">
          <div className="min-w-0">
            <h1 className="flex flex-col gap-4">
              <span className="text-ink-muted font-sans text-lg font-medium tracking-normal normal-case">
                {SITE.name}, full-stack and AI engineer
              </span>
              <span className="rise text-[clamp(3.25rem,10vw,7.5rem)] leading-[0.86] font-extrabold uppercase">
                I build AI systems you can trust to act.
              </span>
            </h1>
            <p
              className="rise prose-lead text-ink-muted mt-7 max-w-[60ch]"
              style={{ animationDelay: "120ms" }}
            >
              Like a railway interlocking: the clever part proposes, a deterministic guard decides,
              and anything that can&apos;t be undone waits for a person. The panel below is my
              job-application agent. You&apos;re the signalman.
            </p>
          </div>

          <aside
            className="rise flex items-start gap-5 lg:flex-col"
            style={{ animationDelay: "200ms" }}
            aria-label="At a glance"
          >
            <div className="border-brass relative aspect-square w-24 shrink-0 overflow-hidden rounded-full border-4 sm:w-28 lg:w-full">
              <ProfileImage priority sizes="(max-width: 1024px) 7rem, 14rem" />
            </div>
            <Suspense fallback={<NowStripSkeleton />}>
              <NowStrip />
            </Suspense>
          </aside>
        </div>

        <div
          className="rise border-brass/50 bg-surface-2 mt-12 rounded-[14px] border p-5 sm:p-7"
          style={{ animationDelay: "260ms" }}
        >
          <p className="border-brass/60 text-brass font-display mb-5 inline-block rounded-sm border-2 px-3 py-1 text-lg font-bold uppercase">
            Auto Apply — live panel
          </p>
          <Mimic nodes={autoApply.flow} holdAt="review" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
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
    </section>
  );
}
