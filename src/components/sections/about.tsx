"use client";

import { motion } from "framer-motion";
import { Compass, MapPin, Sparkles, Target } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/card";
import { CountUp } from "@/components/ui/animated-text";
import { CORE_STRENGTHS } from "@/constants/skills";
import { SITE } from "@/constants/site";
import { fadeUp, slideInRight, stagger, viewportOnce } from "@/lib/motion";

const STATS = [
  { value: 24, suffix: "", label: "Public repositories" },
  { value: 6, suffix: "", label: "Languages shipped" },
  { value: 5, suffix: "", label: "AI applications" },
  { value: 3, suffix: "", label: "Backend ecosystems" },
];

const NARRATIVE = [
  {
    icon: Compass,
    title: "Where I started",
    body: `First public commit in October 2023, while studying at ${SITE.university}. I began where most people do — a PHP diagnosis engine, a Flutter app, a face recogniser — and kept going until the projects stopped being exercises and started being systems with auth, state and deploy targets.`,
  },
  {
    icon: Sparkles,
    title: "What I care about",
    body: "Correctness you can point at. Auto Apply parses job posts with regex rather than a model, because an agent that sends real emails on your behalf cannot be allowed to improvise. That instinct — knowing where determinism belongs — is the part of this work I find most interesting.",
  },
  {
    icon: Target,
    title: "Where I'm heading",
    body: "Right now, into Velobite — an early-stage food-delivery platform I'm building with one other engineer, where I own the authentication service and the architecture that splits four products across eight repositories. Longer term: product engineering where the AI layer and the interface are owned by the same person.",
  },
];

export function About() {
  return (
    <Section id="about">
      <div className="container-page">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              I build the whole thing —{" "}
              <span className="text-ink-subtle">schema to shipped interface.</span>
            </>
          }
          description="Full-stack and AI engineer working across TypeScript, Python, Java and Dart. My work sits at the seam where an interface meets a model, and I have opinions about how that seam should be built."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-5"
          >
            {NARRATIVE.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <SpotlightCard className="p-6 sm:p-7">
                  <div className="flex gap-5">
                    <span className="border-line bg-surface-2 text-accent grid size-11 shrink-0 place-items-center rounded-xl border">
                      <item.icon className="size-5" />
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-5"
          >
            <motion.div variants={slideInRight}>
              <SpotlightCard glow={false} className="p-6 sm:p-7">
                <div className="grid grid-cols-2 gap-6">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1">
                      <span className="font-display from-ink to-ink-subtle bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
                        <CountUp value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="text-ink-subtle text-xs leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {CORE_STRENGTHS.map((strength) => (
              <motion.div key={strength.title} variants={slideInRight}>
                <SpotlightCard className="p-6">
                  <div className="flex items-center gap-3">
                    <strength.icon className="text-accent size-4" />
                    <h3 className="text-sm font-semibold tracking-tight">{strength.title}</h3>
                  </div>
                  <p className="text-ink-muted mt-3 text-sm leading-relaxed">{strength.body}</p>
                </SpotlightCard>
              </motion.div>
            ))}

            <motion.div variants={slideInRight}>
              <div className="border-line bg-surface/40 text-ink-muted flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm backdrop-blur-md">
                <MapPin className="text-accent size-4 shrink-0" />
                <span>
                  Based in {SITE.location} · {SITE.timezone} · {SITE.availability.toLowerCase()}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
