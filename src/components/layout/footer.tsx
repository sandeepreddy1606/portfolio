import Link from "next/link";
import { ArrowUp } from "lucide-react";
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
          <a
            href="#main"
            className="text-ink-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
          >
            <ArrowUp className="size-4" aria-hidden /> Back to the top
          </a>
        </div>
      </div>
    </footer>
  );
}
