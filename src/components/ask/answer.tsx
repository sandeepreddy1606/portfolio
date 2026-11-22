import Link from "next/link";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { getEntry } from "@/lib/knowledge";
import { SITE } from "@/constants/site";

/**
 * Renders an assistant answer. Plain text, except for [[ref]] markers, which
 * become links to the thing being cited. Unknown refs are dropped rather than
 * shown, so a model that invents a ref produces no broken card.
 */

const REF = /\[\[([a-z]+(?::[a-z0-9-]+)?)\]\]/g;

export function parseAnswer(text: string) {
  const refs: string[] = [];
  const prose = text.replace(REF, (_, ref: string) => {
    if (!refs.includes(ref)) refs.push(ref);
    return "";
  });
  // While streaming, a half-written marker like "[[work:vel" should not flash.
  const clean = prose
    .replace(/\[\[[^\]]*$/, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  return { prose: clean, refs };
}

export function Answer({ text, streaming }: { text: string; streaming: boolean }) {
  const { prose, refs } = parseAnswer(text);
  const paragraphs = prose.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <div className="prose-serif flex flex-col gap-3 text-[1.0625rem] leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
            {streaming && i === paragraphs.length - 1 && <Caret />}
          </p>
        ))}
        {streaming && paragraphs.length === 0 && (
          <p className="text-ink-subtle">
            Reading the portfolio
            <Caret />
          </p>
        )}
      </div>

      {refs.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Sources">
          {refs.map((ref) => (
            <li key={ref}>
              <RefLink refId={ref} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="bg-accent ml-0.5 inline-block h-[1.05em] w-[0.45em] translate-y-[0.15em] animate-[caret_1s_steps(1)_infinite]"
    />
  );
}

const chip =
  "border-line-strong hover:border-accent text-ink inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors";

function RefLink({ refId }: { refId: string }) {
  if (refId === "resume") {
    return (
      <a href={SITE.resumeUrl} download className={chip}>
        <Download className="size-3.5" /> Download résumé
      </a>
    );
  }
  if (refId === "contact") {
    return (
      <Link href="/#contact" className={chip}>
        <Mail className="size-3.5" /> Contact Sandeep
      </Link>
    );
  }

  const entry = getEntry(refId);
  if (!entry) return null;

  const label = (
    <>
      <span className="text-ink-subtle">{KIND_LABEL[entry.kind]}</span>
      {entry.title}
    </>
  );

  if (!entry.href) return <span className={chip}>{label}</span>;

  const external = entry.href.startsWith("http");
  return external ? (
    <a href={entry.href} target="_blank" rel="noopener noreferrer" className={chip}>
      {label}
      <ArrowUpRight className="size-3.5 opacity-60" />
    </a>
  ) : (
    <Link href={entry.href} className={chip}>
      {label}
    </Link>
  );
}

const KIND_LABEL = {
  case: "Case study",
  project: "Project",
  role: "Experience",
  achievement: "Achievement",
  profile: "Profile",
} as const;
