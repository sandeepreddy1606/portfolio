"use client";

import * as React from "react";
import Link from "next/link";
import { checkFit, type FitResult } from "@/lib/fit";
import { SITE } from "@/constants/site";

/**
 * Paste a job description, see which requirements this site can prove and
 * which it can't. Runs entirely in the browser — the text never leaves the
 * page, which matters when the JD is for an unannounced role.
 */
export function FitCheck() {
  const [jd, setJd] = React.useState("");
  const [result, setResult] = React.useState<FitResult | null>(null);

  const mailto = result
    ? `mailto:${SITE.email}?subject=${encodeURIComponent("A role that might fit")}&body=${encodeURIComponent(
        `Hi Sandeep,\n\nI ran your fit check against a role. It matched: ${result.matched
          .map((m) => m.name)
          .join(", ")}.\n\n`,
      )}`
    : "";

  return (
    <div className="border-line-strong bg-elevated rounded-md border">
      <form
        className="flex flex-col gap-3 p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkFit(jd));
        }}
      >
        <label htmlFor="fit-jd" className="font-display text-3xl font-extrabold uppercase">
          Check a role against this portfolio
        </label>
        <p id="fit-jd-help" className="text-ink-muted text-sm">
          Paste a job description. Each requirement is matched only against projects and roles on
          this site, and the text stays in your browser.
        </p>
        <textarea
          id="fit-jd"
          aria-describedby="fit-jd-help"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={5}
          placeholder="We're looking for an engineer with TypeScript, React and Node.js experience who has shipped LLM features…"
          className="border-line bg-canvas/60 placeholder:text-ink-subtle focus-visible:border-accent rounded-md border px-3.5 py-3 text-sm outline-none"
          data-lenis-prevent
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={jd.trim().length < 20}
            className="bg-accent text-accent-ink rounded-md px-4 py-2.5 text-sm font-bold transition-opacity disabled:opacity-40"
          >
            Check the fit
          </button>
          {result && (
            <button
              type="button"
              onClick={() => {
                setJd("");
                setResult(null);
              }}
              className="text-ink-muted hover:text-ink text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="border-line border-t p-5 sm:p-6" aria-live="polite">
          {result.total === 0 ? (
            <p className="text-ink-muted text-sm">
              No technical requirements were recognised in that text. Try pasting the full
              &ldquo;requirements&rdquo; section of the posting.
            </p>
          ) : (
            <>
              <p className="text-base">
                <span className="font-display text-2xl font-semibold">
                  {result.matched.length} of {result.total}
                </span>{" "}
                <span className="text-ink-muted">requirements have evidence on this site.</span>
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                {result.matched.map((m) => (
                  <li key={m.name} className="flex gap-3 text-sm">
                    <span
                      aria-hidden
                      className="bg-lamp-green mt-1.5 size-2.5 shrink-0 rounded-full"
                    />
                    <span className="min-w-0">
                      <span className="text-ink font-medium">{m.name}</span>
                      <span className="text-ink-subtle"> — </span>
                      {m.evidence.map((e, i) => (
                        <React.Fragment key={e.ref}>
                          {i > 0 && <span className="text-ink-subtle">, </span>}
                          {e.href && !e.href.startsWith("http") ? (
                            <Link
                              href={e.href}
                              className="text-ink-muted hover:text-ink underline-offset-4 hover:underline"
                            >
                              {e.title}
                            </Link>
                          ) : (
                            <span className="text-ink-muted">{e.title}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </li>
                ))}
                {result.missing.map((name) => (
                  <li key={name} className="flex gap-3 text-sm">
                    <span
                      aria-hidden
                      className="bg-lamp-red mt-1.5 size-2.5 shrink-0 rounded-full"
                    />
                    <span className="text-ink-subtle">
                      {name} — not shown on this site. Worth asking about directly.
                    </span>
                  </li>
                ))}
              </ul>

              {result.matched.length > 0 && (
                <a
                  href={mailto}
                  className="border-line-strong hover:border-accent mt-6 inline-flex rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Email Sandeep about this role
                </a>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
