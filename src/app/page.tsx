import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { Register } from "@/components/sections/register";
import { SelectedWork } from "@/components/sections/selected-work";
import { Principles } from "@/components/sections/principles";
import { ProofSection } from "@/components/sections/github";

// The hero and the work carry the first impression; the timeline and contact
// form are client-heavy and arrive as the reader scrolls toward them.
const Experience = dynamic(() =>
  import("@/components/sections/experience").then((m) => m.Experience),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

/**
 * The page alternates the panel (green) and enamel (cream) faces: the claim
 * and its live proof, the register, the work, the rule book, the record, the
 * evidence, and how to reach him.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Register />
      <SelectedWork />
      <Principles />
      <Experience />
      <ProofSection />
      <Testimonials />
      <Contact />
    </>
  );
}
