import type { Achievement, Testimonial } from "@/types";
import { SITE } from "./site";

/**
 * Achievements and certifications, from the résumé Sandeep supplied plus the
 * public LeetCode profile. Only real awards, ranks and credentials — projects
 * live in the Work section, not here.
 *
 * Certification links and dates: the résumé names each certificate but the
 * PDF's link targets were not available, so `href` and most `date` fields are
 * left empty until the verification URLs are added.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "audevday-t20dsa",
    title: "Top 5% — AUDEVDAY T20DSA Challenge",
    issuer: "AUDEVDAY",
    date: "May 2025",
    kind: "award",
    description: "Placed in the top 5% of a data structures and algorithms challenge.",
  },
  {
    id: "naukri-nat",
    title: "National Rank 1,323 — Naukri Campus National Aptitude Test",
    issuer: "Naukri Campus",
    date: "",
    kind: "award",
    description: "All-India rank 1,323 in Naukri Campus's national aptitude test.",
  },
  {
    id: "oci-ds-pro",
    title: "OCI 2025 Certified Data Science Professional",
    issuer: "Oracle",
    date: "2025",
    kind: "certification",
    description:
      "Oracle Cloud Infrastructure certification for building, training and deploying ML models on OCI Data Science.",
  },
  {
    id: "oci-ai-foundations",
    title: "OCI 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    date: "2025",
    kind: "certification",
    description:
      "Oracle Cloud Infrastructure certification covering AI, machine learning and generative AI fundamentals on OCI.",
  },
  {
    id: "azure-ai-900",
    title: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    date: "",
    kind: "certification",
    description: "Microsoft certification in AI workloads and Azure AI services.",
  },
  {
    id: "coursera-java-backend",
    title: "Data Structures and Backend with Java",
    issuer: "Coursera",
    date: "",
    kind: "certification",
    description: "Data structures and backend development in Java.",
  },
  {
    id: "worldquant-adsl",
    title: "Applied Data Science Lab",
    issuer: "WorldQuant University",
    date: "",
    kind: "certification",
    description: "Project-based applied data science programme.",
  },
  {
    id: "leetcode-100-days",
    title: "100 Days Badge 2025",
    issuer: "LeetCode",
    date: "Oct 2025",
    kind: "award",
    description:
      "Awarded for solving problems on 100 separate days in a single year — earned alongside the 50 Days badge in June.",
    href: `https://leetcode.com/u/${SITE.leetcodeUsername}/`,
  },
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
    kind: "award",
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
 * Intentionally empty — the section is hidden until real, attributable quotes
 * exist. Adding an entry renders the whole section automatically.
 *
 * Shape: { id, quote, name, role, company, avatarInitials }
 */
export const TESTIMONIALS: Testimonial[] = [];
