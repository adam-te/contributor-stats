import { setGlobalDispatcher, Agent } from "undici";
import type {
  CommitResponse,
  CommitSpecifics,
  GithubMember,
  GithubUser,
  RawCommitStats,
  RawGithubUser,
  Repo,
  SearchCommit,
} from "./models";

// Allow longer timeouts to github API
setGlobalDispatcher(new Agent({ connect: { timeout: 30_000 } }));

export function createGithubApi({ accessToken }: { accessToken: string }) {
  return {
    fetchAllReposForOrg,
    fetchRawCommitStats,
    fetchOrgMembers,
    fetchUser,
    fetchCommits,
  };

  async function fetchOrgMembers({
    org,
  }: {
    org: string;
  }): Promise<GithubMember[]> {
    const members = await fetchGithubPages<GithubMember>(
      `https://api.github.com/orgs/${org}/members?per_page=100`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    console.log(`Found ${members.length} members in ${org}`);
    return members;
  }

  async function fetchGithub<T>(url: string, options: RequestInit): Promise<T> {
    return (await fetchGithubRaw(url, options)).json();
  }

  async function fetchGithubPages<T, A = T[]>(
    url: string,
    options: RequestInit & {
      aggregate?: {
        initialValue?: A;
        reduce: (aggValue: A, value: T) => A;
      };
    }
  ): Promise<A> {
    const reduce = options.aggregate ? options.aggregate.reduce : defaultReduce;
    // @ts-ignore
    let aggregatedValue: A = options.aggregate
      ? options.aggregate.initialValue
      : ([] as A);

    while (true) {
      const response = await fetchGithubRaw<T[]>(url, options);
      process.stdout.write(".");
      const items = await response.json();

      aggregatedValue = reduce(aggregatedValue, items);

      const linkHeader = response.headers.get("Link");
      const nextLink = linkHeader?.match(/<(.*?)>; rel="next"/);
      if (!nextLink) {
        break;
      }
      url = nextLink[1];
    }
    return aggregatedValue;

    function defaultReduce(aggregatedValue: A, values: T[]): A {
      // @ts-ignore
      aggregatedValue.push(...values);
      return aggregatedValue;
    }
  }

  async function fetchAllReposForOrg({
    org,
  }: {
    org: string;
  }): Promise<Repo[]> {
    const repos = await fetchGithubPages<Repo>(
      `https://api.github.com/orgs/${org}/repos?per_page=100`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    console.log(`Found ${repos.length} repositories in ${org}`);
    return repos;
  }

  async function fetchRawCommitStats({
    owner,
    repo,
    commitSha,
  }: {
    owner: string;
    repo: string;
    commitSha: string;
  }): Promise<RawCommitStats[]> {
    try {
      const v = await fetchGithub<CommitSpecifics>(
        `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
        {
          method: "GET",
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      return v.files.map((v) => ({
        fileName: v.filename,
        additions: v.additions,
        deletions: v.deletions,
        changes: v.changes,
      }));
    } catch (e) {
      // Return empty if 404
      return [];
    }
  }

  async function fetchGithubRaw<T>(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const response = await fetch(url, options);
    if (!response.ok) {
      await handleRateLimiting(response);
      return fetchGithubRaw(url, options); // Retry the request after handling rate limiting
    }
    return response;
  }

  async function fetchUser({
    userName,
  }: {
    userName: string;
  }): Promise<GithubUser> {
    const user = await fetchGithub<RawGithubUser>(
      `https://api.github.com/users/${userName}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    // @ts-ignore
    const githubUser: GithubUser = {
      id: user.login,
    };

    if (user.name != null) {
      githubUser.name = user.name;
    }
    if (user.email) {
      githubUser.email = user.email;
    }

    githubUser.createdAt = user.created_at;

    return githubUser;
  }

  async function handleRateLimiting(response: Response): Promise<void> {
    console.log(
      "Rate Limit:",
      // @ts-ignore
      parseInt(response.headers.get("X-RateLimit-Remaining"))
    );
    if (
      response.status === 403 &&
      // @ts-ignore
      parseInt(response.headers.get("X-RateLimit-Remaining")) <= 100
    ) {
      const resetTime = parseInt(
        response.headers.get("X-RateLimit-Reset") || "0"
      );
      const currentTime = Math.floor(Date.now() / 1000);
      const delaySeconds = resetTime - currentTime + 2; // Add time to ensure the limit has been reset
      process.stdout.write(`x(waiting for ${delaySeconds}s)`);
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  }

  async function fetchCommits({
    userName,
    authorEmail,
    dates,
  }: {
    userName: string;
    authorEmail?: string;
    dates: {
      start: string;
      end: string;
    };
  }): Promise<SearchCommit[]> {
    return await fetchGithubPages<
      {
        total_count: number;
        incomplete_results: boolean;
        items: CommitResponse[];
      },
      SearchCommit[]
    >(
      `https://api.github.com/search/commits?q=org:thousandeyes+${
        authorEmail ? `author-email:${authorEmail}` : `author:${userName}`
      }+author-date:${dates.start}..${
        dates.end
      }+sort:author-date-desc+-merge:true&per_page=100`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
        aggregate: {
          initialValue: [],
          reduce: (aggValue, nextValue) => {
            aggValue.push(
              ...nextValue.items.map((v) => ({
                sha: v.sha,
                date: v.commit.author.date,
                title: v.commit.message.split("\n")[0],
                repo: v.repository.name,
                files: [],
              }))
            );
            return aggValue;
          },
        },
      }
    );
  }
}
