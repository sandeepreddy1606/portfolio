import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";

export const metadata: Metadata = {
  title: "Project archive",
  description:
    "Every project Sandeep Reddy has shipped publicly — full-stack, AI, computer vision, speech and mobile — searchable by technology.",
  alternates: { canonical: "/work" },
};

export default function WorkArchivePage() {
  return <Projects />;
}
