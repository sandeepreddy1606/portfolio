import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * Three working principles, each tied to the place it can be checked. Not a
 * sequence, so no numbering — the proof link is the structure.
 */
const PRINCIPLES = [
  {
    title: "Rules where actions are irreversible, models where approximation is fine.",
    body: "Auto Apply sends real email in my name, so its parser is regex and keyword heuristics — traceable to the characters that produced every decision. The course generator writes lessons, where approximately right is still useful, so a model does the work inside a fixed schema.",
    proof: { label: "Compare Auto Apply and the course generator", href: "/work/auto-apply" },
  },
  {
    title: "Design the failure path before the happy path.",
    body: "In Velobite's auth service a failed login rolls back its transaction, which would also roll back the attempt counter — so the counter commits on its own. Password reset returns the same response for real and unknown accounts. These are the details that decide whether a system is safe, and they're decided first.",
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
    <Section id="principles" className="bg-surface/40 border-line border-y">
      <div className="container-page">
        <SectionHeading eyebrow="How I build" title="Three habits that show up in every project." />

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {PRINCIPLES.map((p) => (
            <article key={p.title} className="flex flex-col">
              <h3 className="text-xl leading-snug font-semibold sm:text-2xl">{p.title}</h3>
              <p className="prose-serif mt-4 flex-1 text-[1.0625rem]">{p.body}</p>
              <Link
                href={p.proof.href}
                transitionTypes={["nav-forward"]}
                className="text-verify mt-6 w-fit text-sm font-medium underline-offset-4 hover:underline"
              >
                {p.proof.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
