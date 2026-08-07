import type { AiProject, Project } from "@/types";
import { SITE } from "./site";

const repo = (name: string) => `https://github.com/${SITE.githubUsername}/${name}`;

/** Every entry maps to a real public repository. */
export const PROJECTS: Project[] = [
  {
    slug: "auto-apply",
    title: "Auto Apply",
    tagline: "An agent that reads job posts and applies for you — without a model in the loop.",
    description:
      "Listens to private Telegram channels for job postings, parses each message with pure regex and keyword heuristics, then acts: posts containing an HR email get a templated application with the resume attached over SMTP; posts pointing at a Google Form get fetched, auto-filled from the saved profile and submitted programmatically. A dashboard sits in front of all of it so every message can be reviewed, corrected and tracked.",
    year: "2026",
    category: "ai",
    featured: true,
    accent: ["#6366F1", "#22D3EE"],
    features: [
      "Telegram channel ingestion via a Telethon user client",
      "Deterministic parser — no LLM, so an application is never hallucinated",
      "SMTP applications with resume attachment",
      "Google Form fetch, auto-fill and programmatic submit",
      "Five-state tracking: review, applied, failed, manual, skipped",
      "One-command bootstrap that provisions the venv and builds the frontend",
    ],
    stack: ["Python 3.11", "FastAPI", "Telethon", "SQLite", "React 18", "Vite", "Docker"],
    repo: repo("auto_apply"),
    metrics: [
      { label: "Services", value: "1 process" },
      { label: "LLM calls", value: "0" },
      { label: "Terminal states", value: "5" },
    ],
  },
  {
    slug: "blogx",
    title: "BlogX",
    tagline: "A blog platform built like a product, not a tutorial.",
    description:
      "A production blog platform with a public social feed and a private authoring dashboard. Authentication is JWT with refresh-token rotation and role-based access control; the API is rate limited and emits structured logs. Frontend deploys to Vercel, the NestJS API to Railway, and Prisma talks to serverless Postgres on Neon.",
    year: "2026",
    category: "fullstack",
    featured: true,
    accent: ["#8B5CF6", "#F472B6"],
    features: [
      "Public social feed and authenticated private dashboard",
      "JWT access tokens with refresh rotation",
      "Role-based access control across every route",
      "Request rate limiting on the API surface",
      "Structured logging for production diagnosis",
      "Prisma schema push and generate as part of setup",
    ],
    stack: ["Next.js 15", "NestJS", "Prisma", "PostgreSQL", "TypeScript", "Neon", "Railway"],
    repo: repo("blog_application"),
    demo: "https://blog-app-iota-wine-74.vercel.app",
    metrics: [
      { label: "Deploy targets", value: "3" },
      { label: "Auth layers", value: "JWT + RBAC" },
      { label: "TypeScript", value: "98%" },
    ],
  },
  {
    slug: "ai-course-builder",
    title: "AI Mini-Course Generator",
    tagline: "Type a topic, get a structured course with lessons, code and a quiz.",
    description:
      "A full-stack generator that turns any topic into a complete mini-course in seconds. Gemini produces structured lessons with markdown explanations and code examples, relevant YouTube videos are matched in as supplementary material, and each course ends with an interactive quiz that grades instantly. Courses persist to a per-user dashboard.",
    year: "2025",
    category: "ai",
    featured: true,
    accent: ["#22D3EE", "#34D399"],
    features: [
      "Structured multi-lesson generation from a single topic prompt",
      "Auto-generated code snippets for technical subjects",
      "Relevant YouTube video suggestions per lesson",
      "Interactive end-of-course quiz with instant scoring",
      "JWT auth with a personal saved-course dashboard",
      "Markdown rendering throughout the lesson body",
    ],
    stack: ["FastAPI", "React", "MongoDB", "Gemini API", "Tailwind CSS", "JWT"],
    repo: repo("ai_course_builder"),
    metrics: [
      { label: "Generation time", value: "~seconds" },
      { label: "Artefacts per course", value: "4" },
      { label: "Auth", value: "JWT" },
    ],
  },
  {
    slug: "ai-document-assistant",
    title: "AI Document Assistant",
    tagline: "Generate, refine and export real .docx and .pptx files.",
    description:
      "Authenticated users describe a document; Gemini drafts it section by section or slide by slide. Every section can be refined independently, and the full refinement history is kept in Firestore so nothing is lost between iterations. The final artefact exports as a genuine Word or PowerPoint file rather than a preview.",
    year: "2025",
    category: "ai",
    featured: true,
    accent: ["#F59E0B", "#EF4444"],
    features: [
      "Firebase-authenticated workspaces",
      "Section-level and slide-level generation",
      "Independent per-section refinement passes",
      "True .docx and .pptx export",
      "Firestore-backed project and refinement history",
      "React + MUI frontend against a FastAPI backend",
    ],
    stack: ["FastAPI", "Firebase Admin", "Gemini API", "React", "MUI", "Firestore"],
    repo: repo("ai_document_assistance"),
    metrics: [
      { label: "Export formats", value: "docx + pptx" },
      { label: "History", value: "Full" },
      { label: "Auth", value: "Firebase" },
    ],
  },
  {
    slug: "collaborative-whiteboard",
    title: "Collaborative Whiteboard",
    tagline: "Multi-user realtime drawing on Spring Boot and WebSocket.",
    description:
      "A shared whiteboard where several people draw on the same canvas at once. Spring Boot handles auth and board management, WebSocket carries stroke events, and every stroke is persisted through JPA so a board can be reopened exactly as it was left. Boards are scoped per user with a dashboard for managing them.",
    year: "2026",
    category: "systems",
    featured: false,
    accent: ["#10B981", "#3B82F6"],
    features: [
      "WebSocket stroke broadcast to all connected clients",
      "Stroke-level persistence via JPA repositories",
      "Spring Security authentication with a login flow",
      "Per-user board dashboard and board creation",
      "Canvas client in vanilla JS with no framework overhead",
      "Schema and seed data checked in for reproducible setup",
    ],
    stack: ["Java", "Spring Boot", "WebSocket", "Spring Security", "JPA", "Maven"],
    repo: repo("white_board_application"),
    metrics: [
      { label: "Transport", value: "WebSocket" },
      { label: "Persistence", value: "Per-stroke" },
      { label: "Client bundle", value: "0 deps" },
    ],
  },
  {
    slug: "foodie-suite",
    title: "Foodie — Delivery Suite",
    tagline: "Three Flutter apps, one Firebase backend, one marketplace.",
    description:
      "A complete food-delivery system split across three clients: the customer ordering app, the delivery-partner app and the admin panel. All three read and write the same Firestore documents, so the hard part is keeping order state consistent as it moves between them in realtime.",
    year: "2025",
    category: "mobile",
    featured: true,
    accent: ["#F97316", "#FBBF24"],
    features: [
      "Customer app: browse, cart, order placement and live tracking",
      "Delivery-partner app: assignment, acceptance and status updates",
      "Admin panel: catalogue, orders and partner management",
      "Shared Firestore data model across all three clients",
      "Firebase Authentication with role separation",
      "Realtime order-state propagation between apps",
    ],
    stack: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "FCM"],
    repo: repo("food_delivery_app_2"),
    metrics: [
      { label: "Apps shipped", value: "3" },
      { label: "Dart", value: "~890 KB" },
      { label: "Backend", value: "Firebase" },
    ],
  },
  {
    slug: "face-recognition",
    title: "Face Recognition System",
    tagline: "Register, recognise, and actually evaluate against LFW.",
    description:
      "An end-to-end face recognition pipeline: register a face, embed it into a persisted face database, then recognise from a live feed. What sets it apart from most demo projects is the evaluation script — it scores the model against Labeled Faces in the Wild verification pairs instead of assuming it works.",
    year: "2025",
    category: "ai",
    featured: false,
    accent: ["#A78BFA", "#60A5FA"],
    features: [
      "Registration flow that builds a persistent embedding database",
      "Recognition against the stored face database",
      "LFW verification-pair evaluation with reported accuracy",
      "Separate model loader so backbones can be swapped",
      "Desktop GUI for registration and recognition",
      "Reusable face utilities shared across every entry point",
    ],
    stack: ["Python", "OpenCV", "Face embeddings", "NumPy", "Tkinter"],
    repo: repo("face-detection"),
    metrics: [
      { label: "Benchmark", value: "LFW pairs" },
      { label: "Entry points", value: "4" },
      { label: "Store", value: "Pickle DB" },
    ],
  },
  {
    slug: "yt-summarizer",
    title: "YouTube Summarizer Bot",
    tagline: "Long video in, key insights out — in your language.",
    description:
      "A Telegram bot that makes long videos consumable. It pulls the transcript, summarises the substance, answers contextual follow-up questions about what was said, and delivers all of it in the user's preferred language — English, Hindi, Kannada or Tamil. Orchestration runs through a custom skill rather than a single prompt.",
    year: "2026",
    category: "ai",
    featured: false,
    accent: ["#EF4444", "#F472B6"],
    features: [
      "Transcript extraction from arbitrary YouTube URLs",
      "Structured summarisation of long-form content",
      "Contextual Q&A grounded in the transcript",
      "Multilingual delivery across four languages",
      "Telegram as the entire user interface",
      "Custom orchestration skill instead of a monolithic prompt",
    ],
    stack: ["Python", "Node.js", "Telegram Bot API", "LLM orchestration"],
    repo: repo("yt_summariser_bot"),
    metrics: [
      { label: "Languages", value: "4" },
      { label: "Interface", value: "Telegram" },
      { label: "Grounding", value: "Transcript" },
    ],
  },
  {
    slug: "quiz-platform",
    title: "Timed Quiz Platform",
    tagline: "Exam-style assessment with review, navigation and a report.",
    description:
      "A Next.js App Router assessment platform built around the mechanics that actually matter in a timed exam: a running timer, question pagination, flag-and-review, a navigation panel showing answered versus skipped, and a scored report at the end. Auth and profile management round it out.",
    year: "2025",
    category: "fullstack",
    featured: false,
    accent: ["#3B82F6", "#8B5CF6"],
    features: [
      "Animated countdown timer with visible time pressure",
      "Question paginator with answered / skipped state",
      "Review panel for flagged questions before submit",
      "Post-attempt scored report",
      "Authentication with a profile panel and dropdown",
      "Component-per-concern architecture across the client",
    ],
    stack: ["Next.js", "React", "JavaScript", "CSS"],
    repo: repo("quiz-project"),
    metrics: [
      { label: "Routes", value: "4" },
      { label: "Components", value: "12+" },
      { label: "Router", value: "App Router" },
    ],
  },
  {
    slug: "disease-outbreaks",
    title: "Disease Outbreak Predictor",
    tagline: "A symptom-driven diagnosis engine covering ten body regions.",
    description:
      "A rule-based clinical triage system that walks the user through progressive symptom questionnaires per body region — head, eye, ear, chest, hand, forearm, elbow, foot and more — and narrows toward a likely condition. Backed by a full admin surface for editing diseases and symptoms, plus a user feedback loop.",
    year: "2025",
    category: "systems",
    featured: false,
    accent: ["#14B8A6", "#84CC16"],
    features: [
      "Progressive multi-stage symptom questionnaires",
      "Ten body regions with dedicated analysis paths",
      "Admin CRUD over the disease and symptom knowledge base",
      "User accounts with feedback collection and moderation",
      "Half a megabyte of domain logic in PHP",
      "MySQL-backed rule storage rather than hardcoded branches",
    ],
    stack: ["PHP", "MySQL", "HTML", "CSS"],
    repo: repo("disease-outbreaks"),
    metrics: [
      { label: "Body regions", value: "10" },
      { label: "Domain logic", value: "~510 KB" },
      { label: "Admin CRUD", value: "Full" },
    ],
  },
  {
    slug: "transcriber",
    title: "Local Whisper Transcriber",
    tagline: "Speech to text on your own hardware, GPU-aware.",
    description:
      "A local transcription tool that runs Whisper on-device rather than shipping audio to an API. Detects available GPU acceleration and falls back to CPU cleanly, writing transcripts straight to disk. Built for the cases where the audio simply cannot leave the machine.",
    year: "2025",
    category: "ai",
    featured: false,
    accent: ["#0EA5E9", "#6366F1"],
    features: [
      "Fully local inference — audio never leaves the device",
      "GPU capability detection with CPU fallback",
      "Direct transcript output to the filesystem",
      "Pinned requirements for reproducible environments",
      "Separate app and engine layers",
    ],
    stack: ["Python", "Whisper", "CUDA", "PyTorch"],
    repo: repo("Transcriber"),
    metrics: [
      { label: "Privacy", value: "On-device" },
      { label: "Acceleration", value: "GPU/CPU" },
      { label: "Output", value: "Plain text" },
    ],
  },
  {
    slug: "toxic-classifier",
    title: "Toxic Message Classifier",
    tagline: "Text classification for moderation pipelines.",
    description:
      "An NLP classifier that scores messages for toxicity, built as the model layer that a moderation pipeline would sit on top of. Trained and evaluated on a labelled corpus with the standard preprocessing, vectorisation and scoring workflow.",
    year: "2025",
    category: "ai",
    featured: false,
    accent: ["#F43F5E", "#FB923C"],
    features: [
      "Text preprocessing and vectorisation pipeline",
      "Supervised classification over a labelled corpus",
      "Evaluation against held-out data",
      "Designed as a drop-in moderation component",
    ],
    stack: ["Python", "scikit-learn", "NLP", "Pandas"],
    repo: repo("toxic_message_classifier"),
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

/** Deduplicated technology filter list, most common first. */
export const PROJECT_FILTERS = (() => {
  const counts = new Map<string, number>();
  for (const project of PROJECTS) {
    for (const tech of project.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech);
})();

export const AI_PROJECTS: AiProject[] = [
  {
    slug: "auto-apply",
    title: "Auto Apply",
    discipline: "Agents",
    summary:
      "A closed-loop agent with a deliberate constraint: the decision layer is deterministic. Anything that sends an email or submits a form on someone's behalf is too consequential to leave to a probabilistic parser.",
    architecture: [
      "Telegram channels",
      "Telethon ingest",
      "Rule-based parser",
      "Human review queue",
      "SMTP / Form action",
      "State tracker",
    ],
    stack: ["Python", "FastAPI", "Telethon", "SQLite", "React"],
    repo: repo("auto_apply"),
  },
  {
    slug: "ai-course-builder",
    title: "AI Mini-Course Generator",
    discipline: "LLM",
    summary:
      "Structured generation with a fixed output contract. The model fills a course schema — lessons, code, quiz — instead of free-forming prose, which is what makes the result renderable and gradeable.",
    architecture: [
      "Topic prompt",
      "Gemini structured gen",
      "Lesson + code schema",
      "YouTube enrichment",
      "Quiz builder",
      "MongoDB persistence",
    ],
    stack: ["Gemini API", "FastAPI", "MongoDB", "React"],
    repo: repo("ai_course_builder"),
  },
  {
    slug: "ai-document-assistant",
    title: "AI Document Assistant",
    discipline: "LLM",
    summary:
      "Iterative refinement rather than one-shot generation. Each section is a separately addressable unit the model can revise, and every revision is retained so a bad pass is always recoverable.",
    architecture: [
      "Firebase auth",
      "Section planner",
      "Gemini drafting",
      "Per-section refine",
      "Firestore history",
      "docx / pptx export",
    ],
    stack: ["Gemini API", "FastAPI", "Firebase", "React"],
    repo: repo("ai_document_assistance"),
  },
  {
    slug: "yt-summarizer",
    title: "YouTube Summarizer Bot",
    discipline: "NLP",
    summary:
      "Transcript-grounded reasoning. Answers are constrained to what was actually said in the video, then translated at the output boundary so the grounding never degrades across languages.",
    architecture: [
      "YouTube URL",
      "Transcript fetch",
      "Chunk + summarise",
      "Contextual Q&A",
      "Translation layer",
      "Telegram delivery",
    ],
    stack: ["Python", "Node.js", "Telegram Bot API"],
    repo: repo("yt_summariser_bot"),
  },
  {
    slug: "face-recognition",
    title: "Face Recognition System",
    discipline: "Computer Vision",
    summary:
      "A classical embedding pipeline held to a real benchmark. Faces become vectors, vectors go in a persisted store, and the whole thing is scored on LFW verification pairs rather than on a demo video.",
    architecture: [
      "Camera / image",
      "Face detection",
      "Embedding model",
      "Face DB (pickle)",
      "Distance match",
      "LFW evaluation",
    ],
    stack: ["Python", "OpenCV", "NumPy", "Tkinter"],
    repo: repo("face-detection"),
  },
  {
    slug: "transcriber",
    title: "Local Whisper Transcriber",
    discipline: "Speech",
    summary:
      "On-device speech-to-text for audio that cannot legally or ethically be uploaded. Detects GPU availability at startup and degrades to CPU without changing the interface.",
    architecture: [
      "Audio input",
      "GPU capability check",
      "Whisper inference",
      "Segment assembly",
      "Transcript file",
    ],
    stack: ["Python", "Whisper", "PyTorch", "CUDA"],
    repo: repo("Transcriber"),
  },
  {
    slug: "toxic-classifier",
    title: "Toxic Message Classifier",
    discipline: "NLP",
    summary:
      "The supervised half of a moderation stack — a trained classifier that scores text so a policy layer above it can decide what to do with the score.",
    architecture: [
      "Raw message",
      "Preprocess",
      "Vectorise",
      "Classifier",
      "Toxicity score",
      "Policy hook",
    ],
    stack: ["Python", "scikit-learn", "Pandas"],
    repo: repo("toxic_message_classifier"),
  },
];
