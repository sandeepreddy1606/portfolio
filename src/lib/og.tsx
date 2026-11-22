import { ImageResponse } from "next/og";
import type { FlowNode } from "@/constants/case-studies";

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#0f1b26";
const TEXT = "#e8eef1";
const MUTED = "#a6b6c2";
const LINE = "rgba(160,190,210,0.22)";
const SIGNAL = "#f0b44c";
const VERIFY = "#62cbb1";

/**
 * One share-card layout for every page, in the site's drafting palette:
 * a grid, a condensed headline, and — for case studies — the flow itself.
 */
export function ogCard({
  kicker,
  title,
  subtitle,
  flow,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  flow?: FlowNode[];
}) {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        padding: 72,
        fontFamily: "sans-serif",
        color: TEXT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: MUTED }}>
        <div style={{ width: 36, height: 3, background: SIGNAL }} />
        {kicker}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 0.95 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, color: MUTED, maxWidth: 980, lineHeight: 1.35 }}>
          {subtitle}
        </div>
      </div>

      {flow ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {flow.map((n, i) => (
            <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  border: `2px solid ${n.kind === "guard" ? VERIFY : n.kind === "action" ? SIGNAL : LINE}`,
                  color: n.kind === "guard" ? VERIFY : n.kind === "action" ? SIGNAL : TEXT,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 20,
                }}
              >
                {n.label}
              </div>
              {i < flow.length - 1 && <div style={{ color: MUTED, fontSize: 22 }}>→</div>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", fontSize: 22, color: MUTED }}>
          Next.js · FastAPI · NestJS · Spring Boot · LLM applications
        </div>
      )}
    </div>,
    OG_SIZE,
  );
}
