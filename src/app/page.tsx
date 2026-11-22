import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
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
 * Six sections, in the order a reader decides: what he argues (hero), whether
 * the work backs it (work, principles), where it happened (experience), whether
 * it checks out (proof), and how to reach him (contact).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Principles />
      <Experience />
      <ProofSection />
      <Testimonials />
      <Contact />
    </>
  );
}
