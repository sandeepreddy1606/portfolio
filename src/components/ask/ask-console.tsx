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
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
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
        body: JSON.stringify({ messages: history.slice(-6) }),
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

  return (
    <div
      className={cn(
        "border-line-strong bg-surface/80 relative rounded-xl border backdrop-blur-sm",
        className,
      )}
    >
      {turns.length > 0 && (
        <div
          className="border-line flex max-h-[min(60vh,28rem)] flex-col gap-6 overflow-y-auto border-b px-5 py-5 sm:px-6"
          aria-live="polite"
          aria-busy={busy}
          data-lenis-prevent
        >
          {turns.map((turn, i) =>
            turn.role === "user" ? (
              <p key={i} className="text-ink font-medium">
                {turn.content}
              </p>
            ) : (
              <Answer key={i} text={turn.content} streaming={busy && turn === lastAnswer} />
            ),
          )}
        </div>
      )}

      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          void ask(draft);
        }}
        className="flex items-end gap-3 px-4 py-3 sm:px-5"
      >
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
          placeholder={turns.length ? "Ask a follow-up" : "Ask anything about my work"}
          className="placeholder:text-ink-subtle field-sizing-content max-h-40 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-base outline-none"
        />
        {turns.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="Start a new conversation"
            className="text-ink-subtle hover:text-ink grid size-10 shrink-0 place-items-center rounded-md transition-colors"
          >
            <RotateCcw className="size-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          aria-label="Ask"
          className="bg-accent text-accent-ink grid size-10 shrink-0 place-items-center rounded-md transition-opacity disabled:opacity-40"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      {turns.length === 0 && (
        <ul className="flex flex-wrap gap-2 px-4 pb-4 sm:px-5" aria-label="Suggested questions">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => void ask(s)}
                className="border-line text-ink-muted hover:text-ink hover:border-line-strong rounded-md border px-3 py-1.5 text-left text-sm transition-colors"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
