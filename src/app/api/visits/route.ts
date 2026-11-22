import { NextResponse } from "next/server";
import { countingEnabled, readCounts, recordNewVisitor, recordView } from "@/lib/visits";

/**
 * GET  /api/visits — current counts, read only.
 * POST /api/visits — count this visit. Called once per browser session.
 *
 * A visitor's number lives in a cookie holding nothing but that number:
 * the first visit increments the visitor count and sets it; later sessions
 * only add a view. Crawlers and preview bots are not counted.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "sr_visitor";
const ONE_YEAR = 60 * 60 * 24 * 365;
const BOT =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python-requests|httpclient/i;

/* Per-instance cap on new visitors from one address, so clearing cookies in a
   loop cannot inflate the count quickly. Best effort across serverless instances. */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_NEW_PER_WINDOW = 5;
const recent = new Map<string, number[]>();
function tooManyNew(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_NEW_PER_WINDOW;
}

const noStore = { "Cache-Control": "no-store" };

/** The visitor's own number, from the cookie that holds nothing else. */
function visitorNumber(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const n = Number(new RegExp(`(?:^|;\\s*)${COOKIE}=(\\d{1,12})`).exec(cookie)?.[1]);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export async function GET(request: Request) {
  if (!countingEnabled()) return NextResponse.json({ enabled: false }, { headers: noStore });
  try {
    return NextResponse.json(
      { enabled: true, ...(await readCounts()), you: visitorNumber(request) },
      { headers: noStore },
    );
  } catch (error) {
    console.error("[visits] read failed", error);
    return NextResponse.json({ enabled: false }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  if (!countingEnabled()) return NextResponse.json({ enabled: false }, { headers: noStore });

  const ua = request.headers.get("user-agent") ?? "";
  const you = visitorNumber(request);

  try {
    // Bots see the counts but never change them.
    if (BOT.test(ua)) {
      return NextResponse.json(
        { enabled: true, ...(await readCounts()), you },
        { headers: noStore },
      );
    }

    if (you) {
      return NextResponse.json(
        { enabled: true, ...(await recordView()), you },
        { headers: noStore },
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (tooManyNew(ip)) {
      return NextResponse.json(
        { enabled: true, ...(await readCounts()), you: null },
        { headers: noStore },
      );
    }

    const counts = await recordNewVisitor();
    const res = NextResponse.json(
      { enabled: true, ...counts, you: counts.visitors },
      { headers: noStore },
    );
    res.cookies.set(COOKIE, String(counts.visitors), {
      maxAge: ONE_YEAR,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("[visits] count failed", error);
    return NextResponse.json({ enabled: false }, { status: 503, headers: noStore });
  }
}
