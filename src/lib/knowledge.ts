/**
 * The assistant's knowledge base, and the deterministic search over it.
 *
 * Built from the same constants that render the site, so the assistant can
 * never contradict the page it sits on. Pure data and string work — safe to
 * import from both the API route and client components.
 */
import { SITE } from "@/constants/site";
import { TIMELINE } from "@/constants/experience";
import { PROJECTS } from "@/constants/projects";
import { CASE_STUDIES } from "@/constants/case-studies";
import { ACHIEVEMENTS } from "@/constants/achievements";

/** A unit the assistant can cite. `ref` is what the UI turns into a card. */
export type KnowledgeEntry = {
  ref: string;
  kind: "case" | "project" | "role" | "achievement" | "profile";
  title: string;
  href?: string;
  text: string;
};

const caseSlugs = new Set(CASE_STUDIES.map((c) => c.slug));

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    ref: "profile",
    kind: "profile",
    title: SITE.name,
    text: [
      `${SITE.name} — ${SITE.role}, based in ${SITE.location}.`,
      SITE.tagline,
      SITE.description,
      `Availability: ${SITE.availability}.`,
      `Education: ${SITE.university}.`,
      `Contact: ${SITE.email}. GitHub ${SITE.githubUsername}, LeetCode ${SITE.leetcodeUsername}.`,
    ].join("\n"),
  },
  ...CASE_STUDIES.map<KnowledgeEntry>((c) => ({
    ref: `work:${c.slug}`,
    kind: "case",
    title: c.title,
    href: `/work/${c.slug}`,
    text: [
      `${c.title} (${c.role}, ${c.period}${c.status ? `, ${c.status}` : ""}). ${c.thesis}`,
      `Problem: ${c.problem}`,
      `Constraints: ${c.constraints.join(" ")}`,
      `Flow: ${c.flow.map((n) => n.label + (n.note ? ` (${n.note})` : "")).join(" → ")}.`,
      `Decisions: ${c.decisions.map((d) => `${d.title} — ${d.body}`).join(" ")}`,
      `Outcome: ${c.outcome.join(" ")}`,
      `Facts: ${c.facts.map((f) => `${f.value} ${f.label}`).join("; ")}.`,
      `Stack: ${c.stack.join(", ")}.`,
    ].join("\n"),
  })),
  // Projects that already have a case study are covered above.
  ...PROJECTS.filter((p) => !caseSlugs.has(p.slug)).map<KnowledgeEntry>((p) => ({
    ref: `project:${p.slug}`,
    kind: "project",
    title: p.title,
    href: p.demo ?? p.repo,
    text: [
      `${p.title} (${p.year}). ${p.tagline}`,
      p.description,
      `Features: ${p.features.join("; ")}.`,
      `Stack: ${p.stack.join(", ")}.`,
    ].join("\n"),
  })),
  ...TIMELINE.map<KnowledgeEntry>((t) => ({
    ref: `role:${t.id}`,
    kind: "role",
    title: t.title,
    text: [
      `${t.title} — ${t.organisation}, ${t.period}. ${t.summary}`,
      ...t.highlights,
      `Stack: ${t.stack.join(", ")}.`,
    ].join("\n"),
  })),
  ...ACHIEVEMENTS.map<KnowledgeEntry>((a) => ({
    ref: `achievement:${a.id}`,
    kind: "achievement",
    title: a.title,
    href: a.href,
    text: `${a.title} — ${a.issuer}, ${a.date}. ${a.description}`,
  })),
];

const byRef = new Map(KNOWLEDGE.map((k) => [k.ref, k]));
export const getEntry = (ref: string) => byRef.get(ref);

/**
 * The whole corpus as one stable string. Order and formatting never vary
 * between requests, which is what lets the API cache it as a prompt prefix.
 */
export const CORPUS = KNOWLEDGE.map((k) => `<entry ref="${k.ref}">\n${k.text}\n</entry>`).join(
  "\n\n",
);

/* ------------------------------------------------------------------ */
/* Deterministic search — the offline fallback and the fit check's     */
/* evidence finder. No model, so it can be wrong but never invent.     */
/* ------------------------------------------------------------------ */

const STOP = new Set(
  "a an and are as at be by can did do does for from has have he his how i in is it its me my of on or our so that the their them they this to was we what when where which who why will with you your about tell sandeep reddy".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) ?? [])
    .map((t) => t.replace(/[.]+$/, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function search(query: string, limit = 3): KnowledgeEntry[] {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return [];

  return KNOWLEDGE.filter((k) => k.kind !== "profile")
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const body = entry.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 4;
        // Count occurrences, capped so one repeated word cannot dominate.
        score += Math.min(body.split(term).length - 1, 3);
      }
      // Case studies are the deepest answer to most questions.
      if (entry.kind === "case") score *= 1.25;
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
