"use client";

import * as React from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Answer } from "./answer";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is he building right now?",
  "Why doesn't Auto Apply use an LLM?",
  "How does he handle authentication?",
  "Has he worked with computer vision?",
];

/* Hand-off from the command palette. Same page: an event. Another page: the
   question waits in sessionStorage until the console mounts on the home page. */
const ASK_EVENT = "ask:question";
const PENDING_KEY = "ask:pending";

export function askAboutWork(question: string, navigateHome: () => void) {
  if (document.getElementById("ask-input")) {
    window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: question }));
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  try {
    sessionStorage.setItem(PENDING_KEY, question);
  } catch {
    /* storage unavailable — the question is simply dropped */
  }
  navigateHome();
}

export function AskConsole({ className }: { className?: string }) {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const formId = React.useId();

  // `ask` changes every render; the listener always calls the latest one.
  const askRef = React.useRef<(q: string) => void>(() => {});

  React.useEffect(() => {
    const onQuestion = (e: Event) => askRef.current((e as CustomEvent<string>).detail);
    window.addEventListener(ASK_EVENT, onQuestion);

    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* storage unavailable */
    }
    // Deferred so it runs after every effect in this commit — including the
    // one below that points askRef at the live `ask`.
    if (pending) queueMicrotask(() => askRef.current(pending));

    return () => {
      window.removeEventListener(ASK_EVENT, onQuestion);
      abortRef.current?.abort();
    };
  }, []);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;

    const history: Turn[] = [...turns, { role: "user", content: q }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const append = (text: string) =>
      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + text };
        return next;
      });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep the request small: the last few turns are enough context.
        // Keep the request small, skip empty turns (an aborted answer), and
        // send an odd number so the window always opens on a user message —
        // the API rejects a conversation that starts with the assistant.
        body: JSON.stringify({
          messages: history.filter((t) => t.content.trim()).slice(-5),
        }),
        signal: controller.signal,
      });

      if (!res.body) {
        append(await res.text());
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        append(decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        append("The question didn't reach the server. Check your connection and ask again.");
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  React.useEffect(() => {
    askRef.current = (q) => void ask(q);
  });

  function reset() {
    abortRef.current?.abort();
    setTurns([]);
    setBusy(false);
    inputRef.current?.focus();
  }

  const lastAnswer = turns.at(-1);
  // Pair the turns into register entries: question + its answer.
  const entries: { q: string; a: string; last: boolean }[] = [];
  for (let i = 0; i < turns.length; i += 2) {
    entries.push({
      q: turns[i].content,
      a: turns[i + 1]?.content ?? "",
      last: turns[i + 1] === lastAnswer,
    });
  }
  const serial = (n: number) => String(n).padStart(3, "0");

  return (
    <div
      className={cn(
        "border-line-strong bg-elevated relative overflow-hidden rounded-md border shadow-[0_18px_34px_-26px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      {/* The ledger's red margin rule, between the serial and the entry. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[4.375rem] w-px bg-[#b3261e]/45 sm:left-[5.875rem]"
      />
      {/* Column heads, as printed at the top of every register page. */}
      <div
        aria-hidden
        className="border-line-strong text-ink-subtle grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 border-b px-4 py-2.5 text-xs font-semibold sm:grid-cols-[4rem_minmax(0,1fr)] sm:px-6"
      >
        <span>No.</span>
        <span className="pl-1">Question, and the answer entered against it</span>
      </div>
      {entries.length > 0 && (
        <ol
          className="max-h-[min(70vh,36rem)] overflow-y-auto"
          aria-live="polite"
          aria-busy={busy}
          data-lenis-prevent
        >
          {entries.map((entry, i) => (
            <li
              key={i}
              className="border-line grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 border-b px-4 py-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:px-6"
            >
              <span className="text-ink-subtle pt-0.5 font-mono text-xs tabular-nums">
                {serial(i + 1)}
              </span>
              <div className="min-w-0">
                <p className="text-ink font-semibold">{entry.q}</p>
                <div className="mt-3">
                  <Answer text={entry.a} streaming={busy && entry.last} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          void ask(draft);
        }}
        className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-3 px-4 py-4 sm:grid-cols-[4rem_minmax(0,1fr)] sm:px-6"
      >
        <span className="text-ink-subtle pt-3 font-mono text-xs tabular-nums" aria-hidden>
          {serial(entries.length + 1)}
        </span>
        <div className="flex min-w-0 items-end gap-2">
          <label htmlFor="ask-input" className="sr-only">
            Ask a question about Sandeep&apos;s work
          </label>
          <textarea
            ref={inputRef}
            id="ask-input"
            rows={1}
            value={draft}
            maxLength={500}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(draft);
              }
            }}
            placeholder={
              entries.length ? "Write a follow-up question" : "Write a question about my work"
            }
            className="border-line-strong placeholder:text-ink-subtle focus-visible:border-ink field-sizing-content max-h-40 min-h-11 min-w-0 flex-1 resize-none border-b bg-transparent py-2.5 text-base outline-none"
          />
          {entries.length > 0 && (
            <button
              type="button"
              onClick={reset}
              aria-label="Start a new page in the register"
              className="text-ink-subtle hover:text-ink grid size-10 shrink-0 place-items-center rounded-md transition-colors"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="bg-accent text-accent-ink inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md px-3.5 text-sm font-bold transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" /> Ask
          </button>
        </div>
      </form>

      {entries.length === 0 && (
        <div className="border-line border-t py-4 pr-4 pl-[5.125rem] sm:pr-6 sm:pl-[6.625rem]">
          <p className="text-ink-subtle text-sm">Try one of these</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => void ask(s)}
                  className="border-line-strong text-ink-muted hover:text-ink hover:border-ink rounded-md border px-3 py-1.5 text-left text-sm transition-colors"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
