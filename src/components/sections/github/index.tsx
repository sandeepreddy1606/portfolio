import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { getGithubStats } from "@/lib/github";
import { getLeetcodeStats } from "@/lib/leetcode";
import { GithubFallback, GithubSkeleton, GithubView } from "./github-view";
import { FitCheck } from "@/components/proof/fit-check";
import { AchievementList, CertificationCards } from "@/components/sections/achievements";
import { LeetcodeFallback, LeetcodeSkeleton, LeetcodeView } from "./leetcode-view";

/** Server components — neither fetch reaches the client bundle. */
async function GithubData() {
  const stats = await getGithubStats();
  if (!stats) return <GithubFallback />;
  return <GithubView stats={stats} />;
}

async function LeetcodeData() {
  const stats = await getLeetcodeStats();
  if (!stats) return <LeetcodeFallback />;
  return <LeetcodeView stats={stats} />;
}

/**
 * Proof — the part of the page a sceptical reader checks. The fit check comes
 * first because it answers the recruiter's real question; the live panels and
 * achievements are the evidence behind it.
 */
export function ProofSection() {
  return (
    <Section id="proof" className="enamel">
      <div className="container-page">
        <SectionHeading
          title="Check the claims"
          description="Paste a job description to see which requirements have evidence here. Below it: GitHub and LeetCode, pulled live and refreshed hourly, and the achievements behind them."
        />

        <div className="mt-14 max-w-3xl">
          <FitCheck />
        </div>

        {/* Independent Suspense boundaries: a slow or failing LeetCode
            request must not hold back the GitHub panel, or vice versa. */}
        <div className="mt-16 flex flex-col gap-6">
          <Suspense fallback={<GithubSkeleton />}>
            <GithubData />
          </Suspense>

          <Suspense fallback={<LeetcodeSkeleton />}>
            <LeetcodeData />
          </Suspense>
        </div>

        <h3 className="mt-20 text-4xl font-extrabold uppercase">Certifications</h3>
        <p className="text-ink-muted mt-3 max-w-[60ch] text-[15px]">
          Each one links to where it can be checked.
        </p>
        <CertificationCards className="mt-8" />

        <h3 className="mt-20 text-4xl font-extrabold uppercase">Achievements</h3>
        <AchievementList className="mt-8" />
      </div>
    </Section>
  );
}
