import { SiGithub, SiGmail, SiLeetcode } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import type { NavItem, SocialLink } from "@/types";

/**
 * Single source of truth for identity-level content.
 *
 * Sources: the public GitHub profile (github.com/sandeepreddy1606), the LeetCode
 * profile (leetcode.com/u/BSReddy1606), and contact details supplied directly.
 * LinkedIn refuses all automated requests (HTTP 999), so nothing here was read
 * from it — see `avatar` below for the one asset that still needs you.
 */
export const SITE = {
  name: "Sandeep Reddy Bijavemula",
  shortName: "Sandeep Reddy",
  initials: "SR",
  role: "Full-Stack & AI Engineer",
  location: "India",
  timezone: "Asia/Kolkata",
  email: "bsreddy1606@gmail.com",
  phone: "+91 96661 31184",
  /** Digits only — used for the `tel:` href. */
  phoneHref: "+919666131184",
  availability: "Open to full-time & freelance work",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sandeepreddy.dev",
  githubUsername: "sandeepreddy1606",
  linkedinUsername: "sandeepreddy1606",
  leetcodeUsername: "BSReddy1606",
  university: "Vellore Institute of Technology, Chennai",
  resumeUrl: "/resume.pdf",
  /**
   * Local portrait — cropped from the provided circular photo.
   * Both profile.jpg (JPEG, 95 % quality) and profile.png (lossless with
   * transparency) exist in public/. The .jpg is used because Next.js image
   * optimisation handles opaque photos more efficiently.
   */
  avatar: "/profile.jpg",
  tagline: "I build products where the interface and the intelligence are the same craft.",
  description:
    "Full-stack and AI engineer building production systems across LLM applications, autonomous agents, computer vision and cross-platform apps — with Next.js, FastAPI, NestJS, Spring Boot and Flutter.",
  keywords: [
    "Sandeep Reddy Bijavemula",
    "Full Stack Developer",
    "AI Engineer",
    "Next.js Developer",
    "FastAPI",
    "NestJS",
    "LLM Applications",
    "Computer Vision",
    "Flutter Developer",
    "Portfolio",
  ],
} as const;

export const SOCIALS: SocialLink[] = [
  {
    label: "GitHub",
    href: `https://github.com/${SITE.githubUsername}`,
    icon: SiGithub,
    handle: `@${SITE.githubUsername}`,
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/in/${SITE.linkedinUsername}/`,
    icon: FaLinkedin,
    handle: `in/${SITE.linkedinUsername}`,
  },
  {
    label: "LeetCode",
    href: `https://leetcode.com/u/${SITE.leetcodeUsername}/`,
    icon: SiLeetcode,
    handle: `@${SITE.leetcodeUsername}`,
  },
  {
    label: "Email",
    href: `mailto:${SITE.email}`,
    icon: SiGmail,
    handle: SITE.email,
  },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Skills", href: "/#skills", sectionId: "skills" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Venture", href: "/#venture", sectionId: "venture" },
  { label: "Work", href: "/#work", sectionId: "work" },
  { label: "AI", href: "/#ai", sectionId: "ai" },
  { label: "Activity", href: "/#activity", sectionId: "activity" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

/** Ids observed by the scroll-spy, in document order. */
export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "experience",
  "venture",
  "work",
  "ai",
  "stack",
  "activity",
  "achievements",
  "contact",
] as const;
