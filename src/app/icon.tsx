import { ImageResponse } from "next/og";
import { SITE } from "@/constants/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated favicon — keeps the monogram in one place with the rest of the brand. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
        borderRadius: 14,
        color: "#111318",
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: -1,
      }}
    >
      {SITE.initials}
    </div>,
    size,
  );
}
