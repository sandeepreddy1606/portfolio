import "server-only";

/**
 * Visitor counter storage: Upstash Redis over its REST API (no SDK needed).
 * INCR is atomic, so simultaneous visitors are never double-counted or lost.
 *
 * Configure by connecting Upstash Redis to the Vercel project (Storage →
 * Upstash for Redis), which injects KV_REST_API_URL / KV_REST_API_TOKEN, or
 * set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN directly. Without
 * them the counter reports itself disabled and the footer shows nothing.
 *
 * Stores two integers and nothing else — no IPs, no user agents.
 */

const KEY_VISITORS = "portfolio:visitors";
const KEY_VIEWS = "portfolio:views";

function config() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export const countingEnabled = () => config() !== null;

/** Runs Redis commands in one round trip; returns each command's result. */
async function pipeline(commands: (string | number)[][]): Promise<(number | null)[]> {
  const cfg = config();
  if (!cfg) throw new Error("Visitor counter storage is not configured.");
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  return data.map((d) => {
    if (d.error) throw new Error(d.error);
    const n = Number(d.result);
    return Number.isFinite(n) ? n : null;
  });
}

export type Counts = { visitors: number; views: number };

/** A brand-new visitor: one more visitor and one more view. Returns their number. */
export async function recordNewVisitor(): Promise<Counts> {
  const [visitors, views] = await pipeline([
    ["INCR", KEY_VISITORS],
    ["INCR", KEY_VIEWS],
  ]);
  return { visitors: visitors ?? 0, views: views ?? 0 };
}

/** A returning visitor's new session: one more view. */
export async function recordView(): Promise<Counts> {
  const [visitors, views] = await pipeline([
    ["GET", KEY_VISITORS],
    ["INCR", KEY_VIEWS],
  ]);
  return { visitors: visitors ?? 0, views: views ?? 0 };
}

/** Read the counts without changing them. */
export async function readCounts(): Promise<Counts> {
  const [visitors, views] = await pipeline([
    ["GET", KEY_VISITORS],
    ["GET", KEY_VIEWS],
  ]);
  return { visitors: visitors ?? 0, views: views ?? 0 };
}
