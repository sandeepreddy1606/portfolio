import "server-only";
import { SITE } from "@/constants/site";
import type { LeetcodeStats } from "@/types";

const ENDPOINT = "https://leetcode.com/graphql/";

const QUERY = /* GraphQL */ `
  query profile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        school
        countryName
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
      tagProblemCounts {
        advanced {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
      }
      badges {
        displayName
        icon
        creationDate
      }
    }
  }
`;

type RawResponse = {
  data?: {
    matchedUser: {
      username: string;
      profile: { realName: string | null; ranking: number; school: string | null };
      submitStatsGlobal: { acSubmissionNum: { difficulty: string; count: number }[] };
      userCalendar: { streak: number; totalActiveDays: number };
      languageProblemCount: { languageName: string; problemsSolved: number }[];
      tagProblemCounts: {
        advanced: { tagName: string; problemsSolved: number }[];
        intermediate: { tagName: string; problemsSolved: number }[];
      };
      badges: { displayName: string; icon: string; creationDate: string }[];
    } | null;
  };
};

const countFor = (buckets: { difficulty: string; count: number }[], difficulty: string): number =>
  buckets.find((b) => b.difficulty === difficulty)?.count ?? 0;

/**
 * LeetCode profile stats via the public GraphQL endpoint.
 *
 * LeetCode rejects requests without a browser-like User-Agent and Referer, so
 * both are set explicitly. Returns null on any failure — the section degrades
 * to a static fallback rather than taking the page down.
 */
export async function getLeetcodeStats(): Promise<LeetcodeStats | null> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/u/${SITE.leetcodeUsername}/`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: SITE.leetcodeUsername } }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as RawResponse;
    const user = payload.data?.matchedUser;
    if (!user) return null;

    const buckets = user.submitStatsGlobal.acSubmissionNum;

    // Merge both difficulty tiers, then keep the topics with real depth behind them.
    const topics = [...user.tagProblemCounts.advanced, ...user.tagProblemCounts.intermediate]
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 8)
      .map((tag) => ({ name: tag.tagName, solved: tag.problemsSolved }));

    return {
      username: user.username,
      profileUrl: `https://leetcode.com/u/${user.username}/`,
      ranking: user.profile.ranking,
      school: user.profile.school,
      solved: {
        total: countFor(buckets, "All"),
        easy: countFor(buckets, "Easy"),
        medium: countFor(buckets, "Medium"),
        hard: countFor(buckets, "Hard"),
      },
      streak: user.userCalendar.streak,
      activeDays: user.userCalendar.totalActiveDays,
      languages: user.languageProblemCount
        .filter((language) => language.problemsSolved > 0)
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .map((language) => ({ name: language.languageName, solved: language.problemsSolved })),
      topics,
      badges: user.badges.map((badge) => ({
        name: badge.displayName,
        icon: badge.icon,
        date: badge.creationDate,
      })),
    };
  } catch {
    return null;
  }
}
