"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Check, Copy, Download, Mail } from "lucide-react";
import { SITE, SOCIALS } from "@/constants/site";
import { EASE, fadeUp, stagger } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { RotatingText, TextReveal } from "@/components/ui/animated-text";
import { AuroraBackground, GridBackground, ParticleField } from "@/components/ui/backgrounds";
import { ProfileImage } from "@/components/ui/avatar";
import { useCopy } from "@/hooks/use-copy";

const ROLES = [
  "Full-Stack Engineer",
  "AI Application Engineer",
  "Next.js Specialist",
  "Agent Builder",
];

export function Hero() {
  const { scrollYProgress } = useScroll();
  // Parallax the hero away as the next section arrives.
  const y = useTransform(scrollYProgress, [0, 0.18], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);

  const { copied, copy } = useCopy();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32"
    >
      <AuroraBackground />
      <GridBackground />
      <ParticleField />

      <motion.div style={{ y, opacity }} className="container-page relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <motion.div variants={stagger(0.1, 0.15)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-7 flex flex-wrap items-center gap-3">
              <span className="border-line bg-surface/50 inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2.5 text-xs backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                  <span className="bg-accent relative inline-flex size-2 rounded-full" />
                </span>
                <span className="text-ink-muted">{SITE.availability}</span>
              </span>
              <span className="text-ink-subtle font-mono text-[11px] tracking-[0.18em] uppercase">
                {SITE.location}
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] font-semibold">
              <motion.span
                variants={fadeUp}
                className="text-ink-muted block font-mono text-[0.28em] tracking-[0.24em] uppercase"
              >
                Hi, I&apos;m
              </motion.span>
              <TextReveal text="Sandeep Reddy" by="char" className="text-gradient block" />
              <span className="text-ink-subtle block text-[0.42em] leading-tight font-medium tracking-tight sm:text-[0.36em]">
                <RotatingText phrases={ROLES} />
              </span>
            </h1>

            <motion.p
              variants={fadeUp}
              className="text-ink-muted mt-8 max-w-xl text-base leading-relaxed sm:text-lg"
            >
              Currently building <span className="text-ink font-medium">Velobite</span>, a
              food-delivery platform running as eight services across four products. Before that:
              typed React frontends, FastAPI and NestJS backends, and the LLM and computer-vision
              layers underneath them — twenty-four public repositories across six languages.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild size="lg" variant="accent">
                  <Link href="/#contact">
                    <Mail /> Let&apos;s work together
                  </Link>
                </Button>
              </Magnetic>

              <Magnetic>
                <Button asChild size="lg" variant="outline">
                  <a href={SITE.resumeUrl} download>
                    <Download /> Résumé
                  </a>
                </Button>
              </Magnetic>

              <button
                type="button"
                onClick={() => copy(SITE.email)}
                className="text-ink-muted hover:text-ink group inline-flex h-13 items-center gap-2 rounded-full px-4 font-mono text-[13px] transition-colors duration-300"
                aria-label={`Copy email address ${SITE.email}`}
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4 opacity-60 transition-opacity group-hover:opacity-100" />
                )}
                {copied ? "Copied" : SITE.email}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
              <span className="bg-line h-px w-10" aria-hidden />
              <ul className="flex items-center gap-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="border-line bg-surface/50 text-ink-muted hover:text-ink hover:border-accent/50 grid size-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <social.icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <ProfilePortrait />
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity }}
        className="text-ink-subtle hover:text-ink absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-2 transition-colors"
      >
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="border-line bg-surface/50 grid size-9 place-items-center rounded-full border backdrop-blur-md"
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

function ProfilePortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.35 }}
      className="relative mx-auto w-full max-w-sm lg:mx-0"
    >
      {/* Counter-rotating rings framing the portrait. */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        className="border-line absolute inset-[-9%] rounded-full border border-dashed"
      />
      <motion.div
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="border-accent/25 absolute inset-[-2%] rounded-full border"
      >
        <span className="bg-accent absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_16px_4px_var(--accent)]" />
      </motion.div>

      <div className="border-line bg-surface/40 relative aspect-square overflow-hidden rounded-full border backdrop-blur-xl">
        <div
          aria-hidden
          className="from-accent/25 via-iris/10 absolute inset-0 bg-gradient-to-br to-transparent"
        />
        <ProfileImage
          priority
          sizes="(max-width: 1024px) 24rem, 22rem"
          className="transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-105"
        />
      </div>

      {/* Floating stat chips. */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -top-2 -left-4 rounded-2xl px-4 py-3 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)]"
      >
        <p className="font-display text-2xl font-bold">24</p>
        <p className="text-ink-subtle font-mono text-[10px] tracking-wider uppercase">
          Repositories
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="glass absolute right-0 -bottom-3 rounded-2xl px-4 py-3 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)]"
      >
        <p className="font-display text-2xl font-bold">6</p>
        <p className="text-ink-subtle font-mono text-[10px] tracking-wider uppercase">Languages</p>
      </motion.div>
    </motion.div>
  );
}
