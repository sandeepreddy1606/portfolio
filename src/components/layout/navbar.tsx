"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Command as CommandIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { NAV_ITEMS, SECTION_IDS, SITE, SOCIALS } from "@/constants/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useCommandPalette } from "@/components/providers/command-palette";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { toggle } = useCommandPalette();

  const isHome = pathname === "/";
  // Scroll-spy only observes sections that exist on the home page.
  const activeSection = useScrollSpy(isHome ? SECTION_IDS : []);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  // Lock the page behind the mobile drawer.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => void (document.body.style.overflow = "");
  }, [menuOpen]);

  // Close the drawer whenever the route changes — including on browser back,
  // which no click handler would catch. Adjusting during render rather than in
  // an effect avoids rendering the open drawer over the new page for a frame.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.sectionId ? isHome && activeSection === item.sectionId : pathname.startsWith(item.href);

  return (
    <>
      <a
        href="#main"
        className="bg-accent text-accent-ink sr-only z-[95] rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={cn(
            "transition-all duration-500 ease-[var(--ease-out-expo)]",
            scrolled ? "border-brass/40 bg-surface-2 border-b" : "border-b border-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="container-page flex h-16 items-center justify-between gap-4 sm:h-18"
          >
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${SITE.name} — home`}
            >
              <span className="border-brass text-brass font-display group-hover:text-accent group-hover:border-accent grid size-9 place-items-center rounded-sm border-2 text-base font-extrabold transition-colors duration-300">
                {SITE.initials}
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:block xl:hidden 2xl:block">
                {SITE.shortName}
              </span>
            </Link>

            {/* Lever frame: each destination is a lever; the section you're
                in shows its lever pulled over, lit amber. */}
            <ul className="hidden items-end gap-1 xl:flex">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group flex flex-col items-center gap-1.5 px-2 py-1"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-4 w-1.5 origin-bottom rounded-full transition-[transform,background-color] duration-300 ease-[var(--ease-out-expo)]",
                          active
                            ? "bg-accent rotate-[24deg]"
                            : "bg-ink/70 group-hover:bg-ink group-hover:rotate-[10deg]",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[13px] font-semibold whitespace-nowrap transition-colors",
                          active ? "text-ink" : "text-ink-muted group-hover:text-ink",
                        )}
                      >
                        <span className="text-brass mr-1 tabular-nums">{i + 1}</span>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label="Open command palette"
                className="border-line-strong text-ink-muted hover:text-ink hover:border-ink hidden items-center gap-2 rounded-md border py-1.5 pr-2 pl-3 text-xs transition-colors duration-300 sm:flex"
              >
                <span className="xl:hidden 2xl:inline">Search or ask</span>
                <kbd className="border-line bg-surface-2 flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  <CommandIcon className="size-2.5" />K
                </kbd>
              </button>

              <ThemeToggle />

              <Button asChild size="sm" variant="accent" className="hidden sm:inline-flex">
                <Link href="/#contact">Get in touch</Link>
              </Button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="border-line-strong text-ink grid size-9 place-items-center rounded-md border xl:hidden"
              >
                <Menu className="size-4" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}

function MobileDrawer({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (item: (typeof NAV_ITEMS)[number]) => boolean;
}) {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="bg-canvas/60 fixed inset-0 z-[85] backdrop-blur-sm xl:hidden"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="bg-surface-2 border-brass/40 fixed inset-y-0 right-0 z-[86] flex w-[min(88vw,22rem)] flex-col border-l xl:hidden"
          >
            <div className="border-line flex h-16 items-center justify-between border-b px-6">
              <span className="text-ink-subtle text-sm">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="border-line-strong grid size-9 place-items-center rounded-md border"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between rounded-md px-4 py-3.5 text-base font-medium transition-colors",
                        isActive(item)
                          ? "bg-surface-2 text-ink"
                          : "text-ink-muted hover:bg-surface-2/60",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-line flex flex-col gap-4 border-t px-6 py-6">
              <Button asChild variant="accent" size="lg" className="w-full">
                <Link href="/#contact" onClick={onClose}>
                  Get in touch
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="border-line-strong text-ink-muted hover:text-ink grid size-10 place-items-center rounded-md border transition-colors"
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
