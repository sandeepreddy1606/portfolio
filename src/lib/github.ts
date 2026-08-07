import "server-only";
import { SITE } from "@/constants/site";
import type { GithubStats } from "@/types";

const API = "https://api.github.com";

type GhUser = {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GhRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  size: number;
};

function headers(): HeadersInit {
  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional — lifts the anonymous rate limit from 60/hr to 5000/hr.
  return process.env.GITHUB_TOKEN
    ? { ...base, Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : base;
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: headers(),
      // Revalidate hourly: fresh enough for a profile, cheap on the rate limit.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Aggregated GitHub profile stats. Returns null on any failure so the section
 * can degrade to its static fallback instead of failing the whole render.
 */
export async function getGithubStats(): Promise<GithubStats | null> {
  const [user, repos] = await Promise.all([
    gh<GhUser>(`/users/${SITE.githubUsername}`),
    gh<GhRepo[]>(`/users/${SITE.githubUsername}/repos?per_page=100&sort=pushed`),
  ]);

  if (!user || !repos) return null;

  const owned = repos.filter((r) => !r.fork);

  // Approximate language share by repo size — the per-repo /languages endpoint
  // would cost one request per repository.
  const byLanguage = new Map<string, number>();
  for (const repo of owned) {
    if (!repo.language) continue;
    byLanguage.set(repo.language, (byLanguage.get(repo.language) ?? 0) + repo.size);
  }
  const totalBytes = [...byLanguage.values()].reduce((a, b) => a + b, 0) || 1;

  const languages = [...byLanguage.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    }));

  return {
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    totalStars: owned.reduce((sum, r) => sum + r.stargazers_count, 0),
    memberSince: user.created_at,
    languages,
    repos: owned
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        updatedAt: r.pushed_at,
      })),
  };
}
