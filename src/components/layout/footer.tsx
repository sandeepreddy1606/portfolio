import Link from "next/link";
import { NAV_ITEMS, SITE, SOCIALS } from "@/constants/site";

/**
 * The end of the line: the instrument-face band that closes every page, with
 * the same lever numbering as the top frame so a destination keeps its number.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-2 border-brass/40 border-t">
      <div className="container-page py-16 sm:py-20">
        {/* End of the line: the rail every route runs on, ending at a buffer stop. */}
        <div className="mb-8" aria-hidden>
          <div className="flex items-end">
            <div className="relative h-3.5 flex-1 bg-[repeating-linear-gradient(90deg,rgb(236_231_214/0.18)_0_2px,transparent_2px_10px)]">
              <span className="bg-ink/70 absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2" />
            </div>
            {/* Buffer stop: a beam on two posts, two red lamps on top. */}
            <div className="relative -mb-1 ml-0.5 flex flex-col items-center">
              <div className="mb-1 flex gap-2">
                <span className="bg-lamp-red size-3 rounded-full shadow-[0_0_10px_3px_rgb(227_64_45/0.5)]" />
                <span className="bg-lamp-red size-3 rounded-full shadow-[0_0_10px_3px_rgb(227_64_45/0.5)]" />
              </div>
              <div className="bg-lamp-red h-5 w-14 rounded-sm border-2 border-[#1f2a25] [background-image:repeating-linear-gradient(135deg,#e3402d_0_8px,#ece7d6_8px_16px)]" />
              <div className="flex w-12 justify-between">
                <span className="bg-ink/70 h-4 w-1.5" />
                <span className="bg-ink/70 h-4 w-1.5" />
              </div>
            </div>
          </div>
        </div>
        <p className="font-display mb-14 text-[clamp(2.5rem,7vw,5rem)] font-extrabold uppercase">
          End of the line.{" "}
          <a href="#main" className="text-accent hover:text-lamp-amber transition-colors">
            Back to the start?
          </a>
        </p>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name} — home`}>
              <span className="border-brass text-brass font-display grid size-9 place-items-center rounded-sm border-2 text-base font-extrabold">
                {SITE.initials}
              </span>
              <span className="font-semibold">{SITE.name}</span>
            </Link>
            <p className="text-ink-muted max-w-sm text-[15px] leading-relaxed">{SITE.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal normal-case">
              Levers
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted hover:text-ink text-[15px] transition-colors"
                  >
                    <span className="text-brass mr-2 tabular-nums">{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-ink-subtle font-sans text-sm font-semibold tracking-normal normal-case">
              Elsewhere
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-ink inline-flex items-center gap-2.5 text-[15px] transition-colors"
                  >
                    <s.icon className="size-4" aria-hidden />
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-line mt-14 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-subtle">
            © {year} {SITE.name}. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
