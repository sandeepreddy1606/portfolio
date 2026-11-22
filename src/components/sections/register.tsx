import { Section, SectionHeading } from "@/components/ui/section";
import { AskConsole } from "@/components/ask/ask-console";

/**
 * The Ask assistant as a signal register: the ledger a signal box keeps of
 * every movement. Questions are entered as numbered entries and answers are
 * written in below them, citing the page that backs each claim.
 */
export function Register() {
  return (
    <Section id="register" className="enamel">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading
          title="Ask the register"
          description="Write a question about my work. Answers come only from what's on this site, cite where they came from, and say so when the answer isn't here."
        />
        <AskConsole />
      </div>
    </Section>
  );
}
