"use client";

/**
 * Last-resort boundary — catches failures in the root layout itself, so it must
 * render its own <html> and cannot rely on any provider or global stylesheet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#111318",
          color: "#f5f6f8",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 0.75rem" }}>
            Application error
          </h1>
          <p
            style={{ color: "#9aa0ad", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.75rem" }}
          >
            The application failed to load. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#8B5CF6",
              color: "#111318",
              border: "none",
              borderRadius: 999,
              padding: "0.7rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error.digest && (
            <p style={{ color: "#6f7583", fontSize: "0.7rem", marginTop: "1.5rem" }}>
              {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
