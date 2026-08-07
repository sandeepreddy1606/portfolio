import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
  /** Section id used by the scroll-spy indicator. Absent for off-page routes. */
  sectionId?: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  handle: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  skills: Skill[];
};

export type Skill = {
  name: string;
  icon: IconType;
  /** Brand colour, used only for the hover glow so the grid stays monochrome at rest. */
  color: string;
};

export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  organisation: string;
  kind: "role" | "program" | "milestone" | "education";
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type ProjectCategory = "ai" | "fullstack" | "mobile" | "systems";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  category: ProjectCategory;
  featured: boolean;
  /** Drives the generated cover artwork — no binary assets required. */
  accent: [string, string];
  features: string[];
  stack: string[];
  repo?: string;
  demo?: string;
  caseStudy?: string;
  metrics?: { label: string; value: string }[];
};

export type AiProject = {
  slug: string;
  title: string;
  discipline: "LLM" | "Agents" | "Computer Vision" | "NLP" | "Speech" | "Automation";
  summary: string;
  /** Ordered pipeline stages rendered as an architecture strip. */
  architecture: string[];
  stack: string[];
  repo?: string;
};

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  kind: "certification" | "program" | "open-source" | "award" | "research";
  description: string;
  href?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarInitials: string;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export type BlogPost = BlogPostMeta & { html: string };

export type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  memberSince: string;
  languages: { name: string; percentage: number; bytes: number }[];
  repos: {
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    url: string;
    updatedAt: string;
  }[];
};

export type VentureSurface = {
  name: string;
  audience: string;
  description: string;
  frontendRepo: string;
  backendRepo: string;
  icon: LucideIcon;
};

export type VentureDecision = {
  title: string;
  body: string;
};

export type Venture = {
  name: string;
  status: string;
  tagline: string;
  summary: string;
  period: string;
  org: string;
  orgUrl: string;
  teamSize: string;
  repoCount: number;
  surfaces: VentureSurface[];
  decisions: VentureDecision[];
  stack: { label: string; items: string[] }[];
};

export type LeetcodeStats = {
  username: string;
  profileUrl: string;
  ranking: number;
  school: string | null;
  solved: { total: number; easy: number; medium: number; hard: number };
  streak: number;
  activeDays: number;
  languages: { name: string; solved: number }[];
  topics: { name: string; solved: number }[];
  badges: { name: string; icon: string; date: string }[];
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
