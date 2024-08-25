import util from "util";
import { createGithubDataPuller } from "./githubDataPuller";
import {
  ContributionStats,
  GithubCommitHistory,
  GithubUserContributionStats,
  SearchCommit,
} from "./models";

export { fetchGithubContributions };
export type { GithubUserContributionStats, GithubRankingConfig };

function rankContributors(
  commits: GithubCommitHistory[],
  config: GithubRankingConfig
): GithubUserContributionStats[] {
  return commits
    .map((commits) => computeChanges(commits, config))
    .sort((a, b) => b.overall.additions - a.overall.additions);
}

async function fetchGithubContributions(
  config: {
    org: string;
    afterYear: number;
    accessToken: string;
  } & GithubRankingConfig
) {
  const { ensureSearchCommits, ensureOrgUsers } =
    createGithubDataPuller(config);

  const authors = await ensureOrgUsers({ org: config.org });

  const commitHistories: GithubCommitHistory[] = await Promise.all(
    authors.map(
      async (author) =>
        await ensureSearchCommits({
          org: config.org,
          author,
          afterYear: config.afterYear,
        })
    )
  );

  const contributors = rankContributors(commitHistories, config);

  console.log(JSON.stringify(contributors.map(toDisplay), null, "    "));
}

function toDisplay(v: GithubUserContributionStats) {
  return {
    id: v.author.id,
    overall: v.overall,
    repos: v.repos,
    notes: v.notes,
    githubUrl: `https://github.com/${v.author.id}`,
  };
}

interface GithubRankingConfig {
  getShouldIgnoreCommit: (commit: SearchCommit) => boolean;
  getShouldIgnoreFile: (fileName: string) => boolean;
  getShouldFlagCommitAsSuspect: ({
    totalAdditions,
  }: {
    totalAdditions: number;
  }) => boolean;
}
function computeChanges(
  commitHistory: GithubCommitHistory,
  config: GithubRankingConfig
): GithubUserContributionStats {
  const overallStats = { commits: 0, additions: 0, deletions: 0 };
  const repoIdToStats: Record<string, ContributionStats> = {};

  // Filter out ignored commits and files
  const filteredCommits = commitHistory.commits
    .filter((v) => !config.getShouldIgnoreCommit(v))
    .map((v) => ({
      ...v,
      files: v.files.filter(
        ({ fileName }) => !config.getShouldIgnoreFile(fileName)
      ),
    }));

  for (const commit of filteredCommits) {
    let totalAdditions = 0;
    overallStats.commits += 1;
    const repoStats = (repoIdToStats[commit.repo] = repoIdToStats[
      commit.repo
    ] || {
      commits: 0,
      additions: 0,
      deletions: 0,
    });
    repoStats.commits += 1;
    for (const file of commit.files) {
      totalAdditions += file.additions;

      overallStats.additions += file.additions;
      overallStats.deletions += file.deletions;

      repoStats.additions += file.additions;
      repoStats.deletions += file.deletions;
    }
    if (config.getShouldFlagCommitAsSuspect({ totalAdditions })) {
      console.log(
        "Suspect:",
        commit.sha,
        "Additions:",
        totalAdditions,
        commitHistory.author.id,
        commit.repo
      );
    }
  }

  return {
    author: commitHistory.author,
    overall: overallStats,
    repos: Object.entries(repoIdToStats)
      .map(([repo, stats]) => ({ name: repo, ...stats }))
      .sort((a, b) => b.additions - a.additions),
    notes: commitHistory.author.notes,
  };
}
