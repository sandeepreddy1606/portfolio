"use client";

import * as React from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A simplified, in-browser replay of how Auto Apply reads a job post.
 *
 * It mirrors the approach — regex and keyword rules, every extraction traceable
 * to the characters that produced it — not the production rule set. Nothing
 * here sends anything: the last step is always the review queue.
 */

const SAMPLES = [
  {
    name: "Post with an HR email",
    text: `We're hiring! Backend Developer (Python, FastAPI)
Experience: 1-3 years
Location: Hyderabad / Hybrid
Send your resume to careers@acme-labs.example with the subject "Backend Developer".`,
  },
  {
    name: "Post with a Google Form",
    text: `Opening: Full Stack Engineer — React + Node.js
Freshers and 0-2 years welcome. Remote.
Apply here: https://forms.gle/AbCdEf123
Last date: Friday`,
  },
  {
    name: "Ambiguous post",
    text: `Great opportunity at a fast-growing startup!
DM me if you're interested in AI roles. Referrals open.`,
  },
];

type Kind = "email" | "form" | "role" | "experience" | "location";

const RULES: { kind: Kind; label: string; re: RegExp }[] = [
  { kind: "email", label: "HR email", re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g },
  {
    kind: "form",
    label: "Google Form",
    re: /https?:\/\/(?:forms\.gle\/\w+|docs\.google\.com\/forms\/[^\s]+)/g,
  },
  {
    kind: "role",
    label: "Role",
    re: /(?:developer|engineer|intern|analyst|designer|scientist)(?:\s*\([^)]*\))?/gi,
  },
  {
    kind: "experience",
    label: "Experience",
    re: /\b(?:freshers?|\d+\s*(?:-|to)\s*\d+\s*(?:years|yrs)|\d+\+?\s*(?:years|yrs))\b/gi,
  },
  {
    kind: "location",
    label: "Location",
    re: /\b(?:remote|hybrid|on-?site|hyderabad|bengaluru|bangalore|chennai|pune|mumbai|delhi)\b/gi,
  },
];

type Hit = { kind: Kind; start: number; end: number; value: string };

function parse(text: string) {
  const hits: Hit[] = [];
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      // First rule to claim a span wins, so a URL is never also a "role".
      if (hits.some((h) => start < h.end && end > h.start)) continue;
      hits.push({ kind: rule.kind, start, end, value: m[0] });
    }
  }
  hits.sort((a, b) => a.start - b.start);

  const first = (k: Kind) => hits.find((h) => h.kind === k)?.value;
  const form = first("form");
  const email = first("email");

  const action = form
    ? {
        kind: "form" as const,
        text: `Fetch the form at ${form}, fill it from the saved profile, submit`,
      }
    : email
      ? { kind: "email" as const, text: `Send the templated application with résumé to ${email}` }
      : null;

  return { hits, action, role: first("role") };
}

const HIT_STYLE: Record<Kind, string> = {
  email: "bg-accent-soft text-accent",
  form: "bg-accent-soft text-accent",
  role: "bg-verify-soft text-verify",
  experience: "bg-verify-soft text-verify",
  location: "bg-verify-soft text-verify",
};

export function ParserSandbox() {
  const [text, setText] = React.useState(SAMPLES[0].text);
  const { hits, action, role } = React.useMemo(() => parse(text), [text]);

  const segments: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.start > cursor) segments.push(text.slice(cursor, h.start));
    segments.push(
      <mark key={i} className={cn("rounded-sm px-0.5", HIT_STYLE[h.kind])}>
        {text.slice(h.start, h.end)}
      </mark>,
    );
    cursor = h.end;
  });
  segments.push(text.slice(cursor));

  return (
    <div className="border-line-strong bg-surface/60 rounded-xl border">
      <div className="border-line flex flex-wrap items-center gap-2 border-b px-5 py-3">
        <span className="text-ink-subtle mr-1 text-sm">Try a post:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setText(s.text)}
            aria-pressed={text === s.text}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition-colors",
              text === s.text
                ? "border-accent text-ink"
                : "border-line text-ink-muted hover:text-ink",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-line flex flex-col border-b p-5 lg:border-r lg:border-b-0">
          <label htmlFor="sandbox-post" className="text-ink-subtle text-xs">
            Incoming message (editable)
          </label>
          <textarea
            id="sandbox-post"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="bg-canvas/60 border-line focus-visible:border-accent mt-2 flex-1 resize-y rounded-md border p-3 font-mono text-[13px] leading-relaxed outline-none"
            data-lenis-prevent
          />
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div>
            <p className="text-ink-subtle text-xs">What the rules matched</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
              {segments}
            </p>
          </div>

          <div className="border-line border-t pt-4">
            <p className="text-ink-subtle text-xs">Proposed action</p>
            {action ? (
              <p className="text-accent mt-2 flex gap-2 text-sm">
                <Zap className="mt-0.5 size-4 shrink-0" aria-hidden />
                {action.text}
                {role ? ` for “${role}”` : ""}.
              </p>
            ) : (
              <p className="text-ink-muted mt-2 text-sm">
                No email and no form link — nothing to act on. Marked{" "}
                <span className="text-ink font-mono">manual</span> for a person to read.
              </p>
            )}
            <p className="text-verify mt-3 flex gap-2 text-sm">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
              {action
                ? "Held in the review queue until a person confirms it. This demo never sends anything."
                : "Nothing is queued to send."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
