import type { TimelineEntry } from "@/types";

/**
 * Career timeline.
 *
 * Every entry below is reconstructed from the public GitHub history
 * (repository creation dates, languages and READMEs) because LinkedIn blocks
 * automated reads. Add verified employment and education entries here — the
 * `kind` field is what drives the marker style, so a new "role" or "education"
 * item slots in without touching the component.
 *
 * Template:
 *   {
 *     id: "acme-2026",
 *     period: "Jan 2026 — Present",
 *     title: "Software Engineer",
 *     organisation: "Acme Corp",
 *     kind: "role",
 *     location: "Hyderabad, India",
 *     summary: "One line on the mandate.",
 *     highlights: ["Impact statement with a number in it."],
 *     stack: ["Next.js", "PostgreSQL"],
 *   },
 */
export const TIMELINE: TimelineEntry[] = [
  {
    id: "velobite-2026",
    period: "Jul 2026 — Present",
    title: "Co-founder & Engineer — Velobite",
    organisation: "Velobite (early-stage startup)",
    kind: "role",
    summary:
      "Building a food-delivery platform as four separate products with their own backends — customer, restaurant, delivery partner and admin — across an eight-repository organisation with a two-person engineering team.",
    highlights: [
      "Designed and built the authentication service in Spring Boot 3.4 and Java 17: ten endpoints, Postgres with Flyway migrations, JWT sessions and OTP verification over E.164 phone numbers.",
      "Made the account non-existent until its code is verified — sign-up parks hashed details in a verifications table, so an unverified number can never reach a courier.",
      "Closed account enumeration on password reset by issuing a decoy verification id for unknown identifiers, and put failed-attempt counters in their own REQUIRES_NEW transaction so lockouts survive the rollback that rejection triggers.",
      "Replaced client-supplied Google profiles with server-side ID token verification against Google's signing keys, removing a path that would have let anyone claim any email address.",
      "Wrote the suite against an embedded Postgres the build downloads itself, so tests need no Docker daemon.",
    ],
    stack: [
      "Java 17",
      "Spring Boot 3.4",
      "Spring Security",
      "PostgreSQL",
      "Flyway",
      "JWT",
      "TypeScript",
      "Docker",
    ],
  },
  {
    id: "agents-2026",
    period: "Jul 2026 — Present",
    title: "Autonomous agents & applied automation",
    organisation: "Independent",
    kind: "milestone",
    summary:
      "Building agents that take real actions in the world rather than just producing text, with a hard rule that anything irreversible runs on deterministic logic.",
    highlights: [
      "Shipped Auto Apply: a Telegram-sourced job-application agent that parses posts with pure regex and keyword heuristics, then sends templated SMTP applications or programmatically fills and submits Google Forms.",
      "Designed a human-in-the-loop review dashboard with five terminal states — review, applied, failed, manual, skipped — so no application leaves without an audit trail.",
      "Packaged the whole system behind a single bootstrap script that provisions the venv, builds the React bundle and serves both from one process.",
    ],
    stack: ["Python", "FastAPI", "Telethon", "React", "SQLite", "Docker"],
  },
  {
    id: "platform-2026",
    period: "Feb 2026 — Jun 2026",
    title: "Full-stack platform engineering",
    organisation: "Independent",
    kind: "milestone",
    summary:
      "Moving from feature builds to platform concerns: authentication, authorisation, rate limiting and observability as first-class requirements.",
    highlights: [
      "Built BlogX end to end — Next.js 15 frontend on Vercel, NestJS API on Railway, Prisma against serverless Postgres on Neon.",
      "Implemented JWT access plus refresh-token rotation with role-based access control separating the public feed from the private dashboard.",
      "Added request rate limiting and structured logging so production failures are diagnosable rather than guessable.",
    ],
    stack: ["Next.js 15", "NestJS", "Prisma", "PostgreSQL", "TypeScript", "Docker"],
  },
  {
    id: "genai-2025",
    period: "Oct 2025 — Jan 2026",
    title: "Generative AI application development",
    organisation: "Independent",
    kind: "milestone",
    summary:
      "A run of four LLM products, each testing a different integration pattern — structured generation, document synthesis, transcript reasoning and multilingual output.",
    highlights: [
      "AI Mini-Course Generator: turns any topic into structured lessons, runnable code examples, curated video suggestions and a scored quiz.",
      "AI Document Assistant: section-level generation and refinement that exports real .docx and .pptx files, with Firestore keeping the full refinement history.",
      "YouTube Summarizer Bot: transcript extraction with contextual follow-up questions and answers in English, Hindi, Kannada and Tamil.",
    ],
    stack: ["Gemini API", "FastAPI", "React", "MongoDB", "Firebase", "Telegram Bot API"],
  },
  {
    id: "mobile-2025",
    period: "Jul 2025 — Sep 2025",
    title: "Cross-platform product suite",
    organisation: "Independent",
    kind: "milestone",
    summary:
      "Three Flutter applications sharing one Firebase backend, covering every side of a food-delivery marketplace.",
    highlights: [
      "Built the customer ordering app, the delivery-partner app and the admin panel as separate clients on a shared data model.",
      "Handled the realtime coordination problem — order state has to stay consistent across three apps watching the same documents.",
      "Roughly 890 KB of Dart across the suite, with shared auth and messaging built on Firebase.",
    ],
    stack: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "FCM"],
  },
  {
    id: "ml-2025",
    period: "Feb 2025 — Jul 2025",
    title: "Applied ML, computer vision & NLP",
    organisation: "Independent",
    kind: "milestone",
    summary:
      "Foundational work on the model side — recognition, classification and speech — evaluated properly rather than demoed on happy paths.",
    highlights: [
      "Built a face recognition system with a registration flow, an embedding store and evaluation against LFW verification pairs.",
      "Trained a toxic-message classifier and shipped a local Whisper transcription pipeline with GPU detection and fallback.",
      "Developed a symptom-driven diagnosis engine in PHP/MySQL spanning ten body regions with full admin CRUD and user feedback.",
    ],
    stack: ["Python", "OpenCV", "PyTorch", "Whisper", "scikit-learn", "PHP", "MySQL"],
  },
  {
    id: "jpmc-2024",
    period: "Jun 2024",
    title: "Software Engineering Virtual Experience",
    organisation: "JPMorgan Chase & Co. (Forage)",
    kind: "program",
    summary:
      "Completed all three engineering tasks of JPMorgan Chase's open-access software engineering program.",
    highlights: [
      "Interfaced with a live stock-price data feed and repaired the broken data-fetch layer.",
      "Bridged a Python backend to a React frontend, correcting the data model that fed the visualisation.",
      "Built the trading dashboard chart that surfaces the price ratio and its historical bounds.",
    ],
    stack: ["Python", "React", "TypeScript", "Perspective"],
  },
  {
    id: "start-2023",
    period: "Oct 2023",
    title: "Started building in public",
    organisation: "GitHub",
    kind: "milestone",
    summary:
      "First public commit. Twenty-four repositories later the pattern is consistent: build the whole thing, ship it, then write down how it works.",
    highlights: [
      "24 public repositories spanning Python, TypeScript, JavaScript, Dart, Java and PHP.",
      "Every substantial project carries a README with setup instructions someone else can actually follow.",
    ],
    stack: ["Git", "GitHub"],
  },
];
