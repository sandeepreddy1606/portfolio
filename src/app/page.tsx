import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Register } from "@/components/sections/register";
import { SelectedWork } from "@/components/sections/selected-work";
import { Principles } from "@/components/sections/principles";
import { ProofSection } from "@/components/sections/github";

// The first screens carry the first impression; the heavier client sections
// arrive as the reader scrolls toward them.
const TechStack = dynamic(() =>
  import("@/components/sections/tech-stack").then((m) => m.TechStack),
);
const AiProjects = dynamic(() =>
  import("@/components/sections/ai-projects").then((m) => m.AiProjects),
);
const Venture = dynamic(() => import("@/components/sections/venture").then((m) => m.Venture));
const Experience = dynamic(() =>
  import("@/components/sections/experience").then((m) => m.Experience),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

/**
 * Sections alternate the panel (green) and enamel (cream) faces: who he is,
 * what he works with, the register, the work and its rules, the AI systems,
 * the venture, the record, the evidence, and how to reach him.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <TechStack />
      <Register />
      <SelectedWork />
      <Principles />
      <AiProjects />
      <Venture />
      <Experience />
      <ProofSection />
      <Testimonials />
      <Contact />
    </>
  );
}
