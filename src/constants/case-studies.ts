import { SITE } from "./site";

/**
 * Long-form case studies — the four projects that carry the site's argument.
 *
 * Every statement here is lifted from material already verified elsewhere in
 * the codebase (projects.ts, experience.ts, venture.ts, repository READMEs).
 * Nothing is extrapolated: where a number appears, it is a count of something
 * real, not a performance claim.
 */

/**
 * The diagram vocabulary. Colour carries meaning, so the legend is the same on
 * every page:
 *   source  — where data enters
 *   step    — plain processing
 *   guard   — a check that can stop the flow (verify / teal)
 *   action  — a step with consequences in the outside world (signal / amber)
 *   store   — persisted state
 */
export type FlowNodeKind = "source" | "step" | "guard" | "action" | "store";

export type FlowNode = {
  id: string;
  label: string;
  kind: FlowNodeKind;
  /** One line shown under the label on wide screens. */
  note?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** The one-sentence argument of the project. */
  thesis: string;
  role: string;
  period: string;
  status?: string;
  stack: string[];
  /** Two or three factual counts. Labels are written to be read aloud. */
  facts: { value: string; label: string }[];
  problem: string;
  constraints: string[];
  flow: FlowNode[];
  flowCaption: string;
  decisions: { title: string; body: string }[];
  outcome: string[];
  links: { label: string; href: string }[];
  /** Renders the in-browser parser replay on the page. */
  sandbox?: boolean;
};

const repo = (name: string) => `https://github.com/${SITE.githubUsername}/${name}`;

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "velobite",
    title: "Velobite",
    thesis:
      "A food-delivery platform built as four products with four backends, so a restaurant release can never break a courier's app.",
    role: "Founder",
    period: "Jul 2026 — present",
    status: "In active development",
    stack: [
      "Java 17",
      "Spring Boot 3.4",
      "Spring Security",
      "PostgreSQL",
      "Flyway",
      "JWT",
      "TypeScript",
      "React",
      "Docker",
    ],
    facts: [
      { value: "8", label: "repositories in the organisation" },
      { value: "4", label: "separate product surfaces" },
      { value: "10", label: "endpoints in the auth service" },
    ],
    problem:
      "Diners, restaurant owners, couriers and operators need very different things from the same orders. One API serving all four ends up shaped for none of them, and one deploy pipeline means every release risks every audience. On top of that, the platform hands a stranger's phone number to a courier — so identity has to be right before anything else is.",
    constraints: [
      "A small founding team, so every service has to be understandable by whoever is on call.",
      "Phone number (E.164) is the identity. Email is collected but never verified at sign-up.",
      "Tests must run on any laptop and in CI without a Docker daemon.",
    ],
    flow: [
      { id: "phone", label: "Sign-up request", kind: "source", note: "phone + password" },
      { id: "park", label: "Verifications table", kind: "store", note: "password already hashed" },
      { id: "otp", label: "OTP check", kind: "guard", note: "attempts counted in REQUIRES_NEW" },
      { id: "user", label: "Create user", kind: "action", note: "only after the code matches" },
      { id: "jwt", label: "JWT session", kind: "step", note: "access + refresh" },
    ],
    flowCaption:
      "Sign-up in the customer auth service. The account does not exist until the guard passes.",
    decisions: [
      {
        title: "The account does not exist until the code is verified",
        body: "Sign-up parks the details in a verifications table with the password already hashed, and only writes to users once the OTP is confirmed. An unverified phone number can never reach a courier.",
      },
      {
        title: "Password reset cannot enumerate accounts",
        body: "An unknown identifier still receives a verification id and an identical response shape — a decoy whose code simply never matches. There is no observable difference between a real account and a fake one.",
      },
      {
        title: "Failed-attempt counters commit on their own",
        body: "A rejection ends by throwing, which rolls the caller's transaction back. Recording attempts in a REQUIRES_NEW transaction is the only reason the login lockout and OTP attempt limit are reachable at all.",
      },
      {
        title: "Google sends an ID token, not a profile",
        body: "Trusting a client-supplied profile would let anyone claim any email address. The service verifies the ID token against Google's own signing keys instead.",
      },
      {
        title: "One error envelope, mapped to form fields",
        body: "Every error carries a field name matching the client's form, so a failed request lands on the input that caused it rather than becoming a generic toast.",
      },
    ],
    outcome: [
      "Authentication service designed and built end to end: ten endpoints, Flyway-managed schema, JWT sessions and OTP verification.",
      "Test suite runs against an embedded Postgres the build downloads itself — no Docker daemon required.",
      "Organisation split into customer, restaurant, delivery-partner and admin surfaces, each with its own frontend and backend repository.",
    ],
    links: [
      { label: "Velobite on GitHub (repositories private)", href: "https://github.com/velobite" },
    ],
  },
  {
    slug: "auto-apply",
    title: "Auto Apply",
    thesis:
      "An agent that reads job posts and applies on my behalf — with no language model anywhere in the decision path.",
    role: "Solo build",
    period: "2026",
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
    facts: [
      { value: "0", label: "LLM calls in the decision path" },
      { value: "5", label: "terminal states for every message" },
      { value: "1", label: "process runs UI, API, listener and scanner" },
    ],
    problem:
      "Job posts arrive in private Telegram channels faster than anyone can read them. Some give an HR email, some link a Google Form. Applying is mechanical — but it sends real email and submits real forms in my name, so a wrong action is not a bad answer on a screen, it is a message I cannot take back.",
    constraints: [
      "Every outbound action must be explainable from the input text alone.",
      "Anything ambiguous goes to a human, not to a best guess.",
      "One command must set up and run the whole system.",
    ],
    flow: [
      { id: "tg", label: "Telegram channels", kind: "source", note: "MTProto user client" },
      { id: "parse", label: "Rule-based parser", kind: "step", note: "regex + keyword heuristics" },
      { id: "review", label: "Review queue", kind: "guard", note: "human confirms or corrects" },
      { id: "act", label: "Email or form submit", kind: "action", note: "SMTP · Google Forms" },
      {
        id: "state",
        label: "State tracker",
        kind: "store",
        note: "review → applied / failed / manual / skipped",
      },
    ],
    flowCaption:
      "The parser proposes, the review queue decides, and only then does anything leave the machine.",
    decisions: [
      {
        title: "Rules, not a model, decide what to send",
        body: "A probabilistic parser that is right 98% of the time sends a wrong application every fifty posts. Regex and keyword heuristics are less clever, but every extraction can be traced to the characters that produced it — and when they miss, they miss visibly.",
      },
      {
        title: "Every message ends in exactly one of five states",
        body: "Review, applied, failed, manual or skipped. Nothing is silently dropped, so the dashboard is an audit trail rather than a log.",
      },
      {
        title: "Forms are fetched and filled programmatically",
        body: "Google Form links are fetched, matched against the saved profile and submitted directly, so the agent covers both of the ways posts ask people to apply.",
      },
      {
        title: "One process, no second server",
        body: "Next.js serves the dashboard and the API, and its instrumentation hook starts the Telegram listener and the career-page scan once per server process — so there is no worker to forget to start, and storage switches from local SQLite to Postgres with one environment variable.",
      },
    ],
    outcome: [
      "Listens to live channels with a review dashboard in front of every outbound action.",
      "Both application paths — HR email with résumé attached, and Google Form submission — handled end to end.",
    ],
    links: [{ label: "Source on GitHub", href: repo("auto_apply") }],
    sandbox: true,
  },
  {
    slug: "blogx",
    title: "BlogX",
    thesis:
      "A blog platform built the way a product is: authentication, authorisation, rate limits and logs first, features second.",
    role: "Solo build",
    period: "Feb — Jun 2026",
    stack: [
      "Next.js 15",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Neon",
      "Railway",
      "Vercel",
      "TypeScript",
    ],
    facts: [
      { value: "3", label: "managed platforms in production" },
      { value: "2", label: "token types, with refresh rotation" },
      { value: "98%", label: "of the codebase in TypeScript" },
    ],
    problem:
      "Most blog tutorials stop at CRUD. The interesting part of a multi-user product is everything around it: who is allowed to do what, how sessions survive and expire, and how you find out what went wrong in production without guessing.",
    constraints: [
      "Public feed and private authoring dashboard share one API.",
      "Frontend, API and database each run on a different managed platform.",
      "Failures in production must be diagnosable from logs alone.",
    ],
    flow: [
      { id: "web", label: "Next.js frontend", kind: "source", note: "Vercel" },
      { id: "limit", label: "Rate limiter", kind: "guard", note: "per-client request budget" },
      { id: "auth", label: "JWT + RBAC", kind: "guard", note: "refresh rotation, role checks" },
      { id: "api", label: "NestJS API", kind: "step", note: "Railway, structured logs" },
      { id: "db", label: "Postgres via Prisma", kind: "store", note: "Neon serverless" },
    ],
    flowCaption:
      "Two guards stand between the internet and the data, and both are visible in the logs.",
    decisions: [
      {
        title: "Refresh tokens rotate on every use",
        body: "A stolen refresh token is only good until its owner next refreshes, which shrinks the window an attacker has without forcing anyone to log in more often.",
      },
      {
        title: "Roles are enforced on every route, not in the UI",
        body: "The dashboard hides what a reader cannot do, but the API is the thing that actually refuses — so a crafted request gets the same answer as a button that is not there.",
      },
      {
        title: "Structured logging from the first commit",
        body: "Logs are machine-readable events with request context, so a production failure on Railway can be traced without reproducing it locally.",
      },
    ],
    outcome: [
      "Live in production across Vercel, Railway and Neon.",
      "Public social feed and authenticated private dashboard on one API.",
    ],
    links: [
      { label: "Live site", href: "https://blog-app-iota-wine-74.vercel.app" },
      { label: "Source on GitHub", href: repo("blog_application") },
    ],
  },
  {
    slug: "ai-course-builder",
    title: "AI Mini-Course Generator",
    thesis:
      "Type a topic, get a course — because the model fills a fixed schema instead of writing free-form prose.",
    role: "Solo build",
    period: "2025 — 2026",
    stack: [
      "FastAPI",
      "MongoDB",
      "React",
      "Gemini API",
      "YouTube Data API",
      "GitHub Actions",
      "Docker",
    ],
    facts: [
      { value: "hours → seconds", label: "to author a course" },
      { value: "−40%", label: "release cycle time with CI/CD on GitHub Actions" },
    ],
    problem:
      "A language model will happily write three paragraphs about any topic. A course needs more than that: ordered lessons, runnable examples, supporting material and a way to check understanding — and all of it has to render and grade without a human tidying it up.",
    constraints: [
      "Output must render directly as lessons, code blocks and a quiz.",
      "Quizzes must grade automatically, so answers need a known shape.",
      "Courses persist per user behind authentication.",
    ],
    flow: [
      { id: "topic", label: "Topic prompt", kind: "source" },
      { id: "gen", label: "Gemini generation", kind: "step", note: "structured output" },
      { id: "schema", label: "Course schema", kind: "guard", note: "lessons · code · quiz" },
      { id: "yt", label: "Video enrichment", kind: "step", note: "YouTube Data API, summarised" },
      { id: "save", label: "Saved course", kind: "store", note: "MongoDB, per user" },
    ],
    flowCaption:
      "The schema is the guard: anything that does not fit the contract never reaches the page.",
    decisions: [
      {
        title: "A contract instead of a prompt",
        body: "The model fills a course schema — lessons, code, quiz — rather than free-forming prose. That is what makes the result renderable and gradeable without post-editing.",
      },
      {
        title: "Enrichment happens after generation",
        body: "Video suggestions are matched to finished lessons, so supporting material follows the course structure instead of steering it.",
      },
    ],
    outcome: [
      "Any topic becomes a multi-lesson course with code examples, matched videos and an instantly graded quiz.",
      "Courses persist to a personal dashboard behind JWT authentication.",
    ],
    links: [{ label: "Source on GitHub", href: repo("ai_course_builder") }],
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
