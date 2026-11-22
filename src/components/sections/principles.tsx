import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * The rule book. Signal boxes run on numbered rules, so these are numbered —
 * the number is how a rule gets cited, not decoration.
 */
const RULES = [
  {
    title: "Rules where actions are irreversible, models where approximation is fine.",
    body: "Auto Apply sends real email in my name, so its parser is regex and keyword heuristics — traceable to the characters that produced every decision. The course generator writes lessons, where approximately right is still useful, so a model does the work inside a fixed schema.",
    proof: { label: "Compare Auto Apply and the course generator", href: "/work/auto-apply" },
  },
  {
    title: "Design the failure path before the happy path.",
    body: "In Velobite's auth service a failed login rolls back its transaction, which would also roll back the attempt counter — so the counter commits on its own. Password reset returns the same response for real and unknown accounts. These details decide whether a system is safe, so they're decided first.",
    proof: { label: "Read the Velobite decisions", href: "/work/velobite" },
  },
  {
    title: "Own the whole slice.",
    body: "Schema, API, auth, interface and deploy. BlogX runs a Next.js frontend on Vercel against a NestJS and Prisma API on Railway with Postgres on Neon, and I built and operate all three. The stack follows the problem: FastAPI next to Python ML, NestJS for typed business logic, Spring Boot for stateful services.",
    proof: { label: "See how BlogX is put together", href: "/work/blogx" },
  },
];

export function Principles() {
  return (
    <Section id="principles" className="enamel">
      <div className="container-page">
        <SectionHeading
          title="The rule book"
          description="Three rules every project on this site follows."
        />

        <ol className="mt-14">
          {RULES.map((rule, i) => (
            <li
              key={rule.title}
              className="border-line-strong grid gap-4 border-t py-10 md:grid-cols-[7rem_minmax(0,5fr)_minmax(0,6fr)] md:gap-10"
            >
              <p className="font-display text-5xl font-extrabold">
                <span className="sr-only">Rule </span>
                {i + 1}
              </p>
              <h3 className="font-sans text-xl leading-snug font-bold tracking-normal normal-case sm:text-2xl">
                {rule.title}
              </h3>
              <div>
                <p className="prose-lead text-ink-muted">{rule.body}</p>
                <Link
                  href={rule.proof.href}
                  transitionTypes={["nav-forward"]}
                  className="text-verify mt-4 inline-block text-sm font-bold underline-offset-4 hover:underline"
                >
                  {rule.proof.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
