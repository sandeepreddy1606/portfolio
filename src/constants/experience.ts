import type { TimelineEntry } from "@/types";

/**
 * Career record, newest first. Roles, programme and education come from the
 * résumé Sandeep supplied (sandeep_software_developer.pdf); Velobite from the
 * founder's own account and the velobite organisation; the last entry from
 * the public GitHub history.
 *
 * The first entry renders as the full-width "season ticket" and the last as
 * the "platform ticket", so keep the current role first and the origin last.
 */
export const TIMELINE: TimelineEntry[] = [
  {
    id: "beetloop-dev",
    period: "Apr 2026 — Present",
    title: "Full Stack & AI/ML Developer",
    organisation: "BeetLoop Global Solutions Pvt Ltd",
    kind: "role",
    location: "Chennai",
    summary:
      "Full-stack and AI features for a production cloud service, end to end: Next.js on the front, Java and Spring Boot behind it, Claude in the product, AWS underneath.",
    highlights: [
      "Ship features across the whole stack — Next.js and React interfaces on Java and Spring Boot REST APIs — with unit tests and peer code review on every change.",
      "Build AI features on Anthropic's Claude, integrated behind the service layer with input validation, error handling and structured logging, so model calls are observable and fail safely.",
      "Containerise services with Docker and deploy them to AWS through CI/CD pipelines, cutting release cycle time and reducing deployment-related defects by 50%.",
      "Run what ships: monitor service health in production, investigate incidents from logs and metrics, and land fixes that cut average request processing time.",
      "Secure every endpoint — credential management, input validation and role-based authorisation — across the frontend and the APIs it calls.",
      "Work with product owners, front-end developers and QA in Agile/Scrum: design discussions, sprint planning and technical documentation for new services.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Java",
      "Spring Boot",
      "Claude API",
      "AWS",
      "Docker",
      "CI/CD",
    ],
  },
  {
    id: "velobite-2026",
    period: "Jul 2026 — Present",
    title: "Founder — Velobite",
    organisation: "Velobite (early-stage startup)",
    kind: "role",
    summary:
      "Founding a food-delivery platform built as four separate products with their own backends — customer, restaurant, delivery partner and admin.",
    highlights: [
      "Designed and built the authentication service in Spring Boot 3.4 and Java 17: ten endpoints, Postgres with Flyway migrations, JWT sessions and OTP verification over E.164 phone numbers.",
      "Made the account non-existent until its code is verified — sign-up parks hashed details in a verifications table, so an unverified number can never reach a courier.",
      "Closed account enumeration on password reset with a decoy verification id for unknown identifiers, and put failed-attempt counters in their own REQUIRES_NEW transaction so lockouts survive the rollback.",
      "Replaced client-supplied Google profiles with server-side ID token verification against Google's signing keys.",
      "Wrote the test suite against an embedded Postgres the build downloads itself, so tests need no Docker daemon.",
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
      "Packaged the whole system as one Next.js process that serves the dashboard and API and runs the Telegram listener and career-page scan.",
    ],
    stack: ["Next.js", "TypeScript", "MTProto", "PostgreSQL", "SQLite"],
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
    id: "beetloop-intern",
    period: "Mar 2026 — Apr 2026",
    title: "Full Stack & AI/ML Developer Intern",
    organisation: "BeetLoop Global Solutions Pvt Ltd",
    kind: "role",
    location: "Chennai",
    summary:
      "React front ends on Spring Boot REST endpoints, and LLM APIs behind an internal service layer — the internship that became the full-time role.",
    highlights: [
      "Built responsive React components backed by Spring Boot REST endpoints, through Git branching workflows and peer-reviewed pull requests.",
      "Integrated third-party LLM APIs behind an internal service layer with input validation, error handling and structured logging, automating data workflows and reducing manual processing effort by 35%.",
      "Wrote unit tests for new service methods and reproduced reported defects locally, contributing fixes that shipped in the production release.",
    ],
    stack: ["React", "Spring Boot", "LLM APIs", "Git", "Unit testing"],
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
    id: "hirola-2025",
    period: "May 2025 — Jun 2025",
    title: "Artificial Intelligence Intern",
    organisation: "Hirola InfoTech Solutions Pvt Ltd",
    kind: "role",
    location: "Bengaluru",
    summary:
      "Python data pipelines and classical ML services — classification and clustering — delivered as tested components with documented interfaces.",
    highlights: [
      "Built modular Python data-processing pipelines with automated preprocessing and validation, reaching prediction accuracy above 98% and cutting manual data preparation time by 35%.",
      "Delivered classification and clustering services (SVM, logistic regression, K-Means) as testable components, cutting error rates by 50% and doubling training throughput.",
      "Built interactive dashboards for pipeline monitoring and tuning, raising system efficiency to 80% and cutting compute cost by 20%.",
      "Translated requirements into technical designs with product managers and data engineers.",
    ],
    stack: ["Python", "scikit-learn", "Pandas", "NumPy", "SVM", "K-Means"],
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
    id: "vit-btech",
    period: "2022 — Present",
    title: "B.Tech, Computer Science and Engineering",
    organisation: "Vellore Institute of Technology, Chennai",
    kind: "education",
    summary:
      "Undergraduate degree in computer science, alongside the internships and the full-time role above.",
    highlights: [
      "Coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS, Object-Oriented Programming, Software Engineering, Cloud Computing.",
    ],
    stack: ["DSA", "Operating Systems", "Networks", "DBMS", "OOP", "Cloud Computing"],
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
      "Public repositories across Python, TypeScript, JavaScript, Dart, Java and PHP.",
      "Every substantial project carries a README with setup instructions someone else can follow.",
    ],
    stack: ["Git", "GitHub"],
  },
];
