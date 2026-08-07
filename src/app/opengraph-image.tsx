import { ImageResponse } from "next/og";
import { SITE } from "@/constants/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated at the edge — no static OG asset to keep in sync with the copy. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#111318",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -220,
          left: -160,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(139,92,246,0.42), rgba(17,19,24,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -260,
          right: -140,
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(34,211,238,0.32), rgba(17,19,24,0) 65%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#111318",
          }}
        >
          {SITE.initials}
        </div>
        <div style={{ fontSize: 22, color: "#9aa0ad", letterSpacing: 4 }}>
          {SITE.location.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            color: "#f5f6f8",
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {SITE.name}
        </div>
        <div style={{ fontSize: 38, color: "#8B5CF6", fontWeight: 600, letterSpacing: -1 }}>
          {SITE.role}
        </div>
        <div style={{ fontSize: 26, color: "#9aa0ad", maxWidth: 900, lineHeight: 1.45 }}>
          {SITE.tagline}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, fontSize: 20, color: "#6f7583" }}>
        {["Next.js", "TypeScript", "FastAPI", "NestJS", "Flutter", "LLM Apps"].map((tag) => (
          <div
            key={tag}
            style={{
              border: "1px solid #2a2e38",
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
