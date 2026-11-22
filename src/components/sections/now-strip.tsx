import Link from "next/link";
import { SITE } from "@/constants/site";
import { getGithubStats } from "@/lib/github";
import { getLeetcodeStats } from "@/lib/leetcode";

/**
 * "Now" — what is true this hour, pulled live from GitHub and LeetCode and
 * revalidated hourly through the fetch cache. Each row degrades on its own:
 * a failed API simply drops its line.
 */

function relative(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

export async function NowStrip() {
  const [github, leetcode] = await Promise.all([getGithubStats(), getLeetcodeStats()]);
  const latest = github?.repos[0];

  return (
    <dl className="grid min-w-0 gap-3 text-sm">
      <Row label="Building">
        <Link href="/work/velobite" className="text-ink hover:text-accent transition-colors">
          Velobite
        </Link>
      </Row>
      {latest && (
        <Row label="Last push">
          <a
            href={latest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-accent font-mono text-[13px] break-all transition-colors"
          >
            {latest.name}
          </a>
          <span className="text-ink-subtle">, {relative(latest.updatedAt)}</span>
        </Row>
      )}
      {leetcode && (
        <Row label="LeetCode">
          <a
            href={`https://leetcode.com/u/${SITE.leetcodeUsername}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-accent transition-colors"
          >
            {leetcode.solved.total} solved
          </a>
        </Row>
      )}
      <Row label="Status">
        <span className="text-ink inline-flex items-center gap-2">
          <span className="bg-verify size-1.5 rounded-full" aria-hidden />
          {SITE.availability}
        </span>
      </Row>
    </dl>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-ink-subtle text-xs">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

export function NowStripSkeleton() {
  return (
    <div className="grid w-full gap-3" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-surface-2 h-9 animate-pulse rounded" />
      ))}
    </div>
  );
}
