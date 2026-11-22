import { ArrowUpRight } from "lucide-react";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { SITE } from "@/constants/site";
import type { Achievement } from "@/types";
import { cn } from "@/lib/utils";

const certifications = ACHIEVEMENTS.filter((a) => a.kind === "certification");
const records = ACHIEVEMENTS.filter((a) => a.kind !== "certification");

/** Where a certificate can be checked when it has no direct credential URL. */
const LINKEDIN_CERTS = `https://www.linkedin.com/in/${SITE.linkedinUsername}/details/certifications/`;

/**
 * Issuer seals: a monogram and the issuer's colour, used only for the seal's
 * ring (a non-text mark), so the monogram itself stays in ink for contrast.
 */
const SEAL: Record<string, { mark: string; ring: string }> = {
  Oracle: { mark: "OCI", ring: "#C74634" },
  Microsoft: { mark: "MS", ring: "#0078D4" },
  Coursera: { mark: "C", ring: "#0056D2" },
  "WorldQuant University": { mark: "WQU", ring: "#5b3c99" },
};
const sealFor = (issuer: string) =>
  SEAL[issuer] ?? { mark: issuer.slice(0, 2).toUpperCase(), ring: "#7d5f2c" };

/**
 * Certifications as certificates of competency — the papers a signalman holds
 * to work a box. Each card carries the issuer's seal, the credential, what it
 * covers, and where to verify it.
 */
export function CertificationCards({ className }: { className?: string }) {
  if (certifications.length === 0) return null;

  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {certifications.map((c) => (
        <li key={c.id}>
          <CertificateCard cert={c} />
        </li>
      ))}
    </ul>
  );
}

function CertificateCard({ cert }: { cert: Achievement }) {
  const seal = sealFor(cert.issuer);
  const verifyHref = cert.href ?? LINKEDIN_CERTS;

  return (
    <article className="group border-line-strong bg-elevated hover:border-brass relative flex h-full flex-col rounded-[14px] border p-6 shadow-[0_16px_30px_-24px_rgb(0_0_0/0.6)] transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_22px_36px_-24px_rgb(0_0_0/0.65)]">
      <div className="flex items-start justify-between gap-4">
        {/* The issuer's seal, stamped slightly off-square; it settles on hover. */}
        <span
          aria-hidden
          className="grid size-16 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-0"
          style={{ borderColor: seal.ring }}
        >
          <span
            className="grid size-[3.1rem] place-items-center rounded-full border border-dashed"
            style={{ borderColor: seal.ring }}
          >
            <span className="font-display text-ink text-lg leading-none font-extrabold">
              {seal.mark}
            </span>
          </span>
        </span>
        <span className="border-line-strong text-ink-subtle rounded-sm border px-2 py-0.5 font-mono text-xs tabular-nums">
          {cert.date || "Certified"}
        </span>
      </div>

      <h4 className="mt-5 font-sans text-[1.0625rem] leading-snug font-bold tracking-normal normal-case">
        {cert.title}
      </h4>
      <p className="text-brass mt-1 text-sm font-semibold">{cert.issuer}</p>
      <p className="text-ink-muted mt-3 flex-1 text-[15px] leading-relaxed">{cert.description}</p>

      <a
        href={verifyHref}
        target="_blank"
        rel="noopener noreferrer"
        className="border-line text-ink hover:text-accent mt-5 inline-flex items-center gap-1.5 border-t pt-4 text-sm font-bold transition-colors"
        aria-label={`Verify ${cert.title}${cert.href ? "" : " on LinkedIn"}`}
      >
        {cert.href ? "Verify credential" : "View on LinkedIn"}
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
    </article>
  );
}

/**
 * Awards, ranks and programmes as a register: one ruled line each, dated,
 * with the issuer and a link to the evidence where one exists.
 */
export function AchievementList({ className }: { className?: string }) {
  if (records.length === 0) return null;

  return (
    <ul className={cn("border-line-strong border-t", className)}>
      {records.map((item) => (
        <li
          key={item.id}
          className="border-line grid gap-2 border-b py-6 md:grid-cols-[9rem_minmax(0,4fr)_minmax(0,6fr)] md:gap-8"
        >
          <p className="text-ink-subtle font-mono text-sm tabular-nums">{item.date}</p>
          <div>
            <h4 className="font-sans text-lg leading-snug font-bold tracking-normal normal-case">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent inline-flex items-start gap-1 transition-colors"
                >
                  {item.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-60" aria-hidden />
                </a>
              ) : (
                item.title
              )}
            </h4>
            <p className="text-brass mt-1 text-sm font-semibold">{item.issuer}</p>
          </div>
          <p className="text-ink-muted text-[15px] leading-relaxed">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
