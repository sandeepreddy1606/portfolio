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
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

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
        className="bg-accent text-accent-ink sr-only z-[95] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
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
            scrolled
              ? "border-line bg-canvas/70 border-b backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent",
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
              <span className="from-accent to-iris text-accent-ink font-display grid size-9 place-items-center rounded-xl bg-gradient-to-br text-[13px] font-bold shadow-[0_6px_20px_-8px_var(--accent)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:rotate-[-6deg]">
                {SITE.initials}
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:block">
                {SITE.shortName}
              </span>
            </Link>

            {/* Desktop nav with a shared-layout pill behind the active item. */}
            <ul className="border-line bg-surface/40 hidden items-center gap-0.5 rounded-full border p-1 backdrop-blur-md xl:flex">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300",
                        active ? "text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="bg-surface-2 border-line absolute inset-0 rounded-full border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.3)]"
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
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
                className="border-line bg-surface/60 text-ink-subtle hover:text-ink hover:border-line-strong hidden items-center gap-2 rounded-full border py-1.5 pr-2 pl-3 text-xs backdrop-blur-md transition-colors duration-300 sm:flex"
              >
                <span>Search</span>
                <kbd className="border-line bg-surface flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[10px]">
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
                className="border-line bg-surface/60 text-ink grid size-9 place-items-center rounded-full border backdrop-blur-md xl:hidden"
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
            className="glass fixed inset-y-0 right-0 z-[86] flex w-[min(88vw,22rem)] flex-col xl:hidden"
          >
            <div className="border-line flex h-16 items-center justify-between border-b px-6">
              <span className="text-ink-subtle font-mono text-[11px] tracking-[0.2em] uppercase">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="border-line bg-surface/60 grid size-9 place-items-center rounded-full border"
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
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                        isActive(item)
                          ? "bg-surface-2 text-ink"
                          : "text-ink-muted hover:bg-surface-2/60",
                      )}
                    >
                      {item.label}
                      <span className="text-ink-subtle font-mono text-[10px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
                    className="border-line bg-surface/60 text-ink-muted hover:text-ink grid size-10 place-items-center rounded-full border transition-colors"
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
