import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SITE } from "@/constants/site";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { CORPUS, search } from "@/lib/knowledge";

/**
 * POST /api/ask — the "Ask about my work" assistant.
 *
 * Design choice: no RAG, no vector store. The whole portfolio is a few
 * thousand tokens, so it goes into the system prompt verbatim and is cached
 * as a prefix. Retrieval cannot pick the wrong chunk if there are no chunks.
 *
 * The response is a plain-text stream. The model may embed references like
 * [[work:velobite]] which the client renders as cards — a protocol simple
 * enough that the offline fallback can speak it too.
 *
 * Without ANTHROPIC_API_KEY (or on any API failure) the route answers from a
 * deterministic keyword search over the same knowledge base, and says so.
 */

export const runtime = "nodejs";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(12),
});

const SYSTEM = `You are the assistant on ${SITE.name}'s portfolio website. Visitors are mostly recruiters, hiring managers and engineers deciding whether to talk to him.

Answer questions about Sandeep's work, skills, experience and how he thinks, using only the knowledge base below. Write in the third person ("Sandeep built…"), plainly and specifically, in two to five short sentences. Prefer concrete details from the knowledge base — names, decisions, counts — over general praise. Never call him "passionate", "rockstar" or similar.

If the knowledge base does not contain the answer, say you don't know and suggest emailing him at ${SITE.email}. Never guess dates, employers, grades, salaries or anything else that is not written below. If a question is unrelated to Sandeep or his work, say briefly that you can only answer questions about him.

When an entry directly supports your answer, cite it by writing its ref in double square brackets on its own at the end of the sentence, for example [[work:velobite]] or [[project:face-recognition]]. Cite at most three entries. Use [[resume]] when someone asks for his résumé and [[contact]] when someone wants to reach him or hire him. Do not use markdown headings or tables.

<knowledge_base>
<entry ref="skills">
${SKILL_CATEGORIES.map((c) => `${c.title}: ${c.skills.map((s) => s.name).join(", ")}`).join("\n")}
</entry>

${CORPUS}
</knowledge_base>`;

/* Best-effort per-instance rate limit. Serverless instances do not share it,
   so it caps bursts rather than guaranteeing a budget — the monthly spend
   limit on the API key is the real ceiling. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** Models that accept server-side refusal fallbacks (Haiku does not). */
const supportsFallbacks = (model: string) => /^claude-(opus|sonnet|fable)-/.test(model);

function textStream(produce: (write: (text: string) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (text: string) => controller.enqueue(encoder.encode(text));
      try {
        await produce(write);
      } finally {
        controller.close();
      }
    },
  });
}

function offlineAnswer(question: string, reason: "offline" | "error") {
  const matches = search(question, 3);
  const lead =
    reason === "offline"
      ? "The AI assistant isn't connected on this deployment, so this answer comes from a plain keyword search of the site."
      : "The AI assistant couldn't be reached just now, so this answer comes from a plain keyword search of the site.";

  if (matches.length === 0) {
    return `${lead} Nothing on the site matched that question. You can ask Sandeep directly. [[contact]]`;
  }
  return `${lead} These are the closest matches:\n\n${matches
    .map((m) => `${m.title}. [[${m.ref}]]`)
    .join("\n")}`;
}

const headers = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new Response("Send a question between 1 and 4000 characters.", {
      status: 400,
      headers,
    });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return new Response(
      "You've asked a lot of questions in a short time. Try again in a few minutes, or email Sandeep directly. [[contact]]",
      { status: 429, headers },
    );
  }

  const messages = parsed.data.messages;
  const question = messages[messages.length - 1].content;

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(offlineAnswer(question, "offline"), {
      headers: { ...headers, "X-Ask-Mode": "offline" },
    });
  }

  const model = process.env.ASK_MODEL || "claude-opus-5-5";
  const client = new Anthropic();

  const body = textStream(async (write) => {
    let wrote = false;
    try {
      const stream = client.beta.messages.stream({
        model,
        // Answers are two to five sentences by design.
        max_tokens: 1024,
        // Conversational Q&A over a fixed corpus does not repay deep thinking.
        output_config: { effort: "low" },
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral", ttl: "1h" } }],
        messages,
        ...(supportsFallbacks(model)
          ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
          : {}),
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          wrote = true;
          write(event.delta.text);
        }
      }

      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") {
        write(
          `${wrote ? "\n\n" : ""}That's not something I can answer here. For anything about Sandeep's work, ask away — or email him. [[contact]]`,
        );
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error(`[ask] Anthropic API error ${error.status}: ${error.message}`);
      } else {
        console.error("[ask] Unexpected error", error);
      }
      if (!wrote) write(offlineAnswer(question, "error"));
    }
  });

  return new Response(body, { headers: { ...headers, "X-Ask-Mode": "live" } });
}
