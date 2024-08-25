import path from "path";
import { createGithubApi } from "./githubApi";
import { ensureData } from "./utils";
import { fileURLToPath } from "url";

import type { GithubUser, GithubCommitHistory, SearchCommit } from "./models";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createGithubDataPuller({
  accessToken,
  getShouldIgnoreCommit = () => false,
}: {
  accessToken: string;
  getShouldIgnoreCommit?: (commit: SearchCommit) => boolean;
}) {
  const { fetchCommits, fetchOrgMembers, fetchRawCommitStats, fetchUser } =
    createGithubApi({ accessToken });

  return {
    ensureOrgUsers,
    ensureSearchCommits,
  };

  async function ensureSearchCommits({
    org,
    author,
    afterYear,
  }: {
    org: string;
    author: GithubUser;
    afterYear: number;
  }): Promise<GithubCommitHistory> {
    console.log(`Commits({ username: "${author.id}" }):`);

    const results = await ensureData<{
      author: string;
      commits: SearchCommit[];
    }>({
      filePath: `${__dirname}/data/authors/${author.id}/commits.json`,
      getFreshData: async () => {
        // NOTE: Done this way to avoid the 1,000 limit in results for github search.
        // TODO: Warn if any githubUser has >1,000 commits in a quarter
        const quarters = getQuarterRanges(afterYear).reverse();

        const usernameCommits: SearchCommit[] = [];
        const emailCommits: SearchCommit[] = [];

        // Fetch commit for each calendar quarter and concatenate
        for (const quarter of quarters) {
          const quarterCommits = await fetchCommits({
            userName: author.id,
            dates: quarter,
          });
          usernameCommits.push(...quarterCommits);

          if (author.email) {
            const quarterEmailCommits = await fetchCommits({
              userName: author.id,
              authorEmail: author.email,
              dates: quarter,
            });
            emailCommits.push(...quarterEmailCommits);
          }
        }

        const seenCommitIds = new Set();
        const commits = usernameCommits
          .concat(emailCommits)
          .filter((v) => {
            const hasBeenSeen = seenCommitIds.has(v.sha);
            seenCommitIds.add(v.sha);
            return !hasBeenSeen;
          })
          .filter((v) => !getShouldIgnoreCommit(v));

        for (const commit of commits) {
          commit.files = await fetchRawCommitStats({
            owner: org,
            repo: commit.repo,
            commitSha: commit.sha,
          });

          console.log(`${commit.sha} Files Changed: ${commit.files.length}`);
        }

        return {
          author: author.id,
          commits,
        };
      },
    });

    console.log(
      `\nFound ${results.commits.length} commits for author ${results.author}\n`
    );

    return {
      ...results,
      author,
    };
  }

  async function ensureOrgUsers({
    org,
  }: {
    org: string;
  }): Promise<GithubUser[]> {
    console.log(`Users({ org: "${org}" }):`);
    const users = await ensureData<GithubUser[]>({
      filePath: `${__dirname}/data/orgs/${org}/users.json`,
      getFreshData: async () => {
        const members = await fetchOrgMembers({ org });
        return Promise.all(
          members.map(async (v) => await fetchUser({ userName: v.login }))
        );
      },
    });

    console.log(`\nFound ${users.length} users in org ${org}\n`);
    return users;
  }
}

function getQuarterRanges(startYear: number) {
  const currentYear = new Date().getFullYear();
  const allQuarterRanges: { start: string; end: string }[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    allQuarterRanges.push(
      { start: `${year}-01-01`, end: `${year}-03-31` }, // Q1
      { start: `${year}-04-01`, end: `${year}-06-30` }, // Q2
      { start: `${year}-07-01`, end: `${year}-09-30` }, // Q3
      { start: `${year}-10-01`, end: `${year}-12-31` } // Q4
    );
  }

  return allQuarterRanges;
}
