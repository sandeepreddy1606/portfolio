import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { SITE } from "@/constants/site";

/** In-memory sliding window. Enough for a single-instance personal site. */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages in a short window. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 422 },
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped — accept silently so the bot learns nothing.
  if (website) return NextResponse.json({ ok: true });

  if (!process.env.RESEND_API_KEY) {
    // Fail loudly in development, gracefully in production.
    console.error("RESEND_API_KEY is not set — contact form cannot deliver mail.");
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please email me directly." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? SITE.email,
      replyTo: email,
      // No line breaks in a header value.
      subject: `[Portfolio] ${subject.replace(/[\r\n]+/g, " ")}`,
      text: `${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:600px;line-height:1.6">
          <h2 style="margin:0 0 4px;font-size:18px">${escapeHtml(subject)}</h2>
          <p style="margin:0 0 20px;color:#666;font-size:13px">
            From ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;
          </p>
          <div style="white-space:pre-wrap;border-left:3px solid #6366f1;padding-left:16px">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return NextResponse.json(
        { error: "The mail provider rejected the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form failed:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
