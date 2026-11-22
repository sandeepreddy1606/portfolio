"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The rule book. Signal boxes run on numbered rules, so these are numbered —
 * the number is how a rule gets cited. The heading stays pinned while the
 * rules pass; the rule nearest the middle of the screen has its plate lit.
 */
const RULES = [
  {
    title: "Rules where actions are irreversible, models where approximation is fine.",
    body: "Auto Apply sends real email in my name, so its parser is regex and keyword heuristics — traceable to the characters that produced every decision. The course generator writes lessons, where approximately right is still useful, so a model does the work inside a fixed schema.",
    proof: { label: "Compare Auto Apply and the course generator", href: "/work/auto-apply" },
    applies: ["Auto Apply", "AI Mini-Course Generator"],
  },
  {
    title: "Design the failure path before the happy path.",
    body: "In Velobite's auth service a failed login rolls back its transaction, which would also roll back the attempt counter — so the counter commits on its own. Password reset returns the same response for real and unknown accounts. These details decide whether a system is safe, so they're decided first.",
    proof: { label: "Read the Velobite decisions", href: "/work/velobite" },
    applies: ["Velobite"],
  },
  {
    title: "Own the whole slice.",
    body: "Schema, API, auth, interface and deploy. BlogX runs a Next.js frontend on Vercel against a NestJS and Prisma API on Railway with Postgres on Neon, and I built and operate all three. The stack follows the problem: FastAPI next to Python ML, NestJS for typed business logic, Spring Boot for stateful services.",
    proof: { label: "See how BlogX is put together", href: "/work/blogx" },
    applies: ["BlogX", "Velobite"],
  },
];

export function Principles() {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLLIElement | null)[]>([]);

  React.useEffect(() => {
    // A thin band across the middle of the viewport decides which rule is "on".
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="principles" className="enamel relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[clamp(2.5rem,6.5vw,4.75rem)] font-extrabold uppercase">
            The rule book
          </h2>
          <p className="prose-lead text-ink-muted mt-5 max-w-[40ch]">
            Three rules every project on this site follows, and where to check each one.
          </p>
          {/* Lamp index: which rule you are reading. */}
          <ol className="mt-8 hidden gap-3 lg:flex" aria-hidden>
            {RULES.map((_, i) => (
              <li
                key={i}
                className={cn(
                  "grid size-9 place-items-center rounded-full border-2 font-mono text-sm font-bold transition-colors duration-300",
                  active === i
                    ? "bg-lamp-amber border-[#8a5a00] text-[#1b1405]"
                    : "border-line-strong text-ink-subtle",
                )}
              >
                {i + 1}
              </li>
            ))}
          </ol>
        </div>

        <ol>
          {RULES.map((rule, i) => (
            <li
              key={rule.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="border-line-strong grid gap-6 border-t py-10 first:border-t-0 first:pt-0 sm:grid-cols-[6rem_minmax(0,1fr)]"
            >
              {/* Enamel number plate with a brass ring; lit when it's the current rule. */}
              <p
                className={cn(
                  "grid size-20 place-items-center rounded-full border-4 transition-[background-color,border-color,color,box-shadow] duration-500",
                  active === i
                    ? "text-lamp-amber border-[#c9a66b] bg-[#1f2a25] shadow-[0_10px_24px_-12px_rgb(0_0_0/0.6)]"
                    : "text-ink border-[#c9a66b]/60 bg-transparent",
                )}
              >
                <span className="sr-only">Rule </span>
                <span className="font-display text-4xl font-extrabold">{i + 1}</span>
              </p>
              <div className="min-w-0">
                <h3 className="font-sans text-xl leading-snug font-bold tracking-normal normal-case sm:text-2xl">
                  {rule.title}
                </h3>
                <p className="prose-lead text-ink-muted mt-4 max-w-[62ch]">{rule.body}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="text-ink-subtle">Applies to {rule.applies.join(" and ")}</span>
                  <Link
                    href={rule.proof.href}
                    transitionTypes={["nav-forward"]}
                    className="text-verify font-bold underline-offset-4 hover:underline"
                  >
                    {rule.proof.label}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
