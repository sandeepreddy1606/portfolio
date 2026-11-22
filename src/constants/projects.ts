import type { Project } from "@/types";
import { SITE } from "./site";

const repo = (name: string) => `https://github.com/${SITE.githubUsername}/${name}`;

/** Every entry maps to a real public repository. */
export const PROJECTS: Project[] = [
  {
    slug: "auto-apply",
    title: "Auto Apply",
    tagline: "An agent that reads job posts and applies for you — without a model in the loop.",
    description:
      "Listens to private Telegram channels for job posts, parses each message with pure regex and keyword heuristics, then acts: posts with an HR email get a templated application with the résumé attached over SMTP; posts pointing at a Google Form get fetched, auto-filled from the saved profile and submitted. A dashboard sits in front of all of it so every message can be reviewed, edited, previewed and tracked, and a periodic scan checks career pages too.",
    year: "2026",
    category: "ai",
    featured: true,
    accent: ["#6366F1", "#22D3EE"],
    features: [
      "Telegram ingestion via an MTProto user client",
      "Deterministic parser — no AI model, so an application is never hallucinated",
      "SMTP applications with résumé attachment",
      "Google Form fetch, auto-fill and programmatic submit",
      "Review, edit and preview before anything is sent; five tracked states",
      "One Next.js process serves the UI, the API, the listener and the scan loop",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Node.js",
      "MTProto",
      "nodemailer",
      "PostgreSQL",
      "SQLite",
    ],
    repo: repo("auto_apply"),
    metrics: [
      { label: "Processes", value: "1" },
      { label: "AI models", value: "0" },
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
      "A cloud-connected service that turns any topic into a complete mini-course. A FastAPI backend calls Gemini and the YouTube Data API in sequence — with retries, response caching and fallback responses so the course still arrives when an upstream service fails — and stores courses, modules and quizzes in MongoDB behind versioned REST APIs. GitHub Actions builds, tests and deploys it.",
    year: "2026",
    category: "ai",
    featured: true,
    accent: ["#22D3EE", "#34D399"],
    features: [
      "Structured multi-lesson generation from a single topic prompt",
      "Multi-stage pipeline with retry handling, caching and fallbacks",
      "YouTube Data API: videos summarised per subtopic into quizzes and reading lists",
      "Courses, modules and quizzes modelled in MongoDB with indexed, paginated queries",
      "Versioned REST APIs and a React client with JWT auth",
      "CI/CD on GitHub Actions: build, unit and integration tests, deploy",
    ],
    stack: [
      "FastAPI",
      "MongoDB",
      "React",
      "Gemini API",
      "YouTube Data API",
      "GitHub Actions",
      "Docker",
    ],
    repo: repo("ai_course_builder"),
    metrics: [
      { label: "Course authoring", value: "hours → seconds" },
      { label: "Release cycle", value: "−40%" },
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
    tagline: "ArcFace embeddings, 98% accuracy, 20 FPS on commodity hardware.",
    description:
      "A modular face-recognition engine with separate enrollment, recognition and batch-processing modules. Faces become ArcFace-512 embeddings via InsightFace and are matched by cosine similarity — 98% accuracy over 5,000+ images — with live webcam recognition at 20 FPS and a regression suite scored on Labeled Faces in the Wild.",
    year: "2025",
    category: "ai",
    featured: false,
    accent: ["#A78BFA", "#60A5FA"],
    features: [
      "ArcFace-512 embeddings (InsightFace) with cosine-similarity matching",
      "Separate enrollment, recognition and batch modules — 30% lower latency",
      "Real-time webcam recognition at 20 FPS without dropped frames",
      "Tkinter desktop interface for enrollment and verification",
      "Automated LFW regression and performance suite with scikit-learn metrics",
    ],
    stack: ["Python", "InsightFace", "OpenCV", "scikit-learn", "NumPy", "Tkinter"],
    repo: repo("face-detection"),
    metrics: [
      { label: "Accuracy", value: "98%" },
      { label: "Throughput", value: "20 FPS" },
      { label: "Benchmark", value: "LFW" },
    ],
  },
  {
    slug: "periodontitis-detection",
    title: "Periodontitis Detection System",
    tagline: "A CNN that reads dental radiographs, served as a versioned REST API.",
    description:
      "A diagnostic service that assesses periodontal bone loss and tooth-strength indicators from dental radiographs. A convolutional network trained with transfer learning and augmentation, validated on a held-out set with precision, recall and F1, sits behind a versioned FastAPI service that rejects malformed uploads before they reach the model. Containerised with health and version endpoints and unit tests across preprocessing and inference.",
    year: "2026",
    category: "ai",
    featured: false,
    accent: ["#0EA5E9", "#14B8A6"],
    features: [
      "CNN with transfer learning, preprocessing and augmentation",
      "Validated on a held-out test set with precision, recall and F1",
      "Versioned REST API — clients consume predictions without model code",
      "Upload validation rejects malformed or unsupported images",
      "OpenAPI/Swagger contract generated from the service",
      "Docker image with health-check and version endpoints; unit-tested paths",
    ],
    stack: ["Python", "FastAPI", "PyTorch", "OpenCV", "Docker"],
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
    title: "Toxic Comment Classification Service",
    tagline: "A fine-tuned BERT moderation service behind a Flask API.",
    description:
      "A moderation service that classifies comments for toxicity. A BERT transformer fine-tuned on 100,000+ preprocessed comments with class-imbalance mitigation reaches 0.92 macro-F1; a Flask REST API serves it with request validation and structured errors, benchmarked at 500+ requests per second, and the Instagram Graph API feeds it in real time with idempotent processing.",
    year: "2025",
    category: "ai",
    featured: false,
    accent: ["#F43F5E", "#FB923C"],
    features: [
      "BERT fine-tuned on 100,000+ comments, 0.92 macro-F1",
      "Class-imbalance mitigation and augmentation to lift minority-class recall",
      "Flask REST API with validation and structured error responses",
      "Load-benchmarked: 500+ requests per second after batch-size tuning",
      "Instagram Graph API ingestion with rate-limit handling and idempotency",
    ],
    stack: ["Python", "BERT", "Flask", "REST APIs", "Instagram Graph API"],
    repo: repo("toxic_message_classifier"),
    metrics: [
      { label: "Macro-F1", value: "0.92" },
      { label: "Throughput", value: "500+ req/s" },
      { label: "Training set", value: "100k+" },
    ],
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
