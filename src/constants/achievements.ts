import type { Achievement, Testimonial } from "@/types";
import { SITE } from "./site";

/**
 * Verified from public sources only. Add certifications, awards and hackathon
 * placements here — `kind` selects the icon and accent in the card grid.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "jpmc-forage",
    title: "Software Engineering Virtual Experience",
    issuer: "JPMorgan Chase & Co. · Forage",
    date: "Jun 2024",
    kind: "program",
    description:
      "Completed all three engineering tasks — repairing a live stock-price data feed, bridging a Python backend to a React frontend, and building the trading dashboard chart that surfaces price ratios against their historical bounds.",
  },
  {
    id: "leetcode-100-days",
    title: "100 Days Badge 2025",
    issuer: "LeetCode",
    date: "Oct 2025",
    kind: "award",
    description:
      "Awarded for solving problems on 100 separate days in a single year — earned alongside the 50 Days badge in June. Most of the practice is in Java, with a steady share of medium problems.",
    href: `https://leetcode.com/u/${SITE.leetcodeUsername}/`,
  },
  {
    id: "shipped-ai",
    title: "Five production AI applications",
    issuer: "Independent",
    date: "2025 — 2026",
    kind: "award",
    description:
      "Auto Apply, AI Mini-Course Generator, AI Document Assistant, YouTube Summarizer Bot and the Whisper transcriber — each shipped with setup documentation and a working deployment path.",
  },
  {
    id: "polyglot",
    title: "Six languages in production repositories",
    issuer: "GitHub",
    date: "2023 — 2026",
    kind: "open-source",
    description:
      "Python, TypeScript, JavaScript, Dart, Java and PHP across 24 public repositories — chosen per problem rather than per habit.",
    href: `https://github.com/${SITE.githubUsername}?tab=repositories`,
  },
  {
    id: "fullstack-deploy",
    title: "Multi-cloud production deployment",
    issuer: "Vercel · Railway · Neon",
    date: "Feb 2026",
    kind: "certification",
    description:
      "BlogX runs across three managed platforms simultaneously — Next.js on Vercel, NestJS on Railway, serverless Postgres on Neon — with JWT refresh rotation, RBAC and rate limiting in front of it.",
    href: "https://blog-app-iota-wine-74.vercel.app",
  },
  {
    id: "mobile-suite",
    title: "Three-app mobile marketplace",
    issuer: "Independent",
    date: "Sep 2025",
    kind: "award",
    description:
      "Designed and shipped customer, delivery-partner and admin Flutter clients against a single shared Firebase data model, keeping order state consistent in realtime across all three.",
  },
  {
    id: "oss-contrib",
    title: "Open-source contribution",
    issuer: "ImprovedTube",
    date: "Oct 2025",
    kind: "open-source",
    description:
      "Contributing to a long-standing browser extension with 200+ configurable options for YouTube playback, discovery and player behaviour.",
    href: "http://improvedtube.com",
  },
];

/**
 * Certifications from LinkedIn could not be added — LinkedIn returns HTTP 999
 * to every automated client, so its certifications list is unreadable from here.
 * Paste them in as new entries with `kind: "certification"`.
 */

/**
 * Intentionally empty — the section is hidden until real, attributable quotes
 * exist. Adding an entry renders the whole section automatically.
 *
 * Shape: { id, quote, name, role, company, avatarInitials }
 */
export const TESTIMONIALS: Testimonial[] = [];
