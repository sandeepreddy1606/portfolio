import { KNOWLEDGE, type KnowledgeEntry } from "./knowledge";

/**
 * Fit check: match a job description against evidence on this site.
 *
 * Deliberately not a language model. A recruiter pasting a JD wants to know
 * what is *proven*, and a model asked "is he a fit?" will say yes. This only
 * reports a requirement as met when a project, role or achievement on the site
 * actually mentions it — and lists what it could not find.
 */

type Term = { name: string; match: RegExp; evidence?: RegExp };

// `match` finds the requirement in a JD; `evidence` (defaults to `match`)
// finds it in the portfolio. They differ where a JD's wording is broader.
const TERMS: Term[] = [
  { name: "TypeScript", match: /\btypescript\b/i, evidence: /typescript/i },
  {
    name: "JavaScript",
    // Not a bare "js": every "Node.js" and "Next.js" would match it.
    match: /\bjavascript\b|(?<![.\w])js\b|\bes6\b/i,
    evidence: /javascript|typescript/i,
  },
  { name: "Python", match: /\bpython\b/i },
  { name: "Java", match: /\bjava\b(?!script)/i, evidence: /\bjava\b(?!script)/i },
  {
    name: "SQL",
    match: /\bsql\b|relational database/i,
    evidence: /postgres|mysql|sqlite|\bsql\b/i,
  },
  { name: "React", match: /\breact(?:\.js|js)?\b(?! native)/i },
  { name: "Next.js", match: /next\.?js/i },
  { name: "Node.js", match: /node\.?js|\bnode\b/i, evidence: /node\.?js|nestjs/i },
  { name: "NestJS", match: /nest\.?js/i },
  { name: "FastAPI", match: /fastapi/i },
  { name: "Spring Boot", match: /spring/i },
  { name: "REST APIs", match: /\brest(?:ful)?\b|\bapis?\b/i, evidence: /\bapi\b|endpoints?/i },
  { name: "WebSockets / realtime", match: /websocket|real-?time/i },
  {
    name: "Authentication & security",
    match: /auth|oauth|jwt|security|owasp/i,
    evidence: /jwt|otp|auth/i,
  },
  { name: "PostgreSQL", match: /postgres/i },
  { name: "MongoDB", match: /mongo/i },
  { name: "Firebase", match: /firebase|firestore/i },
  { name: "Prisma / ORMs", match: /prisma|\borm\b|jpa|hibernate/i, evidence: /prisma|jpa/i },
  { name: "Docker", match: /docker|container/i },
  {
    name: "Cloud deployment",
    match: /\baws\b|gcp|google cloud|azure|vercel|cloud/i,
    evidence: /vercel|railway|neon|deploy/i,
  },
  { name: "Kubernetes", match: /kubernetes|\bk8s\b/i },
  { name: "Redis / caching", match: /redis|caching/i, evidence: /redis/i },
  {
    name: "CI/CD",
    match: /ci\/cd|continuous (?:integration|delivery|deployment)|github actions/i,
    evidence: /github actions|\bci\b/i,
  },
  {
    name: "Testing",
    match: /test(?:ing|s)?\b|tdd|jest|pytest|junit/i,
    evidence: /test suite|tests|evaluation/i,
  },
  {
    name: "LLM applications",
    match: /\bllms?\b|large language|generative ai|genai|gpt|gemini|claude|openai/i,
    // Not a bare "llm": Auto Apply mentions LLMs only to say it uses none.
    evidence: /gemini|llm orchestration|generative ai/i,
  },
  {
    name: "RAG / retrieval",
    match: /\brag\b|retrieval|vector (?:db|database|store)|embeddings?/i,
    // Face embeddings are not retrieval-augmented generation — don't claim it.
    evidence: /\brag\b|retrieval-augmented|vector store/i,
  },
  {
    name: "AI agents & automation",
    match: /agent|agentic|automation|workflow/i,
    evidence: /agent|automat/i,
  },
  {
    name: "Prompt engineering",
    match: /prompt/i,
    evidence: /structured gen|output contract|topic prompt/i,
  },
  {
    name: "Computer vision",
    match: /computer vision|\bcv\b|opencv|image recognition/i,
    evidence: /opencv|face|vision/i,
  },
  {
    name: "NLP",
    match: /\bnlp\b|natural language/i,
    evidence: /\bnlp\b|classifier|transcri|summar/i,
  },
  {
    name: "PyTorch / ML frameworks",
    match: /pytorch|tensorflow|scikit|machine learning|\bml\b/i,
    evidence: /pytorch|scikit|classifier|whisper/i,
  },
  {
    name: "Speech / audio",
    match: /speech|audio|whisper|transcription/i,
    evidence: /whisper|transcri/i,
  },
  { name: "Flutter / mobile", match: /flutter|dart|mobile|android|ios/i, evidence: /flutter/i },
  {
    name: "Microservices",
    match: /microservice|distributed|service-oriented/i,
    evidence: /separate backends?|eight services|own backend/i,
  },
  {
    name: "System design",
    match: /system design|architecture|scalab/i,
    evidence: /architecture|separate|surfaces?/i,
  },
  {
    name: "Data structures & algorithms",
    match: /algorithm|data structure|\bdsa\b|problem[- ]solving|leetcode/i,
    evidence: /leetcode|problems/i,
  },
  { name: "Tailwind / CSS", match: /tailwind|\bcss\b/i, evidence: /tailwind|\bcss\b/i },
  { name: "Git", match: /\bgit\b|version control/i, evidence: /github|repositor/i },
  {
    name: "Startup / ownership",
    match: /startup|founding|ownership|0 to 1|zero to one|end[- ]to[- ]end/i,
    evidence: /co-founder|end to end|startup/i,
  },
];

export type FitResult = {
  matched: { name: string; evidence: KnowledgeEntry[] }[];
  missing: string[];
  /** Requirements recognised in the JD at all. */
  total: number;
};

export function checkFit(jobDescription: string): FitResult {
  const jd = jobDescription.slice(0, 20_000);
  const requested = TERMS.filter((t) => t.match.test(jd));

  const matched: FitResult["matched"] = [];
  const missing: string[] = [];

  for (const term of requested) {
    const re = term.evidence ?? term.match;
    const evidence = KNOWLEDGE.filter((k) => k.kind !== "profile" && re.test(k.text))
      // Case studies first — they are the deepest evidence.
      .sort((a, b) => Number(b.kind === "case") - Number(a.kind === "case"))
      .slice(0, 3);
    if (evidence.length) matched.push({ name: term.name, evidence });
    else missing.push(term.name);
  }

  return { matched, missing, total: requested.length };
}
