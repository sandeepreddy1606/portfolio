"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { NAV_ITEMS, SITE, SOCIALS } from "@/constants/site";
import { GridBackground } from "@/components/ui/backgrounds";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Magnetic } from "@/components/ui/magnetic";

export function Footer() {
  return (
    <footer className="border-line relative overflow-hidden border-t">
      <GridBackground className="opacity-60" />

      <div className="container-page relative z-10 py-16 sm:py-20">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} — home`}>
              <span className="border-ink text-ink font-display grid size-9 place-items-center rounded-md border-[1.5px] text-[13px] font-bold">
                {SITE.initials}
              </span>
              <span className="text-sm font-semibold tracking-tight">{SITE.shortName}</span>
            </Link>
            <p className="text-ink-muted max-w-sm text-sm leading-relaxed">{SITE.tagline}</p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="border-line bg-surface/50 text-ink-muted hover:text-ink hover:border-accent/50 grid size-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.nav variants={fadeUp} aria-label="Footer" className="flex flex-col gap-4">
            <h2 className="text-ink-subtle text-sm font-normal">Navigate</h2>
            <ul className="flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted hover:text-ink text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <h2 className="text-ink-subtle text-sm font-normal">Elsewhere</h2>
            <ul className="flex flex-col gap-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-ink text-sm transition-colors duration-200"
                  >
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-line mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t pt-8 sm:flex-row">
          <p className="text-ink-subtle text-center text-xs sm:text-left">
            © {new Date().getFullYear()} {SITE.name}. Built with Next.js, Tailwind and Framer
            Motion.
          </p>

          <Magnetic strength={0.3}>
            <a
              href="#hero"
              className="border-line bg-surface/50 text-ink-muted hover:text-ink hover:border-accent/50 group inline-flex items-center gap-2 rounded-full border py-2 pr-4 pl-3 text-xs backdrop-blur-md transition-colors duration-300"
            >
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Back to top
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
