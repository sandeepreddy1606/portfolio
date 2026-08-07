import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { ActivitySection } from "@/components/sections/github";

// Everything below the fold is code-split — the hero and about section carry
// the first paint, the rest arrives as the user scrolls toward it.
const Experience = dynamic(() =>
  import("@/components/sections/experience").then((m) => m.Experience),
);
const Venture = dynamic(() => import("@/components/sections/venture").then((m) => m.Venture));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const AiProjects = dynamic(() =>
  import("@/components/sections/ai-projects").then((m) => m.AiProjects),
);
const TechStack = dynamic(() =>
  import("@/components/sections/tech-stack").then((m) => m.TechStack),
);
const Achievements = dynamic(() =>
  import("@/components/sections/achievements").then((m) => m.Achievements),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Venture />
      <Projects />
      <AiProjects />
      <TechStack />
      <ActivitySection />
      <Achievements />
      <Testimonials />
      <Contact />
    </>
  );
}
