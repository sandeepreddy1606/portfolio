import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { getGithubStats } from "@/lib/github";
import { getLeetcodeStats } from "@/lib/leetcode";
import { GithubFallback, GithubSkeleton, GithubView } from "./github-view";
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

export function ActivitySection() {
  return (
    <Section id="activity" className="bg-surface/20 border-line border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Activity"
          title="What I'm building, and what I'm practising."
          description="Both panels are pulled live — GitHub for shipped work, LeetCode for the algorithm reps behind it — and revalidated hourly. This is the profile as it stands right now, not as it stood at deploy time."
        />

        {/* Two independent Suspense boundaries: a slow or failing LeetCode
            request must not hold back the GitHub panel, or vice versa. */}
        <div className="mt-14 flex flex-col gap-6">
          <Suspense fallback={<GithubSkeleton />}>
            <GithubData />
          </Suspense>

          <Suspense fallback={<LeetcodeSkeleton />}>
            <LeetcodeData />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}
