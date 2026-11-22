import { Section, SectionHeading } from "@/components/ui/section";
import { AskConsole } from "@/components/ask/ask-console";

/**
 * The Ask assistant as a signal register: the ledger a signal box keeps of
 * every movement. Questions are entered as numbered entries and answers are
 * written in below them, citing the page that backs each claim.
 */
const PROMISES = [
  { lamp: "bg-lamp-green", text: "Every answer cites the page it came from." },
  { lamp: "bg-lamp-red", text: "If the answer isn't on this site, it says so — no guessing." },
  {
    lamp: "bg-lamp-amber",
    text: "Want the real thing? It hands you the résumé or a way to reach me.",
  },
];

export function Register() {
  return (
    <Section id="register" className="enamel">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeading
            title="Ask the register"
            description="Write a question about my work, and the answer is entered in the register below it."
          />
          <ul className="mt-8 flex flex-col gap-3">
            {PROMISES.map((p) => (
              <li key={p.text} className="text-ink-muted flex items-start gap-3 text-[15px]">
                <span aria-hidden className={`${p.lamp} mt-1.5 size-2.5 shrink-0 rounded-full`} />
                {p.text}
              </li>
            ))}
          </ul>
        </div>
        <AskConsole className="self-start" />
      </div>
    </Section>
  );
}
